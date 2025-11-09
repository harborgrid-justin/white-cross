/**
 * LOC: TINT1234567
 * File: /reuse/san/typescript-oracle-integration-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Enterprise Service Bus (ESB) implementations
 *   - Integration middleware and adapters
 *   - Message transformation services
 *   - Protocol bridge components
 */
/**
 * File: /reuse/san/typescript-oracle-integration-kit.ts
 * Locator: WC-UTL-TINT-001
 * Purpose: Enterprise Integration Patterns - ESB, message transformation, protocol adapters, routing
 *
 * Upstream: Independent utility module for enterprise integration and service orchestration
 * Downstream: ../backend/*, integration services, ESB implementations, message brokers, protocol adapters
 * Dependencies: TypeScript 5.x, Node 18+, Oracle Service Bus, Apache Camel patterns, gRPC, SOAP
 * Exports: 46 utility functions for ESB patterns, message transformation, protocol adapters, routing, enrichment
 *
 * LLM Context: Comprehensive enterprise integration utilities for building Oracle Service Bus compatible
 * integrations in healthcare systems. Provides message transformation, protocol adapters (REST/SOAP/gRPC),
 * content-based routing, message enrichment, canonical data models, and integration error handling.
 * Essential for HIPAA-compliant healthcare data exchange and interoperability.
 */
interface IntegrationMessage<T = any> {
    messageId: string;
    correlationId?: string;
    timestamp: Date;
    source: string;
    destination: string;
    messageType: string;
    payload: T;
    headers: Record<string, any>;
    metadata?: MessageMetadata;
}
interface MessageMetadata {
    priority: 'low' | 'normal' | 'high' | 'critical';
    ttl?: number;
    retryCount?: number;
    schemaVersion?: string;
    contentType?: string;
    encoding?: string;
}
interface TransformationRule {
    sourceField: string;
    targetField: string;
    transformFunction?: (value: any) => any;
    defaultValue?: any;
    required?: boolean;
    condition?: (source: any) => boolean;
}
interface CanonicalDataModel {
    modelName: string;
    version: string;
    namespace: string;
    schema: Record<string, any>;
    validationRules?: ValidationRule[];
}
interface ValidationRule {
    field: string;
    type: 'required' | 'format' | 'range' | 'custom';
    rule: any;
    errorMessage: string;
}
interface RoutingRule {
    ruleId: string;
    name: string;
    priority: number;
    condition: (message: IntegrationMessage) => boolean;
    destination: string;
    transformation?: TransformationRule[];
    enabled: boolean;
}
interface ProtocolAdapter {
    protocol: 'REST' | 'SOAP' | 'gRPC' | 'JMS' | 'AMQP' | 'KAFKA';
    endpoint: string;
    configuration: Record<string, any>;
    transformRequest: (message: IntegrationMessage) => any;
    transformResponse: (response: any) => IntegrationMessage;
}
interface EnrichmentStrategy {
    strategyType: 'lookup' | 'aggregate' | 'external-call' | 'cache';
    source: string;
    enrichFields: string[];
    enrichFunction: (message: IntegrationMessage) => Promise<any>;
    cacheConfig?: CacheConfiguration;
}
interface CacheConfiguration {
    enabled: boolean;
    ttl: number;
    keyPattern: string;
    invalidationStrategy: 'ttl' | 'event' | 'manual';
}
interface IntegrationError {
    errorCode: string;
    errorMessage: string;
    errorType: 'transformation' | 'routing' | 'protocol' | 'validation' | 'enrichment' | 'system';
    severity: 'warning' | 'error' | 'critical';
    recoverable: boolean;
    originalMessage?: IntegrationMessage;
    stackTrace?: string;
    timestamp: Date;
}
interface ErrorHandlingStrategy {
    strategyType: 'retry' | 'dead-letter' | 'compensate' | 'ignore' | 'alert';
    maxRetries?: number;
    retryDelay?: number;
    deadLetterQueue?: string;
    compensationHandler?: (error: IntegrationError) => Promise<void>;
    alertChannels?: string[];
}
interface SplitAggregatePattern {
    splitStrategy: 'fixed-size' | 'dynamic' | 'conditional';
    aggregationStrategy: 'all' | 'first' | 'count' | 'timeout';
    correlationKey: string;
    timeout?: number;
    partitionSize?: number;
}
interface ContentBasedRouter {
    routerId: string;
    routes: RoutingRule[];
    defaultRoute?: string;
    errorRoute?: string;
    auditEnabled: boolean;
}
interface MessageFilter {
    filterId: string;
    filterType: 'content' | 'header' | 'property' | 'schema';
    condition: (message: IntegrationMessage) => boolean;
    action: 'accept' | 'reject' | 'transform';
}
interface ServiceOrchestration {
    orchestrationId: string;
    services: ServiceStep[];
    compensationEnabled: boolean;
    transactionBoundary: 'global' | 'local' | 'none';
    timeoutMs: number;
}
interface ServiceStep {
    stepId: string;
    stepName: string;
    serviceEndpoint: string;
    inputMapping: TransformationRule[];
    outputMapping: TransformationRule[];
    errorHandling: ErrorHandlingStrategy;
    compensation?: () => Promise<void>;
}
interface MessageBrokerConfig {
    brokerType: 'KAFKA' | 'RABBITMQ' | 'ACTIVEMQ' | 'ORACLE_AQ';
    connectionUrl: string;
    credentials?: {
        username: string;
        password: string;
    };
    exchangeName?: string;
    queueName?: string;
    topicName?: string;
}
interface SOAPAdapter {
    wsdlUrl: string;
    namespace: string;
    operation: string;
    soapVersion: '1.1' | '1.2';
    securityConfig?: SOAPSecurity;
}
interface SOAPSecurity {
    type: 'basic' | 'wss' | 'oauth';
    username?: string;
    password?: string;
    token?: string;
    certificate?: string;
}
interface GRPCAdapter {
    protoFile: string;
    serviceName: string;
    methodName: string;
    serverUrl: string;
    useTLS: boolean;
    metadata?: Record<string, string>;
}
interface DataMapping {
    mappingId: string;
    sourceSchema: string;
    targetSchema: string;
    fieldMappings: FieldMapping[];
    transformations: TransformationRule[];
}
interface FieldMapping {
    sourcePath: string;
    targetPath: string;
    dataType: 'string' | 'number' | 'boolean' | 'date' | 'object' | 'array';
    format?: string;
}
/**
 * Creates a standardized integration message.
 *
 * @template T
 * @param {T} payload - Message payload
 * @param {string} source - Source system identifier
 * @param {string} destination - Destination system identifier
 * @param {string} messageType - Message type identifier
 * @param {Partial<MessageMetadata>} [metadata] - Optional metadata
 * @returns {IntegrationMessage<T>} Standardized integration message
 *
 * @example
 * ```typescript
 * const message = createIntegrationMessage(
 *   { patientId: '123', name: 'John Doe' },
 *   'EHR-SYSTEM',
 *   'LAB-SYSTEM',
 *   'PATIENT_REGISTRATION'
 * );
 * ```
 */
export declare const createIntegrationMessage: <T>(payload: T, source: string, destination: string, messageType: string, metadata?: Partial<MessageMetadata>) => IntegrationMessage<T>;
/**
 * Generates unique message identifier.
 *
 * @returns {string} Unique message ID
 *
 * @example
 * ```typescript
 * const msgId = generateMessageId();
 * // Result: 'MSG-20240115-ABC123DEF456'
 * ```
 */
export declare const generateMessageId: () => string;
/**
 * Generates correlation identifier for message tracking.
 *
 * @returns {string} Correlation ID
 *
 * @example
 * ```typescript
 * const corrId = generateCorrelationId();
 * // Result: 'CORR-20240115-XYZ789ABC123'
 * ```
 */
export declare const generateCorrelationId: () => string;
/**
 * Clones integration message with new payload.
 *
 * @template T
 * @param {IntegrationMessage} original - Original message
 * @param {T} newPayload - New payload
 * @returns {IntegrationMessage<T>} Cloned message
 *
 * @example
 * ```typescript
 * const cloned = cloneMessageWithPayload(originalMsg, transformedData);
 * ```
 */
export declare const cloneMessageWithPayload: <T>(original: IntegrationMessage, newPayload: T) => IntegrationMessage<T>;
/**
 * Adds header to integration message.
 *
 * @param {IntegrationMessage} message - Integration message
 * @param {string} key - Header key
 * @param {any} value - Header value
 * @returns {IntegrationMessage} Message with added header
 *
 * @example
 * ```typescript
 * const updated = addMessageHeader(message, 'X-Request-ID', '12345');
 * ```
 */
export declare const addMessageHeader: (message: IntegrationMessage, key: string, value: any) => IntegrationMessage;
/**
 * Extracts header value from integration message.
 *
 * @param {IntegrationMessage} message - Integration message
 * @param {string} key - Header key
 * @param {any} [defaultValue] - Default value if header not found
 * @returns {any} Header value
 *
 * @example
 * ```typescript
 * const requestId = getMessageHeader(message, 'X-Request-ID', 'default');
 * ```
 */
export declare const getMessageHeader: (message: IntegrationMessage, key: string, defaultValue?: any) => any;
/**
 * Applies transformation rules to message payload.
 *
 * @param {IntegrationMessage} message - Source message
 * @param {TransformationRule[]} rules - Transformation rules
 * @returns {IntegrationMessage} Transformed message
 *
 * @example
 * ```typescript
 * const transformed = applyTransformationRules(message, [
 *   { sourceField: 'firstName', targetField: 'given_name' },
 *   { sourceField: 'lastName', targetField: 'family_name' }
 * ]);
 * ```
 */
export declare const applyTransformationRules: (message: IntegrationMessage, rules: TransformationRule[]) => IntegrationMessage;
/**
 * Creates transformation rule with type conversion.
 *
 * @param {string} sourceField - Source field path
 * @param {string} targetField - Target field path
 * @param {string} targetType - Target data type
 * @returns {TransformationRule} Transformation rule
 *
 * @example
 * ```typescript
 * const rule = createTypeConversionRule('age', 'patient.age', 'number');
 * ```
 */
export declare const createTypeConversionRule: (sourceField: string, targetField: string, targetType: "string" | "number" | "boolean" | "date") => TransformationRule;
/**
 * Creates conditional transformation rule.
 *
 * @param {string} sourceField - Source field path
 * @param {string} targetField - Target field path
 * @param {(source: any) => boolean} condition - Condition function
 * @param {(value: any) => any} [transformFunction] - Optional transformation
 * @returns {TransformationRule} Conditional transformation rule
 *
 * @example
 * ```typescript
 * const rule = createConditionalRule(
 *   'status',
 *   'active',
 *   (src) => src.status === 'ACTIVE',
 *   () => true
 * );
 * ```
 */
export declare const createConditionalRule: (sourceField: string, targetField: string, condition: (source: any) => boolean, transformFunction?: (value: any) => any) => TransformationRule;
/**
 * Transforms message to canonical data model.
 *
 * @param {IntegrationMessage} message - Source message
 * @param {CanonicalDataModel} canonicalModel - Canonical data model
 * @returns {IntegrationMessage} Message in canonical format
 *
 * @example
 * ```typescript
 * const canonical = transformToCanonical(message, patientCanonicalModel);
 * ```
 */
export declare const transformToCanonical: (message: IntegrationMessage, canonicalModel: CanonicalDataModel) => IntegrationMessage;
/**
 * Transforms canonical message to target system format.
 *
 * @param {IntegrationMessage} canonicalMessage - Canonical message
 * @param {TransformationRule[]} targetRules - Target transformation rules
 * @returns {IntegrationMessage} Message in target format
 *
 * @example
 * ```typescript
 * const targetMsg = transformFromCanonical(canonicalMsg, targetSystemRules);
 * ```
 */
export declare const transformFromCanonical: (canonicalMessage: IntegrationMessage, targetRules: TransformationRule[]) => IntegrationMessage;
/**
 * Creates content-based router.
 *
 * @param {string} routerId - Router identifier
 * @param {RoutingRule[]} routes - Routing rules
 * @param {string} [defaultRoute] - Default destination
 * @returns {ContentBasedRouter} Content-based router
 *
 * @example
 * ```typescript
 * const router = createContentBasedRouter('patient-router', routingRules, 'default-queue');
 * ```
 */
export declare const createContentBasedRouter: (routerId: string, routes: RoutingRule[], defaultRoute?: string) => ContentBasedRouter;
/**
 * Routes message based on content and rules.
 *
 * @param {IntegrationMessage} message - Message to route
 * @param {ContentBasedRouter} router - Content-based router
 * @returns {string} Destination route
 *
 * @example
 * ```typescript
 * const destination = routeMessage(message, router);
 * // Result: 'patient-registration-queue'
 * ```
 */
export declare const routeMessage: (message: IntegrationMessage, router: ContentBasedRouter) => string;
/**
 * Creates routing rule based on message type.
 *
 * @param {string} messageType - Message type to match
 * @param {string} destination - Destination route
 * @param {number} [priority] - Rule priority (default: 100)
 * @returns {RoutingRule} Routing rule
 *
 * @example
 * ```typescript
 * const rule = createMessageTypeRoutingRule('PATIENT_REGISTRATION', 'reg-queue', 200);
 * ```
 */
export declare const createMessageTypeRoutingRule: (messageType: string, destination: string, priority?: number) => RoutingRule;
/**
 * Creates routing rule based on payload content.
 *
 * @param {string} fieldPath - Field path to check
 * @param {any} expectedValue - Expected value
 * @param {string} destination - Destination route
 * @param {number} [priority] - Rule priority
 * @returns {RoutingRule} Content-based routing rule
 *
 * @example
 * ```typescript
 * const rule = createContentRoutingRule('patient.priority', 'high', 'priority-queue', 300);
 * ```
 */
export declare const createContentRoutingRule: (fieldPath: string, expectedValue: any, destination: string, priority?: number) => RoutingRule;
/**
 * Creates header-based routing rule.
 *
 * @param {string} headerKey - Header key to check
 * @param {any} expectedValue - Expected header value
 * @param {string} destination - Destination route
 * @returns {RoutingRule} Header-based routing rule
 *
 * @example
 * ```typescript
 * const rule = createHeaderRoutingRule('X-Priority', 'urgent', 'urgent-queue');
 * ```
 */
export declare const createHeaderRoutingRule: (headerKey: string, expectedValue: any, destination: string) => RoutingRule;
/**
 * Enriches message with additional data from lookup.
 *
 * @param {IntegrationMessage} message - Message to enrich
 * @param {EnrichmentStrategy} strategy - Enrichment strategy
 * @returns {Promise<IntegrationMessage>} Enriched message
 *
 * @example
 * ```typescript
 * const enriched = await enrichMessage(message, {
 *   strategyType: 'lookup',
 *   source: 'patient-database',
 *   enrichFields: ['demographics', 'insurance'],
 *   enrichFunction: async (msg) => lookupPatientData(msg.payload.patientId)
 * });
 * ```
 */
export declare const enrichMessage: (message: IntegrationMessage, strategy: EnrichmentStrategy) => Promise<IntegrationMessage>;
/**
 * Creates lookup-based enrichment strategy.
 *
 * @param {string} source - Enrichment data source
 * @param {(key: string) => Promise<any>} lookupFunction - Lookup function
 * @param {string} keyField - Field to use as lookup key
 * @returns {EnrichmentStrategy} Lookup enrichment strategy
 *
 * @example
 * ```typescript
 * const strategy = createLookupEnrichment(
 *   'patient-db',
 *   (id) => db.findPatient(id),
 *   'patientId'
 * );
 * ```
 */
export declare const createLookupEnrichment: (source: string, lookupFunction: (key: string) => Promise<any>, keyField: string) => EnrichmentStrategy;
/**
 * Creates aggregate enrichment strategy combining multiple sources.
 *
 * @param {EnrichmentStrategy[]} strategies - Array of enrichment strategies
 * @returns {EnrichmentStrategy} Aggregate enrichment strategy
 *
 * @example
 * ```typescript
 * const aggregateStrategy = createAggregateEnrichment([
 *   patientLookupStrategy,
 *   insuranceLookupStrategy,
 *   providerLookupStrategy
 * ]);
 * ```
 */
export declare const createAggregateEnrichment: (strategies: EnrichmentStrategy[]) => EnrichmentStrategy;
/**
 * Creates cached enrichment strategy.
 *
 * @param {EnrichmentStrategy} baseStrategy - Base enrichment strategy
 * @param {CacheConfiguration} cacheConfig - Cache configuration
 * @returns {EnrichmentStrategy} Cached enrichment strategy
 *
 * @example
 * ```typescript
 * const cachedStrategy = createCachedEnrichment(lookupStrategy, {
 *   enabled: true,
 *   ttl: 3600,
 *   keyPattern: 'patient:{patientId}',
 *   invalidationStrategy: 'ttl'
 * });
 * ```
 */
export declare const createCachedEnrichment: (baseStrategy: EnrichmentStrategy, cacheConfig: CacheConfiguration) => EnrichmentStrategy;
/**
 * Creates REST protocol adapter.
 *
 * @param {string} endpoint - REST endpoint URL
 * @param {string} method - HTTP method
 * @param {Record<string, any>} [config] - Additional configuration
 * @returns {ProtocolAdapter} REST protocol adapter
 *
 * @example
 * ```typescript
 * const restAdapter = createRESTAdapter(
 *   'https://api.example.com/patients',
 *   'POST',
 *   { headers: { 'Authorization': 'Bearer token' } }
 * );
 * ```
 */
export declare const createRESTAdapter: (endpoint: string, method?: string, config?: Record<string, any>) => ProtocolAdapter;
/**
 * Creates SOAP protocol adapter.
 *
 * @param {SOAPAdapter} soapConfig - SOAP adapter configuration
 * @returns {ProtocolAdapter} SOAP protocol adapter
 *
 * @example
 * ```typescript
 * const soapAdapter = createSOAPAdapter({
 *   wsdlUrl: 'http://service.com/service?wsdl',
 *   namespace: 'http://service.com/ns',
 *   operation: 'GetPatient',
 *   soapVersion: '1.2'
 * });
 * ```
 */
export declare const createSOAPAdapter: (soapConfig: SOAPAdapter) => ProtocolAdapter;
/**
 * Creates gRPC protocol adapter.
 *
 * @param {GRPCAdapter} grpcConfig - gRPC adapter configuration
 * @returns {ProtocolAdapter} gRPC protocol adapter
 *
 * @example
 * ```typescript
 * const grpcAdapter = createGRPCAdapter({
 *   protoFile: 'patient.proto',
 *   serviceName: 'PatientService',
 *   methodName: 'GetPatient',
 *   serverUrl: 'localhost:50051',
 *   useTLS: true
 * });
 * ```
 */
export declare const createGRPCAdapter: (grpcConfig: GRPCAdapter) => ProtocolAdapter;
/**
 * Adapts message to target protocol.
 *
 * @param {IntegrationMessage} message - Source message
 * @param {ProtocolAdapter} adapter - Protocol adapter
 * @returns {any} Protocol-specific request
 *
 * @example
 * ```typescript
 * const restRequest = adaptToProtocol(message, restAdapter);
 * ```
 */
export declare const adaptToProtocol: (message: IntegrationMessage, adapter: ProtocolAdapter) => any;
/**
 * Adapts protocol response to integration message.
 *
 * @param {any} response - Protocol-specific response
 * @param {ProtocolAdapter} adapter - Protocol adapter
 * @returns {IntegrationMessage} Integration message
 *
 * @example
 * ```typescript
 * const message = adaptFromProtocol(httpResponse, restAdapter);
 * ```
 */
export declare const adaptFromProtocol: (response: any, adapter: ProtocolAdapter) => IntegrationMessage;
/**
 * Creates message filter based on content.
 *
 * @param {string} filterId - Filter identifier
 * @param {(message: IntegrationMessage) => boolean} condition - Filter condition
 * @param {('accept' | 'reject' | 'transform')} action - Filter action
 * @returns {MessageFilter} Message filter
 *
 * @example
 * ```typescript
 * const filter = createMessageFilter(
 *   'priority-filter',
 *   (msg) => msg.metadata?.priority === 'high',
 *   'accept'
 * );
 * ```
 */
export declare const createMessageFilter: (filterId: string, condition: (message: IntegrationMessage) => boolean, action?: "accept" | "reject" | "transform") => MessageFilter;
/**
 * Applies filter to message.
 *
 * @param {IntegrationMessage} message - Message to filter
 * @param {MessageFilter} filter - Message filter
 * @returns {boolean} True if message passes filter
 *
 * @example
 * ```typescript
 * const passes = applyFilter(message, priorityFilter);
 * ```
 */
export declare const applyFilter: (message: IntegrationMessage, filter: MessageFilter) => boolean;
/**
 * Creates filter chain combining multiple filters.
 *
 * @param {MessageFilter[]} filters - Array of filters
 * @param {('AND' | 'OR')} logic - Combination logic
 * @returns {(message: IntegrationMessage) => boolean} Combined filter function
 *
 * @example
 * ```typescript
 * const combinedFilter = createFilterChain([filter1, filter2], 'AND');
 * const passes = combinedFilter(message);
 * ```
 */
export declare const createFilterChain: (filters: MessageFilter[], logic?: "AND" | "OR") => ((message: IntegrationMessage) => boolean);
/**
 * Creates integration error.
 *
 * @param {string} errorCode - Error code
 * @param {string} errorMessage - Error message
 * @param {IntegrationError['errorType']} errorType - Error type
 * @param {IntegrationMessage} [originalMessage] - Original message
 * @returns {IntegrationError} Integration error
 *
 * @example
 * ```typescript
 * const error = createIntegrationError(
 *   'TRANSFORM_001',
 *   'Field mapping failed',
 *   'transformation',
 *   originalMessage
 * );
 * ```
 */
export declare const createIntegrationError: (errorCode: string, errorMessage: string, errorType: IntegrationError["errorType"], originalMessage?: IntegrationMessage) => IntegrationError;
/**
 * Creates error handling strategy.
 *
 * @param {ErrorHandlingStrategy['strategyType']} strategyType - Strategy type
 * @param {Partial<ErrorHandlingStrategy>} [config] - Strategy configuration
 * @returns {ErrorHandlingStrategy} Error handling strategy
 *
 * @example
 * ```typescript
 * const strategy = createErrorStrategy('retry', {
 *   maxRetries: 3,
 *   retryDelay: 1000,
 *   deadLetterQueue: 'dlq-failed-messages'
 * });
 * ```
 */
export declare const createErrorStrategy: (strategyType: ErrorHandlingStrategy["strategyType"], config?: Partial<ErrorHandlingStrategy>) => ErrorHandlingStrategy;
/**
 * Handles integration error according to strategy.
 *
 * @param {IntegrationError} error - Integration error
 * @param {ErrorHandlingStrategy} strategy - Error handling strategy
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await handleIntegrationError(error, retryStrategy);
 * ```
 */
export declare const handleIntegrationError: (error: IntegrationError, strategy: ErrorHandlingStrategy) => Promise<void>;
/**
 * Validates message against schema rules.
 *
 * @param {any} payload - Message payload
 * @param {ValidationRule[]} rules - Validation rules
 * @returns {boolean} True if valid
 * @throws {Error} If validation fails
 *
 * @example
 * ```typescript
 * validateAgainstRules(message.payload, canonicalModel.validationRules);
 * ```
 */
export declare const validateAgainstRules: (payload: any, rules: ValidationRule[]) => boolean;
/**
 * Splits message into multiple parts.
 *
 * @template T
 * @param {IntegrationMessage<T[]>} message - Message with array payload
 * @param {SplitAggregatePattern} pattern - Split pattern configuration
 * @returns {IntegrationMessage[]} Array of split messages
 *
 * @example
 * ```typescript
 * const splitMessages = splitMessage(batchMessage, {
 *   splitStrategy: 'fixed-size',
 *   aggregationStrategy: 'all',
 *   correlationKey: 'batchId',
 *   partitionSize: 10
 * });
 * ```
 */
export declare const splitMessage: <T>(message: IntegrationMessage<T[]>, pattern: SplitAggregatePattern) => IntegrationMessage[];
/**
 * Aggregates split messages back into single message.
 *
 * @param {IntegrationMessage[]} messages - Split messages to aggregate
 * @param {SplitAggregatePattern} pattern - Aggregation pattern
 * @returns {IntegrationMessage | null} Aggregated message or null if incomplete
 *
 * @example
 * ```typescript
 * const aggregated = aggregateMessages(splitMessages, {
 *   splitStrategy: 'fixed-size',
 *   aggregationStrategy: 'all',
 *   correlationKey: 'batchId'
 * });
 * ```
 */
export declare const aggregateMessages: (messages: IntegrationMessage[], pattern: SplitAggregatePattern) => IntegrationMessage | null;
/**
 * Gets nested value from object using dot notation path.
 *
 * @param {any} obj - Source object
 * @param {string} path - Dot notation path
 * @returns {any} Value at path
 *
 * @example
 * ```typescript
 * const value = getNestedValue({ patient: { name: 'John' } }, 'patient.name');
 * // Result: 'John'
 * ```
 */
export declare const getNestedValue: (obj: any, path: string) => any;
/**
 * Sets nested value in object using dot notation path.
 *
 * @param {any} obj - Target object
 * @param {string} path - Dot notation path
 * @param {any} value - Value to set
 *
 * @example
 * ```typescript
 * const obj = {};
 * setNestedValue(obj, 'patient.name', 'John');
 * // obj is now { patient: { name: 'John' } }
 * ```
 */
export declare const setNestedValue: (obj: any, path: string, value: any) => void;
/**
 * Sets message priority.
 *
 * @param {IntegrationMessage} message - Integration message
 * @param {MessageMetadata['priority']} priority - Priority level
 * @returns {IntegrationMessage} Message with updated priority
 *
 * @example
 * ```typescript
 * const urgent = setMessagePriority(message, 'high');
 * ```
 */
export declare const setMessagePriority: (message: IntegrationMessage, priority: MessageMetadata["priority"]) => IntegrationMessage;
/**
 * Compares message priority for queue ordering.
 *
 * @param {IntegrationMessage} msg1 - First message
 * @param {IntegrationMessage} msg2 - Second message
 * @returns {number} Comparison result (-1, 0, 1)
 *
 * @example
 * ```typescript
 * messages.sort(compareMessagePriority);
 * ```
 */
export declare const compareMessagePriority: (msg1: IntegrationMessage, msg2: IntegrationMessage) => number;
/**
 * Checks if message has expired based on TTL.
 *
 * @param {IntegrationMessage} message - Integration message
 * @returns {boolean} True if message has expired
 *
 * @example
 * ```typescript
 * if (isMessageExpired(message)) {
 *   // Handle expired message
 * }
 * ```
 */
export declare const isMessageExpired: (message: IntegrationMessage) => boolean;
/**
 * Creates batch from individual messages.
 *
 * @param {IntegrationMessage[]} messages - Messages to batch
 * @param {number} [maxBatchSize] - Maximum batch size
 * @returns {IntegrationMessage[]} Batched messages
 *
 * @example
 * ```typescript
 * const batches = createMessageBatch(messages, 100);
 * ```
 */
export declare const createMessageBatch: (messages: IntegrationMessage[], maxBatchSize?: number) => IntegrationMessage[];
/**
 * Unpacks batch message into individual messages.
 *
 * @param {IntegrationMessage} batchMessage - Batch message
 * @returns {IntegrationMessage[]} Individual messages
 *
 * @example
 * ```typescript
 * const individual = unpackMessageBatch(batchMessage);
 * ```
 */
export declare const unpackMessageBatch: (batchMessage: IntegrationMessage) => IntegrationMessage[];
/**
 * Validates message structure and required fields.
 *
 * @param {IntegrationMessage} message - Message to validate
 * @returns {boolean} True if valid
 * @throws {Error} If validation fails
 *
 * @example
 * ```typescript
 * validateMessageStructure(message);
 * ```
 */
export declare const validateMessageStructure: (message: IntegrationMessage) => boolean;
/**
 * Creates canonical data model definition.
 *
 * @param {string} modelName - Model name
 * @param {string} version - Model version
 * @param {string} namespace - Model namespace
 * @param {Record<string, any>} schema - Schema definition
 * @returns {CanonicalDataModel} Canonical data model
 *
 * @example
 * ```typescript
 * const model = createCanonicalModel('Patient', '1.0', 'com.healthcare', schemaDefinition);
 * ```
 */
export declare const createCanonicalModel: (modelName: string, version: string, namespace: string, schema: Record<string, any>) => CanonicalDataModel;
/**
 * Creates service orchestration configuration.
 *
 * @param {string} orchestrationId - Orchestration identifier
 * @param {ServiceStep[]} services - Service steps
 * @param {Partial<ServiceOrchestration>} [config] - Additional configuration
 * @returns {ServiceOrchestration} Service orchestration configuration
 *
 * @example
 * ```typescript
 * const orchestration = createServiceOrchestration('patient-workflow', serviceSteps, {
 *   compensationEnabled: true,
 *   transactionBoundary: 'global',
 *   timeoutMs: 30000
 * });
 * ```
 */
export declare const createServiceOrchestration: (orchestrationId: string, services: ServiceStep[], config?: Partial<ServiceOrchestration>) => ServiceOrchestration;
/**
 * Creates message broker configuration for integration.
 *
 * @param {MessageBrokerConfig['brokerType']} brokerType - Broker type
 * @param {string} connectionUrl - Connection URL
 * @param {Partial<MessageBrokerConfig>} [config] - Additional configuration
 * @returns {MessageBrokerConfig} Message broker configuration
 *
 * @example
 * ```typescript
 * const brokerConfig = createMessageBroker('KAFKA', 'localhost:9092', {
 *   topicName: 'patient-events',
 *   credentials: { username: 'admin', password: 'secret' }
 * });
 * ```
 */
export declare const createMessageBroker: (brokerType: MessageBrokerConfig["brokerType"], connectionUrl: string, config?: Partial<MessageBrokerConfig>) => MessageBrokerConfig;
/**
 * Creates data mapping configuration for transformation.
 *
 * @param {string} mappingId - Mapping identifier
 * @param {string} sourceSchema - Source schema identifier
 * @param {string} targetSchema - Target schema identifier
 * @param {FieldMapping[]} fieldMappings - Field mappings
 * @returns {DataMapping} Data mapping configuration
 *
 * @example
 * ```typescript
 * const mapping = createDataMapping(
 *   'ehr-to-fhir',
 *   'EHR_PATIENT_V1',
 *   'FHIR_PATIENT_R4',
 *   fieldMappings
 * );
 * ```
 */
export declare const createDataMapping: (mappingId: string, sourceSchema: string, targetSchema: string, fieldMappings: FieldMapping[]) => DataMapping;
declare const _default: {
    createIntegrationMessage: <T>(payload: T, source: string, destination: string, messageType: string, metadata?: Partial<MessageMetadata>) => IntegrationMessage<T>;
    generateMessageId: () => string;
    generateCorrelationId: () => string;
    cloneMessageWithPayload: <T>(original: IntegrationMessage, newPayload: T) => IntegrationMessage<T>;
    addMessageHeader: (message: IntegrationMessage, key: string, value: any) => IntegrationMessage;
    getMessageHeader: (message: IntegrationMessage, key: string, defaultValue?: any) => any;
    applyTransformationRules: (message: IntegrationMessage, rules: TransformationRule[]) => IntegrationMessage;
    createTypeConversionRule: (sourceField: string, targetField: string, targetType: "string" | "number" | "boolean" | "date") => TransformationRule;
    createConditionalRule: (sourceField: string, targetField: string, condition: (source: any) => boolean, transformFunction?: (value: any) => any) => TransformationRule;
    transformToCanonical: (message: IntegrationMessage, canonicalModel: CanonicalDataModel) => IntegrationMessage;
    transformFromCanonical: (canonicalMessage: IntegrationMessage, targetRules: TransformationRule[]) => IntegrationMessage;
    createContentBasedRouter: (routerId: string, routes: RoutingRule[], defaultRoute?: string) => ContentBasedRouter;
    routeMessage: (message: IntegrationMessage, router: ContentBasedRouter) => string;
    createMessageTypeRoutingRule: (messageType: string, destination: string, priority?: number) => RoutingRule;
    createContentRoutingRule: (fieldPath: string, expectedValue: any, destination: string, priority?: number) => RoutingRule;
    createHeaderRoutingRule: (headerKey: string, expectedValue: any, destination: string) => RoutingRule;
    enrichMessage: (message: IntegrationMessage, strategy: EnrichmentStrategy) => Promise<IntegrationMessage>;
    createLookupEnrichment: (source: string, lookupFunction: (key: string) => Promise<any>, keyField: string) => EnrichmentStrategy;
    createAggregateEnrichment: (strategies: EnrichmentStrategy[]) => EnrichmentStrategy;
    createCachedEnrichment: (baseStrategy: EnrichmentStrategy, cacheConfig: CacheConfiguration) => EnrichmentStrategy;
    createRESTAdapter: (endpoint: string, method?: string, config?: Record<string, any>) => ProtocolAdapter;
    createSOAPAdapter: (soapConfig: SOAPAdapter) => ProtocolAdapter;
    createGRPCAdapter: (grpcConfig: GRPCAdapter) => ProtocolAdapter;
    adaptToProtocol: (message: IntegrationMessage, adapter: ProtocolAdapter) => any;
    adaptFromProtocol: (response: any, adapter: ProtocolAdapter) => IntegrationMessage;
    createMessageFilter: (filterId: string, condition: (message: IntegrationMessage) => boolean, action?: "accept" | "reject" | "transform") => MessageFilter;
    applyFilter: (message: IntegrationMessage, filter: MessageFilter) => boolean;
    createFilterChain: (filters: MessageFilter[], logic?: "AND" | "OR") => ((message: IntegrationMessage) => boolean);
    createIntegrationError: (errorCode: string, errorMessage: string, errorType: IntegrationError["errorType"], originalMessage?: IntegrationMessage) => IntegrationError;
    createErrorStrategy: (strategyType: ErrorHandlingStrategy["strategyType"], config?: Partial<ErrorHandlingStrategy>) => ErrorHandlingStrategy;
    handleIntegrationError: (error: IntegrationError, strategy: ErrorHandlingStrategy) => Promise<void>;
    validateAgainstRules: (payload: any, rules: ValidationRule[]) => boolean;
    splitMessage: <T>(message: IntegrationMessage<T[]>, pattern: SplitAggregatePattern) => IntegrationMessage[];
    aggregateMessages: (messages: IntegrationMessage[], pattern: SplitAggregatePattern) => IntegrationMessage | null;
    setMessagePriority: (message: IntegrationMessage, priority: MessageMetadata["priority"]) => IntegrationMessage;
    compareMessagePriority: (msg1: IntegrationMessage, msg2: IntegrationMessage) => number;
    isMessageExpired: (message: IntegrationMessage) => boolean;
    createMessageBatch: (messages: IntegrationMessage[], maxBatchSize?: number) => IntegrationMessage[];
    unpackMessageBatch: (batchMessage: IntegrationMessage) => IntegrationMessage[];
    validateMessageStructure: (message: IntegrationMessage) => boolean;
    createCanonicalModel: (modelName: string, version: string, namespace: string, schema: Record<string, any>) => CanonicalDataModel;
    createServiceOrchestration: (orchestrationId: string, services: ServiceStep[], config?: Partial<ServiceOrchestration>) => ServiceOrchestration;
    createMessageBroker: (brokerType: MessageBrokerConfig["brokerType"], connectionUrl: string, config?: Partial<MessageBrokerConfig>) => MessageBrokerConfig;
    createDataMapping: (mappingId: string, sourceSchema: string, targetSchema: string, fieldMappings: FieldMapping[]) => DataMapping;
    getNestedValue: (obj: any, path: string) => any;
    setNestedValue: (obj: any, path: string, value: any) => void;
};
export default _default;
//# sourceMappingURL=typescript-oracle-integration-kit.d.ts.map