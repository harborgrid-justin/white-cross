/**
 * LOC: 37C9F00530
 * WC-IDX-074 | index.ts - Module exports and entry point
 *
 * UPSTREAM (imports from):
 *   - sequelize.ts (database/config/sequelize.ts)
 *   - User.ts (database/models/core/User.ts)
 *   - Student.ts (database/models/core/Student.ts)
 *   - EmergencyContact.ts (database/models/core/EmergencyContact.ts)
 *   - Medication.ts (database/models/core/Medication.ts)
 *   - ... and 57 more
 *
 * DOWNSTREAM (imported by):
 *   - BaseService.ts (database/services/BaseService.ts)
 *   - index.ts (index.ts)
 *   - inventoryMaintenanceJob.ts (jobs/inventoryMaintenanceJob.ts)
 *   - medicationReminderJob.ts (jobs/medicationReminderJob.ts)
 *   - auditLogging.ts (middleware/auditLogging.ts)
 *   - ... and 67 more
 */

/**
 * WC-IDX-074 | index.ts - Module exports and entry point
 * Purpose: module exports and entry point
 * Upstream: ../config/sequelize, ./core/User, ./core/Student | Dependencies: ../config/sequelize, ./core/User, ./core/Student
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: functions, default export | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: module exports and entry point, part of backend architecture
 */

/**
 * Sequelize Models Registry and Associations
 * Central hub for all database models with relationship definitions
 */

import { sequelize } from '../config/sequelize';

// ============ CORE MODELS ============
import { User } from './core/User';
import { Student } from './core/Student';
import { EmergencyContact } from './core/EmergencyContact';
import { Medication } from './core/Medication';

// ============ MEDICATIONS MODELS ============
import { StudentMedication } from './medications/StudentMedication';
import { MedicationLog } from './medications/MedicationLog';
import { MedicationInventory } from './medications/MedicationInventory';

// ============ INVENTORY MODELS ============
import { InventoryItem } from './inventory/InventoryItem';
import { InventoryTransaction } from './inventory/InventoryTransaction';
import { MaintenanceLog } from './inventory/MaintenanceLog';
import { Vendor } from './inventory/Vendor';
import { PurchaseOrder } from './inventory/PurchaseOrder';
import { PurchaseOrderItem } from './inventory/PurchaseOrderItem';
import { BudgetCategory } from './inventory/BudgetCategory';
import { BudgetTransaction } from './inventory/BudgetTransaction';

// ============ HEALTHCARE MODELS ============
import { HealthRecord } from './healthcare/HealthRecord';
import { Appointment } from './healthcare/Appointment';
import { Allergy } from './healthcare/Allergy';
import { ChronicCondition } from './healthcare/ChronicCondition';
import { Vaccination } from './healthcare/Vaccination';
import { Screening } from './healthcare/Screening';
import { GrowthMeasurement } from './healthcare/GrowthMeasurement';
import { VitalSigns } from './healthcare/VitalSigns';
import { NurseAvailability } from './healthcare/NurseAvailability';
import { AppointmentWaitlist } from './healthcare/AppointmentWaitlist';
import { AppointmentReminder } from './healthcare/AppointmentReminder';

// ============ INCIDENTS MODELS ============
import { IncidentReport } from './incidents/IncidentReport';
import { WitnessStatement } from './incidents/WitnessStatement';
import { FollowUpAction } from './incidents/FollowUpAction';

// ============ COMPLIANCE MODELS ============
import { AuditLog } from './compliance/AuditLog';
import { ComplianceReport } from './compliance/ComplianceReport';
import { ComplianceChecklistItem } from './compliance/ComplianceChecklistItem';
import { ConsentForm } from './compliance/ConsentForm';
import { ConsentSignature } from './compliance/ConsentSignature';
import { PolicyDocument } from './compliance/PolicyDocument';
import { PolicyAcknowledgment } from './compliance/PolicyAcknowledgment';

// ============ SECURITY MODELS ============
import { Role } from './security/Role';
import { Permission } from './security/Permission';
import { RolePermission } from './security/RolePermission';
import { UserRoleAssignment } from './security/UserRoleAssignment';
import { Session } from './security/Session';
import { LoginAttempt } from './security/LoginAttempt';
import { SecurityIncident } from './security/SecurityIncident';
import { IpRestriction } from './security/IpRestriction';

// ============ COMMUNICATION MODELS ============
import { MessageTemplate } from './communication/MessageTemplate';
import { Message } from './communication/Message';
import { MessageDelivery } from './communication/MessageDelivery';

// ============ DOCUMENTS MODELS ============
import { Document } from './documents/Document';
import { DocumentSignature } from './documents/DocumentSignature';
import { DocumentAuditTrail } from './documents/DocumentAuditTrail';

// ============ INTEGRATION MODELS ============
import { IntegrationConfig } from './integration/IntegrationConfig';
import { IntegrationLog } from './integration/IntegrationLog';

// ============ ADMINISTRATION MODELS ============
import { District } from './administration/District';
import { School } from './administration/School';
import { SystemConfiguration } from './administration/SystemConfiguration';
import { ConfigurationHistory } from './administration/ConfigurationHistory';
import { BackupLog } from './administration/BackupLog';
import { PerformanceMetric } from './administration/PerformanceMetric';
import { License } from './administration/License';
import { TrainingModule } from './administration/TrainingModule';
import { TrainingCompletion } from './administration/TrainingCompletion';

/**
 * Define all model associations
 * Based on Prisma schema relationships
 */
export function setupAssociations() {
  // ============ USER ASSOCIATIONS (lines 22-40 in Prisma) ============
  // Primary nurse-student relationship
  User.hasMany(Student, {
    foreignKey: 'nurseId',
    as: 'nurseManagedStudents',
    sourceKey: 'id',
  });

  // Audit trail associations - students created/updated by this user
  // constraints: false prevents foreign key constraints (audit fields are optional)
  User.hasMany(Student, {
    foreignKey: 'createdBy',
    as: 'studentsCreated',
    constraints: false,
    sourceKey: 'id',
  });
  User.hasMany(Student, {
    foreignKey: 'updatedBy',
    as: 'studentsUpdated',
    constraints: false,
    sourceKey: 'id',
  });

  User.hasMany(Appointment, { foreignKey: 'nurseId', as: 'appointments' });
  User.hasMany(IncidentReport, { foreignKey: 'reportedById', as: 'incidentReports' });
  User.belongsTo(School, { foreignKey: 'schoolId', as: 'school' });
  User.belongsTo(District, { foreignKey: 'districtId', as: 'district' });

  User.hasMany(MedicationLog, { foreignKey: 'nurseId', as: 'medicationLogs' });
  User.hasMany(InventoryTransaction, { foreignKey: 'performedById', as: 'inventoryTransactions' });
  User.hasMany(MaintenanceLog, { foreignKey: 'performedById', as: 'maintenanceLogs' });
  User.hasMany(MessageTemplate, { foreignKey: 'createdById', as: 'messageTemplates' });
  User.hasMany(Message, { foreignKey: 'senderId', as: 'messages' });
  User.hasMany(NurseAvailability, { foreignKey: 'nurseId', as: 'availability' });
  User.hasMany(AppointmentWaitlist, { foreignKey: 'nurseId', as: 'waitlistEntries' });

  // ============ STUDENT ASSOCIATIONS (lines 59-73 in Prisma) - CASCADE DELETES FOR PHI ============
  // Primary nurse assignment relationship
  Student.belongsTo(User, {
    foreignKey: 'nurseId',
    as: 'assignedNurse',
    targetKey: 'id',
  });

  // Audit field associations for HIPAA compliance tracking
  // constraints: false prevents foreign key constraints (audit fields are optional)
  Student.belongsTo(User, {
    foreignKey: 'createdBy',
    as: 'creator',
    constraints: false,
    targetKey: 'id',
  });
  Student.belongsTo(User, {
    foreignKey: 'updatedBy',
    as: 'updater',
    constraints: false,
    targetKey: 'id',
  });

  Student.hasMany(EmergencyContact, {
    foreignKey: 'studentId',
    as: 'emergencyContacts',
    onDelete: 'CASCADE',
  });
  Student.hasMany(HealthRecord, {
    foreignKey: 'studentId',
    as: 'healthRecords',
    onDelete: 'CASCADE',
  });
  Student.hasMany(Appointment, {
    foreignKey: 'studentId',
    as: 'appointments',
    onDelete: 'CASCADE',
  });
  Student.hasMany(IncidentReport, {
    foreignKey: 'studentId',
    as: 'incidentReports',
    onDelete: 'CASCADE',
  });

  Student.hasMany(StudentMedication, {
    foreignKey: 'studentId',
    as: 'medications',
    onDelete: 'CASCADE',
  });
  Student.hasMany(Allergy, {
    foreignKey: 'studentId',
    as: 'allergies',
    onDelete: 'CASCADE',
  });
  Student.hasMany(ChronicCondition, {
    foreignKey: 'studentId',
    as: 'chronicConditions',
    onDelete: 'CASCADE',
  });
  Student.hasMany(Vaccination, {
    foreignKey: 'studentId',
    as: 'vaccinations',
    onDelete: 'CASCADE',
  });
  Student.hasMany(Screening, {
    foreignKey: 'studentId',
    as: 'screenings',
    onDelete: 'CASCADE',
  });
  Student.hasMany(GrowthMeasurement, {
    foreignKey: 'studentId',
    as: 'growthMeasurements',
    onDelete: 'CASCADE',
  });
  Student.hasMany(VitalSigns, {
    foreignKey: 'studentId',
    as: 'vitalSigns',
    onDelete: 'CASCADE',
  });
  Student.hasMany(AppointmentWaitlist, {
    foreignKey: 'studentId',
    as: 'waitlistEntries',
    onDelete: 'CASCADE',
  });

  // ============ EMERGENCY CONTACT ASSOCIATIONS ============
  EmergencyContact.belongsTo(Student, { foreignKey: 'studentId', as: 'studentRecord' });

  // ============ MEDICATION ASSOCIATIONS (lines 110-135 in Prisma) ============
  Medication.hasMany(StudentMedication, { foreignKey: 'medicationId', as: 'studentMedications' });
  Medication.hasMany(MedicationInventory, { foreignKey: 'medicationId', as: 'inventory' });

  // ============ STUDENT MEDICATION ASSOCIATIONS ============
  StudentMedication.belongsTo(Student, { foreignKey: 'studentId', as: 'studentInfo' });
  StudentMedication.belongsTo(Medication, { foreignKey: 'medicationId', as: 'medication' });
  StudentMedication.hasMany(MedicationLog, { foreignKey: 'studentMedicationId', as: 'logs' });

  // ============ MEDICATION LOG ASSOCIATIONS ============
  MedicationLog.belongsTo(StudentMedication, { foreignKey: 'studentMedicationId', as: 'studentMedication' });
  MedicationLog.belongsTo(User, { foreignKey: 'nurseId', as: 'administeringNurse' });

  // ============ MEDICATION INVENTORY ASSOCIATIONS ============
  MedicationInventory.belongsTo(Medication, { foreignKey: 'medicationId', as: 'medication' });

  // ============ INVENTORY ITEM ASSOCIATIONS ============
  InventoryItem.hasMany(InventoryTransaction, { foreignKey: 'inventoryItemId', as: 'transactions' });
  InventoryItem.hasMany(MaintenanceLog, { foreignKey: 'inventoryItemId', as: 'maintenanceLogs' });

  // ============ INVENTORY TRANSACTION ASSOCIATIONS ============
  InventoryTransaction.belongsTo(InventoryItem, { foreignKey: 'inventoryItemId', as: 'inventoryItem' });
  InventoryTransaction.belongsTo(User, { foreignKey: 'performedById', as: 'performedBy' });

  // ============ MAINTENANCE LOG ASSOCIATIONS ============
  MaintenanceLog.belongsTo(InventoryItem, { foreignKey: 'inventoryItemId', as: 'inventoryItem' });
  MaintenanceLog.belongsTo(User, { foreignKey: 'performedById', as: 'performedBy' });

  // ============ VENDOR ASSOCIATIONS ============
  Vendor.hasMany(PurchaseOrder, { foreignKey: 'vendorId', as: 'purchaseOrders' });

  // ============ PURCHASE ORDER ASSOCIATIONS ============
  PurchaseOrder.belongsTo(Vendor, { foreignKey: 'vendorId', as: 'vendor' });
  PurchaseOrder.hasMany(PurchaseOrderItem, { foreignKey: 'purchaseOrderId', as: 'items', onDelete: 'CASCADE' });

  // ============ PURCHASE ORDER ITEM ASSOCIATIONS ============
  PurchaseOrderItem.belongsTo(PurchaseOrder, { foreignKey: 'purchaseOrderId', as: 'purchaseOrder' });

  // ============ BUDGET CATEGORY ASSOCIATIONS ============
  BudgetCategory.hasMany(BudgetTransaction, { foreignKey: 'categoryId', as: 'transactions' });

  // ============ BUDGET TRANSACTION ASSOCIATIONS ============
  BudgetTransaction.belongsTo(BudgetCategory, { foreignKey: 'categoryId', as: 'category' });

  // ============ HEALTH RECORD ASSOCIATIONS (lines 424-432 in Prisma) ============
  HealthRecord.belongsTo(Student, { foreignKey: 'studentId', as: 'studentProfile' });
  HealthRecord.hasMany(Allergy, { foreignKey: 'healthRecordId', as: 'allergies' });
  HealthRecord.hasMany(ChronicCondition, { foreignKey: 'healthRecordId', as: 'conditions' });
  HealthRecord.hasMany(Vaccination, { foreignKey: 'healthRecordId', as: 'vaccinations' });
  HealthRecord.hasMany(Screening, { foreignKey: 'healthRecordId', as: 'screenings' });
  HealthRecord.hasMany(VitalSigns, { foreignKey: 'healthRecordId', as: 'vitalSigns' });
  HealthRecord.hasMany(GrowthMeasurement, { foreignKey: 'healthRecordId', as: 'measurements' });

  // ============ ALLERGY ASSOCIATIONS (lines 466-470 in Prisma) ============
  Allergy.belongsTo(Student, { foreignKey: 'studentId', as: 'studentWithAllergy' });
  Allergy.belongsTo(HealthRecord, { foreignKey: 'healthRecordId', as: 'healthRecord' });

  // ============ CHRONIC CONDITION ASSOCIATIONS (lines 505-509 in Prisma) ============
  ChronicCondition.belongsTo(Student, { foreignKey: 'studentId', as: 'studentWithCondition' });
  ChronicCondition.belongsTo(HealthRecord, { foreignKey: 'healthRecordId', as: 'healthRecord' });

  // ============ VACCINATION ASSOCIATIONS (lines 554-558 in Prisma) ============
  Vaccination.belongsTo(Student, { foreignKey: 'studentId', as: 'vaccinatedStudent' });
  Vaccination.belongsTo(HealthRecord, { foreignKey: 'healthRecordId', as: 'healthRecord' });

  // ============ SCREENING ASSOCIATIONS (lines 595-599 in Prisma) ============
  Screening.belongsTo(Student, { foreignKey: 'studentId', as: 'screenedStudent' });
  Screening.belongsTo(HealthRecord, { foreignKey: 'healthRecordId', as: 'healthRecord' });

  // ============ GROWTH MEASUREMENT ASSOCIATIONS (lines 631-635 in Prisma) ============
  GrowthMeasurement.belongsTo(Student, { foreignKey: 'studentId', as: 'measuredStudent' });
  GrowthMeasurement.belongsTo(HealthRecord, { foreignKey: 'healthRecordId', as: 'healthRecord' });

  // ============ VITAL SIGNS ASSOCIATIONS (lines 669-675 in Prisma) ============
  VitalSigns.belongsTo(Student, { foreignKey: 'studentId', as: 'patientStudent' });
  VitalSigns.belongsTo(HealthRecord, { foreignKey: 'healthRecordId', as: 'healthRecord' });
  VitalSigns.belongsTo(Appointment, { foreignKey: 'appointmentId', as: 'appointment' });

  // ============ APPOINTMENT ASSOCIATIONS (lines 694-700 in Prisma) ============
  Appointment.belongsTo(Student, { foreignKey: 'studentId', as: 'appointmentStudent' });
  Appointment.belongsTo(User, { foreignKey: 'nurseId', as: 'scheduledNurse' });
  Appointment.hasMany(AppointmentReminder, { foreignKey: 'appointmentId', as: 'reminders', onDelete: 'CASCADE' });
  Appointment.hasMany(VitalSigns, { foreignKey: 'appointmentId', as: 'vitalSigns' });

  // ============ NURSE AVAILABILITY ASSOCIATIONS (lines 717-719 in Prisma) ============
  NurseAvailability.belongsTo(User, { foreignKey: 'nurseId', as: 'availableNurse' });

  // ============ APPOINTMENT WAITLIST ASSOCIATIONS (lines 738-742 in Prisma) ============
  AppointmentWaitlist.belongsTo(Student, { foreignKey: 'studentId', as: 'waitlistedStudent' });
  AppointmentWaitlist.belongsTo(User, { foreignKey: 'nurseId', as: 'requestedNurse' });

  // ============ APPOINTMENT REMINDER ASSOCIATIONS (lines 758-760 in Prisma) ============
  AppointmentReminder.belongsTo(Appointment, { foreignKey: 'appointmentId', as: 'appointment' });

  // ============ INCIDENT REPORT ASSOCIATIONS (lines 789-795 in Prisma) ============
  IncidentReport.belongsTo(Student, { foreignKey: 'studentId', as: 'involvedStudent' });
  IncidentReport.belongsTo(User, { foreignKey: 'reportedById', as: 'reportedBy' });

  IncidentReport.hasMany(WitnessStatement, { foreignKey: 'incidentReportId', as: 'witnessStatements', onDelete: 'CASCADE' });
  IncidentReport.hasMany(FollowUpAction, { foreignKey: 'incidentReportId', as: 'followUpActions', onDelete: 'CASCADE' });

  // ============ WITNESS STATEMENT ASSOCIATIONS (lines 812-814 in Prisma) ============
  WitnessStatement.belongsTo(IncidentReport, { foreignKey: 'incidentReportId', as: 'incidentReport' });

  // ============ FOLLOW UP ACTION ASSOCIATIONS (lines 832-834 in Prisma) ============
  FollowUpAction.belongsTo(IncidentReport, { foreignKey: 'incidentReportId', as: 'incidentReport' });

  // ============ MESSAGE TEMPLATE ASSOCIATIONS (lines 349-351 in Prisma) ============
  MessageTemplate.belongsTo(User, { foreignKey: 'createdById', as: 'createdBy' });
  MessageTemplate.hasMany(Message, { foreignKey: 'templateId', as: 'messages' });

  // ============ MESSAGE ASSOCIATIONS (lines 368-373 in Prisma) ============
  Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
  Message.belongsTo(MessageTemplate, { foreignKey: 'templateId', as: 'template' });
  Message.hasMany(MessageDelivery, { foreignKey: 'messageId', as: 'deliveries' });

  // ============ MESSAGE DELIVERY ASSOCIATIONS (lines 392-394 in Prisma) ============
  MessageDelivery.belongsTo(Message, { foreignKey: 'messageId', as: 'message' });

  // ============ DOCUMENT ASSOCIATIONS (lines 1598-1604 in Prisma) ============
  Document.belongsTo(Document, { foreignKey: 'parentId', as: 'parent' });
  Document.hasMany(Document, { foreignKey: 'parentId', as: 'versions' });
  Document.hasMany(DocumentSignature, { foreignKey: 'documentId', as: 'signatures', onDelete: 'CASCADE' });
  Document.hasMany(DocumentAuditTrail, { foreignKey: 'documentId', as: 'auditTrail', onDelete: 'CASCADE' });

  // ============ DOCUMENT SIGNATURE ASSOCIATIONS (lines 1620-1622 in Prisma) ============
  DocumentSignature.belongsTo(Document, { foreignKey: 'documentId', as: 'document' });

  // ============ DOCUMENT AUDIT TRAIL ASSOCIATIONS (lines 1635-1637 in Prisma) ============
  DocumentAuditTrail.belongsTo(Document, { foreignKey: 'documentId', as: 'document' });

  // ============ COMPLIANCE REPORT ASSOCIATIONS (lines 1662-1664 in Prisma) ============
  ComplianceReport.hasMany(ComplianceChecklistItem, { foreignKey: 'reportId', as: 'items', onDelete: 'CASCADE' });

  // ============ COMPLIANCE CHECKLIST ITEM ASSOCIATIONS (lines 1685-1687 in Prisma) ============
  ComplianceChecklistItem.belongsTo(ComplianceReport, { foreignKey: 'reportId', as: 'report' });

  // ============ CONSENT FORM ASSOCIATIONS (lines 1704-1705 in Prisma) ============
  ConsentForm.hasMany(ConsentSignature, { foreignKey: 'consentFormId', as: 'signatures' });

  // ============ CONSENT SIGNATURE ASSOCIATIONS (lines 1721-1723 in Prisma) ============
  ConsentSignature.belongsTo(ConsentForm, { foreignKey: 'consentFormId', as: 'consentForm' });

  // ============ POLICY DOCUMENT ASSOCIATIONS (lines 1743-1744 in Prisma) ============
  PolicyDocument.hasMany(PolicyAcknowledgment, { foreignKey: 'policyId', as: 'acknowledgments' });

  // ============ POLICY ACKNOWLEDGMENT ASSOCIATIONS (lines 1755-1757 in Prisma) ============
  PolicyAcknowledgment.belongsTo(PolicyDocument, { foreignKey: 'policyId', as: 'policy' });

  // ============ ROLE ASSOCIATIONS (lines 1773-1775 in Prisma) ============
  Role.hasMany(RolePermission, { foreignKey: 'roleId', as: 'permissions', onDelete: 'CASCADE' });
  Role.hasMany(UserRoleAssignment, { foreignKey: 'roleId', as: 'userRoles', onDelete: 'CASCADE' });

  // ============ PERMISSION ASSOCIATIONS (lines 1787-1788 in Prisma) ============
  Permission.hasMany(RolePermission, { foreignKey: 'permissionId', as: 'rolePermissions', onDelete: 'CASCADE' });

  // ============ ROLE PERMISSION ASSOCIATIONS (lines 1798-1802 in Prisma) ============
  RolePermission.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });
  RolePermission.belongsTo(Permission, { foreignKey: 'permissionId', as: 'permission' });

  // ============ USER ROLE ASSIGNMENT ASSOCIATIONS (lines 1813-1815 in Prisma) ============
  UserRoleAssignment.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });

  // ============ INTEGRATION CONFIG ASSOCIATIONS (lines 1525-1526 in Prisma) ============
  IntegrationConfig.hasMany(IntegrationLog, { foreignKey: 'integrationId', as: 'logs', onDelete: 'CASCADE' });

  // ============ INTEGRATION LOG ASSOCIATIONS (lines 1546-1548 in Prisma) ============
  IntegrationLog.belongsTo(IntegrationConfig, { foreignKey: 'integrationId', as: 'integration' });

  // ============ ADMINISTRATION ASSOCIATIONS ============
  District.hasMany(School, { foreignKey: 'districtId', as: 'schools' });
  District.hasMany(User, { foreignKey: 'districtId', as: 'users' });

  School.belongsTo(District, { foreignKey: 'districtId', as: 'district' });
  School.hasMany(User, { foreignKey: 'schoolId', as: 'users' });
  District.hasMany(License, { foreignKey: 'districtId', as: 'licenses' });

  // ============ SYSTEM CONFIGURATION ASSOCIATIONS (lines 1267-1268 in Prisma) ============
  SystemConfiguration.hasMany(ConfigurationHistory, { foreignKey: 'configurationId', as: 'history', onDelete: 'CASCADE' });

  // ============ CONFIGURATION HISTORY ASSOCIATIONS (lines 1288-1290 in Prisma) ============
  ConfigurationHistory.belongsTo(SystemConfiguration, { foreignKey: 'configurationId', as: 'configuration' });

  // ============ LICENSE ASSOCIATIONS (lines 1343-1345 in Prisma) ============
  License.belongsTo(District, { foreignKey: 'districtId', as: 'district' });

  // ============ TRAINING MODULE ASSOCIATIONS (lines 1364-1365 in Prisma) ============
  TrainingModule.hasMany(TrainingCompletion, { foreignKey: 'moduleId', as: 'completions' });

  // ============ TRAINING COMPLETION ASSOCIATIONS (lines 1380-1382 in Prisma) ============
  TrainingCompletion.belongsTo(TrainingModule, { foreignKey: 'moduleId', as: 'module' });
}

// Initialize associations
setupAssociations();

/**
 * Export all models
 */
export {
  sequelize,
  // Core models
  User,
  Student,
  EmergencyContact,
  Medication,
  // Medications models
  StudentMedication,
  MedicationLog,
  MedicationInventory,
  // Inventory models
  InventoryItem,
  InventoryTransaction,
  MaintenanceLog,
  Vendor,
  PurchaseOrder,
  PurchaseOrderItem,
  BudgetCategory,
  BudgetTransaction,
  // Healthcare models
  HealthRecord,
  Appointment,
  Allergy,
  ChronicCondition,
  Vaccination,
  Screening,
  GrowthMeasurement,
  VitalSigns,
  NurseAvailability,
  AppointmentWaitlist,
  AppointmentReminder,
  // Incidents models
  IncidentReport,
  WitnessStatement,
  FollowUpAction,
  // Compliance models
  AuditLog,
  ComplianceReport,
  ComplianceChecklistItem,
  ConsentForm,
  ConsentSignature,
  PolicyDocument,
  PolicyAcknowledgment,
  // Security models
  Role,
  Permission,
  RolePermission,
  UserRoleAssignment,
  Session,
  LoginAttempt,
  SecurityIncident,
  IpRestriction,
  // Communication models
  MessageTemplate,
  Message,
  MessageDelivery,
  // Documents models
  Document,
  DocumentSignature,
  DocumentAuditTrail,
  // Integration models
  IntegrationConfig,
  IntegrationLog,
  // Administration models
  District,
  School,
  SystemConfiguration,
  ConfigurationHistory,
  BackupLog,
  PerformanceMetric,
  License,
  TrainingModule,
  TrainingCompletion,
};

export default sequelize;
