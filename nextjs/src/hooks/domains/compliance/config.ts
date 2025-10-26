/**
 * Compliance Domain Configuration
 *
 * Centralized configuration, TypeScript interfaces, query keys, and cache settings
 * for the compliance management domain. Supports HIPAA compliance tracking, policy
 * management, training administration, audit logging, incident reporting, and risk
 * assessment workflows in the White Cross Healthcare Platform.
 *
 * This module provides:
 * - TanStack Query key factories for compliance data
 * - Cache configuration optimized for compliance workflows
 * - TypeScript interfaces for all compliance entities
 * - Utility functions for cache invalidation
 *
 * @module hooks/domains/compliance/config
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 *
 * @see {@link https://www.hhs.gov/hipaa/for-professionals/index.html} HIPAA Compliance Guidelines
 */

import { QueryClient } from '@tanstack/react-query';

/**
 * Query key factory for the compliance domain.
 *
 * Hierarchical query key structure for organizing TanStack Query cache keys
 * across audits, policies, training, incidents, and risk assessments. Enables
 * precise cache invalidation and efficient query coordination.
 *
 * @constant
 *
 * @property {Array<'compliance', 'audits'>} audits - Root key for all audit queries
 * @property {Function} auditsList - Factory for filtered audit list queries
 * @property {Function} auditDetails - Factory for specific audit details query
 * @property {Function} auditReports - Factory for audit reports query
 * @property {Array<'compliance', 'reports'>} reports - Root key for compliance reports
 * @property {Function} reportsList - Factory for filtered report list queries
 * @property {Function} reportDetails - Factory for specific report details query
 * @property {Array<'compliance', 'policies'>} policies - Root key for policy queries
 * @property {Function} policiesList - Factory for filtered policy list queries
 * @property {Function} policyDetails - Factory for specific policy details query
 * @property {Function} policyVersions - Factory for policy version history query
 * @property {Array<'compliance', 'training'>} training - Root key for training queries
 * @property {Function} trainingList - Factory for filtered training list queries
 * @property {Function} trainingDetails - Factory for specific training details query
 * @property {Function} userTraining - Factory for user-specific training records query
 * @property {Array<'compliance', 'incidents'>} incidents - Root key for incident queries
 * @property {Function} incidentsList - Factory for filtered incident list queries
 * @property {Function} incidentDetails - Factory for specific incident details query
 * @property {Array<'compliance', 'risk-assessments'>} riskAssessments - Root key for risk assessment queries
 * @property {Function} riskAssessmentsList - Factory for filtered risk assessment list queries
 * @property {Function} riskAssessmentDetails - Factory for specific risk assessment details query
 *
 * @example
 * ```typescript
 * // Invalidate all policies
 * queryClient.invalidateQueries({
 *   queryKey: COMPLIANCE_QUERY_KEYS.policies
 * });
 *
 * // Invalidate specific policy
 * queryClient.invalidateQueries({
 *   queryKey: COMPLIANCE_QUERY_KEYS.policyDetails(policyId)
 * });
 *
 * // Invalidate filtered audit list
 * queryClient.invalidateQueries({
 *   queryKey: COMPLIANCE_QUERY_KEYS.auditsList({ type: 'HIPAA', status: 'COMPLETED' })
 * });
 * ```
 *
 * @remarks
 * Query key hierarchy enables granular cache control:
 * - Invalidating root keys (e.g., `policies`) clears all related queries
 * - Invalidating list keys (e.g., `policiesList(filters)`) clears specific filtered views
 * - Invalidating detail keys (e.g., `policyDetails(id)`) clears single entity
 *
 * @see {@link COMPLIANCE_CACHE_CONFIG} for cache timing configuration
 */
export const COMPLIANCE_QUERY_KEYS = {
  // Audits
  audits: ['compliance', 'audits'] as const,
  auditsList: (filters?: any) => [...COMPLIANCE_QUERY_KEYS.audits, 'list', filters] as const,
  auditDetails: (id: string) => [...COMPLIANCE_QUERY_KEYS.audits, 'detail', id] as const,
  auditReports: (auditId: string) => [...COMPLIANCE_QUERY_KEYS.audits, auditId, 'reports'] as const,
  
  // Compliance Reports
  reports: ['compliance', 'reports'] as const,
  reportsList: (filters?: any) => [...COMPLIANCE_QUERY_KEYS.reports, 'list', filters] as const,
  reportDetails: (id: string) => [...COMPLIANCE_QUERY_KEYS.reports, 'detail', id] as const,
  
  // Policies
  policies: ['compliance', 'policies'] as const,
  policiesList: (filters?: any) => [...COMPLIANCE_QUERY_KEYS.policies, 'list', filters] as const,
  policyDetails: (id: string) => [...COMPLIANCE_QUERY_KEYS.policies, 'detail', id] as const,
  policyVersions: (policyId: string) => [...COMPLIANCE_QUERY_KEYS.policies, policyId, 'versions'] as const,
  
  // Training
  training: ['compliance', 'training'] as const,
  trainingList: (filters?: any) => [...COMPLIANCE_QUERY_KEYS.training, 'list', filters] as const,
  trainingDetails: (id: string) => [...COMPLIANCE_QUERY_KEYS.training, 'detail', id] as const,
  userTraining: (userId: string) => [...COMPLIANCE_QUERY_KEYS.training, 'user', userId] as const,
  
  // Incidents
  incidents: ['compliance', 'incidents'] as const,
  incidentsList: (filters?: any) => [...COMPLIANCE_QUERY_KEYS.incidents, 'list', filters] as const,
  incidentDetails: (id: string) => [...COMPLIANCE_QUERY_KEYS.incidents, 'detail', id] as const,
  
  // Risk Assessments
  riskAssessments: ['compliance', 'risk-assessments'] as const,
  riskAssessmentsList: (filters?: any) => [...COMPLIANCE_QUERY_KEYS.riskAssessments, 'list', filters] as const,
  riskAssessmentDetails: (id: string) => [...COMPLIANCE_QUERY_KEYS.riskAssessments, 'detail', id] as const,
} as const;

/**
 * Cache configuration constants for compliance domain queries.
 *
 * Optimized cache timing for different compliance data types based on update
 * frequency and data sensitivity. Balances freshness requirements with
 * performance optimization.
 *
 * @constant
 *
 * @property {number} DEFAULT_STALE_TIME - Default stale time for all compliance queries (5 minutes)
 * @property {number} DEFAULT_CACHE_TIME - Default cache retention time (10 minutes)
 * @property {number} AUDITS_STALE_TIME - Stale time for audit data (10 minutes)
 * @property {number} POLICIES_STALE_TIME - Stale time for policy data (30 minutes)
 * @property {number} TRAINING_STALE_TIME - Stale time for training data (15 minutes)
 * @property {number} INCIDENTS_STALE_TIME - Stale time for incident data (2 minutes)
 * @property {number} REPORTS_STALE_TIME - Stale time for report data (5 minutes)
 *
 * @example
 * ```typescript
 * // Use in query hook
 * useQuery({
 *   queryKey: COMPLIANCE_QUERY_KEYS.policiesList(),
 *   queryFn: fetchPolicies,
 *   staleTime: COMPLIANCE_CACHE_CONFIG.POLICIES_STALE_TIME,
 * });
 * ```
 *
 * @remarks
 * **Cache Time Rationale:**
 * - **Audits (10min)**: Audit data changes infrequently during audit execution
 * - **Policies (30min)**: Policies are relatively static after approval
 * - **Training (15min)**: Training records update moderately with completions
 * - **Incidents (2min)**: Incidents require near real-time updates during investigation
 * - **Reports (5min)**: Reports benefit from moderate caching for performance
 *
 * **Stale Time vs Cache Time:**
 * - Stale time: How long data is considered fresh (no refetch needed)
 * - Cache time: How long to retain unused data in memory
 * - Cache time is typically 2x stale time for smooth background updates
 *
 * @see {@link https://tanstack.com/query/latest/docs/react/guides/caching} TanStack Query Caching Guide
 */
export const COMPLIANCE_CACHE_CONFIG = {
  // Standard cache times
  DEFAULT_STALE_TIME: 5 * 60 * 1000, // 5 minutes
  DEFAULT_CACHE_TIME: 10 * 60 * 1000, // 10 minutes
  
  // Specific configurations
  AUDITS_STALE_TIME: 10 * 60 * 1000, // 10 minutes
  POLICIES_STALE_TIME: 30 * 60 * 1000, // 30 minutes
  TRAINING_STALE_TIME: 15 * 60 * 1000, // 15 minutes
  INCIDENTS_STALE_TIME: 2 * 60 * 1000, // 2 minutes (more dynamic)
  REPORTS_STALE_TIME: 5 * 60 * 1000, // 5 minutes
} as const;

/**
 * Compliance audit record for tracking HIPAA, HITECH, and internal audits.
 *
 * Represents a comprehensive audit of healthcare compliance requirements,
 * tracking audit execution, findings, remediation, and closure. Supports
 * multiple audit types and regulatory frameworks.
 *
 * @interface ComplianceAudit
 *
 * @property {string} id - Unique audit identifier
 * @property {string} title - Audit title or name
 * @property {string} description - Detailed audit description and objectives
 * @property {'HIPAA' | 'SOX' | 'GDPR' | 'HITECH' | 'INTERNAL'} type - Audit type and regulatory framework
 * @property {'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'} status - Current audit status
 * @property {Object} auditor - Auditor information
 * @property {string} auditor.id - Auditor user ID
 * @property {string} auditor.name - Auditor full name
 * @property {string} [auditor.organization] - External auditing organization (if applicable)
 * @property {string} startDate - Audit start date (ISO 8601)
 * @property {string} [endDate] - Audit completion date (ISO 8601)
 * @property {string[]} scope - Areas or systems covered by audit
 * @property {AuditFinding[]} findings - List of audit findings and issues
 * @property {string} createdAt - Record creation timestamp (ISO 8601)
 * @property {string} updatedAt - Last update timestamp (ISO 8601)
 *
 * @example
 * ```typescript
 * const hipaaAudit: ComplianceAudit = {
 *   id: 'audit-001',
 *   title: 'Annual HIPAA Security Audit',
 *   description: 'Comprehensive review of HIPAA security controls',
 *   type: 'HIPAA',
 *   status: 'IN_PROGRESS',
 *   auditor: {
 *     id: 'auditor-123',
 *     name: 'Jane Smith',
 *     organization: 'Healthcare Compliance Partners'
 *   },
 *   startDate: '2025-10-01T00:00:00Z',
 *   scope: ['Electronic Health Records', 'Data Encryption', 'Access Controls'],
 *   findings: [],
 *   createdAt: '2025-10-01T09:00:00Z',
 *   updatedAt: '2025-10-26T14:30:00Z'
 * };
 * ```
 *
 * @see {@link AuditFinding} for finding details
 * @see {@link useAudits} for fetching audits
 * @see {@link useCreateAudit} for creating audits
 */
export interface ComplianceAudit {
  id: string;
  title: string;
  description: string;
  type: 'HIPAA' | 'SOX' | 'GDPR' | 'HITECH' | 'INTERNAL';
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  auditor: {
    id: string;
    name: string;
    organization?: string;
  };
  startDate: string;
  endDate?: string;
  scope: string[];
  findings: AuditFinding[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Individual finding discovered during a compliance audit.
 *
 * Represents a specific compliance gap, violation, or area of concern
 * identified during an audit. Tracks finding severity, status, assignment,
 * and resolution progress.
 *
 * @interface AuditFinding
 *
 * @property {string} id - Unique finding identifier
 * @property {string} title - Finding title or summary
 * @property {string} description - Detailed finding description and evidence
 * @property {'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'} severity - Finding severity level
 * @property {string} category - Finding category (e.g., 'Access Control', 'Data Encryption')
 * @property {'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'ACCEPTED_RISK'} status - Current finding status
 * @property {string} [assignedTo] - User ID responsible for remediation
 * @property {string} [dueDate] - Remediation due date (ISO 8601)
 * @property {string} [resolution] - Description of how finding was resolved
 * @property {string} createdAt - Finding discovery timestamp (ISO 8601)
 * @property {string} updatedAt - Last update timestamp (ISO 8601)
 *
 * @example
 * ```typescript
 * const finding: AuditFinding = {
 *   id: 'finding-001',
 *   title: 'Weak Password Policy',
 *   description: 'Current password policy does not meet HIPAA requirements for minimum length',
 *   severity: 'HIGH',
 *   category: 'Access Control',
 *   status: 'IN_PROGRESS',
 *   assignedTo: 'user-456',
 *   dueDate: '2025-11-15T00:00:00Z',
 *   createdAt: '2025-10-15T10:00:00Z',
 *   updatedAt: '2025-10-20T14:30:00Z'
 * };
 * ```
 *
 * @remarks
 * **Severity Levels:**
 * - CRITICAL: Immediate data breach risk or regulatory violation
 * - HIGH: Significant compliance gap requiring urgent remediation
 * - MEDIUM: Important issue that should be addressed soon
 * - LOW: Minor gap or recommendation for improvement
 *
 * **Status Workflow:**
 * - OPEN: Finding identified, not yet assigned or worked
 * - IN_PROGRESS: Remediation actively underway
 * - RESOLVED: Issue fully remediated and verified
 * - ACCEPTED_RISK: Finding acknowledged but risk accepted (requires justification)
 *
 * @see {@link ComplianceAudit} for parent audit
 */
export interface AuditFinding {
  id: string;
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  category: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'ACCEPTED_RISK';
  assignedTo?: string;
  dueDate?: string;
  resolution?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Compliance policy document with version tracking and approval workflow.
 *
 * Represents organizational policies for privacy, security, clinical operations,
 * and administrative procedures. Supports version control, approval workflows,
 * and policy acknowledgment tracking for HIPAA compliance.
 *
 * @interface CompliancePolicy
 *
 * @property {string} id - Unique policy identifier
 * @property {string} title - Policy title
 * @property {string} description - Policy summary and purpose
 * @property {'PRIVACY' | 'SECURITY' | 'OPERATIONAL' | 'CLINICAL' | 'ADMINISTRATIVE'} category - Policy category
 * @property {string} version - Policy version number (e.g., '1.0', '2.1')
 * @property {'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'ACTIVE' | 'ARCHIVED'} status - Current policy status
 * @property {string} effectiveDate - Date policy becomes effective (ISO 8601)
 * @property {string} reviewDate - Next scheduled review date (ISO 8601)
 * @property {Object} [approver] - Policy approver information
 * @property {string} approver.id - Approver user ID
 * @property {string} approver.name - Approver full name
 * @property {string} content - Full policy content (markdown or HTML)
 * @property {PolicyAttachment[]} attachments - Supporting documents and attachments
 * @property {string[]} relatedPolicies - IDs of related policies
 * @property {string} createdAt - Record creation timestamp (ISO 8601)
 * @property {string} updatedAt - Last update timestamp (ISO 8601)
 *
 * @example
 * ```typescript
 * const hipaaPolicy: CompliancePolicy = {
 *   id: 'policy-001',
 *   title: 'HIPAA Privacy Policy',
 *   description: 'Comprehensive policy for protecting patient health information',
 *   category: 'PRIVACY',
 *   version: '3.0',
 *   status: 'ACTIVE',
 *   effectiveDate: '2025-01-01T00:00:00Z',
 *   reviewDate: '2026-01-01T00:00:00Z',
 *   approver: { id: 'user-789', name: 'Dr. Sarah Johnson' },
 *   content: '# HIPAA Privacy Policy\n\n## Purpose\n...',
 *   attachments: [],
 *   relatedPolicies: ['policy-002', 'policy-003'],
 *   createdAt: '2024-11-01T09:00:00Z',
 *   updatedAt: '2025-01-01T08:00:00Z'
 * };
 * ```
 *
 * @remarks
 * **Status Workflow:**
 * - DRAFT: Policy being written, not yet ready for review
 * - UNDER_REVIEW: Policy submitted for stakeholder review
 * - APPROVED: Policy approved but not yet effective
 * - ACTIVE: Policy currently in effect
 * - ARCHIVED: Policy replaced by newer version or no longer applicable
 *
 * **Version Tracking:**
 * - Version numbers follow semantic versioning (major.minor)
 * - Each version change requires new approval workflow
 * - Historical versions retained for audit trail
 *
 * @see {@link PolicyAttachment} for attachment details
 * @see {@link usePolicies} for fetching policies
 * @see {@link useApprovePolicy} for policy approval
 */
export interface CompliancePolicy {
  id: string;
  title: string;
  description: string;
  category: 'PRIVACY' | 'SECURITY' | 'OPERATIONAL' | 'CLINICAL' | 'ADMINISTRATIVE';
  version: string;
  status: 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'ACTIVE' | 'ARCHIVED';
  effectiveDate: string;
  reviewDate: string;
  approver?: {
    id: string;
    name: string;
  };
  content: string;
  attachments: PolicyAttachment[];
  relatedPolicies: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PolicyAttachment {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface ComplianceTraining {
  id: string;
  title: string;
  description: string;
  category: 'HIPAA' | 'SECURITY' | 'SAFETY' | 'CLINICAL' | 'GENERAL';
  type: 'ONLINE' | 'IN_PERSON' | 'HYBRID';
  duration: number; // in minutes
  isRequired: boolean;
  frequency?: 'ANNUAL' | 'BIANNUAL' | 'QUARTERLY' | 'MONTHLY';
  content: TrainingContent;
  completionCriteria: CompletionCriteria;
  createdAt: string;
  updatedAt: string;
}

export interface TrainingContent {
  modules: TrainingModule[];
  resources: TrainingResource[];
  assessment?: TrainingAssessment;
}

export interface TrainingModule {
  id: string;
  title: string;
  content: string;
  order: number;
  estimatedTime: number;
}

export interface TrainingResource {
  id: string;
  title: string;
  type: 'DOCUMENT' | 'VIDEO' | 'LINK' | 'PRESENTATION';
  url?: string;
  fileName?: string;
}

export interface TrainingAssessment {
  id: string;
  questions: AssessmentQuestion[];
  passingScore: number;
  maxAttempts: number;
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER';
  options?: string[];
  correctAnswer: string | string[];
  points: number;
}

export interface CompletionCriteria {
  requiresAssessment: boolean;
  minimumScore?: number;
  requiresAttendance?: boolean;
  attendanceThreshold?: number;
}

export interface UserTrainingRecord {
  id: string;
  userId: string;
  trainingId: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'EXPIRED' | 'FAILED';
  startedAt?: string;
  completedAt?: string;
  expiresAt?: string;
  score?: number;
  attempts: TrainingAttempt[];
  certificateUrl?: string;
}

export interface TrainingAttempt {
  id: string;
  attemptNumber: number;
  startedAt: string;
  completedAt?: string;
  score?: number;
  responses: AssessmentResponse[];
}

export interface AssessmentResponse {
  questionId: string;
  answer: string | string[];
  isCorrect: boolean;
  points: number;
}

/**
 * Compliance incident or violation record for tracking breaches and near-misses.
 *
 * Documents compliance incidents including HIPAA breaches, policy violations,
 * security incidents, and patient complaints. Tracks investigation progress,
 * root cause analysis, and corrective actions.
 *
 * @interface ComplianceIncident
 *
 * @property {string} id - Unique incident identifier
 * @property {string} title - Incident title or summary
 * @property {string} description - Detailed incident description
 * @property {'BREACH' | 'VIOLATION' | 'NEAR_MISS' | 'COMPLAINT' | 'OTHER'} type - Incident type
 * @property {'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'} severity - Incident severity
 * @property {'REPORTED' | 'INVESTIGATING' | 'RESOLVED' | 'CLOSED'} status - Current incident status
 * @property {Object} reportedBy - Person who reported incident
 * @property {string} reportedBy.id - Reporter user ID
 * @property {string} reportedBy.name - Reporter full name
 * @property {Object} [assignedTo] - Investigator assigned to incident
 * @property {string} assignedTo.id - Investigator user ID
 * @property {string} assignedTo.name - Investigator full name
 * @property {string[]} affectedSystems - Systems or areas affected by incident
 * @property {string[]} [affectedData] - Types of data affected (if applicable)
 * @property {string} potentialImpact - Potential impact assessment
 * @property {string} [actualImpact] - Actual impact once determined
 * @property {string} [rootCause] - Root cause analysis findings
 * @property {CorrectiveAction[]} correctiveActions - Corrective and preventive actions
 * @property {string} reportedAt - Incident report timestamp (ISO 8601)
 * @property {string} [occurredAt] - When incident actually occurred (ISO 8601)
 * @property {string} [resolvedAt] - Incident resolution timestamp (ISO 8601)
 * @property {string} createdAt - Record creation timestamp (ISO 8601)
 * @property {string} updatedAt - Last update timestamp (ISO 8601)
 *
 * @example
 * ```typescript
 * const breachIncident: ComplianceIncident = {
 *   id: 'incident-001',
 *   title: 'Unauthorized PHI Access',
 *   description: 'Staff member accessed patient records without authorization',
 *   type: 'BREACH',
 *   severity: 'HIGH',
 *   status: 'INVESTIGATING',
 *   reportedBy: { id: 'user-123', name: 'Jane Doe' },
 *   assignedTo: { id: 'user-456', name: 'John Smith' },
 *   affectedSystems: ['EHR System'],
 *   affectedData: ['Patient Demographics', 'Medical History'],
 *   potentialImpact: 'Breach of 25 patient records',
 *   correctiveActions: [],
 *   reportedAt: '2025-10-26T09:00:00Z',
 *   occurredAt: '2025-10-25T14:30:00Z',
 *   createdAt: '2025-10-26T09:00:00Z',
 *   updatedAt: '2025-10-26T14:30:00Z'
 * };
 * ```
 *
 * @remarks
 * **Incident Types:**
 * - BREACH: HIPAA breach or unauthorized data access
 * - VIOLATION: Policy or procedure violation
 * - NEAR_MISS: Potential incident that was prevented
 * - COMPLAINT: Patient or staff complaint
 * - OTHER: Other compliance-related incident
 *
 * **Severity Assessment:**
 * - CRITICAL: Major breach requiring regulatory notification
 * - HIGH: Significant incident requiring immediate action
 * - MEDIUM: Moderate incident requiring investigation
 * - LOW: Minor incident for tracking and prevention
 *
 * **HIPAA Breach Notification:**
 * - Breaches affecting 500+ individuals require HHS notification within 60 days
 * - Smaller breaches logged and reported annually
 * - Critical incidents may require immediate notification
 *
 * @see {@link CorrectiveAction} for corrective action details
 * @see {@link useIncidents} for fetching incidents
 * @see {@link useCreateIncident} for reporting incidents
 */
export interface ComplianceIncident {
  id: string;
  title: string;
  description: string;
  type: 'BREACH' | 'VIOLATION' | 'NEAR_MISS' | 'COMPLAINT' | 'OTHER';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'REPORTED' | 'INVESTIGATING' | 'RESOLVED' | 'CLOSED';
  reportedBy: {
    id: string;
    name: string;
  };
  assignedTo?: {
    id: string;
    name: string;
  };
  affectedSystems: string[];
  affectedData?: string[];
  potentialImpact: string;
  actualImpact?: string;
  rootCause?: string;
  correctiveActions: CorrectiveAction[];
  reportedAt: string;
  occurredAt?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CorrectiveAction {
  id: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
  completedAt?: string;
  notes?: string;
}

export interface RiskAssessment {
  id: string;
  title: string;
  description: string;
  scope: string[];
  assessor: {
    id: string;
    name: string;
  };
  methodology: string;
  riskCategories: RiskCategory[];
  overallRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  recommendedActions: RecommendedAction[];
  status: 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'IMPLEMENTED';
  assessmentDate: string;
  nextReviewDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface RiskCategory {
  id: string;
  name: string;
  description: string;
  risks: Risk[];
  categoryRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface Risk {
  id: string;
  title: string;
  description: string;
  likelihood: 'VERY_LOW' | 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
  impact: 'VERY_LOW' | 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  currentControls: string[];
  residualRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  treatmentPlan?: string;
}

export interface RecommendedAction {
  id: string;
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  estimatedCost?: number;
  estimatedTimeframe: string;
  responsibleParty?: string;
  status: 'RECOMMENDED' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED' | 'DEFERRED';
}

/**
 * Invalidates all compliance-related queries in the TanStack Query cache.
 *
 * Use this utility function to force a refetch of all compliance data after
 * major system changes or when you need to ensure complete cache freshness.
 *
 * @param {QueryClient} queryClient - TanStack Query client instance
 *
 * @example
 * ```typescript
 * // Invalidate all compliance data after system update
 * import { invalidateComplianceQueries } from '@/hooks/domains/compliance/config';
 *
 * const handleSystemUpdate = () => {
 *   invalidateComplianceQueries(queryClient);
 *   toast.success('Compliance data refreshed');
 * };
 * ```
 *
 * @remarks
 * This is a broad invalidation that affects all compliance queries including
 * audits, policies, training, incidents, and risk assessments. Use more specific
 * invalidation functions (like `invalidateAuditQueries`) when possible for better
 * performance.
 *
 * @see {@link invalidateAuditQueries} for audit-specific invalidation
 * @see {@link invalidatePolicyQueries} for policy-specific invalidation
 * @see {@link COMPLIANCE_QUERY_KEYS} for query key structure
 */
export const invalidateComplianceQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: ['compliance'] });
};

/**
 * Invalidates all audit-related queries in the TanStack Query cache.
 *
 * @param {QueryClient} queryClient - TanStack Query client instance
 *
 * @example
 * ```typescript
 * // Invalidate audits after creating new audit
 * const createAudit = async (auditData) => {
 *   await api.createAudit(auditData);
 *   invalidateAuditQueries(queryClient);
 * };
 * ```
 *
 * @see {@link COMPLIANCE_QUERY_KEYS} for audit query keys
 */
export const invalidateAuditQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: COMPLIANCE_QUERY_KEYS.audits });
};

/**
 * Invalidates all policy-related queries in the TanStack Query cache.
 *
 * @param {QueryClient} queryClient - TanStack Query client instance
 *
 * @example
 * ```typescript
 * // Invalidate policies after policy approval
 * const approvePolicy = async (policyId) => {
 *   await api.approvePolicy(policyId);
 *   invalidatePolicyQueries(queryClient);
 * };
 * ```
 *
 * @see {@link COMPLIANCE_QUERY_KEYS} for policy query keys
 */
export const invalidatePolicyQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: COMPLIANCE_QUERY_KEYS.policies });
};

/**
 * Invalidates all training-related queries in the TanStack Query cache.
 *
 * @param {QueryClient} queryClient - TanStack Query client instance
 *
 * @example
 * ```typescript
 * // Invalidate training after completion
 * const completeTraining = async (trainingId, userId) => {
 *   await api.completeTraining(trainingId, userId);
 *   invalidateTrainingQueries(queryClient);
 * };
 * ```
 *
 * @see {@link COMPLIANCE_QUERY_KEYS} for training query keys
 */
export const invalidateTrainingQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: COMPLIANCE_QUERY_KEYS.training });
};

/**
 * Invalidates all incident-related queries in the TanStack Query cache.
 *
 * @param {QueryClient} queryClient - TanStack Query client instance
 *
 * @example
 * ```typescript
 * // Invalidate incidents after resolving incident
 * const resolveIncident = async (incidentId, resolution) => {
 *   await api.resolveIncident(incidentId, resolution);
 *   invalidateIncidentQueries(queryClient);
 * };
 * ```
 *
 * @see {@link COMPLIANCE_QUERY_KEYS} for incident query keys
 */
export const invalidateIncidentQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: COMPLIANCE_QUERY_KEYS.incidents });
};

/**
 * Invalidates all risk assessment-related queries in the TanStack Query cache.
 *
 * @param {QueryClient} queryClient - TanStack Query client instance
 *
 * @example
 * ```typescript
 * // Invalidate risk assessments after approving assessment
 * const approveRiskAssessment = async (assessmentId) => {
 *   await api.approveRiskAssessment(assessmentId);
 *   invalidateRiskAssessmentQueries(queryClient);
 * };
 * ```
 *
 * @see {@link COMPLIANCE_QUERY_KEYS} for risk assessment query keys
 */
export const invalidateRiskAssessmentQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: COMPLIANCE_QUERY_KEYS.riskAssessments });
};
