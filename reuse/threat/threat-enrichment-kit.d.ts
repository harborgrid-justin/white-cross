/**
 * LOC: TENR1234567
 * File: /reuse/threat/threat-enrichment-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Threat intelligence services
 *   - IOC enrichment pipelines
 *   - Threat data processors
 */
/**
 * File: /reuse/threat/threat-enrichment-kit.ts
 * Locator: WC-UTL-TENR-001
 * Purpose: Comprehensive Threat Enrichment Utilities - IOC enrichment, WHOIS, GeoIP, DNS, SSL, threat intel integration
 *
 * Upstream: Independent utility module for threat intelligence enrichment
 * Downstream: ../backend/*, Threat services, enrichment pipelines, analytics dashboards
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, Redis 7.x, Swagger/OpenAPI
 * Exports: 44 utility functions for IOC enrichment pipelines, WHOIS data, GeoIP, DNS resolution, SSL certificates, threat intelligence feeds, caching strategies
 *
 * LLM Context: Comprehensive threat enrichment utilities for implementing production-ready threat intelligence platforms.
 * Provides IOC enrichment pipelines, WHOIS/GeoIP/DNS lookups, SSL certificate analysis, threat intelligence integration,
 * and advanced caching strategies. Essential for building scalable threat data enrichment systems.
 */
interface EnrichmentConfig {
    sources: EnrichmentSource[];
    timeout?: number;
    retries?: number;
    parallel?: boolean;
    caching?: CacheConfig;
    priority?: 'speed' | 'accuracy' | 'balanced';
}
interface EnrichmentSource {
    name: string;
    type: 'whois' | 'geoip' | 'dns' | 'ssl' | 'threat_intel' | 'reputation';
    enabled: boolean;
    priority: number;
    apiKey?: string;
    endpoint?: string;
    rateLimit?: number;
}
interface EnrichmentResult {
    ioc: string;
    iocType: 'ip' | 'domain' | 'url' | 'hash' | 'email';
    enrichments: Record<string, EnrichmentData>;
    timestamp: Date;
    sources: string[];
    confidence: number;
    metadata: Record<string, unknown>;
}
interface EnrichmentData {
    source: string;
    data: Record<string, unknown>;
    timestamp: Date;
    reliability: number;
    ttl?: number;
}
interface WHOISData {
    domain: string;
    registrar: string;
    registrant: RegistrantInfo;
    adminContact: ContactInfo;
    techContact: ContactInfo;
    nameservers: string[];
    status: string[];
    createdDate: Date;
    updatedDate: Date;
    expiresDate: Date;
    dnssec: boolean;
}
interface RegistrantInfo {
    name?: string;
    organization?: string;
    email?: string;
    phone?: string;
    country?: string;
    state?: string;
    city?: string;
}
interface ContactInfo {
    name?: string;
    email?: string;
    phone?: string;
}
interface GeoIPData {
    ip: string;
    country: string;
    countryCode: string;
    region: string;
    city: string;
    latitude: number;
    longitude: number;
    timezone: string;
    asn: number;
    asnOrg: string;
    isp: string;
    proxy: boolean;
    vpn: boolean;
    tor: boolean;
}
interface DNSRecord {
    name: string;
    type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'NS' | 'TXT' | 'PTR' | 'SOA';
    value: string;
    ttl: number;
    timestamp: Date;
}
interface PassiveDNSRecord {
    domain: string;
    ip: string;
    firstSeen: Date;
    lastSeen: Date;
    recordType: string;
    source: string;
    count: number;
}
interface SSLCertificate {
    subject: CertificateSubject;
    issuer: CertificateIssuer;
    serialNumber: string;
    fingerprint: string;
    fingerprintSha256: string;
    validFrom: Date;
    validTo: Date;
    publicKey: PublicKeyInfo;
    extensions: CertificateExtension[];
    signatureAlgorithm: string;
    version: number;
}
interface CertificateSubject {
    commonName: string;
    organization?: string;
    organizationalUnit?: string;
    locality?: string;
    state?: string;
    country?: string;
    email?: string;
}
interface CertificateIssuer {
    commonName: string;
    organization?: string;
    country?: string;
}
interface PublicKeyInfo {
    algorithm: string;
    keySize: number;
    exponent?: number;
    modulus?: string;
}
interface CertificateExtension {
    name: string;
    value: string;
    critical: boolean;
}
interface ThreatIntelFeed {
    feedId: string;
    name: string;
    type: 'malware' | 'phishing' | 'c2' | 'exploit' | 'reputation' | 'vulnerability';
    provider: string;
    updateFrequency: number;
    reliability: number;
    lastUpdate: Date;
    indicators: ThreatIndicator[];
}
interface ThreatIndicator {
    value: string;
    type: 'ip' | 'domain' | 'url' | 'hash' | 'email';
    threatType: string;
    confidence: number;
    tags: string[];
    firstSeen: Date;
    lastSeen: Date;
    metadata?: Record<string, unknown>;
}
interface ReputationScore {
    ioc: string;
    score: number;
    category: 'malicious' | 'suspicious' | 'neutral' | 'benign';
    sources: ReputationSource[];
    lastUpdated: Date;
    factors: ScoringFactor[];
}
interface ReputationSource {
    name: string;
    score: number;
    confidence: number;
    lastChecked: Date;
}
interface ScoringFactor {
    name: string;
    value: number;
    impact: 'positive' | 'negative' | 'neutral';
    weight: number;
}
interface CacheConfig {
    enabled: boolean;
    ttl: number;
    maxSize?: number;
    strategy: 'lru' | 'lfu' | 'ttl' | 'redis';
    keyPrefix?: string;
}
interface CacheStats {
    hits: number;
    misses: number;
    evictions: number;
    size: number;
    hitRate: number;
    avgLatency: number;
}
interface EnrichmentPipeline {
    id: string;
    stages: EnrichmentStage[];
    config: EnrichmentConfig;
    status: 'pending' | 'running' | 'completed' | 'failed';
    startTime?: Date;
    endTime?: Date;
    results?: EnrichmentResult[];
}
interface EnrichmentStage {
    name: string;
    type: EnrichmentSource['type'];
    handler: (ioc: string) => Promise<EnrichmentData>;
    timeout: number;
    retries: number;
    critical: boolean;
}
/**
 * Creates enrichment pipeline for IOC processing.
 *
 * @param {EnrichmentConfig} config - Pipeline configuration
 * @returns {EnrichmentPipeline} Configured enrichment pipeline
 * @throws {Error} If config is invalid
 *
 * @example
 * ```typescript
 * const pipeline = createEnrichmentPipeline({
 *   sources: [
 *     { name: 'virustotal', type: 'threat_intel', enabled: true, priority: 1 },
 *     { name: 'maxmind', type: 'geoip', enabled: true, priority: 2 }
 *   ],
 *   parallel: true,
 *   timeout: 5000
 * });
 * ```
 */
export declare const createEnrichmentPipeline: (config: EnrichmentConfig) => EnrichmentPipeline;
/**
 * Orchestrates enrichment across multiple sources.
 *
 * @param {string} ioc - IOC to enrich
 * @param {EnrichmentPipeline} pipeline - Enrichment pipeline
 * @returns {Promise<EnrichmentResult>} Enrichment results
 * @throws {Error} If enrichment fails
 *
 * @example
 * ```typescript
 * const result = await orchestrateEnrichment('192.168.1.1', pipeline);
 * // Result: { ioc: '192.168.1.1', enrichments: {...}, confidence: 0.92, ... }
 * ```
 */
export declare const orchestrateEnrichment: (ioc: string, pipeline: EnrichmentPipeline) => Promise<EnrichmentResult>;
/**
 * Prioritizes enrichment sources based on reliability and speed.
 *
 * @param {EnrichmentSource[]} sources - Available enrichment sources
 * @param {string} iocType - Type of IOC being enriched
 * @returns {EnrichmentSource[]} Prioritized sources
 *
 * @example
 * ```typescript
 * const prioritized = prioritizeEnrichmentSources(sources, 'ip');
 * // Result: Sources sorted by priority for IP enrichment
 * ```
 */
export declare const prioritizeEnrichmentSources: (sources: EnrichmentSource[], iocType: string) => EnrichmentSource[];
/**
 * Aggregates enrichment results from multiple sources.
 *
 * @param {EnrichmentResult[]} results - Array of enrichment results
 * @returns {EnrichmentResult} Merged enrichment result
 *
 * @example
 * ```typescript
 * const merged = aggregateEnrichmentResults([result1, result2, result3]);
 * // Result: Single enrichment result with combined data
 * ```
 */
export declare const aggregateEnrichmentResults: (results: EnrichmentResult[]) => EnrichmentResult;
/**
 * Validates enrichment data quality and completeness.
 *
 * @param {EnrichmentData} data - Enrichment data to validate
 * @param {string[]} [requiredFields] - Required fields
 * @returns {boolean} True if data is valid
 *
 * @example
 * ```typescript
 * const isValid = validateEnrichmentData(enrichmentData, ['country', 'asn']);
 * // Result: true
 * ```
 */
export declare const validateEnrichmentData: (data: EnrichmentData, requiredFields?: string[]) => boolean;
/**
 * Merges enrichment results with conflict resolution.
 *
 * @param {EnrichmentData[]} dataArray - Array of enrichment data
 * @param {string} strategy - Merge strategy ('newest' | 'most_reliable' | 'consensus')
 * @returns {Record<string, unknown>} Merged data
 *
 * @example
 * ```typescript
 * const merged = mergeEnrichmentResults([data1, data2, data3], 'most_reliable');
 * // Result: { country: 'US', asn: 12345, ... }
 * ```
 */
export declare const mergeEnrichmentResults: (dataArray: EnrichmentData[], strategy: "newest" | "most_reliable" | "consensus") => Record<string, unknown>;
/**
 * Transforms enrichment output to standardized format.
 *
 * @param {EnrichmentResult} result - Raw enrichment result
 * @param {string} format - Output format ('json' | 'stix' | 'misp')
 * @returns {Record<string, unknown>} Transformed output
 *
 * @example
 * ```typescript
 * const stix = transformEnrichmentOutput(result, 'stix');
 * // Result: STIX 2.1 formatted threat intelligence
 * ```
 */
export declare const transformEnrichmentOutput: (result: EnrichmentResult, format: "json" | "stix" | "misp") => Record<string, unknown>;
/**
 * Handles enrichment errors with retry logic.
 *
 * @param {Error} error - Error that occurred
 * @param {EnrichmentStage} stage - Stage where error occurred
 * @param {number} attempt - Current retry attempt
 * @returns {Promise<EnrichmentData | null>} Retry result or null
 *
 * @example
 * ```typescript
 * const result = await handleEnrichmentErrors(error, stage, 2);
 * ```
 */
export declare const handleEnrichmentErrors: (error: Error, stage: EnrichmentStage, attempt: number) => Promise<EnrichmentData | null>;
/**
 * Enriches domain with WHOIS data.
 *
 * @param {string} domain - Domain name
 * @returns {Promise<WHOISData>} WHOIS data
 * @throws {Error} If WHOIS lookup fails
 *
 * @example
 * ```typescript
 * const whois = await enrichWithWHOIS('example.com');
 * // Result: { domain: 'example.com', registrar: 'GoDaddy', ... }
 * ```
 */
export declare const enrichWithWHOIS: (domain: string) => Promise<WHOISData>;
/**
 * Queries domain WHOIS information.
 *
 * @param {string} domain - Domain name
 * @param {string} [whoisServer] - WHOIS server to query
 * @returns {Promise<string>} Raw WHOIS response
 *
 * @example
 * ```typescript
 * const raw = await queryDomainWHOIS('example.com', 'whois.verisign-grs.com');
 * ```
 */
export declare const queryDomainWHOIS: (domain: string, whoisServer?: string) => Promise<string>;
/**
 * Parses WHOIS response into structured data.
 *
 * @param {string} whoisResponse - Raw WHOIS response
 * @returns {WHOISData} Parsed WHOIS data
 * @throws {Error} If parsing fails
 *
 * @example
 * ```typescript
 * const data = parseWHOISResponse(rawWhois);
 * ```
 */
export declare const parseWHOISResponse: (whoisResponse: string) => WHOISData;
/**
 * Extracts registrar information from WHOIS data.
 *
 * @param {WHOISData} whoisData - WHOIS data
 * @returns {Record<string, string>} Registrar information
 *
 * @example
 * ```typescript
 * const registrar = extractRegistrarInfo(whoisData);
 * // Result: { name: 'GoDaddy', url: 'https://godaddy.com', abuseEmail: 'abuse@godaddy.com' }
 * ```
 */
export declare const extractRegistrarInfo: (whoisData: WHOISData) => Record<string, string>;
/**
 * Tracks WHOIS historical changes.
 *
 * @param {string} domain - Domain name
 * @param {WHOISData} currentData - Current WHOIS data
 * @returns {Promise<WHOISData[]>} Historical WHOIS records
 *
 * @example
 * ```typescript
 * const history = await trackWHOISHistory('example.com', currentWhois);
 * ```
 */
export declare const trackWHOISHistory: (domain: string, currentData: WHOISData) => Promise<WHOISData[]>;
/**
 * Validates WHOIS data completeness and accuracy.
 *
 * @param {WHOISData} whoisData - WHOIS data to validate
 * @returns {boolean} True if data is valid
 *
 * @example
 * ```typescript
 * const isValid = validateWHOISData(whoisData);
 * ```
 */
export declare const validateWHOISData: (whoisData: WHOISData) => boolean;
/**
 * Enriches IP address with geolocation data.
 *
 * @param {string} ip - IP address
 * @returns {Promise<GeoIPData>} Geolocation data
 * @throws {Error} If IP is invalid or lookup fails
 *
 * @example
 * ```typescript
 * const geo = await enrichWithGeoIP('8.8.8.8');
 * // Result: { ip: '8.8.8.8', country: 'US', city: 'Mountain View', asn: 15169, ... }
 * ```
 */
export declare const enrichWithGeoIP: (ip: string) => Promise<GeoIPData>;
/**
 * Looks up IP geolocation details.
 *
 * @param {string} ip - IP address
 * @param {string} provider - GeoIP provider ('maxmind' | 'ip2location' | 'ipapi')
 * @returns {Promise<GeoIPData>} Geolocation data
 *
 * @example
 * ```typescript
 * const location = await lookupIPGeolocation('1.1.1.1', 'maxmind');
 * ```
 */
export declare const lookupIPGeolocation: (ip: string, provider: "maxmind" | "ip2location" | "ipapi") => Promise<GeoIPData>;
/**
 * Queries ASN information for IP address.
 *
 * @param {string} ip - IP address
 * @returns {Promise<Record<string, unknown>>} ASN information
 *
 * @example
 * ```typescript
 * const asn = await queryASNInformation('8.8.8.8');
 * // Result: { asn: 15169, org: 'Google LLC', country: 'US', ranges: [...] }
 * ```
 */
export declare const queryASNInformation: (ip: string) => Promise<Record<string, unknown>>;
/**
 * Resolves network range for IP address.
 *
 * @param {string} ip - IP address
 * @returns {Promise<string>} CIDR network range
 *
 * @example
 * ```typescript
 * const range = await resolveNetworkRange('8.8.8.8');
 * // Result: '8.8.8.0/24'
 * ```
 */
export declare const resolveNetworkRange: (ip: string) => Promise<string>;
/**
 * Caches GeoIP data for performance.
 *
 * @param {string} ip - IP address
 * @param {GeoIPData} data - GeoIP data
 * @param {number} ttl - Cache TTL in seconds
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await cacheGeoIPData('8.8.8.8', geoData, 3600);
 * ```
 */
export declare const cacheGeoIPData: (ip: string, data: GeoIPData, ttl: number) => Promise<void>;
/**
 * Validates GeoIP results for accuracy.
 *
 * @param {GeoIPData} geoData - GeoIP data to validate
 * @returns {boolean} True if data is valid
 *
 * @example
 * ```typescript
 * const isValid = validateGeoIPResults(geoData);
 * ```
 */
export declare const validateGeoIPResults: (geoData: GeoIPData) => boolean;
/**
 * Enriches domain/IP with DNS data.
 *
 * @param {string} target - Domain or IP address
 * @param {string[]} [recordTypes] - DNS record types to query
 * @returns {Promise<DNSRecord[]>} DNS records
 *
 * @example
 * ```typescript
 * const records = await enrichWithDNS('example.com', ['A', 'MX', 'TXT']);
 * ```
 */
export declare const enrichWithDNS: (target: string, recordTypes?: string[]) => Promise<DNSRecord[]>;
/**
 * Performs reverse DNS lookup.
 *
 * @param {string} ip - IP address
 * @returns {Promise<string[]>} Reverse DNS hostnames
 *
 * @example
 * ```typescript
 * const hostnames = await performReverseDNS('8.8.8.8');
 * // Result: ['dns.google']
 * ```
 */
export declare const performReverseDNS: (ip: string) => Promise<string[]>;
/**
 * Queries passive DNS database.
 *
 * @param {string} query - Domain or IP to query
 * @param {number} [days] - Number of days to look back (default: 30)
 * @returns {Promise<PassiveDNSRecord[]>} Passive DNS records
 *
 * @example
 * ```typescript
 * const pdns = await queryPassiveDNS('example.com', 90);
 * ```
 */
export declare const queryPassiveDNS: (query: string, days?: number) => Promise<PassiveDNSRecord[]>;
/**
 * Fetches DNS resolution history.
 *
 * @param {string} domain - Domain name
 * @param {Date} startDate - Start date for history
 * @param {Date} endDate - End date for history
 * @returns {Promise<PassiveDNSRecord[]>} DNS history
 *
 * @example
 * ```typescript
 * const history = await fetchDNSHistory('example.com', new Date('2024-01-01'), new Date());
 * ```
 */
export declare const fetchDNSHistory: (domain: string, startDate: Date, endDate: Date) => Promise<PassiveDNSRecord[]>;
/**
 * Resolves DNS records for domain.
 *
 * @param {string} domain - Domain name
 * @param {DNSRecord['type']} type - Record type
 * @returns {Promise<DNSRecord[]>} DNS records
 *
 * @example
 * ```typescript
 * const mxRecords = await resolveDNSRecords('example.com', 'MX');
 * ```
 */
export declare const resolveDNSRecords: (domain: string, type: DNSRecord["type"]) => Promise<DNSRecord[]>;
/**
 * Validates DNS data integrity.
 *
 * @param {DNSRecord[]} records - DNS records to validate
 * @returns {boolean} True if all records are valid
 *
 * @example
 * ```typescript
 * const isValid = validateDNSData(dnsRecords);
 * ```
 */
export declare const validateDNSData: (records: DNSRecord[]) => boolean;
/**
 * Caches DNS results for performance.
 *
 * @param {string} domain - Domain name
 * @param {DNSRecord[]} records - DNS records
 * @param {number} ttl - Cache TTL (defaults to lowest record TTL)
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await cacheDNSResults('example.com', records, 3600);
 * ```
 */
export declare const cacheDNSResults: (domain: string, records: DNSRecord[], ttl?: number) => Promise<void>;
/**
 * Enriches domain with SSL certificate data.
 *
 * @param {string} domain - Domain name
 * @param {number} [port] - Port number (default: 443)
 * @returns {Promise<SSLCertificate>} SSL certificate data
 *
 * @example
 * ```typescript
 * const cert = await enrichWithSSLCertificate('example.com', 443);
 * ```
 */
export declare const enrichWithSSLCertificate: (domain: string, port?: number) => Promise<SSLCertificate>;
/**
 * Parses SSL certificate from PEM or DER format.
 *
 * @param {string | Buffer} certData - Certificate data
 * @param {string} format - Certificate format ('pem' | 'der')
 * @returns {SSLCertificate} Parsed certificate
 *
 * @example
 * ```typescript
 * const cert = parseSSLCertificate(pemData, 'pem');
 * ```
 */
export declare const parseSSLCertificate: (certData: string | Buffer, format: "pem" | "der") => SSLCertificate;
/**
 * Validates SSL certificate chain.
 *
 * @param {SSLCertificate[]} chain - Certificate chain
 * @returns {boolean} True if chain is valid
 *
 * @example
 * ```typescript
 * const isValid = validateCertificateChain([leafCert, intermediateCert, rootCert]);
 * ```
 */
export declare const validateCertificateChain: (chain: SSLCertificate[]) => boolean;
/**
 * Extracts certificate fingerprint.
 *
 * @param {SSLCertificate} certificate - SSL certificate
 * @param {string} algorithm - Hash algorithm ('sha1' | 'sha256')
 * @returns {string} Certificate fingerprint
 *
 * @example
 * ```typescript
 * const fingerprint = extractCertificateFingerprint(cert, 'sha256');
 * // Result: '01:23:45:67:89:AB:CD:EF:...'
 * ```
 */
export declare const extractCertificateFingerprint: (certificate: SSLCertificate, algorithm: "sha1" | "sha256") => string;
/**
 * Analyzes certificate metadata for threats.
 *
 * @param {SSLCertificate} certificate - SSL certificate
 * @returns {Record<string, unknown>} Analysis results
 *
 * @example
 * ```typescript
 * const analysis = analyzeCertificateMetadata(cert);
 * // Result: { isSelfSigned: false, isExpired: false, daysUntilExpiry: 90, ... }
 * ```
 */
export declare const analyzeCertificateMetadata: (certificate: SSLCertificate) => Record<string, unknown>;
/**
 * Integrates multiple threat intelligence sources.
 *
 * @param {string} ioc - IOC to check
 * @param {string[]} sources - Threat intel sources
 * @returns {Promise<ThreatIntelFeed[]>} Threat intelligence data
 *
 * @example
 * ```typescript
 * const intel = await integrateMultipleSources('malicious.com', ['virustotal', 'alienvault', 'threatcrowd']);
 * ```
 */
export declare const integrateMultipleSources: (ioc: string, sources: string[]) => Promise<ThreatIntelFeed[]>;
/**
 * Normalizes threat intelligence feed to standard format.
 *
 * @param {Record<string, unknown>} rawFeed - Raw feed data
 * @param {string} source - Source name
 * @returns {ThreatIntelFeed} Normalized feed
 *
 * @example
 * ```typescript
 * const normalized = normalizeThreatIntelFeed(rawVTData, 'virustotal');
 * ```
 */
export declare const normalizeThreatIntelFeed: (rawFeed: Record<string, unknown>, source: string) => ThreatIntelFeed;
/**
 * Aggregates threat data from multiple feeds.
 *
 * @param {ThreatIntelFeed[]} feeds - Array of threat intel feeds
 * @returns {ThreatIndicator[]} Aggregated indicators
 *
 * @example
 * ```typescript
 * const indicators = aggregateThreatData(feeds);
 * ```
 */
export declare const aggregateThreatData: (feeds: ThreatIntelFeed[]) => ThreatIndicator[];
/**
 * Calculates reputation score for IOC.
 *
 * @param {string} ioc - IOC to score
 * @param {ThreatIntelFeed[]} feeds - Threat intel feeds
 * @returns {ReputationScore} Reputation score
 *
 * @example
 * ```typescript
 * const reputation = calculateReputationScore('suspicious.com', feeds);
 * // Result: { ioc: 'suspicious.com', score: 0.35, category: 'suspicious', ... }
 * ```
 */
export declare const calculateReputationScore: (ioc: string, feeds: ThreatIntelFeed[]) => ReputationScore;
/**
 * Prioritizes threat intelligence sources by reliability.
 *
 * @param {EnrichmentSource[]} sources - Available sources
 * @returns {EnrichmentSource[]} Prioritized sources
 *
 * @example
 * ```typescript
 * const prioritized = prioritizeThreatSources(sources);
 * ```
 */
export declare const prioritizeThreatSources: (sources: EnrichmentSource[]) => EnrichmentSource[];
/**
 * Validates threat intelligence data quality.
 *
 * @param {ThreatIntelFeed} feed - Threat intel feed
 * @returns {boolean} True if feed is valid
 *
 * @example
 * ```typescript
 * const isValid = validateThreatIntelData(feed);
 * ```
 */
export declare const validateThreatIntelData: (feed: ThreatIntelFeed) => boolean;
/**
 * Creates enrichment cache with specified strategy.
 *
 * @param {CacheConfig} config - Cache configuration
 * @returns {EnrichmentCache} Cache instance
 *
 * @example
 * ```typescript
 * const cache = createEnrichmentCache({
 *   enabled: true,
 *   ttl: 3600,
 *   strategy: 'redis',
 *   keyPrefix: 'enrich:'
 * });
 * ```
 */
export declare const createEnrichmentCache: (config: CacheConfig) => EnrichmentCache;
/**
 * Caches enrichment result with TTL.
 *
 * @param {string} key - Cache key
 * @param {EnrichmentResult} result - Enrichment result
 * @param {number} ttl - Time to live in seconds
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await cacheEnrichmentResult('ip:8.8.8.8', result, 3600);
 * ```
 */
export declare const cacheEnrichmentResult: (key: string, result: EnrichmentResult, ttl: number) => Promise<void>;
/**
 * Retrieves cached enrichment data.
 *
 * @param {string} key - Cache key
 * @returns {Promise<EnrichmentResult | null>} Cached result or null
 *
 * @example
 * ```typescript
 * const cached = await retrieveCachedEnrichment('ip:8.8.8.8');
 * ```
 */
export declare const retrieveCachedEnrichment: (key: string) => Promise<EnrichmentResult | null>;
/**
 * Invalidates cache entries matching pattern.
 *
 * @param {string} pattern - Cache key pattern
 * @returns {Promise<number>} Number of invalidated entries
 *
 * @example
 * ```typescript
 * const count = await invalidateEnrichmentCache('ip:*');
 * ```
 */
export declare const invalidateEnrichmentCache: (pattern: string) => Promise<number>;
/**
 * Optimizes cache TTL based on data characteristics.
 *
 * @param {EnrichmentResult} result - Enrichment result
 * @returns {number} Optimized TTL in seconds
 *
 * @example
 * ```typescript
 * const ttl = optimizeCacheTTL(result);
 * // Result: 7200 (2 hours for high-confidence data)
 * ```
 */
export declare const optimizeCacheTTL: (result: EnrichmentResult) => number;
/**
 * Monitors cache performance metrics.
 *
 * @returns {Promise<CacheStats>} Cache statistics
 *
 * @example
 * ```typescript
 * const stats = await monitorCachePerformance();
 * // Result: { hits: 1500, misses: 500, hitRate: 0.75, ... }
 * ```
 */
export declare const monitorCachePerformance: () => Promise<CacheStats>;
declare class EnrichmentCache {
    private cache;
    private config;
    private stats;
    constructor(config: CacheConfig);
    get(key: string): Promise<EnrichmentResult | null>;
    set(key: string, value: EnrichmentResult, ttl?: number): Promise<void>;
    private isExpired;
    getStats(): CacheStats;
}
declare const _default: {
    createEnrichmentPipeline: (config: EnrichmentConfig) => EnrichmentPipeline;
    orchestrateEnrichment: (ioc: string, pipeline: EnrichmentPipeline) => Promise<EnrichmentResult>;
    prioritizeEnrichmentSources: (sources: EnrichmentSource[], iocType: string) => EnrichmentSource[];
    aggregateEnrichmentResults: (results: EnrichmentResult[]) => EnrichmentResult;
    validateEnrichmentData: (data: EnrichmentData, requiredFields?: string[]) => boolean;
    mergeEnrichmentResults: (dataArray: EnrichmentData[], strategy: "newest" | "most_reliable" | "consensus") => Record<string, unknown>;
    transformEnrichmentOutput: (result: EnrichmentResult, format: "json" | "stix" | "misp") => Record<string, unknown>;
    handleEnrichmentErrors: (error: Error, stage: EnrichmentStage, attempt: number) => Promise<EnrichmentData | null>;
    enrichWithWHOIS: (domain: string) => Promise<WHOISData>;
    queryDomainWHOIS: (domain: string, whoisServer?: string) => Promise<string>;
    parseWHOISResponse: (whoisResponse: string) => WHOISData;
    extractRegistrarInfo: (whoisData: WHOISData) => Record<string, string>;
    trackWHOISHistory: (domain: string, currentData: WHOISData) => Promise<WHOISData[]>;
    validateWHOISData: (whoisData: WHOISData) => boolean;
    enrichWithGeoIP: (ip: string) => Promise<GeoIPData>;
    lookupIPGeolocation: (ip: string, provider: "maxmind" | "ip2location" | "ipapi") => Promise<GeoIPData>;
    queryASNInformation: (ip: string) => Promise<Record<string, unknown>>;
    resolveNetworkRange: (ip: string) => Promise<string>;
    cacheGeoIPData: (ip: string, data: GeoIPData, ttl: number) => Promise<void>;
    validateGeoIPResults: (geoData: GeoIPData) => boolean;
    enrichWithDNS: (target: string, recordTypes?: string[]) => Promise<DNSRecord[]>;
    performReverseDNS: (ip: string) => Promise<string[]>;
    queryPassiveDNS: (query: string, days?: number) => Promise<PassiveDNSRecord[]>;
    fetchDNSHistory: (domain: string, startDate: Date, endDate: Date) => Promise<PassiveDNSRecord[]>;
    resolveDNSRecords: (domain: string, type: DNSRecord["type"]) => Promise<DNSRecord[]>;
    validateDNSData: (records: DNSRecord[]) => boolean;
    cacheDNSResults: (domain: string, records: DNSRecord[], ttl?: number) => Promise<void>;
    enrichWithSSLCertificate: (domain: string, port?: number) => Promise<SSLCertificate>;
    parseSSLCertificate: (certData: string | Buffer, format: "pem" | "der") => SSLCertificate;
    validateCertificateChain: (chain: SSLCertificate[]) => boolean;
    extractCertificateFingerprint: (certificate: SSLCertificate, algorithm: "sha1" | "sha256") => string;
    analyzeCertificateMetadata: (certificate: SSLCertificate) => Record<string, unknown>;
    integrateMultipleSources: (ioc: string, sources: string[]) => Promise<ThreatIntelFeed[]>;
    normalizeThreatIntelFeed: (rawFeed: Record<string, unknown>, source: string) => ThreatIntelFeed;
    aggregateThreatData: (feeds: ThreatIntelFeed[]) => ThreatIndicator[];
    calculateReputationScore: (ioc: string, feeds: ThreatIntelFeed[]) => ReputationScore;
    prioritizeThreatSources: (sources: EnrichmentSource[]) => EnrichmentSource[];
    validateThreatIntelData: (feed: ThreatIntelFeed) => boolean;
    createEnrichmentCache: (config: CacheConfig) => EnrichmentCache;
    cacheEnrichmentResult: (key: string, result: EnrichmentResult, ttl: number) => Promise<void>;
    retrieveCachedEnrichment: (key: string) => Promise<EnrichmentResult | null>;
    invalidateEnrichmentCache: (pattern: string) => Promise<number>;
    optimizeCacheTTL: (result: EnrichmentResult) => number;
    monitorCachePerformance: () => Promise<CacheStats>;
};
export default _default;
//# sourceMappingURL=threat-enrichment-kit.d.ts.map