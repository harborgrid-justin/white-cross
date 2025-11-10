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
 * DLP policy action types
 */
export declare enum DLPAction {
    ALLOW = "allow",
    BLOCK = "block",
    QUARANTINE = "quarantine",
    ENCRYPT = "encrypt",
    ALERT = "alert",
    WARN = "warn",
    REDACT = "redact",
    REQUIRE_JUSTIFICATION = "require_justification",
    REQUIRE_APPROVAL = "require_approval"
}
/**
 * Sensitive data types for detection
 */
export declare enum SensitiveDataType {
    SSN = "ssn",
    CREDIT_CARD = "credit_card",
    DRIVERS_LICENSE = "drivers_license",
    PASSPORT = "passport",
    BANK_ACCOUNT = "bank_account",
    MEDICAL_RECORD_NUMBER = "medical_record_number",
    PATIENT_ID = "patient_id",
    DIAGNOSIS_CODE = "diagnosis_code",
    PRESCRIPTION_NUMBER = "prescription_number",
    PHI_GENERAL = "phi_general",
    PII_EMAIL = "pii_email",
    PII_PHONE = "pii_phone",
    PII_ADDRESS = "pii_address",
    PII_DOB = "pii_dob",
    IP_ADDRESS = "ip_address",
    API_KEY = "api_key",
    PASSWORD = "password",
    PRIVATE_KEY = "private_key",
    CUSTOM = "custom"
}
/**
 * DLP rule severity levels
 */
export declare enum DLPSeverity {
    CRITICAL = "critical",
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low",
    INFO = "info"
}
/**
 * Compliance framework types
 */
export declare enum ComplianceFramework {
    HIPAA = "hipaa",
    GDPR = "gdpr",
    SOC2 = "soc2",
    PCI_DSS = "pci_dss",
    HITECH = "hitech",
    ISO_27001 = "iso_27001",
    NIST = "nist",
    CCPA = "ccpa",
    CUSTOM = "custom"
}
/**
 * DLP incident status
 */
export declare enum DLPIncidentStatus {
    NEW = "new",
    INVESTIGATING = "investigating",
    CONFIRMED = "confirmed",
    FALSE_POSITIVE = "false_positive",
    RESOLVED = "resolved",
    ESCALATED = "escalated",
    CLOSED = "closed"
}
/**
 * Content inspection scope
 */
export declare enum InspectionScope {
    SUBJECT = "subject",
    BODY = "body",
    ATTACHMENTS = "attachments",
    HEADERS = "headers",
    METADATA = "metadata",
    ALL = "all"
}
/**
 * Policy exemption types
 */
export declare enum ExemptionType {
    USER = "user",
    DOMAIN = "domain",
    RECIPIENT = "recipient",
    TIME_BASED = "time_based",
    TEMPORARY = "temporary",
    PERMANENT = "permanent"
}
/**
 * Attachment scan result
 */
export declare enum ScanResult {
    CLEAN = "clean",
    SUSPICIOUS = "suspicious",
    SENSITIVE_DATA_FOUND = "sensitive_data_found",
    BLOCKED = "blocked",
    ERROR = "error"
}
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
    confidenceThreshold: number;
    matchCount?: number;
    exemptions?: string[];
    customValidation?: string;
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
    confidence: number;
    validator?: string;
    description: string;
    examples: string[];
}
/**
 * DLP condition for rule evaluation
 */
export interface DLPCondition {
    field: string;
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
    riskScore: number;
    complianceStatus: ComplianceStatus;
    metadata?: Record<string, any>;
}
/**
 * Sensitive data finding
 */
export interface SensitiveDataFinding {
    id: string;
    dataType: SensitiveDataType;
    location: string;
    matchedPattern: string;
    matchedText: string;
    fullMatch?: string;
    confidence: number;
    startPosition: number;
    endPosition: number;
    context?: string;
    validated: boolean;
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
    scanDuration: number;
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
    targetIdentifier: string;
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
    averageResolutionTime: number;
    blockedMessages: number;
    quarantinedMessages: number;
    encryptedMessages: number;
    alertsTriggered: number;
    falsePositiveRate: number;
    topViolatedPolicies: {
        policyId: string;
        count: number;
    }[];
    topDataTypes: {
        dataType: SensitiveDataType;
        count: number;
    }[];
    userViolations: {
        userId: string;
        count: number;
    }[];
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
export declare const getDLPPolicyModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    name: {
        type: string;
        allowNull: boolean;
        unique: boolean;
    };
    description: {
        type: string;
        allowNull: boolean;
    };
    enabled: {
        type: string;
        defaultValue: boolean;
    };
    priority: {
        type: string;
        defaultValue: number;
        comment: string;
    };
    framework: {
        type: string;
        values: ComplianceFramework[];
        allowNull: boolean;
    };
    rules: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    scope: {
        type: string;
        defaultValue: string[];
        comment: string;
    };
    defaultAction: {
        type: string;
        values: DLPAction[];
        defaultValue: DLPAction;
    };
    notifyAdmins: {
        type: string;
        defaultValue: boolean;
    };
    notifyUsers: {
        type: string;
        defaultValue: boolean;
    };
    adminEmails: {
        type: string;
        defaultValue: never[];
    };
    auditEnabled: {
        type: string;
        defaultValue: boolean;
    };
    createdBy: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    metadata: {
        type: string;
        defaultValue: {};
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
    updatedAt: {
        type: string;
        allowNull: boolean;
    };
};
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
export declare const getDLPIncidentModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    messageId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    userId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    incidentType: {
        type: string;
        allowNull: boolean;
    };
    status: {
        type: string;
        values: DLPIncidentStatus[];
        defaultValue: DLPIncidentStatus;
    };
    severity: {
        type: string;
        values: DLPSeverity[];
        allowNull: boolean;
    };
    policyViolations: {
        type: string;
        defaultValue: never[];
    };
    findings: {
        type: string;
        defaultValue: never[];
    };
    actionsTaken: {
        type: string;
        defaultValue: never[];
    };
    assignedTo: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    investigationNotes: {
        type: string;
        allowNull: boolean;
    };
    resolutionNotes: {
        type: string;
        allowNull: boolean;
    };
    reportedAt: {
        type: string;
        allowNull: boolean;
        defaultValue: string;
    };
    resolvedAt: {
        type: string;
        allowNull: boolean;
    };
    escalatedAt: {
        type: string;
        allowNull: boolean;
    };
    metadata: {
        type: string;
        defaultValue: {};
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
    updatedAt: {
        type: string;
        allowNull: boolean;
    };
};
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
export declare const getDLPExemptionModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    type: {
        type: string;
        values: ExemptionType[];
        allowNull: boolean;
    };
    policyId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    ruleId: {
        type: string;
        allowNull: boolean;
    };
    targetIdentifier: {
        type: string;
        allowNull: boolean;
    };
    reason: {
        type: string;
        allowNull: boolean;
    };
    requestedBy: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    approvedBy: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    startDate: {
        type: string;
        allowNull: boolean;
    };
    endDate: {
        type: string;
        allowNull: boolean;
    };
    permanent: {
        type: string;
        defaultValue: boolean;
    };
    active: {
        type: string;
        defaultValue: boolean;
    };
    auditTrail: {
        type: string;
        defaultValue: never[];
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
    updatedAt: {
        type: string;
        allowNull: boolean;
    };
};
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
export declare const getDLPAuditLogModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    timestamp: {
        type: string;
        allowNull: boolean;
        defaultValue: string;
    };
    eventType: {
        type: string;
        allowNull: boolean;
    };
    userId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    messageId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    policyId: {
        type: string;
        allowNull: boolean;
    };
    ruleId: {
        type: string;
        allowNull: boolean;
    };
    incidentId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    action: {
        type: string;
        values: DLPAction[];
        allowNull: boolean;
    };
    details: {
        type: string;
        defaultValue: {};
    };
    ipAddress: {
        type: string;
        allowNull: boolean;
    };
    userAgent: {
        type: string;
        allowNull: boolean;
    };
    severity: {
        type: string;
        values: DLPSeverity[];
        allowNull: boolean;
    };
};
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
export declare const getUserTrainingRecordModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    userId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    trainingType: {
        type: string;
        allowNull: boolean;
    };
    completedAt: {
        type: string;
        allowNull: boolean;
    };
    score: {
        type: string;
        allowNull: boolean;
    };
    certificateUrl: {
        type: string;
        allowNull: boolean;
    };
    expiresAt: {
        type: string;
        allowNull: boolean;
    };
    violations: {
        type: string;
        defaultValue: never[];
    };
    warningsReceived: {
        type: string;
        defaultValue: number;
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
    updatedAt: {
        type: string;
        allowNull: boolean;
    };
};
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
export declare const getSensitiveDataPatterns: () => RegexPattern[];
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
export declare const validateSSN: (ssn: string) => boolean;
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
export declare const validateLuhn: (cardNumber: string) => boolean;
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
export declare const validateICD10Code: (code: string) => boolean;
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
export declare const validateEmail: (email: string) => boolean;
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
export declare const inspectContentForSensitiveData: (content: string, location: string, rules: DLPRule[]) => ContentInspectionResult;
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
export declare const scanMessageBody: (bodyText: string | undefined, bodyHtml: string | undefined, rules: DLPRule[]) => ContentInspectionResult;
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
export declare const scanMessageSubject: (subject: string, rules: DLPRule[]) => ContentInspectionResult;
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
export declare const scanAttachmentContent: (attachmentData: Buffer, filename: string, contentType: string, rules: DLPRule[]) => Promise<AttachmentScanResult>;
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
export declare const inspectFullMessage: (message: any, policies: DLPPolicy[]) => Promise<ContentInspectionResult>;
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
export declare const enforceDLPAction: (messageId: string, action: DLPAction, violations: PolicyViolation[]) => Promise<any>;
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
export declare const blockMessage: (messageId: string, violations: PolicyViolation[], timestamp: Date) => Promise<any>;
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
export declare const quarantineMessage: (messageId: string, violations: PolicyViolation[], timestamp: Date) => Promise<any>;
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
export declare const encryptMessage: (messageId: string, violations: PolicyViolation[], timestamp: Date) => Promise<any>;
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
export declare const sendDLPAlert: (messageId: string, violations: PolicyViolation[], timestamp: Date) => Promise<any>;
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
export declare const sendUserWarning: (messageId: string, violations: PolicyViolation[], timestamp: Date) => Promise<any>;
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
export declare const redactSensitiveData: (messageId: string, violations: PolicyViolation[], timestamp: Date) => Promise<any>;
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
export declare const requireJustification: (messageId: string, violations: PolicyViolation[], timestamp: Date) => Promise<any>;
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
export declare const requireApproval: (messageId: string, violations: PolicyViolation[], timestamp: Date) => Promise<any>;
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
export declare const createDLPIncident: (inspection: ContentInspectionResult, userId: string) => DLPIncident;
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
export declare const updateDLPIncident: (incidentId: string, status: DLPIncidentStatus, notes: string, updatedBy: string) => DLPIncident;
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
export declare const assignDLPIncident: (incidentId: string, assigneeId: string) => DLPIncident;
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
export declare const generateHIPAAComplianceReport: (startDate: Date, endDate: Date, generatedBy: string) => Promise<ComplianceReport>;
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
export declare const generateGDPRComplianceReport: (startDate: Date, endDate: Date, generatedBy: string) => Promise<ComplianceReport>;
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
export declare const generateSOC2ComplianceReport: (startDate: Date, endDate: Date, generatedBy: string) => Promise<ComplianceReport>;
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
export declare const getComplianceMetrics: (startDate: Date, endDate: Date) => Promise<ComplianceMetrics>;
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
export declare const createDLPExemption: (type: ExemptionType, targetIdentifier: string, reason: string, requestedBy: string, endDate?: Date) => DLPExemption;
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
export declare const checkDLPExemption: (identifier: string, policyId?: string) => Promise<boolean>;
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
export declare const revokeDLPExemption: (exemptionId: string, revokedBy: string, reason: string) => DLPExemption;
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
export declare const createDLPAuditLog: (eventType: string, details: any, severity: DLPSeverity, userId?: string) => DLPAuditLog;
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
export declare const queryDLPAuditLogs: (filters: any) => Promise<DLPAuditLog[]>;
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
export declare const maskSensitiveData: (data: string, dataType: SensitiveDataType) => string;
/**
 * Strips HTML tags from content.
 *
 * @param {string} html - HTML content
 * @returns {string} Plain text
 */
export declare const stripHtmlTags: (html: string) => string;
/**
 * Extracts text from attachment based on content type.
 *
 * @param {Buffer} data - Attachment data
 * @param {string} contentType - MIME type
 * @returns {Promise<string>} Extracted text
 */
export declare const extractTextFromAttachment: (data: Buffer, contentType: string) => Promise<string>;
/**
 * Calculates risk score based on findings.
 *
 * @param {SensitiveDataFinding[]} findings - Detected findings
 * @param {PolicyViolation[]} violations - Policy violations
 * @returns {number} Risk score 0-100
 */
export declare const calculateRiskScore: (findings: SensitiveDataFinding[], violations: PolicyViolation[]) => number;
/**
 * Determines recommended action based on violations.
 *
 * @param {PolicyViolation[]} violations - Policy violations
 * @returns {DLPAction} Recommended action
 */
export declare const determineRecommendedAction: (violations: PolicyViolation[]) => DLPAction;
/**
 * Assesses compliance status based on violations.
 *
 * @param {PolicyViolation[]} violations - Policy violations
 * @returns {ComplianceStatus} Compliance assessment
 */
export declare const assessComplianceStatus: (violations: PolicyViolation[]) => ComplianceStatus;
/**
 * Gets severity level for data type.
 *
 * @param {SensitiveDataType} dataType - Data type
 * @returns {DLPSeverity} Severity level
 */
export declare const getSeverityForDataType: (dataType: SensitiveDataType) => DLPSeverity;
/**
 * Gets validator function by name.
 *
 * @param {string} validatorName - Validator function name
 * @returns {Function} Validator function
 */
export declare const getValidator: (validatorName: string) => ((data: string) => boolean) | null;
/**
 * Determines incident severity from violations.
 *
 * @param {PolicyViolation[]} violations - Policy violations
 * @returns {DLPSeverity} Incident severity
 */
export declare const determineIncidentSeverity: (violations: PolicyViolation[]) => DLPSeverity;
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
export declare const getDLPSwaggerSchemas: () => SwaggerDLPSchema[];
/**
 * Gets Swagger API responses for DLP endpoints.
 *
 * @returns {any} Swagger response schemas
 */
export declare const getDLPSwaggerResponses: () => {
    200: {
        description: string;
        schema: {
            type: string;
            properties: {
                success: {
                    type: string;
                };
                data: {
                    type: string;
                };
            };
        };
    };
    403: {
        description: string;
        schema: {
            type: string;
            properties: {
                error: {
                    type: string;
                };
                violations: {
                    type: string;
                };
                action: {
                    type: string;
                };
            };
        };
    };
};
//# sourceMappingURL=mail-dlp-compliance-kit.d.ts.map