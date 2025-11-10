/**
 * @fileoverview Incident Type Enumerations
 * @module interfaces/enums/incident-types
 * @description Incident management status and classification enums
 */

/**
 * Incident status in lifecycle
 */
export enum IncidentStatus {
  /** Incident reported but not yet triaged */
  REPORTED = 'REPORTED',

  /** Incident triaged and assigned */
  TRIAGED = 'TRIAGED',

  /** Incident under investigation */
  INVESTIGATING = 'INVESTIGATING',

  /** Incident contained, investigating root cause */
  CONTAINED = 'CONTAINED',

  /** Incident resolved */
  RESOLVED = 'RESOLVED',

  /** Post-incident review in progress */
  POST_INCIDENT = 'POST_INCIDENT',

  /** Incident closed */
  CLOSED = 'CLOSED',

  /** Incident reopened */
  REOPENED = 'REOPENED'
}

/**
 * Incident priority levels
 */
export enum IncidentPriority {
  /** Low priority - minimal business impact */
  LOW = 'LOW',

  /** Medium priority - moderate business impact */
  MEDIUM = 'MEDIUM',

  /** High priority - significant business impact */
  HIGH = 'HIGH',

  /** Critical priority - severe business impact */
  CRITICAL = 'CRITICAL'
}

/**
 * Incident category classifications
 */
export enum IncidentCategory {
  /** Security incident */
  SECURITY = 'SECURITY',

  /** Data breach */
  DATA_BREACH = 'DATA_BREACH',

  /** System outage */
  OUTAGE = 'OUTAGE',

  /** Performance degradation */
  PERFORMANCE = 'PERFORMANCE',

  /** Compliance violation */
  COMPLIANCE = 'COMPLIANCE',

  /** Privacy incident */
  PRIVACY = 'PRIVACY',

  /** Service disruption */
  SERVICE_DISRUPTION = 'SERVICE_DISRUPTION',

  /** Unauthorized access */
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',

  /** Other incident types */
  OTHER = 'OTHER'
}
