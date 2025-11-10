"use strict";
/**
 * LOC: TINTFUSION002
 * File: /reuse/threat/composites/threat-intelligence-fusion-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../threat-intelligence-fusion-kit
 *   - ../threat-enrichment-kit
 *   - ../threat-correlation-kit
 *   - ../security-event-correlation-kit
 *
 * DOWNSTREAM (imported by):
 *   - Threat intelligence fusion services
 *   - Multi-source intelligence aggregation modules
 *   - Enrichment pipeline orchestrators
 *   - Intelligence quality assurance services
 *   - STIX/TAXII integration platforms
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.orchestrateEnrichment = exports.createEnrichmentPipeline = exports.getIntelCorrelationModelAttributes = exports.getSourceReliabilityMetricsModelAttributes = exports.getFusedIntelligenceModelAttributes = exports.getIntelFeedSourceModelAttributes = exports.ThreatSeverity = exports.IntelligenceType = exports.IntelFeedFormat = exports.IntelFeedType = exports.visualizeFusionResults = exports.trackFusionMetrics = exports.analyzeFusionEffectiveness = exports.generateFusionReport = exports.supplementMissingFields = exports.enhanceIntelMetadata = exports.crossReferenceIntelligence = exports.enrichFromMultipleSources = exports.flagUnresolvableConflicts = exports.resolveConflictByReliability = exports.resolveConflictByVoting = exports.detectIntelConflicts = exports.rankIntelSources = exports.updateReliabilityMetrics = exports.trackSourceAccuracy = exports.calculateSourceReliability = exports.normalizeConfidenceRange = exports.aggregateConfidenceScores = exports.adjustConfidenceByAge = exports.weightSourceReliability = exports.calculateMultiSourceConfidence = exports.analyzeSourceAgreement = exports.buildCorrelationGraph = exports.identifyIntelClusters = exports.calculateCorrelationScore = exports.findIntelOverlaps = exports.correlateAcrossSources = exports.mergeDuplicateIntel = exports.detectDuplicatePatterns = exports.canonicalizeIntelValue = exports.fuzzyMatchIntelligence = exports.deduplicateIntelligence = exports.transformIntelFormat = exports.categorizeIntelData = exports.filterIntelByRelevance = exports.prioritizeIntelFeeds = exports.mergeIntelFeeds = exports.validateIntelFeedSchema = exports.normalizeIntelFeedFormat = exports.aggregateMultipleIntelFeeds = void 0;
exports.aggregateCorrelationResults = exports.normalizeCorrelationData = exports.scoreCorrelationStrength = exports.findCorrelationClusters = exports.buildCorrelationMatrix = exports.crossReferenceIOCs = exports.calculateWeightedCorrelation = exports.correlateThreatsByAttributes = exports.monitorCachePerformance = exports.optimizeCacheTTL = exports.invalidateEnrichmentCache = exports.retrieveCachedEnrichment = exports.cacheEnrichmentResult = exports.createEnrichmentCache = exports.validateThreatIntelData = exports.prioritizeThreatSources = exports.calculateReputationScore = exports.aggregateThreatData = exports.normalizeThreatIntelFeed = exports.integrateMultipleSources = exports.analyzeCertificateMetadata = exports.extractCertificateFingerprint = exports.validateCertificateChain = exports.parseSSLCertificate = exports.enrichWithSSLCertificate = exports.cacheDNSResults = exports.validateDNSData = exports.resolveDNSRecords = exports.fetchDNSHistory = exports.queryPassiveDNS = exports.performReverseDNS = exports.enrichWithDNS = exports.validateGeoIPResults = exports.cacheGeoIPData = exports.resolveNetworkRange = exports.queryASNInformation = exports.lookupIPGeolocation = exports.enrichWithGeoIP = exports.validateWHOISData = exports.trackWHOISHistory = exports.extractRegistrarInfo = exports.parseWHOISResponse = exports.queryDomainWHOIS = exports.enrichWithWHOIS = exports.handleEnrichmentErrors = exports.transformEnrichmentOutput = exports.mergeEnrichmentResults = exports.validateEnrichmentData = exports.aggregateEnrichmentResults = exports.prioritizeEnrichmentSources = void 0;
exports.AttackStage = exports.EventSeverity = exports.detectC2Communication = exports.detectBruteForceAttacks = exports.detectDataExfiltration = exports.correlateAcrossDataSources = exports.detectPrivilegeEscalation = exports.detectLateralMovement = exports.detectEventBehavioralAnomalies = exports.detectComplexEventPatterns = exports.aggregateEventsByDimensions = exports.detectMultiStageAttacks = exports.correlateEventsInTimeWindow = exports.normalizeConfidenceMetrics = exports.calculateConfidenceInterval = exports.aggregateCorrelationConfidenceScores = exports.weightEvidenceSources = exports.calculateCorrelationConfidence = exports.extractSubgraphs = exports.analyzeGraphDensity = exports.detectThreatCommunities = exports.calculateCentralityMetrics = exports.findShortestCorrelationPath = exports.classifyThreatBehavior = exports.scoreBehaviorSimilarity = exports.matchBehaviorSignatures = exports.fingerprintThreatBehavior = exports.detectBehavioralAnomalies = exports.correlateBehaviorPatterns = exports.scoreGeoCorrelation = exports.buildSpatialHeatmap = exports.detectGeoAnomalies = exports.clusterByRegion = exports.calculateGeoProximity = exports.correlateByGeoLocation = exports.scoreRelationshipConfidence = exports.extractRelationshipPaths = exports.analyzeGraphConnectivity = exports.detectIOCClusters = exports.findConnectedIOCs = exports.buildRelationshipGraph = exports.calculateRelationshipStrength = exports.discoverIOCRelationships = void 0;
/**
 * File: /reuse/threat/composites/threat-intelligence-fusion-composite.ts
 * Locator: WC-THREAT-INTEL-FUSION-COMPOSITE-001
 * Purpose: Comprehensive Threat Intelligence Fusion Composite - Multi-source fusion, enrichment, correlation, deduplication
 *
 * Upstream: Composes functions from threat-intelligence-fusion-kit, threat-enrichment-kit, threat-correlation-kit
 * Downstream: ../backend/*, Intelligence fusion services, Enrichment pipelines, Multi-source correlation
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript
 * Exports: 45 composed functions for intelligence fusion, enrichment, correlation, confidence scoring, conflict resolution
 *
 * LLM Context: Production-ready threat intelligence fusion composite for White Cross healthcare platform.
 * Provides comprehensive multi-source intelligence fusion including feed aggregation and normalization,
 * intelligent deduplication with fuzzy matching, cross-source correlation and clustering, multi-source
 * confidence scoring with reliability weighting, automated conflict resolution and consensus building,
 * comprehensive enrichment pipelines (WHOIS, GeoIP, DNS, SSL certificates), passive DNS analysis,
 * SSL certificate validation, reputation scoring, source reliability tracking, fusion analytics and
 * reporting, and HIPAA-compliant healthcare security intelligence operations. Includes Sequelize models
 * for fusion metadata, source reliability metrics, correlation graphs, and enrichment caches with
 * advanced database query optimization.
 */
// ============================================================================
// IMPORTS FROM SOURCE KITS
// ============================================================================
// Intelligence Fusion Operations
var threat_intelligence_fusion_kit_1 = require("../threat-intelligence-fusion-kit");
Object.defineProperty(exports, "aggregateMultipleIntelFeeds", { enumerable: true, get: function () { return threat_intelligence_fusion_kit_1.aggregateMultipleIntelFeeds; } });
Object.defineProperty(exports, "normalizeIntelFeedFormat", { enumerable: true, get: function () { return threat_intelligence_fusion_kit_1.normalizeIntelFeedFormat; } });
Object.defineProperty(exports, "validateIntelFeedSchema", { enumerable: true, get: function () { return threat_intelligence_fusion_kit_1.validateIntelFeedSchema; } });
Object.defineProperty(exports, "mergeIntelFeeds", { enumerable: true, get: function () { return threat_intelligence_fusion_kit_1.mergeIntelFeeds; } });
Object.defineProperty(exports, "prioritizeIntelFeeds", { enumerable: true, get: function () { return threat_intelligence_fusion_kit_1.prioritizeIntelFeeds; } });
Object.defineProperty(exports, "filterIntelByRelevance", { enumerable: true, get: function () { return threat_intelligence_fusion_kit_1.filterIntelByRelevance; } });
Object.defineProperty(exports, "categorizeIntelData", { enumerable: true, get: function () { return threat_intelligence_fusion_kit_1.categorizeIntelData; } });
Object.defineProperty(exports, "transformIntelFormat", { enumerable: true, get: function () { return threat_intelligence_fusion_kit_1.transformIntelFormat; } });
Object.defineProperty(exports, "deduplicateIntelligence", { enumerable: true, get: function () { return threat_intelligence_fusion_kit_1.deduplicateIntelligence; } });
Object.defineProperty(exports, "fuzzyMatchIntelligence", { enumerable: true, get: function () { return threat_intelligence_fusion_kit_1.fuzzyMatchIntelligence; } });
Object.defineProperty(exports, "canonicalizeIntelValue", { enumerable: true, get: function () { return threat_intelligence_fusion_kit_1.canonicalizeIntelValue; } });
Object.defineProperty(exports, "detectDuplicatePatterns", { enumerable: true, get: function () { return threat_intelligence_fusion_kit_1.detectDuplicatePatterns; } });
Object.defineProperty(exports, "mergeDuplicateIntel", { enumerable: true, get: function () { return threat_intelligence_fusion_kit_1.mergeDuplicateIntel; } });
Object.defineProperty(exports, "correlateAcrossSources", { enumerable: true, get: function () { return threat_intelligence_fusion_kit_1.correlateAcrossSources; } });
Object.defineProperty(exports, "findIntelOverlaps", { enumerable: true, get: function () { return threat_intelligence_fusion_kit_1.findIntelOverlaps; } });
Object.defineProperty(exports, "calculateCorrelationScore", { enumerable: true, get: function () { return threat_intelligence_fusion_kit_1.calculateCorrelationScore; } });
Object.defineProperty(exports, "identifyIntelClusters", { enumerable: true, get: function () { return threat_intelligence_fusion_kit_1.identifyIntelClusters; } });
Object.defineProperty(exports, "buildCorrelationGraph", { enumerable: true, get: function () { return threat_intelligence_fusion_kit_1.buildCorrelationGraph; } });
Object.defineProperty(exports, "analyzeSourceAgreement", { enumerable: true, get: function () { return threat_intelligence_fusion_kit_1.analyzeSourceAgreement; } });
Object.defineProperty(exports, "calculateMultiSourceConfidence", { enumerable: true, get: function () { return threat_intelligence_fusion_kit_1.calculateMultiSourceConfidence; } });
Object.defineProperty(exports, "weightSourceReliability", { enumerable: true, get: function () { return threat_intelligence_fusion_kit_1.weightSourceReliability; } });
Object.defineProperty(exports, "adjustConfidenceByAge", { enumerable: true, get: function () { return threat_intelligence_fusion_kit_1.adjustConfidenceByAge; } });
Object.defineProperty(exports, "aggregateConfidenceScores", { enumerable: true, get: function () { return threat_intelligence_fusion_kit_1.aggregateConfidenceScores; } });
Object.defineProperty(exports, "normalizeConfidenceRange", { enumerable: true, get: function () { return threat_intelligence_fusion_kit_1.normalizeConfidenceRange; } });
Object.defineProperty(exports, "calculateSourceReliability", { enumerable: true, get: function () { return threat_intelligence_fusion_kit_1.calculateSourceReliability; } });
Object.defineProperty(exports, "trackSourceAccuracy", { enumerable: true, get: function () { return threat_intelligence_fusion_kit_1.trackSourceAccuracy; } });
Object.defineProperty(exports, "updateReliabilityMetrics", { enumerable: true, get: function () { return threat_intelligence_fusion_kit_1.updateReliabilityMetrics; } });
Object.defineProperty(exports, "rankIntelSources", { enumerable: true, get: function () { return threat_intelligence_fusion_kit_1.rankIntelSources; } });
Object.defineProperty(exports, "detectIntelConflicts", { enumerable: true, get: function () { return threat_intelligence_fusion_kit_1.detectIntelConflicts; } });
Object.defineProperty(exports, "resolveConflictByVoting", { enumerable: true, get: function () { return threat_intelligence_fusion_kit_1.resolveConflictByVoting; } });
Object.defineProperty(exports, "resolveConflictByReliability", { enumerable: true, get: function () { return threat_intelligence_fusion_kit_1.resolveConflictByReliability; } });
Object.defineProperty(exports, "flagUnresolvableConflicts", { enumerable: true, get: function () { return threat_intelligence_fusion_kit_1.flagUnresolvableConflicts; } });
Object.defineProperty(exports, "enrichFromMultipleSources", { enumerable: true, get: function () { return threat_intelligence_fusion_kit_1.enrichFromMultipleSources; } });
Object.defineProperty(exports, "crossReferenceIntelligence", { enumerable: true, get: function () { return threat_intelligence_fusion_kit_1.crossReferenceIntelligence; } });
Object.defineProperty(exports, "enhanceIntelMetadata", { enumerable: true, get: function () { return threat_intelligence_fusion_kit_1.enhanceIntelMetadata; } });
Object.defineProperty(exports, "supplementMissingFields", { enumerable: true, get: function () { return threat_intelligence_fusion_kit_1.supplementMissingFields; } });
Object.defineProperty(exports, "generateFusionReport", { enumerable: true, get: function () { return threat_intelligence_fusion_kit_1.generateFusionReport; } });
Object.defineProperty(exports, "analyzeFusionEffectiveness", { enumerable: true, get: function () { return threat_intelligence_fusion_kit_1.analyzeFusionEffectiveness; } });
Object.defineProperty(exports, "trackFusionMetrics", { enumerable: true, get: function () { return threat_intelligence_fusion_kit_1.trackFusionMetrics; } });
Object.defineProperty(exports, "visualizeFusionResults", { enumerable: true, get: function () { return threat_intelligence_fusion_kit_1.visualizeFusionResults; } });
Object.defineProperty(exports, "IntelFeedType", { enumerable: true, get: function () { return threat_intelligence_fusion_kit_1.IntelFeedType; } });
Object.defineProperty(exports, "IntelFeedFormat", { enumerable: true, get: function () { return threat_intelligence_fusion_kit_1.IntelFeedFormat; } });
Object.defineProperty(exports, "IntelligenceType", { enumerable: true, get: function () { return threat_intelligence_fusion_kit_1.IntelligenceType; } });
Object.defineProperty(exports, "ThreatSeverity", { enumerable: true, get: function () { return threat_intelligence_fusion_kit_1.ThreatSeverity; } });
Object.defineProperty(exports, "getIntelFeedSourceModelAttributes", { enumerable: true, get: function () { return threat_intelligence_fusion_kit_1.getIntelFeedSourceModelAttributes; } });
Object.defineProperty(exports, "getFusedIntelligenceModelAttributes", { enumerable: true, get: function () { return threat_intelligence_fusion_kit_1.getFusedIntelligenceModelAttributes; } });
Object.defineProperty(exports, "getSourceReliabilityMetricsModelAttributes", { enumerable: true, get: function () { return threat_intelligence_fusion_kit_1.getSourceReliabilityMetricsModelAttributes; } });
Object.defineProperty(exports, "getIntelCorrelationModelAttributes", { enumerable: true, get: function () { return threat_intelligence_fusion_kit_1.getIntelCorrelationModelAttributes; } });
// Enrichment Operations
var threat_enrichment_kit_1 = require("../threat-enrichment-kit");
Object.defineProperty(exports, "createEnrichmentPipeline", { enumerable: true, get: function () { return threat_enrichment_kit_1.createEnrichmentPipeline; } });
Object.defineProperty(exports, "orchestrateEnrichment", { enumerable: true, get: function () { return threat_enrichment_kit_1.orchestrateEnrichment; } });
Object.defineProperty(exports, "prioritizeEnrichmentSources", { enumerable: true, get: function () { return threat_enrichment_kit_1.prioritizeEnrichmentSources; } });
Object.defineProperty(exports, "aggregateEnrichmentResults", { enumerable: true, get: function () { return threat_enrichment_kit_1.aggregateEnrichmentResults; } });
Object.defineProperty(exports, "validateEnrichmentData", { enumerable: true, get: function () { return threat_enrichment_kit_1.validateEnrichmentData; } });
Object.defineProperty(exports, "mergeEnrichmentResults", { enumerable: true, get: function () { return threat_enrichment_kit_1.mergeEnrichmentResults; } });
Object.defineProperty(exports, "transformEnrichmentOutput", { enumerable: true, get: function () { return threat_enrichment_kit_1.transformEnrichmentOutput; } });
Object.defineProperty(exports, "handleEnrichmentErrors", { enumerable: true, get: function () { return threat_enrichment_kit_1.handleEnrichmentErrors; } });
Object.defineProperty(exports, "enrichWithWHOIS", { enumerable: true, get: function () { return threat_enrichment_kit_1.enrichWithWHOIS; } });
Object.defineProperty(exports, "queryDomainWHOIS", { enumerable: true, get: function () { return threat_enrichment_kit_1.queryDomainWHOIS; } });
Object.defineProperty(exports, "parseWHOISResponse", { enumerable: true, get: function () { return threat_enrichment_kit_1.parseWHOISResponse; } });
Object.defineProperty(exports, "extractRegistrarInfo", { enumerable: true, get: function () { return threat_enrichment_kit_1.extractRegistrarInfo; } });
Object.defineProperty(exports, "trackWHOISHistory", { enumerable: true, get: function () { return threat_enrichment_kit_1.trackWHOISHistory; } });
Object.defineProperty(exports, "validateWHOISData", { enumerable: true, get: function () { return threat_enrichment_kit_1.validateWHOISData; } });
Object.defineProperty(exports, "enrichWithGeoIP", { enumerable: true, get: function () { return threat_enrichment_kit_1.enrichWithGeoIP; } });
Object.defineProperty(exports, "lookupIPGeolocation", { enumerable: true, get: function () { return threat_enrichment_kit_1.lookupIPGeolocation; } });
Object.defineProperty(exports, "queryASNInformation", { enumerable: true, get: function () { return threat_enrichment_kit_1.queryASNInformation; } });
Object.defineProperty(exports, "resolveNetworkRange", { enumerable: true, get: function () { return threat_enrichment_kit_1.resolveNetworkRange; } });
Object.defineProperty(exports, "cacheGeoIPData", { enumerable: true, get: function () { return threat_enrichment_kit_1.cacheGeoIPData; } });
Object.defineProperty(exports, "validateGeoIPResults", { enumerable: true, get: function () { return threat_enrichment_kit_1.validateGeoIPResults; } });
Object.defineProperty(exports, "enrichWithDNS", { enumerable: true, get: function () { return threat_enrichment_kit_1.enrichWithDNS; } });
Object.defineProperty(exports, "performReverseDNS", { enumerable: true, get: function () { return threat_enrichment_kit_1.performReverseDNS; } });
Object.defineProperty(exports, "queryPassiveDNS", { enumerable: true, get: function () { return threat_enrichment_kit_1.queryPassiveDNS; } });
Object.defineProperty(exports, "fetchDNSHistory", { enumerable: true, get: function () { return threat_enrichment_kit_1.fetchDNSHistory; } });
Object.defineProperty(exports, "resolveDNSRecords", { enumerable: true, get: function () { return threat_enrichment_kit_1.resolveDNSRecords; } });
Object.defineProperty(exports, "validateDNSData", { enumerable: true, get: function () { return threat_enrichment_kit_1.validateDNSData; } });
Object.defineProperty(exports, "cacheDNSResults", { enumerable: true, get: function () { return threat_enrichment_kit_1.cacheDNSResults; } });
Object.defineProperty(exports, "enrichWithSSLCertificate", { enumerable: true, get: function () { return threat_enrichment_kit_1.enrichWithSSLCertificate; } });
Object.defineProperty(exports, "parseSSLCertificate", { enumerable: true, get: function () { return threat_enrichment_kit_1.parseSSLCertificate; } });
Object.defineProperty(exports, "validateCertificateChain", { enumerable: true, get: function () { return threat_enrichment_kit_1.validateCertificateChain; } });
Object.defineProperty(exports, "extractCertificateFingerprint", { enumerable: true, get: function () { return threat_enrichment_kit_1.extractCertificateFingerprint; } });
Object.defineProperty(exports, "analyzeCertificateMetadata", { enumerable: true, get: function () { return threat_enrichment_kit_1.analyzeCertificateMetadata; } });
Object.defineProperty(exports, "integrateMultipleSources", { enumerable: true, get: function () { return threat_enrichment_kit_1.integrateMultipleSources; } });
Object.defineProperty(exports, "normalizeThreatIntelFeed", { enumerable: true, get: function () { return threat_enrichment_kit_1.normalizeThreatIntelFeed; } });
Object.defineProperty(exports, "aggregateThreatData", { enumerable: true, get: function () { return threat_enrichment_kit_1.aggregateThreatData; } });
Object.defineProperty(exports, "calculateReputationScore", { enumerable: true, get: function () { return threat_enrichment_kit_1.calculateReputationScore; } });
Object.defineProperty(exports, "prioritizeThreatSources", { enumerable: true, get: function () { return threat_enrichment_kit_1.prioritizeThreatSources; } });
Object.defineProperty(exports, "validateThreatIntelData", { enumerable: true, get: function () { return threat_enrichment_kit_1.validateThreatIntelData; } });
Object.defineProperty(exports, "createEnrichmentCache", { enumerable: true, get: function () { return threat_enrichment_kit_1.createEnrichmentCache; } });
Object.defineProperty(exports, "cacheEnrichmentResult", { enumerable: true, get: function () { return threat_enrichment_kit_1.cacheEnrichmentResult; } });
Object.defineProperty(exports, "retrieveCachedEnrichment", { enumerable: true, get: function () { return threat_enrichment_kit_1.retrieveCachedEnrichment; } });
Object.defineProperty(exports, "invalidateEnrichmentCache", { enumerable: true, get: function () { return threat_enrichment_kit_1.invalidateEnrichmentCache; } });
Object.defineProperty(exports, "optimizeCacheTTL", { enumerable: true, get: function () { return threat_enrichment_kit_1.optimizeCacheTTL; } });
Object.defineProperty(exports, "monitorCachePerformance", { enumerable: true, get: function () { return threat_enrichment_kit_1.monitorCachePerformance; } });
// Correlation Operations
var threat_correlation_kit_1 = require("../threat-correlation-kit");
Object.defineProperty(exports, "correlateThreatsByAttributes", { enumerable: true, get: function () { return threat_correlation_kit_1.correlateThreatsByAttributes; } });
Object.defineProperty(exports, "calculateWeightedCorrelation", { enumerable: true, get: function () { return threat_correlation_kit_1.calculateWeightedCorrelation; } });
Object.defineProperty(exports, "crossReferenceIOCs", { enumerable: true, get: function () { return threat_correlation_kit_1.crossReferenceIOCs; } });
Object.defineProperty(exports, "buildCorrelationMatrix", { enumerable: true, get: function () { return threat_correlation_kit_1.buildCorrelationMatrix; } });
Object.defineProperty(exports, "findCorrelationClusters", { enumerable: true, get: function () { return threat_correlation_kit_1.findCorrelationClusters; } });
Object.defineProperty(exports, "scoreCorrelationStrength", { enumerable: true, get: function () { return threat_correlation_kit_1.scoreCorrelationStrength; } });
Object.defineProperty(exports, "normalizeCorrelationData", { enumerable: true, get: function () { return threat_correlation_kit_1.normalizeCorrelationData; } });
Object.defineProperty(exports, "aggregateCorrelationResults", { enumerable: true, get: function () { return threat_correlation_kit_1.aggregateCorrelationResults; } });
Object.defineProperty(exports, "discoverIOCRelationships", { enumerable: true, get: function () { return threat_correlation_kit_1.discoverIOCRelationships; } });
Object.defineProperty(exports, "calculateRelationshipStrength", { enumerable: true, get: function () { return threat_correlation_kit_1.calculateRelationshipStrength; } });
Object.defineProperty(exports, "buildRelationshipGraph", { enumerable: true, get: function () { return threat_correlation_kit_1.buildRelationshipGraph; } });
Object.defineProperty(exports, "findConnectedIOCs", { enumerable: true, get: function () { return threat_correlation_kit_1.findConnectedIOCs; } });
Object.defineProperty(exports, "detectIOCClusters", { enumerable: true, get: function () { return threat_correlation_kit_1.detectIOCClusters; } });
Object.defineProperty(exports, "analyzeGraphConnectivity", { enumerable: true, get: function () { return threat_correlation_kit_1.analyzeGraphConnectivity; } });
Object.defineProperty(exports, "extractRelationshipPaths", { enumerable: true, get: function () { return threat_correlation_kit_1.extractRelationshipPaths; } });
Object.defineProperty(exports, "scoreRelationshipConfidence", { enumerable: true, get: function () { return threat_correlation_kit_1.scoreRelationshipConfidence; } });
Object.defineProperty(exports, "correlateByGeoLocation", { enumerable: true, get: function () { return threat_correlation_kit_1.correlateByGeoLocation; } });
Object.defineProperty(exports, "calculateGeoProximity", { enumerable: true, get: function () { return threat_correlation_kit_1.calculateGeoProximity; } });
Object.defineProperty(exports, "clusterByRegion", { enumerable: true, get: function () { return threat_correlation_kit_1.clusterByRegion; } });
Object.defineProperty(exports, "detectGeoAnomalies", { enumerable: true, get: function () { return threat_correlation_kit_1.detectGeoAnomalies; } });
Object.defineProperty(exports, "buildSpatialHeatmap", { enumerable: true, get: function () { return threat_correlation_kit_1.buildSpatialHeatmap; } });
Object.defineProperty(exports, "scoreGeoCorrelation", { enumerable: true, get: function () { return threat_correlation_kit_1.scoreGeoCorrelation; } });
Object.defineProperty(exports, "correlateBehaviorPatterns", { enumerable: true, get: function () { return threat_correlation_kit_1.correlateBehaviorPatterns; } });
Object.defineProperty(exports, "detectBehavioralAnomalies", { enumerable: true, get: function () { return threat_correlation_kit_1.detectBehavioralAnomalies; } });
Object.defineProperty(exports, "fingerprintThreatBehavior", { enumerable: true, get: function () { return threat_correlation_kit_1.fingerprintThreatBehavior; } });
Object.defineProperty(exports, "matchBehaviorSignatures", { enumerable: true, get: function () { return threat_correlation_kit_1.matchBehaviorSignatures; } });
Object.defineProperty(exports, "scoreBehaviorSimilarity", { enumerable: true, get: function () { return threat_correlation_kit_1.scoreBehaviorSimilarity; } });
Object.defineProperty(exports, "classifyThreatBehavior", { enumerable: true, get: function () { return threat_correlation_kit_1.classifyThreatBehavior; } });
Object.defineProperty(exports, "findShortestCorrelationPath", { enumerable: true, get: function () { return threat_correlation_kit_1.findShortestCorrelationPath; } });
Object.defineProperty(exports, "calculateCentralityMetrics", { enumerable: true, get: function () { return threat_correlation_kit_1.calculateCentralityMetrics; } });
Object.defineProperty(exports, "detectThreatCommunities", { enumerable: true, get: function () { return threat_correlation_kit_1.detectThreatCommunities; } });
Object.defineProperty(exports, "analyzeGraphDensity", { enumerable: true, get: function () { return threat_correlation_kit_1.analyzeGraphDensity; } });
Object.defineProperty(exports, "extractSubgraphs", { enumerable: true, get: function () { return threat_correlation_kit_1.extractSubgraphs; } });
Object.defineProperty(exports, "calculateCorrelationConfidence", { enumerable: true, get: function () { return threat_correlation_kit_1.calculateCorrelationConfidence; } });
Object.defineProperty(exports, "weightEvidenceSources", { enumerable: true, get: function () { return threat_correlation_kit_1.weightEvidenceSources; } });
Object.defineProperty(exports, "aggregateCorrelationConfidenceScores", { enumerable: true, get: function () { return threat_correlation_kit_1.aggregateConfidenceScores; } });
Object.defineProperty(exports, "calculateConfidenceInterval", { enumerable: true, get: function () { return threat_correlation_kit_1.calculateConfidenceInterval; } });
Object.defineProperty(exports, "normalizeConfidenceMetrics", { enumerable: true, get: function () { return threat_correlation_kit_1.normalizeConfidenceMetrics; } });
// Security Event Correlation
var security_event_correlation_kit_1 = require("../security-event-correlation-kit");
Object.defineProperty(exports, "correlateEventsInTimeWindow", { enumerable: true, get: function () { return security_event_correlation_kit_1.correlateEventsInTimeWindow; } });
Object.defineProperty(exports, "detectMultiStageAttacks", { enumerable: true, get: function () { return security_event_correlation_kit_1.detectMultiStageAttacks; } });
Object.defineProperty(exports, "aggregateEventsByDimensions", { enumerable: true, get: function () { return security_event_correlation_kit_1.aggregateEventsByDimensions; } });
Object.defineProperty(exports, "detectComplexEventPatterns", { enumerable: true, get: function () { return security_event_correlation_kit_1.detectComplexEventPatterns; } });
Object.defineProperty(exports, "detectEventBehavioralAnomalies", { enumerable: true, get: function () { return security_event_correlation_kit_1.detectBehavioralAnomalies; } });
Object.defineProperty(exports, "detectLateralMovement", { enumerable: true, get: function () { return security_event_correlation_kit_1.detectLateralMovement; } });
Object.defineProperty(exports, "detectPrivilegeEscalation", { enumerable: true, get: function () { return security_event_correlation_kit_1.detectPrivilegeEscalation; } });
Object.defineProperty(exports, "correlateAcrossDataSources", { enumerable: true, get: function () { return security_event_correlation_kit_1.correlateAcrossDataSources; } });
Object.defineProperty(exports, "detectDataExfiltration", { enumerable: true, get: function () { return security_event_correlation_kit_1.detectDataExfiltration; } });
Object.defineProperty(exports, "detectBruteForceAttacks", { enumerable: true, get: function () { return security_event_correlation_kit_1.detectBruteForceAttacks; } });
Object.defineProperty(exports, "detectC2Communication", { enumerable: true, get: function () { return security_event_correlation_kit_1.detectC2Communication; } });
Object.defineProperty(exports, "EventSeverity", { enumerable: true, get: function () { return security_event_correlation_kit_1.EventSeverity; } });
Object.defineProperty(exports, "AttackStage", { enumerable: true, get: function () { return security_event_correlation_kit_1.AttackStage; } });
// ============================================================================
// USAGE EXAMPLES & DOCUMENTATION
// ============================================================================
/**
 * EXAMPLE 1: Complete Intelligence Fusion Pipeline
 *
 * This example demonstrates a production-ready threat intelligence fusion pipeline that:
 * 1. Aggregates intelligence from multiple sources
 * 2. Normalizes and validates feed data
 * 3. Performs intelligent deduplication
 * 4. Enriches IOCs with WHOIS, GeoIP, DNS, SSL data
 * 5. Correlates across sources to build consensus
 * 6. Resolves conflicts with reliability weighting
 * 7. Generates comprehensive fusion reports
 *
 * ```typescript
 * import {
 *   aggregateMultipleIntelFeeds,
 *   normalizeIntelFeedFormat,
 *   deduplicateIntelligence,
 *   enrichFromMultipleSources,
 *   correlateAcrossSources,
 *   resolveConflictByReliability,
 *   generateFusionReport
 * } from '@/reuse/threat/composites/threat-intelligence-fusion-composite';
 *
 * async function runIntelligenceFusionPipeline() {
 *   // 1. Define intelligence feed sources
 *   const feedSources: IntelFeedSource[] = [
 *     {
 *       id: 'feed-commercial-1',
 *       name: 'Commercial Threat Feed A',
 *       provider: 'ThreatVendorA',
 *       feedType: IntelFeedType.COMMERCIAL,
 *       format: IntelFeedFormat.STIX_2_X,
 *       url: 'https://api.threatvendora.com/feed',
 *       priority: 9,
 *       reliability: 95,
 *       updateFrequency: 300000, // 5 minutes
 *       enabled: true,
 *       authentication: {
 *         type: 'api_key',
 *         credentials: { apiKey: process.env.THREAT_FEED_A_KEY }
 *       }
 *     },
 *     {
 *       id: 'feed-osint-1',
 *       name: 'Open Source Threat Feed',
 *       provider: 'OSINT Community',
 *       feedType: IntelFeedType.OPEN_SOURCE,
 *       format: IntelFeedFormat.JSON,
 *       url: 'https://feeds.osint.org/threats',
 *       priority: 6,
 *       reliability: 75,
 *       updateFrequency: 900000, // 15 minutes
 *       enabled: true
 *     },
 *     {
 *       id: 'feed-isac-health',
 *       name: 'Health-ISAC Threat Feed',
 *       provider: 'Health-ISAC',
 *       feedType: IntelFeedType.ISAC,
 *       format: IntelFeedFormat.STIX_2_X,
 *       url: 'https://sharing.health-isac.org/feed',
 *       priority: 10,
 *       reliability: 98,
 *       updateFrequency: 600000, // 10 minutes
 *       enabled: true,
 *       authentication: {
 *         type: 'certificate',
 *         credentials: { certPath: '/certs/health-isac.pem' }
 *       }
 *     }
 *   ];
 *
 *   // 2. Aggregate intelligence from all sources
 *   const aggregatedIntel = await aggregateMultipleIntelFeeds(feedSources);
 *   console.log(`Aggregated ${aggregatedIntel.length} intelligence items from ${feedSources.length} sources`);
 *
 *   // 3. Normalize feed formats to common schema
 *   const normalizedIntel = await Promise.all(
 *     aggregatedIntel.map(intel => normalizeIntelFeedFormat(intel, IntelFeedFormat.STIX_2_X))
 *   );
 *
 *   // 4. Perform intelligent deduplication
 *   const deduplicatedIntel = deduplicateIntelligence(normalizedIntel, {
 *     fuzzyThreshold: 0.85,
 *     fields: ['value', 'type'],
 *     timeWindow: 3600000 // 1 hour
 *   });
 *   console.log(`Removed ${normalizedIntel.length - deduplicatedIntel.length} duplicates`);
 *
 *   // 5. Enrich IOCs from multiple sources
 *   const enrichmentConfig: EnrichmentConfig = {
 *     sources: [
 *       { name: 'whois', type: 'whois', enabled: true, priority: 1 },
 *       { name: 'geoip', type: 'geoip', enabled: true, priority: 2 },
 *       { name: 'passive_dns', type: 'dns', enabled: true, priority: 3 },
 *       { name: 'ssl', type: 'ssl', enabled: true, priority: 4 },
 *       { name: 'reputation', type: 'reputation', enabled: true, priority: 5 }
 *     ],
 *     timeout: 5000,
 *     parallel: true,
 *     caching: {
 *       enabled: true,
 *       provider: 'redis',
 *       ttl: 3600
 *     }
 *   };
 *
 *   const enrichedIntel = await Promise.all(
 *     deduplicatedIntel.map(intel =>
 *       enrichFromMultipleSources(intel, enrichmentConfig)
 *     )
 *   );
 *
 *   // 6. Correlate intelligence across sources
 *   const correlations = await correlateAcrossSources(
 *     enrichedIntel,
 *     {
 *       dimensions: ['value', 'type', 'source', 'timestamp'],
 *       correlationWindow: 86400000, // 24 hours
 *       minimumSources: 2,
 *       confidenceThreshold: 0.7
 *     }
 *   );
 *
 *   // 7. Detect and resolve conflicts
 *   const conflicts = detectIntelConflicts(enrichedIntel);
 *   const resolvedIntel = conflicts.map(conflict =>
 *     resolveConflictByReliability(conflict.items, feedSources)
 *   );
 *
 *   // 8. Calculate multi-source confidence scores
 *   const finalIntel = resolvedIntel.map(intel => ({
 *     ...intel,
 *     confidence: calculateMultiSourceConfidence(
 *       intel.sources.map(s => ({
 *         confidence: s.confidence,
 *         reliability: feedSources.find(f => f.id === s.feedId)?.reliability || 50
 *       }))
 *     )
 *   }));
 *
 *   // 9. Generate comprehensive fusion report
 *   const fusionReport = generateFusionReport(
 *     finalIntel,
 *     feedSources,
 *     {
 *       includeMetrics: true,
 *       includeSourceBreakdown: true,
 *       includeQualityAnalysis: true,
 *       format: 'json'
 *     }
 *   );
 *
 *   console.log('Intelligence Fusion Complete:', {
 *     totalIntel: finalIntel.length,
 *     averageConfidence: fusionReport.averageConfidence,
 *     highQualityPercentage: fusionReport.highQualityPercentage,
 *     sourceAgreementRate: fusionReport.sourceAgreementRate
 *   });
 *
 *   return {
 *     intelligence: finalIntel,
 *     correlations,
 *     report: fusionReport
 *   };
 * }
 * ```
 */
/**
 * EXAMPLE 2: Comprehensive IOC Enrichment Pipeline
 *
 * ```typescript
 * async function enrichIOCComprehensively(ioc: string, iocType: IntelligenceType) {
 *   const enrichment: ComprehensiveIOCEnrichment = {
 *     ioc,
 *     iocType,
 *     reputationScore: 0,
 *     threatCategories: [],
 *     firstSeen: new Date(),
 *     lastSeen: new Date(),
 *     prevalence: 0,
 *     confidence: 0,
 *     sources: [],
 *     enrichmentTimestamp: new Date()
 *   };
 *
 *   try {
 *     // WHOIS enrichment for domains
 *     if (iocType === IntelligenceType.DOMAIN) {
 *       enrichment.whoisData = await enrichWithWHOIS(ioc);
 *       enrichment.sources.push('whois');
 *
 *       // Track WHOIS history
 *       await trackWHOISHistory(ioc, enrichment.whoisData);
 *     }
 *
 *     // GeoIP enrichment for IP addresses
 *     if (iocType === IntelligenceType.IP_ADDRESS) {
 *       enrichment.geoipData = await enrichWithGeoIP(ioc);
 *       enrichment.sources.push('geoip');
 *
 *       // Get ASN information
 *       const asnInfo = await queryASNInformation(ioc);
 *       if (enrichment.geoipData) {
 *         enrichment.geoipData.asn = asnInfo.asn as number;
 *         enrichment.geoipData.asnOrg = asnInfo.organization as string;
 *       }
 *     }
 *
 *     // DNS enrichment
 *     if (iocType === IntelligenceType.DOMAIN || iocType === IntelligenceType.IP_ADDRESS) {
 *       enrichment.dnsRecords = await enrichWithDNS(
 *         ioc,
 *         iocType === IntelligenceType.DOMAIN ? ['A', 'AAAA', 'MX', 'TXT'] : ['PTR']
 *       );
 *       enrichment.sources.push('dns');
 *
 *       // Passive DNS lookup
 *       enrichment.passiveDnsRecords = await queryPassiveDNS(
 *         ioc,
 *         { limit: 100, startDate: new Date(Date.now() - 7776000000) } // 90 days
 *       );
 *       enrichment.sources.push('passive_dns');
 *     }
 *
 *     // SSL certificate enrichment
 *     if (iocType === IntelligenceType.DOMAIN) {
 *       try {
 *         enrichment.sslCertificates = await enrichWithSSLCertificate(ioc, 443);
 *         enrichment.sources.push('ssl');
 *
 *         // Validate certificate chain
 *         if (enrichment.sslCertificates && enrichment.sslCertificates.length > 0) {
 *           const chainValid = validateCertificateChain(enrichment.sslCertificates);
 *           if (!chainValid) {
 *             enrichment.threatCategories.push('invalid_ssl_chain');
 *           }
 *         }
 *       } catch (error) {
 *         // SSL enrichment is optional
 *         console.warn(`SSL enrichment failed for ${ioc}:`, error);
 *       }
 *     }
 *
 *     // Calculate reputation score
 *     enrichment.reputationScore = calculateReputationScore(
 *       ioc,
 *       {
 *         whoisAge: enrichment.whoisData?.createdDate,
 *         geoLocation: enrichment.geoipData?.country,
 *         dnsRecordCount: enrichment.dnsRecords?.length || 0,
 *         sslValid: enrichment.sslCertificates && enrichment.sslCertificates.length > 0,
 *         passiveDnsCount: enrichment.passiveDnsRecords?.length || 0
 *       }
 *     );
 *
 *     // Integrate with threat intelligence feeds
 *     const threatIntel = await integrateMultipleSources(ioc, iocType);
 *     if (threatIntel) {
 *       enrichment.threatCategories.push(...threatIntel.categories);
 *       enrichment.associatedMalware = threatIntel.malwareFamilies;
 *       enrichment.associatedActors = threatIntel.threatActors;
 *       enrichment.confidence = threatIntel.confidence;
 *     }
 *
 *     // Cache enrichment results
 *     await cacheEnrichmentResult(
 *       ioc,
 *       enrichment,
 *       optimizeCacheTTL(enrichment as unknown as EnrichmentResult)
 *     );
 *
 *     return enrichment;
 *   } catch (error) {
 *     console.error(`Enrichment failed for ${ioc}:`, error);
 *     throw error;
 *   }
 * }
 * ```
 */
/**
 * EXAMPLE 3: Multi-Dimensional Threat Correlation
 *
 * ```typescript
 * async function performMultiDimensionalCorrelation(
 *   threatEvents: SecurityEvent[]
 * ): Promise<MultiDimensionalCorrelation[]> {
 *   const correlations: MultiDimensionalCorrelation[] = [];
 *
 *   // 1. Temporal correlation - find events in time proximity
 *   const temporalCorrelations = await correlateEventsInTimeWindow(
 *     threatEvents,
 *     {
 *       windowType: CorrelationWindow.SLIDING,
 *       duration: 3600000, // 1 hour
 *       unit: 'seconds',
 *       slideInterval: 300000 // 5 minutes
 *     },
 *     sequelize
 *   );
 *
 *   // 2. Spatial correlation - find events from similar locations
 *   const spatialCorrelations = await correlateByGeoLocation(
 *     threatEvents.map(e => ({
 *       id: e.id,
 *       location: extractGeoLocation(e.data),
 *       metadata: e.data
 *     })),
 *     { maxDistance: 100, unit: 'km' }
 *   );
 *
 *   // 3. Behavioral correlation - find similar attack patterns
 *   const behavioralCorrelations = await correlateBehaviorPatterns(
 *     threatEvents.map(e => ({
 *       id: e.id,
 *       behaviors: extractBehaviors(e.data),
 *       timestamp: e.timestamp
 *     })),
 *     { similarityThreshold: 0.75 }
 *   );
 *
 *   // 4. Infrastructure correlation - find related IOCs
 *   const iocs = extractIOCsFromEvents(threatEvents);
 *   const iocRelationships = await discoverIOCRelationships(
 *     iocs,
 *     { maxDepth: 3, minConfidence: 0.6 }
 *   );
 *   const relationshipGraph = buildRelationshipGraph(iocRelationships);
 *
 *   // 5. Cross-source correlation
 *   const crossSourceCorrelations = await correlateAcrossDataSources(
 *     threatEvents,
 *     ['siem', 'edr', 'firewall', 'ids'],
 *     sequelize
 *   );
 *
 *   // 6. Detect multi-stage attacks
 *   const multiStageAttacks = await detectMultiStageAttacks(
 *     threatEvents,
 *     {
 *       minStages: 2,
 *       maxTimeGapHours: 24,
 *       requireSequentialStages: false
 *     },
 *     sequelize
 *   );
 *
 *   // 7. Build comprehensive multi-dimensional correlations
 *   for (const attack of multiStageAttacks) {
 *     const entities: CorrelatedEntity[] = [];
 *     const dimensions: CorrelationDimension[] = [];
 *
 *     // Add temporal dimension
 *     const temporalScore = calculateTemporalCorrelationScore(attack.events);
 *     dimensions.push({
 *       name: 'temporal',
 *       type: 'temporal',
 *       score: temporalScore,
 *       weight: 0.3,
 *       details: { timeSpan: attack.timeSpan, eventSequence: attack.sequence }
 *     });
 *
 *     // Add spatial dimension
 *     const spatialScore = calculateSpatialCorrelationScore(attack.events);
 *     dimensions.push({
 *       name: 'spatial',
 *       type: 'spatial',
 *       score: spatialScore,
 *       weight: 0.2,
 *       details: { locations: attack.locations, clusters: attack.geoClusters }
 *     });
 *
 *     // Add behavioral dimension
 *     const behavioralScore = calculateBehavioralCorrelationScore(attack.events);
 *     dimensions.push({
 *       name: 'behavioral',
 *       type: 'behavioral',
 *       score: behavioralScore,
 *       weight: 0.3,
 *       details: { patterns: attack.patterns, signatures: attack.signatures }
 *     });
 *
 *     // Add infrastructure dimension
 *     const infrastructureScore = calculateInfrastructureCorrelationScore(attack.iocs);
 *     dimensions.push({
 *       name: 'infrastructure',
 *       type: 'infrastructural',
 *       score: infrastructureScore,
 *       weight: 0.2,
 *       details: { iocCount: attack.iocs.length, relationships: attack.iocRelationships }
 *     });
 *
 *     // Calculate overall correlation score
 *     const overallScore = dimensions.reduce(
 *       (sum, dim) => sum + (dim.score * dim.weight),
 *       0
 *     );
 *
 *     // Extract entities
 *     for (const ioc of attack.iocs) {
 *       entities.push({
 *         id: ioc.id,
 *         type: ioc.type as IntelligenceType,
 *         value: ioc.value,
 *         role: determineIOCRole(ioc, attack),
 *         confidence: ioc.confidence,
 *         evidence: ioc.evidence || []
 *       });
 *     }
 *
 *     correlations.push({
 *       correlationId: generateCorrelationId(),
 *       entities,
 *       dimensions,
 *       overallScore,
 *       confidence: calculateCorrelationConfidence(attack),
 *       attackNarrative: generateAttackNarrative(attack),
 *       mitreTactics: attack.mitreTactics,
 *       mitreStage: attack.attackStage,
 *       severity: attack.severity,
 *       createdAt: new Date()
 *     });
 *   }
 *
 *   return correlations;
 * }
 * ```
 */
/**
 * DATABASE SCHEMA NOTES
 * =====================
 *
 * The functions in this composite work with several Sequelize models:
 *
 * 1. FusedIntelligenceRecord
 *    - Stores fused intelligence from multiple sources
 *    - Indexes: normalized_value (hash), type, severity, confidence
 *    - Partitioning: By created_at (monthly)
 *    - Unique constraint: hash (for deduplication)
 *
 * 2. IntelFeedSourceMetadata
 *    - Tracks intelligence feed source configurations and reliability
 *    - Indexes: provider, feed_type, enabled
 *    - Includes reliability scoring and historical accuracy
 *
 * 3. EnrichmentCache
 *    - Caches enrichment results (WHOIS, GeoIP, DNS, SSL)
 *    - Indexes: ioc_hash, enrichment_type, created_at
 *    - TTL: Varies by enrichment type (1-24 hours)
 *    - Eviction: LRU policy with size limits
 *
 * 4. CorrelationGraph
 *    - Graph database representation of IOC relationships
 *    - Indexes: source_id, target_id, relationship_type
 *    - Supports graph traversal queries
 *
 * 5. ConflictResolutionLog
 *    - Audit trail for conflict resolution decisions
 *    - Indexes: resolution_timestamp, method, severity
 *    - Retention: 365 days (HIPAA compliance)
 *
 * 6. SourceReliabilityMetrics
 *    - Historical reliability tracking for intelligence sources
 *    - Indexes: source_id, updated_at
 *    - Aggregated metrics: accuracy, precision, recall, F1 score
 *
 * PERFORMANCE OPTIMIZATION
 * ========================
 *
 * 1. Caching Strategy
 *    - Redis cache for enrichment results (1-24 hour TTL)
 *    - In-memory cache for frequently accessed sources
 *    - Query result caching for correlation results
 *    - Cache warming for high-priority IOCs
 *
 * 2. Parallel Processing
 *    - Concurrent enrichment from multiple sources
 *    - Parallel deduplication with worker pools
 *    - Asynchronous correlation computation
 *    - Batch processing for large datasets
 *
 * 3. Database Optimization
 *    - Hash indexes for IOC lookups
 *    - Composite indexes for multi-field queries
 *    - Materialized views for complex correlations
 *    - Partitioning by timestamp for time-series data
 *
 * 4. API Rate Limiting
 *    - Token bucket algorithm for external API calls
 *    - Adaptive rate limiting based on response times
 *    - Request queuing and prioritization
 *    - Circuit breaker pattern for failing services
 *
 * HIPAA COMPLIANCE
 * ================
 *
 * 1. Data Privacy
 *    - PII redaction from threat intelligence
 *    - Anonymization of patient-related IOCs
 *    - Secure handling of healthcare-specific threats
 *
 * 2. Audit Trail
 *    - Complete audit log of all fusion operations
 *    - User attribution for manual conflict resolutions
 *    - Immutable audit records with cryptographic signatures
 *
 * 3. Access Control
 *    - RBAC for intelligence access levels
 *    - Need-to-know basis for sensitive intelligence
 *    - Multi-factor authentication for high-severity threats
 *
 * 4. Data Retention
 *    - 7-year retention for critical intelligence
 *    - Automated archival with encryption
 *    - Secure deletion with verification
 */
//# sourceMappingURL=threat-intelligence-fusion-composite.js.map