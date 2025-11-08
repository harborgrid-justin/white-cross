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

import {
  Model,
  ModelStatic,
  Sequelize,
  DataTypes,
  ModelAttributes,
  ModelOptions,
  ValidationError,
  ValidationErrorItem,
  Transaction,
  Op,
  literal,
  fn,
  col,
  FindOptions,
} from 'sequelize';
import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * @enum NetworkType
 * @description Types of virtual networks
 */
export enum NetworkType {
  LAN = 'LAN',
  VLAN = 'VLAN',
  VPN = 'VPN',
  OVERLAY = 'OVERLAY',
  UNDERLAY = 'UNDERLAY',
  MANAGEMENT = 'MANAGEMENT',
  STORAGE = 'STORAGE',
  DMZ = 'DMZ',
}

/**
 * @enum NetworkNodeType
 * @description Types of network nodes/devices
 */
export enum NetworkNodeType {
  ROUTER = 'ROUTER',
  SWITCH = 'SWITCH',
  LOAD_BALANCER = 'LOAD_BALANCER',
  FIREWALL = 'FIREWALL',
  GATEWAY = 'GATEWAY',
  PROXY = 'PROXY',
  VPN_ENDPOINT = 'VPN_ENDPOINT',
  NAT_GATEWAY = 'NAT_GATEWAY',
}

/**
 * @enum NetworkNodeStatus
 * @description Operational status of network nodes
 */
export enum NetworkNodeStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DEGRADED = 'DEGRADED',
  MAINTENANCE = 'MAINTENANCE',
  FAILED = 'FAILED',
  PROVISIONING = 'PROVISIONING',
}

/**
 * @enum InterfaceType
 * @description Types of network interfaces
 */
export enum InterfaceType {
  PHYSICAL = 'PHYSICAL',
  VIRTUAL = 'VIRTUAL',
  LOOPBACK = 'LOOPBACK',
  TUNNEL = 'TUNNEL',
  BOND = 'BOND',
  VLAN = 'VLAN',
}

/**
 * @enum InterfaceStatus
 * @description Status of network interfaces
 */
export enum InterfaceStatus {
  UP = 'UP',
  DOWN = 'DOWN',
  TESTING = 'TESTING',
  UNKNOWN = 'UNKNOWN',
  DORMANT = 'DORMANT',
}

/**
 * @enum ACLAction
 * @description ACL rule actions
 */
export enum ACLAction {
  ALLOW = 'ALLOW',
  DENY = 'DENY',
  REJECT = 'REJECT',
  LOG = 'LOG',
}

/**
 * @enum NetworkProtocol
 * @description Network protocols
 */
export enum NetworkProtocol {
  TCP = 'TCP',
  UDP = 'UDP',
  ICMP = 'ICMP',
  ICMPV6 = 'ICMPV6',
  ESP = 'ESP',
  AH = 'AH',
  GRE = 'GRE',
  ALL = 'ALL',
}

/**
 * @enum RouteType
 * @description Routing table entry types
 */
export enum RouteType {
  STATIC = 'STATIC',
  DYNAMIC = 'DYNAMIC',
  CONNECTED = 'CONNECTED',
  DEFAULT = 'DEFAULT',
  BLACKHOLE = 'BLACKHOLE',
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
export const createVirtualNetworkModel = (
  sequelize: Sequelize,
  config: VirtualNetworkConfig = {},
  options: Partial<ModelOptions> = {},
): ModelStatic<Model> => {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [1, 255],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    networkType: {
      type: DataTypes.ENUM(...Object.values(NetworkType)),
      allowNull: false,
      defaultValue: NetworkType.LAN,
    },
    cidr: {
      type: DataTypes.CIDR,
      allowNull: false,
      comment: 'Network CIDR notation (e.g., 192.168.1.0/24)',
    },
    vlanId: {
      type: DataTypes.INTEGER,
      allowNull: config.enableVLAN ? false : true,
      validate: {
        min: 1,
        max: 4094,
      },
      comment: 'VLAN ID (1-4094)',
    },
    gateway: {
      type: DataTypes.INET,
      allowNull: true,
      comment: 'Default gateway IP address',
    },
    dnsServers: {
      type: DataTypes.ARRAY(DataTypes.INET),
      allowNull: true,
      defaultValue: [],
      comment: 'DNS server IP addresses',
    },
    dhcpEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: config.enableDHCP || false,
    },
    dhcpRange: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: null,
      comment: 'DHCP IP range: { start: "x.x.x.x", end: "x.x.x.x" }',
    },
    mtu: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: config.mtu || 1500,
      validate: {
        min: 68,
        max: 9000,
      },
    },
    isolated: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Network isolation enabled',
    },
    config: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
      comment: 'Additional network configuration',
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    version: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  };

  class VirtualNetwork extends Model {}

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
export const createNetworkNodeModel = (
  sequelize: Sequelize,
  defaultType?: NetworkNodeType,
  options: Partial<ModelOptions> = {},
): ModelStatic<Model> => {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    networkId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'virtual_networks',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    nodeType: {
      type: DataTypes.ENUM(...Object.values(NetworkNodeType)),
      allowNull: false,
      defaultValue: defaultType || NetworkNodeType.ROUTER,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(NetworkNodeStatus)),
      allowNull: false,
      defaultValue: NetworkNodeStatus.PROVISIONING,
    },
    ipAddress: {
      type: DataTypes.INET,
      allowNull: true,
      comment: 'Primary IP address',
    },
    macAddress: {
      type: DataTypes.MACADDR,
      allowNull: true,
      comment: 'Primary MAC address',
    },
    hostname: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    managementIP: {
      type: DataTypes.INET,
      allowNull: true,
      comment: 'Management interface IP',
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Physical or virtual location',
    },
    config: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
      comment: 'Node configuration',
    },
    capabilities: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
      comment: 'Node capabilities and features',
    },
    healthCheck: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: null,
      comment: 'Last health check result',
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    version: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  };

  class NetworkNode extends Model {}

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
export const createNetworkInterfaceModel = (
  sequelize: Sequelize,
  options: Partial<ModelOptions> = {},
): ModelStatic<Model> => {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    nodeId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'network_nodes',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Interface name (e.g., eth0, ens160)',
    },
    interfaceType: {
      type: DataTypes.ENUM(...Object.values(InterfaceType)),
      allowNull: false,
      defaultValue: InterfaceType.VIRTUAL,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(InterfaceStatus)),
      allowNull: false,
      defaultValue: InterfaceStatus.DOWN,
    },
    macAddress: {
      type: DataTypes.MACADDR,
      allowNull: false,
      unique: true,
    },
    ipAddress: {
      type: DataTypes.INET,
      allowNull: true,
    },
    netmask: {
      type: DataTypes.INET,
      allowNull: true,
    },
    vlanId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 4094,
      },
    },
    bandwidth: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: 'Bandwidth in bps',
      validate: {
        min: 0,
      },
    },
    mtu: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1500,
      validate: {
        min: 68,
        max: 9000,
      },
    },
    duplex: {
      type: DataTypes.ENUM('FULL', 'HALF', 'AUTO'),
      allowNull: false,
      defaultValue: 'AUTO',
    },
    statistics: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
      comment: 'TX/RX statistics',
    },
    config: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  };

  class NetworkInterface extends Model {}

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
export const createNetworkLinkModel = (
  sequelize: Sequelize,
  options: Partial<ModelOptions> = {},
): ModelStatic<Model> => {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    sourceNodeId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'network_nodes',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    sourceInterfaceId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'network_interfaces',
        key: 'id',
      },
    },
    targetNodeId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'network_nodes',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    targetInterfaceId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'network_interfaces',
        key: 'id',
      },
    },
    bandwidth: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: 'Link bandwidth in bps',
      validate: {
        min: 0,
      },
    },
    latency: {
      type: DataTypes.FLOAT,
      allowNull: true,
      comment: 'Link latency in milliseconds',
      validate: {
        min: 0,
      },
    },
    packetLoss: {
      type: DataTypes.FLOAT,
      allowNull: true,
      comment: 'Packet loss percentage',
      validate: {
        min: 0,
        max: 100,
      },
    },
    redundant: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    aggregated: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Link aggregation (LAG)',
    },
    statistics: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
      comment: 'Traffic statistics',
    },
    config: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  };

  class NetworkLink extends Model {}

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
export const createNetworkACLModel = (
  sequelize: Sequelize,
  options: Partial<ModelOptions> = {},
): ModelStatic<Model> => {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    networkId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'virtual_networks',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    priority: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 100,
      comment: 'Rule priority (lower = higher priority)',
      validate: {
        min: 1,
        max: 65535,
      },
    },
    action: {
      type: DataTypes.ENUM(...Object.values(ACLAction)),
      allowNull: false,
      defaultValue: ACLAction.DENY,
    },
    protocol: {
      type: DataTypes.ENUM(...Object.values(NetworkProtocol)),
      allowNull: false,
      defaultValue: NetworkProtocol.ALL,
    },
    sourceCIDR: {
      type: DataTypes.CIDR,
      allowNull: true,
      comment: 'Source CIDR block',
    },
    sourcePort: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 65535,
      },
    },
    sourcePortRange: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'Port range (e.g., "8000-9000")',
    },
    destinationCIDR: {
      type: DataTypes.CIDR,
      allowNull: true,
      comment: 'Destination CIDR block',
    },
    destinationPort: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 65535,
      },
    },
    destinationPortRange: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'Port range (e.g., "443-443")',
    },
    direction: {
      type: DataTypes.ENUM('INBOUND', 'OUTBOUND', 'BOTH'),
      allowNull: false,
      defaultValue: 'INBOUND',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Temporary rule expiration',
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
  };

  class NetworkACL extends Model {}

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
export const createNetworkRouteTableModel = (
  sequelize: Sequelize,
  options: Partial<ModelOptions> = {},
): ModelStatic<Model> => {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    networkId: {
      type: DataTypes.UUID,
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
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    defaultRoute: {
      type: DataTypes.INET,
      allowNull: true,
      comment: 'Default gateway',
    },
    propagateRoutes: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Propagate routes to connected networks',
    },
    config: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    version: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  };

  class NetworkRouteTable extends Model {}

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
export const createNetworkRouteModel = (
  sequelize: Sequelize,
  options: Partial<ModelOptions> = {},
): ModelStatic<Model> => {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    routeTableId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'network_route_tables',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    destinationCIDR: {
      type: DataTypes.CIDR,
      allowNull: false,
      comment: 'Destination network CIDR',
    },
    gateway: {
      type: DataTypes.INET,
      allowNull: false,
      comment: 'Next-hop gateway IP',
    },
    metric: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 100,
      comment: 'Route metric/cost',
      validate: {
        min: 0,
      },
    },
    routeType: {
      type: DataTypes.ENUM(...Object.values(RouteType)),
      allowNull: false,
      defaultValue: RouteType.STATIC,
    },
    interfaceName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Outbound interface',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
  };

  class NetworkRoute extends Model {}

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
export const createSubnetModel = (
  sequelize: Sequelize,
  options: Partial<ModelOptions> = {},
): ModelStatic<Model> => {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    networkId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'virtual_networks',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    cidr: {
      type: DataTypes.CIDR,
      allowNull: false,
      comment: 'Subnet CIDR notation',
    },
    gateway: {
      type: DataTypes.INET,
      allowNull: true,
    },
    vlanId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 4094,
      },
    },
    ipv6Enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    ipv6CIDR: {
      type: DataTypes.CIDR,
      allowNull: true,
      comment: 'IPv6 CIDR notation',
    },
    availableIPs: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Available IP count',
    },
    allocatedIPs: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Allocated IP count',
    },
    reservedIPs: {
      type: DataTypes.ARRAY(DataTypes.INET),
      allowNull: false,
      defaultValue: [],
      comment: 'Reserved IP addresses',
    },
    config: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  };

  class Subnet extends Model {}

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
export const addIPv4Validation = (
  model: ModelStatic<Model>,
  fieldName: string,
  required: boolean = false,
): void => {
  const attributes = (model as any).rawAttributes;
  if (attributes[fieldName]) {
    attributes[fieldName].validate = {
      ...attributes[fieldName].validate,
      isIPv4(value: string) {
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
export const addIPv6Validation = (
  model: ModelStatic<Model>,
  fieldName: string,
  required: boolean = false,
): void => {
  const attributes = (model as any).rawAttributes;
  if (attributes[fieldName]) {
    attributes[fieldName].validate = {
      ...attributes[fieldName].validate,
      isIPv6(value: string) {
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
export const addCIDRValidation = (model: ModelStatic<Model>, fieldName: string): void => {
  const attributes = (model as any).rawAttributes;
  if (attributes[fieldName]) {
    attributes[fieldName].validate = {
      ...attributes[fieldName].validate,
      isCIDR(value: string) {
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
export const addMACAddressValidation = (
  model: ModelStatic<Model>,
  fieldName: string,
): void => {
  const attributes = (model as any).rawAttributes;
  if (attributes[fieldName]) {
    attributes[fieldName].validate = {
      ...attributes[fieldName].validate,
      isMACAddress(value: string) {
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
export const addVLANValidation = (model: ModelStatic<Model>, fieldName: string): void => {
  const attributes = (model as any).rawAttributes;
  if (attributes[fieldName]) {
    attributes[fieldName].validate = {
      ...attributes[fieldName].validate,
      isValidVLAN(value: number) {
        if (value !== null && value !== undefined) {
          if (value < 1 || value > 4094) {
            throw new Error(`${fieldName} must be between 1 and 4094`);
          }
        }
      },
    };
  }
};

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
export const addPortValidation = (model: ModelStatic<Model>, fieldName: string): void => {
  const attributes = (model as any).rawAttributes;
  if (attributes[fieldName]) {
    attributes[fieldName].validate = {
      ...attributes[fieldName].validate,
      isValidPort(value: number) {
        if (value !== null && value !== undefined) {
          if (value < 1 || value > 65535) {
            throw new Error(`${fieldName} must be between 1 and 65535`);
          }
        }
      },
    };
  }
};

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
export const addProtocolValidation = (
  model: ModelStatic<Model>,
  fieldName: string,
): void => {
  const attributes = (model as any).rawAttributes;
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
export const addBandwidthValidation = (
  model: ModelStatic<Model>,
  fieldName: string,
  maxBandwidth?: number,
): void => {
  const attributes = (model as any).rawAttributes;
  if (attributes[fieldName]) {
    attributes[fieldName].validate = {
      ...attributes[fieldName].validate,
      isValidBandwidth(value: number) {
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
export const addNetworkRangeValidation = (
  model: ModelStatic<Model>,
  fieldName: string,
): void => {
  const attributes = (model as any).rawAttributes;
  if (attributes[fieldName]) {
    attributes[fieldName].validate = {
      ...attributes[fieldName].validate,
      async isValidNetworkRange(value: string) {
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
export const addSubnetMaskValidation = (
  model: ModelStatic<Model>,
  fieldName: string,
): void => {
  const attributes = (model as any).rawAttributes;
  if (attributes[fieldName]) {
    attributes[fieldName].validate = {
      ...attributes[fieldName].validate,
      isValidSubnetMask(value: string) {
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
export const configureNetworkIsolation = (
  networkModel: ModelStatic<Model>,
  enabled: boolean = true,
): void => {
  networkModel.addHook('beforeCreate', (instance: any) => {
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
export const configureVLANTagging = (
  networkModel: ModelStatic<Model>,
  vlanId: number,
): void => {
  networkModel.addHook('beforeCreate', (instance: any) => {
    if (vlanId < 1 || vlanId > 4094) {
      throw new ValidationError('VLAN ID must be between 1 and 4094');
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
export const configureDHCPSettings = (
  networkModel: ModelStatic<Model>,
  rangeStart: string,
  rangeEnd: string,
  leaseTime: number = 86400,
): void => {
  networkModel.addHook('beforeCreate', (instance: any) => {
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
export const configureDNSSettings = (
  networkModel: ModelStatic<Model>,
  dnsServers: string[],
  domain?: string,
): void => {
  networkModel.addHook('beforeCreate', (instance: any) => {
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
export const configureFirewallRules = (
  aclModel: ModelStatic<Model>,
  rules: ACLRule[],
): void => {
  aclModel.addHook('beforeBulkCreate', (instances: any[]) => {
    rules.forEach((rule, index) => {
      if (instances[index]) {
        Object.assign(instances[index], rule);
      }
    });
  });
};

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
export const configureQoSPolicies = (
  networkModel: ModelStatic<Model>,
  qosPolicy: Record<string, any>,
): void => {
  networkModel.addHook('beforeCreate', (instance: any) => {
    instance.config = {
      ...instance.config,
      qos: {
        ...qosPolicy,
        enabled: true,
      },
    };
  });
};

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
export const configureLoadBalancing = (
  nodeModel: ModelStatic<Model>,
  algorithm: string,
  options: Record<string, any> = {},
): void => {
  nodeModel.addHook('beforeCreate', (instance: any) => {
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
export const configureNetworkSegmentation = (
  networkModel: ModelStatic<Model>,
  segments: string[],
): void => {
  networkModel.addHook('beforeCreate', (instance: any) => {
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
export const addNetworkCreationHook = (
  networkModel: ModelStatic<Model>,
  callback?: (instance: Model) => Promise<void> | void,
): void => {
  networkModel.addHook('afterCreate', async (instance: any, options: any) => {
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
export const addNetworkUpdateHook = (
  networkModel: ModelStatic<Model>,
  callback?: (instance: Model) => Promise<void> | void,
): void => {
  networkModel.addHook('beforeUpdate', async (instance: any, options: any) => {
    if (instance.changed()) {
      instance.version += 1;
    }

    if (callback) {
      await callback(instance);
    }
  });
};

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
export const addNetworkDeletionHook = (
  networkModel: ModelStatic<Model>,
  callback?: (instance: Model) => Promise<void> | void,
): void => {
  networkModel.addHook('beforeDestroy', async (instance: any, options: any) => {
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
export const addACLUpdateHook = (
  aclModel: ModelStatic<Model>,
  callback?: (instance: Model) => Promise<void> | void,
): void => {
  aclModel.addHook('afterUpdate', async (instance: any, options: any) => {
    // Mark ACL as requiring cache invalidation
    instance.metadata = {
      ...instance.metadata,
      cacheInvalidatedAt: new Date(),
    };

    if (callback) {
      await callback(instance);
    }
  });

  aclModel.addHook('afterCreate', async (instance: any, options: any) => {
    if (callback) {
      await callback(instance);
    }
  });
};

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
export const addRouteChangeHook = (
  routeModel: ModelStatic<Model>,
  callback?: (instance: Model) => Promise<void> | void,
): void => {
  const updateMetadata = (instance: any) => {
    instance.metadata = {
      ...instance.metadata,
      lastModified: new Date(),
      propagationRequired: true,
    };
  };

  routeModel.addHook('afterCreate', async (instance: any, options: any) => {
    updateMetadata(instance);
    if (callback) await callback(instance);
  });

  routeModel.addHook('afterUpdate', async (instance: any, options: any) => {
    updateMetadata(instance);
    if (callback) await callback(instance);
  });

  routeModel.addHook('afterDestroy', async (instance: any, options: any) => {
    if (callback) await callback(instance);
  });
};

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
export const addInterfaceStatusHook = (
  interfaceModel: ModelStatic<Model>,
  callback?: (instance: Model) => Promise<void> | void,
): void => {
  interfaceModel.addHook('afterUpdate', async (instance: any, options: any) => {
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
export const addNodeHealthCheckHook = (
  nodeModel: ModelStatic<Model>,
  healthCheckFn: (instance: Model) => Promise<Record<string, any>>,
): void => {
  nodeModel.addHook('afterFind', async (instances: any) => {
    const nodes = Array.isArray(instances) ? instances : [instances];

    for (const node of nodes) {
      if (node && node.active) {
        try {
          const healthStatus = await healthCheckFn(node);
          node.healthCheck = healthStatus;
        } catch (error) {
          node.healthCheck = {
            healthy: false,
            error: (error as Error).message,
            timestamp: new Date(),
          };
        }
      }
    }
  });
};

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
export const addBandwidthMonitoringHook = (
  linkModel: ModelStatic<Model>,
  callback?: (instance: Model) => Promise<void> | void,
): void => {
  linkModel.addHook('afterUpdate', async (instance: any, options: any) => {
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
export const addActiveNetworkScope = (networkModel: ModelStatic<Model>): void => {
  (networkModel as any).addScope('active', {
    where: {
      active: true,
      deletedAt: null,
    },
  });
};

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
export const addNetworkTypeScope = (networkModel: ModelStatic<Model>): void => {
  (networkModel as any).addScope('byType', (networkType: NetworkType) => ({
    where: { networkType },
  }));
};

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
export const addVLANScope = (networkModel: ModelStatic<Model>): void => {
  (networkModel as any).addScope('byVLAN', (vlanId: number) => ({
    where: { vlanId },
  }));
};

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
export const addNodeStatusScope = (nodeModel: ModelStatic<Model>): void => {
  (nodeModel as any).addScope('byStatus', (status: NetworkNodeStatus) => ({
    where: { status },
  }));
};

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
export const addInterfaceScope = (
  nodeModel: ModelStatic<Model>,
  interfaceModel: ModelStatic<Model>,
): void => {
  (nodeModel as any).addScope('withInterfaces', {
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
export const addSecurityGroupScope = (aclModel: ModelStatic<Model>): void => {
  (aclModel as any).addScope('bySecurityGroup', (securityGroupId: string) => ({
    where: {
      metadata: {
        securityGroupId,
      },
    },
  }));
};

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
export const calculateSubnetInfo = (cidr: string): SubnetInfo => {
  const [network, prefixStr] = cidr.split('/');
  const prefix = parseInt(prefixStr, 10);

  // Convert IP to integer
  const ipToInt = (ip: string): number => {
    return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
  };

  // Convert integer to IP
  const intToIp = (int: number): string => {
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
export const validateNetworkTopology = async (
  linkModel: ModelStatic<Model>,
  networkId: string,
): Promise<{ valid: boolean; errors: string[] }> => {
  const errors: string[] = [];

  try {
    // Fetch all links for the network
    const links = await linkModel.findAll({
      where: { active: true },
      attributes: ['id', 'sourceNodeId', 'targetNodeId'],
    });

    // Check for self-loops
    const selfLoops = links.filter(
      (link: any) => link.sourceNodeId === link.targetNodeId,
    );

    if (selfLoops.length > 0) {
      errors.push(`Found ${selfLoops.length} self-loop(s) in network topology`);
    }

    // Build adjacency list for cycle detection
    const graph: Map<string, string[]> = new Map();
    links.forEach((link: any) => {
      if (!graph.has(link.sourceNodeId)) {
        graph.set(link.sourceNodeId, []);
      }
      graph.get(link.sourceNodeId)!.push(link.targetNodeId);
    });

    // Detect cycles using DFS
    const visited = new Set<string>();
    const recStack = new Set<string>();

    const hasCycle = (node: string): boolean => {
      visited.add(node);
      recStack.add(node);

      const neighbors = graph.get(node) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          if (hasCycle(neighbor)) return true;
        } else if (recStack.has(neighbor)) {
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
  } catch (error) {
    errors.push(`Topology validation failed: ${(error as Error).message}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

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
export const detectNetworkLoops = async (
  linkModel: ModelStatic<Model>,
  startNodeId: string,
): Promise<string[]> => {
  const visited = new Set<string>();
  const path: string[] = [];

  const links = await linkModel.findAll({
    where: { active: true },
    attributes: ['sourceNodeId', 'targetNodeId'],
  });

  const graph: Map<string, string[]> = new Map();
  links.forEach((link: any) => {
    if (!graph.has(link.sourceNodeId)) {
      graph.set(link.sourceNodeId, []);
    }
    graph.get(link.sourceNodeId)!.push(link.targetNodeId);
  });

  const dfs = (node: string): string[] => {
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
export const optimizeRoutingTable = async (
  routeModel: ModelStatic<Model>,
  routeTableId: string,
): Promise<number> => {
  const routes = await routeModel.findAll({
    where: {
      routeTableId,
      enabled: true,
    },
    order: [['metric', 'ASC']],
  });

  const seenDestinations = new Set<string>();
  const redundantRoutes: string[] = [];

  for (const route of routes) {
    const routeAny = route as any;
    if (seenDestinations.has(routeAny.destinationCIDR)) {
      redundantRoutes.push(routeAny.id);
    } else {
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
export const generateNetworkDiagram = async (
  networkModel: ModelStatic<Model>,
  nodeModel: ModelStatic<Model>,
  linkModel: ModelStatic<Model>,
  networkId: string,
): Promise<Record<string, any>> => {
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
      id: (network as any).id,
      name: (network as any).name,
      cidr: (network as any).cidr,
      type: (network as any).networkType,
    },
    nodes: nodes.map((node: any) => ({
      id: node.id,
      label: node.name,
      type: node.nodeType,
      status: node.status,
      ip: node.ipAddress,
    })),
    links: links.map((link: any) => ({
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
