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

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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
export const analyzeURL = (url: string): URLAnalysisResult => {
  const indicators: PhishingIndicator[] = [];
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
    const queryParams: Record<string, string> = {};
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
  } catch (error) {
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
export const checkURLBlacklist = async (
  url: string,
): Promise<{ blacklisted: boolean; sources: string[] }> => {
  // In production, would check against PhishTank, OpenPhish, etc.
  return {
    blacklisted: false,
    sources: [],
  };
};

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
export const extractDomain = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return '';
  }
};

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
export const extractRootDomain = (url: string): string => {
  try {
    const domain = extractDomain(url);
    const parts = domain.split('.');
    if (parts.length >= 2) {
      return parts.slice(-2).join('.');
    }
    return domain;
  } catch {
    return '';
  }
};

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
export const isURLObfuscated = (url: string): boolean => {
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
export const normalizeURL = (url: string): string => {
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
  } catch {
    return url;
  }
};

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
export const calculateDomainSimilarity = (domain1: string, domain2: string): DomainSimilarity => {
  const d1 = domain1.toLowerCase().replace(/^www\./, '');
  const d2 = domain2.toLowerCase().replace(/^www\./, '');

  // Calculate Levenshtein distance
  const distance = calculateLevenshteinDistance(d1, d2);
  const maxLength = Math.max(d1.length, d2.length);
  const similarityScore = 1 - distance / maxLength;

  // Determine technique
  let technique: DomainSimilarity['technique'] = 'typosquatting';

  if (hasHomoglyphs(d1, d2)) {
    technique = 'homoglyph';
  } else if (isCombosquatting(d1, d2)) {
    technique = 'combosquatting';
  } else if (isSubdomainAttack(d1, d2)) {
    technique = 'subdomain';
  } else if (isTLDSwap(d1, d2)) {
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
export const detectTyposquatting = (
  domain: string,
  knownDomains: string[],
): TyposquattingResult[] => {
  const results: TyposquattingResult[] = [];

  knownDomains.forEach((knownDomain) => {
    const similarity = calculateDomainSimilarity(knownDomain, domain);

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
export const generateTyposquattingVariations = (domain: string): string[] => {
  const variations: Set<string> = new Set();
  const [name, tld] = domain.split('.');

  // Character omission
  for (let i = 0; i < name.length; i++) {
    variations.add(name.slice(0, i) + name.slice(i + 1) + '.' + tld);
  }

  // Character substitution (common typos)
  const substitutions: Record<string, string[]> = {
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
export const hasHomoglyphs = (domain1: string, domain2: string): boolean => {
  const homoglyphMap: Record<string, string[]> = {
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
export const isCombosquatting = (legitimateDomain: string, suspiciousDomain: string): boolean => {
  const legitName = legitimateDomain.split('.')[0].toLowerCase();
  const suspName = suspiciousDomain.toLowerCase();

  // Check if legitimate domain name is contained in suspicious domain with additions
  return suspName.includes(legitName) && suspName !== legitimateDomain.toLowerCase();
};

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
export const isSubdomainAttack = (legitimateDomain: string, suspiciousDomain: string): boolean => {
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
export const isTLDSwap = (domain1: string, domain2: string): boolean => {
  const parts1 = domain1.split('.');
  const parts2 = domain2.split('.');

  if (parts1.length !== parts2.length) return false;

  const name1 = parts1.slice(0, -1).join('.');
  const name2 = parts2.slice(0, -1).join('.');
  const tld1 = parts1[parts1.length - 1];
  const tld2 = parts2[parts2.length - 1];

  return name1 === name2 && tld1 !== tld2;
};

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
export const parseEmailHeaders = (rawHeaders: string): EmailHeader => {
  const lines = rawHeaders.split('\n');
  const headers: EmailHeader = {
    from: '',
    to: [],
    subject: '',
    date: new Date(),
    messageId: '',
    receivedHeaders: [],
  };

  lines.forEach((line) => {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) return;

    const key = line.substring(0, colonIndex).toLowerCase().trim();
    const value = line.substring(colonIndex + 1).trim();

    switch (key) {
      case 'from':
        headers.from = extractEmailFromHeader(value);
        break;
      case 'to':
        headers.to = value.split(',').map((email) => extractEmailFromHeader(email.trim()));
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
        headers.returnPath = extractEmailFromHeader(value);
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
export const extractEmailFromHeader = (headerValue: string): string => {
  const match = headerValue.match(/<([^>]+)>/);
  if (match) {
    return match[1];
  }
  return headerValue.trim();
};

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
export const analyzeEmailAuthentication = (
  headers: EmailHeader,
): { spfPass: boolean; dkimPass: boolean; dmarcPass: boolean; riskScore: number } => {
  const spfPass = headers.spfResult === 'pass';
  const dkimPass = headers.dkimResult === 'pass';
  const dmarcPass = headers.dmarcResult === 'pass';

  let riskScore = 0;

  if (!spfPass) riskScore += 30;
  if (!dkimPass) riskScore += 30;
  if (!dmarcPass) riskScore += 40;

  return {
    spfPass,
    dkimPass,
    dmarcPass,
    riskScore: Math.min(100, riskScore),
  };
};

/**
 * Parses authentication results header.
 *
 * @param {string} authResults - Authentication results header value
 * @param {EmailHeader} headers - Email header object to update
 */
const parseAuthenticationResults = (authResults: string, headers: EmailHeader): void => {
  if (authResults.includes('spf=pass')) {
    headers.spfResult = 'pass';
  } else if (authResults.includes('spf=fail')) {
    headers.spfResult = 'fail';
  }

  if (authResults.includes('dkim=pass')) {
    headers.dkimResult = 'pass';
  } else if (authResults.includes('dkim=fail')) {
    headers.dkimResult = 'fail';
  }

  if (authResults.includes('dmarc=pass')) {
    headers.dmarcResult = 'pass';
  } else if (authResults.includes('dmarc=fail')) {
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
export const detectHeaderSpoofing = (
  headers: EmailHeader,
): { spoofed: boolean; indicators: string[] } => {
  const indicators: string[] = [];

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
export const analyzeEmailSubject = (
  subject: string,
): { suspicious: boolean; score: number; patterns: string[] } => {
  const patterns: string[] = [];
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
export const detectPhishingKits = (content: string): PhishingKitSignature[] => {
  const detectedKits: PhishingKitSignature[] = [];

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
export const analyzeHTMLContent = (html: string): { score: number; indicators: PhishingIndicator[] } => {
  const indicators: PhishingIndicator[] = [];
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
export const detectBrandImpersonation = (
  domain: string,
  content: string,
  protectedBrands: string[],
): BrandImpersonation[] => {
  const impersonations: BrandImpersonation[] = [];

  protectedBrands.forEach((brand) => {
    const brandLower = brand.toLowerCase();
    const domainLower = domain.toLowerCase();
    const contentLower = content.toLowerCase();

    const evidence: string[] = [];
    let confidence = 0;

    // Check domain similarity
    if (domainLower.includes(brandLower)) {
      evidence.push('brand_name_in_domain');
      confidence += 40;
    }

    // Check for typosquatting
    const brandDomain = `${brandLower}.com`;
    const similarity = calculateDomainSimilarity(brandDomain, domain);
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
export const isTargetingBrand = (domain: string, brand: string): boolean => {
  const domainLower = domain.toLowerCase();
  const brandLower = brand.toLowerCase();

  return domainLower.includes(brandLower);
};

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
export const calculatePhishingScore = (data: {
  url?: string;
  headers?: EmailHeader;
  content?: string;
  domain?: string;
}): PhishingScore => {
  let urlScore = 0;
  let domainScore = 0;
  let contentScore = 0;
  let headerScore = 0;

  // URL analysis
  if (data.url) {
    const urlAnalysis = analyzeURL(data.url);
    urlScore = urlAnalysis.riskScore;
  }

  // Domain analysis
  if (data.domain) {
    // Check against known legitimate domains
    const knownBrands = ['paypal.com', 'microsoft.com', 'google.com', 'amazon.com'];
    const typosquatting = detectTyposquatting(data.domain, knownBrands);
    domainScore = typosquatting.length > 0 ? 70 : 0;
  }

  // Content analysis
  if (data.content) {
    const contentAnalysis = analyzeHTMLContent(data.content);
    contentScore = contentAnalysis.score;
  }

  // Header analysis
  if (data.headers) {
    const authAnalysis = analyzeEmailAuthentication(data.headers);
    headerScore = authAnalysis.riskScore;
  }

  // Calculate weighted total
  const weights = {
    url: 0.25,
    domain: 0.3,
    content: 0.25,
    header: 0.2,
  };

  const totalScore =
    urlScore * weights.url +
    domainScore * weights.domain +
    contentScore * weights.content +
    headerScore * weights.header;

  // Classify based on score
  let classification: PhishingScore['classification'];
  let confidence: number;

  if (totalScore >= 75) {
    classification = 'confirmed_phishing';
    confidence = 0.9;
  } else if (totalScore >= 50) {
    classification = 'likely_phishing';
    confidence = 0.75;
  } else if (totalScore >= 25) {
    classification = 'suspicious';
    confidence = 0.5;
  } else {
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
export const validatePhishingDetection = (
  score: PhishingScore,
  domain: string,
): { isValid: boolean; reason?: string } => {
  // Whitelist of known safe domains
  const whitelist = ['google.com', 'microsoft.com', 'apple.com'];

  const rootDomain = extractRootDomain(`https://${domain}`);
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
export const createEmailGatewayConfig = (
  provider: EmailGatewayConfig['provider'],
  config: Partial<Omit<EmailGatewayConfig, 'provider'>>,
): EmailGatewayConfig => {
  return {
    provider,
    apiEndpoint: config.apiEndpoint || '',
    apiKey: config.apiKey || '',
    webhookUrl: config.webhookUrl,
    enableQuarantine: config.enableQuarantine ?? true,
    enableReporting: config.enableReporting ?? true,
  };
};

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
export const quarantineEmail = async (
  emailId: string,
  config: EmailGatewayConfig,
): Promise<boolean> => {
  // In production, would call actual gateway API
  return true;
};

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
export const reportPhishingEmail = async (
  report: PhishingReport,
  config: EmailGatewayConfig,
): Promise<boolean> => {
  // In production, would submit to gateway and threat feeds
  return true;
};

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
const calculateLevenshteinDistance = (str1: string, str2: string): number => {
  const matrix: number[][] = [];

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
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1,
        );
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
export const detectCredentialHarvesting = (
  html: string,
): { detected: boolean; formCount: number; passwordFields: number } => {
  const formMatches = html.match(/<form[^>]*>/gi) || [];
  const passwordMatches = html.match(/type=["']password["']/gi) || [];

  return {
    detected: formMatches.length > 0 && passwordMatches.length > 0,
    formCount: formMatches.length,
    passwordFields: passwordMatches.length,
  };
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
export const analyzeSSLCertificate = (certInfo: {
  issuer?: string;
  validDays?: number;
  isWildcard?: boolean;
  subject?: string;
}): { suspicious: boolean; score: number; indicators: string[] } => {
  const indicators: string[] = [];
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
export const detectRedirectChain = (
  redirectChain: string[],
): { suspicious: boolean; length: number; crossDomain: boolean } => {
  const domains = redirectChain.map((url) => extractDomain(url));
  const uniqueDomains = new Set(domains);
  const crossDomain = uniqueDomains.size > 1;

  return {
    suspicious: redirectChain.length > 3 || crossDomain,
    length: redirectChain.length,
    crossDomain,
  };
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
export const analyzeEmailAttachments = (
  attachments: Array<{ filename: string; mimeType: string; size: number }>,
): { suspicious: boolean; score: number; risks: string[] } => {
  const risks: string[] = [];
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
export const checkIDNHomograph = (
  url: string,
): { isIDN: boolean; punycode: string; suspicious: boolean } => {
  const domain = extractDomain(url);
  const isIDN = domain.includes('xn--');

  return {
    isIDN,
    punycode: isIDN ? domain : '',
    suspicious: isIDN,
  };
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
export const analyzeSenderReputation = async (
  senderEmail: string,
  senderDomain: string,
): Promise<{ reputation: number; trustworthy: boolean; flags: string[] }> => {
  // In production, would check against reputation databases
  const flags: string[] = [];
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
export const detectLookalikeCharacters = (
  domain: string,
): { detected: boolean; characters: Array<{ char: string; position: number }> } => {
  const lookalikeChars = ['а', 'е', 'і', 'о', 'р', 'с', 'х', 'ѕ'];
  const detected: Array<{ char: string; position: number }> = [];

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
export const generatePhishingReport = (
  score: PhishingScore,
  url: string,
  headers?: EmailHeader,
): PhishingReport => {
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
export const checkDNSRecords = async (
  domain: string,
): Promise<{ spf: boolean; dkim: boolean; dmarc: boolean }> => {
  // In production, would actually query DNS
  return {
    spf: false,
    dkim: false,
    dmarc: false,
  };
};

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
export const analyzeURLParameters = (
  params: Record<string, string>,
): { suspicious: boolean; sensitiveParams: string[] } => {
  const suspiciousParamNames = [
    'redirect', 'url', 'goto', 'return', 'next', 'callback',
    'token', 'auth', 'session', 'password', 'user',
  ];

  const sensitiveParams = Object.keys(params).filter((key) =>
    suspiciousParamNames.includes(key.toLowerCase()),
  );

  return {
    suspicious: sensitiveParams.length > 0,
    sensitiveParams,
  };
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
export const detectSocialEngineering = (
  content: string,
): { detected: boolean; tactics: string[]; urgency: number } => {
  const tactics: string[] = [];
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
export const validateEmailPolicy = (
  headers: EmailHeader,
  content: string,
  policy: { allowExternalLinks?: boolean; requireEncryption?: boolean; blockedDomains?: string[] },
): { compliant: boolean; violations: string[] } => {
  const violations: string[] = [];

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
export const calculateConfidenceScore = (
  score: PhishingScore,
  historicalAccuracy: number = 0.85,
): number => {
  let confidence = 0.5;

  // Boost confidence based on total score
  if (score.totalScore >= 80) {
    confidence = 0.95;
  } else if (score.totalScore >= 60) {
    confidence = 0.85;
  } else if (score.totalScore >= 40) {
    confidence = 0.7;
  } else if (score.totalScore <= 20) {
    confidence = 0.9; // High confidence it's NOT phishing
  }

  // Adjust based on historical accuracy
  confidence *= historicalAccuracy;

  return Math.max(0, Math.min(1, confidence));
};

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
export const createPhishingDetectionService = (config: {
  enableRealTime?: boolean;
  scanInterval?: number;
  alertThreshold?: number;
  emailGateway?: EmailGatewayConfig;
}): object => {
  return {
    enabled: true,
    realTime: config.enableRealTime ?? true,
    scanInterval: config.scanInterval ?? 60000,
    alertThreshold: config.alertThreshold ?? 70,
    emailGateway: config.emailGateway,
    createdAt: new Date(),
  };
};

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
export const exportPhishingIntelligence = (reports: PhishingReport[]): object => {
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
export const processEmailGatewayWebhook = async (
  config: EmailGatewayConfig,
  webhookPayload: object,
): Promise<boolean> => {
  // In production, would process actual webhook
  return true;
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // URL analysis
  analyzeURL,
  checkURLBlacklist,
  extractDomain,
  extractRootDomain,
  isURLObfuscated,
  normalizeURL,

  // Domain similarity
  calculateDomainSimilarity,
  detectTyposquatting,
  generateTyposquattingVariations,
  hasHomoglyphs,
  isCombosquatting,
  isSubdomainAttack,
  isTLDSwap,

  // Email headers
  parseEmailHeaders,
  extractEmailFromHeader,
  analyzeEmailAuthentication,
  detectHeaderSpoofing,
  analyzeEmailSubject,

  // Phishing kits
  detectPhishingKits,
  analyzeHTMLContent,

  // Brand impersonation
  detectBrandImpersonation,
  isTargetingBrand,

  // Scoring
  calculatePhishingScore,
  validatePhishingDetection,

  // Email gateway
  createEmailGatewayConfig,
  quarantineEmail,
  reportPhishingEmail,

  // Advanced detection
  detectCredentialHarvesting,
  analyzeSSLCertificate,
  detectRedirectChain,
  analyzeEmailAttachments,
  checkIDNHomograph,
  analyzeSenderReputation,
  detectLookalikeCharacters,
  generatePhishingReport,
  checkDNSRecords,
  analyzeURLParameters,
  detectSocialEngineering,
  validateEmailPolicy,
  calculateConfidenceScore,
  createPhishingDetectionService,
  exportPhishingIntelligence,
  processEmailGatewayWebhook,
};
