/**
 * @fileoverview Content Security Policy (CSP) Middleware for Healthcare Applications
 * @module middleware/security/csp
 * @description NestJS CSP middleware with HIPAA-compliant configurations for healthcare platforms.
 * Implements strict CSP policies, nonce generation, violation reporting, and healthcare-specific validations.
 *
 * Key Features:
 * - Healthcare-compliant CSP directives (strict-dynamic, no unsafe-eval)
 * - Cryptographically secure nonce generation for inline scripts/styles
 * - CSP violation reporting endpoint with analytics
 * - Healthcare-critical violation detection and alerting
 * - Request-specific nonce caching (5-minute TTL)
 * - Environment-specific policies (strict vs base)
 * - Audit logging for compliance tracking
 *
 * @security Critical security middleware - prevents XSS and code injection attacks
 * @compliance
 * - OWASP A03:2021 - Injection (prevents XSS)
 * - HIPAA 164.312(a)(1) - Access Control (restricts resource loading)
 * - HIPAA 164.312(b) - Audit Controls (violation reporting)
 */

import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import * as crypto from 'crypto';

export interface CSPConfig {
  reportOnly?: boolean;
  reportUri?: string;
  enableNonce?: boolean;
  customDirectives?: Record<string, string[]>;
  strictMode?: boolean;
  healthcareCompliance?: boolean;
}

export interface CSPDirectives {
  'default-src': string[];
  'script-src': string[];
  'style-src': string[];
  'img-src': string[];
  'connect-src': string[];
  'font-src': string[];
  'object-src': string[];
  'media-src': string[];
  'frame-src': string[];
  'child-src': string[];
  'form-action': string[];
  'frame-ancestors': string[];
  'base-uri': string[];
  'manifest-src': string[];
  'worker-src': string[];
  'upgrade-insecure-requests': boolean;
  'block-all-mixed-content': boolean;
}

export interface CSPViolationReport {
  'csp-report': {
    'document-uri': string;
    referrer: string;
    'violated-directive': string;
    'original-policy': string;
    'blocked-uri': string;
    'line-number': number;
    'column-number': number;
    'source-file': string;
    'status-code': number;
    'script-sample': string;
  };
}

export interface CSPMetrics {
  violationsCount: number;
  policiesApplied: number;
  noncesGenerated: number;
  healthcareViolations: number;
  lastViolation?: Date;
}

/**
 * Healthcare-specific CSP policy generator
 */
export class HealthcareCSPPolicies {
  /**
   * Get HIPAA-compliant base CSP directives
   */
  static getBaseDirectives(): Partial<CSPDirectives> {
    return {
      'default-src': ["'self'"],
      'script-src': ["'self'", "'unsafe-inline'"], // Healthcare apps often need inline scripts
      'style-src': [
        "'self'",
        "'unsafe-inline'",
        'https://fonts.googleapis.com',
      ],
      'img-src': ["'self'", 'data:', 'https:'], // Medical images from secure sources
      'connect-src': ["'self'"], // Healthcare APIs
      'font-src': ["'self'", 'https://fonts.gstatic.com'],
      'object-src': ["'none'"],
      'media-src': ["'self'"],
      'frame-src': ["'none'"], // Prevent iframe attacks
      'child-src': ["'none'"],
      'form-action': ["'self'"],
      'frame-ancestors': ["'none'"], // Prevent clickjacking
      'base-uri': ["'self'"],
      'manifest-src': ["'self'"],
      'worker-src': ["'self'"],
      'upgrade-insecure-requests': true,
      'block-all-mixed-content': true,
    };
  }

  /**
   * Get strict HIPAA compliance directives
   */
  static getStrictDirectives(): Partial<CSPDirectives> {
    return {
      ...this.getBaseDirectives(),
      'script-src': ["'self'", "'strict-dynamic'"], // Disable unsafe-inline for production
      'style-src': ["'self'", 'https://fonts.googleapis.com'],
      'connect-src': ["'self'"], // Only allow same-origin connections
      'img-src': ["'self'", 'data:'], // No external image sources
    };
  }

  /**
   * Validate if a directive is healthcare-compliant
   */
  static isHealthcareCompliant(directive: string, value: string): boolean {
    const riskyPatterns = [
      'unsafe-eval',
      '*.', // Wildcard domains
      'http:', // Insecure protocols
      'data:', // For script-src only
    ];

    if (directive === 'script-src' && value === 'data:') {
      return false;
    }

    return !riskyPatterns.some((pattern) => value.includes(pattern));
  }
}

/**
 * CSP nonce generator for inline scripts and styles
 */
export class CSPNonceGenerator {
  private static nonceCache = new Map<
    string,
    { nonce: string; timestamp: number }
  >();
  private static readonly NONCE_TTL = 300000; // 5 minutes

  /**
   * Generate cryptographically secure nonce
   */
  static generate(requestId?: string): string {
    const nonce = this.generateSecureNonce();

    if (requestId) {
      this.nonceCache.set(requestId, {
        nonce,
        timestamp: Date.now(),
      });
      this.cleanupExpiredNonces();
    }

    return nonce;
  }

  /**
   * Get cached nonce for request
   */
  static getCached(requestId: string): string | null {
    const cached = this.nonceCache.get(requestId);
    if (cached && Date.now() - cached.timestamp < this.NONCE_TTL) {
      return cached.nonce;
    }
    return null;
  }

  private static generateSecureNonce(): string {
    return crypto.randomBytes(16).toString('base64');
  }

  private static cleanupExpiredNonces(): void {
    const now = Date.now();
    for (const [key, value] of this.nonceCache.entries()) {
      if (now - value.timestamp >= this.NONCE_TTL) {
        this.nonceCache.delete(key);
      }
    }
  }
}

/**
 * CSP violation reporter and analyzer
 */
export class CSPViolationReporter {
  private static violations: any[] = [];
  private static readonly MAX_VIOLATIONS = 1000;

  /**
   * Process CSP violation report
   */
  static processViolation(report: CSPViolationReport, clientIp: string): void {
    const violation = {
      ...report,
      timestamp: new Date(),
      clientIp: this.sanitizeIp(clientIp),
      severity: this.assessViolationSeverity(report),
    };

    this.violations.push(violation);

    if (this.violations.length > this.MAX_VIOLATIONS) {
      this.violations.shift();
    }

    // Log healthcare-critical violations
    if (this.isHealthcareCritical(report)) {
      Logger.error(
        `[CSP-HEALTHCARE-VIOLATION] ${JSON.stringify({
          directive: report['csp-report']['violated-directive'],
          uri: report['csp-report']['document-uri'],
          blocked: report['csp-report']['blocked-uri'],
          timestamp: new Date().toISOString(),
        })}`,
        'CSPViolationReporter',
      );
    }
  }

  /**
   * Get violation statistics
   */
  static getViolationStats(): {
    total: number;
    byDirective: Record<string, number>;
    healthcareCritical: number;
    last24Hours: number;
  } {
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;

    const byDirective: Record<string, number> = {};
    let healthcareCritical = 0;
    let last24Hours = 0;

    for (const violation of this.violations) {
      const directive = violation['csp-report']['violated-directive'];
      byDirective[directive] = (byDirective[directive] || 0) + 1;

      if (this.isHealthcareCritical(violation)) {
        healthcareCritical++;
      }

      if (violation.timestamp?.getTime() > oneDayAgo) {
        last24Hours++;
      }
    }

    return {
      total: this.violations.length,
      byDirective,
      healthcareCritical,
      last24Hours,
    };
  }

  private static sanitizeIp(ip: string): string {
    // Sanitize IP for HIPAA compliance (partial masking)
    const parts = ip.split('.');
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.xxx.xxx`;
    }
    return 'xxx.xxx.xxx.xxx';
  }

  private static assessViolationSeverity(
    report: CSPViolationReport,
  ): 'low' | 'medium' | 'high' | 'critical' {
    const directive = report['csp-report']['violated-directive'];
    const blockedUri = report['csp-report']['blocked-uri'];

    if (directive.includes('script-src') && blockedUri.includes('eval')) {
      return 'critical';
    }
    if (directive.includes('frame-ancestors')) {
      return 'high';
    }
    if (directive.includes('connect-src') && !blockedUri.startsWith('https:')) {
      return 'high';
    }
    return 'medium';
  }

  private static isHealthcareCritical(report: CSPViolationReport): boolean {
    const directive = report['csp-report']['violated-directive'];
    const criticalDirectives = [
      'script-src',
      'frame-ancestors',
      'form-action',
      'connect-src',
    ];

    return criticalDirectives.some((critical) => directive.includes(critical));
  }
}

/**
 * Content Security Policy Middleware with Healthcare Compliance
 *
 * @class CspMiddleware
 * @implements {NestMiddleware}
 * @description NestJS CSP middleware implementing healthcare-compliant policies with
 * nonce generation, violation reporting, and comprehensive security monitoring.
 */
@Injectable()
export class CspMiddleware implements NestMiddleware {
  private readonly logger = new Logger(CspMiddleware.name);
  private config: Required<CSPConfig>;
  private metrics: CSPMetrics;

  constructor() {
    this.config = {
      reportOnly: false,
      reportUri: '/api/security/csp-violations',
      enableNonce: true,
      customDirectives: {},
      strictMode: process.env.NODE_ENV === 'production',
      healthcareCompliance: true,
    };

    this.metrics = {
      violationsCount: 0,
      policiesApplied: 0,
      noncesGenerated: 0,
      healthcareViolations: 0,
    };
  }

  /**
   * Execute CSP middleware
   */
  use(req: Request, res: Response, next: NextFunction): void {
    try {
      const startTime = Date.now();

      // Generate request-specific nonce if enabled
      let nonce: string | undefined;
      if (this.config.enableNonce) {
        const requestId =
          (req as any).correlationId ||
          (req as any).sessionId ||
          `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        nonce = CSPNonceGenerator.generate(requestId);
        this.metrics.noncesGenerated++;

        // Attach nonce to request for use in templates
        (req as any).cspNonce = nonce;
        res.locals.cspNonce = nonce;
      }

      // Build CSP policy
      const policy = this.buildCSPPolicy(nonce);

      // Set CSP header
      const headerName = this.config.reportOnly
        ? 'Content-Security-Policy-Report-Only'
        : 'Content-Security-Policy';

      res.setHeader(headerName, policy);

      // Add additional security headers
      this.setAdditionalSecurityHeaders(res);

      // Update metrics
      this.metrics.policiesApplied++;

      // Audit log
      this.auditLog(req, policy, Date.now() - startTime);

      next();
    } catch (error) {
      this.logger.error('CSP middleware error', error);

      // Set minimal CSP policy on error
      res.setHeader('Content-Security-Policy', "default-src 'self'");
      next();
    }
  }

  /**
   * Handle CSP violation reports
   */
  handleViolationReport(req: Request, res: Response): void {
    try {
      const report = req.body as CSPViolationReport;
      const clientIp = req.ip || 'unknown';

      CSPViolationReporter.processViolation(report, clientIp);

      this.metrics.violationsCount++;
      if (this.isHealthcareViolation(report)) {
        this.metrics.healthcareViolations++;
      }

      res.status(204).send();
    } catch (error) {
      this.logger.error('CSP violation report error', error);
      res.status(400).json({ error: 'Invalid violation report' });
    }
  }

  /**
   * Get CSP metrics
   */
  getMetrics(): CSPMetrics & { violationStats: any } {
    return {
      ...this.metrics,
      violationStats: CSPViolationReporter.getViolationStats(),
    };
  }

  /**
   * Build CSP policy string
   */
  private buildCSPPolicy(nonce?: string): string {
    let directives: Partial<CSPDirectives>;

    // Start with healthcare-compliant base
    if (this.config.healthcareCompliance) {
      directives = this.config.strictMode
        ? HealthcareCSPPolicies.getStrictDirectives()
        : HealthcareCSPPolicies.getBaseDirectives();
    } else {
      directives = HealthcareCSPPolicies.getBaseDirectives();
    }

    // Apply custom directives
    Object.entries(this.config.customDirectives).forEach(([key, values]) => {
      (directives as any)[key] = values;
    });

    // Add nonce to script-src and style-src if enabled
    if (nonce) {
      if (directives['script-src']) {
        directives['script-src'] = [
          ...directives['script-src'],
          `'nonce-${nonce}'`,
        ];
      }
      if (directives['style-src']) {
        directives['style-src'] = [
          ...directives['style-src'],
          `'nonce-${nonce}'`,
        ];
      }
    }

    // Build policy string
    const policyParts: string[] = [];

    Object.entries(directives).forEach(([directive, value]) => {
      if (typeof value === 'boolean') {
        if (value) {
          policyParts.push(directive);
        }
      } else if (Array.isArray(value)) {
        policyParts.push(`${directive} ${value.join(' ')}`);
      }
    });

    // Add report URI
    if (this.config.reportUri) {
      policyParts.push(`report-uri ${this.config.reportUri}`);
    }

    return policyParts.join('; ');
  }

  /**
   * Set additional security headers
   */
  private setAdditionalSecurityHeaders(res: Response): void {
    // X-Content-Type-Options
    res.setHeader('X-Content-Type-Options', 'nosniff');

    // X-Frame-Options (backup for frame-ancestors)
    res.setHeader('X-Frame-Options', 'DENY');

    // X-XSS-Protection
    res.setHeader('X-XSS-Protection', '1; mode=block');

    // Referrer Policy
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Permissions Policy (formerly Feature Policy)
    res.setHeader(
      'Permissions-Policy',
      'geolocation=(), microphone=(), camera=(), payment=()',
    );
  }

  /**
   * Check if violation is healthcare-related
   */
  private isHealthcareViolation(report: CSPViolationReport): boolean {
    const uri = report['csp-report']['document-uri'];
    const blockedUri = report['csp-report']['blocked-uri'];

    const healthcareKeywords = [
      'patient',
      'medical',
      'healthcare',
      'hipaa',
      'phi',
      'medication',
      'diagnosis',
      'treatment',
    ];

    return healthcareKeywords.some(
      (keyword) =>
        uri.toLowerCase().includes(keyword) ||
        blockedUri.toLowerCase().includes(keyword),
    );
  }

  /**
   * Audit logging
   */
  private auditLog(req: Request, policy: string, processingTime: number): void {
    const auditEntry = {
      timestamp: new Date().toISOString(),
      event: 'csp_policy_applied',
      requestId:
        (req as any).correlationId || (req as any).sessionId || 'unknown',
      userAgent: req.headers?.['user-agent'],
      ip: req.ip,
      path: req.path,
      method: req.method,
      policyLength: policy.length,
      processingTime,
      healthcareCompliance: this.config.healthcareCompliance,
      strictMode: this.config.strictMode,
    };

    this.logger.debug(`[CSP-AUDIT] ${JSON.stringify(auditEntry)}`);
  }
}
