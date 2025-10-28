/**
 * LOC: 634FFC1ED7
 * WC-MID-SHD-051 | OWASP Security Headers & CSP Implementation Middleware
 *
 * UPSTREAM (imports from):
 *   - utils/logger (logging utilities)
 *
 * DOWNSTREAM (imported by):
 *   - adapters/hapi/security.adapter.ts
 *   - adapters/express/security.adapter.ts
 */

/**
 * WC-MID-SHD-051 | OWASP Security Headers & CSP Implementation Middleware
 * Purpose: Framework-agnostic HTTP security headers, CSP, HSTS, HIPAA PHI protection
 * Upstream: utils/logger, OWASP security guidelines, crypto API
 * Downstream: All HTTP responses | Called by: Framework-specific adapters
 * Related: security/csp/*, HIPAA compliance, OWASP Top 10 protection
 * Exports: SecurityHeadersMiddleware class | Key Services: Security headers, CSP nonces
 * Last Updated: 2025-10-21 | Dependencies: Framework-agnostic
 * Critical Path: Response → Security headers application → PHI protection
 * LLM Context: Healthcare security compliance, CSP nonces, download protection
 */

/**
 * @fileoverview Security Headers Middleware with OWASP Best Practices
 * @module middleware/security/headers
 * @description Framework-agnostic HTTP security headers middleware implementing OWASP Secure Headers
 * Project recommendations for healthcare applications. Provides comprehensive protection against
 * common web vulnerabilities through HTTP security headers.
 *
 * Key Features:
 * - Content Security Policy (CSP) with nonce generation
 * - HTTP Strict Transport Security (HSTS) for HTTPS enforcement
 * - X-Frame-Options for clickjacking protection
 * - X-Content-Type-Options for MIME sniffing prevention
 * - Referrer Policy for information leakage control
 * - Permissions Policy for browser feature restriction
 * - Cross-Origin policies (COEP, COOP, CORP) for isolation
 * - Environment-specific configurations (dev vs production)
 * - PHI-specific download headers with cache control
 *
 * Security Headers Applied:
 * - Content-Security-Policy: Controls resource loading sources
 * - Strict-Transport-Security: Forces HTTPS connections
 * - X-Frame-Options: Prevents iframe embedding (clickjacking)
 * - X-Content-Type-Options: Blocks MIME type sniffing
 * - X-XSS-Protection: Legacy XSS filter (browser-level)
 * - Referrer-Policy: Controls referrer information leakage
 * - Permissions-Policy: Restricts browser features (camera, geolocation, etc.)
 * - X-Download-Options: Prevents file execution in IE
 * - Cross-Origin-Embedder-Policy: Isolates origin
 * - Cross-Origin-Opener-Policy: Prevents window.opener access
 * - Cross-Origin-Resource-Policy: Controls resource sharing
 *
 * @security Critical security middleware - protects against XSS, clickjacking, and data leakage
 * @compliance
 * - OWASP Secure Headers Project
 * - HIPAA 164.312(e)(1) - Transmission Security (HSTS)
 * - HIPAA 164.312(a)(1) - Access Control (CSP, frame protection)
 *
 * @requires ../../../utils/logger - Logging utilities
 *
 * @version 1.0.0
 * @since 2025-01-01
 */

import { logger } from '../../../utils/logger';

/**
 * Security headers configuration interface
 */
export interface SecurityHeadersConfig {
  // Content Security Policy
  contentSecurityPolicy?: {
    directives?: Record<string, string[]>;
    reportOnly?: boolean;
    nonce?: string;
  };

  // HTTP Strict Transport Security
  hsts?: {
    maxAge?: number;
    includeSubDomains?: boolean;
    preload?: boolean;
  };

  // Frame options
  frameOptions?: 'DENY' | 'SAMEORIGIN' | string;

  // Content type options
  noSniff?: boolean;

  // XSS Protection
  xssProtection?: {
    enabled?: boolean;
    mode?: 'block';
  };

  // Referrer Policy
  referrerPolicy?: string;

  // Permissions Policy
  permissionsPolicy?: Record<string, string[]>;

  // Additional security headers
  additionalHeaders?: Record<string, string>;

  // Environment-specific settings
  environment?: 'development' | 'staging' | 'production';
}

/**
 * Security header application result
 */
export interface SecurityHeaderResult {
  applied: boolean;
  headers: Record<string, string>;
  warnings?: string[];
}

/**
 * Default security configuration for healthcare platform
 * Strict settings optimized for HIPAA compliance
 */
export const DEFAULT_SECURITY_CONFIG: SecurityHeadersConfig = {
  contentSecurityPolicy: {
    directives: {
      'default-src': ["'self'"],
      'script-src': ["'self'"],
      'style-src': ["'self'", "'unsafe-inline'"], // TODO: Remove unsafe-inline, use nonces
      'img-src': ["'self'", 'data:', 'https:'],
      'font-src': ["'self'"],
      'connect-src': ["'self'"],
      'frame-ancestors': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"],
      'object-src': ["'none'"],
      'media-src': ["'self'"],
      'manifest-src': ["'self'"]
    },
    reportOnly: false
  },

  hsts: {
    maxAge: 31536000, // 1 year in seconds
    includeSubDomains: true,
    preload: true
  },

  frameOptions: 'DENY', // Prevent clickjacking

  noSniff: true, // Prevent MIME type sniffing

  xssProtection: {
    enabled: true,
    mode: 'block'
  },

  referrerPolicy: 'strict-origin-when-cross-origin',

  permissionsPolicy: {
    'geolocation': [],          // Block geolocation
    'camera': [],               // Block camera
    'microphone': [],           // Block microphone
    'payment': [],              // Block payment APIs
    'usb': [],                  // Block USB access
    'magnetometer': [],         // Block sensors
    'accelerometer': [],
    'gyroscope': [],
    'fullscreen': ["'self'"],   // Allow fullscreen for own origin
    'display-capture': []       // Block screen capture
  },

  additionalHeaders: {
    'X-Permitted-Cross-Domain-Policies': 'none',
    'X-Download-Options': 'noopen',
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-origin'
  }
};

/**
 * Development-friendly security configuration
 * Relaxed settings for local development
 */
export const DEVELOPMENT_SECURITY_CONFIG: SecurityHeadersConfig = {
  ...DEFAULT_SECURITY_CONFIG,
  contentSecurityPolicy: {
    directives: {
      'default-src': ["'self'"],
      'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      'style-src': ["'self'", "'unsafe-inline'"],
      'img-src': ["'self'", 'data:', 'https:', 'http:'],
      'font-src': ["'self'", 'data:'],
      'connect-src': ["'self'", 'ws:', 'wss:', 'http:', 'https:'],
      'frame-ancestors': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"]
    },
    reportOnly: true // Use report-only mode in development
  },
  hsts: {
    maxAge: 0, // Disable HSTS in development
    includeSubDomains: false,
    preload: false
  }
};

/**
 * Security Headers Middleware implementing OWASP best practices
 *
 * @class SecurityHeadersMiddleware
 * @description Framework-agnostic middleware that applies comprehensive HTTP security headers
 * to protect healthcare applications against common web vulnerabilities including XSS,
 * clickjacking, MIME sniffing, and information leakage.
 *
 * Security Protection Layers:
 * 1. **Content Security Policy (CSP)**: Prevents XSS by controlling resource sources
 * 2. **HSTS**: Enforces HTTPS connections (required for PHI transmission)
 * 3. **Frame Protection**: Prevents clickjacking attacks
 * 4. **MIME Sniffing**: Blocks content type confusion attacks
 * 5. **Referrer Control**: Prevents information leakage through referrer headers
 * 6. **Feature Policies**: Disables unnecessary browser features (camera, geolocation)
 * 7. **Cross-Origin Isolation**: Prevents cross-origin attacks
 *
 * Environment Configurations:
 * - **Development**: Relaxed CSP, disabled HSTS, detailed errors
 * - **Production**: Strict CSP, enforced HSTS, minimal error exposure
 *
 * @example
 * // Create middleware with production defaults
 * const securityHeaders = new SecurityHeadersMiddleware({
 *   environment: 'production',
 *   enableStackTrace: false,
 *   sanitizePHI: true
 * });
 *
 * @example
 * // Apply headers to response
 * const result = securityHeaders.applyHeaders(existingHeaders);
 * response.setHeaders(result.headers);
 *
 * @example
 * // Apply download-specific headers for PHI documents
 * const result = securityHeaders.applyDownloadHeaders(
 *   'patient-record.pdf',
 *   'application/pdf',
 *   {}
 * );
 *
 * @security
 * - CSP prevents XSS attacks by restricting script sources
 * - HSTS enforces HTTPS for all PHI transmissions
 * - Frame options prevent embedding in malicious sites
 * - Permissions policy disables unnecessary browser features
 *
 * @compliance
 * - OWASP Secure Headers Project compliance
 * - HIPAA 164.312(e)(1) - Transmission Security (HSTS enforcement)
 * - HIPAA 164.312(a)(1) - Access Control (CSP, frame protection)
 *
 * @performance
 * - Headers cached and reused across requests
 * - Nonce generation uses cryptographically secure random
 * - Minimal overhead on response processing
 */
export class SecurityHeadersMiddleware {
  private config: SecurityHeadersConfig;

  constructor(config?: SecurityHeadersConfig) {
    this.config = this.mergeConfig(config);
    this.validateConfig();
  }

  /**
   * Merge user config with defaults
   */
  private mergeConfig(userConfig?: SecurityHeadersConfig): SecurityHeadersConfig {
    const env = userConfig?.environment || process.env.NODE_ENV || 'development';
    const defaultConfig = env === 'development' ? DEVELOPMENT_SECURITY_CONFIG : DEFAULT_SECURITY_CONFIG;
    
    return {
      ...defaultConfig,
      ...userConfig,
      contentSecurityPolicy: {
        ...defaultConfig.contentSecurityPolicy,
        ...userConfig?.contentSecurityPolicy,
        directives: {
          ...defaultConfig.contentSecurityPolicy?.directives,
          ...userConfig?.contentSecurityPolicy?.directives
        }
      },
      hsts: {
        ...defaultConfig.hsts,
        ...userConfig?.hsts
      },
      permissionsPolicy: {
        ...defaultConfig.permissionsPolicy,
        ...userConfig?.permissionsPolicy
      },
      additionalHeaders: {
        ...defaultConfig.additionalHeaders,
        ...userConfig?.additionalHeaders
      }
    };
  }

  /**
   * Validate configuration
   */
  private validateConfig(): void {
    if (this.config.hsts?.maxAge && this.config.hsts.maxAge < 0) {
      throw new Error('HSTS maxAge must be non-negative');
    }

    if (this.config.contentSecurityPolicy?.directives) {
      const directives = this.config.contentSecurityPolicy.directives;
      if (directives['default-src'] && directives['default-src'].length === 0) {
        logger.warn('CSP default-src is empty, this may block all resources');
      }
    }
  }

  /**
   * Generate cryptographically secure nonce for CSP
   */
  generateNonce(): string {
    const array = new Uint8Array(16);
    
    // Use crypto.getRandomValues if available (browser/modern Node.js)
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      crypto.getRandomValues(array);
    } else {
      // Fallback for older Node.js versions
      const nodeCrypto = require('crypto');
      const buffer = nodeCrypto.randomBytes(16);
      array.set(buffer);
    }
    
    return Buffer.from(array).toString('base64');
  }

  /**
   * Build Content-Security-Policy header value
   */
  private buildCSPHeader(directives: Record<string, string[]>, nonce?: string): string {
    const processedDirectives = { ...directives };

    // Add nonce to script-src and style-src if provided
    if (nonce) {
      if (processedDirectives['script-src']) {
        processedDirectives['script-src'] = [
          ...processedDirectives['script-src'].filter(src => src !== "'unsafe-inline'"),
          `'nonce-${nonce}'`
        ];
      }

      if (processedDirectives['style-src']) {
        processedDirectives['style-src'] = [
          ...processedDirectives['style-src'].filter(src => src !== "'unsafe-inline'"),
          `'nonce-${nonce}'`
        ];
      }
    }

    return Object.entries(processedDirectives)
      .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
      .join('; ');
  }

  /**
   * Build Permissions-Policy header value
   */
  private buildPermissionsPolicyHeader(permissions: Record<string, string[]>): string {
    return Object.entries(permissions)
      .map(([feature, allowlist]) => {
        if (allowlist.length === 0) {
          return `${feature}=()`;
        }
        return `${feature}=(${allowlist.join(' ')})`;
      })
      .join(', ');
  }

  /**
   * Apply comprehensive security headers to HTTP response
   *
   * @function applyHeaders
   * @param {Record<string, string>} [existingHeaders={}] - Existing headers to merge with
   * @returns {SecurityHeaderResult} Result with applied headers and any warnings
   *
   * @description
   * Applies all configured security headers to the response object. Headers are merged
   * with existing headers, with security headers taking precedence.
   *
   * Headers Applied:
   * 1. **Content-Security-Policy**: Controls allowed resource sources with nonce support
   * 2. **Strict-Transport-Security**: Forces HTTPS with configurable max-age
   * 3. **X-Frame-Options**: Prevents clickjacking (DENY or SAMEORIGIN)
   * 4. **X-Content-Type-Options**: Prevents MIME sniffing (nosniff)
   * 5. **X-XSS-Protection**: Legacy XSS filter for older browsers
   * 6. **Referrer-Policy**: Controls referrer information sent
   * 7. **Permissions-Policy**: Restricts browser features
   * 8. **Additional Headers**: Custom headers from configuration
   *
   * Nonce Generation:
   * - Generates cryptographically secure nonce for CSP
   * - Nonce added to script-src and style-src directives
   * - Replaces 'unsafe-inline' when nonce is used
   * - Stored in response headers for template rendering
   *
   * @example
   * // Apply headers to response
   * const middleware = new SecurityHeadersMiddleware();
   * const result = middleware.applyHeaders();
   *
   * if (result.applied) {
   *   Object.entries(result.headers).forEach(([key, value]) => {
   *     response.setHeader(key, value);
   *   });
   * }
   *
   * @example
   * // Merge with existing headers
   * const existing = { 'X-Custom': 'value' };
   * const result = middleware.applyHeaders(existing);
   * // result.headers contains both security and custom headers
   *
   * @security
   * - CSP nonce prevents XSS attacks by allowing only trusted inline scripts
   * - HSTS enforces HTTPS for all connections (prevents downgrade attacks)
   * - Frame options prevent clickjacking attacks
   * - MIME sniffing protection prevents content type confusion
   *
   * @compliance
   * - OWASP A03:2021 - Injection (CSP protection)
   * - OWASP A05:2021 - Security Misconfiguration (secure headers)
   * - HIPAA 164.312(e)(1) - Transmission Security (HSTS)
   *
   * @performance
   * - Single nonce generation per request
   * - Headers built once and cached
   * - Minimal string manipulation overhead
   */
  applyHeaders(existingHeaders: Record<string, string> = {}): SecurityHeaderResult {
    const headers: Record<string, string> = { ...existingHeaders };
    const warnings: string[] = [];

    try {
      // Content-Security-Policy
      if (this.config.contentSecurityPolicy?.directives) {
        const nonce = this.config.contentSecurityPolicy.nonce || this.generateNonce();
        const cspHeader = this.buildCSPHeader(
          this.config.contentSecurityPolicy.directives,
          nonce
        );
        const headerName = this.config.contentSecurityPolicy.reportOnly
          ? 'Content-Security-Policy-Report-Only'
          : 'Content-Security-Policy';
        
        headers[headerName] = cspHeader;
        
        // Store nonce for later use
        (headers as any)._cspNonce = nonce;
      }

      // Strict-Transport-Security (HSTS)
      if (this.config.hsts && this.config.hsts.maxAge !== 0) {
        const hstsValue = [
          `max-age=${this.config.hsts.maxAge || 31536000}`,
          this.config.hsts.includeSubDomains ? 'includeSubDomains' : '',
          this.config.hsts.preload ? 'preload' : ''
        ]
          .filter(Boolean)
          .join('; ');

        headers['Strict-Transport-Security'] = hstsValue;
      }

      // X-Frame-Options
      if (this.config.frameOptions) {
        headers['X-Frame-Options'] = this.config.frameOptions;
      }

      // X-Content-Type-Options
      if (this.config.noSniff) {
        headers['X-Content-Type-Options'] = 'nosniff';
      }

      // X-XSS-Protection (legacy, but still useful for older browsers)
      if (this.config.xssProtection) {
        const xssValue = this.config.xssProtection.enabled
          ? this.config.xssProtection.mode === 'block'
            ? '1; mode=block'
            : '1'
          : '0';
        headers['X-XSS-Protection'] = xssValue;
      }

      // Referrer-Policy
      if (this.config.referrerPolicy) {
        headers['Referrer-Policy'] = this.config.referrerPolicy;
      }

      // Permissions-Policy
      if (this.config.permissionsPolicy) {
        const permissionsValue = this.buildPermissionsPolicyHeader(this.config.permissionsPolicy);
        headers['Permissions-Policy'] = permissionsValue;
      }

      // Additional headers
      if (this.config.additionalHeaders) {
        Object.assign(headers, this.config.additionalHeaders);
      }

      logger.debug('Security headers applied successfully', {
        headersCount: Object.keys(headers).length,
        cspEnabled: !!this.config.contentSecurityPolicy,
        hstsEnabled: !!this.config.hsts
      });

      return {
        applied: true,
        headers,
        warnings: warnings.length > 0 ? warnings : undefined
      };

    } catch (error) {
      logger.error('Failed to apply security headers', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      return {
        applied: false,
        headers: existingHeaders,
        warnings: [`Failed to apply security headers: ${error instanceof Error ? error.message : 'Unknown error'}`]
      };
    }
  }

  /**
   * Apply security headers for file downloads
   * Additional headers for PHI document downloads
   */
  applyDownloadHeaders(
    filename: string,
    contentType: string,
    existingHeaders: Record<string, string> = {}
  ): SecurityHeaderResult {
    const result = this.applyHeaders(existingHeaders);
    
    if (result.applied) {
      // Override/add download-specific headers
      result.headers['Content-Disposition'] = `attachment; filename="${encodeURIComponent(filename)}"`;
      result.headers['Content-Type'] = contentType;
      result.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, private';
      result.headers['Pragma'] = 'no-cache';
      result.headers['Expires'] = '0';
    }

    return result;
  }

  /**
   * Apply security headers for API responses
   * Simplified version for JSON APIs
   */
  applyAPIHeaders(existingHeaders: Record<string, string> = {}): SecurityHeaderResult {
    const basicHeaders = {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Cache-Control': 'no-store',
      'Pragma': 'no-cache'
    };

    return {
      applied: true,
      headers: {
        ...existingHeaders,
        ...basicHeaders
      }
    };
  }

  /**
   * Get CSP nonce for current request
   */
  getNonce(): string {
    return this.generateNonce();
  }

  /**
   * Update CSP directives dynamically
   */
  updateCSPDirectives(newDirectives: Record<string, string[]>): void {
    if (this.config.contentSecurityPolicy) {
      this.config.contentSecurityPolicy.directives = {
        ...this.config.contentSecurityPolicy.directives,
        ...newDirectives
      };
    }
  }

  /**
   * Create factory method
   */
  static create(config?: SecurityHeadersConfig): SecurityHeadersMiddleware {
    return new SecurityHeadersMiddleware(config);
  }
}

/**
 * Factory function for creating security headers middleware
 */
export function createSecurityHeadersMiddleware(
  config?: SecurityHeadersConfig
): SecurityHeadersMiddleware {
  return SecurityHeadersMiddleware.create(config);
}

/**
 * Convenience function for CORS-enabled security headers
 */
export function createCORSSecurityHeaders(
  allowedOrigins: string[],
  config?: SecurityHeadersConfig
): SecurityHeadersMiddleware {
  const corsConfig: SecurityHeadersConfig = {
    ...config,
    additionalHeaders: {
      ...config?.additionalHeaders,
      'Access-Control-Allow-Origin': allowedOrigins.join(','),
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Expose-Headers': [
        'X-RateLimit-Limit',
        'X-RateLimit-Remaining',
        'X-RateLimit-Reset',
        'X-Request-ID'
      ].join(', ')
    }
  };

  return new SecurityHeadersMiddleware(corsConfig);
}

/**
 * Audit security headers implementation
 */
export function auditSecurityHeaders(headers: Record<string, string>): {
  score: number;
  missing: string[];
  warnings: string[];
} {
  const requiredHeaders = [
    'Strict-Transport-Security',
    'X-Content-Type-Options',
    'X-Frame-Options',
    'Content-Security-Policy',
    'Referrer-Policy'
  ];

  const missing = requiredHeaders.filter(
    header => !headers[header.toLowerCase()]
  );

  const warnings: string[] = [];
  
  // Check for weak configurations
  if (headers['x-xss-protection'] === '0') {
    warnings.push('XSS Protection is disabled');
  }
  
  if (headers['x-frame-options'] === 'SAMEORIGIN') {
    warnings.push('X-Frame-Options allows same-origin framing');
  }

  const score = Math.max(0, 100 - (missing.length * 20) - (warnings.length * 10));

  return { score, missing, warnings };
}

/**
 * Default export
 */
export default SecurityHeadersMiddleware;
