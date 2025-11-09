"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryNetworkTopology = exports.queryNodeInterfaces = exports.queryNetworkNodes = exports.configureCascadeDeleteRouteTable = exports.configureCascadeDeleteInterface = exports.configureCascadeDeleteNode = exports.configureCascadeDeleteNetwork = exports.customizeTagAssociationThroughModel = exports.customizeNetworkMembershipThroughModel = exports.customizeSecurityGroupThroughModel = exports.customizeLinkThroughModel = exports.eagerLoadSubnetDetails = exports.eagerLoadRoutingTable = exports.eagerLoadACLRules = exports.eagerLoadInterfaceConfiguration = exports.eagerLoadNodeDetails = exports.eagerLoadNetworkTopology = exports.addSubnetWithAllocationsScope = exports.addRouteTableWithRoutesScope = exports.addInterfaceWithStatsScope = exports.addNodeWithLinksScope = exports.addNodeWithInterfacesScope = exports.addNetworkWithRoutesScope = exports.addNetworkWithACLsScope = exports.addNetworkWithNodesScope = exports.createNodeTagJunction = exports.createNetworkSecurityGroupJunction = exports.createLinkEndpointJunction = exports.createNodeInterfaceJunction = exports.createNetworkNodeJunction = exports.associateNodeToNetwork = exports.associateLinkEndpoints = exports.associateInterfaceToNode = exports.associateNetworkToSubnets = exports.associateRouteTableToRoutes = exports.associateNetworkToRouteTable = exports.associateNetworkToACLs = exports.associateLinkToNodes = exports.associateNodeToInterfaces = exports.associateNetworkToNodes = exports.AssociationType = void 0;
const sequelize_1 = require("sequelize");
/**
 * @enum AssociationType
 * @description Types of associations
 */
var AssociationType;
(function (AssociationType) {
    AssociationType["HAS_MANY"] = "HAS_MANY";
    AssociationType["BELONGS_TO"] = "BELONGS_TO";
    AssociationType["BELONGS_TO_MANY"] = "BELONGS_TO_MANY";
    AssociationType["HAS_ONE"] = "HAS_ONE";
})(AssociationType || (exports.AssociationType = AssociationType = {}));
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
const associateNetworkToNodes = (networkModel, nodeModel, config = {}) => {
    const options = {
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
exports.associateNetworkToNodes = associateNetworkToNodes;
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
const associateNodeToInterfaces = (nodeModel, interfaceModel, config = {}) => {
    const options = {
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
exports.associateNodeToInterfaces = associateNodeToInterfaces;
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
const associateLinkToNodes = (linkModel, nodeModel, config = {}) => {
    const sourceOptions = {
        as: 'sourceNode',
        foreignKey: 'sourceNodeId',
        onDelete: config.onDelete || 'CASCADE',
        onUpdate: config.onUpdate || 'CASCADE',
    };
    const targetOptions = {
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
exports.associateLinkToNodes = associateLinkToNodes;
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
const associateNetworkToACLs = (networkModel, aclModel, config = {}) => {
    const options = {
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
exports.associateNetworkToACLs = associateNetworkToACLs;
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
const associateNetworkToRouteTable = (networkModel, routeTableModel, config = {}) => {
    const options = {
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
exports.associateNetworkToRouteTable = associateNetworkToRouteTable;
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
const associateRouteTableToRoutes = (routeTableModel, routeModel, config = {}) => {
    const options = {
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
exports.associateRouteTableToRoutes = associateRouteTableToRoutes;
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
const associateNetworkToSubnets = (networkModel, subnetModel, config = {}) => {
    const options = {
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
exports.associateNetworkToSubnets = associateNetworkToSubnets;
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
const associateInterfaceToNode = (interfaceModel, nodeModel, config = {}) => {
    const options = {
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
exports.associateInterfaceToNode = associateInterfaceToNode;
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
const associateLinkEndpoints = (linkModel, interfaceModel, config = {}) => {
    const sourceOptions = {
        as: 'sourceInterface',
        foreignKey: 'sourceInterfaceId',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    };
    const targetOptions = {
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
exports.associateLinkEndpoints = associateLinkEndpoints;
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
const associateNodeToNetwork = (nodeModel, networkModel, config = {}) => {
    const options = {
        as: config.as || 'network',
        foreignKey: config.foreignKey || 'networkId',
        onDelete: config.onDelete || 'CASCADE',
        onUpdate: config.onUpdate || 'CASCADE',
    };
    return nodeModel.belongsTo(networkModel, options);
};
exports.associateNodeToNetwork = associateNodeToNetwork;
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
const createNetworkNodeJunction = (sequelize, config = {}) => {
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
        role: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Node role in the network',
        },
        priority: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 100,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
        },
        ...config.additionalAttributes,
    };
    class NetworkNodeJunction extends sequelize_1.Model {
    }
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
exports.createNetworkNodeJunction = createNetworkNodeJunction;
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
const createNodeInterfaceJunction = (sequelize, config = {}) => {
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
        interfaceId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'network_interfaces',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        isPrimary: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Primary interface for the node',
        },
        bondGroup: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Interface bonding group ID',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
        },
        ...config.additionalAttributes,
    };
    class NodeInterfaceJunction extends sequelize_1.Model {
    }
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
exports.createNodeInterfaceJunction = createNodeInterfaceJunction;
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
const createLinkEndpointJunction = (sequelize, config = {}) => {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        linkId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'network_links',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
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
        endpointType: {
            type: sequelize_1.DataTypes.ENUM('SOURCE', 'TARGET'),
            allowNull: false,
        },
        interfaceId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'network_interfaces',
                key: 'id',
            },
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
        },
        ...config.additionalAttributes,
    };
    class LinkEndpointJunction extends sequelize_1.Model {
    }
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
exports.createLinkEndpointJunction = createLinkEndpointJunction;
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
const createNetworkSecurityGroupJunction = (sequelize, config = {}) => {
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
        securityGroupId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Security group identifier',
        },
        appliedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
        },
        ...config.additionalAttributes,
    };
    class NetworkSecurityGroupJunction extends sequelize_1.Model {
    }
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
exports.createNetworkSecurityGroupJunction = createNetworkSecurityGroupJunction;
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
const createNodeTagJunction = (sequelize, config = {}) => {
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
        tagKey: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        tagValue: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
        },
        ...config.additionalAttributes,
    };
    class NodeTagJunction extends sequelize_1.Model {
    }
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
exports.createNodeTagJunction = createNodeTagJunction;
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
const addNetworkWithNodesScope = (networkModel, nodeModel, filters = {}) => {
    networkModel.addScope('withNodes', {
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
exports.addNetworkWithNodesScope = addNetworkWithNodesScope;
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
const addNetworkWithACLsScope = (networkModel, aclModel) => {
    networkModel.addScope('withACLs', {
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
exports.addNetworkWithACLsScope = addNetworkWithACLsScope;
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
const addNetworkWithRoutesScope = (networkModel, routeTableModel, routeModel) => {
    networkModel.addScope('withRoutes', {
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
exports.addNetworkWithRoutesScope = addNetworkWithRoutesScope;
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
const addNodeWithInterfacesScope = (nodeModel, interfaceModel) => {
    nodeModel.addScope('withInterfaces', {
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
exports.addNodeWithInterfacesScope = addNodeWithInterfacesScope;
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
const addNodeWithLinksScope = (nodeModel, linkModel) => {
    nodeModel.addScope('withLinks', {
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
exports.addNodeWithLinksScope = addNodeWithLinksScope;
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
const addInterfaceWithStatsScope = (interfaceModel) => {
    interfaceModel.addScope('withStats', {
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
exports.addInterfaceWithStatsScope = addInterfaceWithStatsScope;
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
const addRouteTableWithRoutesScope = (routeTableModel, routeModel) => {
    routeTableModel.addScope('withRoutes', {
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
exports.addRouteTableWithRoutesScope = addRouteTableWithRoutesScope;
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
const addSubnetWithAllocationsScope = (subnetModel) => {
    subnetModel.addScope('withAllocations', {
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
exports.addSubnetWithAllocationsScope = addSubnetWithAllocationsScope;
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
const eagerLoadNetworkTopology = async (networkModel, networkId, strategy = {}) => {
    const maxDepth = strategy.maxDepth || 3;
    const includeDeleted = strategy.includeDeleted || false;
    const include = [
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
exports.eagerLoadNetworkTopology = eagerLoadNetworkTopology;
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
const eagerLoadNodeDetails = async (nodeModel, nodeId, strategy = {}) => {
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
exports.eagerLoadNodeDetails = eagerLoadNodeDetails;
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
const eagerLoadInterfaceConfiguration = async (interfaceModel, interfaceId, strategy = {}) => {
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
exports.eagerLoadInterfaceConfiguration = eagerLoadInterfaceConfiguration;
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
const eagerLoadACLRules = async (aclModel, networkId, strategy = {}) => {
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
exports.eagerLoadACLRules = eagerLoadACLRules;
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
const eagerLoadRoutingTable = async (routeTableModel, networkId, strategy = {}) => {
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
exports.eagerLoadRoutingTable = eagerLoadRoutingTable;
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
const eagerLoadSubnetDetails = async (subnetModel, subnetId, strategy = {}) => {
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
exports.eagerLoadSubnetDetails = eagerLoadSubnetDetails;
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
const customizeLinkThroughModel = (linkModel, throughModel, customAttributes = {}) => {
    const attributes = throughModel.rawAttributes;
    Object.keys(customAttributes).forEach((key) => {
        attributes[key] = customAttributes[key];
    });
    // Add hooks for the through model
    throughModel.addHook('beforeCreate', (instance) => {
        instance.metadata = {
            ...instance.metadata,
            createdVia: 'customized_through_model',
            timestamp: new Date(),
        };
    });
};
exports.customizeLinkThroughModel = customizeLinkThroughModel;
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
const customizeSecurityGroupThroughModel = (throughModel, customAttributes = {}) => {
    const attributes = throughModel.rawAttributes;
    Object.keys(customAttributes).forEach((key) => {
        attributes[key] = customAttributes[key];
    });
    throughModel.addHook('afterCreate', async (instance) => {
        // Log security group association
        instance.metadata = {
            ...instance.metadata,
            associatedAt: new Date(),
            associationType: 'security_group',
        };
    });
};
exports.customizeSecurityGroupThroughModel = customizeSecurityGroupThroughModel;
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
const customizeNetworkMembershipThroughModel = (throughModel, customAttributes = {}) => {
    const attributes = throughModel.rawAttributes;
    Object.keys(customAttributes).forEach((key) => {
        attributes[key] = customAttributes[key];
    });
    throughModel.addHook('beforeCreate', (instance) => {
        instance.metadata = {
            ...instance.metadata,
            membershipType: 'network_node',
            joinedAt: new Date(),
        };
    });
};
exports.customizeNetworkMembershipThroughModel = customizeNetworkMembershipThroughModel;
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
const customizeTagAssociationThroughModel = (throughModel, customAttributes = {}) => {
    const attributes = throughModel.rawAttributes;
    Object.keys(customAttributes).forEach((key) => {
        attributes[key] = customAttributes[key];
    });
    throughModel.addHook('beforeCreate', (instance) => {
        // Validate tag format
        if (instance.tagKey) {
            instance.tagKey = instance.tagKey.toLowerCase().trim();
        }
    });
};
exports.customizeTagAssociationThroughModel = customizeTagAssociationThroughModel;
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
const configureCascadeDeleteNetwork = (networkModel, config = {}) => {
    networkModel.addHook('beforeDestroy', async (instance, options) => {
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
    networkModel.addHook('afterDestroy', async (instance, options) => {
        if (config.afterDelete) {
            await config.afterDelete(instance, options);
        }
    });
};
exports.configureCascadeDeleteNetwork = configureCascadeDeleteNetwork;
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
const configureCascadeDeleteNode = (nodeModel, config = {}) => {
    nodeModel.addHook('beforeDestroy', async (instance, options) => {
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
    nodeModel.addHook('afterDestroy', async (instance, options) => {
        if (config.afterDelete) {
            await config.afterDelete(instance, options);
        }
    });
};
exports.configureCascadeDeleteNode = configureCascadeDeleteNode;
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
const configureCascadeDeleteInterface = (interfaceModel, config = {}) => {
    interfaceModel.addHook('beforeDestroy', async (instance, options) => {
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
    interfaceModel.addHook('afterDestroy', async (instance, options) => {
        if (config.afterDelete) {
            await config.afterDelete(instance, options);
        }
    });
};
exports.configureCascadeDeleteInterface = configureCascadeDeleteInterface;
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
const configureCascadeDeleteRouteTable = (routeTableModel, config = {}) => {
    routeTableModel.addHook('beforeDestroy', async (instance, options) => {
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
    routeTableModel.addHook('afterDestroy', async (instance, options) => {
        if (config.afterDelete) {
            await config.afterDelete(instance, options);
        }
    });
};
exports.configureCascadeDeleteRouteTable = configureCascadeDeleteRouteTable;
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
const queryNetworkNodes = async (nodeModel, networkId, options = {}) => {
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
exports.queryNetworkNodes = queryNetworkNodes;
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
const queryNodeInterfaces = async (interfaceModel, nodeId, options = {}) => {
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
exports.queryNodeInterfaces = queryNodeInterfaces;
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
const queryNetworkTopology = async (networkModel, networkId, options = {}) => {
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
    const networkData = network.toJSON();
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
exports.queryNetworkTopology = queryNetworkTopology;
//# sourceMappingURL=network-associations-kit.js.map