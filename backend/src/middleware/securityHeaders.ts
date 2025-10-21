/**
 * LOC: 634FFC1ED7
 * WC-MID-SHD-051 | OWASP Security Headers & CSP Implementation Middleware
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *
 * DOWNSTREAM (imported by):
 *   - None (not imported)
 */

/**
 * WC-MID-SHD-051 | OWASP Security Headers & CSP Implementation Middleware
 * Purpose: Comprehensive HTTP security headers, CSP, HSTS, HIPAA PHI protection
 * Upstream: utils/logger, OWASP security guidelines, crypto API
 * Downstream: All HTTP responses | Called by: Hapi server extensions
 * Related: middleware/security.ts, HIPAA compliance, OWASP Top 10 protection
 * Exports: securityHeadersMiddleware, cspNonceMiddleware, generateCSPNonce
 * Last Updated: 2025-10-18 | Dependencies: @hapi/hapi, crypto
 * Critical Path: Response → Security headers application → PHI protection
 * LLM Context: Healthcare security compliance, CSP nonces, download protection
 */

/**
 * Security Headers Middleware
 * Implements OWASP security best practices for HTTP headers
 *
 * Compliance: OWASP Secure Headers Project
 * HIPAA: Protects PHI transmission security
 */

import { Request, ResponseToolkit } from '@hapi/hapi';
import { logger } from '../utils/logger';

/**
 * Security headers configuration
 */
export interface SecurityHeadersConfig {
  // Content Security Policy
  contentSecurityPolicy?: {
    directives?: Record<string, string[]>;
    reportOnly?: boolean;
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

  // CORS
  cors?: {
    origin?: string | string[];
    credentials?: boolean;
    exposedHeaders?: string[];
    maxAge?: number;
  };
}

/**
 * Default security configuration for healthcare platform
 * Strict settings optimized for HIPAA compliance
 */
export const DEFAULT_SECURITY_CONFIG: SecurityHeadersConfig = {
  contentSecurityPolicy: {
    directives: {
      'default-src': ["'self'"],
      'script-src': ["'self'", "'unsafe-inline'"], // TODO: Remove unsafe-inline, use nonces
      'style-src': ["'self'", "'unsafe-inline'"],  // TODO: Remove unsafe-inline
      'img-src': ["'self'", 'data:', 'https:'],
      'font-src': ["'self'"],
      'connect-src': ["'self'"],
      'frame-ancestors': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"]
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
    'gyroscope': []
  },

  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    exposedHeaders: [
      'X-RateLimit-Limit',
      'X-RateLimit-Remaining',
      'X-RateLimit-Reset'
    ],
    maxAge: 86400 // 24 hours
  }
};

/**
 * Build Content-Security-Policy header value
 */
function buildCSPHeader(
  directives: Record<string, string[]>
): string {
  return Object.entries(directives)
    .map(([directive, sources]) => {
      return `${directive} ${sources.join(' ')}`;
    })
    .join('; ');
}

/**
 * Build Permissions-Policy header value
 */
function buildPermissionsPolicyHeader(
  permissions: Record<string, string[]>
): string {
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
 * Apply security headers to response
 */
function applySecurityHeaders(
  response: any,
  config: SecurityHeadersConfig
): void {
  // Content-Security-Policy
  if (config.contentSecurityPolicy && config.contentSecurityPolicy.directives) {
    const cspHeader = buildCSPHeader(config.contentSecurityPolicy.directives);
    const headerName = config.contentSecurityPolicy.reportOnly
      ? 'Content-Security-Policy-Report-Only'
      : 'Content-Security-Policy';
    response.header(headerName, cspHeader);
  }

  // Strict-Transport-Security (HSTS)
  if (config.hsts) {
    const hstsValue = [
      `max-age=${config.hsts.maxAge || 31536000}`,
      config.hsts.includeSubDomains ? 'includeSubDomains' : '',
      config.hsts.preload ? 'preload' : ''
    ]
      .filter(Boolean)
      .join('; ');

    response.header('Strict-Transport-Security', hstsValue);
  }

  // X-Frame-Options
  if (config.frameOptions) {
    response.header('X-Frame-Options', config.frameOptions);
  }

  // X-Content-Type-Options
  if (config.noSniff) {
    response.header('X-Content-Type-Options', 'nosniff');
  }

  // X-XSS-Protection (legacy, but still useful)
  if (config.xssProtection) {
    const xssValue = config.xssProtection.enabled
      ? config.xssProtection.mode === 'block'
        ? '1; mode=block'
        : '1'
      : '0';
    response.header('X-XSS-Protection', xssValue);
  }

  // Referrer-Policy
  if (config.referrerPolicy) {
    response.header('Referrer-Policy', config.referrerPolicy);
  }

  // Permissions-Policy
  if (config.permissionsPolicy) {
    const permissionsValue = buildPermissionsPolicyHeader(config.permissionsPolicy);
    response.header('Permissions-Policy', permissionsValue);
  }

  // CORS headers (if applicable)
  if (config.cors) {
    // Note: CORS is typically handled at server level, but we can set exposed headers
    if (config.cors.exposedHeaders && config.cors.exposedHeaders.length > 0) {
      response.header('Access-Control-Expose-Headers', config.cors.exposedHeaders.join(', '));
    }
  }

  // Additional security headers
  response.header('X-Permitted-Cross-Domain-Policies', 'none');
  response.header('X-Download-Options', 'noopen');
}

/**
 * Security headers middleware for Hapi.js
 */
export const securityHeadersMiddleware = {
  name: 'security-headers',
  version: '1.0.0',

  register: async (server: any, options?: { config?: SecurityHeadersConfig }) => {
    const config = {
      ...DEFAULT_SECURITY_CONFIG,
      ...options?.config
    };

    // Apply security headers to all responses
    server.ext('onPreResponse', (request: Request, h: ResponseToolkit) => {
      const response = request.response as any;

      // Skip if response is an error
      if (response.isBoom) {
        return h.continue;
      }

      // Apply security headers
      applySecurityHeaders(response, config);

      return h.continue;
    });

    logger.info('Security headers middleware registered', {
      csp: !!config.contentSecurityPolicy,
      hsts: !!config.hsts,
      frameOptions: config.frameOptions
    });
  }
};

/**
 * CSP nonce generator for inline scripts
 * Use this to safely allow inline scripts in CSP
 */
export function generateCSPNonce(): string {
  // Generate cryptographically secure random nonce
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Buffer.from(array).toString('base64');
}

/**
 * Add CSP nonce to request for use in templates
 */
export const cspNonceMiddleware = {
  name: 'csp-nonce',
  version: '1.0.0',

  register: async (server: any) => {
    server.ext('onRequest', (request: Request, h: ResponseToolkit) => {
      // Generate unique nonce for this request
      const nonce = generateCSPNonce();
      (request as any).cspNonce = nonce;

      return h.continue;
    });

    // Update CSP header to include nonce
    server.ext('onPreResponse', (request: Request, h: ResponseToolkit) => {
      const response = request.response as any;
      if (response.isBoom) return h.continue;

      const nonce = (request as any).cspNonce;
      if (nonce) {
        const existingCSP = response.headers['content-security-policy'];
        if (existingCSP) {
          // Add nonce to script-src and style-src
          const updatedCSP = existingCSP
            .replace("'unsafe-inline'", `'nonce-${nonce}'`)
            .replace('script-src', `script-src 'nonce-${nonce}'`)
            .replace('style-src', `style-src 'nonce-${nonce}'`);

          response.header('Content-Security-Policy', updatedCSP);
        }
      }

      return h.continue;
    });
  }
};

/**
 * CORS configuration helper
 * Validates origin against whitelist
 */
export function createCORSConfig(allowedOrigins: string[]) {
  return {
    origin: (origin: string) => {
      if (!origin) return true; // Allow requests with no origin (mobile apps, etc.)

      if (allowedOrigins.includes(origin)) {
        return origin;
      }

      // Check for wildcard subdomain patterns
      for (const allowed of allowedOrigins) {
        if (allowed.startsWith('*.')) {
          const domain = allowed.substring(2);
          if (origin.endsWith(domain)) {
            return origin;
          }
        }
      }

      logger.warn('CORS origin not allowed', { origin, allowedOrigins });
      return false;
    },
    credentials: true,
    exposedHeaders: [
      'X-RateLimit-Limit',
      'X-RateLimit-Remaining',
      'X-RateLimit-Reset',
      'X-Request-ID'
    ],
    maxAge: 86400 // 24 hours
  };
}

/**
 * Security headers for file downloads
 * Additional headers for PHI document downloads
 */
export function applyDownloadSecurityHeaders(
  response: any,
  filename: string,
  contentType: string
): void {
  // Standard security headers
  response.header('X-Content-Type-Options', 'nosniff');
  response.header('X-Frame-Options', 'DENY');

  // Content disposition - force download
  response.header(
    'Content-Disposition',
    `attachment; filename="${encodeURIComponent(filename)}"`
  );

  // Content type
  response.header('Content-Type', contentType);

  // Cache control - don't cache PHI
  response.header('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  response.header('Pragma', 'no-cache');
  response.header('Expires', '0');
}

/**
 * Security headers audit logger
 * Logs missing security headers for compliance review
 */
export async function auditSecurityHeaders(
  response: any,
  path: string
): Promise<void> {
  const requiredHeaders = [
    'Strict-Transport-Security',
    'X-Content-Type-Options',
    'X-Frame-Options',
    'Content-Security-Policy',
    'Referrer-Policy'
  ];

  const missingHeaders = requiredHeaders.filter(
    header => !response.headers[header.toLowerCase()]
  );

  if (missingHeaders.length > 0) {
    logger.warn('Missing security headers', {
      path,
      missingHeaders,
      statusCode: response.statusCode
    });
  }
}

/**
 * Create security headers for API responses
 * Simplified version for JSON APIs
 */
export function applyAPISecurityHeaders(response: any): void {
  response.header('X-Content-Type-Options', 'nosniff');
  response.header('X-Frame-Options', 'DENY');
  response.header('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.header('Cache-Control', 'no-store');
  response.header('Pragma', 'no-cache');
}

export default securityHeadersMiddleware;
