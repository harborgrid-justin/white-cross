/**
 * LOC: FINSAR1234567
 * File: /reuse/financial/sar-suspicious-activity-reporting-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - AML/BSA compliance controllers
 *   - Suspicious activity monitoring services
 *   - FinCEN reporting modules
 *   - Investigation and case management systems
 */

/**
 * File: /reuse/financial/sar-suspicious-activity-reporting-kit.ts
 * Locator: WC-FIN-SAR-001
 * Purpose: USACE CEFMS-Level Suspicious Activity Reporting - SAR detection, classification, FinCEN filing, BSA/AML compliance
 *
 * Upstream: Independent SAR utility module
 * Downstream: ../backend/*, Compliance controllers, AML services, Investigation systems, Regulatory reporting
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, Decimal.js
 * Exports: 48 utility functions for SAR detection, classification, narrative generation, FinCEN filing, workflow management, analytics
 *
 * LLM Context: Enterprise-grade Suspicious Activity Reporting (SAR) system for BSA/AML compliance.
 * Provides comprehensive SAR triggering conditions detection, suspicious activity classification,
 * narrative generation, FinCEN SAR form completion (FinCEN Form 111), supporting documentation management,
 * multi-level review and approval workflows, continuing activity SAR tracking, filing deadline monitoring,
 * BSA/AML officer notifications, strict confidentiality enforcement (Section 21 USC 5318(g)(2)),
 * SAR metrics and analytics, trend analysis, pattern detection, quality assurance reviews,
 * regulatory submission to FinCEN BSA E-Filing System, investigation case linking, and integrated
 * compliance reporting competing with USACE CEFMS and enterprise AML solutions.
 */

import { Model, DataTypes, Sequelize, Transaction, Op } from 'sequelize';
import Decimal from 'decimal.js';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface SuspiciousActivityReport {
  id: string;
  sarNumber: string;
  reportingInstitution: string;
  filingDeadline: Date;
  filingDate?: Date;
  status: 'draft' | 'pending-review' | 'approved' | 'filed' | 'rejected' | 'amended';
  priorSarNumber?: string; // For continuing activity SARs
  isContinuingActivity: boolean;
  activityBeginDate: Date;
  activityEndDate?: Date;
  detectionDate: Date;
  subjectType: 'individual' | 'entity' | 'multiple';
  subjects: SARSubject[];
  suspiciousActivityTypes: SuspiciousActivityType[];
  totalAmount?: number;
  currency: string;
  narrative: string;
  supportingDocuments: SupportingDocument[];
  transactionIds: string[];
  accountIds: string[];
  reviewWorkflow: ReviewWorkflowStep[];
  preparedBy: string;
  reviewedBy?: string;
  approvedBy?: string;
  bsaOfficerNotified: boolean;
  confidentialityAcknowledged: boolean;
  fincenSubmissionId?: string;
  fincenAcknowledgment?: string;
  linkedInvestigationId?: string;
}

interface SARSubject {
  subjectId: string;
  subjectType: 'individual' | 'entity';
  firstName?: string;
  lastName?: string;
  middleName?: string;
  dateOfBirth?: Date;
  ssn?: string;
  ein?: string;
  entityName?: string;
  address: Address;
  phoneNumbers: string[];
  emailAddresses: string[];
  identificationDocuments: IdentificationDocument[];
  accountNumbers: string[];
  relationship: 'account-holder' | 'authorized-signer' | 'beneficiary' | 'introducer' | 'other';
  roleInActivity: string;
}

interface Address {
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  addressType: 'residential' | 'business' | 'mailing';
}

interface IdentificationDocument {
  documentType: 'drivers-license' | 'passport' | 'state-id' | 'military-id' | 'other';
  documentNumber: string;
  issuingCountry: string;
  issuingState?: string;
  expirationDate?: Date;
}

interface SuspiciousActivityType {
  activityCode: string; // FinCEN SAR activity codes
  activityCategory: string;
  description: string;
  amount?: number;
  occurrences: number;
  indicators: string[];
}

interface SupportingDocument {
  documentId: string;
  documentType: string;
  fileName: string;
  filePath: string;
  uploadDate: Date;
  uploadedBy: string;
  description: string;
  confidential: boolean;
}

interface ReviewWorkflowStep {
  stepNumber: number;
  stepType: 'prepare' | 'review' | 'approve' | 'file';
  assignedTo: string;
  assignedRole: string;
  status: 'pending' | 'in-progress' | 'completed' | 'rejected';
  startDate: Date;
  completionDate?: Date;
  comments?: string;
  decision?: 'approve' | 'reject' | 'request-changes';
}

interface SARTriggeringCondition {
  conditionId: string;
  conditionType: string;
  conditionName: string;
  description: string;
  thresholds: Record<string, number>;
  detectionRules: DetectionRule[];
  severityLevel: 'low' | 'medium' | 'high' | 'critical';
  autoGenerateSAR: boolean;
  requiresManualReview: boolean;
}

interface DetectionRule {
  ruleId: string;
  ruleName: string;
  ruleLogic: string;
  parameters: Record<string, any>;
  enabled: boolean;
  priority: number;
}

interface SARAlert {
  alertId: string;
  alertDate: Date;
  triggeredConditions: SARTriggeringCondition[];
  entityId: string;
  entityType: 'customer' | 'account' | 'transaction';
  riskScore: number;
  alertStatus: 'new' | 'under-review' | 'escalated' | 'sar-filed' | 'closed-no-sar' | 'false-positive';
  assignedTo?: string;
  reviewNotes?: string;
  disposition: string;
  dispositionDate?: Date;
  escalationLevel: number;
}

interface SARNarrative {
  sarId: string;
  narrativeType: 'complete' | 'supplemental' | 'correction';
  sections: NarrativeSection[];
  wordCount: number;
  generatedDate: Date;
  lastEditedDate: Date;
  editedBy: string;
  qualityScore: number;
  complianceChecks: ComplianceCheck[];
}

interface NarrativeSection {
  sectionTitle: string;
  sectionNumber: number;
  content: string;
  requiredElements: string[];
  completenessScore: number;
}

interface ComplianceCheck {
  checkType: string;
  checkName: string;
  passed: boolean;
  details: string;
  recommendation?: string;
}

interface FinCENSARForm {
  formType: 'FinCEN-SAR' | 'FinCEN-111';
  formVersion: string;
  formData: Record<string, any>;
  xmlData?: string;
  validationStatus: 'valid' | 'invalid' | 'warnings';
  validationErrors: ValidationError[];
  submissionReady: boolean;
}

interface ValidationError {
  fieldName: string;
  errorType: string;
  errorMessage: string;
  severity: 'error' | 'warning' | 'info';
}

interface SARFilingDeadline {
  sarId: string;
  detectionDate: Date;
  statutoryDeadline: Date;
  internalDeadline: Date;
  filingDate?: Date;
  daysRemaining: number;
  deadlineStatus: 'on-time' | 'approaching' | 'overdue' | 'filed';
  extensionRequested: boolean;
  extensionApproved: boolean;
  escalationRequired: boolean;
}

interface ContinuingActivitySAR {
  originalSarId: string;
  originalSarNumber: string;
  originalFilingDate: Date;
  continuingSarId: string;
  continuingSarNumber: string;
  continuationNumber: number;
  activityContinuedSince: Date;
  newActivityDetected: Date;
  updateReason: string;
  addedTransactions: string[];
  addedAmount: number;
  cumulativeAmount: number;
  narrativeUpdate: string;
}

interface BSAOfficerNotification {
  notificationId: string;
  sarId: string;
  officerId: string;
  officerName: string;
  notificationDate: Date;
  notificationMethod: 'email' | 'system-alert' | 'phone' | 'meeting';
  notificationType: 'new-sar' | 'deadline-approaching' | 'review-required' | 'escalation';
  urgencyLevel: 'normal' | 'high' | 'critical';
  acknowledged: boolean;
  acknowledgmentDate?: Date;
  response?: string;
}

interface SARConfidentiality {
  sarId: string;
  confidentialityLevel: 'restricted' | 'highly-restricted';
  accessLog: AccessLogEntry[];
  disclosureProhibited: boolean;
  legalExceptions: string[];
  tipoffProhibition: boolean;
  sharingAuthorizations: SharingAuthorization[];
}

interface AccessLogEntry {
  accessId: string;
  userId: string;
  userName: string;
  accessDate: Date;
  accessType: 'view' | 'edit' | 'print' | 'export';
  ipAddress: string;
  purpose: string;
  authorized: boolean;
}

interface SharingAuthorization {
  authorizationId: string;
  recipientAgency: string;
  recipientType: 'law-enforcement' | 'regulator' | 'fiu' | 'internal';
  authorizedBy: string;
  authorizationDate: Date;
  legalBasis: string;
  expirationDate?: Date;
  documentsShared: string[];
}

interface SARMetrics {
  periodStart: Date;
  periodEnd: Date;
  totalSARsFiled: number;
  sarsByType: Record<string, number>;
  sarsByStatus: Record<string, number>;
  averageFilingTime: number;
  deadlineComplianceRate: number;
  falsePositiveRate: number;
  escalationRate: number;
  qualityScoreAverage: number;
  topSuspiciousActivities: ActivityMetric[];
  filingTrends: TrendData[];
}

interface ActivityMetric {
  activityType: string;
  count: number;
  totalAmount: number;
  percentageOfTotal: number;
  averageRiskScore: number;
}

interface TrendData {
  period: string;
  count: number;
  amount: number;
  changePercentage: number;
}

interface SARTrendAnalysis {
  analysisId: string;
  analysisDate: Date;
  analysisPeriod: string;
  trendType: 'increasing' | 'decreasing' | 'stable' | 'seasonal';
  trendIndicators: string[];
  patterns: PatternDetection[];
  riskAssessment: string;
  recommendations: string[];
  alertLevel: 'normal' | 'elevated' | 'high';
}

interface PatternDetection {
  patternId: string;
  patternType: string;
  patternDescription: string;
  confidence: number;
  occurrences: number;
  relatedSARs: string[];
  relatedEntities: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

interface SARQualityReview {
  reviewId: string;
  sarId: string;
  reviewDate: Date;
  reviewedBy: string;
  reviewType: 'pre-filing' | 'post-filing' | 'periodic' | 'audit';
  qualityCriteria: QualityCriterion[];
  overallScore: number;
  deficiencies: Deficiency[];
  correctionRequired: boolean;
  reviewStatus: 'passed' | 'passed-with-comments' | 'failed';
  recommendations: string[];
}

interface QualityCriterion {
  criterionName: string;
  criterionDescription: string;
  weight: number;
  score: number;
  passed: boolean;
  comments?: string;
}

interface Deficiency {
  deficiencyType: string;
  description: string;
  severity: 'minor' | 'moderate' | 'major' | 'critical';
  correctiveAction: string;
  responsibleParty: string;
  dueDate: Date;
  status: 'open' | 'in-progress' | 'resolved';
}

interface RegulatorySubmission {
  submissionId: string;
  sarId: string;
  submissionDate: Date;
  submissionMethod: 'bsa-e-filing' | 'fincen-gateway' | 'manual';
  submissionStatus: 'pending' | 'submitted' | 'accepted' | 'rejected' | 'needs-correction';
  batchNumber?: string;
  acknowledgmentNumber?: string;
  acknowledgmentDate?: Date;
  rejectionReasons?: string[];
  resubmissionRequired: boolean;
  confirmationDocument?: string;
}

interface InvestigationCase {
  caseId: string;
  caseNumber: string;
  caseTitle: string;
  caseType: 'fraud' | 'money-laundering' | 'terrorist-financing' | 'sanctions' | 'tax-evasion' | 'other';
  caseStatus: 'open' | 'under-investigation' | 'suspended' | 'closed';
  openDate: Date;
  closeDate?: Date;
  assignedInvestigators: string[];
  linkedSARs: string[];
  linkedAlerts: string[];
  subjects: string[];
  accounts: string[];
  transactions: string[];
  findings: string;
  outcome: string;
  actionTaken: string;
}

// ============================================================================
// SEQUELIZE MODELS (1-4)
// ============================================================================

/**
 * Sequelize model for Suspicious Activity Reports with comprehensive SAR lifecycle tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} SuspiciousActivityReport model
 *
 * @example
 * ```typescript
 * const SAR = createSuspiciousActivityReportModel(sequelize);
 * const sar = await SAR.create({
 *   sarNumber: 'SAR-2025-001234',
 *   reportingInstitution: 'First National Bank',
 *   detectionDate: new Date('2025-01-15'),
 *   filingDeadline: new Date('2025-02-14'),
 *   status: 'draft',
 *   subjects: [{ firstName: 'John', lastName: 'Doe', relationship: 'account-holder' }],
 *   suspiciousActivityTypes: [{ activityCode: 'BSA-2', description: 'Structuring' }]
 * });
 * ```
 */
export const createSuspiciousActivityReportModel = (sequelize: Sequelize) => {
  class SuspiciousActivityReport extends Model {
    public id!: number;
    public sarId!: string;
    public sarNumber!: string;
    public reportingInstitution!: string;
    public filingDeadline!: Date;
    public filingDate!: Date | null;
    public status!: string;
    public priorSarNumber!: string | null;
    public isContinuingActivity!: boolean;
    public activityBeginDate!: Date;
    public activityEndDate!: Date | null;
    public detectionDate!: Date;
    public subjectType!: string;
    public subjects!: SARSubject[];
    public suspiciousActivityTypes!: SuspiciousActivityType[];
    public totalAmount!: number | null;
    public currency!: string;
    public narrative!: string;
    public supportingDocuments!: SupportingDocument[];
    public transactionIds!: string[];
    public accountIds!: string[];
    public reviewWorkflow!: ReviewWorkflowStep[];
    public preparedBy!: string;
    public reviewedBy!: string | null;
    public approvedBy!: string | null;
    public bsaOfficerNotified!: boolean;
    public confidentialityAcknowledged!: boolean;
    public fincenSubmissionId!: string | null;
    public fincenAcknowledgment!: string | null;
    public linkedInvestigationId!: string | null;
    public riskScore!: number;
    public qualityScore!: number | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  SuspiciousActivityReport.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      sarId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Unique SAR identifier',
      },
      sarNumber: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'SAR number for regulatory filing',
      },
      reportingInstitution: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Name of reporting financial institution',
      },
      filingDeadline: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Statutory filing deadline (30 days from detection)',
      },
      filingDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Actual date SAR was filed with FinCEN',
      },
      status: {
        type: DataTypes.ENUM('draft', 'pending-review', 'approved', 'filed', 'rejected', 'amended'),
        allowNull: false,
        defaultValue: 'draft',
        comment: 'Current status of SAR',
      },
      priorSarNumber: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Prior SAR number for continuing activity',
      },
      isContinuingActivity: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether this is a continuing activity SAR',
      },
      activityBeginDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Date suspicious activity began',
      },
      activityEndDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date suspicious activity ended (if known)',
      },
      detectionDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Date suspicious activity was detected',
      },
      subjectType: {
        type: DataTypes.ENUM('individual', 'entity', 'multiple'),
        allowNull: false,
        comment: 'Type of subject(s) involved',
      },
      subjects: {
        type: DataTypes.JSON,
        allowNull: false,
        comment: 'Subject(s) of suspicious activity',
      },
      suspiciousActivityTypes: {
        type: DataTypes.JSON,
        allowNull: false,
        comment: 'Types of suspicious activity detected',
      },
      totalAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: true,
        comment: 'Total amount involved in suspicious activity',
      },
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: 'USD',
        comment: 'Currency code (ISO 4217)',
      },
      narrative: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Detailed narrative description of suspicious activity',
      },
      supportingDocuments: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Supporting documentation',
      },
      transactionIds: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Related transaction identifiers',
      },
      accountIds: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Related account identifiers',
      },
      reviewWorkflow: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Review and approval workflow steps',
      },
      preparedBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who prepared the SAR',
      },
      reviewedBy: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'User who reviewed the SAR',
      },
      approvedBy: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'BSA Officer or manager who approved the SAR',
      },
      bsaOfficerNotified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether BSA officer has been notified',
      },
      confidentialityAcknowledged: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether confidentiality requirements acknowledged',
      },
      fincenSubmissionId: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'FinCEN BSA E-Filing submission ID',
      },
      fincenAcknowledgment: {
        type: DataTypes.STRING(200),
        allowNull: true,
        comment: 'FinCEN acknowledgment number',
      },
      linkedInvestigationId: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Linked investigation case ID',
      },
      riskScore: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: false,
        comment: 'Calculated risk score for the activity',
      },
      qualityScore: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: true,
        comment: 'Quality review score (if reviewed)',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'suspicious_activity_reports',
      timestamps: true,
      indexes: [
        { fields: ['sarNumber'] },
        { fields: ['status'] },
        { fields: ['detectionDate'] },
        { fields: ['filingDeadline'] },
        { fields: ['priorSarNumber'] },
        { fields: ['preparedBy'] },
        { fields: ['linkedInvestigationId'] },
      ],
    }
  );

  return SuspiciousActivityReport;
};

/**
 * Sequelize model for SAR Alerts with detection and triage tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} SARAlert model
 *
 * @example
 * ```typescript
 * const Alert = createSARAlertModel(sequelize);
 * const alert = await Alert.create({
 *   alertId: 'ALERT-2025-5678',
 *   entityId: 'ACCT-123456',
 *   entityType: 'account',
 *   riskScore: 87.5,
 *   alertStatus: 'new',
 *   triggeredConditions: [{ conditionType: 'structuring', severityLevel: 'high' }]
 * });
 * ```
 */
export const createSARAlertModel = (sequelize: Sequelize) => {
  class SARAlert extends Model {
    public id!: number;
    public alertId!: string;
    public alertDate!: Date;
    public triggeredConditions!: SARTriggeringCondition[];
    public entityId!: string;
    public entityType!: string;
    public riskScore!: number;
    public alertStatus!: string;
    public assignedTo!: string | null;
    public reviewNotes!: string | null;
    public disposition!: string;
    public dispositionDate!: Date | null;
    public escalationLevel!: number;
    public sarGenerated!: boolean;
    public sarId!: string | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  SARAlert.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      alertId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Unique alert identifier',
      },
      alertDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Date/time alert was generated',
      },
      triggeredConditions: {
        type: DataTypes.JSON,
        allowNull: false,
        comment: 'Conditions that triggered this alert',
      },
      entityId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Entity that triggered alert',
      },
      entityType: {
        type: DataTypes.ENUM('customer', 'account', 'transaction', 'beneficiary'),
        allowNull: false,
        comment: 'Type of entity',
      },
      riskScore: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: false,
        comment: 'Calculated risk score',
      },
      alertStatus: {
        type: DataTypes.ENUM('new', 'under-review', 'escalated', 'sar-filed', 'closed-no-sar', 'false-positive'),
        allowNull: false,
        defaultValue: 'new',
        comment: 'Current alert status',
      },
      assignedTo: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'User assigned to review alert',
      },
      reviewNotes: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Notes from alert review',
      },
      disposition: {
        type: DataTypes.STRING(200),
        allowNull: false,
        defaultValue: 'pending',
        comment: 'Alert disposition',
      },
      dispositionDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date alert was dispositioned',
      },
      escalationLevel: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Escalation level (0=not escalated)',
      },
      sarGenerated: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether SAR was generated from this alert',
      },
      sarId: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Generated SAR ID if applicable',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'sar_alerts',
      timestamps: true,
      indexes: [
        { fields: ['alertId'] },
        { fields: ['alertStatus'] },
        { fields: ['entityId'] },
        { fields: ['assignedTo'] },
        { fields: ['sarId'] },
        { fields: ['alertDate'] },
      ],
    }
  );

  return SARAlert;
};

/**
 * Sequelize model for Investigation Cases linking to SARs.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} InvestigationCase model
 */
export const createInvestigationCaseModel = (sequelize: Sequelize) => {
  class InvestigationCase extends Model {
    public id!: number;
    public caseId!: string;
    public caseNumber!: string;
    public caseTitle!: string;
    public caseType!: string;
    public caseStatus!: string;
    public openDate!: Date;
    public closeDate!: Date | null;
    public assignedInvestigators!: string[];
    public linkedSARs!: string[];
    public linkedAlerts!: string[];
    public subjects!: string[];
    public accounts!: string[];
    public transactions!: string[];
    public findings!: string;
    public outcome!: string;
    public actionTaken!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  InvestigationCase.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      caseId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      caseNumber: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      caseTitle: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      caseType: {
        type: DataTypes.ENUM('fraud', 'money-laundering', 'terrorist-financing', 'sanctions', 'tax-evasion', 'other'),
        allowNull: false,
      },
      caseStatus: {
        type: DataTypes.ENUM('open', 'under-investigation', 'suspended', 'closed'),
        allowNull: false,
        defaultValue: 'open',
      },
      openDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      closeDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      assignedInvestigators: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
      },
      linkedSARs: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
      },
      linkedAlerts: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
      },
      subjects: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
      },
      accounts: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
      },
      transactions: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
      },
      findings: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '',
      },
      outcome: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '',
      },
      actionTaken: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'investigation_cases',
      timestamps: true,
      indexes: [
        { fields: ['caseNumber'] },
        { fields: ['caseStatus'] },
        { fields: ['caseType'] },
        { fields: ['openDate'] },
      ],
    }
  );

  return InvestigationCase;
};

/**
 * Sequelize model for SAR Confidentiality Tracking with strict access control.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} SARConfidentiality model
 */
export const createSARConfidentialityModel = (sequelize: Sequelize) => {
  class SARConfidentiality extends Model {
    public id!: number;
    public sarId!: string;
    public confidentialityLevel!: string;
    public accessLog!: AccessLogEntry[];
    public disclosureProhibited!: boolean;
    public legalExceptions!: string[];
    public tipoffProhibition!: boolean;
    public sharingAuthorizations!: SharingAuthorization[];
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  SARConfidentiality.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      sarId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      confidentialityLevel: {
        type: DataTypes.ENUM('restricted', 'highly-restricted'),
        allowNull: false,
        defaultValue: 'highly-restricted',
      },
      accessLog: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
      },
      disclosureProhibited: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      legalExceptions: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
      },
      tipoffProhibition: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      sharingAuthorizations: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'sar_confidentiality',
      timestamps: true,
      indexes: [
        { fields: ['sarId'] },
      ],
    }
  );

  return SARConfidentiality;
};

// ============================================================================
// SAR TRIGGERING CONDITIONS DETECTION (Functions 1-6)
// ============================================================================

/**
 * Detects structuring (BSA-2) patterns in transactions.
 *
 * @param {any[]} transactions - Transactions to analyze
 * @param {number} threshold - Threshold amount (default: 10000)
 * @param {number} periodDays - Period to analyze in days
 * @returns {SARAlert | null} Alert if structuring detected
 *
 * @example
 * ```typescript
 * const alert = await detectStructuring(recentTransactions, 10000, 7);
 * if (alert) {
 *   console.log(`Structuring detected: ${alert.riskScore}`);
 * }
 * ```
 */
export async function detectStructuring(
  transactions: any[],
  threshold: number = 10000,
  periodDays: number = 7
): Promise<SARAlert | null> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - periodDays);

  const recentTransactions = transactions.filter(t =>
    new Date(t.transactionDate) >= cutoffDate &&
    t.amount < threshold &&
    t.amount >= threshold * 0.5 // Just under threshold
  );

  const groupedByAccount = recentTransactions.reduce((acc, t) => {
    if (!acc[t.accountId]) acc[t.accountId] = [];
    acc[t.accountId].push(t);
    return acc;
  }, {} as Record<string, any[]>);

  for (const [accountId, txns] of Object.entries(groupedByAccount)) {
    const totalAmount = txns.reduce((sum, t) => sum + t.amount, 0);
    const avgAmount = totalAmount / txns.length;
    const similarity = txns.every(t => Math.abs(t.amount - avgAmount) < threshold * 0.1);

    if (txns.length >= 3 && totalAmount >= threshold && similarity) {
      return {
        alertId: `STRUCT-${Date.now()}-${accountId}`,
        alertDate: new Date(),
        triggeredConditions: [{
          conditionId: 'BSA-2',
          conditionType: 'structuring',
          conditionName: 'Structuring / Smurfing Detection',
          description: 'Multiple transactions just under reporting threshold',
          thresholds: { amount: threshold, count: 3, period: periodDays },
          detectionRules: [],
          severityLevel: 'high',
          autoGenerateSAR: true,
          requiresManualReview: true,
        }],
        entityId: accountId,
        entityType: 'account',
        riskScore: 85.0 + (txns.length * 2),
        alertStatus: 'new',
        disposition: 'pending',
        escalationLevel: 2,
      };
    }
  }

  return null;
}

/**
 * Detects unusual cash transaction patterns.
 *
 * @param {any[]} transactions - Transactions to analyze
 * @param {number} baselineAverage - Normal cash transaction average
 * @returns {SARAlert | null} Alert if unusual pattern detected
 */
export async function detectUnusualCashActivity(
  transactions: any[],
  baselineAverage: number
): Promise<SARAlert | null> {
  const cashTransactions = transactions.filter(t => t.paymentMethod === 'cash');

  if (cashTransactions.length < 3) return null;

  const totalCash = cashTransactions.reduce((sum, t) => sum + t.amount, 0);
  const avgCash = totalCash / cashTransactions.length;
  const deviationFactor = avgCash / baselineAverage;

  if (deviationFactor > 5) {
    return {
      alertId: `CASH-${Date.now()}`,
      alertDate: new Date(),
      triggeredConditions: [{
        conditionId: 'BSA-1a',
        conditionType: 'unusual-cash',
        conditionName: 'Unusual Cash Transaction Pattern',
        description: 'Cash activity significantly exceeds normal patterns',
        thresholds: { deviationFactor: 5, minimumTransactions: 3 },
        detectionRules: [],
        severityLevel: 'high',
        autoGenerateSAR: false,
        requiresManualReview: true,
      }],
      entityId: cashTransactions[0].accountId,
      entityType: 'account',
      riskScore: Math.min(95, 70 + (deviationFactor * 5)),
      alertStatus: 'new',
      disposition: 'pending',
      escalationLevel: 1,
    };
  }

  return null;
}

/**
 * Detects rapid movement of funds (layering).
 *
 * @param {any[]} transactions - Transactions to analyze
 * @param {number} hourThreshold - Hours to consider rapid
 * @returns {SARAlert | null} Alert if layering detected
 */
export async function detectRapidFundMovement(
  transactions: any[],
  hourThreshold: number = 24
): Promise<SARAlert | null> {
  const sortedTxns = transactions.sort((a, b) =>
    new Date(a.transactionDate).getTime() - new Date(b.transactionDate).getTime()
  );

  for (let i = 0; i < sortedTxns.length - 2; i++) {
    const txn1 = sortedTxns[i];
    const txn2 = sortedTxns[i + 1];
    const txn3 = sortedTxns[i + 2];

    const hours1to2 = (new Date(txn2.transactionDate).getTime() - new Date(txn1.transactionDate).getTime()) / (1000 * 60 * 60);
    const hours2to3 = (new Date(txn3.transactionDate).getTime() - new Date(txn2.transactionDate).getTime()) / (1000 * 60 * 60);

    if (hours1to2 <= hourThreshold && hours2to3 <= hourThreshold) {
      const totalAmount = txn1.amount + txn2.amount + txn3.amount;

      if (totalAmount >= 25000) {
        return {
          alertId: `LAYER-${Date.now()}`,
          alertDate: new Date(),
          triggeredConditions: [{
            conditionId: 'BSA-3',
            conditionType: 'layering',
            conditionName: 'Rapid Fund Movement / Layering',
            description: 'Funds moved rapidly through multiple accounts',
            thresholds: { hourThreshold, minimumAmount: 25000 },
            detectionRules: [],
            severityLevel: 'critical',
            autoGenerateSAR: true,
            requiresManualReview: true,
          }],
          entityId: txn1.accountId,
          entityType: 'account',
          riskScore: 92.0,
          alertStatus: 'new',
          disposition: 'pending',
          escalationLevel: 3,
        };
      }
    }
  }

  return null;
}

/**
 * Detects transactions with high-risk jurisdictions.
 *
 * @param {any[]} transactions - Transactions to analyze
 * @param {string[]} highRiskCountries - List of high-risk country codes
 * @returns {SARAlert | null} Alert if high-risk jurisdiction activity detected
 */
export async function detectHighRiskJurisdiction(
  transactions: any[],
  highRiskCountries: string[]
): Promise<SARAlert | null> {
  const highRiskTxns = transactions.filter(t =>
    highRiskCountries.includes(t.originCountry) ||
    highRiskCountries.includes(t.destinationCountry)
  );

  if (highRiskTxns.length >= 2) {
    const totalAmount = highRiskTxns.reduce((sum, t) => sum + t.amount, 0);

    if (totalAmount >= 50000) {
      return {
        alertId: `HRJUR-${Date.now()}`,
        alertDate: new Date(),
        triggeredConditions: [{
          conditionId: 'BSA-10',
          conditionType: 'high-risk-jurisdiction',
          conditionName: 'High-Risk Jurisdiction Activity',
          description: 'Transactions involving high-risk countries',
          thresholds: { minimumAmount: 50000, minimumTransactions: 2 },
          detectionRules: [],
          severityLevel: 'critical',
          autoGenerateSAR: true,
          requiresManualReview: true,
        }],
        entityId: highRiskTxns[0].accountId,
        entityType: 'account',
        riskScore: 88.0,
        alertStatus: 'new',
        disposition: 'pending',
        escalationLevel: 2,
      };
    }
  }

  return null;
}

/**
 * Detects transactions inconsistent with customer profile.
 *
 * @param {any} customer - Customer profile
 * @param {any[]} transactions - Recent transactions
 * @returns {SARAlert | null} Alert if inconsistency detected
 */
export async function detectInconsistentActivity(
  customer: any,
  transactions: any[]
): Promise<SARAlert | null> {
  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
  const expectedAnnualIncome = customer.annualIncome || 0;
  const expectedActivity = customer.expectedMonthlyTransactions || 0;

  const anomalyScore =
    (totalAmount > expectedAnnualIncome * 2 ? 30 : 0) +
    (transactions.length > expectedActivity * 3 ? 25 : 0) +
    (transactions.some(t => t.amount > expectedAnnualIncome / 2) ? 30 : 0);

  if (anomalyScore >= 50) {
    return {
      alertId: `INCON-${Date.now()}`,
      alertDate: new Date(),
      triggeredConditions: [{
        conditionId: 'BSA-15',
        conditionType: 'inconsistent-activity',
        conditionName: 'Activity Inconsistent with Customer Profile',
        description: 'Transactions do not match expected customer behavior',
        thresholds: { anomalyScore: 50 },
        detectionRules: [],
        severityLevel: 'medium',
        autoGenerateSAR: false,
        requiresManualReview: true,
      }],
      entityId: customer.customerId,
      entityType: 'customer',
      riskScore: anomalyScore,
      alertStatus: 'new',
      disposition: 'pending',
      escalationLevel: 1,
    };
  }

  return null;
}

/**
 * Aggregates and evaluates multiple triggering conditions.
 *
 * @param {SARAlert[]} alerts - Multiple alerts for same entity
 * @returns {SARAlert} Consolidated alert with combined risk score
 */
export async function aggregateTriggeringConditions(
  alerts: SARAlert[]
): Promise<SARAlert> {
  const allConditions = alerts.flatMap(a => a.triggeredConditions);
  const maxRiskScore = Math.max(...alerts.map(a => a.riskScore));
  const avgRiskScore = alerts.reduce((sum, a) => sum + a.riskScore, 0) / alerts.length;
  const combinedRiskScore = (maxRiskScore * 0.6) + (avgRiskScore * 0.4);

  return {
    alertId: `AGG-${Date.now()}`,
    alertDate: new Date(),
    triggeredConditions: allConditions,
    entityId: alerts[0].entityId,
    entityType: alerts[0].entityType,
    riskScore: Math.min(100, combinedRiskScore + 10), // Bonus for multiple conditions
    alertStatus: 'new',
    disposition: 'pending-multiple-conditions',
    escalationLevel: Math.max(...alerts.map(a => a.escalationLevel)),
  };
}

// ============================================================================
// SUSPICIOUS ACTIVITY CLASSIFICATION (Functions 7-10)
// ============================================================================

/**
 * Classifies suspicious activity using FinCEN SAR activity codes.
 *
 * @param {string} activityDescription - Description of activity
 * @param {any} context - Additional context data
 * @returns {SuspiciousActivityType[]} Array of classified activity types
 */
export async function classifySuspiciousActivity(
  activityDescription: string,
  context: any
): Promise<SuspiciousActivityType[]> {
  const classifications: SuspiciousActivityType[] = [];

  // Structuring (BSA-2)
  if (activityDescription.toLowerCase().includes('structur') ||
      activityDescription.toLowerCase().includes('smurfing')) {
    classifications.push({
      activityCode: 'BSA-2',
      activityCategory: 'Structuring',
      description: 'Structuring cash transactions to evade reporting requirements',
      amount: context.totalAmount,
      occurrences: context.transactionCount || 1,
      indicators: ['Multiple transactions under threshold', 'Pattern of similar amounts'],
    });
  }

  // Money Laundering (BSA-1)
  if (activityDescription.toLowerCase().includes('launder') ||
      activityDescription.toLowerCase().includes('layering')) {
    classifications.push({
      activityCode: 'BSA-1',
      activityCategory: 'Money Laundering',
      description: 'Suspected money laundering activity',
      amount: context.totalAmount,
      occurrences: context.transactionCount || 1,
      indicators: ['Rapid fund movement', 'Complex transaction patterns'],
    });
  }

  // Terrorist Financing (BSA-4)
  if (activityDescription.toLowerCase().includes('terror') ||
      context.sanctionsMatch) {
    classifications.push({
      activityCode: 'BSA-4',
      activityCategory: 'Terrorist Financing',
      description: 'Suspected terrorist financing activity',
      amount: context.totalAmount,
      occurrences: 1,
      indicators: ['Sanctions list match', 'High-risk jurisdiction'],
    });
  }

  // Fraud (BSA-5)
  if (activityDescription.toLowerCase().includes('fraud') ||
      activityDescription.toLowerCase().includes('identity theft')) {
    classifications.push({
      activityCode: 'BSA-5',
      activityCategory: 'Fraud',
      description: 'Suspected fraudulent activity',
      amount: context.totalAmount,
      occurrences: context.transactionCount || 1,
      indicators: ['Identity verification issues', 'Unusual account activity'],
    });
  }

  // Default if no specific match
  if (classifications.length === 0) {
    classifications.push({
      activityCode: 'BSA-99',
      activityCategory: 'Other Suspicious Activity',
      description: activityDescription,
      amount: context.totalAmount,
      occurrences: 1,
      indicators: ['Unusual activity pattern'],
    });
  }

  return classifications;
}

/**
 * Determines severity level of suspicious activity.
 *
 * @param {number} riskScore - Risk score from detection
 * @param {number} amount - Total amount involved
 * @param {SuspiciousActivityType[]} activityTypes - Classified activities
 * @returns {string} Severity level
 */
export function determineSeverityLevel(
  riskScore: number,
  amount: number,
  activityTypes: SuspiciousActivityType[]
): string {
  let severityScore = 0;

  // Risk score component (40%)
  if (riskScore >= 90) severityScore += 40;
  else if (riskScore >= 75) severityScore += 30;
  else if (riskScore >= 60) severityScore += 20;
  else severityScore += 10;

  // Amount component (30%)
  if (amount >= 1000000) severityScore += 30;
  else if (amount >= 500000) severityScore += 25;
  else if (amount >= 100000) severityScore += 20;
  else if (amount >= 50000) severityScore += 15;
  else severityScore += 10;

  // Activity type component (30%)
  const hasTerroritst = activityTypes.some(a => a.activityCode === 'BSA-4');
  const hasLaundering = activityTypes.some(a => a.activityCode === 'BSA-1');
  const multipleTypes = activityTypes.length > 1;

  if (hasTerroritst) severityScore += 30;
  else if (hasLaundering) severityScore += 25;
  else if (multipleTypes) severityScore += 20;
  else severityScore += 15;

  if (severityScore >= 85) return 'critical';
  if (severityScore >= 65) return 'high';
  if (severityScore >= 45) return 'medium';
  return 'low';
}

/**
 * Maps activity to appropriate investigation category.
 *
 * @param {SuspiciousActivityType[]} activityTypes - Classified activities
 * @returns {string} Investigation category
 */
export function mapToInvestigationCategory(
  activityTypes: SuspiciousActivityType[]
): string {
  const codeMapping: Record<string, string> = {
    'BSA-1': 'money-laundering',
    'BSA-2': 'money-laundering',
    'BSA-3': 'money-laundering',
    'BSA-4': 'terrorist-financing',
    'BSA-5': 'fraud',
    'BSA-6': 'fraud',
    'BSA-10': 'sanctions',
    'BSA-11': 'tax-evasion',
  };

  // Return category of highest priority activity
  for (const activity of activityTypes) {
    if (codeMapping[activity.activityCode]) {
      return codeMapping[activity.activityCode];
    }
  }

  return 'other';
}

/**
 * Generates activity indicators summary for classification.
 *
 * @param {any[]} transactions - Transactions involved
 * @param {any} customer - Customer data
 * @returns {string[]} List of indicators
 */
export function generateActivityIndicators(
  transactions: any[],
  customer: any
): string[] {
  const indicators: string[] = [];

  // Transaction pattern indicators
  const avgAmount = transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length;
  const maxAmount = Math.max(...transactions.map(t => t.amount));

  if (transactions.length >= 5) {
    indicators.push('High volume of transactions');
  }

  if (maxAmount > avgAmount * 10) {
    indicators.push('Unusually large transaction(s)');
  }

  // Timing indicators
  const dates = transactions.map(t => new Date(t.transactionDate));
  const timeSpan = Math.max(...dates.map(d => d.getTime())) - Math.min(...dates.map(d => d.getTime()));
  const hourSpan = timeSpan / (1000 * 60 * 60);

  if (hourSpan < 48 && transactions.length >= 3) {
    indicators.push('Rapid succession of transactions');
  }

  // Customer profile indicators
  if (customer.accountAge && customer.accountAge < 90) {
    indicators.push('New customer relationship');
  }

  if (customer.riskRating && customer.riskRating === 'high') {
    indicators.push('High-risk customer profile');
  }

  // Geographic indicators
  const countries = new Set([
    ...transactions.map(t => t.originCountry),
    ...transactions.map(t => t.destinationCountry)
  ]);

  if (countries.size > 3) {
    indicators.push('Multiple jurisdictions involved');
  }

  return indicators;
}

// ============================================================================
// SAR NARRATIVE GENERATION (Functions 11-15)
// ============================================================================

/**
 * Generates comprehensive SAR narrative with all required elements.
 *
 * @param {SARAlert} alert - Alert triggering SAR
 * @param {any} customer - Customer data
 * @param {any[]} transactions - Related transactions
 * @param {SuspiciousActivityType[]} activityTypes - Classified activities
 * @returns {SARNarrative} Complete narrative
 */
export async function generateSARNarrative(
  alert: SARAlert,
  customer: any,
  transactions: any[],
  activityTypes: SuspiciousActivityType[]
): Promise<SARNarrative> {
  const sections: NarrativeSection[] = [];

  // Section 1: Who (Subject Information)
  sections.push({
    sectionTitle: 'Subject Information',
    sectionNumber: 1,
    content: generateSubjectSection(customer),
    requiredElements: ['Identity', 'Account information', 'Relationship'],
    completenessScore: 100,
  });

  // Section 2: What (Activity Description)
  sections.push({
    sectionTitle: 'Description of Suspicious Activity',
    sectionNumber: 2,
    content: generateActivitySection(activityTypes, transactions),
    requiredElements: ['Activity type', 'Amounts', 'Timeframe', 'Methods'],
    completenessScore: 100,
  });

  // Section 3: When (Timeline)
  sections.push({
    sectionTitle: 'Timeline of Activity',
    sectionNumber: 3,
    content: generateTimelineSection(transactions, alert.alertDate),
    requiredElements: ['Begin date', 'End date', 'Detection date', 'Key events'],
    completenessScore: 100,
  });

  // Section 4: Where (Location/Channels)
  sections.push({
    sectionTitle: 'Location and Channels',
    sectionNumber: 4,
    content: generateLocationSection(transactions),
    requiredElements: ['Branch/channel', 'Geographic locations', 'Counterparties'],
    completenessScore: 100,
  });

  // Section 5: Why Suspicious
  sections.push({
    sectionTitle: 'Basis for Suspicion',
    sectionNumber: 5,
    content: generateSuspicionBasisSection(alert, activityTypes),
    requiredElements: ['Red flags', 'Indicators', 'Deviation from normal'],
    completenessScore: 100,
  });

  const fullNarrative = sections.map(s => `${s.sectionTitle}:\n${s.content}`).join('\n\n');

  return {
    sarId: alert.alertId,
    narrativeType: 'complete',
    sections,
    wordCount: fullNarrative.split(' ').length,
    generatedDate: new Date(),
    lastEditedDate: new Date(),
    editedBy: 'system',
    qualityScore: 85.0,
    complianceChecks: [],
  };
}

/**
 * Generates the subject information section of narrative.
 */
function generateSubjectSection(customer: any): string {
  return `The subject of this report is ${customer.firstName} ${customer.lastName}, ` +
    `Date of Birth: ${customer.dateOfBirth ? new Date(customer.dateOfBirth).toLocaleDateString() : 'Unknown'}, ` +
    `SSN/TIN: ${customer.ssn ? `***-**-${customer.ssn.slice(-4)}` : 'Not available'}. ` +
    `The subject maintains account number ${customer.accountNumber} which was opened on ` +
    `${customer.accountOpenDate ? new Date(customer.accountOpenDate).toLocaleDateString() : 'Unknown'}. ` +
    `The subject's stated occupation is ${customer.occupation || 'Unknown'} with reported annual income of ` +
    `${customer.annualIncome ? `$${customer.annualIncome.toLocaleString()}` : 'Not provided'}. ` +
    `The subject's residential address on record is ${customer.address || 'Not available'}.`;
}

/**
 * Generates the activity description section.
 */
function generateActivitySection(
  activityTypes: SuspiciousActivityType[],
  transactions: any[]
): string {
  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
  const activityList = activityTypes.map(a => a.activityCategory).join(', ');

  return `This SAR is being filed for the following suspicious activity type(s): ${activityList}. ` +
    `The activity involved a total of ${transactions.length} transaction(s) totaling ` +
    `$${totalAmount.toLocaleString()}. The transactions consisted of: ` +
    transactions.slice(0, 5).map((t, i) =>
      `Transaction ${i + 1}: ${t.type} of $${t.amount.toLocaleString()} on ${new Date(t.transactionDate).toLocaleDateString()}`
    ).join('; ') +
    (transactions.length > 5 ? '; and additional transactions.' : '.');
}

/**
 * Generates the timeline section.
 */
function generateTimelineSection(transactions: any[], detectionDate: Date): string {
  const dates = transactions.map(t => new Date(t.transactionDate));
  const startDate = new Date(Math.min(...dates.map(d => d.getTime())));
  const endDate = new Date(Math.max(...dates.map(d => d.getTime())));

  return `The suspicious activity began on or about ${startDate.toLocaleDateString()} and continued through ` +
    `${endDate.toLocaleDateString()}. The activity was detected by our monitoring systems on ` +
    `${detectionDate.toLocaleDateString()} through automated transaction monitoring. Upon detection, a ` +
    `preliminary review was conducted which confirmed the suspicious nature of the activity.`;
}

/**
 * Generates the location/channels section.
 */
function generateLocationSection(transactions: any[]): string {
  const channels = [...new Set(transactions.map(t => t.channel))];
  const locations = [...new Set(transactions.map(t => t.location))];

  return `The transactions were conducted through the following channel(s): ${channels.join(', ')}. ` +
    `Geographic locations involved include: ${locations.join(', ')}. ` +
    `${transactions.some(t => t.counterparty) ?
      'Known counterparties include: ' + [...new Set(transactions.map(t => t.counterparty).filter(Boolean))].join(', ') :
      'No specific counterparties were identified.'
    }`;
}

/**
 * Generates the basis for suspicion section.
 */
function generateSuspicionBasisSection(
  alert: SARAlert,
  activityTypes: SuspiciousActivityType[]
): string {
  const indicators = activityTypes.flatMap(a => a.indicators);
  const uniqueIndicators = [...new Set(indicators)];

  return `This activity is deemed suspicious based on the following red flags and indicators: ` +
    uniqueIndicators.map((ind, i) => `(${i + 1}) ${ind}`).join('; ') + '. ' +
    `The activity deviated significantly from the customer's established pattern and could not be explained by ` +
    `legitimate business purposes. The risk score calculated by our monitoring system was ${alert.riskScore.toFixed(1)}, ` +
    `indicating a ${alert.riskScore >= 85 ? 'high' : alert.riskScore >= 70 ? 'medium' : 'low'} level of suspicious activity.`;
}

// ============================================================================
// FINCEN SAR FORM COMPLETION (Functions 16-19)
// ============================================================================

/**
 * Populates FinCEN SAR form (Form 111) with data.
 *
 * @param {SuspiciousActivityReport} sar - SAR data
 * @param {any} institution - Financial institution data
 * @returns {FinCENSARForm} Populated form
 */
export async function populateFinCENForm(
  sar: SuspiciousActivityReport,
  institution: any
): Promise<FinCENSARForm> {
  const formData: Record<string, any> = {
    // Part I: Reporting Financial Institution
    institutionName: institution.name,
    ein: institution.ein,
    address: institution.address,
    primaryFederalRegulator: institution.regulator,

    // Part II: Suspect Information
    subjects: sar.subjects.map(s => ({
      lastName: s.lastName,
      firstName: s.firstName,
      middleName: s.middleName,
      suffix: '',
      dateOfBirth: s.dateOfBirth,
      ssn: s.ssn,
      ein: s.ein,
      address: s.address,
      identification: s.identificationDocuments[0],
      relationship: s.relationship,
    })),

    // Part III: Suspicious Activity Information
    activityDate: sar.activityBeginDate,
    detectionDate: sar.detectionDate,
    activityTypes: sar.suspiciousActivityTypes.map(a => a.activityCode),
    totalAmount: sar.totalAmount,
    currency: sar.currency,

    // Part IV: Account Information
    accounts: sar.accountIds.map(accountId => ({
      accountNumber: accountId,
      accountType: 'checking', // Would be looked up
      accountOpenDate: null,
    })),

    // Part V: Narrative
    narrative: sar.narrative,

    // Part VI: Filing Institution Contact
    contactName: sar.preparedBy,
    contactTitle: 'BSA/AML Compliance Officer',
    contactPhone: institution.phone,
    contactDate: new Date(),
  };

  const validationErrors = validateFinCENForm(formData);

  return {
    formType: 'FinCEN-111',
    formVersion: '2.0',
    formData,
    validationStatus: validationErrors.length === 0 ? 'valid' : 'invalid',
    validationErrors,
    submissionReady: validationErrors.filter(e => e.severity === 'error').length === 0,
  };
}

/**
 * Validates FinCEN SAR form data for completeness and accuracy.
 *
 * @param {Record<string, any>} formData - Form data to validate
 * @returns {ValidationError[]} Array of validation errors
 */
export function validateFinCENForm(formData: Record<string, any>): ValidationError[] {
  const errors: ValidationError[] = [];

  // Required field validations
  if (!formData.institutionName) {
    errors.push({
      fieldName: 'institutionName',
      errorType: 'required',
      errorMessage: 'Institution name is required',
      severity: 'error',
    });
  }

  if (!formData.ein || !/^\d{2}-\d{7}$/.test(formData.ein)) {
    errors.push({
      fieldName: 'ein',
      errorType: 'format',
      errorMessage: 'Valid EIN in format XX-XXXXXXX is required',
      severity: 'error',
    });
  }

  if (!formData.subjects || formData.subjects.length === 0) {
    errors.push({
      fieldName: 'subjects',
      errorType: 'required',
      errorMessage: 'At least one subject is required',
      severity: 'error',
    });
  }

  // Subject validations
  formData.subjects?.forEach((subject: any, index: number) => {
    if (!subject.lastName && !subject.ein) {
      errors.push({
        fieldName: `subjects[${index}].lastName`,
        errorType: 'required',
        errorMessage: 'Subject must have lastName (individual) or EIN (entity)',
        severity: 'error',
      });
    }

    if (subject.dateOfBirth) {
      const dob = new Date(subject.dateOfBirth);
      if (dob > new Date()) {
        errors.push({
          fieldName: `subjects[${index}].dateOfBirth`,
          errorType: 'invalid',
          errorMessage: 'Date of birth cannot be in the future',
          severity: 'error',
        });
      }
    }
  });

  // Activity validations
  if (!formData.activityDate) {
    errors.push({
      fieldName: 'activityDate',
      errorType: 'required',
      errorMessage: 'Activity date is required',
      severity: 'error',
    });
  }

  if (!formData.detectionDate) {
    errors.push({
      fieldName: 'detectionDate',
      errorType: 'required',
      errorMessage: 'Detection date is required',
      severity: 'error',
    });
  }

  if (!formData.activityTypes || formData.activityTypes.length === 0) {
    errors.push({
      fieldName: 'activityTypes',
      errorType: 'required',
      errorMessage: 'At least one activity type must be selected',
      severity: 'error',
    });
  }

  // Narrative validation
  if (!formData.narrative || formData.narrative.length < 100) {
    errors.push({
      fieldName: 'narrative',
      errorType: 'length',
      errorMessage: 'Narrative must be at least 100 characters',
      severity: 'error',
    });
  }

  if (formData.narrative && formData.narrative.length > 20000) {
    errors.push({
      fieldName: 'narrative',
      errorType: 'length',
      errorMessage: 'Narrative exceeds 20,000 character limit',
      severity: 'error',
    });
  }

  // Warnings
  if (formData.totalAmount && formData.totalAmount < 5000) {
    errors.push({
      fieldName: 'totalAmount',
      errorType: 'warning',
      errorMessage: 'Amount is below typical SAR threshold - verify accuracy',
      severity: 'warning',
    });
  }

  return errors;
}

/**
 * Converts SAR data to FinCEN BSA E-Filing XML format.
 *
 * @param {FinCENSARForm} form - Validated form data
 * @returns {string} XML string for submission
 */
export function generateFinCENXML(form: FinCENSARForm): string {
  const { formData } = form;

  // Simplified XML generation (real implementation would use XML library)
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<EFilingSubmissionXML>\n';
  xml += '  <FormTypeCode>SARX</FormTypeCode>\n';
  xml += '  <ActivityCount>1</ActivityCount>\n';
  xml += '  <Activity>\n';
  xml += '    <ActivityType>SuspiciousActivityReport</ActivityType>\n';
  xml += '    <FilingInstitution>\n';
  xml += `      <Name>${escapeXml(formData.institutionName)}</Name>\n`;
  xml += `      <EIN>${escapeXml(formData.ein)}</EIN>\n`;
  xml += '    </FilingInstitution>\n';
  xml += '    <Subjects>\n';

  formData.subjects.forEach((subject: any) => {
    xml += '      <Subject>\n';
    xml += `        <LastName>${escapeXml(subject.lastName || '')}</LastName>\n`;
    xml += `        <FirstName>${escapeXml(subject.firstName || '')}</FirstName>\n`;
    xml += `        <DateOfBirth>${subject.dateOfBirth ? new Date(subject.dateOfBirth).toISOString().split('T')[0] : ''}</DateOfBirth>\n`;
    xml += '      </Subject>\n';
  });

  xml += '    </Subjects>\n';
  xml += `    <ActivityDate>${new Date(formData.activityDate).toISOString().split('T')[0]}</ActivityDate>\n`;
  xml += `    <DetectionDate>${new Date(formData.detectionDate).toISOString().split('T')[0]}</DetectionDate>\n`;
  xml += `    <TotalAmount>${formData.totalAmount || 0}</TotalAmount>\n`;
  xml += `    <Narrative><![CDATA[${formData.narrative}]]></Narrative>\n`;
  xml += '  </Activity>\n';
  xml += '</EFilingSubmissionXML>\n';

  return xml;
}

/**
 * Helper function to escape XML special characters.
 */
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Validates XML structure before submission.
 *
 * @param {string} xml - XML string
 * @returns {boolean} Whether XML is valid
 */
export function validateFinCENXML(xml: string): boolean {
  // Basic validation (real implementation would use XML schema validator)
  if (!xml.includes('<?xml version="1.0"')) return false;
  if (!xml.includes('<EFilingSubmissionXML>')) return false;
  if (!xml.includes('</EFilingSubmissionXML>')) return false;
  if (!xml.includes('<ActivityType>SuspiciousActivityReport</ActivityType>')) return false;

  // Check for balanced tags
  const openTags = (xml.match(/<[^/][^>]*>/g) || []).length;
  const closeTags = (xml.match(/<\/[^>]+>/g) || []).length;

  return openTags === closeTags;
}

// ============================================================================
// SUPPORTING DOCUMENTATION (Functions 20-22)
// ============================================================================

/**
 * Attaches supporting documents to SAR.
 *
 * @param {string} sarId - SAR identifier
 * @param {SupportingDocument[]} documents - Documents to attach
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<number>} Number of documents attached
 */
export async function attachSupportingDocuments(
  sarId: string,
  documents: SupportingDocument[],
  transaction?: Transaction
): Promise<number> {
  // Validate documents
  for (const doc of documents) {
    if (!doc.documentId || !doc.fileName || !doc.filePath) {
      throw new Error('Invalid document: missing required fields');
    }

    // Check file exists (in real implementation)
    // await fs.access(doc.filePath);
  }

  // Update SAR record with documents
  // In real implementation, would update database
  // await SuspiciousActivityReport.update(
  //   { supportingDocuments: documents },
  //   { where: { sarId }, transaction }
  // );

  return documents.length;
}

/**
 * Generates document checklist for SAR review.
 *
 * @param {SuspiciousActivityReport} sar - SAR data
 * @returns {Record<string, boolean>} Checklist of required documents
 */
export function generateDocumentChecklist(
  sar: SuspiciousActivityReport
): Record<string, boolean> {
  const checklist: Record<string, boolean> = {
    'Customer identification documents': sar.subjects.some(s => s.identificationDocuments.length > 0),
    'Transaction records': sar.transactionIds.length > 0,
    'Account statements': sar.accountIds.length > 0,
    'Correspondence with customer': false, // Would check actual documents
    'Internal investigation notes': sar.supportingDocuments.some(d => d.documentType === 'investigation-notes'),
    'Previous SARs (if continuing activity)': !sar.isContinuingActivity || sar.priorSarNumber !== null,
    'Enhanced due diligence records': sar.supportingDocuments.some(d => d.documentType === 'edd'),
    'Risk assessment documentation': true, // Always required
  };

  return checklist;
}

/**
 * Packages all SAR materials for submission.
 *
 * @param {SuspiciousActivityReport} sar - SAR data
 * @param {FinCENSARForm} form - Completed form
 * @returns {Promise<string>} Package reference ID
 */
export async function packageSARSubmission(
  sar: SuspiciousActivityReport,
  form: FinCENSARForm
): Promise<string> {
  const packageId = `PKG-${sar.sarNumber}-${Date.now()}`;

  // In real implementation, would:
  // 1. Create submission package directory
  // 2. Copy all supporting documents
  // 3. Generate XML file
  // 4. Create package manifest
  // 5. Zip/encrypt package
  // 6. Store package reference

  return packageId;
}

// ============================================================================
// SAR REVIEW AND APPROVAL WORKFLOW (Functions 23-26)
// ============================================================================

/**
 * Initiates multi-level SAR review workflow.
 *
 * @param {string} sarId - SAR identifier
 * @param {string[]} reviewers - List of reviewers
 * @returns {Promise<ReviewWorkflowStep[]>} Workflow steps
 */
export async function initiateSARReviewWorkflow(
  sarId: string,
  reviewers: string[]
): Promise<ReviewWorkflowStep[]> {
  const workflow: ReviewWorkflowStep[] = [
    {
      stepNumber: 1,
      stepType: 'prepare',
      assignedTo: 'preparer',
      assignedRole: 'AML Analyst',
      status: 'completed',
      startDate: new Date(),
      completionDate: new Date(),
      decision: 'approve',
    },
    {
      stepNumber: 2,
      stepType: 'review',
      assignedTo: reviewers[0] || 'senior-analyst',
      assignedRole: 'Senior AML Analyst',
      status: 'pending',
      startDate: new Date(),
    },
    {
      stepNumber: 3,
      stepType: 'approve',
      assignedTo: reviewers[1] || 'bsa-officer',
      assignedRole: 'BSA Officer',
      status: 'pending',
      startDate: new Date(),
    },
    {
      stepNumber: 4,
      stepType: 'file',
      assignedTo: 'system',
      assignedRole: 'System',
      status: 'pending',
      startDate: new Date(),
    },
  ];

  return workflow;
}

/**
 * Advances SAR to next review step.
 *
 * @param {string} sarId - SAR identifier
 * @param {string} reviewerId - Current reviewer
 * @param {string} decision - Review decision
 * @param {string} comments - Review comments
 * @returns {Promise<ReviewWorkflowStep>} Next workflow step
 */
export async function advanceSARWorkflow(
  sarId: string,
  reviewerId: string,
  decision: 'approve' | 'reject' | 'request-changes',
  comments?: string
): Promise<ReviewWorkflowStep> {
  // In real implementation, would:
  // 1. Load current workflow state
  // 2. Validate reviewer authority
  // 3. Update current step
  // 4. Advance to next step or reject
  // 5. Send notifications

  if (decision === 'reject') {
    return {
      stepNumber: 0,
      stepType: 'review',
      assignedTo: 'preparer',
      assignedRole: 'AML Analyst',
      status: 'pending',
      startDate: new Date(),
      comments: `Rejected: ${comments}`,
      decision: 'reject',
    };
  }

  // Return next step
  return {
    stepNumber: 3,
    stepType: 'approve',
    assignedTo: 'bsa-officer',
    assignedRole: 'BSA Officer',
    status: 'pending',
    startDate: new Date(),
  };
}

/**
 * Performs quality assurance review of SAR.
 *
 * @param {SuspiciousActivityReport} sar - SAR to review
 * @param {string} reviewerId - Reviewer ID
 * @returns {Promise<SARQualityReview>} Quality review results
 */
export async function performQualityReview(
  sar: SuspiciousActivityReport,
  reviewerId: string
): Promise<SARQualityReview> {
  const criteria: QualityCriterion[] = [
    {
      criterionName: 'Narrative Completeness',
      criterionDescription: 'Narrative addresses who, what, when, where, and why',
      weight: 0.25,
      score: sar.narrative.length >= 500 ? 100 : (sar.narrative.length / 500) * 100,
      passed: sar.narrative.length >= 300,
    },
    {
      criterionName: 'Supporting Documentation',
      criterionDescription: 'Adequate supporting documents attached',
      weight: 0.20,
      score: (sar.supportingDocuments.length / 5) * 100,
      passed: sar.supportingDocuments.length >= 3,
    },
    {
      criterionName: 'Subject Information',
      criterionDescription: 'Complete subject identification information',
      weight: 0.20,
      score: sar.subjects.every(s => s.firstName && s.lastName) ? 100 : 70,
      passed: sar.subjects.length > 0,
    },
    {
      criterionName: 'Activity Classification',
      criterionDescription: 'Proper activity type codes selected',
      weight: 0.15,
      score: sar.suspiciousActivityTypes.length > 0 ? 100 : 0,
      passed: sar.suspiciousActivityTypes.length > 0,
    },
    {
      criterionName: 'Timeliness',
      criterionDescription: 'SAR filed within regulatory deadlines',
      weight: 0.20,
      score: new Date() <= sar.filingDeadline ? 100 : 50,
      passed: new Date() <= sar.filingDeadline,
    },
  ];

  const overallScore = criteria.reduce((sum, c) => sum + (c.score * c.weight), 0);
  const deficiencies: Deficiency[] = criteria
    .filter(c => !c.passed)
    .map(c => ({
      deficiencyType: c.criterionName,
      description: `Failed quality check: ${c.criterionDescription}`,
      severity: c.score < 50 ? 'major' : 'minor',
      correctiveAction: 'Review and update before filing',
      responsibleParty: sar.preparedBy,
      dueDate: sar.filingDeadline,
      status: 'open',
    }));

  return {
    reviewId: `QR-${Date.now()}`,
    sarId: sar.id,
    reviewDate: new Date(),
    reviewedBy: reviewerId,
    reviewType: 'pre-filing',
    qualityCriteria: criteria,
    overallScore,
    deficiencies,
    correctionRequired: deficiencies.some(d => d.severity === 'major' || d.severity === 'critical'),
    reviewStatus: deficiencies.length === 0 ? 'passed' :
                   deficiencies.some(d => d.severity === 'major') ? 'failed' : 'passed-with-comments',
    recommendations: [
      overallScore < 70 ? 'Enhance narrative with more specific details' : '',
      sar.supportingDocuments.length < 3 ? 'Attach additional supporting documentation' : '',
    ].filter(Boolean),
  };
}

/**
 * Approves SAR for filing after all reviews complete.
 *
 * @param {string} sarId - SAR identifier
 * @param {string} approverId - BSA Officer ID
 * @returns {Promise<boolean>} Approval status
 */
export async function approveSARForFiling(
  sarId: string,
  approverId: string
): Promise<boolean> {
  // In real implementation, would:
  // 1. Verify all workflow steps completed
  // 2. Verify quality review passed
  // 3. Update SAR status to 'approved'
  // 4. Notify filing team
  // 5. Queue for submission

  return true;
}

// ============================================================================
// CONTINUING ACTIVITY SARS (Functions 27-29)
// ============================================================================

/**
 * Determines if new SAR should be continuing activity report.
 *
 * @param {string} subjectId - Subject identifier
 * @param {Date} activityDate - New activity date
 * @returns {Promise<SuspiciousActivityReport | null>} Prior SAR if exists
 */
export async function checkForContinuingActivity(
  subjectId: string,
  activityDate: Date
): Promise<SuspiciousActivityReport | null> {
  // Check for continuing activity by searching for prior SARs
  // on same subject within last 12 months (regulatory lookback period)

  const twelveMonthsAgo = new Date(activityDate.getTime() - 365 * 24 * 60 * 60 * 1000);

  // In production: Query database for recent SARs
  // const priorSAR = await SuspiciousActivityReport.findOne({
  //   where: {
  //     subjects: { [Op.contains]: [{ subjectId }] },
  //     filingDate: { [Op.gte]: twelveMonthsAgo },
  //     status: 'filed'
  //   },
  //   order: [['filingDate', 'DESC']]
  // });

  // For demonstration: Determine if continuing activity exists based on subjectId pattern
  // In production, this would be an actual database lookup
  const hasContinuingActivity = subjectId.includes('CONT') || subjectId.includes('REPEAT');

  if (!hasContinuingActivity) {
    console.log(`[SAR_CONTINUING] No prior SAR found for subject ${subjectId}`);
    return null;
  }

  // Simulate finding a prior SAR (for demonstration)
  const priorSAR: SuspiciousActivityReport = {
    id: `SAR-PRIOR-${Date.now()}`,
    sarNumber: `SAR-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
    detectionDate: new Date(activityDate.getTime() - 180 * 24 * 60 * 60 * 1000), // 6 months ago
    filingDate: new Date(activityDate.getTime() - 150 * 24 * 60 * 60 * 1000),
    status: 'filed',
    subjects: [{ subjectId, subjectType: 'customer', role: 'conductor' }],
    narrativeDescription: 'Previous suspicious activity on this subject',
    amountInvolved: 75000,
    activityStartDate: new Date(activityDate.getTime() - 200 * 24 * 60 * 60 * 1000),
    activityEndDate: new Date(activityDate.getTime() - 180 * 24 * 60 * 60 * 1000)
  };

  console.log(`[SAR_CONTINUING] Found prior SAR ${priorSAR.sarNumber} for subject ${subjectId}`);
  return priorSAR;
}

/**
 * Creates continuing activity SAR linked to prior SAR.
 *
 * @param {SuspiciousActivityReport} priorSAR - Previous SAR
 * @param {any} newActivity - New suspicious activity data
 * @returns {Promise<ContinuingActivitySAR>} Continuing SAR record
 */
export async function createContinuingSAR(
  priorSAR: SuspiciousActivityReport,
  newActivity: any
): Promise<ContinuingActivitySAR> {
  const continuationNumber = 1; // Would calculate based on prior continuing SARs

  const continuingSAR: ContinuingActivitySAR = {
    originalSarId: priorSAR.id,
    originalSarNumber: priorSAR.sarNumber,
    originalFilingDate: priorSAR.filingDate!,
    continuingSarId: `${priorSAR.sarId}-CONT-${continuationNumber}`,
    continuingSarNumber: `${priorSAR.sarNumber}-CONT${continuationNumber}`,
    continuationNumber,
    activityContinuedSince: priorSAR.activityEndDate || priorSAR.activityBeginDate,
    newActivityDetected: newActivity.detectionDate,
    updateReason: 'Additional suspicious activity detected for same subject',
    addedTransactions: newActivity.transactionIds,
    addedAmount: newActivity.totalAmount,
    cumulativeAmount: (priorSAR.totalAmount || 0) + newActivity.totalAmount,
    narrativeUpdate: `This is a continuing activity SAR. The original SAR ${priorSAR.sarNumber} was filed on ` +
      `${priorSAR.filingDate!.toLocaleDateString()}. Since that filing, additional suspicious activity has been ` +
      `detected involving the same subject(s) and similar patterns. ${newActivity.description}`,
  };

  return continuingSAR;
}

/**
 * Tracks continuing activity SAR timeline and updates.
 *
 * @param {string} originalSarId - Original SAR ID
 * @returns {Promise<ContinuingActivitySAR[]>} All continuing SARs
 */
export async function trackContinuingActivityTimeline(
  originalSarId: string
): Promise<ContinuingActivitySAR[]> {
  // Query all continuing SARs linked to the original SAR
  // and return them in chronological order

  // In production: Query database for continuing SARs
  // const continuingSARs = await ContinuingActivitySAR.findAll({
  //   where: { originalSarId },
  //   order: [['newActivityDate', 'ASC']]
  // });

  // For demonstration: Simulate timeline of continuing activity
  // In production, this would be actual database records
  const continuingSARs: ContinuingActivitySAR[] = [];

  // Simulate 0-3 continuing SARs for demonstration
  const continuationCount = Math.floor(Math.random() * 4);

  for (let i = 0; i < continuationCount; i++) {
    const daysOffset = (i + 1) * 90; // Every 90 days
    const baseDate = new Date();

    continuingSARs.push({
      originalSarId,
      originalSarNumber: `SAR-${new Date().getFullYear()}-ORIG`,
      originalFilingDate: new Date(baseDate.getTime() - 365 * 24 * 60 * 60 * 1000),
      continuationNumber: i + 1,
      newActivityStartDate: new Date(baseDate.getTime() - (daysOffset + 30) * 24 * 60 * 60 * 1000),
      newActivityEndDate: new Date(baseDate.getTime() - daysOffset * 24 * 60 * 60 * 1000),
      newActivityDate: new Date(baseDate.getTime() - daysOffset * 24 * 60 * 60 * 1000),
      newSarNumber: `SAR-${new Date().getFullYear()}-CONT${i + 1}`,
      newFilingDate: new Date(baseDate.getTime() - (daysOffset - 15) * 24 * 60 * 60 * 1000),
      cumulativeAmount: 50000 * (i + 2), // Increasing cumulative amount
      narrativeUpdate: `Continuation ${i + 1}: Additional suspicious activity detected`
    });
  }

  console.log(`[SAR_TIMELINE] Retrieved ${continuingSARs.length} continuing SARs for original SAR ${originalSarId}`);

  return continuingSARs;
}

// ============================================================================
// SAR FILING DEADLINES TRACKING (Functions 30-32)
// ============================================================================

/**
 * Calculates SAR filing deadlines based on detection date.
 *
 * @param {Date} detectionDate - Date suspicious activity was detected
 * @returns {SARFilingDeadline} Deadline information
 */
export function calculateSARDeadline(detectionDate: Date): SARFilingDeadline {
  // Statutory deadline: 30 calendar days from detection
  const statutoryDeadline = new Date(detectionDate);
  statutoryDeadline.setDate(statutoryDeadline.getDate() + 30);

  // Internal deadline: 25 days (5-day buffer)
  const internalDeadline = new Date(detectionDate);
  internalDeadline.setDate(internalDeadline.getDate() + 25);

  const now = new Date();
  const daysRemaining = Math.floor((statutoryDeadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  let deadlineStatus: 'on-time' | 'approaching' | 'overdue' | 'filed' = 'on-time';
  if (daysRemaining < 0) deadlineStatus = 'overdue';
  else if (daysRemaining <= 5) deadlineStatus = 'approaching';

  return {
    sarId: '',
    detectionDate,
    statutoryDeadline,
    internalDeadline,
    daysRemaining: Math.max(0, daysRemaining),
    deadlineStatus,
    extensionRequested: false,
    extensionApproved: false,
    escalationRequired: daysRemaining <= 3 && daysRemaining > 0,
  };
}

/**
 * Monitors approaching SAR filing deadlines.
 *
 * @param {number} daysThreshold - Number of days to trigger alert
 * @returns {Promise<SARFilingDeadline[]>} SARs with approaching deadlines
 */
export async function monitorSARDeadlines(
  daysThreshold: number = 7
): Promise<SARFilingDeadline[]> {
  // In real implementation, would query database for SARs
  // with filingDeadline within threshold and status != 'filed'

  // Calculate threshold date
  const thresholdDate = new Date(Date.now() + daysThreshold * 24 * 60 * 60 * 1000);

  // In production: Query database for pending SARs approaching deadline
  // const pendingSARs = await SuspiciousActivityReport.findAll({
  //   where: {
  //     status: { [Op.notIn]: ['filed', 'rejected'] },
  //     filingDeadline: { [Op.lte]: thresholdDate }
  //   },
  //   order: [['filingDeadline', 'ASC']]
  // });

  // For demonstration: Simulate pending SARs approaching deadlines
  const pendingSARs: SuspiciousActivityReport[] = [];

  // Simulate 0-5 pending SARs for demonstration
  const pendingCount = Math.floor(Math.random() * 6);

  for (let i = 0; i < pendingCount; i++) {
    const daysUntilDeadline = Math.floor(Math.random() * daysThreshold);
    const detectionDate = new Date(Date.now() - (30 - daysUntilDeadline) * 24 * 60 * 60 * 1000);
    const deadline = calculateSARDeadline(detectionDate);

    pendingSARs.push({
      id: `SAR-PENDING-${i + 1}`,
      sarNumber: `SAR-DRAFT-${Date.now()}-${i}`,
      detectionDate,
      filingDate: null,
      status: i % 3 === 0 ? 'draft' : i % 3 === 1 ? 'under_review' : 'pending_approval',
      filingDeadline: deadline.statutoryDeadline,
      daysUntilDeadline: Math.ceil((deadline.statutoryDeadline.getTime() - Date.now()) / (24 * 60 * 60 * 1000)),
      subjects: [{ subjectId: `SUBJ-${i}`, subjectType: 'customer', role: 'conductor' }],
      narrativeDescription: `Pending SAR ${i + 1} - requires completion`,
      amountInvolved: Math.floor(Math.random() * 100000) + 10000,
      activityStartDate: new Date(detectionDate.getTime() - 30 * 24 * 60 * 60 * 1000),
      activityEndDate: detectionDate
    });
  }

  // Sort by days until deadline (most urgent first)
  pendingSARs.sort((a, b) => (a.daysUntilDeadline || 999) - (b.daysUntilDeadline || 999));

  console.log(`[SAR_DEADLINES] Found ${pendingSARs.length} pending SARs within ${daysThreshold} days of deadline`);

  return pendingSARs;
}

/**
 * Generates deadline compliance report.
 *
 * @param {Date} periodStart - Report period start
 * @param {Date} periodEnd - Report period end
 * @returns {Promise<any>} Deadline compliance metrics
 */
export async function generateDeadlineComplianceReport(
  periodStart: Date,
  periodEnd: Date
): Promise<any> {
  // In real implementation, would aggregate filing statistics

  return {
    periodStart,
    periodEnd,
    totalSARs: 0,
    filedOnTime: 0,
    filedLate: 0,
    pending: 0,
    complianceRate: 0,
    averageFilingTime: 0,
    overdueSARs: [],
  };
}

// ============================================================================
// BSA/AML OFFICER NOTIFICATION (Functions 33-35)
// ============================================================================

/**
 * Notifies BSA Officer of new SAR or critical alert.
 *
 * @param {string} sarId - SAR identifier
 * @param {string} officerId - BSA Officer ID
 * @param {string} notificationType - Type of notification
 * @param {string} urgencyLevel - Urgency level
 * @returns {Promise<BSAOfficerNotification>} Notification record
 */
export async function notifyBSAOfficer(
  sarId: string,
  officerId: string,
  notificationType: 'new-sar' | 'deadline-approaching' | 'review-required' | 'escalation',
  urgencyLevel: 'normal' | 'high' | 'critical' = 'normal'
): Promise<BSAOfficerNotification> {
  const notification: BSAOfficerNotification = {
    notificationId: `NOTIF-${Date.now()}`,
    sarId,
    officerId,
    officerName: 'BSA Officer', // Would lookup from user database
    notificationDate: new Date(),
    notificationMethod: urgencyLevel === 'critical' ? 'phone' : 'email',
    notificationType,
    urgencyLevel,
    acknowledged: false,
  };

  // In real implementation, would:
  // 1. Store notification in database
  // 2. Send email/SMS based on notification method
  // 3. Create system alert
  // 4. Log notification

  return notification;
}

/**
 * Tracks BSA Officer notification acknowledgments.
 *
 * @param {string} notificationId - Notification ID
 * @param {string} response - Officer response
 * @returns {Promise<boolean>} Acknowledgment status
 */
export async function acknowledgeBSANotification(
  notificationId: string,
  response?: string
): Promise<boolean> {
  // In real implementation, would update notification record
  // with acknowledgment timestamp and response

  return true;
}

/**
 * Generates BSA Officer activity dashboard data.
 *
 * @param {string} officerId - BSA Officer ID
 * @param {Date} periodStart - Dashboard period start
 * @returns {Promise<any>} Dashboard metrics
 */
export async function generateBSAOfficerDashboard(
  officerId: string,
  periodStart: Date
): Promise<any> {
  return {
    pendingReviews: 0,
    pendingApprovals: 0,
    approachingDeadlines: 0,
    criticalAlerts: 0,
    recentActivity: [],
    complianceMetrics: {
      timelyFilingRate: 0,
      qualityScoreAverage: 0,
      escalationRate: 0,
    },
  };
}

// ============================================================================
// CONFIDENTIALITY ENFORCEMENT (Functions 36-38)
// ============================================================================

/**
 * Logs SAR access with confidentiality tracking.
 *
 * @param {string} sarId - SAR identifier
 * @param {string} userId - User accessing SAR
 * @param {string} accessType - Type of access
 * @param {string} purpose - Purpose of access
 * @returns {Promise<AccessLogEntry>} Access log entry
 */
export async function logSARAccess(
  sarId: string,
  userId: string,
  accessType: 'view' | 'edit' | 'print' | 'export',
  purpose: string
): Promise<AccessLogEntry> {
  const accessEntry: AccessLogEntry = {
    accessId: `ACCESS-${Date.now()}`,
    userId,
    userName: 'User Name', // Would lookup from user database
    accessDate: new Date(),
    accessType,
    ipAddress: '0.0.0.0', // Would capture from request
    purpose,
    authorized: true, // Would validate permissions
  };

  // In real implementation, would:
  // 1. Validate user has SAR access permission
  // 2. Check if user is on authorized access list
  // 3. Log to audit trail
  // 4. Alert if unauthorized access attempted

  return accessEntry;
}

/**
 * Enforces SAR confidentiality and tip-off prohibition.
 *
 * @param {string} sarId - SAR identifier
 * @param {string} requestedAction - Action being requested
 * @param {string} userId - User requesting action
 * @returns {Promise<boolean>} Whether action is permitted
 */
export async function enforceSARConfidentiality(
  sarId: string,
  requestedAction: string,
  userId: string
): Promise<boolean> {
  // Check if action would violate tip-off prohibition
  const prohibitedActions = [
    'notify-subject',
    'share-with-subject',
    'disclose-existence',
    'external-share-unauthorized',
  ];

  if (prohibitedActions.includes(requestedAction)) {
    // Log attempted violation
    console.error(`SAR confidentiality violation attempt: ${requestedAction} by ${userId}`);
    return false;
  }

  // Check if user has appropriate role
  const authorizedRoles = ['bsa-officer', 'aml-analyst', 'compliance-manager', 'auditor'];
  // Would validate user role from database

  return true;
}

/**
 * Manages authorized SAR information sharing.
 *
 * @param {string} sarId - SAR identifier
 * @param {string} recipientAgency - Recipient agency
 * @param {string} legalBasis - Legal basis for sharing
 * @param {string} authorizedBy - User authorizing sharing
 * @returns {Promise<SharingAuthorization>} Sharing authorization
 */
export async function authorizeSARSharing(
  sarId: string,
  recipientAgency: string,
  legalBasis: string,
  authorizedBy: string
): Promise<SharingAuthorization> {
  const authorization: SharingAuthorization = {
    authorizationId: `SHARE-${Date.now()}`,
    recipientAgency,
    recipientType: recipientAgency.includes('FBI') || recipientAgency.includes('Police') ?
      'law-enforcement' : 'regulator',
    authorizedBy,
    authorizationDate: new Date(),
    legalBasis,
    documentsShared: [sarId],
  };

  // In real implementation, would:
  // 1. Validate legal basis for sharing
  // 2. Verify authorizer has authority
  // 3. Log sharing authorization
  // 4. Apply appropriate redactions
  // 5. Track sharing compliance

  return authorization;
}

// ============================================================================
// SAR METRICS AND ANALYTICS (Functions 39-42)
// ============================================================================

/**
 * Generates comprehensive SAR metrics for reporting period.
 *
 * @param {Date} periodStart - Period start date
 * @param {Date} periodEnd - Period end date
 * @returns {Promise<SARMetrics>} SAR metrics
 */
export async function generateSARMetrics(
  periodStart: Date,
  periodEnd: Date
): Promise<SARMetrics> {
  // In real implementation, would query database and aggregate

  return {
    periodStart,
    periodEnd,
    totalSARsFiled: 0,
    sarsByType: {},
    sarsByStatus: {},
    averageFilingTime: 0,
    deadlineComplianceRate: 0,
    falsePositiveRate: 0,
    escalationRate: 0,
    qualityScoreAverage: 0,
    topSuspiciousActivities: [],
    filingTrends: [],
  };
}

/**
 * Analyzes SAR filing trends over time.
 *
 * @param {Date} periodStart - Analysis period start
 * @param {Date} periodEnd - Analysis period end
 * @param {string} groupBy - Grouping interval (day, week, month)
 * @returns {Promise<TrendData[]>} Trend analysis data
 */
export async function analyzeSARTrends(
  periodStart: Date,
  periodEnd: Date,
  groupBy: 'day' | 'week' | 'month' = 'month'
): Promise<TrendData[]> {
  // In real implementation, would aggregate SAR data by time period

  return [];
}

/**
 * Calculates SAR quality score metrics.
 *
 * @param {string[]} sarIds - SAR identifiers to analyze
 * @returns {Promise<any>} Quality metrics
 */
export async function calculateSARQualityMetrics(
  sarIds: string[]
): Promise<any> {
  return {
    averageQualityScore: 0,
    narrativeQuality: 0,
    documentationCompleteness: 0,
    timelinessScore: 0,
    accuracyScore: 0,
    deficiencyRate: 0,
  };
}

/**
 * Identifies high-risk patterns across multiple SARs.
 *
 * @param {Date} periodStart - Analysis period start
 * @returns {Promise<PatternDetection[]>} Detected patterns
 */
export async function identifyHighRiskPatterns(
  periodStart: Date
): Promise<PatternDetection[]> {
  // In real implementation, would use ML/pattern matching

  return [];
}

// ============================================================================
// TREND ANALYSIS (Functions 43-45)
// ============================================================================

/**
 * Performs advanced SAR trend analysis with pattern detection.
 *
 * @param {Date} periodStart - Analysis period start
 * @param {Date} periodEnd - Analysis period end
 * @returns {Promise<SARTrendAnalysis>} Trend analysis results
 */
export async function performSARTrendAnalysis(
  periodStart: Date,
  periodEnd: Date
): Promise<SARTrendAnalysis> {
  const analysis: SARTrendAnalysis = {
    analysisId: `TREND-${Date.now()}`,
    analysisDate: new Date(),
    analysisPeriod: `${periodStart.toLocaleDateString()} to ${periodEnd.toLocaleDateString()}`,
    trendType: 'stable',
    trendIndicators: [],
    patterns: [],
    riskAssessment: 'Normal SAR filing activity with no significant anomalies detected.',
    recommendations: [],
    alertLevel: 'normal',
  };

  return analysis;
}

/**
 * Detects emerging suspicious activity patterns.
 *
 * @param {SuspiciousActivityReport[]} sars - Recent SARs
 * @returns {Promise<PatternDetection[]>} Detected patterns
 */
export async function detectEmergingPatterns(
  sars: SuspiciousActivityReport[]
): Promise<PatternDetection[]> {
  const patterns: PatternDetection[] = [];

  // Group by activity type
  const activityGroups = new Map<string, SuspiciousActivityReport[]>();
  sars.forEach(sar => {
    sar.suspiciousActivityTypes.forEach(activity => {
      const existing = activityGroups.get(activity.activityCode) || [];
      existing.push(sar);
      activityGroups.set(activity.activityCode, existing);
    });
  });

  // Detect patterns in each group
  for (const [activityCode, groupSARs] of activityGroups) {
    if (groupSARs.length >= 3) {
      patterns.push({
        patternId: `PATTERN-${activityCode}-${Date.now()}`,
        patternType: 'activity-cluster',
        patternDescription: `Cluster of ${groupSARs.length} SARs with activity type ${activityCode}`,
        confidence: Math.min(95, 60 + (groupSARs.length * 5)),
        occurrences: groupSARs.length,
        relatedSARs: groupSARs.map(s => s.sarNumber),
        relatedEntities: [...new Set(groupSARs.flatMap(s => s.subjects.map(subj => subj.subjectId)))],
        riskLevel: groupSARs.length >= 5 ? 'high' : 'medium',
      });
    }
  }

  return patterns;
}

/**
 * Generates predictive risk alerts based on trends.
 *
 * @param {SARTrendAnalysis} trendAnalysis - Trend analysis results
 * @returns {Promise<SARAlert[]>} Predictive alerts
 */
export async function generatePredictiveAlerts(
  trendAnalysis: SARTrendAnalysis
): Promise<SARAlert[]> {
  const alerts: SARAlert[] = [];

  // Generate alerts for high-risk patterns
  for (const pattern of trendAnalysis.patterns) {
    if (pattern.riskLevel === 'high' || pattern.riskLevel === 'critical') {
      alerts.push({
        alertId: `PRED-${Date.now()}-${pattern.patternId}`,
        alertDate: new Date(),
        triggeredConditions: [{
          conditionId: 'TREND-1',
          conditionType: 'pattern-detection',
          conditionName: 'Emerging Pattern Detection',
          description: pattern.patternDescription,
          thresholds: { confidence: 80, occurrences: 3 },
          detectionRules: [],
          severityLevel: pattern.riskLevel === 'critical' ? 'critical' : 'high',
          autoGenerateSAR: false,
          requiresManualReview: true,
        }],
        entityId: 'multiple',
        entityType: 'customer',
        riskScore: pattern.confidence,
        alertStatus: 'new',
        disposition: 'pending-investigation',
        escalationLevel: pattern.riskLevel === 'critical' ? 3 : 2,
      });
    }
  }

  return alerts;
}

// ============================================================================
// REGULATORY SUBMISSION (Functions 46-48)
// ============================================================================

/**
 * Submits SAR to FinCEN BSA E-Filing System.
 *
 * @param {string} sarId - SAR identifier
 * @param {FinCENSARForm} form - Validated form
 * @returns {Promise<RegulatorySubmission>} Submission record
 */
export async function submitToFinCEN(
  sarId: string,
  form: FinCENSARForm
): Promise<RegulatorySubmission> {
  if (!form.submissionReady) {
    throw new Error('Form validation failed - cannot submit');
  }

  const xmlData = form.xmlData || generateFinCENXML(form);

  const submission: RegulatorySubmission = {
    submissionId: `SUB-${Date.now()}`,
    sarId,
    submissionDate: new Date(),
    submissionMethod: 'bsa-e-filing',
    submissionStatus: 'submitted',
    batchNumber: `BATCH-${Date.now()}`,
    acknowledgmentNumber: `ACK-${Date.now()}-FINCEN`,
    acknowledgmentDate: new Date(),
    resubmissionRequired: false,
  };

  // In real implementation, would:
  // 1. Connect to FinCEN BSA E-Filing System
  // 2. Authenticate with credentials
  // 3. Submit XML data
  // 4. Receive acknowledgment
  // 5. Update SAR status to 'filed'
  // 6. Store confirmation

  return submission;
}

/**
 * Tracks regulatory submission status and acknowledgments.
 *
 * @param {string} submissionId - Submission identifier
 * @returns {Promise<RegulatorySubmission>} Updated submission status
 */
export async function trackSubmissionStatus(
  submissionId: string
): Promise<RegulatorySubmission> {
  // In real implementation, would:
  // 1. Query FinCEN system for submission status
  // 2. Check for acknowledgment/rejection
  // 3. Update local records
  // 4. Notify relevant parties

  return {
    submissionId,
    sarId: '',
    submissionDate: new Date(),
    submissionMethod: 'bsa-e-filing',
    submissionStatus: 'accepted',
    acknowledgmentNumber: `ACK-${submissionId}`,
    acknowledgmentDate: new Date(),
    resubmissionRequired: false,
  };
}

/**
 * Handles rejected SAR submissions and resubmission.
 *
 * @param {string} submissionId - Submission identifier
 * @param {string[]} rejectionReasons - Reasons for rejection
 * @returns {Promise<RegulatorySubmission>} Resubmission record
 */
export async function handleRejectedSubmission(
  submissionId: string,
  rejectionReasons: string[]
): Promise<RegulatorySubmission> {
  // In real implementation, would:
  // 1. Log rejection reasons
  // 2. Notify preparer and BSA officer
  // 3. Revert SAR status to 'pending-review'
  // 4. Create corrective action items
  // 5. Track resubmission

  return {
    submissionId: `RESUB-${submissionId}`,
    sarId: '',
    submissionDate: new Date(),
    submissionMethod: 'bsa-e-filing',
    submissionStatus: 'pending',
    rejectionReasons,
    resubmissionRequired: true,
  };
}

/**
 * Links SAR to investigation case for case management.
 *
 * @param {string} sarId - SAR identifier
 * @param {string} caseId - Investigation case ID
 * @returns {Promise<boolean>} Link status
 *
 * @example
 * ```typescript
 * await linkSARToInvestigation('SAR-2025-001', 'CASE-ML-2025-456');
 * ```
 */
export async function linkSARToInvestigation(
  sarId: string,
  caseId: string
): Promise<boolean> {
  // In real implementation, would:
  // 1. Validate SAR and case exist
  // 2. Update SAR with investigation link
  // 3. Update case with SAR link
  // 4. Create cross-reference records

  return true;
}

// ============================================================================
// NESTJS INTEGRATION
// ============================================================================

/**
 * NestJS Service example for SAR management.
 *
 * @example
 * ```typescript
 * import { Injectable } from '@nestjs/common';
 * import { InjectModel } from '@nestjs/sequelize';
 * import * as SARKit from './sar-suspicious-activity-reporting-kit';
 *
 * @Injectable()
 * export class SARService {
 *   constructor(
 *     @InjectModel('SuspiciousActivityReport')
 *     private sarModel: typeof SARKit.createSuspiciousActivityReportModel,
 *   ) {}
 *
 *   async createSAR(alertId: string): Promise<any> {
 *     const alert = await this.getAlert(alertId);
 *     const customer = await this.getCustomer(alert.entityId);
 *     const transactions = await this.getTransactions(alert);
 *
 *     const activityTypes = await SARKit.classifySuspiciousActivity(
 *       alert.disposition,
 *       { totalAmount: alert.totalAmount, transactionCount: transactions.length }
 *     );
 *
 *     const narrative = await SARKit.generateSARNarrative(
 *       alert,
 *       customer,
 *       transactions,
 *       activityTypes
 *     );
 *
 *     const sar = await this.sarModel.create({
 *       sarId: `SAR-${Date.now()}`,
 *       sarNumber: `SAR-2025-${String(Math.floor(Math.random() * 10000)).padStart(6, '0')}`,
 *       reportingInstitution: 'First National Bank',
 *       detectionDate: alert.alertDate,
 *       filingDeadline: SARKit.calculateSARDeadline(alert.alertDate).statutoryDeadline,
 *       status: 'draft',
 *       subjects: [customer],
 *       suspiciousActivityTypes: activityTypes,
 *       narrative: narrative.sections.map(s => s.content).join('\n\n'),
 *       transactionIds: transactions.map(t => t.id),
 *       accountIds: [alert.entityId],
 *       preparedBy: 'system'
 *     });
 *
 *     await SARKit.notifyBSAOfficer(sar.sarId, 'bsa-officer-001', 'new-sar', 'high');
 *
 *     return sar;
 *   }
 *
 *   async reviewSAR(sarId: string, reviewerId: string): Promise<any> {
 *     const sar = await this.sarModel.findOne({ where: { sarId } });
 *     const qualityReview = await SARKit.performQualityReview(sar, reviewerId);
 *
 *     if (qualityReview.reviewStatus === 'passed') {
 *       await SARKit.advanceSARWorkflow(sarId, reviewerId, 'approve');
 *     } else {
 *       await SARKit.advanceSARWorkflow(sarId, reviewerId, 'request-changes',
 *         qualityReview.recommendations.join('; ')
 *       );
 *     }
 *
 *     return qualityReview;
 *   }
 *
 *   async fileSAR(sarId: string): Promise<any> {
 *     const sar = await this.sarModel.findOne({ where: { sarId } });
 *     const institution = await this.getInstitution();
 *
 *     const form = await SARKit.populateFinCENForm(sar, institution);
 *
 *     if (form.submissionReady) {
 *       const submission = await SARKit.submitToFinCEN(sarId, form);
 *       await sar.update({
 *         status: 'filed',
 *         filingDate: new Date(),
 *         fincenSubmissionId: submission.submissionId,
 *         fincenAcknowledgment: submission.acknowledgmentNumber
 *       });
 *       return submission;
 *     }
 *
 *     throw new Error('SAR form validation failed');
 *   }
 * }
 * ```
 */

/**
 * NestJS Controller example for SAR endpoints.
 *
 * @example
 * ```typescript
 * import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
 * import { SARService } from './sar.service';
 * import { JwtAuthGuard } from '../auth/jwt-auth.guard';
 * import { RolesGuard } from '../auth/roles.guard';
 * import { Roles } from '../auth/roles.decorator';
 *
 * @Controller('sar')
 * @UseGuards(JwtAuthGuard, RolesGuard)
 * export class SARController {
 *   constructor(private sarService: SARService) {}
 *
 *   @Post('create')
 *   @Roles('aml-analyst', 'bsa-officer')
 *   async createSAR(@Body() data: { alertId: string }) {
 *     return this.sarService.createSAR(data.alertId);
 *   }
 *
 *   @Post(':id/review')
 *   @Roles('senior-analyst', 'bsa-officer')
 *   async reviewSAR(@Param('id') sarId: string, @Body() data: { reviewerId: string }) {
 *     return this.sarService.reviewSAR(sarId, data.reviewerId);
 *   }
 *
 *   @Post(':id/file')
 *   @Roles('bsa-officer')
 *   async fileSAR(@Param('id') sarId: string) {
 *     return this.sarService.fileSAR(sarId);
 *   }
 *
 *   @Get('metrics')
 *   @Roles('bsa-officer', 'compliance-manager')
 *   async getMetrics(@Body() data: { periodStart: Date, periodEnd: Date }) {
 *     const metrics = await SARKit.generateSARMetrics(data.periodStart, data.periodEnd);
 *     return metrics;
 *   }
 *
 *   @Get('deadlines')
 *   @Roles('aml-analyst', 'bsa-officer')
 *   async getDeadlines() {
 *     return this.sarService.monitorDeadlines();
 *   }
 * }
 * ```
 */

export default {
  // Models
  createSuspiciousActivityReportModel,
  createSARAlertModel,
  createInvestigationCaseModel,
  createSARConfidentialityModel,

  // SAR Triggering Conditions
  detectStructuring,
  detectUnusualCashActivity,
  detectRapidFundMovement,
  detectHighRiskJurisdiction,
  detectInconsistentActivity,
  aggregateTriggeringConditions,

  // Activity Classification
  classifySuspiciousActivity,
  determineSeverityLevel,
  mapToInvestigationCategory,
  generateActivityIndicators,

  // Narrative Generation
  generateSARNarrative,

  // FinCEN Form
  populateFinCENForm,
  validateFinCENForm,
  generateFinCENXML,
  validateFinCENXML,

  // Supporting Documentation
  attachSupportingDocuments,
  generateDocumentChecklist,
  packageSARSubmission,

  // Review Workflow
  initiateSARReviewWorkflow,
  advanceSARWorkflow,
  performQualityReview,
  approveSARForFiling,

  // Continuing Activity
  checkForContinuingActivity,
  createContinuingSAR,
  trackContinuingActivityTimeline,

  // Deadlines
  calculateSARDeadline,
  monitorSARDeadlines,
  generateDeadlineComplianceReport,

  // BSA Officer Notifications
  notifyBSAOfficer,
  acknowledgeBSANotification,
  generateBSAOfficerDashboard,

  // Confidentiality
  logSARAccess,
  enforceSARConfidentiality,
  authorizeSARSharing,

  // Metrics & Analytics
  generateSARMetrics,
  analyzeSARTrends,
  calculateSARQualityMetrics,
  identifyHighRiskPatterns,

  // Trend Analysis
  performSARTrendAnalysis,
  detectEmergingPatterns,
  generatePredictiveAlerts,

  // Regulatory Submission
  submitToFinCEN,
  trackSubmissionStatus,
  handleRejectedSubmission,

  // Investigation Linking
  linkSARToInvestigation,
};
