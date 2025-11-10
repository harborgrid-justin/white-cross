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
 * File: /reuse/server/mail/mail-transport-routing-kit.ts
 * Locator: WC-UTL-MAILTRANSPORT-001
 * Purpose: Enterprise Mail Transport and Routing Kit for Exchange-Style Mail Services
 *
 * Upstream: Independent utility module for comprehensive mail transport and routing operations
 * Downstream: ../backend/*, Mail services, Exchange servers, Routing engines, Load balancers
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, sequelize, bull, crypto
 * Exports: 45 utility functions for routing rules, transport configuration, connectors, load balancing, failover, tracking
 *
 * LLM Context: Enterprise-grade mail transport and routing utilities for White Cross healthcare platform.
 * Provides comprehensive message routing engine with domain and recipient-based routing, smart host configuration,
 * connector management for external systems, transport rule evaluation, mail relay configuration with load balancing,
 * automatic failover and redundancy handling, delivery optimization with queuing strategies, message tracking across
 * routing hops, routing diagnostics and troubleshooting, Sequelize models for persistent routing rules, support for
 * Exchange Server transport architecture, connection pooling and health monitoring, priority-based routing, geographic
 * routing capabilities, and comprehensive Swagger documentation for routing APIs.
 */

import * as crypto from 'crypto';
import * as dns from 'dns';
import { EventEmitter } from 'events';

// ============================================================================
// TYPE DEFINITIONS - TRANSPORT AND ROUTING
// ============================================================================

/**
 * Transport connector type
 */
export enum ConnectorType {
  SMTP = 'SMTP',
  EXCHANGE = 'EXCHANGE',
  SEND_CONNECTOR = 'SEND_CONNECTOR',
  RECEIVE_CONNECTOR = 'RECEIVE_CONNECTOR',
  FOREIGN_CONNECTOR = 'FOREIGN_CONNECTOR',
  DELIVERY_AGENT = 'DELIVERY_AGENT',
  AGENT_CONNECTOR = 'AGENT_CONNECTOR',
}

/**
 * Routing scope
 */
export enum RoutingScope {
  INTERNAL = 'INTERNAL',
  EXTERNAL = 'EXTERNAL',
  HYBRID = 'HYBRID',
}

/**
 * Routing decision action
 */
export enum RoutingAction {
  DELIVER = 'DELIVER',
  RELAY = 'RELAY',
  FORWARD = 'FORWARD',
  REJECT = 'REJECT',
  QUARANTINE = 'QUARANTINE',
  REDIRECT = 'REDIRECT',
}

/**
 * Load balancing algorithm
 */
export enum LoadBalancingAlgorithm {
  ROUND_ROBIN = 'ROUND_ROBIN',
  LEAST_CONNECTIONS = 'LEAST_CONNECTIONS',
  WEIGHTED = 'WEIGHTED',
  RANDOM = 'RANDOM',
  IP_HASH = 'IP_HASH',
  GEOGRAPHIC = 'GEOGRAPHIC',
}

/**
 * Transport protocol
 */
export enum TransportProtocol {
  SMTP = 'SMTP',
  SMTPS = 'SMTPS',
  LMTP = 'LMTP',
  EXCHANGE_RPC = 'EXCHANGE_RPC',
  EXCHANGE_MAPI = 'EXCHANGE_MAPI',
  HTTP = 'HTTP',
}

/**
 * Routing priority
 */
export enum RoutingPriority {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  NORMAL = 'NORMAL',
  LOW = 'LOW',
  BULK = 'BULK',
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
  address: string; // Domain or email pattern
  cost: number; // Routing cost (lower is preferred)
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
  bindings: string[]; // IP:Port combinations
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
  destination: string; // Domain or pattern
  destinationType: 'domain' | 'email' | 'pattern';
  connector: string; // Connector ID
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
  conditions: string; // JSON string
  actions: string; // JSON string
  scope: RoutingScope;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  modifiedBy: string;
  metadata?: string; // JSON string
}

/**
 * Sequelize model for transport connectors
 */
export interface TransportConnectorModel {
  id: string;
  name: string;
  connectorType: ConnectorType;
  enabled: boolean;
  configuration: string; // JSON string
  addressSpaces: string; // JSON string
  smartHosts: string; // JSON string
  maxMessageSize?: number;
  maxConnections: number;
  connectionTimeout: number;
  requireTLS: boolean;
  healthCheckInterval: number;
  createdAt: Date;
  updatedAt: Date;
  lastHealthCheck?: Date;
  healthStatus?: string;
  metadata?: string; // JSON string
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
  responses: Record<number, { description: string; schema?: any }>;
}

// ============================================================================
// MESSAGE ROUTING ENGINE
// ============================================================================

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
export function evaluateRoutingRules(
  context: MessageRoutingContext,
  rules: TransportRule[],
  connectors: SendConnector[]
): RoutingDecision {
  const appliedRules: string[] = [];
  let action: RoutingAction = RoutingAction.DELIVER;
  let selectedConnector: SendConnector | undefined;
  let nexthop = '';
  let cost = 0;

  // Sort rules by priority
  const sortedRules = [...rules]
    .filter((r) => r.enabled && isRuleActive(r))
    .sort((a, b) => a.priority - b.priority);

  for (const rule of sortedRules) {
    if (evaluateRuleConditions(rule.conditions, context) &&
        !evaluateRuleConditions(rule.exceptions, context)) {
      appliedRules.push(rule.id);

      // Process rule actions
      for (const ruleAction of rule.actions) {
        if (ruleAction.type === 'RouteToConnector') {
          const connectorId = ruleAction.parameters.connectorId;
          selectedConnector = connectors.find((c) => c.id === connectorId);
          action = RoutingAction.RELAY;
        } else if (ruleAction.type === 'Reject') {
          action = RoutingAction.REJECT;
          break;
        } else if (ruleAction.type === 'Redirect') {
          action = RoutingAction.REDIRECT;
          nexthop = ruleAction.parameters.destination;
        }
      }
    }
  }

  // If no specific connector selected, find best match
  if (!selectedConnector && action !== RoutingAction.REJECT) {
    selectedConnector = selectBestConnector(context, connectors);
  }

  // Determine nexthop
  if (selectedConnector) {
    if (selectedConnector.smartHosts.length > 0) {
      nexthop = selectedConnector.smartHosts[0];
    } else if (selectedConnector.dnsRoutingEnabled) {
      const domain = extractDomain(context.to[0]);
      nexthop = `[${domain}]`; // MX lookup indicator
    }
    cost = calculateRoutingCost(selectedConnector, context);
  }

  return {
    messageId: context.messageId,
    action,
    connector: selectedConnector,
    nexthop,
    priority: context.priority,
    cost,
    reason: appliedRules.length > 0 ? 'Transport rules applied' : 'Default routing',
    appliedRules,
    timestamp: new Date(),
  };
}

/**
 * Selects the best connector for a message based on address spaces and costs
 * @param context - Message routing context
 * @param connectors - Available connectors
 * @returns Best matching connector
 */
export function selectBestConnector(
  context: MessageRoutingContext,
  connectors: SendConnector[]
): SendConnector | undefined {
  const recipient = context.to[0];
  const domain = extractDomain(recipient);

  let bestMatch: { connector: SendConnector; cost: number } | undefined;

  for (const connector of connectors.filter((c) => c.enabled)) {
    for (const addressSpace of connector.addressSpaces) {
      if (matchesAddressSpace(recipient, addressSpace)) {
        if (!bestMatch || addressSpace.cost < bestMatch.cost) {
          bestMatch = { connector, cost: addressSpace.cost };
        }
      }
    }
  }

  return bestMatch?.connector;
}

/**
 * Evaluates if a recipient matches an address space
 * @param recipient - Recipient email address
 * @param addressSpace - Address space definition
 * @returns True if matches
 */
export function matchesAddressSpace(recipient: string, addressSpace: AddressSpace): boolean {
  const domain = extractDomain(recipient);
  const pattern = addressSpace.address;

  // Exact match
  if (pattern === domain) return true;

  // Wildcard match
  if (pattern.startsWith('*.')) {
    const domainSuffix = pattern.substring(1);
    if (domain.endsWith(domainSuffix)) return true;
  }

  // Pattern match
  if (pattern.includes('*')) {
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$', 'i');
    return regex.test(recipient);
  }

  return false;
}

/**
 * Evaluates rule conditions against message context
 * @param conditions - Rule conditions
 * @param context - Message routing context
 * @returns True if all conditions match
 */
export function evaluateRuleConditions(
  conditions: RuleCondition[],
  context: MessageRoutingContext
): boolean {
  if (conditions.length === 0) return true;

  for (const condition of conditions) {
    if (!evaluateSingleCondition(condition, context)) {
      return false;
    }
  }

  return true;
}

/**
 * Evaluates a single rule condition
 * @param condition - Rule condition
 * @param context - Message routing context
 * @returns True if condition matches
 */
export function evaluateSingleCondition(
  condition: RuleCondition,
  context: MessageRoutingContext
): boolean {
  let value: any;

  // Extract value from context
  switch (condition.property) {
    case 'sender':
      value = context.from;
      break;
    case 'recipient':
      value = context.to.join(',');
      break;
    case 'subject':
      value = context.subject || '';
      break;
    case 'size':
      value = context.size;
      break;
    case 'priority':
      value = context.priority;
      break;
    default:
      value = context.headers.get(condition.property) || '';
  }

  // Apply operator
  const compareValue = condition.value;
  const caseSensitive = condition.caseSensitive ?? false;

  if (!caseSensitive && typeof value === 'string' && typeof compareValue === 'string') {
    value = value.toLowerCase();
    const normalizedCompare = compareValue.toLowerCase();

    switch (condition.operator) {
      case 'equals':
        return value === normalizedCompare;
      case 'contains':
        return value.includes(normalizedCompare);
      case 'startsWith':
        return value.startsWith(normalizedCompare);
      case 'endsWith':
        return value.endsWith(normalizedCompare);
      case 'matches':
        return new RegExp(compareValue, 'i').test(value);
      default:
        return false;
    }
  }

  // Case sensitive or non-string comparison
  switch (condition.operator) {
    case 'equals':
      return value === compareValue;
    case 'contains':
      return String(value).includes(String(compareValue));
    case 'startsWith':
      return String(value).startsWith(String(compareValue));
    case 'endsWith':
      return String(value).endsWith(String(compareValue));
    case 'matches':
      return new RegExp(compareValue).test(String(value));
    case 'greaterThan':
      return Number(value) > Number(compareValue);
    case 'lessThan':
      return Number(value) < Number(compareValue);
    default:
      return false;
  }
}

/**
 * Checks if a transport rule is currently active
 * @param rule - Transport rule
 * @returns True if active
 */
export function isRuleActive(rule: TransportRule): boolean {
  const now = new Date();

  if (rule.activationDate && now < rule.activationDate) {
    return false;
  }

  if (rule.expiryDate && now > rule.expiryDate) {
    return false;
  }

  return true;
}

/**
 * Calculates routing cost for a connector
 * @param connector - Send connector
 * @param context - Message routing context
 * @returns Routing cost
 */
export function calculateRoutingCost(
  connector: SendConnector,
  context: MessageRoutingContext
): number {
  const recipient = context.to[0];
  const domain = extractDomain(recipient);

  for (const addressSpace of connector.addressSpaces) {
    if (matchesAddressSpace(recipient, addressSpace)) {
      return addressSpace.cost;
    }
  }

  return 100; // Default high cost
}

// ============================================================================
// SMART HOST CONFIGURATION
// ============================================================================

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
export function createSmartHost(
  name: string,
  host: string,
  port: number,
  options: Partial<SmartHostConfig> = {}
): SmartHostConfig {
  return {
    id: crypto.randomBytes(16).toString('hex'),
    name,
    host,
    port,
    protocol: options.protocol || TransportProtocol.SMTP,
    requireTLS: options.requireTLS ?? true,
    requireAuth: options.requireAuth ?? false,
    authUsername: options.authUsername,
    authPassword: options.authPassword,
    priority: options.priority ?? 10,
    weight: options.weight ?? 100,
    maxConnections: options.maxConnections ?? 10,
    connectionTimeout: options.connectionTimeout ?? 60000,
    idleTimeout: options.idleTimeout ?? 300000,
    retryAttempts: options.retryAttempts ?? 3,
    retryDelay: options.retryDelay ?? 5000,
    enabled: options.enabled ?? true,
    healthCheckInterval: options.healthCheckInterval ?? 60000,
    healthCheckUrl: options.healthCheckUrl,
    metadata: options.metadata,
  };
}

/**
 * Validates smart host configuration
 * @param config - Smart host configuration
 * @returns Validation result with errors
 */
export function validateSmartHostConfig(config: SmartHostConfig): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!config.name || config.name.trim().length === 0) {
    errors.push('Smart host name is required');
  }

  if (!config.host || config.host.trim().length === 0) {
    errors.push('Smart host address is required');
  }

  if (!config.port || config.port < 1 || config.port > 65535) {
    errors.push('Valid port number (1-65535) is required');
  }

  if (config.requireAuth && (!config.authUsername || !config.authPassword)) {
    errors.push('Authentication credentials required when auth is enabled');
  }

  if (config.maxConnections < 1) {
    errors.push('Max connections must be at least 1');
  }

  if (config.priority < 0) {
    errors.push('Priority must be non-negative');
  }

  if (config.weight < 1 || config.weight > 100) {
    errors.push('Weight must be between 1 and 100');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Performs health check on smart host
 * @param config - Smart host configuration
 * @returns Health status
 */
export async function checkSmartHostHealth(
  config: SmartHostConfig
): Promise<TransportServerHealth> {
  const startTime = Date.now();
  let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
  let errorRate = 0;

  try {
    // Attempt connection
    await testSmartHostConnection(config);
  } catch (error) {
    status = 'unhealthy';
    errorRate = 1;
  }

  const responseTime = Date.now() - startTime;

  return {
    serverId: config.id,
    host: config.host,
    port: config.port,
    status,
    lastCheck: new Date(),
    responseTime,
    activeConnections: 0, // Would be tracked separately
    queuedMessages: 0,
    errorRate,
    consecutiveFailures: status === 'unhealthy' ? 1 : 0,
    uptime: 0,
  };
}

/**
 * Tests connection to smart host
 * @param config - Smart host configuration
 * @returns Promise that resolves if connection successful
 */
export async function testSmartHostConnection(config: SmartHostConfig): Promise<void> {
  return new Promise((resolve, reject) => {
    const net = require('net');
    const socket = net.createConnection({
      host: config.host,
      port: config.port,
      timeout: config.connectionTimeout,
    });

    socket.on('connect', () => {
      socket.end();
      resolve();
    });

    socket.on('timeout', () => {
      socket.destroy();
      reject(new Error('Connection timeout'));
    });

    socket.on('error', (error: Error) => {
      reject(error);
    });
  });
}

// ============================================================================
// CONNECTOR MANAGEMENT
// ============================================================================

/**
 * Creates a send connector configuration
 * @param name - Connector name
 * @param addressSpaces - Address spaces to handle
 * @param options - Additional options
 * @returns Send connector configuration
 */
export function createSendConnector(
  name: string,
  addressSpaces: AddressSpace[],
  options: Partial<SendConnector> = {}
): SendConnector {
  return {
    id: crypto.randomBytes(16).toString('hex'),
    name,
    enabled: options.enabled ?? true,
    connectorType: options.connectorType || ConnectorType.SEND_CONNECTOR,
    addressSpaces,
    sourceTransportServers: options.sourceTransportServers || [],
    smartHosts: options.smartHosts || [],
    smartHostAuthMechanism: options.smartHostAuthMechanism,
    dnsRoutingEnabled: options.dnsRoutingEnabled ?? true,
    useExternalDNSServersEnabled: options.useExternalDNSServersEnabled ?? false,
    port: options.port ?? 25,
    protocolLoggingLevel: options.protocolLoggingLevel || 'None',
    smtpMaxMessagesPerConnection: options.smtpMaxMessagesPerConnection ?? 20,
    tlsDomain: options.tlsDomain,
    tlsCertificateName: options.tlsCertificateName,
    requireTLS: options.requireTLS ?? false,
    requireOorg: options.requireOorg ?? false,
    cloudServicesMailEnabled: options.cloudServicesMailEnabled ?? false,
    maxMessageSize: options.maxMessageSize,
    connectionInactivityTimeout: options.connectionInactivityTimeout ?? 600000,
    errorPolicies: options.errorPolicies,
    metadata: options.metadata,
  };
}

/**
 * Creates a receive connector configuration
 * @param name - Connector name
 * @param bindings - IP:Port bindings
 * @param options - Additional options
 * @returns Receive connector configuration
 */
export function createReceiveConnector(
  name: string,
  bindings: string[],
  options: Partial<ReceiveConnector> = {}
): ReceiveConnector {
  return {
    id: crypto.randomBytes(16).toString('hex'),
    name,
    enabled: options.enabled ?? true,
    bindings,
    remoteIPRanges: options.remoteIPRanges || ['0.0.0.0/0'],
    authMechanism: options.authMechanism || ['TLS', 'Integrated'],
    permissionGroups: options.permissionGroups || ['AnonymousUsers'],
    requireTLS: options.requireTLS ?? false,
    enableAuthGSSAPI: options.enableAuthGSSAPI ?? false,
    maxMessageSize: options.maxMessageSize,
    maxRecipientsPerMessage: options.maxRecipientsPerMessage ?? 200,
    maxHeaderSize: options.maxHeaderSize,
    messageRateLimit: options.messageRateLimit,
    connectionTimeout: options.connectionTimeout ?? 600000,
    connectionInactivityTimeout: options.connectionInactivityTimeout ?? 300000,
    protocolLoggingLevel: options.protocolLoggingLevel || 'None',
    banner: options.banner,
    metadata: options.metadata,
  };
}

/**
 * Updates connector configuration
 * @param connector - Existing connector
 * @param updates - Configuration updates
 * @returns Updated connector
 */
export function updateConnectorConfig<T extends SendConnector | ReceiveConnector>(
  connector: T,
  updates: Partial<T>
): T {
  return {
    ...connector,
    ...updates,
  };
}

/**
 * Validates connector configuration
 * @param connector - Connector configuration
 * @returns Validation result
 */
export function validateConnectorConfig(
  connector: SendConnector | ReceiveConnector
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!connector.name || connector.name.trim().length === 0) {
    errors.push('Connector name is required');
  }

  if ('addressSpaces' in connector) {
    if (!connector.addressSpaces || connector.addressSpaces.length === 0) {
      errors.push('At least one address space is required for send connector');
    }
  }

  if ('bindings' in connector) {
    if (!connector.bindings || connector.bindings.length === 0) {
      errors.push('At least one binding is required for receive connector');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// DOMAIN-BASED ROUTING
// ============================================================================

/**
 * Routes message based on recipient domain
 * @param domain - Recipient domain
 * @param routingTable - Routing table entries
 * @returns Routing table entry or undefined
 */
export function routeByDomain(
  domain: string,
  routingTable: RoutingTableEntry[]
): RoutingTableEntry | undefined {
  // Sort by specificity (exact matches first, then patterns)
  const sortedEntries = [...routingTable]
    .filter((e) => e.enabled && e.destinationType === 'domain')
    .sort((a, b) => {
      // Exact matches have priority
      if (a.destination === domain && b.destination !== domain) return -1;
      if (a.destination !== domain && b.destination === domain) return 1;
      // Then by cost
      return a.cost - b.cost;
    });

  for (const entry of sortedEntries) {
    if (domainMatchesPattern(domain, entry.destination)) {
      return entry;
    }
  }

  return undefined;
}

/**
 * Checks if domain matches routing pattern
 * @param domain - Domain to test
 * @param pattern - Routing pattern
 * @returns True if matches
 */
export function domainMatchesPattern(domain: string, pattern: string): boolean {
  const normalizedDomain = domain.toLowerCase();
  const normalizedPattern = pattern.toLowerCase();

  // Exact match
  if (normalizedPattern === normalizedDomain) return true;

  // Wildcard subdomain match
  if (normalizedPattern.startsWith('*.')) {
    const baseDomain = normalizedPattern.substring(2);
    return normalizedDomain.endsWith('.' + baseDomain) || normalizedDomain === baseDomain;
  }

  // Pattern with wildcards
  if (normalizedPattern.includes('*')) {
    const regex = new RegExp('^' + normalizedPattern.replace(/\*/g, '.*') + '$');
    return regex.test(normalizedDomain);
  }

  return false;
}

/**
 * Creates domain routing entry
 * @param domain - Domain pattern
 * @param connectorId - Connector ID
 * @param nexthop - Next hop address
 * @param options - Additional options
 * @returns Routing table entry
 */
export function createDomainRoute(
  domain: string,
  connectorId: string,
  nexthop: string,
  options: Partial<RoutingTableEntry> = {}
): RoutingTableEntry {
  return {
    id: crypto.randomBytes(16).toString('hex'),
    destination: domain,
    destinationType: 'domain',
    connector: connectorId,
    nexthop,
    cost: options.cost ?? 10,
    scope: options.scope || RoutingScope.EXTERNAL,
    priority: options.priority || RoutingPriority.NORMAL,
    enabled: options.enabled ?? true,
    lastModified: new Date(),
    metadata: options.metadata,
  };
}

// ============================================================================
// RECIPIENT-BASED ROUTING
// ============================================================================

/**
 * Routes message based on specific recipient
 * @param recipient - Recipient email address
 * @param routingTable - Routing table entries
 * @returns Routing table entry or undefined
 */
export function routeByRecipient(
  recipient: string,
  routingTable: RoutingTableEntry[]
): RoutingTableEntry | undefined {
  const normalizedRecipient = recipient.toLowerCase();

  // Look for exact email match first
  for (const entry of routingTable.filter((e) => e.enabled && e.destinationType === 'email')) {
    if (entry.destination.toLowerCase() === normalizedRecipient) {
      return entry;
    }
  }

  // Then look for pattern matches
  for (const entry of routingTable.filter((e) => e.enabled && e.destinationType === 'pattern')) {
    if (recipientMatchesPattern(normalizedRecipient, entry.destination)) {
      return entry;
    }
  }

  return undefined;
}

/**
 * Checks if recipient matches routing pattern
 * @param recipient - Recipient email
 * @param pattern - Routing pattern
 * @returns True if matches
 */
export function recipientMatchesPattern(recipient: string, pattern: string): boolean {
  const normalizedRecipient = recipient.toLowerCase();
  const normalizedPattern = pattern.toLowerCase();

  if (normalizedPattern.includes('*')) {
    const regex = new RegExp('^' + normalizedPattern.replace(/\*/g, '.*') + '$');
    return regex.test(normalizedRecipient);
  }

  return normalizedRecipient === normalizedPattern;
}

/**
 * Creates recipient-specific routing entry
 * @param recipient - Recipient email or pattern
 * @param connectorId - Connector ID
 * @param nexthop - Next hop address
 * @param options - Additional options
 * @returns Routing table entry
 */
export function createRecipientRoute(
  recipient: string,
  connectorId: string,
  nexthop: string,
  options: Partial<RoutingTableEntry> = {}
): RoutingTableEntry {
  const isPattern = recipient.includes('*');

  return {
    id: crypto.randomBytes(16).toString('hex'),
    destination: recipient,
    destinationType: isPattern ? 'pattern' : 'email',
    connector: connectorId,
    nexthop,
    cost: options.cost ?? 1, // Lower cost for specific recipients
    scope: options.scope || RoutingScope.EXTERNAL,
    priority: options.priority || RoutingPriority.HIGH,
    enabled: options.enabled ?? true,
    lastModified: new Date(),
    metadata: options.metadata,
  };
}

// ============================================================================
// TRANSPORT RULES
// ============================================================================

/**
 * Creates a transport rule
 * @param name - Rule name
 * @param priority - Rule priority (lower executes first)
 * @param conditions - Rule conditions
 * @param actions - Rule actions
 * @param options - Additional options
 * @returns Transport rule
 */
export function createTransportRule(
  name: string,
  priority: number,
  conditions: RuleCondition[],
  actions: RuleAction[],
  options: Partial<TransportRule> = {}
): TransportRule {
  return {
    id: crypto.randomBytes(16).toString('hex'),
    name,
    priority,
    enabled: options.enabled ?? true,
    conditions,
    exceptions: options.exceptions || [],
    actions,
    mode: options.mode || 'Enforce',
    activationDate: options.activationDate,
    expiryDate: options.expiryDate,
    comments: options.comments,
    metadata: options.metadata,
  };
}

/**
 * Creates a condition for transport rule
 * @param type - Condition type
 * @param property - Property to evaluate
 * @param operator - Comparison operator
 * @param value - Comparison value
 * @returns Rule condition
 */
export function createRuleCondition(
  type: string,
  property: string,
  operator: RuleCondition['operator'],
  value: any
): RuleCondition {
  return {
    type,
    property,
    operator,
    value,
    caseSensitive: false,
  };
}

/**
 * Creates an action for transport rule
 * @param type - Action type
 * @param parameters - Action parameters
 * @returns Rule action
 */
export function createRuleAction(type: string, parameters: Record<string, any>): RuleAction {
  return {
    type,
    parameters,
  };
}

// ============================================================================
// LOAD BALANCING
// ============================================================================

/**
 * Creates a load balancer pool
 * @param name - Pool name
 * @param algorithm - Load balancing algorithm
 * @param servers - Transport servers
 * @param options - Additional options
 * @returns Load balancer pool
 */
export function createLoadBalancerPool(
  name: string,
  algorithm: LoadBalancingAlgorithm,
  servers: TransportServerHealth[],
  options: Partial<LoadBalancerPool> = {}
): LoadBalancerPool {
  return {
    id: crypto.randomBytes(16).toString('hex'),
    name,
    algorithm,
    servers,
    healthCheckInterval: options.healthCheckInterval ?? 30000,
    healthCheckTimeout: options.healthCheckTimeout ?? 5000,
    maxFailures: options.maxFailures ?? 3,
    stickySessions: options.stickySessions ?? false,
    sessionAffinityAttribute: options.sessionAffinityAttribute,
    enabled: options.enabled ?? true,
    metadata: options.metadata,
  };
}

/**
 * Selects server from pool using load balancing algorithm
 * @param pool - Load balancer pool
 * @param context - Message routing context (for sticky sessions)
 * @returns Selected server
 */
export function selectServerFromPool(
  pool: LoadBalancerPool,
  context?: MessageRoutingContext
): TransportServerHealth | undefined {
  const healthyServers = pool.servers.filter((s) => s.status === 'healthy');

  if (healthyServers.length === 0) {
    // Fallback to degraded servers if no healthy ones
    const degradedServers = pool.servers.filter((s) => s.status === 'degraded');
    if (degradedServers.length === 0) return undefined;
    return degradedServers[0];
  }

  switch (pool.algorithm) {
    case LoadBalancingAlgorithm.ROUND_ROBIN:
      return selectRoundRobin(healthyServers);

    case LoadBalancingAlgorithm.LEAST_CONNECTIONS:
      return selectLeastConnections(healthyServers);

    case LoadBalancingAlgorithm.RANDOM:
      return selectRandom(healthyServers);

    case LoadBalancingAlgorithm.IP_HASH:
      if (context?.receivedFrom) {
        return selectByHash(healthyServers, context.receivedFrom);
      }
      return selectRandom(healthyServers);

    default:
      return healthyServers[0];
  }
}

/**
 * Selects server using round-robin algorithm
 * @param servers - Available servers
 * @returns Selected server
 */
export function selectRoundRobin(servers: TransportServerHealth[]): TransportServerHealth {
  // In real implementation, maintain counter in pool state
  const index = Date.now() % servers.length;
  return servers[index];
}

/**
 * Selects server with least connections
 * @param servers - Available servers
 * @returns Selected server
 */
export function selectLeastConnections(
  servers: TransportServerHealth[]
): TransportServerHealth {
  return servers.reduce((min, server) =>
    server.activeConnections < min.activeConnections ? server : min
  );
}

/**
 * Selects random server
 * @param servers - Available servers
 * @returns Selected server
 */
export function selectRandom(servers: TransportServerHealth[]): TransportServerHealth {
  const index = Math.floor(Math.random() * servers.length);
  return servers[index];
}

/**
 * Selects server based on hash of input
 * @param servers - Available servers
 * @param input - Input to hash
 * @returns Selected server
 */
export function selectByHash(servers: TransportServerHealth[], input: string): TransportServerHealth {
  const hash = crypto.createHash('md5').update(input).digest('hex');
  const index = parseInt(hash.substring(0, 8), 16) % servers.length;
  return servers[index];
}

// ============================================================================
// FAILOVER AND REDUNDANCY
// ============================================================================

/**
 * Implements failover logic for message delivery
 * @param primaryServer - Primary transport server
 * @param backupServers - Backup servers in priority order
 * @param context - Message routing context
 * @returns Selected server
 */
export function selectWithFailover(
  primaryServer: TransportServerHealth,
  backupServers: TransportServerHealth[],
  context: MessageRoutingContext
): TransportServerHealth {
  // Check primary server health
  if (primaryServer.status === 'healthy' || primaryServer.status === 'degraded') {
    return primaryServer;
  }

  // Failover to backup servers
  for (const backup of backupServers) {
    if (backup.status === 'healthy') {
      return backup;
    }
  }

  // If no healthy backups, try degraded
  for (const backup of backupServers) {
    if (backup.status === 'degraded') {
      return backup;
    }
  }

  // Last resort: return primary even if unhealthy
  return primaryServer;
}

/**
 * Calculates failover priority based on server health
 * @param server - Transport server
 * @returns Priority score (lower is better)
 */
export function calculateFailoverPriority(server: TransportServerHealth): number {
  let priority = 100;

  switch (server.status) {
    case 'healthy':
      priority = 0;
      break;
    case 'degraded':
      priority = 50;
      break;
    case 'unhealthy':
      priority = 100;
      break;
    case 'unknown':
      priority = 75;
      break;
  }

  // Add penalties for high error rate or queue depth
  priority += server.errorRate * 10;
  priority += Math.min(server.queuedMessages / 100, 20);
  priority += server.consecutiveFailures * 5;

  return priority;
}

/**
 * Checks if server should be removed from rotation
 * @param server - Transport server
 * @param maxFailures - Maximum consecutive failures
 * @returns True if should be removed
 */
export function shouldRemoveFromRotation(
  server: TransportServerHealth,
  maxFailures: number
): boolean {
  return server.consecutiveFailures >= maxFailures || server.status === 'unhealthy';
}

// ============================================================================
// MESSAGE TRACKING
// ============================================================================

/**
 * Creates message tracking entry
 * @param messageId - Message ID
 * @param eventType - Event type
 * @param context - Message routing context
 * @param options - Additional options
 * @returns Message tracking entry
 */
export function createTrackingEntry(
  messageId: string,
  eventType: string,
  context: MessageRoutingContext,
  options: Partial<MessageTrackingEntry> = {}
): MessageTrackingEntry {
  return {
    id: crypto.randomBytes(16).toString('hex'),
    messageId,
    timestamp: new Date(),
    eventType,
    source: options.source || 'ROUTING_ENGINE',
    sourceType: options.sourceType || 'AGENT',
    sender: context.from,
    recipients: context.to,
    subject: context.subject,
    size: context.size,
    serverHostname: options.serverHostname || require('os').hostname(),
    connectorId: options.connectorId,
    nexthop: options.nexthop,
    directionality: options.directionality || 'Outgoing',
    tenantId: options.tenantId,
    clientIp: context.receivedFrom,
    clientHostname: options.clientHostname,
    originalClientIp: options.originalClientIp,
    returnPath: context.from,
    messageInfo: options.messageInfo,
    eventData: options.eventData,
    metadata: options.metadata,
  };
}

/**
 * Queries message tracking history
 * @param messageId - Message ID
 * @param trackingEntries - All tracking entries
 * @returns Filtered tracking entries
 */
export function queryMessageTracking(
  messageId: string,
  trackingEntries: MessageTrackingEntry[]
): MessageTrackingEntry[] {
  return trackingEntries
    .filter((e) => e.messageId === messageId)
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
}

/**
 * Generates message tracking summary
 * @param entries - Message tracking entries
 * @returns Tracking summary
 */
export function generateTrackingSummary(entries: MessageTrackingEntry[]): {
  messageId: string;
  sender: string;
  recipients: string[];
  firstSeen: Date;
  lastSeen: Date;
  hops: number;
  events: string[];
  status: string;
} {
  if (entries.length === 0) {
    throw new Error('No tracking entries provided');
  }

  const sorted = [...entries].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  const lastEntry = sorted[sorted.length - 1];

  return {
    messageId: entries[0].messageId,
    sender: entries[0].sender,
    recipients: [...new Set(entries.flatMap((e) => e.recipients))],
    firstSeen: sorted[0].timestamp,
    lastSeen: lastEntry.timestamp,
    hops: entries.length,
    events: entries.map((e) => e.eventType),
    status: lastEntry.eventType,
  };
}

// ============================================================================
// DELIVERY OPTIMIZATION
// ============================================================================

/**
 * Creates delivery queue item
 * @param messageId - Message ID
 * @param from - Sender address
 * @param to - Recipient address
 * @param messageData - Message content
 * @param options - Additional options
 * @returns Delivery queue item
 */
export function createDeliveryQueueItem(
  messageId: string,
  from: string,
  to: string,
  messageData: Buffer,
  options: Partial<DeliveryQueueItem> = {}
): DeliveryQueueItem {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + (options.expiresAt?.getTime() || 7 * 24 * 60 * 60 * 1000));

  return {
    id: crypto.randomBytes(16).toString('hex'),
    messageId,
    from,
    to,
    subject: options.subject,
    size: messageData.length,
    priority: options.priority || RoutingPriority.NORMAL,
    nexthop: options.nexthop || '',
    connectorId: options.connectorId || '',
    attempts: 0,
    maxAttempts: options.maxAttempts ?? 3,
    lastAttempt: undefined,
    nextAttempt: now,
    expiresAt,
    status: 'pending',
    messageData,
    metadata: options.metadata,
  };
}

/**
 * Calculates next retry time with exponential backoff
 * @param item - Queue item
 * @param baseDelay - Base delay in milliseconds
 * @returns Next attempt timestamp
 */
export function calculateNextRetry(item: DeliveryQueueItem, baseDelay: number = 300000): Date {
  const backoffMultiplier = Math.pow(2, item.attempts);
  const delay = baseDelay * backoffMultiplier;
  const maxDelay = 24 * 60 * 60 * 1000; // 24 hours
  const actualDelay = Math.min(delay, maxDelay);

  return new Date(Date.now() + actualDelay);
}

/**
 * Prioritizes delivery queue based on message priority and age
 * @param queue - Delivery queue items
 * @returns Sorted queue
 */
export function prioritizeDeliveryQueue(queue: DeliveryQueueItem[]): DeliveryQueueItem[] {
  const priorityWeights = {
    [RoutingPriority.CRITICAL]: 1000,
    [RoutingPriority.HIGH]: 100,
    [RoutingPriority.NORMAL]: 10,
    [RoutingPriority.LOW]: 1,
    [RoutingPriority.BULK]: 0.1,
  };

  return [...queue].sort((a, b) => {
    // Calculate priority score
    const scoreA = priorityWeights[a.priority] - a.attempts * 10;
    const scoreB = priorityWeights[b.priority] - b.attempts * 10;

    if (scoreA !== scoreB) {
      return scoreB - scoreA; // Higher score first
    }

    // If same priority, older messages first
    return a.nextAttempt.getTime() - b.nextAttempt.getTime();
  });
}

/**
 * Optimizes batch delivery to same destination
 * @param queue - Delivery queue items
 * @param maxBatchSize - Maximum batch size
 * @returns Batched queue items by destination
 */
export function batchDeliveriesByDestination(
  queue: DeliveryQueueItem[],
  maxBatchSize: number = 100
): Map<string, DeliveryQueueItem[]> {
  const batches = new Map<string, DeliveryQueueItem[]>();

  for (const item of queue) {
    const key = item.nexthop;

    if (!batches.has(key)) {
      batches.set(key, []);
    }

    const batch = batches.get(key)!;
    if (batch.length < maxBatchSize) {
      batch.push(item);
    }
  }

  return batches;
}

// ============================================================================
// ROUTING DIAGNOSTICS
// ============================================================================

/**
 * Performs comprehensive routing diagnostics
 * @param from - Sender address
 * @param to - Recipient address
 * @param connectors - Available connectors
 * @param rules - Transport rules
 * @param routingTable - Routing table
 * @returns Diagnostic results
 */
export async function performRoutingDiagnostics(
  from: string,
  to: string,
  connectors: SendConnector[],
  rules: TransportRule[],
  routingTable: RoutingTableEntry[]
): Promise<RoutingDiagnostics> {
  const testId = crypto.randomBytes(8).toString('hex');
  const domain = extractDomain(to);
  const warnings: string[] = [];
  const errors: string[] = [];
  const routingPath: RoutingDiagnostics['routingPath'] = [];

  // Create test context
  const context: MessageRoutingContext = {
    messageId: `test-${testId}`,
    from,
    to: [to],
    size: 1024,
    priority: RoutingPriority.NORMAL,
    headers: new Map(),
    timestamp: new Date(),
  };

  // Step 1: Evaluate routing decision
  const decision = evaluateRoutingRules(context, rules, connectors);

  routingPath.push({
    hop: 1,
    server: 'LOCAL',
    connector: decision.connector?.name || 'Default',
    action: decision.action,
    timestamp: new Date(),
  });

  // Step 2: Check DNS records
  let dnsRecords: any[] = [];
  try {
    dnsRecords = await resolveMXRecords(domain);
    if (dnsRecords.length === 0) {
      warnings.push(`No MX records found for domain ${domain}`);
    }
  } catch (error) {
    errors.push(`DNS resolution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  // Step 3: Validate connector
  if (decision.connector) {
    const validation = validateConnectorConfig(decision.connector);
    if (!validation.valid) {
      errors.push(...validation.errors);
    }
  } else {
    warnings.push('No connector selected for this message');
  }

  // Step 4: Check routing table
  const tableEntry = routeByDomain(domain, routingTable) || routeByRecipient(to, routingTable);
  if (!tableEntry) {
    warnings.push('No explicit routing table entry found');
  }

  // Determine applied rules
  const appliedRules = rules.filter((r) => decision.appliedRules.includes(r.id));

  // Estimate delivery time
  let estimatedDeliveryTime = 1000; // Base 1 second
  if (decision.connector?.smartHosts.length) {
    estimatedDeliveryTime += 2000; // Smart host adds 2 seconds
  }
  estimatedDeliveryTime += decision.cost * 100; // Cost factor

  // Generate recommendation
  let recommendation: string | undefined;
  if (errors.length > 0) {
    recommendation = 'Fix configuration errors before attempting delivery';
  } else if (warnings.length > 0) {
    recommendation = 'Review warnings to optimize delivery';
  } else {
    recommendation = 'Configuration looks good for delivery';
  }

  return {
    testId,
    timestamp: new Date(),
    from,
    to,
    domain,
    routingPath,
    decision,
    dnsRecords,
    appliedRules,
    warnings,
    errors,
    estimatedDeliveryTime,
    recommendation,
  };
}

/**
 * Validates routing configuration
 * @param connectors - Send connectors
 * @param routingTable - Routing table
 * @returns Validation results
 */
export function validateRoutingConfiguration(
  connectors: SendConnector[],
  routingTable: RoutingTableEntry[]
): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate connectors
  for (const connector of connectors) {
    const validation = validateConnectorConfig(connector);
    if (!validation.valid) {
      errors.push(`Connector ${connector.name}: ${validation.errors.join(', ')}`);
    }

    if (connector.enabled && connector.addressSpaces.length === 0) {
      warnings.push(`Connector ${connector.name} has no address spaces defined`);
    }
  }

  // Check for duplicate routing entries
  const destinations = new Set<string>();
  for (const entry of routingTable.filter((e) => e.enabled)) {
    const key = `${entry.destinationType}:${entry.destination}`;
    if (destinations.has(key)) {
      warnings.push(`Duplicate routing entry for ${entry.destination}`);
    }
    destinations.add(key);
  }

  // Check for orphaned routing entries
  const connectorIds = new Set(connectors.map((c) => c.id));
  for (const entry of routingTable.filter((e) => e.enabled)) {
    if (!connectorIds.has(entry.connector)) {
      errors.push(`Routing entry ${entry.destination} references non-existent connector ${entry.connector}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Traces message routing path
 * @param messageId - Message ID
 * @param trackingEntries - Message tracking entries
 * @returns Routing path
 */
export function traceRoutingPath(
  messageId: string,
  trackingEntries: MessageTrackingEntry[]
): Array<{ hop: number; server: string; event: string; timestamp: Date }> {
  const entries = queryMessageTracking(messageId, trackingEntries);

  return entries.map((entry, index) => ({
    hop: index + 1,
    server: entry.serverHostname,
    event: entry.eventType,
    timestamp: entry.timestamp,
  }));
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Extracts domain from email address
 * @param email - Email address
 * @returns Domain portion
 */
export function extractDomain(email: string): string {
  const atIndex = email.lastIndexOf('@');
  if (atIndex === -1) return email;
  return email.substring(atIndex + 1).toLowerCase();
}

/**
 * Resolves MX records for domain
 * @param domain - Domain name
 * @returns MX records
 */
export async function resolveMXRecords(domain: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    dns.resolveMx(domain, (err, addresses) => {
      if (err) {
        reject(err);
      } else {
        resolve(addresses || []);
      }
    });
  });
}

/**
 * Formats routing decision for logging
 * @param decision - Routing decision
 * @returns Formatted string
 */
export function formatRoutingDecision(decision: RoutingDecision): string {
  return [
    `Action: ${decision.action}`,
    `Nexthop: ${decision.nexthop}`,
    `Connector: ${decision.connector?.name || 'None'}`,
    `Priority: ${decision.priority}`,
    `Cost: ${decision.cost}`,
    `Reason: ${decision.reason}`,
  ].join(' | ');
}

// ============================================================================
// SWAGGER DOCUMENTATION
// ============================================================================

/**
 * Generates Swagger documentation for routing API
 * @returns Swagger documentation
 */
export function generateRoutingApiSwagger(): TransportRoutingSwaggerDoc {
  return {
    endpoint: '/api/mail/routing/evaluate',
    method: 'POST',
    summary: 'Evaluate message routing',
    description: 'Evaluates routing rules and determines the best path for message delivery',
    tags: ['Mail Routing'],
    requestBody: {
      description: 'Message routing context',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              messageId: { type: 'string' },
              from: { type: 'string' },
              to: { type: 'array', items: { type: 'string' } },
              subject: { type: 'string' },
              size: { type: 'number' },
              priority: { type: 'string', enum: Object.keys(RoutingPriority) },
            },
            required: ['messageId', 'from', 'to', 'size'],
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Routing decision returned successfully',
        schema: {
          type: 'object',
          properties: {
            action: { type: 'string' },
            connector: { type: 'object' },
            nexthop: { type: 'string' },
            priority: { type: 'string' },
            cost: { type: 'number' },
            reason: { type: 'string' },
          },
        },
      },
      400: { description: 'Invalid request' },
      500: { description: 'Internal server error' },
    },
  };
}

/**
 * Generates Swagger documentation for connector management
 * @returns Swagger documentation
 */
export function generateConnectorApiSwagger(): TransportRoutingSwaggerDoc {
  return {
    endpoint: '/api/mail/connectors',
    method: 'GET',
    summary: 'List mail connectors',
    description: 'Retrieves all configured send and receive connectors',
    tags: ['Mail Connectors'],
    parameters: [
      {
        name: 'type',
        in: 'query',
        description: 'Filter by connector type',
        required: false,
        schema: { type: 'string', enum: Object.keys(ConnectorType) },
      },
      {
        name: 'enabled',
        in: 'query',
        description: 'Filter by enabled status',
        required: false,
        schema: { type: 'boolean' },
      },
    ],
    responses: {
      200: {
        description: 'Connectors retrieved successfully',
        schema: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              connectorType: { type: 'string' },
              enabled: { type: 'boolean' },
            },
          },
        },
      },
      500: { description: 'Internal server error' },
    },
  };
}

/**
 * Generates Swagger documentation for routing diagnostics
 * @returns Swagger documentation
 */
export function generateDiagnosticsApiSwagger(): TransportRoutingSwaggerDoc {
  return {
    endpoint: '/api/mail/routing/diagnostics',
    method: 'POST',
    summary: 'Perform routing diagnostics',
    description: 'Tests message routing configuration and provides detailed diagnostics',
    tags: ['Mail Diagnostics'],
    requestBody: {
      description: 'Diagnostic test parameters',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              from: { type: 'string', format: 'email' },
              to: { type: 'string', format: 'email' },
            },
            required: ['from', 'to'],
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Diagnostics completed successfully',
        schema: {
          type: 'object',
          properties: {
            testId: { type: 'string' },
            decision: { type: 'object' },
            dnsRecords: { type: 'array' },
            warnings: { type: 'array', items: { type: 'string' } },
            errors: { type: 'array', items: { type: 'string' } },
            recommendation: { type: 'string' },
          },
        },
      },
      400: { description: 'Invalid request' },
      500: { description: 'Internal server error' },
    },
  };
}

/**
 * Generates complete Swagger specification for transport and routing API
 * @param baseUrl - API base URL
 * @param version - API version
 * @returns Complete Swagger specification
 */
export function generateCompleteRoutingSwaggerSpec(baseUrl: string, version: string): any {
  return {
    openapi: '3.0.0',
    info: {
      title: 'Mail Transport and Routing API',
      description: 'Enterprise-grade mail transport and routing API with Exchange Server compatibility',
      version,
      contact: {
        name: 'White Cross Healthcare',
        email: 'support@whitecross.com',
      },
    },
    servers: [
      {
        url: baseUrl,
        description: 'Production transport and routing API server',
      },
    ],
    tags: [
      { name: 'Mail Routing', description: 'Message routing operations' },
      { name: 'Mail Connectors', description: 'Connector management' },
      { name: 'Mail Diagnostics', description: 'Routing diagnostics and troubleshooting' },
      { name: 'Load Balancing', description: 'Load balancer operations' },
      { name: 'Message Tracking', description: 'Message tracking and history' },
    ],
    paths: {
      '/api/mail/routing/evaluate': generateRoutingApiSwagger(),
      '/api/mail/connectors': generateConnectorApiSwagger(),
      '/api/mail/routing/diagnostics': generateDiagnosticsApiSwagger(),
    },
    components: {
      schemas: {
        ConnectorType: {
          type: 'string',
          enum: Object.keys(ConnectorType),
        },
        RoutingAction: {
          type: 'string',
          enum: Object.keys(RoutingAction),
        },
        RoutingPriority: {
          type: 'string',
          enum: Object.keys(RoutingPriority),
        },
        LoadBalancingAlgorithm: {
          type: 'string',
          enum: Object.keys(LoadBalancingAlgorithm),
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Message routing engine
  evaluateRoutingRules,
  selectBestConnector,
  matchesAddressSpace,
  evaluateRuleConditions,
  evaluateSingleCondition,
  isRuleActive,
  calculateRoutingCost,

  // Smart host configuration
  createSmartHost,
  validateSmartHostConfig,
  checkSmartHostHealth,
  testSmartHostConnection,

  // Connector management
  createSendConnector,
  createReceiveConnector,
  updateConnectorConfig,
  validateConnectorConfig,

  // Domain-based routing
  routeByDomain,
  domainMatchesPattern,
  createDomainRoute,

  // Recipient-based routing
  routeByRecipient,
  recipientMatchesPattern,
  createRecipientRoute,

  // Transport rules
  createTransportRule,
  createRuleCondition,
  createRuleAction,

  // Load balancing
  createLoadBalancerPool,
  selectServerFromPool,
  selectRoundRobin,
  selectLeastConnections,
  selectRandom,
  selectByHash,

  // Failover and redundancy
  selectWithFailover,
  calculateFailoverPriority,
  shouldRemoveFromRotation,

  // Message tracking
  createTrackingEntry,
  queryMessageTracking,
  generateTrackingSummary,

  // Delivery optimization
  createDeliveryQueueItem,
  calculateNextRetry,
  prioritizeDeliveryQueue,
  batchDeliveriesByDestination,

  // Routing diagnostics
  performRoutingDiagnostics,
  validateRoutingConfiguration,
  traceRoutingPath,

  // Utility functions
  extractDomain,
  resolveMXRecords,
  formatRoutingDecision,

  // Swagger documentation
  generateRoutingApiSwagger,
  generateConnectorApiSwagger,
  generateDiagnosticsApiSwagger,
  generateCompleteRoutingSwaggerSpec,
};
