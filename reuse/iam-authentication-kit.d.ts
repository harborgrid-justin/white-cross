/**
 * LOC: IAM_AUTH_KIT_001
 * File: /reuse/iam-authentication-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/passport
 *   - @nestjs/jwt
 *   - passport
 *   - bcrypt
 *   - crypto
 *
 * DOWNSTREAM (imported by):
 *   - Authentication services
 *   - Auth controllers
 *   - Passport strategies
 *   - Authentication guards
 *   - Session middleware
 */
import { Request, Response } from 'express';
/**
 * Authentication flow types
 */
export declare enum AuthFlowType {
    LOCAL = "local",
    OAUTH = "oauth",
    SAML = "saml",
    API_KEY = "api_key",
    BIOMETRIC = "biometric",
    MFA = "mfa"
}
/**
 * User authentication payload
 */
export interface AuthPayload {
    userId: string;
    email: string;
    role: string;
    permissions?: string[];
    sessionId?: string;
    deviceId?: string;
    ipAddress?: string;
    userAgent?: string;
    mfaVerified?: boolean;
    authMethod?: AuthFlowType;
}
/**
 * Session data structure
 */
export interface SessionData {
    sessionId: string;
    userId: string;
    email: string;
    role: string;
    createdAt: Date;
    lastActivity: Date;
    expiresAt: Date;
    ipAddress?: string;
    userAgent?: string;
    deviceId?: string;
    mfaVerified: boolean;
    rememberMe: boolean;
    metadata?: Record<string, any>;
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
 * Authentication result
 */
export interface AuthResult {
    success: boolean;
    userId?: string;
    accessToken?: string;
    refreshToken?: string;
    expiresIn?: number;
    requiresMfa?: boolean;
    mfaToken?: string;
    message?: string;
}
/**
 * OAuth provider configuration
 */
export interface OAuthProviderConfig {
    provider: 'google' | 'github' | 'microsoft' | 'custom';
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    scope?: string[];
    authorizationUrl?: string;
    tokenUrl?: string;
    userInfoUrl?: string;
}
/**
 * SAML configuration
 */
export interface SamlConfig {
    entryPoint: string;
    issuer: string;
    callbackUrl: string;
    cert: string;
    privateKey?: string;
    signatureAlgorithm?: string;
}
/**
 * Cookie options
 */
export interface AuthCookieOptions {
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
    maxAge?: number;
    domain?: string;
    path?: string;
}
/**
 * MFA configuration
 */
export interface MfaConfig {
    enabled: boolean;
    methods: ('totp' | 'sms' | 'email')[];
    gracePeriod?: number;
    backupCodesCount?: number;
}
/**
 * Password reset request
 */
export interface PasswordResetRequest {
    email: string;
    token: string;
    newPassword: string;
}
/**
 * Remember-me token
 */
export interface RememberMeToken {
    userId: string;
    selector: string;
    validator: string;
    expiresAt: Date;
}
/**
 * @function validateLocalCredentials
 * @description Validates user credentials for local authentication
 * @param {LoginCredentials} credentials - User login credentials
 * @param {string} storedPasswordHash - Stored bcrypt password hash
 * @returns {Promise<boolean>} True if credentials are valid
 *
 * @security Uses bcrypt constant-time comparison
 *
 * @example
 * ```typescript
 * const isValid = await validateLocalCredentials(
 *   { email: 'user@example.com', password: 'SecureP@ss123' },
 *   user.passwordHash
 * );
 * if (isValid) {
 *   // Proceed with login
 * }
 * ```
 */
export declare const validateLocalCredentials: (credentials: LoginCredentials, storedPasswordHash: string) => Promise<boolean>;
/**
 * @function performLocalLogin
 * @description Performs complete local authentication flow
 * @param {LoginCredentials} credentials - Login credentials
 * @param {Function} userLookup - Async function to lookup user by email
 * @returns {Promise<AuthResult>} Authentication result
 *
 * @example
 * ```typescript
 * const result = await performLocalLogin(credentials, async (email) => {
 *   return await userService.findByEmail(email);
 * });
 * ```
 */
export declare const performLocalLogin: (credentials: LoginCredentials, userLookup: (email: string) => Promise<any>) => Promise<AuthResult>;
/**
 * @function hashPasswordForStorage
 * @description Hashes password with bcrypt for secure storage
 * @param {string} password - Plain text password
 * @param {number} saltRounds - Bcrypt salt rounds (default: 12)
 * @returns {Promise<string>} Password hash
 *
 * @security HIPAA-compliant with 12+ salt rounds
 *
 * @example
 * ```typescript
 * const hash = await hashPasswordForStorage('MySecureP@ss123');
 * // Store hash in database
 * ```
 */
export declare const hashPasswordForStorage: (password: string, saltRounds?: number) => Promise<string>;
/**
 * @function validatePasswordComplexity
 * @description Validates password meets complexity requirements
 * @param {string} password - Password to validate
 * @returns {object} Validation result with errors
 *
 * @security Enforces HIPAA-compliant password requirements
 *
 * @example
 * ```typescript
 * const validation = validatePasswordComplexity('weak');
 * if (!validation.isValid) {
 *   console.log('Errors:', validation.errors);
 * }
 * ```
 */
export declare const validatePasswordComplexity: (password: string) => {
    isValid: boolean;
    errors: string[];
    score: number;
};
/**
 * @function createAuthSession
 * @description Creates a new authentication session
 * @param {AuthPayload} payload - Authentication payload
 * @param {number} expirationMs - Session expiration in milliseconds
 * @returns {SessionData} Session data object
 *
 * @example
 * ```typescript
 * const session = createAuthSession(
 *   { userId: 'user123', email: 'user@example.com', role: 'doctor' },
 *   3600000 // 1 hour
 * );
 * ```
 */
export declare const createAuthSession: (payload: AuthPayload, expirationMs?: number) => SessionData;
/**
 * @function generateSecureSessionId
 * @description Generates cryptographically secure session ID
 * @returns {string} Session ID (64 character hex string)
 *
 * @security Uses crypto.randomBytes
 *
 * @example
 * ```typescript
 * const sessionId = generateSecureSessionId();
 * ```
 */
export declare const generateSecureSessionId: () => string;
/**
 * @function validateSessionActive
 * @description Checks if session is active and not expired
 * @param {SessionData} session - Session data
 * @returns {boolean} True if session is active
 *
 * @example
 * ```typescript
 * if (!validateSessionActive(session)) {
 *   throw new UnauthorizedException('Session expired');
 * }
 * ```
 */
export declare const validateSessionActive: (session: SessionData) => boolean;
/**
 * @function refreshSessionActivity
 * @description Updates session last activity timestamp
 * @param {SessionData} session - Session to update
 * @returns {SessionData} Updated session
 *
 * @example
 * ```typescript
 * const updated = refreshSessionActivity(session);
 * ```
 */
export declare const refreshSessionActivity: (session: SessionData) => SessionData;
/**
 * @function extendSessionExpiration
 * @description Extends session expiration time
 * @param {SessionData} session - Session to extend
 * @param {number} extensionMs - Extension time in milliseconds
 * @returns {SessionData} Extended session
 *
 * @example
 * ```typescript
 * const extended = extendSessionExpiration(session, 1800000); // Add 30 minutes
 * ```
 */
export declare const extendSessionExpiration: (session: SessionData, extensionMs: number) => SessionData;
/**
 * @function calculateSessionTimeout
 * @description Calculates remaining session time in seconds
 * @param {SessionData} session - Session data
 * @returns {number} Remaining seconds (0 if expired)
 *
 * @example
 * ```typescript
 * const remaining = calculateSessionTimeout(session);
 * console.log(`Session expires in ${remaining} seconds`);
 * ```
 */
export declare const calculateSessionTimeout: (session: SessionData) => number;
/**
 * @function destroySession
 * @description Creates a destroyed session marker for cleanup
 * @param {string} sessionId - Session ID to destroy
 * @returns {object} Destruction metadata
 *
 * @example
 * ```typescript
 * const metadata = destroySession(session.sessionId);
 * await sessionStore.delete(sessionId);
 * ```
 */
export declare const destroySession: (sessionId: string) => {
    sessionId: string;
    destroyedAt: Date;
    reason: string;
};
/**
 * @function generateAccessToken
 * @description Generates short-lived access token
 * @param {AuthPayload} payload - Token payload
 * @param {number} expiresInSeconds - Expiration time (default: 900 = 15 minutes)
 * @returns {string} JWT access token
 *
 * @example
 * ```typescript
 * const token = generateAccessToken({ userId: 'user123', email: '...', role: 'admin' });
 * ```
 */
export declare const generateAccessToken: (payload: AuthPayload, expiresInSeconds?: number) => string;
/**
 * @function generateRefreshToken
 * @description Generates long-lived refresh token
 * @param {string} userId - User ID
 * @param {number} expiresInSeconds - Expiration (default: 604800 = 7 days)
 * @returns {object} Refresh token and hash
 *
 * @example
 * ```typescript
 * const { token, hash } = generateRefreshToken('user123');
 * // Store hash in database
 * ```
 */
export declare const generateRefreshToken: (userId: string, expiresInSeconds?: number) => {
    token: string;
    hash: string;
    expiresAt: Date;
};
/**
 * @function verifyAccessToken
 * @description Verifies and decodes access token
 * @param {string} token - JWT token
 * @param {string} secret - JWT secret
 * @returns {AuthPayload | null} Decoded payload or null
 *
 * @example
 * ```typescript
 * const payload = verifyAccessToken(token, 'secret-key');
 * if (!payload) {
 *   throw new UnauthorizedException('Invalid token');
 * }
 * ```
 */
export declare const verifyAccessToken: (token: string, secret: string) => AuthPayload | null;
/**
 * @function validateRefreshToken
 * @description Validates refresh token against stored hash
 * @param {string} token - Refresh token
 * @param {string} storedHash - Stored token hash
 * @returns {boolean} True if valid
 *
 * @security Uses constant-time comparison
 *
 * @example
 * ```typescript
 * if (!validateRefreshToken(providedToken, storedHash)) {
 *   throw new UnauthorizedException('Invalid refresh token');
 * }
 * ```
 */
export declare const validateRefreshToken: (token: string, storedHash: string) => boolean;
/**
 * @function rotateRefreshToken
 * @description Rotates refresh token (invalidate old, create new)
 * @param {string} userId - User ID
 * @returns {object} New refresh token and hash
 *
 * @security Implements refresh token rotation for security
 *
 * @example
 * ```typescript
 * const newToken = rotateRefreshToken('user123');
 * // Invalidate old token, store new hash
 * ```
 */
export declare const rotateRefreshToken: (userId: string) => {
    token: string;
    hash: string;
    expiresAt: Date;
};
/**
 * @function checkTokenExpiration
 * @description Checks if token is expired
 * @param {string} token - JWT token
 * @returns {boolean} True if expired
 *
 * @example
 * ```typescript
 * if (checkTokenExpiration(token)) {
 *   // Request refresh
 * }
 * ```
 */
export declare const checkTokenExpiration: (token: string) => boolean;
/**
 * @function setAuthCookie
 * @description Sets secure authentication cookie
 * @param {Response} res - Express response
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {AuthCookieOptions} options - Cookie options
 *
 * @security Sets httpOnly, secure, sameSite flags
 *
 * @example
 * ```typescript
 * setAuthCookie(res, 'access_token', token, {
 *   httpOnly: true,
 *   secure: true,
 *   sameSite: 'strict',
 *   maxAge: 900000
 * });
 * ```
 */
export declare const setAuthCookie: (res: Response, name: string, value: string, options?: AuthCookieOptions) => void;
/**
 * @function clearAuthCookie
 * @description Clears authentication cookie
 * @param {Response} res - Express response
 * @param {string} name - Cookie name
 *
 * @example
 * ```typescript
 * clearAuthCookie(res, 'access_token');
 * ```
 */
export declare const clearAuthCookie: (res: Response, name: string) => void;
/**
 * @function extractCookieToken
 * @description Extracts token from request cookie
 * @param {Request} req - Express request
 * @param {string} cookieName - Cookie name
 * @returns {string | null} Token or null
 *
 * @example
 * ```typescript
 * const token = extractCookieToken(req, 'access_token');
 * ```
 */
export declare const extractCookieToken: (req: Request, cookieName: string) => string | null;
/**
 * @function signCookieValue
 * @description Signs cookie value for tamper detection
 * @param {string} value - Value to sign
 * @param {string} secret - Signing secret
 * @returns {string} Signed value (value.signature)
 *
 * @example
 * ```typescript
 * const signed = signCookieValue('user123', 'secret');
 * ```
 */
export declare const signCookieValue: (value: string, secret: string) => string;
/**
 * @function verifyCookieSignature
 * @description Verifies signed cookie value
 * @param {string} signedValue - Signed value
 * @param {string} secret - Signing secret
 * @returns {string | null} Original value or null if invalid
 *
 * @example
 * ```typescript
 * const value = verifyCookieSignature(signedCookie, 'secret');
 * ```
 */
export declare const verifyCookieSignature: (signedValue: string, secret: string) => string | null;
/**
 * @function generateRememberMeToken
 * @description Generates remember-me token with selector and validator
 * @param {string} userId - User ID
 * @returns {RememberMeToken} Remember-me token data
 *
 * @security Uses selector/validator pattern for token theft detection
 *
 * @example
 * ```typescript
 * const rememberMe = generateRememberMeToken('user123');
 * // Store selector and hashed validator in database
 * ```
 */
export declare const generateRememberMeToken: (userId: string) => RememberMeToken;
/**
 * @function hashRememberMeValidator
 * @description Hashes remember-me validator for storage
 * @param {string} validator - Validator string
 * @returns {string} Hashed validator
 *
 * @example
 * ```typescript
 * const hash = hashRememberMeValidator(rememberMe.validator);
 * // Store hash in database
 * ```
 */
export declare const hashRememberMeValidator: (validator: string) => string;
/**
 * @function validateRememberMeToken
 * @description Validates remember-me token
 * @param {string} selector - Token selector
 * @param {string} validator - Token validator
 * @param {string} storedHash - Stored validator hash
 * @returns {boolean} True if valid
 *
 * @example
 * ```typescript
 * const isValid = validateRememberMeToken(selector, validator, storedHash);
 * ```
 */
export declare const validateRememberMeToken: (selector: string, validator: string, storedHash: string) => boolean;
/**
 * @function parseRememberMeCookie
 * @description Parses remember-me cookie value
 * @param {string} cookieValue - Cookie value (selector:validator)
 * @returns {object | null} Parsed selector and validator
 *
 * @example
 * ```typescript
 * const parsed = parseRememberMeCookie(cookie);
 * if (parsed) {
 *   // Validate against database
 * }
 * ```
 */
export declare const parseRememberMeCookie: (cookieValue: string) => {
    selector: string;
    validator: string;
} | null;
/**
 * @function generateMfaToken
 * @description Generates temporary MFA verification token
 * @param {string} userId - User ID
 * @returns {string} MFA token
 *
 * @example
 * ```typescript
 * const mfaToken = generateMfaToken('user123');
 * // Send to client for MFA flow
 * ```
 */
export declare const generateMfaToken: (userId: string) => string;
/**
 * @function verifyMfaToken
 * @description Verifies MFA verification token
 * @param {string} token - MFA token
 * @param {string} secret - JWT secret
 * @returns {string | null} User ID or null
 *
 * @example
 * ```typescript
 * const userId = verifyMfaToken(mfaToken, 'secret');
 * if (userId) {
 *   // Proceed with MFA verification
 * }
 * ```
 */
export declare const verifyMfaToken: (token: string, secret: string) => string | null;
/**
 * @function generateTotpSecret
 * @description Generates TOTP secret for MFA setup
 * @returns {string} Base32 encoded secret
 *
 * @example
 * ```typescript
 * const secret = generateTotpSecret();
 * // Use with authenticator app
 * ```
 */
export declare const generateTotpSecret: () => string;
/**
 * @function generateTotpUri
 * @description Generates TOTP URI for QR code
 * @param {string} secret - TOTP secret
 * @param {string} accountName - Account name (email)
 * @param {string} issuer - Issuer name
 * @returns {string} TOTP URI
 *
 * @example
 * ```typescript
 * const uri = generateTotpUri(secret, 'user@example.com', 'WhiteCross');
 * // Generate QR code from URI
 * ```
 */
export declare const generateTotpUri: (secret: string, accountName: string, issuer?: string) => string;
/**
 * @function generateBackupCodes
 * @description Generates MFA backup codes
 * @param {number} count - Number of codes (default: 10)
 * @returns {string[]} Array of backup codes
 *
 * @example
 * ```typescript
 * const codes = generateBackupCodes(10);
 * // Display codes to user once, store hashes
 * ```
 */
export declare const generateBackupCodes: (count?: number) => string[];
/**
 * @function hashBackupCode
 * @description Hashes backup code for storage
 * @param {string} code - Backup code
 * @returns {string} Hashed code
 *
 * @example
 * ```typescript
 * const hash = hashBackupCode('A1B2-C3D4');
 * ```
 */
export declare const hashBackupCode: (code: string) => string;
/**
 * @function generateOAuthState
 * @description Generates OAuth state parameter for CSRF protection
 * @returns {string} State parameter
 *
 * @example
 * ```typescript
 * const state = generateOAuthState();
 * // Store in session, send to OAuth provider
 * ```
 */
export declare const generateOAuthState: () => string;
/**
 * @function buildOAuthAuthorizationUrl
 * @description Builds OAuth authorization URL
 * @param {OAuthProviderConfig} config - OAuth provider config
 * @param {string} state - State parameter
 * @returns {string} Authorization URL
 *
 * @example
 * ```typescript
 * const url = buildOAuthAuthorizationUrl(config, state);
 * // Redirect user to URL
 * ```
 */
export declare const buildOAuthAuthorizationUrl: (config: OAuthProviderConfig, state: string) => string;
/**
 * @function exchangeOAuthCode
 * @description Exchanges OAuth authorization code for tokens (simulated)
 * @param {string} code - Authorization code
 * @param {OAuthProviderConfig} config - OAuth config
 * @returns {Promise<object>} Token response
 *
 * @example
 * ```typescript
 * const tokens = await exchangeOAuthCode(code, config);
 * ```
 */
export declare const exchangeOAuthCode: (code: string, config: OAuthProviderConfig) => Promise<{
    access_token: string;
    refresh_token?: string;
    expires_in: number;
}>;
/**
 * @function validateOAuthState
 * @description Validates OAuth state parameter
 * @param {string} receivedState - State from OAuth callback
 * @param {string} storedState - State stored in session
 * @returns {boolean} True if valid
 *
 * @security Prevents CSRF attacks in OAuth flow
 *
 * @example
 * ```typescript
 * if (!validateOAuthState(receivedState, sessionState)) {
 *   throw new UnauthorizedException('Invalid OAuth state');
 * }
 * ```
 */
export declare const validateOAuthState: (receivedState: string, storedState: string) => boolean;
/**
 * @function generateSamlRequest
 * @description Generates SAML authentication request
 * @param {SamlConfig} config - SAML configuration
 * @returns {string} SAML request XML
 *
 * @example
 * ```typescript
 * const request = generateSamlRequest(samlConfig);
 * // Send to IdP
 * ```
 */
export declare const generateSamlRequest: (config: SamlConfig) => string;
/**
 * @function parseSamlResponse
 * @description Parses SAML response (placeholder)
 * @param {string} samlResponse - Base64 encoded SAML response
 * @returns {object} Parsed user data
 *
 * @example
 * ```typescript
 * const userData = parseSamlResponse(response);
 * ```
 */
export declare const parseSamlResponse: (samlResponse: string) => {
    userId: string;
    email: string;
    attributes: Record<string, any>;
};
/**
 * @function encodeSamlRequest
 * @description Encodes SAML request for HTTP redirect
 * @param {string} request - SAML request XML
 * @returns {string} Base64 encoded request
 *
 * @example
 * ```typescript
 * const encoded = encodeSamlRequest(samlRequest);
 * ```
 */
export declare const encodeSamlRequest: (request: string) => string;
/**
 * @function createLocalStrategyConfig
 * @description Creates configuration for Passport local strategy
 * @returns {object} Strategy configuration
 *
 * @example
 * ```typescript
 * const config = createLocalStrategyConfig();
 * ```
 */
export declare const createLocalStrategyConfig: () => {
    usernameField: string;
    passwordField: string;
};
/**
 * @function createJwtStrategyConfig
 * @description Creates configuration for Passport JWT strategy
 * @param {string} secret - JWT secret
 * @returns {object} Strategy configuration
 *
 * @example
 * ```typescript
 * const config = createJwtStrategyConfig('secret-key');
 * ```
 */
export declare const createJwtStrategyConfig: (secret: string) => {
    jwtFromRequest: Function;
    secretOrKey: string;
    ignoreExpiration: boolean;
};
/**
 * @function extractBearerToken
 * @description Extracts Bearer token from Authorization header
 * @param {Request} req - Express request
 * @returns {string | null} Token or null
 *
 * @example
 * ```typescript
 * const token = extractBearerToken(req);
 * ```
 */
export declare const extractBearerToken: (req: Request) => string | null;
/**
 * @function trackLoginAttempt
 * @description Creates login attempt record
 * @param {string} email - Email address
 * @param {boolean} success - Whether attempt succeeded
 * @param {string} ipAddress - IP address
 * @returns {object} Attempt record
 *
 * @example
 * ```typescript
 * const attempt = trackLoginAttempt('user@example.com', false, '192.168.1.1');
 * ```
 */
export declare const trackLoginAttempt: (email: string, success: boolean, ipAddress?: string) => {
    email: string;
    success: boolean;
    timestamp: Date;
    ipAddress?: string;
};
/**
 * @function shouldLockAccount
 * @description Determines if account should be locked
 * @param {number} failedAttempts - Number of failed attempts
 * @param {number} threshold - Lockout threshold (default: 5)
 * @returns {boolean} True if should lock
 *
 * @example
 * ```typescript
 * if (shouldLockAccount(user.failedAttempts)) {
 *   // Lock account
 * }
 * ```
 */
export declare const shouldLockAccount: (failedAttempts: number, threshold?: number) => boolean;
/**
 * @function calculateLockoutExpiry
 * @description Calculates account lockout expiry time
 * @param {number} durationMinutes - Lockout duration (default: 30)
 * @returns {Date} Lockout expiry date
 *
 * @example
 * ```typescript
 * const lockoutUntil = calculateLockoutExpiry(30);
 * ```
 */
export declare const calculateLockoutExpiry: (durationMinutes?: number) => Date;
declare const _default: {
    validateLocalCredentials: (credentials: LoginCredentials, storedPasswordHash: string) => Promise<boolean>;
    performLocalLogin: (credentials: LoginCredentials, userLookup: (email: string) => Promise<any>) => Promise<AuthResult>;
    hashPasswordForStorage: (password: string, saltRounds?: number) => Promise<string>;
    validatePasswordComplexity: (password: string) => {
        isValid: boolean;
        errors: string[];
        score: number;
    };
    createAuthSession: (payload: AuthPayload, expirationMs?: number) => SessionData;
    generateSecureSessionId: () => string;
    validateSessionActive: (session: SessionData) => boolean;
    refreshSessionActivity: (session: SessionData) => SessionData;
    extendSessionExpiration: (session: SessionData, extensionMs: number) => SessionData;
    calculateSessionTimeout: (session: SessionData) => number;
    destroySession: (sessionId: string) => {
        sessionId: string;
        destroyedAt: Date;
        reason: string;
    };
    generateAccessToken: (payload: AuthPayload, expiresInSeconds?: number) => string;
    generateRefreshToken: (userId: string, expiresInSeconds?: number) => {
        token: string;
        hash: string;
        expiresAt: Date;
    };
    verifyAccessToken: (token: string, secret: string) => AuthPayload | null;
    validateRefreshToken: (token: string, storedHash: string) => boolean;
    rotateRefreshToken: (userId: string) => {
        token: string;
        hash: string;
        expiresAt: Date;
    };
    checkTokenExpiration: (token: string) => boolean;
    setAuthCookie: (res: Response, name: string, value: string, options?: AuthCookieOptions) => void;
    clearAuthCookie: (res: Response, name: string) => void;
    extractCookieToken: (req: Request, cookieName: string) => string | null;
    signCookieValue: (value: string, secret: string) => string;
    verifyCookieSignature: (signedValue: string, secret: string) => string | null;
    generateRememberMeToken: (userId: string) => RememberMeToken;
    hashRememberMeValidator: (validator: string) => string;
    validateRememberMeToken: (selector: string, validator: string, storedHash: string) => boolean;
    parseRememberMeCookie: (cookieValue: string) => {
        selector: string;
        validator: string;
    } | null;
    generateMfaToken: (userId: string) => string;
    verifyMfaToken: (token: string, secret: string) => string | null;
    generateTotpSecret: () => string;
    generateTotpUri: (secret: string, accountName: string, issuer?: string) => string;
    generateBackupCodes: (count?: number) => string[];
    hashBackupCode: (code: string) => string;
    generateOAuthState: () => string;
    buildOAuthAuthorizationUrl: (config: OAuthProviderConfig, state: string) => string;
    exchangeOAuthCode: (code: string, config: OAuthProviderConfig) => Promise<{
        access_token: string;
        refresh_token?: string;
        expires_in: number;
    }>;
    validateOAuthState: (receivedState: string, storedState: string) => boolean;
    generateSamlRequest: (config: SamlConfig) => string;
    parseSamlResponse: (samlResponse: string) => {
        userId: string;
        email: string;
        attributes: Record<string, any>;
    };
    encodeSamlRequest: (request: string) => string;
    createLocalStrategyConfig: () => {
        usernameField: string;
        passwordField: string;
    };
    createJwtStrategyConfig: (secret: string) => {
        jwtFromRequest: Function;
        secretOrKey: string;
        ignoreExpiration: boolean;
    };
    extractBearerToken: (req: Request) => string | null;
    trackLoginAttempt: (email: string, success: boolean, ipAddress?: string) => {
        email: string;
        success: boolean;
        timestamp: Date;
        ipAddress?: string;
    };
    shouldLockAccount: (failedAttempts: number, threshold?: number) => boolean;
    calculateLockoutExpiry: (durationMinutes?: number) => Date;
};
export default _default;
//# sourceMappingURL=iam-authentication-kit.d.ts.map