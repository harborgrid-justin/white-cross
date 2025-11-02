/**
 * WF-COMP-320 | communication.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: React ecosystem
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: interfaces | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Communication Module Type Definitions
 * Comprehensive types for messaging, templates, delivery tracking, and notifications
 *
 * VALIDATION CONSTRAINTS:
 * - SMS messages: Maximum 1600 characters (will be split into multiple parts)
 * - Email subject: Recommended 78 characters for proper display
 * - Message content: 1-50000 characters
 * - Template name: 3-100 characters
 * - Recipients per message: Maximum 1000
 * - Recipients per broadcast: Maximum 10000
 * - Emergency alerts must have URGENT priority
 * - Scheduled messages must be future dated
 * - Phone numbers must be in E.164 format (+1234567890)
 * - Email addresses must be valid RFC 5322 format
 * - Template variables must match pattern: {{variableName}}
 */

import type { User, EmergencyContact, BaseEntity, PaginationParams, DateRangeFilter } from '../core/common';

// To avoid circular dependencies, define minimal reference types
type StudentReference = {
  id: string;
  firstName: string;
  lastName: string;
  studentNumber: string;
};

// =====================
// ENUMS
// =====================

/**
 * Message Type - Communication channels
 */
export enum MessageType {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH_NOTIFICATION = 'PUSH_NOTIFICATION',
  VOICE = 'VOICE',
}

/**
 * Message Priority Levels
 */
export enum MessagePriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

/**
 * Message Categories
 */
export enum MessageCategory {
  EMERGENCY = 'EMERGENCY',
  HEALTH_UPDATE = 'HEALTH_UPDATE',
  APPOINTMENT_REMINDER = 'APPOINTMENT_REMINDER',
  MEDICATION_REMINDER = 'MEDICATION_REMINDER',
  GENERAL = 'GENERAL',
  INCIDENT_NOTIFICATION = 'INCIDENT_NOTIFICATION',
  COMPLIANCE = 'COMPLIANCE',
}

/**
 * Recipient Types
 */
export enum RecipientType {
  STUDENT = 'STUDENT',
  EMERGENCY_CONTACT = 'EMERGENCY_CONTACT',
  PARENT = 'PARENT',
  NURSE = 'NURSE',
  ADMIN = 'ADMIN',
}

/**
 * Delivery Status
 */
export enum DeliveryStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  BOUNCED = 'BOUNCED',
}

/**
 * Emergency Alert Severity
 */
export enum EmergencyAlertSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

/**
 * Emergency Alert Audience
 */
export enum EmergencyAlertAudience {
  ALL_STAFF = 'ALL_STAFF',
  NURSES_ONLY = 'NURSES_ONLY',
  SPECIFIC_GROUPS = 'SPECIFIC_GROUPS',
}

// =====================
// MESSAGE TEMPLATE TYPES
// =====================

/**
 * Message Template entity
 *
 * @aligned_with backend/src/database/models/communication/MessageTemplate.ts
 *
 * Validation constraints:
 * - name: 3-100 characters, required
 * - subject: 0-255 characters, optional
 * - content: 1-50000 characters, required
 * - variables: Array of strings (alphanumeric + underscore only), max 50 items
 *
 * PHI/PII Fields:
 * - createdById: User identifier who created the template (PII)
 * - content: Template content may reference PHI through variables
 */
export interface MessageTemplate extends BaseEntity {
  name: string;
  subject?: string;
  content: string; // May contain PHI variable references
  type: MessageType;
  category: MessageCategory;
  variables?: string[];
  isActive: boolean;
  createdById: string; // PII - User identifier
  createdBy?: User;
}

/**
 * Create Message Template request data
 */
export interface CreateMessageTemplateData {
  name: string;
  subject?: string;
  content: string;
  type: MessageType;
  category: MessageCategory;
  variables?: string[];
  isActive?: boolean;
}

/**
 * Update Message Template request data
 */
export interface UpdateMessageTemplateData {
  name?: string;
  subject?: string;
  content?: string;
  type?: MessageType;
  category?: MessageCategory;
  variables?: string[];
  isActive?: boolean;
}

/**
 * Message Template filters
 */
export interface MessageTemplateFilters {
  type?: MessageType;
  category?: MessageCategory;
  isActive?: boolean;
}

// =====================
// MESSAGE TYPES
// =====================

/**
 * Message entity
 *
 * @aligned_with backend/src/database/models/communication/Message.ts
 *
 * Validation constraints:
 * - subject: 0-255 characters, optional
 * - content: 1-50000 characters, required (SMS: max 1600, Email: max 100000)
 * - scheduledAt: Must be future date if provided
 * - recipientCount: 0-10000
 * - attachments: Max 10 URLs, each max 2048 characters
 * - Emergency category requires URGENT priority
 *
 * PHI/PII Fields:
 * - content: Message content may contain health information (PHI)
 * - subject: May contain patient/student information (PHI/PII)
 * - senderId: User identifier who sent the message (PII)
 * - attachments: May contain documents with PHI
 */
export interface Message extends BaseEntity {
  subject?: string; // May contain PHI/PII
  content: string; // May contain PHI
  priority: MessagePriority;
  category: MessageCategory;
  templateId?: string;
  scheduledAt?: string;
  attachments?: string[]; // May contain PHI
  senderId: string; // PII - User identifier
  recipientCount: number;
  sender?: User;
  template?: MessageTemplate;
  deliveries?: MessageDelivery[];
}

/**
 * Message recipient configuration
 *
 * Validation constraints:
 * - email: Valid RFC 5322 format, max 254 characters (required for EMAIL channel)
 * - phoneNumber: E.164 format (+1234567890), 10-15 digits (required for SMS/VOICE channels)
 * - pushToken: Min 10 characters (required for PUSH_NOTIFICATION channel)
 * - preferredLanguage: ISO 639-1 code (2 characters)
 */
export interface MessageRecipient {
  type: RecipientType;
  id: string;
  email?: string;
  phoneNumber?: string;
  pushToken?: string;
  preferredLanguage?: string;
}

/**
 * Create Message request data
 *
 * Validation constraints:
 * - recipients: 1-1000 items, each must have contact info matching selected channels
 * - channels: At least 1 channel required
 * - content: Channel-specific limits (SMS: 1600, Email: 100000, General: 50000)
 * - scheduledAt: Must be future date if provided
 * - attachments: Max 10 URLs
 * - translateTo: Array of ISO 639-1 language codes
 * - Emergency category enforces URGENT priority
 */
export interface CreateMessageData {
  recipients: MessageRecipient[];
  channels: MessageType[];
  subject?: string;
  content: string;
  priority: MessagePriority;
  category: MessageCategory;
  templateId?: string;
  scheduledAt?: string;
  attachments?: string[];
  translateTo?: string[];
}

/**
 * Message filters for querying
 */
export interface MessageFilters extends PaginationParams, DateRangeFilter {
  senderId?: string;
  category?: MessageCategory;
  priority?: MessagePriority;
  status?: DeliveryStatus;
  dateFrom?: string;
  dateTo?: string;
}

// =====================
// MESSAGE DELIVERY TYPES
// =====================

/**
 * Message Delivery entity - tracks individual delivery attempts
 *
 * @aligned_with backend/src/database/models/communication/MessageDelivery.ts
 *
 * PHI/PII Fields:
 * - recipientId: Identifier of message recipient (PII)
 * - contactInfo: Email, phone number, or push token (PII)
 * - failureReason: May contain delivery details with PHI
 *
 * Note: readAt field is UI-specific and not present in backend model
 */
export interface MessageDelivery extends BaseEntity {
  messageId: string;
  recipientId: string; // PII - Recipient identifier
  recipientType: RecipientType;
  channel: MessageType;
  status: DeliveryStatus;
  contactInfo?: string; // PII - Email/phone/push token
  sentAt?: string;
  deliveredAt?: string;
  failureReason?: string; // May contain PHI
  externalId?: string;
  readAt?: string; // UI-specific field (not in backend)
  message?: Message;
}

/**
 * Message Delivery Status result
 */
export interface MessageDeliveryStatusResult {
  messageId: string;
  recipientId: string;
  channel: MessageType;
  status: DeliveryStatus;
  sentAt?: string;
  deliveredAt?: string;
  failureReason?: string;
  externalId?: string;
}

/**
 * Delivery Summary statistics
 */
export interface DeliverySummary {
  total: number;
  pending: number;
  sent: number;
  delivered: number;
  failed: number;
  bounced: number;
}

/**
 * Message Delivery Status response
 */
export interface MessageDeliveryStatusResponse {
  deliveries: MessageDelivery[];
  summary: DeliverySummary;
}

// =====================
// BROADCAST MESSAGE TYPES
// =====================

/**
 * Broadcast Audience targeting criteria
 */
export interface BroadcastAudience {
  grades?: string[];
  nurseIds?: string[];
  studentIds?: string[];
  includeParents?: boolean;
  includeEmergencyContacts?: boolean;
}

/**
 * Create Broadcast Message request data
 */
export interface BroadcastMessageData {
  audience: BroadcastAudience;
  channels: MessageType[];
  subject?: string;
  content: string;
  priority: MessagePriority;
  category: MessageCategory;
  scheduledAt?: string;
  translateTo?: string[];
}

// =====================
// EMERGENCY ALERT TYPES
// =====================

/**
 * Emergency Alert configuration
 *
 * Validation constraints:
 * - title: 1-100 characters, required
 * - message: 1-500 characters, required
 * - severity: Required (LOW, MEDIUM, HIGH, CRITICAL)
 * - channels: At least 1 channel required, multiple recommended
 * - groups: Required when audience is SPECIFIC_GROUPS
 * - Auto-assigned URGENT priority and EMERGENCY category
 */
export interface EmergencyAlertData {
  title: string;
  message: string;
  severity: EmergencyAlertSeverity;
  audience: EmergencyAlertAudience;
  groups?: string[];
  channels: MessageType[];
}

/**
 * Emergency Alert response
 */
export interface EmergencyAlertResponse {
  message: Message;
  deliveryStatuses: MessageDeliveryStatusResult[];
}

// =====================
// SCHEDULED MESSAGES
// =====================

/**
 * Scheduled Message entity
 */
export interface ScheduledMessage extends BaseEntity {
  messageId: string;
  scheduledAt: string;
  processedAt?: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  failureReason?: string;
  message?: Message;
}

// =====================
// TRANSLATION TYPES
// =====================

/**
 * Translation request
 */
export interface TranslationRequest {
  content: string;
  targetLanguage: string;
}

/**
 * Translation response
 */
export interface TranslationResponse {
  translated: string;
  sourceLanguage?: string;
  targetLanguage: string;
}

/**
 * Supported Languages
 */
export interface SupportedLanguage {
  code: string;
  name: string;
  nativeName: string;
  isActive: boolean;
}

// =====================
// COMMUNICATION STATISTICS
// =====================

/**
 * Communication Statistics
 */
export interface CommunicationStatistics {
  totalMessages: number;
  byCategory: Record<MessageCategory, number>;
  byPriority: Record<MessagePriority, number>;
  byChannel: Record<MessageType, number>;
  deliveryStatus: Record<DeliveryStatus, number>;
}

/**
 * Communication Statistics filters
 */
export interface CommunicationStatisticsFilters extends DateRangeFilter {
  dateFrom?: string;
  dateTo?: string;
}

// =====================
// COMMUNICATION OPTIONS
// =====================

/**
 * Channel configuration option
 */
export interface ChannelOption {
  id: string;
  label: string;
  value: MessageType;
  description: string;
  enabled: boolean;
  icon?: string;
}

/**
 * Notification type configuration
 */
export interface NotificationTypeOption {
  id: string;
  label: string;
  value: MessageCategory;
  description: string;
  defaultPriority: MessagePriority;
  requiresApproval: boolean;
}

/**
 * Priority level configuration
 */
export interface PriorityLevelOption {
  id: string;
  label: string;
  value: MessagePriority;
  description: string;
  color: string;
}

/**
 * Verification method option
 */
export interface VerificationMethodOption {
  id: string;
  label: string;
  value: MessageType;
}

/**
 * Communication Options response
 */
export interface CommunicationOptions {
  channels: ChannelOption[];
  notificationTypes: NotificationTypeOption[];
  priorityLevels: PriorityLevelOption[];
  verificationMethods: VerificationMethodOption[];
}

// =====================
// API RESPONSE TYPES
// =====================

/**
 * Send Message response
 */
export interface SendMessageResponse {
  message: Message;
  deliveryStatuses: MessageDeliveryStatusResult[];
}

/**
 * Get Messages response with pagination
 */
export interface GetMessagesResponse {
  messages: Message[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * Process Scheduled Messages response
 */
export interface ProcessScheduledMessagesResponse {
  processedCount: number;
}

// =====================
// COMMUNICATION PREFERENCES
// =====================

/**
 * User Communication Preferences
 */
export interface CommunicationPreferences {
  userId: string;
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  voiceEnabled: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
  preferredLanguage?: string;
  emailAddress?: string;
  phoneNumber?: string;
  pushToken?: string;
}

/**
 * Contact Communication Preferences
 */
export interface ContactCommunicationPreferences {
  contactId: string;
  contactType: RecipientType;
  channels: MessageType[];
  preferredLanguage?: string;
  doNotDisturb: boolean;
  emergencyOnly: boolean;
}

// =====================
// NOTIFICATION TYPES
// =====================

/**
 * In-app notification
 */
export interface Notification extends BaseEntity {
  userId: string;
  title: string;
  message: string;
  type: MessageCategory;
  priority: MessagePriority;
  isRead: boolean;
  readAt?: string;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, any>;
}

/**
 * Notification filters
 */
export interface NotificationFilters extends PaginationParams {
  isRead?: boolean;
  type?: MessageCategory;
  priority?: MessagePriority;
}

// =====================
// TEMPLATE VARIABLES
// =====================

/**
 * Template Variable definition
 */
export interface TemplateVariable {
  key: string;
  label: string;
  description: string;
  example: string;
  required: boolean;
  type: 'string' | 'number' | 'date' | 'boolean';
}

/**
 * Template rendering context
 */
export interface TemplateRenderContext {
  student?: StudentReference;
  emergencyContact?: EmergencyContact;
  appointment?: any;
  medication?: any;
  incident?: any;
  customData?: Record<string, any>;
}

// =====================
// BULK OPERATIONS
// =====================

/**
 * Bulk Send Messages request
 */
export interface BulkSendMessagesData {
  messages: CreateMessageData[];
  batchSize?: number;
  delayBetweenBatches?: number;
}

/**
 * Bulk Send Messages response
 */
export interface BulkSendMessagesResponse {
  totalMessages: number;
  successCount: number;
  failureCount: number;
  results: SendMessageResponse[];
  errors: Array<{
    index: number;
    error: string;
  }>;
}

// =====================
// MESSAGE HISTORY
// =====================

/**
 * Message History entry
 */
export interface MessageHistory extends BaseEntity {
  messageId: string;
  action: 'CREATED' | 'SENT' | 'DELIVERED' | 'FAILED' | 'BOUNCED' | 'OPENED' | 'CLICKED';
  performedBy?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

// =====================
// READ RECEIPTS
// =====================

/**
 * Read Receipt
 */
export interface ReadReceipt extends BaseEntity {
  messageId: string;
  deliveryId: string;
  recipientId: string;
  readAt: string;
  ipAddress?: string;
  userAgent?: string;
}

// =====================
// COMMUNICATION ANALYTICS
// =====================

/**
 * Communication Analytics data
 */
export interface CommunicationAnalytics {
  period: {
    start: string;
    end: string;
  };
  totalMessages: number;
  totalRecipients: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
  failureRate: number;
  averageDeliveryTime: number;
  channelPerformance: Array<{
    channel: MessageType;
    sent: number;
    delivered: number;
    failed: number;
    deliveryRate: number;
  }>;
  categoryBreakdown: Array<{
    category: MessageCategory;
    count: number;
    percentage: number;
  }>;
  priorityBreakdown: Array<{
    priority: MessagePriority;
    count: number;
    percentage: number;
  }>;
  topTemplates: Array<{
    templateId: string;
    templateName: string;
    usageCount: number;
  }>;
}
