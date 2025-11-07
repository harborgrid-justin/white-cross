/**
 * Incident Types and Interfaces
 * Shared type definitions for incident management
 *
 * Note: Runtime values (constants, functions) are in separate files:
 * - incidents.constants.ts - Const values like API_BASE
 */

// ==========================================
// INCIDENT TYPES
// ==========================================

export interface IncidentReport {
  id: string;
  studentId: string;
  reportedById: string;
  type: 'INJURY' | 'ILLNESS' | 'BEHAVIORAL' | 'MEDICATION_ERROR' | 'ALLERGIC_REACTION' | 'EMERGENCY' | 'SAFETY' | 'OTHER';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'DRAFT' | 'PENDING_REVIEW' | 'UNDER_INVESTIGATION' | 'REQUIRES_ACTION' | 'RESOLVED' | 'CLOSED';
  description: string;
  location: string;
  witnesses: string[];
  actionsTaken: string;
  parentNotified: boolean;
  parentNotificationMethod?: string;
  parentNotifiedAt?: string;
  followUpRequired: boolean;
  followUpNotes?: string;
  occurredAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface IncidentsResponse {
  incidents: IncidentReport[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  summary?: {
    totalIncidents: number;
    criticalCount: number;
    pendingFollowUp: number;
  };
}

export interface IncidentAnalytics {
  totalIncidents: number;
  byType: Record<string, number>;
  byStatus: Record<string, number>;
  bySeverity: Record<string, number>;
}

// ==========================================
// FOLLOW-UP ACTION TYPES
// ==========================================

export interface FollowUpAction {
  id: string;
  incidentId: string;
  actionType: string;
  description: string;
  assignedTo?: string;
  dueDate?: string;
  status: string;
  completedAt?: string;
  completedBy?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FollowUpStatistics {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
}

// ==========================================
// WITNESS STATEMENT TYPES
// ==========================================

export interface WitnessStatement {
  id: string;
  incidentId: string;
  witnessName: string;
  witnessType: string;
  contactInfo?: string;
  statement: string;
  statementDate: string;
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// ANALYTICS TYPES
// ==========================================

export interface SeverityTrend {
  date: string;
  low: number;
  medium: number;
  high: number;
  critical: number;
}
