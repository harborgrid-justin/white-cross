/**
 * Type definitions for integration settings
 * Uses discriminated unions for type-safe integration configurations
 */

/**
 * OAuth2 configuration for integrations
 */
export interface OAuth2Config {
  clientId: string;
  clientSecret: string;
  authorizationUrl: string;
  tokenUrl: string;
  scope: string[];
  redirectUri: string;
  refreshToken?: string;
  accessToken?: string;
  tokenExpiresAt?: Date;
}

/**
 * API Key authentication configuration
 */
export interface ApiKeyConfig {
  apiKey: string;
  apiSecret?: string;
  headerName?: string; // e.g., 'X-API-Key'
}

/**
 * Basic authentication configuration
 */
export interface BasicAuthConfig {
  username: string;
  password: string;
}

/**
 * Field mapping for data synchronization
 */
export interface FieldMapping {
  sourceField: string;
  targetField: string;
  transform?: 'uppercase' | 'lowercase' | 'trim' | 'none';
  required: boolean;
  defaultValue?: string;
  dataType?: 'string' | 'number' | 'boolean' | 'date';
}

/**
 * Webhook retry policy configuration
 */
export interface WebhookRetryPolicy {
  maxRetries: number;
  retryDelayMs: number;
  backoffMultiplier: number;
  maxRetryDelayMs: number;
  retryOn: Array<'timeout' | 'network_error' | '5xx' | '429'>;
}

/**
 * Cron expression for scheduled sync
 */
export type CronExpression = string; // e.g., '0 */6 * * *' for every 6 hours

/**
 * Student Information System (SIS) integration settings
 */
export interface SISIntegrationSettings {
  type: 'SIS';
  sisProvider: 'PowerSchool' | 'Skyward' | 'Infinite Campus' | 'Other';
  apiVersion: string;
  dataMapping: Record<string, string>;
  syncSchedule: CronExpression;
  batchSize: number;
  syncEntities: Array<'students' | 'staff' | 'classes' | 'grades'>;
  enableRealTimeSync?: boolean;
  webhookUrl?: string;
}

/**
 * Learning Management System (LMS) integration settings
 */
export interface LMSIntegrationSettings {
  type: 'LMS';
  lmsType: 'Canvas' | 'Blackboard' | 'Moodle' | 'Google Classroom' | 'Other';
  courseIdField: string;
  enrollmentSync: boolean;
  gradeSync?: boolean;
  assignmentSync?: boolean;
  syncInterval: number; // in minutes
}

/**
 * Electronic Health Record (EHR) integration settings
 */
export interface EHRIntegrationSettings {
  type: 'EHR';
  ehrSystem: 'Epic' | 'Cerner' | 'Allscripts' | 'eClinicalWorks' | 'Other';
  hl7Version?: '2.3' | '2.4' | '2.5' | '2.6' | '3.0';
  fhirVersion?: 'R4' | 'R5' | 'STU3';
  patientIdMapping: FieldMapping;
  syncVitals: boolean;
  syncMedications: boolean;
  syncAllergies: boolean;
  syncImmunizations: boolean;
  bidirectionalSync: boolean;
}

/**
 * SMS/Messaging integration settings
 */
export interface SMSIntegrationSettings {
  type: 'SMS';
  provider: 'Twilio' | 'Vonage' | 'MessageBird' | 'Other';
  accountSid?: string;
  messagingServiceSid?: string;
  fromNumber: string;
  enableDeliveryReceipts: boolean;
  enableStatusWebhooks: boolean;
  webhookRetryPolicy?: WebhookRetryPolicy;
}

/**
 * Email integration settings
 */
export interface EmailIntegrationSettings {
  type: 'EMAIL';
  provider: 'SendGrid' | 'Mailgun' | 'AWS SES' | 'SMTP' | 'Other';
  smtpHost?: string;
  smtpPort?: number;
  smtpSecure?: boolean;
  fromAddress: string;
  fromName: string;
  replyToAddress?: string;
  enableTracking?: boolean;
}

/**
 * Custom webhook integration settings
 */
export interface WebhookIntegrationSettings {
  type: 'WEBHOOK';
  webhookUrl: string;
  method: 'POST' | 'PUT' | 'PATCH';
  headers?: Record<string, string>;
  payloadFormat: 'json' | 'xml' | 'form-urlencoded';
  retryPolicy: WebhookRetryPolicy;
  signatureSecret?: string;
}

/**
 * State reporting integration settings
 */
export interface StateReportingIntegrationSettings {
  type: 'STATE_REPORTING';
  stateCode: string;
  reportingSystem: string;
  requiredFields: string[];
  fieldMappings: FieldMapping[];
  submissionSchedule: CronExpression;
  validateBeforeSubmit: boolean;
}

/**
 * Discriminated union of all integration settings types
 * Allows TypeScript to narrow types based on the 'type' discriminator
 */
export type IntegrationSettings =
  | SISIntegrationSettings
  | LMSIntegrationSettings
  | EHRIntegrationSettings
  | SMSIntegrationSettings
  | EmailIntegrationSettings
  | WebhookIntegrationSettings
  | StateReportingIntegrationSettings;

/**
 * Integration type discriminator
 */
export type IntegrationType = IntegrationSettings['type'];

/**
 * Authentication configuration discriminated union
 */
export type AuthenticationConfig =
  | { method: 'oauth2'; config: OAuth2Config }
  | { method: 'api_key'; config: ApiKeyConfig }
  | { method: 'basic'; config: BasicAuthConfig }
  | { method: 'none' };

/**
 * Integration sync status
 */
export interface IntegrationSyncStatus {
  lastSyncAt?: Date;
  lastSuccessAt?: Date;
  lastErrorAt?: Date;
  lastErrorMessage?: string;
  syncInProgress: boolean;
  recordsSynced?: number;
  recordsFailed?: number;
}

/**
 * Integration health check result
 */
export interface IntegrationHealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime?: number;
  lastChecked: Date;
  errorDetails?: string;
}
