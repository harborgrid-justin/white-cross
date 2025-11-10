/**
 * @fileoverview Incident Management Interface
 * @module interfaces/models/incident
 * @description Security incident management data model
 */

import { IBaseEntity, IAuditableEntity, ITaggableEntity } from './base-entity.interface';
import { IncidentStatus, IncidentPriority, IncidentCategory } from '../enums/incident-types.enum';
import { ThreatSeverity } from '../enums/threat-types.enum';

/**
 * Security incident interface
 */
export interface IIncident extends IBaseEntity, IAuditableEntity, ITaggableEntity {
  /** Incident title */
  title: string;

  /** Detailed description */
  description: string;

  /** Incident category */
  category: IncidentCategory;

  /** Current status */
  status: IncidentStatus;

  /** Priority level */
  priority: IncidentPriority;

  /** Severity level */
  severity: ThreatSeverity;

  /** Confidence level (0-100) */
  confidence?: number;

  /** Incident detection time */
  detectedAt: Date;

  /** Incident occurrence time (may be earlier than detection) */
  occurredAt?: Date;

  /** Incident report time */
  reportedAt: Date;

  /** Reporter user ID */
  reportedBy: string;

  /** Reporter details */
  reporter?: IIncidentReporter;

  /** Assigned analyst/responder ID */
  assignedTo?: string;

  /** Assigned team */
  assignedTeam?: string;

  /** Acknowledgment time */
  acknowledgedAt?: Date;

  /** Containment time */
  containedAt?: Date;

  /** Resolution time */
  resolvedAt?: Date;

  /** Closure time */
  closedAt?: Date;

  /** SLA breach indicator */
  slaBreached?: boolean;

  /** SLA breach time */
  slaBreachTime?: Date;

  /** Target resolution time */
  targetResolutionTime?: Date;

  /** Affected systems/assets */
  affectedSystems: string[];

  /** Affected users */
  affectedUsers?: string[];

  /** Affected services */
  affectedServices?: string[];

  /** Estimated impact */
  estimatedImpact?: string;

  /** Root cause */
  rootCause?: string;

  /** Root cause analysis completed */
  rcaCompleted?: boolean;

  /** Containment actions taken */
  containmentActions?: IIncidentAction[];

  /** Remediation actions taken */
  remediationActions?: IIncidentAction[];

  /** Response timeline */
  timeline?: IIncidentTimelineEntry[];

  /** Related threat intelligence IDs */
  relatedThreats?: string[];

  /** Related vulnerability IDs */
  relatedVulnerabilities?: string[];

  /** Related incident IDs */
  relatedIncidents?: string[];

  /** Evidence collected */
  evidence?: IEvidence[];

  /** Communication logs */
  communications?: ICommunicationLog[];

  /** Lessons learned */
  lessonsLearned?: string;

  /** Post-incident review completed */
  postIncidentReviewCompleted?: boolean;

  /** Post-incident review date */
  postIncidentReviewDate?: Date;

  /** Indicators of Compromise found */
  indicators?: string[];

  /** Attack vector */
  attackVector?: string;

  /** Attack surface */
  attackSurface?: string;

  /** Business impact */
  businessImpact?: IBusinessImpact;

  /** Financial impact */
  financialImpact?: number;

  /** Currency */
  currency?: string;

  /** Notification sent */
  notificationsSent?: INotificationRecord[];

  /** Escalation history */
  escalations?: IEscalation[];

  /** Custom fields */
  customFields?: Record<string, any>;
}

/**
 * Incident reporter information
 */
export interface IIncidentReporter {
  /** Reporter ID */
  id: string;

  /** Reporter name */
  name: string;

  /** Reporter email */
  email: string;

  /** Reporter phone */
  phone?: string;

  /** Reporter department */
  department?: string;

  /** Reporter role */
  role?: string;
}

/**
 * Incident action (containment/remediation)
 */
export interface IIncidentAction {
  /** Action ID */
  id: string;

  /** Action type */
  type: 'CONTAINMENT' | 'REMEDIATION' | 'RECOVERY' | 'PREVENTION';

  /** Action description */
  description: string;

  /** Taken by user ID */
  takenBy: string;

  /** Taken at timestamp */
  takenAt: Date;

  /** Action status */
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';

  /** Action result */
  result?: string;

  /** Evidence/proof */
  evidence?: string[];

  /** Notes */
  notes?: string;
}

/**
 * Incident timeline entry
 */
export interface IIncidentTimelineEntry {
  /** Entry ID */
  id: string;

  /** Timestamp */
  timestamp: Date;

  /** Event type */
  eventType: 'DETECTION' | 'REPORT' | 'ACKNOWLEDGMENT' | 'INVESTIGATION' | 'CONTAINMENT' | 'REMEDIATION' | 'RESOLUTION' | 'CLOSURE' | 'NOTE' | 'STATUS_CHANGE' | 'ESCALATION';

  /** Description */
  description: string;

  /** User who performed action */
  userId: string;

  /** Related data */
  data?: Record<string, any>;
}

/**
 * Evidence collected during incident
 */
export interface IEvidence {
  /** Evidence ID */
  id: string;

  /** Evidence type */
  type: 'LOG' | 'SCREENSHOT' | 'FILE' | 'NETWORK_CAPTURE' | 'MEMORY_DUMP' | 'DISK_IMAGE' | 'OTHER';

  /** Description */
  description: string;

  /** File path or location */
  location: string;

  /** File hash (for integrity) */
  hash?: string;

  /** Hash algorithm */
  hashAlgorithm?: 'MD5' | 'SHA1' | 'SHA256';

  /** Collected by */
  collectedBy: string;

  /** Collected at */
  collectedAt: Date;

  /** Chain of custody */
  chainOfCustody?: IChainOfCustody[];

  /** Tags */
  tags?: string[];
}

/**
 * Chain of custody for evidence
 */
export interface IChainOfCustody {
  /** Transfer ID */
  id: string;

  /** From user */
  from: string;

  /** To user */
  to: string;

  /** Transfer timestamp */
  timestamp: Date;

  /** Reason */
  reason: string;

  /** Signature/approval */
  signature?: string;
}

/**
 * Communication log
 */
export interface ICommunicationLog {
  /** Log ID */
  id: string;

  /** Communication type */
  type: 'EMAIL' | 'PHONE' | 'SLACK' | 'TEAMS' | 'MEETING' | 'OTHER';

  /** Subject/topic */
  subject: string;

  /** Participants */
  participants: string[];

  /** Timestamp */
  timestamp: Date;

  /** Summary */
  summary: string;

  /** Full content (optional) */
  content?: string;

  /** Attachments */
  attachments?: string[];
}

/**
 * Business impact assessment
 */
export interface IBusinessImpact {
  /** Revenue impact */
  revenueImpact?: number;

  /** Customer impact count */
  customersAffected?: number;

  /** Service availability impact */
  availabilityImpact?: string;

  /** Reputation impact */
  reputationImpact?: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

  /** Compliance impact */
  complianceImpact?: string[];

  /** Data breach indicator */
  dataBreached?: boolean;

  /** Records compromised */
  recordsCompromised?: number;

  /** Data types affected */
  dataTypesAffected?: string[];
}

/**
 * Notification record
 */
export interface INotificationRecord {
  /** Notification ID */
  id: string;

  /** Recipient */
  recipient: string;

  /** Notification type */
  type: 'EMAIL' | 'SMS' | 'PUSH' | 'WEBHOOK';

  /** Sent at */
  sentAt: Date;

  /** Status */
  status: 'SENT' | 'DELIVERED' | 'FAILED' | 'BOUNCED';

  /** Template used */
  template?: string;
}

/**
 * Escalation record
 */
export interface IEscalation {
  /** Escalation ID */
  id: string;

  /** Escalated to */
  escalatedTo: string;

  /** Escalated by */
  escalatedBy: string;

  /** Escalated at */
  escalatedAt: Date;

  /** Escalation level */
  level: number;

  /** Reason */
  reason: string;

  /** Acknowledged */
  acknowledged?: boolean;

  /** Acknowledged at */
  acknowledgedAt?: Date;
}
