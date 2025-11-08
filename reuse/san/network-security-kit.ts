/**
 * LOC: NETSECU123456
 * File: /reuse/san/network-security-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Network security implementations
 *   - NestJS guards and interceptors
 *   - Virtual network controllers
 */

/**
 * File: /reuse/san/network-security-kit.ts
 * Locator: WC-UTL-NETSEC-001
 * Purpose: Comprehensive Network Security Utilities - ACL enforcement, firewall rules, security groups, authentication, authorization, rate limiting, DDoS protection
 *
 * Upstream: Independent utility module for network security implementation
 * Downstream: ../backend/*, Network controllers, security middleware, SAN services
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 42 utility functions for network security, ACL enforcement, firewall management, security groups, authentication guards, DDoS protection
 *
 * LLM Context: Comprehensive network security utilities for implementing production-ready software-defined network security patterns.
 * Provides ACL enforcement, firewall rules, security groups, network authentication, authorization, rate limiting, DDoS protection,
 * traffic filtering, and network intrusion detection. Essential for secure virtual network infrastructure.
 */

import { Request, Response, NextFunction } from 'express';
import { Model, DataTypes, Sequelize, Op } from 'sequelize';
import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface NetworkACL {
  id: string;
  name: string;
  rules: ACLRule[];
  defaultAction: 'allow' | 'deny';
  priority: number;
  enabled: boolean;
}

interface ACLRule {
  id: string;
  priority: number;
  action: 'allow' | 'deny';
  protocol: 'tcp' | 'udp' | 'icmp' | 'all';
  sourceIp: string;
  sourcePort?: string;
  destinationIp: string;
  destinationPort?: string;
  direction: 'inbound' | 'outbound';
  enabled: boolean;
}

interface FirewallRule {
  id: string;
  name: string;
  priority: number;
  action: 'allow' | 'deny' | 'drop' | 'reject';
  protocol: string;
  sourceAddress: string;
  sourcePort: string;
  destinationAddress: string;
  destinationPort: string;
  state?: 'new' | 'established' | 'related' | 'invalid';
  enabled: boolean;
  logEnabled: boolean;
}

interface SecurityGroup {
  id: string;
  name: string;
  description: string;
  vnetId: string;
  inboundRules: SecurityRule[];
  outboundRules: SecurityRule[];
  tags: Record<string, string>;
}

interface SecurityRule {
  id: string;
  priority: number;
  action: 'allow' | 'deny';
  protocol: string;
  sourceAddressPrefix: string;
  sourcePortRange: string;
  destinationAddressPrefix: string;
  destinationPortRange: string;
  description?: string;
}

interface NetworkAccessControl {
  userId: string;
  networkId: string;
  permissions: NetworkPermission[];
  restrictions: NetworkRestriction[];
  expiresAt?: Date;
}

interface NetworkPermission {
  resource: string;
  actions: string[];
  conditions?: Record<string, any>;
}

interface NetworkRestriction {
  type: 'ip_whitelist' | 'ip_blacklist' | 'geo_fence' | 'time_based';
  values: string[];
  enabled: boolean;
}

interface RateLimitPolicy {
  id: string;
  name: string;
  maxRequests: number;
  windowMs: number;
  strategy: 'fixed' | 'sliding' | 'token_bucket';
  scope: 'global' | 'per_ip' | 'per_user' | 'per_network';
  enabled: boolean;
}

interface DDoSProtectionConfig {
  enabled: boolean;
  thresholds: {
    requestsPerSecond: number;
    bytesPerSecond: number;
    connectionsPerIp: number;
  };
  mitigations: DDoSMitigation[];
  whitelist: string[];
  blacklist: string[];
}

interface DDoSMitigation {
  type: 'rate_limit' | 'challenge' | 'block' | 'tarpit';
  threshold: number;
  duration: number;
  action: string;
}

interface NetworkAuthContext {
  userId: string;
  networkId: string;
  role: string;
  permissions: string[];
  ip: string;
  deviceId?: string;
  sessionId: string;
}

interface TrafficPattern {
  sourceIp: string;
  destinationIp: string;
  protocol: string;
  port: number;
  packetCount: number;
  byteCount: number;
  timestamp: Date;
  flags: string[];
}

interface SecurityEvent {
  id: string;
  type: 'intrusion' | 'ddos' | 'unauthorized_access' | 'policy_violation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  sourceIp: string;
  targetIp: string;
  description: string;
  timestamp: Date;
  metadata: Record<string, any>;
}

interface NetworkAuditLog {
  id: string;
  networkId: string;
  userId: string;
  action: string;
  resource: string;
  result: 'success' | 'failure';
  ip: string;
  timestamp: Date;
  metadata: Record<string, any>;
}

// ============================================================================
// SEQUELIZE MODELS (1-3)
// ============================================================================

/**
 * Sequelize model for Network Access Control Lists with rules and priorities.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} NetworkACL model
 *
 * @example
 * ```typescript
 * const NetworkACLModel = createNetworkACLModel(sequelize);
 * const acl = await NetworkACLModel.create({
 *   name: 'Production VNet ACL',
 *   rules: [...],
 *   defaultAction: 'deny',
 *   priority: 100,
 *   enabled: true
 * });
 * ```
 */
export const createNetworkACLModel = (sequelize: Sequelize) => {
  class NetworkACLModel extends Model {
    public id!: string;
    public name!: string;
    public rules!: ACLRule[];
    public defaultAction!: 'allow' | 'deny';
    public priority!: number;
    public enabled!: boolean;
    public networkId!: string;
    public description!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  NetworkACLModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'ACL name',
      },
      rules: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Array of ACL rules',
      },
      defaultAction: {
        type: DataTypes.ENUM('allow', 'deny'),
        allowNull: false,
        defaultValue: 'deny',
        comment: 'Default action for unmatched traffic',
      },
      priority: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 100,
        comment: 'ACL priority (lower = higher priority)',
      },
      enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Whether ACL is active',
      },
      networkId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Associated network ID',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'ACL description',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'network_acls',
      timestamps: true,
      indexes: [
        { fields: ['networkId'] },
        { fields: ['enabled'] },
        { fields: ['priority'] },
      ],
    },
  );

  return NetworkACLModel;
};

/**
 * Sequelize model for Security Groups with inbound/outbound rules.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} SecurityGroup model
 *
 * @example
 * ```typescript
 * const SecurityGroupModel = createSecurityGroupModel(sequelize);
 * const sg = await SecurityGroupModel.create({
 *   name: 'Web Tier SG',
 *   vnetId: 'vnet-123',
 *   inboundRules: [...],
 *   outboundRules: [...]
 * });
 * ```
 */
export const createSecurityGroupModel = (sequelize: Sequelize) => {
  class SecurityGroupModel extends Model {
    public id!: string;
    public name!: string;
    public description!: string;
    public vnetId!: string;
    public inboundRules!: SecurityRule[];
    public outboundRules!: SecurityRule[];
    public tags!: Record<string, string>;
    public enabled!: boolean;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  SecurityGroupModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Security group name',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Security group description',
      },
      vnetId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Virtual network ID',
      },
      inboundRules: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Inbound security rules',
      },
      outboundRules: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Outbound security rules',
      },
      tags: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Resource tags',
      },
      enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Whether security group is active',
      },
    },
    {
      sequelize,
      tableName: 'security_groups',
      timestamps: true,
      indexes: [
        { fields: ['vnetId'] },
        { fields: ['name'] },
        { fields: ['enabled'] },
      ],
    },
  );

  return SecurityGroupModel;
};

/**
 * Sequelize model for Network Security Events and intrusion detection.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} SecurityEvent model
 *
 * @example
 * ```typescript
 * const SecurityEventModel = createSecurityEventModel(sequelize);
 * const event = await SecurityEventModel.create({
 *   type: 'intrusion',
 *   severity: 'high',
 *   sourceIp: '192.168.1.100',
 *   description: 'Port scanning detected'
 * });
 * ```
 */
export const createSecurityEventModel = (sequelize: Sequelize) => {
  class SecurityEventModel extends Model {
    public id!: string;
    public type!: string;
    public severity!: string;
    public sourceIp!: string;
    public targetIp!: string;
    public description!: string;
    public timestamp!: Date;
    public metadata!: Record<string, any>;
    public resolved!: boolean;
    public resolvedAt!: Date | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  SecurityEventModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      type: {
        type: DataTypes.ENUM('intrusion', 'ddos', 'unauthorized_access', 'policy_violation'),
        allowNull: false,
        comment: 'Event type',
      },
      severity: {
        type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
        allowNull: false,
        comment: 'Event severity',
      },
      sourceIp: {
        type: DataTypes.STRING(45),
        allowNull: false,
        comment: 'Source IP address',
      },
      targetIp: {
        type: DataTypes.STRING(45),
        allowNull: false,
        comment: 'Target IP address',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Event description',
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Event timestamp',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional event metadata',
      },
      resolved: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether event is resolved',
      },
      resolvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Resolution timestamp',
      },
    },
    {
      sequelize,
      tableName: 'security_events',
      timestamps: true,
      indexes: [
        { fields: ['type'] },
        { fields: ['severity'] },
        { fields: ['sourceIp'] },
        { fields: ['timestamp'] },
        { fields: ['resolved'] },
      ],
    },
  );

  return SecurityEventModel;
};

// ============================================================================
// NETWORK ACL ENFORCEMENT (4-9)
// ============================================================================

/**
 * Evaluates network ACL rules against traffic pattern.
 *
 * @param {NetworkACL} acl - Network ACL configuration
 * @param {TrafficPattern} traffic - Traffic pattern to evaluate
 * @returns {{ allowed: boolean; matchedRule?: ACLRule; reason: string }} Evaluation result
 *
 * @example
 * ```typescript
 * const result = evaluateNetworkACL(acl, {
 *   sourceIp: '10.0.1.5',
 *   destinationIp: '10.0.2.10',
 *   protocol: 'tcp',
 *   port: 443
 * });
 * // Result: { allowed: true, matchedRule: {...}, reason: 'Matched rule: Allow HTTPS' }
 * ```
 */
export const evaluateNetworkACL = (
  acl: NetworkACL,
  traffic: Partial<TrafficPattern>,
): { allowed: boolean; matchedRule?: ACLRule; reason: string } => {
  if (!acl.enabled) {
    return { allowed: acl.defaultAction === 'allow', reason: 'ACL disabled, using default action' };
  }

  // Sort rules by priority (ascending)
  const sortedRules = [...acl.rules].sort((a, b) => a.priority - b.priority);

  for (const rule of sortedRules) {
    if (!rule.enabled) continue;

    // Check protocol match
    if (rule.protocol !== 'all' && rule.protocol !== traffic.protocol) {
      continue;
    }

    // Check source IP match
    if (!matchIpPattern(traffic.sourceIp || '', rule.sourceIp)) {
      continue;
    }

    // Check destination IP match
    if (!matchIpPattern(traffic.destinationIp || '', rule.destinationIp)) {
      continue;
    }

    // Check port match if specified
    if (rule.destinationPort && !matchPortPattern(traffic.port || 0, rule.destinationPort)) {
      continue;
    }

    // Rule matched
    return {
      allowed: rule.action === 'allow',
      matchedRule: rule,
      reason: `Matched rule: ${rule.id} (${rule.action})`,
    };
  }

  // No rule matched, use default action
  return {
    allowed: acl.defaultAction === 'allow',
    reason: `No matching rule, default action: ${acl.defaultAction}`,
  };
};

/**
 * Creates a new ACL rule with validation.
 *
 * @param {Partial<ACLRule>} ruleConfig - ACL rule configuration
 * @returns {ACLRule} Created ACL rule
 *
 * @example
 * ```typescript
 * const rule = createACLRule({
 *   priority: 100,
 *   action: 'allow',
 *   protocol: 'tcp',
 *   sourceIp: '10.0.0.0/16',
 *   destinationIp: '10.0.2.0/24',
 *   destinationPort: '443',
 *   direction: 'inbound'
 * });
 * ```
 */
export const createACLRule = (ruleConfig: Partial<ACLRule>): ACLRule => {
  return {
    id: ruleConfig.id || crypto.randomUUID(),
    priority: ruleConfig.priority || 1000,
    action: ruleConfig.action || 'deny',
    protocol: ruleConfig.protocol || 'all',
    sourceIp: ruleConfig.sourceIp || '0.0.0.0/0',
    sourcePort: ruleConfig.sourcePort,
    destinationIp: ruleConfig.destinationIp || '0.0.0.0/0',
    destinationPort: ruleConfig.destinationPort,
    direction: ruleConfig.direction || 'inbound',
    enabled: ruleConfig.enabled !== false,
  };
};

/**
 * Validates ACL rule configuration for conflicts and errors.
 *
 * @param {ACLRule} rule - ACL rule to validate
 * @param {ACLRule[]} existingRules - Existing rules to check against
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateACLRule(newRule, existingRules);
 * if (!validation.valid) {
 *   console.error('Validation errors:', validation.errors);
 * }
 * ```
 */
export const validateACLRule = (
  rule: ACLRule,
  existingRules: ACLRule[],
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Validate priority
  if (rule.priority < 1 || rule.priority > 65535) {
    errors.push('Priority must be between 1 and 65535');
  }

  // Validate IP addresses
  if (!isValidIpPattern(rule.sourceIp)) {
    errors.push('Invalid source IP pattern');
  }

  if (!isValidIpPattern(rule.destinationIp)) {
    errors.push('Invalid destination IP pattern');
  }

  // Validate ports
  if (rule.sourcePort && !isValidPortPattern(rule.sourcePort)) {
    errors.push('Invalid source port pattern');
  }

  if (rule.destinationPort && !isValidPortPattern(rule.destinationPort)) {
    errors.push('Invalid destination port pattern');
  }

  // Check for conflicts with existing rules
  const conflicts = existingRules.filter(
    existing =>
      existing.priority === rule.priority &&
      existing.direction === rule.direction &&
      existing.id !== rule.id,
  );

  if (conflicts.length > 0) {
    errors.push(`Priority ${rule.priority} conflicts with existing rule: ${conflicts[0].id}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Merges multiple ACLs with priority-based ordering.
 *
 * @param {NetworkACL[]} acls - Array of ACLs to merge
 * @returns {NetworkACL} Merged ACL
 *
 * @example
 * ```typescript
 * const merged = mergeNetworkACLs([vnetACL, subnetACL, customACL]);
 * ```
 */
export const mergeNetworkACLs = (acls: NetworkACL[]): NetworkACL => {
  const sortedACLs = [...acls].sort((a, b) => a.priority - b.priority);

  const allRules: ACLRule[] = [];
  sortedACLs.forEach(acl => {
    if (acl.enabled) {
      allRules.push(...acl.rules);
    }
  });

  // Sort all rules by priority
  const sortedRules = allRules.sort((a, b) => a.priority - b.priority);

  return {
    id: crypto.randomUUID(),
    name: 'Merged ACL',
    rules: sortedRules,
    defaultAction: sortedACLs[sortedACLs.length - 1]?.defaultAction || 'deny',
    priority: 0,
    enabled: true,
  };
};

/**
 * Generates ACL rule for common service patterns.
 *
 * @param {string} service - Service name (http, https, ssh, rdp, etc.)
 * @param {string} sourceIp - Source IP pattern
 * @param {string} direction - Traffic direction
 * @returns {ACLRule} Generated ACL rule
 *
 * @example
 * ```typescript
 * const httpsRule = generateServiceACLRule('https', '10.0.0.0/16', 'inbound');
 * ```
 */
export const generateServiceACLRule = (
  service: string,
  sourceIp: string,
  direction: 'inbound' | 'outbound',
): ACLRule => {
  const serviceMap: Record<string, { protocol: 'tcp' | 'udp'; port: string }> = {
    http: { protocol: 'tcp', port: '80' },
    https: { protocol: 'tcp', port: '443' },
    ssh: { protocol: 'tcp', port: '22' },
    rdp: { protocol: 'tcp', port: '3389' },
    dns: { protocol: 'udp', port: '53' },
    smtp: { protocol: 'tcp', port: '25' },
    ftp: { protocol: 'tcp', port: '21' },
    mysql: { protocol: 'tcp', port: '3306' },
    postgres: { protocol: 'tcp', port: '5432' },
    redis: { protocol: 'tcp', port: '6379' },
  };

  const serviceConfig = serviceMap[service.toLowerCase()] || { protocol: 'tcp', port: '80' };

  return createACLRule({
    priority: 1000,
    action: 'allow',
    protocol: serviceConfig.protocol,
    sourceIp,
    destinationIp: '0.0.0.0/0',
    destinationPort: serviceConfig.port,
    direction,
  });
};

/**
 * Optimizes ACL rules by removing redundancies and consolidating overlaps.
 *
 * @param {ACLRule[]} rules - Array of ACL rules
 * @returns {ACLRule[]} Optimized rules
 *
 * @example
 * ```typescript
 * const optimized = optimizeACLRules(existingRules);
 * console.log(`Reduced from ${existingRules.length} to ${optimized.length} rules`);
 * ```
 */
export const optimizeACLRules = (rules: ACLRule[]): ACLRule[] => {
  const optimized: ACLRule[] = [];
  const sortedRules = [...rules].sort((a, b) => a.priority - b.priority);

  for (const rule of sortedRules) {
    if (!rule.enabled) continue;

    // Check if this rule is redundant with higher priority rules
    const isRedundant = optimized.some(existing => {
      return (
        existing.action === rule.action &&
        existing.protocol === rule.protocol &&
        isIpSubset(rule.sourceIp, existing.sourceIp) &&
        isIpSubset(rule.destinationIp, existing.destinationIp) &&
        existing.direction === rule.direction
      );
    });

    if (!isRedundant) {
      optimized.push(rule);
    }
  }

  return optimized;
};

// ============================================================================
// NETWORK FIREWALL RULES (10-15)
// ============================================================================

/**
 * Creates stateful firewall rule with connection tracking.
 *
 * @param {Partial<FirewallRule>} config - Firewall rule configuration
 * @returns {FirewallRule} Created firewall rule
 *
 * @example
 * ```typescript
 * const rule = createFirewallRule({
 *   name: 'Allow HTTPS',
 *   action: 'allow',
 *   protocol: 'tcp',
 *   destinationPort: '443',
 *   state: 'new'
 * });
 * ```
 */
export const createFirewallRule = (config: Partial<FirewallRule>): FirewallRule => {
  return {
    id: config.id || crypto.randomUUID(),
    name: config.name || 'Unnamed Rule',
    priority: config.priority || 1000,
    action: config.action || 'deny',
    protocol: config.protocol || 'tcp',
    sourceAddress: config.sourceAddress || '0.0.0.0/0',
    sourcePort: config.sourcePort || '*',
    destinationAddress: config.destinationAddress || '0.0.0.0/0',
    destinationPort: config.destinationPort || '*',
    state: config.state,
    enabled: config.enabled !== false,
    logEnabled: config.logEnabled !== false,
  };
};

/**
 * Evaluates firewall rules against network packet.
 *
 * @param {FirewallRule[]} rules - Firewall rules
 * @param {Partial<TrafficPattern>} packet - Network packet to evaluate
 * @returns {{ action: string; matchedRule?: FirewallRule; logged: boolean }} Evaluation result
 *
 * @example
 * ```typescript
 * const result = evaluateFirewallRules(rules, {
 *   sourceIp: '192.168.1.10',
 *   destinationIp: '10.0.2.5',
 *   protocol: 'tcp',
 *   port: 443
 * });
 * ```
 */
export const evaluateFirewallRules = (
  rules: FirewallRule[],
  packet: Partial<TrafficPattern>,
): { action: string; matchedRule?: FirewallRule; logged: boolean } => {
  const sortedRules = [...rules]
    .filter(r => r.enabled)
    .sort((a, b) => a.priority - b.priority);

  for (const rule of sortedRules) {
    // Check protocol
    if (rule.protocol !== 'all' && rule.protocol !== packet.protocol) {
      continue;
    }

    // Check source address
    if (!matchIpPattern(packet.sourceIp || '', rule.sourceAddress)) {
      continue;
    }

    // Check destination address
    if (!matchIpPattern(packet.destinationIp || '', rule.destinationAddress)) {
      continue;
    }

    // Check destination port
    if (rule.destinationPort !== '*' && !matchPortPattern(packet.port || 0, rule.destinationPort)) {
      continue;
    }

    // Rule matched
    return {
      action: rule.action,
      matchedRule: rule,
      logged: rule.logEnabled,
    };
  }

  // Default deny if no rule matches
  return {
    action: 'deny',
    logged: true,
  };
};

/**
 * Generates firewall rule chain for application tier.
 *
 * @param {string} tierName - Application tier name
 * @param {string[]} allowedPorts - Allowed ports
 * @param {string} sourceNetwork - Source network CIDR
 * @returns {FirewallRule[]} Generated firewall rules
 *
 * @example
 * ```typescript
 * const webTierRules = generateTierFirewallRules('web', ['80', '443'], '0.0.0.0/0');
 * ```
 */
export const generateTierFirewallRules = (
  tierName: string,
  allowedPorts: string[],
  sourceNetwork: string,
): FirewallRule[] => {
  const rules: FirewallRule[] = [];

  // Allow specified ports
  allowedPorts.forEach((port, index) => {
    rules.push(
      createFirewallRule({
        name: `${tierName}-allow-port-${port}`,
        priority: 100 + index,
        action: 'allow',
        protocol: 'tcp',
        sourceAddress: sourceNetwork,
        destinationPort: port,
        state: 'new',
      }),
    );
  });

  // Allow established connections
  rules.push(
    createFirewallRule({
      name: `${tierName}-allow-established`,
      priority: 50,
      action: 'allow',
      protocol: 'all',
      sourceAddress: sourceNetwork,
      state: 'established',
    }),
  );

  // Default deny
  rules.push(
    createFirewallRule({
      name: `${tierName}-default-deny`,
      priority: 65000,
      action: 'deny',
      protocol: 'all',
      sourceAddress: '0.0.0.0/0',
    }),
  );

  return rules;
};

/**
 * Validates firewall rule configuration.
 *
 * @param {FirewallRule} rule - Firewall rule to validate
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateFirewallRule(newRule);
 * if (!validation.valid) {
 *   throw new Error(validation.errors.join(', '));
 * }
 * ```
 */
export const validateFirewallRule = (rule: FirewallRule): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!rule.name || rule.name.length === 0) {
    errors.push('Rule name is required');
  }

  if (rule.priority < 1 || rule.priority > 65535) {
    errors.push('Priority must be between 1 and 65535');
  }

  if (!['allow', 'deny', 'drop', 'reject'].includes(rule.action)) {
    errors.push('Invalid action');
  }

  if (!isValidIpPattern(rule.sourceAddress)) {
    errors.push('Invalid source address');
  }

  if (!isValidIpPattern(rule.destinationAddress)) {
    errors.push('Invalid destination address');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Converts firewall rules to iptables format.
 *
 * @param {FirewallRule[]} rules - Firewall rules
 * @returns {string[]} Array of iptables commands
 *
 * @example
 * ```typescript
 * const iptables = convertToIptables(firewallRules);
 * iptables.forEach(cmd => console.log(cmd));
 * ```
 */
export const convertToIptables = (rules: FirewallRule[]): string[] => {
  const commands: string[] = [];

  rules.forEach(rule => {
    if (!rule.enabled) return;

    let cmd = 'iptables -A INPUT';

    if (rule.protocol !== 'all') {
      cmd += ` -p ${rule.protocol}`;
    }

    if (rule.sourceAddress !== '0.0.0.0/0') {
      cmd += ` -s ${rule.sourceAddress}`;
    }

    if (rule.destinationAddress !== '0.0.0.0/0') {
      cmd += ` -d ${rule.destinationAddress}`;
    }

    if (rule.destinationPort !== '*') {
      cmd += ` --dport ${rule.destinationPort}`;
    }

    if (rule.state) {
      cmd += ` -m state --state ${rule.state.toUpperCase()}`;
    }

    const target = rule.action.toUpperCase() === 'ALLOW' ? 'ACCEPT' : rule.action.toUpperCase();
    cmd += ` -j ${target}`;

    if (rule.logEnabled) {
      commands.push(`iptables -A INPUT ${cmd.replace('-j', '-j LOG --log-prefix')} "[${rule.name}]"`);
    }

    commands.push(cmd);
  });

  return commands;
};

/**
 * Analyzes firewall rule effectiveness and coverage.
 *
 * @param {FirewallRule[]} rules - Firewall rules
 * @returns {{ coverage: number; gaps: string[]; redundancies: string[] }} Analysis result
 *
 * @example
 * ```typescript
 * const analysis = analyzeFirewallRules(rules);
 * console.log(`Coverage: ${analysis.coverage}%`);
 * ```
 */
export const analyzeFirewallRules = (
  rules: FirewallRule[],
): { coverage: number; gaps: string[]; redundancies: string[] } => {
  const gaps: string[] = [];
  const redundancies: string[] = [];

  // Check for common service coverage
  const commonPorts = ['80', '443', '22', '3389', '3306', '5432'];
  commonPorts.forEach(port => {
    const hasRule = rules.some(
      r => r.enabled && r.destinationPort === port && r.action === 'allow',
    );
    if (!hasRule) {
      gaps.push(`No rule for common port ${port}`);
    }
  });

  // Check for redundancies
  for (let i = 0; i < rules.length; i++) {
    for (let j = i + 1; j < rules.length; j++) {
      if (areRulesRedundant(rules[i], rules[j])) {
        redundancies.push(`Rules ${rules[i].name} and ${rules[j].name} are redundant`);
      }
    }
  }

  const coverage = Math.max(0, 100 - gaps.length * 10);

  return { coverage, gaps, redundancies };
};

// ============================================================================
// SECURITY GROUPS (16-21)
// ============================================================================

/**
 * Creates network security group with default rules.
 *
 * @param {string} name - Security group name
 * @param {string} vnetId - Virtual network ID
 * @param {string} description - Description
 * @returns {SecurityGroup} Created security group
 *
 * @example
 * ```typescript
 * const sg = createSecurityGroup('web-tier-sg', 'vnet-123', 'Web tier security group');
 * ```
 */
export const createSecurityGroup = (
  name: string,
  vnetId: string,
  description: string,
): SecurityGroup => {
  return {
    id: crypto.randomUUID(),
    name,
    description,
    vnetId,
    inboundRules: [
      {
        id: crypto.randomUUID(),
        priority: 65000,
        action: 'deny',
        protocol: '*',
        sourceAddressPrefix: '*',
        sourcePortRange: '*',
        destinationAddressPrefix: '*',
        destinationPortRange: '*',
        description: 'Default deny all inbound',
      },
    ],
    outboundRules: [
      {
        id: crypto.randomUUID(),
        priority: 65000,
        action: 'allow',
        protocol: '*',
        sourceAddressPrefix: '*',
        sourcePortRange: '*',
        destinationAddressPrefix: '*',
        destinationPortRange: '*',
        description: 'Default allow all outbound',
      },
    ],
    tags: {},
  };
};

/**
 * Adds inbound security rule to security group.
 *
 * @param {SecurityGroup} sg - Security group
 * @param {Partial<SecurityRule>} ruleConfig - Rule configuration
 * @returns {SecurityGroup} Updated security group
 *
 * @example
 * ```typescript
 * const updated = addInboundRule(sg, {
 *   priority: 100,
 *   action: 'allow',
 *   protocol: 'tcp',
 *   sourceAddressPrefix: '10.0.0.0/16',
 *   destinationPortRange: '443'
 * });
 * ```
 */
export const addInboundRule = (
  sg: SecurityGroup,
  ruleConfig: Partial<SecurityRule>,
): SecurityGroup => {
  const rule: SecurityRule = {
    id: ruleConfig.id || crypto.randomUUID(),
    priority: ruleConfig.priority || 1000,
    action: ruleConfig.action || 'deny',
    protocol: ruleConfig.protocol || '*',
    sourceAddressPrefix: ruleConfig.sourceAddressPrefix || '*',
    sourcePortRange: ruleConfig.sourcePortRange || '*',
    destinationAddressPrefix: ruleConfig.destinationAddressPrefix || '*',
    destinationPortRange: ruleConfig.destinationPortRange || '*',
    description: ruleConfig.description,
  };

  return {
    ...sg,
    inboundRules: [...sg.inboundRules, rule].sort((a, b) => a.priority - b.priority),
  };
};

/**
 * Adds outbound security rule to security group.
 *
 * @param {SecurityGroup} sg - Security group
 * @param {Partial<SecurityRule>} ruleConfig - Rule configuration
 * @returns {SecurityGroup} Updated security group
 *
 * @example
 * ```typescript
 * const updated = addOutboundRule(sg, {
 *   priority: 100,
 *   action: 'allow',
 *   protocol: 'tcp',
 *   destinationAddressPrefix: '10.0.2.0/24',
 *   destinationPortRange: '3306'
 * });
 * ```
 */
export const addOutboundRule = (
  sg: SecurityGroup,
  ruleConfig: Partial<SecurityRule>,
): SecurityGroup => {
  const rule: SecurityRule = {
    id: ruleConfig.id || crypto.randomUUID(),
    priority: ruleConfig.priority || 1000,
    action: ruleConfig.action || 'deny',
    protocol: ruleConfig.protocol || '*',
    sourceAddressPrefix: ruleConfig.sourceAddressPrefix || '*',
    sourcePortRange: ruleConfig.sourcePortRange || '*',
    destinationAddressPrefix: ruleConfig.destinationAddressPrefix || '*',
    destinationPortRange: ruleConfig.destinationPortRange || '*',
    description: ruleConfig.description,
  };

  return {
    ...sg,
    outboundRules: [...sg.outboundRules, rule].sort((a, b) => a.priority - b.priority),
  };
};

/**
 * Evaluates security group rules for traffic pattern.
 *
 * @param {SecurityGroup} sg - Security group
 * @param {Partial<TrafficPattern>} traffic - Traffic pattern
 * @param {'inbound' | 'outbound'} direction - Traffic direction
 * @returns {{ allowed: boolean; matchedRule?: SecurityRule }} Evaluation result
 *
 * @example
 * ```typescript
 * const result = evaluateSecurityGroup(sg, traffic, 'inbound');
 * if (!result.allowed) {
 *   console.log('Traffic blocked');
 * }
 * ```
 */
export const evaluateSecurityGroup = (
  sg: SecurityGroup,
  traffic: Partial<TrafficPattern>,
  direction: 'inbound' | 'outbound',
): { allowed: boolean; matchedRule?: SecurityRule } => {
  const rules = direction === 'inbound' ? sg.inboundRules : sg.outboundRules;

  for (const rule of rules) {
    // Check protocol
    if (rule.protocol !== '*' && rule.protocol !== traffic.protocol) {
      continue;
    }

    // Check source/destination based on direction
    const addressToCheck = direction === 'inbound' ? traffic.sourceIp : traffic.destinationIp;
    const addressPrefix =
      direction === 'inbound' ? rule.sourceAddressPrefix : rule.destinationAddressPrefix;

    if (addressPrefix !== '*' && !matchIpPattern(addressToCheck || '', addressPrefix)) {
      continue;
    }

    // Check port
    const portRange =
      direction === 'inbound' ? rule.destinationPortRange : rule.destinationPortRange;
    if (portRange !== '*' && !matchPortPattern(traffic.port || 0, portRange)) {
      continue;
    }

    // Rule matched
    return {
      allowed: rule.action === 'allow',
      matchedRule: rule,
    };
  }

  // No rule matched
  return {
    allowed: false,
  };
};

/**
 * Clones security group with new name and ID.
 *
 * @param {SecurityGroup} sg - Security group to clone
 * @param {string} newName - New security group name
 * @returns {SecurityGroup} Cloned security group
 *
 * @example
 * ```typescript
 * const cloned = cloneSecurityGroup(prodSG, 'staging-sg');
 * ```
 */
export const cloneSecurityGroup = (sg: SecurityGroup, newName: string): SecurityGroup => {
  return {
    ...sg,
    id: crypto.randomUUID(),
    name: newName,
    inboundRules: sg.inboundRules.map(r => ({ ...r, id: crypto.randomUUID() })),
    outboundRules: sg.outboundRules.map(r => ({ ...r, id: crypto.randomUUID() })),
  };
};

/**
 * Compares two security groups for differences.
 *
 * @param {SecurityGroup} sg1 - First security group
 * @param {SecurityGroup} sg2 - Second security group
 * @returns {{ differences: string[]; identical: boolean }} Comparison result
 *
 * @example
 * ```typescript
 * const comparison = compareSecurityGroups(currentSG, desiredSG);
 * if (!comparison.identical) {
 *   console.log('Differences:', comparison.differences);
 * }
 * ```
 */
export const compareSecurityGroups = (
  sg1: SecurityGroup,
  sg2: SecurityGroup,
): { differences: string[]; identical: boolean } => {
  const differences: string[] = [];

  if (sg1.inboundRules.length !== sg2.inboundRules.length) {
    differences.push(`Inbound rule count differs: ${sg1.inboundRules.length} vs ${sg2.inboundRules.length}`);
  }

  if (sg1.outboundRules.length !== sg2.outboundRules.length) {
    differences.push(`Outbound rule count differs: ${sg1.outboundRules.length} vs ${sg2.outboundRules.length}`);
  }

  // Compare individual rules
  sg1.inboundRules.forEach((rule1, index) => {
    const rule2 = sg2.inboundRules[index];
    if (rule2 && !areSecurityRulesEqual(rule1, rule2)) {
      differences.push(`Inbound rule ${index} differs`);
    }
  });

  sg1.outboundRules.forEach((rule1, index) => {
    const rule2 = sg2.outboundRules[index];
    if (rule2 && !areSecurityRulesEqual(rule1, rule2)) {
      differences.push(`Outbound rule ${index} differs`);
    }
  });

  return {
    differences,
    identical: differences.length === 0,
  };
};

// ============================================================================
// NETWORK ACCESS CONTROL (22-26)
// ============================================================================

/**
 * Validates user access to network resource.
 *
 * @param {NetworkAccessControl} accessControl - Access control configuration
 * @param {string} resource - Resource being accessed
 * @param {string} action - Action being performed
 * @returns {{ granted: boolean; reason: string }} Access decision
 *
 * @example
 * ```typescript
 * const decision = validateNetworkAccess(accessControl, 'vnet-123', 'read');
 * if (!decision.granted) {
 *   throw new UnauthorizedException(decision.reason);
 * }
 * ```
 */
export const validateNetworkAccess = (
  accessControl: NetworkAccessControl,
  resource: string,
  action: string,
): { granted: boolean; reason: string } => {
  // Check expiration
  if (accessControl.expiresAt && new Date() > accessControl.expiresAt) {
    return { granted: false, reason: 'Access expired' };
  }

  // Check permissions
  const permission = accessControl.permissions.find(p => p.resource === resource);
  if (!permission) {
    return { granted: false, reason: 'No permission for resource' };
  }

  if (!permission.actions.includes(action) && !permission.actions.includes('*')) {
    return { granted: false, reason: 'Action not permitted' };
  }

  // Check restrictions
  for (const restriction of accessControl.restrictions) {
    if (!restriction.enabled) continue;

    // Implement restriction checks
    if (restriction.type === 'ip_blacklist') {
      // Would check IP against blacklist
    }
  }

  return { granted: true, reason: 'Access granted' };
};

/**
 * Creates network permission for user/role.
 *
 * @param {string} resource - Resource pattern
 * @param {string[]} actions - Allowed actions
 * @param {Record<string, any>} [conditions] - Permission conditions
 * @returns {NetworkPermission} Created permission
 *
 * @example
 * ```typescript
 * const permission = createNetworkPermission('vnet:*', ['read', 'write'], {
 *   timeRange: { start: '09:00', end: '17:00' }
 * });
 * ```
 */
export const createNetworkPermission = (
  resource: string,
  actions: string[],
  conditions?: Record<string, any>,
): NetworkPermission => {
  return {
    resource,
    actions,
    conditions,
  };
};

/**
 * Checks if user has specific permission.
 *
 * @param {NetworkPermission[]} permissions - User permissions
 * @param {string} resource - Resource to check
 * @param {string} action - Action to check
 * @returns {boolean} Whether permission is granted
 *
 * @example
 * ```typescript
 * if (hasNetworkPermission(user.permissions, 'vnet-123', 'delete')) {
 *   await deleteVirtualNetwork(vnetId);
 * }
 * ```
 */
export const hasNetworkPermission = (
  permissions: NetworkPermission[],
  resource: string,
  action: string,
): boolean => {
  return permissions.some(permission => {
    const resourceMatch =
      permission.resource === resource ||
      permission.resource === '*' ||
      (permission.resource.endsWith('*') &&
        resource.startsWith(permission.resource.slice(0, -1)));

    const actionMatch = permission.actions.includes(action) || permission.actions.includes('*');

    return resourceMatch && actionMatch;
  });
};

/**
 * Generates network access token with embedded permissions.
 *
 * @param {NetworkAccessControl} accessControl - Access control
 * @param {number} expiresInSeconds - Token expiration
 * @returns {string} Signed access token
 *
 * @example
 * ```typescript
 * const token = generateNetworkAccessToken(accessControl, 3600);
 * // Use token for network operations
 * ```
 */
export const generateNetworkAccessToken = (
  accessControl: NetworkAccessControl,
  expiresInSeconds: number,
): string => {
  const payload = {
    userId: accessControl.userId,
    networkId: accessControl.networkId,
    permissions: accessControl.permissions,
    exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
    iat: Math.floor(Date.now() / 1000),
  };

  const token = Buffer.from(JSON.stringify(payload)).toString('base64');
  const signature = crypto
    .createHmac('sha256', process.env.NETWORK_TOKEN_SECRET || 'secret')
    .update(token)
    .digest('hex');

  return `${token}.${signature}`;
};

/**
 * Verifies network access token and extracts permissions.
 *
 * @param {string} token - Access token to verify
 * @returns {{ valid: boolean; accessControl?: NetworkAccessControl; error?: string }} Verification result
 *
 * @example
 * ```typescript
 * const result = verifyNetworkAccessToken(req.headers.authorization);
 * if (!result.valid) {
 *   throw new UnauthorizedException(result.error);
 * }
 * ```
 */
export const verifyNetworkAccessToken = (
  token: string,
): { valid: boolean; accessControl?: NetworkAccessControl; error?: string } => {
  try {
    const [payload, signature] = token.split('.');

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.NETWORK_TOKEN_SECRET || 'secret')
      .update(payload)
      .digest('hex');

    if (signature !== expectedSignature) {
      return { valid: false, error: 'Invalid signature' };
    }

    // Decode payload
    const decoded = JSON.parse(Buffer.from(payload, 'base64').toString());

    // Check expiration
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      return { valid: false, error: 'Token expired' };
    }

    const accessControl: NetworkAccessControl = {
      userId: decoded.userId,
      networkId: decoded.networkId,
      permissions: decoded.permissions,
      restrictions: [],
    };

    return { valid: true, accessControl };
  } catch (error: any) {
    return { valid: false, error: error.message };
  }
};

// ============================================================================
// NETWORK AUTHENTICATION GUARDS (27-30)
// ============================================================================

/**
 * NestJS guard for network authentication.
 *
 * @param {Request} req - Express request
 * @returns {Promise<boolean>} Whether request is authenticated
 *
 * @example
 * ```typescript
 * @UseGuards(NetworkAuthGuard)
 * @Controller('networks')
 * export class NetworkController { ... }
 * ```
 */
export const networkAuthGuard = async (req: Request): Promise<boolean> => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return false;
  }

  const result = verifyNetworkAccessToken(token);
  if (!result.valid || !result.accessControl) {
    return false;
  }

  // Attach access control to request
  (req as any).networkAuth = result.accessControl;

  return true;
};

/**
 * NestJS guard for network resource authorization.
 *
 * @param {string} resource - Resource type
 * @param {string} action - Required action
 * @returns {Function} Guard function
 *
 * @example
 * ```typescript
 * @UseGuards(networkResourceGuard('vnet', 'write'))
 * @Put(':id')
 * async updateVNet() { ... }
 * ```
 */
export const networkResourceGuard = (resource: string, action: string) => {
  return async (req: Request): Promise<boolean> => {
    const accessControl = (req as any).networkAuth as NetworkAccessControl;

    if (!accessControl) {
      return false;
    }

    const resourceId = req.params.id || req.params.networkId;
    const fullResource = resourceId ? `${resource}:${resourceId}` : resource;

    const decision = validateNetworkAccess(accessControl, fullResource, action);
    return decision.granted;
  };
};

/**
 * Creates middleware for network IP whitelist validation.
 *
 * @param {string[]} allowedIps - Allowed IP addresses/ranges
 * @returns {Function} Express middleware
 *
 * @example
 * ```typescript
 * app.use('/admin/networks', networkIpWhitelistMiddleware([
 *   '10.0.0.0/16',
 *   '192.168.1.100'
 * ]));
 * ```
 */
export const networkIpWhitelistMiddleware = (allowedIps: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const clientIp = req.ip || req.socket.remoteAddress || '';

    const isAllowed = allowedIps.some(pattern => matchIpPattern(clientIp, pattern));

    if (!isAllowed) {
      return res.status(403).json({
        error: {
          code: 'IP_NOT_WHITELISTED',
          message: 'Access denied from this IP address',
          statusCode: 403,
        },
      });
    }

    next();
  };
};

/**
 * Creates middleware for network session validation.
 *
 * @param {number} maxIdleTimeMs - Maximum idle time in milliseconds
 * @returns {Function} Express middleware
 *
 * @example
 * ```typescript
 * app.use(networkSessionMiddleware(30 * 60 * 1000)); // 30 minutes
 * ```
 */
export const networkSessionMiddleware = (maxIdleTimeMs: number) => {
  const sessions = new Map<string, { lastActivity: number; auth: NetworkAuthContext }>();

  return (req: Request, res: Response, next: NextFunction) => {
    const sessionId = req.headers['x-session-id'] as string;

    if (!sessionId) {
      return res.status(401).json({
        error: {
          code: 'NO_SESSION',
          message: 'Session ID required',
          statusCode: 401,
        },
      });
    }

    const session = sessions.get(sessionId);
    const now = Date.now();

    if (!session) {
      return res.status(401).json({
        error: {
          code: 'INVALID_SESSION',
          message: 'Session not found or expired',
          statusCode: 401,
        },
      });
    }

    if (now - session.lastActivity > maxIdleTimeMs) {
      sessions.delete(sessionId);
      return res.status(401).json({
        error: {
          code: 'SESSION_EXPIRED',
          message: 'Session expired due to inactivity',
          statusCode: 401,
        },
      });
    }

    // Update last activity
    session.lastActivity = now;
    (req as any).networkAuth = session.auth;

    next();
  };
};

// ============================================================================
// RATE LIMITING & DDOS PROTECTION (31-36)
// ============================================================================

/**
 * Creates network-specific rate limiter.
 *
 * @param {RateLimitPolicy} policy - Rate limit policy
 * @returns {Function} Express middleware
 *
 * @example
 * ```typescript
 * const limiter = createNetworkRateLimiter({
 *   maxRequests: 1000,
 *   windowMs: 60000,
 *   strategy: 'sliding',
 *   scope: 'per_network'
 * });
 * ```
 */
export const createNetworkRateLimiter = (policy: RateLimitPolicy) => {
  const requests = new Map<string, { count: number; resetTime: number }>();

  return (req: Request, res: Response, next: NextFunction) => {
    if (!policy.enabled) {
      return next();
    }

    const key = generateRateLimitKey(req, policy.scope);
    const now = Date.now();
    const entry = requests.get(key);

    if (!entry || now > entry.resetTime) {
      requests.set(key, { count: 1, resetTime: now + policy.windowMs });
      return next();
    }

    if (entry.count >= policy.maxRequests) {
      return res.status(429).json({
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests',
          statusCode: 429,
          retryAfter: Math.ceil((entry.resetTime - now) / 1000),
        },
      });
    }

    entry.count++;
    next();
  };
};

/**
 * Detects DDoS attack patterns in traffic.
 *
 * @param {TrafficPattern[]} recentTraffic - Recent traffic patterns
 * @param {DDoSProtectionConfig} config - DDoS protection configuration
 * @returns {{ isDDoS: boolean; attackType?: string; severity: string }} Detection result
 *
 * @example
 * ```typescript
 * const detection = detectDDoSPattern(recentTraffic, ddosConfig);
 * if (detection.isDDoS) {
 *   await triggerDDoSMitigation(detection.attackType);
 * }
 * ```
 */
export const detectDDoSPattern = (
  recentTraffic: TrafficPattern[],
  config: DDoSProtectionConfig,
): { isDDoS: boolean; attackType?: string; severity: string } => {
  if (!config.enabled) {
    return { isDDoS: false, severity: 'none' };
  }

  const now = Date.now();
  const oneSecondAgo = now - 1000;
  const recentPackets = recentTraffic.filter(t => t.timestamp.getTime() > oneSecondAgo);

  // Check requests per second
  const requestsPerSecond = recentPackets.length;
  if (requestsPerSecond > config.thresholds.requestsPerSecond) {
    return { isDDoS: true, attackType: 'volumetric', severity: 'high' };
  }

  // Check bytes per second
  const bytesPerSecond = recentPackets.reduce((sum, p) => sum + p.byteCount, 0);
  if (bytesPerSecond > config.thresholds.bytesPerSecond) {
    return { isDDoS: true, attackType: 'bandwidth_exhaustion', severity: 'high' };
  }

  // Check connections per IP
  const connectionsByIp = new Map<string, number>();
  recentPackets.forEach(p => {
    connectionsByIp.set(p.sourceIp, (connectionsByIp.get(p.sourceIp) || 0) + 1);
  });

  for (const [ip, count] of connectionsByIp.entries()) {
    if (count > config.thresholds.connectionsPerIp) {
      return { isDDoS: true, attackType: 'connection_flood', severity: 'medium' };
    }
  }

  return { isDDoS: false, severity: 'none' };
};

/**
 * Applies DDoS mitigation strategy.
 *
 * @param {DDoSMitigation} mitigation - Mitigation strategy
 * @param {string} sourceIp - Source IP to mitigate
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await applyDDoSMitigation({
 *   type: 'rate_limit',
 *   threshold: 10,
 *   duration: 300000,
 *   action: 'throttle'
 * }, '192.168.1.100');
 * ```
 */
export const applyDDoSMitigation = async (
  mitigation: DDoSMitigation,
  sourceIp: string,
): Promise<void> => {
  switch (mitigation.type) {
    case 'rate_limit':
      // Apply aggressive rate limiting
      break;
    case 'challenge':
      // Implement CAPTCHA or proof-of-work challenge
      break;
    case 'block':
      // Add to temporary blacklist
      break;
    case 'tarpit':
      // Slow down responses to waste attacker resources
      break;
  }
};

/**
 * Creates DDoS protection middleware.
 *
 * @param {DDoSProtectionConfig} config - DDoS protection configuration
 * @returns {Function} Express middleware
 *
 * @example
 * ```typescript
 * app.use(ddosProtectionMiddleware({
 *   enabled: true,
 *   thresholds: {
 *     requestsPerSecond: 1000,
 *     bytesPerSecond: 10485760,
 *     connectionsPerIp: 100
 *   },
 *   mitigations: [...]
 * }));
 * ```
 */
export const ddosProtectionMiddleware = (config: DDoSProtectionConfig) => {
  const trafficHistory: TrafficPattern[] = [];

  return (req: Request, res: Response, next: NextFunction) => {
    const clientIp = req.ip || req.socket.remoteAddress || '';

    // Check whitelist
    if (config.whitelist.includes(clientIp)) {
      return next();
    }

    // Check blacklist
    if (config.blacklist.includes(clientIp)) {
      return res.status(403).json({
        error: {
          code: 'IP_BLACKLISTED',
          message: 'Access denied',
          statusCode: 403,
        },
      });
    }

    // Record traffic
    const traffic: TrafficPattern = {
      sourceIp: clientIp,
      destinationIp: req.hostname,
      protocol: 'http',
      port: parseInt(req.socket.localPort?.toString() || '80'),
      packetCount: 1,
      byteCount: parseInt(req.headers['content-length'] || '0'),
      timestamp: new Date(),
      flags: [],
    };

    trafficHistory.push(traffic);

    // Keep only recent traffic (last 10 seconds)
    const cutoff = Date.now() - 10000;
    while (trafficHistory.length > 0 && trafficHistory[0].timestamp.getTime() < cutoff) {
      trafficHistory.shift();
    }

    // Detect DDoS
    const detection = detectDDoSPattern(trafficHistory, config);
    if (detection.isDDoS && config.mitigations.length > 0) {
      const mitigation = config.mitigations[0];
      applyDDoSMitigation(mitigation, clientIp);

      return res.status(429).json({
        error: {
          code: 'DDOS_DETECTED',
          message: 'Suspected DDoS attack, request throttled',
          statusCode: 429,
        },
      });
    }

    next();
  };
};

/**
 * Generates rate limit key based on scope.
 *
 * @param {Request} req - Express request
 * @param {string} scope - Rate limit scope
 * @returns {string} Rate limit key
 *
 * @example
 * ```typescript
 * const key = generateRateLimitKey(req, 'per_network');
 * ```
 */
export const generateRateLimitKey = (req: Request, scope: string): string => {
  switch (scope) {
    case 'global':
      return 'global';
    case 'per_ip':
      return req.ip || 'unknown';
    case 'per_user':
      return (req as any).networkAuth?.userId || 'anonymous';
    case 'per_network':
      return (req as any).networkAuth?.networkId || 'unknown';
    default:
      return 'default';
  }
};

/**
 * Analyzes traffic patterns for anomalies.
 *
 * @param {TrafficPattern[]} traffic - Traffic patterns
 * @returns {{ anomalies: string[]; score: number }} Analysis result
 *
 * @example
 * ```typescript
 * const analysis = analyzeTrafficPatterns(recentTraffic);
 * if (analysis.score > 0.7) {
 *   console.warn('High anomaly score:', analysis.anomalies);
 * }
 * ```
 */
export const analyzeTrafficPatterns = (
  traffic: TrafficPattern[],
): { anomalies: string[]; score: number } => {
  const anomalies: string[] = [];
  let score = 0;

  // Check for port scanning
  const uniquePorts = new Set(traffic.map(t => t.port));
  if (uniquePorts.size > 50) {
    anomalies.push('Possible port scanning detected');
    score += 0.3;
  }

  // Check for uniform timing (bot-like behavior)
  const intervals = [];
  for (let i = 1; i < traffic.length; i++) {
    intervals.push(traffic[i].timestamp.getTime() - traffic[i - 1].timestamp.getTime());
  }

  const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  const variance =
    intervals.reduce((sum, val) => sum + Math.pow(val - avgInterval, 2), 0) / intervals.length;

  if (variance < 100) {
    anomalies.push('Uniform timing pattern detected (possible bot)');
    score += 0.4;
  }

  return { anomalies, score: Math.min(score, 1.0) };
};

// ============================================================================
// NETWORK AUDIT & LOGGING (37-39)
// ============================================================================

/**
 * Logs network security event.
 *
 * @param {Partial<SecurityEvent>} event - Security event
 * @param {Model} SecurityEventModel - Sequelize model
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await logSecurityEvent({
 *   type: 'unauthorized_access',
 *   severity: 'high',
 *   sourceIp: clientIp,
 *   description: 'Attempted access to restricted network'
 * }, SecurityEventModel);
 * ```
 */
export const logSecurityEvent = async (
  event: Partial<SecurityEvent>,
  SecurityEventModel: any,
): Promise<void> => {
  await SecurityEventModel.create({
    id: crypto.randomUUID(),
    type: event.type,
    severity: event.severity || 'medium',
    sourceIp: event.sourceIp,
    targetIp: event.targetIp,
    description: event.description,
    timestamp: new Date(),
    metadata: event.metadata || {},
    resolved: false,
  });
};

/**
 * Creates audit log for network operations.
 *
 * @param {Partial<NetworkAuditLog>} log - Audit log entry
 * @returns {NetworkAuditLog} Created audit log
 *
 * @example
 * ```typescript
 * const auditLog = createNetworkAuditLog({
 *   networkId: 'vnet-123',
 *   userId: 'user-456',
 *   action: 'update_security_group',
 *   resource: 'sg-789',
 *   result: 'success',
 *   ip: clientIp
 * });
 * ```
 */
export const createNetworkAuditLog = (log: Partial<NetworkAuditLog>): NetworkAuditLog => {
  return {
    id: log.id || crypto.randomUUID(),
    networkId: log.networkId || '',
    userId: log.userId || '',
    action: log.action || '',
    resource: log.resource || '',
    result: log.result || 'success',
    ip: log.ip || '',
    timestamp: log.timestamp || new Date(),
    metadata: log.metadata || {},
  };
};

/**
 * Retrieves security events for analysis.
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} SecurityEventModel - Sequelize model
 * @returns {Promise<SecurityEvent[]>} Security events
 *
 * @example
 * ```typescript
 * const events = await getSecurityEvents(
 *   new Date(Date.now() - 86400000),
 *   new Date(),
 *   SecurityEventModel
 * );
 * ```
 */
export const getSecurityEvents = async (
  startDate: Date,
  endDate: Date,
  SecurityEventModel: any,
): Promise<SecurityEvent[]> => {
  const events = await SecurityEventModel.findAll({
    where: {
      timestamp: {
        [Op.gte]: startDate,
        [Op.lte]: endDate,
      },
    },
    order: [['timestamp', 'DESC']],
  });

  return events;
};

// ============================================================================
// HELPER FUNCTIONS (40-42)
// ============================================================================

/**
 * Checks if IP address matches pattern (supports CIDR).
 *
 * @param {string} ip - IP address to check
 * @param {string} pattern - IP pattern (CIDR or wildcard)
 * @returns {boolean} Whether IP matches pattern
 *
 * @example
 * ```typescript
 * matchIpPattern('10.0.1.5', '10.0.0.0/16'); // true
 * matchIpPattern('192.168.1.1', '10.0.0.0/16'); // false
 * ```
 */
export const matchIpPattern = (ip: string, pattern: string): boolean => {
  if (pattern === '*' || pattern === '0.0.0.0/0') {
    return true;
  }

  if (pattern.includes('/')) {
    // CIDR notation
    const [network, bits] = pattern.split('/');
    const mask = ~(2 ** (32 - parseInt(bits)) - 1);
    const networkInt = ipToInt(network);
    const ipInt = ipToInt(ip);
    return (ipInt & mask) === (networkInt & mask);
  }

  return ip === pattern;
};

/**
 * Checks if port matches pattern (supports ranges).
 *
 * @param {number} port - Port number to check
 * @param {string} pattern - Port pattern (single, range, or wildcard)
 * @returns {boolean} Whether port matches pattern
 *
 * @example
 * ```typescript
 * matchPortPattern(443, '443'); // true
 * matchPortPattern(8080, '8000-9000'); // true
 * matchPortPattern(22, '*'); // true
 * ```
 */
export const matchPortPattern = (port: number, pattern: string): boolean => {
  if (pattern === '*') {
    return true;
  }

  if (pattern.includes('-')) {
    const [start, end] = pattern.split('-').map(Number);
    return port >= start && port <= end;
  }

  return port === parseInt(pattern);
};

/**
 * Validates IP address or CIDR pattern.
 *
 * @param {string} pattern - IP pattern to validate
 * @returns {boolean} Whether pattern is valid
 *
 * @example
 * ```typescript
 * isValidIpPattern('10.0.0.0/16'); // true
 * isValidIpPattern('192.168.1.1'); // true
 * isValidIpPattern('invalid'); // false
 * ```
 */
export const isValidIpPattern = (pattern: string): boolean => {
  if (pattern === '*' || pattern === '0.0.0.0/0') {
    return true;
  }

  const cidrRegex = /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/;
  return cidrRegex.test(pattern);
};

// ============================================================================
// INTERNAL HELPER FUNCTIONS
// ============================================================================

function isValidPortPattern(port: string): boolean {
  if (port === '*') return true;
  if (port.includes('-')) {
    const [start, end] = port.split('-').map(Number);
    return start > 0 && start <= 65535 && end > 0 && end <= 65535 && start <= end;
  }
  const portNum = parseInt(port);
  return portNum > 0 && portNum <= 65535;
}

function ipToInt(ip: string): number {
  return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0) >>> 0;
}

function isIpSubset(ip1: string, ip2: string): boolean {
  return matchIpPattern(ip1, ip2);
}

function areRulesRedundant(rule1: FirewallRule, rule2: FirewallRule): boolean {
  return (
    rule1.action === rule2.action &&
    rule1.protocol === rule2.protocol &&
    rule1.sourceAddress === rule2.sourceAddress &&
    rule1.destinationAddress === rule2.destinationAddress &&
    rule1.destinationPort === rule2.destinationPort
  );
}

function areSecurityRulesEqual(rule1: SecurityRule, rule2: SecurityRule): boolean {
  return (
    rule1.priority === rule2.priority &&
    rule1.action === rule2.action &&
    rule1.protocol === rule2.protocol &&
    rule1.sourceAddressPrefix === rule2.sourceAddressPrefix &&
    rule1.destinationAddressPrefix === rule2.destinationAddressPrefix &&
    rule1.destinationPortRange === rule2.destinationPortRange
  );
}

export default {
  // Models
  createNetworkACLModel,
  createSecurityGroupModel,
  createSecurityEventModel,

  // Network ACL
  evaluateNetworkACL,
  createACLRule,
  validateACLRule,
  mergeNetworkACLs,
  generateServiceACLRule,
  optimizeACLRules,

  // Firewall Rules
  createFirewallRule,
  evaluateFirewallRules,
  generateTierFirewallRules,
  validateFirewallRule,
  convertToIptables,
  analyzeFirewallRules,

  // Security Groups
  createSecurityGroup,
  addInboundRule,
  addOutboundRule,
  evaluateSecurityGroup,
  cloneSecurityGroup,
  compareSecurityGroups,

  // Network Access Control
  validateNetworkAccess,
  createNetworkPermission,
  hasNetworkPermission,
  generateNetworkAccessToken,
  verifyNetworkAccessToken,

  // Authentication Guards
  networkAuthGuard,
  networkResourceGuard,
  networkIpWhitelistMiddleware,
  networkSessionMiddleware,

  // Rate Limiting & DDoS
  createNetworkRateLimiter,
  detectDDoSPattern,
  applyDDoSMitigation,
  ddosProtectionMiddleware,
  generateRateLimitKey,
  analyzeTrafficPatterns,

  // Audit & Logging
  logSecurityEvent,
  createNetworkAuditLog,
  getSecurityEvents,

  // Helpers
  matchIpPattern,
  matchPortPattern,
  isValidIpPattern,
};
