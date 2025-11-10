/**
 * LOC: THREATTIP1234567
 * File: /reuse/threat/threat-intelligence-platform-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize
 *   - crypto (Node.js built-in)
 *
 * DOWNSTREAM (imported by):
 *   - Threat intelligence platform services
 *   - Intelligence aggregation modules
 *   - Threat data normalization services
 *   - Intelligence lifecycle management
 *   - Intelligence search and query services
 *   - STIX/TAXII integration modules
 */
/**
 * Threat Intelligence Platform configuration
 */
export interface TIPConfig {
    id: string;
    name: string;
    version: string;
    enabled: boolean;
    sources: IntelligenceSource[];
    normalizationRules: NormalizationRule[];
    enrichmentServices: EnrichmentService[];
    retentionPolicy: RetentionPolicy;
    priorityRules: PriorityRule[];
    metadata?: Record<string, any>;
}
/**
 * Intelligence source configuration
 */
export interface IntelligenceSource {
    id: string;
    name: string;
    type: SourceType;
    provider: string;
    url?: string;
    apiKey?: string;
    enabled: boolean;
    priority: number;
    reliability: ReliabilityRating;
    updateInterval: number;
    lastSync?: Date;
    metadata?: Record<string, any>;
}
/**
 * Source types
 */
export declare enum SourceType {
    COMMERCIAL_FEED = "COMMERCIAL_FEED",
    OPEN_SOURCE = "OPEN_SOURCE",
    GOVERNMENT = "GOVERNMENT",
    COMMUNITY = "COMMUNITY",
    INTERNAL = "INTERNAL",
    SHARING_COMMUNITY = "SHARING_COMMUNITY",
    DARK_WEB = "DARK_WEB",
    SOCIAL_MEDIA = "SOCIAL_MEDIA"
}
/**
 * Source reliability ratings
 */
export declare enum ReliabilityRating {
    A_COMPLETELY_RELIABLE = "A_COMPLETELY_RELIABLE",
    B_USUALLY_RELIABLE = "B_USUALLY_RELIABLE",
    C_FAIRLY_RELIABLE = "C_FAIRLY_RELIABLE",
    D_NOT_USUALLY_RELIABLE = "D_NOT_USUALLY_RELIABLE",
    E_UNRELIABLE = "E_UNRELIABLE",
    F_RELIABILITY_UNKNOWN = "F_RELIABILITY_UNKNOWN"
}
/**
 * Threat intelligence entry
 */
export interface ThreatIntelligence {
    id: string;
    type: IntelligenceType;
    title: string;
    description: string;
    severity: ThreatSeverity;
    confidence: number;
    tlp: TLPLevel;
    sourceId: string;
    sourceReliability: ReliabilityRating;
    createdAt: Date;
    updatedAt: Date;
    expiresAt?: Date;
    validFrom: Date;
    validUntil?: Date;
    indicators: Indicator[];
    tags: string[];
    mitreAttack?: string[];
    killChain?: string[];
    references: Reference[];
    relatedIntelligence: string[];
    enrichment?: IntelligenceEnrichment;
    priority: IntelligencePriority;
    status: IntelligenceStatus;
    metadata?: Record<string, any>;
}
/**
 * Intelligence types
 */
export declare enum IntelligenceType {
    STRATEGIC = "STRATEGIC",
    TACTICAL = "TACTICAL",
    OPERATIONAL = "OPERATIONAL",
    TECHNICAL = "TECHNICAL"
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
 * Traffic Light Protocol (TLP) levels
 */
export declare enum TLPLevel {
    RED = "RED",
    AMBER = "AMBER",
    GREEN = "GREEN",
    WHITE = "WHITE"
}
/**
 * Intelligence priority
 */
export declare enum IntelligencePriority {
    CRITICAL = "CRITICAL",
    HIGH = "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "LOW"
}
/**
 * Intelligence status
 */
export declare enum IntelligenceStatus {
    PENDING_VALIDATION = "PENDING_VALIDATION",
    VALIDATED = "VALIDATED",
    ACTIVE = "ACTIVE",
    EXPIRED = "EXPIRED",
    DEPRECATED = "DEPRECATED",
    FALSE_POSITIVE = "FALSE_POSITIVE"
}
/**
 * Indicator structure
 */
export interface Indicator {
    id: string;
    type: IndicatorType;
    value: string;
    confidence: number;
    firstSeen: Date;
    lastSeen: Date;
    metadata?: Record<string, any>;
}
/**
 * Indicator types
 */
export declare enum IndicatorType {
    IPV4 = "IPV4",
    IPV6 = "IPV6",
    DOMAIN = "DOMAIN",
    URL = "URL",
    EMAIL = "EMAIL",
    FILE_HASH = "FILE_HASH",
    CVE = "CVE",
    YARA_RULE = "YARA_RULE",
    REGISTRY_KEY = "REGISTRY_KEY",
    MUTEX = "MUTEX"
}
/**
 * Reference information
 */
export interface Reference {
    type: ReferenceType;
    url: string;
    title?: string;
    description?: string;
}
/**
 * Reference types
 */
export declare enum ReferenceType {
    REPORT = "REPORT",
    ARTICLE = "ARTICLE",
    ADVISORY = "ADVISORY",
    BLOG = "BLOG",
    RESEARCH = "RESEARCH",
    CVE = "CVE"
}
/**
 * Intelligence enrichment data
 */
export interface IntelligenceEnrichment {
    geolocation?: GeolocationData;
    whois?: WhoisData;
    reputation?: ReputationData;
    malwareAnalysis?: MalwareAnalysisData;
    threatActors?: string[];
    campaigns?: string[];
    enrichedAt: Date;
    enrichmentSources: string[];
}
/**
 * Geolocation data
 */
export interface GeolocationData {
    country?: string;
    region?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
    asn?: string;
    isp?: string;
}
/**
 * WHOIS data
 */
export interface WhoisData {
    registrar?: string;
    createdDate?: Date;
    expiresDate?: Date;
    updatedDate?: Date;
    nameServers?: string[];
    registrantOrg?: string;
}
/**
 * Reputation data
 */
export interface ReputationData {
    score: number;
    category: string;
    threatTypes: string[];
    lastChecked: Date;
    sources: string[];
}
/**
 * Malware analysis data
 */
export interface MalwareAnalysisData {
    family?: string;
    variant?: string;
    capabilities?: string[];
    signatures?: string[];
    behavior?: string[];
}
/**
 * Normalization rule
 */
export interface NormalizationRule {
    id: string;
    name: string;
    description: string;
    sourceType: SourceType;
    fieldMappings: FieldMapping[];
    transformations: Transformation[];
    enabled: boolean;
}
/**
 * Field mapping
 */
export interface FieldMapping {
    sourceField: string;
    targetField: string;
    required: boolean;
    defaultValue?: any;
}
/**
 * Data transformation
 */
export interface Transformation {
    field: string;
    type: TransformationType;
    parameters?: Record<string, any>;
}
/**
 * Transformation types
 */
export declare enum TransformationType {
    UPPERCASE = "UPPERCASE",
    LOWERCASE = "LOWERCASE",
    TRIM = "TRIM",
    PARSE_DATE = "PARSE_DATE",
    EXTRACT_DOMAIN = "EXTRACT_DOMAIN",
    NORMALIZE_IP = "NORMALIZE_IP",
    HASH = "HASH",
    DEFANG = "DEFANG"
}
/**
 * Enrichment service configuration
 */
export interface EnrichmentService {
    id: string;
    name: string;
    type: EnrichmentType;
    url: string;
    apiKey?: string;
    enabled: boolean;
    priority: number;
    rateLimit?: number;
    timeout?: number;
}
/**
 * Enrichment types
 */
export declare enum EnrichmentType {
    GEOLOCATION = "GEOLOCATION",
    WHOIS = "WHOIS",
    REPUTATION = "REPUTATION",
    MALWARE_ANALYSIS = "MALWARE_ANALYSIS",
    PASSIVE_DNS = "PASSIVE_DNS",
    THREAT_ACTOR = "THREAT_ACTOR"
}
/**
 * Retention policy
 */
export interface RetentionPolicy {
    defaultRetention: number;
    retentionBySeverity: Record<ThreatSeverity, number>;
    archiveExpired: boolean;
    purgeAfter?: number;
}
/**
 * Priority rule
 */
export interface PriorityRule {
    id: string;
    name: string;
    conditions: PriorityCondition[];
    priority: IntelligencePriority;
    enabled: boolean;
}
/**
 * Priority condition
 */
export interface PriorityCondition {
    field: string;
    operator: string;
    value: any;
}
/**
 * Intelligence query
 */
export interface IntelligenceQuery {
    keywords?: string[];
    indicatorTypes?: IndicatorType[];
    severities?: ThreatSeverity[];
    sources?: string[];
    tags?: string[];
    dateRange?: {
        start: Date;
        end: Date;
    };
    tlp?: TLPLevel[];
    status?: IntelligenceStatus[];
    limit?: number;
    offset?: number;
}
/**
 * Intelligence search result
 */
export interface IntelligenceSearchResult {
    total: number;
    results: ThreatIntelligence[];
    aggregations?: Record<string, any>;
    took: number;
}
/**
 * Validation result
 */
export interface ValidationResult {
    isValid: boolean;
    confidence: number;
    issues: ValidationIssue[];
    validatedAt: Date;
    validatedBy: string;
}
/**
 * Validation issue
 */
export interface ValidationIssue {
    severity: 'error' | 'warning' | 'info';
    field: string;
    message: string;
    suggestion?: string;
}
/**
 * Sequelize ThreatIntelligence model attributes.
 *
 * @example
 * ```typescript
 * class ThreatIntelligence extends Model {}
 * ThreatIntelligence.init(getThreatIntelligenceModelAttributes(), {
 *   sequelize,
 *   tableName: 'threat_intelligence',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['type', 'severity'] },
 *     { fields: ['status'] },
 *     { fields: ['priority'] }
 *   ]
 * });
 * ```
 */
export declare const getThreatIntelligenceModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    type: {
        type: string;
        allowNull: boolean;
    };
    title: {
        type: string;
        allowNull: boolean;
    };
    description: {
        type: string;
        allowNull: boolean;
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
    tlp: {
        type: string;
        allowNull: boolean;
    };
    sourceId: {
        type: string;
        allowNull: boolean;
    };
    sourceReliability: {
        type: string;
        allowNull: boolean;
    };
    expiresAt: {
        type: string;
        allowNull: boolean;
    };
    validFrom: {
        type: string;
        allowNull: boolean;
    };
    validUntil: {
        type: string;
        allowNull: boolean;
    };
    indicators: {
        type: string;
        defaultValue: never[];
    };
    tags: {
        type: string;
        defaultValue: never[];
    };
    mitreAttack: {
        type: string;
        defaultValue: never[];
    };
    killChain: {
        type: string;
        defaultValue: never[];
    };
    references: {
        type: string;
        defaultValue: never[];
    };
    relatedIntelligence: {
        type: string;
        defaultValue: never[];
    };
    enrichment: {
        type: string;
        allowNull: boolean;
    };
    priority: {
        type: string;
        allowNull: boolean;
    };
    status: {
        type: string;
        allowNull: boolean;
        defaultValue: string;
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
 * Sequelize IntelligenceSource model attributes.
 *
 * @example
 * ```typescript
 * class IntelligenceSource extends Model {}
 * IntelligenceSource.init(getIntelligenceSourceModelAttributes(), {
 *   sequelize,
 *   tableName: 'intelligence_sources',
 *   timestamps: true
 * });
 * ```
 */
export declare const getIntelligenceSourceModelAttributes: () => {
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
    type: {
        type: string;
        allowNull: boolean;
    };
    provider: {
        type: string;
        allowNull: boolean;
    };
    url: {
        type: string;
        allowNull: boolean;
    };
    apiKey: {
        type: string;
        allowNull: boolean;
    };
    enabled: {
        type: string;
        allowNull: boolean;
        defaultValue: boolean;
    };
    priority: {
        type: string;
        allowNull: boolean;
        defaultValue: number;
    };
    reliability: {
        type: string;
        allowNull: boolean;
    };
    updateInterval: {
        type: string;
        allowNull: boolean;
    };
    lastSync: {
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
 * Sequelize EnrichmentCache model attributes.
 *
 * @example
 * ```typescript
 * class EnrichmentCache extends Model {}
 * EnrichmentCache.init(getEnrichmentCacheModelAttributes(), {
 *   sequelize,
 *   tableName: 'enrichment_cache',
 *   timestamps: true
 * });
 * ```
 */
export declare const getEnrichmentCacheModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    indicatorType: {
        type: string;
        allowNull: boolean;
    };
    indicatorValue: {
        type: string;
        allowNull: boolean;
    };
    enrichmentType: {
        type: string;
        allowNull: boolean;
    };
    enrichmentData: {
        type: string;
        allowNull: boolean;
    };
    enrichedAt: {
        type: string;
        allowNull: boolean;
    };
    expiresAt: {
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
 * Sequelize IntelligenceValidation model attributes.
 *
 * @example
 * ```typescript
 * class IntelligenceValidation extends Model {}
 * IntelligenceValidation.init(getIntelligenceValidationModelAttributes(), {
 *   sequelize,
 *   tableName: 'intelligence_validations',
 *   timestamps: true
 * });
 * ```
 */
export declare const getIntelligenceValidationModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    intelligenceId: {
        type: string;
        allowNull: boolean;
    };
    isValid: {
        type: string;
        allowNull: boolean;
    };
    confidence: {
        type: string;
        allowNull: boolean;
    };
    issues: {
        type: string;
        defaultValue: never[];
    };
    validatedAt: {
        type: string;
        allowNull: boolean;
    };
    validatedBy: {
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
 * Aggregates intelligence from multiple sources.
 *
 * @param {IntelligenceSource[]} sources - Intelligence sources
 * @param {object} [options] - Aggregation options
 * @returns {Promise<ThreatIntelligence[]>} Aggregated intelligence
 *
 * @example
 * ```typescript
 * const sources = [commercialFeed, openSourceFeed, internalFeed];
 * const intelligence = await aggregateIntelligence(sources, { deduplication: true });
 * ```
 */
export declare const aggregateIntelligence: (sources: IntelligenceSource[], options?: {
    deduplication?: boolean;
    minReliability?: ReliabilityRating;
    maxAge?: number;
}) => Promise<ThreatIntelligence[]>;
/**
 * Fetches intelligence from a single source.
 *
 * @param {IntelligenceSource} source - Intelligence source
 * @returns {Promise<ThreatIntelligence[]>} Fetched intelligence
 *
 * @example
 * ```typescript
 * const intelligence = await fetchIntelligenceFromSource(commercialFeed);
 * ```
 */
export declare const fetchIntelligenceFromSource: (source: IntelligenceSource) => Promise<ThreatIntelligence[]>;
/**
 * Synchronizes intelligence from all configured sources.
 *
 * @param {IntelligenceSource[]} sources - Sources to synchronize
 * @returns {Promise<object>} Synchronization results
 *
 * @example
 * ```typescript
 * const results = await synchronizeIntelligenceSources(allSources);
 * console.log(`Synced ${results.totalIntelligence} intelligence entries`);
 * ```
 */
export declare const synchronizeIntelligenceSources: (sources: IntelligenceSource[]) => Promise<{
    totalIntelligence: number;
    bySource: Record<string, number>;
    errors: string[];
}>;
/**
 * Filters intelligence based on criteria.
 *
 * @param {ThreatIntelligence[]} intelligence - Intelligence to filter
 * @param {object} criteria - Filter criteria
 * @returns {ThreatIntelligence[]} Filtered intelligence
 *
 * @example
 * ```typescript
 * const filtered = filterIntelligence(allIntelligence, {
 *   minSeverity: ThreatSeverity.HIGH,
 *   minConfidence: 80
 * });
 * ```
 */
export declare const filterIntelligence: (intelligence: ThreatIntelligence[], criteria: {
    minSeverity?: ThreatSeverity;
    minConfidence?: number;
    types?: IntelligenceType[];
    statuses?: IntelligenceStatus[];
    tlp?: TLPLevel[];
}) => ThreatIntelligence[];
/**
 * Normalizes threat data from different sources to common format.
 *
 * @param {any} rawData - Raw threat data
 * @param {NormalizationRule} rule - Normalization rule
 * @returns {ThreatIntelligence} Normalized intelligence
 *
 * @example
 * ```typescript
 * const normalized = normalizeThreatData(rawFeedData, normalizationRule);
 * ```
 */
export declare const normalizeThreatData: (rawData: any, rule: NormalizationRule) => ThreatIntelligence;
/**
 * Batch normalizes multiple threat data entries.
 *
 * @param {any[]} rawDataArray - Array of raw data
 * @param {NormalizationRule} rule - Normalization rule
 * @returns {ThreatIntelligence[]} Normalized intelligence array
 *
 * @example
 * ```typescript
 * const normalized = batchNormalizeThreatData(rawDataArray, rule);
 * ```
 */
export declare const batchNormalizeThreatData: (rawDataArray: any[], rule: NormalizationRule) => ThreatIntelligence[];
/**
 * Creates normalization rule from source schema.
 *
 * @param {SourceType} sourceType - Type of source
 * @param {object} schema - Source data schema
 * @returns {NormalizationRule} Generated normalization rule
 *
 * @example
 * ```typescript
 * const rule = createNormalizationRule(SourceType.COMMERCIAL_FEED, feedSchema);
 * ```
 */
export declare const createNormalizationRule: (sourceType: SourceType, schema: Record<string, any>) => NormalizationRule;
/**
 * Manages intelligence lifecycle based on retention policy.
 *
 * @param {ThreatIntelligence[]} intelligence - Intelligence entries
 * @param {RetentionPolicy} policy - Retention policy
 * @returns {object} Lifecycle management results
 *
 * @example
 * ```typescript
 * const results = manageIntelligenceLifecycle(allIntelligence, retentionPolicy);
 * console.log(`Expired: ${results.expired.length}, Archived: ${results.archived.length}`);
 * ```
 */
export declare const manageIntelligenceLifecycle: (intelligence: ThreatIntelligence[], policy: RetentionPolicy) => {
    active: ThreatIntelligence[];
    expired: ThreatIntelligence[];
    archived: ThreatIntelligence[];
    purged: string[];
};
/**
 * Updates intelligence status based on age and validity.
 *
 * @param {ThreatIntelligence} intel - Intelligence entry
 * @returns {ThreatIntelligence} Updated intelligence
 *
 * @example
 * ```typescript
 * const updated = updateIntelligenceStatus(intelligence);
 * ```
 */
export declare const updateIntelligenceStatus: (intel: ThreatIntelligence) => ThreatIntelligence;
/**
 * Extends intelligence expiration time.
 *
 * @param {ThreatIntelligence} intel - Intelligence to extend
 * @param {number} extensionPeriod - Extension period in milliseconds
 * @returns {ThreatIntelligence} Extended intelligence
 *
 * @example
 * ```typescript
 * const extended = extendIntelligenceExpiration(intel, 7 * 24 * 60 * 60 * 1000); // 7 days
 * ```
 */
export declare const extendIntelligenceExpiration: (intel: ThreatIntelligence, extensionPeriod: number) => ThreatIntelligence;
/**
 * Archives expired intelligence.
 *
 * @param {ThreatIntelligence[]} intelligence - Intelligence to archive
 * @returns {object} Archive results
 *
 * @example
 * ```typescript
 * const results = archiveExpiredIntelligence(expiredIntelligence);
 * ```
 */
export declare const archiveExpiredIntelligence: (intelligence: ThreatIntelligence[]) => {
    archived: number;
    errors: string[];
};
/**
 * Searches threat intelligence based on query.
 *
 * @param {ThreatIntelligence[]} intelligence - Intelligence to search
 * @param {IntelligenceQuery} query - Search query
 * @returns {IntelligenceSearchResult} Search results
 *
 * @example
 * ```typescript
 * const results = await searchThreatIntelligence(allIntelligence, {
 *   keywords: ['ransomware', 'healthcare'],
 *   severities: [ThreatSeverity.HIGH, ThreatSeverity.CRITICAL]
 * });
 * ```
 */
export declare const searchThreatIntelligence: (intelligence: ThreatIntelligence[], query: IntelligenceQuery) => Promise<IntelligenceSearchResult>;
/**
 * Performs advanced intelligence query with complex filters.
 *
 * @param {ThreatIntelligence[]} intelligence - Intelligence database
 * @param {object} advancedQuery - Advanced query criteria
 * @returns {Promise<ThreatIntelligence[]>} Query results
 *
 * @example
 * ```typescript
 * const results = await advancedIntelligenceQuery(intelligence, {
 *   booleanQuery: {
 *     must: [{ field: 'severity', value: 'CRITICAL' }],
 *     should: [{ field: 'tags', value: 'ransomware' }],
 *     mustNot: [{ field: 'status', value: 'EXPIRED' }]
 *   }
 * });
 * ```
 */
export declare const advancedIntelligenceQuery: (intelligence: ThreatIntelligence[], advancedQuery: {
    booleanQuery?: {
        must?: Array<{
            field: string;
            value: any;
        }>;
        should?: Array<{
            field: string;
            value: any;
        }>;
        mustNot?: Array<{
            field: string;
            value: any;
        }>;
    };
    fuzzySearch?: {
        field: string;
        value: string;
        fuzziness?: number;
    };
    rangeQuery?: {
        field: string;
        gte?: any;
        lte?: any;
    };
}) => Promise<ThreatIntelligence[]>;
/**
 * Finds related intelligence based on indicators.
 *
 * @param {ThreatIntelligence} intel - Intelligence entry
 * @param {ThreatIntelligence[]} allIntelligence - All intelligence
 * @returns {ThreatIntelligence[]} Related intelligence
 *
 * @example
 * ```typescript
 * const related = findRelatedIntelligence(currentIntel, allIntelligence);
 * ```
 */
export declare const findRelatedIntelligence: (intel: ThreatIntelligence, allIntelligence: ThreatIntelligence[]) => ThreatIntelligence[];
/**
 * Applies priority rules to intelligence.
 *
 * @param {ThreatIntelligence[]} intelligence - Intelligence to prioritize
 * @param {PriorityRule[]} rules - Priority rules
 * @returns {ThreatIntelligence[]} Prioritized intelligence
 *
 * @example
 * ```typescript
 * const prioritized = applyPriorityRules(intelligence, priorityRules);
 * ```
 */
export declare const applyPriorityRules: (intelligence: ThreatIntelligence[], rules: PriorityRule[]) => ThreatIntelligence[];
/**
 * Sorts intelligence by priority and other factors.
 *
 * @param {ThreatIntelligence[]} intelligence - Intelligence to sort
 * @param {object} [options] - Sort options
 * @returns {ThreatIntelligence[]} Sorted intelligence
 *
 * @example
 * ```typescript
 * const sorted = sortIntelligenceByPriority(intelligence, { tiebreaker: 'confidence' });
 * ```
 */
export declare const sortIntelligenceByPriority: (intelligence: ThreatIntelligence[], options?: {
    tiebreaker?: "confidence" | "severity" | "createdAt";
}) => ThreatIntelligence[];
/**
 * Calculates priority score for intelligence.
 *
 * @param {ThreatIntelligence} intel - Intelligence entry
 * @returns {number} Priority score (0-100)
 *
 * @example
 * ```typescript
 * const score = calculatePriorityScore(intelligence);
 * ```
 */
export declare const calculatePriorityScore: (intel: ThreatIntelligence) => number;
/**
 * Validates threat intelligence entry.
 *
 * @param {ThreatIntelligence} intel - Intelligence to validate
 * @returns {Promise<ValidationResult>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateThreatIntelligence(intelligence);
 * if (!validation.isValid) {
 *   console.error('Validation issues:', validation.issues);
 * }
 * ```
 */
export declare const validateThreatIntelligence: (intel: ThreatIntelligence) => Promise<ValidationResult>;
/**
 * Enriches intelligence with additional context.
 *
 * @param {ThreatIntelligence} intel - Intelligence to enrich
 * @param {EnrichmentService[]} services - Enrichment services
 * @returns {Promise<ThreatIntelligence>} Enriched intelligence
 *
 * @example
 * ```typescript
 * const enriched = await enrichThreatIntelligence(intelligence, enrichmentServices);
 * ```
 */
export declare const enrichThreatIntelligence: (intel: ThreatIntelligence, services: EnrichmentService[]) => Promise<ThreatIntelligence>;
/**
 * Batch enriches multiple intelligence entries.
 *
 * @param {ThreatIntelligence[]} intelligence - Intelligence to enrich
 * @param {EnrichmentService[]} services - Enrichment services
 * @returns {Promise<ThreatIntelligence[]>} Enriched intelligence
 *
 * @example
 * ```typescript
 * const enriched = await batchEnrichIntelligence(intelligenceArray, services);
 * ```
 */
export declare const batchEnrichIntelligence: (intelligence: ThreatIntelligence[], services: EnrichmentService[]) => Promise<ThreatIntelligence[]>;
/**
 * Caches enrichment data for reuse.
 *
 * @param {string} indicatorType - Type of indicator
 * @param {string} indicatorValue - Indicator value
 * @param {string} enrichmentType - Type of enrichment
 * @param {any} enrichmentData - Enrichment data
 * @param {number} ttl - Time to live in milliseconds
 * @returns {object} Cache entry
 *
 * @example
 * ```typescript
 * const cached = cacheEnrichmentData('IPV4', '192.168.1.1', 'GEOLOCATION', geoData, 3600000);
 * ```
 */
export declare const cacheEnrichmentData: (indicatorType: string, indicatorValue: string, enrichmentType: string, enrichmentData: any, ttl?: number) => {
    id: string;
    indicatorType: string;
    indicatorValue: string;
    enrichmentType: string;
    enrichmentData: any;
    enrichedAt: Date;
    expiresAt: Date;
};
/**
 * Retrieves cached enrichment data.
 *
 * @param {string} indicatorType - Type of indicator
 * @param {string} indicatorValue - Indicator value
 * @param {string} enrichmentType - Type of enrichment
 * @param {any[]} cache - Enrichment cache
 * @returns {any | null} Cached data or null
 *
 * @example
 * ```typescript
 * const cached = getCachedEnrichment('IPV4', '192.168.1.1', 'GEOLOCATION', enrichmentCache);
 * ```
 */
export declare const getCachedEnrichment: (indicatorType: string, indicatorValue: string, enrichmentType: string, cache: any[]) => any | null;
/**
 * Exports threat intelligence in various formats.
 *
 * @param {ThreatIntelligence[]} intelligence - Intelligence to export
 * @param {string} format - Export format
 * @returns {string} Exported data
 *
 * @example
 * ```typescript
 * const exported = exportThreatIntelligence(intelligence, 'stix');
 * ```
 */
export declare const exportThreatIntelligence: (intelligence: ThreatIntelligence[], format: "json" | "csv" | "stix" | "misp") => string;
/**
 * Imports threat intelligence from external formats.
 *
 * @param {string} data - Data to import
 * @param {string} format - Import format
 * @returns {ThreatIntelligence[]} Imported intelligence
 *
 * @example
 * ```typescript
 * const imported = importThreatIntelligence(stixData, 'stix');
 * ```
 */
export declare const importThreatIntelligence: (data: string, format: "json" | "csv" | "stix" | "misp") => ThreatIntelligence[];
/**
 * Deduplicates intelligence entries based on similarity.
 *
 * @param {ThreatIntelligence[]} intelligence - Intelligence to deduplicate
 * @param {object} [options] - Deduplication options
 * @returns {ThreatIntelligence[]} Deduplicated intelligence
 *
 * @example
 * ```typescript
 * const deduplicated = deduplicateIntelligence(allIntelligence, { threshold: 0.8 });
 * ```
 */
export declare const deduplicateIntelligence: (intelligence: ThreatIntelligence[], options?: {
    threshold?: number;
    mergeStrategy?: "keep_first" | "keep_latest" | "merge";
}) => ThreatIntelligence[];
/**
 * Correlates intelligence across multiple sources.
 *
 * @param {ThreatIntelligence[]} intelligence - Intelligence to correlate
 * @param {object} [options] - Correlation options
 * @returns {Array<{group: ThreatIntelligence[], correlation: string}>} Correlated groups
 *
 * @example
 * ```typescript
 * const correlated = correlateIntelligenceAcrossSources(intelligence);
 * ```
 */
export declare const correlateIntelligenceAcrossSources: (intelligence: ThreatIntelligence[], options?: {
    minSources?: number;
    correlationFields?: string[];
}) => Array<{
    group: ThreatIntelligence[];
    correlation: string;
}>;
/**
 * Generates intelligence summary report.
 *
 * @param {ThreatIntelligence[]} intelligence - Intelligence to summarize
 * @param {object} [timeRange] - Time range for report
 * @returns {object} Summary report
 *
 * @example
 * ```typescript
 * const report = generateIntelligenceSummaryReport(intelligence, {
 *   start: new Date('2024-01-01'),
 *   end: new Date('2024-01-31')
 * });
 * ```
 */
export declare const generateIntelligenceSummaryReport: (intelligence: ThreatIntelligence[], timeRange?: {
    start: Date;
    end: Date;
}) => {
    total: number;
    bySeverity: Record<ThreatSeverity, number>;
    byType: Record<IntelligenceType, number>;
    bySource: Record<string, number>;
    byStatus: Record<IntelligenceStatus, number>;
    topTags: Array<{
        tag: string;
        count: number;
    }>;
    topIndicatorTypes: Array<{
        type: string;
        count: number;
    }>;
    avgConfidence: number;
    timeframe: {
        start: Date;
        end: Date;
    } | null;
};
/**
 * Converts intelligence to STIX 2.1 format.
 *
 * @param {ThreatIntelligence} intel - Intelligence to convert
 * @returns {object} STIX 2.1 bundle
 *
 * @example
 * ```typescript
 * const stixBundle = convertToSTIX(intelligence);
 * ```
 */
export declare const convertToSTIX: (intel: ThreatIntelligence) => {
    type: string;
    id: string;
    spec_version: string;
    objects: any[];
};
/**
 * Converts STIX 2.1 bundle to internal intelligence format.
 *
 * @param {object} stixBundle - STIX bundle
 * @param {string} sourceId - Source identifier
 * @returns {ThreatIntelligence[]} Converted intelligence
 *
 * @example
 * ```typescript
 * const intelligence = convertFromSTIX(stixBundle, 'source-123');
 * ```
 */
export declare const convertFromSTIX: (stixBundle: any, sourceId: string) => ThreatIntelligence[];
/**
 * Scores intelligence quality based on multiple factors.
 *
 * @param {ThreatIntelligence} intel - Intelligence to score
 * @returns {object} Quality score and breakdown
 *
 * @example
 * ```typescript
 * const quality = scoreIntelligenceQuality(intelligence);
 * console.log(`Quality score: ${quality.overall}`);
 * ```
 */
export declare const scoreIntelligenceQuality: (intel: ThreatIntelligence) => {
    overall: number;
    breakdown: {
        completeness: number;
        reliability: number;
        freshness: number;
        actionability: number;
    };
};
/**
 * Recommends intelligence based on context.
 *
 * @param {ThreatIntelligence[]} intelligence - Available intelligence
 * @param {object} context - Context for recommendations
 * @returns {ThreatIntelligence[]} Recommended intelligence
 *
 * @example
 * ```typescript
 * const recommended = recommendIntelligence(allIntelligence, {
 *   sector: 'healthcare',
 *   recentThreats: ['ransomware'],
 *   assets: ['windows', 'linux']
 * });
 * ```
 */
export declare const recommendIntelligence: (intelligence: ThreatIntelligence[], context: {
    sector?: string;
    recentThreats?: string[];
    assets?: string[];
    geolocation?: string;
}) => ThreatIntelligence[];
/**
 * Detects intelligence gaps based on coverage analysis.
 *
 * @param {ThreatIntelligence[]} intelligence - Current intelligence
 * @param {object} requirements - Coverage requirements
 * @returns {object} Gap analysis
 *
 * @example
 * ```typescript
 * const gaps = detectIntelligenceGaps(intelligence, {
 *   requiredMitreTactics: ['initial-access', 'execution', 'persistence'],
 *   requiredSectors: ['healthcare', 'finance']
 * });
 * ```
 */
export declare const detectIntelligenceGaps: (intelligence: ThreatIntelligence[], requirements: {
    requiredMitreTactics?: string[];
    requiredSectors?: string[];
    requiredIndicatorTypes?: IndicatorType[];
}) => {
    gaps: string[];
    coverage: Record<string, number>;
    recommendations: string[];
};
/**
 * Performs confidence adjustment based on source track record.
 *
 * @param {ThreatIntelligence} intel - Intelligence to adjust
 * @param {object} sourceTrackRecord - Historical accuracy of source
 * @returns {ThreatIntelligence} Adjusted intelligence
 *
 * @example
 * ```typescript
 * const adjusted = adjustIntelligenceConfidence(intelligence, {
 *   sourceId: 'source-123',
 *   accuracy: 0.85,
 *   falsePositiveRate: 0.10
 * });
 * ```
 */
export declare const adjustIntelligenceConfidence: (intel: ThreatIntelligence, sourceTrackRecord: {
    sourceId: string;
    accuracy: number;
    falsePositiveRate: number;
}) => ThreatIntelligence;
/**
 * Tracks intelligence provenance through the pipeline.
 *
 * @param {ThreatIntelligence} intel - Intelligence to track
 * @param {string} stage - Pipeline stage
 * @param {object} details - Stage details
 * @returns {ThreatIntelligence} Intelligence with provenance tracking
 *
 * @example
 * ```typescript
 * const tracked = trackIntelligenceProvenance(intelligence, 'enrichment', {
 *   service: 'geolocation',
 *   timestamp: new Date()
 * });
 * ```
 */
export declare const trackIntelligenceProvenance: (intel: ThreatIntelligence, stage: string, details: Record<string, any>) => ThreatIntelligence;
/**
 * Generates intelligence sharing package.
 *
 * @param {ThreatIntelligence[]} intelligence - Intelligence to share
 * @param {TLPLevel} maxTLP - Maximum TLP level to include
 * @returns {object} Sharing package
 *
 * @example
 * ```typescript
 * const package = generateIntelligenceSharingPackage(intelligence, TLPLevel.GREEN);
 * ```
 */
export declare const generateIntelligenceSharingPackage: (intelligence: ThreatIntelligence[], maxTLP: TLPLevel) => {
    packageId: string;
    createdAt: Date;
    tlp: TLPLevel;
    intelligence: ThreatIntelligence[];
    summary: object;
};
/**
 * Performs intelligence fusion from multiple sources.
 *
 * @param {ThreatIntelligence[][]} intelligenceSets - Multiple intelligence sets
 * @param {object} [options] - Fusion options
 * @returns {ThreatIntelligence[]} Fused intelligence
 *
 * @example
 * ```typescript
 * const fused = fuseIntelligence([source1Intel, source2Intel, source3Intel], {
 *   weightByReliability: true
 * });
 * ```
 */
export declare const fuseIntelligence: (intelligenceSets: ThreatIntelligence[][], options?: {
    weightByReliability?: boolean;
    mergeThreshold?: number;
}) => ThreatIntelligence[];
/**
 * Calculates intelligence ROI (Return on Investment).
 *
 * @param {ThreatIntelligence[]} intelligence - Intelligence to evaluate
 * @param {object} outcomes - Operational outcomes
 * @returns {object} ROI metrics
 *
 * @example
 * ```typescript
 * const roi = calculateIntelligenceROI(intelligence, {
 *   threatsBlocked: 150,
 *   incidentsAvoided: 5,
 *   timeToDetection: 120
 * });
 * ```
 */
export declare const calculateIntelligenceROI: (intelligence: ThreatIntelligence[], outcomes: {
    threatsBlocked: number;
    incidentsAvoided: number;
    timeToDetection: number;
    falsePositives: number;
}) => {
    utilizationRate: number;
    effectivenessScore: number;
    efficiency: number;
    roi: string;
};
/**
 * Performs automated intelligence triage.
 *
 * @param {ThreatIntelligence[]} intelligence - Intelligence to triage
 * @returns {object} Triage results
 *
 * @example
 * ```typescript
 * const triaged = performIntelligenceTriage(newIntelligence);
 * console.log(`Critical: ${triaged.critical.length}, Review: ${triaged.review.length}`);
 * ```
 */
export declare const performIntelligenceTriage: (intelligence: ThreatIntelligence[]) => {
    critical: ThreatIntelligence[];
    high: ThreatIntelligence[];
    medium: ThreatIntelligence[];
    low: ThreatIntelligence[];
    review: ThreatIntelligence[];
};
/**
 * Generates intelligence timeline visualization data.
 *
 * @param {ThreatIntelligence[]} intelligence - Intelligence to visualize
 * @param {object} [options] - Visualization options
 * @returns {object} Timeline data
 *
 * @example
 * ```typescript
 * const timeline = generateIntelligenceTimeline(intelligence, {
 *   groupBy: 'day',
 *   includeProjections: true
 * });
 * ```
 */
export declare const generateIntelligenceTimeline: (intelligence: ThreatIntelligence[], options?: {
    groupBy?: "hour" | "day" | "week" | "month";
    includeProjections?: boolean;
}) => {
    timeline: Array<{
        timestamp: Date;
        count: number;
        severity: Record<ThreatSeverity, number>;
    }>;
    trends: {
        direction: "increasing" | "decreasing" | "stable";
        rate: number;
    };
};
/**
 * Performs intelligence health check and quality assurance.
 *
 * @param {ThreatIntelligence[]} intelligence - Intelligence to check
 * @returns {object} Health check results
 *
 * @example
 * ```typescript
 * const health = performIntelligenceHealthCheck(intelligence);
 * console.log(`Overall health: ${health.overallHealth}%`);
 * ```
 */
export declare const performIntelligenceHealthCheck: (intelligence: ThreatIntelligence[]) => {
    overallHealth: number;
    issues: Array<{
        severity: string;
        issue: string;
        count: number;
    }>;
    metrics: {
        totalIntelligence: number;
        activeIntelligence: number;
        expiredIntelligence: number;
        avgQuality: number;
        avgConfidence: number;
        sourceDiversity: number;
    };
    recommendations: string[];
};
/**
 * Automates intelligence enrichment pipeline.
 *
 * @param {ThreatIntelligence} intel - Intelligence to enrich
 * @param {EnrichmentService[]} services - Available enrichment services
 * @param {object} [options] - Pipeline options
 * @returns {Promise<ThreatIntelligence>} Fully enriched intelligence
 *
 * @example
 * ```typescript
 * const enriched = await automateIntelligenceEnrichment(intelligence, allServices, {
 *   parallel: true,
 *   continueOnError: true
 * });
 * ```
 */
export declare const automateIntelligenceEnrichment: (intel: ThreatIntelligence, services: EnrichmentService[], options?: {
    parallel?: boolean;
    continueOnError?: boolean;
    maxRetries?: number;
}) => Promise<ThreatIntelligence>;
//# sourceMappingURL=threat-intelligence-platform-kit.d.ts.map