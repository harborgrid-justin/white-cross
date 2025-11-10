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

import { Model, DataTypes, Sequelize, Op, Transaction, QueryTypes } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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

interface UtilizationMetrics {
  nodeId: string;
  cpuUtilization: number;
  memoryUtilization: number;
  bandwidthUtilization: number;
  packetRate: number;
  errorRate: number;
  timestamp: Date;
}

interface PerformanceMetrics {
  throughput: number;
  latency: number;
  jitter: number;
  packetLoss: number;
  availability: number;
  timestamp: Date;
}

interface NetworkSegment {
  id: number;
  segmentId: string;
  name: string;
  vlanId?: number;
  subnet: string;
  gateway: string;
  isolationLevel: 'none' | 'partial' | 'strict';
  metadata: Record<string, any>;
}

interface RouteEntry {
  destination: string;
  nextHop: string;
  metric: number;
  interface: string;
  protocol: 'static' | 'dynamic' | 'bgp' | 'ospf' | 'eigrp';
}

interface NeighborInfo {
  nodeId: string;
  neighborId: string;
  relationship: 'direct' | 'indirect';
  distance: number;
  linkQuality: number;
  protocol: string;
}

// ============================================================================
// SEQUELIZE MODELS (1-3)
// ============================================================================

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
export const createNetworkNodeModel = (sequelize: Sequelize) => {
  class NetworkNode extends Model {
    public id!: number;
    public nodeId!: string;
    public name!: string;
    public type!: string;
    public status!: string;
    public ipAddress!: string;
    public macAddress!: string | null;
    public location!: string | null;
    public capacity!: number;
    public currentLoad!: number;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  NetworkNode.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nodeId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Unique node identifier',
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Node name',
      },
      type: {
        type: DataTypes.ENUM('switch', 'router', 'firewall', 'load-balancer', 'gateway', 'endpoint'),
        allowNull: false,
        comment: 'Node type',
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'degraded', 'maintenance'),
        allowNull: false,
        defaultValue: 'active',
        comment: 'Node status',
      },
      ipAddress: {
        type: DataTypes.INET,
        allowNull: false,
        comment: 'IP address',
      },
      macAddress: {
        type: DataTypes.MACADDR,
        allowNull: true,
        comment: 'MAC address',
      },
      location: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Physical or logical location',
      },
      capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1000,
        comment: 'Node capacity (Mbps)',
      },
      currentLoad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Current load (Mbps)',
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
        { fields: ['nodeId'], unique: true },
        { fields: ['type'] },
        { fields: ['status'] },
        { fields: ['ipAddress'] },
        { fields: ['location'] },
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
export const createNetworkLinkModel = (sequelize: Sequelize) => {
  class NetworkLink extends Model {
    public id!: number;
    public linkId!: string;
    public sourceNodeId!: string;
    public targetNodeId!: string;
    public bandwidth!: number;
    public latency!: number;
    public status!: string;
    public utilization!: number;
    public cost!: number;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  NetworkLink.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      linkId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Unique link identifier',
      },
      sourceNodeId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Source node ID',
        references: {
          model: 'network_nodes',
          key: 'nodeId',
        },
      },
      targetNodeId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Target node ID',
        references: {
          model: 'network_nodes',
          key: 'nodeId',
        },
      },
      bandwidth: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Link bandwidth (Mbps)',
      },
      latency: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Link latency (ms)',
      },
      status: {
        type: DataTypes.ENUM('up', 'down', 'degraded'),
        allowNull: false,
        defaultValue: 'up',
        comment: 'Link status',
      },
      utilization: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Link utilization percentage',
      },
      cost: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: 'Link cost metric',
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
        { fields: ['linkId'], unique: true },
        { fields: ['sourceNodeId'] },
        { fields: ['targetNodeId'] },
        { fields: ['status'] },
        { fields: ['sourceNodeId', 'targetNodeId'] },
      ],
    },
  );

  return NetworkLink;
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
export const createNetworkSegmentModel = (sequelize: Sequelize) => {
  class NetworkSegment extends Model {
    public id!: number;
    public segmentId!: string;
    public name!: string;
    public vlanId!: number | null;
    public subnet!: string;
    public gateway!: string;
    public isolationLevel!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  NetworkSegment.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      segmentId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Unique segment identifier',
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Segment name',
      },
      vlanId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'VLAN ID',
      },
      subnet: {
        type: DataTypes.CIDR,
        allowNull: false,
        comment: 'Subnet CIDR',
      },
      gateway: {
        type: DataTypes.INET,
        allowNull: false,
        comment: 'Gateway IP address',
      },
      isolationLevel: {
        type: DataTypes.ENUM('none', 'partial', 'strict'),
        allowNull: false,
        defaultValue: 'partial',
        comment: 'Network isolation level',
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
      tableName: 'network_segments',
      timestamps: true,
      indexes: [
        { fields: ['segmentId'], unique: true },
        { fields: ['vlanId'] },
        { fields: ['subnet'] },
      ],
    },
  );

  return NetworkSegment;
};

// ============================================================================
// NETWORK TOPOLOGY QUERIES (4-10)
// ============================================================================

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
export const getNetworkTopology = async (
  sequelize: Sequelize,
  query?: TopologyQuery,
): Promise<{ nodes: any[]; links: any[] }> => {
  const whereClause: any = {};

  if (query?.nodeType && query.nodeType.length > 0) {
    whereClause.type = { [Op.in]: query.nodeType };
  }

  if (query?.status && query.status.length > 0) {
    whereClause.status = { [Op.in]: query.status };
  }

  if (query?.location) {
    whereClause.location = query.location;
  }

  const nodes = await sequelize.models.NetworkNode.findAll({
    where: whereClause,
    order: [['type', 'ASC'], ['name', 'ASC']],
  });

  let links: any[] = [];

  if (query?.includeLinks !== false) {
    const nodeIds = nodes.map((n: any) => n.nodeId);
    links = await sequelize.models.NetworkLink.findAll({
      where: {
        [Op.or]: [
          { sourceNodeId: { [Op.in]: nodeIds } },
          { targetNodeId: { [Op.in]: nodeIds } },
        ],
        status: { [Op.ne]: 'down' },
      },
    });
  }

  return { nodes, links };
};

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
export const getNodesInSegment = async (
  segmentId: string,
  NetworkNodeModel: any,
): Promise<any[]> => {
  const nodes = await NetworkNodeModel.findAll({
    where: {
      metadata: {
        segmentId,
      },
    },
    order: [['name', 'ASC']],
  });

  return nodes;
};

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
export const getTopologyAdjacencyList = async (
  sequelize: Sequelize,
): Promise<Map<string, string[]>> => {
  const links = await sequelize.models.NetworkLink.findAll({
    where: { status: 'up' },
    attributes: ['sourceNodeId', 'targetNodeId'],
  });

  const adjacencyList = new Map<string, string[]>();

  links.forEach((link: any) => {
    // Undirected graph - add both directions
    if (!adjacencyList.has(link.sourceNodeId)) {
      adjacencyList.set(link.sourceNodeId, []);
    }
    if (!adjacencyList.has(link.targetNodeId)) {
      adjacencyList.set(link.targetNodeId, []);
    }

    adjacencyList.get(link.sourceNodeId)!.push(link.targetNodeId);
    adjacencyList.get(link.targetNodeId)!.push(link.sourceNodeId);
  });

  return adjacencyList;
};

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
export const getLeafNodes = async (sequelize: Sequelize): Promise<any[]> => {
  const result = await sequelize.query(
    `
    SELECT n.*
    FROM network_nodes n
    WHERE n.node_id IN (
      SELECT node_id
      FROM (
        SELECT node_id, COUNT(*) as link_count
        FROM (
          SELECT source_node_id as node_id FROM network_links WHERE status = 'up'
          UNION ALL
          SELECT target_node_id as node_id FROM network_links WHERE status = 'up'
        ) links
        GROUP BY node_id
      ) counts
      WHERE link_count = 1
    )
    ORDER BY n.name
    `,
    { type: QueryTypes.SELECT },
  );

  return result;
};

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
export const getTopologyTree = async (
  rootNodeId: string,
  sequelize: Sequelize,
  maxDepth = 10,
): Promise<any> => {
  const result = await sequelize.query(
    `
    WITH RECURSIVE topology_tree AS (
      -- Base case: root node
      SELECT
        n.id,
        n.node_id,
        n.name,
        n.type,
        n.status,
        n.ip_address,
        0 as depth,
        ARRAY[n.node_id] as path
      FROM network_nodes n
      WHERE n.node_id = :rootNodeId

      UNION ALL

      -- Recursive case: connected nodes
      SELECT
        n.id,
        n.node_id,
        n.name,
        n.type,
        n.status,
        n.ip_address,
        tt.depth + 1,
        tt.path || n.node_id
      FROM network_nodes n
      INNER JOIN network_links l ON (l.target_node_id = n.node_id OR l.source_node_id = n.node_id)
      INNER JOIN topology_tree tt ON (
        (l.source_node_id = tt.node_id AND l.target_node_id = n.node_id) OR
        (l.target_node_id = tt.node_id AND l.source_node_id = n.node_id)
      )
      WHERE tt.depth < :maxDepth
        AND NOT (n.node_id = ANY(tt.path))
        AND l.status = 'up'
    )
    SELECT DISTINCT * FROM topology_tree
    ORDER BY depth, name
    `,
    {
      replacements: { rootNodeId, maxDepth },
      type: QueryTypes.SELECT,
    },
  );

  return result;
};

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
export const getCoreBackboneNodes = async (
  sequelize: Sequelize,
  minConnections = 5,
): Promise<any[]> => {
  const result = await sequelize.query(
    `
    SELECT
      n.*,
      COUNT(DISTINCT l.id) as connection_count
    FROM network_nodes n
    INNER JOIN network_links l ON (l.source_node_id = n.node_id OR l.target_node_id = n.node_id)
    WHERE n.type IN ('switch', 'router')
      AND n.status = 'active'
      AND l.status = 'up'
    GROUP BY n.id
    HAVING COUNT(DISTINCT l.id) >= :minConnections
    ORDER BY connection_count DESC
    `,
    {
      replacements: { minConnections },
      type: QueryTypes.SELECT,
    },
  );

  return result;
};

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
export const detectTopologyLoops = async (sequelize: Sequelize): Promise<any[]> => {
  const result = await sequelize.query(
    `
    WITH RECURSIVE path_trace AS (
      SELECT
        l.link_id,
        l.source_node_id,
        l.target_node_id,
        ARRAY[l.source_node_id, l.target_node_id] as path,
        1 as depth
      FROM network_links l
      WHERE l.status = 'up'

      UNION ALL

      SELECT
        l.link_id,
        pt.source_node_id,
        l.target_node_id,
        pt.path || l.target_node_id,
        pt.depth + 1
      FROM network_links l
      INNER JOIN path_trace pt ON l.source_node_id = pt.target_node_id
      WHERE pt.depth < 10
        AND l.status = 'up'
        AND l.target_node_id = ANY(pt.path)
    )
    SELECT DISTINCT
      source_node_id as loop_start,
      target_node_id as loop_end,
      path,
      depth as loop_length
    FROM path_trace
    WHERE target_node_id = source_node_id
    ORDER BY depth
    `,
    { type: QueryTypes.SELECT },
  );

  return result;
};

// ============================================================================
// NETWORK PATH FINDING (11-17)
// ============================================================================

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
export const findShortestPath = async (
  sourceNodeId: string,
  targetNodeId: string,
  sequelize: Sequelize,
): Promise<NetworkPath | null> => {
  const result = await sequelize.query(
    `
    WITH RECURSIVE shortest_path AS (
      SELECT
        :sourceNodeId as current_node,
        ARRAY[:sourceNodeId] as path,
        ARRAY[]::text[] as links,
        0 as total_cost,
        0.0 as total_latency,
        0 as hop_count

      UNION ALL

      SELECT
        l.target_node_id,
        sp.path || l.target_node_id,
        sp.links || l.link_id,
        sp.total_cost + l.cost,
        sp.total_latency + l.latency,
        sp.hop_count + 1
      FROM shortest_path sp
      INNER JOIN network_links l ON l.source_node_id = sp.current_node
      WHERE l.status = 'up'
        AND NOT (l.target_node_id = ANY(sp.path))
        AND sp.hop_count < 20
    )
    SELECT * FROM shortest_path
    WHERE current_node = :targetNodeId
    ORDER BY total_cost ASC, hop_count ASC
    LIMIT 1
    `,
    {
      replacements: { sourceNodeId, targetNodeId },
      type: QueryTypes.SELECT,
    },
  );

  if (result.length === 0) {
    return null;
  }

  const pathData: any = result[0];

  // Fetch node and link details
  const nodes = await sequelize.models.NetworkNode.findAll({
    where: { nodeId: { [Op.in]: pathData.path } },
  });

  const links = await sequelize.models.NetworkLink.findAll({
    where: { linkId: { [Op.in]: pathData.links } },
  });

  return {
    nodes: nodes as any[],
    links: links as any[],
    totalCost: pathData.total_cost,
    totalLatency: parseFloat(pathData.total_latency),
    totalBandwidth: Math.min(...links.map((l: any) => l.bandwidth)),
    hopCount: pathData.hop_count,
  };
};

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
export const findAllPaths = async (
  sourceNodeId: string,
  targetNodeId: string,
  sequelize: Sequelize,
  maxPaths = 10,
): Promise<NetworkPath[]> => {
  const result = await sequelize.query(
    `
    WITH RECURSIVE all_paths AS (
      SELECT
        :sourceNodeId as current_node,
        ARRAY[:sourceNodeId] as path,
        ARRAY[]::text[] as links,
        0 as total_cost,
        0.0 as total_latency,
        0 as hop_count

      UNION ALL

      SELECT
        l.target_node_id,
        ap.path || l.target_node_id,
        ap.links || l.link_id,
        ap.total_cost + l.cost,
        ap.total_latency + l.latency,
        ap.hop_count + 1
      FROM all_paths ap
      INNER JOIN network_links l ON l.source_node_id = ap.current_node
      WHERE l.status = 'up'
        AND NOT (l.target_node_id = ANY(ap.path))
        AND ap.hop_count < 15
    )
    SELECT * FROM all_paths
    WHERE current_node = :targetNodeId
    ORDER BY total_cost ASC, hop_count ASC
    LIMIT :maxPaths
    `,
    {
      replacements: { sourceNodeId, targetNodeId, maxPaths },
      type: QueryTypes.SELECT,
    },
  );

  const paths: NetworkPath[] = [];

  for (const pathData of result as any[]) {
    const nodes = await sequelize.models.NetworkNode.findAll({
      where: { nodeId: { [Op.in]: pathData.path } },
    });

    const links = await sequelize.models.NetworkLink.findAll({
      where: { linkId: { [Op.in]: pathData.links } },
    });

    paths.push({
      nodes: nodes as any[],
      links: links as any[],
      totalCost: pathData.total_cost,
      totalLatency: parseFloat(pathData.total_latency),
      totalBandwidth: Math.min(...links.map((l: any) => l.bandwidth)),
      hopCount: pathData.hop_count,
    });
  }

  return paths;
};

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
export const findLowestLatencyPath = async (
  sourceNodeId: string,
  targetNodeId: string,
  sequelize: Sequelize,
): Promise<NetworkPath | null> => {
  const result = await sequelize.query(
    `
    WITH RECURSIVE latency_path AS (
      SELECT
        :sourceNodeId as current_node,
        ARRAY[:sourceNodeId] as path,
        ARRAY[]::text[] as links,
        0.0 as total_latency,
        0 as hop_count

      UNION ALL

      SELECT
        l.target_node_id,
        lp.path || l.target_node_id,
        lp.links || l.link_id,
        lp.total_latency + l.latency,
        lp.hop_count + 1
      FROM latency_path lp
      INNER JOIN network_links l ON l.source_node_id = lp.current_node
      WHERE l.status = 'up'
        AND NOT (l.target_node_id = ANY(lp.path))
        AND lp.hop_count < 20
    )
    SELECT * FROM latency_path
    WHERE current_node = :targetNodeId
    ORDER BY total_latency ASC
    LIMIT 1
    `,
    {
      replacements: { sourceNodeId, targetNodeId },
      type: QueryTypes.SELECT,
    },
  );

  if (result.length === 0) {
    return null;
  }

  const pathData: any = result[0];

  const nodes = await sequelize.models.NetworkNode.findAll({
    where: { nodeId: { [Op.in]: pathData.path } },
  });

  const links = await sequelize.models.NetworkLink.findAll({
    where: { linkId: { [Op.in]: pathData.links } },
  });

  return {
    nodes: nodes as any[],
    links: links as any[],
    totalCost: links.reduce((sum: number, l: any) => sum + l.cost, 0),
    totalLatency: parseFloat(pathData.total_latency),
    totalBandwidth: Math.min(...links.map((l: any) => l.bandwidth)),
    hopCount: pathData.hop_count,
  };
};

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
export const findMaxBandwidthPath = async (
  sourceNodeId: string,
  targetNodeId: string,
  sequelize: Sequelize,
  requiredBandwidth: number,
): Promise<NetworkPath | null> => {
  const result = await sequelize.query(
    `
    WITH RECURSIVE bandwidth_path AS (
      SELECT
        :sourceNodeId as current_node,
        ARRAY[:sourceNodeId] as path,
        ARRAY[]::text[] as links,
        999999 as min_bandwidth,
        0 as hop_count

      UNION ALL

      SELECT
        l.target_node_id,
        bp.path || l.target_node_id,
        bp.links || l.link_id,
        LEAST(bp.min_bandwidth, l.bandwidth) as min_bandwidth,
        bp.hop_count + 1
      FROM bandwidth_path bp
      INNER JOIN network_links l ON l.source_node_id = bp.current_node
      WHERE l.status = 'up'
        AND l.bandwidth >= :requiredBandwidth
        AND NOT (l.target_node_id = ANY(bp.path))
        AND bp.hop_count < 20
    )
    SELECT * FROM bandwidth_path
    WHERE current_node = :targetNodeId
      AND min_bandwidth >= :requiredBandwidth
    ORDER BY min_bandwidth DESC, hop_count ASC
    LIMIT 1
    `,
    {
      replacements: { sourceNodeId, targetNodeId, requiredBandwidth },
      type: QueryTypes.SELECT,
    },
  );

  if (result.length === 0) {
    return null;
  }

  const pathData: any = result[0];

  const nodes = await sequelize.models.NetworkNode.findAll({
    where: { nodeId: { [Op.in]: pathData.path } },
  });

  const links = await sequelize.models.NetworkLink.findAll({
    where: { linkId: { [Op.in]: pathData.links } },
  });

  return {
    nodes: nodes as any[],
    links: links as any[],
    totalCost: links.reduce((sum: number, l: any) => sum + l.cost, 0),
    totalLatency: links.reduce((sum: number, l: any) => sum + parseFloat(l.latency), 0),
    totalBandwidth: pathData.min_bandwidth,
    hopCount: pathData.hop_count,
  };
};

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
export const findRedundantPaths = async (
  sourceNodeId: string,
  targetNodeId: string,
  sequelize: Sequelize,
): Promise<NetworkPath[]> => {
  // Find primary path first
  const primaryPath = await findShortestPath(sourceNodeId, targetNodeId, sequelize);

  if (!primaryPath) {
    return [];
  }

  // Find alternative paths that don't share links with primary
  const primaryLinkIds = primaryPath.links.map((l: any) => l.linkId);

  const result = await sequelize.query(
    `
    WITH RECURSIVE alternate_paths AS (
      SELECT
        :sourceNodeId as current_node,
        ARRAY[:sourceNodeId] as path,
        ARRAY[]::text[] as links,
        0 as total_cost,
        0 as hop_count

      UNION ALL

      SELECT
        l.target_node_id,
        ap.path || l.target_node_id,
        ap.links || l.link_id,
        ap.total_cost + l.cost,
        ap.hop_count + 1
      FROM alternate_paths ap
      INNER JOIN network_links l ON l.source_node_id = ap.current_node
      WHERE l.status = 'up'
        AND l.link_id != ALL(:excludedLinks::text[])
        AND NOT (l.target_node_id = ANY(ap.path))
        AND ap.hop_count < 20
    )
    SELECT * FROM alternate_paths
    WHERE current_node = :targetNodeId
    ORDER BY total_cost ASC
    LIMIT 3
    `,
    {
      replacements: { sourceNodeId, targetNodeId, excludedLinks: primaryLinkIds },
      type: QueryTypes.SELECT,
    },
  );

  const paths: NetworkPath[] = [primaryPath];

  for (const pathData of result as any[]) {
    const nodes = await sequelize.models.NetworkNode.findAll({
      where: { nodeId: { [Op.in]: pathData.path } },
    });

    const links = await sequelize.models.NetworkLink.findAll({
      where: { linkId: { [Op.in]: pathData.links } },
    });

    paths.push({
      nodes: nodes as any[],
      links: links as any[],
      totalCost: pathData.total_cost,
      totalLatency: links.reduce((sum: number, l: any) => sum + parseFloat(l.latency), 0),
      totalBandwidth: Math.min(...links.map((l: any) => l.bandwidth)),
      hopCount: pathData.hop_count,
    });
  }

  return paths;
};

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
export const calculateECMPRoutes = async (
  sourceNodeId: string,
  targetNodeId: string,
  sequelize: Sequelize,
): Promise<NetworkPath[]> => {
  // Find shortest path cost first
  const shortestPath = await findShortestPath(sourceNodeId, targetNodeId, sequelize);

  if (!shortestPath) {
    return [];
  }

  const minCost = shortestPath.totalCost;

  // Find all paths with same cost
  const result = await sequelize.query(
    `
    WITH RECURSIVE equal_cost_paths AS (
      SELECT
        :sourceNodeId as current_node,
        ARRAY[:sourceNodeId] as path,
        ARRAY[]::text[] as links,
        0 as total_cost,
        0 as hop_count

      UNION ALL

      SELECT
        l.target_node_id,
        ecp.path || l.target_node_id,
        ecp.links || l.link_id,
        ecp.total_cost + l.cost,
        ecp.hop_count + 1
      FROM equal_cost_paths ecp
      INNER JOIN network_links l ON l.source_node_id = ecp.current_node
      WHERE l.status = 'up'
        AND NOT (l.target_node_id = ANY(ecp.path))
        AND ecp.hop_count < 20
        AND (ecp.total_cost + l.cost) <= :maxCost
    )
    SELECT * FROM equal_cost_paths
    WHERE current_node = :targetNodeId
      AND total_cost = :minCost
    ORDER BY hop_count ASC
    `,
    {
      replacements: { sourceNodeId, targetNodeId, minCost, maxCost: minCost + 5 },
      type: QueryTypes.SELECT,
    },
  );

  const paths: NetworkPath[] = [];

  for (const pathData of result as any[]) {
    const nodes = await sequelize.models.NetworkNode.findAll({
      where: { nodeId: { [Op.in]: pathData.path } },
    });

    const links = await sequelize.models.NetworkLink.findAll({
      where: { linkId: { [Op.in]: pathData.links } },
    });

    paths.push({
      nodes: nodes as any[],
      links: links as any[],
      totalCost: pathData.total_cost,
      totalLatency: links.reduce((sum: number, l: any) => sum + parseFloat(l.latency), 0),
      totalBandwidth: Math.min(...links.map((l: any) => l.bandwidth)),
      hopCount: pathData.hop_count,
    });
  }

  return paths;
};

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
export const validatePathConstraints = (
  path: NetworkPath,
  constraints: {
    maxLatency?: number;
    minBandwidth?: number;
    maxHops?: number;
    maxCost?: number;
  },
): boolean => {
  if (constraints.maxLatency && path.totalLatency > constraints.maxLatency) {
    return false;
  }

  if (constraints.minBandwidth && path.totalBandwidth < constraints.minBandwidth) {
    return false;
  }

  if (constraints.maxHops && path.hopCount > constraints.maxHops) {
    return false;
  }

  if (constraints.maxCost && path.totalCost > constraints.maxCost) {
    return false;
  }

  return true;
};

// ============================================================================
// NEIGHBOR DISCOVERY (18-24)
// ============================================================================

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
export const discoverDirectNeighbors = async (
  nodeId: string,
  sequelize: Sequelize,
): Promise<any[]> => {
  const result = await sequelize.query(
    `
    SELECT DISTINCT
      n.*,
      l.link_id,
      l.bandwidth,
      l.latency,
      l.status as link_status,
      CASE
        WHEN l.source_node_id = :nodeId THEN 'outbound'
        ELSE 'inbound'
      END as direction
    FROM network_nodes n
    INNER JOIN network_links l ON (
      (l.source_node_id = :nodeId AND l.target_node_id = n.node_id) OR
      (l.target_node_id = :nodeId AND l.source_node_id = n.node_id)
    )
    WHERE l.status = 'up'
    ORDER BY n.name
    `,
    {
      replacements: { nodeId },
      type: QueryTypes.SELECT,
    },
  );

  return result;
};

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
export const discoverNeighborsWithinHops = async (
  nodeId: string,
  maxHops: number,
  sequelize: Sequelize,
): Promise<any[]> => {
  const result = await sequelize.query(
    `
    WITH RECURSIVE neighbor_search AS (
      SELECT
        :nodeId as origin_node,
        :nodeId as current_node,
        0 as distance

      UNION

      SELECT
        ns.origin_node,
        CASE
          WHEN l.source_node_id = ns.current_node THEN l.target_node_id
          ELSE l.source_node_id
        END as current_node,
        ns.distance + 1
      FROM neighbor_search ns
      INNER JOIN network_links l ON (
        l.source_node_id = ns.current_node OR l.target_node_id = ns.current_node
      )
      WHERE ns.distance < :maxHops
        AND l.status = 'up'
    )
    SELECT DISTINCT
      n.*,
      MIN(ns.distance) as hop_distance
    FROM neighbor_search ns
    INNER JOIN network_nodes n ON n.node_id = ns.current_node
    WHERE ns.current_node != :nodeId
    GROUP BY n.id
    ORDER BY hop_distance, n.name
    `,
    {
      replacements: { nodeId, maxHops },
      type: QueryTypes.SELECT,
    },
  );

  return result;
};

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
export const findCommonNeighbors = async (
  nodeId1: string,
  nodeId2: string,
  sequelize: Sequelize,
): Promise<any[]> => {
  const result = await sequelize.query(
    `
    SELECT DISTINCT n.*
    FROM network_nodes n
    WHERE n.node_id IN (
      SELECT DISTINCT
        CASE
          WHEN l.source_node_id = :nodeId1 THEN l.target_node_id
          ELSE l.source_node_id
        END as neighbor
      FROM network_links l
      WHERE (l.source_node_id = :nodeId1 OR l.target_node_id = :nodeId1)
        AND l.status = 'up'
    )
    AND n.node_id IN (
      SELECT DISTINCT
        CASE
          WHEN l.source_node_id = :nodeId2 THEN l.target_node_id
          ELSE l.source_node_id
        END as neighbor
      FROM network_links l
      WHERE (l.source_node_id = :nodeId2 OR l.target_node_id = :nodeId2)
        AND l.status = 'up'
    )
    AND n.node_id NOT IN (:nodeId1, :nodeId2)
    ORDER BY n.name
    `,
    {
      replacements: { nodeId1, nodeId2 },
      type: QueryTypes.SELECT,
    },
  );

  return result;
};

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
export const calculateNodeCentrality = async (sequelize: Sequelize): Promise<any[]> => {
  const result = await sequelize.query(
    `
    SELECT
      n.node_id,
      n.name,
      n.type,
      COUNT(DISTINCT l.id) as degree_centrality,
      COUNT(DISTINCT l.id)::float / NULLIF(
        (SELECT COUNT(*) FROM network_nodes WHERE status = 'active') - 1, 0
      ) as normalized_centrality
    FROM network_nodes n
    LEFT JOIN network_links l ON (
      (l.source_node_id = n.node_id OR l.target_node_id = n.node_id)
      AND l.status = 'up'
    )
    WHERE n.status = 'active'
    GROUP BY n.id, n.node_id, n.name, n.type
    ORDER BY degree_centrality DESC
    `,
    { type: QueryTypes.SELECT },
  );

  return result;
};

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
export const identifyNetworkBridges = async (sequelize: Sequelize): Promise<any[]> => {
  // A bridge is a link whose removal would disconnect the network
  const result = await sequelize.query(
    `
    SELECT
      l.*,
      COUNT(DISTINCT alt.id) as alternative_paths
    FROM network_links l
    LEFT JOIN network_links alt ON (
      alt.id != l.id
      AND alt.status = 'up'
      AND (
        (alt.source_node_id = l.source_node_id AND alt.target_node_id = l.target_node_id) OR
        (alt.source_node_id = l.target_node_id AND alt.target_node_id = l.source_node_id)
      )
    )
    WHERE l.status = 'up'
    GROUP BY l.id
    HAVING COUNT(DISTINCT alt.id) = 0
    ORDER BY l.link_id
    `,
    { type: QueryTypes.SELECT },
  );

  return result;
};

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
export const discoverBroadcastDomain = async (
  nodeId: string,
  sequelize: Sequelize,
): Promise<any[]> => {
  const result = await sequelize.query(
    `
    WITH RECURSIVE broadcast_domain AS (
      SELECT
        n.node_id,
        n.type,
        0 as distance
      FROM network_nodes n
      WHERE n.node_id = :nodeId

      UNION

      SELECT
        CASE
          WHEN l.source_node_id = bd.node_id THEN l.target_node_id
          ELSE l.source_node_id
        END as node_id,
        n.type,
        bd.distance + 1
      FROM broadcast_domain bd
      INNER JOIN network_links l ON (
        l.source_node_id = bd.node_id OR l.target_node_id = bd.node_id
      )
      INNER JOIN network_nodes n ON (
        n.node_id = CASE
          WHEN l.source_node_id = bd.node_id THEN l.target_node_id
          ELSE l.source_node_id
        END
      )
      WHERE l.status = 'up'
        AND n.type NOT IN ('router', 'firewall')
        AND bd.distance < 10
    )
    SELECT DISTINCT
      n.*,
      bd.distance
    FROM broadcast_domain bd
    INNER JOIN network_nodes n ON n.node_id = bd.node_id
    ORDER BY bd.distance, n.name
    `,
    {
      replacements: { nodeId },
      type: QueryTypes.SELECT,
    },
  );

  return result;
};

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
export const buildNeighborAdjacencyMatrix = async (
  sequelize: Sequelize,
): Promise<Map<string, Map<string, number>>> => {
  const links = await sequelize.models.NetworkLink.findAll({
    where: { status: 'up' },
    attributes: ['sourceNodeId', 'targetNodeId', 'cost'],
  });

  const matrix = new Map<string, Map<string, number>>();

  links.forEach((link: any) => {
    // Initialize maps if needed
    if (!matrix.has(link.sourceNodeId)) {
      matrix.set(link.sourceNodeId, new Map());
    }
    if (!matrix.has(link.targetNodeId)) {
      matrix.set(link.targetNodeId, new Map());
    }

    // Undirected graph - set both directions
    matrix.get(link.sourceNodeId)!.set(link.targetNodeId, link.cost);
    matrix.get(link.targetNodeId)!.set(link.sourceNodeId, link.cost);
  });

  return matrix;
};

// ============================================================================
// NETWORK UTILIZATION (25-31)
// ============================================================================

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
export const getNodeUtilization = async (
  nodeId: string,
  NetworkNodeModel: any,
): Promise<any> => {
  const node = await NetworkNodeModel.findOne({
    where: { nodeId },
    attributes: ['nodeId', 'name', 'capacity', 'currentLoad', 'status'],
  });

  if (!node) {
    return null;
  }

  const utilizationPercent = (node.currentLoad / node.capacity) * 100;

  return {
    nodeId: node.nodeId,
    name: node.name,
    capacity: node.capacity,
    currentLoad: node.currentLoad,
    availableCapacity: node.capacity - node.currentLoad,
    utilizationPercent: parseFloat(utilizationPercent.toFixed(2)),
    status: node.status,
  };
};

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
export const getLinkUtilization = async (
  nodeId: string,
  sequelize: Sequelize,
): Promise<any[]> => {
  const result = await sequelize.query(
    `
    SELECT
      l.link_id,
      l.source_node_id,
      l.target_node_id,
      l.bandwidth,
      l.utilization,
      l.status,
      (l.bandwidth * l.utilization / 100) as used_bandwidth,
      (l.bandwidth * (100 - l.utilization) / 100) as available_bandwidth
    FROM network_links l
    WHERE (l.source_node_id = :nodeId OR l.target_node_id = :nodeId)
      AND l.status != 'down'
    ORDER BY l.utilization DESC
    `,
    {
      replacements: { nodeId },
      type: QueryTypes.SELECT,
    },
  );

  return result;
};

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
export const findOverutilizedSegments = async (
  threshold: number,
  sequelize: Sequelize,
): Promise<any[]> => {
  const result = await sequelize.query(
    `
    SELECT
      'node' as type,
      n.node_id as id,
      n.name,
      (n.current_load::float / n.capacity * 100) as utilization_percent,
      n.current_load,
      n.capacity
    FROM network_nodes n
    WHERE (n.current_load::float / n.capacity * 100) > :threshold
      AND n.status = 'active'

    UNION ALL

    SELECT
      'link' as type,
      l.link_id as id,
      l.link_id as name,
      l.utilization as utilization_percent,
      (l.bandwidth * l.utilization / 100) as current_load,
      l.bandwidth as capacity
    FROM network_links l
    WHERE l.utilization > :threshold
      AND l.status = 'up'

    ORDER BY utilization_percent DESC
    `,
    {
      replacements: { threshold },
      type: QueryTypes.SELECT,
    },
  );

  return result;
};

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
export const findUnderutilizedResources = async (
  threshold: number,
  sequelize: Sequelize,
): Promise<any[]> => {
  const result = await sequelize.query(
    `
    SELECT
      'node' as type,
      n.node_id as id,
      n.name,
      (n.current_load::float / n.capacity * 100) as utilization_percent,
      n.capacity - n.current_load as wasted_capacity
    FROM network_nodes n
    WHERE (n.current_load::float / n.capacity * 100) < :threshold
      AND n.status = 'active'
      AND n.type IN ('switch', 'router')

    UNION ALL

    SELECT
      'link' as type,
      l.link_id as id,
      l.link_id as name,
      l.utilization as utilization_percent,
      (l.bandwidth * (100 - l.utilization) / 100) as wasted_capacity
    FROM network_links l
    WHERE l.utilization < :threshold
      AND l.status = 'up'

    ORDER BY utilization_percent ASC
    `,
    {
      replacements: { threshold },
      type: QueryTypes.SELECT,
    },
  );

  return result;
};

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
export const getSegmentUtilization = async (
  segmentId: string,
  sequelize: Sequelize,
): Promise<any> => {
  const result = await sequelize.query(
    `
    SELECT
      :segmentId as segment_id,
      COUNT(DISTINCT n.id) as node_count,
      SUM(n.capacity) as total_capacity,
      SUM(n.current_load) as total_load,
      AVG(n.current_load::float / NULLIF(n.capacity, 0) * 100) as avg_utilization,
      MAX(n.current_load::float / NULLIF(n.capacity, 0) * 100) as max_utilization,
      MIN(n.current_load::float / NULLIF(n.capacity, 0) * 100) as min_utilization
    FROM network_nodes n
    WHERE n.metadata->>'segmentId' = :segmentId
      AND n.status = 'active'
    `,
    {
      replacements: { segmentId },
      type: QueryTypes.SELECT,
    },
  );

  return result[0] || null;
};

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
export const predictCapacityExhaustion = async (
  nodeId: string,
  sequelize: Sequelize,
): Promise<any> => {
  // This would typically use historical utilization data
  // For now, we'll provide a simple linear projection
  const result = await sequelize.query(
    `
    SELECT
      n.node_id,
      n.name,
      n.capacity,
      n.current_load,
      (n.capacity - n.current_load) as remaining_capacity,
      (n.current_load::float / n.capacity * 100) as current_utilization,
      CASE
        WHEN n.current_load >= n.capacity THEN 'Exhausted'
        WHEN (n.current_load::float / n.capacity * 100) > 90 THEN 'Critical'
        WHEN (n.current_load::float / n.capacity * 100) > 75 THEN 'Warning'
        ELSE 'Normal'
      END as capacity_status
    FROM network_nodes n
    WHERE n.node_id = :nodeId
    `,
    {
      replacements: { nodeId },
      type: QueryTypes.SELECT,
    },
  );

  return result[0] || null;
};

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
export const getUtilizationHistory = async (
  nodeId: string,
  startDate: Date,
  endDate: Date,
  sequelize: Sequelize,
): Promise<any[]> => {
  // This assumes a utilization_metrics table exists
  const result = await sequelize.query(
    `
    SELECT
      node_id,
      timestamp,
      cpu_utilization,
      memory_utilization,
      bandwidth_utilization,
      packet_rate
    FROM utilization_metrics
    WHERE node_id = :nodeId
      AND timestamp BETWEEN :startDate AND :endDate
    ORDER BY timestamp ASC
    `,
    {
      replacements: { nodeId, startDate, endDate },
      type: QueryTypes.SELECT,
    },
  );

  return result;
};

// ============================================================================
// PERFORMANCE METRICS (32-36)
// ============================================================================

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
export const getNodePerformanceMetrics = async (
  nodeId: string,
  sequelize: Sequelize,
): Promise<any> => {
  // This assumes a performance_metrics table exists
  const result = await sequelize.query(
    `
    SELECT
      node_id,
      throughput,
      latency,
      jitter,
      packet_loss,
      availability,
      timestamp
    FROM performance_metrics
    WHERE node_id = :nodeId
    ORDER BY timestamp DESC
    LIMIT 1
    `,
    {
      replacements: { nodeId },
      type: QueryTypes.SELECT,
    },
  );

  return result[0] || null;
};

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
export const calculateAverageLatency = async (
  sourceNodeId: string,
  targetNodeId: string,
  sequelize: Sequelize,
): Promise<number> => {
  const path = await findLowestLatencyPath(sourceNodeId, targetNodeId, sequelize);

  if (!path) {
    return -1;
  }

  return path.totalLatency;
};

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
export const identifyPerformanceBottlenecks = async (
  sequelize: Sequelize,
): Promise<any[]> => {
  const result = await sequelize.query(
    `
    SELECT
      l.link_id,
      l.source_node_id,
      l.target_node_id,
      l.bandwidth,
      l.utilization,
      l.latency,
      CASE
        WHEN l.utilization > 90 THEN 'High Utilization'
        WHEN l.latency > 50 THEN 'High Latency'
        WHEN l.status = 'degraded' THEN 'Degraded Link'
        ELSE 'Normal'
      END as bottleneck_type,
      (
        SELECT COUNT(*)
        FROM network_links alt
        WHERE alt.status = 'up'
          AND (
            (alt.source_node_id = l.source_node_id AND alt.target_node_id = l.target_node_id) OR
            (alt.source_node_id = l.target_node_id AND alt.target_node_id = l.source_node_id)
          )
      ) as redundant_paths
    FROM network_links l
    WHERE (l.utilization > 90 OR l.latency > 50 OR l.status = 'degraded')
      AND l.status != 'down'
    ORDER BY l.utilization DESC, l.latency DESC
    `,
    { type: QueryTypes.SELECT },
  );

  return result;
};

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
export const calculateQoSMetrics = async (
  segmentId: string,
  sequelize: Sequelize,
): Promise<any> => {
  const result = await sequelize.query(
    `
    SELECT
      :segmentId as segment_id,
      AVG(pm.throughput) as avg_throughput,
      AVG(pm.latency) as avg_latency,
      AVG(pm.jitter) as avg_jitter,
      AVG(pm.packet_loss) as avg_packet_loss,
      AVG(pm.availability) as avg_availability,
      MAX(pm.latency) as max_latency,
      MIN(pm.availability) as min_availability
    FROM performance_metrics pm
    INNER JOIN network_nodes n ON n.node_id = pm.node_id
    WHERE n.metadata->>'segmentId' = :segmentId
      AND pm.timestamp > NOW() - INTERVAL '1 hour'
    `,
    {
      replacements: { segmentId },
      type: QueryTypes.SELECT,
    },
  );

  return result[0] || null;
};

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
export const measureEndToEndPerformance = async (
  sourceNodeId: string,
  targetNodeId: string,
  sequelize: Sequelize,
): Promise<any> => {
  const path = await findShortestPath(sourceNodeId, targetNodeId, sequelize);

  if (!path) {
    return null;
  }

  return {
    sourceNodeId,
    targetNodeId,
    hopCount: path.hopCount,
    totalLatency: path.totalLatency,
    totalCost: path.totalCost,
    bottleneckBandwidth: path.totalBandwidth,
    path: path.nodes.map((n: any) => n.nodeId),
  };
};

// ============================================================================
// BULK OPERATIONS (37-39)
// ============================================================================

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
export const bulkUpdateNodeStatus = async (
  nodeIds: string[],
  status: string,
  NetworkNodeModel: any,
  transaction?: Transaction,
): Promise<number> => {
  const [count] = await NetworkNodeModel.update(
    { status },
    {
      where: {
        nodeId: { [Op.in]: nodeIds },
      },
      transaction,
    },
  );

  return count;
};

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
export const bulkCreateLinks = async (
  links: any[],
  NetworkLinkModel: any,
  transaction?: Transaction,
): Promise<any[]> => {
  const created = await NetworkLinkModel.bulkCreate(links, {
    validate: true,
    transaction,
  });

  return created;
};

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
export const bulkDeleteInactiveNodes = async (
  inactiveSince: Date,
  NetworkNodeModel: any,
  transaction?: Transaction,
): Promise<number> => {
  const count = await NetworkNodeModel.destroy({
    where: {
      status: 'inactive',
      updatedAt: {
        [Op.lt]: inactiveSince,
      },
    },
    transaction,
  });

  return count;
};

// ============================================================================
// TRANSACTION MANAGEMENT (40-42)
// ============================================================================

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
export const createTopologyTransaction = async (
  topologyData: { nodes: any[]; links: any[] },
  sequelize: Sequelize,
): Promise<any> => {
  return await sequelize.transaction(async (t) => {
    const nodes = await sequelize.models.NetworkNode.bulkCreate(topologyData.nodes, {
      validate: true,
      transaction: t,
    });

    const links = await sequelize.models.NetworkLink.bulkCreate(topologyData.links, {
      validate: true,
      transaction: t,
    });

    return { nodes, links };
  });
};

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
export const updateNetworkConfigTransaction = async (
  nodeId: string,
  updates: any,
  sequelize: Sequelize,
): Promise<any> => {
  return await sequelize.transaction(async (t) => {
    const node = await sequelize.models.NetworkNode.findOne({
      where: { nodeId },
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    if (!node) {
      throw new Error(`Node ${nodeId} not found`);
    }

    await node.update(updates, { transaction: t });

    return node;
  });
};

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
export const recalculatePathTransaction = async (
  sourceNodeId: string,
  targetNodeId: string,
  routeUpdates: any,
  sequelize: Sequelize,
): Promise<NetworkPath | null> => {
  return await sequelize.transaction(async (t) => {
    // Update route configurations
    if (routeUpdates.linkUpdates) {
      for (const update of routeUpdates.linkUpdates) {
        await sequelize.models.NetworkLink.update(update.changes, {
          where: { linkId: update.linkId },
          transaction: t,
        });
      }
    }

    // Recalculate path with updated configuration
    const path = await findShortestPath(sourceNodeId, targetNodeId, sequelize);

    return path;
  });
};

export default {
  // Sequelize Models
  createNetworkNodeModel,
  createNetworkLinkModel,
  createNetworkSegmentModel,

  // Network Topology Queries
  getNetworkTopology,
  getNodesInSegment,
  getTopologyAdjacencyList,
  getLeafNodes,
  getTopologyTree,
  getCoreBackboneNodes,
  detectTopologyLoops,

  // Network Path Finding
  findShortestPath,
  findAllPaths,
  findLowestLatencyPath,
  findMaxBandwidthPath,
  findRedundantPaths,
  calculateECMPRoutes,
  validatePathConstraints,

  // Neighbor Discovery
  discoverDirectNeighbors,
  discoverNeighborsWithinHops,
  findCommonNeighbors,
  calculateNodeCentrality,
  identifyNetworkBridges,
  discoverBroadcastDomain,
  buildNeighborAdjacencyMatrix,

  // Network Utilization
  getNodeUtilization,
  getLinkUtilization,
  findOverutilizedSegments,
  findUnderutilizedResources,
  getSegmentUtilization,
  predictCapacityExhaustion,
  getUtilizationHistory,

  // Performance Metrics
  getNodePerformanceMetrics,
  calculateAverageLatency,
  identifyPerformanceBottlenecks,
  calculateQoSMetrics,
  measureEndToEndPerformance,

  // Bulk Operations
  bulkUpdateNodeStatus,
  bulkCreateLinks,
  bulkDeleteInactiveNodes,

  // Transaction Management
  createTopologyTransaction,
  updateNetworkConfigTransaction,
  recalculatePathTransaction,
};
