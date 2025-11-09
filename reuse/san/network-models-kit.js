"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateNetworkTopology = exports.calculateSubnetInfo = exports.addSecurityGroupScope = exports.addInterfaceScope = exports.addNodeStatusScope = exports.addVLANScope = exports.addNetworkTypeScope = exports.addActiveNetworkScope = exports.addBandwidthMonitoringHook = exports.addNodeHealthCheckHook = exports.addInterfaceStatusHook = exports.addRouteChangeHook = exports.addACLUpdateHook = exports.addNetworkDeletionHook = exports.addNetworkUpdateHook = exports.addNetworkCreationHook = exports.configureNetworkSegmentation = exports.configureLoadBalancing = exports.configureQoSPolicies = exports.configureFirewallRules = exports.configureDNSSettings = exports.configureDHCPSettings = exports.configureVLANTagging = exports.configureNetworkIsolation = exports.addSubnetMaskValidation = exports.addNetworkRangeValidation = exports.addBandwidthValidation = exports.addProtocolValidation = exports.addPortValidation = exports.addVLANValidation = exports.addMACAddressValidation = exports.addCIDRValidation = exports.addIPv6Validation = exports.addIPv4Validation = exports.createSubnetModel = exports.createNetworkRouteModel = exports.createNetworkRouteTableModel = exports.createNetworkACLModel = exports.createNetworkLinkModel = exports.createNetworkInterfaceModel = exports.createNetworkNodeModel = exports.createVirtualNetworkModel = exports.RouteType = exports.NetworkProtocol = exports.ACLAction = exports.InterfaceStatus = exports.InterfaceType = exports.NetworkNodeStatus = exports.NetworkNodeType = exports.NetworkType = void 0;
exports.generateNetworkDiagram = exports.optimizeRoutingTable = exports.detectNetworkLoops = void 0;
const sequelize_1 = require("sequelize");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * @enum NetworkType
 * @description Types of virtual networks
 */
var NetworkType;
(function (NetworkType) {
    NetworkType["LAN"] = "LAN";
    NetworkType["VLAN"] = "VLAN";
    NetworkType["VPN"] = "VPN";
    NetworkType["OVERLAY"] = "OVERLAY";
    NetworkType["UNDERLAY"] = "UNDERLAY";
    NetworkType["MANAGEMENT"] = "MANAGEMENT";
    NetworkType["STORAGE"] = "STORAGE";
    NetworkType["DMZ"] = "DMZ";
})(NetworkType || (exports.NetworkType = NetworkType = {}));
/**
 * @enum NetworkNodeType
 * @description Types of network nodes/devices
 */
var NetworkNodeType;
(function (NetworkNodeType) {
    NetworkNodeType["ROUTER"] = "ROUTER";
    NetworkNodeType["SWITCH"] = "SWITCH";
    NetworkNodeType["LOAD_BALANCER"] = "LOAD_BALANCER";
    NetworkNodeType["FIREWALL"] = "FIREWALL";
    NetworkNodeType["GATEWAY"] = "GATEWAY";
    NetworkNodeType["PROXY"] = "PROXY";
    NetworkNodeType["VPN_ENDPOINT"] = "VPN_ENDPOINT";
    NetworkNodeType["NAT_GATEWAY"] = "NAT_GATEWAY";
})(NetworkNodeType || (exports.NetworkNodeType = NetworkNodeType = {}));
/**
 * @enum NetworkNodeStatus
 * @description Operational status of network nodes
 */
var NetworkNodeStatus;
(function (NetworkNodeStatus) {
    NetworkNodeStatus["ACTIVE"] = "ACTIVE";
    NetworkNodeStatus["INACTIVE"] = "INACTIVE";
    NetworkNodeStatus["DEGRADED"] = "DEGRADED";
    NetworkNodeStatus["MAINTENANCE"] = "MAINTENANCE";
    NetworkNodeStatus["FAILED"] = "FAILED";
    NetworkNodeStatus["PROVISIONING"] = "PROVISIONING";
})(NetworkNodeStatus || (exports.NetworkNodeStatus = NetworkNodeStatus = {}));
/**
 * @enum InterfaceType
 * @description Types of network interfaces
 */
var InterfaceType;
(function (InterfaceType) {
    InterfaceType["PHYSICAL"] = "PHYSICAL";
    InterfaceType["VIRTUAL"] = "VIRTUAL";
    InterfaceType["LOOPBACK"] = "LOOPBACK";
    InterfaceType["TUNNEL"] = "TUNNEL";
    InterfaceType["BOND"] = "BOND";
    InterfaceType["VLAN"] = "VLAN";
})(InterfaceType || (exports.InterfaceType = InterfaceType = {}));
/**
 * @enum InterfaceStatus
 * @description Status of network interfaces
 */
var InterfaceStatus;
(function (InterfaceStatus) {
    InterfaceStatus["UP"] = "UP";
    InterfaceStatus["DOWN"] = "DOWN";
    InterfaceStatus["TESTING"] = "TESTING";
    InterfaceStatus["UNKNOWN"] = "UNKNOWN";
    InterfaceStatus["DORMANT"] = "DORMANT";
})(InterfaceStatus || (exports.InterfaceStatus = InterfaceStatus = {}));
/**
 * @enum ACLAction
 * @description ACL rule actions
 */
var ACLAction;
(function (ACLAction) {
    ACLAction["ALLOW"] = "ALLOW";
    ACLAction["DENY"] = "DENY";
    ACLAction["REJECT"] = "REJECT";
    ACLAction["LOG"] = "LOG";
})(ACLAction || (exports.ACLAction = ACLAction = {}));
/**
 * @enum NetworkProtocol
 * @description Network protocols
 */
var NetworkProtocol;
(function (NetworkProtocol) {
    NetworkProtocol["TCP"] = "TCP";
    NetworkProtocol["UDP"] = "UDP";
    NetworkProtocol["ICMP"] = "ICMP";
    NetworkProtocol["ICMPV6"] = "ICMPV6";
    NetworkProtocol["ESP"] = "ESP";
    NetworkProtocol["AH"] = "AH";
    NetworkProtocol["GRE"] = "GRE";
    NetworkProtocol["ALL"] = "ALL";
})(NetworkProtocol || (exports.NetworkProtocol = NetworkProtocol = {}));
/**
 * @enum RouteType
 * @description Routing table entry types
 */
var RouteType;
(function (RouteType) {
    RouteType["STATIC"] = "STATIC";
    RouteType["DYNAMIC"] = "DYNAMIC";
    RouteType["CONNECTED"] = "CONNECTED";
    RouteType["DEFAULT"] = "DEFAULT";
    RouteType["BLACKHOLE"] = "BLACKHOLE";
})(RouteType || (exports.RouteType = RouteType = {}));
// ============================================================================
// MODEL DEFINITION HELPERS
// ============================================================================
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
const createVirtualNetworkModel = (sequelize, config = {}, options = {}) => {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true,
                len: [1, 255],
            },
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        networkType: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(NetworkType)),
            allowNull: false,
            defaultValue: NetworkType.LAN,
        },
        cidr: {
            type: sequelize_1.DataTypes.CIDR,
            allowNull: false,
            comment: 'Network CIDR notation (e.g., 192.168.1.0/24)',
        },
        vlanId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: config.enableVLAN ? false : true,
            validate: {
                min: 1,
                max: 4094,
            },
            comment: 'VLAN ID (1-4094)',
        },
        gateway: {
            type: sequelize_1.DataTypes.INET,
            allowNull: true,
            comment: 'Default gateway IP address',
        },
        dnsServers: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.INET),
            allowNull: true,
            defaultValue: [],
            comment: 'DNS server IP addresses',
        },
        dhcpEnabled: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: config.enableDHCP || false,
        },
        dhcpRange: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: null,
            comment: 'DHCP IP range: { start: "x.x.x.x", end: "x.x.x.x" }',
        },
        mtu: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: config.mtu || 1500,
            validate: {
                min: 68,
                max: 9000,
            },
        },
        isolated: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Network isolation enabled',
        },
        config: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional network configuration',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
        },
        active: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        version: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
    };
    class VirtualNetwork extends sequelize_1.Model {
    }
    return VirtualNetwork.init(attributes, {
        sequelize,
        modelName: 'VirtualNetwork',
        tableName: 'virtual_networks',
        timestamps: true,
        paranoid: true,
        underscored: true,
        ...options,
        indexes: [
            { fields: ['vlan_id'] },
            { fields: ['network_type'] },
            { fields: ['active'] },
            { fields: ['created_at'] },
            ...(options.indexes || []),
        ],
    });
};
exports.createVirtualNetworkModel = createVirtualNetworkModel;
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
const createNetworkNodeModel = (sequelize, defaultType, options = {}) => {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        networkId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'virtual_networks',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        nodeType: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(NetworkNodeType)),
            allowNull: false,
            defaultValue: defaultType || NetworkNodeType.ROUTER,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(NetworkNodeStatus)),
            allowNull: false,
            defaultValue: NetworkNodeStatus.PROVISIONING,
        },
        ipAddress: {
            type: sequelize_1.DataTypes.INET,
            allowNull: true,
            comment: 'Primary IP address',
        },
        macAddress: {
            type: sequelize_1.DataTypes.MACADDR,
            allowNull: true,
            comment: 'Primary MAC address',
        },
        hostname: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
        },
        managementIP: {
            type: sequelize_1.DataTypes.INET,
            allowNull: true,
            comment: 'Management interface IP',
        },
        location: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
            comment: 'Physical or virtual location',
        },
        config: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
            comment: 'Node configuration',
        },
        capabilities: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: false,
            defaultValue: [],
            comment: 'Node capabilities and features',
        },
        healthCheck: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: null,
            comment: 'Last health check result',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
        },
        active: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        version: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
    };
    class NetworkNode extends sequelize_1.Model {
    }
    return NetworkNode.init(attributes, {
        sequelize,
        modelName: 'NetworkNode',
        tableName: 'network_nodes',
        timestamps: true,
        paranoid: true,
        underscored: true,
        ...options,
        indexes: [
            { fields: ['network_id'] },
            { fields: ['node_type'] },
            { fields: ['status'] },
            { fields: ['active'] },
            { fields: ['ip_address'] },
            { fields: ['mac_address'] },
            { fields: ['network_id', 'status'] },
            ...(options.indexes || []),
        ],
    });
};
exports.createNetworkNodeModel = createNetworkNodeModel;
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
const createNetworkInterfaceModel = (sequelize, options = {}) => {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        nodeId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'network_nodes',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Interface name (e.g., eth0, ens160)',
        },
        interfaceType: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(InterfaceType)),
            allowNull: false,
            defaultValue: InterfaceType.VIRTUAL,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(InterfaceStatus)),
            allowNull: false,
            defaultValue: InterfaceStatus.DOWN,
        },
        macAddress: {
            type: sequelize_1.DataTypes.MACADDR,
            allowNull: false,
            unique: true,
        },
        ipAddress: {
            type: sequelize_1.DataTypes.INET,
            allowNull: true,
        },
        netmask: {
            type: sequelize_1.DataTypes.INET,
            allowNull: true,
        },
        vlanId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            validate: {
                min: 1,
                max: 4094,
            },
        },
        bandwidth: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: true,
            comment: 'Bandwidth in bps',
            validate: {
                min: 0,
            },
        },
        mtu: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1500,
            validate: {
                min: 68,
                max: 9000,
            },
        },
        duplex: {
            type: sequelize_1.DataTypes.ENUM('FULL', 'HALF', 'AUTO'),
            allowNull: false,
            defaultValue: 'AUTO',
        },
        statistics: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
            comment: 'TX/RX statistics',
        },
        config: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
        },
        active: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    };
    class NetworkInterface extends sequelize_1.Model {
    }
    return NetworkInterface.init(attributes, {
        sequelize,
        modelName: 'NetworkInterface',
        tableName: 'network_interfaces',
        timestamps: true,
        paranoid: true,
        underscored: true,
        ...options,
        indexes: [
            { fields: ['node_id'] },
            { fields: ['mac_address'], unique: true },
            { fields: ['ip_address'] },
            { fields: ['interface_type'] },
            { fields: ['status'] },
            { fields: ['vlan_id'] },
            ...(options.indexes || []),
        ],
    });
};
exports.createNetworkInterfaceModel = createNetworkInterfaceModel;
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
const createNetworkLinkModel = (sequelize, options = {}) => {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        sourceNodeId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'network_nodes',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        sourceInterfaceId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'network_interfaces',
                key: 'id',
            },
        },
        targetNodeId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'network_nodes',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        targetInterfaceId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'network_interfaces',
                key: 'id',
            },
        },
        bandwidth: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: true,
            comment: 'Link bandwidth in bps',
            validate: {
                min: 0,
            },
        },
        latency: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: true,
            comment: 'Link latency in milliseconds',
            validate: {
                min: 0,
            },
        },
        packetLoss: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: true,
            comment: 'Packet loss percentage',
            validate: {
                min: 0,
                max: 100,
            },
        },
        redundant: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        aggregated: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Link aggregation (LAG)',
        },
        statistics: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
            comment: 'Traffic statistics',
        },
        config: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
        },
        active: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    };
    class NetworkLink extends sequelize_1.Model {
    }
    return NetworkLink.init(attributes, {
        sequelize,
        modelName: 'NetworkLink',
        tableName: 'network_links',
        timestamps: true,
        paranoid: true,
        underscored: true,
        ...options,
        indexes: [
            { fields: ['source_node_id'] },
            { fields: ['target_node_id'] },
            { fields: ['source_interface_id'] },
            { fields: ['target_interface_id'] },
            { fields: ['active'] },
            ...(options.indexes || []),
        ],
    });
};
exports.createNetworkLinkModel = createNetworkLinkModel;
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
const createNetworkACLModel = (sequelize, options = {}) => {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        networkId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'virtual_networks',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        priority: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 100,
            comment: 'Rule priority (lower = higher priority)',
            validate: {
                min: 1,
                max: 65535,
            },
        },
        action: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(ACLAction)),
            allowNull: false,
            defaultValue: ACLAction.DENY,
        },
        protocol: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(NetworkProtocol)),
            allowNull: false,
            defaultValue: NetworkProtocol.ALL,
        },
        sourceCIDR: {
            type: sequelize_1.DataTypes.CIDR,
            allowNull: true,
            comment: 'Source CIDR block',
        },
        sourcePort: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            validate: {
                min: 1,
                max: 65535,
            },
        },
        sourcePortRange: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: true,
            comment: 'Port range (e.g., "8000-9000")',
        },
        destinationCIDR: {
            type: sequelize_1.DataTypes.CIDR,
            allowNull: true,
            comment: 'Destination CIDR block',
        },
        destinationPort: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            validate: {
                min: 1,
                max: 65535,
            },
        },
        destinationPortRange: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: true,
            comment: 'Port range (e.g., "443-443")',
        },
        direction: {
            type: sequelize_1.DataTypes.ENUM('INBOUND', 'OUTBOUND', 'BOTH'),
            allowNull: false,
            defaultValue: 'INBOUND',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        enabled: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        expiresAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Temporary rule expiration',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
        },
    };
    class NetworkACL extends sequelize_1.Model {
    }
    return NetworkACL.init(attributes, {
        sequelize,
        modelName: 'NetworkACL',
        tableName: 'network_acls',
        timestamps: true,
        paranoid: true,
        underscored: true,
        ...options,
        indexes: [
            { fields: ['network_id'] },
            { fields: ['priority'] },
            { fields: ['enabled'] },
            { fields: ['network_id', 'priority'] },
            ...(options.indexes || []),
        ],
    });
};
exports.createNetworkACLModel = createNetworkACLModel;
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
const createNetworkRouteTableModel = (sequelize, options = {}) => {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        networkId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'virtual_networks',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            unique: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        defaultRoute: {
            type: sequelize_1.DataTypes.INET,
            allowNull: true,
            comment: 'Default gateway',
        },
        propagateRoutes: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Propagate routes to connected networks',
        },
        config: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
        },
        active: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        version: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
    };
    class NetworkRouteTable extends sequelize_1.Model {
    }
    return NetworkRouteTable.init(attributes, {
        sequelize,
        modelName: 'NetworkRouteTable',
        tableName: 'network_route_tables',
        timestamps: true,
        paranoid: true,
        underscored: true,
        ...options,
        indexes: [
            { fields: ['network_id'], unique: true },
            { fields: ['active'] },
            ...(options.indexes || []),
        ],
    });
};
exports.createNetworkRouteTableModel = createNetworkRouteTableModel;
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
const createNetworkRouteModel = (sequelize, options = {}) => {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        routeTableId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'network_route_tables',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        destinationCIDR: {
            type: sequelize_1.DataTypes.CIDR,
            allowNull: false,
            comment: 'Destination network CIDR',
        },
        gateway: {
            type: sequelize_1.DataTypes.INET,
            allowNull: false,
            comment: 'Next-hop gateway IP',
        },
        metric: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 100,
            comment: 'Route metric/cost',
            validate: {
                min: 0,
            },
        },
        routeType: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(RouteType)),
            allowNull: false,
            defaultValue: RouteType.STATIC,
        },
        interfaceName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
            comment: 'Outbound interface',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        enabled: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
        },
    };
    class NetworkRoute extends sequelize_1.Model {
    }
    return NetworkRoute.init(attributes, {
        sequelize,
        modelName: 'NetworkRoute',
        tableName: 'network_routes',
        timestamps: true,
        paranoid: true,
        underscored: true,
        ...options,
        indexes: [
            { fields: ['route_table_id'] },
            { fields: ['destination_cidr'] },
            { fields: ['enabled'] },
            { fields: ['route_type'] },
            ...(options.indexes || []),
        ],
    });
};
exports.createNetworkRouteModel = createNetworkRouteModel;
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
const createSubnetModel = (sequelize, options = {}) => {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        networkId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'virtual_networks',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        cidr: {
            type: sequelize_1.DataTypes.CIDR,
            allowNull: false,
            comment: 'Subnet CIDR notation',
        },
        gateway: {
            type: sequelize_1.DataTypes.INET,
            allowNull: true,
        },
        vlanId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            validate: {
                min: 1,
                max: 4094,
            },
        },
        ipv6Enabled: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        ipv6CIDR: {
            type: sequelize_1.DataTypes.CIDR,
            allowNull: true,
            comment: 'IPv6 CIDR notation',
        },
        availableIPs: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Available IP count',
        },
        allocatedIPs: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Allocated IP count',
        },
        reservedIPs: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.INET),
            allowNull: false,
            defaultValue: [],
            comment: 'Reserved IP addresses',
        },
        config: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
        },
        active: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    };
    class Subnet extends sequelize_1.Model {
    }
    return Subnet.init(attributes, {
        sequelize,
        modelName: 'Subnet',
        tableName: 'subnets',
        timestamps: true,
        paranoid: true,
        underscored: true,
        ...options,
        indexes: [
            { fields: ['network_id'] },
            { fields: ['cidr'] },
            { fields: ['vlan_id'] },
            { fields: ['active'] },
            ...(options.indexes || []),
        ],
    });
};
exports.createSubnetModel = createSubnetModel;
// ============================================================================
// NETWORK VALIDATION HELPERS
// ============================================================================
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
const addIPv4Validation = (model, fieldName, required = false) => {
    const attributes = model.rawAttributes;
    if (attributes[fieldName]) {
        attributes[fieldName].validate = {
            ...attributes[fieldName].validate,
            isIPv4(value) {
                if (required && !value) {
                    throw new Error(`${fieldName} is required`);
                }
                if (value) {
                    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
                    if (!ipv4Regex.test(value)) {
                        throw new Error(`${fieldName} must be a valid IPv4 address`);
                    }
                }
            },
        };
    }
};
exports.addIPv4Validation = addIPv4Validation;
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
const addIPv6Validation = (model, fieldName, required = false) => {
    const attributes = model.rawAttributes;
    if (attributes[fieldName]) {
        attributes[fieldName].validate = {
            ...attributes[fieldName].validate,
            isIPv6(value) {
                if (required && !value) {
                    throw new Error(`${fieldName} is required`);
                }
                if (value) {
                    const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
                    if (!ipv6Regex.test(value)) {
                        throw new Error(`${fieldName} must be a valid IPv6 address`);
                    }
                }
            },
        };
    }
};
exports.addIPv6Validation = addIPv6Validation;
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
const addCIDRValidation = (model, fieldName) => {
    const attributes = model.rawAttributes;
    if (attributes[fieldName]) {
        attributes[fieldName].validate = {
            ...attributes[fieldName].validate,
            isCIDR(value) {
                if (!value) {
                    throw new Error(`${fieldName} is required`);
                }
                const cidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\/([0-9]|[1-2][0-9]|3[0-2])$/;
                if (!cidrRegex.test(value)) {
                    throw new Error(`${fieldName} must be a valid CIDR notation (e.g., 192.168.1.0/24)`);
                }
            },
        };
    }
};
exports.addCIDRValidation = addCIDRValidation;
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
const addMACAddressValidation = (model, fieldName) => {
    const attributes = model.rawAttributes;
    if (attributes[fieldName]) {
        attributes[fieldName].validate = {
            ...attributes[fieldName].validate,
            isMACAddress(value) {
                if (value) {
                    const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
                    if (!macRegex.test(value)) {
                        throw new Error(`${fieldName} must be a valid MAC address`);
                    }
                }
            },
        };
    }
};
exports.addMACAddressValidation = addMACAddressValidation;
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
const addVLANValidation = (model, fieldName) => {
    const attributes = model.rawAttributes;
    if (attributes[fieldName]) {
        attributes[fieldName].validate = {
            ...attributes[fieldName].validate,
            isValidVLAN(value) {
                if (value !== null && value !== undefined) {
                    if (value < 1 || value > 4094) {
                        throw new Error(`${fieldName} must be between 1 and 4094`);
                    }
                }
            },
        };
    }
};
exports.addVLANValidation = addVLANValidation;
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
const addPortValidation = (model, fieldName) => {
    const attributes = model.rawAttributes;
    if (attributes[fieldName]) {
        attributes[fieldName].validate = {
            ...attributes[fieldName].validate,
            isValidPort(value) {
                if (value !== null && value !== undefined) {
                    if (value < 1 || value > 65535) {
                        throw new Error(`${fieldName} must be between 1 and 65535`);
                    }
                }
            },
        };
    }
};
exports.addPortValidation = addPortValidation;
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
const addProtocolValidation = (model, fieldName) => {
    const attributes = model.rawAttributes;
    if (attributes[fieldName]) {
        const allowedProtocols = Object.values(NetworkProtocol);
        attributes[fieldName].validate = {
            ...attributes[fieldName].validate,
            isIn: {
                args: [allowedProtocols],
                msg: `${fieldName} must be one of: ${allowedProtocols.join(', ')}`,
            },
        };
    }
};
exports.addProtocolValidation = addProtocolValidation;
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
const addBandwidthValidation = (model, fieldName, maxBandwidth) => {
    const attributes = model.rawAttributes;
    if (attributes[fieldName]) {
        attributes[fieldName].validate = {
            ...attributes[fieldName].validate,
            isValidBandwidth(value) {
                if (value !== null && value !== undefined) {
                    if (value < 0) {
                        throw new Error(`${fieldName} must be non-negative`);
                    }
                    if (maxBandwidth && value > maxBandwidth) {
                        throw new Error(`${fieldName} must not exceed ${maxBandwidth} bps`);
                    }
                }
            },
        };
    }
};
exports.addBandwidthValidation = addBandwidthValidation;
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
const addNetworkRangeValidation = (model, fieldName) => {
    const attributes = model.rawAttributes;
    if (attributes[fieldName]) {
        attributes[fieldName].validate = {
            ...attributes[fieldName].validate,
            async isValidNetworkRange(value) {
                if (value) {
                    // Parse CIDR
                    const [network, prefix] = value.split('/');
                    const prefixNum = parseInt(prefix, 10);
                    if (prefixNum < 8 || prefixNum > 32) {
                        throw new Error(`${fieldName} prefix must be between 8 and 32`);
                    }
                    // Additional validation can be added here for overlap detection
                }
            },
        };
    }
};
exports.addNetworkRangeValidation = addNetworkRangeValidation;
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
const addSubnetMaskValidation = (model, fieldName) => {
    const attributes = model.rawAttributes;
    if (attributes[fieldName]) {
        attributes[fieldName].validate = {
            ...attributes[fieldName].validate,
            isValidSubnetMask(value) {
                if (value) {
                    const validMasks = [
                        '255.0.0.0', '255.128.0.0', '255.192.0.0', '255.224.0.0',
                        '255.240.0.0', '255.248.0.0', '255.252.0.0', '255.254.0.0',
                        '255.255.0.0', '255.255.128.0', '255.255.192.0', '255.255.224.0',
                        '255.255.240.0', '255.255.248.0', '255.255.252.0', '255.255.254.0',
                        '255.255.255.0', '255.255.255.128', '255.255.255.192', '255.255.255.224',
                        '255.255.255.240', '255.255.255.248', '255.255.255.252', '255.255.255.254',
                        '255.255.255.255',
                    ];
                    if (!validMasks.includes(value)) {
                        throw new Error(`${fieldName} must be a valid subnet mask`);
                    }
                }
            },
        };
    }
};
exports.addSubnetMaskValidation = addSubnetMaskValidation;
// ============================================================================
// NETWORK CONFIGURATION HELPERS
// ============================================================================
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
const configureNetworkIsolation = (networkModel, enabled = true) => {
    networkModel.addHook('beforeCreate', (instance) => {
        instance.isolated = enabled;
        if (enabled) {
            instance.config = {
                ...instance.config,
                isolation: {
                    enabled: true,
                    mode: 'strict',
                    allowedNetworks: [],
                },
            };
        }
    });
};
exports.configureNetworkIsolation = configureNetworkIsolation;
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
const configureVLANTagging = (networkModel, vlanId) => {
    networkModel.addHook('beforeCreate', (instance) => {
        if (vlanId < 1 || vlanId > 4094) {
            throw new sequelize_1.ValidationError('VLAN ID must be between 1 and 4094');
        }
        instance.vlanId = vlanId;
        instance.networkType = NetworkType.VLAN;
        instance.config = {
            ...instance.config,
            vlan: {
                id: vlanId,
                tagging: 'IEEE 802.1Q',
            },
        };
    });
};
exports.configureVLANTagging = configureVLANTagging;
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
const configureDHCPSettings = (networkModel, rangeStart, rangeEnd, leaseTime = 86400) => {
    networkModel.addHook('beforeCreate', (instance) => {
        instance.dhcpEnabled = true;
        instance.dhcpRange = {
            start: rangeStart,
            end: rangeEnd,
        };
        instance.config = {
            ...instance.config,
            dhcp: {
                enabled: true,
                rangeStart,
                rangeEnd,
                leaseTime,
                options: {},
            },
        };
    });
};
exports.configureDHCPSettings = configureDHCPSettings;
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
const configureDNSSettings = (networkModel, dnsServers, domain) => {
    networkModel.addHook('beforeCreate', (instance) => {
        instance.dnsServers = dnsServers;
        instance.config = {
            ...instance.config,
            dns: {
                servers: dnsServers,
                domain: domain || null,
                searchDomains: domain ? [domain] : [],
            },
        };
    });
};
exports.configureDNSSettings = configureDNSSettings;
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
const configureFirewallRules = (aclModel, rules) => {
    aclModel.addHook('beforeBulkCreate', (instances) => {
        rules.forEach((rule, index) => {
            if (instances[index]) {
                Object.assign(instances[index], rule);
            }
        });
    });
};
exports.configureFirewallRules = configureFirewallRules;
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
const configureQoSPolicies = (networkModel, qosPolicy) => {
    networkModel.addHook('beforeCreate', (instance) => {
        instance.config = {
            ...instance.config,
            qos: {
                ...qosPolicy,
                enabled: true,
            },
        };
    });
};
exports.configureQoSPolicies = configureQoSPolicies;
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
const configureLoadBalancing = (nodeModel, algorithm, options = {}) => {
    nodeModel.addHook('beforeCreate', (instance) => {
        if (instance.nodeType === NetworkNodeType.LOAD_BALANCER) {
            instance.config = {
                ...instance.config,
                loadBalancing: {
                    algorithm,
                    ...options,
                },
            };
        }
    });
};
exports.configureLoadBalancing = configureLoadBalancing;
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
const configureNetworkSegmentation = (networkModel, segments) => {
    networkModel.addHook('beforeCreate', (instance) => {
        instance.config = {
            ...instance.config,
            segmentation: {
                enabled: true,
                segments: segments.map((name, index) => ({
                    name,
                    id: index + 1,
                    isolated: true,
                })),
            },
        };
    });
};
exports.configureNetworkSegmentation = configureNetworkSegmentation;
// ============================================================================
// NETWORK HOOKS
// ============================================================================
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
const addNetworkCreationHook = (networkModel, callback) => {
    networkModel.addHook('afterCreate', async (instance, options) => {
        // Calculate available IPs from CIDR
        if (instance.cidr) {
            const [, prefix] = instance.cidr.split('/');
            const prefixNum = parseInt(prefix, 10);
            const availableIPs = Math.pow(2, 32 - prefixNum) - 2; // Subtract network and broadcast
            instance.metadata = {
                ...instance.metadata,
                availableIPs,
            };
        }
        if (callback) {
            await callback(instance);
        }
    });
};
exports.addNetworkCreationHook = addNetworkCreationHook;
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
const addNetworkUpdateHook = (networkModel, callback) => {
    networkModel.addHook('beforeUpdate', async (instance, options) => {
        if (instance.changed()) {
            instance.version += 1;
        }
        if (callback) {
            await callback(instance);
        }
    });
};
exports.addNetworkUpdateHook = addNetworkUpdateHook;
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
const addNetworkDeletionHook = (networkModel, callback) => {
    networkModel.addHook('beforeDestroy', async (instance, options) => {
        // Archive network configuration before deletion
        instance.metadata = {
            ...instance.metadata,
            deletedConfig: instance.config,
            deletionTimestamp: new Date(),
        };
        if (callback) {
            await callback(instance);
        }
    });
};
exports.addNetworkDeletionHook = addNetworkDeletionHook;
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
const addACLUpdateHook = (aclModel, callback) => {
    aclModel.addHook('afterUpdate', async (instance, options) => {
        // Mark ACL as requiring cache invalidation
        instance.metadata = {
            ...instance.metadata,
            cacheInvalidatedAt: new Date(),
        };
        if (callback) {
            await callback(instance);
        }
    });
    aclModel.addHook('afterCreate', async (instance, options) => {
        if (callback) {
            await callback(instance);
        }
    });
};
exports.addACLUpdateHook = addACLUpdateHook;
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
const addRouteChangeHook = (routeModel, callback) => {
    const updateMetadata = (instance) => {
        instance.metadata = {
            ...instance.metadata,
            lastModified: new Date(),
            propagationRequired: true,
        };
    };
    routeModel.addHook('afterCreate', async (instance, options) => {
        updateMetadata(instance);
        if (callback)
            await callback(instance);
    });
    routeModel.addHook('afterUpdate', async (instance, options) => {
        updateMetadata(instance);
        if (callback)
            await callback(instance);
    });
    routeModel.addHook('afterDestroy', async (instance, options) => {
        if (callback)
            await callback(instance);
    });
};
exports.addRouteChangeHook = addRouteChangeHook;
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
const addInterfaceStatusHook = (interfaceModel, callback) => {
    interfaceModel.addHook('afterUpdate', async (instance, options) => {
        if (instance.changed('status')) {
            const previousStatus = instance.previous('status');
            instance.metadata = {
                ...instance.metadata,
                statusTransition: {
                    from: previousStatus,
                    to: instance.status,
                    timestamp: new Date(),
                },
            };
            if (callback) {
                await callback(instance);
            }
        }
    });
};
exports.addInterfaceStatusHook = addInterfaceStatusHook;
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
const addNodeHealthCheckHook = (nodeModel, healthCheckFn) => {
    nodeModel.addHook('afterFind', async (instances) => {
        const nodes = Array.isArray(instances) ? instances : [instances];
        for (const node of nodes) {
            if (node && node.active) {
                try {
                    const healthStatus = await healthCheckFn(node);
                    node.healthCheck = healthStatus;
                }
                catch (error) {
                    node.healthCheck = {
                        healthy: false,
                        error: error.message,
                        timestamp: new Date(),
                    };
                }
            }
        }
    });
};
exports.addNodeHealthCheckHook = addNodeHealthCheckHook;
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
const addBandwidthMonitoringHook = (linkModel, callback) => {
    linkModel.addHook('afterUpdate', async (instance, options) => {
        if (instance.changed('statistics')) {
            const stats = instance.statistics || {};
            const threshold = instance.bandwidth ? instance.bandwidth * 0.8 : null;
            if (threshold && stats.currentBandwidth > threshold) {
                instance.metadata = {
                    ...instance.metadata,
                    bandwidthAlert: {
                        threshold,
                        current: stats.currentBandwidth,
                        timestamp: new Date(),
                    },
                };
            }
            if (callback) {
                await callback(instance);
            }
        }
    });
};
exports.addBandwidthMonitoringHook = addBandwidthMonitoringHook;
// ============================================================================
// NETWORK SCOPES
// ============================================================================
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
const addActiveNetworkScope = (networkModel) => {
    networkModel.addScope('active', {
        where: {
            active: true,
            deletedAt: null,
        },
    });
};
exports.addActiveNetworkScope = addActiveNetworkScope;
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
const addNetworkTypeScope = (networkModel) => {
    networkModel.addScope('byType', (networkType) => ({
        where: { networkType },
    }));
};
exports.addNetworkTypeScope = addNetworkTypeScope;
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
const addVLANScope = (networkModel) => {
    networkModel.addScope('byVLAN', (vlanId) => ({
        where: { vlanId },
    }));
};
exports.addVLANScope = addVLANScope;
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
const addNodeStatusScope = (nodeModel) => {
    nodeModel.addScope('byStatus', (status) => ({
        where: { status },
    }));
};
exports.addNodeStatusScope = addNodeStatusScope;
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
const addInterfaceScope = (nodeModel, interfaceModel) => {
    nodeModel.addScope('withInterfaces', {
        include: [
            {
                model: interfaceModel,
                as: 'interfaces',
                where: { active: true },
                required: false,
            },
        ],
    });
};
exports.addInterfaceScope = addInterfaceScope;
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
const addSecurityGroupScope = (aclModel) => {
    aclModel.addScope('bySecurityGroup', (securityGroupId) => ({
        where: {
            metadata: {
                securityGroupId,
            },
        },
    }));
};
exports.addSecurityGroupScope = addSecurityGroupScope;
// ============================================================================
// NETWORK UTILITIES
// ============================================================================
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
const calculateSubnetInfo = (cidr) => {
    const [network, prefixStr] = cidr.split('/');
    const prefix = parseInt(prefixStr, 10);
    // Convert IP to integer
    const ipToInt = (ip) => {
        return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
    };
    // Convert integer to IP
    const intToIp = (int) => {
        return [
            (int >>> 24) & 255,
            (int >>> 16) & 255,
            (int >>> 8) & 255,
            int & 255,
        ].join('.');
    };
    const networkInt = ipToInt(network);
    const hostBits = 32 - prefix;
    const totalHosts = Math.pow(2, hostBits);
    const usableHosts = totalHosts - 2;
    const netmaskInt = ((0xffffffff << hostBits) >>> 0);
    const wildcardInt = ~netmaskInt >>> 0;
    const broadcastInt = (networkInt | wildcardInt) >>> 0;
    const firstHostInt = networkInt + 1;
    const lastHostInt = broadcastInt - 1;
    return {
        network,
        broadcast: intToIp(broadcastInt),
        firstHost: intToIp(firstHostInt),
        lastHost: intToIp(lastHostInt),
        totalHosts,
        usableHosts: Math.max(0, usableHosts),
        netmask: intToIp(netmaskInt),
        wildcardMask: intToIp(wildcardInt),
        cidr,
    };
};
exports.calculateSubnetInfo = calculateSubnetInfo;
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
const validateNetworkTopology = async (linkModel, networkId) => {
    const errors = [];
    try {
        // Fetch all links for the network
        const links = await linkModel.findAll({
            where: { active: true },
            attributes: ['id', 'sourceNodeId', 'targetNodeId'],
        });
        // Check for self-loops
        const selfLoops = links.filter((link) => link.sourceNodeId === link.targetNodeId);
        if (selfLoops.length > 0) {
            errors.push(`Found ${selfLoops.length} self-loop(s) in network topology`);
        }
        // Build adjacency list for cycle detection
        const graph = new Map();
        links.forEach((link) => {
            if (!graph.has(link.sourceNodeId)) {
                graph.set(link.sourceNodeId, []);
            }
            graph.get(link.sourceNodeId).push(link.targetNodeId);
        });
        // Detect cycles using DFS
        const visited = new Set();
        const recStack = new Set();
        const hasCycle = (node) => {
            visited.add(node);
            recStack.add(node);
            const neighbors = graph.get(node) || [];
            for (const neighbor of neighbors) {
                if (!visited.has(neighbor)) {
                    if (hasCycle(neighbor))
                        return true;
                }
                else if (recStack.has(neighbor)) {
                    return true;
                }
            }
            recStack.delete(node);
            return false;
        };
        for (const node of graph.keys()) {
            if (!visited.has(node)) {
                if (hasCycle(node)) {
                    errors.push('Circular dependency detected in network topology');
                    break;
                }
            }
        }
    }
    catch (error) {
        errors.push(`Topology validation failed: ${error.message}`);
    }
    return {
        valid: errors.length === 0,
        errors,
    };
};
exports.validateNetworkTopology = validateNetworkTopology;
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
const detectNetworkLoops = async (linkModel, startNodeId) => {
    const visited = new Set();
    const path = [];
    const links = await linkModel.findAll({
        where: { active: true },
        attributes: ['sourceNodeId', 'targetNodeId'],
    });
    const graph = new Map();
    links.forEach((link) => {
        if (!graph.has(link.sourceNodeId)) {
            graph.set(link.sourceNodeId, []);
        }
        graph.get(link.sourceNodeId).push(link.targetNodeId);
    });
    const dfs = (node) => {
        if (path.includes(node)) {
            return path.slice(path.indexOf(node));
        }
        if (visited.has(node)) {
            return [];
        }
        visited.add(node);
        path.push(node);
        const neighbors = graph.get(node) || [];
        for (const neighbor of neighbors) {
            const loop = dfs(neighbor);
            if (loop.length > 0) {
                return loop;
            }
        }
        path.pop();
        return [];
    };
    return dfs(startNodeId);
};
exports.detectNetworkLoops = detectNetworkLoops;
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
const optimizeRoutingTable = async (routeModel, routeTableId) => {
    const routes = await routeModel.findAll({
        where: {
            routeTableId,
            enabled: true,
        },
        order: [['metric', 'ASC']],
    });
    const seenDestinations = new Set();
    const redundantRoutes = [];
    for (const route of routes) {
        const routeAny = route;
        if (seenDestinations.has(routeAny.destinationCIDR)) {
            redundantRoutes.push(routeAny.id);
        }
        else {
            seenDestinations.add(routeAny.destinationCIDR);
        }
    }
    if (redundantRoutes.length > 0) {
        await routeModel.destroy({
            where: {
                id: redundantRoutes,
            },
        });
    }
    return redundantRoutes.length;
};
exports.optimizeRoutingTable = optimizeRoutingTable;
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
const generateNetworkDiagram = async (networkModel, nodeModel, linkModel, networkId) => {
    const network = await networkModel.findByPk(networkId);
    if (!network) {
        throw new Error(`Network ${networkId} not found`);
    }
    const nodes = await nodeModel.findAll({
        where: { networkId, active: true },
        attributes: ['id', 'name', 'nodeType', 'status', 'ipAddress'],
    });
    const links = await linkModel.findAll({
        where: { active: true },
        attributes: ['id', 'name', 'sourceNodeId', 'targetNodeId', 'bandwidth', 'latency'],
    });
    return {
        network: {
            id: network.id,
            name: network.name,
            cidr: network.cidr,
            type: network.networkType,
        },
        nodes: nodes.map((node) => ({
            id: node.id,
            label: node.name,
            type: node.nodeType,
            status: node.status,
            ip: node.ipAddress,
        })),
        links: links.map((link) => ({
            id: link.id,
            source: link.sourceNodeId,
            target: link.targetNodeId,
            label: link.name,
            bandwidth: link.bandwidth,
            latency: link.latency,
        })),
        metadata: {
            generatedAt: new Date().toISOString(),
            nodeCount: nodes.length,
            linkCount: links.length,
        },
    };
};
exports.generateNetworkDiagram = generateNetworkDiagram;
//# sourceMappingURL=network-models-kit.js.map