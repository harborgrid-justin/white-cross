/**
 * LOC: TFID1234567
 * File: /reuse/threat/threat-feeds-integration-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Threat intelligence services
 *   - Feed aggregation engines
 *   - Threat detection systems
 */
/**
 * File: /reuse/threat/threat-feeds-integration-kit.ts
 * Locator: WC-UTL-TFID-001
 * Purpose: Comprehensive Threat Feed Integration Utilities - Feed connectors, polling, normalization, aggregation
 *
 * Upstream: Independent utility module for threat feed integration
 * Downstream: ../backend/threat/*, threat services, feed aggregators, detection engines
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Swagger/OpenAPI, Sequelize 6.x
 * Exports: 43 utility functions for threat feed integration, normalization, deduplication, rate limiting
 *
 * LLM Context: Comprehensive threat feed integration utilities for implementing production-ready threat intelligence
 * systems. Provides feed connectors, polling mechanisms, webhook handlers, feed normalization, multi-feed aggregation,
 * health monitoring, deduplication, rate limiting, and complete API design patterns. Essential for building scalable
 * threat intelligence platforms.
 */
interface ThreatFeedConfig {
    id: string;
    name: string;
    feedType: 'rest' | 'webhook' | 'file' | 'stream';
    url: string;
    apiKey?: string;
    pollInterval?: number;
    format: 'json' | 'xml' | 'csv' | 'stix' | 'custom';
    enabled: boolean;
    priority: number;
    tags: string[];
}
interface ThreatFeedConnector {
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
    fetch: () => Promise<ThreatIndicator[]>;
    health: () => Promise<FeedHealthStatus>;
}
interface ThreatIndicator {
    id: string;
    type: 'ip' | 'domain' | 'url' | 'hash' | 'email' | 'cve';
    value: string;
    confidence: number;
    severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
    firstSeen: Date;
    lastSeen: Date;
    source: string;
    tags: string[];
    metadata?: Record<string, unknown>;
}
interface FeedHealthStatus {
    feedId: string;
    status: 'healthy' | 'degraded' | 'down';
    lastSuccess: Date | null;
    lastFailure: Date | null;
    consecutiveFailures: number;
    uptime: number;
    latency: number;
    errorRate: number;
}
interface FeedPollingConfig {
    feedId: string;
    interval: number;
    timeout: number;
    retryAttempts: number;
    backoffMultiplier: number;
}
interface WebhookConfig {
    feedId: string;
    endpoint: string;
    secret: string;
    validateSignature: boolean;
    ipWhitelist?: string[];
}
interface FeedNormalizationRule {
    feedId: string;
    sourceField: string;
    targetField: string;
    transform?: (value: unknown) => unknown;
    required: boolean;
}
interface DeduplicationConfig {
    strategy: 'hash' | 'composite' | 'fuzzy';
    fields: string[];
    timeWindow?: number;
    similarityThreshold?: number;
}
interface FeedAggregationRule {
    feeds: string[];
    mergeStrategy: 'priority' | 'consensus' | 'latest';
    conflictResolution: 'highest-confidence' | 'newest' | 'custom';
    minimumSources?: number;
}
interface RateLimitConfig {
    feedId: string;
    requestsPerMinute: number;
    requestsPerHour: number;
    requestsPerDay: number;
    burstLimit: number;
}
interface FeedMetrics {
    feedId: string;
    indicatorsReceived: number;
    indicatorsProcessed: number;
    indicatorsRejected: number;
    averageProcessingTime: number;
    errorCount: number;
    lastUpdated: Date;
}
/**
 * Creates a REST API threat feed connector.
 *
 * @param {ThreatFeedConfig} config - Feed configuration
 * @returns {ThreatFeedConnector} REST feed connector instance
 *
 * @example
 * ```typescript
 * const connector = createRestFeedConnector({
 *   id: 'feed-1',
 *   name: 'AlienVault OTX',
 *   feedType: 'rest',
 *   url: 'https://otx.alienvault.com/api/v1/pulses',
 *   apiKey: 'your-api-key',
 *   format: 'json',
 *   enabled: true,
 *   priority: 1,
 *   tags: ['ioc', 'malware']
 * });
 * await connector.connect();
 * const indicators = await connector.fetch();
 * ```
 */
export declare const createRestFeedConnector: (config: ThreatFeedConfig) => ThreatFeedConnector;
/**
 * Creates a webhook-based threat feed connector.
 *
 * @param {ThreatFeedConfig} config - Feed configuration
 * @param {WebhookConfig} webhookConfig - Webhook configuration
 * @returns {ThreatFeedConnector} Webhook feed connector instance
 *
 * @example
 * ```typescript
 * const connector = createWebhookFeedConnector(
 *   { id: 'feed-2', name: 'Custom Feed', feedType: 'webhook', ... },
 *   { feedId: 'feed-2', endpoint: '/webhooks/threat', secret: 'secret-key', validateSignature: true }
 * );
 * ```
 */
export declare const createWebhookFeedConnector: (config: ThreatFeedConfig, webhookConfig: WebhookConfig) => ThreatFeedConnector;
/**
 * Creates a file-based threat feed connector.
 *
 * @param {ThreatFeedConfig} config - Feed configuration
 * @returns {ThreatFeedConnector} File feed connector instance
 *
 * @example
 * ```typescript
 * const connector = createFileFeedConnector({
 *   id: 'feed-3',
 *   name: 'Local IOC File',
 *   feedType: 'file',
 *   url: 'file:///data/iocs.json',
 *   format: 'json',
 *   ...
 * });
 * ```
 */
export declare const createFileFeedConnector: (config: ThreatFeedConfig) => ThreatFeedConnector;
/**
 * Creates a polling scheduler for threat feeds.
 *
 * @param {FeedPollingConfig} config - Polling configuration
 * @param {() => Promise<ThreatIndicator[]>} fetchFn - Function to fetch indicators
 * @returns {object} Polling scheduler with start/stop methods
 *
 * @example
 * ```typescript
 * const scheduler = createFeedPollingScheduler(
 *   { feedId: 'feed-1', interval: 300000, timeout: 30000, retryAttempts: 3, backoffMultiplier: 2 },
 *   async () => connector.fetch()
 * );
 * scheduler.start();
 * ```
 */
export declare const createFeedPollingScheduler: (config: FeedPollingConfig, fetchFn: () => Promise<ThreatIndicator[]>) => {
    start: () => void;
    stop: () => void;
    isRunning: () => boolean;
};
/**
 * Validates feed polling configuration.
 *
 * @param {FeedPollingConfig} config - Polling configuration to validate
 * @returns {boolean} True if configuration is valid
 * @throws {Error} If configuration is invalid
 *
 * @example
 * ```typescript
 * const isValid = validatePollingConfig({
 *   feedId: 'feed-1',
 *   interval: 60000,
 *   timeout: 5000,
 *   retryAttempts: 3,
 *   backoffMultiplier: 2
 * });
 * ```
 */
export declare const validatePollingConfig: (config: FeedPollingConfig) => boolean;
/**
 * Calculates next poll time based on backoff strategy.
 *
 * @param {number} failureCount - Number of consecutive failures
 * @param {number} baseInterval - Base polling interval in milliseconds
 * @param {number} backoffMultiplier - Backoff multiplier
 * @returns {number} Next poll time in milliseconds
 *
 * @example
 * ```typescript
 * const nextPoll = calculateNextPollTime(3, 60000, 2);
 * // Result: 480000 (8 minutes with exponential backoff)
 * ```
 */
export declare const calculateNextPollTime: (failureCount: number, baseInterval: number, backoffMultiplier: number) => number;
/**
 * Validates webhook signature for authenticity.
 *
 * @param {string} payload - Webhook payload
 * @param {string} signature - Provided signature
 * @param {string} secret - Webhook secret
 * @returns {boolean} True if signature is valid
 *
 * @example
 * ```typescript
 * const isValid = validateWebhookSignature(
 *   JSON.stringify(webhookData),
 *   headers['x-hub-signature-256'],
 *   'my-secret-key'
 * );
 * ```
 */
export declare const validateWebhookSignature: (payload: string, signature: string, secret: string) => boolean;
/**
 * Validates webhook source IP against whitelist.
 *
 * @param {string} sourceIp - Source IP address
 * @param {string[]} whitelist - Allowed IP addresses
 * @returns {boolean} True if IP is whitelisted
 *
 * @example
 * ```typescript
 * const isAllowed = validateWebhookSource('192.168.1.100', ['192.168.1.100', '10.0.0.0/8']);
 * ```
 */
export declare const validateWebhookSource: (sourceIp: string, whitelist: string[]) => boolean;
/**
 * Processes webhook payload and extracts threat indicators.
 *
 * @param {unknown} payload - Webhook payload
 * @param {string} format - Payload format
 * @returns {ThreatIndicator[]} Extracted threat indicators
 * @throws {Error} If payload is invalid
 *
 * @example
 * ```typescript
 * const indicators = processWebhookPayload(req.body, 'json');
 * ```
 */
export declare const processWebhookPayload: (payload: unknown, format: string) => ThreatIndicator[];
/**
 * Normalizes threat indicator from raw feed data.
 *
 * @param {Record<string, unknown>} rawData - Raw indicator data
 * @param {FeedNormalizationRule[]} rules - Normalization rules
 * @returns {ThreatIndicator} Normalized threat indicator
 * @throws {Error} If normalization fails
 *
 * @example
 * ```typescript
 * const indicator = normalizeThreatIndicator(
 *   { ip_address: '1.2.3.4', threat_level: 'high' },
 *   [{ feedId: 'feed-1', sourceField: 'ip_address', targetField: 'value', required: true }]
 * );
 * ```
 */
export declare const normalizeThreatIndicator: (rawData: Record<string, unknown>, rules: FeedNormalizationRule[]) => ThreatIndicator;
/**
 * Parses JSON threat feed format.
 *
 * @param {string} jsonData - JSON feed data
 * @returns {ThreatIndicator[]} Parsed threat indicators
 * @throws {Error} If parsing fails
 *
 * @example
 * ```typescript
 * const indicators = parseJsonFeed('{"indicators": [...]}');
 * ```
 */
export declare const parseJsonFeed: (jsonData: string) => ThreatIndicator[];
/**
 * Parses CSV threat feed format.
 *
 * @param {string} csvData - CSV feed data
 * @param {Record<string, string>} columnMapping - Column name mapping
 * @returns {ThreatIndicator[]} Parsed threat indicators
 *
 * @example
 * ```typescript
 * const indicators = parseCsvFeed(csvContent, { 'IP': 'value', 'Severity': 'severity' });
 * ```
 */
export declare const parseCsvFeed: (csvData: string, columnMapping: Record<string, string>) => ThreatIndicator[];
/**
 * Validates threat indicator data completeness.
 *
 * @param {ThreatIndicator} indicator - Threat indicator to validate
 * @returns {boolean} True if indicator is valid
 * @throws {Error} If indicator is invalid
 *
 * @example
 * ```typescript
 * const isValid = validateIndicator({
 *   id: 'ind-1',
 *   type: 'ip',
 *   value: '1.2.3.4',
 *   confidence: 85,
 *   severity: 'high',
 *   ...
 * });
 * ```
 */
export declare const validateIndicator: (indicator: ThreatIndicator) => boolean;
/**
 * Aggregates threat indicators from multiple feeds.
 *
 * @param {ThreatIndicator[][]} feedIndicators - Indicators from multiple feeds
 * @param {FeedAggregationRule} rule - Aggregation rule
 * @returns {ThreatIndicator[]} Aggregated indicators
 *
 * @example
 * ```typescript
 * const aggregated = aggregateThreatFeeds(
 *   [feed1Indicators, feed2Indicators, feed3Indicators],
 *   { feeds: ['feed-1', 'feed-2', 'feed-3'], mergeStrategy: 'consensus', conflictResolution: 'highest-confidence' }
 * );
 * ```
 */
export declare const aggregateThreatFeeds: (feedIndicators: ThreatIndicator[][], rule: FeedAggregationRule) => ThreatIndicator[];
/**
 * Enriches threat indicators with additional context.
 *
 * @param {ThreatIndicator} indicator - Indicator to enrich
 * @param {Record<string, unknown>} enrichmentData - Enrichment data
 * @returns {ThreatIndicator} Enriched indicator
 *
 * @example
 * ```typescript
 * const enriched = enrichIndicator(indicator, { geolocation: 'US', asn: 'AS15169' });
 * ```
 */
export declare const enrichIndicator: (indicator: ThreatIndicator, enrichmentData: Record<string, unknown>) => ThreatIndicator;
/**
 * Monitors feed health and updates status.
 *
 * @param {string} feedId - Feed identifier
 * @param {() => Promise<void>} healthCheckFn - Health check function
 * @returns {Promise<FeedHealthStatus>} Health status
 *
 * @example
 * ```typescript
 * const health = await monitorFeedHealth('feed-1', async () => connector.health());
 * ```
 */
export declare const monitorFeedHealth: (feedId: string, healthCheckFn: () => Promise<void>) => Promise<FeedHealthStatus>;
/**
 * Calculates feed uptime percentage.
 *
 * @param {number} totalChecks - Total health checks
 * @param {number} successfulChecks - Successful health checks
 * @returns {number} Uptime percentage
 *
 * @example
 * ```typescript
 * const uptime = calculateFeedUptime(1000, 995);
 * // Result: 99.5
 * ```
 */
export declare const calculateFeedUptime: (totalChecks: number, successfulChecks: number) => number;
/**
 * Calculates feed error rate.
 *
 * @param {number} totalRequests - Total requests
 * @param {number} failedRequests - Failed requests
 * @returns {number} Error rate percentage
 *
 * @example
 * ```typescript
 * const errorRate = calculateFeedErrorRate(10000, 50);
 * // Result: 0.5
 * ```
 */
export declare const calculateFeedErrorRate: (totalRequests: number, failedRequests: number) => number;
/**
 * Deduplicates threat indicators using hash-based strategy.
 *
 * @param {ThreatIndicator[]} indicators - Indicators to deduplicate
 * @param {DeduplicationConfig} config - Deduplication configuration
 * @returns {ThreatIndicator[]} Deduplicated indicators
 *
 * @example
 * ```typescript
 * const unique = deduplicateIndicators(indicators, {
 *   strategy: 'hash',
 *   fields: ['type', 'value'],
 *   timeWindow: 3600000
 * });
 * ```
 */
export declare const deduplicateIndicators: (indicators: ThreatIndicator[], config: DeduplicationConfig) => ThreatIndicator[];
/**
 * Generates deduplication key for an indicator.
 *
 * @param {ThreatIndicator} indicator - Threat indicator
 * @param {DeduplicationConfig} config - Deduplication configuration
 * @returns {string} Deduplication key
 *
 * @example
 * ```typescript
 * const key = generateDeduplicationKey(indicator, { strategy: 'composite', fields: ['type', 'value'] });
 * ```
 */
export declare const generateDeduplicationKey: (indicator: ThreatIndicator, config: DeduplicationConfig) => string;
/**
 * Creates a rate limiter for threat feed requests.
 *
 * @param {RateLimitConfig} config - Rate limit configuration
 * @returns {object} Rate limiter with checkLimit method
 *
 * @example
 * ```typescript
 * const limiter = createFeedRateLimiter({
 *   feedId: 'feed-1',
 *   requestsPerMinute: 60,
 *   requestsPerHour: 3000,
 *   requestsPerDay: 50000,
 *   burstLimit: 10
 * });
 * const canProceed = limiter.checkLimit();
 * ```
 */
export declare const createFeedRateLimiter: (config: RateLimitConfig) => {
    checkLimit: () => boolean;
};
/**
 * Validates rate limit configuration.
 *
 * @param {RateLimitConfig} config - Rate limit configuration
 * @returns {boolean} True if configuration is valid
 * @throws {Error} If configuration is invalid
 *
 * @example
 * ```typescript
 * const isValid = validateRateLimitConfig({
 *   feedId: 'feed-1',
 *   requestsPerMinute: 60,
 *   requestsPerHour: 3000,
 *   requestsPerDay: 50000,
 *   burstLimit: 10
 * });
 * ```
 */
export declare const validateRateLimitConfig: (config: RateLimitConfig) => boolean;
/**
 * Defines Sequelize model for threat feeds.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {any} DataTypes - Sequelize DataTypes
 * @returns {any} ThreatFeed model
 *
 * @example
 * ```typescript
 * const ThreatFeed = defineThreatFeedModel(sequelize, DataTypes);
 * const feed = await ThreatFeed.create({ name: 'AlienVault', feedType: 'rest', ... });
 * ```
 */
export declare const defineThreatFeedModel: (sequelize: any, DataTypes: any) => any;
/**
 * Defines Sequelize model for threat indicators.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {any} DataTypes - Sequelize DataTypes
 * @returns {any} ThreatIndicator model
 *
 * @example
 * ```typescript
 * const ThreatIndicator = defineThreatIndicatorModel(sequelize, DataTypes);
 * const indicator = await ThreatIndicator.create({ type: 'ip', value: '1.2.3.4', ... });
 * ```
 */
export declare const defineThreatIndicatorModel: (sequelize: any, DataTypes: any) => any;
/**
 * Defines Sequelize model for feed health tracking.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {any} DataTypes - Sequelize DataTypes
 * @returns {any} FeedHealth model
 *
 * @example
 * ```typescript
 * const FeedHealth = defineFeedHealthModel(sequelize, DataTypes);
 * const health = await FeedHealth.create({ feedId: 'feed-1', status: 'healthy', ... });
 * ```
 */
export declare const defineFeedHealthModel: (sequelize: any, DataTypes: any) => any;
/**
 * Creates NestJS controller for threat feed management.
 *
 * @returns {string} NestJS controller code
 *
 * @example
 * ```typescript
 * const controllerCode = createFeedManagementController();
 * ```
 */
export declare const createFeedManagementController: () => string;
/**
 * Creates OpenAPI specification for threat feed API.
 *
 * @returns {object} OpenAPI specification
 *
 * @example
 * ```typescript
 * const spec = createFeedApiSpec();
 * ```
 */
export declare const createFeedApiSpec: () => Record<string, unknown>;
/**
 * Calculates feed performance metrics.
 *
 * @param {string} feedId - Feed identifier
 * @param {number} timeWindow - Time window in milliseconds
 * @returns {Promise<FeedMetrics>} Feed metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculateFeedMetrics('feed-1', 3600000);
 * ```
 */
export declare const calculateFeedMetrics: (feedId: string, timeWindow: number) => Promise<FeedMetrics>;
/**
 * Analyzes feed quality score.
 *
 * @param {FeedMetrics} metrics - Feed metrics
 * @returns {number} Quality score (0-100)
 *
 * @example
 * ```typescript
 * const score = analyzeFeedQuality(metrics);
 * ```
 */
export declare const analyzeFeedQuality: (metrics: FeedMetrics) => number;
/**
 * Generates feed performance report.
 *
 * @param {string} feedId - Feed identifier
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {Promise<object>} Performance report
 *
 * @example
 * ```typescript
 * const report = await generateFeedReport('feed-1', new Date('2024-01-01'), new Date());
 * ```
 */
export declare const generateFeedReport: (feedId: string, startDate: Date, endDate: Date) => Promise<object>;
/**
 * Creates feed priority queue for scheduling.
 *
 * @param {ThreatFeedConfig[]} feeds - Feed configurations
 * @returns {ThreatFeedConfig[]} Prioritized feeds
 *
 * @example
 * ```typescript
 * const queue = createFeedPriorityQueue([feed1, feed2, feed3]);
 * ```
 */
export declare const createFeedPriorityQueue: (feeds: ThreatFeedConfig[]) => ThreatFeedConfig[];
/**
 * Coordinates multiple feed updates.
 *
 * @param {ThreatFeedConfig[]} feeds - Feeds to coordinate
 * @param {number} maxConcurrent - Maximum concurrent updates
 * @returns {Promise<void>} Coordination completion
 *
 * @example
 * ```typescript
 * await coordinateFeedUpdates([feed1, feed2, feed3], 3);
 * ```
 */
export declare const coordinateFeedUpdates: (feeds: ThreatFeedConfig[], maxConcurrent: number) => Promise<void>;
/**
 * Calculates optimal polling schedule.
 *
 * @param {ThreatFeedConfig} feed - Feed configuration
 * @param {FeedMetrics} metrics - Feed metrics
 * @returns {number} Optimal poll interval in milliseconds
 *
 * @example
 * ```typescript
 * const interval = calculateOptimalPollInterval(feed, metrics);
 * ```
 */
export declare const calculateOptimalPollInterval: (feed: ThreatFeedConfig, metrics: FeedMetrics) => number;
/**
 * Transforms feed data to standard format.
 *
 * @param {unknown} rawData - Raw feed data
 * @param {string} format - Source format
 * @returns {ThreatIndicator[]} Transformed indicators
 *
 * @example
 * ```typescript
 * const indicators = transformFeedData(rawData, 'json');
 * ```
 */
export declare const transformFeedData: (rawData: unknown, format: string) => ThreatIndicator[];
/**
 * Applies feed-specific transformations.
 *
 * @param {ThreatIndicator} indicator - Indicator to transform
 * @param {Record<string, (value: unknown) => unknown>} transformations - Transformation functions
 * @returns {ThreatIndicator} Transformed indicator
 *
 * @example
 * ```typescript
 * const transformed = applyFeedTransformations(indicator, { confidence: (v) => v * 0.9 });
 * ```
 */
export declare const applyFeedTransformations: (indicator: ThreatIndicator, transformations: Record<string, (value: unknown) => unknown>) => ThreatIndicator;
/**
 * Normalizes indicator confidence scores across feeds.
 *
 * @param {ThreatIndicator[]} indicators - Indicators to normalize
 * @param {Record<string, number>} feedWeights - Feed weight multipliers
 * @returns {ThreatIndicator[]} Normalized indicators
 *
 * @example
 * ```typescript
 * const normalized = normalizeConfidenceScores(indicators, { 'feed-1': 1.0, 'feed-2': 0.8 });
 * ```
 */
export declare const normalizeConfidenceScores: (indicators: ThreatIndicator[], feedWeights: Record<string, number>) => ThreatIndicator[];
/**
 * Caches feed data with TTL.
 *
 * @param {string} feedId - Feed identifier
 * @param {ThreatIndicator[]} indicators - Indicators to cache
 * @param {number} ttl - Time to live in seconds
 * @returns {Promise<void>} Cache operation completion
 *
 * @example
 * ```typescript
 * await cacheFeedData('feed-1', indicators, 3600);
 * ```
 */
export declare const cacheFeedData: (feedId: string, indicators: ThreatIndicator[], ttl: number) => Promise<void>;
/**
 * Retrieves cached feed data.
 *
 * @param {string} feedId - Feed identifier
 * @returns {Promise<ThreatIndicator[] | null>} Cached indicators or null
 *
 * @example
 * ```typescript
 * const cached = await getCachedFeedData('feed-1');
 * ```
 */
export declare const getCachedFeedData: (feedId: string) => Promise<ThreatIndicator[] | null>;
/**
 * Invalidates feed cache.
 *
 * @param {string} feedId - Feed identifier
 * @returns {Promise<void>} Invalidation completion
 *
 * @example
 * ```typescript
 * await invalidateFeedCache('feed-1');
 * ```
 */
export declare const invalidateFeedCache: (feedId: string) => Promise<void>;
/**
 * Filters indicators based on criteria.
 *
 * @param {ThreatIndicator[]} indicators - Indicators to filter
 * @param {object} criteria - Filter criteria
 * @returns {ThreatIndicator[]} Filtered indicators
 *
 * @example
 * ```typescript
 * const filtered = filterIndicators(indicators, { severity: 'high', confidence: { min: 80 } });
 * ```
 */
export declare const filterIndicators: (indicators: ThreatIndicator[], criteria: Record<string, unknown>) => ThreatIndicator[];
/**
 * Routes indicators to appropriate handlers.
 *
 * @param {ThreatIndicator[]} indicators - Indicators to route
 * @param {Map<string, (indicator: ThreatIndicator) => void>} handlers - Type handlers
 * @returns {void}
 *
 * @example
 * ```typescript
 * routeIndicators(indicators, new Map([
 *   ['ip', handleIpIndicator],
 *   ['domain', handleDomainIndicator]
 * ]));
 * ```
 */
export declare const routeIndicators: (indicators: ThreatIndicator[], handlers: Map<string, (indicator: ThreatIndicator) => void>) => void;
/**
 * Applies feed-specific filtering rules.
 *
 * @param {ThreatIndicator[]} indicators - Indicators to filter
 * @param {string} feedId - Feed identifier
 * @returns {ThreatIndicator[]} Filtered indicators
 *
 * @example
 * ```typescript
 * const filtered = applyFeedFilters(indicators, 'feed-1');
 * ```
 */
export declare const applyFeedFilters: (indicators: ThreatIndicator[], feedId: string) => ThreatIndicator[];
/**
 * Parses XML threat feed format.
 *
 * @param {string} xmlData - XML feed data
 * @param {Record<string, string>} [mapping] - Field mapping
 * @returns {ThreatIndicator[]} Parsed threat indicators
 * @throws {Error} If parsing fails
 *
 * @example
 * ```typescript
 * const indicators = parseXmlFeed(xmlContent);
 * ```
 */
export declare const parseXmlFeed: (xmlData: string, mapping?: Record<string, string>) => ThreatIndicator[];
declare const _default: {
    createRestFeedConnector: (config: ThreatFeedConfig) => ThreatFeedConnector;
    createWebhookFeedConnector: (config: ThreatFeedConfig, webhookConfig: WebhookConfig) => ThreatFeedConnector;
    createFileFeedConnector: (config: ThreatFeedConfig) => ThreatFeedConnector;
    createFeedPollingScheduler: (config: FeedPollingConfig, fetchFn: () => Promise<ThreatIndicator[]>) => {
        start: () => void;
        stop: () => void;
        isRunning: () => boolean;
    };
    validatePollingConfig: (config: FeedPollingConfig) => boolean;
    calculateNextPollTime: (failureCount: number, baseInterval: number, backoffMultiplier: number) => number;
    validateWebhookSignature: (payload: string, signature: string, secret: string) => boolean;
    validateWebhookSource: (sourceIp: string, whitelist: string[]) => boolean;
    processWebhookPayload: (payload: unknown, format: string) => ThreatIndicator[];
    normalizeThreatIndicator: (rawData: Record<string, unknown>, rules: FeedNormalizationRule[]) => ThreatIndicator;
    parseJsonFeed: (jsonData: string) => ThreatIndicator[];
    parseCsvFeed: (csvData: string, columnMapping: Record<string, string>) => ThreatIndicator[];
    parseXmlFeed: (xmlData: string, mapping?: Record<string, string>) => ThreatIndicator[];
    validateIndicator: (indicator: ThreatIndicator) => boolean;
    aggregateThreatFeeds: (feedIndicators: ThreatIndicator[][], rule: FeedAggregationRule) => ThreatIndicator[];
    enrichIndicator: (indicator: ThreatIndicator, enrichmentData: Record<string, unknown>) => ThreatIndicator;
    monitorFeedHealth: (feedId: string, healthCheckFn: () => Promise<void>) => Promise<FeedHealthStatus>;
    calculateFeedUptime: (totalChecks: number, successfulChecks: number) => number;
    calculateFeedErrorRate: (totalRequests: number, failedRequests: number) => number;
    deduplicateIndicators: (indicators: ThreatIndicator[], config: DeduplicationConfig) => ThreatIndicator[];
    generateDeduplicationKey: (indicator: ThreatIndicator, config: DeduplicationConfig) => string;
    createFeedRateLimiter: (config: RateLimitConfig) => {
        checkLimit: () => boolean;
    };
    validateRateLimitConfig: (config: RateLimitConfig) => boolean;
    calculateFeedMetrics: (feedId: string, timeWindow: number) => Promise<FeedMetrics>;
    analyzeFeedQuality: (metrics: FeedMetrics) => number;
    generateFeedReport: (feedId: string, startDate: Date, endDate: Date) => Promise<object>;
    createFeedPriorityQueue: (feeds: ThreatFeedConfig[]) => ThreatFeedConfig[];
    coordinateFeedUpdates: (feeds: ThreatFeedConfig[], maxConcurrent: number) => Promise<void>;
    calculateOptimalPollInterval: (feed: ThreatFeedConfig, metrics: FeedMetrics) => number;
    transformFeedData: (rawData: unknown, format: string) => ThreatIndicator[];
    applyFeedTransformations: (indicator: ThreatIndicator, transformations: Record<string, (value: unknown) => unknown>) => ThreatIndicator;
    normalizeConfidenceScores: (indicators: ThreatIndicator[], feedWeights: Record<string, number>) => ThreatIndicator[];
    cacheFeedData: (feedId: string, indicators: ThreatIndicator[], ttl: number) => Promise<void>;
    getCachedFeedData: (feedId: string) => Promise<ThreatIndicator[] | null>;
    invalidateFeedCache: (feedId: string) => Promise<void>;
    filterIndicators: (indicators: ThreatIndicator[], criteria: Record<string, unknown>) => ThreatIndicator[];
    routeIndicators: (indicators: ThreatIndicator[], handlers: Map<string, (indicator: ThreatIndicator) => void>) => void;
    applyFeedFilters: (indicators: ThreatIndicator[], feedId: string) => ThreatIndicator[];
    defineThreatFeedModel: (sequelize: any, DataTypes: any) => any;
    defineThreatIndicatorModel: (sequelize: any, DataTypes: any) => any;
    defineFeedHealthModel: (sequelize: any, DataTypes: any) => any;
    createFeedManagementController: () => string;
    createFeedApiSpec: () => Record<string, unknown>;
};
export default _default;
//# sourceMappingURL=threat-feeds-integration-kit.d.ts.map