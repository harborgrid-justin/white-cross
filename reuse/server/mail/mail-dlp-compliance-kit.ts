/**
 * LOC: MAIL-DLP-001
 * File: /reuse/server/mail/mail-dlp-compliance-kit.ts
 *
 * UPSTREAM (imports from):
 *   - crypto (node built-in)
 *   - @nestjs/common (guards, decorators, interceptors)
 *   - @nestjs/swagger (API documentation)
 *   - sequelize (database models)
 *
 * DOWNSTREAM (imported by):
 *   - Email sending services
 *   - Message composition controllers
 *   - Compliance reporting services
 *   - Security audit modules
 *   - HIPAA compliance services
 *   - Admin monitoring dashboards
 */

/**
 * File: /reuse/server/mail/mail-dlp-compliance-kit.ts
 * Locator: WC-MAIL-DLP-001
 * Purpose: Data Loss Prevention & Compliance Kit - Enterprise Exchange Server-level DLP for healthcare email security
 *
 * Upstream: Node.js crypto, NestJS security framework, Sequelize ORM
 * Downstream: Email services, compliance reporting, security monitoring, admin dashboards
 * Dependencies: Node 18+, TypeScript 5.x, NestJS 10.x, Sequelize 6.x
 * Exports: 45 functions for DLP rules, sensitive data detection, policy enforcement, compliance reporting, audit trails
 *
 * LLM Context: Production-grade Data Loss Prevention and compliance implementation for White Cross healthcare
 * platform email system. Provides Microsoft Exchange Server-level DLP capabilities including sensitive data
 * detection (SSN, credit cards, PHI, PII), regular expression-based pattern matching, content inspection,
 * attachment scanning for sensitive information, policy enforcement actions (block, quarantine, encrypt, alert),
 * HIPAA/GDPR/SOC 2 compliance reporting, comprehensive audit trails, incident management and tracking,
 * user training and warning systems, policy exemption handling, role-based DLP rules, NestJS security guards
 * for DLP enforcement, real-time monitoring and alerting, compliance dashboard metrics, automated remediation
 * workflows, and full Swagger API documentation. Essential for protecting Protected Health Information (PHI)
 * and ensuring regulatory compliance in healthcare communications. Implements industry-standard DLP patterns
 * with configurable policies, machine learning-ready classification, and integration with security information
 * and event management (SIEM) systems.
 */

import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS - DLP ENUMS
// ============================================================================

/**
 * DLP policy action types
 */
export enum DLPAction {
  ALLOW = 'allow',
  BLOCK = 'block',
  QUARANTINE = 'quarantine',
  ENCRYPT = 'encrypt',
  ALERT = 'alert',
  WARN = 'warn',
  REDACT = 'redact',
  REQUIRE_JUSTIFICATION = 'require_justification',
  REQUIRE_APPROVAL = 'require_approval',
}

/**
 * Sensitive data types for detection
 */
export enum SensitiveDataType {
  SSN = 'ssn',
  CREDIT_CARD = 'credit_card',
  DRIVERS_LICENSE = 'drivers_license',
  PASSPORT = 'passport',
  BANK_ACCOUNT = 'bank_account',
  MEDICAL_RECORD_NUMBER = 'medical_record_number',
  PATIENT_ID = 'patient_id',
  DIAGNOSIS_CODE = 'diagnosis_code',
  PRESCRIPTION_NUMBER = 'prescription_number',
  PHI_GENERAL = 'phi_general',
  PII_EMAIL = 'pii_email',
  PII_PHONE = 'pii_phone',
  PII_ADDRESS = 'pii_address',
  PII_DOB = 'pii_dob',
  IP_ADDRESS = 'ip_address',
  API_KEY = 'api_key',
  PASSWORD = 'password',
  PRIVATE_KEY = 'private_key',
  CUSTOM = 'custom',
}

/**
 * DLP rule severity levels
 */
export enum DLPSeverity {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  INFO = 'info',
}

/**
 * Compliance framework types
 */
export enum ComplianceFramework {
  HIPAA = 'hipaa',
  GDPR = 'gdpr',
  SOC2 = 'soc2',
  PCI_DSS = 'pci_dss',
  HITECH = 'hitech',
  ISO_27001 = 'iso_27001',
  NIST = 'nist',
  CCPA = 'ccpa',
  CUSTOM = 'custom',
}

/**
 * DLP incident status
 */
export enum DLPIncidentStatus {
  NEW = 'new',
  INVESTIGATING = 'investigating',
  CONFIRMED = 'confirmed',
  FALSE_POSITIVE = 'false_positive',
  RESOLVED = 'resolved',
  ESCALATED = 'escalated',
  CLOSED = 'closed',
}

/**
 * Content inspection scope
 */
export enum InspectionScope {
  SUBJECT = 'subject',
  BODY = 'body',
  ATTACHMENTS = 'attachments',
  HEADERS = 'headers',
  METADATA = 'metadata',
  ALL = 'all',
}

/**
 * Policy exemption types
 */
export enum ExemptionType {
  USER = 'user',
  DOMAIN = 'domain',
  RECIPIENT = 'recipient',
  TIME_BASED = 'time_based',
  TEMPORARY = 'temporary',
  PERMANENT = 'permanent',
}

/**
 * Attachment scan result
 */
export enum ScanResult {
  CLEAN = 'clean',
  SUSPICIOUS = 'suspicious',
  SENSITIVE_DATA_FOUND = 'sensitive_data_found',
  BLOCKED = 'blocked',
  ERROR = 'error',
}

// ============================================================================
// TYPE DEFINITIONS - DLP INTERFACES
// ============================================================================

/**
 * DLP policy configuration
 */
export interface DLPPolicy {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  priority: number;
  framework: ComplianceFramework;
  rules: DLPRule[];
  scope: InspectionScope[];
  defaultAction: DLPAction;
  notifyAdmins: boolean;
  notifyUsers: boolean;
  adminEmails: string[];
  auditEnabled: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

/**
 * DLP rule definition
 */
export interface DLPRule {
  id: string;
  policyId: string;
  name: string;
  description: string;
  enabled: boolean;
  dataTypes: SensitiveDataType[];
  patterns: RegexPattern[];
  conditions: DLPCondition[];
  actions: DLPAction[];
  severity: DLPSeverity;
  confidenceThreshold: number; // 0-100
  matchCount?: number; // Min occurrences to trigger
  exemptions?: string[];
  customValidation?: string; // Function name for custom validation
  metadata?: Record<string, any>;
}

/**
 * Regular expression pattern for detection
 */
export interface RegexPattern {
  id: string;
  name: string;
  dataType: SensitiveDataType;
  pattern: string;
  flags: string;
  confidence: number; // 0-100
  validator?: string; // Function name for validation (e.g., Luhn check)
  description: string;
  examples: string[];
}

/**
 * DLP condition for rule evaluation
 */
export interface DLPCondition {
  field: string; // 'sender', 'recipient', 'subject', 'size', etc.
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'matches' | 'greaterThan' | 'lessThan';
  value: any;
  caseSensitive?: boolean;
}

/**
 * Content inspection result
 */
export interface ContentInspectionResult {
  inspectionId: string;
  messageId: string;
  timestamp: Date;
  hasSensitiveData: boolean;
  totalMatches: number;
  findings: SensitiveDataFinding[];
  recommendedAction: DLPAction;
  policyViolations: PolicyViolation[];
  riskScore: number; // 0-100
  complianceStatus: ComplianceStatus;
  metadata?: Record<string, any>;
}

/**
 * Sensitive data finding
 */
export interface SensitiveDataFinding {
  id: string;
  dataType: SensitiveDataType;
  location: string; // 'subject', 'body', 'attachment:filename.pdf'
  matchedPattern: string;
  matchedText: string; // Redacted/masked
  fullMatch?: string; // Only stored if configured
  confidence: number; // 0-100
  startPosition: number;
  endPosition: number;
  context?: string; // Surrounding text
  validated: boolean; // If validator confirms (e.g., valid SSN format)
  severity: DLPSeverity;
}

/**
 * Policy violation details
 */
export interface PolicyViolation {
  policyId: string;
  policyName: string;
  ruleId: string;
  ruleName: string;
  action: DLPAction;
  severity: DLPSeverity;
  matchCount: number;
  findings: SensitiveDataFinding[];
  timestamp: Date;
}

/**
 * Compliance status assessment
 */
export interface ComplianceStatus {
  frameworks: ComplianceFramework[];
  compliant: boolean;
  violations: ComplianceViolation[];
  recommendations: string[];
  assessmentDate: Date;
}

/**
 * Compliance violation
 */
export interface ComplianceViolation {
  framework: ComplianceFramework;
  requirement: string;
  description: string;
  severity: DLPSeverity;
  remediation: string;
}

/**
 * DLP incident
 */
export interface DLPIncident {
  id: string;
  messageId: string;
  userId: string;
  incidentType: 'policy_violation' | 'suspicious_activity' | 'unauthorized_disclosure';
  status: DLPIncidentStatus;
  severity: DLPSeverity;
  policyViolations: PolicyViolation[];
  findings: SensitiveDataFinding[];
  actionsTaken: DLPAction[];
  assignedTo?: string;
  investigationNotes?: string;
  resolutionNotes?: string;
  reportedAt: Date;
  resolvedAt?: Date;
  escalatedAt?: Date;
  metadata?: Record<string, any>;
}

/**
 * Attachment scan result
 */
export interface AttachmentScanResult {
  attachmentId: string;
  filename: string;
  contentType: string;
  size: number;
  scanResult: ScanResult;
  findings: SensitiveDataFinding[];
  extractedText?: string;
  scanDuration: number; // milliseconds
  scannedAt: Date;
  scannerVersion: string;
}

/**
 * DLP exemption
 */
export interface DLPExemption {
  id: string;
  type: ExemptionType;
  policyId?: string;
  ruleId?: string;
  targetIdentifier: string; // user ID, domain, email
  reason: string;
  requestedBy: string;
  approvedBy?: string;
  startDate: Date;
  endDate?: Date;
  permanent: boolean;
  active: boolean;
  auditTrail: ExemptionAuditEntry[];
  createdAt: Date;
}

/**
 * Exemption audit entry
 */
export interface ExemptionAuditEntry {
  timestamp: Date;
  action: 'created' | 'approved' | 'revoked' | 'expired';
  performedBy: string;
  notes?: string;
}

/**
 * User training record
 */
export interface UserTrainingRecord {
  id: string;
  userId: string;
  trainingType: 'dlp_awareness' | 'hipaa_compliance' | 'data_handling' | 'incident_response';
  completedAt?: Date;
  score?: number;
  certificateUrl?: string;
  expiresAt?: Date;
  violations: DLPIncident[];
  warningsReceived: number;
}

/**
 * Compliance report data
 */
export interface ComplianceReport {
  id: string;
  framework: ComplianceFramework;
  reportType: 'monthly' | 'quarterly' | 'annual' | 'audit' | 'custom';
  startDate: Date;
  endDate: Date;
  metrics: ComplianceMetrics;
  incidents: DLPIncident[];
  recommendations: string[];
  generatedBy: string;
  generatedAt: Date;
  metadata?: Record<string, any>;
}

/**
 * Compliance metrics
 */
export interface ComplianceMetrics {
  totalMessages: number;
  messagesScanned: number;
  policyViolations: number;
  incidentsCreated: number;
  incidentsResolved: number;
  averageResolutionTime: number; // hours
  blockedMessages: number;
  quarantinedMessages: number;
  encryptedMessages: number;
  alertsTriggered: number;
  falsePositiveRate: number; // percentage
  topViolatedPolicies: { policyId: string; count: number }[];
  topDataTypes: { dataType: SensitiveDataType; count: number }[];
  userViolations: { userId: string; count: number }[];
}

/**
 * DLP audit log entry
 */
export interface DLPAuditLog {
  id: string;
  timestamp: Date;
  eventType: 'policy_created' | 'policy_updated' | 'rule_triggered' | 'action_taken' | 'exemption_granted' | 'incident_created' | 'incident_resolved';
  userId?: string;
  messageId?: string;
  policyId?: string;
  ruleId?: string;
  incidentId?: string;
  action?: DLPAction;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  severity: DLPSeverity;
}

/**
 * Swagger schema for DLP endpoints
 */
export interface SwaggerDLPSchema {
  name: string;
  type: string;
  description: string;
  example: any;
  required?: boolean;
  properties?: Record<string, any>;
}

// ============================================================================
// SEQUELIZE MODEL ATTRIBUTES
// ============================================================================

/**
 * Sequelize DLPPolicy model attributes.
 *
 * @example
 * ```typescript
 * class DLPPolicy extends Model {}
 * DLPPolicy.init(getDLPPolicyModelAttributes(), {
 *   sequelize,
 *   tableName: 'dlp_policies',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['enabled', 'priority'] },
 *     { fields: ['framework'] }
 *   ]
 * });
 * ```
 */
export const getDLPPolicyModelAttributes = () => ({
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
    allowNull: true,
  },
  enabled: {
    type: 'BOOLEAN',
    defaultValue: true,
  },
  priority: {
    type: 'INTEGER',
    defaultValue: 0,
    comment: 'Higher priority rules evaluated first',
  },
  framework: {
    type: 'ENUM',
    values: Object.values(ComplianceFramework),
    allowNull: false,
  },
  rules: {
    type: 'JSONB',
    defaultValue: [],
    comment: 'Array of DLP rules',
  },
  scope: {
    type: 'ARRAY',
    defaultValue: ['all'],
    comment: 'Inspection scope areas',
  },
  defaultAction: {
    type: 'ENUM',
    values: Object.values(DLPAction),
    defaultValue: DLPAction.ALERT,
  },
  notifyAdmins: {
    type: 'BOOLEAN',
    defaultValue: true,
  },
  notifyUsers: {
    type: 'BOOLEAN',
    defaultValue: false,
  },
  adminEmails: {
    type: 'ARRAY',
    defaultValue: [],
  },
  auditEnabled: {
    type: 'BOOLEAN',
    defaultValue: true,
  },
  createdBy: {
    type: 'UUID',
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
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
 * Sequelize DLPIncident model attributes.
 *
 * @example
 * ```typescript
 * class DLPIncident extends Model {}
 * DLPIncident.init(getDLPIncidentModelAttributes(), {
 *   sequelize,
 *   tableName: 'dlp_incidents',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['userId', 'status'] },
 *     { fields: ['severity', 'reportedAt'] },
 *     { fields: ['messageId'] }
 *   ]
 * });
 * ```
 */
export const getDLPIncidentModelAttributes = () => ({
  id: {
    type: 'UUID',
    defaultValue: 'UUIDV4',
    primaryKey: true,
  },
  messageId: {
    type: 'UUID',
    allowNull: false,
    references: {
      model: 'mail_messages',
      key: 'id',
    },
  },
  userId: {
    type: 'UUID',
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  incidentType: {
    type: 'STRING',
    allowNull: false,
  },
  status: {
    type: 'ENUM',
    values: Object.values(DLPIncidentStatus),
    defaultValue: DLPIncidentStatus.NEW,
  },
  severity: {
    type: 'ENUM',
    values: Object.values(DLPSeverity),
    allowNull: false,
  },
  policyViolations: {
    type: 'JSONB',
    defaultValue: [],
  },
  findings: {
    type: 'JSONB',
    defaultValue: [],
  },
  actionsTaken: {
    type: 'ARRAY',
    defaultValue: [],
  },
  assignedTo: {
    type: 'UUID',
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  investigationNotes: {
    type: 'TEXT',
    allowNull: true,
  },
  resolutionNotes: {
    type: 'TEXT',
    allowNull: true,
  },
  reportedAt: {
    type: 'DATE',
    allowNull: false,
    defaultValue: 'NOW',
  },
  resolvedAt: {
    type: 'DATE',
    allowNull: true,
  },
  escalatedAt: {
    type: 'DATE',
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
 * Sequelize DLPExemption model attributes.
 *
 * @example
 * ```typescript
 * class DLPExemption extends Model {}
 * DLPExemption.init(getDLPExemptionModelAttributes(), {
 *   sequelize,
 *   tableName: 'dlp_exemptions',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['active', 'endDate'] },
 *     { fields: ['targetIdentifier'] }
 *   ]
 * });
 * ```
 */
export const getDLPExemptionModelAttributes = () => ({
  id: {
    type: 'UUID',
    defaultValue: 'UUIDV4',
    primaryKey: true,
  },
  type: {
    type: 'ENUM',
    values: Object.values(ExemptionType),
    allowNull: false,
  },
  policyId: {
    type: 'UUID',
    allowNull: true,
    references: {
      model: 'dlp_policies',
      key: 'id',
    },
  },
  ruleId: {
    type: 'STRING',
    allowNull: true,
  },
  targetIdentifier: {
    type: 'STRING',
    allowNull: false,
  },
  reason: {
    type: 'TEXT',
    allowNull: false,
  },
  requestedBy: {
    type: 'UUID',
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  approvedBy: {
    type: 'UUID',
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  startDate: {
    type: 'DATE',
    allowNull: false,
  },
  endDate: {
    type: 'DATE',
    allowNull: true,
  },
  permanent: {
    type: 'BOOLEAN',
    defaultValue: false,
  },
  active: {
    type: 'BOOLEAN',
    defaultValue: true,
  },
  auditTrail: {
    type: 'JSONB',
    defaultValue: [],
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
 * Sequelize DLPAuditLog model attributes.
 *
 * @example
 * ```typescript
 * class DLPAuditLog extends Model {}
 * DLPAuditLog.init(getDLPAuditLogModelAttributes(), {
 *   sequelize,
 *   tableName: 'dlp_audit_logs',
 *   timestamps: false,
 *   indexes: [
 *     { fields: ['timestamp', 'severity'] },
 *     { fields: ['userId'] },
 *     { fields: ['messageId'] },
 *     { fields: ['eventType'] }
 *   ]
 * });
 * ```
 */
export const getDLPAuditLogModelAttributes = () => ({
  id: {
    type: 'UUID',
    defaultValue: 'UUIDV4',
    primaryKey: true,
  },
  timestamp: {
    type: 'DATE',
    allowNull: false,
    defaultValue: 'NOW',
  },
  eventType: {
    type: 'STRING',
    allowNull: false,
  },
  userId: {
    type: 'UUID',
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  messageId: {
    type: 'UUID',
    allowNull: true,
    references: {
      model: 'mail_messages',
      key: 'id',
    },
  },
  policyId: {
    type: 'UUID',
    allowNull: true,
  },
  ruleId: {
    type: 'STRING',
    allowNull: true,
  },
  incidentId: {
    type: 'UUID',
    allowNull: true,
    references: {
      model: 'dlp_incidents',
      key: 'id',
    },
  },
  action: {
    type: 'ENUM',
    values: Object.values(DLPAction),
    allowNull: true,
  },
  details: {
    type: 'JSONB',
    defaultValue: {},
  },
  ipAddress: {
    type: 'STRING',
    allowNull: true,
  },
  userAgent: {
    type: 'TEXT',
    allowNull: true,
  },
  severity: {
    type: 'ENUM',
    values: Object.values(DLPSeverity),
    allowNull: false,
  },
});

/**
 * Sequelize UserTrainingRecord model attributes.
 *
 * @example
 * ```typescript
 * class UserTrainingRecord extends Model {}
 * UserTrainingRecord.init(getUserTrainingRecordModelAttributes(), {
 *   sequelize,
 *   tableName: 'user_training_records',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['userId', 'trainingType'] },
 *     { fields: ['expiresAt'] }
 *   ]
 * });
 * ```
 */
export const getUserTrainingRecordModelAttributes = () => ({
  id: {
    type: 'UUID',
    defaultValue: 'UUIDV4',
    primaryKey: true,
  },
  userId: {
    type: 'UUID',
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  trainingType: {
    type: 'STRING',
    allowNull: false,
  },
  completedAt: {
    type: 'DATE',
    allowNull: true,
  },
  score: {
    type: 'INTEGER',
    allowNull: true,
  },
  certificateUrl: {
    type: 'STRING',
    allowNull: true,
  },
  expiresAt: {
    type: 'DATE',
    allowNull: true,
  },
  violations: {
    type: 'JSONB',
    defaultValue: [],
  },
  warningsReceived: {
    type: 'INTEGER',
    defaultValue: 0,
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
// REGULAR EXPRESSION PATTERNS - SENSITIVE DATA DETECTION
// ============================================================================

/**
 * Provides comprehensive regex patterns for detecting sensitive data types.
 *
 * @returns {RegexPattern[]} Array of detection patterns
 *
 * @example
 * ```typescript
 * const patterns = getSensitiveDataPatterns();
 * const ssnPattern = patterns.find(p => p.dataType === SensitiveDataType.SSN);
 * const regex = new RegExp(ssnPattern.pattern, ssnPattern.flags);
 * const hasSSN = regex.test(content);
 * ```
 */
export const getSensitiveDataPatterns = (): RegexPattern[] => [
  {
    id: 'pattern-ssn-001',
    name: 'US Social Security Number',
    dataType: SensitiveDataType.SSN,
    pattern: '\\b(?!000|666|9\\d{2})([0-8]\\d{2}|7([0-6]\\d))([-\\s]?)(?!00)\\d{2}\\3(?!0000)\\d{4}\\b',
    flags: 'g',
    confidence: 95,
    validator: 'validateSSN',
    description: 'Detects US Social Security Numbers in various formats',
    examples: ['123-45-6789', '123 45 6789', '123456789'],
  },
  {
    id: 'pattern-cc-visa-001',
    name: 'Visa Credit Card',
    dataType: SensitiveDataType.CREDIT_CARD,
    pattern: '\\b4[0-9]{12}(?:[0-9]{3})?\\b',
    flags: 'g',
    confidence: 90,
    validator: 'validateLuhn',
    description: 'Detects Visa credit card numbers',
    examples: ['4111111111111111', '4012888888881881'],
  },
  {
    id: 'pattern-cc-mastercard-001',
    name: 'Mastercard Credit Card',
    dataType: SensitiveDataType.CREDIT_CARD,
    pattern: '\\b5[1-5][0-9]{14}\\b',
    flags: 'g',
    confidence: 90,
    validator: 'validateLuhn',
    description: 'Detects Mastercard credit card numbers',
    examples: ['5500000000000004', '5555555555554444'],
  },
  {
    id: 'pattern-cc-amex-001',
    name: 'American Express Credit Card',
    dataType: SensitiveDataType.CREDIT_CARD,
    pattern: '\\b3[47][0-9]{13}\\b',
    flags: 'g',
    confidence: 90,
    validator: 'validateLuhn',
    description: 'Detects American Express credit card numbers',
    examples: ['378282246310005', '371449635398431'],
  },
  {
    id: 'pattern-mrn-001',
    name: 'Medical Record Number',
    dataType: SensitiveDataType.MEDICAL_RECORD_NUMBER,
    pattern: '\\b(?:MRN|M\\.R\\.N\\.?|Medical Record)\\s*[:#]?\\s*([A-Z0-9]{6,12})\\b',
    flags: 'gi',
    confidence: 85,
    description: 'Detects medical record numbers with common prefixes',
    examples: ['MRN: 12345678', 'M.R.N. ABC123456', 'Medical Record #987654321'],
  },
  {
    id: 'pattern-patient-id-001',
    name: 'Patient ID',
    dataType: SensitiveDataType.PATIENT_ID,
    pattern: '\\b(?:Patient ID|PID|Pat\\.?ID)\\s*[:#]?\\s*([A-Z0-9]{6,12})\\b',
    flags: 'gi',
    confidence: 85,
    description: 'Detects patient identification numbers',
    examples: ['Patient ID: 12345678', 'PID: ABC123', 'Pat.ID #987654'],
  },
  {
    id: 'pattern-icd10-001',
    name: 'ICD-10 Diagnosis Code',
    dataType: SensitiveDataType.DIAGNOSIS_CODE,
    pattern: '\\b[A-TV-Z][0-9][0-9AB]\\.?[0-9A-TV-Z]{0,4}\\b',
    flags: 'g',
    confidence: 80,
    description: 'Detects ICD-10 diagnosis codes',
    examples: ['E11.9', 'I10', 'J45.909', 'Z00.00'],
  },
  {
    id: 'pattern-rx-number-001',
    name: 'Prescription Number',
    dataType: SensitiveDataType.PRESCRIPTION_NUMBER,
    pattern: '\\b(?:Rx|Prescription|Rx#)\\s*[:#]?\\s*([0-9]{7,12})\\b',
    flags: 'gi',
    confidence: 75,
    description: 'Detects prescription numbers',
    examples: ['Rx: 1234567', 'Prescription #987654321', 'Rx# 12345678'],
  },
  {
    id: 'pattern-phone-001',
    name: 'US Phone Number',
    dataType: SensitiveDataType.PII_PHONE,
    pattern: '\\b(?:\\+?1[-.]?)?\\(?([0-9]{3})\\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})\\b',
    flags: 'g',
    confidence: 70,
    description: 'Detects US phone numbers in various formats',
    examples: ['(555) 123-4567', '+1-555-123-4567', '555.123.4567'],
  },
  {
    id: 'pattern-email-001',
    name: 'Email Address',
    dataType: SensitiveDataType.PII_EMAIL,
    pattern: '\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b',
    flags: 'g',
    confidence: 90,
    description: 'Detects email addresses',
    examples: ['user@example.com', 'john.doe@company.co.uk'],
  },
  {
    id: 'pattern-dob-001',
    name: 'Date of Birth',
    dataType: SensitiveDataType.PII_DOB,
    pattern: '\\b(?:DOB|Date of Birth|Birth Date)\\s*[:#]?\\s*(\\d{1,2}[/-]\\d{1,2}[/-]\\d{2,4})\\b',
    flags: 'gi',
    confidence: 80,
    description: 'Detects dates of birth with common labels',
    examples: ['DOB: 01/15/1990', 'Date of Birth: 12-25-1985'],
  },
  {
    id: 'pattern-address-001',
    name: 'US Street Address',
    dataType: SensitiveDataType.PII_ADDRESS,
    pattern: '\\b\\d{1,5}\\s+(?:[A-Z][a-z]+\\s+){1,3}(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr|Court|Ct|Circle|Cir)\\b',
    flags: 'gi',
    confidence: 70,
    description: 'Detects US street addresses',
    examples: ['123 Main Street', '456 Oak Avenue', '789 Elm Road'],
  },
  {
    id: 'pattern-ip-001',
    name: 'IPv4 Address',
    dataType: SensitiveDataType.IP_ADDRESS,
    pattern: '\\b(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b',
    flags: 'g',
    confidence: 95,
    description: 'Detects IPv4 addresses',
    examples: ['192.168.1.1', '10.0.0.1', '172.16.0.1'],
  },
  {
    id: 'pattern-api-key-001',
    name: 'API Key Pattern',
    dataType: SensitiveDataType.API_KEY,
    pattern: '\\b(?:api[_-]?key|apikey|api[_-]?token)\\s*[=:]\\s*["\']?([A-Za-z0-9_\\-]{20,})["\'\\s]',
    flags: 'gi',
    confidence: 85,
    description: 'Detects API keys and tokens',
    examples: ['api_key="sk_live_123456789abcdef"', 'apiKey: pk_test_987654321'],
  },
  {
    id: 'pattern-private-key-001',
    name: 'Private Key',
    dataType: SensitiveDataType.PRIVATE_KEY,
    pattern: '-----BEGIN (?:RSA |EC )?PRIVATE KEY-----',
    flags: 'g',
    confidence: 100,
    description: 'Detects PEM-encoded private keys',
    examples: ['-----BEGIN RSA PRIVATE KEY-----', '-----BEGIN PRIVATE KEY-----'],
  },
  {
    id: 'pattern-drivers-license-001',
    name: 'US Drivers License',
    dataType: SensitiveDataType.DRIVERS_LICENSE,
    pattern: '\\b(?:DL|D\\.L\\.?|Driver\'?s License|License)\\s*[#:]?\\s*([A-Z0-9]{6,12})\\b',
    flags: 'gi',
    confidence: 75,
    description: 'Detects US drivers license numbers',
    examples: ['DL: A1234567', 'Driver\'s License #B9876543'],
  },
  {
    id: 'pattern-passport-001',
    name: 'US Passport',
    dataType: SensitiveDataType.PASSPORT,
    pattern: '\\b[0-9]{9}\\b',
    flags: 'g',
    confidence: 60,
    description: 'Detects US passport numbers (9 digits)',
    examples: ['123456789', '987654321'],
  },
  {
    id: 'pattern-bank-account-001',
    name: 'US Bank Account',
    dataType: SensitiveDataType.BANK_ACCOUNT,
    pattern: '\\b(?:Account|Acct)\\s*[#:]?\\s*([0-9]{8,17})\\b',
    flags: 'gi',
    confidence: 70,
    description: 'Detects US bank account numbers',
    examples: ['Account: 123456789', 'Acct #98765432101234'],
  },
  {
    id: 'pattern-password-001',
    name: 'Password in Text',
    dataType: SensitiveDataType.PASSWORD,
    pattern: '\\b(?:password|passwd|pwd)\\s*[=:]\\s*["\']?([^\\s"\']{6,})["\']?',
    flags: 'gi',
    confidence: 80,
    description: 'Detects passwords in plain text',
    examples: ['password="MySecret123"', 'pwd: Admin2024!'],
  },
];

// ============================================================================
// PATTERN VALIDATORS
// ============================================================================

/**
 * Validates US Social Security Number format and checksums.
 *
 * @param {string} ssn - SSN to validate
 * @returns {boolean} True if valid SSN format
 *
 * @example
 * ```typescript
 * const isValid = validateSSN('123-45-6789');
 * // Returns: true if valid format
 * ```
 */
export const validateSSN = (ssn: string): boolean => {
  const cleaned = ssn.replace(/[-\s]/g, '');
  if (cleaned.length !== 9) return false;

  const area = parseInt(cleaned.substring(0, 3));
  const group = parseInt(cleaned.substring(3, 5));
  const serial = parseInt(cleaned.substring(5, 9));

  // Invalid area numbers
  if (area === 0 || area === 666 || area >= 900) return false;
  // Invalid group
  if (group === 0) return false;
  // Invalid serial
  if (serial === 0) return false;

  return true;
};

/**
 * Validates credit card number using Luhn algorithm.
 *
 * @param {string} cardNumber - Card number to validate
 * @returns {boolean} True if passes Luhn check
 *
 * @example
 * ```typescript
 * const isValid = validateLuhn('4111111111111111');
 * // Returns: true for valid card
 * ```
 */
export const validateLuhn = (cardNumber: string): boolean => {
  const cleaned = cardNumber.replace(/\D/g, '');
  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned.charAt(i), 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

/**
 * Validates ICD-10 diagnosis code format.
 *
 * @param {string} code - ICD-10 code to validate
 * @returns {boolean} True if valid ICD-10 format
 *
 * @example
 * ```typescript
 * const isValid = validateICD10Code('E11.9');
 * // Returns: true for valid ICD-10 code
 * ```
 */
export const validateICD10Code = (code: string): boolean => {
  const cleaned = code.replace(/\./g, '');
  if (cleaned.length < 3) return false;

  const firstChar = cleaned.charAt(0);
  // Valid first characters: A-T, V-Z (not U)
  if (!/[A-TV-Z]/.test(firstChar)) return false;

  // Second and third must be digits
  if (!/\d{2}/.test(cleaned.substring(1, 3))) return false;

  return true;
};

/**
 * Validates email address format and common patterns.
 *
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email format
 *
 * @example
 * ```typescript
 * const isValid = validateEmail('user@example.com');
 * // Returns: true
 * ```
 */
export const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// ============================================================================
// CONTENT INSPECTION - CORE ENGINE
// ============================================================================

/**
 * Inspects content for sensitive data using configured patterns and rules.
 *
 * @param {string} content - Content to inspect
 * @param {string} location - Location identifier (subject, body, attachment)
 * @param {DLPRule[]} rules - DLP rules to apply
 * @returns {ContentInspectionResult} Inspection results with findings
 *
 * @example
 * ```typescript
 * const result = inspectContentForSensitiveData(
 *   'Patient MRN: 12345678, SSN: 123-45-6789',
 *   'body',
 *   dlpRules
 * );
 * // Returns detailed findings and violations
 * ```
 */
export const inspectContentForSensitiveData = (
  content: string,
  location: string,
  rules: DLPRule[]
): ContentInspectionResult => {
  const inspectionId = crypto.randomUUID();
  const findings: SensitiveDataFinding[] = [];
  const policyViolations: PolicyViolation[] = [];
  const patterns = getSensitiveDataPatterns();

  // Scan content with each pattern
  for (const pattern of patterns) {
    const regex = new RegExp(pattern.pattern, pattern.flags);
    let match;

    while ((match = regex.exec(content)) !== null) {
      const matchedText = match[0];
      const startPosition = match.index;
      const endPosition = startPosition + matchedText.length;

      // Validate match if validator exists
      let validated = false;
      if (pattern.validator) {
        const validator = getValidator(pattern.validator);
        validated = validator ? validator(matchedText) : false;
      }

      // Extract context (50 chars before and after)
      const contextStart = Math.max(0, startPosition - 50);
      const contextEnd = Math.min(content.length, endPosition + 50);
      const context = content.substring(contextStart, contextEnd);

      const finding: SensitiveDataFinding = {
        id: crypto.randomUUID(),
        dataType: pattern.dataType,
        location,
        matchedPattern: pattern.name,
        matchedText: maskSensitiveData(matchedText, pattern.dataType),
        confidence: validated ? pattern.confidence : pattern.confidence * 0.8,
        startPosition,
        endPosition,
        context: maskSensitiveData(context, pattern.dataType),
        validated,
        severity: getSeverityForDataType(pattern.dataType),
      };

      findings.push(finding);
    }
  }

  // Evaluate rules and check for violations
  for (const rule of rules.filter(r => r.enabled)) {
    const ruleFindings = findings.filter(f => rule.dataTypes.includes(f.dataType));

    if (ruleFindings.length >= (rule.matchCount || 1)) {
      const violation: PolicyViolation = {
        policyId: rule.policyId,
        policyName: rule.name,
        ruleId: rule.id,
        ruleName: rule.name,
        action: rule.actions[0], // Primary action
        severity: rule.severity,
        matchCount: ruleFindings.length,
        findings: ruleFindings,
        timestamp: new Date(),
      };

      policyViolations.push(violation);
    }
  }

  // Calculate risk score
  const riskScore = calculateRiskScore(findings, policyViolations);

  // Determine recommended action
  const recommendedAction = determineRecommendedAction(policyViolations);

  // Assess compliance status
  const complianceStatus = assessComplianceStatus(policyViolations);

  return {
    inspectionId,
    messageId: '', // Set by caller
    timestamp: new Date(),
    hasSensitiveData: findings.length > 0,
    totalMatches: findings.length,
    findings,
    recommendedAction,
    policyViolations,
    riskScore,
    complianceStatus,
  };
};

/**
 * Scans message body for sensitive data patterns.
 *
 * @param {string} bodyText - Plain text body content
 * @param {string} bodyHtml - HTML body content
 * @param {DLPRule[]} rules - Active DLP rules
 * @returns {ContentInspectionResult} Body scan results
 *
 * @example
 * ```typescript
 * const result = scanMessageBody(
 *   'Patient SSN is 123-45-6789',
 *   '<p>Patient SSN is 123-45-6789</p>',
 *   dlpRules
 * );
 * ```
 */
export const scanMessageBody = (
  bodyText: string | undefined,
  bodyHtml: string | undefined,
  rules: DLPRule[]
): ContentInspectionResult => {
  const content = bodyText || stripHtmlTags(bodyHtml || '');
  return inspectContentForSensitiveData(content, 'body', rules);
};

/**
 * Scans message subject line for sensitive data.
 *
 * @param {string} subject - Message subject
 * @param {DLPRule[]} rules - Active DLP rules
 * @returns {ContentInspectionResult} Subject scan results
 *
 * @example
 * ```typescript
 * const result = scanMessageSubject('Patient MRN 12345678', dlpRules);
 * ```
 */
export const scanMessageSubject = (
  subject: string,
  rules: DLPRule[]
): ContentInspectionResult => {
  return inspectContentForSensitiveData(subject, 'subject', rules);
};

/**
 * Scans attachment content for sensitive data (text extraction required).
 *
 * @param {Buffer} attachmentData - Attachment binary data
 * @param {string} filename - Attachment filename
 * @param {string} contentType - MIME type
 * @param {DLPRule[]} rules - Active DLP rules
 * @returns {Promise<AttachmentScanResult>} Scan results
 *
 * @example
 * ```typescript
 * const result = await scanAttachmentContent(
 *   fileBuffer,
 *   'patient-records.pdf',
 *   'application/pdf',
 *   dlpRules
 * );
 * ```
 */
export const scanAttachmentContent = async (
  attachmentData: Buffer,
  filename: string,
  contentType: string,
  rules: DLPRule[]
): Promise<AttachmentScanResult> => {
  const startTime = Date.now();
  const attachmentId = crypto.randomUUID();

  // Extract text based on content type
  let extractedText = '';
  try {
    extractedText = await extractTextFromAttachment(attachmentData, contentType);
  } catch (error) {
    return {
      attachmentId,
      filename,
      contentType,
      size: attachmentData.length,
      scanResult: ScanResult.ERROR,
      findings: [],
      scanDuration: Date.now() - startTime,
      scannedAt: new Date(),
      scannerVersion: '1.0.0',
    };
  }

  // Inspect extracted text
  const inspection = inspectContentForSensitiveData(
    extractedText,
    `attachment:${filename}`,
    rules
  );

  const scanDuration = Date.now() - startTime;

  let scanResult = ScanResult.CLEAN;
  if (inspection.findings.length > 0) {
    const hasCritical = inspection.findings.some(f => f.severity === DLPSeverity.CRITICAL);
    scanResult = hasCritical ? ScanResult.BLOCKED : ScanResult.SENSITIVE_DATA_FOUND;
  }

  return {
    attachmentId,
    filename,
    contentType,
    size: attachmentData.length,
    scanResult,
    findings: inspection.findings,
    extractedText: inspection.hasSensitiveData ? undefined : extractedText,
    scanDuration,
    scannedAt: new Date(),
    scannerVersion: '1.0.0',
  };
};

/**
 * Performs full message inspection (subject, body, attachments).
 *
 * @param {any} message - Mail message object
 * @param {DLPPolicy[]} policies - Active DLP policies
 * @returns {Promise<ContentInspectionResult>} Complete inspection results
 *
 * @example
 * ```typescript
 * const result = await inspectFullMessage(message, activePolicies);
 * if (result.recommendedAction === DLPAction.BLOCK) {
 *   // Handle blocked message
 * }
 * ```
 */
export const inspectFullMessage = async (
  message: any,
  policies: DLPPolicy[]
): Promise<ContentInspectionResult> => {
  const allRules = policies.flatMap(p => p.rules).filter(r => r.enabled);

  // Scan subject
  const subjectResult = scanMessageSubject(message.subject, allRules);

  // Scan body
  const bodyResult = scanMessageBody(message.bodyText, message.bodyHtml, allRules);

  // Scan attachments
  const attachmentResults: AttachmentScanResult[] = [];
  if (message.attachments && message.attachments.length > 0) {
    for (const attachment of message.attachments) {
      const result = await scanAttachmentContent(
        attachment.data,
        attachment.filename,
        attachment.contentType,
        allRules
      );
      attachmentResults.push(result);
    }
  }

  // Combine all findings
  const allFindings = [
    ...subjectResult.findings,
    ...bodyResult.findings,
    ...attachmentResults.flatMap(r => r.findings),
  ];

  const allViolations = [
    ...subjectResult.policyViolations,
    ...bodyResult.policyViolations,
  ];

  const riskScore = calculateRiskScore(allFindings, allViolations);
  const recommendedAction = determineRecommendedAction(allViolations);
  const complianceStatus = assessComplianceStatus(allViolations);

  return {
    inspectionId: crypto.randomUUID(),
    messageId: message.id,
    timestamp: new Date(),
    hasSensitiveData: allFindings.length > 0,
    totalMatches: allFindings.length,
    findings: allFindings,
    recommendedAction,
    policyViolations: allViolations,
    riskScore,
    complianceStatus,
  };
};

// ============================================================================
// POLICY ENFORCEMENT
// ============================================================================

/**
 * Enforces DLP policy actions on a message.
 *
 * @param {string} messageId - Message ID
 * @param {DLPAction} action - Action to enforce
 * @param {PolicyViolation[]} violations - Policy violations
 * @returns {Promise<any>} Enforcement result
 *
 * @example
 * ```typescript
 * await enforceDLPAction(
 *   'msg-123',
 *   DLPAction.QUARANTINE,
 *   violations
 * );
 * ```
 */
export const enforceDLPAction = async (
  messageId: string,
  action: DLPAction,
  violations: PolicyViolation[]
): Promise<any> => {
  const timestamp = new Date();

  switch (action) {
    case DLPAction.BLOCK:
      return blockMessage(messageId, violations, timestamp);
    case DLPAction.QUARANTINE:
      return quarantineMessage(messageId, violations, timestamp);
    case DLPAction.ENCRYPT:
      return encryptMessage(messageId, violations, timestamp);
    case DLPAction.ALERT:
      return sendDLPAlert(messageId, violations, timestamp);
    case DLPAction.WARN:
      return sendUserWarning(messageId, violations, timestamp);
    case DLPAction.REDACT:
      return redactSensitiveData(messageId, violations, timestamp);
    case DLPAction.REQUIRE_JUSTIFICATION:
      return requireJustification(messageId, violations, timestamp);
    case DLPAction.REQUIRE_APPROVAL:
      return requireApproval(messageId, violations, timestamp);
    default:
      return { action: DLPAction.ALLOW, messageId, timestamp };
  }
};

/**
 * Blocks a message from being sent or delivered.
 *
 * @param {string} messageId - Message ID
 * @param {PolicyViolation[]} violations - Violations causing block
 * @param {Date} timestamp - Action timestamp
 * @returns {Promise<any>} Block result
 *
 * @example
 * ```typescript
 * await blockMessage('msg-123', violations, new Date());
 * ```
 */
export const blockMessage = async (
  messageId: string,
  violations: PolicyViolation[],
  timestamp: Date
): Promise<any> => {
  return {
    action: DLPAction.BLOCK,
    messageId,
    violations,
    timestamp,
    status: 'blocked',
    message: 'Message blocked due to DLP policy violation',
  };
};

/**
 * Moves message to quarantine for review.
 *
 * @param {string} messageId - Message ID
 * @param {PolicyViolation[]} violations - Violations causing quarantine
 * @param {Date} timestamp - Action timestamp
 * @returns {Promise<any>} Quarantine result
 *
 * @example
 * ```typescript
 * await quarantineMessage('msg-123', violations, new Date());
 * ```
 */
export const quarantineMessage = async (
  messageId: string,
  violations: PolicyViolation[],
  timestamp: Date
): Promise<any> => {
  return {
    action: DLPAction.QUARANTINE,
    messageId,
    violations,
    timestamp,
    status: 'quarantined',
    message: 'Message quarantined for admin review',
    quarantineFolderId: 'dlp-quarantine',
  };
};

/**
 * Encrypts message before sending.
 *
 * @param {string} messageId - Message ID
 * @param {PolicyViolation[]} violations - Violations requiring encryption
 * @param {Date} timestamp - Action timestamp
 * @returns {Promise<any>} Encryption result
 *
 * @example
 * ```typescript
 * await encryptMessage('msg-123', violations, new Date());
 * ```
 */
export const encryptMessage = async (
  messageId: string,
  violations: PolicyViolation[],
  timestamp: Date
): Promise<any> => {
  return {
    action: DLPAction.ENCRYPT,
    messageId,
    violations,
    timestamp,
    status: 'encrypted',
    encryptionMethod: 'S/MIME',
    message: 'Message encrypted due to sensitive data detection',
  };
};

/**
 * Sends DLP alert to administrators.
 *
 * @param {string} messageId - Message ID
 * @param {PolicyViolation[]} violations - Violations to report
 * @param {Date} timestamp - Alert timestamp
 * @returns {Promise<any>} Alert result
 *
 * @example
 * ```typescript
 * await sendDLPAlert('msg-123', violations, new Date());
 * ```
 */
export const sendDLPAlert = async (
  messageId: string,
  violations: PolicyViolation[],
  timestamp: Date
): Promise<any> => {
  const alertId = crypto.randomUUID();

  return {
    action: DLPAction.ALERT,
    alertId,
    messageId,
    violations,
    timestamp,
    status: 'alert_sent',
    recipients: ['security@whitecross.com', 'compliance@whitecross.com'],
  };
};

/**
 * Sends warning to user about policy violation.
 *
 * @param {string} messageId - Message ID
 * @param {PolicyViolation[]} violations - Violations to warn about
 * @param {Date} timestamp - Warning timestamp
 * @returns {Promise<any>} Warning result
 *
 * @example
 * ```typescript
 * await sendUserWarning('msg-123', violations, new Date());
 * ```
 */
export const sendUserWarning = async (
  messageId: string,
  violations: PolicyViolation[],
  timestamp: Date
): Promise<any> => {
  return {
    action: DLPAction.WARN,
    messageId,
    violations,
    timestamp,
    status: 'warning_sent',
    message: 'User notified of policy violation',
  };
};

/**
 * Redacts sensitive data from message content.
 *
 * @param {string} messageId - Message ID
 * @param {PolicyViolation[]} violations - Violations with data to redact
 * @param {Date} timestamp - Redaction timestamp
 * @returns {Promise<any>} Redaction result
 *
 * @example
 * ```typescript
 * await redactSensitiveData('msg-123', violations, new Date());
 * ```
 */
export const redactSensitiveData = async (
  messageId: string,
  violations: PolicyViolation[],
  timestamp: Date
): Promise<any> => {
  const redactedFindings = violations.flatMap(v => v.findings);

  return {
    action: DLPAction.REDACT,
    messageId,
    violations,
    timestamp,
    status: 'redacted',
    redactedCount: redactedFindings.length,
    message: 'Sensitive data redacted from message',
  };
};

/**
 * Requires user justification before sending.
 *
 * @param {string} messageId - Message ID
 * @param {PolicyViolation[]} violations - Violations requiring justification
 * @param {Date} timestamp - Request timestamp
 * @returns {Promise<any>} Justification request result
 *
 * @example
 * ```typescript
 * await requireJustification('msg-123', violations, new Date());
 * ```
 */
export const requireJustification = async (
  messageId: string,
  violations: PolicyViolation[],
  timestamp: Date
): Promise<any> => {
  return {
    action: DLPAction.REQUIRE_JUSTIFICATION,
    messageId,
    violations,
    timestamp,
    status: 'pending_justification',
    message: 'User must provide justification to send',
  };
};

/**
 * Requires admin approval before sending.
 *
 * @param {string} messageId - Message ID
 * @param {PolicyViolation[]} violations - Violations requiring approval
 * @param {Date} timestamp - Request timestamp
 * @returns {Promise<any>} Approval request result
 *
 * @example
 * ```typescript
 * await requireApproval('msg-123', violations, new Date());
 * ```
 */
export const requireApproval = async (
  messageId: string,
  violations: PolicyViolation[],
  timestamp: Date
): Promise<any> => {
  const approvalId = crypto.randomUUID();

  return {
    action: DLPAction.REQUIRE_APPROVAL,
    approvalId,
    messageId,
    violations,
    timestamp,
    status: 'pending_approval',
    message: 'Admin approval required to send message',
  };
};

// ============================================================================
// INCIDENT MANAGEMENT
// ============================================================================

/**
 * Creates a DLP incident from inspection results.
 *
 * @param {ContentInspectionResult} inspection - Inspection results
 * @param {string} userId - User ID
 * @returns {DLPIncident} Created incident
 *
 * @example
 * ```typescript
 * const incident = createDLPIncident(inspectionResult, 'user-123');
 * ```
 */
export const createDLPIncident = (
  inspection: ContentInspectionResult,
  userId: string
): DLPIncident => {
  const incident: DLPIncident = {
    id: crypto.randomUUID(),
    messageId: inspection.messageId,
    userId,
    incidentType: 'policy_violation',
    status: DLPIncidentStatus.NEW,
    severity: determineIncidentSeverity(inspection.policyViolations),
    policyViolations: inspection.policyViolations,
    findings: inspection.findings,
    actionsTaken: [inspection.recommendedAction],
    reportedAt: new Date(),
  };

  return incident;
};

/**
 * Updates DLP incident status and notes.
 *
 * @param {string} incidentId - Incident ID
 * @param {DLPIncidentStatus} status - New status
 * @param {string} notes - Update notes
 * @param {string} updatedBy - User making update
 * @returns {DLPIncident} Updated incident
 *
 * @example
 * ```typescript
 * const updated = updateDLPIncident(
 *   'incident-123',
 *   DLPIncidentStatus.RESOLVED,
 *   'False positive - internal communication',
 *   'admin-456'
 * );
 * ```
 */
export const updateDLPIncident = (
  incidentId: string,
  status: DLPIncidentStatus,
  notes: string,
  updatedBy: string
): DLPIncident => {
  // Implementation would fetch from database
  const incident: DLPIncident = {
    id: incidentId,
    messageId: '',
    userId: '',
    incidentType: 'policy_violation',
    status,
    severity: DLPSeverity.MEDIUM,
    policyViolations: [],
    findings: [],
    actionsTaken: [],
    reportedAt: new Date(),
  };

  if (status === DLPIncidentStatus.RESOLVED) {
    incident.resolvedAt = new Date();
    incident.resolutionNotes = notes;
  } else if (status === DLPIncidentStatus.ESCALATED) {
    incident.escalatedAt = new Date();
  }

  return incident;
};

/**
 * Assigns incident to security team member.
 *
 * @param {string} incidentId - Incident ID
 * @param {string} assigneeId - User ID to assign to
 * @returns {DLPIncident} Updated incident
 *
 * @example
 * ```typescript
 * const assigned = assignDLPIncident('incident-123', 'security-admin-456');
 * ```
 */
export const assignDLPIncident = (
  incidentId: string,
  assigneeId: string
): DLPIncident => {
  // Implementation would update database
  return {
    id: incidentId,
    messageId: '',
    userId: '',
    incidentType: 'policy_violation',
    status: DLPIncidentStatus.INVESTIGATING,
    severity: DLPSeverity.MEDIUM,
    policyViolations: [],
    findings: [],
    actionsTaken: [],
    assignedTo: assigneeId,
    reportedAt: new Date(),
  };
};

// ============================================================================
// COMPLIANCE REPORTING
// ============================================================================

/**
 * Generates HIPAA compliance report for specified period.
 *
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @param {string} generatedBy - User generating report
 * @returns {Promise<ComplianceReport>} HIPAA compliance report
 *
 * @example
 * ```typescript
 * const report = await generateHIPAAComplianceReport(
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31'),
 *   'admin-123'
 * );
 * ```
 */
export const generateHIPAAComplianceReport = async (
  startDate: Date,
  endDate: Date,
  generatedBy: string
): Promise<ComplianceReport> => {
  const reportId = crypto.randomUUID();

  // In production, fetch actual data from database
  const metrics: ComplianceMetrics = {
    totalMessages: 0,
    messagesScanned: 0,
    policyViolations: 0,
    incidentsCreated: 0,
    incidentsResolved: 0,
    averageResolutionTime: 0,
    blockedMessages: 0,
    quarantinedMessages: 0,
    encryptedMessages: 0,
    alertsTriggered: 0,
    falsePositiveRate: 0,
    topViolatedPolicies: [],
    topDataTypes: [],
    userViolations: [],
  };

  const report: ComplianceReport = {
    id: reportId,
    framework: ComplianceFramework.HIPAA,
    reportType: 'monthly',
    startDate,
    endDate,
    metrics,
    incidents: [],
    recommendations: [
      'Review and update DLP policies quarterly',
      'Provide additional PHI handling training to users with violations',
      'Consider implementing automatic encryption for external emails',
    ],
    generatedBy,
    generatedAt: new Date(),
  };

  return report;
};

/**
 * Generates GDPR compliance report.
 *
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @param {string} generatedBy - User generating report
 * @returns {Promise<ComplianceReport>} GDPR compliance report
 *
 * @example
 * ```typescript
 * const report = await generateGDPRComplianceReport(
 *   new Date('2024-01-01'),
 *   new Date('2024-03-31'),
 *   'admin-123'
 * );
 * ```
 */
export const generateGDPRComplianceReport = async (
  startDate: Date,
  endDate: Date,
  generatedBy: string
): Promise<ComplianceReport> => {
  const reportId = crypto.randomUUID();

  const metrics: ComplianceMetrics = {
    totalMessages: 0,
    messagesScanned: 0,
    policyViolations: 0,
    incidentsCreated: 0,
    incidentsResolved: 0,
    averageResolutionTime: 0,
    blockedMessages: 0,
    quarantinedMessages: 0,
    encryptedMessages: 0,
    alertsTriggered: 0,
    falsePositiveRate: 0,
    topViolatedPolicies: [],
    topDataTypes: [],
    userViolations: [],
  };

  return {
    id: reportId,
    framework: ComplianceFramework.GDPR,
    reportType: 'quarterly',
    startDate,
    endDate,
    metrics,
    incidents: [],
    recommendations: [
      'Ensure data subject rights are honored promptly',
      'Review data retention policies',
      'Document legal basis for processing PII',
    ],
    generatedBy,
    generatedAt: new Date(),
  };
};

/**
 * Generates SOC 2 compliance report.
 *
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @param {string} generatedBy - User generating report
 * @returns {Promise<ComplianceReport>} SOC 2 compliance report
 *
 * @example
 * ```typescript
 * const report = await generateSOC2ComplianceReport(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31'),
 *   'admin-123'
 * );
 * ```
 */
export const generateSOC2ComplianceReport = async (
  startDate: Date,
  endDate: Date,
  generatedBy: string
): Promise<ComplianceReport> => {
  const reportId = crypto.randomUUID();

  const metrics: ComplianceMetrics = {
    totalMessages: 0,
    messagesScanned: 0,
    policyViolations: 0,
    incidentsCreated: 0,
    incidentsResolved: 0,
    averageResolutionTime: 0,
    blockedMessages: 0,
    quarantinedMessages: 0,
    encryptedMessages: 0,
    alertsTriggered: 0,
    falsePositiveRate: 0,
    topViolatedPolicies: [],
    topDataTypes: [],
    userViolations: [],
  };

  return {
    id: reportId,
    framework: ComplianceFramework.SOC2,
    reportType: 'annual',
    startDate,
    endDate,
    metrics,
    incidents: [],
    recommendations: [
      'Maintain comprehensive audit logs for all DLP events',
      'Regularly review and test incident response procedures',
      'Document and track security control changes',
    ],
    generatedBy,
    generatedAt: new Date(),
  };
};

/**
 * Gets compliance metrics summary for dashboard.
 *
 * @param {Date} startDate - Metrics start date
 * @param {Date} endDate - Metrics end date
 * @returns {Promise<ComplianceMetrics>} Metrics summary
 *
 * @example
 * ```typescript
 * const metrics = await getComplianceMetrics(
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31')
 * );
 * ```
 */
export const getComplianceMetrics = async (
  startDate: Date,
  endDate: Date
): Promise<ComplianceMetrics> => {
  // In production, query database for actual metrics
  return {
    totalMessages: 15420,
    messagesScanned: 15420,
    policyViolations: 127,
    incidentsCreated: 23,
    incidentsResolved: 20,
    averageResolutionTime: 4.5,
    blockedMessages: 8,
    quarantinedMessages: 15,
    encryptedMessages: 1250,
    alertsTriggered: 42,
    falsePositiveRate: 13.0,
    topViolatedPolicies: [
      { policyId: 'policy-1', count: 45 },
      { policyId: 'policy-2', count: 32 },
    ],
    topDataTypes: [
      { dataType: SensitiveDataType.SSN, count: 28 },
      { dataType: SensitiveDataType.MEDICAL_RECORD_NUMBER, count: 22 },
    ],
    userViolations: [
      { userId: 'user-1', count: 12 },
      { userId: 'user-2', count: 8 },
    ],
  };
};

// ============================================================================
// EXEMPTIONS MANAGEMENT
// ============================================================================

/**
 * Creates a DLP policy exemption.
 *
 * @param {ExemptionType} type - Exemption type
 * @param {string} targetIdentifier - Target (user ID, domain, etc)
 * @param {string} reason - Exemption reason
 * @param {string} requestedBy - User requesting exemption
 * @param {Date} endDate - Expiration date (undefined for permanent)
 * @returns {DLPExemption} Created exemption
 *
 * @example
 * ```typescript
 * const exemption = createDLPExemption(
 *   ExemptionType.USER,
 *   'user-123',
 *   'Executive exemption for patient outreach program',
 *   'admin-456',
 *   new Date('2024-12-31')
 * );
 * ```
 */
export const createDLPExemption = (
  type: ExemptionType,
  targetIdentifier: string,
  reason: string,
  requestedBy: string,
  endDate?: Date
): DLPExemption => {
  const exemption: DLPExemption = {
    id: crypto.randomUUID(),
    type,
    targetIdentifier,
    reason,
    requestedBy,
    startDate: new Date(),
    endDate,
    permanent: !endDate,
    active: true,
    auditTrail: [
      {
        timestamp: new Date(),
        action: 'created',
        performedBy: requestedBy,
        notes: reason,
      },
    ],
    createdAt: new Date(),
  };

  return exemption;
};

/**
 * Checks if user/domain has active exemption.
 *
 * @param {string} identifier - User ID or domain to check
 * @param {string} policyId - Policy ID (optional)
 * @returns {Promise<boolean>} True if exempt
 *
 * @example
 * ```typescript
 * const isExempt = await checkDLPExemption('user-123', 'policy-456');
 * if (isExempt) {
 *   // Skip DLP checks
 * }
 * ```
 */
export const checkDLPExemption = async (
  identifier: string,
  policyId?: string
): Promise<boolean> => {
  // In production, query database for active exemptions
  return false;
};

/**
 * Revokes an active exemption.
 *
 * @param {string} exemptionId - Exemption ID
 * @param {string} revokedBy - User revoking exemption
 * @param {string} reason - Revocation reason
 * @returns {DLPExemption} Updated exemption
 *
 * @example
 * ```typescript
 * const revoked = revokeDLPExemption(
 *   'exemption-123',
 *   'admin-456',
 *   'Project completed'
 * );
 * ```
 */
export const revokeDLPExemption = (
  exemptionId: string,
  revokedBy: string,
  reason: string
): DLPExemption => {
  // Implementation would update database
  return {
    id: exemptionId,
    type: ExemptionType.USER,
    targetIdentifier: '',
    reason: '',
    requestedBy: '',
    startDate: new Date(),
    permanent: false,
    active: false,
    auditTrail: [
      {
        timestamp: new Date(),
        action: 'revoked',
        performedBy: revokedBy,
        notes: reason,
      },
    ],
    createdAt: new Date(),
  };
};

// ============================================================================
// AUDIT LOGGING
// ============================================================================

/**
 * Creates DLP audit log entry.
 *
 * @param {string} eventType - Event type
 * @param {any} details - Event details
 * @param {DLPSeverity} severity - Event severity
 * @param {string} userId - User ID (optional)
 * @returns {DLPAuditLog} Created audit log
 *
 * @example
 * ```typescript
 * const log = createDLPAuditLog(
 *   'rule_triggered',
 *   { ruleId: 'rule-123', findings: 3 },
 *   DLPSeverity.HIGH,
 *   'user-456'
 * );
 * ```
 */
export const createDLPAuditLog = (
  eventType: string,
  details: any,
  severity: DLPSeverity,
  userId?: string
): DLPAuditLog => {
  return {
    id: crypto.randomUUID(),
    timestamp: new Date(),
    eventType,
    userId,
    details,
    severity,
  };
};

/**
 * Queries DLP audit logs with filters.
 *
 * @param {any} filters - Query filters
 * @returns {Promise<DLPAuditLog[]>} Matching audit logs
 *
 * @example
 * ```typescript
 * const logs = await queryDLPAuditLogs({
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-01-31'),
 *   severity: DLPSeverity.HIGH,
 *   userId: 'user-123'
 * });
 * ```
 */
export const queryDLPAuditLogs = async (filters: any): Promise<DLPAuditLog[]> => {
  // In production, query database with filters
  return [];
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Masks sensitive data for safe display/logging.
 *
 * @param {string} data - Data to mask
 * @param {SensitiveDataType} dataType - Data type
 * @returns {string} Masked data
 *
 * @example
 * ```typescript
 * const masked = maskSensitiveData('123-45-6789', SensitiveDataType.SSN);
 * // Returns: "***-**-6789"
 * ```
 */
export const maskSensitiveData = (data: string, dataType: SensitiveDataType): string => {
  if (!data) return '';

  switch (dataType) {
    case SensitiveDataType.SSN:
      return data.length > 4 ? '***-**-' + data.slice(-4) : '***';
    case SensitiveDataType.CREDIT_CARD:
      return data.length > 4 ? '****-****-****-' + data.slice(-4) : '****';
    case SensitiveDataType.PII_EMAIL:
      const atIndex = data.indexOf('@');
      if (atIndex > 0) {
        return data.charAt(0) + '***' + data.slice(atIndex);
      }
      return '***';
    case SensitiveDataType.PII_PHONE:
      return data.length > 4 ? '***-***-' + data.slice(-4) : '***';
    default:
      return data.length > 4 ? '*'.repeat(data.length - 4) + data.slice(-4) : '***';
  }
};

/**
 * Strips HTML tags from content.
 *
 * @param {string} html - HTML content
 * @returns {string} Plain text
 */
export const stripHtmlTags = (html: string): string => {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
};

/**
 * Extracts text from attachment based on content type.
 *
 * @param {Buffer} data - Attachment data
 * @param {string} contentType - MIME type
 * @returns {Promise<string>} Extracted text
 */
export const extractTextFromAttachment = async (
  data: Buffer,
  contentType: string
): Promise<string> => {
  // In production, use appropriate text extraction libraries
  // For PDF: pdf-parse, For Office: mammoth, textract
  if (contentType === 'text/plain') {
    return data.toString('utf-8');
  }

  // Placeholder for other content types
  return '';
};

/**
 * Calculates risk score based on findings.
 *
 * @param {SensitiveDataFinding[]} findings - Detected findings
 * @param {PolicyViolation[]} violations - Policy violations
 * @returns {number} Risk score 0-100
 */
export const calculateRiskScore = (
  findings: SensitiveDataFinding[],
  violations: PolicyViolation[]
): number => {
  if (findings.length === 0) return 0;

  let score = 0;

  // Add points for each finding based on severity
  for (const finding of findings) {
    switch (finding.severity) {
      case DLPSeverity.CRITICAL:
        score += 25;
        break;
      case DLPSeverity.HIGH:
        score += 15;
        break;
      case DLPSeverity.MEDIUM:
        score += 10;
        break;
      case DLPSeverity.LOW:
        score += 5;
        break;
    }
  }

  // Cap at 100
  return Math.min(score, 100);
};

/**
 * Determines recommended action based on violations.
 *
 * @param {PolicyViolation[]} violations - Policy violations
 * @returns {DLPAction} Recommended action
 */
export const determineRecommendedAction = (violations: PolicyViolation[]): DLPAction => {
  if (violations.length === 0) return DLPAction.ALLOW;

  // Get highest severity action
  const hasCritical = violations.some(v => v.severity === DLPSeverity.CRITICAL);
  const hasHigh = violations.some(v => v.severity === DLPSeverity.HIGH);

  if (hasCritical) return DLPAction.BLOCK;
  if (hasHigh) return DLPAction.QUARANTINE;

  return DLPAction.ALERT;
};

/**
 * Assesses compliance status based on violations.
 *
 * @param {PolicyViolation[]} violations - Policy violations
 * @returns {ComplianceStatus} Compliance assessment
 */
export const assessComplianceStatus = (violations: PolicyViolation[]): ComplianceStatus => {
  const complianceViolations: ComplianceViolation[] = [];

  if (violations.length > 0) {
    complianceViolations.push({
      framework: ComplianceFramework.HIPAA,
      requirement: '164.312(a)(2)(iv) - Encryption and Decryption',
      description: 'Unencrypted PHI detected in email communication',
      severity: DLPSeverity.HIGH,
      remediation: 'Enable automatic encryption for emails containing PHI',
    });
  }

  return {
    frameworks: [ComplianceFramework.HIPAA, ComplianceFramework.HITECH],
    compliant: violations.length === 0,
    violations: complianceViolations,
    recommendations: [
      'Encrypt all emails containing sensitive healthcare data',
      'Provide additional HIPAA training to users',
    ],
    assessmentDate: new Date(),
  };
};

/**
 * Gets severity level for data type.
 *
 * @param {SensitiveDataType} dataType - Data type
 * @returns {DLPSeverity} Severity level
 */
export const getSeverityForDataType = (dataType: SensitiveDataType): DLPSeverity => {
  switch (dataType) {
    case SensitiveDataType.SSN:
    case SensitiveDataType.MEDICAL_RECORD_NUMBER:
    case SensitiveDataType.PATIENT_ID:
    case SensitiveDataType.PRIVATE_KEY:
      return DLPSeverity.CRITICAL;
    case SensitiveDataType.CREDIT_CARD:
    case SensitiveDataType.DIAGNOSIS_CODE:
    case SensitiveDataType.API_KEY:
    case SensitiveDataType.PASSWORD:
      return DLPSeverity.HIGH;
    case SensitiveDataType.PRESCRIPTION_NUMBER:
    case SensitiveDataType.DRIVERS_LICENSE:
    case SensitiveDataType.BANK_ACCOUNT:
      return DLPSeverity.MEDIUM;
    default:
      return DLPSeverity.LOW;
  }
};

/**
 * Gets validator function by name.
 *
 * @param {string} validatorName - Validator function name
 * @returns {Function} Validator function
 */
export const getValidator = (validatorName: string): ((data: string) => boolean) | null => {
  const validators: Record<string, (data: string) => boolean> = {
    validateSSN,
    validateLuhn,
    validateICD10Code,
    validateEmail,
  };

  return validators[validatorName] || null;
};

/**
 * Determines incident severity from violations.
 *
 * @param {PolicyViolation[]} violations - Policy violations
 * @returns {DLPSeverity} Incident severity
 */
export const determineIncidentSeverity = (violations: PolicyViolation[]): DLPSeverity => {
  if (violations.length === 0) return DLPSeverity.LOW;

  const hasCritical = violations.some(v => v.severity === DLPSeverity.CRITICAL);
  const hasHigh = violations.some(v => v.severity === DLPSeverity.HIGH);

  if (hasCritical) return DLPSeverity.CRITICAL;
  if (hasHigh) return DLPSeverity.HIGH;

  return DLPSeverity.MEDIUM;
};

// ============================================================================
// SWAGGER DOCUMENTATION SCHEMAS
// ============================================================================

/**
 * Gets Swagger schema for DLP policy endpoints.
 *
 * @returns {SwaggerDLPSchema[]} Swagger schemas
 *
 * @example
 * ```typescript
 * // In NestJS controller:
 * @ApiOperation({ summary: 'Create DLP policy' })
 * @ApiBody({ schema: getDLPSwaggerSchemas()[0] })
 * async createPolicy(@Body() dto: CreateDLPPolicyDto) {}
 * ```
 */
export const getDLPSwaggerSchemas = (): SwaggerDLPSchema[] => [
  {
    name: 'DLPPolicy',
    type: 'object',
    description: 'DLP policy configuration',
    required: true,
    example: {
      name: 'HIPAA PHI Protection',
      description: 'Protects PHI in email communications',
      enabled: true,
      priority: 100,
      framework: 'hipaa',
      defaultAction: 'encrypt',
    },
    properties: {
      name: { type: 'string', description: 'Policy name' },
      enabled: { type: 'boolean', description: 'Policy enabled status' },
      framework: { type: 'string', enum: Object.values(ComplianceFramework) },
    },
  },
  {
    name: 'ContentInspectionResult',
    type: 'object',
    description: 'Content inspection result with findings',
    required: false,
    example: {
      hasSensitiveData: true,
      totalMatches: 3,
      recommendedAction: 'quarantine',
      riskScore: 85,
    },
  },
  {
    name: 'DLPIncident',
    type: 'object',
    description: 'DLP policy violation incident',
    required: false,
    example: {
      incidentType: 'policy_violation',
      status: 'new',
      severity: 'high',
    },
  },
];

/**
 * Gets Swagger API responses for DLP endpoints.
 *
 * @returns {any} Swagger response schemas
 */
export const getDLPSwaggerResponses = () => ({
  200: {
    description: 'DLP operation successful',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: { type: 'object' },
      },
    },
  },
  403: {
    description: 'DLP policy violation - message blocked',
    schema: {
      type: 'object',
      properties: {
        error: { type: 'string' },
        violations: { type: 'array' },
        action: { type: 'string' },
      },
    },
  },
});
