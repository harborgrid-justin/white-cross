/**
 * LOC: MSVC-THREAT-DET-COMP-001
 * File: /reuse/threat/composites/microservices-threat-detection-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../threat-detection-engine-kit.ts
 *   - ../automated-threat-response-kit.ts
 *   - ../incident-response-kit.ts
 *   - ../response-automation-kit.ts
 *   - ../incident-containment-kit.ts
 *   - @nestjs/microservices
 *   - @nestjs/common
 *
 * DOWNSTREAM (imported by):
 *   - Microservices threat detection controllers
 *   - Distributed security services
 *   - Service mesh integration modules
 *   - Distributed tracing systems
 *   - Load balancer health check services
 */
/**
 * Microservice registration metadata
 */
export interface MicroserviceRegistration {
    serviceId: string;
    serviceName: string;
    version: string;
    host: string;
    port: number;
    protocol: 'tcp' | 'redis' | 'nats' | 'mqtt' | 'rabbitmq' | 'kafka' | 'grpc';
    healthCheckEndpoint?: string;
    capabilities: string[];
    metadata: Record<string, any>;
    registeredAt: Date;
    lastHeartbeat: Date;
    status: 'healthy' | 'degraded' | 'unhealthy' | 'offline';
}
/**
 * Distributed threat detection context
 */
export interface DistributedThreatContext {
    traceId: string;
    spanId: string;
    parentSpanId?: string;
    serviceChain: string[];
    originService: string;
    timestamp: Date;
    threatData: any;
    correlationIds: string[];
    baggage?: Record<string, string>;
}
/**
 * Service mesh threat event
 */
export interface ServiceMeshThreatEvent {
    eventId: string;
    sourceService: string;
    targetService?: string;
    eventType: 'detection' | 'alert' | 'response' | 'audit';
    severity: 'critical' | 'high' | 'medium' | 'low';
    threatScore: number;
    context: DistributedThreatContext;
    payload: any;
    timestamp: Date;
}
/**
 * Circuit breaker state for threat detection services
 */
export interface CircuitBreakerState {
    serviceId: string;
    state: 'closed' | 'open' | 'half-open';
    failureCount: number;
    successCount: number;
    lastFailureTime?: Date;
    lastStateChange: Date;
    thresholds: {
        failureThreshold: number;
        successThreshold: number;
        timeout: number;
    };
}
/**
 * Load balancer health check result
 */
export interface ServiceHealthCheck {
    serviceId: string;
    healthy: boolean;
    responseTime: number;
    checkTimestamp: Date;
    threatDetectionCapacity: number;
    activeConnections: number;
    errorRate: number;
    metrics: {
        cpu: number;
        memory: number;
        detectionsPerSecond: number;
    };
}
/**
 * Message broker threat pattern
 */
export interface MessageBrokerPattern {
    patternId: string;
    patternType: 'request-response' | 'event-driven' | 'streaming';
    topic: string;
    consumerGroup?: string;
    messageSchema: any;
    threatRules: string[];
    priority: number;
}
/**
 * Distributed tracing span for threat detection
 */
export interface ThreatDetectionSpan {
    traceId: string;
    spanId: string;
    parentSpanId?: string;
    operationName: string;
    serviceName: string;
    startTime: Date;
    endTime?: Date;
    duration?: number;
    tags: Record<string, any>;
    logs: Array<{
        timestamp: Date;
        fields: Record<string, any>;
    }>;
    threatIndicators: string[];
}
/**
 * Registers a threat detection microservice with service registry.
 * Implements service discovery pattern for distributed threat detection.
 *
 * @param {MicroserviceRegistration} registration - Service registration metadata
 * @returns {Promise<{registered: boolean; serviceId: string; discoveryToken: string}>}
 *
 * @example
 * ```typescript
 * const registration = await registerThreatDetectionService({
 *   serviceId: 'threat-detect-001',
 *   serviceName: 'healthcare-threat-detector',
 *   version: '1.0.0',
 *   host: 'localhost',
 *   port: 3001,
 *   protocol: 'tcp',
 *   capabilities: ['realtime-detection', 'ml-analysis', 'anomaly-detection']
 * });
 * ```
 */
export declare const registerThreatDetectionService: (registration: MicroserviceRegistration) => Promise<{
    registered: boolean;
    serviceId: string;
    discoveryToken: string;
}>;
/**
 * Performs health check on threat detection microservice.
 * Integrates with load balancer health check endpoints.
 *
 * @param {string} serviceId - Service identifier
 * @returns {Promise<ServiceHealthCheck>}
 *
 * @example
 * ```typescript
 * const health = await checkThreatServiceHealth('threat-detect-001');
 * if (health.healthy && health.threatDetectionCapacity > 50) {
 *   // Service can accept more threat detection load
 * }
 * ```
 */
export declare const checkThreatServiceHealth: (serviceId: string) => Promise<ServiceHealthCheck>;
/**
 * Discovers available threat detection services in the mesh.
 * Implements service discovery with load balancing support.
 *
 * @param {object} criteria - Discovery criteria
 * @returns {Promise<MicroserviceRegistration[]>}
 *
 * @example
 * ```typescript
 * const services = await discoverThreatServices({
 *   capability: 'ml-analysis',
 *   minHealthScore: 80,
 *   protocol: 'grpc'
 * });
 * ```
 */
export declare const discoverThreatServices: (criteria: {
    capability?: string;
    minHealthScore?: number;
    protocol?: string;
}) => Promise<MicroserviceRegistration[]>;
/**
 * Performs distributed threat detection across microservices.
 * Coordinates threat analysis across multiple service instances.
 *
 * @param {any} threatData - Threat data to analyze
 * @param {DistributedThreatContext} context - Distributed tracing context
 * @returns {Promise<{detected: boolean; score: number; services: string[]}>}
 *
 * @example
 * ```typescript
 * const result = await detectThreatDistributed(suspiciousActivity, {
 *   traceId: 'trace-123',
 *   spanId: 'span-456',
 *   serviceChain: ['api-gateway', 'auth-service'],
 *   originService: 'api-gateway'
 * });
 * ```
 */
export declare const detectThreatDistributed: (threatData: any, context: DistributedThreatContext) => Promise<{
    detected: boolean;
    score: number;
    services: string[];
}>;
/**
 * Aggregates threat scores from multiple microservices.
 * Implements consensus-based threat scoring across service mesh.
 *
 * @param {Array<{serviceId: string; score: number; confidence: number}>} scores - Service scores
 * @returns {Promise<{aggregatedScore: number; consensus: boolean; participating: number}>}
 *
 * @example
 * ```typescript
 * const aggregated = await aggregateMicroserviceThreatScores([
 *   { serviceId: 'service-1', score: 85, confidence: 0.9 },
 *   { serviceId: 'service-2', score: 75, confidence: 0.8 }
 * ]);
 * ```
 */
export declare const aggregateMicroserviceThreatScores: (scores: Array<{
    serviceId: string;
    score: number;
    confidence: number;
}>) => Promise<{
    aggregatedScore: number;
    consensus: boolean;
    participating: number;
}>;
/**
 * Correlates threat events across microservices boundary.
 * Implements distributed event correlation with cross-service analysis.
 *
 * @param {ServiceMeshThreatEvent[]} events - Events from multiple services
 * @returns {Promise<{correlations: any[]; attackChains: any[]}>}
 *
 * @example
 * ```typescript
 * const correlations = await correlateCrossServiceThreats(meshEvents);
 * // Detects attack chains spanning multiple microservices
 * ```
 */
export declare const correlateCrossServiceThreats: (events: ServiceMeshThreatEvent[]) => Promise<{
    correlations: any[];
    attackChains: any[];
}>;
/**
 * Initializes service mesh threat monitoring.
 * Integrates with Istio, Linkerd, or Consul service mesh.
 *
 * @param {object} meshConfig - Service mesh configuration
 * @returns {Promise<{initialized: boolean; meshId: string; monitoredServices: number}>}
 *
 * @example
 * ```typescript
 * const mesh = await initializeServiceMeshMonitoring({
 *   meshType: 'istio',
 *   namespace: 'healthcare-services',
 *   telemetryEndpoint: 'http://jaeger:14268/api/traces'
 * });
 * ```
 */
export declare const initializeServiceMeshMonitoring: (meshConfig: {
    meshType: "istio" | "linkerd" | "consul";
    namespace: string;
    telemetryEndpoint?: string;
}) => Promise<{
    initialized: boolean;
    meshId: string;
    monitoredServices: number;
}>;
/**
 * Monitors service-to-service communication for threats.
 * Implements east-west traffic threat detection in service mesh.
 *
 * @param {string} sourceService - Source service name
 * @param {string} targetService - Target service name
 * @param {any} communicationData - Communication metadata
 * @returns {Promise<{threat: boolean; score: number; recommendation: string}>}
 *
 * @example
 * ```typescript
 * const threat = await monitorServiceCommunication(
 *   'patient-service',
 *   'ehr-database',
 *   { method: 'POST', path: '/api/patient', headers: {...} }
 * );
 * ```
 */
export declare const monitorServiceCommunication: (sourceService: string, targetService: string, communicationData: any) => Promise<{
    threat: boolean;
    score: number;
    recommendation: string;
}>;
/**
 * Enforces network policies based on threat detection.
 * Dynamically updates service mesh network policies.
 *
 * @param {string} serviceId - Service identifier
 * @param {object} policy - Network policy rules
 * @returns {Promise<{enforced: boolean; policyId: string; affectedServices: string[]}>}
 *
 * @example
 * ```typescript
 * const enforcement = await enforceServiceMeshPolicy('patient-service', {
 *   action: 'deny',
 *   sourceLabels: { threat: 'high' },
 *   targetService: 'ehr-database'
 * });
 * ```
 */
export declare const enforceServiceMeshPolicy: (serviceId: string, policy: {
    action: "allow" | "deny";
    sourceLabels?: any;
    targetService?: string;
}) => Promise<{
    enforced: boolean;
    policyId: string;
    affectedServices: string[];
}>;
/**
 * Creates distributed tracing span for threat detection.
 * Integrates with OpenTelemetry, Jaeger, or Zipkin.
 *
 * @param {string} operationName - Operation being traced
 * @param {DistributedThreatContext} context - Tracing context
 * @returns {Promise<ThreatDetectionSpan>}
 *
 * @example
 * ```typescript
 * const span = await createThreatDetectionSpan('analyze-user-behavior', {
 *   traceId: 'trace-789',
 *   spanId: 'span-012',
 *   originService: 'auth-service'
 * });
 * ```
 */
export declare const createThreatDetectionSpan: (operationName: string, context: DistributedThreatContext) => Promise<ThreatDetectionSpan>;
/**
 * Injects threat indicators into distributed trace.
 * Enriches traces with threat intelligence metadata.
 *
 * @param {ThreatDetectionSpan} span - Tracing span
 * @param {string[]} indicators - Threat indicators
 * @returns {Promise<ThreatDetectionSpan>}
 *
 * @example
 * ```typescript
 * const enrichedSpan = await injectThreatIndicators(span, [
 *   'suspicious-ip-access',
 *   'anomalous-request-pattern',
 *   'privilege-escalation-attempt'
 * ]);
 * ```
 */
export declare const injectThreatIndicators: (span: ThreatDetectionSpan, indicators: string[]) => Promise<ThreatDetectionSpan>;
/**
 * Analyzes distributed trace for attack patterns.
 * Performs forensic analysis on distributed traces.
 *
 * @param {ThreatDetectionSpan[]} spans - Trace spans
 * @returns {Promise<{attackDetected: boolean; pattern: string; confidence: number}>}
 *
 * @example
 * ```typescript
 * const analysis = await analyzeTraceForAttacks(traceSpans);
 * if (analysis.attackDetected && analysis.confidence > 0.8) {
 *   // Trigger incident response
 * }
 * ```
 */
export declare const analyzeTraceForAttacks: (spans: ThreatDetectionSpan[]) => Promise<{
    attackDetected: boolean;
    pattern: string;
    confidence: number;
}>;
/**
 * Manages circuit breaker for threat detection services.
 * Implements resilience pattern to prevent cascade failures.
 *
 * @param {string} serviceId - Service identifier
 * @param {object} thresholds - Circuit breaker thresholds
 * @returns {Promise<CircuitBreakerState>}
 *
 * @example
 * ```typescript
 * const breaker = await manageCircuitBreaker('ml-detector-service', {
 *   failureThreshold: 5,
 *   successThreshold: 2,
 *   timeout: 60000
 * });
 * ```
 */
export declare const manageCircuitBreaker: (serviceId: string, thresholds: {
    failureThreshold: number;
    successThreshold: number;
    timeout: number;
}) => Promise<CircuitBreakerState>;
/**
 * Executes threat detection with circuit breaker protection.
 * Wraps detection calls with resilience pattern.
 *
 * @param {string} serviceId - Service identifier
 * @param {() => Promise<any>} operation - Detection operation
 * @returns {Promise<{result: any; circuitState: string}>}
 *
 * @example
 * ```typescript
 * const result = await executeWithCircuitBreaker(
 *   'anomaly-detector',
 *   async () => detectBehavioralAnomaly(userData, baseline)
 * );
 * ```
 */
export declare const executeWithCircuitBreaker: (serviceId: string, operation: () => Promise<any>) => Promise<{
    result: any;
    circuitState: string;
}>;
/**
 * Monitors circuit breaker health across all services.
 * Provides dashboard for service resilience monitoring.
 *
 * @returns {Promise<{services: CircuitBreakerState[]; healthy: number; degraded: number}>}
 *
 * @example
 * ```typescript
 * const health = await monitorCircuitBreakerHealth();
 * console.log(`${health.healthy} healthy services, ${health.degraded} degraded`);
 * ```
 */
export declare const monitorCircuitBreakerHealth: () => Promise<{
    services: CircuitBreakerState[];
    healthy: number;
    degraded: number;
}>;
/**
 * Publishes threat detection event to message broker.
 * Supports Redis, RabbitMQ, Kafka, NATS transporters.
 *
 * @param {ServiceMeshThreatEvent} event - Threat event
 * @param {object} brokerConfig - Broker configuration
 * @returns {Promise<{published: boolean; messageId: string; broker: string}>}
 *
 * @example
 * ```typescript
 * const published = await publishThreatEventToBroker(threatEvent, {
 *   broker: 'kafka',
 *   topic: 'healthcare.threats.detected',
 *   partition: 0
 * });
 * ```
 */
export declare const publishThreatEventToBroker: (event: ServiceMeshThreatEvent, brokerConfig: {
    broker: "redis" | "rabbitmq" | "kafka" | "nats";
    topic: string;
}) => Promise<{
    published: boolean;
    messageId: string;
    broker: string;
}>;
/**
 * Subscribes to threat events from message broker.
 * Implements consumer pattern with threat event handlers.
 *
 * @param {MessageBrokerPattern} pattern - Subscription pattern
 * @param {(event: ServiceMeshThreatEvent) => Promise<void>} handler - Event handler
 * @returns {Promise<{subscribed: boolean; subscriptionId: string}>}
 *
 * @example
 * ```typescript
 * const subscription = await subscribeThreatEventStream({
 *   patternId: 'critical-threats',
 *   patternType: 'event-driven',
 *   topic: 'healthcare.threats.critical',
 *   threatRules: ['severity:critical']
 * }, async (event) => {
 *   await triggerAutomatedResponse(event);
 * });
 * ```
 */
export declare const subscribeThreatEventStream: (pattern: MessageBrokerPattern, handler: (event: ServiceMeshThreatEvent) => Promise<void>) => Promise<{
    subscribed: boolean;
    subscriptionId: string;
}>;
/**
 * Implements request-response pattern for threat analysis.
 * Supports synchronous microservice communication with timeout.
 *
 * @param {string} targetService - Target service name
 * @param {any} request - Analysis request
 * @param {number} timeout - Request timeout in ms
 * @returns {Promise<{response: any; responseTime: number}>}
 *
 * @example
 * ```typescript
 * const result = await requestThreatAnalysis(
 *   'ml-analysis-service',
 *   { userId: '123', activity: [...] },
 *   5000
 * );
 * ```
 */
export declare const requestThreatAnalysis: (targetService: string, request: any, timeout?: number) => Promise<{
    response: any;
    responseTime: number;
}>;
/**
 * Streams threat detection results via message broker.
 * Implements streaming pattern for continuous threat monitoring.
 *
 * @param {string} streamTopic - Stream topic name
 * @param {AsyncIterator<any>} dataStream - Data stream
 * @returns {Promise<{streaming: boolean; streamId: string; messagesPublished: number}>}
 *
 * @example
 * ```typescript
 * async function* generateThreatStream() {
 *   for (let i = 0; i < 100; i++) {
 *     yield { timestamp: new Date(), threats: detectThreats() };
 *   }
 * }
 * const stream = await streamThreatDetectionResults(
 *   'realtime-threats',
 *   generateThreatStream()
 * );
 * ```
 */
export declare const streamThreatDetectionResults: (streamTopic: string, dataStream: AsyncIterator<any>) => Promise<{
    streaming: boolean;
    streamId: string;
    messagesPublished: number;
}>;
/**
 * Routes threat detection request to optimal service instance.
 * Implements intelligent load balancing based on service health and capacity.
 *
 * @param {any} request - Detection request
 * @param {string[]} serviceIds - Available service instances
 * @returns {Promise<{selectedService: string; loadScore: number}>}
 *
 * @example
 * ```typescript
 * const routing = await routeThreatDetectionRequest(
 *   { userId: '123', data: {...} },
 *   ['detector-1', 'detector-2', 'detector-3']
 * );
 * ```
 */
export declare const routeThreatDetectionRequest: (request: any, serviceIds: string[]) => Promise<{
    selectedService: string;
    loadScore: number;
}>;
/**
 * Implements weighted round-robin load balancing.
 * Distributes threat detection load based on service weights and health.
 *
 * @param {Array<{serviceId: string; weight: number}>} services - Services with weights
 * @returns {Promise<{distribution: Record<string, number>; nextService: string}>}
 *
 * @example
 * ```typescript
 * const balancing = await balanceThreatDetectionLoad([
 *   { serviceId: 'detector-1', weight: 3 },
 *   { serviceId: 'detector-2', weight: 2 },
 *   { serviceId: 'detector-3', weight: 1 }
 * ]);
 * ```
 */
export declare const balanceThreatDetectionLoad: (services: Array<{
    serviceId: string;
    weight: number;
}>) => Promise<{
    distribution: Record<string, number>;
    nextService: string;
}>;
/**
 * Implements sticky session routing for threat detection.
 * Ensures consistent routing for entity-based threat analysis.
 *
 * @param {string} entityId - Entity identifier (user, device, session)
 * @param {string[]} serviceIds - Available services
 * @returns {Promise<{assignedService: string; sessionKey: string}>}
 *
 * @example
 * ```typescript
 * const session = await createStickySession('user-123', [
 *   'detector-1', 'detector-2', 'detector-3'
 * ]);
 * // All requests for user-123 route to same detector
 * ```
 */
export declare const createStickySession: (entityId: string, serviceIds: string[]) => Promise<{
    assignedService: string;
    sessionKey: string;
}>;
/**
 * Monitors microservice performance metrics.
 * Tracks threat detection latency, throughput, and error rates.
 *
 * @param {string} serviceId - Service identifier
 * @returns {Promise<{latency: number; throughput: number; errorRate: number; capacity: number}>}
 *
 * @example
 * ```typescript
 * const metrics = await monitorServicePerformance('ml-detector');
 * if (metrics.latency > 1000 || metrics.errorRate > 0.05) {
 *   // Scale out or investigate performance issues
 * }
 * ```
 */
export declare const monitorServicePerformance: (serviceId: string) => Promise<{
    latency: number;
    throughput: number;
    errorRate: number;
    capacity: number;
}>;
/**
 * Optimizes detection rules across microservices.
 * Distributes rule evaluation based on service capabilities.
 *
 * @param {any[]} rules - Detection rules
 * @param {MicroserviceRegistration[]} services - Available services
 * @returns {Promise<{optimized: boolean; ruleDistribution: Record<string, string[]>}>}
 *
 * @example
 * ```typescript
 * const optimization = await optimizeDistributedDetectionRules(
 *   detectionRules,
 *   availableServices
 * );
 * ```
 */
export declare const optimizeDistributedDetectionRules: (rules: any[], services: MicroserviceRegistration[]) => Promise<{
    optimized: boolean;
    ruleDistribution: Record<string, string[]>;
}>;
/**
 * Calculates service mesh threat detection effectiveness.
 * Aggregates metrics across all microservices.
 *
 * @param {string[]} serviceIds - Services to evaluate
 * @param {Date} startDate - Evaluation period start
 * @param {Date} endDate - Evaluation period end
 * @returns {Promise<{effectiveness: number; detections: number; falsePositives: number}>}
 *
 * @example
 * ```typescript
 * const effectiveness = await calculateMeshDetectionEffectiveness(
 *   ['detector-1', 'detector-2'],
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31')
 * );
 * ```
 */
export declare const calculateMeshDetectionEffectiveness: (serviceIds: string[], startDate: Date, endDate: Date) => Promise<{
    effectiveness: number;
    detections: number;
    falsePositives: number;
}>;
/**
 * Generates HIPAA compliance report for distributed threat detection.
 * Ensures audit trail across all microservices.
 *
 * @param {Date} startDate - Report period start
 * @param {Date} endDate - Report period end
 * @returns {Promise<{compliant: boolean; violations: any[]; auditTrail: any[]}>}
 *
 * @example
 * ```typescript
 * const compliance = await generateDistributedComplianceReport(
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31')
 * );
 * ```
 */
export declare const generateDistributedComplianceReport: (startDate: Date, endDate: Date) => Promise<{
    compliant: boolean;
    violations: any[];
    auditTrail: any[];
}>;
/**
 * Tracks threat detection actions across service mesh.
 * Creates distributed audit trail for compliance.
 *
 * @param {ServiceMeshThreatEvent} event - Threat event
 * @param {string} action - Action taken
 * @returns {Promise<{logged: boolean; auditId: string; services: string[]}>}
 *
 * @example
 * ```typescript
 * const audit = await auditDistributedThreatAction(threatEvent, 'isolation');
 * // Audit trail spans all involved microservices
 * ```
 */
export declare const auditDistributedThreatAction: (event: ServiceMeshThreatEvent, action: string) => Promise<{
    logged: boolean;
    auditId: string;
    services: string[];
}>;
declare const _default: {
    registerThreatDetectionService: (registration: MicroserviceRegistration) => Promise<{
        registered: boolean;
        serviceId: string;
        discoveryToken: string;
    }>;
    checkThreatServiceHealth: (serviceId: string) => Promise<ServiceHealthCheck>;
    discoverThreatServices: (criteria: {
        capability?: string;
        minHealthScore?: number;
        protocol?: string;
    }) => Promise<MicroserviceRegistration[]>;
    detectThreatDistributed: (threatData: any, context: DistributedThreatContext) => Promise<{
        detected: boolean;
        score: number;
        services: string[];
    }>;
    aggregateMicroserviceThreatScores: (scores: Array<{
        serviceId: string;
        score: number;
        confidence: number;
    }>) => Promise<{
        aggregatedScore: number;
        consensus: boolean;
        participating: number;
    }>;
    correlateCrossServiceThreats: (events: ServiceMeshThreatEvent[]) => Promise<{
        correlations: any[];
        attackChains: any[];
    }>;
    initializeServiceMeshMonitoring: (meshConfig: {
        meshType: "istio" | "linkerd" | "consul";
        namespace: string;
        telemetryEndpoint?: string;
    }) => Promise<{
        initialized: boolean;
        meshId: string;
        monitoredServices: number;
    }>;
    monitorServiceCommunication: (sourceService: string, targetService: string, communicationData: any) => Promise<{
        threat: boolean;
        score: number;
        recommendation: string;
    }>;
    enforceServiceMeshPolicy: (serviceId: string, policy: {
        action: "allow" | "deny";
        sourceLabels?: any;
        targetService?: string;
    }) => Promise<{
        enforced: boolean;
        policyId: string;
        affectedServices: string[];
    }>;
    createThreatDetectionSpan: (operationName: string, context: DistributedThreatContext) => Promise<ThreatDetectionSpan>;
    injectThreatIndicators: (span: ThreatDetectionSpan, indicators: string[]) => Promise<ThreatDetectionSpan>;
    analyzeTraceForAttacks: (spans: ThreatDetectionSpan[]) => Promise<{
        attackDetected: boolean;
        pattern: string;
        confidence: number;
    }>;
    manageCircuitBreaker: (serviceId: string, thresholds: {
        failureThreshold: number;
        successThreshold: number;
        timeout: number;
    }) => Promise<CircuitBreakerState>;
    executeWithCircuitBreaker: (serviceId: string, operation: () => Promise<any>) => Promise<{
        result: any;
        circuitState: string;
    }>;
    monitorCircuitBreakerHealth: () => Promise<{
        services: CircuitBreakerState[];
        healthy: number;
        degraded: number;
    }>;
    publishThreatEventToBroker: (event: ServiceMeshThreatEvent, brokerConfig: {
        broker: "redis" | "rabbitmq" | "kafka" | "nats";
        topic: string;
    }) => Promise<{
        published: boolean;
        messageId: string;
        broker: string;
    }>;
    subscribeThreatEventStream: (pattern: MessageBrokerPattern, handler: (event: ServiceMeshThreatEvent) => Promise<void>) => Promise<{
        subscribed: boolean;
        subscriptionId: string;
    }>;
    requestThreatAnalysis: (targetService: string, request: any, timeout?: number) => Promise<{
        response: any;
        responseTime: number;
    }>;
    streamThreatDetectionResults: (streamTopic: string, dataStream: AsyncIterator<any>) => Promise<{
        streaming: boolean;
        streamId: string;
        messagesPublished: number;
    }>;
    routeThreatDetectionRequest: (request: any, serviceIds: string[]) => Promise<{
        selectedService: string;
        loadScore: number;
    }>;
    balanceThreatDetectionLoad: (services: Array<{
        serviceId: string;
        weight: number;
    }>) => Promise<{
        distribution: Record<string, number>;
        nextService: string;
    }>;
    createStickySession: (entityId: string, serviceIds: string[]) => Promise<{
        assignedService: string;
        sessionKey: string;
    }>;
    monitorServicePerformance: (serviceId: string) => Promise<{
        latency: number;
        throughput: number;
        errorRate: number;
        capacity: number;
    }>;
    optimizeDistributedDetectionRules: (rules: any[], services: MicroserviceRegistration[]) => Promise<{
        optimized: boolean;
        ruleDistribution: Record<string, string[]>;
    }>;
    calculateMeshDetectionEffectiveness: (serviceIds: string[], startDate: Date, endDate: Date) => Promise<{
        effectiveness: number;
        detections: number;
        falsePositives: number;
    }>;
    generateDistributedComplianceReport: (startDate: Date, endDate: Date) => Promise<{
        compliant: boolean;
        violations: any[];
        auditTrail: any[];
    }>;
    auditDistributedThreatAction: (event: ServiceMeshThreatEvent, action: string) => Promise<{
        logged: boolean;
        auditId: string;
        services: string[];
    }>;
};
export default _default;
//# sourceMappingURL=microservices-threat-detection-composite.d.ts.map