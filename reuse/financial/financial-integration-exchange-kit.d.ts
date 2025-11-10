/**
 * LOC: FININT4567890
 * File: /reuse/financial/financial-integration-exchange-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../error-handling-kit.ts
 *   - ../auditing-utils.ts
 *   - ../authentication-utils.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend financial integration modules
 *   - Payment gateway services
 *   - Bank API connectors
 *   - ERP synchronization services
 */
import { Sequelize, Transaction } from 'sequelize';
import { AxiosInstance } from 'axios';
import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
export interface BankConnection {
    connectionId: string;
    bankName: string;
    bankCode: string;
    connectionType: 'api' | 'sftp' | 'file' | 'manual';
    apiEndpoint?: string;
    apiVersion?: string;
    authType: 'oauth2' | 'api_key' | 'certificate' | 'basic';
    credentials: EncryptedCredentials;
    accountNumbers: string[];
    isActive: boolean;
    lastSyncAt?: Date;
    syncFrequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
    features: BankFeature[];
    metadata: Record<string, any>;
}
export interface EncryptedCredentials {
    encryptedData: string;
    algorithm: string;
    iv: string;
    authTag?: string;
    keyVersion: number;
}
export interface BankFeature {
    featureName: string;
    enabled: boolean;
    configuration: Record<string, any>;
}
export interface BankTransaction {
    transactionId: string;
    connectionId: string;
    accountNumber: string;
    transactionType: 'debit' | 'credit' | 'transfer' | 'fee' | 'interest';
    amount: number;
    currency: string;
    description: string;
    referenceNumber: string;
    valueDate: Date;
    postingDate: Date;
    balance: number;
    counterpartyName?: string;
    counterpartyAccount?: string;
    status: 'pending' | 'posted' | 'reversed' | 'cancelled';
    metadata: Record<string, any>;
    rawData: Record<string, any>;
    reconciledAt?: Date;
    reconciledBy?: string;
}
export interface PaymentGateway {
    gatewayId: string;
    providerName: string;
    providerType: 'stripe' | 'paypal' | 'square' | 'authorize_net' | 'braintree' | 'custom';
    apiEndpoint: string;
    apiVersion: string;
    credentials: EncryptedCredentials;
    supportedMethods: PaymentMethod[];
    supportedCurrencies: string[];
    webhookUrl?: string;
    webhookSecret?: string;
    isActive: boolean;
    isSandbox: boolean;
    features: GatewayFeature[];
    rateLimit: RateLimitConfig;
    metadata: Record<string, any>;
}
export interface PaymentMethod {
    method: 'card' | 'ach' | 'wire' | 'paypal' | 'apple_pay' | 'google_pay' | 'crypto';
    enabled: boolean;
    fees: FeeStructure[];
}
export interface FeeStructure {
    feeType: 'percentage' | 'fixed' | 'tiered';
    feeAmount: number;
    currency: string;
    minAmount?: number;
    maxAmount?: number;
}
export interface GatewayFeature {
    featureName: string;
    enabled: boolean;
    configuration: Record<string, any>;
}
export interface RateLimitConfig {
    requestsPerSecond: number;
    requestsPerMinute: number;
    requestsPerHour: number;
    burstLimit: number;
}
export interface PaymentTransaction {
    transactionId: string;
    gatewayId: string;
    externalTransactionId?: string;
    paymentMethod: string;
    amount: number;
    currency: string;
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'cancelled';
    customerId?: string;
    customerEmail?: string;
    description: string;
    metadata: Record<string, any>;
    processingFee?: number;
    netAmount?: number;
    createdAt: Date;
    processedAt?: Date;
    settledAt?: Date;
    errorMessage?: string;
    errorCode?: string;
    rawResponse: Record<string, any>;
}
export interface ERPIntegration {
    integrationId: string;
    erpSystem: 'sap' | 'oracle' | 'workday' | 'netsuite' | 'dynamics' | 'custom';
    erpVersion: string;
    connectionType: 'api' | 'odbc' | 'file' | 'middleware';
    apiEndpoint?: string;
    credentials: EncryptedCredentials;
    modules: ERPModule[];
    syncSchedule: SyncSchedule;
    mappings: FieldMapping[];
    isActive: boolean;
    lastSyncAt?: Date;
    syncStatus: 'idle' | 'running' | 'error' | 'completed';
    metadata: Record<string, any>;
}
export interface ERPModule {
    moduleName: string;
    enabled: boolean;
    syncDirection: 'inbound' | 'outbound' | 'bidirectional';
    entities: string[];
    filters?: Record<string, any>;
}
export interface SyncSchedule {
    frequency: 'realtime' | 'every_5min' | 'hourly' | 'daily' | 'weekly' | 'monthly';
    specificTime?: string;
    timezone: string;
    retryPolicy: RetryPolicy;
}
export interface RetryPolicy {
    maxRetries: number;
    retryDelay: number;
    exponentialBackoff: boolean;
    maxDelay: number;
}
export interface FieldMapping {
    sourceField: string;
    targetField: string;
    transformation?: string;
    defaultValue?: any;
    required: boolean;
    dataType: string;
}
export interface DataImportJob {
    jobId: string;
    jobType: 'bank_statement' | 'transactions' | 'invoices' | 'payments' | 'general_ledger' | 'custom';
    sourceType: 'file' | 'api' | 'database' | 'sftp';
    sourceLocation?: string;
    format: 'csv' | 'excel' | 'xml' | 'json' | 'edi' | 'fixed_width' | 'custom';
    totalRecords: number;
    processedRecords: number;
    successfulRecords: number;
    failedRecords: number;
    status: 'queued' | 'processing' | 'completed' | 'failed' | 'partial';
    errors: ImportError[];
    createdBy: string;
    createdAt: Date;
    startedAt?: Date;
    completedAt?: Date;
    metadata: Record<string, any>;
}
export interface ImportError {
    recordNumber: number;
    field?: string;
    errorType: string;
    errorMessage: string;
    rawData?: any;
}
export interface DataExportJob {
    jobId: string;
    jobType: 'transactions' | 'reports' | 'reconciliation' | 'audit_trail' | 'custom';
    format: 'csv' | 'excel' | 'xml' | 'json' | 'pdf' | 'custom';
    filters: Record<string, any>;
    columns: string[];
    totalRecords: number;
    status: 'queued' | 'processing' | 'completed' | 'failed';
    outputLocation?: string;
    downloadUrl?: string;
    expiresAt?: Date;
    createdBy: string;
    createdAt: Date;
    completedAt?: Date;
    metadata: Record<string, any>;
}
export interface APIConnector {
    connectorId: string;
    connectorName: string;
    apiType: 'rest' | 'soap' | 'graphql' | 'grpc' | 'custom';
    baseUrl: string;
    authType: 'none' | 'basic' | 'bearer' | 'oauth2' | 'api_key' | 'certificate';
    credentials: EncryptedCredentials;
    headers: Record<string, string>;
    timeout: number;
    retryPolicy: RetryPolicy;
    rateLimit: RateLimitConfig;
    endpoints: APIEndpoint[];
    isActive: boolean;
    healthCheckUrl?: string;
    lastHealthCheck?: Date;
    metadata: Record<string, any>;
}
export interface APIEndpoint {
    endpointId: string;
    name: string;
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    path: string;
    description?: string;
    requestSchema?: Record<string, any>;
    responseSchema?: Record<string, any>;
    rateLimit?: RateLimitConfig;
}
export interface WebhookConfig {
    webhookId: string;
    url: string;
    events: string[];
    secret: string;
    isActive: boolean;
    retryPolicy: RetryPolicy;
    headers: Record<string, string>;
    payloadFormat: 'json' | 'xml' | 'form';
    signatureMethod: 'hmac_sha256' | 'hmac_sha512' | 'none';
    deliveryAttempts: number;
    lastDeliveredAt?: Date;
    metadata: Record<string, any>;
}
export interface ReconciliationRule {
    ruleId: string;
    ruleName: string;
    sourceType: 'bank' | 'erp' | 'gateway' | 'manual';
    targetType: 'general_ledger' | 'accounts_receivable' | 'accounts_payable';
    matchingCriteria: MatchingCriterion[];
    tolerance: number;
    autoReconcile: boolean;
    requiresApproval: boolean;
    isActive: boolean;
    priority: number;
}
export interface MatchingCriterion {
    field: string;
    matchType: 'exact' | 'fuzzy' | 'range' | 'regex';
    weight: number;
    required: boolean;
}
export declare class BankConnectionDto {
    bankName: string;
    bankCode: string;
    connectionType: string;
    apiEndpoint?: string;
    authType: string;
    accountNumbers: string[];
    syncFrequency: string;
}
export declare class PaymentTransactionDto {
    gatewayId: string;
    paymentMethod: string;
    amount: number;
    currency: string;
    customerId?: string;
    customerEmail?: string;
    description: string;
    metadata?: Record<string, any>;
}
export declare class DataImportDto {
    jobType: string;
    sourceType: string;
    format: string;
    sourceLocation?: string;
    metadata?: Record<string, any>;
}
/**
 * Sequelize model for Bank Connections - manages bank API integrations
 */
export declare const createBankConnectionModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        connectionId: string;
        bankName: string;
        bankCode: string;
        connectionType: string;
        apiEndpoint: string | null;
        apiVersion: string | null;
        authType: string;
        encryptedCredentials: string;
        accountNumbers: string[];
        isActive: boolean;
        lastSyncAt: Date | null;
        syncFrequency: string;
        features: BankFeature[];
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Bank Transactions - stores imported bank transactions
 */
export declare const createBankTransactionModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        transactionId: string;
        connectionId: string;
        accountNumber: string;
        transactionType: string;
        amount: number;
        currency: string;
        description: string;
        referenceNumber: string;
        valueDate: Date;
        postingDate: Date;
        balance: number;
        counterpartyName: string | null;
        counterpartyAccount: string | null;
        status: string;
        metadata: Record<string, any>;
        rawData: Record<string, any>;
        reconciledAt: Date | null;
        reconciledBy: string | null;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Payment Gateways - manages payment provider integrations
 */
export declare const createPaymentGatewayModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        gatewayId: string;
        providerName: string;
        providerType: string;
        apiEndpoint: string;
        apiVersion: string;
        encryptedCredentials: string;
        supportedMethods: PaymentMethod[];
        supportedCurrencies: string[];
        webhookUrl: string | null;
        webhookSecret: string | null;
        isActive: boolean;
        isSandbox: boolean;
        features: GatewayFeature[];
        rateLimit: RateLimitConfig;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Payment Transactions - stores payment transaction records
 */
export declare const createPaymentTransactionModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        transactionId: string;
        gatewayId: string;
        externalTransactionId: string | null;
        paymentMethod: string;
        amount: number;
        currency: string;
        status: string;
        customerId: string | null;
        customerEmail: string | null;
        description: string;
        metadata: Record<string, any>;
        processingFee: number | null;
        netAmount: number | null;
        processedAt: Date | null;
        settledAt: Date | null;
        errorMessage: string | null;
        errorCode: string | null;
        rawResponse: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for ERP Integrations - manages ERP system connections
 */
export declare const createERPIntegrationModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        integrationId: string;
        erpSystem: string;
        erpVersion: string;
        connectionType: string;
        apiEndpoint: string | null;
        encryptedCredentials: string;
        modules: ERPModule[];
        syncSchedule: SyncSchedule;
        mappings: FieldMapping[];
        isActive: boolean;
        lastSyncAt: Date | null;
        syncStatus: string;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Data Import Jobs - tracks import operations
 */
export declare const createDataImportJobModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        jobId: string;
        jobType: string;
        sourceType: string;
        sourceLocation: string | null;
        format: string;
        totalRecords: number;
        processedRecords: number;
        successfulRecords: number;
        failedRecords: number;
        status: string;
        errors: ImportError[];
        createdBy: string;
        startedAt: Date | null;
        completedAt: Date | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Guard to verify API integration credentials
 */
export declare class IntegrationAuthGuard {
    canActivate(context: ExecutionContext): Promise<boolean>;
    private validateIntegrationCredentials;
}
/**
 * Interceptor for logging integration API calls
 */
export declare class IntegrationLoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
    private logIntegrationCall;
}
/**
 * 1. Create bank connection
 *
 * @param {BankConnection} connection - Bank connection data
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<BankConnection>} Created connection
 *
 * @example
 * ```typescript
 * const connection = await createBankConnection({
 *   bankName: 'Bank of America',
 *   bankCode: 'BOFAUS3N',
 *   connectionType: 'api',
 *   apiEndpoint: 'https://api.bankofamerica.com',
 *   authType: 'oauth2',
 *   credentials: encryptedCreds,
 *   accountNumbers: ['1234567890'],
 *   syncFrequency: 'daily'
 * });
 * ```
 */
export declare function createBankConnection(connection: Partial<BankConnection>, transaction?: Transaction): Promise<BankConnection>;
/**
 * 2. Encrypt credentials for secure storage
 *
 * @param {Record<string, any>} credentials - Credentials to encrypt
 * @returns {Promise<EncryptedCredentials>} Encrypted credentials
 */
export declare function encryptCredentials(credentials: Record<string, any>): Promise<EncryptedCredentials>;
/**
 * 3. Decrypt credentials
 *
 * @param {EncryptedCredentials} encrypted - Encrypted credentials
 * @returns {Promise<Record<string, any>>} Decrypted credentials
 */
export declare function decryptCredentials(encrypted: EncryptedCredentials): Promise<Record<string, any>>;
/**
 * 4. Get encryption key from environment or secrets manager
 *
 * @returns {Promise<Buffer>} Encryption key
 */
export declare function getEncryptionKey(): Promise<Buffer>;
/**
 * 5. Test bank connection
 *
 * @param {BankConnection} connection - Bank connection to test
 * @returns {Promise<boolean>} Whether connection is successful
 */
export declare function testBankConnection(connection: BankConnection): Promise<boolean>;
/**
 * 6. Create bank API client
 *
 * @param {BankConnection} connection - Bank connection
 * @returns {Promise<AxiosInstance>} Configured Axios client
 */
export declare function createBankAPIClient(connection: BankConnection): Promise<AxiosInstance>;
/**
 * 7. Get OAuth2 token
 *
 * @param {Record<string, any>} credentials - OAuth2 credentials
 * @returns {Promise<string>} Access token
 */
export declare function getOAuth2Token(credentials: Record<string, any>): Promise<string>;
/**
 * 8. Sync bank transactions
 *
 * @param {string} connectionId - Bank connection ID
 * @param {Date} fromDate - Start date
 * @param {Date} toDate - End date
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<BankTransaction[]>} Imported transactions
 */
export declare function syncBankTransactions(connectionId: string, fromDate: Date, toDate: Date, transaction?: Transaction): Promise<BankTransaction[]>;
/**
 * 9. Parse bank transactions from API response
 *
 * @param {any} data - API response data
 * @param {string} connectionId - Connection ID
 * @param {string} accountNumber - Account number
 * @returns {Promise<BankTransaction[]>} Parsed transactions
 */
export declare function parseBankTransactions(data: any, connectionId: string, accountNumber: string): Promise<BankTransaction[]>;
/**
 * 10. Get bank connection by ID
 *
 * @param {string} connectionId - Connection ID
 * @returns {Promise<BankConnection | null>} Bank connection or null
 */
export declare function getBankConnectionById(connectionId: string): Promise<BankConnection | null>;
/**
 * 11. Create payment gateway
 *
 * @param {PaymentGateway} gateway - Gateway configuration
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<PaymentGateway>} Created gateway
 */
export declare function createPaymentGateway(gateway: Partial<PaymentGateway>, transaction?: Transaction): Promise<PaymentGateway>;
/**
 * 12. Test payment gateway connection
 *
 * @param {PaymentGateway} gateway - Payment gateway
 * @returns {Promise<boolean>} Whether test is successful
 */
export declare function testPaymentGateway(gateway: PaymentGateway): Promise<boolean>;
/**
 * 13. Create payment gateway API client
 *
 * @param {PaymentGateway} gateway - Payment gateway
 * @returns {Promise<AxiosInstance>} Configured client
 */
export declare function createPaymentGatewayClient(gateway: PaymentGateway): Promise<AxiosInstance>;
/**
 * 14. Process payment transaction
 *
 * @param {PaymentTransaction} payment - Payment transaction
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<PaymentTransaction>} Processed payment
 */
export declare function processPaymentTransaction(payment: Partial<PaymentTransaction>, transaction?: Transaction): Promise<PaymentTransaction>;
/**
 * 15. Get payment gateway by ID
 *
 * @param {string} gatewayId - Gateway ID
 * @returns {Promise<PaymentGateway | null>} Payment gateway or null
 */
export declare function getPaymentGatewayById(gatewayId: string): Promise<PaymentGateway | null>;
/**
 * 16. Get fee structure for payment method
 *
 * @param {PaymentGateway} gateway - Payment gateway
 * @param {string} method - Payment method
 * @returns {FeeStructure[]} Fee structures
 */
export declare function getFeeStructure(gateway: PaymentGateway, method: string): FeeStructure[];
/**
 * 17. Calculate processing fee
 *
 * @param {number} amount - Transaction amount
 * @param {FeeStructure[]} fees - Fee structures
 * @returns {number} Processing fee
 */
export declare function calculateProcessingFee(amount: number, fees: FeeStructure[]): number;
/**
 * 18. Refund payment transaction
 *
 * @param {string} transactionId - Transaction ID
 * @param {number} amount - Refund amount
 * @param {string} reason - Refund reason
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<PaymentTransaction>} Refunded transaction
 */
export declare function refundPaymentTransaction(transactionId: string, amount?: number, reason?: string, transaction?: Transaction): Promise<PaymentTransaction>;
/**
 * 19. Get payment transaction by ID
 *
 * @param {string} transactionId - Transaction ID
 * @returns {Promise<PaymentTransaction | null>} Payment transaction or null
 */
export declare function getPaymentTransactionById(transactionId: string): Promise<PaymentTransaction | null>;
/**
 * 20. Create ERP integration
 *
 * @param {ERPIntegration} integration - ERP integration configuration
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<ERPIntegration>} Created integration
 */
export declare function createERPIntegration(integration: Partial<ERPIntegration>, transaction?: Transaction): Promise<ERPIntegration>;
/**
 * 21. Test ERP connection
 *
 * @param {ERPIntegration} integration - ERP integration
 * @returns {Promise<boolean>} Whether test is successful
 */
export declare function testERPConnection(integration: ERPIntegration): Promise<boolean>;
/**
 * 22. Create ERP API client
 *
 * @param {ERPIntegration} integration - ERP integration
 * @returns {Promise<AxiosInstance>} Configured client
 */
export declare function createERPAPIClient(integration: ERPIntegration): Promise<AxiosInstance>;
/**
 * 23. Sync ERP data
 *
 * @param {string} integrationId - Integration ID
 * @param {string[]} modules - Modules to sync
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<Record<string, any>>} Sync results
 */
export declare function syncERPData(integrationId: string, modules?: string[], transaction?: Transaction): Promise<Record<string, any>>;
/**
 * 24. Sync ERP module
 *
 * @param {ERPIntegration} integration - ERP integration
 * @param {string} moduleName - Module name
 * @returns {Promise<Record<string, any>>} Sync result
 */
export declare function syncERPModule(integration: ERPIntegration, moduleName: string): Promise<Record<string, any>>;
/**
 * 25. Fetch ERP entity data
 *
 * @param {AxiosInstance} client - API client
 * @param {string} entity - Entity name
 * @param {Record<string, any>} filters - Filters
 * @returns {Promise<any[]>} Entity data
 */
export declare function fetchERPEntity(client: AxiosInstance, entity: string, filters?: Record<string, any>): Promise<any[]>;
/**
 * 26. Transform ERP data using field mappings
 *
 * @param {any[]} data - Source data
 * @param {FieldMapping[]} mappings - Field mappings
 * @returns {Promise<any[]>} Transformed data
 */
export declare function transformERPData(data: any[], mappings: FieldMapping[]): Promise<any[]>;
/**
 * 27. Apply transformation to field value
 *
 * @param {any} value - Original value
 * @param {string} transformation - Transformation expression
 * @returns {any} Transformed value
 */
export declare function applyTransformation(value: any, transformation: string): any;
/**
 * 28. Get ERP integration by ID
 *
 * @param {string} integrationId - Integration ID
 * @returns {Promise<ERPIntegration | null>} ERP integration or null
 */
export declare function getERPIntegrationById(integrationId: string): Promise<ERPIntegration | null>;
/**
 * 29. Create data import job
 *
 * @param {DataImportJob} job - Import job
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<DataImportJob>} Created job
 */
export declare function createDataImportJob(job: Partial<DataImportJob>, transaction?: Transaction): Promise<DataImportJob>;
/**
 * 30. Queue import job for background processing
 *
 * @param {DataImportJob} job - Import job
 * @returns {Promise<void>}
 */
export declare function queueImportJob(job: DataImportJob): Promise<void>;
/**
 * 31. Process import job
 *
 * @param {string} jobId - Job ID
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<DataImportJob>} Processed job
 */
export declare function processImportJob(jobId: string, transaction?: Transaction): Promise<DataImportJob>;
/**
 * 32. Read import data from source
 *
 * @param {DataImportJob} job - Import job
 * @returns {Promise<any[]>} Import data
 */
export declare function readImportData(job: DataImportJob): Promise<any[]>;
/**
 * 33. Read data from file
 *
 * @param {string} filePath - File path
 * @param {string} format - File format
 * @returns {Promise<any[]>} File data
 */
export declare function readFileData(filePath: string, format: string): Promise<any[]>;
/**
 * 34. Parse CSV data
 *
 * @param {string} content - CSV content
 * @returns {any[]} Parsed data
 */
export declare function parseCSV(content: string): any[];
/**
 * 35. Parse XML data
 *
 * @param {string} content - XML content
 * @returns {any[]} Parsed data
 */
export declare function parseXML(content: string): any[];
/**
 * 36. Read data from API
 *
 * @param {string} url - API URL
 * @returns {Promise<any[]>} API data
 */
export declare function readAPIData(url: string): Promise<any[]>;
/**
 * 37. Read data from SFTP
 *
 * @param {string} path - SFTP path
 * @param {string} format - File format
 * @returns {Promise<any[]>} SFTP data
 */
export declare function readSFTPData(path: string, format: string): Promise<any[]>;
/**
 * 38. Import individual record
 *
 * @param {any} record - Record to import
 * @param {string} jobType - Job type
 * @returns {Promise<void>}
 */
export declare function importRecord(record: any, jobType: string): Promise<void>;
/**
 * 39. Get import job by ID
 *
 * @param {string} jobId - Job ID
 * @returns {Promise<DataImportJob | null>} Import job or null
 */
export declare function getImportJobById(jobId: string): Promise<DataImportJob | null>;
/**
 * 40. Create data export job
 *
 * @param {DataExportJob} job - Export job
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<DataExportJob>} Created job
 */
export declare function createDataExportJob(job: Partial<DataExportJob>, transaction?: Transaction): Promise<DataExportJob>;
/**
 * 41. Queue export job
 *
 * @param {DataExportJob} job - Export job
 * @returns {Promise<void>}
 */
export declare function queueExportJob(job: DataExportJob): Promise<void>;
/**
 * 42. Process webhook delivery
 *
 * @param {string} webhookId - Webhook ID
 * @param {Record<string, any>} payload - Webhook payload
 * @returns {Promise<boolean>} Whether delivery was successful
 */
export declare function processWebhookDelivery(webhookId: string, payload: Record<string, any>): Promise<boolean>;
/**
 * 43. Generate webhook signature
 *
 * @param {Record<string, any>} payload - Payload
 * @param {string} secret - Secret key
 * @param {string} method - Signature method
 * @returns {string} Signature
 */
export declare function generateWebhookSignature(payload: Record<string, any>, secret: string, method: string): string;
/**
 * 44. Retry webhook delivery
 *
 * @param {string} webhookId - Webhook ID
 * @param {Record<string, any>} payload - Payload
 * @param {RetryPolicy} retryPolicy - Retry policy
 * @returns {Promise<void>}
 */
export declare function retryWebhookDelivery(webhookId: string, payload: Record<string, any>, retryPolicy: RetryPolicy): Promise<void>;
/**
 * 45. Get webhook by ID
 *
 * @param {string} webhookId - Webhook ID
 * @returns {Promise<WebhookConfig | null>} Webhook config or null
 */
export declare function getWebhookById(webhookId: string): Promise<WebhookConfig | null>;
/**
 * Helper: Generate UUID
 *
 * @returns {string} UUID v4
 */
export declare function generateUUID(): string;
export declare class FinancialIntegrationController {
    /**
     * Create bank connection
     */
    createBank(connectionDto: BankConnectionDto): Promise<BankConnection>;
    /**
     * Sync bank transactions
     */
    syncBank(connectionId: string, fromDate: string, toDate: string): Promise<BankTransaction[]>;
    /**
     * Process payment transaction
     */
    processPayment(paymentDto: PaymentTransactionDto): Promise<PaymentTransaction>;
    /**
     * Refund payment
     */
    refundPayment(transactionId: string, amount?: number, reason?: string): Promise<PaymentTransaction>;
    /**
     * Sync ERP data
     */
    syncERP(integrationId: string, modules?: string[]): Promise<Record<string, any>>;
    /**
     * Create import job
     */
    createImport(importDto: DataImportDto): Promise<DataImportJob>;
    /**
     * Get import job status
     */
    getImportStatus(jobId: string): Promise<DataImportJob>;
    /**
     * Create export job
     */
    createExport(jobType: string, format: string, filters?: Record<string, any>, columns?: string[]): Promise<DataExportJob>;
}
//# sourceMappingURL=financial-integration-exchange-kit.d.ts.map