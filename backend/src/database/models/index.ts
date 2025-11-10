/**
 * @fileoverview Central Models Index for Circular Dependency Prevention
 * @module database/models/index
 * @description Provides ordered model imports to prevent circular dependencies
 *
 * IMPORTANT: Models are exported in dependency order to prevent circular imports.
 * Base models (with no foreign keys) are exported first, followed by models
 * with foreign key dependencies in proper order.
 *
 * Sequelize v6 Compliance:
 * - All associations use proper syntax with foreignKey and as options
 * - No deprecated API usage (findById, string-based includes, etc.)
 * - Proper TypeScript integration
 */

// =============================================================================
// BASE MODELS (No foreign key dependencies)
// =============================================================================

export * from './user.model';
export * from './district.model';
export * from './school.model';

// =============================================================================
// REFERENCE/LOOKUP MODELS
// =============================================================================

export * from './drug-catalog.model';
export * from './medication.model';
export * from './budget-category.model';
export * from './alert-rule.model';
export * from './message-template.model';
export * from './policy-document.model';
export * from './system-config.model';
export * from './integration-config.model';

// =============================================================================
// CORE ENTITY MODELS (Depend on base models)
// =============================================================================

export * from './student.model';
export * from './contact.model';

// =============================================================================
// DEPENDENT MODELS (Require core entities)
// =============================================================================

// Health-related models
export * from './health-record.model';
export * from './mental-health-record.model';
export * from './medical-history.model';
export * from './allergy.model';
export * from './chronic-condition.model';
export * from './vaccination.model';
export * from './vital-signs.model';
export * from './growth-tracking.model';
export * from './immunization.model';
export * from './lab-results.model';

// Academic models
export * from './academic-transcript.model';

// Medication models
export * from './student-medication.model';
export * from './medication-log.model';
export * from './prescription.model';
export * from './student-drug-allergy.model';
export * from './drug-interaction.model';

// Emergency and contact models
export * from './emergency-contact.model';
export * from './emergency-broadcast.model';

// Appointment and scheduling
export * from './appointment.model';
export { AppointmentReminder } from './appointment-reminder.model';
export * from './appointment-waitlist.model';
export * from './follow-up-appointment.model';

// Clinical models
export * from './clinic-visit.model';
export * from './clinical-note.model';
export * from './clinical-protocol.model';
export * from './treatment-plan.model';
export * from './health-screening.model';

// Incident and reporting
export { IncidentReport } from './incident-report.model';
export * from './witness-statement.model';
export * from './follow-up-action.model';

// Alerts and notifications
export * from './alert.model';
export * from './alert-preferences.model';
export { DeliveryLog } from './delivery-log.model';
export * from './push-notification.model';
export * from './device-token.model';

// Communication models
export { Conversation } from './conversation.model';
export type { ConversationAttributes, ConversationCreationAttributes } from './conversation.model';
export { ConversationType } from './conversation.model';
export { ConversationParticipant } from './conversation-participant.model';
export type { ConversationParticipantAttributes, ConversationParticipantCreationAttributes } from './conversation-participant.model';
export { ParticipantRole } from './conversation-participant.model';
export { Message } from './message.model';
export { MessageDelivery } from './message-delivery.model';
export { MessageRead } from './message-read.model';
export type { MessageReadAttributes, MessageReadCreationAttributes } from './message-read.model';
export { MessageReaction } from './message-reaction.model';
export type { MessageReactionAttributes, MessageReactionCreationAttributes } from './message-reaction.model';

// Compliance and audit
export * from './audit-log.model';
export { PhiDisclosure } from './phi-disclosure.model';
export * from './phi-disclosure-audit.model';
export { ComplianceReport } from './compliance-report.model';
export * from './compliance-checklist-item.model';
export * from './compliance-violation.model';
export * from './policy-acknowledgment.model';

// Budget and inventory
export * from './budget-transaction.model';
export * from './inventory-item.model';
export * from './inventory-transaction.model';
export * from './purchase-order.model';
export * from './purchase-order-item.model';
export * from './supplier.model';
export * from './vendor.model';

// Analytics and reporting (selective exports to avoid enum conflicts)
export { AnalyticsReport } from './analytics-report.model';
export type { AnalyticsReportAttributes } from './analytics-report.model';
export { ReportTemplate } from './report-template.model';
export type { ReportTemplateAttributes } from './report-template.model';
export { ReportExecution } from './report-execution.model';
export type { ReportExecutionAttributes } from './report-execution.model';
export { ReportSchedule } from './report-schedule.model';
export type { ReportScheduleAttributes } from './report-schedule.model';
export * from './performance-metric.model';
export * from './health-metric-snapshot.model';

// Data management and sync (selective exports to avoid enum conflicts)
export { SyncSession } from './sync-session.model';
export * from './sync-state.model';
export { SyncQueueItem } from './sync-queue-item.model';
export type { SyncQueueItemAttributes } from './sync-queue-item.model';
export { SyncConflict } from './sync-conflict.model';
export type { SyncConflictAttributes } from './sync-conflict.model';
export { SISSyncConflict } from './sis-sync-conflict.model';
export { CacheEntry } from './cache-entry.model';
export type { CacheEntryAttributes, CacheEntryCreationAttributes } from './cache-entry.model';

// Configuration and maintenance
export * from './configuration-history.model';
export * from './data-retention-policy.model';
export * from './backup-log.model';
export * from './maintenance-log.model';
export * from './threat-detection.model';

// Integration and external systems
export * from './integration-log.model';
export * from './webhook.model';

// Training and licensing
export * from './training-module.model';
export * from './license.model';

// Consent management
export * from './consent-form.model';
export * from './consent-signature.model';

// Remediation
export * from './remediation-action.model';

/**
 * Re-export commonly used types and enums with explicit disambiguation
 */
export { UserRole } from './user.model';
export { Gender } from './student.model';
export { AppointmentType, AppointmentStatus } from './appointment.model';
export { AlertSeverity, AlertStatus, AlertCategory } from './alert.model';
export { AllergyType, AllergySeverity } from './allergy.model';

// Explicit re-exports to resolve naming conflicts
export { MessageType as MessageTemplateType } from './message-template.model';

export { ComplianceStatus as VaccinationComplianceStatus } from './vaccination.model';
export { ComplianceStatus as IncidentComplianceStatus } from './incident-report.model';
export { ComplianceStatus as ReportComplianceStatus } from './compliance-report.model';
export { ComplianceStatus as AnalyticsComplianceStatus } from './analytics-report.model';
export { DeliveryStatus as PushNotificationDeliveryStatus } from './push-notification.model';
export { DeliveryStatus as MessageDeliveryStatus } from './message-delivery.model';
export { RecipientType as MessageRecipientType } from './message-delivery.model';
export { RecipientType as PHIDisclosureRecipientType } from './phi-disclosure.model';
export { ReportType as AnalyticsReportType } from './analytics-report.model';
export { ReportType as ReportTemplateType } from './report-template.model';
export { ReportStatus as AnalyticsReportStatus } from './analytics-report.model';
export { ReportStatus as ReportExecutionStatus } from './report-execution.model';
export { SyncStatus as SyncSessionStatus } from './sync-session.model';
export { SyncStatus as SyncConflictStatus } from './sync-conflict.model';
export { ConflictResolution as SyncQueueConflictResolution } from './sync-queue-item.model';
export { ConflictResolution as SISConflictResolution } from './sis-sync-conflict.model';

/**
 * Model initialization function for setting up associations
 * Call this after all models are loaded to establish relationships
 */
export function initializeModelAssociations(): void {
  // This function can be used to establish any complex associations
  // that need to be set up after all models are loaded
  console.log('Model associations initialized');
}
