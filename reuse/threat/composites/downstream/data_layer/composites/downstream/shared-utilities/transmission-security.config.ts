/**
 * Transmission Security Configuration
 *
 * HIPAA Requirement: Transmission Security (§164.312(e)(1))
 *
 * Features:
 * - TLS 1.3 enforcement
 * - Strong cipher suite configuration
 * - Certificate validation
 * - HSTS configuration
 * - Secure cookie settings
 *
 * @module transmission-security.config
 * @hipaa-requirement §164.312(e)(1) - Transmission Security
 */

import * as fs from 'fs';
import * as https from 'https';
import { Logger } from '@nestjs/common';

const logger = new Logger('TransmissionSecurityConfig');

/**
 * TLS Configuration for HIPAA Compliance
 */
export const TLSConfig = {
  // Minimum TLS version: 1.3 (most secure)
  minVersion: 'TLSv1.3' as const,

  // Maximum TLS version: 1.3
  maxVersion: 'TLSv1.3' as const,

  // Strong cipher suites for TLS 1.3
  // These are modern, secure cipher suites that provide forward secrecy
  ciphers: [
    'TLS_AES_256_GCM_SHA384',
    'TLS_CHACHA20_POLY1305_SHA256',
    'TLS_AES_128_GCM_SHA256',
  ].join(':'),

  // Prefer server cipher suites
  honorCipherOrder: true,

  // Disable TLS session tickets (for better forward secrecy)
  sessionTimeout: 300, // 5 minutes

  // Certificate verification
  rejectUnauthorized: true,

  // Request client certificate (for mutual TLS)
  requestCert: false, // Set to true for mTLS

  // Don't use deprecated protocols
  secureProtocol: 'TLSv1_3_method' as const,
};

/**
 * HTTPS Server Options for Production
 */
export function getHTTPSOptions(): https.ServerOptions {
  const certPath = process.env.SSL_CERT_PATH || '/etc/ssl/certs/whitecross.crt';
  const keyPath = process.env.SSL_KEY_PATH || '/etc/ssl/private/whitecross.key';
  const caPath = process.env.SSL_CA_PATH; // Optional CA certificate

  // Validate certificate files exist
  if (!fs.existsSync(certPath)) {
    logger.error(`SSL certificate not found: ${certPath}`);
    throw new Error(`SSL certificate not found: ${certPath}`);
  }

  if (!fs.existsSync(keyPath)) {
    logger.error(`SSL private key not found: ${keyPath}`);
    throw new Error(`SSL private key not found: ${keyPath}`);
  }

  const options: https.ServerOptions = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
    ...TLSConfig,
  };

  // Add CA certificate if provided (for certificate chain)
  if (caPath && fs.existsSync(caPath)) {
    options.ca = fs.readFileSync(caPath);
  }

  logger.log('HTTPS options configured with TLS 1.3');
  return options;
}

/**
 * HSTS (HTTP Strict Transport Security) Configuration
 * Forces HTTPS connections for 1 year
 */
export const HSTSConfig = {
  maxAge: 31536000, // 1 year in seconds
  includeSubDomains: true,
  preload: true,
};

/**
 * Secure Cookie Configuration
 * HIPAA: Protect session cookies
 */
export const SecureCookieConfig = {
  httpOnly: true, // Prevent XSS access
  secure: true, // HTTPS only
  sameSite: 'strict' as const, // CSRF protection
  maxAge: 900000, // 15 minutes
  domain: process.env.COOKIE_DOMAIN,
  path: '/',
};

/**
 * CORS Configuration for Secure Transmission
 */
export const CORSConfig = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
      'https://whitecross.health',
      'https://app.whitecross.health',
      'https://portal.whitecross.health',
    ];

    // Allow requests with no origin (mobile apps, Postman)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-CSRF-Token',
    'X-Session-ID',
    'X-Device-ID',
  ],
  exposedHeaders: [
    'X-Total-Count',
    'X-Page',
    'X-Request-ID',
    'X-Session-Warning',
  ],
  maxAge: 3600, // 1 hour
};

/**
 * Certificate Monitoring Configuration
 */
export const CertificateMonitoringConfig = {
  // Check certificate expiration every day
  checkInterval: 24 * 60 * 60 * 1000, // 24 hours

  // Alert when certificate expires in less than 30 days
  alertThreshold: 30 * 24 * 60 * 60 * 1000, // 30 days

  // Critical alert when certificate expires in less than 7 days
  criticalThreshold: 7 * 24 * 60 * 60 * 1000, // 7 days
};

/**
 * Validate TLS Configuration
 */
export function validateTLSConfig(): {
  valid: boolean;
  warnings: string[];
  errors: string[];
} {
  const warnings: string[] = [];
  const errors: string[] = [];

  // Check TLS version
  if (TLSConfig.minVersion !== 'TLSv1.3') {
    warnings.push('TLS version should be 1.3 for maximum security');
  }

  // Check certificates
  const certPath = process.env.SSL_CERT_PATH || '/etc/ssl/certs/whitecross.crt';
  const keyPath = process.env.SSL_KEY_PATH || '/etc/ssl/private/whitecross.key';

  if (!fs.existsSync(certPath)) {
    errors.push(`SSL certificate not found: ${certPath}`);
  }

  if (!fs.existsSync(keyPath)) {
    errors.push(`SSL private key not found: ${keyPath}`);
  }

  // Check HSTS configuration
  if (HSTSConfig.maxAge < 31536000) {
    warnings.push('HSTS maxAge should be at least 1 year (31536000 seconds)');
  }

  // Check cookie security
  if (!SecureCookieConfig.secure) {
    errors.push('Cookies must have secure flag set');
  }

  if (!SecureCookieConfig.httpOnly) {
    errors.push('Cookies must have httpOnly flag set');
  }

  return {
    valid: errors.length === 0,
    warnings,
    errors,
  };
}

/**
 * Check Certificate Expiration
 */
export async function checkCertificateExpiration(
  certPath: string,
): Promise<{
  valid: boolean;
  expiresAt: Date;
  daysRemaining: number;
  shouldAlert: boolean;
  critical: boolean;
}> {
  try {
    const cert = fs.readFileSync(certPath, 'utf8');

    // Parse certificate (simplified - use a proper library in production)
    const expiryMatch = cert.match(/Not After : (.+)/);

    if (!expiryMatch) {
      throw new Error('Could not parse certificate expiration date');
    }

    const expiresAt = new Date(expiryMatch[1]);
    const now = new Date();
    const daysRemaining = Math.floor((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    const shouldAlert = daysRemaining < 30;
    const critical = daysRemaining < 7;

    if (critical) {
      logger.error(`CRITICAL: SSL certificate expires in ${daysRemaining} days!`);
    } else if (shouldAlert) {
      logger.warn(`WARNING: SSL certificate expires in ${daysRemaining} days`);
    }

    return {
      valid: daysRemaining > 0,
      expiresAt,
      daysRemaining,
      shouldAlert,
      critical,
    };
  } catch (error) {
    logger.error(`Failed to check certificate expiration: ${error.message}`);
    throw error;
  }
}

/**
 * HTTP to HTTPS Redirect Middleware
 */
export function httpsRedirectMiddleware() {
  return (req: any, res: any, next: any) => {
    if (!req.secure && process.env.NODE_ENV === 'production') {
      logger.warn(`HTTP request redirected to HTTPS: ${req.url}`);
      return res.redirect(301, `https://${req.headers.host}${req.url}`);
    }
    next();
  };
}

export default {
  TLSConfig,
  getHTTPSOptions,
  HSTSConfig,
  SecureCookieConfig,
  CORSConfig,
  CertificateMonitoringConfig,
  validateTLSConfig,
  checkCertificateExpiration,
  httpsRedirectMiddleware,
};
