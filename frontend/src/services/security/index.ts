/**
 * @fileoverview Security Services Barrel Export for Healthcare Platform
 * @module services/security
 * @category Services
 *
 * Centralized export point for all security services providing enterprise-grade
 * authentication, authorization, and CSRF protection for the White Cross healthcare
 * platform. All services are designed with HIPAA compliance and PHI protection as
 * primary requirements.
 *
 * Security Architecture:
 * - **Defense-in-Depth**: Multiple layers of security controls
 * - **Zero Trust**: Continuous verification of authentication and authorization
 * - **Least Privilege**: Minimal permissions required for operations
 * - **Secure by Default**: Safe configurations out of the box
 *
 * Available Security Services:
 *
 * **1. SecureTokenManager** - HIPAA-Compliant Token Management
 * - Secure token storage using sessionStorage (cleared on tab close)
 * - Automatic token expiration validation (JWT exp claim)
 * - Inactivity timeout enforcement (8 hours configurable)
 * - JWT parsing and validation
 * - Automatic cleanup on session end
 * - Migration from insecure localStorage
 *
 * **2. CsrfProtection** - Cross-Site Request Forgery Defense
 * - Automatic CSRF token injection for state-changing requests
 * - Meta tag and cookie-based token retrieval
 * - Synchronizer token pattern (OWASP recommended)
 * - Transparent integration with Axios interceptors
 * - Configurable for different backend frameworks
 *
 * Security Threat Mitigation:
 * - **Session Hijacking**: Session timeout, secure storage, activity tracking
 * - **CSRF Attacks**: Token validation on state-changing requests
 * - **Token Theft**: sessionStorage isolation, automatic expiration
 * - **Replay Attacks**: Token expiration, activity-based timeout
 * - **XSS Attacks**: Meta tag token source (not automatically sent)
 *
 * HIPAA Compliance Features:
 * - Automatic session timeout (8 hours inactivity)
 * - Secure credential storage (sessionStorage)
 * - Audit logging for authentication events
 * - PHI protection through secure transport
 * - Defense-in-depth security architecture
 *
 * Healthcare Safety:
 * - Prevents unauthorized access to patient health information
 * - Ensures only authenticated users can access PHI
 * - Protects critical healthcare operations from CSRF attacks
 * - Maintains audit trail for security compliance
 *
 * @example
 * ```typescript
 * // Token Management - Complete Authentication Flow
 * import { secureTokenManager } from '@/services/security';
 *
 * // After successful login
 * async function handleLogin(credentials: LoginCredentials) {
 *   const { accessToken, refreshToken, expiresIn } = await authApi.login(credentials);
 *   secureTokenManager.setToken(accessToken, refreshToken, expiresIn);
 *   redirectToDashboard();
 * }
 *
 * // Before accessing protected resource
 * function accessProtectedResource() {
 *   if (!secureTokenManager.isTokenValid()) {
 *     redirectToLogin();
 *     return;
 *   }
 *   const token = secureTokenManager.getToken();
 *   // Use token for authenticated request
 * }
 *
 * // On logout
 * async function handleLogout() {
 *   await authApi.logout();
 *   secureTokenManager.clearTokens();
 *   redirectToLogin();
 * }
 *
 * // Monitor session expiration
 * setInterval(() => {
 *   const remaining = secureTokenManager.getTimeUntilExpiration();
 *   if (remaining < 5 * 60 * 1000 && remaining > 0) {
 *     showSessionExpirationWarning();
 *   }
 * }, 60000);
 * ```
 *
 * @example
 * ```typescript
 * // CSRF Protection - Axios Integration
 * import { setupCsrfProtection, csrfProtection } from '@/services/security';
 * import { apiInstance } from '@/services/config/apiConfig';
 *
 * // Setup CSRF protection on API instance (done once at app initialization)
 * setupCsrfProtection(apiInstance);
 *
 * // Now all POST/PUT/PATCH/DELETE requests automatically include CSRF token
 * await apiInstance.post('/api/patients', patientData); // CSRF token auto-injected
 *
 * // Manual token refresh after login (token may have changed)
 * async function afterLogin() {
 *   await loginUser(credentials);
 *   csrfProtection.refreshToken(); // Get new CSRF token for session
 * }
 *
 * // Check token status for debugging
 * const tokenInfo = csrfProtection.getTokenInfo();
 * if (tokenInfo.hasToken) {
 *   console.log('CSRF token age:', tokenInfo.age, 'ms');
 *   console.log('Expires at:', new Date(tokenInfo.expiresAt));
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Combined Security Setup - Application Initialization
 * import { setupCsrfProtection, secureTokenManager } from '@/services/security';
 * import { apiInstance } from '@/services/config/apiConfig';
 *
 * // Initialize security services at app startup
 * function initializeSecurity() {
 *   // Setup CSRF protection
 *   setupCsrfProtection(apiInstance);
 *
 *   // Check for existing valid token (page refresh)
 *   if (secureTokenManager.isTokenValid()) {
 *     console.log('Valid session found');
 *     return true;
 *   } else {
 *     console.log('No valid session, redirecting to login');
 *     redirectToLogin();
 *     return false;
 *   }
 * }
 * ```
 *
 * Security Best Practices:
 * - Always validate tokens before accessing protected resources
 * - Clear all tokens on logout or authentication errors
 * - Use CSRF protection for all state-changing API operations
 * - Monitor token expiration and refresh proactively
 * - Implement proper error handling for security failures
 * - Never log tokens or sensitive authentication data
 * - Use HTTPS in production for all API communications
 * - Implement rate limiting on authentication endpoints
 *
 * @see {@link SecureTokenManager} for token management implementation
 * @see {@link CsrfProtection} for CSRF protection implementation
 */

/**
 * Secure Token Manager exports
 *
 * @description
 * Exports for HIPAA-compliant token management with automatic expiration,
 * inactivity timeout, and secure storage.
 */
export {
  SecureTokenManager,
  secureTokenManager,
  type default as SecureTokenManagerDefault,
} from './SecureTokenManager';

/**
 * CSRF Protection exports
 *
 * @description
 * Exports for Cross-Site Request Forgery protection with automatic token
 * injection and multiple token source support.
 */
export {
  CsrfProtection,
  csrfProtection,
  setupCsrfProtection,
  type default as CsrfProtectionDefault,
} from './CsrfProtection';
