/**
 * LOC: AUTH_AUTHZ_KIT_001
 * File: /reuse/authentication-authorization-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/passport
 *   - @nestjs/jwt
 *   - jsonwebtoken
 *   - crypto
 *   - bcrypt
 *
 * DOWNSTREAM (imported by):
 *   - Authentication services
 *   - Authorization guards
 *   - JWT strategies
 *   - OAuth2 controllers
 *   - Security middleware
 *   - MFA services
 */
/**
 * JWT algorithm types supported
 */
export type JWTAlgorithm = 'RS256' | 'HS256' | 'ES256' | 'RS512' | 'HS512' | 'ES512';
/**
 * JWT key configuration for different algorithms
 */
export interface JWTKeyConfig {
    algorithm: JWTAlgorithm;
    publicKey?: string;
    privateKey?: string;
    secret?: string;
    passphrase?: string;
}
/**
 * JWT payload structure
 */
export interface JWTPayload {
    sub: string;
    email?: string;
    role?: string;
    permissions?: string[];
    iat?: number;
    exp?: number;
    iss?: string;
    aud?: string | string[];
    jti?: string;
    scope?: string[];
    [key: string]: any;
}
/**
 * JWT verification options
 */
export interface JWTVerifyOptions {
    algorithms?: JWTAlgorithm[];
    audience?: string | string[];
    issuer?: string | string[];
    ignoreExpiration?: boolean;
    clockTolerance?: number;
    maxAge?: string;
}
/**
 * OAuth2 grant types
 */
export declare enum OAuth2GrantType {
    AUTHORIZATION_CODE = "authorization_code",
    CLIENT_CREDENTIALS = "client_credentials",
    DEVICE_CODE = "device_code",
    REFRESH_TOKEN = "refresh_token",
    PASSWORD = "password",
    IMPLICIT = "implicit"
}
/**
 * OAuth2 authorization request
 */
export interface OAuth2AuthRequest {
    clientId: string;
    redirectUri: string;
    responseType: 'code' | 'token';
    scope?: string[];
    state: string;
    codeChallenge?: string;
    codeChallengeMethod?: 'S256' | 'plain';
}
/**
 * OAuth2 device code flow
 */
export interface DeviceCodeResponse {
    deviceCode: string;
    userCode: string;
    verificationUri: string;
    verificationUriComplete: string;
    expiresIn: number;
    interval: number;
}
/**
 * API key configuration
 */
export interface APIKeyConfig {
    key: string;
    userId: string;
    name: string;
    permissions: string[];
    rateLimit?: number;
    expiresAt?: Date;
    ipWhitelist?: string[];
    lastUsedAt?: Date;
    createdAt: Date;
}
/**
 * MFA methods supported
 */
export declare enum MFAMethod {
    SMS = "sms",
    EMAIL = "email",
    TOTP = "totp",
    WEBAUTHN = "webauthn",
    BACKUP_CODE = "backup_code"
}
/**
 * MFA challenge
 */
export interface MFAChallenge {
    challengeId: string;
    method: MFAMethod;
    userId: string;
    target?: string;
    code?: string;
    expiresAt: Date;
    attempts: number;
    verified: boolean;
}
/**
 * TOTP configuration
 */
export interface TOTPConfig {
    secret: string;
    period?: number;
    digits?: number;
    algorithm?: 'sha1' | 'sha256' | 'sha512';
    window?: number;
}
/**
 * Role definition
 */
export interface Role {
    name: string;
    description: string;
    permissions: string[];
    hierarchy?: number;
    inherits?: string[];
}
/**
 * Permission definition
 */
export interface Permission {
    name: string;
    resource: string;
    action: string;
    conditions?: PermissionCondition[];
}
/**
 * Permission condition for attribute-based access control
 */
export interface PermissionCondition {
    field: string;
    operator: 'eq' | 'ne' | 'gt' | 'lt' | 'in' | 'contains';
    value: any;
}
/**
 * Password policy configuration
 */
export interface PasswordPolicy {
    minLength: number;
    maxLength?: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    preventCommonPasswords: boolean;
    preventUserInfo: boolean;
    maxRepeatingChars?: number;
    minUniqueChars?: number;
    expiryDays?: number;
    historyCount?: number;
}
/**
 * Password strength result
 */
export interface PasswordStrength {
    score: number;
    strength: 'weak' | 'fair' | 'good' | 'strong' | 'very_strong';
    feedback: string[];
    meetsPolicy: boolean;
    estimatedCrackTime: string;
}
/**
 * Account lockout configuration
 */
export interface LockoutConfig {
    maxAttempts: number;
    lockoutDuration: number;
    resetAfter: number;
    incrementalBackoff?: boolean;
    notifyUser?: boolean;
}
/**
 * Brute force tracking
 */
export interface BruteForceTracker {
    identifier: string;
    attempts: number;
    firstAttempt: Date;
    lastAttempt: Date;
    lockedUntil?: Date;
    suspicionLevel: 'low' | 'medium' | 'high' | 'critical';
}
/**
 * Security headers configuration
 */
export interface SecurityHeadersConfig {
    strictTransportSecurity?: boolean;
    contentSecurityPolicy?: string;
    xFrameOptions?: 'DENY' | 'SAMEORIGIN';
    xContentTypeOptions?: boolean;
    referrerPolicy?: string;
    permissionsPolicy?: string;
}
/**
 * Token rotation policy
 */
export interface TokenRotationPolicy {
    rotateOnUse: boolean;
    gracePeriod: number;
    maxRotations: number;
    reuseDetection: boolean;
}
/**
 * Biometric authentication data
 */
export interface BiometricAuthData {
    userId: string;
    credentialId: string;
    publicKey: string;
    counter: number;
    transports?: ('usb' | 'nfc' | 'ble' | 'internal')[];
    deviceType?: 'platform' | 'cross-platform';
    createdAt: Date;
    lastUsedAt?: Date;
}
/**
 * Generates an RS256 JWT token using RSA private key
 *
 * @param payload - JWT payload data
 * @param privateKey - RSA private key in PEM format
 * @param options - Additional JWT options (expiry, issuer, audience)
 * @returns Signed JWT token
 *
 * @example
 * const token = generateRS256Token(
 *   { sub: 'user123', role: 'admin' },
 *   rsaPrivateKey,
 *   { expiresIn: '1h', issuer: 'white-cross' }
 * );
 */
export declare function generateRS256Token(payload: JWTPayload, privateKey: string, options?: {
    expiresIn?: string;
    issuer?: string;
    audience?: string;
    jwtid?: string;
}): string;
/**
 * Verifies an RS256 JWT token using RSA public key
 *
 * @param token - JWT token to verify
 * @param publicKey - RSA public key in PEM format
 * @param options - Verification options (audience, issuer, etc.)
 * @returns Decoded and verified JWT payload
 * @throws UnauthorizedException if token is invalid or expired
 *
 * @example
 * const payload = verifyRS256Token(token, rsaPublicKey, {
 *   audience: 'white-cross-api',
 *   issuer: 'white-cross'
 * });
 */
export declare function verifyRS256Token(token: string, publicKey: string, options?: JWTVerifyOptions): JWTPayload;
/**
 * Generates an HS256 JWT token using HMAC-SHA256
 *
 * @param payload - JWT payload data
 * @param secret - Shared secret for HMAC
 * @param options - Additional JWT options
 * @returns Signed JWT token
 *
 * @example
 * const token = generateHS256Token(
 *   { sub: 'user123' },
 *   'your-secret-key',
 *   { expiresIn: '15m' }
 * );
 */
export declare function generateHS256Token(payload: JWTPayload, secret: string, options?: {
    expiresIn?: string;
    issuer?: string;
    audience?: string;
}): string;
/**
 * Verifies an HS256 JWT token using HMAC-SHA256
 *
 * @param token - JWT token to verify
 * @param secret - Shared secret for HMAC
 * @param options - Verification options
 * @returns Decoded and verified JWT payload
 * @throws UnauthorizedException if token is invalid
 */
export declare function verifyHS256Token(token: string, secret: string, options?: JWTVerifyOptions): JWTPayload;
/**
 * Generates an ES256 JWT token using ECDSA with P-256 curve
 *
 * @param payload - JWT payload data
 * @param privateKey - EC private key in PEM format
 * @param options - Additional JWT options
 * @returns Signed JWT token
 *
 * @example
 * const token = generateES256Token(
 *   { sub: 'user123' },
 *   ecPrivateKey,
 *   { expiresIn: '2h' }
 * );
 */
export declare function generateES256Token(payload: JWTPayload, privateKey: string, options?: {
    expiresIn?: string;
    issuer?: string;
    audience?: string;
}): string;
/**
 * Verifies an ES256 JWT token using ECDSA
 *
 * @param token - JWT token to verify
 * @param publicKey - EC public key in PEM format
 * @param options - Verification options
 * @returns Decoded and verified JWT payload
 * @throws UnauthorizedException if token is invalid
 */
export declare function verifyES256Token(token: string, publicKey: string, options?: JWTVerifyOptions): JWTPayload;
/**
 * Generates OAuth2 authorization code with PKCE support
 *
 * @param request - Authorization request details
 * @param userId - User ID authorizing the request
 * @returns Authorization code and metadata
 *
 * @example
 * const authCode = generateOAuth2AuthorizationCode({
 *   clientId: 'client-123',
 *   redirectUri: 'https://app.com/callback',
 *   responseType: 'code',
 *   state: 'random-state',
 *   codeChallenge: 'challenge-hash',
 *   codeChallengeMethod: 'S256'
 * }, 'user-456');
 */
export declare function generateOAuth2AuthorizationCode(request: OAuth2AuthRequest, userId: string): {
    code: string;
    expiresAt: Date;
    codeChallenge?: string;
    codeChallengeMethod?: string;
};
/**
 * Verifies PKCE code verifier against code challenge
 *
 * @param codeVerifier - Code verifier from token request
 * @param codeChallenge - Code challenge from authorization request
 * @param method - Challenge method (S256 or plain)
 * @returns True if verification succeeds
 * @throws UnauthorizedException if verification fails
 *
 * @example
 * verifyPKCEChallenge(verifier, challenge, 'S256');
 */
export declare function verifyPKCEChallenge(codeVerifier: string, codeChallenge: string, method: 'S256' | 'plain'): boolean;
/**
 * Generates PKCE code verifier and challenge
 *
 * @returns Code verifier and challenge pair
 *
 * @example
 * const { codeVerifier, codeChallenge } = generatePKCEChallenge();
 */
export declare function generatePKCEChallenge(): {
    codeVerifier: string;
    codeChallenge: string;
    codeChallengeMethod: 'S256';
};
/**
 * Implements OAuth2 client credentials flow
 *
 * @param clientId - Client application ID
 * @param clientSecret - Client secret
 * @param scope - Requested scopes
 * @returns Access token for client
 * @throws UnauthorizedException if credentials are invalid
 *
 * @example
 * const token = await generateClientCredentialsToken(
 *   'client-123',
 *   'secret',
 *   ['read:patients', 'write:appointments']
 * );
 */
export declare function generateClientCredentialsToken(clientId: string, clientSecret: string, scope: string[]): Promise<{
    accessToken: string;
    tokenType: string;
    expiresIn: number;
}>;
/**
 * Generates device code for OAuth2 device flow
 *
 * @param clientId - Client application ID
 * @param scope - Requested scopes
 * @returns Device code, user code, and verification URI
 *
 * @example
 * const deviceAuth = generateDeviceCode('client-123', ['profile', 'email']);
 * console.log(`Enter code ${deviceAuth.userCode} at ${deviceAuth.verificationUri}`);
 */
export declare function generateDeviceCode(clientId: string, scope?: string[]): DeviceCodeResponse;
/**
 * Validates OAuth2 device code authorization
 *
 * @param deviceCode - Device code to check
 * @param userCode - User code entered by user
 * @returns True if user has authorized the device
 *
 * @example
 * const isAuthorized = await validateDeviceCodeAuthorization(deviceCode, userCode);
 */
export declare function validateDeviceCodeAuthorization(deviceCode: string, userCode: string): Promise<boolean>;
/**
 * Generates a secure API key with metadata
 *
 * @param userId - User ID owning the key
 * @param name - Friendly name for the key
 * @param permissions - Permissions granted to the key
 * @param options - Additional configuration
 * @returns API key and configuration
 *
 * @example
 * const apiKey = generateAPIKey('user-123', 'Production API', ['read:*', 'write:appointments']);
 */
export declare function generateAPIKey(userId: string, name: string, permissions: string[], options?: {
    expiresIn?: string;
    ipWhitelist?: string[];
    rateLimit?: number;
}): {
    key: string;
    config: APIKeyConfig;
};
/**
 * Validates API key and returns associated configuration
 *
 * @param apiKey - API key to validate
 * @param ipAddress - Client IP address for whitelist check
 * @returns API key configuration if valid
 * @throws UnauthorizedException if key is invalid or expired
 *
 * @example
 * const config = await validateAPIKey(req.headers['x-api-key'], req.ip);
 */
export declare function validateAPIKey(apiKey: string, ipAddress?: string): Promise<APIKeyConfig>;
/**
 * Rotates API key while maintaining access
 *
 * @param oldKey - Current API key
 * @param gracePeriod - Time in seconds to keep old key valid
 * @returns New API key and configuration
 *
 * @example
 * const { newKey, config } = rotateAPIKey(currentKey, 3600); // 1 hour grace period
 */
export declare function rotateAPIKey(oldKey: string, gracePeriod?: number): {
    newKey: string;
    oldKeyValidUntil: Date;
};
/**
 * Generates TOTP secret for authenticator app enrollment
 *
 * @param userId - User ID for the TOTP secret
 * @param issuer - Issuer name (e.g., "White Cross")
 * @returns Secret, QR code URI, and manual entry key
 *
 * @example
 * const totp = generateTOTPSecret('user-123', 'White Cross');
 * console.log('Scan QR code:', totp.qrCodeUri);
 */
export declare function generateTOTPSecret(userId: string, issuer?: string): {
    secret: string;
    qrCodeUri: string;
    manualEntryKey: string;
};
/**
 * Generates current TOTP code from secret
 *
 * @param secret - TOTP secret
 * @param config - TOTP configuration
 * @returns Current TOTP code
 *
 * @example
 * const code = generateTOTPCode(secret, { period: 30, digits: 6 });
 */
export declare function generateTOTPCode(secret: string, config?: Partial<TOTPConfig>): string;
/**
 * Verifies TOTP code with time window tolerance
 *
 * @param code - User-provided TOTP code
 * @param secret - TOTP secret
 * @param config - TOTP configuration with window tolerance
 * @returns True if code is valid
 *
 * @example
 * const isValid = verifyTOTPCode('123456', secret, { window: 1 });
 */
export declare function verifyTOTPCode(code: string, secret: string, config?: Partial<TOTPConfig>): boolean;
/**
 * Generates SMS/Email MFA challenge code
 *
 * @param userId - User ID for the challenge
 * @param method - MFA method (SMS or EMAIL)
 * @param target - Phone number or email address
 * @param length - Code length (default 6)
 * @returns MFA challenge with code
 *
 * @example
 * const challenge = generateMFAChallenge('user-123', MFAMethod.SMS, '+1234567890');
 */
export declare function generateMFAChallenge(userId: string, method: MFAMethod.SMS | MFAMethod.EMAIL, target: string, length?: number): MFAChallenge;
/**
 * Verifies MFA challenge code
 *
 * @param challengeId - Challenge ID
 * @param code - User-provided code
 * @param challenge - Stored challenge data
 * @returns True if code is valid
 * @throws UnauthorizedException if code is invalid or expired
 *
 * @example
 * const isValid = verifyMFAChallenge(challengeId, '123456', storedChallenge);
 */
export declare function verifyMFAChallenge(challengeId: string, code: string, challenge: MFAChallenge): boolean;
/**
 * Generates backup codes for MFA recovery
 *
 * @param count - Number of backup codes to generate
 * @returns Array of backup codes
 *
 * @example
 * const backupCodes = generateBackupCodes(10);
 */
export declare function generateBackupCodes(count?: number): string[];
/**
 * Checks if user has required role
 *
 * @param userRole - User's current role
 * @param requiredRoles - Required roles (any match)
 * @param roleHierarchy - Role hierarchy map
 * @returns True if user has permission
 *
 * @example
 * const hasAccess = checkRole('admin', ['admin', 'super_admin'], roleHierarchy);
 */
export declare function checkRole(userRole: string, requiredRoles: string[], roleHierarchy?: Map<string, number>): boolean;
/**
 * Checks if user has required permissions
 *
 * @param userPermissions - User's permissions
 * @param requiredPermissions - Required permissions (all must match)
 * @returns True if user has all required permissions
 *
 * @example
 * const hasPermission = checkPermissions(
 *   ['read:patients', 'write:appointments'],
 *   ['read:patients']
 * );
 */
export declare function checkPermissions(userPermissions: string[], requiredPermissions: string[]): boolean;
/**
 * Evaluates attribute-based permission conditions
 *
 * @param permission - Permission with conditions
 * @param context - Current context data
 * @returns True if all conditions are met
 *
 * @example
 * const allowed = evaluatePermissionConditions(
 *   { name: 'read:patient', resource: 'patient', action: 'read',
 *     conditions: [{ field: 'department', operator: 'eq', value: 'cardiology' }]
 *   },
 *   { department: 'cardiology' }
 * );
 */
export declare function evaluatePermissionConditions(permission: Permission, context: Record<string, any>): boolean;
/**
 * Merges role permissions with hierarchy inheritance
 *
 * @param role - Role to get permissions for
 * @param allRoles - Map of all role definitions
 * @returns Combined permissions from role and inherited roles
 *
 * @example
 * const permissions = getRolePermissions(doctorRole, rolesMap);
 */
export declare function getRolePermissions(role: Role, allRoles: Map<string, Role>): string[];
/**
 * Validates password against policy requirements
 *
 * @param password - Password to validate
 * @param policy - Password policy configuration
 * @param userInfo - Optional user info to prevent password reuse
 * @returns Validation result with feedback
 *
 * @example
 * const result = validatePasswordPolicy('MyP@ssw0rd!', policy, { email: 'user@example.com' });
 */
export declare function validatePasswordPolicy(password: string, policy: PasswordPolicy, userInfo?: {
    email?: string;
    name?: string;
    username?: string;
}): {
    valid: boolean;
    errors: string[];
};
/**
 * Calculates password strength score and provides feedback
 *
 * @param password - Password to analyze
 * @returns Password strength analysis
 *
 * @example
 * const strength = calculatePasswordStrength('MyP@ssw0rd!2024');
 * console.log(`Strength: ${strength.strength} (${strength.score}/100)`);
 */
export declare function calculatePasswordStrength(password: string): PasswordStrength;
/**
 * Hashes password with bcrypt
 *
 * @param password - Plain text password
 * @param rounds - Bcrypt rounds (default 12)
 * @returns Hashed password
 *
 * @example
 * const hash = await hashPassword('MyP@ssw0rd!');
 */
export declare function hashPassword(password: string, rounds?: number): Promise<string>;
/**
 * Verifies password against hash
 *
 * @param password - Plain text password
 * @param hash - Stored password hash
 * @returns True if password matches
 *
 * @example
 * const isValid = await verifyPassword('MyP@ssw0rd!', storedHash);
 */
export declare function verifyPassword(password: string, hash: string): Promise<boolean>;
/**
 * Tracks failed login attempts and determines lockout
 *
 * @param identifier - User ID or IP address
 * @param config - Lockout configuration
 * @param tracker - Current tracking state
 * @returns Updated tracker and lockout status
 *
 * @example
 * const { tracker, isLocked } = trackFailedLogin('user-123', lockoutConfig, currentTracker);
 */
export declare function trackFailedLogin(identifier: string, config: LockoutConfig, tracker?: BruteForceTracker): {
    tracker: BruteForceTracker;
    isLocked: boolean;
    lockDuration: number;
};
/**
 * Checks if account is currently locked
 *
 * @param tracker - Brute force tracker
 * @returns True if account is locked
 *
 * @example
 * if (isAccountLocked(tracker)) {
 *   throw new UnauthorizedException('Account is locked');
 * }
 */
export declare function isAccountLocked(tracker?: BruteForceTracker): boolean;
/**
 * Resets failed login attempts on successful login
 *
 * @param identifier - User ID or IP address
 * @returns Cleared tracker
 *
 * @example
 * resetFailedLoginAttempts('user-123');
 */
export declare function resetFailedLoginAttempts(identifier: string): BruteForceTracker;
/**
 * Detects suspicious login patterns
 *
 * @param attempts - Array of recent login attempts
 * @param threshold - Attempts threshold for suspicion
 * @returns Suspicion analysis
 *
 * @example
 * const analysis = detectSuspiciousActivity(recentAttempts, 10);
 */
export declare function detectSuspiciousActivity(attempts: Array<{
    timestamp: Date;
    ipAddress: string;
    success: boolean;
}>, threshold?: number): {
    isSuspicious: boolean;
    reason?: string;
    riskScore: number;
};
/**
 * Generates secure HTTP headers configuration
 *
 * @param config - Security headers configuration
 * @returns Headers object for Express/NestJS
 *
 * @example
 * const headers = generateSecurityHeaders({
 *   strictTransportSecurity: true,
 *   xFrameOptions: 'DENY'
 * });
 */
export declare function generateSecurityHeaders(config?: SecurityHeadersConfig): Record<string, string>;
/**
 * Creates CORS configuration for healthcare APIs
 *
 * @param allowedOrigins - Allowed origin domains
 * @param credentials - Allow credentials (cookies, auth headers)
 * @returns CORS configuration object
 *
 * @example
 * const corsConfig = createCORSConfig(['https://app.white-cross.com'], true);
 */
export declare function createCORSConfig(allowedOrigins: string[], credentials?: boolean): {
    origin: string[] | ((origin: string, callback: (err: Error | null, allow?: boolean) => void) => void);
    credentials: boolean;
    methods: string[];
    allowedHeaders: string[];
    exposedHeaders: string[];
    maxAge: number;
};
/**
 * Implements token rotation with grace period
 *
 * @param oldToken - Current refresh token
 * @param policy - Token rotation policy
 * @returns New tokens and rotation metadata
 *
 * @example
 * const { accessToken, refreshToken, oldTokenValidUntil } = rotateTokens(
 *   currentRefreshToken,
 *   rotationPolicy
 * );
 */
export declare function rotateTokens(oldToken: string, policy: TokenRotationPolicy, generateNewTokens: () => {
    accessToken: string;
    refreshToken: string;
}): {
    accessToken: string;
    refreshToken: string;
    oldTokenValidUntil?: Date;
    rotationId: string;
};
/**
 * Detects token reuse after rotation (security breach indicator)
 *
 * @param tokenId - Token identifier
 * @param rotationHistory - History of token rotations
 * @returns True if token reuse is detected
 *
 * @example
 * if (detectTokenReuse(tokenId, rotationHistory)) {
 *   // Revoke all tokens for this user - possible security breach
 * }
 */
export declare function detectTokenReuse(tokenId: string, rotationHistory: Array<{
    tokenId: string;
    rotatedAt: Date;
    usedAfterRotation: boolean;
}>): boolean;
/**
 * Validates refresh token and checks rotation limits
 *
 * @param token - Refresh token to validate
 * @param policy - Token rotation policy
 * @param rotationCount - Number of times token has been rotated
 * @returns True if token is valid for rotation
 * @throws UnauthorizedException if rotation limit exceeded
 *
 * @example
 * validateRefreshToken(refreshToken, policy, currentRotationCount);
 */
export declare function validateRefreshToken(token: string, policy: TokenRotationPolicy, rotationCount: number): boolean;
/**
 * Generates WebAuthn challenge for biometric authentication
 *
 * @param userId - User ID for the challenge
 * @returns Challenge data for WebAuthn ceremony
 *
 * @example
 * const challenge = generateWebAuthnChallenge('user-123');
 */
export declare function generateWebAuthnChallenge(userId: string): {
    challenge: string;
    challengeId: string;
    expiresAt: Date;
};
/**
 * Verifies WebAuthn assertion signature
 *
 * @param assertion - WebAuthn assertion from authenticator
 * @param publicKey - Stored public key for the credential
 * @param challenge - Original challenge
 * @returns True if signature is valid
 *
 * @example
 * const isValid = verifyWebAuthnAssertion(assertion, storedPublicKey, challenge);
 */
export declare function verifyWebAuthnAssertion(assertion: {
    authenticatorData: Buffer;
    clientDataJSON: Buffer;
    signature: Buffer;
}, publicKey: string, challenge: string): boolean;
/**
 * Registers biometric credential for user
 *
 * @param userId - User ID
 * @param credentialId - Credential ID from authenticator
 * @param publicKey - Public key from attestation
 * @param counter - Signature counter
 * @returns Biometric auth data
 *
 * @example
 * const bioData = registerBiometricCredential('user-123', credId, pubKey, 0);
 */
export declare function registerBiometricCredential(userId: string, credentialId: string, publicKey: string, counter: number, deviceType?: 'platform' | 'cross-platform'): BiometricAuthData;
/**
 * Validates biometric signature counter to prevent replay attacks
 *
 * @param newCounter - Counter from current assertion
 * @param storedCounter - Previously stored counter
 * @returns True if counter is valid
 * @throws UnauthorizedException if counter indicates replay attack
 *
 * @example
 * validateBiometricCounter(newCounter, storedData.counter);
 */
export declare function validateBiometricCounter(newCounter: number, storedCounter: number): boolean;
//# sourceMappingURL=authentication-authorization-kit.d.ts.map