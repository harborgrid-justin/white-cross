import { IMiddleware, IRequest, IResponse, INextFunction, MiddlewareContext } from '../../utils/types/middleware.types';

/**
 * Enterprise Content Security Policy middleware for healthcare applications
 * Implements HIPAA-compliant CSP policies with healthcare-specific security measures
 * 
 * Features:
 * - Healthcare-compliant CSP policies
 * - Nonce generation for inline scripts/styles
 * - Report URI for CSP violations
 * - Dynamic policy adjustment based on request context
 * - Audit logging for compliance
 */

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
    'referrer': string;
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
      'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      'img-src': ["'self'", 'data:', 'https:'], // Medical images from secure sources
      'connect-src': ["'self'", 'https://api.healthcare.gov'], // Healthcare APIs
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
      'block-all-mixed-content': true
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
      'img-src': ["'self'", 'data:'] // No external image sources
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
      'data:' // For script-src only
    ];

    if (directive === 'script-src' && value === 'data:') {
      return false;
    }

    return !riskyPatterns.some(pattern => value.includes(pattern));
  }
}

/**
 * CSP nonce generator for inline scripts and styles
 */
export class CSPNonceGenerator {
  private static nonceCache = new Map<string, { nonce: string; timestamp: number }>();
  private static readonly NONCE_TTL = 300000; // 5 minutes

  /**
   * Generate cryptographically secure nonce
   */
  static generate(requestId?: string): string {
    const nonce = this.generateSecureNonce();
    
    if (requestId) {
      this.nonceCache.set(requestId, {
        nonce,
        timestamp: Date.now()
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
    if (cached && (Date.now() - cached.timestamp) < this.NONCE_TTL) {
      return cached.nonce;
    }
    return null;
  }

  private static generateSecureNonce(): string {
    const crypto = require('crypto');
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
  private static violations: CSPViolationReport[] = [];
  private static readonly MAX_VIOLATIONS = 1000;

  /**
   * Process CSP violation report
   */
  static processViolation(report: CSPViolationReport, clientIp: string): void {
    const violation = {
      ...report,
      timestamp: new Date(),
      clientIp: this.sanitizeIp(clientIp),
      severity: this.assessViolationSeverity(report)
    };

    this.violations.push(violation);
    
    if (this.violations.length > this.MAX_VIOLATIONS) {
      this.violations.shift();
    }

    // Log healthcare-critical violations
    if (this.isHealthcareCritical(report)) {
      console.error('[CSP-HEALTHCARE-VIOLATION]', {
        directive: report['csp-report']['violated-directive'],
        uri: report['csp-report']['document-uri'],
        blocked: report['csp-report']['blocked-uri'],
        timestamp: new Date().toISOString()
      });
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
    const oneDayAgo = now - (24 * 60 * 60 * 1000);

    const byDirective: Record<string, number> = {};
    let healthcareCritical = 0;
    let last24Hours = 0;

    for (const violation of this.violations) {
      const directive = violation['csp-report']['violated-directive'];
      byDirective[directive] = (byDirective[directive] || 0) + 1;

      if (this.isHealthcareCritical(violation)) {
        healthcareCritical++;
      }

      if ((violation as any).timestamp?.getTime() > oneDayAgo) {
        last24Hours++;
      }
    }

    return {
      total: this.violations.length,
      byDirective,
      healthcareCritical,
      last24Hours
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

  private static assessViolationSeverity(report: CSPViolationReport): 'low' | 'medium' | 'high' | 'critical' {
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
      'connect-src'
    ];

    return criticalDirectives.some(critical => directive.includes(critical));
  }
}

/**
 * Main CSP middleware implementation
 */
export class CspMiddleware implements IMiddleware {
  public readonly name = 'CspMiddleware';
  public readonly version = '1.0.0';
  
  private config: Required<CSPConfig>;
  private metrics: CSPMetrics;

  constructor(config: CSPConfig = {}) {
    this.config = {
      reportOnly: config.reportOnly ?? false,
      reportUri: config.reportUri ?? '/api/csp-violation-report',
      enableNonce: config.enableNonce ?? true,
      customDirectives: config.customDirectives ?? {},
      strictMode: config.strictMode ?? true,
      healthcareCompliance: config.healthcareCompliance ?? true
    };

    this.metrics = {
      violationsCount: 0,
      policiesApplied: 0,
      noncesGenerated: 0,
      healthcareViolations: 0
    };
  }

  /**
   * Execute CSP middleware - implements IMiddleware interface
   */
  async execute(
    req: IRequest, 
    res: IResponse, 
    next: INextFunction, 
    _context: MiddlewareContext
  ): Promise<void> {
    try {
      const startTime = Date.now();

      // Generate request-specific nonce if enabled
      let nonce: string | undefined;
      if (this.config.enableNonce) {
        const requestId = req.correlationId || req.sessionId || `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        nonce = CSPNonceGenerator.generate(requestId);
        this.metrics.noncesGenerated++;
        
        // Attach nonce to request for use in templates
        req.setMetadata('csp-nonce', nonce);
      }

      // Build CSP policy
      const policy = this.buildCSPPolicy(req, nonce);

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

      next.call();
    } catch (error) {
      console.error('[CSP-MIDDLEWARE-ERROR]', error);
      
      // Set minimal CSP policy on error
      res.setHeader('Content-Security-Policy', "default-src 'self'");
      next.call();
    }
  }

  /**
   * Handle CSP violation reports
   */
  async handleViolationReport(req: IRequest, res: IResponse): Promise<void> {
    try {
      const report = req.body as CSPViolationReport;
      const clientIp = req.ip || 'unknown';

      CSPViolationReporter.processViolation(report, clientIp);
      
      this.metrics.violationsCount++;
      if (this.isHealthcareViolation(report)) {
        this.metrics.healthcareViolations++;
      }

      res.setStatus(204).send();
    } catch (error) {
      console.error('[CSP-VIOLATION-REPORT-ERROR]', error);
      res.setStatus(400).json({ error: 'Invalid violation report' });
    }
  }

  /**
   * Get CSP metrics
   */
  getMetrics(): CSPMetrics & { violationStats: any } {
    return {
      ...this.metrics,
      violationStats: CSPViolationReporter.getViolationStats()
    };
  }

  /**
   * Build CSP policy string
   */
  private buildCSPPolicy(req: IRequest, nonce?: string): string {
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
        directives['script-src'] = [...directives['script-src'], `'nonce-${nonce}'`];
      }
      if (directives['style-src']) {
        directives['style-src'] = [...directives['style-src'], `'nonce-${nonce}'`];
      }
    }

    // Add report URI
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
  private setAdditionalSecurityHeaders(res: IResponse): void {
    // X-Content-Type-Options
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    // X-Frame-Options (backup for frame-ancestors)
    res.setHeader('X-Frame-Options', 'DENY');
    
    // X-XSS-Protection
    res.setHeader('X-XSS-Protection', '1; mode=block');
    
    // Referrer Policy
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Permissions Policy (formerly Feature Policy)
    res.setHeader('Permissions-Policy', 
      'geolocation=(), microphone=(), camera=(), payment=()');
  }

  /**
   * Check if violation is healthcare-related
   */
  private isHealthcareViolation(report: CSPViolationReport): boolean {
    const uri = report['csp-report']['document-uri'];
    const blockedUri = report['csp-report']['blocked-uri'];
    
    const healthcareKeywords = [
      'patient', 'medical', 'healthcare', 'hipaa', 'phi', 
      'medication', 'diagnosis', 'treatment'
    ];

    return healthcareKeywords.some(keyword => 
      uri.toLowerCase().includes(keyword) || 
      blockedUri.toLowerCase().includes(keyword)
    );
  }

  /**
   * Audit logging
   */
  private auditLog(req: IRequest, policy: string, processingTime: number): void {
    const auditEntry = {
      timestamp: new Date().toISOString(),
      event: 'csp_policy_applied',
      requestId: req.correlationId || req.sessionId || 'unknown',
      userAgent: req.headers?.['user-agent'],
      ip: req.ip,
      path: req.path,
      method: req.method,
      policyLength: policy.length,
      processingTime,
      healthcareCompliance: this.config.healthcareCompliance,
      strictMode: this.config.strictMode
    };

    console.log('[CSP-AUDIT]', JSON.stringify(auditEntry));
  }
}

// Export default instance with healthcare compliance enabled
export default new CspMiddleware({
  healthcareCompliance: true,
  strictMode: true,
  enableNonce: true,
  reportUri: '/api/security/csp-violations'
});

/**
 * Export factory function for custom configurations
 */
export function createCspMiddleware(config: CSPConfig): CspMiddleware {
  return new CspMiddleware(config);
}

/**
 * Export violation report handler as standalone function
 */
export async function handleCspViolationReport(req: IRequest, res: IResponse): Promise<void> {
  const middleware = new CspMiddleware();
  return middleware.handleViolationReport(req, res);
}
