/**
 * WF-COMP-SEC-000 | index.ts - Security Services Barrel Export
 * Purpose: Centralized export point for all security services
 * Security: Production-ready security modules for healthcare platform
 * Upstream: None | Dependencies: Child security modules
 * Downstream: All services, API clients, authentication flows | Called by: Application-wide
 * Related: SecureTokenManager.ts, CsrfProtection.ts
 * Exports: All security services and utilities
 * Last Updated: 2025-10-21 | File Type: .ts
 * Critical Path: Import → Security service access → Application security
 * LLM Context: Barrel export for security-critical modules, HIPAA compliance
 */

// Secure Token Manager
export {
  SecureTokenManager,
  secureTokenManager,
  type default as SecureTokenManagerDefault,
} from './SecureTokenManager';

// CSRF Protection
export {
  CsrfProtection,
  csrfProtection,
  setupCsrfProtection,
  type default as CsrfProtectionDefault,
} from './CsrfProtection';

/**
 * Security Services Summary
 *
 * This module provides enterprise-grade security services for the White Cross healthcare platform.
 * All services are designed with HIPAA compliance and PHI protection in mind.
 *
 * Available Services:
 *
 * 1. SecureTokenManager
 *    - Secure token storage using sessionStorage
 *    - Automatic expiration validation
 *    - Inactivity timeout (8 hours)
 *    - JWT parsing and validation
 *    - Automatic cleanup on session end
 *
 * 2. CsrfProtection
 *    - Cross-Site Request Forgery protection
 *    - Automatic token injection for state-changing requests
 *    - Meta tag and cookie token retrieval
 *    - Configurable and extensible
 *
 * Usage Examples:
 *
 * ```typescript
 * // Token Management
 * import { secureTokenManager } from '@/services/security';
 *
 * secureTokenManager.setToken(token, refreshToken);
 * const currentToken = secureTokenManager.getToken();
 * const isValid = secureTokenManager.isTokenValid();
 * secureTokenManager.clearTokens();
 *
 * // CSRF Protection
 * import { setupCsrfProtection } from '@/services/security';
 * import { apiInstance } from '@/services/config/apiConfig';
 *
 * setupCsrfProtection(apiInstance);
 * ```
 *
 * Security Best Practices:
 * - Always validate tokens before making authenticated requests
 * - Clear tokens on logout or session expiration
 * - Use CSRF protection for all state-changing operations
 * - Monitor token expiration and refresh proactively
 * - Implement proper error handling for security failures
 *
 * HIPAA Compliance:
 * - All modules implement defense-in-depth security
 * - sessionStorage used instead of localStorage for better security
 * - Automatic cleanup prevents token persistence
 * - Comprehensive audit logging for security events
 */
