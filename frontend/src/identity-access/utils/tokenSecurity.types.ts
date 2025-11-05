/**
 * WF-COMP-354 | tokenSecurity.types.ts - Type definitions for token security
 * Purpose: Type definitions and interfaces for secure token management
 * Upstream: ../types | Dependencies: ../types
 * Downstream: tokenSecurity modules | Called by: Token security utilities
 * Related: tokenSecurity.storage, tokenSecurity.encryption, tokenSecurity.validation
 * Exports: TokenData, EncryptedTokenData interfaces | Key Features: Type safety
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Type definitions for token operations
 * LLM Context: Type definitions module for token security system
 */

import { User } from '@/types';

/**
 * Token data structure with user information and expiration metadata
 */
export interface TokenData {
  token: string
  user: User
  expiresAt: number
  issuedAt: number
}

/**
 * Encrypted token data structure for secure storage
 */
export interface EncryptedTokenData {
  data: string
  iv: string
  timestamp: number
}

/**
 * Configuration constants for token security
 */
export const TOKEN_SECURITY_CONFIG = {
  STORAGE_KEY: 'auth_data',
  ENCRYPTION_KEY_NAME: 'auth_encryption_key',
  TOKEN_EXPIRY_BUFFER: 5 * 60 * 1000, // 5 minutes buffer
  DEFAULT_TOKEN_LIFETIME: 24 * 60 * 60 * 1000, // 24 hours
  LEGACY_TOKEN_KEYS: ['auth_token', 'token', 'authToken'],
  LEGACY_USER_KEY: 'user'
} as const;
