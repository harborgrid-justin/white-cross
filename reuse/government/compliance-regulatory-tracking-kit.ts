/**
 * LOC: COMPLIANCE_REGULATORY_TRACKING_KIT_001
 * File: /reuse/government/compliance-regulatory-tracking-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - crypto (Node.js built-in)
 *   - class-validator
 *
 * DOWNSTREAM (imported by):
 *   - Government compliance services
 *   - Regulatory reporting modules
 *   - Policy management systems
 *   - Compliance dashboard components
 *   - Audit preparation services
 *   - Training tracking systems
 */

/**
 * File: /reuse/government/compliance-regulatory-tracking-kit.ts
 * Locator: WC-GOV-COMPLIANCE-REG-TRACK-001
 * Purpose: Comprehensive Compliance and Regulatory Tracking Toolkit for Government Operations
 *
 * Upstream: @nestjs/common, @nestjs/swagger, sequelize-typescript, crypto, class-validator
 * Downstream: Government compliance services, Regulatory modules, Policy systems
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10+, Sequelize 6+
 * Exports: 50+ government compliance and regulatory tracking functions
 *
 * LLM Context: Enterprise-grade compliance and regulatory tracking for government agencies.
 * Provides comprehensive regulatory requirement tracking, compliance certification management,
 * deadline monitoring, regulatory reporting, policy validation, training tracking, change
 * management, risk assessment, violation tracking, and extensive NestJS/Sequelize integration.
 */

import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Regulatory requirement structure
 */
export interface RegulatoryRequirement {
  id: string;
  requirementCode: string;
  title: string;
  description: string;
  regulatoryBody: string;
  regulationType: RegulationType;
  category: ComplianceCategory;
  effectiveDate: Date;
  expirationDate?: Date;
  mandatoryCompliance: boolean;
  applicableAgencies: string[];
  relatedRequirements: string[];
  documentationRequired: string[];
  status: RequirementStatus;
  priority: CompliancePriority;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Regulation types
 */
export enum RegulationType {
  FEDERAL_LAW = 'FEDERAL_LAW',
  STATE_LAW = 'STATE_LAW',
  LOCAL_ORDINANCE = 'LOCAL_ORDINANCE',
  AGENCY_REGULATION = 'AGENCY_REGULATION',
  EXECUTIVE_ORDER = 'EXECUTIVE_ORDER',
  POLICY_DIRECTIVE = 'POLICY_DIRECTIVE',
  STANDARD_OPERATING_PROCEDURE = 'STANDARD_OPERATING_PROCEDURE',
  INDUSTRY_STANDARD = 'INDUSTRY_STANDARD',
  INTERNATIONAL_TREATY = 'INTERNATIONAL_TREATY',
}

/**
 * Compliance categories
 */
export enum ComplianceCategory {
  DATA_PRIVACY = 'DATA_PRIVACY',
  CYBERSECURITY = 'CYBERSECURITY',
  FINANCIAL_MANAGEMENT = 'FINANCIAL_MANAGEMENT',
  PROCUREMENT = 'PROCUREMENT',
  ENVIRONMENTAL = 'ENVIRONMENTAL',
  HEALTH_SAFETY = 'HEALTH_SAFETY',
  HUMAN_RESOURCES = 'HUMAN_RESOURCES',
  RECORDS_MANAGEMENT = 'RECORDS_MANAGEMENT',
  ETHICS_CONDUCT = 'ETHICS_CONDUCT',
  ACCESSIBILITY = 'ACCESSIBILITY',
  CIVIL_RIGHTS = 'CIVIL_RIGHTS',
  TRANSPARENCY = 'TRANSPARENCY',
}

/**
 * Requirement status
 */
export enum RequirementStatus {
  ACTIVE = 'ACTIVE',
  DRAFT = 'DRAFT',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  SUPERSEDED = 'SUPERSEDED',
  REPEALED = 'REPEALED',
  SUSPENDED = 'SUSPENDED',
}

/**
 * Compliance priority levels
 */
export enum CompliancePriority {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

/**
 * Compliance certification structure
 */
export interface ComplianceCertification {
  id: string;
  certificationName: string;
  certificationBody: string;
  requirementId: string;
  agencyId: string;
  departmentId?: string;
  certificationLevel: string;
  issueDate: Date;
  expirationDate: Date;
  renewalRequired: boolean;
  renewalPeriodDays: number;
  status: CertificationStatus;
  certificationNumber: string;
  documentPath?: string;
  attestedBy: string;
  attestationDate: Date;
  nextReviewDate?: Date;
  conditions?: string[];
  metadata?: Record<string, any>;
}

/**
 * Certification status
 */
export enum CertificationStatus {
  VALID = 'VALID',
  EXPIRED = 'EXPIRED',
  PENDING_RENEWAL = 'PENDING_RENEWAL',
  SUSPENDED = 'SUSPENDED',
  REVOKED = 'REVOKED',
  UNDER_REVIEW = 'UNDER_REVIEW',
}

/**
 * Compliance deadline structure
 */
export interface ComplianceDeadline {
  id: string;
  requirementId: string;
  title: string;
  description: string;
  dueDate: Date;
  reminderDates: Date[];
  assignedTo: string[];
  departmentId: string;
  priority: CompliancePriority;
  status: DeadlineStatus;
  completionDate?: Date;
  completedBy?: string;
  extensions?: DeadlineExtension[];
  dependencies?: string[];
  deliverables: string[];
  notificationsSent: number;
  metadata?: Record<string, any>;
}

/**
 * Deadline status
 */
export enum DeadlineStatus {
  UPCOMING = 'UPCOMING',
  DUE_SOON = 'DUE_SOON',
  OVERDUE = 'OVERDUE',
  COMPLETED = 'COMPLETED',
  EXTENDED = 'EXTENDED',
  WAIVED = 'WAIVED',
  CANCELLED = 'CANCELLED',
}

/**
 * Deadline extension structure
 */
export interface DeadlineExtension {
  requestedDate: Date;
  requestedBy: string;
  approvedDate?: Date;
  approvedBy?: string;
  newDueDate: Date;
  reason: string;
  status: 'pending' | 'approved' | 'denied';
}

/**
 * Regulatory report submission
 */
export interface RegulatoryReportSubmission {
  id: string;
  reportType: string;
  requirementId: string;
  reportingPeriodStart: Date;
  reportingPeriodEnd: Date;
  submissionDeadline: Date;
  submittedDate?: Date;
  submittedBy?: string;
  recipientAgency: string;
  reportData: any;
  attachments: string[];
  status: SubmissionStatus;
  confirmationNumber?: string;
  acknowledgmentReceived: boolean;
  feedback?: string;
  corrections?: ReportCorrection[];
  metadata?: Record<string, any>;
}

/**
 * Submission status
 */
export enum SubmissionStatus {
  DRAFT = 'DRAFT',
  PENDING_REVIEW = 'PENDING_REVIEW',
  APPROVED = 'APPROVED',
  SUBMITTED = 'SUBMITTED',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  REJECTED = 'REJECTED',
  REQUIRES_CORRECTION = 'REQUIRES_CORRECTION',
  RESUBMITTED = 'RESUBMITTED',
}

/**
 * Report correction structure
 */
export interface ReportCorrection {
  requestedDate: Date;
  requestedBy: string;
  issue: string;
  correctionRequired: string;
  correctedDate?: Date;
  correctedBy?: string;
  notes?: string;
}

/**
 * Policy compliance validation
 */
export interface PolicyComplianceValidation {
  id: string;
  policyId: string;
  policyName: string;
  validationDate: Date;
  validatedBy: string;
  validationType: ValidationType;
  scope: ValidationScope;
  findings: ValidationFinding[];
  overallStatus: ValidationStatus;
  complianceScore: number;
  recommendations: string[];
  followUpRequired: boolean;
  followUpDate?: Date;
  metadata?: Record<string, any>;
}

/**
 * Validation type
 */
export enum ValidationType {
  SELF_ASSESSMENT = 'SELF_ASSESSMENT',
  INTERNAL_AUDIT = 'INTERNAL_AUDIT',
  EXTERNAL_AUDIT = 'EXTERNAL_AUDIT',
  PEER_REVIEW = 'PEER_REVIEW',
  AUTOMATED_SCAN = 'AUTOMATED_SCAN',
  MANUAL_REVIEW = 'MANUAL_REVIEW',
}

/**
 * Validation scope
 */
export enum ValidationScope {
  DEPARTMENT = 'DEPARTMENT',
  AGENCY_WIDE = 'AGENCY_WIDE',
  PROGRAM_SPECIFIC = 'PROGRAM_SPECIFIC',
  SYSTEM_LEVEL = 'SYSTEM_LEVEL',
  PROCESS_LEVEL = 'PROCESS_LEVEL',
}

/**
 * Validation finding
 */
export interface ValidationFinding {
  findingId: string;
  severity: CompliancePriority;
  category: string;
  description: string;
  evidence?: string;
  recommendation: string;
  status: 'open' | 'in_progress' | 'resolved' | 'accepted_risk';
}

/**
 * Validation status
 */
export enum ValidationStatus {
  COMPLIANT = 'COMPLIANT',
  PARTIALLY_COMPLIANT = 'PARTIALLY_COMPLIANT',
  NON_COMPLIANT = 'NON_COMPLIANT',
  NOT_APPLICABLE = 'NOT_APPLICABLE',
  UNDER_REVIEW = 'UNDER_REVIEW',
}

/**
 * Compliance training record
 */
export interface ComplianceTrainingRecord {
  id: string;
  trainingName: string;
  requirementId?: string;
  employeeId: string;
  employeeName: string;
  departmentId: string;
  completionDate?: Date;
  expirationDate?: Date;
  score?: number;
  passingScore: number;
  status: TrainingStatus;
  certificateIssued: boolean;
  certificatePath?: string;
  instructorId?: string;
  trainingDurationMinutes: number;
  attestationSigned: boolean;
  renewalRequired: boolean;
  metadata?: Record<string, any>;
}

/**
 * Training status
 */
export enum TrainingStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  PASSED = 'PASSED',
  FAILED = 'FAILED',
  EXPIRED = 'EXPIRED',
  WAIVED = 'WAIVED',
}

/**
 * Regulatory change management
 */
export interface RegulatoryChange {
  id: string;
  changeType: ChangeType;
  affectedRequirementId?: string;
  title: string;
  description: string;
  changeSource: string;
  effectiveDate: Date;
  impactAssessment: ImpactAssessment;
  affectedDepartments: string[];
  actionItems: ChangeActionItem[];
  implementationPlan?: string;
  status: ChangeStatus;
  approvedBy?: string;
  approvalDate?: Date;
  metadata?: Record<string, any>;
}

/**
 * Change type
 */
export enum ChangeType {
  NEW_REQUIREMENT = 'NEW_REQUIREMENT',
  REQUIREMENT_UPDATE = 'REQUIREMENT_UPDATE',
  REQUIREMENT_REPEAL = 'REQUIREMENT_REPEAL',
  INTERPRETATION_CHANGE = 'INTERPRETATION_CHANGE',
  ENFORCEMENT_CHANGE = 'ENFORCEMENT_CHANGE',
  DEADLINE_CHANGE = 'DEADLINE_CHANGE',
}

/**
 * Impact assessment
 */
export interface ImpactAssessment {
  overallImpact: 'high' | 'medium' | 'low';
  budgetImpact?: number;
  staffingImpact?: number;
  systemsImpacted: string[];
  processesImpacted: string[];
  trainingRequired: boolean;
  estimatedImplementationDays: number;
}

/**
 * Change action item
 */
export interface ChangeActionItem {
  id: string;
  description: string;
  assignedTo: string;
  dueDate: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  completionDate?: Date;
}

/**
 * Change status
 */
export enum ChangeStatus {
  PROPOSED = 'PROPOSED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  IMPLEMENTATION_PLANNED = 'IMPLEMENTATION_PLANNED',
  IMPLEMENTING = 'IMPLEMENTING',
  IMPLEMENTED = 'IMPLEMENTED',
  MONITORING = 'MONITORING',
}

/**
 * Compliance risk assessment
 */
export interface ComplianceRiskAssessment {
  id: string;
  assessmentDate: Date;
  assessmentPeriod: string;
  performedBy: string;
  scope: string[];
  risks: ComplianceRisk[];
  overallRiskLevel: RiskLevel;
  mitigationPlan?: string;
  nextAssessmentDate: Date;
  approvedBy?: string;
  metadata?: Record<string, any>;
}

/**
 * Compliance risk
 */
export interface ComplianceRisk {
  riskId: string;
  requirementId?: string;
  category: ComplianceCategory;
  description: string;
  likelihood: RiskLevel;
  impact: RiskLevel;
  riskScore: number;
  currentControls: string[];
  additionalControlsNeeded: string[];
  owner: string;
  status: 'identified' | 'analyzing' | 'mitigating' | 'monitoring' | 'resolved';
}

/**
 * Risk level
 */
export enum RiskLevel {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
  NEGLIGIBLE = 'NEGLIGIBLE',
}

/**
 * Compliance violation
 */
export interface ComplianceViolation {
  id: string;
  violationType: ViolationType;
  requirementId: string;
  discoveryDate: Date;
  discoveredBy: string;
  departmentId: string;
  severity: CompliancePriority;
  description: string;
  rootCause?: string;
  correctiveActions: CorrectiveAction[];
  reportedToRegulator: boolean;
  reportDate?: Date;
  status: ViolationStatus;
  resolvedDate?: Date;
  penalties?: ViolationPenalty[];
  metadata?: Record<string, any>;
}

/**
 * Violation type
 */
export enum ViolationType {
  PROCEDURAL = 'PROCEDURAL',
  DOCUMENTATION = 'DOCUMENTATION',
  DEADLINE_MISSED = 'DEADLINE_MISSED',
  REPORTING_FAILURE = 'REPORTING_FAILURE',
  TRAINING_GAP = 'TRAINING_GAP',
  POLICY_BREACH = 'POLICY_BREACH',
  SYSTEM_CONFIGURATION = 'SYSTEM_CONFIGURATION',
  ACCESS_CONTROL = 'ACCESS_CONTROL',
}

/**
 * Corrective action
 */
export interface CorrectiveAction {
  actionId: string;
  description: string;
  assignedTo: string;
  dueDate: Date;
  completionDate?: Date;
  status: 'planned' | 'in_progress' | 'completed' | 'verified';
  effectiveness?: 'effective' | 'partially_effective' | 'ineffective';
}

/**
 * Violation status
 */
export enum ViolationStatus {
  IDENTIFIED = 'IDENTIFIED',
  INVESTIGATING = 'INVESTIGATING',
  CORRECTIVE_ACTION_PLANNED = 'CORRECTIVE_ACTION_PLANNED',
  CORRECTIVE_ACTION_UNDERWAY = 'CORRECTIVE_ACTION_UNDERWAY',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

/**
 * Violation penalty
 */
export interface ViolationPenalty {
  penaltyType: 'fine' | 'warning' | 'suspension' | 'other';
  amount?: number;
  issuedDate: Date;
  issuedBy: string;
  description: string;
  paidDate?: Date;
}

/**
 * Compliance dashboard metrics
 */
export interface ComplianceDashboardMetrics {
  overallComplianceRate: number;
  totalRequirements: number;
  compliantRequirements: number;
  nonCompliantRequirements: number;
  upcomingDeadlines: number;
  overdueDeadlines: number;
  activeCertifications: number;
  expiringCertifications: number;
  openViolations: number;
  criticalRisks: number;
  trainingCompletionRate: number;
  recentSubmissions: number;
  categoryBreakdown: Record<ComplianceCategory, number>;
  trendData?: ComplianceTrend[];
}

/**
 * Compliance trend
 */
export interface ComplianceTrend {
  period: string;
  complianceRate: number;
  violations: number;
  deadlinesMet: number;
}

// ============================================================================
// REGULATORY REQUIREMENT TRACKING
// ============================================================================

/**
 * Creates a new regulatory requirement
 */
export function createRegulatoryRequirement(params: {
  requirementCode: string;
  title: string;
  description: string;
  regulatoryBody: string;
  regulationType: RegulationType;
  category: ComplianceCategory;
  effectiveDate: Date;
  mandatoryCompliance?: boolean;
  applicableAgencies?: string[];
  priority?: CompliancePriority;
}): RegulatoryRequirement {
  return {
    id: crypto.randomUUID(),
    requirementCode: params.requirementCode,
    title: params.title,
    description: params.description,
    regulatoryBody: params.regulatoryBody,
    regulationType: params.regulationType,
    category: params.category,
    effectiveDate: params.effectiveDate,
    mandatoryCompliance: params.mandatoryCompliance ?? true,
    applicableAgencies: params.applicableAgencies || [],
    relatedRequirements: [],
    documentationRequired: [],
    status: RequirementStatus.ACTIVE,
    priority: params.priority || CompliancePriority.MEDIUM,
    metadata: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Updates regulatory requirement status
 */
export function updateRequirementStatus(
  requirement: RegulatoryRequirement,
  newStatus: RequirementStatus,
): RegulatoryRequirement {
  return {
    ...requirement,
    status: newStatus,
    updatedAt: new Date(),
  };
}

/**
 * Links related requirements
 */
export function linkRelatedRequirements(
  requirement: RegulatoryRequirement,
  relatedRequirementIds: string[],
): RegulatoryRequirement {
  return {
    ...requirement,
    relatedRequirements: [...new Set([...requirement.relatedRequirements, ...relatedRequirementIds])],
    updatedAt: new Date(),
  };
}

/**
 * Checks if requirement is active and applicable
 */
export function isRequirementApplicable(
  requirement: RegulatoryRequirement,
  agencyId: string,
  currentDate: Date = new Date(),
): boolean {
  if (requirement.status !== RequirementStatus.ACTIVE) {
    return false;
  }

  if (currentDate < requirement.effectiveDate) {
    return false;
  }

  if (requirement.expirationDate && currentDate > requirement.expirationDate) {
    return false;
  }

  if (requirement.applicableAgencies.length > 0 && !requirement.applicableAgencies.includes(agencyId)) {
    return false;
  }

  return true;
}

/**
 * Filters requirements by category
 */
export function filterRequirementsByCategory(
  requirements: RegulatoryRequirement[],
  category: ComplianceCategory,
): RegulatoryRequirement[] {
  return requirements.filter((req) => req.category === category);
}

/**
 * Filters requirements by regulatory body
 */
export function filterRequirementsByBody(
  requirements: RegulatoryRequirement[],
  regulatoryBody: string,
): RegulatoryRequirement[] {
  return requirements.filter((req) => req.regulatoryBody === regulatoryBody);
}

/**
 * Gets requirements expiring soon
 */
export function getExpiringSoonRequirements(
  requirements: RegulatoryRequirement[],
  daysThreshold: number = 90,
): RegulatoryRequirement[] {
  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);

  return requirements.filter(
    (req) =>
      req.expirationDate &&
      req.expirationDate <= thresholdDate &&
      req.expirationDate > new Date(),
  );
}

// ============================================================================
// COMPLIANCE CERTIFICATION MANAGEMENT
// ============================================================================

/**
 * Creates a compliance certification
 */
export function createComplianceCertification(params: {
  certificationName: string;
  certificationBody: string;
  requirementId: string;
  agencyId: string;
  certificationLevel: string;
  issueDate: Date;
  expirationDate: Date;
  renewalPeriodDays: number;
  certificationNumber: string;
  attestedBy: string;
}): ComplianceCertification {
  return {
    id: crypto.randomUUID(),
    certificationName: params.certificationName,
    certificationBody: params.certificationBody,
    requirementId: params.requirementId,
    agencyId: params.agencyId,
    departmentId: undefined,
    certificationLevel: params.certificationLevel,
    issueDate: params.issueDate,
    expirationDate: params.expirationDate,
    renewalRequired: true,
    renewalPeriodDays: params.renewalPeriodDays,
    status: CertificationStatus.VALID,
    certificationNumber: params.certificationNumber,
    attestedBy: params.attestedBy,
    attestationDate: new Date(),
    conditions: [],
    metadata: {},
  };
}

/**
 * Checks certification validity
 */
export function isCertificationValid(
  certification: ComplianceCertification,
  currentDate: Date = new Date(),
): boolean {
  return (
    certification.status === CertificationStatus.VALID &&
    certification.expirationDate > currentDate
  );
}

/**
 * Gets certifications expiring soon
 */
export function getExpiringCertifications(
  certifications: ComplianceCertification[],
  daysThreshold: number = 30,
): ComplianceCertification[] {
  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);

  return certifications.filter(
    (cert) =>
      cert.status === CertificationStatus.VALID &&
      cert.expirationDate <= thresholdDate &&
      cert.expirationDate > new Date(),
  );
}

/**
 * Updates certification status
 */
export function updateCertificationStatus(
  certification: ComplianceCertification,
  newStatus: CertificationStatus,
): ComplianceCertification {
  return {
    ...certification,
    status: newStatus,
  };
}

/**
 * Renews a certification
 */
export function renewCertification(
  certification: ComplianceCertification,
  newIssueDate: Date,
  newExpirationDate: Date,
  attestedBy: string,
): ComplianceCertification {
  return {
    ...certification,
    issueDate: newIssueDate,
    expirationDate: newExpirationDate,
    status: CertificationStatus.VALID,
    attestedBy,
    attestationDate: new Date(),
  };
}

/**
 * Calculates days until certification expires
 */
export function daysUntilCertificationExpires(
  certification: ComplianceCertification,
  currentDate: Date = new Date(),
): number {
  const timeDiff = certification.expirationDate.getTime() - currentDate.getTime();
  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
}

// ============================================================================
// COMPLIANCE DEADLINE MONITORING
// ============================================================================

/**
 * Creates a compliance deadline
 */
export function createComplianceDeadline(params: {
  requirementId: string;
  title: string;
  description: string;
  dueDate: Date;
  assignedTo: string[];
  departmentId: string;
  priority?: CompliancePriority;
  deliverables?: string[];
}): ComplianceDeadline {
  const reminderDates = generateReminderDates(params.dueDate);

  return {
    id: crypto.randomUUID(),
    requirementId: params.requirementId,
    title: params.title,
    description: params.description,
    dueDate: params.dueDate,
    reminderDates,
    assignedTo: params.assignedTo,
    departmentId: params.departmentId,
    priority: params.priority || CompliancePriority.MEDIUM,
    status: DeadlineStatus.UPCOMING,
    extensions: [],
    deliverables: params.deliverables || [],
    notificationsSent: 0,
    metadata: {},
  };
}

/**
 * Generates reminder dates for a deadline
 */
export function generateReminderDates(dueDate: Date): Date[] {
  const reminders: Date[] = [];
  const intervals = [30, 14, 7, 3, 1]; // days before due date

  intervals.forEach((days) => {
    const reminderDate = new Date(dueDate);
    reminderDate.setDate(reminderDate.getDate() - days);
    if (reminderDate > new Date()) {
      reminders.push(reminderDate);
    }
  });

  return reminders.sort((a, b) => a.getTime() - b.getTime());
}

/**
 * Updates deadline status based on current date
 */
export function updateDeadlineStatus(
  deadline: ComplianceDeadline,
  currentDate: Date = new Date(),
): ComplianceDeadline {
  if (deadline.status === DeadlineStatus.COMPLETED) {
    return deadline;
  }

  const daysUntilDue = Math.ceil(
    (deadline.dueDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  let newStatus: DeadlineStatus;
  if (daysUntilDue < 0) {
    newStatus = DeadlineStatus.OVERDUE;
  } else if (daysUntilDue <= 7) {
    newStatus = DeadlineStatus.DUE_SOON;
  } else {
    newStatus = DeadlineStatus.UPCOMING;
  }

  return {
    ...deadline,
    status: newStatus,
  };
}

/**
 * Completes a deadline
 */
export function completeDeadline(
  deadline: ComplianceDeadline,
  completedBy: string,
): ComplianceDeadline {
  return {
    ...deadline,
    status: DeadlineStatus.COMPLETED,
    completionDate: new Date(),
    completedBy,
  };
}

/**
 * Requests deadline extension
 */
export function requestDeadlineExtension(
  deadline: ComplianceDeadline,
  requestedBy: string,
  newDueDate: Date,
  reason: string,
): ComplianceDeadline {
  const extension: DeadlineExtension = {
    requestedDate: new Date(),
    requestedBy,
    newDueDate,
    reason,
    status: 'pending',
  };

  return {
    ...deadline,
    extensions: [...(deadline.extensions || []), extension],
  };
}

/**
 * Approves deadline extension
 */
export function approveDeadlineExtension(
  deadline: ComplianceDeadline,
  extensionIndex: number,
  approvedBy: string,
): ComplianceDeadline {
  const updatedExtensions = [...(deadline.extensions || [])];
  if (updatedExtensions[extensionIndex]) {
    updatedExtensions[extensionIndex] = {
      ...updatedExtensions[extensionIndex],
      approvedDate: new Date(),
      approvedBy,
      status: 'approved',
    };

    return {
      ...deadline,
      extensions: updatedExtensions,
      dueDate: updatedExtensions[extensionIndex].newDueDate,
      status: DeadlineStatus.EXTENDED,
    };
  }

  return deadline;
}

/**
 * Gets overdue deadlines
 */
export function getOverdueDeadlines(
  deadlines: ComplianceDeadline[],
  currentDate: Date = new Date(),
): ComplianceDeadline[] {
  return deadlines.filter(
    (deadline) =>
      deadline.status !== DeadlineStatus.COMPLETED &&
      deadline.dueDate < currentDate,
  );
}

/**
 * Gets deadlines due within specified days
 */
export function getDeadlinesDueSoon(
  deadlines: ComplianceDeadline[],
  daysThreshold: number = 7,
): ComplianceDeadline[] {
  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);

  return deadlines.filter(
    (deadline) =>
      deadline.status !== DeadlineStatus.COMPLETED &&
      deadline.dueDate <= thresholdDate &&
      deadline.dueDate >= new Date(),
  );
}

// ============================================================================
// REGULATORY REPORTING SUBMISSIONS
// ============================================================================

/**
 * Creates a regulatory report submission
 */
export function createRegulatoryReportSubmission(params: {
  reportType: string;
  requirementId: string;
  reportingPeriodStart: Date;
  reportingPeriodEnd: Date;
  submissionDeadline: Date;
  recipientAgency: string;
  reportData: any;
}): RegulatoryReportSubmission {
  return {
    id: crypto.randomUUID(),
    reportType: params.reportType,
    requirementId: params.requirementId,
    reportingPeriodStart: params.reportingPeriodStart,
    reportingPeriodEnd: params.reportingPeriodEnd,
    submissionDeadline: params.submissionDeadline,
    recipientAgency: params.recipientAgency,
    reportData: params.reportData,
    attachments: [],
    status: SubmissionStatus.DRAFT,
    acknowledgmentReceived: false,
    corrections: [],
    metadata: {},
  };
}

/**
 * Submits a regulatory report
 */
export function submitRegulatoryReport(
  submission: RegulatoryReportSubmission,
  submittedBy: string,
): RegulatoryReportSubmission {
  return {
    ...submission,
    submittedDate: new Date(),
    submittedBy,
    status: SubmissionStatus.SUBMITTED,
    confirmationNumber: generateConfirmationNumber(),
  };
}

/**
 * Generates a confirmation number for submission
 */
export function generateConfirmationNumber(): string {
  const timestamp = Date.now().toString(36);
  const random = crypto.randomBytes(4).toString('hex');
  return `CONF-${timestamp}-${random}`.toUpperCase();
}

/**
 * Acknowledges report submission
 */
export function acknowledgeReportSubmission(
  submission: RegulatoryReportSubmission,
  feedback?: string,
): RegulatoryReportSubmission {
  return {
    ...submission,
    status: SubmissionStatus.ACKNOWLEDGED,
    acknowledgmentReceived: true,
    feedback,
  };
}

/**
 * Requests report corrections
 */
export function requestReportCorrections(
  submission: RegulatoryReportSubmission,
  requestedBy: string,
  issue: string,
  correctionRequired: string,
): RegulatoryReportSubmission {
  const correction: ReportCorrection = {
    requestedDate: new Date(),
    requestedBy,
    issue,
    correctionRequired,
  };

  return {
    ...submission,
    status: SubmissionStatus.REQUIRES_CORRECTION,
    corrections: [...(submission.corrections || []), correction],
  };
}

/**
 * Resubmits corrected report
 */
export function resubmitCorrectedReport(
  submission: RegulatoryReportSubmission,
  correctionIndex: number,
  correctedBy: string,
  updatedReportData: any,
): RegulatoryReportSubmission {
  const updatedCorrections = [...(submission.corrections || [])];
  if (updatedCorrections[correctionIndex]) {
    updatedCorrections[correctionIndex] = {
      ...updatedCorrections[correctionIndex],
      correctedDate: new Date(),
      correctedBy,
    };
  }

  return {
    ...submission,
    corrections: updatedCorrections,
    reportData: updatedReportData,
    status: SubmissionStatus.RESUBMITTED,
    submittedDate: new Date(),
  };
}

// ============================================================================
// POLICY COMPLIANCE VALIDATION
// ============================================================================

/**
 * Creates a policy compliance validation
 */
export function createPolicyComplianceValidation(params: {
  policyId: string;
  policyName: string;
  validatedBy: string;
  validationType: ValidationType;
  scope: ValidationScope;
}): PolicyComplianceValidation {
  return {
    id: crypto.randomUUID(),
    policyId: params.policyId,
    policyName: params.policyName,
    validationDate: new Date(),
    validatedBy: params.validatedBy,
    validationType: params.validationType,
    scope: params.scope,
    findings: [],
    overallStatus: ValidationStatus.UNDER_REVIEW,
    complianceScore: 0,
    recommendations: [],
    followUpRequired: false,
    metadata: {},
  };
}

/**
 * Adds validation finding
 */
export function addValidationFinding(
  validation: PolicyComplianceValidation,
  finding: ValidationFinding,
): PolicyComplianceValidation {
  return {
    ...validation,
    findings: [...validation.findings, finding],
  };
}

/**
 * Calculates compliance score from findings
 */
export function calculateComplianceScore(findings: ValidationFinding[]): number {
  if (findings.length === 0) return 100;

  const severityWeights = {
    [CompliancePriority.CRITICAL]: 25,
    [CompliancePriority.HIGH]: 15,
    [CompliancePriority.MEDIUM]: 10,
    [CompliancePriority.LOW]: 5,
  };

  const totalPenalty = findings.reduce((sum, finding) => {
    return sum + (severityWeights[finding.severity] || 0);
  }, 0);

  return Math.max(0, 100 - totalPenalty);
}

/**
 * Determines overall validation status
 */
export function determineValidationStatus(complianceScore: number): ValidationStatus {
  if (complianceScore >= 95) return ValidationStatus.COMPLIANT;
  if (complianceScore >= 70) return ValidationStatus.PARTIALLY_COMPLIANT;
  return ValidationStatus.NON_COMPLIANT;
}

/**
 * Completes validation assessment
 */
export function completeValidationAssessment(
  validation: PolicyComplianceValidation,
  recommendations: string[],
): PolicyComplianceValidation {
  const score = calculateComplianceScore(validation.findings);
  const status = determineValidationStatus(score);

  return {
    ...validation,
    complianceScore: score,
    overallStatus: status,
    recommendations,
    followUpRequired: status !== ValidationStatus.COMPLIANT,
  };
}

// ============================================================================
// COMPLIANCE TRAINING TRACKING
// ============================================================================

/**
 * Creates a compliance training record
 */
export function createComplianceTrainingRecord(params: {
  trainingName: string;
  requirementId?: string;
  employeeId: string;
  employeeName: string;
  departmentId: string;
  passingScore: number;
  trainingDurationMinutes: number;
}): ComplianceTrainingRecord {
  return {
    id: crypto.randomUUID(),
    trainingName: params.trainingName,
    requirementId: params.requirementId,
    employeeId: params.employeeId,
    employeeName: params.employeeName,
    departmentId: params.departmentId,
    passingScore: params.passingScore,
    status: TrainingStatus.NOT_STARTED,
    certificateIssued: false,
    trainingDurationMinutes: params.trainingDurationMinutes,
    attestationSigned: false,
    renewalRequired: false,
    metadata: {},
  };
}

/**
 * Completes training
 */
export function completeTraining(
  training: ComplianceTrainingRecord,
  score: number,
  expirationDate?: Date,
): ComplianceTrainingRecord {
  const passed = score >= training.passingScore;

  return {
    ...training,
    completionDate: new Date(),
    expirationDate,
    score,
    status: passed ? TrainingStatus.PASSED : TrainingStatus.FAILED,
    certificateIssued: passed,
    attestationSigned: passed,
  };
}

/**
 * Gets employees with expired training
 */
export function getExpiredTraining(
  trainings: ComplianceTrainingRecord[],
  currentDate: Date = new Date(),
): ComplianceTrainingRecord[] {
  return trainings.filter(
    (training) =>
      training.expirationDate &&
      training.expirationDate < currentDate &&
      training.status === TrainingStatus.PASSED,
  );
}

/**
 * Calculates training completion rate
 */
export function calculateTrainingCompletionRate(
  trainings: ComplianceTrainingRecord[],
): number {
  if (trainings.length === 0) return 0;

  const completed = trainings.filter(
    (t) => t.status === TrainingStatus.PASSED || t.status === TrainingStatus.COMPLETED,
  ).length;

  return (completed / trainings.length) * 100;
}

// ============================================================================
// REGULATORY CHANGE MANAGEMENT
// ============================================================================

/**
 * Creates a regulatory change
 */
export function createRegulatoryChange(params: {
  changeType: ChangeType;
  title: string;
  description: string;
  changeSource: string;
  effectiveDate: Date;
  impactAssessment: ImpactAssessment;
  affectedDepartments: string[];
}): RegulatoryChange {
  return {
    id: crypto.randomUUID(),
    changeType: params.changeType,
    title: params.title,
    description: params.description,
    changeSource: params.changeSource,
    effectiveDate: params.effectiveDate,
    impactAssessment: params.impactAssessment,
    affectedDepartments: params.affectedDepartments,
    actionItems: [],
    status: ChangeStatus.PROPOSED,
    metadata: {},
  };
}

/**
 * Adds action item to regulatory change
 */
export function addChangeActionItem(
  change: RegulatoryChange,
  actionItem: ChangeActionItem,
): RegulatoryChange {
  return {
    ...change,
    actionItems: [...change.actionItems, actionItem],
  };
}

/**
 * Approves regulatory change
 */
export function approveRegulatoryChange(
  change: RegulatoryChange,
  approvedBy: string,
): RegulatoryChange {
  return {
    ...change,
    status: ChangeStatus.APPROVED,
    approvedBy,
    approvalDate: new Date(),
  };
}

/**
 * Calculates change implementation progress
 */
export function calculateChangeProgress(change: RegulatoryChange): number {
  if (change.actionItems.length === 0) return 0;

  const completed = change.actionItems.filter((item) => item.status === 'completed').length;
  return (completed / change.actionItems.length) * 100;
}

// ============================================================================
// COMPLIANCE RISK ASSESSMENT
// ============================================================================

/**
 * Creates a compliance risk assessment
 */
export function createComplianceRiskAssessment(params: {
  assessmentPeriod: string;
  performedBy: string;
  scope: string[];
  nextAssessmentDate: Date;
}): ComplianceRiskAssessment {
  return {
    id: crypto.randomUUID(),
    assessmentDate: new Date(),
    assessmentPeriod: params.assessmentPeriod,
    performedBy: params.performedBy,
    scope: params.scope,
    risks: [],
    overallRiskLevel: RiskLevel.LOW,
    nextAssessmentDate: params.nextAssessmentDate,
    metadata: {},
  };
}

/**
 * Adds risk to assessment
 */
export function addComplianceRisk(
  assessment: ComplianceRiskAssessment,
  risk: ComplianceRisk,
): ComplianceRiskAssessment {
  return {
    ...assessment,
    risks: [...assessment.risks, risk],
  };
}

/**
 * Calculates risk score
 */
export function calculateRiskScore(likelihood: RiskLevel, impact: RiskLevel): number {
  const levelValues = {
    [RiskLevel.CRITICAL]: 5,
    [RiskLevel.HIGH]: 4,
    [RiskLevel.MEDIUM]: 3,
    [RiskLevel.LOW]: 2,
    [RiskLevel.NEGLIGIBLE]: 1,
  };

  return levelValues[likelihood] * levelValues[impact];
}

/**
 * Determines overall risk level from risks
 */
export function determineOverallRiskLevel(risks: ComplianceRisk[]): RiskLevel {
  if (risks.some((r) => r.riskScore >= 20)) return RiskLevel.CRITICAL;
  if (risks.some((r) => r.riskScore >= 15)) return RiskLevel.HIGH;
  if (risks.some((r) => r.riskScore >= 9)) return RiskLevel.MEDIUM;
  if (risks.some((r) => r.riskScore >= 4)) return RiskLevel.LOW;
  return RiskLevel.NEGLIGIBLE;
}

// ============================================================================
// COMPLIANCE VIOLATION TRACKING
// ============================================================================

/**
 * Creates a compliance violation
 */
export function createComplianceViolation(params: {
  violationType: ViolationType;
  requirementId: string;
  discoveredBy: string;
  departmentId: string;
  severity: CompliancePriority;
  description: string;
}): ComplianceViolation {
  return {
    id: crypto.randomUUID(),
    violationType: params.violationType,
    requirementId: params.requirementId,
    discoveryDate: new Date(),
    discoveredBy: params.discoveredBy,
    departmentId: params.departmentId,
    severity: params.severity,
    description: params.description,
    correctiveActions: [],
    reportedToRegulator: false,
    status: ViolationStatus.IDENTIFIED,
    penalties: [],
    metadata: {},
  };
}

/**
 * Adds corrective action to violation
 */
export function addCorrectiveAction(
  violation: ComplianceViolation,
  action: CorrectiveAction,
): ComplianceViolation {
  return {
    ...violation,
    correctiveActions: [...violation.correctiveActions, action],
    status: ViolationStatus.CORRECTIVE_ACTION_PLANNED,
  };
}

/**
 * Resolves violation
 */
export function resolveViolation(violation: ComplianceViolation): ComplianceViolation {
  return {
    ...violation,
    status: ViolationStatus.RESOLVED,
    resolvedDate: new Date(),
  };
}

/**
 * Gets open violations by severity
 */
export function getOpenViolationsBySeverity(
  violations: ComplianceViolation[],
  severity: CompliancePriority,
): ComplianceViolation[] {
  return violations.filter(
    (v) =>
      v.severity === severity &&
      ![ViolationStatus.RESOLVED, ViolationStatus.CLOSED].includes(v.status),
  );
}

// ============================================================================
// COMPLIANCE DASHBOARD METRICS
// ============================================================================

/**
 * Generates compliance dashboard metrics
 */
export function generateComplianceDashboardMetrics(params: {
  requirements: RegulatoryRequirement[];
  certifications: ComplianceCertification[];
  deadlines: ComplianceDeadline[];
  violations: ComplianceViolation[];
  trainings: ComplianceTrainingRecord[];
  submissions: RegulatoryReportSubmission[];
}): ComplianceDashboardMetrics {
  const compliantRequirements = params.requirements.filter(
    (r) => r.status === RequirementStatus.ACTIVE,
  ).length;

  const categoryBreakdown = params.requirements.reduce((acc, req) => {
    acc[req.category] = (acc[req.category] || 0) + 1;
    return acc;
  }, {} as Record<ComplianceCategory, number>);

  return {
    overallComplianceRate:
      params.requirements.length > 0
        ? (compliantRequirements / params.requirements.length) * 100
        : 0,
    totalRequirements: params.requirements.length,
    compliantRequirements,
    nonCompliantRequirements: params.requirements.length - compliantRequirements,
    upcomingDeadlines: getDeadlinesDueSoon(params.deadlines).length,
    overdueDeadlines: getOverdueDeadlines(params.deadlines).length,
    activeCertifications: params.certifications.filter((c) => isCertificationValid(c)).length,
    expiringCertifications: getExpiringCertifications(params.certifications).length,
    openViolations: params.violations.filter(
      (v) => ![ViolationStatus.RESOLVED, ViolationStatus.CLOSED].includes(v.status),
    ).length,
    criticalRisks: params.violations.filter((v) => v.severity === CompliancePriority.CRITICAL)
      .length,
    trainingCompletionRate: calculateTrainingCompletionRate(params.trainings),
    recentSubmissions: params.submissions.filter(
      (s) => s.status === SubmissionStatus.SUBMITTED || s.status === SubmissionStatus.ACKNOWLEDGED,
    ).length,
    categoryBreakdown,
  };
}

// ============================================================================
// SEQUELIZE MODEL DEFINITIONS
// ============================================================================

/**
 * Sequelize model decorator for RegulatoryRequirement
 */
export const RegulatoryRequirementModel = {
  tableName: 'regulatory_requirements',
  columns: {
    id: { type: 'UUID', primaryKey: true, defaultValue: 'UUIDV4' },
    requirementCode: { type: 'STRING', allowNull: false, unique: true },
    title: { type: 'STRING', allowNull: false },
    description: { type: 'TEXT', allowNull: false },
    regulatoryBody: { type: 'STRING', allowNull: false },
    regulationType: { type: 'ENUM', values: Object.values(RegulationType) },
    category: { type: 'ENUM', values: Object.values(ComplianceCategory) },
    effectiveDate: { type: 'DATE', allowNull: false },
    expirationDate: { type: 'DATE', allowNull: true },
    mandatoryCompliance: { type: 'BOOLEAN', defaultValue: true },
    applicableAgencies: { type: 'JSON', defaultValue: [] },
    relatedRequirements: { type: 'JSON', defaultValue: [] },
    documentationRequired: { type: 'JSON', defaultValue: [] },
    status: { type: 'ENUM', values: Object.values(RequirementStatus) },
    priority: { type: 'ENUM', values: Object.values(CompliancePriority) },
    metadata: { type: 'JSON', defaultValue: {} },
    createdAt: { type: 'DATE', allowNull: false },
    updatedAt: { type: 'DATE', allowNull: false },
  },
  indexes: [
    { fields: ['requirementCode'] },
    { fields: ['regulatoryBody'] },
    { fields: ['category'] },
    { fields: ['status'] },
    { fields: ['effectiveDate'] },
  ],
};

/**
 * Sequelize model decorator for ComplianceCertification
 */
export const ComplianceCertificationModel = {
  tableName: 'compliance_certifications',
  columns: {
    id: { type: 'UUID', primaryKey: true, defaultValue: 'UUIDV4' },
    certificationName: { type: 'STRING', allowNull: false },
    certificationBody: { type: 'STRING', allowNull: false },
    requirementId: { type: 'UUID', allowNull: false },
    agencyId: { type: 'UUID', allowNull: false },
    departmentId: { type: 'UUID', allowNull: true },
    certificationLevel: { type: 'STRING', allowNull: false },
    issueDate: { type: 'DATE', allowNull: false },
    expirationDate: { type: 'DATE', allowNull: false },
    renewalRequired: { type: 'BOOLEAN', defaultValue: true },
    renewalPeriodDays: { type: 'INTEGER', allowNull: false },
    status: { type: 'ENUM', values: Object.values(CertificationStatus) },
    certificationNumber: { type: 'STRING', allowNull: false, unique: true },
    documentPath: { type: 'STRING', allowNull: true },
    attestedBy: { type: 'STRING', allowNull: false },
    attestationDate: { type: 'DATE', allowNull: false },
    nextReviewDate: { type: 'DATE', allowNull: true },
    conditions: { type: 'JSON', defaultValue: [] },
    metadata: { type: 'JSON', defaultValue: {} },
  },
  indexes: [
    { fields: ['requirementId'] },
    { fields: ['agencyId'] },
    { fields: ['status'] },
    { fields: ['expirationDate'] },
    { fields: ['certificationNumber'] },
  ],
};

/**
 * Sequelize model decorator for ComplianceDeadline
 */
export const ComplianceDeadlineModel = {
  tableName: 'compliance_deadlines',
  columns: {
    id: { type: 'UUID', primaryKey: true, defaultValue: 'UUIDV4' },
    requirementId: { type: 'UUID', allowNull: false },
    title: { type: 'STRING', allowNull: false },
    description: { type: 'TEXT', allowNull: false },
    dueDate: { type: 'DATE', allowNull: false },
    reminderDates: { type: 'JSON', defaultValue: [] },
    assignedTo: { type: 'JSON', allowNull: false },
    departmentId: { type: 'UUID', allowNull: false },
    priority: { type: 'ENUM', values: Object.values(CompliancePriority) },
    status: { type: 'ENUM', values: Object.values(DeadlineStatus) },
    completionDate: { type: 'DATE', allowNull: true },
    completedBy: { type: 'STRING', allowNull: true },
    extensions: { type: 'JSON', defaultValue: [] },
    dependencies: { type: 'JSON', defaultValue: [] },
    deliverables: { type: 'JSON', defaultValue: [] },
    notificationsSent: { type: 'INTEGER', defaultValue: 0 },
    metadata: { type: 'JSON', defaultValue: {} },
  },
  indexes: [
    { fields: ['requirementId'] },
    { fields: ['departmentId'] },
    { fields: ['status'] },
    { fields: ['dueDate'] },
    { fields: ['priority'] },
  ],
};

/**
 * Sequelize model decorator for ComplianceViolation
 */
export const ComplianceViolationModel = {
  tableName: 'compliance_violations',
  columns: {
    id: { type: 'UUID', primaryKey: true, defaultValue: 'UUIDV4' },
    violationType: { type: 'ENUM', values: Object.values(ViolationType) },
    requirementId: { type: 'UUID', allowNull: false },
    discoveryDate: { type: 'DATE', allowNull: false },
    discoveredBy: { type: 'STRING', allowNull: false },
    departmentId: { type: 'UUID', allowNull: false },
    severity: { type: 'ENUM', values: Object.values(CompliancePriority) },
    description: { type: 'TEXT', allowNull: false },
    rootCause: { type: 'TEXT', allowNull: true },
    correctiveActions: { type: 'JSON', defaultValue: [] },
    reportedToRegulator: { type: 'BOOLEAN', defaultValue: false },
    reportDate: { type: 'DATE', allowNull: true },
    status: { type: 'ENUM', values: Object.values(ViolationStatus) },
    resolvedDate: { type: 'DATE', allowNull: true },
    penalties: { type: 'JSON', defaultValue: [] },
    metadata: { type: 'JSON', defaultValue: {} },
  },
  indexes: [
    { fields: ['requirementId'] },
    { fields: ['departmentId'] },
    { fields: ['status'] },
    { fields: ['severity'] },
    { fields: ['discoveryDate'] },
  ],
};

// ============================================================================
// NESTJS SERVICE CLASS EXAMPLE
// ============================================================================

/**
 * Example NestJS service for compliance tracking
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class ComplianceTrackingService {
 *   constructor(
 *     @InjectModel(RegulatoryRequirementModel)
 *     private requirementRepo: Repository<RegulatoryRequirement>,
 *   ) {}
 *
 *   async createRequirement(dto: CreateRequirementDto): Promise<RegulatoryRequirement> {
 *     const requirement = createRegulatoryRequirement(dto);
 *     return this.requirementRepo.save(requirement);
 *   }
 *
 *   async getApplicableRequirements(agencyId: string): Promise<RegulatoryRequirement[]> {
 *     const requirements = await this.requirementRepo.find();
 *     return requirements.filter(req => isRequirementApplicable(req, agencyId));
 *   }
 * }
 * ```
 */
export const ComplianceTrackingServiceExample = `
@Injectable()
export class ComplianceTrackingService {
  constructor(
    @InjectModel(RegulatoryRequirementModel)
    private requirementRepo: Repository<RegulatoryRequirement>,
    @InjectModel(ComplianceCertificationModel)
    private certificationRepo: Repository<ComplianceCertification>,
    @InjectModel(ComplianceDeadlineModel)
    private deadlineRepo: Repository<ComplianceDeadline>,
  ) {}

  async getDashboardMetrics(agencyId: string): Promise<ComplianceDashboardMetrics> {
    const requirements = await this.requirementRepo.find();
    const certifications = await this.certificationRepo.find({ where: { agencyId } });
    const deadlines = await this.deadlineRepo.find();

    return generateComplianceDashboardMetrics({
      requirements,
      certifications,
      deadlines,
      violations: [],
      trainings: [],
      submissions: [],
    });
  }
}
`;

// ============================================================================
// SWAGGER API SCHEMA DEFINITIONS
// ============================================================================

/**
 * Swagger DTO for creating regulatory requirement
 */
export const CreateRegulatoryRequirementDto = {
  schema: {
    type: 'object',
    required: [
      'requirementCode',
      'title',
      'description',
      'regulatoryBody',
      'regulationType',
      'category',
      'effectiveDate',
    ],
    properties: {
      requirementCode: { type: 'string', example: 'OMB-A123' },
      title: { type: 'string', example: 'Management\'s Responsibility for Enterprise Risk Management' },
      description: { type: 'string', example: 'Federal agencies must implement ERM' },
      regulatoryBody: { type: 'string', example: 'Office of Management and Budget' },
      regulationType: { type: 'string', enum: Object.values(RegulationType) },
      category: { type: 'string', enum: Object.values(ComplianceCategory) },
      effectiveDate: { type: 'string', format: 'date-time' },
      expirationDate: { type: 'string', format: 'date-time', nullable: true },
      mandatoryCompliance: { type: 'boolean', default: true },
      applicableAgencies: { type: 'array', items: { type: 'string' } },
      priority: { type: 'string', enum: Object.values(CompliancePriority) },
    },
  },
};

/**
 * Swagger DTO for compliance deadline
 */
export const CreateComplianceDeadlineDto = {
  schema: {
    type: 'object',
    required: ['requirementId', 'title', 'description', 'dueDate', 'assignedTo', 'departmentId'],
    properties: {
      requirementId: { type: 'string', format: 'uuid' },
      title: { type: 'string', example: 'Annual FISMA Compliance Report' },
      description: { type: 'string', example: 'Submit annual FISMA compliance assessment' },
      dueDate: { type: 'string', format: 'date-time' },
      assignedTo: { type: 'array', items: { type: 'string' } },
      departmentId: { type: 'string', format: 'uuid' },
      priority: { type: 'string', enum: Object.values(CompliancePriority) },
      deliverables: { type: 'array', items: { type: 'string' } },
    },
  },
};

/**
 * Swagger response schema for dashboard metrics
 */
export const ComplianceDashboardMetricsResponse = {
  schema: {
    type: 'object',
    properties: {
      overallComplianceRate: { type: 'number', example: 92.5 },
      totalRequirements: { type: 'number', example: 150 },
      compliantRequirements: { type: 'number', example: 139 },
      nonCompliantRequirements: { type: 'number', example: 11 },
      upcomingDeadlines: { type: 'number', example: 8 },
      overdueDeadlines: { type: 'number', example: 2 },
      activeCertifications: { type: 'number', example: 45 },
      expiringCertifications: { type: 'number', example: 5 },
      openViolations: { type: 'number', example: 3 },
      criticalRisks: { type: 'number', example: 1 },
      trainingCompletionRate: { type: 'number', example: 87.5 },
      recentSubmissions: { type: 'number', example: 12 },
      categoryBreakdown: {
        type: 'object',
        additionalProperties: { type: 'number' },
      },
    },
  },
};
