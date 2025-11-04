/**
 * Incident-related types for compliance domain.
 *
 * @module hooks/domains/compliance/types-incidents
 */

/**
 * Compliance incident or violation record for tracking breaches and near-misses.
 *
 * Documents compliance incidents including HIPAA breaches, policy violations,
 * security incidents, and patient complaints. Tracks investigation progress,
 * root cause analysis, and corrective actions.
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
