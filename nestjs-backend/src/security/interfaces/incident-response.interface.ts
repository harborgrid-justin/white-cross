import { ISecurityIncident } from './security-incident.interface';

/**
 * Incident Response Interface
 * Tracks actions taken in response to a security incident
 */
export interface IncidentResponse {
  incident: ISecurityIncident;
  actionsTaken: string[];
  notificationsSent: string[];
  systemChanges: string[];
}
