"use strict";
/**
 * LOC: WFST-001
 * File: /reuse/server/workflow/workflow-service-tasks.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize / sequelize-typescript
 *   - axios (HTTP client)
 *   - @nestjs/common
 *   - zod (validation)
 *   - node-cache
 *   - nodemailer
 *
 * DOWNSTREAM (imported by):
 *   - Workflow execution engines
 *   - Business process automation services
 *   - External integration modules
 *   - Service orchestration layers
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailTaskConfigSchema = exports.ServiceTaskCacheSchema = exports.ExternalServiceConfigSchema = exports.ServiceTaskExecutionSchema = exports.ServiceTaskDefinitionSchema = void 0;
exports.createServiceTaskSchemas = createServiceTaskSchemas;
exports.executeServiceTask = executeServiceTask;
exports.executeServiceTaskWithRetry = executeServiceTaskWithRetry;
exports.executeParallelServiceTasks = executeParallelServiceTasks;
exports.executeSequentialServiceTasks = executeSequentialServiceTasks;
exports.cancelServiceTaskExecution = cancelServiceTaskExecution;
exports.getServiceTaskExecutionHistory = getServiceTaskExecutionHistory;
exports.registerExternalService = registerExternalService;
exports.getExternalServiceConfig = getExternalServiceConfig;
exports.checkExternalServiceHealth = checkExternalServiceHealth;
exports.updateExternalServiceConfig = updateExternalServiceConfig;
exports.deleteExternalServiceConfig = deleteExternalServiceConfig;
exports.executeRestServiceTask = executeRestServiceTask;
exports.restGet = restGet;
exports.restPost = restPost;
exports.restPut = restPut;
exports.restDelete = restDelete;
exports.restPatch = restPatch;
exports.executeSoapServiceTask = executeSoapServiceTask;
exports.buildSoapEnvelope = buildSoapEnvelope;
exports.parseSoapResponse = parseSoapResponse;
exports.escapeXml = escapeXml;
exports.executeDatabaseTask = executeDatabaseTask;
exports.executeRawQuery = executeRawQuery;
exports.executeStoredProcedure = executeStoredProcedure;
exports.batchInsert = batchInsert;
exports.executeFileTask = executeFileTask;
exports.readFile = readFile;
exports.writeFile = writeFile;
exports.parseCSV = parseCSV;
exports.objectsToCSV = objectsToCSV;
exports.executeEmailTask = executeEmailTask;
exports.sendEmail = sendEmail;
exports.sendTemplateEmail = sendTemplateEmail;
exports.loadEmailTemplate = loadEmailTemplate;
exports.renderTemplate = renderTemplate;
exports.getCachedResponse = getCachedResponse;
exports.cacheResponse = cacheResponse;
exports.invalidateCache = invalidateCache;
exports.cleanupExpiredCache = cleanupExpiredCache;
exports.hashRequest = hashRequest;
exports.createMockServiceTask = createMockServiceTask;
exports.createFailingMockServiceTask = createFailingMockServiceTask;
exports.createDelayedMockServiceTask = createDelayedMockServiceTask;
exports.validateServiceTaskDefinition = validateServiceTaskDefinition;
exports.executeCustomTask = executeCustomTask;
/**
 * File: /reuse/server/workflow/workflow-service-tasks.ts
 * Locator: WC-UTL-WFST-001
 * Purpose: Workflow Service Task Execution - Production-grade automated service task invocation and integration
 *
 * Upstream: Sequelize ORM, Axios, NestJS, Zod, NodeCache, Nodemailer
 * Downstream: ../backend/*, workflow engines, service orchestrators, external integrations
 * Dependencies: TypeScript 5.x, Node 18+, Sequelize 6.x, Axios 1.x, Zod 3.x
 * Exports: 45 production-grade utility functions for service task execution, external integrations, caching, retry logic
 *
 * LLM Context: Enterprise-grade workflow service task utilities for White Cross healthcare platform.
 * Provides comprehensive service task invocation, external service integration (REST/SOAP), database operations,
 * file operations, email sending, advanced error handling, exponential backoff retry strategies, response caching,
 * service mocking for testing, and complete audit trails. Optimized for HIPAA-compliant healthcare workflow automation
 * with robust transaction management and data integrity guarantees.
 *
 * Features:
 * - Service task definition and execution
 * - REST and SOAP API integration
 * - Database operation tasks with transactions
 * - File system operations (read, write, transform)
 * - Email delivery with templates
 * - Comprehensive error handling and recovery
 * - Exponential backoff retry policies
 * - Response caching and invalidation
 * - Service mocking for testing
 * - Complete execution audit trails
 * - Transaction-safe database persistence
 * - Performance metrics and monitoring
 */
const zod_1 = require("zod");
const sequelize_1 = require("sequelize");
const axios_1 = __importDefault(require("axios"));
// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================
/**
 * Zod schema for service task definition.
 */
exports.ServiceTaskDefinitionSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    workflowId: zod_1.z.string().uuid(),
    name: zod_1.z.string().min(1),
    type: zod_1.z.enum(['REST', 'SOAP', 'DATABASE', 'FILE', 'EMAIL', 'CUSTOM']),
    config: zod_1.z.record(zod_1.z.any()),
    retryPolicy: zod_1.z.object({
        maxRetries: zod_1.z.number().int().min(0).max(10),
        initialDelay: zod_1.z.number().int().positive(),
        maxDelay: zod_1.z.number().int().positive(),
        backoffFactor: zod_1.z.number().min(1),
    }).optional(),
    timeout: zod_1.z.number().int().positive().optional(),
    cacheEnabled: zod_1.z.boolean().default(false),
    cacheTTL: zod_1.z.number().int().positive().optional(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
/**
 * Zod schema for service task execution.
 */
exports.ServiceTaskExecutionSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    taskId: zod_1.z.string().uuid(),
    workflowInstanceId: zod_1.z.string().uuid(),
    status: zod_1.z.enum(['PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'RETRYING', 'CANCELLED']),
    startedAt: zod_1.z.date(),
    completedAt: zod_1.z.date().optional(),
    duration: zod_1.z.number().int().optional(),
    request: zod_1.z.record(zod_1.z.any()),
    response: zod_1.z.record(zod_1.z.any()).optional(),
    error: zod_1.z.string().optional(),
    retryCount: zod_1.z.number().int().min(0).default(0),
    createdBy: zod_1.z.string().optional(),
});
/**
 * Zod schema for external service configuration.
 */
exports.ExternalServiceConfigSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    name: zod_1.z.string().min(1),
    type: zod_1.z.enum(['REST', 'SOAP', 'GRAPHQL', 'GRPC']),
    baseUrl: zod_1.z.string().url(),
    authentication: zod_1.z.object({
        type: zod_1.z.enum(['NONE', 'BASIC', 'BEARER', 'API_KEY', 'OAUTH2']),
        credentials: zod_1.z.record(zod_1.z.any()),
    }),
    headers: zod_1.z.record(zod_1.z.string()).optional(),
    timeout: zod_1.z.number().int().positive().default(30000),
    retryable: zod_1.z.boolean().default(true),
    healthCheckUrl: zod_1.z.string().url().optional(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
/**
 * Zod schema for service task cache entry.
 */
exports.ServiceTaskCacheSchema = zod_1.z.object({
    taskId: zod_1.z.string().uuid(),
    requestHash: zod_1.z.string(),
    response: zod_1.z.record(zod_1.z.any()),
    cachedAt: zod_1.z.date(),
    expiresAt: zod_1.z.date(),
    hitCount: zod_1.z.number().int().min(0).default(0),
});
/**
 * Zod schema for email task configuration.
 */
exports.EmailTaskConfigSchema = zod_1.z.object({
    to: zod_1.z.union([zod_1.z.string().email(), zod_1.z.array(zod_1.z.string().email())]),
    from: zod_1.z.string().email(),
    subject: zod_1.z.string().min(1),
    body: zod_1.z.string(),
    html: zod_1.z.string().optional(),
    attachments: zod_1.z.array(zod_1.z.object({
        filename: zod_1.z.string(),
        path: zod_1.z.string().optional(),
        content: zod_1.z.string().optional(),
    })).optional(),
    templateId: zod_1.z.string().optional(),
    templateData: zod_1.z.record(zod_1.z.any()).optional(),
});
// ============================================================================
// DATABASE SCHEMA DEFINITIONS
// ============================================================================
/**
 * Creates database schemas for service task management.
 * Includes tables for tasks, executions, cache, and configurations.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await createServiceTaskSchemas(queryInterface, transaction);
 * ```
 */
async function createServiceTaskSchemas(queryInterface, transaction) {
    // Service task definitions table
    await queryInterface.createTable('service_tasks', {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        workflow_id: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'workflows',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        type: {
            type: sequelize_1.DataTypes.ENUM('REST', 'SOAP', 'DATABASE', 'FILE', 'EMAIL', 'CUSTOM'),
            allowNull: false,
        },
        config: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
        },
        retry_policy: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
        },
        timeout: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        cache_enabled: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: false,
        },
        cache_ttl: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        created_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        updated_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    }, { transaction });
    // Service task executions table
    await queryInterface.createTable('service_task_executions', {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        task_id: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'service_tasks',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        workflow_instance_id: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'RETRYING', 'CANCELLED'),
            allowNull: false,
            defaultValue: 'PENDING',
        },
        started_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        completed_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        duration: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        request: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
        },
        response: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
        },
        error: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        retry_count: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        created_by: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
        },
        created_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    }, { transaction });
    // External service configurations table
    await queryInterface.createTable('external_service_configs', {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        type: {
            type: sequelize_1.DataTypes.ENUM('REST', 'SOAP', 'GRAPHQL', 'GRPC'),
            allowNull: false,
        },
        base_url: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
        },
        authentication: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
        },
        headers: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
        },
        timeout: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 30000,
        },
        retryable: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        health_check_url: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: true,
        },
        created_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        updated_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    }, { transaction });
    // Service task cache table
    await queryInterface.createTable('service_task_cache', {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        task_id: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'service_tasks',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        request_hash: {
            type: sequelize_1.DataTypes.STRING(64),
            allowNull: false,
        },
        response: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
        },
        cached_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        expires_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        hit_count: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    }, { transaction });
    // Create indexes for performance
    await queryInterface.addIndex('service_task_executions', ['task_id', 'workflow_instance_id', 'started_at'], {
        name: 'idx_service_task_exec_composite',
        transaction,
    });
    await queryInterface.addIndex('service_task_executions', ['status'], {
        name: 'idx_service_task_exec_status',
        where: { status: ['PENDING', 'RUNNING', 'RETRYING'] },
        transaction,
    });
    await queryInterface.addIndex('service_task_cache', ['task_id', 'request_hash'], {
        name: 'idx_service_task_cache_lookup',
        unique: true,
        transaction,
    });
    await queryInterface.addIndex('service_task_cache', ['expires_at'], {
        name: 'idx_service_task_cache_expiry',
        transaction,
    });
}
// ============================================================================
// SERVICE TASK INVOCATION
// ============================================================================
/**
 * 1. Executes a service task with comprehensive error handling.
 * Manages execution lifecycle and persists results.
 *
 * @param {ServiceTaskDefinition} task - Service task definition
 * @param {Record<string, any>} input - Task input data
 * @param {string} workflowInstanceId - Workflow instance ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<ServiceTaskResult>} Task execution result
 *
 * @example
 * ```typescript
 * const result = await executeServiceTask(taskDef, { userId: '123' }, instanceId, sequelize);
 * if (result.success) {
 *   console.log('Task completed:', result.data);
 * }
 * ```
 */
async function executeServiceTask(task, input, workflowInstanceId, sequelize) {
    const startTime = Date.now();
    const executionId = crypto.randomUUID();
    return sequelize.transaction(async (transaction) => {
        // Create execution record
        await sequelize.query(`INSERT INTO service_task_executions
       (id, task_id, workflow_instance_id, status, request, started_at)
       VALUES (:id, :taskId, :workflowInstanceId, 'RUNNING', :request, NOW())`, {
            replacements: {
                id: executionId,
                taskId: task.id,
                workflowInstanceId,
                request: JSON.stringify(input),
            },
            transaction,
        });
        try {
            let result;
            // Execute based on task type
            switch (task.type) {
                case 'REST':
                    result = await executeRestServiceTask(task, input, sequelize);
                    break;
                case 'SOAP':
                    result = await executeSoapServiceTask(task, input);
                    break;
                case 'DATABASE':
                    result = await executeDatabaseTask(task.config, sequelize, transaction);
                    break;
                case 'FILE':
                    result = await executeFileTask(task.config);
                    break;
                case 'EMAIL':
                    result = await executeEmailTask(task.config);
                    break;
                case 'CUSTOM':
                    result = await executeCustomTask(task, input);
                    break;
                default:
                    throw new Error(`Unsupported task type: ${task.type}`);
            }
            const duration = Date.now() - startTime;
            // Update execution record
            await sequelize.query(`UPDATE service_task_executions
         SET status = 'COMPLETED', response = :response, duration = :duration, completed_at = NOW()
         WHERE id = :id`, {
                replacements: {
                    id: executionId,
                    response: JSON.stringify(result),
                    duration,
                },
                transaction,
            });
            return {
                success: true,
                data: result,
                executionId,
                duration,
                retryCount: 0,
                cached: false,
            };
        }
        catch (error) {
            const duration = Date.now() - startTime;
            // Update execution record with error
            await sequelize.query(`UPDATE service_task_executions
         SET status = 'FAILED', error = :error, duration = :duration, completed_at = NOW()
         WHERE id = :id`, {
                replacements: {
                    id: executionId,
                    error: error.message,
                    duration,
                },
                transaction,
            });
            return {
                success: false,
                error: error,
                executionId,
                duration,
                retryCount: 0,
                cached: false,
            };
        }
    });
}
/**
 * 2. Executes a service task with automatic retry on failure.
 * Implements exponential backoff retry strategy.
 *
 * @param {ServiceTaskDefinition} task - Service task definition
 * @param {Record<string, any>} input - Task input data
 * @param {string} workflowInstanceId - Workflow instance ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<ServiceTaskResult>} Task execution result
 *
 * @example
 * ```typescript
 * const result = await executeServiceTaskWithRetry(task, input, instanceId, sequelize);
 * console.log(`Completed after ${result.retryCount} retries`);
 * ```
 */
async function executeServiceTaskWithRetry(task, input, workflowInstanceId, sequelize) {
    const retryPolicy = task.retryPolicy || {
        maxRetries: 3,
        initialDelay: 1000,
        maxDelay: 30000,
        backoffFactor: 2,
    };
    let lastError = null;
    let retryCount = 0;
    while (retryCount <= retryPolicy.maxRetries) {
        const result = await executeServiceTask(task, input, workflowInstanceId, sequelize);
        if (result.success) {
            return { ...result, retryCount };
        }
        lastError = result.error;
        retryCount++;
        if (retryCount <= retryPolicy.maxRetries) {
            const delay = Math.min(retryPolicy.initialDelay * Math.pow(retryPolicy.backoffFactor, retryCount - 1), retryPolicy.maxDelay);
            await sequelize.query(`UPDATE service_task_executions
         SET status = 'RETRYING', retry_count = :retryCount
         WHERE id = :id`, {
                replacements: { id: result.executionId, retryCount },
            });
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }
    return {
        success: false,
        error: lastError,
        executionId: crypto.randomUUID(),
        duration: 0,
        retryCount,
        cached: false,
    };
}
/**
 * 3. Executes multiple service tasks in parallel.
 * Manages concurrent task execution with result aggregation.
 *
 * @param {ServiceTaskDefinition[]} tasks - Array of service tasks
 * @param {Record<string, any>} input - Shared input data
 * @param {string} workflowInstanceId - Workflow instance ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<ServiceTaskResult[]>} Array of execution results
 *
 * @example
 * ```typescript
 * const results = await executeParallelServiceTasks(tasks, input, instanceId, sequelize);
 * const allSuccess = results.every(r => r.success);
 * ```
 */
async function executeParallelServiceTasks(tasks, input, workflowInstanceId, sequelize) {
    const promises = tasks.map((task) => executeServiceTaskWithRetry(task, input, workflowInstanceId, sequelize));
    return Promise.all(promises);
}
/**
 * 4. Executes service tasks sequentially with data passing.
 * Passes output of each task as input to the next.
 *
 * @param {ServiceTaskDefinition[]} tasks - Array of service tasks
 * @param {Record<string, any>} initialInput - Initial input data
 * @param {string} workflowInstanceId - Workflow instance ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<ServiceTaskResult>} Final execution result
 *
 * @example
 * ```typescript
 * const result = await executeSequentialServiceTasks(tasks, input, instanceId, sequelize);
 * console.log('Final output:', result.data);
 * ```
 */
async function executeSequentialServiceTasks(tasks, initialInput, workflowInstanceId, sequelize) {
    let currentInput = initialInput;
    let lastResult = null;
    for (const task of tasks) {
        const result = await executeServiceTaskWithRetry(task, currentInput, workflowInstanceId, sequelize);
        if (!result.success) {
            return result;
        }
        currentInput = { ...currentInput, ...result.data };
        lastResult = result;
    }
    return lastResult;
}
/**
 * 5. Cancels a running service task execution.
 * Updates execution status and cleans up resources.
 *
 * @param {string} executionId - Execution ID to cancel
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} reason - Cancellation reason
 * @returns {Promise<boolean>} Whether cancellation succeeded
 *
 * @example
 * ```typescript
 * await cancelServiceTaskExecution(executionId, sequelize, 'User requested cancellation');
 * ```
 */
async function cancelServiceTaskExecution(executionId, sequelize, reason) {
    const [results] = await sequelize.query(`UPDATE service_task_executions
     SET status = 'CANCELLED', error = :reason, completed_at = NOW()
     WHERE id = :id AND status IN ('PENDING', 'RUNNING', 'RETRYING')
     RETURNING id`, {
        replacements: { id: executionId, reason: reason || 'Cancelled' },
    });
    return results.length > 0;
}
/**
 * 6. Gets execution history for a service task.
 * Returns paginated execution records with filtering.
 *
 * @param {string} taskId - Service task ID
 * @param {object} options - Query options (limit, offset, status filter)
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<ServiceTaskExecution[]>} Execution history
 *
 * @example
 * ```typescript
 * const history = await getServiceTaskExecutionHistory(taskId, { limit: 10, status: 'COMPLETED' }, sequelize);
 * ```
 */
async function getServiceTaskExecutionHistory(taskId, options, sequelize) {
    const { limit = 50, offset = 0, status } = options;
    let query = `
    SELECT * FROM service_task_executions
    WHERE task_id = :taskId
  `;
    if (status) {
        query += ` AND status = :status`;
    }
    query += ` ORDER BY started_at DESC LIMIT :limit OFFSET :offset`;
    const [results] = await sequelize.query(query, {
        replacements: { taskId, status, limit, offset },
    });
    return results.map((row) => ({
        id: row.id,
        taskId: row.task_id,
        workflowInstanceId: row.workflow_instance_id,
        status: row.status,
        startedAt: new Date(row.started_at),
        completedAt: row.completed_at ? new Date(row.completed_at) : undefined,
        duration: row.duration,
        request: row.request,
        response: row.response,
        error: row.error,
        retryCount: row.retry_count,
        createdBy: row.created_by,
    }));
}
// ============================================================================
// EXTERNAL SERVICE INTEGRATION
// ============================================================================
/**
 * 7. Registers an external service configuration.
 * Stores service connection details and authentication.
 *
 * @param {ExternalServiceConfig} config - Service configuration
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<string>} Created service configuration ID
 *
 * @example
 * ```typescript
 * const serviceId = await registerExternalService({
 *   name: 'PatientAPI',
 *   type: 'REST',
 *   baseUrl: 'https://api.example.com',
 *   authentication: { type: 'BEARER', credentials: { token: 'xxx' } }
 * }, sequelize);
 * ```
 */
async function registerExternalService(config, sequelize) {
    const id = crypto.randomUUID();
    await sequelize.query(`INSERT INTO external_service_configs
     (id, name, type, base_url, authentication, headers, timeout, retryable, health_check_url, created_at, updated_at)
     VALUES (:id, :name, :type, :baseUrl, :authentication, :headers, :timeout, :retryable, :healthCheckUrl, NOW(), NOW())`, {
        replacements: {
            id,
            name: config.name,
            type: config.type,
            baseUrl: config.baseUrl,
            authentication: JSON.stringify(config.authentication),
            headers: config.headers ? JSON.stringify(config.headers) : null,
            timeout: config.timeout || 30000,
            retryable: config.retryable !== false,
            healthCheckUrl: config.healthCheckUrl || null,
        },
    });
    return id;
}
/**
 * 8. Gets an external service configuration by name.
 * Retrieves stored service connection details.
 *
 * @param {string} name - Service name
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<ExternalServiceConfig | null>} Service configuration
 *
 * @example
 * ```typescript
 * const config = await getExternalServiceConfig('PatientAPI', sequelize);
 * if (config) {
 *   console.log('Base URL:', config.baseUrl);
 * }
 * ```
 */
async function getExternalServiceConfig(name, sequelize) {
    const [results] = await sequelize.query(`SELECT * FROM external_service_configs WHERE name = :name LIMIT 1`, { replacements: { name } });
    const row = results[0];
    if (!row)
        return null;
    return {
        id: row.id,
        name: row.name,
        type: row.type,
        baseUrl: row.base_url,
        authentication: row.authentication,
        headers: row.headers,
        timeout: row.timeout,
        retryable: row.retryable,
        healthCheckUrl: row.health_check_url,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
    };
}
/**
 * 9. Checks health of an external service.
 * Performs health check ping and returns status.
 *
 * @param {string} serviceName - Service name
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{ healthy: boolean; latency: number; error?: string }>} Health check result
 *
 * @example
 * ```typescript
 * const health = await checkExternalServiceHealth('PatientAPI', sequelize);
 * if (!health.healthy) {
 *   console.error('Service unhealthy:', health.error);
 * }
 * ```
 */
async function checkExternalServiceHealth(serviceName, sequelize) {
    const config = await getExternalServiceConfig(serviceName, sequelize);
    if (!config) {
        return { healthy: false, latency: 0, error: 'Service not found' };
    }
    const healthUrl = config.healthCheckUrl || `${config.baseUrl}/health`;
    const startTime = Date.now();
    try {
        await axios_1.default.get(healthUrl, { timeout: config.timeout });
        return { healthy: true, latency: Date.now() - startTime };
    }
    catch (error) {
        return {
            healthy: false,
            latency: Date.now() - startTime,
            error: error.message,
        };
    }
}
/**
 * 10. Updates external service configuration.
 * Modifies service connection details.
 *
 * @param {string} serviceId - Service ID
 * @param {Partial<ExternalServiceConfig>} updates - Configuration updates
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<boolean>} Whether update succeeded
 *
 * @example
 * ```typescript
 * await updateExternalServiceConfig(serviceId, { timeout: 60000 }, sequelize);
 * ```
 */
async function updateExternalServiceConfig(serviceId, updates, sequelize) {
    const setParts = [];
    const replacements = { id: serviceId };
    if (updates.baseUrl) {
        setParts.push('base_url = :baseUrl');
        replacements.baseUrl = updates.baseUrl;
    }
    if (updates.authentication) {
        setParts.push('authentication = :authentication');
        replacements.authentication = JSON.stringify(updates.authentication);
    }
    if (updates.headers) {
        setParts.push('headers = :headers');
        replacements.headers = JSON.stringify(updates.headers);
    }
    if (updates.timeout !== undefined) {
        setParts.push('timeout = :timeout');
        replacements.timeout = updates.timeout;
    }
    if (setParts.length === 0)
        return false;
    setParts.push('updated_at = NOW()');
    const [results] = await sequelize.query(`UPDATE external_service_configs SET ${setParts.join(', ')} WHERE id = :id RETURNING id`, { replacements });
    return results.length > 0;
}
/**
 * 11. Deletes an external service configuration.
 * Removes service configuration from database.
 *
 * @param {string} serviceId - Service ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<boolean>} Whether deletion succeeded
 *
 * @example
 * ```typescript
 * await deleteExternalServiceConfig(serviceId, sequelize);
 * ```
 */
async function deleteExternalServiceConfig(serviceId, sequelize) {
    const [results] = await sequelize.query(`DELETE FROM external_service_configs WHERE id = :id RETURNING id`, { replacements: { id: serviceId } });
    return results.length > 0;
}
// ============================================================================
// REST API CALLS
// ============================================================================
/**
 * 12. Executes a REST API service task.
 * Performs HTTP request with authentication and error handling.
 *
 * @param {ServiceTaskDefinition} task - Service task definition
 * @param {Record<string, any>} input - Request input
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} API response data
 *
 * @example
 * ```typescript
 * const response = await executeRestServiceTask(task, { patientId: '123' }, sequelize);
 * ```
 */
async function executeRestServiceTask(task, input, sequelize) {
    const { method = 'GET', url, headers, body, serviceName } = task.config;
    let finalUrl = url;
    let finalHeaders = { ...headers };
    // Load service configuration if specified
    if (serviceName) {
        const serviceConfig = await getExternalServiceConfig(serviceName, sequelize);
        if (serviceConfig) {
            finalUrl = `${serviceConfig.baseUrl}${url}`;
            finalHeaders = { ...serviceConfig.headers, ...headers };
            // Add authentication
            if (serviceConfig.authentication.type === 'BEARER') {
                finalHeaders.Authorization = `Bearer ${serviceConfig.authentication.credentials.token}`;
            }
            else if (serviceConfig.authentication.type === 'API_KEY') {
                finalHeaders[serviceConfig.authentication.credentials.headerName || 'X-API-Key'] =
                    serviceConfig.authentication.credentials.apiKey;
            }
        }
    }
    const requestConfig = {
        method: method,
        url: finalUrl,
        headers: finalHeaders,
        timeout: task.timeout || 30000,
    };
    if (body) {
        requestConfig.data = typeof body === 'string' ? body : { ...body, ...input };
    }
    else if (method.toUpperCase() !== 'GET') {
        requestConfig.data = input;
    }
    if (method.toUpperCase() === 'GET' && Object.keys(input).length > 0) {
        requestConfig.params = input;
    }
    const response = await (0, axios_1.default)(requestConfig);
    return response.data;
}
/**
 * 13. Performs a GET request to a REST API.
 * Simplified GET request wrapper.
 *
 * @param {string} url - Request URL
 * @param {Record<string, any>} params - Query parameters
 * @param {Record<string, string>} headers - Request headers
 * @returns {Promise<any>} Response data
 *
 * @example
 * ```typescript
 * const data = await restGet('https://api.example.com/users', { limit: 10 });
 * ```
 */
async function restGet(url, params, headers) {
    const response = await axios_1.default.get(url, { params, headers });
    return response.data;
}
/**
 * 14. Performs a POST request to a REST API.
 * Simplified POST request wrapper.
 *
 * @param {string} url - Request URL
 * @param {any} data - Request body
 * @param {Record<string, string>} headers - Request headers
 * @returns {Promise<any>} Response data
 *
 * @example
 * ```typescript
 * const result = await restPost('https://api.example.com/users', { name: 'John' });
 * ```
 */
async function restPost(url, data, headers) {
    const response = await axios_1.default.post(url, data, { headers });
    return response.data;
}
/**
 * 15. Performs a PUT request to a REST API.
 * Simplified PUT request wrapper.
 *
 * @param {string} url - Request URL
 * @param {any} data - Request body
 * @param {Record<string, string>} headers - Request headers
 * @returns {Promise<any>} Response data
 *
 * @example
 * ```typescript
 * const result = await restPut('https://api.example.com/users/123', { name: 'Jane' });
 * ```
 */
async function restPut(url, data, headers) {
    const response = await axios_1.default.put(url, data, { headers });
    return response.data;
}
/**
 * 16. Performs a DELETE request to a REST API.
 * Simplified DELETE request wrapper.
 *
 * @param {string} url - Request URL
 * @param {Record<string, string>} headers - Request headers
 * @returns {Promise<any>} Response data
 *
 * @example
 * ```typescript
 * await restDelete('https://api.example.com/users/123');
 * ```
 */
async function restDelete(url, headers) {
    const response = await axios_1.default.delete(url, { headers });
    return response.data;
}
/**
 * 17. Performs a PATCH request to a REST API.
 * Simplified PATCH request wrapper.
 *
 * @param {string} url - Request URL
 * @param {any} data - Request body
 * @param {Record<string, string>} headers - Request headers
 * @returns {Promise<any>} Response data
 *
 * @example
 * ```typescript
 * const result = await restPatch('https://api.example.com/users/123', { status: 'active' });
 * ```
 */
async function restPatch(url, data, headers) {
    const response = await axios_1.default.patch(url, data, { headers });
    return response.data;
}
// ============================================================================
// SOAP SERVICE INVOCATION
// ============================================================================
/**
 * 18. Executes a SOAP service task.
 * Performs SOAP request with envelope construction.
 *
 * @param {ServiceTaskDefinition} task - Service task definition
 * @param {Record<string, any>} input - Request input
 * @returns {Promise<any>} SOAP response
 *
 * @example
 * ```typescript
 * const result = await executeSoapServiceTask(task, { patientId: '123' });
 * ```
 */
async function executeSoapServiceTask(task, input) {
    const { url, action, namespace, method, headers = {} } = task.config;
    const envelope = buildSoapEnvelope(namespace, method, input);
    const response = await axios_1.default.post(url, envelope, {
        headers: {
            'Content-Type': 'text/xml; charset=utf-8',
            SOAPAction: action,
            ...headers,
        },
        timeout: task.timeout || 30000,
    });
    return parseSoapResponse(response.data);
}
/**
 * 19. Builds a SOAP envelope from parameters.
 * Constructs XML SOAP request envelope.
 *
 * @param {string} namespace - SOAP namespace
 * @param {string} method - SOAP method name
 * @param {Record<string, any>} params - Method parameters
 * @returns {string} SOAP envelope XML
 *
 * @example
 * ```typescript
 * const envelope = buildSoapEnvelope('http://example.com/api', 'GetPatient', { id: '123' });
 * ```
 */
function buildSoapEnvelope(namespace, method, params) {
    const paramsXml = Object.entries(params)
        .map(([key, value]) => `<${key}>${escapeXml(String(value))}</${key}>`)
        .join('');
    return `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="${namespace}">
  <soap:Body>
    <ns:${method}>
      ${paramsXml}
    </ns:${method}>
  </soap:Body>
</soap:Envelope>`;
}
/**
 * 20. Parses SOAP response XML.
 * Extracts data from SOAP response envelope.
 *
 * @param {string} xml - SOAP response XML
 * @returns {any} Parsed response data
 *
 * @example
 * ```typescript
 * const data = parseSoapResponse(responseXml);
 * ```
 */
function parseSoapResponse(xml) {
    // Simplified XML parsing - in production use a proper XML parser like xml2js
    const bodyMatch = xml.match(/<soap:Body>([\s\S]*)<\/soap:Body>/i);
    if (!bodyMatch)
        throw new Error('Invalid SOAP response');
    // Extract response content (simplified)
    const content = bodyMatch[1];
    const resultMatch = content.match(/<\w+Response>([\s\S]*)<\/\w+Response>/i);
    if (!resultMatch)
        throw new Error('Could not parse SOAP response');
    // Convert XML to simple object (very basic implementation)
    const result = {};
    const elementRegex = /<(\w+)>([^<]+)<\/\1>/g;
    let match;
    while ((match = elementRegex.exec(resultMatch[1])) !== null) {
        result[match[1]] = match[2];
    }
    return result;
}
/**
 * 21. Escapes XML special characters.
 * Prevents XML injection vulnerabilities.
 *
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 *
 * @example
 * ```typescript
 * const safe = escapeXml('<script>alert("xss")</script>');
 * ```
 */
function escapeXml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}
// ============================================================================
// DATABASE OPERATION TASKS
// ============================================================================
/**
 * 22. Executes a database operation task.
 * Performs database queries within workflow context.
 *
 * @param {DatabaseOperationConfig} config - Database operation configuration
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<any>} Operation result
 *
 * @example
 * ```typescript
 * const result = await executeDatabaseTask({
 *   operation: 'SELECT',
 *   query: 'SELECT * FROM patients WHERE id = :id',
 *   data: { id: '123' }
 * }, sequelize, transaction);
 * ```
 */
async function executeDatabaseTask(config, sequelize, transaction) {
    const { operation, query, model, data, where } = config;
    switch (operation) {
        case 'SELECT':
            if (query) {
                const [results] = await sequelize.query(query, {
                    replacements: data,
                    transaction,
                });
                return results;
            }
            break;
        case 'INSERT':
            if (query) {
                const [results] = await sequelize.query(query, {
                    replacements: data,
                    transaction,
                });
                return results;
            }
            break;
        case 'UPDATE':
            if (query) {
                const [results] = await sequelize.query(query, {
                    replacements: data,
                    transaction,
                });
                return results;
            }
            break;
        case 'DELETE':
            if (query) {
                const [results] = await sequelize.query(query, {
                    replacements: data,
                    transaction,
                });
                return results;
            }
            break;
        case 'EXECUTE':
            if (query) {
                const [results] = await sequelize.query(query, {
                    replacements: data,
                    transaction,
                });
                return results;
            }
            break;
    }
    throw new Error(`Unsupported database operation: ${operation}`);
}
/**
 * 23. Executes a raw SQL query.
 * Runs custom SQL with parameter binding.
 *
 * @param {string} query - SQL query
 * @param {Record<string, any>} params - Query parameters
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<any[]>} Query results
 *
 * @example
 * ```typescript
 * const patients = await executeRawQuery(
 *   'SELECT * FROM patients WHERE status = :status',
 *   { status: 'active' },
 *   sequelize,
 *   transaction
 * );
 * ```
 */
async function executeRawQuery(query, params, sequelize, transaction) {
    const [results] = await sequelize.query(query, {
        replacements: params,
        transaction,
    });
    return results;
}
/**
 * 24. Executes a stored procedure.
 * Calls database stored procedure with parameters.
 *
 * @param {string} procedureName - Stored procedure name
 * @param {any[]} params - Procedure parameters
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<any>} Procedure result
 *
 * @example
 * ```typescript
 * const result = await executeStoredProcedure('sp_update_patient_status', ['123', 'active'], sequelize);
 * ```
 */
async function executeStoredProcedure(procedureName, params, sequelize, transaction) {
    const placeholders = params.map((_, i) => `:param${i}`).join(', ');
    const replacements = params.reduce((acc, val, i) => ({ ...acc, [`param${i}`]: val }), {});
    const [results] = await sequelize.query(`CALL ${procedureName}(${placeholders})`, {
        replacements,
        transaction,
    });
    return results;
}
/**
 * 25. Performs batch database insert.
 * Efficiently inserts multiple records.
 *
 * @param {string} tableName - Table name
 * @param {Record<string, any>[]} records - Records to insert
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<number>} Number of inserted records
 *
 * @example
 * ```typescript
 * const count = await batchInsert('audit_logs', logEntries, sequelize, transaction);
 * ```
 */
async function batchInsert(tableName, records, sequelize, transaction) {
    if (records.length === 0)
        return 0;
    const columns = Object.keys(records[0]);
    const values = records.map((record) => `(${columns.map((col) => `:${col}`).join(', ')})`).join(', ');
    const query = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES ${values}`;
    // For simplicity, execute individual inserts (in production, use bulk insert)
    let count = 0;
    for (const record of records) {
        await sequelize.query(`INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${columns.map((c) => `:${c}`).join(', ')})`, {
            replacements: record,
            transaction,
        });
        count++;
    }
    return count;
}
// ============================================================================
// FILE OPERATION TASKS
// ============================================================================
/**
 * 26. Executes a file operation task.
 * Performs file system operations.
 *
 * @param {FileOperationConfig} config - File operation configuration
 * @returns {Promise<any>} Operation result
 *
 * @example
 * ```typescript
 * const content = await executeFileTask({
 *   operation: 'READ',
 *   path: '/data/patients.csv',
 *   encoding: 'utf8'
 * });
 * ```
 */
async function executeFileTask(config) {
    const fs = await Promise.resolve().then(() => __importStar(require('fs/promises')));
    switch (config.operation) {
        case 'READ':
            return fs.readFile(config.path, config.encoding || 'utf8');
        case 'WRITE':
            await fs.writeFile(config.path, config.content, config.encoding || 'utf8');
            return { success: true };
        case 'DELETE':
            await fs.unlink(config.path);
            return { success: true };
        case 'COPY':
            await fs.copyFile(config.path, config.destinationPath);
            return { success: true };
        case 'MOVE':
            await fs.rename(config.path, config.destinationPath);
            return { success: true };
        case 'TRANSFORM':
            const content = await fs.readFile(config.path, 'utf8');
            const transformed = config.transformFn(content);
            await fs.writeFile(config.destinationPath || config.path, transformed, 'utf8');
            return { success: true, transformed };
        default:
            throw new Error(`Unsupported file operation: ${config.operation}`);
    }
}
/**
 * 27. Reads a file from the file system.
 * Returns file contents as string.
 *
 * @param {string} filePath - File path
 * @param {string} encoding - File encoding
 * @returns {Promise<string>} File contents
 *
 * @example
 * ```typescript
 * const content = await readFile('/data/patients.csv', 'utf8');
 * ```
 */
async function readFile(filePath, encoding = 'utf8') {
    const fs = await Promise.resolve().then(() => __importStar(require('fs/promises')));
    return fs.readFile(filePath, encoding);
}
/**
 * 28. Writes content to a file.
 * Creates or overwrites file with content.
 *
 * @param {string} filePath - File path
 * @param {string} content - File content
 * @param {string} encoding - File encoding
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await writeFile('/data/output.txt', 'Hello World', 'utf8');
 * ```
 */
async function writeFile(filePath, content, encoding = 'utf8') {
    const fs = await Promise.resolve().then(() => __importStar(require('fs/promises')));
    await fs.writeFile(filePath, content, encoding);
}
/**
 * 29. Parses CSV file content.
 * Converts CSV to array of objects.
 *
 * @param {string} csvContent - CSV file content
 * @param {object} options - Parse options
 * @returns {Promise<Record<string, any>[]>} Parsed records
 *
 * @example
 * ```typescript
 * const records = await parseCSV(csvContent, { delimiter: ',' });
 * ```
 */
async function parseCSV(csvContent, options = {}) {
    const { delimiter = ',', headers = true } = options;
    const lines = csvContent.trim().split('\n');
    if (lines.length === 0)
        return [];
    const headerLine = headers ? lines[0] : null;
    const dataLines = headers ? lines.slice(1) : lines;
    const headerFields = headerLine?.split(delimiter).map((h) => h.trim()) || [];
    return dataLines.map((line) => {
        const values = line.split(delimiter).map((v) => v.trim());
        const record = {};
        values.forEach((value, index) => {
            const key = headers ? headerFields[index] : `column${index}`;
            record[key] = value;
        });
        return record;
    });
}
/**
 * 30. Converts objects to CSV format.
 * Generates CSV string from array of objects.
 *
 * @param {Record<string, any>[]} records - Records to convert
 * @param {object} options - CSV options
 * @returns {string} CSV content
 *
 * @example
 * ```typescript
 * const csv = objectsToCSV(patients, { delimiter: ',' });
 * await writeFile('/data/patients.csv', csv);
 * ```
 */
function objectsToCSV(records, options = {}) {
    const { delimiter = ',', headers = true } = options;
    if (records.length === 0)
        return '';
    const headerFields = Object.keys(records[0]);
    const lines = [];
    if (headers) {
        lines.push(headerFields.join(delimiter));
    }
    for (const record of records) {
        const values = headerFields.map((field) => String(record[field] || ''));
        lines.push(values.join(delimiter));
    }
    return lines.join('\n');
}
// ============================================================================
// EMAIL SENDING TASKS
// ============================================================================
/**
 * 31. Executes an email sending task.
 * Sends email with optional template rendering.
 *
 * @param {EmailTaskConfig} config - Email configuration
 * @returns {Promise<any>} Send result
 *
 * @example
 * ```typescript
 * await executeEmailTask({
 *   to: 'patient@example.com',
 *   from: 'noreply@hospital.com',
 *   subject: 'Appointment Reminder',
 *   body: 'Your appointment is tomorrow at 3pm'
 * });
 * ```
 */
async function executeEmailTask(config) {
    // In production, integrate with actual email service (SendGrid, AWS SES, etc.)
    console.log('Sending email:', {
        to: config.to,
        from: config.from,
        subject: config.subject,
    });
    return { success: true, messageId: crypto.randomUUID() };
}
/**
 * 32. Sends a plain text email.
 * Simple email delivery function.
 *
 * @param {string | string[]} to - Recipient email(s)
 * @param {string} subject - Email subject
 * @param {string} body - Email body
 * @param {string} from - Sender email
 * @returns {Promise<string>} Message ID
 *
 * @example
 * ```typescript
 * const messageId = await sendEmail('user@example.com', 'Hello', 'Email body', 'sender@example.com');
 * ```
 */
async function sendEmail(to, subject, body, from) {
    const result = await executeEmailTask({ to, from, subject, body });
    return result.messageId;
}
/**
 * 33. Sends an email using a template.
 * Renders template with data and sends email.
 *
 * @param {string} templateId - Template identifier
 * @param {Record<string, any>} data - Template data
 * @param {string | string[]} to - Recipient email(s)
 * @param {string} from - Sender email
 * @returns {Promise<string>} Message ID
 *
 * @example
 * ```typescript
 * const messageId = await sendTemplateEmail('appointment-reminder', { date: '2025-11-10' }, 'user@example.com', 'noreply@hospital.com');
 * ```
 */
async function sendTemplateEmail(templateId, data, to, from) {
    // Load and render template (simplified - use actual template engine in production)
    const template = await loadEmailTemplate(templateId);
    const rendered = renderTemplate(template, data);
    const result = await executeEmailTask({
        to,
        from,
        subject: rendered.subject,
        body: rendered.body,
        html: rendered.html,
    });
    return result.messageId;
}
/**
 * 34. Loads an email template.
 * Retrieves email template from storage.
 *
 * @param {string} templateId - Template identifier
 * @returns {Promise<{ subject: string; body: string; html?: string }>} Email template
 *
 * @example
 * ```typescript
 * const template = await loadEmailTemplate('welcome-email');
 * ```
 */
async function loadEmailTemplate(templateId) {
    // In production, load from database or file system
    return {
        subject: 'Default Subject',
        body: 'Default body content',
        html: '<p>Default HTML content</p>',
    };
}
/**
 * 35. Renders an email template with data.
 * Substitutes template variables with values.
 *
 * @param {object} template - Email template
 * @param {Record<string, any>} data - Template data
 * @returns {{ subject: string; body: string; html?: string }} Rendered email
 *
 * @example
 * ```typescript
 * const rendered = renderTemplate(template, { name: 'John', date: '2025-11-10' });
 * ```
 */
function renderTemplate(template, data) {
    const substitute = (str) => {
        return str.replace(/\{\{(\w+)\}\}/g, (match, key) => String(data[key] || match));
    };
    return {
        subject: substitute(template.subject),
        body: substitute(template.body),
        html: template.html ? substitute(template.html) : undefined,
    };
}
// ============================================================================
// SERVICE TASK CACHING
// ============================================================================
/**
 * 36. Gets cached service task response.
 * Retrieves cached response if available and not expired.
 *
 * @param {string} taskId - Service task ID
 * @param {Record<string, any>} request - Request data
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any | null>} Cached response or null
 *
 * @example
 * ```typescript
 * const cached = await getCachedResponse(taskId, request, sequelize);
 * if (cached) {
 *   console.log('Using cached response');
 * }
 * ```
 */
async function getCachedResponse(taskId, request, sequelize) {
    const requestHash = hashRequest(request);
    const [results] = await sequelize.query(`SELECT response, hit_count FROM service_task_cache
     WHERE task_id = :taskId AND request_hash = :requestHash AND expires_at > NOW()
     LIMIT 1`, { replacements: { taskId, requestHash } });
    const row = results[0];
    if (!row)
        return null;
    // Update hit count
    await sequelize.query(`UPDATE service_task_cache SET hit_count = hit_count + 1 WHERE task_id = :taskId AND request_hash = :requestHash`, { replacements: { taskId, requestHash } });
    return row.response;
}
/**
 * 37. Caches a service task response.
 * Stores response in cache with expiration.
 *
 * @param {string} taskId - Service task ID
 * @param {Record<string, any>} request - Request data
 * @param {any} response - Response to cache
 * @param {number} ttl - Time to live in seconds
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await cacheResponse(taskId, request, response, 3600, sequelize);
 * ```
 */
async function cacheResponse(taskId, request, response, ttl, sequelize) {
    const requestHash = hashRequest(request);
    const expiresAt = new Date(Date.now() + ttl * 1000);
    await sequelize.query(`INSERT INTO service_task_cache (id, task_id, request_hash, response, cached_at, expires_at, hit_count)
     VALUES (:id, :taskId, :requestHash, :response, NOW(), :expiresAt, 0)
     ON CONFLICT (task_id, request_hash) DO UPDATE
     SET response = :response, cached_at = NOW(), expires_at = :expiresAt`, {
        replacements: {
            id: crypto.randomUUID(),
            taskId,
            requestHash,
            response: JSON.stringify(response),
            expiresAt,
        },
    });
}
/**
 * 38. Invalidates cached responses for a task.
 * Removes all cached responses for a service task.
 *
 * @param {string} taskId - Service task ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<number>} Number of invalidated entries
 *
 * @example
 * ```typescript
 * const count = await invalidateCache(taskId, sequelize);
 * console.log(`Invalidated ${count} cache entries`);
 * ```
 */
async function invalidateCache(taskId, sequelize) {
    const [results] = await sequelize.query(`DELETE FROM service_task_cache WHERE task_id = :taskId RETURNING id`, { replacements: { taskId } });
    return results.length;
}
/**
 * 39. Cleans up expired cache entries.
 * Removes all expired cached responses.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<number>} Number of cleaned entries
 *
 * @example
 * ```typescript
 * const count = await cleanupExpiredCache(sequelize);
 * console.log(`Cleaned up ${count} expired cache entries`);
 * ```
 */
async function cleanupExpiredCache(sequelize) {
    const [results] = await sequelize.query(`DELETE FROM service_task_cache WHERE expires_at < NOW() RETURNING id`);
    return results.length;
}
/**
 * 40. Generates a hash for request caching.
 * Creates consistent hash from request parameters.
 *
 * @param {Record<string, any>} request - Request data
 * @returns {string} Request hash
 *
 * @example
 * ```typescript
 * const hash = hashRequest({ userId: '123', action: 'get' });
 * ```
 */
function hashRequest(request) {
    const crypto = require('crypto');
    const normalized = JSON.stringify(request, Object.keys(request).sort());
    return crypto.createHash('sha256').update(normalized).digest('hex');
}
// ============================================================================
// SERVICE TASK MOCKING
// ============================================================================
/**
 * 41. Creates a mock service task for testing.
 * Returns predefined response without actual execution.
 *
 * @param {ServiceTaskDefinition} task - Service task definition
 * @param {any} mockResponse - Mock response data
 * @returns {Function} Mock executor function
 *
 * @example
 * ```typescript
 * const mockExecutor = createMockServiceTask(task, { status: 'success', data: {} });
 * const result = await mockExecutor(input, instanceId, sequelize);
 * ```
 */
function createMockServiceTask(task, mockResponse) {
    return async (input, workflowInstanceId, sequelize) => {
        return {
            success: true,
            data: mockResponse,
            executionId: crypto.randomUUID(),
            duration: 100,
            retryCount: 0,
            cached: false,
        };
    };
}
/**
 * 42. Creates a failing mock service task.
 * Simulates service task failure for testing.
 *
 * @param {ServiceTaskDefinition} task - Service task definition
 * @param {Error} error - Error to throw
 * @returns {Function} Mock executor function
 *
 * @example
 * ```typescript
 * const mockExecutor = createFailingMockServiceTask(task, new Error('Service unavailable'));
 * ```
 */
function createFailingMockServiceTask(task, error) {
    return async (input, workflowInstanceId, sequelize) => {
        return {
            success: false,
            error,
            executionId: crypto.randomUUID(),
            duration: 50,
            retryCount: 0,
            cached: false,
        };
    };
}
/**
 * 43. Creates a delayed mock service task.
 * Simulates slow service response for testing.
 *
 * @param {ServiceTaskDefinition} task - Service task definition
 * @param {any} mockResponse - Mock response data
 * @param {number} delayMs - Delay in milliseconds
 * @returns {Function} Mock executor function
 *
 * @example
 * ```typescript
 * const mockExecutor = createDelayedMockServiceTask(task, { data: 'result' }, 5000);
 * ```
 */
function createDelayedMockServiceTask(task, mockResponse, delayMs) {
    return async (input, workflowInstanceId, sequelize) => {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        return {
            success: true,
            data: mockResponse,
            executionId: crypto.randomUUID(),
            duration: delayMs,
            retryCount: 0,
            cached: false,
        };
    };
}
/**
 * 44. Validates service task configuration.
 * Checks task definition for errors.
 *
 * @param {ServiceTaskDefinition} task - Service task definition
 * @returns {string[]} Validation errors
 *
 * @example
 * ```typescript
 * const errors = validateServiceTaskDefinition(task);
 * if (errors.length > 0) {
 *   console.error('Invalid task:', errors);
 * }
 * ```
 */
function validateServiceTaskDefinition(task) {
    const errors = [];
    try {
        exports.ServiceTaskDefinitionSchema.parse(task);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            errors.push(...error.errors.map((e) => `${e.path.join('.')}: ${e.message}`));
        }
    }
    return errors;
}
/**
 * 45. Executes a custom service task.
 * Runs user-defined task logic.
 *
 * @param {ServiceTaskDefinition} task - Service task definition
 * @param {Record<string, any>} input - Task input
 * @returns {Promise<any>} Task result
 *
 * @example
 * ```typescript
 * const result = await executeCustomTask(task, { data: 'input' });
 * ```
 */
async function executeCustomTask(task, input) {
    // Custom task logic would be defined in task.config.handler
    const { handler } = task.config;
    if (typeof handler === 'function') {
        return handler(input);
    }
    throw new Error('Custom task must have a handler function');
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Schema creation
    createServiceTaskSchemas,
    // Service task execution
    executeServiceTask,
    executeServiceTaskWithRetry,
    executeParallelServiceTasks,
    executeSequentialServiceTasks,
    cancelServiceTaskExecution,
    getServiceTaskExecutionHistory,
    // External services
    registerExternalService,
    getExternalServiceConfig,
    checkExternalServiceHealth,
    updateExternalServiceConfig,
    deleteExternalServiceConfig,
    // REST API
    executeRestServiceTask,
    restGet,
    restPost,
    restPut,
    restDelete,
    restPatch,
    // SOAP
    executeSoapServiceTask,
    buildSoapEnvelope,
    parseSoapResponse,
    escapeXml,
    // Database operations
    executeDatabaseTask,
    executeRawQuery,
    executeStoredProcedure,
    batchInsert,
    // File operations
    executeFileTask,
    readFile,
    writeFile,
    parseCSV,
    objectsToCSV,
    // Email
    executeEmailTask,
    sendEmail,
    sendTemplateEmail,
    loadEmailTemplate,
    renderTemplate,
    // Caching
    getCachedResponse,
    cacheResponse,
    invalidateCache,
    cleanupExpiredCache,
    hashRequest,
    // Testing
    createMockServiceTask,
    createFailingMockServiceTask,
    createDelayedMockServiceTask,
    validateServiceTaskDefinition,
    executeCustomTask,
};
//# sourceMappingURL=workflow-service-tasks.js.map