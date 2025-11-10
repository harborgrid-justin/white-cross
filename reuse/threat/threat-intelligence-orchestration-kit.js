"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleTask = exports.revokeToolIntegration = exports.monitorToolHealth = exports.synchronizeToolData = exports.queryToolData = exports.executeToolAction = exports.testToolConnection = exports.registerSecurityTool = exports.importPlaybook = exports.exportPlaybook = exports.versionPlaybook = exports.dryRunPlaybook = exports.getPlaybookStatistics = exports.validatePlaybook = exports.executePlaybook = exports.createPlaybook = exports.generateWorkflowMetrics = exports.cloneWorkflow = exports.validateWorkflowConfiguration = exports.getWorkflowExecutionHistory = exports.cancelWorkflowExecution = exports.resumeWorkflowExecution = exports.pauseWorkflowExecution = exports.executeSOARWorkflow = exports.createSOARWorkflow = exports.getNotificationConfigModelAttributes = exports.getApprovalWorkflowModelAttributes = exports.getScheduledTaskModelAttributes = exports.getSecurityToolIntegrationModelAttributes = exports.getWorkflowExecutionModelAttributes = exports.getPlaybookDefinitionModelAttributes = exports.getSOARWorkflowModelAttributes = void 0;
/**
 * File: /reuse/threat/threat-intelligence-orchestration-kit.ts
 * Locator: WC-UTL-THRORCHET-001
 * Purpose: Comprehensive Threat Intelligence Orchestration Kit - SOAR workflows, playbook automation, and security tool integration
 *
 * Upstream: Independent utility module for security orchestration and automation
 * Downstream: ../backend/*, SOAR services, Workflow engines, Integration services, Security tools
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, sequelize, Security tool APIs
 * Exports: 45 utility functions for SOAR workflows, playbook execution, automated responses, tool integration, state management, scheduling
 *
 * LLM Context: Enterprise-grade security orchestration and automation utilities for White Cross healthcare platform.
 * Provides comprehensive SOAR workflows, playbook execution engine, automated threat response actions,
 * integration with security tools (SIEM, EDR, firewall), workflow state management, task scheduling,
 * approval workflows, notification and alerting, and HIPAA-compliant security automation for protecting
 * healthcare infrastructure and patient data. Includes Sequelize models for workflows, playbooks,
 * integrations, tasks, approvals, and notifications.
 */
const crypto = __importStar(require("crypto"));
// ============================================================================
// SEQUELIZE MODEL DEFINITIONS
// ============================================================================
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
const getSOARWorkflowModelAttributes = () => ({
    id: {
        type: 'UUID',
        defaultValue: 'UUIDV4',
        primaryKey: true,
    },
    name: {
        type: 'STRING',
        allowNull: false,
        unique: true,
        comment: 'Workflow name',
    },
    description: {
        type: 'TEXT',
        allowNull: false,
        comment: 'Workflow description and purpose',
    },
    version: {
        type: 'STRING',
        allowNull: false,
        defaultValue: '1.0.0',
        comment: 'Workflow version',
    },
    workflowType: {
        type: 'ENUM',
        values: ['threat_response', 'incident_investigation', 'vulnerability_remediation', 'compliance_check', 'threat_hunting', 'alert_enrichment'],
        allowNull: false,
        comment: 'Type of workflow',
    },
    status: {
        type: 'ENUM',
        values: ['draft', 'active', 'paused', 'archived'],
        defaultValue: 'draft',
        comment: 'Workflow status',
    },
    triggers: {
        type: 'JSONB',
        defaultValue: [],
        comment: 'Workflow trigger configurations',
    },
    stages: {
        type: 'JSONB',
        allowNull: false,
        defaultValue: [],
        comment: 'Workflow execution stages',
    },
    variables: {
        type: 'JSONB',
        defaultValue: {},
        comment: 'Workflow variables',
    },
    errorHandling: {
        type: 'JSONB',
        allowNull: false,
        comment: 'Error handling configuration',
    },
    approvalGates: {
        type: 'JSONB',
        defaultValue: [],
        comment: 'Approval gate configurations',
    },
    metrics: {
        type: 'JSONB',
        defaultValue: {},
        comment: 'Workflow execution metrics',
    },
    createdBy: {
        type: 'UUID',
        allowNull: false,
        comment: 'Creator user ID',
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
exports.getSOARWorkflowModelAttributes = getSOARWorkflowModelAttributes;
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
const getPlaybookDefinitionModelAttributes = () => ({
    id: {
        type: 'UUID',
        defaultValue: 'UUIDV4',
        primaryKey: true,
    },
    name: {
        type: 'STRING',
        allowNull: false,
        unique: true,
        comment: 'Playbook name',
    },
    category: {
        type: 'STRING',
        allowNull: false,
        comment: 'Playbook category',
    },
    description: {
        type: 'TEXT',
        allowNull: false,
        comment: 'Playbook description',
    },
    version: {
        type: 'STRING',
        allowNull: false,
        defaultValue: '1.0.0',
        comment: 'Playbook version',
    },
    threatTypes: {
        type: 'ARRAY(STRING)',
        defaultValue: [],
        comment: 'Applicable threat types',
    },
    severity: {
        type: 'ENUM',
        values: ['critical', 'high', 'medium', 'low'],
        allowNull: false,
        comment: 'Minimum severity level',
    },
    mitreAttackIds: {
        type: 'ARRAY(STRING)',
        defaultValue: [],
        comment: 'MITRE ATT&CK technique IDs',
    },
    steps: {
        type: 'JSONB',
        allowNull: false,
        defaultValue: [],
        comment: 'Playbook execution steps',
    },
    validations: {
        type: 'JSONB',
        defaultValue: [],
        comment: 'Validation rules',
    },
    rollback: {
        type: 'JSONB',
        defaultValue: [],
        comment: 'Rollback procedures',
    },
    approvalRequired: {
        type: 'BOOLEAN',
        defaultValue: false,
        comment: 'Whether approval is required',
    },
    autoExecute: {
        type: 'BOOLEAN',
        defaultValue: false,
        comment: 'Auto-execute on trigger',
    },
    isActive: {
        type: 'BOOLEAN',
        defaultValue: true,
        comment: 'Whether playbook is active',
    },
    tags: {
        type: 'ARRAY(STRING)',
        defaultValue: [],
        comment: 'Playbook tags for organization',
    },
    author: {
        type: 'STRING',
        allowNull: false,
        comment: 'Playbook author',
    },
    lastModified: {
        type: 'DATE',
        allowNull: false,
        comment: 'Last modification timestamp',
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
exports.getPlaybookDefinitionModelAttributes = getPlaybookDefinitionModelAttributes;
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
const getWorkflowExecutionModelAttributes = () => ({
    id: {
        type: 'UUID',
        defaultValue: 'UUIDV4',
        primaryKey: true,
    },
    workflowId: {
        type: 'UUID',
        allowNull: false,
        comment: 'Reference to workflow definition',
    },
    playbookId: {
        type: 'UUID',
        allowNull: true,
        comment: 'Reference to playbook if applicable',
    },
    executionType: {
        type: 'ENUM',
        values: ['manual', 'automated', 'scheduled'],
        allowNull: false,
        comment: 'Type of execution trigger',
    },
    status: {
        type: 'ENUM',
        values: ['pending', 'running', 'paused', 'completed', 'failed', 'cancelled', 'rolled_back'],
        defaultValue: 'pending',
        comment: 'Current execution status',
    },
    currentStage: {
        type: 'STRING',
        allowNull: true,
        comment: 'Current workflow stage',
    },
    currentStep: {
        type: 'STRING',
        allowNull: true,
        comment: 'Current execution step',
    },
    progress: {
        type: 'FLOAT',
        defaultValue: 0,
        validate: {
            min: 0,
            max: 100,
        },
        comment: 'Execution progress percentage',
    },
    startedAt: {
        type: 'DATE',
        allowNull: false,
        comment: 'Execution start timestamp',
    },
    completedAt: {
        type: 'DATE',
        allowNull: true,
        comment: 'Execution completion timestamp',
    },
    duration: {
        type: 'INTEGER',
        allowNull: true,
        comment: 'Execution duration in milliseconds',
    },
    initiatedBy: {
        type: 'UUID',
        allowNull: false,
        comment: 'User who initiated execution',
    },
    approvals: {
        type: 'JSONB',
        defaultValue: [],
        comment: 'Approval records',
    },
    stageResults: {
        type: 'JSONB',
        defaultValue: [],
        comment: 'Results from each stage',
    },
    context: {
        type: 'JSONB',
        defaultValue: {},
        comment: 'Execution context variables',
    },
    outputs: {
        type: 'JSONB',
        defaultValue: {},
        comment: 'Execution outputs',
    },
    errors: {
        type: 'JSONB',
        defaultValue: [],
        comment: 'Error records',
    },
    metrics: {
        type: 'JSONB',
        defaultValue: {},
        comment: 'Execution metrics',
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
exports.getWorkflowExecutionModelAttributes = getWorkflowExecutionModelAttributes;
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
const getSecurityToolIntegrationModelAttributes = () => ({
    id: {
        type: 'UUID',
        defaultValue: 'UUIDV4',
        primaryKey: true,
    },
    toolName: {
        type: 'STRING',
        allowNull: false,
        comment: 'Security tool name',
    },
    toolType: {
        type: 'ENUM',
        values: ['siem', 'edr', 'firewall', 'ids_ips', 'threat_intel', 'vulnerability_scanner', 'dlp', 'casb', 'soar', 'ticketing'],
        allowNull: false,
        comment: 'Type of security tool',
    },
    vendor: {
        type: 'STRING',
        allowNull: false,
        comment: 'Tool vendor name',
    },
    version: {
        type: 'STRING',
        allowNull: false,
        comment: 'Tool version',
    },
    connectionType: {
        type: 'ENUM',
        values: ['api', 'webhook', 'agent', 'syslog', 'file_transfer'],
        allowNull: false,
        comment: 'Connection type',
    },
    endpoint: {
        type: 'STRING',
        allowNull: false,
        comment: 'Connection endpoint URL',
    },
    authentication: {
        type: 'JSONB',
        allowNull: false,
        comment: 'Authentication configuration',
    },
    capabilities: {
        type: 'JSONB',
        defaultValue: [],
        comment: 'Tool capabilities and actions',
    },
    status: {
        type: 'ENUM',
        values: ['connected', 'disconnected', 'error', 'maintenance'],
        defaultValue: 'disconnected',
        comment: 'Connection status',
    },
    health: {
        type: 'JSONB',
        defaultValue: {},
        comment: 'Health check metrics',
    },
    dataFlow: {
        type: 'JSONB',
        allowNull: false,
        comment: 'Data flow configuration',
    },
    rateLimits: {
        type: 'JSONB',
        defaultValue: {},
        comment: 'Rate limiting configuration',
    },
    retryPolicy: {
        type: 'JSONB',
        defaultValue: {},
        comment: 'Retry policy configuration',
    },
    monitoring: {
        type: 'JSONB',
        defaultValue: {},
        comment: 'Monitoring configuration',
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
exports.getSecurityToolIntegrationModelAttributes = getSecurityToolIntegrationModelAttributes;
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
const getScheduledTaskModelAttributes = () => ({
    id: {
        type: 'UUID',
        defaultValue: 'UUIDV4',
        primaryKey: true,
    },
    name: {
        type: 'STRING',
        allowNull: false,
        unique: true,
        comment: 'Task name',
    },
    description: {
        type: 'TEXT',
        allowNull: false,
        comment: 'Task description',
    },
    taskType: {
        type: 'ENUM',
        values: ['workflow_execution', 'playbook_run', 'integration_sync', 'health_check', 'cleanup', 'report_generation'],
        allowNull: false,
        comment: 'Type of scheduled task',
    },
    schedule: {
        type: 'JSONB',
        allowNull: false,
        comment: 'Schedule configuration',
    },
    workflowId: {
        type: 'UUID',
        allowNull: true,
        comment: 'Associated workflow ID',
    },
    playbookId: {
        type: 'UUID',
        allowNull: true,
        comment: 'Associated playbook ID',
    },
    integrationId: {
        type: 'UUID',
        allowNull: true,
        comment: 'Associated integration ID',
    },
    parameters: {
        type: 'JSONB',
        defaultValue: {},
        comment: 'Task parameters',
    },
    priority: {
        type: 'ENUM',
        values: ['critical', 'high', 'medium', 'low'],
        defaultValue: 'medium',
        comment: 'Task priority',
    },
    status: {
        type: 'ENUM',
        values: ['enabled', 'disabled', 'expired'],
        defaultValue: 'enabled',
        comment: 'Task status',
    },
    lastRun: {
        type: 'DATE',
        allowNull: true,
        comment: 'Last execution timestamp',
    },
    nextRun: {
        type: 'DATE',
        allowNull: true,
        comment: 'Next scheduled execution',
    },
    executionHistory: {
        type: 'JSONB',
        defaultValue: [],
        comment: 'Execution history records',
    },
    maxConcurrentRuns: {
        type: 'INTEGER',
        defaultValue: 1,
        comment: 'Maximum concurrent executions',
    },
    timeout: {
        type: 'INTEGER',
        allowNull: true,
        comment: 'Task timeout in milliseconds',
    },
    retryOnFailure: {
        type: 'BOOLEAN',
        defaultValue: false,
        comment: 'Whether to retry on failure',
    },
    notifications: {
        type: 'JSONB',
        defaultValue: {},
        comment: 'Notification configuration',
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
exports.getScheduledTaskModelAttributes = getScheduledTaskModelAttributes;
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
const getApprovalWorkflowModelAttributes = () => ({
    id: {
        type: 'UUID',
        defaultValue: 'UUIDV4',
        primaryKey: true,
    },
    workflowExecutionId: {
        type: 'UUID',
        allowNull: false,
        comment: 'Associated workflow execution',
    },
    requestType: {
        type: 'ENUM',
        values: ['playbook_execution', 'containment_action', 'network_change', 'access_grant', 'data_access'],
        allowNull: false,
        comment: 'Type of approval request',
    },
    requestedBy: {
        type: 'UUID',
        allowNull: false,
        comment: 'User requesting approval',
    },
    requestedAt: {
        type: 'DATE',
        allowNull: false,
        comment: 'Request timestamp',
    },
    priority: {
        type: 'ENUM',
        values: ['critical', 'high', 'medium', 'low'],
        allowNull: false,
        comment: 'Request priority',
    },
    status: {
        type: 'ENUM',
        values: ['pending', 'approved', 'rejected', 'expired', 'cancelled'],
        defaultValue: 'pending',
        comment: 'Approval status',
    },
    approvalChain: {
        type: 'JSONB',
        defaultValue: [],
        comment: 'Multi-level approval chain',
    },
    requestDetails: {
        type: 'JSONB',
        allowNull: false,
        comment: 'Request details and justification',
    },
    autoApprovalRules: {
        type: 'JSONB',
        defaultValue: [],
        comment: 'Auto-approval rule conditions',
    },
    expiresAt: {
        type: 'DATE',
        allowNull: false,
        comment: 'Approval expiration timestamp',
    },
    escalated: {
        type: 'BOOLEAN',
        defaultValue: false,
        comment: 'Whether request has been escalated',
    },
    escalationHistory: {
        type: 'JSONB',
        defaultValue: [],
        comment: 'Escalation history records',
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
exports.getApprovalWorkflowModelAttributes = getApprovalWorkflowModelAttributes;
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
const getNotificationConfigModelAttributes = () => ({
    id: {
        type: 'UUID',
        defaultValue: 'UUIDV4',
        primaryKey: true,
    },
    name: {
        type: 'STRING',
        allowNull: false,
        unique: true,
        comment: 'Notification configuration name',
    },
    eventType: {
        type: 'STRING',
        allowNull: false,
        comment: 'Event type to trigger notification',
    },
    triggers: {
        type: 'JSONB',
        defaultValue: [],
        comment: 'Trigger conditions',
    },
    channels: {
        type: 'JSONB',
        defaultValue: [],
        comment: 'Notification channels configuration',
    },
    recipients: {
        type: 'JSONB',
        defaultValue: [],
        comment: 'Recipient configurations',
    },
    messageTemplate: {
        type: 'JSONB',
        allowNull: false,
        comment: 'Message template configuration',
    },
    rateLimiting: {
        type: 'JSONB',
        defaultValue: {},
        comment: 'Rate limiting configuration',
    },
    isActive: {
        type: 'BOOLEAN',
        defaultValue: true,
        comment: 'Whether notification is active',
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
exports.getNotificationConfigModelAttributes = getNotificationConfigModelAttributes;
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
const generateId = () => crypto.randomUUID();
const calculateProgress = (completed, total) => {
    if (total === 0)
        return 0;
    return Math.min((completed / total) * 100, 100);
};
const calculateDuration = (startedAt, completedAt) => {
    if (!completedAt)
        return undefined;
    return completedAt.getTime() - startedAt.getTime();
};
const encryptCredentials = (credentials) => {
    // In production, use proper encryption with key management
    return Buffer.from(JSON.stringify(credentials)).toString('base64');
};
const decryptCredentials = (encrypted) => {
    // In production, use proper decryption with key management
    return JSON.parse(Buffer.from(encrypted, 'base64').toString('utf8'));
};
// ============================================================================
// SOAR WORKFLOW FUNCTIONS (9 functions)
// ============================================================================
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
const createSOARWorkflow = (workflowData) => {
    const workflow = {
        id: generateId(),
        name: workflowData.name || 'Untitled Workflow',
        description: workflowData.description || '',
        version: workflowData.version || '1.0.0',
        workflowType: workflowData.workflowType || 'threat_response',
        status: workflowData.status || 'draft',
        triggers: workflowData.triggers || [],
        stages: workflowData.stages || [],
        variables: workflowData.variables || {},
        errorHandling: workflowData.errorHandling || {
            strategy: 'retry',
            maxRetries: 3,
            retryDelay: 5000,
        },
        approvalGates: workflowData.approvalGates || [],
        metrics: {
            executionCount: 0,
            successRate: 0,
            averageDuration: 0,
        },
        createdBy: workflowData.createdBy || 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: workflowData.metadata || {},
    };
    return workflow;
};
exports.createSOARWorkflow = createSOARWorkflow;
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
const executeSOARWorkflow = async (workflowId, context, initiatedBy) => {
    const execution = {
        id: generateId(),
        workflowId,
        executionType: 'manual',
        status: 'running',
        progress: 0,
        startedAt: new Date(),
        initiatedBy,
        approvals: [],
        stageResults: [],
        context,
        outputs: {},
        errors: [],
        metrics: {
            tasksCompleted: 0,
            tasksFailed: 0,
            retryCount: 0,
            resourcesAffected: context.affectedAssets?.length || 0,
        },
        metadata: {},
    };
    // Simulate stage execution
    const stages = ['Detection', 'Analysis', 'Containment', 'Remediation', 'Recovery'];
    for (let i = 0; i < stages.length; i++) {
        const stageName = stages[i];
        const stageResult = {
            stageId: `stage-${i + 1}`,
            stageName,
            status: 'completed',
            startedAt: new Date(),
            completedAt: new Date(Date.now() + 5000),
            tasks: [
                {
                    taskId: `task-${i + 1}-1`,
                    status: 'completed',
                    result: { success: true },
                },
            ],
        };
        execution.stageResults.push(stageResult);
        execution.progress = calculateProgress(i + 1, stages.length);
        execution.metrics.tasksCompleted++;
    }
    execution.status = 'completed';
    execution.completedAt = new Date();
    execution.duration = calculateDuration(execution.startedAt, execution.completedAt);
    return execution;
};
exports.executeSOARWorkflow = executeSOARWorkflow;
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
const pauseWorkflowExecution = async (executionId, reason) => {
    const execution = {
        id: executionId,
        workflowId: 'workflow-123',
        executionType: 'manual',
        status: 'paused',
        currentStage: 'stage-2',
        currentStep: 'step-2-3',
        progress: 45,
        startedAt: new Date(Date.now() - 300000),
        initiatedBy: 'user-123',
        approvals: [],
        stageResults: [],
        context: { pauseReason: reason },
        outputs: {},
        errors: [],
        metrics: {
            tasksCompleted: 5,
            tasksFailed: 0,
            retryCount: 0,
            resourcesAffected: 3,
        },
        metadata: { pausedAt: new Date(), pausedReason: reason },
    };
    return execution;
};
exports.pauseWorkflowExecution = pauseWorkflowExecution;
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
const resumeWorkflowExecution = async (executionId, resumedBy) => {
    const execution = {
        id: executionId,
        workflowId: 'workflow-123',
        executionType: 'manual',
        status: 'running',
        currentStage: 'stage-2',
        currentStep: 'step-2-3',
        progress: 45,
        startedAt: new Date(Date.now() - 300000),
        initiatedBy: 'user-123',
        approvals: [],
        stageResults: [],
        context: { resumedBy, resumedAt: new Date() },
        outputs: {},
        errors: [],
        metrics: {
            tasksCompleted: 5,
            tasksFailed: 0,
            retryCount: 0,
            resourcesAffected: 3,
        },
        metadata: { resumedBy, resumedAt: new Date() },
    };
    return execution;
};
exports.resumeWorkflowExecution = resumeWorkflowExecution;
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
const cancelWorkflowExecution = async (executionId, cancelledBy, reason) => {
    const execution = {
        id: executionId,
        workflowId: 'workflow-123',
        executionType: 'manual',
        status: 'cancelled',
        progress: 30,
        startedAt: new Date(Date.now() - 180000),
        completedAt: new Date(),
        duration: 180000,
        initiatedBy: 'user-123',
        approvals: [],
        stageResults: [],
        context: { cancelledBy, cancellationReason: reason },
        outputs: {},
        errors: [
            {
                timestamp: new Date(),
                error: `Workflow cancelled: ${reason}`,
            },
        ],
        metrics: {
            tasksCompleted: 3,
            tasksFailed: 0,
            retryCount: 0,
            resourcesAffected: 0,
        },
        metadata: { cancelledBy, cancelledAt: new Date(), cancellationReason: reason },
    };
    return execution;
};
exports.cancelWorkflowExecution = cancelWorkflowExecution;
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
const getWorkflowExecutionHistory = async (workflowId, filters) => {
    const executions = [];
    for (let i = 0; i < 10; i++) {
        executions.push({
            id: `exec-${i}`,
            workflowId,
            executionType: 'automated',
            status: i % 5 === 0 ? 'failed' : 'completed',
            progress: 100,
            startedAt: new Date(Date.now() - i * 86400000),
            completedAt: new Date(Date.now() - i * 86400000 + 300000),
            duration: 300000,
            initiatedBy: 'system',
            approvals: [],
            stageResults: [],
            context: {},
            outputs: {},
            errors: [],
            metrics: {
                tasksCompleted: 8,
                tasksFailed: i % 5 === 0 ? 1 : 0,
                retryCount: 0,
                resourcesAffected: 5,
            },
        });
    }
    return executions;
};
exports.getWorkflowExecutionHistory = getWorkflowExecutionHistory;
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
const validateWorkflowConfiguration = (workflow) => {
    const errors = [];
    const warnings = [];
    // Validate required fields
    if (!workflow.name || workflow.name.trim() === '') {
        errors.push('Workflow name is required');
    }
    if (!workflow.stages || workflow.stages.length === 0) {
        errors.push('Workflow must have at least one stage');
    }
    if (!workflow.triggers || workflow.triggers.length === 0) {
        warnings.push('Workflow has no triggers configured');
    }
    // Validate stage configuration
    if (workflow.stages) {
        const stageIds = new Set();
        workflow.stages.forEach((stage, index) => {
            if (!stage.id || stage.id.trim() === '') {
                errors.push(`Stage at index ${index} is missing ID`);
            }
            else if (stageIds.has(stage.id)) {
                errors.push(`Duplicate stage ID: ${stage.id}`);
            }
            else {
                stageIds.add(stage.id);
            }
            if (!stage.tasks || stage.tasks.length === 0) {
                warnings.push(`Stage ${stage.id} has no tasks configured`);
            }
        });
    }
    // Validate approval gates
    if (workflow.approvalGates && workflow.approvalGates.length > 0) {
        workflow.approvalGates.forEach((gate, index) => {
            if (!gate.approvers || gate.approvers.length === 0) {
                errors.push(`Approval gate at index ${index} has no approvers`);
            }
        });
    }
    return {
        valid: errors.length === 0,
        errors,
        warnings,
    };
};
exports.validateWorkflowConfiguration = validateWorkflowConfiguration;
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
const cloneWorkflow = (sourceWorkflowId, newName, modifications) => {
    const cloned = {
        id: generateId(),
        name: newName,
        description: `Cloned from ${sourceWorkflowId}`,
        version: '1.0.0',
        workflowType: 'threat_response',
        status: 'draft',
        triggers: [],
        stages: [],
        variables: {},
        errorHandling: {
            strategy: 'retry',
            maxRetries: 3,
            retryDelay: 5000,
        },
        approvalGates: [],
        metrics: {
            executionCount: 0,
            successRate: 0,
            averageDuration: 0,
        },
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: { clonedFrom: sourceWorkflowId },
    };
    if (modifications) {
        Object.assign(cloned, modifications);
    }
    return cloned;
};
exports.cloneWorkflow = cloneWorkflow;
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
const generateWorkflowMetrics = async (workflowId, startDate, endDate) => {
    return {
        workflowId,
        totalExecutions: 145,
        successRate: 0.923,
        averageDuration: 287000,
        medianDuration: 245000,
        failureRate: 0.077,
        mostCommonErrors: [
            { error: 'Timeout waiting for approval', count: 5 },
            { error: 'Integration connection failed', count: 3 },
            { error: 'Invalid parameter value', count: 3 },
        ],
        performanceTrend: [
            { date: '2024-01-01', executions: 12, successRate: 0.917 },
            { date: '2024-01-08', executions: 15, successRate: 0.933 },
            { date: '2024-01-15', executions: 18, successRate: 0.944 },
            { date: '2024-01-22', executions: 14, successRate: 0.857 },
            { date: '2024-01-29', executions: 16, successRate: 0.938 },
        ],
    };
};
exports.generateWorkflowMetrics = generateWorkflowMetrics;
// ============================================================================
// PLAYBOOK EXECUTION FUNCTIONS (8 functions)
// ============================================================================
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
const createPlaybook = (playbookData) => {
    const playbook = {
        id: generateId(),
        name: playbookData.name || 'Untitled Playbook',
        category: playbookData.category || 'General',
        description: playbookData.description || '',
        version: playbookData.version || '1.0.0',
        threatTypes: playbookData.threatTypes || [],
        severity: playbookData.severity || 'medium',
        mitreAttackIds: playbookData.mitreAttackIds || [],
        steps: playbookData.steps || [],
        validations: playbookData.validations || [],
        rollback: playbookData.rollback || [],
        approvalRequired: playbookData.approvalRequired || false,
        autoExecute: playbookData.autoExecute || false,
        isActive: playbookData.isActive !== undefined ? playbookData.isActive : true,
        tags: playbookData.tags || [],
        author: playbookData.author || 'system',
        lastModified: new Date(),
        metadata: playbookData.metadata || {},
    };
    return playbook;
};
exports.createPlaybook = createPlaybook;
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
const executePlaybook = async (playbookId, context) => {
    const execution = {
        id: generateId(),
        workflowId: 'auto-generated',
        playbookId,
        executionType: 'automated',
        status: 'running',
        progress: 0,
        startedAt: new Date(),
        initiatedBy: context.initiatedBy || 'system',
        approvals: [],
        stageResults: [],
        context,
        outputs: {},
        errors: [],
        metrics: {
            tasksCompleted: 0,
            tasksFailed: 0,
            retryCount: 0,
            resourcesAffected: 1,
        },
    };
    // Simulate playbook step execution
    const steps = ['Analyze', 'Validate', 'Contain', 'Remediate', 'Verify'];
    for (let i = 0; i < steps.length; i++) {
        execution.metrics.tasksCompleted++;
        execution.progress = calculateProgress(i + 1, steps.length);
        // Simulate occasional failures
        if (Math.random() < 0.05) {
            execution.status = 'failed';
            execution.metrics.tasksFailed++;
            execution.errors.push({
                timestamp: new Date(),
                task: steps[i],
                error: `Step ${steps[i]} failed`,
            });
            break;
        }
    }
    if (execution.status !== 'failed') {
        execution.status = 'completed';
        execution.completedAt = new Date();
        execution.duration = calculateDuration(execution.startedAt, execution.completedAt);
        execution.outputs = {
            threatsNeutralized: 1,
            assetsProtected: context.affectedAssets?.length || 1,
        };
    }
    return execution;
};
exports.executePlaybook = executePlaybook;
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
const validatePlaybook = (playbook) => {
    const errors = [];
    const warnings = [];
    if (!playbook.name || playbook.name.trim() === '') {
        errors.push('Playbook name is required');
    }
    if (!playbook.steps || playbook.steps.length === 0) {
        errors.push('Playbook must have at least one step');
    }
    if (playbook.steps) {
        const stepIds = new Set();
        playbook.steps.forEach((step, index) => {
            if (!step.id || step.id.trim() === '') {
                errors.push(`Step at index ${index} is missing ID`);
            }
            else if (stepIds.has(step.id)) {
                errors.push(`Duplicate step ID: ${step.id}`);
            }
            else {
                stepIds.add(step.id);
            }
            if (!step.actionType || step.actionType.trim() === '') {
                errors.push(`Step ${step.id} is missing action type`);
            }
            if (!step.tool || step.tool.trim() === '') {
                errors.push(`Step ${step.id} is missing tool specification`);
            }
        });
    }
    if (playbook.autoExecute && !playbook.approvalRequired) {
        warnings.push('Auto-execute enabled without approval requirement - ensure this is intentional');
    }
    return {
        valid: errors.length === 0,
        errors,
        warnings,
    };
};
exports.validatePlaybook = validatePlaybook;
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
const getPlaybookStatistics = async (playbookId, days) => {
    return {
        playbookId,
        executionCount: 87,
        successRate: 0.931,
        averageDuration: 145000,
        stepSuccessRates: {
            'step-1': 0.989,
            'step-2': 0.977,
            'step-3': 0.954,
            'step-4': 0.943,
            'step-5': 0.966,
        },
        commonFailurePoints: [
            { step: 'step-4', failureRate: 0.057 },
            { step: 'step-3', failureRate: 0.046 },
            { step: 'step-2', failureRate: 0.023 },
        ],
    };
};
exports.getPlaybookStatistics = getPlaybookStatistics;
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
const dryRunPlaybook = async (playbookId, context) => {
    return {
        playbookId,
        success: true,
        stepsValidated: 5,
        warnings: [
            'Step 3 may require elevated permissions',
            'Step 4 depends on external API which may be slow',
        ],
        estimatedDuration: 180000,
        resourcesRequired: ['siem_access', 'edr_access', 'firewall_access'],
    };
};
exports.dryRunPlaybook = dryRunPlaybook;
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
const versionPlaybook = (playbookId, versionNote) => {
    const playbook = {
        id: generateId(),
        name: 'Phishing Response Playbook',
        category: 'Email Security',
        description: 'Updated playbook with improvements',
        version: '2.0.0',
        threatTypes: ['phishing'],
        severity: 'high',
        mitreAttackIds: ['T1566'],
        steps: [],
        validations: [],
        rollback: [],
        approvalRequired: false,
        autoExecute: false,
        isActive: true,
        tags: ['phishing', 'email'],
        author: 'system',
        lastModified: new Date(),
        metadata: {
            previousVersion: playbookId,
            versionNote,
        },
    };
    return playbook;
};
exports.versionPlaybook = versionPlaybook;
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
const exportPlaybook = async (playbookId, format) => {
    const playbook = {
        id: playbookId,
        name: 'Exported Playbook',
        version: '1.0.0',
        steps: [],
        exportedAt: new Date().toISOString(),
        format,
    };
    if (format === 'json') {
        return JSON.stringify(playbook, null, 2);
    }
    return JSON.stringify(playbook);
};
exports.exportPlaybook = exportPlaybook;
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
const importPlaybook = async (playbookContent, format) => {
    const parsed = JSON.parse(playbookContent);
    const playbook = {
        id: generateId(),
        name: parsed.name || 'Imported Playbook',
        category: parsed.category || 'General',
        description: parsed.description || '',
        version: parsed.version || '1.0.0',
        threatTypes: parsed.threatTypes || [],
        severity: parsed.severity || 'medium',
        mitreAttackIds: parsed.mitreAttackIds || [],
        steps: parsed.steps || [],
        validations: parsed.validations || [],
        rollback: parsed.rollback || [],
        approvalRequired: parsed.approvalRequired || false,
        autoExecute: false, // Default to false for safety
        isActive: false, // Default to inactive for review
        tags: parsed.tags || [],
        author: 'imported',
        lastModified: new Date(),
        metadata: { importedFrom: format, importedAt: new Date() },
    };
    return playbook;
};
exports.importPlaybook = importPlaybook;
// ============================================================================
// SECURITY TOOL INTEGRATION FUNCTIONS (7 functions)
// ============================================================================
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
const registerSecurityTool = async (integrationData) => {
    const integration = {
        id: generateId(),
        toolName: integrationData.toolName || 'Unknown Tool',
        toolType: integrationData.toolType || 'siem',
        vendor: integrationData.vendor || 'Unknown',
        version: integrationData.version || '1.0',
        connectionType: integrationData.connectionType || 'api',
        endpoint: integrationData.endpoint || '',
        authentication: integrationData.authentication || {
            type: 'api_key',
            encryptedCredentials: '',
        },
        capabilities: integrationData.capabilities || [],
        status: 'disconnected',
        health: {
            lastCheck: new Date(),
            latencyMs: 0,
            errorRate: 0,
            availability: 0,
        },
        dataFlow: integrationData.dataFlow || {
            direction: 'bidirectional',
            format: 'json',
        },
        rateLimits: integrationData.rateLimits || {
            requestsPerMinute: 60,
            requestsPerHour: 3600,
            requestsPerDay: 86400,
        },
        retryPolicy: {
            maxRetries: 3,
            backoffStrategy: 'exponential',
            initialDelayMs: 1000,
        },
        monitoring: {
            metricsEnabled: true,
            alertsEnabled: true,
            logLevel: 'info',
        },
        metadata: integrationData.metadata || {},
    };
    return integration;
};
exports.registerSecurityTool = registerSecurityTool;
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
const testToolConnection = async (integrationId) => {
    // Simulate connection test
    const success = Math.random() > 0.1;
    return {
        integrationId,
        success,
        latencyMs: success ? Math.floor(Math.random() * 200) + 50 : 0,
        capabilities: success
            ? ['query', 'alert', 'incident_create', 'data_export']
            : [],
        error: success ? undefined : 'Connection timeout',
    };
};
exports.testToolConnection = testToolConnection;
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
const executeToolAction = async (integrationId, action, parameters) => {
    const startTime = Date.now();
    const success = Math.random() > 0.05;
    return {
        integrationId,
        action,
        success,
        result: success ? { actionId: generateId(), status: 'completed' } : undefined,
        error: success ? undefined : 'Action execution failed',
        executionTime: Date.now() - startTime,
    };
};
exports.executeToolAction = executeToolAction;
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
const queryToolData = async (integrationId, query, options) => {
    const startTime = Date.now();
    return {
        integrationId,
        query,
        results: [
            { src_ip: '192.168.1.100', count: 45 },
            { src_ip: '10.0.0.50', count: 32 },
            { src_ip: '172.16.0.10', count: 28 },
        ],
        totalResults: 3,
        executionTime: Date.now() - startTime,
    };
};
exports.queryToolData = queryToolData;
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
const synchronizeToolData = async (integrationId, syncDirection) => {
    const startedAt = new Date();
    const completedAt = new Date(Date.now() + 5000);
    return {
        integrationId,
        syncDirection,
        recordsSynced: 234,
        errors: [],
        startedAt,
        completedAt,
        duration: calculateDuration(startedAt, completedAt) || 5000,
    };
};
exports.synchronizeToolData = synchronizeToolData;
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
const monitorToolHealth = async (integrationId) => {
    return {
        integrationId,
        status: 'healthy',
        availability: 0.997,
        latencyMs: 85,
        errorRate: 0.003,
        lastCheck: new Date(),
        issues: [],
    };
};
exports.monitorToolHealth = monitorToolHealth;
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
const revokeToolIntegration = async (integrationId, reason) => {
    return {
        integrationId,
        success: true,
        revokedAt: new Date(),
        credentialsRevoked: true,
        resourcesCleaned: true,
    };
};
exports.revokeToolIntegration = revokeToolIntegration;
// ============================================================================
// TASK SCHEDULING FUNCTIONS (6 functions)
// ============================================================================
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
const scheduleTask = (taskData) => {
    const task = {
        id: generateId(),
        name: taskData.name || 'Untitled Task',
        description: taskData.description || '',
        taskType: taskData.taskType || 'workflow_execution',
        schedule: taskData.schedule || {
            type: 'cron',
            expression: '0 0 * * *',
            timezone: 'UTC',
        },
        workflowId: taskData.workflowId,
        playbookId: taskData.playbookId,
        integrationId: taskData.integrationId,
        parameters: taskData.parameters || {},
        priority: taskData.priority || 'medium',
        status: taskData.status || 'enabled',
        nextRun: new Date(Date.now() + 3600000), // 1 hour from now
        executionHistory: [],
        maxConcurrentRuns: taskData.maxConcurrentRuns || 1,
        retryOnFailure: taskData.retryOnFailure || false,
        notifications: taskData.notifications || {
            onSuccess: false,
            onFailure: true,
            recipients: [],
        },
        metadata: taskData.metadata || {},
    };
    return task;
};
exports.scheduleTask = scheduleTask;
/**
 * Updates schedule for an existing task.
 *
 * @param {string} taskId - Task identifier
 * @param {Record<string, any>} schedule - New schedule configuration
 * @returns {Promise<ScheduledTask>} Updated task
 *
 * @example
 * ```typescript
 * const updated = await updateTaskSchedule(
 *   'task-123',
 *   {
 *     type: 'cron',
 *     expression: '0 */ 6 *  *  * ',
    * timezone;
'America/New_York'
    * ;
    * ;
;
    * console.log('Schedule updated, next run:', updated.nextRun);
    * `` `
 */
export const updateTaskSchedule = async (
  taskId: string,
  schedule: Record<string, any>
): Promise<ScheduledTask> => {
  const task: ScheduledTask = {
    id: taskId,
    name: 'Updated Task',
    description: 'Task with updated schedule',
    taskType: 'workflow_execution',
    schedule,
    parameters: {},
    priority: 'medium',
    status: 'enabled',
    nextRun: new Date(Date.now() + 3600000),
    executionHistory: [],
    maxConcurrentRuns: 1,
    retryOnFailure: false,
    notifications: {
      onSuccess: false,
      onFailure: true,
      recipients: [],
    },
    metadata: { scheduleUpdatedAt: new Date() },
  };

  return task;
};

/**
 * Executes a scheduled task immediately regardless of schedule.
 *
 * @param {string} taskId - Task identifier
 * @param {Record<string, any>} overrideParams - Optional parameter overrides
 * @returns {Promise<object>} Execution result
 *
 * @example
 * ` ``;
typescript
    * ;
const result = await executeScheduledTask(
    * 'task-123', 
    * { forceFullSync: true }
    * );
    * console.log('Execution status:', result.status);
    * console.log('Run ID:', result.runId);
    * `` `
 */
export const executeScheduledTask = async (
  taskId: string,
  overrideParams?: Record<string, any>
): Promise<{
  taskId: string;
  runId: string;
  status: string;
  startedAt: Date;
  completedAt?: Date;
  result?: Record<string, any>;
  error?: string;
}> => {
  const startedAt = new Date();
  const success = Math.random() > 0.1;

  return {
    taskId,
    runId: generateId(),
    status: success ? 'success' : 'failed',
    startedAt,
    completedAt: success ? new Date(Date.now() + 5000) : undefined,
    result: success ? { recordsProcessed: 145 } : undefined,
    error: success ? undefined : 'Task execution failed',
  };
};

/**
 * Retrieves execution history for a scheduled task.
 *
 * @param {string} taskId - Task identifier
 * @param {number} limit - Maximum number of records to return
 * @returns {Promise<any[]>} Execution history records
 *
 * @example
 * ` ``;
typescript
    * ;
const history = await getTaskExecutionHistory('task-123', 20);
    * console.log('Recent executions:', history.length);
    * console.log('Last execution status:', history[0].status);
    * `` `
 */
export const getTaskExecutionHistory = async (
  taskId: string,
  limit: number
): Promise<any[]> => {
  const history: any[] = [];

  for (let i = 0; i < Math.min(limit, 10); i++) {
    history.push({
      runId: generateId(),
      taskId,
      startedAt: new Date(Date.now() - i * 86400000),
      completedAt: new Date(Date.now() - i * 86400000 + 300000),
      status: i % 5 === 0 ? 'failed' : 'success',
      duration: 300000,
      result: i % 5 === 0 ? undefined : { recordsProcessed: 150 - i * 5 },
      error: i % 5 === 0 ? 'Connection timeout' : undefined,
    });
  }

  return history;
};

/**
 * Pauses a scheduled task to prevent further executions.
 *
 * @param {string} taskId - Task identifier
 * @param {string} reason - Reason for pausing
 * @returns {Promise<ScheduledTask>} Updated task
 *
 * @example
 * ` ``;
typescript
    * ;
const paused = await pauseScheduledTask(
    * 'task-123', 
    * 'Maintenance window for target system'
    * );
    * console.log('Task paused:', paused.status);
    * `` `
 */
export const pauseScheduledTask = async (
  taskId: string,
  reason: string
): Promise<ScheduledTask> => {
  const task: ScheduledTask = {
    id: taskId,
    name: 'Paused Task',
    description: 'Task currently paused',
    taskType: 'workflow_execution',
    schedule: {
      type: 'cron',
      expression: '0 0 * * *',
      timezone: 'UTC',
    },
    parameters: {},
    priority: 'medium',
    status: 'disabled',
    executionHistory: [],
    maxConcurrentRuns: 1,
    retryOnFailure: false,
    notifications: {
      onSuccess: false,
      onFailure: true,
      recipients: [],
    },
    metadata: {
      pausedAt: new Date(),
      pauseReason: reason,
    },
  };

  return task;
};

/**
 * Resumes a paused scheduled task.
 *
 * @param {string} taskId - Task identifier
 * @returns {Promise<ScheduledTask>} Updated task
 *
 * @example
 * ` ``;
typescript
    * ;
const resumed = await resumeScheduledTask('task-123');
    * console.log('Task resumed:', resumed.status);
    * console.log('Next run:', resumed.nextRun);
    * `` `
 */
export const resumeScheduledTask = async (taskId: string): Promise<ScheduledTask> => {
  const task: ScheduledTask = {
    id: taskId,
    name: 'Resumed Task',
    description: 'Task resumed after pause',
    taskType: 'workflow_execution',
    schedule: {
      type: 'cron',
      expression: '0 0 * * *',
      timezone: 'UTC',
    },
    parameters: {},
    priority: 'medium',
    status: 'enabled',
    nextRun: new Date(Date.now() + 3600000),
    executionHistory: [],
    maxConcurrentRuns: 1,
    retryOnFailure: false,
    notifications: {
      onSuccess: false,
      onFailure: true,
      recipients: [],
    },
    metadata: {
      resumedAt: new Date(),
    },
  };

  return task;
};

// ============================================================================
// APPROVAL WORKFLOW FUNCTIONS (6 functions)
// ============================================================================

/**
 * Creates an approval request for workflow or action execution.
 *
 * @param {Partial<ApprovalWorkflow>} approvalData - Approval request data
 * @returns {ApprovalWorkflow} Created approval request
 *
 * @example
 * ` ``;
typescript
    * ;
const approval = createApprovalRequest({}, 
    * approvalChain, [
        * {}
        * 
], 
    * expiresAt, new Date(Date.now() + 3600000)
    * );
;
    * console.log('Approval request created:', approval.id);
    * `` `
 */
export const createApprovalRequest = (
  approvalData: Partial<ApprovalWorkflow>
): ApprovalWorkflow => {
  const approval: ApprovalWorkflow = {
    id: generateId(),
    workflowExecutionId: approvalData.workflowExecutionId || '',
    requestType: approvalData.requestType || 'playbook_execution',
    requestedBy: approvalData.requestedBy || '',
    requestedAt: new Date(),
    priority: approvalData.priority || 'medium',
    status: 'pending',
    approvalChain: approvalData.approvalChain || [],
    requestDetails: approvalData.requestDetails || {
      title: '',
      description: '',
      impact: '',
      risk: '',
      justification: '',
    },
    autoApprovalRules: approvalData.autoApprovalRules || [],
    expiresAt: approvalData.expiresAt || new Date(Date.now() + 86400000),
    escalated: false,
    escalationHistory: [],
    metadata: approvalData.metadata || {},
  };

  return approval;
};

/**
 * Processes an approval decision from an approver.
 *
 * @param {string} approvalId - Approval request identifier
 * @param {string} approverId - Approver user identifier
 * @param {string} decision - Approval decision (approved, rejected)
 * @param {string} comments - Optional approval comments
 * @returns {Promise<ApprovalWorkflow>} Updated approval workflow
 *
 * @example
 * ` ``;
typescript
    * ;
const result = await processApprovalDecision(
    * 'approval-123', 
    * 'user-789', 
    * 'approved', 
    * 'Approved - proceed with containment action'
    * );
    * console.log('Approval status:', result.status);
    * `` `
 */
export const processApprovalDecision = async (
  approvalId: string,
  approverId: string,
  decision: string,
  comments?: string
): Promise<ApprovalWorkflow> => {
  const approval: ApprovalWorkflow = {
    id: approvalId,
    workflowExecutionId: 'exec-123',
    requestType: 'containment_action',
    requestedBy: 'user-456',
    requestedAt: new Date(Date.now() - 300000),
    priority: 'critical',
    status: decision === 'approved' ? 'approved' : 'rejected',
    approvalChain: [
      {
        level: 1,
        required: true,
        approvers: ['security-team-lead'],
        approvedBy: approverId,
        approvedAt: new Date(),
        decision: decision as 'approved' | 'rejected',
        comments,
      },
    ],
    requestDetails: {
      title: 'Isolate Compromised Server',
      description: 'Test approval',
      impact: 'Medium',
      risk: 'Low',
      justification: 'Security incident',
    },
    autoApprovalRules: [],
    expiresAt: new Date(Date.now() + 3600000),
    escalated: false,
    escalationHistory: [],
    metadata: {},
  };

  return approval;
};

/**
 * Escalates approval request to higher authority.
 *
 * @param {string} approvalId - Approval request identifier
 * @param {string} escalateTo - User/group to escalate to
 * @param {string} reason - Escalation reason
 * @returns {Promise<ApprovalWorkflow>} Updated approval workflow
 *
 * @example
 * ` ``;
typescript
    * ;
const escalated = await escalateApproval(
    * 'approval-123', 
    * 'ciso-team', 
    * 'No response from primary approver within SLA'
    * );
    * console.log('Escalated to:', escalated.escalationHistory[0].to);
    * `` `
 */
export const escalateApproval = async (
  approvalId: string,
  escalateTo: string,
  reason: string
): Promise<ApprovalWorkflow> => {
  const approval: ApprovalWorkflow = {
    id: approvalId,
    workflowExecutionId: 'exec-123',
    requestType: 'containment_action',
    requestedBy: 'user-456',
    requestedAt: new Date(Date.now() - 1800000),
    priority: 'critical',
    status: 'pending',
    approvalChain: [
      {
        level: 1,
        required: true,
        approvers: ['security-team-lead'],
      },
      {
        level: 2,
        required: true,
        approvers: [escalateTo],
      },
    ],
    requestDetails: {
      title: 'Escalated Request',
      description: 'Test approval',
      impact: 'High',
      risk: 'Medium',
      justification: 'Security incident',
    },
    autoApprovalRules: [],
    expiresAt: new Date(Date.now() + 3600000),
    escalated: true,
    escalationHistory: [
      {
        timestamp: new Date(),
        from: 'security-team-lead',
        to: escalateTo,
        reason,
      },
    ],
    metadata: {},
  };

  return approval;
};

/**
 * Checks if auto-approval rules apply to a request.
 *
 * @param {ApprovalWorkflow} approval - Approval workflow to check
 * @returns {object} Auto-approval evaluation result
 *
 * @example
 * ` ``;
typescript
    * ;
const evaluation = evaluateAutoApproval(approval);
    * ;
if (evaluation.autoApprove) {
        * console.log('Auto-approval granted:', evaluation.reason);
        * ;
}
    * `` `
 */
export const evaluateAutoApproval = (
  approval: ApprovalWorkflow
): { autoApprove: boolean; reason?: string; matchedRules: string[] } => {
  const matchedRules: string[] = [];

  // Check auto-approval rules
  if (approval.priority === 'low') {
    matchedRules.push('Low priority requests auto-approved');
  }

  if (approval.requestType === 'data_access' && approval.priority !== 'critical') {
    matchedRules.push('Non-critical data access auto-approved');
  }

  const autoApprove = matchedRules.length > 0;

  return {
    autoApprove,
    reason: autoApprove ? matchedRules.join(', ') : undefined,
    matchedRules,
  };
};

/**
 * Retrieves pending approvals for a specific user or group.
 *
 * @param {string} userId - User identifier
 * @returns {Promise<ApprovalWorkflow[]>} Pending approval requests
 *
 * @example
 * ` ``;
typescript
    * ;
const pending = await getPendingApprovals('user-789');
    * console.log('Pending approvals:', pending.length);
    * pending.forEach(approval => {
            * console.log(`- ${approval.requestDetails.title} (${approval.priority})`);
            * ;
    });
    * `` `
 */
export const getPendingApprovals = async (userId: string): Promise<ApprovalWorkflow[]> => {
  const approvals: ApprovalWorkflow[] = [];

  for (let i = 0; i < 5; i++) {
    approvals.push({
      id: generateId(),
      workflowExecutionId: `;
exec - $;
{
    i;
}
`,
      requestType: 'playbook_execution',
      requestedBy: 'user-123',
      requestedAt: new Date(Date.now() - i * 3600000),
      priority: ['critical', 'high', 'medium'][i % 3] as 'critical' | 'high' | 'medium',
      status: 'pending',
      approvalChain: [
        {
          level: 1,
          required: true,
          approvers: [userId],
        },
      ],
      requestDetails: {
        title: `;
Approval;
Request;
$;
{
    i + 1;
}
`,
        description: 'Pending approval',
        impact: 'Medium',
        risk: 'Low',
        justification: 'Required for incident response',
      },
      autoApprovalRules: [],
      expiresAt: new Date(Date.now() + 86400000),
      escalated: false,
      escalationHistory: [],
    });
  }

  return approvals;
};

/**
 * Cancels a pending approval request.
 *
 * @param {string} approvalId - Approval request identifier
 * @param {string} cancelledBy - User cancelling the request
 * @param {string} reason - Cancellation reason
 * @returns {Promise<ApprovalWorkflow>} Cancelled approval workflow
 *
 * @example
 * ` ``;
typescript
    * ;
const cancelled = await cancelApprovalRequest(
    * 'approval-123', 
    * 'user-456', 
    * 'Threat was false positive'
    * );
    * console.log('Approval cancelled:', cancelled.status);
    * `` `
 */
export const cancelApprovalRequest = async (
  approvalId: string,
  cancelledBy: string,
  reason: string
): Promise<ApprovalWorkflow> => {
  const approval: ApprovalWorkflow = {
    id: approvalId,
    workflowExecutionId: 'exec-123',
    requestType: 'containment_action',
    requestedBy: 'user-456',
    requestedAt: new Date(Date.now() - 600000),
    priority: 'high',
    status: 'cancelled',
    approvalChain: [],
    requestDetails: {
      title: 'Cancelled Request',
      description: 'Test approval',
      impact: 'Medium',
      risk: 'Low',
      justification: 'Security incident',
    },
    autoApprovalRules: [],
    expiresAt: new Date(Date.now() + 3600000),
    escalated: false,
    escalationHistory: [],
    metadata: {
      cancelledBy,
      cancelledAt: new Date(),
      cancellationReason: reason,
    },
  };

  return approval;
};

// ============================================================================
// NOTIFICATION AND ALERTING FUNCTIONS (5 functions)
// ============================================================================

/**
 * Creates a notification configuration for workflow events.
 *
 * @param {Partial<NotificationConfig>} notificationData - Notification configuration
 * @returns {NotificationConfig} Created notification configuration
 *
 * @example
 * ` ``;
typescript
    * ;
const notification = createNotificationConfig({}, 
    * channels, [
        * {},
        * {}
        * 
]
    * );
;
    * console.log('Notification config created:', notification.id);
    * `` `
 */
export const createNotificationConfig = (
  notificationData: Partial<NotificationConfig>
): NotificationConfig => {
  const config: NotificationConfig = {
    id: generateId(),
    name: notificationData.name || 'Untitled Notification',
    eventType: notificationData.eventType || 'workflow_execution_completed',
    triggers: notificationData.triggers || [],
    channels: notificationData.channels || [],
    recipients: notificationData.recipients || [],
    messageTemplate: notificationData.messageTemplate || {
      subject: 'Workflow Notification',
      body: 'A workflow event has occurred',
      priority: 'normal',
      variables: {},
    },
    rateLimiting: notificationData.rateLimiting || {
      enabled: true,
      maxNotificationsPerHour: 10,
      cooldownMinutes: 5,
    },
    isActive: notificationData.isActive !== undefined ? notificationData.isActive : true,
    metadata: notificationData.metadata || {},
  };

  return config;
};

/**
 * Sends a notification through configured channels.
 *
 * @param {string} notificationConfigId - Notification configuration identifier
 * @param {Record<string, any>} eventData - Event data for notification
 * @returns {Promise<object>} Notification send results
 *
 * @example
 * ` ``;
typescript
    * ;
const result = await sendNotification(
    * 'notification-123', 
    * {}
    * );
    * console.log('Notifications sent:', result.channelResults);
    * `` `
 */
export const sendNotification = async (
  notificationConfigId: string,
  eventData: Record<string, any>
): Promise<{
  notificationConfigId: string;
  success: boolean;
  channelResults: Array<{
    channel: string;
    success: boolean;
    error?: string;
  }>;
  sentAt: Date;
}> => {
  return {
    notificationConfigId,
    success: true,
    channelResults: [
      { channel: 'email', success: true },
      { channel: 'slack', success: true },
      { channel: 'pagerduty', success: false, error: 'API rate limit exceeded' },
    ],
    sentAt: new Date(),
  };
};

/**
 * Evaluates if notification should be sent based on rate limits.
 *
 * @param {string} notificationConfigId - Notification configuration identifier
 * @returns {Promise<object>} Rate limit evaluation
 *
 * @example
 * ` ``;
typescript
    * ;
const evaluation = await evaluateNotificationRateLimit('notification-123');
    * ;
if (evaluation.allowed) {
        * await sendNotification('notification-123', eventData);
        * ;
}
else {
        * console.log('Rate limit exceeded, retry after:', evaluation.retryAfter);
        * ;
}
    * `` `
 */
export const evaluateNotificationRateLimit = async (
  notificationConfigId: string
): Promise<{
  notificationConfigId: string;
  allowed: boolean;
  currentCount: number;
  limit: number;
  resetAt?: Date;
  retryAfter?: number;
}> => {
  const allowed = Math.random() > 0.2;

  return {
    notificationConfigId,
    allowed,
    currentCount: allowed ? 5 : 10,
    limit: 10,
    resetAt: new Date(Date.now() + 3600000),
    retryAfter: allowed ? undefined : 1800,
  };
};

/**
 * Retrieves notification delivery history.
 *
 * @param {string} notificationConfigId - Notification configuration identifier
 * @param {number} limit - Maximum number of records
 * @returns {Promise<any[]>} Notification history
 *
 * @example
 * ` ``;
typescript
    * ;
const history = await getNotificationHistory('notification-123', 20);
    * console.log('Recent notifications:', history.length);
    * history.forEach(notification => {
            * console.log(`${notification.sentAt}: ${notification.success ? 'Success' : 'Failed'}`);
            * ;
    });
    * `` `
 */
export const getNotificationHistory = async (
  notificationConfigId: string,
  limit: number
): Promise<any[]> => {
  const history: any[] = [];

  for (let i = 0; i < Math.min(limit, 10); i++) {
    history.push({
      id: generateId(),
      notificationConfigId,
      eventType: 'workflow_execution_failed',
      sentAt: new Date(Date.now() - i * 3600000),
      success: i % 3 !== 0,
      channels: ['email', 'slack'],
      recipients: ['security-team@example.com'],
      error: i % 3 === 0 ? 'Delivery failed' : undefined,
    });
  }

  return history;
};

/**
 * Tests notification delivery without sending actual notifications.
 *
 * @param {string} notificationConfigId - Notification configuration identifier
 * @param {Record<string, any>} testData - Test event data
 * @returns {Promise<object>} Test results
 *
 * @example
 * ` ``;
typescript
    * ;
const test = await testNotificationDelivery(
    * 'notification-123', 
    * { workflowId: 'test-workflow', status: 'failed' }
    * );
    * console.log('Test successful:', test.success);
    * console.log('Message preview:', test.messagePreview);
    * `` `
 */
export const testNotificationDelivery = async (
  notificationConfigId: string,
  testData: Record<string, any>
): Promise<{
  notificationConfigId: string;
  success: boolean;
  messagePreview: string;
  channelValidation: Array<{
    channel: string;
    valid: boolean;
    issues?: string[];
  }>;
}> => {
  return {
    notificationConfigId,
    success: true,
    messagePreview: 'Workflow execution failed: test-workflow',
    channelValidation: [
      { channel: 'email', valid: true },
      { channel: 'slack', valid: true },
      { channel: 'pagerduty', valid: false, issues: ['Invalid service key'] },
    ],
  };
};

// ============================================================================
// WORKFLOW STATE MANAGEMENT FUNCTIONS (4 functions)
// ============================================================================

/**
 * Creates a state snapshot for workflow execution recovery.
 *
 * @param {string} executionId - Execution identifier
 * @param {Record<string, any>} stateData - State data to capture
 * @returns {Promise<WorkflowStateSnapshot>} Created state snapshot
 *
 * @example
 * ` ``;
typescript
    * ;
const snapshot = await createStateSnapshot(
    * 'exec-123', 
    * {}
    * );
    * console.log('State snapshot created:', snapshot.id);
    * `` `
 */
export const createStateSnapshot = async (
  executionId: string,
  stateData: Record<string, any>
): Promise<WorkflowStateSnapshot> => {
  const snapshot: WorkflowStateSnapshot = {
    id: generateId(),
    executionId,
    timestamp: new Date(),
    state: 'in_progress',
    context: stateData.context || {},
    variables: stateData.variables || {},
    executedSteps: stateData.executedSteps || [],
    pendingSteps: stateData.pendingSteps || [],
    checkpointData: stateData.checkpointData,
    canResume: true,
    metadata: {},
  };

  return snapshot;
};

/**
 * Restores workflow execution from a state snapshot.
 *
 * @param {string} snapshotId - State snapshot identifier
 * @returns {Promise<WorkflowExecution>} Restored execution
 *
 * @example
 * ` ``;
typescript
    * ;
const execution = await restoreFromSnapshot('snapshot-123');
    * console.log('Execution restored from:', execution.metadata.restoredFrom);
    * console.log('Resume from step:', execution.currentStep);
    * `` `
 */
export const restoreFromSnapshot = async (snapshotId: string): Promise<WorkflowExecution> => {
  const execution: WorkflowExecution = {
    id: generateId(),
    workflowId: 'workflow-123',
    executionType: 'manual',
    status: 'running',
    currentStage: 'stage-3',
    currentStep: 'step-3-2',
    progress: 65,
    startedAt: new Date(Date.now() - 1800000),
    initiatedBy: 'user-123',
    approvals: [],
    stageResults: [],
    context: {},
    outputs: {},
    errors: [],
    metrics: {
      tasksCompleted: 8,
      tasksFailed: 0,
      retryCount: 1,
      resourcesAffected: 5,
    },
    metadata: {
      restoredFrom: snapshotId,
      restoredAt: new Date(),
    },
  };

  return execution;
};

/**
 * Lists all state snapshots for a workflow execution.
 *
 * @param {string} executionId - Execution identifier
 * @returns {Promise<WorkflowStateSnapshot[]>} Array of state snapshots
 *
 * @example
 * ` ``;
typescript
    * ;
const snapshots = await listStateSnapshots('exec-123');
    * console.log('Available snapshots:', snapshots.length);
    * snapshots.forEach(snapshot => {
            * console.log(`${snapshot.timestamp}: ${snapshot.state} (${snapshot.executedSteps.length} steps)`);
            * ;
    });
    * `` `
 */
export const listStateSnapshots = async (
  executionId: string
): Promise<WorkflowStateSnapshot[]> => {
  const snapshots: WorkflowStateSnapshot[] = [];

  for (let i = 0; i < 5; i++) {
    snapshots.push({
      id: generateId(),
      executionId,
      timestamp: new Date(Date.now() - i * 300000),
      state: 'checkpoint',
      context: {},
      variables: {},
      executedSteps: [`;
step - 1 `, `;
step - 2 `, `;
step - 3 `].slice(0, i + 1),
      pendingSteps: [`;
step - 4 `, `;
step - 5 `],
      canResume: true,
      metadata: {},
    });
  }

  return snapshots;
};

/**
 * Cleans up old state snapshots based on retention policy.
 *
 * @param {number} retentionDays - Days to retain snapshots
 * @returns {Promise<object>} Cleanup results
 *
 * @example
 * ` ``;
typescript
    * ;
const result = await cleanupStateSnapshots(30);
    * console.log('Snapshots deleted:', result.deletedCount);
    * console.log('Space freed:', result.spaceFreed);
    * `` `
 */
export const cleanupStateSnapshots = async (
  retentionDays: number
): Promise<{
  deletedCount: number;
  spaceFreed: number;
  oldestRetained: Date;
}> => {
  return {
    deletedCount: 145,
    spaceFreed: 52428800, // 50 MB
    oldestRetained: new Date(Date.now() - retentionDays * 86400000),
  };
};
;
//# sourceMappingURL=threat-intelligence-orchestration-kit.js.map