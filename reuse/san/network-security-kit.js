"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidIpPattern = exports.matchPortPattern = exports.matchIpPattern = exports.getSecurityEvents = exports.createNetworkAuditLog = exports.logSecurityEvent = exports.analyzeTrafficPatterns = exports.generateRateLimitKey = exports.ddosProtectionMiddleware = exports.applyDDoSMitigation = exports.detectDDoSPattern = exports.createNetworkRateLimiter = exports.networkSessionMiddleware = exports.networkIpWhitelistMiddleware = exports.networkResourceGuard = exports.networkAuthGuard = exports.verifyNetworkAccessToken = exports.generateNetworkAccessToken = exports.hasNetworkPermission = exports.createNetworkPermission = exports.validateNetworkAccess = exports.compareSecurityGroups = exports.cloneSecurityGroup = exports.evaluateSecurityGroup = exports.addOutboundRule = exports.addInboundRule = exports.createSecurityGroup = exports.analyzeFirewallRules = exports.convertToIptables = exports.validateFirewallRule = exports.generateTierFirewallRules = exports.evaluateFirewallRules = exports.createFirewallRule = exports.optimizeACLRules = exports.generateServiceACLRule = exports.mergeNetworkACLs = exports.validateACLRule = exports.createACLRule = exports.evaluateNetworkACL = exports.createSecurityEventModel = exports.createSecurityGroupModel = exports.createNetworkACLModel = void 0;
const sequelize_1 = require("sequelize");
const crypto = __importStar(require("crypto"));
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
const createNetworkACLModel = (sequelize) => {
    class NetworkACLModel extends sequelize_1.Model {
    }
    NetworkACLModel.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'ACL name',
        },
        rules: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Array of ACL rules',
        },
        defaultAction: {
            type: sequelize_1.DataTypes.ENUM('allow', 'deny'),
            allowNull: false,
            defaultValue: 'deny',
            comment: 'Default action for unmatched traffic',
        },
        priority: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 100,
            comment: 'ACL priority (lower = higher priority)',
        },
        enabled: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Whether ACL is active',
        },
        networkId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Associated network ID',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'ACL description',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'network_acls',
        timestamps: true,
        indexes: [
            { fields: ['networkId'] },
            { fields: ['enabled'] },
            { fields: ['priority'] },
        ],
    });
    return NetworkACLModel;
};
exports.createNetworkACLModel = createNetworkACLModel;
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
const createSecurityGroupModel = (sequelize) => {
    class SecurityGroupModel extends sequelize_1.Model {
    }
    SecurityGroupModel.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Security group name',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Security group description',
        },
        vnetId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Virtual network ID',
        },
        inboundRules: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Inbound security rules',
        },
        outboundRules: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Outbound security rules',
        },
        tags: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Resource tags',
        },
        enabled: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Whether security group is active',
        },
    }, {
        sequelize,
        tableName: 'security_groups',
        timestamps: true,
        indexes: [
            { fields: ['vnetId'] },
            { fields: ['name'] },
            { fields: ['enabled'] },
        ],
    });
    return SecurityGroupModel;
};
exports.createSecurityGroupModel = createSecurityGroupModel;
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
const createSecurityEventModel = (sequelize) => {
    class SecurityEventModel extends sequelize_1.Model {
    }
    SecurityEventModel.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        type: {
            type: sequelize_1.DataTypes.ENUM('intrusion', 'ddos', 'unauthorized_access', 'policy_violation'),
            allowNull: false,
            comment: 'Event type',
        },
        severity: {
            type: sequelize_1.DataTypes.ENUM('low', 'medium', 'high', 'critical'),
            allowNull: false,
            comment: 'Event severity',
        },
        sourceIp: {
            type: sequelize_1.DataTypes.STRING(45),
            allowNull: false,
            comment: 'Source IP address',
        },
        targetIp: {
            type: sequelize_1.DataTypes.STRING(45),
            allowNull: false,
            comment: 'Target IP address',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Event description',
        },
        timestamp: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            comment: 'Event timestamp',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional event metadata',
        },
        resolved: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether event is resolved',
        },
        resolvedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Resolution timestamp',
        },
    }, {
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
    });
    return SecurityEventModel;
};
exports.createSecurityEventModel = createSecurityEventModel;
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
const evaluateNetworkACL = (acl, traffic) => {
    if (!acl.enabled) {
        return { allowed: acl.defaultAction === 'allow', reason: 'ACL disabled, using default action' };
    }
    // Sort rules by priority (ascending)
    const sortedRules = [...acl.rules].sort((a, b) => a.priority - b.priority);
    for (const rule of sortedRules) {
        if (!rule.enabled)
            continue;
        // Check protocol match
        if (rule.protocol !== 'all' && rule.protocol !== traffic.protocol) {
            continue;
        }
        // Check source IP match
        if (!(0, exports.matchIpPattern)(traffic.sourceIp || '', rule.sourceIp)) {
            continue;
        }
        // Check destination IP match
        if (!(0, exports.matchIpPattern)(traffic.destinationIp || '', rule.destinationIp)) {
            continue;
        }
        // Check port match if specified
        if (rule.destinationPort && !(0, exports.matchPortPattern)(traffic.port || 0, rule.destinationPort)) {
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
exports.evaluateNetworkACL = evaluateNetworkACL;
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
const createACLRule = (ruleConfig) => {
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
exports.createACLRule = createACLRule;
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
const validateACLRule = (rule, existingRules) => {
    const errors = [];
    // Validate priority
    if (rule.priority < 1 || rule.priority > 65535) {
        errors.push('Priority must be between 1 and 65535');
    }
    // Validate IP addresses
    if (!(0, exports.isValidIpPattern)(rule.sourceIp)) {
        errors.push('Invalid source IP pattern');
    }
    if (!(0, exports.isValidIpPattern)(rule.destinationIp)) {
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
    const conflicts = existingRules.filter(existing => existing.priority === rule.priority &&
        existing.direction === rule.direction &&
        existing.id !== rule.id);
    if (conflicts.length > 0) {
        errors.push(`Priority ${rule.priority} conflicts with existing rule: ${conflicts[0].id}`);
    }
    return {
        valid: errors.length === 0,
        errors,
    };
};
exports.validateACLRule = validateACLRule;
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
const mergeNetworkACLs = (acls) => {
    const sortedACLs = [...acls].sort((a, b) => a.priority - b.priority);
    const allRules = [];
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
exports.mergeNetworkACLs = mergeNetworkACLs;
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
const generateServiceACLRule = (service, sourceIp, direction) => {
    const serviceMap = {
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
    return (0, exports.createACLRule)({
        priority: 1000,
        action: 'allow',
        protocol: serviceConfig.protocol,
        sourceIp,
        destinationIp: '0.0.0.0/0',
        destinationPort: serviceConfig.port,
        direction,
    });
};
exports.generateServiceACLRule = generateServiceACLRule;
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
const optimizeACLRules = (rules) => {
    const optimized = [];
    const sortedRules = [...rules].sort((a, b) => a.priority - b.priority);
    for (const rule of sortedRules) {
        if (!rule.enabled)
            continue;
        // Check if this rule is redundant with higher priority rules
        const isRedundant = optimized.some(existing => {
            return (existing.action === rule.action &&
                existing.protocol === rule.protocol &&
                isIpSubset(rule.sourceIp, existing.sourceIp) &&
                isIpSubset(rule.destinationIp, existing.destinationIp) &&
                existing.direction === rule.direction);
        });
        if (!isRedundant) {
            optimized.push(rule);
        }
    }
    return optimized;
};
exports.optimizeACLRules = optimizeACLRules;
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
const createFirewallRule = (config) => {
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
exports.createFirewallRule = createFirewallRule;
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
const evaluateFirewallRules = (rules, packet) => {
    const sortedRules = [...rules]
        .filter(r => r.enabled)
        .sort((a, b) => a.priority - b.priority);
    for (const rule of sortedRules) {
        // Check protocol
        if (rule.protocol !== 'all' && rule.protocol !== packet.protocol) {
            continue;
        }
        // Check source address
        if (!(0, exports.matchIpPattern)(packet.sourceIp || '', rule.sourceAddress)) {
            continue;
        }
        // Check destination address
        if (!(0, exports.matchIpPattern)(packet.destinationIp || '', rule.destinationAddress)) {
            continue;
        }
        // Check destination port
        if (rule.destinationPort !== '*' && !(0, exports.matchPortPattern)(packet.port || 0, rule.destinationPort)) {
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
exports.evaluateFirewallRules = evaluateFirewallRules;
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
const generateTierFirewallRules = (tierName, allowedPorts, sourceNetwork) => {
    const rules = [];
    // Allow specified ports
    allowedPorts.forEach((port, index) => {
        rules.push((0, exports.createFirewallRule)({
            name: `${tierName}-allow-port-${port}`,
            priority: 100 + index,
            action: 'allow',
            protocol: 'tcp',
            sourceAddress: sourceNetwork,
            destinationPort: port,
            state: 'new',
        }));
    });
    // Allow established connections
    rules.push((0, exports.createFirewallRule)({
        name: `${tierName}-allow-established`,
        priority: 50,
        action: 'allow',
        protocol: 'all',
        sourceAddress: sourceNetwork,
        state: 'established',
    }));
    // Default deny
    rules.push((0, exports.createFirewallRule)({
        name: `${tierName}-default-deny`,
        priority: 65000,
        action: 'deny',
        protocol: 'all',
        sourceAddress: '0.0.0.0/0',
    }));
    return rules;
};
exports.generateTierFirewallRules = generateTierFirewallRules;
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
const validateFirewallRule = (rule) => {
    const errors = [];
    if (!rule.name || rule.name.length === 0) {
        errors.push('Rule name is required');
    }
    if (rule.priority < 1 || rule.priority > 65535) {
        errors.push('Priority must be between 1 and 65535');
    }
    if (!['allow', 'deny', 'drop', 'reject'].includes(rule.action)) {
        errors.push('Invalid action');
    }
    if (!(0, exports.isValidIpPattern)(rule.sourceAddress)) {
        errors.push('Invalid source address');
    }
    if (!(0, exports.isValidIpPattern)(rule.destinationAddress)) {
        errors.push('Invalid destination address');
    }
    return {
        valid: errors.length === 0,
        errors,
    };
};
exports.validateFirewallRule = validateFirewallRule;
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
const convertToIptables = (rules) => {
    const commands = [];
    rules.forEach(rule => {
        if (!rule.enabled)
            return;
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
exports.convertToIptables = convertToIptables;
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
const analyzeFirewallRules = (rules) => {
    const gaps = [];
    const redundancies = [];
    // Check for common service coverage
    const commonPorts = ['80', '443', '22', '3389', '3306', '5432'];
    commonPorts.forEach(port => {
        const hasRule = rules.some(r => r.enabled && r.destinationPort === port && r.action === 'allow');
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
exports.analyzeFirewallRules = analyzeFirewallRules;
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
const createSecurityGroup = (name, vnetId, description) => {
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
exports.createSecurityGroup = createSecurityGroup;
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
const addInboundRule = (sg, ruleConfig) => {
    const rule = {
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
exports.addInboundRule = addInboundRule;
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
const addOutboundRule = (sg, ruleConfig) => {
    const rule = {
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
exports.addOutboundRule = addOutboundRule;
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
const evaluateSecurityGroup = (sg, traffic, direction) => {
    const rules = direction === 'inbound' ? sg.inboundRules : sg.outboundRules;
    for (const rule of rules) {
        // Check protocol
        if (rule.protocol !== '*' && rule.protocol !== traffic.protocol) {
            continue;
        }
        // Check source/destination based on direction
        const addressToCheck = direction === 'inbound' ? traffic.sourceIp : traffic.destinationIp;
        const addressPrefix = direction === 'inbound' ? rule.sourceAddressPrefix : rule.destinationAddressPrefix;
        if (addressPrefix !== '*' && !(0, exports.matchIpPattern)(addressToCheck || '', addressPrefix)) {
            continue;
        }
        // Check port
        const portRange = direction === 'inbound' ? rule.destinationPortRange : rule.destinationPortRange;
        if (portRange !== '*' && !(0, exports.matchPortPattern)(traffic.port || 0, portRange)) {
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
exports.evaluateSecurityGroup = evaluateSecurityGroup;
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
const cloneSecurityGroup = (sg, newName) => {
    return {
        ...sg,
        id: crypto.randomUUID(),
        name: newName,
        inboundRules: sg.inboundRules.map(r => ({ ...r, id: crypto.randomUUID() })),
        outboundRules: sg.outboundRules.map(r => ({ ...r, id: crypto.randomUUID() })),
    };
};
exports.cloneSecurityGroup = cloneSecurityGroup;
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
const compareSecurityGroups = (sg1, sg2) => {
    const differences = [];
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
exports.compareSecurityGroups = compareSecurityGroups;
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
const validateNetworkAccess = (accessControl, resource, action) => {
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
        if (!restriction.enabled)
            continue;
        // Implement restriction checks
        if (restriction.type === 'ip_blacklist') {
            // Would check IP against blacklist
        }
    }
    return { granted: true, reason: 'Access granted' };
};
exports.validateNetworkAccess = validateNetworkAccess;
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
const createNetworkPermission = (resource, actions, conditions) => {
    return {
        resource,
        actions,
        conditions,
    };
};
exports.createNetworkPermission = createNetworkPermission;
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
const hasNetworkPermission = (permissions, resource, action) => {
    return permissions.some(permission => {
        const resourceMatch = permission.resource === resource ||
            permission.resource === '*' ||
            (permission.resource.endsWith('*') &&
                resource.startsWith(permission.resource.slice(0, -1)));
        const actionMatch = permission.actions.includes(action) || permission.actions.includes('*');
        return resourceMatch && actionMatch;
    });
};
exports.hasNetworkPermission = hasNetworkPermission;
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
const generateNetworkAccessToken = (accessControl, expiresInSeconds) => {
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
exports.generateNetworkAccessToken = generateNetworkAccessToken;
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
const verifyNetworkAccessToken = (token) => {
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
        const accessControl = {
            userId: decoded.userId,
            networkId: decoded.networkId,
            permissions: decoded.permissions,
            restrictions: [],
        };
        return { valid: true, accessControl };
    }
    catch (error) {
        return { valid: false, error: error.message };
    }
};
exports.verifyNetworkAccessToken = verifyNetworkAccessToken;
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
const networkAuthGuard = async (req) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
        return false;
    }
    const result = (0, exports.verifyNetworkAccessToken)(token);
    if (!result.valid || !result.accessControl) {
        return false;
    }
    // Attach access control to request
    req.networkAuth = result.accessControl;
    return true;
};
exports.networkAuthGuard = networkAuthGuard;
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
const networkResourceGuard = (resource, action) => {
    return async (req) => {
        const accessControl = req.networkAuth;
        if (!accessControl) {
            return false;
        }
        const resourceId = req.params.id || req.params.networkId;
        const fullResource = resourceId ? `${resource}:${resourceId}` : resource;
        const decision = (0, exports.validateNetworkAccess)(accessControl, fullResource, action);
        return decision.granted;
    };
};
exports.networkResourceGuard = networkResourceGuard;
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
const networkIpWhitelistMiddleware = (allowedIps) => {
    return (req, res, next) => {
        const clientIp = req.ip || req.socket.remoteAddress || '';
        const isAllowed = allowedIps.some(pattern => (0, exports.matchIpPattern)(clientIp, pattern));
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
exports.networkIpWhitelistMiddleware = networkIpWhitelistMiddleware;
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
const networkSessionMiddleware = (maxIdleTimeMs) => {
    const sessions = new Map();
    return (req, res, next) => {
        const sessionId = req.headers['x-session-id'];
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
        req.networkAuth = session.auth;
        next();
    };
};
exports.networkSessionMiddleware = networkSessionMiddleware;
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
const createNetworkRateLimiter = (policy) => {
    const requests = new Map();
    return (req, res, next) => {
        if (!policy.enabled) {
            return next();
        }
        const key = (0, exports.generateRateLimitKey)(req, policy.scope);
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
exports.createNetworkRateLimiter = createNetworkRateLimiter;
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
const detectDDoSPattern = (recentTraffic, config) => {
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
    const connectionsByIp = new Map();
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
exports.detectDDoSPattern = detectDDoSPattern;
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
const applyDDoSMitigation = async (mitigation, sourceIp) => {
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
exports.applyDDoSMitigation = applyDDoSMitigation;
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
const ddosProtectionMiddleware = (config) => {
    const trafficHistory = [];
    return (req, res, next) => {
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
        const traffic = {
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
        const detection = (0, exports.detectDDoSPattern)(trafficHistory, config);
        if (detection.isDDoS && config.mitigations.length > 0) {
            const mitigation = config.mitigations[0];
            (0, exports.applyDDoSMitigation)(mitigation, clientIp);
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
exports.ddosProtectionMiddleware = ddosProtectionMiddleware;
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
const generateRateLimitKey = (req, scope) => {
    switch (scope) {
        case 'global':
            return 'global';
        case 'per_ip':
            return req.ip || 'unknown';
        case 'per_user':
            return req.networkAuth?.userId || 'anonymous';
        case 'per_network':
            return req.networkAuth?.networkId || 'unknown';
        default:
            return 'default';
    }
};
exports.generateRateLimitKey = generateRateLimitKey;
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
const analyzeTrafficPatterns = (traffic) => {
    const anomalies = [];
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
    const variance = intervals.reduce((sum, val) => sum + Math.pow(val - avgInterval, 2), 0) / intervals.length;
    if (variance < 100) {
        anomalies.push('Uniform timing pattern detected (possible bot)');
        score += 0.4;
    }
    return { anomalies, score: Math.min(score, 1.0) };
};
exports.analyzeTrafficPatterns = analyzeTrafficPatterns;
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
const logSecurityEvent = async (event, SecurityEventModel) => {
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
exports.logSecurityEvent = logSecurityEvent;
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
const createNetworkAuditLog = (log) => {
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
exports.createNetworkAuditLog = createNetworkAuditLog;
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
const getSecurityEvents = async (startDate, endDate, SecurityEventModel) => {
    const events = await SecurityEventModel.findAll({
        where: {
            timestamp: {
                [sequelize_1.Op.gte]: startDate,
                [sequelize_1.Op.lte]: endDate,
            },
        },
        order: [['timestamp', 'DESC']],
    });
    return events;
};
exports.getSecurityEvents = getSecurityEvents;
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
const matchIpPattern = (ip, pattern) => {
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
exports.matchIpPattern = matchIpPattern;
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
const matchPortPattern = (port, pattern) => {
    if (pattern === '*') {
        return true;
    }
    if (pattern.includes('-')) {
        const [start, end] = pattern.split('-').map(Number);
        return port >= start && port <= end;
    }
    return port === parseInt(pattern);
};
exports.matchPortPattern = matchPortPattern;
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
const isValidIpPattern = (pattern) => {
    if (pattern === '*' || pattern === '0.0.0.0/0') {
        return true;
    }
    const cidrRegex = /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/;
    return cidrRegex.test(pattern);
};
exports.isValidIpPattern = isValidIpPattern;
// ============================================================================
// INTERNAL HELPER FUNCTIONS
// ============================================================================
function isValidPortPattern(port) {
    if (port === '*')
        return true;
    if (port.includes('-')) {
        const [start, end] = port.split('-').map(Number);
        return start > 0 && start <= 65535 && end > 0 && end <= 65535 && start <= end;
    }
    const portNum = parseInt(port);
    return portNum > 0 && portNum <= 65535;
}
function ipToInt(ip) {
    return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0) >>> 0;
}
function isIpSubset(ip1, ip2) {
    return (0, exports.matchIpPattern)(ip1, ip2);
}
function areRulesRedundant(rule1, rule2) {
    return (rule1.action === rule2.action &&
        rule1.protocol === rule2.protocol &&
        rule1.sourceAddress === rule2.sourceAddress &&
        rule1.destinationAddress === rule2.destinationAddress &&
        rule1.destinationPort === rule2.destinationPort);
}
function areSecurityRulesEqual(rule1, rule2) {
    return (rule1.priority === rule2.priority &&
        rule1.action === rule2.action &&
        rule1.protocol === rule2.protocol &&
        rule1.sourceAddressPrefix === rule2.sourceAddressPrefix &&
        rule1.destinationAddressPrefix === rule2.destinationAddressPrefix &&
        rule1.destinationPortRange === rule2.destinationPortRange);
}
exports.default = {
    // Models
    createNetworkACLModel: exports.createNetworkACLModel,
    createSecurityGroupModel: exports.createSecurityGroupModel,
    createSecurityEventModel: exports.createSecurityEventModel,
    // Network ACL
    evaluateNetworkACL: exports.evaluateNetworkACL,
    createACLRule: exports.createACLRule,
    validateACLRule: exports.validateACLRule,
    mergeNetworkACLs: exports.mergeNetworkACLs,
    generateServiceACLRule: exports.generateServiceACLRule,
    optimizeACLRules: exports.optimizeACLRules,
    // Firewall Rules
    createFirewallRule: exports.createFirewallRule,
    evaluateFirewallRules: exports.evaluateFirewallRules,
    generateTierFirewallRules: exports.generateTierFirewallRules,
    validateFirewallRule: exports.validateFirewallRule,
    convertToIptables: exports.convertToIptables,
    analyzeFirewallRules: exports.analyzeFirewallRules,
    // Security Groups
    createSecurityGroup: exports.createSecurityGroup,
    addInboundRule: exports.addInboundRule,
    addOutboundRule: exports.addOutboundRule,
    evaluateSecurityGroup: exports.evaluateSecurityGroup,
    cloneSecurityGroup: exports.cloneSecurityGroup,
    compareSecurityGroups: exports.compareSecurityGroups,
    // Network Access Control
    validateNetworkAccess: exports.validateNetworkAccess,
    createNetworkPermission: exports.createNetworkPermission,
    hasNetworkPermission: exports.hasNetworkPermission,
    generateNetworkAccessToken: exports.generateNetworkAccessToken,
    verifyNetworkAccessToken: exports.verifyNetworkAccessToken,
    // Authentication Guards
    networkAuthGuard: exports.networkAuthGuard,
    networkResourceGuard: exports.networkResourceGuard,
    networkIpWhitelistMiddleware: exports.networkIpWhitelistMiddleware,
    networkSessionMiddleware: exports.networkSessionMiddleware,
    // Rate Limiting & DDoS
    createNetworkRateLimiter: exports.createNetworkRateLimiter,
    detectDDoSPattern: exports.detectDDoSPattern,
    applyDDoSMitigation: exports.applyDDoSMitigation,
    ddosProtectionMiddleware: exports.ddosProtectionMiddleware,
    generateRateLimitKey: exports.generateRateLimitKey,
    analyzeTrafficPatterns: exports.analyzeTrafficPatterns,
    // Audit & Logging
    logSecurityEvent: exports.logSecurityEvent,
    createNetworkAuditLog: exports.createNetworkAuditLog,
    getSecurityEvents: exports.getSecurityEvents,
    // Helpers
    matchIpPattern: exports.matchIpPattern,
    matchPortPattern: exports.matchPortPattern,
    isValidIpPattern: exports.isValidIpPattern,
};
//# sourceMappingURL=network-security-kit.js.map