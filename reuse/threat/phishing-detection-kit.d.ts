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
/**
 * File: /reuse/threat/phishing-detection-kit.ts
 * Locator: WC-THR-PHDK-001
 * Purpose: Comprehensive Phishing Detection Utilities - URL analysis, domain similarity, email headers, brand impersonation
 *
 * Upstream: Independent utility module for phishing threat detection
 * Downstream: ../backend/*, email security services, phishing detection systems
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize, DNS libraries
 * Exports: 43 utility functions for phishing detection, URL analysis, email header parsing, brand protection
 *
 * LLM Context: Comprehensive phishing detection utilities for analyzing URLs, detecting domain similarity,
 * parsing email headers, identifying phishing kits, and protecting against brand impersonation. Provides
 * typosquatting detection, scoring algorithms, and integration with email gateways for healthcare security.
 */
interface URLAnalysisResult {
    url: string;
    domain: string;
    protocol: string;
    path: string;
    queryParams: Record<string, string>;
    fragments: string[];
    isPhishing: boolean;
    riskScore: number;
    indicators: PhishingIndicator[];
}
interface PhishingIndicator {
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    value?: string;
}
interface DomainSimilarity {
    originalDomain: string;
    suspiciousDomain: string;
    similarityScore: number;
    technique: 'typosquatting' | 'homoglyph' | 'combosquatting' | 'subdomain' | 'tld-swap';
    distance: number;
}
interface EmailHeader {
    from: string;
    to: string[];
    subject: string;
    date: Date;
    messageId: string;
    returnPath?: string;
    receivedHeaders: string[];
    spfResult?: 'pass' | 'fail' | 'softfail' | 'neutral' | 'none';
    dkimResult?: 'pass' | 'fail' | 'none';
    dmarcResult?: 'pass' | 'fail' | 'none';
    authenticationResults?: string;
}
interface PhishingKitSignature {
    name: string;
    brand: string;
    patterns: string[];
    fileHashes: string[];
    urlPatterns: string[];
    confidence: number;
}
interface BrandImpersonation {
    targetBrand: string;
    detectedDomain: string;
    impersonationType: 'exact' | 'similar' | 'spoofed' | 'subdomain';
    confidence: number;
    evidence: string[];
}
interface TyposquattingResult {
    originalDomain: string;
    typosquatDomain: string;
    technique: string;
    registered: boolean;
    registrationDate?: Date;
    registrar?: string;
    nameservers?: string[];
}
interface PhishingScore {
    totalScore: number;
    urlScore: number;
    domainScore: number;
    contentScore: number;
    headerScore: number;
    classification: 'safe' | 'suspicious' | 'likely_phishing' | 'confirmed_phishing';
    confidence: number;
}
interface EmailGatewayConfig {
    provider: 'office365' | 'gmail' | 'proofpoint' | 'mimecast' | 'custom';
    apiEndpoint: string;
    apiKey: string;
    webhookUrl?: string;
    enableQuarantine: boolean;
    enableReporting: boolean;
}
interface PhishingReport {
    id: string;
    reportedBy: string;
    emailId: string;
    reportedUrl?: string;
    reportedAt: Date;
    status: 'pending' | 'investigating' | 'confirmed' | 'false_positive';
    analysisResult?: PhishingScore;
}
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
export declare const analyzeURL: (url: string) => URLAnalysisResult;
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
export declare const checkURLBlacklist: (url: string) => Promise<{
    blacklisted: boolean;
    sources: string[];
}>;
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
export declare const extractDomain: (url: string) => string;
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
export declare const extractRootDomain: (url: string) => string;
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
export declare const isURLObfuscated: (url: string) => boolean;
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
export declare const normalizeURL: (url: string) => string;
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
export declare const calculateDomainSimilarity: (domain1: string, domain2: string) => DomainSimilarity;
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
export declare const detectTyposquatting: (domain: string, knownDomains: string[]) => TyposquattingResult[];
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
export declare const generateTyposquattingVariations: (domain: string) => string[];
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
export declare const hasHomoglyphs: (domain1: string, domain2: string) => boolean;
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
export declare const isCombosquatting: (legitimateDomain: string, suspiciousDomain: string) => boolean;
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
export declare const isSubdomainAttack: (legitimateDomain: string, suspiciousDomain: string) => boolean;
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
export declare const isTLDSwap: (domain1: string, domain2: string) => boolean;
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
export declare const parseEmailHeaders: (rawHeaders: string) => EmailHeader;
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
export declare const extractEmailFromHeader: (headerValue: string) => string;
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
export declare const analyzeEmailAuthentication: (headers: EmailHeader) => {
    spfPass: boolean;
    dkimPass: boolean;
    dmarcPass: boolean;
    riskScore: number;
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
export declare const detectHeaderSpoofing: (headers: EmailHeader) => {
    spoofed: boolean;
    indicators: string[];
};
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
export declare const analyzeEmailSubject: (subject: string) => {
    suspicious: boolean;
    score: number;
    patterns: string[];
};
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
export declare const detectPhishingKits: (content: string) => PhishingKitSignature[];
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
export declare const analyzeHTMLContent: (html: string) => {
    score: number;
    indicators: PhishingIndicator[];
};
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
export declare const detectBrandImpersonation: (domain: string, content: string, protectedBrands: string[]) => BrandImpersonation[];
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
export declare const isTargetingBrand: (domain: string, brand: string) => boolean;
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
export declare const calculatePhishingScore: (data: {
    url?: string;
    headers?: EmailHeader;
    content?: string;
    domain?: string;
}) => PhishingScore;
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
export declare const validatePhishingDetection: (score: PhishingScore, domain: string) => {
    isValid: boolean;
    reason?: string;
};
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
export declare const createEmailGatewayConfig: (provider: EmailGatewayConfig["provider"], config: Partial<Omit<EmailGatewayConfig, "provider">>) => EmailGatewayConfig;
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
export declare const quarantineEmail: (emailId: string, config: EmailGatewayConfig) => Promise<boolean>;
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
export declare const reportPhishingEmail: (report: PhishingReport, config: EmailGatewayConfig) => Promise<boolean>;
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
export declare const detectCredentialHarvesting: (html: string) => {
    detected: boolean;
    formCount: number;
    passwordFields: number;
};
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
export declare const analyzeSSLCertificate: (certInfo: {
    issuer?: string;
    validDays?: number;
    isWildcard?: boolean;
    subject?: string;
}) => {
    suspicious: boolean;
    score: number;
    indicators: string[];
};
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
export declare const detectRedirectChain: (redirectChain: string[]) => {
    suspicious: boolean;
    length: number;
    crossDomain: boolean;
};
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
export declare const analyzeEmailAttachments: (attachments: Array<{
    filename: string;
    mimeType: string;
    size: number;
}>) => {
    suspicious: boolean;
    score: number;
    risks: string[];
};
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
export declare const checkIDNHomograph: (url: string) => {
    isIDN: boolean;
    punycode: string;
    suspicious: boolean;
};
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
export declare const analyzeSenderReputation: (senderEmail: string, senderDomain: string) => Promise<{
    reputation: number;
    trustworthy: boolean;
    flags: string[];
}>;
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
export declare const detectLookalikeCharacters: (domain: string) => {
    detected: boolean;
    characters: Array<{
        char: string;
        position: number;
    }>;
};
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
export declare const generatePhishingReport: (score: PhishingScore, url: string, headers?: EmailHeader) => PhishingReport;
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
export declare const checkDNSRecords: (domain: string) => Promise<{
    spf: boolean;
    dkim: boolean;
    dmarc: boolean;
}>;
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
export declare const analyzeURLParameters: (params: Record<string, string>) => {
    suspicious: boolean;
    sensitiveParams: string[];
};
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
export declare const detectSocialEngineering: (content: string) => {
    detected: boolean;
    tactics: string[];
    urgency: number;
};
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
export declare const validateEmailPolicy: (headers: EmailHeader, content: string, policy: {
    allowExternalLinks?: boolean;
    requireEncryption?: boolean;
    blockedDomains?: string[];
}) => {
    compliant: boolean;
    violations: string[];
};
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
export declare const calculateConfidenceScore: (score: PhishingScore, historicalAccuracy?: number) => number;
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
export declare const createPhishingDetectionService: (config: {
    enableRealTime?: boolean;
    scanInterval?: number;
    alertThreshold?: number;
    emailGateway?: EmailGatewayConfig;
}) => object;
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
export declare const exportPhishingIntelligence: (reports: PhishingReport[]) => object;
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
export declare const processEmailGatewayWebhook: (config: EmailGatewayConfig, webhookPayload: object) => Promise<boolean>;
declare const _default: {
    analyzeURL: (url: string) => URLAnalysisResult;
    checkURLBlacklist: (url: string) => Promise<{
        blacklisted: boolean;
        sources: string[];
    }>;
    extractDomain: (url: string) => string;
    extractRootDomain: (url: string) => string;
    isURLObfuscated: (url: string) => boolean;
    normalizeURL: (url: string) => string;
    calculateDomainSimilarity: (domain1: string, domain2: string) => DomainSimilarity;
    detectTyposquatting: (domain: string, knownDomains: string[]) => TyposquattingResult[];
    generateTyposquattingVariations: (domain: string) => string[];
    hasHomoglyphs: (domain1: string, domain2: string) => boolean;
    isCombosquatting: (legitimateDomain: string, suspiciousDomain: string) => boolean;
    isSubdomainAttack: (legitimateDomain: string, suspiciousDomain: string) => boolean;
    isTLDSwap: (domain1: string, domain2: string) => boolean;
    parseEmailHeaders: (rawHeaders: string) => EmailHeader;
    extractEmailFromHeader: (headerValue: string) => string;
    analyzeEmailAuthentication: (headers: EmailHeader) => {
        spfPass: boolean;
        dkimPass: boolean;
        dmarcPass: boolean;
        riskScore: number;
    };
    detectHeaderSpoofing: (headers: EmailHeader) => {
        spoofed: boolean;
        indicators: string[];
    };
    analyzeEmailSubject: (subject: string) => {
        suspicious: boolean;
        score: number;
        patterns: string[];
    };
    detectPhishingKits: (content: string) => PhishingKitSignature[];
    analyzeHTMLContent: (html: string) => {
        score: number;
        indicators: PhishingIndicator[];
    };
    detectBrandImpersonation: (domain: string, content: string, protectedBrands: string[]) => BrandImpersonation[];
    isTargetingBrand: (domain: string, brand: string) => boolean;
    calculatePhishingScore: (data: {
        url?: string;
        headers?: EmailHeader;
        content?: string;
        domain?: string;
    }) => PhishingScore;
    validatePhishingDetection: (score: PhishingScore, domain: string) => {
        isValid: boolean;
        reason?: string;
    };
    createEmailGatewayConfig: (provider: EmailGatewayConfig["provider"], config: Partial<Omit<EmailGatewayConfig, "provider">>) => EmailGatewayConfig;
    quarantineEmail: (emailId: string, config: EmailGatewayConfig) => Promise<boolean>;
    reportPhishingEmail: (report: PhishingReport, config: EmailGatewayConfig) => Promise<boolean>;
    detectCredentialHarvesting: (html: string) => {
        detected: boolean;
        formCount: number;
        passwordFields: number;
    };
    analyzeSSLCertificate: (certInfo: {
        issuer?: string;
        validDays?: number;
        isWildcard?: boolean;
        subject?: string;
    }) => {
        suspicious: boolean;
        score: number;
        indicators: string[];
    };
    detectRedirectChain: (redirectChain: string[]) => {
        suspicious: boolean;
        length: number;
        crossDomain: boolean;
    };
    analyzeEmailAttachments: (attachments: Array<{
        filename: string;
        mimeType: string;
        size: number;
    }>) => {
        suspicious: boolean;
        score: number;
        risks: string[];
    };
    checkIDNHomograph: (url: string) => {
        isIDN: boolean;
        punycode: string;
        suspicious: boolean;
    };
    analyzeSenderReputation: (senderEmail: string, senderDomain: string) => Promise<{
        reputation: number;
        trustworthy: boolean;
        flags: string[];
    }>;
    detectLookalikeCharacters: (domain: string) => {
        detected: boolean;
        characters: Array<{
            char: string;
            position: number;
        }>;
    };
    generatePhishingReport: (score: PhishingScore, url: string, headers?: EmailHeader) => PhishingReport;
    checkDNSRecords: (domain: string) => Promise<{
        spf: boolean;
        dkim: boolean;
        dmarc: boolean;
    }>;
    analyzeURLParameters: (params: Record<string, string>) => {
        suspicious: boolean;
        sensitiveParams: string[];
    };
    detectSocialEngineering: (content: string) => {
        detected: boolean;
        tactics: string[];
        urgency: number;
    };
    validateEmailPolicy: (headers: EmailHeader, content: string, policy: {
        allowExternalLinks?: boolean;
        requireEncryption?: boolean;
        blockedDomains?: string[];
    }) => {
        compliant: boolean;
        violations: string[];
    };
    calculateConfidenceScore: (score: PhishingScore, historicalAccuracy?: number) => number;
    createPhishingDetectionService: (config: {
        enableRealTime?: boolean;
        scanInterval?: number;
        alertThreshold?: number;
        emailGateway?: EmailGatewayConfig;
    }) => object;
    exportPhishingIntelligence: (reports: PhishingReport[]) => object;
    processEmailGatewayWebhook: (config: EmailGatewayConfig, webhookPayload: object) => Promise<boolean>;
};
export default _default;
//# sourceMappingURL=phishing-detection-kit.d.ts.map