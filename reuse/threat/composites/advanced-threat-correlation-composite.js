"use strict";
/**
 * LOC: ADVCORR001
 * File: /reuse/threat/composites/advanced-threat-correlation-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../threat-correlation-kit
 *   - ../threat-graph-analysis-kit
 *   - ../threat-attribution-analysis-kit
 *   - @nestjs/common
 *   - @nestjs/swagger
 *
 * DOWNSTREAM (imported by):
 *   - Advanced correlation API controllers
 *   - Graph analysis service endpoints
 *   - Attribution analysis services
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiAnalyzeGraphDensity = exports.apiDetectCommunities = exports.apiCalculateCentrality = exports.apiFindShortestPath = exports.apiFindAllPaths = exports.apiGetNeighbors = exports.apiDepthFirstSearch = exports.apiBreadthFirstSearch = exports.apiFilterGraph = exports.apiMergeGraphs = exports.apiBuildGraphFromIndicators = exports.apiAddEdge = exports.apiAddNode = exports.apiCreateThreatGraph = exports.apiClassifyThreatBehavior = exports.apiScoreBehaviorSimilarity = exports.apiMatchBehaviorSignatures = exports.apiFingerprintThreatBehavior = exports.apiDetectBehavioralAnomalies = exports.apiCorrelateBehaviorPatterns = exports.apiScoreGeoCorrelation = exports.apiBuildSpatialHeatmap = exports.apiDetectGeoAnomalies = exports.apiClusterByRegion = exports.apiCalculateGeoProximity = exports.apiCorrelateByGeoLocation = exports.apiScoreTemporalRelevance = exports.apiAggregateTimeWindows = exports.apiFindTemporalAnomalies = exports.apiBuildTimelineCorrelation = exports.apiCalculateTemporalProximity = exports.apiDetectTimeBasedClusters = exports.apiCorrelateEventSequences = exports.apiAnalyzeTemporalPatterns = exports.apiScoreRelationshipConfidence = exports.apiExtractRelationshipPaths = exports.apiAnalyzeGraphConnectivity = exports.apiDetectIOCClusters = exports.apiFindConnectedIOCs = exports.apiBuildRelationshipGraph = exports.apiCalculateRelationshipStrength = exports.apiDiscoverIOCRelationships = exports.apiAggregateCorrelationResults = exports.apiNormalizeCorrelationData = exports.apiScoreCorrelationStrength = exports.apiFindCorrelationClusters = exports.apiBuildCorrelationMatrix = exports.apiCrossReferenceIOCs = exports.apiCalculateWeightedCorrelation = exports.apiCorrelateThreatsByAttributes = void 0;
exports.apiCalculateMultiFactorAttribution = exports.apiCreateAttributionAnalysis = exports.apiNormalizeConfidenceMetrics = exports.apiCalculateConfidenceInterval = exports.apiAggregateConfidenceScores = exports.apiWeightEvidenceSources = exports.apiCalculateCorrelationConfidence = exports.apiExtractSubgraphs = void 0;
/**
 * File: /reuse/threat/composites/advanced-threat-correlation-composite.ts
 * Locator: WC-COMPOSITE-ADV-CORR-001
 * Purpose: Advanced Threat Correlation & Graph Analysis API Composite - Production-ready correlation and attribution APIs
 *
 * Upstream: threat-correlation-kit, threat-graph-analysis-kit, threat-attribution-analysis-kit
 * Downstream: ../backend/*, Correlation services, Graph analysis endpoints, Attribution APIs
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger
 * Exports: 45 composed API functions for correlation, graph analysis, relationship mapping, attribution
 *
 * LLM Context: Production-ready advanced threat correlation API composite for White Cross healthcare platform.
 * Provides comprehensive multi-dimensional correlation APIs, graph-based threat analysis, IOC relationship discovery,
 * temporal/spatial correlation, behavioral pattern matching, attribution analysis, and confidence scoring.
 * Complete with OpenAPI/Swagger documentation for enterprise threat intelligence platforms.
 */
const threat_correlation_kit_1 = require("../threat-correlation-kit");
const threat_graph_analysis_kit_1 = require("../threat-graph-analysis-kit");
const threat_attribution_analysis_kit_1 = require("../threat-attribution-analysis-kit");
// ============================================================================
// OPENAPI/SWAGGER SCHEMAS
// ============================================================================
/**
 * @swagger
 * components:
 *   schemas:
 *     CorrelationRequest:
 *       type: object
 *       required:
 *         - threats
 *         - dimensions
 *       properties:
 *         threats:
 *           type: array
 *           items:
 *             type: object
 *           description: Array of threat entities to correlate
 *           example:
 *             - id: "ip1"
 *               type: "ip"
 *               country: "US"
 *               asn: 12345
 *               port: 443
 *             - id: "ip2"
 *               type: "ip"
 *               country: "US"
 *               asn: 12345
 *               port: 80
 *         dimensions:
 *           type: array
 *           items:
 *             type: string
 *           description: Attributes to correlate on
 *           example: ["country", "asn", "port"]
 *         algorithm:
 *           type: string
 *           enum: [pearson, cosine, jaccard, euclidean]
 *           default: jaccard
 *         threshold:
 *           type: number
 *           minimum: 0
 *           maximum: 1
 *           default: 0.5
 *           description: Minimum correlation threshold
 *         normalize:
 *           type: boolean
 *           default: false
 *
 *     CorrelationResult:
 *       type: object
 *       properties:
 *         score:
 *           type: number
 *           minimum: 0
 *           maximum: 1
 *           example: 0.85
 *         confidence:
 *           type: number
 *           minimum: 0
 *           maximum: 1
 *           example: 0.9
 *         matches:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CorrelationMatch'
 *         metadata:
 *           type: object
 *           example: { "algorithm": "jaccard", "dimensions": ["country", "asn"] }
 *         dimensions:
 *           type: array
 *           items:
 *             type: string
 *
 *     CorrelationMatch:
 *       type: object
 *       properties:
 *         entityId:
 *           type: string
 *           example: "ip1"
 *         entityType:
 *           type: string
 *           enum: [ip, domain, hash, url, email]
 *         score:
 *           type: number
 *           example: 0.92
 *         attributes:
 *           type: object
 *         timestamp:
 *           type: string
 *           format: date-time
 *
 *     IOCRelationship:
 *       type: object
 *       properties:
 *         sourceId:
 *           type: string
 *           example: "192.168.1.1"
 *         targetId:
 *           type: string
 *           example: "malware.com"
 *         relationshipType:
 *           type: string
 *           enum: [communicates_with, resolves_to, contains, derived_from, associated_with]
 *         strength:
 *           type: number
 *           minimum: 0
 *           maximum: 1
 *         confidence:
 *           type: number
 *           minimum: 0
 *           maximum: 1
 *         evidence:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Evidence'
 *         firstSeen:
 *           type: string
 *           format: date-time
 *         lastSeen:
 *           type: string
 *           format: date-time
 *
 *     Evidence:
 *       type: object
 *       properties:
 *         source:
 *           type: string
 *           example: "virustotal"
 *         type:
 *           type: string
 *           example: "dns_resolution"
 *         data:
 *           type: object
 *         timestamp:
 *           type: string
 *           format: date-time
 *         reliability:
 *           type: number
 *           minimum: 0
 *           maximum: 1
 *
 *     ThreatGraph:
 *       type: object
 *       properties:
 *         nodes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/GraphNode'
 *         edges:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/GraphEdge'
 *         metadata:
 *           $ref: '#/components/schemas/GraphMetadata'
 *
 *     GraphNode:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         type:
 *           type: string
 *           enum: [threat, actor, infrastructure, malware, campaign, victim, indicator]
 *         properties:
 *           type: object
 *         labels:
 *           type: array
 *           items:
 *             type: string
 *
 *     GraphEdge:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         source:
 *           type: string
 *         target:
 *           type: string
 *         type:
 *           type: string
 *         weight:
 *           type: number
 *         properties:
 *           type: object
 *         timestamp:
 *           type: string
 *           format: date-time
 *
 *     GraphMetadata:
 *       type: object
 *       properties:
 *         nodeCount:
 *           type: integer
 *         edgeCount:
 *           type: integer
 *         density:
 *           type: number
 *         avgDegree:
 *           type: number
 *         components:
 *           type: integer
 *
 *     TemporalCorrelation:
 *       type: object
 *       properties:
 *         timeWindow:
 *           $ref: '#/components/schemas/TimeWindow'
 *         events:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TemporalEvent'
 *         patterns:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TemporalPattern'
 *         anomalies:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TemporalAnomaly'
 *         score:
 *           type: number
 *
 *     TimeWindow:
 *       type: object
 *       properties:
 *         start:
 *           type: string
 *           format: date-time
 *         end:
 *           type: string
 *           format: date-time
 *         duration:
 *           type: number
 *         unit:
 *           type: string
 *           enum: [seconds, minutes, hours, days]
 *
 *     TemporalEvent:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         timestamp:
 *           type: string
 *           format: date-time
 *         type:
 *           type: string
 *         data:
 *           type: object
 *         sequence:
 *           type: integer
 *
 *     TemporalPattern:
 *       type: object
 *       properties:
 *         patternType:
 *           type: string
 *           enum: [sequential, concurrent, periodic, burst]
 *         events:
 *           type: array
 *           items:
 *             type: string
 *         frequency:
 *           type: number
 *         confidence:
 *           type: number
 *
 *     TemporalAnomaly:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           enum: [outlier, gap, spike, drift]
 *         timestamp:
 *           type: string
 *           format: date-time
 *         severity:
 *           type: number
 *         description:
 *           type: string
 *
 *     SpatialCorrelation:
 *       type: object
 *       properties:
 *         locations:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/GeoLocation'
 *         clusters:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/GeoCluster'
 *         proximity:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProximityMetric'
 *         heatmap:
 *           $ref: '#/components/schemas/HeatmapData'
 *         score:
 *           type: number
 *
 *     GeoLocation:
 *       type: object
 *       properties:
 *         latitude:
 *           type: number
 *           example: 40.7128
 *         longitude:
 *           type: number
 *           example: -74.0060
 *         accuracy:
 *           type: number
 *         country:
 *           type: string
 *         region:
 *           type: string
 *         city:
 *           type: string
 *         metadata:
 *           type: object
 *
 *     GeoCluster:
 *       type: object
 *       properties:
 *         centroid:
 *           $ref: '#/components/schemas/GeoLocation'
 *         radius:
 *           type: number
 *           description: Radius in kilometers
 *         members:
 *           type: array
 *           items:
 *             type: string
 *         density:
 *           type: number
 *
 *     ProximityMetric:
 *       type: object
 *       properties:
 *         entity1:
 *           type: string
 *         entity2:
 *           type: string
 *         distance:
 *           type: number
 *         unit:
 *           type: string
 *           enum: [km, miles]
 *
 *     HeatmapData:
 *       type: object
 *       properties:
 *         gridSize:
 *           type: integer
 *         cells:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/HeatmapCell'
 *         intensity:
 *           type: string
 *           enum: [low, medium, high]
 *
 *     HeatmapCell:
 *       type: object
 *       properties:
 *         x:
 *           type: integer
 *         y:
 *           type: integer
 *         value:
 *           type: number
 *         count:
 *           type: integer
 *
 *     BehavioralPattern:
 *       type: object
 *       properties:
 *         patternId:
 *           type: string
 *         signature:
 *           type: array
 *           items:
 *             type: string
 *         frequency:
 *           type: number
 *         entities:
 *           type: array
 *           items:
 *             type: string
 *         classification:
 *           type: string
 *           enum: [malicious, suspicious, benign, unknown]
 *         confidence:
 *           type: number
 *
 *     AttributionAnalysis:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         targetId:
 *           type: string
 *         targetType:
 *           type: string
 *           enum: [campaign, incident, malware, attack, infrastructure]
 *         attributionScore:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *         topCandidates:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AttributionCandidate'
 *         evidenceCollection:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AttributionEvidence'
 *         analysisMethod:
 *           type: string
 *           enum: [automated, manual, hybrid]
 *         status:
 *           type: string
 *           enum: [pending, in-progress, completed, validated, disputed]
 *
 *     AttributionCandidate:
 *       type: object
 *       properties:
 *         actorId:
 *           type: string
 *         actorName:
 *           type: string
 *         attributionScore:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *         confidence:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *         evidenceCount:
 *           type: integer
 *         matchingFactors:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AttributionFactor'
 *         likelihood:
 *           type: string
 *           enum: [very-low, low, medium, high, very-high]
 *         rank:
 *           type: integer
 *
 *     AttributionFactor:
 *       type: object
 *       properties:
 *         factorType:
 *           type: string
 *           enum: [ttp, infrastructure, malware, code-similarity, linguistic, geolocation, timing, target-pattern, tool-fingerprint]
 *         score:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *         weight:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *         confidence:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *         description:
 *           type: string
 *         evidence:
 *           type: array
 *           items:
 *             type: string
 *         source:
 *           type: string
 *         timestamp:
 *           type: string
 *           format: date-time
 *
 *     AttributionEvidence:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         evidenceType:
 *           type: string
 *           enum: [technical, behavioral, contextual, intelligence, forensic]
 *         category:
 *           type: string
 *         description:
 *           type: string
 *         reliability:
 *           type: string
 *           enum: [low, medium, high, verified]
 *         confidence:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *         source:
 *           type: string
 *         collectedAt:
 *           type: string
 *           format: date-time
 *         validationStatus:
 *           type: string
 *           enum: [pending, verified, disputed, rejected]
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *     apiKeyAuth:
 *       type: apiKey
 *       in: header
 *       name: X-API-Key
 *
 *   responses:
 *     UnauthorizedError:
 *       description: Authentication required
 *     ForbiddenError:
 *       description: Insufficient permissions
 *     NotFoundError:
 *       description: Resource not found
 *     ValidationError:
 *       description: Invalid request parameters
 */
// ============================================================================
// API ENDPOINT FUNCTIONS - MULTI-DIMENSIONAL CORRELATION
// ============================================================================
/**
 * @swagger
 * /api/v1/correlation/multi-dimensional:
 *   post:
 *     summary: Multi-dimensional threat correlation
 *     description: Correlates threats across multiple dimensions using configurable algorithms
 *     tags: [Correlation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CorrelationRequest'
 *           examples:
 *             ipCorrelation:
 *               summary: Correlate IPs by infrastructure
 *               value:
 *                 threats:
 *                   - id: "ip1"
 *                     type: "ip"
 *                     country: "US"
 *                     asn: 12345
 *                     port: 443
 *                   - id: "ip2"
 *                     type: "ip"
 *                     country: "US"
 *                     asn: 12345
 *                     port: 80
 *                 dimensions: ["country", "asn"]
 *                 algorithm: "jaccard"
 *                 threshold: 0.7
 *     responses:
 *       200:
 *         description: Correlation results
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CorrelationResult'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
exports.apiCorrelateThreatsByAttributes = threat_correlation_kit_1.correlateThreatsByAttributes;
/**
 * @swagger
 * /api/v1/correlation/weighted:
 *   post:
 *     summary: Weighted correlation calculation
 *     description: Calculates weighted correlation score across multiple dimensions
 *     tags: [Correlation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - entity1
 *               - entity2
 *               - weights
 *             properties:
 *               entity1:
 *                 type: object
 *               entity2:
 *                 type: object
 *               weights:
 *                 type: object
 *                 example: { "port": 0.3, "country": 0.7 }
 *     responses:
 *       200:
 *         description: Weighted correlation score
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 score:
 *                   type: number
 *                   example: 0.85
 */
exports.apiCalculateWeightedCorrelation = threat_correlation_kit_1.calculateWeightedCorrelation;
/**
 * @swagger
 * /api/v1/correlation/ioc-cross-reference:
 *   post:
 *     summary: Cross-reference IOCs
 *     description: Cross-references IOCs across multiple threat intelligence sources
 *     tags: [Correlation]
 *     security:
 *       - bearerAuth: []
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - iocs
 *               - sources
 *             properties:
 *               iocs:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["192.168.1.1", "malware.com"]
 *               sources:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["virustotal", "alienvault", "threatcrowd"]
 *     responses:
 *       200:
 *         description: Cross-reference results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties:
 *                 type: array
 *                 items:
 *                   type: string
 *               example:
 *                 "192.168.1.1": ["virustotal", "alienvault"]
 *                 "malware.com": ["threatcrowd"]
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
exports.apiCrossReferenceIOCs = threat_correlation_kit_1.crossReferenceIOCs;
/**
 * @swagger
 * /api/v1/correlation/matrix:
 *   post:
 *     summary: Build correlation matrix
 *     description: Builds correlation matrix for threat entities
 *     tags: [Correlation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - entities
 *               - dimensions
 *             properties:
 *               entities:
 *                 type: array
 *                 items:
 *                   type: object
 *               dimensions:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Correlation matrix
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: array
 *                 items:
 *                   type: number
 *               example: [[1.0, 0.8, 0.3], [0.8, 1.0, 0.5], [0.3, 0.5, 1.0]]
 */
exports.apiBuildCorrelationMatrix = threat_correlation_kit_1.buildCorrelationMatrix;
/**
 * @swagger
 * /api/v1/correlation/clusters:
 *   post:
 *     summary: Find correlation clusters
 *     description: Finds correlation clusters using similarity threshold
 *     tags: [Correlation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - correlations
 *               - threshold
 *             properties:
 *               correlations:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/CorrelationResult'
 *               threshold:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 1
 *                 example: 0.8
 *     responses:
 *       200:
 *         description: Entity clusters
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: array
 *                 items:
 *                   type: string
 *               example: [["id1", "id2", "id3"], ["id4", "id5"]]
 */
exports.apiFindCorrelationClusters = threat_correlation_kit_1.findCorrelationClusters;
/**
 * @swagger
 * /api/v1/correlation/score-strength:
 *   post:
 *     summary: Score correlation strength
 *     description: Scores correlation strength based on multiple factors
 *     tags: [Correlation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - matches
 *               - dimensions
 *             properties:
 *               matches:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/CorrelationMatch'
 *               dimensions:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Correlation strength score
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 strength:
 *                   type: number
 *                   example: 0.87
 */
exports.apiScoreCorrelationStrength = threat_correlation_kit_1.scoreCorrelationStrength;
/**
 * @swagger
 * /api/v1/correlation/normalize:
 *   post:
 *     summary: Normalize correlation data
 *     description: Normalizes correlation data to standard range
 *     tags: [Correlation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - results
 *             properties:
 *               results:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/CorrelationResult'
 *               min:
 *                 type: number
 *                 default: 0
 *               max:
 *                 type: number
 *                 default: 1
 *     responses:
 *       200:
 *         description: Normalized correlation results
 */
exports.apiNormalizeCorrelationData = threat_correlation_kit_1.normalizeCorrelationData;
/**
 * @swagger
 * /api/v1/correlation/aggregate:
 *   post:
 *     summary: Aggregate correlation results
 *     description: Aggregates correlation results by entity type
 *     tags: [Correlation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - results
 *             properties:
 *               results:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/CorrelationResult'
 *     responses:
 *       200:
 *         description: Aggregated results by type
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/CorrelationResult'
 */
exports.apiAggregateCorrelationResults = threat_correlation_kit_1.aggregateCorrelationResults;
// ============================================================================
// API ENDPOINT FUNCTIONS - IOC RELATIONSHIPS
// ============================================================================
/**
 * @swagger
 * /api/v1/ioc/discover-relationships:
 *   post:
 *     summary: Discover IOC relationships
 *     description: Discovers relationships between IOCs using graph analysis
 *     tags: [IOC Relationships]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - iocs
 *             properties:
 *               iocs:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["192.168.1.1", "malware.com"]
 *               depth:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 default: 2
 *                 description: Maximum depth for relationship traversal
 *     responses:
 *       200:
 *         description: Discovered IOC relationships
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/IOCRelationship'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
exports.apiDiscoverIOCRelationships = threat_correlation_kit_1.discoverIOCRelationships;
/**
 * @swagger
 * /api/v1/ioc/relationship-strength:
 *   post:
 *     summary: Calculate relationship strength
 *     description: Calculates relationship strength between two IOCs
 *     tags: [IOC Relationships]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ioc1
 *               - ioc2
 *               - evidence
 *             properties:
 *               ioc1:
 *                 type: string
 *               ioc2:
 *                 type: string
 *               evidence:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Evidence'
 *     responses:
 *       200:
 *         description: Relationship strength
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 strength:
 *                   type: number
 *                   example: 0.85
 */
exports.apiCalculateRelationshipStrength = threat_correlation_kit_1.calculateRelationshipStrength;
/**
 * @swagger
 * /api/v1/ioc/relationship-graph:
 *   post:
 *     summary: Build relationship graph
 *     description: Builds graph representation of IOC relationships
 *     tags: [IOC Relationships]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - relationships
 *             properties:
 *               relationships:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/IOCRelationship'
 *     responses:
 *       200:
 *         description: Relationship graph
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ThreatGraph'
 */
exports.apiBuildRelationshipGraph = threat_correlation_kit_1.buildRelationshipGraph;
/**
 * @swagger
 * /api/v1/ioc/connected:
 *   get:
 *     summary: Find connected IOCs
 *     description: Finds IOCs connected to a given IOC
 *     tags: [IOC Relationships]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: iocId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: maxDistance
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       200:
 *         description: Connected IOC IDs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["malware.com", "1.2.3.4", "badsite.net"]
 */
exports.apiFindConnectedIOCs = threat_correlation_kit_1.findConnectedIOCs;
/**
 * @swagger
 * /api/v1/ioc/clusters:
 *   post:
 *     summary: Detect IOC clusters
 *     description: Detects clusters of related IOCs
 *     tags: [IOC Relationships]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - relationships
 *               - minClusterSize
 *             properties:
 *               relationships:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/IOCRelationship'
 *               minClusterSize:
 *                 type: integer
 *                 minimum: 2
 *                 example: 3
 *     responses:
 *       200:
 *         description: IOC clusters
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: array
 *                 items:
 *                   type: string
 */
exports.apiDetectIOCClusters = threat_correlation_kit_1.detectIOCClusters;
/**
 * @swagger
 * /api/v1/ioc/graph-connectivity:
 *   post:
 *     summary: Analyze graph connectivity
 *     description: Analyzes connectivity metrics of relationship graph
 *     tags: [IOC Relationships]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - graph
 *             properties:
 *               graph:
 *                 $ref: '#/components/schemas/ThreatGraph'
 *     responses:
 *       200:
 *         description: Connectivity metrics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 density:
 *                   type: number
 *                 avgDegree:
 *                   type: number
 *                 maxDegree:
 *                   type: number
 *                 minDegree:
 *                   type: number
 *                 components:
 *                   type: integer
 */
exports.apiAnalyzeGraphConnectivity = threat_correlation_kit_1.analyzeGraphConnectivity;
/**
 * @swagger
 * /api/v1/ioc/relationship-paths:
 *   post:
 *     summary: Extract relationship paths
 *     description: Extracts relationship paths between two IOCs
 *     tags: [IOC Relationships]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sourceId
 *               - targetId
 *               - graph
 *             properties:
 *               sourceId:
 *                 type: string
 *               targetId:
 *                 type: string
 *               graph:
 *                 $ref: '#/components/schemas/ThreatGraph'
 *               maxPaths:
 *                 type: integer
 *                 default: 5
 *     responses:
 *       200:
 *         description: Relationship paths
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: array
 *                 items:
 *                   type: string
 */
exports.apiExtractRelationshipPaths = threat_correlation_kit_1.extractRelationshipPaths;
/**
 * @swagger
 * /api/v1/ioc/relationship-confidence:
 *   post:
 *     summary: Score relationship confidence
 *     description: Scores confidence of IOC relationship
 *     tags: [IOC Relationships]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - relationship
 *             properties:
 *               relationship:
 *                 $ref: '#/components/schemas/IOCRelationship'
 *     responses:
 *       200:
 *         description: Confidence score
 */
exports.apiScoreRelationshipConfidence = threat_correlation_kit_1.scoreRelationshipConfidence;
// ============================================================================
// API ENDPOINT FUNCTIONS - TEMPORAL CORRELATION
// ============================================================================
/**
 * @swagger
 * /api/v1/temporal/analyze-patterns:
 *   post:
 *     summary: Analyze temporal patterns
 *     description: Analyzes temporal patterns in threat events
 *     tags: [Temporal Analysis]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - events
 *               - window
 *             properties:
 *               events:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/TemporalEvent'
 *               window:
 *                 $ref: '#/components/schemas/TimeWindow'
 *     responses:
 *       200:
 *         description: Temporal analysis results
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TemporalCorrelation'
 */
exports.apiAnalyzeTemporalPatterns = threat_correlation_kit_1.analyzeTemporalPatterns;
/**
 * @swagger
 * /api/v1/temporal/correlate-sequences:
 *   post:
 *     summary: Correlate event sequences
 *     description: Correlates event sequences for pattern matching
 *     tags: [Temporal Analysis]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - events
 *               - expectedSequence
 *             properties:
 *               events:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/TemporalEvent'
 *               expectedSequence:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["login", "privilege_escalation", "data_exfiltration"]
 *               maxGap:
 *                 type: integer
 *                 description: Max time gap in milliseconds
 *                 default: 3600000
 *     responses:
 *       200:
 *         description: Matching event sequences
 */
exports.apiCorrelateEventSequences = threat_correlation_kit_1.correlateEventSequences;
/**
 * @swagger
 * /api/v1/temporal/time-clusters:
 *   post:
 *     summary: Detect time-based clusters
 *     description: Detects time-based clusters of events
 *     tags: [Temporal Analysis]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - events
 *               - timeThreshold
 *             properties:
 *               events:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/TemporalEvent'
 *               timeThreshold:
 *                 type: integer
 *                 description: Max time difference in milliseconds
 *                 example: 300000
 *     responses:
 *       200:
 *         description: Event clusters
 */
exports.apiDetectTimeBasedClusters = threat_correlation_kit_1.detectTimeBasedClusters;
/**
 * @swagger
 * /api/v1/temporal/proximity:
 *   post:
 *     summary: Calculate temporal proximity
 *     description: Calculates temporal proximity between events
 *     tags: [Temporal Analysis]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - event1
 *               - event2
 *             properties:
 *               event1:
 *                 $ref: '#/components/schemas/TemporalEvent'
 *               event2:
 *                 $ref: '#/components/schemas/TemporalEvent'
 *     responses:
 *       200:
 *         description: Proximity score
 */
exports.apiCalculateTemporalProximity = threat_correlation_kit_1.calculateTemporalProximity;
/**
 * @swagger
 * /api/v1/temporal/timeline:
 *   post:
 *     summary: Build timeline correlation
 *     description: Builds timeline correlation across multiple entities
 *     tags: [Temporal Analysis]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - entityEvents
 *               - window
 *             properties:
 *               entityEvents:
 *                 type: object
 *                 additionalProperties:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TemporalEvent'
 *               window:
 *                 $ref: '#/components/schemas/TimeWindow'
 *     responses:
 *       200:
 *         description: Timeline correlations
 */
exports.apiBuildTimelineCorrelation = threat_correlation_kit_1.buildTimelineCorrelation;
/**
 * @swagger
 * /api/v1/temporal/anomalies:
 *   post:
 *     summary: Find temporal anomalies
 *     description: Finds temporal anomalies in event stream
 *     tags: [Temporal Analysis]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - events
 *             properties:
 *               events:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/TemporalEvent'
 *               threshold:
 *                 type: number
 *                 description: Anomaly detection threshold (std devs)
 *                 default: 2.0
 *     responses:
 *       200:
 *         description: Detected anomalies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TemporalAnomaly'
 */
exports.apiFindTemporalAnomalies = threat_correlation_kit_1.findTemporalAnomalies;
/**
 * @swagger
 * /api/v1/temporal/aggregate-windows:
 *   post:
 *     summary: Aggregate time windows
 *     description: Aggregates events into time windows
 *     tags: [Temporal Analysis]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - events
 *               - windowSize
 *             properties:
 *               events:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/TemporalEvent'
 *               windowSize:
 *                 type: integer
 *                 description: Window size in milliseconds
 *                 example: 3600000
 *     responses:
 *       200:
 *         description: Aggregated windows
 */
exports.apiAggregateTimeWindows = threat_correlation_kit_1.aggregateTimeWindows;
/**
 * @swagger
 * /api/v1/temporal/relevance-score:
 *   post:
 *     summary: Score temporal relevance
 *     description: Scores temporal relevance of events
 *     tags: [Temporal Analysis]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - events
 *               - referenceTime
 *             properties:
 *               events:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/TemporalEvent'
 *               referenceTime:
 *                 type: string
 *                 format: date-time
 *               decayFactor:
 *                 type: number
 *                 default: 0.1
 *     responses:
 *       200:
 *         description: Relevance scores
 */
exports.apiScoreTemporalRelevance = threat_correlation_kit_1.scoreTemporalRelevance;
// ============================================================================
// API ENDPOINT FUNCTIONS - SPATIAL CORRELATION
// ============================================================================
/**
 * @swagger
 * /api/v1/spatial/correlate-geolocation:
 *   post:
 *     summary: Correlate by geolocation
 *     description: Correlates threats by geographic location
 *     tags: [Spatial Analysis]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - entityLocations
 *               - radiusKm
 *             properties:
 *               entityLocations:
 *                 type: object
 *                 additionalProperties:
 *                   $ref: '#/components/schemas/GeoLocation'
 *               radiusKm:
 *                 type: number
 *                 description: Radius for proximity matching
 *                 example: 10
 *     responses:
 *       200:
 *         description: Spatial correlation results
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SpatialCorrelation'
 */
exports.apiCorrelateByGeoLocation = threat_correlation_kit_1.correlateByGeoLocation;
/**
 * @swagger
 * /api/v1/spatial/geo-proximity:
 *   post:
 *     summary: Calculate geographic proximity
 *     description: Calculates distance between two geographic locations
 *     tags: [Spatial Analysis]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - location1
 *               - location2
 *             properties:
 *               location1:
 *                 $ref: '#/components/schemas/GeoLocation'
 *               location2:
 *                 $ref: '#/components/schemas/GeoLocation'
 *     responses:
 *       200:
 *         description: Distance in kilometers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 distance:
 *                   type: number
 *                   example: 3936.15
 *                 unit:
 *                   type: string
 *                   example: "km"
 */
exports.apiCalculateGeoProximity = threat_correlation_kit_1.calculateGeoProximity;
/**
 * @swagger
 * /api/v1/spatial/cluster-by-region:
 *   post:
 *     summary: Cluster by region
 *     description: Clusters entities by geographic region
 *     tags: [Spatial Analysis]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - entityLocations
 *               - radiusKm
 *             properties:
 *               entityLocations:
 *                 type: object
 *                 additionalProperties:
 *                   $ref: '#/components/schemas/GeoLocation'
 *               radiusKm:
 *                 type: number
 *     responses:
 *       200:
 *         description: Geographic clusters
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/GeoCluster'
 */
exports.apiClusterByRegion = threat_correlation_kit_1.clusterByRegion;
/**
 * @swagger
 * /api/v1/spatial/geo-anomalies:
 *   post:
 *     summary: Detect geographic anomalies
 *     description: Detects geographic anomalies in threat distribution
 *     tags: [Spatial Analysis]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - locations
 *             properties:
 *               locations:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/GeoLocation'
 *               threshold:
 *                 type: number
 *                 default: 2.0
 *     responses:
 *       200:
 *         description: Anomalous locations
 */
exports.apiDetectGeoAnomalies = threat_correlation_kit_1.detectGeoAnomalies;
/**
 * @swagger
 * /api/v1/spatial/heatmap:
 *   post:
 *     summary: Build spatial heatmap
 *     description: Builds spatial heatmap of threat activity
 *     tags: [Spatial Analysis]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - locations
 *             properties:
 *               locations:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/GeoLocation'
 *               gridSize:
 *                 type: integer
 *                 default: 100
 *     responses:
 *       200:
 *         description: Heatmap data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HeatmapData'
 */
exports.apiBuildSpatialHeatmap = threat_correlation_kit_1.buildSpatialHeatmap;
/**
 * @swagger
 * /api/v1/spatial/geo-correlation-score:
 *   post:
 *     summary: Score geographic correlation
 *     description: Scores geographic correlation strength
 *     tags: [Spatial Analysis]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clusters
 *               - proximities
 *             properties:
 *               clusters:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/GeoCluster'
 *               proximities:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/ProximityMetric'
 *     responses:
 *       200:
 *         description: Correlation score
 */
exports.apiScoreGeoCorrelation = threat_correlation_kit_1.scoreGeoCorrelation;
// ============================================================================
// API ENDPOINT FUNCTIONS - BEHAVIORAL CORRELATION
// ============================================================================
/**
 * @swagger
 * /api/v1/behavioral/correlate-patterns:
 *   post:
 *     summary: Correlate behavior patterns
 *     description: Correlates threat behavior patterns
 *     tags: [Behavioral Analysis]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - entityBehaviors
 *             properties:
 *               entityBehaviors:
 *                 type: object
 *                 additionalProperties:
 *                   type: array
 *                   items:
 *                     type: string
 *                 example:
 *                   entity1: ["port_scan", "brute_force", "data_exfil"]
 *                   entity2: ["port_scan", "exploit", "data_exfil"]
 *               threshold:
 *                 type: number
 *                 default: 0.7
 *     responses:
 *       200:
 *         description: Behavior patterns
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BehavioralPattern'
 */
exports.apiCorrelateBehaviorPatterns = threat_correlation_kit_1.correlateBehaviorPatterns;
/**
 * @swagger
 * /api/v1/behavioral/detect-anomalies:
 *   post:
 *     summary: Detect behavioral anomalies
 *     description: Detects behavioral anomalies in entity actions
 *     tags: [Behavioral Analysis]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - entityId
 *               - observedBehavior
 *               - baselineBehavior
 *             properties:
 *               entityId:
 *                 type: string
 *               observedBehavior:
 *                 type: array
 *                 items:
 *                   type: string
 *               baselineBehavior:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Behavioral anomaly or null
 */
exports.apiDetectBehavioralAnomalies = threat_correlation_kit_1.detectBehavioralAnomalies;
/**
 * @swagger
 * /api/v1/behavioral/fingerprint:
 *   post:
 *     summary: Fingerprint threat behavior
 *     description: Creates behavior fingerprint for entity
 *     tags: [Behavioral Analysis]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - behaviors
 *             properties:
 *               behaviors:
 *                 type: array
 *                 items:
 *                   type: string
 *               windowSize:
 *                 type: integer
 *                 default: 5
 *     responses:
 *       200:
 *         description: Behavior fingerprint hash
 */
exports.apiFingerprintThreatBehavior = threat_correlation_kit_1.fingerprintThreatBehavior;
/**
 * @swagger
 * /api/v1/behavioral/match-signatures:
 *   post:
 *     summary: Match behavior signatures
 *     description: Matches behavior signatures against known patterns
 *     tags: [Behavioral Analysis]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - observedBehaviors
 *               - knownPatterns
 *             properties:
 *               observedBehaviors:
 *                 type: array
 *                 items:
 *                   type: string
 *               knownPatterns:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/BehavioralPattern'
 *     responses:
 *       200:
 *         description: Matching patterns
 */
exports.apiMatchBehaviorSignatures = threat_correlation_kit_1.matchBehaviorSignatures;
/**
 * @swagger
 * /api/v1/behavioral/similarity-score:
 *   post:
 *     summary: Score behavior similarity
 *     description: Scores similarity between two behavior sets
 *     tags: [Behavioral Analysis]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - behavior1
 *               - behavior2
 *             properties:
 *               behavior1:
 *                 type: array
 *                 items:
 *                   type: string
 *               behavior2:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Similarity score
 */
exports.apiScoreBehaviorSimilarity = threat_correlation_kit_1.scoreBehaviorSimilarity;
/**
 * @swagger
 * /api/v1/behavioral/classify:
 *   post:
 *     summary: Classify threat behavior
 *     description: Classifies threat behavior into categories
 *     tags: [Behavioral Analysis]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - behaviors
 *               - categorySignatures
 *             properties:
 *               behaviors:
 *                 type: array
 *                 items:
 *                   type: string
 *               categorySignatures:
 *                 type: object
 *                 additionalProperties:
 *                   type: array
 *                   items:
 *                     type: string
 *     responses:
 *       200:
 *         description: Matching categories
 */
exports.apiClassifyThreatBehavior = threat_correlation_kit_1.classifyThreatBehavior;
// ============================================================================
// API ENDPOINT FUNCTIONS - GRAPH ANALYSIS
// ============================================================================
/**
 * @swagger
 * /api/v1/graph/create:
 *   post:
 *     summary: Create threat graph
 *     description: Creates a new empty threat graph
 *     tags: [Graph Analysis]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Empty threat graph created
 */
exports.apiCreateThreatGraph = threat_graph_analysis_kit_1.createThreatGraph;
/**
 * @swagger
 * /api/v1/graph/add-node:
 *   post:
 *     summary: Add node to graph
 *     description: Adds a node to the threat graph
 *     tags: [Graph Analysis]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - graph
 *               - node
 *             properties:
 *               graph:
 *                 $ref: '#/components/schemas/ThreatGraph'
 *               node:
 *                 $ref: '#/components/schemas/GraphNode'
 *     responses:
 *       200:
 *         description: Updated graph
 */
exports.apiAddNode = threat_graph_analysis_kit_1.addNode;
/**
 * @swagger
 * /api/v1/graph/add-edge:
 *   post:
 *     summary: Add edge to graph
 *     description: Adds an edge to the threat graph
 *     tags: [Graph Analysis]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - graph
 *               - edge
 *             properties:
 *               graph:
 *                 $ref: '#/components/schemas/ThreatGraph'
 *               edge:
 *                 $ref: '#/components/schemas/GraphEdge'
 *     responses:
 *       200:
 *         description: Updated graph
 */
exports.apiAddEdge = threat_graph_analysis_kit_1.addEdge;
/**
 * @swagger
 * /api/v1/graph/build-from-indicators:
 *   post:
 *     summary: Build graph from indicators
 *     description: Builds threat graph from collection of threat indicators
 *     tags: [Graph Analysis]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - indicators
 *             properties:
 *               indicators:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Constructed threat graph
 */
exports.apiBuildGraphFromIndicators = threat_graph_analysis_kit_1.buildGraphFromIndicators;
/**
 * @swagger
 * /api/v1/graph/merge:
 *   post:
 *     summary: Merge graphs
 *     description: Merges two threat graphs into one
 *     tags: [Graph Analysis]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - graph1
 *               - graph2
 *             properties:
 *               graph1:
 *                 $ref: '#/components/schemas/ThreatGraph'
 *               graph2:
 *                 $ref: '#/components/schemas/ThreatGraph'
 *     responses:
 *       200:
 *         description: Merged graph
 */
exports.apiMergeGraphs = threat_graph_analysis_kit_1.mergeGraphs;
/**
 * @swagger
 * /api/v1/graph/filter:
 *   post:
 *     summary: Filter graph
 *     description: Filters graph by node type or properties
 *     tags: [Graph Analysis]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - graph
 *               - predicate
 *             properties:
 *               graph:
 *                 $ref: '#/components/schemas/ThreatGraph'
 *               predicate:
 *                 type: string
 *                 description: Filter predicate as string
 *     responses:
 *       200:
 *         description: Filtered graph
 */
exports.apiFilterGraph = threat_graph_analysis_kit_1.filterGraph;
/**
 * @swagger
 * /api/v1/graph/bfs:
 *   post:
 *     summary: Breadth-first search
 *     description: Performs BFS traversal from starting node
 *     tags: [Graph Analysis]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - graph
 *               - startNodeId
 *             properties:
 *               graph:
 *                 $ref: '#/components/schemas/ThreatGraph'
 *               startNodeId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Nodes in BFS order
 */
exports.apiBreadthFirstSearch = threat_graph_analysis_kit_1.breadthFirstSearch;
/**
 * @swagger
 * /api/v1/graph/dfs:
 *   post:
 *     summary: Depth-first search
 *     description: Performs DFS traversal from starting node
 *     tags: [Graph Analysis]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - graph
 *               - startNodeId
 *             properties:
 *               graph:
 *                 $ref: '#/components/schemas/ThreatGraph'
 *               startNodeId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Nodes in DFS order
 */
exports.apiDepthFirstSearch = threat_graph_analysis_kit_1.depthFirstSearch;
/**
 * @swagger
 * /api/v1/graph/neighbors:
 *   get:
 *     summary: Get node neighbors
 *     description: Finds all neighbors of a node within specified depth
 *     tags: [Graph Analysis]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: nodeId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: depth
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       200:
 *         description: Neighbor node IDs
 */
exports.apiGetNeighbors = threat_graph_analysis_kit_1.getNeighbors;
/**
 * @swagger
 * /api/v1/graph/all-paths:
 *   post:
 *     summary: Find all paths
 *     description: Finds all paths between two nodes
 *     tags: [Graph Analysis]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - graph
 *               - sourceId
 *               - targetId
 *             properties:
 *               graph:
 *                 $ref: '#/components/schemas/ThreatGraph'
 *               sourceId:
 *                 type: string
 *               targetId:
 *                 type: string
 *               maxDepth:
 *                 type: integer
 *                 default: 10
 *     responses:
 *       200:
 *         description: All paths found
 */
exports.apiFindAllPaths = threat_graph_analysis_kit_1.findAllPaths;
/**
 * @swagger
 * /api/v1/graph/shortest-path:
 *   post:
 *     summary: Find shortest path
 *     description: Finds shortest correlation path between two entities
 *     tags: [Graph Analysis]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sourceId
 *               - targetId
 *               - graph
 *             properties:
 *               sourceId:
 *                 type: string
 *               targetId:
 *                 type: string
 *               graph:
 *                 $ref: '#/components/schemas/ThreatGraph'
 *     responses:
 *       200:
 *         description: Shortest path or null
 */
exports.apiFindShortestPath = threat_correlation_kit_1.findShortestCorrelationPath;
/**
 * @swagger
 * /api/v1/graph/centrality:
 *   post:
 *     summary: Calculate centrality metrics
 *     description: Calculates centrality metrics for graph nodes
 *     tags: [Graph Analysis]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - graph
 *             properties:
 *               graph:
 *                 $ref: '#/components/schemas/ThreatGraph'
 *     responses:
 *       200:
 *         description: Centrality scores by node
 */
exports.apiCalculateCentrality = threat_correlation_kit_1.calculateCentralityMetrics;
/**
 * @swagger
 * /api/v1/graph/communities:
 *   post:
 *     summary: Detect threat communities
 *     description: Detects communities in threat correlation graph
 *     tags: [Graph Analysis]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - graph
 *             properties:
 *               graph:
 *                 $ref: '#/components/schemas/ThreatGraph'
 *               minCommunitySize:
 *                 type: integer
 *                 default: 3
 *     responses:
 *       200:
 *         description: Detected communities
 */
exports.apiDetectCommunities = threat_correlation_kit_1.detectThreatCommunities;
/**
 * @swagger
 * /api/v1/graph/density:
 *   post:
 *     summary: Analyze graph density
 *     description: Analyzes density metrics of correlation graph
 *     tags: [Graph Analysis]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - graph
 *             properties:
 *               graph:
 *                 $ref: '#/components/schemas/ThreatGraph'
 *     responses:
 *       200:
 *         description: Graph density
 */
exports.apiAnalyzeGraphDensity = threat_correlation_kit_1.analyzeGraphDensity;
/**
 * @swagger
 * /api/v1/graph/extract-subgraph:
 *   post:
 *     summary: Extract subgraph
 *     description: Extracts subgraphs based on criteria
 *     tags: [Graph Analysis]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - graph
 *               - predicate
 *             properties:
 *               graph:
 *                 $ref: '#/components/schemas/ThreatGraph'
 *               predicate:
 *                 type: string
 *     responses:
 *       200:
 *         description: Extracted subgraph
 */
exports.apiExtractSubgraphs = threat_correlation_kit_1.extractSubgraphs;
// ============================================================================
// API ENDPOINT FUNCTIONS - CONFIDENCE SCORING
// ============================================================================
/**
 * @swagger
 * /api/v1/confidence/correlation:
 *   post:
 *     summary: Calculate correlation confidence
 *     description: Calculates overall correlation confidence score
 *     tags: [Confidence Scoring]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - correlation
 *               - evidence
 *             properties:
 *               correlation:
 *                 $ref: '#/components/schemas/CorrelationResult'
 *               evidence:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Evidence'
 *     responses:
 *       200:
 *         description: Detailed confidence score
 */
exports.apiCalculateCorrelationConfidence = threat_correlation_kit_1.calculateCorrelationConfidence;
/**
 * @swagger
 * /api/v1/confidence/weight-evidence:
 *   post:
 *     summary: Weight evidence sources
 *     description: Weights evidence sources by reliability
 *     tags: [Confidence Scoring]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - evidence
 *             properties:
 *               evidence:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Evidence'
 *     responses:
 *       200:
 *         description: Weighted and sorted evidence
 */
exports.apiWeightEvidenceSources = threat_correlation_kit_1.weightEvidenceSources;
/**
 * @swagger
 * /api/v1/confidence/aggregate-scores:
 *   post:
 *     summary: Aggregate confidence scores
 *     description: Aggregates confidence scores from multiple sources
 *     tags: [Confidence Scoring]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - scores
 *             properties:
 *               scores:
 *                 type: array
 *                 items:
 *                   type: number
 *               weights:
 *                 type: array
 *                 items:
 *                   type: number
 *     responses:
 *       200:
 *         description: Aggregated confidence score
 */
exports.apiAggregateConfidenceScores = threat_correlation_kit_1.aggregateConfidenceScores;
/**
 * @swagger
 * /api/v1/confidence/interval:
 *   post:
 *     summary: Calculate confidence interval
 *     description: Calculates confidence interval for correlation score
 *     tags: [Confidence Scoring]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - samples
 *               - confidenceLevel
 *             properties:
 *               samples:
 *                 type: array
 *                 items:
 *                   type: number
 *               confidenceLevel:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 1
 *                 example: 0.95
 *     responses:
 *       200:
 *         description: Confidence interval
 */
exports.apiCalculateConfidenceInterval = threat_correlation_kit_1.calculateConfidenceInterval;
/**
 * @swagger
 * /api/v1/confidence/normalize-metrics:
 *   post:
 *     summary: Normalize confidence metrics
 *     description: Normalizes confidence metrics to standard scale
 *     tags: [Confidence Scoring]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - metrics
 *             properties:
 *               metrics:
 *                 type: object
 *                 additionalProperties:
 *                   type: number
 *               min:
 *                 type: number
 *                 default: 0
 *               max:
 *                 type: number
 *                 default: 1
 *     responses:
 *       200:
 *         description: Normalized metrics
 */
exports.apiNormalizeConfidenceMetrics = threat_correlation_kit_1.normalizeConfidenceMetrics;
// ============================================================================
// API ENDPOINT FUNCTIONS - ATTRIBUTION ANALYSIS
// ============================================================================
/**
 * @swagger
 * /api/v1/attribution/create:
 *   post:
 *     summary: Create attribution analysis
 *     description: Creates a new attribution analysis
 *     tags: [Attribution]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - targetId
 *               - targetType
 *             properties:
 *               targetId:
 *                 type: string
 *               targetType:
 *                 type: string
 *                 enum: [campaign, incident, malware, attack, infrastructure]
 *               analysisMethod:
 *                 type: string
 *                 enum: [automated, manual, hybrid]
 *               analyst:
 *                 type: string
 *     responses:
 *       201:
 *         description: Attribution analysis created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AttributionAnalysis'
 */
exports.apiCreateAttributionAnalysis = threat_attribution_analysis_kit_1.createAttributionAnalysis;
/**
 * @swagger
 * /api/v1/attribution/multi-factor:
 *   post:
 *     summary: Multi-factor attribution
 *     description: Calculates multi-factor attribution score
 *     tags: [Attribution]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - factors
 *             properties:
 *               factors:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/AttributionFactor'
 *     responses:
 *       200:
 *         description: Attribution score and breakdown
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 score:
 *                   type: number
 *                   minimum: 0
 *                   maximum: 100
 *                 confidence:
 *                   type: number
 *                   minimum: 0
 *                   maximum: 100
 *                 breakdown:
 *                   type: object
 *                   additionalProperties:
 *                     type: number
 */
exports.apiCalculateMultiFactorAttribution = threat_attribution_analysis_kit_1.calculateMultiFactorAttribution;
// Export all API functions
exports.default = {
    // Multi-dimensional correlation
    apiCorrelateThreatsByAttributes: exports.apiCorrelateThreatsByAttributes,
    apiCalculateWeightedCorrelation: exports.apiCalculateWeightedCorrelation,
    apiCrossReferenceIOCs: exports.apiCrossReferenceIOCs,
    apiBuildCorrelationMatrix: exports.apiBuildCorrelationMatrix,
    apiFindCorrelationClusters: exports.apiFindCorrelationClusters,
    apiScoreCorrelationStrength: exports.apiScoreCorrelationStrength,
    apiNormalizeCorrelationData: exports.apiNormalizeCorrelationData,
    apiAggregateCorrelationResults: exports.apiAggregateCorrelationResults,
    // IOC relationships
    apiDiscoverIOCRelationships: exports.apiDiscoverIOCRelationships,
    apiCalculateRelationshipStrength: exports.apiCalculateRelationshipStrength,
    apiBuildRelationshipGraph: exports.apiBuildRelationshipGraph,
    apiFindConnectedIOCs: exports.apiFindConnectedIOCs,
    apiDetectIOCClusters: exports.apiDetectIOCClusters,
    apiAnalyzeGraphConnectivity: exports.apiAnalyzeGraphConnectivity,
    apiExtractRelationshipPaths: exports.apiExtractRelationshipPaths,
    apiScoreRelationshipConfidence: exports.apiScoreRelationshipConfidence,
    // Temporal correlation
    apiAnalyzeTemporalPatterns: exports.apiAnalyzeTemporalPatterns,
    apiCorrelateEventSequences: exports.apiCorrelateEventSequences,
    apiDetectTimeBasedClusters: exports.apiDetectTimeBasedClusters,
    apiCalculateTemporalProximity: exports.apiCalculateTemporalProximity,
    apiBuildTimelineCorrelation: exports.apiBuildTimelineCorrelation,
    apiFindTemporalAnomalies: exports.apiFindTemporalAnomalies,
    apiAggregateTimeWindows: exports.apiAggregateTimeWindows,
    apiScoreTemporalRelevance: exports.apiScoreTemporalRelevance,
    // Spatial correlation
    apiCorrelateByGeoLocation: exports.apiCorrelateByGeoLocation,
    apiCalculateGeoProximity: exports.apiCalculateGeoProximity,
    apiClusterByRegion: exports.apiClusterByRegion,
    apiDetectGeoAnomalies: exports.apiDetectGeoAnomalies,
    apiBuildSpatialHeatmap: exports.apiBuildSpatialHeatmap,
    apiScoreGeoCorrelation: exports.apiScoreGeoCorrelation,
    // Behavioral correlation
    apiCorrelateBehaviorPatterns: exports.apiCorrelateBehaviorPatterns,
    apiDetectBehavioralAnomalies: exports.apiDetectBehavioralAnomalies,
    apiFingerprintThreatBehavior: exports.apiFingerprintThreatBehavior,
    apiMatchBehaviorSignatures: exports.apiMatchBehaviorSignatures,
    apiScoreBehaviorSimilarity: exports.apiScoreBehaviorSimilarity,
    apiClassifyThreatBehavior: exports.apiClassifyThreatBehavior,
    // Graph analysis
    apiCreateThreatGraph: exports.apiCreateThreatGraph,
    apiAddNode: exports.apiAddNode,
    apiAddEdge: exports.apiAddEdge,
    apiBuildGraphFromIndicators: exports.apiBuildGraphFromIndicators,
    apiMergeGraphs: exports.apiMergeGraphs,
    apiFilterGraph: exports.apiFilterGraph,
    apiBreadthFirstSearch: exports.apiBreadthFirstSearch,
    apiDepthFirstSearch: exports.apiDepthFirstSearch,
    apiGetNeighbors: exports.apiGetNeighbors,
    apiFindAllPaths: exports.apiFindAllPaths,
    apiFindShortestPath: exports.apiFindShortestPath,
    apiCalculateCentrality: exports.apiCalculateCentrality,
    apiDetectCommunities: exports.apiDetectCommunities,
    apiAnalyzeGraphDensity: exports.apiAnalyzeGraphDensity,
    apiExtractSubgraphs: exports.apiExtractSubgraphs,
    // Confidence scoring
    apiCalculateCorrelationConfidence: exports.apiCalculateCorrelationConfidence,
    apiWeightEvidenceSources: exports.apiWeightEvidenceSources,
    apiAggregateConfidenceScores: exports.apiAggregateConfidenceScores,
    apiCalculateConfidenceInterval: exports.apiCalculateConfidenceInterval,
    apiNormalizeConfidenceMetrics: exports.apiNormalizeConfidenceMetrics,
    // Attribution
    apiCreateAttributionAnalysis: exports.apiCreateAttributionAnalysis,
    apiCalculateMultiFactorAttribution: exports.apiCalculateMultiFactorAttribution,
};
//# sourceMappingURL=advanced-threat-correlation-composite.js.map