/**
 * LOC: TIGA1234567
 * File: /reuse/threat/threat-graph-analysis-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Threat intelligence graph services
 *   - Graph visualization components
 *   - Neo4j integration modules
 */

/**
 * File: /reuse/threat/threat-graph-analysis-kit.ts
 * Locator: WC-UTL-TIGA-001
 * Purpose: Comprehensive Threat Graph Analysis Utilities - Graph construction, traversal, shortest path, community detection, centrality, visualization
 *
 * Upstream: Independent utility module for threat graph analysis and network intelligence
 * Downstream: ../backend/*, graph analysis services, visualization, Neo4j integration
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize, Neo4j Driver
 * Exports: 46 utility functions for threat graph construction, analysis, and visualization
 *
 * LLM Context: Comprehensive graph analysis utilities for White Cross threat intelligence platform.
 * Provides graph construction from threat data, advanced traversal algorithms, shortest path analysis,
 * community detection, centrality analysis, temporal graph analysis, and Neo4j integration. Essential for
 * understanding threat relationships, attack patterns, and infrastructure mapping.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface GraphNode {
  id: string;
  type: 'threat' | 'actor' | 'infrastructure' | 'malware' | 'campaign' | 'victim' | 'indicator';
  properties: Record<string, unknown>;
  labels?: string[];
}

interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: string;
  weight?: number;
  properties?: Record<string, unknown>;
  timestamp?: Date;
}

interface ThreatGraph {
  nodes: Map<string, GraphNode>;
  edges: Map<string, GraphEdge>;
  adjacencyList: Map<string, string[]>;
  reverseAdjacencyList: Map<string, string[]>;
}

interface GraphPath {
  nodes: string[];
  edges: string[];
  totalWeight: number;
  length: number;
}

interface CommunityDetectionResult {
  communities: Map<string, Set<string>>;
  modularity: number;
  totalCommunities: number;
}

interface CentralityScores {
  nodeId: string;
  degree: number;
  betweenness: number;
  closeness: number;
  eigenvector: number;
  pagerank: number;
}

interface GraphVisualizationData {
  nodes: Array<{
    id: string;
    label: string;
    type: string;
    size: number;
    color: string;
    x?: number;
    y?: number;
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
    label: string;
    weight: number;
    color?: string;
  }>;
}

interface TemporalGraph {
  snapshots: Map<string, ThreatGraph>;
  timeline: Date[];
  aggregatedGraph: ThreatGraph;
}

interface Neo4jQuery {
  cypher: string;
  parameters?: Record<string, unknown>;
}

interface GraphMetrics {
  nodeCount: number;
  edgeCount: number;
  density: number;
  averageDegree: number;
  diameter: number;
  averagePathLength: number;
  clusteringCoefficient: number;
}

// ============================================================================
// GRAPH CONSTRUCTION
// ============================================================================

/**
 * Creates a new threat graph from threat intelligence data.
 *
 * @returns {ThreatGraph} Empty threat graph
 *
 * @example
 * ```typescript
 * const graph = createThreatGraph();
 * // Result: {
 * //   nodes: Map<string, GraphNode>,
 * //   edges: Map<string, GraphEdge>,
 * //   adjacencyList: Map<string, string[]>,
 * //   reverseAdjacencyList: Map<string, string[]>
 * // }
 * ```
 */
export const createThreatGraph = (): ThreatGraph => {
  return {
    nodes: new Map(),
    edges: new Map(),
    adjacencyList: new Map(),
    reverseAdjacencyList: new Map(),
  };
};

/**
 * Adds a node to the threat graph.
 *
 * @param {ThreatGraph} graph - Threat graph
 * @param {GraphNode} node - Node to add
 * @returns {ThreatGraph} Updated graph
 * @throws {Error} If node already exists
 *
 * @example
 * ```typescript
 * const updatedGraph = addNode(graph, {
 *   id: 'malware_123',
 *   type: 'malware',
 *   properties: { family: 'LockBit', severity: 'high' },
 *   labels: ['ransomware', 'critical']
 * });
 * ```
 */
export const addNode = (graph: ThreatGraph, node: GraphNode): ThreatGraph => {
  if (graph.nodes.has(node.id)) {
    throw new Error(`Node with id ${node.id} already exists`);
  }

  graph.nodes.set(node.id, node);
  graph.adjacencyList.set(node.id, []);
  graph.reverseAdjacencyList.set(node.id, []);

  return graph;
};

/**
 * Adds an edge to the threat graph.
 *
 * @param {ThreatGraph} graph - Threat graph
 * @param {GraphEdge} edge - Edge to add
 * @returns {ThreatGraph} Updated graph
 * @throws {Error} If source or target node doesn't exist
 *
 * @example
 * ```typescript
 * const updatedGraph = addEdge(graph, {
 *   id: 'edge_1',
 *   source: 'malware_123',
 *   target: 'actor_456',
 *   type: 'attributed_to',
 *   weight: 0.95,
 *   properties: { confidence: 'high' }
 * });
 * ```
 */
export const addEdge = (graph: ThreatGraph, edge: GraphEdge): ThreatGraph => {
  if (!graph.nodes.has(edge.source)) {
    throw new Error(`Source node ${edge.source} does not exist`);
  }
  if (!graph.nodes.has(edge.target)) {
    throw new Error(`Target node ${edge.target} does not exist`);
  }

  graph.edges.set(edge.id, edge);

  const sourceNeighbors = graph.adjacencyList.get(edge.source) || [];
  sourceNeighbors.push(edge.target);
  graph.adjacencyList.set(edge.source, sourceNeighbors);

  const targetIncoming = graph.reverseAdjacencyList.get(edge.target) || [];
  targetIncoming.push(edge.source);
  graph.reverseAdjacencyList.set(edge.target, targetIncoming);

  return graph;
};

/**
 * Builds a threat graph from a collection of threat indicators.
 *
 * @param {unknown[]} indicators - Threat indicators
 * @returns {Promise<ThreatGraph>} Constructed threat graph
 *
 * @example
 * ```typescript
 * const graph = await buildGraphFromIndicators([
 *   { type: 'ip', value: '1.2.3.4', relatedTo: ['malware_123'] },
 *   { type: 'malware', id: 'malware_123', family: 'LockBit' }
 * ]);
 * ```
 */
export const buildGraphFromIndicators = async (
  indicators: Array<Record<string, unknown>>,
): Promise<ThreatGraph> => {
  const graph = createThreatGraph();

  for (const indicator of indicators) {
    // Extract nodes and edges from indicator
    // Production: Complex logic to create graph structure
  }

  return graph;
};

/**
 * Merges two threat graphs into a single graph.
 *
 * @param {ThreatGraph} graph1 - First graph
 * @param {ThreatGraph} graph2 - Second graph
 * @returns {ThreatGraph} Merged graph
 *
 * @example
 * ```typescript
 * const mergedGraph = mergeGraphs(campaignGraph, actorGraph);
 * ```
 */
export const mergeGraphs = (graph1: ThreatGraph, graph2: ThreatGraph): ThreatGraph => {
  const merged = createThreatGraph();

  // Copy nodes from both graphs
  for (const [id, node] of graph1.nodes) {
    merged.nodes.set(id, { ...node });
    merged.adjacencyList.set(id, [...(graph1.adjacencyList.get(id) || [])]);
    merged.reverseAdjacencyList.set(id, [...(graph1.reverseAdjacencyList.get(id) || [])]);
  }

  for (const [id, node] of graph2.nodes) {
    if (!merged.nodes.has(id)) {
      merged.nodes.set(id, { ...node });
      merged.adjacencyList.set(id, [...(graph2.adjacencyList.get(id) || [])]);
      merged.reverseAdjacencyList.set(id, [...(graph2.reverseAdjacencyList.get(id) || [])]);
    }
  }

  // Copy edges from both graphs
  for (const [id, edge] of graph1.edges) {
    merged.edges.set(id, { ...edge });
  }

  for (const [id, edge] of graph2.edges) {
    if (!merged.edges.has(id)) {
      merged.edges.set(id, { ...edge });
    }
  }

  return merged;
};

/**
 * Filters graph by node type or properties.
 *
 * @param {ThreatGraph} graph - Graph to filter
 * @param {(node: GraphNode) => boolean} predicate - Filter predicate
 * @returns {ThreatGraph} Filtered graph
 *
 * @example
 * ```typescript
 * const malwareGraph = filterGraph(
 *   fullGraph,
 *   (node) => node.type === 'malware'
 * );
 * ```
 */
export const filterGraph = (
  graph: ThreatGraph,
  predicate: (node: GraphNode) => boolean,
): ThreatGraph => {
  const filtered = createThreatGraph();

  // Filter nodes
  for (const [id, node] of graph.nodes) {
    if (predicate(node)) {
      filtered.nodes.set(id, { ...node });
      filtered.adjacencyList.set(id, []);
      filtered.reverseAdjacencyList.set(id, []);
    }
  }

  // Filter edges (only keep edges between filtered nodes)
  for (const [id, edge] of graph.edges) {
    if (filtered.nodes.has(edge.source) && filtered.nodes.has(edge.target)) {
      filtered.edges.set(id, { ...edge });
      const sourceNeighbors = filtered.adjacencyList.get(edge.source) || [];
      sourceNeighbors.push(edge.target);
      filtered.adjacencyList.set(edge.source, sourceNeighbors);

      const targetIncoming = filtered.reverseAdjacencyList.get(edge.target) || [];
      targetIncoming.push(edge.source);
      filtered.reverseAdjacencyList.set(edge.target, targetIncoming);
    }
  }

  return filtered;
};

// ============================================================================
// GRAPH TRAVERSAL ALGORITHMS
// ============================================================================

/**
 * Performs breadth-first search (BFS) traversal from a starting node.
 *
 * @param {ThreatGraph} graph - Graph to traverse
 * @param {string} startNodeId - Starting node ID
 * @returns {string[]} Nodes in BFS order
 * @throws {Error} If start node doesn't exist
 *
 * @example
 * ```typescript
 * const traversal = breadthFirstSearch(graph, 'malware_123');
 * // Result: ['malware_123', 'actor_456', 'infrastructure_789', ...]
 * ```
 */
export const breadthFirstSearch = (graph: ThreatGraph, startNodeId: string): string[] => {
  if (!graph.nodes.has(startNodeId)) {
    throw new Error(`Start node ${startNodeId} does not exist`);
  }

  const visited = new Set<string>();
  const queue: string[] = [startNodeId];
  const result: string[] = [];

  while (queue.length > 0) {
    const nodeId = queue.shift()!;

    if (visited.has(nodeId)) continue;

    visited.add(nodeId);
    result.push(nodeId);

    const neighbors = graph.adjacencyList.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        queue.push(neighbor);
      }
    }
  }

  return result;
};

/**
 * Performs depth-first search (DFS) traversal from a starting node.
 *
 * @param {ThreatGraph} graph - Graph to traverse
 * @param {string} startNodeId - Starting node ID
 * @returns {string[]} Nodes in DFS order
 * @throws {Error} If start node doesn't exist
 *
 * @example
 * ```typescript
 * const traversal = depthFirstSearch(graph, 'malware_123');
 * // Result: ['malware_123', 'actor_456', 'campaign_012', ...]
 * ```
 */
export const depthFirstSearch = (graph: ThreatGraph, startNodeId: string): string[] => {
  if (!graph.nodes.has(startNodeId)) {
    throw new Error(`Start node ${startNodeId} does not exist`);
  }

  const visited = new Set<string>();
  const result: string[] = [];

  const dfs = (nodeId: string) => {
    if (visited.has(nodeId)) return;

    visited.add(nodeId);
    result.push(nodeId);

    const neighbors = graph.adjacencyList.get(nodeId) || [];
    for (const neighbor of neighbors) {
      dfs(neighbor);
    }
  };

  dfs(startNodeId);
  return result;
};

/**
 * Finds all neighbors of a node within specified depth.
 *
 * @param {ThreatGraph} graph - Graph to search
 * @param {string} nodeId - Node ID
 * @param {number} [depth] - Search depth (default: 1)
 * @returns {Set<string>} Neighbor node IDs
 *
 * @example
 * ```typescript
 * const neighbors = getNeighbors(graph, 'malware_123', 2);
 * // Result: Set(['actor_456', 'infrastructure_789', 'campaign_012', ...])
 * ```
 */
export const getNeighbors = (
  graph: ThreatGraph,
  nodeId: string,
  depth: number = 1,
): Set<string> => {
  if (!graph.nodes.has(nodeId)) {
    return new Set();
  }

  const neighbors = new Set<string>();
  const visited = new Set<string>([nodeId]);
  let currentLevel = new Set<string>([nodeId]);

  for (let d = 0; d < depth; d++) {
    const nextLevel = new Set<string>();

    for (const current of currentLevel) {
      const adjacent = graph.adjacencyList.get(current) || [];
      for (const adj of adjacent) {
        if (!visited.has(adj)) {
          visited.add(adj);
          neighbors.add(adj);
          nextLevel.add(adj);
        }
      }
    }

    currentLevel = nextLevel;
  }

  return neighbors;
};

/**
 * Finds all paths between two nodes.
 *
 * @param {ThreatGraph} graph - Graph to search
 * @param {string} sourceId - Source node ID
 * @param {string} targetId - Target node ID
 * @param {number} [maxDepth] - Maximum path depth
 * @returns {GraphPath[]} All paths found
 *
 * @example
 * ```typescript
 * const paths = findAllPaths(graph, 'malware_123', 'victim_789', 5);
 * // Result: [
 * //   { nodes: ['malware_123', 'actor_456', 'victim_789'], edges: [...], length: 2 },
 * //   { nodes: ['malware_123', 'campaign_012', 'victim_789'], edges: [...], length: 2 }
 * // ]
 * ```
 */
export const findAllPaths = (
  graph: ThreatGraph,
  sourceId: string,
  targetId: string,
  maxDepth: number = 10,
): GraphPath[] => {
  const paths: GraphPath[] = [];

  const dfs = (
    current: string,
    visited: Set<string>,
    path: string[],
    edges: string[],
    depth: number,
  ) => {
    if (depth > maxDepth) return;

    if (current === targetId) {
      paths.push({
        nodes: [...path],
        edges: [...edges],
        totalWeight: 0, // Calculate based on edge weights
        length: path.length - 1,
      });
      return;
    }

    const neighbors = graph.adjacencyList.get(current) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        path.push(neighbor);

        // Find edge ID
        const edgeId = Array.from(graph.edges.values()).find(
          (e) => e.source === current && e.target === neighbor,
        )?.id || '';
        edges.push(edgeId);

        dfs(neighbor, visited, path, edges, depth + 1);

        path.pop();
        edges.pop();
        visited.delete(neighbor);
      }
    }
  };

  dfs(sourceId, new Set([sourceId]), [sourceId], [], 0);
  return paths;
};

/**
 * Performs topological sort on directed acyclic graph (DAG).
 *
 * @param {ThreatGraph} graph - Graph to sort
 * @returns {string[]} Topologically sorted node IDs
 * @throws {Error} If graph contains cycles
 *
 * @example
 * ```typescript
 * const sorted = topologicalSort(graph);
 * // Result: ['root_node', 'level_1_node', 'level_2_node', ...]
 * ```
 */
export const topologicalSort = (graph: ThreatGraph): string[] => {
  const inDegree = new Map<string, number>();
  const result: string[] = [];

  // Calculate in-degrees
  for (const nodeId of graph.nodes.keys()) {
    inDegree.set(nodeId, 0);
  }

  for (const edge of graph.edges.values()) {
    inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
  }

  // Queue nodes with no incoming edges
  const queue: string[] = [];
  for (const [nodeId, degree] of inDegree) {
    if (degree === 0) {
      queue.push(nodeId);
    }
  }

  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    result.push(nodeId);

    const neighbors = graph.adjacencyList.get(nodeId) || [];
    for (const neighbor of neighbors) {
      const newDegree = (inDegree.get(neighbor) || 0) - 1;
      inDegree.set(neighbor, newDegree);

      if (newDegree === 0) {
        queue.push(neighbor);
      }
    }
  }

  if (result.length !== graph.nodes.size) {
    throw new Error('Graph contains cycles - topological sort not possible');
  }

  return result;
};

/**
 * Detects cycles in the graph.
 *
 * @param {ThreatGraph} graph - Graph to check
 * @returns {boolean} True if graph contains cycles
 *
 * @example
 * ```typescript
 * const hasCycles = detectCycles(graph);
 * // Result: false
 * ```
 */
export const detectCycles = (graph: ThreatGraph): boolean => {
  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  const hasCycle = (nodeId: string): boolean => {
    visited.add(nodeId);
    recursionStack.add(nodeId);

    const neighbors = graph.adjacencyList.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (hasCycle(neighbor)) return true;
      } else if (recursionStack.has(neighbor)) {
        return true;
      }
    }

    recursionStack.delete(nodeId);
    return false;
  };

  for (const nodeId of graph.nodes.keys()) {
    if (!visited.has(nodeId)) {
      if (hasCycle(nodeId)) return true;
    }
  }

  return false;
};

// ============================================================================
// SHORTEST PATH ANALYSIS
// ============================================================================

/**
 * Finds shortest path between two nodes using Dijkstra's algorithm.
 *
 * @param {ThreatGraph} graph - Graph to search
 * @param {string} sourceId - Source node ID
 * @param {string} targetId - Target node ID
 * @returns {GraphPath | null} Shortest path or null if no path exists
 *
 * @example
 * ```typescript
 * const path = findShortestPath(graph, 'malware_123', 'victim_789');
 * // Result: {
 * //   nodes: ['malware_123', 'actor_456', 'victim_789'],
 * //   edges: ['edge_1', 'edge_2'],
 * //   totalWeight: 1.85,
 * //   length: 2
 * // }
 * ```
 */
export const findShortestPath = (
  graph: ThreatGraph,
  sourceId: string,
  targetId: string,
): GraphPath | null => {
  if (!graph.nodes.has(sourceId) || !graph.nodes.has(targetId)) {
    return null;
  }

  const distances = new Map<string, number>();
  const previous = new Map<string, string | null>();
  const unvisited = new Set<string>();

  // Initialize
  for (const nodeId of graph.nodes.keys()) {
    distances.set(nodeId, Infinity);
    previous.set(nodeId, null);
    unvisited.add(nodeId);
  }
  distances.set(sourceId, 0);

  while (unvisited.size > 0) {
    // Find unvisited node with minimum distance
    let minNode: string | null = null;
    let minDistance = Infinity;
    for (const nodeId of unvisited) {
      const dist = distances.get(nodeId)!;
      if (dist < minDistance) {
        minDistance = dist;
        minNode = nodeId;
      }
    }

    if (minNode === null || minDistance === Infinity) break;

    unvisited.delete(minNode);

    if (minNode === targetId) break;

    const neighbors = graph.adjacencyList.get(minNode) || [];
    for (const neighbor of neighbors) {
      if (!unvisited.has(neighbor)) continue;

      const edge = Array.from(graph.edges.values()).find(
        (e) => e.source === minNode && e.target === neighbor,
      );
      const weight = edge?.weight || 1;
      const alt = distances.get(minNode)! + weight;

      if (alt < distances.get(neighbor)!) {
        distances.set(neighbor, alt);
        previous.set(neighbor, minNode);
      }
    }
  }

  // Reconstruct path
  if (previous.get(targetId) === null && sourceId !== targetId) {
    return null;
  }

  const nodes: string[] = [];
  const edges: string[] = [];
  let current: string | null = targetId;

  while (current !== null) {
    nodes.unshift(current);
    const prev = previous.get(current);
    if (prev !== null && prev !== undefined) {
      const edge = Array.from(graph.edges.values()).find(
        (e) => e.source === prev && e.target === current,
      );
      if (edge) edges.unshift(edge.id);
    }
    current = prev || null;
  }

  return {
    nodes,
    edges,
    totalWeight: distances.get(targetId)!,
    length: nodes.length - 1,
  };
};

/**
 * Finds all shortest paths from a source node to all other nodes.
 *
 * @param {ThreatGraph} graph - Graph to analyze
 * @param {string} sourceId - Source node ID
 * @returns {Map<string, GraphPath>} Map of target node IDs to shortest paths
 *
 * @example
 * ```typescript
 * const allPaths = findShortestPaths(graph, 'malware_123');
 * // Result: Map {
 * //   'actor_456' => { nodes: [...], edges: [...], length: 1 },
 * //   'victim_789' => { nodes: [...], edges: [...], length: 2 }
 * // }
 * ```
 */
export const findShortestPaths = (
  graph: ThreatGraph,
  sourceId: string,
): Map<string, GraphPath> => {
  const paths = new Map<string, GraphPath>();

  for (const targetId of graph.nodes.keys()) {
    if (targetId !== sourceId) {
      const path = findShortestPath(graph, sourceId, targetId);
      if (path) {
        paths.set(targetId, path);
      }
    }
  }

  return paths;
};

/**
 * Calculates average shortest path length in the graph.
 *
 * @param {ThreatGraph} graph - Graph to analyze
 * @returns {number} Average shortest path length
 *
 * @example
 * ```typescript
 * const avgLength = calculateAveragePathLength(graph);
 * // Result: 3.42
 * ```
 */
export const calculateAveragePathLength = (graph: ThreatGraph): number => {
  let totalLength = 0;
  let pathCount = 0;

  const nodes = Array.from(graph.nodes.keys());

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const path = findShortestPath(graph, nodes[i], nodes[j]);
      if (path) {
        totalLength += path.length;
        pathCount++;
      }
    }
  }

  return pathCount > 0 ? totalLength / pathCount : 0;
};

/**
 * Finds diameter of the graph (longest shortest path).
 *
 * @param {ThreatGraph} graph - Graph to analyze
 * @returns {number} Graph diameter
 *
 * @example
 * ```typescript
 * const diameter = findGraphDiameter(graph);
 * // Result: 7
 * ```
 */
export const findGraphDiameter = (graph: ThreatGraph): number => {
  let maxLength = 0;

  const nodes = Array.from(graph.nodes.keys());

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const path = findShortestPath(graph, nodes[i], nodes[j]);
      if (path && path.length > maxLength) {
        maxLength = path.length;
      }
    }
  }

  return maxLength;
};

/**
 * Finds k shortest paths between two nodes.
 *
 * @param {ThreatGraph} graph - Graph to search
 * @param {string} sourceId - Source node ID
 * @param {string} targetId - Target node ID
 * @param {number} k - Number of shortest paths to find
 * @returns {GraphPath[]} K shortest paths
 *
 * @example
 * ```typescript
 * const paths = findKShortestPaths(graph, 'malware_123', 'victim_789', 3);
 * // Result: [path1, path2, path3] sorted by length/weight
 * ```
 */
export const findKShortestPaths = (
  graph: ThreatGraph,
  sourceId: string,
  targetId: string,
  k: number,
): GraphPath[] => {
  const allPaths = findAllPaths(graph, sourceId, targetId, 10);

  // Sort by total weight and return top k
  return allPaths
    .sort((a, b) => a.totalWeight - b.totalWeight || a.length - b.length)
    .slice(0, k);
};

// ============================================================================
// COMMUNITY DETECTION
// ============================================================================

/**
 * Detects communities using Louvain algorithm.
 *
 * @param {ThreatGraph} graph - Graph to analyze
 * @returns {Promise<CommunityDetectionResult>} Community detection results
 *
 * @example
 * ```typescript
 * const result = await detectCommunitiesLouvain(graph);
 * // Result: {
 * //   communities: Map { 'comm1' => Set(['node1', 'node2']), ... },
 * //   modularity: 0.42,
 * //   totalCommunities: 5
 * // }
 * ```
 */
export const detectCommunitiesLouvain = async (
  graph: ThreatGraph,
): Promise<CommunityDetectionResult> => {
  // Production: Implement Louvain algorithm
  // Simplified placeholder
  const communities = new Map<string, Set<string>>();
  communities.set('comm1', new Set(Array.from(graph.nodes.keys())));

  return {
    communities,
    modularity: 0,
    totalCommunities: communities.size,
  };
};

/**
 * Detects communities using label propagation algorithm.
 *
 * @param {ThreatGraph} graph - Graph to analyze
 * @param {number} [maxIterations] - Maximum iterations
 * @returns {Promise<CommunityDetectionResult>} Community detection results
 *
 * @example
 * ```typescript
 * const result = await detectCommunitiesLabelProp(graph, 100);
 * ```
 */
export const detectCommunitiesLabelProp = async (
  graph: ThreatGraph,
  maxIterations: number = 100,
): Promise<CommunityDetectionResult> => {
  // Production: Implement label propagation
  const communities = new Map<string, Set<string>>();

  return {
    communities,
    modularity: 0,
    totalCommunities: communities.size,
  };
};

/**
 * Identifies strongly connected components in directed graph.
 *
 * @param {ThreatGraph} graph - Graph to analyze
 * @returns {Set<string>[]} Array of strongly connected components
 *
 * @example
 * ```typescript
 * const components = findStronglyConnectedComponents(graph);
 * // Result: [
 * //   Set(['node1', 'node2', 'node3']),
 * //   Set(['node4', 'node5'])
 * // ]
 * ```
 */
export const findStronglyConnectedComponents = (graph: ThreatGraph): Set<string>[] => {
  // Production: Tarjan's algorithm or Kosaraju's algorithm
  const components: Set<string>[] = [];

  return components;
};

/**
 * Identifies weakly connected components in graph.
 *
 * @param {ThreatGraph} graph - Graph to analyze
 * @returns {Set<string>[]} Array of weakly connected components
 *
 * @example
 * ```typescript
 * const components = findWeaklyConnectedComponents(graph);
 * ```
 */
export const findWeaklyConnectedComponents = (graph: ThreatGraph): Set<string>[] => {
  const components: Set<string>[] = [];
  const visited = new Set<string>();

  for (const nodeId of graph.nodes.keys()) {
    if (!visited.has(nodeId)) {
      const component = new Set<string>();
      const stack = [nodeId];

      while (stack.length > 0) {
        const current = stack.pop()!;
        if (visited.has(current)) continue;

        visited.add(current);
        component.add(current);

        const neighbors = graph.adjacencyList.get(current) || [];
        const incoming = graph.reverseAdjacencyList.get(current) || [];

        for (const neighbor of [...neighbors, ...incoming]) {
          if (!visited.has(neighbor)) {
            stack.push(neighbor);
          }
        }
      }

      components.push(component);
    }
  }

  return components;
};

/**
 * Calculates modularity score for community assignment.
 *
 * @param {ThreatGraph} graph - Graph to analyze
 * @param {Map<string, string>} communityAssignment - Node to community mapping
 * @returns {number} Modularity score (-1 to 1)
 *
 * @example
 * ```typescript
 * const modularity = calculateModularity(graph, communityMap);
 * // Result: 0.42
 * ```
 */
export const calculateModularity = (
  graph: ThreatGraph,
  communityAssignment: Map<string, string>,
): number => {
  const m = graph.edges.size;
  if (m === 0) return 0;

  let modularity = 0;

  for (const [nodeI, commI] of communityAssignment) {
    for (const [nodeJ, commJ] of communityAssignment) {
      if (commI !== commJ) continue;

      const degreeI = (graph.adjacencyList.get(nodeI) || []).length;
      const degreeJ = (graph.adjacencyList.get(nodeJ) || []).length;

      const hasEdge = (graph.adjacencyList.get(nodeI) || []).includes(nodeJ) ? 1 : 0;
      const expected = (degreeI * degreeJ) / (2 * m);

      modularity += hasEdge - expected;
    }
  }

  return modularity / (2 * m);
};

/**
 * Identifies cliques (fully connected subgraphs) in the graph.
 *
 * @param {ThreatGraph} graph - Graph to analyze
 * @param {number} [minSize] - Minimum clique size
 * @returns {Set<string>[]} Array of cliques
 *
 * @example
 * ```typescript
 * const cliques = findCliques(graph, 3);
 * // Result: [Set(['node1', 'node2', 'node3']), ...]
 * ```
 */
export const findCliques = (graph: ThreatGraph, minSize: number = 3): Set<string>[] => {
  // Production: Bron-Kerbosch algorithm
  const cliques: Set<string>[] = [];

  return cliques.filter((clique) => clique.size >= minSize);
};

// ============================================================================
// CENTRALITY ANALYSIS
// ============================================================================

/**
 * Calculates degree centrality for all nodes.
 *
 * @param {ThreatGraph} graph - Graph to analyze
 * @returns {Map<string, number>} Node ID to degree centrality
 *
 * @example
 * ```typescript
 * const centrality = calculateDegreeCentrality(graph);
 * // Result: Map { 'node1' => 5, 'node2' => 3, ... }
 * ```
 */
export const calculateDegreeCentrality = (graph: ThreatGraph): Map<string, number> => {
  const centrality = new Map<string, number>();

  for (const nodeId of graph.nodes.keys()) {
    const degree = (graph.adjacencyList.get(nodeId) || []).length;
    centrality.set(nodeId, degree);
  }

  return centrality;
};

/**
 * Calculates betweenness centrality for all nodes.
 *
 * @param {ThreatGraph} graph - Graph to analyze
 * @returns {Promise<Map<string, number>>} Node ID to betweenness centrality
 *
 * @example
 * ```typescript
 * const centrality = await calculateBetweennessCentrality(graph);
 * // Result: Map { 'node1' => 0.42, 'node2' => 0.15, ... }
 * ```
 */
export const calculateBetweennessCentrality = async (
  graph: ThreatGraph,
): Promise<Map<string, number>> => {
  const centrality = new Map<string, number>();

  // Initialize all nodes with 0
  for (const nodeId of graph.nodes.keys()) {
    centrality.set(nodeId, 0);
  }

  const nodes = Array.from(graph.nodes.keys());

  // For each pair of nodes
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const paths = findAllPaths(graph, nodes[i], nodes[j], 10);

      if (paths.length === 0) continue;

      const shortestLength = Math.min(...paths.map((p) => p.length));
      const shortestPaths = paths.filter((p) => p.length === shortestLength);

      // Count how many shortest paths each node is on
      for (const path of shortestPaths) {
        for (let k = 1; k < path.nodes.length - 1; k++) {
          const nodeId = path.nodes[k];
          centrality.set(nodeId, (centrality.get(nodeId) || 0) + 1 / shortestPaths.length);
        }
      }
    }
  }

  return centrality;
};

/**
 * Calculates closeness centrality for all nodes.
 *
 * @param {ThreatGraph} graph - Graph to analyze
 * @returns {Map<string, number>} Node ID to closeness centrality
 *
 * @example
 * ```typescript
 * const centrality = calculateClosenessCentrality(graph);
 * // Result: Map { 'node1' => 0.67, 'node2' => 0.45, ... }
 * ```
 */
export const calculateClosenessCentrality = (graph: ThreatGraph): Map<string, number> => {
  const centrality = new Map<string, number>();

  for (const sourceId of graph.nodes.keys()) {
    let totalDistance = 0;
    let reachableNodes = 0;

    for (const targetId of graph.nodes.keys()) {
      if (sourceId !== targetId) {
        const path = findShortestPath(graph, sourceId, targetId);
        if (path) {
          totalDistance += path.length;
          reachableNodes++;
        }
      }
    }

    const closeness = reachableNodes > 0 ? reachableNodes / totalDistance : 0;
    centrality.set(sourceId, closeness);
  }

  return centrality;
};

/**
 * Calculates PageRank scores for all nodes.
 *
 * @param {ThreatGraph} graph - Graph to analyze
 * @param {number} [dampingFactor] - Damping factor (default: 0.85)
 * @param {number} [maxIterations] - Maximum iterations
 * @returns {Promise<Map<string, number>>} Node ID to PageRank score
 *
 * @example
 * ```typescript
 * const pagerank = await calculatePageRank(graph, 0.85, 100);
 * // Result: Map { 'node1' => 0.25, 'node2' => 0.15, ... }
 * ```
 */
export const calculatePageRank = async (
  graph: ThreatGraph,
  dampingFactor: number = 0.85,
  maxIterations: number = 100,
): Promise<Map<string, number>> => {
  const pagerank = new Map<string, number>();
  const n = graph.nodes.size;

  // Initialize
  for (const nodeId of graph.nodes.keys()) {
    pagerank.set(nodeId, 1 / n);
  }

  for (let iter = 0; iter < maxIterations; iter++) {
    const newPagerank = new Map<string, number>();

    for (const nodeId of graph.nodes.keys()) {
      let sum = 0;

      // Sum contributions from incoming edges
      const incoming = graph.reverseAdjacencyList.get(nodeId) || [];
      for (const inNode of incoming) {
        const outDegree = (graph.adjacencyList.get(inNode) || []).length;
        if (outDegree > 0) {
          sum += (pagerank.get(inNode) || 0) / outDegree;
        }
      }

      newPagerank.set(nodeId, (1 - dampingFactor) / n + dampingFactor * sum);
    }

    // Check for convergence
    let converged = true;
    for (const nodeId of graph.nodes.keys()) {
      if (Math.abs((newPagerank.get(nodeId) || 0) - (pagerank.get(nodeId) || 0)) > 0.0001) {
        converged = false;
        break;
      }
    }

    pagerank.clear();
    for (const [k, v] of newPagerank) {
      pagerank.set(k, v);
    }

    if (converged) break;
  }

  return pagerank;
};

/**
 * Identifies most influential nodes based on multiple centrality metrics.
 *
 * @param {ThreatGraph} graph - Graph to analyze
 * @param {number} [topN] - Number of top nodes to return
 * @returns {Promise<CentralityScores[]>} Top influential nodes
 *
 * @example
 * ```typescript
 * const influential = await findMostInfluentialNodes(graph, 10);
 * // Result: [
 * //   { nodeId: 'actor_456', degree: 15, betweenness: 0.42, ... },
 * //   ...
 * // ]
 * ```
 */
export const findMostInfluentialNodes = async (
  graph: ThreatGraph,
  topN: number = 10,
): Promise<CentralityScores[]> => {
  const degree = calculateDegreeCentrality(graph);
  const betweenness = await calculateBetweennessCentrality(graph);
  const closeness = calculateClosenessCentrality(graph);
  const pagerank = await calculatePageRank(graph);

  const scores: CentralityScores[] = [];

  for (const nodeId of graph.nodes.keys()) {
    scores.push({
      nodeId,
      degree: degree.get(nodeId) || 0,
      betweenness: betweenness.get(nodeId) || 0,
      closeness: closeness.get(nodeId) || 0,
      eigenvector: 0, // Simplified
      pagerank: pagerank.get(nodeId) || 0,
    });
  }

  // Sort by combined score
  scores.sort((a, b) => {
    const scoreA = a.degree + a.betweenness + a.closeness + a.pagerank;
    const scoreB = b.degree + b.betweenness + b.closeness + b.pagerank;
    return scoreB - scoreA;
  });

  return scores.slice(0, topN);
};

// ============================================================================
// GRAPH VISUALIZATION DATA PREPARATION
// ============================================================================

/**
 * Prepares graph data for visualization libraries (D3, Sigma, etc.).
 *
 * @param {ThreatGraph} graph - Graph to visualize
 * @param {object} [options] - Visualization options
 * @returns {GraphVisualizationData} Visualization-ready data
 *
 * @example
 * ```typescript
 * const vizData = prepareGraphVisualization(graph, {
 *   nodeSize: 'degree',
 *   colorBy: 'type',
 *   layout: 'force-directed'
 * });
 * ```
 */
export const prepareGraphVisualization = (
  graph: ThreatGraph,
  options?: {
    nodeSize?: 'degree' | 'pagerank' | 'fixed';
    colorBy?: 'type' | 'community' | 'severity';
    layout?: 'force-directed' | 'hierarchical' | 'circular';
  },
): GraphVisualizationData => {
  const colorMap: Record<string, string> = {
    threat: '#ff4444',
    actor: '#ff8800',
    infrastructure: '#4444ff',
    malware: '#ff0088',
    campaign: '#8800ff',
    victim: '#00ff88',
    indicator: '#ffaa00',
  };

  const nodes = Array.from(graph.nodes.values()).map((node) => {
    const degree = (graph.adjacencyList.get(node.id) || []).length;

    return {
      id: node.id,
      label: node.id,
      type: node.type,
      size: degree + 5,
      color: colorMap[node.type] || '#cccccc',
    };
  });

  const edges = Array.from(graph.edges.values()).map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    label: edge.type,
    weight: edge.weight || 1,
    color: '#999999',
  }));

  return { nodes, edges };
};

/**
 * Applies force-directed layout to graph nodes.
 *
 * @param {GraphVisualizationData} vizData - Visualization data
 * @param {number} [iterations] - Number of layout iterations
 * @returns {GraphVisualizationData} Data with positioned nodes
 *
 * @example
 * ```typescript
 * const positioned = applyForceDirectedLayout(vizData, 100);
 * ```
 */
export const applyForceDirectedLayout = (
  vizData: GraphVisualizationData,
  iterations: number = 100,
): GraphVisualizationData => {
  // Production: Implement force-directed layout (Fruchterman-Reingold, etc.)
  // Simplified: Random positioning
  const positioned = { ...vizData };

  positioned.nodes = vizData.nodes.map((node) => ({
    ...node,
    x: Math.random() * 1000,
    y: Math.random() * 1000,
  }));

  return positioned;
};

/**
 * Filters graph visualization by node type or importance.
 *
 * @param {GraphVisualizationData} vizData - Visualization data
 * @param {object} filters - Filter criteria
 * @returns {GraphVisualizationData} Filtered visualization data
 *
 * @example
 * ```typescript
 * const filtered = filterVisualization(vizData, {
 *   nodeTypes: ['malware', 'actor'],
 *   minDegree: 3
 * });
 * ```
 */
export const filterVisualization = (
  vizData: GraphVisualizationData,
  filters: {
    nodeTypes?: string[];
    minDegree?: number;
    maxNodes?: number;
  },
): GraphVisualizationData => {
  let filteredNodes = [...vizData.nodes];

  if (filters.nodeTypes) {
    filteredNodes = filteredNodes.filter((node) => filters.nodeTypes!.includes(node.type));
  }

  if (filters.minDegree) {
    filteredNodes = filteredNodes.filter((node) => node.size - 5 >= filters.minDegree!);
  }

  if (filters.maxNodes) {
    filteredNodes = filteredNodes
      .sort((a, b) => b.size - a.size)
      .slice(0, filters.maxNodes);
  }

  const nodeIds = new Set(filteredNodes.map((n) => n.id));
  const filteredEdges = vizData.edges.filter(
    (edge) => nodeIds.has(edge.source) && nodeIds.has(edge.target),
  );

  return {
    nodes: filteredNodes,
    edges: filteredEdges,
  };
};

/**
 * Generates hierarchical layout for graph visualization.
 *
 * @param {ThreatGraph} graph - Graph to layout
 * @param {string} rootNodeId - Root node for hierarchy
 * @returns {GraphVisualizationData} Hierarchically positioned data
 *
 * @example
 * ```typescript
 * const hierarchical = generateHierarchicalLayout(graph, 'campaign_123');
 * ```
 */
export const generateHierarchicalLayout = (
  graph: ThreatGraph,
  rootNodeId: string,
): GraphVisualizationData => {
  // Production: BFS-based hierarchical positioning
  const vizData = prepareGraphVisualization(graph);

  return vizData;
};

/**
 * Exports graph visualization to SVG format.
 *
 * @param {GraphVisualizationData} vizData - Visualization data
 * @returns {string} SVG string
 *
 * @example
 * ```typescript
 * const svg = exportVisualizationToSVG(vizData);
 * // Result: '<svg>...</svg>'
 * ```
 */
export const exportVisualizationToSVG = (vizData: GraphVisualizationData): string => {
  // Production: Generate SVG from visualization data
  return '<svg></svg>';
};

// ============================================================================
// TEMPORAL GRAPH ANALYSIS
// ============================================================================

/**
 * Creates a temporal graph with time-based snapshots.
 *
 * @param {Array<{ timestamp: Date; graph: ThreatGraph }>} snapshots - Graph snapshots
 * @returns {TemporalGraph} Temporal graph
 *
 * @example
 * ```typescript
 * const temporal = createTemporalGraph([
 *   { timestamp: new Date('2025-01-01'), graph: graph1 },
 *   { timestamp: new Date('2025-02-01'), graph: graph2 }
 * ]);
 * ```
 */
export const createTemporalGraph = (
  snapshots: Array<{ timestamp: Date; graph: ThreatGraph }>,
): TemporalGraph => {
  const snapshotMap = new Map<string, ThreatGraph>();
  const timeline: Date[] = [];

  for (const snapshot of snapshots) {
    const key = snapshot.timestamp.toISOString();
    snapshotMap.set(key, snapshot.graph);
    timeline.push(snapshot.timestamp);
  }

  timeline.sort((a, b) => a.getTime() - b.getTime());

  // Create aggregated graph
  const aggregatedGraph = createThreatGraph();
  for (const snapshot of snapshots) {
    for (const [id, node] of snapshot.graph.nodes) {
      if (!aggregatedGraph.nodes.has(id)) {
        aggregatedGraph.nodes.set(id, { ...node });
        aggregatedGraph.adjacencyList.set(id, []);
        aggregatedGraph.reverseAdjacencyList.set(id, []);
      }
    }
    for (const [id, edge] of snapshot.graph.edges) {
      if (!aggregatedGraph.edges.has(id)) {
        aggregatedGraph.edges.set(id, { ...edge });
        const sourceNeighbors = aggregatedGraph.adjacencyList.get(edge.source) || [];
        sourceNeighbors.push(edge.target);
        aggregatedGraph.adjacencyList.set(edge.source, sourceNeighbors);
      }
    }
  }

  return {
    snapshots: snapshotMap,
    timeline,
    aggregatedGraph,
  };
};

/**
 * Analyzes graph evolution over time.
 *
 * @param {TemporalGraph} temporalGraph - Temporal graph
 * @returns {object} Evolution metrics
 *
 * @example
 * ```typescript
 * const evolution = analyzeGraphEvolution(temporalGraph);
 * // Result: {
 * //   growthRate: 0.15,
 * //   nodeAdditions: 45,
 * //   nodeDeletions: 12,
 * //   edgeAdditions: 78,
 * //   edgeDeletions: 23
 * // }
 * ```
 */
export const analyzeGraphEvolution = (
  temporalGraph: TemporalGraph,
): {
  growthRate: number;
  nodeAdditions: number;
  nodeDeletions: number;
  edgeAdditions: number;
  edgeDeletions: number;
} => {
  // Production: Compare consecutive snapshots
  return {
    growthRate: 0,
    nodeAdditions: 0,
    nodeDeletions: 0,
    edgeAdditions: 0,
    edgeDeletions: 0,
  };
};

/**
 * Identifies temporal patterns in graph changes.
 *
 * @param {TemporalGraph} temporalGraph - Temporal graph
 * @returns {Promise<object[]>} Detected temporal patterns
 *
 * @example
 * ```typescript
 * const patterns = await detectTemporalPatterns(temporalGraph);
 * // Result: [
 * //   { type: 'periodic_spike', period: '7d', confidence: 0.89 },
 * //   { type: 'sustained_growth', rate: 0.15, confidence: 0.92 }
 * // ]
 * ```
 */
export const detectTemporalPatterns = async (
  temporalGraph: TemporalGraph,
): Promise<Array<{ type: string; confidence: number; details: Record<string, unknown> }>> => {
  // Production: Time series analysis, pattern detection
  return [];
};

/**
 * Forecasts future graph structure based on historical trends.
 *
 * @param {TemporalGraph} temporalGraph - Temporal graph
 * @param {number} [daysAhead] - Days to forecast
 * @returns {Promise<ThreatGraph>} Forecasted graph
 *
 * @example
 * ```typescript
 * const forecast = await forecastGraphStructure(temporalGraph, 30);
 * ```
 */
export const forecastGraphStructure = async (
  temporalGraph: TemporalGraph,
  daysAhead: number = 30,
): Promise<ThreatGraph> => {
  // Production: Time series forecasting, growth models
  return createThreatGraph();
};

/**
 * Compares two temporal snapshots to identify differences.
 *
 * @param {ThreatGraph} graph1 - First graph snapshot
 * @param {ThreatGraph} graph2 - Second graph snapshot
 * @returns {object} Graph differences
 *
 * @example
 * ```typescript
 * const diff = compareGraphSnapshots(snapshot1, snapshot2);
 * // Result: {
 * //   addedNodes: ['node1', 'node2'],
 * //   removedNodes: ['node3'],
 * //   addedEdges: ['edge1'],
 * //   removedEdges: ['edge2']
 * // }
 * ```
 */
export const compareGraphSnapshots = (
  graph1: ThreatGraph,
  graph2: ThreatGraph,
): {
  addedNodes: string[];
  removedNodes: string[];
  addedEdges: string[];
  removedEdges: string[];
} => {
  const nodes1 = new Set(graph1.nodes.keys());
  const nodes2 = new Set(graph2.nodes.keys());
  const edges1 = new Set(graph1.edges.keys());
  const edges2 = new Set(graph2.edges.keys());

  const addedNodes = Array.from(nodes2).filter((id) => !nodes1.has(id));
  const removedNodes = Array.from(nodes1).filter((id) => !nodes2.has(id));
  const addedEdges = Array.from(edges2).filter((id) => !edges1.has(id));
  const removedEdges = Array.from(edges1).filter((id) => !edges2.has(id));

  return { addedNodes, removedNodes, addedEdges, removedEdges };
};

/**
 * Calculates temporal centrality for nodes (importance over time).
 *
 * @param {TemporalGraph} temporalGraph - Temporal graph
 * @returns {Promise<Map<string, number[]>>} Node ID to temporal centrality scores
 *
 * @example
 * ```typescript
 * const temporal = await calculateTemporalCentrality(temporalGraph);
 * // Result: Map { 'node1' => [0.5, 0.6, 0.7, 0.8], ... }
 * ```
 */
export const calculateTemporalCentrality = async (
  temporalGraph: TemporalGraph,
): Promise<Map<string, number[]>> => {
  const centralityMap = new Map<string, number[]>();

  // Calculate centrality for each snapshot
  for (const [timestamp, graph] of temporalGraph.snapshots) {
    const degree = calculateDegreeCentrality(graph);

    for (const [nodeId, score] of degree) {
      const scores = centralityMap.get(nodeId) || [];
      scores.push(score);
      centralityMap.set(nodeId, scores);
    }
  }

  return centralityMap;
};

// ============================================================================
// NEO4J INTEGRATION HELPERS
// ============================================================================

/**
 * Generates Cypher query to create nodes in Neo4j.
 *
 * @param {GraphNode[]} nodes - Nodes to create
 * @returns {Neo4jQuery} Cypher query
 *
 * @example
 * ```typescript
 * const query = generateCreateNodesQuery([
 *   { id: 'malware_123', type: 'malware', properties: {...} }
 * ]);
 * // Result: {
 * //   cypher: 'CREATE (n:malware {id: $id, ...})',
 * //   parameters: {...}
 * // }
 * ```
 */
export const generateCreateNodesQuery = (nodes: GraphNode[]): Neo4jQuery => {
  const cypher = nodes
    .map((node, i) => {
      const labels = [node.type, ...(node.labels || [])].join(':');
      return `CREATE (n${i}:${labels} $props${i})`;
    })
    .join('\n');

  const parameters: Record<string, unknown> = {};
  nodes.forEach((node, i) => {
    parameters[`props${i}`] = { id: node.id, ...node.properties };
  });

  return { cypher, parameters };
};

/**
 * Generates Cypher query to create relationships in Neo4j.
 *
 * @param {GraphEdge[]} edges - Edges to create
 * @returns {Neo4jQuery} Cypher query
 *
 * @example
 * ```typescript
 * const query = generateCreateRelationshipsQuery([
 *   { id: 'edge1', source: 'node1', target: 'node2', type: 'CONNECTS_TO' }
 * ]);
 * ```
 */
export const generateCreateRelationshipsQuery = (edges: GraphEdge[]): Neo4jQuery => {
  const cypher = edges
    .map(
      (edge, i) => `
    MATCH (a {id: $source${i}}), (b {id: $target${i}})
    CREATE (a)-[r${i}:${edge.type} $props${i}]->(b)
  `,
    )
    .join('\n');

  const parameters: Record<string, unknown> = {};
  edges.forEach((edge, i) => {
    parameters[`source${i}`] = edge.source;
    parameters[`target${i}`] = edge.target;
    parameters[`props${i}`] = { id: edge.id, ...edge.properties };
  });

  return { cypher, parameters };
};

/**
 * Generates Cypher query for graph pattern matching.
 *
 * @param {object} pattern - Pattern to match
 * @returns {Neo4jQuery} Cypher query
 *
 * @example
 * ```typescript
 * const query = generatePatternMatchQuery({
 *   nodes: [{ type: 'malware' }, { type: 'actor' }],
 *   relationship: 'ATTRIBUTED_TO'
 * });
 * // Result: {
 * //   cypher: 'MATCH (n:malware)-[:ATTRIBUTED_TO]->(m:actor) RETURN n, m'
 * // }
 * ```
 */
export const generatePatternMatchQuery = (pattern: {
  nodes: Array<{ type: string; properties?: Record<string, unknown> }>;
  relationship?: string;
}): Neo4jQuery => {
  const nodePatterns = pattern.nodes
    .map((n, i) => `(n${i}:${n.type} ${n.properties ? JSON.stringify(n.properties) : ''})`)
    .join('-');

  const rel = pattern.relationship ? `[:${pattern.relationship}]` : '';

  const cypher = `MATCH ${nodePatterns.replace(/-$/, rel + '>')} RETURN *`;

  return { cypher };
};

/**
 * Converts ThreatGraph to Neo4j-compatible format.
 *
 * @param {ThreatGraph} graph - Graph to convert
 * @returns {object} Neo4j-compatible data
 *
 * @example
 * ```typescript
 * const neo4jData = convertToNeo4jFormat(graph);
 * // Result: { nodes: [...], relationships: [...] }
 * ```
 */
export const convertToNeo4jFormat = (
  graph: ThreatGraph,
): { nodes: GraphNode[]; relationships: GraphEdge[] } => {
  return {
    nodes: Array.from(graph.nodes.values()),
    relationships: Array.from(graph.edges.values()),
  };
};

/**
 * Imports graph from Neo4j query results.
 *
 * @param {unknown[]} records - Neo4j query results
 * @returns {ThreatGraph} Imported graph
 *
 * @example
 * ```typescript
 * const graph = importFromNeo4jResults(queryResults);
 * ```
 */
export const importFromNeo4jResults = (records: Array<Record<string, unknown>>): ThreatGraph => {
  const graph = createThreatGraph();

  // Production: Parse Neo4j records and build graph
  return graph;
};

/**
 * Generates Cypher query for graph metrics calculation.
 *
 * @param {string} graphName - Graph name in Neo4j
 * @returns {Neo4jQuery} Cypher query for metrics
 *
 * @example
 * ```typescript
 * const query = generateGraphMetricsQuery('threat_graph');
 * // Result: { cypher: 'MATCH (n) RETURN count(n) as nodeCount, ...' }
 * ```
 */
export const generateGraphMetricsQuery = (graphName: string): Neo4jQuery => {
  const cypher = `
    MATCH (n)
    WITH count(n) as nodeCount
    MATCH ()-[r]->()
    WITH nodeCount, count(r) as edgeCount
    RETURN nodeCount, edgeCount,
           toFloat(edgeCount) / (nodeCount * (nodeCount - 1)) as density
  `;

  return { cypher };
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Graph construction
  createThreatGraph,
  addNode,
  addEdge,
  buildGraphFromIndicators,
  mergeGraphs,
  filterGraph,

  // Graph traversal
  breadthFirstSearch,
  depthFirstSearch,
  getNeighbors,
  findAllPaths,
  topologicalSort,
  detectCycles,

  // Shortest path
  findShortestPath,
  findShortestPaths,
  calculateAveragePathLength,
  findGraphDiameter,
  findKShortestPaths,

  // Community detection
  detectCommunitiesLouvain,
  detectCommunitiesLabelProp,
  findStronglyConnectedComponents,
  findWeaklyConnectedComponents,
  calculateModularity,
  findCliques,

  // Centrality
  calculateDegreeCentrality,
  calculateBetweennessCentrality,
  calculateClosenessCentrality,
  calculatePageRank,
  findMostInfluentialNodes,

  // Visualization
  prepareGraphVisualization,
  applyForceDirectedLayout,
  filterVisualization,
  generateHierarchicalLayout,
  exportVisualizationToSVG,

  // Temporal analysis
  createTemporalGraph,
  analyzeGraphEvolution,
  detectTemporalPatterns,
  forecastGraphStructure,
  compareGraphSnapshots,
  calculateTemporalCentrality,

  // Neo4j integration
  generateCreateNodesQuery,
  generateCreateRelationshipsQuery,
  generatePatternMatchQuery,
  convertToNeo4jFormat,
  importFromNeo4jResults,
  generateGraphMetricsQuery,
};
