/**
 * LOC: DWMK1234567
 * File: /reuse/threat/dark-web-monitoring-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Threat intelligence services
 *   - Dark web monitoring services
 *   - Credential leak detection systems
 */
/**
 * File: /reuse/threat/dark-web-monitoring-kit.ts
 * Locator: WC-THR-DWMK-001
 * Purpose: Comprehensive Dark Web Monitoring Utilities - Tor/I2P integration, paste sites, marketplaces, credential leaks
 *
 * Upstream: Independent utility module for dark web threat intelligence
 * Downstream: ../backend/*, threat intelligence services, dark web monitoring
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize, Tor/I2P clients
 * Exports: 40 utility functions for dark web monitoring, credential leak detection, marketplace tracking
 *
 * LLM Context: Comprehensive dark web monitoring utilities for tracking threat activity across Tor, I2P, paste sites,
 * and underground marketplaces. Provides credential leak detection, entity extraction, alert generation, and
 * integration with threat intelligence platforms. Essential for proactive threat detection in healthcare security.
 */
interface DarkWebSource {
    id: string;
    type: 'tor' | 'i2p' | 'paste' | 'marketplace' | 'forum' | 'chat';
    url: string;
    onionAddress?: string;
    i2pAddress?: string;
    isActive: boolean;
    lastScanned?: Date;
    trustScore: number;
}
interface TorConnectionConfig {
    socksHost: string;
    socksPort: number;
    controlPort?: number;
    controlPassword?: string;
    circuitTimeout: number;
    maxRetries: number;
}
interface I2PConnectionConfig {
    httpProxyHost: string;
    httpProxyPort: number;
    socksProxyHost?: string;
    socksProxyPort?: number;
    tunnelTimeout: number;
}
interface PasteSiteConfig {
    name: string;
    baseUrl: string;
    rateLimit: number;
    apiKey?: string;
    requiresAuth: boolean;
    scanInterval: number;
}
interface MarketplaceListing {
    id: string;
    marketplaceId: string;
    title: string;
    description: string;
    vendor: string;
    price?: number;
    currency?: string;
    category: string;
    postedAt: Date;
    extractedEntities: string[];
    riskScore: number;
}
interface CredentialLeak {
    id: string;
    source: string;
    sourceUrl: string;
    email?: string;
    username?: string;
    password?: string;
    domain?: string;
    organization?: string;
    discoveredAt: Date;
    severity: 'low' | 'medium' | 'high' | 'critical';
    verified: boolean;
}
interface DarkWebEntity {
    type: 'email' | 'domain' | 'ip' | 'credential' | 'organization' | 'person' | 'cryptocurrency';
    value: string;
    context: string;
    confidence: number;
    sourceUrl: string;
    extractedAt: Date;
}
interface DarkWebAlert {
    id: string;
    type: 'credential_leak' | 'marketplace_listing' | 'threat_actor' | 'data_breach' | 'vulnerability';
    severity: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    description: string;
    sourceUrl: string;
    entities: DarkWebEntity[];
    indicators: string[];
    createdAt: Date;
    acknowledged: boolean;
}
interface ScrapingJob {
    id: string;
    sourceId: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
    startedAt?: Date;
    completedAt?: Date;
    itemsScraped: number;
    errors: string[];
}
interface DarkWebIntelligence {
    sourceId: string;
    content: string;
    metadata: Record<string, unknown>;
    entities: DarkWebEntity[];
    riskScore: number;
    collectedAt: Date;
}
/**
 * Creates Tor connection configuration with SOCKS5 proxy settings.
 *
 * @param {Partial<TorConnectionConfig>} [overrides] - Configuration overrides
 * @returns {TorConnectionConfig} Tor connection configuration
 *
 * @example
 * ```typescript
 * const config = createTorConfig({
 *   socksHost: 'localhost',
 *   socksPort: 9050,
 *   controlPort: 9051,
 *   controlPassword: 'secret'
 * });
 * // Result: { socksHost: 'localhost', socksPort: 9050, circuitTimeout: 30000, ... }
 * ```
 */
export declare const createTorConfig: (overrides?: Partial<TorConnectionConfig>) => TorConnectionConfig;
/**
 * Generates Tor circuit request for enhanced anonymity.
 *
 * @param {TorConnectionConfig} config - Tor configuration
 * @returns {Promise<boolean>} True if new circuit created successfully
 * @throws {Error} If circuit creation fails
 *
 * @example
 * ```typescript
 * const config = createTorConfig();
 * const success = await requestNewTorCircuit(config);
 * // Result: true (new Tor circuit established)
 * ```
 */
export declare const requestNewTorCircuit: (config: TorConnectionConfig) => Promise<boolean>;
/**
 * Validates onion address format (v2 or v3).
 *
 * @param {string} address - Onion address to validate
 * @returns {boolean} True if valid onion address
 *
 * @example
 * ```typescript
 * const isValid1 = validateOnionAddress('3g2upl4pq6kufc4m.onion'); // v2
 * const isValid2 = validateOnionAddress('thehiddenwiki3iknkj77cjqm7hs4fskuv5bwi6hgqdjc7wf3xfvxd.onion'); // v3
 * // Both return: true
 * ```
 */
export declare const validateOnionAddress: (address: string) => boolean;
/**
 * Fetches content from Tor hidden service via SOCKS5 proxy.
 *
 * @param {string} onionUrl - Onion URL to fetch
 * @param {TorConnectionConfig} config - Tor connection configuration
 * @returns {Promise<string>} HTML content from hidden service
 * @throws {Error} If connection fails or times out
 *
 * @example
 * ```typescript
 * const content = await fetchTorHiddenService(
 *   'http://example.onion/index.html',
 *   createTorConfig()
 * );
 * // Returns HTML content from the hidden service
 * ```
 */
export declare const fetchTorHiddenService: (onionUrl: string, config: TorConnectionConfig) => Promise<string>;
/**
 * Checks if Tor connection is available and working.
 *
 * @param {TorConnectionConfig} config - Tor configuration
 * @returns {Promise<boolean>} True if Tor connection is working
 *
 * @example
 * ```typescript
 * const config = createTorConfig();
 * const isAvailable = await checkTorConnection(config);
 * // Result: true if Tor is running and accessible
 * ```
 */
export declare const checkTorConnection: (config: TorConnectionConfig) => Promise<boolean>;
/**
 * Creates I2P connection configuration with HTTP/SOCKS proxy settings.
 *
 * @param {Partial<I2PConnectionConfig>} [overrides] - Configuration overrides
 * @returns {I2PConnectionConfig} I2P connection configuration
 *
 * @example
 * ```typescript
 * const config = createI2PConfig({
 *   httpProxyHost: 'localhost',
 *   httpProxyPort: 4444
 * });
 * // Result: { httpProxyHost: 'localhost', httpProxyPort: 4444, tunnelTimeout: 45000 }
 * ```
 */
export declare const createI2PConfig: (overrides?: Partial<I2PConnectionConfig>) => I2PConnectionConfig;
/**
 * Validates I2P address format (.i2p domain).
 *
 * @param {string} address - I2P address to validate
 * @returns {boolean} True if valid I2P address
 *
 * @example
 * ```typescript
 * const isValid = validateI2PAddress('stats.i2p');
 * // Result: true
 * const isInvalid = validateI2PAddress('example.com');
 * // Result: false
 * ```
 */
export declare const validateI2PAddress: (address: string) => boolean;
/**
 * Fetches content from I2P eepsite via HTTP proxy.
 *
 * @param {string} i2pUrl - I2P URL to fetch
 * @param {I2PConnectionConfig} config - I2P connection configuration
 * @returns {Promise<string>} HTML content from eepsite
 * @throws {Error} If connection fails or times out
 *
 * @example
 * ```typescript
 * const content = await fetchI2PEepsite(
 *   'http://stats.i2p/',
 *   createI2PConfig()
 * );
 * // Returns HTML content from the I2P site
 * ```
 */
export declare const fetchI2PEepsite: (i2pUrl: string, config: I2PConnectionConfig) => Promise<string>;
/**
 * Checks if I2P router is available and working.
 *
 * @param {I2PConnectionConfig} config - I2P configuration
 * @returns {Promise<boolean>} True if I2P connection is working
 *
 * @example
 * ```typescript
 * const config = createI2PConfig();
 * const isAvailable = await checkI2PConnection(config);
 * // Result: true if I2P router is running
 * ```
 */
export declare const checkI2PConnection: (config: I2PConnectionConfig) => Promise<boolean>;
/**
 * Creates paste site monitoring configuration.
 *
 * @param {string} name - Paste site name (e.g., 'pastebin', 'ghostbin')
 * @param {string} baseUrl - Base URL of paste site
 * @param {Partial<Omit<PasteSiteConfig, 'name' | 'baseUrl'>>} [overrides] - Additional config
 * @returns {PasteSiteConfig} Paste site configuration
 *
 * @example
 * ```typescript
 * const config = createPasteSiteConfig('pastebin', 'https://pastebin.com', {
 *   apiKey: 'abc123',
 *   scanInterval: 300000
 * });
 * ```
 */
export declare const createPasteSiteConfig: (name: string, baseUrl: string, overrides?: Partial<Omit<PasteSiteConfig, "name" | "baseUrl">>) => PasteSiteConfig;
/**
 * Scrapes recent pastes from paste site.
 *
 * @param {PasteSiteConfig} config - Paste site configuration
 * @param {number} [limit] - Maximum number of pastes to retrieve
 * @returns {Promise<Array<{ id: string; title: string; content: string; timestamp: Date }>>} Recent pastes
 *
 * @example
 * ```typescript
 * const config = createPasteSiteConfig('pastebin', 'https://pastebin.com');
 * const pastes = await scrapeRecentPastes(config, 50);
 * // Returns array of recent paste objects
 * ```
 */
export declare const scrapeRecentPastes: (config: PasteSiteConfig, limit?: number) => Promise<Array<{
    id: string;
    title: string;
    content: string;
    timestamp: Date;
}>>;
/**
 * Searches paste sites for specific keywords or patterns.
 *
 * @param {PasteSiteConfig} config - Paste site configuration
 * @param {string[]} keywords - Keywords to search for
 * @returns {Promise<Array<{ id: string; title: string; content: string; matches: string[] }>>} Matching pastes
 *
 * @example
 * ```typescript
 * const results = await searchPasteSites(config, ['credential', 'password', 'database']);
 * // Returns pastes containing the keywords
 * ```
 */
export declare const searchPasteSites: (config: PasteSiteConfig, keywords: string[]) => Promise<Array<{
    id: string;
    title: string;
    content: string;
    matches: string[];
}>>;
/**
 * Monitors paste sites for credential leaks matching organization domains.
 *
 * @param {PasteSiteConfig} config - Paste site configuration
 * @param {string[]} domains - Domains to monitor for
 * @returns {Promise<CredentialLeak[]>} Discovered credential leaks
 *
 * @example
 * ```typescript
 * const leaks = await monitorPasteCredentials(config, ['example.com', 'company.org']);
 * // Returns credential leaks for specified domains
 * ```
 */
export declare const monitorPasteCredentials: (config: PasteSiteConfig, domains: string[]) => Promise<CredentialLeak[]>;
/**
 * Scrapes dark web marketplace listings.
 *
 * @param {DarkWebSource} marketplace - Marketplace source configuration
 * @param {string[]} [categories] - Categories to scrape (optional)
 * @returns {Promise<MarketplaceListing[]>} Marketplace listings
 *
 * @example
 * ```typescript
 * const marketplace = { id: 'market1', type: 'marketplace', url: '...', ... };
 * const listings = await scrapeMarketplaceListings(marketplace, ['drugs', 'weapons']);
 * ```
 */
export declare const scrapeMarketplaceListings: (marketplace: DarkWebSource, categories?: string[]) => Promise<MarketplaceListing[]>;
/**
 * Searches marketplace for specific products or keywords.
 *
 * @param {DarkWebSource} marketplace - Marketplace source
 * @param {string} searchQuery - Search query
 * @returns {Promise<MarketplaceListing[]>} Matching listings
 *
 * @example
 * ```typescript
 * const results = await searchMarketplace(marketplace, 'stolen credentials');
 * // Returns listings matching the search query
 * ```
 */
export declare const searchMarketplace: (marketplace: DarkWebSource, searchQuery: string) => Promise<MarketplaceListing[]>;
/**
 * Tracks marketplace vendor activity and reputation.
 *
 * @param {DarkWebSource} marketplace - Marketplace source
 * @param {string} vendorId - Vendor identifier
 * @returns {Promise<{ vendorId: string; listings: number; rating: number; lastActive: Date }>} Vendor profile
 *
 * @example
 * ```typescript
 * const profile = await trackMarketplaceVendor(marketplace, 'vendor123');
 * // Result: { vendorId: 'vendor123', listings: 42, rating: 4.5, lastActive: Date }
 * ```
 */
export declare const trackMarketplaceVendor: (marketplace: DarkWebSource, vendorId: string) => Promise<{
    vendorId: string;
    listings: number;
    rating: number;
    lastActive: Date;
}>;
/**
 * Calculates risk score for marketplace listing.
 *
 * @param {MarketplaceListing} listing - Marketplace listing
 * @returns {number} Risk score (0-100)
 *
 * @example
 * ```typescript
 * const listing = { category: 'stolen-data', price: 500, ... };
 * const score = calculateMarketplaceRiskScore(listing);
 * // Result: 85 (high risk)
 * ```
 */
export declare const calculateMarketplaceRiskScore: (listing: MarketplaceListing) => number;
/**
 * Detects credential leaks in text content.
 *
 * @param {string} content - Text content to analyze
 * @param {string} sourceUrl - Source URL of content
 * @returns {CredentialLeak[]} Detected credential leaks
 *
 * @example
 * ```typescript
 * const content = 'user@example.com:password123\nadmin@company.org:secret';
 * const leaks = detectCredentialLeaks(content, 'http://paste.example/abc');
 * // Returns array of credential leak objects
 * ```
 */
export declare const detectCredentialLeaks: (content: string, sourceUrl: string) => CredentialLeak[];
/**
 * Validates credential leak against known breach databases.
 *
 * @param {CredentialLeak} leak - Credential leak to validate
 * @returns {Promise<{ verified: boolean; breachName?: string; breachDate?: Date }>} Validation result
 *
 * @example
 * ```typescript
 * const leak = { email: 'user@example.com', password: '...', ... };
 * const validation = await validateCredentialLeak(leak);
 * // Result: { verified: true, breachName: 'Example Breach 2024', breachDate: Date }
 * ```
 */
export declare const validateCredentialLeak: (leak: CredentialLeak) => Promise<{
    verified: boolean;
    breachName?: string;
    breachDate?: Date;
}>;
/**
 * Calculates severity score for credential leak.
 *
 * @param {CredentialLeak} leak - Credential leak
 * @param {string[]} criticalDomains - List of critical domains to monitor
 * @returns {'low' | 'medium' | 'high' | 'critical'} Severity level
 *
 * @example
 * ```typescript
 * const leak = { domain: 'hospital.com', verified: true, ... };
 * const severity = calculateLeakSeverity(leak, ['hospital.com', 'clinic.org']);
 * // Result: 'critical'
 * ```
 */
export declare const calculateLeakSeverity: (leak: CredentialLeak, criticalDomains: string[]) => "low" | "medium" | "high" | "critical";
/**
 * Groups credential leaks by domain for bulk analysis.
 *
 * @param {CredentialLeak[]} leaks - Array of credential leaks
 * @returns {Map<string, CredentialLeak[]>} Leaks grouped by domain
 *
 * @example
 * ```typescript
 * const leaks = [leak1, leak2, leak3];
 * const grouped = groupLeaksByDomain(leaks);
 * // Result: Map { 'example.com' => [leak1, leak2], 'other.org' => [leak3] }
 * ```
 */
export declare const groupLeaksByDomain: (leaks: CredentialLeak[]) => Map<string, CredentialLeak[]>;
/**
 * Extracts email addresses from dark web content.
 *
 * @param {string} content - Content to extract from
 * @param {string} sourceUrl - Source URL
 * @returns {DarkWebEntity[]} Extracted email entities
 *
 * @example
 * ```typescript
 * const content = 'Contact: admin@example.com or support@company.org';
 * const entities = extractEmailEntities(content, 'http://example.onion');
 * // Returns array of email entities
 * ```
 */
export declare const extractEmailEntities: (content: string, sourceUrl: string) => DarkWebEntity[];
/**
 * Extracts domain names from dark web content.
 *
 * @param {string} content - Content to extract from
 * @param {string} sourceUrl - Source URL
 * @returns {DarkWebEntity[]} Extracted domain entities
 *
 * @example
 * ```typescript
 * const content = 'Access database at https://victim.com/admin';
 * const entities = extractDomainEntities(content, 'http://example.onion');
 * // Returns array of domain entities
 * ```
 */
export declare const extractDomainEntities: (content: string, sourceUrl: string) => DarkWebEntity[];
/**
 * Extracts IP addresses from dark web content.
 *
 * @param {string} content - Content to extract from
 * @param {string} sourceUrl - Source URL
 * @returns {DarkWebEntity[]} Extracted IP entities
 *
 * @example
 * ```typescript
 * const content = 'Server located at 192.168.1.100 and 10.0.0.5';
 * const entities = extractIPEntities(content, 'http://example.onion');
 * // Returns array of IP entities
 * ```
 */
export declare const extractIPEntities: (content: string, sourceUrl: string) => DarkWebEntity[];
/**
 * Extracts cryptocurrency addresses from dark web content.
 *
 * @param {string} content - Content to extract from
 * @param {string} sourceUrl - Source URL
 * @returns {DarkWebEntity[]} Extracted cryptocurrency entities
 *
 * @example
 * ```typescript
 * const content = 'Send BTC to 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa';
 * const entities = extractCryptoEntities(content, 'http://example.onion');
 * // Returns array of crypto address entities
 * ```
 */
export declare const extractCryptoEntities: (content: string, sourceUrl: string) => DarkWebEntity[];
/**
 * Extracts all entities from dark web content.
 *
 * @param {string} content - Content to extract from
 * @param {string} sourceUrl - Source URL
 * @returns {DarkWebEntity[]} All extracted entities
 *
 * @example
 * ```typescript
 * const content = 'Contact admin@example.com at 192.168.1.1 or send BTC to 1A1z...';
 * const entities = extractAllEntities(content, 'http://example.onion');
 * // Returns combined array of all entity types
 * ```
 */
export declare const extractAllEntities: (content: string, sourceUrl: string) => DarkWebEntity[];
/**
 * Creates dark web alert from detected threat.
 *
 * @param {object} params - Alert parameters
 * @returns {DarkWebAlert} Created alert
 *
 * @example
 * ```typescript
 * const alert = createDarkWebAlert({
 *   type: 'credential_leak',
 *   severity: 'critical',
 *   title: 'Hospital credentials leaked',
 *   description: 'Admin credentials found on paste site',
 *   sourceUrl: 'http://paste.example/123',
 *   entities: [emailEntity],
 *   indicators: ['admin@hospital.com']
 * });
 * ```
 */
export declare const createDarkWebAlert: (params: {
    type: DarkWebAlert["type"];
    severity: DarkWebAlert["severity"];
    title: string;
    description: string;
    sourceUrl: string;
    entities: DarkWebEntity[];
    indicators: string[];
}) => DarkWebAlert;
/**
 * Calculates alert priority based on severity and context.
 *
 * @param {DarkWebAlert} alert - Alert to prioritize
 * @param {string[]} criticalKeywords - Critical keywords for organization
 * @returns {number} Priority score (0-100)
 *
 * @example
 * ```typescript
 * const alert = { severity: 'critical', entities: [...], ... };
 * const priority = calculateAlertPriority(alert, ['hospital', 'patient']);
 * // Result: 95 (high priority)
 * ```
 */
export declare const calculateAlertPriority: (alert: DarkWebAlert, criticalKeywords: string[]) => number;
/**
 * Filters alerts by severity and time range.
 *
 * @param {DarkWebAlert[]} alerts - Alerts to filter
 * @param {DarkWebAlert['severity'][]} severities - Severities to include
 * @param {Date} [startDate] - Start date for filtering
 * @param {Date} [endDate] - End date for filtering
 * @returns {DarkWebAlert[]} Filtered alerts
 *
 * @example
 * ```typescript
 * const filtered = filterAlertsBySeverity(
 *   allAlerts,
 *   ['high', 'critical'],
 *   new Date('2024-01-01'),
 *   new Date()
 * );
 * ```
 */
export declare const filterAlertsBySeverity: (alerts: DarkWebAlert[], severities: DarkWebAlert["severity"][], startDate?: Date, endDate?: Date) => DarkWebAlert[];
/**
 * Deduplicates alerts based on content similarity.
 *
 * @param {DarkWebAlert[]} alerts - Alerts to deduplicate
 * @param {number} [similarityThreshold] - Similarity threshold (0-1)
 * @returns {DarkWebAlert[]} Deduplicated alerts
 *
 * @example
 * ```typescript
 * const unique = deduplicateAlerts(allAlerts, 0.8);
 * // Returns alerts with less than 80% similarity
 * ```
 */
export declare const deduplicateAlerts: (alerts: DarkWebAlert[], similarityThreshold?: number) => DarkWebAlert[];
/**
 * Calculates string similarity using Levenshtein distance.
 *
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} Similarity score (0-1)
 *
 * @example
 * ```typescript
 * const similarity = calculateStringSimilarity('hello world', 'hello world!');
 * // Result: 0.92
 * ```
 */
export declare const calculateStringSimilarity: (str1: string, str2: string) => number;
/**
 * Creates scraping job for dark web source.
 *
 * @param {string} sourceId - Source identifier
 * @returns {ScrapingJob} Created scraping job
 *
 * @example
 * ```typescript
 * const job = createScrapingJob('marketplace-alpha');
 * // Result: { id: 'job_123', sourceId: 'marketplace-alpha', status: 'pending', ... }
 * ```
 */
export declare const createScrapingJob: (sourceId: string) => ScrapingJob;
/**
 * Updates scraping job status and metrics.
 *
 * @param {ScrapingJob} job - Scraping job to update
 * @param {Partial<ScrapingJob>} updates - Updates to apply
 * @returns {ScrapingJob} Updated scraping job
 *
 * @example
 * ```typescript
 * const updated = updateScrapingJob(job, { status: 'completed', itemsScraped: 150 });
 * ```
 */
export declare const updateScrapingJob: (job: ScrapingJob, updates: Partial<ScrapingJob>) => ScrapingJob;
/**
 * Validates dark web source configuration.
 *
 * @param {DarkWebSource} source - Source to validate
 * @returns {boolean} True if source configuration is valid
 *
 * @example
 * ```typescript
 * const isValid = validateDarkWebSource(source);
 * // Result: true
 * ```
 */
export declare const validateDarkWebSource: (source: DarkWebSource) => boolean;
/**
 * Aggregates dark web intelligence from multiple sources.
 *
 * @param {DarkWebIntelligence[]} intelligence - Array of intelligence data
 * @returns {DarkWebIntelligence} Aggregated intelligence
 *
 * @example
 * ```typescript
 * const aggregated = aggregateDarkWebIntelligence([intel1, intel2, intel3]);
 * // Returns combined intelligence with merged entities
 * ```
 */
export declare const aggregateDarkWebIntelligence: (intelligence: DarkWebIntelligence[]) => DarkWebIntelligence;
/**
 * Filters dark web sources by activity status.
 *
 * @param {DarkWebSource[]} sources - Sources to filter
 * @param {boolean} [activeOnly] - Whether to return only active sources
 * @returns {DarkWebSource[]} Filtered sources
 *
 * @example
 * ```typescript
 * const activeSources = filterSourcesByActivity(allSources, true);
 * ```
 */
export declare const filterSourcesByActivity: (sources: DarkWebSource[], activeOnly?: boolean) => DarkWebSource[];
/**
 * Calculates trust score for dark web source based on reliability.
 *
 * @param {DarkWebSource} source - Source to evaluate
 * @param {number} successfulScans - Number of successful scans
 * @param {number} totalScans - Total number of scans
 * @returns {number} Trust score (0-100)
 *
 * @example
 * ```typescript
 * const trust = calculateSourceTrustScore(source, 45, 50);
 * // Result: 90 (high trust)
 * ```
 */
export declare const calculateSourceTrustScore: (source: DarkWebSource, successfulScans: number, totalScans: number) => number;
/**
 * Exports dark web intelligence to STIX format.
 *
 * @param {DarkWebIntelligence} intelligence - Intelligence to export
 * @returns {Record<string, unknown>} STIX-formatted intelligence
 *
 * @example
 * ```typescript
 * const stix = exportToSTIX(intelligence);
 * // Returns STIX 2.1 formatted threat intelligence
 * ```
 */
export declare const exportToSTIX: (intelligence: DarkWebIntelligence) => Record<string, unknown>;
/**
 * Schedules periodic scanning of dark web sources.
 *
 * @param {DarkWebSource} source - Source to schedule
 * @param {number} intervalMs - Scan interval in milliseconds
 * @returns {{ scheduleId: string; nextRun: Date }} Schedule information
 *
 * @example
 * ```typescript
 * const schedule = scheduleDarkWebScan(source, 3600000); // Every hour
 * // Result: { scheduleId: 'sched_123', nextRun: Date }
 * ```
 */
export declare const scheduleDarkWebScan: (source: DarkWebSource, intervalMs: number) => {
    scheduleId: string;
    nextRun: Date;
};
/**
 * Enriches credential leak with additional context and metadata.
 *
 * @param {CredentialLeak} leak - Credential leak to enrich
 * @returns {Promise<CredentialLeak>} Enriched credential leak
 *
 * @example
 * ```typescript
 * const enriched = await enrichCredentialLeak(leak);
 * // Returns leak with additional OSINT data
 * ```
 */
export declare const enrichCredentialLeak: (leak: CredentialLeak) => Promise<CredentialLeak>;
declare const _default: {
    createTorConfig: (overrides?: Partial<TorConnectionConfig>) => TorConnectionConfig;
    requestNewTorCircuit: (config: TorConnectionConfig) => Promise<boolean>;
    validateOnionAddress: (address: string) => boolean;
    fetchTorHiddenService: (onionUrl: string, config: TorConnectionConfig) => Promise<string>;
    checkTorConnection: (config: TorConnectionConfig) => Promise<boolean>;
    createI2PConfig: (overrides?: Partial<I2PConnectionConfig>) => I2PConnectionConfig;
    validateI2PAddress: (address: string) => boolean;
    fetchI2PEepsite: (i2pUrl: string, config: I2PConnectionConfig) => Promise<string>;
    checkI2PConnection: (config: I2PConnectionConfig) => Promise<boolean>;
    createPasteSiteConfig: (name: string, baseUrl: string, overrides?: Partial<Omit<PasteSiteConfig, "name" | "baseUrl">>) => PasteSiteConfig;
    scrapeRecentPastes: (config: PasteSiteConfig, limit?: number) => Promise<Array<{
        id: string;
        title: string;
        content: string;
        timestamp: Date;
    }>>;
    searchPasteSites: (config: PasteSiteConfig, keywords: string[]) => Promise<Array<{
        id: string;
        title: string;
        content: string;
        matches: string[];
    }>>;
    monitorPasteCredentials: (config: PasteSiteConfig, domains: string[]) => Promise<CredentialLeak[]>;
    scrapeMarketplaceListings: (marketplace: DarkWebSource, categories?: string[]) => Promise<MarketplaceListing[]>;
    searchMarketplace: (marketplace: DarkWebSource, searchQuery: string) => Promise<MarketplaceListing[]>;
    trackMarketplaceVendor: (marketplace: DarkWebSource, vendorId: string) => Promise<{
        vendorId: string;
        listings: number;
        rating: number;
        lastActive: Date;
    }>;
    calculateMarketplaceRiskScore: (listing: MarketplaceListing) => number;
    detectCredentialLeaks: (content: string, sourceUrl: string) => CredentialLeak[];
    validateCredentialLeak: (leak: CredentialLeak) => Promise<{
        verified: boolean;
        breachName?: string;
        breachDate?: Date;
    }>;
    calculateLeakSeverity: (leak: CredentialLeak, criticalDomains: string[]) => "low" | "medium" | "high" | "critical";
    groupLeaksByDomain: (leaks: CredentialLeak[]) => Map<string, CredentialLeak[]>;
    extractEmailEntities: (content: string, sourceUrl: string) => DarkWebEntity[];
    extractDomainEntities: (content: string, sourceUrl: string) => DarkWebEntity[];
    extractIPEntities: (content: string, sourceUrl: string) => DarkWebEntity[];
    extractCryptoEntities: (content: string, sourceUrl: string) => DarkWebEntity[];
    extractAllEntities: (content: string, sourceUrl: string) => DarkWebEntity[];
    createDarkWebAlert: (params: {
        type: DarkWebAlert["type"];
        severity: DarkWebAlert["severity"];
        title: string;
        description: string;
        sourceUrl: string;
        entities: DarkWebEntity[];
        indicators: string[];
    }) => DarkWebAlert;
    calculateAlertPriority: (alert: DarkWebAlert, criticalKeywords: string[]) => number;
    filterAlertsBySeverity: (alerts: DarkWebAlert[], severities: DarkWebAlert["severity"][], startDate?: Date, endDate?: Date) => DarkWebAlert[];
    deduplicateAlerts: (alerts: DarkWebAlert[], similarityThreshold?: number) => DarkWebAlert[];
    calculateStringSimilarity: (str1: string, str2: string) => number;
    createScrapingJob: (sourceId: string) => ScrapingJob;
    updateScrapingJob: (job: ScrapingJob, updates: Partial<ScrapingJob>) => ScrapingJob;
    validateDarkWebSource: (source: DarkWebSource) => boolean;
    aggregateDarkWebIntelligence: (intelligence: DarkWebIntelligence[]) => DarkWebIntelligence;
    filterSourcesByActivity: (sources: DarkWebSource[], activeOnly?: boolean) => DarkWebSource[];
    calculateSourceTrustScore: (source: DarkWebSource, successfulScans: number, totalScans: number) => number;
    exportToSTIX: (intelligence: DarkWebIntelligence) => Record<string, unknown>;
    scheduleDarkWebScan: (source: DarkWebSource, intervalMs: number) => {
        scheduleId: string;
        nextRun: Date;
    };
    enrichCredentialLeak: (leak: CredentialLeak) => Promise<CredentialLeak>;
};
export default _default;
//# sourceMappingURL=dark-web-monitoring-kit.d.ts.map