/**
 * @fileoverview Token Validation Module
 * @module services/security/tokenManager/validation
 * @category Security - Token Management
 */

import { SECURITY_CONFIG } from '../../../constants/config';
import type { TokenMetadata, TokenValidationResult } from './types';

/**
 * JWT token utilities for client-side parsing and validation
 * 
 * Note: Client-side JWT parsing is for convenience only. Server MUST
 * validate JWT signature and expiration for security. This is defense-in-depth.
 */
export class JwtParser {
  /**
   * Parse JWT token to extract expiration time
   * 
   * Decodes JWT payload to extract 'exp' claim (expiration timestamp).
   * Converts Unix timestamp (seconds) to JavaScript timestamp (milliseconds).
   * 
   * @param token - JWT token string (format: header.payload.signature)
   * @returns Expiration timestamp in milliseconds, or null if parsing fails
   */
  static parseExpiration(token: string): number | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.warn('[JwtParser] Invalid JWT format: expected 3 parts');
        return null;
      }

      const payload = JSON.parse(atob(parts[1]!));
      if (payload.exp && typeof payload.exp === 'number') {
        return payload.exp * 1000; // Convert seconds to milliseconds
      }

      console.warn('[JwtParser] JWT missing or invalid exp claim');
      return null;
    } catch (error) {
      console.warn('[JwtParser] Failed to parse JWT expiration:', error);
      return null;
    }
  }

  /**
   * Validate JWT format without signature verification
   * 
   * Performs basic format validation to ensure token is a valid JWT structure.
   * Does NOT validate signature - this is for client-side convenience only.
   * 
   * @param token - JWT token to validate
   * @returns True if format is valid, false otherwise
   */
  static isValidFormat(token: string): boolean {
    if (!token || typeof token !== 'string') {
      return false;
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      return false;
    }

    try {
      // Validate base64 encoding of header and payload
      JSON.parse(atob(parts[0]!)); // Header
      JSON.parse(atob(parts[1]!)); // Payload
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Extract all claims from JWT payload
   * 
   * @param token - JWT token to parse
   * @returns JWT payload object or null if parsing fails
   */
  static parsePayload(token: string): Record<string, unknown> | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }

      return JSON.parse(atob(parts[1]!));
    } catch (error) {
      console.warn('[JwtParser] Failed to parse JWT payload:', error);
      return null;
    }
  }
}

/**
 * Token validation and expiration checking
 * 
 * Provides comprehensive validation of token expiration and inactivity
 * timeout for HIPAA-compliant session management.
 */
export class TokenValidator {
  /**
   * Validate token expiration and activity timeout
   * 
   * Performs comprehensive validation of token expiration and inactivity
   * timeout. Used internally by getToken() and externally for manual
   * session validation checks.
   * 
   * Validation Criteria:
   * 1. Token metadata exists and is valid
   * 2. Current time is before token expiration (JWT exp claim)
   * 3. Session hasn't exceeded 8-hour inactivity timeout
   * 
   * @param metadata - Token metadata to validate
   * @returns Detailed validation result with reason for failure
   */
  static validateToken(metadata: TokenMetadata): TokenValidationResult {
    if (!metadata) {
      return {
        isValid: false,
        reason: 'missing',
      };
    }

    if (!metadata.token || typeof metadata.token !== 'string') {
      return {
        isValid: false,
        reason: 'invalid',
      };
    }

    const now = Date.now();

    // Check token expiration
    if (now >= metadata.expiresAt) {
      return {
        isValid: false,
        reason: 'expired',
        timeUntilExpiration: 0,
        timeSinceActivity: now - metadata.lastActivity,
      };
    }

    // Check inactivity timeout (8 hours from SECURITY_CONFIG)
    const inactivityThreshold = metadata.lastActivity + SECURITY_CONFIG.INACTIVITY_TIMEOUT;
    if (now >= inactivityThreshold) {
      return {
        isValid: false,
        reason: 'inactive',
        timeUntilExpiration: metadata.expiresAt - now,
        timeSinceActivity: now - metadata.lastActivity,
      };
    }

    return {
      isValid: true,
      timeUntilExpiration: metadata.expiresAt - now,
      timeSinceActivity: now - metadata.lastActivity,
    };
  }

  /**
   * Check if token is valid (boolean result)
   * 
   * Simplified validation that returns only boolean result.
   * Use validateToken() for detailed validation information.
   * 
   * @param metadata - Token metadata to validate
   * @returns True if token is valid, false otherwise
   */
  static isTokenValid(metadata: TokenMetadata | null): boolean {
    if (!metadata) {
      return false;
    }

    const result = TokenValidator.validateToken(metadata);
    return result.isValid;
  }

  /**
   * Get time remaining until token expiration
   * 
   * @param metadata - Token metadata
   * @returns Milliseconds until expiration, or 0 if expired/invalid
   */
  static getTimeUntilExpiration(metadata: TokenMetadata | null): number {
    if (!metadata) {
      return 0;
    }

    const remaining = metadata.expiresAt - Date.now();
    return remaining > 0 ? remaining : 0;
  }

  /**
   * Get time since last activity
   * 
   * @param metadata - Token metadata
   * @returns Milliseconds since last activity, or 0 if no token
   */
  static getTimeSinceActivity(metadata: TokenMetadata | null): number {
    if (!metadata) {
      return 0;
    }

    return Date.now() - metadata.lastActivity;
  }

  /**
   * Check if token expires soon (within threshold)
   * 
   * @param metadata - Token metadata
   * @param thresholdMs - Threshold in milliseconds (default: 5 minutes)
   * @returns True if token expires within threshold
   */
  static isExpiringSoon(metadata: TokenMetadata | null, thresholdMs: number = 5 * 60 * 1000): boolean {
    if (!metadata) {
      return false;
    }

    const timeUntilExpiration = TokenValidator.getTimeUntilExpiration(metadata);
    return timeUntilExpiration > 0 && timeUntilExpiration <= thresholdMs;
  }

  /**
   * Check if session is approaching inactivity timeout
   * 
   * @param metadata - Token metadata
   * @param warningThresholdMs - Warning threshold in milliseconds (default: 30 minutes)
   * @returns True if approaching inactivity timeout
   */
  static isApproachingInactivityTimeout(
    metadata: TokenMetadata | null, 
    warningThresholdMs: number = 30 * 60 * 1000
  ): boolean {
    if (!metadata) {
      return false;
    }

    const timeSinceActivity = TokenValidator.getTimeSinceActivity(metadata);
    const inactivityTimeoutMs = SECURITY_CONFIG.INACTIVITY_TIMEOUT;
    const timeUntilTimeout = inactivityTimeoutMs - timeSinceActivity;

    return timeUntilTimeout > 0 && timeUntilTimeout <= warningThresholdMs;
  }

  /**
   * Create token metadata from token and optional parameters
   * 
   * @param token - JWT token string
   * @param refreshToken - Optional refresh token
   * @param expiresIn - Optional custom expiration in seconds
   * @returns Token metadata object
   * @throws Error if token is invalid or expired
   */
  static createTokenMetadata(
    token: string, 
    refreshToken?: string, 
    expiresIn?: number
  ): TokenMetadata {
    if (!token || typeof token !== 'string') {
      throw new Error('[TokenValidator] Invalid token provided');
    }

    if (!JwtParser.isValidFormat(token)) {
      throw new Error('[TokenValidator] Token format is invalid');
    }

    const now = Date.now();
    let expirationTime: number;

    if (expiresIn) {
      expirationTime = now + (expiresIn * 1000);
    } else {
      const jwtExpiration = JwtParser.parseExpiration(token);
      expirationTime = jwtExpiration || (now + (24 * 60 * 60 * 1000)); // Default 24 hours
    }

    // Validate token isn't already expired
    if (expirationTime <= now) {
      throw new Error('[TokenValidator] Cannot create metadata for expired token');
    }

    return {
      token,
      refreshToken,
      issuedAt: now,
      expiresAt: expirationTime,
      lastActivity: now,
    };
  }

  /**
   * Update activity timestamp in metadata
   * 
   * @param metadata - Current token metadata
   * @returns Updated metadata with current activity timestamp
   */
  static updateActivity(metadata: TokenMetadata): TokenMetadata {
    return {
      ...metadata,
      lastActivity: Date.now(),
    };
  }
}
