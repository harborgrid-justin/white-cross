/**
 * LOC: NETWRK1234567
 * File: /reuse/san/network-queries-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Network management services
 *   - Virtual network controllers
 *   - SAN infrastructure backend
 */
/**
 * File: /reuse/san/network-queries-kit.ts
 * Locator: WC-UTL-NETWRK-001
 * Purpose: Comprehensive Network Database Queries - topology, path finding, neighbor discovery, utilization, performance, bulk operations
 *
 * Upstream: Independent utility module for network database operations
 * Downstream: ../backend/*, Network controllers, topology services, SAN management
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 42 utility functions for network queries, topology analysis, path finding, neighbor discovery, performance monitoring
 *
 * LLM Context: Comprehensive network database query utilities for implementing production-ready software-defined networking (SDN)
 * and virtual network infrastructure. Provides topology queries, path finding algorithms, neighbor discovery, utilization tracking,
 * performance monitoring, bulk operations, and transaction management for enterprise virtual networks.
 */
import { Sequelize, Transaction } from 'sequelize';
interface NetworkNode {
    id: number;
    nodeId: string;
    name: string;
    type: 'switch' | 'router' | 'firewall' | 'load-balancer' | 'gateway' | 'endpoint';
    status: 'active' | 'inactive' | 'degraded' | 'maintenance';
    ipAddress: string;
    macAddress?: string;
    location?: string;
    capacity: number;
    metadata: Record<string, any>;
}
interface NetworkLink {
    id: number;
    linkId: string;
    sourceNodeId: string;
    targetNodeId: string;
    bandwidth: number;
    latency: number;
    status: 'up' | 'down' | 'degraded';
    utilization: number;
    cost: number;
    metadata: Record<string, any>;
}
interface NetworkPath {
    nodes: NetworkNode[];
    links: NetworkLink[];
    totalCost: number;
    totalLatency: number;
    totalBandwidth: number;
    hopCount: number;
}
interface TopologyQuery {
    nodeType?: string[];
    status?: string[];
    location?: string;
    depth?: number;
    includeLinks?: boolean;
}
/**
 * Sequelize model for Network Nodes (switches, routers, endpoints).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} NetworkNode model
 *
 * @example
 * ```typescript
 * const NetworkNode = createNetworkNodeModel(sequelize);
 * const node = await NetworkNode.create({
 *   nodeId: 'node-sw-001',
 *   name: 'Core Switch 1',
 *   type: 'switch',
 *   status: 'active',
 *   ipAddress: '10.0.1.1',
 *   capacity: 10000
 * });
 * ```
 */
export declare const createNetworkNodeModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        nodeId: string;
        name: string;
        type: string;
        status: string;
        ipAddress: string;
        macAddress: string | null;
        location: string | null;
        capacity: number;
        currentLoad: number;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Network Links (connections between nodes).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} NetworkLink model
 *
 * @example
 * ```typescript
 * const NetworkLink = createNetworkLinkModel(sequelize);
 * const link = await NetworkLink.create({
 *   linkId: 'link-001',
 *   sourceNodeId: 'node-sw-001',
 *   targetNodeId: 'node-rt-001',
 *   bandwidth: 10000,
 *   latency: 1.5,
 *   cost: 10
 * });
 * ```
 */
export declare const createNetworkLinkModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        linkId: string;
        sourceNodeId: string;
        targetNodeId: string;
        bandwidth: number;
        latency: number;
        status: string;
        utilization: number;
        cost: number;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Network Segments (VLANs, subnets).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} NetworkSegment model
 *
 * @example
 * ```typescript
 * const NetworkSegment = createNetworkSegmentModel(sequelize);
 * const segment = await NetworkSegment.create({
 *   segmentId: 'vlan-100',
 *   name: 'Production Network',
 *   vlanId: 100,
 *   subnet: '10.100.0.0/24',
 *   gateway: '10.100.0.1'
 * });
 * ```
 */
export declare const createNetworkSegmentModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        segmentId: string;
        name: string;
        vlanId: number | null;
        subnet: string;
        gateway: string;
        isolationLevel: string;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Retrieves complete network topology with all nodes and links.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {TopologyQuery} [query] - Topology query filters
 * @returns {Promise<{ nodes: any[]; links: any[] }>} Network topology
 *
 * @example
 * ```typescript
 * const topology = await getNetworkTopology(sequelize, {
 *   nodeType: ['switch', 'router'],
 *   status: ['active'],
 *   includeLinks: true
 * });
 * ```
 */
export declare const getNetworkTopology: (sequelize: Sequelize, query?: TopologyQuery) => Promise<{
    nodes: any[];
    links: any[];
}>;
/**
 * Finds all nodes within a specific network segment.
 *
 * @param {string} segmentId - Network segment ID
 * @param {Model} NetworkNodeModel - Sequelize NetworkNode model
 * @returns {Promise<any[]>} Nodes in segment
 *
 * @example
 * ```typescript
 * const nodes = await getNodesInSegment('vlan-100', NetworkNodeModel);
 * ```
 */
export declare const getNodesInSegment: (segmentId: string, NetworkNodeModel: any) => Promise<any[]>;
/**
 * Retrieves network topology as adjacency list for graph algorithms.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Map<string, string[]>>} Adjacency list
 *
 * @example
 * ```typescript
 * const adjacencyList = await getTopologyAdjacencyList(sequelize);
 * // Result: Map { 'node-1' => ['node-2', 'node-3'], 'node-2' => ['node-1', 'node-4'], ... }
 * ```
 */
export declare const getTopologyAdjacencyList: (sequelize: Sequelize) => Promise<Map<string, string[]>>;
/**
 * Finds all leaf nodes (endpoints) in the network.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} Leaf nodes
 *
 * @example
 * ```typescript
 * const endpoints = await getLeafNodes(sequelize);
 * ```
 */
export declare const getLeafNodes: (sequelize: Sequelize) => Promise<any[]>;
/**
 * Retrieves network topology in hierarchical tree structure.
 *
 * @param {string} rootNodeId - Root node ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} [maxDepth=10] - Maximum traversal depth
 * @returns {Promise<any>} Hierarchical topology tree
 *
 * @example
 * ```typescript
 * const tree = await getTopologyTree('node-core-01', sequelize, 5);
 * ```
 */
export declare const getTopologyTree: (rootNodeId: string, sequelize: Sequelize, maxDepth?: number) => Promise<any>;
/**
 * Identifies core backbone nodes based on connectivity.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} [minConnections=5] - Minimum connections to be considered core
 * @returns {Promise<any[]>} Core backbone nodes
 *
 * @example
 * ```typescript
 * const coreNodes = await getCoreBackboneNodes(sequelize, 8);
 * ```
 */
export declare const getCoreBackboneNodes: (sequelize: Sequelize, minConnections?: number) => Promise<any[]>;
/**
 * Detects network topology loops and circular dependencies.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} Detected loops
 *
 * @example
 * ```typescript
 * const loops = await detectTopologyLoops(sequelize);
 * ```
 */
export declare const detectTopologyLoops: (sequelize: Sequelize) => Promise<any[]>;
/**
 * Finds shortest path between two nodes using Dijkstra's algorithm.
 *
 * @param {string} sourceNodeId - Source node ID
 * @param {string} targetNodeId - Target node ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<NetworkPath | null>} Shortest path or null
 *
 * @example
 * ```typescript
 * const path = await findShortestPath('node-1', 'node-10', sequelize);
 * ```
 */
export declare const findShortestPath: (sourceNodeId: string, targetNodeId: string, sequelize: Sequelize) => Promise<NetworkPath | null>;
/**
 * Finds all available paths between two nodes.
 *
 * @param {string} sourceNodeId - Source node ID
 * @param {string} targetNodeId - Target node ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} [maxPaths=10] - Maximum paths to return
 * @returns {Promise<NetworkPath[]>} Available paths
 *
 * @example
 * ```typescript
 * const paths = await findAllPaths('node-1', 'node-10', sequelize, 5);
 * ```
 */
export declare const findAllPaths: (sourceNodeId: string, targetNodeId: string, sequelize: Sequelize, maxPaths?: number) => Promise<NetworkPath[]>;
/**
 * Finds optimal path based on latency instead of cost.
 *
 * @param {string} sourceNodeId - Source node ID
 * @param {string} targetNodeId - Target node ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<NetworkPath | null>} Lowest latency path
 *
 * @example
 * ```typescript
 * const path = await findLowestLatencyPath('node-1', 'node-10', sequelize);
 * ```
 */
export declare const findLowestLatencyPath: (sourceNodeId: string, targetNodeId: string, sequelize: Sequelize) => Promise<NetworkPath | null>;
/**
 * Finds path with maximum available bandwidth.
 *
 * @param {string} sourceNodeId - Source node ID
 * @param {string} targetNodeId - Target node ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} requiredBandwidth - Required bandwidth (Mbps)
 * @returns {Promise<NetworkPath | null>} Maximum bandwidth path
 *
 * @example
 * ```typescript
 * const path = await findMaxBandwidthPath('node-1', 'node-10', sequelize, 5000);
 * ```
 */
export declare const findMaxBandwidthPath: (sourceNodeId: string, targetNodeId: string, sequelize: Sequelize, requiredBandwidth: number) => Promise<NetworkPath | null>;
/**
 * Finds redundant backup paths for fault tolerance.
 *
 * @param {string} sourceNodeId - Source node ID
 * @param {string} targetNodeId - Target node ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<NetworkPath[]>} Redundant paths
 *
 * @example
 * ```typescript
 * const backupPaths = await findRedundantPaths('node-1', 'node-10', sequelize);
 * ```
 */
export declare const findRedundantPaths: (sourceNodeId: string, targetNodeId: string, sequelize: Sequelize) => Promise<NetworkPath[]>;
/**
 * Calculates Equal-Cost Multipath (ECMP) routes.
 *
 * @param {string} sourceNodeId - Source node ID
 * @param {string} targetNodeId - Target node ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<NetworkPath[]>} ECMP routes
 *
 * @example
 * ```typescript
 * const ecmpRoutes = await calculateECMPRoutes('node-1', 'node-10', sequelize);
 * ```
 */
export declare const calculateECMPRoutes: (sourceNodeId: string, targetNodeId: string, sequelize: Sequelize) => Promise<NetworkPath[]>;
/**
 * Validates path viability based on constraints.
 *
 * @param {NetworkPath} path - Network path to validate
 * @param {Object} constraints - Path constraints
 * @returns {boolean} Whether path is viable
 *
 * @example
 * ```typescript
 * const isViable = validatePathConstraints(path, {
 *   maxLatency: 10,
 *   minBandwidth: 1000,
 *   maxHops: 8
 * });
 * ```
 */
export declare const validatePathConstraints: (path: NetworkPath, constraints: {
    maxLatency?: number;
    minBandwidth?: number;
    maxHops?: number;
    maxCost?: number;
}) => boolean;
/**
 * Discovers direct neighbors of a node.
 *
 * @param {string} nodeId - Node ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} Direct neighbors
 *
 * @example
 * ```typescript
 * const neighbors = await discoverDirectNeighbors('node-1', sequelize);
 * ```
 */
export declare const discoverDirectNeighbors: (nodeId: string, sequelize: Sequelize) => Promise<any[]>;
/**
 * Discovers all neighbors within N hops.
 *
 * @param {string} nodeId - Node ID
 * @param {number} maxHops - Maximum hop distance
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} Neighbors within hop distance
 *
 * @example
 * ```typescript
 * const neighbors = await discoverNeighborsWithinHops('node-1', 3, sequelize);
 * ```
 */
export declare const discoverNeighborsWithinHops: (nodeId: string, maxHops: number, sequelize: Sequelize) => Promise<any[]>;
/**
 * Finds common neighbors between two nodes.
 *
 * @param {string} nodeId1 - First node ID
 * @param {string} nodeId2 - Second node ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} Common neighbors
 *
 * @example
 * ```typescript
 * const common = await findCommonNeighbors('node-1', 'node-2', sequelize);
 * ```
 */
export declare const findCommonNeighbors: (nodeId1: string, nodeId2: string, sequelize: Sequelize) => Promise<any[]>;
/**
 * Calculates node centrality (importance) in the network.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} Nodes with centrality scores
 *
 * @example
 * ```typescript
 * const centrality = await calculateNodeCentrality(sequelize);
 * ```
 */
export declare const calculateNodeCentrality: (sequelize: Sequelize) => Promise<any[]>;
/**
 * Identifies network bridges (critical links).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} Bridge links
 *
 * @example
 * ```typescript
 * const bridges = await identifyNetworkBridges(sequelize);
 * ```
 */
export declare const identifyNetworkBridges: (sequelize: Sequelize) => Promise<any[]>;
/**
 * Discovers nodes in the same broadcast domain.
 *
 * @param {string} nodeId - Node ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} Nodes in broadcast domain
 *
 * @example
 * ```typescript
 * const domain = await discoverBroadcastDomain('node-1', sequelize);
 * ```
 */
export declare const discoverBroadcastDomain: (nodeId: string, sequelize: Sequelize) => Promise<any[]>;
/**
 * Builds neighbor adjacency matrix for graph analysis.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Map<string, Map<string, number>>>} Adjacency matrix
 *
 * @example
 * ```typescript
 * const matrix = await buildNeighborAdjacencyMatrix(sequelize);
 * ```
 */
export declare const buildNeighborAdjacencyMatrix: (sequelize: Sequelize) => Promise<Map<string, Map<string, number>>>;
/**
 * Retrieves current utilization metrics for a node.
 *
 * @param {string} nodeId - Node ID
 * @param {Model} NetworkNodeModel - Sequelize NetworkNode model
 * @returns {Promise<any>} Utilization metrics
 *
 * @example
 * ```typescript
 * const metrics = await getNodeUtilization('node-1', NetworkNodeModel);
 * ```
 */
export declare const getNodeUtilization: (nodeId: string, NetworkNodeModel: any) => Promise<any>;
/**
 * Retrieves utilization for all links connected to a node.
 *
 * @param {string} nodeId - Node ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} Link utilization metrics
 *
 * @example
 * ```typescript
 * const linkMetrics = await getLinkUtilization('node-1', sequelize);
 * ```
 */
export declare const getLinkUtilization: (nodeId: string, sequelize: Sequelize) => Promise<any[]>;
/**
 * Finds overutilized network segments.
 *
 * @param {number} threshold - Utilization threshold percentage
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} Overutilized nodes and links
 *
 * @example
 * ```typescript
 * const overutilized = await findOverutilizedSegments(80, sequelize);
 * ```
 */
export declare const findOverutilizedSegments: (threshold: number, sequelize: Sequelize) => Promise<any[]>;
/**
 * Finds underutilized network resources.
 *
 * @param {number} threshold - Utilization threshold percentage
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} Underutilized resources
 *
 * @example
 * ```typescript
 * const underutilized = await findUnderutilizedResources(20, sequelize);
 * ```
 */
export declare const findUnderutilizedResources: (threshold: number, sequelize: Sequelize) => Promise<any[]>;
/**
 * Calculates aggregate utilization for network segment.
 *
 * @param {string} segmentId - Segment ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Aggregate utilization metrics
 *
 * @example
 * ```typescript
 * const metrics = await getSegmentUtilization('vlan-100', sequelize);
 * ```
 */
export declare const getSegmentUtilization: (segmentId: string, sequelize: Sequelize) => Promise<any>;
/**
 * Predicts when a node will reach capacity based on trends.
 *
 * @param {string} nodeId - Node ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Capacity prediction
 *
 * @example
 * ```typescript
 * const prediction = await predictCapacityExhaustion('node-1', sequelize);
 * ```
 */
export declare const predictCapacityExhaustion: (nodeId: string, sequelize: Sequelize) => Promise<any>;
/**
 * Gets utilization history for trending analysis.
 *
 * @param {string} nodeId - Node ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} Historical utilization data
 *
 * @example
 * ```typescript
 * const history = await getUtilizationHistory('node-1', startDate, endDate, sequelize);
 * ```
 */
export declare const getUtilizationHistory: (nodeId: string, startDate: Date, endDate: Date, sequelize: Sequelize) => Promise<any[]>;
/**
 * Retrieves real-time performance metrics for a node.
 *
 * @param {string} nodeId - Node ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Performance metrics
 *
 * @example
 * ```typescript
 * const metrics = await getNodePerformanceMetrics('node-1', sequelize);
 * ```
 */
export declare const getNodePerformanceMetrics: (nodeId: string, sequelize: Sequelize) => Promise<any>;
/**
 * Calculates average latency between two nodes.
 *
 * @param {string} sourceNodeId - Source node ID
 * @param {string} targetNodeId - Target node ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<number>} Average latency in ms
 *
 * @example
 * ```typescript
 * const latency = await calculateAverageLatency('node-1', 'node-10', sequelize);
 * ```
 */
export declare const calculateAverageLatency: (sourceNodeId: string, targetNodeId: string, sequelize: Sequelize) => Promise<number>;
/**
 * Identifies performance bottlenecks in the network.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} Performance bottlenecks
 *
 * @example
 * ```typescript
 * const bottlenecks = await identifyPerformanceBottlenecks(sequelize);
 * ```
 */
export declare const identifyPerformanceBottlenecks: (sequelize: Sequelize) => Promise<any[]>;
/**
 * Calculates network Quality of Service (QoS) metrics.
 *
 * @param {string} segmentId - Segment ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} QoS metrics
 *
 * @example
 * ```typescript
 * const qos = await calculateQoSMetrics('vlan-100', sequelize);
 * ```
 */
export declare const calculateQoSMetrics: (segmentId: string, sequelize: Sequelize) => Promise<any>;
/**
 * Measures end-to-end network performance.
 *
 * @param {string} sourceNodeId - Source node ID
 * @param {string} targetNodeId - Target node ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} End-to-end performance metrics
 *
 * @example
 * ```typescript
 * const metrics = await measureEndToEndPerformance('node-1', 'node-10', sequelize);
 * ```
 */
export declare const measureEndToEndPerformance: (sourceNodeId: string, targetNodeId: string, sequelize: Sequelize) => Promise<any>;
/**
 * Bulk updates node status.
 *
 * @param {string[]} nodeIds - Node IDs
 * @param {string} status - New status
 * @param {Model} NetworkNodeModel - Sequelize NetworkNode model
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Number of updated nodes
 *
 * @example
 * ```typescript
 * const count = await bulkUpdateNodeStatus(['node-1', 'node-2'], 'maintenance', NetworkNodeModel);
 * ```
 */
export declare const bulkUpdateNodeStatus: (nodeIds: string[], status: string, NetworkNodeModel: any, transaction?: Transaction) => Promise<number>;
/**
 * Bulk creates network links.
 *
 * @param {any[]} links - Link objects
 * @param {Model} NetworkLinkModel - Sequelize NetworkLink model
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Created links
 *
 * @example
 * ```typescript
 * const links = await bulkCreateLinks([
 *   { linkId: 'link-1', sourceNodeId: 'node-1', targetNodeId: 'node-2', bandwidth: 1000 },
 *   { linkId: 'link-2', sourceNodeId: 'node-2', targetNodeId: 'node-3', bandwidth: 1000 }
 * ], NetworkLinkModel);
 * ```
 */
export declare const bulkCreateLinks: (links: any[], NetworkLinkModel: any, transaction?: Transaction) => Promise<any[]>;
/**
 * Bulk deletes inactive nodes.
 *
 * @param {Date} inactiveSince - Inactive since date
 * @param {Model} NetworkNodeModel - Sequelize NetworkNode model
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Number of deleted nodes
 *
 * @example
 * ```typescript
 * const count = await bulkDeleteInactiveNodes(thirtyDaysAgo, NetworkNodeModel);
 * ```
 */
export declare const bulkDeleteInactiveNodes: (inactiveSince: Date, NetworkNodeModel: any, transaction?: Transaction) => Promise<number>;
/**
 * Creates network topology within a transaction.
 *
 * @param {any} topologyData - Topology data (nodes and links)
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Created topology
 *
 * @example
 * ```typescript
 * const topology = await createTopologyTransaction({
 *   nodes: [...],
 *   links: [...]
 * }, sequelize);
 * ```
 */
export declare const createTopologyTransaction: (topologyData: {
    nodes: any[];
    links: any[];
}, sequelize: Sequelize) => Promise<any>;
/**
 * Updates network configuration atomically.
 *
 * @param {string} nodeId - Node ID
 * @param {any} updates - Configuration updates
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Updated node
 *
 * @example
 * ```typescript
 * const updated = await updateNetworkConfigTransaction('node-1', {
 *   capacity: 10000,
 *   metadata: { ... }
 * }, sequelize);
 * ```
 */
export declare const updateNetworkConfigTransaction: (nodeId: string, updates: any, sequelize: Sequelize) => Promise<any>;
/**
 * Performs network path recalculation within transaction.
 *
 * @param {string} sourceNodeId - Source node ID
 * @param {string} targetNodeId - Target node ID
 * @param {any} routeUpdates - Route updates
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<NetworkPath>} Recalculated path
 *
 * @example
 * ```typescript
 * const path = await recalculatePathTransaction('node-1', 'node-10', { ... }, sequelize);
 * ```
 */
export declare const recalculatePathTransaction: (sourceNodeId: string, targetNodeId: string, routeUpdates: any, sequelize: Sequelize) => Promise<NetworkPath | null>;
declare const _default: {
    createNetworkNodeModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            nodeId: string;
            name: string;
            type: string;
            status: string;
            ipAddress: string;
            macAddress: string | null;
            location: string | null;
            capacity: number;
            currentLoad: number;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createNetworkLinkModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            linkId: string;
            sourceNodeId: string;
            targetNodeId: string;
            bandwidth: number;
            latency: number;
            status: string;
            utilization: number;
            cost: number;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createNetworkSegmentModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            segmentId: string;
            name: string;
            vlanId: number | null;
            subnet: string;
            gateway: string;
            isolationLevel: string;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    getNetworkTopology: (sequelize: Sequelize, query?: TopologyQuery) => Promise<{
        nodes: any[];
        links: any[];
    }>;
    getNodesInSegment: (segmentId: string, NetworkNodeModel: any) => Promise<any[]>;
    getTopologyAdjacencyList: (sequelize: Sequelize) => Promise<Map<string, string[]>>;
    getLeafNodes: (sequelize: Sequelize) => Promise<any[]>;
    getTopologyTree: (rootNodeId: string, sequelize: Sequelize, maxDepth?: number) => Promise<any>;
    getCoreBackboneNodes: (sequelize: Sequelize, minConnections?: number) => Promise<any[]>;
    detectTopologyLoops: (sequelize: Sequelize) => Promise<any[]>;
    findShortestPath: (sourceNodeId: string, targetNodeId: string, sequelize: Sequelize) => Promise<NetworkPath | null>;
    findAllPaths: (sourceNodeId: string, targetNodeId: string, sequelize: Sequelize, maxPaths?: number) => Promise<NetworkPath[]>;
    findLowestLatencyPath: (sourceNodeId: string, targetNodeId: string, sequelize: Sequelize) => Promise<NetworkPath | null>;
    findMaxBandwidthPath: (sourceNodeId: string, targetNodeId: string, sequelize: Sequelize, requiredBandwidth: number) => Promise<NetworkPath | null>;
    findRedundantPaths: (sourceNodeId: string, targetNodeId: string, sequelize: Sequelize) => Promise<NetworkPath[]>;
    calculateECMPRoutes: (sourceNodeId: string, targetNodeId: string, sequelize: Sequelize) => Promise<NetworkPath[]>;
    validatePathConstraints: (path: NetworkPath, constraints: {
        maxLatency?: number;
        minBandwidth?: number;
        maxHops?: number;
        maxCost?: number;
    }) => boolean;
    discoverDirectNeighbors: (nodeId: string, sequelize: Sequelize) => Promise<any[]>;
    discoverNeighborsWithinHops: (nodeId: string, maxHops: number, sequelize: Sequelize) => Promise<any[]>;
    findCommonNeighbors: (nodeId1: string, nodeId2: string, sequelize: Sequelize) => Promise<any[]>;
    calculateNodeCentrality: (sequelize: Sequelize) => Promise<any[]>;
    identifyNetworkBridges: (sequelize: Sequelize) => Promise<any[]>;
    discoverBroadcastDomain: (nodeId: string, sequelize: Sequelize) => Promise<any[]>;
    buildNeighborAdjacencyMatrix: (sequelize: Sequelize) => Promise<Map<string, Map<string, number>>>;
    getNodeUtilization: (nodeId: string, NetworkNodeModel: any) => Promise<any>;
    getLinkUtilization: (nodeId: string, sequelize: Sequelize) => Promise<any[]>;
    findOverutilizedSegments: (threshold: number, sequelize: Sequelize) => Promise<any[]>;
    findUnderutilizedResources: (threshold: number, sequelize: Sequelize) => Promise<any[]>;
    getSegmentUtilization: (segmentId: string, sequelize: Sequelize) => Promise<any>;
    predictCapacityExhaustion: (nodeId: string, sequelize: Sequelize) => Promise<any>;
    getUtilizationHistory: (nodeId: string, startDate: Date, endDate: Date, sequelize: Sequelize) => Promise<any[]>;
    getNodePerformanceMetrics: (nodeId: string, sequelize: Sequelize) => Promise<any>;
    calculateAverageLatency: (sourceNodeId: string, targetNodeId: string, sequelize: Sequelize) => Promise<number>;
    identifyPerformanceBottlenecks: (sequelize: Sequelize) => Promise<any[]>;
    calculateQoSMetrics: (segmentId: string, sequelize: Sequelize) => Promise<any>;
    measureEndToEndPerformance: (sourceNodeId: string, targetNodeId: string, sequelize: Sequelize) => Promise<any>;
    bulkUpdateNodeStatus: (nodeIds: string[], status: string, NetworkNodeModel: any, transaction?: Transaction) => Promise<number>;
    bulkCreateLinks: (links: any[], NetworkLinkModel: any, transaction?: Transaction) => Promise<any[]>;
    bulkDeleteInactiveNodes: (inactiveSince: Date, NetworkNodeModel: any, transaction?: Transaction) => Promise<number>;
    createTopologyTransaction: (topologyData: {
        nodes: any[];
        links: any[];
    }, sequelize: Sequelize) => Promise<any>;
    updateNetworkConfigTransaction: (nodeId: string, updates: any, sequelize: Sequelize) => Promise<any>;
    recalculatePathTransaction: (sourceNodeId: string, targetNodeId: string, routeUpdates: any, sequelize: Sequelize) => Promise<NetworkPath | null>;
};
export default _default;
//# sourceMappingURL=network-queries-kit.d.ts.map