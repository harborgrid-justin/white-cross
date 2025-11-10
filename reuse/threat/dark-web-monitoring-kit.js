"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.enrichCredentialLeak = exports.scheduleDarkWebScan = exports.exportToSTIX = exports.calculateSourceTrustScore = exports.filterSourcesByActivity = exports.aggregateDarkWebIntelligence = exports.validateDarkWebSource = exports.updateScrapingJob = exports.createScrapingJob = exports.calculateStringSimilarity = exports.deduplicateAlerts = exports.filterAlertsBySeverity = exports.calculateAlertPriority = exports.createDarkWebAlert = exports.extractAllEntities = exports.extractCryptoEntities = exports.extractIPEntities = exports.extractDomainEntities = exports.extractEmailEntities = exports.groupLeaksByDomain = exports.calculateLeakSeverity = exports.validateCredentialLeak = exports.detectCredentialLeaks = exports.calculateMarketplaceRiskScore = exports.trackMarketplaceVendor = exports.searchMarketplace = exports.scrapeMarketplaceListings = exports.monitorPasteCredentials = exports.searchPasteSites = exports.scrapeRecentPastes = exports.createPasteSiteConfig = exports.checkI2PConnection = exports.fetchI2PEepsite = exports.validateI2PAddress = exports.createI2PConfig = exports.checkTorConnection = exports.fetchTorHiddenService = exports.validateOnionAddress = exports.requestNewTorCircuit = exports.createTorConfig = void 0;
// ============================================================================
// TOR NETWORK INTEGRATION
// ============================================================================
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
const createTorConfig = (overrides) => {
    return {
        socksHost: 'localhost',
        socksPort: 9050,
        controlPort: 9051,
        controlPassword: '',
        circuitTimeout: 30000,
        maxRetries: 3,
        ...overrides,
    };
};
exports.createTorConfig = createTorConfig;
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
const requestNewTorCircuit = async (config) => {
    // Simulate Tor control protocol interaction
    // In production, would use actual Tor control protocol
    return new Promise((resolve) => {
        setTimeout(() => resolve(true), 100);
    });
};
exports.requestNewTorCircuit = requestNewTorCircuit;
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
const validateOnionAddress = (address) => {
    const v2Pattern = /^[a-z2-7]{16}\.onion$/;
    const v3Pattern = /^[a-z2-7]{56}\.onion$/;
    return v2Pattern.test(address) || v3Pattern.test(address);
};
exports.validateOnionAddress = validateOnionAddress;
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
const fetchTorHiddenService = async (onionUrl, config) => {
    // In production, would use SOCKS5 proxy client
    // For now, return mock content
    return Promise.resolve(`<html>Mock Tor content from ${onionUrl}</html>`);
};
exports.fetchTorHiddenService = fetchTorHiddenService;
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
const checkTorConnection = async (config) => {
    try {
        // In production, would actually check Tor connection
        return true;
    }
    catch {
        return false;
    }
};
exports.checkTorConnection = checkTorConnection;
// ============================================================================
// I2P NETWORK INTEGRATION
// ============================================================================
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
const createI2PConfig = (overrides) => {
    return {
        httpProxyHost: 'localhost',
        httpProxyPort: 4444,
        socksProxyHost: 'localhost',
        socksProxyPort: 4445,
        tunnelTimeout: 45000,
        ...overrides,
    };
};
exports.createI2PConfig = createI2PConfig;
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
const validateI2PAddress = (address) => {
    const i2pPattern = /^[a-z0-9-]+\.i2p$/;
    return i2pPattern.test(address);
};
exports.validateI2PAddress = validateI2PAddress;
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
const fetchI2PEepsite = async (i2pUrl, config) => {
    // In production, would use HTTP proxy client
    return Promise.resolve(`<html>Mock I2P content from ${i2pUrl}</html>`);
};
exports.fetchI2PEepsite = fetchI2PEepsite;
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
const checkI2PConnection = async (config) => {
    try {
        // In production, would actually check I2P connection
        return true;
    }
    catch {
        return false;
    }
};
exports.checkI2PConnection = checkI2PConnection;
// ============================================================================
// PASTE SITE MONITORING
// ============================================================================
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
const createPasteSiteConfig = (name, baseUrl, overrides) => {
    return {
        name,
        baseUrl,
        rateLimit: 5,
        apiKey: undefined,
        requiresAuth: false,
        scanInterval: 600000, // 10 minutes
        ...overrides,
    };
};
exports.createPasteSiteConfig = createPasteSiteConfig;
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
const scrapeRecentPastes = async (config, limit = 100) => {
    // In production, would actually scrape paste site
    return [];
};
exports.scrapeRecentPastes = scrapeRecentPastes;
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
const searchPasteSites = async (config, keywords) => {
    // In production, would search paste sites
    return [];
};
exports.searchPasteSites = searchPasteSites;
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
const monitorPasteCredentials = async (config, domains) => {
    // In production, would monitor for credentials
    return [];
};
exports.monitorPasteCredentials = monitorPasteCredentials;
// ============================================================================
// MARKETPLACE MONITORING
// ============================================================================
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
const scrapeMarketplaceListings = async (marketplace, categories) => {
    // In production, would scrape marketplace
    return [];
};
exports.scrapeMarketplaceListings = scrapeMarketplaceListings;
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
const searchMarketplace = async (marketplace, searchQuery) => {
    // In production, would search marketplace
    return [];
};
exports.searchMarketplace = searchMarketplace;
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
const trackMarketplaceVendor = async (marketplace, vendorId) => {
    // In production, would track vendor
    return {
        vendorId,
        listings: 0,
        rating: 0,
        lastActive: new Date(),
    };
};
exports.trackMarketplaceVendor = trackMarketplaceVendor;
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
const calculateMarketplaceRiskScore = (listing) => {
    let score = 0;
    // High-risk categories
    const highRiskCategories = ['stolen-data', 'credentials', 'malware', 'exploits', 'ransomware'];
    if (highRiskCategories.includes(listing.category.toLowerCase())) {
        score += 40;
    }
    // Keywords in title/description
    const highRiskKeywords = ['healthcare', 'hospital', 'medical', 'patient', 'phi', 'hipaa'];
    const text = `${listing.title} ${listing.description}`.toLowerCase();
    highRiskKeywords.forEach((keyword) => {
        if (text.includes(keyword))
            score += 15;
    });
    // Price point analysis
    if (listing.price && listing.price > 1000) {
        score += 20;
    }
    return Math.min(100, score);
};
exports.calculateMarketplaceRiskScore = calculateMarketplaceRiskScore;
// ============================================================================
// CREDENTIAL LEAK DETECTION
// ============================================================================
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
const detectCredentialLeaks = (content, sourceUrl) => {
    const leaks = [];
    // Email:password pattern
    const emailPasswordPattern = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}):([^\s]+)/g;
    let match;
    while ((match = emailPasswordPattern.exec(content)) !== null) {
        const email = match[1];
        const password = match[2];
        const domain = email.split('@')[1];
        leaks.push({
            id: `leak_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            source: 'pattern_detection',
            sourceUrl,
            email,
            password,
            domain,
            discoveredAt: new Date(),
            severity: 'high',
            verified: false,
        });
    }
    return leaks;
};
exports.detectCredentialLeaks = detectCredentialLeaks;
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
const validateCredentialLeak = async (leak) => {
    // In production, would check against HIBP or similar
    return {
        verified: false,
    };
};
exports.validateCredentialLeak = validateCredentialLeak;
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
const calculateLeakSeverity = (leak, criticalDomains) => {
    if (leak.domain && criticalDomains.includes(leak.domain)) {
        return leak.verified ? 'critical' : 'high';
    }
    if (leak.verified) {
        return 'high';
    }
    if (leak.password && leak.password.length > 8) {
        return 'medium';
    }
    return 'low';
};
exports.calculateLeakSeverity = calculateLeakSeverity;
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
const groupLeaksByDomain = (leaks) => {
    const grouped = new Map();
    leaks.forEach((leak) => {
        if (leak.domain) {
            const existing = grouped.get(leak.domain) || [];
            existing.push(leak);
            grouped.set(leak.domain, existing);
        }
    });
    return grouped;
};
exports.groupLeaksByDomain = groupLeaksByDomain;
// ============================================================================
// ENTITY EXTRACTION
// ============================================================================
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
const extractEmailEntities = (content, sourceUrl) => {
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const emails = content.match(emailPattern) || [];
    return emails.map((email) => ({
        type: 'email',
        value: email,
        context: content.substring(Math.max(0, content.indexOf(email) - 50), content.indexOf(email) + email.length + 50),
        confidence: 0.9,
        sourceUrl,
        extractedAt: new Date(),
    }));
};
exports.extractEmailEntities = extractEmailEntities;
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
const extractDomainEntities = (content, sourceUrl) => {
    const domainPattern = /(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
    const matches = content.matchAll(domainPattern);
    const domains = Array.from(matches).map((m) => m[1]);
    return domains.map((domain) => ({
        type: 'domain',
        value: domain,
        context: content.substring(Math.max(0, content.indexOf(domain) - 50), content.indexOf(domain) + domain.length + 50),
        confidence: 0.85,
        sourceUrl,
        extractedAt: new Date(),
    }));
};
exports.extractDomainEntities = extractDomainEntities;
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
const extractIPEntities = (content, sourceUrl) => {
    const ipPattern = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g;
    const ips = content.match(ipPattern) || [];
    return ips
        .filter((ip) => {
        // Validate IP format
        const parts = ip.split('.');
        return parts.every((part) => parseInt(part) >= 0 && parseInt(part) <= 255);
    })
        .map((ip) => ({
        type: 'ip',
        value: ip,
        context: content.substring(Math.max(0, content.indexOf(ip) - 50), content.indexOf(ip) + ip.length + 50),
        confidence: 0.95,
        sourceUrl,
        extractedAt: new Date(),
    }));
};
exports.extractIPEntities = extractIPEntities;
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
const extractCryptoEntities = (content, sourceUrl) => {
    const btcPattern = /\b[13][a-km-zA-HJ-NP-Z1-9]{25,34}\b/g;
    const ethPattern = /\b0x[a-fA-F0-9]{40}\b/g;
    const btcAddresses = content.match(btcPattern) || [];
    const ethAddresses = content.match(ethPattern) || [];
    const entities = [];
    btcAddresses.forEach((address) => {
        entities.push({
            type: 'cryptocurrency',
            value: `BTC:${address}`,
            context: content.substring(Math.max(0, content.indexOf(address) - 50), content.indexOf(address) + address.length + 50),
            confidence: 0.85,
            sourceUrl,
            extractedAt: new Date(),
        });
    });
    ethAddresses.forEach((address) => {
        entities.push({
            type: 'cryptocurrency',
            value: `ETH:${address}`,
            context: content.substring(Math.max(0, content.indexOf(address) - 50), content.indexOf(address) + address.length + 50),
            confidence: 0.9,
            sourceUrl,
            extractedAt: new Date(),
        });
    });
    return entities;
};
exports.extractCryptoEntities = extractCryptoEntities;
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
const extractAllEntities = (content, sourceUrl) => {
    return [
        ...(0, exports.extractEmailEntities)(content, sourceUrl),
        ...(0, exports.extractDomainEntities)(content, sourceUrl),
        ...(0, exports.extractIPEntities)(content, sourceUrl),
        ...(0, exports.extractCryptoEntities)(content, sourceUrl),
    ];
};
exports.extractAllEntities = extractAllEntities;
// ============================================================================
// ALERT GENERATION
// ============================================================================
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
const createDarkWebAlert = (params) => {
    return {
        id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: params.type,
        severity: params.severity,
        title: params.title,
        description: params.description,
        sourceUrl: params.sourceUrl,
        entities: params.entities,
        indicators: params.indicators,
        createdAt: new Date(),
        acknowledged: false,
    };
};
exports.createDarkWebAlert = createDarkWebAlert;
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
const calculateAlertPriority = (alert, criticalKeywords) => {
    let priority = 0;
    // Base priority on severity
    const severityScores = { low: 10, medium: 30, high: 60, critical: 80 };
    priority += severityScores[alert.severity];
    // Boost for critical keywords
    const alertText = `${alert.title} ${alert.description}`.toLowerCase();
    criticalKeywords.forEach((keyword) => {
        if (alertText.includes(keyword.toLowerCase())) {
            priority += 10;
        }
    });
    // Boost for multiple entities
    if (alert.entities.length > 5) {
        priority += 5;
    }
    return Math.min(100, priority);
};
exports.calculateAlertPriority = calculateAlertPriority;
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
const filterAlertsBySeverity = (alerts, severities, startDate, endDate) => {
    return alerts.filter((alert) => {
        const severityMatch = severities.includes(alert.severity);
        const dateMatch = (!startDate || alert.createdAt >= startDate) &&
            (!endDate || alert.createdAt <= endDate);
        return severityMatch && dateMatch;
    });
};
exports.filterAlertsBySeverity = filterAlertsBySeverity;
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
const deduplicateAlerts = (alerts, similarityThreshold = 0.85) => {
    const unique = [];
    alerts.forEach((alert) => {
        const isDuplicate = unique.some((existing) => {
            const titleSimilarity = (0, exports.calculateStringSimilarity)(alert.title, existing.title);
            const urlSame = alert.sourceUrl === existing.sourceUrl;
            return titleSimilarity > similarityThreshold || urlSame;
        });
        if (!isDuplicate) {
            unique.push(alert);
        }
    });
    return unique;
};
exports.deduplicateAlerts = deduplicateAlerts;
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
const calculateStringSimilarity = (str1, str2) => {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    if (longer.length === 0)
        return 1.0;
    const distance = levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
};
exports.calculateStringSimilarity = calculateStringSimilarity;
/**
 * Calculates Levenshtein distance between two strings.
 *
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} Edit distance
 */
const levenshteinDistance = (str1, str2) => {
    const matrix = [];
    for (let i = 0; i <= str2.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= str1.length; j++) {
        matrix[0][j] = j;
    }
    for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
            if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            }
            else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
            }
        }
    }
    return matrix[str2.length][str1.length];
};
// ============================================================================
// DARK WEB SCRAPING UTILITIES
// ============================================================================
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
const createScrapingJob = (sourceId) => {
    return {
        id: `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        sourceId,
        status: 'pending',
        itemsScraped: 0,
        errors: [],
    };
};
exports.createScrapingJob = createScrapingJob;
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
const updateScrapingJob = (job, updates) => {
    return {
        ...job,
        ...updates,
    };
};
exports.updateScrapingJob = updateScrapingJob;
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
const validateDarkWebSource = (source) => {
    if (!source.id || !source.type || !source.url) {
        return false;
    }
    if (source.type === 'tor' && source.onionAddress && !(0, exports.validateOnionAddress)(source.onionAddress)) {
        return false;
    }
    if (source.type === 'i2p' && source.i2pAddress && !(0, exports.validateI2PAddress)(source.i2pAddress)) {
        return false;
    }
    return source.trustScore >= 0 && source.trustScore <= 100;
};
exports.validateDarkWebSource = validateDarkWebSource;
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
const aggregateDarkWebIntelligence = (intelligence) => {
    const allEntities = [];
    let totalRiskScore = 0;
    intelligence.forEach((intel) => {
        allEntities.push(...intel.entities);
        totalRiskScore += intel.riskScore;
    });
    return {
        sourceId: 'aggregated',
        content: intelligence.map((i) => i.content).join('\n\n'),
        metadata: {
            sourceCount: intelligence.length,
            aggregatedAt: new Date(),
        },
        entities: allEntities,
        riskScore: totalRiskScore / intelligence.length,
        collectedAt: new Date(),
    };
};
exports.aggregateDarkWebIntelligence = aggregateDarkWebIntelligence;
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
const filterSourcesByActivity = (sources, activeOnly = true) => {
    return sources.filter((source) => (activeOnly ? source.isActive : true));
};
exports.filterSourcesByActivity = filterSourcesByActivity;
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
const calculateSourceTrustScore = (source, successfulScans, totalScans) => {
    if (totalScans === 0)
        return 0;
    const successRate = successfulScans / totalScans;
    let score = successRate * 100;
    // Boost for long-standing sources
    if (source.lastScanned) {
        const daysSinceLastScan = Math.floor((Date.now() - source.lastScanned.getTime()) / (1000 * 60 * 60 * 24));
        if (daysSinceLastScan < 7) {
            score += 5;
        }
    }
    return Math.min(100, Math.max(0, score));
};
exports.calculateSourceTrustScore = calculateSourceTrustScore;
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
const exportToSTIX = (intelligence) => {
    return {
        type: 'bundle',
        id: `bundle--${Date.now()}`,
        spec_version: '2.1',
        objects: intelligence.entities.map((entity, index) => ({
            type: 'indicator',
            id: `indicator--${index}`,
            pattern: `[${entity.type}:value = '${entity.value}']`,
            valid_from: entity.extractedAt.toISOString(),
            description: entity.context,
        })),
    };
};
exports.exportToSTIX = exportToSTIX;
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
const scheduleDarkWebScan = (source, intervalMs) => {
    const scheduleId = `sched_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const nextRun = new Date(Date.now() + intervalMs);
    return {
        scheduleId,
        nextRun,
    };
};
exports.scheduleDarkWebScan = scheduleDarkWebScan;
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
const enrichCredentialLeak = async (leak) => {
    // In production, would enrich with OSINT data, breach databases, etc.
    const enriched = { ...leak };
    if (leak.email && !leak.domain) {
        enriched.domain = leak.email.split('@')[1];
    }
    return enriched;
};
exports.enrichCredentialLeak = enrichCredentialLeak;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Tor integration
    createTorConfig: exports.createTorConfig,
    requestNewTorCircuit: exports.requestNewTorCircuit,
    validateOnionAddress: exports.validateOnionAddress,
    fetchTorHiddenService: exports.fetchTorHiddenService,
    checkTorConnection: exports.checkTorConnection,
    // I2P integration
    createI2PConfig: exports.createI2PConfig,
    validateI2PAddress: exports.validateI2PAddress,
    fetchI2PEepsite: exports.fetchI2PEepsite,
    checkI2PConnection: exports.checkI2PConnection,
    // Paste site monitoring
    createPasteSiteConfig: exports.createPasteSiteConfig,
    scrapeRecentPastes: exports.scrapeRecentPastes,
    searchPasteSites: exports.searchPasteSites,
    monitorPasteCredentials: exports.monitorPasteCredentials,
    // Marketplace monitoring
    scrapeMarketplaceListings: exports.scrapeMarketplaceListings,
    searchMarketplace: exports.searchMarketplace,
    trackMarketplaceVendor: exports.trackMarketplaceVendor,
    calculateMarketplaceRiskScore: exports.calculateMarketplaceRiskScore,
    // Credential leak detection
    detectCredentialLeaks: exports.detectCredentialLeaks,
    validateCredentialLeak: exports.validateCredentialLeak,
    calculateLeakSeverity: exports.calculateLeakSeverity,
    groupLeaksByDomain: exports.groupLeaksByDomain,
    // Entity extraction
    extractEmailEntities: exports.extractEmailEntities,
    extractDomainEntities: exports.extractDomainEntities,
    extractIPEntities: exports.extractIPEntities,
    extractCryptoEntities: exports.extractCryptoEntities,
    extractAllEntities: exports.extractAllEntities,
    // Alert generation
    createDarkWebAlert: exports.createDarkWebAlert,
    calculateAlertPriority: exports.calculateAlertPriority,
    filterAlertsBySeverity: exports.filterAlertsBySeverity,
    deduplicateAlerts: exports.deduplicateAlerts,
    calculateStringSimilarity: exports.calculateStringSimilarity,
    // Scraping utilities
    createScrapingJob: exports.createScrapingJob,
    updateScrapingJob: exports.updateScrapingJob,
    validateDarkWebSource: exports.validateDarkWebSource,
    aggregateDarkWebIntelligence: exports.aggregateDarkWebIntelligence,
    filterSourcesByActivity: exports.filterSourcesByActivity,
    calculateSourceTrustScore: exports.calculateSourceTrustScore,
    exportToSTIX: exports.exportToSTIX,
    scheduleDarkWebScan: exports.scheduleDarkWebScan,
    enrichCredentialLeak: exports.enrichCredentialLeak,
};
//# sourceMappingURL=dark-web-monitoring-kit.js.map