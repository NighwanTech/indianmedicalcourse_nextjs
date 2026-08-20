import { 
  CRMConfiguration, 
  CRMEventType, 
  CRMFieldMapping, 
  CRMSyncResult, 
  DEFAULT_CRM_CONFIG 
} from "./types";

export const CRM_CONFIG_STORAGE_KEY = "imc_crm_integration_config";

export class CRMService {
  private configCache: CRMConfiguration | null = null;

  /**
   * Retrieves active CRM Configuration (from localStorage or environment fallback)
   */
  public getConfig(): CRMConfiguration {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(CRM_CONFIG_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          return {
            ...DEFAULT_CRM_CONFIG,
            ...parsed,
          };
        }
      } catch (e) {}
    }

    // Server-side fallback or defaults
    const envUrl = process.env.AIWCRM_API_URL || process.env.CRM_API_URL;
    const envKey = process.env.AIWCRM_API_KEY || process.env.CRM_API_KEY;

    return {
      ...DEFAULT_CRM_CONFIG,
      apiBaseUrl: envUrl || DEFAULT_CRM_CONFIG.apiBaseUrl,
      apiKey: envKey || DEFAULT_CRM_CONFIG.apiKey,
    };
  }

  /**
   * Saves updated CRM configuration
   */
  public saveConfig(newConfig: CRMConfiguration): void {
    newConfig.updatedAt = new Date().toISOString();
    this.configCache = newConfig;
    if (typeof window !== "undefined") {
      localStorage.setItem(CRM_CONFIG_STORAGE_KEY, JSON.stringify(newConfig));
      window.dispatchEvent(new Event("storage"));
    }
  }

  /**
   * Transforms raw lead object into target CRM payload using dynamic field mappings
   */
  public transformPayload(
    rawLead: Record<string, any>, 
    mappings: CRMFieldMapping[],
    eventType: CRMEventType = "LEAD_CREATED"
  ): Record<string, any> {
    const payload: Record<string, any> = {
      event_type: eventType,
      source_portal: "Indian Medical Course",
      timestamp: new Date().toISOString(),
    };

    // Apply active field mappings
    mappings.forEach((mapping) => {
      if (!mapping.isEnabled) return;

      const websiteVal = rawLead[mapping.websiteField];
      if (websiteVal !== undefined && websiteVal !== null && websiteVal !== "") {
        if (mapping.fieldType === "number") {
          payload[mapping.crmField] = Number(websiteVal) || 0;
        } else if (mapping.fieldType === "boolean") {
          payload[mapping.crmField] = Boolean(websiteVal);
        } else {
          payload[mapping.crmField] = String(websiteVal);
        }
      } else if (mapping.defaultValue !== undefined) {
        payload[mapping.crmField] = mapping.defaultValue;
      }
    });

    return payload;
  }

  /**
   * Dispatches payload to external CRM provider with timeout protection
   */
  public async dispatchToCRM(
    eventType: CRMEventType,
    rawLead: Record<string, any>
  ): Promise<CRMSyncResult> {
    const config = this.getConfig();

    // 1. Check if CRM Integration is enabled
    if (!config.enabled || config.provider === "DISABLED") {
      return {
        success: true,
        crmLeadId: "CRM_DISABLED",
        timestamp: new Date().toISOString(),
      };
    }

    // 2. Check if specific event is enabled
    const eventConfig = config.events.find((e) => e.eventType === eventType);
    if (eventConfig && !eventConfig.isEnabled) {
      console.log(`[CRM Integration] Event ${eventType} is disabled in settings. Skipping dispatch.`);
      return {
        success: true,
        crmLeadId: `SKIPPED_${eventType}`,
        timestamp: new Date().toISOString(),
      };
    }

    // 3. Transform payload via Dynamic Field Mappings
    const transformed = this.transformPayload(rawLead, config.fieldMappings, eventType);

    // 4. Determine Target URL & Headers
    let targetUrl = config.apiBaseUrl;
    if (config.provider === "WEBHOOK" && config.webhookUrl) {
      targetUrl = config.webhookUrl;
    }

    if (!targetUrl || !targetUrl.startsWith("http")) {
      console.log(`[CRM Simulated Sync] No remote URL configured. Dispatched simulated payload:`, transformed);
      return {
        success: true,
        crmLeadId: `SIMULATED_${Date.now()}`,
        timestamp: new Date().toISOString(),
        statusCode: 200,
      };
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...(config.customHeaders || {}),
    };

    // Authentication Header Configuration
    if (config.authHeaderType === "Bearer" && config.apiKey) {
      headers["Authorization"] = `Bearer ${config.apiKey}`;
    } else if (config.authHeaderType === "x-api-key" && config.apiKey) {
      headers["x-api-key"] = config.apiKey;
    } else if (config.authHeaderType === "Basic" && config.username) {
      const creds = Buffer.from(`${config.username}:${config.password || ""}`).toString("base64");
      headers["Authorization"] = `Basic ${creds}`;
    }

    const timeout = config.timeoutMs || 5000;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    try {
      if (config.enableLogging) {
        console.log(`[CRM Dispatch] Posting ${eventType} to ${targetUrl}:`, transformed);
      }

      const response = await fetch(targetUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(transformed),
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (response.ok) {
        const data = await response.json().catch(() => ({}));
        const crmId = data.lead_id || data.id || data.data?.id || `CRM_${Date.now()}`;
        if (config.enableLogging) {
          console.log(`[CRM Sync Success] Event ${eventType} synced with CRM. Remote ID: ${crmId}`);
        }
        return {
          success: true,
          crmLeadId: String(crmId),
          statusCode: response.status,
          timestamp: new Date().toISOString(),
        };
      } else {
        const errorBody = await response.text().catch(() => "HTTP Error");
        const errMsg = `Endpoint returned HTTP ${response.status}: ${errorBody.substring(0, 300)}`;
        console.warn(`[CRM Sync Error] ${errMsg}`);
        return {
          success: false,
          error: errMsg,
          statusCode: response.status,
          timestamp: new Date().toISOString(),
        };
      }
    } catch (err: any) {
      clearTimeout(timer);
      const isTimeout = err.name === "AbortError";
      const errMsg = isTimeout ? `Request timed out after ${timeout}ms` : (err.message || "Network connection failed");
      console.error(`[CRM Connection Error]`, errMsg);
      return {
        success: false,
        error: errMsg,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Diagnostic connection test for Admin Settings
   */
  public async testConnection(customConfig?: Partial<CRMConfiguration>): Promise<{
    success: boolean;
    message: string;
    latencyMs: number;
    statusCode?: number;
  }> {
    const config = { ...this.getConfig(), ...(customConfig || {}) };
    let targetUrl = config.apiBaseUrl;
    if (config.provider === "WEBHOOK" && config.webhookUrl) {
      targetUrl = config.webhookUrl;
    }

    if (!targetUrl || !targetUrl.startsWith("http")) {
      return {
        success: false,
        message: "Please enter a valid HTTP/HTTPS URL.",
        latencyMs: 0,
      };
    }

    const startTime = Date.now();
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (config.authHeaderType === "Bearer" && config.apiKey) {
        headers["Authorization"] = `Bearer ${config.apiKey}`;
      } else if (config.authHeaderType === "x-api-key" && config.apiKey) {
        headers["x-api-key"] = config.apiKey;
      }

      // Ping with diagnostic probe payload
      const testPayload = {
        test_probe: true,
        ping_timestamp: new Date().toISOString(),
        portal: "Indian Medical Course Diagnostic",
      };

      const res = await fetch(targetUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(testPayload),
      });

      const latency = Date.now() - startTime;
      if (res.status < 500) {
        return {
          success: true,
          message: `Connection Verified! Remote CRM responded with HTTP ${res.status} (${latency}ms).`,
          latencyMs: latency,
          statusCode: res.status,
        };
      } else {
        return {
          success: false,
          message: `Endpoint returned server error HTTP ${res.status} (${latency}ms).`,
          latencyMs: latency,
          statusCode: res.status,
        };
      }
    } catch (e: any) {
      return {
        success: false,
        message: `Connection Failed: ${e.message || "Network unreachable"} (${Date.now() - startTime}ms)`,
        latencyMs: Date.now() - startTime,
      };
    }
  }
}

export const crmService = new CRMService();
