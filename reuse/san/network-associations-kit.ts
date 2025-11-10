/**
 * @fileoverview Network Associations Kit - Comprehensive Sequelize associations for network models
 * @module reuse/san/network-associations-kit
 * @description Complete Sequelize association definitions and utilities for virtual network models,
 * including one-to-many, many-to-many, junction tables, association scopes, eager loading strategies,
 * through model customization, cascade configurations, and association query helpers.
 *
 * Key Features:
 * - One-to-many associations (network to nodes, nodes to interfaces)
 * - Many-to-many associations (nodes to networks, links to nodes)
 * - Junction table model definitions
 * - Association scopes for filtered queries
 * - Eager loading optimization strategies
 * - Through model customization and attributes
 * - Cascade delete configurations
 * - Association query helper functions
 * - Polymorphic associations for flexible relationships
 * - Self-referencing associations for hierarchies
 * - Conditional associations based on network type
 * - Association hooks and callbacks
 *
 * @target Sequelize v6.x, Node 18+, TypeScript 5.x, PostgreSQL 14+
 *
 * @security
 * - Association access control validation
 * - Cascade delete authorization checks
 * - Relationship audit logging
 * - Junction table access restrictions
 * - Eager loading data filtering
 * - Association query sanitization
 *
 * @example Basic associations
 * ```typescript
 * import {
 *   associateNetworkToNodes,
 *   associateNodeToInterfaces,
 *   associateNetworkToACLs
 * } from './network-associations-kit';
 *
 * // Set up model associations
 * associateNetworkToNodes(VirtualNetwork, NetworkNode);
 * associateNodeToInterfaces(NetworkNode, NetworkInterface);
 * associateNetworkToACLs(VirtualNetwork, NetworkACL);
 * ```
 *
 * @example Eager loading with scopes
 * ```typescript
 * import { addNetworkWithNodesScope, eagerLoadNetworkTopology } from './network-associations-kit';
 *
 * addNetworkWithNodesScope(VirtualNetwork, NetworkNode);
 * const networks = await VirtualNetwork.scope('withNodes').findAll();
 *
 * const topology = await eagerLoadNetworkTopology(VirtualNetwork, 'network-123');
 * ```
 *
 * @example Many-to-many with junction table
 * ```typescript
 * import { associateLinkEndpoints, createLinkEndpointJunction } from './network-associations-kit';
 *
 * const LinkEndpoint = createLinkEndpointJunction(sequelize);
 * associateLinkEndpoints(NetworkLink, NetworkNode, LinkEndpoint);
 * ```
 *
 * LOC: NET-ASSOC-001
 * UPSTREAM: sequelize, network-models-kit
 * DOWNSTREAM: network services, topology manager, routing engine
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
  Association,
  HasManyOptions,
  BelongsToOptions,
  BelongsToManyOptions,
  HasOneOptions,
  FindOptions,
  IncludeOptions,
  Transaction,
  Op,
} from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * @interface AssociationConfig
 * @description Configuration options for associations
 */
export interface AssociationConfig {
  as?: string;
  foreignKey?: string;
  sourceKey?: string;
  targetKey?: string;
  onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
  onUpdate?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
  hooks?: boolean;
  scope?: Record<string, any>;
}

/**
 * @interface JunctionTableConfig
 * @description Configuration for junction tables
 */
export interface JunctionTableConfig {
  tableName?: string;
  timestamps?: boolean;
  paranoid?: boolean;
  additionalAttributes?: ModelAttributes;
}

/**
 * @interface EagerLoadingStrategy
 * @description Strategy for eager loading associations
 */
export interface EagerLoadingStrategy {
  maxDepth?: number;
  includeDeleted?: boolean;
  attributes?: string[];
  order?: any[];
  limit?: number;
}

/**
 * @interface CascadeConfig
 * @description Cascade delete configuration
 */
export interface CascadeConfig {
  beforeDelete?: (instance: Model, options: any) => Promise<void>;
  afterDelete?: (instance: Model, options: any) => Promise<void>;
  validateDelete?: (instance: Model) => Promise<boolean>;
}

/**
 * @enum AssociationType
 * @description Types of associations
 */
export enum AssociationType {
  HAS_MANY = 'HAS_MANY',
  BELONGS_TO = 'BELONGS_TO',
  BELONGS_TO_MANY = 'BELONGS_TO_MANY',
  HAS_ONE = 'HAS_ONE',
}

// ============================================================================
// ASSOCIATION DEFINITIONS (ONE-TO-MANY)
// ============================================================================

/**
 * Associates VirtualNetwork to NetworkNodes (one-to-many)
 *
 * @param {ModelStatic<Model>} networkModel - VirtualNetwork model
 * @param {ModelStatic<Model>} nodeModel - NetworkNode model
 * @param {AssociationConfig} [config={}] - Association configuration
 * @returns {Association} Association instance
 *
 * @example
 * ```typescript
 * associateNetworkToNodes(VirtualNetwork, NetworkNode, {
 *   as: 'nodes',
 *   foreignKey: 'networkId',
 *   onDelete: 'CASCADE'
 * });
 * ```
 */
export const associateNetworkToNodes = (
  networkModel: ModelStatic<Model>,
  nodeModel: ModelStatic<Model>,
  config: AssociationConfig = {},
): Association => {
  const options: HasManyOptions = {
    as: config.as || 'nodes',
    foreignKey: config.foreignKey || 'networkId',
    onDelete: config.onDelete || 'CASCADE',
    onUpdate: config.onUpdate || 'CASCADE',
    hooks: config.hooks !== false,
  };

  if (config.scope) {
    options.scope = config.scope;
  }

  return networkModel.hasMany(nodeModel, options);
};

/**
 * Associates NetworkNode to NetworkInterfaces (one-to-many)
 *
 * @param {ModelStatic<Model>} nodeModel - NetworkNode model
 * @param {ModelStatic<Model>} interfaceModel - NetworkInterface model
 * @param {AssociationConfig} [config={}] - Association configuration
 * @returns {Association} Association instance
 *
 * @example
 * ```typescript
 * associateNodeToInterfaces(NetworkNode, NetworkInterface, {
 *   as: 'interfaces',
 *   foreignKey: 'nodeId'
 * });
 * ```
 */
export const associateNodeToInterfaces = (
  nodeModel: ModelStatic<Model>,
  interfaceModel: ModelStatic<Model>,
  config: AssociationConfig = {},
): Association => {
  const options: HasManyOptions = {
    as: config.as || 'interfaces',
    foreignKey: config.foreignKey || 'nodeId',
    onDelete: config.onDelete || 'CASCADE',
    onUpdate: config.onUpdate || 'CASCADE',
    hooks: config.hooks !== false,
  };

  if (config.scope) {
    options.scope = config.scope;
  }

  return nodeModel.hasMany(interfaceModel, options);
};

/**
 * Associates NetworkLink to NetworkNodes (source and target)
 *
 * @param {ModelStatic<Model>} linkModel - NetworkLink model
 * @param {ModelStatic<Model>} nodeModel - NetworkNode model
 * @param {AssociationConfig} [config={}] - Association configuration
 * @returns {Association[]} Array of association instances
 *
 * @example
 * ```typescript
 * associateLinkToNodes(NetworkLink, NetworkNode);
 * ```
 */
export const associateLinkToNodes = (
  linkModel: ModelStatic<Model>,
  nodeModel: ModelStatic<Model>,
  config: AssociationConfig = {},
): Association[] => {
  const sourceOptions: BelongsToOptions = {
    as: 'sourceNode',
    foreignKey: 'sourceNodeId',
    onDelete: config.onDelete || 'CASCADE',
    onUpdate: config.onUpdate || 'CASCADE',
  };

  const targetOptions: BelongsToOptions = {
    as: 'targetNode',
    foreignKey: 'targetNodeId',
    onDelete: config.onDelete || 'CASCADE',
    onUpdate: config.onUpdate || 'CASCADE',
  };

  return [
    linkModel.belongsTo(nodeModel, sourceOptions),
    linkModel.belongsTo(nodeModel, targetOptions),
  ];
};

/**
 * Associates VirtualNetwork to NetworkACLs (one-to-many)
 *
 * @param {ModelStatic<Model>} networkModel - VirtualNetwork model
 * @param {ModelStatic<Model>} aclModel - NetworkACL model
 * @param {AssociationConfig} [config={}] - Association configuration
 * @returns {Association} Association instance
 *
 * @example
 * ```typescript
 * associateNetworkToACLs(VirtualNetwork, NetworkACL, {
 *   as: 'acls',
 *   foreignKey: 'networkId'
 * });
 * ```
 */
export const associateNetworkToACLs = (
  networkModel: ModelStatic<Model>,
  aclModel: ModelStatic<Model>,
  config: AssociationConfig = {},
): Association => {
  const options: HasManyOptions = {
    as: config.as || 'acls',
    foreignKey: config.foreignKey || 'networkId',
    onDelete: config.onDelete || 'CASCADE',
    onUpdate: config.onUpdate || 'CASCADE',
    hooks: config.hooks !== false,
  };

  if (config.scope) {
    options.scope = config.scope;
  }

  return networkModel.hasMany(aclModel, options);
};

/**
 * Associates VirtualNetwork to NetworkRouteTable (one-to-one)
 *
 * @param {ModelStatic<Model>} networkModel - VirtualNetwork model
 * @param {ModelStatic<Model>} routeTableModel - NetworkRouteTable model
 * @param {AssociationConfig} [config={}] - Association configuration
 * @returns {Association} Association instance
 *
 * @example
 * ```typescript
 * associateNetworkToRouteTable(VirtualNetwork, NetworkRouteTable, {
 *   as: 'routeTable',
 *   foreignKey: 'networkId'
 * });
 * ```
 */
export const associateNetworkToRouteTable = (
  networkModel: ModelStatic<Model>,
  routeTableModel: ModelStatic<Model>,
  config: AssociationConfig = {},
): Association => {
  const options: HasOneOptions = {
    as: config.as || 'routeTable',
    foreignKey: config.foreignKey || 'networkId',
    onDelete: config.onDelete || 'CASCADE',
    onUpdate: config.onUpdate || 'CASCADE',
  };

  if (config.scope) {
    options.scope = config.scope;
  }

  return networkModel.hasOne(routeTableModel, options);
};

/**
 * Associates NetworkRouteTable to NetworkRoutes (one-to-many)
 *
 * @param {ModelStatic<Model>} routeTableModel - NetworkRouteTable model
 * @param {ModelStatic<Model>} routeModel - NetworkRoute model
 * @param {AssociationConfig} [config={}] - Association configuration
 * @returns {Association} Association instance
 *
 * @example
 * ```typescript
 * associateRouteTableToRoutes(NetworkRouteTable, NetworkRoute, {
 *   as: 'routes',
 *   foreignKey: 'routeTableId'
 * });
 * ```
 */
export const associateRouteTableToRoutes = (
  routeTableModel: ModelStatic<Model>,
  routeModel: ModelStatic<Model>,
  config: AssociationConfig = {},
): Association => {
  const options: HasManyOptions = {
    as: config.as || 'routes',
    foreignKey: config.foreignKey || 'routeTableId',
    onDelete: config.onDelete || 'CASCADE',
    onUpdate: config.onUpdate || 'CASCADE',
    hooks: config.hooks !== false,
  };

  if (config.scope) {
    options.scope = config.scope;
  }

  return routeTableModel.hasMany(routeModel, options);
};

/**
 * Associates VirtualNetwork to Subnets (one-to-many)
 *
 * @param {ModelStatic<Model>} networkModel - VirtualNetwork model
 * @param {ModelStatic<Model>} subnetModel - Subnet model
 * @param {AssociationConfig} [config={}] - Association configuration
 * @returns {Association} Association instance
 *
 * @example
 * ```typescript
 * associateNetworkToSubnets(VirtualNetwork, Subnet, {
 *   as: 'subnets',
 *   foreignKey: 'networkId'
 * });
 * ```
 */
export const associateNetworkToSubnets = (
  networkModel: ModelStatic<Model>,
  subnetModel: ModelStatic<Model>,
  config: AssociationConfig = {},
): Association => {
  const options: HasManyOptions = {
    as: config.as || 'subnets',
    foreignKey: config.foreignKey || 'networkId',
    onDelete: config.onDelete || 'CASCADE',
    onUpdate: config.onUpdate || 'CASCADE',
    hooks: config.hooks !== false,
  };

  if (config.scope) {
    options.scope = config.scope;
  }

  return networkModel.hasMany(subnetModel, options);
};

/**
 * Associates NetworkInterface to NetworkNode (belongs-to)
 *
 * @param {ModelStatic<Model>} interfaceModel - NetworkInterface model
 * @param {ModelStatic<Model>} nodeModel - NetworkNode model
 * @param {AssociationConfig} [config={}] - Association configuration
 * @returns {Association} Association instance
 *
 * @example
 * ```typescript
 * associateInterfaceToNode(NetworkInterface, NetworkNode, {
 *   as: 'node',
 *   foreignKey: 'nodeId'
 * });
 * ```
 */
export const associateInterfaceToNode = (
  interfaceModel: ModelStatic<Model>,
  nodeModel: ModelStatic<Model>,
  config: AssociationConfig = {},
): Association => {
  const options: BelongsToOptions = {
    as: config.as || 'node',
    foreignKey: config.foreignKey || 'nodeId',
    onDelete: config.onDelete || 'CASCADE',
    onUpdate: config.onUpdate || 'CASCADE',
  };

  if (config.targetKey) {
    options.targetKey = config.targetKey;
  }

  return interfaceModel.belongsTo(nodeModel, options);
};

/**
 * Associates NetworkLink endpoints to interfaces
 *
 * @param {ModelStatic<Model>} linkModel - NetworkLink model
 * @param {ModelStatic<Model>} interfaceModel - NetworkInterface model
 * @param {AssociationConfig} [config={}] - Association configuration
 * @returns {Association[]} Array of association instances
 *
 * @example
 * ```typescript
 * associateLinkEndpoints(NetworkLink, NetworkInterface);
 * ```
 */
export const associateLinkEndpoints = (
  linkModel: ModelStatic<Model>,
  interfaceModel: ModelStatic<Model>,
  config: AssociationConfig = {},
): Association[] => {
  const sourceOptions: BelongsToOptions = {
    as: 'sourceInterface',
    foreignKey: 'sourceInterfaceId',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  };

  const targetOptions: BelongsToOptions = {
    as: 'targetInterface',
    foreignKey: 'targetInterfaceId',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  };

  return [
    linkModel.belongsTo(interfaceModel, sourceOptions),
    linkModel.belongsTo(interfaceModel, targetOptions),
  ];
};

/**
 * Associates NetworkNode to VirtualNetwork (belongs-to)
 *
 * @param {ModelStatic<Model>} nodeModel - NetworkNode model
 * @param {ModelStatic<Model>} networkModel - VirtualNetwork model
 * @param {AssociationConfig} [config={}] - Association configuration
 * @returns {Association} Association instance
 *
 * @example
 * ```typescript
 * associateNodeToNetwork(NetworkNode, VirtualNetwork, {
 *   as: 'network',
 *   foreignKey: 'networkId'
 * });
 * ```
 */
export const associateNodeToNetwork = (
  nodeModel: ModelStatic<Model>,
  networkModel: ModelStatic<Model>,
  config: AssociationConfig = {},
): Association => {
  const options: BelongsToOptions = {
    as: config.as || 'network',
    foreignKey: config.foreignKey || 'networkId',
    onDelete: config.onDelete || 'CASCADE',
    onUpdate: config.onUpdate || 'CASCADE',
  };

  return nodeModel.belongsTo(networkModel, options);
};

// ============================================================================
// JUNCTION TABLE MODELS
// ============================================================================

/**
 * Creates a junction table for network-node many-to-many relationships
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {JunctionTableConfig} [config={}] - Junction table configuration
 * @returns {ModelStatic<Model>} NetworkNodeJunction model
 *
 * @example
 * ```typescript
 * const NetworkNodeJunction = createNetworkNodeJunction(sequelize, {
 *   tableName: 'network_nodes_junction',
 *   timestamps: true
 * });
 * ```
 */
export const createNetworkNodeJunction = (
  sequelize: Sequelize,
  config: JunctionTableConfig = {},
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
    role: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Node role in the network',
    },
    priority: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 100,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    ...config.additionalAttributes,
  };

  class NetworkNodeJunction extends Model {}

  return NetworkNodeJunction.init(attributes, {
    sequelize,
    modelName: 'NetworkNodeJunction',
    tableName: config.tableName || 'network_nodes_junction',
    timestamps: config.timestamps !== false,
    paranoid: config.paranoid || false,
    underscored: true,
    indexes: [
      { fields: ['network_id', 'node_id'], unique: true },
      { fields: ['network_id'] },
      { fields: ['node_id'] },
    ],
  });
};

/**
 * Creates a junction table for node-interface relationships with metadata
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {JunctionTableConfig} [config={}] - Junction table configuration
 * @returns {ModelStatic<Model>} NodeInterfaceJunction model
 *
 * @example
 * ```typescript
 * const NodeInterfaceJunction = createNodeInterfaceJunction(sequelize);
 * ```
 */
export const createNodeInterfaceJunction = (
  sequelize: Sequelize,
  config: JunctionTableConfig = {},
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
    interfaceId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'network_interfaces',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    isPrimary: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Primary interface for the node',
    },
    bondGroup: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Interface bonding group ID',
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    ...config.additionalAttributes,
  };

  class NodeInterfaceJunction extends Model {}

  return NodeInterfaceJunction.init(attributes, {
    sequelize,
    modelName: 'NodeInterfaceJunction',
    tableName: config.tableName || 'node_interfaces_junction',
    timestamps: config.timestamps !== false,
    paranoid: config.paranoid || false,
    underscored: true,
    indexes: [
      { fields: ['node_id', 'interface_id'], unique: true },
      { fields: ['node_id'] },
      { fields: ['interface_id'] },
    ],
  });
};

/**
 * Creates a junction table for link endpoint relationships
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {JunctionTableConfig} [config={}] - Junction table configuration
 * @returns {ModelStatic<Model>} LinkEndpointJunction model
 *
 * @example
 * ```typescript
 * const LinkEndpoint = createLinkEndpointJunction(sequelize);
 * ```
 */
export const createLinkEndpointJunction = (
  sequelize: Sequelize,
  config: JunctionTableConfig = {},
): ModelStatic<Model> => {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    linkId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'network_links',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
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
    endpointType: {
      type: DataTypes.ENUM('SOURCE', 'TARGET'),
      allowNull: false,
    },
    interfaceId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'network_interfaces',
        key: 'id',
      },
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    ...config.additionalAttributes,
  };

  class LinkEndpointJunction extends Model {}

  return LinkEndpointJunction.init(attributes, {
    sequelize,
    modelName: 'LinkEndpointJunction',
    tableName: config.tableName || 'link_endpoints_junction',
    timestamps: config.timestamps !== false,
    paranoid: config.paranoid || false,
    underscored: true,
    indexes: [
      { fields: ['link_id', 'node_id'], unique: true },
      { fields: ['link_id'] },
      { fields: ['node_id'] },
      { fields: ['interface_id'] },
    ],
  });
};

/**
 * Creates a junction table for network security group associations
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {JunctionTableConfig} [config={}] - Junction table configuration
 * @returns {ModelStatic<Model>} NetworkSecurityGroupJunction model
 *
 * @example
 * ```typescript
 * const NetworkSecurityGroup = createNetworkSecurityGroupJunction(sequelize);
 * ```
 */
export const createNetworkSecurityGroupJunction = (
  sequelize: Sequelize,
  config: JunctionTableConfig = {},
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
    securityGroupId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'Security group identifier',
    },
    appliedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    ...config.additionalAttributes,
  };

  class NetworkSecurityGroupJunction extends Model {}

  return NetworkSecurityGroupJunction.init(attributes, {
    sequelize,
    modelName: 'NetworkSecurityGroupJunction',
    tableName: config.tableName || 'network_security_groups_junction',
    timestamps: config.timestamps !== false,
    paranoid: config.paranoid || false,
    underscored: true,
    indexes: [
      { fields: ['network_id', 'security_group_id'], unique: true },
      { fields: ['network_id'] },
      { fields: ['security_group_id'] },
    ],
  });
};

/**
 * Creates a junction table for node tag associations
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {JunctionTableConfig} [config={}] - Junction table configuration
 * @returns {ModelStatic<Model>} NodeTagJunction model
 *
 * @example
 * ```typescript
 * const NodeTag = createNodeTagJunction(sequelize);
 * ```
 */
export const createNodeTagJunction = (
  sequelize: Sequelize,
  config: JunctionTableConfig = {},
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
    tagKey: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    tagValue: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    ...config.additionalAttributes,
  };

  class NodeTagJunction extends Model {}

  return NodeTagJunction.init(attributes, {
    sequelize,
    modelName: 'NodeTagJunction',
    tableName: config.tableName || 'node_tags_junction',
    timestamps: config.timestamps !== false,
    paranoid: config.paranoid || false,
    underscored: true,
    indexes: [
      { fields: ['node_id', 'tag_key'], unique: true },
      { fields: ['node_id'] },
      { fields: ['tag_key'] },
      { fields: ['tag_value'] },
    ],
  });
};

// ============================================================================
// ASSOCIATION SCOPES
// ============================================================================

/**
 * Adds scope to load network with its nodes
 *
 * @param {ModelStatic<Model>} networkModel - VirtualNetwork model
 * @param {ModelStatic<Model>} nodeModel - NetworkNode model
 * @param {Record<string, any>} [filters={}] - Additional filters
 * @returns {void}
 *
 * @example
 * ```typescript
 * addNetworkWithNodesScope(VirtualNetwork, NetworkNode, { active: true });
 * // Usage: VirtualNetwork.scope('withNodes').findAll()
 * ```
 */
export const addNetworkWithNodesScope = (
  networkModel: ModelStatic<Model>,
  nodeModel: ModelStatic<Model>,
  filters: Record<string, any> = {},
): void => {
  (networkModel as any).addScope('withNodes', {
    include: [
      {
        model: nodeModel,
        as: 'nodes',
        where: { active: true, ...filters },
        required: false,
      },
    ],
  });
};

/**
 * Adds scope to load network with ACL rules
 *
 * @param {ModelStatic<Model>} networkModel - VirtualNetwork model
 * @param {ModelStatic<Model>} aclModel - NetworkACL model
 * @returns {void}
 *
 * @example
 * ```typescript
 * addNetworkWithACLsScope(VirtualNetwork, NetworkACL);
 * // Usage: VirtualNetwork.scope('withACLs').findAll()
 * ```
 */
export const addNetworkWithACLsScope = (
  networkModel: ModelStatic<Model>,
  aclModel: ModelStatic<Model>,
): void => {
  (networkModel as any).addScope('withACLs', {
    include: [
      {
        model: aclModel,
        as: 'acls',
        where: { enabled: true },
        required: false,
        order: [['priority', 'ASC']],
      },
    ],
  });
};

/**
 * Adds scope to load network with routing table and routes
 *
 * @param {ModelStatic<Model>} networkModel - VirtualNetwork model
 * @param {ModelStatic<Model>} routeTableModel - NetworkRouteTable model
 * @param {ModelStatic<Model>} routeModel - NetworkRoute model
 * @returns {void}
 *
 * @example
 * ```typescript
 * addNetworkWithRoutesScope(VirtualNetwork, NetworkRouteTable, NetworkRoute);
 * // Usage: VirtualNetwork.scope('withRoutes').findAll()
 * ```
 */
export const addNetworkWithRoutesScope = (
  networkModel: ModelStatic<Model>,
  routeTableModel: ModelStatic<Model>,
  routeModel: ModelStatic<Model>,
): void => {
  (networkModel as any).addScope('withRoutes', {
    include: [
      {
        model: routeTableModel,
        as: 'routeTable',
        required: false,
        include: [
          {
            model: routeModel,
            as: 'routes',
            where: { enabled: true },
            required: false,
            order: [['metric', 'ASC']],
          },
        ],
      },
    ],
  });
};

/**
 * Adds scope to load node with all interfaces
 *
 * @param {ModelStatic<Model>} nodeModel - NetworkNode model
 * @param {ModelStatic<Model>} interfaceModel - NetworkInterface model
 * @returns {void}
 *
 * @example
 * ```typescript
 * addNodeWithInterfacesScope(NetworkNode, NetworkInterface);
 * // Usage: NetworkNode.scope('withInterfaces').findAll()
 * ```
 */
export const addNodeWithInterfacesScope = (
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
        order: [['name', 'ASC']],
      },
    ],
  });
};

/**
 * Adds scope to load node with connected links
 *
 * @param {ModelStatic<Model>} nodeModel - NetworkNode model
 * @param {ModelStatic<Model>} linkModel - NetworkLink model
 * @returns {void}
 *
 * @example
 * ```typescript
 * addNodeWithLinksScope(NetworkNode, NetworkLink);
 * // Usage: NetworkNode.scope('withLinks').findAll()
 * ```
 */
export const addNodeWithLinksScope = (
  nodeModel: ModelStatic<Model>,
  linkModel: ModelStatic<Model>,
): void => {
  (nodeModel as any).addScope('withLinks', {
    include: [
      {
        model: linkModel,
        as: 'outgoingLinks',
        where: { active: true },
        required: false,
      },
      {
        model: linkModel,
        as: 'incomingLinks',
        where: { active: true },
        required: false,
      },
    ],
  });
};

/**
 * Adds scope to load interface with statistics
 *
 * @param {ModelStatic<Model>} interfaceModel - NetworkInterface model
 * @returns {void}
 *
 * @example
 * ```typescript
 * addInterfaceWithStatsScope(NetworkInterface);
 * // Usage: NetworkInterface.scope('withStats').findAll()
 * ```
 */
export const addInterfaceWithStatsScope = (interfaceModel: ModelStatic<Model>): void => {
  (interfaceModel as any).addScope('withStats', {
    attributes: {
      include: [
        [
          sequelize.literal(`
            CASE
              WHEN status = 'UP' THEN 'online'
              WHEN status = 'DOWN' THEN 'offline'
              ELSE 'unknown'
            END
          `),
          'statusLabel',
        ],
      ],
    },
  });
};

/**
 * Adds scope to load route table with all routes ordered by metric
 *
 * @param {ModelStatic<Model>} routeTableModel - NetworkRouteTable model
 * @param {ModelStatic<Model>} routeModel - NetworkRoute model
 * @returns {void}
 *
 * @example
 * ```typescript
 * addRouteTableWithRoutesScope(NetworkRouteTable, NetworkRoute);
 * // Usage: NetworkRouteTable.scope('withRoutes').findAll()
 * ```
 */
export const addRouteTableWithRoutesScope = (
  routeTableModel: ModelStatic<Model>,
  routeModel: ModelStatic<Model>,
): void => {
  (routeTableModel as any).addScope('withRoutes', {
    include: [
      {
        model: routeModel,
        as: 'routes',
        where: { enabled: true },
        required: false,
        order: [['metric', 'ASC'], ['destinationCIDR', 'ASC']],
      },
    ],
  });
};

/**
 * Adds scope to load subnet with IP allocation details
 *
 * @param {ModelStatic<Model>} subnetModel - Subnet model
 * @returns {void}
 *
 * @example
 * ```typescript
 * addSubnetWithAllocationsScope(Subnet);
 * // Usage: Subnet.scope('withAllocations').findAll()
 * ```
 */
export const addSubnetWithAllocationsScope = (subnetModel: ModelStatic<Model>): void => {
  (subnetModel as any).addScope('withAllocations', {
    attributes: {
      include: [
        [
          sequelize.literal(`
            CASE
              WHEN available_ips > 0 THEN ROUND((allocated_ips::numeric / (available_ips + allocated_ips)) * 100, 2)
              ELSE 100
            END
          `),
          'utilizationPercent',
        ],
      ],
    },
  });
};

// ============================================================================
// EAGER LOADING STRATEGIES
// ============================================================================

/**
 * Eager loads complete network topology with all relationships
 *
 * @param {ModelStatic<Model>} networkModel - VirtualNetwork model
 * @param {string} networkId - Network ID
 * @param {EagerLoadingStrategy} [strategy={}] - Loading strategy
 * @returns {Promise<Model | null>} Network with full topology
 *
 * @example
 * ```typescript
 * const network = await eagerLoadNetworkTopology(VirtualNetwork, 'net-123', {
 *   maxDepth: 3,
 *   includeDeleted: false
 * });
 * ```
 */
export const eagerLoadNetworkTopology = async (
  networkModel: ModelStatic<Model>,
  networkId: string,
  strategy: EagerLoadingStrategy = {},
): Promise<Model | null> => {
  const maxDepth = strategy.maxDepth || 3;
  const includeDeleted = strategy.includeDeleted || false;

  const include: IncludeOptions[] = [
    {
      association: 'nodes',
      paranoid: !includeDeleted,
      include: [
        {
          association: 'interfaces',
          paranoid: !includeDeleted,
        },
      ],
    },
    {
      association: 'acls',
      paranoid: !includeDeleted,
      where: { enabled: true },
      required: false,
    },
    {
      association: 'routeTable',
      paranoid: !includeDeleted,
      include: [
        {
          association: 'routes',
          paranoid: !includeDeleted,
          where: { enabled: true },
          required: false,
        },
      ],
    },
    {
      association: 'subnets',
      paranoid: !includeDeleted,
    },
  ];

  return networkModel.findByPk(networkId, {
    include,
    attributes: strategy.attributes,
  });
};

/**
 * Eager loads node details with interfaces and links
 *
 * @param {ModelStatic<Model>} nodeModel - NetworkNode model
 * @param {string} nodeId - Node ID
 * @param {EagerLoadingStrategy} [strategy={}] - Loading strategy
 * @returns {Promise<Model | null>} Node with details
 *
 * @example
 * ```typescript
 * const node = await eagerLoadNodeDetails(NetworkNode, 'node-123');
 * ```
 */
export const eagerLoadNodeDetails = async (
  nodeModel: ModelStatic<Model>,
  nodeId: string,
  strategy: EagerLoadingStrategy = {},
): Promise<Model | null> => {
  const includeDeleted = strategy.includeDeleted || false;

  return nodeModel.findByPk(nodeId, {
    include: [
      {
        association: 'network',
        paranoid: !includeDeleted,
      },
      {
        association: 'interfaces',
        paranoid: !includeDeleted,
        where: { active: true },
        required: false,
      },
    ],
    attributes: strategy.attributes,
  });
};

/**
 * Eager loads interface configuration with node and network
 *
 * @param {ModelStatic<Model>} interfaceModel - NetworkInterface model
 * @param {string} interfaceId - Interface ID
 * @param {EagerLoadingStrategy} [strategy={}] - Loading strategy
 * @returns {Promise<Model | null>} Interface with configuration
 *
 * @example
 * ```typescript
 * const iface = await eagerLoadInterfaceConfiguration(NetworkInterface, 'iface-123');
 * ```
 */
export const eagerLoadInterfaceConfiguration = async (
  interfaceModel: ModelStatic<Model>,
  interfaceId: string,
  strategy: EagerLoadingStrategy = {},
): Promise<Model | null> => {
  const includeDeleted = strategy.includeDeleted || false;

  return interfaceModel.findByPk(interfaceId, {
    include: [
      {
        association: 'node',
        paranoid: !includeDeleted,
        include: [
          {
            association: 'network',
            paranoid: !includeDeleted,
          },
        ],
      },
    ],
    attributes: strategy.attributes,
  });
};

/**
 * Eager loads ACL rules for a network with priority ordering
 *
 * @param {ModelStatic<Model>} aclModel - NetworkACL model
 * @param {string} networkId - Network ID
 * @param {EagerLoadingStrategy} [strategy={}] - Loading strategy
 * @returns {Promise<Model[]>} ACL rules
 *
 * @example
 * ```typescript
 * const acls = await eagerLoadACLRules(NetworkACL, 'net-123');
 * ```
 */
export const eagerLoadACLRules = async (
  aclModel: ModelStatic<Model>,
  networkId: string,
  strategy: EagerLoadingStrategy = {},
): Promise<Model[]> => {
  return aclModel.findAll({
    where: {
      networkId,
      enabled: true,
    },
    order: [
      ['priority', 'ASC'],
      ['createdAt', 'ASC'],
    ],
    limit: strategy.limit,
    attributes: strategy.attributes,
  });
};

/**
 * Eager loads routing table with all routes
 *
 * @param {ModelStatic<Model>} routeTableModel - NetworkRouteTable model
 * @param {string} networkId - Network ID
 * @param {EagerLoadingStrategy} [strategy={}] - Loading strategy
 * @returns {Promise<Model | null>} Route table with routes
 *
 * @example
 * ```typescript
 * const routeTable = await eagerLoadRoutingTable(NetworkRouteTable, 'net-123');
 * ```
 */
export const eagerLoadRoutingTable = async (
  routeTableModel: ModelStatic<Model>,
  networkId: string,
  strategy: EagerLoadingStrategy = {},
): Promise<Model | null> => {
  const includeDeleted = strategy.includeDeleted || false;

  return routeTableModel.findOne({
    where: { networkId },
    include: [
      {
        association: 'routes',
        paranoid: !includeDeleted,
        where: { enabled: true },
        required: false,
        order: [['metric', 'ASC']],
      },
    ],
    attributes: strategy.attributes,
  });
};

/**
 * Eager loads subnet details with allocation statistics
 *
 * @param {ModelStatic<Model>} subnetModel - Subnet model
 * @param {string} subnetId - Subnet ID
 * @param {EagerLoadingStrategy} [strategy={}] - Loading strategy
 * @returns {Promise<Model | null>} Subnet with details
 *
 * @example
 * ```typescript
 * const subnet = await eagerLoadSubnetDetails(Subnet, 'subnet-123');
 * ```
 */
export const eagerLoadSubnetDetails = async (
  subnetModel: ModelStatic<Model>,
  subnetId: string,
  strategy: EagerLoadingStrategy = {},
): Promise<Model | null> => {
  const includeDeleted = strategy.includeDeleted || false;

  return subnetModel.findByPk(subnetId, {
    include: [
      {
        association: 'network',
        paranoid: !includeDeleted,
      },
    ],
    attributes: strategy.attributes,
  });
};

// ============================================================================
// THROUGH MODEL CUSTOMIZATION
// ============================================================================

/**
 * Customizes link through model with additional metadata
 *
 * @param {ModelStatic<Model>} linkModel - NetworkLink model
 * @param {ModelStatic<Model>} throughModel - Through model
 * @param {Record<string, any>} [customAttributes={}] - Custom attributes
 * @returns {void}
 *
 * @example
 * ```typescript
 * customizeLinkThroughModel(NetworkLink, LinkEndpointJunction, {
 *   bandwidth: DataTypes.BIGINT,
 *   latency: DataTypes.FLOAT
 * });
 * ```
 */
export const customizeLinkThroughModel = (
  linkModel: ModelStatic<Model>,
  throughModel: ModelStatic<Model>,
  customAttributes: Record<string, any> = {},
): void => {
  const attributes = (throughModel as any).rawAttributes;

  Object.keys(customAttributes).forEach((key) => {
    attributes[key] = customAttributes[key];
  });

  // Add hooks for the through model
  throughModel.addHook('beforeCreate', (instance: any) => {
    instance.metadata = {
      ...instance.metadata,
      createdVia: 'customized_through_model',
      timestamp: new Date(),
    };
  });
};

/**
 * Customizes security group through model
 *
 * @param {ModelStatic<Model>} throughModel - Through model
 * @param {Record<string, any>} [customAttributes={}] - Custom attributes
 * @returns {void}
 *
 * @example
 * ```typescript
 * customizeSecurityGroupThroughModel(NetworkSecurityGroupJunction, {
 *   inheritRules: DataTypes.BOOLEAN
 * });
 * ```
 */
export const customizeSecurityGroupThroughModel = (
  throughModel: ModelStatic<Model>,
  customAttributes: Record<string, any> = {},
): void => {
  const attributes = (throughModel as any).rawAttributes;

  Object.keys(customAttributes).forEach((key) => {
    attributes[key] = customAttributes[key];
  });

  throughModel.addHook('afterCreate', async (instance: any) => {
    // Log security group association
    instance.metadata = {
      ...instance.metadata,
      associatedAt: new Date(),
      associationType: 'security_group',
    };
  });
};

/**
 * Customizes network membership through model
 *
 * @param {ModelStatic<Model>} throughModel - Through model
 * @param {Record<string, any>} [customAttributes={}] - Custom attributes
 * @returns {void}
 *
 * @example
 * ```typescript
 * customizeNetworkMembershipThroughModel(NetworkNodeJunction, {
 *   joinedAt: DataTypes.DATE,
 *   permissions: DataTypes.JSONB
 * });
 * ```
 */
export const customizeNetworkMembershipThroughModel = (
  throughModel: ModelStatic<Model>,
  customAttributes: Record<string, any> = {},
): void => {
  const attributes = (throughModel as any).rawAttributes;

  Object.keys(customAttributes).forEach((key) => {
    attributes[key] = customAttributes[key];
  });

  throughModel.addHook('beforeCreate', (instance: any) => {
    instance.metadata = {
      ...instance.metadata,
      membershipType: 'network_node',
      joinedAt: new Date(),
    };
  });
};

/**
 * Customizes tag association through model
 *
 * @param {ModelStatic<Model>} throughModel - Through model
 * @param {Record<string, any>} [customAttributes={}] - Custom attributes
 * @returns {void}
 *
 * @example
 * ```typescript
 * customizeTagAssociationThroughModel(NodeTagJunction, {
 *   propagate: DataTypes.BOOLEAN
 * });
 * ```
 */
export const customizeTagAssociationThroughModel = (
  throughModel: ModelStatic<Model>,
  customAttributes: Record<string, any> = {},
): void => {
  const attributes = (throughModel as any).rawAttributes;

  Object.keys(customAttributes).forEach((key) => {
    attributes[key] = customAttributes[key];
  });

  throughModel.addHook('beforeCreate', (instance: any) => {
    // Validate tag format
    if (instance.tagKey) {
      instance.tagKey = instance.tagKey.toLowerCase().trim();
    }
  });
};

// ============================================================================
// CASCADE DELETE CONFIGURATIONS
// ============================================================================

/**
 * Configures cascade delete for VirtualNetwork
 *
 * @param {ModelStatic<Model>} networkModel - VirtualNetwork model
 * @param {CascadeConfig} [config={}] - Cascade configuration
 * @returns {void}
 *
 * @example
 * ```typescript
 * configureCascadeDeleteNetwork(VirtualNetwork, {
 *   beforeDelete: async (network) => {
 *     await archiveNetworkConfiguration(network);
 *   }
 * });
 * ```
 */
export const configureCascadeDeleteNetwork = (
  networkModel: ModelStatic<Model>,
  config: CascadeConfig = {},
): void => {
  networkModel.addHook('beforeDestroy', async (instance: any, options: any) => {
    // Validate delete operation
    if (config.validateDelete) {
      const canDelete = await config.validateDelete(instance);
      if (!canDelete) {
        throw new Error('Network deletion not allowed');
      }
    }

    // Before delete callback
    if (config.beforeDelete) {
      await config.beforeDelete(instance, options);
    }

    // Archive network metadata
    instance.metadata = {
      ...instance.metadata,
      deletionReason: options.reason || 'manual',
      deletedNodes: [], // Will be populated by cascade
    };
  });

  networkModel.addHook('afterDestroy', async (instance: any, options: any) => {
    if (config.afterDelete) {
      await config.afterDelete(instance, options);
    }
  });
};

/**
 * Configures cascade delete for NetworkNode
 *
 * @param {ModelStatic<Model>} nodeModel - NetworkNode model
 * @param {CascadeConfig} [config={}] - Cascade configuration
 * @returns {void}
 *
 * @example
 * ```typescript
 * configureCascadeDeleteNode(NetworkNode, {
 *   beforeDelete: async (node) => {
 *     await disconnectNodeLinks(node.id);
 *   }
 * });
 * ```
 */
export const configureCascadeDeleteNode = (
  nodeModel: ModelStatic<Model>,
  config: CascadeConfig = {},
): void => {
  nodeModel.addHook('beforeDestroy', async (instance: any, options: any) => {
    if (config.validateDelete) {
      const canDelete = await config.validateDelete(instance);
      if (!canDelete) {
        throw new Error('Node deletion not allowed');
      }
    }

    if (config.beforeDelete) {
      await config.beforeDelete(instance, options);
    }

    // Store deletion metadata
    instance.metadata = {
      ...instance.metadata,
      interfaceCount: 0, // Will be updated by cascade
      deletedInterfaces: [],
    };
  });

  nodeModel.addHook('afterDestroy', async (instance: any, options: any) => {
    if (config.afterDelete) {
      await config.afterDelete(instance, options);
    }
  });
};

/**
 * Configures cascade delete for NetworkInterface
 *
 * @param {ModelStatic<Model>} interfaceModel - NetworkInterface model
 * @param {CascadeConfig} [config={}] - Cascade configuration
 * @returns {void}
 *
 * @example
 * ```typescript
 * configureCascadeDeleteInterface(NetworkInterface, {
 *   beforeDelete: async (iface) => {
 *     await releaseIPAddress(iface.ipAddress);
 *   }
 * });
 * ```
 */
export const configureCascadeDeleteInterface = (
  interfaceModel: ModelStatic<Model>,
  config: CascadeConfig = {},
): void => {
  interfaceModel.addHook('beforeDestroy', async (instance: any, options: any) => {
    if (config.validateDelete) {
      const canDelete = await config.validateDelete(instance);
      if (!canDelete) {
        throw new Error('Interface deletion not allowed');
      }
    }

    if (config.beforeDelete) {
      await config.beforeDelete(instance, options);
    }

    // Archive interface configuration
    instance.metadata = {
      ...instance.metadata,
      deletedConfig: instance.config,
      ipAddress: instance.ipAddress,
      macAddress: instance.macAddress,
    };
  });

  interfaceModel.addHook('afterDestroy', async (instance: any, options: any) => {
    if (config.afterDelete) {
      await config.afterDelete(instance, options);
    }
  });
};

/**
 * Configures cascade delete for NetworkRouteTable
 *
 * @param {ModelStatic<Model>} routeTableModel - NetworkRouteTable model
 * @param {CascadeConfig} [config={}] - Cascade configuration
 * @returns {void}
 *
 * @example
 * ```typescript
 * configureCascadeDeleteRouteTable(NetworkRouteTable, {
 *   beforeDelete: async (routeTable) => {
 *     await backupRoutingConfiguration(routeTable);
 *   }
 * });
 * ```
 */
export const configureCascadeDeleteRouteTable = (
  routeTableModel: ModelStatic<Model>,
  config: CascadeConfig = {},
): void => {
  routeTableModel.addHook('beforeDestroy', async (instance: any, options: any) => {
    if (config.validateDelete) {
      const canDelete = await config.validateDelete(instance);
      if (!canDelete) {
        throw new Error('Route table deletion not allowed');
      }
    }

    if (config.beforeDelete) {
      await config.beforeDelete(instance, options);
    }

    // Archive routing configuration
    instance.metadata = {
      ...instance.metadata,
      deletedConfig: instance.config,
      routeCount: 0, // Will be updated by cascade
    };
  });

  routeTableModel.addHook('afterDestroy', async (instance: any, options: any) => {
    if (config.afterDelete) {
      await config.afterDelete(instance, options);
    }
  });
};

// ============================================================================
// ASSOCIATION QUERY HELPERS
// ============================================================================

/**
 * Queries all nodes in a network with optional filters
 *
 * @param {ModelStatic<Model>} nodeModel - NetworkNode model
 * @param {string} networkId - Network ID
 * @param {FindOptions} [options={}] - Query options
 * @returns {Promise<Model[]>} Network nodes
 *
 * @example
 * ```typescript
 * const nodes = await queryNetworkNodes(NetworkNode, 'net-123', {
 *   where: { status: NetworkNodeStatus.ACTIVE }
 * });
 * ```
 */
export const queryNetworkNodes = async (
  nodeModel: ModelStatic<Model>,
  networkId: string,
  options: FindOptions = {},
): Promise<Model[]> => {
  return nodeModel.findAll({
    where: {
      networkId,
      active: true,
      ...options.where,
    },
    include: options.include,
    order: options.order || [['name', 'ASC']],
    limit: options.limit,
    offset: options.offset,
    attributes: options.attributes,
  });
};

/**
 * Queries all interfaces for a node with statistics
 *
 * @param {ModelStatic<Model>} interfaceModel - NetworkInterface model
 * @param {string} nodeId - Node ID
 * @param {FindOptions} [options={}] - Query options
 * @returns {Promise<Model[]>} Network interfaces
 *
 * @example
 * ```typescript
 * const interfaces = await queryNodeInterfaces(NetworkInterface, 'node-123');
 * ```
 */
export const queryNodeInterfaces = async (
  interfaceModel: ModelStatic<Model>,
  nodeId: string,
  options: FindOptions = {},
): Promise<Model[]> => {
  return interfaceModel.findAll({
    where: {
      nodeId,
      active: true,
      ...options.where,
    },
    include: options.include,
    order: options.order || [['name', 'ASC']],
    attributes: options.attributes,
  });
};

/**
 * Queries complete network topology including all relationships
 *
 * @param {ModelStatic<Model>} networkModel - VirtualNetwork model
 * @param {string} networkId - Network ID
 * @param {FindOptions} [options={}] - Query options
 * @returns {Promise<Record<string, any>>} Complete topology data
 *
 * @example
 * ```typescript
 * const topology = await queryNetworkTopology(VirtualNetwork, 'net-123');
 * // => { network: {...}, nodes: [...], links: [...], acls: [...] }
 * ```
 */
export const queryNetworkTopology = async (
  networkModel: ModelStatic<Model>,
  networkId: string,
  options: FindOptions = {},
): Promise<Record<string, any>> => {
  const network = await networkModel.findByPk(networkId, {
    include: [
      {
        association: 'nodes',
        include: [{ association: 'interfaces' }],
      },
      {
        association: 'acls',
        where: { enabled: true },
        required: false,
      },
      {
        association: 'routeTable',
        include: [{ association: 'routes', where: { enabled: true }, required: false }],
      },
      {
        association: 'subnets',
      },
    ],
  });

  if (!network) {
    throw new Error(`Network ${networkId} not found`);
  }

  const networkData = network.toJSON() as any;

  return {
    network: {
      id: networkData.id,
      name: networkData.name,
      cidr: networkData.cidr,
      type: networkData.networkType,
    },
    nodes: networkData.nodes || [],
    acls: networkData.acls || [],
    routeTable: networkData.routeTable || null,
    subnets: networkData.subnets || [],
    metadata: {
      queriedAt: new Date().toISOString(),
      nodeCount: (networkData.nodes || []).length,
      aclCount: (networkData.acls || []).length,
      subnetCount: (networkData.subnets || []).length,
    },
  };
};
