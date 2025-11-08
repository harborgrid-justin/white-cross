import { IncidentSeverity } from '../enums/incident-severity.enum';
import { IncidentStatus } from '../enums/incident-status.enum';
import { SecurityIncidentType } from '../enums/incident-type.enum';

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
