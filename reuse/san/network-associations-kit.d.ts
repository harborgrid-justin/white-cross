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
import { Model, ModelStatic, Sequelize, ModelAttributes, Association, FindOptions } from 'sequelize';
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
export declare enum AssociationType {
    HAS_MANY = "HAS_MANY",
    BELONGS_TO = "BELONGS_TO",
    BELONGS_TO_MANY = "BELONGS_TO_MANY",
    HAS_ONE = "HAS_ONE"
}
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
export declare const associateNetworkToNodes: (networkModel: ModelStatic<Model>, nodeModel: ModelStatic<Model>, config?: AssociationConfig) => Association;
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
export declare const associateNodeToInterfaces: (nodeModel: ModelStatic<Model>, interfaceModel: ModelStatic<Model>, config?: AssociationConfig) => Association;
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
export declare const associateLinkToNodes: (linkModel: ModelStatic<Model>, nodeModel: ModelStatic<Model>, config?: AssociationConfig) => Association[];
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
export declare const associateNetworkToACLs: (networkModel: ModelStatic<Model>, aclModel: ModelStatic<Model>, config?: AssociationConfig) => Association;
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
export declare const associateNetworkToRouteTable: (networkModel: ModelStatic<Model>, routeTableModel: ModelStatic<Model>, config?: AssociationConfig) => Association;
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
export declare const associateRouteTableToRoutes: (routeTableModel: ModelStatic<Model>, routeModel: ModelStatic<Model>, config?: AssociationConfig) => Association;
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
export declare const associateNetworkToSubnets: (networkModel: ModelStatic<Model>, subnetModel: ModelStatic<Model>, config?: AssociationConfig) => Association;
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
export declare const associateInterfaceToNode: (interfaceModel: ModelStatic<Model>, nodeModel: ModelStatic<Model>, config?: AssociationConfig) => Association;
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
export declare const associateLinkEndpoints: (linkModel: ModelStatic<Model>, interfaceModel: ModelStatic<Model>, config?: AssociationConfig) => Association[];
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
export declare const associateNodeToNetwork: (nodeModel: ModelStatic<Model>, networkModel: ModelStatic<Model>, config?: AssociationConfig) => Association;
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
export declare const createNetworkNodeJunction: (sequelize: Sequelize, config?: JunctionTableConfig) => ModelStatic<Model>;
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
export declare const createNodeInterfaceJunction: (sequelize: Sequelize, config?: JunctionTableConfig) => ModelStatic<Model>;
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
export declare const createLinkEndpointJunction: (sequelize: Sequelize, config?: JunctionTableConfig) => ModelStatic<Model>;
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
export declare const createNetworkSecurityGroupJunction: (sequelize: Sequelize, config?: JunctionTableConfig) => ModelStatic<Model>;
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
export declare const createNodeTagJunction: (sequelize: Sequelize, config?: JunctionTableConfig) => ModelStatic<Model>;
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
export declare const addNetworkWithNodesScope: (networkModel: ModelStatic<Model>, nodeModel: ModelStatic<Model>, filters?: Record<string, any>) => void;
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
export declare const addNetworkWithACLsScope: (networkModel: ModelStatic<Model>, aclModel: ModelStatic<Model>) => void;
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
export declare const addNetworkWithRoutesScope: (networkModel: ModelStatic<Model>, routeTableModel: ModelStatic<Model>, routeModel: ModelStatic<Model>) => void;
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
export declare const addNodeWithInterfacesScope: (nodeModel: ModelStatic<Model>, interfaceModel: ModelStatic<Model>) => void;
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
export declare const addNodeWithLinksScope: (nodeModel: ModelStatic<Model>, linkModel: ModelStatic<Model>) => void;
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
export declare const addInterfaceWithStatsScope: (interfaceModel: ModelStatic<Model>) => void;
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
export declare const addRouteTableWithRoutesScope: (routeTableModel: ModelStatic<Model>, routeModel: ModelStatic<Model>) => void;
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
export declare const addSubnetWithAllocationsScope: (subnetModel: ModelStatic<Model>) => void;
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
export declare const eagerLoadNetworkTopology: (networkModel: ModelStatic<Model>, networkId: string, strategy?: EagerLoadingStrategy) => Promise<Model | null>;
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
export declare const eagerLoadNodeDetails: (nodeModel: ModelStatic<Model>, nodeId: string, strategy?: EagerLoadingStrategy) => Promise<Model | null>;
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
export declare const eagerLoadInterfaceConfiguration: (interfaceModel: ModelStatic<Model>, interfaceId: string, strategy?: EagerLoadingStrategy) => Promise<Model | null>;
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
export declare const eagerLoadACLRules: (aclModel: ModelStatic<Model>, networkId: string, strategy?: EagerLoadingStrategy) => Promise<Model[]>;
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
export declare const eagerLoadRoutingTable: (routeTableModel: ModelStatic<Model>, networkId: string, strategy?: EagerLoadingStrategy) => Promise<Model | null>;
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
export declare const eagerLoadSubnetDetails: (subnetModel: ModelStatic<Model>, subnetId: string, strategy?: EagerLoadingStrategy) => Promise<Model | null>;
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
export declare const customizeLinkThroughModel: (linkModel: ModelStatic<Model>, throughModel: ModelStatic<Model>, customAttributes?: Record<string, any>) => void;
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
export declare const customizeSecurityGroupThroughModel: (throughModel: ModelStatic<Model>, customAttributes?: Record<string, any>) => void;
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
export declare const customizeNetworkMembershipThroughModel: (throughModel: ModelStatic<Model>, customAttributes?: Record<string, any>) => void;
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
export declare const customizeTagAssociationThroughModel: (throughModel: ModelStatic<Model>, customAttributes?: Record<string, any>) => void;
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
export declare const configureCascadeDeleteNetwork: (networkModel: ModelStatic<Model>, config?: CascadeConfig) => void;
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
export declare const configureCascadeDeleteNode: (nodeModel: ModelStatic<Model>, config?: CascadeConfig) => void;
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
export declare const configureCascadeDeleteInterface: (interfaceModel: ModelStatic<Model>, config?: CascadeConfig) => void;
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
export declare const configureCascadeDeleteRouteTable: (routeTableModel: ModelStatic<Model>, config?: CascadeConfig) => void;
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
export declare const queryNetworkNodes: (nodeModel: ModelStatic<Model>, networkId: string, options?: FindOptions) => Promise<Model[]>;
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
export declare const queryNodeInterfaces: (interfaceModel: ModelStatic<Model>, nodeId: string, options?: FindOptions) => Promise<Model[]>;
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
export declare const queryNetworkTopology: (networkModel: ModelStatic<Model>, networkId: string, options?: FindOptions) => Promise<Record<string, any>>;
//# sourceMappingURL=network-associations-kit.d.ts.map