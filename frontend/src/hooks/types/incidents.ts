/**
 * Incident Types
 * Type definitions for incidents
 */

export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  reportedAt: string;
  reportedBy: string;
  studentId?: string;
  schoolId?: string;
}

export type IncidentSeverity = Incident['severity'];
export type IncidentStatus = Incident['status'];
