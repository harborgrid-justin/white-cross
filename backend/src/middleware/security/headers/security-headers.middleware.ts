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
 * Framework-agnostic Security Headers Middleware
 * Implements OWASP security best practices for HTTP headers
 *
 * Compliance: OWASP Secure Headers Project
 * HIPAA: Protects PHI transmission security
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
 * Core Security Headers Middleware Class
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
   * Apply security headers (framework-agnostic)
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
