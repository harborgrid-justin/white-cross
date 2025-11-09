/**
 * LOC: AUTHKIT001
 * File: /reuse/authentication-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/jwt
 *   - @nestjs/passport
 *   - crypto (Node.js)
 *   - bcrypt
 *
 * DOWNSTREAM (imported by):
 *   - Authentication services
 *   - Auth guards and strategies
 *   - Session middleware
 *   - Security interceptors
 *   - Token validation services
 */
/**
 * JWT token payload structure
 */
export interface JWTPayload {
    sub: string;
    email?: string;
    role?: string;
    roles?: string[];
    permissions?: string[];
    iat?: number;
    exp?: number;
    nbf?: number;
    iss?: string;
    aud?: string;
    jti?: string;
    type?: 'access' | 'refresh' | 'id';
    [key: string]: any;
}
/**
 * JWT configuration options
 */
export interface JWTConfig {
    secret: string;
    expiresIn?: string | number;
    algorithm?: 'HS256' | 'HS384' | 'HS512' | 'RS256' | 'RS384' | 'RS512';
    issuer?: string;
    audience?: string | string[];
    notBefore?: number;
    subject?: string;
}
/**
 * Token pair for access and refresh tokens
 */
export interface TokenPair {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: string;
}
/**
 * Token validation result
 */
export interface TokenValidationResult {
    valid: boolean;
    payload?: JWTPayload;
    expired?: boolean;
    error?: string;
}
/**
 * Refresh token configuration
 */
export interface RefreshTokenConfig {
    userId: string;
    deviceId?: string;
    sessionId?: string;
    familyId?: string;
    expiresIn?: string | number;
    metadata?: Record<string, any>;
}
/**
 * Session configuration
 */
export interface SessionConfig {
    userId: string;
    email?: string;
    role?: string;
    ipAddress?: string;
    userAgent?: string;
    expiresIn?: number;
    slidingWindow?: number;
    metadata?: Record<string, any>;
}
/**
 * Session data structure
 */
export interface SessionData {
    sessionId: string;
    userId: string;
    email?: string;
    role?: string;
    createdAt: Date;
    lastActivity: Date;
    expiresAt: Date;
    ipAddress?: string;
    userAgent?: string;
    deviceId?: string;
    metadata?: Record<string, any>;
}
/**
 * OAuth 2.0 configuration
 */
export interface OAuth2Config {
    clientId: string;
    clientSecret?: string;
    redirectUri: string;
    authorizationEndpoint: string;
    tokenEndpoint: string;
    scope?: string[];
    state?: string;
    responseType?: 'code' | 'token';
    usePKCE?: boolean;
}
/**
 * OAuth 2.0 authorization result
 */
export interface OAuth2AuthResult {
    authorizationUrl: string;
    state: string;
    codeVerifier?: string;
    codeChallenge?: string;
}
/**
 * OAuth 2.0 token response
 */
export interface OAuth2TokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token?: string;
    scope?: string;
    id_token?: string;
}
/**
 * TOTP configuration
 */
export interface TOTPConfig {
    secret: string;
    window?: number;
    step?: number;
    digits?: number;
    algorithm?: 'sha1' | 'sha256' | 'sha512';
}
/**
 * TOTP setup result
 */
export interface TOTPSetupResult {
    secret: string;
    qrCodeUrl: string;
    otpauthUrl: string;
    backupCodes: string[];
}
/**
 * Password policy configuration
 */
export interface PasswordPolicy {
    minLength?: number;
    maxLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireDigits?: boolean;
    requireSpecialChars?: boolean;
    preventCommonPasswords?: boolean;
    preventPasswordReuse?: number;
    maxAge?: number;
}
/**
 * Password validation result
 */
export interface PasswordValidationResult {
    valid: boolean;
    score: number;
    strength: 'weak' | 'fair' | 'good' | 'strong' | 'very-strong';
    feedback: string[];
}
/**
 * API key configuration
 */
export interface ApiKeyConfig {
    prefix?: string;
    length?: number;
    expiresIn?: number;
    permissions?: string[];
    userId?: string;
    metadata?: Record<string, any>;
}
/**
 * API key data
 */
export interface ApiKeyData {
    key: string;
    hash: string;
    prefix?: string;
    userId?: string;
    permissions?: string[];
    createdAt: Date;
    expiresAt?: Date;
    lastUsed?: Date;
    metadata?: Record<string, any>;
}
/**
 * Token blacklist entry
 */
export interface BlacklistEntry {
    jti: string;
    expiresAt: Date;
    reason?: string;
    blacklistedAt: Date;
}
/**
 * Login credentials
 */
export interface LoginCredentials {
    email: string;
    password: string;
    rememberMe?: boolean;
    deviceId?: string;
    mfaCode?: string;
}
/**
 * Login result
 */
export interface LoginResult {
    success: boolean;
    tokens?: TokenPair;
    user?: any;
    requiresMFA?: boolean;
    mfaToken?: string;
    error?: string;
}
/**
 * 1. Generates a comprehensive JWT access token with standard claims.
 *
 * @param {JWTPayload} payload - Token payload containing user data
 * @param {JWTConfig} config - JWT configuration including secret and options
 * @returns {string} Signed JWT token
 *
 * @example
 * ```typescript
 * const token = generateJWTToken({
 *   sub: 'user-123',
 *   email: 'doctor@whitecross.com',
 *   role: 'doctor',
 *   permissions: ['read:patients', 'write:prescriptions']
 * }, {
 *   secret: process.env.JWT_SECRET,
 *   expiresIn: '15m',
 *   issuer: 'white-cross-api',
 *   audience: 'white-cross-web'
 * });
 * ```
 */
export declare function generateJWTToken(payload: JWTPayload, config: JWTConfig): string;
/**
 * 2. Validates and verifies a JWT token with comprehensive security checks.
 *
 * @param {string} token - JWT token to validate
 * @param {JWTConfig} config - Validation configuration
 * @returns {TokenValidationResult} Validation result with payload or error
 *
 * @example
 * ```typescript
 * const result = validateJWTToken(token, {
 *   secret: process.env.JWT_SECRET,
 *   issuer: 'white-cross-api',
 *   audience: 'white-cross-web'
 * });
 *
 * if (result.valid) {
 *   console.log('User ID:', result.payload.sub);
 * } else {
 *   console.error('Token invalid:', result.error);
 * }
 * ```
 */
export declare function validateJWTToken(token: string, config: JWTConfig): TokenValidationResult;
/**
 * 3. Extracts JWT payload without validation (for inspection only).
 *
 * @param {string} token - JWT token to decode
 * @returns {JWTPayload | null} Decoded payload or null if invalid
 *
 * @example
 * ```typescript
 * const payload = extractJWTPayload(token);
 * if (payload) {
 *   console.log('Token expires at:', new Date(payload.exp * 1000));
 *   console.log('Token ID:', payload.jti);
 * }
 * ```
 */
export declare function extractJWTPayload(token: string): JWTPayload | null;
/**
 * 4. Checks if JWT token is expired.
 *
 * @param {string} token - JWT token to check
 * @returns {boolean} True if token is expired
 *
 * @example
 * ```typescript
 * if (isJWTExpired(token)) {
 *   console.log('Token has expired, refresh needed');
 * }
 * ```
 */
export declare function isJWTExpired(token: string): boolean;
/**
 * 5. Gets remaining time until JWT expiration.
 *
 * @param {string} token - JWT token to check
 * @returns {number} Seconds until expiration (0 if expired)
 *
 * @example
 * ```typescript
 * const secondsRemaining = getJWTTimeToExpiry(token);
 * console.log(`Token expires in ${secondsRemaining} seconds`);
 *
 * if (secondsRemaining < 300) {
 *   // Less than 5 minutes remaining, refresh token
 *   refreshToken();
 * }
 * ```
 */
export declare function getJWTTimeToExpiry(token: string): number;
/**
 * 6. Checks if JWT will expire within specified seconds.
 *
 * @param {string} token - JWT token to check
 * @param {number} withinSeconds - Time window in seconds
 * @returns {boolean} True if token expires within window
 *
 * @example
 * ```typescript
 * if (isJWTExpiringWithin(token, 300)) {
 *   console.log('Token expires within 5 minutes, proactive refresh recommended');
 * }
 * ```
 */
export declare function isJWTExpiringWithin(token: string, withinSeconds: number): boolean;
/**
 * 7. Gets comprehensive JWT token information.
 *
 * @param {string} token - JWT token to analyze
 * @returns {object | null} Token metadata or null if invalid
 *
 * @example
 * ```typescript
 * const info = getJWTInfo(token);
 * console.log(info);
 * // {
 * //   isExpired: false,
 * //   expiresIn: 850,
 * //   issuedAt: Date,
 * //   expiresAt: Date,
 * //   age: 50,
 * //   issuer: 'white-cross-api',
 * //   subject: 'user-123'
 * // }
 * ```
 */
export declare function getJWTInfo(token: string): any;
/**
 * 8. Validates JWT token structure without cryptographic verification.
 *
 * @param {string} token - JWT token to validate
 * @returns {boolean} True if token has valid JWT structure
 *
 * @example
 * ```typescript
 * if (isValidJWTStructure(token)) {
 *   console.log('Token has valid structure');
 * } else {
 *   console.log('Invalid JWT format');
 * }
 * ```
 */
export declare function isValidJWTStructure(token: string): boolean;
/**
 * 9. Generates a refresh token with family tracking for rotation.
 *
 * @param {RefreshTokenConfig} config - Refresh token configuration
 * @param {string} secret - Secret for signing
 * @returns {string} Refresh token
 *
 * @example
 * ```typescript
 * const refreshToken = generateRefreshToken({
 *   userId: 'user-123',
 *   deviceId: 'device-abc',
 *   sessionId: 'session-xyz',
 *   expiresIn: '7d',
 *   metadata: { browser: 'Chrome' }
 * }, process.env.REFRESH_SECRET);
 * ```
 */
export declare function generateRefreshToken(config: RefreshTokenConfig, secret: string): string;
/**
 * 10. Validates refresh token and extracts payload.
 *
 * @param {string} token - Refresh token to validate
 * @param {string} secret - Secret for verification
 * @returns {TokenValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateRefreshToken(refreshToken, secret);
 * if (result.valid && result.payload.type === 'refresh') {
 *   // Token is valid refresh token
 *   const userId = result.payload.sub;
 * }
 * ```
 */
export declare function validateRefreshToken(token: string, secret: string): TokenValidationResult;
/**
 * 11. Rotates refresh token maintaining family tracking.
 *
 * @param {string} oldToken - Current refresh token
 * @param {string} secret - Secret for signing
 * @param {JWTConfig} accessConfig - Access token configuration
 * @returns {TokenPair | null} New token pair or null if invalid
 *
 * @example
 * ```typescript
 * const tokens = rotateRefreshToken(oldRefreshToken, refreshSecret, {
 *   secret: accessSecret,
 *   expiresIn: '15m',
 *   issuer: 'white-cross-api'
 * });
 *
 * if (tokens) {
 *   // Return new tokens to client
 *   res.json(tokens);
 * }
 * ```
 */
export declare function rotateRefreshToken(oldToken: string, secret: string, accessConfig: JWTConfig): TokenPair | null;
/**
 * 12. Hashes refresh token for secure storage.
 *
 * @param {string} token - Refresh token to hash
 * @param {string} algorithm - Hash algorithm (default: sha256)
 * @returns {string} Token hash
 *
 * @example
 * ```typescript
 * const hash = hashRefreshToken(refreshToken);
 * // Store hash in database instead of plain token
 * await db.refreshTokens.create({
 *   userId,
 *   tokenHash: hash,
 *   familyId,
 *   expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
 * });
 * ```
 */
export declare function hashRefreshToken(token: string, algorithm?: 'sha256' | 'sha512'): string;
/**
 * 13. Verifies refresh token against stored hash.
 *
 * @param {string} token - Provided refresh token
 * @param {string} storedHash - Hash from database
 * @returns {boolean} True if token matches hash
 *
 * @example
 * ```typescript
 * const tokenRecord = await db.refreshTokens.findOne({ userId });
 * if (verifyRefreshTokenHash(providedToken, tokenRecord.tokenHash)) {
 *   // Token is valid, proceed with rotation
 * }
 * ```
 */
export declare function verifyRefreshTokenHash(token: string, storedHash: string): boolean;
/**
 * 14. Extracts family ID from refresh token for rotation tracking.
 *
 * @param {string} token - Refresh token
 * @returns {string | null} Family ID or null if not found
 *
 * @example
 * ```typescript
 * const familyId = extractRefreshTokenFamilyId(token);
 * // Check if family has been compromised
 * const isCompromised = await db.blacklistedFamilies.exists(familyId);
 * if (isCompromised) {
 *   // Revoke all tokens in family
 *   await revokeTokenFamily(familyId);
 * }
 * ```
 */
export declare function extractRefreshTokenFamilyId(token: string): string | null;
/**
 * 15. Creates a new session with comprehensive metadata.
 *
 * @param {SessionConfig} config - Session configuration
 * @returns {SessionData} Created session data
 *
 * @example
 * ```typescript
 * const session = createSession({
 *   userId: 'user-123',
 *   email: 'doctor@whitecross.com',
 *   role: 'doctor',
 *   ipAddress: req.ip,
 *   userAgent: req.headers['user-agent'],
 *   expiresIn: 86400000, // 24 hours
 *   slidingWindow: 1800000, // 30 minutes
 *   metadata: { loginMethod: 'oauth' }
 * });
 * ```
 */
export declare function createSession(config: SessionConfig): SessionData;
/**
 * 16. Validates session with security checks.
 *
 * @param {SessionData} session - Session to validate
 * @param {object} options - Validation options
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const result = validateSession(session, {
 *   checkExpiration: true,
 *   maxIdleTime: 1800000, // 30 minutes
 *   ipAddress: req.ip,
 *   strictIpCheck: true
 * });
 *
 * if (!result.valid) {
 *   throw new UnauthorizedException(result.reason);
 * }
 * ```
 */
export declare function validateSession(session: SessionData, options?: {
    checkExpiration?: boolean;
    maxIdleTime?: number;
    ipAddress?: string;
    strictIpCheck?: boolean;
}): {
    valid: boolean;
    reason?: string;
};
/**
 * 17. Updates session activity with sliding window.
 *
 * @param {SessionData} session - Session to update
 * @param {number} slidingWindow - Sliding window in milliseconds
 * @returns {SessionData} Updated session
 *
 * @example
 * ```typescript
 * const updated = updateSessionActivity(session, 1800000); // 30 min sliding
 * await sessionStore.save(session.sessionId, updated);
 * ```
 */
export declare function updateSessionActivity(session: SessionData, slidingWindow?: number): SessionData;
/**
 * 18. Generates secure session ID.
 *
 * @param {string} prefix - Optional prefix (e.g., 'sess_')
 * @param {number} length - Length in bytes (default: 32)
 * @returns {string} Secure session ID
 *
 * @example
 * ```typescript
 * const sessionId = generateSessionId('wc_sess_', 32);
 * // Result: 'wc_sess_a1b2c3d4e5f6...'
 * ```
 */
export declare function generateSessionId(prefix?: string, length?: number): string;
/**
 * 19. Calculates session time remaining.
 *
 * @param {SessionData} session - Session to check
 * @returns {number} Milliseconds until expiration
 *
 * @example
 * ```typescript
 * const remaining = getSessionTimeRemaining(session);
 * console.log(`Session expires in ${Math.floor(remaining / 60000)} minutes`);
 * ```
 */
export declare function getSessionTimeRemaining(session: SessionData): number;
/**
 * 20. Checks if session is expired.
 *
 * @param {SessionData} session - Session to check
 * @returns {boolean} True if session is expired
 *
 * @example
 * ```typescript
 * if (isSessionExpired(session)) {
 *   await destroySession(session.sessionId);
 *   throw new UnauthorizedException('Session expired');
 * }
 * ```
 */
export declare function isSessionExpired(session: SessionData): boolean;
/**
 * 21. Generates OAuth 2.0 authorization URL with PKCE.
 *
 * @param {OAuth2Config} config - OAuth configuration
 * @returns {OAuth2AuthResult} Authorization URL and PKCE parameters
 *
 * @example
 * ```typescript
 * const { authorizationUrl, state, codeVerifier } = generateOAuth2AuthUrl({
 *   clientId: 'client-123',
 *   redirectUri: 'https://app.whitecross.com/callback',
 *   authorizationEndpoint: 'https://oauth.provider.com/authorize',
 *   tokenEndpoint: 'https://oauth.provider.com/token',
 *   scope: ['openid', 'profile', 'email'],
 *   usePKCE: true
 * });
 *
 * // Store state and codeVerifier in session
 * // Redirect user to authorizationUrl
 * ```
 */
export declare function generateOAuth2AuthUrl(config: OAuth2Config): OAuth2AuthResult;
/**
 * 22. Validates OAuth 2.0 state parameter (CSRF protection).
 *
 * @param {string} receivedState - State from callback
 * @param {string} storedState - State stored in session
 * @returns {boolean} True if states match
 *
 * @example
 * ```typescript
 * if (!validateOAuth2State(req.query.state, session.oauthState)) {
 *   throw new Error('Invalid OAuth state - possible CSRF attack');
 * }
 * ```
 */
export declare function validateOAuth2State(receivedState: string, storedState: string): boolean;
/**
 * 23. Builds OAuth 2.0 token exchange request body.
 *
 * @param {string} code - Authorization code
 * @param {OAuth2Config} config - OAuth configuration
 * @param {string} codeVerifier - PKCE code verifier
 * @returns {object} Token exchange request body
 *
 * @example
 * ```typescript
 * const body = buildOAuth2TokenExchangeBody(code, config, codeVerifier);
 * const response = await fetch(config.tokenEndpoint, {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
 *   body: new URLSearchParams(body)
 * });
 * const tokens = await response.json();
 * ```
 */
export declare function buildOAuth2TokenExchangeBody(code: string, config: OAuth2Config, codeVerifier?: string): Record<string, string>;
/**
 * 24. Generates PKCE code verifier.
 *
 * @param {number} length - Length in bytes (default: 32)
 * @returns {string} PKCE code verifier
 *
 * @example
 * ```typescript
 * const verifier = generatePKCEVerifier();
 * // Store verifier in session for token exchange
 * ```
 */
export declare function generatePKCEVerifier(length?: number): string;
/**
 * 25. Generates PKCE code challenge from verifier.
 *
 * @param {string} verifier - PKCE code verifier
 * @param {string} method - Challenge method (default: S256)
 * @returns {string} PKCE code challenge
 *
 * @example
 * ```typescript
 * const verifier = generatePKCEVerifier();
 * const challenge = generatePKCEChallenge(verifier);
 * // Use challenge in authorization request
 * ```
 */
export declare function generatePKCEChallenge(verifier: string, method?: 'S256' | 'plain'): string;
/**
 * 26. Validates PKCE code verifier against challenge.
 *
 * @param {string} verifier - Code verifier
 * @param {string} challenge - Code challenge
 * @returns {boolean} True if verifier matches challenge
 *
 * @example
 * ```typescript
 * if (!validatePKCEVerifier(storedVerifier, receivedChallenge)) {
 *   throw new Error('Invalid PKCE verifier');
 * }
 * ```
 */
export declare function validatePKCEVerifier(verifier: string, challenge: string): boolean;
/**
 * 27. Generates TOTP secret and setup data.
 *
 * @param {string} accountName - Account identifier (email)
 * @param {string} issuer - Service name
 * @param {number} digits - Number of digits (default: 6)
 * @returns {TOTPSetupResult} TOTP setup data
 *
 * @example
 * ```typescript
 * const setup = generateTOTPSetup('doctor@whitecross.com', 'White Cross', 6);
 * // Display setup.qrCodeUrl to user
 * // Store setup.secret in database (encrypted)
 * // Provide setup.backupCodes to user (one-time)
 * ```
 */
export declare function generateTOTPSetup(accountName: string, issuer: string, digits?: number): TOTPSetupResult;
/**
 * 28. Generates TOTP code from secret.
 *
 * @param {string} secret - TOTP secret (base32)
 * @param {number} step - Time step in seconds (default: 30)
 * @param {number} digits - Number of digits (default: 6)
 * @returns {string} TOTP code
 *
 * @example
 * ```typescript
 * const code = generateTOTPCode(secret);
 * console.log('Current TOTP code:', code);
 * ```
 */
export declare function generateTOTPCode(secret: string, step?: number, digits?: number): string;
/**
 * 29. Verifies TOTP code with time window.
 *
 * @param {string} code - User-provided TOTP code
 * @param {string} secret - TOTP secret
 * @param {number} window - Time window tolerance (default: 1)
 * @returns {boolean} True if code is valid
 *
 * @example
 * ```typescript
 * if (verifyTOTPCode(userCode, storedSecret, 1)) {
 *   // 2FA verification successful
 *   await completeLogin(user);
 * } else {
 *   throw new UnauthorizedException('Invalid 2FA code');
 * }
 * ```
 */
export declare function verifyTOTPCode(code: string, secret: string, window?: number): boolean;
/**
 * 30. Generates backup codes for 2FA recovery.
 *
 * @param {number} count - Number of codes (default: 10)
 * @param {number} length - Length of each code (default: 8)
 * @returns {string[]} Array of backup codes
 *
 * @example
 * ```typescript
 * const codes = generateBackupCodes(10, 8);
 * // Display codes to user one time
 * // Store hashed versions in database
 * ```
 */
export declare function generateBackupCodes(count?: number, length?: number): string[];
/**
 * 31. Hashes backup code for secure storage.
 *
 * @param {string} code - Backup code
 * @returns {string} Hashed code
 *
 * @example
 * ```typescript
 * const hash = hashBackupCode('A1B2C3D4');
 * await db.backupCodes.create({ userId, codeHash: hash, used: false });
 * ```
 */
export declare function hashBackupCode(code: string): string;
/**
 * 32. Verifies backup code against stored hash.
 *
 * @param {string} code - User-provided backup code
 * @param {string} storedHash - Hash from database
 * @returns {boolean} True if code matches
 *
 * @example
 * ```typescript
 * if (verifyBackupCode(userCode, storedHash)) {
 *   // Mark code as used
 *   await db.backupCodes.update({ codeHash: storedHash }, { used: true });
 *   await completeLogin(user);
 * }
 * ```
 */
export declare function verifyBackupCode(code: string, storedHash: string): boolean;
/**
 * 33. Generates MFA challenge token.
 *
 * @param {string} userId - User ID
 * @param {string} secret - Secret for signing
 * @param {number} expiresIn - Expiration in seconds (default: 300)
 * @returns {string} MFA challenge token
 *
 * @example
 * ```typescript
 * const mfaToken = generateMFAChallenge('user-123', secret, 300);
 * // Return token to client
 * // Client submits this token with MFA code
 * ```
 */
export declare function generateMFAChallenge(userId: string, secret: string, expiresIn?: number): string;
/**
 * 34. Hashes password using bcrypt (simulated - use actual bcrypt library).
 *
 * @param {string} password - Plain text password
 * @param {number} rounds - Salt rounds (default: 12)
 * @returns {Promise<string>} Password hash
 *
 * @example
 * ```typescript
 * const hash = await hashPassword('MyP@ssw0rd123!', 12);
 * await db.users.create({ email, passwordHash: hash });
 * ```
 */
export declare function hashPassword(password: string, rounds?: number): Promise<string>;
/**
 * 35. Verifies password against hash (simulated - use actual bcrypt library).
 *
 * @param {string} password - Plain text password
 * @param {string} hash - Stored password hash
 * @returns {Promise<boolean>} True if password matches
 *
 * @example
 * ```typescript
 * const isValid = await verifyPassword(providedPassword, user.passwordHash);
 * if (!isValid) {
 *   throw new UnauthorizedException('Invalid credentials');
 * }
 * ```
 */
export declare function verifyPassword(password: string, hash: string): Promise<boolean>;
/**
 * 36. Validates password against policy.
 *
 * @param {string} password - Password to validate
 * @param {PasswordPolicy} policy - Password policy
 * @returns {PasswordValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validatePasswordPolicy('MyP@ssw0rd123!', {
 *   minLength: 12,
 *   requireUppercase: true,
 *   requireDigits: true,
 *   requireSpecialChars: true
 * });
 *
 * if (!result.valid) {
 *   return { errors: result.feedback };
 * }
 * ```
 */
export declare function validatePasswordPolicy(password: string, policy: PasswordPolicy): PasswordValidationResult;
/**
 * 37. Generates secure random password.
 *
 * @param {number} length - Password length (default: 16)
 * @param {PasswordPolicy} policy - Password policy
 * @returns {string} Generated password
 *
 * @example
 * ```typescript
 * const password = generateSecurePassword(16, {
 *   requireUppercase: true,
 *   requireDigits: true,
 *   requireSpecialChars: true
 * });
 * // Send password to user via secure channel
 * ```
 */
export declare function generateSecurePassword(length?: number, policy?: PasswordPolicy): string;
/**
 * 38. Checks if password has been pwned (simulated).
 *
 * @param {string} password - Password to check
 * @returns {Promise<boolean>} True if password found in breach database
 *
 * @example
 * ```typescript
 * const isPwned = await isPasswordPwned(password);
 * if (isPwned) {
 *   return { error: 'This password has been found in data breaches' };
 * }
 * ```
 */
export declare function isPasswordPwned(password: string): Promise<boolean>;
/**
 * 39. Generates API key with metadata.
 *
 * @param {ApiKeyConfig} config - API key configuration
 * @returns {ApiKeyData} Complete API key data
 *
 * @example
 * ```typescript
 * const apiKey = generateApiKey({
 *   prefix: 'wc_live_',
 *   length: 32,
 *   expiresIn: 31536000000, // 1 year
 *   permissions: ['read:api', 'write:webhooks'],
 *   userId: 'user-123'
 * });
 *
 * // Return apiKey.key to user (one time only)
 * // Store apiKey.hash in database
 * ```
 */
export declare function generateApiKey(config?: ApiKeyConfig): ApiKeyData;
/**
 * 40. Validates API key against stored data.
 *
 * @param {string} providedKey - API key from request
 * @param {ApiKeyData} storedData - Stored API key data
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const result = validateApiKey(req.headers['x-api-key'], storedKeyData);
 * if (!result.valid) {
 *   throw new UnauthorizedException(result.error);
 * }
 * ```
 */
export declare function validateApiKey(providedKey: string, storedData: ApiKeyData): {
    valid: boolean;
    error?: string;
};
/**
 * 41. Checks if API key has permission.
 *
 * @param {ApiKeyData} apiKeyData - API key data
 * @param {string} permission - Required permission
 * @returns {boolean} True if API key has permission
 *
 * @example
 * ```typescript
 * if (!hasApiKeyPermission(apiKeyData, 'write:webhooks')) {
 *   throw new ForbiddenException('Insufficient permissions');
 * }
 * ```
 */
export declare function hasApiKeyPermission(apiKeyData: ApiKeyData, permission: string): boolean;
/**
 * 42. Rotates API key (generates new, invalidates old).
 *
 * @param {ApiKeyData} oldKeyData - Old API key data
 * @returns {ApiKeyData} New API key data
 *
 * @example
 * ```typescript
 * const newKey = rotateApiKey(oldKeyData);
 * // Return newKey.key to user
 * // Update database with new hash
 * // Blacklist old key
 * ```
 */
export declare function rotateApiKey(oldKeyData: ApiKeyData): ApiKeyData;
/**
 * 43. Creates token blacklist entry.
 *
 * @param {string} jti - JWT ID (jti claim)
 * @param {number} expiresIn - Seconds until token expires
 * @param {string} reason - Blacklist reason
 * @returns {BlacklistEntry} Blacklist entry
 *
 * @example
 * ```typescript
 * const payload = extractJWTPayload(token);
 * const entry = createBlacklistEntry(payload.jti, 3600, 'user_logout');
 * await blacklistStore.add(entry);
 * ```
 */
export declare function createBlacklistEntry(jti: string, expiresIn: number, reason?: string): BlacklistEntry;
/**
 * 44. Checks if token is blacklisted.
 *
 * @param {string} jti - JWT ID to check
 * @param {BlacklistEntry[]} blacklist - Blacklist entries
 * @returns {boolean} True if token is blacklisted
 *
 * @example
 * ```typescript
 * if (isTokenBlacklisted(payload.jti, blacklistEntries)) {
 *   throw new UnauthorizedException('Token has been revoked');
 * }
 * ```
 */
export declare function isTokenBlacklisted(jti: string, blacklist: BlacklistEntry[]): boolean;
/**
 * 45. Generates SSO token for cross-domain authentication.
 *
 * @param {string} userId - User ID
 * @param {string} secret - SSO secret
 * @param {string} targetDomain - Target domain
 * @param {number} expiresIn - Expiration in seconds (default: 60)
 * @returns {string} SSO token
 *
 * @example
 * ```typescript
 * const ssoToken = generateSSOToken('user-123', ssoSecret, 'app.whitecross.com', 60);
 * // Redirect user to: https://app.whitecross.com/sso?token=${ssoToken}
 * ```
 */
export declare function generateSSOToken(userId: string, secret: string, targetDomain: string, expiresIn?: number): string;
declare const _default: {
    generateJWTToken: typeof generateJWTToken;
    validateJWTToken: typeof validateJWTToken;
    extractJWTPayload: typeof extractJWTPayload;
    isJWTExpired: typeof isJWTExpired;
    getJWTTimeToExpiry: typeof getJWTTimeToExpiry;
    isJWTExpiringWithin: typeof isJWTExpiringWithin;
    getJWTInfo: typeof getJWTInfo;
    isValidJWTStructure: typeof isValidJWTStructure;
    generateRefreshToken: typeof generateRefreshToken;
    validateRefreshToken: typeof validateRefreshToken;
    rotateRefreshToken: typeof rotateRefreshToken;
    hashRefreshToken: typeof hashRefreshToken;
    verifyRefreshTokenHash: typeof verifyRefreshTokenHash;
    extractRefreshTokenFamilyId: typeof extractRefreshTokenFamilyId;
    createSession: typeof createSession;
    validateSession: typeof validateSession;
    updateSessionActivity: typeof updateSessionActivity;
    generateSessionId: typeof generateSessionId;
    getSessionTimeRemaining: typeof getSessionTimeRemaining;
    isSessionExpired: typeof isSessionExpired;
    generateOAuth2AuthUrl: typeof generateOAuth2AuthUrl;
    validateOAuth2State: typeof validateOAuth2State;
    buildOAuth2TokenExchangeBody: typeof buildOAuth2TokenExchangeBody;
    generatePKCEVerifier: typeof generatePKCEVerifier;
    generatePKCEChallenge: typeof generatePKCEChallenge;
    validatePKCEVerifier: typeof validatePKCEVerifier;
    generateTOTPSetup: typeof generateTOTPSetup;
    generateTOTPCode: typeof generateTOTPCode;
    verifyTOTPCode: typeof verifyTOTPCode;
    generateBackupCodes: typeof generateBackupCodes;
    hashBackupCode: typeof hashBackupCode;
    verifyBackupCode: typeof verifyBackupCode;
    generateMFAChallenge: typeof generateMFAChallenge;
    hashPassword: typeof hashPassword;
    verifyPassword: typeof verifyPassword;
    validatePasswordPolicy: typeof validatePasswordPolicy;
    generateSecurePassword: typeof generateSecurePassword;
    isPasswordPwned: typeof isPasswordPwned;
    generateApiKey: typeof generateApiKey;
    validateApiKey: typeof validateApiKey;
    hasApiKeyPermission: typeof hasApiKeyPermission;
    rotateApiKey: typeof rotateApiKey;
    createBlacklistEntry: typeof createBlacklistEntry;
    isTokenBlacklisted: typeof isTokenBlacklisted;
    generateSSOToken: typeof generateSSOToken;
};
export default _default;
//# sourceMappingURL=authentication-kit.d.ts.map