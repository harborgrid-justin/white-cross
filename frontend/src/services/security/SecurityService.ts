/**
 * Security Service
 *
 * Orchestrator for modular security components
 */

import { csrfProtection } from './CsrfProtection';
import { secureTokenManager } from './SecureTokenManager';
import { SanitizationManager } from './SanitizationManager';
import { EncryptionManager } from './EncryptionManager';
import { PHIManager } from './PHIManager';
import { SecurityConfigManager } from './SecurityConfigManager';

export class SecurityService {
  private static instance: SecurityService;

  // Core security services
  public readonly csrfProtection = csrfProtection;
  public readonly tokenManager = secureTokenManager;

  // Component managers
  private readonly sanitizationManager = new SanitizationManager();
  private readonly encryptionManager = new EncryptionManager();
  private readonly phiManager = new PHIManager();
  private readonly configManager = new SecurityConfigManager();

  private constructor() {}

  static getInstance(): SecurityService {
    if (!SecurityService.instance) {
      SecurityService.instance = new SecurityService();
    }
    return SecurityService.instance;
  }

  // ============================================================================
  // CSRF PROTECTION METHODS (DELEGATED)
  // ============================================================================

  /**
   * Generate CSRF token (enterprise-grade)
   */
  generateCSRFToken(): string {
    // Use refresh to get a fresh token
    this.csrfProtection.refreshToken();
    return this.csrfProtection.getToken() || '';
  }

  /**
   * Get current CSRF token
   */
  getCSRFToken(): string {
    return this.csrfProtection.getToken() || '';
  }

  /**
   * Validate CSRF token (not directly available, use token comparison)
   */
  validateCSRFToken(token: string): boolean {
    const currentToken = this.csrfProtection.getToken();
    return currentToken === token && !!token;
  }

  /**
   * Clear CSRF token
   */
  clearCSRFToken(): void {
    this.csrfProtection.clearToken();
  }

  /**
   * Legacy CSRF methods (backward compatibility)
   */
  generateCSRFTokenLegacy(): string {
    return this.generateCSRFTokenLib();
  }

  getCSRFTokenLegacy(): string {
    return this.getCSRFTokenLib();
  }

  validateCSRFTokenLegacy(token: string): boolean {
    return this.validateCSRFTokenLib(token);
  }

  clearCSRFTokenLegacy(): void {
    this.clearCSRFTokenLib();
  }

  // ============================================================================
  // TOKEN MANAGEMENT METHODS (DELEGATED)
  // ============================================================================

  /**
   * Set authentication tokens
   */
  setTokens(accessToken: string, refreshToken?: string, expiresIn?: number): void {
    this.tokenManager.setToken(accessToken, refreshToken, expiresIn);
  }

  /**
   * Get access token
   */
  getToken(): string | null {
    return this.tokenManager.getToken();
  }

  /**
   * Check if token is valid
   */
  isTokenValid(): boolean {
    return this.tokenManager.isTokenValid();
  }

  /**
   * Clear all tokens
   */
  clearTokens(): void {
    this.tokenManager.clearTokens();
  }

  /**
   * Get time until token expiration
   */
  getTimeUntilExpiration(): number {
    return this.tokenManager.getTimeUntilExpiration();
  }

  // ============================================================================
  // SANITIZATION METHODS (DELEGATED)
  // ============================================================================

  sanitizeHTML = this.sanitizationManager.sanitizeHTML.bind(this.sanitizationManager);
  sanitizeSQL = this.sanitizationManager.sanitizeSQL.bind(this.sanitizationManager);
  sanitizeFileName = this.sanitizationManager.sanitizeFileName.bind(this.sanitizationManager);
  sanitizeURL = this.sanitizationManager.sanitizeURL.bind(this.sanitizationManager);
  sanitizeEmail = this.sanitizationManager.sanitizeEmail.bind(this.sanitizationManager);
  sanitizePhone = this.sanitizationManager.sanitizePhone.bind(this.sanitizationManager);
  stripHTMLTags = this.sanitizationManager.stripHTMLTags.bind(this.sanitizationManager);
  sanitizeObject = this.sanitizationManager.sanitizeObject.bind(this.sanitizationManager);

  // ============================================================================
  // ENCRYPTION METHODS (DELEGATED)
  // ============================================================================

  encryptData = this.encryptionManager.encryptData.bind(this.encryptionManager);
  decryptData = this.encryptionManager.decryptData.bind(this.encryptionManager);
  hashData = this.encryptionManager.hashData.bind(this.encryptionManager);
  generateEncryptionKey = this.encryptionManager.generateEncryptionKey.bind(this.encryptionManager);

  // ============================================================================
  // PHI METHODS (DELEGATED)
  // ============================================================================

  containsPHI = this.phiManager.containsPHI.bind(this.phiManager);
  redactPHI = this.phiManager.redactPHI.bind(this.phiManager);

  // ============================================================================
  // CONFIGURATION ACCESS METHODS (DELEGATED)
  // ============================================================================

  getCSPHeader = this.configManager.getCSPHeader.bind(this.configManager);
  getSecurityHeaders = this.configManager.getSecurityHeaders.bind(this.configManager);
  getCORSConfig = this.configManager.getCORSConfig.bind(this.configManager);
  getRateLimitConfig = this.configManager.getRateLimitConfig.bind(this.configManager);
  getSessionConfig = this.configManager.getSessionConfig.bind(this.configManager);
  getPasswordPolicy = this.configManager.getPasswordPolicy.bind(this.configManager);
  getAuditConfig = this.configManager.getAuditConfig.bind(this.configManager);
  getUploadConfig = this.configManager.getUploadConfig.bind(this.configManager);
  getPHIPatterns = this.configManager.getPHIPatterns.bind(this.configManager);

  // ============================================================================
  // LEGACY UTILITY METHODS
  // ============================================================================

  /**
   * Generate CSRF token (legacy library version)
   */
  private generateCSRFTokenLib(): string {
    if (typeof window === 'undefined') return '';
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Get CSRF token (legacy library version)
   */
  private getCSRFTokenLib(): string {
    if (typeof window === 'undefined') return '';
    let token = sessionStorage.getItem('csrf_token');
    if (!token) {
      token = this.generateCSRFTokenLib();
      sessionStorage.setItem('csrf_token', token);
    }
    return token;
  }

  /**
   * Validate CSRF token (legacy library version)
   */
  private validateCSRFTokenLib(token: string): boolean {
    const storedToken = this.getCSRFTokenLib();
    return token === storedToken && token.length > 0;
  }

  /**
   * Clear CSRF token (legacy library version)
   */
  private clearCSRFTokenLib(): void {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('csrf_token');
    }
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

/**
 * Singleton instance of the security service
 */
export const securityService = SecurityService.getInstance();