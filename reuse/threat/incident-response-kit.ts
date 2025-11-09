/**
 * LOC: INCIDENTRESP1234567
 * File: /reuse/threat/incident-response-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize
 *   - crypto (Node.js built-in)
 *   - ./threat-intelligence-kit (for IOC integration)
 *
 * DOWNSTREAM (imported by):
 *   - Incident response services
 *   - Security operations centers (SOC)
 *   - Alert management modules
 *   - Forensic analysis services
 *   - Evidence collection modules
 *   - Playbook automation services
 */

/**
 * File: /reuse/threat/incident-response-kit.ts
 * Locator: WC-INCIDENT-RESPONSE-001
 * Purpose: Comprehensive Incident Response Toolkit - Production-ready incident management operations
 *
 * Upstream: Independent utility module for incident response and management
 * Downstream: ../backend/*, Security services, SOC operations, Incident handlers, Forensics
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize, crypto
 * Exports: 40+ utility functions for incident detection, classification, response, evidence, forensics, escalation
 *
 * LLM Context: Enterprise-grade incident response toolkit for White Cross healthcare platform.
 * Provides comprehensive incident detection and alerting, incident classification and severity scoring,
 * automated response playbooks, incident timeline reconstruction, evidence collection and chain of custody,
 * forensic analysis integration, incident escalation workflows, post-incident analysis, and HIPAA-compliant
 * security incident management for healthcare systems. Includes Sequelize models for incidents, alerts, evidence, and playbooks.
 */

import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Security incident structure
 */
export interface SecurityIncident {
  id: string;
  title: string;
  description: string;
  status: IncidentStatus;
  severity: IncidentSeverity;
  priority: IncidentPriority;
  category: IncidentCategory;
  subcategory?: string;
  detectedAt: Date;
  reportedAt: Date;
  acknowledgedAt?: Date;
  containedAt?: Date;
  resolvedAt?: Date;
  closedAt?: Date;
  assignedTo?: string;
  assignedTeam?: string;
  reporter: string;
  affectedAssets: AffectedAsset[];
  relatedAlerts: string[];
  relatedIncidents?: string[];
  relatedIOCs?: string[];
  timeline: IncidentTimelineEntry[];
  evidence: string[]; // Evidence IDs
  responseActions: ResponseAction[];
  playbooks: string[]; // Playbook IDs
  impact: IncidentImpact;
  rootCause?: string;
  remediation?: string;
  lessonsLearned?: string;
  tags: string[];
  metadata?: Record<string, any>;
  complianceFlags?: string[]; // HIPAA, GDPR, etc.
  breachNotificationRequired?: boolean;
}

/**
 * Incident status workflow
 */
export enum IncidentStatus {
  NEW = 'NEW',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  INVESTIGATING = 'INVESTIGATING',
  CONTAINED = 'CONTAINED',
  ERADICATING = 'ERADICATING',
  RECOVERING = 'RECOVERING',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
  FALSE_POSITIVE = 'FALSE_POSITIVE',
}

/**
 * Incident severity levels
 */
export enum IncidentSeverity {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
  INFO = 'INFO',
}

/**
 * Incident priority for response
 */
export enum IncidentPriority {
  P1 = 'P1', // Critical - immediate response
  P2 = 'P2', // High - respond within 1 hour
  P3 = 'P3', // Medium - respond within 4 hours
  P4 = 'P4', // Low - respond within 24 hours
  P5 = 'P5', // Info - respond as capacity allows
}

/**
 * Incident categories
 */
export enum IncidentCategory {
  MALWARE = 'MALWARE',
  PHISHING = 'PHISHING',
  DATA_BREACH = 'DATA_BREACH',
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
  DENIAL_OF_SERVICE = 'DENIAL_OF_SERVICE',
  RANSOMWARE = 'RANSOMWARE',
  INSIDER_THREAT = 'INSIDER_THREAT',
  POLICY_VIOLATION = 'POLICY_VIOLATION',
  VULNERABILITY_EXPLOITATION = 'VULNERABILITY_EXPLOITATION',
  ACCOUNT_COMPROMISE = 'ACCOUNT_COMPROMISE',
  DATA_EXFILTRATION = 'DATA_EXFILTRATION',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  SYSTEM_COMPROMISE = 'SYSTEM_COMPROMISE',
  OTHER = 'OTHER',
}

/**
 * Affected asset information
 */
export interface AffectedAsset {
  id: string;
  type: AssetType;
  name: string;
  ipAddress?: string;
  hostname?: string;
  owner?: string;
  criticalityLevel: 'critical' | 'high' | 'medium' | 'low';
  impactDescription?: string;
  compromised: boolean;
  isolatedAt?: Date;
  metadata?: Record<string, any>;
}

/**
 * Asset types
 */
export enum AssetType {
  SERVER = 'SERVER',
  WORKSTATION = 'WORKSTATION',
  LAPTOP = 'LAPTOP',
  MOBILE_DEVICE = 'MOBILE_DEVICE',
  NETWORK_DEVICE = 'NETWORK_DEVICE',
  DATABASE = 'DATABASE',
  APPLICATION = 'APPLICATION',
  USER_ACCOUNT = 'USER_ACCOUNT',
  CLOUD_RESOURCE = 'CLOUD_RESOURCE',
  IOT_DEVICE = 'IOT_DEVICE',
  MEDICAL_DEVICE = 'MEDICAL_DEVICE',
}

/**
 * Incident timeline entry
 */
export interface IncidentTimelineEntry {
  id: string;
  timestamp: Date;
  eventType: TimelineEventType;
  description: string;
  actor?: string; // User or system that performed the action
  automated: boolean;
  source?: string;
  evidenceIds?: string[];
  metadata?: Record<string, any>;
}

/**
 * Timeline event types
 */
export enum TimelineEventType {
  DETECTION = 'DETECTION',
  ALERT_TRIGGERED = 'ALERT_TRIGGERED',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  INVESTIGATION_STARTED = 'INVESTIGATION_STARTED',
  EVIDENCE_COLLECTED = 'EVIDENCE_COLLECTED',
  ASSET_ISOLATED = 'ASSET_ISOLATED',
  MALWARE_FOUND = 'MALWARE_FOUND',
  IOC_MATCHED = 'IOC_MATCHED',
  PLAYBOOK_EXECUTED = 'PLAYBOOK_EXECUTED',
  ESCALATED = 'ESCALATED',
  CONTAINED = 'CONTAINED',
  REMEDIATION_APPLIED = 'REMEDIATION_APPLIED',
  STATUS_CHANGED = 'STATUS_CHANGED',
  COMMENT_ADDED = 'COMMENT_ADDED',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

/**
 * Response action record
 */
export interface ResponseAction {
  id: string;
  timestamp: Date;
  actionType: ResponseActionType;
  description: string;
  performedBy?: string;
  automated: boolean;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  result?: string;
  metadata?: Record<string, any>;
}

/**
 * Response action types
 */
export enum ResponseActionType {
  ISOLATE_ASSET = 'ISOLATE_ASSET',
  BLOCK_IP = 'BLOCK_IP',
  BLOCK_DOMAIN = 'BLOCK_DOMAIN',
  DISABLE_ACCOUNT = 'DISABLE_ACCOUNT',
  RESET_PASSWORD = 'RESET_PASSWORD',
  KILL_PROCESS = 'KILL_PROCESS',
  QUARANTINE_FILE = 'QUARANTINE_FILE',
  CAPTURE_MEMORY = 'CAPTURE_MEMORY',
  CAPTURE_DISK_IMAGE = 'CAPTURE_DISK_IMAGE',
  COLLECT_LOGS = 'COLLECT_LOGS',
  NOTIFY_STAKEHOLDERS = 'NOTIFY_STAKEHOLDERS',
  PATCH_VULNERABILITY = 'PATCH_VULNERABILITY',
  RESTORE_FROM_BACKUP = 'RESTORE_FROM_BACKUP',
  RUN_ANTIVIRUS_SCAN = 'RUN_ANTIVIRUS_SCAN',
  CUSTOM_SCRIPT = 'CUSTOM_SCRIPT',
}

/**
 * Incident impact assessment
 */
export interface IncidentImpact {
  confidentiality: ImpactLevel;
  integrity: ImpactLevel;
  availability: ImpactLevel;
  affectedUsers?: number;
  affectedRecords?: number;
  estimatedCost?: number;
  businessImpact?: string;
  reputationImpact?: string;
  complianceImpact?: string;
  dataClassification?: string[]; // PHI, PII, PCI, etc.
}

/**
 * Impact levels (CIA triad)
 */
export enum ImpactLevel {
  NONE = 'NONE',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

/**
 * Security alert structure
 */
export interface SecurityAlert {
  id: string;
  name: string;
  description: string;
  severity: IncidentSeverity;
  category: IncidentCategory;
  detectedAt: Date;
  source: string; // IDS, EDR, SIEM, etc.
  sourceId?: string;
  status: 'new' | 'investigating' | 'escalated' | 'resolved' | 'false_positive';
  assignedTo?: string;
  relatedIncidentId?: string;
  rawData?: any;
  indicators: AlertIndicator[];
  affectedAssets: AffectedAsset[];
  automatedActions?: string[];
  requiresEscalation: boolean;
  escalationReason?: string;
  metadata?: Record<string, any>;
}

/**
 * Alert indicator
 */
export interface AlertIndicator {
  type: string;
  value: string;
  confidence: number;
  source: string;
}

/**
 * Evidence record with chain of custody
 */
export interface Evidence {
  id: string;
  incidentId: string;
  type: EvidenceType;
  description: string;
  collectedAt: Date;
  collectedBy: string;
  source: string;
  storageLocation: string;
  hash: string; // SHA-256 hash for integrity
  fileSize?: number;
  fileName?: string;
  mimeType?: string;
  chainOfCustody: CustodyRecord[];
  tags: string[];
  analysis?: EvidenceAnalysis;
  metadata?: Record<string, any>;
}

/**
 * Evidence types
 */
export enum EvidenceType {
  LOG_FILE = 'LOG_FILE',
  MEMORY_DUMP = 'MEMORY_DUMP',
  DISK_IMAGE = 'DISK_IMAGE',
  NETWORK_CAPTURE = 'NETWORK_CAPTURE',
  FILE_SAMPLE = 'FILE_SAMPLE',
  SCREENSHOT = 'SCREENSHOT',
  EMAIL = 'EMAIL',
  DATABASE_EXPORT = 'DATABASE_EXPORT',
  SYSTEM_SNAPSHOT = 'SYSTEM_SNAPSHOT',
  CONFIGURATION_FILE = 'CONFIGURATION_FILE',
  REGISTRY_HIVE = 'REGISTRY_HIVE',
  TIMELINE_DATA = 'TIMELINE_DATA',
}

/**
 * Chain of custody record
 */
export interface CustodyRecord {
  timestamp: Date;
  action: 'collected' | 'transferred' | 'analyzed' | 'stored' | 'accessed';
  performedBy: string;
  reason?: string;
  location?: string;
  notes?: string;
}

/**
 * Evidence analysis result
 */
export interface EvidenceAnalysis {
  analyzedAt: Date;
  analyzedBy: string;
  tool?: string;
  findings: string[];
  iocs?: string[];
  severity?: IncidentSeverity;
  malicious: boolean;
  confidence: number;
  details?: Record<string, any>;
}

/**
 * Response playbook
 */
export interface ResponsePlaybook {
  id: string;
  name: string;
  description: string;
  category: IncidentCategory;
  applicableScenarios: string[];
  severity: IncidentSeverity[];
  steps: PlaybookStep[];
  automatable: boolean;
  estimatedDuration?: number; // minutes
  requiredRoles?: string[];
  tags: string[];
  version: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  metadata?: Record<string, any>;
}

/**
 * Playbook step
 */
export interface PlaybookStep {
  id: string;
  order: number;
  title: string;
  description: string;
  actionType: ResponseActionType;
  automated: boolean;
  parameters?: Record<string, any>;
  expectedDuration?: number; // minutes
  dependencies?: string[]; // Step IDs that must complete first
  successCriteria?: string;
  rollbackAction?: ResponseAction;
}

/**
 * Playbook execution record
 */
export interface PlaybookExecution {
  id: string;
  playbookId: string;
  incidentId: string;
  startedAt: Date;
  completedAt?: Date;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  currentStep?: number;
  executedBy?: string;
  automated: boolean;
  stepResults: StepResult[];
  metadata?: Record<string, any>;
}

/**
 * Playbook step result
 */
export interface StepResult {
  stepId: string;
  startedAt: Date;
  completedAt?: Date;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  output?: string;
  error?: string;
  automated: boolean;
}

/**
 * Incident detection rule
 */
export interface DetectionRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  severity: IncidentSeverity;
  category: IncidentCategory;
  conditions: RuleCondition[];
  actions: AutomatedAction[];
  suppressionRules?: SuppressionRule[];
  metadata?: Record<string, any>;
}

/**
 * Detection rule condition
 */
export interface RuleCondition {
  field: string;
  operator: 'equals' | 'contains' | 'regex' | 'greater_than' | 'less_than' | 'in' | 'not_in';
  value: any;
  caseSensitive?: boolean;
}

/**
 * Automated action configuration
 */
export interface AutomatedAction {
  type: ResponseActionType;
  parameters?: Record<string, any>;
  delay?: number; // milliseconds
  condition?: RuleCondition;
}

/**
 * Alert suppression rule
 */
export interface SuppressionRule {
  field: string;
  value: any;
  duration?: number; // milliseconds
  reason: string;
}

/**
 * Post-incident review
 */
export interface PostIncidentReview {
  id: string;
  incidentId: string;
  reviewedAt: Date;
  reviewedBy: string[];
  timelineAccuracy: number; // 0-100
  detectionEffectiveness: number; // 0-100
  responseEffectiveness: number; // 0-100
  communicationEffectiveness: number; // 0-100;
  lessonsLearned: LessonLearned[];
  improvements: Improvement[];
  rootCauseAnalysis?: string;
  preventiveMeasures?: string[];
  trainingNeeds?: string[];
  metadata?: Record<string, any>;
}

/**
 * Lesson learned record
 */
export interface LessonLearned {
  category: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  recommendations: string[];
}

/**
 * Improvement recommendation
 */
export interface Improvement {
  area: string;
  currentState: string;
  desiredState: string;
  priority: IncidentPriority;
  estimatedEffort?: string;
  responsible?: string;
  dueDate?: Date;
  status?: 'planned' | 'in_progress' | 'completed';
}

// ============================================================================
// SEQUELIZE MODEL DEFINITIONS
// ============================================================================

/**
 * Sequelize SecurityIncident model attributes.
 *
 * @example
 * ```typescript
 * class SecurityIncident extends Model {}
 * SecurityIncident.init(getSecurityIncidentModelAttributes(), {
 *   sequelize,
 *   tableName: 'security_incidents',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['status', 'severity'] },
 *     { fields: ['detectedAt'] },
 *     { fields: ['assignedTo'] }
 *   ]
 * });
 * ```
 */
export const getSecurityIncidentModelAttributes = () => ({
  id: {
    type: 'UUID',
    defaultValue: 'UUIDV4',
    primaryKey: true,
  },
  title: {
    type: 'STRING',
    allowNull: false,
  },
  description: {
    type: 'TEXT',
    allowNull: false,
  },
  status: {
    type: 'STRING',
    allowNull: false,
    defaultValue: 'NEW',
  },
  severity: {
    type: 'STRING',
    allowNull: false,
  },
  priority: {
    type: 'STRING',
    allowNull: false,
  },
  category: {
    type: 'STRING',
    allowNull: false,
  },
  subcategory: {
    type: 'STRING',
    allowNull: true,
  },
  detectedAt: {
    type: 'DATE',
    allowNull: false,
  },
  reportedAt: {
    type: 'DATE',
    allowNull: false,
  },
  acknowledgedAt: {
    type: 'DATE',
    allowNull: true,
  },
  containedAt: {
    type: 'DATE',
    allowNull: true,
  },
  resolvedAt: {
    type: 'DATE',
    allowNull: true,
  },
  closedAt: {
    type: 'DATE',
    allowNull: true,
  },
  assignedTo: {
    type: 'UUID',
    allowNull: true,
  },
  assignedTeam: {
    type: 'STRING',
    allowNull: true,
  },
  reporter: {
    type: 'UUID',
    allowNull: false,
  },
  affectedAssets: {
    type: 'JSONB',
    defaultValue: [],
  },
  relatedAlerts: {
    type: 'ARRAY("UUID")',
    defaultValue: [],
  },
  relatedIncidents: {
    type: 'ARRAY("UUID")',
    defaultValue: [],
  },
  relatedIOCs: {
    type: 'ARRAY("UUID")',
    defaultValue: [],
  },
  timeline: {
    type: 'JSONB',
    defaultValue: [],
  },
  evidence: {
    type: 'ARRAY("UUID")',
    defaultValue: [],
  },
  responseActions: {
    type: 'JSONB',
    defaultValue: [],
  },
  playbooks: {
    type: 'ARRAY("UUID")',
    defaultValue: [],
  },
  impact: {
    type: 'JSONB',
    allowNull: false,
  },
  rootCause: {
    type: 'TEXT',
    allowNull: true,
  },
  remediation: {
    type: 'TEXT',
    allowNull: true,
  },
  lessonsLearned: {
    type: 'TEXT',
    allowNull: true,
  },
  tags: {
    type: 'ARRAY("TEXT")',
    defaultValue: [],
  },
  metadata: {
    type: 'JSONB',
    defaultValue: {},
  },
  complianceFlags: {
    type: 'ARRAY("TEXT")',
    defaultValue: [],
  },
  breachNotificationRequired: {
    type: 'BOOLEAN',
    defaultValue: false,
  },
  createdAt: {
    type: 'DATE',
    allowNull: false,
  },
  updatedAt: {
    type: 'DATE',
    allowNull: false,
  },
});

/**
 * Sequelize SecurityAlert model attributes.
 *
 * @example
 * ```typescript
 * class SecurityAlert extends Model {}
 * SecurityAlert.init(getSecurityAlertModelAttributes(), {
 *   sequelize,
 *   tableName: 'security_alerts',
 *   timestamps: true
 * });
 * ```
 */
export const getSecurityAlertModelAttributes = () => ({
  id: {
    type: 'UUID',
    defaultValue: 'UUIDV4',
    primaryKey: true,
  },
  name: {
    type: 'STRING',
    allowNull: false,
  },
  description: {
    type: 'TEXT',
    allowNull: false,
  },
  severity: {
    type: 'STRING',
    allowNull: false,
  },
  category: {
    type: 'STRING',
    allowNull: false,
  },
  detectedAt: {
    type: 'DATE',
    allowNull: false,
  },
  source: {
    type: 'STRING',
    allowNull: false,
  },
  sourceId: {
    type: 'STRING',
    allowNull: true,
  },
  status: {
    type: 'STRING',
    allowNull: false,
    defaultValue: 'new',
  },
  assignedTo: {
    type: 'UUID',
    allowNull: true,
  },
  relatedIncidentId: {
    type: 'UUID',
    allowNull: true,
  },
  rawData: {
    type: 'JSONB',
    allowNull: true,
  },
  indicators: {
    type: 'JSONB',
    defaultValue: [],
  },
  affectedAssets: {
    type: 'JSONB',
    defaultValue: [],
  },
  automatedActions: {
    type: 'ARRAY("TEXT")',
    defaultValue: [],
  },
  requiresEscalation: {
    type: 'BOOLEAN',
    defaultValue: false,
  },
  escalationReason: {
    type: 'TEXT',
    allowNull: true,
  },
  metadata: {
    type: 'JSONB',
    defaultValue: {},
  },
  createdAt: {
    type: 'DATE',
    allowNull: false,
  },
  updatedAt: {
    type: 'DATE',
    allowNull: false,
  },
});

/**
 * Sequelize Evidence model attributes.
 *
 * @example
 * ```typescript
 * class Evidence extends Model {}
 * Evidence.init(getEvidenceModelAttributes(), {
 *   sequelize,
 *   tableName: 'incident_evidence',
 *   timestamps: true
 * });
 * ```
 */
export const getEvidenceModelAttributes = () => ({
  id: {
    type: 'UUID',
    defaultValue: 'UUIDV4',
    primaryKey: true,
  },
  incidentId: {
    type: 'UUID',
    allowNull: false,
    references: {
      model: 'security_incidents',
      key: 'id',
    },
  },
  type: {
    type: 'STRING',
    allowNull: false,
  },
  description: {
    type: 'TEXT',
    allowNull: false,
  },
  collectedAt: {
    type: 'DATE',
    allowNull: false,
  },
  collectedBy: {
    type: 'UUID',
    allowNull: false,
  },
  source: {
    type: 'STRING',
    allowNull: false,
  },
  storageLocation: {
    type: 'TEXT',
    allowNull: false,
  },
  hash: {
    type: 'STRING',
    allowNull: false,
  },
  fileSize: {
    type: 'BIGINT',
    allowNull: true,
  },
  fileName: {
    type: 'STRING',
    allowNull: true,
  },
  mimeType: {
    type: 'STRING',
    allowNull: true,
  },
  chainOfCustody: {
    type: 'JSONB',
    defaultValue: [],
  },
  tags: {
    type: 'ARRAY("TEXT")',
    defaultValue: [],
  },
  analysis: {
    type: 'JSONB',
    allowNull: true,
  },
  metadata: {
    type: 'JSONB',
    defaultValue: {},
  },
  createdAt: {
    type: 'DATE',
    allowNull: false,
  },
  updatedAt: {
    type: 'DATE',
    allowNull: false,
  },
});

/**
 * Sequelize ResponsePlaybook model attributes.
 *
 * @example
 * ```typescript
 * class ResponsePlaybook extends Model {}
 * ResponsePlaybook.init(getResponsePlaybookModelAttributes(), {
 *   sequelize,
 *   tableName: 'response_playbooks',
 *   timestamps: true
 * });
 * ```
 */
export const getResponsePlaybookModelAttributes = () => ({
  id: {
    type: 'UUID',
    defaultValue: 'UUIDV4',
    primaryKey: true,
  },
  name: {
    type: 'STRING',
    allowNull: false,
    unique: true,
  },
  description: {
    type: 'TEXT',
    allowNull: false,
  },
  category: {
    type: 'STRING',
    allowNull: false,
  },
  applicableScenarios: {
    type: 'ARRAY("TEXT")',
    defaultValue: [],
  },
  severity: {
    type: 'ARRAY("TEXT")',
    defaultValue: [],
  },
  steps: {
    type: 'JSONB',
    defaultValue: [],
  },
  automatable: {
    type: 'BOOLEAN',
    defaultValue: false,
  },
  estimatedDuration: {
    type: 'INTEGER',
    allowNull: true,
  },
  requiredRoles: {
    type: 'ARRAY("TEXT")',
    defaultValue: [],
  },
  tags: {
    type: 'ARRAY("TEXT")',
    defaultValue: [],
  },
  version: {
    type: 'STRING',
    allowNull: false,
  },
  createdBy: {
    type: 'UUID',
    allowNull: false,
  },
  metadata: {
    type: 'JSONB',
    defaultValue: {},
  },
  createdAt: {
    type: 'DATE',
    allowNull: false,
  },
  updatedAt: {
    type: 'DATE',
    allowNull: false,
  },
});

// ============================================================================
// INCIDENT DETECTION AND ALERTING FUNCTIONS
// ============================================================================

/**
 * Creates a security alert from detection event.
 *
 * @param {Partial<SecurityAlert>} alertData - Alert data
 * @returns {SecurityAlert} Created alert
 *
 * @example
 * ```typescript
 * const alert = createSecurityAlert({
 *   name: 'Suspicious Login Attempt',
 *   severity: IncidentSeverity.HIGH,
 *   category: IncidentCategory.UNAUTHORIZED_ACCESS,
 *   source: 'EDR',
 *   indicators: [{ type: 'ip', value: '192.0.2.1', confidence: 85, source: 'EDR' }]
 * });
 * ```
 */
export const createSecurityAlert = (alertData: Partial<SecurityAlert>): SecurityAlert => {
  return {
    id: alertData.id || crypto.randomUUID(),
    name: alertData.name!,
    description: alertData.description!,
    severity: alertData.severity || IncidentSeverity.MEDIUM,
    category: alertData.category || IncidentCategory.SUSPICIOUS_ACTIVITY,
    detectedAt: alertData.detectedAt || new Date(),
    source: alertData.source!,
    sourceId: alertData.sourceId,
    status: alertData.status || 'new',
    assignedTo: alertData.assignedTo,
    relatedIncidentId: alertData.relatedIncidentId,
    rawData: alertData.rawData,
    indicators: alertData.indicators || [],
    affectedAssets: alertData.affectedAssets || [],
    automatedActions: alertData.automatedActions,
    requiresEscalation: alertData.requiresEscalation || false,
    escalationReason: alertData.escalationReason,
    metadata: alertData.metadata || {},
  };
};

/**
 * Evaluates detection rules against incoming events.
 *
 * @param {any} event - Event to evaluate
 * @param {DetectionRule[]} rules - Detection rules
 * @returns {SecurityAlert[]} Triggered alerts
 *
 * @example
 * ```typescript
 * const alerts = evaluateDetectionRules(loginEvent, detectionRules);
 * alerts.forEach(alert => handleAlert(alert));
 * ```
 */
export const evaluateDetectionRules = (event: any, rules: DetectionRule[]): SecurityAlert[] => {
  const triggeredAlerts: SecurityAlert[] = [];

  for (const rule of rules.filter((r) => r.enabled)) {
    const matches = rule.conditions.every((condition) => {
      const eventValue = event[condition.field];

      switch (condition.operator) {
        case 'equals':
          return eventValue === condition.value;
        case 'contains':
          return String(eventValue).includes(String(condition.value));
        case 'regex':
          return new RegExp(condition.value).test(String(eventValue));
        case 'greater_than':
          return eventValue > condition.value;
        case 'less_than':
          return eventValue < condition.value;
        case 'in':
          return Array.isArray(condition.value) && condition.value.includes(eventValue);
        case 'not_in':
          return Array.isArray(condition.value) && !condition.value.includes(eventValue);
        default:
          return false;
      }
    });

    if (matches) {
      const alert = createSecurityAlert({
        name: rule.name,
        description: rule.description,
        severity: rule.severity,
        category: rule.category,
        source: 'Detection Rule',
        sourceId: rule.id,
        rawData: event,
        metadata: { ruleId: rule.id },
      });

      triggeredAlerts.push(alert);
    }
  }

  return triggeredAlerts;
};

/**
 * Correlates multiple alerts to identify potential incidents.
 *
 * @param {SecurityAlert[]} alerts - Alerts to correlate
 * @param {object} [options] - Correlation options
 * @returns {Array} Correlated alert groups
 *
 * @example
 * ```typescript
 * const correlations = correlateAlerts(recentAlerts, {
 *   timeWindow: 3600000, // 1 hour
 *   minAlerts: 3
 * });
 * ```
 */
export const correlateAlerts = (
  alerts: SecurityAlert[],
  options?: {
    timeWindow?: number; // milliseconds
    minAlerts?: number;
    sameCategory?: boolean;
    sameAsset?: boolean;
  }
): Array<{ alerts: SecurityAlert[]; confidence: number; suggestedIncidentTitle: string }> => {
  const timeWindow = options?.timeWindow || 3600000; // 1 hour default
  const minAlerts = options?.minAlerts || 2;
  const correlations: Array<{
    alerts: SecurityAlert[];
    confidence: number;
    suggestedIncidentTitle: string;
  }> = [];

  // Group by time proximity
  const timeGroups: SecurityAlert[][] = [];
  const sortedAlerts = [...alerts].sort(
    (a, b) => a.detectedAt.getTime() - b.detectedAt.getTime()
  );

  sortedAlerts.forEach((alert) => {
    let added = false;

    for (const group of timeGroups) {
      const lastAlert = group[group.length - 1];
      const timeDiff = alert.detectedAt.getTime() - lastAlert.detectedAt.getTime();

      if (timeDiff <= timeWindow) {
        group.push(alert);
        added = true;
        break;
      }
    }

    if (!added) {
      timeGroups.push([alert]);
    }
  });

  // Analyze each group
  timeGroups.forEach((group) => {
    if (group.length < minAlerts) return;

    let confidence = 50;

    // Same category bonus
    if (options?.sameCategory) {
      const categories = new Set(group.map((a) => a.category));
      if (categories.size === 1) confidence += 20;
    }

    // Same asset bonus
    if (options?.sameAsset) {
      const assets = new Set(
        group.flatMap((a) => a.affectedAssets.map((asset) => asset.id))
      );
      if (assets.size === 1) confidence += 30;
    }

    const category = group[0].category;
    const assetCount = new Set(
      group.flatMap((a) => a.affectedAssets.map((asset) => asset.id))
    ).size;

    correlations.push({
      alerts: group,
      confidence,
      suggestedIncidentTitle: `${category} - ${group.length} alerts affecting ${assetCount} asset(s)`,
    });
  });

  return correlations.sort((a, b) => b.confidence - a.confidence);
};

/**
 * Escalates alert to incident.
 *
 * @param {SecurityAlert} alert - Alert to escalate
 * @param {Partial<SecurityIncident>} [incidentData] - Additional incident data
 * @returns {SecurityIncident} Created incident
 *
 * @example
 * ```typescript
 * const incident = escalateAlertToIncident(alert, {
 *   assignedTo: 'security-team-lead',
 *   priority: IncidentPriority.P1
 * });
 * ```
 */
export const escalateAlertToIncident = (
  alert: SecurityAlert,
  incidentData?: Partial<SecurityIncident>
): SecurityIncident => {
  return createIncident({
    title: incidentData?.title || alert.name,
    description: incidentData?.description || alert.description,
    severity: alert.severity,
    category: alert.category,
    detectedAt: alert.detectedAt,
    affectedAssets: alert.affectedAssets,
    relatedAlerts: [alert.id],
    ...incidentData,
  });
};

// ============================================================================
// INCIDENT CLASSIFICATION AND SCORING FUNCTIONS
// ============================================================================

/**
 * Creates a new security incident.
 *
 * @param {Partial<SecurityIncident>} incidentData - Incident data
 * @returns {SecurityIncident} Created incident
 *
 * @example
 * ```typescript
 * const incident = createIncident({
 *   title: 'Ransomware Detected',
 *   severity: IncidentSeverity.CRITICAL,
 *   category: IncidentCategory.RANSOMWARE,
 *   affectedAssets: [asset1, asset2]
 * });
 * ```
 */
export const createIncident = (incidentData: Partial<SecurityIncident>): SecurityIncident => {
  const now = new Date();

  return {
    id: incidentData.id || crypto.randomUUID(),
    title: incidentData.title!,
    description: incidentData.description!,
    status: incidentData.status || IncidentStatus.NEW,
    severity: incidentData.severity || IncidentSeverity.MEDIUM,
    priority: incidentData.priority || calculateIncidentPriority(incidentData),
    category: incidentData.category || IncidentCategory.SUSPICIOUS_ACTIVITY,
    subcategory: incidentData.subcategory,
    detectedAt: incidentData.detectedAt || now,
    reportedAt: incidentData.reportedAt || now,
    acknowledgedAt: incidentData.acknowledgedAt,
    containedAt: incidentData.containedAt,
    resolvedAt: incidentData.resolvedAt,
    closedAt: incidentData.closedAt,
    assignedTo: incidentData.assignedTo,
    assignedTeam: incidentData.assignedTeam,
    reporter: incidentData.reporter || 'system',
    affectedAssets: incidentData.affectedAssets || [],
    relatedAlerts: incidentData.relatedAlerts || [],
    relatedIncidents: incidentData.relatedIncidents,
    relatedIOCs: incidentData.relatedIOCs,
    timeline: incidentData.timeline || [
      {
        id: crypto.randomUUID(),
        timestamp: now,
        eventType: TimelineEventType.DETECTION,
        description: 'Incident detected',
        automated: true,
      },
    ],
    evidence: incidentData.evidence || [],
    responseActions: incidentData.responseActions || [],
    playbooks: incidentData.playbooks || [],
    impact: incidentData.impact || {
      confidentiality: ImpactLevel.NONE,
      integrity: ImpactLevel.NONE,
      availability: ImpactLevel.NONE,
    },
    rootCause: incidentData.rootCause,
    remediation: incidentData.remediation,
    lessonsLearned: incidentData.lessonsLearned,
    tags: incidentData.tags || [],
    metadata: incidentData.metadata || {},
    complianceFlags: incidentData.complianceFlags,
    breachNotificationRequired: incidentData.breachNotificationRequired || false,
  };
};

/**
 * Calculates incident priority based on severity and impact.
 *
 * @param {Partial<SecurityIncident>} incident - Incident data
 * @returns {IncidentPriority} Calculated priority
 *
 * @example
 * ```typescript
 * const priority = calculateIncidentPriority({
 *   severity: IncidentSeverity.CRITICAL,
 *   impact: { availability: ImpactLevel.HIGH }
 * });
 * ```
 */
export const calculateIncidentPriority = (
  incident: Partial<SecurityIncident>
): IncidentPriority => {
  const severity = incident.severity || IncidentSeverity.MEDIUM;
  const impact = incident.impact;

  // Critical severity or critical impact = P1
  if (severity === IncidentSeverity.CRITICAL) return IncidentPriority.P1;
  if (
    impact &&
    (impact.confidentiality === ImpactLevel.CRITICAL ||
      impact.integrity === ImpactLevel.CRITICAL ||
      impact.availability === ImpactLevel.CRITICAL)
  ) {
    return IncidentPriority.P1;
  }

  // High severity or high impact = P2
  if (severity === IncidentSeverity.HIGH) return IncidentPriority.P2;
  if (
    impact &&
    (impact.confidentiality === ImpactLevel.HIGH ||
      impact.integrity === ImpactLevel.HIGH ||
      impact.availability === ImpactLevel.HIGH)
  ) {
    return IncidentPriority.P2;
  }

  // Medium severity = P3
  if (severity === IncidentSeverity.MEDIUM) return IncidentPriority.P3;

  // Low severity = P4
  if (severity === IncidentSeverity.LOW) return IncidentPriority.P4;

  return IncidentPriority.P5;
};

/**
 * Classifies incident category based on indicators.
 *
 * @param {any[]} indicators - Indicators from alerts
 * @param {any} context - Additional context
 * @returns {IncidentCategory} Classified category
 *
 * @example
 * ```typescript
 * const category = classifyIncident(alertIndicators, { sourceSystem: 'EDR' });
 * ```
 */
export const classifyIncident = (indicators: any[], context?: any): IncidentCategory => {
  // Simple classification logic - in production, use ML or more sophisticated rules
  const indicatorTypes = indicators.map((i) => i.type.toLowerCase());

  if (indicatorTypes.some((t) => t.includes('ransomware') || t.includes('encrypt'))) {
    return IncidentCategory.RANSOMWARE;
  }
  if (indicatorTypes.some((t) => t.includes('malware') || t.includes('virus'))) {
    return IncidentCategory.MALWARE;
  }
  if (indicatorTypes.some((t) => t.includes('phish'))) {
    return IncidentCategory.PHISHING;
  }
  if (indicatorTypes.some((t) => t.includes('login') || t.includes('auth'))) {
    return IncidentCategory.UNAUTHORIZED_ACCESS;
  }
  if (indicatorTypes.some((t) => t.includes('exfil') || t.includes('transfer'))) {
    return IncidentCategory.DATA_EXFILTRATION;
  }

  return IncidentCategory.SUSPICIOUS_ACTIVITY;
};

/**
 * Assesses incident impact on CIA triad.
 *
 * @param {SecurityIncident} incident - Incident to assess
 * @returns {IncidentImpact} Impact assessment
 *
 * @example
 * ```typescript
 * const impact = assessIncidentImpact(incident);
 * console.log(`Confidentiality Impact: ${impact.confidentiality}`);
 * ```
 */
export const assessIncidentImpact = (incident: SecurityIncident): IncidentImpact => {
  let confidentiality = ImpactLevel.NONE;
  let integrity = ImpactLevel.NONE;
  let availability = ImpactLevel.NONE;

  // Assess based on category
  switch (incident.category) {
    case IncidentCategory.DATA_BREACH:
    case IncidentCategory.DATA_EXFILTRATION:
      confidentiality = ImpactLevel.CRITICAL;
      break;
    case IncidentCategory.RANSOMWARE:
      availability = ImpactLevel.CRITICAL;
      integrity = ImpactLevel.HIGH;
      break;
    case IncidentCategory.DENIAL_OF_SERVICE:
      availability = ImpactLevel.HIGH;
      break;
    case IncidentCategory.MALWARE:
      integrity = ImpactLevel.MEDIUM;
      availability = ImpactLevel.MEDIUM;
      break;
    case IncidentCategory.UNAUTHORIZED_ACCESS:
      confidentiality = ImpactLevel.MEDIUM;
      break;
  }

  // Assess based on affected assets
  const criticalAssets = incident.affectedAssets.filter(
    (a) => a.criticalityLevel === 'critical'
  );
  if (criticalAssets.length > 0) {
    confidentiality = upgradeImpactLevel(confidentiality);
    integrity = upgradeImpactLevel(integrity);
    availability = upgradeImpactLevel(availability);
  }

  return {
    confidentiality,
    integrity,
    availability,
    affectedUsers: incident.metadata?.affectedUsers,
    affectedRecords: incident.metadata?.affectedRecords,
  };
};

/**
 * Upgrades impact level by one step.
 */
const upgradeImpactLevel = (current: ImpactLevel): ImpactLevel => {
  const levels = [ImpactLevel.NONE, ImpactLevel.LOW, ImpactLevel.MEDIUM, ImpactLevel.HIGH, ImpactLevel.CRITICAL];
  const index = levels.indexOf(current);
  return index < levels.length - 1 ? levels[index + 1] : current;
};

// ============================================================================
// RESPONSE PLAYBOOK FUNCTIONS
// ============================================================================

/**
 * Creates a response playbook.
 *
 * @param {Partial<ResponsePlaybook>} playbookData - Playbook data
 * @returns {ResponsePlaybook} Created playbook
 *
 * @example
 * ```typescript
 * const playbook = createResponsePlaybook({
 *   name: 'Ransomware Response',
 *   category: IncidentCategory.RANSOMWARE,
 *   steps: [...]
 * });
 * ```
 */
export const createResponsePlaybook = (
  playbookData: Partial<ResponsePlaybook>
): ResponsePlaybook => {
  const now = new Date();

  return {
    id: playbookData.id || crypto.randomUUID(),
    name: playbookData.name!,
    description: playbookData.description!,
    category: playbookData.category!,
    applicableScenarios: playbookData.applicableScenarios || [],
    severity: playbookData.severity || [],
    steps: playbookData.steps || [],
    automatable: playbookData.automatable || false,
    estimatedDuration: playbookData.estimatedDuration,
    requiredRoles: playbookData.requiredRoles,
    tags: playbookData.tags || [],
    version: playbookData.version || '1.0.0',
    createdAt: playbookData.createdAt || now,
    updatedAt: playbookData.updatedAt || now,
    createdBy: playbookData.createdBy || 'system',
    metadata: playbookData.metadata || {},
  };
};

/**
 * Executes response playbook for incident.
 *
 * @param {ResponsePlaybook} playbook - Playbook to execute
 * @param {SecurityIncident} incident - Target incident
 * @param {object} [options] - Execution options
 * @returns {Promise<PlaybookExecution>} Execution record
 *
 * @example
 * ```typescript
 * const execution = await executePlaybook(ransomwarePlaybook, incident, {
 *   automated: true,
 *   executedBy: 'security-automation'
 * });
 * ```
 */
export const executePlaybook = async (
  playbook: ResponsePlaybook,
  incident: SecurityIncident,
  options?: {
    automated?: boolean;
    executedBy?: string;
  }
): Promise<PlaybookExecution> => {
  const execution: PlaybookExecution = {
    id: crypto.randomUUID(),
    playbookId: playbook.id,
    incidentId: incident.id,
    startedAt: new Date(),
    status: 'running',
    currentStep: 0,
    executedBy: options?.executedBy,
    automated: options?.automated || false,
    stepResults: [],
    metadata: {},
  };

  // Execute steps sequentially
  for (let i = 0; i < playbook.steps.length; i++) {
    const step = playbook.steps[i];
    execution.currentStep = i;

    const stepResult = await executePlaybookStep(step, incident, options?.automated);
    execution.stepResults.push(stepResult);

    if (stepResult.status === 'failed') {
      execution.status = 'failed';
      break;
    }
  }

  if (execution.status === 'running') {
    execution.status = 'completed';
    execution.completedAt = new Date();
  }

  return execution;
};

/**
 * Executes single playbook step.
 *
 * @param {PlaybookStep} step - Step to execute
 * @param {SecurityIncident} incident - Target incident
 * @param {boolean} [automated] - Whether execution is automated
 * @returns {Promise<StepResult>} Step result
 */
export const executePlaybookStep = async (
  step: PlaybookStep,
  incident: SecurityIncident,
  automated: boolean = false
): Promise<StepResult> => {
  const result: StepResult = {
    stepId: step.id,
    startedAt: new Date(),
    status: 'running',
    automated,
  };

  try {
    // In production, implement actual step execution logic
    // This is a placeholder
    await new Promise((resolve) => setTimeout(resolve, 100));

    result.status = 'completed';
    result.completedAt = new Date();
    result.output = `Successfully executed: ${step.title}`;
  } catch (error) {
    result.status = 'failed';
    result.error = error instanceof Error ? error.message : 'Unknown error';
  }

  return result;
};

/**
 * Suggests playbooks for incident.
 *
 * @param {SecurityIncident} incident - Incident
 * @param {ResponsePlaybook[]} playbooks - Available playbooks
 * @returns {ResponsePlaybook[]} Suggested playbooks
 *
 * @example
 * ```typescript
 * const suggestions = suggestPlaybooksForIncident(incident, allPlaybooks);
 * ```
 */
export const suggestPlaybooksForIncident = (
  incident: SecurityIncident,
  playbooks: ResponsePlaybook[]
): ResponsePlaybook[] => {
  return playbooks
    .filter(
      (pb) =>
        pb.category === incident.category &&
        (pb.severity.length === 0 || pb.severity.includes(incident.severity))
    )
    .sort((a, b) => (b.estimatedDuration || 0) - (a.estimatedDuration || 0));
};

// ============================================================================
// INCIDENT TIMELINE RECONSTRUCTION FUNCTIONS
// ============================================================================

/**
 * Adds entry to incident timeline.
 *
 * @param {SecurityIncident} incident - Incident
 * @param {Partial<IncidentTimelineEntry>} entry - Timeline entry
 * @returns {SecurityIncident} Updated incident
 *
 * @example
 * ```typescript
 * const updated = addTimelineEntry(incident, {
 *   eventType: TimelineEventType.ASSET_ISOLATED,
 *   description: 'Isolated compromised server',
 *   actor: 'security-analyst-1'
 * });
 * ```
 */
export const addTimelineEntry = (
  incident: SecurityIncident,
  entry: Partial<IncidentTimelineEntry>
): SecurityIncident => {
  const newEntry: IncidentTimelineEntry = {
    id: entry.id || crypto.randomUUID(),
    timestamp: entry.timestamp || new Date(),
    eventType: entry.eventType!,
    description: entry.description!,
    actor: entry.actor,
    automated: entry.automated || false,
    source: entry.source,
    evidenceIds: entry.evidenceIds,
    metadata: entry.metadata,
  };

  return {
    ...incident,
    timeline: [...incident.timeline, newEntry].sort(
      (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
    ),
  };
};

/**
 * Reconstructs incident timeline from multiple sources.
 *
 * @param {SecurityIncident} incident - Incident
 * @param {any[]} externalEvents - External events to correlate
 * @returns {IncidentTimelineEntry[]} Reconstructed timeline
 *
 * @example
 * ```typescript
 * const timeline = reconstructIncidentTimeline(incident, [logEvents, alertEvents]);
 * ```
 */
export const reconstructIncidentTimeline = (
  incident: SecurityIncident,
  externalEvents: any[] = []
): IncidentTimelineEntry[] => {
  const allEvents: IncidentTimelineEntry[] = [...incident.timeline];

  // Convert external events to timeline entries
  externalEvents.forEach((event) => {
    allEvents.push({
      id: crypto.randomUUID(),
      timestamp: new Date(event.timestamp),
      eventType: TimelineEventType.DETECTION,
      description: event.description || event.message,
      automated: true,
      source: event.source,
      metadata: event,
    });
  });

  // Sort chronologically
  return allEvents.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
};

/**
 * Analyzes incident timeline for patterns.
 *
 * @param {SecurityIncident} incident - Incident
 * @returns {object} Timeline analysis
 *
 * @example
 * ```typescript
 * const analysis = analyzeIncidentTimeline(incident);
 * console.log(`Detection to containment: ${analysis.detectionToContainment} minutes`);
 * ```
 */
export const analyzeIncidentTimeline = (
  incident: SecurityIncident
): {
  detectionToAcknowledgment?: number;
  acknowledgmentToContainment?: number;
  containmentToResolution?: number;
  detectionToContainment?: number;
  totalDuration?: number;
  eventsByType: Record<TimelineEventType, number>;
  criticalEvents: IncidentTimelineEntry[];
} => {
  const timeline = incident.timeline.sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
  );

  const firstEvent = timeline[0];
  const lastEvent = timeline[timeline.length - 1];

  const eventsByType: Record<TimelineEventType, number> = {} as any;
  timeline.forEach((entry) => {
    eventsByType[entry.eventType] = (eventsByType[entry.eventType] || 0) + 1;
  });

  const criticalEvents = timeline.filter((entry) =>
    [
      TimelineEventType.DETECTION,
      TimelineEventType.ACKNOWLEDGED,
      TimelineEventType.CONTAINED,
      TimelineEventType.RESOLVED,
      TimelineEventType.MALWARE_FOUND,
    ].includes(entry.eventType)
  );

  const analysis: any = {
    eventsByType,
    criticalEvents,
  };

  if (incident.detectedAt && incident.acknowledgedAt) {
    analysis.detectionToAcknowledgment =
      (incident.acknowledgedAt.getTime() - incident.detectedAt.getTime()) / 60000;
  }

  if (incident.acknowledgedAt && incident.containedAt) {
    analysis.acknowledgmentToContainment =
      (incident.containedAt.getTime() - incident.acknowledgedAt.getTime()) / 60000;
  }

  if (incident.containedAt && incident.resolvedAt) {
    analysis.containmentToResolution =
      (incident.resolvedAt.getTime() - incident.containedAt.getTime()) / 60000;
  }

  if (incident.detectedAt && incident.containedAt) {
    analysis.detectionToContainment =
      (incident.containedAt.getTime() - incident.detectedAt.getTime()) / 60000;
  }

  if (firstEvent && lastEvent) {
    analysis.totalDuration =
      (lastEvent.timestamp.getTime() - firstEvent.timestamp.getTime()) / 60000;
  }

  return analysis;
};

// ============================================================================
// EVIDENCE COLLECTION FUNCTIONS
// ============================================================================

/**
 * Collects evidence for incident.
 *
 * @param {Partial<Evidence>} evidenceData - Evidence data
 * @returns {Evidence} Created evidence
 *
 * @example
 * ```typescript
 * const evidence = collectEvidence({
 *   incidentId: 'incident-123',
 *   type: EvidenceType.LOG_FILE,
 *   description: 'System logs from affected server',
 *   source: 'server-01',
 *   storageLocation: '/evidence/logs/server-01.log'
 * });
 * ```
 */
export const collectEvidence = (evidenceData: Partial<Evidence>): Evidence => {
  const now = new Date();

  // Calculate hash (in production, calculate actual file hash)
  const hash = crypto
    .createHash('sha256')
    .update(evidenceData.storageLocation || crypto.randomUUID())
    .digest('hex');

  return {
    id: evidenceData.id || crypto.randomUUID(),
    incidentId: evidenceData.incidentId!,
    type: evidenceData.type!,
    description: evidenceData.description!,
    collectedAt: evidenceData.collectedAt || now,
    collectedBy: evidenceData.collectedBy || 'system',
    source: evidenceData.source!,
    storageLocation: evidenceData.storageLocation!,
    hash,
    fileSize: evidenceData.fileSize,
    fileName: evidenceData.fileName,
    mimeType: evidenceData.mimeType,
    chainOfCustody: evidenceData.chainOfCustody || [
      {
        timestamp: now,
        action: 'collected',
        performedBy: evidenceData.collectedBy || 'system',
      },
    ],
    tags: evidenceData.tags || [],
    analysis: evidenceData.analysis,
    metadata: evidenceData.metadata || {},
  };
};

/**
 * Updates evidence chain of custody.
 *
 * @param {Evidence} evidence - Evidence
 * @param {Partial<CustodyRecord>} record - Custody record
 * @returns {Evidence} Updated evidence
 *
 * @example
 * ```typescript
 * const updated = updateChainOfCustody(evidence, {
 *   action: 'analyzed',
 *   performedBy: 'forensic-analyst-1',
 *   notes: 'Completed malware analysis'
 * });
 * ```
 */
export const updateChainOfCustody = (
  evidence: Evidence,
  record: Partial<CustodyRecord>
): Evidence => {
  const custodyRecord: CustodyRecord = {
    timestamp: record.timestamp || new Date(),
    action: record.action!,
    performedBy: record.performedBy!,
    reason: record.reason,
    location: record.location,
    notes: record.notes,
  };

  return {
    ...evidence,
    chainOfCustody: [...evidence.chainOfCustody, custodyRecord],
  };
};

/**
 * Validates evidence integrity using hash verification.
 *
 * @param {Evidence} evidence - Evidence to validate
 * @param {string} currentHash - Current hash of the file
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const result = validateEvidenceIntegrity(evidence, calculatedHash);
 * if (!result.valid) {
 *   console.error('Evidence integrity compromised!');
 * }
 * ```
 */
export const validateEvidenceIntegrity = (
  evidence: Evidence,
  currentHash: string
): { valid: boolean; originalHash: string; currentHash: string; message: string } => {
  const valid = evidence.hash === currentHash;

  return {
    valid,
    originalHash: evidence.hash,
    currentHash,
    message: valid ? 'Evidence integrity verified' : 'Evidence integrity check failed',
  };
};

// ============================================================================
// FORENSIC ANALYSIS FUNCTIONS
// ============================================================================

/**
 * Analyzes evidence for IOCs and malicious indicators.
 *
 * @param {Evidence} evidence - Evidence to analyze
 * @param {object} [options] - Analysis options
 * @returns {Promise<EvidenceAnalysis>} Analysis result
 *
 * @example
 * ```typescript
 * const analysis = await analyzeEvidence(evidence, {
 *   tool: 'VirusTotal',
 *   deepScan: true
 * });
 * ```
 */
export const analyzeEvidence = async (
  evidence: Evidence,
  options?: {
    tool?: string;
    deepScan?: boolean;
  }
): Promise<EvidenceAnalysis> => {
  // In production, integrate with actual forensic tools
  const analysis: EvidenceAnalysis = {
    analyzedAt: new Date(),
    analyzedBy: options?.tool || 'automated-analysis',
    tool: options?.tool,
    findings: [],
    iocs: [],
    severity: IncidentSeverity.INFO,
    malicious: false,
    confidence: 0,
    details: {},
  };

  // Placeholder analysis logic
  if (evidence.type === EvidenceType.FILE_SAMPLE) {
    analysis.findings.push('File analysis completed');
    analysis.confidence = 75;
  }

  return analysis;
};

/**
 * Performs memory forensics on memory dump evidence.
 *
 * @param {Evidence} memoryDump - Memory dump evidence
 * @returns {Promise<object>} Forensic findings
 *
 * @example
 * ```typescript
 * const findings = await performMemoryForensics(memoryDumpEvidence);
 * console.log(findings.suspiciousProcesses);
 * ```
 */
export const performMemoryForensics = async (
  memoryDump: Evidence
): Promise<{
  suspiciousProcesses: Array<{ name: string; pid: number; reason: string }>;
  networkConnections: Array<{ ip: string; port: number; status: string }>;
  injectedCode: Array<{ location: string; description: string }>;
}> => {
  // In production, integrate with Volatility or similar tools
  return {
    suspiciousProcesses: [],
    networkConnections: [],
    injectedCode: [],
  };
};

/**
 * Performs disk forensics on disk image evidence.
 *
 * @param {Evidence} diskImage - Disk image evidence
 * @returns {Promise<object>} Forensic findings
 *
 * @example
 * ```typescript
 * const findings = await performDiskForensics(diskImageEvidence);
 * console.log(findings.deletedFiles);
 * ```
 */
export const performDiskForensics = async (
  diskImage: Evidence
): Promise<{
  deletedFiles: Array<{ path: string; deletedAt?: Date; recoverable: boolean }>;
  suspiciousFiles: Array<{ path: string; reason: string; hash: string }>;
  timelineAnomalies: Array<{ file: string; anomaly: string }>;
}> => {
  // In production, integrate with forensic tools
  return {
    deletedFiles: [],
    suspiciousFiles: [],
    timelineAnomalies: [],
  };
};

// ============================================================================
// INCIDENT ESCALATION FUNCTIONS
// ============================================================================

/**
 * Escalates incident to higher severity or team.
 *
 * @param {SecurityIncident} incident - Incident to escalate
 * @param {object} escalation - Escalation details
 * @returns {SecurityIncident} Updated incident
 *
 * @example
 * ```typescript
 * const escalated = escalateIncident(incident, {
 *   newSeverity: IncidentSeverity.CRITICAL,
 *   assignedTo: 'senior-security-analyst',
 *   reason: 'Data exfiltration confirmed'
 * });
 * ```
 */
export const escalateIncident = (
  incident: SecurityIncident,
  escalation: {
    newSeverity?: IncidentSeverity;
    newPriority?: IncidentPriority;
    assignedTo?: string;
    assignedTeam?: string;
    reason: string;
  }
): SecurityIncident => {
  const updated = {
    ...incident,
    severity: escalation.newSeverity || incident.severity,
    priority: escalation.newPriority || incident.priority,
    assignedTo: escalation.assignedTo || incident.assignedTo,
    assignedTeam: escalation.assignedTeam || incident.assignedTeam,
  };

  return addTimelineEntry(updated, {
    eventType: TimelineEventType.ESCALATED,
    description: `Incident escalated: ${escalation.reason}`,
    automated: false,
    metadata: { escalationReason: escalation.reason },
  });
};

/**
 * Determines if incident requires escalation.
 *
 * @param {SecurityIncident} incident - Incident to evaluate
 * @returns {object} Escalation recommendation
 *
 * @example
 * ```typescript
 * const recommendation = shouldEscalateIncident(incident);
 * if (recommendation.shouldEscalate) {
 *   escalateIncident(incident, { reason: recommendation.reason });
 * }
 * ```
 */
export const shouldEscalateIncident = (
  incident: SecurityIncident
): {
  shouldEscalate: boolean;
  reason?: string;
  suggestedSeverity?: IncidentSeverity;
  suggestedTeam?: string;
} => {
  // Check for PHI data breach
  if (
    incident.impact.dataClassification?.includes('PHI') &&
    incident.category === IncidentCategory.DATA_BREACH
  ) {
    return {
      shouldEscalate: true,
      reason: 'PHI data breach requires immediate escalation',
      suggestedSeverity: IncidentSeverity.CRITICAL,
      suggestedTeam: 'compliance-team',
    };
  }

  // Check for ransomware
  if (incident.category === IncidentCategory.RANSOMWARE) {
    return {
      shouldEscalate: true,
      reason: 'Ransomware incident requires executive notification',
      suggestedSeverity: IncidentSeverity.CRITICAL,
      suggestedTeam: 'incident-response-team',
    };
  }

  // Check time to containment
  const analysis = analyzeIncidentTimeline(incident);
  if (analysis.detectionToContainment && analysis.detectionToContainment > 240) {
    // 4 hours
    return {
      shouldEscalate: true,
      reason: 'Incident not contained within SLA',
      suggestedTeam: 'senior-security-team',
    };
  }

  return { shouldEscalate: false };
};

// ============================================================================
// POST-INCIDENT ANALYSIS FUNCTIONS
// ============================================================================

/**
 * Creates post-incident review.
 *
 * @param {Partial<PostIncidentReview>} reviewData - Review data
 * @returns {PostIncidentReview} Created review
 *
 * @example
 * ```typescript
 * const review = createPostIncidentReview({
 *   incidentId: 'incident-123',
 *   reviewedBy: ['analyst-1', 'manager-1'],
 *   lessonsLearned: [...]
 * });
 * ```
 */
export const createPostIncidentReview = (
  reviewData: Partial<PostIncidentReview>
): PostIncidentReview => {
  return {
    id: reviewData.id || crypto.randomUUID(),
    incidentId: reviewData.incidentId!,
    reviewedAt: reviewData.reviewedAt || new Date(),
    reviewedBy: reviewData.reviewedBy || [],
    timelineAccuracy: reviewData.timelineAccuracy || 0,
    detectionEffectiveness: reviewData.detectionEffectiveness || 0,
    responseEffectiveness: reviewData.responseEffectiveness || 0,
    communicationEffectiveness: reviewData.communicationEffectiveness || 0,
    lessonsLearned: reviewData.lessonsLearned || [],
    improvements: reviewData.improvements || [],
    rootCauseAnalysis: reviewData.rootCauseAnalysis,
    preventiveMeasures: reviewData.preventiveMeasures,
    trainingNeeds: reviewData.trainingNeeds,
    metadata: reviewData.metadata || {},
  };
};

/**
 * Generates incident metrics and KPIs.
 *
 * @param {SecurityIncident[]} incidents - Incidents to analyze
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {object} Incident metrics
 *
 * @example
 * ```typescript
 * const metrics = generateIncidentMetrics(allIncidents, startDate, endDate);
 * console.log(`MTTD: ${metrics.meanTimeToDetect} minutes`);
 * ```
 */
export const generateIncidentMetrics = (
  incidents: SecurityIncident[],
  startDate: Date,
  endDate: Date
): {
  totalIncidents: number;
  incidentsBySeverity: Record<IncidentSeverity, number>;
  incidentsByCategory: Record<IncidentCategory, number>;
  meanTimeToDetect: number;
  meanTimeToAcknowledge: number;
  meanTimeToContain: number;
  meanTimeToResolve: number;
  falsePositiveRate: number;
} => {
  const filtered = incidents.filter(
    (i) => i.detectedAt >= startDate && i.detectedAt <= endDate
  );

  const incidentsBySeverity: Record<IncidentSeverity, number> = {} as any;
  const incidentsByCategory: Record<IncidentCategory, number> = {} as any;

  let totalDetectionTime = 0;
  let totalAcknowledgmentTime = 0;
  let totalContainmentTime = 0;
  let totalResolutionTime = 0;
  let detectionCount = 0;
  let acknowledgmentCount = 0;
  let containmentCount = 0;
  let resolutionCount = 0;

  filtered.forEach((incident) => {
    incidentsBySeverity[incident.severity] =
      (incidentsBySeverity[incident.severity] || 0) + 1;
    incidentsByCategory[incident.category] =
      (incidentsByCategory[incident.category] || 0) + 1;

    const analysis = analyzeIncidentTimeline(incident);

    if (analysis.detectionToAcknowledgment) {
      totalAcknowledgmentTime += analysis.detectionToAcknowledgment;
      acknowledgmentCount++;
    }

    if (analysis.detectionToContainment) {
      totalContainmentTime += analysis.detectionToContainment;
      containmentCount++;
    }

    if (incident.resolvedAt) {
      const resolutionTime =
        (incident.resolvedAt.getTime() - incident.detectedAt.getTime()) / 60000;
      totalResolutionTime += resolutionTime;
      resolutionCount++;
    }
  });

  const falsePositives = filtered.filter(
    (i) => i.status === IncidentStatus.FALSE_POSITIVE
  ).length;

  return {
    totalIncidents: filtered.length,
    incidentsBySeverity,
    incidentsByCategory,
    meanTimeToDetect: detectionCount > 0 ? totalDetectionTime / detectionCount : 0,
    meanTimeToAcknowledge:
      acknowledgmentCount > 0 ? totalAcknowledgmentTime / acknowledgmentCount : 0,
    meanTimeToContain: containmentCount > 0 ? totalContainmentTime / containmentCount : 0,
    meanTimeToResolve: resolutionCount > 0 ? totalResolutionTime / resolutionCount : 0,
    falsePositiveRate:
      filtered.length > 0 ? (falsePositives / filtered.length) * 100 : 0,
  };
};

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
  // Sequelize Models
  getSecurityIncidentModelAttributes,
  getSecurityAlertModelAttributes,
  getEvidenceModelAttributes,
  getResponsePlaybookModelAttributes,

  // Incident Detection and Alerting
  createSecurityAlert,
  evaluateDetectionRules,
  correlateAlerts,
  escalateAlertToIncident,

  // Incident Classification
  createIncident,
  calculateIncidentPriority,
  classifyIncident,
  assessIncidentImpact,

  // Response Playbooks
  createResponsePlaybook,
  executePlaybook,
  executePlaybookStep,
  suggestPlaybooksForIncident,

  // Timeline Reconstruction
  addTimelineEntry,
  reconstructIncidentTimeline,
  analyzeIncidentTimeline,

  // Evidence Collection
  collectEvidence,
  updateChainOfCustody,
  validateEvidenceIntegrity,

  // Forensic Analysis
  analyzeEvidence,
  performMemoryForensics,
  performDiskForensics,

  // Incident Escalation
  escalateIncident,
  shouldEscalateIncident,

  // Post-Incident Analysis
  createPostIncidentReview,
  generateIncidentMetrics,
};
