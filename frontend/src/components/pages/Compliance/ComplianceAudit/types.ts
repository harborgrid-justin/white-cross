/**
 * Type definitions for ComplianceAudit module
 *
 * Contains all interfaces, types, and type aliases used in the
 * compliance audit management system.
 *
 * @module ComplianceAudit/types
 */

/**
 * Audit status types
 *
 * Represents the current state of an audit in its lifecycle
 */
export type AuditStatus = 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'overdue';

/**
 * Audit type categories
 *
 * Classifies audits by their purpose and scope
 */
export type AuditType = 'internal' | 'external' | 'regulatory' | 'certification' | 'compliance' | 'risk';

/**
 * Audit priority levels
 *
 * Indicates the urgency and importance of an audit
 */
export type AuditPriority = 'low' | 'medium' | 'high' | 'critical';

/**
 * Audit finding severity levels
 *
 * Categorizes the severity of findings discovered during an audit
 */
export type FindingSeverity = 'critical' | 'major' | 'minor' | 'observation';

/**
 * Finding status
 *
 * Tracks the current state of an audit finding
 */
export type FindingStatus = 'open' | 'in-progress' | 'resolved' | 'accepted-risk';

/**
 * Follow-up action status
 *
 * Tracks the status of remediation actions
 */
export type FollowUpActionStatus = 'pending' | 'in-progress' | 'completed';

/**
 * View mode for displaying audits
 */
export type ViewMode = 'list' | 'grid' | 'calendar';

/**
 * Auditor information interface
 *
 * Contains details about the person or organization conducting the audit
 */
export interface Auditor {
  /** Unique identifier for the auditor */
  id: string;
  /** Full name of the auditor */
  name: string;
  /** Contact email address */
  email: string;
  /** Contact phone number (optional) */
  phone?: string;
  /** Organization or company name (optional) */
  organization?: string;
  /** Avatar URL (optional) */
  avatar?: string;
}

/**
 * Follow-up action interface
 *
 * Represents a corrective or preventive action resulting from audit findings
 */
export interface FollowUpAction {
  /** Unique identifier for the action */
  id: string;
  /** Description of the action to be taken */
  description: string;
  /** ID of the person assigned to complete the action */
  assignedTo: string;
  /** Due date for completion (ISO 8601 format) */
  dueDate: string;
  /** Current status of the action */
  status: FollowUpActionStatus;
}

/**
 * Audit document interface
 *
 * Represents a file or document associated with an audit
 */
export interface AuditDocument {
  /** Unique identifier for the document */
  id: string;
  /** Document filename */
  name: string;
  /** MIME type or file extension */
  type: string;
  /** File size in bytes */
  size: number;
  /** Upload timestamp (ISO 8601 format) */
  uploadDate: string;
}

/**
 * Audit finding interface
 *
 * Represents a specific issue or observation discovered during an audit
 */
export interface AuditFinding {
  /** Unique identifier for the finding */
  id: string;
  /** Brief title of the finding */
  title: string;
  /** Detailed description of the finding */
  description: string;
  /** Severity level of the finding */
  severity: FindingSeverity;
  /** Category or classification of the finding */
  category: string;
  /** Compliance requirement that was not met */
  requirement: string;
  /** Supporting evidence for the finding */
  evidence: string;
  /** Recommended action or remediation */
  recommendation: string;
  /** ID of person assigned to address the finding (optional) */
  assignedTo?: string;
  /** Due date for resolution (ISO 8601 format, optional) */
  dueDate?: string;
  /** Current status of the finding */
  status: FindingStatus;
  /** Creation timestamp (ISO 8601 format) */
  createdAt: string;
}

/**
 * Compliance audit interface
 *
 * Main data structure representing a complete compliance audit
 */
export interface ComplianceAudit {
  /** Unique identifier for the audit */
  id: string;
  /** Audit title */
  title: string;
  /** Detailed description of the audit */
  description: string;
  /** Type/category of the audit */
  type: AuditType;
  /** Current status of the audit */
  status: AuditStatus;
  /** Priority level */
  priority: AuditPriority;
  /** Auditor conducting the audit */
  auditor: Auditor;
  /** Areas or systems in scope for the audit */
  scope: string[];
  /** Scheduled start date (ISO 8601 format) */
  scheduledDate: string;
  /** Actual start date (ISO 8601 format, optional) */
  startDate?: string;
  /** Expected or planned end date (ISO 8601 format, optional) */
  endDate?: string;
  /** Actual completion date (ISO 8601 format, optional) */
  completedDate?: string;
  /** List of findings from the audit */
  findings: AuditFinding[];
  /** Compliance requirements being audited */
  requirements: string[];
  /** Departments involved in the audit */
  departments: string[];
  /** Completion progress (0-100) */
  progress: number;
  /** Overall audit score (0-100, optional) */
  score?: number;
  /** List of recommendations */
  recommendations: string[];
  /** Follow-up actions required */
  followUpActions: FollowUpAction[];
  /** Supporting documents */
  documents: AuditDocument[];
  /** Creation timestamp (ISO 8601 format) */
  createdAt: string;
  /** Last update timestamp (ISO 8601 format) */
  updatedAt: string;
  /** ID of user who created the audit */
  createdBy: string;
}

/**
 * Department information
 */
export interface Department {
  /** Department ID */
  id: string;
  /** Department name */
  name: string;
}

/**
 * Active filters interface
 *
 * Represents the currently applied filters for the audit list
 */
export interface AuditFilters {
  /** Filter by status */
  status: AuditStatus[];
  /** Filter by type */
  type: AuditType[];
  /** Filter by priority */
  priority: AuditPriority[];
  /** Filter by auditor ID */
  auditor: string[];
  /** Filter by department ID */
  department: string[];
}

/**
 * Audit statistics interface
 *
 * Aggregated statistics for audit dashboard
 */
export interface AuditStatistics {
  /** Total number of audits */
  total: number;
  /** Number of scheduled audits */
  scheduled: number;
  /** Number of in-progress audits */
  inProgress: number;
  /** Number of completed audits */
  completed: number;
  /** Number of overdue audits */
  overdue: number;
  /** Total number of findings across all audits */
  totalFindings: number;
  /** Number of open findings */
  openFindings: number;
  /** Average audit score across completed audits */
  avgScore: number;
}

/**
 * Props for the main ComplianceAudit component
 */
export interface ComplianceAuditProps {
  /** Array of audit records */
  audits?: ComplianceAudit[];
  /** Array of available auditors */
  auditors?: Auditor[];
  /** Array of departments */
  departments?: Department[];
  /** Loading state */
  loading?: boolean;
  /** Current view mode */
  viewMode?: ViewMode;
  /** Search term */
  searchTerm?: string;
  /** Active filters */
  activeFilters?: AuditFilters;
  /** Custom CSS classes */
  className?: string;
  /** Audit click handler */
  onAuditClick?: (audit: ComplianceAudit) => void;
  /** Create new audit handler */
  onCreateAudit?: () => void;
  /** Edit audit handler */
  onEditAudit?: (audit: ComplianceAudit) => void;
  /** Delete audit handler */
  onDeleteAudit?: (audit: ComplianceAudit) => void;
  /** View details handler */
  onViewDetails?: (audit: ComplianceAudit) => void;
  /** Download report handler */
  onDownloadReport?: (audit: ComplianceAudit) => void;
  /** Search change handler */
  onSearchChange?: (term: string) => void;
  /** Filter change handler */
  onFilterChange?: (filters: AuditFilters) => void;
  /** View mode change handler */
  onViewModeChange?: (mode: ViewMode) => void;
  /** Finding update handler */
  onUpdateFinding?: (auditId: string, findingId: string, updates: Partial<AuditFinding>) => void;
}
