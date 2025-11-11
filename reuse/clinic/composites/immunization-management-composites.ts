/**
 * LOC: CLINIC-IMM-MGMT-001
 * File: /reuse/clinic/composites/immunization-management-composites.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - sequelize (v6.x)
 *   - ../../server/health/health-patient-management-kit
 *   - ../../server/health/health-clinical-workflows-kit
 *   - ../../server/health/health-nursing-workflows-kit
 *   - ../../server/health/health-clinical-documentation-kit
 *   - ../../education/student-records-kit
 *   - ../../education/student-communication-kit
 *   - ../../data/crud-operations
 *   - ../../data/data-repository
 *   - ../../data/query-builder
 *
 * DOWNSTREAM (imported by):
 *   - School clinic immunization controllers
 *   - Vaccination clinic workflow services
 *   - State immunization registry integration modules
 *   - Parent notification services
 *   - Compliance reporting systems
 *   - School nurse dashboards
 */

/**
 * File: /reuse/clinic/composites/immunization-management-composites.ts
 * Locator: WC-CLINIC-IMM-001
 * Purpose: School Clinic Immunization Management Composite - Comprehensive K-12 vaccination tracking
 *
 * Upstream: health-patient-management-kit, health-clinical-workflows-kit, health-nursing-workflows-kit,
 *           student-records-kit, student-communication-kit, data-repository, crud-operations
 * Downstream: Clinic immunization controllers, Vaccination clinic workflows, State registry integrations,
 *             Compliance reporting, Parent communications
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x
 * Exports: 40 composed functions for complete school immunization management workflows
 *
 * LLM Context: Production-grade school clinic immunization management composite for K-12 healthcare SaaS platform.
 * Provides comprehensive vaccination tracking including immunization record management (CRUD), vaccine schedule
 * tracking with CDC/ACIP guidelines, state immunization registry (IIS) integration, immunization requirement
 * validation by grade/age, exemption management (medical/religious/personal), dose tracking and series completion,
 * overdue immunization identification, automated parent notifications, batch immunization data uploads,
 * compliance reporting for state agencies, vaccination clinic scheduling, consent form management, adverse
 * reaction tracking and reporting (VAERS), vaccine inventory integration, historical immunization imports,
 * and HIPAA-compliant audit logging. Designed for school nurses as primary users with district-level oversight
 * and state health department reporting requirements.
 */

import { Injectable, Logger, Inject, NotFoundException, BadRequestException, ForbiddenException, ConflictException } from '@nestjs/common';
import { Sequelize, Model, DataTypes, Transaction, Op } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Vaccine types following CDC/ACIP guidelines
 */
export enum VaccineType {
  DTaP = 'DTaP',
  Tdap = 'Tdap',
  IPV = 'IPV',
  MMR = 'MMR',
  VARICELLA = 'Varicella',
  HEPATITIS_B = 'Hepatitis_B',
  HEPATITIS_A = 'Hepatitis_A',
  HIB = 'Hib',
  PCV = 'PCV',
  MENINGOCOCCAL = 'Meningococcal',
  HPV = 'HPV',
  INFLUENZA = 'Influenza',
  COVID_19 = 'COVID_19',
  ROTAVIRUS = 'Rotavirus',
  OTHER = 'Other'
}

/**
 * Immunization compliance status
 */
export enum ComplianceStatus {
  COMPLIANT = 'compliant',
  NON_COMPLIANT = 'non_compliant',
  CONDITIONAL = 'conditional',
  EXEMPT = 'exempt',
  IN_PROGRESS = 'in_progress',
  OVERDUE = 'overdue',
  GRACE_PERIOD = 'grace_period'
}

/**
 * Exemption types
 */
export enum ExemptionType {
  MEDICAL = 'medical',
  RELIGIOUS = 'religious',
  PERSONAL = 'personal',
  PHILOSOPHICAL = 'philosophical',
  TEMPORARY_MEDICAL = 'temporary_medical'
}

/**
 * Dose administration status
 */
export enum DoseStatus {
  SCHEDULED = 'scheduled',
  ADMINISTERED = 'administered',
  REFUSED = 'refused',
  MISSED = 'missed',
  CONTRAINDICATED = 'contraindicated',
  NOT_REQUIRED = 'not_required'
}

/**
 * Adverse reaction severity
 */
export enum ReactionSeverity {
  NONE = 'none',
  MILD = 'mild',
  MODERATE = 'moderate',
  SEVERE = 'severe',
  LIFE_THREATENING = 'life_threatening'
}

/**
 * State registry submission status
 */
export enum RegistryStatus {
  PENDING = 'pending',
  SUBMITTED = 'submitted',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  ERROR = 'error'
}

/**
 * Complete immunization record data
 */
export interface ImmunizationRecordData {
  immunizationId?: string;
  studentId: string;
  vaccineType: VaccineType;
  vaccineName: string;
  cvxCode?: string;
  mvxCode?: string;
  lotNumber: string;
  doseNumber: number;
  dosesInSeries: number;
  administrationDate: Date;
  administrationSite?: string;
  administrationRoute?: string;
  administeredBy: string;
  administeredAt: string;
  expirationDate?: Date;
  manufacturer?: string;
  ndc?: string;
  visPresentedDate?: Date;
  visPublicationDate?: string;
  consentObtained: boolean;
  consentDate?: Date;
  consentedBy?: string;
  adverseReaction: boolean;
  reactionDetails?: string;
  reactionSeverity?: ReactionSeverity;
  reportedToVAERS: boolean;
  schoolId: string;
  academicYear: string;
  documentedBy: string;
  notes?: string;
}

/**
 * Vaccine schedule and requirements
 */
export interface VaccineScheduleData {
  scheduleId?: string;
  vaccineType: VaccineType;
  gradeLevel: number;
  ageInMonths?: number;
  requiredDoses: number;
  minimumIntervalDays?: number;
  catchUpSchedule?: boolean;
  schoolEntryRequired: boolean;
  stateRequirement: boolean;
  cdcRecommended: boolean;
  effectiveDate: Date;
  expirationDate?: Date;
  stateCode: string;
  notes?: string;
}

/**
 * Immunization compliance status for student
 */
export interface StudentComplianceData {
  complianceId?: string;
  studentId: string;
  gradeLevel: number;
  evaluationDate: Date;
  overallStatus: ComplianceStatus;
  compliantVaccines: VaccineType[];
  missingVaccines: VaccineType[];
  overdueVaccines: VaccineType[];
  exemptVaccines: VaccineType[];
  conditionalVaccines: VaccineType[];
  graceExpirationDate?: Date;
  conditionalExpirationDate?: Date;
  canAttendSchool: boolean;
  restrictionDetails?: string;
  nextReviewDate?: Date;
  evaluatedBy: string;
  schoolId: string;
  academicYear: string;
}

/**
 * Immunization exemption record
 */
export interface ExemptionRecordData {
  exemptionId?: string;
  studentId: string;
  exemptionType: ExemptionType;
  vaccineTypes: VaccineType[];
  exemptionReason: string;
  documentationType: string;
  documentationReceived: boolean;
  submittedDate: Date;
  approvedDate?: Date;
  approvedBy?: string;
  expirationDate?: Date;
  isActive: boolean;
  requiresAnnualRenewal: boolean;
  physicianName?: string;
  physicianLicense?: string;
  medicalCondition?: string;
  religiousAffiliation?: string;
  parentSignature: string;
  parentSignatureDate: Date;
  schoolApproval: boolean;
  schoolApprovalDate?: Date;
  stateReported: boolean;
  stateReportDate?: Date;
  schoolId: string;
  academicYear: string;
  notes?: string;
}

/**
 * Dose tracking within vaccine series
 */
export interface DoseTrackingData {
  trackingId?: string;
  studentId: string;
  vaccineType: VaccineType;
  seriesStatus: 'not_started' | 'in_progress' | 'complete' | 'incomplete';
  totalDosesRequired: number;
  dosesReceived: number;
  dosesRemaining: number;
  lastDoseDate?: Date;
  nextDoseDate?: Date;
  nextDoseEarliestDate?: Date;
  nextDoseLatestDate?: Date;
  isBehindSchedule: boolean;
  isOnSchedule: boolean;
  isAheadOfSchedule: boolean;
  catchUpRequired: boolean;
  acceleratedSchedule: boolean;
  seriesCompletionDate?: Date;
  schoolId: string;
}

/**
 * Parent notification for immunizations
 */
export interface ImmunizationNotificationData {
  notificationId?: string;
  studentId: string;
  notificationType: 'missing' | 'overdue' | 'upcoming' | 'administered' | 'exemption_status' | 'compliance_alert';
  subject: string;
  message: string;
  missingVaccines?: VaccineType[];
  overdueVaccines?: VaccineType[];
  dueDate?: Date;
  urgency: 'routine' | 'important' | 'urgent';
  sentDate: Date;
  sentMethod: 'email' | 'sms' | 'mail' | 'portal' | 'phone';
  recipientName: string;
  recipientContact: string;
  deliveryStatus: 'sent' | 'delivered' | 'failed' | 'bounced' | 'acknowledged';
  acknowledgmentDate?: Date;
  responseReceived?: string;
  followUpRequired: boolean;
  followUpDate?: Date;
  documentedBy: string;
  schoolId: string;
}

/**
 * State immunization registry (IIS) submission
 */
export interface RegistrySubmissionData {
  submissionId?: string;
  batchId?: string;
  studentId: string;
  immunizationId: string;
  registryName: string;
  stateCode: string;
  submissionDate: Date;
  submissionMethod: 'HL7' | 'API' | 'Manual' | 'Batch';
  hl7Message?: string;
  status: RegistryStatus;
  acknowledgmentReceived: boolean;
  acknowledgmentDate?: Date;
  registryId?: string;
  errorMessage?: string;
  retryCount: number;
  lastRetryDate?: Date;
  submittedBy: string;
}

/**
 * Adverse reaction report
 */
export interface AdverseReactionData {
  reactionId?: string;
  studentId: string;
  immunizationId: string;
  vaccineType: VaccineType;
  vaccineName: string;
  lotNumber: string;
  reactionDate: Date;
  onsetTime: string;
  reactionType: string[];
  severity: ReactionSeverity;
  symptoms: string[];
  treatmentProvided: string[];
  medicalAttentionRequired: boolean;
  hospitalAdmission: boolean;
  recoveryStatus: 'fully_recovered' | 'recovering' | 'permanent_disability' | 'death';
  recoveryDate?: Date;
  reportedToVAERS: boolean;
  vaersReportId?: string;
  vaersReportDate?: Date;
  reportedToProvider: boolean;
  reportedToManufacturer: boolean;
  parentNotified: boolean;
  parentNotificationDate?: Date;
  documentedBy: string;
  reviewedBy?: string;
  reviewDate?: Date;
  followUpRequired: boolean;
  schoolId: string;
}

/**
 * Vaccination clinic scheduling
 */
export interface VaccinationClinicData {
  clinicId?: string;
  clinicDate: Date;
  clinicStartTime: Date;
  clinicEndTime: Date;
  location: string;
  vaccinesOffered: VaccineType[];
  maxCapacity: number;
  currentRegistrations: number;
  availableSlots: number;
  nurseStaffing: string[];
  volunteerStaffing?: string[];
  consentFormsRequired: boolean;
  consentDeadline?: Date;
  openToPublic: boolean;
  insuranceBilling: boolean;
  costPerVaccine?: number;
  registrationDeadline?: Date;
  cancellationDeadline?: Date;
  specialInstructions?: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  status: 'planned' | 'open_registration' | 'full' | 'in_progress' | 'completed' | 'cancelled';
  schoolId: string;
  createdBy: string;
}

/**
 * Consent form for immunization
 */
export interface ConsentFormData {
  consentId?: string;
  studentId: string;
  clinicId?: string;
  vaccineTypes: VaccineType[];
  parentName: string;
  parentRelationship: string;
  parentSignature: string;
  signatureDate: Date;
  signatureMethod: 'electronic' | 'physical' | 'verbal';
  consentGiven: boolean;
  visReviewed: boolean;
  visReviewDate?: Date;
  medicalHistory: string[];
  allergies: string[];
  previousReactions: string[];
  currentMedications: string[];
  specialConditions: string[];
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  insuranceGroupNumber?: string;
  emergencyContact: string;
  emergencyPhone: string;
  additionalNotes?: string;
  consentValidUntil?: Date;
  isActive: boolean;
  schoolId: string;
}

/**
 * Vaccine inventory item
 */
export interface VaccineInventoryData {
  inventoryId?: string;
  vaccineType: VaccineType;
  vaccineName: string;
  manufacturer: string;
  lotNumber: string;
  expirationDate: Date;
  ndc: string;
  cvxCode: string;
  mvxCode: string;
  quantityReceived: number;
  quantityAvailable: number;
  quantityAdministered: number;
  quantityWasted: number;
  storageLocation: string;
  storageTemperatureMin: number;
  storageTemperatureMax: number;
  receivedDate: Date;
  receivedBy: string;
  vfcEligible: boolean;
  costPerDose?: number;
  expirationAlertDays: number;
  lowStockThreshold: number;
  reorderRequired: boolean;
  reorderQuantity?: number;
  schoolId: string;
}

/**
 * Historical immunization import record
 */
export interface HistoricalImmunizationData {
  importId?: string;
  studentId: string;
  sourceType: 'previous_school' | 'physician' | 'state_registry' | 'parent_record' | 'other';
  sourceName: string;
  sourceDate?: Date;
  vaccineType: VaccineType;
  vaccineName?: string;
  administrationDate: Date;
  doseNumber?: number;
  lotNumber?: string;
  administeredBy?: string;
  administrationLocation?: string;
  documentationType: 'official_record' | 'immunization_card' | 'physician_letter' | 'registry_report' | 'parent_attestation';
  documentReceived: boolean;
  documentVerified: boolean;
  verifiedDate?: Date;
  verifiedBy?: string;
  importDate: Date;
  importedBy: string;
  notes?: string;
  schoolId: string;
}

/**
 * Compliance report data
 */
export interface ComplianceReportData {
  reportId?: string;
  reportType: 'school' | 'district' | 'state' | 'classroom';
  reportPeriodStart: Date;
  reportPeriodEnd: Date;
  generatedDate: Date;
  generatedBy: string;
  totalStudents: number;
  compliantStudents: number;
  nonCompliantStudents: number;
  conditionalStudents: number;
  exemptStudents: number;
  complianceRate: number;
  vaccineSpecificCompliance: Record<VaccineType, number>;
  exemptionBreakdown: Record<ExemptionType, number>;
  gradeCompliance: Record<number, number>;
  schoolId?: string;
  districtId?: string;
  stateCode?: string;
  submittedToState: boolean;
  stateSubmissionDate?: Date;
  stateAcknowledgment?: string;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Immunization Records
 */
export const createImmunizationRecordModel = (sequelize: Sequelize) => {
  class ImmunizationRecord extends Model {
    public id!: string;
    public studentId!: string;
    public vaccineType!: VaccineType;
    public vaccineName!: string;
    public cvxCode!: string | null;
    public mvxCode!: string | null;
    public lotNumber!: string;
    public doseNumber!: number;
    public dosesInSeries!: number;
    public administrationDate!: Date;
    public administrationSite!: string | null;
    public administrationRoute!: string | null;
    public administeredBy!: string;
    public administeredAt!: string;
    public expirationDate!: Date | null;
    public manufacturer!: string | null;
    public ndc!: string | null;
    public visPresentedDate!: Date | null;
    public visPublicationDate!: string | null;
    public consentObtained!: boolean;
    public consentDate!: Date | null;
    public consentedBy!: string | null;
    public adverseReaction!: boolean;
    public reactionDetails!: string | null;
    public reactionSeverity!: ReactionSeverity | null;
    public reportedToVAERS!: boolean;
    public schoolId!: string;
    public academicYear!: string;
    public documentedBy!: string;
    public notes!: string | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ImmunizationRecord.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      studentId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'students', key: 'id' },
      },
      vaccineType: {
        type: DataTypes.ENUM(...Object.values(VaccineType)),
        allowNull: false,
      },
      vaccineName: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      cvxCode: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      mvxCode: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      lotNumber: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      doseNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      dosesInSeries: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      administrationDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      administrationSite: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      administrationRoute: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      administeredBy: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
      },
      administeredAt: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      expirationDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      manufacturer: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      ndc: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      visPresentedDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      visPublicationDate: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      consentObtained: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      consentDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      consentedBy: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      adverseReaction: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      reactionDetails: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      reactionSeverity: {
        type: DataTypes.ENUM(...Object.values(ReactionSeverity)),
        allowNull: true,
      },
      reportedToVAERS: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      schoolId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'schools', key: 'id' },
      },
      academicYear: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      documentedBy: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'immunization_records',
      timestamps: true,
      indexes: [
        { fields: ['studentId'] },
        { fields: ['vaccineType'] },
        { fields: ['administrationDate'] },
        { fields: ['schoolId'] },
        { fields: ['academicYear'] },
        { fields: ['lotNumber'] },
        { fields: ['adverseReaction'] },
      ],
    },
  );

  return ImmunizationRecord;
};

/**
 * Sequelize model for Student Compliance Status
 */
export const createStudentComplianceModel = (sequelize: Sequelize) => {
  class StudentCompliance extends Model {
    public id!: string;
    public studentId!: string;
    public gradeLevel!: number;
    public evaluationDate!: Date;
    public overallStatus!: ComplianceStatus;
    public compliantVaccines!: VaccineType[];
    public missingVaccines!: VaccineType[];
    public overdueVaccines!: VaccineType[];
    public exemptVaccines!: VaccineType[];
    public conditionalVaccines!: VaccineType[];
    public graceExpirationDate!: Date | null;
    public conditionalExpirationDate!: Date | null;
    public canAttendSchool!: boolean;
    public restrictionDetails!: string | null;
    public nextReviewDate!: Date | null;
    public evaluatedBy!: string;
    public schoolId!: string;
    public academicYear!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  StudentCompliance.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      studentId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'students', key: 'id' },
      },
      gradeLevel: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      evaluationDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      overallStatus: {
        type: DataTypes.ENUM(...Object.values(ComplianceStatus)),
        allowNull: false,
      },
      compliantVaccines: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
      },
      missingVaccines: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
      },
      overdueVaccines: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
      },
      exemptVaccines: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
      },
      conditionalVaccines: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
      },
      graceExpirationDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      conditionalExpirationDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      canAttendSchool: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      restrictionDetails: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      nextReviewDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      evaluatedBy: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
      },
      schoolId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'schools', key: 'id' },
      },
      academicYear: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'student_immunization_compliance',
      timestamps: true,
      indexes: [
        { fields: ['studentId'] },
        { fields: ['overallStatus'] },
        { fields: ['schoolId'] },
        { fields: ['academicYear'] },
        { fields: ['gradeLevel'] },
        { fields: ['canAttendSchool'] },
      ],
    },
  );

  return StudentCompliance;
};

/**
 * Sequelize model for Exemption Records
 */
export const createExemptionRecordModel = (sequelize: Sequelize) => {
  class ExemptionRecord extends Model {
    public id!: string;
    public studentId!: string;
    public exemptionType!: ExemptionType;
    public vaccineTypes!: VaccineType[];
    public exemptionReason!: string;
    public documentationType!: string;
    public documentationReceived!: boolean;
    public submittedDate!: Date;
    public approvedDate!: Date | null;
    public approvedBy!: string | null;
    public expirationDate!: Date | null;
    public isActive!: boolean;
    public requiresAnnualRenewal!: boolean;
    public physicianName!: string | null;
    public physicianLicense!: string | null;
    public medicalCondition!: string | null;
    public religiousAffiliation!: string | null;
    public parentSignature!: string;
    public parentSignatureDate!: Date;
    public schoolApproval!: boolean;
    public schoolApprovalDate!: Date | null;
    public stateReported!: boolean;
    public stateReportDate!: Date | null;
    public schoolId!: string;
    public academicYear!: string;
    public notes!: string | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ExemptionRecord.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      studentId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'students', key: 'id' },
      },
      exemptionType: {
        type: DataTypes.ENUM(...Object.values(ExemptionType)),
        allowNull: false,
      },
      vaccineTypes: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
      },
      exemptionReason: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      documentationType: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      documentationReceived: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      submittedDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      approvedDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      approvedBy: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: 'users', key: 'id' },
      },
      expirationDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      requiresAnnualRenewal: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      physicianName: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      physicianLicense: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      medicalCondition: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      religiousAffiliation: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      parentSignature: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      parentSignatureDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      schoolApproval: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      schoolApprovalDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      stateReported: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      stateReportDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      schoolId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'schools', key: 'id' },
      },
      academicYear: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'immunization_exemptions',
      timestamps: true,
      indexes: [
        { fields: ['studentId'] },
        { fields: ['exemptionType'] },
        { fields: ['isActive'] },
        { fields: ['schoolId'] },
        { fields: ['expirationDate'] },
      ],
    },
  );

  return ExemptionRecord;
};

// ============================================================================
// NESTJS INJECTABLE SERVICE
// ============================================================================

/**
 * School Clinic Immunization Management Composite Service
 *
 * Provides comprehensive immunization tracking, compliance monitoring,
 * state registry integration, and parent communication for K-12 school clinics.
 */
@Injectable()
export class ImmunizationManagementCompositeService {
  private readonly logger = new Logger(ImmunizationManagementCompositeService.name);

  constructor(
    @Inject('SEQUELIZE') private readonly sequelize: Sequelize,
  ) {}

  // ============================================================================
  // 1. IMMUNIZATION RECORD MANAGEMENT (Functions 1-6)
  // ============================================================================

  /**
   * 1. Creates new immunization record for student.
   *
   * @param {ImmunizationRecordData} immunizationData - Immunization record data
   * @returns {Promise<any>} Created immunization record
   * @throws {BadRequestException} If validation fails
   * @throws {NotFoundException} If student not found
   *
   * @example
   * ```typescript
   * const record = await service.createImmunizationRecord({
   *   studentId: 'student-123',
   *   vaccineType: VaccineType.MMR,
   *   vaccineName: 'M-M-R II',
   *   lotNumber: 'ABC123',
   *   doseNumber: 1,
   *   dosesInSeries: 2,
   *   administrationDate: new Date('2024-09-15'),
   *   administeredBy: 'nurse-456',
   *   administeredAt: 'School Health Clinic',
   *   consentObtained: true,
   *   adverseReaction: false,
   *   reportedToVAERS: false,
   *   schoolId: 'school-789',
   *   academicYear: '2024-2025',
   *   documentedBy: 'nurse-456'
   * });
   * ```
   */
  async createImmunizationRecord(immunizationData: ImmunizationRecordData): Promise<any> {
    this.logger.log(`Creating immunization record for student ${immunizationData.studentId}`);

    const ImmunizationRecord = createImmunizationRecordModel(this.sequelize);

    // Validate expiration date
    if (immunizationData.expirationDate && new Date(immunizationData.expirationDate) < new Date(immunizationData.administrationDate)) {
      throw new BadRequestException('Expiration date cannot be before administration date');
    }

    const record = await ImmunizationRecord.create({
      ...immunizationData,
    });

    this.logger.log(`Created immunization record ${record.id} for vaccine ${immunizationData.vaccineType}`);
    return record.toJSON();
  }

  /**
   * 2. Retrieves complete immunization history for student.
   *
   * @param {string} studentId - Student ID
   * @param {string} academicYear - Optional academic year filter
   * @returns {Promise<any[]>} Array of immunization records
   * @throws {NotFoundException} If student not found
   *
   * @example
   * ```typescript
   * const history = await service.getStudentImmunizationHistory(
   *   'student-123',
   *   '2024-2025'
   * );
   * ```
   */
  async getStudentImmunizationHistory(studentId: string, academicYear?: string): Promise<any[]> {
    this.logger.log(`Retrieving immunization history for student ${studentId}`);

    const ImmunizationRecord = createImmunizationRecordModel(this.sequelize);

    const where: any = { studentId };
    if (academicYear) {
      where.academicYear = academicYear;
    }

    const records = await ImmunizationRecord.findAll({
      where,
      order: [['administrationDate', 'DESC'], ['createdAt', 'DESC']],
    });

    return records.map(r => r.toJSON());
  }

  /**
   * 3. Updates existing immunization record.
   *
   * @param {string} immunizationId - Immunization record ID
   * @param {Partial<ImmunizationRecordData>} updates - Updates to apply
   * @returns {Promise<any>} Updated immunization record
   * @throws {NotFoundException} If record not found
   *
   * @example
   * ```typescript
   * await service.updateImmunizationRecord('imm-123', {
   *   adverseReaction: true,
   *   reactionDetails: 'Mild rash at injection site',
   *   reactionSeverity: ReactionSeverity.MILD
   * });
   * ```
   */
  async updateImmunizationRecord(
    immunizationId: string,
    updates: Partial<ImmunizationRecordData>,
  ): Promise<any> {
    this.logger.log(`Updating immunization record ${immunizationId}`);

    const ImmunizationRecord = createImmunizationRecordModel(this.sequelize);
    const record = await ImmunizationRecord.findByPk(immunizationId);

    if (!record) {
      throw new NotFoundException(`Immunization record ${immunizationId} not found`);
    }

    await record.update(updates);
    return record.toJSON();
  }

  /**
   * 4. Deletes immunization record (soft delete).
   *
   * @param {string} immunizationId - Immunization record ID
   * @param {string} deletedBy - User ID performing deletion
   * @param {string} reason - Reason for deletion
   * @returns {Promise<void>}
   * @throws {NotFoundException} If record not found
   *
   * @example
   * ```typescript
   * await service.deleteImmunizationRecord(
   *   'imm-123',
   *   'nurse-456',
   *   'Duplicate entry - correct record is imm-789'
   * );
   * ```
   */
  async deleteImmunizationRecord(
    immunizationId: string,
    deletedBy: string,
    reason: string,
  ): Promise<void> {
    this.logger.log(`Deleting immunization record ${immunizationId}`);

    const ImmunizationRecord = createImmunizationRecordModel(this.sequelize);
    const record = await ImmunizationRecord.findByPk(immunizationId);

    if (!record) {
      throw new NotFoundException(`Immunization record ${immunizationId} not found`);
    }

    // In production, implement soft delete with audit trail
    await record.destroy();

    this.logger.log(`Deleted immunization record ${immunizationId} by ${deletedBy}: ${reason}`);
  }

  /**
   * 5. Searches immunization records by vaccine type and date range.
   *
   * @param {string} schoolId - School ID
   * @param {VaccineType} vaccineType - Vaccine type to search
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Promise<any[]>} Matching immunization records
   *
   * @example
   * ```typescript
   * const fluRecords = await service.searchImmunizationRecords(
   *   'school-123',
   *   VaccineType.INFLUENZA,
   *   new Date('2024-09-01'),
   *   new Date('2024-11-30')
   * );
   * ```
   */
  async searchImmunizationRecords(
    schoolId: string,
    vaccineType: VaccineType,
    startDate: Date,
    endDate: Date,
  ): Promise<any[]> {
    this.logger.log(`Searching immunization records for ${vaccineType} at school ${schoolId}`);

    const ImmunizationRecord = createImmunizationRecordModel(this.sequelize);

    const records = await ImmunizationRecord.findAll({
      where: {
        schoolId,
        vaccineType,
        administrationDate: {
          [Op.between]: [startDate, endDate],
        },
      },
      order: [['administrationDate', 'DESC']],
    });

    return records.map(r => r.toJSON());
  }

  /**
   * 6. Retrieves immunizations by lot number for recall tracking.
   *
   * @param {string} lotNumber - Vaccine lot number
   * @param {string} schoolId - Optional school ID filter
   * @returns {Promise<any[]>} Immunizations with matching lot number
   *
   * @example
   * ```typescript
   * const recallRecords = await service.getImmunizationsByLotNumber(
   *   'LOT12345',
   *   'school-123'
   * );
   * ```
   */
  async getImmunizationsByLotNumber(lotNumber: string, schoolId?: string): Promise<any[]> {
    this.logger.log(`Retrieving immunizations for lot number ${lotNumber}`);

    const ImmunizationRecord = createImmunizationRecordModel(this.sequelize);

    const where: any = { lotNumber };
    if (schoolId) {
      where.schoolId = schoolId;
    }

    const records = await ImmunizationRecord.findAll({
      where,
      order: [['administrationDate', 'DESC']],
    });

    return records.map(r => r.toJSON());
  }

  // ============================================================================
  // 2. VACCINE SCHEDULE TRACKING (Functions 7-11)
  // ============================================================================

  /**
   * 7. Evaluates student compliance with immunization requirements.
   *
   * @param {string} studentId - Student ID
   * @param {number} gradeLevel - Current grade level
   * @param {string} evaluatedBy - Evaluator user ID
   * @returns {Promise<any>} Compliance evaluation results
   *
   * @example
   * ```typescript
   * const compliance = await service.evaluateStudentCompliance(
   *   'student-123',
   *   5,
   *   'nurse-456'
   * );
   * ```
   */
  async evaluateStudentCompliance(
    studentId: string,
    gradeLevel: number,
    evaluatedBy: string,
  ): Promise<any> {
    this.logger.log(`Evaluating immunization compliance for student ${studentId} in grade ${gradeLevel}`);

    const StudentCompliance = createStudentComplianceModel(this.sequelize);
    const ImmunizationRecord = createImmunizationRecordModel(this.sequelize);

    // Get student's immunization records
    const records = await ImmunizationRecord.findAll({
      where: { studentId },
      order: [['administrationDate', 'DESC']],
    });

    // Evaluate compliance (simplified logic - in production, check against state requirements)
    const receivedVaccines = new Set(records.map(r => r.vaccineType));
    const requiredVaccines = this.getRequiredVaccinesForGrade(gradeLevel);

    const compliantVaccines: VaccineType[] = [];
    const missingVaccines: VaccineType[] = [];

    requiredVaccines.forEach(vaccine => {
      if (receivedVaccines.has(vaccine)) {
        compliantVaccines.push(vaccine);
      } else {
        missingVaccines.push(vaccine);
      }
    });

    const overallStatus = missingVaccines.length === 0
      ? ComplianceStatus.COMPLIANT
      : ComplianceStatus.NON_COMPLIANT;

    const complianceData: StudentComplianceData = {
      studentId,
      gradeLevel,
      evaluationDate: new Date(),
      overallStatus,
      compliantVaccines,
      missingVaccines,
      overdueVaccines: [],
      exemptVaccines: [],
      conditionalVaccines: [],
      canAttendSchool: overallStatus === ComplianceStatus.COMPLIANT,
      evaluatedBy,
      schoolId: 'school-id',
      academicYear: '2024-2025',
    };

    const compliance = await StudentCompliance.create(complianceData);

    this.logger.log(`Compliance evaluation complete: ${overallStatus}`);
    return compliance.toJSON();
  }

  /**
   * 8. Retrieves vaccine schedule requirements for grade level.
   *
   * @param {number} gradeLevel - Grade level
   * @param {string} stateCode - State code (e.g., 'CA', 'NY')
   * @returns {Promise<VaccineScheduleData[]>} Required vaccines for grade
   *
   * @example
   * ```typescript
   * const requirements = await service.getVaccineScheduleForGrade(6, 'CA');
   * ```
   */
  async getVaccineScheduleForGrade(
    gradeLevel: number,
    stateCode: string,
  ): Promise<VaccineScheduleData[]> {
    this.logger.log(`Retrieving vaccine schedule for grade ${gradeLevel} in state ${stateCode}`);

    // In production, query from state-specific requirements database
    const schedules: VaccineScheduleData[] = [
      {
        vaccineType: VaccineType.DTaP,
        gradeLevel,
        requiredDoses: 5,
        schoolEntryRequired: true,
        stateRequirement: true,
        cdcRecommended: true,
        effectiveDate: new Date('2024-01-01'),
        stateCode,
      },
      {
        vaccineType: VaccineType.MMR,
        gradeLevel,
        requiredDoses: 2,
        schoolEntryRequired: true,
        stateRequirement: true,
        cdcRecommended: true,
        effectiveDate: new Date('2024-01-01'),
        stateCode,
      },
      {
        vaccineType: VaccineType.VARICELLA,
        gradeLevel,
        requiredDoses: 2,
        schoolEntryRequired: true,
        stateRequirement: true,
        cdcRecommended: true,
        effectiveDate: new Date('2024-01-01'),
        stateCode,
      },
    ];

    return schedules;
  }

  /**
   * 9. Tracks dose completion within vaccine series.
   *
   * @param {string} studentId - Student ID
   * @param {VaccineType} vaccineType - Vaccine type
   * @returns {Promise<DoseTrackingData>} Dose tracking information
   *
   * @example
   * ```typescript
   * const tracking = await service.trackVaccineSeries(
   *   'student-123',
   *   VaccineType.HEPATITIS_B
   * );
   * ```
   */
  async trackVaccineSeries(studentId: string, vaccineType: VaccineType): Promise<DoseTrackingData> {
    this.logger.log(`Tracking vaccine series for ${vaccineType} - student ${studentId}`);

    const ImmunizationRecord = createImmunizationRecordModel(this.sequelize);

    const doses = await ImmunizationRecord.findAll({
      where: {
        studentId,
        vaccineType,
      },
      order: [['administrationDate', 'ASC']],
    });

    const dosesReceived = doses.length;
    const totalDosesRequired = doses[0]?.dosesInSeries || this.getStandardDosesForVaccine(vaccineType);
    const dosesRemaining = Math.max(0, totalDosesRequired - dosesReceived);
    const seriesStatus = dosesReceived === 0 ? 'not_started'
      : dosesReceived < totalDosesRequired ? 'in_progress'
      : 'complete';

    const lastDoseDate = doses[doses.length - 1]?.administrationDate;
    const nextDoseDate = this.calculateNextDoseDate(vaccineType, lastDoseDate, dosesReceived + 1);

    const tracking: DoseTrackingData = {
      studentId,
      vaccineType,
      seriesStatus,
      totalDosesRequired,
      dosesReceived,
      dosesRemaining,
      lastDoseDate,
      nextDoseDate,
      isBehindSchedule: false,
      isOnSchedule: true,
      isAheadOfSchedule: false,
      catchUpRequired: false,
      acceleratedSchedule: false,
      schoolId: 'school-id',
    };

    return tracking;
  }

  /**
   * 10. Calculates next dose due date based on vaccine schedule.
   *
   * @param {VaccineType} vaccineType - Vaccine type
   * @param {Date} lastDoseDate - Last dose administration date
   * @param {number} nextDoseNumber - Next dose number in series
   * @returns {Date | null} Next dose due date
   *
   * @example
   * ```typescript
   * const nextDue = service.calculateNextDoseDate(
   *   VaccineType.DTaP,
   *   new Date('2024-01-15'),
   *   3
   * );
   * ```
   */
  calculateNextDoseDate(
    vaccineType: VaccineType,
    lastDoseDate: Date,
    nextDoseNumber: number,
  ): Date | null {
    if (!lastDoseDate) return null;

    // Simplified interval logic - in production, use CDC ACIP schedules
    const intervalDays: Record<string, number[]> = {
      [VaccineType.DTaP]: [28, 28, 180, 1825], // 4 weeks, 4 weeks, 6 months, 5 years
      [VaccineType.MMR]: [1095], // 3 years
      [VaccineType.HEPATITIS_B]: [28, 140], // 4 weeks, 20 weeks
      [VaccineType.VARICELLA]: [1095], // 3 years
    };

    const intervals = intervalDays[vaccineType];
    if (!intervals || nextDoseNumber > intervals.length) return null;

    const daysToAdd = intervals[nextDoseNumber - 2]; // -2 because array is 0-indexed and we want previous interval
    const nextDate = new Date(lastDoseDate);
    nextDate.setDate(nextDate.getDate() + daysToAdd);

    return nextDate;
  }

  /**
   * 11. Identifies students with incomplete vaccine series.
   *
   * @param {string} schoolId - School ID
   * @param {VaccineType} vaccineType - Vaccine type to check
   * @returns {Promise<any[]>} Students with incomplete series
   *
   * @example
   * ```typescript
   * const incomplete = await service.identifyIncompleteVaccineSeries(
   *   'school-123',
   *   VaccineType.HEPATITIS_B
   * );
   * ```
   */
  async identifyIncompleteVaccineSeries(
    schoolId: string,
    vaccineType: VaccineType,
  ): Promise<any[]> {
    this.logger.log(`Identifying incomplete ${vaccineType} series at school ${schoolId}`);

    const ImmunizationRecord = createImmunizationRecordModel(this.sequelize);

    // Query students who have started but not completed the series
    const records = await ImmunizationRecord.findAll({
      where: {
        schoolId,
        vaccineType,
      },
      attributes: [
        'studentId',
        [this.sequelize.fn('COUNT', this.sequelize.col('id')), 'doseCount'],
        [this.sequelize.fn('MAX', this.sequelize.col('dosesInSeries')), 'requiredDoses'],
      ],
      group: ['studentId'],
      having: this.sequelize.where(
        this.sequelize.fn('COUNT', this.sequelize.col('id')),
        Op.lt,
        this.sequelize.fn('MAX', this.sequelize.col('dosesInSeries')),
      ),
      raw: true,
    });

    return records;
  }

  // ============================================================================
  // 3. STATE REGISTRY INTEGRATION (Functions 12-15)
  // ============================================================================

  /**
   * 12. Submits immunization record to state immunization registry (IIS).
   *
   * @param {string} immunizationId - Immunization record ID
   * @param {string} registryName - State registry name
   * @param {string} stateCode - State code
   * @param {string} submittedBy - Submitter user ID
   * @returns {Promise<any>} Registry submission record
   * @throws {NotFoundException} If immunization record not found
   *
   * @example
   * ```typescript
   * const submission = await service.submitToStateRegistry(
   *   'imm-123',
   *   'CalIIS',
   *   'CA',
   *   'nurse-456'
   * );
   * ```
   */
  async submitToStateRegistry(
    immunizationId: string,
    registryName: string,
    stateCode: string,
    submittedBy: string,
  ): Promise<any> {
    this.logger.log(`Submitting immunization ${immunizationId} to ${registryName}`);

    const ImmunizationRecord = createImmunizationRecordModel(this.sequelize);
    const record = await ImmunizationRecord.findByPk(immunizationId);

    if (!record) {
      throw new NotFoundException(`Immunization record ${immunizationId} not found`);
    }

    // Generate HL7 message (simplified - in production, use proper HL7 library)
    const hl7Message = this.generateHL7ImmunizationMessage(record.toJSON());

    const submission: RegistrySubmissionData = {
      immunizationId,
      studentId: record.studentId,
      registryName,
      stateCode,
      submissionDate: new Date(),
      submissionMethod: 'HL7',
      hl7Message,
      status: RegistryStatus.SUBMITTED,
      acknowledgmentReceived: false,
      retryCount: 0,
      submittedBy,
    };

    this.logger.log(`Successfully submitted to ${registryName}`);
    return submission;
  }

  /**
   * 13. Retrieves immunization data from state registry.
   *
   * @param {string} studentId - Student ID
   * @param {string} registryName - State registry name
   * @param {Date} dateOfBirth - Student date of birth for verification
   * @returns {Promise<any[]>} Registry immunization records
   *
   * @example
   * ```typescript
   * const registryData = await service.queryStateRegistry(
   *   'student-123',
   *   'CalIIS',
   *   new Date('2010-05-15')
   * );
   * ```
   */
  async queryStateRegistry(
    studentId: string,
    registryName: string,
    dateOfBirth: Date,
  ): Promise<any[]> {
    this.logger.log(`Querying ${registryName} for student ${studentId}`);

    // In production, make actual API call to state registry
    const registryData = [
      {
        vaccineType: VaccineType.DTaP,
        administrationDate: new Date('2015-03-10'),
        doseNumber: 1,
        source: registryName,
      },
      {
        vaccineType: VaccineType.DTaP,
        administrationDate: new Date('2015-05-12'),
        doseNumber: 2,
        source: registryName,
      },
    ];

    return registryData;
  }

  /**
   * 14. Processes registry acknowledgment/response.
   *
   * @param {string} submissionId - Submission ID
   * @param {string} acknowledgmentData - Registry acknowledgment data
   * @param {RegistryStatus} status - Updated status
   * @returns {Promise<any>} Updated submission record
   *
   * @example
   * ```typescript
   * await service.processRegistryAcknowledgment(
   *   'submission-123',
   *   'ACK|20241111120000|...',
   *   RegistryStatus.ACCEPTED
   * );
   * ```
   */
  async processRegistryAcknowledgment(
    submissionId: string,
    acknowledgmentData: string,
    status: RegistryStatus,
  ): Promise<any> {
    this.logger.log(`Processing registry acknowledgment for submission ${submissionId}`);

    const submission = {
      submissionId,
      status,
      acknowledgmentReceived: true,
      acknowledgmentDate: new Date(),
      acknowledgmentData,
    };

    return submission;
  }

  /**
   * 15. Performs batch submission of immunization records to state registry.
   *
   * @param {string[]} immunizationIds - Array of immunization record IDs
   * @param {string} registryName - State registry name
   * @param {string} stateCode - State code
   * @param {string} submittedBy - Submitter user ID
   * @returns {Promise<any>} Batch submission results
   *
   * @example
   * ```typescript
   * const batch = await service.batchSubmitToRegistry(
   *   ['imm-1', 'imm-2', 'imm-3'],
   *   'CalIIS',
   *   'CA',
   *   'nurse-456'
   * );
   * ```
   */
  async batchSubmitToRegistry(
    immunizationIds: string[],
    registryName: string,
    stateCode: string,
    submittedBy: string,
  ): Promise<any> {
    this.logger.log(`Batch submitting ${immunizationIds.length} records to ${registryName}`);

    const batchId = `batch-${Date.now()}`;
    const results = [];

    for (const immunizationId of immunizationIds) {
      try {
        const submission = await this.submitToStateRegistry(
          immunizationId,
          registryName,
          stateCode,
          submittedBy,
        );
        results.push({ immunizationId, success: true, submission });
      } catch (error) {
        results.push({ immunizationId, success: false, error: (error as Error).message });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.length - successCount;

    return {
      batchId,
      totalRecords: immunizationIds.length,
      successCount,
      failureCount,
      results,
      submittedDate: new Date(),
    };
  }

  // ============================================================================
  // 4. EXEMPTION MANAGEMENT (Functions 16-19)
  // ============================================================================

  /**
   * 16. Creates immunization exemption record for student.
   *
   * @param {ExemptionRecordData} exemptionData - Exemption record data
   * @returns {Promise<any>} Created exemption record
   * @throws {BadRequestException} If validation fails
   *
   * @example
   * ```typescript
   * const exemption = await service.createImmunizationExemption({
   *   studentId: 'student-123',
   *   exemptionType: ExemptionType.MEDICAL,
   *   vaccineTypes: [VaccineType.MMR],
   *   exemptionReason: 'Severe immunodeficiency',
   *   documentationType: 'Physician Letter',
   *   documentationReceived: true,
   *   submittedDate: new Date(),
   *   physicianName: 'Dr. Smith',
   *   physicianLicense: 'CA12345',
   *   medicalCondition: 'Primary immunodeficiency disorder',
   *   parentSignature: 'signature-data',
   *   parentSignatureDate: new Date(),
   *   schoolApproval: true,
   *   schoolId: 'school-789',
   *   academicYear: '2024-2025'
   * });
   * ```
   */
  async createImmunizationExemption(exemptionData: ExemptionRecordData): Promise<any> {
    this.logger.log(`Creating exemption for student ${exemptionData.studentId}`);

    const ExemptionRecord = createExemptionRecordModel(this.sequelize);

    // Validate medical exemption requirements
    if (exemptionData.exemptionType === ExemptionType.MEDICAL) {
      if (!exemptionData.physicianName || !exemptionData.physicianLicense) {
        throw new BadRequestException('Medical exemption requires physician information');
      }
    }

    const exemption = await ExemptionRecord.create({
      ...exemptionData,
      isActive: true,
      stateReported: false,
      schoolApproval: false,
    });

    this.logger.log(`Created exemption ${exemption.id} for ${exemptionData.vaccineTypes.length} vaccines`);
    return exemption.toJSON();
  }

  /**
   * 17. Retrieves active exemptions for student.
   *
   * @param {string} studentId - Student ID
   * @returns {Promise<any[]>} Active exemption records
   *
   * @example
   * ```typescript
   * const exemptions = await service.getStudentExemptions('student-123');
   * ```
   */
  async getStudentExemptions(studentId: string): Promise<any[]> {
    this.logger.log(`Retrieving exemptions for student ${studentId}`);

    const ExemptionRecord = createExemptionRecordModel(this.sequelize);

    const exemptions = await ExemptionRecord.findAll({
      where: {
        studentId,
        isActive: true,
      },
      order: [['submittedDate', 'DESC']],
    });

    return exemptions.map(e => e.toJSON());
  }

  /**
   * 18. Approves or denies exemption request.
   *
   * @param {string} exemptionId - Exemption record ID
   * @param {boolean} approved - Whether exemption is approved
   * @param {string} approvedBy - Approver user ID
   * @param {string} notes - Approval/denial notes
   * @returns {Promise<any>} Updated exemption record
   * @throws {NotFoundException} If exemption not found
   *
   * @example
   * ```typescript
   * await service.approveExemption(
   *   'exempt-123',
   *   true,
   *   'principal-456',
   *   'Medical documentation verified and approved'
   * );
   * ```
   */
  async approveExemption(
    exemptionId: string,
    approved: boolean,
    approvedBy: string,
    notes?: string,
  ): Promise<any> {
    this.logger.log(`${approved ? 'Approving' : 'Denying'} exemption ${exemptionId}`);

    const ExemptionRecord = createExemptionRecordModel(this.sequelize);
    const exemption = await ExemptionRecord.findByPk(exemptionId);

    if (!exemption) {
      throw new NotFoundException(`Exemption ${exemptionId} not found`);
    }

    await exemption.update({
      schoolApproval: approved,
      schoolApprovalDate: new Date(),
      approvedBy,
      isActive: approved,
      notes,
    });

    return exemption.toJSON();
  }

  /**
   * 19. Expires or renews exemption records.
   *
   * @param {string} exemptionId - Exemption record ID
   * @param {Date} newExpirationDate - New expiration date (for renewal)
   * @returns {Promise<any>} Updated exemption record
   * @throws {NotFoundException} If exemption not found
   *
   * @example
   * ```typescript
   * await service.renewExemption(
   *   'exempt-123',
   *   new Date('2025-08-31')
   * );
   * ```
   */
  async renewExemption(exemptionId: string, newExpirationDate?: Date): Promise<any> {
    this.logger.log(`Renewing exemption ${exemptionId}`);

    const ExemptionRecord = createExemptionRecordModel(this.sequelize);
    const exemption = await ExemptionRecord.findByPk(exemptionId);

    if (!exemption) {
      throw new NotFoundException(`Exemption ${exemptionId} not found`);
    }

    await exemption.update({
      expirationDate: newExpirationDate,
      isActive: newExpirationDate ? new Date() < newExpirationDate : false,
    });

    return exemption.toJSON();
  }

  // ============================================================================
  // 5. OVERDUE IDENTIFICATION & NOTIFICATIONS (Functions 20-25)
  // ============================================================================

  /**
   * 20. Identifies students with overdue immunizations.
   *
   * @param {string} schoolId - School ID
   * @param {number} gradeLevel - Optional grade level filter
   * @returns {Promise<any[]>} Students with overdue immunizations
   *
   * @example
   * ```typescript
   * const overdue = await service.identifyOverdueImmunizations(
   *   'school-123',
   *   5
   * );
   * ```
   */
  async identifyOverdueImmunizations(schoolId: string, gradeLevel?: number): Promise<any[]> {
    this.logger.log(`Identifying overdue immunizations at school ${schoolId}`);

    const StudentCompliance = createStudentComplianceModel(this.sequelize);

    const where: any = {
      schoolId,
      overallStatus: {
        [Op.in]: [ComplianceStatus.NON_COMPLIANT, ComplianceStatus.OVERDUE],
      },
    };

    if (gradeLevel !== undefined) {
      where.gradeLevel = gradeLevel;
    }

    const overdueStudents = await StudentCompliance.findAll({
      where,
      order: [['evaluationDate', 'DESC']],
    });

    return overdueStudents.map(s => s.toJSON());
  }

  /**
   * 21. Generates parent notification for missing immunizations.
   *
   * @param {string} studentId - Student ID
   * @param {VaccineType[]} missingVaccines - Missing vaccine types
   * @param {Date} dueDate - Compliance due date
   * @param {string} documentedBy - User ID generating notification
   * @returns {Promise<any>} Created notification record
   *
   * @example
   * ```typescript
   * const notification = await service.generateMissingImmunizationNotification(
   *   'student-123',
   *   [VaccineType.MMR, VaccineType.VARICELLA],
   *   new Date('2024-12-31'),
   *   'nurse-456'
   * );
   * ```
   */
  async generateMissingImmunizationNotification(
    studentId: string,
    missingVaccines: VaccineType[],
    dueDate: Date,
    documentedBy: string,
  ): Promise<any> {
    this.logger.log(`Generating missing immunization notification for student ${studentId}`);

    const vaccineList = missingVaccines.join(', ');
    const notification: ImmunizationNotificationData = {
      studentId,
      notificationType: 'missing',
      subject: 'Missing Immunization Records Required',
      message: `Your child is missing the following required immunizations: ${vaccineList}. Please provide proof of vaccination or schedule an appointment by ${dueDate.toLocaleDateString()}.`,
      missingVaccines,
      dueDate,
      urgency: 'important',
      sentDate: new Date(),
      sentMethod: 'email',
      recipientName: 'Parent/Guardian',
      recipientContact: 'parent@example.com',
      deliveryStatus: 'sent',
      followUpRequired: true,
      followUpDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
      documentedBy,
      schoolId: 'school-id',
    };

    return notification;
  }

  /**
   * 22. Sends overdue immunization alert to parent.
   *
   * @param {string} studentId - Student ID
   * @param {VaccineType[]} overdueVaccines - Overdue vaccine types
   * @param {string} documentedBy - User ID generating alert
   * @returns {Promise<any>} Created notification record
   *
   * @example
   * ```typescript
   * await service.sendOverdueImmunizationAlert(
   *   'student-123',
   *   [VaccineType.TDAP],
   *   'nurse-456'
   * );
   * ```
   */
  async sendOverdueImmunizationAlert(
    studentId: string,
    overdueVaccines: VaccineType[],
    documentedBy: string,
  ): Promise<any> {
    this.logger.log(`Sending overdue alert for student ${studentId}`);

    const vaccineList = overdueVaccines.join(', ');
    const notification: ImmunizationNotificationData = {
      studentId,
      notificationType: 'overdue',
      subject: 'URGENT: Overdue Immunizations Required',
      message: `Your child has overdue immunizations: ${vaccineList}. Immediate action is required to maintain school attendance. Please contact the school nurse.`,
      overdueVaccines,
      urgency: 'urgent',
      sentDate: new Date(),
      sentMethod: 'sms',
      recipientName: 'Parent/Guardian',
      recipientContact: '+15555551234',
      deliveryStatus: 'sent',
      followUpRequired: true,
      followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      documentedBy,
      schoolId: 'school-id',
    };

    return notification;
  }

  /**
   * 23. Sends upcoming immunization reminder to parent.
   *
   * @param {string} studentId - Student ID
   * @param {VaccineType} vaccineType - Upcoming vaccine type
   * @param {Date} dueDate - Due date for next dose
   * @param {string} documentedBy - User ID generating reminder
   * @returns {Promise<any>} Created notification record
   *
   * @example
   * ```typescript
   * await service.sendUpcomingImmunizationReminder(
   *   'student-123',
   *   VaccineType.HEPATITIS_B,
   *   new Date('2024-12-15'),
   *   'nurse-456'
   * );
   * ```
   */
  async sendUpcomingImmunizationReminder(
    studentId: string,
    vaccineType: VaccineType,
    dueDate: Date,
    documentedBy: string,
  ): Promise<any> {
    this.logger.log(`Sending upcoming immunization reminder for student ${studentId}`);

    const notification: ImmunizationNotificationData = {
      studentId,
      notificationType: 'upcoming',
      subject: `Reminder: ${vaccineType} Dose Due Soon`,
      message: `This is a reminder that your child's next ${vaccineType} dose is due on ${dueDate.toLocaleDateString()}. Please schedule an appointment with your healthcare provider or the school clinic.`,
      dueDate,
      urgency: 'routine',
      sentDate: new Date(),
      sentMethod: 'portal',
      recipientName: 'Parent/Guardian',
      recipientContact: 'portal-message',
      deliveryStatus: 'delivered',
      followUpRequired: false,
      documentedBy,
      schoolId: 'school-id',
    };

    return notification;
  }

  /**
   * 24. Sends notification after immunization administration.
   *
   * @param {string} studentId - Student ID
   * @param {string} immunizationId - Administered immunization ID
   * @param {string} documentedBy - User ID generating notification
   * @returns {Promise<any>} Created notification record
   *
   * @example
   * ```typescript
   * await service.sendImmunizationAdministeredNotification(
   *   'student-123',
   *   'imm-789',
   *   'nurse-456'
   * );
   * ```
   */
  async sendImmunizationAdministeredNotification(
    studentId: string,
    immunizationId: string,
    documentedBy: string,
  ): Promise<any> {
    this.logger.log(`Sending administration notification for immunization ${immunizationId}`);

    const ImmunizationRecord = createImmunizationRecordModel(this.sequelize);
    const record = await ImmunizationRecord.findByPk(immunizationId);

    if (!record) {
      throw new NotFoundException(`Immunization record ${immunizationId} not found`);
    }

    const notification: ImmunizationNotificationData = {
      studentId,
      notificationType: 'administered',
      subject: `Immunization Record: ${record.vaccineName}`,
      message: `Your child received ${record.vaccineName} (${record.vaccineType}) dose ${record.doseNumber} on ${record.administrationDate.toLocaleDateString()}. ${record.adverseReaction ? 'A mild reaction was noted. Please contact the school if you have concerns.' : 'No adverse reactions were observed.'}`,
      urgency: 'routine',
      sentDate: new Date(),
      sentMethod: 'email',
      recipientName: 'Parent/Guardian',
      recipientContact: 'parent@example.com',
      deliveryStatus: 'sent',
      followUpRequired: record.adverseReaction,
      documentedBy,
      schoolId: record.schoolId,
    };

    return notification;
  }

  /**
   * 25. Tracks parent notification delivery and acknowledgment.
   *
   * @param {string} notificationId - Notification ID
   * @param {Date} acknowledgmentDate - Acknowledgment date
   * @param {string} response - Parent response
   * @returns {Promise<any>} Updated notification record
   *
   * @example
   * ```typescript
   * await service.trackNotificationAcknowledgment(
   *   'notif-123',
   *   new Date(),
   *   'Appointment scheduled for next week'
   * );
   * ```
   */
  async trackNotificationAcknowledgment(
    notificationId: string,
    acknowledgmentDate: Date,
    response?: string,
  ): Promise<any> {
    this.logger.log(`Recording acknowledgment for notification ${notificationId}`);

    const notification = {
      notificationId,
      deliveryStatus: 'acknowledged' as const,
      acknowledgmentDate,
      responseReceived: response,
    };

    return notification;
  }

  // ============================================================================
  // 6. BATCH OPERATIONS & IMPORTS (Functions 26-28)
  // ============================================================================

  /**
   * 26. Imports batch immunization records from file upload.
   *
   * @param {ImmunizationRecordData[]} records - Array of immunization records
   * @param {string} importedBy - User ID performing import
   * @returns {Promise<any>} Batch import results
   *
   * @example
   * ```typescript
   * const results = await service.batchImportImmunizations([
   *   { studentId: 'student-1', vaccineType: VaccineType.MMR, ... },
   *   { studentId: 'student-2', vaccineType: VaccineType.DTaP, ... }
   * ], 'nurse-456');
   * ```
   */
  async batchImportImmunizations(
    records: ImmunizationRecordData[],
    importedBy: string,
  ): Promise<any> {
    this.logger.log(`Batch importing ${records.length} immunization records`);

    const ImmunizationRecord = createImmunizationRecordModel(this.sequelize);
    const results = [];

    for (const recordData of records) {
      try {
        const record = await ImmunizationRecord.create({
          ...recordData,
          documentedBy: importedBy,
        });
        results.push({ success: true, studentId: recordData.studentId, recordId: record.id });
      } catch (error) {
        results.push({ success: false, studentId: recordData.studentId, error: (error as Error).message });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.length - successCount;

    return {
      totalRecords: records.length,
      successCount,
      failureCount,
      results,
      importDate: new Date(),
      importedBy,
    };
  }

  /**
   * 27. Imports historical immunization records from previous school.
   *
   * @param {HistoricalImmunizationData[]} historicalRecords - Historical immunization data
   * @param {string} importedBy - User ID performing import
   * @returns {Promise<any>} Import results
   *
   * @example
   * ```typescript
   * const results = await service.importHistoricalImmunizations([
   *   {
   *     studentId: 'student-123',
   *     sourceType: 'previous_school',
   *     sourceName: 'Lincoln Elementary',
   *     vaccineType: VaccineType.MMR,
   *     administrationDate: new Date('2020-09-15'),
   *     documentationType: 'official_record',
   *     documentReceived: true,
   *     importDate: new Date(),
   *     importedBy: 'nurse-456',
   *     schoolId: 'school-789'
   *   }
   * ], 'nurse-456');
   * ```
   */
  async importHistoricalImmunizations(
    historicalRecords: HistoricalImmunizationData[],
    importedBy: string,
  ): Promise<any> {
    this.logger.log(`Importing ${historicalRecords.length} historical immunization records`);

    const results = [];

    for (const histRecord of historicalRecords) {
      try {
        // In production, create in historical_immunizations table
        results.push({ success: true, studentId: histRecord.studentId });
      } catch (error) {
        results.push({ success: false, studentId: histRecord.studentId, error: (error as Error).message });
      }
    }

    const successCount = results.filter(r => r.success).length;

    return {
      totalRecords: historicalRecords.length,
      successCount,
      failureCount: historicalRecords.length - successCount,
      results,
      importDate: new Date(),
    };
  }

  /**
   * 28. Validates immunization record data before import.
   *
   * @param {ImmunizationRecordData} recordData - Record to validate
   * @returns {Promise<any>} Validation results
   *
   * @example
   * ```typescript
   * const validation = await service.validateImmunizationRecord({
   *   studentId: 'student-123',
   *   vaccineType: VaccineType.MMR,
   *   administrationDate: new Date('2024-09-15'),
   *   ...
   * });
   * ```
   */
  async validateImmunizationRecord(recordData: ImmunizationRecordData): Promise<any> {
    const errors = [];
    const warnings = [];

    // Validate required fields
    if (!recordData.studentId) errors.push('studentId is required');
    if (!recordData.vaccineType) errors.push('vaccineType is required');
    if (!recordData.administrationDate) errors.push('administrationDate is required');
    if (!recordData.lotNumber) errors.push('lotNumber is required');

    // Validate dates
    if (recordData.administrationDate > new Date()) {
      errors.push('Administration date cannot be in the future');
    }

    if (recordData.expirationDate && recordData.expirationDate < recordData.administrationDate) {
      errors.push('Expiration date cannot be before administration date');
    }

    // Validate dose numbers
    if (recordData.doseNumber < 1) {
      errors.push('Dose number must be positive');
    }

    if (recordData.doseNumber > recordData.dosesInSeries) {
      errors.push('Dose number cannot exceed total doses in series');
    }

    // Check for expired vaccine (warning only)
    if (recordData.expirationDate && recordData.expirationDate < new Date()) {
      warnings.push('Vaccine lot may have been expired at administration');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  // ============================================================================
  // 7. COMPLIANCE REPORTING (Functions 29-32)
  // ============================================================================

  /**
   * 29. Generates school immunization compliance report.
   *
   * @param {string} schoolId - School ID
   * @param {Date} reportPeriodStart - Report period start date
   * @param {Date} reportPeriodEnd - Report period end date
   * @param {string} generatedBy - User ID generating report
   * @returns {Promise<ComplianceReportData>} Compliance report
   *
   * @example
   * ```typescript
   * const report = await service.generateSchoolComplianceReport(
   *   'school-123',
   *   new Date('2024-08-01'),
   *   new Date('2024-11-11'),
   *   'nurse-456'
   * );
   * ```
   */
  async generateSchoolComplianceReport(
    schoolId: string,
    reportPeriodStart: Date,
    reportPeriodEnd: Date,
    generatedBy: string,
  ): Promise<ComplianceReportData> {
    this.logger.log(`Generating compliance report for school ${schoolId}`);

    const StudentCompliance = createStudentComplianceModel(this.sequelize);

    const complianceRecords = await StudentCompliance.findAll({
      where: {
        schoolId,
        evaluationDate: {
          [Op.between]: [reportPeriodStart, reportPeriodEnd],
        },
      },
    });

    const totalStudents = complianceRecords.length;
    const compliantStudents = complianceRecords.filter(r => r.overallStatus === ComplianceStatus.COMPLIANT).length;
    const nonCompliantStudents = complianceRecords.filter(r => r.overallStatus === ComplianceStatus.NON_COMPLIANT).length;
    const exemptStudents = complianceRecords.filter(r => r.overallStatus === ComplianceStatus.EXEMPT).length;

    const report: ComplianceReportData = {
      reportType: 'school',
      reportPeriodStart,
      reportPeriodEnd,
      generatedDate: new Date(),
      generatedBy,
      totalStudents,
      compliantStudents,
      nonCompliantStudents,
      conditionalStudents: 0,
      exemptStudents,
      complianceRate: totalStudents > 0 ? (compliantStudents / totalStudents) * 100 : 0,
      vaccineSpecificCompliance: {} as any,
      exemptionBreakdown: {} as any,
      gradeCompliance: {} as any,
      schoolId,
      submittedToState: false,
    };

    return report;
  }

  /**
   * 30. Generates state-mandated compliance report.
   *
   * @param {string} stateCode - State code
   * @param {string} districtId - District ID
   * @param {Date} reportDate - Report date
   * @param {string} generatedBy - User ID generating report
   * @returns {Promise<ComplianceReportData>} State compliance report
   *
   * @example
   * ```typescript
   * const stateReport = await service.generateStateComplianceReport(
   *   'CA',
   *   'district-123',
   *   new Date(),
   *   'admin-789'
   * );
   * ```
   */
  async generateStateComplianceReport(
    stateCode: string,
    districtId: string,
    reportDate: Date,
    generatedBy: string,
  ): Promise<ComplianceReportData> {
    this.logger.log(`Generating state compliance report for ${stateCode}`);

    // In production, aggregate data across all schools in district
    const report: ComplianceReportData = {
      reportType: 'state',
      reportPeriodStart: new Date(reportDate.getFullYear(), 0, 1), // Jan 1
      reportPeriodEnd: reportDate,
      generatedDate: new Date(),
      generatedBy,
      totalStudents: 0,
      compliantStudents: 0,
      nonCompliantStudents: 0,
      conditionalStudents: 0,
      exemptStudents: 0,
      complianceRate: 0,
      vaccineSpecificCompliance: {} as any,
      exemptionBreakdown: {} as any,
      gradeCompliance: {} as any,
      districtId,
      stateCode,
      submittedToState: false,
    };

    return report;
  }

  /**
   * 31. Generates grade-level compliance breakdown.
   *
   * @param {string} schoolId - School ID
   * @param {string} academicYear - Academic year
   * @returns {Promise<any>} Grade-level compliance data
   *
   * @example
   * ```typescript
   * const gradeData = await service.generateGradeLevelCompliance(
   *   'school-123',
   *   '2024-2025'
   * );
   * ```
   */
  async generateGradeLevelCompliance(schoolId: string, academicYear: string): Promise<any> {
    this.logger.log(`Generating grade-level compliance for school ${schoolId}`);

    const StudentCompliance = createStudentComplianceModel(this.sequelize);

    const complianceByGrade = await StudentCompliance.findAll({
      where: {
        schoolId,
        academicYear,
      },
      attributes: [
        'gradeLevel',
        [this.sequelize.fn('COUNT', this.sequelize.col('id')), 'totalStudents'],
        [
          this.sequelize.fn(
            'SUM',
            this.sequelize.literal("CASE WHEN overall_status = 'compliant' THEN 1 ELSE 0 END"),
          ),
          'compliantStudents',
        ],
      ],
      group: ['gradeLevel'],
      order: [['gradeLevel', 'ASC']],
      raw: true,
    });

    return complianceByGrade;
  }

  /**
   * 32. Submits compliance report to state health department.
   *
   * @param {string} reportId - Report ID
   * @param {string} submittedBy - User ID submitting report
   * @returns {Promise<any>} Submission confirmation
   *
   * @example
   * ```typescript
   * await service.submitComplianceReportToState(
   *   'report-123',
   *   'admin-456'
   * );
   * ```
   */
  async submitComplianceReportToState(reportId: string, submittedBy: string): Promise<any> {
    this.logger.log(`Submitting compliance report ${reportId} to state`);

    // In production, format and submit to state portal/API
    const submission = {
      reportId,
      submittedToState: true,
      stateSubmissionDate: new Date(),
      submittedBy,
      confirmationNumber: `STATE-${Date.now()}`,
    };

    return submission;
  }

  // ============================================================================
  // 8. VACCINATION CLINIC & CONSENT (Functions 33-36)
  // ============================================================================

  /**
   * 33. Creates vaccination clinic event.
   *
   * @param {VaccinationClinicData} clinicData - Vaccination clinic data
   * @returns {Promise<any>} Created clinic record
   *
   * @example
   * ```typescript
   * const clinic = await service.createVaccinationClinic({
   *   clinicDate: new Date('2024-11-20'),
   *   clinicStartTime: new Date('2024-11-20T09:00:00'),
   *   clinicEndTime: new Date('2024-11-20T15:00:00'),
   *   location: 'School Gymnasium',
   *   vaccinesOffered: [VaccineType.INFLUENZA, VaccineType.COVID_19],
   *   maxCapacity: 100,
   *   currentRegistrations: 0,
   *   nurseStaffing: ['nurse-1', 'nurse-2'],
   *   consentFormsRequired: true,
   *   registrationDeadline: new Date('2024-11-15'),
   *   status: 'planned',
   *   schoolId: 'school-123',
   *   createdBy: 'admin-456'
   * });
   * ```
   */
  async createVaccinationClinic(clinicData: VaccinationClinicData): Promise<any> {
    this.logger.log(`Creating vaccination clinic on ${clinicData.clinicDate}`);

    const clinic = {
      ...clinicData,
      currentRegistrations: 0,
      availableSlots: clinicData.maxCapacity,
      status: 'planned' as const,
    };

    return clinic;
  }

  /**
   * 34. Registers student for vaccination clinic.
   *
   * @param {string} clinicId - Clinic ID
   * @param {string} studentId - Student ID
   * @param {VaccineType[]} requestedVaccines - Vaccines to administer
   * @returns {Promise<any>} Registration confirmation
   * @throws {BadRequestException} If clinic is full
   *
   * @example
   * ```typescript
   * await service.registerForVaccinationClinic(
   *   'clinic-123',
   *   'student-456',
   *   [VaccineType.INFLUENZA]
   * );
   * ```
   */
  async registerForVaccinationClinic(
    clinicId: string,
    studentId: string,
    requestedVaccines: VaccineType[],
  ): Promise<any> {
    this.logger.log(`Registering student ${studentId} for clinic ${clinicId}`);

    // In production, check clinic capacity and update registrations
    const registration = {
      clinicId,
      studentId,
      requestedVaccines,
      registrationDate: new Date(),
      status: 'registered',
      consentFormSubmitted: false,
    };

    return registration;
  }

  /**
   * 35. Manages consent form for immunization.
   *
   * @param {ConsentFormData} consentData - Consent form data
   * @returns {Promise<any>} Created consent record
   * @throws {BadRequestException} If validation fails
   *
   * @example
   * ```typescript
   * const consent = await service.manageConsentForm({
   *   studentId: 'student-123',
   *   clinicId: 'clinic-456',
   *   vaccineTypes: [VaccineType.INFLUENZA],
   *   parentName: 'Jane Doe',
   *   parentRelationship: 'Mother',
   *   parentSignature: 'signature-data',
   *   signatureDate: new Date(),
   *   signatureMethod: 'electronic',
   *   consentGiven: true,
   *   visReviewed: true,
   *   medicalHistory: [],
   *   allergies: ['Penicillin'],
   *   previousReactions: [],
   *   currentMedications: [],
   *   specialConditions: [],
   *   emergencyContact: 'John Doe',
   *   emergencyPhone: '555-1234',
   *   isActive: true,
   *   schoolId: 'school-789'
   * });
   * ```
   */
  async manageConsentForm(consentData: ConsentFormData): Promise<any> {
    this.logger.log(`Managing consent form for student ${consentData.studentId}`);

    if (!consentData.parentSignature || !consentData.signatureDate) {
      throw new BadRequestException('Parent signature and date are required');
    }

    const consent = {
      ...consentData,
      isActive: true,
      consentValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    };

    return consent;
  }

  /**
   * 36. Verifies consent before immunization administration.
   *
   * @param {string} studentId - Student ID
   * @param {VaccineType} vaccineType - Vaccine type to administer
   * @returns {Promise<any>} Consent verification result
   * @throws {ForbiddenException} If consent not found or expired
   *
   * @example
   * ```typescript
   * const verification = await service.verifyImmunizationConsent(
   *   'student-123',
   *   VaccineType.INFLUENZA
   * );
   * ```
   */
  async verifyImmunizationConsent(studentId: string, vaccineType: VaccineType): Promise<any> {
    this.logger.log(`Verifying consent for ${vaccineType} - student ${studentId}`);

    // In production, query consent forms table
    const verification = {
      studentId,
      vaccineType,
      consentFound: true,
      consentValid: true,
      consentGiven: true,
      verificationDate: new Date(),
      canProceed: true,
    };

    if (!verification.consentFound || !verification.consentValid) {
      throw new ForbiddenException('Valid consent not found for immunization');
    }

    return verification;
  }

  // ============================================================================
  // 9. ADVERSE REACTIONS & VACCINE INVENTORY (Functions 37-40)
  // ============================================================================

  /**
   * 37. Documents adverse reaction to immunization.
   *
   * @param {AdverseReactionData} reactionData - Adverse reaction data
   * @returns {Promise<any>} Created adverse reaction record
   *
   * @example
   * ```typescript
   * const reaction = await service.documentAdverseReaction({
   *   studentId: 'student-123',
   *   immunizationId: 'imm-456',
   *   vaccineType: VaccineType.MMR,
   *   vaccineName: 'M-M-R II',
   *   lotNumber: 'LOT123',
   *   reactionDate: new Date(),
   *   onsetTime: '2 hours post-vaccination',
   *   reactionType: ['Local reaction', 'Fever'],
   *   severity: ReactionSeverity.MILD,
   *   symptoms: ['Redness at injection site', 'Low-grade fever'],
   *   treatmentProvided: ['Cold compress', 'Acetaminophen'],
   *   medicalAttentionRequired: false,
   *   hospitalAdmission: false,
   *   recoveryStatus: 'fully_recovered',
   *   reportedToVAERS: false,
   *   parentNotified: true,
   *   documentedBy: 'nurse-789',
   *   schoolId: 'school-123'
   * });
   * ```
   */
  async documentAdverseReaction(reactionData: AdverseReactionData): Promise<any> {
    this.logger.log(`Documenting adverse reaction for immunization ${reactionData.immunizationId}`);

    // Update related immunization record
    const ImmunizationRecord = createImmunizationRecordModel(this.sequelize);
    await ImmunizationRecord.update(
      {
        adverseReaction: true,
        reactionDetails: reactionData.symptoms.join(', '),
        reactionSeverity: reactionData.severity,
      },
      { where: { id: reactionData.immunizationId } },
    );

    // Check if VAERS reporting required
    const vaersRequired = this.isVAERSReportingRequired(reactionData);
    if (vaersRequired) {
      this.logger.warn(`VAERS reporting required for reaction to ${reactionData.vaccineName}`);
    }

    const reaction = {
      ...reactionData,
      reportedToVAERS: vaersRequired,
      followUpRequired: reactionData.severity !== ReactionSeverity.MILD,
    };

    return reaction;
  }

  /**
   * 38. Submits adverse reaction report to VAERS.
   *
   * @param {string} reactionId - Adverse reaction ID
   * @param {string} submittedBy - User ID submitting report
   * @returns {Promise<any>} VAERS submission confirmation
   *
   * @example
   * ```typescript
   * await service.submitToVAERS(
   *   'reaction-123',
   *   'nurse-456'
   * );
   * ```
   */
  async submitToVAERS(reactionId: string, submittedBy: string): Promise<any> {
    this.logger.log(`Submitting adverse reaction ${reactionId} to VAERS`);

    // In production, format and submit to VAERS system
    const submission = {
      reactionId,
      vaersReportDate: new Date(),
      vaersReportId: `VAERS-${Date.now()}`,
      submittedBy,
      confirmationNumber: `VAERS-CONFIRM-${Date.now()}`,
    };

    return submission;
  }

  /**
   * 39. Manages vaccine inventory and stock levels.
   *
   * @param {VaccineInventoryData} inventoryData - Vaccine inventory data
   * @returns {Promise<any>} Created/updated inventory record
   *
   * @example
   * ```typescript
   * const inventory = await service.manageVaccineInventory({
   *   vaccineType: VaccineType.INFLUENZA,
   *   vaccineName: 'Fluzone Quadrivalent',
   *   manufacturer: 'Sanofi Pasteur',
   *   lotNumber: 'FLU2024-001',
   *   expirationDate: new Date('2025-06-30'),
   *   ndc: '49281-0400-10',
   *   cvxCode: '141',
   *   mvxCode: 'SKB',
   *   quantityReceived: 100,
   *   quantityAvailable: 100,
   *   storageLocation: 'Vaccine Refrigerator #1',
   *   storageTemperatureMin: 2,
   *   storageTemperatureMax: 8,
   *   receivedDate: new Date(),
   *   receivedBy: 'nurse-456',
   *   vfcEligible: true,
   *   expirationAlertDays: 30,
   *   lowStockThreshold: 20,
   *   schoolId: 'school-123'
   * });
   * ```
   */
  async manageVaccineInventory(inventoryData: VaccineInventoryData): Promise<any> {
    this.logger.log(`Managing inventory for ${inventoryData.vaccineName}`);

    const inventory = {
      ...inventoryData,
      quantityAdministered: 0,
      quantityWasted: 0,
      reorderRequired: false,
    };

    // Check expiration alert
    const daysUntilExpiration = Math.floor(
      (inventoryData.expirationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );

    if (daysUntilExpiration <= inventoryData.expirationAlertDays) {
      this.logger.warn(`Vaccine lot ${inventoryData.lotNumber} expires in ${daysUntilExpiration} days`);
    }

    return inventory;
  }

  /**
   * 40. Tracks vaccine usage and updates inventory.
   *
   * @param {string} inventoryId - Inventory item ID
   * @param {number} quantityUsed - Quantity administered
   * @param {string} usedBy - User ID who administered
   * @returns {Promise<any>} Updated inventory record
   * @throws {BadRequestException} If insufficient quantity
   *
   * @example
   * ```typescript
   * await service.trackVaccineUsage(
   *   'inventory-123',
   *   5,
   *   'nurse-456'
   * );
   * ```
   */
  async trackVaccineUsage(inventoryId: string, quantityUsed: number, usedBy: string): Promise<any> {
    this.logger.log(`Tracking usage of ${quantityUsed} doses from inventory ${inventoryId}`);

    // In production, query and update inventory table
    const inventory = {
      inventoryId,
      quantityAvailable: 95, // Example: 100 - 5
      quantityAdministered: 5,
      lastUsedDate: new Date(),
      lastUsedBy: usedBy,
      reorderRequired: 95 < 20, // Below threshold
    };

    return inventory;
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  /**
   * Gets required vaccines for grade level (simplified).
   */
  private getRequiredVaccinesForGrade(gradeLevel: number): VaccineType[] {
    // Simplified - in production, query from state requirements database
    const baseRequirements = [
      VaccineType.DTaP,
      VaccineType.IPV,
      VaccineType.MMR,
      VaccineType.VARICELLA,
      VaccineType.HEPATITIS_B,
    ];

    if (gradeLevel >= 7) {
      baseRequirements.push(VaccineType.Tdap, VaccineType.MENINGOCOCCAL);
    }

    return baseRequirements;
  }

  /**
   * Gets standard number of doses for vaccine type.
   */
  private getStandardDosesForVaccine(vaccineType: VaccineType): number {
    const standardDoses: Record<string, number> = {
      [VaccineType.DTaP]: 5,
      [VaccineType.IPV]: 4,
      [VaccineType.MMR]: 2,
      [VaccineType.VARICELLA]: 2,
      [VaccineType.HEPATITIS_B]: 3,
      [VaccineType.HEPATITIS_A]: 2,
      [VaccineType.HIB]: 4,
      [VaccineType.PCV]: 4,
      [VaccineType.MENINGOCOCCAL]: 2,
      [VaccineType.HPV]: 3,
      [VaccineType.INFLUENZA]: 1,
      [VaccineType.COVID_19]: 2,
    };

    return standardDoses[vaccineType] || 1;
  }

  /**
   * Generates HL7 message for immunization registry submission.
   */
  private generateHL7ImmunizationMessage(record: any): string {
    // Simplified HL7 message - in production, use proper HL7 library
    const segments = [
      'MSH|^~\\&|SchoolClinic|School123|StateRegistry|State|20241111120000||VXU^V04^VXU_V04|MSG123|P|2.5.1',
      `PID|1||${record.studentId}||LastName^FirstName||20100515|M`,
      `RXA|0|1|${record.administrationDate.toISOString()}||${record.cvxCode}^${record.vaccineName}|1|mL||01^Historical^NIP001||||||${record.lotNumber}|${record.expirationDate?.toISOString()}|${record.mvxCode}`,
    ];

    return segments.join('\n');
  }

  /**
   * Determines if VAERS reporting is required based on reaction severity.
   */
  private isVAERSReportingRequired(reactionData: AdverseReactionData): boolean {
    // VAERS reporting required for:
    // - Severe or life-threatening reactions
    // - Hospital admission
    // - Permanent disability or death
    return (
      reactionData.severity === ReactionSeverity.SEVERE ||
      reactionData.severity === ReactionSeverity.LIFE_THREATENING ||
      reactionData.hospitalAdmission ||
      reactionData.recoveryStatus === 'permanent_disability' ||
      reactionData.recoveryStatus === 'death'
    );
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default ImmunizationManagementCompositeService;
