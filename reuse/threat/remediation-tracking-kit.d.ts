/**
 * LOC: REMEDTRACK1234567
 * File: /reuse/threat/remediation-tracking-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize
 *   - crypto (Node.js built-in)
 *   - ./incident-response-kit (for incident integration)
 *   - ./incident-containment-kit (for containment integration)
 *
 * DOWNSTREAM (imported by):
 *   - Remediation management services
 *   - Patch management systems
 *   - Vulnerability remediation services
 *   - Configuration management services
 *   - Compliance tracking modules
 *   - SLA monitoring services
 */
/**
 * Remediation plan structure
 */
export interface RemediationPlan {
    id: string;
    incidentId: string;
    title: string;
    description: string;
    status: RemediationPlanStatus;
    priority: RemediationPriority;
    scope: RemediationScope;
    objectives: string[];
    tasks: string[];
    affectedSystems: string[];
    estimatedEffort: number;
    estimatedCost?: number;
    scheduledStartDate?: Date;
    scheduledEndDate?: Date;
    actualStartDate?: Date;
    actualEndDate?: Date;
    assignedTeam?: string;
    coordinatorId?: string;
    approvalRequired: boolean;
    approvedBy?: string;
    approvedAt?: Date;
    dependencies?: string[];
    successCriteria: SuccessCriterion[];
    rollbackPlan?: RollbackStrategy;
    tags: string[];
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Remediation plan status
 */
export declare enum RemediationPlanStatus {
    DRAFT = "DRAFT",
    PENDING_APPROVAL = "PENDING_APPROVAL",
    APPROVED = "APPROVED",
    SCHEDULED = "SCHEDULED",
    IN_PROGRESS = "IN_PROGRESS",
    PAUSED = "PAUSED",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED"
}
/**
 * Remediation priority
 */
export declare enum RemediationPriority {
    CRITICAL = "CRITICAL",// Must complete within 24 hours
    HIGH = "HIGH",// Must complete within 7 days
    MEDIUM = "MEDIUM",// Must complete within 30 days
    LOW = "LOW"
}
/**
 * Remediation scope
 */
export interface RemediationScope {
    vulnerabilities?: string[];
    weaknesses?: string[];
    configurations?: string[];
    systems: string[];
    applications?: string[];
    networkSegments?: string[];
    affectedUsers?: number;
    estimatedImpact: ImpactAssessment;
}
/**
 * Impact assessment
 */
export interface ImpactAssessment {
    operationalImpact: 'none' | 'minimal' | 'low' | 'moderate' | 'high' | 'critical';
    downtimeRequired: boolean;
    estimatedDowntime?: number;
    affectedServices: string[];
    userImpact: 'none' | 'minimal' | 'moderate' | 'significant' | 'severe';
    businessImpact: string;
}
/**
 * Success criterion
 */
export interface SuccessCriterion {
    id: string;
    description: string;
    validationType: 'automated' | 'manual' | 'both';
    validationMethod?: string;
    threshold?: number;
    status: 'pending' | 'met' | 'not_met';
    validatedAt?: Date;
    validatedBy?: string;
}
/**
 * Rollback strategy
 */
export interface RollbackStrategy {
    available: boolean;
    automated: boolean;
    steps: RollbackStep[];
    estimatedDuration: number;
    triggers: string[];
    approvalRequired: boolean;
}
/**
 * Rollback step
 */
export interface RollbackStep {
    sequence: number;
    action: string;
    command?: string;
    validationCheck?: string;
    estimatedDuration: number;
}
/**
 * Remediation task
 */
export interface RemediationTask {
    id: string;
    planId: string;
    title: string;
    description: string;
    taskType: RemediationTaskType;
    status: TaskStatus;
    priority: RemediationPriority;
    assignedTo?: string;
    assignedTeam?: string;
    estimatedEffort: number;
    actualEffort?: number;
    scheduledDate?: Date;
    startedAt?: Date;
    completedAt?: Date;
    dueDate?: Date;
    targetSystems: string[];
    prerequisites?: string[];
    validationRequired: boolean;
    validationStatus?: ValidationStatus;
    validationResults?: ValidationResult[];
    automationAvailable: boolean;
    automationScript?: string;
    notes?: string;
    tags: string[];
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Remediation task types
 */
export declare enum RemediationTaskType {
    PATCH_DEPLOYMENT = "PATCH_DEPLOYMENT",
    CONFIGURATION_CHANGE = "CONFIGURATION_CHANGE",
    SOFTWARE_UPDATE = "SOFTWARE_UPDATE",
    SECURITY_HARDENING = "SECURITY_HARDENING",
    ACCESS_CONTROL_UPDATE = "ACCESS_CONTROL_UPDATE",
    FIREWALL_RULE_UPDATE = "FIREWALL_RULE_UPDATE",
    VULNERABILITY_REMEDIATION = "VULNERABILITY_REMEDIATION",
    PASSWORD_RESET = "PASSWORD_RESET",
    CERTIFICATE_RENEWAL = "CERTIFICATE_RENEWAL",
    SYSTEM_REBUILD = "SYSTEM_REBUILD",
    BACKUP_RESTORATION = "BACKUP_RESTORATION",
    MONITORING_IMPLEMENTATION = "MONITORING_IMPLEMENTATION",
    DOCUMENTATION_UPDATE = "DOCUMENTATION_UPDATE",
    TRAINING_EXECUTION = "TRAINING_EXECUTION"
}
/**
 * Task status
 */
export declare enum TaskStatus {
    PENDING = "PENDING",
    READY = "READY",
    BLOCKED = "BLOCKED",
    IN_PROGRESS = "IN_PROGRESS",
    TESTING = "TESTING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED",
    DEFERRED = "DEFERRED"
}
/**
 * Validation status
 */
export declare enum ValidationStatus {
    NOT_STARTED = "NOT_STARTED",
    IN_PROGRESS = "IN_PROGRESS",
    PASSED = "PASSED",
    FAILED = "FAILED",
    PARTIAL = "PARTIAL"
}
/**
 * Validation result
 */
export interface ValidationResult {
    id: string;
    taskId: string;
    validationType: string;
    timestamp: Date;
    status: 'passed' | 'failed' | 'warning';
    details: string;
    metrics?: Record<string, any>;
    evidence?: string[];
    performedBy?: string;
}
/**
 * Patch deployment record
 */
export interface PatchDeployment {
    id: string;
    patchId: string;
    patchName: string;
    patchVersion: string;
    vendor: string;
    severity: PatchSeverity;
    cveIds?: string[];
    deploymentStatus: DeploymentStatus;
    targetSystems: string[];
    deployedSystems: string[];
    failedSystems: string[];
    deploymentMethod: DeploymentMethod;
    scheduledDate?: Date;
    deploymentStartedAt?: Date;
    deploymentCompletedAt?: Date;
    rollbackAvailable: boolean;
    rollbackDeadline?: Date;
    testingRequired: boolean;
    testingStatus?: 'not_started' | 'in_progress' | 'passed' | 'failed';
    approvalRequired: boolean;
    approvedBy?: string;
    approvedAt?: Date;
    successRate?: number;
    notes?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Patch severity levels
 */
export declare enum PatchSeverity {
    CRITICAL = "CRITICAL",
    IMPORTANT = "IMPORTANT",
    MODERATE = "MODERATE",
    LOW = "LOW"
}
/**
 * Deployment status
 */
export declare enum DeploymentStatus {
    PLANNED = "PLANNED",
    TESTING = "TESTING",
    SCHEDULED = "SCHEDULED",
    DEPLOYING = "DEPLOYING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    ROLLED_BACK = "ROLLED_BACK",
    PARTIALLY_DEPLOYED = "PARTIALLY_DEPLOYED"
}
/**
 * Deployment methods
 */
export declare enum DeploymentMethod {
    AUTOMATED = "AUTOMATED",
    MANUAL = "MANUAL",
    STAGED_ROLLOUT = "STAGED_ROLLOUT",
    PHASED_DEPLOYMENT = "PHASED_DEPLOYMENT",
    EMERGENCY_DEPLOYMENT = "EMERGENCY_DEPLOYMENT"
}
/**
 * Configuration hardening record
 */
export interface ConfigurationHardening {
    id: string;
    title: string;
    description: string;
    targetType: 'system' | 'application' | 'network' | 'database';
    targetIds: string[];
    hardeningStandard: string;
    baselineId?: string;
    status: HardeningStatus;
    configurationChanges: ConfigurationChange[];
    validationChecks: ValidationCheck[];
    implementedAt?: Date;
    implementedBy?: string;
    validatedAt?: Date;
    complianceScore?: number;
    findings?: Finding[];
    remediationPlanId?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Hardening status
 */
export declare enum HardeningStatus {
    PLANNED = "PLANNED",
    IN_PROGRESS = "IN_PROGRESS",
    IMPLEMENTED = "IMPLEMENTED",
    VALIDATED = "VALIDATED",
    FAILED = "FAILED",
    PARTIALLY_IMPLEMENTED = "PARTIALLY_IMPLEMENTED"
}
/**
 * Configuration change
 */
export interface ConfigurationChange {
    id: string;
    parameter: string;
    currentValue: string;
    targetValue: string;
    appliedValue?: string;
    rationale: string;
    riskLevel: 'low' | 'medium' | 'high';
    reversible: boolean;
    status: 'pending' | 'applied' | 'failed' | 'rolled_back';
}
/**
 * Validation check
 */
export interface ValidationCheck {
    id: string;
    checkName: string;
    checkType: 'automated' | 'manual';
    expectedResult: string;
    actualResult?: string;
    status: 'pending' | 'passed' | 'failed' | 'skipped';
    severity: 'critical' | 'high' | 'medium' | 'low';
    performedAt?: Date;
}
/**
 * Hardening finding
 */
export interface Finding {
    id: string;
    category: string;
    severity: 'critical' | 'high' | 'medium' | 'low' | 'informational';
    description: string;
    remediation: string;
    status: 'open' | 'in_progress' | 'resolved' | 'accepted_risk';
}
/**
 * Reoccurrence prevention measure
 */
export interface ReoccurrencePrevention {
    id: string;
    incidentId: string;
    remediationPlanId?: string;
    measureType: PreventionMeasureType;
    title: string;
    description: string;
    status: PreventionStatus;
    implementationSteps: ImplementationStep[];
    targetCompletionDate?: Date;
    implementedAt?: Date;
    effectiveness?: EffectivenessRating;
    monitoringEnabled: boolean;
    monitoringMetrics?: string[];
    reviewFrequency?: ReviewFrequency;
    nextReviewDate?: Date;
    assignedTo?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Prevention measure types
 */
export declare enum PreventionMeasureType {
    PROCESS_IMPROVEMENT = "PROCESS_IMPROVEMENT",
    TECHNICAL_CONTROL = "TECHNICAL_CONTROL",
    POLICY_UPDATE = "POLICY_UPDATE",
    TRAINING_PROGRAM = "TRAINING_PROGRAM",
    MONITORING_ENHANCEMENT = "MONITORING_ENHANCEMENT",
    ACCESS_CONTROL_ENHANCEMENT = "ACCESS_CONTROL_ENHANCEMENT",
    ARCHITECTURE_CHANGE = "ARCHITECTURE_CHANGE",
    VENDOR_CHANGE = "VENDOR_CHANGE",
    AUTOMATION_IMPLEMENTATION = "AUTOMATION_IMPLEMENTATION"
}
/**
 * Prevention status
 */
export declare enum PreventionStatus {
    PROPOSED = "PROPOSED",
    APPROVED = "APPROVED",
    IN_PROGRESS = "IN_PROGRESS",
    IMPLEMENTED = "IMPLEMENTED",
    MONITORING = "MONITORING",
    VALIDATED = "VALIDATED",
    INEFFECTIVE = "INEFFECTIVE"
}
/**
 * Implementation step
 */
export interface ImplementationStep {
    sequence: number;
    description: string;
    responsible?: string;
    estimatedDuration: number;
    status: 'pending' | 'in_progress' | 'completed' | 'blocked';
    completedAt?: Date;
}
/**
 * Effectiveness rating
 */
export interface EffectivenessRating {
    score: number;
    measuredAt: Date;
    metrics: Record<string, any>;
    incidents_prevented?: number;
    cost_avoided?: number;
    notes?: string;
}
/**
 * Review frequency
 */
export declare enum ReviewFrequency {
    WEEKLY = "WEEKLY",
    BIWEEKLY = "BIWEEKLY",
    MONTHLY = "MONTHLY",
    QUARTERLY = "QUARTERLY",
    ANNUALLY = "ANNUALLY"
}
/**
 * SLA tracking record
 */
export interface SLATracking {
    id: string;
    remediationPlanId?: string;
    taskId?: string;
    slaType: SLAType;
    priority: RemediationPriority;
    targetDuration: number;
    startedAt: Date;
    dueDate: Date;
    completedAt?: Date;
    actualDuration?: number;
    status: SLAStatus;
    breached: boolean;
    breachReason?: string;
    extensionGranted: boolean;
    extensionReason?: string;
    escalationLevel: number;
    escalatedTo?: string[];
    escalatedAt?: Date;
    notifications: NotificationRecord[];
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * SLA types
 */
export declare enum SLAType {
    INCIDENT_REMEDIATION = "INCIDENT_REMEDIATION",
    VULNERABILITY_REMEDIATION = "VULNERABILITY_REMEDIATION",
    PATCH_DEPLOYMENT = "PATCH_DEPLOYMENT",
    CONFIGURATION_CHANGE = "CONFIGURATION_CHANGE",
    ACCESS_REQUEST = "ACCESS_REQUEST"
}
/**
 * SLA status
 */
export declare enum SLAStatus {
    ON_TRACK = "ON_TRACK",
    AT_RISK = "AT_RISK",
    BREACHED = "BREACHED",
    COMPLETED = "COMPLETED",
    PAUSED = "PAUSED",
    CANCELLED = "CANCELLED"
}
/**
 * Notification record
 */
export interface NotificationRecord {
    id: string;
    type: 'reminder' | 'warning' | 'breach' | 'escalation';
    sentAt: Date;
    recipients: string[];
    channel: 'email' | 'sms' | 'slack' | 'pager';
    message: string;
}
/**
 * Remediation effectiveness metrics
 */
export interface RemediationMetrics {
    id: string;
    periodStart: Date;
    periodEnd: Date;
    totalPlans: number;
    completedPlans: number;
    failedPlans: number;
    averageCompletionTime: number;
    slaCompliance: number;
    totalTasks: number;
    completedTasks: number;
    automationRate: number;
    successRate: number;
    costEfficiency?: number;
    reoccurrenceRate: number;
    topIssues: TopIssue[];
    trendsAnalysis: TrendData[];
    recommendations: string[];
    metadata?: Record<string, any>;
    createdAt: Date;
}
/**
 * Top issue
 */
export interface TopIssue {
    category: string;
    count: number;
    averageResolutionTime: number;
    trend: 'increasing' | 'decreasing' | 'stable';
}
/**
 * Trend data
 */
export interface TrendData {
    metric: string;
    values: number[];
    timestamps: Date[];
    trend: 'up' | 'down' | 'stable';
    percentageChange: number;
}
/**
 * Post-remediation validation report
 */
export interface PostRemediationValidation {
    id: string;
    remediationPlanId: string;
    validationType: PostValidationType;
    status: ValidationStatus;
    scheduledDate?: Date;
    performedAt?: Date;
    performedBy?: string;
    validationChecks: ValidationCheck[];
    overallResult: 'passed' | 'failed' | 'partial';
    findings: Finding[];
    recommendations: string[];
    requiresFollowUp: boolean;
    followUpTasks?: string[];
    certificationGranted: boolean;
    certifiedBy?: string;
    certifiedAt?: Date;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Post-validation types
 */
export declare enum PostValidationType {
    SECURITY_SCAN = "SECURITY_SCAN",
    COMPLIANCE_AUDIT = "COMPLIANCE_AUDIT",
    PENETRATION_TEST = "PENETRATION_TEST",
    CONFIGURATION_REVIEW = "CONFIGURATION_REVIEW",
    FUNCTIONAL_TEST = "FUNCTIONAL_TEST",
    PERFORMANCE_TEST = "PERFORMANCE_TEST",
    INTEGRATION_TEST = "INTEGRATION_TEST",
    USER_ACCEPTANCE_TEST = "USER_ACCEPTANCE_TEST"
}
/**
 * Sequelize RemediationPlan model attributes.
 *
 * @example
 * ```typescript
 * class RemediationPlan extends Model {}
 * RemediationPlan.init(getRemediationPlanModelAttributes(), {
 *   sequelize,
 *   tableName: 'remediation_plans',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['incidentId'] },
 *     { fields: ['status', 'priority'] },
 *     { fields: ['scheduledStartDate'] }
 *   ]
 * });
 *
 * // Define associations
 * RemediationPlan.belongsTo(Incident, { foreignKey: 'incidentId', as: 'incident' });
 * RemediationPlan.hasMany(RemediationTask, { foreignKey: 'planId', as: 'tasks' });
 * RemediationPlan.hasOne(SLATracking, { foreignKey: 'remediationPlanId', as: 'sla' });
 * RemediationPlan.hasMany(PostRemediationValidation, { foreignKey: 'remediationPlanId', as: 'validations' });
 * ```
 */
export declare const getRemediationPlanModelAttributes: () => {
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
    title: {
        type: string;
        allowNull: boolean;
    };
    description: {
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
    scope: {
        type: string;
        allowNull: boolean;
    };
    objectives: {
        type: string;
        defaultValue: never[];
    };
    tasks: {
        type: string;
        defaultValue: never[];
    };
    affectedSystems: {
        type: string;
        defaultValue: never[];
    };
    estimatedEffort: {
        type: string;
        allowNull: boolean;
    };
    estimatedCost: {
        type: string;
        allowNull: boolean;
    };
    scheduledStartDate: {
        type: string;
        allowNull: boolean;
    };
    scheduledEndDate: {
        type: string;
        allowNull: boolean;
    };
    actualStartDate: {
        type: string;
        allowNull: boolean;
    };
    actualEndDate: {
        type: string;
        allowNull: boolean;
    };
    assignedTeam: {
        type: string;
        allowNull: boolean;
    };
    coordinatorId: {
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
    dependencies: {
        type: string;
        defaultValue: never[];
    };
    successCriteria: {
        type: string;
        defaultValue: never[];
    };
    rollbackPlan: {
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
 * Sequelize RemediationTask model attributes.
 *
 * @example
 * ```typescript
 * class RemediationTask extends Model {}
 * RemediationTask.init(getRemediationTaskModelAttributes(), {
 *   sequelize,
 *   tableName: 'remediation_tasks',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['planId'] },
 *     { fields: ['status', 'priority'] },
 *     { fields: ['assignedTo'] },
 *     { fields: ['dueDate'] }
 *   ]
 * });
 *
 * // Define associations
 * RemediationTask.belongsTo(RemediationPlan, { foreignKey: 'planId', as: 'plan' });
 * RemediationTask.hasMany(ValidationResult, { foreignKey: 'taskId', as: 'validationResults' });
 * RemediationTask.hasOne(SLATracking, { foreignKey: 'taskId', as: 'sla' });
 *
 * // Self-referencing for prerequisites
 * RemediationTask.belongsToMany(RemediationTask, {
 *   through: 'task_dependencies',
 *   as: 'dependsOn',
 *   foreignKey: 'taskId',
 *   otherKey: 'prerequisiteTaskId'
 * });
 * ```
 */
export declare const getRemediationTaskModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    planId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
        onDelete: string;
    };
    title: {
        type: string;
        allowNull: boolean;
    };
    description: {
        type: string;
        allowNull: boolean;
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
    assignedTo: {
        type: string;
        allowNull: boolean;
    };
    assignedTeam: {
        type: string;
        allowNull: boolean;
    };
    estimatedEffort: {
        type: string;
        allowNull: boolean;
    };
    actualEffort: {
        type: string;
        allowNull: boolean;
    };
    scheduledDate: {
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
    dueDate: {
        type: string;
        allowNull: boolean;
    };
    targetSystems: {
        type: string;
        defaultValue: never[];
    };
    prerequisites: {
        type: string;
        defaultValue: never[];
    };
    validationRequired: {
        type: string;
        defaultValue: boolean;
    };
    validationStatus: {
        type: string;
        allowNull: boolean;
    };
    validationResults: {
        type: string;
        defaultValue: never[];
    };
    automationAvailable: {
        type: string;
        defaultValue: boolean;
    };
    automationScript: {
        type: string;
        allowNull: boolean;
    };
    notes: {
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
 * Sequelize PatchDeployment model attributes.
 *
 * @example
 * ```typescript
 * class PatchDeployment extends Model {}
 * PatchDeployment.init(getPatchDeploymentModelAttributes(), {
 *   sequelize,
 *   tableName: 'patch_deployments',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['patchId'] },
 *     { fields: ['deploymentStatus'] },
 *     { fields: ['severity'] },
 *     { fields: ['scheduledDate'] }
 *   ]
 * });
 *
 * // Many-to-Many with RemediationTask
 * PatchDeployment.belongsToMany(RemediationTask, {
 *   through: 'task_patch_deployments',
 *   foreignKey: 'patchDeploymentId',
 *   otherKey: 'taskId',
 *   as: 'tasks'
 * });
 * ```
 */
export declare const getPatchDeploymentModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    patchId: {
        type: string;
        allowNull: boolean;
    };
    patchName: {
        type: string;
        allowNull: boolean;
    };
    patchVersion: {
        type: string;
        allowNull: boolean;
    };
    vendor: {
        type: string;
        allowNull: boolean;
    };
    severity: {
        type: string;
        allowNull: boolean;
    };
    cveIds: {
        type: string;
        defaultValue: never[];
    };
    deploymentStatus: {
        type: string;
        allowNull: boolean;
        defaultValue: string;
    };
    targetSystems: {
        type: string;
        defaultValue: never[];
    };
    deployedSystems: {
        type: string;
        defaultValue: never[];
    };
    failedSystems: {
        type: string;
        defaultValue: never[];
    };
    deploymentMethod: {
        type: string;
        allowNull: boolean;
    };
    scheduledDate: {
        type: string;
        allowNull: boolean;
    };
    deploymentStartedAt: {
        type: string;
        allowNull: boolean;
    };
    deploymentCompletedAt: {
        type: string;
        allowNull: boolean;
    };
    rollbackAvailable: {
        type: string;
        defaultValue: boolean;
    };
    rollbackDeadline: {
        type: string;
        allowNull: boolean;
    };
    testingRequired: {
        type: string;
        defaultValue: boolean;
    };
    testingStatus: {
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
    successRate: {
        type: string;
        allowNull: boolean;
    };
    notes: {
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
 * Sequelize ConfigurationHardening model attributes.
 *
 * @example
 * ```typescript
 * class ConfigurationHardening extends Model {}
 * ConfigurationHardening.init(getConfigurationHardeningModelAttributes(), {
 *   sequelize,
 *   tableName: 'configuration_hardening',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['status'] },
 *     { fields: ['remediationPlanId'] },
 *     { fields: ['hardeningStandard'] }
 *   ]
 * });
 *
 * // Define associations
 * ConfigurationHardening.belongsTo(RemediationPlan, {
 *   foreignKey: 'remediationPlanId',
 *   as: 'remediationPlan'
 * });
 * ```
 */
export declare const getConfigurationHardeningModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    title: {
        type: string;
        allowNull: boolean;
    };
    description: {
        type: string;
        allowNull: boolean;
    };
    targetType: {
        type: string;
        allowNull: boolean;
    };
    targetIds: {
        type: string;
        defaultValue: never[];
    };
    hardeningStandard: {
        type: string;
        allowNull: boolean;
    };
    baselineId: {
        type: string;
        allowNull: boolean;
    };
    status: {
        type: string;
        allowNull: boolean;
        defaultValue: string;
    };
    configurationChanges: {
        type: string;
        defaultValue: never[];
    };
    validationChecks: {
        type: string;
        defaultValue: never[];
    };
    implementedAt: {
        type: string;
        allowNull: boolean;
    };
    implementedBy: {
        type: string;
        allowNull: boolean;
    };
    validatedAt: {
        type: string;
        allowNull: boolean;
    };
    complianceScore: {
        type: string;
        allowNull: boolean;
    };
    findings: {
        type: string;
        defaultValue: never[];
    };
    remediationPlanId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
        onDelete: string;
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
 * Sequelize ReoccurrencePrevention model attributes.
 *
 * @example
 * ```typescript
 * class ReoccurrencePrevention extends Model {}
 * ReoccurrencePrevention.init(getReoccurrencePreventionModelAttributes(), {
 *   sequelize,
 *   tableName: 'reoccurrence_prevention',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['incidentId'] },
 *     { fields: ['status'] },
 *     { fields: ['nextReviewDate'] }
 *   ]
 * });
 *
 * // Define associations
 * ReoccurrencePrevention.belongsTo(Incident, { foreignKey: 'incidentId', as: 'incident' });
 * ReoccurrencePrevention.belongsTo(RemediationPlan, {
 *   foreignKey: 'remediationPlanId',
 *   as: 'remediationPlan'
 * });
 * ```
 */
export declare const getReoccurrencePreventionModelAttributes: () => {
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
    remediationPlanId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
        onDelete: string;
    };
    measureType: {
        type: string;
        allowNull: boolean;
    };
    title: {
        type: string;
        allowNull: boolean;
    };
    description: {
        type: string;
        allowNull: boolean;
    };
    status: {
        type: string;
        allowNull: boolean;
        defaultValue: string;
    };
    implementationSteps: {
        type: string;
        defaultValue: never[];
    };
    targetCompletionDate: {
        type: string;
        allowNull: boolean;
    };
    implementedAt: {
        type: string;
        allowNull: boolean;
    };
    effectiveness: {
        type: string;
        allowNull: boolean;
    };
    monitoringEnabled: {
        type: string;
        defaultValue: boolean;
    };
    monitoringMetrics: {
        type: string;
        defaultValue: never[];
    };
    reviewFrequency: {
        type: string;
        allowNull: boolean;
    };
    nextReviewDate: {
        type: string;
        allowNull: boolean;
    };
    assignedTo: {
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
 * Sequelize SLATracking model attributes.
 *
 * @example
 * ```typescript
 * class SLATracking extends Model {}
 * SLATracking.init(getSLATrackingModelAttributes(), {
 *   sequelize,
 *   tableName: 'sla_tracking',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['remediationPlanId'] },
 *     { fields: ['taskId'] },
 *     { fields: ['status'] },
 *     { fields: ['dueDate'] },
 *     { fields: ['breached'] }
 *   ]
 * });
 *
 * // Define associations
 * SLATracking.belongsTo(RemediationPlan, { foreignKey: 'remediationPlanId', as: 'plan' });
 * SLATracking.belongsTo(RemediationTask, { foreignKey: 'taskId', as: 'task' });
 * ```
 */
export declare const getSLATrackingModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    remediationPlanId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
        onDelete: string;
    };
    taskId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
        onDelete: string;
    };
    slaType: {
        type: string;
        allowNull: boolean;
    };
    priority: {
        type: string;
        allowNull: boolean;
    };
    targetDuration: {
        type: string;
        allowNull: boolean;
    };
    startedAt: {
        type: string;
        allowNull: boolean;
    };
    dueDate: {
        type: string;
        allowNull: boolean;
    };
    completedAt: {
        type: string;
        allowNull: boolean;
    };
    actualDuration: {
        type: string;
        allowNull: boolean;
    };
    status: {
        type: string;
        allowNull: boolean;
        defaultValue: string;
    };
    breached: {
        type: string;
        defaultValue: boolean;
    };
    breachReason: {
        type: string;
        allowNull: boolean;
    };
    extensionGranted: {
        type: string;
        defaultValue: boolean;
    };
    extensionReason: {
        type: string;
        allowNull: boolean;
    };
    escalationLevel: {
        type: string;
        defaultValue: number;
    };
    escalatedTo: {
        type: string;
        defaultValue: never[];
    };
    escalatedAt: {
        type: string;
        allowNull: boolean;
    };
    notifications: {
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
 * Sequelize PostRemediationValidation model attributes.
 *
 * @example
 * ```typescript
 * class PostRemediationValidation extends Model {}
 * PostRemediationValidation.init(getPostRemediationValidationModelAttributes(), {
 *   sequelize,
 *   tableName: 'post_remediation_validations',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['remediationPlanId'] },
 *     { fields: ['status'] },
 *     { fields: ['performedAt'] }
 *   ]
 * });
 *
 * // Define associations
 * PostRemediationValidation.belongsTo(RemediationPlan, {
 *   foreignKey: 'remediationPlanId',
 *   as: 'remediationPlan'
 * });
 * ```
 */
export declare const getPostRemediationValidationModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    remediationPlanId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
        onDelete: string;
    };
    validationType: {
        type: string;
        allowNull: boolean;
    };
    status: {
        type: string;
        allowNull: boolean;
        defaultValue: string;
    };
    scheduledDate: {
        type: string;
        allowNull: boolean;
    };
    performedAt: {
        type: string;
        allowNull: boolean;
    };
    performedBy: {
        type: string;
        allowNull: boolean;
    };
    validationChecks: {
        type: string;
        defaultValue: never[];
    };
    overallResult: {
        type: string;
        allowNull: boolean;
    };
    findings: {
        type: string;
        defaultValue: never[];
    };
    recommendations: {
        type: string;
        defaultValue: never[];
    };
    requiresFollowUp: {
        type: string;
        defaultValue: boolean;
    };
    followUpTasks: {
        type: string;
        defaultValue: never[];
    };
    certificationGranted: {
        type: string;
        defaultValue: boolean;
    };
    certifiedBy: {
        type: string;
        allowNull: boolean;
    };
    certifiedAt: {
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
 * Creates a comprehensive remediation plan
 *
 * @param incidentId - Associated incident ID
 * @param objectives - Remediation objectives
 * @param scope - Remediation scope
 * @returns Created remediation plan
 *
 * @example
 * ```typescript
 * const plan = await createRemediationPlan(
 *   'incident-123',
 *   ['Patch vulnerable systems', 'Update firewall rules', 'Reset compromised credentials'],
 *   {
 *     systems: ['web-server-01', 'db-server-02'],
 *     affectedUsers: 50,
 *     estimatedImpact: { operationalImpact: 'moderate', downtimeRequired: true }
 *   }
 * );
 * ```
 */
export declare function createRemediationPlan(incidentId: string, objectives: string[], scope: RemediationScope): Promise<RemediationPlan>;
/**
 * Adds a task to remediation plan
 *
 * @param planId - Remediation plan ID
 * @param task - Task details
 * @returns Created remediation task
 *
 * @example
 * ```typescript
 * const task = await addRemediationTask('plan-123', {
 *   title: 'Deploy security patches',
 *   taskType: RemediationTaskType.PATCH_DEPLOYMENT,
 *   targetSystems: ['server-01', 'server-02'],
 *   estimatedEffort: 4
 * });
 * ```
 */
export declare function addRemediationTask(planId: string, task: Partial<RemediationTask>): Promise<RemediationTask>;
/**
 * Generates task dependencies based on task types
 *
 * @param tasks - Array of remediation tasks
 * @returns Updated tasks with dependencies
 *
 * @example
 * ```typescript
 * const tasksWithDeps = await generateTaskDependencies(tasks);
 * ```
 */
export declare function generateTaskDependencies(tasks: RemediationTask[]): Promise<RemediationTask[]>;
/**
 * Prioritizes remediation tasks using risk-based scoring
 *
 * @param tasks - Array of tasks to prioritize
 * @returns Prioritized tasks
 *
 * @example
 * ```typescript
 * const prioritized = await prioritizeRemediationTasks(tasks);
 * ```
 */
export declare function prioritizeRemediationTasks(tasks: RemediationTask[]): Promise<RemediationTask[]>;
/**
 * Estimates remediation timeline
 *
 * @param planId - Remediation plan ID
 * @returns Timeline estimation
 *
 * @example
 * ```typescript
 * const timeline = await estimateRemediationTimeline('plan-123');
 * ```
 */
export declare function estimateRemediationTimeline(planId: string): Promise<Record<string, any>>;
/**
 * Approves remediation plan
 *
 * @param planId - Plan ID to approve
 * @param userId - Approving user ID
 * @returns Updated plan
 *
 * @example
 * ```typescript
 * const approved = await approveRemediationPlan('plan-123', 'admin-456');
 * ```
 */
export declare function approveRemediationPlan(planId: string, userId: string): Promise<RemediationPlan>;
/**
 * Creates patch deployment record
 *
 * @param patchDetails - Patch information
 * @param targetSystems - Systems to patch
 * @returns Created patch deployment
 *
 * @example
 * ```typescript
 * const deployment = await createPatchDeployment(
 *   { patchId: 'MS-2024-001', severity: PatchSeverity.CRITICAL, vendor: 'Microsoft' },
 *   ['server-01', 'server-02']
 * );
 * ```
 */
export declare function createPatchDeployment(patchDetails: Partial<PatchDeployment>, targetSystems: string[]): Promise<PatchDeployment>;
/**
 * Executes patch deployment
 *
 * @param deploymentId - Deployment ID
 * @returns Updated deployment record
 *
 * @example
 * ```typescript
 * const result = await executePatchDeployment('deployment-123');
 * ```
 */
export declare function executePatchDeployment(deploymentId: string): Promise<PatchDeployment>;
/**
 * Tracks patch deployment progress
 *
 * @param deploymentId - Deployment ID
 * @returns Progress metrics
 *
 * @example
 * ```typescript
 * const progress = await trackPatchProgress('deployment-123');
 * ```
 */
export declare function trackPatchProgress(deploymentId: string): Promise<Record<string, any>>;
/**
 * Validates patch installation
 *
 * @param deploymentId - Deployment ID
 * @param systemId - System to validate
 * @returns Validation result
 *
 * @example
 * ```typescript
 * const validation = await validatePatchInstallation('deployment-123', 'server-01');
 * ```
 */
export declare function validatePatchInstallation(deploymentId: string, systemId: string): Promise<ValidationResult>;
/**
 * Rolls back patch deployment
 *
 * @param deploymentId - Deployment ID
 * @param reason - Rollback reason
 * @returns Updated deployment
 *
 * @example
 * ```typescript
 * const rolledBack = await rollbackPatchDeployment('deployment-123', 'Compatibility issues detected');
 * ```
 */
export declare function rollbackPatchDeployment(deploymentId: string, reason: string): Promise<PatchDeployment>;
/**
 * Creates configuration hardening plan
 *
 * @param targetIds - Target systems/applications
 * @param standard - Hardening standard (CIS, NIST, etc.)
 * @returns Created hardening record
 *
 * @example
 * ```typescript
 * const hardening = await createConfigurationHardening(
 *   ['web-server-01', 'web-server-02'],
 *   'CIS Benchmark Level 1'
 * );
 * ```
 */
export declare function createConfigurationHardening(targetIds: string[], standard: string): Promise<ConfigurationHardening>;
/**
 * Applies configuration hardening
 *
 * @param hardeningId - Hardening record ID
 * @returns Updated hardening record
 *
 * @example
 * ```typescript
 * const result = await applyConfigurationHardening('hardening-123');
 * ```
 */
export declare function applyConfigurationHardening(hardeningId: string): Promise<ConfigurationHardening>;
/**
 * Validates hardening compliance
 *
 * @param hardeningId - Hardening record ID
 * @returns Compliance validation results
 *
 * @example
 * ```typescript
 * const validation = await validateHardeningCompliance('hardening-123');
 * ```
 */
export declare function validateHardeningCompliance(hardeningId: string): Promise<ConfigurationHardening>;
/**
 * Generates hardening baseline
 *
 * @param targetType - Type of target
 * @param standard - Hardening standard
 * @returns Baseline configuration
 *
 * @example
 * ```typescript
 * const baseline = await generateHardeningBaseline('system', 'CIS Level 1');
 * ```
 */
export declare function generateHardeningBaseline(targetType: string, standard: string): Promise<ConfigurationChange[]>;
/**
 * Compares configuration against baseline
 *
 * @param targetId - Target system ID
 * @param baselineId - Baseline ID
 * @returns Comparison results
 *
 * @example
 * ```typescript
 * const comparison = await compareAgainstBaseline('server-01', 'baseline-123');
 * ```
 */
export declare function compareAgainstBaseline(targetId: string, baselineId: string): Promise<Finding[]>;
/**
 * Performs comprehensive remediation validation
 *
 * @param planId - Remediation plan ID
 * @returns Validation results
 *
 * @example
 * ```typescript
 * const validation = await performRemediationValidation('plan-123');
 * ```
 */
export declare function performRemediationValidation(planId: string): Promise<PostRemediationValidation>;
/**
 * Executes automated validation tests
 *
 * @param validationId - Validation ID
 * @returns Test results
 *
 * @example
 * ```typescript
 * const results = await executeValidationTests('validation-123');
 * ```
 */
export declare function executeValidationTests(validationId: string): Promise<ValidationCheck[]>;
/**
 * Verifies vulnerability remediation
 *
 * @param vulnerabilityIds - Vulnerability IDs to verify
 * @returns Verification results
 *
 * @example
 * ```typescript
 * const results = await verifyVulnerabilityRemediation(['CVE-2024-001', 'CVE-2024-002']);
 * ```
 */
export declare function verifyVulnerabilityRemediation(vulnerabilityIds: string[]): Promise<Record<string, any>>;
/**
 * Validates security control effectiveness
 *
 * @param controlIds - Security control IDs
 * @returns Effectiveness assessment
 *
 * @example
 * ```typescript
 * const effectiveness = await validateSecurityControls(['control-001', 'control-002']);
 * ```
 */
export declare function validateSecurityControls(controlIds: string[]): Promise<ValidationResult[]>;
/**
 * Certifies remediation completion
 *
 * @param validationId - Validation ID
 * @param userId - Certifying user ID
 * @returns Updated validation
 *
 * @example
 * ```typescript
 * const certified = await certifyRemediationCompletion('validation-123', 'admin-456');
 * ```
 */
export declare function certifyRemediationCompletion(validationId: string, userId: string): Promise<PostRemediationValidation>;
/**
 * Creates reoccurrence prevention measure
 *
 * @param incidentId - Associated incident ID
 * @param measureType - Type of prevention measure
 * @param description - Measure description
 * @returns Created prevention measure
 *
 * @example
 * ```typescript
 * const measure = await createPreventionMeasure(
 *   'incident-123',
 *   PreventionMeasureType.TECHNICAL_CONTROL,
 *   'Implement automated vulnerability scanning'
 * );
 * ```
 */
export declare function createPreventionMeasure(incidentId: string, measureType: PreventionMeasureType, description: string): Promise<ReoccurrencePrevention>;
/**
 * Implements prevention measure
 *
 * @param measureId - Prevention measure ID
 * @returns Updated measure
 *
 * @example
 * ```typescript
 * const implemented = await implementPreventionMeasure('measure-123');
 * ```
 */
export declare function implementPreventionMeasure(measureId: string): Promise<ReoccurrencePrevention>;
/**
 * Measures prevention effectiveness
 *
 * @param measureId - Prevention measure ID
 * @param metrics - Effectiveness metrics
 * @returns Effectiveness rating
 *
 * @example
 * ```typescript
 * const effectiveness = await measurePreventionEffectiveness('measure-123', { incidents_prevented: 5 });
 * ```
 */
export declare function measurePreventionEffectiveness(measureId: string, metrics: Record<string, any>): Promise<EffectivenessRating>;
/**
 * Schedules prevention measure review
 *
 * @param measureId - Prevention measure ID
 * @param frequency - Review frequency
 * @returns Updated measure
 *
 * @example
 * ```typescript
 * const scheduled = await schedulePreventionReview('measure-123', ReviewFrequency.QUARTERLY);
 * ```
 */
export declare function schedulePreventionReview(measureId: string, frequency: ReviewFrequency): Promise<ReoccurrencePrevention>;
/**
 * Analyzes incident patterns for prevention
 *
 * @param timeRange - Time range for analysis
 * @returns Pattern analysis
 *
 * @example
 * ```typescript
 * const patterns = await analyzeIncidentPatterns({ start: startDate, end: endDate });
 * ```
 */
export declare function analyzeIncidentPatterns(timeRange: {
    start: Date;
    end: Date;
}): Promise<Record<string, any>>;
/**
 * Creates SLA tracking record
 *
 * @param planId - Remediation plan ID
 * @param priority - Priority level
 * @returns Created SLA record
 *
 * @example
 * ```typescript
 * const sla = await createSLATracking('plan-123', RemediationPriority.CRITICAL);
 * ```
 */
export declare function createSLATracking(planId: string, priority: RemediationPriority): Promise<SLATracking>;
/**
 * Updates SLA status
 *
 * @param slaId - SLA tracking ID
 * @returns Updated SLA
 *
 * @example
 * ```typescript
 * const updated = await updateSLAStatus('sla-123');
 * ```
 */
export declare function updateSLAStatus(slaId: string): Promise<SLATracking>;
/**
 * Escalates SLA breach
 *
 * @param slaId - SLA tracking ID
 * @param escalationLevel - Escalation level
 * @param escalateTo - User IDs to escalate to
 * @returns Updated SLA
 *
 * @example
 * ```typescript
 * const escalated = await escalateSLABreach('sla-123', 2, ['manager-456', 'director-789']);
 * ```
 */
export declare function escalateSLABreach(slaId: string, escalationLevel: number, escalateTo: string[]): Promise<SLATracking>;
/**
 * Grants SLA extension
 *
 * @param slaId - SLA tracking ID
 * @param extensionHours - Hours to extend
 * @param reason - Extension reason
 * @returns Updated SLA
 *
 * @example
 * ```typescript
 * const extended = await grantSLAExtension('sla-123', 24, 'Waiting for vendor patch');
 * ```
 */
export declare function grantSLAExtension(slaId: string, extensionHours: number, reason: string): Promise<SLATracking>;
/**
 * Monitors SLA compliance
 *
 * @param timeRange - Time range to monitor
 * @returns Compliance metrics
 *
 * @example
 * ```typescript
 * const compliance = await monitorSLACompliance({ start: startDate, end: endDate });
 * ```
 */
export declare function monitorSLACompliance(timeRange: {
    start: Date;
    end: Date;
}): Promise<Record<string, any>>;
/**
 * Calculates remediation effectiveness metrics
 *
 * @param periodStart - Period start date
 * @param periodEnd - Period end date
 * @returns Effectiveness metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculateRemediationMetrics(startDate, endDate);
 * ```
 */
export declare function calculateRemediationMetrics(periodStart: Date, periodEnd: Date): Promise<RemediationMetrics>;
/**
 * Generates remediation dashboard metrics
 *
 * @returns Dashboard metrics
 *
 * @example
 * ```typescript
 * const dashboard = await generateRemediationDashboard();
 * ```
 */
export declare function generateRemediationDashboard(): Promise<Record<string, any>>;
/**
 * Analyzes remediation trends
 *
 * @param months - Number of months to analyze
 * @returns Trend analysis
 *
 * @example
 * ```typescript
 * const trends = await analyzeRemediationTrends(6);
 * ```
 */
export declare function analyzeRemediationTrends(months: number): Promise<TrendData[]>;
/**
 * Generates remediation performance report
 *
 * @param timeRange - Time range for report
 * @returns Performance report
 *
 * @example
 * ```typescript
 * const report = await generatePerformanceReport({ start: startDate, end: endDate });
 * ```
 */
export declare function generatePerformanceReport(timeRange: {
    start: Date;
    end: Date;
}): Promise<Record<string, any>>;
/**
 * Compares remediation metrics across periods
 *
 * @param period1 - First period
 * @param period2 - Second period
 * @returns Comparison results
 *
 * @example
 * ```typescript
 * const comparison = await compareRemediationPeriods(
 *   { start: lastQuarterStart, end: lastQuarterEnd },
 *   { start: thisQuarterStart, end: thisQuarterEnd }
 * );
 * ```
 */
export declare function compareRemediationPeriods(period1: {
    start: Date;
    end: Date;
}, period2: {
    start: Date;
    end: Date;
}): Promise<Record<string, any>>;
/**
 * Exports remediation metrics to various formats
 *
 * @param metricsId - Metrics ID to export
 * @param format - Export format (json, csv, pdf)
 * @returns Export data
 *
 * @example
 * ```typescript
 * const exported = await exportRemediationMetrics('metrics-123', 'json');
 * ```
 */
export declare function exportRemediationMetrics(metricsId: string, format: 'json' | 'csv' | 'pdf'): Promise<Record<string, any>>;
declare const _default: {
    getRemediationPlanModelAttributes: () => {
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
        title: {
            type: string;
            allowNull: boolean;
        };
        description: {
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
        scope: {
            type: string;
            allowNull: boolean;
        };
        objectives: {
            type: string;
            defaultValue: never[];
        };
        tasks: {
            type: string;
            defaultValue: never[];
        };
        affectedSystems: {
            type: string;
            defaultValue: never[];
        };
        estimatedEffort: {
            type: string;
            allowNull: boolean;
        };
        estimatedCost: {
            type: string;
            allowNull: boolean;
        };
        scheduledStartDate: {
            type: string;
            allowNull: boolean;
        };
        scheduledEndDate: {
            type: string;
            allowNull: boolean;
        };
        actualStartDate: {
            type: string;
            allowNull: boolean;
        };
        actualEndDate: {
            type: string;
            allowNull: boolean;
        };
        assignedTeam: {
            type: string;
            allowNull: boolean;
        };
        coordinatorId: {
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
        dependencies: {
            type: string;
            defaultValue: never[];
        };
        successCriteria: {
            type: string;
            defaultValue: never[];
        };
        rollbackPlan: {
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
    getRemediationTaskModelAttributes: () => {
        id: {
            type: string;
            defaultValue: string;
            primaryKey: boolean;
        };
        planId: {
            type: string;
            allowNull: boolean;
            references: {
                model: string;
                key: string;
            };
            onDelete: string;
        };
        title: {
            type: string;
            allowNull: boolean;
        };
        description: {
            type: string;
            allowNull: boolean;
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
        assignedTo: {
            type: string;
            allowNull: boolean;
        };
        assignedTeam: {
            type: string;
            allowNull: boolean;
        };
        estimatedEffort: {
            type: string;
            allowNull: boolean;
        };
        actualEffort: {
            type: string;
            allowNull: boolean;
        };
        scheduledDate: {
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
        dueDate: {
            type: string;
            allowNull: boolean;
        };
        targetSystems: {
            type: string;
            defaultValue: never[];
        };
        prerequisites: {
            type: string;
            defaultValue: never[];
        };
        validationRequired: {
            type: string;
            defaultValue: boolean;
        };
        validationStatus: {
            type: string;
            allowNull: boolean;
        };
        validationResults: {
            type: string;
            defaultValue: never[];
        };
        automationAvailable: {
            type: string;
            defaultValue: boolean;
        };
        automationScript: {
            type: string;
            allowNull: boolean;
        };
        notes: {
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
    getPatchDeploymentModelAttributes: () => {
        id: {
            type: string;
            defaultValue: string;
            primaryKey: boolean;
        };
        patchId: {
            type: string;
            allowNull: boolean;
        };
        patchName: {
            type: string;
            allowNull: boolean;
        };
        patchVersion: {
            type: string;
            allowNull: boolean;
        };
        vendor: {
            type: string;
            allowNull: boolean;
        };
        severity: {
            type: string;
            allowNull: boolean;
        };
        cveIds: {
            type: string;
            defaultValue: never[];
        };
        deploymentStatus: {
            type: string;
            allowNull: boolean;
            defaultValue: string;
        };
        targetSystems: {
            type: string;
            defaultValue: never[];
        };
        deployedSystems: {
            type: string;
            defaultValue: never[];
        };
        failedSystems: {
            type: string;
            defaultValue: never[];
        };
        deploymentMethod: {
            type: string;
            allowNull: boolean;
        };
        scheduledDate: {
            type: string;
            allowNull: boolean;
        };
        deploymentStartedAt: {
            type: string;
            allowNull: boolean;
        };
        deploymentCompletedAt: {
            type: string;
            allowNull: boolean;
        };
        rollbackAvailable: {
            type: string;
            defaultValue: boolean;
        };
        rollbackDeadline: {
            type: string;
            allowNull: boolean;
        };
        testingRequired: {
            type: string;
            defaultValue: boolean;
        };
        testingStatus: {
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
        successRate: {
            type: string;
            allowNull: boolean;
        };
        notes: {
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
    getConfigurationHardeningModelAttributes: () => {
        id: {
            type: string;
            defaultValue: string;
            primaryKey: boolean;
        };
        title: {
            type: string;
            allowNull: boolean;
        };
        description: {
            type: string;
            allowNull: boolean;
        };
        targetType: {
            type: string;
            allowNull: boolean;
        };
        targetIds: {
            type: string;
            defaultValue: never[];
        };
        hardeningStandard: {
            type: string;
            allowNull: boolean;
        };
        baselineId: {
            type: string;
            allowNull: boolean;
        };
        status: {
            type: string;
            allowNull: boolean;
            defaultValue: string;
        };
        configurationChanges: {
            type: string;
            defaultValue: never[];
        };
        validationChecks: {
            type: string;
            defaultValue: never[];
        };
        implementedAt: {
            type: string;
            allowNull: boolean;
        };
        implementedBy: {
            type: string;
            allowNull: boolean;
        };
        validatedAt: {
            type: string;
            allowNull: boolean;
        };
        complianceScore: {
            type: string;
            allowNull: boolean;
        };
        findings: {
            type: string;
            defaultValue: never[];
        };
        remediationPlanId: {
            type: string;
            allowNull: boolean;
            references: {
                model: string;
                key: string;
            };
            onDelete: string;
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
    getReoccurrencePreventionModelAttributes: () => {
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
        remediationPlanId: {
            type: string;
            allowNull: boolean;
            references: {
                model: string;
                key: string;
            };
            onDelete: string;
        };
        measureType: {
            type: string;
            allowNull: boolean;
        };
        title: {
            type: string;
            allowNull: boolean;
        };
        description: {
            type: string;
            allowNull: boolean;
        };
        status: {
            type: string;
            allowNull: boolean;
            defaultValue: string;
        };
        implementationSteps: {
            type: string;
            defaultValue: never[];
        };
        targetCompletionDate: {
            type: string;
            allowNull: boolean;
        };
        implementedAt: {
            type: string;
            allowNull: boolean;
        };
        effectiveness: {
            type: string;
            allowNull: boolean;
        };
        monitoringEnabled: {
            type: string;
            defaultValue: boolean;
        };
        monitoringMetrics: {
            type: string;
            defaultValue: never[];
        };
        reviewFrequency: {
            type: string;
            allowNull: boolean;
        };
        nextReviewDate: {
            type: string;
            allowNull: boolean;
        };
        assignedTo: {
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
    getSLATrackingModelAttributes: () => {
        id: {
            type: string;
            defaultValue: string;
            primaryKey: boolean;
        };
        remediationPlanId: {
            type: string;
            allowNull: boolean;
            references: {
                model: string;
                key: string;
            };
            onDelete: string;
        };
        taskId: {
            type: string;
            allowNull: boolean;
            references: {
                model: string;
                key: string;
            };
            onDelete: string;
        };
        slaType: {
            type: string;
            allowNull: boolean;
        };
        priority: {
            type: string;
            allowNull: boolean;
        };
        targetDuration: {
            type: string;
            allowNull: boolean;
        };
        startedAt: {
            type: string;
            allowNull: boolean;
        };
        dueDate: {
            type: string;
            allowNull: boolean;
        };
        completedAt: {
            type: string;
            allowNull: boolean;
        };
        actualDuration: {
            type: string;
            allowNull: boolean;
        };
        status: {
            type: string;
            allowNull: boolean;
            defaultValue: string;
        };
        breached: {
            type: string;
            defaultValue: boolean;
        };
        breachReason: {
            type: string;
            allowNull: boolean;
        };
        extensionGranted: {
            type: string;
            defaultValue: boolean;
        };
        extensionReason: {
            type: string;
            allowNull: boolean;
        };
        escalationLevel: {
            type: string;
            defaultValue: number;
        };
        escalatedTo: {
            type: string;
            defaultValue: never[];
        };
        escalatedAt: {
            type: string;
            allowNull: boolean;
        };
        notifications: {
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
    getPostRemediationValidationModelAttributes: () => {
        id: {
            type: string;
            defaultValue: string;
            primaryKey: boolean;
        };
        remediationPlanId: {
            type: string;
            allowNull: boolean;
            references: {
                model: string;
                key: string;
            };
            onDelete: string;
        };
        validationType: {
            type: string;
            allowNull: boolean;
        };
        status: {
            type: string;
            allowNull: boolean;
            defaultValue: string;
        };
        scheduledDate: {
            type: string;
            allowNull: boolean;
        };
        performedAt: {
            type: string;
            allowNull: boolean;
        };
        performedBy: {
            type: string;
            allowNull: boolean;
        };
        validationChecks: {
            type: string;
            defaultValue: never[];
        };
        overallResult: {
            type: string;
            allowNull: boolean;
        };
        findings: {
            type: string;
            defaultValue: never[];
        };
        recommendations: {
            type: string;
            defaultValue: never[];
        };
        requiresFollowUp: {
            type: string;
            defaultValue: boolean;
        };
        followUpTasks: {
            type: string;
            defaultValue: never[];
        };
        certificationGranted: {
            type: string;
            defaultValue: boolean;
        };
        certifiedBy: {
            type: string;
            allowNull: boolean;
        };
        certifiedAt: {
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
    createRemediationPlan: typeof createRemediationPlan;
    addRemediationTask: typeof addRemediationTask;
    generateTaskDependencies: typeof generateTaskDependencies;
    prioritizeRemediationTasks: typeof prioritizeRemediationTasks;
    estimateRemediationTimeline: typeof estimateRemediationTimeline;
    approveRemediationPlan: typeof approveRemediationPlan;
    createPatchDeployment: typeof createPatchDeployment;
    executePatchDeployment: typeof executePatchDeployment;
    trackPatchProgress: typeof trackPatchProgress;
    validatePatchInstallation: typeof validatePatchInstallation;
    rollbackPatchDeployment: typeof rollbackPatchDeployment;
    createConfigurationHardening: typeof createConfigurationHardening;
    applyConfigurationHardening: typeof applyConfigurationHardening;
    validateHardeningCompliance: typeof validateHardeningCompliance;
    generateHardeningBaseline: typeof generateHardeningBaseline;
    compareAgainstBaseline: typeof compareAgainstBaseline;
    performRemediationValidation: typeof performRemediationValidation;
    executeValidationTests: typeof executeValidationTests;
    verifyVulnerabilityRemediation: typeof verifyVulnerabilityRemediation;
    validateSecurityControls: typeof validateSecurityControls;
    certifyRemediationCompletion: typeof certifyRemediationCompletion;
    createPreventionMeasure: typeof createPreventionMeasure;
    implementPreventionMeasure: typeof implementPreventionMeasure;
    measurePreventionEffectiveness: typeof measurePreventionEffectiveness;
    schedulePreventionReview: typeof schedulePreventionReview;
    analyzeIncidentPatterns: typeof analyzeIncidentPatterns;
    createSLATracking: typeof createSLATracking;
    updateSLAStatus: typeof updateSLAStatus;
    escalateSLABreach: typeof escalateSLABreach;
    grantSLAExtension: typeof grantSLAExtension;
    monitorSLACompliance: typeof monitorSLACompliance;
    calculateRemediationMetrics: typeof calculateRemediationMetrics;
    generateRemediationDashboard: typeof generateRemediationDashboard;
    analyzeRemediationTrends: typeof analyzeRemediationTrends;
    generatePerformanceReport: typeof generatePerformanceReport;
    compareRemediationPeriods: typeof compareRemediationPeriods;
    exportRemediationMetrics: typeof exportRemediationMetrics;
};
export default _default;
//# sourceMappingURL=remediation-tracking-kit.d.ts.map