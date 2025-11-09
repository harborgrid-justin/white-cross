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
export declare const createThreatGraph: () => ThreatGraph;
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
export declare const addNode: (graph: ThreatGraph, node: GraphNode) => ThreatGraph;
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
export declare const addEdge: (graph: ThreatGraph, edge: GraphEdge) => ThreatGraph;
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
export declare const buildGraphFromIndicators: (indicators: Array<Record<string, unknown>>) => Promise<ThreatGraph>;
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
export declare const mergeGraphs: (graph1: ThreatGraph, graph2: ThreatGraph) => ThreatGraph;
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
export declare const filterGraph: (graph: ThreatGraph, predicate: (node: GraphNode) => boolean) => ThreatGraph;
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
export declare const breadthFirstSearch: (graph: ThreatGraph, startNodeId: string) => string[];
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
export declare const depthFirstSearch: (graph: ThreatGraph, startNodeId: string) => string[];
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
export declare const getNeighbors: (graph: ThreatGraph, nodeId: string, depth?: number) => Set<string>;
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
export declare const findAllPaths: (graph: ThreatGraph, sourceId: string, targetId: string, maxDepth?: number) => GraphPath[];
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
export declare const topologicalSort: (graph: ThreatGraph) => string[];
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
export declare const detectCycles: (graph: ThreatGraph) => boolean;
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
export declare const findShortestPath: (graph: ThreatGraph, sourceId: string, targetId: string) => GraphPath | null;
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
export declare const findShortestPaths: (graph: ThreatGraph, sourceId: string) => Map<string, GraphPath>;
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
export declare const calculateAveragePathLength: (graph: ThreatGraph) => number;
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
export declare const findGraphDiameter: (graph: ThreatGraph) => number;
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
export declare const findKShortestPaths: (graph: ThreatGraph, sourceId: string, targetId: string, k: number) => GraphPath[];
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
export declare const detectCommunitiesLouvain: (graph: ThreatGraph) => Promise<CommunityDetectionResult>;
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
export declare const detectCommunitiesLabelProp: (graph: ThreatGraph, maxIterations?: number) => Promise<CommunityDetectionResult>;
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
export declare const findStronglyConnectedComponents: (graph: ThreatGraph) => Set<string>[];
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
export declare const findWeaklyConnectedComponents: (graph: ThreatGraph) => Set<string>[];
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
export declare const calculateModularity: (graph: ThreatGraph, communityAssignment: Map<string, string>) => number;
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
export declare const findCliques: (graph: ThreatGraph, minSize?: number) => Set<string>[];
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
export declare const calculateDegreeCentrality: (graph: ThreatGraph) => Map<string, number>;
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
export declare const calculateBetweennessCentrality: (graph: ThreatGraph) => Promise<Map<string, number>>;
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
export declare const calculateClosenessCentrality: (graph: ThreatGraph) => Map<string, number>;
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
export declare const calculatePageRank: (graph: ThreatGraph, dampingFactor?: number, maxIterations?: number) => Promise<Map<string, number>>;
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
export declare const findMostInfluentialNodes: (graph: ThreatGraph, topN?: number) => Promise<CentralityScores[]>;
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
export declare const prepareGraphVisualization: (graph: ThreatGraph, options?: {
    nodeSize?: "degree" | "pagerank" | "fixed";
    colorBy?: "type" | "community" | "severity";
    layout?: "force-directed" | "hierarchical" | "circular";
}) => GraphVisualizationData;
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
export declare const applyForceDirectedLayout: (vizData: GraphVisualizationData, iterations?: number) => GraphVisualizationData;
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
export declare const filterVisualization: (vizData: GraphVisualizationData, filters: {
    nodeTypes?: string[];
    minDegree?: number;
    maxNodes?: number;
}) => GraphVisualizationData;
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
export declare const generateHierarchicalLayout: (graph: ThreatGraph, rootNodeId: string) => GraphVisualizationData;
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
export declare const exportVisualizationToSVG: (vizData: GraphVisualizationData) => string;
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
export declare const createTemporalGraph: (snapshots: Array<{
    timestamp: Date;
    graph: ThreatGraph;
}>) => TemporalGraph;
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
export declare const analyzeGraphEvolution: (temporalGraph: TemporalGraph) => {
    growthRate: number;
    nodeAdditions: number;
    nodeDeletions: number;
    edgeAdditions: number;
    edgeDeletions: number;
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
export declare const detectTemporalPatterns: (temporalGraph: TemporalGraph) => Promise<Array<{
    type: string;
    confidence: number;
    details: Record<string, unknown>;
}>>;
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
export declare const forecastGraphStructure: (temporalGraph: TemporalGraph, daysAhead?: number) => Promise<ThreatGraph>;
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
export declare const compareGraphSnapshots: (graph1: ThreatGraph, graph2: ThreatGraph) => {
    addedNodes: string[];
    removedNodes: string[];
    addedEdges: string[];
    removedEdges: string[];
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
export declare const calculateTemporalCentrality: (temporalGraph: TemporalGraph) => Promise<Map<string, number[]>>;
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
export declare const generateCreateNodesQuery: (nodes: GraphNode[]) => Neo4jQuery;
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
export declare const generateCreateRelationshipsQuery: (edges: GraphEdge[]) => Neo4jQuery;
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
export declare const generatePatternMatchQuery: (pattern: {
    nodes: Array<{
        type: string;
        properties?: Record<string, unknown>;
    }>;
    relationship?: string;
}) => Neo4jQuery;
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
export declare const convertToNeo4jFormat: (graph: ThreatGraph) => {
    nodes: GraphNode[];
    relationships: GraphEdge[];
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
export declare const importFromNeo4jResults: (records: Array<Record<string, unknown>>) => ThreatGraph;
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
export declare const generateGraphMetricsQuery: (graphName: string) => Neo4jQuery;
declare const _default: {
    createThreatGraph: () => ThreatGraph;
    addNode: (graph: ThreatGraph, node: GraphNode) => ThreatGraph;
    addEdge: (graph: ThreatGraph, edge: GraphEdge) => ThreatGraph;
    buildGraphFromIndicators: (indicators: Array<Record<string, unknown>>) => Promise<ThreatGraph>;
    mergeGraphs: (graph1: ThreatGraph, graph2: ThreatGraph) => ThreatGraph;
    filterGraph: (graph: ThreatGraph, predicate: (node: GraphNode) => boolean) => ThreatGraph;
    breadthFirstSearch: (graph: ThreatGraph, startNodeId: string) => string[];
    depthFirstSearch: (graph: ThreatGraph, startNodeId: string) => string[];
    getNeighbors: (graph: ThreatGraph, nodeId: string, depth?: number) => Set<string>;
    findAllPaths: (graph: ThreatGraph, sourceId: string, targetId: string, maxDepth?: number) => GraphPath[];
    topologicalSort: (graph: ThreatGraph) => string[];
    detectCycles: (graph: ThreatGraph) => boolean;
    findShortestPath: (graph: ThreatGraph, sourceId: string, targetId: string) => GraphPath | null;
    findShortestPaths: (graph: ThreatGraph, sourceId: string) => Map<string, GraphPath>;
    calculateAveragePathLength: (graph: ThreatGraph) => number;
    findGraphDiameter: (graph: ThreatGraph) => number;
    findKShortestPaths: (graph: ThreatGraph, sourceId: string, targetId: string, k: number) => GraphPath[];
    detectCommunitiesLouvain: (graph: ThreatGraph) => Promise<CommunityDetectionResult>;
    detectCommunitiesLabelProp: (graph: ThreatGraph, maxIterations?: number) => Promise<CommunityDetectionResult>;
    findStronglyConnectedComponents: (graph: ThreatGraph) => Set<string>[];
    findWeaklyConnectedComponents: (graph: ThreatGraph) => Set<string>[];
    calculateModularity: (graph: ThreatGraph, communityAssignment: Map<string, string>) => number;
    findCliques: (graph: ThreatGraph, minSize?: number) => Set<string>[];
    calculateDegreeCentrality: (graph: ThreatGraph) => Map<string, number>;
    calculateBetweennessCentrality: (graph: ThreatGraph) => Promise<Map<string, number>>;
    calculateClosenessCentrality: (graph: ThreatGraph) => Map<string, number>;
    calculatePageRank: (graph: ThreatGraph, dampingFactor?: number, maxIterations?: number) => Promise<Map<string, number>>;
    findMostInfluentialNodes: (graph: ThreatGraph, topN?: number) => Promise<CentralityScores[]>;
    prepareGraphVisualization: (graph: ThreatGraph, options?: {
        nodeSize?: "degree" | "pagerank" | "fixed";
        colorBy?: "type" | "community" | "severity";
        layout?: "force-directed" | "hierarchical" | "circular";
    }) => GraphVisualizationData;
    applyForceDirectedLayout: (vizData: GraphVisualizationData, iterations?: number) => GraphVisualizationData;
    filterVisualization: (vizData: GraphVisualizationData, filters: {
        nodeTypes?: string[];
        minDegree?: number;
        maxNodes?: number;
    }) => GraphVisualizationData;
    generateHierarchicalLayout: (graph: ThreatGraph, rootNodeId: string) => GraphVisualizationData;
    exportVisualizationToSVG: (vizData: GraphVisualizationData) => string;
    createTemporalGraph: (snapshots: Array<{
        timestamp: Date;
        graph: ThreatGraph;
    }>) => TemporalGraph;
    analyzeGraphEvolution: (temporalGraph: TemporalGraph) => {
        growthRate: number;
        nodeAdditions: number;
        nodeDeletions: number;
        edgeAdditions: number;
        edgeDeletions: number;
    };
    detectTemporalPatterns: (temporalGraph: TemporalGraph) => Promise<Array<{
        type: string;
        confidence: number;
        details: Record<string, unknown>;
    }>>;
    forecastGraphStructure: (temporalGraph: TemporalGraph, daysAhead?: number) => Promise<ThreatGraph>;
    compareGraphSnapshots: (graph1: ThreatGraph, graph2: ThreatGraph) => {
        addedNodes: string[];
        removedNodes: string[];
        addedEdges: string[];
        removedEdges: string[];
    };
    calculateTemporalCentrality: (temporalGraph: TemporalGraph) => Promise<Map<string, number[]>>;
    generateCreateNodesQuery: (nodes: GraphNode[]) => Neo4jQuery;
    generateCreateRelationshipsQuery: (edges: GraphEdge[]) => Neo4jQuery;
    generatePatternMatchQuery: (pattern: {
        nodes: Array<{
            type: string;
            properties?: Record<string, unknown>;
        }>;
        relationship?: string;
    }) => Neo4jQuery;
    convertToNeo4jFormat: (graph: ThreatGraph) => {
        nodes: GraphNode[];
        relationships: GraphEdge[];
    };
    importFromNeo4jResults: (records: Array<Record<string, unknown>>) => ThreatGraph;
    generateGraphMetricsQuery: (graphName: string) => Neo4jQuery;
};
export default _default;
//# sourceMappingURL=threat-graph-analysis-kit.d.ts.map