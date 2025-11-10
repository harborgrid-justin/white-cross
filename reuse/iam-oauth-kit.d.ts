/**
 * LOC: IAM-OAUTH-001
 * File: /reuse/iam-oauth-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - OAuth services
 *   - Authorization controllers
 *   - API gateway middleware
 *   - Token management services
 */
interface AuthorizationCodeRequest {
    responseType: 'code';
    clientId: string;
    redirectUri: string;
    scope?: string[];
    state?: string;
    codeChallenge?: string;
    codeChallengeMethod?: 'S256' | 'plain';
}
interface AuthorizationCodeResponse {
    code: string;
    state?: string;
    expiresAt: Date;
}
interface TokenRequest {
    grantType: string;
    code?: string;
    redirectUri?: string;
    clientId: string;
    clientSecret?: string;
    refreshToken?: string;
    username?: string;
    password?: string;
    scope?: string[];
    codeVerifier?: string;
}
interface TokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token?: string;
    scope?: string;
    id_token?: string;
}
interface AccessToken {
    token: string;
    clientId: string;
    userId?: string;
    scope: string[];
    expiresAt: Date;
    tokenType: 'Bearer';
}
interface RefreshToken {
    token: string;
    clientId: string;
    userId: string;
    scope: string[];
    expiresAt: Date;
}
interface OAuth2Client {
    clientId: string;
    clientSecret: string;
    clientName: string;
    redirectUris: string[];
    grantTypes: string[];
    responseTypes: string[];
    scope: string[];
    tokenEndpointAuthMethod: 'client_secret_basic' | 'client_secret_post' | 'none';
    createdAt: Date;
}
interface ClientCredentials {
    clientId: string;
    clientSecret: string;
}
interface PKCEChallenge {
    codeVerifier: string;
    codeChallenge: string;
    codeChallengeMethod: 'S256' | 'plain';
}
interface TokenIntrospectionRequest {
    token: string;
    tokenTypeHint?: 'access_token' | 'refresh_token';
    clientId?: string;
    clientSecret?: string;
}
interface TokenIntrospectionResponse {
    active: boolean;
    scope?: string;
    client_id?: string;
    username?: string;
    token_type?: string;
    exp?: number;
    iat?: number;
    sub?: string;
    aud?: string;
    iss?: string;
}
interface TokenRevocationRequest {
    token: string;
    tokenTypeHint?: 'access_token' | 'refresh_token';
    clientId: string;
    clientSecret?: string;
}
interface ImplicitFlowRequest {
    responseType: 'token' | 'id_token' | 'token id_token';
    clientId: string;
    redirectUri: string;
    scope?: string[];
    state?: string;
    nonce?: string;
}
interface OAuth2Error {
    error: string;
    error_description?: string;
    error_uri?: string;
    state?: string;
}
/**
 * Generates an authorization URL for OAuth 2.0 authorization code flow.
 *
 * @param {string} authorizationEndpoint - Authorization server endpoint
 * @param {AuthorizationCodeRequest} request - Authorization request parameters
 * @returns {string} Authorization URL
 *
 * @example
 * ```typescript
 * const authUrl = generateAuthorizationUrl(
 *   'https://auth.example.com/authorize',
 *   {
 *     responseType: 'code',
 *     clientId: 'client123',
 *     redirectUri: 'https://app.example.com/callback',
 *     scope: ['read', 'write'],
 *     state: 'xyz'
 *   }
 * );
 * ```
 */
export declare const generateAuthorizationUrl: (authorizationEndpoint: string, request: AuthorizationCodeRequest) => string;
/**
 * Generates an authorization code for the authorization code flow.
 *
 * @param {string} clientId - OAuth client ID
 * @param {string} userId - User identifier
 * @param {string[]} scope - Granted scopes
 * @param {string} redirectUri - Redirect URI
 * @param {number} [expiresIn] - Code expiration in seconds (default: 600)
 * @returns {AuthorizationCodeResponse} Authorization code response
 *
 * @example
 * ```typescript
 * const codeResponse = generateAuthorizationCode(
 *   'client123',
 *   'user456',
 *   ['read', 'write'],
 *   'https://app.example.com/callback'
 * );
 * ```
 */
export declare const generateAuthorizationCode: (clientId: string, userId: string, scope: string[], redirectUri: string, expiresIn?: number) => AuthorizationCodeResponse;
/**
 * Validates an authorization code and extracts its data.
 *
 * @param {string} code - Authorization code to validate
 * @param {string} clientId - Expected client ID
 * @param {string} redirectUri - Expected redirect URI
 * @param {Date} expiresAt - Code expiration timestamp
 * @returns {boolean} True if code is valid
 *
 * @example
 * ```typescript
 * const isValid = validateAuthorizationCode(
 *   'code123',
 *   'client123',
 *   'https://app.example.com/callback',
 *   new Date(Date.now() + 300000)
 * );
 * ```
 */
export declare const validateAuthorizationCode: (code: string, clientId: string, redirectUri: string, expiresAt: Date) => boolean;
/**
 * Exchanges authorization code for access token.
 *
 * @param {TokenRequest} request - Token request parameters
 * @returns {TokenResponse} Access token response
 *
 * @example
 * ```typescript
 * const tokenResponse = await exchangeCodeForToken({
 *   grantType: 'authorization_code',
 *   code: 'auth_code',
 *   redirectUri: 'https://app.example.com/callback',
 *   clientId: 'client123',
 *   clientSecret: 'secret'
 * });
 * ```
 */
export declare const exchangeCodeForToken: (request: TokenRequest) => TokenResponse;
/**
 * Generates a secure state parameter for CSRF protection.
 *
 * @returns {string} Random state parameter
 *
 * @example
 * ```typescript
 * const state = generateStateParameter();
 * // Store state in session before redirecting to authorization endpoint
 * ```
 */
export declare const generateStateParameter: () => string;
/**
 * Authenticates client using client credentials grant type.
 *
 * @param {string} clientId - OAuth client ID
 * @param {string} clientSecret - OAuth client secret
 * @param {string[]} [scope] - Requested scopes
 * @returns {TokenResponse} Access token response
 *
 * @example
 * ```typescript
 * const token = authenticateClientCredentials(
 *   'client123',
 *   'secret456',
 *   ['api:read', 'api:write']
 * );
 * ```
 */
export declare const authenticateClientCredentials: (clientId: string, clientSecret: string, scope?: string[]) => TokenResponse;
/**
 * Verifies client credentials (client ID and secret).
 *
 * @param {string} clientId - Client ID to verify
 * @param {string} clientSecret - Client secret to verify
 * @returns {boolean} True if credentials are valid
 *
 * @example
 * ```typescript
 * if (verifyClientCredentials('client123', 'secret456')) {
 *   // Credentials valid, proceed
 * }
 * ```
 */
export declare const verifyClientCredentials: (clientId: string, clientSecret: string) => boolean;
/**
 * Generates client credentials for a new OAuth client.
 *
 * @param {number} [secretLength] - Length of client secret (default: 64)
 * @returns {ClientCredentials} Client ID and secret
 *
 * @example
 * ```typescript
 * const credentials = generateClientCredentials();
 * // Result: { clientId: 'client_xyz', clientSecret: 'secret_abc...' }
 * ```
 */
export declare const generateClientCredentials: (secretLength?: number) => ClientCredentials;
/**
 * Hashes client secret for secure storage.
 *
 * @param {string} clientSecret - Plain text client secret
 * @returns {string} Hashed client secret
 *
 * @example
 * ```typescript
 * const hashedSecret = hashClientSecret('secret_abc123');
 * // Store hashed version in database
 * ```
 */
export declare const hashClientSecret: (clientSecret: string) => string;
/**
 * Generates authorization URL for implicit flow (direct token issuance).
 *
 * @param {string} authorizationEndpoint - Authorization server endpoint
 * @param {ImplicitFlowRequest} request - Implicit flow request parameters
 * @returns {string} Authorization URL
 *
 * @example
 * ```typescript
 * const authUrl = generateImplicitFlowUrl(
 *   'https://auth.example.com/authorize',
 *   {
 *     responseType: 'token',
 *     clientId: 'client123',
 *     redirectUri: 'https://app.example.com/callback',
 *     scope: ['read'],
 *     state: 'xyz'
 *   }
 * );
 * ```
 */
export declare const generateImplicitFlowUrl: (authorizationEndpoint: string, request: ImplicitFlowRequest) => string;
/**
 * Generates redirect URL with access token fragment (implicit flow).
 *
 * @param {string} redirectUri - Client redirect URI
 * @param {string} accessToken - Access token
 * @param {number} expiresIn - Token expiration in seconds
 * @param {string} [state] - State parameter
 * @param {string} [scope] - Granted scopes
 * @returns {string} Redirect URL with token in fragment
 *
 * @example
 * ```typescript
 * const redirectUrl = generateImplicitFlowRedirect(
 *   'https://app.example.com/callback',
 *   'access_token_123',
 *   3600,
 *   'xyz',
 *   'read write'
 * );
 * ```
 */
export declare const generateImplicitFlowRedirect: (redirectUri: string, accessToken: string, expiresIn: number, state?: string, scope?: string) => string;
/**
 * Parses access token from implicit flow redirect fragment.
 *
 * @param {string} fragmentString - URL fragment string
 * @returns {TokenResponse | null} Parsed token response or null
 *
 * @example
 * ```typescript
 * const token = parseImplicitFlowFragment(
 *   'access_token=xyz&token_type=Bearer&expires_in=3600'
 * );
 * ```
 */
export declare const parseImplicitFlowFragment: (fragmentString: string) => TokenResponse | null;
/**
 * Generates a refresh token for long-term access.
 *
 * @param {string} clientId - OAuth client ID
 * @param {string} [userId] - User identifier
 * @param {number} [expiresIn] - Token expiration in seconds (default: 30 days)
 * @returns {RefreshToken} Refresh token object
 *
 * @example
 * ```typescript
 * const refreshToken = generateRefreshToken('client123', 'user456');
 * ```
 */
export declare const generateRefreshToken: (clientId: string, userId?: string, expiresIn?: number) => RefreshToken;
/**
 * Exchanges refresh token for new access token.
 *
 * @param {string} refreshToken - Refresh token
 * @param {string} clientId - OAuth client ID
 * @param {string[]} [scope] - Requested scopes (must be subset of original)
 * @returns {TokenResponse} New access token response
 *
 * @example
 * ```typescript
 * const newToken = refreshAccessToken(
 *   'refresh_xyz',
 *   'client123',
 *   ['read']
 * );
 * ```
 */
export declare const refreshAccessToken: (refreshToken: string, clientId: string, scope?: string[]) => TokenResponse;
/**
 * Validates refresh token and checks expiration.
 *
 * @param {string} token - Refresh token to validate
 * @param {Date} expiresAt - Token expiration timestamp
 * @returns {boolean} True if token is valid
 *
 * @example
 * ```typescript
 * const isValid = validateRefreshToken(
 *   'refresh_xyz',
 *   new Date(Date.now() + 86400000)
 * );
 * ```
 */
export declare const validateRefreshToken: (token: string, expiresAt: Date) => boolean;
/**
 * Rotates refresh token (invalidates old, issues new).
 *
 * @param {string} oldRefreshToken - Current refresh token
 * @param {string} clientId - OAuth client ID
 * @param {string} userId - User identifier
 * @returns {RefreshToken} New refresh token
 *
 * @example
 * ```typescript
 * const newRefreshToken = rotateRefreshToken(
 *   'refresh_old',
 *   'client123',
 *   'user456'
 * );
 * ```
 */
export declare const rotateRefreshToken: (oldRefreshToken: string, clientId: string, userId: string) => RefreshToken;
/**
 * Generates an access token with specified scopes.
 *
 * @param {string} clientId - OAuth client ID
 * @param {string[]} scope - Token scopes
 * @param {string} [userId] - User identifier
 * @param {number} [expiresIn] - Token expiration in seconds (default: 3600)
 * @returns {AccessToken} Access token object
 *
 * @example
 * ```typescript
 * const token = generateAccessToken('client123', ['read', 'write'], 'user456');
 * ```
 */
export declare const generateAccessToken: (clientId: string, scope: string[], userId?: string, expiresIn?: number) => AccessToken;
/**
 * Validates access token format and expiration.
 *
 * @param {string} token - Access token to validate
 * @param {Date} expiresAt - Token expiration timestamp
 * @returns {boolean} True if token is valid
 *
 * @example
 * ```typescript
 * const isValid = validateAccessToken(
 *   'access_xyz',
 *   new Date(Date.now() + 3600000)
 * );
 * ```
 */
export declare const validateAccessToken: (token: string, expiresAt: Date) => boolean;
/**
 * Extracts Bearer token from Authorization header.
 *
 * @param {string} authHeader - Authorization header value
 * @returns {string | null} Extracted token or null
 *
 * @example
 * ```typescript
 * const token = extractBearerToken('Bearer access_xyz123');
 * // Result: 'access_xyz123'
 * ```
 */
export declare const extractBearerToken: (authHeader: string) => string | null;
/**
 * Creates Authorization header with Bearer token.
 *
 * @param {string} accessToken - Access token
 * @returns {string} Authorization header value
 *
 * @example
 * ```typescript
 * const header = createAuthorizationHeader('access_xyz123');
 * // Result: 'Bearer access_xyz123'
 * ```
 */
export declare const createAuthorizationHeader: (accessToken: string) => string;
/**
 * Validates that requested scopes are allowed for client.
 *
 * @param {string[]} requestedScopes - Scopes requested by client
 * @param {string[]} allowedScopes - Scopes allowed for client
 * @returns {boolean} True if all requested scopes are allowed
 *
 * @example
 * ```typescript
 * const isValid = validateScopes(
 *   ['read', 'write'],
 *   ['read', 'write', 'delete']
 * );
 * ```
 */
export declare const validateScopes: (requestedScopes: string[], allowedScopes: string[]) => boolean;
/**
 * Filters requested scopes to only include allowed scopes.
 *
 * @param {string[]} requestedScopes - Scopes requested by client
 * @param {string[]} allowedScopes - Scopes allowed for client
 * @returns {string[]} Filtered scopes
 *
 * @example
 * ```typescript
 * const granted = filterScopes(['read', 'write', 'admin'], ['read', 'write']);
 * // Result: ['read', 'write']
 * ```
 */
export declare const filterScopes: (requestedScopes: string[], allowedScopes: string[]) => string[];
/**
 * Parses scope string into array of individual scopes.
 *
 * @param {string} scopeString - Space-separated scope string
 * @returns {string[]} Array of scopes
 *
 * @example
 * ```typescript
 * const scopes = parseScopeString('read write admin');
 * // Result: ['read', 'write', 'admin']
 * ```
 */
export declare const parseScopeString: (scopeString: string) => string[];
/**
 * Formats scope array into space-separated string.
 *
 * @param {string[]} scopes - Array of scopes
 * @returns {string} Space-separated scope string
 *
 * @example
 * ```typescript
 * const scopeString = formatScopeString(['read', 'write', 'admin']);
 * // Result: 'read write admin'
 * ```
 */
export declare const formatScopeString: (scopes: string[]) => string;
/**
 * Checks if token has required scope.
 *
 * @param {string[]} tokenScopes - Scopes granted to token
 * @param {string} requiredScope - Required scope
 * @returns {boolean} True if token has required scope
 *
 * @example
 * ```typescript
 * const hasScope = checkTokenScope(['read', 'write'], 'read');
 * // Result: true
 * ```
 */
export declare const checkTokenScope: (tokenScopes: string[], requiredScope: string) => boolean;
/**
 * Registers a new OAuth 2.0 client.
 *
 * @param {string} clientName - Human-readable client name
 * @param {string[]} redirectUris - Allowed redirect URIs
 * @param {string[]} grantTypes - Allowed grant types
 * @param {string[]} scope - Allowed scopes
 * @returns {OAuth2Client} Registered client details
 *
 * @example
 * ```typescript
 * const client = registerOAuthClient(
 *   'My App',
 *   ['https://app.example.com/callback'],
 *   ['authorization_code', 'refresh_token'],
 *   ['read', 'write']
 * );
 * ```
 */
export declare const registerOAuthClient: (clientName: string, redirectUris: string[], grantTypes: string[], scope: string[]) => OAuth2Client;
/**
 * Validates redirect URI against registered URIs.
 *
 * @param {string} redirectUri - Redirect URI to validate
 * @param {string[]} registeredUris - Registered redirect URIs
 * @returns {boolean} True if redirect URI is registered
 *
 * @example
 * ```typescript
 * const isValid = validateRedirectUri(
 *   'https://app.example.com/callback',
 *   ['https://app.example.com/callback', 'https://app.example.com/oauth']
 * );
 * ```
 */
export declare const validateRedirectUri: (redirectUri: string, registeredUris: string[]) => boolean;
/**
 * Validates grant type is allowed for client.
 *
 * @param {string} grantType - Grant type to validate
 * @param {string[]} allowedGrantTypes - Allowed grant types for client
 * @returns {boolean} True if grant type is allowed
 *
 * @example
 * ```typescript
 * const isAllowed = validateGrantType(
 *   'authorization_code',
 *   ['authorization_code', 'refresh_token']
 * );
 * ```
 */
export declare const validateGrantType: (grantType: string, allowedGrantTypes: string[]) => boolean;
/**
 * Updates OAuth client configuration.
 *
 * @param {OAuth2Client} client - Existing client
 * @param {Partial<OAuth2Client>} updates - Updates to apply
 * @returns {OAuth2Client} Updated client
 *
 * @example
 * ```typescript
 * const updated = updateOAuthClient(existingClient, {
 *   redirectUris: [...existingClient.redirectUris, 'https://new.example.com/callback']
 * });
 * ```
 */
export declare const updateOAuthClient: (client: OAuth2Client, updates: Partial<OAuth2Client>) => OAuth2Client;
/**
 * Introspects token to check validity and retrieve metadata.
 *
 * @param {string} token - Token to introspect
 * @param {string} clientId - Client ID making introspection request
 * @returns {TokenIntrospectionResponse} Introspection response
 *
 * @example
 * ```typescript
 * const info = introspectToken('access_xyz', 'client123');
 * // Result: { active: true, scope: 'read write', client_id: 'client123', ... }
 * ```
 */
export declare const introspectToken: (token: string, clientId: string) => TokenIntrospectionResponse;
/**
 * Validates token introspection request authorization.
 *
 * @param {TokenIntrospectionRequest} request - Introspection request
 * @returns {boolean} True if request is authorized
 *
 * @example
 * ```typescript
 * const isAuthorized = validateIntrospectionRequest({
 *   token: 'access_xyz',
 *   clientId: 'client123',
 *   clientSecret: 'secret'
 * });
 * ```
 */
export declare const validateIntrospectionRequest: (request: TokenIntrospectionRequest) => boolean;
/**
 * Revokes an access or refresh token.
 *
 * @param {string} token - Token to revoke
 * @param {string} clientId - Client ID making revocation request
 * @returns {boolean} True if revocation successful
 *
 * @example
 * ```typescript
 * const revoked = revokeToken('access_xyz', 'client123');
 * ```
 */
export declare const revokeToken: (token: string, clientId: string) => boolean;
/**
 * Validates token revocation request.
 *
 * @param {TokenRevocationRequest} request - Revocation request
 * @returns {boolean} True if request is valid
 *
 * @example
 * ```typescript
 * const isValid = validateRevocationRequest({
 *   token: 'access_xyz',
 *   clientId: 'client123',
 *   clientSecret: 'secret'
 * });
 * ```
 */
export declare const validateRevocationRequest: (request: TokenRevocationRequest) => boolean;
/**
 * Revokes all tokens for a specific user.
 *
 * @param {string} userId - User identifier
 * @param {string} clientId - Optional client ID to limit revocation
 * @returns {number} Number of tokens revoked
 *
 * @example
 * ```typescript
 * const count = revokeUserTokens('user456', 'client123');
 * // Result: 5 (tokens revoked)
 * ```
 */
export declare const revokeUserTokens: (userId: string, clientId?: string) => number;
/**
 * Generates PKCE code verifier and challenge.
 *
 * @param {string} [method] - Challenge method ('S256' or 'plain')
 * @returns {PKCEChallenge} Code verifier and challenge
 *
 * @example
 * ```typescript
 * const pkce = generatePKCEChallenge('S256');
 * // Result: { codeVerifier: '...', codeChallenge: '...', codeChallengeMethod: 'S256' }
 * ```
 */
export declare const generatePKCEChallenge: (method?: "S256" | "plain") => PKCEChallenge;
/**
 * Verifies PKCE code verifier against challenge.
 *
 * @param {string} codeVerifier - Code verifier from client
 * @param {string} codeChallenge - Code challenge from authorization request
 * @param {string} [method] - Challenge method ('S256' or 'plain')
 * @returns {boolean} True if verifier matches challenge
 *
 * @example
 * ```typescript
 * const isValid = verifyPKCEChallenge(
 *   'verifier_xyz',
 *   'challenge_abc',
 *   'S256'
 * );
 * ```
 */
export declare const verifyPKCEChallenge: (codeVerifier: string, codeChallenge: string, method?: "S256" | "plain") => boolean;
/**
 * Validates PKCE parameters in authorization request.
 *
 * @param {string} codeChallenge - Code challenge
 * @param {string} codeChallengeMethod - Challenge method
 * @returns {boolean} True if PKCE parameters are valid
 *
 * @example
 * ```typescript
 * const isValid = validatePKCEParams('challenge_abc', 'S256');
 * ```
 */
export declare const validatePKCEParams: (codeChallenge: string, codeChallengeMethod: string) => boolean;
/**
 * Creates OAuth 2.0 error response.
 *
 * @param {string} error - Error code
 * @param {string} [description] - Error description
 * @param {string} [uri] - Error documentation URI
 * @returns {OAuth2Error} OAuth error object
 *
 * @example
 * ```typescript
 * const error = createOAuthError(
 *   'invalid_request',
 *   'Missing required parameter: redirect_uri'
 * );
 * ```
 */
export declare const createOAuthError: (error: string, description?: string, uri?: string) => OAuth2Error;
/**
 * Formats OAuth error for redirect (URL fragment or query).
 *
 * @param {OAuth2Error} error - OAuth error object
 * @param {string} redirectUri - Client redirect URI
 * @param {boolean} [useFragment] - Use fragment instead of query (default: false)
 * @returns {string} Error redirect URL
 *
 * @example
 * ```typescript
 * const errorUrl = formatOAuthErrorRedirect(
 *   { error: 'access_denied', error_description: 'User denied access' },
 *   'https://app.example.com/callback'
 * );
 * ```
 */
export declare const formatOAuthErrorRedirect: (error: OAuth2Error, redirectUri: string, useFragment?: boolean) => string;
/**
 * Validates OAuth error code against standard error codes.
 *
 * @param {string} errorCode - Error code to validate
 * @returns {boolean} True if error code is valid
 *
 * @example
 * ```typescript
 * const isValid = isValidOAuthError('invalid_grant');
 * // Result: true
 * ```
 */
export declare const isValidOAuthError: (errorCode: string) => boolean;
/**
 * Generates secure random string for tokens and secrets.
 *
 * @param {number} [length] - Length in bytes (default: 32)
 * @returns {string} Random string
 *
 * @example
 * ```typescript
 * const randomStr = generateSecureRandom(64);
 * ```
 */
export declare const generateSecureRandom: (length?: number) => string;
/**
 * Calculates token expiration timestamp.
 *
 * @param {number} expiresIn - Expiration time in seconds
 * @returns {Date} Expiration date
 *
 * @example
 * ```typescript
 * const expiresAt = calculateTokenExpiration(3600);
 * ```
 */
export declare const calculateTokenExpiration: (expiresIn: number) => Date;
/**
 * Checks if token is expired.
 *
 * @param {Date} expiresAt - Token expiration timestamp
 * @returns {boolean} True if token is expired
 *
 * @example
 * ```typescript
 * const expired = isTokenExpired(new Date('2025-01-01'));
 * ```
 */
export declare const isTokenExpired: (expiresAt: Date) => boolean;
export {};
//# sourceMappingURL=iam-oauth-kit.d.ts.map