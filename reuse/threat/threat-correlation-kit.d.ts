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
export declare const correlateThreatsByAttributes: (threats: Record<string, unknown>[], config: CorrelationConfig) => CorrelationResult[];
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
export declare const calculateWeightedCorrelation: (entity1: Record<string, unknown>, entity2: Record<string, unknown>, weights: Record<string, number>) => number;
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
export declare const crossReferenceIOCs: (iocs: string[], sources: string[]) => Promise<Record<string, string[]>>;
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
export declare const buildCorrelationMatrix: (entities: Record<string, unknown>[], dimensions: string[]) => number[][];
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
export declare const findCorrelationClusters: (correlations: CorrelationResult[], threshold: number) => string[][];
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
export declare const scoreCorrelationStrength: (matches: CorrelationMatch[], dimensions: string[]) => number;
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
export declare const normalizeCorrelationData: (results: CorrelationResult[], min?: number, max?: number) => CorrelationResult[];
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
export declare const aggregateCorrelationResults: (results: CorrelationResult[]) => Record<string, CorrelationResult[]>;
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
export declare const discoverIOCRelationships: (iocs: string[], depth?: number) => Promise<IOCRelationship[]>;
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
export declare const calculateRelationshipStrength: (ioc1: string, ioc2: string, evidence: Evidence[]) => number;
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
export declare const buildRelationshipGraph: (relationships: IOCRelationship[]) => CorrelationGraph;
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
export declare const findConnectedIOCs: (iocId: string, relationships: IOCRelationship[], maxDistance?: number) => string[];
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
export declare const detectIOCClusters: (relationships: IOCRelationship[], minClusterSize: number) => string[][];
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
export declare const analyzeGraphConnectivity: (graph: CorrelationGraph) => Record<string, number>;
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
export declare const extractRelationshipPaths: (sourceId: string, targetId: string, graph: CorrelationGraph, maxPaths?: number) => string[][];
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
export declare const scoreRelationshipConfidence: (relationship: IOCRelationship) => number;
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
export declare const analyzeTemporalPatterns: (events: TemporalEvent[], window: TimeWindow) => TemporalCorrelation;
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
export declare const correlateEventSequences: (events: TemporalEvent[], expectedSequence: string[], maxGap?: number) => TemporalEvent[][];
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
export declare const detectTimeBasedClusters: (events: TemporalEvent[], timeThreshold: number) => TemporalEvent[][];
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
export declare const calculateTemporalProximity: (event1: TemporalEvent, event2: TemporalEvent) => number;
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
export declare const buildTimelineCorrelation: (entityEvents: Record<string, TemporalEvent[]>, window: TimeWindow) => Record<string, TemporalCorrelation>;
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
export declare const findTemporalAnomalies: (events: TemporalEvent[], threshold?: number) => TemporalAnomaly[];
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
export declare const aggregateTimeWindows: (events: TemporalEvent[], windowSize: number) => Record<number, TemporalEvent[]>;
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
export declare const scoreTemporalRelevance: (events: TemporalEvent[], referenceTime: Date, decayFactor?: number) => Record<string, number>;
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
export declare const correlateByGeoLocation: (entityLocations: Record<string, GeoLocation>, radiusKm: number) => SpatialCorrelation;
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
export declare const calculateGeoProximity: (loc1: GeoLocation, loc2: GeoLocation) => number;
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
export declare const clusterByRegion: (entityLocations: Record<string, GeoLocation>, radiusKm: number) => GeoCluster[];
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
export declare const detectGeoAnomalies: (locations: GeoLocation[], threshold?: number) => GeoLocation[];
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
export declare const buildSpatialHeatmap: (locations: GeoLocation[], gridSize: number) => HeatmapData;
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
export declare const scoreGeoCorrelation: (clusters: GeoCluster[], proximities: ProximityMetric[]) => number;
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
export declare const correlateBehaviorPatterns: (entityBehaviors: Record<string, string[]>, threshold?: number) => BehavioralPattern[];
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
export declare const detectBehavioralAnomalies: (entityId: string, observedBehavior: string[], baselineBehavior: string[]) => BehavioralAnomaly | null;
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
export declare const fingerprintThreatBehavior: (behaviors: string[], windowSize?: number) => string;
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
export declare const matchBehaviorSignatures: (observedBehaviors: string[], knownPatterns: BehavioralPattern[]) => BehavioralPattern[];
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
export declare const scoreBehaviorSimilarity: (behavior1: string[], behavior2: string[]) => number;
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
export declare const classifyThreatBehavior: (behaviors: string[], categorySignatures: Record<string, string[]>) => string[];
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
export declare const findShortestCorrelationPath: (sourceId: string, targetId: string, graph: CorrelationGraph) => string[] | null;
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
export declare const calculateCentralityMetrics: (graph: CorrelationGraph) => Record<string, number>;
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
export declare const detectThreatCommunities: (graph: CorrelationGraph, minCommunitySize?: number) => string[][];
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
export declare const analyzeGraphDensity: (graph: CorrelationGraph) => number;
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
export declare const extractSubgraphs: (graph: CorrelationGraph, nodePredicate: (node: GraphNode) => boolean) => CorrelationGraph;
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
export declare const calculateCorrelationConfidence: (correlation: CorrelationResult, evidence: Evidence[]) => CorrelationScore;
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
export declare const weightEvidenceSources: (evidence: Evidence[]) => Evidence[];
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
export declare const aggregateConfidenceScores: (scores: number[], weights?: number[]) => number;
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
export declare const calculateConfidenceInterval: (samples: number[], confidenceLevel: number) => ConfidenceInterval;
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
export declare const normalizeConfidenceMetrics: (metrics: Record<string, number>, min?: number, max?: number) => Record<string, number>;
declare const _default: {
    correlateThreatsByAttributes: (threats: Record<string, unknown>[], config: CorrelationConfig) => CorrelationResult[];
    calculateWeightedCorrelation: (entity1: Record<string, unknown>, entity2: Record<string, unknown>, weights: Record<string, number>) => number;
    crossReferenceIOCs: (iocs: string[], sources: string[]) => Promise<Record<string, string[]>>;
    buildCorrelationMatrix: (entities: Record<string, unknown>[], dimensions: string[]) => number[][];
    findCorrelationClusters: (correlations: CorrelationResult[], threshold: number) => string[][];
    scoreCorrelationStrength: (matches: CorrelationMatch[], dimensions: string[]) => number;
    normalizeCorrelationData: (results: CorrelationResult[], min?: number, max?: number) => CorrelationResult[];
    aggregateCorrelationResults: (results: CorrelationResult[]) => Record<string, CorrelationResult[]>;
    discoverIOCRelationships: (iocs: string[], depth?: number) => Promise<IOCRelationship[]>;
    calculateRelationshipStrength: (ioc1: string, ioc2: string, evidence: Evidence[]) => number;
    buildRelationshipGraph: (relationships: IOCRelationship[]) => CorrelationGraph;
    findConnectedIOCs: (iocId: string, relationships: IOCRelationship[], maxDistance?: number) => string[];
    detectIOCClusters: (relationships: IOCRelationship[], minClusterSize: number) => string[][];
    analyzeGraphConnectivity: (graph: CorrelationGraph) => Record<string, number>;
    extractRelationshipPaths: (sourceId: string, targetId: string, graph: CorrelationGraph, maxPaths?: number) => string[][];
    scoreRelationshipConfidence: (relationship: IOCRelationship) => number;
    analyzeTemporalPatterns: (events: TemporalEvent[], window: TimeWindow) => TemporalCorrelation;
    correlateEventSequences: (events: TemporalEvent[], expectedSequence: string[], maxGap?: number) => TemporalEvent[][];
    detectTimeBasedClusters: (events: TemporalEvent[], timeThreshold: number) => TemporalEvent[][];
    calculateTemporalProximity: (event1: TemporalEvent, event2: TemporalEvent) => number;
    buildTimelineCorrelation: (entityEvents: Record<string, TemporalEvent[]>, window: TimeWindow) => Record<string, TemporalCorrelation>;
    findTemporalAnomalies: (events: TemporalEvent[], threshold?: number) => TemporalAnomaly[];
    aggregateTimeWindows: (events: TemporalEvent[], windowSize: number) => Record<number, TemporalEvent[]>;
    scoreTemporalRelevance: (events: TemporalEvent[], referenceTime: Date, decayFactor?: number) => Record<string, number>;
    correlateByGeoLocation: (entityLocations: Record<string, GeoLocation>, radiusKm: number) => SpatialCorrelation;
    calculateGeoProximity: (loc1: GeoLocation, loc2: GeoLocation) => number;
    clusterByRegion: (entityLocations: Record<string, GeoLocation>, radiusKm: number) => GeoCluster[];
    detectGeoAnomalies: (locations: GeoLocation[], threshold?: number) => GeoLocation[];
    buildSpatialHeatmap: (locations: GeoLocation[], gridSize: number) => HeatmapData;
    scoreGeoCorrelation: (clusters: GeoCluster[], proximities: ProximityMetric[]) => number;
    correlateBehaviorPatterns: (entityBehaviors: Record<string, string[]>, threshold?: number) => BehavioralPattern[];
    detectBehavioralAnomalies: (entityId: string, observedBehavior: string[], baselineBehavior: string[]) => BehavioralAnomaly | null;
    fingerprintThreatBehavior: (behaviors: string[], windowSize?: number) => string;
    matchBehaviorSignatures: (observedBehaviors: string[], knownPatterns: BehavioralPattern[]) => BehavioralPattern[];
    scoreBehaviorSimilarity: (behavior1: string[], behavior2: string[]) => number;
    classifyThreatBehavior: (behaviors: string[], categorySignatures: Record<string, string[]>) => string[];
    findShortestCorrelationPath: (sourceId: string, targetId: string, graph: CorrelationGraph) => string[] | null;
    calculateCentralityMetrics: (graph: CorrelationGraph) => Record<string, number>;
    detectThreatCommunities: (graph: CorrelationGraph, minCommunitySize?: number) => string[][];
    analyzeGraphDensity: (graph: CorrelationGraph) => number;
    extractSubgraphs: (graph: CorrelationGraph, nodePredicate: (node: GraphNode) => boolean) => CorrelationGraph;
    calculateCorrelationConfidence: (correlation: CorrelationResult, evidence: Evidence[]) => CorrelationScore;
    weightEvidenceSources: (evidence: Evidence[]) => Evidence[];
    aggregateConfidenceScores: (scores: number[], weights?: number[]) => number;
    calculateConfidenceInterval: (samples: number[], confidenceLevel: number) => ConfidenceInterval;
    normalizeConfidenceMetrics: (metrics: Record<string, number>, min?: number, max?: number) => Record<string, number>;
};
export default _default;
//# sourceMappingURL=threat-correlation-kit.d.ts.map