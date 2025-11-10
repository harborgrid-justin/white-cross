/**
 * @fileoverview Network Models Kit - Comprehensive Sequelize models for enterprise virtual networks
 * @module reuse/san/network-models-kit
 * @description Complete Sequelize model definitions and utilities for software-defined networking (SDN),
 * virtual networks, network nodes, interfaces, links, ACLs, routing, and network configuration management.
 *
 * Key Features:
 * - Virtual network model definitions with VLAN support
 * - Network node/device models (routers, switches, load balancers)
 * - Network interface models with IP/MAC management
 * - Network link/connection models with bandwidth specs
 * - Network ACL models for access control
 * - Network route table and routing models
 * - Subnet and IP address management
 * - Network validation (IP, CIDR, MAC, VLAN)
 * - Network configuration helpers
 * - Network-specific hooks and lifecycle events
 * - Network scopes and query patterns
 * - Network topology utilities
 *
 * @target Sequelize v6.x, Node 18+, TypeScript 5.x, PostgreSQL 14+
 *
 * @security
 * - IP address validation and sanitization
 * - CIDR notation validation
 * - MAC address format validation
 * - Port range validation (1-65535)
 * - VLAN ID validation (1-4094)
 * - Protocol whitelist validation
 * - Audit logging for network changes
 * - Network isolation enforcement
 * - ACL rule validation
 *
 * @example Virtual network creation
 * ```typescript
 * import { createVirtualNetworkModel, addCIDRValidation } from './network-models-kit';
 *
 * const VirtualNetwork = createVirtualNetworkModel(sequelize, {
 *   enableVLAN: true,
 *   enableACL: true,
 *   enableRouting: true
 * });
 * ```
 *
 * @example Network node with interfaces
 * ```typescript
 * import { createNetworkNodeModel, createNetworkInterfaceModel } from './network-models-kit';
 *
 * const NetworkNode = createNetworkNodeModel(sequelize, 'ROUTER');
 * const NetworkInterface = createNetworkInterfaceModel(sequelize);
 *
 * // Associate nodes with interfaces
 * NetworkNode.hasMany(NetworkInterface);
 * NetworkInterface.belongsTo(NetworkNode);
 * ```
 *
 * @example Network ACL configuration
 * ```typescript
 * import { createNetworkACLModel, addACLUpdateHook } from './network-models-kit';
 *
 * const NetworkACL = createNetworkACLModel(sequelize);
 * addACLUpdateHook(NetworkACL, async (acl) => {
 *   await invalidateConnectionCache(acl.networkId);
 * });
 * ```
 *
 * LOC: NET-MODEL-001
 * UPSTREAM: sequelize, @types/sequelize, ipaddr.js, netmask
 * DOWNSTREAM: network services, routing engine, ACL processor, topology manager
 *
 * @version 1.0.0
 * @since 2025-11-08
 */
import { Model, ModelStatic, Sequelize, ModelOptions } from 'sequelize';
/**
 * @enum NetworkType
 * @description Types of virtual networks
 */
export declare enum NetworkType {
    LAN = "LAN",
    VLAN = "VLAN",
    VPN = "VPN",
    OVERLAY = "OVERLAY",
    UNDERLAY = "UNDERLAY",
    MANAGEMENT = "MANAGEMENT",
    STORAGE = "STORAGE",
    DMZ = "DMZ"
}
/**
 * @enum NetworkNodeType
 * @description Types of network nodes/devices
 */
export declare enum NetworkNodeType {
    ROUTER = "ROUTER",
    SWITCH = "SWITCH",
    LOAD_BALANCER = "LOAD_BALANCER",
    FIREWALL = "FIREWALL",
    GATEWAY = "GATEWAY",
    PROXY = "PROXY",
    VPN_ENDPOINT = "VPN_ENDPOINT",
    NAT_GATEWAY = "NAT_GATEWAY"
}
/**
 * @enum NetworkNodeStatus
 * @description Operational status of network nodes
 */
export declare enum NetworkNodeStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    DEGRADED = "DEGRADED",
    MAINTENANCE = "MAINTENANCE",
    FAILED = "FAILED",
    PROVISIONING = "PROVISIONING"
}
/**
 * @enum InterfaceType
 * @description Types of network interfaces
 */
export declare enum InterfaceType {
    PHYSICAL = "PHYSICAL",
    VIRTUAL = "VIRTUAL",
    LOOPBACK = "LOOPBACK",
    TUNNEL = "TUNNEL",
    BOND = "BOND",
    VLAN = "VLAN"
}
/**
 * @enum InterfaceStatus
 * @description Status of network interfaces
 */
export declare enum InterfaceStatus {
    UP = "UP",
    DOWN = "DOWN",
    TESTING = "TESTING",
    UNKNOWN = "UNKNOWN",
    DORMANT = "DORMANT"
}
/**
 * @enum ACLAction
 * @description ACL rule actions
 */
export declare enum ACLAction {
    ALLOW = "ALLOW",
    DENY = "DENY",
    REJECT = "REJECT",
    LOG = "LOG"
}
/**
 * @enum NetworkProtocol
 * @description Network protocols
 */
export declare enum NetworkProtocol {
    TCP = "TCP",
    UDP = "UDP",
    ICMP = "ICMP",
    ICMPV6 = "ICMPV6",
    ESP = "ESP",
    AH = "AH",
    GRE = "GRE",
    ALL = "ALL"
}
/**
 * @enum RouteType
 * @description Routing table entry types
 */
export declare enum RouteType {
    STATIC = "STATIC",
    DYNAMIC = "DYNAMIC",
    CONNECTED = "CONNECTED",
    DEFAULT = "DEFAULT",
    BLACKHOLE = "BLACKHOLE"
}
/**
 * @interface VirtualNetworkConfig
 * @description Virtual network configuration options
 */
export interface VirtualNetworkConfig {
    enableVLAN?: boolean;
    enableACL?: boolean;
    enableRouting?: boolean;
    enableDHCP?: boolean;
    enableDNS?: boolean;
    mtu?: number;
    vlanId?: number;
}
/**
 * @interface NetworkNodeConfig
 * @description Network node configuration
 */
export interface NetworkNodeConfig {
    hostname?: string;
    managementIP?: string;
    credentials?: Record<string, string>;
    features?: string[];
    maxInterfaces?: number;
    hardwareSpecs?: Record<string, any>;
}
/**
 * @interface ACLRule
 * @description Access Control List rule definition
 */
export interface ACLRule {
    priority: number;
    action: ACLAction;
    protocol: NetworkProtocol;
    sourceIP?: string;
    sourceCIDR?: string;
    sourcePort?: number | string;
    destinationIP?: string;
    destinationCIDR?: string;
    destinationPort?: number | string;
    description?: string;
}
/**
 * @interface RouteEntry
 * @description Route table entry
 */
export interface RouteEntry {
    destination: string;
    netmask?: string;
    gateway: string;
    metric: number;
    interface?: string;
    type: RouteType;
}
/**
 * @interface SubnetInfo
 * @description Calculated subnet information
 */
export interface SubnetInfo {
    network: string;
    broadcast: string;
    firstHost: string;
    lastHost: string;
    totalHosts: number;
    usableHosts: number;
    netmask: string;
    wildcardMask: string;
    cidr: string;
}
/**
 * Creates a VirtualNetwork model with VLAN and segmentation support
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {VirtualNetworkConfig} [config={}] - Network configuration
 * @param {Partial<ModelOptions>} [options={}] - Additional model options
 * @returns {ModelStatic<Model>} VirtualNetwork model
 *
 * @example
 * ```typescript
 * const VirtualNetwork = createVirtualNetworkModel(sequelize, {
 *   enableVLAN: true,
 *   enableACL: true,
 *   vlanId: 100
 * });
 * ```
 */
export declare const createVirtualNetworkModel: (sequelize: Sequelize, config?: VirtualNetworkConfig, options?: Partial<ModelOptions>) => ModelStatic<Model>;
/**
 * Creates a NetworkNode model for routers, switches, and other devices
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {NetworkNodeType} [defaultType] - Default node type
 * @param {Partial<ModelOptions>} [options={}] - Additional model options
 * @returns {ModelStatic<Model>} NetworkNode model
 *
 * @example
 * ```typescript
 * const NetworkNode = createNetworkNodeModel(sequelize, NetworkNodeType.ROUTER);
 * ```
 */
export declare const createNetworkNodeModel: (sequelize: Sequelize, defaultType?: NetworkNodeType, options?: Partial<ModelOptions>) => ModelStatic<Model>;
/**
 * Creates a NetworkInterface model for network interface cards
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<ModelOptions>} [options={}] - Additional model options
 * @returns {ModelStatic<Model>} NetworkInterface model
 *
 * @example
 * ```typescript
 * const NetworkInterface = createNetworkInterfaceModel(sequelize);
 * ```
 */
export declare const createNetworkInterfaceModel: (sequelize: Sequelize, options?: Partial<ModelOptions>) => ModelStatic<Model>;
/**
 * Creates a NetworkLink model for connections between nodes
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<ModelOptions>} [options={}] - Additional model options
 * @returns {ModelStatic<Model>} NetworkLink model
 *
 * @example
 * ```typescript
 * const NetworkLink = createNetworkLinkModel(sequelize);
 * ```
 */
export declare const createNetworkLinkModel: (sequelize: Sequelize, options?: Partial<ModelOptions>) => ModelStatic<Model>;
/**
 * Creates a NetworkACL model for access control lists
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<ModelOptions>} [options={}] - Additional model options
 * @returns {ModelStatic<Model>} NetworkACL model
 *
 * @example
 * ```typescript
 * const NetworkACL = createNetworkACLModel(sequelize);
 * ```
 */
export declare const createNetworkACLModel: (sequelize: Sequelize, options?: Partial<ModelOptions>) => ModelStatic<Model>;
/**
 * Creates a NetworkRouteTable model for routing configuration
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<ModelOptions>} [options={}] - Additional model options
 * @returns {ModelStatic<Model>} NetworkRouteTable model
 *
 * @example
 * ```typescript
 * const NetworkRouteTable = createNetworkRouteTableModel(sequelize);
 * ```
 */
export declare const createNetworkRouteTableModel: (sequelize: Sequelize, options?: Partial<ModelOptions>) => ModelStatic<Model>;
/**
 * Creates a NetworkRoute model for individual route entries
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<ModelOptions>} [options={}] - Additional model options
 * @returns {ModelStatic<Model>} NetworkRoute model
 *
 * @example
 * ```typescript
 * const NetworkRoute = createNetworkRouteModel(sequelize);
 * ```
 */
export declare const createNetworkRouteModel: (sequelize: Sequelize, options?: Partial<ModelOptions>) => ModelStatic<Model>;
/**
 * Creates a Subnet model for IP address management
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<ModelOptions>} [options={}] - Additional model options
 * @returns {ModelStatic<Model>} Subnet model
 *
 * @example
 * ```typescript
 * const Subnet = createSubnetModel(sequelize);
 * ```
 */
export declare const createSubnetModel: (sequelize: Sequelize, options?: Partial<ModelOptions>) => ModelStatic<Model>;
/**
 * Adds IPv4 address validation to a model field
 *
 * @param {ModelStatic<Model>} model - Model to modify
 * @param {string} fieldName - Field name
 * @param {boolean} [required=false] - Whether field is required
 * @returns {void}
 *
 * @example
 * ```typescript
 * addIPv4Validation(NetworkNode, 'ipAddress', true);
 * ```
 */
export declare const addIPv4Validation: (model: ModelStatic<Model>, fieldName: string, required?: boolean) => void;
/**
 * Adds IPv6 address validation to a model field
 *
 * @param {ModelStatic<Model>} model - Model to modify
 * @param {string} fieldName - Field name
 * @param {boolean} [required=false] - Whether field is required
 * @returns {void}
 *
 * @example
 * ```typescript
 * addIPv6Validation(NetworkNode, 'ipv6Address');
 * ```
 */
export declare const addIPv6Validation: (model: ModelStatic<Model>, fieldName: string, required?: boolean) => void;
/**
 * Adds CIDR notation validation to a model field
 *
 * @param {ModelStatic<Model>} model - Model to modify
 * @param {string} fieldName - Field name
 * @returns {void}
 *
 * @example
 * ```typescript
 * addCIDRValidation(VirtualNetwork, 'cidr');
 * ```
 */
export declare const addCIDRValidation: (model: ModelStatic<Model>, fieldName: string) => void;
/**
 * Adds MAC address validation to a model field
 *
 * @param {ModelStatic<Model>} model - Model to modify
 * @param {string} fieldName - Field name
 * @returns {void}
 *
 * @example
 * ```typescript
 * addMACAddressValidation(NetworkInterface, 'macAddress');
 * ```
 */
export declare const addMACAddressValidation: (model: ModelStatic<Model>, fieldName: string) => void;
/**
 * Adds VLAN ID validation to a model field
 *
 * @param {ModelStatic<Model>} model - Model to modify
 * @param {string} fieldName - Field name
 * @returns {void}
 *
 * @example
 * ```typescript
 * addVLANValidation(VirtualNetwork, 'vlanId');
 * ```
 */
export declare const addVLANValidation: (model: ModelStatic<Model>, fieldName: string) => void;
/**
 * Adds port number validation to a model field
 *
 * @param {ModelStatic<Model>} model - Model to modify
 * @param {string} fieldName - Field name
 * @returns {void}
 *
 * @example
 * ```typescript
 * addPortValidation(NetworkACL, 'destinationPort');
 * ```
 */
export declare const addPortValidation: (model: ModelStatic<Model>, fieldName: string) => void;
/**
 * Adds network protocol validation to a model field
 *
 * @param {ModelStatic<Model>} model - Model to modify
 * @param {string} fieldName - Field name
 * @returns {void}
 *
 * @example
 * ```typescript
 * addProtocolValidation(NetworkACL, 'protocol');
 * ```
 */
export declare const addProtocolValidation: (model: ModelStatic<Model>, fieldName: string) => void;
/**
 * Adds bandwidth validation to a model field
 *
 * @param {ModelStatic<Model>} model - Model to modify
 * @param {string} fieldName - Field name
 * @param {number} [maxBandwidth] - Maximum bandwidth in bps
 * @returns {void}
 *
 * @example
 * ```typescript
 * addBandwidthValidation(NetworkInterface, 'bandwidth', 10000000000); // 10 Gbps
 * ```
 */
export declare const addBandwidthValidation: (model: ModelStatic<Model>, fieldName: string, maxBandwidth?: number) => void;
/**
 * Adds network range validation (CIDR overlap check)
 *
 * @param {ModelStatic<Model>} model - Model to modify
 * @param {string} fieldName - CIDR field name
 * @returns {void}
 *
 * @example
 * ```typescript
 * addNetworkRangeValidation(Subnet, 'cidr');
 * ```
 */
export declare const addNetworkRangeValidation: (model: ModelStatic<Model>, fieldName: string) => void;
/**
 * Adds subnet mask validation to a model field
 *
 * @param {ModelStatic<Model>} model - Model to modify
 * @param {string} fieldName - Field name
 * @returns {void}
 *
 * @example
 * ```typescript
 * addSubnetMaskValidation(NetworkInterface, 'netmask');
 * ```
 */
export declare const addSubnetMaskValidation: (model: ModelStatic<Model>, fieldName: string) => void;
/**
 * Configures network isolation for a virtual network
 *
 * @param {ModelStatic<Model>} networkModel - VirtualNetwork model
 * @param {boolean} [enabled=true] - Enable isolation
 * @returns {void}
 *
 * @example
 * ```typescript
 * configureNetworkIsolation(VirtualNetwork, true);
 * ```
 */
export declare const configureNetworkIsolation: (networkModel: ModelStatic<Model>, enabled?: boolean) => void;
/**
 * Configures VLAN tagging for a network
 *
 * @param {ModelStatic<Model>} networkModel - VirtualNetwork model
 * @param {number} vlanId - VLAN ID (1-4094)
 * @returns {void}
 *
 * @example
 * ```typescript
 * configureVLANTagging(VirtualNetwork, 100);
 * ```
 */
export declare const configureVLANTagging: (networkModel: ModelStatic<Model>, vlanId: number) => void;
/**
 * Configures DHCP settings for a network
 *
 * @param {ModelStatic<Model>} networkModel - VirtualNetwork model
 * @param {string} rangeStart - DHCP range start IP
 * @param {string} rangeEnd - DHCP range end IP
 * @param {number} [leaseTime=86400] - Lease time in seconds
 * @returns {void}
 *
 * @example
 * ```typescript
 * configureDHCPSettings(VirtualNetwork, '192.168.1.100', '192.168.1.200', 3600);
 * ```
 */
export declare const configureDHCPSettings: (networkModel: ModelStatic<Model>, rangeStart: string, rangeEnd: string, leaseTime?: number) => void;
/**
 * Configures DNS settings for a network
 *
 * @param {ModelStatic<Model>} networkModel - VirtualNetwork model
 * @param {string[]} dnsServers - Array of DNS server IPs
 * @param {string} [domain] - DNS domain
 * @returns {void}
 *
 * @example
 * ```typescript
 * configureDNSSettings(VirtualNetwork, ['8.8.8.8', '8.8.4.4'], 'example.com');
 * ```
 */
export declare const configureDNSSettings: (networkModel: ModelStatic<Model>, dnsServers: string[], domain?: string) => void;
/**
 * Configures firewall rules for a network
 *
 * @param {ModelStatic<Model>} aclModel - NetworkACL model
 * @param {ACLRule[]} rules - Array of ACL rules
 * @returns {void}
 *
 * @example
 * ```typescript
 * configureFirewallRules(NetworkACL, [
 *   { priority: 100, action: ACLAction.ALLOW, protocol: NetworkProtocol.TCP, destinationPort: 443 }
 * ]);
 * ```
 */
export declare const configureFirewallRules: (aclModel: ModelStatic<Model>, rules: ACLRule[]) => void;
/**
 * Configures QoS (Quality of Service) policies for a network
 *
 * @param {ModelStatic<Model>} networkModel - VirtualNetwork model
 * @param {Record<string, any>} qosPolicy - QoS policy configuration
 * @returns {void}
 *
 * @example
 * ```typescript
 * configureQoSPolicies(VirtualNetwork, {
 *   priorityQueues: 8,
 *   bandwidthLimits: { ingress: 1000000000, egress: 1000000000 }
 * });
 * ```
 */
export declare const configureQoSPolicies: (networkModel: ModelStatic<Model>, qosPolicy: Record<string, any>) => void;
/**
 * Configures load balancing for network nodes
 *
 * @param {ModelStatic<Model>} nodeModel - NetworkNode model
 * @param {string} algorithm - Load balancing algorithm (ROUND_ROBIN, LEAST_CONN, IP_HASH)
 * @param {Record<string, any>} [options={}] - Additional options
 * @returns {void}
 *
 * @example
 * ```typescript
 * configureLoadBalancing(NetworkNode, 'ROUND_ROBIN', { healthCheck: true });
 * ```
 */
export declare const configureLoadBalancing: (nodeModel: ModelStatic<Model>, algorithm: string, options?: Record<string, any>) => void;
/**
 * Configures network segmentation for enhanced security
 *
 * @param {ModelStatic<Model>} networkModel - VirtualNetwork model
 * @param {string[]} segments - Array of segment names
 * @returns {void}
 *
 * @example
 * ```typescript
 * configureNetworkSegmentation(VirtualNetwork, ['frontend', 'backend', 'database']);
 * ```
 */
export declare const configureNetworkSegmentation: (networkModel: ModelStatic<Model>, segments: string[]) => void;
/**
 * Adds network creation hook with audit logging
 *
 * @param {ModelStatic<Model>} networkModel - VirtualNetwork model
 * @param {Function} [callback] - Optional callback function
 * @returns {void}
 *
 * @example
 * ```typescript
 * addNetworkCreationHook(VirtualNetwork, async (network) => {
 *   console.log(`Network ${network.name} created`);
 * });
 * ```
 */
export declare const addNetworkCreationHook: (networkModel: ModelStatic<Model>, callback?: (instance: Model) => Promise<void> | void) => void;
/**
 * Adds network update hook with version increment
 *
 * @param {ModelStatic<Model>} networkModel - VirtualNetwork model
 * @param {Function} [callback] - Optional callback function
 * @returns {void}
 *
 * @example
 * ```typescript
 * addNetworkUpdateHook(VirtualNetwork);
 * ```
 */
export declare const addNetworkUpdateHook: (networkModel: ModelStatic<Model>, callback?: (instance: Model) => Promise<void> | void) => void;
/**
 * Adds network deletion hook with cascade cleanup
 *
 * @param {ModelStatic<Model>} networkModel - VirtualNetwork model
 * @param {Function} [callback] - Optional callback function
 * @returns {void}
 *
 * @example
 * ```typescript
 * addNetworkDeletionHook(VirtualNetwork, async (network) => {
 *   await cleanupNetworkResources(network.id);
 * });
 * ```
 */
export declare const addNetworkDeletionHook: (networkModel: ModelStatic<Model>, callback?: (instance: Model) => Promise<void> | void) => void;
/**
 * Adds ACL update hook to invalidate connection caches
 *
 * @param {ModelStatic<Model>} aclModel - NetworkACL model
 * @param {Function} [callback] - Optional callback function
 * @returns {void}
 *
 * @example
 * ```typescript
 * addACLUpdateHook(NetworkACL, async (acl) => {
 *   await invalidateConnectionCache(acl.networkId);
 * });
 * ```
 */
export declare const addACLUpdateHook: (aclModel: ModelStatic<Model>, callback?: (instance: Model) => Promise<void> | void) => void;
/**
 * Adds route change hook to propagate routing updates
 *
 * @param {ModelStatic<Model>} routeModel - NetworkRoute model
 * @param {Function} [callback] - Optional callback function
 * @returns {void}
 *
 * @example
 * ```typescript
 * addRouteChangeHook(NetworkRoute, async (route) => {
 *   await propagateRouteChanges(route);
 * });
 * ```
 */
export declare const addRouteChangeHook: (routeModel: ModelStatic<Model>, callback?: (instance: Model) => Promise<void> | void) => void;
/**
 * Adds interface status hook for monitoring
 *
 * @param {ModelStatic<Model>} interfaceModel - NetworkInterface model
 * @param {Function} [callback] - Optional callback function
 * @returns {void}
 *
 * @example
 * ```typescript
 * addInterfaceStatusHook(NetworkInterface, async (iface) => {
 *   if (iface.status === InterfaceStatus.DOWN) {
 *     await sendAlert(iface);
 *   }
 * });
 * ```
 */
export declare const addInterfaceStatusHook: (interfaceModel: ModelStatic<Model>, callback?: (instance: Model) => Promise<void> | void) => void;
/**
 * Adds node health check hook
 *
 * @param {ModelStatic<Model>} nodeModel - NetworkNode model
 * @param {Function} healthCheckFn - Health check function
 * @returns {void}
 *
 * @example
 * ```typescript
 * addNodeHealthCheckHook(NetworkNode, async (node) => {
 *   const isHealthy = await checkNodeHealth(node.ipAddress);
 *   return { healthy: isHealthy, timestamp: new Date() };
 * });
 * ```
 */
export declare const addNodeHealthCheckHook: (nodeModel: ModelStatic<Model>, healthCheckFn: (instance: Model) => Promise<Record<string, any>>) => void;
/**
 * Adds bandwidth monitoring hook
 *
 * @param {ModelStatic<Model>} linkModel - NetworkLink model
 * @param {Function} [callback] - Optional callback function
 * @returns {void}
 *
 * @example
 * ```typescript
 * addBandwidthMonitoringHook(NetworkLink, async (link) => {
 *   await recordBandwidthMetrics(link);
 * });
 * ```
 */
export declare const addBandwidthMonitoringHook: (linkModel: ModelStatic<Model>, callback?: (instance: Model) => Promise<void> | void) => void;
/**
 * Adds active network scope (non-deleted, enabled)
 *
 * @param {ModelStatic<Model>} networkModel - VirtualNetwork model
 * @returns {void}
 *
 * @example
 * ```typescript
 * addActiveNetworkScope(VirtualNetwork);
 * // Usage: VirtualNetwork.scope('active').findAll()
 * ```
 */
export declare const addActiveNetworkScope: (networkModel: ModelStatic<Model>) => void;
/**
 * Adds network type scope
 *
 * @param {ModelStatic<Model>} networkModel - VirtualNetwork model
 * @returns {void}
 *
 * @example
 * ```typescript
 * addNetworkTypeScope(VirtualNetwork);
 * // Usage: VirtualNetwork.scope({ method: ['byType', NetworkType.VLAN] }).findAll()
 * ```
 */
export declare const addNetworkTypeScope: (networkModel: ModelStatic<Model>) => void;
/**
 * Adds VLAN scope
 *
 * @param {ModelStatic<Model>} networkModel - VirtualNetwork model
 * @returns {void}
 *
 * @example
 * ```typescript
 * addVLANScope(VirtualNetwork);
 * // Usage: VirtualNetwork.scope({ method: ['byVLAN', 100] }).findAll()
 * ```
 */
export declare const addVLANScope: (networkModel: ModelStatic<Model>) => void;
/**
 * Adds node status scope
 *
 * @param {ModelStatic<Model>} nodeModel - NetworkNode model
 * @returns {void}
 *
 * @example
 * ```typescript
 * addNodeStatusScope(NetworkNode);
 * // Usage: NetworkNode.scope({ method: ['byStatus', NetworkNodeStatus.ACTIVE] }).findAll()
 * ```
 */
export declare const addNodeStatusScope: (nodeModel: ModelStatic<Model>) => void;
/**
 * Adds interface scope with eager loading
 *
 * @param {ModelStatic<Model>} nodeModel - NetworkNode model
 * @param {ModelStatic<Model>} interfaceModel - NetworkInterface model
 * @returns {void}
 *
 * @example
 * ```typescript
 * addInterfaceScope(NetworkNode, NetworkInterface);
 * // Usage: NetworkNode.scope('withInterfaces').findAll()
 * ```
 */
export declare const addInterfaceScope: (nodeModel: ModelStatic<Model>, interfaceModel: ModelStatic<Model>) => void;
/**
 * Adds security group scope for ACL filtering
 *
 * @param {ModelStatic<Model>} aclModel - NetworkACL model
 * @returns {void}
 *
 * @example
 * ```typescript
 * addSecurityGroupScope(NetworkACL);
 * // Usage: NetworkACL.scope({ method: ['bySecurityGroup', 'sg-123'] }).findAll()
 * ```
 */
export declare const addSecurityGroupScope: (aclModel: ModelStatic<Model>) => void;
/**
 * Calculates subnet information from CIDR notation
 *
 * @param {string} cidr - CIDR notation (e.g., "192.168.1.0/24")
 * @returns {SubnetInfo} Calculated subnet information
 *
 * @example
 * ```typescript
 * const info = calculateSubnetInfo('192.168.1.0/24');
 * // => { network: '192.168.1.0', broadcast: '192.168.1.255', ... }
 * ```
 */
export declare const calculateSubnetInfo: (cidr: string) => SubnetInfo;
/**
 * Validates network topology for loops and circular dependencies
 *
 * @param {ModelStatic<Model>} linkModel - NetworkLink model
 * @param {string} networkId - Network ID
 * @returns {Promise<{ valid: boolean; errors: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateNetworkTopology(NetworkLink, 'network-123');
 * if (!result.valid) {
 *   console.error('Topology errors:', result.errors);
 * }
 * ```
 */
export declare const validateNetworkTopology: (linkModel: ModelStatic<Model>, networkId: string) => Promise<{
    valid: boolean;
    errors: string[];
}>;
/**
 * Detects network loops in the topology
 *
 * @param {ModelStatic<Model>} linkModel - NetworkLink model
 * @param {string} startNodeId - Starting node ID
 * @returns {Promise<string[]>} Array of node IDs forming a loop (empty if no loop)
 *
 * @example
 * ```typescript
 * const loop = await detectNetworkLoops(NetworkLink, 'node-123');
 * if (loop.length > 0) {
 *   console.log('Loop detected:', loop);
 * }
 * ```
 */
export declare const detectNetworkLoops: (linkModel: ModelStatic<Model>, startNodeId: string) => Promise<string[]>;
/**
 * Optimizes routing table by removing redundant routes
 *
 * @param {ModelStatic<Model>} routeModel - NetworkRoute model
 * @param {string} routeTableId - Route table ID
 * @returns {Promise<number>} Number of routes removed
 *
 * @example
 * ```typescript
 * const removed = await optimizeRoutingTable(NetworkRoute, 'rt-123');
 * console.log(`Removed ${removed} redundant routes`);
 * ```
 */
export declare const optimizeRoutingTable: (routeModel: ModelStatic<Model>, routeTableId: string) => Promise<number>;
/**
 * Generates network diagram data in JSON format
 *
 * @param {ModelStatic<Model>} networkModel - VirtualNetwork model
 * @param {ModelStatic<Model>} nodeModel - NetworkNode model
 * @param {ModelStatic<Model>} linkModel - NetworkLink model
 * @param {string} networkId - Network ID
 * @returns {Promise<Record<string, any>>} Network diagram data
 *
 * @example
 * ```typescript
 * const diagram = await generateNetworkDiagram(VirtualNetwork, NetworkNode, NetworkLink, 'net-123');
 * // => { nodes: [...], links: [...], metadata: {...} }
 * ```
 */
export declare const generateNetworkDiagram: (networkModel: ModelStatic<Model>, nodeModel: ModelStatic<Model>, linkModel: ModelStatic<Model>, networkId: string) => Promise<Record<string, any>>;
//# sourceMappingURL=network-models-kit.d.ts.map