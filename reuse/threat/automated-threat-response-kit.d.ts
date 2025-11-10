/**
 * LOC: AUTOTHRRSP001
 * File: /reuse/threat/automated-threat-response-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - crypto (Node.js built-in)
 *
 * DOWNSTREAM (imported by):
 *   - Automated incident response services
 *   - SOAR platform integrations
 *   - Response orchestration engines
 *   - Security automation modules
 *   - Playbook execution services
 *   - Threat containment systems
 */
/**
 * Automated incident response playbook definition
 */
export interface ResponsePlaybook {
    id: string;
    name: string;
    description: string;
    version: string;
    threatTypes: ThreatType[];
    severity: ResponseSeverity;
    triggers: PlaybookTrigger[];
    steps: ResponseStep[];
    approvalRequired: boolean;
    autoExecute: boolean;
    maxExecutionTime: number;
    rollbackOnFailure: boolean;
    rollbackSteps?: RollbackStep[];
    impactAssessment: ImpactAssessmentConfig;
    successCriteria: SuccessCriteria;
    tags: string[];
    isActive: boolean;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    metadata?: Record<string, any>;
}
/**
 * Threat types for playbook triggers
 */
export declare enum ThreatType {
    MALWARE = "MALWARE",
    RANSOMWARE = "RANSOMWARE",
    PHISHING = "PHISHING",
    DATA_EXFILTRATION = "DATA_EXFILTRATION",
    BRUTE_FORCE = "BRUTE_FORCE",
    DDoS = "DDoS",
    UNAUTHORIZED_ACCESS = "UNAUTHORIZED_ACCESS",
    PRIVILEGE_ESCALATION = "PRIVILEGE_ESCALATION",
    LATERAL_MOVEMENT = "LATERAL_MOVEMENT",
    COMMAND_AND_CONTROL = "COMMAND_AND_CONTROL",
    ZERO_DAY = "ZERO_DAY",
    INSIDER_THREAT = "INSIDER_THREAT"
}
/**
 * Response severity levels
 */
export declare enum ResponseSeverity {
    CRITICAL = "CRITICAL",
    HIGH = "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "LOW",
    INFO = "INFO"
}
/**
 * Playbook trigger configuration
 */
export interface PlaybookTrigger {
    id: string;
    type: TriggerType;
    condition: string;
    parameters: Record<string, any>;
    priority: number;
    enabled: boolean;
}
/**
 * Trigger types for automated responses
 */
export declare enum TriggerType {
    IOC_DETECTED = "IOC_DETECTED",
    THREAT_SCORE_THRESHOLD = "THREAT_SCORE_THRESHOLD",
    BEHAVIORAL_ANOMALY = "BEHAVIORAL_ANOMALY",
    POLICY_VIOLATION = "POLICY_VIOLATION",
    MANUAL = "MANUAL",
    SCHEDULED = "SCHEDULED",
    CASCADE = "CASCADE"
}
/**
 * Response step in playbook execution
 */
export interface ResponseStep {
    id: string;
    order: number;
    name: string;
    action: ResponseAction;
    parameters: Record<string, any>;
    conditions?: StepCondition[];
    timeout: number;
    retryPolicy?: RetryPolicy;
    runAsynchronously: boolean;
    critical: boolean;
    expectedOutcome?: string;
}
/**
 * Available response actions
 */
export declare enum ResponseAction {
    BLOCK_IP = "BLOCK_IP",
    BLOCK_DOMAIN = "BLOCK_DOMAIN",
    BLOCK_URL = "BLOCK_URL",
    QUARANTINE_FILE = "QUARANTINE_FILE",
    QUARANTINE_EMAIL = "QUARANTINE_EMAIL",
    ISOLATE_ENDPOINT = "ISOLATE_ENDPOINT",
    ISOLATE_NETWORK_SEGMENT = "ISOLATE_NETWORK_SEGMENT",
    DISABLE_USER_ACCOUNT = "DISABLE_USER_ACCOUNT",
    RESET_PASSWORD = "RESET_PASSWORD",
    REVOKE_SESSION = "REVOKE_SESSION",
    KILL_PROCESS = "KILL_PROCESS",
    SNAPSHOT_SYSTEM = "SNAPSHOT_SYSTEM",
    COLLECT_FORENSICS = "COLLECT_FORENSICS",
    NOTIFY_TEAM = "NOTIFY_TEAM",
    CREATE_TICKET = "CREATE_TICKET",
    RUN_SCRIPT = "RUN_SCRIPT",
    PATCH_SYSTEM = "PATCH_SYSTEM",
    UPDATE_FIREWALL_RULE = "UPDATE_FIREWALL_RULE",
    ENABLE_MFA = "ENABLE_MFA",
    BACKUP_DATA = "BACKUP_DATA"
}
/**
 * Step execution condition
 */
export interface StepCondition {
    field: string;
    operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'regex';
    value: any;
    logicalOperator?: 'AND' | 'OR';
}
/**
 * Retry policy for failed steps
 */
export interface RetryPolicy {
    maxRetries: number;
    backoffMs: number;
    backoffMultiplier: number;
    maxBackoffMs: number;
}
/**
 * Rollback step definition
 */
export interface RollbackStep {
    id: string;
    order: number;
    action: ResponseAction;
    parameters: Record<string, any>;
    condition?: string;
}
/**
 * Impact assessment configuration
 */
export interface ImpactAssessmentConfig {
    enabled: boolean;
    assessmentCriteria: AssessmentCriteria[];
    minConfidenceScore: number;
    requiresApprovalIfHighImpact: boolean;
    highImpactThreshold: number;
}
/**
 * Assessment criteria for impact analysis
 */
export interface AssessmentCriteria {
    metric: string;
    threshold: number;
    weight: number;
}
/**
 * Success criteria for playbook execution
 */
export interface SuccessCriteria {
    requiredSuccessfulSteps: number;
    threatContained: boolean;
    systemsRestored: boolean;
    noDataLoss: boolean;
    customCriteria?: Record<string, any>;
}
/**
 * Response execution instance
 */
export interface ResponseExecution {
    id: string;
    playbookId: string;
    playbookVersion: string;
    status: ExecutionStatus;
    triggeredBy: string;
    triggerType: TriggerType;
    triggerData: Record<string, any>;
    startedAt: Date;
    completedAt?: Date;
    duration?: number;
    executedSteps: ExecutedStep[];
    impactAssessment?: ImpactAssessmentResult;
    effectivenessScore?: number;
    rollbackExecuted: boolean;
    errors: ExecutionError[];
    auditTrail: AuditEntry[];
    metadata?: Record<string, any>;
}
/**
 * Execution status
 */
export declare enum ExecutionStatus {
    PENDING = "PENDING",
    ASSESSING_IMPACT = "ASSESSING_IMPACT",
    AWAITING_APPROVAL = "AWAITING_APPROVAL",
    RUNNING = "RUNNING",
    PAUSED = "PAUSED",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    ROLLED_BACK = "ROLLED_BACK",
    CANCELLED = "CANCELLED"
}
/**
 * Executed step result
 */
export interface ExecutedStep {
    stepId: string;
    stepName: string;
    action: ResponseAction;
    status: StepStatus;
    startedAt: Date;
    completedAt?: Date;
    duration?: number;
    result?: Record<string, any>;
    error?: string;
    retryCount: number;
}
/**
 * Step execution status
 */
export declare enum StepStatus {
    PENDING = "PENDING",
    RUNNING = "RUNNING",
    SUCCESS = "SUCCESS",
    FAILED = "FAILED",
    SKIPPED = "SKIPPED",
    ROLLED_BACK = "ROLLED_BACK"
}
/**
 * Execution error details
 */
export interface ExecutionError {
    timestamp: Date;
    stepId?: string;
    errorCode: string;
    message: string;
    stack?: string;
    recoverable: boolean;
}
/**
 * Impact assessment result
 */
export interface ImpactAssessmentResult {
    overallScore: number;
    confidenceScore: number;
    assessments: {
        metric: string;
        score: number;
        details: string;
    }[];
    affectedSystems: string[];
    affectedUsers: string[];
    estimatedDowntime?: number;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    recommendation: string;
    timestamp: Date;
}
/**
 * Audit trail entry
 */
export interface AuditEntry {
    id: string;
    timestamp: Date;
    action: string;
    actor: string;
    details: Record<string, any>;
    outcome: 'SUCCESS' | 'FAILURE';
}
/**
 * Response effectiveness metrics
 */
export interface EffectivenessMetrics {
    executionId: string;
    timeToResponse: number;
    timeToContainment: number;
    threatsBlocked: number;
    assetsProtected: number;
    falsePositives: number;
    falseNegatives: number;
    successRate: number;
    rollbackRate: number;
    averageExecutionTime: number;
    impactScore: number;
    recommendedImprovements: string[];
}
/**
 * Response orchestration workflow
 */
export interface OrchestrationWorkflow {
    id: string;
    name: string;
    description: string;
    playbooks: string[];
    parallelExecution: boolean;
    coordinationRules: CoordinationRule[];
    status: ExecutionStatus;
    createdAt: Date;
}
/**
 * Coordination rule for workflow execution
 */
export interface CoordinationRule {
    condition: string;
    action: 'WAIT' | 'PROCEED' | 'SKIP' | 'ABORT';
    dependencies: string[];
}
/**
 * Sequelize ResponsePlaybook model attributes.
 *
 * @example
 * ```typescript
 * import { Table, Model } from 'sequelize-typescript';
 *
 * @Table({ tableName: 'response_playbooks', timestamps: true })
 * class ResponsePlaybookModel extends Model {
 *   // Use attributes from getResponsePlaybookModelAttributes()
 * }
 * ```
 */
export declare const getResponsePlaybookModelAttributes: () => {
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
    version: {
        type: string;
        allowNull: boolean;
        defaultValue: string;
    };
    threatTypes: {
        type: string;
        defaultValue: never[];
    };
    severity: {
        type: string;
        allowNull: boolean;
    };
    triggers: {
        type: string;
        defaultValue: never[];
    };
    steps: {
        type: string;
        defaultValue: never[];
    };
    approvalRequired: {
        type: string;
        defaultValue: boolean;
    };
    autoExecute: {
        type: string;
        defaultValue: boolean;
    };
    maxExecutionTime: {
        type: string;
        defaultValue: number;
    };
    rollbackOnFailure: {
        type: string;
        defaultValue: boolean;
    };
    rollbackSteps: {
        type: string;
        allowNull: boolean;
    };
    impactAssessment: {
        type: string;
        defaultValue: {};
    };
    successCriteria: {
        type: string;
        defaultValue: {};
    };
    tags: {
        type: string;
        defaultValue: never[];
    };
    isActive: {
        type: string;
        defaultValue: boolean;
    };
    createdBy: {
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
 * Sequelize ResponseExecution model attributes.
 *
 * @example
 * ```typescript
 * import { Test, TestingModule } from '@nestjs/testing';
 * import { getSequelize } from 'sequelize-typescript';
 *
 * describe('ResponseExecution Model', () => {
 *   let model: typeof ResponseExecutionModel;
 *
 *   beforeEach(async () => {
 *     const module: TestingModule = await Test.createTestingModule({
 *       providers: [
 *         {
 *           provide: 'ResponseExecutionRepository',
 *           useValue: mockRepository,
 *         },
 *       ],
 *     }).compile();
 *   });
 *
 *   it('should create execution record', async () => {
 *     const execution = await model.create({
 *       playbookId: 'playbook-123',
 *       status: ExecutionStatus.PENDING,
 *       triggeredBy: 'system',
 *     });
 *     expect(execution.id).toBeDefined();
 *   });
 * });
 * ```
 */
export declare const getResponseExecutionModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    playbookId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    playbookVersion: {
        type: string;
        allowNull: boolean;
    };
    status: {
        type: string;
        allowNull: boolean;
        defaultValue: ExecutionStatus;
    };
    triggeredBy: {
        type: string;
        allowNull: boolean;
    };
    triggerType: {
        type: string;
        allowNull: boolean;
    };
    triggerData: {
        type: string;
        defaultValue: {};
    };
    startedAt: {
        type: string;
        allowNull: boolean;
    };
    completedAt: {
        type: string;
        allowNull: boolean;
    };
    duration: {
        type: string;
        allowNull: boolean;
    };
    executedSteps: {
        type: string;
        defaultValue: never[];
    };
    impactAssessment: {
        type: string;
        allowNull: boolean;
    };
    effectivenessScore: {
        type: string;
        allowNull: boolean;
        validate: {
            min: number;
            max: number;
        };
    };
    rollbackExecuted: {
        type: string;
        defaultValue: boolean;
    };
    errors: {
        type: string;
        defaultValue: never[];
    };
    auditTrail: {
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
 * Sequelize ResponseAuditLog model attributes for HIPAA compliance.
 *
 * @example
 * ```typescript
 * // NestJS Service Test
 * describe('ResponseAuditService', () => {
 *   let service: ResponseAuditService;
 *   let repository: Repository<ResponseAuditLog>;
 *
 *   beforeEach(async () => {
 *     const module: TestingModule = await Test.createTestingModule({
 *       providers: [
 *         ResponseAuditService,
 *         {
 *           provide: getRepositoryToken(ResponseAuditLog),
 *           useValue: mockRepository,
 *         },
 *       ],
 *     }).compile();
 *
 *     service = module.get<ResponseAuditService>(ResponseAuditService);
 *   });
 *
 *   it('should log response action', async () => {
 *     const entry = await service.logAction('BLOCK_IP', '192.168.1.1', 'admin');
 *     expect(entry.action).toBe('BLOCK_IP');
 *   });
 * });
 * ```
 */
export declare const getResponseAuditLogModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    executionId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    timestamp: {
        type: string;
        allowNull: boolean;
        defaultValue: string;
    };
    action: {
        type: string;
        allowNull: boolean;
    };
    actor: {
        type: string;
        allowNull: boolean;
    };
    actorType: {
        type: string;
        allowNull: boolean;
    };
    details: {
        type: string;
        defaultValue: {};
    };
    outcome: {
        type: string;
        allowNull: boolean;
    };
    ipAddress: {
        type: string;
        allowNull: boolean;
    };
    userAgent: {
        type: string;
        allowNull: boolean;
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
};
/**
 * Creates a new automated response playbook.
 *
 * @param {Partial<ResponsePlaybook>} playbookData - Playbook configuration
 * @returns {Promise<ResponsePlaybook>} Created playbook
 *
 * @example
 * ```typescript
 * const playbook = await createResponsePlaybook({
 *   name: 'Ransomware Auto-Response',
 *   threatTypes: [ThreatType.RANSOMWARE],
 *   severity: ResponseSeverity.CRITICAL,
 *   steps: [
 *     {
 *       order: 1,
 *       action: ResponseAction.ISOLATE_ENDPOINT,
 *       parameters: { immediate: true }
 *     }
 *   ],
 *   autoExecute: true
 * });
 * ```
 */
export declare const createResponsePlaybook: (playbookData: Partial<ResponsePlaybook>) => Promise<ResponsePlaybook>;
/**
 * Validates playbook configuration for consistency and completeness.
 *
 * @param {ResponsePlaybook} playbook - Playbook to validate
 * @returns {Promise<{ valid: boolean; errors: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validatePlaybook(playbook);
 * if (!validation.valid) {
 *   console.error('Playbook errors:', validation.errors);
 * }
 * ```
 */
export declare const validatePlaybook: (playbook: ResponsePlaybook) => Promise<{
    valid: boolean;
    errors: string[];
}>;
/**
 * Evaluates playbook triggers against threat data to determine if playbook should execute.
 *
 * @param {ResponsePlaybook} playbook - Playbook to evaluate
 * @param {Record<string, any>} threatData - Current threat data
 * @returns {Promise<{ shouldExecute: boolean; matchedTriggers: PlaybookTrigger[] }>} Trigger evaluation
 *
 * @example
 * ```typescript
 * const evaluation = await evaluatePlaybookTriggers(playbook, {
 *   threatType: ThreatType.RANSOMWARE,
 *   severity: 'CRITICAL',
 *   affectedAssets: 15
 * });
 * if (evaluation.shouldExecute) {
 *   await executePlaybook(playbook.id, threatData);
 * }
 * ```
 */
export declare const evaluatePlaybookTriggers: (playbook: ResponsePlaybook, threatData: Record<string, any>) => Promise<{
    shouldExecute: boolean;
    matchedTriggers: PlaybookTrigger[];
}>;
/**
 * Updates an existing playbook with new configuration.
 *
 * @param {string} playbookId - Playbook identifier
 * @param {Partial<ResponsePlaybook>} updates - Fields to update
 * @returns {Promise<ResponsePlaybook>} Updated playbook
 *
 * @example
 * ```typescript
 * const updated = await updatePlaybook('playbook-123', {
 *   isActive: false,
 *   steps: [...newSteps]
 * });
 * ```
 */
export declare const updatePlaybook: (playbookId: string, updates: Partial<ResponsePlaybook>) => Promise<ResponsePlaybook>;
/**
 * Clones an existing playbook with a new name.
 *
 * @param {string} playbookId - Source playbook ID
 * @param {string} newName - Name for cloned playbook
 * @returns {Promise<ResponsePlaybook>} Cloned playbook
 *
 * @example
 * ```typescript
 * const clone = await clonePlaybook('playbook-123', 'Ransomware Response v2');
 * ```
 */
export declare const clonePlaybook: (playbookId: string, newName: string) => Promise<ResponsePlaybook>;
/**
 * Executes a Block IP action on network infrastructure.
 *
 * @param {string} ipAddress - IP address to block
 * @param {Record<string, any>} options - Block options (duration, scope, etc.)
 * @returns {Promise<{ success: boolean; blockedAt: Date; expiresAt?: Date }>} Block result
 *
 * @example
 * ```typescript
 * const result = await executeBlockIP('192.168.1.100', {
 *   duration: 3600000, // 1 hour
 *   scope: 'firewall',
 *   reason: 'Malicious activity detected'
 * });
 * ```
 */
export declare const executeBlockIP: (ipAddress: string, options: Record<string, any>) => Promise<{
    success: boolean;
    blockedAt: Date;
    expiresAt?: Date;
}>;
/**
 * Executes a Quarantine File action.
 *
 * @param {string} filePath - File path to quarantine
 * @param {Record<string, any>} options - Quarantine options
 * @returns {Promise<{ success: boolean; quarantinePath: string; hash: string }>} Quarantine result
 *
 * @example
 * ```typescript
 * const result = await executeQuarantineFile('/tmp/suspicious.exe', {
 *   preserveMetadata: true,
 *   createBackup: true
 * });
 * ```
 */
export declare const executeQuarantineFile: (filePath: string, options: Record<string, any>) => Promise<{
    success: boolean;
    quarantinePath: string;
    hash: string;
}>;
/**
 * Executes an Isolate Endpoint action.
 *
 * @param {string} endpointId - Endpoint identifier
 * @param {Record<string, any>} options - Isolation options
 * @returns {Promise<{ success: boolean; isolatedAt: Date; allowedConnections: string[] }>} Isolation result
 *
 * @example
 * ```typescript
 * const result = await executeIsolateEndpoint('endpoint-456', {
 *   allowManagement: true,
 *   notifyUser: true
 * });
 * ```
 */
export declare const executeIsolateEndpoint: (endpointId: string, options: Record<string, any>) => Promise<{
    success: boolean;
    isolatedAt: Date;
    allowedConnections: string[];
}>;
/**
 * Executes a Disable User Account action.
 *
 * @param {string} userId - User identifier
 * @param {Record<string, any>} options - Disable options
 * @returns {Promise<{ success: boolean; disabledAt: Date; sessionsRevoked: number }>} Disable result
 *
 * @example
 * ```typescript
 * const result = await executeDisableUserAccount('user-789', {
 *   revokeAllSessions: true,
 *   notifyUser: false,
 *   reason: 'Compromised credentials'
 * });
 * ```
 */
export declare const executeDisableUserAccount: (userId: string, options: Record<string, any>) => Promise<{
    success: boolean;
    disabledAt: Date;
    sessionsRevoked: number;
}>;
/**
 * Executes a Kill Process action on endpoint.
 *
 * @param {string} endpointId - Endpoint identifier
 * @param {string} processId - Process ID to kill
 * @param {Record<string, any>} options - Kill options
 * @returns {Promise<{ success: boolean; killedAt: Date; processDetails: Record<string, any> }>} Kill result
 *
 * @example
 * ```typescript
 * const result = await executeKillProcess('endpoint-456', '1234', {
 *   force: true,
 *   collectForensics: true
 * });
 * ```
 */
export declare const executeKillProcess: (endpointId: string, processId: string, options: Record<string, any>) => Promise<{
    success: boolean;
    killedAt: Date;
    processDetails: Record<string, any>;
}>;
/**
 * Executes a Snapshot System action for forensics.
 *
 * @param {string} systemId - System identifier
 * @param {Record<string, any>} options - Snapshot options
 * @returns {Promise<{ success: boolean; snapshotId: string; createdAt: Date; size: number }>} Snapshot result
 *
 * @example
 * ```typescript
 * const result = await executeSnapshotSystem('server-001', {
 *   includeMemory: true,
 *   compression: 'gzip'
 * });
 * ```
 */
export declare const executeSnapshotSystem: (systemId: string, options: Record<string, any>) => Promise<{
    success: boolean;
    snapshotId: string;
    createdAt: Date;
    size: number;
}>;
/**
 * Executes a Collect Forensics action.
 *
 * @param {string} targetId - Target identifier (endpoint, server, etc.)
 * @param {Record<string, any>} options - Collection options
 * @returns {Promise<{ success: boolean; collectionId: string; artifacts: string[] }>} Collection result
 *
 * @example
 * ```typescript
 * const result = await executeCollectForensics('endpoint-456', {
 *   artifactTypes: ['memory', 'disk', 'network', 'logs'],
 *   preserveTimestamps: true
 * });
 * ```
 */
export declare const executeCollectForensics: (targetId: string, options: Record<string, any>) => Promise<{
    success: boolean;
    collectionId: string;
    artifacts: string[];
}>;
/**
 * Executes a response playbook with full orchestration.
 *
 * @param {string} playbookId - Playbook to execute
 * @param {Record<string, any>} triggerData - Trigger context data
 * @param {string} triggeredBy - Who/what triggered execution
 * @returns {Promise<ResponseExecution>} Execution result
 *
 * @example
 * ```typescript
 * const execution = await executeResponsePlaybook('playbook-123', {
 *   threatType: ThreatType.RANSOMWARE,
 *   affectedSystems: ['server-01', 'server-02'],
 *   severity: 'CRITICAL'
 * }, 'automation-engine');
 * ```
 */
export declare const executeResponsePlaybook: (playbookId: string, triggerData: Record<string, any>, triggeredBy: string) => Promise<ResponseExecution>;
/**
 * Executes a single response step with retry logic.
 *
 * @param {ResponseStep} step - Step to execute
 * @param {ResponseExecution} execution - Current execution context
 * @returns {Promise<ExecutedStep>} Step execution result
 *
 * @example
 * ```typescript
 * const stepResult = await executeResponseStep(
 *   {
 *     order: 1,
 *     action: ResponseAction.BLOCK_IP,
 *     parameters: { ipAddress: '192.168.1.100' }
 *   },
 *   execution
 * );
 * ```
 */
export declare const executeResponseStep: (step: ResponseStep, execution: ResponseExecution) => Promise<ExecutedStep>;
/**
 * Evaluates conditional response logic to determine if step should execute.
 *
 * @param {StepCondition[]} conditions - Conditions to evaluate
 * @param {Record<string, any>} runtimeData - Runtime data for evaluation
 * @returns {Promise<boolean>} True if conditions are met
 *
 * @example
 * ```typescript
 * const shouldExecute = await evaluateStepConditions(
 *   [
 *     { field: 'threatScore', operator: 'greater_than', value: 80 },
 *     { field: 'affectedSystems', operator: 'greater_than', value: 5, logicalOperator: 'AND' }
 *   ],
 *   { threatScore: 95, affectedSystems: 10 }
 * );
 * ```
 */
export declare const evaluateStepConditions: (conditions: StepCondition[], runtimeData: Record<string, any>) => Promise<boolean>;
/**
 * Orchestrates parallel execution of multiple response actions.
 *
 * @param {ResponseStep[]} steps - Steps to execute in parallel
 * @param {ResponseExecution} execution - Execution context
 * @returns {Promise<ExecutedStep[]>} All step results
 *
 * @example
 * ```typescript
 * const results = await orchestrateParallelSteps(
 *   [
 *     { order: 1, action: ResponseAction.BLOCK_IP, parameters: { ipAddress: '1.2.3.4' } },
 *     { order: 2, action: ResponseAction.BLOCK_IP, parameters: { ipAddress: '5.6.7.8' } }
 *   ],
 *   execution
 * );
 * ```
 */
export declare const orchestrateParallelSteps: (steps: ResponseStep[], execution: ResponseExecution) => Promise<ExecutedStep[]>;
/**
 * Orchestrates sequential execution with dependency management.
 *
 * @param {ResponseStep[]} steps - Steps to execute sequentially
 * @param {ResponseExecution} execution - Execution context
 * @returns {Promise<ExecutedStep[]>} All step results
 *
 * @example
 * ```typescript
 * const results = await orchestrateSequentialSteps(
 *   [
 *     { order: 1, action: ResponseAction.SNAPSHOT_SYSTEM, parameters: {} },
 *     { order: 2, action: ResponseAction.ISOLATE_ENDPOINT, parameters: {} },
 *     { order: 3, action: ResponseAction.COLLECT_FORENSICS, parameters: {} }
 *   ],
 *   execution
 * );
 * ```
 */
export declare const orchestrateSequentialSteps: (steps: ResponseStep[], execution: ResponseExecution) => Promise<ExecutedStep[]>;
/**
 * Executes rollback procedures after failed response.
 *
 * @param {ResponseExecution} execution - Failed execution to rollback
 * @param {RollbackStep[]} rollbackSteps - Rollback steps to execute
 * @returns {Promise<{ success: boolean; rolledBackSteps: ExecutedStep[] }>} Rollback result
 *
 * @example
 * ```typescript
 * const rollback = await executeResponseRollback(failedExecution, [
 *   { order: 1, action: ResponseAction.BLOCK_IP, parameters: { action: 'unblock' } }
 * ]);
 * ```
 */
export declare const executeResponseRollback: (execution: ResponseExecution, rollbackSteps: RollbackStep[]) => Promise<{
    success: boolean;
    rolledBackSteps: ExecutedStep[];
}>;
/**
 * Creates automatic rollback steps based on executed actions.
 *
 * @param {ExecutedStep[]} executedSteps - Steps to create rollback for
 * @returns {Promise<RollbackStep[]>} Generated rollback steps
 *
 * @example
 * ```typescript
 * const rollbackSteps = await generateRollbackSteps(execution.executedSteps);
 * ```
 */
export declare const generateRollbackSteps: (executedSteps: ExecutedStep[]) => Promise<RollbackStep[]>;
/**
 * Validates rollback safety before execution.
 *
 * @param {ResponseExecution} execution - Execution to rollback
 * @returns {Promise<{ safe: boolean; risks: string[] }>} Safety assessment
 *
 * @example
 * ```typescript
 * const safety = await validateRollbackSafety(execution);
 * if (!safety.safe) {
 *   console.warn('Rollback risks:', safety.risks);
 * }
 * ```
 */
export declare const validateRollbackSafety: (execution: ResponseExecution) => Promise<{
    safe: boolean;
    risks: string[];
}>;
/**
 * Performs impact assessment before executing response.
 *
 * @param {ResponsePlaybook} playbook - Playbook to assess
 * @param {Record<string, any>} targetData - Data about affected targets
 * @returns {Promise<ImpactAssessmentResult>} Assessment result
 *
 * @example
 * ```typescript
 * const assessment = await performImpactAssessment(playbook, {
 *   affectedSystems: ['server-01', 'server-02'],
 *   affectedUsers: ['user1', 'user2'],
 *   businessHours: true
 * });
 * if (assessment.riskLevel === 'HIGH') {
 *   // Require approval
 * }
 * ```
 */
export declare const performImpactAssessment: (playbook: ResponsePlaybook, targetData: Record<string, any>) => Promise<ImpactAssessmentResult>;
/**
 * Calculates potential business impact of response actions.
 *
 * @param {ResponseStep[]} steps - Steps to analyze
 * @param {Record<string, any>} businessContext - Business context data
 * @returns {Promise<{ financialImpact: number; reputationalImpact: number; operationalImpact: number }>} Business impact
 *
 * @example
 * ```typescript
 * const impact = await calculateBusinessImpact(playbook.steps, {
 *   revenue: 1000000,
 *   criticalSystems: ['payment-gateway', 'ehr-system']
 * });
 * ```
 */
export declare const calculateBusinessImpact: (steps: ResponseStep[], businessContext: Record<string, any>) => Promise<{
    financialImpact: number;
    reputationalImpact: number;
    operationalImpact: number;
}>;
/**
 * Estimates system downtime from response actions.
 *
 * @param {ResponseStep[]} steps - Steps to analyze
 * @returns {Promise<{ estimatedDowntime: number; bySystem: Record<string, number> }>} Downtime estimate in milliseconds
 *
 * @example
 * ```typescript
 * const downtime = await estimateResponseDowntime(playbook.steps);
 * console.log('Estimated downtime:', downtime.estimatedDowntime / 60000, 'minutes');
 * ```
 */
export declare const estimateResponseDowntime: (steps: ResponseStep[]) => Promise<{
    estimatedDowntime: number;
    bySystem: Record<string, number>;
}>;
/**
 * Logs a response action to audit trail for HIPAA compliance.
 *
 * @param {ResponseExecution} execution - Execution context
 * @param {string} action - Action performed
 * @param {string} actor - Who performed the action
 * @param {Record<string, any>} details - Action details
 * @returns {Promise<AuditEntry>} Created audit entry
 *
 * @example
 * ```typescript
 * await logResponseAction(execution, 'STEP_EXECUTED', 'system', {
 *   stepId: 'step-123',
 *   action: ResponseAction.BLOCK_IP,
 *   target: '192.168.1.100'
 * });
 * ```
 */
export declare const logResponseAction: (execution: ResponseExecution, action: string, actor: string, details: Record<string, any>) => Promise<AuditEntry>;
/**
 * Retrieves complete audit trail for a response execution.
 *
 * @param {string} executionId - Execution identifier
 * @returns {Promise<AuditEntry[]>} Complete audit trail
 *
 * @example
 * ```typescript
 * const trail = await getResponseAuditTrail('execution-123');
 * console.log('Total actions:', trail.length);
 * ```
 */
export declare const getResponseAuditTrail: (executionId: string) => Promise<AuditEntry[]>;
/**
 * Generates compliance report from audit trail.
 *
 * @param {string} executionId - Execution identifier
 * @returns {Promise<{ report: string; compliant: boolean; findings: string[] }>} Compliance report
 *
 * @example
 * ```typescript
 * const report = await generateComplianceReport('execution-123');
 * if (!report.compliant) {
 *   console.error('Compliance issues:', report.findings);
 * }
 * ```
 */
export declare const generateComplianceReport: (executionId: string) => Promise<{
    report: string;
    compliant: boolean;
    findings: string[];
}>;
/**
 * Calculates response effectiveness score.
 *
 * @param {ResponseExecution} execution - Completed execution
 * @returns {Promise<EffectivenessMetrics>} Effectiveness metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculateResponseEffectiveness(execution);
 * console.log('Success rate:', metrics.successRate, '%');
 * console.log('Threats blocked:', metrics.threatsBlocked);
 * ```
 */
export declare const calculateResponseEffectiveness: (execution: ResponseExecution) => Promise<EffectivenessMetrics>;
/**
 * Analyzes playbook performance over time.
 *
 * @param {string} playbookId - Playbook to analyze
 * @param {Date} startDate - Analysis start date
 * @param {Date} endDate - Analysis end date
 * @returns {Promise<{ executions: number; avgSuccessRate: number; avgDuration: number; trends: string[] }>} Performance analysis
 *
 * @example
 * ```typescript
 * const performance = await analyzePlaybookPerformance(
 *   'playbook-123',
 *   new Date('2025-01-01'),
 *   new Date('2025-01-31')
 * );
 * console.log('Average success rate:', performance.avgSuccessRate, '%');
 * ```
 */
export declare const analyzePlaybookPerformance: (playbookId: string, startDate: Date, endDate: Date) => Promise<{
    executions: number;
    avgSuccessRate: number;
    avgDuration: number;
    trends: string[];
}>;
/**
 * Identifies playbook optimization opportunities.
 *
 * @param {string} playbookId - Playbook to analyze
 * @returns {Promise<{ recommendations: Array<{ type: string; description: string; expectedImprovement: string }> }>} Optimization recommendations
 *
 * @example
 * ```typescript
 * const optimizations = await identifyPlaybookOptimizations('playbook-123');
 * optimizations.recommendations.forEach(rec => {
 *   console.log(`${rec.type}: ${rec.description}`);
 * });
 * ```
 */
export declare const identifyPlaybookOptimizations: (playbookId: string) => Promise<{
    recommendations: Array<{
        type: string;
        description: string;
        expectedImprovement: string;
    }>;
}>;
/**
 * Compares multiple response executions for trend analysis.
 *
 * @param {string[]} executionIds - Execution IDs to compare
 * @returns {Promise<{ comparison: Record<string, any>; insights: string[] }>} Comparison results
 *
 * @example
 * ```typescript
 * const comparison = await compareResponseExecutions([
 *   'exec-1', 'exec-2', 'exec-3'
 * ]);
 * console.log('Insights:', comparison.insights);
 * ```
 */
export declare const compareResponseExecutions: (executionIds: string[]) => Promise<{
    comparison: Record<string, any>;
    insights: string[];
}>;
/**
 * Generates response effectiveness dashboard data.
 *
 * @param {string} timeframe - Timeframe for dashboard ('24h', '7d', '30d')
 * @returns {Promise<Record<string, any>>} Dashboard data
 *
 * @example
 * ```typescript
 * const dashboard = await generateEffectivenessDashboard('7d');
 * console.log('Total responses:', dashboard.totalResponses);
 * console.log('Success rate:', dashboard.successRate, '%');
 * ```
 */
export declare const generateEffectivenessDashboard: (timeframe: string) => Promise<Record<string, any>>;
//# sourceMappingURL=automated-threat-response-kit.d.ts.map