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
import { Sequelize } from 'sequelize';
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
export declare const createNetworkACLModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        name: string;
        rules: ACLRule[];
        defaultAction: "allow" | "deny";
        priority: number;
        enabled: boolean;
        networkId: string;
        description: string;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
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
export declare const createSecurityGroupModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        name: string;
        description: string;
        vnetId: string;
        inboundRules: SecurityRule[];
        outboundRules: SecurityRule[];
        tags: Record<string, string>;
        enabled: boolean;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
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
export declare const createSecurityEventModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        type: string;
        severity: string;
        sourceIp: string;
        targetIp: string;
        description: string;
        timestamp: Date;
        metadata: Record<string, any>;
        resolved: boolean;
        resolvedAt: Date | null;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
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
export declare const evaluateNetworkACL: (acl: NetworkACL, traffic: Partial<TrafficPattern>) => {
    allowed: boolean;
    matchedRule?: ACLRule;
    reason: string;
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
export declare const createACLRule: (ruleConfig: Partial<ACLRule>) => ACLRule;
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
export declare const validateACLRule: (rule: ACLRule, existingRules: ACLRule[]) => {
    valid: boolean;
    errors: string[];
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
export declare const mergeNetworkACLs: (acls: NetworkACL[]) => NetworkACL;
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
export declare const generateServiceACLRule: (service: string, sourceIp: string, direction: "inbound" | "outbound") => ACLRule;
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
export declare const optimizeACLRules: (rules: ACLRule[]) => ACLRule[];
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
export declare const createFirewallRule: (config: Partial<FirewallRule>) => FirewallRule;
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
export declare const evaluateFirewallRules: (rules: FirewallRule[], packet: Partial<TrafficPattern>) => {
    action: string;
    matchedRule?: FirewallRule;
    logged: boolean;
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
export declare const generateTierFirewallRules: (tierName: string, allowedPorts: string[], sourceNetwork: string) => FirewallRule[];
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
export declare const validateFirewallRule: (rule: FirewallRule) => {
    valid: boolean;
    errors: string[];
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
export declare const convertToIptables: (rules: FirewallRule[]) => string[];
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
export declare const analyzeFirewallRules: (rules: FirewallRule[]) => {
    coverage: number;
    gaps: string[];
    redundancies: string[];
};
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
export declare const createSecurityGroup: (name: string, vnetId: string, description: string) => SecurityGroup;
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
export declare const addInboundRule: (sg: SecurityGroup, ruleConfig: Partial<SecurityRule>) => SecurityGroup;
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
export declare const addOutboundRule: (sg: SecurityGroup, ruleConfig: Partial<SecurityRule>) => SecurityGroup;
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
export declare const evaluateSecurityGroup: (sg: SecurityGroup, traffic: Partial<TrafficPattern>, direction: "inbound" | "outbound") => {
    allowed: boolean;
    matchedRule?: SecurityRule;
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
export declare const cloneSecurityGroup: (sg: SecurityGroup, newName: string) => SecurityGroup;
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
export declare const compareSecurityGroups: (sg1: SecurityGroup, sg2: SecurityGroup) => {
    differences: string[];
    identical: boolean;
};
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
export declare const validateNetworkAccess: (accessControl: NetworkAccessControl, resource: string, action: string) => {
    granted: boolean;
    reason: string;
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
export declare const createNetworkPermission: (resource: string, actions: string[], conditions?: Record<string, any>) => NetworkPermission;
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
export declare const hasNetworkPermission: (permissions: NetworkPermission[], resource: string, action: string) => boolean;
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
export declare const generateNetworkAccessToken: (accessControl: NetworkAccessControl, expiresInSeconds: number) => string;
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
export declare const verifyNetworkAccessToken: (token: string) => {
    valid: boolean;
    accessControl?: NetworkAccessControl;
    error?: string;
};
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
export declare const networkAuthGuard: (req: Request) => Promise<boolean>;
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
export declare const networkResourceGuard: (resource: string, action: string) => (req: Request) => Promise<boolean>;
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
export declare const networkIpWhitelistMiddleware: (allowedIps: string[]) => (req: Request, res: Response, next: NextFunction) => any;
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
export declare const networkSessionMiddleware: (maxIdleTimeMs: number) => (req: Request, res: Response, next: NextFunction) => any;
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
export declare const createNetworkRateLimiter: (policy: RateLimitPolicy) => (req: Request, res: Response, next: NextFunction) => any;
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
export declare const detectDDoSPattern: (recentTraffic: TrafficPattern[], config: DDoSProtectionConfig) => {
    isDDoS: boolean;
    attackType?: string;
    severity: string;
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
export declare const applyDDoSMitigation: (mitigation: DDoSMitigation, sourceIp: string) => Promise<void>;
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
export declare const ddosProtectionMiddleware: (config: DDoSProtectionConfig) => (req: Request, res: Response, next: NextFunction) => any;
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
export declare const generateRateLimitKey: (req: Request, scope: string) => string;
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
export declare const analyzeTrafficPatterns: (traffic: TrafficPattern[]) => {
    anomalies: string[];
    score: number;
};
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
export declare const logSecurityEvent: (event: Partial<SecurityEvent>, SecurityEventModel: any) => Promise<void>;
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
export declare const createNetworkAuditLog: (log: Partial<NetworkAuditLog>) => NetworkAuditLog;
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
export declare const getSecurityEvents: (startDate: Date, endDate: Date, SecurityEventModel: any) => Promise<SecurityEvent[]>;
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
export declare const matchIpPattern: (ip: string, pattern: string) => boolean;
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
export declare const matchPortPattern: (port: number, pattern: string) => boolean;
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
export declare const isValidIpPattern: (pattern: string) => boolean;
declare const _default: {
    createNetworkACLModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            name: string;
            rules: ACLRule[];
            defaultAction: "allow" | "deny";
            priority: number;
            enabled: boolean;
            networkId: string;
            description: string;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createSecurityGroupModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            name: string;
            description: string;
            vnetId: string;
            inboundRules: SecurityRule[];
            outboundRules: SecurityRule[];
            tags: Record<string, string>;
            enabled: boolean;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createSecurityEventModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            type: string;
            severity: string;
            sourceIp: string;
            targetIp: string;
            description: string;
            timestamp: Date;
            metadata: Record<string, any>;
            resolved: boolean;
            resolvedAt: Date | null;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    evaluateNetworkACL: (acl: NetworkACL, traffic: Partial<TrafficPattern>) => {
        allowed: boolean;
        matchedRule?: ACLRule;
        reason: string;
    };
    createACLRule: (ruleConfig: Partial<ACLRule>) => ACLRule;
    validateACLRule: (rule: ACLRule, existingRules: ACLRule[]) => {
        valid: boolean;
        errors: string[];
    };
    mergeNetworkACLs: (acls: NetworkACL[]) => NetworkACL;
    generateServiceACLRule: (service: string, sourceIp: string, direction: "inbound" | "outbound") => ACLRule;
    optimizeACLRules: (rules: ACLRule[]) => ACLRule[];
    createFirewallRule: (config: Partial<FirewallRule>) => FirewallRule;
    evaluateFirewallRules: (rules: FirewallRule[], packet: Partial<TrafficPattern>) => {
        action: string;
        matchedRule?: FirewallRule;
        logged: boolean;
    };
    generateTierFirewallRules: (tierName: string, allowedPorts: string[], sourceNetwork: string) => FirewallRule[];
    validateFirewallRule: (rule: FirewallRule) => {
        valid: boolean;
        errors: string[];
    };
    convertToIptables: (rules: FirewallRule[]) => string[];
    analyzeFirewallRules: (rules: FirewallRule[]) => {
        coverage: number;
        gaps: string[];
        redundancies: string[];
    };
    createSecurityGroup: (name: string, vnetId: string, description: string) => SecurityGroup;
    addInboundRule: (sg: SecurityGroup, ruleConfig: Partial<SecurityRule>) => SecurityGroup;
    addOutboundRule: (sg: SecurityGroup, ruleConfig: Partial<SecurityRule>) => SecurityGroup;
    evaluateSecurityGroup: (sg: SecurityGroup, traffic: Partial<TrafficPattern>, direction: "inbound" | "outbound") => {
        allowed: boolean;
        matchedRule?: SecurityRule;
    };
    cloneSecurityGroup: (sg: SecurityGroup, newName: string) => SecurityGroup;
    compareSecurityGroups: (sg1: SecurityGroup, sg2: SecurityGroup) => {
        differences: string[];
        identical: boolean;
    };
    validateNetworkAccess: (accessControl: NetworkAccessControl, resource: string, action: string) => {
        granted: boolean;
        reason: string;
    };
    createNetworkPermission: (resource: string, actions: string[], conditions?: Record<string, any>) => NetworkPermission;
    hasNetworkPermission: (permissions: NetworkPermission[], resource: string, action: string) => boolean;
    generateNetworkAccessToken: (accessControl: NetworkAccessControl, expiresInSeconds: number) => string;
    verifyNetworkAccessToken: (token: string) => {
        valid: boolean;
        accessControl?: NetworkAccessControl;
        error?: string;
    };
    networkAuthGuard: (req: Request) => Promise<boolean>;
    networkResourceGuard: (resource: string, action: string) => (req: Request) => Promise<boolean>;
    networkIpWhitelistMiddleware: (allowedIps: string[]) => (req: Request, res: Response, next: NextFunction) => any;
    networkSessionMiddleware: (maxIdleTimeMs: number) => (req: Request, res: Response, next: NextFunction) => any;
    createNetworkRateLimiter: (policy: RateLimitPolicy) => (req: Request, res: Response, next: NextFunction) => any;
    detectDDoSPattern: (recentTraffic: TrafficPattern[], config: DDoSProtectionConfig) => {
        isDDoS: boolean;
        attackType?: string;
        severity: string;
    };
    applyDDoSMitigation: (mitigation: DDoSMitigation, sourceIp: string) => Promise<void>;
    ddosProtectionMiddleware: (config: DDoSProtectionConfig) => (req: Request, res: Response, next: NextFunction) => any;
    generateRateLimitKey: (req: Request, scope: string) => string;
    analyzeTrafficPatterns: (traffic: TrafficPattern[]) => {
        anomalies: string[];
        score: number;
    };
    logSecurityEvent: (event: Partial<SecurityEvent>, SecurityEventModel: any) => Promise<void>;
    createNetworkAuditLog: (log: Partial<NetworkAuditLog>) => NetworkAuditLog;
    getSecurityEvents: (startDate: Date, endDate: Date, SecurityEventModel: any) => Promise<SecurityEvent[]>;
    matchIpPattern: (ip: string, pattern: string) => boolean;
    matchPortPattern: (port: number, pattern: string) => boolean;
    isValidIpPattern: (pattern: string) => boolean;
};
export default _default;
//# sourceMappingURL=network-security-kit.d.ts.map