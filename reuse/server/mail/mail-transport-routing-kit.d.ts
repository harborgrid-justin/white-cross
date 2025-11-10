/**
 * LOC: MAILTRANSPORT001
 * File: /reuse/server/mail/mail-transport-routing-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS mail services
 *   - Exchange server implementations
 *   - Mail routing services
 *   - Load balancer services
 *   - Healthcare communication modules
 */
/**
 * Transport connector type
 */
export declare enum ConnectorType {
    SMTP = "SMTP",
    EXCHANGE = "EXCHANGE",
    SEND_CONNECTOR = "SEND_CONNECTOR",
    RECEIVE_CONNECTOR = "RECEIVE_CONNECTOR",
    FOREIGN_CONNECTOR = "FOREIGN_CONNECTOR",
    DELIVERY_AGENT = "DELIVERY_AGENT",
    AGENT_CONNECTOR = "AGENT_CONNECTOR"
}
/**
 * Routing scope
 */
export declare enum RoutingScope {
    INTERNAL = "INTERNAL",
    EXTERNAL = "EXTERNAL",
    HYBRID = "HYBRID"
}
/**
 * Routing decision action
 */
export declare enum RoutingAction {
    DELIVER = "DELIVER",
    RELAY = "RELAY",
    FORWARD = "FORWARD",
    REJECT = "REJECT",
    QUARANTINE = "QUARANTINE",
    REDIRECT = "REDIRECT"
}
/**
 * Load balancing algorithm
 */
export declare enum LoadBalancingAlgorithm {
    ROUND_ROBIN = "ROUND_ROBIN",
    LEAST_CONNECTIONS = "LEAST_CONNECTIONS",
    WEIGHTED = "WEIGHTED",
    RANDOM = "RANDOM",
    IP_HASH = "IP_HASH",
    GEOGRAPHIC = "GEOGRAPHIC"
}
/**
 * Transport protocol
 */
export declare enum TransportProtocol {
    SMTP = "SMTP",
    SMTPS = "SMTPS",
    LMTP = "LMTP",
    EXCHANGE_RPC = "EXCHANGE_RPC",
    EXCHANGE_MAPI = "EXCHANGE_MAPI",
    HTTP = "HTTP"
}
/**
 * Routing priority
 */
export declare enum RoutingPriority {
    CRITICAL = "CRITICAL",
    HIGH = "HIGH",
    NORMAL = "NORMAL",
    LOW = "LOW",
    BULK = "BULK"
}
/**
 * Smart host configuration
 */
export interface SmartHostConfig {
    id: string;
    name: string;
    host: string;
    port: number;
    protocol: TransportProtocol;
    requireTLS: boolean;
    requireAuth: boolean;
    authUsername?: string;
    authPassword?: string;
    priority: number;
    weight: number;
    maxConnections: number;
    connectionTimeout: number;
    idleTimeout: number;
    retryAttempts: number;
    retryDelay: number;
    enabled: boolean;
    healthCheckInterval: number;
    healthCheckUrl?: string;
    metadata?: Record<string, any>;
}
/**
 * Send connector configuration (Exchange-style)
 */
export interface SendConnector {
    id: string;
    name: string;
    enabled: boolean;
    connectorType: ConnectorType;
    addressSpaces: AddressSpace[];
    sourceTransportServers: string[];
    smartHosts: string[];
    smartHostAuthMechanism?: string;
    dnsRoutingEnabled: boolean;
    useExternalDNSServersEnabled: boolean;
    port: number;
    protocolLoggingLevel: 'None' | 'Verbose';
    smtpMaxMessagesPerConnection: number;
    tlsDomain?: string;
    tlsCertificateName?: string;
    requireTLS: boolean;
    requireOorg: boolean;
    cloudServicesMailEnabled: boolean;
    maxMessageSize?: number;
    connectionInactivityTimeout: number;
    errorPolicies?: string[];
    metadata?: Record<string, any>;
}
/**
 * Address space for routing
 */
export interface AddressSpace {
    address: string;
    cost: number;
    addressSpaceType: 'SMTP' | 'X400' | 'NOTES';
    isInternal?: boolean;
}
/**
 * Receive connector configuration
 */
export interface ReceiveConnector {
    id: string;
    name: string;
    enabled: boolean;
    bindings: string[];
    remoteIPRanges: string[];
    authMechanism: string[];
    permissionGroups: string[];
    requireTLS: boolean;
    enableAuthGSSAPI: boolean;
    maxMessageSize?: number;
    maxRecipientsPerMessage: number;
    maxHeaderSize?: number;
    messageRateLimit?: number;
    connectionTimeout: number;
    connectionInactivityTimeout: number;
    protocolLoggingLevel: 'None' | 'Verbose';
    banner?: string;
    metadata?: Record<string, any>;
}
/**
 * Transport rule
 */
export interface TransportRule {
    id: string;
    name: string;
    priority: number;
    enabled: boolean;
    conditions: RuleCondition[];
    exceptions: RuleCondition[];
    actions: RuleAction[];
    mode: 'Enforce' | 'Audit';
    activationDate?: Date;
    expiryDate?: Date;
    comments?: string;
    metadata?: Record<string, any>;
}
/**
 * Rule condition
 */
export interface RuleCondition {
    type: string;
    property: string;
    operator: 'equals' | 'contains' | 'matches' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan';
    value: any;
    caseSensitive?: boolean;
}
/**
 * Rule action
 */
export interface RuleAction {
    type: string;
    parameters: Record<string, any>;
}
/**
 * Routing decision
 */
export interface RoutingDecision {
    messageId: string;
    action: RoutingAction;
    connector?: SendConnector;
    smartHost?: SmartHostConfig;
    nexthop: string;
    priority: RoutingPriority;
    cost: number;
    reason: string;
    appliedRules: string[];
    timestamp: Date;
    metadata?: Record<string, any>;
}
/**
 * Routing table entry
 */
export interface RoutingTableEntry {
    id: string;
    destination: string;
    destinationType: 'domain' | 'email' | 'pattern';
    connector: string;
    nexthop: string;
    cost: number;
    scope: RoutingScope;
    priority: RoutingPriority;
    enabled: boolean;
    lastModified: Date;
    metadata?: Record<string, any>;
}
/**
 * Message routing context
 */
export interface MessageRoutingContext {
    messageId: string;
    from: string;
    to: string[];
    subject?: string;
    size: number;
    priority: RoutingPriority;
    headers: Map<string, string>;
    receivedFrom?: string;
    authenticatedSender?: string;
    timestamp: Date;
    metadata?: Record<string, any>;
}
/**
 * Transport server health status
 */
export interface TransportServerHealth {
    serverId: string;
    host: string;
    port: number;
    status: 'healthy' | 'degraded' | 'unhealthy' | 'unknown';
    lastCheck: Date;
    responseTime: number;
    activeConnections: number;
    queuedMessages: number;
    errorRate: number;
    consecutiveFailures: number;
    uptime: number;
    metadata?: Record<string, any>;
}
/**
 * Load balancer pool
 */
export interface LoadBalancerPool {
    id: string;
    name: string;
    algorithm: LoadBalancingAlgorithm;
    servers: TransportServerHealth[];
    healthCheckInterval: number;
    healthCheckTimeout: number;
    maxFailures: number;
    stickySessions: boolean;
    sessionAffinityAttribute?: string;
    enabled: boolean;
    metadata?: Record<string, any>;
}
/**
 * Message tracking entry
 */
export interface MessageTrackingEntry {
    id: string;
    messageId: string;
    timestamp: Date;
    eventType: string;
    source: string;
    sourceType: 'CONNECTOR' | 'AGENT' | 'QUEUE' | 'STORE';
    sender: string;
    recipients: string[];
    subject?: string;
    size: number;
    serverHostname: string;
    connectorId?: string;
    nexthop?: string;
    directionality: 'Originating' | 'Incoming' | 'Outgoing';
    tenantId?: string;
    clientIp?: string;
    clientHostname?: string;
    originalClientIp?: string;
    returnPath: string;
    messageInfo?: string;
    eventData?: Record<string, any>;
    metadata?: Record<string, any>;
}
/**
 * Delivery queue item
 */
export interface DeliveryQueueItem {
    id: string;
    messageId: string;
    from: string;
    to: string;
    subject?: string;
    size: number;
    priority: RoutingPriority;
    nexthop: string;
    connectorId: string;
    attempts: number;
    maxAttempts: number;
    lastAttempt?: Date;
    nextAttempt: Date;
    expiresAt: Date;
    status: 'pending' | 'active' | 'deferred' | 'suspended';
    lastError?: string;
    messageData: Buffer;
    metadata?: Record<string, any>;
}
/**
 * Routing diagnostics result
 */
export interface RoutingDiagnostics {
    testId: string;
    timestamp: Date;
    from: string;
    to: string;
    domain: string;
    routingPath: Array<{
        hop: number;
        server: string;
        connector: string;
        action: string;
        timestamp: Date;
    }>;
    decision: RoutingDecision;
    dnsRecords: any[];
    appliedRules: TransportRule[];
    warnings: string[];
    errors: string[];
    estimatedDeliveryTime: number;
    recommendation?: string;
}
/**
 * Sequelize model for routing rules
 */
export interface RoutingRuleModel {
    id: string;
    name: string;
    description?: string;
    ruleType: 'domain' | 'recipient' | 'sender' | 'header' | 'size' | 'priority';
    pattern: string;
    connectorId: string;
    nexthop: string;
    cost: number;
    priority: number;
    enabled: boolean;
    conditions: string;
    actions: string;
    scope: RoutingScope;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    modifiedBy: string;
    metadata?: string;
}
/**
 * Sequelize model for transport connectors
 */
export interface TransportConnectorModel {
    id: string;
    name: string;
    connectorType: ConnectorType;
    enabled: boolean;
    configuration: string;
    addressSpaces: string;
    smartHosts: string;
    maxMessageSize?: number;
    maxConnections: number;
    connectionTimeout: number;
    requireTLS: boolean;
    healthCheckInterval: number;
    createdAt: Date;
    updatedAt: Date;
    lastHealthCheck?: Date;
    healthStatus?: string;
    metadata?: string;
}
/**
 * Swagger documentation interface
 */
export interface TransportRoutingSwaggerDoc {
    endpoint: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    summary: string;
    description: string;
    tags: string[];
    parameters?: Array<{
        name: string;
        in: 'path' | 'query' | 'body' | 'header';
        description: string;
        required: boolean;
        schema: any;
    }>;
    requestBody?: {
        description: string;
        required: boolean;
        content: Record<string, any>;
    };
    responses: Record<number, {
        description: string;
        schema?: any;
    }>;
}
/**
 * Evaluates routing rules and determines the routing decision for a message
 * @param context - Message routing context
 * @param rules - Transport rules to evaluate
 * @param connectors - Available send connectors
 * @returns Routing decision
 * @example
 * const decision = evaluateRoutingRules(context, rules, connectors);
 * console.log(decision.action); // 'RELAY'
 * console.log(decision.nexthop); // 'smtp.external.com'
 */
export declare function evaluateRoutingRules(context: MessageRoutingContext, rules: TransportRule[], connectors: SendConnector[]): RoutingDecision;
/**
 * Selects the best connector for a message based on address spaces and costs
 * @param context - Message routing context
 * @param connectors - Available connectors
 * @returns Best matching connector
 */
export declare function selectBestConnector(context: MessageRoutingContext, connectors: SendConnector[]): SendConnector | undefined;
/**
 * Evaluates if a recipient matches an address space
 * @param recipient - Recipient email address
 * @param addressSpace - Address space definition
 * @returns True if matches
 */
export declare function matchesAddressSpace(recipient: string, addressSpace: AddressSpace): boolean;
/**
 * Evaluates rule conditions against message context
 * @param conditions - Rule conditions
 * @param context - Message routing context
 * @returns True if all conditions match
 */
export declare function evaluateRuleConditions(conditions: RuleCondition[], context: MessageRoutingContext): boolean;
/**
 * Evaluates a single rule condition
 * @param condition - Rule condition
 * @param context - Message routing context
 * @returns True if condition matches
 */
export declare function evaluateSingleCondition(condition: RuleCondition, context: MessageRoutingContext): boolean;
/**
 * Checks if a transport rule is currently active
 * @param rule - Transport rule
 * @returns True if active
 */
export declare function isRuleActive(rule: TransportRule): boolean;
/**
 * Calculates routing cost for a connector
 * @param connector - Send connector
 * @param context - Message routing context
 * @returns Routing cost
 */
export declare function calculateRoutingCost(connector: SendConnector, context: MessageRoutingContext): number;
/**
 * Creates a smart host configuration
 * @param name - Smart host name
 * @param host - Host address
 * @param port - Port number
 * @param options - Additional options
 * @returns Smart host configuration
 * @example
 * const smartHost = createSmartHost('relay', 'relay.example.com', 587);
 */
export declare function createSmartHost(name: string, host: string, port: number, options?: Partial<SmartHostConfig>): SmartHostConfig;
/**
 * Validates smart host configuration
 * @param config - Smart host configuration
 * @returns Validation result with errors
 */
export declare function validateSmartHostConfig(config: SmartHostConfig): {
    valid: boolean;
    errors: string[];
};
/**
 * Performs health check on smart host
 * @param config - Smart host configuration
 * @returns Health status
 */
export declare function checkSmartHostHealth(config: SmartHostConfig): Promise<TransportServerHealth>;
/**
 * Tests connection to smart host
 * @param config - Smart host configuration
 * @returns Promise that resolves if connection successful
 */
export declare function testSmartHostConnection(config: SmartHostConfig): Promise<void>;
/**
 * Creates a send connector configuration
 * @param name - Connector name
 * @param addressSpaces - Address spaces to handle
 * @param options - Additional options
 * @returns Send connector configuration
 */
export declare function createSendConnector(name: string, addressSpaces: AddressSpace[], options?: Partial<SendConnector>): SendConnector;
/**
 * Creates a receive connector configuration
 * @param name - Connector name
 * @param bindings - IP:Port bindings
 * @param options - Additional options
 * @returns Receive connector configuration
 */
export declare function createReceiveConnector(name: string, bindings: string[], options?: Partial<ReceiveConnector>): ReceiveConnector;
/**
 * Updates connector configuration
 * @param connector - Existing connector
 * @param updates - Configuration updates
 * @returns Updated connector
 */
export declare function updateConnectorConfig<T extends SendConnector | ReceiveConnector>(connector: T, updates: Partial<T>): T;
/**
 * Validates connector configuration
 * @param connector - Connector configuration
 * @returns Validation result
 */
export declare function validateConnectorConfig(connector: SendConnector | ReceiveConnector): {
    valid: boolean;
    errors: string[];
};
/**
 * Routes message based on recipient domain
 * @param domain - Recipient domain
 * @param routingTable - Routing table entries
 * @returns Routing table entry or undefined
 */
export declare function routeByDomain(domain: string, routingTable: RoutingTableEntry[]): RoutingTableEntry | undefined;
/**
 * Checks if domain matches routing pattern
 * @param domain - Domain to test
 * @param pattern - Routing pattern
 * @returns True if matches
 */
export declare function domainMatchesPattern(domain: string, pattern: string): boolean;
/**
 * Creates domain routing entry
 * @param domain - Domain pattern
 * @param connectorId - Connector ID
 * @param nexthop - Next hop address
 * @param options - Additional options
 * @returns Routing table entry
 */
export declare function createDomainRoute(domain: string, connectorId: string, nexthop: string, options?: Partial<RoutingTableEntry>): RoutingTableEntry;
/**
 * Routes message based on specific recipient
 * @param recipient - Recipient email address
 * @param routingTable - Routing table entries
 * @returns Routing table entry or undefined
 */
export declare function routeByRecipient(recipient: string, routingTable: RoutingTableEntry[]): RoutingTableEntry | undefined;
/**
 * Checks if recipient matches routing pattern
 * @param recipient - Recipient email
 * @param pattern - Routing pattern
 * @returns True if matches
 */
export declare function recipientMatchesPattern(recipient: string, pattern: string): boolean;
/**
 * Creates recipient-specific routing entry
 * @param recipient - Recipient email or pattern
 * @param connectorId - Connector ID
 * @param nexthop - Next hop address
 * @param options - Additional options
 * @returns Routing table entry
 */
export declare function createRecipientRoute(recipient: string, connectorId: string, nexthop: string, options?: Partial<RoutingTableEntry>): RoutingTableEntry;
/**
 * Creates a transport rule
 * @param name - Rule name
 * @param priority - Rule priority (lower executes first)
 * @param conditions - Rule conditions
 * @param actions - Rule actions
 * @param options - Additional options
 * @returns Transport rule
 */
export declare function createTransportRule(name: string, priority: number, conditions: RuleCondition[], actions: RuleAction[], options?: Partial<TransportRule>): TransportRule;
/**
 * Creates a condition for transport rule
 * @param type - Condition type
 * @param property - Property to evaluate
 * @param operator - Comparison operator
 * @param value - Comparison value
 * @returns Rule condition
 */
export declare function createRuleCondition(type: string, property: string, operator: RuleCondition['operator'], value: any): RuleCondition;
/**
 * Creates an action for transport rule
 * @param type - Action type
 * @param parameters - Action parameters
 * @returns Rule action
 */
export declare function createRuleAction(type: string, parameters: Record<string, any>): RuleAction;
/**
 * Creates a load balancer pool
 * @param name - Pool name
 * @param algorithm - Load balancing algorithm
 * @param servers - Transport servers
 * @param options - Additional options
 * @returns Load balancer pool
 */
export declare function createLoadBalancerPool(name: string, algorithm: LoadBalancingAlgorithm, servers: TransportServerHealth[], options?: Partial<LoadBalancerPool>): LoadBalancerPool;
/**
 * Selects server from pool using load balancing algorithm
 * @param pool - Load balancer pool
 * @param context - Message routing context (for sticky sessions)
 * @returns Selected server
 */
export declare function selectServerFromPool(pool: LoadBalancerPool, context?: MessageRoutingContext): TransportServerHealth | undefined;
/**
 * Selects server using round-robin algorithm
 * @param servers - Available servers
 * @returns Selected server
 */
export declare function selectRoundRobin(servers: TransportServerHealth[]): TransportServerHealth;
/**
 * Selects server with least connections
 * @param servers - Available servers
 * @returns Selected server
 */
export declare function selectLeastConnections(servers: TransportServerHealth[]): TransportServerHealth;
/**
 * Selects random server
 * @param servers - Available servers
 * @returns Selected server
 */
export declare function selectRandom(servers: TransportServerHealth[]): TransportServerHealth;
/**
 * Selects server based on hash of input
 * @param servers - Available servers
 * @param input - Input to hash
 * @returns Selected server
 */
export declare function selectByHash(servers: TransportServerHealth[], input: string): TransportServerHealth;
/**
 * Implements failover logic for message delivery
 * @param primaryServer - Primary transport server
 * @param backupServers - Backup servers in priority order
 * @param context - Message routing context
 * @returns Selected server
 */
export declare function selectWithFailover(primaryServer: TransportServerHealth, backupServers: TransportServerHealth[], context: MessageRoutingContext): TransportServerHealth;
/**
 * Calculates failover priority based on server health
 * @param server - Transport server
 * @returns Priority score (lower is better)
 */
export declare function calculateFailoverPriority(server: TransportServerHealth): number;
/**
 * Checks if server should be removed from rotation
 * @param server - Transport server
 * @param maxFailures - Maximum consecutive failures
 * @returns True if should be removed
 */
export declare function shouldRemoveFromRotation(server: TransportServerHealth, maxFailures: number): boolean;
/**
 * Creates message tracking entry
 * @param messageId - Message ID
 * @param eventType - Event type
 * @param context - Message routing context
 * @param options - Additional options
 * @returns Message tracking entry
 */
export declare function createTrackingEntry(messageId: string, eventType: string, context: MessageRoutingContext, options?: Partial<MessageTrackingEntry>): MessageTrackingEntry;
/**
 * Queries message tracking history
 * @param messageId - Message ID
 * @param trackingEntries - All tracking entries
 * @returns Filtered tracking entries
 */
export declare function queryMessageTracking(messageId: string, trackingEntries: MessageTrackingEntry[]): MessageTrackingEntry[];
/**
 * Generates message tracking summary
 * @param entries - Message tracking entries
 * @returns Tracking summary
 */
export declare function generateTrackingSummary(entries: MessageTrackingEntry[]): {
    messageId: string;
    sender: string;
    recipients: string[];
    firstSeen: Date;
    lastSeen: Date;
    hops: number;
    events: string[];
    status: string;
};
/**
 * Creates delivery queue item
 * @param messageId - Message ID
 * @param from - Sender address
 * @param to - Recipient address
 * @param messageData - Message content
 * @param options - Additional options
 * @returns Delivery queue item
 */
export declare function createDeliveryQueueItem(messageId: string, from: string, to: string, messageData: Buffer, options?: Partial<DeliveryQueueItem>): DeliveryQueueItem;
/**
 * Calculates next retry time with exponential backoff
 * @param item - Queue item
 * @param baseDelay - Base delay in milliseconds
 * @returns Next attempt timestamp
 */
export declare function calculateNextRetry(item: DeliveryQueueItem, baseDelay?: number): Date;
/**
 * Prioritizes delivery queue based on message priority and age
 * @param queue - Delivery queue items
 * @returns Sorted queue
 */
export declare function prioritizeDeliveryQueue(queue: DeliveryQueueItem[]): DeliveryQueueItem[];
/**
 * Optimizes batch delivery to same destination
 * @param queue - Delivery queue items
 * @param maxBatchSize - Maximum batch size
 * @returns Batched queue items by destination
 */
export declare function batchDeliveriesByDestination(queue: DeliveryQueueItem[], maxBatchSize?: number): Map<string, DeliveryQueueItem[]>;
/**
 * Performs comprehensive routing diagnostics
 * @param from - Sender address
 * @param to - Recipient address
 * @param connectors - Available connectors
 * @param rules - Transport rules
 * @param routingTable - Routing table
 * @returns Diagnostic results
 */
export declare function performRoutingDiagnostics(from: string, to: string, connectors: SendConnector[], rules: TransportRule[], routingTable: RoutingTableEntry[]): Promise<RoutingDiagnostics>;
/**
 * Validates routing configuration
 * @param connectors - Send connectors
 * @param routingTable - Routing table
 * @returns Validation results
 */
export declare function validateRoutingConfiguration(connectors: SendConnector[], routingTable: RoutingTableEntry[]): {
    valid: boolean;
    errors: string[];
    warnings: string[];
};
/**
 * Traces message routing path
 * @param messageId - Message ID
 * @param trackingEntries - Message tracking entries
 * @returns Routing path
 */
export declare function traceRoutingPath(messageId: string, trackingEntries: MessageTrackingEntry[]): Array<{
    hop: number;
    server: string;
    event: string;
    timestamp: Date;
}>;
/**
 * Extracts domain from email address
 * @param email - Email address
 * @returns Domain portion
 */
export declare function extractDomain(email: string): string;
/**
 * Resolves MX records for domain
 * @param domain - Domain name
 * @returns MX records
 */
export declare function resolveMXRecords(domain: string): Promise<any[]>;
/**
 * Formats routing decision for logging
 * @param decision - Routing decision
 * @returns Formatted string
 */
export declare function formatRoutingDecision(decision: RoutingDecision): string;
/**
 * Generates Swagger documentation for routing API
 * @returns Swagger documentation
 */
export declare function generateRoutingApiSwagger(): TransportRoutingSwaggerDoc;
/**
 * Generates Swagger documentation for connector management
 * @returns Swagger documentation
 */
export declare function generateConnectorApiSwagger(): TransportRoutingSwaggerDoc;
/**
 * Generates Swagger documentation for routing diagnostics
 * @returns Swagger documentation
 */
export declare function generateDiagnosticsApiSwagger(): TransportRoutingSwaggerDoc;
/**
 * Generates complete Swagger specification for transport and routing API
 * @param baseUrl - API base URL
 * @param version - API version
 * @returns Complete Swagger specification
 */
export declare function generateCompleteRoutingSwaggerSpec(baseUrl: string, version: string): any;
declare const _default: {
    evaluateRoutingRules: typeof evaluateRoutingRules;
    selectBestConnector: typeof selectBestConnector;
    matchesAddressSpace: typeof matchesAddressSpace;
    evaluateRuleConditions: typeof evaluateRuleConditions;
    evaluateSingleCondition: typeof evaluateSingleCondition;
    isRuleActive: typeof isRuleActive;
    calculateRoutingCost: typeof calculateRoutingCost;
    createSmartHost: typeof createSmartHost;
    validateSmartHostConfig: typeof validateSmartHostConfig;
    checkSmartHostHealth: typeof checkSmartHostHealth;
    testSmartHostConnection: typeof testSmartHostConnection;
    createSendConnector: typeof createSendConnector;
    createReceiveConnector: typeof createReceiveConnector;
    updateConnectorConfig: typeof updateConnectorConfig;
    validateConnectorConfig: typeof validateConnectorConfig;
    routeByDomain: typeof routeByDomain;
    domainMatchesPattern: typeof domainMatchesPattern;
    createDomainRoute: typeof createDomainRoute;
    routeByRecipient: typeof routeByRecipient;
    recipientMatchesPattern: typeof recipientMatchesPattern;
    createRecipientRoute: typeof createRecipientRoute;
    createTransportRule: typeof createTransportRule;
    createRuleCondition: typeof createRuleCondition;
    createRuleAction: typeof createRuleAction;
    createLoadBalancerPool: typeof createLoadBalancerPool;
    selectServerFromPool: typeof selectServerFromPool;
    selectRoundRobin: typeof selectRoundRobin;
    selectLeastConnections: typeof selectLeastConnections;
    selectRandom: typeof selectRandom;
    selectByHash: typeof selectByHash;
    selectWithFailover: typeof selectWithFailover;
    calculateFailoverPriority: typeof calculateFailoverPriority;
    shouldRemoveFromRotation: typeof shouldRemoveFromRotation;
    createTrackingEntry: typeof createTrackingEntry;
    queryMessageTracking: typeof queryMessageTracking;
    generateTrackingSummary: typeof generateTrackingSummary;
    createDeliveryQueueItem: typeof createDeliveryQueueItem;
    calculateNextRetry: typeof calculateNextRetry;
    prioritizeDeliveryQueue: typeof prioritizeDeliveryQueue;
    batchDeliveriesByDestination: typeof batchDeliveriesByDestination;
    performRoutingDiagnostics: typeof performRoutingDiagnostics;
    validateRoutingConfiguration: typeof validateRoutingConfiguration;
    traceRoutingPath: typeof traceRoutingPath;
    extractDomain: typeof extractDomain;
    resolveMXRecords: typeof resolveMXRecords;
    formatRoutingDecision: typeof formatRoutingDecision;
    generateRoutingApiSwagger: typeof generateRoutingApiSwagger;
    generateConnectorApiSwagger: typeof generateConnectorApiSwagger;
    generateDiagnosticsApiSwagger: typeof generateDiagnosticsApiSwagger;
    generateCompleteRoutingSwaggerSpec: typeof generateCompleteRoutingSwaggerSpec;
};
export default _default;
//# sourceMappingURL=mail-transport-routing-kit.d.ts.map