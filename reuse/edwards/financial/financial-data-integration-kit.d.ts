/**
 * LOC: EDWFDI001
 * File: /reuse/edwards/financial/financial-data-integration-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/config (Configuration management)
 *   - @nestjs/swagger (API documentation)
 *   - axios (HTTP client for API integration)
 *
 * DOWNSTREAM (imported by):
 *   - Backend financial integration modules
 *   - ETL orchestration services
 *   - Data transformation pipelines
 *   - External system connectors
 */
/**
 * File: /reuse/edwards/financial/financial-data-integration-kit.ts
 * Locator: WC-EDW-FDI-001
 * Purpose: Comprehensive Financial Data Integration - JD Edwards EnterpriseOne-level ETL, data mapping, transformation, API integration, batch processing
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x, Axios 1.x, ConfigModule
 * Downstream: ../backend/edwards/*, ETL Services, Integration Services, Data Pipeline Orchestration
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+, Redis 7+
 * Exports: 42 functions for ETL processes, data mapping, transformation, API integration, batch processing, real-time sync, validation, error handling, monitoring
 *
 * LLM Context: Enterprise-grade financial data integration competing with Oracle JD Edwards EnterpriseOne.
 * Provides comprehensive ETL orchestration, advanced data mapping, transformation pipelines, multi-source API integration,
 * batch and real-time processing, data quality validation, error recovery, integration monitoring, and audit trails.
 * Implements robust NestJS ConfigModule integration for environment-based configuration and validation.
 */
import { Sequelize, Transaction } from 'sequelize';
import { ConfigService } from '@nestjs/config';
import { AxiosInstance } from 'axios';
interface ETLJob {
    jobId: string;
    jobName: string;
    jobType: 'extract' | 'transform' | 'load' | 'full_etl';
    sourceSystem: string;
    targetSystem: string;
    status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
    scheduleType: 'manual' | 'scheduled' | 'triggered' | 'realtime';
    scheduleCron?: string;
    priority: number;
    startTime?: Date;
    endTime?: Date;
    recordsProcessed: number;
    recordsSucceeded: number;
    recordsFailed: number;
    errorMessage?: string;
    executedBy: string;
    configSnapshot: Record<string, any>;
}
interface DataMapping {
    mappingId: string;
    mappingName: string;
    sourceEntity: string;
    targetEntity: string;
    mappingType: 'direct' | 'lookup' | 'transform' | 'aggregate' | 'composite';
    isActive: boolean;
    version: number;
    createdBy: string;
    createdAt: Date;
    lastModifiedBy: string;
    lastModifiedAt: Date;
}
interface FieldMapping {
    sourceField: string;
    targetField: string;
    dataType: 'string' | 'number' | 'date' | 'boolean' | 'object' | 'array';
    transformFunction?: string;
    lookupTable?: string;
    lookupKey?: string;
    defaultValue?: any;
    required: boolean;
    validationRules?: string[];
}
interface TransformRule {
    ruleId: string;
    ruleName: string;
    ruleType: 'calculation' | 'concatenation' | 'split' | 'lookup' | 'conditional' | 'custom';
    sourceFields: string[];
    targetField: string;
    expression: string;
    parameters: Record<string, any>;
    executionOrder: number;
}
interface ValidationRule {
    ruleId: string;
    ruleName: string;
    ruleType: 'required' | 'format' | 'range' | 'custom' | 'business_logic';
    field: string;
    condition: string;
    errorMessage: string;
    severity: 'error' | 'warning' | 'info';
}
interface RetryPolicy {
    maxAttempts: number;
    initialDelayMs: number;
    maxDelayMs: number;
    backoffMultiplier: number;
    retryableStatusCodes: number[];
}
interface RateLimitConfig {
    requestsPerSecond: number;
    requestsPerMinute: number;
    requestsPerHour: number;
    burstSize: number;
}
interface BatchProcessingJob {
    batchId: string;
    batchName: string;
    batchType: 'import' | 'export' | 'sync' | 'migration';
    totalRecords: number;
    processedRecords: number;
    successfulRecords: number;
    failedRecords: number;
    chunkSize: number;
    currentChunk: number;
    totalChunks: number;
    status: 'queued' | 'processing' | 'paused' | 'completed' | 'failed';
    startedAt?: Date;
    completedAt?: Date;
    estimatedCompletion?: Date;
}
interface DataTransformation {
    transformId: string;
    transformName: string;
    transformType: 'field_level' | 'record_level' | 'aggregate' | 'join' | 'filter';
    sourceData: any;
    transformedData: any;
    transformScript: string;
    transformMetadata: Record<string, any>;
    executionTime: number;
    status: 'success' | 'partial' | 'failed';
    errors?: TransformError[];
}
interface TransformError {
    recordId: string;
    field: string;
    errorType: string;
    errorMessage: string;
    originalValue: any;
    attemptedValue: any;
    timestamp: Date;
}
interface DataQualityCheck {
    checkId: string;
    checkName: string;
    checkType: 'completeness' | 'accuracy' | 'consistency' | 'timeliness' | 'validity';
    entity: string;
    field?: string;
    threshold: number;
    actualScore: number;
    passed: boolean;
    issuesFound: number;
    sampleIssues: any[];
}
interface IntegrationMetrics {
    metricId: string;
    jobId: string;
    metricType: 'throughput' | 'latency' | 'error_rate' | 'success_rate' | 'data_volume';
    metricValue: number;
    metricUnit: string;
    timestamp: Date;
    dimensions: Record<string, string>;
}
interface APIIntegrationRequest {
    requestId: string;
    endpoint: string;
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    headers: Record<string, string>;
    body?: any;
    queryParams?: Record<string, string>;
    timeout: number;
    retryCount: number;
}
interface APIIntegrationResponse {
    requestId: string;
    statusCode: number;
    headers: Record<string, string>;
    body: any;
    responseTime: number;
    success: boolean;
    errorMessage?: string;
}
export declare class CreateETLJobDto {
    jobName: string;
    jobType: string;
    sourceSystem: string;
    targetSystem: string;
    scheduleType: string;
    scheduleCron?: string;
    priority: number;
    configSnapshot: Record<string, any>;
}
export declare class DataMappingDto {
    mappingName: string;
    sourceEntity: string;
    targetEntity: string;
    mappingType: string;
    fieldMappings: FieldMapping[];
    transformRules?: TransformRule[];
    validationRules?: ValidationRule[];
}
export declare class BatchProcessingRequestDto {
    batchName: string;
    batchType: string;
    dataSource: string;
    chunkSize: number;
    mappingId: string;
    validationRules?: string[];
}
export declare class IntegrationEndpointDto {
    systemName: string;
    endpointUrl: string;
    authType: string;
    authCredentials: Record<string, string>;
    timeout: number;
    retryPolicy: RetryPolicy;
}
/**
 * Sequelize model for ETL Job tracking with comprehensive audit trail.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ETLJob model
 *
 * @example
 * ```typescript
 * const ETLJob = createETLJobModel(sequelize);
 * const job = await ETLJob.create({
 *   jobName: 'Daily_GL_Sync',
 *   jobType: 'full_etl',
 *   sourceSystem: 'JDE',
 *   targetSystem: 'WC_GL',
 *   status: 'pending'
 * });
 * ```
 */
export declare const createETLJobModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        jobId: string;
        jobName: string;
        jobType: string;
        sourceSystem: string;
        targetSystem: string;
        status: string;
        scheduleType: string;
        scheduleCron: string | null;
        priority: number;
        startTime: Date | null;
        endTime: Date | null;
        recordsProcessed: number;
        recordsSucceeded: number;
        recordsFailed: number;
        errorMessage: string | null;
        executedBy: string;
        configSnapshot: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Data Mapping configurations.
 */
export declare const createDataMappingModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        mappingId: string;
        mappingName: string;
        sourceEntity: string;
        targetEntity: string;
        mappingType: string;
        fieldMappings: FieldMapping[];
        transformRules: TransformRule[];
        validationRules: ValidationRule[];
        isActive: boolean;
        version: number;
        createdBy: string;
        lastModifiedBy: string;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Integration Endpoints.
 */
export declare const createIntegrationEndpointModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        endpointId: string;
        systemName: string;
        endpointUrl: string;
        authType: string;
        authCredentials: Record<string, string>;
        headers: Record<string, string>;
        timeout: number;
        retryPolicy: RetryPolicy;
        rateLimitConfig: RateLimitConfig | null;
        isActive: boolean;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Creates a new ETL job with configuration validation.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {ConfigService} configService - NestJS config service
 * @param {CreateETLJobDto} jobDto - Job creation data
 * @param {string} userId - User creating the job
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<ETLJob>} Created ETL job
 *
 * @example
 * ```typescript
 * const job = await createETLJob(sequelize, configService, {
 *   jobName: 'Daily GL Import',
 *   jobType: 'full_etl',
 *   sourceSystem: 'JDE',
 *   targetSystem: 'WC_GL',
 *   scheduleType: 'scheduled',
 *   scheduleCron: '0 2 * * *',
 *   priority: 8,
 *   configSnapshot: { batchSize: 1000 }
 * }, 'admin@whitecross.com');
 * ```
 */
export declare function createETLJob(sequelize: Sequelize, configService: ConfigService, jobDto: CreateETLJobDto, userId: string, transaction?: Transaction): Promise<ETLJob>;
/**
 * Executes an ETL job with comprehensive error handling and monitoring.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {ConfigService} configService - NestJS config service
 * @param {string} jobId - ETL job identifier
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<ETLJob>} Updated job status
 */
export declare function executeETLJob(sequelize: Sequelize, configService: ConfigService, jobId: string, transaction?: Transaction): Promise<ETLJob>;
/**
 * Retrieves ETL job status with execution metrics.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {string} jobId - ETL job identifier
 * @returns {Promise<ETLJob>} Job status and metrics
 */
export declare function getETLJobStatus(sequelize: Sequelize, jobId: string): Promise<ETLJob>;
/**
 * Cancels a running ETL job.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {string} jobId - ETL job identifier
 * @param {string} userId - User cancelling the job
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<ETLJob>} Updated job status
 */
export declare function cancelETLJob(sequelize: Sequelize, jobId: string, userId: string, transaction?: Transaction): Promise<ETLJob>;
/**
 * Schedules recurring ETL jobs based on cron expressions.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {ConfigService} configService - NestJS config service
 * @param {string} jobId - ETL job identifier
 * @returns {Promise<boolean>} Scheduling success
 */
export declare function scheduleETLJob(sequelize: Sequelize, configService: ConfigService, jobId: string): Promise<boolean>;
/**
 * Creates a new data mapping configuration with validation.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {ConfigService} configService - NestJS config service
 * @param {DataMappingDto} mappingDto - Mapping configuration data
 * @param {string} userId - User creating the mapping
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<DataMapping>} Created data mapping
 */
export declare function createDataMapping(sequelize: Sequelize, configService: ConfigService, mappingDto: DataMappingDto, userId: string, transaction?: Transaction): Promise<DataMapping>;
/**
 * Updates an existing data mapping configuration.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {string} mappingId - Mapping identifier
 * @param {Partial<DataMappingDto>} updates - Fields to update
 * @param {string} userId - User updating the mapping
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<DataMapping>} Updated mapping
 */
export declare function updateDataMapping(sequelize: Sequelize, mappingId: string, updates: Partial<DataMappingDto>, userId: string, transaction?: Transaction): Promise<DataMapping>;
/**
 * Retrieves a data mapping by ID.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {string} mappingId - Mapping identifier
 * @returns {Promise<DataMapping>} Data mapping configuration
 */
export declare function getDataMapping(sequelize: Sequelize, mappingId: string): Promise<DataMapping>;
/**
 * Applies field mappings to transform source data to target format.
 *
 * @param {FieldMapping[]} fieldMappings - Field mapping configurations
 * @param {any} sourceData - Source data object
 * @returns {Promise<any>} Transformed data
 */
export declare function applyFieldMappings(fieldMappings: FieldMapping[], sourceData: any): Promise<any>;
/**
 * Validates field mappings for completeness and correctness.
 *
 * @param {FieldMapping[]} fieldMappings - Field mappings to validate
 * @returns {void}
 * @throws {ValidationError} If mappings are invalid
 */
export declare function validateFieldMappings(fieldMappings: FieldMapping[]): void;
/**
 * Tests a data mapping against sample data.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {string} mappingId - Mapping identifier
 * @param {any[]} sampleData - Sample source data
 * @returns {Promise<any[]>} Transformed sample data
 */
export declare function testDataMapping(sequelize: Sequelize, mappingId: string, sampleData: any[]): Promise<any[]>;
/**
 * Applies transformation rules to data records.
 *
 * @param {TransformRule[]} transformRules - Transformation rules
 * @param {any} data - Data to transform
 * @returns {Promise<DataTransformation>} Transformation result
 */
export declare function applyTransformRules(transformRules: TransformRule[], data: any): Promise<DataTransformation>;
/**
 * Executes a single transformation rule.
 *
 * @param {TransformRule} rule - Transformation rule
 * @param {any} data - Data to transform
 * @returns {Promise<any>} Transformed data
 */
export declare function executeTransformRule(rule: TransformRule, data: any): Promise<any>;
/**
 * Performs batch data transformation with parallel processing.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {ConfigService} configService - NestJS config service
 * @param {string} mappingId - Mapping identifier
 * @param {any[]} dataSet - Data to transform
 * @param {number} chunkSize - Processing chunk size
 * @returns {Promise<any[]>} Transformed data
 */
export declare function batchTransformData(sequelize: Sequelize, configService: ConfigService, mappingId: string, dataSet: any[], chunkSize?: number): Promise<any[]>;
/**
 * Validates transformed data against validation rules.
 *
 * @param {ValidationRule[]} validationRules - Validation rules
 * @param {any} data - Data to validate
 * @returns {Promise<DataQualityCheck[]>} Validation results
 */
export declare function validateTransformedData(validationRules: ValidationRule[], data: any): Promise<DataQualityCheck[]>;
/**
 * Creates a configured API client for external system integration.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {ConfigService} configService - NestJS config service
 * @param {string} endpointId - Integration endpoint identifier
 * @returns {Promise<AxiosInstance>} Configured HTTP client
 */
export declare function createAPIClient(sequelize: Sequelize, configService: ConfigService, endpointId: string): Promise<AxiosInstance>;
/**
 * Executes an API request with retry logic and error handling.
 *
 * @param {AxiosInstance} client - Configured HTTP client
 * @param {APIIntegrationRequest} request - API request details
 * @param {RetryPolicy} retryPolicy - Retry configuration
 * @returns {Promise<APIIntegrationResponse>} API response
 */
export declare function executeAPIRequest(client: AxiosInstance, request: APIIntegrationRequest, retryPolicy: RetryPolicy): Promise<APIIntegrationResponse>;
/**
 * Retrieves data from external system via API.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {ConfigService} configService - NestJS config service
 * @param {string} endpointId - Integration endpoint identifier
 * @param {string} resourcePath - API resource path
 * @param {Record<string, string>} queryParams - Query parameters
 * @returns {Promise<any>} Retrieved data
 */
export declare function fetchExternalData(sequelize: Sequelize, configService: ConfigService, endpointId: string, resourcePath: string, queryParams?: Record<string, string>): Promise<any>;
/**
 * Sends data to external system via API.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {ConfigService} configService - NestJS config service
 * @param {string} endpointId - Integration endpoint identifier
 * @param {string} resourcePath - API resource path
 * @param {any} data - Data to send
 * @param {'POST' | 'PUT' | 'PATCH'} method - HTTP method
 * @returns {Promise<any>} API response
 */
export declare function sendExternalData(sequelize: Sequelize, configService: ConfigService, endpointId: string, resourcePath: string, data: any, method?: 'POST' | 'PUT' | 'PATCH'): Promise<any>;
/**
 * Processes data in batches with progress tracking.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {ConfigService} configService - NestJS config service
 * @param {string} batchId - Batch identifier
 * @param {any[]} dataSet - Data to process
 * @param {number} chunkSize - Chunk size
 * @param {Function} processFunction - Processing function
 * @returns {Promise<BatchProcessingJob>} Batch processing results
 */
export declare function processBatchData(sequelize: Sequelize, configService: ConfigService, batchId: string, dataSet: any[], chunkSize: number, processFunction: (chunk: any[]) => Promise<any>): Promise<BatchProcessingJob>;
/**
 * Monitors real-time data integration streams.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {ConfigService} configService - NestJS config service
 * @param {string} streamId - Stream identifier
 * @returns {Promise<IntegrationMetrics>} Stream metrics
 */
export declare function monitorIntegrationStream(sequelize: Sequelize, configService: ConfigService, streamId: string): Promise<IntegrationMetrics>;
export {};
//# sourceMappingURL=financial-data-integration-kit.d.ts.map