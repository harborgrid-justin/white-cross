/**
 * @fileoverview Security Middleware Module Exports
 * @module middleware/security
 * @description Central export point for all security middleware, guards, and configurations.
 * Provides healthcare-compliant security features including CSP, CORS, security headers,
 * rate limiting, and CSRF protection.
 */

// Module
export { SecurityModule } from './security.module';

// Middleware
export { CspMiddleware, HealthcareCSPPolicies, CSPNonceGenerator, CSPViolationReporter } from './csp.middleware';
export type { CSPConfig, CSPDirectives, CSPViolationReport, CSPMetrics } from './csp.middleware';

export { CorsMiddleware, CorsMethod, DEFAULT_CORS_CONFIG } from './cors.middleware';
export type { ICorsConfig } from './cors.middleware';

export { SecurityHeadersMiddleware, DEFAULT_SECURITY_CONFIG } from './security-headers.middleware';
export type { SecurityHeadersConfig } from './security-headers.middleware';

// Guards
export { RateLimitGuard, RateLimit, RATE_LIMIT_CONFIGS } from './rate-limit.guard';
export type { RateLimitConfig, RateLimitInfo } from './rate-limit.guard';

export { CsrfGuard, SkipCsrf } from './csrf.guard';
export type { CSRFConfig } from './csrf.guard';
