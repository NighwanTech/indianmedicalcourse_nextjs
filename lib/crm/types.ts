/**
 * Enterprise CRM Integration Architecture - Types & Interfaces
 */

export type CRMProviderType = "AIWCRM" | "WEBHOOK" | "CUSTOM_REST_API" | "DISABLED";

export type CRMEventType = 
  | "LEAD_CREATED"
  | "LEAD_UPDATED"
  | "LEAD_ASSIGNED"
  | "ADMISSION_CONFIRMED"
  | "PAYMENT_RECEIVED";

export interface CRMFieldMapping {
  id: string;
  websiteField: string;
  crmField: string;
  fieldType: "string" | "number" | "boolean" | "json";
  isRequired: boolean;
  isEnabled: boolean;
  defaultValue?: string;
}

export interface CRMEventConfig {
  eventType: CRMEventType;
  label: string;
  description: string;
  isEnabled: boolean;
}

export interface CRMConfiguration {
  enabled: boolean;
  provider: CRMProviderType;
  apiBaseUrl: string;
  apiKey?: string;
  authHeaderType: "Bearer" | "x-api-key" | "Basic" | "None";
  username?: string;
  password?: string;
  webhookUrl?: string;
  timeoutMs: number;
  maxRetryAttempts: number;
  enableLogging: boolean;
  customHeaders?: Record<string, string>;
  fieldMappings: CRMFieldMapping[];
  events: CRMEventConfig[];
  updatedAt: string;
}

export interface CRMQueueJob {
  id: string;
  eventType: CRMEventType;
  leadUuid: string;
  rawPayload: Record<string, any>;
  transformedPayload: Record<string, any>;
  status: "PENDING" | "PROCESSING" | "SYNCED" | "FAILED" | "PERMANENTLY_FAILED";
  attempts: number;
  maxAttempts: number;
  nextRetryAt?: string;
  lastAttemptAt?: string;
  crmLeadId?: string;
  errorMessage?: string;
  httpStatusCode?: number;
  createdAt: string;
  syncedAt?: string;
}

export interface CRMSyncResult {
  success: boolean;
  crmLeadId?: string;
  error?: string;
  statusCode?: number;
  timestamp: string;
}

export const DEFAULT_CRM_FIELD_MAPPINGS: CRMFieldMapping[] = [
  { id: "m_1", websiteField: "name", crmField: "full_name", fieldType: "string", isRequired: true, isEnabled: true },
  { id: "m_2", websiteField: "mobile", crmField: "phone", fieldType: "string", isRequired: true, isEnabled: true },
  { id: "m_3", websiteField: "email", crmField: "email", fieldType: "string", isRequired: false, isEnabled: true },
  { id: "m_4", websiteField: "qualification", crmField: "qualification", fieldType: "string", isRequired: true, isEnabled: true },
  { id: "m_5", websiteField: "courseName", crmField: "course", fieldType: "string", isRequired: true, isEnabled: true },
  { id: "m_6", websiteField: "city", crmField: "city", fieldType: "string", isRequired: false, isEnabled: true },
  { id: "m_7", websiteField: "state", crmField: "state", fieldType: "string", isRequired: false, isEnabled: true },
  { id: "m_8", websiteField: "country", crmField: "country", fieldType: "string", isRequired: false, isEnabled: true },
  { id: "m_9", websiteField: "leadSource", crmField: "lead_source", fieldType: "string", isRequired: false, isEnabled: true },
  { id: "m_10", websiteField: "utmSource", crmField: "utm_source", fieldType: "string", isRequired: false, isEnabled: true },
  { id: "m_11", websiteField: "utmCampaign", crmField: "utm_campaign", fieldType: "string", isRequired: false, isEnabled: true },
  { id: "m_12", websiteField: "utmMedium", crmField: "utm_medium", fieldType: "string", isRequired: false, isEnabled: true },
  { id: "m_13", websiteField: "leadScore", crmField: "lead_score", fieldType: "number", isRequired: false, isEnabled: true },
  { id: "m_14", websiteField: "gclid", crmField: "gclid", fieldType: "string", isRequired: false, isEnabled: true },
  { id: "m_15", websiteField: "landingPageUrl", crmField: "landing_page_url", fieldType: "string", isRequired: false, isEnabled: true },
  { id: "m_16", websiteField: "deviceType", crmField: "device_type", fieldType: "string", isRequired: false, isEnabled: true },
];

export const DEFAULT_CRM_EVENTS: CRMEventConfig[] = [
  { eventType: "LEAD_CREATED", label: "Lead Created", description: "Triggered whenever a doctor submits any admission or consultation form", isEnabled: true },
  { eventType: "LEAD_UPDATED", label: "Lead Updated", description: "Triggered when a lead's status, notes, or score is updated", isEnabled: true },
  { eventType: "LEAD_ASSIGNED", label: "Lead Assigned", description: "Triggered when a lead is assigned to a specific clinical counsellor", isEnabled: true },
  { eventType: "ADMISSION_CONFIRMED", label: "Admission Confirmed", description: "Triggered when a doctor's admission status moves to ADMITTED", isEnabled: true },
  { eventType: "PAYMENT_RECEIVED", label: "Payment Received", description: "Triggered when an enrollment deposit or token fee is recorded", isEnabled: true },
];

export const DEFAULT_CRM_CONFIG: CRMConfiguration = {
  enabled: true,
  provider: "AIWCRM",
  apiBaseUrl: "https://api.aiwcrm.com/v1/leads",
  apiKey: "",
  authHeaderType: "Bearer",
  username: "",
  password: "",
  webhookUrl: "",
  timeoutMs: 5000,
  maxRetryAttempts: 5,
  enableLogging: true,
  fieldMappings: DEFAULT_CRM_FIELD_MAPPINGS,
  events: DEFAULT_CRM_EVENTS,
  updatedAt: new Date().toISOString(),
};
