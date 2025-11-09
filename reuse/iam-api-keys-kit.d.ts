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
    expiresIn?: number;
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
export declare const generateApiKey: (options: ApiKeyGenerationOptions) => ApiKey;
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
export declare const generateSecureApiKey: (prefix?: ApiKeyPrefix) => string;
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
export declare const hashApiKey: (apiKey: string) => string;
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
export declare const generateMultipleApiKeys: (userId: string, keyConfigs: Array<{
    name: string;
    scopes: string[];
    rateLimit?: RateLimitConfig;
}>) => ApiKey[];
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
export declare const createApiKeyFromExisting: (existingKey: string, options: ApiKeyGenerationOptions) => ApiKey;
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
export declare const validateApiKey: (providedKey: string, storedKey: ApiKey) => ApiKeyValidationResult;
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
export declare const validateApiKeyFormat: (apiKey: string) => boolean;
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
export declare const extractApiKeyFromHeader: (authHeader: string) => string | null;
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
export declare const validateApiKeyWithSecurityChecks: (providedKey: string, storedKey: ApiKey, ipAddress?: string, origin?: string) => ApiKeyValidationResult;
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
export declare const isApiKeyExpiringSoon: (apiKey: ApiKey, warningDays?: number) => boolean;
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
export declare const rotateApiKey: (oldKey: ApiKey, gracePeriodSeconds?: number) => ApiKeyRotationResult;
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
export declare const scheduleApiKeyRotation: (apiKey: ApiKey, rotationIntervalDays: number) => Date;
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
export declare const shouldRotateApiKey: (apiKey: ApiKey, maxAgeDays: number) => boolean;
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
export declare const emergencyRotateApiKey: (compromisedKey: ApiKey) => ApiKeyRotationResult;
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
export declare const validateRotationEligibility: (apiKey: ApiKey) => {
    eligible: boolean;
    reason?: string;
};
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
export declare const hasApiKeyScope: (apiKey: ApiKey, requiredScope: string) => boolean;
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
export declare const validateApiKeyScopes: (apiKey: ApiKey, requiredScopes: string[]) => ApiKeyScopeCheck;
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
export declare const addApiKeyScopes: (apiKey: ApiKey, newScopes: string[]) => ApiKey;
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
export declare const removeApiKeyScopes: (apiKey: ApiKey, scopesToRemove: string[]) => ApiKey;
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
export declare const parseApiKeyScope: (scopeString: string) => {
    resource: string;
    action: string;
};
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
export declare const checkApiKeyRateLimit: (apiKey: ApiKey, currentState: RateLimitState) => {
    allowed: boolean;
    remainingRequests: number;
    resetAt: Date;
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
export declare const initializeRateLimitState: (apiKey: ApiKey) => RateLimitState;
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
export declare const incrementRateLimitCounter: (state: RateLimitState) => RateLimitState;
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
export declare const updateApiKeyRateLimit: (apiKey: ApiKey, newRateLimit: RateLimitConfig) => ApiKey;
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
export declare const calculateRecommendedRateLimit: (userTier: string) => RateLimitConfig;
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
export declare const setApiKeyExpiration: (apiKey: ApiKey, expiration: Date | number) => ApiKey;
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
export declare const extendApiKeyExpiration: (apiKey: ApiKey, extensionSeconds: number) => ApiKey;
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
export declare const removeApiKeyExpiration: (apiKey: ApiKey) => ApiKey;
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
export declare const isApiKeyExpired: (apiKey: ApiKey) => boolean;
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
export declare const getDaysUntilExpiration: (apiKey: ApiKey) => number | null;
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
export declare const revokeApiKey: (apiKey: ApiKey, options?: ApiKeyRevocationOptions) => ApiKey;
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
export declare const revokeAllUserApiKeys: (userKeys: ApiKey[], userId: string, reason?: string) => ApiKey[];
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
export declare const reactivateApiKey: (apiKey: ApiKey) => ApiKey;
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
export declare const canRevokeApiKey: (apiKey: ApiKey) => {
    canRevoke: boolean;
    reason?: string;
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
export declare const scheduleApiKeyRevocation: (apiKey: ApiKey, scheduledDate: Date) => ApiKey;
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
export declare const recordApiKeyUsage: (apiKey: ApiKey, endpoint: string, responseTime: number, success: boolean) => ApiKey;
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
export declare const generateApiKeyUsageStats: (apiKey: ApiKey, usageLog: Array<{
    endpoint: string;
    timestamp: Date;
    responseTime: number;
    success: boolean;
}>) => ApiKeyUsageStats;
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
export declare const trackApiKeyLastUsage: (apiKey: ApiKey) => ApiKey;
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
export declare const identifyUnusedApiKeys: (apiKeys: ApiKey[], inactiveDays: number) => ApiKey[];
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
export declare const generateApiKeyUsageReport: (apiKey: ApiKey, stats: ApiKeyUsageStats) => string;
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
export declare const createApiKeyGuardConfig: (options: {
    headerName?: string;
    validateScopes?: boolean;
    requiredScopes?: string[];
}) => object;
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
export declare const validateApiKeyFromRequest: (request: any, validKeys: ApiKey[]) => ApiKeyValidationResult;
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
export declare const extractRequestMetadata: (request: any) => Record<string, any>;
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
export declare const createApiKeyAuthMiddleware: (getValidKeys: () => Promise<ApiKey[]>) => ((req: any, res: any, next: any) => Promise<void>);
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
export declare const formatApiKeyErrorResponse: (error: string, statusCode?: number) => object;
//# sourceMappingURL=iam-api-keys-kit.d.ts.map