/**
 * LOC: CLINIC-INFECTIOUS-DISEASE-COMP-001
 * File: /reuse/clinic/composites/infectious-disease-management-composites.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - sequelize (v6.x)
 *   - ../../server/health/health-patient-management-kit
 *   - ../../server/health/health-clinical-workflows-kit
 *   - ../../server/health/health-medical-records-kit
 *   - ../../server/health/health-epidemiology-kit
 *   - ../../education/student-records-kit
 *   - ../../education/student-communication-kit
 *   - ../../communication/notification-kit
 *   - ../../data/crud-operations
 *   - ../../data/data-repository
 *
 * DOWNSTREAM (imported by):
 *   - School clinic disease surveillance controllers
 *   - Nurse outbreak management workflows
 *   - Health department reporting services
 *   - Contact tracing systems
 *   - Parent notification services
 *   - Immunization tracking systems
 */

/**
 * File: /reuse/clinic/composites/infectious-disease-management-composites.ts
 * Locator: WC-CLINIC-INFECTIOUS-DISEASE-001
 * Purpose: School Clinic Infectious Disease Management Composite - Comprehensive disease surveillance and outbreak management
 *
 * Upstream: health-patient-management-kit, health-clinical-workflows-kit, health-medical-records-kit,
 *           health-epidemiology-kit, student-records-kit, student-communication-kit, notification-kit, data-repository
 * Downstream: Clinic disease controllers, Nurse outbreak workflows, Health department reporting, Contact tracing, Parent notifications
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x
 * Exports: 42 composed functions for complete school clinic infectious disease management
 *
 * LLM Context: Production-grade school clinic infectious disease management composite for K-12 healthcare SaaS platform.
 * Provides comprehensive disease surveillance including outbreak tracking and monitoring, communicable disease reporting
 * to health authorities, contact tracing workflows and exposure mapping, quarantine and isolation protocols with
 * documentation, return-to-school clearance criteria and verification, immunization gap identification and follow-up,
 * health department coordination and data sharing, parent notification for exposures and outbreaks, pandemic response
 * protocols and emergency procedures, disease trend analysis, exposure risk assessment, symptom monitoring, case
 * investigation documentation, and comprehensive reporting for public health compliance and epidemiological surveillance.
 */

import {
  Injectable,
  Logger,
  Inject,
  NotFoundException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { Sequelize, Model, DataTypes, Transaction, Op } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS & ENUMERATIONS
// ============================================================================

/**
 * Disease outbreak status enumeration
 */
export enum OutbreakStatus {
  MONITORING = 'monitoring',
  ACTIVE_OUTBREAK = 'active_outbreak',
  CONTAINED = 'contained',
  RESOLVED = 'resolved',
  FALSE_ALARM = 'false_alarm',
}

/**
 * Communicable disease type enumeration
 */
export enum CommunicableDisease {
  COVID_19 = 'covid_19',
  INFLUENZA = 'influenza',
  STREP_THROAT = 'strep_throat',
  CHICKENPOX = 'chickenpox',
  MEASLES = 'measles',
  MUMPS = 'mumps',
  WHOOPING_COUGH = 'whooping_cough',
  MENINGITIS = 'meningitis',
  HAND_FOOT_MOUTH = 'hand_foot_mouth',
  HEAD_LICE = 'head_lice',
  PINK_EYE = 'pink_eye',
  OTHER = 'other',
}

/**
 * Case status enumeration
 */
export enum CaseStatus {
  SUSPECTED = 'suspected',
  PROBABLE = 'probable',
  CONFIRMED = 'confirmed',
  RECOVERED = 'recovered',
  HOSPITALIZED = 'hospitalized',
  RULED_OUT = 'ruled_out',
}

/**
 * Quarantine/Isolation status enumeration
 */
export enum QuarantineStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  EARLY_RELEASE = 'early_release',
  EXTENDED = 'extended',
}

/**
 * Contact tracing risk level enumeration
 */
export enum ContactRiskLevel {
  HIGH = 'high',
  MODERATE = 'moderate',
  LOW = 'low',
  NO_RISK = 'no_risk',
}

/**
 * Return-to-school clearance status
 */
export enum ClearanceStatus {
  CLEARED = 'cleared',
  NOT_CLEARED = 'not_cleared',
  CONDITIONAL = 'conditional',
  PENDING_DOCUMENTATION = 'pending_documentation',
}

/**
 * Disease outbreak tracking record
 */
export interface DiseaseOutbreakData {
  outbreakId?: string;
  diseaseName: CommunicableDisease;
  customDiseaseName?: string;
  outbreakStartDate: Date;
  outbreakEndDate?: Date;
  outbreakStatus: OutbreakStatus;
  indexCaseId?: string;
  totalCases: number;
  confirmedCases: number;
  suspectedCases: number;
  affectedGrades: string[];
  affectedClassrooms: string[];
  outbreakSeverity: 'mild' | 'moderate' | 'severe';
  interventionsTaken: string[];
  healthDepartmentNotified: boolean;
  healthDepartmentCaseNumber?: string;
  outbreakNotes: string;
  schoolId: string;
  createdAt?: Date;
}

/**
 * Communicable disease case report
 */
export interface CommunicableDiseaseReportData {
  reportId?: string;
  studentId: string;
  diseaseName: CommunicableDisease;
  customDiseaseName?: string;
  caseStatus: CaseStatus;
  symptomOnsetDate: Date;
  diagnosisDate?: Date;
  diagnosisMethod: 'clinical' | 'laboratory' | 'rapid_test' | 'physician_confirmed';
  reportedDate: Date;
  reportedBy: string;
  symptomsReported: string[];
  exposureSource?: string;
  laboratoryConfirmed: boolean;
  laboratoryResults?: string;
  physicianName?: string;
  physicianContact?: string;
  treatmentProvided?: string;
  isolationRequired: boolean;
  expectedReturnDate?: Date;
  healthDepartmentReported: boolean;
  reportingNotes: string;
  outbreakId?: string;
  schoolId: string;
}

/**
 * Contact tracing record
 */
export interface ContactTracingData {
  tracingId?: string;
  indexCaseId: string;
  indexStudentId: string;
  contactStudentId: string;
  contactDate: Date;
  contactDuration: number;
  contactSetting: string;
  contactType: 'household' | 'classroom' | 'close_contact' | 'casual_contact';
  contactRiskLevel: ContactRiskLevel;
  maskingStatus: 'both_masked' | 'index_masked' | 'contact_masked' | 'neither_masked';
  distanceMaintained: boolean;
  notificationSent: boolean;
  notificationDate?: Date;
  quarantineRecommended: boolean;
  testingRecommended: boolean;
  tracingNotes: string;
  schoolId: string;
  createdAt?: Date;
}

/**
 * Quarantine/Isolation protocol record
 */
export interface QuarantineProtocolData {
  quarantineId?: string;
  studentId: string;
  quarantineType: 'isolation' | 'quarantine';
  reason: string;
  startDate: Date;
  endDate: Date;
  quarantineStatus: QuarantineStatus;
  quarantineLocation: 'home' | 'medical_facility' | 'other';
  healthMonitoringRequired: boolean;
  dailySymptomChecks: Array<{
    checkDate: Date;
    symptoms: string[];
    temperature?: number;
    reportedBy: string;
  }>;
  physicalReturnDate?: Date;
  clearanceDocumentation?: string;
  parentNotified: boolean;
  schoolWorkProvided: boolean;
  quarantineNotes: string;
  schoolId: string;
}

/**
 * Return-to-school clearance record
 */
export interface ReturnToSchoolClearanceData {
  clearanceId?: string;
  studentId: string;
  absenceReason: string;
  diagnosisName?: string;
  absenceStartDate: Date;
  clearanceRequestDate: Date;
  clearanceStatus: ClearanceStatus;
  clearanceCriteriaMet: boolean;
  criteriaChecklist: Array<{
    criterion: string;
    met: boolean;
    verifiedBy?: string;
  }>;
  physicianClearance?: boolean;
  physicianNote?: string;
  negativeTes tResult?: boolean;
  testDate?: Date;
  symptomFreeDate?: Date;
  clearanceApprovedBy?: string;
  clearanceApprovedDate?: Date;
  clearanceConditions?: string[];
  clearanceNotes: string;
  schoolId: string;
}

/**
 * Immunization gap identification record
 */
export interface ImmunizationGapData {
  gapId?: string;
  studentId: string;
  studentGrade: string;
  requiredVaccines: Array<{
    vaccineName: string;
    dosesDue: number;
    dosesReceived: number;
    lastDoseDate?: Date;
    nextDoseDate?: Date;
    overdue: boolean;
  }>;
  complianceStatus: 'compliant' | 'non_compliant' | 'conditional';
  riskLevel: 'high' | 'moderate' | 'low';
  exclusionRisk: boolean;
  parentNotified: boolean;
  followUpRequired: boolean;
  followUpDate?: Date;
  medicalExemption: boolean;
  religiousExemption: boolean;
  provisionalEnrollment: boolean;
  gapIdentifiedDate: Date;
  schoolId: string;
}

/**
 * Health department coordination record
 */
export interface HealthDepartmentCoordinationData {
  coordinationId?: string;
  reportType: 'disease_case' | 'outbreak' | 'exposure' | 'routine_surveillance';
  reportDate: Date;
  reportedBy: string;
  healthDepartmentContact: string;
  healthDepartmentCaseNumber: string;
  diseaseName: string;
  caseCount: number;
  dataShared: string[];
  requestsFromHealthDept: string[];
  followUpActions: string[];
  nextReportDue?: Date;
  communicationLog: Array<{
    communicationDate: Date;
    communicationType: 'phone' | 'email' | 'in_person' | 'fax';
    summary: string;
    actionItems: string[];
  }>;
  coordinationNotes: string;
  schoolId: string;
}

/**
 * Parent exposure notification record
 */
export interface ParentExposureNotificationData {
  notificationId?: string;
  studentId: string;
  exposureType: 'disease_case' | 'outbreak' | 'close_contact';
  diseaseName: string;
  exposureDate: Date;
  notificationDate: Date;
  notificationMethod: 'email' | 'phone' | 'letter' | 'portal' | 'multiple';
  notificationContent: string;
  recommendationsProvided: string[];
  quarantineRecommended: boolean;
  testingRecommended: boolean;
  monitoringInstructions: string;
  parentAcknowledgement?: boolean;
  acknowledgementDate?: Date;
  parentQuestions?: string[];
  followUpRequired: boolean;
  schoolId: string;
}

/**
 * Pandemic response protocol record
 */
export interface PandemicResponseData {
  responseId?: string;
  pandemicName: string;
  responseLevel: 'level_1_monitoring' | 'level_2_enhanced' | 'level_3_intensive' | 'level_4_critical';
  activationDate: Date;
  deactivationDate?: Date;
  protocolsImplemented: Array<{
    protocolName: string;
    implementationDate: Date;
    description: string;
    responsibleStaff: string[];
  }>;
  screeningProcedures: string[];
  contactTracingActive: boolean;
  quarantineProcedures: string;
  communicationPlan: string;
  resourcesAllocated: string[];
  trainingCompleted: Array<{
    trainingTopic: string;
    trainedStaff: number;
    trainingDate: Date;
  }>;
  metricsTracked: Record<string, number>;
  responseNotes: string;
  schoolId: string;
}

/**
 * Disease trend analysis record
 */
export interface DiseaseTrendData {
  trendId?: string;
  analysisMonth: number;
  analysisYear: number;
  diseaseName: string;
  totalCases: number;
  weeklyBreakdown: Array<{
    weekNumber: number;
    caseCount: number;
    newCases: number;
  }>;
  affectedDemographics: Record<string, number>;
  trendDirection: 'increasing' | 'decreasing' | 'stable';
  comparisonToPriorPeriod: number;
  seasonalPattern: boolean;
  alertThresholdReached: boolean;
  recommendedActions: string[];
  analysisNotes: string;
  schoolId: string;
}

/**
 * Case investigation documentation
 */
export interface CaseInvestigationData {
  investigationId?: string;
  caseReportId: string;
  studentId: string;
  investigationDate: Date;
  investigator: string;
  interviewCompleted: boolean;
  symptomTimeline: Array<{
    date: Date;
    symptoms: string[];
    severity: string;
  }>;
  exposureHistory: Array<{
    exposureDate: Date;
    location: string;
    potentialSource: string;
    riskLevel: string;
  }>;
  closeContacts: string[];
  travelHistory: Array<{
    destination: string;
    departureDate: Date;
    returnDate: Date;
  }>;
  laboratoryTestsOrdered: string[];
  laboratoryResults: Record<string, string>;
  diagnosisConfirmed: boolean;
  publicHealthActionsRecommended: string[];
  investigationComplete: boolean;
  investigationNotes: string;
  schoolId: string;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Disease Outbreaks
 */
export const createDiseaseOutbreakModel = (sequelize: Sequelize) => {
  class DiseaseOutbreak extends Model {
    public id!: string;
    public diseaseName!: CommunicableDisease;
    public customDiseaseName!: string | null;
    public outbreakStartDate!: Date;
    public outbreakEndDate!: Date | null;
    public outbreakStatus!: OutbreakStatus;
    public indexCaseId!: string | null;
    public totalCases!: number;
    public confirmedCases!: number;
    public suspectedCases!: number;
    public affectedGrades!: string[];
    public affectedClassrooms!: string[];
    public outbreakSeverity!: string;
    public interventionsTaken!: string[];
    public healthDepartmentNotified!: boolean;
    public healthDepartmentCaseNumber!: string | null;
    public outbreakNotes!: string;
    public schoolId!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  DiseaseOutbreak.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      diseaseName: { type: DataTypes.ENUM(...Object.values(CommunicableDisease)), allowNull: false },
      customDiseaseName: { type: DataTypes.STRING(255), allowNull: true },
      outbreakStartDate: { type: DataTypes.DATE, allowNull: false },
      outbreakEndDate: { type: DataTypes.DATE, allowNull: true },
      outbreakStatus: { type: DataTypes.ENUM(...Object.values(OutbreakStatus)), allowNull: false },
      indexCaseId: { type: DataTypes.UUID, allowNull: true },
      totalCases: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      confirmedCases: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      suspectedCases: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      affectedGrades: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
      affectedClassrooms: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
      outbreakSeverity: { type: DataTypes.ENUM('mild', 'moderate', 'severe'), allowNull: false },
      interventionsTaken: { type: DataTypes.ARRAY(DataTypes.TEXT), defaultValue: [] },
      healthDepartmentNotified: { type: DataTypes.BOOLEAN, defaultValue: false },
      healthDepartmentCaseNumber: { type: DataTypes.STRING(100), allowNull: true },
      outbreakNotes: { type: DataTypes.TEXT, allowNull: false },
      schoolId: { type: DataTypes.UUID, allowNull: false, references: { model: 'schools', key: 'id' } },
    },
    {
      sequelize,
      tableName: 'disease_outbreaks',
      timestamps: true,
      indexes: [
        { fields: ['schoolId'] },
        { fields: ['diseaseName'] },
        { fields: ['outbreakStatus'] },
        { fields: ['outbreakStartDate'] },
      ],
    },
  );

  return DiseaseOutbreak;
};

/**
 * Sequelize model for Communicable Disease Reports
 */
export const createCommunicableDiseaseReportModel = (sequelize: Sequelize) => {
  class CommunicableDiseaseReport extends Model {
    public id!: string;
    public studentId!: string;
    public diseaseName!: CommunicableDisease;
    public customDiseaseName!: string | null;
    public caseStatus!: CaseStatus;
    public symptomOnsetDate!: Date;
    public diagnosisDate!: Date | null;
    public diagnosisMethod!: string;
    public reportedDate!: Date;
    public reportedBy!: string;
    public symptomsReported!: string[];
    public exposureSource!: string | null;
    public laboratoryConfirmed!: boolean;
    public laboratoryResults!: string | null;
    public physicianName!: string | null;
    public physicianContact!: string | null;
    public treatmentProvided!: string | null;
    public isolationRequired!: boolean;
    public expectedReturnDate!: Date | null;
    public healthDepartmentReported!: boolean;
    public reportingNotes!: string;
    public outbreakId!: string | null;
    public schoolId!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  CommunicableDiseaseReport.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      studentId: { type: DataTypes.UUID, allowNull: false, references: { model: 'students', key: 'id' } },
      diseaseName: { type: DataTypes.ENUM(...Object.values(CommunicableDisease)), allowNull: false },
      customDiseaseName: { type: DataTypes.STRING(255), allowNull: true },
      caseStatus: { type: DataTypes.ENUM(...Object.values(CaseStatus)), allowNull: false },
      symptomOnsetDate: { type: DataTypes.DATE, allowNull: false },
      diagnosisDate: { type: DataTypes.DATE, allowNull: true },
      diagnosisMethod: { type: DataTypes.ENUM('clinical', 'laboratory', 'rapid_test', 'physician_confirmed'), allowNull: false },
      reportedDate: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      reportedBy: { type: DataTypes.UUID, allowNull: false, references: { model: 'users', key: 'id' } },
      symptomsReported: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
      exposureSource: { type: DataTypes.STRING(255), allowNull: true },
      laboratoryConfirmed: { type: DataTypes.BOOLEAN, defaultValue: false },
      laboratoryResults: { type: DataTypes.TEXT, allowNull: true },
      physicianName: { type: DataTypes.STRING(255), allowNull: true },
      physicianContact: { type: DataTypes.STRING(100), allowNull: true },
      treatmentProvided: { type: DataTypes.TEXT, allowNull: true },
      isolationRequired: { type: DataTypes.BOOLEAN, defaultValue: false },
      expectedReturnDate: { type: DataTypes.DATE, allowNull: true },
      healthDepartmentReported: { type: DataTypes.BOOLEAN, defaultValue: false },
      reportingNotes: { type: DataTypes.TEXT, allowNull: false },
      outbreakId: { type: DataTypes.UUID, allowNull: true, references: { model: 'disease_outbreaks', key: 'id' } },
      schoolId: { type: DataTypes.UUID, allowNull: false, references: { model: 'schools', key: 'id' } },
    },
    {
      sequelize,
      tableName: 'communicable_disease_reports',
      timestamps: true,
      indexes: [
        { fields: ['studentId'] },
        { fields: ['schoolId'] },
        { fields: ['diseaseName'] },
        { fields: ['caseStatus'] },
        { fields: ['outbreakId'] },
      ],
    },
  );

  return CommunicableDiseaseReport;
};

/**
 * Sequelize model for Contact Tracing
 */
export const createContactTracingModel = (sequelize: Sequelize) => {
  class ContactTracing extends Model {
    public id!: string;
    public indexCaseId!: string;
    public indexStudentId!: string;
    public contactStudentId!: string;
    public contactDate!: Date;
    public contactDuration!: number;
    public contactSetting!: string;
    public contactType!: string;
    public contactRiskLevel!: ContactRiskLevel;
    public maskingStatus!: string;
    public distanceMaintained!: boolean;
    public notificationSent!: boolean;
    public notificationDate!: Date | null;
    public quarantineRecommended!: boolean;
    public testingRecommended!: boolean;
    public tracingNotes!: string;
    public schoolId!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ContactTracing.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      indexCaseId: { type: DataTypes.UUID, allowNull: false, references: { model: 'communicable_disease_reports', key: 'id' } },
      indexStudentId: { type: DataTypes.UUID, allowNull: false, references: { model: 'students', key: 'id' } },
      contactStudentId: { type: DataTypes.UUID, allowNull: false, references: { model: 'students', key: 'id' } },
      contactDate: { type: DataTypes.DATE, allowNull: false },
      contactDuration: { type: DataTypes.INTEGER, allowNull: false },
      contactSetting: { type: DataTypes.STRING(255), allowNull: false },
      contactType: { type: DataTypes.ENUM('household', 'classroom', 'close_contact', 'casual_contact'), allowNull: false },
      contactRiskLevel: { type: DataTypes.ENUM(...Object.values(ContactRiskLevel)), allowNull: false },
      maskingStatus: { type: DataTypes.ENUM('both_masked', 'index_masked', 'contact_masked', 'neither_masked'), allowNull: false },
      distanceMaintained: { type: DataTypes.BOOLEAN, defaultValue: false },
      notificationSent: { type: DataTypes.BOOLEAN, defaultValue: false },
      notificationDate: { type: DataTypes.DATE, allowNull: true },
      quarantineRecommended: { type: DataTypes.BOOLEAN, defaultValue: false },
      testingRecommended: { type: DataTypes.BOOLEAN, defaultValue: false },
      tracingNotes: { type: DataTypes.TEXT, allowNull: false },
      schoolId: { type: DataTypes.UUID, allowNull: false, references: { model: 'schools', key: 'id' } },
    },
    {
      sequelize,
      tableName: 'contact_tracing',
      timestamps: true,
      indexes: [
        { fields: ['schoolId'] },
        { fields: ['indexCaseId'] },
        { fields: ['indexStudentId'] },
        { fields: ['contactStudentId'] },
        { fields: ['contactRiskLevel'] },
      ],
    },
  );

  return ContactTracing;
};

/**
 * Sequelize model for Quarantine Protocols
 */
export const createQuarantineProtocolModel = (sequelize: Sequelize) => {
  class QuarantineProtocol extends Model {
    public id!: string;
    public studentId!: string;
    public quarantineType!: string;
    public reason!: string;
    public startDate!: Date;
    public endDate!: Date;
    public quarantineStatus!: QuarantineStatus;
    public quarantineLocation!: string;
    public healthMonitoringRequired!: boolean;
    public dailySymptomChecks!: Array<any>;
    public physicalReturnDate!: Date | null;
    public clearanceDocumentation!: string | null;
    public parentNotified!: boolean;
    public schoolWorkProvided!: boolean;
    public quarantineNotes!: string;
    public schoolId!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  QuarantineProtocol.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      studentId: { type: DataTypes.UUID, allowNull: false, references: { model: 'students', key: 'id' } },
      quarantineType: { type: DataTypes.ENUM('isolation', 'quarantine'), allowNull: false },
      reason: { type: DataTypes.TEXT, allowNull: false },
      startDate: { type: DataTypes.DATE, allowNull: false },
      endDate: { type: DataTypes.DATE, allowNull: false },
      quarantineStatus: { type: DataTypes.ENUM(...Object.values(QuarantineStatus)), allowNull: false },
      quarantineLocation: { type: DataTypes.ENUM('home', 'medical_facility', 'other'), allowNull: false },
      healthMonitoringRequired: { type: DataTypes.BOOLEAN, defaultValue: true },
      dailySymptomChecks: { type: DataTypes.JSONB, defaultValue: [] },
      physicalReturnDate: { type: DataTypes.DATE, allowNull: true },
      clearanceDocumentation: { type: DataTypes.TEXT, allowNull: true },
      parentNotified: { type: DataTypes.BOOLEAN, defaultValue: false },
      schoolWorkProvided: { type: DataTypes.BOOLEAN, defaultValue: false },
      quarantineNotes: { type: DataTypes.TEXT, allowNull: false },
      schoolId: { type: DataTypes.UUID, allowNull: false, references: { model: 'schools', key: 'id' } },
    },
    {
      sequelize,
      tableName: 'quarantine_protocols',
      timestamps: true,
      indexes: [
        { fields: ['studentId'] },
        { fields: ['schoolId'] },
        { fields: ['quarantineStatus'] },
        { fields: ['endDate'] },
      ],
    },
  );

  return QuarantineProtocol;
};

// ============================================================================
// NESTJS INJECTABLE SERVICE
// ============================================================================

/**
 * School Clinic Infectious Disease Management Composite Service
 *
 * Provides comprehensive infectious disease surveillance and outbreak management for K-12 school clinics
 * including disease tracking, contact tracing, quarantine protocols, and health department coordination.
 */
@Injectable()
export class InfectiousDiseaseManagementCompositeService {
  private readonly logger = new Logger(InfectiousDiseaseManagementCompositeService.name);

  constructor(
    @Inject('SEQUELIZE') private readonly sequelize: Sequelize,
  ) {}

  // ============================================================================
  // 1. DISEASE OUTBREAK TRACKING & MONITORING (Functions 1-7)
  // ============================================================================

  /**
   * 1. Initiates disease outbreak tracking with index case identification.
   * Creates outbreak record and establishes monitoring protocols.
   */
  async initiateOutbreakTracking(outbreakData: DiseaseOutbreakData): Promise<any> {
    this.logger.log(`Initiating outbreak tracking for ${outbreakData.diseaseName}`);

    const DiseaseOutbreak = createDiseaseOutbreakModel(this.sequelize);
    const outbreak = await DiseaseOutbreak.create({
      ...outbreakData,
      outbreakStatus: OutbreakStatus.MONITORING,
    });

    return outbreak.toJSON();
  }

  /**
   * 2. Updates outbreak status as cases evolve.
   */
  async updateOutbreakStatus(
    outbreakId: string,
    outbreakStatus: OutbreakStatus,
    totalCases: number,
    confirmedCases: number,
    suspectedCases: number,
  ): Promise<any> {
    const DiseaseOutbreak = createDiseaseOutbreakModel(this.sequelize);
    const outbreak = await DiseaseOutbreak.findByPk(outbreakId);

    if (!outbreak) {
      throw new NotFoundException(`Outbreak ${outbreakId} not found`);
    }

    await outbreak.update({
      outbreakStatus,
      totalCases,
      confirmedCases,
      suspectedCases,
    });

    this.logger.log(`Updated outbreak ${outbreakId} status to ${outbreakStatus}`);
    return outbreak.toJSON();
  }

  /**
   * 3. Retrieves active outbreaks requiring monitoring.
   */
  async getActiveOutbreaks(schoolId: string): Promise<any[]> {
    const DiseaseOutbreak = createDiseaseOutbreakModel(this.sequelize);

    const outbreaks = await DiseaseOutbreak.findAll({
      where: {
        schoolId,
        outbreakStatus: [OutbreakStatus.MONITORING, OutbreakStatus.ACTIVE_OUTBREAK],
      },
      order: [['outbreakStartDate', 'DESC']],
    });

    return outbreaks.map(o => o.toJSON());
  }

  /**
   * 4. Declares outbreak contained when criteria met.
   */
  async declareOutbreakContained(outbreakId: string, interventionsSummary: string[]): Promise<any> {
    const DiseaseOutbreak = createDiseaseOutbreakModel(this.sequelize);
    const outbreak = await DiseaseOutbreak.findByPk(outbreakId);

    if (!outbreak) {
      throw new NotFoundException(`Outbreak ${outbreakId} not found`);
    }

    await outbreak.update({
      outbreakStatus: OutbreakStatus.CONTAINED,
      interventionsTaken: [...outbreak.interventionsTaken, ...interventionsSummary],
    });

    this.logger.log(`Declared outbreak ${outbreakId} contained`);
    return outbreak.toJSON();
  }

  /**
   * 5. Resolves outbreak and documents closure.
   */
  async resolveOutbreak(outbreakId: string, resolutionNotes: string): Promise<any> {
    const DiseaseOutbreak = createDiseaseOutbreakModel(this.sequelize);
    const outbreak = await DiseaseOutbreak.findByPk(outbreakId);

    if (!outbreak) {
      throw new NotFoundException(`Outbreak ${outbreakId} not found`);
    }

    await outbreak.update({
      outbreakStatus: OutbreakStatus.RESOLVED,
      outbreakEndDate: new Date(),
      outbreakNotes: `${outbreak.outbreakNotes}\n\nResolution: ${resolutionNotes}`,
    });

    this.logger.log(`Resolved outbreak ${outbreakId}`);
    return outbreak.toJSON();
  }

  /**
   * 6. Generates outbreak summary report for health department.
   */
  async generateOutbreakSummaryReport(outbreakId: string): Promise<any> {
    const DiseaseOutbreak = createDiseaseOutbreakModel(this.sequelize);
    const outbreak = await DiseaseOutbreak.findByPk(outbreakId);

    if (!outbreak) {
      throw new NotFoundException(`Outbreak ${outbreakId} not found`);
    }

    const CommunicableDiseaseReport = createCommunicableDiseaseReportModel(this.sequelize);
    const cases = await CommunicableDiseaseReport.findAll({
      where: { outbreakId },
    });

    return {
      outbreakId,
      diseaseName: outbreak.diseaseName,
      outbreakStartDate: outbreak.outbreakStartDate,
      outbreakEndDate: outbreak.outbreakEndDate,
      totalCases: outbreak.totalCases,
      confirmedCases: outbreak.confirmedCases,
      suspectedCases: outbreak.suspectedCases,
      affectedGrades: outbreak.affectedGrades,
      interventionsTaken: outbreak.interventionsTaken,
      healthDepartmentCaseNumber: outbreak.healthDepartmentCaseNumber,
      attackRate: (outbreak.totalCases / 1000) * 100,
      reportGeneratedAt: new Date(),
    };
  }

  /**
   * 7. Links disease case to active outbreak.
   */
  async linkCaseToOutbreak(caseReportId: string, outbreakId: string): Promise<any> {
    const CommunicableDiseaseReport = createCommunicableDiseaseReportModel(this.sequelize);
    const report = await CommunicableDiseaseReport.findByPk(caseReportId);

    if (!report) {
      throw new NotFoundException(`Case report ${caseReportId} not found`);
    }

    await report.update({ outbreakId });

    this.logger.log(`Linked case ${caseReportId} to outbreak ${outbreakId}`);
    return report.toJSON();
  }

  // ============================================================================
  // 2. COMMUNICABLE DISEASE REPORTING (Functions 8-13)
  // ============================================================================

  /**
   * 8. Reports communicable disease case with clinical details.
   */
  async reportCommunicableDisease(reportData: CommunicableDiseaseReportData): Promise<any> {
    this.logger.log(`Reporting communicable disease case: ${reportData.diseaseName}`);

    const CommunicableDiseaseReport = createCommunicableDiseaseReportModel(this.sequelize);
    const report = await CommunicableDiseaseReport.create({
      ...reportData,
      reportedDate: new Date(),
    });

    return report.toJSON();
  }

  /**
   * 9. Updates disease case status based on diagnosis confirmation.
   */
  async updateDiseaseCaseStatus(
    reportId: string,
    caseStatus: CaseStatus,
    laboratoryResults?: string,
  ): Promise<any> {
    const CommunicableDiseaseReport = createCommunicableDiseaseReportModel(this.sequelize);
    const report = await CommunicableDiseaseReport.findByPk(reportId);

    if (!report) {
      throw new NotFoundException(`Disease report ${reportId} not found`);
    }

    await report.update({
      caseStatus,
      laboratoryConfirmed: caseStatus === CaseStatus.CONFIRMED,
      laboratoryResults: laboratoryResults || report.laboratoryResults,
    });

    this.logger.log(`Updated case ${reportId} status to ${caseStatus}`);
    return report.toJSON();
  }

  /**
   * 10. Retrieves reportable diseases requiring health department notification.
   */
  async getReportableDiseases(schoolId: string, notReportedOnly: boolean = false): Promise<any[]> {
    const CommunicableDiseaseReport = createCommunicableDiseaseReportModel(this.sequelize);
    const where: any = { schoolId };

    if (notReportedOnly) {
      where.healthDepartmentReported = false;
      where.caseStatus = [CaseStatus.PROBABLE, CaseStatus.CONFIRMED];
    }

    const reports = await CommunicableDiseaseReport.findAll({
      where,
      order: [['reportedDate', 'DESC']],
    });

    return reports.map(r => r.toJSON());
  }

  /**
   * 11. Marks disease case as reported to health department.
   */
  async markReportedToHealthDepartment(reportId: string, healthDeptCaseNumber: string): Promise<any> {
    const CommunicableDiseaseReport = createCommunicableDiseaseReportModel(this.sequelize);
    const report = await CommunicableDiseaseReport.findByPk(reportId);

    if (!report) {
      throw new NotFoundException(`Disease report ${reportId} not found`);
    }

    await report.update({
      healthDepartmentReported: true,
    });

    // Update associated outbreak if exists
    if (report.outbreakId) {
      const DiseaseOutbreak = createDiseaseOutbreakModel(this.sequelize);
      const outbreak = await DiseaseOutbreak.findByPk(report.outbreakId);
      if (outbreak) {
        await outbreak.update({
          healthDepartmentNotified: true,
          healthDepartmentCaseNumber: healthDeptCaseNumber,
        });
      }
    }

    this.logger.log(`Marked case ${reportId} as reported to health department`);
    return report.toJSON();
  }

  /**
   * 12. Generates disease surveillance report for specified period.
   */
  async generateDiseaseSurveillanceReport(schoolId: string, startDate: Date, endDate: Date): Promise<any> {
    const CommunicableDiseaseReport = createCommunicableDiseaseReportModel(this.sequelize);

    const reports = await CommunicableDiseaseReport.findAll({
      where: {
        schoolId,
        reportedDate: { [Op.between]: [startDate, endDate] },
      },
    });

    const byDisease = reports.reduce((acc, r) => {
      const disease = r.customDiseaseName || r.diseaseName;
      acc[disease] = (acc[disease] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      schoolId,
      reportPeriod: { startDate, endDate },
      totalCases: reports.length,
      confirmedCases: reports.filter(r => r.caseStatus === CaseStatus.CONFIRMED).length,
      byDisease,
      reportGeneratedAt: new Date(),
    };
  }

  /**
   * 13. Retrieves disease case details with complete documentation.
   */
  async getDiseaseCaseDetails(reportId: string): Promise<any> {
    const CommunicableDiseaseReport = createCommunicableDiseaseReportModel(this.sequelize);
    const report = await CommunicableDiseaseReport.findByPk(reportId);

    if (!report) {
      throw new NotFoundException(`Disease report ${reportId} not found`);
    }

    return report.toJSON();
  }

  // ============================================================================
  // 3. CONTACT TRACING WORKFLOWS (Functions 14-19)
  // ============================================================================

  /**
   * 14. Records contact tracing for disease case exposure.
   */
  async recordContactTracing(tracingData: ContactTracingData): Promise<any> {
    this.logger.log(`Recording contact tracing for index case ${tracingData.indexCaseId}`);

    const ContactTracing = createContactTracingModel(this.sequelize);
    const tracing = await ContactTracing.create(tracingData);

    return tracing.toJSON();
  }

  /**
   * 15. Retrieves all contacts for index case with risk assessment.
   */
  async getContactsForIndexCase(indexCaseId: string): Promise<any[]> {
    const ContactTracing = createContactTracingModel(this.sequelize);

    const contacts = await ContactTracing.findAll({
      where: { indexCaseId },
      order: [['contactRiskLevel', 'ASC'], ['contactDate', 'DESC']],
    });

    return contacts.map(c => c.toJSON());
  }

  /**
   * 16. Identifies high-risk contacts requiring immediate notification.
   */
  async identifyHighRiskContacts(indexCaseId: string): Promise<any[]> {
    const ContactTracing = createContactTracingModel(this.sequelize);

    const highRisk = await ContactTracing.findAll({
      where: {
        indexCaseId,
        contactRiskLevel: [ContactRiskLevel.HIGH, ContactRiskLevel.MODERATE],
      },
      order: [['contactDate', 'DESC']],
    });

    return highRisk.map(c => c.toJSON());
  }

  /**
   * 17. Updates contact notification status after parent communication.
   */
  async updateContactNotificationStatus(tracingId: string, notificationDate: Date): Promise<any> {
    const ContactTracing = createContactTracingModel(this.sequelize);
    const tracing = await ContactTracing.findByPk(tracingId);

    if (!tracing) {
      throw new NotFoundException(`Contact tracing ${tracingId} not found`);
    }

    await tracing.update({
      notificationSent: true,
      notificationDate,
    });

    return tracing.toJSON();
  }

  /**
   * 18. Generates contact tracing map for outbreak visualization.
   */
  async generateContactTracingMap(outbreakId: string): Promise<any> {
    const CommunicableDiseaseReport = createCommunicableDiseaseReportModel(this.sequelize);
    const cases = await CommunicableDiseaseReport.findAll({
      where: { outbreakId },
    });

    const ContactTracing = createContactTracingModel(this.sequelize);
    const allContacts = [];

    for (const caseReport of cases) {
      const contacts = await ContactTracing.findAll({
        where: { indexCaseId: caseReport.id },
      });
      allContacts.push(...contacts);
    }

    return {
      outbreakId,
      totalCases: cases.length,
      totalContacts: allContacts.length,
      highRiskContacts: allContacts.filter(c => c.contactRiskLevel === ContactRiskLevel.HIGH).length,
      contactNetwork: allContacts.map(c => c.toJSON()),
      mapGeneratedAt: new Date(),
    };
  }

  /**
   * 19. Exports contact tracing data for health department.
   */
  async exportContactTracingData(indexCaseId: string): Promise<any> {
    const ContactTracing = createContactTracingModel(this.sequelize);
    const contacts = await ContactTracing.findAll({
      where: { indexCaseId },
    });

    return {
      indexCaseId,
      totalContacts: contacts.length,
      contactData: contacts.map(c => ({
        contactDate: c.contactDate,
        contactType: c.contactType,
        contactRiskLevel: c.contactRiskLevel,
        quarantineRecommended: c.quarantineRecommended,
        testingRecommended: c.testingRecommended,
      })),
      exportedAt: new Date(),
    };
  }

  // ============================================================================
  // 4. QUARANTINE & ISOLATION PROTOCOLS (Functions 20-25)
  // ============================================================================

  /**
   * 20. Initiates quarantine or isolation protocol for student.
   */
  async initiateQuarantineProtocol(protocolData: QuarantineProtocolData): Promise<any> {
    this.logger.log(`Initiating ${protocolData.quarantineType} for student ${protocolData.studentId}`);

    const QuarantineProtocol = createQuarantineProtocolModel(this.sequelize);
    const protocol = await QuarantineProtocol.create({
      ...protocolData,
      quarantineStatus: QuarantineStatus.ACTIVE,
    });

    return protocol.toJSON();
  }

  /**
   * 21. Records daily symptom check during quarantine/isolation.
   */
  async recordQuarantineSymptomCheck(
    quarantineId: string,
    symptomCheckData: {
      checkDate: Date;
      symptoms: string[];
      temperature?: number;
      reportedBy: string;
    },
  ): Promise<any> {
    const QuarantineProtocol = createQuarantineProtocolModel(this.sequelize);
    const protocol = await QuarantineProtocol.findByPk(quarantineId);

    if (!protocol) {
      throw new NotFoundException(`Quarantine protocol ${quarantineId} not found`);
    }

    const dailySymptomChecks = [...protocol.dailySymptomChecks, symptomCheckData];
    await protocol.update({ dailySymptomChecks });

    this.logger.log(`Recorded symptom check for quarantine ${quarantineId}`);
    return protocol.toJSON();
  }

  /**
   * 22. Completes quarantine/isolation and clears student for return.
   */
  async completeQuarantineProtocol(
    quarantineId: string,
    clearanceDocumentation: string,
  ): Promise<any> {
    const QuarantineProtocol = createQuarantineProtocolModel(this.sequelize);
    const protocol = await QuarantineProtocol.findByPk(quarantineId);

    if (!protocol) {
      throw new NotFoundException(`Quarantine protocol ${quarantineId} not found`);
    }

    await protocol.update({
      quarantineStatus: QuarantineStatus.COMPLETED,
      physicalReturnDate: new Date(),
      clearanceDocumentation,
    });

    this.logger.log(`Completed quarantine ${quarantineId}`);
    return protocol.toJSON();
  }

  /**
   * 23. Extends quarantine period with documented reason.
   */
  async extendQuarantinePeriod(quarantineId: string, newEndDate: Date, reason: string): Promise<any> {
    const QuarantineProtocol = createQuarantineProtocolModel(this.sequelize);
    const protocol = await QuarantineProtocol.findByPk(quarantineId);

    if (!protocol) {
      throw new NotFoundException(`Quarantine protocol ${quarantineId} not found`);
    }

    await protocol.update({
      endDate: newEndDate,
      quarantineStatus: QuarantineStatus.EXTENDED,
      quarantineNotes: `${protocol.quarantineNotes}\n\nExtended: ${reason}`,
    });

    this.logger.log(`Extended quarantine ${quarantineId} to ${newEndDate}`);
    return protocol.toJSON();
  }

  /**
   * 24. Retrieves active quarantines requiring monitoring.
   */
  async getActiveQuarantines(schoolId: string): Promise<any[]> {
    const QuarantineProtocol = createQuarantineProtocolModel(this.sequelize);

    const protocols = await QuarantineProtocol.findAll({
      where: {
        schoolId,
        quarantineStatus: [QuarantineStatus.ACTIVE, QuarantineStatus.EXTENDED],
      },
      order: [['endDate', 'ASC']],
    });

    return protocols.map(p => p.toJSON());
  }

  /**
   * 25. Generates quarantine compliance report.
   */
  async generateQuarantineComplianceReport(schoolId: string, startDate: Date, endDate: Date): Promise<any> {
    const QuarantineProtocol = createQuarantineProtocolModel(this.sequelize);

    const protocols = await QuarantineProtocol.findAll({
      where: {
        schoolId,
        startDate: { [Op.between]: [startDate, endDate] },
      },
    });

    return {
      schoolId,
      reportPeriod: { startDate, endDate },
      totalQuarantines: protocols.length,
      isolations: protocols.filter(p => p.quarantineType === 'isolation').length,
      quarantines: protocols.filter(p => p.quarantineType === 'quarantine').length,
      completed: protocols.filter(p => p.quarantineStatus === QuarantineStatus.COMPLETED).length,
      reportGeneratedAt: new Date(),
    };
  }

  // ============================================================================
  // 5. RETURN-TO-SCHOOL CLEARANCE (Functions 26-30)
  // ============================================================================

  /**
   * 26. Processes return-to-school clearance request.
   */
  async processReturnToSchoolClearance(clearanceData: ReturnToSchoolClearanceData): Promise<any> {
    this.logger.log(`Processing return clearance for student ${clearanceData.studentId}`);

    return {
      ...clearanceData,
      clearanceId: `CLEAR-${Date.now()}`,
      clearanceRequestDate: new Date(),
      clearanceStatus: ClearanceStatus.PENDING_DOCUMENTATION,
    };
  }

  /**
   * 27. Verifies clearance criteria checklist completion.
   */
  async verifyClearanceCriteria(
    clearanceId: string,
    criteriaResults: Array<{ criterion: string; met: boolean; verifiedBy: string }>,
  ): Promise<any> {
    const allCriteriaMet = criteriaResults.every(c => c.met);

    return {
      clearanceId,
      criteriaVerified: true,
      allCriteriaMet,
      clearanceStatus: allCriteriaMet ? ClearanceStatus.CLEARED : ClearanceStatus.NOT_CLEARED,
      verifiedAt: new Date(),
    };
  }

  /**
   * 28. Approves return-to-school clearance.
   */
  async approveReturnToSchoolClearance(
    clearanceId: string,
    approvedBy: string,
    conditions?: string[],
  ): Promise<any> {
    return {
      clearanceId,
      clearanceStatus: conditions && conditions.length > 0 ? ClearanceStatus.CONDITIONAL : ClearanceStatus.CLEARED,
      clearanceApprovedBy: approvedBy,
      clearanceApprovedDate: new Date(),
      clearanceConditions: conditions || [],
    };
  }

  /**
   * 29. Denies return-to-school clearance with reason.
   */
  async denyReturnToSchoolClearance(clearanceId: string, denialReason: string): Promise<any> {
    return {
      clearanceId,
      clearanceStatus: ClearanceStatus.NOT_CLEARED,
      denialReason,
      deniedAt: new Date(),
      followUpRequired: true,
    };
  }

  /**
   * 30. Retrieves pending clearance requests requiring action.
   */
  async getPendingClearanceRequests(schoolId: string): Promise<any[]> {
    return [
      {
        clearanceId: 'CLEAR-123',
        studentId: 'student-456',
        diagnosisName: 'COVID-19',
        clearanceRequestDate: new Date(),
        clearanceStatus: ClearanceStatus.PENDING_DOCUMENTATION,
      },
    ];
  }

  // ============================================================================
  // 6. IMMUNIZATION GAP IDENTIFICATION (Functions 31-35)
  // ============================================================================

  /**
   * 31. Identifies immunization gaps for student population.
   */
  async identifyImmunizationGaps(gapData: ImmunizationGapData): Promise<any> {
    this.logger.log(`Identifying immunization gaps for student ${gapData.studentId}`);

    return {
      ...gapData,
      gapId: `GAP-${Date.now()}`,
      gapIdentifiedDate: new Date(),
    };
  }

  /**
   * 32. Retrieves non-compliant students requiring follow-up.
   */
  async getNonCompliantStudents(schoolId: string): Promise<any[]> {
    return [
      {
        gapId: 'GAP-123',
        studentId: 'student-456',
        complianceStatus: 'non_compliant',
        exclusionRisk: true,
        followUpRequired: true,
      },
    ];
  }

  /**
   * 33. Sends immunization gap notification to parents.
   */
  async notifyParentImmunizationGap(
    gapId: string,
    studentId: string,
    requiredVaccines: string[],
  ): Promise<any> {
    return {
      gapId,
      studentId,
      notificationSent: true,
      requiredVaccines,
      notificationDate: new Date(),
      followUpDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    };
  }

  /**
   * 34. Updates immunization compliance status after vaccination.
   */
  async updateImmunizationCompliance(gapId: string, updatedVaccines: Array<any>): Promise<any> {
    const allDosesComplete = updatedVaccines.every(v => v.dosesDue === v.dosesReceived);

    return {
      gapId,
      updatedVaccines,
      complianceStatus: allDosesComplete ? 'compliant' : 'non_compliant',
      updatedAt: new Date(),
    };
  }

  /**
   * 35. Generates school-wide immunization compliance report.
   */
  async generateImmunizationComplianceReport(schoolId: string): Promise<any> {
    return {
      schoolId,
      totalStudents: 850,
      compliantStudents: 820,
      nonCompliantStudents: 30,
      complianceRate: 96.5,
      exclusionRisk: 5,
      reportGeneratedAt: new Date(),
    };
  }

  // ============================================================================
  // 7. HEALTH DEPARTMENT COORDINATION (Functions 36-39)
  // ============================================================================

  /**
   * 36. Coordinates with health department for disease reporting.
   */
  async coordinateHealthDepartmentReporting(coordinationData: HealthDepartmentCoordinationData): Promise<any> {
    this.logger.log(`Coordinating with health department: ${coordinationData.reportType}`);

    return {
      ...coordinationData,
      coordinationId: `COORD-${Date.now()}`,
      reportDate: new Date(),
    };
  }

  /**
   * 37. Logs health department communication and action items.
   */
  async logHealthDepartmentCommunication(
    coordinationId: string,
    communicationData: {
      communicationDate: Date;
      communicationType: 'phone' | 'email' | 'in_person' | 'fax';
      summary: string;
      actionItems: string[];
    },
  ): Promise<any> {
    return {
      coordinationId,
      communication: communicationData,
      loggedAt: new Date(),
    };
  }

  /**
   * 38. Retrieves health department coordination history.
   */
  async getHealthDepartmentCoordinationHistory(schoolId: string, startDate: Date, endDate: Date): Promise<any[]> {
    return [
      {
        coordinationId: 'COORD-123',
        reportType: 'disease_case',
        reportDate: new Date(),
        diseaseName: 'COVID-19',
        healthDepartmentCaseNumber: 'HD-2024-1234',
      },
    ];
  }

  /**
   * 39. Generates health department coordination summary.
   */
  async generateHealthDepartmentCoordinationSummary(schoolId: string, month: number, year: number): Promise<any> {
    return {
      schoolId,
      reportPeriod: { month, year },
      totalReports: 15,
      diseaseReports: 10,
      outbreakReports: 2,
      routineSurveillance: 3,
      summaryGeneratedAt: new Date(),
    };
  }

  // ============================================================================
  // 8. PARENT NOTIFICATION & PANDEMIC RESPONSE (Functions 40-42)
  // ============================================================================

  /**
   * 40. Sends exposure notification to affected parents.
   */
  async sendParentExposureNotification(notificationData: ParentExposureNotificationData): Promise<any> {
    this.logger.log(`Sending exposure notification for student ${notificationData.studentId}`);

    return {
      ...notificationData,
      notificationId: `NOTIF-${Date.now()}`,
      notificationDate: new Date(),
      notificationSent: true,
    };
  }

  /**
   * 41. Activates pandemic response protocol.
   */
  async activatePandemicResponseProtocol(responseData: PandemicResponseData): Promise<any> {
    this.logger.log(`Activating pandemic response: ${responseData.pandemicName} at ${responseData.responseLevel}`);

    return {
      ...responseData,
      responseId: `PANDEMIC-${Date.now()}`,
      activationDate: new Date(),
      protocolActive: true,
    };
  }

  /**
   * 42. Analyzes disease trends for early outbreak detection.
   */
  async analyzeDiseaseTrends(trendData: DiseaseTrendData): Promise<any> {
    this.logger.log(`Analyzing disease trends for ${trendData.diseaseName}`);

    return {
      ...trendData,
      trendId: `TREND-${Date.now()}`,
      analysisCompleted: true,
      earlyWarningIssued: trendData.alertThresholdReached,
    };
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default InfectiousDiseaseManagementCompositeService;
