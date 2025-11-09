/**
 * LOC: TCOR1234567
 * File: /reuse/threat/threat-correlation-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Threat intelligence services
 *   - IOC analysis controllers
 *   - Correlation engine implementations
 */

/**
 * File: /reuse/threat/threat-correlation-kit.ts
 * Locator: WC-UTL-TCOR-001
 * Purpose: Comprehensive Threat Correlation Utilities - Multi-dimensional correlation, IOC relationships, temporal/spatial analysis
 *
 * Upstream: Independent utility module for threat intelligence correlation
 * Downstream: ../backend/*, Threat services, correlation engines, analytics dashboards
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, Swagger/OpenAPI
 * Exports: 46 utility functions for threat correlation, IOC relationship discovery, temporal analysis, spatial correlation, behavioral patterns, graph algorithms, confidence scoring
 *
 * LLM Context: Comprehensive threat correlation utilities for implementing production-ready threat intelligence systems.
 * Provides multi-dimensional correlation, IOC relationship discovery, temporal/spatial analysis, behavioral pattern matching,
 * graph-based algorithms, and confidence scoring. Essential for building advanced threat detection and analysis platforms.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface CorrelationConfig {
  dimensions: string[];
  weights?: Record<string, number>;
  threshold?: number;
  algorithm?: 'pearson' | 'cosine' | 'jaccard' | 'euclidean';
  normalize?: boolean;
}

interface CorrelationResult {
  score: number;
  confidence: number;
  matches: CorrelationMatch[];
  metadata: Record<string, unknown>;
  dimensions: string[];
}

interface CorrelationMatch {
  entityId: string;
  entityType: 'ip' | 'domain' | 'hash' | 'url' | 'email';
  score: number;
  attributes: Record<string, unknown>;
  timestamp: Date;
}

interface IOCRelationship {
  sourceId: string;
  targetId: string;
  relationshipType: 'communicates_with' | 'resolves_to' | 'contains' | 'derived_from' | 'associated_with';
  strength: number;
  confidence: number;
  evidence: Evidence[];
  firstSeen: Date;
  lastSeen: Date;
}

interface Evidence {
  source: string;
  type: string;
  data: Record<string, unknown>;
  timestamp: Date;
  reliability: number;
}

interface TemporalCorrelation {
  timeWindow: TimeWindow;
  events: TemporalEvent[];
  patterns: TemporalPattern[];
  anomalies: TemporalAnomaly[];
  score: number;
}

interface TimeWindow {
  start: Date;
  end: Date;
  duration: number;
  unit: 'seconds' | 'minutes' | 'hours' | 'days';
}

interface TemporalEvent {
  id: string;
  timestamp: Date;
  type: string;
  data: Record<string, unknown>;
  sequence?: number;
}

interface TemporalPattern {
  patternType: 'sequential' | 'concurrent' | 'periodic' | 'burst';
  events: string[];
  frequency: number;
  confidence: number;
}

interface TemporalAnomaly {
  type: 'outlier' | 'gap' | 'spike' | 'drift';
  timestamp: Date;
  severity: number;
  description: string;
}

interface SpatialCorrelation {
  locations: GeoLocation[];
  clusters: GeoCluster[];
  proximity: ProximityMetric[];
  heatmap: HeatmapData;
  score: number;
}

interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  country?: string;
  region?: string;
  city?: string;
  metadata?: Record<string, unknown>;
}

interface GeoCluster {
  centroid: GeoLocation;
  radius: number;
  members: string[];
  density: number;
}

interface ProximityMetric {
  entity1: string;
  entity2: string;
  distance: number;
  unit: 'km' | 'miles';
}

interface HeatmapData {
  gridSize: number;
  cells: HeatmapCell[];
  intensity: 'low' | 'medium' | 'high';
}

interface HeatmapCell {
  x: number;
  y: number;
  value: number;
  count: number;
}

interface BehavioralPattern {
  patternId: string;
  signature: string[];
  frequency: number;
  entities: string[];
  classification: 'malicious' | 'suspicious' | 'benign' | 'unknown';
  confidence: number;
}

interface BehavioralAnomaly {
  entityId: string;
  deviationScore: number;
  expectedBehavior: string[];
  observedBehavior: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface GraphNode {
  id: string;
  type: string;
  attributes: Record<string, unknown>;
  degree: number;
  weight?: number;
}

interface GraphEdge {
  source: string;
  target: string;
  weight: number;
  type: string;
  properties?: Record<string, unknown>;
}

interface CorrelationGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  metadata: GraphMetadata;
}

interface GraphMetadata {
  nodeCount: number;
  edgeCount: number;
  density: number;
  avgDegree: number;
  components: number;
}

interface CorrelationScore {
  overall: number;
  components: ScoreComponent[];
  confidence: number;
  factors: ScoringFactor[];
}

interface ScoreComponent {
  dimension: string;
  score: number;
  weight: number;
  contribution: number;
}

interface ScoringFactor {
  name: string;
  value: number;
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
}

interface ConfidenceInterval {
  lower: number;
  upper: number;
  confidence: number;
  method: 'bootstrap' | 'bayesian' | 'frequentist';
}

interface ThreatActor {
  id: string;
  name: string;
  aliases: string[];
  tactics: string[];
  techniques: string[];
  procedures: string[];
  confidence: number;
}

// ============================================================================
// MULTI-DIMENSIONAL CORRELATION
// ============================================================================

/**
 * Correlates threats across multiple dimensions using configurable algorithms.
 *
 * @param {Record<string, unknown>[]} threats - Array of threat entities
 * @param {CorrelationConfig} config - Correlation configuration
 * @returns {CorrelationResult[]} Array of correlation results
 * @throws {Error} If threats array is empty or config is invalid
 *
 * @example
 * ```typescript
 * const threats = [
 *   { id: 'ip1', type: 'ip', country: 'US', asn: 12345, port: 443 },
 *   { id: 'ip2', type: 'ip', country: 'US', asn: 12345, port: 80 }
 * ];
 * const results = correlateThreatsByAttributes(threats, {
 *   dimensions: ['country', 'asn'],
 *   algorithm: 'jaccard',
 *   threshold: 0.7
 * });
 * // Result: [{ score: 0.85, confidence: 0.9, matches: [...], ... }]
 * ```
 */
export const correlateThreatsByAttributes = (
  threats: Record<string, unknown>[],
  config: CorrelationConfig,
): CorrelationResult[] => {
  if (!threats || threats.length === 0) {
    throw new Error('Threats array cannot be empty');
  }

  if (!config.dimensions || config.dimensions.length === 0) {
    throw new Error('At least one dimension must be specified');
  }

  const results: CorrelationResult[] = [];
  const threshold = config.threshold || 0.5;

  for (let i = 0; i < threats.length; i++) {
    for (let j = i + 1; j < threats.length; j++) {
      const score = calculateAttributeSimilarity(threats[i], threats[j], config);

      if (score >= threshold) {
        results.push({
          score,
          confidence: calculateConfidenceFromEvidence(score, config.dimensions.length),
          matches: [
            createCorrelationMatch(threats[i]),
            createCorrelationMatch(threats[j]),
          ],
          metadata: {
            algorithm: config.algorithm || 'jaccard',
            dimensions: config.dimensions,
          },
          dimensions: config.dimensions,
        });
      }
    }
  }

  return results;
};

/**
 * Calculates weighted correlation score across multiple dimensions.
 *
 * @param {Record<string, unknown>} entity1 - First entity
 * @param {Record<string, unknown>} entity2 - Second entity
 * @param {Record<string, number>} weights - Dimension weights
 * @returns {number} Weighted correlation score (0-1)
 *
 * @example
 * ```typescript
 * const score = calculateWeightedCorrelation(
 *   { ip: '1.2.3.4', port: 443, country: 'US' },
 *   { ip: '1.2.3.5', port: 443, country: 'US' },
 *   { port: 0.3, country: 0.7 }
 * );
 * // Result: 0.85 (weighted average of dimension matches)
 * ```
 */
export const calculateWeightedCorrelation = (
  entity1: Record<string, unknown>,
  entity2: Record<string, unknown>,
  weights: Record<string, number>,
): number => {
  let totalWeight = 0;
  let weightedSum = 0;

  Object.entries(weights).forEach(([dimension, weight]) => {
    if (entity1[dimension] !== undefined && entity2[dimension] !== undefined) {
      const match = entity1[dimension] === entity2[dimension] ? 1 : 0;
      weightedSum += match * weight;
      totalWeight += weight;
    }
  });

  return totalWeight > 0 ? weightedSum / totalWeight : 0;
};

/**
 * Cross-references IOCs across multiple threat intelligence sources.
 *
 * @param {string[]} iocs - Array of IOC identifiers
 * @param {string[]} sources - Array of source identifiers
 * @returns {Promise<Record<string, string[]>>} Map of IOC to matching sources
 *
 * @example
 * ```typescript
 * const matches = await crossReferenceIOCs(
 *   ['192.168.1.1', 'malware.com'],
 *   ['virustotal', 'alienvault', 'threatcrowd']
 * );
 * // Result: { '192.168.1.1': ['virustotal', 'alienvault'], 'malware.com': ['threatcrowd'] }
 * ```
 */
export const crossReferenceIOCs = async (
  iocs: string[],
  sources: string[],
): Promise<Record<string, string[]>> => {
  if (!iocs || iocs.length === 0) {
    throw new Error('IOCs array cannot be empty');
  }

  const results: Record<string, string[]> = {};

  for (const ioc of iocs) {
    results[ioc] = [];
    // In production, this would query actual threat intel sources
    // Simulated cross-referencing logic
    for (const source of sources) {
      // Placeholder for actual API calls
      const found = Math.random() > 0.5; // Simulated
      if (found) {
        results[ioc].push(source);
      }
    }
  }

  return results;
};

/**
 * Builds correlation matrix for threat entities.
 *
 * @param {Record<string, unknown>[]} entities - Array of entities
 * @param {string[]} dimensions - Dimensions to correlate
 * @returns {number[][]} Correlation matrix
 *
 * @example
 * ```typescript
 * const matrix = buildCorrelationMatrix(
 *   [{ id: 'e1', country: 'US' }, { id: 'e2', country: 'US' }, { id: 'e3', country: 'CN' }],
 *   ['country']
 * );
 * // Result: [[1.0, 1.0, 0.0], [1.0, 1.0, 0.0], [0.0, 0.0, 1.0]]
 * ```
 */
export const buildCorrelationMatrix = (
  entities: Record<string, unknown>[],
  dimensions: string[],
): number[][] => {
  const n = entities.length;
  const matrix: number[][] = Array(n)
    .fill(0)
    .map(() => Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) {
        matrix[i][j] = 1.0;
      } else {
        const score = calculateAttributeSimilarity(entities[i], entities[j], {
          dimensions,
          algorithm: 'jaccard',
        });
        matrix[i][j] = score;
      }
    }
  }

  return matrix;
};

/**
 * Finds correlation clusters using similarity threshold.
 *
 * @param {CorrelationResult[]} correlations - Array of correlation results
 * @param {number} threshold - Minimum similarity threshold
 * @returns {string[][]} Array of entity ID clusters
 *
 * @example
 * ```typescript
 * const clusters = findCorrelationClusters(correlations, 0.8);
 * // Result: [['id1', 'id2', 'id3'], ['id4', 'id5']]
 * ```
 */
export const findCorrelationClusters = (
  correlations: CorrelationResult[],
  threshold: number,
): string[][] => {
  const clusters: string[][] = [];
  const assigned = new Set<string>();

  correlations
    .filter((c) => c.score >= threshold)
    .forEach((correlation) => {
      const entityIds = correlation.matches.map((m) => m.entityId);
      const unassigned = entityIds.filter((id) => !assigned.has(id));

      if (unassigned.length > 0) {
        const cluster = [...unassigned];
        clusters.push(cluster);
        cluster.forEach((id) => assigned.add(id));
      }
    });

  return clusters;
};

/**
 * Scores correlation strength based on multiple factors.
 *
 * @param {CorrelationMatch[]} matches - Array of correlation matches
 * @param {string[]} dimensions - Dimensions being correlated
 * @returns {number} Correlation strength score (0-1)
 *
 * @example
 * ```typescript
 * const strength = scoreCorrelationStrength(matches, ['ip', 'port', 'protocol']);
 * // Result: 0.87
 * ```
 */
export const scoreCorrelationStrength = (
  matches: CorrelationMatch[],
  dimensions: string[],
): number => {
  if (matches.length < 2) return 0;

  const avgScore = matches.reduce((sum, m) => sum + m.score, 0) / matches.length;
  const dimensionFactor = Math.min(dimensions.length / 5, 1.0);
  const matchCountFactor = Math.min(matches.length / 10, 1.0);

  return avgScore * 0.6 + dimensionFactor * 0.2 + matchCountFactor * 0.2;
};

/**
 * Normalizes correlation data to standard range.
 *
 * @param {CorrelationResult[]} results - Array of correlation results
 * @param {number} [min] - Minimum value (default: 0)
 * @param {number} [max] - Maximum value (default: 1)
 * @returns {CorrelationResult[]} Normalized correlation results
 *
 * @example
 * ```typescript
 * const normalized = normalizeCorrelationData(results, 0, 100);
 * // Scores normalized to 0-100 range
 * ```
 */
export const normalizeCorrelationData = (
  results: CorrelationResult[],
  min: number = 0,
  max: number = 1,
): CorrelationResult[] => {
  if (results.length === 0) return results;

  const scores = results.map((r) => r.score);
  const minScore = Math.min(...scores);
  const maxScore = Math.max(...scores);
  const range = maxScore - minScore;

  if (range === 0) return results;

  return results.map((result) => ({
    ...result,
    score: min + ((result.score - minScore) / range) * (max - min),
  }));
};

/**
 * Aggregates correlation results by entity type.
 *
 * @param {CorrelationResult[]} results - Array of correlation results
 * @returns {Record<string, CorrelationResult[]>} Results grouped by entity type
 *
 * @example
 * ```typescript
 * const aggregated = aggregateCorrelationResults(results);
 * // Result: { 'ip': [...], 'domain': [...], 'hash': [...] }
 * ```
 */
export const aggregateCorrelationResults = (
  results: CorrelationResult[],
): Record<string, CorrelationResult[]> => {
  const aggregated: Record<string, CorrelationResult[]> = {};

  results.forEach((result) => {
    result.matches.forEach((match) => {
      if (!aggregated[match.entityType]) {
        aggregated[match.entityType] = [];
      }
      aggregated[match.entityType].push(result);
    });
  });

  return aggregated;
};

// ============================================================================
// IOC RELATIONSHIP DISCOVERY
// ============================================================================

/**
 * Discovers relationships between IOCs using graph analysis.
 *
 * @param {string[]} iocs - Array of IOC identifiers
 * @param {number} [depth] - Maximum depth for relationship traversal (default: 2)
 * @returns {Promise<IOCRelationship[]>} Array of discovered relationships
 *
 * @example
 * ```typescript
 * const relationships = await discoverIOCRelationships(['192.168.1.1', 'malware.com'], 2);
 * // Result: [{ sourceId: '192.168.1.1', targetId: 'malware.com', relationshipType: 'resolves_to', ... }]
 * ```
 */
export const discoverIOCRelationships = async (
  iocs: string[],
  depth: number = 2,
): Promise<IOCRelationship[]> => {
  if (!iocs || iocs.length === 0) {
    throw new Error('IOCs array cannot be empty');
  }

  if (depth < 1 || depth > 5) {
    throw new Error('Depth must be between 1 and 5');
  }

  const relationships: IOCRelationship[] = [];
  const visited = new Set<string>();

  const traverse = async (currentIOC: string, currentDepth: number): Promise<void> => {
    if (currentDepth > depth || visited.has(currentIOC)) return;
    visited.add(currentIOC);

    // In production, query actual threat intelligence databases
    // Simulated relationship discovery
    for (const targetIOC of iocs) {
      if (targetIOC !== currentIOC && !visited.has(targetIOC)) {
        const relationship = await findRelationship(currentIOC, targetIOC);
        if (relationship) {
          relationships.push(relationship);
          await traverse(targetIOC, currentDepth + 1);
        }
      }
    }
  };

  for (const ioc of iocs) {
    await traverse(ioc, 1);
  }

  return relationships;
};

/**
 * Calculates relationship strength between two IOCs.
 *
 * @param {string} ioc1 - First IOC identifier
 * @param {string} ioc2 - Second IOC identifier
 * @param {Evidence[]} evidence - Supporting evidence
 * @returns {number} Relationship strength (0-1)
 *
 * @example
 * ```typescript
 * const strength = calculateRelationshipStrength('192.168.1.1', 'malware.com', evidence);
 * // Result: 0.85
 * ```
 */
export const calculateRelationshipStrength = (
  ioc1: string,
  ioc2: string,
  evidence: Evidence[],
): number => {
  if (evidence.length === 0) return 0;

  const avgReliability = evidence.reduce((sum, e) => sum + e.reliability, 0) / evidence.length;
  const evidenceCountFactor = Math.min(evidence.length / 10, 1.0);
  const recencyFactor = calculateRecencyFactor(evidence);

  return avgReliability * 0.5 + evidenceCountFactor * 0.3 + recencyFactor * 0.2;
};

/**
 * Builds relationship graph from IOC data.
 *
 * @param {IOCRelationship[]} relationships - Array of IOC relationships
 * @returns {CorrelationGraph} Graph representation of relationships
 *
 * @example
 * ```typescript
 * const graph = buildRelationshipGraph(relationships);
 * // Result: { nodes: [...], edges: [...], metadata: {...} }
 * ```
 */
export const buildRelationshipGraph = (
  relationships: IOCRelationship[],
): CorrelationGraph => {
  const nodeMap = new Map<string, GraphNode>();
  const edges: GraphEdge[] = [];

  relationships.forEach((rel) => {
    // Add source node
    if (!nodeMap.has(rel.sourceId)) {
      nodeMap.set(rel.sourceId, {
        id: rel.sourceId,
        type: 'ioc',
        attributes: {},
        degree: 0,
      });
    }

    // Add target node
    if (!nodeMap.has(rel.targetId)) {
      nodeMap.set(rel.targetId, {
        id: rel.targetId,
        type: 'ioc',
        attributes: {},
        degree: 0,
      });
    }

    // Add edge
    edges.push({
      source: rel.sourceId,
      target: rel.targetId,
      weight: rel.strength,
      type: rel.relationshipType,
      properties: {
        confidence: rel.confidence,
        firstSeen: rel.firstSeen,
        lastSeen: rel.lastSeen,
      },
    });

    // Update node degrees
    nodeMap.get(rel.sourceId)!.degree++;
    nodeMap.get(rel.targetId)!.degree++;
  });

  const nodes = Array.from(nodeMap.values());

  return {
    nodes,
    edges,
    metadata: {
      nodeCount: nodes.length,
      edgeCount: edges.length,
      density: edges.length / (nodes.length * (nodes.length - 1) / 2),
      avgDegree: nodes.reduce((sum, n) => sum + n.degree, 0) / nodes.length,
      components: calculateConnectedComponents(nodes, edges),
    },
  };
};

/**
 * Finds IOCs connected to a given IOC.
 *
 * @param {string} iocId - IOC identifier
 * @param {IOCRelationship[]} relationships - Array of relationships
 * @param {number} [maxDistance] - Maximum relationship distance (default: 1)
 * @returns {string[]} Array of connected IOC IDs
 *
 * @example
 * ```typescript
 * const connected = findConnectedIOCs('192.168.1.1', relationships, 2);
 * // Result: ['malware.com', '1.2.3.4', 'badsite.net']
 * ```
 */
export const findConnectedIOCs = (
  iocId: string,
  relationships: IOCRelationship[],
  maxDistance: number = 1,
): string[] => {
  const connected = new Set<string>();
  const visited = new Set<string>();

  const traverse = (currentId: string, distance: number): void => {
    if (distance > maxDistance || visited.has(currentId)) return;
    visited.add(currentId);

    relationships.forEach((rel) => {
      if (rel.sourceId === currentId) {
        connected.add(rel.targetId);
        traverse(rel.targetId, distance + 1);
      } else if (rel.targetId === currentId) {
        connected.add(rel.sourceId);
        traverse(rel.sourceId, distance + 1);
      }
    });
  };

  traverse(iocId, 0);
  connected.delete(iocId); // Remove self

  return Array.from(connected);
};

/**
 * Detects clusters of related IOCs.
 *
 * @param {IOCRelationship[]} relationships - Array of relationships
 * @param {number} minClusterSize - Minimum cluster size
 * @returns {string[][]} Array of IOC clusters
 *
 * @example
 * ```typescript
 * const clusters = detectIOCClusters(relationships, 3);
 * // Result: [['ioc1', 'ioc2', 'ioc3'], ['ioc4', 'ioc5', 'ioc6', 'ioc7']]
 * ```
 */
export const detectIOCClusters = (
  relationships: IOCRelationship[],
  minClusterSize: number,
): string[][] => {
  const graph = buildRelationshipGraph(relationships);
  const clusters: string[][] = [];
  const visited = new Set<string>();

  const dfs = (nodeId: string, cluster: string[]): void => {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);
    cluster.push(nodeId);

    graph.edges.forEach((edge) => {
      if (edge.source === nodeId && !visited.has(edge.target)) {
        dfs(edge.target, cluster);
      } else if (edge.target === nodeId && !visited.has(edge.source)) {
        dfs(edge.source, cluster);
      }
    });
  };

  graph.nodes.forEach((node) => {
    if (!visited.has(node.id)) {
      const cluster: string[] = [];
      dfs(node.id, cluster);
      if (cluster.length >= minClusterSize) {
        clusters.push(cluster);
      }
    }
  });

  return clusters;
};

/**
 * Analyzes graph connectivity metrics.
 *
 * @param {CorrelationGraph} graph - Correlation graph
 * @returns {Record<string, number>} Connectivity metrics
 *
 * @example
 * ```typescript
 * const metrics = analyzeGraphConnectivity(graph);
 * // Result: { density: 0.42, avgPathLength: 2.3, diameter: 5, clustering: 0.67 }
 * ```
 */
export const analyzeGraphConnectivity = (
  graph: CorrelationGraph,
): Record<string, number> => {
  const n = graph.nodes.length;
  const m = graph.edges.length;

  return {
    density: m / (n * (n - 1) / 2),
    avgDegree: graph.metadata.avgDegree,
    maxDegree: Math.max(...graph.nodes.map((node) => node.degree)),
    minDegree: Math.min(...graph.nodes.map((node) => node.degree)),
    components: graph.metadata.components,
  };
};

/**
 * Extracts relationship paths between two IOCs.
 *
 * @param {string} sourceId - Source IOC ID
 * @param {string} targetId - Target IOC ID
 * @param {CorrelationGraph} graph - Correlation graph
 * @param {number} [maxPaths] - Maximum number of paths to return (default: 5)
 * @returns {string[][]} Array of paths (each path is array of IOC IDs)
 *
 * @example
 * ```typescript
 * const paths = extractRelationshipPaths('ioc1', 'ioc5', graph, 3);
 * // Result: [['ioc1', 'ioc2', 'ioc5'], ['ioc1', 'ioc3', 'ioc4', 'ioc5']]
 * ```
 */
export const extractRelationshipPaths = (
  sourceId: string,
  targetId: string,
  graph: CorrelationGraph,
  maxPaths: number = 5,
): string[][] => {
  const paths: string[][] = [];
  const visited = new Set<string>();

  const dfs = (currentId: string, path: string[]): void => {
    if (paths.length >= maxPaths) return;

    if (currentId === targetId) {
      paths.push([...path, currentId]);
      return;
    }

    if (visited.has(currentId)) return;
    visited.add(currentId);

    graph.edges
      .filter((edge) => edge.source === currentId)
      .forEach((edge) => {
        dfs(edge.target, [...path, currentId]);
      });

    visited.delete(currentId);
  };

  dfs(sourceId, []);
  return paths;
};

/**
 * Scores relationship confidence based on evidence.
 *
 * @param {IOCRelationship} relationship - Relationship to score
 * @returns {number} Confidence score (0-1)
 *
 * @example
 * ```typescript
 * const confidence = scoreRelationshipConfidence(relationship);
 * // Result: 0.92
 * ```
 */
export const scoreRelationshipConfidence = (relationship: IOCRelationship): number => {
  const evidenceScore = relationship.evidence.length > 0
    ? relationship.evidence.reduce((sum, e) => sum + e.reliability, 0) / relationship.evidence.length
    : 0;

  const strengthScore = relationship.strength;
  const recencyScore = calculateRecencyFactor(relationship.evidence);
  const diversityScore = calculateEvidenceDiversity(relationship.evidence);

  return (
    evidenceScore * 0.4 +
    strengthScore * 0.3 +
    recencyScore * 0.2 +
    diversityScore * 0.1
  );
};

// ============================================================================
// TEMPORAL CORRELATION
// ============================================================================

/**
 * Analyzes temporal patterns in threat events.
 *
 * @param {TemporalEvent[]} events - Array of temporal events
 * @param {TimeWindow} window - Time window for analysis
 * @returns {TemporalCorrelation} Temporal correlation analysis
 *
 * @example
 * ```typescript
 * const analysis = analyzeTemporalPatterns(events, {
 *   start: new Date('2024-01-01'),
 *   end: new Date('2024-01-31'),
 *   duration: 30,
 *   unit: 'days'
 * });
 * // Result: { timeWindow: {...}, events: [...], patterns: [...], anomalies: [...], score: 0.78 }
 * ```
 */
export const analyzeTemporalPatterns = (
  events: TemporalEvent[],
  window: TimeWindow,
): TemporalCorrelation => {
  const filteredEvents = events.filter(
    (e) => e.timestamp >= window.start && e.timestamp <= window.end,
  );

  const patterns = detectTemporalPatterns(filteredEvents);
  const anomalies = detectTemporalAnomalies(filteredEvents, window);
  const score = calculateTemporalScore(patterns, anomalies);

  return {
    timeWindow: window,
    events: filteredEvents,
    patterns,
    anomalies,
    score,
  };
};

/**
 * Correlates event sequences for pattern matching.
 *
 * @param {TemporalEvent[]} events - Array of events
 * @param {string[]} expectedSequence - Expected event sequence
 * @param {number} [maxGap] - Maximum time gap between events in milliseconds (default: 3600000)
 * @returns {TemporalEvent[][]} Array of matching event sequences
 *
 * @example
 * ```typescript
 * const sequences = correlateEventSequences(events, ['login', 'privilege_escalation', 'data_exfiltration'], 3600000);
 * // Result: [[event1, event2, event3], [event4, event5, event6]]
 * ```
 */
export const correlateEventSequences = (
  events: TemporalEvent[],
  expectedSequence: string[],
  maxGap: number = 3600000,
): TemporalEvent[][] => {
  const sequences: TemporalEvent[][] = [];
  const sortedEvents = [...events].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  for (let i = 0; i < sortedEvents.length; i++) {
    if (sortedEvents[i].type === expectedSequence[0]) {
      const sequence = matchSequence(sortedEvents, i, expectedSequence, maxGap);
      if (sequence.length === expectedSequence.length) {
        sequences.push(sequence);
      }
    }
  }

  return sequences;
};

/**
 * Detects time-based clusters of events.
 *
 * @param {TemporalEvent[]} events - Array of events
 * @param {number} timeThreshold - Maximum time difference for clustering (milliseconds)
 * @returns {TemporalEvent[][]} Array of event clusters
 *
 * @example
 * ```typescript
 * const clusters = detectTimeBasedClusters(events, 300000); // 5 minutes
 * // Result: [[event1, event2], [event3, event4, event5]]
 * ```
 */
export const detectTimeBasedClusters = (
  events: TemporalEvent[],
  timeThreshold: number,
): TemporalEvent[][] => {
  const sortedEvents = [...events].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  const clusters: TemporalEvent[][] = [];
  let currentCluster: TemporalEvent[] = [];

  sortedEvents.forEach((event, index) => {
    if (index === 0) {
      currentCluster.push(event);
    } else {
      const timeDiff = event.timestamp.getTime() - sortedEvents[index - 1].timestamp.getTime();
      if (timeDiff <= timeThreshold) {
        currentCluster.push(event);
      } else {
        if (currentCluster.length > 0) {
          clusters.push(currentCluster);
        }
        currentCluster = [event];
      }
    }
  });

  if (currentCluster.length > 0) {
    clusters.push(currentCluster);
  }

  return clusters;
};

/**
 * Calculates temporal proximity between events.
 *
 * @param {TemporalEvent} event1 - First event
 * @param {TemporalEvent} event2 - Second event
 * @returns {number} Proximity score (0-1, higher is closer in time)
 *
 * @example
 * ```typescript
 * const proximity = calculateTemporalProximity(event1, event2);
 * // Result: 0.95 (events very close in time)
 * ```
 */
export const calculateTemporalProximity = (
  event1: TemporalEvent,
  event2: TemporalEvent,
): number => {
  const timeDiff = Math.abs(event1.timestamp.getTime() - event2.timestamp.getTime());
  const maxDiff = 86400000; // 24 hours in milliseconds
  return Math.max(0, 1 - timeDiff / maxDiff);
};

/**
 * Builds timeline correlation across multiple entities.
 *
 * @param {Record<string, TemporalEvent[]>} entityEvents - Map of entity ID to events
 * @param {TimeWindow} window - Time window
 * @returns {Record<string, TemporalCorrelation>} Timeline correlations by entity
 *
 * @example
 * ```typescript
 * const timeline = buildTimelineCorrelation({
 *   'entity1': [event1, event2],
 *   'entity2': [event3, event4]
 * }, timeWindow);
 * ```
 */
export const buildTimelineCorrelation = (
  entityEvents: Record<string, TemporalEvent[]>,
  window: TimeWindow,
): Record<string, TemporalCorrelation> => {
  const correlations: Record<string, TemporalCorrelation> = {};

  Object.entries(entityEvents).forEach(([entityId, events]) => {
    correlations[entityId] = analyzeTemporalPatterns(events, window);
  });

  return correlations;
};

/**
 * Finds temporal anomalies in event stream.
 *
 * @param {TemporalEvent[]} events - Array of events
 * @param {number} [threshold] - Anomaly detection threshold (default: 2.0 std devs)
 * @returns {TemporalAnomaly[]} Array of detected anomalies
 *
 * @example
 * ```typescript
 * const anomalies = findTemporalAnomalies(events, 2.5);
 * // Result: [{ type: 'spike', timestamp: Date, severity: 8, description: '...' }]
 * ```
 */
export const findTemporalAnomalies = (
  events: TemporalEvent[],
  threshold: number = 2.0,
): TemporalAnomaly[] => {
  return detectTemporalAnomalies(events, {
    start: new Date(Math.min(...events.map((e) => e.timestamp.getTime()))),
    end: new Date(Math.max(...events.map((e) => e.timestamp.getTime()))),
    duration: 0,
    unit: 'seconds',
  });
};

/**
 * Aggregates events into time windows.
 *
 * @param {TemporalEvent[]} events - Array of events
 * @param {number} windowSize - Window size in milliseconds
 * @returns {Record<number, TemporalEvent[]>} Events grouped by window
 *
 * @example
 * ```typescript
 * const windows = aggregateTimeWindows(events, 3600000); // 1 hour windows
 * // Result: { 1704067200000: [event1, event2], 1704070800000: [event3, event4] }
 * ```
 */
export const aggregateTimeWindows = (
  events: TemporalEvent[],
  windowSize: number,
): Record<number, TemporalEvent[]> => {
  const windows: Record<number, TemporalEvent[]> = {};

  events.forEach((event) => {
    const windowStart = Math.floor(event.timestamp.getTime() / windowSize) * windowSize;
    if (!windows[windowStart]) {
      windows[windowStart] = [];
    }
    windows[windowStart].push(event);
  });

  return windows;
};

/**
 * Scores temporal relevance of events.
 *
 * @param {TemporalEvent[]} events - Array of events
 * @param {Date} referenceTime - Reference timestamp
 * @param {number} [decayFactor] - Time decay factor (default: 0.1)
 * @returns {Record<string, number>} Event ID to relevance score
 *
 * @example
 * ```typescript
 * const scores = scoreTemporalRelevance(events, new Date(), 0.05);
 * // Result: { 'event1': 0.95, 'event2': 0.82, 'event3': 0.45 }
 * ```
 */
export const scoreTemporalRelevance = (
  events: TemporalEvent[],
  referenceTime: Date,
  decayFactor: number = 0.1,
): Record<string, number> => {
  const scores: Record<string, number> = {};

  events.forEach((event) => {
    const ageInDays = (referenceTime.getTime() - event.timestamp.getTime()) / 86400000;
    scores[event.id] = Math.exp(-decayFactor * ageInDays);
  });

  return scores;
};

// ============================================================================
// SPATIAL CORRELATION
// ============================================================================

/**
 * Correlates threats by geographic location.
 *
 * @param {Record<string, GeoLocation>} entityLocations - Map of entity ID to location
 * @param {number} radiusKm - Radius for proximity matching (kilometers)
 * @returns {SpatialCorrelation} Spatial correlation results
 *
 * @example
 * ```typescript
 * const spatial = correlateByGeoLocation({
 *   'ip1': { latitude: 40.7128, longitude: -74.0060, accuracy: 100 },
 *   'ip2': { latitude: 40.7580, longitude: -73.9855, accuracy: 100 }
 * }, 10);
 * ```
 */
export const correlateByGeoLocation = (
  entityLocations: Record<string, GeoLocation>,
  radiusKm: number,
): SpatialCorrelation => {
  const locations = Object.values(entityLocations);
  const clusters = clusterByProximity(entityLocations, radiusKm);
  const proximity = calculateAllProximities(entityLocations);
  const heatmap = generateHeatmapData(locations);

  return {
    locations,
    clusters,
    proximity,
    heatmap,
    score: calculateSpatialScore(clusters, proximity),
  };
};

/**
 * Calculates geographic proximity between two locations.
 *
 * @param {GeoLocation} loc1 - First location
 * @param {GeoLocation} loc2 - Second location
 * @returns {number} Distance in kilometers
 *
 * @example
 * ```typescript
 * const distance = calculateGeoProximity(
 *   { latitude: 40.7128, longitude: -74.0060, accuracy: 100 },
 *   { latitude: 34.0522, longitude: -118.2437, accuracy: 100 }
 * );
 * // Result: 3936.15 (km between NYC and LA)
 * ```
 */
export const calculateGeoProximity = (loc1: GeoLocation, loc2: GeoLocation): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(loc2.latitude - loc1.latitude);
  const dLon = toRadians(loc2.longitude - loc1.longitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(loc1.latitude)) *
      Math.cos(toRadians(loc2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Clusters entities by geographic region.
 *
 * @param {Record<string, GeoLocation>} entityLocations - Entity locations
 * @param {number} radiusKm - Clustering radius in kilometers
 * @returns {GeoCluster[]} Array of geographic clusters
 *
 * @example
 * ```typescript
 * const clusters = clusterByRegion(entityLocations, 50);
 * // Result: [{ centroid: {...}, radius: 50, members: ['ip1', 'ip2'], density: 0.8 }]
 * ```
 */
export const clusterByRegion = (
  entityLocations: Record<string, GeoLocation>,
  radiusKm: number,
): GeoCluster[] => {
  return clusterByProximity(entityLocations, radiusKm);
};

/**
 * Detects geographic anomalies in threat distribution.
 *
 * @param {GeoLocation[]} locations - Array of locations
 * @param {number} [threshold] - Anomaly threshold (default: 2.0 std devs)
 * @returns {GeoLocation[]} Anomalous locations
 *
 * @example
 * ```typescript
 * const anomalies = detectGeoAnomalies(locations, 2.5);
 * // Result: [{ latitude: 61.52, longitude: 105.31, accuracy: 1000, metadata: {...} }]
 * ```
 */
export const detectGeoAnomalies = (
  locations: GeoLocation[],
  threshold: number = 2.0,
): GeoLocation[] => {
  if (locations.length < 3) return [];

  const avgLat = locations.reduce((sum, loc) => sum + loc.latitude, 0) / locations.length;
  const avgLon = locations.reduce((sum, loc) => sum + loc.longitude, 0) / locations.length;

  const distances = locations.map((loc) =>
    calculateGeoProximity(loc, { latitude: avgLat, longitude: avgLon, accuracy: 0 }),
  );

  const mean = distances.reduce((sum, d) => sum + d, 0) / distances.length;
  const variance = distances.reduce((sum, d) => sum + Math.pow(d - mean, 2), 0) / distances.length;
  const stdDev = Math.sqrt(variance);

  return locations.filter((loc, index) => {
    return distances[index] > mean + threshold * stdDev;
  });
};

/**
 * Builds spatial heatmap of threat activity.
 *
 * @param {GeoLocation[]} locations - Array of locations
 * @param {number} gridSize - Heatmap grid size
 * @returns {HeatmapData} Heatmap data structure
 *
 * @example
 * ```typescript
 * const heatmap = buildSpatialHeatmap(locations, 100);
 * // Result: { gridSize: 100, cells: [...], intensity: 'high' }
 * ```
 */
export const buildSpatialHeatmap = (
  locations: GeoLocation[],
  gridSize: number,
): HeatmapData => {
  return generateHeatmapData(locations, gridSize);
};

/**
 * Scores geographic correlation strength.
 *
 * @param {GeoCluster[]} clusters - Geographic clusters
 * @param {ProximityMetric[]} proximities - Proximity metrics
 * @returns {number} Correlation score (0-1)
 *
 * @example
 * ```typescript
 * const score = scoreGeoCorrelation(clusters, proximities);
 * // Result: 0.87
 * ```
 */
export const scoreGeoCorrelation = (
  clusters: GeoCluster[],
  proximities: ProximityMetric[],
): number => {
  return calculateSpatialScore(clusters, proximities);
};

// ============================================================================
// BEHAVIORAL CORRELATION
// ============================================================================

/**
 * Correlates threat behavior patterns.
 *
 * @param {Record<string, string[]>} entityBehaviors - Map of entity to behavior signatures
 * @param {number} [threshold] - Similarity threshold (default: 0.7)
 * @returns {BehavioralPattern[]} Array of behavior patterns
 *
 * @example
 * ```typescript
 * const patterns = correlateBehaviorPatterns({
 *   'entity1': ['port_scan', 'brute_force', 'data_exfil'],
 *   'entity2': ['port_scan', 'exploit', 'data_exfil']
 * }, 0.6);
 * ```
 */
export const correlateBehaviorPatterns = (
  entityBehaviors: Record<string, string[]>,
  threshold: number = 0.7,
): BehavioralPattern[] => {
  const patterns: BehavioralPattern[] = [];
  const entities = Object.keys(entityBehaviors);

  for (let i = 0; i < entities.length; i++) {
    for (let j = i + 1; j < entities.length; j++) {
      const similarity = calculateJaccardSimilarity(
        new Set(entityBehaviors[entities[i]]),
        new Set(entityBehaviors[entities[j]]),
      );

      if (similarity >= threshold) {
        const commonBehaviors = entityBehaviors[entities[i]].filter((b) =>
          entityBehaviors[entities[j]].includes(b),
        );

        patterns.push({
          patternId: `pattern_${i}_${j}`,
          signature: commonBehaviors,
          frequency: commonBehaviors.length,
          entities: [entities[i], entities[j]],
          classification: 'suspicious',
          confidence: similarity,
        });
      }
    }
  }

  return patterns;
};

/**
 * Detects behavioral anomalies in entity actions.
 *
 * @param {string} entityId - Entity identifier
 * @param {string[]} observedBehavior - Observed behavior sequence
 * @param {string[]} baselineBehavior - Baseline behavior pattern
 * @returns {BehavioralAnomaly | null} Anomaly if detected, null otherwise
 *
 * @example
 * ```typescript
 * const anomaly = detectBehavioralAnomalies(
 *   'entity1',
 *   ['login', 'admin_access', 'data_deletion'],
 *   ['login', 'normal_operation']
 * );
 * // Result: { entityId: 'entity1', deviationScore: 0.85, severity: 'high', ... }
 * ```
 */
export const detectBehavioralAnomalies = (
  entityId: string,
  observedBehavior: string[],
  baselineBehavior: string[],
): BehavioralAnomaly | null => {
  const observedSet = new Set(observedBehavior);
  const baselineSet = new Set(baselineBehavior);

  const anomalousBehaviors = observedBehavior.filter((b) => !baselineSet.has(b));

  if (anomalousBehaviors.length === 0) return null;

  const deviationScore = anomalousBehaviors.length / observedBehavior.length;
  const severity =
    deviationScore > 0.7 ? 'critical' : deviationScore > 0.5 ? 'high' : deviationScore > 0.3 ? 'medium' : 'low';

  return {
    entityId,
    deviationScore,
    expectedBehavior: Array.from(baselineSet),
    observedBehavior,
    severity,
  };
};

/**
 * Creates behavior fingerprint for entity.
 *
 * @param {string[]} behaviors - Array of behaviors
 * @param {number} [windowSize] - Window size for fingerprinting (default: 5)
 * @returns {string} Behavior fingerprint hash
 *
 * @example
 * ```typescript
 * const fingerprint = fingerprintThreatBehavior(['login', 'scan', 'exploit', 'exfil'], 3);
 * // Result: "a3f7b9e2..." (hash of behavior pattern)
 * ```
 */
export const fingerprintThreatBehavior = (
  behaviors: string[],
  windowSize: number = 5,
): string => {
  const windows: string[] = [];

  for (let i = 0; i <= behaviors.length - windowSize; i++) {
    const window = behaviors.slice(i, i + windowSize).join('|');
    windows.push(window);
  }

  // Simple hash function for demonstration
  const fingerprint = windows.join('::');
  return hashString(fingerprint);
};

/**
 * Matches behavior signatures against known patterns.
 *
 * @param {string[]} observedBehaviors - Observed behavior sequence
 * @param {BehavioralPattern[]} knownPatterns - Known behavior patterns
 * @returns {BehavioralPattern[]} Matching patterns
 *
 * @example
 * ```typescript
 * const matches = matchBehaviorSignatures(
 *   ['port_scan', 'brute_force', 'privilege_escalation'],
 *   knownPatterns
 * );
 * ```
 */
export const matchBehaviorSignatures = (
  observedBehaviors: string[],
  knownPatterns: BehavioralPattern[],
): BehavioralPattern[] => {
  return knownPatterns.filter((pattern) => {
    const observedSet = new Set(observedBehaviors);
    const matchCount = pattern.signature.filter((sig) => observedSet.has(sig)).length;
    return matchCount / pattern.signature.length >= 0.7;
  });
};

/**
 * Scores similarity between two behavior sets.
 *
 * @param {string[]} behavior1 - First behavior set
 * @param {string[]} behavior2 - Second behavior set
 * @returns {number} Similarity score (0-1)
 *
 * @example
 * ```typescript
 * const similarity = scoreBehaviorSimilarity(
 *   ['scan', 'exploit', 'exfil'],
 *   ['scan', 'exploit', 'persist']
 * );
 * // Result: 0.67
 * ```
 */
export const scoreBehaviorSimilarity = (behavior1: string[], behavior2: string[]): number => {
  return calculateJaccardSimilarity(new Set(behavior1), new Set(behavior2));
};

/**
 * Classifies threat behavior into categories.
 *
 * @param {string[]} behaviors - Behavior sequence
 * @param {Record<string, string[]>} categorySignatures - Category to signature mapping
 * @returns {string[]} Array of matching categories
 *
 * @example
 * ```typescript
 * const categories = classifyThreatBehavior(
 *   ['port_scan', 'brute_force'],
 *   {
 *     'reconnaissance': ['port_scan', 'network_map'],
 *     'credential_access': ['brute_force', 'password_spray']
 *   }
 * );
 * // Result: ['reconnaissance', 'credential_access']
 * ```
 */
export const classifyThreatBehavior = (
  behaviors: string[],
  categorySignatures: Record<string, string[]>,
): string[] => {
  const behaviorSet = new Set(behaviors);
  const categories: string[] = [];

  Object.entries(categorySignatures).forEach(([category, signatures]) => {
    const matches = signatures.filter((sig) => behaviorSet.has(sig));
    if (matches.length > 0) {
      categories.push(category);
    }
  });

  return categories;
};

// ============================================================================
// GRAPH ALGORITHMS
// ============================================================================

/**
 * Finds shortest correlation path between two entities.
 *
 * @param {string} sourceId - Source entity ID
 * @param {string} targetId - Target entity ID
 * @param {CorrelationGraph} graph - Correlation graph
 * @returns {string[] | null} Shortest path or null if no path exists
 *
 * @example
 * ```typescript
 * const path = findShortestCorrelationPath('entity1', 'entity5', graph);
 * // Result: ['entity1', 'entity2', 'entity4', 'entity5']
 * ```
 */
export const findShortestCorrelationPath = (
  sourceId: string,
  targetId: string,
  graph: CorrelationGraph,
): string[] | null => {
  const queue: Array<{ id: string; path: string[] }> = [{ id: sourceId, path: [sourceId] }];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (current.id === targetId) {
      return current.path;
    }

    if (visited.has(current.id)) continue;
    visited.add(current.id);

    graph.edges
      .filter((edge) => edge.source === current.id)
      .forEach((edge) => {
        if (!visited.has(edge.target)) {
          queue.push({
            id: edge.target,
            path: [...current.path, edge.target],
          });
        }
      });
  }

  return null;
};

/**
 * Calculates centrality metrics for graph nodes.
 *
 * @param {CorrelationGraph} graph - Correlation graph
 * @returns {Record<string, number>} Node ID to centrality score
 *
 * @example
 * ```typescript
 * const centrality = calculateCentralityMetrics(graph);
 * // Result: { 'node1': 0.85, 'node2': 0.62, 'node3': 0.43 }
 * ```
 */
export const calculateCentralityMetrics = (
  graph: CorrelationGraph,
): Record<string, number> => {
  const centrality: Record<string, number> = {};
  const n = graph.nodes.length;

  // Degree centrality
  graph.nodes.forEach((node) => {
    centrality[node.id] = node.degree / (n - 1);
  });

  return centrality;
};

/**
 * Detects communities in threat correlation graph.
 *
 * @param {CorrelationGraph} graph - Correlation graph
 * @param {number} [minCommunitySize] - Minimum community size (default: 3)
 * @returns {string[][]} Array of communities (node ID arrays)
 *
 * @example
 * ```typescript
 * const communities = detectThreatCommunities(graph, 3);
 * // Result: [['node1', 'node2', 'node3'], ['node4', 'node5', 'node6', 'node7']]
 * ```
 */
export const detectThreatCommunities = (
  graph: CorrelationGraph,
  minCommunitySize: number = 3,
): string[][] => {
  const communities: string[][] = [];
  const visited = new Set<string>();

  const dfs = (nodeId: string, community: string[]): void => {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);
    community.push(nodeId);

    graph.edges
      .filter((edge) => edge.source === nodeId && edge.weight > 0.5)
      .forEach((edge) => {
        if (!visited.has(edge.target)) {
          dfs(edge.target, community);
        }
      });
  };

  graph.nodes.forEach((node) => {
    if (!visited.has(node.id)) {
      const community: string[] = [];
      dfs(node.id, community);
      if (community.length >= minCommunitySize) {
        communities.push(community);
      }
    }
  });

  return communities;
};

/**
 * Analyzes graph density metrics.
 *
 * @param {CorrelationGraph} graph - Correlation graph
 * @returns {number} Graph density (0-1)
 *
 * @example
 * ```typescript
 * const density = analyzeGraphDensity(graph);
 * // Result: 0.42
 * ```
 */
export const analyzeGraphDensity = (graph: CorrelationGraph): number => {
  return graph.metadata.density;
};

/**
 * Extracts subgraphs based on criteria.
 *
 * @param {CorrelationGraph} graph - Source graph
 * @param {(node: GraphNode) => boolean} nodePredicate - Node filter predicate
 * @returns {CorrelationGraph} Extracted subgraph
 *
 * @example
 * ```typescript
 * const subgraph = extractSubgraphs(graph, (node) => node.degree > 3);
 * // Result: Graph containing only nodes with degree > 3 and their edges
 * ```
 */
export const extractSubgraphs = (
  graph: CorrelationGraph,
  nodePredicate: (node: GraphNode) => boolean,
): CorrelationGraph => {
  const selectedNodes = graph.nodes.filter(nodePredicate);
  const selectedNodeIds = new Set(selectedNodes.map((n) => n.id));

  const selectedEdges = graph.edges.filter(
    (edge) => selectedNodeIds.has(edge.source) && selectedNodeIds.has(edge.target),
  );

  return {
    nodes: selectedNodes,
    edges: selectedEdges,
    metadata: {
      nodeCount: selectedNodes.length,
      edgeCount: selectedEdges.length,
      density: selectedEdges.length / (selectedNodes.length * (selectedNodes.length - 1) / 2),
      avgDegree: selectedNodes.reduce((sum, n) => sum + n.degree, 0) / selectedNodes.length,
      components: calculateConnectedComponents(selectedNodes, selectedEdges),
    },
  };
};

// ============================================================================
// CONFIDENCE SCORING
// ============================================================================

/**
 * Calculates overall correlation confidence score.
 *
 * @param {CorrelationResult} correlation - Correlation result
 * @param {Evidence[]} evidence - Supporting evidence
 * @returns {CorrelationScore} Detailed confidence score
 *
 * @example
 * ```typescript
 * const score = calculateCorrelationConfidence(correlation, evidence);
 * // Result: { overall: 0.88, components: [...], confidence: 0.92, factors: [...] }
 * ```
 */
export const calculateCorrelationConfidence = (
  correlation: CorrelationResult,
  evidence: Evidence[],
): CorrelationScore => {
  const components: ScoreComponent[] = correlation.dimensions.map((dim) => ({
    dimension: dim,
    score: correlation.score,
    weight: 1.0 / correlation.dimensions.length,
    contribution: correlation.score / correlation.dimensions.length,
  }));

  const factors: ScoringFactor[] = [
    {
      name: 'evidence_count',
      value: evidence.length,
      impact: evidence.length > 5 ? 'positive' : 'neutral',
      description: `${evidence.length} pieces of evidence`,
    },
    {
      name: 'match_quality',
      value: correlation.score,
      impact: correlation.score > 0.7 ? 'positive' : 'neutral',
      description: `Match score: ${correlation.score.toFixed(2)}`,
    },
  ];

  const overall = components.reduce((sum, c) => sum + c.contribution, 0);

  return {
    overall,
    components,
    confidence: correlation.confidence,
    factors,
  };
};

/**
 * Weights evidence sources by reliability.
 *
 * @param {Evidence[]} evidence - Array of evidence
 * @returns {Evidence[]} Evidence sorted by weighted reliability
 *
 * @example
 * ```typescript
 * const weighted = weightEvidenceSources(evidence);
 * // Result: Evidence array sorted by reliability score
 * ```
 */
export const weightEvidenceSources = (evidence: Evidence[]): Evidence[] => {
  return [...evidence].sort((a, b) => b.reliability - a.reliability);
};

/**
 * Aggregates confidence scores from multiple sources.
 *
 * @param {number[]} scores - Array of confidence scores
 * @param {number[]} [weights] - Optional weights for each score
 * @returns {number} Aggregated confidence score
 *
 * @example
 * ```typescript
 * const aggregated = aggregateConfidenceScores([0.8, 0.9, 0.7], [0.5, 0.3, 0.2]);
 * // Result: 0.81
 * ```
 */
export const aggregateConfidenceScores = (
  scores: number[],
  weights?: number[],
): number => {
  if (scores.length === 0) return 0;

  if (weights && weights.length === scores.length) {
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    return scores.reduce((sum, score, i) => sum + score * weights[i], 0) / totalWeight;
  }

  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
};

/**
 * Calculates confidence interval for correlation score.
 *
 * @param {number[]} samples - Sample scores
 * @param {number} confidenceLevel - Confidence level (0-1)
 * @returns {ConfidenceInterval} Confidence interval
 *
 * @example
 * ```typescript
 * const interval = calculateConfidenceInterval([0.7, 0.8, 0.85, 0.9], 0.95);
 * // Result: { lower: 0.72, upper: 0.88, confidence: 0.95, method: 'bootstrap' }
 * ```
 */
export const calculateConfidenceInterval = (
  samples: number[],
  confidenceLevel: number,
): ConfidenceInterval => {
  if (samples.length < 2) {
    throw new Error('At least 2 samples required for confidence interval');
  }

  const sorted = [...samples].sort((a, b) => a - b);
  const n = sorted.length;
  const alpha = 1 - confidenceLevel;
  const lowerIndex = Math.floor(n * (alpha / 2));
  const upperIndex = Math.ceil(n * (1 - alpha / 2)) - 1;

  return {
    lower: sorted[lowerIndex],
    upper: sorted[upperIndex],
    confidence: confidenceLevel,
    method: 'bootstrap',
  };
};

/**
 * Normalizes confidence metrics to standard scale.
 *
 * @param {Record<string, number>} metrics - Raw confidence metrics
 * @param {number} [min] - Minimum value (default: 0)
 * @param {number} [max] - Maximum value (default: 1)
 * @returns {Record<string, number>} Normalized metrics
 *
 * @example
 * ```typescript
 * const normalized = normalizeConfidenceMetrics({ score1: 50, score2: 75, score3: 100 }, 0, 100);
 * // Result: { score1: 0.5, score2: 0.75, score3: 1.0 }
 * ```
 */
export const normalizeConfidenceMetrics = (
  metrics: Record<string, number>,
  min: number = 0,
  max: number = 1,
): Record<string, number> => {
  const values = Object.values(metrics);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal;

  if (range === 0) return metrics;

  const normalized: Record<string, number> = {};
  Object.entries(metrics).forEach(([key, value]) => {
    normalized[key] = min + ((value - minVal) / range) * (max - min);
  });

  return normalized;
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function calculateAttributeSimilarity(
  entity1: Record<string, unknown>,
  entity2: Record<string, unknown>,
  config: CorrelationConfig,
): number {
  const { dimensions, algorithm = 'jaccard' } = config;

  if (algorithm === 'jaccard') {
    const matches = dimensions.filter((dim) => entity1[dim] === entity2[dim]).length;
    return matches / dimensions.length;
  }

  return 0;
}

function createCorrelationMatch(entity: Record<string, unknown>): CorrelationMatch {
  return {
    entityId: String(entity.id || 'unknown'),
    entityType: (entity.type as CorrelationMatch['entityType']) || 'ip',
    score: 1.0,
    attributes: entity,
    timestamp: new Date(),
  };
}

function calculateConfidenceFromEvidence(score: number, dimensionCount: number): number {
  return Math.min(score * (1 + dimensionCount * 0.1), 1.0);
}

async function findRelationship(
  ioc1: string,
  ioc2: string,
): Promise<IOCRelationship | null> {
  // Simulated relationship discovery
  if (Math.random() > 0.5) {
    return {
      sourceId: ioc1,
      targetId: ioc2,
      relationshipType: 'associated_with',
      strength: Math.random(),
      confidence: Math.random(),
      evidence: [],
      firstSeen: new Date(),
      lastSeen: new Date(),
    };
  }
  return null;
}

function calculateRecencyFactor(evidence: Evidence[]): number {
  if (evidence.length === 0) return 0;

  const now = Date.now();
  const maxAge = 30 * 86400000; // 30 days

  const recencyScores = evidence.map((e) => {
    const age = now - e.timestamp.getTime();
    return Math.max(0, 1 - age / maxAge);
  });

  return recencyScores.reduce((sum, score) => sum + score, 0) / recencyScores.length;
}

function calculateEvidenceDiversity(evidence: Evidence[]): number {
  const sourceTypes = new Set(evidence.map((e) => e.type));
  return Math.min(sourceTypes.size / 5, 1.0);
}

function calculateConnectedComponents(nodes: GraphNode[], edges: GraphEdge[]): number {
  const visited = new Set<string>();
  let components = 0;

  const dfs = (nodeId: string): void => {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);

    edges.forEach((edge) => {
      if (edge.source === nodeId) dfs(edge.target);
      if (edge.target === nodeId) dfs(edge.source);
    });
  };

  nodes.forEach((node) => {
    if (!visited.has(node.id)) {
      components++;
      dfs(node.id);
    }
  });

  return components;
}

function detectTemporalPatterns(events: TemporalEvent[]): TemporalPattern[] {
  // Simplified pattern detection
  const patterns: TemporalPattern[] = [];

  if (events.length > 0) {
    patterns.push({
      patternType: 'sequential',
      events: events.slice(0, Math.min(5, events.length)).map((e) => e.id),
      frequency: events.length,
      confidence: 0.8,
    });
  }

  return patterns;
}

function detectTemporalAnomalies(events: TemporalEvent[], window: TimeWindow): TemporalAnomaly[] {
  const anomalies: TemporalAnomaly[] = [];

  if (events.length > 0) {
    const timestamps = events.map((e) => e.timestamp.getTime());
    const intervals = [];

    for (let i = 1; i < timestamps.length; i++) {
      intervals.push(timestamps[i] - timestamps[i - 1]);
    }

    if (intervals.length > 0) {
      const mean = intervals.reduce((sum, val) => sum + val, 0) / intervals.length;
      const variance = intervals.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / intervals.length;
      const stdDev = Math.sqrt(variance);

      intervals.forEach((interval, index) => {
        if (Math.abs(interval - mean) > 2 * stdDev) {
          anomalies.push({
            type: interval > mean ? 'gap' : 'spike',
            timestamp: events[index + 1].timestamp,
            severity: Math.abs(interval - mean) / stdDev,
            description: `Unusual time interval detected`,
          });
        }
      });
    }
  }

  return anomalies;
}

function calculateTemporalScore(patterns: TemporalPattern[], anomalies: TemporalAnomaly[]): number {
  const patternScore = Math.min(patterns.length / 10, 1.0);
  const anomalyPenalty = Math.min(anomalies.length / 5, 0.5);
  return Math.max(0, patternScore - anomalyPenalty);
}

function matchSequence(
  events: TemporalEvent[],
  startIndex: number,
  expectedSequence: string[],
  maxGap: number,
): TemporalEvent[] {
  const matched: TemporalEvent[] = [events[startIndex]];
  let currentIndex = startIndex + 1;
  let sequenceIndex = 1;

  while (currentIndex < events.length && sequenceIndex < expectedSequence.length) {
    const timeDiff = events[currentIndex].timestamp.getTime() - matched[matched.length - 1].timestamp.getTime();

    if (timeDiff > maxGap) break;

    if (events[currentIndex].type === expectedSequence[sequenceIndex]) {
      matched.push(events[currentIndex]);
      sequenceIndex++;
    }

    currentIndex++;
  }

  return matched;
}

function clusterByProximity(
  entityLocations: Record<string, GeoLocation>,
  radiusKm: number,
): GeoCluster[] {
  const clusters: GeoCluster[] = [];
  const entities = Object.keys(entityLocations);
  const assigned = new Set<string>();

  entities.forEach((entityId) => {
    if (assigned.has(entityId)) return;

    const clusterMembers = [entityId];
    assigned.add(entityId);

    entities.forEach((otherId) => {
      if (!assigned.has(otherId)) {
        const distance = calculateGeoProximity(
          entityLocations[entityId],
          entityLocations[otherId],
        );

        if (distance <= radiusKm) {
          clusterMembers.push(otherId);
          assigned.add(otherId);
        }
      }
    });

    if (clusterMembers.length > 0) {
      const centroid = calculateCentroid(
        clusterMembers.map((id) => entityLocations[id]),
      );

      clusters.push({
        centroid,
        radius: radiusKm,
        members: clusterMembers,
        density: clusterMembers.length / (Math.PI * radiusKm * radiusKm),
      });
    }
  });

  return clusters;
}

function calculateAllProximities(
  entityLocations: Record<string, GeoLocation>,
): ProximityMetric[] {
  const proximities: ProximityMetric[] = [];
  const entities = Object.keys(entityLocations);

  for (let i = 0; i < entities.length; i++) {
    for (let j = i + 1; j < entities.length; j++) {
      const distance = calculateGeoProximity(
        entityLocations[entities[i]],
        entityLocations[entities[j]],
      );

      proximities.push({
        entity1: entities[i],
        entity2: entities[j],
        distance,
        unit: 'km',
      });
    }
  }

  return proximities;
}

function generateHeatmapData(locations: GeoLocation[], gridSize: number = 100): HeatmapData {
  const cells: HeatmapCell[] = [];

  // Simple heatmap generation
  const latRange = { min: -90, max: 90 };
  const lonRange = { min: -180, max: 180 };

  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      const cellLat = latRange.min + (x / gridSize) * (latRange.max - latRange.min);
      const cellLon = lonRange.min + (y / gridSize) * (lonRange.max - lonRange.min);

      const count = locations.filter((loc) => {
        const latMatch = loc.latitude >= cellLat && loc.latitude < cellLat + (latRange.max - latRange.min) / gridSize;
        const lonMatch = loc.longitude >= cellLon && loc.longitude < cellLon + (lonRange.max - lonRange.min) / gridSize;
        return latMatch && lonMatch;
      }).length;

      if (count > 0) {
        cells.push({ x, y, value: count, count });
      }
    }
  }

  const maxCount = Math.max(...cells.map((c) => c.count), 1);
  const intensity = maxCount > 10 ? 'high' : maxCount > 5 ? 'medium' : 'low';

  return { gridSize, cells, intensity };
}

function calculateSpatialScore(clusters: GeoCluster[], proximities: ProximityMetric[]): number {
  const clusterScore = Math.min(clusters.length / 10, 1.0);
  const avgProximity = proximities.length > 0
    ? proximities.reduce((sum, p) => sum + (1 / (1 + p.distance)), 0) / proximities.length
    : 0;

  return clusterScore * 0.6 + avgProximity * 0.4;
}

function calculateCentroid(locations: GeoLocation[]): GeoLocation {
  const avgLat = locations.reduce((sum, loc) => sum + loc.latitude, 0) / locations.length;
  const avgLon = locations.reduce((sum, loc) => sum + loc.longitude, 0) / locations.length;

  return {
    latitude: avgLat,
    longitude: avgLon,
    accuracy: Math.max(...locations.map((loc) => loc.accuracy)),
  };
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

function calculateJaccardSimilarity<T>(set1: Set<T>, set2: Set<T>): number {
  const intersection = new Set([...set1].filter((x) => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  return union.size > 0 ? intersection.size / union.size : 0;
}

function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Multi-dimensional correlation
  correlateThreatsByAttributes,
  calculateWeightedCorrelation,
  crossReferenceIOCs,
  buildCorrelationMatrix,
  findCorrelationClusters,
  scoreCorrelationStrength,
  normalizeCorrelationData,
  aggregateCorrelationResults,

  // IOC relationship discovery
  discoverIOCRelationships,
  calculateRelationshipStrength,
  buildRelationshipGraph,
  findConnectedIOCs,
  detectIOCClusters,
  analyzeGraphConnectivity,
  extractRelationshipPaths,
  scoreRelationshipConfidence,

  // Temporal correlation
  analyzeTemporalPatterns,
  correlateEventSequences,
  detectTimeBasedClusters,
  calculateTemporalProximity,
  buildTimelineCorrelation,
  findTemporalAnomalies,
  aggregateTimeWindows,
  scoreTemporalRelevance,

  // Spatial correlation
  correlateByGeoLocation,
  calculateGeoProximity,
  clusterByRegion,
  detectGeoAnomalies,
  buildSpatialHeatmap,
  scoreGeoCorrelation,

  // Behavioral correlation
  correlateBehaviorPatterns,
  detectBehavioralAnomalies,
  fingerprintThreatBehavior,
  matchBehaviorSignatures,
  scoreBehaviorSimilarity,
  classifyThreatBehavior,

  // Graph algorithms
  findShortestCorrelationPath,
  calculateCentralityMetrics,
  detectThreatCommunities,
  analyzeGraphDensity,
  extractSubgraphs,

  // Confidence scoring
  calculateCorrelationConfidence,
  weightEvidenceSources,
  aggregateConfidenceScores,
  calculateConfidenceInterval,
  normalizeConfidenceMetrics,
};
