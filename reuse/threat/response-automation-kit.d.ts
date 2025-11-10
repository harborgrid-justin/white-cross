/**
 * LOC: RESPAUTOM001
 * File: /reuse/threat/response-automation-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Security orchestration services
 *   - Incident response modules
 *   - SOAR platform integrations
 *   - Automated remediation systems
 *   - Playbook execution engines
 *   - Containment systems
 */
interface ResponsePlaybook {
    id: string;
    name: string;
    description: string;
    version: string;
    threatTypes: string[];
    severity: 'critical' | 'high' | 'medium' | 'low';
    triggers: Array<{
        type: string;
        condition: string;
        parameters: Record<string, any>;
    }>;
    steps: Array<{
        order: number;
        name: string;
        action: string;
        parameters: Record<string, any>;
        conditions?: string[];
        timeout?: number;
        retryPolicy?: {
            maxRetries: number;
            backoffMs: number;
        };
    }>;
    approvalRequired: boolean;
    autoExecute: boolean;
    isActive: boolean;
    successCriteria: Record<string, any>;
    rollbackSteps?: Array<{
        order: number;
        action: string;
        parameters: Record<string, any>;
    }>;
    metadata?: Record<string, any>;
}
interface AutomatedResponse {
    id: string;
    playbookId: string;
    triggerType: string;
    triggerData: Record<string, any>;
    status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled' | 'rollback';
    startedAt: Date;
    completedAt?: Date;
    executedSteps: Array<{
        stepOrder: number;
        stepName: string;
        status: 'success' | 'failed' | 'skipped';
        startedAt: Date;
        completedAt?: Date;
        result?: Record<string, any>;
        error?: string;
    }>;
    effectivenessScore?: number;
    impactAssessment?: {
        threatsBlocked: number;
        assetsProtected: number;
        falsePositives: number;
    };
    approvedBy?: string;
    approvedAt?: Date;
    metadata?: Record<string, any>;
}
interface SOARIntegration {
    id: string;
    platform: string;
    platformVersion: string;
    connectionType: 'api' | 'webhook' | 'agent';
    endpoint: string;
    credentials: {
        type: 'api_key' | 'oauth' | 'certificate';
        encryptedData: string;
    };
    capabilities: string[];
    status: 'active' | 'inactive' | 'error';
    lastSync?: Date;
    syncInterval?: number;
    mappings: {
        alertFields: Record<string, string>;
        actionMappings: Record<string, string>;
    };
    rateLimits?: {
        requestsPerMinute: number;
        requestsPerHour: number;
    };
    metadata?: Record<string, any>;
}
interface ContainmentAction {
    id: string;
    actionType: 'network_isolation' | 'endpoint_quarantine' | 'user_suspension' | 'service_shutdown' | 'traffic_blocking' | 'dns_sinkhole';
    targetType: 'ip' | 'host' | 'user' | 'service' | 'domain' | 'process';
    targetId: string;
    targetDetails: Record<string, any>;
    severity: 'critical' | 'high' | 'medium' | 'low';
    status: 'pending' | 'active' | 'completed' | 'failed' | 'reverted';
    executedAt: Date;
    revertedAt?: Date;
    duration?: number;
    autoRevert: boolean;
    revertAfter?: number;
    verification: {
        verified: boolean;
        verifiedAt?: Date;
        method: string;
        result?: Record<string, any>;
    };
    impactAssessment: {
        affectedUsers: number;
        affectedServices: number;
        businessImpact: 'critical' | 'high' | 'medium' | 'low';
    };
    metadata?: Record<string, any>;
}
interface RemediationWorkflow {
    id: string;
    workflowType: 'malware_removal' | 'config_hardening' | 'patch_deployment' | 'credential_reset' | 'permission_revoke' | 'system_restore';
    threatId?: string;
    targetAssets: string[];
    priority: 'critical' | 'high' | 'medium' | 'low';
    status: 'pending' | 'running' | 'completed' | 'failed' | 'paused';
    steps: Array<{
        order: number;
        name: string;
        action: string;
        status: 'pending' | 'running' | 'completed' | 'failed';
        result?: Record<string, any>;
    }>;
    validationChecks: Array<{
        name: string;
        type: string;
        passed: boolean;
        result?: Record<string, any>;
    }>;
    startedAt: Date;
    completedAt?: Date;
    successRate?: number;
    rollbackAvailable: boolean;
    metadata?: Record<string, any>;
}
interface PlaybookExecutionConfig {
    playbookId: string;
    triggerData: Record<string, any>;
    overrideParams?: Record<string, any>;
    dryRun?: boolean;
    skipApproval?: boolean;
}
interface SOARAction {
    actionType: string;
    parameters: Record<string, any>;
    timeout?: number;
    retries?: number;
}
interface ContainmentConfig {
    actionType: string;
    targets: string[];
    severity: string;
    autoRevert?: boolean;
    revertAfterSeconds?: number;
}
interface RemediationConfig {
    workflowType: string;
    targets: string[];
    priority: string;
    validationRequired?: boolean;
}
/**
 * Sequelize ResponsePlaybook model attributes for automated response workflows.
 *
 * @example
 * ```typescript
 * import { DataTypes, Model } from 'sequelize';
 *
 * class ResponsePlaybook extends Model {
 *   declare id: string;
 *   declare name: string;
 *   declare steps: any[];
 * }
 *
 * ResponsePlaybook.init(getResponsePlaybookModelAttributes(), {
 *   sequelize,
 *   tableName: 'response_playbooks',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['isActive', 'severity'] },
 *     { fields: ['threatTypes'], using: 'gin' },
 *     { fields: ['autoExecute'] }
 *   ]
 * });
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
        comment: string;
    };
    description: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    version: {
        type: string;
        allowNull: boolean;
        defaultValue: string;
        comment: string;
    };
    threatTypes: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    severity: {
        type: string;
        values: string[];
        allowNull: boolean;
        comment: string;
    };
    triggers: {
        type: string;
        allowNull: boolean;
        defaultValue: never[];
        comment: string;
    };
    steps: {
        type: string;
        allowNull: boolean;
        defaultValue: never[];
        comment: string;
    };
    approvalRequired: {
        type: string;
        defaultValue: boolean;
        comment: string;
    };
    autoExecute: {
        type: string;
        defaultValue: boolean;
        comment: string;
    };
    isActive: {
        type: string;
        defaultValue: boolean;
        comment: string;
    };
    successCriteria: {
        type: string;
        defaultValue: {};
        comment: string;
    };
    rollbackSteps: {
        type: string;
        allowNull: boolean;
        comment: string;
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
 * Sequelize AutomatedResponse model attributes for response execution tracking.
 *
 * @example
 * ```typescript
 * class AutomatedResponse extends Model {}
 * AutomatedResponse.init(getAutomatedResponseModelAttributes(), {
 *   sequelize,
 *   tableName: 'automated_responses',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['playbookId', 'status'] },
 *     { fields: ['startedAt', 'status'] },
 *     { fields: ['triggerType'] }
 *   ]
 * });
 * ```
 */
export declare const getAutomatedResponseModelAttributes: () => {
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
        comment: string;
    };
    triggerType: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    triggerData: {
        type: string;
        allowNull: boolean;
        defaultValue: {};
        comment: string;
    };
    status: {
        type: string;
        values: string[];
        allowNull: boolean;
        defaultValue: string;
        comment: string;
    };
    startedAt: {
        type: string;
        allowNull: boolean;
        defaultValue: string;
        comment: string;
    };
    completedAt: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    executedSteps: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    effectivenessScore: {
        type: string;
        allowNull: boolean;
        validate: {
            min: number;
            max: number;
        };
        comment: string;
    };
    impactAssessment: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    approvedBy: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    approvedAt: {
        type: string;
        allowNull: boolean;
        comment: string;
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
 * Sequelize SOARIntegration model attributes for SOAR platform connections.
 *
 * @example
 * ```typescript
 * class SOARIntegration extends Model {}
 * SOARIntegration.init(getSOARIntegrationModelAttributes(), {
 *   sequelize,
 *   tableName: 'soar_integrations',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['platform', 'status'] },
 *     { fields: ['status'] }
 *   ]
 * });
 * ```
 */
export declare const getSOARIntegrationModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    platform: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    platformVersion: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    connectionType: {
        type: string;
        values: string[];
        allowNull: boolean;
        comment: string;
    };
    endpoint: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    credentials: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    capabilities: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    status: {
        type: string;
        values: string[];
        defaultValue: string;
        comment: string;
    };
    lastSync: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    syncInterval: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    mappings: {
        type: string;
        defaultValue: {};
        comment: string;
    };
    rateLimits: {
        type: string;
        allowNull: boolean;
        comment: string;
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
 * Sequelize ContainmentAction model attributes for automated containment.
 *
 * @example
 * ```typescript
 * class ContainmentAction extends Model {}
 * ContainmentAction.init(getContainmentActionModelAttributes(), {
 *   sequelize,
 *   tableName: 'containment_actions',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['actionType', 'status'] },
 *     { fields: ['targetType', 'targetId'] },
 *     { fields: ['executedAt', 'status'] }
 *   ]
 * });
 * ```
 */
export declare const getContainmentActionModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    actionType: {
        type: string;
        values: string[];
        allowNull: boolean;
        comment: string;
    };
    targetType: {
        type: string;
        values: string[];
        allowNull: boolean;
        comment: string;
    };
    targetId: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    targetDetails: {
        type: string;
        defaultValue: {};
        comment: string;
    };
    severity: {
        type: string;
        values: string[];
        allowNull: boolean;
        comment: string;
    };
    status: {
        type: string;
        values: string[];
        allowNull: boolean;
        defaultValue: string;
        comment: string;
    };
    executedAt: {
        type: string;
        allowNull: boolean;
        defaultValue: string;
        comment: string;
    };
    revertedAt: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    duration: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    autoRevert: {
        type: string;
        defaultValue: boolean;
        comment: string;
    };
    revertAfter: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    verification: {
        type: string;
        defaultValue: {
            verified: boolean;
            method: string;
        };
        comment: string;
    };
    impactAssessment: {
        type: string;
        defaultValue: {};
        comment: string;
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
 * Sequelize RemediationWorkflow model attributes for remediation tracking.
 *
 * @example
 * ```typescript
 * class RemediationWorkflow extends Model {}
 * RemediationWorkflow.init(getRemediationWorkflowModelAttributes(), {
 *   sequelize,
 *   tableName: 'remediation_workflows',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['workflowType', 'status'] },
 *     { fields: ['priority', 'status'] },
 *     { fields: ['startedAt'] }
 *   ]
 * });
 * ```
 */
export declare const getRemediationWorkflowModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    workflowType: {
        type: string;
        values: string[];
        allowNull: boolean;
        comment: string;
    };
    threatId: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    targetAssets: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    priority: {
        type: string;
        values: string[];
        allowNull: boolean;
        comment: string;
    };
    status: {
        type: string;
        values: string[];
        allowNull: boolean;
        defaultValue: string;
        comment: string;
    };
    steps: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    validationChecks: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    startedAt: {
        type: string;
        allowNull: boolean;
        defaultValue: string;
        comment: string;
    };
    completedAt: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    successRate: {
        type: string;
        allowNull: boolean;
        validate: {
            min: number;
            max: number;
        };
        comment: string;
    };
    rollbackAvailable: {
        type: string;
        defaultValue: boolean;
        comment: string;
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
 * Sequelize AlertTriage model attributes for automated alert triage.
 *
 * @example
 * ```typescript
 * class AlertTriage extends Model {}
 * AlertTriage.init(getAlertTriageModelAttributes(), {
 *   sequelize,
 *   tableName: 'alert_triage',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['triageScore', 'priority'] },
 *     { fields: ['alertSeverity', 'category'] },
 *     { fields: ['assignedTo'] },
 *     { fields: ['correlatedAlerts'], using: 'gin' }
 *   ]
 * });
 * ```
 */
export declare const getAlertTriageModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    alertId: {
        type: string;
        allowNull: boolean;
        unique: boolean;
        comment: string;
    };
    alertSource: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    alertSeverity: {
        type: string;
        values: string[];
        allowNull: boolean;
        comment: string;
    };
    rawAlert: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    triageScore: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    priority: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    category: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    assignedTo: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    assignedAt: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    escalationLevel: {
        type: string;
        defaultValue: number;
        comment: string;
    };
    correlatedAlerts: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    falsePositiveLikelihood: {
        type: string;
        allowNull: boolean;
        validate: {
            min: number;
            max: number;
        };
        comment: string;
    };
    automatedActions: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    routingDecision: {
        type: string;
        allowNull: boolean;
        comment: string;
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
 * Triggers automated response based on threat detection with playbook selection.
 *
 * @param {string} threatId - Detected threat identifier
 * @param {Record<string, any>} threatData - Threat details and context
 * @returns {Promise<AutomatedResponse>} Initiated automated response
 *
 * @example
 * ```typescript
 * const response = await triggerAutomatedResponse(
 *   'threat-123',
 *   {
 *     threatType: 'ransomware',
 *     severity: 'critical',
 *     affectedAssets: ['server-01', 'server-02'],
 *     confidence: 0.95
 *   }
 * );
 * console.log('Response status:', response.status);
 * console.log('Playbook ID:', response.playbookId);
 * ```
 */
export declare const triggerAutomatedResponse: (threatId: string, threatData: Record<string, any>) => Promise<AutomatedResponse>;
/**
 * Executes response workflow with comprehensive error handling and logging.
 *
 * @param {PlaybookExecutionConfig} config - Execution configuration
 * @returns {Promise<AutomatedResponse>} Execution result
 *
 * @example
 * ```typescript
 * const execution = await executeResponseWorkflow({
 *   playbookId: 'playbook-123',
 *   triggerData: { threatId: 'threat-456' },
 *   dryRun: false,
 *   skipApproval: false
 * });
 * console.log('Executed steps:', execution.executedSteps.length);
 * console.log('Effectiveness score:', execution.effectivenessScore);
 * ```
 */
export declare const executeResponseWorkflow: (config: PlaybookExecutionConfig) => Promise<AutomatedResponse>;
/**
 * Coordinates multi-stage response across different security controls.
 *
 * @param {string[]} playbookIds - Multiple playbooks to coordinate
 * @param {Record<string, any>} sharedContext - Shared execution context
 * @returns {Promise<Array<AutomatedResponse>>} Array of coordinated responses
 *
 * @example
 * ```typescript
 * const responses = await coordinateMultiStageResponse(
 *   ['playbook-contain', 'playbook-investigate', 'playbook-remediate'],
 *   {
 *     threatId: 'threat-789',
 *     priority: 'critical',
 *     coordination: 'sequential'
 *   }
 * );
 * console.log(`Coordinated ${responses.length} playbooks`);
 * ```
 */
export declare const coordinateMultiStageResponse: (playbookIds: string[], sharedContext: Record<string, any>) => Promise<Array<AutomatedResponse>>;
/**
 * Tracks response effectiveness with metrics and KPIs.
 *
 * @param {string} responseId - Response identifier
 * @param {Record<string, any>} outcomeData - Outcome metrics
 * @returns {Promise<{ effectivenessScore: number; metrics: Record<string, any> }>} Effectiveness assessment
 *
 * @example
 * ```typescript
 * const effectiveness = await trackResponseEffectiveness(
 *   'response-123',
 *   {
 *     threatsStopped: 5,
 *     falsePositives: 1,
 *     mttr: 300,
 *     assetsProtected: 10
 *   }
 * );
 * console.log('Effectiveness score:', effectiveness.effectivenessScore);
 * ```
 */
export declare const trackResponseEffectiveness: (responseId: string, outcomeData: Record<string, any>) => Promise<{
    effectivenessScore: number;
    metrics: Record<string, any>;
}>;
/**
 * Implements adaptive response selection based on threat characteristics.
 *
 * @param {Record<string, any>} threatProfile - Threat characteristics
 * @param {ResponsePlaybook[]} availablePlaybooks - Available playbooks
 * @returns {Promise<{ selectedPlaybook: string; confidence: number; reasoning: string }>} Selection result
 *
 * @example
 * ```typescript
 * const selection = await selectAdaptiveResponse(
 *   {
 *     threatType: 'apt',
 *     sophistication: 0.9,
 *     speed: 'fast',
 *     targets: ['financial_data']
 *   },
 *   playbookLibrary
 * );
 * console.log('Selected playbook:', selection.selectedPlaybook);
 * console.log('Reasoning:', selection.reasoning);
 * ```
 */
export declare const selectAdaptiveResponse: (threatProfile: Record<string, any>, availablePlaybooks: ResponsePlaybook[]) => Promise<{
    selectedPlaybook: string;
    confidence: number;
    reasoning: string;
}>;
/**
 * Handles response rollback when execution fails or causes issues.
 *
 * @param {string} responseId - Response to rollback
 * @param {string} reason - Rollback reason
 * @returns {Promise<{ success: boolean; rollbackSteps: number; issues: string[] }>} Rollback result
 *
 * @example
 * ```typescript
 * const rollback = await rollbackResponse(
 *   'response-123',
 *   'Excessive business impact detected'
 * );
 * console.log('Rollback success:', rollback.success);
 * console.log('Steps rolled back:', rollback.rollbackSteps);
 * ```
 */
export declare const rollbackResponse: (responseId: string, reason: string) => Promise<{
    success: boolean;
    rollbackSteps: number;
    issues: string[];
}>;
/**
 * Executes emergency response protocols for critical threats.
 *
 * @param {Record<string, any>} criticalThreat - Critical threat details
 * @returns {Promise<AutomatedResponse>} Emergency response execution
 *
 * @example
 * ```typescript
 * const emergency = await executeEmergencyProtocol({
 *   threatType: 'ransomware_outbreak',
 *   severity: 'critical',
 *   affectedSystems: 50,
 *   spreading: true
 * });
 * console.log('Emergency protocol status:', emergency.status);
 * ```
 */
export declare const executeEmergencyProtocol: (criticalThreat: Record<string, any>) => Promise<AutomatedResponse>;
/**
 * Assesses business impact of automated response actions.
 *
 * @param {AutomatedResponse} response - Executed response
 * @param {Record<string, any>} businessContext - Business context data
 * @returns {Promise<{ impactScore: number; affectedServices: string[]; downtime: number; recommendation: string }>} Impact assessment
 *
 * @example
 * ```typescript
 * const impact = await assessResponseImpact(
 *   executedResponse,
 *   {
 *     criticalServices: ['ehr_system', 'billing'],
 *     businessHours: true,
 *     patientVolume: 'high'
 *   }
 * );
 * console.log('Business impact score:', impact.impactScore);
 * console.log('Affected services:', impact.affectedServices);
 * ```
 */
export declare const assessResponseImpact: (response: AutomatedResponse, businessContext: Record<string, any>) => Promise<{
    impactScore: number;
    affectedServices: string[];
    downtime: number;
    recommendation: string;
}>;
/**
 * Creates comprehensive response playbook with validation and versioning.
 *
 * @param {Partial<ResponsePlaybook>} playbookData - Playbook configuration
 * @returns {Promise<ResponsePlaybook>} Created playbook
 *
 * @example
 * ```typescript
 * const playbook = await createResponsePlaybook({
 *   name: 'Ransomware Response v2',
 *   threatTypes: ['ransomware'],
 *   severity: 'critical',
 *   steps: [
 *     { order: 1, name: 'Isolate', action: 'network_isolation', parameters: {} },
 *     { order: 2, name: 'Backup Check', action: 'verify_backups', parameters: {} }
 *   ],
 *   autoExecute: true
 * });
 * console.log('Playbook created:', playbook.id);
 * ```
 */
export declare const createResponsePlaybook: (playbookData: Partial<ResponsePlaybook>) => Promise<ResponsePlaybook>;
/**
 * Updates existing playbook with version control.
 *
 * @param {string} playbookId - Playbook to update
 * @param {Partial<ResponsePlaybook>} updates - Updated fields
 * @returns {Promise<ResponsePlaybook>} Updated playbook
 *
 * @example
 * ```typescript
 * const updated = await updateResponsePlaybook(
 *   'playbook-123',
 *   {
 *     version: '2.0.0',
 *     steps: [...newSteps],
 *     autoExecute: false
 *   }
 * );
 * console.log('Updated to version:', updated.version);
 * ```
 */
export declare const updateResponsePlaybook: (playbookId: string, updates: Partial<ResponsePlaybook>) => Promise<ResponsePlaybook>;
/**
 * Executes individual playbook steps with error handling.
 *
 * @param {ResponsePlaybook['steps'][0]} step - Step to execute
 * @param {Record<string, any>} context - Execution context
 * @returns {Promise<{ success: boolean; result: Record<string, any>; duration: number }>} Step execution result
 *
 * @example
 * ```typescript
 * const stepResult = await executePlaybookStep(
 *   {
 *     order: 1,
 *     name: 'Network Isolation',
 *     action: 'isolate_network',
 *     parameters: { targetIp: '192.168.1.100' },
 *     timeout: 30000
 *   },
 *   { threatId: 'threat-123' }
 * );
 * console.log('Step success:', stepResult.success);
 * ```
 */
export declare const executePlaybookStep: (step: ResponsePlaybook["steps"][0], context: Record<string, any>) => Promise<{
    success: boolean;
    result: Record<string, any>;
    duration: number;
}>;
/**
 * Implements conditional playbook logic based on runtime conditions.
 *
 * @param {ResponsePlaybook} playbook - Playbook to evaluate
 * @param {Record<string, any>} runtimeData - Runtime condition data
 * @returns {Promise<{ shouldExecute: boolean; executionPlan: any[]; reasoning: string }>} Conditional execution plan
 *
 * @example
 * ```typescript
 * const plan = await evaluateConditionalPlaybook(
 *   playbook,
 *   {
 *     threatSeverity: 'high',
 *     confidence: 0.95,
 *     businessHours: false,
 *     affectedAssets: 5
 *   }
 * );
 * console.log('Should execute:', plan.shouldExecute);
 * console.log('Reasoning:', plan.reasoning);
 * ```
 */
export declare const evaluateConditionalPlaybook: (playbook: ResponsePlaybook, runtimeData: Record<string, any>) => Promise<{
    shouldExecute: boolean;
    executionPlan: any[];
    reasoning: string;
}>;
/**
 * Manages playbook versioning with rollback capabilities.
 *
 * @param {string} playbookId - Playbook identifier
 * @param {string} action - Version action (create, rollback, compare)
 * @param {string} targetVersion - Target version for action
 * @returns {Promise<{ version: string; changes: string[]; previous: string }>} Version management result
 *
 * @example
 * ```typescript
 * const version = await managePlaybookVersion(
 *   'playbook-123',
 *   'rollback',
 *   '1.0.0'
 * );
 * console.log('Rolled back to version:', version.version);
 * console.log('Changes:', version.changes);
 * ```
 */
export declare const managePlaybookVersion: (playbookId: string, action: string, targetVersion?: string) => Promise<{
    version: string;
    changes: string[];
    previous: string;
}>;
/**
 * Tests playbook execution in safe sandbox environment.
 *
 * @param {string} playbookId - Playbook to test
 * @param {Record<string, any>} testScenario - Test scenario data
 * @returns {Promise<{ success: boolean; stepsExecuted: number; failures: string[]; recommendations: string[] }>} Test results
 *
 * @example
 * ```typescript
 * const testResult = await testPlaybookExecution(
 *   'playbook-123',
 *   {
 *     threatType: 'malware',
 *     severity: 'high',
 *     simulatedEnvironment: true
 *   }
 * );
 * console.log('Test success:', testResult.success);
 * console.log('Failures:', testResult.failures);
 * ```
 */
export declare const testPlaybookExecution: (playbookId: string, testScenario: Record<string, any>) => Promise<{
    success: boolean;
    stepsExecuted: number;
    failures: string[];
    recommendations: string[];
}>;
/**
 * Analyzes playbook effectiveness with historical data.
 *
 * @param {string} playbookId - Playbook to analyze
 * @param {number} daysBack - Days of history to analyze
 * @returns {Promise<{ avgSuccessRate: number; avgDuration: number; commonFailures: string[]; improvements: string[] }>} Effectiveness analysis
 *
 * @example
 * ```typescript
 * const analysis = await analyzePlaybookEffectiveness('playbook-123', 30);
 * console.log('Success rate:', analysis.avgSuccessRate);
 * console.log('Avg duration:', analysis.avgDuration);
 * console.log('Improvements:', analysis.improvements);
 * ```
 */
export declare const analyzePlaybookEffectiveness: (playbookId: string, daysBack: number) => Promise<{
    avgSuccessRate: number;
    avgDuration: number;
    commonFailures: string[];
    improvements: string[];
}>;
/**
 * Generates dynamic playbook based on threat characteristics.
 *
 * @param {Record<string, any>} threatProfile - Threat characteristics
 * @param {string[]} availableActions - Available response actions
 * @returns {Promise<ResponsePlaybook>} Generated playbook
 *
 * @example
 * ```typescript
 * const dynamicPlaybook = await generateDynamicPlaybook(
 *   {
 *     threatType: 'zero_day',
 *     sophistication: 0.95,
 *     spread: 'rapid',
 *     targetData: 'PHI'
 *   },
 *   ['isolate', 'quarantine', 'backup', 'notify']
 * );
 * console.log('Generated playbook:', dynamicPlaybook.name);
 * console.log('Steps:', dynamicPlaybook.steps.length);
 * ```
 */
export declare const generateDynamicPlaybook: (threatProfile: Record<string, any>, availableActions: string[]) => Promise<ResponsePlaybook>;
/**
 * Connects to SOAR platform with authentication and capability discovery.
 *
 * @param {Partial<SOARIntegration>} connectionConfig - SOAR connection configuration
 * @returns {Promise<SOARIntegration>} Established integration
 *
 * @example
 * ```typescript
 * const soarConnection = await connectSOARPlatform({
 *   platform: 'Splunk SOAR',
 *   platformVersion: '5.3.0',
 *   connectionType: 'api',
 *   endpoint: 'https://soar.whitecross.com/api',
 *   credentials: {
 *     type: 'api_key',
 *     encryptedData: 'encrypted_api_key_here'
 *   }
 * });
 * console.log('Connected to:', soarConnection.platform);
 * console.log('Capabilities:', soarConnection.capabilities);
 * ```
 */
export declare const connectSOARPlatform: (connectionConfig: Partial<SOARIntegration>) => Promise<SOARIntegration>;
/**
 * Triggers SOAR workflow execution with parameter mapping.
 *
 * @param {string} integrationId - SOAR integration identifier
 * @param {string} workflowName - Workflow to trigger
 * @param {Record<string, any>} parameters - Workflow parameters
 * @returns {Promise<{ jobId: string; status: string; estimatedDuration: number }>} Workflow execution details
 *
 * @example
 * ```typescript
 * const job = await triggerSOARWorkflow(
 *   'soar-integration-123',
 *   'investigate_malware',
 *   {
 *     threatId: 'threat-456',
 *     fileHash: 'abc123...',
 *     priority: 'high'
 *   }
 * );
 * console.log('SOAR job ID:', job.jobId);
 * console.log('Status:', job.status);
 * ```
 */
export declare const triggerSOARWorkflow: (integrationId: string, workflowName: string, parameters: Record<string, any>) => Promise<{
    jobId: string;
    status: string;
    estimatedDuration: number;
}>;
/**
 * Retrieves SOAR case data with enrichment.
 *
 * @param {string} integrationId - SOAR integration identifier
 * @param {string} caseId - Case identifier
 * @returns {Promise<Record<string, any>>} Case details
 *
 * @example
 * ```typescript
 * const caseData = await retrieveSOARCaseData(
 *   'soar-integration-123',
 *   'CASE-2025-001'
 * );
 * console.log('Case status:', caseData.status);
 * console.log('Assigned to:', caseData.assignedTo);
 * ```
 */
export declare const retrieveSOARCaseData: (integrationId: string, caseId: string) => Promise<Record<string, any>>;
/**
 * Updates SOAR incident with new findings and actions.
 *
 * @param {string} integrationId - SOAR integration identifier
 * @param {string} incidentId - Incident identifier
 * @param {Record<string, any>} updates - Updates to apply
 * @returns {Promise<{ success: boolean; updatedFields: string[] }>} Update result
 *
 * @example
 * ```typescript
 * const update = await updateSOARIncident(
 *   'soar-integration-123',
 *   'INC-2025-001',
 *   {
 *     status: 'contained',
 *     severity: 'critical',
 *     findings: 'Malware variant identified',
 *     actionsTeaken: ['network_isolation', 'endpoint_quarantine']
 *   }
 * );
 * console.log('Update success:', update.success);
 * ```
 */
export declare const updateSOARIncident: (integrationId: string, incidentId: string, updates: Record<string, any>) => Promise<{
    success: boolean;
    updatedFields: string[];
}>;
/**
 * Synchronizes threat intelligence between systems and SOAR.
 *
 * @param {string} integrationId - SOAR integration identifier
 * @param {Record<string, any>[]} intelligenceData - Intelligence to sync
 * @returns {Promise<{ synced: number; failed: number; errors: string[] }>} Sync results
 *
 * @example
 * ```typescript
 * const sync = await syncThreatIntelligence(
 *   'soar-integration-123',
 *   [
 *     { ioc: '192.168.1.100', type: 'ip', threat: 'malware_c2' },
 *     { ioc: 'malicious.com', type: 'domain', threat: 'phishing' }
 *   ]
 * );
 * console.log('Synced:', sync.synced);
 * console.log('Failed:', sync.failed);
 * ```
 */
export declare const syncThreatIntelligence: (integrationId: string, intelligenceData: Record<string, any>[]) => Promise<{
    synced: number;
    failed: number;
    errors: string[];
}>;
/**
 * Executes SOAR action with retry and error handling.
 *
 * @param {string} integrationId - SOAR integration identifier
 * @param {SOARAction} action - Action to execute
 * @returns {Promise<{ success: boolean; result: Record<string, any>; attempts: number }>} Action result
 *
 * @example
 * ```typescript
 * const actionResult = await executeSOARAction(
 *   'soar-integration-123',
 *   {
 *     actionType: 'enrich_ioc',
 *     parameters: { ioc: '192.168.1.100', iocType: 'ip' },
 *     timeout: 30000,
 *     retries: 3
 *   }
 * );
 * console.log('Action success:', actionResult.success);
 * console.log('Result:', actionResult.result);
 * ```
 */
export declare const executeSOARAction: (integrationId: string, action: SOARAction) => Promise<{
    success: boolean;
    result: Record<string, any>;
    attempts: number;
}>;
/**
 * Monitors SOAR job status with polling.
 *
 * @param {string} integrationId - SOAR integration identifier
 * @param {string} jobId - Job identifier to monitor
 * @returns {Promise<{ status: string; progress: number; result?: Record<string, any> }>} Job status
 *
 * @example
 * ```typescript
 * const jobStatus = await monitorSOARJobStatus(
 *   'soar-integration-123',
 *   'soar-job-456'
 * );
 * console.log('Job status:', jobStatus.status);
 * console.log('Progress:', jobStatus.progress + '%');
 * ```
 */
export declare const monitorSOARJobStatus: (integrationId: string, jobId: string) => Promise<{
    status: string;
    progress: number;
    result?: Record<string, any>;
}>;
/**
 * Orchestrates API calls to SOAR with rate limiting.
 *
 * @param {string} integrationId - SOAR integration identifier
 * @param {Array<{ method: string; endpoint: string; data?: any }>} apiCalls - API calls to orchestrate
 * @returns {Promise<{ successful: number; failed: number; results: any[] }>} Orchestration results
 *
 * @example
 * ```typescript
 * const orchestration = await orchestrateSOARAPICalls(
 *   'soar-integration-123',
 *   [
 *     { method: 'POST', endpoint: '/incidents', data: incidentData },
 *     { method: 'GET', endpoint: '/workflows' },
 *     { method: 'PUT', endpoint: '/cases/123', data: updateData }
 *   ]
 * );
 * console.log('Successful calls:', orchestration.successful);
 * ```
 */
export declare const orchestrateSOARAPICalls: (integrationId: string, apiCalls: Array<{
    method: string;
    endpoint: string;
    data?: any;
}>) => Promise<{
    successful: number;
    failed: number;
    results: any[];
}>;
/**
 * Isolates compromised network segment automatically.
 *
 * @param {string} targetSegment - Network segment to isolate
 * @param {Record<string, any>} isolationConfig - Isolation configuration
 * @returns {Promise<ContainmentAction>} Isolation action record
 *
 * @example
 * ```typescript
 * const isolation = await isolateNetworkSegment(
 *   '192.168.10.0/24',
 *   {
 *     severity: 'critical',
 *     autoRevert: true,
 *     revertAfterSeconds: 3600,
 *     allowedTraffic: ['dns', 'dhcp']
 *   }
 * );
 * console.log('Isolation status:', isolation.status);
 * ```
 */
export declare const isolateNetworkSegment: (targetSegment: string, isolationConfig: Record<string, any>) => Promise<ContainmentAction>;
/**
 * Quarantines compromised endpoint with forensic preservation.
 *
 * @param {string} endpointId - Endpoint to quarantine
 * @param {Record<string, any>} quarantineConfig - Quarantine configuration
 * @returns {Promise<ContainmentAction>} Quarantine action record
 *
 * @example
 * ```typescript
 * const quarantine = await quarantineEndpoint(
 *   'laptop-user123',
 *   {
 *     severity: 'high',
 *     preserveMemory: true,
 *     collectLogs: true,
 *     killProcesses: ['malware.exe']
 *   }
 * );
 * console.log('Quarantine status:', quarantine.status);
 * ```
 */
export declare const quarantineEndpoint: (endpointId: string, quarantineConfig: Record<string, any>) => Promise<ContainmentAction>;
/**
 * Suspends user account with access revocation.
 *
 * @param {string} userId - User to suspend
 * @param {string} reason - Suspension reason
 * @param {number} durationSeconds - Suspension duration
 * @returns {Promise<ContainmentAction>} Suspension action record
 *
 * @example
 * ```typescript
 * const suspension = await suspendUserAccount(
 *   'user-compromised-123',
 *   'Suspicious activity detected - credential compromise suspected',
 *   3600
 * );
 * console.log('Account suspended:', suspension.targetId);
 * ```
 */
export declare const suspendUserAccount: (userId: string, reason: string, durationSeconds?: number) => Promise<ContainmentAction>;
/**
 * Shuts down compromised service automatically.
 *
 * @param {string} serviceId - Service to shutdown
 * @param {Record<string, any>} shutdownConfig - Shutdown configuration
 * @returns {Promise<ContainmentAction>} Shutdown action record
 *
 * @example
 * ```typescript
 * const shutdown = await shutdownCompromisedService(
 *   'database-service-01',
 *   {
 *     severity: 'critical',
 *     gracefulShutdown: true,
 *     timeout: 30,
 *     notifyDependents: true
 *   }
 * );
 * console.log('Service shutdown:', shutdown.status);
 * ```
 */
export declare const shutdownCompromisedService: (serviceId: string, shutdownConfig: Record<string, any>) => Promise<ContainmentAction>;
/**
 * Blocks malicious traffic at firewall/gateway level.
 *
 * @param {ContainmentConfig} config - Traffic blocking configuration
 * @returns {Promise<ContainmentAction>} Blocking action record
 *
 * @example
 * ```typescript
 * const block = await blockMaliciousTraffic({
 *   actionType: 'traffic_blocking',
 *   targets: ['192.168.1.100', '10.0.0.50'],
 *   severity: 'high',
 *   autoRevert: true,
 *   revertAfterSeconds: 7200
 * });
 * console.log('Blocked IPs:', block.targetDetails.blockedIps);
 * ```
 */
export declare const blockMaliciousTraffic: (config: ContainmentConfig) => Promise<ContainmentAction>;
/**
 * Implements DNS sinkholing for malicious domains.
 *
 * @param {string[]} domains - Domains to sinkhole
 * @param {string} sinkholeIp - Sinkhole IP address
 * @returns {Promise<ContainmentAction>} Sinkhole action record
 *
 * @example
 * ```typescript
 * const sinkhole = await sinkholeMaliciousDomain(
 *   ['malicious-c2.com', 'phishing-site.net'],
 *   '127.0.0.1'
 * );
 * console.log('Sinkholed domains:', sinkhole.targetDetails.domains);
 * ```
 */
export declare const sinkholeMaliciousDomain: (domains: string[], sinkholeIp: string) => Promise<ContainmentAction>;
/**
 * Verifies containment action effectiveness.
 *
 * @param {string} containmentId - Containment action to verify
 * @param {string} verificationMethod - Verification method to use
 * @returns {Promise<{ verified: boolean; result: Record<string, any>; recommendations: string[] }>} Verification result
 *
 * @example
 * ```typescript
 * const verification = await verifyContainmentAction(
 *   'containment-123',
 *   'network_scan'
 * );
 * console.log('Containment verified:', verification.verified);
 * console.log('Recommendations:', verification.recommendations);
 * ```
 */
export declare const verifyContainmentAction: (containmentId: string, verificationMethod: string) => Promise<{
    verified: boolean;
    result: Record<string, any>;
    recommendations: string[];
}>;
/**
 * Removes malware with automated cleanup and verification.
 *
 * @param {string} endpointId - Endpoint to clean
 * @param {Record<string, any>} malwareInfo - Malware details
 * @returns {Promise<RemediationWorkflow>} Remediation workflow
 *
 * @example
 * ```typescript
 * const cleanup = await removeMalwareAutomated(
 *   'endpoint-123',
 *   {
 *     malwareType: 'ransomware',
 *     fileHashes: ['abc123', 'def456'],
 *     processes: ['malware.exe'],
 *     registryKeys: ['HKLM\\Software\\Malware']
 *   }
 * );
 * console.log('Remediation status:', cleanup.status);
 * ```
 */
export declare const removeMalwareAutomated: (endpointId: string, malwareInfo: Record<string, any>) => Promise<RemediationWorkflow>;
/**
 * Hardens system configuration based on security baselines.
 *
 * @param {string[]} targetAssets - Assets to harden
 * @param {Record<string, any>} hardeningProfile - Hardening configuration
 * @returns {Promise<RemediationWorkflow>} Hardening workflow
 *
 * @example
 * ```typescript
 * const hardening = await hardenSystemConfiguration(
 *   ['server-01', 'server-02'],
 *   {
 *     profile: 'cis_benchmark',
 *     disableServices: ['telnet', 'ftp'],
 *     enforceComplexPasswords: true,
 *     enableFirewall: true
 *   }
 * );
 * console.log('Hardening progress:', hardening.successRate);
 * ```
 */
export declare const hardenSystemConfiguration: (targetAssets: string[], hardeningProfile: Record<string, any>) => Promise<RemediationWorkflow>;
/**
 * Deploys security patches automatically with rollback capability.
 *
 * @param {RemediationConfig} config - Patch deployment configuration
 * @returns {Promise<RemediationWorkflow>} Patch deployment workflow
 *
 * @example
 * ```typescript
 * const patching = await deploySecurityPatches({
 *   workflowType: 'patch_deployment',
 *   targets: ['server-group-prod'],
 *   priority: 'high',
 *   validationRequired: true
 * });
 * console.log('Patches deployed:', patching.steps.length);
 * ```
 */
export declare const deploySecurityPatches: (config: RemediationConfig) => Promise<RemediationWorkflow>;
/**
 * Resets compromised credentials across systems.
 *
 * @param {string} userId - User whose credentials to reset
 * @param {string[]} affectedSystems - Systems to reset credentials on
 * @returns {Promise<RemediationWorkflow>} Credential reset workflow
 *
 * @example
 * ```typescript
 * const credReset = await resetCompromisedCredentials(
 *   'user-compromised-123',
 *   ['active_directory', 'email_system', 'vpn', 'database']
 * );
 * console.log('Credential reset status:', credReset.status);
 * ```
 */
export declare const resetCompromisedCredentials: (userId: string, affectedSystems: string[]) => Promise<RemediationWorkflow>;
/**
 * Revokes excessive permissions automatically.
 *
 * @param {string} principalId - User/service principal
 * @param {string[]} permissionsToRevoke - Permissions to remove
 * @returns {Promise<RemediationWorkflow>} Permission revocation workflow
 *
 * @example
 * ```typescript
 * const revocation = await revokeExcessivePermissions(
 *   'service-account-123',
 *   ['admin_access', 'delete_database', 'modify_firewall']
 * );
 * console.log('Permissions revoked:', revocation.steps[0].result);
 * ```
 */
export declare const revokeExcessivePermissions: (principalId: string, permissionsToRevoke: string[]) => Promise<RemediationWorkflow>;
/**
 * Restores system from clean backup.
 *
 * @param {string} assetId - Asset to restore
 * @param {string} backupId - Backup to restore from
 * @returns {Promise<RemediationWorkflow>} System restore workflow
 *
 * @example
 * ```typescript
 * const restore = await restoreSystemFromBackup(
 *   'server-infected-01',
 *   'backup-2025-11-08-clean'
 * );
 * console.log('Restore status:', restore.status);
 * console.log('Success rate:', restore.successRate);
 * ```
 */
export declare const restoreSystemFromBackup: (assetId: string, backupId: string) => Promise<RemediationWorkflow>;
/**
 * Validates remediation workflow success with comprehensive checks.
 *
 * @param {string} workflowId - Workflow to validate
 * @param {string[]} validationTests - Tests to run
 * @returns {Promise<{ passed: boolean; results: Array<{ test: string; passed: boolean; details: string }>; overallScore: number }>} Validation results
 *
 * @example
 * ```typescript
 * const validation = await validateRemediationSuccess(
 *   'workflow-123',
 *   ['malware_scan', 'vulnerability_check', 'config_compliance', 'service_health']
 * );
 * console.log('Validation passed:', validation.passed);
 * console.log('Overall score:', validation.overallScore);
 * ```
 */
export declare const validateRemediationSuccess: (workflowId: string, validationTests: string[]) => Promise<{
    passed: boolean;
    results: Array<{
        test: string;
        passed: boolean;
        details: string;
    }>;
    overallScore: number;
}>;
/**
 * Coordinates response across multiple security teams.
 *
 * @param {string} incidentId - Incident identifier
 * @param {string[]} teams - Teams to coordinate
 * @returns {Promise<{ coordination: Record<string, any>; timeline: any[] }>} Coordination plan
 *
 * @example
 * ```typescript
 * const coordination = await coordinateMultiTeamResponse(
 *   'incident-critical-001',
 *   ['soc_team', 'incident_response', 'forensics', 'compliance']
 * );
 * console.log('Coordinated teams:', Object.keys(coordination.coordination));
 * ```
 */
export declare const coordinateMultiTeamResponse: (incidentId: string, teams: string[]) => Promise<{
    coordination: Record<string, any>;
    timeline: any[];
}>;
/**
 * Sequences response actions for optimal execution order.
 *
 * @param {Array<{ action: string; priority: number; dependencies: string[] }>} actions - Actions to sequence
 * @returns {Promise<Array<{ order: number; action: string; estimatedDuration: number }>>} Sequenced actions
 *
 * @example
 * ```typescript
 * const sequence = await sequenceResponseActions([
 *   { action: 'contain_threat', priority: 1, dependencies: [] },
 *   { action: 'collect_evidence', priority: 2, dependencies: ['contain_threat'] },
 *   { action: 'remediate', priority: 3, dependencies: ['collect_evidence'] }
 * ]);
 * console.log('Execution sequence:', sequence);
 * ```
 */
export declare const sequenceResponseActions: (actions: Array<{
    action: string;
    priority: number;
    dependencies: string[];
}>) => Promise<Array<{
    order: number;
    action: string;
    estimatedDuration: number;
}>>;
/**
 * Executes parallel response actions across multiple assets.
 *
 * @param {Array<{ asset: string; action: string; parameters: Record<string, any> }>} parallelActions - Actions to execute in parallel
 * @returns {Promise<Array<{ asset: string; success: boolean; duration: number }>>} Execution results
 *
 * @example
 * ```typescript
 * const results = await executeParallelResponses([
 *   { asset: 'server-01', action: 'isolate', parameters: {} },
 *   { asset: 'server-02', action: 'isolate', parameters: {} },
 *   { asset: 'server-03', action: 'isolate', parameters: {} }
 * ]);
 * console.log('Successful isolations:', results.filter(r => r.success).length);
 * ```
 */
export declare const executeParallelResponses: (parallelActions: Array<{
    asset: string;
    action: string;
    parameters: Record<string, any>;
}>) => Promise<Array<{
    asset: string;
    success: boolean;
    duration: number;
}>>;
/**
 * Allocates resources for incident response.
 *
 * @param {string} incidentId - Incident identifier
 * @param {Record<string, any>} requirements - Resource requirements
 * @returns {Promise<{ allocated: Record<string, any>; availability: Record<string, number> }>} Resource allocation
 *
 * @example
 * ```typescript
 * const resources = await allocateResponseResources(
 *   'incident-001',
 *   {
 *     analysts: 3,
 *     forensicExperts: 1,
 *     computeResources: 'high',
 *     storageGB: 500
 *   }
 * );
 * console.log('Allocated resources:', resources.allocated);
 * ```
 */
export declare const allocateResponseResources: (incidentId: string, requirements: Record<string, any>) => Promise<{
    allocated: Record<string, any>;
    availability: Record<string, number>;
}>;
/**
 * Manages response escalation based on severity and progress.
 *
 * @param {string} responseId - Response identifier
 * @param {Record<string, any>} escalationCriteria - Escalation criteria
 * @returns {Promise<{ escalated: boolean; newLevel: number; notified: string[] }>} Escalation result
 *
 * @example
 * ```typescript
 * const escalation = await manageResponseEscalation(
 *   'response-123',
 *   {
 *     currentLevel: 1,
 *     timeElapsed: 3600,
 *     unresolved: true,
 *     severity: 'critical'
 *   }
 * );
 * console.log('Escalated:', escalation.escalated);
 * console.log('New level:', escalation.newLevel);
 * ```
 */
export declare const manageResponseEscalation: (responseId: string, escalationCriteria: Record<string, any>) => Promise<{
    escalated: boolean;
    newLevel: number;
    notified: string[];
}>;
/**
 * Prioritizes multiple concurrent responses.
 *
 * @param {Array<{ responseId: string; severity: string; assetsAffected: number; startedAt: Date }>} activeResponses - Active responses
 * @returns {Promise<Array<{ responseId: string; priority: number; reasoning: string }>>} Prioritized responses
 *
 * @example
 * ```typescript
 * const priorities = await prioritizeResponseWorkloads([
 *   { responseId: 'resp-1', severity: 'critical', assetsAffected: 50, startedAt: new Date() },
 *   { responseId: 'resp-2', severity: 'high', assetsAffected: 5, startedAt: new Date() },
 *   { responseId: 'resp-3', severity: 'medium', assetsAffected: 1, startedAt: new Date() }
 * ]);
 * console.log('Highest priority:', priorities[0]);
 * ```
 */
export declare const prioritizeResponseWorkloads: (activeResponses: Array<{
    responseId: string;
    severity: string;
    assetsAffected: number;
    startedAt: Date;
}>) => Promise<Array<{
    responseId: string;
    priority: number;
    reasoning: string;
}>>;
/**
 * Manages orchestration state for complex multi-stage responses.
 *
 * @param {string} orchestrationId - Orchestration identifier
 * @param {string} action - State management action
 * @param {Record<string, any>} stateData - State data
 * @returns {Promise<{ state: string; completedStages: number; totalStages: number; currentStage: string }>} Orchestration state
 *
 * @example
 * ```typescript
 * const state = await manageOrchestrationState(
 *   'orch-123',
 *   'update',
 *   { currentStage: 'remediation', progress: 75 }
 * );
 * console.log('Current stage:', state.currentStage);
 * console.log('Progress:', state.completedStages / state.totalStages);
 * ```
 */
export declare const manageOrchestrationState: (orchestrationId: string, action: string, stateData?: Record<string, any>) => Promise<{
    state: string;
    completedStages: number;
    totalStages: number;
    currentStage: string;
}>;
export {};
//# sourceMappingURL=response-automation-kit.d.ts.map