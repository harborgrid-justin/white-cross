/**
 * LOC: THRORCHET001
 * File: /reuse/threat/threat-intelligence-orchestration-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - SOAR platform integrations
 *   - Security orchestration services
 *   - Automated response modules
 *   - Workflow execution engines
 *   - Integration hub services
 *   - Task scheduling systems
 */
interface SOARWorkflow {
    id: string;
    name: string;
    description: string;
    version: string;
    workflowType: 'threat_response' | 'incident_investigation' | 'vulnerability_remediation' | 'compliance_check' | 'threat_hunting' | 'alert_enrichment';
    status: 'draft' | 'active' | 'paused' | 'archived';
    triggers: Array<{
        type: 'manual' | 'scheduled' | 'event' | 'webhook' | 'api';
        condition: string;
        parameters: Record<string, any>;
        enabled: boolean;
    }>;
    stages: Array<{
        id: string;
        name: string;
        order: number;
        type: 'sequential' | 'parallel' | 'conditional';
        tasks: string[];
        conditions?: Record<string, any>;
        timeout?: number;
    }>;
    variables: Record<string, any>;
    errorHandling: {
        strategy: 'retry' | 'rollback' | 'continue' | 'abort';
        maxRetries?: number;
        retryDelay?: number;
        fallbackWorkflow?: string;
    };
    approvalGates: Array<{
        stageId: string;
        required: boolean;
        approvers: string[];
        timeout?: number;
        autoApproveConditions?: Record<string, any>;
    }>;
    metrics: {
        executionCount: number;
        successRate: number;
        averageDuration: number;
        lastExecuted?: Date;
    };
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    metadata?: Record<string, any>;
}
interface PlaybookDefinition {
    id: string;
    name: string;
    category: string;
    description: string;
    version: string;
    threatTypes: string[];
    severity: 'critical' | 'high' | 'medium' | 'low';
    mitreAttackIds: string[];
    steps: Array<{
        id: string;
        order: number;
        name: string;
        actionType: string;
        tool: string;
        command: string;
        parameters: Record<string, any>;
        expectedOutput?: Record<string, any>;
        successCriteria?: Record<string, any>;
        timeout?: number;
        retryPolicy?: {
            maxRetries: number;
            backoffMultiplier: number;
            initialDelayMs: number;
        };
        dependencies?: string[];
        conditional?: {
            condition: string;
            onTrue?: string;
            onFalse?: string;
        };
    }>;
    validations: Array<{
        type: 'pre' | 'post' | 'runtime';
        checks: Array<{
            name: string;
            expression: string;
            errorMessage: string;
        }>;
    }>;
    rollback: Array<{
        stepId: string;
        action: string;
        parameters: Record<string, any>;
    }>;
    approvalRequired: boolean;
    autoExecute: boolean;
    isActive: boolean;
    tags: string[];
    author: string;
    lastModified: Date;
    metadata?: Record<string, any>;
}
interface WorkflowExecution {
    id: string;
    workflowId: string;
    playbookId?: string;
    executionType: 'manual' | 'automated' | 'scheduled';
    status: 'pending' | 'running' | 'paused' | 'completed' | 'failed' | 'cancelled' | 'rolled_back';
    currentStage?: string;
    currentStep?: string;
    progress: number;
    startedAt: Date;
    completedAt?: Date;
    duration?: number;
    initiatedBy: string;
    approvals: Array<{
        stageId: string;
        status: 'pending' | 'approved' | 'rejected';
        approvedBy?: string;
        approvedAt?: Date;
        comments?: string;
    }>;
    stageResults: Array<{
        stageId: string;
        stageName: string;
        status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
        startedAt: Date;
        completedAt?: Date;
        tasks: Array<{
            taskId: string;
            status: 'pending' | 'running' | 'completed' | 'failed';
            result?: Record<string, any>;
            error?: string;
        }>;
    }>;
    context: Record<string, any>;
    outputs: Record<string, any>;
    errors: Array<{
        timestamp: Date;
        stage?: string;
        task?: string;
        error: string;
        recoveryAction?: string;
    }>;
    metrics: {
        tasksCompleted: number;
        tasksFailed: number;
        retryCount: number;
        resourcesAffected: number;
    };
    metadata?: Record<string, any>;
}
interface SecurityToolIntegration {
    id: string;
    toolName: string;
    toolType: 'siem' | 'edr' | 'firewall' | 'ids_ips' | 'threat_intel' | 'vulnerability_scanner' | 'dlp' | 'casb' | 'soar' | 'ticketing';
    vendor: string;
    version: string;
    connectionType: 'api' | 'webhook' | 'agent' | 'syslog' | 'file_transfer';
    endpoint: string;
    authentication: {
        type: 'api_key' | 'oauth2' | 'certificate' | 'basic_auth' | 'token';
        encryptedCredentials: string;
        refreshToken?: string;
        expiresAt?: Date;
    };
    capabilities: Array<{
        action: string;
        method: string;
        endpoint: string;
        parameters?: Record<string, any>;
        rateLimit?: number;
    }>;
    status: 'connected' | 'disconnected' | 'error' | 'maintenance';
    health: {
        lastCheck: Date;
        latencyMs: number;
        errorRate: number;
        availability: number;
    };
    dataFlow: {
        direction: 'inbound' | 'outbound' | 'bidirectional';
        format: string;
        transformations?: Array<{
            field: string;
            transformation: string;
        }>;
    };
    rateLimits: {
        requestsPerMinute: number;
        requestsPerHour: number;
        requestsPerDay: number;
    };
    retryPolicy: {
        maxRetries: number;
        backoffStrategy: 'linear' | 'exponential';
        initialDelayMs: number;
    };
    monitoring: {
        metricsEnabled: boolean;
        alertsEnabled: boolean;
        logLevel: string;
    };
    metadata?: Record<string, any>;
}
interface ScheduledTask {
    id: string;
    name: string;
    description: string;
    taskType: 'workflow_execution' | 'playbook_run' | 'integration_sync' | 'health_check' | 'cleanup' | 'report_generation';
    schedule: {
        type: 'cron' | 'interval' | 'once';
        expression: string;
        timezone: string;
        startDate?: Date;
        endDate?: Date;
    };
    workflowId?: string;
    playbookId?: string;
    integrationId?: string;
    parameters: Record<string, any>;
    priority: 'critical' | 'high' | 'medium' | 'low';
    status: 'enabled' | 'disabled' | 'expired';
    lastRun?: Date;
    nextRun?: Date;
    executionHistory: Array<{
        runId: string;
        startedAt: Date;
        completedAt?: Date;
        status: 'success' | 'failed' | 'cancelled';
        duration?: number;
        result?: Record<string, any>;
        error?: string;
    }>;
    maxConcurrentRuns: number;
    timeout?: number;
    retryOnFailure: boolean;
    notifications: {
        onSuccess: boolean;
        onFailure: boolean;
        recipients: string[];
    };
    metadata?: Record<string, any>;
}
/**
 * Sequelize SOARWorkflow model attributes for security orchestration workflows.
 *
 * @example
 * ```typescript
 * import { DataTypes, Model } from 'sequelize';
 *
 * class SOARWorkflow extends Model {
 *   declare id: string;
 *   declare name: string;
 *   declare stages: any[];
 * }
 *
 * SOARWorkflow.init(getSOARWorkflowModelAttributes(), {
 *   sequelize,
 *   tableName: 'soar_workflows',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['status', 'workflowType'] },
 *     { fields: ['createdBy'] },
 *     { fields: ['triggers'], using: 'gin' }
 *   ]
 * });
 * ```
 */
export declare const getSOARWorkflowModelAttributes: () => {
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
    workflowType: {
        type: string;
        values: string[];
        allowNull: boolean;
        comment: string;
    };
    status: {
        type: string;
        values: string[];
        defaultValue: string;
        comment: string;
    };
    triggers: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    stages: {
        type: string;
        allowNull: boolean;
        defaultValue: never[];
        comment: string;
    };
    variables: {
        type: string;
        defaultValue: {};
        comment: string;
    };
    errorHandling: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    approvalGates: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    metrics: {
        type: string;
        defaultValue: {};
        comment: string;
    };
    createdBy: {
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
 * Sequelize PlaybookDefinition model attributes for automated response playbooks.
 *
 * @example
 * ```typescript
 * class PlaybookDefinition extends Model {}
 * PlaybookDefinition.init(getPlaybookDefinitionModelAttributes(), {
 *   sequelize,
 *   tableName: 'playbook_definitions',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['category', 'severity'] },
 *     { fields: ['threatTypes'], using: 'gin' },
 *     { fields: ['isActive', 'autoExecute'] },
 *     { fields: ['tags'], using: 'gin' }
 *   ]
 * });
 * ```
 */
export declare const getPlaybookDefinitionModelAttributes: () => {
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
    category: {
        type: string;
        allowNull: boolean;
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
    mitreAttackIds: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    steps: {
        type: string;
        allowNull: boolean;
        defaultValue: never[];
        comment: string;
    };
    validations: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    rollback: {
        type: string;
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
    tags: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    author: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    lastModified: {
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
 * Sequelize WorkflowExecution model attributes for tracking workflow runs.
 *
 * @example
 * ```typescript
 * class WorkflowExecution extends Model {}
 * WorkflowExecution.init(getWorkflowExecutionModelAttributes(), {
 *   sequelize,
 *   tableName: 'workflow_executions',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['workflowId', 'status'] },
 *     { fields: ['executionType', 'startedAt'] },
 *     { fields: ['initiatedBy'] },
 *     { fields: ['status', 'completedAt'] }
 *   ]
 * });
 * ```
 */
export declare const getWorkflowExecutionModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    workflowId: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    playbookId: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    executionType: {
        type: string;
        values: string[];
        allowNull: boolean;
        comment: string;
    };
    status: {
        type: string;
        values: string[];
        defaultValue: string;
        comment: string;
    };
    currentStage: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    currentStep: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    progress: {
        type: string;
        defaultValue: number;
        validate: {
            min: number;
            max: number;
        };
        comment: string;
    };
    startedAt: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    completedAt: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    duration: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    initiatedBy: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    approvals: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    stageResults: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    context: {
        type: string;
        defaultValue: {};
        comment: string;
    };
    outputs: {
        type: string;
        defaultValue: {};
        comment: string;
    };
    errors: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    metrics: {
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
 * Sequelize SecurityToolIntegration model attributes for external tool connections.
 *
 * @example
 * ```typescript
 * class SecurityToolIntegration extends Model {}
 * SecurityToolIntegration.init(getSecurityToolIntegrationModelAttributes(), {
 *   sequelize,
 *   tableName: 'security_tool_integrations',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['toolType', 'status'] },
 *     { fields: ['vendor'] },
 *     { fields: ['capabilities'], using: 'gin' }
 *   ]
 * });
 * ```
 */
export declare const getSecurityToolIntegrationModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    toolName: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    toolType: {
        type: string;
        values: string[];
        allowNull: boolean;
        comment: string;
    };
    vendor: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    version: {
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
    authentication: {
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
    health: {
        type: string;
        defaultValue: {};
        comment: string;
    };
    dataFlow: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    rateLimits: {
        type: string;
        defaultValue: {};
        comment: string;
    };
    retryPolicy: {
        type: string;
        defaultValue: {};
        comment: string;
    };
    monitoring: {
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
 * Sequelize ScheduledTask model attributes for automated task scheduling.
 *
 * @example
 * ```typescript
 * class ScheduledTask extends Model {}
 * ScheduledTask.init(getScheduledTaskModelAttributes(), {
 *   sequelize,
 *   tableName: 'scheduled_tasks',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['taskType', 'status'] },
 *     { fields: ['nextRun', 'status'] },
 *     { fields: ['priority'] }
 *   ]
 * });
 * ```
 */
export declare const getScheduledTaskModelAttributes: () => {
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
    taskType: {
        type: string;
        values: string[];
        allowNull: boolean;
        comment: string;
    };
    schedule: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    workflowId: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    playbookId: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    integrationId: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    parameters: {
        type: string;
        defaultValue: {};
        comment: string;
    };
    priority: {
        type: string;
        values: string[];
        defaultValue: string;
        comment: string;
    };
    status: {
        type: string;
        values: string[];
        defaultValue: string;
        comment: string;
    };
    lastRun: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    nextRun: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    executionHistory: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    maxConcurrentRuns: {
        type: string;
        defaultValue: number;
        comment: string;
    };
    timeout: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    retryOnFailure: {
        type: string;
        defaultValue: boolean;
        comment: string;
    };
    notifications: {
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
 * Sequelize ApprovalWorkflow model attributes for approval processes.
 *
 * @example
 * ```typescript
 * class ApprovalWorkflow extends Model {}
 * ApprovalWorkflow.init(getApprovalWorkflowModelAttributes(), {
 *   sequelize,
 *   tableName: 'approval_workflows',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['status', 'priority'] },
 *     { fields: ['requestedBy'] },
 *     { fields: ['expiresAt'] },
 *     { fields: ['workflowExecutionId'] }
 *   ]
 * });
 * ```
 */
export declare const getApprovalWorkflowModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    workflowExecutionId: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    requestType: {
        type: string;
        values: string[];
        allowNull: boolean;
        comment: string;
    };
    requestedBy: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    requestedAt: {
        type: string;
        allowNull: boolean;
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
        defaultValue: string;
        comment: string;
    };
    approvalChain: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    requestDetails: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    autoApprovalRules: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    expiresAt: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    escalated: {
        type: string;
        defaultValue: boolean;
        comment: string;
    };
    escalationHistory: {
        type: string;
        defaultValue: never[];
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
 * Sequelize NotificationConfig model attributes for alert notifications.
 *
 * @example
 * ```typescript
 * class NotificationConfig extends Model {}
 * NotificationConfig.init(getNotificationConfigModelAttributes(), {
 *   sequelize,
 *   tableName: 'notification_configs',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['eventType', 'isActive'] },
 *     { fields: ['channels'], using: 'gin' }
 *   ]
 * });
 * ```
 */
export declare const getNotificationConfigModelAttributes: () => {
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
    eventType: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    triggers: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    channels: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    recipients: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    messageTemplate: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    rateLimiting: {
        type: string;
        defaultValue: {};
        comment: string;
    };
    isActive: {
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
 * Creates a new SOAR workflow definition with stages and triggers.
 *
 * @param {Partial<SOARWorkflow>} workflowData - Workflow configuration data
 * @returns {SOARWorkflow} Created workflow definition
 *
 * @example
 * ```typescript
 * const workflow = createSOARWorkflow({
 *   name: 'Ransomware Response Workflow',
 *   workflowType: 'threat_response',
 *   stages: [
 *     {
 *       id: 'stage-1',
 *       name: 'Detection & Analysis',
 *       order: 1,
 *       type: 'sequential',
 *       tasks: ['analyze-alert', 'enrich-iocs']
 *     },
 *     {
 *       id: 'stage-2',
 *       name: 'Containment',
 *       order: 2,
 *       type: 'parallel',
 *       tasks: ['isolate-hosts', 'block-c2']
 *     }
 *   ],
 *   triggers: [{
 *     type: 'event',
 *     condition: 'threat.type === "ransomware" && threat.confidence > 0.8',
 *     enabled: true
 *   }]
 * });
 * console.log('Workflow created:', workflow.id);
 * ```
 */
export declare const createSOARWorkflow: (workflowData: Partial<SOARWorkflow>) => SOARWorkflow;
/**
 * Executes a SOAR workflow with comprehensive tracking and error handling.
 *
 * @param {string} workflowId - Workflow identifier
 * @param {Record<string, any>} context - Execution context
 * @param {string} initiatedBy - User initiating execution
 * @returns {Promise<WorkflowExecution>} Workflow execution instance
 *
 * @example
 * ```typescript
 * const execution = await executeSOARWorkflow(
 *   'workflow-123',
 *   {
 *     threatId: 'threat-456',
 *     affectedAssets: ['host-1', 'host-2'],
 *     severity: 'critical'
 *   },
 *   'user-789'
 * );
 * console.log('Execution status:', execution.status);
 * console.log('Progress:', execution.progress);
 * ```
 */
export declare const executeSOARWorkflow: (workflowId: string, context: Record<string, any>, initiatedBy: string) => Promise<WorkflowExecution>;
/**
 * Pauses a running workflow execution for manual intervention.
 *
 * @param {string} executionId - Execution identifier
 * @param {string} reason - Reason for pausing
 * @returns {Promise<WorkflowExecution>} Updated execution instance
 *
 * @example
 * ```typescript
 * const paused = await pauseWorkflowExecution(
 *   'exec-123',
 *   'Awaiting security team approval for containment actions'
 * );
 * console.log('Workflow paused at stage:', paused.currentStage);
 * ```
 */
export declare const pauseWorkflowExecution: (executionId: string, reason: string) => Promise<WorkflowExecution>;
/**
 * Resumes a paused workflow execution from the last checkpoint.
 *
 * @param {string} executionId - Execution identifier
 * @param {string} resumedBy - User resuming execution
 * @returns {Promise<WorkflowExecution>} Resumed execution instance
 *
 * @example
 * ```typescript
 * const resumed = await resumeWorkflowExecution('exec-123', 'user-789');
 * console.log('Workflow resumed, current progress:', resumed.progress);
 * ```
 */
export declare const resumeWorkflowExecution: (executionId: string, resumedBy: string) => Promise<WorkflowExecution>;
/**
 * Cancels a running workflow execution with cleanup actions.
 *
 * @param {string} executionId - Execution identifier
 * @param {string} cancelledBy - User cancelling execution
 * @param {string} reason - Cancellation reason
 * @returns {Promise<WorkflowExecution>} Cancelled execution instance
 *
 * @example
 * ```typescript
 * const cancelled = await cancelWorkflowExecution(
 *   'exec-123',
 *   'user-789',
 *   'False positive detection - no threat found'
 * );
 * console.log('Workflow cancelled:', cancelled.status);
 * ```
 */
export declare const cancelWorkflowExecution: (executionId: string, cancelledBy: string, reason: string) => Promise<WorkflowExecution>;
/**
 * Retrieves workflow execution history with filtering and pagination.
 *
 * @param {string} workflowId - Workflow identifier
 * @param {object} filters - Execution filters
 * @returns {Promise<WorkflowExecution[]>} Array of workflow executions
 *
 * @example
 * ```typescript
 * const history = await getWorkflowExecutionHistory(
 *   'workflow-123',
 *   {
 *     status: 'completed',
 *     startDate: '2024-01-01',
 *     endDate: '2024-01-31',
 *     limit: 50
 *   }
 * );
 * console.log('Completed executions:', history.length);
 * ```
 */
export declare const getWorkflowExecutionHistory: (workflowId: string, filters: Record<string, any>) => Promise<WorkflowExecution[]>;
/**
 * Validates workflow configuration for errors and best practices.
 *
 * @param {SOARWorkflow} workflow - Workflow to validate
 * @returns {object} Validation results with errors and warnings
 *
 * @example
 * ```typescript
 * const validation = validateWorkflowConfiguration(workflow);
 * if (validation.errors.length > 0) {
 *   console.error('Validation errors:', validation.errors);
 * }
 * if (validation.warnings.length > 0) {
 *   console.warn('Validation warnings:', validation.warnings);
 * }
 * ```
 */
export declare const validateWorkflowConfiguration: (workflow: SOARWorkflow) => {
    valid: boolean;
    errors: string[];
    warnings: string[];
};
/**
 * Clones an existing workflow with optional modifications.
 *
 * @param {string} sourceWorkflowId - Source workflow identifier
 * @param {string} newName - Name for cloned workflow
 * @param {Partial<SOARWorkflow>} modifications - Optional modifications
 * @returns {SOARWorkflow} Cloned workflow instance
 *
 * @example
 * ```typescript
 * const cloned = cloneWorkflow(
 *   'workflow-123',
 *   'Ransomware Response - Production',
 *   {
 *     status: 'draft',
 *     approvalGates: [
 *       {
 *         stageId: 'stage-2',
 *         required: true,
 *         approvers: ['security-team']
 *       }
 *     ]
 *   }
 * );
 * console.log('Cloned workflow:', cloned.id);
 * ```
 */
export declare const cloneWorkflow: (sourceWorkflowId: string, newName: string, modifications?: Partial<SOARWorkflow>) => SOARWorkflow;
/**
 * Generates workflow metrics and performance analytics.
 *
 * @param {string} workflowId - Workflow identifier
 * @param {Date} startDate - Analytics start date
 * @param {Date} endDate - Analytics end date
 * @returns {Promise<object>} Workflow analytics data
 *
 * @example
 * ```typescript
 * const metrics = await generateWorkflowMetrics(
 *   'workflow-123',
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31')
 * );
 * console.log('Success rate:', metrics.successRate);
 * console.log('Average duration:', metrics.averageDuration);
 * console.log('Total executions:', metrics.totalExecutions);
 * ```
 */
export declare const generateWorkflowMetrics: (workflowId: string, startDate: Date, endDate: Date) => Promise<{
    workflowId: string;
    totalExecutions: number;
    successRate: number;
    averageDuration: number;
    medianDuration: number;
    failureRate: number;
    mostCommonErrors: Array<{
        error: string;
        count: number;
    }>;
    performanceTrend: Array<{
        date: string;
        executions: number;
        successRate: number;
    }>;
}>;
/**
 * Creates a new playbook definition with steps and validations.
 *
 * @param {Partial<PlaybookDefinition>} playbookData - Playbook configuration
 * @returns {PlaybookDefinition} Created playbook definition
 *
 * @example
 * ```typescript
 * const playbook = createPlaybook({
 *   name: 'Phishing Email Response',
 *   category: 'Email Security',
 *   threatTypes: ['phishing', 'credential_theft'],
 *   severity: 'high',
 *   steps: [
 *     {
 *       id: 'step-1',
 *       order: 1,
 *       name: 'Analyze Email Headers',
 *       actionType: 'analysis',
 *       tool: 'email_analyzer',
 *       command: 'analyze_headers',
 *       parameters: { includeLinks: true }
 *     }
 *   ]
 * });
 * console.log('Playbook created:', playbook.id);
 * ```
 */
export declare const createPlaybook: (playbookData: Partial<PlaybookDefinition>) => PlaybookDefinition;
/**
 * Executes a playbook with step-by-step tracking and error handling.
 *
 * @param {string} playbookId - Playbook identifier
 * @param {Record<string, any>} context - Execution context
 * @returns {Promise<WorkflowExecution>} Playbook execution instance
 *
 * @example
 * ```typescript
 * const execution = await executePlaybook(
 *   'playbook-123',
 *   {
 *     emailId: 'email-456',
 *     reportedBy: 'user-789',
 *     urgency: 'high'
 *   }
 * );
 * console.log('Playbook execution status:', execution.status);
 * ```
 */
export declare const executePlaybook: (playbookId: string, context: Record<string, any>) => Promise<WorkflowExecution>;
/**
 * Validates playbook definition for completeness and correctness.
 *
 * @param {PlaybookDefinition} playbook - Playbook to validate
 * @returns {object} Validation results
 *
 * @example
 * ```typescript
 * const validation = validatePlaybook(playbook);
 * if (!validation.valid) {
 *   console.error('Playbook validation failed:', validation.errors);
 * }
 * ```
 */
export declare const validatePlaybook: (playbook: PlaybookDefinition) => {
    valid: boolean;
    errors: string[];
    warnings: string[];
};
/**
 * Retrieves playbook execution statistics and performance data.
 *
 * @param {string} playbookId - Playbook identifier
 * @param {number} days - Number of days to analyze
 * @returns {Promise<object>} Playbook statistics
 *
 * @example
 * ```typescript
 * const stats = await getPlaybookStatistics('playbook-123', 30);
 * console.log('Execution count:', stats.executionCount);
 * console.log('Success rate:', stats.successRate);
 * console.log('Average duration:', stats.averageDuration);
 * ```
 */
export declare const getPlaybookStatistics: (playbookId: string, days: number) => Promise<{
    playbookId: string;
    executionCount: number;
    successRate: number;
    averageDuration: number;
    stepSuccessRates: Record<string, number>;
    commonFailurePoints: Array<{
        step: string;
        failureRate: number;
    }>;
}>;
/**
 * Tests playbook execution in dry-run mode without making actual changes.
 *
 * @param {string} playbookId - Playbook identifier
 * @param {Record<string, any>} context - Test execution context
 * @returns {Promise<object>} Dry-run results
 *
 * @example
 * ```typescript
 * const dryRun = await dryRunPlaybook(
 *   'playbook-123',
 *   { emailId: 'test-email', simulateFailure: false }
 * );
 * console.log('Dry run successful:', dryRun.success);
 * console.log('Steps validated:', dryRun.stepsValidated);
 * ```
 */
export declare const dryRunPlaybook: (playbookId: string, context: Record<string, any>) => Promise<{
    playbookId: string;
    success: boolean;
    stepsValidated: number;
    warnings: string[];
    estimatedDuration: number;
    resourcesRequired: string[];
}>;
/**
 * Versions a playbook and archives previous version.
 *
 * @param {string} playbookId - Playbook identifier
 * @param {string} versionNote - Version change notes
 * @returns {PlaybookDefinition} New version of playbook
 *
 * @example
 * ```typescript
 * const newVersion = versionPlaybook(
 *   'playbook-123',
 *   'Added additional validation step and improved error handling'
 * );
 * console.log('New version:', newVersion.version);
 * ```
 */
export declare const versionPlaybook: (playbookId: string, versionNote: string) => PlaybookDefinition;
/**
 * Exports playbook definition in portable format for sharing.
 *
 * @param {string} playbookId - Playbook identifier
 * @param {string} format - Export format (json, yaml, xml)
 * @returns {Promise<string>} Exported playbook content
 *
 * @example
 * ```typescript
 * const exported = await exportPlaybook('playbook-123', 'json');
 * fs.writeFileSync('playbook-export.json', exported);
 * ```
 */
export declare const exportPlaybook: (playbookId: string, format: string) => Promise<string>;
/**
 * Imports playbook definition from external source.
 *
 * @param {string} playbookContent - Playbook content to import
 * @param {string} format - Import format (json, yaml, xml)
 * @returns {Promise<PlaybookDefinition>} Imported playbook
 *
 * @example
 * ```typescript
 * const content = fs.readFileSync('playbook-import.json', 'utf8');
 * const imported = await importPlaybook(content, 'json');
 * console.log('Imported playbook:', imported.name);
 * ```
 */
export declare const importPlaybook: (playbookContent: string, format: string) => Promise<PlaybookDefinition>;
/**
 * Registers a new security tool integration with authentication.
 *
 * @param {Partial<SecurityToolIntegration>} integrationData - Integration configuration
 * @returns {Promise<SecurityToolIntegration>} Registered integration
 *
 * @example
 * ```typescript
 * const integration = await registerSecurityTool({
 *   toolName: 'Splunk Enterprise',
 *   toolType: 'siem',
 *   vendor: 'Splunk',
 *   version: '9.0',
 *   connectionType: 'api',
 *   endpoint: 'https://splunk.example.com:8089',
 *   authentication: {
 *     type: 'token',
 *     encryptedCredentials: encryptCredentials({ token: 'secret-token' })
 *   }
 * });
 * console.log('Integration registered:', integration.id);
 * ```
 */
export declare const registerSecurityTool: (integrationData: Partial<SecurityToolIntegration>) => Promise<SecurityToolIntegration>;
/**
 * Tests connectivity to a security tool integration.
 *
 * @param {string} integrationId - Integration identifier
 * @returns {Promise<object>} Connection test results
 *
 * @example
 * ```typescript
 * const result = await testToolConnection('integration-123');
 * console.log('Connection successful:', result.success);
 * console.log('Latency:', result.latencyMs);
 * ```
 */
export declare const testToolConnection: (integrationId: string) => Promise<{
    integrationId: string;
    success: boolean;
    latencyMs: number;
    capabilities: string[];
    error?: string;
}>;
/**
 * Executes an action on a connected security tool.
 *
 * @param {string} integrationId - Integration identifier
 * @param {string} action - Action to execute
 * @param {Record<string, any>} parameters - Action parameters
 * @returns {Promise<object>} Action execution result
 *
 * @example
 * ```typescript
 * const result = await executeToolAction(
 *   'integration-123',
 *   'block_ip',
 *   {
 *     ipAddress: '192.168.1.100',
 *     duration: 3600,
 *     reason: 'Malicious activity detected'
 *   }
 * );
 * console.log('Action executed:', result.success);
 * ```
 */
export declare const executeToolAction: (integrationId: string, action: string, parameters: Record<string, any>) => Promise<{
    integrationId: string;
    action: string;
    success: boolean;
    result?: Record<string, any>;
    error?: string;
    executionTime: number;
}>;
/**
 * Retrieves data from a security tool via integration.
 *
 * @param {string} integrationId - Integration identifier
 * @param {string} query - Query or filter criteria
 * @param {Record<string, any>} options - Query options
 * @returns {Promise<object>} Query results
 *
 * @example
 * ```typescript
 * const data = await queryToolData(
 *   'integration-123',
 *   'search sourcetype=firewall action=blocked | stats count by src_ip',
 *   { maxResults: 100, timeout: 30000 }
 * );
 * console.log('Results:', data.results.length);
 * ```
 */
export declare const queryToolData: (integrationId: string, query: string, options: Record<string, any>) => Promise<{
    integrationId: string;
    query: string;
    results: any[];
    totalResults: number;
    executionTime: number;
}>;
/**
 * Synchronizes data between orchestration platform and security tool.
 *
 * @param {string} integrationId - Integration identifier
 * @param {string} syncDirection - Sync direction (inbound, outbound, bidirectional)
 * @returns {Promise<object>} Synchronization results
 *
 * @example
 * ```typescript
 * const sync = await synchronizeToolData('integration-123', 'bidirectional');
 * console.log('Records synced:', sync.recordsSynced);
 * console.log('Errors:', sync.errors.length);
 * ```
 */
export declare const synchronizeToolData: (integrationId: string, syncDirection: string) => Promise<{
    integrationId: string;
    syncDirection: string;
    recordsSynced: number;
    errors: string[];
    startedAt: Date;
    completedAt: Date;
    duration: number;
}>;
/**
 * Monitors health and performance of security tool integration.
 *
 * @param {string} integrationId - Integration identifier
 * @returns {Promise<object>} Health check results
 *
 * @example
 * ```typescript
 * const health = await monitorToolHealth('integration-123');
 * console.log('Status:', health.status);
 * console.log('Availability:', health.availability);
 * console.log('Error rate:', health.errorRate);
 * ```
 */
export declare const monitorToolHealth: (integrationId: string) => Promise<{
    integrationId: string;
    status: string;
    availability: number;
    latencyMs: number;
    errorRate: number;
    lastCheck: Date;
    issues: string[];
}>;
/**
 * Revokes a security tool integration and cleans up resources.
 *
 * @param {string} integrationId - Integration identifier
 * @param {string} reason - Revocation reason
 * @returns {Promise<object>} Revocation result
 *
 * @example
 * ```typescript
 * const result = await revokeToolIntegration(
 *   'integration-123',
 *   'Tool being decommissioned'
 * );
 * console.log('Integration revoked:', result.success);
 * ```
 */
export declare const revokeToolIntegration: (integrationId: string, reason: string) => Promise<{
    integrationId: string;
    success: boolean;
    revokedAt: Date;
    credentialsRevoked: boolean;
    resourcesCleaned: boolean;
}>;
/**
 * Schedules a recurring task for automated execution.
 *
 * @param {Partial<ScheduledTask>} taskData - Task configuration
 * @returns {ScheduledTask} Created scheduled task
 *
 * @example
 * ```typescript
 * const task = scheduleTask({
 *   name: 'Daily Threat Intelligence Sync',
 *   taskType: 'integration_sync',
 *   schedule: {
 *     type: 'cron',
 *     expression: '0 2 * * *',
 *     timezone: 'America/New_York'
 *   },
 *   integrationId: 'integration-123',
 *   priority: 'high'
 * });
 * console.log('Task scheduled:', task.id);
 * console.log('Next run:', task.nextRun);
 * ```
 */
export declare const scheduleTask: (taskData: Partial<ScheduledTask>) => ScheduledTask;
export {};
//# sourceMappingURL=threat-intelligence-orchestration-kit.d.ts.map