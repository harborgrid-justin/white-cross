/**
 * LOC: INCCONTAIN1234567
 * File: /reuse/threat/incident-containment-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize
 *   - crypto (Node.js built-in)
 *   - ./incident-response-kit (for incident integration)
 *
 * DOWNSTREAM (imported by):
 *   - Incident containment services
 *   - Security operations centers (SOC)
 *   - Automated response systems
 *   - Network security modules
 *   - System isolation services
 *   - Recovery coordination services
 */
/**
 * Containment action structure
 */
export interface ContainmentAction {
    id: string;
    incidentId: string;
    actionType: ContainmentActionType;
    status: ContainmentStatus;
    priority: ContainmentPriority;
    strategy: ContainmentStrategy;
    targetAssets: ContainmentTarget[];
    executedAt?: Date;
    completedAt?: Date;
    executedBy?: string;
    automated: boolean;
    reversible: boolean;
    impactAssessment: ImpactAssessment;
    validationResults?: ValidationResult[];
    rollbackPlan?: RollbackPlan;
    approvalRequired: boolean;
    approvedBy?: string;
    approvedAt?: Date;
    evidence: string[];
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Containment action types
 */
export declare enum ContainmentActionType {
    NETWORK_ISOLATION = "NETWORK_ISOLATION",
    SYSTEM_QUARANTINE = "SYSTEM_QUARANTINE",
    ACCOUNT_DISABLE = "ACCOUNT_DISABLE",
    PROCESS_TERMINATION = "PROCESS_TERMINATION",
    PORT_BLOCKING = "PORT_BLOCKING",
    FIREWALL_RULE = "FIREWALL_RULE",
    VLAN_SEGMENTATION = "VLAN_SEGMENTATION",
    DNS_SINKHOLE = "DNS_SINKHOLE",
    FILE_QUARANTINE = "FILE_QUARANTINE",
    SERVICE_SHUTDOWN = "SERVICE_SHUTDOWN",
    CREDENTIAL_REVOCATION = "CREDENTIAL_REVOCATION",
    SESSION_TERMINATION = "SESSION_TERMINATION",
    ENDPOINT_ISOLATION = "ENDPOINT_ISOLATION",
    DATABASE_LOCKDOWN = "DATABASE_LOCKDOWN",
    API_RATE_LIMITING = "API_RATE_LIMITING",
    TRAFFIC_REDIRECTION = "TRAFFIC_REDIRECTION"
}
/**
 * Containment status
 */
export declare enum ContainmentStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    EXECUTING = "EXECUTING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    ROLLED_BACK = "ROLLED_BACK",
    VALIDATED = "VALIDATED",
    PARTIALLY_COMPLETED = "PARTIALLY_COMPLETED"
}
/**
 * Containment priority
 */
export declare enum ContainmentPriority {
    IMMEDIATE = "IMMEDIATE",// Execute within minutes
    URGENT = "URGENT",// Execute within 1 hour
    HIGH = "HIGH",// Execute within 4 hours
    NORMAL = "NORMAL",// Execute within 24 hours
    LOW = "LOW"
}
/**
 * Containment strategy types
 */
export declare enum ContainmentStrategy {
    AGGRESSIVE = "AGGRESSIVE",// Maximum containment, may impact operations
    BALANCED = "BALANCED",// Balance security and business continuity
    CONSERVATIVE = "CONSERVATIVE",// Minimal disruption, targeted containment
    SURGICAL = "SURGICAL",// Precise, minimal scope containment
    DEFENSIVE = "DEFENSIVE"
}
/**
 * Containment target
 */
export interface ContainmentTarget {
    id: string;
    type: TargetType;
    identifier: string;
    name: string;
    location?: string;
    criticality: 'critical' | 'high' | 'medium' | 'low';
    currentState: string;
    targetState: string;
    dependencies?: string[];
    businessImpact?: string;
}
/**
 * Target types for containment
 */
export declare enum TargetType {
    HOST = "HOST",
    NETWORK_SEGMENT = "NETWORK_SEGMENT",
    USER_ACCOUNT = "USER_ACCOUNT",
    SERVICE_ACCOUNT = "SERVICE_ACCOUNT",
    APPLICATION = "APPLICATION",
    DATABASE = "DATABASE",
    FILE_SYSTEM = "FILE_SYSTEM",
    NETWORK_DEVICE = "NETWORK_DEVICE",
    CLOUD_RESOURCE = "CLOUD_RESOURCE",
    CONTAINER = "CONTAINER",
    VIRTUAL_MACHINE = "VIRTUAL_MACHINE",
    MEDICAL_DEVICE = "MEDICAL_DEVICE"
}
/**
 * Impact assessment for containment
 */
export interface ImpactAssessment {
    businessContinuity: ImpactLevel;
    patientCare: ImpactLevel;
    dataAvailability: ImpactLevel;
    systemPerformance: ImpactLevel;
    userAccess: ImpactLevel;
    estimatedDowntime?: number;
    affectedUsers?: number;
    affectedSystems?: number;
    mitigationPlan?: string;
    riskVsBenefit: string;
}
/**
 * Impact levels
 */
export declare enum ImpactLevel {
    NONE = "NONE",
    MINIMAL = "MINIMAL",
    LOW = "LOW",
    MODERATE = "MODERATE",
    HIGH = "HIGH",
    CRITICAL = "CRITICAL"
}
/**
 * Validation result
 */
export interface ValidationResult {
    id: string;
    validationType: ValidationType;
    timestamp: Date;
    status: 'passed' | 'failed' | 'warning';
    details: string;
    metrics?: Record<string, any>;
    recommendations?: string[];
}
/**
 * Validation types
 */
export declare enum ValidationType {
    ISOLATION_VERIFICATION = "ISOLATION_VERIFICATION",
    LATERAL_MOVEMENT_CHECK = "LATERAL_MOVEMENT_CHECK",
    NETWORK_CONNECTIVITY_TEST = "NETWORK_CONNECTIVITY_TEST",
    SERVICE_AVAILABILITY_CHECK = "SERVICE_AVAILABILITY_CHECK",
    SECURITY_POSTURE_VALIDATION = "SECURITY_POSTURE_VALIDATION",
    CONTAINMENT_EFFECTIVENESS = "CONTAINMENT_EFFECTIVENESS",
    BUSINESS_CONTINUITY_TEST = "BUSINESS_CONTINUITY_TEST"
}
/**
 * Rollback plan
 */
export interface RollbackPlan {
    id: string;
    steps: RollbackStep[];
    estimatedDuration: number;
    triggers: RollbackTrigger[];
    automated: boolean;
    approvalRequired: boolean;
}
/**
 * Rollback step
 */
export interface RollbackStep {
    sequence: number;
    action: string;
    commands?: string[];
    expectedResult: string;
    validationCheck?: string;
    rollbackOnFailure: boolean;
}
/**
 * Rollback trigger conditions
 */
export declare enum RollbackTrigger {
    VALIDATION_FAILURE = "VALIDATION_FAILURE",
    BUSINESS_IMPACT_EXCEEDED = "BUSINESS_IMPACT_EXCEEDED",
    MANUAL_REQUEST = "MANUAL_REQUEST",
    TIMEOUT_EXCEEDED = "TIMEOUT_EXCEEDED",
    CRITICAL_SERVICE_DOWN = "CRITICAL_SERVICE_DOWN",
    PATIENT_SAFETY_CONCERN = "PATIENT_SAFETY_CONCERN"
}
/**
 * Isolation procedure
 */
export interface IsolationProcedure {
    id: string;
    name: string;
    description: string;
    targetType: TargetType;
    isolationType: IsolationType;
    automationLevel: AutomationLevel;
    steps: IsolationStep[];
    prerequisites: string[];
    postConditions: string[];
    estimatedDuration: number;
    requiredPermissions: string[];
    approvalWorkflow?: string;
    tags: string[];
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Isolation types
 */
export declare enum IsolationType {
    FULL_NETWORK_ISOLATION = "FULL_NETWORK_ISOLATION",
    PARTIAL_NETWORK_ISOLATION = "PARTIAL_NETWORK_ISOLATION",
    LOGICAL_ISOLATION = "LOGICAL_ISOLATION",
    PHYSICAL_ISOLATION = "PHYSICAL_ISOLATION",
    VLAN_ISOLATION = "VLAN_ISOLATION",
    FIREWALL_ISOLATION = "FIREWALL_ISOLATION",
    APPLICATION_ISOLATION = "APPLICATION_ISOLATION"
}
/**
 * Automation levels
 */
export declare enum AutomationLevel {
    FULLY_AUTOMATED = "FULLY_AUTOMATED",
    SEMI_AUTOMATED = "SEMI_AUTOMATED",
    MANUAL = "MANUAL",
    APPROVAL_REQUIRED = "APPROVAL_REQUIRED"
}
/**
 * Isolation step
 */
export interface IsolationStep {
    sequence: number;
    action: string;
    command?: string;
    parameters?: Record<string, any>;
    timeout: number;
    retryOnFailure: boolean;
    maxRetries?: number;
    validationCheck?: string;
    rollbackCommand?: string;
}
/**
 * Quarantine record
 */
export interface QuarantineRecord {
    id: string;
    incidentId: string;
    targetId: string;
    targetType: TargetType;
    quarantineStatus: QuarantineStatus;
    quarantineLocation?: string;
    quarantinedAt: Date;
    quarantinedBy: string;
    releaseAuthorization?: string;
    releasedAt?: Date;
    duration?: number;
    reason: string;
    forensicAnalysisCompleted: boolean;
    evidenceCollected: string[];
    safeToRelease: boolean;
    releaseConditions?: string[];
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Quarantine status
 */
export declare enum QuarantineStatus {
    ACTIVE = "ACTIVE",
    RELEASED = "RELEASED",
    EXPIRED = "EXPIRED",
    UNDER_ANALYSIS = "UNDER_ANALYSIS",
    PENDING_APPROVAL = "PENDING_APPROVAL",
    PERMANENT = "PERMANENT"
}
/**
 * Eradication task
 */
export interface EradicationTask {
    id: string;
    incidentId: string;
    containmentActionId?: string;
    taskType: EradicationType;
    status: EradicationStatus;
    priority: ContainmentPriority;
    targetSystems: string[];
    threatIndicators: string[];
    scheduledAt?: Date;
    startedAt?: Date;
    completedAt?: Date;
    assignedTo?: string;
    verificationRequired: boolean;
    verificationStatus?: 'pending' | 'passed' | 'failed';
    remediationSteps: RemediationStep[];
    successCriteria: string[];
    rollbackAvailable: boolean;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Eradication types
 */
export declare enum EradicationType {
    MALWARE_REMOVAL = "MALWARE_REMOVAL",
    ROOTKIT_REMOVAL = "ROOTKIT_REMOVAL",
    BACKDOOR_REMOVAL = "BACKDOOR_REMOVAL",
    UNAUTHORIZED_ACCESS_REMOVAL = "UNAUTHORIZED_ACCESS_REMOVAL",
    PERSISTENCE_MECHANISM_REMOVAL = "PERSISTENCE_MECHANISM_REMOVAL",
    CONFIGURATION_RESTORATION = "CONFIGURATION_RESTORATION",
    PATCH_APPLICATION = "PATCH_APPLICATION",
    CREDENTIAL_RESET = "CREDENTIAL_RESET",
    SYSTEM_REBUILD = "SYSTEM_REBUILD",
    DATA_SANITIZATION = "DATA_SANITIZATION"
}
/**
 * Eradication status
 */
export declare enum EradicationStatus {
    PLANNED = "PLANNED",
    SCHEDULED = "SCHEDULED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    PARTIALLY_COMPLETED = "PARTIALLY_COMPLETED",
    VERIFICATION_PENDING = "VERIFICATION_PENDING",
    VERIFIED = "VERIFIED"
}
/**
 * Remediation step
 */
export interface RemediationStep {
    sequence: number;
    description: string;
    automated: boolean;
    command?: string;
    expectedOutcome: string;
    validationCheck?: string;
    estimatedDuration: number;
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
}
/**
 * Lateral movement indicator
 */
export interface LateralMovementIndicator {
    id: string;
    incidentId: string;
    detectedAt: Date;
    sourceAsset: string;
    targetAsset: string;
    movementType: LateralMovementType;
    technique: string;
    confidence: number;
    blocked: boolean;
    preventionActions: string[];
    evidence: string[];
    metadata?: Record<string, any>;
}
/**
 * Lateral movement types
 */
export declare enum LateralMovementType {
    SMB_LATERAL_MOVEMENT = "SMB_LATERAL_MOVEMENT",
    RDP_LATERAL_MOVEMENT = "RDP_LATERAL_MOVEMENT",
    WMI_LATERAL_MOVEMENT = "WMI_LATERAL_MOVEMENT",
    PSEXEC_LATERAL_MOVEMENT = "PSEXEC_LATERAL_MOVEMENT",
    SSH_LATERAL_MOVEMENT = "SSH_LATERAL_MOVEMENT",
    PASS_THE_HASH = "PASS_THE_HASH",
    PASS_THE_TICKET = "PASS_THE_TICKET",
    TOKEN_IMPERSONATION = "TOKEN_IMPERSONATION",
    CREDENTIAL_DUMPING = "CREDENTIAL_DUMPING"
}
/**
 * Network segmentation rule
 */
export interface NetworkSegmentationRule {
    id: string;
    name: string;
    description: string;
    ruleType: SegmentationRuleType;
    sourceSegment?: string;
    destinationSegment?: string;
    protocol?: string;
    ports?: number[];
    action: 'allow' | 'deny' | 'log';
    priority: number;
    enabled: boolean;
    temporary: boolean;
    expiresAt?: Date;
    incidentId?: string;
    appliedAt?: Date;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Segmentation rule types
 */
export declare enum SegmentationRuleType {
    FIREWALL_RULE = "FIREWALL_RULE",
    ACL_RULE = "ACL_RULE",
    VLAN_RULE = "VLAN_RULE",
    MICRO_SEGMENTATION = "MICRO_SEGMENTATION",
    ZONE_ISOLATION = "ZONE_ISOLATION"
}
/**
 * Recovery coordination plan
 */
export interface RecoveryCoordinationPlan {
    id: string;
    incidentId: string;
    status: RecoveryStatus;
    phases: RecoveryPhase[];
    criticalServices: CriticalService[];
    recoveryTimeObjective: number;
    recoveryPointObjective: number;
    coordinators: string[];
    stakeholders: string[];
    communicationPlan: CommunicationPlan;
    startedAt?: Date;
    completedAt?: Date;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Recovery status
 */
export declare enum RecoveryStatus {
    PLANNING = "PLANNING",
    READY = "READY",
    IN_PROGRESS = "IN_PROGRESS",
    TESTING = "TESTING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    PAUSED = "PAUSED"
}
/**
 * Recovery phase
 */
export interface RecoveryPhase {
    sequence: number;
    name: string;
    description: string;
    tasks: RecoveryTask[];
    dependencies?: number[];
    estimatedDuration: number;
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    startedAt?: Date;
    completedAt?: Date;
}
/**
 * Recovery task
 */
export interface RecoveryTask {
    id: string;
    description: string;
    assignedTo?: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
    estimatedDuration: number;
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    validationRequired: boolean;
}
/**
 * Critical service
 */
export interface CriticalService {
    id: string;
    name: string;
    description: string;
    criticality: 'tier1' | 'tier2' | 'tier3';
    currentStatus: 'operational' | 'degraded' | 'offline';
    targetStatus: 'operational';
    dependencies?: string[];
    recoveryOrder: number;
    healthCheckUrl?: string;
}
/**
 * Communication plan
 */
export interface CommunicationPlan {
    channels: CommunicationChannel[];
    updateFrequency: number;
    stakeholderGroups: StakeholderGroup[];
    escalationPath: string[];
    templateId?: string;
}
/**
 * Communication channel
 */
export interface CommunicationChannel {
    type: 'email' | 'sms' | 'phone' | 'slack' | 'teams' | 'pager';
    identifier: string;
    priority: number;
}
/**
 * Stakeholder group
 */
export interface StakeholderGroup {
    name: string;
    members: string[];
    notificationLevel: 'all' | 'major' | 'critical';
}
/**
 * Sequelize ContainmentAction model attributes.
 *
 * @example
 * ```typescript
 * class ContainmentAction extends Model {}
 * ContainmentAction.init(getContainmentActionModelAttributes(), {
 *   sequelize,
 *   tableName: 'containment_actions',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['incidentId'] },
 *     { fields: ['status', 'priority'] },
 *     { fields: ['executedAt'] }
 *   ]
 * });
 *
 * // Define associations
 * ContainmentAction.belongsTo(Incident, { foreignKey: 'incidentId', as: 'incident' });
 * ContainmentAction.hasMany(ValidationResult, { foreignKey: 'containmentActionId', as: 'validations' });
 * ```
 */
export declare const getContainmentActionModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    incidentId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
        onDelete: string;
    };
    actionType: {
        type: string;
        allowNull: boolean;
    };
    status: {
        type: string;
        allowNull: boolean;
        defaultValue: string;
    };
    priority: {
        type: string;
        allowNull: boolean;
    };
    strategy: {
        type: string;
        allowNull: boolean;
    };
    targetAssets: {
        type: string;
        defaultValue: never[];
    };
    executedAt: {
        type: string;
        allowNull: boolean;
    };
    completedAt: {
        type: string;
        allowNull: boolean;
    };
    executedBy: {
        type: string;
        allowNull: boolean;
    };
    automated: {
        type: string;
        defaultValue: boolean;
    };
    reversible: {
        type: string;
        defaultValue: boolean;
    };
    impactAssessment: {
        type: string;
        allowNull: boolean;
    };
    validationResults: {
        type: string;
        defaultValue: never[];
    };
    rollbackPlan: {
        type: string;
        allowNull: boolean;
    };
    approvalRequired: {
        type: string;
        defaultValue: boolean;
    };
    approvedBy: {
        type: string;
        allowNull: boolean;
    };
    approvedAt: {
        type: string;
        allowNull: boolean;
    };
    evidence: {
        type: string;
        defaultValue: never[];
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
 * Sequelize IsolationProcedure model attributes.
 *
 * @example
 * ```typescript
 * class IsolationProcedure extends Model {}
 * IsolationProcedure.init(getIsolationProcedureModelAttributes(), {
 *   sequelize,
 *   tableName: 'isolation_procedures',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['targetType'] },
 *     { fields: ['automationLevel'] }
 *   ]
 * });
 *
 * // Many-to-Many association with ContainmentAction
 * IsolationProcedure.belongsToMany(ContainmentAction, {
 *   through: 'containment_action_procedures',
 *   foreignKey: 'procedureId',
 *   otherKey: 'containmentActionId',
 *   as: 'containmentActions'
 * });
 * ```
 */
export declare const getIsolationProcedureModelAttributes: () => {
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
    targetType: {
        type: string;
        allowNull: boolean;
    };
    isolationType: {
        type: string;
        allowNull: boolean;
    };
    automationLevel: {
        type: string;
        allowNull: boolean;
    };
    steps: {
        type: string;
        defaultValue: never[];
    };
    prerequisites: {
        type: string;
        defaultValue: never[];
    };
    postConditions: {
        type: string;
        defaultValue: never[];
    };
    estimatedDuration: {
        type: string;
        allowNull: boolean;
    };
    requiredPermissions: {
        type: string;
        defaultValue: never[];
    };
    approvalWorkflow: {
        type: string;
        allowNull: boolean;
    };
    tags: {
        type: string;
        defaultValue: never[];
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
 * Sequelize QuarantineRecord model attributes.
 *
 * @example
 * ```typescript
 * class QuarantineRecord extends Model {}
 * QuarantineRecord.init(getQuarantineRecordModelAttributes(), {
 *   sequelize,
 *   tableName: 'quarantine_records',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['incidentId'] },
 *     { fields: ['quarantineStatus'] },
 *     { fields: ['quarantinedAt'] },
 *     { fields: ['targetId', 'targetType'] }
 *   ]
 * });
 *
 * // Define associations
 * QuarantineRecord.belongsTo(Incident, { foreignKey: 'incidentId', as: 'incident' });
 * QuarantineRecord.hasMany(Evidence, { foreignKey: 'quarantineRecordId', as: 'evidence' });
 * ```
 */
export declare const getQuarantineRecordModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    incidentId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
        onDelete: string;
    };
    targetId: {
        type: string;
        allowNull: boolean;
    };
    targetType: {
        type: string;
        allowNull: boolean;
    };
    quarantineStatus: {
        type: string;
        allowNull: boolean;
        defaultValue: string;
    };
    quarantineLocation: {
        type: string;
        allowNull: boolean;
    };
    quarantinedAt: {
        type: string;
        allowNull: boolean;
    };
    quarantinedBy: {
        type: string;
        allowNull: boolean;
    };
    releaseAuthorization: {
        type: string;
        allowNull: boolean;
    };
    releasedAt: {
        type: string;
        allowNull: boolean;
    };
    duration: {
        type: string;
        allowNull: boolean;
    };
    reason: {
        type: string;
        allowNull: boolean;
    };
    forensicAnalysisCompleted: {
        type: string;
        defaultValue: boolean;
    };
    evidenceCollected: {
        type: string;
        defaultValue: never[];
    };
    safeToRelease: {
        type: string;
        defaultValue: boolean;
    };
    releaseConditions: {
        type: string;
        defaultValue: never[];
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
 * Sequelize EradicationTask model attributes.
 *
 * @example
 * ```typescript
 * class EradicationTask extends Model {}
 * EradicationTask.init(getEradicationTaskModelAttributes(), {
 *   sequelize,
 *   tableName: 'eradication_tasks',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['incidentId'] },
 *     { fields: ['status', 'priority'] },
 *     { fields: ['scheduledAt'] }
 *   ]
 * });
 *
 * // Define associations
 * EradicationTask.belongsTo(Incident, { foreignKey: 'incidentId', as: 'incident' });
 * EradicationTask.belongsTo(ContainmentAction, { foreignKey: 'containmentActionId', as: 'containmentAction' });
 * ```
 */
export declare const getEradicationTaskModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    incidentId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
        onDelete: string;
    };
    containmentActionId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
        onDelete: string;
    };
    taskType: {
        type: string;
        allowNull: boolean;
    };
    status: {
        type: string;
        allowNull: boolean;
        defaultValue: string;
    };
    priority: {
        type: string;
        allowNull: boolean;
    };
    targetSystems: {
        type: string;
        defaultValue: never[];
    };
    threatIndicators: {
        type: string;
        defaultValue: never[];
    };
    scheduledAt: {
        type: string;
        allowNull: boolean;
    };
    startedAt: {
        type: string;
        allowNull: boolean;
    };
    completedAt: {
        type: string;
        allowNull: boolean;
    };
    assignedTo: {
        type: string;
        allowNull: boolean;
    };
    verificationRequired: {
        type: string;
        defaultValue: boolean;
    };
    verificationStatus: {
        type: string;
        allowNull: boolean;
    };
    remediationSteps: {
        type: string;
        defaultValue: never[];
    };
    successCriteria: {
        type: string;
        defaultValue: never[];
    };
    rollbackAvailable: {
        type: string;
        defaultValue: boolean;
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
 * Sequelize NetworkSegmentationRule model attributes.
 *
 * @example
 * ```typescript
 * class NetworkSegmentationRule extends Model {}
 * NetworkSegmentationRule.init(getNetworkSegmentationRuleModelAttributes(), {
 *   sequelize,
 *   tableName: 'network_segmentation_rules',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['incidentId'] },
 *     { fields: ['enabled', 'priority'] },
 *     { fields: ['expiresAt'] }
 *   ]
 * });
 *
 * // Self-referencing for rule dependencies
 * NetworkSegmentationRule.hasMany(NetworkSegmentationRule, {
 *   foreignKey: 'parentRuleId',
 *   as: 'childRules'
 * });
 * NetworkSegmentationRule.belongsTo(NetworkSegmentationRule, {
 *   foreignKey: 'parentRuleId',
 *   as: 'parentRule'
 * });
 * ```
 */
export declare const getNetworkSegmentationRuleModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    name: {
        type: string;
        allowNull: boolean;
    };
    description: {
        type: string;
        allowNull: boolean;
    };
    ruleType: {
        type: string;
        allowNull: boolean;
    };
    sourceSegment: {
        type: string;
        allowNull: boolean;
    };
    destinationSegment: {
        type: string;
        allowNull: boolean;
    };
    protocol: {
        type: string;
        allowNull: boolean;
    };
    ports: {
        type: string;
        defaultValue: never[];
    };
    action: {
        type: string;
        allowNull: boolean;
    };
    priority: {
        type: string;
        allowNull: boolean;
    };
    enabled: {
        type: string;
        defaultValue: boolean;
    };
    temporary: {
        type: string;
        defaultValue: boolean;
    };
    expiresAt: {
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
        onDelete: string;
    };
    appliedAt: {
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
 * Sequelize RecoveryCoordinationPlan model attributes.
 *
 * @example
 * ```typescript
 * class RecoveryCoordinationPlan extends Model {}
 * RecoveryCoordinationPlan.init(getRecoveryCoordinationPlanModelAttributes(), {
 *   sequelize,
 *   tableName: 'recovery_coordination_plans',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['incidentId'] },
 *     { fields: ['status'] }
 *   ]
 * });
 *
 * // Define associations
 * RecoveryCoordinationPlan.belongsTo(Incident, { foreignKey: 'incidentId', as: 'incident' });
 * RecoveryCoordinationPlan.hasMany(RecoveryPhaseExecution, { foreignKey: 'planId', as: 'phaseExecutions' });
 * ```
 */
export declare const getRecoveryCoordinationPlanModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    incidentId: {
        type: string;
        allowNull: boolean;
        unique: boolean;
        references: {
            model: string;
            key: string;
        };
        onDelete: string;
    };
    status: {
        type: string;
        allowNull: boolean;
        defaultValue: string;
    };
    phases: {
        type: string;
        defaultValue: never[];
    };
    criticalServices: {
        type: string;
        defaultValue: never[];
    };
    recoveryTimeObjective: {
        type: string;
        allowNull: boolean;
    };
    recoveryPointObjective: {
        type: string;
        allowNull: boolean;
    };
    coordinators: {
        type: string;
        defaultValue: never[];
    };
    stakeholders: {
        type: string;
        defaultValue: never[];
    };
    communicationPlan: {
        type: string;
        allowNull: boolean;
    };
    startedAt: {
        type: string;
        allowNull: boolean;
    };
    completedAt: {
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
 * Isolates a compromised host from the network
 *
 * @param target - The target system to isolate
 * @param incidentId - Associated incident ID
 * @param strategy - Containment strategy to use
 * @returns Created containment action
 *
 * @example
 * ```typescript
 * const action = await isolateCompromisedHost(
 *   {
 *     id: 'host-123',
 *     type: TargetType.HOST,
 *     identifier: '192.168.1.100',
 *     name: 'web-server-01',
 *     criticality: 'high',
 *     currentState: 'compromised',
 *     targetState: 'isolated'
 *   },
 *   'incident-456',
 *   ContainmentStrategy.BALANCED
 * );
 * ```
 */
export declare function isolateCompromisedHost(target: ContainmentTarget, incidentId: string, strategy: ContainmentStrategy): Promise<ContainmentAction>;
/**
 * Implements network segmentation to prevent lateral movement
 *
 * @param sourceSegment - Source network segment
 * @param destinationSegment - Destination network segment
 * @param incidentId - Associated incident ID
 * @returns Created segmentation rule
 *
 * @example
 * ```typescript
 * const rule = await implementNetworkSegmentation(
 *   'vlan-100-infected',
 *   'vlan-200-critical',
 *   'incident-789'
 * );
 * ```
 */
export declare function implementNetworkSegmentation(sourceSegment: string, destinationSegment: string, incidentId: string): Promise<NetworkSegmentationRule>;
/**
 * Quarantines a suspicious file or system
 *
 * @param targetId - ID of the target to quarantine
 * @param targetType - Type of target
 * @param incidentId - Associated incident ID
 * @param reason - Reason for quarantine
 * @param userId - ID of user initiating quarantine
 * @returns Created quarantine record
 *
 * @example
 * ```typescript
 * const quarantine = await quarantineSuspiciousEntity(
 *   'file-abc123',
 *   TargetType.FILE_SYSTEM,
 *   'incident-456',
 *   'Malware detected by EDR',
 *   'user-789'
 * );
 * ```
 */
export declare function quarantineSuspiciousEntity(targetId: string, targetType: TargetType, incidentId: string, reason: string, userId: string): Promise<QuarantineRecord>;
/**
 * Disables compromised user accounts
 *
 * @param accountIds - Array of account IDs to disable
 * @param incidentId - Associated incident ID
 * @param preserveData - Whether to preserve account data
 * @returns Containment action
 *
 * @example
 * ```typescript
 * const action = await disableCompromisedAccounts(
 *   ['user-123', 'user-456'],
 *   'incident-789',
 *   true
 * );
 * ```
 */
export declare function disableCompromisedAccounts(accountIds: string[], incidentId: string, preserveData?: boolean): Promise<ContainmentAction>;
/**
 * Executes a containment action with validation
 *
 * @param action - Containment action to execute
 * @param userId - ID of user executing the action
 * @returns Updated containment action
 *
 * @example
 * ```typescript
 * const result = await executeContainmentAction(action, 'user-123');
 * ```
 */
export declare function executeContainmentAction(action: ContainmentAction, userId: string): Promise<ContainmentAction>;
/**
 * Validates containment effectiveness
 *
 * @param action - Containment action to validate
 * @returns Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateContainmentEffectiveness(action);
 * ```
 */
export declare function validateContainmentEffectiveness(action: ContainmentAction): Promise<ValidationResult>;
/**
 * Rolls back a containment action
 *
 * @param action - Containment action to rollback
 * @param reason - Reason for rollback
 * @returns Updated containment action
 *
 * @example
 * ```typescript
 * const rolledBack = await rollbackContainmentAction(action, 'Business impact too high');
 * ```
 */
export declare function rollbackContainmentAction(action: ContainmentAction, reason: string): Promise<ContainmentAction>;
/**
 * Approves a containment action
 *
 * @param actionId - ID of action to approve
 * @param userId - ID of approving user
 * @returns Updated containment action
 *
 * @example
 * ```typescript
 * const approved = await approveContainmentAction('action-123', 'admin-456');
 * ```
 */
export declare function approveContainmentAction(actionId: string, userId: string): Promise<ContainmentAction>;
/**
 * Assesses the impact of isolation on business operations
 *
 * @param target - Target to assess
 * @param strategy - Containment strategy
 * @returns Impact assessment
 *
 * @example
 * ```typescript
 * const impact = await assessIsolationImpact(target, ContainmentStrategy.BALANCED);
 * ```
 */
export declare function assessIsolationImpact(target: ContainmentTarget, strategy: ContainmentStrategy): Promise<ImpactAssessment>;
/**
 * Detects lateral movement attempts
 *
 * @param incidentId - Associated incident ID
 * @param timeWindow - Time window to analyze (minutes)
 * @returns Array of detected lateral movement indicators
 *
 * @example
 * ```typescript
 * const movements = await detectLateralMovement('incident-123', 60);
 * ```
 */
export declare function detectLateralMovement(incidentId: string, timeWindow: number): Promise<LateralMovementIndicator[]>;
/**
 * Blocks lateral movement between network segments
 *
 * @param sourceAsset - Source asset ID
 * @param targetAsset - Target asset ID
 * @param incidentId - Associated incident ID
 * @returns Created segmentation rule
 *
 * @example
 * ```typescript
 * const rule = await blockLateralMovement('host-123', 'host-456', 'incident-789');
 * ```
 */
export declare function blockLateralMovement(sourceAsset: string, targetAsset: string, incidentId: string): Promise<NetworkSegmentationRule>;
/**
 * Monitors for credential abuse across systems
 *
 * @param accountId - Account ID to monitor
 * @param incidentId - Associated incident ID
 * @returns Monitoring configuration
 *
 * @example
 * ```typescript
 * const config = await monitorCredentialAbuse('user-123', 'incident-456');
 * ```
 */
export declare function monitorCredentialAbuse(accountId: string, incidentId: string): Promise<Record<string, any>>;
/**
 * Restricts privileged access during incident
 *
 * @param incidentId - Associated incident ID
 * @param exemptAccounts - Accounts exempt from restriction
 * @returns Restriction policy
 *
 * @example
 * ```typescript
 * const policy = await restrictPrivilegedAccess('incident-123', ['admin-456']);
 * ```
 */
export declare function restrictPrivilegedAccess(incidentId: string, exemptAccounts?: string[]): Promise<Record<string, any>>;
/**
 * Implements micro-segmentation for critical assets
 *
 * @param assetIds - Array of critical asset IDs
 * @param incidentId - Associated incident ID
 * @returns Array of segmentation rules
 *
 * @example
 * ```typescript
 * const rules = await implementMicroSegmentation(['asset-1', 'asset-2'], 'incident-123');
 * ```
 */
export declare function implementMicroSegmentation(assetIds: string[], incidentId: string): Promise<NetworkSegmentationRule[]>;
/**
 * Initiates automated quarantine workflow
 *
 * @param targetId - Target system ID
 * @param targetType - Type of target
 * @param incidentId - Associated incident ID
 * @param automationLevel - Level of automation
 * @returns Quarantine record
 *
 * @example
 * ```typescript
 * const quarantine = await initiateQuarantineWorkflow(
 *   'host-123',
 *   TargetType.HOST,
 *   'incident-456',
 *   AutomationLevel.SEMI_AUTOMATED
 * );
 * ```
 */
export declare function initiateQuarantineWorkflow(targetId: string, targetType: TargetType, incidentId: string, automationLevel: AutomationLevel): Promise<QuarantineRecord>;
/**
 * Releases a system from quarantine
 *
 * @param quarantineId - Quarantine record ID
 * @param userId - ID of user authorizing release
 * @param validationResults - Validation results
 * @returns Updated quarantine record
 *
 * @example
 * ```typescript
 * const released = await releaseFromQuarantine('quarantine-123', 'admin-456', validations);
 * ```
 */
export declare function releaseFromQuarantine(quarantineId: string, userId: string, validationResults: ValidationResult[]): Promise<QuarantineRecord>;
/**
 * Extends quarantine duration
 *
 * @param quarantineId - Quarantine record ID
 * @param additionalDuration - Additional duration in minutes
 * @param reason - Reason for extension
 * @returns Updated quarantine record
 *
 * @example
 * ```typescript
 * const extended = await extendQuarantineDuration('quarantine-123', 120, 'Additional analysis required');
 * ```
 */
export declare function extendQuarantineDuration(quarantineId: string, additionalDuration: number, reason: string): Promise<QuarantineRecord>;
/**
 * Performs quarantine health checks
 *
 * @param quarantineId - Quarantine record ID
 * @returns Health check results
 *
 * @example
 * ```typescript
 * const health = await performQuarantineHealthCheck('quarantine-123');
 * ```
 */
export declare function performQuarantineHealthCheck(quarantineId: string): Promise<ValidationResult[]>;
/**
 * Verifies network isolation effectiveness
 *
 * @param targets - Targets to verify
 * @returns Verification results
 *
 * @example
 * ```typescript
 * const results = await verifyNetworkIsolation(targets);
 * ```
 */
export declare function verifyNetworkIsolation(targets: ContainmentTarget[]): Promise<{
    verified: boolean;
    blockedCount: number;
    details: any[];
}>;
/**
 * Tests containment boundary integrity
 *
 * @param incidentId - Associated incident ID
 * @returns Boundary test results
 *
 * @example
 * ```typescript
 * const results = await testContainmentBoundary('incident-123');
 * ```
 */
export declare function testContainmentBoundary(incidentId: string): Promise<ValidationResult>;
/**
 * Validates service continuity during containment
 *
 * @param criticalServices - Array of critical service IDs
 * @returns Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateServiceContinuity(['ehr-system', 'patient-portal']);
 * ```
 */
export declare function validateServiceContinuity(criticalServices: string[]): Promise<ValidationResult>;
/**
 * Monitors containment metrics in real-time
 *
 * @param incidentId - Associated incident ID
 * @returns Real-time metrics
 *
 * @example
 * ```typescript
 * const metrics = await monitorContainmentMetrics('incident-123');
 * ```
 */
export declare function monitorContainmentMetrics(incidentId: string): Promise<Record<string, any>>;
/**
 * Generates containment effectiveness report
 *
 * @param incidentId - Associated incident ID
 * @param timeRange - Time range for report
 * @returns Effectiveness report
 *
 * @example
 * ```typescript
 * const report = await generateContainmentReport('incident-123', { start: startDate, end: endDate });
 * ```
 */
export declare function generateContainmentReport(incidentId: string, timeRange: {
    start: Date;
    end: Date;
}): Promise<Record<string, any>>;
/**
 * Creates eradication task plan
 *
 * @param incidentId - Associated incident ID
 * @param threatIndicators - IOCs to eradicate
 * @param targetSystems - Systems to clean
 * @returns Created eradication task
 *
 * @example
 * ```typescript
 * const task = await createEradicationTask(
 *   'incident-123',
 *   ['malware-hash-abc', 'c2-domain.com'],
 *   ['host-1', 'host-2']
 * );
 * ```
 */
export declare function createEradicationTask(incidentId: string, threatIndicators: string[], targetSystems: string[]): Promise<EradicationTask>;
/**
 * Executes eradication task
 *
 * @param taskId - Eradication task ID
 * @param userId - ID of user executing task
 * @returns Updated eradication task
 *
 * @example
 * ```typescript
 * const result = await executeEradicationTask('task-123', 'user-456');
 * ```
 */
export declare function executeEradicationTask(taskId: string, userId: string): Promise<EradicationTask>;
/**
 * Verifies eradication success
 *
 * @param taskId - Eradication task ID
 * @returns Verification result
 *
 * @example
 * ```typescript
 * const verification = await verifyEradicationSuccess('task-123');
 * ```
 */
export declare function verifyEradicationSuccess(taskId: string): Promise<ValidationResult>;
/**
 * Schedules eradication maintenance window
 *
 * @param taskId - Eradication task ID
 * @param scheduledTime - Scheduled execution time
 * @returns Updated task
 *
 * @example
 * ```typescript
 * const scheduled = await scheduleEradicationWindow('task-123', futureDate);
 * ```
 */
export declare function scheduleEradicationWindow(taskId: string, scheduledTime: Date): Promise<EradicationTask>;
/**
 * Preserves evidence during containment
 *
 * @param containmentActionId - Containment action ID
 * @param evidenceType - Type of evidence to preserve
 * @returns Evidence IDs
 *
 * @example
 * ```typescript
 * const evidenceIds = await preserveContainmentEvidence('action-123', 'network_logs');
 * ```
 */
export declare function preserveContainmentEvidence(containmentActionId: string, evidenceType: string): Promise<string[]>;
/**
 * Captures system state snapshot
 *
 * @param targetId - Target system ID
 * @param incidentId - Associated incident ID
 * @returns Snapshot ID
 *
 * @example
 * ```typescript
 * const snapshotId = await captureSystemSnapshot('host-123', 'incident-456');
 * ```
 */
export declare function captureSystemSnapshot(targetId: string, incidentId: string): Promise<string>;
/**
 * Maintains chain of custody for containment evidence
 *
 * @param evidenceId - Evidence ID
 * @param action - Custody action
 * @param userId - User performing action
 * @returns Updated custody record
 *
 * @example
 * ```typescript
 * const custody = await maintainEvidenceCustody('evidence-123', 'transfer', 'user-456');
 * ```
 */
export declare function maintainEvidenceCustody(evidenceId: string, action: string, userId: string): Promise<Record<string, any>>;
/**
 * Creates recovery coordination plan
 *
 * @param incidentId - Associated incident ID
 * @param rto - Recovery Time Objective in minutes
 * @param rpo - Recovery Point Objective in minutes
 * @returns Created recovery plan
 *
 * @example
 * ```typescript
 * const plan = await createRecoveryPlan('incident-123', 240, 60);
 * ```
 */
export declare function createRecoveryPlan(incidentId: string, rto: number, rpo: number): Promise<RecoveryCoordinationPlan>;
/**
 * Executes recovery phase
 *
 * @param planId - Recovery plan ID
 * @param phaseSequence - Phase sequence number to execute
 * @returns Updated recovery phase
 *
 * @example
 * ```typescript
 * const phase = await executeRecoveryPhase('plan-123', 1);
 * ```
 */
export declare function executeRecoveryPhase(planId: string, phaseSequence: number): Promise<RecoveryPhase>;
/**
 * Validates recovery readiness
 *
 * @param planId - Recovery plan ID
 * @returns Readiness validation results
 *
 * @example
 * ```typescript
 * const readiness = await validateRecoveryReadiness('plan-123');
 * ```
 */
export declare function validateRecoveryReadiness(planId: string): Promise<ValidationResult[]>;
/**
 * Coordinates stakeholder communication during recovery
 *
 * @param planId - Recovery plan ID
 * @param updateType - Type of update
 * @param message - Message to communicate
 * @returns Communication record
 *
 * @example
 * ```typescript
 * const comm = await coordinateRecoveryCommunication('plan-123', 'progress', 'Phase 1 complete');
 * ```
 */
export declare function coordinateRecoveryCommunication(planId: string, updateType: 'progress' | 'issue' | 'completion', message: string): Promise<Record<string, any>>;
/**
 * Tracks containment action history for incident
 *
 * @param incidentId - Associated incident ID
 * @returns Containment action history
 *
 * @example
 * ```typescript
 * const history = await trackContainmentHistory('incident-123');
 * ```
 */
export declare function trackContainmentHistory(incidentId: string): Promise<ContainmentAction[]>;
/**
 * Generates containment recommendations based on incident type
 *
 * @param incidentType - Type of incident
 * @param severity - Incident severity
 * @returns Recommended containment actions
 *
 * @example
 * ```typescript
 * const recommendations = await generateContainmentRecommendations('MALWARE', 'CRITICAL');
 * ```
 */
export declare function generateContainmentRecommendations(incidentType: string, severity: string): Promise<ContainmentAction[]>;
declare const _default: {
    getContainmentActionModelAttributes: () => {
        id: {
            type: string;
            defaultValue: string;
            primaryKey: boolean;
        };
        incidentId: {
            type: string;
            allowNull: boolean;
            references: {
                model: string;
                key: string;
            };
            onDelete: string;
        };
        actionType: {
            type: string;
            allowNull: boolean;
        };
        status: {
            type: string;
            allowNull: boolean;
            defaultValue: string;
        };
        priority: {
            type: string;
            allowNull: boolean;
        };
        strategy: {
            type: string;
            allowNull: boolean;
        };
        targetAssets: {
            type: string;
            defaultValue: never[];
        };
        executedAt: {
            type: string;
            allowNull: boolean;
        };
        completedAt: {
            type: string;
            allowNull: boolean;
        };
        executedBy: {
            type: string;
            allowNull: boolean;
        };
        automated: {
            type: string;
            defaultValue: boolean;
        };
        reversible: {
            type: string;
            defaultValue: boolean;
        };
        impactAssessment: {
            type: string;
            allowNull: boolean;
        };
        validationResults: {
            type: string;
            defaultValue: never[];
        };
        rollbackPlan: {
            type: string;
            allowNull: boolean;
        };
        approvalRequired: {
            type: string;
            defaultValue: boolean;
        };
        approvedBy: {
            type: string;
            allowNull: boolean;
        };
        approvedAt: {
            type: string;
            allowNull: boolean;
        };
        evidence: {
            type: string;
            defaultValue: never[];
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
    getIsolationProcedureModelAttributes: () => {
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
        targetType: {
            type: string;
            allowNull: boolean;
        };
        isolationType: {
            type: string;
            allowNull: boolean;
        };
        automationLevel: {
            type: string;
            allowNull: boolean;
        };
        steps: {
            type: string;
            defaultValue: never[];
        };
        prerequisites: {
            type: string;
            defaultValue: never[];
        };
        postConditions: {
            type: string;
            defaultValue: never[];
        };
        estimatedDuration: {
            type: string;
            allowNull: boolean;
        };
        requiredPermissions: {
            type: string;
            defaultValue: never[];
        };
        approvalWorkflow: {
            type: string;
            allowNull: boolean;
        };
        tags: {
            type: string;
            defaultValue: never[];
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
    getQuarantineRecordModelAttributes: () => {
        id: {
            type: string;
            defaultValue: string;
            primaryKey: boolean;
        };
        incidentId: {
            type: string;
            allowNull: boolean;
            references: {
                model: string;
                key: string;
            };
            onDelete: string;
        };
        targetId: {
            type: string;
            allowNull: boolean;
        };
        targetType: {
            type: string;
            allowNull: boolean;
        };
        quarantineStatus: {
            type: string;
            allowNull: boolean;
            defaultValue: string;
        };
        quarantineLocation: {
            type: string;
            allowNull: boolean;
        };
        quarantinedAt: {
            type: string;
            allowNull: boolean;
        };
        quarantinedBy: {
            type: string;
            allowNull: boolean;
        };
        releaseAuthorization: {
            type: string;
            allowNull: boolean;
        };
        releasedAt: {
            type: string;
            allowNull: boolean;
        };
        duration: {
            type: string;
            allowNull: boolean;
        };
        reason: {
            type: string;
            allowNull: boolean;
        };
        forensicAnalysisCompleted: {
            type: string;
            defaultValue: boolean;
        };
        evidenceCollected: {
            type: string;
            defaultValue: never[];
        };
        safeToRelease: {
            type: string;
            defaultValue: boolean;
        };
        releaseConditions: {
            type: string;
            defaultValue: never[];
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
    getEradicationTaskModelAttributes: () => {
        id: {
            type: string;
            defaultValue: string;
            primaryKey: boolean;
        };
        incidentId: {
            type: string;
            allowNull: boolean;
            references: {
                model: string;
                key: string;
            };
            onDelete: string;
        };
        containmentActionId: {
            type: string;
            allowNull: boolean;
            references: {
                model: string;
                key: string;
            };
            onDelete: string;
        };
        taskType: {
            type: string;
            allowNull: boolean;
        };
        status: {
            type: string;
            allowNull: boolean;
            defaultValue: string;
        };
        priority: {
            type: string;
            allowNull: boolean;
        };
        targetSystems: {
            type: string;
            defaultValue: never[];
        };
        threatIndicators: {
            type: string;
            defaultValue: never[];
        };
        scheduledAt: {
            type: string;
            allowNull: boolean;
        };
        startedAt: {
            type: string;
            allowNull: boolean;
        };
        completedAt: {
            type: string;
            allowNull: boolean;
        };
        assignedTo: {
            type: string;
            allowNull: boolean;
        };
        verificationRequired: {
            type: string;
            defaultValue: boolean;
        };
        verificationStatus: {
            type: string;
            allowNull: boolean;
        };
        remediationSteps: {
            type: string;
            defaultValue: never[];
        };
        successCriteria: {
            type: string;
            defaultValue: never[];
        };
        rollbackAvailable: {
            type: string;
            defaultValue: boolean;
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
    getNetworkSegmentationRuleModelAttributes: () => {
        id: {
            type: string;
            defaultValue: string;
            primaryKey: boolean;
        };
        name: {
            type: string;
            allowNull: boolean;
        };
        description: {
            type: string;
            allowNull: boolean;
        };
        ruleType: {
            type: string;
            allowNull: boolean;
        };
        sourceSegment: {
            type: string;
            allowNull: boolean;
        };
        destinationSegment: {
            type: string;
            allowNull: boolean;
        };
        protocol: {
            type: string;
            allowNull: boolean;
        };
        ports: {
            type: string;
            defaultValue: never[];
        };
        action: {
            type: string;
            allowNull: boolean;
        };
        priority: {
            type: string;
            allowNull: boolean;
        };
        enabled: {
            type: string;
            defaultValue: boolean;
        };
        temporary: {
            type: string;
            defaultValue: boolean;
        };
        expiresAt: {
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
            onDelete: string;
        };
        appliedAt: {
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
    getRecoveryCoordinationPlanModelAttributes: () => {
        id: {
            type: string;
            defaultValue: string;
            primaryKey: boolean;
        };
        incidentId: {
            type: string;
            allowNull: boolean;
            unique: boolean;
            references: {
                model: string;
                key: string;
            };
            onDelete: string;
        };
        status: {
            type: string;
            allowNull: boolean;
            defaultValue: string;
        };
        phases: {
            type: string;
            defaultValue: never[];
        };
        criticalServices: {
            type: string;
            defaultValue: never[];
        };
        recoveryTimeObjective: {
            type: string;
            allowNull: boolean;
        };
        recoveryPointObjective: {
            type: string;
            allowNull: boolean;
        };
        coordinators: {
            type: string;
            defaultValue: never[];
        };
        stakeholders: {
            type: string;
            defaultValue: never[];
        };
        communicationPlan: {
            type: string;
            allowNull: boolean;
        };
        startedAt: {
            type: string;
            allowNull: boolean;
        };
        completedAt: {
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
    isolateCompromisedHost: typeof isolateCompromisedHost;
    implementNetworkSegmentation: typeof implementNetworkSegmentation;
    quarantineSuspiciousEntity: typeof quarantineSuspiciousEntity;
    disableCompromisedAccounts: typeof disableCompromisedAccounts;
    executeContainmentAction: typeof executeContainmentAction;
    validateContainmentEffectiveness: typeof validateContainmentEffectiveness;
    rollbackContainmentAction: typeof rollbackContainmentAction;
    approveContainmentAction: typeof approveContainmentAction;
    assessIsolationImpact: typeof assessIsolationImpact;
    detectLateralMovement: typeof detectLateralMovement;
    blockLateralMovement: typeof blockLateralMovement;
    monitorCredentialAbuse: typeof monitorCredentialAbuse;
    restrictPrivilegedAccess: typeof restrictPrivilegedAccess;
    implementMicroSegmentation: typeof implementMicroSegmentation;
    initiateQuarantineWorkflow: typeof initiateQuarantineWorkflow;
    releaseFromQuarantine: typeof releaseFromQuarantine;
    extendQuarantineDuration: typeof extendQuarantineDuration;
    performQuarantineHealthCheck: typeof performQuarantineHealthCheck;
    verifyNetworkIsolation: typeof verifyNetworkIsolation;
    testContainmentBoundary: typeof testContainmentBoundary;
    validateServiceContinuity: typeof validateServiceContinuity;
    monitorContainmentMetrics: typeof monitorContainmentMetrics;
    generateContainmentReport: typeof generateContainmentReport;
    createEradicationTask: typeof createEradicationTask;
    executeEradicationTask: typeof executeEradicationTask;
    verifyEradicationSuccess: typeof verifyEradicationSuccess;
    scheduleEradicationWindow: typeof scheduleEradicationWindow;
    preserveContainmentEvidence: typeof preserveContainmentEvidence;
    captureSystemSnapshot: typeof captureSystemSnapshot;
    maintainEvidenceCustody: typeof maintainEvidenceCustody;
    createRecoveryPlan: typeof createRecoveryPlan;
    executeRecoveryPhase: typeof executeRecoveryPhase;
    validateRecoveryReadiness: typeof validateRecoveryReadiness;
    coordinateRecoveryCommunication: typeof coordinateRecoveryCommunication;
    trackContainmentHistory: typeof trackContainmentHistory;
    generateContainmentRecommendations: typeof generateContainmentRecommendations;
};
export default _default;
//# sourceMappingURL=incident-containment-kit.d.ts.map