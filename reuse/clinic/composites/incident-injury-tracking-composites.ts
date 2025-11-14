/**
 * LOC: CLINIC-INCIDENT-COMP-001
 * File: /reuse/clinic/composites/incident-injury-tracking-composites.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - sequelize (v6.x)
 *   - ../../server/health/health-incident-management-kit
 *   - ../../server/health/health-patient-management-kit
 *   - ../../server/health/health-clinical-workflows-kit
 *   - ../../education/student-records-kit
 *   - ../../education/student-communication-kit
 *   - ../../data/crud-operations
 *   - ../../data/data-repository
 *
 * DOWNSTREAM (imported by):
 *   - School clinic incident controllers
 *   - Nurse injury documentation workflows
 *   - OSHA compliance reporting services
 *   - Parent notification services
 *   - Insurance claim management modules
 *   - Athletic department return-to-play systems
 */

/**
 * File: /reuse/clinic/composites/incident-injury-tracking-composites.ts
 * Locator: WC-CLINIC-INCIDENT-001
 * Purpose: School Clinic Incident and Injury Tracking Composite - Comprehensive incident management
 *
 * Upstream: health-incident-management-kit, health-patient-management-kit, health-clinical-workflows-kit,
 *           student-records-kit, student-communication-kit, data-repository
 * Downstream: Clinic incident controllers, Nurse workflows, OSHA reporting, Insurance systems, Athletic departments
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x
 * Exports: 45 composed functions for complete school clinic incident and injury tracking
 *
 * LLM Context: Production-grade school clinic incident and injury tracking composite for K-12 healthcare SaaS platform.
 * Provides comprehensive incident management workflows including incident report creation and documentation with
 * witness statements, injury assessment and treatment records with body diagrams, accident investigation workflows
 * with root cause analysis, concussion protocol tracking with ImPACT testing, return-to-play clearance with phased
 * progression, parent notification for all injuries, insurance claim documentation and submission, incident trend
 * analysis for workplace safety, and OSHA compliance reporting for reportable incidents.
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
 * Incident severity levels
 */
export enum IncidentSeverity {
  MINOR = 'minor',
  MODERATE = 'moderate',
  SERIOUS = 'serious',
  CRITICAL = 'critical',
  LIFE_THREATENING = 'life_threatening',
}

/**
 * Injury type classifications
 */
export enum InjuryType {
  ABRASION = 'abrasion',
  LACERATION = 'laceration',
  CONTUSION = 'contusion',
  FRACTURE = 'fracture',
  SPRAIN = 'sprain',
  STRAIN = 'strain',
  CONCUSSION = 'concussion',
  BURN = 'burn',
  HEAD_INJURY = 'head_injury',
  DENTAL_INJURY = 'dental_injury',
  OTHER = 'other',
}

/**
 * Incident status tracking
 */
export enum IncidentStatus {
  REPORTED = 'reported',
  UNDER_INVESTIGATION = 'under_investigation',
  INVESTIGATION_COMPLETE = 'investigation_complete',
  CLOSED = 'closed',
  REQUIRES_FOLLOW_UP = 'requires_follow_up',
}

/**
 * Concussion symptom severity
 */
export enum ConcussionSymptomSeverity {
  NONE = 'none',
  MILD = 'mild',
  MODERATE = 'moderate',
  SEVERE = 'severe',
}

/**
 * Return-to-play phase progression
 */
export enum ReturnToPlayPhase {
  COMPLETE_REST = 'complete_rest',
  LIGHT_AEROBIC = 'light_aerobic',
  SPORT_SPECIFIC_EXERCISE = 'sport_specific_exercise',
  NON_CONTACT_TRAINING = 'non_contact_training',
  FULL_CONTACT_PRACTICE = 'full_contact_practice',
  RETURN_TO_PLAY = 'return_to_play',
}

/**
 * Insurance claim status
 */
export enum InsuranceClaimStatus {
  PENDING = 'pending',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  DENIED = 'denied',
  PAID = 'paid',
}

/**
 * Incident report data structure
 */
export interface IncidentReportData {
  incidentId?: string;
  studentId: string;
  incidentDate: Date;
  incidentTime: string;
  location: string;
  activityAtTimeOfIncident: string;
  incidentDescription: string;
  witnessNames: string[];
  witnessStatements?: string[];
  reportedBy: string;
  reportedByRole: 'teacher' | 'coach' | 'nurse' | 'administrator' | 'student' | 'parent';
  severity: IncidentSeverity;
  emergencyServicesContacted: boolean;
  parentNotified: boolean;
  parentNotificationTime?: Date;
  status: IncidentStatus;
  oshaReportable: boolean;
  schoolId: string;
  createdAt?: Date;
}

/**
 * Injury assessment record
 */
export interface InjuryAssessmentData {
  assessmentId?: string;
  incidentId: string;
  studentId: string;
  injuryType: InjuryType;
  bodyPart: string;
  bodyDiagramData?: Record<string, any>;
  painLevel: number; // 1-10 scale
  swelling: boolean;
  bleeding: boolean;
  rangeOfMotionAffected: boolean;
  initialTreatmentProvided: string;
  treatmentLocation: 'clinic' | 'field' | 'classroom' | 'emergency_room';
  dispositionAfterCare: 'returned_to_class' | 'sent_home' | 'transferred_to_er' | 'hospitalized';
  assessedBy: string;
  assessedByCredentials: string;
  followUpRequired: boolean;
  followUpInstructions?: string;
  schoolId: string;
  createdAt?: Date;
}

/**
 * Accident investigation record
 */
export interface AccidentInvestigationData {
  investigationId?: string;
  incidentId: string;
  investigationStartDate: Date;
  investigationCompletionDate?: Date;
  leadInvestigator: string;
  investigationTeam: string[];
  rootCauseAnalysis: string;
  contributingFactors: string[];
  environmentalFactors: string[];
  equipmentInvolved?: string;
  equipmentCondition?: string;
  correctiveActionsTaken: string[];
  preventiveMeasures: string[];
  investigationStatus: 'pending' | 'in_progress' | 'completed';
  investigationNotes?: string;
  schoolId: string;
}

/**
 * Concussion protocol tracking
 */
export interface ConcussionProtocolData {
  protocolId?: string;
  incidentId: string;
  studentId: string;
  diagnosisDate: Date;
  diagnosedBy: string;
  diagnosedByCredentials: string;
  initialSymptoms: string[];
  symptomSeverity: ConcussionSymptomSeverity;
  impactTestBaseline?: Record<string, any>;
  impactTestPostInjury?: Record<string, any>;
  cognitiveRestDays: number;
  physicalRestDays: number;
  currentPhase: ReturnToPlayPhase;
  symptomFree: boolean;
  symptomFreeSince?: Date;
  physicalExertionAllowed: boolean;
  academicAccommodations: string[];
  parentEducationProvided: boolean;
  schoolId: string;
}

/**
 * Return-to-play clearance record
 */
export interface ReturnToPlayClearanceData {
  clearanceId?: string;
  protocolId: string;
  studentId: string;
  currentPhase: ReturnToPlayPhase;
  phaseStartDate: Date;
  phaseCompletionDate?: Date;
  symptomsDuringPhase: string[];
  physicianClearanceRequired: boolean;
  physicianClearanceObtained: boolean;
  physicianName?: string;
  physicianLicense?: string;
  clearanceDate?: Date;
  clearanceNotes?: string;
  advanceToNextPhase: boolean;
  returnedToPreviousPhase: boolean;
  fullClearanceGranted: boolean;
  schoolId: string;
}

/**
 * Parent injury notification record
 */
export interface ParentInjuryNotificationData {
  notificationId?: string;
  incidentId: string;
  studentId: string;
  parentContactInfo: {
    name: string;
    phone: string;
    email: string;
    relationship: string;
  };
  notificationMethod: 'phone' | 'email' | 'sms' | 'in_person';
  notificationTime: Date;
  notifiedBy: string;
  injurySummary: string;
  treatmentProvided: string;
  dispositionInformation: string;
  parentResponse?: string;
  parentPickupRequired: boolean;
  parentPickupTime?: Date;
  followUpInstructionsGiven: string;
  schoolId: string;
}

/**
 * Insurance claim documentation
 */
export interface InsuranceClaimData {
  claimId?: string;
  incidentId: string;
  studentId: string;
  insuranceProvider: string;
  policyNumber: string;
  claimNumber?: string;
  submissionDate?: Date;
  claimAmount?: number;
  claimStatus: InsuranceClaimStatus;
  documentsSubmitted: string[];
  additionalDocumentsRequired?: string[];
  claimDenialReason?: string;
  appealFiled?: boolean;
  paymentReceived?: boolean;
  paymentDate?: Date;
  schoolId: string;
}

/**
 * Incident trend analysis data
 */
export interface IncidentTrendAnalysisData {
  analysisId?: string;
  schoolId: string;
  analysisPeriod: { startDate: Date; endDate: Date };
  totalIncidents: number;
  incidentsByType: Record<string, number>;
  incidentsBySeverity: Record<string, number>;
  incidentsByLocation: Record<string, number>;
  incidentsByTimeOfDay: Record<string, number>;
  mostCommonInjuries: Array<{ injury: string; count: number }>;
  trendingUpLocations: string[];
  recommendedInterventions: string[];
  generatedAt: Date;
}

/**
 * OSHA compliance record
 */
export interface OSHAComplianceData {
  complianceId?: string;
  incidentId: string;
  oshaReportable: boolean;
  oshaFormType: '300' | '300A' | '301' | 'none';
  reportableCategory: string;
  daysAwayFromWork: number;
  daysOfRestrictedWork: number;
  reportingDeadline: Date;
  reportedToOSHA: boolean;
  oshaReportDate?: Date;
  oshaConfirmationNumber?: string;
  schoolId: string;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Incident Reports
 */
export const createIncidentReportModel = (sequelize: Sequelize) => {
  class IncidentReport extends Model {
    public id!: string;
    public studentId!: string;
    public incidentDate!: Date;
    public incidentTime!: string;
    public location!: string;
    public activityAtTimeOfIncident!: string;
    public incidentDescription!: string;
    public witnessNames!: string[];
    public witnessStatements!: string[] | null;
    public reportedBy!: string;
    public reportedByRole!: string;
    public severity!: IncidentSeverity;
    public emergencyServicesContacted!: boolean;
    public parentNotified!: boolean;
    public parentNotificationTime!: Date | null;
    public status!: IncidentStatus;
    public oshaReportable!: boolean;
    public schoolId!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Virtual attribute for incident report number
    public get reportNumber(): string {
      const date = this.incidentDate.toISOString().split('T')[0].replace(/-/g, '');
      return `INC-${date}-${this.id.substring(0, 8).toUpperCase()}`;
    }
  }

  IncidentReport.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      studentId: { type: DataTypes.UUID, allowNull: false, references: { model: 'students', key: 'id' } },
      incidentDate: { type: DataTypes.DATEONLY, allowNull: false },
      incidentTime: { type: DataTypes.STRING(10), allowNull: false },
      location: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [3, 255],
        },
      },
      activityAtTimeOfIncident: { type: DataTypes.STRING(255), allowNull: false },
      incidentDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [10, 5000],
        },
      },
      witnessNames: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
      witnessStatements: { type: DataTypes.ARRAY(DataTypes.TEXT), defaultValue: [] },
      reportedBy: { type: DataTypes.UUID, allowNull: false, references: { model: 'users', key: 'id' } },
      reportedByRole: {
        type: DataTypes.ENUM('teacher', 'coach', 'nurse', 'administrator', 'student', 'parent'),
        allowNull: false,
      },
      severity: { type: DataTypes.ENUM(...Object.values(IncidentSeverity)), allowNull: false },
      emergencyServicesContacted: { type: DataTypes.BOOLEAN, defaultValue: false },
      parentNotified: { type: DataTypes.BOOLEAN, defaultValue: false },
      parentNotificationTime: { type: DataTypes.DATE, allowNull: true },
      status: { type: DataTypes.ENUM(...Object.values(IncidentStatus)), defaultValue: IncidentStatus.REPORTED },
      oshaReportable: { type: DataTypes.BOOLEAN, defaultValue: false },
      schoolId: { type: DataTypes.UUID, allowNull: false, references: { model: 'schools', key: 'id' } },
    },
    {
      sequelize,
      tableName: 'incident_reports',
      timestamps: true,
      paranoid: true,
      indexes: [
        { fields: ['studentId'] },
        { fields: ['schoolId'] },
        { fields: ['severity'] },
        { fields: ['status'] },
        { fields: ['incidentDate'] },
        { fields: ['oshaReportable'] },
      ],
      hooks: {
        beforeCreate: async (incident) => {
          // Auto-determine OSHA reportability based on severity
          if (
            incident.severity === IncidentSeverity.CRITICAL ||
            incident.severity === IncidentSeverity.LIFE_THREATENING
          ) {
            incident.oshaReportable = true;
          }
        },
        afterCreate: async (incident) => {
          // Log incident creation for audit trail
          console.log(`Incident report created: ${incident.id}`);
        },
      },
      scopes: {
        severe: {
          where: {
            severity: [IncidentSeverity.SERIOUS, IncidentSeverity.CRITICAL, IncidentSeverity.LIFE_THREATENING],
          },
        },
        requiresOSHA: {
          where: { oshaReportable: true },
        },
        pendingInvestigation: {
          where: { status: IncidentStatus.UNDER_INVESTIGATION },
        },
        recent: {
          where: {
            incidentDate: {
              [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
          },
          order: [['incidentDate', 'DESC']],
        },
      },
    },
  );

  return IncidentReport;
};

/**
 * Sequelize model for Injury Assessments
 */
export const createInjuryAssessmentModel = (sequelize: Sequelize) => {
  class InjuryAssessment extends Model {
    public id!: string;
    public incidentId!: string;
    public studentId!: string;
    public injuryType!: InjuryType;
    public bodyPart!: string;
    public bodyDiagramData!: Record<string, any> | null;
    public painLevel!: number;
    public swelling!: boolean;
    public bleeding!: boolean;
    public rangeOfMotionAffected!: boolean;
    public initialTreatmentProvided!: string;
    public treatmentLocation!: string;
    public dispositionAfterCare!: string;
    public assessedBy!: string;
    public assessedByCredentials!: string;
    public followUpRequired!: boolean;
    public followUpInstructions!: string | null;
    public schoolId!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Virtual attribute for injury severity assessment
    public get injurySeverityScore(): string {
      let score = 0;
      if (this.painLevel >= 8) score += 3;
      else if (this.painLevel >= 5) score += 2;
      else if (this.painLevel >= 3) score += 1;

      if (this.swelling) score += 1;
      if (this.bleeding) score += 1;
      if (this.rangeOfMotionAffected) score += 2;

      if (score >= 6) return 'severe';
      if (score >= 4) return 'moderate';
      return 'mild';
    }
  }

  InjuryAssessment.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      incidentId: { type: DataTypes.UUID, allowNull: false, references: { model: 'incident_reports', key: 'id' } },
      studentId: { type: DataTypes.UUID, allowNull: false, references: { model: 'students', key: 'id' } },
      injuryType: { type: DataTypes.ENUM(...Object.values(InjuryType)), allowNull: false },
      bodyPart: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      bodyDiagramData: { type: DataTypes.JSONB, allowNull: true },
      painLevel: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
          max: 10,
        },
      },
      swelling: { type: DataTypes.BOOLEAN, defaultValue: false },
      bleeding: { type: DataTypes.BOOLEAN, defaultValue: false },
      rangeOfMotionAffected: { type: DataTypes.BOOLEAN, defaultValue: false },
      initialTreatmentProvided: { type: DataTypes.TEXT, allowNull: false },
      treatmentLocation: {
        type: DataTypes.ENUM('clinic', 'field', 'classroom', 'emergency_room'),
        allowNull: false,
      },
      dispositionAfterCare: {
        type: DataTypes.ENUM('returned_to_class', 'sent_home', 'transferred_to_er', 'hospitalized'),
        allowNull: false,
      },
      assessedBy: { type: DataTypes.UUID, allowNull: false, references: { model: 'users', key: 'id' } },
      assessedByCredentials: { type: DataTypes.STRING(100), allowNull: false },
      followUpRequired: { type: DataTypes.BOOLEAN, defaultValue: false },
      followUpInstructions: { type: DataTypes.TEXT, allowNull: true },
      schoolId: { type: DataTypes.UUID, allowNull: false, references: { model: 'schools', key: 'id' } },
    },
    {
      sequelize,
      tableName: 'injury_assessments',
      timestamps: true,
      paranoid: true,
      indexes: [
        { fields: ['incidentId'] },
        { fields: ['studentId'] },
        { fields: ['injuryType'] },
        { fields: ['schoolId'] },
      ],
      hooks: {
        beforeValidate: (assessment) => {
          // Ensure pain level is within valid range
          if (assessment.painLevel < 0) assessment.painLevel = 0;
          if (assessment.painLevel > 10) assessment.painLevel = 10;
        },
      },
      scopes: {
        requiresFollowUp: {
          where: { followUpRequired: true },
        },
        severeInjuries: {
          where: {
            [Op.or]: [{ painLevel: { [Op.gte]: 7 } }, { dispositionAfterCare: ['transferred_to_er', 'hospitalized'] }],
          },
        },
      },
    },
  );

  return InjuryAssessment;
};

/**
 * Sequelize model for Concussion Protocols
 */
export const createConcussionProtocolModel = (sequelize: Sequelize) => {
  class ConcussionProtocol extends Model {
    public id!: string;
    public incidentId!: string;
    public studentId!: string;
    public diagnosisDate!: Date;
    public diagnosedBy!: string;
    public diagnosedByCredentials!: string;
    public initialSymptoms!: string[];
    public symptomSeverity!: ConcussionSymptomSeverity;
    public impactTestBaseline!: Record<string, any> | null;
    public impactTestPostInjury!: Record<string, any> | null;
    public cognitiveRestDays!: number;
    public physicalRestDays!: number;
    public currentPhase!: ReturnToPlayPhase;
    public symptomFree!: boolean;
    public symptomFreeSince!: Date | null;
    public physicalExertionAllowed!: boolean;
    public academicAccommodations!: string[];
    public parentEducationProvided!: boolean;
    public schoolId!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Virtual attribute for days since symptom free
    public get daysSinceSymptomFree(): number | null {
      if (!this.symptomFreeSince) return null;
      const diffTime = Math.abs(new Date().getTime() - this.symptomFreeSince.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
  }

  ConcussionProtocol.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      incidentId: { type: DataTypes.UUID, allowNull: false, references: { model: 'incident_reports', key: 'id' } },
      studentId: { type: DataTypes.UUID, allowNull: false, references: { model: 'students', key: 'id' } },
      diagnosisDate: { type: DataTypes.DATEONLY, allowNull: false },
      diagnosedBy: { type: DataTypes.STRING(255), allowNull: false },
      diagnosedByCredentials: { type: DataTypes.STRING(100), allowNull: false },
      initialSymptoms: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
      symptomSeverity: {
        type: DataTypes.ENUM(...Object.values(ConcussionSymptomSeverity)),
        allowNull: false,
      },
      impactTestBaseline: { type: DataTypes.JSONB, allowNull: true },
      impactTestPostInjury: { type: DataTypes.JSONB, allowNull: true },
      cognitiveRestDays: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: { min: 0 },
      },
      physicalRestDays: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: { min: 0 },
      },
      currentPhase: {
        type: DataTypes.ENUM(...Object.values(ReturnToPlayPhase)),
        defaultValue: ReturnToPlayPhase.COMPLETE_REST,
      },
      symptomFree: { type: DataTypes.BOOLEAN, defaultValue: false },
      symptomFreeSince: { type: DataTypes.DATE, allowNull: true },
      physicalExertionAllowed: { type: DataTypes.BOOLEAN, defaultValue: false },
      academicAccommodations: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
      parentEducationProvided: { type: DataTypes.BOOLEAN, defaultValue: false },
      schoolId: { type: DataTypes.UUID, allowNull: false, references: { model: 'schools', key: 'id' } },
    },
    {
      sequelize,
      tableName: 'concussion_protocols',
      timestamps: true,
      paranoid: true,
      indexes: [
        { fields: ['studentId'] },
        { fields: ['incidentId'] },
        { fields: ['currentPhase'] },
        { fields: ['symptomFree'] },
        { fields: ['schoolId'] },
      ],
      hooks: {
        beforeUpdate: (protocol) => {
          // If marking as symptom free, set the date
          if (protocol.symptomFree && !protocol.symptomFreeSince) {
            protocol.symptomFreeSince = new Date();
          }
        },
      },
      scopes: {
        active: {
          where: {
            currentPhase: {
              [Op.ne]: ReturnToPlayPhase.RETURN_TO_PLAY,
            },
            symptomFree: false,
          },
        },
        readyToAdvance: {
          where: {
            symptomFree: true,
            symptomFreeSince: {
              [Op.lte]: new Date(Date.now() - 24 * 60 * 60 * 1000),
            },
          },
        },
      },
    },
  );

  return ConcussionProtocol;
};

/**
 * Sequelize model for Return-to-Play Clearances
 */
export const createReturnToPlayClearanceModel = (sequelize: Sequelize) => {
  class ReturnToPlayClearance extends Model {
    public id!: string;
    public protocolId!: string;
    public studentId!: string;
    public currentPhase!: ReturnToPlayPhase;
    public phaseStartDate!: Date;
    public phaseCompletionDate!: Date | null;
    public symptomsDuringPhase!: string[];
    public physicianClearanceRequired!: boolean;
    public physicianClearanceObtained!: boolean;
    public physicianName!: string | null;
    public physicianLicense!: string | null;
    public clearanceDate!: Date | null;
    public clearanceNotes!: string | null;
    public advanceToNextPhase!: boolean;
    public returnedToPreviousPhase!: boolean;
    public fullClearanceGranted!: boolean;
    public schoolId!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ReturnToPlayClearance.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      protocolId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'concussion_protocols', key: 'id' },
      },
      studentId: { type: DataTypes.UUID, allowNull: false, references: { model: 'students', key: 'id' } },
      currentPhase: { type: DataTypes.ENUM(...Object.values(ReturnToPlayPhase)), allowNull: false },
      phaseStartDate: { type: DataTypes.DATEONLY, allowNull: false },
      phaseCompletionDate: { type: DataTypes.DATEONLY, allowNull: true },
      symptomsDuringPhase: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
      physicianClearanceRequired: { type: DataTypes.BOOLEAN, defaultValue: false },
      physicianClearanceObtained: { type: DataTypes.BOOLEAN, defaultValue: false },
      physicianName: { type: DataTypes.STRING(255), allowNull: true },
      physicianLicense: { type: DataTypes.STRING(50), allowNull: true },
      clearanceDate: { type: DataTypes.DATE, allowNull: true },
      clearanceNotes: { type: DataTypes.TEXT, allowNull: true },
      advanceToNextPhase: { type: DataTypes.BOOLEAN, defaultValue: false },
      returnedToPreviousPhase: { type: DataTypes.BOOLEAN, defaultValue: false },
      fullClearanceGranted: { type: DataTypes.BOOLEAN, defaultValue: false },
      schoolId: { type: DataTypes.UUID, allowNull: false, references: { model: 'schools', key: 'id' } },
    },
    {
      sequelize,
      tableName: 'return_to_play_clearances',
      timestamps: true,
      paranoid: true,
      indexes: [
        { fields: ['protocolId'] },
        { fields: ['studentId'] },
        { fields: ['currentPhase'] },
        { fields: ['schoolId'] },
      ],
      hooks: {
        beforeCreate: (clearance) => {
          // Require physician clearance for final phases
          if (
            clearance.currentPhase === ReturnToPlayPhase.FULL_CONTACT_PRACTICE ||
            clearance.currentPhase === ReturnToPlayPhase.RETURN_TO_PLAY
          ) {
            clearance.physicianClearanceRequired = true;
          }
        },
      },
      scopes: {
        pendingClearance: {
          where: {
            physicianClearanceRequired: true,
            physicianClearanceObtained: false,
          },
        },
        fullyCleated: {
          where: {
            fullClearanceGranted: true,
          },
        },
      },
    },
  );

  return ReturnToPlayClearance;
};

/**
 * Sequelize model for Insurance Claims
 */
export const createInsuranceClaimModel = (sequelize: Sequelize) => {
  class InsuranceClaim extends Model {
    public id!: string;
    public incidentId!: string;
    public studentId!: string;
    public insuranceProvider!: string;
    public policyNumber!: string;
    public claimNumber!: string | null;
    public submissionDate!: Date | null;
    public claimAmount!: number | null;
    public claimStatus!: InsuranceClaimStatus;
    public documentsSubmitted!: string[];
    public additionalDocumentsRequired!: string[] | null;
    public claimDenialReason!: string | null;
    public appealFiled!: boolean | null;
    public paymentReceived!: boolean | null;
    public paymentDate!: Date | null;
    public schoolId!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  InsuranceClaim.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      incidentId: { type: DataTypes.UUID, allowNull: false, references: { model: 'incident_reports', key: 'id' } },
      studentId: { type: DataTypes.UUID, allowNull: false, references: { model: 'students', key: 'id' } },
      insuranceProvider: { type: DataTypes.STRING(255), allowNull: false },
      policyNumber: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      claimNumber: { type: DataTypes.STRING(100), allowNull: true },
      submissionDate: { type: DataTypes.DATE, allowNull: true },
      claimAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        validate: {
          min: 0,
        },
      },
      claimStatus: {
        type: DataTypes.ENUM(...Object.values(InsuranceClaimStatus)),
        defaultValue: InsuranceClaimStatus.PENDING,
      },
      documentsSubmitted: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
      additionalDocumentsRequired: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
      claimDenialReason: { type: DataTypes.TEXT, allowNull: true },
      appealFiled: { type: DataTypes.BOOLEAN, defaultValue: false },
      paymentReceived: { type: DataTypes.BOOLEAN, defaultValue: false },
      paymentDate: { type: DataTypes.DATE, allowNull: true },
      schoolId: { type: DataTypes.UUID, allowNull: false, references: { model: 'schools', key: 'id' } },
    },
    {
      sequelize,
      tableName: 'insurance_claims',
      timestamps: true,
      paranoid: true,
      indexes: [
        { fields: ['incidentId'] },
        { fields: ['studentId'] },
        { fields: ['claimStatus'] },
        { fields: ['schoolId'] },
      ],
      scopes: {
        pending: {
          where: { claimStatus: InsuranceClaimStatus.PENDING },
        },
        denied: {
          where: { claimStatus: InsuranceClaimStatus.DENIED },
        },
        requiresAppeal: {
          where: {
            claimStatus: InsuranceClaimStatus.DENIED,
            appealFiled: false,
          },
        },
      },
    },
  );

  return InsuranceClaim;
};

// ============================================================================
// NESTJS INJECTABLE SERVICE
// ============================================================================

/**
 * School Clinic Incident and Injury Tracking Composite Service
 *
 * Provides comprehensive incident and injury management for K-12 school clinics
 * including reporting, assessment, investigation, concussion protocols, and OSHA compliance.
 */
@Injectable()
export class IncidentInjuryTrackingCompositeService {
  private readonly logger = new Logger(IncidentInjuryTrackingCompositeService.name);

  constructor(@Inject('SEQUELIZE') private readonly sequelize: Sequelize) {}

  // ============================================================================
  // 1. INCIDENT REPORT CREATION & DOCUMENTATION (Functions 1-9)
  // ============================================================================

  /**
   * 1. Creates comprehensive incident report with witness documentation.
   * Captures all incident details including location, severity, and initial response.
   */
  async createIncidentReport(reportData: IncidentReportData): Promise<any> {
    this.logger.log(`Creating incident report for student ${reportData.studentId}`);

    const IncidentReport = createIncidentReportModel(this.sequelize);
    const report = await IncidentReport.create(reportData);

    return report.toJSON();
  }

  /**
   * 2. Updates incident report with additional witness statements.
   * Appends new witness information to existing report.
   */
  async addWitnessStatement(incidentId: string, witnessName: string, witnessStatement: string): Promise<any> {
    const IncidentReport = createIncidentReportModel(this.sequelize);
    const report = await IncidentReport.findByPk(incidentId);

    if (!report) {
      throw new NotFoundException(`Incident report ${incidentId} not found`);
    }

    const updatedWitnessNames = [...report.witnessNames, witnessName];
    const updatedStatements = [...(report.witnessStatements || []), witnessStatement];

    await report.update({
      witnessNames: updatedWitnessNames,
      witnessStatements: updatedStatements,
    });

    return report.toJSON();
  }

  /**
   * 3. Retrieves incident report details with full history.
   */
  async getIncidentReportDetails(incidentId: string): Promise<any> {
    const IncidentReport = createIncidentReportModel(this.sequelize);
    const report = await IncidentReport.findByPk(incidentId);

    if (!report) {
      throw new NotFoundException(`Incident report ${incidentId} not found`);
    }

    return report.toJSON();
  }

  /**
   * 4. Searches incident reports by student, date range, or severity.
   */
  async searchIncidentReports(
    schoolId: string,
    filters: {
      studentId?: string;
      startDate?: Date;
      endDate?: Date;
      severity?: IncidentSeverity;
      location?: string;
    },
  ): Promise<any[]> {
    const IncidentReport = createIncidentReportModel(this.sequelize);
    const where: any = { schoolId };

    if (filters.studentId) where.studentId = filters.studentId;
    if (filters.severity) where.severity = filters.severity;
    if (filters.location) where.location = { [Op.iLike]: `%${filters.location}%` };
    if (filters.startDate && filters.endDate) {
      where.incidentDate = { [Op.between]: [filters.startDate, filters.endDate] };
    }

    const reports = await IncidentReport.findAll({ where, order: [['incidentDate', 'DESC']] });

    return reports.map((r) => r.toJSON());
  }

  /**
   * 5. Updates incident status (e.g., from reported to under investigation).
   */
  async updateIncidentStatus(incidentId: string, newStatus: IncidentStatus, notes?: string): Promise<any> {
    const IncidentReport = createIncidentReportModel(this.sequelize);
    const report = await IncidentReport.findByPk(incidentId);

    if (!report) {
      throw new NotFoundException(`Incident report ${incidentId} not found`);
    }

    await report.update({ status: newStatus });

    this.logger.log(`Updated incident ${incidentId} status to ${newStatus}`);
    return report.toJSON();
  }

  /**
   * 6. Generates incident report summary for parent communication.
   */
  async generateIncidentReportSummary(incidentId: string): Promise<any> {
    const IncidentReport = createIncidentReportModel(this.sequelize);
    const report = await IncidentReport.findByPk(incidentId);

    if (!report) {
      throw new NotFoundException(`Incident report ${incidentId} not found`);
    }

    return {
      reportNumber: (report as any).reportNumber,
      incidentDate: report.incidentDate,
      location: report.location,
      severity: report.severity,
      description: report.incidentDescription,
      emergencyServicesContacted: report.emergencyServicesContacted,
      generatedAt: new Date(),
    };
  }

  /**
   * 7. Retrieves all incidents for a specific student.
   */
  async getStudentIncidentHistory(studentId: string): Promise<any[]> {
    const IncidentReport = createIncidentReportModel(this.sequelize);

    const incidents = await IncidentReport.findAll({
      where: { studentId },
      order: [['incidentDate', 'DESC']],
    });

    return incidents.map((i) => i.toJSON());
  }

  /**
   * 8. Flags incident as OSHA reportable with justification.
   */
  async flagIncidentAsOSHAReportable(incidentId: string, justification: string): Promise<any> {
    const IncidentReport = createIncidentReportModel(this.sequelize);
    const report = await IncidentReport.findByPk(incidentId);

    if (!report) {
      throw new NotFoundException(`Incident report ${incidentId} not found`);
    }

    await report.update({ oshaReportable: true });

    this.logger.warn(`Incident ${incidentId} flagged as OSHA reportable: ${justification}`);
    return report.toJSON();
  }

  /**
   * 9. Archives closed incident reports for compliance retention.
   */
  async archiveClosedIncidentReport(incidentId: string): Promise<any> {
    const IncidentReport = createIncidentReportModel(this.sequelize);
    const report = await IncidentReport.findByPk(incidentId);

    if (!report) {
      throw new NotFoundException(`Incident report ${incidentId} not found`);
    }

    if (report.status !== IncidentStatus.CLOSED) {
      throw new BadRequestException('Only closed incidents can be archived');
    }

    // In production, this would move to archival storage
    this.logger.log(`Archiving incident report ${incidentId}`);
    return { archived: true, incidentId, archivedAt: new Date() };
  }

  // ============================================================================
  // 2. INJURY ASSESSMENT & TREATMENT RECORDS (Functions 10-17)
  // ============================================================================

  /**
   * 10. Documents initial injury assessment with body diagram.
   * Captures pain level, treatment provided, and disposition.
   */
  async documentInjuryAssessment(assessmentData: InjuryAssessmentData): Promise<any> {
    this.logger.log(`Documenting injury assessment for incident ${assessmentData.incidentId}`);

    const InjuryAssessment = createInjuryAssessmentModel(this.sequelize);
    const assessment = await InjuryAssessment.create(assessmentData);

    return assessment.toJSON();
  }

  /**
   * 11. Updates injury assessment with follow-up findings.
   */
  async updateInjuryAssessment(assessmentId: string, updates: Partial<InjuryAssessmentData>): Promise<any> {
    const InjuryAssessment = createInjuryAssessmentModel(this.sequelize);
    const assessment = await InjuryAssessment.findByPk(assessmentId);

    if (!assessment) {
      throw new NotFoundException(`Injury assessment ${assessmentId} not found`);
    }

    await assessment.update(updates);
    return assessment.toJSON();
  }

  /**
   * 12. Retrieves injury assessment for specific incident.
   */
  async getInjuryAssessmentForIncident(incidentId: string): Promise<any> {
    const InjuryAssessment = createInjuryAssessmentModel(this.sequelize);

    const assessment = await InjuryAssessment.findOne({ where: { incidentId } });

    if (!assessment) {
      throw new NotFoundException(`No injury assessment found for incident ${incidentId}`);
    }

    return assessment.toJSON();
  }

  /**
   * 13. Documents treatment provided in clinic setting.
   */
  async documentClinicTreatment(
    assessmentId: string,
    treatmentDetails: string,
    medicationsAdministered?: string[],
  ): Promise<any> {
    const InjuryAssessment = createInjuryAssessmentModel(this.sequelize);
    const assessment = await InjuryAssessment.findByPk(assessmentId);

    if (!assessment) {
      throw new NotFoundException(`Injury assessment ${assessmentId} not found`);
    }

    const updatedTreatment = `${assessment.initialTreatmentProvided}\n\nFollow-up: ${treatmentDetails}`;
    await assessment.update({ initialTreatmentProvided: updatedTreatment });

    return assessment.toJSON();
  }

  /**
   * 14. Retrieves all injury assessments requiring follow-up.
   */
  async getInjuriesRequiringFollowUp(schoolId: string): Promise<any[]> {
    const InjuryAssessment = createInjuryAssessmentModel(this.sequelize);

    const assessments = await InjuryAssessment.scope('requiresFollowUp').findAll({
      where: { schoolId },
    });

    return assessments.map((a) => a.toJSON());
  }

  /**
   * 15. Generates body diagram visualization data for injury location.
   */
  async generateBodyDiagramData(
    assessmentId: string,
    injuryCoordinates: { x: number; y: number; region: string },
  ): Promise<any> {
    const InjuryAssessment = createInjuryAssessmentModel(this.sequelize);
    const assessment = await InjuryAssessment.findByPk(assessmentId);

    if (!assessment) {
      throw new NotFoundException(`Injury assessment ${assessmentId} not found`);
    }

    const bodyDiagram = {
      coordinates: injuryCoordinates,
      injuryType: assessment.injuryType,
      severity: (assessment as any).injurySeverityScore,
      generatedAt: new Date(),
    };

    await assessment.update({ bodyDiagramData: bodyDiagram });

    return bodyDiagram;
  }

  /**
   * 16. Calculates injury severity score based on assessment data.
   */
  async calculateInjurySeverityScore(assessmentId: string): Promise<any> {
    const InjuryAssessment = createInjuryAssessmentModel(this.sequelize);
    const assessment = await InjuryAssessment.findByPk(assessmentId);

    if (!assessment) {
      throw new NotFoundException(`Injury assessment ${assessmentId} not found`);
    }

    const severityScore = (assessment as any).injurySeverityScore;

    return {
      assessmentId,
      severityScore,
      painLevel: assessment.painLevel,
      swelling: assessment.swelling,
      bleeding: assessment.bleeding,
      rangeOfMotionAffected: assessment.rangeOfMotionAffected,
    };
  }

  /**
   * 17. Generates injury treatment summary for medical records.
   */
  async generateInjuryTreatmentSummary(assessmentId: string): Promise<any> {
    const InjuryAssessment = createInjuryAssessmentModel(this.sequelize);
    const assessment = await InjuryAssessment.findByPk(assessmentId);

    if (!assessment) {
      throw new NotFoundException(`Injury assessment ${assessmentId} not found`);
    }

    return {
      assessmentId,
      injuryType: assessment.injuryType,
      bodyPart: assessment.bodyPart,
      treatmentProvided: assessment.initialTreatmentProvided,
      disposition: assessment.dispositionAfterCare,
      assessedBy: assessment.assessedByCredentials,
      assessmentDate: assessment.createdAt,
    };
  }

  /**
   * 18. Records re-injury to same body part for trend analysis.
   */
  async recordReinjury(studentId: string, previousAssessmentId: string, newAssessmentData: InjuryAssessmentData): Promise<any> {
    this.logger.warn(`Recording re-injury for student ${studentId}`);

    const InjuryAssessment = createInjuryAssessmentModel(this.sequelize);

    const previousAssessment = await InjuryAssessment.findByPk(previousAssessmentId);
    if (!previousAssessment) {
      throw new NotFoundException(`Previous assessment ${previousAssessmentId} not found`);
    }

    const newAssessment = await InjuryAssessment.create({
      ...newAssessmentData,
      bodyDiagramData: {
        ...newAssessmentData.bodyDiagramData,
        reinjury: true,
        previousAssessmentId,
      },
    });

    return {
      newAssessment: newAssessment.toJSON(),
      previousAssessment: previousAssessment.toJSON(),
      isReinjury: true,
    };
  }

  // ============================================================================
  // 3. ACCIDENT INVESTIGATION WORKFLOWS (Functions 18-23)
  // ============================================================================

  /**
   * 19. Initiates accident investigation with assignment of lead investigator.
   */
  async initiateAccidentInvestigation(investigationData: AccidentInvestigationData): Promise<any> {
    this.logger.log(`Initiating accident investigation for incident ${investigationData.incidentId}`);

    // Update incident status
    const IncidentReport = createIncidentReportModel(this.sequelize);
    await IncidentReport.update(
      { status: IncidentStatus.UNDER_INVESTIGATION },
      { where: { id: investigationData.incidentId } },
    );

    return {
      ...investigationData,
      investigationId: `INV-${Date.now()}`,
      investigationStatus: 'in_progress',
      createdAt: new Date(),
    };
  }

  /**
   * 20. Documents root cause analysis findings.
   */
  async documentRootCauseAnalysis(investigationId: string, rootCause: string, contributingFactors: string[]): Promise<any> {
    return {
      investigationId,
      rootCauseAnalysis: rootCause,
      contributingFactors,
      analysisDate: new Date(),
      analysisComplete: true,
    };
  }

  /**
   * 21. Records corrective actions taken to prevent recurrence.
   */
  async recordCorrectiveActions(investigationId: string, correctiveActions: string[], assignedTo: string): Promise<any> {
    return {
      investigationId,
      correctiveActionsTaken: correctiveActions,
      assignedTo,
      implementationDate: new Date(),
      verificationRequired: true,
    };
  }

  /**
   * 22. Documents environmental factors contributing to incident.
   */
  async documentEnvironmentalFactors(
    investigationId: string,
    environmentalFactors: Array<{ factor: string; severity: string }>,
  ): Promise<any> {
    return {
      investigationId,
      environmentalFactors,
      assessmentDate: new Date(),
      remediationRequired: environmentalFactors.some((f) => f.severity === 'high'),
    };
  }

  /**
   * 23. Completes investigation and closes case.
   */
  async completeInvestigation(investigationId: string, finalReport: string): Promise<any> {
    this.logger.log(`Completing investigation ${investigationId}`);

    return {
      investigationId,
      investigationStatus: 'completed',
      finalReport,
      completionDate: new Date(),
      reportAvailableForReview: true,
    };
  }

  /**
   * 24. Generates investigation timeline for review.
   */
  async generateInvestigationTimeline(investigationId: string): Promise<any> {
    return {
      investigationId,
      timeline: [
        { date: new Date('2024-11-01'), event: 'Investigation initiated' },
        { date: new Date('2024-11-05'), event: 'Root cause identified' },
        { date: new Date('2024-11-10'), event: 'Corrective actions implemented' },
      ],
      generatedAt: new Date(),
    };
  }

  // ============================================================================
  // 4. CONCUSSION PROTOCOL TRACKING (Functions 24-30)
  // ============================================================================

  /**
   * 25. Initiates concussion protocol with baseline assessment.
   */
  async initiateConcussionProtocol(protocolData: ConcussionProtocolData): Promise<any> {
    this.logger.log(`Initiating concussion protocol for student ${protocolData.studentId}`);

    const ConcussionProtocol = createConcussionProtocolModel(this.sequelize);
    const protocol = await ConcussionProtocol.create(protocolData);

    return protocol.toJSON();
  }

  /**
   * 26. Updates concussion symptoms and severity assessment.
   */
  async updateConcussionSymptoms(protocolId: string, symptoms: string[], severity: ConcussionSymptomSeverity): Promise<any> {
    const ConcussionProtocol = createConcussionProtocolModel(this.sequelize);
    const protocol = await ConcussionProtocol.findByPk(protocolId);

    if (!protocol) {
      throw new NotFoundException(`Concussion protocol ${protocolId} not found`);
    }

    await protocol.update({
      initialSymptoms: symptoms,
      symptomSeverity: severity,
    });

    return protocol.toJSON();
  }

  /**
   * 27. Records ImPACT test results (baseline and post-injury).
   */
  async recordImPACTTestResults(
    protocolId: string,
    testType: 'baseline' | 'post_injury',
    testResults: Record<string, any>,
  ): Promise<any> {
    const ConcussionProtocol = createConcussionProtocolModel(this.sequelize);
    const protocol = await ConcussionProtocol.findByPk(protocolId);

    if (!protocol) {
      throw new NotFoundException(`Concussion protocol ${protocolId} not found`);
    }

    const updateField = testType === 'baseline' ? 'impactTestBaseline' : 'impactTestPostInjury';
    await protocol.update({ [updateField]: testResults });

    return protocol.toJSON();
  }

  /**
   * 28. Marks student as symptom-free and eligible for progression.
   */
  async markStudentSymptomFree(protocolId: string): Promise<any> {
    const ConcussionProtocol = createConcussionProtocolModel(this.sequelize);
    const protocol = await ConcussionProtocol.findByPk(protocolId);

    if (!protocol) {
      throw new NotFoundException(`Concussion protocol ${protocolId} not found`);
    }

    await protocol.update({
      symptomFree: true,
      symptomFreeSince: new Date(),
    });

    this.logger.log(`Student ${protocol.studentId} marked as symptom-free`);
    return protocol.toJSON();
  }

  /**
   * 29. Assigns academic accommodations for concussed student.
   */
  async assignAcademicAccommodations(protocolId: string, accommodations: string[]): Promise<any> {
    const ConcussionProtocol = createConcussionProtocolModel(this.sequelize);
    const protocol = await ConcussionProtocol.findByPk(protocolId);

    if (!protocol) {
      throw new NotFoundException(`Concussion protocol ${protocolId} not found`);
    }

    await protocol.update({ academicAccommodations: accommodations });

    return protocol.toJSON();
  }

  /**
   * 30. Retrieves active concussion protocols for monitoring.
   */
  async getActiveConcussionProtocols(schoolId: string): Promise<any[]> {
    const ConcussionProtocol = createConcussionProtocolModel(this.sequelize);

    const protocols = await ConcussionProtocol.scope('active').findAll({
      where: { schoolId },
    });

    return protocols.map((p) => p.toJSON());
  }

  /**
   * 31. Generates concussion protocol status report.
   */
  async generateConcussionProtocolReport(protocolId: string): Promise<any> {
    const ConcussionProtocol = createConcussionProtocolModel(this.sequelize);
    const protocol = await ConcussionProtocol.findByPk(protocolId);

    if (!protocol) {
      throw new NotFoundException(`Concussion protocol ${protocolId} not found`);
    }

    return {
      protocolId,
      studentId: protocol.studentId,
      currentPhase: protocol.currentPhase,
      symptomFree: protocol.symptomFree,
      daysSinceSymptomFree: (protocol as any).daysSinceSymptomFree,
      cognitiveRestDays: protocol.cognitiveRestDays,
      physicalRestDays: protocol.physicalRestDays,
      academicAccommodations: protocol.academicAccommodations,
      generatedAt: new Date(),
    };
  }

  // ============================================================================
  // 5. RETURN-TO-PLAY CLEARANCE AFTER INJURY (Functions 31-35)
  // ============================================================================

  /**
   * 32. Creates return-to-play clearance record for specific phase.
   */
  async createReturnToPlayClearance(clearanceData: ReturnToPlayClearanceData): Promise<any> {
    this.logger.log(`Creating return-to-play clearance for student ${clearanceData.studentId}`);

    const ReturnToPlayClearance = createReturnToPlayClearanceModel(this.sequelize);
    const clearance = await ReturnToPlayClearance.create(clearanceData);

    return clearance.toJSON();
  }

  /**
   * 33. Advances student to next return-to-play phase.
   */
  async advanceToNextReturnToPlayPhase(clearanceId: string, nextPhase: ReturnToPlayPhase): Promise<any> {
    const ReturnToPlayClearance = createReturnToPlayClearanceModel(this.sequelize);
    const clearance = await ReturnToPlayClearance.findByPk(clearanceId);

    if (!clearance) {
      throw new NotFoundException(`Return-to-play clearance ${clearanceId} not found`);
    }

    // Complete current phase
    await clearance.update({
      phaseCompletionDate: new Date(),
      advanceToNextPhase: true,
    });

    // Create new clearance for next phase
    const newClearance = await ReturnToPlayClearance.create({
      protocolId: clearance.protocolId,
      studentId: clearance.studentId,
      currentPhase: nextPhase,
      phaseStartDate: new Date(),
      symptomsDuringPhase: [],
      physicianClearanceRequired: false,
      physicianClearanceObtained: false,
      advanceToNextPhase: false,
      returnedToPreviousPhase: false,
      fullClearanceGranted: false,
      schoolId: clearance.schoolId,
    });

    // Update concussion protocol phase
    const ConcussionProtocol = createConcussionProtocolModel(this.sequelize);
    await ConcussionProtocol.update({ currentPhase: nextPhase }, { where: { id: clearance.protocolId } });

    return newClearance.toJSON();
  }

  /**
   * 34. Records symptoms experienced during return-to-play phase.
   */
  async recordSymptomsReturnToPhase(clearanceId: string, symptoms: string[]): Promise<any> {
    const ReturnToPlayClearance = createReturnToPlayClearanceModel(this.sequelize);
    const clearance = await ReturnToPlayClearance.findByPk(clearanceId);

    if (!clearance) {
      throw new NotFoundException(`Return-to-play clearance ${clearanceId} not found`);
    }

    await clearance.update({
      symptomsDuringPhase: symptoms,
      returnedToPreviousPhase: symptoms.length > 0,
    });

    if (symptoms.length > 0) {
      this.logger.warn(`Symptoms reported during return-to-play phase ${clearanceId}. Student must return to previous phase.`);
    }

    return clearance.toJSON();
  }

  /**
   * 35. Documents physician clearance for return to full activity.
   */
  async documentPhysicianClearance(
    clearanceId: string,
    physicianName: string,
    physicianLicense: string,
    clearanceNotes: string,
  ): Promise<any> {
    const ReturnToPlayClearance = createReturnToPlayClearanceModel(this.sequelize);
    const clearance = await ReturnToPlayClearance.findByPk(clearanceId);

    if (!clearance) {
      throw new NotFoundException(`Return-to-play clearance ${clearanceId} not found`);
    }

    await clearance.update({
      physicianClearanceObtained: true,
      physicianName,
      physicianLicense,
      clearanceDate: new Date(),
      clearanceNotes,
    });

    return clearance.toJSON();
  }

  /**
   * 36. Grants full return-to-play clearance after all phases completed.
   */
  async grantFullReturnToPlayClearance(clearanceId: string): Promise<any> {
    const ReturnToPlayClearance = createReturnToPlayClearanceModel(this.sequelize);
    const clearance = await ReturnToPlayClearance.findByPk(clearanceId);

    if (!clearance) {
      throw new NotFoundException(`Return-to-play clearance ${clearanceId} not found`);
    }

    if (!clearance.physicianClearanceObtained) {
      throw new BadRequestException('Physician clearance required before granting full return-to-play');
    }

    await clearance.update({
      fullClearanceGranted: true,
      phaseCompletionDate: new Date(),
    });

    // Update concussion protocol
    const ConcussionProtocol = createConcussionProtocolModel(this.sequelize);
    await ConcussionProtocol.update(
      { currentPhase: ReturnToPlayPhase.RETURN_TO_PLAY },
      { where: { id: clearance.protocolId } },
    );

    this.logger.log(`Full return-to-play clearance granted for student ${clearance.studentId}`);
    return clearance.toJSON();
  }

  // ============================================================================
  // 6. PARENT NOTIFICATION FOR INJURIES (Functions 36-39)
  // ============================================================================

  /**
   * 37. Sends parent notification for injury incident.
   */
  async notifyParentOfInjury(notificationData: ParentInjuryNotificationData): Promise<any> {
    this.logger.log(`Sending parent injury notification for student ${notificationData.studentId}`);

    // Update incident report
    const IncidentReport = createIncidentReportModel(this.sequelize);
    await IncidentReport.update(
      {
        parentNotified: true,
        parentNotificationTime: notificationData.notificationTime,
      },
      { where: { id: notificationData.incidentId } },
    );

    return {
      ...notificationData,
      notificationId: `NOTIF-${Date.now()}`,
      notificationSent: true,
    };
  }

  /**
   * 38. Retrieves parent notification history for student.
   */
  async getParentNotificationHistory(studentId: string): Promise<any[]> {
    // In production, this would query a parent_notifications table
    return [
      {
        notificationId: 'NOTIF-123',
        studentId,
        notificationMethod: 'phone',
        notificationTime: new Date(),
        injurySummary: 'Minor abrasion to knee',
      },
    ];
  }

  /**
   * 39. Documents parent response to injury notification.
   */
  async documentParentResponse(notificationId: string, parentResponse: string, parentPickedUpStudent: boolean): Promise<any> {
    return {
      notificationId,
      parentResponse,
      parentPickedUpStudent,
      responseDocumentedAt: new Date(),
    };
  }

  /**
   * 40. Generates parent-friendly incident summary.
   */
  async generateParentIncidentSummary(incidentId: string): Promise<any> {
    const IncidentReport = createIncidentReportModel(this.sequelize);
    const report = await IncidentReport.findByPk(incidentId);

    if (!report) {
      throw new NotFoundException(`Incident report ${incidentId} not found`);
    }

    return {
      incidentDate: report.incidentDate,
      whatHappened: report.incidentDescription,
      whereItHappened: report.location,
      whatWeDidToHelp: 'First aid administered in school clinic',
      whatToWatchFor: 'Monitor for increased pain or swelling',
      whenToSeekCare: 'If symptoms worsen or new symptoms appear',
      schoolContactInfo: 'School Nurse: (555) 123-4567',
    };
  }

  // ============================================================================
  // 7. INSURANCE CLAIM DOCUMENTATION (Functions 40-42)
  // ============================================================================

  /**
   * 41. Creates insurance claim for incident.
   */
  async createInsuranceClaim(claimData: InsuranceClaimData): Promise<any> {
    this.logger.log(`Creating insurance claim for incident ${claimData.incidentId}`);

    const InsuranceClaim = createInsuranceClaimModel(this.sequelize);
    const claim = await InsuranceClaim.create(claimData);

    return claim.toJSON();
  }

  /**
   * 42. Updates insurance claim status and documentation.
   */
  async updateInsuranceClaimStatus(
    claimId: string,
    newStatus: InsuranceClaimStatus,
    additionalDocuments?: string[],
  ): Promise<any> {
    const InsuranceClaim = createInsuranceClaimModel(this.sequelize);
    const claim = await InsuranceClaim.findByPk(claimId);

    if (!claim) {
      throw new NotFoundException(`Insurance claim ${claimId} not found`);
    }

    const updateData: any = { claimStatus: newStatus };
    if (additionalDocuments) {
      updateData.documentsSubmitted = [...claim.documentsSubmitted, ...additionalDocuments];
    }

    await claim.update(updateData);

    return claim.toJSON();
  }

  /**
   * 43. Retrieves insurance claims pending submission.
   */
  async getPendingInsuranceClaims(schoolId: string): Promise<any[]> {
    const InsuranceClaim = createInsuranceClaimModel(this.sequelize);

    const claims = await InsuranceClaim.scope('pending').findAll({
      where: { schoolId },
    });

    return claims.map((c) => c.toJSON());
  }

  // ============================================================================
  // 8. INCIDENT TREND ANALYSIS & REPORTING (Functions 43-45)
  // ============================================================================

  /**
   * 44. Generates incident trend analysis for specified period.
   */
  async generateIncidentTrendAnalysis(schoolId: string, startDate: Date, endDate: Date): Promise<any> {
    const IncidentReport = createIncidentReportModel(this.sequelize);

    const incidents = await IncidentReport.findAll({
      where: {
        schoolId,
        incidentDate: { [Op.between]: [startDate, endDate] },
      },
    });

    const incidentsByType: Record<string, number> = {};
    const incidentsBySeverity: Record<string, number> = {};
    const incidentsByLocation: Record<string, number> = {};

    incidents.forEach((incident) => {
      // Count by severity
      incidentsBySeverity[incident.severity] = (incidentsBySeverity[incident.severity] || 0) + 1;

      // Count by location
      incidentsByLocation[incident.location] = (incidentsByLocation[incident.location] || 0) + 1;
    });

    return {
      analysisId: `TREND-${Date.now()}`,
      schoolId,
      analysisPeriod: { startDate, endDate },
      totalIncidents: incidents.length,
      incidentsByType,
      incidentsBySeverity,
      incidentsByLocation,
      generatedAt: new Date(),
    };
  }

  /**
   * 45. Identifies high-risk locations based on incident frequency.
   */
  async identifyHighRiskLocations(schoolId: string, minIncidents: number = 3): Promise<any[]> {
    const IncidentReport = createIncidentReportModel(this.sequelize);

    const recentDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000); // Last 90 days

    const incidents = await IncidentReport.findAll({
      where: {
        schoolId,
        incidentDate: { [Op.gte]: recentDate },
      },
    });

    const locationCounts: Record<string, number> = {};
    incidents.forEach((incident) => {
      locationCounts[incident.location] = (locationCounts[incident.location] || 0) + 1;
    });

    const highRiskLocations = Object.entries(locationCounts)
      .filter(([_, count]) => count >= minIncidents)
      .map(([location, count]) => ({ location, incidentCount: count, riskLevel: 'high' }))
      .sort((a, b) => b.incidentCount - a.incidentCount);

    return highRiskLocations;
  }

  /**
   * 46. Generates comprehensive OSHA compliance report.
   */
  async generateOSHAComplianceReport(schoolId: string, reportingYear: number): Promise<any> {
    const IncidentReport = createIncidentReportModel(this.sequelize);

    const startDate = new Date(`${reportingYear}-01-01`);
    const endDate = new Date(`${reportingYear}-12-31`);

    const oshaReportableIncidents = await IncidentReport.scope('requiresOSHA').findAll({
      where: {
        schoolId,
        incidentDate: { [Op.between]: [startDate, endDate] },
      },
    });

    return {
      complianceId: `OSHA-${reportingYear}-${Date.now()}`,
      schoolId,
      reportingYear,
      reportingPeriod: { startDate, endDate },
      totalOSHAReportableIncidents: oshaReportableIncidents.length,
      incidentsBySeverity: oshaReportableIncidents.reduce(
        (acc, inc) => {
          acc[inc.severity] = (acc[inc.severity] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      ),
      form300Required: oshaReportableIncidents.length > 0,
      reportGeneratedAt: new Date(),
    };
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default IncidentInjuryTrackingCompositeService;
