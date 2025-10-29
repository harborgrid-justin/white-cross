/**
 * Database Models Barrel Export
 * Central export point for all Sequelize models
 *
 * This file provides a single import point for all database models,
 * making it easier to import multiple models in service files.
 *
 * Usage:
 * import { Student, User, HealthRecord } from '@/database/models';
 */

// ============================================================================
// CORE MODELS
// ============================================================================
export { AuditLog } from './audit-log.model';
export { Student } from './student.model';
export { User } from './user.model';

// ============================================================================
// HEALTHCARE MODELS
// ============================================================================
export { Appointment } from './appointment.model';
export { AppointmentReminder } from './appointment-reminder.model';
export { AppointmentWaitlist } from './appointment-waitlist.model';
export { GrowthTracking } from './growth-tracking.model';
export { HealthRecord } from './health-record.model';
export { HealthScreening } from './health-screening.model';
export { Immunization } from './immunization.model';
export { LabResults } from './lab-results.model';
export { MedicalHistory } from './medical-history.model';
export { TreatmentPlan } from './treatment-plan.model';
export { VitalSigns } from './vital-signs.model';

// ============================================================================
// HEALTH RISK ASSESSMENT MODELS
// ============================================================================
export { Allergy } from './allergy.model';
export { ChronicCondition } from './chronic-condition.model';
export { StudentMedication } from './student-medication.model';
export { IncidentReport } from './incident-report.model';

// ============================================================================
// MEDICATION MODELS
// ============================================================================
export { Medication } from './medication.model';
export { MedicationLog } from './medication-log.model';

// ============================================================================
// CLINICAL MODELS
// ============================================================================
export { DrugCatalog } from './drug-catalog.model';
export { DrugInteraction } from './drug-interaction.model';
export { StudentDrugAllergy } from './student-drug-allergy.model';
export { ClinicVisit } from './clinic-visit.model';
export { ClinicalNote } from './clinical-note.model';
export { ClinicalProtocol } from './clinical-protocol.model';
export { FollowUpAction } from './follow-up-action.model';
export { FollowUpAppointment } from './follow-up-appointment.model';
export { Prescription } from './prescription.model';
export { Vaccination } from './vaccination.model';
export { WitnessStatement } from './witness-statement.model';
export { MentalHealthRecord } from './mental-health-record.model';

// ============================================================================
// ANALYTICS MODELS
// ============================================================================
export { AnalyticsReport } from './analytics-report.model';
export { HealthMetricSnapshot } from './health-metric-snapshot.model';

// ============================================================================
// INVENTORY MODELS
// ============================================================================
export { InventoryItem } from './inventory-item.model';
export { InventoryTransaction } from './inventory-transaction.model';
export { MaintenanceLog } from './maintenance-log.model';
export { PurchaseOrder } from './purchase-order.model';
export { PurchaseOrderItem } from './purchase-order-item.model';
export { Vendor } from './vendor.model';

// ============================================================================
// COMPLIANCE & POLICY MODELS
// ============================================================================
export { ComplianceChecklistItem } from './compliance-checklist-item.model';
export { ComplianceReport } from './compliance-report.model';
export { ComplianceViolation } from './compliance-violation.model';
export { ConsentForm } from './consent-form.model';
export { ConsentSignature } from './consent-signature.model';
export { DataRetentionPolicy } from './data-retention-policy.model';
export { PolicyAcknowledgment } from './policy-acknowledgment.model';
export { PolicyDocument } from './policy-document.model';
export { PhiDisclosure } from './phi-disclosure.model';
export { PhiDisclosureAudit } from './phi-disclosure-audit.model';

// ============================================================================
// ADMINISTRATION MODELS
// ============================================================================
export { AcademicTranscript } from './academic-transcript.model';
export { BackupLog } from './backup-log.model';
export { ConfigurationHistory } from './configuration-history.model';
export { District } from './district.model';
export { License } from './license.model';
export { PerformanceMetric } from './performance-metric.model';
export { School } from './school.model';
export { TrainingModule } from './training-module.model';
export { AlertRule } from './alert-rule.model';
export { EmergencyContact } from './emergency-contact.model';

// ============================================================================
// REPORTING MODELS
// ============================================================================
export { ReportExecution } from './report-execution.model';
export { ReportSchedule } from './report-schedule.model';
export { ReportTemplate } from './report-template.model';

// ============================================================================
// COMMUNICATION & MOBILE MODELS
// ============================================================================
export { EmergencyBroadcast } from './emergency-broadcast.model';
export { Message } from './message.model';
export { MessageDelivery } from './message-delivery.model';
export { MessageTemplate } from './message-template.model';
export { DeviceToken } from './device-token.model';
export { PushNotification } from './push-notification.model';

// ============================================================================
// INTEGRATION & SYNC MODELS
// ============================================================================
export { IntegrationConfig } from './integration-config.model';
export { IntegrationLog } from './integration-log.model';
export { SISSyncConflict } from './sis-sync-conflict.model';
export { SyncConflict } from './sync-conflict.model';
export { SyncQueueItem } from './sync-queue-item.model';
export { SyncSession } from './sync-session.model';
export { SyncState } from './sync-state.model';

// ============================================================================
// BUDGET & FINANCE MODELS
// ============================================================================
export { BudgetCategory } from './budget-category.model';
export { BudgetTransaction } from './budget-transaction.model';

// ============================================================================
// CONTACT MODELS
// ============================================================================
export { Contact } from './contact.model';

// ============================================================================
// REMEDIATION MODELS
// ============================================================================
export { RemediationAction } from './remediation-action.model';

// ============================================================================
// SYSTEM MODELS
// ============================================================================
export { Supplier } from './supplier.model';
export { SystemConfig } from './system-config.model';
export { ThreatDetection } from './threat-detection.model';
export { Webhook } from './webhook.model';

/**
 * Model Count Summary:
 * - Core Models: 3
 * - Healthcare Models: 11
 * - Health Risk Assessment Models: 4
 * - Medication Models: 2
 * - Clinical Models: 11
 * - Analytics Models: 2
 * - Inventory Models: 6
 * - Compliance & Policy Models: 10
 * - Administration Models: 10
 * - Reporting Models: 3
 * - Communication & Mobile Models: 6
 * - Integration & Sync Models: 7
 * - Budget & Finance Models: 2
 * - Contact Models: 1
 * - Remediation Models: 1
 * - System Models: 4
 *
 * TOTAL: 84 models
 */
