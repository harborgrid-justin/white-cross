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
export { aggregateMultipleIntelFeeds, normalizeIntelFeedFormat, validateIntelFeedSchema, mergeIntelFeeds, prioritizeIntelFeeds, filterIntelByRelevance, categorizeIntelData, transformIntelFormat, deduplicateIntelligence, fuzzyMatchIntelligence, canonicalizeIntelValue, detectDuplicatePatterns, mergeDuplicateIntel, correlateAcrossSources, findIntelOverlaps, calculateCorrelationScore, identifyIntelClusters, buildCorrelationGraph, analyzeSourceAgreement, calculateMultiSourceConfidence, weightSourceReliability, adjustConfidenceByAge, aggregateConfidenceScores, normalizeConfidenceRange, calculateSourceReliability, trackSourceAccuracy, updateReliabilityMetrics, rankIntelSources, detectIntelConflicts, resolveConflictByVoting, resolveConflictByReliability, flagUnresolvableConflicts, enrichFromMultipleSources, crossReferenceIntelligence, enhanceIntelMetadata, supplementMissingFields, generateFusionReport, analyzeFusionEffectiveness, trackFusionMetrics, visualizeFusionResults, type IntelFeedSource, type FusedIntelligence, type IntelSource, type ConflictResolution, type FusionMetadata, IntelFeedType, IntelFeedFormat, IntelligenceType, ThreatSeverity, getIntelFeedSourceModelAttributes, getFusedIntelligenceModelAttributes, getSourceReliabilityMetricsModelAttributes, getIntelCorrelationModelAttributes, } from '../threat-intelligence-fusion-kit';
export { createEnrichmentPipeline, orchestrateEnrichment, prioritizeEnrichmentSources, aggregateEnrichmentResults, validateEnrichmentData, mergeEnrichmentResults, transformEnrichmentOutput, handleEnrichmentErrors, enrichWithWHOIS, queryDomainWHOIS, parseWHOISResponse, extractRegistrarInfo, trackWHOISHistory, validateWHOISData, enrichWithGeoIP, lookupIPGeolocation, queryASNInformation, resolveNetworkRange, cacheGeoIPData, validateGeoIPResults, enrichWithDNS, performReverseDNS, queryPassiveDNS, fetchDNSHistory, resolveDNSRecords, validateDNSData, cacheDNSResults, enrichWithSSLCertificate, parseSSLCertificate, validateCertificateChain, extractCertificateFingerprint, analyzeCertificateMetadata, integrateMultipleSources, normalizeThreatIntelFeed, aggregateThreatData, calculateReputationScore, prioritizeThreatSources, validateThreatIntelData, createEnrichmentCache, cacheEnrichmentResult, retrieveCachedEnrichment, invalidateEnrichmentCache, optimizeCacheTTL, monitorCachePerformance, type EnrichmentConfig, type EnrichmentResult, type WHOISData, type GeoIPData, type DNSRecord, type PassiveDNSRecord, type SSLCertificate, } from '../threat-enrichment-kit';
export { correlateThreatsByAttributes, calculateWeightedCorrelation, crossReferenceIOCs, buildCorrelationMatrix, findCorrelationClusters, scoreCorrelationStrength, normalizeCorrelationData, aggregateCorrelationResults, discoverIOCRelationships, calculateRelationshipStrength, buildRelationshipGraph, findConnectedIOCs, detectIOCClusters, analyzeGraphConnectivity, extractRelationshipPaths, scoreRelationshipConfidence, correlateByGeoLocation, calculateGeoProximity, clusterByRegion, detectGeoAnomalies, buildSpatialHeatmap, scoreGeoCorrelation, correlateBehaviorPatterns, detectBehavioralAnomalies, fingerprintThreatBehavior, matchBehaviorSignatures, scoreBehaviorSimilarity, classifyThreatBehavior, findShortestCorrelationPath, calculateCentralityMetrics, detectThreatCommunities, analyzeGraphDensity, extractSubgraphs, calculateCorrelationConfidence, weightEvidenceSources, aggregateConfidenceScores as aggregateCorrelationConfidenceScores, calculateConfidenceInterval, normalizeConfidenceMetrics, type CorrelationConfig, type CorrelationResult, type IOCRelationship, type SpatialCorrelation, type GeoLocation, } from '../threat-correlation-kit';
export { correlateEventsInTimeWindow, detectMultiStageAttacks, aggregateEventsByDimensions, detectComplexEventPatterns, detectBehavioralAnomalies as detectEventBehavioralAnomalies, detectLateralMovement, detectPrivilegeEscalation, correlateAcrossDataSources, detectDataExfiltration, detectBruteForceAttacks, detectC2Communication, type SecurityEvent, type CorrelationResult as EventCorrelationResult, EventSeverity, AttackStage, } from '../security-event-correlation-kit';
/**
 * Comprehensive intelligence fusion configuration
 */
export interface IntelligenceFusionConfig {
    feedSources: IntelFeedSource[];
    enrichmentConfig: EnrichmentConfig;
    correlationConfig: CorrelationConfig;
    deduplicationStrategy: DeduplicationStrategy;
    conflictResolutionStrategy: ConflictResolutionStrategy;
    confidenceThreshold: number;
    enableRealTimeProcessing: boolean;
    cachingEnabled: boolean;
    qualityAssuranceEnabled: boolean;
}
/**
 * Deduplication strategy configuration
 */
export interface DeduplicationStrategy {
    algorithm: 'exact_match' | 'fuzzy_match' | 'content_hash' | 'ml_based';
    similarityThreshold?: number;
    fields: string[];
    timeWindow?: number;
    caseSensitive?: boolean;
}
/**
 * Conflict resolution strategy
 */
export interface ConflictResolutionStrategy {
    method: 'voting' | 'reliability_weighted' | 'latest_wins' | 'manual_review';
    minimumAgreementThreshold?: number;
    fallbackMethod?: string;
    escalationCriteria?: EscalationCriteria;
}
/**
 * Escalation criteria for unresolved conflicts
 */
export interface EscalationCriteria {
    severityThreshold: ThreatSeverity;
    confidenceDeltaThreshold: number;
    requiresHumanReview: boolean;
    notificationChannels: string[];
}
/**
 * Comprehensive fusion result
 */
export interface ComprehensiveFusionResult {
    fusedIntelligence: FusedIntelligence[];
    enrichmentResults: EnrichmentResult[];
    correlationResults: CorrelationResult[];
    deduplicationStats: DeduplicationStats;
    conflictResolutions: ConflictResolution[];
    qualityMetrics: QualityMetrics;
    processingMetadata: ProcessingMetadata;
}
/**
 * Deduplication statistics
 */
export interface DeduplicationStats {
    totalInputRecords: number;
    uniqueRecords: number;
    duplicatesRemoved: number;
    deduplicationRate: number;
    averageSimilarityScore: number;
    processingTimeMs: number;
}
/**
 * Quality metrics for fused intelligence
 */
export interface QualityMetrics {
    averageConfidence: number;
    highConfidencePercentage: number;
    sourceAgreementRate: number;
    conflictRate: number;
    enrichmentCoverage: number;
    dataCompleteness: number;
    timeliness: number;
    accuracy: number;
}
/**
 * Processing metadata
 */
export interface ProcessingMetadata {
    startTimestamp: Date;
    endTimestamp: Date;
    processingDurationMs: number;
    recordsProcessed: number;
    recordsPerSecond: number;
    feedsProcessed: number;
    enrichmentSourcesUsed: string[];
    errors: ProcessingError[];
    warnings: string[];
}
/**
 * Processing error details
 */
export interface ProcessingError {
    timestamp: Date;
    errorType: string;
    message: string;
    source?: string;
    recordId?: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    recoverable: boolean;
}
/**
 * Enrichment pipeline configuration
 */
export interface EnrichmentPipelineConfig {
    stages: EnrichmentStage[];
    parallel: boolean;
    timeout: number;
    retryPolicy: RetryPolicy;
    caching: CachingConfig;
    rateLimit?: RateLimitConfig;
}
/**
 * Individual enrichment stage
 */
export interface EnrichmentStage {
    id: string;
    name: string;
    type: 'whois' | 'geoip' | 'dns' | 'ssl' | 'reputation' | 'passive_dns';
    enabled: boolean;
    priority: number;
    timeout: number;
    required: boolean;
    apiConfig?: Record<string, any>;
}
/**
 * Retry policy for enrichment operations
 */
export interface RetryPolicy {
    maxRetries: number;
    retryDelayMs: number;
    exponentialBackoff: boolean;
    backoffMultiplier?: number;
    maxRetryDelayMs?: number;
}
/**
 * Caching configuration
 */
export interface CachingConfig {
    enabled: boolean;
    provider: 'redis' | 'memory' | 'database';
    ttl: number;
    maxSize?: number;
    evictionPolicy?: 'lru' | 'lfu' | 'fifo';
}
/**
 * Rate limiting configuration
 */
export interface RateLimitConfig {
    requestsPerSecond: number;
    burstSize: number;
    queueSize?: number;
    rejectOnLimit?: boolean;
}
/**
 * Multi-source intelligence consensus
 */
export interface IntelligenceConsensus {
    value: string;
    type: IntelligenceType;
    agreementLevel: number;
    sourceCount: number;
    agreedSources: string[];
    disagreedSources: string[];
    confidence: number;
    metadata: Record<string, any>;
}
/**
 * Source reliability tracking
 */
export interface SourceReliabilityTracking {
    sourceId: string;
    sourceName: string;
    reliability: number;
    accuracy: number;
    totalContributions: number;
    correctPredictions: number;
    falsePosives: number;
    falseNegatives: number;
    averageResponseTime: number;
    lastUpdated: Date;
    trend: 'improving' | 'stable' | 'declining';
}
/**
 * Intelligence fusion analytics
 */
export interface FusionAnalytics {
    timeRange: {
        start: Date;
        end: Date;
    };
    volumeMetrics: {
        totalIntelProcessed: number;
        uniqueIntelItems: number;
        duplicatesRemoved: number;
        conflictsDetected: number;
        conflictsResolved: number;
    };
    sourceMetrics: {
        activeFeeds: number;
        averageReliability: number;
        topPerformingSources: string[];
        underperformingSources: string[];
    };
    qualityMetrics: QualityMetrics;
    enrichmentMetrics: {
        enrichmentRate: number;
        averageEnrichmentTime: number;
        whoisCoverage: number;
        geoipCoverage: number;
        dnsCoverage: number;
        sslCoverage: number;
    };
    performanceMetrics: {
        averageProcessingTimeMs: number;
        throughput: number;
        cacheHitRate: number;
        errorRate: number;
    };
}
/**
 * IOC enrichment result with comprehensive data
 */
export interface ComprehensiveIOCEnrichment {
    ioc: string;
    iocType: IntelligenceType;
    whoisData?: WHOISData;
    geoipData?: GeoIPData;
    dnsRecords?: DNSRecord[];
    passiveDnsRecords?: PassiveDNSRecord[];
    sslCertificates?: SSLCertificate[];
    reputationScore: number;
    threatCategories: string[];
    associatedMalware?: string[];
    associatedActors?: string[];
    firstSeen: Date;
    lastSeen: Date;
    prevalence: number;
    confidence: number;
    sources: string[];
    enrichmentTimestamp: Date;
}
/**
 * Multi-dimensional correlation result
 */
export interface MultiDimensionalCorrelation {
    correlationId: string;
    entities: CorrelatedEntity[];
    dimensions: CorrelationDimension[];
    overallScore: number;
    confidence: number;
    attackNarrative?: string;
    mitreTactics?: string[];
    mitreStage?: AttackStage;
    severity: ThreatSeverity;
    createdAt: Date;
}
/**
 * Correlated entity in multi-dimensional analysis
 */
export interface CorrelatedEntity {
    id: string;
    type: IntelligenceType;
    value: string;
    role: 'attacker' | 'victim' | 'infrastructure' | 'tool' | 'unknown';
    confidence: number;
    evidence: Evidence[];
}
/**
 * Correlation dimension
 */
export interface CorrelationDimension {
    name: string;
    type: 'temporal' | 'spatial' | 'behavioral' | 'infrastructural';
    score: number;
    weight: number;
    details: Record<string, any>;
}
/**
 * Evidence for correlation
 */
export interface Evidence {
    source: string;
    type: string;
    timestamp: Date;
    data: Record<string, any>;
    reliability: number;
}
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
//# sourceMappingURL=threat-intelligence-fusion-composite.d.ts.map