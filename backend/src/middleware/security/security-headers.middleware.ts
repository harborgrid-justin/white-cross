/**
 * @fileoverview Security Headers Middleware with OWASP Best Practices (NestJS)
 * @module middleware/security/headers
 * @description Framework-agnostic HTTP security headers middleware implementing OWASP Secure Headers
 * Project recommendations for healthcare applications.
 *
 * Key Features:
 * - Content Security Policy (CSP) with nonce generation
 * - HTTP Strict Transport Security (HSTS) for HTTPS enforcement
 * - X-Frame-Options for clickjacking protection
 * - X-Content-Type-Options for MIME sniffing prevention
 * - Referrer Policy for information leakage control
 * - Permissions Policy for browser feature restriction
 *
 * @security Critical security middleware - protects against XSS, clickjacking, and data leakage
 * @compliance
 * - OWASP Secure Headers Project
 * - HIPAA 164.312(e)(1) - Transmission Security (HSTS)
 * - HIPAA 164.312(a)(1) - Access Control (CSP, frame protection)
 */

import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import * as crypto from 'crypto';

export interface SecurityHeadersConfig {
  contentSecurityPolicy?: {
    directives?: Record<string, string[]>;
    reportOnly?: boolean;
    nonce?: string;
  };
  hsts?: {
    maxAge?: number;
    includeSubDomains?: boolean;
    preload?: boolean;
  };
  frameOptions?: 'DENY' | 'SAMEORIGIN' | string;
  noSniff?: boolean;
  xssProtection?: {
    enabled?: boolean;
    mode?: 'block';
  };
  referrerPolicy?: string;
  permissionsPolicy?: Record<string, string[]>;
  additionalHeaders?: Record<string, string>;
  environment?: 'development' | 'staging' | 'production';
}

export const DEFAULT_SECURITY_CONFIG: SecurityHeadersConfig = {
  contentSecurityPolicy: {
    directives: {
      'default-src': ["'self'"],
      'script-src': ["'self'"],
      'style-src': ["'self'", "'unsafe-inline'"],
      'img-src': ["'self'", 'data:', 'https:'],
      'font-src': ["'self'"],
      'connect-src': ["'self'"],
      'frame-ancestors': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"],
      'object-src': ["'none'"],
      'media-src': ["'self'"],
      'manifest-src': ["'self'"],
    },
    reportOnly: false,
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
  frameOptions: 'DENY',
  noSniff: true,
  xssProtection: {
    enabled: true,
    mode: 'block',
  },
  referrerPolicy: 'strict-origin-when-cross-origin',
  permissionsPolicy: {
    geolocation: [],
    camera: [],
    microphone: [],
    payment: [],
    usb: [],
    magnetometer: [],
    accelerometer: [],
    gyroscope: [],
    fullscreen: ["'self'"],
    'display-capture': [],
  },
  additionalHeaders: {
    'X-Permitted-Cross-Domain-Policies': 'none',
    'X-Download-Options': 'noopen',
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-origin',
  },
};

/**
 * Security Headers Middleware implementing OWASP best practices
 */
@Injectable()
export class SecurityHeadersMiddleware implements NestMiddleware {
  private readonly logger = new Logger(SecurityHeadersMiddleware.name);
  private config: SecurityHeadersConfig;

  constructor() {
    const env = process.env.NODE_ENV || 'development';
    this.config =
      env === 'development'
        ? this.getDevelopmentConfig()
        : DEFAULT_SECURITY_CONFIG;
    this.validateConfig();
  }

  use(_req: Request, res: Response, next: NextFunction): void {
    try {
      const headers = this.applyHeaders({});

      if (headers.applied) {
        Object.entries(headers.headers).forEach(([key, value]) => {
          res.setHeader(key, value);
        });

        this.logger.debug(
          `Security headers applied: ${Object.keys(headers.headers).length} headers`,
        );
      }

      next();
    } catch (error) {
      this.logger.error('Security headers middleware error', error);
      next();
    }
  }

  private getDevelopmentConfig(): SecurityHeadersConfig {
    return {
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
          'form-action': ["'self'"],
        },
        reportOnly: true,
      },
      hsts: {
        maxAge: 0,
        includeSubDomains: false,
        preload: false,
      },
    };
  }

  private validateConfig(): void {
    if (this.config.hsts?.maxAge && this.config.hsts.maxAge < 0) {
      throw new Error('HSTS maxAge must be non-negative');
    }

    if (this.config.contentSecurityPolicy?.directives) {
      const directives = this.config.contentSecurityPolicy.directives;
      if (directives['default-src'] && directives['default-src'].length === 0) {
        this.logger.warn(
          'CSP default-src is empty, this may block all resources',
        );
      }
    }
  }

  generateNonce(): string {
    return crypto.randomBytes(16).toString('base64');
  }

  private buildCSPHeader(
    directives: Record<string, string[]>,
    nonce?: string,
  ): string {
    const processedDirectives = { ...directives };

    if (nonce) {
      if (processedDirectives['script-src']) {
        processedDirectives['script-src'] = [
          ...processedDirectives['script-src'].filter(
            (src) => src !== "'unsafe-inline'",
          ),
          `'nonce-${nonce}'`,
        ];
      }

      if (processedDirectives['style-src']) {
        processedDirectives['style-src'] = [
          ...processedDirectives['style-src'].filter(
            (src) => src !== "'unsafe-inline'",
          ),
          `'nonce-${nonce}'`,
        ];
      }
    }

    return Object.entries(processedDirectives)
      .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
      .join('; ');
  }

  private buildPermissionsPolicyHeader(
    permissions: Record<string, string[]>,
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

  applyHeaders(existingHeaders: Record<string, string> = {}): {
    applied: boolean;
    headers: Record<string, string>;
    warnings?: string[];
  } {
    const headers: Record<string, string> = { ...existingHeaders };
    const warnings: string[] = [];

    try {
      // Content-Security-Policy
      if (this.config.contentSecurityPolicy?.directives) {
        const nonce =
          this.config.contentSecurityPolicy.nonce || this.generateNonce();
        const cspHeader = this.buildCSPHeader(
          this.config.contentSecurityPolicy.directives,
          nonce,
        );
        const headerName = this.config.contentSecurityPolicy.reportOnly
          ? 'Content-Security-Policy-Report-Only'
          : 'Content-Security-Policy';

        headers[headerName] = cspHeader;
        (headers as any)._cspNonce = nonce;
      }

      // Strict-Transport-Security (HSTS)
      if (this.config.hsts && this.config.hsts.maxAge !== 0) {
        const hstsValue = [
          `max-age=${this.config.hsts.maxAge || 31536000}`,
          this.config.hsts.includeSubDomains ? 'includeSubDomains' : '',
          this.config.hsts.preload ? 'preload' : '',
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

      // X-XSS-Protection
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
        const permissionsValue = this.buildPermissionsPolicyHeader(
          this.config.permissionsPolicy,
        );
        headers['Permissions-Policy'] = permissionsValue;
      }

      // Additional headers
      if (this.config.additionalHeaders) {
        Object.assign(headers, this.config.additionalHeaders);
      }

      return {
        applied: true,
        headers,
        warnings: warnings.length > 0 ? warnings : undefined,
      };
    } catch (error) {
      this.logger.error('Failed to apply security headers', error);
      return {
        applied: false,
        headers: existingHeaders,
        warnings: [`Failed to apply security headers: ${error}`],
      };
    }
  }

  applyDownloadHeaders(
    filename: string,
    contentType: string,
    existingHeaders: Record<string, string> = {},
  ): {
    applied: boolean;
    headers: Record<string, string>;
    warnings?: string[];
  } {
    const result = this.applyHeaders(existingHeaders);

    if (result.applied) {
      result.headers['Content-Disposition'] =
        `attachment; filename="${encodeURIComponent(filename)}"`;
      result.headers['Content-Type'] = contentType;
      result.headers['Cache-Control'] =
        'no-store, no-cache, must-revalidate, private';
      result.headers['Pragma'] = 'no-cache';
      result.headers['Expires'] = '0';
    }

    return result;
  }
}
