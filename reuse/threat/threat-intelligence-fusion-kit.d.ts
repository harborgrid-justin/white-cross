/**
 * LOC: THREATINTFUSION001
 * File: /reuse/threat/threat-intelligence-fusion-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize
 *   - crypto (Node.js built-in)
 *
 * DOWNSTREAM (imported by):
 *   - Threat intelligence fusion services
 *   - Multi-source intelligence aggregation modules
 *   - Intelligence correlation services
 *   - Threat intelligence quality assurance services
 *   - Security orchestration platforms
 */
/**
 * Intelligence feed source configuration
 */
export interface IntelFeedSource {
    id: string;
    name: string;
    provider: string;
    feedType: IntelFeedType;
    format: IntelFeedFormat;
    url: string;
    priority: number;
    reliability: number;
    updateFrequency: number;
    enabled: boolean;
    authentication?: {
        type: 'api_key' | 'basic' | 'oauth2' | 'certificate' | 'none';
        credentials?: Record<string, any>;
    };
    metadata?: Record<string, any>;
}
/**
 * Intelligence feed types
 */
export declare enum IntelFeedType {
    COMMERCIAL = "COMMERCIAL",
    OPEN_SOURCE = "OPEN_SOURCE",
    ISAC = "ISAC",// Information Sharing and Analysis Center
    INTERNAL = "INTERNAL",
    GOVERNMENT = "GOVERNMENT",
    COMMUNITY = "COMMUNITY",
    VENDOR = "VENDOR"
}
/**
 * Intelligence feed formats
 */
export declare enum IntelFeedFormat {
    STIX_1_X = "STIX_1_X",
    STIX_2_X = "STIX_2_X",
    JSON = "JSON",
    XML = "XML",
    CSV = "CSV",
    TAXII = "TAXII",
    MISP = "MISP",
    OPENIOC = "OPENIOC",
    CUSTOM = "CUSTOM"
}
/**
 * Fused intelligence item with multi-source metadata
 */
export interface FusedIntelligence {
    id: string;
    type: IntelligenceType;
    value: string;
    normalizedValue: string;
    hash: string;
    severity: ThreatSeverity;
    confidence: number;
    sources: IntelSource[];
    firstSeen: Date;
    lastSeen: Date;
    expiresAt?: Date;
    tags: string[];
    correlatedItems?: string[];
    conflictResolution?: ConflictResolution;
    enrichment: IntelEnrichment;
    metadata: Record<string, any>;
    fusionMetadata: FusionMetadata;
}
/**
 * Intelligence types
 */
export declare enum IntelligenceType {
    IP_ADDRESS = "IP_ADDRESS",
    DOMAIN = "DOMAIN",
    URL = "URL",
    EMAIL = "EMAIL",
    FILE_HASH = "FILE_HASH",
    CVE = "CVE",
    MALWARE_FAMILY = "MALWARE_FAMILY",
    THREAT_ACTOR = "THREAT_ACTOR",
    ATTACK_PATTERN = "ATTACK_PATTERN",
    CAMPAIGN = "CAMPAIGN",
    INDICATOR = "INDICATOR"
}
/**
 * Threat severity levels
 */
export declare enum ThreatSeverity {
    CRITICAL = "CRITICAL",
    HIGH = "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "LOW",
    INFO = "INFO"
}
/**
 * Individual intelligence source reference
 */
export interface IntelSource {
    feedId: string;
    feedName: string;
    provider: string;
    reliability: number;
    confidence: number;
    timestamp: Date;
    rawData?: any;
}
/**
 * Conflict resolution details when sources disagree
 */
export interface ConflictResolution {
    conflictType: 'severity' | 'confidence' | 'metadata' | 'expiration';
    conflictingValues: Array<{
        feedId: string;
        value: any;
    }>;
    resolutionMethod: 'voting' | 'reliability_weighted' | 'newest' | 'manual';
    resolvedValue: any;
    resolvedAt: Date;
    confidence: number;
}
/**
 * Intelligence enrichment data from multiple sources
 */
export interface IntelEnrichment {
    geolocation?: {
        country?: string;
        city?: string;
        latitude?: number;
        longitude?: number;
        sources: string[];
    };
    whois?: {
        registrar?: string;
        registrationDate?: Date;
        expirationDate?: Date;
        sources: string[];
    };
    threatContext?: {
        malwareFamilies?: string[];
        threatActors?: string[];
        campaigns?: string[];
        sources: string[];
    };
    reputation?: {
        score: number;
        category?: string;
        sources: string[];
    };
    relatedIndicators?: Array<{
        type: IntelligenceType;
        value: string;
        relationship: string;
        sources: string[];
    }>;
}
/**
 * Fusion-specific metadata
 */
export interface FusionMetadata {
    fusionId: string;
    fusionTimestamp: Date;
    sourceCount: number;
    agreementScore: number;
    deduplicationMethod?: 'exact' | 'fuzzy' | 'canonical';
    correlationScore?: number;
    qualityScore: number;
    processingVersion: string;
}
/**
 * Intelligence correlation result
 */
export interface IntelCorrelation {
    primaryId: string;
    relatedId: string;
    correlationType: CorrelationType;
    correlationScore: number;
    sharedSources: string[];
    temporalProximity: number;
    metadata?: Record<string, any>;
}
/**
 * Correlation types
 */
export declare enum CorrelationType {
    SAME_CAMPAIGN = "SAME_CAMPAIGN",
    SAME_ACTOR = "SAME_ACTOR",
    TEMPORAL = "TEMPORAL",
    BEHAVIORAL = "BEHAVIORAL",
    INFRASTRUCTURE = "INFRASTRUCTURE",
    MALWARE_FAMILY = "MALWARE_FAMILY",
    TARGET_SIMILARITY = "TARGET_SIMILARITY"
}
/**
 * Source reliability metrics
 */
export interface SourceReliabilityMetrics {
    feedId: string;
    feedName: string;
    totalSubmissions: number;
    confirmedTruePositives: number;
    confirmedFalsePositives: number;
    unconfirmed: number;
    averageAge: number;
    timeliness: number;
    accuracy: number;
    coverage: number;
    overallReliability: number;
    lastUpdated: Date;
    history: Array<{
        date: Date;
        accuracy: number;
        reliability: number;
    }>;
}
/**
 * Fusion analytics report
 */
export interface FusionReport {
    reportId: string;
    generatedAt: Date;
    timeRange: {
        start: Date;
        end: Date;
    };
    summary: {
        totalIntelligence: number;
        fusedItems: number;
        deduplicationRate: number;
        averageSourcesPerItem: number;
        averageConfidence: number;
        averageQualityScore: number;
    };
    sourceMetrics: Array<{
        feedId: string;
        feedName: string;
        contributedItems: number;
        reliability: number;
        agreementRate: number;
    }>;
    correlations: {
        totalCorrelations: number;
        byType: Record<CorrelationType, number>;
        strongCorrelations: number;
    };
    conflicts: {
        total: number;
        resolved: number;
        unresolved: number;
        byType: Record<string, number>;
    };
    qualityMetrics: {
        highQuality: number;
        mediumQuality: number;
        lowQuality: number;
    };
}
/**
 * Deduplication result
 */
export interface DeduplicationResult {
    originalCount: number;
    deduplicatedCount: number;
    removedDuplicates: number;
    deduplicationRate: number;
    method: 'exact' | 'fuzzy' | 'canonical';
    clusters: Array<{
        canonicalId: string;
        duplicateIds: string[];
        mergedSources: number;
    }>;
}
/**
 * Sequelize IntelFeedSource model attributes for feed source management.
 *
 * @example
 * ```typescript
 * class IntelFeedSource extends Model {}
 * IntelFeedSource.init(getIntelFeedSourceModelAttributes(), {
 *   sequelize,
 *   tableName: 'intel_feed_sources',
 *   timestamps: true
 * });
 * ```
 */
export declare const getIntelFeedSourceModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    name: {
        type: string;
        allowNull: boolean;
        unique: boolean;
    };
    provider: {
        type: string;
        allowNull: boolean;
    };
    feedType: {
        type: string;
        allowNull: boolean;
    };
    format: {
        type: string;
        allowNull: boolean;
    };
    url: {
        type: string;
        allowNull: boolean;
    };
    priority: {
        type: string;
        allowNull: boolean;
        defaultValue: number;
        validate: {
            min: number;
            max: number;
        };
    };
    reliability: {
        type: string;
        allowNull: boolean;
        defaultValue: number;
        validate: {
            min: number;
            max: number;
        };
    };
    updateFrequency: {
        type: string;
        allowNull: boolean;
        defaultValue: number;
    };
    enabled: {
        type: string;
        defaultValue: boolean;
    };
    authentication: {
        type: string;
        allowNull: boolean;
    };
    metadata: {
        type: string;
        defaultValue: {};
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
    updatedAt: {
        type: string;
        allowNull: boolean;
    };
};
/**
 * Sequelize FusedIntelligence model attributes for fused intelligence storage.
 *
 * @example
 * ```typescript
 * class FusedIntelligence extends Model {}
 * FusedIntelligence.init(getFusedIntelligenceModelAttributes(), {
 *   sequelize,
 *   tableName: 'fused_intelligence',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['hash'] },
 *     { fields: ['type'] },
 *     { fields: ['severity'] }
 *   ]
 * });
 * ```
 */
export declare const getFusedIntelligenceModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    type: {
        type: string;
        allowNull: boolean;
    };
    value: {
        type: string;
        allowNull: boolean;
    };
    normalizedValue: {
        type: string;
        allowNull: boolean;
    };
    hash: {
        type: string;
        allowNull: boolean;
        unique: boolean;
    };
    severity: {
        type: string;
        allowNull: boolean;
    };
    confidence: {
        type: string;
        allowNull: boolean;
        validate: {
            min: number;
            max: number;
        };
    };
    sources: {
        type: string;
        allowNull: boolean;
        defaultValue: never[];
    };
    firstSeen: {
        type: string;
        allowNull: boolean;
    };
    lastSeen: {
        type: string;
        allowNull: boolean;
    };
    expiresAt: {
        type: string;
        allowNull: boolean;
    };
    tags: {
        type: string;
        defaultValue: never[];
    };
    correlatedItems: {
        type: string;
        defaultValue: never[];
    };
    conflictResolution: {
        type: string;
        allowNull: boolean;
    };
    enrichment: {
        type: string;
        defaultValue: {};
    };
    metadata: {
        type: string;
        defaultValue: {};
    };
    fusionMetadata: {
        type: string;
        allowNull: boolean;
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
    updatedAt: {
        type: string;
        allowNull: boolean;
    };
};
/**
 * Sequelize SourceReliabilityMetrics model attributes.
 *
 * @example
 * ```typescript
 * class SourceReliabilityMetrics extends Model {}
 * SourceReliabilityMetrics.init(getSourceReliabilityMetricsModelAttributes(), {
 *   sequelize,
 *   tableName: 'source_reliability_metrics',
 *   timestamps: true
 * });
 * ```
 */
export declare const getSourceReliabilityMetricsModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    feedId: {
        type: string;
        allowNull: boolean;
        unique: boolean;
    };
    feedName: {
        type: string;
        allowNull: boolean;
    };
    totalSubmissions: {
        type: string;
        defaultValue: number;
    };
    confirmedTruePositives: {
        type: string;
        defaultValue: number;
    };
    confirmedFalsePositives: {
        type: string;
        defaultValue: number;
    };
    unconfirmed: {
        type: string;
        defaultValue: number;
    };
    averageAge: {
        type: string;
        defaultValue: number;
    };
    timeliness: {
        type: string;
        defaultValue: number;
    };
    accuracy: {
        type: string;
        defaultValue: number;
    };
    coverage: {
        type: string;
        defaultValue: number;
    };
    overallReliability: {
        type: string;
        defaultValue: number;
    };
    lastUpdated: {
        type: string;
        allowNull: boolean;
    };
    history: {
        type: string;
        defaultValue: never[];
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
    updatedAt: {
        type: string;
        allowNull: boolean;
    };
};
/**
 * Sequelize IntelCorrelation model attributes.
 *
 * @example
 * ```typescript
 * class IntelCorrelation extends Model {}
 * IntelCorrelation.init(getIntelCorrelationModelAttributes(), {
 *   sequelize,
 *   tableName: 'intel_correlations',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['primaryId'] },
 *     { fields: ['relatedId'] },
 *     { fields: ['correlationType'] }
 *   ]
 * });
 * ```
 */
export declare const getIntelCorrelationModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    primaryId: {
        type: string;
        allowNull: boolean;
    };
    relatedId: {
        type: string;
        allowNull: boolean;
    };
    correlationType: {
        type: string;
        allowNull: boolean;
    };
    correlationScore: {
        type: string;
        allowNull: boolean;
        validate: {
            min: number;
            max: number;
        };
    };
    sharedSources: {
        type: string;
        defaultValue: never[];
    };
    temporalProximity: {
        type: string;
        allowNull: boolean;
    };
    metadata: {
        type: string;
        defaultValue: {};
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
    updatedAt: {
        type: string;
        allowNull: boolean;
    };
};
/**
 * Aggregates threat intelligence from multiple feeds with intelligent merging.
 *
 * @param {IntelFeedSource[]} feeds - Array of intelligence feed sources
 * @param {object} [options] - Aggregation options
 * @returns {Promise<FusedIntelligence[]>} Aggregated and fused intelligence items
 *
 * @example
 * ```typescript
 * const feeds = [
 *   { id: 'feed1', name: 'AlienVault OTX', provider: 'alienvault', feedType: IntelFeedType.COMMERCIAL, ... },
 *   { id: 'feed2', name: 'MISP', provider: 'misp', feedType: IntelFeedType.OPEN_SOURCE, ... }
 * ];
 * const fusedIntel = await aggregateMultipleIntelFeeds(feeds, { deduplication: true, minConfidence: 50 });
 * ```
 */
export declare const aggregateMultipleIntelFeeds: (feeds: IntelFeedSource[], options?: {
    deduplication?: boolean;
    minConfidence?: number;
    maxAge?: number;
    enableEnrichment?: boolean;
}) => Promise<FusedIntelligence[]>;
/**
 * Normalizes intelligence feed data from different formats into standard structure.
 *
 * @param {any} rawData - Raw intelligence data from feed
 * @param {IntelFeedFormat} format - Format of the intelligence feed
 * @returns {Promise<any[]>} Normalized intelligence items
 *
 * @example
 * ```typescript
 * const rawSTIX = fetchedSTIXData;
 * const normalized = await normalizeIntelFeedFormat(rawSTIX, IntelFeedFormat.STIX_2_X);
 * ```
 */
export declare const normalizeIntelFeedFormat: (rawData: any, format: IntelFeedFormat) => Promise<any[]>;
/**
 * Validates intelligence feed data against expected schema.
 *
 * @param {any} data - Intelligence data to validate
 * @param {IntelFeedFormat} format - Expected format
 * @returns {Promise<{ valid: boolean; errors: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateIntelFeedSchema(feedData, IntelFeedFormat.STIX_2_X);
 * if (!validation.valid) {
 *   console.error('Validation errors:', validation.errors);
 * }
 * ```
 */
export declare const validateIntelFeedSchema: (data: any, format: IntelFeedFormat) => Promise<{
    valid: boolean;
    errors: string[];
}>;
/**
 * Merges multiple intelligence feeds into a unified dataset.
 *
 * @param {FusedIntelligence[]} feeds - Array of intelligence datasets to merge
 * @param {object} [options] - Merge options
 * @returns {Promise<FusedIntelligence[]>} Merged intelligence
 *
 * @example
 * ```typescript
 * const merged = await mergeIntelFeeds([feed1Data, feed2Data, feed3Data], {
 *   conflictResolution: 'reliability_weighted'
 * });
 * ```
 */
export declare const mergeIntelFeeds: (feeds: FusedIntelligence[][], options?: {
    conflictResolution?: "voting" | "reliability_weighted" | "newest";
    preserveAll?: boolean;
}) => Promise<FusedIntelligence[]>;
/**
 * Prioritizes intelligence feeds based on reliability scores.
 *
 * @param {IntelFeedSource[]} feeds - Array of feed sources
 * @param {SourceReliabilityMetrics[]} metrics - Reliability metrics for feeds
 * @returns {IntelFeedSource[]} Prioritized feeds
 *
 * @example
 * ```typescript
 * const prioritized = prioritizeIntelFeeds(allFeeds, reliabilityMetrics);
 * // Process feeds in priority order
 * for (const feed of prioritized) {
 *   await processFeed(feed);
 * }
 * ```
 */
export declare const prioritizeIntelFeeds: (feeds: IntelFeedSource[], metrics: SourceReliabilityMetrics[]) => IntelFeedSource[];
/**
 * Filters intelligence data by relevance criteria.
 *
 * @param {FusedIntelligence[]} intelligence - Intelligence items to filter
 * @param {object} criteria - Relevance criteria
 * @returns {FusedIntelligence[]} Filtered intelligence
 *
 * @example
 * ```typescript
 * const relevant = filterIntelByRelevance(allIntel, {
 *   types: [IntelligenceType.IP_ADDRESS, IntelligenceType.DOMAIN],
 *   minSeverity: ThreatSeverity.MEDIUM,
 *   tags: ['healthcare', 'ransomware']
 * });
 * ```
 */
export declare const filterIntelByRelevance: (intelligence: FusedIntelligence[], criteria: {
    types?: IntelligenceType[];
    severities?: ThreatSeverity[];
    minConfidence?: number;
    tags?: string[];
    dateRange?: {
        start: Date;
        end: Date;
    };
}) => FusedIntelligence[];
/**
 * Categorizes intelligence data into predefined categories.
 *
 * @param {FusedIntelligence[]} intelligence - Intelligence items to categorize
 * @returns {Record<string, FusedIntelligence[]>} Categorized intelligence
 *
 * @example
 * ```typescript
 * const categorized = categorizeIntelData(fusedIntel);
 * console.log('Network indicators:', categorized.network.length);
 * console.log('Malware indicators:', categorized.malware.length);
 * ```
 */
export declare const categorizeIntelData: (intelligence: FusedIntelligence[]) => Record<string, FusedIntelligence[]>;
/**
 * Transforms intelligence between different standard formats.
 *
 * @param {any} data - Intelligence data to transform
 * @param {IntelFeedFormat} fromFormat - Source format
 * @param {IntelFeedFormat} toFormat - Target format
 * @returns {Promise<any>} Transformed intelligence data
 *
 * @example
 * ```typescript
 * const stixData = await transformIntelFormat(mispData, IntelFeedFormat.MISP, IntelFeedFormat.STIX_2_X);
 * ```
 */
export declare const transformIntelFormat: (data: any, fromFormat: IntelFeedFormat, toFormat: IntelFeedFormat) => Promise<any>;
/**
 * Removes duplicate intelligence items using multiple deduplication strategies.
 *
 * @param {FusedIntelligence[]} intelligence - Intelligence items to deduplicate
 * @param {object} [options] - Deduplication options
 * @returns {DeduplicationResult} Deduplication results
 *
 * @example
 * ```typescript
 * const result = deduplicateIntelligence(allIntel, {
 *   method: 'fuzzy',
 *   threshold: 0.85
 * });
 * console.log(`Removed ${result.removedDuplicates} duplicates`);
 * ```
 */
export declare const deduplicateIntelligence: (intelligence: FusedIntelligence[], options?: {
    method?: "exact" | "fuzzy" | "canonical";
    threshold?: number;
}) => DeduplicationResult;
/**
 * Performs fuzzy matching to identify similar intelligence items.
 *
 * @param {FusedIntelligence} item - Intelligence item to match
 * @param {FusedIntelligence[]} candidates - Candidate items for matching
 * @param {number} [threshold=0.8] - Similarity threshold (0-1)
 * @returns {string | null} Matching item ID or null
 *
 * @example
 * ```typescript
 * const matchKey = fuzzyMatchIntelligence(newItem, existingItems, 0.85);
 * if (matchKey) {
 *   console.log('Found similar item:', matchKey);
 * }
 * ```
 */
export declare const fuzzyMatchIntelligence: (item: FusedIntelligence, candidates: FusedIntelligence[], threshold?: number) => string | null;
/**
 * Canonicalizes intelligence values into normalized form for deduplication.
 *
 * @param {IntelligenceType} type - Type of intelligence
 * @param {string} value - Raw intelligence value
 * @returns {string} Canonicalized value
 *
 * @example
 * ```typescript
 * const canonical1 = canonicalizeIntelValue(IntelligenceType.DOMAIN, 'EXAMPLE.COM');
 * const canonical2 = canonicalizeIntelValue(IntelligenceType.DOMAIN, 'example.com');
 * // Both return 'example.com'
 * ```
 */
export declare const canonicalizeIntelValue: (type: IntelligenceType, value: string) => string;
/**
 * Detects duplicate patterns across intelligence items.
 *
 * @param {FusedIntelligence[]} intelligence - Intelligence items to analyze
 * @returns {Array<{ pattern: string; count: number; items: string[] }>} Detected patterns
 *
 * @example
 * ```typescript
 * const patterns = detectDuplicatePatterns(allIntel);
 * patterns.forEach(p => {
 *   console.log(`Pattern ${p.pattern} found ${p.count} times`);
 * });
 * ```
 */
export declare const detectDuplicatePatterns: (intelligence: FusedIntelligence[]) => Array<{
    pattern: string;
    count: number;
    items: string[];
}>;
/**
 * Merges duplicate intelligence entries into a single unified entry.
 *
 * @param {FusedIntelligence[]} duplicates - Duplicate intelligence items to merge
 * @returns {FusedIntelligence} Merged intelligence item
 *
 * @example
 * ```typescript
 * const merged = mergeDuplicateIntel([item1, item2, item3]);
 * console.log(`Merged ${merged.sources.length} sources`);
 * ```
 */
export declare const mergeDuplicateIntel: (duplicates: FusedIntelligence[]) => FusedIntelligence;
/**
 * Correlates intelligence items across multiple sources to identify relationships.
 *
 * @param {FusedIntelligence[]} intelligence - Intelligence items to correlate
 * @param {object} [options] - Correlation options
 * @returns {IntelCorrelation[]} Correlation results
 *
 * @example
 * ```typescript
 * const correlations = correlateAcrossSources(fusedIntel, {
 *   minScore: 70,
 *   types: [CorrelationType.SAME_CAMPAIGN, CorrelationType.INFRASTRUCTURE]
 * });
 * ```
 */
export declare const correlateAcrossSources: (intelligence: FusedIntelligence[], options?: {
    minScore?: number;
    types?: CorrelationType[];
    temporalWindow?: number;
}) => IntelCorrelation[];
/**
 * Finds overlapping intelligence between different sources.
 *
 * @param {IntelFeedSource[]} feeds - Feed sources to compare
 * @param {FusedIntelligence[]} intelligence - Intelligence items
 * @returns {Array<{ feed1: string; feed2: string; overlapCount: number; overlapPercentage: number }>} Overlap analysis
 *
 * @example
 * ```typescript
 * const overlaps = findIntelOverlaps(feeds, fusedIntel);
 * overlaps.forEach(o => {
 *   console.log(`${o.feed1} and ${o.feed2}: ${o.overlapPercentage}% overlap`);
 * });
 * ```
 */
export declare const findIntelOverlaps: (feeds: IntelFeedSource[], intelligence: FusedIntelligence[]) => Array<{
    feed1: string;
    feed2: string;
    overlapCount: number;
    overlapPercentage: number;
}>;
/**
 * Calculates correlation strength score between intelligence items.
 *
 * @param {FusedIntelligence} item1 - First intelligence item
 * @param {FusedIntelligence} item2 - Second intelligence item
 * @returns {number} Correlation score (0-100)
 *
 * @example
 * ```typescript
 * const score = calculateCorrelationScore(intel1, intel2);
 * if (score > 80) {
 *   console.log('Strong correlation detected');
 * }
 * ```
 */
export declare const calculateCorrelationScore: (item1: FusedIntelligence, item2: FusedIntelligence) => number;
/**
 * Identifies clusters of related intelligence items.
 *
 * @param {FusedIntelligence[]} intelligence - Intelligence items to cluster
 * @param {number} [minCorrelation=70] - Minimum correlation score for clustering
 * @returns {Array<{ clusterId: string; items: string[]; avgCorrelation: number }>} Intelligence clusters
 *
 * @example
 * ```typescript
 * const clusters = identifyIntelClusters(fusedIntel, 75);
 * console.log(`Found ${clusters.length} intelligence clusters`);
 * ```
 */
export declare const identifyIntelClusters: (intelligence: FusedIntelligence[], minCorrelation?: number) => Array<{
    clusterId: string;
    items: string[];
    avgCorrelation: number;
}>;
/**
 * Builds a correlation graph showing relationships between intelligence items.
 *
 * @param {FusedIntelligence[]} intelligence - Intelligence items
 * @param {IntelCorrelation[]} correlations - Correlation relationships
 * @returns {{ nodes: any[]; edges: any[] }} Graph structure
 *
 * @example
 * ```typescript
 * const graph = buildCorrelationGraph(fusedIntel, correlations);
 * // Use graph for visualization or graph analysis algorithms
 * ```
 */
export declare const buildCorrelationGraph: (intelligence: FusedIntelligence[], correlations: IntelCorrelation[]) => {
    nodes: any[];
    edges: any[];
};
/**
 * Analyzes agreement levels between different intelligence sources.
 *
 * @param {FusedIntelligence[]} intelligence - Intelligence items to analyze
 * @returns {Array<{ feedId: string; feedName: string; agreementRate: number; conflicts: number }>} Source agreement analysis
 *
 * @example
 * ```typescript
 * const agreement = analyzeSourceAgreement(fusedIntel);
 * agreement.forEach(a => {
 *   console.log(`${a.feedName}: ${a.agreementRate}% agreement rate`);
 * });
 * ```
 */
export declare const analyzeSourceAgreement: (intelligence: FusedIntelligence[]) => Array<{
    feedId: string;
    feedName: string;
    agreementRate: number;
    conflicts: number;
}>;
/**
 * Calculates confidence score from multiple intelligence sources.
 *
 * @param {IntelSource[]} sources - Intelligence sources for an item
 * @param {SourceReliabilityMetrics[]} reliabilityMetrics - Source reliability data
 * @returns {number} Fused confidence score (0-100)
 *
 * @example
 * ```typescript
 * const confidence = calculateMultiSourceConfidence(item.sources, reliabilityMetrics);
 * console.log(`Fused confidence: ${confidence}%`);
 * ```
 */
export declare const calculateMultiSourceConfidence: (sources: IntelSource[], reliabilityMetrics: SourceReliabilityMetrics[]) => number;
/**
 * Weights confidence scores by source reliability.
 *
 * @param {number} confidence - Original confidence score
 * @param {number} reliability - Source reliability score (0-100)
 * @returns {number} Weighted confidence score
 *
 * @example
 * ```typescript
 * const weighted = weightSourceReliability(75, 90);
 * // Returns confidence adjusted by source reliability
 * ```
 */
export declare const weightSourceReliability: (confidence: number, reliability: number) => number;
/**
 * Adjusts confidence score based on intelligence age.
 *
 * @param {number} confidence - Current confidence score
 * @param {Date} lastSeen - Last seen timestamp
 * @param {object} [options] - Adjustment options
 * @returns {number} Age-adjusted confidence score
 *
 * @example
 * ```typescript
 * const adjusted = adjustConfidenceByAge(80, lastSeenDate, { halfLife: 30 });
 * // Confidence decreases over time
 * ```
 */
export declare const adjustConfidenceByAge: (confidence: number, lastSeen: Date, options?: {
    halfLife?: number;
    maxAge?: number;
}) => number;
/**
 * Aggregates multiple confidence scores using various methods.
 *
 * @param {number[]} scores - Array of confidence scores
 * @param {string} [method='weighted_average'] - Aggregation method
 * @returns {number} Aggregated confidence score
 *
 * @example
 * ```typescript
 * const scores = [75, 80, 90, 70];
 * const avg = aggregateConfidenceScores(scores, 'average');
 * const max = aggregateConfidenceScores(scores, 'max');
 * ```
 */
export declare const aggregateConfidenceScores: (scores: number[], method?: "average" | "weighted_average" | "max" | "min" | "median") => number;
/**
 * Normalizes confidence scores to a standard range.
 *
 * @param {number} confidence - Raw confidence score
 * @param {object} [options] - Normalization options
 * @returns {number} Normalized confidence score (0-100)
 *
 * @example
 * ```typescript
 * const normalized = normalizeConfidenceRange(150, { min: 0, max: 200 });
 * // Returns 75
 * ```
 */
export declare const normalizeConfidenceRange: (confidence: number, options?: {
    min?: number;
    max?: number;
    targetMin?: number;
    targetMax?: number;
}) => number;
/**
 * Calculates overall reliability score for an intelligence source.
 *
 * @param {SourceReliabilityMetrics} metrics - Source metrics
 * @returns {number} Overall reliability score (0-100)
 *
 * @example
 * ```typescript
 * const reliability = calculateSourceReliability(feedMetrics);
 * console.log(`Source reliability: ${reliability}%`);
 * ```
 */
export declare const calculateSourceReliability: (metrics: SourceReliabilityMetrics) => number;
/**
 * Tracks historical accuracy of intelligence sources.
 *
 * @param {string} feedId - Feed identifier
 * @param {boolean} wasAccurate - Whether the intelligence was accurate
 * @param {SourceReliabilityMetrics} metrics - Current metrics
 * @returns {SourceReliabilityMetrics} Updated metrics
 *
 * @example
 * ```typescript
 * const updated = trackSourceAccuracy('feed-123', true, currentMetrics);
 * // Metrics are updated with new accuracy data
 * ```
 */
export declare const trackSourceAccuracy: (feedId: string, wasAccurate: boolean, metrics: SourceReliabilityMetrics) => SourceReliabilityMetrics;
/**
 * Updates reliability metrics for intelligence sources.
 *
 * @param {SourceReliabilityMetrics[]} allMetrics - All source metrics
 * @param {string} feedId - Feed to update
 * @param {Partial<SourceReliabilityMetrics>} updates - Metric updates
 * @returns {SourceReliabilityMetrics[]} Updated metrics array
 *
 * @example
 * ```typescript
 * const updated = updateReliabilityMetrics(allMetrics, 'feed-123', {
 *   timeliness: 95,
 *   coverage: 80
 * });
 * ```
 */
export declare const updateReliabilityMetrics: (allMetrics: SourceReliabilityMetrics[], feedId: string, updates: Partial<SourceReliabilityMetrics>) => SourceReliabilityMetrics[];
/**
 * Ranks intelligence sources by reliability score.
 *
 * @param {SourceReliabilityMetrics[]} metrics - Source metrics
 * @param {object} [options] - Ranking options
 * @returns {Array<{ rank: number; feedId: string; feedName: string; reliability: number }>} Ranked sources
 *
 * @example
 * ```typescript
 * const ranked = rankIntelSources(allMetrics, { minSubmissions: 10 });
 * console.log('Top source:', ranked[0].feedName);
 * ```
 */
export declare const rankIntelSources: (metrics: SourceReliabilityMetrics[], options?: {
    minSubmissions?: number;
    sortBy?: "reliability" | "accuracy" | "timeliness";
}) => Array<{
    rank: number;
    feedId: string;
    feedName: string;
    reliability: number;
}>;
/**
 * Detects conflicting intelligence from different sources.
 *
 * @param {FusedIntelligence} item - Intelligence item to check
 * @returns {Array<{ type: string; sources: string[]; values: any[] }>} Detected conflicts
 *
 * @example
 * ```typescript
 * const conflicts = detectIntelConflicts(fusedItem);
 * if (conflicts.length > 0) {
 *   console.log('Conflicts detected:', conflicts);
 * }
 * ```
 */
export declare const detectIntelConflicts: (item: FusedIntelligence) => Array<{
    type: string;
    sources: string[];
    values: any[];
}>;
/**
 * Resolves conflicts using majority voting.
 *
 * @param {Array<{ feedId: string; value: any; reliability: number }>} conflictingValues - Conflicting values
 * @returns {{ resolvedValue: any; confidence: number }} Resolution result
 *
 * @example
 * ```typescript
 * const resolution = resolveConflictByVoting([
 *   { feedId: 'f1', value: 'CRITICAL', reliability: 80 },
 *   { feedId: 'f2', value: 'HIGH', reliability: 85 },
 *   { feedId: 'f3', value: 'CRITICAL', reliability: 75 }
 * ]);
 * // Returns { resolvedValue: 'CRITICAL', confidence: 66.67 }
 * ```
 */
export declare const resolveConflictByVoting: (conflictingValues: Array<{
    feedId: string;
    value: any;
    reliability: number;
}>) => {
    resolvedValue: any;
    confidence: number;
};
/**
 * Resolves conflicts by weighting source reliability.
 *
 * @param {Array<{ feedId: string; value: any; reliability: number }>} conflictingValues - Conflicting values
 * @returns {{ resolvedValue: any; confidence: number }} Resolution result
 *
 * @example
 * ```typescript
 * const resolution = resolveConflictByReliability(conflictingValues);
 * // Returns value from most reliable source
 * ```
 */
export declare const resolveConflictByReliability: (conflictingValues: Array<{
    feedId: string;
    value: any;
    reliability: number;
}>) => {
    resolvedValue: any;
    confidence: number;
};
/**
 * Flags unresolvable conflicts requiring manual review.
 *
 * @param {FusedIntelligence[]} intelligence - Intelligence items to check
 * @param {number} [threshold=40] - Confidence threshold below which conflicts are flagged
 * @returns {Array<{ itemId: string; conflicts: any[]; requiresReview: boolean }>} Flagged items
 *
 * @example
 * ```typescript
 * const flagged = flagUnresolvableConflicts(fusedIntel, 50);
 * console.log(`${flagged.length} items require manual review`);
 * ```
 */
export declare const flagUnresolvableConflicts: (intelligence: FusedIntelligence[], threshold?: number) => Array<{
    itemId: string;
    conflicts: any[];
    requiresReview: boolean;
}>;
/**
 * Enriches intelligence with data from multiple sources.
 *
 * @param {FusedIntelligence} item - Intelligence item to enrich
 * @param {IntelFeedSource[]} sources - Available enrichment sources
 * @returns {Promise<FusedIntelligence>} Enriched intelligence
 *
 * @example
 * ```typescript
 * const enriched = await enrichFromMultipleSources(item, enrichmentSources);
 * console.log('Geolocation:', enriched.enrichment.geolocation);
 * ```
 */
export declare const enrichFromMultipleSources: (item: FusedIntelligence, sources: IntelFeedSource[]) => Promise<FusedIntelligence>;
/**
 * Cross-references intelligence across multiple databases.
 *
 * @param {FusedIntelligence} item - Intelligence item to cross-reference
 * @param {string[]} databases - Database identifiers
 * @returns {Promise<Array<{ database: string; found: boolean; data?: any }>>} Cross-reference results
 *
 * @example
 * ```typescript
 * const refs = await crossReferenceIntelligence(item, ['virustotal', 'alienvault', 'misp']);
 * ```
 */
export declare const crossReferenceIntelligence: (item: FusedIntelligence, databases: string[]) => Promise<Array<{
    database: string;
    found: boolean;
    data?: any;
}>>;
/**
 * Enhances intelligence metadata with additional context.
 *
 * @param {FusedIntelligence} item - Intelligence item to enhance
 * @param {Record<string, any>} additionalData - Additional metadata
 * @returns {FusedIntelligence} Enhanced intelligence
 *
 * @example
 * ```typescript
 * const enhanced = enhanceIntelMetadata(item, {
 *   industry: 'healthcare',
 *   targetedAssets: ['EHR', 'patient_portal'],
 *   mitigations: ['block_ip', 'alert_soc']
 * });
 * ```
 */
export declare const enhanceIntelMetadata: (item: FusedIntelligence, additionalData: Record<string, any>) => FusedIntelligence;
/**
 * Supplements missing fields with data from available sources.
 *
 * @param {FusedIntelligence} item - Intelligence item with missing fields
 * @param {FusedIntelligence[]} referenceData - Reference data for supplementing
 * @returns {FusedIntelligence} Supplemented intelligence
 *
 * @example
 * ```typescript
 * const supplemented = supplementMissingFields(incompleteItem, completeDataset);
 * ```
 */
export declare const supplementMissingFields: (item: FusedIntelligence, referenceData: FusedIntelligence[]) => FusedIntelligence;
/**
 * Generates comprehensive fusion analytics report.
 *
 * @param {FusedIntelligence[]} intelligence - Fused intelligence data
 * @param {IntelCorrelation[]} correlations - Correlation data
 * @param {SourceReliabilityMetrics[]} sourceMetrics - Source metrics
 * @param {object} timeRange - Report time range
 * @returns {FusionReport} Fusion report
 *
 * @example
 * ```typescript
 * const report = generateFusionReport(
 *   fusedIntel,
 *   correlations,
 *   metrics,
 *   { start: new Date('2025-01-01'), end: new Date('2025-01-31') }
 * );
 * ```
 */
export declare const generateFusionReport: (intelligence: FusedIntelligence[], correlations: IntelCorrelation[], sourceMetrics: SourceReliabilityMetrics[], timeRange: {
    start: Date;
    end: Date;
}) => FusionReport;
/**
 * Analyzes effectiveness of intelligence fusion process.
 *
 * @param {FusedIntelligence[]} fusedIntel - Fused intelligence data
 * @param {FusedIntelligence[]} originalIntel - Original unfused intelligence
 * @returns {{ improvementRate: number; qualityGain: number; coverageGain: number }} Effectiveness metrics
 *
 * @example
 * ```typescript
 * const effectiveness = analyzeFusionEffectiveness(fusedData, originalData);
 * console.log(`Quality improvement: ${effectiveness.qualityGain}%`);
 * ```
 */
export declare const analyzeFusionEffectiveness: (fusedIntel: FusedIntelligence[], originalIntel: FusedIntelligence[]) => {
    improvementRate: number;
    qualityGain: number;
    coverageGain: number;
};
/**
 * Tracks fusion metrics over time.
 *
 * @param {FusedIntelligence[]} intelligence - Intelligence data
 * @param {string} [interval='daily'] - Tracking interval
 * @returns {Array<{ date: string; count: number; avgConfidence: number; avgQuality: number }>} Metrics timeline
 *
 * @example
 * ```typescript
 * const timeline = trackFusionMetrics(fusedIntel, 'weekly');
 * // Returns weekly aggregated metrics
 * ```
 */
export declare const trackFusionMetrics: (intelligence: FusedIntelligence[], interval?: "hourly" | "daily" | "weekly" | "monthly") => Array<{
    date: string;
    count: number;
    avgConfidence: number;
    avgQuality: number;
}>;
/**
 * Prepares fusion results for visualization.
 *
 * @param {FusedIntelligence[]} intelligence - Intelligence data
 * @param {IntelCorrelation[]} correlations - Correlation data
 * @returns {{ charts: any[]; tables: any[]; graphs: any[] }} Visualization-ready data
 *
 * @example
 * ```typescript
 * const vizData = visualizeFusionResults(fusedIntel, correlations);
 * // Use vizData.charts for dashboard rendering
 * ```
 */
export declare const visualizeFusionResults: (intelligence: FusedIntelligence[], correlations: IntelCorrelation[]) => {
    charts: any[];
    tables: any[];
    graphs: any[];
};
//# sourceMappingURL=threat-intelligence-fusion-kit.d.ts.map