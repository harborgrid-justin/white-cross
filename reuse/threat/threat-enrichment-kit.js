"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.monitorCachePerformance = exports.optimizeCacheTTL = exports.invalidateEnrichmentCache = exports.retrieveCachedEnrichment = exports.cacheEnrichmentResult = exports.createEnrichmentCache = exports.validateThreatIntelData = exports.prioritizeThreatSources = exports.calculateReputationScore = exports.aggregateThreatData = exports.normalizeThreatIntelFeed = exports.integrateMultipleSources = exports.analyzeCertificateMetadata = exports.extractCertificateFingerprint = exports.validateCertificateChain = exports.parseSSLCertificate = exports.enrichWithSSLCertificate = exports.cacheDNSResults = exports.validateDNSData = exports.resolveDNSRecords = exports.fetchDNSHistory = exports.queryPassiveDNS = exports.performReverseDNS = exports.enrichWithDNS = exports.validateGeoIPResults = exports.cacheGeoIPData = exports.resolveNetworkRange = exports.queryASNInformation = exports.lookupIPGeolocation = exports.enrichWithGeoIP = exports.validateWHOISData = exports.trackWHOISHistory = exports.extractRegistrarInfo = exports.parseWHOISResponse = exports.queryDomainWHOIS = exports.enrichWithWHOIS = exports.handleEnrichmentErrors = exports.transformEnrichmentOutput = exports.mergeEnrichmentResults = exports.validateEnrichmentData = exports.aggregateEnrichmentResults = exports.prioritizeEnrichmentSources = exports.orchestrateEnrichment = exports.createEnrichmentPipeline = void 0;
// ============================================================================
// IOC ENRICHMENT PIPELINE
// ============================================================================
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
const createEnrichmentPipeline = (config) => {
    if (!config.sources || config.sources.length === 0) {
        throw new Error('At least one enrichment source must be configured');
    }
    const stages = config.sources
        .filter((source) => source.enabled)
        .sort((a, b) => a.priority - b.priority)
        .map((source) => ({
        name: source.name,
        type: source.type,
        handler: createEnrichmentHandler(source),
        timeout: config.timeout || 5000,
        retries: config.retries || 3,
        critical: source.priority === 1,
    }));
    return {
        id: generatePipelineId(),
        stages,
        config,
        status: 'pending',
    };
};
exports.createEnrichmentPipeline = createEnrichmentPipeline;
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
const orchestrateEnrichment = async (ioc, pipeline) => {
    if (!ioc || typeof ioc !== 'string') {
        throw new Error('Invalid IOC: must be a non-empty string');
    }
    pipeline.status = 'running';
    pipeline.startTime = new Date();
    const enrichments = {};
    const sources = [];
    try {
        if (pipeline.config.parallel) {
            // Parallel enrichment
            const promises = pipeline.stages.map(async (stage) => {
                try {
                    const data = await executeWithRetry(() => stage.handler(ioc), stage.retries, stage.timeout);
                    return { stage: stage.name, data };
                }
                catch (error) {
                    if (stage.critical)
                        throw error;
                    return { stage: stage.name, data: null };
                }
            });
            const results = await Promise.all(promises);
            results.forEach((result) => {
                if (result.data) {
                    enrichments[result.stage] = result.data;
                    sources.push(result.stage);
                }
            });
        }
        else {
            // Sequential enrichment
            for (const stage of pipeline.stages) {
                try {
                    const data = await executeWithRetry(() => stage.handler(ioc), stage.retries, stage.timeout);
                    enrichments[stage.name] = data;
                    sources.push(stage.name);
                }
                catch (error) {
                    if (stage.critical)
                        throw error;
                }
            }
        }
        pipeline.status = 'completed';
        pipeline.endTime = new Date();
        return {
            ioc,
            iocType: detectIOCType(ioc),
            enrichments,
            timestamp: new Date(),
            sources,
            confidence: calculateEnrichmentConfidence(enrichments),
            metadata: {
                duration: pipeline.endTime.getTime() - pipeline.startTime.getTime(),
                sourceCount: sources.length,
            },
        };
    }
    catch (error) {
        pipeline.status = 'failed';
        pipeline.endTime = new Date();
        throw new Error(`Enrichment failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};
exports.orchestrateEnrichment = orchestrateEnrichment;
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
const prioritizeEnrichmentSources = (sources, iocType) => {
    return [...sources]
        .filter((source) => source.enabled)
        .sort((a, b) => {
        // Prioritize based on source type relevance to IOC type
        const aRelevance = getSourceRelevance(a.type, iocType);
        const bRelevance = getSourceRelevance(b.type, iocType);
        if (aRelevance !== bRelevance) {
            return bRelevance - aRelevance;
        }
        return a.priority - b.priority;
    });
};
exports.prioritizeEnrichmentSources = prioritizeEnrichmentSources;
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
const aggregateEnrichmentResults = (results) => {
    if (results.length === 0) {
        throw new Error('Cannot aggregate empty results array');
    }
    const aggregated = {
        ioc: results[0].ioc,
        iocType: results[0].iocType,
        enrichments: {},
        timestamp: new Date(),
        sources: [],
        confidence: 0,
        metadata: {},
    };
    results.forEach((result) => {
        Object.entries(result.enrichments).forEach(([source, data]) => {
            aggregated.enrichments[source] = data;
        });
        aggregated.sources.push(...result.sources);
    });
    aggregated.sources = Array.from(new Set(aggregated.sources));
    aggregated.confidence = calculateEnrichmentConfidence(aggregated.enrichments);
    return aggregated;
};
exports.aggregateEnrichmentResults = aggregateEnrichmentResults;
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
const validateEnrichmentData = (data, requiredFields) => {
    if (!data.source || !data.data || !data.timestamp) {
        return false;
    }
    if (data.reliability < 0 || data.reliability > 1) {
        return false;
    }
    if (requiredFields) {
        return requiredFields.every((field) => field in data.data);
    }
    return true;
};
exports.validateEnrichmentData = validateEnrichmentData;
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
const mergeEnrichmentResults = (dataArray, strategy) => {
    if (dataArray.length === 0)
        return {};
    if (dataArray.length === 1)
        return dataArray[0].data;
    const merged = {};
    const allKeys = new Set();
    dataArray.forEach((data) => {
        Object.keys(data.data).forEach((key) => allKeys.add(key));
    });
    allKeys.forEach((key) => {
        const values = dataArray
            .filter((data) => key in data.data)
            .map((data) => ({ value: data.data[key], reliability: data.reliability, timestamp: data.timestamp }));
        if (values.length === 0)
            return;
        if (strategy === 'newest') {
            const newest = values.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
            merged[key] = newest.value;
        }
        else if (strategy === 'most_reliable') {
            const mostReliable = values.sort((a, b) => b.reliability - a.reliability)[0];
            merged[key] = mostReliable.value;
        }
        else if (strategy === 'consensus') {
            // Use value with highest count or most reliable if tie
            const valueCounts = new Map();
            values.forEach(({ value, reliability }) => {
                const key = JSON.stringify(value);
                const existing = valueCounts.get(key) || { count: 0, reliability: 0 };
                valueCounts.set(key, {
                    count: existing.count + 1,
                    reliability: Math.max(existing.reliability, reliability),
                });
            });
            const consensus = Array.from(valueCounts.entries()).sort((a, b) => {
                if (a[1].count !== b[1].count)
                    return b[1].count - a[1].count;
                return b[1].reliability - a[1].reliability;
            })[0];
            merged[key] = JSON.parse(consensus[0]);
        }
    });
    return merged;
};
exports.mergeEnrichmentResults = mergeEnrichmentResults;
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
const transformEnrichmentOutput = (result, format) => {
    if (format === 'json') {
        return result;
    }
    if (format === 'stix') {
        return {
            type: 'indicator',
            spec_version: '2.1',
            id: `indicator--${generateUUID()}`,
            created: result.timestamp.toISOString(),
            modified: result.timestamp.toISOString(),
            pattern: `[${result.iocType}:value = '${result.ioc}']`,
            pattern_type: 'stix',
            valid_from: result.timestamp.toISOString(),
            confidence: Math.round(result.confidence * 100),
            external_references: result.sources.map((source) => ({
                source_name: source,
                description: `Enriched from ${source}`,
            })),
        };
    }
    if (format === 'misp') {
        return {
            Event: {
                info: `Enriched IOC: ${result.ioc}`,
                date: result.timestamp.toISOString().split('T')[0],
                Attribute: Object.entries(result.enrichments).map(([source, data]) => ({
                    type: result.iocType,
                    value: result.ioc,
                    comment: `Enriched from ${source}`,
                    to_ids: true,
                    data: data.data,
                })),
            },
        };
    }
    return result;
};
exports.transformEnrichmentOutput = transformEnrichmentOutput;
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
const handleEnrichmentErrors = async (error, stage, attempt) => {
    console.error(`Enrichment error in stage ${stage.name} (attempt ${attempt}):`, error.message);
    if (attempt >= stage.retries) {
        if (stage.critical) {
            throw new Error(`Critical enrichment stage ${stage.name} failed after ${attempt} attempts`);
        }
        return null;
    }
    // Exponential backoff
    const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
    await new Promise((resolve) => setTimeout(resolve, delay));
    try {
        return await stage.handler('retry');
    }
    catch (retryError) {
        return (0, exports.handleEnrichmentErrors)(retryError instanceof Error ? retryError : new Error('Unknown error'), stage, attempt + 1);
    }
};
exports.handleEnrichmentErrors = handleEnrichmentErrors;
// ============================================================================
// WHOIS ENRICHMENT
// ============================================================================
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
const enrichWithWHOIS = async (domain) => {
    if (!isValidDomain(domain)) {
        throw new Error(`Invalid domain: ${domain}`);
    }
    // In production, this would query actual WHOIS servers
    return {
        domain,
        registrar: 'Example Registrar',
        registrant: {
            organization: 'Example Organization',
            country: 'US',
        },
        adminContact: {
            email: 'admin@example.com',
        },
        techContact: {
            email: 'tech@example.com',
        },
        nameservers: ['ns1.example.com', 'ns2.example.com'],
        status: ['clientTransferProhibited'],
        createdDate: new Date('2020-01-01'),
        updatedDate: new Date('2024-01-01'),
        expiresDate: new Date('2025-01-01'),
        dnssec: false,
    };
};
exports.enrichWithWHOIS = enrichWithWHOIS;
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
const queryDomainWHOIS = async (domain, whoisServer) => {
    // In production, implement actual WHOIS protocol query
    return `Domain: ${domain}\nRegistrar: Example\nCreated: 2020-01-01\n`;
};
exports.queryDomainWHOIS = queryDomainWHOIS;
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
const parseWHOISResponse = (whoisResponse) => {
    // Simplified parsing - production would use comprehensive parser
    const lines = whoisResponse.split('\n');
    const data = {
        domain: '',
        registrar: '',
        registrant: {},
        adminContact: {},
        techContact: {},
        nameservers: [],
        status: [],
        createdDate: new Date(),
        updatedDate: new Date(),
        expiresDate: new Date(),
        dnssec: false,
    };
    lines.forEach((line) => {
        const [key, value] = line.split(':').map((s) => s.trim());
        if (key === 'Domain')
            data.domain = value;
        if (key === 'Registrar')
            data.registrar = value;
    });
    return data;
};
exports.parseWHOISResponse = parseWHOISResponse;
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
const extractRegistrarInfo = (whoisData) => {
    return {
        name: whoisData.registrar,
        registrant: whoisData.registrant.organization || '',
        email: whoisData.adminContact.email || '',
    };
};
exports.extractRegistrarInfo = extractRegistrarInfo;
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
const trackWHOISHistory = async (domain, currentData) => {
    // In production, query WHOIS history database
    return [currentData];
};
exports.trackWHOISHistory = trackWHOISHistory;
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
const validateWHOISData = (whoisData) => {
    return Boolean(whoisData.domain &&
        whoisData.registrar &&
        whoisData.createdDate &&
        whoisData.expiresDate);
};
exports.validateWHOISData = validateWHOISData;
// ============================================================================
// GEOIP ENRICHMENT
// ============================================================================
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
const enrichWithGeoIP = async (ip) => {
    if (!isValidIP(ip)) {
        throw new Error(`Invalid IP address: ${ip}`);
    }
    // In production, query MaxMind, IP2Location, or similar service
    return {
        ip,
        country: 'United States',
        countryCode: 'US',
        region: 'California',
        city: 'Mountain View',
        latitude: 37.4056,
        longitude: -122.0775,
        timezone: 'America/Los_Angeles',
        asn: 15169,
        asnOrg: 'Google LLC',
        isp: 'Google',
        proxy: false,
        vpn: false,
        tor: false,
    };
};
exports.enrichWithGeoIP = enrichWithGeoIP;
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
const lookupIPGeolocation = async (ip, provider) => {
    // Provider-specific implementation
    return (0, exports.enrichWithGeoIP)(ip);
};
exports.lookupIPGeolocation = lookupIPGeolocation;
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
const queryASNInformation = async (ip) => {
    const geoData = await (0, exports.enrichWithGeoIP)(ip);
    return {
        asn: geoData.asn,
        org: geoData.asnOrg,
        country: geoData.countryCode,
        isp: geoData.isp,
    };
};
exports.queryASNInformation = queryASNInformation;
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
const resolveNetworkRange = async (ip) => {
    // In production, query WHOIS or BGP data
    const parts = ip.split('.');
    return `${parts[0]}.${parts[1]}.${parts[2]}.0/24`;
};
exports.resolveNetworkRange = resolveNetworkRange;
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
const cacheGeoIPData = async (ip, data, ttl) => {
    // In production, store in Redis or similar
    console.log(`Caching GeoIP data for ${ip} with TTL ${ttl}s`);
};
exports.cacheGeoIPData = cacheGeoIPData;
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
const validateGeoIPResults = (geoData) => {
    return Boolean(geoData.ip &&
        geoData.country &&
        geoData.countryCode &&
        geoData.latitude >= -90 &&
        geoData.latitude <= 90 &&
        geoData.longitude >= -180 &&
        geoData.longitude <= 180);
};
exports.validateGeoIPResults = validateGeoIPResults;
// ============================================================================
// DNS ENRICHMENT
// ============================================================================
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
const enrichWithDNS = async (target, recordTypes) => {
    const types = recordTypes || ['A', 'AAAA', 'MX', 'NS', 'TXT'];
    const records = [];
    for (const type of types) {
        try {
            const record = await (0, exports.resolveDNSRecords)(target, type);
            records.push(...record);
        }
        catch (error) {
            // Continue with other record types
        }
    }
    return records;
};
exports.enrichWithDNS = enrichWithDNS;
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
const performReverseDNS = async (ip) => {
    if (!isValidIP(ip)) {
        throw new Error(`Invalid IP address: ${ip}`);
    }
    // In production, perform actual PTR lookup
    return [`reverse.${ip}.example.com`];
};
exports.performReverseDNS = performReverseDNS;
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
const queryPassiveDNS = async (query, days = 30) => {
    // In production, query passive DNS providers like DNSDB, VirusTotal, etc.
    return [
        {
            domain: query,
            ip: '1.2.3.4',
            firstSeen: new Date(Date.now() - days * 86400000),
            lastSeen: new Date(),
            recordType: 'A',
            source: 'passive_dns',
            count: 42,
        },
    ];
};
exports.queryPassiveDNS = queryPassiveDNS;
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
const fetchDNSHistory = async (domain, startDate, endDate) => {
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / 86400000);
    return (0, exports.queryPassiveDNS)(domain, days);
};
exports.fetchDNSHistory = fetchDNSHistory;
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
const resolveDNSRecords = async (domain, type) => {
    // In production, use dns.promises.resolve()
    return [
        {
            name: domain,
            type,
            value: type === 'A' ? '1.2.3.4' : 'example-value',
            ttl: 3600,
            timestamp: new Date(),
        },
    ];
};
exports.resolveDNSRecords = resolveDNSRecords;
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
const validateDNSData = (records) => {
    return records.every((record) => record.name &&
        record.type &&
        record.value &&
        record.ttl > 0);
};
exports.validateDNSData = validateDNSData;
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
const cacheDNSResults = async (domain, records, ttl) => {
    const cacheTTL = ttl || Math.min(...records.map((r) => r.ttl));
    console.log(`Caching DNS records for ${domain} with TTL ${cacheTTL}s`);
};
exports.cacheDNSResults = cacheDNSResults;
// ============================================================================
// SSL CERTIFICATE ANALYSIS
// ============================================================================
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
const enrichWithSSLCertificate = async (domain, port = 443) => {
    // In production, fetch actual certificate via TLS connection
    return {
        subject: {
            commonName: domain,
            organization: 'Example Organization',
            country: 'US',
        },
        issuer: {
            commonName: 'Example CA',
            organization: 'Example CA Inc',
            country: 'US',
        },
        serialNumber: '0123456789ABCDEF',
        fingerprint: 'AA:BB:CC:DD:EE:FF',
        fingerprintSha256: '01:23:45:67:89:AB:CD:EF',
        validFrom: new Date('2024-01-01'),
        validTo: new Date('2025-01-01'),
        publicKey: {
            algorithm: 'RSA',
            keySize: 2048,
            exponent: 65537,
        },
        extensions: [],
        signatureAlgorithm: 'sha256WithRSAEncryption',
        version: 3,
    };
};
exports.enrichWithSSLCertificate = enrichWithSSLCertificate;
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
const parseSSLCertificate = (certData, format) => {
    // In production, use x509 library to parse certificate
    return {
        subject: { commonName: 'example.com' },
        issuer: { commonName: 'CA' },
        serialNumber: '123',
        fingerprint: 'AA:BB:CC',
        fingerprintSha256: '01:23:45',
        validFrom: new Date(),
        validTo: new Date(),
        publicKey: { algorithm: 'RSA', keySize: 2048 },
        extensions: [],
        signatureAlgorithm: 'sha256',
        version: 3,
    };
};
exports.parseSSLCertificate = parseSSLCertificate;
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
const validateCertificateChain = (chain) => {
    if (chain.length === 0)
        return false;
    // Validate each certificate in chain
    for (const cert of chain) {
        const now = new Date();
        if (now < cert.validFrom || now > cert.validTo) {
            return false;
        }
    }
    return true;
};
exports.validateCertificateChain = validateCertificateChain;
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
const extractCertificateFingerprint = (certificate, algorithm) => {
    return algorithm === 'sha256' ? certificate.fingerprintSha256 : certificate.fingerprint;
};
exports.extractCertificateFingerprint = extractCertificateFingerprint;
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
const analyzeCertificateMetadata = (certificate) => {
    const now = new Date();
    const daysUntilExpiry = Math.floor((certificate.validTo.getTime() - now.getTime()) / 86400000);
    return {
        isSelfSigned: certificate.subject.commonName === certificate.issuer.commonName,
        isExpired: now > certificate.validTo,
        isNotYetValid: now < certificate.validFrom,
        daysUntilExpiry,
        keySize: certificate.publicKey.keySize,
        signatureAlgorithm: certificate.signatureAlgorithm,
        version: certificate.version,
    };
};
exports.analyzeCertificateMetadata = analyzeCertificateMetadata;
// ============================================================================
// THREAT INTELLIGENCE INTEGRATION
// ============================================================================
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
const integrateMultipleSources = async (ioc, sources) => {
    const feeds = [];
    for (const source of sources) {
        try {
            const feed = await queryThreatIntelSource(ioc, source);
            if (feed)
                feeds.push(feed);
        }
        catch (error) {
            console.error(`Failed to query ${source}:`, error);
        }
    }
    return feeds;
};
exports.integrateMultipleSources = integrateMultipleSources;
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
const normalizeThreatIntelFeed = (rawFeed, source) => {
    return {
        feedId: generateUUID(),
        name: source,
        type: 'reputation',
        provider: source,
        updateFrequency: 3600,
        reliability: 0.8,
        lastUpdate: new Date(),
        indicators: [],
    };
};
exports.normalizeThreatIntelFeed = normalizeThreatIntelFeed;
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
const aggregateThreatData = (feeds) => {
    const indicatorMap = new Map();
    feeds.forEach((feed) => {
        feed.indicators.forEach((indicator) => {
            const key = `${indicator.type}:${indicator.value}`;
            const existing = indicatorMap.get(key);
            if (!existing) {
                indicatorMap.set(key, indicator);
            }
            else {
                // Merge indicators, taking highest confidence
                existing.confidence = Math.max(existing.confidence, indicator.confidence);
                existing.tags = Array.from(new Set([...existing.tags, ...indicator.tags]));
                existing.firstSeen = new Date(Math.min(existing.firstSeen.getTime(), indicator.firstSeen.getTime()));
                existing.lastSeen = new Date(Math.max(existing.lastSeen.getTime(), indicator.lastSeen.getTime()));
            }
        });
    });
    return Array.from(indicatorMap.values());
};
exports.aggregateThreatData = aggregateThreatData;
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
const calculateReputationScore = (ioc, feeds) => {
    const sources = feeds.map((feed) => {
        const indicators = feed.indicators.filter((ind) => ind.value === ioc);
        const avgConfidence = indicators.length > 0
            ? indicators.reduce((sum, ind) => sum + ind.confidence, 0) / indicators.length
            : 0;
        return {
            name: feed.name,
            score: 1 - avgConfidence, // Lower score for higher threat
            confidence: feed.reliability,
            lastChecked: feed.lastUpdate,
        };
    });
    const weightedScore = sources.reduce((sum, src) => sum + src.score * src.confidence, 0) /
        sources.reduce((sum, src) => sum + src.confidence, 1);
    const category = weightedScore < 0.3
        ? 'malicious'
        : weightedScore < 0.6
            ? 'suspicious'
            : weightedScore < 0.8
                ? 'neutral'
                : 'benign';
    return {
        ioc,
        score: weightedScore,
        category,
        sources,
        lastUpdated: new Date(),
        factors: sources.map((src) => ({
            name: src.name,
            value: src.score,
            impact: src.score < 0.5 ? 'negative' : 'neutral',
            weight: src.confidence,
        })),
    };
};
exports.calculateReputationScore = calculateReputationScore;
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
const prioritizeThreatSources = (sources) => {
    return [...sources]
        .filter((source) => source.enabled && source.type === 'threat_intel')
        .sort((a, b) => a.priority - b.priority);
};
exports.prioritizeThreatSources = prioritizeThreatSources;
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
const validateThreatIntelData = (feed) => {
    return Boolean(feed.feedId &&
        feed.name &&
        feed.provider &&
        feed.reliability >= 0 &&
        feed.reliability <= 1 &&
        Array.isArray(feed.indicators));
};
exports.validateThreatIntelData = validateThreatIntelData;
// ============================================================================
// CACHING STRATEGIES
// ============================================================================
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
const createEnrichmentCache = (config) => {
    return new EnrichmentCache(config);
};
exports.createEnrichmentCache = createEnrichmentCache;
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
const cacheEnrichmentResult = async (key, result, ttl) => {
    // In production, store in Redis
    console.log(`Caching enrichment result for ${key} with TTL ${ttl}s`);
};
exports.cacheEnrichmentResult = cacheEnrichmentResult;
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
const retrieveCachedEnrichment = async (key) => {
    // In production, retrieve from Redis
    return null;
};
exports.retrieveCachedEnrichment = retrieveCachedEnrichment;
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
const invalidateEnrichmentCache = async (pattern) => {
    // In production, delete from Redis using pattern
    console.log(`Invalidating cache entries matching: ${pattern}`);
    return 0;
};
exports.invalidateEnrichmentCache = invalidateEnrichmentCache;
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
const optimizeCacheTTL = (result) => {
    // Base TTL
    let ttl = 3600; // 1 hour
    // Increase TTL for high-confidence results
    if (result.confidence > 0.9) {
        ttl = 7200; // 2 hours
    }
    else if (result.confidence > 0.7) {
        ttl = 5400; // 1.5 hours
    }
    // Decrease TTL for low-confidence results
    if (result.confidence < 0.5) {
        ttl = 1800; // 30 minutes
    }
    // Adjust based on source count
    if (result.sources.length > 3) {
        ttl *= 1.5;
    }
    return Math.round(ttl);
};
exports.optimizeCacheTTL = optimizeCacheTTL;
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
const monitorCachePerformance = async () => {
    // In production, get stats from Redis or cache implementation
    return {
        hits: 1000,
        misses: 200,
        evictions: 50,
        size: 5000,
        hitRate: 0.833,
        avgLatency: 2.5,
    };
};
exports.monitorCachePerformance = monitorCachePerformance;
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
class EnrichmentCache {
    constructor(config) {
        this.config = config;
        this.cache = new Map();
        this.stats = {
            hits: 0,
            misses: 0,
            evictions: 0,
            size: 0,
            hitRate: 0,
            avgLatency: 0,
        };
    }
    async get(key) {
        const entry = this.cache.get(key);
        if (!entry) {
            this.stats.misses++;
            return null;
        }
        if (this.isExpired(entry)) {
            this.cache.delete(key);
            this.stats.misses++;
            return null;
        }
        entry.hits++;
        this.stats.hits++;
        return entry.value;
    }
    async set(key, value, ttl) {
        const entry = {
            key,
            value,
            timestamp: new Date(),
            ttl: ttl || this.config.ttl,
            hits: 0,
        };
        this.cache.set(key, entry);
        this.stats.size = this.cache.size;
    }
    isExpired(entry) {
        const age = Date.now() - entry.timestamp.getTime();
        return age > entry.ttl * 1000;
    }
    getStats() {
        const total = this.stats.hits + this.stats.misses;
        this.stats.hitRate = total > 0 ? this.stats.hits / total : 0;
        return { ...this.stats };
    }
}
function createEnrichmentHandler(source) {
    return async (ioc) => {
        // Simulated enrichment - in production, call actual APIs
        return {
            source: source.name,
            data: { enriched: true, ioc },
            timestamp: new Date(),
            reliability: 0.8,
            ttl: 3600,
        };
    };
}
function generatePipelineId() {
    return `pipeline_${Date.now()}_${Math.random().toString(36).substring(7)}`;
}
function detectIOCType(ioc) {
    if (isValidIP(ioc))
        return 'ip';
    if (isValidDomain(ioc))
        return 'domain';
    if (ioc.startsWith('http'))
        return 'url';
    if (ioc.includes('@'))
        return 'email';
    return 'hash';
}
function calculateEnrichmentConfidence(enrichments) {
    const sources = Object.values(enrichments);
    if (sources.length === 0)
        return 0;
    const avgReliability = sources.reduce((sum, data) => sum + data.reliability, 0) / sources.length;
    const sourceCountFactor = Math.min(sources.length / 5, 1.0);
    return avgReliability * 0.7 + sourceCountFactor * 0.3;
}
async function executeWithRetry(fn, retries, timeout) {
    let lastError;
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            return await Promise.race([
                fn(),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout)),
            ]);
        }
        catch (error) {
            lastError = error instanceof Error ? error : new Error('Unknown error');
            if (attempt < retries) {
                await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
            }
        }
    }
    throw lastError || new Error('Execution failed');
}
function getSourceRelevance(sourceType, iocType) {
    const relevanceMap = {
        ip: { geoip: 10, dns: 8, whois: 5, ssl: 3, threat_intel: 9, reputation: 9 },
        domain: { whois: 10, dns: 9, ssl: 8, geoip: 4, threat_intel: 9, reputation: 9 },
        url: { ssl: 8, dns: 7, threat_intel: 10, reputation: 10, whois: 5, geoip: 3 },
        hash: { threat_intel: 10, reputation: 10, whois: 1, dns: 1, geoip: 1, ssl: 1 },
    };
    return relevanceMap[iocType]?.[sourceType] || 5;
}
function isValidDomain(domain) {
    const domainRegex = /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
    return domainRegex.test(domain);
}
function isValidIP(ip) {
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
async function queryThreatIntelSource(ioc, source) {
    // In production, query actual threat intel APIs
    return {
        feedId: generateUUID(),
        name: source,
        type: 'reputation',
        provider: source,
        updateFrequency: 3600,
        reliability: 0.85,
        lastUpdate: new Date(),
        indicators: [
            {
                value: ioc,
                type: detectIOCType(ioc),
                threatType: 'malware',
                confidence: 0.75,
                tags: ['malicious', 'c2'],
                firstSeen: new Date(),
                lastSeen: new Date(),
            },
        ],
    };
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // IOC enrichment pipeline
    createEnrichmentPipeline: exports.createEnrichmentPipeline,
    orchestrateEnrichment: exports.orchestrateEnrichment,
    prioritizeEnrichmentSources: exports.prioritizeEnrichmentSources,
    aggregateEnrichmentResults: exports.aggregateEnrichmentResults,
    validateEnrichmentData: exports.validateEnrichmentData,
    mergeEnrichmentResults: exports.mergeEnrichmentResults,
    transformEnrichmentOutput: exports.transformEnrichmentOutput,
    handleEnrichmentErrors: exports.handleEnrichmentErrors,
    // WHOIS enrichment
    enrichWithWHOIS: exports.enrichWithWHOIS,
    queryDomainWHOIS: exports.queryDomainWHOIS,
    parseWHOISResponse: exports.parseWHOISResponse,
    extractRegistrarInfo: exports.extractRegistrarInfo,
    trackWHOISHistory: exports.trackWHOISHistory,
    validateWHOISData: exports.validateWHOISData,
    // GeoIP enrichment
    enrichWithGeoIP: exports.enrichWithGeoIP,
    lookupIPGeolocation: exports.lookupIPGeolocation,
    queryASNInformation: exports.queryASNInformation,
    resolveNetworkRange: exports.resolveNetworkRange,
    cacheGeoIPData: exports.cacheGeoIPData,
    validateGeoIPResults: exports.validateGeoIPResults,
    // DNS enrichment
    enrichWithDNS: exports.enrichWithDNS,
    performReverseDNS: exports.performReverseDNS,
    queryPassiveDNS: exports.queryPassiveDNS,
    fetchDNSHistory: exports.fetchDNSHistory,
    resolveDNSRecords: exports.resolveDNSRecords,
    validateDNSData: exports.validateDNSData,
    cacheDNSResults: exports.cacheDNSResults,
    // SSL certificate analysis
    enrichWithSSLCertificate: exports.enrichWithSSLCertificate,
    parseSSLCertificate: exports.parseSSLCertificate,
    validateCertificateChain: exports.validateCertificateChain,
    extractCertificateFingerprint: exports.extractCertificateFingerprint,
    analyzeCertificateMetadata: exports.analyzeCertificateMetadata,
    // Threat intel integration
    integrateMultipleSources: exports.integrateMultipleSources,
    normalizeThreatIntelFeed: exports.normalizeThreatIntelFeed,
    aggregateThreatData: exports.aggregateThreatData,
    calculateReputationScore: exports.calculateReputationScore,
    prioritizeThreatSources: exports.prioritizeThreatSources,
    validateThreatIntelData: exports.validateThreatIntelData,
    // Caching strategies
    createEnrichmentCache: exports.createEnrichmentCache,
    cacheEnrichmentResult: exports.cacheEnrichmentResult,
    retrieveCachedEnrichment: exports.retrieveCachedEnrichment,
    invalidateEnrichmentCache: exports.invalidateEnrichmentCache,
    optimizeCacheTTL: exports.optimizeCacheTTL,
    monitorCachePerformance: exports.monitorCachePerformance,
};
//# sourceMappingURL=threat-enrichment-kit.js.map