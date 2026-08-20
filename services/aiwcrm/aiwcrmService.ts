export interface AIWCRMLeadPayload {
  leadUuid: string;
  name: string;
  mobile: string;
  email: string;
  qualification: string;
  courseName: string;
  city?: string;
  state?: string;
  country?: string;
  leadSource?: string;
  utmSource?: string;
  utmCampaign?: string;
  utmMedium?: string;
  utmContent?: string;
  utmTerm?: string;
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  fbclid?: string;
  landingPageUrl?: string;
  deviceType?: string;
  browser?: string;
  operatingSystem?: string;
  leadScore: number;
  notes?: string;
  createdAt?: string;
}

export interface AIWCRMSyncResult {
  success: boolean;
  crmLeadId?: string;
  error?: string;
  timestamp: string;
  statusCode?: number;
}

export interface IAIWCRMProvider {
  pushLead(payload: AIWCRMLeadPayload): Promise<AIWCRMSyncResult>;
  testConnection(): Promise<{ connected: boolean; message: string }>;
}

export class UniversalAIWCRMProvider implements IAIWCRMProvider {
  async pushLead(payload: AIWCRMLeadPayload): Promise<AIWCRMSyncResult> {
    const apiUrl = process.env.AIWCRM_API_URL || process.env.AIWCRM_WEBHOOK_URL;
    const apiKey = process.env.AIWCRM_API_KEY;

    const timestamp = new Date().toISOString();

    // 1. If Live AIWCRM Endpoint / Webhook is Configured
    if (apiUrl && apiUrl.startsWith("http")) {
      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(apiKey ? { "Authorization": `Bearer ${apiKey}`, "x-api-key": apiKey } : {}),
          },
          body: JSON.stringify({
            ...payload,
            event: "lead.created",
            portal: "Indian Medical Course",
            synced_at: timestamp,
          }),
        });

        if (response.ok) {
          const resData = await response.json().catch(() => ({}));
          const crmId = resData.lead_id || resData.id || resData.data?.id || `CRM_${Date.now()}`;
          console.log(`[AIWCRM Live Sync Success] Lead ${payload.leadUuid} synced. CRM ID: ${crmId}`);
          return {
            success: true,
            crmLeadId: String(crmId),
            timestamp,
            statusCode: response.status,
          };
        } else {
          const errText = await response.text().catch(() => "Unknown HTTP error");
          console.warn(`[AIWCRM Live Sync Warning] Endpoint returned HTTP ${response.status}: ${errText}`);
          return {
            success: false,
            error: `HTTP ${response.status}: ${errText.substring(0, 200)}`,
            timestamp,
            statusCode: response.status,
          };
        }
      } catch (err: any) {
        console.error("[AIWCRM Connection Error]", err.message);
        return {
          success: false,
          error: err.message || "Network timeout or connection refused",
          timestamp,
        };
      }
    }

    // 2. Mock / Local Development Mode
    console.log("[AIWCRM Simulated Sync] Lead dispatched to AIWCRM pipeline:", {
      timestamp,
      leadUuid: payload.leadUuid,
      doctor: payload.name,
      course: payload.courseName,
      phone: payload.mobile,
      source: payload.leadSource || "Website Form",
    });

    const mockCrmLeadId = `CRM_IMC_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    return {
      success: true,
      crmLeadId: mockCrmLeadId,
      timestamp,
      statusCode: 200,
    };
  }

  async testConnection(): Promise<{ connected: boolean; message: string }> {
    const apiUrl = process.env.AIWCRM_API_URL || process.env.AIWCRM_WEBHOOK_URL;
    if (!apiUrl) {
      return {
        connected: false,
        message: "No AIWCRM_API_URL or webhook configured in environment settings.",
      };
    }
    try {
      const res = await fetch(apiUrl, { method: "HEAD" });
      return {
        connected: res.status < 500,
        message: `Endpoint reachable (HTTP ${res.status})`,
      };
    } catch (e: any) {
      return {
        connected: false,
        message: e.message || "Endpoint unreachable",
      };
    }
  }
}

export const aiwcrmService: IAIWCRMProvider = new UniversalAIWCRMProvider();
