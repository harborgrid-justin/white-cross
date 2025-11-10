/**
 * LOC: IAM-APIKEYS-001
 * File: /reuse/iam-api-keys-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - API authentication services
 *   - API key management controllers
 *   - Rate limiting middleware
 *   - API gateway services
 */

/**
 * File: /reuse/iam-api-keys-kit.ts
 * Locator: WC-IAM-APIKEYS-001
 * Purpose: Comprehensive API Keys Management Kit - Complete API key lifecycle toolkit
 *
 * Upstream: Independent utility module for API key operations
 * Downstream: ../backend/*, API services, Controllers, Guards, Rate limiters
 * Dependencies: TypeScript 5.x, Node 18+, crypto, @nestjs/common
 * Exports: 45 utility functions for API key generation, validation, rotation, scoping, rate limiting
 *
 * LLM Context: Enterprise-grade API key management utilities for White Cross healthcare platform.
 * Provides secure API key generation, validation, rotation, scoping, rate limiting, expiration,
 * revocation, multi-key support, metadata tracking, usage analytics, and NestJS authentication guards.
 * HIPAA-compliant API access patterns for secure healthcare API integration.
 */

import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface ApiKey {
  id: string;
  key: string;
  hashedKey: string;
  name: string;
  description?: string;
  userId: string;
  clientId?: string;
  scopes: string[];
  rateLimit: RateLimitConfig;
  createdAt: Date;
  expiresAt?: Date;
  lastUsedAt?: Date;
  isActive: boolean;
  metadata: Record<string, any>;
}

export interface RateLimitConfig {
  maxRequests: number;
  windowSeconds: number;
  burstLimit?: number;
}

export interface ApiKeyGenerationOptions {
  name: string;
  description?: string;
  userId: string;
  clientId?: string;
  scopes?: string[];
  expiresIn?: number; // seconds
  rateLimit?: RateLimitConfig;
  metadata?: Record<string, any>;
}

export interface ApiKeyValidationResult {
  valid: boolean;
  apiKey?: ApiKey;
  error?: string;
  remainingRequests?: number;
}

export interface ApiKeyRotationResult {
  oldKey: ApiKey;
  newKey: ApiKey;
  rotatedAt: Date;
}

export interface ApiKeyScopeCheck {
  hasScope: boolean;
  missingScopes: string[];
  grantedScopes: string[];
}

export interface ApiKeyUsageStats {
  apiKeyId: string;
  totalRequests: number;
  requestsByEndpoint: Record<string, number>;
  requestsByDay: Record<string, number>;
  averageResponseTime: number;
  errorCount: number;
  lastRequestAt?: Date;
}

export interface ApiKeyMetadata {
  ipWhitelist?: string[];
  userAgent?: string;
  allowedOrigins?: string[];
  customFields?: Record<string, any>;
}

export interface RateLimitState {
  apiKeyId: string;
  windowStart: Date;
  requestCount: number;
  burstCount: number;
  nextResetAt: Date;
}

export interface ApiKeyRevocationOptions {
  reason?: string;
  revokedBy?: string;
  notifyUser?: boolean;
}

export interface ApiKeyListOptions {
  userId?: string;
  clientId?: string;
  isActive?: boolean;
  includeExpired?: boolean;
  scopes?: string[];
  limit?: number;
  offset?: number;
}

export interface ApiKeyPrefix {
  environment: 'prod' | 'dev' | 'test';
  type: 'public' | 'secret';
  version: string;
}

// ============================================================================
// API KEY GENERATION
// ============================================================================

/**
 * Generates a new secure API key with customizable options.
 *
 * @param {ApiKeyGenerationOptions} options - API key generation options
 * @returns {ApiKey} Generated API key object
 *
 * @example
 * ```typescript
 * const apiKey = generateApiKey({
 *   name: 'Production API Key',
 *   userId: 'user123',
 *   scopes: ['read:patients', 'write:records'],
 *   expiresIn: 86400 * 365, // 1 year
 *   rateLimit: { maxRequests: 1000, windowSeconds: 3600 }
 * });
 * ```
 */
export const generateApiKey = (options: ApiKeyGenerationOptions): ApiKey => {
  const id = `key_${crypto.randomBytes(16).toString('hex')}`;
  const key = generateSecureApiKey();
  const hashedKey = hashApiKey(key);

  return {
    id,
    key,
    hashedKey,
    name: options.name,
    description: options.description,
    userId: options.userId,
    clientId: options.clientId,
    scopes: options.scopes || [],
    rateLimit: options.rateLimit || { maxRequests: 100, windowSeconds: 60 },
    createdAt: new Date(),
    expiresAt: options.expiresIn
      ? new Date(Date.now() + options.expiresIn * 1000)
      : undefined,
    isActive: true,
    metadata: options.metadata || {},
  };
};

/**
 * Generates a secure random API key with prefix.
 *
 * @param {ApiKeyPrefix} [prefix] - Optional key prefix configuration
 * @returns {string} Secure API key string
 *
 * @example
 * ```typescript
 * const key = generateSecureApiKey({
 *   environment: 'prod',
 *   type: 'secret',
 *   version: 'v1'
 * });
 * // Result: 'prod_secret_v1_abcd1234...'
 * ```
 */
export const generateSecureApiKey = (prefix?: ApiKeyPrefix): string => {
  const randomPart = crypto.randomBytes(32).toString('base64url');

  if (prefix) {
    return `${prefix.environment}_${prefix.type}_${prefix.version}_${randomPart}`;
  }

  return `wc_${randomPart}`;
};

/**
 * Hashes API key for secure storage using SHA-256.
 *
 * @param {string} apiKey - Plain text API key
 * @returns {string} Hashed API key
 *
 * @example
 * ```typescript
 * const hashed = hashApiKey('wc_abc123...');
 * // Store hashed version in database, never plain text
 * ```
 */
export const hashApiKey = (apiKey: string): string => {
  return crypto.createHash('sha256').update(apiKey).digest('hex');
};

/**
 * Generates multiple API keys for a user with different scopes.
 *
 * @param {string} userId - User identifier
 * @param {Array<{name: string, scopes: string[]}>} keyConfigs - Key configurations
 * @returns {ApiKey[]} Array of generated API keys
 *
 * @example
 * ```typescript
 * const keys = generateMultipleApiKeys('user123', [
 *   { name: 'Read-only Key', scopes: ['read:patients'] },
 *   { name: 'Admin Key', scopes: ['read:*', 'write:*'] }
 * ]);
 * ```
 */
export const generateMultipleApiKeys = (
  userId: string,
  keyConfigs: Array<{ name: string; scopes: string[]; rateLimit?: RateLimitConfig }>
): ApiKey[] => {
  return keyConfigs.map((config) =>
    generateApiKey({
      name: config.name,
      userId,
      scopes: config.scopes,
      rateLimit: config.rateLimit,
    })
  );
};

/**
 * Creates an API key from an existing key string (for import/migration).
 *
 * @param {string} existingKey - Existing API key string
 * @param {ApiKeyGenerationOptions} options - API key options
 * @returns {ApiKey} API key object
 *
 * @example
 * ```typescript
 * const imported = createApiKeyFromExisting('legacy_key_123', {
 *   name: 'Imported Legacy Key',
 *   userId: 'user456',
 *   scopes: ['read:patients']
 * });
 * ```
 */
export const createApiKeyFromExisting = (
  existingKey: string,
  options: ApiKeyGenerationOptions
): ApiKey => {
  const id = `key_${crypto.randomBytes(16).toString('hex')}`;
  const hashedKey = hashApiKey(existingKey);

  return {
    id,
    key: existingKey,
    hashedKey,
    name: options.name,
    description: options.description,
    userId: options.userId,
    clientId: options.clientId,
    scopes: options.scopes || [],
    rateLimit: options.rateLimit || { maxRequests: 100, windowSeconds: 60 },
    createdAt: new Date(),
    expiresAt: options.expiresIn
      ? new Date(Date.now() + options.expiresIn * 1000)
      : undefined,
    isActive: true,
    metadata: options.metadata || {},
  };
};

// ============================================================================
// API KEY VALIDATION
// ============================================================================

/**
 * Validates an API key against stored hash and checks expiration.
 *
 * @param {string} providedKey - API key to validate
 * @param {ApiKey} storedKey - Stored API key object
 * @returns {ApiKeyValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateApiKey(requestApiKey, storedApiKey);
 * if (result.valid) {
 *   // Allow access
 * }
 * ```
 */
export const validateApiKey = (
  providedKey: string,
  storedKey: ApiKey
): ApiKeyValidationResult => {
  // Check if key is active
  if (!storedKey.isActive) {
    return { valid: false, error: 'API key is inactive' };
  }

  // Check hash match
  const providedHash = hashApiKey(providedKey);
  if (providedHash !== storedKey.hashedKey) {
    return { valid: false, error: 'Invalid API key' };
  }

  // Check expiration
  if (storedKey.expiresAt && new Date() > storedKey.expiresAt) {
    return { valid: false, error: 'API key has expired' };
  }

  return { valid: true, apiKey: storedKey };
};

/**
 * Validates API key format and structure.
 *
 * @param {string} apiKey - API key to validate
 * @returns {boolean} True if format is valid
 *
 * @example
 * ```typescript
 * if (validateApiKeyFormat('wc_abc123...')) {
 *   // Format is valid
 * }
 * ```
 */
export const validateApiKeyFormat = (apiKey: string): boolean => {
  // Check minimum length
  if (apiKey.length < 40) return false;

  // Check prefix
  if (!apiKey.startsWith('wc_') && !apiKey.includes('_')) return false;

  // Check for invalid characters
  const validPattern = /^[a-zA-Z0-9_-]+$/;
  return validPattern.test(apiKey);
};

/**
 * Extracts API key from Authorization header.
 *
 * @param {string} authHeader - Authorization header value
 * @returns {string | null} Extracted API key or null
 *
 * @example
 * ```typescript
 * const apiKey = extractApiKeyFromHeader('Bearer wc_abc123...');
 * // Result: 'wc_abc123...'
 * ```
 */
export const extractApiKeyFromHeader = (authHeader: string): string | null => {
  if (!authHeader) return null;

  // Support both "Bearer" and "ApiKey" schemes
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }

  if (authHeader.startsWith('ApiKey ')) {
    return authHeader.substring(7).trim();
  }

  return null;
};

/**
 * Validates API key with comprehensive security checks.
 *
 * @param {string} providedKey - API key to validate
 * @param {ApiKey} storedKey - Stored API key object
 * @param {string} [ipAddress] - Request IP address
 * @param {string} [origin] - Request origin
 * @returns {ApiKeyValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateApiKeyWithSecurityChecks(
 *   apiKey,
 *   storedKey,
 *   '192.168.1.100',
 *   'https://app.example.com'
 * );
 * ```
 */
export const validateApiKeyWithSecurityChecks = (
  providedKey: string,
  storedKey: ApiKey,
  ipAddress?: string,
  origin?: string
): ApiKeyValidationResult => {
  // Basic validation
  const basicResult = validateApiKey(providedKey, storedKey);
  if (!basicResult.valid) return basicResult;

  // IP whitelist check
  const ipWhitelist = storedKey.metadata?.ipWhitelist as string[] | undefined;
  if (ipWhitelist && ipAddress && !ipWhitelist.includes(ipAddress)) {
    return { valid: false, error: 'IP address not whitelisted' };
  }

  // Origin check
  const allowedOrigins = storedKey.metadata?.allowedOrigins as string[] | undefined;
  if (allowedOrigins && origin && !allowedOrigins.includes(origin)) {
    return { valid: false, error: 'Origin not allowed' };
  }

  return { valid: true, apiKey: storedKey };
};

/**
 * Checks if API key is close to expiration (within warning threshold).
 *
 * @param {ApiKey} apiKey - API key to check
 * @param {number} [warningDays] - Warning threshold in days (default: 7)
 * @returns {boolean} True if expiring soon
 *
 * @example
 * ```typescript
 * if (isApiKeyExpiringSoon(apiKey, 7)) {
 *   // Notify user to rotate key
 * }
 * ```
 */
export const isApiKeyExpiringSoon = (apiKey: ApiKey, warningDays: number = 7): boolean => {
  if (!apiKey.expiresAt) return false;

  const warningThreshold = new Date(Date.now() + warningDays * 24 * 60 * 60 * 1000);
  return apiKey.expiresAt <= warningThreshold;
};

// ============================================================================
// API KEY ROTATION
// ============================================================================

/**
 * Rotates an API key by creating a new one and marking old one for deprecation.
 *
 * @param {ApiKey} oldKey - Existing API key
 * @param {number} [gracePeriodSeconds] - Grace period before old key expires
 * @returns {ApiKeyRotationResult} Rotation result with both keys
 *
 * @example
 * ```typescript
 * const rotation = rotateApiKey(existingKey, 86400); // 24 hour grace period
 * // Old key valid for 24 hours, new key active immediately
 * ```
 */
export const rotateApiKey = (
  oldKey: ApiKey,
  gracePeriodSeconds: number = 86400
): ApiKeyRotationResult => {
  const newKey = generateApiKey({
    name: oldKey.name,
    description: oldKey.description,
    userId: oldKey.userId,
    clientId: oldKey.clientId,
    scopes: oldKey.scopes,
    rateLimit: oldKey.rateLimit,
    metadata: oldKey.metadata,
  });

  // Set expiration on old key
  const updatedOldKey = {
    ...oldKey,
    expiresAt: new Date(Date.now() + gracePeriodSeconds * 1000),
    metadata: {
      ...oldKey.metadata,
      rotated: true,
      rotatedTo: newKey.id,
    },
  };

  return {
    oldKey: updatedOldKey,
    newKey,
    rotatedAt: new Date(),
  };
};

/**
 * Schedules automatic API key rotation.
 *
 * @param {ApiKey} apiKey - API key to schedule rotation for
 * @param {number} rotationIntervalDays - Rotation interval in days
 * @returns {Date} Next rotation date
 *
 * @example
 * ```typescript
 * const nextRotation = scheduleApiKeyRotation(apiKey, 90);
 * // Key will be rotated in 90 days
 * ```
 */
export const scheduleApiKeyRotation = (
  apiKey: ApiKey,
  rotationIntervalDays: number
): Date => {
  return new Date(apiKey.createdAt.getTime() + rotationIntervalDays * 24 * 60 * 60 * 1000);
};

/**
 * Checks if API key needs rotation based on policy.
 *
 * @param {ApiKey} apiKey - API key to check
 * @param {number} maxAgeDays - Maximum key age in days
 * @returns {boolean} True if rotation needed
 *
 * @example
 * ```typescript
 * if (shouldRotateApiKey(apiKey, 90)) {
 *   // Initiate key rotation
 * }
 * ```
 */
export const shouldRotateApiKey = (apiKey: ApiKey, maxAgeDays: number): boolean => {
  const ageMs = Date.now() - apiKey.createdAt.getTime();
  const ageDays = ageMs / (24 * 60 * 60 * 1000);
  return ageDays >= maxAgeDays;
};

/**
 * Performs emergency rotation of compromised API key.
 *
 * @param {ApiKey} compromisedKey - Compromised API key
 * @returns {ApiKeyRotationResult} Rotation result (old key immediately revoked)
 *
 * @example
 * ```typescript
 * const emergency = emergencyRotateApiKey(compromisedKey);
 * // Old key immediately inactive, new key issued
 * ```
 */
export const emergencyRotateApiKey = (compromisedKey: ApiKey): ApiKeyRotationResult => {
  const rotation = rotateApiKey(compromisedKey, 0);

  // Immediately revoke old key
  rotation.oldKey.isActive = false;
  rotation.oldKey.metadata = {
    ...rotation.oldKey.metadata,
    emergencyRotation: true,
    revokedAt: new Date(),
  };

  return rotation;
};

/**
 * Validates rotation eligibility for an API key.
 *
 * @param {ApiKey} apiKey - API key to validate
 * @returns {{ eligible: boolean; reason?: string }} Eligibility result
 *
 * @example
 * ```typescript
 * const { eligible, reason } = validateRotationEligibility(apiKey);
 * if (!eligible) console.log(reason);
 * ```
 */
export const validateRotationEligibility = (
  apiKey: ApiKey
): { eligible: boolean; reason?: string } => {
  if (!apiKey.isActive) {
    return { eligible: false, reason: 'API key is already inactive' };
  }

  if (apiKey.metadata?.rotated) {
    return { eligible: false, reason: 'API key has already been rotated' };
  }

  return { eligible: true };
};

// ============================================================================
// API KEY SCOPING
// ============================================================================

/**
 * Checks if API key has required scope.
 *
 * @param {ApiKey} apiKey - API key to check
 * @param {string} requiredScope - Required scope
 * @returns {boolean} True if key has scope
 *
 * @example
 * ```typescript
 * if (hasApiKeyScope(apiKey, 'read:patients')) {
 *   // Allow access
 * }
 * ```
 */
export const hasApiKeyScope = (apiKey: ApiKey, requiredScope: string): boolean => {
  // Check exact match
  if (apiKey.scopes.includes(requiredScope)) return true;

  // Check wildcard scopes (e.g., 'read:*' matches 'read:patients')
  const [requiredResource, requiredAction] = requiredScope.split(':');
  return apiKey.scopes.some((scope) => {
    const [resource, action] = scope.split(':');
    if (action === '*') return resource === requiredResource;
    if (resource === '*') return true;
    return false;
  });
};

/**
 * Validates API key has all required scopes.
 *
 * @param {ApiKey} apiKey - API key to check
 * @param {string[]} requiredScopes - Required scopes
 * @returns {ApiKeyScopeCheck} Scope check result
 *
 * @example
 * ```typescript
 * const check = validateApiKeyScopes(apiKey, ['read:patients', 'write:records']);
 * if (!check.hasScope) {
 *   console.log('Missing scopes:', check.missingScopes);
 * }
 * ```
 */
export const validateApiKeyScopes = (
  apiKey: ApiKey,
  requiredScopes: string[]
): ApiKeyScopeCheck => {
  const missingScopes = requiredScopes.filter((scope) => !hasApiKeyScope(apiKey, scope));

  return {
    hasScope: missingScopes.length === 0,
    missingScopes,
    grantedScopes: apiKey.scopes,
  };
};

/**
 * Adds scopes to an existing API key.
 *
 * @param {ApiKey} apiKey - API key to update
 * @param {string[]} newScopes - Scopes to add
 * @returns {ApiKey} Updated API key
 *
 * @example
 * ```typescript
 * const updated = addApiKeyScopes(apiKey, ['write:records', 'delete:records']);
 * ```
 */
export const addApiKeyScopes = (apiKey: ApiKey, newScopes: string[]): ApiKey => {
  const uniqueScopes = Array.from(new Set([...apiKey.scopes, ...newScopes]));

  return {
    ...apiKey,
    scopes: uniqueScopes,
    metadata: {
      ...apiKey.metadata,
      scopesUpdatedAt: new Date(),
    },
  };
};

/**
 * Removes scopes from an API key.
 *
 * @param {ApiKey} apiKey - API key to update
 * @param {string[]} scopesToRemove - Scopes to remove
 * @returns {ApiKey} Updated API key
 *
 * @example
 * ```typescript
 * const updated = removeApiKeyScopes(apiKey, ['delete:records']);
 * ```
 */
export const removeApiKeyScopes = (apiKey: ApiKey, scopesToRemove: string[]): ApiKey => {
  const filteredScopes = apiKey.scopes.filter((scope) => !scopesToRemove.includes(scope));

  return {
    ...apiKey,
    scopes: filteredScopes,
    metadata: {
      ...apiKey.metadata,
      scopesUpdatedAt: new Date(),
    },
  };
};

/**
 * Parses scope string into structured format.
 *
 * @param {string} scopeString - Scope string (e.g., 'read:patients')
 * @returns {{ resource: string; action: string }} Parsed scope
 *
 * @example
 * ```typescript
 * const parsed = parseApiKeyScope('read:patients');
 * // Result: { resource: 'patients', action: 'read' }
 * ```
 */
export const parseApiKeyScope = (
  scopeString: string
): { resource: string; action: string } => {
  const [action, resource] = scopeString.split(':');
  return { resource: resource || '*', action: action || '*' };
};

// ============================================================================
// RATE LIMITING
// ============================================================================

/**
 * Checks if API key has exceeded rate limit.
 *
 * @param {ApiKey} apiKey - API key to check
 * @param {RateLimitState} currentState - Current rate limit state
 * @returns {{ allowed: boolean; remainingRequests: number; resetAt: Date }} Rate limit result
 *
 * @example
 * ```typescript
 * const { allowed, remainingRequests } = checkApiKeyRateLimit(apiKey, rateLimitState);
 * if (!allowed) {
 *   // Return 429 Too Many Requests
 * }
 * ```
 */
export const checkApiKeyRateLimit = (
  apiKey: ApiKey,
  currentState: RateLimitState
): { allowed: boolean; remainingRequests: number; resetAt: Date } => {
  const now = new Date();
  const windowEnd = new Date(
    currentState.windowStart.getTime() + apiKey.rateLimit.windowSeconds * 1000
  );

  // Check if we're in a new window
  if (now > windowEnd) {
    return {
      allowed: true,
      remainingRequests: apiKey.rateLimit.maxRequests - 1,
      resetAt: new Date(now.getTime() + apiKey.rateLimit.windowSeconds * 1000),
    };
  }

  // Check if limit exceeded
  if (currentState.requestCount >= apiKey.rateLimit.maxRequests) {
    return {
      allowed: false,
      remainingRequests: 0,
      resetAt: windowEnd,
    };
  }

  return {
    allowed: true,
    remainingRequests: apiKey.rateLimit.maxRequests - currentState.requestCount - 1,
    resetAt: windowEnd,
  };
};

/**
 * Initializes rate limit state for an API key.
 *
 * @param {ApiKey} apiKey - API key to initialize state for
 * @returns {RateLimitState} Initial rate limit state
 *
 * @example
 * ```typescript
 * const state = initializeRateLimitState(apiKey);
 * ```
 */
export const initializeRateLimitState = (apiKey: ApiKey): RateLimitState => {
  const now = new Date();
  return {
    apiKeyId: apiKey.id,
    windowStart: now,
    requestCount: 0,
    burstCount: 0,
    nextResetAt: new Date(now.getTime() + apiKey.rateLimit.windowSeconds * 1000),
  };
};

/**
 * Increments rate limit counter for an API key.
 *
 * @param {RateLimitState} state - Current rate limit state
 * @returns {RateLimitState} Updated rate limit state
 *
 * @example
 * ```typescript
 * const updated = incrementRateLimitCounter(currentState);
 * ```
 */
export const incrementRateLimitCounter = (state: RateLimitState): RateLimitState => {
  return {
    ...state,
    requestCount: state.requestCount + 1,
  };
};

/**
 * Updates API key rate limit configuration.
 *
 * @param {ApiKey} apiKey - API key to update
 * @param {RateLimitConfig} newRateLimit - New rate limit configuration
 * @returns {ApiKey} Updated API key
 *
 * @example
 * ```typescript
 * const updated = updateApiKeyRateLimit(apiKey, {
 *   maxRequests: 5000,
 *   windowSeconds: 3600
 * });
 * ```
 */
export const updateApiKeyRateLimit = (
  apiKey: ApiKey,
  newRateLimit: RateLimitConfig
): ApiKey => {
  return {
    ...apiKey,
    rateLimit: newRateLimit,
    metadata: {
      ...apiKey.metadata,
      rateLimitUpdatedAt: new Date(),
    },
  };
};

/**
 * Calculates recommended rate limit based on user tier.
 *
 * @param {string} userTier - User tier ('free' | 'pro' | 'enterprise')
 * @returns {RateLimitConfig} Recommended rate limit configuration
 *
 * @example
 * ```typescript
 * const rateLimit = calculateRecommendedRateLimit('enterprise');
 * // Result: { maxRequests: 10000, windowSeconds: 3600 }
 * ```
 */
export const calculateRecommendedRateLimit = (userTier: string): RateLimitConfig => {
  const limits: Record<string, RateLimitConfig> = {
    free: { maxRequests: 100, windowSeconds: 3600 },
    pro: { maxRequests: 1000, windowSeconds: 3600 },
    enterprise: { maxRequests: 10000, windowSeconds: 3600 },
  };

  return limits[userTier] || limits.free;
};

// ============================================================================
// EXPIRATION MANAGEMENT
// ============================================================================

/**
 * Sets expiration date for an API key.
 *
 * @param {ApiKey} apiKey - API key to update
 * @param {Date | number} expiration - Expiration date or seconds from now
 * @returns {ApiKey} Updated API key
 *
 * @example
 * ```typescript
 * const updated = setApiKeyExpiration(apiKey, 86400 * 365); // 1 year
 * ```
 */
export const setApiKeyExpiration = (apiKey: ApiKey, expiration: Date | number): ApiKey => {
  const expiresAt = typeof expiration === 'number'
    ? new Date(Date.now() + expiration * 1000)
    : expiration;

  return {
    ...apiKey,
    expiresAt,
    metadata: {
      ...apiKey.metadata,
      expirationSetAt: new Date(),
    },
  };
};

/**
 * Extends API key expiration by specified duration.
 *
 * @param {ApiKey} apiKey - API key to extend
 * @param {number} extensionSeconds - Extension duration in seconds
 * @returns {ApiKey} Updated API key
 *
 * @example
 * ```typescript
 * const extended = extendApiKeyExpiration(apiKey, 86400 * 30); // Extend by 30 days
 * ```
 */
export const extendApiKeyExpiration = (apiKey: ApiKey, extensionSeconds: number): ApiKey => {
  const currentExpiration = apiKey.expiresAt || new Date();
  const newExpiration = new Date(currentExpiration.getTime() + extensionSeconds * 1000);

  return {
    ...apiKey,
    expiresAt: newExpiration,
    metadata: {
      ...apiKey.metadata,
      expirationExtendedAt: new Date(),
    },
  };
};

/**
 * Removes expiration from an API key (make it permanent).
 *
 * @param {ApiKey} apiKey - API key to update
 * @returns {ApiKey} Updated API key
 *
 * @example
 * ```typescript
 * const permanent = removeApiKeyExpiration(apiKey);
 * ```
 */
export const removeApiKeyExpiration = (apiKey: ApiKey): ApiKey => {
  return {
    ...apiKey,
    expiresAt: undefined,
    metadata: {
      ...apiKey.metadata,
      madePermamentAt: new Date(),
    },
  };
};

/**
 * Checks if API key has expired.
 *
 * @param {ApiKey} apiKey - API key to check
 * @returns {boolean} True if expired
 *
 * @example
 * ```typescript
 * if (isApiKeyExpired(apiKey)) {
 *   // Key has expired
 * }
 * ```
 */
export const isApiKeyExpired = (apiKey: ApiKey): boolean => {
  if (!apiKey.expiresAt) return false;
  return new Date() > apiKey.expiresAt;
};

/**
 * Calculates days until API key expiration.
 *
 * @param {ApiKey} apiKey - API key to check
 * @returns {number | null} Days until expiration or null if no expiration
 *
 * @example
 * ```typescript
 * const days = getDaysUntilExpiration(apiKey);
 * if (days && days < 7) {
 *   // Warn user
 * }
 * ```
 */
export const getDaysUntilExpiration = (apiKey: ApiKey): number | null => {
  if (!apiKey.expiresAt) return null;

  const msUntilExpiration = apiKey.expiresAt.getTime() - Date.now();
  return Math.floor(msUntilExpiration / (24 * 60 * 60 * 1000));
};

// ============================================================================
// REVOCATION
// ============================================================================

/**
 * Revokes an API key immediately.
 *
 * @param {ApiKey} apiKey - API key to revoke
 * @param {ApiKeyRevocationOptions} [options] - Revocation options
 * @returns {ApiKey} Revoked API key
 *
 * @example
 * ```typescript
 * const revoked = revokeApiKey(apiKey, {
 *   reason: 'Security incident',
 *   revokedBy: 'admin123'
 * });
 * ```
 */
export const revokeApiKey = (
  apiKey: ApiKey,
  options?: ApiKeyRevocationOptions
): ApiKey => {
  return {
    ...apiKey,
    isActive: false,
    metadata: {
      ...apiKey.metadata,
      revokedAt: new Date(),
      revocationReason: options?.reason,
      revokedBy: options?.revokedBy,
    },
  };
};

/**
 * Revokes all API keys for a specific user.
 *
 * @param {ApiKey[]} userKeys - User's API keys
 * @param {string} userId - User identifier
 * @param {string} [reason] - Revocation reason
 * @returns {ApiKey[]} Revoked API keys
 *
 * @example
 * ```typescript
 * const revoked = revokeAllUserApiKeys(userApiKeys, 'user123', 'Account compromised');
 * ```
 */
export const revokeAllUserApiKeys = (
  userKeys: ApiKey[],
  userId: string,
  reason?: string
): ApiKey[] => {
  return userKeys
    .filter((key) => key.userId === userId)
    .map((key) => revokeApiKey(key, { reason }));
};

/**
 * Reactivates a previously revoked API key.
 *
 * @param {ApiKey} apiKey - API key to reactivate
 * @returns {ApiKey} Reactivated API key
 *
 * @example
 * ```typescript
 * const reactivated = reactivateApiKey(revokedKey);
 * ```
 */
export const reactivateApiKey = (apiKey: ApiKey): ApiKey => {
  return {
    ...apiKey,
    isActive: true,
    metadata: {
      ...apiKey.metadata,
      reactivatedAt: new Date(),
      revokedAt: undefined,
      revocationReason: undefined,
    },
  };
};

/**
 * Checks if API key can be revoked.
 *
 * @param {ApiKey} apiKey - API key to check
 * @returns {{ canRevoke: boolean; reason?: string }} Revocation eligibility
 *
 * @example
 * ```typescript
 * const { canRevoke, reason } = canRevokeApiKey(apiKey);
 * ```
 */
export const canRevokeApiKey = (apiKey: ApiKey): { canRevoke: boolean; reason?: string } => {
  if (!apiKey.isActive) {
    return { canRevoke: false, reason: 'API key is already inactive' };
  }

  return { canRevoke: true };
};

/**
 * Schedules API key revocation for future date.
 *
 * @param {ApiKey} apiKey - API key to schedule revocation
 * @param {Date} scheduledDate - Revocation date
 * @returns {ApiKey} Updated API key with scheduled revocation
 *
 * @example
 * ```typescript
 * const scheduled = scheduleApiKeyRevocation(apiKey, new Date('2025-12-31'));
 * ```
 */
export const scheduleApiKeyRevocation = (apiKey: ApiKey, scheduledDate: Date): ApiKey => {
  return {
    ...apiKey,
    metadata: {
      ...apiKey.metadata,
      scheduledRevocation: scheduledDate,
    },
  };
};

// ============================================================================
// USAGE ANALYTICS
// ============================================================================

/**
 * Records API key usage event.
 *
 * @param {ApiKey} apiKey - API key being used
 * @param {string} endpoint - API endpoint accessed
 * @param {number} responseTime - Response time in milliseconds
 * @param {boolean} success - Whether request was successful
 * @returns {ApiKey} Updated API key
 *
 * @example
 * ```typescript
 * const updated = recordApiKeyUsage(apiKey, '/api/patients', 150, true);
 * ```
 */
export const recordApiKeyUsage = (
  apiKey: ApiKey,
  endpoint: string,
  responseTime: number,
  success: boolean
): ApiKey => {
  return {
    ...apiKey,
    lastUsedAt: new Date(),
    metadata: {
      ...apiKey.metadata,
      lastEndpoint: endpoint,
      lastResponseTime: responseTime,
      lastRequestSuccess: success,
    },
  };
};

/**
 * Generates usage statistics for an API key.
 *
 * @param {ApiKey} apiKey - API key to analyze
 * @param {Array<{endpoint: string; timestamp: Date; responseTime: number; success: boolean}>} usageLog - Usage log entries
 * @returns {ApiKeyUsageStats} Usage statistics
 *
 * @example
 * ```typescript
 * const stats = generateApiKeyUsageStats(apiKey, usageLogEntries);
 * ```
 */
export const generateApiKeyUsageStats = (
  apiKey: ApiKey,
  usageLog: Array<{
    endpoint: string;
    timestamp: Date;
    responseTime: number;
    success: boolean;
  }>
): ApiKeyUsageStats => {
  const totalRequests = usageLog.length;
  const errorCount = usageLog.filter((log) => !log.success).length;
  const totalResponseTime = usageLog.reduce((sum, log) => sum + log.responseTime, 0);

  const requestsByEndpoint: Record<string, number> = {};
  const requestsByDay: Record<string, number> = {};

  usageLog.forEach((log) => {
    // Count by endpoint
    requestsByEndpoint[log.endpoint] = (requestsByEndpoint[log.endpoint] || 0) + 1;

    // Count by day
    const day = log.timestamp.toISOString().split('T')[0];
    requestsByDay[day] = (requestsByDay[day] || 0) + 1;
  });

  return {
    apiKeyId: apiKey.id,
    totalRequests,
    requestsByEndpoint,
    requestsByDay,
    averageResponseTime: totalRequests > 0 ? totalResponseTime / totalRequests : 0,
    errorCount,
    lastRequestAt: usageLog.length > 0 ? usageLog[usageLog.length - 1].timestamp : undefined,
  };
};

/**
 * Tracks API key last usage timestamp.
 *
 * @param {ApiKey} apiKey - API key to update
 * @returns {ApiKey} Updated API key
 *
 * @example
 * ```typescript
 * const updated = trackApiKeyLastUsage(apiKey);
 * ```
 */
export const trackApiKeyLastUsage = (apiKey: ApiKey): ApiKey => {
  return {
    ...apiKey,
    lastUsedAt: new Date(),
  };
};

/**
 * Identifies unused API keys based on inactivity period.
 *
 * @param {ApiKey[]} apiKeys - API keys to check
 * @param {number} inactiveDays - Inactivity threshold in days
 * @returns {ApiKey[]} Unused API keys
 *
 * @example
 * ```typescript
 * const unused = identifyUnusedApiKeys(allApiKeys, 90);
 * // Returns keys not used in 90 days
 * ```
 */
export const identifyUnusedApiKeys = (apiKeys: ApiKey[], inactiveDays: number): ApiKey[] => {
  const thresholdDate = new Date(Date.now() - inactiveDays * 24 * 60 * 60 * 1000);

  return apiKeys.filter((key) => {
    if (!key.lastUsedAt) return true; // Never used
    return key.lastUsedAt < thresholdDate;
  });
};

/**
 * Generates usage report for API key.
 *
 * @param {ApiKey} apiKey - API key to generate report for
 * @param {ApiKeyUsageStats} stats - Usage statistics
 * @returns {string} Formatted usage report
 *
 * @example
 * ```typescript
 * const report = generateApiKeyUsageReport(apiKey, usageStats);
 * console.log(report);
 * ```
 */
export const generateApiKeyUsageReport = (
  apiKey: ApiKey,
  stats: ApiKeyUsageStats
): string => {
  const lines = [
    `API Key Usage Report`,
    `===================`,
    `Key Name: ${apiKey.name}`,
    `Key ID: ${apiKey.id}`,
    `Total Requests: ${stats.totalRequests}`,
    `Error Count: ${stats.errorCount}`,
    `Average Response Time: ${stats.averageResponseTime.toFixed(2)}ms`,
    `Last Used: ${stats.lastRequestAt?.toISOString() || 'Never'}`,
    ``,
    `Top Endpoints:`,
    ...Object.entries(stats.requestsByEndpoint)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([endpoint, count]) => `  ${endpoint}: ${count} requests`),
  ];

  return lines.join('\n');
};

// ============================================================================
// NESTJS GUARDS AND DECORATORS
// ============================================================================

/**
 * Creates NestJS guard configuration for API key authentication.
 *
 * @param {Object} options - Guard options
 * @returns {Object} Guard configuration
 *
 * @example
 * ```typescript
 * const guardConfig = createApiKeyGuardConfig({
 *   headerName: 'X-API-Key',
 *   validateScopes: true
 * });
 * ```
 */
export const createApiKeyGuardConfig = (options: {
  headerName?: string;
  validateScopes?: boolean;
  requiredScopes?: string[];
}): object => {
  return {
    headerName: options.headerName || 'Authorization',
    validateScopes: options.validateScopes || false,
    requiredScopes: options.requiredScopes || [],
  };
};

/**
 * Validates API key from NestJS request context.
 *
 * @param {any} request - NestJS request object
 * @param {ApiKey[]} validKeys - Valid API keys
 * @returns {ApiKeyValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateApiKeyFromRequest(req, allApiKeys);
 * if (!result.valid) throw new UnauthorizedException();
 * ```
 */
export const validateApiKeyFromRequest = (
  request: any,
  validKeys: ApiKey[]
): ApiKeyValidationResult => {
  const authHeader = request.headers?.authorization || request.headers?.['x-api-key'];

  if (!authHeader) {
    return { valid: false, error: 'No API key provided' };
  }

  const apiKey = extractApiKeyFromHeader(authHeader);
  if (!apiKey) {
    return { valid: false, error: 'Invalid API key format' };
  }

  const hashedKey = hashApiKey(apiKey);
  const storedKey = validKeys.find((k) => k.hashedKey === hashedKey);

  if (!storedKey) {
    return { valid: false, error: 'Invalid API key' };
  }

  return validateApiKey(apiKey, storedKey);
};

/**
 * Extracts API key metadata from request for logging.
 *
 * @param {any} request - NestJS request object
 * @returns {Object} Request metadata
 *
 * @example
 * ```typescript
 * const metadata = extractRequestMetadata(req);
 * // Result: { ipAddress: '192.168.1.1', userAgent: '...', ... }
 * ```
 */
export const extractRequestMetadata = (request: any): Record<string, any> => {
  return {
    ipAddress: request.ip || request.connection?.remoteAddress,
    userAgent: request.headers?.['user-agent'],
    origin: request.headers?.origin,
    method: request.method,
    path: request.path || request.url,
    timestamp: new Date(),
  };
};

/**
 * Creates API key authentication middleware for NestJS.
 *
 * @param {Function} getValidKeys - Function to retrieve valid keys
 * @returns {Function} Middleware function
 *
 * @example
 * ```typescript
 * const middleware = createApiKeyAuthMiddleware(async () => {
 *   return await apiKeyRepository.findAll();
 * });
 * ```
 */
export const createApiKeyAuthMiddleware = (
  getValidKeys: () => Promise<ApiKey[]>
): ((req: any, res: any, next: any) => Promise<void>) => {
  return async (req: any, res: any, next: any) => {
    const validKeys = await getValidKeys();
    const result = validateApiKeyFromRequest(req, validKeys);

    if (!result.valid) {
      res.status(401).json({ error: result.error });
      return;
    }

    req.apiKey = result.apiKey;
    next();
  };
};

/**
 * Formats API key error response for NestJS controllers.
 *
 * @param {string} error - Error message
 * @param {number} [statusCode] - HTTP status code
 * @returns {Object} Error response object
 *
 * @example
 * ```typescript
 * throw new HttpException(
 *   formatApiKeyErrorResponse('Invalid API key'),
 *   HttpStatus.UNAUTHORIZED
 * );
 * ```
 */
export const formatApiKeyErrorResponse = (
  error: string,
  statusCode: number = 401
): object => {
  return {
    statusCode,
    error: 'Unauthorized',
    message: error,
    timestamp: new Date().toISOString(),
  };
};
