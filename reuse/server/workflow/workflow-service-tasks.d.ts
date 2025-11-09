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
import { Sequelize, Transaction, QueryInterface } from 'sequelize';
/**
 * Zod schema for service task definition.
 */
export declare const ServiceTaskDefinitionSchema: any;
/**
 * Zod schema for service task execution.
 */
export declare const ServiceTaskExecutionSchema: any;
/**
 * Zod schema for external service configuration.
 */
export declare const ExternalServiceConfigSchema: any;
/**
 * Zod schema for service task cache entry.
 */
export declare const ServiceTaskCacheSchema: any;
/**
 * Zod schema for email task configuration.
 */
export declare const EmailTaskConfigSchema: any;
export interface ServiceTaskDefinition {
    id: string;
    workflowId: string;
    name: string;
    type: 'REST' | 'SOAP' | 'DATABASE' | 'FILE' | 'EMAIL' | 'CUSTOM';
    config: Record<string, any>;
    retryPolicy?: RetryPolicy;
    timeout?: number;
    cacheEnabled?: boolean;
    cacheTTL?: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface ServiceTaskExecution {
    id: string;
    taskId: string;
    workflowInstanceId: string;
    status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'RETRYING' | 'CANCELLED';
    startedAt: Date;
    completedAt?: Date;
    duration?: number;
    request: Record<string, any>;
    response?: Record<string, any>;
    error?: string;
    retryCount: number;
    createdBy?: string;
}
export interface ExternalServiceConfig {
    id: string;
    name: string;
    type: 'REST' | 'SOAP' | 'GRAPHQL' | 'GRPC';
    baseUrl: string;
    authentication: {
        type: 'NONE' | 'BASIC' | 'BEARER' | 'API_KEY' | 'OAUTH2';
        credentials: Record<string, any>;
    };
    headers?: Record<string, string>;
    timeout: number;
    retryable: boolean;
    healthCheckUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface RetryPolicy {
    maxRetries: number;
    initialDelay: number;
    maxDelay: number;
    backoffFactor: number;
}
export interface ServiceTaskCacheEntry {
    taskId: string;
    requestHash: string;
    response: Record<string, any>;
    cachedAt: Date;
    expiresAt: Date;
    hitCount: number;
}
export interface EmailTaskConfig {
    to: string | string[];
    from: string;
    subject: string;
    body: string;
    html?: string;
    attachments?: Array<{
        filename: string;
        path?: string;
        content?: string;
    }>;
    templateId?: string;
    templateData?: Record<string, any>;
}
export interface FileOperationConfig {
    operation: 'READ' | 'WRITE' | 'DELETE' | 'COPY' | 'MOVE' | 'TRANSFORM';
    path: string;
    content?: string;
    encoding?: string;
    destinationPath?: string;
    transformFn?: (content: string) => string;
}
export interface DatabaseOperationConfig {
    operation: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'EXECUTE';
    query?: string;
    model?: string;
    data?: Record<string, any>;
    where?: Record<string, any>;
    transaction?: boolean;
}
export interface ServiceTaskResult<T = any> {
    success: boolean;
    data?: T;
    error?: Error;
    executionId: string;
    duration: number;
    retryCount: number;
    cached: boolean;
}
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
export declare function createServiceTaskSchemas(queryInterface: QueryInterface, transaction?: Transaction): Promise<void>;
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
export declare function executeServiceTask(task: ServiceTaskDefinition, input: Record<string, any>, workflowInstanceId: string, sequelize: Sequelize): Promise<ServiceTaskResult>;
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
export declare function executeServiceTaskWithRetry(task: ServiceTaskDefinition, input: Record<string, any>, workflowInstanceId: string, sequelize: Sequelize): Promise<ServiceTaskResult>;
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
export declare function executeParallelServiceTasks(tasks: ServiceTaskDefinition[], input: Record<string, any>, workflowInstanceId: string, sequelize: Sequelize): Promise<ServiceTaskResult[]>;
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
export declare function executeSequentialServiceTasks(tasks: ServiceTaskDefinition[], initialInput: Record<string, any>, workflowInstanceId: string, sequelize: Sequelize): Promise<ServiceTaskResult>;
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
export declare function cancelServiceTaskExecution(executionId: string, sequelize: Sequelize, reason?: string): Promise<boolean>;
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
export declare function getServiceTaskExecutionHistory(taskId: string, options: {
    limit?: number;
    offset?: number;
    status?: string;
}, sequelize: Sequelize): Promise<ServiceTaskExecution[]>;
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
export declare function registerExternalService(config: Omit<ExternalServiceConfig, 'id' | 'createdAt' | 'updatedAt'>, sequelize: Sequelize): Promise<string>;
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
export declare function getExternalServiceConfig(name: string, sequelize: Sequelize): Promise<ExternalServiceConfig | null>;
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
export declare function checkExternalServiceHealth(serviceName: string, sequelize: Sequelize): Promise<{
    healthy: boolean;
    latency: number;
    error?: string;
}>;
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
export declare function updateExternalServiceConfig(serviceId: string, updates: Partial<Omit<ExternalServiceConfig, 'id' | 'createdAt' | 'updatedAt'>>, sequelize: Sequelize): Promise<boolean>;
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
export declare function deleteExternalServiceConfig(serviceId: string, sequelize: Sequelize): Promise<boolean>;
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
export declare function executeRestServiceTask(task: ServiceTaskDefinition, input: Record<string, any>, sequelize: Sequelize): Promise<any>;
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
export declare function restGet(url: string, params?: Record<string, any>, headers?: Record<string, string>): Promise<any>;
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
export declare function restPost(url: string, data: any, headers?: Record<string, string>): Promise<any>;
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
export declare function restPut(url: string, data: any, headers?: Record<string, string>): Promise<any>;
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
export declare function restDelete(url: string, headers?: Record<string, string>): Promise<any>;
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
export declare function restPatch(url: string, data: any, headers?: Record<string, string>): Promise<any>;
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
export declare function executeSoapServiceTask(task: ServiceTaskDefinition, input: Record<string, any>): Promise<any>;
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
export declare function buildSoapEnvelope(namespace: string, method: string, params: Record<string, any>): string;
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
export declare function parseSoapResponse(xml: string): any;
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
export declare function escapeXml(str: string): string;
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
export declare function executeDatabaseTask(config: DatabaseOperationConfig, sequelize: Sequelize, transaction?: Transaction): Promise<any>;
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
export declare function executeRawQuery(query: string, params: Record<string, any>, sequelize: Sequelize, transaction?: Transaction): Promise<any[]>;
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
export declare function executeStoredProcedure(procedureName: string, params: any[], sequelize: Sequelize, transaction?: Transaction): Promise<any>;
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
export declare function batchInsert(tableName: string, records: Record<string, any>[], sequelize: Sequelize, transaction?: Transaction): Promise<number>;
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
export declare function executeFileTask(config: FileOperationConfig): Promise<any>;
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
export declare function readFile(filePath: string, encoding?: string): Promise<string>;
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
export declare function writeFile(filePath: string, content: string, encoding?: string): Promise<void>;
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
export declare function parseCSV(csvContent: string, options?: {
    delimiter?: string;
    headers?: boolean;
}): Promise<Record<string, any>[]>;
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
export declare function objectsToCSV(records: Record<string, any>[], options?: {
    delimiter?: string;
    headers?: boolean;
}): string;
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
export declare function executeEmailTask(config: EmailTaskConfig): Promise<any>;
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
export declare function sendEmail(to: string | string[], subject: string, body: string, from: string): Promise<string>;
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
export declare function sendTemplateEmail(templateId: string, data: Record<string, any>, to: string | string[], from: string): Promise<string>;
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
export declare function loadEmailTemplate(templateId: string): Promise<{
    subject: string;
    body: string;
    html?: string;
}>;
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
export declare function renderTemplate(template: {
    subject: string;
    body: string;
    html?: string;
}, data: Record<string, any>): {
    subject: string;
    body: string;
    html?: string;
};
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
export declare function getCachedResponse(taskId: string, request: Record<string, any>, sequelize: Sequelize): Promise<any | null>;
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
export declare function cacheResponse(taskId: string, request: Record<string, any>, response: any, ttl: number, sequelize: Sequelize): Promise<void>;
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
export declare function invalidateCache(taskId: string, sequelize: Sequelize): Promise<number>;
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
export declare function cleanupExpiredCache(sequelize: Sequelize): Promise<number>;
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
export declare function hashRequest(request: Record<string, any>): string;
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
export declare function createMockServiceTask(task: ServiceTaskDefinition, mockResponse: any): (input: Record<string, any>, workflowInstanceId: string, sequelize: Sequelize) => Promise<ServiceTaskResult>;
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
export declare function createFailingMockServiceTask(task: ServiceTaskDefinition, error: Error): (input: Record<string, any>, workflowInstanceId: string, sequelize: Sequelize) => Promise<ServiceTaskResult>;
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
export declare function createDelayedMockServiceTask(task: ServiceTaskDefinition, mockResponse: any, delayMs: number): (input: Record<string, any>, workflowInstanceId: string, sequelize: Sequelize) => Promise<ServiceTaskResult>;
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
export declare function validateServiceTaskDefinition(task: ServiceTaskDefinition): string[];
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
export declare function executeCustomTask(task: ServiceTaskDefinition, input: Record<string, any>): Promise<any>;
declare const _default: {
    createServiceTaskSchemas: typeof createServiceTaskSchemas;
    executeServiceTask: typeof executeServiceTask;
    executeServiceTaskWithRetry: typeof executeServiceTaskWithRetry;
    executeParallelServiceTasks: typeof executeParallelServiceTasks;
    executeSequentialServiceTasks: typeof executeSequentialServiceTasks;
    cancelServiceTaskExecution: typeof cancelServiceTaskExecution;
    getServiceTaskExecutionHistory: typeof getServiceTaskExecutionHistory;
    registerExternalService: typeof registerExternalService;
    getExternalServiceConfig: typeof getExternalServiceConfig;
    checkExternalServiceHealth: typeof checkExternalServiceHealth;
    updateExternalServiceConfig: typeof updateExternalServiceConfig;
    deleteExternalServiceConfig: typeof deleteExternalServiceConfig;
    executeRestServiceTask: typeof executeRestServiceTask;
    restGet: typeof restGet;
    restPost: typeof restPost;
    restPut: typeof restPut;
    restDelete: typeof restDelete;
    restPatch: typeof restPatch;
    executeSoapServiceTask: typeof executeSoapServiceTask;
    buildSoapEnvelope: typeof buildSoapEnvelope;
    parseSoapResponse: typeof parseSoapResponse;
    escapeXml: typeof escapeXml;
    executeDatabaseTask: typeof executeDatabaseTask;
    executeRawQuery: typeof executeRawQuery;
    executeStoredProcedure: typeof executeStoredProcedure;
    batchInsert: typeof batchInsert;
    executeFileTask: typeof executeFileTask;
    readFile: typeof readFile;
    writeFile: typeof writeFile;
    parseCSV: typeof parseCSV;
    objectsToCSV: typeof objectsToCSV;
    executeEmailTask: typeof executeEmailTask;
    sendEmail: typeof sendEmail;
    sendTemplateEmail: typeof sendTemplateEmail;
    loadEmailTemplate: typeof loadEmailTemplate;
    renderTemplate: typeof renderTemplate;
    getCachedResponse: typeof getCachedResponse;
    cacheResponse: typeof cacheResponse;
    invalidateCache: typeof invalidateCache;
    cleanupExpiredCache: typeof cleanupExpiredCache;
    hashRequest: typeof hashRequest;
    createMockServiceTask: typeof createMockServiceTask;
    createFailingMockServiceTask: typeof createFailingMockServiceTask;
    createDelayedMockServiceTask: typeof createDelayedMockServiceTask;
    validateServiceTaskDefinition: typeof validateServiceTaskDefinition;
    executeCustomTask: typeof executeCustomTask;
};
export default _default;
//# sourceMappingURL=workflow-service-tasks.d.ts.map