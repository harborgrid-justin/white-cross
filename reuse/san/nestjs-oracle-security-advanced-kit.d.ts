/**
 * LOC: S3E4C5U6R7
 * File: /reuse/san/nestjs-oracle-security-advanced-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v11.1.8)
 *   - @nestjs/jwt (v10.2.0)
 *   - @nestjs/passport (v10.0.3)
 *   - bcrypt (v5.1.1)
 *   - crypto (Node.js built-in)
 *   - jsonwebtoken (v9.0.2)
 *   - speakeasy (v2.0.0)
 *   - qrcode (v1.5.3)
 *
 * DOWNSTREAM (imported by):
 *   - Authentication services and guards
 *   - Authorization and permission modules
 *   - Security audit and compliance services
 *   - User and credential management services
 */
/**
 * Authentication provider types
 */
export declare enum AuthProviderType {
    LOCAL = "local",
    OAUTH2 = "oauth2",
    SAML = "saml",
    LDAP = "ldap",
    AZURE_AD = "azure_ad",
    OKTA = "okta",
    GOOGLE = "google"
}
/**
 * Authentication result
 */
export interface AuthenticationResult {
    success: boolean;
    userId?: string;
    accessToken?: string;
    refreshToken?: string;
    expiresIn?: number;
    mfaRequired?: boolean;
    mfaToken?: string;
    metadata?: Record<string, any>;
}
/**
 * OAuth2 provider configuration
 */
export interface OAuth2ProviderConfig {
    clientId: string;
    clientSecret: string;
    authorizationUrl: string;
    tokenUrl: string;
    redirectUri: string;
    scope: string[];
    state?: string;
}
/**
 * SAML provider configuration
 */
export interface SAMLProviderConfig {
    entryPoint: string;
    issuer: string;
    callbackUrl: string;
    cert: string;
    privateKey?: string;
    signatureAlgorithm?: string;
}
/**
 * MFA method types
 */
export declare enum MFAMethod {
    TOTP = "totp",
    SMS = "sms",
    EMAIL = "email",
    BACKUP_CODES = "backup_codes",
    WEBAUTHN = "webauthn"
}
/**
 * MFA configuration
 */
export interface MFAConfig {
    enabled: boolean;
    methods: MFAMethod[];
    gracePeriodDays?: number;
    rememberDeviceDays?: number;
    backupCodesCount?: number;
}
/**
 * TOTP secret
 */
export interface TOTPSecret {
    secret: string;
    qrCode: string;
    backupCodes: string[];
    algorithm?: string;
    digits?: number;
    period?: number;
}
/**
 * Token payload
 */
export interface TokenPayload {
    sub: string;
    email?: string;
    roles: string[];
    permissions: string[];
    tenantId?: string;
    organizationId?: string;
    sessionId?: string;
    deviceId?: string;
    iat?: number;
    exp?: number;
    metadata?: Record<string, any>;
}
/**
 * Token rotation configuration
 */
export interface TokenRotationConfig {
    accessTokenTTL: number;
    refreshTokenTTL: number;
    rotateRefreshToken: boolean;
    maxRefreshTokenAge: number;
    revokeOldTokens: boolean;
}
/**
 * Security context
 */
export interface SecurityContext {
    userId: string;
    sessionId: string;
    roles: string[];
    permissions: string[];
    tenantId?: string;
    organizationId?: string;
    ipAddress?: string;
    userAgent?: string;
    authenticatedAt: Date;
    metadata?: Record<string, any>;
}
/**
 * Role definition
 */
export interface RoleDefinition {
    roleId: string;
    name: string;
    description?: string;
    permissions: string[];
    inheritsFrom?: string[];
    priority?: number;
    metadata?: Record<string, any>;
}
/**
 * Role hierarchy
 */
export interface RoleHierarchy {
    roles: Map<string, RoleDefinition>;
    inheritanceGraph: Map<string, string[]>;
}
/**
 * Permission definition
 */
export interface PermissionDefinition {
    permissionId: string;
    resource: string;
    action: string;
    conditions?: PermissionCondition[];
    metadata?: Record<string, any>;
}
/**
 * Permission condition for ABAC
 */
export interface PermissionCondition {
    attribute: string;
    operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'contains';
    value: any;
}
/**
 * Permission evaluation context
 */
export interface PermissionEvaluationContext {
    userId: string;
    roles: string[];
    resource: string;
    action: string;
    attributes?: Record<string, any>;
    environment?: Record<string, any>;
}
/**
 * Security event types
 */
export declare enum SecurityEventType {
    LOGIN_SUCCESS = "login_success",
    LOGIN_FAILURE = "login_failure",
    LOGOUT = "logout",
    MFA_ENABLED = "mfa_enabled",
    MFA_DISABLED = "mfa_disabled",
    MFA_CHALLENGE = "mfa_challenge",
    TOKEN_REFRESH = "token_refresh",
    TOKEN_REVOKED = "token_revoked",
    PASSWORD_CHANGE = "password_change",
    PERMISSION_DENIED = "permission_denied",
    SUSPICIOUS_ACTIVITY = "suspicious_activity",
    ACCOUNT_LOCKED = "account_locked"
}
/**
 * Security event
 */
export interface SecurityEvent {
    eventId: string;
    eventType: SecurityEventType;
    userId?: string;
    tenantId?: string;
    ipAddress?: string;
    userAgent?: string;
    timestamp: Date;
    success: boolean;
    metadata?: Record<string, any>;
    severity: 'low' | 'medium' | 'high' | 'critical';
}
/**
 * Credential encryption options
 */
export interface CredentialEncryptionOptions {
    algorithm: string;
    keyDerivation: 'pbkdf2' | 'scrypt' | 'argon2';
    saltRounds?: number;
    keyLength?: number;
    iterations?: number;
}
/**
 * Encrypted credential
 */
export interface EncryptedCredential {
    encryptedData: string;
    iv: string;
    authTag: string;
    salt: string;
    algorithm: string;
    keyDerivation: string;
}
/**
 * Creates OAuth2 authentication URL with state parameter.
 *
 * @param {OAuth2ProviderConfig} config - OAuth2 provider configuration
 * @returns {string} Authorization URL
 *
 * @example
 * ```typescript
 * const authUrl = createOAuth2AuthUrl({
 *   clientId: 'client-123',
 *   authorizationUrl: 'https://oauth.provider.com/authorize',
 *   redirectUri: 'https://app.com/callback',
 *   scope: ['openid', 'profile', 'email'],
 *   state: generateSecureRandomString(32)
 * });
 * ```
 */
export declare function createOAuth2AuthUrl(config: OAuth2ProviderConfig): string;
/**
 * Exchanges OAuth2 authorization code for access token.
 *
 * @param {OAuth2ProviderConfig} config - OAuth2 provider configuration
 * @param {string} code - Authorization code
 * @returns {Promise<{ accessToken: string; refreshToken?: string; expiresIn: number }>} Token response
 *
 * @example
 * ```typescript
 * const tokens = await exchangeOAuth2Code(oauthConfig, authorizationCode);
 * console.log('Access token:', tokens.accessToken);
 * ```
 */
export declare function exchangeOAuth2Code(config: OAuth2ProviderConfig, code: string): Promise<{
    accessToken: string;
    refreshToken?: string;
    expiresIn: number;
}>;
/**
 * Validates SAML assertion and extracts user information.
 *
 * @param {string} samlResponse - Base64-encoded SAML response
 * @param {SAMLProviderConfig} config - SAML configuration
 * @returns {Promise<{ userId: string; email: string; attributes: Record<string, any> }>} User info
 *
 * @example
 * ```typescript
 * const userInfo = await validateSAMLAssertion(
 *   samlResponse,
 *   samlConfig
 * );
 * console.log('SAML user:', userInfo.email);
 * ```
 */
export declare function validateSAMLAssertion(samlResponse: string, config: SAMLProviderConfig): Promise<{
    userId: string;
    email: string;
    attributes: Record<string, any>;
}>;
/**
 * Authenticates user against LDAP directory.
 *
 * @param {string} username - LDAP username
 * @param {string} password - User password
 * @param {object} ldapConfig - LDAP configuration
 * @returns {Promise<AuthenticationResult>} Authentication result
 *
 * @example
 * ```typescript
 * const result = await authenticateLDAP(
 *   'jdoe',
 *   'password',
 *   {
 *     url: 'ldap://ldap.company.com',
 *     baseDN: 'dc=company,dc=com',
 *     searchFilter: '(uid={{username}})'
 *   }
 * );
 * ```
 */
export declare function authenticateLDAP(username: string, password: string, ldapConfig: {
    url: string;
    baseDN: string;
    searchFilter: string;
}): Promise<AuthenticationResult>;
/**
 * Creates a federated authentication provider mapper.
 *
 * @param {AuthProviderType} providerType - Provider type
 * @param {(externalId: string, profile: any) => Promise<string>} userMapper - Maps external user to internal user ID
 * @returns {(credentials: any) => Promise<AuthenticationResult>} Authentication function
 *
 * @example
 * ```typescript
 * const googleAuth = createFederatedAuthProvider(
 *   AuthProviderType.GOOGLE,
 *   async (googleId, profile) => {
 *     const user = await findOrCreateUser(googleId, profile);
 *     return user.id;
 *   }
 * );
 * ```
 */
export declare function createFederatedAuthProvider(providerType: AuthProviderType, userMapper: (externalId: string, profile: any) => Promise<string>): (credentials: any) => Promise<AuthenticationResult>;
/**
 * Implements single sign-on (SSO) token exchange.
 *
 * @param {string} ssoToken - SSO token from identity provider
 * @param {string} issuer - Token issuer identifier
 * @param {(token: string) => Promise<boolean>} validator - Token validation function
 * @returns {Promise<TokenPayload>} Decoded token payload
 *
 * @example
 * ```typescript
 * const payload = await exchangeSSOToken(
 *   ssoToken,
 *   'https://idp.company.com',
 *   async (token) => await validateWithIdP(token)
 * );
 * ```
 */
export declare function exchangeSSOToken(ssoToken: string, issuer: string, validator: (token: string) => Promise<boolean>): Promise<TokenPayload>;
/**
 * Generates TOTP secret with QR code for authenticator apps.
 *
 * @param {string} userId - User identifier
 * @param {string} appName - Application name for QR code
 * @param {object} options - TOTP options
 * @returns {Promise<TOTPSecret>} TOTP secret with QR code
 *
 * @example
 * ```typescript
 * const totpSecret = await generateTOTPSecret(
 *   'user-123',
 *   'White Cross Health',
 *   { algorithm: 'sha256', digits: 6, period: 30 }
 * );
 * // Display QR code to user
 * console.log(totpSecret.qrCode);
 * ```
 */
export declare function generateTOTPSecret(userId: string, appName: string, options?: {
    algorithm?: 'sha1' | 'sha256' | 'sha512';
    digits?: number;
    period?: number;
}): Promise<TOTPSecret>;
/**
 * Verifies TOTP code against secret.
 *
 * @param {string} token - TOTP token from user
 * @param {string} secret - User's TOTP secret
 * @param {object} options - Verification options
 * @returns {boolean} True if token is valid
 *
 * @example
 * ```typescript
 * const isValid = verifyTOTPToken(
 *   '123456',
 *   userTotpSecret,
 *   { window: 1 }
 * );
 * if (isValid) {
 *   console.log('MFA verification successful');
 * }
 * ```
 */
export declare function verifyTOTPToken(token: string, secret: string, options?: {
    window?: number;
    algorithm?: string;
}): boolean;
/**
 * Generates MFA backup codes for recovery.
 *
 * @param {number} count - Number of backup codes to generate
 * @returns {string[]} Array of backup codes
 *
 * @example
 * ```typescript
 * const backupCodes = generateMFABackupCodes(10);
 * // Store hashed versions in database
 * await saveBackupCodes(userId, backupCodes.map(hashBackupCode));
 * ```
 */
export declare function generateMFABackupCodes(count?: number): string[];
/**
 * Validates and consumes MFA backup code.
 *
 * @param {string} code - Backup code from user
 * @param {string[]} hashedCodes - Stored hashed backup codes
 * @param {(code: string) => Promise<void>} markAsUsed - Function to mark code as used
 * @returns {Promise<boolean>} True if code is valid and not used
 *
 * @example
 * ```typescript
 * const isValid = await validateMFABackupCode(
 *   userProvidedCode,
 *   storedHashedCodes,
 *   async (code) => await markBackupCodeUsed(userId, code)
 * );
 * ```
 */
export declare function validateMFABackupCode(code: string, hashedCodes: string[], markAsUsed: (code: string) => Promise<void>): Promise<boolean>;
/**
 * Creates MFA challenge for step-up authentication.
 *
 * @param {string} userId - User identifier
 * @param {MFAMethod} method - MFA method to use
 * @param {string} destination - Destination (phone/email) for code
 * @returns {Promise<{ challengeId: string; expiresAt: Date }>} Challenge details
 *
 * @example
 * ```typescript
 * const challenge = await createMFAChallenge(
 *   'user-123',
 *   MFAMethod.SMS,
 *   '+1234567890'
 * );
 * // Send SMS with code
 * await sendSMS(destination, challenge.code);
 * ```
 */
export declare function createMFAChallenge(userId: string, method: MFAMethod, destination?: string): Promise<{
    challengeId: string;
    code?: string;
    expiresAt: Date;
}>;
/**
 * Implements remember device functionality for MFA.
 *
 * @param {string} userId - User identifier
 * @param {string} deviceId - Device identifier
 * @param {number} durationDays - Number of days to remember device
 * @returns {string} Device token
 *
 * @example
 * ```typescript
 * const deviceToken = rememberMFADevice(
 *   'user-123',
 *   deviceFingerprint,
 *   30
 * );
 * // Store in cookie or local storage
 * res.cookie('device_token', deviceToken, { httpOnly: true });
 * ```
 */
export declare function rememberMFADevice(userId: string, deviceId: string, durationDays?: number): string;
/**
 * Generates access and refresh token pair.
 *
 * @param {TokenPayload} payload - Token payload
 * @param {TokenRotationConfig} config - Token rotation configuration
 * @param {string} secret - JWT secret
 * @returns {{ accessToken: string; refreshToken: string; expiresIn: number }} Token pair
 *
 * @example
 * ```typescript
 * const tokens = generateTokenPair(
 *   { sub: 'user-123', roles: ['doctor'], permissions: ['read:patients'] },
 *   { accessTokenTTL: 900, refreshTokenTTL: 604800 },
 *   process.env.JWT_SECRET
 * );
 * ```
 */
export declare function generateTokenPair(payload: TokenPayload, config: TokenRotationConfig, secret: string): {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
};
/**
 * Rotates refresh token and generates new token pair.
 *
 * @param {string} refreshToken - Current refresh token
 * @param {string} secret - JWT secret
 * @param {TokenRotationConfig} config - Rotation configuration
 * @param {(token: string) => Promise<boolean>} validateRefreshToken - Token validation function
 * @returns {Promise<{ accessToken: string; refreshToken: string; expiresIn: number }>} New token pair
 *
 * @example
 * ```typescript
 * const newTokens = await rotateRefreshToken(
 *   currentRefreshToken,
 *   jwtSecret,
 *   rotationConfig,
 *   async (token) => await checkTokenNotRevoked(token)
 * );
 * ```
 */
export declare function rotateRefreshToken(refreshToken: string, secret: string, config: TokenRotationConfig, validateRefreshToken: (token: string) => Promise<boolean>): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}>;
/**
 * Implements token revocation with blacklist.
 *
 * @param {string} token - Token to revoke
 * @param {(tokenId: string, expiresAt: Date) => Promise<void>} addToBlacklist - Blacklist storage function
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await revokeToken(
 *   userToken,
 *   async (tokenId, expiresAt) => {
 *     await redis.setex(`blacklist:${tokenId}`, ttl, '1');
 *   }
 * );
 * ```
 */
export declare function revokeToken(token: string, addToBlacklist: (tokenId: string, expiresAt: Date) => Promise<void>): Promise<void>;
/**
 * Validates token against blacklist.
 *
 * @param {string} token - Token to validate
 * @param {(tokenId: string) => Promise<boolean>} checkBlacklist - Blacklist check function
 * @returns {Promise<boolean>} True if token is valid (not blacklisted)
 *
 * @example
 * ```typescript
 * const isValid = await validateTokenNotRevoked(
 *   accessToken,
 *   async (tokenId) => {
 *     const exists = await redis.exists(`blacklist:${tokenId}`);
 *     return exists === 1;
 *   }
 * );
 * ```
 */
export declare function validateTokenNotRevoked(token: string, checkBlacklist: (tokenId: string) => Promise<boolean>): Promise<boolean>;
/**
 * Implements sliding session expiration.
 *
 * @param {string} token - Current access token
 * @param {number} slidingWindowSeconds - Time before expiry to issue new token
 * @param {string} secret - JWT secret
 * @param {TokenRotationConfig} config - Token configuration
 * @returns {{ shouldRotate: boolean; newToken?: string }} Rotation decision
 *
 * @example
 * ```typescript
 * const result = implementSlidingSession(
 *   accessToken,
 *   300, // Rotate if less than 5 minutes remaining
 *   jwtSecret,
 *   tokenConfig
 * );
 * if (result.shouldRotate) {
 *   res.setHeader('X-New-Token', result.newToken);
 * }
 * ```
 */
export declare function implementSlidingSession(token: string, slidingWindowSeconds: number, secret: string, config: TokenRotationConfig): {
    shouldRotate: boolean;
    newToken?: string;
};
/**
 * Creates token family for tracking refresh token lineage.
 *
 * @param {string} userId - User identifier
 * @param {string} sessionId - Session identifier
 * @returns {{ familyId: string; generation: number }} Token family metadata
 *
 * @example
 * ```typescript
 * const family = createTokenFamily('user-123', 'session-456');
 * // Include in token payload
 * const payload = { ...userPayload, familyId: family.familyId };
 * ```
 */
export declare function createTokenFamily(userId: string, sessionId: string): {
    familyId: string;
    generation: number;
};
/**
 * Creates security context from authentication token.
 *
 * @param {string} token - JWT access token
 * @param {string} ipAddress - Client IP address
 * @param {string} userAgent - Client user agent
 * @param {string} secret - JWT secret
 * @returns {Promise<SecurityContext>} Security context
 *
 * @example
 * ```typescript
 * const context = await createSecurityContext(
 *   accessToken,
 *   req.ip,
 *   req.headers['user-agent'],
 *   jwtSecret
 * );
 * ```
 */
export declare function createSecurityContext(token: string, ipAddress: string, userAgent: string, secret: string): Promise<SecurityContext>;
/**
 * Propagates security context across microservices.
 *
 * @param {SecurityContext} context - Security context to propagate
 * @returns {Record<string, string>} Headers for inter-service communication
 *
 * @example
 * ```typescript
 * const headers = propagateSecurityContext(securityContext);
 * const response = await httpService.get('/api/resource', { headers });
 * ```
 */
export declare function propagateSecurityContext(context: SecurityContext): Record<string, string>;
/**
 * Extracts security context from request headers.
 *
 * @param {Record<string, string | string[]>} headers - Request headers
 * @returns {SecurityContext | null} Extracted security context
 *
 * @example
 * ```typescript
 * const context = extractSecurityContextFromHeaders(req.headers);
 * if (context) {
 *   // Use propagated context
 *   await processWithContext(context);
 * }
 * ```
 */
export declare function extractSecurityContextFromHeaders(headers: Record<string, string | string[]>): SecurityContext | null;
/**
 * Creates a security context decorator for NestJS.
 *
 * @returns {ParameterDecorator} Security context parameter decorator
 *
 * @example
 * ```typescript
 * const SecurityContextParam = createSecurityContextDecorator();
 *
 * @Get('protected')
 * async getProtectedData(@SecurityContextParam() context: SecurityContext) {
 *   return this.service.getData(context.userId);
 * }
 * ```
 */
export declare function createSecurityContextDecorator(): any;
/**
 * Validates security context integrity.
 *
 * @param {SecurityContext} context - Security context to validate
 * @param {number} maxAgeMinutes - Maximum context age in minutes
 * @returns {boolean} True if context is valid
 *
 * @example
 * ```typescript
 * if (!validateSecurityContextIntegrity(context, 30)) {
 *   throw new UnauthorizedException('Security context expired');
 * }
 * ```
 */
export declare function validateSecurityContextIntegrity(context: SecurityContext, maxAgeMinutes?: number): boolean;
/**
 * Merges security contexts for multi-tenant scenarios.
 *
 * @param {SecurityContext[]} contexts - Array of security contexts
 * @returns {SecurityContext} Merged security context
 *
 * @example
 * ```typescript
 * const mergedContext = mergeSecurityContexts([
 *   userContext,
 *   tenantContext,
 *   orgContext
 * ]);
 * ```
 */
export declare function mergeSecurityContexts(contexts: SecurityContext[]): SecurityContext;
/**
 * Creates a role hierarchy from role definitions.
 *
 * @param {RoleDefinition[]} roles - Array of role definitions
 * @returns {RoleHierarchy} Role hierarchy with inheritance graph
 *
 * @example
 * ```typescript
 * const hierarchy = createRoleHierarchy([
 *   { roleId: 'admin', name: 'Admin', permissions: ['*'] },
 *   { roleId: 'doctor', name: 'Doctor', permissions: ['read:patients'], inheritsFrom: ['user'] },
 *   { roleId: 'user', name: 'User', permissions: ['read:own_profile'] }
 * ]);
 * ```
 */
export declare function createRoleHierarchy(roles: RoleDefinition[]): RoleHierarchy;
/**
 * Resolves all permissions for a role including inherited permissions.
 *
 * @param {string} roleId - Role identifier
 * @param {RoleHierarchy} hierarchy - Role hierarchy
 * @returns {string[]} All permissions (direct + inherited)
 *
 * @example
 * ```typescript
 * const allPermissions = resolveRolePermissions('doctor', roleHierarchy);
 * console.log('Doctor has permissions:', allPermissions);
 * ```
 */
export declare function resolveRolePermissions(roleId: string, hierarchy: RoleHierarchy): string[];
/**
 * Validates role hierarchy for circular dependencies.
 *
 * @param {RoleHierarchy} hierarchy - Role hierarchy to validate
 * @throws {BadRequestException} If circular dependency detected
 *
 * @example
 * ```typescript
 * const hierarchy = createRoleHierarchy(roles);
 * validateRoleHierarchy(hierarchy);
 * ```
 */
export declare function validateRoleHierarchy(hierarchy: RoleHierarchy): void;
/**
 * Calculates role priority based on hierarchy depth.
 *
 * @param {string} roleId - Role identifier
 * @param {RoleHierarchy} hierarchy - Role hierarchy
 * @returns {number} Role priority (higher = more privileged)
 *
 * @example
 * ```typescript
 * const adminPriority = calculateRolePriority('admin', hierarchy);
 * const userPriority = calculateRolePriority('user', hierarchy);
 * console.log(`Admin priority (${adminPriority}) > User priority (${userPriority})`);
 * ```
 */
export declare function calculateRolePriority(roleId: string, hierarchy: RoleHierarchy): number;
/**
 * Finds the highest priority role from a set of roles.
 *
 * @param {string[]} roleIds - Array of role identifiers
 * @param {RoleHierarchy} hierarchy - Role hierarchy
 * @returns {string} Highest priority role ID
 *
 * @example
 * ```typescript
 * const primaryRole = getHighestPriorityRole(
 *   ['user', 'doctor', 'admin'],
 *   roleHierarchy
 * );
 * console.log('Primary role:', primaryRole); // 'admin'
 * ```
 */
export declare function getHighestPriorityRole(roleIds: string[], hierarchy: RoleHierarchy): string;
/**
 * Determines if one role inherits from another.
 *
 * @param {string} roleId - Role to check
 * @param {string} ancestorRoleId - Potential ancestor role
 * @param {RoleHierarchy} hierarchy - Role hierarchy
 * @returns {boolean} True if roleId inherits from ancestorRoleId
 *
 * @example
 * ```typescript
 * const isDoctorInheritingUser = isRoleInheritingFrom(
 *   'doctor',
 *   'user',
 *   hierarchy
 * );
 * ```
 */
export declare function isRoleInheritingFrom(roleId: string, ancestorRoleId: string, hierarchy: RoleHierarchy): boolean;
/**
 * Evaluates permission condition using ABAC (Attribute-Based Access Control).
 *
 * @param {PermissionCondition} condition - Permission condition
 * @param {Record<string, any>} attributes - Attribute values
 * @returns {boolean} True if condition is satisfied
 *
 * @example
 * ```typescript
 * const canAccess = evaluatePermissionCondition(
 *   { attribute: 'department', operator: 'eq', value: 'cardiology' },
 *   { department: 'cardiology', role: 'doctor' }
 * );
 * ```
 */
export declare function evaluatePermissionCondition(condition: PermissionCondition, attributes: Record<string, any>): boolean;
/**
 * Evaluates if user has permission based on context.
 *
 * @param {PermissionEvaluationContext} context - Evaluation context
 * @param {PermissionDefinition[]} permissions - Available permissions
 * @param {RoleHierarchy} roleHierarchy - Role hierarchy
 * @returns {boolean} True if user has permission
 *
 * @example
 * ```typescript
 * const hasAccess = evaluatePermission(
 *   {
 *     userId: 'user-123',
 *     roles: ['doctor'],
 *     resource: 'patient',
 *     action: 'read',
 *     attributes: { department: 'cardiology' }
 *   },
 *   permissionDefinitions,
 *   roleHierarchy
 * );
 * ```
 */
export declare function evaluatePermission(context: PermissionEvaluationContext, permissions: PermissionDefinition[], roleHierarchy: RoleHierarchy): boolean;
/**
 * Creates a permission checker function for specific resource.
 *
 * @param {string} resource - Resource name
 * @param {PermissionDefinition[]} permissions - Permission definitions
 * @param {RoleHierarchy} roleHierarchy - Role hierarchy
 * @returns {(context: SecurityContext, action: string, attributes?: Record<string, any>) => boolean} Permission checker
 *
 * @example
 * ```typescript
 * const canAccessPatient = createPermissionChecker(
 *   'patient',
 *   permissionDefs,
 *   roleHierarchy
 * );
 *
 * if (canAccessPatient(securityContext, 'read', { patientId: '123' })) {
 *   // Allow access
 * }
 * ```
 */
export declare function createPermissionChecker(resource: string, permissions: PermissionDefinition[], roleHierarchy: RoleHierarchy): (context: SecurityContext, action: string, attributes?: Record<string, any>) => boolean;
/**
 * Implements resource-level permission filtering.
 *
 * @template T - Resource type
 * @param {T[]} resources - Array of resources
 * @param {SecurityContext} context - Security context
 * @param {(resource: T) => PermissionEvaluationContext} contextBuilder - Builds eval context for each resource
 * @param {PermissionDefinition[]} permissions - Permission definitions
 * @param {RoleHierarchy} roleHierarchy - Role hierarchy
 * @returns {T[]} Filtered resources user can access
 *
 * @example
 * ```typescript
 * const accessiblePatients = filterResourcesByPermission(
 *   allPatients,
 *   securityContext,
 *   (patient) => ({
 *     userId: securityContext.userId,
 *     roles: securityContext.roles,
 *     resource: 'patient',
 *     action: 'read',
 *     attributes: { department: patient.department }
 *   }),
 *   permissions,
 *   roleHierarchy
 * );
 * ```
 */
export declare function filterResourcesByPermission<T = any>(resources: T[], context: SecurityContext, contextBuilder: (resource: T) => PermissionEvaluationContext, permissions: PermissionDefinition[], roleHierarchy: RoleHierarchy): T[];
/**
 * Creates a NestJS permission guard decorator.
 *
 * @param {string} resource - Resource name
 * @param {string} action - Action name
 * @returns {MethodDecorator} Permission guard decorator
 *
 * @example
 * ```typescript
 * @Get('patients/:id')
 * @RequirePermission('patient', 'read')
 * async getPatient(@Param('id') id: string) {
 *   return this.patientsService.findOne(id);
 * }
 * ```
 */
export declare function RequirePermission(resource: string, action: string): MethodDecorator;
/**
 * Creates a security event for audit logging.
 *
 * @param {SecurityEventType} eventType - Type of security event
 * @param {Partial<SecurityEvent>} eventData - Event data
 * @returns {SecurityEvent} Complete security event
 *
 * @example
 * ```typescript
 * const event = createSecurityEvent(
 *   SecurityEventType.LOGIN_SUCCESS,
 *   {
 *     userId: 'user-123',
 *     ipAddress: req.ip,
 *     success: true,
 *     severity: 'low'
 *   }
 * );
 * await auditLogger.log(event);
 * ```
 */
export declare function createSecurityEvent(eventType: SecurityEventType, eventData: Partial<SecurityEvent>): SecurityEvent;
/**
 * Logs authentication event with comprehensive details.
 *
 * @param {boolean} success - Whether authentication succeeded
 * @param {string} userId - User identifier
 * @param {string} ipAddress - Client IP address
 * @param {Record<string, any>} metadata - Additional metadata
 * @param {(event: SecurityEvent) => Promise<void>} logger - Event logger function
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await logAuthenticationEvent(
 *   true,
 *   'user-123',
 *   req.ip,
 *   { provider: 'local', mfaUsed: true },
 *   async (event) => await auditService.log(event)
 * );
 * ```
 */
export declare function logAuthenticationEvent(success: boolean, userId: string, ipAddress: string, metadata: Record<string, any>, logger: (event: SecurityEvent) => Promise<void>): Promise<void>;
/**
 * Detects suspicious authentication patterns.
 *
 * @param {SecurityEvent[]} recentEvents - Recent security events for user
 * @param {object} thresholds - Detection thresholds
 * @returns {{ suspicious: boolean; reasons: string[] }} Detection result
 *
 * @example
 * ```typescript
 * const detection = detectSuspiciousActivity(
 *   userRecentEvents,
 *   { failedAttempts: 5, locationChanges: 3, timeWindow: 3600000 }
 * );
 * if (detection.suspicious) {
 *   await lockAccount(userId);
 *   await sendSecurityAlert(userId, detection.reasons);
 * }
 * ```
 */
export declare function detectSuspiciousActivity(recentEvents: SecurityEvent[], thresholds: {
    failedAttempts?: number;
    locationChanges?: number;
    timeWindow?: number;
}): {
    suspicious: boolean;
    reasons: string[];
};
/**
 * Generates security audit report for compliance.
 *
 * @param {SecurityEvent[]} events - Security events to report
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {string} Formatted audit report
 *
 * @example
 * ```typescript
 * const report = generateSecurityAuditReport(
 *   allSecurityEvents,
 *   new Date('2025-01-01'),
 *   new Date('2025-01-31')
 * );
 * await saveReport(report, 'january-2025-audit.txt');
 * ```
 */
export declare function generateSecurityAuditReport(events: SecurityEvent[], startDate: Date, endDate: Date): string;
/**
 * Creates HIPAA-compliant audit trail entry.
 *
 * @param {object} auditData - Audit trail data
 * @returns {object} HIPAA-compliant audit entry
 *
 * @example
 * ```typescript
 * const auditEntry = createHIPAAAuditTrail({
 *   userId: 'doctor-123',
 *   action: 'VIEW_PHI',
 *   resourceType: 'patient',
 *   resourceId: 'patient-456',
 *   phi: true,
 *   justification: 'Patient treatment'
 * });
 * await hipaaAuditLog.save(auditEntry);
 * ```
 */
export declare function createHIPAAAuditTrail(auditData: {
    userId: string;
    action: string;
    resourceType: string;
    resourceId: string;
    phi: boolean;
    justification?: string;
    ipAddress?: string;
}): {
    auditId: string;
    timestamp: string;
    userId: string;
    action: string;
    resourceType: string;
    resourceId: string;
    phiAccessed: boolean;
    justification?: string;
    ipAddress?: string;
    compliance: string;
};
/**
 * Encrypts sensitive credentials using AES-256-GCM.
 *
 * @param {string} plaintext - Plaintext credential
 * @param {string} masterKey - Master encryption key
 * @returns {EncryptedCredential} Encrypted credential with metadata
 *
 * @example
 * ```typescript
 * const encrypted = encryptCredential(
 *   apiKey,
 *   process.env.MASTER_KEY
 * );
 * await credentialVault.save(encrypted);
 * ```
 */
export declare function encryptCredential(plaintext: string, masterKey: string): EncryptedCredential;
/**
 * Decrypts encrypted credentials.
 *
 * @param {EncryptedCredential} encrypted - Encrypted credential
 * @param {string} masterKey - Master encryption key
 * @returns {string} Decrypted plaintext
 * @throws {Error} If decryption fails
 *
 * @example
 * ```typescript
 * const apiKey = decryptCredential(
 *   encryptedCredential,
 *   process.env.MASTER_KEY
 * );
 * ```
 */
export declare function decryptCredential(encrypted: EncryptedCredential, masterKey: string): string;
/**
 * Hashes password using bcrypt with configurable rounds.
 *
 * @param {string} password - Plain text password
 * @param {number} saltRounds - Number of salt rounds (default: 12)
 * @returns {Promise<string>} Hashed password
 *
 * @example
 * ```typescript
 * const hashed = await hashPassword(userPassword, 12);
 * await saveUser({ ...userData, password: hashed });
 * ```
 */
export declare function hashPassword(password: string, saltRounds?: number): Promise<string>;
/**
 * Verifies password against hash.
 *
 * @param {string} password - Plain text password
 * @param {string} hash - Stored password hash
 * @returns {Promise<boolean>} True if password matches
 *
 * @example
 * ```typescript
 * const isValid = await verifyPassword(
 *   loginPassword,
 *   user.passwordHash
 * );
 * if (!isValid) {
 *   throw new UnauthorizedException('Invalid credentials');
 * }
 * ```
 */
export declare function verifyPassword(password: string, hash: string): Promise<boolean>;
/**
 * Generates cryptographically secure random string.
 *
 * @param {number} length - Length of random string
 * @param {string} encoding - Encoding format
 * @returns {string} Random string
 *
 * @example
 * ```typescript
 * const apiKey = generateSecureRandomString(32, 'base64');
 * const token = generateSecureRandomString(48, 'hex');
 * ```
 */
export declare function generateSecureRandomString(length?: number, encoding?: 'hex' | 'base64'): string;
/**
 * Creates a secure credential vault interface.
 *
 * @param {string} masterKey - Master encryption key
 * @returns {object} Credential vault with store/retrieve methods
 *
 * @example
 * ```typescript
 * const vault = createCredentialVault(process.env.MASTER_KEY);
 * await vault.store('api_key', apiKey);
 * const retrieved = await vault.retrieve('api_key');
 * ```
 */
export declare function createCredentialVault(masterKey: string): {
    store: (key: string, value: string) => EncryptedCredential;
    retrieve: (key: string, encrypted: EncryptedCredential) => string;
};
/**
 * Implements password strength validation.
 *
 * @param {string} password - Password to validate
 * @param {object} requirements - Password requirements
 * @returns {{ valid: boolean; errors: string[]; score: number }} Validation result
 *
 * @example
 * ```typescript
 * const result = validatePasswordStrength(newPassword, {
 *   minLength: 12,
 *   requireUppercase: true,
 *   requireNumbers: true,
 *   requireSpecialChars: true
 * });
 * if (!result.valid) {
 *   throw new BadRequestException(result.errors);
 * }
 * ```
 */
export declare function validatePasswordStrength(password: string, requirements: {
    minLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumbers?: boolean;
    requireSpecialChars?: boolean;
}): {
    valid: boolean;
    errors: string[];
    score: number;
};
declare const _default: {
    createOAuth2AuthUrl: typeof createOAuth2AuthUrl;
    exchangeOAuth2Code: typeof exchangeOAuth2Code;
    validateSAMLAssertion: typeof validateSAMLAssertion;
    authenticateLDAP: typeof authenticateLDAP;
    createFederatedAuthProvider: typeof createFederatedAuthProvider;
    exchangeSSOToken: typeof exchangeSSOToken;
    generateTOTPSecret: typeof generateTOTPSecret;
    verifyTOTPToken: typeof verifyTOTPToken;
    generateMFABackupCodes: typeof generateMFABackupCodes;
    validateMFABackupCode: typeof validateMFABackupCode;
    createMFAChallenge: typeof createMFAChallenge;
    rememberMFADevice: typeof rememberMFADevice;
    generateTokenPair: typeof generateTokenPair;
    rotateRefreshToken: typeof rotateRefreshToken;
    revokeToken: typeof revokeToken;
    validateTokenNotRevoked: typeof validateTokenNotRevoked;
    implementSlidingSession: typeof implementSlidingSession;
    createTokenFamily: typeof createTokenFamily;
    createSecurityContext: typeof createSecurityContext;
    propagateSecurityContext: typeof propagateSecurityContext;
    extractSecurityContextFromHeaders: typeof extractSecurityContextFromHeaders;
    createSecurityContextDecorator: typeof createSecurityContextDecorator;
    validateSecurityContextIntegrity: typeof validateSecurityContextIntegrity;
    mergeSecurityContexts: typeof mergeSecurityContexts;
    createRoleHierarchy: typeof createRoleHierarchy;
    resolveRolePermissions: typeof resolveRolePermissions;
    validateRoleHierarchy: typeof validateRoleHierarchy;
    calculateRolePriority: typeof calculateRolePriority;
    getHighestPriorityRole: typeof getHighestPriorityRole;
    isRoleInheritingFrom: typeof isRoleInheritingFrom;
    evaluatePermissionCondition: typeof evaluatePermissionCondition;
    evaluatePermission: typeof evaluatePermission;
    createPermissionChecker: typeof createPermissionChecker;
    filterResourcesByPermission: typeof filterResourcesByPermission;
    RequirePermission: typeof RequirePermission;
    createSecurityEvent: typeof createSecurityEvent;
    logAuthenticationEvent: typeof logAuthenticationEvent;
    detectSuspiciousActivity: typeof detectSuspiciousActivity;
    generateSecurityAuditReport: typeof generateSecurityAuditReport;
    createHIPAAAuditTrail: typeof createHIPAAAuditTrail;
    encryptCredential: typeof encryptCredential;
    decryptCredential: typeof decryptCredential;
    hashPassword: typeof hashPassword;
    verifyPassword: typeof verifyPassword;
    generateSecureRandomString: typeof generateSecureRandomString;
    createCredentialVault: typeof createCredentialVault;
    validatePasswordStrength: typeof validatePasswordStrength;
};
export default _default;
//# sourceMappingURL=nestjs-oracle-security-advanced-kit.d.ts.map