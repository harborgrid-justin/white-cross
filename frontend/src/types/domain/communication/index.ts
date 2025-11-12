/**
 * WF-COMP-320 | index.ts - Communication types barrel export
 * Purpose: Re-export all communication types for backward compatibility and convenience
 * Dependencies: All communication modules
 * Exports: All communication types
 * Last Updated: 2025-11-12 | File Type: .ts
 */

// =====================
// ENUMS
// =====================
export {
  MessageType,
  MessagePriority,
  MessageCategory,
  RecipientType,
  DeliveryStatus,
  EmergencyAlertSeverity,
  EmergencyAlertAudience,
} from './communication-enums';

// =====================
// MESSAGE TEMPLATES
// =====================
export type {
  MessageTemplate,
  CreateMessageTemplateData,
  UpdateMessageTemplateData,
  MessageTemplateFilters,
  TemplateVariable,
  TemplateRenderContext,
  AppointmentReference,
  MedicationReference,
  IncidentReference,
} from './message-templates';

// =====================
// MESSAGES
// =====================
export type {
  Message,
  MessageRecipient,
  CreateMessageData,
  MessageFilters,
  ScheduledMessage,
  SendMessageResponse,
  GetMessagesResponse,
  ProcessScheduledMessagesResponse,
  MessageDeliveryStatusResult,
} from './messages';

// =====================
// MESSAGE DELIVERY
// =====================
export type {
  MessageDelivery,
  DeliverySummary,
  MessageDeliveryStatusResponse,
  MessageHistory,
  ReadReceipt,
} from './message-delivery';

// =====================
// BROADCAST & EMERGENCY
// =====================
export type {
  BroadcastAudience,
  BroadcastMessageData,
  EmergencyAlertData,
  EmergencyAlertResponse,
} from './broadcast-emergency';

// =====================
// PREFERENCES & NOTIFICATIONS
// =====================
export type {
  CommunicationPreferences,
  ContactCommunicationPreferences,
  Notification,
  NotificationFilters,
} from './communication-preferences';

// =====================
// ANALYTICS & STATISTICS
// =====================
export type {
  CommunicationStatistics,
  CommunicationStatisticsFilters,
  CommunicationAnalytics,
  ChannelOption,
  NotificationTypeOption,
  PriorityLevelOption,
  VerificationMethodOption,
  CommunicationOptions,
  TranslationRequest,
  TranslationResponse,
  SupportedLanguage,
  BulkSendMessagesData,
  BulkSendMessagesResponse,
} from './communication-analytics';
