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

import { Model, DataTypes, Sequelize, Op, Transaction } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface NetworkNode {
  id: string;
  name: string;
  type: 'switch' | 'router' | 'endpoint' | 'gateway' | 'firewall' | 'load-balancer';
  ipAddress?: string;
  macAddress?: string;
  location?: { x: number; y: number; z: number };
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
export const createNetworkTopologyModel = (sequelize: Sequelize) => {
  class NetworkTopology extends Model {
    public id!: string;
    public name!: string;
    public description!: string;
    public tenantId!: string;
    public metadata!: Record<string, any>;
    public status!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  NetworkTopology.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Network topology name',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Topology description',
      },
      tenantId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Tenant identifier',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'maintenance'),
        allowNull: false,
        defaultValue: 'active',
        comment: 'Topology status',
      },
    },
    {
      sequelize,
      tableName: 'network_topologies',
      timestamps: true,
      indexes: [
        { fields: ['tenantId'] },
        { fields: ['status'] },
        { fields: ['name'] },
      ],
    },
  );

  return NetworkTopology;
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
export const createNetworkNodeModel = (sequelize: Sequelize) => {
  class NetworkNode extends Model {
    public id!: string;
    public topologyId!: string;
    public name!: string;
    public type!: string;
    public ipAddress!: string | null;
    public macAddress!: string | null;
    public location!: Record<string, number> | null;
    public capacity!: number;
    public utilization!: number;
    public status!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  NetworkNode.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      topologyId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Parent topology ID',
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Node name',
      },
      type: {
        type: DataTypes.ENUM('switch', 'router', 'endpoint', 'gateway', 'firewall', 'load-balancer'),
        allowNull: false,
        comment: 'Node type',
      },
      ipAddress: {
        type: DataTypes.STRING(45),
        allowNull: true,
        comment: 'IP address (IPv4 or IPv6)',
      },
      macAddress: {
        type: DataTypes.STRING(17),
        allowNull: true,
        comment: 'MAC address',
      },
      location: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: '3D coordinates {x, y, z}',
      },
      capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1000,
        comment: 'Node capacity (Mbps)',
      },
      utilization: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
        comment: 'Current utilization (0-100%)',
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'maintenance', 'failed'),
        allowNull: false,
        defaultValue: 'active',
        comment: 'Node status',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'network_nodes',
      timestamps: true,
      indexes: [
        { fields: ['topologyId'] },
        { fields: ['type'] },
        { fields: ['status'] },
        { fields: ['ipAddress'] },
      ],
    },
  );

  return NetworkNode;
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
export const createNetworkLinkModel = (sequelize: Sequelize) => {
  class NetworkLink extends Model {
    public id!: string;
    public topologyId!: string;
    public sourceNodeId!: string;
    public targetNodeId!: string;
    public bandwidth!: number;
    public latency!: number;
    public cost!: number;
    public utilization!: number;
    public status!: string;
    public protocol!: string | null;
    public vlanIds!: number[];
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  NetworkLink.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      topologyId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Parent topology ID',
      },
      sourceNodeId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Source node ID',
      },
      targetNodeId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Target node ID',
      },
      bandwidth: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1000,
        comment: 'Link bandwidth (Mbps)',
      },
      latency: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 1,
        comment: 'Link latency (ms)',
      },
      cost: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: 'Link cost metric',
      },
      utilization: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
        comment: 'Current utilization (0-100%)',
      },
      status: {
        type: DataTypes.ENUM('up', 'down', 'degraded'),
        allowNull: false,
        defaultValue: 'up',
        comment: 'Link status',
      },
      protocol: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Protocol (e.g., BGP, OSPF)',
      },
      vlanIds: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Associated VLAN IDs',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'network_links',
      timestamps: true,
      indexes: [
        { fields: ['topologyId'] },
        { fields: ['sourceNodeId'] },
        { fields: ['targetNodeId'] },
        { fields: ['status'] },
      ],
    },
  );

  return NetworkLink;
};

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
export const findShortestPath = (
  graph: TopologyGraph,
  sourceId: string,
  targetId: string,
  metric: string = 'cost',
): NetworkPath | null => {
  const distances = new Map<string, number>();
  const previous = new Map<string, string | null>();
  const unvisited = new Set(graph.nodes.keys());

  // Initialize distances
  for (const nodeId of graph.nodes.keys()) {
    distances.set(nodeId, nodeId === sourceId ? 0 : Infinity);
    previous.set(nodeId, null);
  }

  while (unvisited.size > 0) {
    // Find node with minimum distance
    let currentId: string | null = null;
    let minDistance = Infinity;

    for (const nodeId of unvisited) {
      const dist = distances.get(nodeId)!;
      if (dist < minDistance) {
        minDistance = dist;
        currentId = nodeId;
      }
    }

    if (currentId === null || minDistance === Infinity) break;
    if (currentId === targetId) break;

    unvisited.delete(currentId);

    // Update neighbors
    const neighbors = graph.adjacencyList.get(currentId) || new Set();
    for (const neighborId of neighbors) {
      if (!unvisited.has(neighborId)) continue;

      const link = findLinkBetween(graph, currentId, neighborId);
      if (!link || link.status !== 'up') continue;

      const weight = metric === 'latency' ? link.latency : metric === 'hops' ? 1 : link.cost;
      const alt = distances.get(currentId)! + weight;

      if (alt < distances.get(neighborId)!) {
        distances.set(neighborId, alt);
        previous.set(neighborId, currentId);
      }
    }
  }

  // Reconstruct path
  if (distances.get(targetId) === Infinity) return null;

  const path: string[] = [];
  let current: string | null = targetId;

  while (current !== null) {
    path.unshift(current);
    current = previous.get(current)!;
  }

  // Calculate path metrics
  const links: string[] = [];
  let totalCost = 0;
  let totalLatency = 0;
  let minBandwidth = Infinity;

  for (let i = 0; i < path.length - 1; i++) {
    const link = findLinkBetween(graph, path[i], path[i + 1])!;
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
export const findAllPaths = (
  graph: TopologyGraph,
  sourceId: string,
  targetId: string,
  maxHops: number = 10,
): NetworkPath[] => {
  const allPaths: NetworkPath[] = [];

  const dfs = (currentId: string, visited: Set<string>, path: string[]): void => {
    if (path.length > maxHops) return;
    if (currentId === targetId) {
      allPaths.push(buildPathFromNodes(graph, path));
      return;
    }

    const neighbors = graph.adjacencyList.get(currentId) || new Set();
    for (const neighborId of neighbors) {
      if (visited.has(neighborId)) continue;

      const link = findLinkBetween(graph, currentId, neighborId);
      if (!link || link.status !== 'up') continue;

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
export const calculateMinimumSpanningTree = (graph: TopologyGraph): NetworkLink[] => {
  const edges = Array.from(graph.links.values()).sort((a, b) => a.cost - b.cost);
  const parent = new Map<string, string>();
  const rank = new Map<string, number>();

  // Initialize union-find
  for (const nodeId of graph.nodes.keys()) {
    parent.set(nodeId, nodeId);
    rank.set(nodeId, 0);
  }

  const find = (nodeId: string): string => {
    if (parent.get(nodeId) !== nodeId) {
      parent.set(nodeId, find(parent.get(nodeId)!));
    }
    return parent.get(nodeId)!;
  };

  const union = (node1: string, node2: string): boolean => {
    const root1 = find(node1);
    const root2 = find(node2);

    if (root1 === root2) return false;

    const rank1 = rank.get(root1)!;
    const rank2 = rank.get(root2)!;

    if (rank1 < rank2) {
      parent.set(root1, root2);
    } else if (rank1 > rank2) {
      parent.set(root2, root1);
    } else {
      parent.set(root2, root1);
      rank.set(root1, rank1 + 1);
    }

    return true;
  };

  const mst: NetworkLink[] = [];

  for (const edge of edges) {
    if (union(edge.sourceNodeId, edge.targetNodeId)) {
      mst.push(edge);
      if (mst.length === graph.nodes.size - 1) break;
    }
  }

  return mst;
};

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
export const detectCycles = (graph: TopologyGraph): string[][] => {
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  const cycles: string[][] = [];

  const dfs = (nodeId: string, path: string[]): void => {
    visited.add(nodeId);
    recursionStack.add(nodeId);
    path.push(nodeId);

    const neighbors = graph.adjacencyList.get(nodeId) || new Set();
    for (const neighborId of neighbors) {
      if (!visited.has(neighborId)) {
        dfs(neighborId, [...path]);
      } else if (recursionStack.has(neighborId)) {
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
export const findCriticalNodes = (graph: TopologyGraph): string[] => {
  const visited = new Set<string>();
  const disc = new Map<string, number>();
  const low = new Map<string, number>();
  const parent = new Map<string, string | null>();
  const articulationPoints = new Set<string>();
  let time = 0;

  const dfs = (nodeId: string): void => {
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

        low.set(nodeId, Math.min(low.get(nodeId)!, low.get(neighborId)!));

        // Check articulation point conditions
        if (parent.get(nodeId) === null && children > 1) {
          articulationPoints.add(nodeId);
        }

        if (parent.get(nodeId) !== null && low.get(neighborId)! >= disc.get(nodeId)!) {
          articulationPoints.add(nodeId);
        }
      } else if (neighborId !== parent.get(nodeId)) {
        low.set(nodeId, Math.min(low.get(nodeId)!, disc.get(neighborId)!));
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
export const createNetworkNode = async (
  sequelize: Sequelize,
  nodeData: Partial<NetworkNode>,
  transaction?: Transaction,
): Promise<NetworkNode> => {
  const NodeModel = sequelize.models.NetworkNode as any;
  return NodeModel.create(nodeData, { transaction });
};

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
export const updateNetworkNode = async (
  sequelize: Sequelize,
  nodeId: string,
  updates: Partial<NetworkNode>,
  transaction?: Transaction,
): Promise<NetworkNode> => {
  const NodeModel = sequelize.models.NetworkNode as any;
  const node = await NodeModel.findByPk(nodeId, { transaction });
  if (!node) throw new Error(`Node ${nodeId} not found`);

  await node.update(updates, { transaction });
  return node;
};

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
export const deleteNetworkNode = async (
  sequelize: Sequelize,
  nodeId: string,
  transaction?: Transaction,
): Promise<void> => {
  const NodeModel = sequelize.models.NetworkNode as any;
  const LinkModel = sequelize.models.NetworkLink as any;

  // Delete associated links
  await LinkModel.destroy({
    where: {
      [Op.or]: [{ sourceNodeId: nodeId }, { targetNodeId: nodeId }],
    },
    transaction,
  });

  // Delete node
  await NodeModel.destroy({ where: { id: nodeId }, transaction });
};

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
export const getNodesByType = async (
  sequelize: Sequelize,
  topologyId: string,
  type: string,
): Promise<NetworkNode[]> => {
  const NodeModel = sequelize.models.NetworkNode as any;
  return NodeModel.findAll({ where: { topologyId, type } });
};

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
export const getNodeNeighbors = async (
  sequelize: Sequelize,
  nodeId: string,
): Promise<NetworkNode[]> => {
  const LinkModel = sequelize.models.NetworkLink as any;
  const NodeModel = sequelize.models.NetworkNode as any;

  const links = await LinkModel.findAll({
    where: {
      [Op.or]: [{ sourceNodeId: nodeId }, { targetNodeId: nodeId }],
    },
  });

  const neighborIds = new Set<string>();
  links.forEach((link: any) => {
    if (link.sourceNodeId !== nodeId) neighborIds.add(link.sourceNodeId);
    if (link.targetNodeId !== nodeId) neighborIds.add(link.targetNodeId);
  });

  return NodeModel.findAll({ where: { id: Array.from(neighborIds) } });
};

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
export const validateNodeConfiguration = (
  node: NetworkNode,
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

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
export const assignNodeRole = async (
  sequelize: Sequelize,
  nodeId: string,
  role: string,
  transaction?: Transaction,
): Promise<NetworkNode> => {
  const NodeModel = sequelize.models.NetworkNode as any;
  const node = await NodeModel.findByPk(nodeId, { transaction });
  if (!node) throw new Error(`Node ${nodeId} not found`);

  node.metadata = { ...node.metadata, role };
  await node.save({ transaction });
  return node;
};

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
export const createNetworkLink = async (
  sequelize: Sequelize,
  linkData: Partial<NetworkLink>,
  transaction?: Transaction,
): Promise<NetworkLink> => {
  const LinkModel = sequelize.models.NetworkLink as any;
  return LinkModel.create(linkData, { transaction });
};

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
export const updateLinkMetrics = async (
  sequelize: Sequelize,
  linkId: string,
  metrics: Partial<NetworkLink>,
  transaction?: Transaction,
): Promise<NetworkLink> => {
  const LinkModel = sequelize.models.NetworkLink as any;
  const link = await LinkModel.findByPk(linkId, { transaction });
  if (!link) throw new Error(`Link ${linkId} not found`);

  await link.update(metrics, { transaction });
  return link;
};

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
export const deleteLinkConnection = async (
  sequelize: Sequelize,
  linkId: string,
  transaction?: Transaction,
): Promise<void> => {
  const LinkModel = sequelize.models.NetworkLink as any;
  await LinkModel.destroy({ where: { id: linkId }, transaction });
};

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
export const validateLinkCapacity = (
  link: NetworkLink,
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

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
export const calculateLinkUtilization = (link: NetworkLink, currentThroughput: number): number => {
  return (currentThroughput / link.bandwidth) * 100;
};

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
export const findRedundantLinks = async (
  sequelize: Sequelize,
  topologyId: string,
): Promise<NetworkLink[][]> => {
  const LinkModel = sequelize.models.NetworkLink as any;
  const links = await LinkModel.findAll({ where: { topologyId } });

  const linkMap = new Map<string, NetworkLink[]>();

  links.forEach((link: NetworkLink) => {
    const key = [link.sourceNodeId, link.targetNodeId].sort().join('-');
    if (!linkMap.has(key)) linkMap.set(key, []);
    linkMap.get(key)!.push(link);
  });

  return Array.from(linkMap.values()).filter((group) => group.length > 1);
};

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
export const optimizeLinkRouting = (
  graph: TopologyGraph,
  sourceId: string,
  targetId: string,
): NetworkPath | null => {
  // Find path that minimizes max utilization
  const paths = findAllPaths(graph, sourceId, targetId);
  if (paths.length === 0) return null;

  let bestPath = paths[0];
  let minMaxUtilization = Infinity;

  for (const path of paths) {
    let maxUtilization = 0;
    for (const linkId of path.links) {
      const link = graph.links.get(linkId)!;
      maxUtilization = Math.max(maxUtilization, link.utilization);
    }

    if (maxUtilization < minMaxUtilization) {
      minMaxUtilization = maxUtilization;
      bestPath = path;
    }
  }

  return bestPath;
};

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
export const validateTopologyIntegrity = (graph: TopologyGraph): TopologyValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];

  // Check for orphaned nodes
  const orphaned = [];
  for (const [nodeId, neighbors] of graph.adjacencyList.entries()) {
    if (neighbors.size === 0) {
      orphaned.push(nodeId);
      errors.push(`Node ${nodeId} has no connections`);
    }
  }

  // Check for single points of failure
  const critical = findCriticalNodes(graph);
  if (critical.length > 0) {
    warnings.push(`Found ${critical.length} critical nodes (single points of failure)`);
    suggestions.push('Consider adding redundant links to critical nodes');
  }

  // Check connectivity
  const connected = checkConnectivity(graph);
  if (!connected) {
    errors.push('Network topology is not fully connected');
  }

  // Check for cycles (may be intentional for redundancy)
  const cycles = detectCycles(graph);
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
export const checkConnectivity = (graph: TopologyGraph): boolean => {
  if (graph.nodes.size === 0) return true;

  const visited = new Set<string>();
  const stack = [Array.from(graph.nodes.keys())[0]];

  while (stack.length > 0) {
    const nodeId = stack.pop()!;
    if (visited.has(nodeId)) continue;

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
export const validateBandwidthConstraints = (
  graph: TopologyGraph,
  threshold: number,
): { valid: boolean; overutilized: NetworkLink[] } => {
  const overutilized: NetworkLink[] = [];

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
export const detectOrphanedNodes = (graph: TopologyGraph): NetworkNode[] => {
  const orphaned: NetworkNode[] = [];

  for (const [nodeId, neighbors] of graph.adjacencyList.entries()) {
    if (neighbors.size === 0) {
      const node = graph.nodes.get(nodeId);
      if (node) orphaned.push(node);
    }
  }

  return orphaned;
};

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
export const validateRedundancy = (
  graph: TopologyGraph,
  minRedundancy: number,
): { valid: boolean; nodesPaths: Map<string, number> } => {
  const nodesPaths = new Map<string, number>();

  // For simplification, check redundancy from first node
  const nodes = Array.from(graph.nodes.keys());
  if (nodes.length < 2) return { valid: true, nodesPaths };

  const source = nodes[0];

  for (let i = 1; i < nodes.length; i++) {
    const target = nodes[i];
    const paths = findAllPaths(graph, source, target);
    nodesPaths.set(target, paths.length);
  }

  const valid = Array.from(nodesPaths.values()).every((count) => count >= minRedundancy);

  return { valid, nodesPaths };
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
export const checkLoopFreeTopology = (graph: TopologyGraph): boolean => {
  const cycles = detectCycles(graph);
  return cycles.length === 0;
};

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
export const optimizeNetworkTopology = (graph: TopologyGraph): OptimizationSuggestion[] => {
  const suggestions: OptimizationSuggestion[] = [];

  // Find critical nodes
  const critical = findCriticalNodes(graph);
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
export const balanceNetworkLoad = (
  graph: TopologyGraph,
  sourceId: string,
  targetId: string,
): NetworkPath[] => {
  const paths = findAllPaths(graph, sourceId, targetId);

  // Sort by current utilization (prefer less utilized paths)
  return paths.sort((a, b) => {
    const aMaxUtil = Math.max(...a.links.map((id) => graph.links.get(id)!.utilization));
    const bMaxUtil = Math.max(...b.links.map((id) => graph.links.get(id)!.utilization));
    return aMaxUtil - bMaxUtil;
  });
};

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
export const suggestTopologyImprovements = (graph: TopologyGraph): string[] => {
  const suggestions: string[] = [];

  const validation = validateTopologyIntegrity(graph);
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
export const consolidateNetworkPaths = (graph: TopologyGraph): NetworkLink[] => {
  const redundantGroups = [];
  const linkMap = new Map<string, NetworkLink[]>();

  for (const link of graph.links.values()) {
    const key = [link.sourceNodeId, link.targetNodeId].sort().join('-');
    if (!linkMap.has(key)) linkMap.set(key, []);
    linkMap.get(key)!.push(link);
  }

  const removable: NetworkLink[] = [];

  for (const links of linkMap.values()) {
    if (links.length > 2) {
      // Keep 2 for redundancy, mark others as removable
      const sorted = links.sort((a, b) => b.bandwidth - a.bandwidth);
      removable.push(...sorted.slice(2));
    }
  }

  return removable;
};

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
export const minimizeLatency = (graph: TopologyGraph): Map<string, NetworkPath> => {
  const optimizedPaths = new Map<string, NetworkPath>();
  const nodes = Array.from(graph.nodes.keys());

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const path = findShortestPath(graph, nodes[i], nodes[j], 'latency');
      if (path) {
        optimizedPaths.set(`${nodes[i]}-${nodes[j]}`, path);
      }
    }
  }

  return optimizedPaths;
};

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
export const optimizeForResilience = (graph: TopologyGraph): OptimizationSuggestion[] => {
  const suggestions: OptimizationSuggestion[] = [];

  // Identify critical nodes
  const critical = findCriticalNodes(graph);
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
export const createVLANSegment = async (
  sequelize: Sequelize,
  vlanData: Partial<VLANSegment>,
  transaction?: Transaction,
): Promise<VLANSegment> => {
  // Store in custom VLAN table or metadata
  return vlanData as VLANSegment;
};

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
export const assignNodeToVLAN = async (
  sequelize: Sequelize,
  nodeId: string,
  vlanId: number,
  transaction?: Transaction,
): Promise<NetworkNode> => {
  const NodeModel = sequelize.models.NetworkNode as any;
  const node = await NodeModel.findByPk(nodeId, { transaction });
  if (!node) throw new Error(`Node ${nodeId} not found`);

  node.metadata = { ...node.metadata, vlanId };
  await node.save({ transaction });
  return node;
};

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
export const validateVLANIsolation = (
  graph: TopologyGraph,
  vlans: VLANSegment[],
): { valid: boolean; violations: string[] } => {
  const violations: string[] = [];

  for (const vlan of vlans) {
    if (vlan.isolationLevel === 'strict') {
      // Check for cross-VLAN links
      for (const nodeId of vlan.nodeIds) {
        const neighbors = graph.adjacencyList.get(nodeId) || new Set();
        for (const neighborId of neighbors) {
          const neighbor = graph.nodes.get(neighborId);
          if (neighbor && (neighbor.metadata.vlanId !== vlan.id)) {
            violations.push(
              `Strict isolation violated: node ${nodeId} (VLAN ${vlan.id}) connected to node ${neighborId} (VLAN ${neighbor.metadata.vlanId})`,
            );
          }
        }
      }
    }
  }

  return { valid: violations.length === 0, violations };
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
export const calculateVLANUtilization = (
  graph: TopologyGraph,
  vlanId: number,
): { totalCapacity: number; totalUtilization: number; nodeCount: number } => {
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
export const mergeVLANSegments = async (
  sequelize: Sequelize,
  sourceVlanId: number,
  targetVlanId: number,
  transaction?: Transaction,
): Promise<void> => {
  const NodeModel = sequelize.models.NetworkNode as any;

  await NodeModel.update(
    { metadata: sequelize.literal(`jsonb_set(metadata, '{vlanId}', '${targetVlanId}'::jsonb)`) },
    {
      where: sequelize.literal(`metadata->>'vlanId' = '${sourceVlanId}'`),
      transaction,
    },
  );
};

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
export const calculateSubnetMask = (cidr: number): string => {
  const mask = [];
  for (let i = 0; i < 4; i++) {
    const bits = Math.max(0, Math.min(8, cidr - i * 8));
    mask.push(256 - Math.pow(2, 8 - bits));
  }
  return mask.join('.');
};

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
export const allocateIPRange = (network: string, cidr: number): SubnetAllocation => {
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
export const validateIPAllocation = (ipAddress: string, subnet: SubnetAllocation): boolean => {
  const ip = ipToInt(ipAddress);
  const network = ipToInt(subnet.network);
  const first = ipToInt(subnet.firstUsable);
  const last = ipToInt(subnet.lastUsable);

  return ip >= first && ip <= last;
};

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
export const findAvailableIPs = (range: IPRange, count: number): string[] => {
  const available: string[] = [];
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
export const calculateNetworkCapacity = (cidr: number): number => {
  return Math.pow(2, 32 - cidr);
};

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
export const generateIPAddressPlan = (
  graph: TopologyGraph,
  baseNetwork: string,
  cidr: number,
): Map<string, string> => {
  const plan = new Map<string, string>();
  const subnet = allocateIPRange(baseNetwork, cidr);

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

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function findLinkBetween(graph: TopologyGraph, node1: string, node2: string): NetworkLink | null {
  for (const link of graph.links.values()) {
    if (
      (link.sourceNodeId === node1 && link.targetNodeId === node2) ||
      (link.sourceNodeId === node2 && link.targetNodeId === node1)
    ) {
      return link;
    }
  }
  return null;
}

function buildPathFromNodes(graph: TopologyGraph, nodes: string[]): NetworkPath {
  const links: string[] = [];
  let totalCost = 0;
  let totalLatency = 0;
  let minBandwidth = Infinity;

  for (let i = 0; i < nodes.length - 1; i++) {
    const link = findLinkBetween(graph, nodes[i], nodes[i + 1])!;
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

function findImbalancedNodes(graph: TopologyGraph): string[] {
  const imbalanced: string[] = [];

  for (const node of graph.nodes.values()) {
    if (node.utilization > 80) {
      imbalanced.push(node.id);
    }
  }

  return imbalanced;
}

function calculateAveragePathLength(graph: TopologyGraph): number {
  const nodes = Array.from(graph.nodes.keys());
  let totalLength = 0;
  let pathCount = 0;

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const path = findShortestPath(graph, nodes[i], nodes[j]);
      if (path) {
        totalLength += path.hops;
        pathCount++;
      }
    }
  }

  return pathCount > 0 ? totalLength / pathCount : 0;
}

function isValidIP(ip: string): boolean {
  const parts = ip.split('.');
  if (parts.length !== 4) return false;
  return parts.every((part) => {
    const num = parseInt(part, 10);
    return num >= 0 && num <= 255;
  });
}

function isValidMAC(mac: string): boolean {
  return /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(mac);
}

function ipToInt(ip: string): number {
  const parts = ip.split('.').map(Number);
  return (parts[0] << 24) + (parts[1] << 16) + (parts[2] << 8) + parts[3];
}

function intToIP(num: number): string {
  return [
    (num >>> 24) & 255,
    (num >>> 16) & 255,
    (num >>> 8) & 255,
    num & 255,
  ].join('.');
}

export default {
  // Sequelize Models
  createNetworkTopologyModel,
  createNetworkNodeModel,
  createNetworkLinkModel,

  // Graph Algorithms
  findShortestPath,
  findAllPaths,
  calculateMinimumSpanningTree,
  detectCycles,
  findCriticalNodes,

  // Node Management
  createNetworkNode,
  updateNetworkNode,
  deleteNetworkNode,
  getNodesByType,
  getNodeNeighbors,
  validateNodeConfiguration,
  assignNodeRole,

  // Link Management
  createNetworkLink,
  updateLinkMetrics,
  deleteLinkConnection,
  validateLinkCapacity,
  calculateLinkUtilization,
  findRedundantLinks,
  optimizeLinkRouting,

  // Topology Validation
  validateTopologyIntegrity,
  checkConnectivity,
  validateBandwidthConstraints,
  detectOrphanedNodes,
  validateRedundancy,
  checkLoopFreeTopology,

  // Topology Optimization
  optimizeNetworkTopology,
  balanceNetworkLoad,
  suggestTopologyImprovements,
  consolidateNetworkPaths,
  minimizeLatency,
  optimizeForResilience,

  // Network Segmentation
  createVLANSegment,
  assignNodeToVLAN,
  validateVLANIsolation,
  calculateVLANUtilization,
  mergeVLANSegments,

  // IP Allocation
  calculateSubnetMask,
  allocateIPRange,
  validateIPAllocation,
  findAvailableIPs,
  calculateNetworkCapacity,
  generateIPAddressPlan,
};
