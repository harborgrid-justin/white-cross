/**
 * @fileoverview Token Migration Module
 * @module services/security/tokenManager/migration
 * @category Security - Token Management
 */

import { TokenStorage } from './storage';
import { JwtParser, TokenValidator } from './validation';
import type { TokenMetadata } from './types';

/**
 * Token migration utilities for upgrading from localStorage to sessionStorage
 * 
 * Handles one-time migration of legacy tokens stored in localStorage to the
 * more secure sessionStorage. This ensures backward compatibility while
 * upgrading security posture.
 */
export class TokenMigration {
  /**
   * Perform migration from localStorage to sessionStorage
   * 
   * Performs one-time migration of legacy tokens stored in localStorage
   * to the more secure sessionStorage. Validates token expiration before
   * migration and removes expired tokens.
   * 
   * Security Upgrade:
   * - localStorage persists across browser sessions (security risk)
   * - sessionStorage is cleared when browser/tab closes (more secure)
   * - Migration is automatic and transparent to users
   * 
   * HIPAA Compliance:
   * - Reduces token persistence window
   * - Limits exposure of authentication credentials
   * - Aligns with minimum necessary access principle
   * 
   * @returns True if migration was performed, false if no migration needed
   */
  static migrateFromLocalStorage(): boolean {
    if (typeof window === 'undefined') {
      console.info('[TokenMigration] Skipping migration - not in browser environment');
      return false;
    }

    try {
      // Check if tokens already exist in sessionStorage
      if (TokenStorage.hasTokenData()) {
        console.info('[TokenMigration] SessionStorage tokens already exist, skipping migration');
        return false;
      }

      // Get legacy tokens
      const legacyTokens = TokenStorage.getLegacyTokens();
      if (!legacyTokens) {
        console.info('[TokenMigration] No legacy tokens found to migrate');
        return false;
      }

      // Validate token format
      if (!JwtParser.isValidFormat(legacyTokens.token)) {
        console.warn('[TokenMigration] Legacy token has invalid format, removing');
        TokenStorage.removeLegacyTokens();
        return false;
      }

      // Parse JWT to get expiration
      const expiration = JwtParser.parseExpiration(legacyTokens.token);

      if (expiration && expiration > Date.now()) {
        // Token is still valid, create metadata and migrate
        const metadata = TokenValidator.createTokenMetadata(
          legacyTokens.token,
          legacyTokens.refreshToken
        );

        TokenStorage.setTokenData(metadata);
        TokenStorage.updateZustandStorage(legacyTokens.token);
        TokenStorage.removeLegacyTokens();

        console.info('[TokenMigration] Successfully migrated tokens from localStorage to sessionStorage', {
          hasRefreshToken: !!legacyTokens.refreshToken,
          expiresAt: new Date(expiration).toISOString(),
        });

        return true;
      } else {
        // Token expired, just remove it
        TokenStorage.removeLegacyTokens();
        console.info('[TokenMigration] Removed expired legacy tokens');
        return false;
      }
    } catch (error) {
      console.error('[TokenMigration] Failed to migrate tokens:', error);
      
      // Clear legacy tokens on error to prevent retry loops
      TokenStorage.removeLegacyTokens();
      return false;
    }
  }

  /**
   * Check if migration is needed
   * 
   * @returns True if legacy tokens exist and migration should be attempted
   */
  static isMigrationNeeded(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    // Don't migrate if current tokens already exist
    if (TokenStorage.hasTokenData()) {
      return false;
    }

    // Check if legacy tokens exist
    return !!TokenStorage.getLegacyTokens();
  }

  /**
   * Get migration status information
   * 
   * @returns Object with migration status details
   */
  static getMigrationStatus(): {
    hasLegacyTokens: boolean;
    hasCurrentTokens: boolean;
    migrationNeeded: boolean;
    legacyTokenValid: boolean;
  } {
    if (typeof window === 'undefined') {
      return {
        hasLegacyTokens: false,
        hasCurrentTokens: false,
        migrationNeeded: false,
        legacyTokenValid: false,
      };
    }

    const hasLegacyTokens = !!TokenStorage.getLegacyTokens();
    const hasCurrentTokens = TokenStorage.hasTokenData();
    const migrationNeeded = TokenMigration.isMigrationNeeded();

    let legacyTokenValid = false;
    if (hasLegacyTokens) {
      try {
        const legacyTokens = TokenStorage.getLegacyTokens();
        if (legacyTokens && JwtParser.isValidFormat(legacyTokens.token)) {
          const expiration = JwtParser.parseExpiration(legacyTokens.token);
          legacyTokenValid = !!(expiration && expiration > Date.now());
        }
      } catch {
        legacyTokenValid = false;
      }
    }

    return {
      hasLegacyTokens,
      hasCurrentTokens,
      migrationNeeded,
      legacyTokenValid,
    };
  }

  /**
   * Force clean migration - removes all tokens and starts fresh
   * 
   * Useful for debugging or when migration fails repeatedly.
   * Removes all tokens from both localStorage and sessionStorage.
   */
  static forceCleanMigration(): void {
    console.warn('[TokenMigration] Performing force clean migration - all tokens will be removed');
    
    TokenStorage.clearAllTokens();
    
    console.info('[TokenMigration] Force clean migration completed');
  }

  /**
   * Validate current storage state and fix inconsistencies
   * 
   * Checks for and resolves common storage inconsistencies:
   * - Orphaned tokens without metadata
   * - Expired tokens still in storage
   * - Mismatched token/metadata pairs
   * 
   * @returns Object with validation results and actions taken
   */
  static validateAndRepairStorage(): {
    hadInconsistencies: boolean;
    actionsPerformed: string[];
    finalState: 'valid' | 'empty' | 'invalid';
  } {
    const actionsPerformed: string[] = [];
    let hadInconsistencies = false;

    try {
      const metadata = TokenStorage.getTokenMetadata();
      
      if (!metadata) {
        // No metadata but check if orphaned tokens exist
        if (typeof sessionStorage !== 'undefined') {
          const hasOrphanedToken = !!(
            sessionStorage.getItem('secure_auth_token') ||
            sessionStorage.getItem('secure_refresh_token')
          );
          
          if (hasOrphanedToken) {
            hadInconsistencies = true;
            TokenStorage.clearAllTokens();
            actionsPerformed.push('Removed orphaned tokens without metadata');
          }
        }
        
        return {
          hadInconsistencies,
          actionsPerformed,
          finalState: 'empty',
        };
      }

      // Validate token in metadata
      const validationResult = TokenValidator.validateToken(metadata);
      
      if (!validationResult.isValid) {
        hadInconsistencies = true;
        TokenStorage.clearAllTokens();
        actionsPerformed.push(`Removed invalid token: ${validationResult.reason}`);
        
        return {
          hadInconsistencies,
          actionsPerformed,
          finalState: 'empty',
        };
      }

      // Check for format issues
      if (!JwtParser.isValidFormat(metadata.token)) {
        hadInconsistencies = true;
        TokenStorage.clearAllTokens();
        actionsPerformed.push('Removed token with invalid JWT format');
        
        return {
          hadInconsistencies,
          actionsPerformed,
          finalState: 'empty',
        };
      }

      return {
        hadInconsistencies,
        actionsPerformed,
        finalState: 'valid',
      };
    } catch (error) {
      console.error('[TokenMigration] Error during storage validation:', error);
      
      hadInconsistencies = true;
      TokenStorage.clearAllTokens();
      actionsPerformed.push('Cleared all tokens due to validation error');
      
      return {
        hadInconsistencies,
        actionsPerformed,
        finalState: 'empty',
      };
    }
  }

  /**
   * Initialize migration system
   * 
   * Performs initial migration check and storage validation.
   * Should be called once during application startup.
   * 
   * @returns Summary of initialization actions
   */
  static initialize(): {
    migrationPerformed: boolean;
    repairPerformed: boolean;
    finalStatus: 'ready' | 'empty' | 'error';
    details: string[];
  } {
    const details: string[] = [];
    let migrationPerformed = false;
    let repairPerformed = false;
    let finalStatus: 'ready' | 'empty' | 'error' = 'empty';

    try {
      // First, validate and repair current storage
      const repairResult = TokenMigration.validateAndRepairStorage();
      if (repairResult.hadInconsistencies) {
        repairPerformed = true;
        details.push(...repairResult.actionsPerformed);
      }

      // Then attempt migration if needed
      if (TokenMigration.isMigrationNeeded()) {
        migrationPerformed = TokenMigration.migrateFromLocalStorage();
        if (migrationPerformed) {
          details.push('Legacy tokens migrated to sessionStorage');
          finalStatus = 'ready';
        }
      } else {
        // Check if we have valid tokens after repair
        if (repairResult.finalState === 'valid') {
          finalStatus = 'ready';
          details.push('Existing tokens validated');
        }
      }

      return {
        migrationPerformed,
        repairPerformed,
        finalStatus,
        details,
      };
    } catch (error) {
      console.error('[TokenMigration] Error during initialization:', error);
      details.push('Initialization failed with error');
      
      return {
        migrationPerformed: false,
        repairPerformed: false,
        finalStatus: 'error',
        details,
      };
    }
  }
}
