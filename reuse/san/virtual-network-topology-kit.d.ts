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
import { Sequelize, Transaction } from 'sequelize';
interface NetworkNode {
    id: string;
    name: string;
    type: 'switch' | 'router' | 'endpoint' | 'gateway' | 'firewall' | 'load-balancer';
    ipAddress?: string;
    macAddress?: string;
    location?: {
        x: number;
        y: number;
        z: number;
    };
    metadata: Record<string, any>;
    status: 'active' | 'inactive' | 'maintenance' | 'failed';
    capacity: number;
    utilization: number;
}
interface NetworkLink {
    id: string;
    sourceNodeId: string;
    targetNodeId: string;
    bandwidth: number;
    latency: number;
    cost: number;
    status: 'up' | 'down' | 'degraded';
    utilization: number;
    protocol?: string;
    vlanIds?: number[];
}
interface NetworkPath {
    nodes: string[];
    links: string[];
    totalCost: number;
    totalLatency: number;
    bandwidth: number;
    hops: number;
}
interface TopologyGraph {
    nodes: Map<string, NetworkNode>;
    adjacencyList: Map<string, Set<string>>;
    links: Map<string, NetworkLink>;
}
interface VLANSegment {
    id: number;
    name: string;
    description?: string;
    nodeIds: string[];
    isolationLevel: 'strict' | 'partial' | 'none';
    bandwidth: number;
    priority: number;
}
interface SubnetAllocation {
    network: string;
    cidr: number;
    gateway: string;
    broadcast: string;
    firstUsable: string;
    lastUsable: string;
    totalHosts: number;
    usableHosts: number;
}
interface IPRange {
    startIP: string;
    endIP: string;
    allocated: string[];
    available: string[];
}
interface TopologyValidationResult {
    valid: boolean;
    errors: string[];
    warnings: string[];
    suggestions: string[];
}
interface OptimizationSuggestion {
    type: 'link-redundancy' | 'load-balance' | 'consolidate' | 'upgrade';
    description: string;
    impact: 'high' | 'medium' | 'low';
    affectedNodes: string[];
    affectedLinks: string[];
    estimatedImprovement: number;
}
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
export declare const createNetworkTopologyModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        name: string;
        description: string;
        tenantId: string;
        metadata: Record<string, any>;
        status: string;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
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
export declare const createNetworkNodeModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        topologyId: string;
        name: string;
        type: string;
        ipAddress: string | null;
        macAddress: string | null;
        location: Record<string, number> | null;
        capacity: number;
        utilization: number;
        status: string;
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
export declare const createNetworkLinkModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        topologyId: string;
        sourceNodeId: string;
        targetNodeId: string;
        bandwidth: number;
        latency: number;
        cost: number;
        utilization: number;
        status: string;
        protocol: string | null;
        vlanIds: number[];
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
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
export declare const findShortestPath: (graph: TopologyGraph, sourceId: string, targetId: string, metric?: string) => NetworkPath | null;
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
export declare const findAllPaths: (graph: TopologyGraph, sourceId: string, targetId: string, maxHops?: number) => NetworkPath[];
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
export declare const calculateMinimumSpanningTree: (graph: TopologyGraph) => NetworkLink[];
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
export declare const detectCycles: (graph: TopologyGraph) => string[][];
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
export declare const findCriticalNodes: (graph: TopologyGraph) => string[];
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
export declare const createNetworkNode: (sequelize: Sequelize, nodeData: Partial<NetworkNode>, transaction?: Transaction) => Promise<NetworkNode>;
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
export declare const updateNetworkNode: (sequelize: Sequelize, nodeId: string, updates: Partial<NetworkNode>, transaction?: Transaction) => Promise<NetworkNode>;
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
export declare const deleteNetworkNode: (sequelize: Sequelize, nodeId: string, transaction?: Transaction) => Promise<void>;
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
export declare const getNodesByType: (sequelize: Sequelize, topologyId: string, type: string) => Promise<NetworkNode[]>;
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
export declare const getNodeNeighbors: (sequelize: Sequelize, nodeId: string) => Promise<NetworkNode[]>;
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
export declare const validateNodeConfiguration: (node: NetworkNode) => {
    valid: boolean;
    errors: string[];
};
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
export declare const assignNodeRole: (sequelize: Sequelize, nodeId: string, role: string, transaction?: Transaction) => Promise<NetworkNode>;
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
export declare const createNetworkLink: (sequelize: Sequelize, linkData: Partial<NetworkLink>, transaction?: Transaction) => Promise<NetworkLink>;
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
export declare const updateLinkMetrics: (sequelize: Sequelize, linkId: string, metrics: Partial<NetworkLink>, transaction?: Transaction) => Promise<NetworkLink>;
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
export declare const deleteLinkConnection: (sequelize: Sequelize, linkId: string, transaction?: Transaction) => Promise<void>;
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
export declare const validateLinkCapacity: (link: NetworkLink) => {
    valid: boolean;
    errors: string[];
};
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
export declare const calculateLinkUtilization: (link: NetworkLink, currentThroughput: number) => number;
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
export declare const findRedundantLinks: (sequelize: Sequelize, topologyId: string) => Promise<NetworkLink[][]>;
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
export declare const optimizeLinkRouting: (graph: TopologyGraph, sourceId: string, targetId: string) => NetworkPath | null;
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
export declare const validateTopologyIntegrity: (graph: TopologyGraph) => TopologyValidationResult;
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
export declare const checkConnectivity: (graph: TopologyGraph) => boolean;
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
export declare const validateBandwidthConstraints: (graph: TopologyGraph, threshold: number) => {
    valid: boolean;
    overutilized: NetworkLink[];
};
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
export declare const detectOrphanedNodes: (graph: TopologyGraph) => NetworkNode[];
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
export declare const validateRedundancy: (graph: TopologyGraph, minRedundancy: number) => {
    valid: boolean;
    nodesPaths: Map<string, number>;
};
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
export declare const checkLoopFreeTopology: (graph: TopologyGraph) => boolean;
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
export declare const optimizeNetworkTopology: (graph: TopologyGraph) => OptimizationSuggestion[];
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
export declare const balanceNetworkLoad: (graph: TopologyGraph, sourceId: string, targetId: string) => NetworkPath[];
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
export declare const suggestTopologyImprovements: (graph: TopologyGraph) => string[];
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
export declare const consolidateNetworkPaths: (graph: TopologyGraph) => NetworkLink[];
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
export declare const minimizeLatency: (graph: TopologyGraph) => Map<string, NetworkPath>;
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
export declare const optimizeForResilience: (graph: TopologyGraph) => OptimizationSuggestion[];
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
export declare const createVLANSegment: (sequelize: Sequelize, vlanData: Partial<VLANSegment>, transaction?: Transaction) => Promise<VLANSegment>;
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
export declare const assignNodeToVLAN: (sequelize: Sequelize, nodeId: string, vlanId: number, transaction?: Transaction) => Promise<NetworkNode>;
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
export declare const validateVLANIsolation: (graph: TopologyGraph, vlans: VLANSegment[]) => {
    valid: boolean;
    violations: string[];
};
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
export declare const calculateVLANUtilization: (graph: TopologyGraph, vlanId: number) => {
    totalCapacity: number;
    totalUtilization: number;
    nodeCount: number;
};
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
export declare const mergeVLANSegments: (sequelize: Sequelize, sourceVlanId: number, targetVlanId: number, transaction?: Transaction) => Promise<void>;
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
export declare const calculateSubnetMask: (cidr: number) => string;
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
export declare const allocateIPRange: (network: string, cidr: number) => SubnetAllocation;
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
export declare const validateIPAllocation: (ipAddress: string, subnet: SubnetAllocation) => boolean;
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
export declare const findAvailableIPs: (range: IPRange, count: number) => string[];
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
export declare const calculateNetworkCapacity: (cidr: number) => number;
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
export declare const generateIPAddressPlan: (graph: TopologyGraph, baseNetwork: string, cidr: number) => Map<string, string>;
declare const _default: {
    createNetworkTopologyModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            name: string;
            description: string;
            tenantId: string;
            metadata: Record<string, any>;
            status: string;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createNetworkNodeModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            topologyId: string;
            name: string;
            type: string;
            ipAddress: string | null;
            macAddress: string | null;
            location: Record<string, number> | null;
            capacity: number;
            utilization: number;
            status: string;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createNetworkLinkModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            topologyId: string;
            sourceNodeId: string;
            targetNodeId: string;
            bandwidth: number;
            latency: number;
            cost: number;
            utilization: number;
            status: string;
            protocol: string | null;
            vlanIds: number[];
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    findShortestPath: (graph: TopologyGraph, sourceId: string, targetId: string, metric?: string) => NetworkPath | null;
    findAllPaths: (graph: TopologyGraph, sourceId: string, targetId: string, maxHops?: number) => NetworkPath[];
    calculateMinimumSpanningTree: (graph: TopologyGraph) => NetworkLink[];
    detectCycles: (graph: TopologyGraph) => string[][];
    findCriticalNodes: (graph: TopologyGraph) => string[];
    createNetworkNode: (sequelize: Sequelize, nodeData: Partial<NetworkNode>, transaction?: Transaction) => Promise<NetworkNode>;
    updateNetworkNode: (sequelize: Sequelize, nodeId: string, updates: Partial<NetworkNode>, transaction?: Transaction) => Promise<NetworkNode>;
    deleteNetworkNode: (sequelize: Sequelize, nodeId: string, transaction?: Transaction) => Promise<void>;
    getNodesByType: (sequelize: Sequelize, topologyId: string, type: string) => Promise<NetworkNode[]>;
    getNodeNeighbors: (sequelize: Sequelize, nodeId: string) => Promise<NetworkNode[]>;
    validateNodeConfiguration: (node: NetworkNode) => {
        valid: boolean;
        errors: string[];
    };
    assignNodeRole: (sequelize: Sequelize, nodeId: string, role: string, transaction?: Transaction) => Promise<NetworkNode>;
    createNetworkLink: (sequelize: Sequelize, linkData: Partial<NetworkLink>, transaction?: Transaction) => Promise<NetworkLink>;
    updateLinkMetrics: (sequelize: Sequelize, linkId: string, metrics: Partial<NetworkLink>, transaction?: Transaction) => Promise<NetworkLink>;
    deleteLinkConnection: (sequelize: Sequelize, linkId: string, transaction?: Transaction) => Promise<void>;
    validateLinkCapacity: (link: NetworkLink) => {
        valid: boolean;
        errors: string[];
    };
    calculateLinkUtilization: (link: NetworkLink, currentThroughput: number) => number;
    findRedundantLinks: (sequelize: Sequelize, topologyId: string) => Promise<NetworkLink[][]>;
    optimizeLinkRouting: (graph: TopologyGraph, sourceId: string, targetId: string) => NetworkPath | null;
    validateTopologyIntegrity: (graph: TopologyGraph) => TopologyValidationResult;
    checkConnectivity: (graph: TopologyGraph) => boolean;
    validateBandwidthConstraints: (graph: TopologyGraph, threshold: number) => {
        valid: boolean;
        overutilized: NetworkLink[];
    };
    detectOrphanedNodes: (graph: TopologyGraph) => NetworkNode[];
    validateRedundancy: (graph: TopologyGraph, minRedundancy: number) => {
        valid: boolean;
        nodesPaths: Map<string, number>;
    };
    checkLoopFreeTopology: (graph: TopologyGraph) => boolean;
    optimizeNetworkTopology: (graph: TopologyGraph) => OptimizationSuggestion[];
    balanceNetworkLoad: (graph: TopologyGraph, sourceId: string, targetId: string) => NetworkPath[];
    suggestTopologyImprovements: (graph: TopologyGraph) => string[];
    consolidateNetworkPaths: (graph: TopologyGraph) => NetworkLink[];
    minimizeLatency: (graph: TopologyGraph) => Map<string, NetworkPath>;
    optimizeForResilience: (graph: TopologyGraph) => OptimizationSuggestion[];
    createVLANSegment: (sequelize: Sequelize, vlanData: Partial<VLANSegment>, transaction?: Transaction) => Promise<VLANSegment>;
    assignNodeToVLAN: (sequelize: Sequelize, nodeId: string, vlanId: number, transaction?: Transaction) => Promise<NetworkNode>;
    validateVLANIsolation: (graph: TopologyGraph, vlans: VLANSegment[]) => {
        valid: boolean;
        violations: string[];
    };
    calculateVLANUtilization: (graph: TopologyGraph, vlanId: number) => {
        totalCapacity: number;
        totalUtilization: number;
        nodeCount: number;
    };
    mergeVLANSegments: (sequelize: Sequelize, sourceVlanId: number, targetVlanId: number, transaction?: Transaction) => Promise<void>;
    calculateSubnetMask: (cidr: number) => string;
    allocateIPRange: (network: string, cidr: number) => SubnetAllocation;
    validateIPAllocation: (ipAddress: string, subnet: SubnetAllocation) => boolean;
    findAvailableIPs: (range: IPRange, count: number) => string[];
    calculateNetworkCapacity: (cidr: number) => number;
    generateIPAddressPlan: (graph: TopologyGraph, baseNetwork: string, cidr: number) => Map<string, string>;
};
export default _default;
//# sourceMappingURL=virtual-network-topology-kit.d.ts.map