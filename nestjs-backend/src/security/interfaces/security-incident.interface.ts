import {
  SecurityIncidentType,
  IncidentSeverity,
  IncidentStatus,
} from '../enums';

/**
 * Security Incident Interface
 * Comprehensive structure for tracking security incidents
 */
export interface ISecurityIncident {
  id: string;
  type: SecurityIncidentType;
  severity: IncidentSeverity;
  status: IncidentStatus;
  title: string;
  description: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  resourceAccessed?: string;
  detectedAt: Date;
  detectionMethod: string;
  indicators: string[];
  impact?: string;
  assignedTo?: string;
  resolvedAt?: Date;
  resolution?: string;
  preventiveMeasures?: string[];
  metadata?: Record<string, any>;
}
