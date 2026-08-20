import { CRMEventType, CRMQueueJob } from "./types";
import { crmService } from "./crmService";

export const CRM_QUEUE_STORAGE_KEY = "imc_crm_sync_queue";

// Configured Exponential Backoff Delays (in seconds)
// Attempt 1: 1m (60s), Attempt 2: 5m (300s), Attempt 3: 15m (900s), Attempt 4: 1h (3600s), Attempt 5: 24h (86400s)
export const RETRY_DELAYS_SECONDS = [60, 300, 900, 3600, 86400];

export class CRMQueue {
  private isProcessing: boolean = false;

  public getJobs(): CRMQueueJob[] {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(CRM_QUEUE_STORAGE_KEY);
        if (saved) {
          return JSON.parse(saved);
        }
      } catch (e) {}
    }
    return [];
  }

  private saveJobs(jobs: CRMQueueJob[]): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(CRM_QUEUE_STORAGE_KEY, JSON.stringify(jobs));
      window.dispatchEvent(new Event("storage"));
    }
  }

  /**
   * Enqueues an event into the background queue.
   * Returns immediately so form submissions/user actions are never delayed.
   */
  public enqueue(
    eventType: CRMEventType,
    leadUuid: string,
    rawPayload: Record<string, any>
  ): CRMQueueJob {
    const config = crmService.getConfig();
    const jobId = `crm_job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    
    const transformed = crmService.transformPayload(rawPayload, config.fieldMappings, eventType);

    const newJob: CRMQueueJob = {
      id: jobId,
      eventType,
      leadUuid,
      rawPayload,
      transformedPayload: transformed,
      status: "PENDING",
      attempts: 0,
      maxAttempts: config.maxRetryAttempts || 5,
      createdAt: new Date().toISOString(),
    };

    const currentJobs = this.getJobs();
    // Keep most recent 200 jobs in history
    const updated = [newJob, ...currentJobs.slice(0, 199)];
    this.saveJobs(updated);

    // Trigger non-blocking async worker tick in the background
    setTimeout(() => {
      this.processQueue().catch((err) => console.error("[CRM Queue Worker Error]", err));
    }, 100);

    return newJob;
  }

  /**
   * Processes all pending and ready-to-retry jobs
   */
  public async processQueue(): Promise<void> {
    if (this.isProcessing) return;
    this.isProcessing = true;

    try {
      const jobs = this.getJobs();
      const now = Date.now();

      for (let i = 0; i < jobs.length; i++) {
        const job = jobs[i];

        // Check if job is eligible to run
        const isPending = job.status === "PENDING";
        const isReadyToRetry = 
          job.status === "FAILED" && 
          job.nextRetryAt && 
          new Date(job.nextRetryAt).getTime() <= now;

        if (isPending || isReadyToRetry) {
          job.status = "PROCESSING";
          job.attempts += 1;
          job.lastAttemptAt = new Date().toISOString();
          this.saveJobs(jobs);

          // Dispatch to CRM
          const result = await crmService.dispatchToCRM(job.eventType, job.rawPayload);

          if (result.success) {
            job.status = "SYNCED";
            job.crmLeadId = result.crmLeadId;
            job.syncedAt = result.timestamp;
            job.errorMessage = undefined;
            job.httpStatusCode = result.statusCode || 200;
          } else {
            job.errorMessage = result.error;
            job.httpStatusCode = result.statusCode;

            if (job.attempts < job.maxAttempts) {
              job.status = "FAILED";
              // Calculate next backoff retry time
              const delaySeconds = RETRY_DELAYS_SECONDS[job.attempts - 1] || 86400;
              job.nextRetryAt = new Date(Date.now() + delaySeconds * 1000).toISOString();
            } else {
              job.status = "PERMANENTLY_FAILED";
              job.nextRetryAt = undefined;
            }
          }

          this.saveJobs(jobs);
        }
      }
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Admin 1-Click Manual Retry Action
   */
  public async retryJob(jobId: string): Promise<boolean> {
    const jobs = this.getJobs();
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return false;

    job.status = "PENDING";
    job.nextRetryAt = undefined;
    this.saveJobs(jobs);

    this.processQueue().catch(console.error);
    return true;
  }

  /**
   * Purges completed / synced jobs
   */
  public clearCompletedJobs(): void {
    const jobs = this.getJobs();
    const filtered = jobs.filter((j) => j.status !== "SYNCED");
    this.saveJobs(filtered);
  }

  /**
   * Clears entire queue
   */
  public clearAll(): void {
    this.saveJobs([]);
  }
}

export const crmQueue = new CRMQueue();
