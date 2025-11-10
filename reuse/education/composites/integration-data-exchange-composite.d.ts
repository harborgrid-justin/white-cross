/**
 * LOC: EDU-COMP-INTEGRATION-005
 * File: /reuse/education/composites/integration-data-exchange-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - sequelize (v6.x)
 *   - ../student-records-kit
 *   - ../course-catalog-kit
 *   - ../student-enrollment-kit
 *   - ../financial-aid-kit
 *   - ../library-integration-kit
 *
 * DOWNSTREAM (imported by):
 *   - Integration controllers
 *   - API gateway services
 *   - Data sync modules
 *   - ETL processors
 *   - Third-party connectors
 */
import { Sequelize } from 'sequelize';
export type IntegrationType = 'lms' | 'financial' | 'hr' | 'library' | 'crm' | 'analytics' | 'custom';
export type SyncFrequency = 'realtime' | 'hourly' | 'daily' | 'weekly' | 'manual';
export type DataFormat = 'json' | 'xml' | 'csv' | 'edi' | 'custom';
export type TransformationType = 'map' | 'filter' | 'aggregate' | 'enrich' | 'validate';
export interface IntegrationConfig {
    integrationId: string;
    integrationName: string;
    integrationType: IntegrationType;
    endpoint: string;
    authMethod: 'oauth' | 'api_key' | 'basic' | 'saml' | 'jwt';
    credentials: Record<string, any>;
    syncFrequency: SyncFrequency;
    dataFormat: DataFormat;
    mappings: DataMapping[];
    isActive: boolean;
    lastSyncDate?: Date;
}
export interface DataMapping {
    sourceField: string;
    targetField: string;
    transformationType?: TransformationType;
    transformationRule?: string;
    required: boolean;
    defaultValue?: any;
}
export interface SyncJob {
    jobId: string;
    integrationId: string;
    jobType: 'import' | 'export' | 'sync';
    status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
    startTime: Date;
    endTime?: Date;
    recordsProcessed: number;
    recordsFailed: number;
    errors: any[];
    metadata: Record<string, any>;
}
export interface APIEndpoint {
    endpointId: string;
    path: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    version: string;
    description: string;
    requestSchema: any;
    responseSchema: any;
    rateLimit: number;
    requiresAuth: boolean;
}
export interface DataTransformation {
    transformationId: string;
    name: string;
    sourceFormat: DataFormat;
    targetFormat: DataFormat;
    rules: Array<{
        field: string;
        operation: string;
        parameters: any;
    }>;
}
export interface WebhookConfig {
    webhookId: string;
    url: string;
    events: string[];
    secret: string;
    isActive: boolean;
    retryPolicy: {
        maxAttempts: number;
        backoffMultiplier: number;
    };
}
/**
 * @swagger
 * components:
 *   schemas:
 *     IntegrationConfig:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         integrationName:
 *           type: string
 *         integrationType:
 *           type: string
 *           enum: [lms, financial, hr, library, crm, analytics, custom]
 */
export declare const createIntegrationConfigModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        integrationName: string;
        integrationType: string;
        configData: Record<string, any>;
        isActive: boolean;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
export declare const createSyncJobModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        integrationId: string;
        jobType: string;
        status: string;
        jobData: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
export declare const createAPIEndpointModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        path: string;
        method: string;
        version: string;
        endpointData: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
export declare class IntegrationDataExchangeCompositeService {
    private readonly sequelize;
    private readonly logger;
    constructor(sequelize: Sequelize);
    /**
     * 1. Configures new system integration.
     * @example
     * ```typescript
     * const integration = await service.configureSystemIntegration({
     *   integrationName: 'Canvas LMS', integrationType: 'lms',
     *   endpoint: 'https://canvas.instructure.com/api/v1'
     * });
     * ```
     */
    configureSystemIntegration(config: Partial<IntegrationConfig>): Promise<IntegrationConfig>;
    /**
     * 2. Updates integration configuration and credentials.
     * @example
     * ```typescript
     * await service.updateIntegrationConfig('INT123', { endpoint: 'https://new-endpoint.com' });
     * ```
     */
    updateIntegrationConfig(integrationId: string, updates: Partial<IntegrationConfig>): Promise<IntegrationConfig>;
    /**
     * 3. Tests integration connectivity and authentication.
     * @example
     * ```typescript
     * const test = await service.testIntegrationConnection('INT123');
     * console.log(`Connection: ${test.connected ? 'Success' : 'Failed'}`);
     * ```
     */
    testIntegrationConnection(integrationId: string): Promise<{
        connected: boolean;
        latency: number;
        message: string;
    }>;
    /**
     * 4. Monitors integration health and status.
     * @example
     * ```typescript
     * const health = await service.monitorIntegrationHealth('INT123');
     * ```
     */
    monitorIntegrationHealth(integrationId: string): Promise<any>;
    /**
     * 5. Manages integration API keys and authentication.
     * @example
     * ```typescript
     * const key = await service.rotateIntegrationAPIKey('INT123');
     * ```
     */
    rotateIntegrationAPIKey(integrationId: string): Promise<{
        apiKey: string;
        rotatedAt: Date;
    }>;
    /**
     * 6. Deactivates or removes system integration.
     * @example
     * ```typescript
     * await service.deactivateIntegration('INT123');
     * ```
     */
    deactivateIntegration(integrationId: string): Promise<{
        deactivated: boolean;
    }>;
    /**
     * 7. Integrates with Canvas LMS.
     * @example
     * ```typescript
     * await service.integrateWithCanvasLMS({ apiUrl: 'https://canvas.edu', token: 'TOKEN' });
     * ```
     */
    integrateWithCanvasLMS(config: any): Promise<any>;
    /**
     * 8. Integrates with Blackboard Learn.
     * @example
     * ```typescript
     * await service.integrateWithBlackboard({ apiUrl: 'https://blackboard.edu' });
     * ```
     */
    integrateWithBlackboard(config: any): Promise<any>;
    /**
     * 9. Syncs course enrollments with LMS.
     * @example
     * ```typescript
     * const sync = await service.syncLMSEnrollments('LMS123', 'TERM2024');
     * console.log(`Synced ${sync.recordsProcessed} enrollments`);
     * ```
     */
    syncLMSEnrollments(lmsId: string, termId: string): Promise<SyncJob>;
    /**
     * 10. Syncs gradebook data bidirectionally.
     * @example
     * ```typescript
     * await service.syncLMSGradebook('LMS123', 'COURSE101');
     * ```
     */
    syncLMSGradebook(lmsId: string, courseId: string): Promise<any>;
    /**
     * 11. Manages LMS course provisioning.
     * @example
     * ```typescript
     * const course = await service.provisionLMSCourse('LMS123', courseData);
     * ```
     */
    provisionLMSCourse(lmsId: string, courseData: any): Promise<any>;
    /**
     * 12. Integrates with financial/ERP systems.
     * @example
     * ```typescript
     * await service.integrateFinancialSystem({ system: 'Oracle', endpoint: 'https://erp.edu' });
     * ```
     */
    integrateFinancialSystem(config: any): Promise<any>;
    /**
     * 13. Syncs student billing data.
     * @example
     * ```typescript
     * const billing = await service.syncStudentBillingData('FIN123', 'TERM2024');
     * ```
     */
    syncStudentBillingData(financialSystemId: string, termId: string): Promise<SyncJob>;
    /**
     * 14. Exports financial aid data for compliance.
     * @example
     * ```typescript
     * const export = await service.exportFinancialAidData('2024', 'xml');
     * ```
     */
    exportFinancialAidData(academicYear: string, format: DataFormat): Promise<any>;
    /**
     * 15. Syncs payment transactions in real-time.
     * @example
     * ```typescript
     * await service.syncPaymentTransactions('FIN123');
     * ```
     */
    syncPaymentTransactions(financialSystemId: string): Promise<any>;
    /**
     * 16. Reconciles financial data between systems.
     * @example
     * ```typescript
     * const reconciliation = await service.reconcileFinancialData('FIN123', 'TERM2024');
     * ```
     */
    reconcileFinancialData(financialSystemId: string, termId: string): Promise<any>;
    /**
     * 17. Integrates with HR/Payroll systems.
     * @example
     * ```typescript
     * await service.integrateHRSystem({ system: 'Workday', endpoint: 'https://hr.edu' });
     * ```
     */
    integrateHRSystem(config: any): Promise<any>;
    /**
     * 18. Syncs faculty and staff data.
     * @example
     * ```typescript
     * const sync = await service.syncFacultyStaffData('HR123');
     * ```
     */
    syncFacultyStaffData(hrSystemId: string): Promise<SyncJob>;
    /**
     * 19. Exports employee data for payroll processing.
     * @example
     * ```typescript
     * const export = await service.exportEmployeeDataForPayroll('2024-12');
     * ```
     */
    exportEmployeeDataForPayroll(period: string): Promise<any>;
    /**
     * 20. Syncs organizational hierarchy and departments.
     * @example
     * ```typescript
     * await service.syncOrganizationalStructure('HR123');
     * ```
     */
    syncOrganizationalStructure(hrSystemId: string): Promise<any>;
    /**
     * 21. Creates data transformation pipeline.
     * @example
     * ```typescript
     * const pipeline = await service.createDataTransformationPipeline({
     *   name: 'Student Export', sourceFormat: 'json', targetFormat: 'xml'
     * });
     * ```
     */
    createDataTransformationPipeline(transformation: Partial<DataTransformation>): Promise<DataTransformation>;
    /**
     * 22. Transforms data between formats.
     * @example
     * ```typescript
     * const transformed = await service.transformDataFormat(data, 'json', 'xml');
     * ```
     */
    transformDataFormat(data: any, sourceFormat: DataFormat, targetFormat: DataFormat): Promise<any>;
    /**
     * 23. Validates data integrity and consistency.
     * @example
     * ```typescript
     * const validation = await service.validateDataIntegrity(dataset);
     * ```
     */
    validateDataIntegrity(dataset: any): Promise<{
        valid: boolean;
        errors: string[];
    }>;
    /**
     * 24. Maps fields between source and target systems.
     * @example
     * ```typescript
     * const mapped = await service.mapDataFields(sourceData, mappings);
     * ```
     */
    mapDataFields(sourceData: any, mappings: DataMapping[]): Promise<any>;
    /**
     * 25. Enriches data with additional context.
     * @example
     * ```typescript
     * const enriched = await service.enrichDataWithContext(records);
     * ```
     */
    enrichDataWithContext(records: any[]): Promise<any[]>;
    /**
     * 26. Handles ETL error recovery and retry logic.
     * @example
     * ```typescript
     * await service.handleETLErrors('JOB123', errors);
     * ```
     */
    handleETLErrors(jobId: string, errors: any[]): Promise<any>;
    /**
     * 27. Creates REST API endpoints for external access.
     * @example
     * ```typescript
     * const endpoint = await service.createAPIEndpoint({
     *   path: '/api/v1/students', method: 'GET', version: 'v1'
     * });
     * ```
     */
    createAPIEndpoint(endpoint: Partial<APIEndpoint>): Promise<APIEndpoint>;
    /**
     * 28. Manages API versioning and deprecation.
     * @example
     * ```typescript
     * await service.manageAPIVersioning('v1', 'v2', '2025-01-01');
     * ```
     */
    manageAPIVersioning(oldVersion: string, newVersion: string, deprecationDate: string): Promise<any>;
    /**
     * 29. Configures webhooks for event notifications.
     * @example
     * ```typescript
     * const webhook = await service.configureWebhook({
     *   url: 'https://external.com/webhook', events: ['student.created', 'enrollment.updated']
     * });
     * ```
     */
    configureWebhook(webhook: Partial<WebhookConfig>): Promise<WebhookConfig>;
    /**
     * 30. Implements API rate limiting and throttling.
     * @example
     * ```typescript
     * await service.implementRateLimiting('API123', { maxRequests: 1000, window: '1h' });
     * ```
     */
    implementRateLimiting(apiId: string, limits: any): Promise<any>;
    /**
     * 31. Tracks API usage and analytics.
     * @example
     * ```typescript
     * const usage = await service.trackAPIUsage('API123', '2024-12');
     * ```
     */
    trackAPIUsage(apiId: string, period: string): Promise<any>;
    /**
     * 32. Generates API documentation automatically.
     * @example
     * ```typescript
     * const docs = await service.generateAPIDocumentation('v1');
     * ```
     */
    generateAPIDocumentation(version: string): Promise<any>;
    /**
     * 33. Processes batch imports with validation.
     * @example
     * ```typescript
     * const batch = await service.processBatchImport(importFile, 'student');
     * console.log(`Processed ${batch.recordsProcessed} records`);
     * ```
     */
    processBatchImport(fileData: any, entityType: string): Promise<SyncJob>;
    /**
     * 34. Exports bulk data for external systems.
     * @example
     * ```typescript
     * const export = await service.exportBulkData('student', { format: 'csv', filter: 'active' });
     * ```
     */
    exportBulkData(entityType: string, options: any): Promise<any>;
    /**
     * 35. Schedules recurring data synchronization jobs.
     * @example
     * ```typescript
     * const schedule = await service.scheduleRecurringSyncJob('INT123', 'daily');
     * ```
     */
    scheduleRecurringSyncJob(integrationId: string, frequency: SyncFrequency): Promise<any>;
    /**
     * 36. Generates comprehensive integration analytics report.
     * @example
     * ```typescript
     * const report = await service.generateIntegrationAnalyticsReport('2024');
     * console.log('Comprehensive integration report generated');
     * ```
     */
    generateIntegrationAnalyticsReport(year: string): Promise<any>;
}
export default IntegrationDataExchangeCompositeService;
//# sourceMappingURL=integration-data-exchange-composite.d.ts.map