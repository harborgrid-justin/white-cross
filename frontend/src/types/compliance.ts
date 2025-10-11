/**
 * Compliance Module Types
 *
 * Comprehensive type definitions for compliance management including:
 * - Compliance reports and checklists
 * - Consent forms and signatures
 * - Policy documents and acknowledgments
 * - Audit logs for HIPAA/FERPA compliance
 * - Statistics and analytics
 */

// ============================================================================
// Enums
// ============================================================================

/**
 * Types of compliance reports
 */
export enum ComplianceReportType {
  HIPAA = 'HIPAA',
  FERPA = 'FERPA',
  STATE_HEALTH = 'STATE_HEALTH',
  MEDICATION_AUDIT = 'MEDICATION_AUDIT',
  SAFETY_INSPECTION = 'SAFETY_INSPECTION',
  TRAINING_COMPLIANCE = 'TRAINING_COMPLIANCE',
  DATA_PRIVACY = 'DATA_PRIVACY',
  CUSTOM = 'CUSTOM',
}

/**
 * Status of compliance reports
 */
export enum ComplianceStatus {
  PENDING = 'PENDING',
  COMPLIANT = 'COMPLIANT',
  NON_COMPLIANT = 'NON_COMPLIANT',
  UNDER_REVIEW = 'UNDER_REVIEW',
}

/**
 * Categories for compliance requirements
 */
export enum ComplianceCategory {
  PRIVACY = 'PRIVACY',
  SECURITY = 'SECURITY',
  DOCUMENTATION = 'DOCUMENTATION',
  TRAINING = 'TRAINING',
  SAFETY = 'SAFETY',
  MEDICATION = 'MEDICATION',
  HEALTH_RECORDS = 'HEALTH_RECORDS',
  CONSENT = 'CONSENT',
}

/**
 * Status of checklist items
 */
export enum ChecklistItemStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  NOT_APPLICABLE = 'NOT_APPLICABLE',
  FAILED = 'FAILED',
}

/**
 * Types of consent forms
 */
export enum ConsentType {
  MEDICAL_TREATMENT = 'MEDICAL_TREATMENT',
  MEDICATION_ADMINISTRATION = 'MEDICATION_ADMINISTRATION',
  EMERGENCY_CARE = 'EMERGENCY_CARE',
  PHOTO_RELEASE = 'PHOTO_RELEASE',
  DATA_SHARING = 'DATA_SHARING',
  TELEHEALTH = 'TELEHEALTH',
  RESEARCH = 'RESEARCH',
  OTHER = 'OTHER',
}

/**
 * Policy document categories
 */
export enum PolicyCategory {
  HIPAA = 'HIPAA',
  FERPA = 'FERPA',
  MEDICATION = 'MEDICATION',
  EMERGENCY = 'EMERGENCY',
  SAFETY = 'SAFETY',
  DATA_SECURITY = 'DATA_SECURITY',
  OPERATIONAL = 'OPERATIONAL',
  TRAINING = 'TRAINING',
}

/**
 * Policy document status
 */
export enum PolicyStatus {
  DRAFT = 'DRAFT',
  UNDER_REVIEW = 'UNDER_REVIEW',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
  SUPERSEDED = 'SUPERSEDED',
}

/**
 * Audit actions for HIPAA compliance
 */
export enum AuditAction {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  EXPORT = 'EXPORT',
  IMPORT = 'IMPORT',
  BACKUP = 'BACKUP',
  RESTORE = 'RESTORE',
}

// ============================================================================
// Core Compliance Report Types
// ============================================================================

/**
 * Compliance report with associated checklist items
 */
export interface ComplianceReport {
  id: string;
  reportType: ComplianceReportType;
  title: string;
  description?: string;
  status: ComplianceStatus;
  period: string;
  findings?: Record<string, any>;
  recommendations?: Record<string, any>;
  dueDate?: string;
  submittedAt?: string;
  submittedBy?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  items?: ComplianceChecklistItem[];
}

/**
 * Individual checklist item for compliance tracking
 */
export interface ComplianceChecklistItem {
  id: string;
  requirement: string;
  description?: string;
  category: ComplianceCategory;
  status: ChecklistItemStatus;
  evidence?: string;
  notes?: string;
  dueDate?: string;
  completedAt?: string;
  completedBy?: string;
  reportId?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Statistics for compliance overview
 */
export interface ComplianceStatistics {
  reports: {
    total: number;
    compliant: number;
    pending: number;
    nonCompliant: number;
  };
  checklistItems: {
    total: number;
    completed: number;
    overdue: number;
    completionRate: number;
  };
}

// ============================================================================
// Consent Management Types
// ============================================================================

/**
 * Consent form template
 */
export interface ConsentForm {
  id: string;
  type: ConsentType;
  title: string;
  description: string;
  content: string;
  version: string;
  isActive: boolean;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
  signatures?: ConsentSignature[];
}

/**
 * Consent signature record
 */
export interface ConsentSignature {
  id: string;
  consentFormId: string;
  studentId: string;
  signedBy: string;
  relationship: string;
  signatureData?: string;
  signedAt: string;
  ipAddress?: string;
  withdrawnAt?: string;
  withdrawnBy?: string;
  createdAt: string;
  updatedAt: string;
  consentForm?: ConsentForm;
  student?: {
    id: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
  };
}

// ============================================================================
// Policy Management Types
// ============================================================================

/**
 * Policy document with versioning
 */
export interface PolicyDocument {
  id: string;
  title: string;
  category: PolicyCategory;
  content: string;
  version: string;
  effectiveDate: string;
  reviewDate?: string;
  status: PolicyStatus;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
  acknowledgments?: PolicyAcknowledgment[];
}

/**
 * Policy acknowledgment by users
 */
export interface PolicyAcknowledgment {
  id: string;
  policyId: string;
  userId: string;
  acknowledgedAt: string;
  ipAddress?: string;
  createdAt: string;
  updatedAt: string;
  policy?: PolicyDocument;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
}

// ============================================================================
// Audit Log Types
// ============================================================================

/**
 * Audit log entry for HIPAA compliance tracking
 */
export interface AuditLog {
  id: string;
  userId?: string;
  action: AuditAction;
  entityType: string;
  entityId?: string;
  changes?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
}

// ============================================================================
// Request/Response Types
// ============================================================================

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * Pagination response metadata
 */
export interface PaginationResult {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationResult;
}

/**
 * Filters for compliance reports
 */
export interface ComplianceReportFilters extends PaginationParams {
  reportType?: ComplianceReportType | string;
  status?: ComplianceStatus | string;
  period?: string;
}

/**
 * Filters for consent forms
 */
export interface ConsentFormFilters {
  isActive?: boolean;
  type?: ConsentType | string;
}

/**
 * Filters for policy documents
 */
export interface PolicyDocumentFilters {
  category?: PolicyCategory | string;
  status?: PolicyStatus | string;
}

/**
 * Filters for audit logs
 */
export interface AuditLogFilters extends PaginationParams {
  userId?: string;
  entityType?: string;
  action?: AuditAction | string;
  startDate?: string;
  endDate?: string;
}

/**
 * Data for creating a compliance report
 */
export interface CreateComplianceReportData {
  reportType: ComplianceReportType | string;
  title: string;
  description?: string;
  period: string;
  dueDate?: string;
}

/**
 * Data for updating a compliance report
 */
export interface UpdateComplianceReportData {
  status?: ComplianceStatus | string;
  findings?: Record<string, any>;
  recommendations?: Record<string, any>;
  submittedBy?: string;
  reviewedBy?: string;
}

/**
 * Data for creating a checklist item
 */
export interface CreateChecklistItemData {
  requirement: string;
  description?: string;
  category: ComplianceCategory | string;
  dueDate?: string;
  reportId?: string;
}

/**
 * Data for updating a checklist item
 */
export interface UpdateChecklistItemData {
  status?: ChecklistItemStatus | string;
  evidence?: string;
  notes?: string;
  completedBy?: string;
}

/**
 * Data for creating a consent form
 */
export interface CreateConsentFormData {
  type: ConsentType | string;
  title: string;
  description: string;
  content: string;
  version?: string;
  expiresAt?: string;
}

/**
 * Data for signing a consent form
 */
export interface SignConsentFormData {
  consentFormId: string;
  studentId: string;
  signedBy: string;
  relationship: string;
  signatureData?: string;
}

/**
 * Data for creating a policy document
 */
export interface CreatePolicyData {
  title: string;
  category: PolicyCategory | string;
  content: string;
  version?: string;
  effectiveDate: string;
  reviewDate?: string;
}

/**
 * Data for updating a policy document
 */
export interface UpdatePolicyData {
  status?: PolicyStatus | string;
  approvedBy?: string;
  reviewDate?: string;
}

/**
 * Data for generating a compliance report
 */
export interface GenerateComplianceReportData {
  reportType: ComplianceReportType | string;
  period: string;
}

// ============================================================================
// API Response Types
// ============================================================================

/**
 * Response for getting compliance reports
 */
export interface ComplianceReportsResponse {
  reports: ComplianceReport[];
  pagination: PaginationResult;
}

/**
 * Response for getting a single compliance report
 */
export interface ComplianceReportResponse {
  report: ComplianceReport;
}

/**
 * Response for getting consent forms
 */
export interface ConsentFormsResponse {
  forms: ConsentForm[];
}

/**
 * Response for getting a consent signature
 */
export interface ConsentSignatureResponse {
  signature: ConsentSignature;
}

/**
 * Response for getting student consents
 */
export interface StudentConsentsResponse {
  consents: ConsentSignature[];
}

/**
 * Response for getting policies
 */
export interface PolicyDocumentsResponse {
  policies: PolicyDocument[];
}

/**
 * Response for getting a policy document
 */
export interface PolicyDocumentResponse {
  policy: PolicyDocument;
}

/**
 * Response for policy acknowledgment
 */
export interface PolicyAcknowledgmentResponse {
  acknowledgment: PolicyAcknowledgment;
}

/**
 * Response for getting audit logs
 */
export interface AuditLogsResponse {
  logs: AuditLog[];
  pagination: PaginationResult;
}

/**
 * Response for getting compliance statistics
 */
export interface ComplianceStatisticsResponse extends ComplianceStatistics {}

/**
 * Response for checklist item operations
 */
export interface ChecklistItemResponse {
  item: ComplianceChecklistItem;
}

/**
 * Response for consent form operations
 */
export interface ConsentFormResponse {
  form: ConsentForm;
}

/**
 * Generic success response
 */
export interface SuccessResponse {
  success: boolean;
  message?: string;
}
