/**
 * Compliance Domain Incident Type Definitions
 *
 * TypeScript interfaces for compliance incidents, violations, breaches,
 * and corrective actions in the White Cross Healthcare Platform.
 *
 * @module hooks/domains/compliance/complianceIncidentTypes
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

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

/**
 * Corrective action for incident remediation.
 *
 * @interface CorrectiveAction
 *
 * @property {string} id - Unique corrective action identifier
 * @property {string} description - Action description
 * @property {string} assignedTo - User ID responsible for action
 * @property {string} dueDate - Action due date (ISO 8601)
 * @property {'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE'} status - Action status
 * @property {string} [completedAt] - Completion timestamp (ISO 8601)
 * @property {string} [notes] - Additional notes
 */
export interface CorrectiveAction {
  id: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
  completedAt?: string;
  notes?: string;
}
