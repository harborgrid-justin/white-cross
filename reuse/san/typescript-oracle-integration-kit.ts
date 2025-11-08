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

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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
export const createIntegrationMessage = <T>(
  payload: T,
  source: string,
  destination: string,
  messageType: string,
  metadata?: Partial<MessageMetadata>,
): IntegrationMessage<T> => {
  return {
    messageId: generateMessageId(),
    correlationId: generateCorrelationId(),
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
export const generateMessageId = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `MSG-${timestamp}-${random.toUpperCase()}`;
};

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
export const generateCorrelationId = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `CORR-${timestamp}-${random.toUpperCase()}`;
};

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
export const cloneMessageWithPayload = <T>(
  original: IntegrationMessage,
  newPayload: T,
): IntegrationMessage<T> => {
  return {
    ...original,
    messageId: generateMessageId(),
    payload: newPayload,
    headers: { ...original.headers },
    metadata: { ...original.metadata },
  };
};

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
export const addMessageHeader = (
  message: IntegrationMessage,
  key: string,
  value: any,
): IntegrationMessage => {
  return {
    ...message,
    headers: {
      ...message.headers,
      [key]: value,
    },
  };
};

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
export const getMessageHeader = (
  message: IntegrationMessage,
  key: string,
  defaultValue?: any,
): any => {
  return message.headers[key] !== undefined ? message.headers[key] : defaultValue;
};

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
export const applyTransformationRules = (
  message: IntegrationMessage,
  rules: TransformationRule[],
): IntegrationMessage => {
  const transformedPayload: any = {};

  rules.forEach(rule => {
    // Check condition if specified
    if (rule.condition && !rule.condition(message.payload)) {
      return;
    }

    const sourceValue = getNestedValue(message.payload, rule.sourceField);

    if (sourceValue !== undefined) {
      const transformedValue = rule.transformFunction
        ? rule.transformFunction(sourceValue)
        : sourceValue;
      setNestedValue(transformedPayload, rule.targetField, transformedValue);
    } else if (rule.defaultValue !== undefined) {
      setNestedValue(transformedPayload, rule.targetField, rule.defaultValue);
    } else if (rule.required) {
      throw new Error(`Required field ${rule.sourceField} is missing`);
    }
  });

  return cloneMessageWithPayload(message, transformedPayload);
};

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
export const createTypeConversionRule = (
  sourceField: string,
  targetField: string,
  targetType: 'string' | 'number' | 'boolean' | 'date',
): TransformationRule => {
  const conversionFunctions: Record<string, (val: any) => any> = {
    string: (val: any) => String(val),
    number: (val: any) => Number(val),
    boolean: (val: any) => Boolean(val),
    date: (val: any) => new Date(val),
  };

  return {
    sourceField,
    targetField,
    transformFunction: conversionFunctions[targetType],
  };
};

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
export const createConditionalRule = (
  sourceField: string,
  targetField: string,
  condition: (source: any) => boolean,
  transformFunction?: (value: any) => any,
): TransformationRule => {
  return {
    sourceField,
    targetField,
    condition,
    transformFunction,
  };
};

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
export const transformToCanonical = (
  message: IntegrationMessage,
  canonicalModel: CanonicalDataModel,
): IntegrationMessage => {
  // Validate against schema
  if (canonicalModel.validationRules) {
    validateAgainstRules(message.payload, canonicalModel.validationRules);
  }

  const canonicalPayload = {
    __canonical: true,
    __model: canonicalModel.modelName,
    __version: canonicalModel.version,
    __namespace: canonicalModel.namespace,
    ...message.payload,
  };

  return cloneMessageWithPayload(message, canonicalPayload);
};

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
export const transformFromCanonical = (
  canonicalMessage: IntegrationMessage,
  targetRules: TransformationRule[],
): IntegrationMessage => {
  return applyTransformationRules(canonicalMessage, targetRules);
};

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
export const createContentBasedRouter = (
  routerId: string,
  routes: RoutingRule[],
  defaultRoute?: string,
): ContentBasedRouter => {
  return {
    routerId,
    routes: routes.sort((a, b) => b.priority - a.priority),
    defaultRoute,
    errorRoute: 'error-queue',
    auditEnabled: true,
  };
};

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
export const routeMessage = (
  message: IntegrationMessage,
  router: ContentBasedRouter,
): string => {
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
export const createMessageTypeRoutingRule = (
  messageType: string,
  destination: string,
  priority: number = 100,
): RoutingRule => {
  return {
    ruleId: `route-${messageType.toLowerCase()}`,
    name: `Route ${messageType}`,
    priority,
    condition: (message) => message.messageType === messageType,
    destination,
    enabled: true,
  };
};

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
export const createContentRoutingRule = (
  fieldPath: string,
  expectedValue: any,
  destination: string,
  priority: number = 100,
): RoutingRule => {
  return {
    ruleId: `route-${fieldPath}-${expectedValue}`,
    name: `Route based on ${fieldPath}`,
    priority,
    condition: (message) => {
      const value = getNestedValue(message.payload, fieldPath);
      return value === expectedValue;
    },
    destination,
    enabled: true,
  };
};

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
export const createHeaderRoutingRule = (
  headerKey: string,
  expectedValue: any,
  destination: string,
): RoutingRule => {
  return {
    ruleId: `route-header-${headerKey}`,
    name: `Route by header ${headerKey}`,
    priority: 100,
    condition: (message) => message.headers[headerKey] === expectedValue,
    destination,
    enabled: true,
  };
};

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
export const enrichMessage = async (
  message: IntegrationMessage,
  strategy: EnrichmentStrategy,
): Promise<IntegrationMessage> => {
  try {
    const enrichmentData = await strategy.enrichFunction(message);

    const enrichedPayload = {
      ...message.payload,
      __enriched: true,
      __enrichmentSource: strategy.source,
      ...enrichmentData,
    };

    return cloneMessageWithPayload(message, enrichedPayload);
  } catch (error) {
    console.error('Message enrichment failed:', error);
    // Return original message if enrichment fails
    return message;
  }
};

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
export const createLookupEnrichment = (
  source: string,
  lookupFunction: (key: string) => Promise<any>,
  keyField: string,
): EnrichmentStrategy => {
  return {
    strategyType: 'lookup',
    source,
    enrichFields: [],
    enrichFunction: async (message) => {
      const key = getNestedValue(message.payload, keyField);
      if (!key) throw new Error(`Lookup key field ${keyField} not found`);
      return await lookupFunction(key);
    },
  };
};

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
export const createAggregateEnrichment = (
  strategies: EnrichmentStrategy[],
): EnrichmentStrategy => {
  return {
    strategyType: 'aggregate',
    source: 'multiple',
    enrichFields: strategies.flatMap(s => s.enrichFields),
    enrichFunction: async (message) => {
      const results = await Promise.all(
        strategies.map(strategy => strategy.enrichFunction(message))
      );

      return results.reduce((acc, result) => ({ ...acc, ...result }), {});
    },
  };
};

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
export const createCachedEnrichment = (
  baseStrategy: EnrichmentStrategy,
  cacheConfig: CacheConfiguration,
): EnrichmentStrategy => {
  const cache = new Map<string, { data: any; expiry: number }>();

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
export const createRESTAdapter = (
  endpoint: string,
  method: string = 'POST',
  config?: Record<string, any>,
): ProtocolAdapter => {
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
      return createIntegrationMessage(
        data,
        endpoint,
        'response',
        'REST_RESPONSE'
      );
    },
  };
};

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
export const createSOAPAdapter = (soapConfig: SOAPAdapter): ProtocolAdapter => {
  return {
    protocol: 'SOAP',
    endpoint: soapConfig.wsdlUrl,
    configuration: soapConfig,
    transformRequest: (message) => {
      const soapEnvelope = buildSOAPEnvelope(
        message.payload,
        soapConfig.namespace,
        soapConfig.operation,
        soapConfig.soapVersion
      );

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
      return createIntegrationMessage(
        parsedResponse,
        soapConfig.wsdlUrl,
        'response',
        'SOAP_RESPONSE'
      );
    },
  };
};

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
export const createGRPCAdapter = (grpcConfig: GRPCAdapter): ProtocolAdapter => {
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
      return createIntegrationMessage(
        response,
        grpcConfig.serverUrl,
        'response',
        'GRPC_RESPONSE'
      );
    },
  };
};

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
export const adaptToProtocol = (
  message: IntegrationMessage,
  adapter: ProtocolAdapter,
): any => {
  return adapter.transformRequest(message);
};

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
export const adaptFromProtocol = (
  response: any,
  adapter: ProtocolAdapter,
): IntegrationMessage => {
  return adapter.transformResponse(response);
};

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
export const createMessageFilter = (
  filterId: string,
  condition: (message: IntegrationMessage) => boolean,
  action: 'accept' | 'reject' | 'transform' = 'accept',
): MessageFilter => {
  return {
    filterId,
    filterType: 'content',
    condition,
    action,
  };
};

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
export const applyFilter = (
  message: IntegrationMessage,
  filter: MessageFilter,
): boolean => {
  const matches = filter.condition(message);

  if (filter.action === 'accept') {
    return matches;
  } else if (filter.action === 'reject') {
    return !matches;
  }

  return true;
};

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
export const createFilterChain = (
  filters: MessageFilter[],
  logic: 'AND' | 'OR' = 'AND',
): ((message: IntegrationMessage) => boolean) => {
  return (message: IntegrationMessage) => {
    const results = filters.map(filter => applyFilter(message, filter));

    if (logic === 'AND') {
      return results.every(r => r === true);
    } else {
      return results.some(r => r === true);
    }
  };
};

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
export const createIntegrationError = (
  errorCode: string,
  errorMessage: string,
  errorType: IntegrationError['errorType'],
  originalMessage?: IntegrationMessage,
): IntegrationError => {
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
export const createErrorStrategy = (
  strategyType: ErrorHandlingStrategy['strategyType'],
  config?: Partial<ErrorHandlingStrategy>,
): ErrorHandlingStrategy => {
  return {
    strategyType,
    maxRetries: 3,
    retryDelay: 1000,
    deadLetterQueue: 'dlq-errors',
    alertChannels: ['email', 'slack'],
    ...config,
  };
};

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
export const handleIntegrationError = async (
  error: IntegrationError,
  strategy: ErrorHandlingStrategy,
): Promise<void> => {
  console.error(`Integration error [${error.errorCode}]: ${error.errorMessage}`);

  switch (strategy.strategyType) {
    case 'retry':
      // Implement retry logic
      break;
    case 'dead-letter':
      // Send to dead letter queue
      await sendToDeadLetterQueue(error, strategy.deadLetterQueue!);
      break;
    case 'compensate':
      if (strategy.compensationHandler) {
        await strategy.compensationHandler(error);
      }
      break;
    case 'alert':
      await sendErrorAlert(error, strategy.alertChannels!);
      break;
    case 'ignore':
      // Log and ignore
      break;
  }
};

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
export const validateAgainstRules = (payload: any, rules: ValidationRule[]): boolean => {
  for (const rule of rules) {
    const value = getNestedValue(payload, rule.field);

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
export const splitMessage = <T>(
  message: IntegrationMessage<T[]>,
  pattern: SplitAggregatePattern,
): IntegrationMessage[] => {
  const items = Array.isArray(message.payload) ? message.payload : [message.payload];
  const splitMessages: IntegrationMessage[] = [];
  const correlationId = message.correlationId || generateCorrelationId();

  if (pattern.splitStrategy === 'fixed-size' && pattern.partitionSize) {
    for (let i = 0; i < items.length; i += pattern.partitionSize) {
      const chunk = items.slice(i, i + pattern.partitionSize);
      const splitMsg = cloneMessageWithPayload(message, chunk);
      splitMsg.correlationId = correlationId;
      splitMsg.headers['split-index'] = i / pattern.partitionSize;
      splitMsg.headers['split-total'] = Math.ceil(items.length / pattern.partitionSize);
      splitMessages.push(splitMsg);
    }
  } else {
    // Split each item individually
    items.forEach((item, index) => {
      const splitMsg = cloneMessageWithPayload(message, item);
      splitMsg.correlationId = correlationId;
      splitMsg.headers['split-index'] = index;
      splitMsg.headers['split-total'] = items.length;
      splitMessages.push(splitMsg);
    });
  }

  return splitMessages;
};

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
export const aggregateMessages = (
  messages: IntegrationMessage[],
  pattern: SplitAggregatePattern,
): IntegrationMessage | null => {
  if (messages.length === 0) return null;

  if (pattern.aggregationStrategy === 'first') {
    return messages[0];
  }

  if (pattern.aggregationStrategy === 'all') {
    const expectedTotal = messages[0]?.headers['split-total'];
    if (messages.length < expectedTotal) {
      return null; // Not all messages received yet
    }

    const sortedMessages = messages.sort(
      (a, b) => a.headers['split-index'] - b.headers['split-index']
    );

    const aggregatedPayload = sortedMessages.map(msg => msg.payload);
    return cloneMessageWithPayload(messages[0], aggregatedPayload);
  }

  return null;
};

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
export const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

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
export const setNestedValue = (obj: any, path: string, value: any): void => {
  const keys = path.split('.');
  const lastKey = keys.pop()!;

  const target = keys.reduce((current, key) => {
    if (!current[key]) current[key] = {};
    return current[key];
  }, obj);

  target[lastKey] = value;
};

/**
 * Builds SOAP envelope for SOAP request.
 *
 * @param {any} payload - Request payload
 * @param {string} namespace - SOAP namespace
 * @param {string} operation - SOAP operation
 * @param {string} soapVersion - SOAP version
 * @returns {string} SOAP envelope XML
 */
const buildSOAPEnvelope = (
  payload: any,
  namespace: string,
  operation: string,
  soapVersion: string,
): string => {
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
const parseSOAPResponse = (soapResponse: string): any => {
  // Simplified SOAP parsing - in production use proper XML parser
  return { response: soapResponse };
};

/**
 * Converts object to XML.
 *
 * @param {any} obj - Object to convert
 * @returns {string} XML string
 */
const objectToXML = (obj: any): string => {
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
const interpolateCacheKey = (pattern: string, data: any): string => {
  return pattern.replace(/\{(\w+)\}/g, (_, key) => {
    return getNestedValue(data, key) || key;
  });
};

/**
 * Sends error to dead letter queue.
 *
 * @param {IntegrationError} error - Integration error
 * @param {string} queueName - Dead letter queue name
 * @returns {Promise<void>}
 */
const sendToDeadLetterQueue = async (error: IntegrationError, queueName: string): Promise<void> => {
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
const sendErrorAlert = async (error: IntegrationError, channels: string[]): Promise<void> => {
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
const auditRouting = (message: IntegrationMessage, destination: string, ruleId: string): void => {
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
export const setMessagePriority = (
  message: IntegrationMessage,
  priority: MessageMetadata['priority'],
): IntegrationMessage => {
  return {
    ...message,
    metadata: {
      ...message.metadata,
      priority,
    },
  };
};

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
export const compareMessagePriority = (
  msg1: IntegrationMessage,
  msg2: IntegrationMessage,
): number => {
  const priorityOrder = { critical: 4, high: 3, normal: 2, low: 1 };
  const p1 = priorityOrder[msg1.metadata?.priority || 'normal'];
  const p2 = priorityOrder[msg2.metadata?.priority || 'normal'];
  return p2 - p1; // Higher priority first
};

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
export const isMessageExpired = (message: IntegrationMessage): boolean => {
  if (!message.metadata?.ttl) return false;

  const ageMs = Date.now() - message.timestamp.getTime();
  return ageMs > (message.metadata.ttl * 1000);
};

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
export const createMessageBatch = (
  messages: IntegrationMessage[],
  maxBatchSize: number = 100,
): IntegrationMessage[] => {
  const batches: IntegrationMessage[] = [];

  for (let i = 0; i < messages.length; i += maxBatchSize) {
    const chunk = messages.slice(i, i + maxBatchSize);
    const batchMessage = createIntegrationMessage(
      chunk.map(m => m.payload),
      chunk[0].source,
      chunk[0].destination,
      'BATCH_MESSAGE'
    );
    batchMessage.headers['batch-size'] = chunk.length;
    batchMessage.headers['batch-index'] = i / maxBatchSize;
    batches.push(batchMessage);
  }

  return batches;
};

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
export const unpackMessageBatch = (batchMessage: IntegrationMessage): IntegrationMessage[] => {
  if (!Array.isArray(batchMessage.payload)) {
    return [batchMessage];
  }

  return batchMessage.payload.map((payload, index) => {
    const msg = cloneMessageWithPayload(batchMessage, payload);
    msg.headers['batch-origin'] = batchMessage.messageId;
    msg.headers['batch-position'] = index;
    return msg;
  });
};

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
export const validateMessageStructure = (message: IntegrationMessage): boolean => {
  if (!message.messageId) throw new Error('Message ID is required');
  if (!message.source) throw new Error('Message source is required');
  if (!message.destination) throw new Error('Message destination is required');
  if (!message.messageType) throw new Error('Message type is required');
  if (message.payload === undefined) throw new Error('Message payload is required');

  return true;
};

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
export const createCanonicalModel = (
  modelName: string,
  version: string,
  namespace: string,
  schema: Record<string, any>,
): CanonicalDataModel => {
  return {
    modelName,
    version,
    namespace,
    schema,
    validationRules: [],
  };
};

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
export const createServiceOrchestration = (
  orchestrationId: string,
  services: ServiceStep[],
  config?: Partial<ServiceOrchestration>,
): ServiceOrchestration => {
  return {
    orchestrationId,
    services,
    compensationEnabled: false,
    transactionBoundary: 'local',
    timeoutMs: 30000,
    ...config,
  };
};

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
export const createMessageBroker = (
  brokerType: MessageBrokerConfig['brokerType'],
  connectionUrl: string,
  config?: Partial<MessageBrokerConfig>,
): MessageBrokerConfig => {
  return {
    brokerType,
    connectionUrl,
    ...config,
  };
};

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
export const createDataMapping = (
  mappingId: string,
  sourceSchema: string,
  targetSchema: string,
  fieldMappings: FieldMapping[],
): DataMapping => {
  return {
    mappingId,
    sourceSchema,
    targetSchema,
    fieldMappings,
    transformations: [],
  };
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Message creation and manipulation
  createIntegrationMessage,
  generateMessageId,
  generateCorrelationId,
  cloneMessageWithPayload,
  addMessageHeader,
  getMessageHeader,

  // Message transformation
  applyTransformationRules,
  createTypeConversionRule,
  createConditionalRule,
  transformToCanonical,
  transformFromCanonical,

  // Content-based routing
  createContentBasedRouter,
  routeMessage,
  createMessageTypeRoutingRule,
  createContentRoutingRule,
  createHeaderRoutingRule,

  // Message enrichment
  enrichMessage,
  createLookupEnrichment,
  createAggregateEnrichment,
  createCachedEnrichment,

  // Protocol adapters
  createRESTAdapter,
  createSOAPAdapter,
  createGRPCAdapter,
  adaptToProtocol,
  adaptFromProtocol,

  // Message filtering
  createMessageFilter,
  applyFilter,
  createFilterChain,

  // Error handling
  createIntegrationError,
  createErrorStrategy,
  handleIntegrationError,
  validateAgainstRules,

  // Split-aggregate pattern
  splitMessage,
  aggregateMessages,

  // Message priority and ordering
  setMessagePriority,
  compareMessagePriority,
  isMessageExpired,

  // Message batching
  createMessageBatch,
  unpackMessageBatch,

  // Message validation
  validateMessageStructure,
  createCanonicalModel,

  // Service orchestration
  createServiceOrchestration,
  createMessageBroker,
  createDataMapping,

  // Helper functions
  getNestedValue,
  setNestedValue,
};
