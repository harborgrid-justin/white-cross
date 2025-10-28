/**
 * Security Incident Status
 * Tracks the lifecycle stage of a security incident
 */
export enum IncidentStatus {
  DETECTED = 'detected',
  INVESTIGATING = 'investigating',
  CONTAINED = 'contained',
  RESOLVED = 'resolved',
  FALSE_POSITIVE = 'false_positive',
}
