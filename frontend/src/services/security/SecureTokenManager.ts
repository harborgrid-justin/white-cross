/**
 * WF-COMP-SEC-001 | SecureTokenManager.ts - Secure Token Management Service
 * Purpose: HIPAA-compliant token storage and validation with automatic expiration
 * Security: Uses sessionStorage for enhanced security, implements inactivity timeout
 * Upstream: ../../constants/config | Dependencies: SECURITY_CONFIG
 * Downstream: Authentication services, API clients | Called by: Auth flows, API interceptors
 * Related: authApi.ts, apiConfig.ts, ApiClient.ts
 * Exports: SecureTokenManager class, secureTokenManager singleton | Key Features: Session-based storage, auto-cleanup
 * Last Updated: 2025-11-11 | File Type: .ts
 * Critical Path: Token storage → Validation → Automatic cleanup → Session management
 * LLM Context: Security-critical module for healthcare platform, HIPAA compliance required
 * Architecture: Refactored to modular architecture - delegates to tokenManager modules
 */

// Re-export from the new modular architecture for backward compatibility
export { 
  SecureTokenManager, 
  secureTokenManager,
  TokenStorage,
  TokenValidator, 
  JwtParser,
  TokenMigration,
  ActivityTracker
} from './tokenManager';

// Re-export types for backward compatibility
export type { 
  TokenMetadata,
  ZustandAuthStorage,
  StorageKeys,
  TokenValidationResult 
} from './tokenManager/types';

// Default export for backward compatibility
export { secureTokenManager as default } from './tokenManager';

/**
 * REFACTORING NOTICE
 * 
 * This file has been refactored from a monolithic 934-line implementation
 * to a modular architecture with the following structure:
 * 
 * ./tokenManager/
 * ├── types.ts              (Type definitions)
 * ├── storage.ts            (Token storage operations)
 * ├── validation.ts         (JWT parsing & validation)
 * ├── migration.ts          (Legacy storage migration)
 * ├── activityTracker.ts    (Session timeout monitoring)
 * └── index.ts              (Main orchestrator class)
 * 
 * Benefits:
 * - Improved maintainability with single responsibility modules
 * - Better testability with isolated functionality
 * - Enhanced code reusability across the application
 * - Easier debugging and monitoring
 * - Cleaner separation of concerns
 * 
 * All existing APIs remain unchanged for backward compatibility.
 * Applications can continue importing from this file without modifications.
 * 
 * For new code, prefer importing directly from the modular structure:
 * import { secureTokenManager } from '@/services/security/tokenManager';
 */
