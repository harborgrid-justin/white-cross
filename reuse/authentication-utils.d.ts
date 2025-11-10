/**
 * LOC: AUTH1234567
 * File: /reuse/authentication-utils.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Authentication services
 *   - Auth controllers
 *   - Security middleware
 *   - Guard implementations
 */
interface JWTPayload {
    sub: string;
    email?: string;
    role?: string;
    permissions?: string[];
    iat?: number;
    exp?: number;
    [key: string]: any;
}
interface JWTConfig {
    secret: string;
    expiresIn?: string | number;
    algorithm?: string;
    issuer?: string;
    audience?: string;
}
interface RefreshTokenConfig {
    userId: string;
    deviceId?: string;
    expiresIn?: string | number;
}
interface SessionData {
    userId: string;
    createdAt: Date;
    lastActivity: Date;
    expiresAt: Date;
    ipAddress?: string;
    userAgent?: string;
}
interface OAuth2Config {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    scope?: string[];
    state?: string;
}
interface OAuth2TokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token?: string;
    scope?: string;
}
interface ApiKeyConfig {
    prefix?: string;
    length?: number;
    expiresIn?: number;
}
interface PasswordStrengthResult {
    score: number;
    isStrong: boolean;
    feedback: string[];
}
interface BiometricAuthData {
    userId: string;
    biometricType: 'fingerprint' | 'face' | 'voice';
    templateHash: string;
    enrolledAt: Date;
}
/**
 * Creates a JWT access token with standard claims.
 *
 * @param {JWTPayload} payload - Token payload
 * @param {JWTConfig} config - JWT configuration
 * @returns {string} Signed JWT token
 *
 * @example
 * ```typescript
 * const token = createJWTToken(
 *   { sub: 'user123', email: 'user@example.com', role: 'doctor' },
 *   { secret: 'secret-key', expiresIn: '15m', issuer: 'white-cross' }
 * );
 * ```
 */
export declare const createJWTToken: (payload: JWTPayload, config: JWTConfig) => string;
/**
 * Verifies and decodes a JWT token.
 *
 * @param {string} token - JWT token to verify
 * @param {string} secret - Secret key for verification
 * @param {object} [options] - Verification options
 * @returns {JWTPayload | null} Decoded payload or null if invalid
 *
 * @example
 * ```typescript
 * const payload = verifyJWTToken(token, 'secret-key', { issuer: 'white-cross' });
 * if (payload) {
 *   console.log('User ID:', payload.sub);
 * }
 * ```
 */
export declare const verifyJWTToken: (token: string, secret: string, options?: {
    issuer?: string;
    audience?: string;
}) => JWTPayload | null;
/**
 * Decodes JWT token without verification (unsafe - use for inspection only).
 *
 * @param {string} token - JWT token to decode
 * @returns {JWTPayload | null} Decoded payload or null if invalid format
 *
 * @example
 * ```typescript
 * const payload = decodeJWTToken(token);
 * console.log('Token expires at:', new Date(payload.exp * 1000));
 * ```
 */
export declare const decodeJWTToken: (token: string) => JWTPayload | null;
/**
 * Checks if JWT token is expired.
 *
 * @param {string} token - JWT token to check
 * @returns {boolean} True if token is expired
 *
 * @example
 * ```typescript
 * if (isJWTExpired(token)) {
 *   console.log('Token expired, please refresh');
 * }
 * ```
 */
export declare const isJWTExpired: (token: string) => boolean;
/**
 * Gets remaining time until JWT expiration.
 *
 * @param {string} token - JWT token
 * @returns {number} Seconds until expiration (0 if expired)
 *
 * @example
 * ```typescript
 * const seconds = getJWTTimeToExpiry(token);
 * console.log(`Token expires in ${seconds} seconds`);
 * ```
 */
export declare const getJWTTimeToExpiry: (token: string) => number;
/**
 * Creates a refresh token with extended expiration.
 *
 * @param {RefreshTokenConfig} config - Refresh token configuration
 * @param {string} secret - Secret key
 * @returns {string} Refresh token
 *
 * @example
 * ```typescript
 * const refreshToken = createRefreshToken(
 *   { userId: 'user123', deviceId: 'device456', expiresIn: '7d' },
 *   'refresh-secret'
 * );
 * ```
 */
export declare const createRefreshToken: (config: RefreshTokenConfig, secret: string) => string;
/**
 * Generates refresh token family ID for rotation tracking.
 *
 * @returns {string} Unique family ID
 *
 * @example
 * ```typescript
 * const familyId = generateRefreshTokenFamily();
 * // Store with refresh token for rotation detection
 * ```
 */
export declare const generateRefreshTokenFamily: () => string;
/**
 * Hashes refresh token for secure storage.
 *
 * @param {string} token - Refresh token to hash
 * @returns {string} Token hash
 *
 * @example
 * ```typescript
 * const hash = hashRefreshToken(refreshToken);
 * // Store hash in database instead of plain token
 * ```
 */
export declare const hashRefreshToken: (token: string) => string;
/**
 * Verifies refresh token and returns payload.
 *
 * @param {string} token - Refresh token
 * @param {string} secret - Secret key
 * @returns {JWTPayload | null} Token payload or null if invalid
 *
 * @example
 * ```typescript
 * const payload = verifyRefreshToken(refreshToken, 'refresh-secret');
 * if (payload && payload.type === 'refresh') {
 *   // Issue new access token
 * }
 * ```
 */
export declare const verifyRefreshToken: (token: string, secret: string) => JWTPayload | null;
/**
 * Creates Passport JWT strategy options.
 *
 * @param {string} secret - JWT secret
 * @param {object} [options] - Additional options
 * @returns {object} Passport JWT strategy configuration
 *
 * @example
 * ```typescript
 * const strategyOptions = createPassportJWTOptions('secret-key', {
 *   issuer: 'white-cross',
 *   audience: 'white-cross-api'
 * });
 * ```
 */
export declare const createPassportJWTOptions: (secret: string, options?: {
    issuer?: string;
    audience?: string;
}) => {
    jwtFromRequest: (request: any) => string | null;
    secretOrKey: string;
    issuer: string | undefined;
    audience: string | undefined;
    ignoreExpiration: boolean;
};
/**
 * Extracts JWT token from Authorization header.
 *
 * @param {any} request - HTTP request object
 * @returns {string | null} JWT token or null
 *
 * @example
 * ```typescript
 * const token = extractJWTFromHeader(request);
 * // Extracts from 'Authorization: Bearer <token>'
 * ```
 */
export declare const extractJWTFromHeader: (request: any) => string | null;
/**
 * Extracts JWT token from cookie.
 *
 * @param {any} request - HTTP request object
 * @param {string} [cookieName] - Cookie name (default: 'access_token')
 * @returns {string | null} JWT token or null
 *
 * @example
 * ```typescript
 * const token = extractJWTFromCookie(request, 'auth_token');
 * ```
 */
export declare const extractJWTFromCookie: (request: any, cookieName?: string) => string | null;
/**
 * Creates basic authentication credentials from username and password.
 *
 * @param {string} username - Username
 * @param {string} password - Password
 * @returns {string} Base64 encoded credentials
 *
 * @example
 * ```typescript
 * const credentials = createBasicAuthCredentials('user', 'pass');
 * // Result: 'dXNlcjpwYXNz'
 * // Use in header: 'Authorization: Basic dXNlcjpwYXNz'
 * ```
 */
export declare const createBasicAuthCredentials: (username: string, password: string) => string;
/**
 * Parses basic authentication credentials from header.
 *
 * @param {string} authHeader - Authorization header value
 * @returns {object | null} Credentials object or null
 *
 * @example
 * ```typescript
 * const creds = parseBasicAuthCredentials('Basic dXNlcjpwYXNz');
 * // Result: { username: 'user', password: 'pass' }
 * ```
 */
export declare const parseBasicAuthCredentials: (authHeader: string) => {
    username: string;
    password: string;
} | null;
/**
 * Creates a new session with metadata.
 *
 * @param {string} userId - User ID
 * @param {object} [metadata] - Additional session metadata
 * @returns {SessionData} Session data object
 *
 * @example
 * ```typescript
 * const session = createSession('user123', {
 *   ipAddress: '192.168.1.1',
 *   userAgent: 'Mozilla/5.0...'
 * });
 * ```
 */
export declare const createSession: (userId: string, metadata?: {
    ipAddress?: string;
    userAgent?: string;
    expiresIn?: number;
}) => SessionData;
/**
 * Generates a secure session ID.
 *
 * @param {number} [length] - Session ID length in bytes (default: 32)
 * @returns {string} Session ID
 *
 * @example
 * ```typescript
 * const sessionId = generateSessionId();
 * // Result: 64 character hex string
 * ```
 */
export declare const generateSessionId: (length?: number) => string;
/**
 * Validates if session is still active.
 *
 * @param {SessionData} session - Session data
 * @returns {boolean} True if session is active
 *
 * @example
 * ```typescript
 * if (isSessionActive(session)) {
 *   // Allow access
 * } else {
 *   // Require re-authentication
 * }
 * ```
 */
export declare const isSessionActive: (session: SessionData) => boolean;
/**
 * Updates session last activity timestamp.
 *
 * @param {SessionData} session - Session data
 * @returns {SessionData} Updated session data
 *
 * @example
 * ```typescript
 * const updated = updateSessionActivity(session);
 * ```
 */
export declare const updateSessionActivity: (session: SessionData) => SessionData;
/**
 * Extends session expiration time.
 *
 * @param {SessionData} session - Session data
 * @param {number} extensionMs - Extension time in milliseconds
 * @returns {SessionData} Extended session data
 *
 * @example
 * ```typescript
 * const extended = extendSession(session, 3600000); // Extend by 1 hour
 * ```
 */
export declare const extendSession: (session: SessionData, extensionMs: number) => SessionData;
/**
 * Generates OAuth 2.0 authorization URL.
 *
 * @param {string} authorizationEndpoint - OAuth provider's authorization endpoint
 * @param {OAuth2Config} config - OAuth configuration
 * @returns {string} Authorization URL
 *
 * @example
 * ```typescript
 * const url = generateOAuth2AuthorizationUrl(
 *   'https://provider.com/oauth/authorize',
 *   {
 *     clientId: 'client123',
 *     redirectUri: 'https://app.com/callback',
 *     scope: ['read', 'write'],
 *     state: 'random-state'
 *   }
 * );
 * ```
 */
export declare const generateOAuth2AuthorizationUrl: (authorizationEndpoint: string, config: OAuth2Config) => string;
/**
 * Generates OAuth 2.0 state parameter for CSRF protection.
 *
 * @returns {string} Random state parameter
 *
 * @example
 * ```typescript
 * const state = generateStateParameter();
 * // Store in session and verify on callback
 * ```
 */
export declare const generateStateParameter: () => string;
/**
 * Exchanges authorization code for access token (client credentials).
 *
 * @param {string} tokenEndpoint - OAuth provider's token endpoint
 * @param {string} code - Authorization code
 * @param {OAuth2Config} config - OAuth configuration
 * @returns {Promise<OAuth2TokenResponse>} Token response
 *
 * @example
 * ```typescript
 * const tokens = await exchangeCodeForToken(
 *   'https://provider.com/oauth/token',
 *   authCode,
 *   { clientId: '...', clientSecret: '...', redirectUri: '...' }
 * );
 * ```
 */
export declare const exchangeCodeForToken: (tokenEndpoint: string, code: string, config: OAuth2Config) => Promise<OAuth2TokenResponse>;
/**
 * Requests access token using client credentials grant.
 *
 * @param {string} tokenEndpoint - OAuth provider's token endpoint
 * @param {string} clientId - Client ID
 * @param {string} clientSecret - Client secret
 * @param {string[]} [scope] - Requested scopes
 * @returns {Promise<OAuth2TokenResponse>} Token response
 *
 * @example
 * ```typescript
 * const tokens = await requestClientCredentialsToken(
 *   'https://provider.com/oauth/token',
 *   'client123',
 *   'secret456',
 *   ['read', 'write']
 * );
 * ```
 */
export declare const requestClientCredentialsToken: (tokenEndpoint: string, clientId: string, clientSecret: string, scope?: string[]) => Promise<OAuth2TokenResponse>;
/**
 * Refreshes OAuth 2.0 access token using refresh token.
 *
 * @param {string} tokenEndpoint - OAuth provider's token endpoint
 * @param {string} refreshToken - Refresh token
 * @param {string} clientId - Client ID
 * @param {string} clientSecret - Client secret
 * @returns {Promise<OAuth2TokenResponse>} Token response
 *
 * @example
 * ```typescript
 * const newTokens = await refreshOAuth2Token(
 *   'https://provider.com/oauth/token',
 *   refreshToken,
 *   'client123',
 *   'secret456'
 * );
 * ```
 */
export declare const refreshOAuth2Token: (tokenEndpoint: string, refreshToken: string, clientId: string, clientSecret: string) => Promise<OAuth2TokenResponse>;
/**
 * Generates a secure API key.
 *
 * @param {ApiKeyConfig} [config] - API key configuration
 * @returns {string} Generated API key
 *
 * @example
 * ```typescript
 * const apiKey = generateApiKey({ prefix: 'wc_live_', length: 32 });
 * // Result: 'wc_live_a1b2c3d4e5f6...'
 * ```
 */
export declare const generateApiKey: (config?: ApiKeyConfig) => string;
/**
 * Validates API key format.
 *
 * @param {string} apiKey - API key to validate
 * @param {string} [expectedPrefix] - Expected prefix
 * @returns {boolean} True if valid format
 *
 * @example
 * ```typescript
 * const isValid = validateApiKeyFormat(apiKey, 'wc_live_');
 * ```
 */
export declare const validateApiKeyFormat: (apiKey: string, expectedPrefix?: string) => boolean;
/**
 * Hashes API key for secure storage.
 *
 * @param {string} apiKey - API key to hash
 * @returns {string} Hashed API key
 *
 * @example
 * ```typescript
 * const hash = hashApiKey(apiKey);
 * // Store hash in database, compare on requests
 * ```
 */
export declare const hashApiKey: (apiKey: string) => string;
/**
 * Verifies API key against stored hash.
 *
 * @param {string} apiKey - API key to verify
 * @param {string} storedHash - Stored hash to compare
 * @returns {boolean} True if API key matches hash
 *
 * @example
 * ```typescript
 * if (verifyApiKey(providedKey, storedHash)) {
 *   // Allow API access
 * }
 * ```
 */
export declare const verifyApiKey: (apiKey: string, storedHash: string) => boolean;
/**
 * Generates TOTP secret for 2FA setup.
 *
 * @returns {string} Base32 encoded secret
 *
 * @example
 * ```typescript
 * const secret = generateTOTPSecret();
 * // Use with QR code for authenticator app
 * ```
 */
export declare const generateTOTPSecret: () => string;
/**
 * Generates TOTP code from secret (simulated).
 *
 * @param {string} secret - TOTP secret
 * @param {number} [step] - Time step in seconds (default: 30)
 * @returns {string} 6-digit TOTP code
 *
 * @example
 * ```typescript
 * const code = generateTOTPCode(secret);
 * // Result: '123456'
 * ```
 */
export declare const generateTOTPCode: (secret: string, step?: number) => string;
/**
 * Verifies TOTP code against secret (simulated).
 *
 * @param {string} code - TOTP code to verify
 * @param {string} secret - TOTP secret
 * @param {number} [window] - Time window tolerance (default: 1)
 * @returns {boolean} True if code is valid
 *
 * @example
 * ```typescript
 * if (verifyTOTPCode(userCode, secret, 1)) {
 *   // MFA verification successful
 * }
 * ```
 */
export declare const verifyTOTPCode: (code: string, secret: string, window?: number) => boolean;
/**
 * Generates backup codes for 2FA recovery.
 *
 * @param {number} [count] - Number of backup codes (default: 10)
 * @returns {string[]} Array of backup codes
 *
 * @example
 * ```typescript
 * const backupCodes = generateBackupCodes(10);
 * // Result: ['A1B2-C3D4', 'E5F6-G7H8', ...]
 * ```
 */
export declare const generateBackupCodes: (count?: number) => string[];
/**
 * Hashes backup code for storage.
 *
 * @param {string} code - Backup code
 * @returns {string} Hashed code
 *
 * @example
 * ```typescript
 * const hash = hashBackupCode('A1B2-C3D4');
 * // Store hashed version in database
 * ```
 */
export declare const hashBackupCode: (code: string) => string;
/**
 * Validates password strength with comprehensive checks.
 *
 * @param {string} password - Password to validate
 * @returns {PasswordStrengthResult} Validation result with score and feedback
 *
 * @example
 * ```typescript
 * const result = validatePasswordStrength('MyP@ssw0rd123');
 * // Result: { score: 4, isStrong: true, feedback: [] }
 * ```
 */
export declare const validatePasswordStrength: (password: string) => PasswordStrengthResult;
/**
 * Checks if password meets minimum requirements.
 *
 * @param {string} password - Password to check
 * @param {object} [requirements] - Custom requirements
 * @returns {boolean} True if password meets requirements
 *
 * @example
 * ```typescript
 * const isValid = checkPasswordRequirements('MyP@ss123', {
 *   minLength: 8,
 *   requireUppercase: true,
 *   requireNumbers: true
 * });
 * ```
 */
export declare const checkPasswordRequirements: (password: string, requirements?: {
    minLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumbers?: boolean;
    requireSpecialChars?: boolean;
}) => boolean;
/**
 * Generates a strong random password.
 *
 * @param {number} [length] - Password length (default: 16)
 * @returns {string} Generated password
 *
 * @example
 * ```typescript
 * const password = generateStrongPassword(20);
 * // Result: 'aB3@xY9#mN2$pQ1&'
 * ```
 */
export declare const generateStrongPassword: (length?: number) => string;
/**
 * Creates biometric authentication challenge.
 *
 * @returns {string} Random challenge for biometric verification
 *
 * @example
 * ```typescript
 * const challenge = createBiometricChallenge();
 * // Send to client for biometric signing
 * ```
 */
export declare const createBiometricChallenge: () => string;
/**
 * Enrolls biometric template (simulated).
 *
 * @param {string} userId - User ID
 * @param {string} biometricType - Type of biometric
 * @param {string} template - Biometric template data
 * @returns {BiometricAuthData} Enrollment data
 *
 * @example
 * ```typescript
 * const enrollment = enrollBiometric('user123', 'fingerprint', templateData);
 * ```
 */
export declare const enrollBiometric: (userId: string, biometricType: "fingerprint" | "face" | "voice", template: string) => BiometricAuthData;
/**
 * Verifies biometric authentication (simulated).
 *
 * @param {string} template - Biometric template to verify
 * @param {string} storedHash - Stored template hash
 * @returns {boolean} True if biometric matches
 *
 * @example
 * ```typescript
 * if (verifyBiometric(scannedTemplate, storedHash)) {
 *   // Biometric authentication successful
 * }
 * ```
 */
export declare const verifyBiometric: (template: string, storedHash: string) => boolean;
/**
 * Generates SAML authentication request XML.
 * For production use, consider passport-saml or saml2-js libraries for complete SAML support.
 *
 * @param {string} entityId - Service provider entity ID
 * @param {string} acsUrl - Assertion consumer service URL
 * @param {object} [options] - Additional SAML options
 * @returns {string} SAML AuthnRequest XML
 *
 * @example
 * ```typescript
 * const samlRequest = generateSAMLRequest(
 *   'https://app.whitecross.com',
 *   'https://app.whitecross.com/saml/acs'
 * );
 * ```
 */
export declare const generateSAMLRequest: (entityId: string, acsUrl: string, options?: {
    destination?: string;
    forceAuthn?: boolean;
    nameIDFormat?: string;
}) => string;
/**
 * Parses SAML response and extracts user data.
 * For production use with signature verification, use passport-saml or saml2-js.
 *
 * @param {string} samlResponse - Base64 encoded SAML response
 * @returns {object} Parsed SAML data with user information
 *
 * @example
 * ```typescript
 * const userData = parseSAMLResponse(base64Response);
 * console.log(userData.userId, userData.attributes);
 * ```
 */
export declare const parseSAMLResponse: (samlResponse: string) => any;
declare const _default: {
    createJWTToken: (payload: JWTPayload, config: JWTConfig) => string;
    verifyJWTToken: (token: string, secret: string, options?: {
        issuer?: string;
        audience?: string;
    }) => JWTPayload | null;
    decodeJWTToken: (token: string) => JWTPayload | null;
    isJWTExpired: (token: string) => boolean;
    getJWTTimeToExpiry: (token: string) => number;
    createRefreshToken: (config: RefreshTokenConfig, secret: string) => string;
    generateRefreshTokenFamily: () => string;
    hashRefreshToken: (token: string) => string;
    verifyRefreshToken: (token: string, secret: string) => JWTPayload | null;
    createPassportJWTOptions: (secret: string, options?: {
        issuer?: string;
        audience?: string;
    }) => {
        jwtFromRequest: (request: any) => string | null;
        secretOrKey: string;
        issuer: string | undefined;
        audience: string | undefined;
        ignoreExpiration: boolean;
    };
    extractJWTFromHeader: (request: any) => string | null;
    extractJWTFromCookie: (request: any, cookieName?: string) => string | null;
    createBasicAuthCredentials: (username: string, password: string) => string;
    parseBasicAuthCredentials: (authHeader: string) => {
        username: string;
        password: string;
    } | null;
    createSession: (userId: string, metadata?: {
        ipAddress?: string;
        userAgent?: string;
        expiresIn?: number;
    }) => SessionData;
    generateSessionId: (length?: number) => string;
    isSessionActive: (session: SessionData) => boolean;
    updateSessionActivity: (session: SessionData) => SessionData;
    extendSession: (session: SessionData, extensionMs: number) => SessionData;
    generateOAuth2AuthorizationUrl: (authorizationEndpoint: string, config: OAuth2Config) => string;
    generateStateParameter: () => string;
    exchangeCodeForToken: (tokenEndpoint: string, code: string, config: OAuth2Config) => Promise<OAuth2TokenResponse>;
    requestClientCredentialsToken: (tokenEndpoint: string, clientId: string, clientSecret: string, scope?: string[]) => Promise<OAuth2TokenResponse>;
    refreshOAuth2Token: (tokenEndpoint: string, refreshToken: string, clientId: string, clientSecret: string) => Promise<OAuth2TokenResponse>;
    generateApiKey: (config?: ApiKeyConfig) => string;
    validateApiKeyFormat: (apiKey: string, expectedPrefix?: string) => boolean;
    hashApiKey: (apiKey: string) => string;
    verifyApiKey: (apiKey: string, storedHash: string) => boolean;
    generateTOTPSecret: () => string;
    generateTOTPCode: (secret: string, step?: number) => string;
    verifyTOTPCode: (code: string, secret: string, window?: number) => boolean;
    generateBackupCodes: (count?: number) => string[];
    hashBackupCode: (code: string) => string;
    validatePasswordStrength: (password: string) => PasswordStrengthResult;
    checkPasswordRequirements: (password: string, requirements?: {
        minLength?: number;
        requireUppercase?: boolean;
        requireLowercase?: boolean;
        requireNumbers?: boolean;
        requireSpecialChars?: boolean;
    }) => boolean;
    generateStrongPassword: (length?: number) => string;
    createBiometricChallenge: () => string;
    enrollBiometric: (userId: string, biometricType: "fingerprint" | "face" | "voice", template: string) => BiometricAuthData;
    verifyBiometric: (template: string, storedHash: string) => boolean;
    generateSAMLRequest: (entityId: string, acsUrl: string, options?: {
        destination?: string;
        forceAuthn?: boolean;
        nameIDFormat?: string;
    }) => string;
    parseSAMLResponse: (samlResponse: string) => any;
};
export default _default;
//# sourceMappingURL=authentication-utils.d.ts.map