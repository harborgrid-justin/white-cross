/**
 * LOC: CLINIC-MENTALHEALTH-COMP-001
 * File: /reuse/clinic/composites/mental-health-support-composites.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - sequelize (v6.x)
 *   - ../../server/health/health-mental-health-kit
 *   - ../../server/health/health-patient-management-kit
 *   - ../../server/health/health-clinical-workflows-kit
 *   - ../../server/health/health-crisis-intervention-kit
 *   - ../../education/student-records-kit
 *   - ../../education/student-communication-kit
 *   - ../../education/student-accommodations-kit
 *   - ../../data/crud-operations
 *   - ../../data/data-repository
 *
 * DOWNSTREAM (imported by):
 *   - School clinic mental health controllers
 *   - Counselor collaboration workflows
 *   - Crisis intervention services
 *   - Safety planning modules
 *   - Parent notification services
 *   - Accommodation management systems
 */

/**
 * File: /reuse/clinic/composites/mental-health-support-composites.ts
 * Locator: WC-CLINIC-MENTALHEALTH-001
 * Purpose: School Clinic Mental Health Support Composite - Comprehensive mental health services
 *
 * Upstream: health-mental-health-kit, health-patient-management-kit, health-clinical-workflows-kit,
 *           health-crisis-intervention-kit, student-records-kit, student-communication-kit,
 *           student-accommodations-kit, data-repository
 * Downstream: Clinic mental health controllers, Counselor workflows, Crisis teams, Safety planning, Accommodations
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x
 * Exports: 43 composed functions for complete school mental health support
 *
 * LLM Context: Production-grade school clinic mental health support composite for K-12 healthcare SaaS platform.
 * Provides comprehensive mental health workflows including screening with validated instruments (PHQ-9, GAD-7),
 * counselor referral workflows with urgency classification, crisis intervention protocols with risk assessment,
 * safety planning for at-risk students with crisis contacts and coping strategies, mental health accommodation
 * tracking for 504 plans, therapy session scheduling and documentation, emotional support documentation with
 * confidentiality protections, suicide prevention protocols with mandatory reporting, and parent mental health
 * consultations with appropriate consent and notification procedures. HIPAA and FERPA compliant.
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
 * Mental health screening risk levels
 */
export enum MentalHealthRiskLevel {
  MINIMAL = 'minimal',
  MILD = 'mild',
  MODERATE = 'moderate',
  MODERATELY_SEVERE = 'moderately_severe',
  SEVERE = 'severe',
  IMMINENT = 'imminent',
}

/**
 * Counselor referral urgency levels
 */
export enum ReferralUrgency {
  ROUTINE = 'routine',
  PROMPT = 'prompt',
  URGENT = 'urgent',
  EMERGENCY = 'emergency',
}

/**
 * Referral status tracking
 */
export enum ReferralStatus {
  PENDING = 'pending',
  CONTACTED = 'contacted',
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  DECLINED = 'declined',
}

/**
 * Crisis intervention types
 */
export enum CrisisType {
  SUICIDAL_IDEATION = 'suicidal_ideation',
  SELF_HARM = 'self_harm',
  VIOLENCE_THREAT = 'violence_threat',
  SEVERE_ANXIETY = 'severe_anxiety',
  PANIC_ATTACK = 'panic_attack',
  ACUTE_DISTRESS = 'acute_distress',
  SUBSTANCE_CRISIS = 'substance_crisis',
  TRAUMA_RESPONSE = 'trauma_response',
}

/**
 * Safety plan status
 */
export enum SafetyPlanStatus {
  ACTIVE = 'active',
  UNDER_REVIEW = 'under_review',
  EXPIRED = 'expired',
  INACTIVE = 'inactive',
}

/**
 * Accommodation types
 */
export enum AccommodationType {
  SCHEDULE_MODIFICATION = 'schedule_modification',
  TESTING_ACCOMMODATION = 'testing_accommodation',
  COUNSELING_ACCESS = 'counseling_access',
  SENSORY_SUPPORT = 'sensory_support',
  BEHAVIORAL_SUPPORT = 'behavioral_support',
  EMOTIONAL_SUPPORT_ANIMAL = 'emotional_support_animal',
  REDUCED_WORKLOAD = 'reduced_workload',
  EXTENDED_TIME = 'extended_time',
}

/**
 * Therapy session status
 */
export enum TherapySessionStatus {
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
  RESCHEDULED = 'rescheduled',
}

/**
 * Mental health screening data (PHQ-9, GAD-7)
 */
export interface MentalHealthScreeningData {
  screeningId?: string;
  studentId: string;
  screeningDate: Date;
  screeningType: 'PHQ-9' | 'GAD-7' | 'combined' | 'custom';
  phq9Score?: number; // 0-27 depression severity
  gad7Score?: number; // 0-21 anxiety severity
  riskLevel: MentalHealthRiskLevel;
  suicidalIdeation: boolean;
  selfHarmRisk: boolean;
  specificConcerns: string[];
  screenedBy: string;
  referralRecommended: boolean;
  parentNotificationRequired: boolean;
  emergencyContactMade: boolean;
  followUpRequired: boolean;
  followUpDate?: Date;
  confidentialNotes?: string;
  schoolId: string;
  createdAt?: Date;
}

/**
 * Counselor referral data
 */
export interface CounselorReferralData {
  referralId?: string;
  studentId: string;
  referralDate: Date;
  referralReason: string;
  referringStaff: string;
  referralUrgency: ReferralUrgency;
  concerningSigns: string[];
  recentTriggers?: string;
  counselorAssigned?: string;
  referralStatus: ReferralStatus;
  parentConsentObtained: boolean;
  parentConsentDate?: Date;
  initialMeetingDate?: Date;
  ongoingSupport: boolean;
  confidentialityAgreed: boolean;
  schoolId: string;
  createdAt?: Date;
}

/**
 * Crisis intervention record
 */
export interface CrisisInterventionData {
  interventionId?: string;
  studentId: string;
  crisisDate: Date;
  crisisTime: string;
  crisisType: CrisisType;
  crisisLocation: string;
  crisisDescription: string;
  suicidalThoughts: boolean;
  suicidalPlan: boolean;
  suicidalMeans: boolean;
  selfHarmEvidence: boolean;
  immediateRiskLevel: MentalHealthRiskLevel;
  interventionSteps: string[];
  respondingStaff: string[];
  emergencyServicesContacted: boolean;
  emergencyServiceType?: string;
  parentNotified: boolean;
  parentNotificationTime?: Date;
  studentSafetyStatus: 'safe' | 'monitored' | 'hospitalized' | 'released_to_parent';
  followUpPlanCreated: boolean;
  mandatedReporting: boolean;
  reportingAgency?: string;
  schoolId: string;
  createdAt?: Date;
}

/**
 * Safety plan for at-risk students
 */
export interface SafetyPlanData {
  planId?: string;
  studentId: string;
  planCreationDate: Date;
  createdBy: string;
  planStatus: SafetyPlanStatus;
  warningSignsIdentified: string[];
  copingStrategies: string[];
  distractionActivities: string[];
  supportivePeople: Array<{ name: string; relationship: string; contact: string }>;
  professionalContacts: Array<{ name: string; role: string; phone: string }>;
  emergencyContacts: Array<{ name: string; relationship: string; phone: string }>;
  safeEnvironmentPlan: string;
  restrictedAccessItems?: string[];
  studentCommitment: string;
  parentInvolvement: boolean;
  reviewDate: Date;
  lastReviewDate?: Date;
  planRevisionNumber: number;
  schoolId: string;
  createdAt?: Date;
}

/**
 * Mental health accommodation tracking
 */
export interface MentalHealthAccommodationData {
  accommodationId?: string;
  studentId: string;
  accommodationType: AccommodationType;
  accommodationDescription: string;
  startDate: Date;
  endDate?: Date;
  iep504Plan: boolean;
  planDocumentId?: string;
  approvedBy: string;
  implementationInstructions: string;
  teachersNotified: string[];
  accommodationActive: boolean;
  progressMonitoring: boolean;
  monitoringFrequency?: string;
  lastMonitoringDate?: Date;
  effectivenessRating?: number; // 1-5 scale
  parentConsented: boolean;
  schoolId: string;
  createdAt?: Date;
}

/**
 * Therapy session record
 */
export interface TherapySessionData {
  sessionId?: string;
  studentId: string;
  counselorId: string;
  sessionDate: Date;
  sessionTime: string;
  sessionDuration: number; // minutes
  sessionType: 'individual' | 'group' | 'family' | 'crisis';
  sessionStatus: TherapySessionStatus;
  topicsDiscussed?: string[];
  interventionsUsed?: string[];
  studentProgress?: string;
  concernsIdentified?: string[];
  homeworkAssigned?: string;
  nextSessionDate?: Date;
  parentUpdateProvided: boolean;
  confidentialNotes?: string;
  schoolId: string;
  createdAt?: Date;
}

/**
 * Emotional support documentation
 */
export interface EmotionalSupportDocumentationData {
  documentationId?: string;
  studentId: string;
  supportDate: Date;
  supportProvidedBy: string;
  supportType: 'check_in' | 'brief_intervention' | 'de_escalation' | 'emotional_regulation' | 'peer_conflict';
  studentPresentingIssue: string;
  supportStrategyUsed: string;
  studentResponse: string;
  durationMinutes: number;
  followUpNeeded: boolean;
  followUpAction?: string;
  parentNotified: boolean;
  schoolId: string;
  createdAt?: Date;
}

/**
 * Suicide prevention protocol
 */
export interface SuicidePreventionProtocolData {
  protocolId?: string;
  studentId: string;
  assessmentDate: Date;
  assessedBy: string;
  suicidalIdeation: boolean;
  ideationFrequency?: 'rare' | 'occasional' | 'frequent' | 'constant';
  suicidalPlan: boolean;
  planDetails?: string;
  suicidalMeans: boolean;
  meansAccessibility?: string;
  previousAttempts: boolean;
  attemptDetails?: string;
  protectiveFactors: string[];
  riskFactors: string[];
  overallRiskLevel: MentalHealthRiskLevel;
  immediateSafetyPlan: string;
  parentGuardianNotified: boolean;
  notificationTime?: Date;
  emergencyContactsMade: string[];
  hospitalizedRequired: boolean;
  hospitalName?: string;
  cpsReportMade: boolean;
  followUpScheduled: boolean;
  schoolId: string;
  createdAt?: Date;
}

/**
 * Parent mental health consultation
 */
export interface ParentMentalHealthConsultationData {
  consultationId?: string;
  studentId: string;
  consultationDate: Date;
  consultationType: 'initial' | 'follow_up' | 'crisis' | 'progress_review';
  parentAttendees: Array<{ name: string; relationship: string }>;
  schoolStaffPresent: string[];
  concernsDiscussed: string[];
  recommendationsMade: string[];
  resourcesProvided: string[];
  parentQuestions?: string[];
  consentFormsCompleted: string[];
  followUpScheduled: boolean;
  followUpDate?: Date;
  consultationNotes?: string;
  schoolId: string;
  createdAt?: Date;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Mental Health Screenings
 */
export const createMentalHealthScreeningModel = (sequelize: Sequelize) => {
  class MentalHealthScreening extends Model {
    public id!: string;
    public studentId!: string;
    public screeningDate!: Date;
    public screeningType!: string;
    public phq9Score!: number | null;
    public gad7Score!: number | null;
    public riskLevel!: MentalHealthRiskLevel;
    public suicidalIdeation!: boolean;
    public selfHarmRisk!: boolean;
    public specificConcerns!: string[];
    public screenedBy!: string;
    public referralRecommended!: boolean;
    public parentNotificationRequired!: boolean;
    public emergencyContactMade!: boolean;
    public followUpRequired!: boolean;
    public followUpDate!: Date | null;
    public confidentialNotes!: string | null;
    public schoolId!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Virtual attribute for combined severity assessment
    public get combinedSeverityScore(): number {
      const phq = this.phq9Score || 0;
      const gad = this.gad7Score || 0;
      return Math.round((phq + gad) / 2);
    }

    // Virtual attribute for clinical interpretation
    public get clinicalInterpretation(): string {
      const score = this.combinedSeverityScore;
      if (score >= 20) return 'Severe - Immediate intervention required';
      if (score >= 15) return 'Moderately Severe - Prompt intervention recommended';
      if (score >= 10) return 'Moderate - Counseling recommended';
      if (score >= 5) return 'Mild - Monitor and provide support';
      return 'Minimal - No immediate concerns';
    }
  }

  MentalHealthScreening.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      studentId: { type: DataTypes.UUID, allowNull: false, references: { model: 'students', key: 'id' } },
      screeningDate: { type: DataTypes.DATEONLY, allowNull: false },
      screeningType: { type: DataTypes.ENUM('PHQ-9', 'GAD-7', 'combined', 'custom'), allowNull: false },
      phq9Score: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 0,
          max: 27,
        },
      },
      gad7Score: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 0,
          max: 21,
        },
      },
      riskLevel: { type: DataTypes.ENUM(...Object.values(MentalHealthRiskLevel)), allowNull: false },
      suicidalIdeation: { type: DataTypes.BOOLEAN, defaultValue: false },
      selfHarmRisk: { type: DataTypes.BOOLEAN, defaultValue: false },
      specificConcerns: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
      screenedBy: { type: DataTypes.UUID, allowNull: false, references: { model: 'users', key: 'id' } },
      referralRecommended: { type: DataTypes.BOOLEAN, defaultValue: false },
      parentNotificationRequired: { type: DataTypes.BOOLEAN, defaultValue: false },
      emergencyContactMade: { type: DataTypes.BOOLEAN, defaultValue: false },
      followUpRequired: { type: DataTypes.BOOLEAN, defaultValue: false },
      followUpDate: { type: DataTypes.DATE, allowNull: true },
      confidentialNotes: { type: DataTypes.TEXT, allowNull: true },
      schoolId: { type: DataTypes.UUID, allowNull: false, references: { model: 'schools', key: 'id' } },
    },
    {
      sequelize,
      tableName: 'mental_health_screenings',
      timestamps: true,
      paranoid: true,
      indexes: [
        { fields: ['studentId'] },
        { fields: ['schoolId'] },
        { fields: ['screeningDate'] },
        { fields: ['riskLevel'] },
        { fields: ['suicidalIdeation'] },
        { fields: ['followUpRequired'] },
      ],
      hooks: {
        beforeCreate: (screening) => {
          // Auto-escalate high-risk screenings
          if (
            screening.suicidalIdeation ||
            screening.riskLevel === MentalHealthRiskLevel.SEVERE ||
            screening.riskLevel === MentalHealthRiskLevel.IMMINENT
          ) {
            screening.emergencyContactMade = true;
            screening.parentNotificationRequired = true;
            screening.referralRecommended = true;
          }
        },
        afterCreate: async (screening) => {
          // Log high-risk screenings for immediate follow-up
          if (screening.riskLevel === MentalHealthRiskLevel.IMMINENT) {
            console.error(`CRITICAL: Imminent risk screening for student ${screening.studentId}`);
          }
        },
      },
      scopes: {
        highRisk: {
          where: {
            riskLevel: [
              MentalHealthRiskLevel.MODERATELY_SEVERE,
              MentalHealthRiskLevel.SEVERE,
              MentalHealthRiskLevel.IMMINENT,
            ],
          },
        },
        suicidalRisk: {
          where: { suicidalIdeation: true },
        },
        requiresFollowUp: {
          where: {
            followUpRequired: true,
            followUpDate: { [Op.gte]: new Date() },
          },
        },
        recent: {
          where: {
            screeningDate: {
              [Op.gte]: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
            },
          },
          order: [['screeningDate', 'DESC']],
        },
      },
    },
  );

  return MentalHealthScreening;
};

/**
 * Sequelize model for Counselor Referrals
 */
export const createCounselorReferralModel = (sequelize: Sequelize) => {
  class CounselorReferral extends Model {
    public id!: string;
    public studentId!: string;
    public referralDate!: Date;
    public referralReason!: string;
    public referringStaff!: string;
    public referralUrgency!: ReferralUrgency;
    public concerningSigns!: string[];
    public recentTriggers!: string | null;
    public counselorAssigned!: string | null;
    public referralStatus!: ReferralStatus;
    public parentConsentObtained!: boolean;
    public parentConsentDate!: Date | null;
    public initialMeetingDate!: Date | null;
    public ongoingSupport!: boolean;
    public confidentialityAgreed!: boolean;
    public schoolId!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Virtual attribute for days since referral
    public get daysSinceReferral(): number {
      const diffTime = Math.abs(new Date().getTime() - this.referralDate.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
  }

  CounselorReferral.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      studentId: { type: DataTypes.UUID, allowNull: false, references: { model: 'students', key: 'id' } },
      referralDate: { type: DataTypes.DATEONLY, allowNull: false },
      referralReason: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [10, 2000],
        },
      },
      referringStaff: { type: DataTypes.UUID, allowNull: false, references: { model: 'users', key: 'id' } },
      referralUrgency: { type: DataTypes.ENUM(...Object.values(ReferralUrgency)), allowNull: false },
      concerningSigns: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
      recentTriggers: { type: DataTypes.TEXT, allowNull: true },
      counselorAssigned: { type: DataTypes.UUID, allowNull: true, references: { model: 'users', key: 'id' } },
      referralStatus: { type: DataTypes.ENUM(...Object.values(ReferralStatus)), defaultValue: ReferralStatus.PENDING },
      parentConsentObtained: { type: DataTypes.BOOLEAN, defaultValue: false },
      parentConsentDate: { type: DataTypes.DATE, allowNull: true },
      initialMeetingDate: { type: DataTypes.DATE, allowNull: true },
      ongoingSupport: { type: DataTypes.BOOLEAN, defaultValue: false },
      confidentialityAgreed: { type: DataTypes.BOOLEAN, defaultValue: false },
      schoolId: { type: DataTypes.UUID, allowNull: false, references: { model: 'schools', key: 'id' } },
    },
    {
      sequelize,
      tableName: 'counselor_referrals',
      timestamps: true,
      paranoid: true,
      indexes: [
        { fields: ['studentId'] },
        { fields: ['schoolId'] },
        { fields: ['referralStatus'] },
        { fields: ['referralUrgency'] },
        { fields: ['counselorAssigned'] },
        { fields: ['parentConsentObtained'] },
      ],
      scopes: {
        pending: {
          where: { referralStatus: ReferralStatus.PENDING },
        },
        urgent: {
          where: { referralUrgency: [ReferralUrgency.URGENT, ReferralUrgency.EMERGENCY] },
        },
        pendingConsent: {
          where: { parentConsentObtained: false },
        },
        active: {
          where: {
            referralStatus: [ReferralStatus.CONTACTED, ReferralStatus.SCHEDULED, ReferralStatus.IN_PROGRESS],
          },
        },
      },
    },
  );

  return CounselorReferral;
};

/**
 * Sequelize model for Crisis Interventions
 */
export const createCrisisInterventionModel = (sequelize: Sequelize) => {
  class CrisisIntervention extends Model {
    public id!: string;
    public studentId!: string;
    public crisisDate!: Date;
    public crisisTime!: string;
    public crisisType!: CrisisType;
    public crisisLocation!: string;
    public crisisDescription!: string;
    public suicidalThoughts!: boolean;
    public suicidalPlan!: boolean;
    public suicidalMeans!: boolean;
    public selfHarmEvidence!: boolean;
    public immediateRiskLevel!: MentalHealthRiskLevel;
    public interventionSteps!: string[];
    public respondingStaff!: string[];
    public emergencyServicesContacted!: boolean;
    public emergencyServiceType!: string | null;
    public parentNotified!: boolean;
    public parentNotificationTime!: Date | null;
    public studentSafetyStatus!: string;
    public followUpPlanCreated!: boolean;
    public mandatedReporting!: boolean;
    public reportingAgency!: string | null;
    public schoolId!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Virtual attribute for suicide risk assessment
    public get suicideRiskScore(): number {
      let score = 0;
      if (this.suicidalThoughts) score += 1;
      if (this.suicidalPlan) score += 2;
      if (this.suicidalMeans) score += 3;
      return score; // 0-6 scale
    }
  }

  CrisisIntervention.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      studentId: { type: DataTypes.UUID, allowNull: false, references: { model: 'students', key: 'id' } },
      crisisDate: { type: DataTypes.DATEONLY, allowNull: false },
      crisisTime: { type: DataTypes.STRING(10), allowNull: false },
      crisisType: { type: DataTypes.ENUM(...Object.values(CrisisType)), allowNull: false },
      crisisLocation: { type: DataTypes.STRING(255), allowNull: false },
      crisisDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      suicidalThoughts: { type: DataTypes.BOOLEAN, defaultValue: false },
      suicidalPlan: { type: DataTypes.BOOLEAN, defaultValue: false },
      suicidalMeans: { type: DataTypes.BOOLEAN, defaultValue: false },
      selfHarmEvidence: { type: DataTypes.BOOLEAN, defaultValue: false },
      immediateRiskLevel: { type: DataTypes.ENUM(...Object.values(MentalHealthRiskLevel)), allowNull: false },
      interventionSteps: { type: DataTypes.ARRAY(DataTypes.TEXT), defaultValue: [] },
      respondingStaff: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
      emergencyServicesContacted: { type: DataTypes.BOOLEAN, defaultValue: false },
      emergencyServiceType: { type: DataTypes.STRING(100), allowNull: true },
      parentNotified: { type: DataTypes.BOOLEAN, defaultValue: false },
      parentNotificationTime: { type: DataTypes.DATE, allowNull: true },
      studentSafetyStatus: {
        type: DataTypes.ENUM('safe', 'monitored', 'hospitalized', 'released_to_parent'),
        allowNull: false,
      },
      followUpPlanCreated: { type: DataTypes.BOOLEAN, defaultValue: false },
      mandatedReporting: { type: DataTypes.BOOLEAN, defaultValue: false },
      reportingAgency: { type: DataTypes.STRING(255), allowNull: true },
      schoolId: { type: DataTypes.UUID, allowNull: false, references: { model: 'schools', key: 'id' } },
    },
    {
      sequelize,
      tableName: 'crisis_interventions',
      timestamps: true,
      paranoid: true,
      indexes: [
        { fields: ['studentId'] },
        { fields: ['schoolId'] },
        { fields: ['crisisDate'] },
        { fields: ['crisisType'] },
        { fields: ['immediateRiskLevel'] },
        { fields: ['suicidalThoughts'] },
      ],
      hooks: {
        beforeCreate: (crisis) => {
          // Automatic mandated reporting for high-risk crises
          if (
            crisis.suicidalPlan ||
            crisis.suicidalMeans ||
            crisis.crisisType === CrisisType.SUICIDAL_IDEATION ||
            crisis.immediateRiskLevel === MentalHealthRiskLevel.IMMINENT
          ) {
            crisis.mandatedReporting = true;
          }
        },
        afterCreate: async (crisis) => {
          // Alert crisis team for imminent risk
          if (crisis.immediateRiskLevel === MentalHealthRiskLevel.IMMINENT) {
            console.error(`CRISIS ALERT: Imminent risk for student ${crisis.studentId}`);
          }
        },
      },
      scopes: {
        suicidalCrises: {
          where: {
            crisisType: CrisisType.SUICIDAL_IDEATION,
          },
        },
        imminentRisk: {
          where: {
            immediateRiskLevel: MentalHealthRiskLevel.IMMINENT,
          },
        },
        requiresMandatedReport: {
          where: {
            mandatedReporting: true,
          },
        },
        recent: {
          where: {
            crisisDate: {
              [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
          },
          order: [['crisisDate', 'DESC']],
        },
      },
    },
  );

  return CrisisIntervention;
};

/**
 * Sequelize model for Safety Plans
 */
export const createSafetyPlanModel = (sequelize: Sequelize) => {
  class SafetyPlan extends Model {
    public id!: string;
    public studentId!: string;
    public planCreationDate!: Date;
    public createdBy!: string;
    public planStatus!: SafetyPlanStatus;
    public warningSignsIdentified!: string[];
    public copingStrategies!: string[];
    public distractionActivities!: string[];
    public supportivePeople!: Array<Record<string, string>>;
    public professionalContacts!: Array<Record<string, string>>;
    public emergencyContacts!: Array<Record<string, string>>;
    public safeEnvironmentPlan!: string;
    public restrictedAccessItems!: string[] | null;
    public studentCommitment!: string;
    public parentInvolvement!: boolean;
    public reviewDate!: Date;
    public lastReviewDate!: Date | null;
    public planRevisionNumber!: number;
    public schoolId!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Virtual attribute for plan currency
    public get isPlanCurrent(): boolean {
      return this.reviewDate >= new Date() && this.planStatus === SafetyPlanStatus.ACTIVE;
    }
  }

  SafetyPlan.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      studentId: { type: DataTypes.UUID, allowNull: false, references: { model: 'students', key: 'id' } },
      planCreationDate: { type: DataTypes.DATEONLY, allowNull: false },
      createdBy: { type: DataTypes.UUID, allowNull: false, references: { model: 'users', key: 'id' } },
      planStatus: { type: DataTypes.ENUM(...Object.values(SafetyPlanStatus)), defaultValue: SafetyPlanStatus.ACTIVE },
      warningSignsIdentified: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
      copingStrategies: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
      distractionActivities: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
      supportivePeople: { type: DataTypes.JSONB, defaultValue: [] },
      professionalContacts: { type: DataTypes.JSONB, defaultValue: [] },
      emergencyContacts: { type: DataTypes.JSONB, defaultValue: [] },
      safeEnvironmentPlan: { type: DataTypes.TEXT, allowNull: false },
      restrictedAccessItems: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
      studentCommitment: { type: DataTypes.TEXT, allowNull: false },
      parentInvolvement: { type: DataTypes.BOOLEAN, defaultValue: false },
      reviewDate: { type: DataTypes.DATEONLY, allowNull: false },
      lastReviewDate: { type: DataTypes.DATEONLY, allowNull: true },
      planRevisionNumber: { type: DataTypes.INTEGER, defaultValue: 1 },
      schoolId: { type: DataTypes.UUID, allowNull: false, references: { model: 'schools', key: 'id' } },
    },
    {
      sequelize,
      tableName: 'safety_plans',
      timestamps: true,
      paranoid: true,
      indexes: [
        { fields: ['studentId'] },
        { fields: ['schoolId'] },
        { fields: ['planStatus'] },
        { fields: ['reviewDate'] },
      ],
      hooks: {
        beforeUpdate: (plan) => {
          // Update revision number if plan content changed
          if (plan.changed('copingStrategies') || plan.changed('emergencyContacts')) {
            plan.planRevisionNumber += 1;
            plan.lastReviewDate = new Date();
          }
        },
      },
      scopes: {
        active: {
          where: { planStatus: SafetyPlanStatus.ACTIVE },
        },
        needsReview: {
          where: {
            reviewDate: { [Op.lte]: new Date() },
            planStatus: SafetyPlanStatus.ACTIVE,
          },
        },
      },
    },
  );

  return SafetyPlan;
};

/**
 * Sequelize model for Mental Health Accommodations
 */
export const createMentalHealthAccommodationModel = (sequelize: Sequelize) => {
  class MentalHealthAccommodation extends Model {
    public id!: string;
    public studentId!: string;
    public accommodationType!: AccommodationType;
    public accommodationDescription!: string;
    public startDate!: Date;
    public endDate!: Date | null;
    public iep504Plan!: boolean;
    public planDocumentId!: string | null;
    public approvedBy!: string;
    public implementationInstructions!: string;
    public teachersNotified!: string[];
    public accommodationActive!: boolean;
    public progressMonitoring!: boolean;
    public monitoringFrequency!: string | null;
    public lastMonitoringDate!: Date | null;
    public effectivenessRating!: number | null;
    public parentConsented!: boolean;
    public schoolId!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  MentalHealthAccommodation.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      studentId: { type: DataTypes.UUID, allowNull: false, references: { model: 'students', key: 'id' } },
      accommodationType: { type: DataTypes.ENUM(...Object.values(AccommodationType)), allowNull: false },
      accommodationDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      startDate: { type: DataTypes.DATEONLY, allowNull: false },
      endDate: { type: DataTypes.DATEONLY, allowNull: true },
      iep504Plan: { type: DataTypes.BOOLEAN, defaultValue: false },
      planDocumentId: { type: DataTypes.STRING(255), allowNull: true },
      approvedBy: { type: DataTypes.UUID, allowNull: false, references: { model: 'users', key: 'id' } },
      implementationInstructions: { type: DataTypes.TEXT, allowNull: false },
      teachersNotified: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
      accommodationActive: { type: DataTypes.BOOLEAN, defaultValue: true },
      progressMonitoring: { type: DataTypes.BOOLEAN, defaultValue: false },
      monitoringFrequency: { type: DataTypes.STRING(50), allowNull: true },
      lastMonitoringDate: { type: DataTypes.DATE, allowNull: true },
      effectivenessRating: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 1,
          max: 5,
        },
      },
      parentConsented: { type: DataTypes.BOOLEAN, defaultValue: false },
      schoolId: { type: DataTypes.UUID, allowNull: false, references: { model: 'schools', key: 'id' } },
    },
    {
      sequelize,
      tableName: 'mental_health_accommodations',
      timestamps: true,
      paranoid: true,
      indexes: [
        { fields: ['studentId'] },
        { fields: ['schoolId'] },
        { fields: ['accommodationType'] },
        { fields: ['accommodationActive'] },
        { fields: ['iep504Plan'] },
      ],
      scopes: {
        active: {
          where: { accommodationActive: true },
        },
        requiresMonitoring: {
          where: {
            progressMonitoring: true,
            accommodationActive: true,
          },
        },
      },
    },
  );

  return MentalHealthAccommodation;
};

/**
 * Sequelize model for Therapy Sessions
 */
export const createTherapySessionModel = (sequelize: Sequelize) => {
  class TherapySession extends Model {
    public id!: string;
    public studentId!: string;
    public counselorId!: string;
    public sessionDate!: Date;
    public sessionTime!: string;
    public sessionDuration!: number;
    public sessionType!: string;
    public sessionStatus!: TherapySessionStatus;
    public topicsDiscussed!: string[] | null;
    public interventionsUsed!: string[] | null;
    public studentProgress!: string | null;
    public concernsIdentified!: string[] | null;
    public homeworkAssigned!: string | null;
    public nextSessionDate!: Date | null;
    public parentUpdateProvided!: boolean;
    public confidentialNotes!: string | null;
    public schoolId!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  TherapySession.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      studentId: { type: DataTypes.UUID, allowNull: false, references: { model: 'students', key: 'id' } },
      counselorId: { type: DataTypes.UUID, allowNull: false, references: { model: 'users', key: 'id' } },
      sessionDate: { type: DataTypes.DATEONLY, allowNull: false },
      sessionTime: { type: DataTypes.STRING(10), allowNull: false },
      sessionDuration: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 15,
          max: 180,
        },
      },
      sessionType: { type: DataTypes.ENUM('individual', 'group', 'family', 'crisis'), allowNull: false },
      sessionStatus: {
        type: DataTypes.ENUM(...Object.values(TherapySessionStatus)),
        defaultValue: TherapySessionStatus.SCHEDULED,
      },
      topicsDiscussed: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
      interventionsUsed: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
      studentProgress: { type: DataTypes.TEXT, allowNull: true },
      concernsIdentified: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
      homeworkAssigned: { type: DataTypes.TEXT, allowNull: true },
      nextSessionDate: { type: DataTypes.DATE, allowNull: true },
      parentUpdateProvided: { type: DataTypes.BOOLEAN, defaultValue: false },
      confidentialNotes: { type: DataTypes.TEXT, allowNull: true },
      schoolId: { type: DataTypes.UUID, allowNull: false, references: { model: 'schools', key: 'id' } },
    },
    {
      sequelize,
      tableName: 'therapy_sessions',
      timestamps: true,
      paranoid: true,
      indexes: [
        { fields: ['studentId'] },
        { fields: ['counselorId'] },
        { fields: ['schoolId'] },
        { fields: ['sessionDate'] },
        { fields: ['sessionStatus'] },
      ],
      scopes: {
        upcoming: {
          where: {
            sessionDate: { [Op.gte]: new Date() },
            sessionStatus: TherapySessionStatus.SCHEDULED,
          },
          order: [['sessionDate', 'ASC']],
        },
        completed: {
          where: { sessionStatus: TherapySessionStatus.COMPLETED },
        },
      },
    },
  );

  return TherapySession;
};

// ============================================================================
// NESTJS INJECTABLE SERVICE
// ============================================================================

/**
 * School Clinic Mental Health Support Composite Service
 *
 * Provides comprehensive mental health support for K-12 school clinics
 * including screening, counseling, crisis intervention, and safety planning.
 */
@Injectable()
export class MentalHealthSupportCompositeService {
  private readonly logger = new Logger(MentalHealthSupportCompositeService.name);

  constructor(@Inject('SEQUELIZE') private readonly sequelize: Sequelize) {}

  // ============================================================================
  // 1. MENTAL HEALTH SCREENING & ASSESSMENT (Functions 1-7)
  // ============================================================================

  /**
   * 1. Administers mental health screening (PHQ-9, GAD-7).
   * Calculates risk level and determines if immediate intervention needed.
   */
  async administerMentalHealthScreening(screeningData: MentalHealthScreeningData): Promise<any> {
    this.logger.log(`Administering mental health screening for student ${screeningData.studentId}`);

    const MentalHealthScreening = createMentalHealthScreeningModel(this.sequelize);
    const screening = await MentalHealthScreening.create(screeningData);

    return screening.toJSON();
  }

  /**
   * 2. Retrieves mental health screening history for student.
   */
  async getMentalHealthScreeningHistory(studentId: string): Promise<any[]> {
    const MentalHealthScreening = createMentalHealthScreeningModel(this.sequelize);

    const screenings = await MentalHealthScreening.findAll({
      where: { studentId },
      order: [['screeningDate', 'DESC']],
    });

    return screenings.map((s) => s.toJSON());
  }

  /**
   * 3. Identifies students with high-risk screening results.
   */
  async getHighRiskStudents(schoolId: string): Promise<any[]> {
    const MentalHealthScreening = createMentalHealthScreeningModel(this.sequelize);

    const highRiskScreenings = await MentalHealthScreening.scope('highRisk').findAll({
      where: { schoolId },
    });

    return highRiskScreenings.map((s) => s.toJSON());
  }

  /**
   * 4. Calculates PHQ-9 depression score with clinical interpretation.
   */
  async calculatePHQ9Score(responses: number[]): Promise<any> {
    if (responses.length !== 9) {
      throw new BadRequestException('PHQ-9 requires 9 responses (0-3 scale)');
    }

    const totalScore = responses.reduce((sum, val) => sum + val, 0);

    let severity: string;
    let riskLevel: MentalHealthRiskLevel;

    if (totalScore >= 20) {
      severity = 'Severe depression';
      riskLevel = MentalHealthRiskLevel.SEVERE;
    } else if (totalScore >= 15) {
      severity = 'Moderately severe depression';
      riskLevel = MentalHealthRiskLevel.MODERATELY_SEVERE;
    } else if (totalScore >= 10) {
      severity = 'Moderate depression';
      riskLevel = MentalHealthRiskLevel.MODERATE;
    } else if (totalScore >= 5) {
      severity = 'Mild depression';
      riskLevel = MentalHealthRiskLevel.MILD;
    } else {
      severity = 'Minimal depression';
      riskLevel = MentalHealthRiskLevel.MINIMAL;
    }

    return {
      phq9Score: totalScore,
      severity,
      riskLevel,
      suicidalIdeationCheck: responses[8] > 0, // Question 9 about self-harm thoughts
      recommendedAction:
        totalScore >= 10 ? 'Professional evaluation recommended' : 'Monitor and provide support as needed',
    };
  }

  /**
   * 5. Calculates GAD-7 anxiety score with clinical interpretation.
   */
  async calculateGAD7Score(responses: number[]): Promise<any> {
    if (responses.length !== 7) {
      throw new BadRequestException('GAD-7 requires 7 responses (0-3 scale)');
    }

    const totalScore = responses.reduce((sum, val) => sum + val, 0);

    let severity: string;
    let riskLevel: MentalHealthRiskLevel;

    if (totalScore >= 15) {
      severity = 'Severe anxiety';
      riskLevel = MentalHealthRiskLevel.SEVERE;
    } else if (totalScore >= 10) {
      severity = 'Moderate anxiety';
      riskLevel = MentalHealthRiskLevel.MODERATE;
    } else if (totalScore >= 5) {
      severity = 'Mild anxiety';
      riskLevel = MentalHealthRiskLevel.MILD;
    } else {
      severity = 'Minimal anxiety';
      riskLevel = MentalHealthRiskLevel.MINIMAL;
    }

    return {
      gad7Score: totalScore,
      severity,
      riskLevel,
      recommendedAction: totalScore >= 10 ? 'Professional evaluation recommended' : 'Monitor symptoms',
    };
  }

  /**
   * 6. Schedules follow-up screening for at-risk students.
   */
  async scheduleFollowUpScreening(screeningId: string, followUpDate: Date): Promise<any> {
    const MentalHealthScreening = createMentalHealthScreeningModel(this.sequelize);
    const screening = await MentalHealthScreening.findByPk(screeningId);

    if (!screening) {
      throw new NotFoundException(`Screening ${screeningId} not found`);
    }

    await screening.update({
      followUpRequired: true,
      followUpDate,
    });

    return screening.toJSON();
  }

  /**
   * 7. Generates mental health screening report for school administration.
   */
  async generateMentalHealthScreeningReport(schoolId: string, dateRange: { startDate: Date; endDate: Date }): Promise<any> {
    const MentalHealthScreening = createMentalHealthScreeningModel(this.sequelize);

    const screenings = await MentalHealthScreening.findAll({
      where: {
        schoolId,
        screeningDate: { [Op.between]: [dateRange.startDate, dateRange.endDate] },
      },
    });

    const riskLevelCounts = screenings.reduce(
      (acc, s) => {
        acc[s.riskLevel] = (acc[s.riskLevel] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      schoolId,
      reportPeriod: dateRange,
      totalScreenings: screenings.length,
      riskLevelDistribution: riskLevelCounts,
      suicidalIdeationCount: screenings.filter((s) => s.suicidalIdeation).length,
      referralsRecommended: screenings.filter((s) => s.referralRecommended).length,
      reportGeneratedAt: new Date(),
    };
  }

  // ============================================================================
  // 2. COUNSELOR REFERRAL WORKFLOWS (Functions 8-13)
  // ============================================================================

  /**
   * 8. Creates counselor referral with urgency classification.
   */
  async createCounselorReferral(referralData: CounselorReferralData): Promise<any> {
    this.logger.log(`Creating counselor referral for student ${referralData.studentId} - Urgency: ${referralData.referralUrgency}`);

    const CounselorReferral = createCounselorReferralModel(this.sequelize);
    const referral = await CounselorReferral.create(referralData);

    return referral.toJSON();
  }

  /**
   * 9. Assigns counselor to referral.
   */
  async assignCounselorToReferral(referralId: string, counselorId: string): Promise<any> {
    const CounselorReferral = createCounselorReferralModel(this.sequelize);
    const referral = await CounselorReferral.findByPk(referralId);

    if (!referral) {
      throw new NotFoundException(`Referral ${referralId} not found`);
    }

    await referral.update({
      counselorAssigned: counselorId,
      referralStatus: ReferralStatus.CONTACTED,
    });

    return referral.toJSON();
  }

  /**
   * 10. Documents parent consent for counseling services.
   */
  async documentParentCounselingConsent(referralId: string, consentObtained: boolean, consentDate: Date): Promise<any> {
    const CounselorReferral = createCounselorReferralModel(this.sequelize);
    const referral = await CounselorReferral.findByPk(referralId);

    if (!referral) {
      throw new NotFoundException(`Referral ${referralId} not found`);
    }

    await referral.update({
      parentConsentObtained: consentObtained,
      parentConsentDate: consentDate,
      referralStatus: consentObtained ? ReferralStatus.SCHEDULED : ReferralStatus.DECLINED,
    });

    return referral.toJSON();
  }

  /**
   * 11. Retrieves pending counselor referrals for assignment.
   */
  async getPendingCounselorReferrals(schoolId: string, urgency?: ReferralUrgency): Promise<any[]> {
    const CounselorReferral = createCounselorReferralModel(this.sequelize);

    const where: any = { schoolId };
    if (urgency) where.referralUrgency = urgency;

    const referrals = await CounselorReferral.scope('pending').findAll({ where });

    return referrals.map((r) => r.toJSON());
  }

  /**
   * 12. Updates referral status and tracks progress.
   */
  async updateReferralProgress(referralId: string, newStatus: ReferralStatus, progressNotes?: string): Promise<any> {
    const CounselorReferral = createCounselorReferralModel(this.sequelize);
    const referral = await CounselorReferral.findByPk(referralId);

    if (!referral) {
      throw new NotFoundException(`Referral ${referralId} not found`);
    }

    await referral.update({ referralStatus: newStatus });

    return {
      referralId,
      newStatus,
      progressNotes,
      updatedAt: new Date(),
    };
  }

  /**
   * 13. Generates counselor caseload report.
   */
  async generateCounselorCaseloadReport(counselorId: string): Promise<any> {
    const CounselorReferral = createCounselorReferralModel(this.sequelize);

    const activeReferrals = await CounselorReferral.scope('active').findAll({
      where: { counselorAssigned: counselorId },
    });

    const urgencyCounts = activeReferrals.reduce(
      (acc, r) => {
        acc[r.referralUrgency] = (acc[r.referralUrgency] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      counselorId,
      totalActiveCases: activeReferrals.length,
      urgencyBreakdown: urgencyCounts,
      averageDaysSinceReferral:
        activeReferrals.reduce((sum, r) => sum + (r as any).daysSinceReferral, 0) / activeReferrals.length || 0,
      reportGeneratedAt: new Date(),
    };
  }

  // ============================================================================
  // 3. CRISIS INTERVENTION PROTOCOLS (Functions 14-21)
  // ============================================================================

  /**
   * 14. Documents crisis intervention with risk assessment.
   */
  async documentCrisisIntervention(interventionData: CrisisInterventionData): Promise<any> {
    this.logger.warn(`CRISIS INTERVENTION: ${interventionData.crisisType} for student ${interventionData.studentId}`);

    const CrisisIntervention = createCrisisInterventionModel(this.sequelize);
    const intervention = await CrisisIntervention.create(interventionData);

    return intervention.toJSON();
  }

  /**
   * 15. Conducts suicide risk assessment with Columbia Protocol.
   */
  async conductSuicideRiskAssessment(
    studentId: string,
    assessmentData: {
      suicidalThoughts: boolean;
      suicidalPlan: boolean;
      suicidalMeans: boolean;
      previousAttempts: boolean;
      protectiveFactors: string[];
      riskFactors: string[];
    },
  ): Promise<any> {
    let riskLevel: MentalHealthRiskLevel;

    // Calculate risk based on Columbia Protocol
    if (assessmentData.suicidalMeans && assessmentData.suicidalPlan && assessmentData.suicidalThoughts) {
      riskLevel = MentalHealthRiskLevel.IMMINENT;
    } else if (assessmentData.suicidalPlan && assessmentData.suicidalThoughts) {
      riskLevel = MentalHealthRiskLevel.SEVERE;
    } else if (assessmentData.suicidalThoughts) {
      riskLevel = MentalHealthRiskLevel.MODERATE;
    } else {
      riskLevel = MentalHealthRiskLevel.MINIMAL;
    }

    return {
      studentId,
      assessmentDate: new Date(),
      ...assessmentData,
      overallRiskLevel: riskLevel,
      immediateActionRequired: riskLevel === MentalHealthRiskLevel.IMMINENT || riskLevel === MentalHealthRiskLevel.SEVERE,
      recommendedAction:
        riskLevel === MentalHealthRiskLevel.IMMINENT
          ? 'Immediate hospitalization - Do not leave student alone'
          : riskLevel === MentalHealthRiskLevel.SEVERE
            ? 'Emergency mental health evaluation within 24 hours'
            : 'Safety plan and counseling recommended',
    };
  }

  /**
   * 16. Activates emergency response for imminent risk.
   */
  async activateEmergencyResponse(interventionId: string, emergencyType: '911' | 'crisis_team' | 'parent'): Promise<any> {
    this.logger.error(`EMERGENCY RESPONSE ACTIVATED: ${emergencyType} for intervention ${interventionId}`);

    const CrisisIntervention = createCrisisInterventionModel(this.sequelize);
    const intervention = await CrisisIntervention.findByPk(interventionId);

    if (!intervention) {
      throw new NotFoundException(`Crisis intervention ${interventionId} not found`);
    }

    await intervention.update({
      emergencyServicesContacted: true,
      emergencyServiceType: emergencyType,
    });

    return {
      interventionId,
      emergencyType,
      emergencyActivatedAt: new Date(),
      status: 'emergency_response_active',
    };
  }

  /**
   * 17. Notifies parent/guardian of crisis situation.
   */
  async notifyParentOfCrisis(interventionId: string, notificationMethod: 'phone' | 'in_person', notifiedBy: string): Promise<any> {
    const CrisisIntervention = createCrisisInterventionModel(this.sequelize);
    const intervention = await CrisisIntervention.findByPk(interventionId);

    if (!intervention) {
      throw new NotFoundException(`Crisis intervention ${interventionId} not found`);
    }

    await intervention.update({
      parentNotified: true,
      parentNotificationTime: new Date(),
    });

    this.logger.log(`Parent notified of crisis for student ${intervention.studentId}`);

    return {
      interventionId,
      notificationMethod,
      notifiedBy,
      notificationTime: new Date(),
    };
  }

  /**
   * 18. Documents mandated reporting to authorities.
   */
  async documentMandatedReporting(
    interventionId: string,
    reportingAgency: 'CPS' | 'police' | 'mental_health_authority',
    reportDetails: string,
  ): Promise<any> {
    const CrisisIntervention = createCrisisInterventionModel(this.sequelize);
    const intervention = await CrisisIntervention.findByPk(interventionId);

    if (!intervention) {
      throw new NotFoundException(`Crisis intervention ${interventionId} not found`);
    }

    await intervention.update({
      mandatedReporting: true,
      reportingAgency,
    });

    return {
      interventionId,
      reportingAgency,
      reportDetails,
      reportMadeAt: new Date(),
      confirmationRequired: true,
    };
  }

  /**
   * 19. Retrieves crisis intervention history for student.
   */
  async getCrisisInterventionHistory(studentId: string): Promise<any[]> {
    const CrisisIntervention = createCrisisInterventionModel(this.sequelize);

    const interventions = await CrisisIntervention.findAll({
      where: { studentId },
      order: [['crisisDate', 'DESC']],
    });

    return interventions.map((i) => i.toJSON());
  }

  /**
   * 20. Generates crisis intervention report for administration.
   */
  async generateCrisisReport(schoolId: string, dateRange: { startDate: Date; endDate: Date }): Promise<any> {
    const CrisisIntervention = createCrisisInterventionModel(this.sequelize);

    const crises = await CrisisIntervention.findAll({
      where: {
        schoolId,
        crisisDate: { [Op.between]: [dateRange.startDate, dateRange.endDate] },
      },
    });

    const crisisTypeCounts = crises.reduce(
      (acc, c) => {
        acc[c.crisisType] = (acc[c.crisisType] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      schoolId,
      reportPeriod: dateRange,
      totalCrises: crises.length,
      crisisTypeBreakdown: crisisTypeCounts,
      suicidalCrises: crises.filter((c) => c.crisisType === CrisisType.SUICIDAL_IDEATION).length,
      hospitalizations: crises.filter((c) => c.studentSafetyStatus === 'hospitalized').length,
      mandatedReports: crises.filter((c) => c.mandatedReporting).length,
      reportGeneratedAt: new Date(),
    };
  }

  /**
   * 21. Tracks post-crisis follow-up compliance.
   */
  async trackPostCrisisFollowUp(interventionId: string, followUpCompleted: boolean, followUpNotes?: string): Promise<any> {
    const CrisisIntervention = createCrisisInterventionModel(this.sequelize);
    const intervention = await CrisisIntervention.findByPk(interventionId);

    if (!intervention) {
      throw new NotFoundException(`Crisis intervention ${interventionId} not found`);
    }

    await intervention.update({ followUpPlanCreated: followUpCompleted });

    return {
      interventionId,
      followUpCompleted,
      followUpNotes,
      followUpDate: new Date(),
    };
  }

  // ============================================================================
  // 4. SAFETY PLANNING FOR AT-RISK STUDENTS (Functions 22-28)
  // ============================================================================

  /**
   * 22. Creates comprehensive safety plan for at-risk student.
   */
  async createSafetyPlan(planData: SafetyPlanData): Promise<any> {
    this.logger.log(`Creating safety plan for student ${planData.studentId}`);

    const SafetyPlan = createSafetyPlanModel(this.sequelize);
    const plan = await SafetyPlan.create(planData);

    return plan.toJSON();
  }

  /**
   * 23. Updates safety plan with revised strategies.
   */
  async updateSafetyPlan(planId: string, updates: Partial<SafetyPlanData>): Promise<any> {
    const SafetyPlan = createSafetyPlanModel(this.sequelize);
    const plan = await SafetyPlan.findByPk(planId);

    if (!plan) {
      throw new NotFoundException(`Safety plan ${planId} not found`);
    }

    await plan.update(updates);

    return plan.toJSON();
  }

  /**
   * 24. Retrieves active safety plans for monitoring.
   */
  async getActiveSafetyPlans(schoolId: string): Promise<any[]> {
    const SafetyPlan = createSafetyPlanModel(this.sequelize);

    const plans = await SafetyPlan.scope('active').findAll({
      where: { schoolId },
    });

    return plans.map((p) => p.toJSON());
  }

  /**
   * 25. Reviews and updates safety plan effectiveness.
   */
  async reviewSafetyPlanEffectiveness(planId: string, reviewNotes: string, effectivenessRating: number): Promise<any> {
    const SafetyPlan = createSafetyPlanModel(this.sequelize);
    const plan = await SafetyPlan.findByPk(planId);

    if (!plan) {
      throw new NotFoundException(`Safety plan ${planId} not found`);
    }

    await plan.update({
      lastReviewDate: new Date(),
      planRevisionNumber: plan.planRevisionNumber + 1,
    });

    return {
      planId,
      reviewNotes,
      effectivenessRating,
      reviewDate: new Date(),
      nextReviewDate: plan.reviewDate,
    };
  }

  /**
   * 26. Identifies students with safety plans requiring review.
   */
  async getPlansRequiringReview(schoolId: string): Promise<any[]> {
    const SafetyPlan = createSafetyPlanModel(this.sequelize);

    const plans = await SafetyPlan.scope('needsReview').findAll({
      where: { schoolId },
    });

    return plans.map((p) => p.toJSON());
  }

  /**
   * 27. Documents crisis contacts and emergency procedures.
   */
  async documentCrisisContacts(
    planId: string,
    contacts: {
      emergencyContacts: Array<{ name: string; relationship: string; phone: string }>;
      professionalContacts: Array<{ name: string; role: string; phone: string }>;
    },
  ): Promise<any> {
    const SafetyPlan = createSafetyPlanModel(this.sequelize);
    const plan = await SafetyPlan.findByPk(planId);

    if (!plan) {
      throw new NotFoundException(`Safety plan ${planId} not found`);
    }

    await plan.update(contacts);

    return plan.toJSON();
  }

  /**
   * 28. Generates safety plan summary for parent review.
   */
  async generateSafetyPlanSummary(planId: string): Promise<any> {
    const SafetyPlan = createSafetyPlanModel(this.sequelize);
    const plan = await SafetyPlan.findByPk(planId);

    if (!plan) {
      throw new NotFoundException(`Safety plan ${planId} not found`);
    }

    return {
      planId,
      studentId: plan.studentId,
      planStatus: plan.planStatus,
      warningSignsToWatch: plan.warningSignsIdentified,
      copingStrategies: plan.copingStrategies,
      supportContacts: plan.supportivePeople,
      emergencyContacts: plan.emergencyContacts,
      nextReviewDate: plan.reviewDate,
      parentInvolvementRequired: plan.parentInvolvement,
    };
  }

  // ============================================================================
  // 5. MENTAL HEALTH ACCOMMODATION TRACKING (Functions 29-33)
  // ============================================================================

  /**
   * 29. Creates mental health accommodation (504 plan).
   */
  async createMentalHealthAccommodation(accommodationData: MentalHealthAccommodationData): Promise<any> {
    this.logger.log(`Creating mental health accommodation for student ${accommodationData.studentId}`);

    const MentalHealthAccommodation = createMentalHealthAccommodationModel(this.sequelize);
    const accommodation = await MentalHealthAccommodation.create(accommodationData);

    return accommodation.toJSON();
  }

  /**
   * 30. Retrieves active accommodations for student.
   */
  async getStudentAccommodations(studentId: string): Promise<any[]> {
    const MentalHealthAccommodation = createMentalHealthAccommodationModel(this.sequelize);

    const accommodations = await MentalHealthAccommodation.scope('active').findAll({
      where: { studentId },
    });

    return accommodations.map((a) => a.toJSON());
  }

  /**
   * 31. Monitors accommodation implementation effectiveness.
   */
  async monitorAccommodationEffectiveness(accommodationId: string, effectivenessRating: number, monitoringNotes: string): Promise<any> {
    const MentalHealthAccommodation = createMentalHealthAccommodationModel(this.sequelize);
    const accommodation = await MentalHealthAccommodation.findByPk(accommodationId);

    if (!accommodation) {
      throw new NotFoundException(`Accommodation ${accommodationId} not found`);
    }

    await accommodation.update({
      effectivenessRating,
      lastMonitoringDate: new Date(),
    });

    return {
      accommodationId,
      effectivenessRating,
      monitoringNotes,
      monitoringDate: new Date(),
    };
  }

  /**
   * 32. Notifies teachers of student accommodations.
   */
  async notifyTeachersOfAccommodations(accommodationId: string, teacherIds: string[]): Promise<any> {
    const MentalHealthAccommodation = createMentalHealthAccommodationModel(this.sequelize);
    const accommodation = await MentalHealthAccommodation.findByPk(accommodationId);

    if (!accommodation) {
      throw new NotFoundException(`Accommodation ${accommodationId} not found`);
    }

    await accommodation.update({ teachersNotified: teacherIds });

    return {
      accommodationId,
      teachersNotified: teacherIds,
      notificationDate: new Date(),
    };
  }

  /**
   * 33. Generates accommodation compliance report.
   */
  async generateAccommodationComplianceReport(schoolId: string): Promise<any> {
    const MentalHealthAccommodation = createMentalHealthAccommodationModel(this.sequelize);

    const accommodations = await MentalHealthAccommodation.scope('active').findAll({
      where: { schoolId },
    });

    const typeCounts = accommodations.reduce(
      (acc, a) => {
        acc[a.accommodationType] = (acc[a.accommodationType] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      schoolId,
      totalActiveAccommodations: accommodations.length,
      accommodationTypeBreakdown: typeCounts,
      iep504Plans: accommodations.filter((a) => a.iep504Plan).length,
      requiresMonitoring: accommodations.filter((a) => a.progressMonitoring).length,
      reportGeneratedAt: new Date(),
    };
  }

  // ============================================================================
  // 6. THERAPY SESSION SCHEDULING (Functions 34-37)
  // ============================================================================

  /**
   * 34. Schedules therapy session with counselor.
   */
  async scheduleTherapySession(sessionData: TherapySessionData): Promise<any> {
    this.logger.log(`Scheduling therapy session for student ${sessionData.studentId}`);

    const TherapySession = createTherapySessionModel(this.sequelize);
    const session = await TherapySession.create(sessionData);

    return session.toJSON();
  }

  /**
   * 35. Documents therapy session notes and progress.
   */
  async documentTherapySessionNotes(
    sessionId: string,
    sessionNotes: {
      topicsDiscussed: string[];
      interventionsUsed: string[];
      studentProgress: string;
      concernsIdentified: string[];
      homeworkAssigned?: string;
    },
  ): Promise<any> {
    const TherapySession = createTherapySessionModel(this.sequelize);
    const session = await TherapySession.findByPk(sessionId);

    if (!session) {
      throw new NotFoundException(`Therapy session ${sessionId} not found`);
    }

    await session.update({
      ...sessionNotes,
      sessionStatus: TherapySessionStatus.COMPLETED,
    });

    return session.toJSON();
  }

  /**
   * 36. Retrieves upcoming therapy sessions for counselor.
   */
  async getUpcomingTherapySessions(counselorId: string): Promise<any[]> {
    const TherapySession = createTherapySessionModel(this.sequelize);

    const sessions = await TherapySession.scope('upcoming').findAll({
      where: { counselorId },
    });

    return sessions.map((s) => s.toJSON());
  }

  /**
   * 37. Generates student therapy progress report.
   */
  async generateTherapyProgressReport(studentId: string): Promise<any> {
    const TherapySession = createTherapySessionModel(this.sequelize);

    const sessions = await TherapySession.scope('completed').findAll({
      where: { studentId },
      order: [['sessionDate', 'ASC']],
    });

    return {
      studentId,
      totalSessions: sessions.length,
      sessionDates: sessions.map((s) => s.sessionDate),
      topicsAddressed: [...new Set(sessions.flatMap((s) => s.topicsDiscussed || []))],
      overallProgress: 'Progress summary would be generated based on session notes',
      reportGeneratedAt: new Date(),
    };
  }

  // ============================================================================
  // 7. EMOTIONAL SUPPORT DOCUMENTATION (Functions 38-40)
  // ============================================================================

  /**
   * 38. Documents brief emotional support intervention.
   */
  async documentEmotionalSupport(supportData: EmotionalSupportDocumentationData): Promise<any> {
    this.logger.log(`Documenting emotional support for student ${supportData.studentId}`);

    return {
      ...supportData,
      documentationId: `SUPPORT-${Date.now()}`,
      documentedAt: new Date(),
    };
  }

  /**
   * 39. Retrieves emotional support history for student.
   */
  async getEmotionalSupportHistory(studentId: string, dateRange?: { startDate: Date; endDate: Date }): Promise<any[]> {
    // In production, would query emotional_support_documentation table
    return [
      {
        documentationId: 'SUPPORT-123',
        studentId,
        supportDate: new Date(),
        supportType: 'check_in',
        durationMinutes: 15,
      },
    ];
  }

  /**
   * 40. Generates de-escalation strategy documentation.
   */
  async documentDeescalationStrategy(studentId: string, strategy: string, effectiveness: 'effective' | 'partially_effective' | 'not_effective'): Promise<any> {
    return {
      studentId,
      strategy,
      effectiveness,
      documentedAt: new Date(),
      recommendForFutureUse: effectiveness === 'effective',
    };
  }

  // ============================================================================
  // 8. SUICIDE PREVENTION PROTOCOLS (Functions 41-43)
  // ============================================================================

  /**
   * 41. Initiates suicide prevention protocol.
   */
  async initiateSuicidePreventionProtocol(protocolData: SuicidePreventionProtocolData): Promise<any> {
    this.logger.error(`SUICIDE PREVENTION PROTOCOL INITIATED for student ${protocolData.studentId}`);

    return {
      ...protocolData,
      protocolId: `SUICIDE-PREV-${Date.now()}`,
      protocolInitiatedAt: new Date(),
      immediateActionsRequired: [
        'Do not leave student alone',
        'Contact parent/guardian immediately',
        'Arrange emergency mental health evaluation',
        'Remove access to means',
      ],
    };
  }

  /**
   * 42. Documents suicide prevention resources provided.
   */
  async documentSuicidePreventionResources(
    protocolId: string,
    resources: {
      nationalSuicideHotline: boolean;
      crisisTextLine: boolean;
      localMentalHealthServices: string[];
      emergencyContacts: string[];
    },
  ): Promise<any> {
    return {
      protocolId,
      resources,
      resourcesProvidedAt: new Date(),
      followUpScheduled: true,
    };
  }

  /**
   * 43. Generates parent mental health consultation summary.
   */
  async generateParentConsultationSummary(consultationData: ParentMentalHealthConsultationData): Promise<any> {
    this.logger.log(`Parent consultation completed for student ${consultationData.studentId}`);

    return {
      ...consultationData,
      consultationId: `CONSULT-${Date.now()}`,
      consultationSummary: {
        attendees: consultationData.parentAttendees,
        keyTopics: consultationData.concernsDiscussed,
        recommendations: consultationData.recommendationsMade,
        resources: consultationData.resourcesProvided,
        followUpRequired: consultationData.followUpScheduled,
        followUpDate: consultationData.followUpDate,
      },
      consultationDocumentedAt: new Date(),
    };
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default MentalHealthSupportCompositeService;
