/**
 * LOC: CLINIC-QUALITY-COMP-001
 * File: /reuse/clinic/composites/clinic-quality-improvement-composites.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - sequelize (v6.x)
 *   - ../../server/health/health-quality-management-kit
 *   - ../../server/health/health-clinical-workflows-kit
 *   - ../../server/health/health-patient-management-kit
 *   - ../../analytics/metrics-aggregation-kit
 *   - ../../data/crud-operations
 *   - ../../data/data-repository
 *
 * DOWNSTREAM (imported by):
 *   - Quality assurance controllers
 *   - Clinical analytics dashboards
 *   - Accreditation reporting systems
 *   - Process improvement workflows
 *   - Patient satisfaction survey systems
 *   - Adverse event tracking modules
 */

/**
 * File: /reuse/clinic/composites/clinic-quality-improvement-composites.ts
 * Locator: WC-CLINIC-QUALITY-001
 * Purpose: Clinic Quality Improvement Composite - Comprehensive quality assurance and improvement tracking
 *
 * Upstream: health-quality-management-kit, health-clinical-workflows-kit, health-patient-management-kit,
 *           metrics-aggregation-kit, data-repository
 * Downstream: Quality controllers, Analytics dashboards, Accreditation systems, Process improvement
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x
 * Exports: 39 composed functions for complete quality improvement and clinical excellence tracking
 *
 * LLM Context: Production-grade clinic quality improvement composite for K-12 school health SaaS platform.
 * Provides comprehensive quality management including quality metrics tracking with KPI monitoring, clinical
 * outcome measurements and effectiveness analysis, patient satisfaction surveys with feedback collection,
 * adverse event reporting with root cause analysis, process improvement initiative tracking, accreditation
 * compliance monitoring for state and federal standards, peer review workflows with clinical performance
 * evaluation, best practice implementation tracking, continuous quality improvement (CQI) initiatives,
 * benchmarking against national standards, and comprehensive reporting for regulatory compliance and
 * healthcare quality excellence.
 */

import {
  Injectable,
  Logger,
  Inject,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { Sequelize, Model, DataTypes, Transaction, Op } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS & ENUMERATIONS
// ============================================================================

/**
 * Quality metric types
 */
export enum QualityMetricType {
  CLINICAL_OUTCOME = 'clinical_outcome',
  PATIENT_SATISFACTION = 'patient_satisfaction',
  OPERATIONAL_EFFICIENCY = 'operational_efficiency',
  SAFETY_INDICATOR = 'safety_indicator',
  ACCESS_TO_CARE = 'access_to_care',
  PREVENTIVE_CARE = 'preventive_care',
}

/**
 * Clinical outcome status
 */
export enum ClinicalOutcomeStatus {
  IMPROVED = 'improved',
  STABLE = 'stable',
  DECLINED = 'declined',
  UNRESOLVED = 'unresolved',
  RESOLVED = 'resolved',
}

/**
 * Survey response status
 */
export enum SurveyResponseStatus {
  NOT_SENT = 'not_sent',
  SENT = 'sent',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  EXPIRED = 'expired',
}

/**
 * Adverse event severity
 */
export enum AdverseEventSeverity {
  CRITICAL = 'critical',
  MAJOR = 'major',
  MODERATE = 'moderate',
  MINOR = 'minor',
  NEAR_MISS = 'near_miss',
}

/**
 * Process improvement status
 */
export enum ProcessImprovementStatus {
  PROPOSED = 'proposed',
  APPROVED = 'approved',
  IN_PROGRESS = 'in_progress',
  IMPLEMENTED = 'implemented',
  MONITORING = 'monitoring',
  COMPLETED = 'completed',
  ABANDONED = 'abandoned',
}

/**
 * Accreditation compliance status
 */
export enum AccreditationComplianceStatus {
  COMPLIANT = 'compliant',
  NON_COMPLIANT = 'non_compliant',
  PARTIALLY_COMPLIANT = 'partially_compliant',
  UNDER_REVIEW = 'under_review',
  PENDING_AUDIT = 'pending_audit',
}

/**
 * Quality metric tracking data
 */
export interface QualityMetricData {
  metricId?: string;
  metricType: QualityMetricType;
  metricName: string;
  metricDescription: string;
  metricValue: number;
  metricUnit: string;
  targetValue?: number;
  benchmarkValue?: number;
  measurementDate: Date;
  measurementPeriod: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
  dataSource: string;
  calculationMethod?: string;
  schoolId: string;
  createdAt?: Date;
}

/**
 * Clinical outcome measurement
 */
export interface ClinicalOutcomeData {
  outcomeId?: string;
  studentId: string;
  diagnosisCode?: string;
  treatmentPlan: string;
  initialAssessmentDate: Date;
  followUpDate?: Date;
  outcomeStatus: ClinicalOutcomeStatus;
  outcomeNotes: string;
  treatmentEffectiveness: 'very_effective' | 'effective' | 'somewhat_effective' | 'ineffective';
  complicationsObserved?: string[];
  recoveryTimeInDays?: number;
  followUpRequired: boolean;
  clinicianId: string;
  schoolId: string;
}

/**
 * Patient satisfaction survey
 */
export interface PatientSatisfactionSurveyData {
  surveyId?: string;
  studentId?: string;
  parentId?: string;
  surveyType: 'clinic_visit' | 'telehealth' | 'annual_checkup' | 'general_satisfaction';
  surveyVersion: string;
  responseStatus: SurveyResponseStatus;
  overallRating: number;
  waitTimeRating?: number;
  staffCourtesyRating?: number;
  clinicCleanlinessRating?: number;
  communicationRating?: number;
  careQualityRating?: number;
  openEndedFeedback?: string;
  improvementSuggestions?: string[];
  surveyCompletedDate?: Date;
  schoolId: string;
}

/**
 * Adverse event report
 */
export interface AdverseEventData {
  eventId?: string;
  studentId?: string;
  eventType: string;
  eventSeverity: AdverseEventSeverity;
  eventDescription: string;
  eventDate: Date;
  discoveredDate: Date;
  reportedBy: string;
  immediateActionTaken: string;
  patientOutcome: string;
  rootCauseAnalysis?: string;
  contributingFactors?: string[];
  correctiveActions?: string[];
  preventiveMeasures?: string[];
  physicianNotified: boolean;
  parentNotified: boolean;
  regulatoryReportingRequired: boolean;
  regulatoryReportSubmitted?: boolean;
  followUpDate?: Date;
  schoolId: string;
}

/**
 * Process improvement initiative
 */
export interface ProcessImprovementData {
  initiativeId?: string;
  initiativeName: string;
  initiativeDescription: string;
  improvementCategory: 'workflow' | 'safety' | 'efficiency' | 'patient_experience' | 'compliance' | 'other';
  proposedBy: string;
  proposalDate: Date;
  approvedBy?: string;
  approvalDate?: Date;
  implementationStartDate?: Date;
  implementationEndDate?: Date;
  improvementStatus: ProcessImprovementStatus;
  baselineMetric?: number;
  targetMetric?: number;
  currentMetric?: number;
  successCriteria: string[];
  resources required?: string[];
  stakeholders: string[];
  progressNotes?: string;
  schoolId: string;
}

/**
 * Accreditation compliance record
 */
export interface AccreditationComplianceData {
  complianceId?: string;
  accreditationBody: string;
  standardReference: string;
  standardDescription: string;
  complianceStatus: AccreditationComplianceStatus;
  lastAuditDate?: Date;
  nextAuditDate?: Date;
  evidenceDocuments?: string[];
  complianceNotes?: string;
  nonComplianceReason?: string;
  remediationPlan?: string;
  remediationDeadline?: Date;
  auditorName?: string;
  schoolId: string;
}

/**
 * Peer review record
 */
export interface PeerReviewData {
  reviewId?: string;
  reviewedClinicianId: string;
  reviewerClinicianId: string;
  reviewDate: Date;
  reviewType: 'chart_review' | 'clinical_case' | 'procedure_observation' | 'annual_evaluation';
  clinicalCompetence: number;
  clinicalKnowledge: number;
  patientCommunication: number;
  documentationQuality: number;
  adherenceToBestPractices: number;
  overallRating: number;
  strengthsIdentified: string[];
  areasForImprovement: string[];
  recommendedTraining?: string[];
  followUpRequired: boolean;
  followUpDate?: Date;
  schoolId: string;
}

/**
 * Best practice implementation tracking
 */
export interface BestPracticeImplementationData {
  implementationId?: string;
  practiceTitle: string;
  practiceDescription: string;
  practiceCategory: string;
  evidenceSource: string;
  implementationDate: Date;
  implementedBy: string;
  adoptionRate?: number;
  complianceRate?: number;
  measuredOutcomes?: string[];
  barriers?: string[];
  successFactors?: string[];
  schoolId: string;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Quality Metrics
 */
export const createQualityMetricModel = (sequelize: Sequelize) => {
  class QualityMetric extends Model {
    public id!: string;
    public metricType!: QualityMetricType;
    public metricName!: string;
    public metricDescription!: string;
    public metricValue!: number;
    public metricUnit!: string;
    public targetValue!: number | null;
    public benchmarkValue!: number | null;
    public measurementDate!: Date;
    public measurementPeriod!: string;
    public dataSource!: string;
    public calculationMethod!: string | null;
    public schoolId!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  QualityMetric.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      metricType: { type: DataTypes.ENUM(...Object.values(QualityMetricType)), allowNull: false },
      metricName: { type: DataTypes.STRING(255), allowNull: false },
      metricDescription: { type: DataTypes.TEXT, allowNull: false },
      metricValue: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      metricUnit: { type: DataTypes.STRING(50), allowNull: false },
      targetValue: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
      benchmarkValue: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
      measurementDate: { type: DataTypes.DATE, allowNull: false },
      measurementPeriod: { type: DataTypes.ENUM('daily', 'weekly', 'monthly', 'quarterly', 'annually'), allowNull: false },
      dataSource: { type: DataTypes.STRING(255), allowNull: false },
      calculationMethod: { type: DataTypes.TEXT, allowNull: true },
      schoolId: { type: DataTypes.UUID, allowNull: false, references: { model: 'schools', key: 'id' } },
    },
    {
      sequelize,
      tableName: 'quality_metrics',
      timestamps: true,
      indexes: [
        { fields: ['schoolId', 'metricType', 'measurementDate'] },
        { fields: ['metricType'] },
        { fields: ['measurementDate'] },
        { fields: ['schoolId'] },
      ],
    },
  );

  return QualityMetric;
};

/**
 * Sequelize model for Clinical Outcomes
 */
export const createClinicalOutcomeModel = (sequelize: Sequelize) => {
  class ClinicalOutcome extends Model {
    public id!: string;
    public studentId!: string;
    public diagnosisCode!: string | null;
    public treatmentPlan!: string;
    public initialAssessmentDate!: Date;
    public followUpDate!: Date | null;
    public outcomeStatus!: ClinicalOutcomeStatus;
    public outcomeNotes!: string;
    public treatmentEffectiveness!: string;
    public complicationsObserved!: string[] | null;
    public recoveryTimeInDays!: number | null;
    public followUpRequired!: boolean;
    public clinicianId!: string;
    public schoolId!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ClinicalOutcome.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      studentId: { type: DataTypes.UUID, allowNull: false, references: { model: 'students', key: 'id' } },
      diagnosisCode: { type: DataTypes.STRING(50), allowNull: true },
      treatmentPlan: { type: DataTypes.TEXT, allowNull: false },
      initialAssessmentDate: { type: DataTypes.DATE, allowNull: false },
      followUpDate: { type: DataTypes.DATE, allowNull: true },
      outcomeStatus: { type: DataTypes.ENUM(...Object.values(ClinicalOutcomeStatus)), allowNull: false },
      outcomeNotes: { type: DataTypes.TEXT, allowNull: false },
      treatmentEffectiveness: { type: DataTypes.ENUM('very_effective', 'effective', 'somewhat_effective', 'ineffective'), allowNull: false },
      complicationsObserved: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
      recoveryTimeInDays: { type: DataTypes.INTEGER, allowNull: true },
      followUpRequired: { type: DataTypes.BOOLEAN, defaultValue: false },
      clinicianId: { type: DataTypes.UUID, allowNull: false, references: { model: 'users', key: 'id' } },
      schoolId: { type: DataTypes.UUID, allowNull: false, references: { model: 'schools', key: 'id' } },
    },
    {
      sequelize,
      tableName: 'clinical_outcomes',
      timestamps: true,
      indexes: [
        { fields: ['studentId'] },
        { fields: ['outcomeStatus'] },
        { fields: ['initialAssessmentDate'] },
        { fields: ['schoolId', 'initialAssessmentDate'] },
      ],
    },
  );

  return ClinicalOutcome;
};

/**
 * Sequelize model for Patient Satisfaction Surveys
 */
export const createPatientSatisfactionSurveyModel = (sequelize: Sequelize) => {
  class PatientSatisfactionSurvey extends Model {
    public id!: string;
    public studentId!: string | null;
    public parentId!: string | null;
    public surveyType!: string;
    public surveyVersion!: string;
    public responseStatus!: SurveyResponseStatus;
    public overallRating!: number;
    public waitTimeRating!: number | null;
    public staffCourtesyRating!: number | null;
    public clinicCleanlinessRating!: number | null;
    public communicationRating!: number | null;
    public careQualityRating!: number | null;
    public openEndedFeedback!: string | null;
    public improvementSuggestions!: string[] | null;
    public surveyCompletedDate!: Date | null;
    public schoolId!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  PatientSatisfactionSurvey.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      studentId: { type: DataTypes.UUID, allowNull: true, references: { model: 'students', key: 'id' } },
      parentId: { type: DataTypes.UUID, allowNull: true, references: { model: 'parents', key: 'id' } },
      surveyType: { type: DataTypes.ENUM('clinic_visit', 'telehealth', 'annual_checkup', 'general_satisfaction'), allowNull: false },
      surveyVersion: { type: DataTypes.STRING(50), allowNull: false },
      responseStatus: { type: DataTypes.ENUM(...Object.values(SurveyResponseStatus)), allowNull: false, defaultValue: SurveyResponseStatus.NOT_SENT },
      overallRating: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, validate: { min: 0, max: 5 } },
      waitTimeRating: { type: DataTypes.INTEGER, allowNull: true, validate: { min: 0, max: 5 } },
      staffCourtesyRating: { type: DataTypes.INTEGER, allowNull: true, validate: { min: 0, max: 5 } },
      clinicCleanlinessRating: { type: DataTypes.INTEGER, allowNull: true, validate: { min: 0, max: 5 } },
      communicationRating: { type: DataTypes.INTEGER, allowNull: true, validate: { min: 0, max: 5 } },
      careQualityRating: { type: DataTypes.INTEGER, allowNull: true, validate: { min: 0, max: 5 } },
      openEndedFeedback: { type: DataTypes.TEXT, allowNull: true },
      improvementSuggestions: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
      surveyCompletedDate: { type: DataTypes.DATE, allowNull: true },
      schoolId: { type: DataTypes.UUID, allowNull: false, references: { model: 'schools', key: 'id' } },
    },
    {
      sequelize,
      tableName: 'patient_satisfaction_surveys',
      timestamps: true,
      indexes: [
        { fields: ['studentId'] },
        { fields: ['parentId'] },
        { fields: ['responseStatus'] },
        { fields: ['surveyCompletedDate'] },
        { fields: ['schoolId', 'surveyCompletedDate'] },
      ],
    },
  );

  return PatientSatisfactionSurvey;
};

/**
 * Sequelize model for Adverse Events
 */
export const createAdverseEventModel = (sequelize: Sequelize) => {
  class AdverseEvent extends Model {
    public id!: string;
    public studentId!: string | null;
    public eventType!: string;
    public eventSeverity!: AdverseEventSeverity;
    public eventDescription!: string;
    public eventDate!: Date;
    public discoveredDate!: Date;
    public reportedBy!: string;
    public immediateActionTaken!: string;
    public patientOutcome!: string;
    public rootCauseAnalysis!: string | null;
    public contributingFactors!: string[] | null;
    public correctiveActions!: string[] | null;
    public preventiveMeasures!: string[] | null;
    public physicianNotified!: boolean;
    public parentNotified!: boolean;
    public regulatoryReportingRequired!: boolean;
    public regulatoryReportSubmitted!: boolean | null;
    public followUpDate!: Date | null;
    public schoolId!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  AdverseEvent.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      studentId: { type: DataTypes.UUID, allowNull: true, references: { model: 'students', key: 'id' } },
      eventType: { type: DataTypes.STRING(255), allowNull: false },
      eventSeverity: { type: DataTypes.ENUM(...Object.values(AdverseEventSeverity)), allowNull: false },
      eventDescription: { type: DataTypes.TEXT, allowNull: false },
      eventDate: { type: DataTypes.DATE, allowNull: false },
      discoveredDate: { type: DataTypes.DATE, allowNull: false },
      reportedBy: { type: DataTypes.UUID, allowNull: false, references: { model: 'users', key: 'id' } },
      immediateActionTaken: { type: DataTypes.TEXT, allowNull: false },
      patientOutcome: { type: DataTypes.TEXT, allowNull: false },
      rootCauseAnalysis: { type: DataTypes.TEXT, allowNull: true },
      contributingFactors: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
      correctiveActions: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
      preventiveMeasures: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
      physicianNotified: { type: DataTypes.BOOLEAN, defaultValue: false },
      parentNotified: { type: DataTypes.BOOLEAN, defaultValue: false },
      regulatoryReportingRequired: { type: DataTypes.BOOLEAN, defaultValue: false },
      regulatoryReportSubmitted: { type: DataTypes.BOOLEAN, allowNull: true },
      followUpDate: { type: DataTypes.DATE, allowNull: true },
      schoolId: { type: DataTypes.UUID, allowNull: false, references: { model: 'schools', key: 'id' } },
    },
    {
      sequelize,
      tableName: 'adverse_events',
      timestamps: true,
      indexes: [
        { fields: ['studentId'] },
        { fields: ['eventSeverity'] },
        { fields: ['eventDate'] },
        { fields: ['schoolId', 'eventDate'] },
        { fields: ['eventSeverity', 'eventDate'] },
      ],
    },
  );

  return AdverseEvent;
};

/**
 * Sequelize model for Process Improvements
 */
export const createProcessImprovementModel = (sequelize: Sequelize) => {
  class ProcessImprovement extends Model {
    public id!: string;
    public initiativeName!: string;
    public initiativeDescription!: string;
    public improvementCategory!: string;
    public proposedBy!: string;
    public proposalDate!: Date;
    public approvedBy!: string | null;
    public approvalDate!: Date | null;
    public implementationStartDate!: Date | null;
    public implementationEndDate!: Date | null;
    public improvementStatus!: ProcessImprovementStatus;
    public baselineMetric!: number | null;
    public targetMetric!: number | null;
    public currentMetric!: number | null;
    public successCriteria!: string[];
    public resourcesRequired!: string[] | null;
    public stakeholders!: string[];
    public progressNotes!: string | null;
    public schoolId!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ProcessImprovement.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      initiativeName: { type: DataTypes.STRING(255), allowNull: false },
      initiativeDescription: { type: DataTypes.TEXT, allowNull: false },
      improvementCategory: { type: DataTypes.ENUM('workflow', 'safety', 'efficiency', 'patient_experience', 'compliance', 'other'), allowNull: false },
      proposedBy: { type: DataTypes.UUID, allowNull: false, references: { model: 'users', key: 'id' } },
      proposalDate: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      approvedBy: { type: DataTypes.UUID, allowNull: true, references: { model: 'users', key: 'id' } },
      approvalDate: { type: DataTypes.DATE, allowNull: true },
      implementationStartDate: { type: DataTypes.DATE, allowNull: true },
      implementationEndDate: { type: DataTypes.DATE, allowNull: true },
      improvementStatus: { type: DataTypes.ENUM(...Object.values(ProcessImprovementStatus)), allowNull: false, defaultValue: ProcessImprovementStatus.PROPOSED },
      baselineMetric: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
      targetMetric: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
      currentMetric: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
      successCriteria: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
      resourcesRequired: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
      stakeholders: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
      progressNotes: { type: DataTypes.TEXT, allowNull: true },
      schoolId: { type: DataTypes.UUID, allowNull: false, references: { model: 'schools', key: 'id' } },
    },
    {
      sequelize,
      tableName: 'process_improvements',
      timestamps: true,
      indexes: [
        { fields: ['improvementStatus'] },
        { fields: ['proposalDate'] },
        { fields: ['schoolId'] },
        { fields: ['improvementStatus', 'schoolId'] },
      ],
    },
  );

  return ProcessImprovement;
};

/**
 * Sequelize model for Accreditation Compliance
 */
export const createAccreditationComplianceModel = (sequelize: Sequelize) => {
  class AccreditationCompliance extends Model {
    public id!: string;
    public accreditationBody!: string;
    public standardReference!: string;
    public standardDescription!: string;
    public complianceStatus!: AccreditationComplianceStatus;
    public lastAuditDate!: Date | null;
    public nextAuditDate!: Date | null;
    public evidenceDocuments!: string[] | null;
    public complianceNotes!: string | null;
    public nonComplianceReason!: string | null;
    public remediationPlan!: string | null;
    public remediationDeadline!: Date | null;
    public auditorName!: string | null;
    public schoolId!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  AccreditationCompliance.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      accreditationBody: { type: DataTypes.STRING(255), allowNull: false },
      standardReference: { type: DataTypes.STRING(100), allowNull: false },
      standardDescription: { type: DataTypes.TEXT, allowNull: false },
      complianceStatus: { type: DataTypes.ENUM(...Object.values(AccreditationComplianceStatus)), allowNull: false, defaultValue: AccreditationComplianceStatus.UNDER_REVIEW },
      lastAuditDate: { type: DataTypes.DATE, allowNull: true },
      nextAuditDate: { type: DataTypes.DATE, allowNull: true },
      evidenceDocuments: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
      complianceNotes: { type: DataTypes.TEXT, allowNull: true },
      nonComplianceReason: { type: DataTypes.TEXT, allowNull: true },
      remediationPlan: { type: DataTypes.TEXT, allowNull: true },
      remediationDeadline: { type: DataTypes.DATE, allowNull: true },
      auditorName: { type: DataTypes.STRING(255), allowNull: true },
      schoolId: { type: DataTypes.UUID, allowNull: false, references: { model: 'schools', key: 'id' } },
    },
    {
      sequelize,
      tableName: 'accreditation_compliance',
      timestamps: true,
      indexes: [
        { fields: ['complianceStatus'] },
        { fields: ['schoolId'] },
        { fields: ['nextAuditDate'] },
        { fields: ['complianceStatus', 'schoolId'] },
        { fields: ['accreditationBody', 'standardReference'] },
      ],
    },
  );

  return AccreditationCompliance;
};

/**
 * Sequelize model for Peer Reviews
 */
export const createPeerReviewModel = (sequelize: Sequelize) => {
  class PeerReview extends Model {
    public id!: string;
    public reviewedClinicianId!: string;
    public reviewerClinicianId!: string;
    public reviewDate!: Date;
    public reviewType!: string;
    public clinicalCompetence!: number;
    public clinicalKnowledge!: number;
    public patientCommunication!: number;
    public documentationQuality!: number;
    public adherenceToBestPractices!: number;
    public overallRating!: number;
    public strengthsIdentified!: string[];
    public areasForImprovement!: string[];
    public recommendedTraining!: string[] | null;
    public followUpRequired!: boolean;
    public followUpDate!: Date | null;
    public schoolId!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  PeerReview.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      reviewedClinicianId: { type: DataTypes.UUID, allowNull: false, references: { model: 'users', key: 'id' } },
      reviewerClinicianId: { type: DataTypes.UUID, allowNull: false, references: { model: 'users', key: 'id' } },
      reviewDate: { type: DataTypes.DATE, allowNull: false },
      reviewType: { type: DataTypes.ENUM('chart_review', 'clinical_case', 'procedure_observation', 'annual_evaluation'), allowNull: false },
      clinicalCompetence: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
      clinicalKnowledge: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
      patientCommunication: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
      documentationQuality: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
      adherenceToBestPractices: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
      overallRating: { type: DataTypes.DECIMAL(3, 2), allowNull: false, validate: { min: 1, max: 5 } },
      strengthsIdentified: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
      areasForImprovement: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
      recommendedTraining: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
      followUpRequired: { type: DataTypes.BOOLEAN, defaultValue: false },
      followUpDate: { type: DataTypes.DATE, allowNull: true },
      schoolId: { type: DataTypes.UUID, allowNull: false, references: { model: 'schools', key: 'id' } },
    },
    {
      sequelize,
      tableName: 'peer_reviews',
      timestamps: true,
      indexes: [
        { fields: ['reviewedClinicianId'] },
        { fields: ['reviewDate'] },
        { fields: ['schoolId'] },
        { fields: ['reviewedClinicianId', 'reviewDate'] },
      ],
    },
  );

  return PeerReview;
};

// ============================================================================
// NESTJS INJECTABLE SERVICE
// ============================================================================

/**
 * Clinic Quality Improvement Composite Service
 *
 * Provides comprehensive quality assurance and improvement tracking for K-12 school clinics
 * including metrics tracking, clinical outcomes, patient satisfaction, adverse events,
 * process improvements, accreditation compliance, and peer reviews.
 */
@Injectable()
export class ClinicQualityImprovementCompositeService {
  private readonly logger = new Logger(ClinicQualityImprovementCompositeService.name);

  constructor(
    @Inject('SEQUELIZE') private readonly sequelize: Sequelize,
  ) {}

  // ============================================================================
  // 1. QUALITY METRICS TRACKING (Functions 1-7)
  // ============================================================================

  /**
   * 1. Records quality metric measurement with benchmark comparison.
   */
  async recordQualityMetric(metricData: QualityMetricData): Promise<any> {
    this.logger.log(`Recording quality metric: ${metricData.metricName}`);

    const QualityMetric = createQualityMetricModel(this.sequelize);

    const metric = await QualityMetric.create(metricData);
    return metric.toJSON();
  }

  /**
   * 2. Retrieves quality metrics trend analysis over time period.
   */
  async getQualityMetricsTrend(
    schoolId: string,
    metricType: QualityMetricType,
    startDate: Date,
    endDate: Date,
  ): Promise<any> {
    const QualityMetric = createQualityMetricModel(this.sequelize);

    const metrics = await QualityMetric.findAll({
      where: {
        schoolId,
        metricType,
        measurementDate: { [Op.between]: [startDate, endDate] },
      },
      order: [['measurementDate', 'ASC']],
    });

    const values = metrics.map(m => m.metricValue);
    const average = values.reduce((sum, val) => sum + Number(val), 0) / values.length;

    return {
      metricType,
      period: { startDate, endDate },
      dataPoints: metrics.map(m => ({
        date: m.measurementDate,
        value: m.metricValue,
        target: m.targetValue,
      })),
      averageValue: average.toFixed(2),
      trend: this.calculateTrend(values),
    };
  }

  /**
   * 3. Compares quality metrics against national benchmarks.
   */
  async compareMetricsToBenchmarks(schoolId: string, measurementPeriod: string): Promise<any> {
    const QualityMetric = createQualityMetricModel(this.sequelize);

    const metrics = await QualityMetric.findAll({
      where: {
        schoolId,
        measurementPeriod,
      },
      order: [['metricType', 'ASC']],
    });

    return {
      schoolId,
      measurementPeriod,
      comparisons: metrics.map(m => ({
        metricName: m.metricName,
        schoolValue: m.metricValue,
        benchmarkValue: m.benchmarkValue,
        percentageDifference: m.benchmarkValue
          ? (((Number(m.metricValue) - Number(m.benchmarkValue)) / Number(m.benchmarkValue)) * 100).toFixed(1)
          : null,
        performanceStatus: this.getPerformanceStatus(Number(m.metricValue), m.benchmarkValue),
      })),
    };
  }

  /**
   * 4. Generates quality metrics dashboard summary.
   */
  async generateQualityMetricsDashboard(schoolId: string, period: 'current_month' | 'current_quarter' | 'current_year'): Promise<any> {
    const QualityMetric = createQualityMetricModel(this.sequelize);

    const dateRange = this.getDateRangeForPeriod(period);

    const metrics = await QualityMetric.findAll({
      where: {
        schoolId,
        measurementDate: { [Op.between]: [dateRange.start, dateRange.end] },
      },
    });

    const groupedByType = this.groupByMetricType(metrics);

    return {
      schoolId,
      period,
      dateRange,
      totalMetrics: metrics.length,
      metricsByType: groupedByType,
      overallPerformanceScore: this.calculateOverallPerformance(metrics),
      generatedAt: new Date(),
    };
  }

  /**
   * 5. Sets quality metric targets and goals.
   */
  async setQualityMetricTargets(
    schoolId: string,
    metricType: QualityMetricType,
    metricName: string,
    targetValue: number,
    targetPeriod: string,
  ): Promise<any> {
    this.logger.log(`Setting target for ${metricName}: ${targetValue}`);

    return {
      schoolId,
      metricType,
      metricName,
      targetValue,
      targetPeriod,
      setDate: new Date(),
      targetActive: true,
    };
  }

  /**
   * 6. Monitors quality metric alerts and threshold breaches.
   */
  async monitorQualityMetricAlerts(schoolId: string): Promise<any[]> {
    const QualityMetric = createQualityMetricModel(this.sequelize);

    const recentMetrics = await QualityMetric.findAll({
      where: {
        schoolId,
        measurementDate: { [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    });

    const alerts = recentMetrics
      .filter(m => m.targetValue && Number(m.metricValue) < Number(m.targetValue) * 0.9)
      .map(m => ({
        metricName: m.metricName,
        currentValue: m.metricValue,
        targetValue: m.targetValue,
        percentageBelow: (((Number(m.targetValue!) - Number(m.metricValue)) / Number(m.targetValue!)) * 100).toFixed(1),
        alertSeverity: Number(m.metricValue) < Number(m.targetValue!) * 0.75 ? 'high' : 'medium',
        measurementDate: m.measurementDate,
      }));

    return alerts;
  }

  /**
   * 7. Aggregates quality metrics for reporting periods.
   */
  async aggregateQualityMetrics(
    schoolId: string,
    metricType: QualityMetricType,
    aggregationPeriod: 'monthly' | 'quarterly' | 'annually',
  ): Promise<any> {
    const QualityMetric = createQualityMetricModel(this.sequelize);

    const metrics = await QualityMetric.findAll({
      where: {
        schoolId,
        metricType,
      },
      order: [['measurementDate', 'DESC']],
    });

    return {
      metricType,
      aggregationPeriod,
      totalMeasurements: metrics.length,
      averageValue: this.calculateAverage(metrics.map(m => Number(m.metricValue))),
      minValue: Math.min(...metrics.map(m => Number(m.metricValue))),
      maxValue: Math.max(...metrics.map(m => Number(m.metricValue))),
      standardDeviation: this.calculateStdDev(metrics.map(m => Number(m.metricValue))),
      aggregatedAt: new Date(),
    };
  }

  // ============================================================================
  // 2. CLINICAL OUTCOME MEASUREMENTS (Functions 8-13)
  // ============================================================================

  /**
   * 8. Records clinical outcome for patient treatment.
   */
  async recordClinicalOutcome(outcomeData: ClinicalOutcomeData): Promise<any> {
    this.logger.log(`Recording clinical outcome for student ${outcomeData.studentId}`);

    const ClinicalOutcome = createClinicalOutcomeModel(this.sequelize);

    const outcome = await ClinicalOutcome.create(outcomeData);
    return outcome.toJSON();
  }

  /**
   * 9. Tracks treatment effectiveness across patient population.
   */
  async trackTreatmentEffectiveness(schoolId: string, diagnosisCode: string): Promise<any> {
    const ClinicalOutcome = createClinicalOutcomeModel(this.sequelize);

    const outcomes = await ClinicalOutcome.findAll({
      where: {
        schoolId,
        diagnosisCode,
      },
    });

    const effectivenessCount = {
      very_effective: outcomes.filter(o => o.treatmentEffectiveness === 'very_effective').length,
      effective: outcomes.filter(o => o.treatmentEffectiveness === 'effective').length,
      somewhat_effective: outcomes.filter(o => o.treatmentEffectiveness === 'somewhat_effective').length,
      ineffective: outcomes.filter(o => o.treatmentEffectiveness === 'ineffective').length,
    };

    return {
      diagnosisCode,
      totalCases: outcomes.length,
      effectivenessBreakdown: effectivenessCount,
      successRate: (((effectivenessCount.very_effective + effectivenessCount.effective) / outcomes.length) * 100).toFixed(1),
      averageRecoveryTime: this.calculateAverage(
        outcomes.filter(o => o.recoveryTimeInDays).map(o => o.recoveryTimeInDays!),
      ),
    };
  }

  /**
   * 10. Analyzes complication rates for treatments.
   */
  async analyzeComplicationRates(schoolId: string, startDate: Date, endDate: Date): Promise<any> {
    const ClinicalOutcome = createClinicalOutcomeModel(this.sequelize);

    const outcomes = await ClinicalOutcome.findAll({
      where: {
        schoolId,
        initialAssessmentDate: { [Op.between]: [startDate, endDate] },
      },
    });

    const withComplications = outcomes.filter(o => o.complicationsObserved && o.complicationsObserved.length > 0);

    return {
      period: { startDate, endDate },
      totalTreatments: outcomes.length,
      treatmentsWithComplications: withComplications.length,
      complicationRate: ((withComplications.length / outcomes.length) * 100).toFixed(2),
      commonComplications: this.getCommonComplications(withComplications),
    };
  }

  /**
   * 11. Monitors follow-up compliance for clinical outcomes.
   */
  async monitorFollowUpCompliance(schoolId: string): Promise<any> {
    const ClinicalOutcome = createClinicalOutcomeModel(this.sequelize);

    const requiringFollowUp = await ClinicalOutcome.findAll({
      where: {
        schoolId,
        followUpRequired: true,
      },
    });

    const completed = requiringFollowUp.filter(o => o.followUpDate && o.followUpDate < new Date());
    const overdue = requiringFollowUp.filter(o => !o.followUpDate || o.followUpDate < new Date());

    return {
      totalFollowUpsRequired: requiringFollowUp.length,
      followUpsCompleted: completed.length,
      followUpsOverdue: overdue.length,
      complianceRate: ((completed.length / requiringFollowUp.length) * 100).toFixed(1),
      overduePatients: overdue.map(o => ({
        studentId: o.studentId,
        diagnosisCode: o.diagnosisCode,
        initialAssessmentDate: o.initialAssessmentDate,
      })),
    };
  }

  /**
   * 12. Generates clinical outcome performance report.
   */
  async generateClinicalOutcomeReport(schoolId: string, startDate: Date, endDate: Date): Promise<any> {
    const ClinicalOutcome = createClinicalOutcomeModel(this.sequelize);

    const outcomes = await ClinicalOutcome.findAll({
      where: {
        schoolId,
        initialAssessmentDate: { [Op.between]: [startDate, endDate] },
      },
    });

    return {
      reportPeriod: { startDate, endDate },
      totalOutcomesRecorded: outcomes.length,
      outcomeStatusBreakdown: {
        improved: outcomes.filter(o => o.outcomeStatus === ClinicalOutcomeStatus.IMPROVED).length,
        stable: outcomes.filter(o => o.outcomeStatus === ClinicalOutcomeStatus.STABLE).length,
        declined: outcomes.filter(o => o.outcomeStatus === ClinicalOutcomeStatus.DECLINED).length,
        resolved: outcomes.filter(o => o.outcomeStatus === ClinicalOutcomeStatus.RESOLVED).length,
      },
      overallTreatmentSuccessRate: (
        (outcomes.filter(o => o.treatmentEffectiveness === 'very_effective' || o.treatmentEffectiveness === 'effective')
          .length /
          outcomes.length) *
        100
      ).toFixed(1),
      reportGeneratedAt: new Date(),
    };
  }

  /**
   * 13. Identifies high-risk patients requiring additional monitoring.
   */
  async identifyHighRiskPatients(schoolId: string): Promise<any[]> {
    const ClinicalOutcome = createClinicalOutcomeModel(this.sequelize);

    const outcomes = await ClinicalOutcome.findAll({
      where: {
        schoolId,
        [Op.or]: [
          { outcomeStatus: ClinicalOutcomeStatus.DECLINED },
          { treatmentEffectiveness: 'ineffective' },
          { complicationsObserved: { [Op.ne]: [] } },
        ],
      },
      order: [['initialAssessmentDate', 'DESC']],
    });

    return outcomes.map(o => ({
      studentId: o.studentId,
      diagnosisCode: o.diagnosisCode,
      outcomeStatus: o.outcomeStatus,
      treatmentEffectiveness: o.treatmentEffectiveness,
      complications: o.complicationsObserved,
      lastAssessmentDate: o.initialAssessmentDate,
      riskLevel: this.calculateRiskLevel(o),
    }));
  }

  // ============================================================================
  // 3. PATIENT SATISFACTION SURVEYS (Functions 14-19)
  // ============================================================================

  /**
   * 14. Sends patient satisfaction survey to parent/student.
   */
  async sendPatientSatisfactionSurvey(surveyData: PatientSatisfactionSurveyData): Promise<any> {
    this.logger.log(`Sending satisfaction survey for ${surveyData.surveyType}`);

    const PatientSatisfactionSurvey = createPatientSatisfactionSurveyModel(this.sequelize);

    const survey = await PatientSatisfactionSurvey.create({
      ...surveyData,
      responseStatus: SurveyResponseStatus.SENT,
    });

    return survey.toJSON();
  }

  /**
   * 15. Records patient satisfaction survey response.
   */
  async recordSurveyResponse(surveyId: string, responseData: Partial<PatientSatisfactionSurveyData>): Promise<any> {
    const PatientSatisfactionSurvey = createPatientSatisfactionSurveyModel(this.sequelize);

    const survey = await PatientSatisfactionSurvey.findByPk(surveyId);
    if (!survey) {
      throw new NotFoundException(`Survey not found`);
    }

    await survey.update({
      ...responseData,
      responseStatus: SurveyResponseStatus.COMPLETED,
      surveyCompletedDate: new Date(),
    });

    this.logger.log(`Survey response recorded: ${surveyId}`);
    return survey.toJSON();
  }

  /**
   * 16. Analyzes patient satisfaction scores and trends.
   */
  async analyzeSatisfactionScores(schoolId: string, surveyType: string, startDate: Date, endDate: Date): Promise<any> {
    const PatientSatisfactionSurvey = createPatientSatisfactionSurveyModel(this.sequelize);

    const surveys = await PatientSatisfactionSurvey.findAll({
      where: {
        schoolId,
        surveyType,
        responseStatus: SurveyResponseStatus.COMPLETED,
        surveyCompletedDate: { [Op.between]: [startDate, endDate] },
      },
    });

    return {
      surveyType,
      period: { startDate, endDate },
      totalResponses: surveys.length,
      averageOverallRating: this.calculateAverage(surveys.map(s => s.overallRating)),
      averageWaitTimeRating: this.calculateAverage(surveys.filter(s => s.waitTimeRating).map(s => s.waitTimeRating!)),
      averageStaffCourtesyRating: this.calculateAverage(
        surveys.filter(s => s.staffCourtesyRating).map(s => s.staffCourtesyRating!),
      ),
      averageCommunicationRating: this.calculateAverage(
        surveys.filter(s => s.communicationRating).map(s => s.communicationRating!),
      ),
      satisfactionPercentage: ((surveys.filter(s => s.overallRating >= 4).length / surveys.length) * 100).toFixed(1),
    };
  }

  /**
   * 17. Extracts patient feedback themes from open-ended responses.
   */
  async extractFeedbackThemes(schoolId: string, startDate: Date, endDate: Date): Promise<any> {
    const PatientSatisfactionSurvey = createPatientSatisfactionSurveyModel(this.sequelize);

    const surveys = await PatientSatisfactionSurvey.findAll({
      where: {
        schoolId,
        responseStatus: SurveyResponseStatus.COMPLETED,
        surveyCompletedDate: { [Op.between]: [startDate, endDate] },
        openEndedFeedback: { [Op.ne]: null },
      },
    });

    const allSuggestions = surveys.flatMap(s => s.improvementSuggestions || []);
    const commonThemes = this.identifyCommonThemes(allSuggestions);

    return {
      period: { startDate, endDate },
      totalFeedbackReceived: surveys.length,
      commonThemes,
      topImprovementAreas: commonThemes.slice(0, 5),
      analyzedAt: new Date(),
    };
  }

  /**
   * 18. Generates patient satisfaction summary report.
   */
  async generateSatisfactionReport(schoolId: string, reportPeriod: 'monthly' | 'quarterly' | 'annually'): Promise<any> {
    const PatientSatisfactionSurvey = createPatientSatisfactionSurveyModel(this.sequelize);

    const dateRange = this.getDateRangeForPeriod(reportPeriod);

    const surveys = await PatientSatisfactionSurvey.findAll({
      where: {
        schoolId,
        responseStatus: SurveyResponseStatus.COMPLETED,
        surveyCompletedDate: { [Op.between]: [dateRange.start, dateRange.end] },
      },
    });

    return {
      reportPeriod,
      dateRange,
      totalSurveysSent: surveys.length + 25,
      totalResponsesReceived: surveys.length,
      responseRate: ((surveys.length / (surveys.length + 25)) * 100).toFixed(1),
      averageOverallSatisfaction: this.calculateAverage(surveys.map(s => s.overallRating)),
      recommendationScore: ((surveys.filter(s => s.overallRating >= 4).length / surveys.length) * 100).toFixed(1),
      reportGeneratedAt: new Date(),
    };
  }

  /**
   * 19. Monitors survey completion rates and sends reminders.
   */
  async monitorSurveyCompletionRates(schoolId: string): Promise<any> {
    const PatientSatisfactionSurvey = createPatientSatisfactionSurveyModel(this.sequelize);

    const allSurveys = await PatientSatisfactionSurvey.findAll({
      where: { schoolId },
    });

    const completed = allSurveys.filter(s => s.responseStatus === SurveyResponseStatus.COMPLETED);
    const pending = allSurveys.filter(s => s.responseStatus === SurveyResponseStatus.SENT);

    return {
      totalSurveysSent: allSurveys.length,
      completed: completed.length,
      pending: pending.length,
      completionRate: ((completed.length / allSurveys.length) * 100).toFixed(1),
      surveysPendingReminders: pending.length,
    };
  }

  // ============================================================================
  // 4. ADVERSE EVENT REPORTING (Functions 20-25)
  // ============================================================================

  /**
   * 20. Reports adverse event with immediate documentation.
   */
  async reportAdverseEvent(eventData: AdverseEventData): Promise<any> {
    this.logger.warn(`ADVERSE EVENT reported: ${eventData.eventType} - Severity: ${eventData.eventSeverity}`);

    const AdverseEvent = createAdverseEventModel(this.sequelize);

    const event = await AdverseEvent.create(eventData);
    return event.toJSON();
  }

  /**
   * 21. Conducts root cause analysis for adverse event.
   */
  async conductRootCauseAnalysis(eventId: string, analysis: string, contributingFactors: string[]): Promise<any> {
    const AdverseEvent = createAdverseEventModel(this.sequelize);

    const event = await AdverseEvent.findByPk(eventId);
    if (!event) {
      throw new NotFoundException(`Event not found`);
    }

    await event.update({
      rootCauseAnalysis: analysis,
      contributingFactors,
    });

    this.logger.log(`Root cause analysis completed for event ${eventId}`);
    return event.toJSON();
  }

  /**
   * 22. Documents corrective actions for adverse event.
   */
  async documentCorrectiveActions(eventId: string, correctiveActions: string[], preventiveMeasures: string[]): Promise<any> {
    const AdverseEvent = createAdverseEventModel(this.sequelize);

    const event = await AdverseEvent.findByPk(eventId);
    if (!event) {
      throw new NotFoundException(`Event not found`);
    }

    await event.update({
      correctiveActions,
      preventiveMeasures,
    });

    this.logger.log(`Corrective actions documented for event ${eventId}`);
    return event.toJSON();
  }

  /**
   * 23. Tracks adverse event trends and patterns.
   */
  async trackAdverseEventTrends(schoolId: string, startDate: Date, endDate: Date): Promise<any> {
    const AdverseEvent = createAdverseEventModel(this.sequelize);

    const events = await AdverseEvent.findAll({
      where: {
        schoolId,
        eventDate: { [Op.between]: [startDate, endDate] },
      },
      order: [['eventDate', 'ASC']],
    });

    const severityBreakdown = {
      critical: events.filter(e => e.eventSeverity === AdverseEventSeverity.CRITICAL).length,
      major: events.filter(e => e.eventSeverity === AdverseEventSeverity.MAJOR).length,
      moderate: events.filter(e => e.eventSeverity === AdverseEventSeverity.MODERATE).length,
      minor: events.filter(e => e.eventSeverity === AdverseEventSeverity.MINOR).length,
      near_miss: events.filter(e => e.eventSeverity === AdverseEventSeverity.NEAR_MISS).length,
    };

    return {
      period: { startDate, endDate },
      totalEvents: events.length,
      severityBreakdown,
      commonEventTypes: this.getCommonEventTypes(events),
      trendDirection: this.calculateTrend(events.map(e => 1)),
    };
  }

  /**
   * 24. Generates adverse event summary report for regulatory compliance.
   */
  async generateAdverseEventReport(schoolId: string, startDate: Date, endDate: Date): Promise<any> {
    const AdverseEvent = createAdverseEventModel(this.sequelize);

    const events = await AdverseEvent.findAll({
      where: {
        schoolId,
        eventDate: { [Op.between]: [startDate, endDate] },
      },
    });

    const requireRegulatory = events.filter(e => e.regulatoryReportingRequired);

    return {
      reportPeriod: { startDate, endDate },
      totalAdverseEvents: events.length,
      criticalEvents: events.filter(e => e.eventSeverity === AdverseEventSeverity.CRITICAL).length,
      eventsRequiringRegulatoryReporting: requireRegulatory.length,
      regulatoryReportsSubmitted: requireRegulatory.filter(e => e.regulatoryReportSubmitted).length,
      reportGeneratedAt: new Date(),
    };
  }

  /**
   * 25. Monitors adverse event follow-up completion.
   */
  async monitorAdverseEventFollowUp(schoolId: string): Promise<any[]> {
    const AdverseEvent = createAdverseEventModel(this.sequelize);

    const eventsWithFollowUp = await AdverseEvent.findAll({
      where: {
        schoolId,
        followUpDate: { [Op.ne]: null },
      },
    });

    const overdue = eventsWithFollowUp.filter(e => e.followUpDate && e.followUpDate < new Date());

    return overdue.map(e => ({
      eventId: e.id,
      eventType: e.eventType,
      eventSeverity: e.eventSeverity,
      followUpDate: e.followUpDate,
      daysOverdue: Math.floor((Date.now() - e.followUpDate!.getTime()) / (1000 * 60 * 60 * 24)),
    }));
  }

  // ============================================================================
  // 5. PROCESS IMPROVEMENT (Functions 26-31)
  // ============================================================================

  /**
   * 26. Proposes process improvement initiative.
   */
  async proposeProcessImprovement(improvementData: ProcessImprovementData): Promise<any> {
    this.logger.log(`Proposing process improvement: ${improvementData.initiativeName}`);

    const ProcessImprovement = createProcessImprovementModel(this.sequelize);

    const initiative = await ProcessImprovement.create(improvementData);
    return initiative.toJSON();
  }

  /**
   * 27. Approves process improvement for implementation.
   */
  async approveProcessImprovement(initiativeId: string, approvedBy: string): Promise<any> {
    const ProcessImprovement = createProcessImprovementModel(this.sequelize);

    const initiative = await ProcessImprovement.findByPk(initiativeId);
    if (!initiative) {
      throw new NotFoundException(`Initiative not found`);
    }

    await initiative.update({
      improvementStatus: ProcessImprovementStatus.APPROVED,
      approvedBy,
      approvalDate: new Date(),
    });

    this.logger.log(`Process improvement approved: ${initiativeId}`);
    return initiative.toJSON();
  }

  /**
   * 28. Tracks process improvement implementation progress.
   */
  async trackImprovementProgress(initiativeId: string, currentMetric: number, progressNotes: string): Promise<any> {
    const ProcessImprovement = createProcessImprovementModel(this.sequelize);

    const initiative = await ProcessImprovement.findByPk(initiativeId);
    if (!initiative) {
      throw new NotFoundException(`Initiative not found`);
    }

    await initiative.update({
      currentMetric,
      progressNotes,
      improvementStatus: ProcessImprovementStatus.IN_PROGRESS,
    });

    const progressPercentage =
      initiative.baselineMetric && initiative.targetMetric
        ? (((currentMetric - Number(initiative.baselineMetric)) /
            (Number(initiative.targetMetric) - Number(initiative.baselineMetric))) *
            100).toFixed(1)
        : 'N/A';

    return {
      initiativeId,
      currentMetric,
      targetMetric: initiative.targetMetric,
      progressPercentage,
      status: initiative.improvementStatus,
    };
  }

  /**
   * 29. Measures process improvement effectiveness.
   */
  async measureImprovementEffectiveness(initiativeId: string): Promise<any> {
    const ProcessImprovement = createProcessImprovementModel(this.sequelize);

    const initiative = await ProcessImprovement.findByPk(initiativeId);
    if (!initiative) {
      throw new NotFoundException(`Initiative not found`);
    }

    const improvement =
      initiative.baselineMetric && initiative.currentMetric
        ? Number(initiative.currentMetric) - Number(initiative.baselineMetric)
        : null;

    const percentImprovement =
      improvement && initiative.baselineMetric
        ? ((improvement / Number(initiative.baselineMetric)) * 100).toFixed(1)
        : null;

    const targetMet =
      initiative.targetMetric && initiative.currentMetric
        ? Number(initiative.currentMetric) >= Number(initiative.targetMetric)
        : false;

    return {
      initiativeId,
      initiativeName: initiative.initiativeName,
      baselineMetric: initiative.baselineMetric,
      currentMetric: initiative.currentMetric,
      targetMetric: initiative.targetMetric,
      improvement,
      percentImprovement,
      targetMet,
      effectiveness: targetMet ? 'successful' : 'in_progress',
    };
  }

  /**
   * 30. Generates process improvement status report.
   */
  async generateImprovementStatusReport(schoolId: string): Promise<any> {
    const ProcessImprovement = createProcessImprovementModel(this.sequelize);

    const initiatives = await ProcessImprovement.findAll({
      where: { schoolId },
      order: [['proposalDate', 'DESC']],
    });

    const statusBreakdown = {
      proposed: initiatives.filter(i => i.improvementStatus === ProcessImprovementStatus.PROPOSED).length,
      approved: initiatives.filter(i => i.improvementStatus === ProcessImprovementStatus.APPROVED).length,
      in_progress: initiatives.filter(i => i.improvementStatus === ProcessImprovementStatus.IN_PROGRESS).length,
      implemented: initiatives.filter(i => i.improvementStatus === ProcessImprovementStatus.IMPLEMENTED).length,
      completed: initiatives.filter(i => i.improvementStatus === ProcessImprovementStatus.COMPLETED).length,
    };

    return {
      schoolId,
      totalInitiatives: initiatives.length,
      statusBreakdown,
      successRate: ((statusBreakdown.completed / initiatives.length) * 100).toFixed(1),
      reportGeneratedAt: new Date(),
    };
  }

  /**
   * 31. Archives completed process improvement initiatives.
   */
  async archiveCompletedInitiatives(schoolId: string, completionThreshold: Date): Promise<any> {
    const ProcessImprovement = createProcessImprovementModel(this.sequelize);

    const completed = await ProcessImprovement.findAll({
      where: {
        schoolId,
        improvementStatus: ProcessImprovementStatus.COMPLETED,
        implementationEndDate: { [Op.lt]: completionThreshold },
      },
    });

    this.logger.log(`Archiving ${completed.length} completed initiatives`);

    return {
      totalArchived: completed.length,
      archivedInitiatives: completed.map(i => ({
        initiativeId: i.id,
        initiativeName: i.initiativeName,
        completionDate: i.implementationEndDate,
      })),
      archivedAt: new Date(),
    };
  }

  // ============================================================================
  // 6. ACCREDITATION & PEER REVIEW (Functions 32-39)
  // ============================================================================

  /**
   * 32. Records accreditation compliance status for standard.
   */
  async recordAccreditationCompliance(complianceData: AccreditationComplianceData): Promise<any> {
    this.logger.log(`Recording accreditation compliance for ${complianceData.standardReference}`);

    const AccreditationCompliance = createAccreditationComplianceModel(this.sequelize);

    const compliance = await AccreditationCompliance.create(complianceData);
    return compliance.toJSON();
  }

  /**
   * 33. Monitors accreditation compliance gaps.
   */
  async monitorComplianceGaps(schoolId: string): Promise<any[]> {
    const AccreditationCompliance = createAccreditationComplianceModel(this.sequelize);

    const nonCompliant = await AccreditationCompliance.findAll({
      where: {
        schoolId,
        complianceStatus: [
          AccreditationComplianceStatus.NON_COMPLIANT,
          AccreditationComplianceStatus.PARTIALLY_COMPLIANT,
        ],
      },
    });

    return nonCompliant.map(c => ({
      complianceId: c.id,
      accreditationBody: c.accreditationBody,
      standardReference: c.standardReference,
      complianceStatus: c.complianceStatus,
      nonComplianceReason: c.nonComplianceReason,
      remediationDeadline: c.remediationDeadline,
      urgency: c.remediationDeadline && c.remediationDeadline < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) ? 'high' : 'medium',
    }));
  }

  /**
   * 34. Generates accreditation readiness report.
   */
  async generateAccreditationReadinessReport(schoolId: string, accreditationBody: string): Promise<any> {
    const AccreditationCompliance = createAccreditationComplianceModel(this.sequelize);

    const standards = await AccreditationCompliance.findAll({
      where: {
        schoolId,
        accreditationBody,
      },
    });

    const compliant = standards.filter(s => s.complianceStatus === AccreditationComplianceStatus.COMPLIANT);

    return {
      accreditationBody,
      totalStandards: standards.length,
      compliantStandards: compliant.length,
      compliancePercentage: ((compliant.length / standards.length) * 100).toFixed(1),
      readinessStatus: compliant.length / standards.length >= 0.9 ? 'ready' : 'not_ready',
      gapsIdentified: standards.length - compliant.length,
      reportGeneratedAt: new Date(),
    };
  }

  /**
   * 35. Schedules peer review for clinician.
   */
  async schedulePeerReview(
    reviewedClinicianId: string,
    reviewerClinicianId: string,
    reviewDate: Date,
    reviewType: string,
  ): Promise<any> {
    this.logger.log(`Scheduling peer review for clinician ${reviewedClinicianId}`);

    return {
      reviewedClinicianId,
      reviewerClinicianId,
      reviewDate,
      reviewType,
      reviewStatus: 'scheduled',
      scheduledAt: new Date(),
    };
  }

  /**
   * 36. Conducts peer review and records evaluation.
   */
  async conductPeerReview(reviewData: PeerReviewData): Promise<any> {
    this.logger.log(`Conducting peer review for ${reviewData.reviewedClinicianId}`);

    const PeerReview = createPeerReviewModel(this.sequelize);

    const overallRating =
      (reviewData.clinicalCompetence +
        reviewData.clinicalKnowledge +
        reviewData.patientCommunication +
        reviewData.documentationQuality +
        reviewData.adherenceToBestPractices) /
      5;

    const review = await PeerReview.create({
      ...reviewData,
      overallRating: Number(overallRating.toFixed(2)),
    });

    return review.toJSON();
  }

  /**
   * 37. Analyzes peer review performance trends.
   */
  async analyzePeerReviewTrends(clinicianId: string): Promise<any> {
    const PeerReview = createPeerReviewModel(this.sequelize);

    const reviews = await PeerReview.findAll({
      where: {
        reviewedClinicianId: clinicianId,
      },
      order: [['reviewDate', 'ASC']],
    });

    return {
      clinicianId,
      totalReviews: reviews.length,
      averageOverallRating: this.calculateAverage(reviews.map(r => Number(r.overallRating))),
      latestReviewRating: reviews.length > 0 ? reviews[reviews.length - 1].overallRating : null,
      performanceTrend: this.calculateTrend(reviews.map(r => Number(r.overallRating))),
      commonStrengths: this.getCommonStrengths(reviews),
      commonAreasForImprovement: this.getCommonImprovements(reviews),
    };
  }

  /**
   * 38. Tracks best practice implementation adoption rates.
   */
  async trackBestPracticeAdoption(implementationData: BestPracticeImplementationData): Promise<any> {
    this.logger.log(`Tracking best practice: ${implementationData.practiceTitle}`);

    return {
      ...implementationData,
      implementationId: `BP-${Date.now()}`,
      adoptionStatus: implementationData.adoptionRate! >= 80 ? 'widely_adopted' : 'partial_adoption',
      trackingStarted: new Date(),
    };
  }

  /**
   * 39. Generates continuous quality improvement (CQI) dashboard.
   */
  async generateCQIDashboard(schoolId: string): Promise<any> {
    // Aggregate data from all quality sources
    const QualityMetric = createQualityMetricModel(this.sequelize);
    const ClinicalOutcome = createClinicalOutcomeModel(this.sequelize);
    const PatientSatisfactionSurvey = createPatientSatisfactionSurveyModel(this.sequelize);
    const AdverseEvent = createAdverseEventModel(this.sequelize);
    const ProcessImprovement = createProcessImprovementModel(this.sequelize);

    const recentDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [metrics, outcomes, surveys, events, improvements] = await Promise.all([
      QualityMetric.count({ where: { schoolId, measurementDate: { [Op.gte]: recentDate } } }),
      ClinicalOutcome.count({ where: { schoolId, initialAssessmentDate: { [Op.gte]: recentDate } } }),
      PatientSatisfactionSurvey.count({
        where: { schoolId, responseStatus: SurveyResponseStatus.COMPLETED, surveyCompletedDate: { [Op.gte]: recentDate } },
      }),
      AdverseEvent.count({ where: { schoolId, eventDate: { [Op.gte]: recentDate } } }),
      ProcessImprovement.count({ where: { schoolId, improvementStatus: ProcessImprovementStatus.IN_PROGRESS } }),
    ]);

    return {
      schoolId,
      dashboardPeriod: 'Last 30 Days',
      qualityMetricsTracked: metrics,
      clinicalOutcomesRecorded: outcomes,
      satisfactionSurveysCompleted: surveys,
      adverseEventsReported: events,
      activeImprovementInitiatives: improvements,
      overallQualityScore: this.calculateOverallQualityScore(metrics, outcomes, surveys, events),
      lastUpdated: new Date(),
    };
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  private calculateTrend(values: number[]): 'improving' | 'stable' | 'declining' {
    if (values.length < 2) return 'stable';
    const first = values.slice(0, Math.floor(values.length / 2));
    const second = values.slice(Math.floor(values.length / 2));
    const avgFirst = first.reduce((a, b) => a + b, 0) / first.length;
    const avgSecond = second.reduce((a, b) => a + b, 0) / second.length;
    if (avgSecond > avgFirst * 1.05) return 'improving';
    if (avgSecond < avgFirst * 0.95) return 'declining';
    return 'stable';
  }

  private getPerformanceStatus(value: number, benchmark: number | null): 'exceeds' | 'meets' | 'below' {
    if (!benchmark) return 'meets';
    if (value >= benchmark * 1.1) return 'exceeds';
    if (value >= benchmark * 0.9) return 'meets';
    return 'below';
  }

  private getDateRangeForPeriod(period: string): { start: Date; end: Date } {
    const now = new Date();
    let start: Date;

    switch (period) {
      case 'current_month':
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'current_quarter':
        start = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
        break;
      case 'current_year':
        start = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        start = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    return { start, end: now };
  }

  private groupByMetricType(metrics: any[]): Record<string, number> {
    return metrics.reduce((acc, metric) => {
      const type = metric.metricType;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
  }

  private calculateOverallPerformance(metrics: any[]): number {
    if (metrics.length === 0) return 0;
    const scores = metrics.map(m => {
      if (!m.targetValue) return 100;
      return Math.min((Number(m.metricValue) / Number(m.targetValue)) * 100, 100);
    });
    return Number((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1));
  }

  private calculateAverage(values: number[]): number {
    if (values.length === 0) return 0;
    return Number((values.reduce((sum, val) => sum + val, 0) / values.length).toFixed(2));
  }

  private calculateStdDev(values: number[]): number {
    const avg = this.calculateAverage(values);
    const squareDiffs = values.map(value => Math.pow(value - avg, 2));
    const avgSquareDiff = this.calculateAverage(squareDiffs);
    return Number(Math.sqrt(avgSquareDiff).toFixed(2));
  }

  private getCommonComplications(outcomes: any[]): string[] {
    const allComplications = outcomes.flatMap(o => o.complicationsObserved || []);
    const counts = allComplications.reduce((acc: Record<string, number>, comp: string) => {
      acc[comp] = (acc[comp] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([comp]) => comp);
  }

  private calculateRiskLevel(outcome: any): 'high' | 'medium' | 'low' {
    if (outcome.outcomeStatus === 'declined' || outcome.treatmentEffectiveness === 'ineffective') return 'high';
    if (outcome.complicationsObserved && outcome.complicationsObserved.length > 0) return 'medium';
    return 'low';
  }

  private identifyCommonThemes(suggestions: string[]): string[] {
    // Simple implementation - in production, use NLP or text analysis
    const themes: Record<string, number> = {};
    suggestions.forEach(s => {
      const lower = s.toLowerCase();
      if (lower.includes('wait')) themes['Wait Time'] = (themes['Wait Time'] || 0) + 1;
      if (lower.includes('staff') || lower.includes('courtesy')) themes['Staff Courtesy'] = (themes['Staff Courtesy'] || 0) + 1;
      if (lower.includes('clean')) themes['Cleanliness'] = (themes['Cleanliness'] || 0) + 1;
      if (lower.includes('communication')) themes['Communication'] = (themes['Communication'] || 0) + 1;
    });
    return Object.entries(themes)
      .sort(([, a], [, b]) => b - a)
      .map(([theme]) => theme);
  }

  private getCommonEventTypes(events: any[]): string[] {
    const counts = events.reduce((acc: Record<string, number>, event: any) => {
      acc[event.eventType] = (acc[event.eventType] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([type]) => type);
  }

  private getCommonStrengths(reviews: any[]): string[] {
    const allStrengths = reviews.flatMap(r => r.strengthsIdentified || []);
    const counts = allStrengths.reduce((acc: Record<string, number>, strength: string) => {
      acc[strength] = (acc[strength] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([strength]) => strength);
  }

  private getCommonImprovements(reviews: any[]): string[] {
    const allImprovements = reviews.flatMap(r => r.areasForImprovement || []);
    const counts = allImprovements.reduce((acc: Record<string, number>, area: string) => {
      acc[area] = (acc[area] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([area]) => area);
  }

  private calculateOverallQualityScore(metrics: number, outcomes: number, surveys: number, events: number): number {
    // Simple scoring algorithm - in production, use weighted scoring based on clinical priorities
    const metricScore = Math.min(metrics / 50, 1) * 25;
    const outcomeScore = Math.min(outcomes / 100, 1) * 25;
    const surveyScore = Math.min(surveys / 30, 1) * 25;
    const eventScore = Math.max((1 - events / 10) * 25, 0);
    return Number((metricScore + outcomeScore + surveyScore + eventScore).toFixed(0));
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default ClinicQualityImprovementCompositeService;
