"use strict";
/**
 * LOC: PHDK1234567
 * File: /reuse/threat/phishing-detection-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Email security services
 *   - Phishing detection services
 *   - Email gateway integrations
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.processEmailGatewayWebhook = exports.exportPhishingIntelligence = exports.createPhishingDetectionService = exports.calculateConfidenceScore = exports.validateEmailPolicy = exports.detectSocialEngineering = exports.analyzeURLParameters = exports.checkDNSRecords = exports.generatePhishingReport = exports.detectLookalikeCharacters = exports.analyzeSenderReputation = exports.checkIDNHomograph = exports.analyzeEmailAttachments = exports.detectRedirectChain = exports.analyzeSSLCertificate = exports.detectCredentialHarvesting = exports.reportPhishingEmail = exports.quarantineEmail = exports.createEmailGatewayConfig = exports.validatePhishingDetection = exports.calculatePhishingScore = exports.isTargetingBrand = exports.detectBrandImpersonation = exports.analyzeHTMLContent = exports.detectPhishingKits = exports.analyzeEmailSubject = exports.detectHeaderSpoofing = exports.analyzeEmailAuthentication = exports.extractEmailFromHeader = exports.parseEmailHeaders = exports.isTLDSwap = exports.isSubdomainAttack = exports.isCombosquatting = exports.hasHomoglyphs = exports.generateTyposquattingVariations = exports.detectTyposquatting = exports.calculateDomainSimilarity = exports.normalizeURL = exports.isURLObfuscated = exports.extractRootDomain = exports.extractDomain = exports.checkURLBlacklist = exports.analyzeURL = void 0;
// ============================================================================
// URL ANALYSIS
// ============================================================================
/**
 * Analyzes URL for phishing indicators.
 *
 * @param {string} url - URL to analyze
 * @returns {URLAnalysisResult} Analysis result with phishing indicators
 *
 * @example
 * ```typescript
 * const result = analyzeURL('http://paypa1.com/verify-account');
 * // Result: { isPhishing: true, riskScore: 85, indicators: [...] }
 * ```
 */
const analyzeURL = (url) => {
    const indicators = [];
    let riskScore = 0;
    try {
        const urlObj = new URL(url);
        const domain = urlObj.hostname;
        const protocol = urlObj.protocol;
        const path = urlObj.pathname;
        // Check for IP address instead of domain
        if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(domain)) {
            indicators.push({
                type: 'ip_address_domain',
                severity: 'high',
                description: 'URL uses IP address instead of domain name',
                value: domain,
            });
            riskScore += 30;
        }
        // Check for non-standard ports
        if (urlObj.port && !['80', '443', ''].includes(urlObj.port)) {
            indicators.push({
                type: 'non_standard_port',
                severity: 'medium',
                description: 'URL uses non-standard port',
                value: urlObj.port,
            });
            riskScore += 15;
        }
        // Check for HTTP instead of HTTPS
        if (protocol === 'http:') {
            indicators.push({
                type: 'insecure_protocol',
                severity: 'medium',
                description: 'URL uses insecure HTTP protocol',
            });
            riskScore += 20;
        }
        // Check for suspicious keywords in URL
        const suspiciousKeywords = [
            'verify', 'account', 'update', 'confirm', 'login', 'secure',
            'banking', 'suspended', 'locked', 'urgent', 'action-required',
        ];
        const urlLower = url.toLowerCase();
        suspiciousKeywords.forEach((keyword) => {
            if (urlLower.includes(keyword)) {
                indicators.push({
                    type: 'suspicious_keyword',
                    severity: 'low',
                    description: `URL contains suspicious keyword: ${keyword}`,
                    value: keyword,
                });
                riskScore += 5;
            }
        });
        // Check for excessive subdomains
        const subdomains = domain.split('.');
        if (subdomains.length > 4) {
            indicators.push({
                type: 'excessive_subdomains',
                severity: 'medium',
                description: 'URL has excessive number of subdomains',
                value: String(subdomains.length),
            });
            riskScore += 15;
        }
        // Check for URL shorteners
        const shorteners = ['bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'ow.ly'];
        if (shorteners.some((shortener) => domain.includes(shortener))) {
            indicators.push({
                type: 'url_shortener',
                severity: 'medium',
                description: 'URL uses URL shortening service',
            });
            riskScore += 20;
        }
        // Parse query parameters
        const queryParams = {};
        urlObj.searchParams.forEach((value, key) => {
            queryParams[key] = value;
        });
        // Check for suspicious query parameters
        if (queryParams.redirect || queryParams.url || queryParams.goto) {
            indicators.push({
                type: 'redirect_parameter',
                severity: 'high',
                description: 'URL contains redirect parameter',
            });
            riskScore += 25;
        }
        const fragments = path.split('/').filter((p) => p.length > 0);
        return {
            url,
            domain,
            protocol,
            path,
            queryParams,
            fragments,
            isPhishing: riskScore >= 50,
            riskScore: Math.min(100, riskScore),
            indicators,
        };
    }
    catch (error) {
        // Invalid URL
        return {
            url,
            domain: '',
            protocol: '',
            path: '',
            queryParams: {},
            fragments: [],
            isPhishing: true,
            riskScore: 100,
            indicators: [
                {
                    type: 'invalid_url',
                    severity: 'critical',
                    description: 'Invalid URL format',
                },
            ],
        };
    }
};
exports.analyzeURL = analyzeURL;
/**
 * Checks if URL is blacklisted in known phishing databases.
 *
 * @param {string} url - URL to check
 * @returns {Promise<{ blacklisted: boolean; sources: string[] }>} Blacklist status
 *
 * @example
 * ```typescript
 * const status = await checkURLBlacklist('http://phishing-site.com');
 * // Result: { blacklisted: true, sources: ['PhishTank', 'OpenPhish'] }
 * ```
 */
const checkURLBlacklist = async (url) => {
    // In production, would check against PhishTank, OpenPhish, etc.
    return {
        blacklisted: false,
        sources: [],
    };
};
exports.checkURLBlacklist = checkURLBlacklist;
/**
 * Extracts domain from URL.
 *
 * @param {string} url - URL to extract domain from
 * @returns {string} Extracted domain
 *
 * @example
 * ```typescript
 * const domain = extractDomain('https://www.example.com/path?query=1');
 * // Result: 'www.example.com'
 * ```
 */
const extractDomain = (url) => {
    try {
        const urlObj = new URL(url);
        return urlObj.hostname;
    }
    catch {
        return '';
    }
};
exports.extractDomain = extractDomain;
/**
 * Extracts root domain from URL (without subdomains).
 *
 * @param {string} url - URL to extract root domain from
 * @returns {string} Root domain
 *
 * @example
 * ```typescript
 * const root = extractRootDomain('https://mail.google.com/inbox');
 * // Result: 'google.com'
 * ```
 */
const extractRootDomain = (url) => {
    try {
        const domain = (0, exports.extractDomain)(url);
        const parts = domain.split('.');
        if (parts.length >= 2) {
            return parts.slice(-2).join('.');
        }
        return domain;
    }
    catch {
        return '';
    }
};
exports.extractRootDomain = extractRootDomain;
/**
 * Checks if URL contains encoded/obfuscated characters.
 *
 * @param {string} url - URL to check
 * @returns {boolean} True if URL is obfuscated
 *
 * @example
 * ```typescript
 * const isObfuscated = isURLObfuscated('http://example.com/%2e%2e%2f');
 * // Result: true
 * ```
 */
const isURLObfuscated = (url) => {
    // Check for excessive URL encoding
    const encodedPattern = /%[0-9A-Fa-f]{2}/g;
    const encodedMatches = url.match(encodedPattern);
    if (encodedMatches && encodedMatches.length > 5) {
        return true;
    }
    // Check for unicode/punycode obfuscation
    if (url.includes('xn--')) {
        return true;
    }
    // Check for unusual characters
    if (/[^\x00-\x7F]/.test(url)) {
        return true;
    }
    return false;
};
exports.isURLObfuscated = isURLObfuscated;
/**
 * Normalizes URL for comparison and analysis.
 *
 * @param {string} url - URL to normalize
 * @returns {string} Normalized URL
 *
 * @example
 * ```typescript
 * const normalized = normalizeURL('HTTP://EXAMPLE.COM:80/path/../file.html?b=2&a=1#frag');
 * // Result: 'http://example.com/file.html?a=1&b=2'
 * ```
 */
const normalizeURL = (url) => {
    try {
        const urlObj = new URL(url.toLowerCase());
        // Remove default ports
        if ((urlObj.protocol === 'http:' && urlObj.port === '80') ||
            (urlObj.protocol === 'https:' && urlObj.port === '443')) {
            urlObj.port = '';
        }
        // Sort query parameters
        const params = Array.from(urlObj.searchParams.entries()).sort((a, b) => a[0].localeCompare(b[0]));
        urlObj.search = new URLSearchParams(params).toString();
        // Remove fragment
        urlObj.hash = '';
        return urlObj.toString();
    }
    catch {
        return url;
    }
};
exports.normalizeURL = normalizeURL;
// ============================================================================
// DOMAIN SIMILARITY DETECTION
// ============================================================================
/**
 * Calculates domain similarity score between two domains.
 *
 * @param {string} domain1 - First domain
 * @param {string} domain2 - Second domain
 * @returns {DomainSimilarity} Similarity analysis result
 *
 * @example
 * ```typescript
 * const similarity = calculateDomainSimilarity('paypal.com', 'paypa1.com');
 * // Result: { similarityScore: 0.92, technique: 'typosquatting', distance: 1 }
 * ```
 */
const calculateDomainSimilarity = (domain1, domain2) => {
    const d1 = domain1.toLowerCase().replace(/^www\./, '');
    const d2 = domain2.toLowerCase().replace(/^www\./, '');
    // Calculate Levenshtein distance
    const distance = calculateLevenshteinDistance(d1, d2);
    const maxLength = Math.max(d1.length, d2.length);
    const similarityScore = 1 - distance / maxLength;
    // Determine technique
    let technique = 'typosquatting';
    if ((0, exports.hasHomoglyphs)(d1, d2)) {
        technique = 'homoglyph';
    }
    else if ((0, exports.isCombosquatting)(d1, d2)) {
        technique = 'combosquatting';
    }
    else if ((0, exports.isSubdomainAttack)(d1, d2)) {
        technique = 'subdomain';
    }
    else if ((0, exports.isTLDSwap)(d1, d2)) {
        technique = 'tld-swap';
    }
    return {
        originalDomain: domain1,
        suspiciousDomain: domain2,
        similarityScore,
        technique,
        distance,
    };
};
exports.calculateDomainSimilarity = calculateDomainSimilarity;
/**
 * Detects typosquatting attempts for a given domain.
 *
 * @param {string} domain - Domain to check
 * @param {string[]} knownDomains - List of legitimate domains
 * @returns {TyposquattingResult[]} Detected typosquatting domains
 *
 * @example
 * ```typescript
 * const results = detectTyposquatting('paypa1.com', ['paypal.com', 'amazon.com']);
 * // Returns array of typosquatting detections
 * ```
 */
const detectTyposquatting = (domain, knownDomains) => {
    const results = [];
    knownDomains.forEach((knownDomain) => {
        const similarity = (0, exports.calculateDomainSimilarity)(knownDomain, domain);
        if (similarity.similarityScore > 0.8 && similarity.distance > 0) {
            results.push({
                originalDomain: knownDomain,
                typosquatDomain: domain,
                technique: similarity.technique,
                registered: false, // Would check DNS in production
            });
        }
    });
    return results;
};
exports.detectTyposquatting = detectTyposquatting;
/**
 * Generates common typosquatting variations of a domain.
 *
 * @param {string} domain - Domain to generate variations for
 * @returns {string[]} Array of typosquatting variations
 *
 * @example
 * ```typescript
 * const variations = generateTyposquattingVariations('paypal.com');
 * // Result: ['paypa1.com', 'paypai.com', 'payapl.com', 'paipal.com', ...]
 * ```
 */
const generateTyposquattingVariations = (domain) => {
    const variations = new Set();
    const [name, tld] = domain.split('.');
    // Character omission
    for (let i = 0; i < name.length; i++) {
        variations.add(name.slice(0, i) + name.slice(i + 1) + '.' + tld);
    }
    // Character substitution (common typos)
    const substitutions = {
        'a': ['q', 's'],
        'e': ['w', 'r'],
        'i': ['u', 'o'],
        'o': ['i', 'p', '0'],
        'l': ['1', 'i'],
        'm': ['n', 'rn'],
        'n': ['m'],
    };
    for (let i = 0; i < name.length; i++) {
        const char = name[i];
        if (substitutions[char]) {
            substitutions[char].forEach((sub) => {
                variations.add(name.slice(0, i) + sub + name.slice(i + 1) + '.' + tld);
            });
        }
    }
    // Character repetition
    for (let i = 0; i < name.length; i++) {
        variations.add(name.slice(0, i) + name[i] + name.slice(i) + '.' + tld);
    }
    // Common TLD swaps
    const commonTLDs = ['com', 'net', 'org', 'co', 'io', 'info'];
    commonTLDs.forEach((newTld) => {
        if (newTld !== tld) {
            variations.add(name + '.' + newTld);
        }
    });
    return Array.from(variations);
};
exports.generateTyposquattingVariations = generateTyposquattingVariations;
/**
 * Detects homoglyph attacks (visually similar characters).
 *
 * @param {string} domain1 - First domain
 * @param {string} domain2 - Second domain
 * @returns {boolean} True if homoglyph attack detected
 *
 * @example
 * ```typescript
 * const isHomoglyph = hasHomoglyphs('paypal.com', 'pаypal.com'); // Cyrillic 'а'
 * // Result: true
 * ```
 */
const hasHomoglyphs = (domain1, domain2) => {
    const homoglyphMap = {
        'a': ['а', 'ɑ', 'α'],
        'e': ['е', 'ė', 'ē'],
        'i': ['і', 'ı', 'ɪ'],
        'o': ['о', 'ο', '0'],
        'p': ['р', 'ρ'],
        'c': ['с', 'ϲ'],
        's': ['ѕ', 'ꜱ'],
        'x': ['х', 'ⅹ'],
    };
    const d1Lower = domain1.toLowerCase();
    const d2Lower = domain2.toLowerCase();
    for (const [latin, homoglyphs] of Object.entries(homoglyphMap)) {
        for (const homoglyph of homoglyphs) {
            if (d1Lower.includes(latin) && d2Lower.includes(homoglyph)) {
                return true;
            }
            if (d2Lower.includes(latin) && d1Lower.includes(homoglyph)) {
                return true;
            }
        }
    }
    return false;
};
exports.hasHomoglyphs = hasHomoglyphs;
/**
 * Detects combosquatting (adding keywords to legitimate domain).
 *
 * @param {string} legitimateDomain - Legitimate domain
 * @param {string} suspiciousDomain - Suspicious domain
 * @returns {boolean} True if combosquatting detected
 *
 * @example
 * ```typescript
 * const isCombo = isCombosquatting('paypal.com', 'paypal-secure.com');
 * // Result: true
 * ```
 */
const isCombosquatting = (legitimateDomain, suspiciousDomain) => {
    const legitName = legitimateDomain.split('.')[0].toLowerCase();
    const suspName = suspiciousDomain.toLowerCase();
    // Check if legitimate domain name is contained in suspicious domain with additions
    return suspName.includes(legitName) && suspName !== legitimateDomain.toLowerCase();
};
exports.isCombosquatting = isCombosquatting;
/**
 * Detects subdomain-based attacks.
 *
 * @param {string} legitimateDomain - Legitimate domain
 * @param {string} suspiciousDomain - Suspicious domain
 * @returns {boolean} True if subdomain attack detected
 *
 * @example
 * ```typescript
 * const isSubdomain = isSubdomainAttack('paypal.com', 'paypal.com.evil.com');
 * // Result: true
 * ```
 */
const isSubdomainAttack = (legitimateDomain, suspiciousDomain) => {
    const suspParts = suspiciousDomain.toLowerCase().split('.');
    const legitLower = legitimateDomain.toLowerCase();
    // Check if legitimate domain appears as subdomain
    return suspParts.some((part, index) => {
        if (index < suspParts.length - 2) {
            const subdomain = suspParts.slice(index, index + 2).join('.');
            return subdomain === legitLower;
        }
        return false;
    });
};
exports.isSubdomainAttack = isSubdomainAttack;
/**
 * Detects TLD swap attacks.
 *
 * @param {string} domain1 - First domain
 * @param {string} domain2 - Second domain
 * @returns {boolean} True if TLD swap detected
 *
 * @example
 * ```typescript
 * const isTLDSwap = isTLDSwap('paypal.com', 'paypal.net');
 * // Result: true
 * ```
 */
const isTLDSwap = (domain1, domain2) => {
    const parts1 = domain1.split('.');
    const parts2 = domain2.split('.');
    if (parts1.length !== parts2.length)
        return false;
    const name1 = parts1.slice(0, -1).join('.');
    const name2 = parts2.slice(0, -1).join('.');
    const tld1 = parts1[parts1.length - 1];
    const tld2 = parts2[parts2.length - 1];
    return name1 === name2 && tld1 !== tld2;
};
exports.isTLDSwap = isTLDSwap;
// ============================================================================
// EMAIL HEADER ANALYSIS
// ============================================================================
/**
 * Parses email headers from raw email content.
 *
 * @param {string} rawHeaders - Raw email headers
 * @returns {EmailHeader} Parsed email header object
 *
 * @example
 * ```typescript
 * const headers = parseEmailHeaders(rawHeaderString);
 * // Result: { from: 'user@example.com', to: ['recipient@domain.com'], ... }
 * ```
 */
const parseEmailHeaders = (rawHeaders) => {
    const lines = rawHeaders.split('\n');
    const headers = {
        from: '',
        to: [],
        subject: '',
        date: new Date(),
        messageId: '',
        receivedHeaders: [],
    };
    lines.forEach((line) => {
        const colonIndex = line.indexOf(':');
        if (colonIndex === -1)
            return;
        const key = line.substring(0, colonIndex).toLowerCase().trim();
        const value = line.substring(colonIndex + 1).trim();
        switch (key) {
            case 'from':
                headers.from = (0, exports.extractEmailFromHeader)(value);
                break;
            case 'to':
                headers.to = value.split(',').map((email) => (0, exports.extractEmailFromHeader)(email.trim()));
                break;
            case 'subject':
                headers.subject = value;
                break;
            case 'date':
                headers.date = new Date(value);
                break;
            case 'message-id':
                headers.messageId = value;
                break;
            case 'return-path':
                headers.returnPath = (0, exports.extractEmailFromHeader)(value);
                break;
            case 'received':
                headers.receivedHeaders.push(value);
                break;
            case 'authentication-results':
                headers.authenticationResults = value;
                parseAuthenticationResults(value, headers);
                break;
        }
    });
    return headers;
};
exports.parseEmailHeaders = parseEmailHeaders;
/**
 * Extracts email address from header value.
 *
 * @param {string} headerValue - Header value containing email
 * @returns {string} Extracted email address
 *
 * @example
 * ```typescript
 * const email = extractEmailFromHeader('John Doe <john@example.com>');
 * // Result: 'john@example.com'
 * ```
 */
const extractEmailFromHeader = (headerValue) => {
    const match = headerValue.match(/<([^>]+)>/);
    if (match) {
        return match[1];
    }
    return headerValue.trim();
};
exports.extractEmailFromHeader = extractEmailFromHeader;
/**
 * Analyzes SPF, DKIM, and DMARC authentication results.
 *
 * @param {EmailHeader} headers - Email headers
 * @returns {{ spfPass: boolean; dkimPass: boolean; dmarcPass: boolean; riskScore: number }} Authentication analysis
 *
 * @example
 * ```typescript
 * const auth = analyzeEmailAuthentication(headers);
 * // Result: { spfPass: true, dkimPass: true, dmarcPass: true, riskScore: 0 }
 * ```
 */
const analyzeEmailAuthentication = (headers) => {
    const spfPass = headers.spfResult === 'pass';
    const dkimPass = headers.dkimResult === 'pass';
    const dmarcPass = headers.dmarcResult === 'pass';
    let riskScore = 0;
    if (!spfPass)
        riskScore += 30;
    if (!dkimPass)
        riskScore += 30;
    if (!dmarcPass)
        riskScore += 40;
    return {
        spfPass,
        dkimPass,
        dmarcPass,
        riskScore: Math.min(100, riskScore),
    };
};
exports.analyzeEmailAuthentication = analyzeEmailAuthentication;
/**
 * Parses authentication results header.
 *
 * @param {string} authResults - Authentication results header value
 * @param {EmailHeader} headers - Email header object to update
 */
const parseAuthenticationResults = (authResults, headers) => {
    if (authResults.includes('spf=pass')) {
        headers.spfResult = 'pass';
    }
    else if (authResults.includes('spf=fail')) {
        headers.spfResult = 'fail';
    }
    if (authResults.includes('dkim=pass')) {
        headers.dkimResult = 'pass';
    }
    else if (authResults.includes('dkim=fail')) {
        headers.dkimResult = 'fail';
    }
    if (authResults.includes('dmarc=pass')) {
        headers.dmarcResult = 'pass';
    }
    else if (authResults.includes('dmarc=fail')) {
        headers.dmarcResult = 'fail';
    }
};
/**
 * Detects email header spoofing attempts.
 *
 * @param {EmailHeader} headers - Email headers
 * @returns {{ spoofed: boolean; indicators: string[] }} Spoofing detection result
 *
 * @example
 * ```typescript
 * const result = detectHeaderSpoofing(headers);
 * // Result: { spoofed: true, indicators: ['from_mismatch', 'return_path_mismatch'] }
 * ```
 */
const detectHeaderSpoofing = (headers) => {
    const indicators = [];
    // Check if From and Return-Path domains match
    if (headers.returnPath) {
        const fromDomain = headers.from.split('@')[1];
        const returnDomain = headers.returnPath.split('@')[1];
        if (fromDomain !== returnDomain) {
            indicators.push('from_return_path_mismatch');
        }
    }
    // Check for suspicious received headers
    if (headers.receivedHeaders.length === 0) {
        indicators.push('no_received_headers');
    }
    // Check authentication failures
    if (headers.spfResult === 'fail' || headers.dkimResult === 'fail') {
        indicators.push('authentication_failure');
    }
    return {
        spoofed: indicators.length > 0,
        indicators,
    };
};
exports.detectHeaderSpoofing = detectHeaderSpoofing;
/**
 * Analyzes email subject for phishing patterns.
 *
 * @param {string} subject - Email subject line
 * @returns {{ suspicious: boolean; score: number; patterns: string[] }} Subject analysis
 *
 * @example
 * ```typescript
 * const result = analyzeEmailSubject('URGENT: Verify your account now!');
 * // Result: { suspicious: true, score: 65, patterns: ['urgency', 'verify'] }
 * ```
 */
const analyzeEmailSubject = (subject) => {
    const patterns = [];
    let score = 0;
    const subjectLower = subject.toLowerCase();
    // Urgency keywords
    const urgencyKeywords = ['urgent', 'immediate', 'action required', 'expires', 'suspended'];
    urgencyKeywords.forEach((keyword) => {
        if (subjectLower.includes(keyword)) {
            patterns.push('urgency');
            score += 15;
        }
    });
    // Security keywords
    const securityKeywords = ['verify', 'confirm', 'secure', 'update', 'validate'];
    securityKeywords.forEach((keyword) => {
        if (subjectLower.includes(keyword)) {
            patterns.push('security');
            score += 10;
        }
    });
    // Financial keywords
    const financialKeywords = ['payment', 'invoice', 'refund', 'transaction', 'account'];
    financialKeywords.forEach((keyword) => {
        if (subjectLower.includes(keyword)) {
            patterns.push('financial');
            score += 10;
        }
    });
    // Excessive punctuation
    if ((subject.match(/!/g) || []).length > 2) {
        patterns.push('excessive_punctuation');
        score += 15;
    }
    // All caps
    if (subject === subject.toUpperCase() && subject.length > 5) {
        patterns.push('all_caps');
        score += 20;
    }
    return {
        suspicious: score >= 30,
        score: Math.min(100, score),
        patterns: Array.from(new Set(patterns)),
    };
};
exports.analyzeEmailSubject = analyzeEmailSubject;
// ============================================================================
// PHISHING KIT DETECTION
// ============================================================================
/**
 * Detects known phishing kit signatures in content.
 *
 * @param {string} content - HTML or text content to analyze
 * @returns {PhishingKitSignature[]} Detected phishing kit signatures
 *
 * @example
 * ```typescript
 * const kits = detectPhishingKits(htmlContent);
 * // Returns array of detected phishing kit signatures
 * ```
 */
const detectPhishingKits = (content) => {
    const detectedKits = [];
    // Known phishing kit patterns
    const knownKits = [
        {
            name: 'PayPal Phishing Kit v2',
            brand: 'PayPal',
            patterns: ['paypal-verify', 'pp-account-check', 'paypal-secure-login'],
            confidence: 0,
        },
        {
            name: 'Office 365 Credential Harvester',
            brand: 'Microsoft',
            patterns: ['office365-login', 'o365-verify', 'microsoft-account-verify'],
            confidence: 0,
        },
        {
            name: 'Generic Banking Kit',
            brand: 'Banking',
            patterns: ['bank-login-verify', 'secure-banking-portal', 'account-validation'],
            confidence: 0,
        },
    ];
    const contentLower = content.toLowerCase();
    knownKits.forEach((kit) => {
        let matchCount = 0;
        kit.patterns.forEach((pattern) => {
            if (contentLower.includes(pattern.toLowerCase())) {
                matchCount++;
            }
        });
        if (matchCount > 0) {
            const confidence = matchCount / kit.patterns.length;
            if (confidence >= 0.5) {
                detectedKits.push({
                    ...kit,
                    fileHashes: [],
                    urlPatterns: [],
                    confidence,
                });
            }
        }
    });
    return detectedKits;
};
exports.detectPhishingKits = detectPhishingKits;
/**
 * Analyzes HTML content for phishing indicators.
 *
 * @param {string} html - HTML content to analyze
 * @returns {{ score: number; indicators: PhishingIndicator[] }} Analysis result
 *
 * @example
 * ```typescript
 * const result = analyzeHTMLContent(htmlString);
 * // Result: { score: 75, indicators: [...] }
 * ```
 */
const analyzeHTMLContent = (html) => {
    const indicators = [];
    let score = 0;
    // Check for hidden form fields
    if (html.includes('type="hidden"') && html.includes('password')) {
        indicators.push({
            type: 'hidden_password_field',
            severity: 'high',
            description: 'Hidden password field detected',
        });
        score += 30;
    }
    // Check for external form actions
    const formActionMatch = html.match(/action=["']([^"']+)["']/i);
    if (formActionMatch) {
        const action = formActionMatch[1];
        if (action.startsWith('http://') || action.startsWith('https://')) {
            indicators.push({
                type: 'external_form_action',
                severity: 'medium',
                description: 'Form submits to external URL',
                value: action,
            });
            score += 20;
        }
    }
    // Check for JavaScript obfuscation
    if (html.includes('eval(') || html.includes('unescape(') || html.includes('fromCharCode(')) {
        indicators.push({
            type: 'javascript_obfuscation',
            severity: 'high',
            description: 'Obfuscated JavaScript detected',
        });
        score += 35;
    }
    // Check for iframe injection
    if (html.includes('<iframe') && html.includes('style="display:none"')) {
        indicators.push({
            type: 'hidden_iframe',
            severity: 'critical',
            description: 'Hidden iframe detected',
        });
        score += 40;
    }
    return {
        score: Math.min(100, score),
        indicators,
    };
};
exports.analyzeHTMLContent = analyzeHTMLContent;
// ============================================================================
// BRAND IMPERSONATION DETECTION
// ============================================================================
/**
 * Detects brand impersonation in domain or content.
 *
 * @param {string} domain - Domain to check
 * @param {string} content - Content to analyze
 * @param {string[]} protectedBrands - List of brands to protect
 * @returns {BrandImpersonation[]} Detected impersonations
 *
 * @example
 * ```typescript
 * const impersonations = detectBrandImpersonation(
 *   'paypa1-secure.com',
 *   htmlContent,
 *   ['PayPal', 'Microsoft', 'Amazon']
 * );
 * ```
 */
const detectBrandImpersonation = (domain, content, protectedBrands) => {
    const impersonations = [];
    protectedBrands.forEach((brand) => {
        const brandLower = brand.toLowerCase();
        const domainLower = domain.toLowerCase();
        const contentLower = content.toLowerCase();
        const evidence = [];
        let confidence = 0;
        // Check domain similarity
        if (domainLower.includes(brandLower)) {
            evidence.push('brand_name_in_domain');
            confidence += 40;
        }
        // Check for typosquatting
        const brandDomain = `${brandLower}.com`;
        const similarity = (0, exports.calculateDomainSimilarity)(brandDomain, domain);
        if (similarity.similarityScore > 0.7 && similarity.distance > 0) {
            evidence.push('domain_similarity');
            confidence += 30;
        }
        // Check content for brand mentions
        const brandMentions = (contentLower.match(new RegExp(brandLower, 'g')) || []).length;
        if (brandMentions > 3) {
            evidence.push('frequent_brand_mentions');
            confidence += 15;
        }
        // Check for logo/trademark usage
        if (contentLower.includes('logo') || contentLower.includes(brandLower + '.png')) {
            evidence.push('logo_usage');
            confidence += 15;
        }
        if (confidence >= 40) {
            impersonations.push({
                targetBrand: brand,
                detectedDomain: domain,
                impersonationType: similarity.distance === 0 ? 'exact' : similarity.technique === 'subdomain' ? 'subdomain' : 'similar',
                confidence: Math.min(1, confidence / 100),
                evidence,
            });
        }
    });
    return impersonations;
};
exports.detectBrandImpersonation = detectBrandImpersonation;
/**
 * Checks if domain targets specific brand.
 *
 * @param {string} domain - Domain to check
 * @param {string} brand - Brand name
 * @returns {boolean} True if domain targets brand
 *
 * @example
 * ```typescript
 * const targets = isTargetingBrand('paypal-verify.com', 'PayPal');
 * // Result: true
 * ```
 */
const isTargetingBrand = (domain, brand) => {
    const domainLower = domain.toLowerCase();
    const brandLower = brand.toLowerCase();
    return domainLower.includes(brandLower);
};
exports.isTargetingBrand = isTargetingBrand;
// ============================================================================
// PHISHING SCORE CALCULATION
// ============================================================================
/**
 * Calculates comprehensive phishing score for email/URL.
 *
 * @param {object} data - Data to analyze
 * @returns {PhishingScore} Phishing score with classification
 *
 * @example
 * ```typescript
 * const score = calculatePhishingScore({
 *   url: 'http://paypa1.com',
 *   headers: emailHeaders,
 *   content: htmlContent,
 *   domain: 'paypa1.com'
 * });
 * // Result: { totalScore: 85, classification: 'likely_phishing', ... }
 * ```
 */
const calculatePhishingScore = (data) => {
    let urlScore = 0;
    let domainScore = 0;
    let contentScore = 0;
    let headerScore = 0;
    // URL analysis
    if (data.url) {
        const urlAnalysis = (0, exports.analyzeURL)(data.url);
        urlScore = urlAnalysis.riskScore;
    }
    // Domain analysis
    if (data.domain) {
        // Check against known legitimate domains
        const knownBrands = ['paypal.com', 'microsoft.com', 'google.com', 'amazon.com'];
        const typosquatting = (0, exports.detectTyposquatting)(data.domain, knownBrands);
        domainScore = typosquatting.length > 0 ? 70 : 0;
    }
    // Content analysis
    if (data.content) {
        const contentAnalysis = (0, exports.analyzeHTMLContent)(data.content);
        contentScore = contentAnalysis.score;
    }
    // Header analysis
    if (data.headers) {
        const authAnalysis = (0, exports.analyzeEmailAuthentication)(data.headers);
        headerScore = authAnalysis.riskScore;
    }
    // Calculate weighted total
    const weights = {
        url: 0.25,
        domain: 0.3,
        content: 0.25,
        header: 0.2,
    };
    const totalScore = urlScore * weights.url +
        domainScore * weights.domain +
        contentScore * weights.content +
        headerScore * weights.header;
    // Classify based on score
    let classification;
    let confidence;
    if (totalScore >= 75) {
        classification = 'confirmed_phishing';
        confidence = 0.9;
    }
    else if (totalScore >= 50) {
        classification = 'likely_phishing';
        confidence = 0.75;
    }
    else if (totalScore >= 25) {
        classification = 'suspicious';
        confidence = 0.5;
    }
    else {
        classification = 'safe';
        confidence = 0.3;
    }
    return {
        totalScore: Math.min(100, totalScore),
        urlScore,
        domainScore,
        contentScore,
        headerScore,
        classification,
        confidence,
    };
};
exports.calculatePhishingScore = calculatePhishingScore;
/**
 * Validates phishing detection against known false positives.
 *
 * @param {PhishingScore} score - Phishing score
 * @param {string} domain - Domain being analyzed
 * @returns {{ isValid: boolean; reason?: string }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validatePhishingDetection(score, 'example.com');
 * // Result: { isValid: true }
 * ```
 */
const validatePhishingDetection = (score, domain) => {
    // Whitelist of known safe domains
    const whitelist = ['google.com', 'microsoft.com', 'apple.com'];
    const rootDomain = (0, exports.extractRootDomain)(`https://${domain}`);
    if (whitelist.includes(rootDomain)) {
        return {
            isValid: false,
            reason: 'Domain is whitelisted',
        };
    }
    // Check if score is borderline and requires manual review
    if (score.totalScore >= 40 && score.totalScore <= 60) {
        return {
            isValid: false,
            reason: 'Score requires manual review',
        };
    }
    return { isValid: true };
};
exports.validatePhishingDetection = validatePhishingDetection;
// ============================================================================
// EMAIL GATEWAY INTEGRATION
// ============================================================================
/**
 * Creates email gateway configuration.
 *
 * @param {EmailGatewayConfig['provider']} provider - Gateway provider
 * @param {object} config - Configuration options
 * @returns {EmailGatewayConfig} Gateway configuration
 *
 * @example
 * ```typescript
 * const config = createEmailGatewayConfig('office365', {
 *   apiEndpoint: 'https://graph.microsoft.com/v1.0',
 *   apiKey: 'secret-key',
 *   enableQuarantine: true
 * });
 * ```
 */
const createEmailGatewayConfig = (provider, config) => {
    return {
        provider,
        apiEndpoint: config.apiEndpoint || '',
        apiKey: config.apiKey || '',
        webhookUrl: config.webhookUrl,
        enableQuarantine: config.enableQuarantine ?? true,
        enableReporting: config.enableReporting ?? true,
    };
};
exports.createEmailGatewayConfig = createEmailGatewayConfig;
/**
 * Sends email to quarantine via gateway.
 *
 * @param {string} emailId - Email identifier
 * @param {EmailGatewayConfig} config - Gateway configuration
 * @returns {Promise<boolean>} True if quarantine successful
 *
 * @example
 * ```typescript
 * const success = await quarantineEmail('msg-123', gatewayConfig);
 * // Result: true
 * ```
 */
const quarantineEmail = async (emailId, config) => {
    // In production, would call actual gateway API
    return true;
};
exports.quarantineEmail = quarantineEmail;
/**
 * Reports phishing email to gateway and threat feeds.
 *
 * @param {PhishingReport} report - Phishing report
 * @param {EmailGatewayConfig} config - Gateway configuration
 * @returns {Promise<boolean>} True if report submitted successfully
 *
 * @example
 * ```typescript
 * const report = { emailId: 'msg-123', reportedBy: 'user@example.com', ... };
 * const success = await reportPhishingEmail(report, gatewayConfig);
 * ```
 */
const reportPhishingEmail = async (report, config) => {
    // In production, would submit to gateway and threat feeds
    return true;
};
exports.reportPhishingEmail = reportPhishingEmail;
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
/**
 * Calculates Levenshtein distance between two strings.
 *
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} Edit distance
 */
const calculateLevenshteinDistance = (str1, str2) => {
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
// ADVANCED PHISHING DETECTION
// ============================================================================
/**
 * Detects credential harvesting forms in HTML content.
 *
 * @param {string} html - HTML content to analyze
 * @returns {{ detected: boolean; formCount: number; passwordFields: number }} Detection result
 *
 * @example
 * ```typescript
 * const result = detectCredentialHarvesting(htmlContent);
 * // Result: { detected: true, formCount: 1, passwordFields: 2 }
 * ```
 */
const detectCredentialHarvesting = (html) => {
    const formMatches = html.match(/<form[^>]*>/gi) || [];
    const passwordMatches = html.match(/type=["']password["']/gi) || [];
    return {
        detected: formMatches.length > 0 && passwordMatches.length > 0,
        formCount: formMatches.length,
        passwordFields: passwordMatches.length,
    };
};
exports.detectCredentialHarvesting = detectCredentialHarvesting;
/**
 * Analyzes SSL certificate information for phishing indicators.
 *
 * @param {object} certInfo - Certificate information
 * @returns {{ suspicious: boolean; score: number; indicators: string[] }} Analysis result
 *
 * @example
 * ```typescript
 * const result = analyzeSSLCertificate({
 *   issuer: 'Unknown CA',
 *   validDays: 5,
 *   isWildcard: true
 * });
 * // Result: { suspicious: true, score: 75, indicators: ['short_validity', 'unknown_issuer'] }
 * ```
 */
const analyzeSSLCertificate = (certInfo) => {
    const indicators = [];
    let score = 0;
    // Check certificate validity period
    if (certInfo.validDays && certInfo.validDays < 30) {
        indicators.push('short_validity_period');
        score += 30;
    }
    // Check for unknown/untrusted issuer
    const trustedIssuers = ['DigiCert', 'Let\'s Encrypt', 'Comodo', 'GlobalSign', 'GeoTrust'];
    if (certInfo.issuer && !trustedIssuers.some((trusted) => certInfo.issuer?.includes(trusted))) {
        indicators.push('unknown_issuer');
        score += 25;
    }
    // Wildcard certificates can be misused
    if (certInfo.isWildcard) {
        indicators.push('wildcard_certificate');
        score += 15;
    }
    return {
        suspicious: score >= 40,
        score: Math.min(100, score),
        indicators,
    };
};
exports.analyzeSSLCertificate = analyzeSSLCertificate;
/**
 * Detects suspicious redirect chains in URLs.
 *
 * @param {string[]} redirectChain - Array of URLs in redirect chain
 * @returns {{ suspicious: boolean; length: number; crossDomain: boolean }} Analysis result
 *
 * @example
 * ```typescript
 * const result = detectRedirectChain([
 *   'http://safe.com',
 *   'http://redirect.com',
 *   'http://phishing.com'
 * ]);
 * // Result: { suspicious: true, length: 3, crossDomain: true }
 * ```
 */
const detectRedirectChain = (redirectChain) => {
    const domains = redirectChain.map((url) => (0, exports.extractDomain)(url));
    const uniqueDomains = new Set(domains);
    const crossDomain = uniqueDomains.size > 1;
    return {
        suspicious: redirectChain.length > 3 || crossDomain,
        length: redirectChain.length,
        crossDomain,
    };
};
exports.detectRedirectChain = detectRedirectChain;
/**
 * Analyzes email attachments for phishing indicators.
 *
 * @param {Array<{ filename: string; mimeType: string; size: number }>} attachments - Email attachments
 * @returns {{ suspicious: boolean; score: number; risks: string[] }} Analysis result
 *
 * @example
 * ```typescript
 * const result = analyzeEmailAttachments([
 *   { filename: 'invoice.exe', mimeType: 'application/x-msdownload', size: 1024000 }
 * ]);
 * // Result: { suspicious: true, score: 85, risks: ['executable_file', 'invoice_naming'] }
 * ```
 */
const analyzeEmailAttachments = (attachments) => {
    const risks = [];
    let score = 0;
    const dangerousMimeTypes = [
        'application/x-msdownload',
        'application/x-executable',
        'application/x-sh',
        'application/vnd.ms-excel.sheet.macroEnabled',
    ];
    const dangerousExtensions = ['.exe', '.scr', '.bat', '.cmd', '.vbs', '.js', '.jar'];
    attachments.forEach((attachment) => {
        // Check for dangerous file types
        if (dangerousMimeTypes.some((type) => attachment.mimeType.includes(type))) {
            risks.push('dangerous_file_type');
            score += 40;
        }
        // Check for dangerous extensions
        if (dangerousExtensions.some((ext) => attachment.filename.toLowerCase().endsWith(ext))) {
            risks.push('executable_file');
            score += 45;
        }
        // Check for double extensions
        if (/\.[a-z]{3,4}\.[a-z]{3,4}$/i.test(attachment.filename)) {
            risks.push('double_extension');
            score += 30;
        }
        // Check for invoice/document naming tricks
        const phishingNames = ['invoice', 'receipt', 'document', 'important', 'urgent'];
        if (phishingNames.some((name) => attachment.filename.toLowerCase().includes(name))) {
            risks.push('suspicious_naming');
            score += 15;
        }
    });
    return {
        suspicious: score >= 40,
        score: Math.min(100, score),
        risks: Array.from(new Set(risks)),
    };
};
exports.analyzeEmailAttachments = analyzeEmailAttachments;
/**
 * Checks if URL uses internationalized domain names (IDN) for homograph attacks.
 *
 * @param {string} url - URL to check
 * @returns {{ isIDN: boolean; punycode: string; suspicious: boolean }} IDN analysis
 *
 * @example
 * ```typescript
 * const result = checkIDNHomograph('http://xn--pple-43d.com'); // аpple.com
 * // Result: { isIDN: true, punycode: 'xn--pple-43d', suspicious: true }
 * ```
 */
const checkIDNHomograph = (url) => {
    const domain = (0, exports.extractDomain)(url);
    const isIDN = domain.includes('xn--');
    return {
        isIDN,
        punycode: isIDN ? domain : '',
        suspicious: isIDN,
    };
};
exports.checkIDNHomograph = checkIDNHomograph;
/**
 * Analyzes email sender reputation.
 *
 * @param {string} senderEmail - Sender email address
 * @param {string} senderDomain - Sender domain
 * @returns {Promise<{ reputation: number; trustworthy: boolean; flags: string[] }>} Reputation analysis
 *
 * @example
 * ```typescript
 * const rep = await analyzeSenderReputation('user@example.com', 'example.com');
 * // Result: { reputation: 75, trustworthy: true, flags: [] }
 * ```
 */
const analyzeSenderReputation = async (senderEmail, senderDomain) => {
    // In production, would check against reputation databases
    const flags = [];
    let reputation = 50;
    // Check if sender is from known legitimate domain
    const trustedDomains = ['gmail.com', 'outlook.com', 'yahoo.com'];
    if (trustedDomains.includes(senderDomain.toLowerCase())) {
        reputation += 30;
    }
    return {
        reputation: Math.min(100, reputation),
        trustworthy: reputation >= 60,
        flags,
    };
};
exports.analyzeSenderReputation = analyzeSenderReputation;
/**
 * Detects lookalike Unicode characters in domains.
 *
 * @param {string} domain - Domain to check
 * @returns {{ detected: boolean; characters: Array<{ char: string; position: number }> }} Detection result
 *
 * @example
 * ```typescript
 * const result = detectLookalikeCharacters('pаypal.com'); // Cyrillic 'а'
 * // Result: { detected: true, characters: [{ char: 'а', position: 1 }] }
 * ```
 */
const detectLookalikeCharacters = (domain) => {
    const lookalikeChars = ['а', 'е', 'і', 'о', 'р', 'с', 'х', 'ѕ'];
    const detected = [];
    for (let i = 0; i < domain.length; i++) {
        if (lookalikeChars.includes(domain[i])) {
            detected.push({ char: domain[i], position: i });
        }
    }
    return {
        detected: detected.length > 0,
        characters: detected,
    };
};
exports.detectLookalikeCharacters = detectLookalikeCharacters;
/**
 * Generates phishing report for submission to authorities/feeds.
 *
 * @param {PhishingScore} score - Phishing score
 * @param {string} url - Phishing URL
 * @param {EmailHeader} [headers] - Email headers
 * @returns {PhishingReport} Generated report
 *
 * @example
 * ```typescript
 * const report = generatePhishingReport(score, 'http://phishing.com', headers);
 * // Returns structured phishing report
 * ```
 */
const generatePhishingReport = (score, url, headers) => {
    return {
        id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        reportedBy: 'system',
        emailId: headers?.messageId || '',
        reportedUrl: url,
        reportedAt: new Date(),
        status: 'pending',
        analysisResult: score,
    };
};
exports.generatePhishingReport = generatePhishingReport;
/**
 * Checks DNS records for email authentication (SPF, DKIM, DMARC).
 *
 * @param {string} domain - Domain to check
 * @returns {Promise<{ spf: boolean; dkim: boolean; dmarc: boolean }>} DNS record status
 *
 * @example
 * ```typescript
 * const dns = await checkDNSRecords('example.com');
 * // Result: { spf: true, dkim: true, dmarc: true }
 * ```
 */
const checkDNSRecords = async (domain) => {
    // In production, would actually query DNS
    return {
        spf: false,
        dkim: false,
        dmarc: false,
    };
};
exports.checkDNSRecords = checkDNSRecords;
/**
 * Analyzes URL parameters for credential theft patterns.
 *
 * @param {Record<string, string>} params - URL query parameters
 * @returns {{ suspicious: boolean; sensitiveParams: string[] }} Analysis result
 *
 * @example
 * ```typescript
 * const result = analyzeURLParameters({ redirect: 'http://evil.com', token: 'abc123' });
 * // Result: { suspicious: true, sensitiveParams: ['redirect', 'token'] }
 * ```
 */
const analyzeURLParameters = (params) => {
    const suspiciousParamNames = [
        'redirect', 'url', 'goto', 'return', 'next', 'callback',
        'token', 'auth', 'session', 'password', 'user',
    ];
    const sensitiveParams = Object.keys(params).filter((key) => suspiciousParamNames.includes(key.toLowerCase()));
    return {
        suspicious: sensitiveParams.length > 0,
        sensitiveParams,
    };
};
exports.analyzeURLParameters = analyzeURLParameters;
/**
 * Detects social engineering tactics in email content.
 *
 * @param {string} content - Email content
 * @returns {{ detected: boolean; tactics: string[]; urgency: number }} Detection result
 *
 * @example
 * ```typescript
 * const result = detectSocialEngineering('URGENT: Your account will be suspended!');
 * // Result: { detected: true, tactics: ['urgency', 'fear'], urgency: 90 }
 * ```
 */
const detectSocialEngineering = (content) => {
    const tactics = [];
    let urgencyScore = 0;
    const contentLower = content.toLowerCase();
    // Urgency tactics
    const urgencyPhrases = ['urgent', 'immediate action', 'expires today', 'act now', 'limited time'];
    urgencyPhrases.forEach((phrase) => {
        if (contentLower.includes(phrase)) {
            tactics.push('urgency');
            urgencyScore += 20;
        }
    });
    // Fear tactics
    const fearPhrases = ['suspended', 'locked', 'unauthorized', 'suspicious activity', 'security alert'];
    fearPhrases.forEach((phrase) => {
        if (contentLower.includes(phrase)) {
            tactics.push('fear');
            urgencyScore += 15;
        }
    });
    // Authority impersonation
    const authorityPhrases = ['ceo', 'manager', 'administrator', 'support team', 'security team'];
    authorityPhrases.forEach((phrase) => {
        if (contentLower.includes(phrase)) {
            tactics.push('authority');
            urgencyScore += 10;
        }
    });
    // Greed tactics
    const greedPhrases = ['prize', 'winner', 'refund', 'claim', 'reward'];
    greedPhrases.forEach((phrase) => {
        if (contentLower.includes(phrase)) {
            tactics.push('greed');
            urgencyScore += 10;
        }
    });
    return {
        detected: tactics.length > 0,
        tactics: Array.from(new Set(tactics)),
        urgency: Math.min(100, urgencyScore),
    };
};
exports.detectSocialEngineering = detectSocialEngineering;
/**
 * Validates email against corporate email policies.
 *
 * @param {EmailHeader} headers - Email headers
 * @param {string} content - Email content
 * @param {object} policy - Corporate email policy
 * @returns {{ compliant: boolean; violations: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const result = validateEmailPolicy(headers, content, {
 *   allowExternalLinks: false,
 *   requireEncryption: true
 * });
 * ```
 */
const validateEmailPolicy = (headers, content, policy) => {
    const violations = [];
    // Check for external links
    if (policy.allowExternalLinks === false && /<a href=["']http/i.test(content)) {
        violations.push('external_links_not_allowed');
    }
    // Check sender domain
    if (policy.blockedDomains) {
        const senderDomain = headers.from.split('@')[1];
        if (policy.blockedDomains.includes(senderDomain)) {
            violations.push('sender_domain_blocked');
        }
    }
    return {
        compliant: violations.length === 0,
        violations,
    };
};
exports.validateEmailPolicy = validateEmailPolicy;
/**
 * Calculates confidence score for phishing classification.
 *
 * @param {PhishingScore} score - Phishing score
 * @param {number} [historicalAccuracy] - Historical accuracy rate
 * @returns {number} Confidence score (0-1)
 *
 * @example
 * ```typescript
 * const confidence = calculateConfidenceScore(score, 0.95);
 * // Result: 0.89
 * ```
 */
const calculateConfidenceScore = (score, historicalAccuracy = 0.85) => {
    let confidence = 0.5;
    // Boost confidence based on total score
    if (score.totalScore >= 80) {
        confidence = 0.95;
    }
    else if (score.totalScore >= 60) {
        confidence = 0.85;
    }
    else if (score.totalScore >= 40) {
        confidence = 0.7;
    }
    else if (score.totalScore <= 20) {
        confidence = 0.9; // High confidence it's NOT phishing
    }
    // Adjust based on historical accuracy
    confidence *= historicalAccuracy;
    return Math.max(0, Math.min(1, confidence));
};
exports.calculateConfidenceScore = calculateConfidenceScore;
/**
 * Creates phishing detection NestJS service configuration.
 *
 * @param {object} config - Service configuration
 * @returns {object} NestJS service configuration
 *
 * @example
 * ```typescript
 * const serviceConfig = createPhishingDetectionService({
 *   enableRealTime: true,
 *   scanInterval: 60000,
 *   alertThreshold: 70
 * });
 * ```
 */
const createPhishingDetectionService = (config) => {
    return {
        enabled: true,
        realTime: config.enableRealTime ?? true,
        scanInterval: config.scanInterval ?? 60000,
        alertThreshold: config.alertThreshold ?? 70,
        emailGateway: config.emailGateway,
        createdAt: new Date(),
    };
};
exports.createPhishingDetectionService = createPhishingDetectionService;
/**
 * Exports phishing intelligence to threat sharing platforms (STIX/TAXII).
 *
 * @param {PhishingReport[]} reports - Phishing reports to export
 * @returns {object} STIX bundle for threat sharing
 *
 * @example
 * ```typescript
 * const stixBundle = exportPhishingIntelligence([report1, report2]);
 * // Returns STIX 2.1 bundle for sharing
 * ```
 */
const exportPhishingIntelligence = (reports) => {
    return {
        type: 'bundle',
        id: `bundle--${Date.now()}`,
        spec_version: '2.1',
        objects: reports.map((report) => ({
            type: 'indicator',
            id: `indicator--${report.id}`,
            pattern: `[url:value = '${report.reportedUrl}']`,
            valid_from: report.reportedAt.toISOString(),
            labels: ['phishing', 'malicious-activity'],
        })),
    };
};
exports.exportPhishingIntelligence = exportPhishingIntelligence;
/**
 * Integrates with email security gateway webhook.
 *
 * @param {EmailGatewayConfig} config - Gateway configuration
 * @param {object} webhookPayload - Webhook payload
 * @returns {Promise<boolean>} True if webhook processed successfully
 *
 * @example
 * ```typescript
 * const success = await processEmailGatewayWebhook(config, payload);
 * // Result: true
 * ```
 */
const processEmailGatewayWebhook = async (config, webhookPayload) => {
    // In production, would process actual webhook
    return true;
};
exports.processEmailGatewayWebhook = processEmailGatewayWebhook;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // URL analysis
    analyzeURL: exports.analyzeURL,
    checkURLBlacklist: exports.checkURLBlacklist,
    extractDomain: exports.extractDomain,
    extractRootDomain: exports.extractRootDomain,
    isURLObfuscated: exports.isURLObfuscated,
    normalizeURL: exports.normalizeURL,
    // Domain similarity
    calculateDomainSimilarity: exports.calculateDomainSimilarity,
    detectTyposquatting: exports.detectTyposquatting,
    generateTyposquattingVariations: exports.generateTyposquattingVariations,
    hasHomoglyphs: exports.hasHomoglyphs,
    isCombosquatting: exports.isCombosquatting,
    isSubdomainAttack: exports.isSubdomainAttack,
    isTLDSwap: exports.isTLDSwap,
    // Email headers
    parseEmailHeaders: exports.parseEmailHeaders,
    extractEmailFromHeader: exports.extractEmailFromHeader,
    analyzeEmailAuthentication: exports.analyzeEmailAuthentication,
    detectHeaderSpoofing: exports.detectHeaderSpoofing,
    analyzeEmailSubject: exports.analyzeEmailSubject,
    // Phishing kits
    detectPhishingKits: exports.detectPhishingKits,
    analyzeHTMLContent: exports.analyzeHTMLContent,
    // Brand impersonation
    detectBrandImpersonation: exports.detectBrandImpersonation,
    isTargetingBrand: exports.isTargetingBrand,
    // Scoring
    calculatePhishingScore: exports.calculatePhishingScore,
    validatePhishingDetection: exports.validatePhishingDetection,
    // Email gateway
    createEmailGatewayConfig: exports.createEmailGatewayConfig,
    quarantineEmail: exports.quarantineEmail,
    reportPhishingEmail: exports.reportPhishingEmail,
    // Advanced detection
    detectCredentialHarvesting: exports.detectCredentialHarvesting,
    analyzeSSLCertificate: exports.analyzeSSLCertificate,
    detectRedirectChain: exports.detectRedirectChain,
    analyzeEmailAttachments: exports.analyzeEmailAttachments,
    checkIDNHomograph: exports.checkIDNHomograph,
    analyzeSenderReputation: exports.analyzeSenderReputation,
    detectLookalikeCharacters: exports.detectLookalikeCharacters,
    generatePhishingReport: exports.generatePhishingReport,
    checkDNSRecords: exports.checkDNSRecords,
    analyzeURLParameters: exports.analyzeURLParameters,
    detectSocialEngineering: exports.detectSocialEngineering,
    validateEmailPolicy: exports.validateEmailPolicy,
    calculateConfidenceScore: exports.calculateConfidenceScore,
    createPhishingDetectionService: exports.createPhishingDetectionService,
    exportPhishingIntelligence: exports.exportPhishingIntelligence,
    processEmailGatewayWebhook: exports.processEmailGatewayWebhook,
};
//# sourceMappingURL=phishing-detection-kit.js.map