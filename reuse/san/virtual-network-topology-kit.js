"use strict";
/**
 * LOC: VN-TOPO-001
 * File: /reuse/san/virtual-network-topology-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize
 *   - @types/sequelize
 *
 * DOWNSTREAM (imported by):
 *   - SAN network topology services
 *   - Virtual network management controllers
 *   - Network visualization components
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateIPAddressPlan = exports.calculateNetworkCapacity = exports.findAvailableIPs = exports.validateIPAllocation = exports.allocateIPRange = exports.calculateSubnetMask = exports.mergeVLANSegments = exports.calculateVLANUtilization = exports.validateVLANIsolation = exports.assignNodeToVLAN = exports.createVLANSegment = exports.optimizeForResilience = exports.minimizeLatency = exports.consolidateNetworkPaths = exports.suggestTopologyImprovements = exports.balanceNetworkLoad = exports.optimizeNetworkTopology = exports.checkLoopFreeTopology = exports.validateRedundancy = exports.detectOrphanedNodes = exports.validateBandwidthConstraints = exports.checkConnectivity = exports.validateTopologyIntegrity = exports.optimizeLinkRouting = exports.findRedundantLinks = exports.calculateLinkUtilization = exports.validateLinkCapacity = exports.deleteLinkConnection = exports.updateLinkMetrics = exports.createNetworkLink = exports.assignNodeRole = exports.validateNodeConfiguration = exports.getNodeNeighbors = exports.getNodesByType = exports.deleteNetworkNode = exports.updateNetworkNode = exports.createNetworkNode = exports.findCriticalNodes = exports.detectCycles = exports.calculateMinimumSpanningTree = exports.findAllPaths = exports.findShortestPath = exports.createNetworkLinkModel = exports.createNetworkNodeModel = exports.createNetworkTopologyModel = void 0;
/**
 * File: /reuse/san/virtual-network-topology-kit.ts
 * Locator: WC-SAN-TOPO-001
 * Purpose: Comprehensive Virtual Network Topology Management - graph algorithms, node/link management, validation, optimization
 *
 * Upstream: Independent utility module for virtual network topology
 * Downstream: ../backend/san/*, network controllers, topology services
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 45+ utility functions for network topology, graph algorithms, VLAN management, IP allocation
 *
 * LLM Context: Enterprise-grade virtual network topology toolkit for software-defined networks (SDN).
 * Provides graph algorithms (shortest path, spanning tree), network node/link management, topology validation,
 * optimization, VLAN segmentation, subnet calculation, and IP allocation. Essential for SAN infrastructure.
 */
const sequelize_1 = require("sequelize");
// ============================================================================
// SEQUELIZE MODELS (1-3)
// ============================================================================
/**
 * Sequelize model for Network Topology with nodes and links.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} NetworkTopology model
 *
 * @example
 * ```typescript
 * const Topology = createNetworkTopologyModel(sequelize);
 * const topology = await Topology.create({
 *   name: 'Production Network',
 *   description: 'Main production virtual network',
 *   tenantId: 'tenant-123',
 *   metadata: { region: 'us-east-1' }
 * });
 * ```
 */
const createNetworkTopologyModel = (sequelize) => {
    class NetworkTopology extends sequelize_1.Model {
    }
    NetworkTopology.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Network topology name',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Topology description',
        },
        tenantId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Tenant identifier',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('active', 'inactive', 'maintenance'),
            allowNull: false,
            defaultValue: 'active',
            comment: 'Topology status',
        },
    }, {
        sequelize,
        tableName: 'network_topologies',
        timestamps: true,
        indexes: [
            { fields: ['tenantId'] },
            { fields: ['status'] },
            { fields: ['name'] },
        ],
    });
    return NetworkTopology;
};
exports.createNetworkTopologyModel = createNetworkTopologyModel;
/**
 * Sequelize model for Network Nodes (switches, routers, endpoints).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} NetworkNode model
 *
 * @example
 * ```typescript
 * const Node = createNetworkNodeModel(sequelize);
 * const node = await Node.create({
 *   topologyId: 'topo-123',
 *   name: 'Core-Switch-01',
 *   type: 'switch',
 *   ipAddress: '10.0.1.1',
 *   capacity: 10000,
 *   metadata: { manufacturer: 'Cisco' }
 * });
 * ```
 */
const createNetworkNodeModel = (sequelize) => {
    class NetworkNode extends sequelize_1.Model {
    }
    NetworkNode.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        topologyId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Parent topology ID',
        },
        name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Node name',
        },
        type: {
            type: sequelize_1.DataTypes.ENUM('switch', 'router', 'endpoint', 'gateway', 'firewall', 'load-balancer'),
            allowNull: false,
            comment: 'Node type',
        },
        ipAddress: {
            type: sequelize_1.DataTypes.STRING(45),
            allowNull: true,
            comment: 'IP address (IPv4 or IPv6)',
        },
        macAddress: {
            type: sequelize_1.DataTypes.STRING(17),
            allowNull: true,
            comment: 'MAC address',
        },
        location: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true,
            comment: '3D coordinates {x, y, z}',
        },
        capacity: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1000,
            comment: 'Node capacity (Mbps)',
        },
        utilization: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0,
            comment: 'Current utilization (0-100%)',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('active', 'inactive', 'maintenance', 'failed'),
            allowNull: false,
            defaultValue: 'active',
            comment: 'Node status',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'network_nodes',
        timestamps: true,
        indexes: [
            { fields: ['topologyId'] },
            { fields: ['type'] },
            { fields: ['status'] },
            { fields: ['ipAddress'] },
        ],
    });
    return NetworkNode;
};
exports.createNetworkNodeModel = createNetworkNodeModel;
/**
 * Sequelize model for Network Links (connections between nodes).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} NetworkLink model
 *
 * @example
 * ```typescript
 * const Link = createNetworkLinkModel(sequelize);
 * const link = await Link.create({
 *   topologyId: 'topo-123',
 *   sourceNodeId: 'node-1',
 *   targetNodeId: 'node-2',
 *   bandwidth: 10000,
 *   latency: 5,
 *   cost: 10
 * });
 * ```
 */
const createNetworkLinkModel = (sequelize) => {
    class NetworkLink extends sequelize_1.Model {
    }
    NetworkLink.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        topologyId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Parent topology ID',
        },
        sourceNodeId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Source node ID',
        },
        targetNodeId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Target node ID',
        },
        bandwidth: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1000,
            comment: 'Link bandwidth (Mbps)',
        },
        latency: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 1,
            comment: 'Link latency (ms)',
        },
        cost: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            comment: 'Link cost metric',
        },
        utilization: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0,
            comment: 'Current utilization (0-100%)',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('up', 'down', 'degraded'),
            allowNull: false,
            defaultValue: 'up',
            comment: 'Link status',
        },
        protocol: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Protocol (e.g., BGP, OSPF)',
        },
        vlanIds: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Associated VLAN IDs',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'network_links',
        timestamps: true,
        indexes: [
            { fields: ['topologyId'] },
            { fields: ['sourceNodeId'] },
            { fields: ['targetNodeId'] },
            { fields: ['status'] },
        ],
    });
    return NetworkLink;
};
exports.createNetworkLinkModel = createNetworkLinkModel;
// ============================================================================
// GRAPH ALGORITHMS (4-8)
// ============================================================================
/**
 * Finds shortest path between two nodes using Dijkstra's algorithm.
 *
 * @param {TopologyGraph} graph - Network topology graph
 * @param {string} sourceId - Source node ID
 * @param {string} targetId - Target node ID
 * @param {string} [metric='cost'] - Metric to optimize (cost, latency, hops)
 * @returns {NetworkPath | null} Shortest path or null if no path exists
 *
 * @example
 * ```typescript
 * const path = findShortestPath(graph, 'node-1', 'node-5', 'latency');
 * console.log(path.nodes); // ['node-1', 'node-3', 'node-5']
 * console.log(path.totalLatency); // 12.5
 * ```
 */
const findShortestPath = (graph, sourceId, targetId, metric = 'cost') => {
    const distances = new Map();
    const previous = new Map();
    const unvisited = new Set(graph.nodes.keys());
    // Initialize distances
    for (const nodeId of graph.nodes.keys()) {
        distances.set(nodeId, nodeId === sourceId ? 0 : Infinity);
        previous.set(nodeId, null);
    }
    while (unvisited.size > 0) {
        // Find node with minimum distance
        let currentId = null;
        let minDistance = Infinity;
        for (const nodeId of unvisited) {
            const dist = distances.get(nodeId);
            if (dist < minDistance) {
                minDistance = dist;
                currentId = nodeId;
            }
        }
        if (currentId === null || minDistance === Infinity)
            break;
        if (currentId === targetId)
            break;
        unvisited.delete(currentId);
        // Update neighbors
        const neighbors = graph.adjacencyList.get(currentId) || new Set();
        for (const neighborId of neighbors) {
            if (!unvisited.has(neighborId))
                continue;
            const link = findLinkBetween(graph, currentId, neighborId);
            if (!link || link.status !== 'up')
                continue;
            const weight = metric === 'latency' ? link.latency : metric === 'hops' ? 1 : link.cost;
            const alt = distances.get(currentId) + weight;
            if (alt < distances.get(neighborId)) {
                distances.set(neighborId, alt);
                previous.set(neighborId, currentId);
            }
        }
    }
    // Reconstruct path
    if (distances.get(targetId) === Infinity)
        return null;
    const path = [];
    let current = targetId;
    while (current !== null) {
        path.unshift(current);
        current = previous.get(current);
    }
    // Calculate path metrics
    const links = [];
    let totalCost = 0;
    let totalLatency = 0;
    let minBandwidth = Infinity;
    for (let i = 0; i < path.length - 1; i++) {
        const link = findLinkBetween(graph, path[i], path[i + 1]);
        links.push(link.id);
        totalCost += link.cost;
        totalLatency += link.latency;
        minBandwidth = Math.min(minBandwidth, link.bandwidth);
    }
    return {
        nodes: path,
        links,
        totalCost,
        totalLatency,
        bandwidth: minBandwidth,
        hops: path.length - 1,
    };
};
exports.findShortestPath = findShortestPath;
/**
 * Finds all paths between two nodes (with max depth limit).
 *
 * @param {TopologyGraph} graph - Network topology graph
 * @param {string} sourceId - Source node ID
 * @param {string} targetId - Target node ID
 * @param {number} [maxHops=10] - Maximum number of hops
 * @returns {NetworkPath[]} Array of all paths
 *
 * @example
 * ```typescript
 * const paths = findAllPaths(graph, 'node-1', 'node-5', 5);
 * console.log(paths.length); // 3 paths found
 * ```
 */
const findAllPaths = (graph, sourceId, targetId, maxHops = 10) => {
    const allPaths = [];
    const dfs = (currentId, visited, path) => {
        if (path.length > maxHops)
            return;
        if (currentId === targetId) {
            allPaths.push(buildPathFromNodes(graph, path));
            return;
        }
        const neighbors = graph.adjacencyList.get(currentId) || new Set();
        for (const neighborId of neighbors) {
            if (visited.has(neighborId))
                continue;
            const link = findLinkBetween(graph, currentId, neighborId);
            if (!link || link.status !== 'up')
                continue;
            visited.add(neighborId);
            path.push(neighborId);
            dfs(neighborId, visited, path);
            path.pop();
            visited.delete(neighborId);
        }
    };
    const visited = new Set([sourceId]);
    dfs(sourceId, visited, [sourceId]);
    return allPaths;
};
exports.findAllPaths = findAllPaths;
/**
 * Calculates minimum spanning tree using Kruskal's algorithm.
 *
 * @param {TopologyGraph} graph - Network topology graph
 * @returns {NetworkLink[]} Links forming minimum spanning tree
 *
 * @example
 * ```typescript
 * const mst = calculateMinimumSpanningTree(graph);
 * console.log(mst.length); // Number of links in MST
 * ```
 */
const calculateMinimumSpanningTree = (graph) => {
    const edges = Array.from(graph.links.values()).sort((a, b) => a.cost - b.cost);
    const parent = new Map();
    const rank = new Map();
    // Initialize union-find
    for (const nodeId of graph.nodes.keys()) {
        parent.set(nodeId, nodeId);
        rank.set(nodeId, 0);
    }
    const find = (nodeId) => {
        if (parent.get(nodeId) !== nodeId) {
            parent.set(nodeId, find(parent.get(nodeId)));
        }
        return parent.get(nodeId);
    };
    const union = (node1, node2) => {
        const root1 = find(node1);
        const root2 = find(node2);
        if (root1 === root2)
            return false;
        const rank1 = rank.get(root1);
        const rank2 = rank.get(root2);
        if (rank1 < rank2) {
            parent.set(root1, root2);
        }
        else if (rank1 > rank2) {
            parent.set(root2, root1);
        }
        else {
            parent.set(root2, root1);
            rank.set(root1, rank1 + 1);
        }
        return true;
    };
    const mst = [];
    for (const edge of edges) {
        if (union(edge.sourceNodeId, edge.targetNodeId)) {
            mst.push(edge);
            if (mst.length === graph.nodes.size - 1)
                break;
        }
    }
    return mst;
};
exports.calculateMinimumSpanningTree = calculateMinimumSpanningTree;
/**
 * Detects cycles in the network topology.
 *
 * @param {TopologyGraph} graph - Network topology graph
 * @returns {string[][]} Array of cycles (each cycle is array of node IDs)
 *
 * @example
 * ```typescript
 * const cycles = detectCycles(graph);
 * if (cycles.length > 0) {
 *   console.log('Cycle detected:', cycles[0]);
 * }
 * ```
 */
const detectCycles = (graph) => {
    const visited = new Set();
    const recursionStack = new Set();
    const cycles = [];
    const dfs = (nodeId, path) => {
        visited.add(nodeId);
        recursionStack.add(nodeId);
        path.push(nodeId);
        const neighbors = graph.adjacencyList.get(nodeId) || new Set();
        for (const neighborId of neighbors) {
            if (!visited.has(neighborId)) {
                dfs(neighborId, [...path]);
            }
            else if (recursionStack.has(neighborId)) {
                // Cycle found
                const cycleStart = path.indexOf(neighborId);
                if (cycleStart !== -1) {
                    cycles.push([...path.slice(cycleStart), neighborId]);
                }
            }
        }
        recursionStack.delete(nodeId);
    };
    for (const nodeId of graph.nodes.keys()) {
        if (!visited.has(nodeId)) {
            dfs(nodeId, []);
        }
    }
    return cycles;
};
exports.detectCycles = detectCycles;
/**
 * Finds critical nodes (articulation points) whose removal disconnects the network.
 *
 * @param {TopologyGraph} graph - Network topology graph
 * @returns {string[]} Array of critical node IDs
 *
 * @example
 * ```typescript
 * const critical = findCriticalNodes(graph);
 * console.log(`Found ${critical.length} critical nodes`);
 * ```
 */
const findCriticalNodes = (graph) => {
    const visited = new Set();
    const disc = new Map();
    const low = new Map();
    const parent = new Map();
    const articulationPoints = new Set();
    let time = 0;
    const dfs = (nodeId) => {
        let children = 0;
        visited.add(nodeId);
        disc.set(nodeId, time);
        low.set(nodeId, time);
        time++;
        const neighbors = graph.adjacencyList.get(nodeId) || new Set();
        for (const neighborId of neighbors) {
            if (!visited.has(neighborId)) {
                children++;
                parent.set(neighborId, nodeId);
                dfs(neighborId);
                low.set(nodeId, Math.min(low.get(nodeId), low.get(neighborId)));
                // Check articulation point conditions
                if (parent.get(nodeId) === null && children > 1) {
                    articulationPoints.add(nodeId);
                }
                if (parent.get(nodeId) !== null && low.get(neighborId) >= disc.get(nodeId)) {
                    articulationPoints.add(nodeId);
                }
            }
            else if (neighborId !== parent.get(nodeId)) {
                low.set(nodeId, Math.min(low.get(nodeId), disc.get(neighborId)));
            }
        }
    };
    for (const nodeId of graph.nodes.keys()) {
        if (!visited.has(nodeId)) {
            parent.set(nodeId, null);
            dfs(nodeId);
        }
    }
    return Array.from(articulationPoints);
};
exports.findCriticalNodes = findCriticalNodes;
// ============================================================================
// NODE MANAGEMENT (9-15)
// ============================================================================
/**
 * Creates a new network node.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<NetworkNode>} nodeData - Node data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<NetworkNode>} Created node
 *
 * @example
 * ```typescript
 * const node = await createNetworkNode(sequelize, {
 *   topologyId: 'topo-123',
 *   name: 'Router-01',
 *   type: 'router',
 *   ipAddress: '10.0.1.1',
 *   capacity: 10000
 * });
 * ```
 */
const createNetworkNode = async (sequelize, nodeData, transaction) => {
    const NodeModel = sequelize.models.NetworkNode;
    return NodeModel.create(nodeData, { transaction });
};
exports.createNetworkNode = createNetworkNode;
/**
 * Updates network node configuration.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} nodeId - Node ID
 * @param {Partial<NetworkNode>} updates - Fields to update
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<NetworkNode>} Updated node
 *
 * @example
 * ```typescript
 * const updated = await updateNetworkNode(sequelize, 'node-123', {
 *   utilization: 75.5,
 *   status: 'active'
 * });
 * ```
 */
const updateNetworkNode = async (sequelize, nodeId, updates, transaction) => {
    const NodeModel = sequelize.models.NetworkNode;
    const node = await NodeModel.findByPk(nodeId, { transaction });
    if (!node)
        throw new Error(`Node ${nodeId} not found`);
    await node.update(updates, { transaction });
    return node;
};
exports.updateNetworkNode = updateNetworkNode;
/**
 * Deletes a network node and its connections.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} nodeId - Node ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await deleteNetworkNode(sequelize, 'node-123');
 * ```
 */
const deleteNetworkNode = async (sequelize, nodeId, transaction) => {
    const NodeModel = sequelize.models.NetworkNode;
    const LinkModel = sequelize.models.NetworkLink;
    // Delete associated links
    await LinkModel.destroy({
        where: {
            [sequelize_1.Op.or]: [{ sourceNodeId: nodeId }, { targetNodeId: nodeId }],
        },
        transaction,
    });
    // Delete node
    await NodeModel.destroy({ where: { id: nodeId }, transaction });
};
exports.deleteNetworkNode = deleteNetworkNode;
/**
 * Gets nodes by type.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} topologyId - Topology ID
 * @param {string} type - Node type
 * @returns {Promise<NetworkNode[]>} Nodes of specified type
 *
 * @example
 * ```typescript
 * const routers = await getNodesByType(sequelize, 'topo-123', 'router');
 * ```
 */
const getNodesByType = async (sequelize, topologyId, type) => {
    const NodeModel = sequelize.models.NetworkNode;
    return NodeModel.findAll({ where: { topologyId, type } });
};
exports.getNodesByType = getNodesByType;
/**
 * Gets neighboring nodes for a given node.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} nodeId - Node ID
 * @returns {Promise<NetworkNode[]>} Neighboring nodes
 *
 * @example
 * ```typescript
 * const neighbors = await getNodeNeighbors(sequelize, 'node-123');
 * ```
 */
const getNodeNeighbors = async (sequelize, nodeId) => {
    const LinkModel = sequelize.models.NetworkLink;
    const NodeModel = sequelize.models.NetworkNode;
    const links = await LinkModel.findAll({
        where: {
            [sequelize_1.Op.or]: [{ sourceNodeId: nodeId }, { targetNodeId: nodeId }],
        },
    });
    const neighborIds = new Set();
    links.forEach((link) => {
        if (link.sourceNodeId !== nodeId)
            neighborIds.add(link.sourceNodeId);
        if (link.targetNodeId !== nodeId)
            neighborIds.add(link.targetNodeId);
    });
    return NodeModel.findAll({ where: { id: Array.from(neighborIds) } });
};
exports.getNodeNeighbors = getNodeNeighbors;
/**
 * Validates node configuration.
 *
 * @param {NetworkNode} node - Node to validate
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const result = validateNodeConfiguration(node);
 * if (!result.valid) {
 *   console.error('Errors:', result.errors);
 * }
 * ```
 */
const validateNodeConfiguration = (node) => {
    const errors = [];
    if (!node.name || node.name.trim() === '') {
        errors.push('Node name is required');
    }
    if (!['switch', 'router', 'endpoint', 'gateway', 'firewall', 'load-balancer'].includes(node.type)) {
        errors.push('Invalid node type');
    }
    if (node.ipAddress && !isValidIP(node.ipAddress)) {
        errors.push('Invalid IP address format');
    }
    if (node.macAddress && !isValidMAC(node.macAddress)) {
        errors.push('Invalid MAC address format');
    }
    if (node.capacity < 0) {
        errors.push('Capacity cannot be negative');
    }
    if (node.utilization < 0 || node.utilization > 100) {
        errors.push('Utilization must be between 0 and 100');
    }
    return { valid: errors.length === 0, errors };
};
exports.validateNodeConfiguration = validateNodeConfiguration;
/**
 * Assigns a role to a network node.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} nodeId - Node ID
 * @param {string} role - Role to assign
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<NetworkNode>} Updated node
 *
 * @example
 * ```typescript
 * const node = await assignNodeRole(sequelize, 'node-123', 'primary-gateway');
 * ```
 */
const assignNodeRole = async (sequelize, nodeId, role, transaction) => {
    const NodeModel = sequelize.models.NetworkNode;
    const node = await NodeModel.findByPk(nodeId, { transaction });
    if (!node)
        throw new Error(`Node ${nodeId} not found`);
    node.metadata = { ...node.metadata, role };
    await node.save({ transaction });
    return node;
};
exports.assignNodeRole = assignNodeRole;
// ============================================================================
// LINK/EDGE MANAGEMENT (16-22)
// ============================================================================
/**
 * Creates a network link between two nodes.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<NetworkLink>} linkData - Link data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<NetworkLink>} Created link
 *
 * @example
 * ```typescript
 * const link = await createNetworkLink(sequelize, {
 *   topologyId: 'topo-123',
 *   sourceNodeId: 'node-1',
 *   targetNodeId: 'node-2',
 *   bandwidth: 10000,
 *   latency: 2
 * });
 * ```
 */
const createNetworkLink = async (sequelize, linkData, transaction) => {
    const LinkModel = sequelize.models.NetworkLink;
    return LinkModel.create(linkData, { transaction });
};
exports.createNetworkLink = createNetworkLink;
/**
 * Updates link metrics (bandwidth, latency, utilization).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} linkId - Link ID
 * @param {Partial<NetworkLink>} metrics - Metrics to update
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<NetworkLink>} Updated link
 *
 * @example
 * ```typescript
 * const link = await updateLinkMetrics(sequelize, 'link-123', {
 *   utilization: 85,
 *   latency: 3.5
 * });
 * ```
 */
const updateLinkMetrics = async (sequelize, linkId, metrics, transaction) => {
    const LinkModel = sequelize.models.NetworkLink;
    const link = await LinkModel.findByPk(linkId, { transaction });
    if (!link)
        throw new Error(`Link ${linkId} not found`);
    await link.update(metrics, { transaction });
    return link;
};
exports.updateLinkMetrics = updateLinkMetrics;
/**
 * Deletes a network link connection.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} linkId - Link ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await deleteLinkConnection(sequelize, 'link-123');
 * ```
 */
const deleteLinkConnection = async (sequelize, linkId, transaction) => {
    const LinkModel = sequelize.models.NetworkLink;
    await LinkModel.destroy({ where: { id: linkId }, transaction });
};
exports.deleteLinkConnection = deleteLinkConnection;
/**
 * Validates link capacity constraints.
 *
 * @param {NetworkLink} link - Link to validate
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const result = validateLinkCapacity(link);
 * if (!result.valid) {
 *   console.error('Capacity issues:', result.errors);
 * }
 * ```
 */
const validateLinkCapacity = (link) => {
    const errors = [];
    if (link.bandwidth <= 0) {
        errors.push('Bandwidth must be positive');
    }
    if (link.utilization > 100) {
        errors.push('Link is over capacity (utilization > 100%)');
    }
    if (link.utilization > 90) {
        errors.push('Link utilization is critically high (> 90%)');
    }
    if (link.latency < 0) {
        errors.push('Latency cannot be negative');
    }
    return { valid: errors.length === 0, errors };
};
exports.validateLinkCapacity = validateLinkCapacity;
/**
 * Calculates link utilization percentage.
 *
 * @param {NetworkLink} link - Network link
 * @param {number} currentThroughput - Current throughput in Mbps
 * @returns {number} Utilization percentage
 *
 * @example
 * ```typescript
 * const utilization = calculateLinkUtilization(link, 7500);
 * console.log(`${utilization}%`); // "75%"
 * ```
 */
const calculateLinkUtilization = (link, currentThroughput) => {
    return (currentThroughput / link.bandwidth) * 100;
};
exports.calculateLinkUtilization = calculateLinkUtilization;
/**
 * Finds redundant links (parallel links between same nodes).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} topologyId - Topology ID
 * @returns {Promise<NetworkLink[][]>} Array of redundant link groups
 *
 * @example
 * ```typescript
 * const redundant = await findRedundantLinks(sequelize, 'topo-123');
 * console.log(`Found ${redundant.length} redundant link groups`);
 * ```
 */
const findRedundantLinks = async (sequelize, topologyId) => {
    const LinkModel = sequelize.models.NetworkLink;
    const links = await LinkModel.findAll({ where: { topologyId } });
    const linkMap = new Map();
    links.forEach((link) => {
        const key = [link.sourceNodeId, link.targetNodeId].sort().join('-');
        if (!linkMap.has(key))
            linkMap.set(key, []);
        linkMap.get(key).push(link);
    });
    return Array.from(linkMap.values()).filter((group) => group.length > 1);
};
exports.findRedundantLinks = findRedundantLinks;
/**
 * Optimizes link routing based on current utilization.
 *
 * @param {TopologyGraph} graph - Network topology graph
 * @param {string} sourceId - Source node ID
 * @param {string} targetId - Target node ID
 * @returns {NetworkPath | null} Optimized path
 *
 * @example
 * ```typescript
 * const optimized = optimizeLinkRouting(graph, 'node-1', 'node-5');
 * ```
 */
const optimizeLinkRouting = (graph, sourceId, targetId) => {
    // Find path that minimizes max utilization
    const paths = (0, exports.findAllPaths)(graph, sourceId, targetId);
    if (paths.length === 0)
        return null;
    let bestPath = paths[0];
    let minMaxUtilization = Infinity;
    for (const path of paths) {
        let maxUtilization = 0;
        for (const linkId of path.links) {
            const link = graph.links.get(linkId);
            maxUtilization = Math.max(maxUtilization, link.utilization);
        }
        if (maxUtilization < minMaxUtilization) {
            minMaxUtilization = maxUtilization;
            bestPath = path;
        }
    }
    return bestPath;
};
exports.optimizeLinkRouting = optimizeLinkRouting;
// ============================================================================
// TOPOLOGY VALIDATION (23-28)
// ============================================================================
/**
 * Validates overall topology integrity.
 *
 * @param {TopologyGraph} graph - Network topology graph
 * @returns {TopologyValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateTopologyIntegrity(graph);
 * if (!result.valid) {
 *   console.error('Topology errors:', result.errors);
 * }
 * ```
 */
const validateTopologyIntegrity = (graph) => {
    const errors = [];
    const warnings = [];
    const suggestions = [];
    // Check for orphaned nodes
    const orphaned = [];
    for (const [nodeId, neighbors] of graph.adjacencyList.entries()) {
        if (neighbors.size === 0) {
            orphaned.push(nodeId);
            errors.push(`Node ${nodeId} has no connections`);
        }
    }
    // Check for single points of failure
    const critical = (0, exports.findCriticalNodes)(graph);
    if (critical.length > 0) {
        warnings.push(`Found ${critical.length} critical nodes (single points of failure)`);
        suggestions.push('Consider adding redundant links to critical nodes');
    }
    // Check connectivity
    const connected = (0, exports.checkConnectivity)(graph);
    if (!connected) {
        errors.push('Network topology is not fully connected');
    }
    // Check for cycles (may be intentional for redundancy)
    const cycles = (0, exports.detectCycles)(graph);
    if (cycles.length > 0) {
        warnings.push(`Found ${cycles.length} cycles in topology`);
    }
    return {
        valid: errors.length === 0,
        errors,
        warnings,
        suggestions,
    };
};
exports.validateTopologyIntegrity = validateTopologyIntegrity;
/**
 * Checks if all nodes are connected (network is fully connected).
 *
 * @param {TopologyGraph} graph - Network topology graph
 * @returns {boolean} True if fully connected
 *
 * @example
 * ```typescript
 * const connected = checkConnectivity(graph);
 * ```
 */
const checkConnectivity = (graph) => {
    if (graph.nodes.size === 0)
        return true;
    const visited = new Set();
    const stack = [Array.from(graph.nodes.keys())[0]];
    while (stack.length > 0) {
        const nodeId = stack.pop();
        if (visited.has(nodeId))
            continue;
        visited.add(nodeId);
        const neighbors = graph.adjacencyList.get(nodeId) || new Set();
        for (const neighborId of neighbors) {
            if (!visited.has(neighborId)) {
                stack.push(neighborId);
            }
        }
    }
    return visited.size === graph.nodes.size;
};
exports.checkConnectivity = checkConnectivity;
/**
 * Validates bandwidth constraints across the topology.
 *
 * @param {TopologyGraph} graph - Network topology graph
 * @param {number} threshold - Utilization threshold (0-100)
 * @returns {{ valid: boolean; overutilized: NetworkLink[] }} Validation result
 *
 * @example
 * ```typescript
 * const result = validateBandwidthConstraints(graph, 90);
 * console.log(`${result.overutilized.length} links over 90% utilization`);
 * ```
 */
const validateBandwidthConstraints = (graph, threshold) => {
    const overutilized = [];
    for (const link of graph.links.values()) {
        if (link.utilization > threshold) {
            overutilized.push(link);
        }
    }
    return {
        valid: overutilized.length === 0,
        overutilized,
    };
};
exports.validateBandwidthConstraints = validateBandwidthConstraints;
/**
 * Detects orphaned nodes (nodes with no connections).
 *
 * @param {TopologyGraph} graph - Network topology graph
 * @returns {NetworkNode[]} Orphaned nodes
 *
 * @example
 * ```typescript
 * const orphaned = detectOrphanedNodes(graph);
 * ```
 */
const detectOrphanedNodes = (graph) => {
    const orphaned = [];
    for (const [nodeId, neighbors] of graph.adjacencyList.entries()) {
        if (neighbors.size === 0) {
            const node = graph.nodes.get(nodeId);
            if (node)
                orphaned.push(node);
        }
    }
    return orphaned;
};
exports.detectOrphanedNodes = detectOrphanedNodes;
/**
 * Validates redundancy requirements.
 *
 * @param {TopologyGraph} graph - Network topology graph
 * @param {number} minRedundancy - Minimum number of paths required
 * @returns {{ valid: boolean; nodesPaths: Map<string, number> }} Validation result
 *
 * @example
 * ```typescript
 * const result = validateRedundancy(graph, 2);
 * ```
 */
const validateRedundancy = (graph, minRedundancy) => {
    const nodesPaths = new Map();
    // For simplification, check redundancy from first node
    const nodes = Array.from(graph.nodes.keys());
    if (nodes.length < 2)
        return { valid: true, nodesPaths };
    const source = nodes[0];
    for (let i = 1; i < nodes.length; i++) {
        const target = nodes[i];
        const paths = (0, exports.findAllPaths)(graph, source, target);
        nodesPaths.set(target, paths.length);
    }
    const valid = Array.from(nodesPaths.values()).every((count) => count >= minRedundancy);
    return { valid, nodesPaths };
};
exports.validateRedundancy = validateRedundancy;
/**
 * Checks if topology is loop-free (no cycles).
 *
 * @param {TopologyGraph} graph - Network topology graph
 * @returns {boolean} True if loop-free
 *
 * @example
 * ```typescript
 * const loopFree = checkLoopFreeTopology(graph);
 * ```
 */
const checkLoopFreeTopology = (graph) => {
    const cycles = (0, exports.detectCycles)(graph);
    return cycles.length === 0;
};
exports.checkLoopFreeTopology = checkLoopFreeTopology;
// ============================================================================
// TOPOLOGY OPTIMIZATION (29-34)
// ============================================================================
/**
 * Optimizes network topology for performance and resilience.
 *
 * @param {TopologyGraph} graph - Network topology graph
 * @returns {OptimizationSuggestion[]} Optimization suggestions
 *
 * @example
 * ```typescript
 * const suggestions = optimizeNetworkTopology(graph);
 * suggestions.forEach(s => console.log(s.description));
 * ```
 */
const optimizeNetworkTopology = (graph) => {
    const suggestions = [];
    // Find critical nodes
    const critical = (0, exports.findCriticalNodes)(graph);
    if (critical.length > 0) {
        suggestions.push({
            type: 'link-redundancy',
            description: `Add redundant links for ${critical.length} critical nodes`,
            impact: 'high',
            affectedNodes: critical,
            affectedLinks: [],
            estimatedImprovement: 40,
        });
    }
    // Find overutilized links
    const overutilized = [];
    for (const link of graph.links.values()) {
        if (link.utilization > 80) {
            overutilized.push(link);
        }
    }
    if (overutilized.length > 0) {
        suggestions.push({
            type: 'upgrade',
            description: `Upgrade ${overutilized.length} overutilized links`,
            impact: 'high',
            affectedNodes: [],
            affectedLinks: overutilized.map((l) => l.id),
            estimatedImprovement: 30,
        });
    }
    // Suggest load balancing
    const imbalanced = findImbalancedNodes(graph);
    if (imbalanced.length > 0) {
        suggestions.push({
            type: 'load-balance',
            description: `Rebalance traffic across ${imbalanced.length} nodes`,
            impact: 'medium',
            affectedNodes: imbalanced,
            affectedLinks: [],
            estimatedImprovement: 20,
        });
    }
    return suggestions;
};
exports.optimizeNetworkTopology = optimizeNetworkTopology;
/**
 * Balances network load across available paths.
 *
 * @param {TopologyGraph} graph - Network topology graph
 * @param {string} sourceId - Source node ID
 * @param {string} targetId - Target node ID
 * @returns {NetworkPath[]} Balanced paths
 *
 * @example
 * ```typescript
 * const balanced = balanceNetworkLoad(graph, 'node-1', 'node-5');
 * ```
 */
const balanceNetworkLoad = (graph, sourceId, targetId) => {
    const paths = (0, exports.findAllPaths)(graph, sourceId, targetId);
    // Sort by current utilization (prefer less utilized paths)
    return paths.sort((a, b) => {
        const aMaxUtil = Math.max(...a.links.map((id) => graph.links.get(id).utilization));
        const bMaxUtil = Math.max(...b.links.map((id) => graph.links.get(id).utilization));
        return aMaxUtil - bMaxUtil;
    });
};
exports.balanceNetworkLoad = balanceNetworkLoad;
/**
 * Suggests topology improvements based on analysis.
 *
 * @param {TopologyGraph} graph - Network topology graph
 * @returns {string[]} Improvement suggestions
 *
 * @example
 * ```typescript
 * const improvements = suggestTopologyImprovements(graph);
 * ```
 */
const suggestTopologyImprovements = (graph) => {
    const suggestions = [];
    const validation = (0, exports.validateTopologyIntegrity)(graph);
    suggestions.push(...validation.suggestions);
    // Check mesh density
    const actualLinks = graph.links.size;
    const possibleLinks = (graph.nodes.size * (graph.nodes.size - 1)) / 2;
    const density = actualLinks / possibleLinks;
    if (density < 0.3) {
        suggestions.push('Consider adding more links to increase network resilience');
    }
    // Check average path length
    const avgPathLength = calculateAveragePathLength(graph);
    if (avgPathLength > 5) {
        suggestions.push('High average path length - consider adding direct links');
    }
    return suggestions;
};
exports.suggestTopologyImprovements = suggestTopologyImprovements;
/**
 * Consolidates redundant network paths.
 *
 * @param {TopologyGraph} graph - Network topology graph
 * @returns {NetworkLink[]} Links that can be removed
 *
 * @example
 * ```typescript
 * const removable = consolidateNetworkPaths(graph);
 * ```
 */
const consolidateNetworkPaths = (graph) => {
    const redundantGroups = [];
    const linkMap = new Map();
    for (const link of graph.links.values()) {
        const key = [link.sourceNodeId, link.targetNodeId].sort().join('-');
        if (!linkMap.has(key))
            linkMap.set(key, []);
        linkMap.get(key).push(link);
    }
    const removable = [];
    for (const links of linkMap.values()) {
        if (links.length > 2) {
            // Keep 2 for redundancy, mark others as removable
            const sorted = links.sort((a, b) => b.bandwidth - a.bandwidth);
            removable.push(...sorted.slice(2));
        }
    }
    return removable;
};
exports.consolidateNetworkPaths = consolidateNetworkPaths;
/**
 * Minimizes network latency by optimizing paths.
 *
 * @param {TopologyGraph} graph - Network topology graph
 * @returns {Map<string, NetworkPath>} Optimized paths between all node pairs
 *
 * @example
 * ```typescript
 * const optimized = minimizeLatency(graph);
 * ```
 */
const minimizeLatency = (graph) => {
    const optimizedPaths = new Map();
    const nodes = Array.from(graph.nodes.keys());
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const path = (0, exports.findShortestPath)(graph, nodes[i], nodes[j], 'latency');
            if (path) {
                optimizedPaths.set(`${nodes[i]}-${nodes[j]}`, path);
            }
        }
    }
    return optimizedPaths;
};
exports.minimizeLatency = minimizeLatency;
/**
 * Optimizes topology for resilience against failures.
 *
 * @param {TopologyGraph} graph - Network topology graph
 * @returns {OptimizationSuggestion[]} Resilience improvements
 *
 * @example
 * ```typescript
 * const improvements = optimizeForResilience(graph);
 * ```
 */
const optimizeForResilience = (graph) => {
    const suggestions = [];
    // Identify critical nodes
    const critical = (0, exports.findCriticalNodes)(graph);
    for (const nodeId of critical) {
        suggestions.push({
            type: 'link-redundancy',
            description: `Add backup links for critical node ${nodeId}`,
            impact: 'high',
            affectedNodes: [nodeId],
            affectedLinks: [],
            estimatedImprovement: 50,
        });
    }
    // Check for single-link dependencies
    for (const [nodeId, neighbors] of graph.adjacencyList.entries()) {
        if (neighbors.size === 1) {
            suggestions.push({
                type: 'link-redundancy',
                description: `Node ${nodeId} has only one connection - add backup link`,
                impact: 'medium',
                affectedNodes: [nodeId],
                affectedLinks: [],
                estimatedImprovement: 30,
            });
        }
    }
    return suggestions;
};
exports.optimizeForResilience = optimizeForResilience;
// ============================================================================
// NETWORK SEGMENTATION (35-39)
// ============================================================================
/**
 * Creates a VLAN network segment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<VLANSegment>} vlanData - VLAN data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<VLANSegment>} Created VLAN
 *
 * @example
 * ```typescript
 * const vlan = await createVLANSegment(sequelize, {
 *   id: 100,
 *   name: 'Production',
 *   isolationLevel: 'strict',
 *   bandwidth: 10000
 * });
 * ```
 */
const createVLANSegment = async (sequelize, vlanData, transaction) => {
    // Store in custom VLAN table or metadata
    return vlanData;
};
exports.createVLANSegment = createVLANSegment;
/**
 * Assigns a node to a VLAN segment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} nodeId - Node ID
 * @param {number} vlanId - VLAN ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<NetworkNode>} Updated node
 *
 * @example
 * ```typescript
 * const node = await assignNodeToVLAN(sequelize, 'node-123', 100);
 * ```
 */
const assignNodeToVLAN = async (sequelize, nodeId, vlanId, transaction) => {
    const NodeModel = sequelize.models.NetworkNode;
    const node = await NodeModel.findByPk(nodeId, { transaction });
    if (!node)
        throw new Error(`Node ${nodeId} not found`);
    node.metadata = { ...node.metadata, vlanId };
    await node.save({ transaction });
    return node;
};
exports.assignNodeToVLAN = assignNodeToVLAN;
/**
 * Validates VLAN isolation rules.
 *
 * @param {TopologyGraph} graph - Network topology graph
 * @param {VLANSegment[]} vlans - VLAN segments
 * @returns {{ valid: boolean; violations: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const result = validateVLANIsolation(graph, vlans);
 * ```
 */
const validateVLANIsolation = (graph, vlans) => {
    const violations = [];
    for (const vlan of vlans) {
        if (vlan.isolationLevel === 'strict') {
            // Check for cross-VLAN links
            for (const nodeId of vlan.nodeIds) {
                const neighbors = graph.adjacencyList.get(nodeId) || new Set();
                for (const neighborId of neighbors) {
                    const neighbor = graph.nodes.get(neighborId);
                    if (neighbor && (neighbor.metadata.vlanId !== vlan.id)) {
                        violations.push(`Strict isolation violated: node ${nodeId} (VLAN ${vlan.id}) connected to node ${neighborId} (VLAN ${neighbor.metadata.vlanId})`);
                    }
                }
            }
        }
    }
    return { valid: violations.length === 0, violations };
};
exports.validateVLANIsolation = validateVLANIsolation;
/**
 * Calculates VLAN utilization and capacity.
 *
 * @param {TopologyGraph} graph - Network topology graph
 * @param {number} vlanId - VLAN ID
 * @returns {{ totalCapacity: number; totalUtilization: number; nodeCount: number }} VLAN metrics
 *
 * @example
 * ```typescript
 * const metrics = calculateVLANUtilization(graph, 100);
 * ```
 */
const calculateVLANUtilization = (graph, vlanId) => {
    let totalCapacity = 0;
    let totalUtilization = 0;
    let nodeCount = 0;
    for (const node of graph.nodes.values()) {
        if (node.metadata.vlanId === vlanId) {
            totalCapacity += node.capacity;
            totalUtilization += (node.utilization / 100) * node.capacity;
            nodeCount++;
        }
    }
    return { totalCapacity, totalUtilization, nodeCount };
};
exports.calculateVLANUtilization = calculateVLANUtilization;
/**
 * Merges two VLAN segments.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} sourceVlanId - Source VLAN ID
 * @param {number} targetVlanId - Target VLAN ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await mergeVLANSegments(sequelize, 100, 101);
 * ```
 */
const mergeVLANSegments = async (sequelize, sourceVlanId, targetVlanId, transaction) => {
    const NodeModel = sequelize.models.NetworkNode;
    await NodeModel.update({ metadata: sequelize.literal(`jsonb_set(metadata, '{vlanId}', '${targetVlanId}'::jsonb)`) }, {
        where: sequelize.literal(`metadata->>'vlanId' = '${sourceVlanId}'`),
        transaction,
    });
};
exports.mergeVLANSegments = mergeVLANSegments;
// ============================================================================
// IP ALLOCATION (40-45)
// ============================================================================
/**
 * Calculates subnet mask from CIDR notation.
 *
 * @param {number} cidr - CIDR value (0-32)
 * @returns {string} Subnet mask
 *
 * @example
 * ```typescript
 * const mask = calculateSubnetMask(24);
 * console.log(mask); // "255.255.255.0"
 * ```
 */
const calculateSubnetMask = (cidr) => {
    const mask = [];
    for (let i = 0; i < 4; i++) {
        const bits = Math.max(0, Math.min(8, cidr - i * 8));
        mask.push(256 - Math.pow(2, 8 - bits));
    }
    return mask.join('.');
};
exports.calculateSubnetMask = calculateSubnetMask;
/**
 * Allocates an IP range for a subnet.
 *
 * @param {string} network - Network address
 * @param {number} cidr - CIDR notation
 * @returns {SubnetAllocation} Subnet allocation details
 *
 * @example
 * ```typescript
 * const subnet = allocateIPRange('192.168.1.0', 24);
 * console.log(subnet.usableHosts); // 254
 * ```
 */
const allocateIPRange = (network, cidr) => {
    const totalHosts = Math.pow(2, 32 - cidr);
    const usableHosts = totalHosts - 2; // Subtract network and broadcast
    const networkParts = network.split('.').map(Number);
    const networkInt = ipToInt(network);
    const gateway = intToIP(networkInt + 1);
    const broadcast = intToIP(networkInt + totalHosts - 1);
    const firstUsable = gateway;
    const lastUsable = intToIP(networkInt + totalHosts - 2);
    return {
        network,
        cidr,
        gateway,
        broadcast,
        firstUsable,
        lastUsable,
        totalHosts,
        usableHosts,
    };
};
exports.allocateIPRange = allocateIPRange;
/**
 * Validates IP allocation against subnet rules.
 *
 * @param {string} ipAddress - IP address to validate
 * @param {SubnetAllocation} subnet - Subnet allocation
 * @returns {boolean} True if IP is valid for subnet
 *
 * @example
 * ```typescript
 * const valid = validateIPAllocation('192.168.1.100', subnet);
 * ```
 */
const validateIPAllocation = (ipAddress, subnet) => {
    const ip = ipToInt(ipAddress);
    const network = ipToInt(subnet.network);
    const first = ipToInt(subnet.firstUsable);
    const last = ipToInt(subnet.lastUsable);
    return ip >= first && ip <= last;
};
exports.validateIPAllocation = validateIPAllocation;
/**
 * Finds available IPs in an allocated range.
 *
 * @param {IPRange} range - IP range
 * @param {number} count - Number of IPs needed
 * @returns {string[]} Available IP addresses
 *
 * @example
 * ```typescript
 * const available = findAvailableIPs(range, 5);
 * ```
 */
const findAvailableIPs = (range, count) => {
    const available = [];
    const allocated = new Set(range.allocated);
    const start = ipToInt(range.startIP);
    const end = ipToInt(range.endIP);
    for (let i = start; i <= end && available.length < count; i++) {
        const ip = intToIP(i);
        if (!allocated.has(ip)) {
            available.push(ip);
        }
    }
    return available;
};
exports.findAvailableIPs = findAvailableIPs;
/**
 * Calculates network capacity (total hosts).
 *
 * @param {number} cidr - CIDR notation
 * @returns {number} Total host capacity
 *
 * @example
 * ```typescript
 * const capacity = calculateNetworkCapacity(24);
 * console.log(capacity); // 256
 * ```
 */
const calculateNetworkCapacity = (cidr) => {
    return Math.pow(2, 32 - cidr);
};
exports.calculateNetworkCapacity = calculateNetworkCapacity;
/**
 * Generates IP address allocation plan for topology.
 *
 * @param {TopologyGraph} graph - Network topology graph
 * @param {string} baseNetwork - Base network address
 * @param {number} cidr - CIDR notation
 * @returns {Map<string, string>} Node ID to IP address mapping
 *
 * @example
 * ```typescript
 * const plan = generateIPAddressPlan(graph, '10.0.0.0', 16);
 * ```
 */
const generateIPAddressPlan = (graph, baseNetwork, cidr) => {
    const plan = new Map();
    const subnet = (0, exports.allocateIPRange)(baseNetwork, cidr);
    let currentIP = ipToInt(subnet.firstUsable);
    const lastIP = ipToInt(subnet.lastUsable);
    for (const nodeId of graph.nodes.keys()) {
        if (currentIP > lastIP) {
            throw new Error('Insufficient IP addresses in subnet');
        }
        plan.set(nodeId, intToIP(currentIP));
        currentIP++;
    }
    return plan;
};
exports.generateIPAddressPlan = generateIPAddressPlan;
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
function findLinkBetween(graph, node1, node2) {
    for (const link of graph.links.values()) {
        if ((link.sourceNodeId === node1 && link.targetNodeId === node2) ||
            (link.sourceNodeId === node2 && link.targetNodeId === node1)) {
            return link;
        }
    }
    return null;
}
function buildPathFromNodes(graph, nodes) {
    const links = [];
    let totalCost = 0;
    let totalLatency = 0;
    let minBandwidth = Infinity;
    for (let i = 0; i < nodes.length - 1; i++) {
        const link = findLinkBetween(graph, nodes[i], nodes[i + 1]);
        links.push(link.id);
        totalCost += link.cost;
        totalLatency += link.latency;
        minBandwidth = Math.min(minBandwidth, link.bandwidth);
    }
    return {
        nodes,
        links,
        totalCost,
        totalLatency,
        bandwidth: minBandwidth,
        hops: nodes.length - 1,
    };
}
function findImbalancedNodes(graph) {
    const imbalanced = [];
    for (const node of graph.nodes.values()) {
        if (node.utilization > 80) {
            imbalanced.push(node.id);
        }
    }
    return imbalanced;
}
function calculateAveragePathLength(graph) {
    const nodes = Array.from(graph.nodes.keys());
    let totalLength = 0;
    let pathCount = 0;
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const path = (0, exports.findShortestPath)(graph, nodes[i], nodes[j]);
            if (path) {
                totalLength += path.hops;
                pathCount++;
            }
        }
    }
    return pathCount > 0 ? totalLength / pathCount : 0;
}
function isValidIP(ip) {
    const parts = ip.split('.');
    if (parts.length !== 4)
        return false;
    return parts.every((part) => {
        const num = parseInt(part, 10);
        return num >= 0 && num <= 255;
    });
}
function isValidMAC(mac) {
    return /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(mac);
}
function ipToInt(ip) {
    const parts = ip.split('.').map(Number);
    return (parts[0] << 24) + (parts[1] << 16) + (parts[2] << 8) + parts[3];
}
function intToIP(num) {
    return [
        (num >>> 24) & 255,
        (num >>> 16) & 255,
        (num >>> 8) & 255,
        num & 255,
    ].join('.');
}
exports.default = {
    // Sequelize Models
    createNetworkTopologyModel: exports.createNetworkTopologyModel,
    createNetworkNodeModel: exports.createNetworkNodeModel,
    createNetworkLinkModel: exports.createNetworkLinkModel,
    // Graph Algorithms
    findShortestPath: exports.findShortestPath,
    findAllPaths: exports.findAllPaths,
    calculateMinimumSpanningTree: exports.calculateMinimumSpanningTree,
    detectCycles: exports.detectCycles,
    findCriticalNodes: exports.findCriticalNodes,
    // Node Management
    createNetworkNode: exports.createNetworkNode,
    updateNetworkNode: exports.updateNetworkNode,
    deleteNetworkNode: exports.deleteNetworkNode,
    getNodesByType: exports.getNodesByType,
    getNodeNeighbors: exports.getNodeNeighbors,
    validateNodeConfiguration: exports.validateNodeConfiguration,
    assignNodeRole: exports.assignNodeRole,
    // Link Management
    createNetworkLink: exports.createNetworkLink,
    updateLinkMetrics: exports.updateLinkMetrics,
    deleteLinkConnection: exports.deleteLinkConnection,
    validateLinkCapacity: exports.validateLinkCapacity,
    calculateLinkUtilization: exports.calculateLinkUtilization,
    findRedundantLinks: exports.findRedundantLinks,
    optimizeLinkRouting: exports.optimizeLinkRouting,
    // Topology Validation
    validateTopologyIntegrity: exports.validateTopologyIntegrity,
    checkConnectivity: exports.checkConnectivity,
    validateBandwidthConstraints: exports.validateBandwidthConstraints,
    detectOrphanedNodes: exports.detectOrphanedNodes,
    validateRedundancy: exports.validateRedundancy,
    checkLoopFreeTopology: exports.checkLoopFreeTopology,
    // Topology Optimization
    optimizeNetworkTopology: exports.optimizeNetworkTopology,
    balanceNetworkLoad: exports.balanceNetworkLoad,
    suggestTopologyImprovements: exports.suggestTopologyImprovements,
    consolidateNetworkPaths: exports.consolidateNetworkPaths,
    minimizeLatency: exports.minimizeLatency,
    optimizeForResilience: exports.optimizeForResilience,
    // Network Segmentation
    createVLANSegment: exports.createVLANSegment,
    assignNodeToVLAN: exports.assignNodeToVLAN,
    validateVLANIsolation: exports.validateVLANIsolation,
    calculateVLANUtilization: exports.calculateVLANUtilization,
    mergeVLANSegments: exports.mergeVLANSegments,
    // IP Allocation
    calculateSubnetMask: exports.calculateSubnetMask,
    allocateIPRange: exports.allocateIPRange,
    validateIPAllocation: exports.validateIPAllocation,
    findAvailableIPs: exports.findAvailableIPs,
    calculateNetworkCapacity: exports.calculateNetworkCapacity,
    generateIPAddressPlan: exports.generateIPAddressPlan,
};
//# sourceMappingURL=virtual-network-topology-kit.js.map