"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDataMapping = exports.createMessageBroker = exports.createServiceOrchestration = exports.createCanonicalModel = exports.validateMessageStructure = exports.unpackMessageBatch = exports.createMessageBatch = exports.isMessageExpired = exports.compareMessagePriority = exports.setMessagePriority = exports.setNestedValue = exports.getNestedValue = exports.aggregateMessages = exports.splitMessage = exports.validateAgainstRules = exports.handleIntegrationError = exports.createErrorStrategy = exports.createIntegrationError = exports.createFilterChain = exports.applyFilter = exports.createMessageFilter = exports.adaptFromProtocol = exports.adaptToProtocol = exports.createGRPCAdapter = exports.createSOAPAdapter = exports.createRESTAdapter = exports.createCachedEnrichment = exports.createAggregateEnrichment = exports.createLookupEnrichment = exports.enrichMessage = exports.createHeaderRoutingRule = exports.createContentRoutingRule = exports.createMessageTypeRoutingRule = exports.routeMessage = exports.createContentBasedRouter = exports.transformFromCanonical = exports.transformToCanonical = exports.createConditionalRule = exports.createTypeConversionRule = exports.applyTransformationRules = exports.getMessageHeader = exports.addMessageHeader = exports.cloneMessageWithPayload = exports.generateCorrelationId = exports.generateMessageId = exports.createIntegrationMessage = void 0;
// ============================================================================
// MESSAGE CREATION AND MANIPULATION
// ============================================================================
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
const createIntegrationMessage = (payload, source, destination, messageType, metadata) => {
    return {
        messageId: (0, exports.generateMessageId)(),
        correlationId: (0, exports.generateCorrelationId)(),
        timestamp: new Date(),
        source,
        destination,
        messageType,
        payload,
        headers: {},
        metadata: {
            priority: 'normal',
            contentType: 'application/json',
            encoding: 'utf-8',
            ...metadata,
        },
    };
};
exports.createIntegrationMessage = createIntegrationMessage;
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
const generateMessageId = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `MSG-${timestamp}-${random.toUpperCase()}`;
};
exports.generateMessageId = generateMessageId;
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
const generateCorrelationId = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `CORR-${timestamp}-${random.toUpperCase()}`;
};
exports.generateCorrelationId = generateCorrelationId;
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
const cloneMessageWithPayload = (original, newPayload) => {
    return {
        ...original,
        messageId: (0, exports.generateMessageId)(),
        payload: newPayload,
        headers: { ...original.headers },
        metadata: { ...original.metadata },
    };
};
exports.cloneMessageWithPayload = cloneMessageWithPayload;
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
const addMessageHeader = (message, key, value) => {
    return {
        ...message,
        headers: {
            ...message.headers,
            [key]: value,
        },
    };
};
exports.addMessageHeader = addMessageHeader;
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
const getMessageHeader = (message, key, defaultValue) => {
    return message.headers[key] !== undefined ? message.headers[key] : defaultValue;
};
exports.getMessageHeader = getMessageHeader;
// ============================================================================
// MESSAGE TRANSFORMATION
// ============================================================================
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
const applyTransformationRules = (message, rules) => {
    const transformedPayload = {};
    rules.forEach(rule => {
        // Check condition if specified
        if (rule.condition && !rule.condition(message.payload)) {
            return;
        }
        const sourceValue = (0, exports.getNestedValue)(message.payload, rule.sourceField);
        if (sourceValue !== undefined) {
            const transformedValue = rule.transformFunction
                ? rule.transformFunction(sourceValue)
                : sourceValue;
            (0, exports.setNestedValue)(transformedPayload, rule.targetField, transformedValue);
        }
        else if (rule.defaultValue !== undefined) {
            (0, exports.setNestedValue)(transformedPayload, rule.targetField, rule.defaultValue);
        }
        else if (rule.required) {
            throw new Error(`Required field ${rule.sourceField} is missing`);
        }
    });
    return (0, exports.cloneMessageWithPayload)(message, transformedPayload);
};
exports.applyTransformationRules = applyTransformationRules;
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
const createTypeConversionRule = (sourceField, targetField, targetType) => {
    const conversionFunctions = {
        string: (val) => String(val),
        number: (val) => Number(val),
        boolean: (val) => Boolean(val),
        date: (val) => new Date(val),
    };
    return {
        sourceField,
        targetField,
        transformFunction: conversionFunctions[targetType],
    };
};
exports.createTypeConversionRule = createTypeConversionRule;
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
const createConditionalRule = (sourceField, targetField, condition, transformFunction) => {
    return {
        sourceField,
        targetField,
        condition,
        transformFunction,
    };
};
exports.createConditionalRule = createConditionalRule;
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
const transformToCanonical = (message, canonicalModel) => {
    // Validate against schema
    if (canonicalModel.validationRules) {
        (0, exports.validateAgainstRules)(message.payload, canonicalModel.validationRules);
    }
    const canonicalPayload = {
        __canonical: true,
        __model: canonicalModel.modelName,
        __version: canonicalModel.version,
        __namespace: canonicalModel.namespace,
        ...message.payload,
    };
    return (0, exports.cloneMessageWithPayload)(message, canonicalPayload);
};
exports.transformToCanonical = transformToCanonical;
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
const transformFromCanonical = (canonicalMessage, targetRules) => {
    return (0, exports.applyTransformationRules)(canonicalMessage, targetRules);
};
exports.transformFromCanonical = transformFromCanonical;
// ============================================================================
// CONTENT-BASED ROUTING
// ============================================================================
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
const createContentBasedRouter = (routerId, routes, defaultRoute) => {
    return {
        routerId,
        routes: routes.sort((a, b) => b.priority - a.priority),
        defaultRoute,
        errorRoute: 'error-queue',
        auditEnabled: true,
    };
};
exports.createContentBasedRouter = createContentBasedRouter;
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
const routeMessage = (message, router) => {
    // Find first matching enabled route
    for (const route of router.routes) {
        if (route.enabled && route.condition(message)) {
            if (router.auditEnabled) {
                auditRouting(message, route.destination, route.ruleId);
            }
            return route.destination;
        }
    }
    // Use default route if no match
    if (router.defaultRoute) {
        return router.defaultRoute;
    }
    throw new Error(`No routing rule matched and no default route configured for message ${message.messageId}`);
};
exports.routeMessage = routeMessage;
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
const createMessageTypeRoutingRule = (messageType, destination, priority = 100) => {
    return {
        ruleId: `route-${messageType.toLowerCase()}`,
        name: `Route ${messageType}`,
        priority,
        condition: (message) => message.messageType === messageType,
        destination,
        enabled: true,
    };
};
exports.createMessageTypeRoutingRule = createMessageTypeRoutingRule;
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
const createContentRoutingRule = (fieldPath, expectedValue, destination, priority = 100) => {
    return {
        ruleId: `route-${fieldPath}-${expectedValue}`,
        name: `Route based on ${fieldPath}`,
        priority,
        condition: (message) => {
            const value = (0, exports.getNestedValue)(message.payload, fieldPath);
            return value === expectedValue;
        },
        destination,
        enabled: true,
    };
};
exports.createContentRoutingRule = createContentRoutingRule;
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
const createHeaderRoutingRule = (headerKey, expectedValue, destination) => {
    return {
        ruleId: `route-header-${headerKey}`,
        name: `Route by header ${headerKey}`,
        priority: 100,
        condition: (message) => message.headers[headerKey] === expectedValue,
        destination,
        enabled: true,
    };
};
exports.createHeaderRoutingRule = createHeaderRoutingRule;
// ============================================================================
// MESSAGE ENRICHMENT
// ============================================================================
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
const enrichMessage = async (message, strategy) => {
    try {
        const enrichmentData = await strategy.enrichFunction(message);
        const enrichedPayload = {
            ...message.payload,
            __enriched: true,
            __enrichmentSource: strategy.source,
            ...enrichmentData,
        };
        return (0, exports.cloneMessageWithPayload)(message, enrichedPayload);
    }
    catch (error) {
        console.error('Message enrichment failed:', error);
        // Return original message if enrichment fails
        return message;
    }
};
exports.enrichMessage = enrichMessage;
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
const createLookupEnrichment = (source, lookupFunction, keyField) => {
    return {
        strategyType: 'lookup',
        source,
        enrichFields: [],
        enrichFunction: async (message) => {
            const key = (0, exports.getNestedValue)(message.payload, keyField);
            if (!key)
                throw new Error(`Lookup key field ${keyField} not found`);
            return await lookupFunction(key);
        },
    };
};
exports.createLookupEnrichment = createLookupEnrichment;
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
const createAggregateEnrichment = (strategies) => {
    return {
        strategyType: 'aggregate',
        source: 'multiple',
        enrichFields: strategies.flatMap(s => s.enrichFields),
        enrichFunction: async (message) => {
            const results = await Promise.all(strategies.map(strategy => strategy.enrichFunction(message)));
            return results.reduce((acc, result) => ({ ...acc, ...result }), {});
        },
    };
};
exports.createAggregateEnrichment = createAggregateEnrichment;
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
const createCachedEnrichment = (baseStrategy, cacheConfig) => {
    const cache = new Map();
    return {
        ...baseStrategy,
        cacheConfig,
        enrichFunction: async (message) => {
            if (!cacheConfig.enabled) {
                return await baseStrategy.enrichFunction(message);
            }
            const cacheKey = interpolateCacheKey(cacheConfig.keyPattern, message.payload);
            const cached = cache.get(cacheKey);
            if (cached && Date.now() < cached.expiry) {
                return cached.data;
            }
            const data = await baseStrategy.enrichFunction(message);
            cache.set(cacheKey, {
                data,
                expiry: Date.now() + (cacheConfig.ttl * 1000),
            });
            return data;
        },
    };
};
exports.createCachedEnrichment = createCachedEnrichment;
// ============================================================================
// PROTOCOL ADAPTERS
// ============================================================================
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
const createRESTAdapter = (endpoint, method = 'POST', config) => {
    return {
        protocol: 'REST',
        endpoint,
        configuration: { method, ...config },
        transformRequest: (message) => ({
            url: endpoint,
            method,
            headers: {
                'Content-Type': 'application/json',
                ...message.headers,
                ...(config?.headers || {}),
            },
            body: JSON.stringify(message.payload),
        }),
        transformResponse: (response) => {
            const data = typeof response === 'string' ? JSON.parse(response) : response;
            return (0, exports.createIntegrationMessage)(data, endpoint, 'response', 'REST_RESPONSE');
        },
    };
};
exports.createRESTAdapter = createRESTAdapter;
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
const createSOAPAdapter = (soapConfig) => {
    return {
        protocol: 'SOAP',
        endpoint: soapConfig.wsdlUrl,
        configuration: soapConfig,
        transformRequest: (message) => {
            const soapEnvelope = buildSOAPEnvelope(message.payload, soapConfig.namespace, soapConfig.operation, soapConfig.soapVersion);
            return {
                url: soapConfig.wsdlUrl,
                method: 'POST',
                headers: {
                    'Content-Type': `application/soap+xml; charset=utf-8`,
                    'SOAPAction': `${soapConfig.namespace}/${soapConfig.operation}`,
                },
                body: soapEnvelope,
            };
        },
        transformResponse: (response) => {
            const parsedResponse = parseSOAPResponse(response);
            return (0, exports.createIntegrationMessage)(parsedResponse, soapConfig.wsdlUrl, 'response', 'SOAP_RESPONSE');
        },
    };
};
exports.createSOAPAdapter = createSOAPAdapter;
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
const createGRPCAdapter = (grpcConfig) => {
    return {
        protocol: 'gRPC',
        endpoint: grpcConfig.serverUrl,
        configuration: grpcConfig,
        transformRequest: (message) => ({
            service: grpcConfig.serviceName,
            method: grpcConfig.methodName,
            request: message.payload,
            metadata: grpcConfig.metadata || {},
        }),
        transformResponse: (response) => {
            return (0, exports.createIntegrationMessage)(response, grpcConfig.serverUrl, 'response', 'GRPC_RESPONSE');
        },
    };
};
exports.createGRPCAdapter = createGRPCAdapter;
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
const adaptToProtocol = (message, adapter) => {
    return adapter.transformRequest(message);
};
exports.adaptToProtocol = adaptToProtocol;
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
const adaptFromProtocol = (response, adapter) => {
    return adapter.transformResponse(response);
};
exports.adaptFromProtocol = adaptFromProtocol;
// ============================================================================
// MESSAGE FILTERING
// ============================================================================
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
const createMessageFilter = (filterId, condition, action = 'accept') => {
    return {
        filterId,
        filterType: 'content',
        condition,
        action,
    };
};
exports.createMessageFilter = createMessageFilter;
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
const applyFilter = (message, filter) => {
    const matches = filter.condition(message);
    if (filter.action === 'accept') {
        return matches;
    }
    else if (filter.action === 'reject') {
        return !matches;
    }
    return true;
};
exports.applyFilter = applyFilter;
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
const createFilterChain = (filters, logic = 'AND') => {
    return (message) => {
        const results = filters.map(filter => (0, exports.applyFilter)(message, filter));
        if (logic === 'AND') {
            return results.every(r => r === true);
        }
        else {
            return results.some(r => r === true);
        }
    };
};
exports.createFilterChain = createFilterChain;
// ============================================================================
// ERROR HANDLING
// ============================================================================
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
const createIntegrationError = (errorCode, errorMessage, errorType, originalMessage) => {
    return {
        errorCode,
        errorMessage,
        errorType,
        severity: errorType === 'system' ? 'critical' : 'error',
        recoverable: errorType !== 'system',
        originalMessage,
        timestamp: new Date(),
    };
};
exports.createIntegrationError = createIntegrationError;
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
const createErrorStrategy = (strategyType, config) => {
    return {
        strategyType,
        maxRetries: 3,
        retryDelay: 1000,
        deadLetterQueue: 'dlq-errors',
        alertChannels: ['email', 'slack'],
        ...config,
    };
};
exports.createErrorStrategy = createErrorStrategy;
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
const handleIntegrationError = async (error, strategy) => {
    console.error(`Integration error [${error.errorCode}]: ${error.errorMessage}`);
    switch (strategy.strategyType) {
        case 'retry':
            // Implement retry logic
            break;
        case 'dead-letter':
            // Send to dead letter queue
            await sendToDeadLetterQueue(error, strategy.deadLetterQueue);
            break;
        case 'compensate':
            if (strategy.compensationHandler) {
                await strategy.compensationHandler(error);
            }
            break;
        case 'alert':
            await sendErrorAlert(error, strategy.alertChannels);
            break;
        case 'ignore':
            // Log and ignore
            break;
    }
};
exports.handleIntegrationError = handleIntegrationError;
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
const validateAgainstRules = (payload, rules) => {
    for (const rule of rules) {
        const value = (0, exports.getNestedValue)(payload, rule.field);
        if (rule.type === 'required' && (value === undefined || value === null)) {
            throw new Error(rule.errorMessage || `Field ${rule.field} is required`);
        }
        if (rule.type === 'format' && value !== undefined) {
            const regex = new RegExp(rule.rule);
            if (!regex.test(value)) {
                throw new Error(rule.errorMessage || `Field ${rule.field} format is invalid`);
            }
        }
        if (rule.type === 'range' && value !== undefined) {
            const { min, max } = rule.rule;
            if ((min !== undefined && value < min) || (max !== undefined && value > max)) {
                throw new Error(rule.errorMessage || `Field ${rule.field} is out of range`);
            }
        }
    }
    return true;
};
exports.validateAgainstRules = validateAgainstRules;
// ============================================================================
// SPLIT-AGGREGATE PATTERN
// ============================================================================
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
const splitMessage = (message, pattern) => {
    const items = Array.isArray(message.payload) ? message.payload : [message.payload];
    const splitMessages = [];
    const correlationId = message.correlationId || (0, exports.generateCorrelationId)();
    if (pattern.splitStrategy === 'fixed-size' && pattern.partitionSize) {
        for (let i = 0; i < items.length; i += pattern.partitionSize) {
            const chunk = items.slice(i, i + pattern.partitionSize);
            const splitMsg = (0, exports.cloneMessageWithPayload)(message, chunk);
            splitMsg.correlationId = correlationId;
            splitMsg.headers['split-index'] = i / pattern.partitionSize;
            splitMsg.headers['split-total'] = Math.ceil(items.length / pattern.partitionSize);
            splitMessages.push(splitMsg);
        }
    }
    else {
        // Split each item individually
        items.forEach((item, index) => {
            const splitMsg = (0, exports.cloneMessageWithPayload)(message, item);
            splitMsg.correlationId = correlationId;
            splitMsg.headers['split-index'] = index;
            splitMsg.headers['split-total'] = items.length;
            splitMessages.push(splitMsg);
        });
    }
    return splitMessages;
};
exports.splitMessage = splitMessage;
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
const aggregateMessages = (messages, pattern) => {
    if (messages.length === 0)
        return null;
    if (pattern.aggregationStrategy === 'first') {
        return messages[0];
    }
    if (pattern.aggregationStrategy === 'all') {
        const expectedTotal = messages[0]?.headers['split-total'];
        if (messages.length < expectedTotal) {
            return null; // Not all messages received yet
        }
        const sortedMessages = messages.sort((a, b) => a.headers['split-index'] - b.headers['split-index']);
        const aggregatedPayload = sortedMessages.map(msg => msg.payload);
        return (0, exports.cloneMessageWithPayload)(messages[0], aggregatedPayload);
    }
    return null;
};
exports.aggregateMessages = aggregateMessages;
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
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
const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
};
exports.getNestedValue = getNestedValue;
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
const setNestedValue = (obj, path, value) => {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((current, key) => {
        if (!current[key])
            current[key] = {};
        return current[key];
    }, obj);
    target[lastKey] = value;
};
exports.setNestedValue = setNestedValue;
/**
 * Builds SOAP envelope for SOAP request.
 *
 * @param {any} payload - Request payload
 * @param {string} namespace - SOAP namespace
 * @param {string} operation - SOAP operation
 * @param {string} soapVersion - SOAP version
 * @returns {string} SOAP envelope XML
 */
const buildSOAPEnvelope = (payload, namespace, operation, soapVersion) => {
    const soapNS = soapVersion === '1.2'
        ? 'http://www.w3.org/2003/05/soap-envelope'
        : 'http://schemas.xmlsoap.org/soap/envelope/';
    return `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="${soapNS}" xmlns:ns="${namespace}">
  <soap:Header/>
  <soap:Body>
    <ns:${operation}>
      ${objectToXML(payload)}
    </ns:${operation}>
  </soap:Body>
</soap:Envelope>`;
};
/**
 * Parses SOAP response XML.
 *
 * @param {string} soapResponse - SOAP response XML
 * @returns {any} Parsed response
 */
const parseSOAPResponse = (soapResponse) => {
    // Simplified SOAP parsing - in production use proper XML parser
    return { response: soapResponse };
};
/**
 * Converts object to XML.
 *
 * @param {any} obj - Object to convert
 * @returns {string} XML string
 */
const objectToXML = (obj) => {
    return Object.entries(obj)
        .map(([key, value]) => `<${key}>${value}</${key}>`)
        .join('\n      ');
};
/**
 * Interpolates cache key pattern with values.
 *
 * @param {string} pattern - Cache key pattern
 * @param {any} data - Data for interpolation
 * @returns {string} Interpolated cache key
 */
const interpolateCacheKey = (pattern, data) => {
    return pattern.replace(/\{(\w+)\}/g, (_, key) => {
        return (0, exports.getNestedValue)(data, key) || key;
    });
};
/**
 * Sends error to dead letter queue.
 *
 * @param {IntegrationError} error - Integration error
 * @param {string} queueName - Dead letter queue name
 * @returns {Promise<void>}
 */
const sendToDeadLetterQueue = async (error, queueName) => {
    console.log(`Sending error to DLQ: ${queueName}`, error);
    // Implementation would send to actual queue
};
/**
 * Sends error alert to configured channels.
 *
 * @param {IntegrationError} error - Integration error
 * @param {string[]} channels - Alert channels
 * @returns {Promise<void>}
 */
const sendErrorAlert = async (error, channels) => {
    console.log(`Sending alert to channels: ${channels.join(', ')}`, error);
    // Implementation would send to actual alert channels
};
/**
 * Audits message routing for compliance.
 *
 * @param {IntegrationMessage} message - Routed message
 * @param {string} destination - Destination route
 * @param {string} ruleId - Applied rule ID
 */
const auditRouting = (message, destination, ruleId) => {
    console.log(`[AUDIT] Message ${message.messageId} routed to ${destination} via rule ${ruleId}`);
    // Implementation would write to audit log
};
// ============================================================================
// MESSAGE PRIORITY AND ORDERING
// ============================================================================
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
const setMessagePriority = (message, priority) => {
    return {
        ...message,
        metadata: {
            ...message.metadata,
            priority,
        },
    };
};
exports.setMessagePriority = setMessagePriority;
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
const compareMessagePriority = (msg1, msg2) => {
    const priorityOrder = { critical: 4, high: 3, normal: 2, low: 1 };
    const p1 = priorityOrder[msg1.metadata?.priority || 'normal'];
    const p2 = priorityOrder[msg2.metadata?.priority || 'normal'];
    return p2 - p1; // Higher priority first
};
exports.compareMessagePriority = compareMessagePriority;
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
const isMessageExpired = (message) => {
    if (!message.metadata?.ttl)
        return false;
    const ageMs = Date.now() - message.timestamp.getTime();
    return ageMs > (message.metadata.ttl * 1000);
};
exports.isMessageExpired = isMessageExpired;
// ============================================================================
// MESSAGE BATCHING
// ============================================================================
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
const createMessageBatch = (messages, maxBatchSize = 100) => {
    const batches = [];
    for (let i = 0; i < messages.length; i += maxBatchSize) {
        const chunk = messages.slice(i, i + maxBatchSize);
        const batchMessage = (0, exports.createIntegrationMessage)(chunk.map(m => m.payload), chunk[0].source, chunk[0].destination, 'BATCH_MESSAGE');
        batchMessage.headers['batch-size'] = chunk.length;
        batchMessage.headers['batch-index'] = i / maxBatchSize;
        batches.push(batchMessage);
    }
    return batches;
};
exports.createMessageBatch = createMessageBatch;
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
const unpackMessageBatch = (batchMessage) => {
    if (!Array.isArray(batchMessage.payload)) {
        return [batchMessage];
    }
    return batchMessage.payload.map((payload, index) => {
        const msg = (0, exports.cloneMessageWithPayload)(batchMessage, payload);
        msg.headers['batch-origin'] = batchMessage.messageId;
        msg.headers['batch-position'] = index;
        return msg;
    });
};
exports.unpackMessageBatch = unpackMessageBatch;
// ============================================================================
// MESSAGE VALIDATION
// ============================================================================
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
const validateMessageStructure = (message) => {
    if (!message.messageId)
        throw new Error('Message ID is required');
    if (!message.source)
        throw new Error('Message source is required');
    if (!message.destination)
        throw new Error('Message destination is required');
    if (!message.messageType)
        throw new Error('Message type is required');
    if (message.payload === undefined)
        throw new Error('Message payload is required');
    return true;
};
exports.validateMessageStructure = validateMessageStructure;
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
const createCanonicalModel = (modelName, version, namespace, schema) => {
    return {
        modelName,
        version,
        namespace,
        schema,
        validationRules: [],
    };
};
exports.createCanonicalModel = createCanonicalModel;
// ============================================================================
// SERVICE ORCHESTRATION
// ============================================================================
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
const createServiceOrchestration = (orchestrationId, services, config) => {
    return {
        orchestrationId,
        services,
        compensationEnabled: false,
        transactionBoundary: 'local',
        timeoutMs: 30000,
        ...config,
    };
};
exports.createServiceOrchestration = createServiceOrchestration;
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
const createMessageBroker = (brokerType, connectionUrl, config) => {
    return {
        brokerType,
        connectionUrl,
        ...config,
    };
};
exports.createMessageBroker = createMessageBroker;
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
const createDataMapping = (mappingId, sourceSchema, targetSchema, fieldMappings) => {
    return {
        mappingId,
        sourceSchema,
        targetSchema,
        fieldMappings,
        transformations: [],
    };
};
exports.createDataMapping = createDataMapping;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Message creation and manipulation
    createIntegrationMessage: exports.createIntegrationMessage,
    generateMessageId: exports.generateMessageId,
    generateCorrelationId: exports.generateCorrelationId,
    cloneMessageWithPayload: exports.cloneMessageWithPayload,
    addMessageHeader: exports.addMessageHeader,
    getMessageHeader: exports.getMessageHeader,
    // Message transformation
    applyTransformationRules: exports.applyTransformationRules,
    createTypeConversionRule: exports.createTypeConversionRule,
    createConditionalRule: exports.createConditionalRule,
    transformToCanonical: exports.transformToCanonical,
    transformFromCanonical: exports.transformFromCanonical,
    // Content-based routing
    createContentBasedRouter: exports.createContentBasedRouter,
    routeMessage: exports.routeMessage,
    createMessageTypeRoutingRule: exports.createMessageTypeRoutingRule,
    createContentRoutingRule: exports.createContentRoutingRule,
    createHeaderRoutingRule: exports.createHeaderRoutingRule,
    // Message enrichment
    enrichMessage: exports.enrichMessage,
    createLookupEnrichment: exports.createLookupEnrichment,
    createAggregateEnrichment: exports.createAggregateEnrichment,
    createCachedEnrichment: exports.createCachedEnrichment,
    // Protocol adapters
    createRESTAdapter: exports.createRESTAdapter,
    createSOAPAdapter: exports.createSOAPAdapter,
    createGRPCAdapter: exports.createGRPCAdapter,
    adaptToProtocol: exports.adaptToProtocol,
    adaptFromProtocol: exports.adaptFromProtocol,
    // Message filtering
    createMessageFilter: exports.createMessageFilter,
    applyFilter: exports.applyFilter,
    createFilterChain: exports.createFilterChain,
    // Error handling
    createIntegrationError: exports.createIntegrationError,
    createErrorStrategy: exports.createErrorStrategy,
    handleIntegrationError: exports.handleIntegrationError,
    validateAgainstRules: exports.validateAgainstRules,
    // Split-aggregate pattern
    splitMessage: exports.splitMessage,
    aggregateMessages: exports.aggregateMessages,
    // Message priority and ordering
    setMessagePriority: exports.setMessagePriority,
    compareMessagePriority: exports.compareMessagePriority,
    isMessageExpired: exports.isMessageExpired,
    // Message batching
    createMessageBatch: exports.createMessageBatch,
    unpackMessageBatch: exports.unpackMessageBatch,
    // Message validation
    validateMessageStructure: exports.validateMessageStructure,
    createCanonicalModel: exports.createCanonicalModel,
    // Service orchestration
    createServiceOrchestration: exports.createServiceOrchestration,
    createMessageBroker: exports.createMessageBroker,
    createDataMapping: exports.createDataMapping,
    // Helper functions
    getNestedValue: exports.getNestedValue,
    setNestedValue: exports.setNestedValue,
};
//# sourceMappingURL=typescript-oracle-integration-kit.js.map