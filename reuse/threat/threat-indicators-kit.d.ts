/**
 * LOC: THRI1234567
 * File: /reuse/threat/threat-indicators-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Threat intelligence services
 *   - IOC detection modules
 *   - Security monitoring systems
 */
/**
 * File: /reuse/threat/threat-indicators-kit.ts
 * Locator: WC-UTL-THRI-001
 * Purpose: Comprehensive Threat Indicator Utilities - IOC validation, enrichment, correlation, STIX conversion
 *
 * Upstream: Independent utility module for threat intelligence indicators
 * Downstream: ../backend/*, threat services, security controllers, IOC detection
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Swagger/OpenAPI, Sequelize
 * Exports: 45 utility functions for IOC management, validation, enrichment, STIX conversion
 *
 * LLM Context: Comprehensive threat indicator utilities for managing Indicators of Compromise (IOCs) in White Cross system.
 * Provides IOC validation, normalization, enrichment, correlation, confidence scoring, lifecycle management, deduplication,
 * pattern matching, and STIX indicator conversion. Essential for building robust threat intelligence and security monitoring
 * capabilities with HIPAA compliance for healthcare threat detection.
 */
/**
 * IOC type enumeration - all supported indicator types
 */
type IocType = 'ip' | 'domain' | 'hash' | 'url' | 'email' | 'file' | 'registry' | 'mutex' | 'user-agent' | 'certificate';
/**
 * Hash algorithm types supported for file/data integrity
 */
type HashType = 'md5' | 'sha1' | 'sha256' | 'sha512' | 'ssdeep';
/**
 * IOC confidence level based on source reliability and context
 */
type ConfidenceLevel = 'low' | 'medium' | 'high' | 'critical';
/**
 * IOC lifecycle states for temporal management
 */
type IocStatus = 'active' | 'inactive' | 'expired' | 'pending' | 'false-positive';
/**
 * Threat severity classification
 */
type ThreatSeverity = 'informational' | 'low' | 'medium' | 'high' | 'critical';
/**
 * Core IOC indicator structure
 */
interface IocIndicator {
    id?: string;
    type: IocType;
    value: string;
    confidence: ConfidenceLevel;
    severity: ThreatSeverity;
    status: IocStatus;
    firstSeen?: Date;
    lastSeen?: Date;
    expiresAt?: Date;
    source?: string;
    tags?: string[];
    metadata?: Record<string, unknown>;
}
/**
 * IP address specific IOC with geolocation
 */
interface IpIoc extends IocIndicator {
    type: 'ip';
    version?: 'ipv4' | 'ipv6';
    asn?: string;
    country?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
}
/**
 * Domain specific IOC with DNS metadata
 */
interface DomainIoc extends IocIndicator {
    type: 'domain';
    tld?: string;
    registrar?: string;
    registeredDate?: Date;
    nameservers?: string[];
    isDga?: boolean;
}
/**
 * URL specific IOC with parsed components
 */
interface UrlIoc extends IocIndicator {
    type: 'url';
    protocol?: string;
    domain?: string;
    path?: string;
    queryParams?: Record<string, string>;
    isPhishing?: boolean;
}
/**
 * Email specific IOC for phishing detection
 */
interface EmailIoc extends IocIndicator {
    type: 'email';
    emailDomain?: string;
    displayName?: string;
    isSpoof?: boolean;
    isMalicious?: boolean;
}
/**
 * IOC validation result with detailed feedback
 */
interface IocValidationResult {
    isValid: boolean;
    normalized?: string;
    errors?: string[];
    warnings?: string[];
    suggestions?: string[];
}
/**
 * IOC enrichment data from external sources
 */
interface IocEnrichment {
    iocValue: string;
    iocType: IocType;
    reputation?: number;
    threatCategories?: string[];
    malwareFamilies?: string[];
    campaigns?: string[];
    actors?: string[];
    geolocation?: {
        country?: string;
        city?: string;
        latitude?: number;
        longitude?: number;
    };
    whoisData?: Record<string, unknown>;
    dnsRecords?: Record<string, string[]>;
    lastAnalyzed?: Date;
    sources?: string[];
}
/**
 * IOC pattern matching configuration
 */
interface PatternMatchConfig {
    type: IocType;
    pattern: string | RegExp;
    caseSensitive?: boolean;
    extractMetadata?: boolean;
    validationRules?: Array<(value: string) => boolean>;
}
/**
 * STIX 2.1 Indicator object for standardized threat intelligence sharing
 */
interface StixIndicator {
    type: 'indicator';
    spec_version: '2.1';
    id: string;
    created: string;
    modified: string;
    name?: string;
    description?: string;
    indicator_types?: string[];
    pattern: string;
    pattern_type: 'stix' | 'pcre' | 'sigma' | 'snort' | 'yara';
    pattern_version?: string;
    valid_from: string;
    valid_until?: string;
    kill_chain_phases?: Array<{
        kill_chain_name: string;
        phase_name: string;
    }>;
    labels?: string[];
    confidence?: number;
    lang?: string;
    external_references?: Array<{
        source_name: string;
        description?: string;
        url?: string;
        external_id?: string;
    }>;
    object_marking_refs?: string[];
    granular_markings?: unknown[];
}
/**
 * Swagger API definition for IOC endpoints
 */
interface SwaggerIocApiDefinition {
    '/api/v1/iocs': {
        get: {
            summary: 'List IOC indicators';
            parameters: Array<{
                name: string;
                in: 'query' | 'path' | 'header';
                schema: {
                    type: string;
                };
                required?: boolean;
            }>;
            responses: Record<number, {
                description: string;
                content?: unknown;
            }>;
        };
        post: {
            summary: 'Create IOC indicator';
            requestBody: {
                content: {
                    'application/json': {
                        schema: unknown;
                    };
                };
            };
            responses: Record<number, {
                description: string;
            }>;
        };
    };
}
/**
 * Sequelize model attributes for IOC storage
 */
interface IocModelAttributes {
    id: {
        type: 'UUID';
        defaultValue: 'UUIDV4';
        primaryKey: true;
    };
    type: {
        type: 'ENUM';
        values: IocType[];
        allowNull: false;
    };
    value: {
        type: 'STRING';
        allowNull: false;
        validate: {
            notEmpty: true;
        };
    };
    confidence: {
        type: 'ENUM';
        values: ConfidenceLevel[];
        defaultValue: 'medium';
    };
    severity: {
        type: 'ENUM';
        values: ThreatSeverity[];
        defaultValue: 'medium';
    };
    status: {
        type: 'ENUM';
        values: IocStatus[];
        defaultValue: 'active';
    };
    firstSeen: {
        type: 'DATE';
        allowNull: true;
    };
    lastSeen: {
        type: 'DATE';
        allowNull: true;
    };
    expiresAt: {
        type: 'DATE';
        allowNull: true;
    };
    source: {
        type: 'STRING';
        allowNull: true;
    };
    tags: {
        type: 'JSON';
        defaultValue: [];
    };
    metadata: {
        type: 'JSONB';
        defaultValue: {};
    };
    createdAt: {
        type: 'DATE';
        allowNull: false;
    };
    updatedAt: {
        type: 'DATE';
        allowNull: false;
    };
}
/**
 * Validates an IPv4 address format.
 *
 * @param {string} ip - IP address to validate
 * @returns {boolean} True if valid IPv4 address
 *
 * @example
 * ```typescript
 * isValidIpv4('192.168.1.1'); // true
 * isValidIpv4('256.1.1.1'); // false
 * isValidIpv4('192.168.1'); // false
 * ```
 */
export declare const isValidIpv4: (ip: string) => boolean;
/**
 * Validates an IPv6 address format.
 *
 * @param {string} ip - IP address to validate
 * @returns {boolean} True if valid IPv6 address
 *
 * @example
 * ```typescript
 * isValidIpv6('2001:0db8:85a3:0000:0000:8a2e:0370:7334'); // true
 * isValidIpv6('2001:db8::1'); // true
 * isValidIpv6('192.168.1.1'); // false
 * ```
 */
export declare const isValidIpv6: (ip: string) => boolean;
/**
 * Validates a domain name format (RFC 1035).
 *
 * @param {string} domain - Domain name to validate
 * @returns {boolean} True if valid domain name
 * @throws {Error} If domain is not a string
 *
 * @example
 * ```typescript
 * isValidDomain('example.com'); // true
 * isValidDomain('sub.example.co.uk'); // true
 * isValidDomain('invalid_domain'); // false
 * isValidDomain('-invalid.com'); // false
 * ```
 */
export declare const isValidDomain: (domain: string) => boolean;
/**
 * Validates a URL format with protocol validation.
 *
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid URL
 *
 * @example
 * ```typescript
 * isValidUrl('https://example.com/path'); // true
 * isValidUrl('http://192.168.1.1:8080'); // true
 * isValidUrl('ftp://files.example.com'); // true
 * isValidUrl('not a url'); // false
 * ```
 */
export declare const isValidUrl: (url: string) => boolean;
/**
 * Validates an email address format (RFC 5322 simplified).
 *
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid email address
 *
 * @example
 * ```typescript
 * isValidEmail('user@example.com'); // true
 * isValidEmail('user.name+tag@example.co.uk'); // true
 * isValidEmail('invalid@'); // false
 * isValidEmail('@example.com'); // false
 * ```
 */
export declare const isValidEmail: (email: string) => boolean;
/**
 * Validates a hash value format based on hash type.
 *
 * @param {string} hash - Hash value to validate
 * @param {HashType} type - Hash algorithm type
 * @returns {boolean} True if hash matches expected format for type
 *
 * @example
 * ```typescript
 * isValidHash('d41d8cd98f00b204e9800998ecf8427e', 'md5'); // true
 * isValidHash('da39a3ee5e6b4b0d3255bfef95601890afd80709', 'sha1'); // true
 * isValidHash('invalid', 'sha256'); // false
 * ```
 */
export declare const isValidHash: (hash: string, type: HashType) => boolean;
/**
 * Normalizes an IP address to standard format.
 *
 * @param {string} ip - IP address to normalize
 * @returns {string} Normalized IP address
 * @throws {Error} If IP address is invalid
 *
 * @example
 * ```typescript
 * normalizeIp('192.168.001.001'); // '192.168.1.1'
 * normalizeIp('2001:0db8::0001'); // '2001:db8::1'
 * ```
 */
export declare const normalizeIp: (ip: string) => string;
/**
 * Normalizes a domain name to lowercase without trailing dot.
 *
 * @param {string} domain - Domain name to normalize
 * @returns {string} Normalized domain name
 * @throws {Error} If domain is invalid
 *
 * @example
 * ```typescript
 * normalizeDomain('EXAMPLE.COM'); // 'example.com'
 * normalizeDomain('example.com.'); // 'example.com'
 * normalizeDomain('  Example.Com  '); // 'example.com'
 * ```
 */
export declare const normalizeDomain: (domain: string) => string;
/**
 * Normalizes a URL to standard format with protocol and path.
 *
 * @param {string} url - URL to normalize
 * @returns {string} Normalized URL
 * @throws {Error} If URL is invalid
 *
 * @example
 * ```typescript
 * normalizeUrl('HTTPS://EXAMPLE.COM/Path'); // 'https://example.com/Path'
 * normalizeUrl('example.com'); // 'https://example.com'
 * normalizeUrl('http://example.com:80'); // 'http://example.com'
 * ```
 */
export declare const normalizeUrl: (url: string) => string;
/**
 * Normalizes an email address to lowercase.
 *
 * @param {string} email - Email address to normalize
 * @returns {string} Normalized email address
 * @throws {Error} If email is invalid
 *
 * @example
 * ```typescript
 * normalizeEmail('User@EXAMPLE.COM'); // 'user@example.com'
 * normalizeEmail('  user@example.com  '); // 'user@example.com'
 * ```
 */
export declare const normalizeEmail: (email: string) => string;
/**
 * Normalizes a hash value to lowercase hexadecimal.
 *
 * @param {string} hash - Hash value to normalize
 * @param {HashType} type - Hash algorithm type
 * @returns {string} Normalized hash value
 * @throws {Error} If hash is invalid for the specified type
 *
 * @example
 * ```typescript
 * normalizeHash('D41D8CD98F00B204E9800998ECF8427E', 'md5');
 * // Result: 'd41d8cd98f00b204e9800998ecf8427e'
 * ```
 */
export declare const normalizeHash: (hash: string, type: HashType) => string;
/**
 * Validates and normalizes an IOC indicator based on its type.
 *
 * @param {string} value - IOC value to validate
 * @param {IocType} type - IOC type
 * @returns {IocValidationResult} Validation result with normalized value
 *
 * @example
 * ```typescript
 * validateIoc('192.168.1.1', 'ip');
 * // Result: { isValid: true, normalized: '192.168.1.1', errors: [], warnings: [] }
 *
 * validateIoc('invalid-ip', 'ip');
 * // Result: { isValid: false, errors: ['Invalid IP address: invalid-ip'], warnings: [] }
 * ```
 */
export declare const validateIoc: (value: string, type: IocType) => IocValidationResult;
/**
 * Sanitizes IOC value to prevent injection attacks and ensure safe storage.
 *
 * @param {string} value - IOC value to sanitize
 * @returns {string} Sanitized IOC value
 *
 * @example
 * ```typescript
 * sanitizeIoc('<script>alert("xss")</script>'); // 'scriptalertxssscript'
 * sanitizeIoc('example.com;DROP TABLE iocs;'); // 'example.comDROP TABLE iocs'
 * ```
 */
export declare const sanitizeIoc: (value: string) => string;
/**
 * Validates IOC indicator object for completeness and consistency.
 *
 * @param {IocIndicator} ioc - IOC indicator to validate
 * @returns {IocValidationResult} Validation result
 * @throws {Error} If ioc is null or undefined
 *
 * @example
 * ```typescript
 * const ioc: IocIndicator = {
 *   type: 'ip',
 *   value: '192.168.1.1',
 *   confidence: 'high',
 *   severity: 'medium',
 *   status: 'active'
 * };
 * validateIocIndicator(ioc); // { isValid: true, ... }
 * ```
 */
export declare const validateIocIndicator: (ioc: IocIndicator) => IocValidationResult;
/**
 * Extracts metadata from an IP IOC for enrichment.
 *
 * @param {string} ip - IP address
 * @returns {Partial<IpIoc>} IP metadata
 *
 * @example
 * ```typescript
 * const metadata = extractIpMetadata('192.168.1.1');
 * // Result: { type: 'ip', version: 'ipv4', value: '192.168.1.1' }
 * ```
 */
export declare const extractIpMetadata: (ip: string) => Partial<IpIoc>;
/**
 * Extracts metadata from a domain IOC for enrichment.
 *
 * @param {string} domain - Domain name
 * @returns {Partial<DomainIoc>} Domain metadata
 *
 * @example
 * ```typescript
 * const metadata = extractDomainMetadata('example.co.uk');
 * // Result: { type: 'domain', value: 'example.co.uk', tld: 'uk' }
 * ```
 */
export declare const extractDomainMetadata: (domain: string) => Partial<DomainIoc>;
/**
 * Extracts metadata from a URL IOC for enrichment.
 *
 * @param {string} url - URL string
 * @returns {Partial<UrlIoc>} URL metadata
 * @throws {Error} If URL is invalid
 *
 * @example
 * ```typescript
 * const metadata = extractUrlMetadata('https://example.com/path?key=value');
 * // Result: {
 * //   type: 'url',
 * //   value: 'https://example.com/path?key=value',
 * //   protocol: 'https:',
 * //   domain: 'example.com',
 * //   path: '/path',
 * //   queryParams: { key: 'value' }
 * // }
 * ```
 */
export declare const extractUrlMetadata: (url: string) => Partial<UrlIoc>;
/**
 * Extracts metadata from an email IOC for enrichment.
 *
 * @param {string} email - Email address
 * @returns {Partial<EmailIoc>} Email metadata
 *
 * @example
 * ```typescript
 * const metadata = extractEmailMetadata('user@example.com');
 * // Result: { type: 'email', value: 'user@example.com', emailDomain: 'example.com' }
 * ```
 */
export declare const extractEmailMetadata: (email: string) => Partial<EmailIoc>;
/**
 * Enriches IOC with additional context and metadata.
 *
 * @param {IocIndicator} ioc - IOC indicator to enrich
 * @returns {IocIndicator} Enriched IOC indicator
 *
 * @example
 * ```typescript
 * const ioc: IocIndicator = {
 *   type: 'domain',
 *   value: 'EXAMPLE.COM',
 *   confidence: 'medium',
 *   severity: 'low',
 *   status: 'active'
 * };
 * const enriched = enrichIoc(ioc);
 * // Adds normalized value and extracted metadata
 * ```
 */
export declare const enrichIoc: (ioc: IocIndicator) => IocIndicator;
/**
 * Merges enrichment data into IOC indicator.
 *
 * @param {IocIndicator} ioc - Base IOC indicator
 * @param {IocEnrichment} enrichment - Enrichment data
 * @returns {IocIndicator} Merged IOC with enrichment data
 *
 * @example
 * ```typescript
 * const ioc: IocIndicator = { type: 'ip', value: '1.2.3.4', ... };
 * const enrichment: IocEnrichment = {
 *   iocValue: '1.2.3.4',
 *   iocType: 'ip',
 *   reputation: 75,
 *   threatCategories: ['malware', 'c2']
 * };
 * const merged = mergeEnrichmentData(ioc, enrichment);
 * ```
 */
export declare const mergeEnrichmentData: (ioc: IocIndicator, enrichment: IocEnrichment) => IocIndicator;
/**
 * Creates a pattern matching configuration for IOC detection.
 *
 * @param {IocType} type - IOC type
 * @param {RegExp | string} pattern - Matching pattern
 * @param {boolean} [caseSensitive] - Case sensitive matching
 * @returns {PatternMatchConfig} Pattern matching configuration
 *
 * @example
 * ```typescript
 * const config = createPatternMatchConfig('domain', /malware\.com$/i, false);
 * ```
 */
export declare const createPatternMatchConfig: (type: IocType, pattern: RegExp | string, caseSensitive?: boolean) => PatternMatchConfig;
/**
 * Converts IOC indicator to STIX 2.1 format for threat intelligence sharing.
 *
 * @param {IocIndicator} ioc - IOC indicator to convert
 * @returns {StixIndicator} STIX 2.1 indicator object
 * @throws {Error} If IOC is invalid or missing required fields
 *
 * @example
 * ```typescript
 * const ioc: IocIndicator = {
 *   id: 'ioc-123',
 *   type: 'ip',
 *   value: '192.168.1.1',
 *   confidence: 'high',
 *   severity: 'critical',
 *   status: 'active',
 *   firstSeen: new Date(),
 *   tags: ['malware', 'c2']
 * };
 * const stix = convertToStix(ioc);
 * ```
 */
export declare const convertToStix: (ioc: IocIndicator) => StixIndicator;
/**
 * Converts confidence level to STIX confidence score (0-100).
 *
 * @param {ConfidenceLevel} level - Confidence level
 * @returns {number} STIX confidence score
 *
 * @example
 * ```typescript
 * confidenceLevelToStixScore('critical'); // 95
 * confidenceLevelToStixScore('high'); // 80
 * confidenceLevelToStixScore('medium'); // 50
 * confidenceLevelToStixScore('low'); // 25
 * ```
 */
export declare const confidenceLevelToStixScore: (level: ConfidenceLevel) => number;
/**
 * Converts STIX 2.1 indicator to IOC indicator format.
 *
 * @param {StixIndicator} stix - STIX indicator object
 * @returns {IocIndicator} IOC indicator
 * @throws {Error} If STIX indicator is invalid or unsupported
 *
 * @example
 * ```typescript
 * const stix: StixIndicator = {
 *   type: 'indicator',
 *   spec_version: '2.1',
 *   id: 'indicator--123',
 *   pattern: "[network-traffic:src_ref.value = '1.2.3.4']",
 *   ...
 * };
 * const ioc = convertFromStix(stix);
 * ```
 */
export declare const convertFromStix: (stix: StixIndicator) => IocIndicator;
/**
 * Converts STIX confidence score (0-100) to confidence level.
 *
 * @param {number} score - STIX confidence score
 * @returns {ConfidenceLevel} Confidence level
 *
 * @example
 * ```typescript
 * stixScoreToConfidenceLevel(95); // 'critical'
 * stixScoreToConfidenceLevel(70); // 'high'
 * stixScoreToConfidenceLevel(45); // 'medium'
 * stixScoreToConfidenceLevel(20); // 'low'
 * ```
 */
export declare const stixScoreToConfidenceLevel: (score: number) => ConfidenceLevel;
/**
 * Generates Swagger/OpenAPI definition for IOC endpoints.
 *
 * @returns {SwaggerIocApiDefinition} Swagger API definition
 *
 * @example
 * ```typescript
 * const swaggerDef = generateSwaggerIocDefinition();
 * // Use in NestJS @ApiOperation, @ApiResponse decorators
 * ```
 */
export declare const generateSwaggerIocDefinition: () => SwaggerIocApiDefinition;
/**
 * Generates Sequelize model attributes for IOC storage.
 *
 * @returns {IocModelAttributes} Sequelize model attributes
 *
 * @example
 * ```typescript
 * const attributes = generateSequelizeIocModel();
 * // Use in Sequelize.define('Ioc', attributes, { ... })
 * ```
 */
export declare const generateSequelizeIocModel: () => IocModelAttributes;
declare const _default: {
    isValidIpv4: (ip: string) => boolean;
    isValidIpv6: (ip: string) => boolean;
    isValidDomain: (domain: string) => boolean;
    isValidUrl: (url: string) => boolean;
    isValidEmail: (email: string) => boolean;
    isValidHash: (hash: string, type: HashType) => boolean;
    normalizeIp: (ip: string) => string;
    normalizeDomain: (domain: string) => string;
    normalizeUrl: (url: string) => string;
    normalizeEmail: (email: string) => string;
    normalizeHash: (hash: string, type: HashType) => string;
    validateIoc: (value: string, type: IocType) => IocValidationResult;
    sanitizeIoc: (value: string) => string;
    validateIocIndicator: (ioc: IocIndicator) => IocValidationResult;
    extractIpMetadata: (ip: string) => Partial<IpIoc>;
    extractDomainMetadata: (domain: string) => Partial<DomainIoc>;
    extractUrlMetadata: (url: string) => Partial<UrlIoc>;
    extractEmailMetadata: (email: string) => Partial<EmailIoc>;
    enrichIoc: (ioc: IocIndicator) => IocIndicator;
    mergeEnrichmentData: (ioc: IocIndicator, enrichment: IocEnrichment) => IocIndicator;
    correlateByInfrastructure: any;
    correlateByTime: any;
    correlateByCampaign: any;
    calculateConfidenceScore: any;
    scoreToConfidenceLevel: any;
    updateConfidence: any;
    createLifecycleEvent: any;
    isExpired: any;
    calculateExpirationDate: any;
    updateIocStatus: any;
    deduplicateIocs: any;
    mergeDuplicateIocs: any;
    extractIocsFromText: any;
    createPatternMatchConfig: (type: IocType, pattern: RegExp | string, caseSensitive?: boolean) => PatternMatchConfig;
    convertToStix: (ioc: IocIndicator) => StixIndicator;
    confidenceLevelToStixScore: (level: ConfidenceLevel) => number;
    convertFromStix: (stix: StixIndicator) => IocIndicator;
    stixScoreToConfidenceLevel: (score: number) => ConfidenceLevel;
    generateSwaggerIocDefinition: () => SwaggerIocApiDefinition;
    generateSequelizeIocModel: () => IocModelAttributes;
};
export default _default;
//# sourceMappingURL=threat-indicators-kit.d.ts.map