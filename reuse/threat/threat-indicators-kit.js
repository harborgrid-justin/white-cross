"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSequelizeIocModel = exports.generateSwaggerIocDefinition = exports.stixScoreToConfidenceLevel = exports.convertFromStix = exports.confidenceLevelToStixScore = exports.convertToStix = exports.createPatternMatchConfig = exports.mergeEnrichmentData = exports.enrichIoc = exports.extractEmailMetadata = exports.extractUrlMetadata = exports.extractDomainMetadata = exports.extractIpMetadata = exports.validateIocIndicator = exports.sanitizeIoc = exports.validateIoc = exports.normalizeHash = exports.normalizeEmail = exports.normalizeUrl = exports.normalizeDomain = exports.normalizeIp = exports.isValidHash = exports.isValidEmail = exports.isValidUrl = exports.isValidDomain = exports.isValidIpv6 = exports.isValidIpv4 = void 0;
// ============================================================================
// IOC TYPE VALIDATION FUNCTIONS
// ============================================================================
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
const isValidIpv4 = (ip) => {
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipv4Regex.test(ip);
};
exports.isValidIpv4 = isValidIpv4;
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
const isValidIpv6 = (ip) => {
    const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
    return ipv6Regex.test(ip);
};
exports.isValidIpv6 = isValidIpv6;
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
const isValidDomain = (domain) => {
    if (typeof domain !== 'string') {
        throw new Error('Domain must be a string');
    }
    const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)*[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;
    return domainRegex.test(domain) && domain.length <= 253;
};
exports.isValidDomain = isValidDomain;
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
const isValidUrl = (url) => {
    try {
        const parsed = new URL(url);
        return ['http:', 'https:', 'ftp:', 'ftps:'].includes(parsed.protocol);
    }
    catch {
        return false;
    }
};
exports.isValidUrl = isValidUrl;
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
const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
};
exports.isValidEmail = isValidEmail;
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
const isValidHash = (hash, type) => {
    const hashRegexes = {
        md5: /^[a-fA-F0-9]{32}$/,
        sha1: /^[a-fA-F0-9]{40}$/,
        sha256: /^[a-fA-F0-9]{64}$/,
        sha512: /^[a-fA-F0-9]{128}$/,
        ssdeep: /^[0-9]{1,}:[a-zA-Z0-9/+]{1,}:[a-zA-Z0-9/+]{1,}$/,
    };
    return hashRegexes[type]?.test(hash) ?? false;
};
exports.isValidHash = isValidHash;
// ============================================================================
// IOC NORMALIZATION FUNCTIONS
// ============================================================================
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
const normalizeIp = (ip) => {
    if ((0, exports.isValidIpv4)(ip)) {
        return ip.split('.').map(octet => parseInt(octet, 10).toString()).join('.');
    }
    if ((0, exports.isValidIpv6)(ip)) {
        // Normalize IPv6 by expanding and then compressing
        const parts = ip.split(':');
        const normalized = parts.map(part => part.padStart(4, '0')).join(':');
        return normalized.replace(/\b0+/g, '0').replace(/(^|:)0(:0)+/g, '::');
    }
    throw new Error(`Invalid IP address: ${ip}`);
};
exports.normalizeIp = normalizeIp;
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
const normalizeDomain = (domain) => {
    const trimmed = domain.trim().toLowerCase();
    const withoutTrailingDot = trimmed.endsWith('.') ? trimmed.slice(0, -1) : trimmed;
    if (!(0, exports.isValidDomain)(withoutTrailingDot)) {
        throw new Error(`Invalid domain: ${domain}`);
    }
    return withoutTrailingDot;
};
exports.normalizeDomain = normalizeDomain;
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
const normalizeUrl = (url) => {
    let urlStr = url.trim();
    // Add protocol if missing
    if (!urlStr.match(/^[a-z]+:\/\//i)) {
        urlStr = `https://${urlStr}`;
    }
    if (!(0, exports.isValidUrl)(urlStr)) {
        throw new Error(`Invalid URL: ${url}`);
    }
    const parsed = new URL(urlStr);
    // Remove default ports
    if ((parsed.protocol === 'http:' && parsed.port === '80') ||
        (parsed.protocol === 'https:' && parsed.port === '443')) {
        parsed.port = '';
    }
    // Normalize hostname to lowercase
    parsed.hostname = parsed.hostname.toLowerCase();
    return parsed.toString();
};
exports.normalizeUrl = normalizeUrl;
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
const normalizeEmail = (email) => {
    const trimmed = email.trim().toLowerCase();
    if (!(0, exports.isValidEmail)(trimmed)) {
        throw new Error(`Invalid email: ${email}`);
    }
    return trimmed;
};
exports.normalizeEmail = normalizeEmail;
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
const normalizeHash = (hash, type) => {
    const trimmed = hash.trim().toLowerCase();
    if (!(0, exports.isValidHash)(trimmed, type)) {
        throw new Error(`Invalid ${type} hash: ${hash}`);
    }
    return trimmed;
};
exports.normalizeHash = normalizeHash;
// ============================================================================
// IOC VALIDATION AND SANITIZATION
// ============================================================================
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
const validateIoc = (value, type) => {
    const result = {
        isValid: false,
        errors: [],
        warnings: [],
        suggestions: [],
    };
    try {
        switch (type) {
            case 'ip':
                if ((0, exports.isValidIpv4)(value) || (0, exports.isValidIpv6)(value)) {
                    result.isValid = true;
                    result.normalized = (0, exports.normalizeIp)(value);
                }
                else {
                    result.errors.push(`Invalid IP address: ${value}`);
                }
                break;
            case 'domain':
                if ((0, exports.isValidDomain)(value)) {
                    result.isValid = true;
                    result.normalized = (0, exports.normalizeDomain)(value);
                }
                else {
                    result.errors.push(`Invalid domain: ${value}`);
                }
                break;
            case 'url':
                if ((0, exports.isValidUrl)(value)) {
                    result.isValid = true;
                    result.normalized = (0, exports.normalizeUrl)(value);
                }
                else {
                    result.errors.push(`Invalid URL: ${value}`);
                    result.suggestions.push('Ensure URL includes protocol (http:// or https://)');
                }
                break;
            case 'email':
                if ((0, exports.isValidEmail)(value)) {
                    result.isValid = true;
                    result.normalized = (0, exports.normalizeEmail)(value);
                }
                else {
                    result.errors.push(`Invalid email: ${value}`);
                }
                break;
            case 'hash':
                // Try to detect hash type
                const hashTypes = ['md5', 'sha1', 'sha256', 'sha512', 'ssdeep'];
                const detectedType = hashTypes.find(ht => (0, exports.isValidHash)(value, ht));
                if (detectedType) {
                    result.isValid = true;
                    result.normalized = (0, exports.normalizeHash)(value, detectedType);
                    result.warnings.push(`Detected hash type: ${detectedType}`);
                }
                else {
                    result.errors.push(`Invalid or unknown hash format: ${value}`);
                }
                break;
            default:
                result.isValid = true;
                result.normalized = value.trim();
                result.warnings.push(`No specific validation for type: ${type}`);
        }
    }
    catch (error) {
        result.isValid = false;
        result.errors.push(error instanceof Error ? error.message : String(error));
    }
    return result;
};
exports.validateIoc = validateIoc;
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
const sanitizeIoc = (value) => {
    return value
        .replace(/[<>'"]/g, '') // Remove potential XSS characters
        .replace(/;|--|\||&/g, '') // Remove SQL injection attempts
        .trim();
};
exports.sanitizeIoc = sanitizeIoc;
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
const validateIocIndicator = (ioc) => {
    const result = {
        isValid: true,
        errors: [],
        warnings: [],
    };
    if (!ioc) {
        throw new Error('IOC indicator cannot be null or undefined');
    }
    // Validate required fields
    if (!ioc.type) {
        result.isValid = false;
        result.errors.push('IOC type is required');
    }
    if (!ioc.value) {
        result.isValid = false;
        result.errors.push('IOC value is required');
    }
    // Validate IOC value format
    if (ioc.type && ioc.value) {
        const valueValidation = (0, exports.validateIoc)(ioc.value, ioc.type);
        if (!valueValidation.isValid) {
            result.isValid = false;
            result.errors.push(...(valueValidation.errors || []));
        }
    }
    // Validate dates
    if (ioc.expiresAt && ioc.firstSeen && ioc.expiresAt < ioc.firstSeen) {
        result.warnings.push('Expiration date is before first seen date');
    }
    if (ioc.lastSeen && ioc.firstSeen && ioc.lastSeen < ioc.firstSeen) {
        result.isValid = false;
        result.errors.push('Last seen date cannot be before first seen date');
    }
    // Validate confidence level
    const validConfidence = ['low', 'medium', 'high', 'critical'];
    if (ioc.confidence && !validConfidence.includes(ioc.confidence)) {
        result.isValid = false;
        result.errors.push(`Invalid confidence level: ${ioc.confidence}`);
    }
    return result;
};
exports.validateIocIndicator = validateIocIndicator;
// ============================================================================
// IOC ENRICHMENT FUNCTIONS
// ============================================================================
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
const extractIpMetadata = (ip) => {
    const metadata = {
        type: 'ip',
        value: ip,
    };
    if ((0, exports.isValidIpv4)(ip)) {
        metadata.version = 'ipv4';
    }
    else if ((0, exports.isValidIpv6)(ip)) {
        metadata.version = 'ipv6';
    }
    return metadata;
};
exports.extractIpMetadata = extractIpMetadata;
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
const extractDomainMetadata = (domain) => {
    const normalized = (0, exports.normalizeDomain)(domain);
    const parts = normalized.split('.');
    const tld = parts[parts.length - 1];
    return {
        type: 'domain',
        value: normalized,
        tld,
    };
};
exports.extractDomainMetadata = extractDomainMetadata;
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
const extractUrlMetadata = (url) => {
    const normalized = (0, exports.normalizeUrl)(url);
    const parsed = new URL(normalized);
    const queryParams = {};
    parsed.searchParams.forEach((value, key) => {
        queryParams[key] = value;
    });
    return {
        type: 'url',
        value: normalized,
        protocol: parsed.protocol,
        domain: parsed.hostname,
        path: parsed.pathname,
        queryParams: Object.keys(queryParams).length > 0 ? queryParams : undefined,
    };
};
exports.extractUrlMetadata = extractUrlMetadata;
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
const extractEmailMetadata = (email) => {
    const normalized = (0, exports.normalizeEmail)(email);
    const [, domain] = normalized.split('@');
    return {
        type: 'email',
        value: normalized,
        emailDomain: domain,
    };
};
exports.extractEmailMetadata = extractEmailMetadata;
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
const enrichIoc = (ioc) => {
    const enriched = { ...ioc };
    // Normalize value
    const validation = (0, exports.validateIoc)(ioc.value, ioc.type);
    if (validation.normalized) {
        enriched.value = validation.normalized;
    }
    // Extract type-specific metadata
    switch (ioc.type) {
        case 'ip':
            const ipMeta = (0, exports.extractIpMetadata)(enriched.value);
            Object.assign(enriched, ipMeta);
            break;
        case 'domain':
            const domainMeta = (0, exports.extractDomainMetadata)(enriched.value);
            Object.assign(enriched, domainMeta);
            break;
        case 'url':
            const urlMeta = (0, exports.extractUrlMetadata)(enriched.value);
            Object.assign(enriched, urlMeta);
            break;
        case 'email':
            const emailMeta = (0, exports.extractEmailMetadata)(enriched.value);
            Object.assign(enriched, emailMeta);
            break;
    }
    // Set default timestamps if not present
    if (!enriched.firstSeen) {
        enriched.firstSeen = new Date();
    }
    if (!enriched.lastSeen) {
        enriched.lastSeen = new Date();
    }
    return enriched;
};
exports.enrichIoc = enrichIoc;
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
const mergeEnrichmentData = (ioc, enrichment) => {
    const merged = { ...ioc };
    if (!merged.metadata) {
        merged.metadata = {};
    }
    // Add enrichment data to metadata
    merged.metadata.reputation = enrichment.reputation;
    merged.metadata.threatCategories = enrichment.threatCategories;
    merged.metadata.malwareFamilies = enrichment.malwareFamilies;
    merged.metadata.campaigns = enrichment.campaigns;
    merged.metadata.actors = enrichment.actors;
    merged.metadata.geolocation = enrichment.geolocation;
    merged.metadata.enrichmentSources = enrichment.sources;
    merged.metadata.lastAnalyzed = enrichment.lastAnalyzed;
    return merged;
};
exports.mergeEnrichmentData = mergeEnrichmentData;
;
    * ;
const correlation = correlateByInfrastructure(primary, pool);
    * `` `
 */
export const correlateByInfrastructure = (
  primaryIoc: IocIndicator,
  iocPool: IocIndicator[],
): IocCorrelation => {
  const relatedIocs: IocIndicator[] = [];

  // Find IOCs sharing infrastructure
  if (primaryIoc.type === 'domain' || primaryIoc.type === 'url') {
    const domain = primaryIoc.type === 'domain'
      ? primaryIoc.value
      : new URL(primaryIoc.value).hostname;

    relatedIocs.push(...iocPool.filter(ioc => {
      if (ioc.type === 'ip' && ioc.metadata?.resolvedDomains) {
        return (ioc.metadata.resolvedDomains as string[]).includes(domain);
      }
      return false;
    }));
  }

  return {
    primaryIoc,
    relatedIocs,
    correlationType: 'infrastructure',
    confidence: relatedIocs.length > 0 ? 0.8 : 0,
    description: `;
Found;
$;
{
    relatedIocs.length;
}
IOCs;
sharing;
infrastructure `,
  };
};

/**
 * Finds related IOCs based on temporal correlation (time proximity).
 *
 * @param {IocIndicator} primaryIoc - Primary IOC to correlate
 * @param {IocIndicator[]} iocPool - Pool of IOCs to search
 * @param {number} [timeWindowMs] - Time window in milliseconds (default: 24 hours)
 * @returns {IocCorrelation} Correlation result
 *
 * @example
 * ` ``;
typescript
    * ;
const primary = { type: 'ip', value: '1.2.3.4', firstSeen: new Date(), ... };
    * ;
const correlation = correlateByTime(primary, pool, 3600000); // 1 hour window
    * `` `
 */
export const correlateByTime = (
  primaryIoc: IocIndicator,
  iocPool: IocIndicator[],
  timeWindowMs: number = 24 * 60 * 60 * 1000,
): IocCorrelation => {
  const relatedIocs: IocIndicator[] = [];

  if (!primaryIoc.firstSeen) {
    return {
      primaryIoc,
      relatedIocs: [],
      correlationType: 'temporal',
      confidence: 0,
      description: 'Primary IOC has no timestamp',
    };
  }

  const primaryTime = primaryIoc.firstSeen.getTime();

  relatedIocs.push(...iocPool.filter(ioc => {
    if (!ioc.firstSeen) return false;
    const timeDiff = Math.abs(ioc.firstSeen.getTime() - primaryTime);
    return timeDiff <= timeWindowMs;
  }));

  return {
    primaryIoc,
    relatedIocs,
    correlationType: 'temporal',
    confidence: relatedIocs.length > 0 ? 0.6 : 0,
    description: `;
Found;
$;
{
    relatedIocs.length;
}
IOCs;
within;
$;
{
    timeWindowMs / 1000;
}
s;
time;
window `,
  };
};

/**
 * Finds related IOCs based on campaign or actor attribution.
 *
 * @param {IocIndicator} primaryIoc - Primary IOC to correlate
 * @param {IocIndicator[]} iocPool - Pool of IOCs to search
 * @returns {IocCorrelation} Correlation result
 *
 * @example
 * ` ``;
typescript
    * ;
const primary = {
    *() { }, ...
        * 
};
    * ;
const correlation = correlateByCampaign(primary, pool);
    * `` `
 */
export const correlateByCampaign = (
  primaryIoc: IocIndicator,
  iocPool: IocIndicator[],
): IocCorrelation => {
  const campaigns = (primaryIoc.metadata?.campaigns as string[]) || [];
  const actors = (primaryIoc.metadata?.actors as string[]) || [];

  if (campaigns.length === 0 && actors.length === 0) {
    return {
      primaryIoc,
      relatedIocs: [],
      correlationType: 'campaign',
      confidence: 0,
      description: 'Primary IOC has no campaign or actor attribution',
    };
  }

  const relatedIocs = iocPool.filter(ioc => {
    const iocCampaigns = (ioc.metadata?.campaigns as string[]) || [];
    const iocActors = (ioc.metadata?.actors as string[]) || [];

    const sharedCampaigns = campaigns.filter(c => iocCampaigns.includes(c));
    const sharedActors = actors.filter(a => iocActors.includes(a));

    return sharedCampaigns.length > 0 || sharedActors.length > 0;
  });

  return {
    primaryIoc,
    relatedIocs,
    correlationType: 'campaign',
    confidence: relatedIocs.length > 0 ? 0.9 : 0,
    description: `;
Found;
$;
{
    relatedIocs.length;
}
IOCs;
with (shared)
    campaign / actor;
attribution `,
  };
};

// ============================================================================
// IOC CONFIDENCE SCORING
// ============================================================================

/**
 * Calculates confidence score for an IOC based on multiple factors.
 *
 * @param {ConfidenceFactors} factors - Confidence scoring factors
 * @returns {number} Confidence score (0-1)
 *
 * @example
 * ` ``;
typescript
    * ;
const score = calculateConfidenceScore({});
    *
// Result: ~0.82
    * `` `
 */
export const calculateConfidenceScore = (factors: ConfidenceFactors): number => {
  const weights = {
    sourceReliability: 0.3,
    ageOfIndicator: 0.15,
    observationCount: 0.25,
    falsePositiveRate: 0.2,
    contextRelevance: 0.1,
  };

  // Normalize observation count (logarithmic scale, max at 10+ observations)
  const normalizedObservations = Math.min(1, Math.log10(factors.observationCount + 1) / Math.log10(11));

  // Invert false positive rate (lower is better)
  const invertedFpr = 1 - factors.falsePositiveRate;

  const score =
    factors.sourceReliability * weights.sourceReliability +
    factors.ageOfIndicator * weights.ageOfIndicator +
    normalizedObservations * weights.observationCount +
    invertedFpr * weights.falsePositiveRate +
    factors.contextRelevance * weights.contextRelevance;

  return Math.max(0, Math.min(1, score));
};

/**
 * Converts numeric confidence score to confidence level enum.
 *
 * @param {number} score - Confidence score (0-1)
 * @returns {ConfidenceLevel} Confidence level
 *
 * @example
 * ` ``;
typescript
    * scoreToConfidenceLevel(0.9); // 'critical'
    * scoreToConfidenceLevel(0.7); // 'high'
    * scoreToConfidenceLevel(0.4); // 'medium'
    * scoreToConfidenceLevel(0.2); // 'low'
    * `` `
 */
export const scoreToConfidenceLevel = (score: number): ConfidenceLevel => {
  if (score >= 0.85) return 'critical';
  if (score >= 0.65) return 'high';
  if (score >= 0.40) return 'medium';
  return 'low';
};

/**
 * Updates IOC confidence based on new observations or data.
 *
 * @param {IocIndicator} ioc - IOC indicator to update
 * @param {Partial<ConfidenceFactors>} newFactors - New confidence factors
 * @returns {IocIndicator} Updated IOC with new confidence
 *
 * @example
 * ` ``;
typescript
    * ;
const ioc = { type: 'ip', value: '1.2.3.4', confidence: 'medium', ... };
    * ;
const updated = updateConfidence(ioc, { observationCount: 10, sourceReliability: 0.95 });
    * `` `
 */
export const updateConfidence = (
  ioc: IocIndicator,
  newFactors: Partial<ConfidenceFactors>,
): IocIndicator => {
  const currentFactors: ConfidenceFactors = {
    sourceReliability: (ioc.metadata?.sourceReliability as number) || 0.5,
    ageOfIndicator: (ioc.metadata?.ageOfIndicator as number) || 0.5,
    observationCount: (ioc.metadata?.observationCount as number) || 1,
    falsePositiveRate: (ioc.metadata?.falsePositiveRate as number) || 0.1,
    contextRelevance: (ioc.metadata?.contextRelevance as number) || 0.5,
  };

  const mergedFactors = { ...currentFactors, ...newFactors };
  const newScore = calculateConfidenceScore(mergedFactors);
  const newLevel = scoreToConfidenceLevel(newScore);

  return {
    ...ioc,
    confidence: newLevel,
    metadata: {
      ...ioc.metadata,
      ...mergedFactors,
      confidenceScore: newScore,
    },
  };
};

// ============================================================================
// IOC LIFECYCLE MANAGEMENT
// ============================================================================

/**
 * Creates a lifecycle event for an IOC.
 *
 * @param {string} iocId - IOC identifier
 * @param {IocLifecycleEvent['event']} event - Event type
 * @param {string} [actor] - Actor performing the action
 * @param {string} [reason] - Reason for the action
 * @returns {IocLifecycleEvent} Lifecycle event
 *
 * @example
 * ` ``;
typescript
    * ;
const event = createLifecycleEvent('ioc-123', 'activated', 'admin', 'Confirmed threat');
    * `` `
 */
export const createLifecycleEvent = (
  iocId: string,
  event: IocLifecycleEvent['event'],
  actor?: string,
  reason?: string,
): IocLifecycleEvent => {
  return {
    iocId,
    event,
    timestamp: new Date(),
    actor,
    reason,
  };
};

/**
 * Checks if an IOC has expired based on expiresAt timestamp.
 *
 * @param {IocIndicator} ioc - IOC indicator to check
 * @returns {boolean} True if IOC has expired
 *
 * @example
 * ` ``;
typescript
    * ;
const ioc = {}('2020-01-01');
    * ;
    * ;
;
    * isExpired(ioc); // true (if current date is after 2020-01-01)
    * `` `
 */
export const isExpired = (ioc: IocIndicator): boolean => {
  if (!ioc.expiresAt) return false;
  return new Date() > ioc.expiresAt;
};

/**
 * Calculates expiration date for an IOC based on TTL (time-to-live).
 *
 * @param {Date} startDate - Start date for TTL calculation
 * @param {number} ttlDays - Time-to-live in days
 * @returns {Date} Expiration date
 *
 * @example
 * ` ``;
typescript
    * ;
const expires = calculateExpirationDate(new Date(), 30); // Expires in 30 days
    * `` `
 */
export const calculateExpirationDate = (startDate: Date, ttlDays: number): Date => {
  const expirationDate = new Date(startDate);
  expirationDate.setDate(expirationDate.getDate() + ttlDays);
  return expirationDate;
};

/**
 * Updates IOC status with lifecycle event tracking.
 *
 * @param {IocIndicator} ioc - IOC indicator to update
 * @param {IocStatus} newStatus - New status
 * @param {string} [actor] - Actor performing the update
 * @param {string} [reason] - Reason for status change
 * @returns {IocIndicator} Updated IOC indicator
 *
 * @example
 * ` ``;
typescript
    * ;
const updated = updateIocStatus(ioc, 'expired', 'system', 'Automatic expiration');
    * `` `
 */
export const updateIocStatus = (
  ioc: IocIndicator,
  newStatus: IocStatus,
  actor?: string,
  reason?: string,
): IocIndicator => {
  const updated = { ...ioc, status: newStatus };

  if (!updated.metadata) {
    updated.metadata = {};
  }

  if (!updated.metadata.lifecycleEvents) {
    updated.metadata.lifecycleEvents = [];
  }

  const event = createLifecycleEvent(
    ioc.id || '',
    newStatus === 'active' ? 'activated' : 'deactivated',
    actor,
    reason,
  );

  (updated.metadata.lifecycleEvents as IocLifecycleEvent[]).push(event);

  return updated;
};

// ============================================================================
// IOC DEDUPLICATION
// ============================================================================

/**
 * Identifies duplicate IOCs based on type and normalized value.
 *
 * @param {IocIndicator[]} iocs - Array of IOC indicators
 * @returns {DeduplicationResult} Deduplication result
 *
 * @example
 * ` ``;
typescript
    * ;
const iocs = [
        * { type: 'ip', value: '192.168.1.1', ... },
        * { type: 'ip', value: '192.168.001.001', ... }, // Duplicate
        * { type: 'domain', value: 'example.com', ... }
        * 
];
    * ;
const result = deduplicateIocs(iocs);
    * `` `
 */
export const deduplicateIocs = (iocs: IocIndicator[]): DeduplicationResult => {
  const seen = new Map<string, IocIndicator>();
  const duplicateMap = new Map<string, IocIndicator[]>();
  const uniqueIocs: IocIndicator[] = [];

  iocs.forEach(ioc => {
    const validation = validateIoc(ioc.value, ioc.type);
    const normalizedKey = `;
$;
{
    ioc.type;
}
$;
{
    validation.normalized || ioc.value;
}
`;

    if (seen.has(normalizedKey)) {
      const original = seen.get(normalizedKey)!;
      if (!duplicateMap.has(normalizedKey)) {
        duplicateMap.set(normalizedKey, []);
      }
      duplicateMap.get(normalizedKey)!.push(ioc);
    } else {
      seen.set(normalizedKey, ioc);
      uniqueIocs.push(ioc);
    }
  });

  const duplicates = Array.from(duplicateMap.entries()).map(([key, dups]) => ({
    original: seen.get(key)!,
    duplicates: dups,
  }));

  return {
    uniqueIocs,
    duplicates,
    merged: [], // Merging logic can be implemented based on requirements
  };
};

/**
 * Merges duplicate IOC indicators, preserving best metadata.
 *
 * @param {IocIndicator[]} duplicates - Array of duplicate IOCs
 * @returns {IocIndicator} Merged IOC indicator
 *
 * @example
 * ` ``;
typescript
    * ;
const duplicates = [
        * { type: 'ip', value: '1.2.3.4', confidence: 'low', ... },
        * { type: 'ip', value: '1.2.3.4', confidence: 'high', ... }
        * 
];
    * ;
const merged = mergeDuplicateIocs(duplicates); // Takes highest confidence
    * `` `
 */
export const mergeDuplicateIocs = (duplicates: IocIndicator[]): IocIndicator => {
  if (duplicates.length === 0) {
    throw new Error('Cannot merge empty array of IOCs');
  }

  if (duplicates.length === 1) {
    return duplicates[0];
  }

  // Start with first IOC
  const merged = { ...duplicates[0] };

  // Take highest confidence
  const confidenceLevels: Record<ConfidenceLevel, number> = {
    low: 1,
    medium: 2,
    high: 3,
    critical: 4,
  };

  duplicates.forEach(ioc => {
    if (confidenceLevels[ioc.confidence] > confidenceLevels[merged.confidence]) {
      merged.confidence = ioc.confidence;
    }

    // Take earliest first seen
    if (ioc.firstSeen && (!merged.firstSeen || ioc.firstSeen < merged.firstSeen)) {
      merged.firstSeen = ioc.firstSeen;
    }

    // Take latest last seen
    if (ioc.lastSeen && (!merged.lastSeen || ioc.lastSeen > merged.lastSeen)) {
      merged.lastSeen = ioc.lastSeen;
    }

    // Merge tags
    if (ioc.tags) {
      merged.tags = [...new Set([...(merged.tags || []), ...ioc.tags])];
    }

    // Merge metadata
    if (ioc.metadata) {
      merged.metadata = { ...merged.metadata, ...ioc.metadata };
    }
  });

  return merged;
};

// ============================================================================
// IOC PATTERN MATCHING
// ============================================================================

/**
 * Extracts IOCs from text using pattern matching.
 *
 * @param {string} text - Text to extract IOCs from
 * @param {IocType} type - Type of IOC to extract
 * @returns {string[]} Array of extracted IOC values
 *
 * @example
 * ` ``;
typescript
    * ;
const text = 'Malicious IP 192.168.1.1 and domain malware.com detected';
    * ;
const ips = extractIocsFromText(text, 'ip'); // ['192.168.1.1']
    * ;
const domains = extractIocsFromText(text, 'domain'); // ['malware.com']
    * `` `
 */
export const extractIocsFromText = (text: string, type: IocType): string[] => {
  const patterns: Record<IocType, RegExp> = {
    ip: /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g,
    domain: /\b(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}\b/g,
    url: /https?:\/\/[^\s<>"{}|\\^`;
[];
+/g,;
email: /\b[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\b/g,
    hash;
/\b[a-fA-F0-9]{32,128}\b/g,
    file;
/[\w\-. ]+\.(?:exe|dll|bat|cmd|ps1|vbs|js|jar|zip|rar|7z|doc|docx|xls|xlsx|pdf)\b/gi,
    registry;
/\b(?:HKEY_LOCAL_MACHINE|HKLM|HKEY_CURRENT_USER|HKCU|HKEY_CLASSES_ROOT|HKCR)\\[\\a-zA-Z0-9_\-]+/g,
    mutex;
/\b[A-Za-z0-9_\-]{8,}\b/g,
    'user-agent';
/.*/g, // Requires manual extraction
    certificate;
/[A-F0-9:]{40,}/g,
;
;
const pattern = patterns[type];
if (!pattern) {
    return [];
}
const matches = text.match(pattern);
return matches ? [...new Set(matches)] : [];
;
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
const createPatternMatchConfig = (type, pattern, caseSensitive = false) => {
    return {
        type,
        pattern,
        caseSensitive,
        extractMetadata: true,
    };
};
exports.createPatternMatchConfig = createPatternMatchConfig;
// ============================================================================
// STIX INDICATOR CONVERSION
// ============================================================================
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
const convertToStix = (ioc) => {
    if (!ioc.id) {
        throw new Error('IOC must have an ID for STIX conversion');
    }
    const stixId = `indicator--${ioc.id}`;
    const now = new Date().toISOString();
    const validFrom = ioc.firstSeen?.toISOString() || now;
    // Build STIX pattern based on IOC type
    let pattern = '';
    switch (ioc.type) {
        case 'ip':
            pattern = `[network-traffic:src_ref.type = 'ipv4-addr' AND network-traffic:src_ref.value = '${ioc.value}']`;
            break;
        case 'domain':
            pattern = `[domain-name:value = '${ioc.value}']`;
            break;
        case 'url':
            pattern = `[url:value = '${ioc.value}']`;
            break;
        case 'email':
            pattern = `[email-addr:value = '${ioc.value}']`;
            break;
        case 'hash':
            const hashIoc = ioc;
            pattern = `[file:hashes.'${hashIoc.hashType.toUpperCase()}' = '${ioc.value}']`;
            break;
        case 'file':
            pattern = `[file:name = '${ioc.value}']`;
            break;
        default:
            pattern = `[x-custom:value = '${ioc.value}']`;
    }
    const stixIndicator = {
        type: 'indicator',
        spec_version: '2.1',
        id: stixId,
        created: now,
        modified: now,
        name: `${ioc.type.toUpperCase()} Indicator: ${ioc.value}`,
        description: `Threat indicator of type ${ioc.type}`,
        indicator_types: ['malicious-activity'],
        pattern,
        pattern_type: 'stix',
        valid_from: validFrom,
        labels: ioc.tags || [],
        confidence: (0, exports.confidenceLevelToStixScore)(ioc.confidence),
    };
    if (ioc.expiresAt) {
        stixIndicator.valid_until = ioc.expiresAt.toISOString();
    }
    return stixIndicator;
};
exports.convertToStix = convertToStix;
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
const confidenceLevelToStixScore = (level) => {
    const scoreMap = {
        critical: 95,
        high: 80,
        medium: 50,
        low: 25,
    };
    return scoreMap[level];
};
exports.confidenceLevelToStixScore = confidenceLevelToStixScore;
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
const convertFromStix = (stix) => {
    // Parse STIX pattern to extract IOC value and type
    const ipMatch = stix.pattern.match(/network-traffic:src_ref\.value\s*=\s*'([^']+)'/);
    const domainMatch = stix.pattern.match(/domain-name:value\s*=\s*'([^']+)'/);
    const urlMatch = stix.pattern.match(/url:value\s*=\s*'([^']+)'/);
    const emailMatch = stix.pattern.match(/email-addr:value\s*=\s*'([^']+)'/);
    const fileMatch = stix.pattern.match(/file:hashes\.'([^']+)'\s*=\s*'([^']+)'/);
    let type;
    let value;
    if (ipMatch) {
        type = 'ip';
        value = ipMatch[1];
    }
    else if (domainMatch) {
        type = 'domain';
        value = domainMatch[1];
    }
    else if (urlMatch) {
        type = 'url';
        value = urlMatch[1];
    }
    else if (emailMatch) {
        type = 'email';
        value = emailMatch[1];
    }
    else if (fileMatch) {
        type = 'hash';
        value = fileMatch[2];
    }
    else {
        throw new Error('Unsupported STIX pattern format');
    }
    const ioc = {
        id: stix.id.replace('indicator--', ''),
        type,
        value,
        confidence: (0, exports.stixScoreToConfidenceLevel)(stix.confidence || 50),
        severity: 'medium',
        status: 'active',
        firstSeen: new Date(stix.valid_from),
        tags: stix.labels,
        metadata: {
            stixId: stix.id,
            stixCreated: stix.created,
            stixModified: stix.modified,
        },
    };
    if (stix.valid_until) {
        ioc.expiresAt = new Date(stix.valid_until);
    }
    return ioc;
};
exports.convertFromStix = convertFromStix;
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
const stixScoreToConfidenceLevel = (score) => {
    if (score >= 85)
        return 'critical';
    if (score >= 65)
        return 'high';
    if (score >= 40)
        return 'medium';
    return 'low';
};
exports.stixScoreToConfidenceLevel = stixScoreToConfidenceLevel;
// ============================================================================
// SWAGGER API DEFINITIONS
// ============================================================================
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
const generateSwaggerIocDefinition = () => {
    return {
        '/api/v1/iocs': {
            get: {
                summary: 'List IOC indicators',
                parameters: [
                    { name: 'type', in: 'query', schema: { type: 'string' }, required: false },
                    { name: 'confidence', in: 'query', schema: { type: 'string' }, required: false },
                    { name: 'status', in: 'query', schema: { type: 'string' }, required: false },
                    { name: 'page', in: 'query', schema: { type: 'number' }, required: false },
                    { name: 'limit', in: 'query', schema: { type: 'number' }, required: false },
                ],
                responses: {
                    200: { description: 'List of IOC indicators' },
                    400: { description: 'Invalid request parameters' },
                    401: { description: 'Unauthorized' },
                    500: { description: 'Internal server error' },
                },
            },
            post: {
                summary: 'Create IOC indicator',
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    type: { type: 'string' },
                                    value: { type: 'string' },
                                    confidence: { type: 'string' },
                                    severity: { type: 'string' },
                                    status: { type: 'string' },
                                    tags: { type: 'array', items: { type: 'string' } },
                                },
                                required: ['type', 'value'],
                            },
                        },
                    },
                },
                responses: {
                    201: { description: 'IOC indicator created' },
                    400: { description: 'Invalid IOC data' },
                    401: { description: 'Unauthorized' },
                    409: { description: 'IOC already exists' },
                    500: { description: 'Internal server error' },
                },
            },
        },
    };
};
exports.generateSwaggerIocDefinition = generateSwaggerIocDefinition;
// ============================================================================
// SEQUELIZE MODEL DEFINITION
// ============================================================================
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
const generateSequelizeIocModel = () => {
    return {
        id: {
            type: 'UUID',
            defaultValue: 'UUIDV4',
            primaryKey: true,
        },
        type: {
            type: 'ENUM',
            values: ['ip', 'domain', 'hash', 'url', 'email', 'file', 'registry', 'mutex', 'user-agent', 'certificate'],
            allowNull: false,
        },
        value: {
            type: 'STRING',
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        confidence: {
            type: 'ENUM',
            values: ['low', 'medium', 'high', 'critical'],
            defaultValue: 'medium',
        },
        severity: {
            type: 'ENUM',
            values: ['informational', 'low', 'medium', 'high', 'critical'],
            defaultValue: 'medium',
        },
        status: {
            type: 'ENUM',
            values: ['active', 'inactive', 'expired', 'pending', 'false-positive'],
            defaultValue: 'active',
        },
        firstSeen: {
            type: 'DATE',
            allowNull: true,
        },
        lastSeen: {
            type: 'DATE',
            allowNull: true,
        },
        expiresAt: {
            type: 'DATE',
            allowNull: true,
        },
        source: {
            type: 'STRING',
            allowNull: true,
        },
        tags: {
            type: 'JSON',
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
    };
};
exports.generateSequelizeIocModel = generateSequelizeIocModel;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Validation
    isValidIpv4: exports.isValidIpv4,
    isValidIpv6: exports.isValidIpv6,
    isValidDomain: exports.isValidDomain,
    isValidUrl: exports.isValidUrl,
    isValidEmail: exports.isValidEmail,
    isValidHash: exports.isValidHash,
    // Normalization
    normalizeIp: exports.normalizeIp,
    normalizeDomain: exports.normalizeDomain,
    normalizeUrl: exports.normalizeUrl,
    normalizeEmail: exports.normalizeEmail,
    normalizeHash: exports.normalizeHash,
    // IOC Validation
    validateIoc: exports.validateIoc,
    sanitizeIoc: exports.sanitizeIoc,
    validateIocIndicator: exports.validateIocIndicator,
    // Enrichment
    extractIpMetadata: exports.extractIpMetadata,
    extractDomainMetadata: exports.extractDomainMetadata,
    extractUrlMetadata: exports.extractUrlMetadata,
    extractEmailMetadata: exports.extractEmailMetadata,
    enrichIoc: exports.enrichIoc,
    mergeEnrichmentData: exports.mergeEnrichmentData,
    // Correlation
    correlateByInfrastructure,
    correlateByTime,
    correlateByCampaign,
    // Confidence Scoring
    calculateConfidenceScore,
    scoreToConfidenceLevel,
    updateConfidence,
    // Lifecycle Management
    createLifecycleEvent,
    isExpired,
    calculateExpirationDate,
    updateIocStatus,
    // Deduplication
    deduplicateIocs,
    mergeDuplicateIocs,
    // Pattern Matching
    extractIocsFromText,
    createPatternMatchConfig: exports.createPatternMatchConfig,
    // STIX Conversion
    convertToStix: exports.convertToStix,
    confidenceLevelToStixScore: exports.confidenceLevelToStixScore,
    convertFromStix: exports.convertFromStix,
    stixScoreToConfidenceLevel: exports.stixScoreToConfidenceLevel,
    // Swagger & Sequelize
    generateSwaggerIocDefinition: exports.generateSwaggerIocDefinition,
    generateSequelizeIocModel: exports.generateSequelizeIocModel,
};
//# sourceMappingURL=threat-indicators-kit.js.map