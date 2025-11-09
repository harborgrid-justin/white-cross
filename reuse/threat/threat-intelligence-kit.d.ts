/**
 * LOC: THREATINT1234567
 * File: /reuse/threat/threat-intelligence-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize
 *   - crypto (Node.js built-in)
 *
 * DOWNSTREAM (imported by):
 *   - Threat intelligence services
 *   - IOC management modules
 *   - Threat actor tracking services
 *   - MITRE ATT&CK mapping services
 *   - STIX/TAXII integration modules
 *   - Security orchestration services
 */
/**
 * Threat intelligence feed configuration
 */
export interface ThreatFeedConfig {
    id: string;
    name: string;
    provider: string;
    feedUrl: string;
    feedType: ThreatFeedType;
    format: 'json' | 'xml' | 'csv' | 'stix' | 'taxii';
    updateInterval: number;
    enabled: boolean;
    authentication?: {
        type: 'api_key' | 'basic' | 'oauth2' | 'certificate';
        credentials: Record<string, any>;
    };
    filters?: ThreatFeedFilter[];
    metadata?: Record<string, any>;
}
/**
 * Threat feed types
 */
export declare enum ThreatFeedType {
    IP_REPUTATION = "IP_REPUTATION",
    DOMAIN_REPUTATION = "DOMAIN_REPUTATION",
    URL_REPUTATION = "URL_REPUTATION",
    FILE_HASH = "FILE_HASH",
    MALWARE_SIGNATURE = "MALWARE_SIGNATURE",
    THREAT_ACTOR = "THREAT_ACTOR",
    CAMPAIGN = "CAMPAIGN",
    VULNERABILITY = "VULNERABILITY",
    EXPLOIT = "EXPLOIT",
    MIXED = "MIXED"
}
/**
 * Threat feed filter criteria
 */
export interface ThreatFeedFilter {
    field: string;
    operator: 'equals' | 'contains' | 'regex' | 'in' | 'greater_than' | 'less_than';
    value: any;
}
/**
 * Indicator of Compromise (IOC) structure
 */
export interface IOC {
    id: string;
    type: IOCType;
    value: string;
    hash?: string;
    severity: ThreatSeverity;
    confidence: number;
    firstSeen: Date;
    lastSeen: Date;
    expiresAt?: Date;
    sources: IOCSource[];
    tags: string[];
    relatedIOCs?: string[];
    threatActors?: string[];
    campaigns?: string[];
    mitreAttack?: MITREMapping[];
    metadata?: Record<string, any>;
    status: 'active' | 'inactive' | 'expired' | 'false_positive';
    falsePositiveReason?: string;
    enrichment?: IOCEnrichment;
}
/**
 * IOC types following industry standards
 */
export declare enum IOCType {
    IPV4 = "IPV4",
    IPV6 = "IPV6",
    DOMAIN = "DOMAIN",
    URL = "URL",
    EMAIL = "EMAIL",
    FILE_HASH_MD5 = "FILE_HASH_MD5",
    FILE_HASH_SHA1 = "FILE_HASH_SHA1",
    FILE_HASH_SHA256 = "FILE_HASH_SHA256",
    FILE_HASH_SHA512 = "FILE_HASH_SHA512",
    FILE_NAME = "FILE_NAME",
    FILE_PATH = "FILE_PATH",
    REGISTRY_KEY = "REGISTRY_KEY",
    MUTEX = "MUTEX",
    USER_AGENT = "USER_AGENT",
    CVE = "CVE",
    ASN = "ASN",
    SSL_CERT_FINGERPRINT = "SSL_CERT_FINGERPRINT",
    YARA_RULE = "YARA_RULE"
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
 * IOC source information
 */
export interface IOCSource {
    provider: string;
    feedId?: string;
    confidence: number;
    firstSeen: Date;
    lastUpdated: Date;
    url?: string;
    metadata?: Record<string, any>;
}
/**
 * IOC enrichment data
 */
export interface IOCEnrichment {
    geolocation?: {
        country?: string;
        region?: string;
        city?: string;
        latitude?: number;
        longitude?: number;
        asn?: string;
        isp?: string;
    };
    whois?: {
        registrar?: string;
        createdDate?: Date;
        expiresDate?: Date;
        nameServers?: string[];
    };
    dns?: {
        aRecords?: string[];
        mxRecords?: string[];
        nsRecords?: string[];
        txtRecords?: string[];
    };
    reputation?: {
        score: number;
        category: string;
        threatTypes: string[];
    };
    malwareAnalysis?: {
        family?: string;
        variant?: string;
        capabilities?: string[];
        signatures?: string[];
    };
}
/**
 * Threat actor profile
 */
export interface ThreatActor {
    id: string;
    name: string;
    aliases: string[];
    type: ThreatActorType;
    sophistication: ThreatSophistication;
    motivation: ThreatMotivation[];
    targetedSectors: string[];
    targetedCountries: string[];
    firstSeen: Date;
    lastSeen: Date;
    description?: string;
    ttps: string[];
    mitreAttack?: MITREMapping[];
    associatedCampaigns?: string[];
    associatedIOCs?: string[];
    metadata?: Record<string, any>;
}
/**
 * Threat actor types
 */
export declare enum ThreatActorType {
    NATION_STATE = "NATION_STATE",
    CYBERCRIME = "CYBERCRIME",
    HACKTIVIST = "HACKTIVIST",
    INSIDER = "INSIDER",
    TERRORIST = "TERRORIST",
    OPPORTUNIST = "OPPORTUNIST",
    UNKNOWN = "UNKNOWN"
}
/**
 * Threat sophistication levels
 */
export declare enum ThreatSophistication {
    NONE = "NONE",
    MINIMAL = "MINIMAL",
    INTERMEDIATE = "INTERMEDIATE",
    ADVANCED = "ADVANCED",
    EXPERT = "EXPERT",
    STRATEGIC = "STRATEGIC"
}
/**
 * Threat motivation categories
 */
export declare enum ThreatMotivation {
    FINANCIAL = "FINANCIAL",
    ESPIONAGE = "ESPIONAGE",
    SABOTAGE = "SABOTAGE",
    IDEOLOGY = "IDEOLOGY",
    GRUDGE = "GRUDGE",
    NOTORIETY = "NOTORIETY",
    ORGANIZATIONAL_GAIN = "ORGANIZATIONAL_GAIN",
    UNKNOWN = "UNKNOWN"
}
/**
 * Threat campaign structure
 */
export interface ThreatCampaign {
    id: string;
    name: string;
    aliases: string[];
    description?: string;
    status: CampaignStatus;
    severity: ThreatSeverity;
    startDate: Date;
    endDate?: Date;
    lastActivity?: Date;
    threatActors?: string[];
    targetedSectors: string[];
    targetedCountries: string[];
    objectives: string[];
    iocs: string[];
    mitreAttack?: MITREMapping[];
    timeline: CampaignEvent[];
    metadata?: Record<string, any>;
}
/**
 * Campaign status
 */
export declare enum CampaignStatus {
    ACTIVE = "ACTIVE",
    SUSPECTED = "SUSPECTED",
    DORMANT = "DORMANT",
    CONCLUDED = "CONCLUDED"
}
/**
 * Campaign timeline event
 */
export interface CampaignEvent {
    id: string;
    timestamp: Date;
    eventType: string;
    description: string;
    iocs?: string[];
    impact?: string;
    metadata?: Record<string, any>;
}
/**
 * MITRE ATT&CK framework mapping
 */
export interface MITREMapping {
    tactic: string;
    tacticId: string;
    technique: string;
    techniqueId: string;
    subTechnique?: string;
    subTechniqueId?: string;
    platforms?: string[];
    dataSources?: string[];
    defenses?: string[];
    detections?: string[];
}
/**
 * STIX 2.1 compatible bundle
 */
export interface STIXBundle {
    type: 'bundle';
    id: string;
    spec_version: '2.1';
    objects: STIXObject[];
    created?: Date;
    modified?: Date;
}
/**
 * STIX domain object
 */
export interface STIXObject {
    type: string;
    spec_version: '2.1';
    id: string;
    created: Date;
    modified: Date;
    created_by_ref?: string;
    revoked?: boolean;
    labels?: string[];
    confidence?: number;
    lang?: string;
    external_references?: ExternalReference[];
    object_marking_refs?: string[];
    granular_markings?: GranularMarking[];
    extensions?: Record<string, any>;
}
/**
 * STIX external reference
 */
export interface ExternalReference {
    source_name: string;
    description?: string;
    url?: string;
    hashes?: Record<string, string>;
    external_id?: string;
}
/**
 * STIX granular marking
 */
export interface GranularMarking {
    lang?: string;
    marking_ref?: string;
    selectors: string[];
}
/**
 * TAXII 2.1 collection
 */
export interface TAXIICollection {
    id: string;
    title: string;
    description?: string;
    can_read: boolean;
    can_write: boolean;
    media_types: string[];
}
/**
 * Intelligence enrichment result
 */
export interface EnrichmentResult {
    iocId: string;
    provider: string;
    timestamp: Date;
    success: boolean;
    data?: Partial<IOCEnrichment>;
    error?: string;
    metadata?: Record<string, any>;
}
/**
 * Threat intelligence query
 */
export interface ThreatIntelQuery {
    types?: IOCType[];
    severities?: ThreatSeverity[];
    sources?: string[];
    tags?: string[];
    campaigns?: string[];
    threatActors?: string[];
    mitreAttackIds?: string[];
    dateRange?: {
        field: 'firstSeen' | 'lastSeen' | 'createdAt';
        start?: Date;
        end?: Date;
    };
    status?: ('active' | 'inactive' | 'expired' | 'false_positive')[];
    minConfidence?: number;
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
/**
 * Threat intelligence aggregation result
 */
export interface ThreatIntelStats {
    totalIOCs: number;
    activeIOCs: number;
    iocsByType: Record<IOCType, number>;
    iocsBySeverity: Record<ThreatSeverity, number>;
    topSources: Array<{
        source: string;
        count: number;
    }>;
    topThreatActors: Array<{
        actor: string;
        count: number;
    }>;
    topCampaigns: Array<{
        campaign: string;
        count: number;
    }>;
    recentActivity: Array<{
        date: string;
        count: number;
    }>;
    mitreAttackCoverage: Array<{
        tacticId: string;
        count: number;
    }>;
}
/**
 * Sequelize ThreatFeed model attributes for threat feed management.
 *
 * @example
 * ```typescript
 * class ThreatFeed extends Model {}
 * ThreatFeed.init(getThreatFeedModelAttributes(), {
 *   sequelize,
 *   tableName: 'threat_feeds',
 *   timestamps: true
 * });
 * ```
 */
export declare const getThreatFeedModelAttributes: () => {
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
    feedUrl: {
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
    updateInterval: {
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
    filters: {
        type: string;
        defaultValue: never[];
    };
    lastSync: {
        type: string;
        allowNull: boolean;
    };
    lastSyncStatus: {
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
 * Sequelize IOC model attributes for indicator management.
 *
 * @example
 * ```typescript
 * class IOC extends Model {}
 * IOC.init(getIOCModelAttributes(), {
 *   sequelize,
 *   tableName: 'indicators_of_compromise',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['type', 'status'] },
 *     { fields: ['hash'] },
 *     { fields: ['severity'] }
 *   ]
 * });
 * ```
 */
export declare const getIOCModelAttributes: () => {
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
    sources: {
        type: string;
        defaultValue: never[];
    };
    tags: {
        type: string;
        defaultValue: never[];
    };
    relatedIOCs: {
        type: string;
        defaultValue: never[];
    };
    threatActors: {
        type: string;
        defaultValue: never[];
    };
    campaigns: {
        type: string;
        defaultValue: never[];
    };
    mitreAttack: {
        type: string;
        defaultValue: never[];
    };
    metadata: {
        type: string;
        defaultValue: {};
    };
    status: {
        type: string;
        allowNull: boolean;
        defaultValue: string;
    };
    falsePositiveReason: {
        type: string;
        allowNull: boolean;
    };
    enrichment: {
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
 * Sequelize ThreatActor model attributes.
 *
 * @example
 * ```typescript
 * class ThreatActor extends Model {}
 * ThreatActor.init(getThreatActorModelAttributes(), {
 *   sequelize,
 *   tableName: 'threat_actors',
 *   timestamps: true
 * });
 * ```
 */
export declare const getThreatActorModelAttributes: () => {
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
    aliases: {
        type: string;
        defaultValue: never[];
    };
    type: {
        type: string;
        allowNull: boolean;
    };
    sophistication: {
        type: string;
        allowNull: boolean;
    };
    motivation: {
        type: string;
        defaultValue: never[];
    };
    targetedSectors: {
        type: string;
        defaultValue: never[];
    };
    targetedCountries: {
        type: string;
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
    description: {
        type: string;
        allowNull: boolean;
    };
    ttps: {
        type: string;
        defaultValue: never[];
    };
    mitreAttack: {
        type: string;
        defaultValue: never[];
    };
    associatedCampaigns: {
        type: string;
        defaultValue: never[];
    };
    associatedIOCs: {
        type: string;
        defaultValue: never[];
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
 * Sequelize ThreatCampaign model attributes.
 *
 * @example
 * ```typescript
 * class ThreatCampaign extends Model {}
 * ThreatCampaign.init(getThreatCampaignModelAttributes(), {
 *   sequelize,
 *   tableName: 'threat_campaigns',
 *   timestamps: true
 * });
 * ```
 */
export declare const getThreatCampaignModelAttributes: () => {
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
    aliases: {
        type: string;
        defaultValue: never[];
    };
    description: {
        type: string;
        allowNull: boolean;
    };
    status: {
        type: string;
        allowNull: boolean;
    };
    severity: {
        type: string;
        allowNull: boolean;
    };
    startDate: {
        type: string;
        allowNull: boolean;
    };
    endDate: {
        type: string;
        allowNull: boolean;
    };
    lastActivity: {
        type: string;
        allowNull: boolean;
    };
    threatActors: {
        type: string;
        defaultValue: never[];
    };
    targetedSectors: {
        type: string;
        defaultValue: never[];
    };
    targetedCountries: {
        type: string;
        defaultValue: never[];
    };
    objectives: {
        type: string;
        defaultValue: never[];
    };
    iocs: {
        type: string;
        defaultValue: never[];
    };
    mitreAttack: {
        type: string;
        defaultValue: never[];
    };
    timeline: {
        type: string;
        defaultValue: never[];
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
 * Aggregates threat intelligence from multiple feeds.
 *
 * @param {ThreatFeedConfig[]} feeds - Array of threat feed configurations
 * @param {object} [options] - Aggregation options
 * @returns {Promise<IOC[]>} Aggregated IOCs
 *
 * @example
 * ```typescript
 * const feeds = [
 *   { id: 'feed1', name: 'AlienVault OTX', provider: 'alienvault', ... },
 *   { id: 'feed2', name: 'MISP', provider: 'misp', ... }
 * ];
 * const iocs = await aggregateThreatFeeds(feeds, { deduplication: true });
 * ```
 */
export declare const aggregateThreatFeeds: (feeds: ThreatFeedConfig[], options?: {
    deduplication?: boolean;
    minConfidence?: number;
    maxAge?: number;
}) => Promise<IOC[]>;
/**
 * Fetches threat intelligence data from a configured feed.
 *
 * @param {ThreatFeedConfig} feed - Threat feed configuration
 * @returns {Promise<IOC[]>} Fetched IOCs
 *
 * @example
 * ```typescript
 * const feed = { id: 'feed1', feedUrl: 'https://api.example.com/threats', ... };
 * const iocs = await fetchFeedData(feed);
 * ```
 */
export declare const fetchFeedData: (feed: ThreatFeedConfig) => Promise<IOC[]>;
/**
 * Normalizes IOC value for consistent comparison and storage.
 *
 * @param {IOCType} type - IOC type
 * @param {string} value - IOC value
 * @returns {string} Normalized hash
 *
 * @example
 * ```typescript
 * const hash = normalizeIOCValue(IOCType.DOMAIN, 'EXAMPLE.COM');
 * // Returns consistent hash for 'example.com'
 * ```
 */
export declare const normalizeIOCValue: (type: IOCType, value: string) => string;
/**
 * Validates IOC format and structure.
 *
 * @param {IOCType} type - IOC type
 * @param {string} value - IOC value
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const result = validateIOCFormat(IOCType.IPV4, '192.168.1.1');
 * if (result.valid) {
 *   // Process IOC
 * } else {
 *   console.error(result.error);
 * }
 * ```
 */
export declare const validateIOCFormat: (type: IOCType, value: string) => {
    valid: boolean;
    error?: string;
    normalized?: string;
};
/**
 * Applies filters to threat feed data.
 *
 * @param {IOC[]} iocs - Array of IOCs
 * @param {ThreatFeedFilter[]} filters - Filters to apply
 * @returns {IOC[]} Filtered IOCs
 *
 * @example
 * ```typescript
 * const filtered = applyThreatFeedFilters(iocs, [
 *   { field: 'severity', operator: 'in', value: ['HIGH', 'CRITICAL'] },
 *   { field: 'confidence', operator: 'greater_than', value: 70 }
 * ]);
 * ```
 */
export declare const applyThreatFeedFilters: (iocs: IOC[], filters: ThreatFeedFilter[]) => IOC[];
/**
 * Synchronizes threat feed on schedule.
 *
 * @param {ThreatFeedConfig} feed - Feed configuration
 * @param {Function} callback - Callback for processing new IOCs
 * @returns {object} Sync result
 *
 * @example
 * ```typescript
 * const result = await syncThreatFeed(feed, async (iocs) => {
 *   await saveIOCsToDatabase(iocs);
 * });
 * ```
 */
export declare const syncThreatFeed: (feed: ThreatFeedConfig, callback: (iocs: IOC[]) => Promise<void>) => Promise<{
    success: boolean;
    count: number;
    error?: string;
}>;
/**
 * Creates a new IOC entry with validation.
 *
 * @param {Partial<IOC>} iocData - IOC data
 * @returns {IOC} Created IOC
 *
 * @example
 * ```typescript
 * const ioc = createIOC({
 *   type: IOCType.DOMAIN,
 *   value: 'malicious.example.com',
 *   severity: ThreatSeverity.HIGH,
 *   confidence: 90
 * });
 * ```
 */
export declare const createIOC: (iocData: Partial<IOC>) => IOC;
/**
 * Updates IOC with new information, merging sources.
 *
 * @param {IOC} existing - Existing IOC
 * @param {Partial<IOC>} updates - Updates to apply
 * @returns {IOC} Updated IOC
 *
 * @example
 * ```typescript
 * const updated = updateIOC(existingIOC, {
 *   confidence: 95,
 *   severity: ThreatSeverity.CRITICAL,
 *   tags: ['ransomware', 'apt28']
 * });
 * ```
 */
export declare const updateIOC: (existing: IOC, updates: Partial<IOC>) => IOC;
/**
 * Marks IOC as false positive with reason.
 *
 * @param {IOC} ioc - IOC to mark
 * @param {string} reason - Reason for false positive
 * @returns {IOC} Updated IOC
 *
 * @example
 * ```typescript
 * const updated = markIOCFalsePositive(ioc, 'Whitelisted internal IP');
 * ```
 */
export declare const markIOCFalsePositive: (ioc: IOC, reason: string) => IOC;
/**
 * Expires IOC based on TTL or manual expiration.
 *
 * @param {IOC} ioc - IOC to check
 * @param {number} [ttl] - Time to live in milliseconds
 * @returns {IOC} Potentially expired IOC
 *
 * @example
 * ```typescript
 * const ioc = expireIOC(existingIOC, 30 * 24 * 60 * 60 * 1000); // 30 days
 * if (ioc.status === 'expired') {
 *   // Handle expired IOC
 * }
 * ```
 */
export declare const expireIOC: (ioc: IOC, ttl?: number) => IOC;
/**
 * Finds related IOCs based on various criteria.
 *
 * @param {IOC} ioc - Source IOC
 * @param {IOC[]} allIOCs - All available IOCs
 * @param {object} [options] - Relation options
 * @returns {IOC[]} Related IOCs
 *
 * @example
 * ```typescript
 * const related = findRelatedIOCs(ioc, allIOCs, {
 *   sameCampaign: true,
 *   sameThreatActor: true,
 *   similarType: true
 * });
 * ```
 */
export declare const findRelatedIOCs: (ioc: IOC, allIOCs: IOC[], options?: {
    sameCampaign?: boolean;
    sameThreatActor?: boolean;
    similarType?: boolean;
    timeWindow?: number;
}) => IOC[];
/**
 * Queries IOCs with advanced filtering.
 *
 * @param {IOC[]} iocs - All IOCs
 * @param {ThreatIntelQuery} query - Query parameters
 * @returns {IOC[]} Matching IOCs
 *
 * @example
 * ```typescript
 * const results = queryIOCs(allIOCs, {
 *   types: [IOCType.IPV4, IOCType.DOMAIN],
 *   severities: [ThreatSeverity.HIGH, ThreatSeverity.CRITICAL],
 *   minConfidence: 80,
 *   status: ['active'],
 *   limit: 100
 * });
 * ```
 */
export declare const queryIOCs: (iocs: IOC[], query: ThreatIntelQuery) => IOC[];
/**
 * Creates threat actor profile.
 *
 * @param {Partial<ThreatActor>} actorData - Actor data
 * @returns {ThreatActor} Created threat actor
 *
 * @example
 * ```typescript
 * const actor = createThreatActor({
 *   name: 'APT28',
 *   aliases: ['Fancy Bear', 'Sofacy'],
 *   type: ThreatActorType.NATION_STATE,
 *   sophistication: ThreatSophistication.ADVANCED
 * });
 * ```
 */
export declare const createThreatActor: (actorData: Partial<ThreatActor>) => ThreatActor;
/**
 * Links threat actor to IOCs.
 *
 * @param {string} actorId - Threat actor ID
 * @param {string[]} iocIds - IOC IDs to link
 * @param {IOC[]} iocs - All IOCs
 * @returns {IOC[]} Updated IOCs
 *
 * @example
 * ```typescript
 * const updated = linkThreatActorToIOCs('actor-123', ['ioc-1', 'ioc-2'], allIOCs);
 * ```
 */
export declare const linkThreatActorToIOCs: (actorId: string, iocIds: string[], iocs: IOC[]) => IOC[];
/**
 * Tracks threat actor activity over time.
 *
 * @param {ThreatActor} actor - Threat actor
 * @param {IOC[]} iocs - Associated IOCs
 * @returns {object} Activity timeline
 *
 * @example
 * ```typescript
 * const timeline = trackThreatActorActivity(actor, associatedIOCs);
 * console.log(timeline.activityByMonth);
 * ```
 */
export declare const trackThreatActorActivity: (actor: ThreatActor, iocs: IOC[]) => {
    totalIOCs: number;
    activityByMonth: Record<string, number>;
    mostCommonTypes: Array<{
        type: IOCType;
        count: number;
    }>;
    averageConfidence: number;
};
/**
 * Creates threat campaign.
 *
 * @param {Partial<ThreatCampaign>} campaignData - Campaign data
 * @returns {ThreatCampaign} Created campaign
 *
 * @example
 * ```typescript
 * const campaign = createThreatCampaign({
 *   name: 'Operation Aurora',
 *   severity: ThreatSeverity.CRITICAL,
 *   status: CampaignStatus.ACTIVE,
 *   targetedSectors: ['technology', 'defense']
 * });
 * ```
 */
export declare const createThreatCampaign: (campaignData: Partial<ThreatCampaign>) => ThreatCampaign;
/**
 * Analyzes campaign timeline and patterns.
 *
 * @param {ThreatCampaign} campaign - Campaign to analyze
 * @param {IOC[]} iocs - Associated IOCs
 * @returns {object} Campaign analysis
 *
 * @example
 * ```typescript
 * const analysis = analyzeCampaignTimeline(campaign, iocs);
 * console.log(analysis.phases);
 * ```
 */
export declare const analyzeCampaignTimeline: (campaign: ThreatCampaign, iocs: IOC[]) => {
    duration: number;
    phases: Array<{
        phase: string;
        start: Date;
        end?: Date;
        iocCount: number;
    }>;
    peakActivity: Date;
    iocsByType: Record<IOCType, number>;
};
/**
 * Adds event to campaign timeline.
 *
 * @param {ThreatCampaign} campaign - Campaign
 * @param {Partial<CampaignEvent>} event - Event to add
 * @returns {ThreatCampaign} Updated campaign
 *
 * @example
 * ```typescript
 * const updated = addCampaignEvent(campaign, {
 *   eventType: 'INITIAL_COMPROMISE',
 *   description: 'Phishing emails sent to targets',
 *   iocs: ['ioc-1', 'ioc-2']
 * });
 * ```
 */
export declare const addCampaignEvent: (campaign: ThreatCampaign, event: Partial<CampaignEvent>) => ThreatCampaign;
/**
 * Maps IOC to MITRE ATT&CK techniques.
 *
 * @param {IOC} ioc - IOC to map
 * @param {MITREMapping[]} mappings - MITRE mappings
 * @returns {IOC} Updated IOC
 *
 * @example
 * ```typescript
 * const mapped = mapIOCToMITRE(ioc, [
 *   {
 *     tactic: 'Initial Access',
 *     tacticId: 'TA0001',
 *     technique: 'Phishing',
 *     techniqueId: 'T1566'
 *   }
 * ]);
 * ```
 */
export declare const mapIOCToMITRE: (ioc: IOC, mappings: MITREMapping[]) => IOC;
/**
 * Gets MITRE ATT&CK coverage for a set of IOCs.
 *
 * @param {IOC[]} iocs - IOCs to analyze
 * @returns {object} Coverage statistics
 *
 * @example
 * ```typescript
 * const coverage = getMITRECoverage(iocs);
 * console.log(coverage.tacticsCovered);
 * console.log(coverage.techniquesCovered);
 * ```
 */
export declare const getMITRECoverage: (iocs: IOC[]) => {
    tacticsCovered: string[];
    techniquesCovered: string[];
    coverageByTactic: Record<string, number>;
    mostCommonTechniques: Array<{
        techniqueId: string;
        technique: string;
        count: number;
    }>;
};
/**
 * Suggests MITRE ATT&CK mappings based on IOC type and context.
 *
 * @param {IOC} ioc - IOC to analyze
 * @returns {MITREMapping[]} Suggested mappings
 *
 * @example
 * ```typescript
 * const suggestions = suggestMITREMappings(ioc);
 * suggestions.forEach(mapping => {
 *   console.log(`${mapping.technique} (${mapping.techniqueId})`);
 * });
 * ```
 */
export declare const suggestMITREMappings: (ioc: IOC) => MITREMapping[];
/**
 * Converts IOC to STIX 2.1 indicator object.
 *
 * @param {IOC} ioc - IOC to convert
 * @returns {STIXObject} STIX indicator
 *
 * @example
 * ```typescript
 * const stixIndicator = convertIOCToSTIX(ioc);
 * // Returns STIX 2.1 compliant indicator object
 * ```
 */
export declare const convertIOCToSTIX: (ioc: IOC) => STIXObject;
/**
 * Generates STIX pattern from IOC.
 *
 * @param {IOC} ioc - IOC
 * @returns {string} STIX pattern
 *
 * @example
 * ```typescript
 * const pattern = generateSTIXPattern(ioc);
 * // Returns: "[ipv4-addr:value = '192.0.2.1']"
 * ```
 */
export declare const generateSTIXPattern: (ioc: IOC) => string;
/**
 * Creates STIX bundle from multiple IOCs.
 *
 * @param {IOC[]} iocs - IOCs to include
 * @param {object} [options] - Bundle options
 * @returns {STIXBundle} STIX bundle
 *
 * @example
 * ```typescript
 * const bundle = createSTIXBundle(iocs, {
 *   includeRelationships: true,
 *   includeCampaigns: true
 * });
 * ```
 */
export declare const createSTIXBundle: (iocs: IOC[], options?: {
    includeRelationships?: boolean;
    includeCampaigns?: boolean;
    includeThreatActors?: boolean;
}) => STIXBundle;
/**
 * Parses STIX bundle and extracts IOCs.
 *
 * @param {STIXBundle} bundle - STIX bundle
 * @returns {IOC[]} Extracted IOCs
 *
 * @example
 * ```typescript
 * const iocs = parseSTIXBundle(stixBundle);
 * iocs.forEach(ioc => console.log(ioc.value));
 * ```
 */
export declare const parseSTIXBundle: (bundle: STIXBundle) => IOC[];
/**
 * Parses STIX indicator to IOC.
 *
 * @param {any} indicator - STIX indicator
 * @returns {IOC | null} Parsed IOC
 */
export declare const parseSTIXIndicator: (indicator: any) => IOC | null;
/**
 * Publishes IOCs to TAXII server.
 *
 * @param {STIXBundle} bundle - STIX bundle to publish
 * @param {object} config - TAXII server configuration
 * @returns {Promise<object>} Publication result
 *
 * @example
 * ```typescript
 * const result = await publishToTAXII(bundle, {
 *   serverUrl: 'https://taxii.example.com',
 *   collectionId: 'threat-intel',
 *   apiKey: 'your-api-key'
 * });
 * ```
 */
export declare const publishToTAXII: (bundle: STIXBundle, config: {
    serverUrl: string;
    collectionId: string;
    apiKey?: string;
}) => Promise<{
    success: boolean;
    objectsPublished: number;
    error?: string;
}>;
/**
 * Fetches threat intelligence from TAXII server.
 *
 * @param {object} config - TAXII server configuration
 * @param {object} [filters] - Query filters
 * @returns {Promise<STIXBundle>} Fetched STIX bundle
 *
 * @example
 * ```typescript
 * const bundle = await fetchFromTAXII({
 *   serverUrl: 'https://taxii.example.com',
 *   collectionId: 'threat-intel',
 *   apiKey: 'your-api-key'
 * }, {
 *   addedAfter: new Date('2024-01-01')
 * });
 * ```
 */
export declare const fetchFromTAXII: (config: {
    serverUrl: string;
    collectionId: string;
    apiKey?: string;
}, filters?: {
    addedAfter?: Date;
    types?: string[];
    limit?: number;
}) => Promise<STIXBundle>;
/**
 * Enriches IOC with geolocation data.
 *
 * @param {IOC} ioc - IOC to enrich
 * @param {any} provider - Geolocation provider
 * @returns {Promise<IOC>} Enriched IOC
 *
 * @example
 * ```typescript
 * const enriched = await enrichIOCGeolocation(ioc, geoipProvider);
 * console.log(enriched.enrichment?.geolocation);
 * ```
 */
export declare const enrichIOCGeolocation: (ioc: IOC, provider?: any) => Promise<IOC>;
/**
 * Enriches IOC with reputation data.
 *
 * @param {IOC} ioc - IOC to enrich
 * @param {any} provider - Reputation provider
 * @returns {Promise<IOC>} Enriched IOC
 *
 * @example
 * ```typescript
 * const enriched = await enrichIOCReputation(ioc, virusTotalProvider);
 * console.log(enriched.enrichment?.reputation?.score);
 * ```
 */
export declare const enrichIOCReputation: (ioc: IOC, provider?: any) => Promise<IOC>;
/**
 * Enriches IOC with WHOIS data.
 *
 * @param {IOC} ioc - IOC to enrich
 * @returns {Promise<IOC>} Enriched IOC
 *
 * @example
 * ```typescript
 * const enriched = await enrichIOCWhois(ioc);
 * console.log(enriched.enrichment?.whois?.registrar);
 * ```
 */
export declare const enrichIOCWhois: (ioc: IOC) => Promise<IOC>;
/**
 * Enriches IOC with DNS data.
 *
 * @param {IOC} ioc - IOC to enrich
 * @returns {Promise<IOC>} Enriched IOC
 *
 * @example
 * ```typescript
 * const enriched = await enrichIOCDNS(ioc);
 * console.log(enriched.enrichment?.dns?.aRecords);
 * ```
 */
export declare const enrichIOCDNS: (ioc: IOC) => Promise<IOC>;
/**
 * Performs comprehensive IOC enrichment.
 *
 * @param {IOC} ioc - IOC to enrich
 * @param {object} [providers] - Enrichment providers
 * @returns {Promise<EnrichmentResult>} Enrichment result
 *
 * @example
 * ```typescript
 * const result = await enrichIOC(ioc, {
 *   geolocation: geoipProvider,
 *   reputation: virusTotalProvider
 * });
 * ```
 */
export declare const enrichIOC: (ioc: IOC, providers?: {
    geolocation?: any;
    reputation?: any;
}) => Promise<EnrichmentResult>;
/**
 * Generates comprehensive threat intelligence statistics.
 *
 * @param {IOC[]} iocs - All IOCs
 * @param {ThreatActor[]} actors - All threat actors
 * @param {ThreatCampaign[]} campaigns - All campaigns
 * @returns {ThreatIntelStats} Statistics
 *
 * @example
 * ```typescript
 * const stats = generateThreatIntelStats(iocs, actors, campaigns);
 * console.log(`Total IOCs: ${stats.totalIOCs}`);
 * console.log(`Active IOCs: ${stats.activeIOCs}`);
 * ```
 */
export declare const generateThreatIntelStats: (iocs: IOC[], actors: ThreatActor[], campaigns: ThreatCampaign[]) => ThreatIntelStats;
declare const _default: {
    getThreatFeedModelAttributes: () => {
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
        feedUrl: {
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
        updateInterval: {
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
        filters: {
            type: string;
            defaultValue: never[];
        };
        lastSync: {
            type: string;
            allowNull: boolean;
        };
        lastSyncStatus: {
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
    getIOCModelAttributes: () => {
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
        sources: {
            type: string;
            defaultValue: never[];
        };
        tags: {
            type: string;
            defaultValue: never[];
        };
        relatedIOCs: {
            type: string;
            defaultValue: never[];
        };
        threatActors: {
            type: string;
            defaultValue: never[];
        };
        campaigns: {
            type: string;
            defaultValue: never[];
        };
        mitreAttack: {
            type: string;
            defaultValue: never[];
        };
        metadata: {
            type: string;
            defaultValue: {};
        };
        status: {
            type: string;
            allowNull: boolean;
            defaultValue: string;
        };
        falsePositiveReason: {
            type: string;
            allowNull: boolean;
        };
        enrichment: {
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
    getThreatActorModelAttributes: () => {
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
        aliases: {
            type: string;
            defaultValue: never[];
        };
        type: {
            type: string;
            allowNull: boolean;
        };
        sophistication: {
            type: string;
            allowNull: boolean;
        };
        motivation: {
            type: string;
            defaultValue: never[];
        };
        targetedSectors: {
            type: string;
            defaultValue: never[];
        };
        targetedCountries: {
            type: string;
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
        description: {
            type: string;
            allowNull: boolean;
        };
        ttps: {
            type: string;
            defaultValue: never[];
        };
        mitreAttack: {
            type: string;
            defaultValue: never[];
        };
        associatedCampaigns: {
            type: string;
            defaultValue: never[];
        };
        associatedIOCs: {
            type: string;
            defaultValue: never[];
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
    getThreatCampaignModelAttributes: () => {
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
        aliases: {
            type: string;
            defaultValue: never[];
        };
        description: {
            type: string;
            allowNull: boolean;
        };
        status: {
            type: string;
            allowNull: boolean;
        };
        severity: {
            type: string;
            allowNull: boolean;
        };
        startDate: {
            type: string;
            allowNull: boolean;
        };
        endDate: {
            type: string;
            allowNull: boolean;
        };
        lastActivity: {
            type: string;
            allowNull: boolean;
        };
        threatActors: {
            type: string;
            defaultValue: never[];
        };
        targetedSectors: {
            type: string;
            defaultValue: never[];
        };
        targetedCountries: {
            type: string;
            defaultValue: never[];
        };
        objectives: {
            type: string;
            defaultValue: never[];
        };
        iocs: {
            type: string;
            defaultValue: never[];
        };
        mitreAttack: {
            type: string;
            defaultValue: never[];
        };
        timeline: {
            type: string;
            defaultValue: never[];
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
    aggregateThreatFeeds: (feeds: ThreatFeedConfig[], options?: {
        deduplication?: boolean;
        minConfidence?: number;
        maxAge?: number;
    }) => Promise<IOC[]>;
    fetchFeedData: (feed: ThreatFeedConfig) => Promise<IOC[]>;
    normalizeIOCValue: (type: IOCType, value: string) => string;
    validateIOCFormat: (type: IOCType, value: string) => {
        valid: boolean;
        error?: string;
        normalized?: string;
    };
    applyThreatFeedFilters: (iocs: IOC[], filters: ThreatFeedFilter[]) => IOC[];
    syncThreatFeed: (feed: ThreatFeedConfig, callback: (iocs: IOC[]) => Promise<void>) => Promise<{
        success: boolean;
        count: number;
        error?: string;
    }>;
    createIOC: (iocData: Partial<IOC>) => IOC;
    updateIOC: (existing: IOC, updates: Partial<IOC>) => IOC;
    markIOCFalsePositive: (ioc: IOC, reason: string) => IOC;
    expireIOC: (ioc: IOC, ttl?: number) => IOC;
    findRelatedIOCs: (ioc: IOC, allIOCs: IOC[], options?: {
        sameCampaign?: boolean;
        sameThreatActor?: boolean;
        similarType?: boolean;
        timeWindow?: number;
    }) => IOC[];
    queryIOCs: (iocs: IOC[], query: ThreatIntelQuery) => IOC[];
    createThreatActor: (actorData: Partial<ThreatActor>) => ThreatActor;
    linkThreatActorToIOCs: (actorId: string, iocIds: string[], iocs: IOC[]) => IOC[];
    trackThreatActorActivity: (actor: ThreatActor, iocs: IOC[]) => {
        totalIOCs: number;
        activityByMonth: Record<string, number>;
        mostCommonTypes: Array<{
            type: IOCType;
            count: number;
        }>;
        averageConfidence: number;
    };
    createThreatCampaign: (campaignData: Partial<ThreatCampaign>) => ThreatCampaign;
    analyzeCampaignTimeline: (campaign: ThreatCampaign, iocs: IOC[]) => {
        duration: number;
        phases: Array<{
            phase: string;
            start: Date;
            end?: Date;
            iocCount: number;
        }>;
        peakActivity: Date;
        iocsByType: Record<IOCType, number>;
    };
    addCampaignEvent: (campaign: ThreatCampaign, event: Partial<CampaignEvent>) => ThreatCampaign;
    mapIOCToMITRE: (ioc: IOC, mappings: MITREMapping[]) => IOC;
    getMITRECoverage: (iocs: IOC[]) => {
        tacticsCovered: string[];
        techniquesCovered: string[];
        coverageByTactic: Record<string, number>;
        mostCommonTechniques: Array<{
            techniqueId: string;
            technique: string;
            count: number;
        }>;
    };
    suggestMITREMappings: (ioc: IOC) => MITREMapping[];
    convertIOCToSTIX: (ioc: IOC) => STIXObject;
    generateSTIXPattern: (ioc: IOC) => string;
    createSTIXBundle: (iocs: IOC[], options?: {
        includeRelationships?: boolean;
        includeCampaigns?: boolean;
        includeThreatActors?: boolean;
    }) => STIXBundle;
    parseSTIXBundle: (bundle: STIXBundle) => IOC[];
    parseSTIXIndicator: (indicator: any) => IOC | null;
    publishToTAXII: (bundle: STIXBundle, config: {
        serverUrl: string;
        collectionId: string;
        apiKey?: string;
    }) => Promise<{
        success: boolean;
        objectsPublished: number;
        error?: string;
    }>;
    fetchFromTAXII: (config: {
        serverUrl: string;
        collectionId: string;
        apiKey?: string;
    }, filters?: {
        addedAfter?: Date;
        types?: string[];
        limit?: number;
    }) => Promise<STIXBundle>;
    enrichIOCGeolocation: (ioc: IOC, provider?: any) => Promise<IOC>;
    enrichIOCReputation: (ioc: IOC, provider?: any) => Promise<IOC>;
    enrichIOCWhois: (ioc: IOC) => Promise<IOC>;
    enrichIOCDNS: (ioc: IOC) => Promise<IOC>;
    enrichIOC: (ioc: IOC, providers?: {
        geolocation?: any;
        reputation?: any;
    }) => Promise<EnrichmentResult>;
    generateThreatIntelStats: (iocs: IOC[], actors: ThreatActor[], campaigns: ThreatCampaign[]) => ThreatIntelStats;
};
export default _default;
//# sourceMappingURL=threat-intelligence-kit.d.ts.map