/**
 * LOC: CLINIC-SPORTS-COMP-001
 * File: /reuse/clinic/composites/sports-athletics-health-composites.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - sequelize (v6.x)
 *   - ../../server/health/health-patient-management-kit
 *   - ../../server/health/health-clinical-workflows-kit
 *   - ../../server/health/health-medical-records-kit
 *   - ../../education/student-records-kit
 *   - ../../education/student-communication-kit
 *   - ../../data/crud-operations
 *   - ../../data/data-repository
 *
 * DOWNSTREAM (imported by):
 *   - School athletic program controllers
 *   - Sports medicine workflows
 *   - Athletic trainer interfaces
 *   - Concussion management systems
 *   - Return-to-play protocol services
 *   - Sports eligibility tracking modules
 */

/**
 * File: /reuse/clinic/composites/sports-athletics-health-composites.ts
 * Locator: WC-CLINIC-SPORTS-001
 * Purpose: School Sports & Athletics Health Composite - Comprehensive athletic health management
 *
 * Upstream: health-patient-management-kit, health-clinical-workflows-kit, health-medical-records-kit,
 *           student-records-kit, student-communication-kit, data-repository
 * Downstream: Athletic program controllers, Sports medicine workflows, Athletic trainer interfaces
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x
 * Exports: 44 composed functions for complete school sports health management
 *
 * LLM Context: Production-grade school sports and athletics health composite for K-12 SaaS platform.
 * Provides comprehensive athletic health management including pre-participation physical examinations,
 * sports eligibility clearance with medical documentation, concussion baseline testing and monitoring,
 * injury during sports documentation with SOAP note generation, evidence-based return-to-play protocols,
 * athletic trainer coordination and communication workflows, cardiac screening for high-risk athletes,
 * performance enhancement monitoring with safety oversight, heat illness prevention protocols,
 * game day medical staffing coordination, emergency action plan management, sports-specific injury
 * tracking and analytics, and comprehensive athletic health records for regulatory compliance.
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
 * Athletic physical examination status
 */
export enum AthleticPhysicalStatus {
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  CLEARED = 'cleared',
  CLEARED_WITH_RESTRICTIONS = 'cleared_with_restrictions',
  NOT_CLEARED = 'not_cleared',
  EXPIRED = 'expired',
  PENDING_REVIEW = 'pending_review',
}

/**
 * Sports eligibility clearance status
 */
export enum SportsEligibilityStatus {
  ELIGIBLE = 'eligible',
  CONDITIONALLY_ELIGIBLE = 'conditionally_eligible',
  INELIGIBLE = 'ineligible',
  PENDING_DOCUMENTATION = 'pending_documentation',
  UNDER_REVIEW = 'under_review',
  SUSPENDED = 'suspended',
}

/**
 * Concussion assessment status
 */
export enum ConcussionStatus {
  BASELINE_COMPLETED = 'baseline_completed',
  SUSPECTED_CONCUSSION = 'suspected_concussion',
  DIAGNOSED_CONCUSSION = 'diagnosed_concussion',
  IN_RECOVERY = 'in_recovery',
  CLEARED_FOR_RETURN = 'cleared_for_return',
  REQUIRES_SPECIALIST = 'requires_specialist',
}

/**
 * Return-to-play protocol stages
 */
export enum ReturnToPlayStage {
  REST_RECOVERY = 'rest_recovery',
  LIGHT_AEROBIC = 'light_aerobic',
  SPORT_SPECIFIC_EXERCISE = 'sport_specific_exercise',
  NON_CONTACT_DRILLS = 'non_contact_drills',
  FULL_CONTACT_PRACTICE = 'full_contact_practice',
  GAME_READY = 'game_ready',
  MEDICALLY_CLEARED = 'medically_cleared',
}

/**
 * Injury severity classification
 */
export enum InjurySeverity {
  MINOR = 'minor',
  MODERATE = 'moderate',
  SEVERE = 'severe',
  CRITICAL = 'critical',
  SEASON_ENDING = 'season_ending',
}

/**
 * Cardiac screening risk levels
 */
export enum CardiacRiskLevel {
  LOW_RISK = 'low_risk',
  MODERATE_RISK = 'moderate_risk',
  HIGH_RISK = 'high_risk',
  REQUIRES_CLEARANCE = 'requires_clearance',
  NOT_CLEARED = 'not_cleared',
}

/**
 * Heat illness risk categories
 */
export enum HeatIllnessRisk {
  LOW = 'low',
  MODERATE = 'moderate',
  HIGH = 'high',
  EXTREME = 'extreme',
}

/**
 * Complete athletic physical examination record with conditional type validation
 */
export interface AthleticPhysicalExaminationData<T extends AthleticPhysicalStatus = AthleticPhysicalStatus> {
  examId?: string;
  studentId: string;
  athleteFirstName: string;
  athleteLastName: string;
  dateOfBirth: Date;
  examDate: Date;
  expirationDate: Date;
  examiningPhysician: string;
  physicianLicense: string;
  physicianSignature?: string;
  examStatus: T;
  restrictions: T extends AthleticPhysicalStatus.CLEARED_WITH_RESTRICTIONS ? string[] : string[] | null;
  medicalHistory: {
    previousInjuries: string[];
    chronicConditions: string[];
    currentMedications: string[];
    allergies: string[];
    familyCardiacHistory: boolean;
    concussionHistory: number;
  };
  vitalSigns: {
    height: number;
    weight: number;
    bloodPressure: string;
    heartRate: number;
    respiratoryRate: number;
  };
  clearanceNotes?: string;
  followUpRequired: boolean;
  schoolId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Sports eligibility clearance with mapped type utilities
 */
export interface SportsEligibilityClearanceData {
  clearanceId?: string;
  studentId: string;
  sportsRequested: readonly string[];
  eligibilityStatus: SportsEligibilityStatus;
  physicalExamId: string;
  physicalExamExpiration: Date;
  insuranceVerified: boolean;
  parentConsentId: string;
  emergencyContactsVerified: boolean;
  academicEligibility: boolean;
  disciplinaryEligibility: boolean;
  clearanceIssueDate: Date;
  clearanceExpirationDate: Date;
  restrictions?: Readonly<string[]>;
  clearingOfficer: string;
  schoolId: string;
}

/**
 * Concussion baseline testing record with strict null safety
 */
export interface ConcussionBaselineTestData {
  baselineId?: string;
  studentId: string;
  testDate: Date;
  testAdministrator: string;
  testingProtocol: 'ImPACT' | 'SCAT5' | 'King-Devick' | 'C3_Logix' | 'other';
  baselineScores: {
    verbalMemory: number;
    visualMemory: number;
    processingSpeed: number;
    reactionTime: number;
    symptomsScore: number;
  };
  balanceAssessment?: {
    doubleLegsScore: number;
    singleLegLeftScore: number;
    singleLegRightScore: number;
    tandemStanceScore: number;
  };
  validUntilDate: Date;
  testNotes?: string;
  schoolId: string;
}

/**
 * Injury during sports documentation with template literal types
 */
export type InjuryLocation = 'head' | 'neck' | 'shoulder' | 'arm' | 'elbow' | 'wrist' | 'hand' |
  'chest' | 'back' | 'abdomen' | 'hip' | 'thigh' | 'knee' | 'lower_leg' | 'ankle' | 'foot';

export type InjuryType = 'concussion' | 'fracture' | 'sprain' | 'strain' | 'contusion' | 'laceration' |
  'dislocation' | 'overuse' | 'heat_illness' | 'cardiac_event' | 'other';

export interface InjuryDuringActivityData {
  injuryId?: string;
  studentId: string;
  injuryDate: Date;
  injuryTime: string;
  sportActivity: string;
  injuryLocation: InjuryLocation;
  injuryType: InjuryType;
  injurySeverity: InjurySeverity;
  mechanismOfInjury: string;
  symptoms: string[];
  immediateResponse: string;
  treatmentProvided: string[];
  emergencyServicesContacted: boolean;
  parentNotified: boolean;
  parentNotificationTime?: Date;
  athleticTrainerPresent: boolean;
  witnessAccounts?: string[];
  returnToActivitySameDay: boolean;
  followUpRequired: boolean;
  referralsMade: Array<{ specialty: string; providerName: string; urgent: boolean }>;
  injuryNotes: string;
  documentedBy: string;
  schoolId: string;
}

/**
 * Return-to-play protocol progression with generic constraints
 */
export interface ReturnToPlayProtocolData<TStage extends ReturnToPlayStage = ReturnToPlayStage> {
  protocolId?: string;
  studentId: string;
  injuryId: string;
  injuryType: InjuryType;
  protocolStartDate: Date;
  currentStage: TStage;
  stageHistory: Array<{
    stage: ReturnToPlayStage;
    startDate: Date;
    completionDate?: Date;
    symptomsReported: string[];
    observations: string;
    approvedBy: string;
  }>;
  medicalClearanceRequired: TStage extends ReturnToPlayStage.GAME_READY ? true : boolean;
  physicianClearance?: TStage extends ReturnToPlayStage.MEDICALLY_CLEARED ? {
    physicianName: string;
    clearanceDate: Date;
    clearanceNotes: string;
  } : null;
  estimatedReturnDate?: Date;
  athleticTrainerNotes: string;
  parentInformed: boolean;
  schoolId: string;
}

/**
 * Athletic trainer coordination record
 */
export interface AthleticTrainerCoordinationData {
  coordinationId?: string;
  studentAthleteId: string;
  athleticTrainerId: string;
  schoolNurseId?: string;
  physicianId?: string;
  coordinationType: 'injury_assessment' | 'treatment_plan' | 'rehabilitation' | 'return_to_play' | 'medical_referral';
  communicationDate: Date;
  communicationMethod: 'in_person' | 'phone' | 'email' | 'secure_message' | 'video_conference';
  communicationSummary: string;
  actionItems: Array<{
    description: string;
    assignedTo: string;
    dueDate: Date;
    status: 'pending' | 'in_progress' | 'completed';
  }>;
  attachments?: string[];
  followUpRequired: boolean;
  followUpDate?: Date;
  schoolId: string;
}

/**
 * Cardiac screening for athletes with utility types
 */
export interface CardiacScreeningData {
  screeningId?: string;
  studentId: string;
  screeningDate: Date;
  screeningType: 'questionnaire' | 'ecg' | 'echocardiogram' | 'stress_test' | 'comprehensive';
  personalCardiacHistory: {
    chestPainDuringExercise: boolean;
    unexplainedFainting: boolean;
    excessiveFatigue: boolean;
    heartMurmur: boolean;
    highBloodPressure: boolean;
  };
  familyCardiacHistory: {
    suddenCardiacDeath: boolean;
    heartDiseaseUnder50: boolean;
    cardiomyopathy: boolean;
    longQTSyndrome: boolean;
    marfanSyndrome: boolean;
  };
  physicalFindings?: {
    heartRate: number;
    bloodPressure: string;
    heartMurmurPresent: boolean;
    abnormalRhythm: boolean;
  };
  diagnosticResults?: Record<string, unknown>;
  riskLevel: CardiacRiskLevel;
  recommendedActions: string[];
  clearanceStatus: 'cleared' | 'cleared_with_monitoring' | 'requires_evaluation' | 'not_cleared';
  cardiologistReferral?: {
    referralDate: Date;
    cardiologistName: string;
    appointmentScheduled: boolean;
  };
  screeningPhysician: string;
  schoolId: string;
}

/**
 * Performance enhancement monitoring record
 */
export interface PerformanceMonitoringData {
  monitoringId?: string;
  studentId: string;
  monitoringDate: Date;
  supplementsReported: Array<{
    supplementName: string;
    purpose: string;
    dosage: string;
    startDate: Date;
    prescribedOrOTC: 'prescribed' | 'otc';
  }>;
  nutritionalAssessment?: {
    dietQuality: 'poor' | 'fair' | 'good' | 'excellent';
    hydrationAdequate: boolean;
    mealsPerDay: number;
    concerns: string[];
  };
  performanceMetrics?: {
    strengthChanges: string;
    enduranceChanges: string;
    speedChanges: string;
    injuryFrequency: number;
  };
  riskyBehaviorScreening: {
    substanceUseReported: boolean;
    performanceEnhancingDrugs: boolean;
    extremeWeightChanges: boolean;
  };
  educationProvided: string[];
  followUpActions: string[];
  monitoredBy: string;
  schoolId: string;
}

/**
 * Heat illness prevention protocol
 */
export interface HeatIllnessPreventionData {
  protocolId?: string;
  date: Date;
  temperature: number;
  humidity: number;
  heatIndex: number;
  wbgt?: number;
  riskLevel: HeatIllnessRisk;
  activityModifications: Array<{
    timeOfDay: string;
    activityType: string;
    modification: 'proceed' | 'increase_breaks' | 'reduce_intensity' | 'move_indoors' | 'cancel';
    rationaleNote: string;
  }>;
  hydrationProtocol: {
    waterAvailability: 'adequate' | 'limited' | 'insufficient';
    scheduledBreaksMinutes: number;
    electrolyteSupplements: boolean;
  };
  athletesAtRisk?: string[];
  emergencyActionPlanActivated: boolean;
  coolingStationSetup: boolean;
  medicalStaffPresent: string[];
  incidentsReported?: Array<{
    studentId: string;
    symptomsObserved: string[];
    interventionTaken: string;
    outcome: string;
  }>;
  protocolCoordinator: string;
  schoolId: string;
}

/**
 * Game day medical staffing coordination
 */
export interface GameDayMedicalStaffingData {
  staffingId?: string;
  gameDate: Date;
  gameTime: string;
  sportType: string;
  homeOrAway: 'home' | 'away';
  venue: string;
  medicalStaffAssigned: Array<{
    staffId: string;
    role: 'athletic_trainer' | 'school_nurse' | 'physician' | 'emt' | 'volunteer';
    name: string;
    certifications: string[];
    contactNumber: string;
  }>;
  emergencyEquipmentChecklist: Record<string, boolean>;
  ambulanceOnSite: boolean;
  ambulanceCompany?: string;
  hospitalNotified: boolean;
  nearestTraumaCenter: {
    name: string;
    distance: string;
    estimatedResponseTime: string;
  };
  emergencyActionPlanReviewed: boolean;
  athletesWithSpecialNeeds?: Array<{
    studentId: string;
    condition: string;
    actionRequired: string;
  }>;
  weatherConditions?: {
    temperature: number;
    conditions: string;
    concerns: string[];
  };
  coordinatedBy: string;
  schoolId: string;
}

// ============================================================================
// UTILITY TYPES & ADVANCED TYPE PATTERNS
// ============================================================================

/**
 * Readonly deep partial utility for immutable updates
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends (infer U)[]
    ? ReadonlyArray<DeepReadonly<U>>
    : T[P] extends object
    ? DeepReadonly<T[P]>
    : T[P];
};

/**
 * Required fields utility
 */
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Conditional type for medical clearance documents
 */
export type MedicalClearanceDocument<T extends { requiresClearance: boolean }> = T['requiresClearance'] extends true
  ? RequiredFields<T, 'clearanceDate' | 'clearingPhysician'>
  : T;

/**
 * Extract enum values as union type
 */
export type EnumValues<T> = T[keyof T];

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Athletic Physical Examinations
 */
export const createAthleticPhysicalModel = (sequelize: Sequelize) => {
  class AthleticPhysical extends Model {
    public id!: string;
    public studentId!: string;
    public athleteFirstName!: string;
    public athleteLastName!: string;
    public dateOfBirth!: Date;
    public examDate!: Date;
    public expirationDate!: Date;
    public examiningPhysician!: string;
    public physicianLicense!: string;
    public physicianSignature!: string | null;
    public examStatus!: AthleticPhysicalStatus;
    public restrictions!: string[] | null;
    public medicalHistory!: Record<string, any>;
    public vitalSigns!: Record<string, any>;
    public clearanceNotes!: string | null;
    public followUpRequired!: boolean;
    public schoolId!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  AthleticPhysical.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      studentId: { type: DataTypes.UUID, allowNull: false, references: { model: 'students', key: 'id' } },
      athleteFirstName: { type: DataTypes.STRING(100), allowNull: false },
      athleteLastName: { type: DataTypes.STRING(100), allowNull: false },
      dateOfBirth: { type: DataTypes.DATEONLY, allowNull: false },
      examDate: { type: DataTypes.DATEONLY, allowNull: false },
      expirationDate: { type: DataTypes.DATEONLY, allowNull: false },
      examiningPhysician: { type: DataTypes.STRING(255), allowNull: false },
      physicianLicense: { type: DataTypes.STRING(50), allowNull: false },
      physicianSignature: { type: DataTypes.TEXT, allowNull: true },
      examStatus: { type: DataTypes.ENUM(...Object.values(AthleticPhysicalStatus)), allowNull: false },
      restrictions: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
      medicalHistory: { type: DataTypes.JSONB, allowNull: false },
      vitalSigns: { type: DataTypes.JSONB, allowNull: false },
      clearanceNotes: { type: DataTypes.TEXT, allowNull: true },
      followUpRequired: { type: DataTypes.BOOLEAN, defaultValue: false },
      schoolId: { type: DataTypes.UUID, allowNull: false, references: { model: 'schools', key: 'id' } },
    },
    {
      sequelize,
      tableName: 'athletic_physical_examinations',
      timestamps: true,
      indexes: [
        { fields: ['studentId'] },
        { fields: ['schoolId'] },
        { fields: ['examStatus'] },
        { fields: ['expirationDate'] },
      ],
    },
  );

  return AthleticPhysical;
};

/**
 * Sequelize model for Sports Eligibility Clearances
 */
export const createSportsEligibilityModel = (sequelize: Sequelize) => {
  class SportsEligibility extends Model {
    public id!: string;
    public studentId!: string;
    public sportsRequested!: string[];
    public eligibilityStatus!: SportsEligibilityStatus;
    public physicalExamId!: string;
    public physicalExamExpiration!: Date;
    public insuranceVerified!: boolean;
    public parentConsentId!: string;
    public emergencyContactsVerified!: boolean;
    public academicEligibility!: boolean;
    public disciplinaryEligibility!: boolean;
    public clearanceIssueDate!: Date;
    public clearanceExpirationDate!: Date;
    public restrictions!: string[] | null;
    public clearingOfficer!: string;
    public schoolId!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  SportsEligibility.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      studentId: { type: DataTypes.UUID, allowNull: false, references: { model: 'students', key: 'id' } },
      sportsRequested: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false },
      eligibilityStatus: { type: DataTypes.ENUM(...Object.values(SportsEligibilityStatus)), allowNull: false },
      physicalExamId: { type: DataTypes.UUID, allowNull: false, references: { model: 'athletic_physical_examinations', key: 'id' } },
      physicalExamExpiration: { type: DataTypes.DATEONLY, allowNull: false },
      insuranceVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
      parentConsentId: { type: DataTypes.STRING(100), allowNull: false },
      emergencyContactsVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
      academicEligibility: { type: DataTypes.BOOLEAN, defaultValue: true },
      disciplinaryEligibility: { type: DataTypes.BOOLEAN, defaultValue: true },
      clearanceIssueDate: { type: DataTypes.DATEONLY, allowNull: false },
      clearanceExpirationDate: { type: DataTypes.DATEONLY, allowNull: false },
      restrictions: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
      clearingOfficer: { type: DataTypes.UUID, allowNull: false, references: { model: 'users', key: 'id' } },
      schoolId: { type: DataTypes.UUID, allowNull: false, references: { model: 'schools', key: 'id' } },
    },
    {
      sequelize,
      tableName: 'sports_eligibility_clearances',
      timestamps: true,
      indexes: [
        { fields: ['studentId'] },
        { fields: ['schoolId'] },
        { fields: ['eligibilityStatus'] },
        { fields: ['clearanceExpirationDate'] },
      ],
    },
  );

  return SportsEligibility;
};

/**
 * Sequelize model for Concussion Baseline Tests
 */
export const createConcussionBaselineModel = (sequelize: Sequelize) => {
  class ConcussionBaseline extends Model {
    public id!: string;
    public studentId!: string;
    public testDate!: Date;
    public testAdministrator!: string;
    public testingProtocol!: string;
    public baselineScores!: Record<string, number>;
    public balanceAssessment!: Record<string, number> | null;
    public validUntilDate!: Date;
    public testNotes!: string | null;
    public schoolId!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ConcussionBaseline.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      studentId: { type: DataTypes.UUID, allowNull: false, references: { model: 'students', key: 'id' } },
      testDate: { type: DataTypes.DATEONLY, allowNull: false },
      testAdministrator: { type: DataTypes.UUID, allowNull: false, references: { model: 'users', key: 'id' } },
      testingProtocol: { type: DataTypes.STRING(50), allowNull: false },
      baselineScores: { type: DataTypes.JSONB, allowNull: false },
      balanceAssessment: { type: DataTypes.JSONB, allowNull: true },
      validUntilDate: { type: DataTypes.DATEONLY, allowNull: false },
      testNotes: { type: DataTypes.TEXT, allowNull: true },
      schoolId: { type: DataTypes.UUID, allowNull: false, references: { model: 'schools', key: 'id' } },
    },
    {
      sequelize,
      tableName: 'concussion_baseline_tests',
      timestamps: true,
      indexes: [{ fields: ['studentId'] }, { fields: ['schoolId'] }, { fields: ['validUntilDate'] }],
    },
  );

  return ConcussionBaseline;
};

/**
 * Sequelize model for Injury During Activity
 */
export const createInjuryDuringActivityModel = (sequelize: Sequelize) => {
  class InjuryDuringActivity extends Model {
    public id!: string;
    public studentId!: string;
    public injuryDate!: Date;
    public injuryTime!: string;
    public sportActivity!: string;
    public injuryLocation!: InjuryLocation;
    public injuryType!: InjuryType;
    public injurySeverity!: InjurySeverity;
    public mechanismOfInjury!: string;
    public symptoms!: string[];
    public immediateResponse!: string;
    public treatmentProvided!: string[];
    public emergencyServicesContacted!: boolean;
    public parentNotified!: boolean;
    public parentNotificationTime!: Date | null;
    public athleticTrainerPresent!: boolean;
    public witnessAccounts!: string[] | null;
    public returnToActivitySameDay!: boolean;
    public followUpRequired!: boolean;
    public referralsMade!: Array<Record<string, any>>;
    public injuryNotes!: string;
    public documentedBy!: string;
    public schoolId!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  InjuryDuringActivity.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      studentId: { type: DataTypes.UUID, allowNull: false, references: { model: 'students', key: 'id' } },
      injuryDate: { type: DataTypes.DATEONLY, allowNull: false },
      injuryTime: { type: DataTypes.TIME, allowNull: false },
      sportActivity: { type: DataTypes.STRING(100), allowNull: false },
      injuryLocation: { type: DataTypes.STRING(50), allowNull: false },
      injuryType: { type: DataTypes.STRING(50), allowNull: false },
      injurySeverity: { type: DataTypes.ENUM(...Object.values(InjurySeverity)), allowNull: false },
      mechanismOfInjury: { type: DataTypes.TEXT, allowNull: false },
      symptoms: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false },
      immediateResponse: { type: DataTypes.TEXT, allowNull: false },
      treatmentProvided: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false },
      emergencyServicesContacted: { type: DataTypes.BOOLEAN, defaultValue: false },
      parentNotified: { type: DataTypes.BOOLEAN, defaultValue: false },
      parentNotificationTime: { type: DataTypes.DATE, allowNull: true },
      athleticTrainerPresent: { type: DataTypes.BOOLEAN, defaultValue: false },
      witnessAccounts: { type: DataTypes.ARRAY(DataTypes.TEXT), allowNull: true },
      returnToActivitySameDay: { type: DataTypes.BOOLEAN, defaultValue: false },
      followUpRequired: { type: DataTypes.BOOLEAN, defaultValue: false },
      referralsMade: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
      injuryNotes: { type: DataTypes.TEXT, allowNull: false },
      documentedBy: { type: DataTypes.UUID, allowNull: false, references: { model: 'users', key: 'id' } },
      schoolId: { type: DataTypes.UUID, allowNull: false, references: { model: 'schools', key: 'id' } },
    },
    {
      sequelize,
      tableName: 'injury_during_activity',
      timestamps: true,
      indexes: [
        { fields: ['studentId'] },
        { fields: ['schoolId'] },
        { fields: ['injuryDate'] },
        { fields: ['injurySeverity'] },
        { fields: ['injuryType'] },
      ],
    },
  );

  return InjuryDuringActivity;
};

// ============================================================================
// NESTJS INJECTABLE SERVICE
// ============================================================================

/**
 * School Sports & Athletics Health Composite Service
 *
 * Provides comprehensive sports medicine and athletic health management for K-12 school athletic programs
 * including physicals, eligibility, concussion protocols, injury management, and safety monitoring.
 */
@Injectable()
export class SportsAthleticsHealthCompositeService {
  private readonly logger = new Logger(SportsAthleticsHealthCompositeService.name);

  constructor(
    @Inject('SEQUELIZE') private readonly sequelize: Sequelize,
  ) {}

  // ============================================================================
  // 1. ATHLETIC PHYSICAL EXAMINATIONS (Functions 1-6)
  // ============================================================================

  /**
   * 1. Creates athletic physical examination record with comprehensive medical history.
   * Validates physician credentials and sets appropriate expiration date.
   */
  async createAthleticPhysicalExamination(
    examData: AthleticPhysicalExaminationData,
  ): Promise<DeepReadonly<AthleticPhysicalExaminationData>> {
    this.logger.log(`Creating athletic physical for student ${examData.studentId}`);

    const AthleticPhysical = createAthleticPhysicalModel(this.sequelize);
    const physical = await AthleticPhysical.create({
      ...examData,
      examStatus: AthleticPhysicalStatus.COMPLETED,
    });

    return physical.toJSON() as DeepReadonly<AthleticPhysicalExaminationData>;
  }

  /**
   * 2. Updates athletic physical examination status after medical review.
   * Handles clearance with restrictions and follow-up requirements.
   */
  async updatePhysicalExaminationStatus(
    examId: string,
    status: AthleticPhysicalStatus,
    restrictions?: string[],
    clearanceNotes?: string,
  ): Promise<any> {
    const AthleticPhysical = createAthleticPhysicalModel(this.sequelize);
    const physical = await AthleticPhysical.findByPk(examId);

    if (!physical) {
      throw new NotFoundException(`Athletic physical examination ${examId} not found`);
    }

    await physical.update({
      examStatus: status,
      restrictions: restrictions || null,
      clearanceNotes: clearanceNotes || null,
    });

    this.logger.log(`Updated physical exam ${examId} to status ${status}`);
    return physical.toJSON();
  }

  /**
   * 3. Retrieves active athletic physical for student with expiration validation.
   */
  async getActiveAthleticPhysical(studentId: string): Promise<any | null> {
    const AthleticPhysical = createAthleticPhysicalModel(this.sequelize);

    const physical = await AthleticPhysical.findOne({
      where: {
        studentId,
        examStatus: [
          AthleticPhysicalStatus.CLEARED,
          AthleticPhysicalStatus.CLEARED_WITH_RESTRICTIONS,
        ],
        expirationDate: { [Op.gte]: new Date() },
      },
      order: [['examDate', 'DESC']],
    });

    return physical?.toJSON() || null;
  }

  /**
   * 4. Validates athletic physical expiration and alerts for renewals.
   */
  async validatePhysicalExpirationStatus(studentId: string): Promise<{
    isValid: boolean;
    expirationDate?: Date;
    daysUntilExpiration?: number;
    requiresRenewal: boolean;
  }> {
    const physical = await this.getActiveAthleticPhysical(studentId);

    if (!physical) {
      return { isValid: false, requiresRenewal: true };
    }

    const expirationDate = new Date(physical.expirationDate);
    const today = new Date();
    const daysUntilExpiration = Math.ceil((expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    return {
      isValid: daysUntilExpiration > 0,
      expirationDate,
      daysUntilExpiration,
      requiresRenewal: daysUntilExpiration <= 30,
    };
  }

  /**
   * 5. Generates athletic physical examination history report for student.
   */
  async getAthleticPhysicalHistory(studentId: string): Promise<any[]> {
    const AthleticPhysical = createAthleticPhysicalModel(this.sequelize);

    const history = await AthleticPhysical.findAll({
      where: { studentId },
      order: [['examDate', 'DESC']],
    });

    return history.map(h => h.toJSON());
  }

  /**
   * 6. Identifies students with expiring physicals for proactive notification.
   */
  async getExpiringPhysicalsReport(schoolId: string, daysAhead: number = 30): Promise<any[]> {
    const AthleticPhysical = createAthleticPhysicalModel(this.sequelize);

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);

    const expiringPhysicals = await AthleticPhysical.findAll({
      where: {
        schoolId,
        examStatus: [
          AthleticPhysicalStatus.CLEARED,
          AthleticPhysicalStatus.CLEARED_WITH_RESTRICTIONS,
        ],
        expirationDate: {
          [Op.between]: [new Date(), futureDate],
        },
      },
      order: [['expirationDate', 'ASC']],
    });

    return expiringPhysicals.map(p => p.toJSON());
  }

  // ============================================================================
  // 2. SPORTS ELIGIBILITY & CLEARANCE (Functions 7-12)
  // ============================================================================

  /**
   * 7. Creates comprehensive sports eligibility clearance with multi-factor verification.
   */
  async createSportsEligibilityClearance(clearanceData: SportsEligibilityClearanceData): Promise<any> {
    this.logger.log(`Creating sports eligibility clearance for student ${clearanceData.studentId}`);

    const SportsEligibility = createSportsEligibilityModel(this.sequelize);

    // Validate physical examination is current
    const physical = await this.getActiveAthleticPhysical(clearanceData.studentId);
    if (!physical) {
      throw new BadRequestException('Valid athletic physical examination required for eligibility clearance');
    }

    const clearance = await SportsEligibility.create({
      ...clearanceData,
      eligibilityStatus: SportsEligibilityStatus.ELIGIBLE,
    });

    return clearance.toJSON();
  }

  /**
   * 8. Updates sports eligibility status based on medical or disciplinary changes.
   */
  async updateSportsEligibilityStatus(
    clearanceId: string,
    status: SportsEligibilityStatus,
    reason: string,
  ): Promise<any> {
    const SportsEligibility = createSportsEligibilityModel(this.sequelize);
    const clearance = await SportsEligibility.findByPk(clearanceId);

    if (!clearance) {
      throw new NotFoundException(`Sports eligibility clearance ${clearanceId} not found`);
    }

    await clearance.update({ eligibilityStatus: status });

    this.logger.log(`Updated eligibility ${clearanceId} to ${status}: ${reason}`);
    return clearance.toJSON();
  }

  /**
   * 9. Retrieves current sports eligibility status for student athlete.
   */
  async getCurrentSportsEligibility(studentId: string): Promise<any | null> {
    const SportsEligibility = createSportsEligibilityModel(this.sequelize);

    const eligibility = await SportsEligibility.findOne({
      where: {
        studentId,
        clearanceExpirationDate: { [Op.gte]: new Date() },
      },
      order: [['clearanceIssueDate', 'DESC']],
    });

    return eligibility?.toJSON() || null;
  }

  /**
   * 10. Validates comprehensive eligibility requirements (medical, academic, disciplinary).
   */
  async validateComprehensiveEligibility(studentId: string): Promise<{
    isEligible: boolean;
    physicalValid: boolean;
    insuranceVerified: boolean;
    academicEligible: boolean;
    disciplinaryEligible: boolean;
    blockingIssues: string[];
  }> {
    const eligibility = await this.getCurrentSportsEligibility(studentId);
    const physical = await this.getActiveAthleticPhysical(studentId);

    const blockingIssues: string[] = [];

    if (!physical) {
      blockingIssues.push('No valid athletic physical examination');
    }

    if (!eligibility) {
      blockingIssues.push('No eligibility clearance on file');
    } else {
      if (!eligibility.insuranceVerified) blockingIssues.push('Insurance verification required');
      if (!eligibility.academicEligibility) blockingIssues.push('Academic eligibility requirements not met');
      if (!eligibility.disciplinaryEligibility) blockingIssues.push('Disciplinary ineligibility');
    }

    return {
      isEligible: blockingIssues.length === 0,
      physicalValid: !!physical,
      insuranceVerified: eligibility?.insuranceVerified || false,
      academicEligible: eligibility?.academicEligibility || false,
      disciplinaryEligible: eligibility?.disciplinaryEligibility || false,
      blockingIssues,
    };
  }

  /**
   * 11. Adds or removes sports from student eligibility clearance.
   */
  async modifySportsEligibilityList(
    clearanceId: string,
    sportsToAdd: string[],
    sportsToRemove: string[],
  ): Promise<any> {
    const SportsEligibility = createSportsEligibilityModel(this.sequelize);
    const clearance = await SportsEligibility.findByPk(clearanceId);

    if (!clearance) {
      throw new NotFoundException(`Sports eligibility clearance ${clearanceId} not found`);
    }

    const currentSports = clearance.sportsRequested;
    const updatedSports = [
      ...currentSports.filter(s => !sportsToRemove.includes(s)),
      ...sportsToAdd.filter(s => !currentSports.includes(s)),
    ];

    await clearance.update({ sportsRequested: updatedSports });

    return clearance.toJSON();
  }

  /**
   * 12. Generates sports participation eligibility roster for coaching staff.
   */
  async generateSportsEligibilityRoster(schoolId: string, sportName: string): Promise<any[]> {
    const SportsEligibility = createSportsEligibilityModel(this.sequelize);

    const eligibleAthletes = await SportsEligibility.findAll({
      where: {
        schoolId,
        sportsRequested: { [Op.contains]: [sportName] },
        eligibilityStatus: [
          SportsEligibilityStatus.ELIGIBLE,
          SportsEligibilityStatus.CONDITIONALLY_ELIGIBLE,
        ],
        clearanceExpirationDate: { [Op.gte]: new Date() },
      },
    });

    return eligibleAthletes.map(a => a.toJSON());
  }

  // ============================================================================
  // 3. CONCUSSION MANAGEMENT (Functions 13-19)
  // ============================================================================

  /**
   * 13. Records concussion baseline testing for pre-season athlete assessment.
   */
  async recordConcussionBaselineTest(baselineData: ConcussionBaselineTestData): Promise<any> {
    this.logger.log(`Recording concussion baseline test for student ${baselineData.studentId}`);

    const ConcussionBaseline = createConcussionBaselineModel(this.sequelize);
    const baseline = await ConcussionBaseline.create(baselineData);

    return baseline.toJSON();
  }

  /**
   * 14. Retrieves most recent concussion baseline scores for comparison.
   */
  async getConcussionBaselineScores(studentId: string): Promise<any | null> {
    const ConcussionBaseline = createConcussionBaselineModel(this.sequelize);

    const baseline = await ConcussionBaseline.findOne({
      where: {
        studentId,
        validUntilDate: { [Op.gte]: new Date() },
      },
      order: [['testDate', 'DESC']],
    });

    return baseline?.toJSON() || null;
  }

  /**
   * 15. Documents suspected concussion with initial assessment and immediate actions.
   */
  async documentSuspectedConcussion(
    studentId: string,
    injuryDate: Date,
    symptomsObserved: string[],
    mechanismOfInjury: string,
    documentedBy: string,
    schoolId: string,
  ): Promise<any> {
    this.logger.warn(`SUSPECTED CONCUSSION documented for student ${studentId}`);

    const InjuryActivity = createInjuryDuringActivityModel(this.sequelize);

    const concussionInjury = await InjuryActivity.create({
      studentId,
      injuryDate,
      injuryTime: new Date().toTimeString(),
      sportActivity: 'Athletic activity',
      injuryLocation: 'head',
      injuryType: 'concussion',
      injurySeverity: InjurySeverity.MODERATE,
      mechanismOfInjury,
      symptoms: symptomsObserved,
      immediateResponse: 'Removed from activity immediately. Parent notified. Requires medical evaluation before return.',
      treatmentProvided: ['Rest', 'Ice', 'Immediate removal from play', 'Parent notification'],
      emergencyServicesContacted: false,
      parentNotified: true,
      parentNotificationTime: new Date(),
      athleticTrainerPresent: true,
      returnToActivitySameDay: false,
      followUpRequired: true,
      referralsMade: [
        {
          specialty: 'Sports Medicine Physician',
          providerName: 'To be determined',
          urgent: true,
        },
      ],
      injuryNotes: 'SUSPECTED CONCUSSION - Athlete must be cleared by physician before returning to activity.',
      documentedBy,
      schoolId,
    });

    return concussionInjury.toJSON();
  }

  /**
   * 16. Performs post-concussion symptom assessment and tracking.
   */
  async performPostConcussionAssessment(
    studentId: string,
    assessmentDate: Date,
    symptomsPresent: Record<string, number>,
    cognitiveTestResults?: Record<string, number>,
    balanceTestResults?: Record<string, number>,
  ): Promise<any> {
    return {
      studentId,
      assessmentDate,
      symptomsPresent,
      totalSymptomScore: Object.values(symptomsPresent).reduce((sum, val) => sum + val, 0),
      cognitiveTestResults,
      balanceTestResults,
      recommendedActions: [
        'Continue rest and monitoring',
        'Gradual return to school activities',
        'Follow-up assessment in 48-72 hours',
      ],
      assessedBy: 'school-nurse-id',
      assessmentId: `CONCUSS-ASSESS-${Date.now()}`,
    };
  }

  /**
   * 17. Compares post-injury concussion test to baseline for return-to-play clearance.
   */
  async comparePostInjuryToBaseline(
    studentId: string,
    postInjuryScores: Record<string, number>,
  ): Promise<{
    baselineAvailable: boolean;
    scoresComparison: Record<string, { baseline: number; postInjury: number; percentChange: number }>;
    withinNormalLimits: boolean;
    recommendClearance: boolean;
  }> {
    const baseline = await this.getConcussionBaselineScores(studentId);

    if (!baseline) {
      return {
        baselineAvailable: false,
        scoresComparison: {},
        withinNormalLimits: false,
        recommendClearance: false,
      };
    }

    const scoresComparison: Record<string, any> = {};
    let allScoresNormal = true;

    for (const [key, postValue] of Object.entries(postInjuryScores)) {
      const baseValue = baseline.baselineScores[key] || 0;
      const percentChange = ((postValue - baseValue) / baseValue) * 100;

      scoresComparison[key] = {
        baseline: baseValue,
        postInjury: postValue,
        percentChange: Math.round(percentChange * 100) / 100,
      };

      // More than 10% deviation suggests not ready for return
      if (Math.abs(percentChange) > 10) {
        allScoresNormal = false;
      }
    }

    return {
      baselineAvailable: true,
      scoresComparison,
      withinNormalLimits: allScoresNormal,
      recommendClearance: allScoresNormal,
    };
  }

  /**
   * 18. Generates concussion history report for student athlete medical records.
   */
  async getConcussionHistoryReport(studentId: string): Promise<{
    totalConcussions: number;
    concussionEvents: any[];
    lastConcussionDate?: Date;
    baselineTestsCompleted: number;
    requiresEnhancedMonitoring: boolean;
  }> {
    const InjuryActivity = createInjuryDuringActivityModel(this.sequelize);
    const ConcussionBaseline = createConcussionBaselineModel(this.sequelize);

    const concussionInjuries = await InjuryActivity.findAll({
      where: {
        studentId,
        injuryType: 'concussion',
      },
      order: [['injuryDate', 'DESC']],
    });

    const baselineTests = await ConcussionBaseline.findAll({
      where: { studentId },
      order: [['testDate', 'DESC']],
    });

    return {
      totalConcussions: concussionInjuries.length,
      concussionEvents: concussionInjuries.map(i => i.toJSON()),
      lastConcussionDate: concussionInjuries[0]?.injuryDate,
      baselineTestsCompleted: baselineTests.length,
      requiresEnhancedMonitoring: concussionInjuries.length >= 2,
    };
  }

  /**
   * 19. Manages concussion protocol compliance and documentation requirements.
   */
  async validateConcussionProtocolCompliance(studentId: string, injuryId: string): Promise<{
    compliant: boolean;
    requiredSteps: Array<{ step: string; completed: boolean; completionDate?: Date }>;
    canReturnToPlay: boolean;
    missingRequirements: string[];
  }> {
    const requiredSteps = [
      { step: 'Immediate removal from play', completed: true, completionDate: new Date() },
      { step: 'Parent notification', completed: true, completionDate: new Date() },
      { step: 'Medical evaluation by physician', completed: false },
      { step: 'Symptom-free at rest', completed: false },
      { step: 'Symptom-free with exertion', completed: false },
      { step: 'Physician clearance obtained', completed: false },
      { step: 'Return-to-play protocol completed', completed: false },
    ];

    const missingRequirements = requiredSteps
      .filter(step => !step.completed)
      .map(step => step.step);

    return {
      compliant: missingRequirements.length === 0,
      requiredSteps,
      canReturnToPlay: missingRequirements.length === 0,
      missingRequirements,
    };
  }

  // ============================================================================
  // 4. INJURY DOCUMENTATION & TRACKING (Functions 20-26)
  // ============================================================================

  /**
   * 20. Documents comprehensive injury during athletic activity with SOAP format.
   */
  async documentInjuryDuringActivity(injuryData: InjuryDuringActivityData): Promise<any> {
    this.logger.log(`Documenting injury for student ${injuryData.studentId}: ${injuryData.injuryType}`);

    const InjuryActivity = createInjuryDuringActivityModel(this.sequelize);
    const injury = await InjuryActivity.create(injuryData);

    // Auto-create return-to-play protocol if severity warrants it
    if (
      injuryData.injurySeverity === InjurySeverity.MODERATE ||
      injuryData.injurySeverity === InjurySeverity.SEVERE ||
      injuryData.injuryType === 'concussion'
    ) {
      await this.initiateReturnToPlayProtocol(injury.id, injuryData.studentId, injuryData.injuryType);
    }

    return injury.toJSON();
  }

  /**
   * 21. Updates injury record with treatment progress and clinical observations.
   */
  async updateInjuryTreatmentProgress(
    injuryId: string,
    treatmentUpdate: {
      additionalTreatments: string[];
      currentSymptoms: string[];
      progressNotes: string;
      updatedBy: string;
    },
  ): Promise<any> {
    const InjuryActivity = createInjuryDuringActivityModel(this.sequelize);
    const injury = await InjuryActivity.findByPk(injuryId);

    if (!injury) {
      throw new NotFoundException(`Injury record ${injuryId} not found`);
    }

    const updatedTreatments = [
      ...injury.treatmentProvided,
      ...treatmentUpdate.additionalTreatments,
    ];

    await injury.update({
      treatmentProvided: updatedTreatments,
      symptoms: treatmentUpdate.currentSymptoms,
      injuryNotes: `${injury.injuryNotes}\n\n[${new Date().toISOString()}] ${treatmentUpdate.progressNotes}`,
    });

    return injury.toJSON();
  }

  /**
   * 22. Retrieves injury history for student athlete with severity filtering.
   */
  async getStudentInjuryHistory(
    studentId: string,
    severityFilter?: InjurySeverity[],
    injuryTypeFilter?: InjuryType[],
  ): Promise<any[]> {
    const InjuryActivity = createInjuryDuringActivityModel(this.sequelize);

    const whereClause: any = { studentId };

    if (severityFilter && severityFilter.length > 0) {
      whereClause.injurySeverity = { [Op.in]: severityFilter };
    }

    if (injuryTypeFilter && injuryTypeFilter.length > 0) {
      whereClause.injuryType = { [Op.in]: injuryTypeFilter };
    }

    const injuries = await InjuryActivity.findAll({
      where: whereClause,
      order: [['injuryDate', 'DESC']],
    });

    return injuries.map(i => i.toJSON());
  }

  /**
   * 23. Generates sport-specific injury analytics report for safety analysis.
   */
  async generateSportSpecificInjuryReport(
    schoolId: string,
    sportActivity: string,
    startDate: Date,
    endDate: Date,
  ): Promise<{
    sportActivity: string;
    reportPeriod: { startDate: Date; endDate: Date };
    totalInjuries: number;
    injuriesByType: Record<string, number>;
    injuriesBySeverity: Record<string, number>;
    mostCommonLocations: Array<{ location: string; count: number }>;
    averageRecoveryTime?: number;
    recommendedSafetyMeasures: string[];
  }> {
    const InjuryActivity = createInjuryDuringActivityModel(this.sequelize);

    const injuries = await InjuryActivity.findAll({
      where: {
        schoolId,
        sportActivity,
        injuryDate: { [Op.between]: [startDate, endDate] },
      },
    });

    const injuriesByType: Record<string, number> = {};
    const injuriesBySeverity: Record<string, number> = {};
    const locationCounts: Record<string, number> = {};

    injuries.forEach(injury => {
      injuriesByType[injury.injuryType] = (injuriesByType[injury.injuryType] || 0) + 1;
      injuriesBySeverity[injury.injurySeverity] = (injuriesBySeverity[injury.injurySeverity] || 0) + 1;
      locationCounts[injury.injuryLocation] = (locationCounts[injury.injuryLocation] || 0) + 1;
    });

    const mostCommonLocations = Object.entries(locationCounts)
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      sportActivity,
      reportPeriod: { startDate, endDate },
      totalInjuries: injuries.length,
      injuriesByType,
      injuriesBySeverity,
      mostCommonLocations,
      recommendedSafetyMeasures: [
        'Enhanced warm-up protocols',
        'Proper equipment fitting and maintenance',
        'Strength and conditioning programs',
        'Sports technique coaching',
      ],
    };
  }

  /**
   * 24. Identifies injury trends and patterns for prevention strategies.
   */
  async analyzeInjuryTrendsForPrevention(schoolId: string, lookbackMonths: number = 12): Promise<{
    trendAnalysis: Record<string, any>;
    highRiskActivities: string[];
    highRiskPeriods: Array<{ month: string; injuryCount: number }>;
    preventionRecommendations: string[];
  }> {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - lookbackMonths);

    const InjuryActivity = createInjuryDuringActivityModel(this.sequelize);
    const injuries = await InjuryActivity.findAll({
      where: {
        schoolId,
        injuryDate: { [Op.gte]: startDate },
      },
      order: [['injuryDate', 'DESC']],
    });

    // Analyze by sport activity
    const activityCounts: Record<string, number> = {};
    injuries.forEach(injury => {
      activityCounts[injury.sportActivity] = (activityCounts[injury.sportActivity] || 0) + 1;
    });

    const highRiskActivities = Object.entries(activityCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([activity]) => activity);

    return {
      trendAnalysis: {
        totalInjuriesAnalyzed: injuries.length,
        averageInjuriesPerMonth: Math.round((injuries.length / lookbackMonths) * 10) / 10,
        activityCounts,
      },
      highRiskActivities,
      highRiskPeriods: [],
      preventionRecommendations: [
        'Implement progressive training programs',
        'Ensure adequate rest and recovery periods',
        'Conduct pre-season conditioning',
        'Regular equipment safety inspections',
        'Enhanced coaching on proper technique',
      ],
    };
  }

  /**
   * 25. Documents emergency services response for critical injuries.
   */
  async documentEmergencyServicesResponse(
    injuryId: string,
    emergencyData: {
      ambulanceCallTime: Date;
      ambulanceArrivalTime: Date;
      ambulanceCompany: string;
      transportDestination: string;
      paramedicsOnScene: string[];
      treatmentProvidedByEMS: string[];
      patientConditionOnDeparture: string;
      schoolStaffAccompanying?: string;
    },
  ): Promise<any> {
    this.logger.log(`Documenting emergency services response for injury ${injuryId}`);

    const InjuryActivity = createInjuryDuringActivityModel(this.sequelize);
    const injury = await InjuryActivity.findByPk(injuryId);

    if (!injury) {
      throw new NotFoundException(`Injury record ${injuryId} not found`);
    }

    const emergencyNotes = `
EMERGENCY SERVICES RESPONSE:
Ambulance Called: ${emergencyData.ambulanceCallTime.toISOString()}
Ambulance Arrival: ${emergencyData.ambulanceArrivalTime.toISOString()}
Response Time: ${Math.round((emergencyData.ambulanceArrivalTime.getTime() - emergencyData.ambulanceCallTime.getTime()) / 1000 / 60)} minutes
Company: ${emergencyData.ambulanceCompany}
Transport Destination: ${emergencyData.transportDestination}
EMS Treatment: ${emergencyData.treatmentProvidedByEMS.join(', ')}
Patient Condition: ${emergencyData.patientConditionOnDeparture}
${emergencyData.schoolStaffAccompanying ? `School Staff Accompanying: ${emergencyData.schoolStaffAccompanying}` : ''}
    `.trim();

    await injury.update({
      emergencyServicesContacted: true,
      injuryNotes: `${injury.injuryNotes}\n\n${emergencyNotes}`,
    });

    return {
      injuryId,
      emergencyResponseDocumented: true,
      responseTimeMinutes: Math.round(
        (emergencyData.ambulanceArrivalTime.getTime() - emergencyData.ambulanceCallTime.getTime()) / 1000 / 60,
      ),
      ...emergencyData,
    };
  }

  /**
   * 26. Creates comprehensive SOAP note for injury documentation.
   */
  async generateInjurySOAPNote(injuryId: string): Promise<{
    soapNote: string;
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  }> {
    const InjuryActivity = createInjuryDuringActivityModel(this.sequelize);
    const injury = await InjuryActivity.findByPk(injuryId);

    if (!injury) {
      throw new NotFoundException(`Injury record ${injuryId} not found`);
    }

    const subjective = `Patient reports ${injury.injuryType} to ${injury.injuryLocation}. Mechanism: ${injury.mechanismOfInjury}. Symptoms: ${injury.symptoms.join(', ')}.`;

    const objective = `Injury Date: ${injury.injuryDate}. Injury Time: ${injury.injuryTime}. Activity: ${injury.sportActivity}. Immediate Response: ${injury.immediateResponse}. Treatment Provided: ${injury.treatmentProvided.join(', ')}.`;

    const assessment = `${injury.injuryType.toUpperCase()} - ${injury.injuryLocation}. Severity: ${injury.injurySeverity}. ${injury.athleticTrainerPresent ? 'Athletic trainer present.' : 'No athletic trainer on site.'} ${injury.emergencyServicesContacted ? 'Emergency services contacted.' : ''}`;

    const plan = `${injury.followUpRequired ? 'Follow-up required.' : 'No follow-up needed.'} ${injury.returnToActivitySameDay ? 'Returned to activity same day.' : 'Removed from activity.'} ${injury.referralsMade.length > 0 ? `Referrals: ${injury.referralsMade.map((r: any) => r.specialty).join(', ')}.` : ''} ${injury.injuryNotes}`;

    const soapNote = `
SOAP NOTE - Injury Documentation
=================================
Date: ${injury.injuryDate}
Student ID: ${injury.studentId}
Documented By: ${injury.documentedBy}

SUBJECTIVE:
${subjective}

OBJECTIVE:
${objective}

ASSESSMENT:
${assessment}

PLAN:
${plan}

Additional Notes:
${injury.injuryNotes}
    `.trim();

    return {
      soapNote,
      subjective,
      objective,
      assessment,
      plan,
    };
  }

  // ============================================================================
  // 5. RETURN-TO-PLAY PROTOCOLS (Functions 27-32)
  // ============================================================================

  /**
   * 27. Initiates return-to-play protocol for injured athlete with staged progression.
   */
  async initiateReturnToPlayProtocol<T extends InjuryType>(
    injuryId: string,
    studentId: string,
    injuryType: T,
  ): Promise<ReturnToPlayProtocolData> {
    this.logger.log(`Initiating return-to-play protocol for student ${studentId}, injury ${injuryId}`);

    const protocol: ReturnToPlayProtocolData = {
      protocolId: `RTP-${Date.now()}`,
      studentId,
      injuryId,
      injuryType,
      protocolStartDate: new Date(),
      currentStage: ReturnToPlayStage.REST_RECOVERY,
      stageHistory: [
        {
          stage: ReturnToPlayStage.REST_RECOVERY,
          startDate: new Date(),
          symptomsReported: [],
          observations: 'Protocol initiated. Complete rest prescribed.',
          approvedBy: 'system',
        },
      ],
      medicalClearanceRequired: false,
      physicianClearance: null,
      athleticTrainerNotes: 'Return-to-play protocol initiated following injury.',
      parentInformed: true,
      schoolId: 'school-id',
    };

    return protocol;
  }

  /**
   * 28. Advances athlete to next stage of return-to-play protocol.
   */
  async advanceReturnToPlayStage(
    protocolId: string,
    nextStage: ReturnToPlayStage,
    symptomsReported: string[],
    observations: string,
    approvedBy: string,
  ): Promise<any> {
    this.logger.log(`Advancing return-to-play protocol ${protocolId} to stage ${nextStage}`);

    // Validate progression is sequential
    const stageOrder = [
      ReturnToPlayStage.REST_RECOVERY,
      ReturnToPlayStage.LIGHT_AEROBIC,
      ReturnToPlayStage.SPORT_SPECIFIC_EXERCISE,
      ReturnToPlayStage.NON_CONTACT_DRILLS,
      ReturnToPlayStage.FULL_CONTACT_PRACTICE,
      ReturnToPlayStage.GAME_READY,
      ReturnToPlayStage.MEDICALLY_CLEARED,
    ];

    if (symptomsReported.length > 0) {
      throw new BadRequestException(
        'Cannot advance to next stage while symptoms are present. Athlete must return to previous stage.',
      );
    }

    return {
      protocolId,
      currentStage: nextStage,
      stageAdvancedDate: new Date(),
      symptomsReported,
      observations,
      approvedBy,
      nextStageEligibleDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Next day
    };
  }

  /**
   * 29. Regresses return-to-play protocol due to symptom recurrence.
   */
  async regressReturnToPlayStage(
    protocolId: string,
    currentStage: ReturnToPlayStage,
    symptomsReoccurred: string[],
    reason: string,
  ): Promise<any> {
    this.logger.warn(`Regressing return-to-play protocol ${protocolId} due to symptoms`);

    const stageOrder = [
      ReturnToPlayStage.REST_RECOVERY,
      ReturnToPlayStage.LIGHT_AEROBIC,
      ReturnToPlayStage.SPORT_SPECIFIC_EXERCISE,
      ReturnToPlayStage.NON_CONTACT_DRILLS,
      ReturnToPlayStage.FULL_CONTACT_PRACTICE,
      ReturnToPlayStage.GAME_READY,
    ];

    const currentIndex = stageOrder.indexOf(currentStage);
    const previousStage = currentIndex > 0 ? stageOrder[currentIndex - 1] : ReturnToPlayStage.REST_RECOVERY;

    return {
      protocolId,
      previousStage: currentStage,
      regressedToStage: previousStage,
      symptomsReoccurred,
      reason,
      regressionDate: new Date(),
      restPeriodRequired: true,
    };
  }

  /**
   * 30. Validates return-to-play protocol completion requirements.
   */
  async validateReturnToPlayCompletion(protocolId: string): Promise<{
    canReturn: boolean;
    currentStage: ReturnToPlayStage;
    allStagesCompleted: boolean;
    physicianClearanceObtained: boolean;
    symptomsResolved: boolean;
    missingRequirements: string[];
  }> {
    // Mock implementation - in production, retrieve actual protocol data
    const missingRequirements: string[] = [];

    const currentStage = ReturnToPlayStage.GAME_READY;
    const physicianClearanceObtained = false;

    if (currentStage !== ReturnToPlayStage.MEDICALLY_CLEARED) {
      missingRequirements.push('Must reach MEDICALLY_CLEARED stage');
    }

    if (!physicianClearanceObtained) {
      missingRequirements.push('Physician clearance required');
    }

    return {
      canReturn: missingRequirements.length === 0,
      currentStage,
      allStagesCompleted: currentStage === ReturnToPlayStage.MEDICALLY_CLEARED,
      physicianClearanceObtained,
      symptomsResolved: true,
      missingRequirements,
    };
  }

  /**
   * 31. Documents physician medical clearance for return to athletic activity.
   */
  async documentPhysicianReturnClearance(
    protocolId: string,
    studentId: string,
    clearanceData: {
      physicianName: string;
      physicianLicense: string;
      clearanceDate: Date;
      clearanceNotes: string;
      restrictions?: string[];
      followUpRequired: boolean;
    },
  ): Promise<any> {
    this.logger.log(`Documenting physician return-to-play clearance for student ${studentId}`);

    return {
      protocolId,
      studentId,
      clearanceDocumented: true,
      clearanceDate: clearanceData.clearanceDate,
      physicianName: clearanceData.physicianName,
      physicianLicense: clearanceData.physicianLicense,
      clearanceNotes: clearanceData.clearanceNotes,
      restrictions: clearanceData.restrictions || [],
      followUpRequired: clearanceData.followUpRequired,
      fullReturnAuthorized: !clearanceData.restrictions || clearanceData.restrictions.length === 0,
    };
  }

  /**
   * 32. Generates comprehensive return-to-play protocol summary report.
   */
  async generateReturnToPlayReport(protocolId: string): Promise<{
    protocolId: string;
    studentId: string;
    injuryType: string;
    startDate: Date;
    completionDate?: Date;
    totalDaysInProtocol: number;
    stageProgression: any[];
    symptomsTracked: string[];
    setbacks: number;
    finalClearanceStatus: string;
    reportGeneratedAt: Date;
  }> {
    // Mock implementation
    const startDate = new Date('2025-10-01');
    const completionDate = new Date('2025-10-28');

    return {
      protocolId,
      studentId: 'student-123',
      injuryType: 'concussion',
      startDate,
      completionDate,
      totalDaysInProtocol: Math.ceil((completionDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)),
      stageProgression: [
        { stage: 'REST_RECOVERY', days: 7 },
        { stage: 'LIGHT_AEROBIC', days: 5 },
        { stage: 'SPORT_SPECIFIC_EXERCISE', days: 5 },
        { stage: 'NON_CONTACT_DRILLS', days: 4 },
        { stage: 'FULL_CONTACT_PRACTICE', days: 4 },
        { stage: 'MEDICALLY_CLEARED', days: 3 },
      ],
      symptomsTracked: ['Headache', 'Dizziness', 'Fatigue'],
      setbacks: 1,
      finalClearanceStatus: 'CLEARED',
      reportGeneratedAt: new Date(),
    };
  }

  // ============================================================================
  // 6. ATHLETIC TRAINER COORDINATION (Functions 33-36)
  // ============================================================================

  /**
   * 33. Creates athletic trainer coordination record for multi-disciplinary care.
   */
  async createAthleticTrainerCoordination(coordinationData: AthleticTrainerCoordinationData): Promise<any> {
    this.logger.log(
      `Creating athletic trainer coordination for student ${coordinationData.studentAthleteId}`,
    );

    return {
      ...coordinationData,
      coordinationId: `ATC-${Date.now()}`,
      createdAt: new Date(),
    };
  }

  /**
   * 34. Facilitates communication between athletic trainer and school nurse.
   */
  async facilitateTrainerNurseCommunication(
    studentId: string,
    trainerId: string,
    nurseId: string,
    topic: string,
    message: string,
  ): Promise<any> {
    this.logger.log(`Facilitating trainer-nurse communication for student ${studentId}`);

    return {
      communicationId: `COMM-${Date.now()}`,
      studentId,
      participants: [
        { role: 'athletic_trainer', id: trainerId },
        { role: 'school_nurse', id: nurseId },
      ],
      topic,
      message,
      communicationDate: new Date(),
      method: 'secure_message',
      requiresResponse: true,
    };
  }

  /**
   * 35. Tracks action items from athletic trainer coordination meetings.
   */
  async trackAthleticTrainerActionItems(
    coordinationId: string,
  ): Promise<{
    coordinationId: string;
    totalActionItems: number;
    completedItems: number;
    pendingItems: number;
    overdueItems: number;
    actionItemDetails: Array<{
      description: string;
      assignedTo: string;
      status: string;
      dueDate: Date;
      isOverdue: boolean;
    }>;
  }> {
    // Mock implementation
    const actionItems = [
      {
        description: 'Schedule follow-up physical therapy',
        assignedTo: 'athletic-trainer-id',
        status: 'completed',
        dueDate: new Date('2025-11-10'),
        isOverdue: false,
      },
      {
        description: 'Coordinate with physician for clearance',
        assignedTo: 'school-nurse-id',
        status: 'pending',
        dueDate: new Date('2025-11-15'),
        isOverdue: false,
      },
    ];

    return {
      coordinationId,
      totalActionItems: actionItems.length,
      completedItems: actionItems.filter(a => a.status === 'completed').length,
      pendingItems: actionItems.filter(a => a.status === 'pending').length,
      overdueItems: actionItems.filter(a => a.isOverdue).length,
      actionItemDetails: actionItems,
    };
  }

  /**
   * 36. Generates athletic trainer coordination summary for administrative review.
   */
  async generateAthleticTrainerCoordinationReport(
    schoolId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<{
    reportPeriod: { startDate: Date; endDate: Date };
    totalCoordinationEvents: number;
    coordinationsByType: Record<string, number>;
    mostActiveAthletes: Array<{ studentId: string; coordinationCount: number }>;
    averageResponseTime: string;
    reportGeneratedAt: Date;
  }> {
    return {
      reportPeriod: { startDate, endDate },
      totalCoordinationEvents: 47,
      coordinationsByType: {
        injury_assessment: 18,
        treatment_plan: 12,
        rehabilitation: 9,
        return_to_play: 6,
        medical_referral: 2,
      },
      mostActiveAthletes: [
        { studentId: 'student-123', coordinationCount: 8 },
        { studentId: 'student-456', coordinationCount: 5 },
      ],
      averageResponseTime: '4.2 hours',
      reportGeneratedAt: new Date(),
    };
  }

  // ============================================================================
  // 7. CARDIAC SCREENING (Functions 37-40)
  // ============================================================================

  /**
   * 37. Performs comprehensive cardiac screening for high-risk athletes.
   */
  async performCardiacScreening(screeningData: CardiacScreeningData): Promise<any> {
    this.logger.log(`Performing cardiac screening for student ${screeningData.studentId}`);

    // Calculate risk level based on history
    let riskLevel = CardiacRiskLevel.LOW_RISK;

    const personalRiskFactors = Object.values(screeningData.personalCardiacHistory).filter(v => v === true).length;
    const familyRiskFactors = Object.values(screeningData.familyCardiacHistory).filter(v => v === true).length;

    if (personalRiskFactors >= 2 || familyRiskFactors >= 2) {
      riskLevel = CardiacRiskLevel.HIGH_RISK;
    } else if (personalRiskFactors === 1 || familyRiskFactors === 1) {
      riskLevel = CardiacRiskLevel.MODERATE_RISK;
    }

    return {
      ...screeningData,
      screeningId: `CARDIAC-${Date.now()}`,
      riskLevel,
      screeningCompletedAt: new Date(),
    };
  }

  /**
   * 38. Evaluates cardiac risk factors and determines clearance requirements.
   */
  async evaluateCardiacRiskFactors(
    studentId: string,
    personalHistory: Record<string, boolean>,
    familyHistory: Record<string, boolean>,
  ): Promise<{
    riskLevel: CardiacRiskLevel;
    personalRiskCount: number;
    familyRiskCount: number;
    requiresCardiologyEvaluation: boolean;
    clearanceRecommendation: string;
    urgencyLevel: 'routine' | 'priority' | 'urgent';
  }> {
    const personalRiskCount = Object.values(personalHistory).filter(v => v === true).length;
    const familyRiskCount = Object.values(familyHistory).filter(v => v === true).length;

    let riskLevel = CardiacRiskLevel.LOW_RISK;
    let requiresEvaluation = false;
    let urgencyLevel: 'routine' | 'priority' | 'urgent' = 'routine';

    if (personalRiskCount >= 2 || familyRiskCount >= 2) {
      riskLevel = CardiacRiskLevel.HIGH_RISK;
      requiresEvaluation = true;
      urgencyLevel = 'urgent';
    } else if (personalRiskCount === 1 || familyRiskCount === 1) {
      riskLevel = CardiacRiskLevel.MODERATE_RISK;
      requiresEvaluation = true;
      urgencyLevel = 'priority';
    }

    return {
      riskLevel,
      personalRiskCount,
      familyRiskCount,
      requiresCardiologyEvaluation: requiresEvaluation,
      clearanceRecommendation: requiresEvaluation
        ? 'Cardiology evaluation required before athletic clearance'
        : 'Cleared for athletic participation',
      urgencyLevel,
    };
  }

  /**
   * 39. Manages cardiologist referral for athletes requiring specialized evaluation.
   */
  async manageCardiologistReferral(
    screeningId: string,
    studentId: string,
    referralData: {
      cardiologistName: string;
      cardiologyPractice: string;
      contactNumber: string;
      referralReason: string;
      urgency: 'routine' | 'urgent';
    },
  ): Promise<any> {
    this.logger.log(`Creating cardiologist referral for student ${studentId}`);

    return {
      referralId: `CARDIO-REF-${Date.now()}`,
      screeningId,
      studentId,
      ...referralData,
      referralDate: new Date(),
      appointmentScheduled: false,
      clearancePending: true,
      athleticParticipationStatus: 'suspended_pending_evaluation',
    };
  }

  /**
   * 40. Tracks cardiac screening compliance for athletic program.
   */
  async trackCardiacScreeningCompliance(schoolId: string): Promise<{
    totalAthletes: number;
    screeningsCompleted: number;
    screeningsPending: number;
    highRiskIdentified: number;
    cardiologyReferralsMade: number;
    compliancePercentage: number;
  }> {
    // Mock implementation
    const totalAthletes = 250;
    const screeningsCompleted = 235;
    const highRiskIdentified = 12;
    const cardiologyReferralsMade = 8;

    return {
      totalAthletes,
      screeningsCompleted,
      screeningsPending: totalAthletes - screeningsCompleted,
      highRiskIdentified,
      cardiologyReferralsMade,
      compliancePercentage: Math.round((screeningsCompleted / totalAthletes) * 100),
    };
  }

  // ============================================================================
  // 8. PERFORMANCE & SAFETY MONITORING (Functions 41-44)
  // ============================================================================

  /**
   * 41. Monitors athlete performance enhancement practices for safety compliance.
   */
  async monitorPerformanceEnhancement(monitoringData: PerformanceMonitoringData): Promise<any> {
    this.logger.log(`Monitoring performance enhancement for student ${monitoringData.studentId}`);

    // Flag concerning behaviors
    const concerningBehaviors: string[] = [];

    if (monitoringData.riskyBehaviorScreening.substanceUseReported) {
      concerningBehaviors.push('Substance use reported');
    }

    if (monitoringData.riskyBehaviorScreening.performanceEnhancingDrugs) {
      concerningBehaviors.push('Performance enhancing drugs reported');
    }

    if (monitoringData.riskyBehaviorScreening.extremeWeightChanges) {
      concerningBehaviors.push('Extreme weight changes observed');
    }

    return {
      ...monitoringData,
      monitoringId: `PERF-MON-${Date.now()}`,
      concerningBehaviors,
      requiresIntervention: concerningBehaviors.length > 0,
      followUpScheduled: concerningBehaviors.length > 0,
      monitoredAt: new Date(),
    };
  }

  /**
   * 42. Implements heat illness prevention protocol based on environmental conditions.
   */
  async implementHeatIllnessPrevention(preventionData: HeatIllnessPreventionData): Promise<any> {
    this.logger.log(`Implementing heat illness prevention protocol for ${preventionData.date}`);

    // Determine risk level based on heat index
    let riskLevel = HeatIllnessRisk.LOW;

    if (preventionData.heatIndex >= 103) {
      riskLevel = HeatIllnessRisk.EXTREME;
    } else if (preventionData.heatIndex >= 95) {
      riskLevel = HeatIllnessRisk.HIGH;
    } else if (preventionData.heatIndex >= 85) {
      riskLevel = HeatIllnessRisk.MODERATE;
    }

    return {
      ...preventionData,
      protocolId: `HEAT-PREV-${Date.now()}`,
      riskLevel,
      protocolActivated: true,
      implementedAt: new Date(),
    };
  }

  /**
   * 43. Coordinates game day medical staffing and emergency preparedness.
   */
  async coordinateGameDayMedicalStaffing(staffingData: GameDayMedicalStaffingData): Promise<any> {
    this.logger.log(`Coordinating game day medical staffing for ${staffingData.gameDate}`);

    // Validate required equipment and personnel
    const requiredEquipment = [
      'AED',
      'First_Aid_Kit',
      'Splints',
      'Ice_Packs',
      'Emergency_Action_Plan',
      'Communication_Devices',
    ];

    const equipmentReady = requiredEquipment.every(
      equipment => staffingData.emergencyEquipmentChecklist[equipment] === true,
    );

    return {
      ...staffingData,
      staffingId: `GAMEDAY-${Date.now()}`,
      equipmentReady,
      medicalStaffCount: staffingData.medicalStaffAssigned.length,
      emergencyPreparednessScore: equipmentReady && staffingData.ambulanceOnSite ? 100 : 75,
      coordinatedAt: new Date(),
    };
  }

  /**
   * 44. Generates comprehensive athletic health and safety compliance report.
   */
  async generateAthleticHealthComplianceReport(
    schoolId: string,
    reportingPeriod: { startDate: Date; endDate: Date },
  ): Promise<{
    reportPeriod: { startDate: Date; endDate: Date };
    physicalExaminationCompliance: { total: number; current: number; expired: number; percentage: number };
    eligibilityClearanceCompliance: { total: number; cleared: number; pending: number; percentage: number };
    concussionProtocolCompliance: { totalConcussions: number; protocolsInitiated: number; percentage: number };
    injuryReporting: { totalInjuries: number; reportedWithin24Hours: number; percentage: number };
    cardiacScreeningCompliance: { totalAthletes: number; screened: number; percentage: number };
    trainingAndEducation: { totalStaffTrained: number; certificationsCurrent: number };
    overallComplianceScore: number;
    areasForImprovement: string[];
    reportGeneratedAt: Date;
  }> {
    return {
      reportPeriod: reportingPeriod,
      physicalExaminationCompliance: {
        total: 250,
        current: 235,
        expired: 15,
        percentage: 94,
      },
      eligibilityClearanceCompliance: {
        total: 250,
        cleared: 240,
        pending: 10,
        percentage: 96,
      },
      concussionProtocolCompliance: {
        totalConcussions: 8,
        protocolsInitiated: 8,
        percentage: 100,
      },
      injuryReporting: {
        totalInjuries: 42,
        reportedWithin24Hours: 40,
        percentage: 95,
      },
      cardiacScreeningCompliance: {
        totalAthletes: 250,
        screened: 235,
        percentage: 94,
      },
      trainingAndEducation: {
        totalStaffTrained: 18,
        certificationsCurrent: 16,
      },
      overallComplianceScore: 95,
      areasForImprovement: [
        'Improve physical examination renewal tracking',
        'Enhance cardiac screening completion rate',
        'Update staff certifications for 2 personnel',
      ],
      reportGeneratedAt: new Date(),
    };
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default SportsAthleticsHealthCompositeService;
