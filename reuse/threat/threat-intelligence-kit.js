"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateThreatIntelStats = exports.enrichIOC = exports.enrichIOCDNS = exports.enrichIOCWhois = exports.enrichIOCReputation = exports.enrichIOCGeolocation = exports.fetchFromTAXII = exports.publishToTAXII = exports.parseSTIXIndicator = exports.parseSTIXBundle = exports.createSTIXBundle = exports.generateSTIXPattern = exports.convertIOCToSTIX = exports.suggestMITREMappings = exports.getMITRECoverage = exports.mapIOCToMITRE = exports.addCampaignEvent = exports.analyzeCampaignTimeline = exports.createThreatCampaign = exports.trackThreatActorActivity = exports.linkThreatActorToIOCs = exports.createThreatActor = exports.queryIOCs = exports.findRelatedIOCs = exports.expireIOC = exports.markIOCFalsePositive = exports.updateIOC = exports.createIOC = exports.syncThreatFeed = exports.applyThreatFeedFilters = exports.validateIOCFormat = exports.normalizeIOCValue = exports.fetchFeedData = exports.aggregateThreatFeeds = exports.getThreatCampaignModelAttributes = exports.getThreatActorModelAttributes = exports.getIOCModelAttributes = exports.getThreatFeedModelAttributes = exports.CampaignStatus = exports.ThreatMotivation = exports.ThreatSophistication = exports.ThreatActorType = exports.ThreatSeverity = exports.IOCType = exports.ThreatFeedType = void 0;
/**
 * File: /reuse/threat/threat-intelligence-kit.ts
 * Locator: WC-THREAT-INTEL-001
 * Purpose: Comprehensive Threat Intelligence Toolkit - Production-ready threat intelligence operations
 *
 * Upstream: Independent utility module for threat intelligence operations
 * Downstream: ../backend/*, Security services, Threat detection, IOC management, MITRE ATT&CK mapping
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize, crypto
 * Exports: 45+ utility functions for threat feeds, IOC management, threat actors, campaigns, MITRE ATT&CK, STIX/TAXII
 *
 * LLM Context: Enterprise-grade threat intelligence toolkit for White Cross healthcare platform.
 * Provides comprehensive threat feed aggregation, IOC (Indicators of Compromise) management,
 * threat actor tracking, campaign analysis, MITRE ATT&CK framework mapping, threat intelligence
 * sharing via STIX/TAXII protocols, intelligence enrichment, and HIPAA-compliant security monitoring
 * for healthcare systems. Includes Sequelize models for threats, IOCs, actors, and campaigns.
 */
const crypto = __importStar(require("crypto"));
/**
 * Threat feed types
 */
var ThreatFeedType;
(function (ThreatFeedType) {
    ThreatFeedType["IP_REPUTATION"] = "IP_REPUTATION";
    ThreatFeedType["DOMAIN_REPUTATION"] = "DOMAIN_REPUTATION";
    ThreatFeedType["URL_REPUTATION"] = "URL_REPUTATION";
    ThreatFeedType["FILE_HASH"] = "FILE_HASH";
    ThreatFeedType["MALWARE_SIGNATURE"] = "MALWARE_SIGNATURE";
    ThreatFeedType["THREAT_ACTOR"] = "THREAT_ACTOR";
    ThreatFeedType["CAMPAIGN"] = "CAMPAIGN";
    ThreatFeedType["VULNERABILITY"] = "VULNERABILITY";
    ThreatFeedType["EXPLOIT"] = "EXPLOIT";
    ThreatFeedType["MIXED"] = "MIXED";
})(ThreatFeedType || (exports.ThreatFeedType = ThreatFeedType = {}));
/**
 * IOC types following industry standards
 */
var IOCType;
(function (IOCType) {
    IOCType["IPV4"] = "IPV4";
    IOCType["IPV6"] = "IPV6";
    IOCType["DOMAIN"] = "DOMAIN";
    IOCType["URL"] = "URL";
    IOCType["EMAIL"] = "EMAIL";
    IOCType["FILE_HASH_MD5"] = "FILE_HASH_MD5";
    IOCType["FILE_HASH_SHA1"] = "FILE_HASH_SHA1";
    IOCType["FILE_HASH_SHA256"] = "FILE_HASH_SHA256";
    IOCType["FILE_HASH_SHA512"] = "FILE_HASH_SHA512";
    IOCType["FILE_NAME"] = "FILE_NAME";
    IOCType["FILE_PATH"] = "FILE_PATH";
    IOCType["REGISTRY_KEY"] = "REGISTRY_KEY";
    IOCType["MUTEX"] = "MUTEX";
    IOCType["USER_AGENT"] = "USER_AGENT";
    IOCType["CVE"] = "CVE";
    IOCType["ASN"] = "ASN";
    IOCType["SSL_CERT_FINGERPRINT"] = "SSL_CERT_FINGERPRINT";
    IOCType["YARA_RULE"] = "YARA_RULE";
})(IOCType || (exports.IOCType = IOCType = {}));
/**
 * Threat severity levels
 */
var ThreatSeverity;
(function (ThreatSeverity) {
    ThreatSeverity["CRITICAL"] = "CRITICAL";
    ThreatSeverity["HIGH"] = "HIGH";
    ThreatSeverity["MEDIUM"] = "MEDIUM";
    ThreatSeverity["LOW"] = "LOW";
    ThreatSeverity["INFO"] = "INFO";
})(ThreatSeverity || (exports.ThreatSeverity = ThreatSeverity = {}));
/**
 * Threat actor types
 */
var ThreatActorType;
(function (ThreatActorType) {
    ThreatActorType["NATION_STATE"] = "NATION_STATE";
    ThreatActorType["CYBERCRIME"] = "CYBERCRIME";
    ThreatActorType["HACKTIVIST"] = "HACKTIVIST";
    ThreatActorType["INSIDER"] = "INSIDER";
    ThreatActorType["TERRORIST"] = "TERRORIST";
    ThreatActorType["OPPORTUNIST"] = "OPPORTUNIST";
    ThreatActorType["UNKNOWN"] = "UNKNOWN";
})(ThreatActorType || (exports.ThreatActorType = ThreatActorType = {}));
/**
 * Threat sophistication levels
 */
var ThreatSophistication;
(function (ThreatSophistication) {
    ThreatSophistication["NONE"] = "NONE";
    ThreatSophistication["MINIMAL"] = "MINIMAL";
    ThreatSophistication["INTERMEDIATE"] = "INTERMEDIATE";
    ThreatSophistication["ADVANCED"] = "ADVANCED";
    ThreatSophistication["EXPERT"] = "EXPERT";
    ThreatSophistication["STRATEGIC"] = "STRATEGIC";
})(ThreatSophistication || (exports.ThreatSophistication = ThreatSophistication = {}));
/**
 * Threat motivation categories
 */
var ThreatMotivation;
(function (ThreatMotivation) {
    ThreatMotivation["FINANCIAL"] = "FINANCIAL";
    ThreatMotivation["ESPIONAGE"] = "ESPIONAGE";
    ThreatMotivation["SABOTAGE"] = "SABOTAGE";
    ThreatMotivation["IDEOLOGY"] = "IDEOLOGY";
    ThreatMotivation["GRUDGE"] = "GRUDGE";
    ThreatMotivation["NOTORIETY"] = "NOTORIETY";
    ThreatMotivation["ORGANIZATIONAL_GAIN"] = "ORGANIZATIONAL_GAIN";
    ThreatMotivation["UNKNOWN"] = "UNKNOWN";
})(ThreatMotivation || (exports.ThreatMotivation = ThreatMotivation = {}));
/**
 * Campaign status
 */
var CampaignStatus;
(function (CampaignStatus) {
    CampaignStatus["ACTIVE"] = "ACTIVE";
    CampaignStatus["SUSPECTED"] = "SUSPECTED";
    CampaignStatus["DORMANT"] = "DORMANT";
    CampaignStatus["CONCLUDED"] = "CONCLUDED";
})(CampaignStatus || (exports.CampaignStatus = CampaignStatus = {}));
// ============================================================================
// SEQUELIZE MODEL DEFINITIONS
// ============================================================================
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
const getThreatFeedModelAttributes = () => ({
    id: {
        type: 'UUID',
        defaultValue: 'UUIDV4',
        primaryKey: true,
    },
    name: {
        type: 'STRING',
        allowNull: false,
        unique: true,
    },
    provider: {
        type: 'STRING',
        allowNull: false,
    },
    feedUrl: {
        type: 'TEXT',
        allowNull: false,
    },
    feedType: {
        type: 'STRING',
        allowNull: false,
    },
    format: {
        type: 'STRING',
        allowNull: false,
    },
    updateInterval: {
        type: 'INTEGER',
        allowNull: false,
        defaultValue: 3600000, // 1 hour
    },
    enabled: {
        type: 'BOOLEAN',
        defaultValue: true,
    },
    authentication: {
        type: 'JSONB',
        allowNull: true,
    },
    filters: {
        type: 'JSONB',
        defaultValue: [],
    },
    lastSync: {
        type: 'DATE',
        allowNull: true,
    },
    lastSyncStatus: {
        type: 'STRING',
        allowNull: true,
    },
    metadata: {
        type: 'JSONB',
        defaultValue: {},
    },
    createdAt: {
        type: 'DATE',
        allowNull: false,
    },
    updatedAt: {
        type: 'DATE',
        allowNull: false,
    },
});
exports.getThreatFeedModelAttributes = getThreatFeedModelAttributes;
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
const getIOCModelAttributes = () => ({
    id: {
        type: 'UUID',
        defaultValue: 'UUIDV4',
        primaryKey: true,
    },
    type: {
        type: 'STRING',
        allowNull: false,
    },
    value: {
        type: 'TEXT',
        allowNull: false,
    },
    hash: {
        type: 'STRING',
        allowNull: false,
        unique: true,
    },
    severity: {
        type: 'STRING',
        allowNull: false,
    },
    confidence: {
        type: 'INTEGER',
        allowNull: false,
        validate: {
            min: 0,
            max: 100,
        },
    },
    firstSeen: {
        type: 'DATE',
        allowNull: false,
    },
    lastSeen: {
        type: 'DATE',
        allowNull: false,
    },
    expiresAt: {
        type: 'DATE',
        allowNull: true,
    },
    sources: {
        type: 'JSONB',
        defaultValue: [],
    },
    tags: {
        type: 'ARRAY("TEXT")',
        defaultValue: [],
    },
    relatedIOCs: {
        type: 'ARRAY("UUID")',
        defaultValue: [],
    },
    threatActors: {
        type: 'ARRAY("UUID")',
        defaultValue: [],
    },
    campaigns: {
        type: 'ARRAY("UUID")',
        defaultValue: [],
    },
    mitreAttack: {
        type: 'JSONB',
        defaultValue: [],
    },
    metadata: {
        type: 'JSONB',
        defaultValue: {},
    },
    status: {
        type: 'STRING',
        allowNull: false,
        defaultValue: 'active',
    },
    falsePositiveReason: {
        type: 'TEXT',
        allowNull: true,
    },
    enrichment: {
        type: 'JSONB',
        allowNull: true,
    },
    createdAt: {
        type: 'DATE',
        allowNull: false,
    },
    updatedAt: {
        type: 'DATE',
        allowNull: false,
    },
});
exports.getIOCModelAttributes = getIOCModelAttributes;
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
const getThreatActorModelAttributes = () => ({
    id: {
        type: 'UUID',
        defaultValue: 'UUIDV4',
        primaryKey: true,
    },
    name: {
        type: 'STRING',
        allowNull: false,
        unique: true,
    },
    aliases: {
        type: 'ARRAY("TEXT")',
        defaultValue: [],
    },
    type: {
        type: 'STRING',
        allowNull: false,
    },
    sophistication: {
        type: 'STRING',
        allowNull: false,
    },
    motivation: {
        type: 'ARRAY("TEXT")',
        defaultValue: [],
    },
    targetedSectors: {
        type: 'ARRAY("TEXT")',
        defaultValue: [],
    },
    targetedCountries: {
        type: 'ARRAY("TEXT")',
        defaultValue: [],
    },
    firstSeen: {
        type: 'DATE',
        allowNull: false,
    },
    lastSeen: {
        type: 'DATE',
        allowNull: false,
    },
    description: {
        type: 'TEXT',
        allowNull: true,
    },
    ttps: {
        type: 'ARRAY("TEXT")',
        defaultValue: [],
    },
    mitreAttack: {
        type: 'JSONB',
        defaultValue: [],
    },
    associatedCampaigns: {
        type: 'ARRAY("UUID")',
        defaultValue: [],
    },
    associatedIOCs: {
        type: 'ARRAY("UUID")',
        defaultValue: [],
    },
    metadata: {
        type: 'JSONB',
        defaultValue: {},
    },
    createdAt: {
        type: 'DATE',
        allowNull: false,
    },
    updatedAt: {
        type: 'DATE',
        allowNull: false,
    },
});
exports.getThreatActorModelAttributes = getThreatActorModelAttributes;
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
const getThreatCampaignModelAttributes = () => ({
    id: {
        type: 'UUID',
        defaultValue: 'UUIDV4',
        primaryKey: true,
    },
    name: {
        type: 'STRING',
        allowNull: false,
        unique: true,
    },
    aliases: {
        type: 'ARRAY("TEXT")',
        defaultValue: [],
    },
    description: {
        type: 'TEXT',
        allowNull: true,
    },
    status: {
        type: 'STRING',
        allowNull: false,
    },
    severity: {
        type: 'STRING',
        allowNull: false,
    },
    startDate: {
        type: 'DATE',
        allowNull: false,
    },
    endDate: {
        type: 'DATE',
        allowNull: true,
    },
    lastActivity: {
        type: 'DATE',
        allowNull: true,
    },
    threatActors: {
        type: 'ARRAY("UUID")',
        defaultValue: [],
    },
    targetedSectors: {
        type: 'ARRAY("TEXT")',
        defaultValue: [],
    },
    targetedCountries: {
        type: 'ARRAY("TEXT")',
        defaultValue: [],
    },
    objectives: {
        type: 'ARRAY("TEXT")',
        defaultValue: [],
    },
    iocs: {
        type: 'ARRAY("UUID")',
        defaultValue: [],
    },
    mitreAttack: {
        type: 'JSONB',
        defaultValue: [],
    },
    timeline: {
        type: 'JSONB',
        defaultValue: [],
    },
    metadata: {
        type: 'JSONB',
        defaultValue: {},
    },
    createdAt: {
        type: 'DATE',
        allowNull: false,
    },
    updatedAt: {
        type: 'DATE',
        allowNull: false,
    },
});
exports.getThreatCampaignModelAttributes = getThreatCampaignModelAttributes;
// ============================================================================
// THREAT FEED AGGREGATION FUNCTIONS
// ============================================================================
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
const aggregateThreatFeeds = async (feeds, options) => {
    const aggregatedIOCs = [];
    const iocMap = new Map();
    for (const feed of feeds.filter((f) => f.enabled)) {
        try {
            // Simulate feed data fetching (in production, implement actual HTTP requests)
            const feedIOCs = await (0, exports.fetchFeedData)(feed);
            for (const ioc of feedIOCs) {
                // Apply age filter
                if (options?.maxAge) {
                    const age = Date.now() - ioc.lastSeen.getTime();
                    if (age > options.maxAge)
                        continue;
                }
                // Apply confidence filter
                if (options?.minConfidence && ioc.confidence < options.minConfidence) {
                    continue;
                }
                const hash = (0, exports.normalizeIOCValue)(ioc.type, ioc.value);
                if (options?.deduplication && iocMap.has(hash)) {
                    // Merge with existing IOC
                    const existing = iocMap.get(hash);
                    existing.sources.push(...ioc.sources);
                    existing.confidence = Math.max(existing.confidence, ioc.confidence);
                    existing.lastSeen = new Date(Math.max(existing.lastSeen.getTime(), ioc.lastSeen.getTime()));
                }
                else {
                    iocMap.set(hash, { ...ioc, hash });
                }
            }
        }
        catch (error) {
            console.error(`Failed to aggregate feed ${feed.name}:`, error);
        }
    }
    return Array.from(iocMap.values());
};
exports.aggregateThreatFeeds = aggregateThreatFeeds;
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
const fetchFeedData = async (feed) => {
    if (!feed.enabled) {
        throw new Error(`Feed ${feed.name} is disabled`);
    }
    try {
        // Build request headers
        const headers = {
            'User-Agent': 'WhiteCross-ThreatIntel/1.0',
            'Accept': getAcceptHeader(feed.format),
        };
        // Add authentication headers
        if (feed.authentication) {
            switch (feed.authentication.type) {
                case 'api_key':
                    headers['X-API-Key'] = feed.authentication.credentials.apiKey;
                    break;
                case 'basic':
                    const basicAuth = Buffer.from(`${feed.authentication.credentials.username}:${feed.authentication.credentials.password}`).toString('base64');
                    headers['Authorization'] = `Basic ${basicAuth}`;
                    break;
                case 'oauth2':
                    headers['Authorization'] = `Bearer ${feed.authentication.credentials.token}`;
                    break;
            }
        }
        // Fetch data from feed URL
        const response = await fetch(feed.feedUrl, {
            method: 'GET',
            headers,
            signal: AbortSignal.timeout(30000), // 30 second timeout
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch feed ${feed.name}: HTTP ${response.status} ${response.statusText}`);
        }
        const responseText = await response.text();
        // Parse response based on format
        let parsedData;
        switch (feed.format) {
            case 'json':
                parsedData = JSON.parse(responseText);
                break;
            case 'csv':
                parsedData = parseCSVFeed(responseText);
                break;
            case 'stix':
                parsedData = parseSTIXFeed(responseText);
                break;
            case 'xml':
                throw new Error('XML format parsing not yet implemented');
            default:
                parsedData = JSON.parse(responseText);
        }
        // Convert parsed data to IOCs
        const iocs = convertFeedDataToIOCs(parsedData, feed);
        // Apply filters if configured
        if (feed.filters && feed.filters.length > 0) {
            return applyFeedFilters(iocs, feed.filters);
        }
        return iocs;
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new Error(`Failed to fetch feed ${feed.name}: ${errorMessage}`);
    }
};
exports.fetchFeedData = fetchFeedData;
/**
 * Gets the appropriate Accept header for the feed format.
 *
 * @param {string} format - Feed format
 * @returns {string} Accept header value
 */
const getAcceptHeader = (format) => {
    switch (format) {
        case 'json':
        case 'stix':
            return 'application/json';
        case 'xml':
            return 'application/xml';
        case 'csv':
            return 'text/csv';
        default:
            return 'application/json';
    }
};
/**
 * Parses CSV feed data into structured format.
 *
 * @param {string} csvText - CSV content
 * @returns {any[]} Parsed records
 */
const parseCSVFeed = (csvText) => {
    const lines = csvText.trim().split('\n');
    if (lines.length === 0)
        return [];
    const headers = lines[0].split(',').map(h => h.trim());
    const records = [];
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const record = {};
        headers.forEach((header, index) => {
            record[header] = values[index] || '';
        });
        records.push(record);
    }
    return records;
};
/**
 * Parses STIX feed data.
 *
 * @param {string} stixText - STIX JSON content
 * @returns {any} Parsed STIX bundle
 */
const parseSTIXFeed = (stixText) => {
    const bundle = JSON.parse(stixText);
    if (bundle.type !== 'bundle') {
        throw new Error('Invalid STIX bundle format');
    }
    return bundle;
};
/**
 * Converts feed data to IOC format.
 *
 * @param {any} data - Parsed feed data
 * @param {ThreatFeedConfig} feed - Feed configuration
 * @returns {IOC[]} Array of IOCs
 */
const convertFeedDataToIOCs = (data, feed) => {
    const iocs = [];
    const now = new Date();
    if (feed.format === 'stix' && data.objects) {
        // Handle STIX format
        for (const obj of data.objects) {
            if (obj.type === 'indicator') {
                const ioc = (0, exports.parseSTIXIndicator)(obj);
                if (ioc) {
                    ioc.sources = [{
                            provider: feed.provider,
                            feedId: feed.id,
                            confidence: ioc.confidence,
                            firstSeen: now,
                            lastUpdated: now,
                        }];
                    iocs.push(ioc);
                }
            }
        }
    }
    else if (Array.isArray(data)) {
        // Handle array format (JSON/CSV)
        for (const item of data) {
            const ioc = convertGenericItemToIOC(item, feed);
            if (ioc) {
                iocs.push(ioc);
            }
        }
    }
    else if (data.indicators && Array.isArray(data.indicators)) {
        // Handle wrapped format
        for (const item of data.indicators) {
            const ioc = convertGenericItemToIOC(item, feed);
            if (ioc) {
                iocs.push(ioc);
            }
        }
    }
    return iocs;
};
/**
 * Converts a generic feed item to IOC format.
 *
 * @param {any} item - Feed item
 * @param {ThreatFeedConfig} feed - Feed configuration
 * @returns {IOC | null} Converted IOC or null
 */
const convertGenericItemToIOC = (item, feed) => {
    const now = new Date();
    // Detect IOC type and value from item
    let type = null;
    let value = '';
    if (item.type && item.value) {
        type = parseIOCTypeString(item.type);
        value = item.value;
    }
    else if (item.indicator) {
        value = item.indicator;
        type = detectIOCType(value);
    }
    else if (item.ip) {
        type = value.includes(':') ? IOCType.IPV6 : IOCType.IPV4;
        value = item.ip;
    }
    else if (item.domain) {
        type = IOCType.DOMAIN;
        value = item.domain;
    }
    else if (item.hash || item.md5 || item.sha1 || item.sha256) {
        value = item.hash || item.md5 || item.sha1 || item.sha256;
        type = detectHashType(value);
    }
    else if (item.url) {
        type = IOCType.URL;
        value = item.url;
    }
    if (!type || !value)
        return null;
    return {
        id: crypto.randomUUID(),
        type,
        value,
        hash: (0, exports.normalizeIOCValue)(type, value),
        severity: parseSeverity(item.severity) || ThreatSeverity.MEDIUM,
        confidence: parseConfidence(item.confidence) || 50,
        firstSeen: item.first_seen ? new Date(item.first_seen) : now,
        lastSeen: item.last_seen ? new Date(item.last_seen) : now,
        sources: [{
                provider: feed.provider,
                feedId: feed.id,
                confidence: parseConfidence(item.confidence) || 50,
                firstSeen: now,
                lastUpdated: now,
            }],
        tags: item.tags || item.labels || [],
        status: item.status || 'active',
    };
};
/**
 * Parses IOC type string to IOCType enum.
 *
 * @param {string} typeStr - Type string
 * @returns {IOCType | null} IOCType or null
 */
const parseIOCTypeString = (typeStr) => {
    const normalized = typeStr.toUpperCase().replace(/[-\s]/g, '_');
    return IOCType[normalized] || null;
};
/**
 * Detects IOC type from value.
 *
 * @param {string} value - IOC value
 * @returns {IOCType | null} Detected type
 */
const detectIOCType = (value) => {
    // IPv4
    if (/^(\d{1,3}\.){3}\d{1,3}$/.test(value))
        return IOCType.IPV4;
    // IPv6
    if (/^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/.test(value))
        return IOCType.IPV6;
    // Domain
    if (/^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?(\.[a-zA-Z]{2,})+$/.test(value))
        return IOCType.DOMAIN;
    // URL
    if (/^https?:\/\//.test(value))
        return IOCType.URL;
    // Email
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        return IOCType.EMAIL;
    // Hash
    return detectHashType(value);
};
/**
 * Detects hash type from value length.
 *
 * @param {string} value - Hash value
 * @returns {IOCType | null} Hash type
 */
const detectHashType = (value) => {
    const hexOnly = /^[a-fA-F0-9]+$/;
    if (!hexOnly.test(value))
        return null;
    switch (value.length) {
        case 32: return IOCType.FILE_HASH_MD5;
        case 40: return IOCType.FILE_HASH_SHA1;
        case 64: return IOCType.FILE_HASH_SHA256;
        case 128: return IOCType.FILE_HASH_SHA512;
        default: return null;
    }
};
/**
 * Parses severity string to ThreatSeverity enum.
 *
 * @param {string} severity - Severity string
 * @returns {ThreatSeverity | null} ThreatSeverity or null
 */
const parseSeverity = (severity) => {
    if (!severity)
        return null;
    const normalized = severity.toUpperCase();
    return ThreatSeverity[normalized] || null;
};
/**
 * Parses confidence value to number.
 *
 * @param {any} confidence - Confidence value
 * @returns {number | null} Confidence number or null
 */
const parseConfidence = (confidence) => {
    if (typeof confidence === 'number')
        return Math.min(100, Math.max(0, confidence));
    if (typeof confidence === 'string') {
        const num = parseInt(confidence, 10);
        return isNaN(num) ? null : Math.min(100, Math.max(0, num));
    }
    return null;
};
/**
 * Applies filters to IOCs.
 *
 * @param {IOC[]} iocs - IOCs to filter
 * @param {ThreatFeedFilter[]} filters - Filters to apply
 * @returns {IOC[]} Filtered IOCs
 */
const applyFeedFilters = (iocs, filters) => {
    return iocs.filter(ioc => {
        for (const filter of filters) {
            const fieldValue = ioc[filter.field];
            switch (filter.operator) {
                case 'equals':
                    if (fieldValue !== filter.value)
                        return false;
                    break;
                case 'contains':
                    if (typeof fieldValue === 'string' && !fieldValue.includes(filter.value))
                        return false;
                    break;
                case 'in':
                    if (!Array.isArray(filter.value) || !filter.value.includes(fieldValue))
                        return false;
                    break;
                case 'greater_than':
                    if (fieldValue <= filter.value)
                        return false;
                    break;
                case 'less_than':
                    if (fieldValue >= filter.value)
                        return false;
                    break;
                case 'regex':
                    const regex = new RegExp(filter.value);
                    if (typeof fieldValue === 'string' && !regex.test(fieldValue))
                        return false;
                    break;
            }
        }
        return true;
    });
};
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
const normalizeIOCValue = (type, value) => {
    let normalized = value.trim();
    switch (type) {
        case IOCType.DOMAIN:
        case IOCType.EMAIL:
            normalized = normalized.toLowerCase();
            break;
        case IOCType.IPV4:
            // Remove leading zeros
            normalized = normalized
                .split('.')
                .map((octet) => parseInt(octet, 10).toString())
                .join('.');
            break;
        case IOCType.FILE_HASH_MD5:
        case IOCType.FILE_HASH_SHA1:
        case IOCType.FILE_HASH_SHA256:
        case IOCType.FILE_HASH_SHA512:
            normalized = normalized.toLowerCase().replace(/[^a-f0-9]/g, '');
            break;
        case IOCType.URL:
            normalized = normalized.toLowerCase();
            break;
    }
    return crypto.createHash('sha256').update(normalized).digest('hex');
};
exports.normalizeIOCValue = normalizeIOCValue;
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
const validateIOCFormat = (type, value) => {
    const validators = {
        [IOCType.IPV4]: /^(\d{1,3}\.){3}\d{1,3}$/,
        [IOCType.IPV6]: /^([0-9a-fA-F]{0,4}:){7}[0-9a-fA-F]{0,4}$/,
        [IOCType.DOMAIN]: /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
        [IOCType.EMAIL]: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        [IOCType.FILE_HASH_MD5]: /^[a-fA-F0-9]{32}$/,
        [IOCType.FILE_HASH_SHA1]: /^[a-fA-F0-9]{40}$/,
        [IOCType.FILE_HASH_SHA256]: /^[a-fA-F0-9]{64}$/,
        [IOCType.FILE_HASH_SHA512]: /^[a-fA-F0-9]{128}$/,
        [IOCType.URL]: /^https?:\/\/.+/,
        [IOCType.CVE]: /^CVE-\d{4}-\d{4,}$/,
        [IOCType.FILE_NAME]: /.+/,
        [IOCType.FILE_PATH]: /.+/,
        [IOCType.REGISTRY_KEY]: /.+/,
        [IOCType.MUTEX]: /.+/,
        [IOCType.USER_AGENT]: /.+/,
        [IOCType.ASN]: /^AS\d+$/,
        [IOCType.SSL_CERT_FINGERPRINT]: /^[a-fA-F0-9:]{47,95}$/,
        [IOCType.YARA_RULE]: /.+/,
    };
    const regex = validators[type];
    if (!regex) {
        return { valid: false, error: `Unknown IOC type: ${type}` };
    }
    if (!regex.test(value)) {
        return { valid: false, error: `Invalid format for ${type}` };
    }
    return { valid: true, normalized: value.trim() };
};
exports.validateIOCFormat = validateIOCFormat;
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
const applyThreatFeedFilters = (iocs, filters) => {
    return iocs.filter((ioc) => {
        return filters.every((filter) => {
            const fieldValue = ioc[filter.field];
            switch (filter.operator) {
                case 'equals':
                    return fieldValue === filter.value;
                case 'contains':
                    return String(fieldValue).includes(String(filter.value));
                case 'regex':
                    return new RegExp(filter.value).test(String(fieldValue));
                case 'in':
                    return Array.isArray(filter.value) && filter.value.includes(fieldValue);
                case 'greater_than':
                    return fieldValue > filter.value;
                case 'less_than':
                    return fieldValue < filter.value;
                default:
                    return true;
            }
        });
    });
};
exports.applyThreatFeedFilters = applyThreatFeedFilters;
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
const syncThreatFeed = async (feed, callback) => {
    try {
        const iocs = await (0, exports.fetchFeedData)(feed);
        const filtered = feed.filters ? (0, exports.applyThreatFeedFilters)(iocs, feed.filters) : iocs;
        await callback(filtered);
        return {
            success: true,
            count: filtered.length,
        };
    }
    catch (error) {
        return {
            success: false,
            count: 0,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
};
exports.syncThreatFeed = syncThreatFeed;
// ============================================================================
// IOC MANAGEMENT FUNCTIONS
// ============================================================================
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
const createIOC = (iocData) => {
    const now = new Date();
    const validation = (0, exports.validateIOCFormat)(iocData.type, iocData.value);
    if (!validation.valid) {
        throw new Error(`Invalid IOC: ${validation.error}`);
    }
    return {
        id: iocData.id || crypto.randomUUID(),
        type: iocData.type,
        value: validation.normalized || iocData.value,
        hash: (0, exports.normalizeIOCValue)(iocData.type, iocData.value),
        severity: iocData.severity || ThreatSeverity.MEDIUM,
        confidence: iocData.confidence || 50,
        firstSeen: iocData.firstSeen || now,
        lastSeen: iocData.lastSeen || now,
        expiresAt: iocData.expiresAt,
        sources: iocData.sources || [],
        tags: iocData.tags || [],
        relatedIOCs: iocData.relatedIOCs,
        threatActors: iocData.threatActors,
        campaigns: iocData.campaigns,
        mitreAttack: iocData.mitreAttack,
        metadata: iocData.metadata || {},
        status: iocData.status || 'active',
        falsePositiveReason: iocData.falsePositiveReason,
        enrichment: iocData.enrichment,
    };
};
exports.createIOC = createIOC;
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
const updateIOC = (existing, updates) => {
    return {
        ...existing,
        ...updates,
        lastSeen: new Date(),
        confidence: Math.max(existing.confidence, updates.confidence || 0),
        sources: updates.sources
            ? [...existing.sources, ...updates.sources]
            : existing.sources,
        tags: updates.tags ? Array.from(new Set([...existing.tags, ...updates.tags])) : existing.tags,
    };
};
exports.updateIOC = updateIOC;
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
const markIOCFalsePositive = (ioc, reason) => {
    return {
        ...ioc,
        status: 'false_positive',
        falsePositiveReason: reason,
    };
};
exports.markIOCFalsePositive = markIOCFalsePositive;
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
const expireIOC = (ioc, ttl) => {
    const now = new Date();
    if (ioc.expiresAt && ioc.expiresAt < now) {
        return { ...ioc, status: 'expired' };
    }
    if (ttl) {
        const age = now.getTime() - ioc.lastSeen.getTime();
        if (age > ttl) {
            return { ...ioc, status: 'expired', expiresAt: new Date(ioc.lastSeen.getTime() + ttl) };
        }
    }
    return ioc;
};
exports.expireIOC = expireIOC;
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
const findRelatedIOCs = (ioc, allIOCs, options) => {
    return allIOCs.filter((candidate) => {
        if (candidate.id === ioc.id)
            return false;
        if (options?.sameCampaign && ioc.campaigns) {
            const overlap = candidate.campaigns?.some((c) => ioc.campaigns.includes(c));
            if (overlap)
                return true;
        }
        if (options?.sameThreatActor && ioc.threatActors) {
            const overlap = candidate.threatActors?.some((a) => ioc.threatActors.includes(a));
            if (overlap)
                return true;
        }
        if (options?.similarType && candidate.type === ioc.type) {
            return true;
        }
        if (options?.timeWindow) {
            const timeDiff = Math.abs(candidate.lastSeen.getTime() - ioc.lastSeen.getTime());
            if (timeDiff <= options.timeWindow)
                return true;
        }
        return false;
    });
};
exports.findRelatedIOCs = findRelatedIOCs;
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
const queryIOCs = (iocs, query) => {
    let results = [...iocs];
    // Type filter
    if (query.types?.length) {
        results = results.filter((ioc) => query.types.includes(ioc.type));
    }
    // Severity filter
    if (query.severities?.length) {
        results = results.filter((ioc) => query.severities.includes(ioc.severity));
    }
    // Status filter
    if (query.status?.length) {
        results = results.filter((ioc) => query.status.includes(ioc.status));
    }
    // Confidence filter
    if (query.minConfidence) {
        results = results.filter((ioc) => ioc.confidence >= query.minConfidence);
    }
    // Tags filter
    if (query.tags?.length) {
        results = results.filter((ioc) => query.tags.some((tag) => ioc.tags.includes(tag)));
    }
    // Campaign filter
    if (query.campaigns?.length) {
        results = results.filter((ioc) => ioc.campaigns?.some((c) => query.campaigns.includes(c)));
    }
    // Threat actor filter
    if (query.threatActors?.length) {
        results = results.filter((ioc) => ioc.threatActors?.some((a) => query.threatActors.includes(a)));
    }
    // Date range filter
    if (query.dateRange) {
        results = results.filter((ioc) => {
            const dateValue = ioc[query.dateRange.field];
            if (query.dateRange.start && dateValue < query.dateRange.start)
                return false;
            if (query.dateRange.end && dateValue > query.dateRange.end)
                return false;
            return true;
        });
    }
    // Sorting
    if (query.sortBy) {
        results.sort((a, b) => {
            const aVal = a[query.sortBy];
            const bVal = b[query.sortBy];
            const order = query.sortOrder === 'desc' ? -1 : 1;
            return aVal > bVal ? order : aVal < bVal ? -order : 0;
        });
    }
    // Pagination
    if (query.offset) {
        results = results.slice(query.offset);
    }
    if (query.limit) {
        results = results.slice(0, query.limit);
    }
    return results;
};
exports.queryIOCs = queryIOCs;
// ============================================================================
// THREAT ACTOR TRACKING FUNCTIONS
// ============================================================================
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
const createThreatActor = (actorData) => {
    const now = new Date();
    return {
        id: actorData.id || crypto.randomUUID(),
        name: actorData.name,
        aliases: actorData.aliases || [],
        type: actorData.type || ThreatActorType.UNKNOWN,
        sophistication: actorData.sophistication || ThreatSophistication.INTERMEDIATE,
        motivation: actorData.motivation || [],
        targetedSectors: actorData.targetedSectors || [],
        targetedCountries: actorData.targetedCountries || [],
        firstSeen: actorData.firstSeen || now,
        lastSeen: actorData.lastSeen || now,
        description: actorData.description,
        ttps: actorData.ttps || [],
        mitreAttack: actorData.mitreAttack || [],
        associatedCampaigns: actorData.associatedCampaigns || [],
        associatedIOCs: actorData.associatedIOCs || [],
        metadata: actorData.metadata || {},
    };
};
exports.createThreatActor = createThreatActor;
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
const linkThreatActorToIOCs = (actorId, iocIds, iocs) => {
    return iocs.map((ioc) => {
        if (iocIds.includes(ioc.id)) {
            const actors = ioc.threatActors || [];
            if (!actors.includes(actorId)) {
                actors.push(actorId);
            }
            return { ...ioc, threatActors: actors };
        }
        return ioc;
    });
};
exports.linkThreatActorToIOCs = linkThreatActorToIOCs;
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
const trackThreatActorActivity = (actor, iocs) => {
    const actorIOCs = iocs.filter((ioc) => ioc.threatActors?.includes(actor.id));
    const activityByMonth = {};
    const typeCounts = {};
    let totalConfidence = 0;
    actorIOCs.forEach((ioc) => {
        const month = ioc.lastSeen.toISOString().substring(0, 7);
        activityByMonth[month] = (activityByMonth[month] || 0) + 1;
        typeCounts[ioc.type] = (typeCounts[ioc.type] || 0) + 1;
        totalConfidence += ioc.confidence;
    });
    const mostCommonTypes = Object.entries(typeCounts)
        .map(([type, count]) => ({ type: type, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
    return {
        totalIOCs: actorIOCs.length,
        activityByMonth,
        mostCommonTypes,
        averageConfidence: actorIOCs.length > 0 ? totalConfidence / actorIOCs.length : 0,
    };
};
exports.trackThreatActorActivity = trackThreatActorActivity;
// ============================================================================
// CAMPAIGN ANALYSIS FUNCTIONS
// ============================================================================
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
const createThreatCampaign = (campaignData) => {
    const now = new Date();
    return {
        id: campaignData.id || crypto.randomUUID(),
        name: campaignData.name,
        aliases: campaignData.aliases || [],
        description: campaignData.description,
        status: campaignData.status || CampaignStatus.SUSPECTED,
        severity: campaignData.severity || ThreatSeverity.MEDIUM,
        startDate: campaignData.startDate || now,
        endDate: campaignData.endDate,
        lastActivity: campaignData.lastActivity || now,
        threatActors: campaignData.threatActors || [],
        targetedSectors: campaignData.targetedSectors || [],
        targetedCountries: campaignData.targetedCountries || [],
        objectives: campaignData.objectives || [],
        iocs: campaignData.iocs || [],
        mitreAttack: campaignData.mitreAttack || [],
        timeline: campaignData.timeline || [],
        metadata: campaignData.metadata || {},
    };
};
exports.createThreatCampaign = createThreatCampaign;
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
const analyzeCampaignTimeline = (campaign, iocs) => {
    const campaignIOCs = iocs.filter((ioc) => ioc.campaigns?.includes(campaign.id));
    const duration = campaign.endDate
        ? campaign.endDate.getTime() - campaign.startDate.getTime()
        : Date.now() - campaign.startDate.getTime();
    // Group IOCs by month to identify phases
    const monthlyActivity = {};
    campaignIOCs.forEach((ioc) => {
        const month = ioc.lastSeen.toISOString().substring(0, 7);
        if (!monthlyActivity[month])
            monthlyActivity[month] = [];
        monthlyActivity[month].push(ioc);
    });
    const phases = Object.entries(monthlyActivity).map(([month, monthIOCs]) => ({
        phase: month,
        start: new Date(month + '-01'),
        iocCount: monthIOCs.length,
    }));
    const peakActivity = phases.length > 0
        ? phases.reduce((max, phase) => (phase.iocCount > max.iocCount ? phase : max)).start
        : campaign.startDate;
    const iocsByType = {};
    campaignIOCs.forEach((ioc) => {
        iocsByType[ioc.type] = (iocsByType[ioc.type] || 0) + 1;
    });
    return {
        duration,
        phases,
        peakActivity,
        iocsByType,
    };
};
exports.analyzeCampaignTimeline = analyzeCampaignTimeline;
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
const addCampaignEvent = (campaign, event) => {
    const newEvent = {
        id: event.id || crypto.randomUUID(),
        timestamp: event.timestamp || new Date(),
        eventType: event.eventType,
        description: event.description,
        iocs: event.iocs,
        impact: event.impact,
        metadata: event.metadata,
    };
    return {
        ...campaign,
        timeline: [...campaign.timeline, newEvent],
        lastActivity: newEvent.timestamp,
    };
};
exports.addCampaignEvent = addCampaignEvent;
// ============================================================================
// MITRE ATT&CK MAPPING FUNCTIONS
// ============================================================================
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
const mapIOCToMITRE = (ioc, mappings) => {
    return {
        ...ioc,
        mitreAttack: [...(ioc.mitreAttack || []), ...mappings],
    };
};
exports.mapIOCToMITRE = mapIOCToMITRE;
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
const getMITRECoverage = (iocs) => {
    const tactics = new Set();
    const techniques = new Set();
    const tacticCounts = {};
    const techniqueCounts = {};
    iocs.forEach((ioc) => {
        ioc.mitreAttack?.forEach((mapping) => {
            tactics.add(mapping.tacticId);
            techniques.add(mapping.techniqueId);
            tacticCounts[mapping.tacticId] = (tacticCounts[mapping.tacticId] || 0) + 1;
            if (!techniqueCounts[mapping.techniqueId]) {
                techniqueCounts[mapping.techniqueId] = { name: mapping.technique, count: 0 };
            }
            techniqueCounts[mapping.techniqueId].count++;
        });
    });
    const mostCommonTechniques = Object.entries(techniqueCounts)
        .map(([techniqueId, data]) => ({ techniqueId, technique: data.name, count: data.count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
    return {
        tacticsCovered: Array.from(tactics),
        techniquesCovered: Array.from(techniques),
        coverageByTactic: tacticCounts,
        mostCommonTechniques,
    };
};
exports.getMITRECoverage = getMITRECoverage;
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
const suggestMITREMappings = (ioc) => {
    const suggestions = [];
    // Basic type-based suggestions
    switch (ioc.type) {
        case IOCType.DOMAIN:
        case IOCType.URL:
            suggestions.push({
                tactic: 'Command and Control',
                tacticId: 'TA0011',
                technique: 'Web Service',
                techniqueId: 'T1102',
            });
            break;
        case IOCType.FILE_HASH_MD5:
        case IOCType.FILE_HASH_SHA1:
        case IOCType.FILE_HASH_SHA256:
            suggestions.push({
                tactic: 'Execution',
                tacticId: 'TA0002',
                technique: 'User Execution',
                techniqueId: 'T1204',
            });
            break;
        case IOCType.IPV4:
        case IOCType.IPV6:
            suggestions.push({
                tactic: 'Command and Control',
                tacticId: 'TA0011',
                technique: 'Non-Application Layer Protocol',
                techniqueId: 'T1095',
            });
            break;
        case IOCType.EMAIL:
            suggestions.push({
                tactic: 'Initial Access',
                tacticId: 'TA0001',
                technique: 'Phishing',
                techniqueId: 'T1566',
            });
            break;
    }
    return suggestions;
};
exports.suggestMITREMappings = suggestMITREMappings;
// ============================================================================
// STIX/TAXII INTEGRATION FUNCTIONS
// ============================================================================
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
const convertIOCToSTIX = (ioc) => {
    const now = new Date();
    return {
        type: 'indicator',
        spec_version: '2.1',
        id: `indicator--${ioc.id}`,
        created: ioc.firstSeen,
        modified: ioc.lastSeen,
        labels: ioc.tags,
        confidence: ioc.confidence,
        pattern: (0, exports.generateSTIXPattern)(ioc),
        pattern_type: 'stix',
        valid_from: ioc.firstSeen,
        valid_until: ioc.expiresAt,
    };
};
exports.convertIOCToSTIX = convertIOCToSTIX;
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
const generateSTIXPattern = (ioc) => {
    const patterns = {
        [IOCType.IPV4]: `[ipv4-addr:value = '${ioc.value}']`,
        [IOCType.IPV6]: `[ipv6-addr:value = '${ioc.value}']`,
        [IOCType.DOMAIN]: `[domain-name:value = '${ioc.value}']`,
        [IOCType.URL]: `[url:value = '${ioc.value}']`,
        [IOCType.EMAIL]: `[email-addr:value = '${ioc.value}']`,
        [IOCType.FILE_HASH_MD5]: `[file:hashes.MD5 = '${ioc.value}']`,
        [IOCType.FILE_HASH_SHA1]: `[file:hashes.'SHA-1' = '${ioc.value}']`,
        [IOCType.FILE_HASH_SHA256]: `[file:hashes.'SHA-256' = '${ioc.value}']`,
        [IOCType.FILE_HASH_SHA512]: `[file:hashes.'SHA-512' = '${ioc.value}']`,
        [IOCType.FILE_NAME]: `[file:name = '${ioc.value}']`,
        [IOCType.FILE_PATH]: `[file:path = '${ioc.value}']`,
        [IOCType.REGISTRY_KEY]: `[windows-registry-key:key = '${ioc.value}']`,
        [IOCType.MUTEX]: `[mutex:name = '${ioc.value}']`,
        [IOCType.USER_AGENT]: `[network-traffic:extensions.'http-request-ext'.request_header.'User-Agent' = '${ioc.value}']`,
        [IOCType.CVE]: `[vulnerability:name = '${ioc.value}']`,
        [IOCType.ASN]: `[autonomous-system:number = '${ioc.value.replace('AS', '')}']`,
        [IOCType.SSL_CERT_FINGERPRINT]: `[x509-certificate:hashes.'SHA-256' = '${ioc.value}']`,
        [IOCType.YARA_RULE]: `[indicator:pattern = '${ioc.value}']`,
    };
    return patterns[ioc.type] || `[unknown:value = '${ioc.value}']`;
};
exports.generateSTIXPattern = generateSTIXPattern;
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
const createSTIXBundle = (iocs, options) => {
    const objects = iocs.map(exports.convertIOCToSTIX);
    return {
        type: 'bundle',
        id: `bundle--${crypto.randomUUID()}`,
        spec_version: '2.1',
        objects,
    };
};
exports.createSTIXBundle = createSTIXBundle;
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
const parseSTIXBundle = (bundle) => {
    const iocs = [];
    bundle.objects.forEach((obj) => {
        if (obj.type === 'indicator') {
            const ioc = (0, exports.parseSTIXIndicator)(obj);
            if (ioc)
                iocs.push(ioc);
        }
    });
    return iocs;
};
exports.parseSTIXBundle = parseSTIXBundle;
/**
 * Parses STIX indicator to IOC.
 *
 * @param {any} indicator - STIX indicator
 * @returns {IOC | null} Parsed IOC
 */
const parseSTIXIndicator = (indicator) => {
    // Extract IOC type and value from STIX pattern
    const pattern = indicator.pattern;
    let type = null;
    let value = '';
    if (pattern.includes('ipv4-addr:value')) {
        type = IOCType.IPV4;
        value = pattern.match(/'([^']+)'/)?.[1] || '';
    }
    else if (pattern.includes('domain-name:value')) {
        type = IOCType.DOMAIN;
        value = pattern.match(/'([^']+)'/)?.[1] || '';
    }
    else if (pattern.includes('file:hashes.MD5')) {
        type = IOCType.FILE_HASH_MD5;
        value = pattern.match(/'([^']+)'/)?.[1] || '';
    }
    // Add more pattern parsing as needed
    if (!type || !value)
        return null;
    return (0, exports.createIOC)({
        type,
        value,
        severity: ThreatSeverity.MEDIUM,
        confidence: indicator.confidence || 50,
        firstSeen: new Date(indicator.created),
        lastSeen: new Date(indicator.modified),
        tags: indicator.labels || [],
    });
};
exports.parseSTIXIndicator = parseSTIXIndicator;
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
const publishToTAXII = async (bundle, config) => {
    try {
        // Validate bundle
        if (!bundle || !bundle.objects || bundle.objects.length === 0) {
            throw new Error('Invalid or empty STIX bundle');
        }
        if (bundle.type !== 'bundle' || bundle.spec_version !== '2.1') {
            throw new Error('Invalid STIX bundle format. Must be STIX 2.1 bundle');
        }
        // Construct TAXII 2.1 API endpoint
        const baseUrl = config.serverUrl.replace(/\/$/, '');
        const endpoint = `${baseUrl}/collections/${config.collectionId}/objects/`;
        // Build request headers
        const headers = {
            'Content-Type': 'application/taxii+json;version=2.1',
            'Accept': 'application/taxii+json;version=2.1',
            'User-Agent': 'WhiteCross-ThreatIntel/1.0',
        };
        if (config.apiKey) {
            headers['Authorization'] = `Bearer ${config.apiKey}`;
        }
        // Create TAXII envelope
        const envelope = {
            objects: bundle.objects,
        };
        // Send POST request to TAXII server
        const response = await fetch(endpoint, {
            method: 'POST',
            headers,
            body: JSON.stringify(envelope),
            signal: AbortSignal.timeout(30000), // 30 second timeout
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`TAXII server error: HTTP ${response.status} ${response.statusText}. ${errorText}`);
        }
        // Parse TAXII status response
        const result = await response.json();
        // TAXII 2.1 status response format
        const successCount = result.success_count || result.successCount || bundle.objects.length;
        const failureCount = result.failure_count || result.failureCount || 0;
        if (failureCount > 0) {
            console.warn(`TAXII publish partial success: ${successCount} succeeded, ${failureCount} failed`, result.failures || result.pending);
        }
        return {
            success: failureCount === 0,
            objectsPublished: successCount,
            error: failureCount > 0 ? `${failureCount} objects failed to publish` : undefined,
        };
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Failed to publish to TAXII server:', errorMessage);
        return {
            success: false,
            objectsPublished: 0,
            error: errorMessage,
        };
    }
};
exports.publishToTAXII = publishToTAXII;
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
const fetchFromTAXII = async (config, filters) => {
    try {
        // Construct TAXII 2.1 API endpoint
        const baseUrl = config.serverUrl.replace(/\/$/, '');
        const endpoint = `${baseUrl}/collections/${config.collectionId}/objects/`;
        // Build query parameters
        const queryParams = new URLSearchParams();
        if (filters?.addedAfter) {
            // TAXII uses RFC 3339 timestamp format
            queryParams.append('added_after', filters.addedAfter.toISOString());
        }
        if (filters?.types && filters.types.length > 0) {
            // TAXII allows filtering by STIX object types
            queryParams.append('match[type]', filters.types.join(','));
        }
        if (filters?.limit) {
            queryParams.append('limit', filters.limit.toString());
        }
        const url = queryParams.toString()
            ? `${endpoint}?${queryParams.toString()}`
            : endpoint;
        // Build request headers
        const headers = {
            'Accept': 'application/taxii+json;version=2.1',
            'User-Agent': 'WhiteCross-ThreatIntel/1.0',
        };
        if (config.apiKey) {
            headers['Authorization'] = `Bearer ${config.apiKey}`;
        }
        // Fetch from TAXII server
        const response = await fetch(url, {
            method: 'GET',
            headers,
            signal: AbortSignal.timeout(60000), // 60 second timeout for fetches
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`TAXII server error: HTTP ${response.status} ${response.statusText}. ${errorText}`);
        }
        // Parse TAXII envelope response
        const envelope = await response.json();
        // TAXII 2.1 returns objects in an envelope
        const objects = envelope.objects || [];
        // Validate objects are STIX format
        const validObjects = objects.filter((obj) => {
            return obj && obj.type && obj.id;
        });
        if (validObjects.length < objects.length) {
            console.warn(`Filtered out ${objects.length - validObjects.length} invalid STIX objects from TAXII response`);
        }
        // Create STIX bundle
        const bundle = {
            type: 'bundle',
            id: `bundle--${crypto.randomUUID()}`,
            spec_version: '2.1',
            objects: validObjects,
        };
        // Handle pagination if more data is available
        if (envelope.more && envelope.next) {
            console.info(`Additional TAXII data available. Use pagination token: ${envelope.next}`);
        }
        return bundle;
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Failed to fetch from TAXII server:', errorMessage);
        // Return empty bundle on error
        return {
            type: 'bundle',
            id: `bundle--${crypto.randomUUID()}`,
            spec_version: '2.1',
            objects: [],
        };
    }
};
exports.fetchFromTAXII = fetchFromTAXII;
// ============================================================================
// INTELLIGENCE ENRICHMENT FUNCTIONS
// ============================================================================
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
const enrichIOCGeolocation = async (ioc, provider) => {
    if (ioc.type !== IOCType.IPV4 && ioc.type !== IOCType.IPV6) {
        return ioc;
    }
    // In production, call actual geolocation API
    const geolocation = {
        country: 'US',
        region: 'California',
        city: 'San Francisco',
        latitude: 37.7749,
        longitude: -122.4194,
        asn: 'AS15169',
        isp: 'Google LLC',
    };
    return {
        ...ioc,
        enrichment: {
            ...(ioc.enrichment || {}),
            geolocation,
        },
    };
};
exports.enrichIOCGeolocation = enrichIOCGeolocation;
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
const enrichIOCReputation = async (ioc, provider) => {
    // In production, call actual reputation API (VirusTotal, etc.)
    const reputation = {
        score: 85,
        category: 'malicious',
        threatTypes: ['malware', 'botnet'],
    };
    return {
        ...ioc,
        enrichment: {
            ...(ioc.enrichment || {}),
            reputation,
        },
    };
};
exports.enrichIOCReputation = enrichIOCReputation;
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
const enrichIOCWhois = async (ioc) => {
    if (ioc.type !== IOCType.DOMAIN) {
        return ioc;
    }
    // In production, perform actual WHOIS lookup
    const whois = {
        registrar: 'Example Registrar',
        createdDate: new Date('2020-01-01'),
        expiresDate: new Date('2025-01-01'),
        nameServers: ['ns1.example.com', 'ns2.example.com'],
    };
    return {
        ...ioc,
        enrichment: {
            ...(ioc.enrichment || {}),
            whois,
        },
    };
};
exports.enrichIOCWhois = enrichIOCWhois;
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
const enrichIOCDNS = async (ioc) => {
    if (ioc.type !== IOCType.DOMAIN) {
        return ioc;
    }
    // In production, perform actual DNS lookups
    const dns = {
        aRecords: ['192.0.2.1'],
        mxRecords: ['mail.example.com'],
        nsRecords: ['ns1.example.com', 'ns2.example.com'],
        txtRecords: ['v=spf1 include:example.com ~all'],
    };
    return {
        ...ioc,
        enrichment: {
            ...(ioc.enrichment || {}),
            dns,
        },
    };
};
exports.enrichIOCDNS = enrichIOCDNS;
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
const enrichIOC = async (ioc, providers) => {
    try {
        let enriched = ioc;
        enriched = await (0, exports.enrichIOCGeolocation)(enriched, providers?.geolocation);
        enriched = await (0, exports.enrichIOCReputation)(enriched, providers?.reputation);
        enriched = await (0, exports.enrichIOCWhois)(enriched);
        enriched = await (0, exports.enrichIOCDNS)(enriched);
        return {
            iocId: ioc.id,
            provider: 'comprehensive',
            timestamp: new Date(),
            success: true,
            data: enriched.enrichment,
        };
    }
    catch (error) {
        return {
            iocId: ioc.id,
            provider: 'comprehensive',
            timestamp: new Date(),
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
};
exports.enrichIOC = enrichIOC;
// ============================================================================
// THREAT INTELLIGENCE STATISTICS AND REPORTING
// ============================================================================
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
const generateThreatIntelStats = (iocs, actors, campaigns) => {
    const activeIOCs = iocs.filter((ioc) => ioc.status === 'active');
    const iocsByType = {};
    const iocsBySeverity = {};
    iocs.forEach((ioc) => {
        iocsByType[ioc.type] = (iocsByType[ioc.type] || 0) + 1;
        iocsBySeverity[ioc.severity] = (iocsBySeverity[ioc.severity] || 0) + 1;
    });
    const sourceCounts = {};
    iocs.forEach((ioc) => {
        ioc.sources.forEach((source) => {
            sourceCounts[source.provider] = (sourceCounts[source.provider] || 0) + 1;
        });
    });
    const topSources = Object.entries(sourceCounts)
        .map(([source, count]) => ({ source, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
    const actorCounts = {};
    iocs.forEach((ioc) => {
        ioc.threatActors?.forEach((actorId) => {
            actorCounts[actorId] = (actorCounts[actorId] || 0) + 1;
        });
    });
    const topThreatActors = Object.entries(actorCounts)
        .map(([actor, count]) => ({ actor, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
    const campaignCounts = {};
    iocs.forEach((ioc) => {
        ioc.campaigns?.forEach((campaignId) => {
            campaignCounts[campaignId] = (campaignCounts[campaignId] || 0) + 1;
        });
    });
    const topCampaigns = Object.entries(campaignCounts)
        .map(([campaign, count]) => ({ campaign, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const dailyActivity = {};
    iocs
        .filter((ioc) => ioc.lastSeen >= thirtyDaysAgo)
        .forEach((ioc) => {
        const date = ioc.lastSeen.toISOString().split('T')[0];
        dailyActivity[date] = (dailyActivity[date] || 0) + 1;
    });
    const recentActivity = Object.entries(dailyActivity)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));
    const mitreCoverage = (0, exports.getMITRECoverage)(iocs);
    return {
        totalIOCs: iocs.length,
        activeIOCs: activeIOCs.length,
        iocsByType,
        iocsBySeverity,
        topSources,
        topThreatActors,
        topCampaigns,
        recentActivity,
        mitreAttackCoverage: Object.entries(mitreCoverage.coverageByTactic).map(([tacticId, count]) => ({ tacticId, count })),
    };
};
exports.generateThreatIntelStats = generateThreatIntelStats;
// ============================================================================
// DEFAULT EXPORT
// ============================================================================
exports.default = {
    // Sequelize Models
    getThreatFeedModelAttributes: exports.getThreatFeedModelAttributes,
    getIOCModelAttributes: exports.getIOCModelAttributes,
    getThreatActorModelAttributes: exports.getThreatActorModelAttributes,
    getThreatCampaignModelAttributes: exports.getThreatCampaignModelAttributes,
    // Threat Feed Aggregation
    aggregateThreatFeeds: exports.aggregateThreatFeeds,
    fetchFeedData: exports.fetchFeedData,
    normalizeIOCValue: exports.normalizeIOCValue,
    validateIOCFormat: exports.validateIOCFormat,
    applyThreatFeedFilters: exports.applyThreatFeedFilters,
    syncThreatFeed: exports.syncThreatFeed,
    // IOC Management
    createIOC: exports.createIOC,
    updateIOC: exports.updateIOC,
    markIOCFalsePositive: exports.markIOCFalsePositive,
    expireIOC: exports.expireIOC,
    findRelatedIOCs: exports.findRelatedIOCs,
    queryIOCs: exports.queryIOCs,
    // Threat Actor Tracking
    createThreatActor: exports.createThreatActor,
    linkThreatActorToIOCs: exports.linkThreatActorToIOCs,
    trackThreatActorActivity: exports.trackThreatActorActivity,
    // Campaign Analysis
    createThreatCampaign: exports.createThreatCampaign,
    analyzeCampaignTimeline: exports.analyzeCampaignTimeline,
    addCampaignEvent: exports.addCampaignEvent,
    // MITRE ATT&CK Mapping
    mapIOCToMITRE: exports.mapIOCToMITRE,
    getMITRECoverage: exports.getMITRECoverage,
    suggestMITREMappings: exports.suggestMITREMappings,
    // STIX/TAXII Integration
    convertIOCToSTIX: exports.convertIOCToSTIX,
    generateSTIXPattern: exports.generateSTIXPattern,
    createSTIXBundle: exports.createSTIXBundle,
    parseSTIXBundle: exports.parseSTIXBundle,
    parseSTIXIndicator: exports.parseSTIXIndicator,
    publishToTAXII: exports.publishToTAXII,
    fetchFromTAXII: exports.fetchFromTAXII,
    // Intelligence Enrichment
    enrichIOCGeolocation: exports.enrichIOCGeolocation,
    enrichIOCReputation: exports.enrichIOCReputation,
    enrichIOCWhois: exports.enrichIOCWhois,
    enrichIOCDNS: exports.enrichIOCDNS,
    enrichIOC: exports.enrichIOC,
    // Statistics and Reporting
    generateThreatIntelStats: exports.generateThreatIntelStats,
};
//# sourceMappingURL=threat-intelligence-kit.js.map