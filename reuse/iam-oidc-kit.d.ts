/**
 * LOC: IAM-OIDC-001
 * File: /reuse/iam-oidc-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - OIDC services
 *   - Authentication controllers
 *   - Identity provider middleware
 *   - SSO services
 */
interface OIDCConfig {
    issuer: string;
    clientId: string;
    clientSecret?: string;
    redirectUri: string;
    scope?: string[];
    responseType?: 'code' | 'id_token' | 'id_token token' | 'code id_token' | 'code token' | 'code id_token token';
    responseMode?: 'query' | 'fragment' | 'form_post';
    nonce?: string;
    state?: string;
    display?: 'page' | 'popup' | 'touch' | 'wap';
    prompt?: 'none' | 'login' | 'consent' | 'select_account';
    maxAge?: number;
}
interface IDToken {
    iss: string;
    sub: string;
    aud: string | string[];
    exp: number;
    iat: number;
    auth_time?: number;
    nonce?: string;
    acr?: string;
    amr?: string[];
    azp?: string;
    [key: string]: any;
}
interface IDTokenPayload extends IDToken {
    email?: string;
    email_verified?: boolean;
    name?: string;
    given_name?: string;
    family_name?: string;
    middle_name?: string;
    nickname?: string;
    preferred_username?: string;
    profile?: string;
    picture?: string;
    website?: string;
    gender?: string;
    birthdate?: string;
    zoneinfo?: string;
    locale?: string;
    phone_number?: string;
    phone_number_verified?: boolean;
    address?: AddressClaim;
    updated_at?: number;
}
interface AddressClaim {
    formatted?: string;
    street_address?: string;
    locality?: string;
    region?: string;
    postal_code?: string;
    country?: string;
}
interface JWK {
    kty: string;
    use?: string;
    key_ops?: string[];
    alg?: string;
    kid?: string;
    n?: string;
    e?: string;
    d?: string;
    p?: string;
    q?: string;
    dp?: string;
    dq?: string;
    qi?: string;
    k?: string;
}
interface JWKS {
    keys: JWK[];
}
interface UserInfoResponse {
    sub: string;
    name?: string;
    given_name?: string;
    family_name?: string;
    middle_name?: string;
    nickname?: string;
    preferred_username?: string;
    profile?: string;
    picture?: string;
    website?: string;
    email?: string;
    email_verified?: boolean;
    gender?: string;
    birthdate?: string;
    zoneinfo?: string;
    locale?: string;
    phone_number?: string;
    phone_number_verified?: boolean;
    address?: AddressClaim;
    updated_at?: number;
}
interface OIDCDiscoveryMetadata {
    issuer: string;
    authorization_endpoint: string;
    token_endpoint: string;
    userinfo_endpoint?: string;
    jwks_uri: string;
    registration_endpoint?: string;
    scopes_supported?: string[];
    response_types_supported: string[];
    response_modes_supported?: string[];
    grant_types_supported?: string[];
    acr_values_supported?: string[];
    subject_types_supported: string[];
    id_token_signing_alg_values_supported: string[];
    id_token_encryption_alg_values_supported?: string[];
    id_token_encryption_enc_values_supported?: string[];
    userinfo_signing_alg_values_supported?: string[];
    userinfo_encryption_alg_values_supported?: string[];
    userinfo_encryption_enc_values_supported?: string[];
    token_endpoint_auth_methods_supported?: string[];
    display_values_supported?: string[];
    claim_types_supported?: string[];
    claims_supported?: string[];
    service_documentation?: string;
    claims_locales_supported?: string[];
    ui_locales_supported?: string[];
    claims_parameter_supported?: boolean;
    request_parameter_supported?: boolean;
    request_uri_parameter_supported?: boolean;
    require_request_uri_registration?: boolean;
    op_policy_uri?: string;
    op_tos_uri?: string;
    end_session_endpoint?: string;
    check_session_iframe?: string;
    revocation_endpoint?: string;
    introspection_endpoint?: string;
}
interface OIDCSession {
    sessionId: string;
    userId: string;
    clientId: string;
    createdAt: Date;
    lastActivity: Date;
    expiresAt: Date;
    state?: string;
    nonce?: string;
}
interface ClaimDefinition {
    name: string;
    type: 'string' | 'number' | 'boolean' | 'object' | 'array';
    required: boolean;
    description?: string;
    values?: any[];
}
interface LogoutRequest {
    idTokenHint?: string;
    postLogoutRedirectUri?: string;
    state?: string;
}
interface OIDCClientMetadata {
    client_id: string;
    client_secret?: string;
    redirect_uris: string[];
    response_types?: string[];
    grant_types?: string[];
    application_type?: 'web' | 'native';
    contacts?: string[];
    client_name?: string;
    logo_uri?: string;
    client_uri?: string;
    policy_uri?: string;
    tos_uri?: string;
    jwks_uri?: string;
    jwks?: JWKS;
    sector_identifier_uri?: string;
    subject_type?: 'public' | 'pairwise';
    id_token_signed_response_alg?: string;
    id_token_encrypted_response_alg?: string;
    id_token_encrypted_response_enc?: string;
    userinfo_signed_response_alg?: string;
    userinfo_encrypted_response_alg?: string;
    userinfo_encrypted_response_enc?: string;
    token_endpoint_auth_method?: string;
    default_max_age?: number;
    require_auth_time?: boolean;
    default_acr_values?: string[];
    initiate_login_uri?: string;
    request_uris?: string[];
    post_logout_redirect_uris?: string[];
}
/**
 * Generates OIDC authentication request URL.
 *
 * @param {string} authorizationEndpoint - OIDC authorization endpoint
 * @param {OIDCConfig} config - OIDC configuration
 * @returns {string} Authentication request URL
 *
 * @example
 * ```typescript
 * const authUrl = generateOIDCAuthenticationUrl(
 *   'https://auth.example.com/authorize',
 *   {
 *     issuer: 'https://auth.example.com',
 *     clientId: 'client123',
 *     redirectUri: 'https://app.example.com/callback',
 *     scope: ['openid', 'profile', 'email'],
 *     responseType: 'code',
 *     nonce: 'xyz123'
 *   }
 * );
 * ```
 */
export declare const generateOIDCAuthenticationUrl: (authorizationEndpoint: string, config: OIDCConfig) => string;
/**
 * Validates OIDC authentication request parameters.
 *
 * @param {OIDCConfig} config - OIDC configuration to validate
 * @returns {boolean} True if request is valid
 *
 * @example
 * ```typescript
 * const isValid = validateOIDCAuthenticationRequest({
 *   issuer: 'https://auth.example.com',
 *   clientId: 'client123',
 *   redirectUri: 'https://app.example.com/callback',
 *   scope: ['openid', 'profile']
 * });
 * ```
 */
export declare const validateOIDCAuthenticationRequest: (config: OIDCConfig) => boolean;
/**
 * Parses OIDC authentication response (callback).
 *
 * @param {string} responseUrl - Callback URL with response parameters
 * @param {string} [responseMode] - Response mode ('query', 'fragment', 'form_post')
 * @returns {Record<string, string>} Parsed response parameters
 *
 * @example
 * ```typescript
 * const response = parseOIDCAuthenticationResponse(
 *   'https://app.example.com/callback?code=abc123&state=xyz',
 *   'query'
 * );
 * // Result: { code: 'abc123', state: 'xyz' }
 * ```
 */
export declare const parseOIDCAuthenticationResponse: (responseUrl: string, responseMode?: "query" | "fragment") => Record<string, string>;
/**
 * Validates state parameter to prevent CSRF attacks.
 *
 * @param {string} receivedState - State from authentication response
 * @param {string} expectedState - Expected state value
 * @returns {boolean} True if state matches
 *
 * @example
 * ```typescript
 * const isValid = validateOIDCState(
 *   response.state,
 *   sessionStorage.getItem('oidc_state')
 * );
 * ```
 */
export declare const validateOIDCState: (receivedState: string, expectedState: string) => boolean;
/**
 * Generates nonce for ID token validation (replay protection).
 *
 * @returns {string} Random nonce value
 *
 * @example
 * ```typescript
 * const nonce = generateOIDCNonce();
 * // Store in session for later validation
 * ```
 */
export declare const generateOIDCNonce: () => string;
/**
 * Creates an OpenID Connect ID token.
 *
 * @param {IDTokenPayload} payload - ID token claims
 * @param {string} privateKey - Private key for signing
 * @param {string} [algorithm] - Signing algorithm (default: 'RS256')
 * @param {string} [kid] - Key ID
 * @returns {string} Signed ID token (JWT)
 *
 * @example
 * ```typescript
 * const idToken = createIDToken(
 *   {
 *     iss: 'https://auth.example.com',
 *     sub: 'user123',
 *     aud: 'client123',
 *     exp: Math.floor(Date.now() / 1000) + 3600,
 *     iat: Math.floor(Date.now() / 1000),
 *     nonce: 'xyz123'
 *   },
 *   privateKey,
 *   'RS256',
 *   'key1'
 * );
 * ```
 */
export declare const createIDToken: (payload: IDTokenPayload, privateKey: string, algorithm?: string, kid?: string) => string;
/**
 * Validates an ID token structure and required claims.
 *
 * @param {string} idToken - ID token to validate
 * @param {string} expectedIssuer - Expected issuer
 * @param {string} expectedAudience - Expected audience (client ID)
 * @param {string} [expectedNonce] - Expected nonce
 * @returns {IDTokenPayload | null} Decoded payload if valid, null otherwise
 *
 * @example
 * ```typescript
 * const payload = validateIDToken(
 *   idToken,
 *   'https://auth.example.com',
 *   'client123',
 *   'xyz123'
 * );
 * ```
 */
export declare const validateIDToken: (idToken: string, expectedIssuer: string, expectedAudience: string, expectedNonce?: string) => IDTokenPayload | null;
/**
 * Verifies ID token signature using public key.
 *
 * @param {string} idToken - ID token to verify
 * @param {string} publicKey - Public key for verification
 * @param {string} [algorithm] - Expected signing algorithm
 * @returns {boolean} True if signature is valid
 *
 * @example
 * ```typescript
 * const isValid = verifyIDTokenSignature(idToken, publicKey, 'RS256');
 * ```
 */
export declare const verifyIDTokenSignature: (idToken: string, publicKey: string, algorithm?: string) => boolean;
/**
 * Extracts claims from ID token without verification.
 *
 * @param {string} idToken - ID token
 * @returns {IDTokenPayload | null} Decoded claims or null
 *
 * @example
 * ```typescript
 * const claims = extractIDTokenClaims(idToken);
 * console.log(claims.sub, claims.email);
 * ```
 */
export declare const extractIDTokenClaims: (idToken: string) => IDTokenPayload | null;
/**
 * Validates ID token max_age parameter (authentication freshness).
 *
 * @param {number} authTime - Authentication timestamp from ID token
 * @param {number} maxAge - Maximum age in seconds
 * @returns {boolean} True if authentication is fresh enough
 *
 * @example
 * ```typescript
 * const isFresh = validateIDTokenMaxAge(payload.auth_time, 3600);
 * ```
 */
export declare const validateIDTokenMaxAge: (authTime: number, maxAge: number) => boolean;
/**
 * Retrieves user information from UserInfo endpoint.
 *
 * @param {string} userinfoEndpoint - UserInfo endpoint URL
 * @param {string} accessToken - Access token
 * @returns {Promise<UserInfoResponse>} User information
 *
 * @example
 * ```typescript
 * const userInfo = await getUserInfo(
 *   'https://auth.example.com/userinfo',
 *   'access_token_xyz'
 * );
 * ```
 */
export declare const getUserInfo: (userinfoEndpoint: string, accessToken: string) => Promise<UserInfoResponse>;
/**
 * Creates UserInfo response with standard claims.
 *
 * @param {string} userId - User identifier (sub claim)
 * @param {Record<string, any>} claims - User claims
 * @returns {UserInfoResponse} UserInfo response
 *
 * @example
 * ```typescript
 * const userInfo = createUserInfoResponse('user123', {
 *   name: 'John Doe',
 *   email: 'john@example.com',
 *   email_verified: true
 * });
 * ```
 */
export declare const createUserInfoResponse: (userId: string, claims: Record<string, any>) => UserInfoResponse;
/**
 * Validates access token for UserInfo endpoint access.
 *
 * @param {string} accessToken - Access token to validate
 * @param {string[]} requiredScopes - Required scopes for UserInfo access
 * @returns {boolean} True if token has required scopes
 *
 * @example
 * ```typescript
 * const hasAccess = validateUserInfoAccess(accessToken, ['openid', 'profile']);
 * ```
 */
export declare const validateUserInfoAccess: (accessToken: string, requiredScopes: string[]) => boolean;
/**
 * Filters UserInfo claims based on requested scopes.
 *
 * @param {UserInfoResponse} userInfo - Complete user information
 * @param {string[]} scopes - Requested scopes
 * @returns {Partial<UserInfoResponse>} Filtered user information
 *
 * @example
 * ```typescript
 * const filtered = filterUserInfoByScope(userInfo, ['openid', 'email']);
 * // Result: { sub: 'user123', email: 'john@example.com', email_verified: true }
 * ```
 */
export declare const filterUserInfoByScope: (userInfo: UserInfoResponse, scopes: string[]) => Partial<UserInfoResponse>;
/**
 * Creates OIDC discovery metadata (well-known configuration).
 *
 * @param {string} issuer - Issuer URL
 * @param {Partial<OIDCDiscoveryMetadata>} [metadata] - Additional metadata
 * @returns {OIDCDiscoveryMetadata} Complete discovery metadata
 *
 * @example
 * ```typescript
 * const discovery = createOIDCDiscoveryMetadata('https://auth.example.com', {
 *   scopes_supported: ['openid', 'profile', 'email', 'phone', 'address']
 * });
 * ```
 */
export declare const createOIDCDiscoveryMetadata: (issuer: string, metadata?: Partial<OIDCDiscoveryMetadata>) => OIDCDiscoveryMetadata;
/**
 * Fetches OIDC discovery metadata from well-known endpoint.
 *
 * @param {string} issuer - Issuer URL
 * @returns {Promise<OIDCDiscoveryMetadata>} Discovery metadata
 *
 * @example
 * ```typescript
 * const metadata = await fetchOIDCDiscovery('https://auth.example.com');
 * console.log(metadata.authorization_endpoint);
 * ```
 */
export declare const fetchOIDCDiscovery: (issuer: string) => Promise<OIDCDiscoveryMetadata>;
/**
 * Validates OIDC discovery metadata completeness.
 *
 * @param {OIDCDiscoveryMetadata} metadata - Discovery metadata to validate
 * @returns {boolean} True if metadata is valid
 *
 * @example
 * ```typescript
 * const isValid = validateOIDCDiscovery(discoveryMetadata);
 * ```
 */
export declare const validateOIDCDiscovery: (metadata: OIDCDiscoveryMetadata) => boolean;
/**
 * Defines standard OIDC claims.
 *
 * @returns {ClaimDefinition[]} Array of standard claim definitions
 *
 * @example
 * ```typescript
 * const standardClaims = defineStandardClaims();
 * ```
 */
export declare const defineStandardClaims: () => ClaimDefinition[];
/**
 * Maps scopes to claim names.
 *
 * @param {string[]} scopes - OIDC scopes
 * @returns {string[]} Claim names
 *
 * @example
 * ```typescript
 * const claims = mapScopesToClaims(['openid', 'profile', 'email']);
 * // Result: ['sub', 'name', 'given_name', ..., 'email', 'email_verified']
 * ```
 */
export declare const mapScopesToClaims: (scopes: string[]) => string[];
/**
 * Validates claim values against definitions.
 *
 * @param {Record<string, any>} claims - Claims to validate
 * @param {ClaimDefinition[]} definitions - Claim definitions
 * @returns {boolean} True if claims are valid
 *
 * @example
 * ```typescript
 * const isValid = validateClaims(
 *   { sub: 'user123', email: 'user@example.com' },
 *   standardClaimDefinitions
 * );
 * ```
 */
export declare const validateClaims: (claims: Record<string, any>, definitions: ClaimDefinition[]) => boolean;
/**
 * Creates custom claim definition.
 *
 * @param {string} name - Claim name
 * @param {string} type - Claim type
 * @param {boolean} required - Whether claim is required
 * @param {string} [description] - Claim description
 * @returns {ClaimDefinition} Claim definition
 *
 * @example
 * ```typescript
 * const claim = createCustomClaim('patient_id', 'string', true, 'Patient identifier');
 * ```
 */
export declare const createCustomClaim: (name: string, type: "string" | "number" | "boolean" | "object" | "array", required: boolean, description?: string) => ClaimDefinition;
/**
 * Creates OIDC session for user.
 *
 * @param {string} userId - User identifier
 * @param {string} clientId - Client identifier
 * @param {number} [expiresIn] - Session expiration in seconds (default: 86400)
 * @returns {OIDCSession} OIDC session object
 *
 * @example
 * ```typescript
 * const session = createOIDCSession('user123', 'client456', 3600);
 * ```
 */
export declare const createOIDCSession: (userId: string, clientId: string, expiresIn?: number) => OIDCSession;
/**
 * Validates OIDC session and checks expiration.
 *
 * @param {OIDCSession} session - Session to validate
 * @returns {boolean} True if session is valid
 *
 * @example
 * ```typescript
 * const isValid = validateOIDCSession(session);
 * ```
 */
export declare const validateOIDCSession: (session: OIDCSession) => boolean;
/**
 * Updates session last activity timestamp.
 *
 * @param {OIDCSession} session - Session to update
 * @returns {OIDCSession} Updated session
 *
 * @example
 * ```typescript
 * const updated = updateSessionActivity(session);
 * ```
 */
export declare const updateSessionActivity: (session: OIDCSession) => OIDCSession;
/**
 * Terminates OIDC session.
 *
 * @param {string} sessionId - Session identifier to terminate
 * @returns {boolean} True if session was terminated
 *
 * @example
 * ```typescript
 * const terminated = terminateOIDCSession('session_xyz');
 * ```
 */
export declare const terminateOIDCSession: (sessionId: string) => boolean;
/**
 * Generates OIDC logout request URL (RP-initiated logout).
 *
 * @param {string} endSessionEndpoint - End session endpoint URL
 * @param {LogoutRequest} request - Logout request parameters
 * @returns {string} Logout URL
 *
 * @example
 * ```typescript
 * const logoutUrl = generateOIDCLogoutUrl(
 *   'https://auth.example.com/logout',
 *   {
 *     idTokenHint: 'id_token_xyz',
 *     postLogoutRedirectUri: 'https://app.example.com',
 *     state: 'abc123'
 *   }
 * );
 * ```
 */
export declare const generateOIDCLogoutUrl: (endSessionEndpoint: string, request: LogoutRequest) => string;
/**
 * Validates logout request parameters.
 *
 * @param {LogoutRequest} request - Logout request
 * @param {string[]} registeredPostLogoutUris - Registered post-logout redirect URIs
 * @returns {boolean} True if request is valid
 *
 * @example
 * ```typescript
 * const isValid = validateOIDCLogoutRequest(
 *   logoutRequest,
 *   ['https://app.example.com', 'https://app.example.com/goodbye']
 * );
 * ```
 */
export declare const validateOIDCLogoutRequest: (request: LogoutRequest, registeredPostLogoutUris: string[]) => boolean;
/**
 * Performs back-channel logout (sends logout token to RPs).
 *
 * @param {string} logoutToken - Logout token (JWT)
 * @param {string[]} rpLogoutEndpoints - RP back-channel logout endpoints
 * @returns {Promise<boolean>} True if logout notifications sent successfully
 *
 * @example
 * ```typescript
 * const success = await performBackChannelLogout(
 *   logoutToken,
 *   ['https://rp1.example.com/logout', 'https://rp2.example.com/logout']
 * );
 * ```
 */
export declare const performBackChannelLogout: (logoutToken: string, rpLogoutEndpoints: string[]) => Promise<boolean>;
/**
 * Creates logout token for back-channel logout.
 *
 * @param {string} issuer - Issuer URL
 * @param {string} subject - Subject (user) identifier
 * @param {string} sessionId - Session identifier
 * @param {string} privateKey - Private key for signing
 * @returns {string} Signed logout token (JWT)
 *
 * @example
 * ```typescript
 * const logoutToken = createLogoutToken(
 *   'https://auth.example.com',
 *   'user123',
 *   'session_xyz',
 *   privateKey
 * );
 * ```
 */
export declare const createLogoutToken: (issuer: string, subject: string, sessionId: string, privateKey: string) => string;
/**
 * Registers OIDC client with dynamic client registration.
 *
 * @param {Partial<OIDCClientMetadata>} metadata - Client registration metadata
 * @returns {OIDCClientMetadata} Registered client metadata
 *
 * @example
 * ```typescript
 * const client = registerOIDCClient({
 *   redirect_uris: ['https://app.example.com/callback'],
 *   client_name: 'My Healthcare App',
 *   grant_types: ['authorization_code', 'refresh_token']
 * });
 * ```
 */
export declare const registerOIDCClient: (metadata: Partial<OIDCClientMetadata>) => OIDCClientMetadata;
/**
 * Validates OIDC client metadata.
 *
 * @param {OIDCClientMetadata} metadata - Client metadata to validate
 * @returns {boolean} True if metadata is valid
 *
 * @example
 * ```typescript
 * const isValid = validateOIDCClientMetadata(clientMetadata);
 * ```
 */
export declare const validateOIDCClientMetadata: (metadata: OIDCClientMetadata) => boolean;
/**
 * Updates OIDC client configuration.
 *
 * @param {OIDCClientMetadata} existing - Existing client metadata
 * @param {Partial<OIDCClientMetadata>} updates - Updates to apply
 * @returns {OIDCClientMetadata} Updated client metadata
 *
 * @example
 * ```typescript
 * const updated = updateOIDCClientMetadata(existingClient, {
 *   client_name: 'Updated App Name',
 *   redirect_uris: [...existingClient.redirect_uris, 'https://new.example.com/callback']
 * });
 * ```
 */
export declare const updateOIDCClientMetadata: (existing: OIDCClientMetadata, updates: Partial<OIDCClientMetadata>) => OIDCClientMetadata;
/**
 * Signs JWT payload with private key.
 *
 * @param {string} message - Message to sign (header.payload)
 * @param {string} privateKey - Private key for signing
 * @param {string} algorithm - Signing algorithm
 * @returns {string} Base64url-encoded signature
 *
 * @example
 * ```typescript
 * const signature = signJWT(message, privateKey, 'RS256');
 * ```
 */
export declare const signJWT: (message: string, privateKey: string, algorithm: string) => string;
/**
 * Verifies JWT signature with public key.
 *
 * @param {string} message - Message that was signed (header.payload)
 * @param {string} signature - Base64url-encoded signature
 * @param {string} publicKey - Public key for verification
 * @param {string} algorithm - Expected signing algorithm
 * @returns {boolean} True if signature is valid
 *
 * @example
 * ```typescript
 * const isValid = verifyJWT(message, signature, publicKey, 'RS256');
 * ```
 */
export declare const verifyJWT: (message: string, signature: string, publicKey: string, algorithm: string) => boolean;
/**
 * Creates JWK (JSON Web Key) from public key.
 *
 * @param {string} publicKey - Public key (PEM format)
 * @param {string} [kid] - Key ID
 * @param {string} [use] - Key use ('sig' or 'enc')
 * @returns {JWK} JSON Web Key
 *
 * @example
 * ```typescript
 * const jwk = createJWK(publicKey, 'key1', 'sig');
 * ```
 */
export declare const createJWK: (publicKey: string, kid?: string, use?: string) => JWK;
/**
 * Creates JWKS (JSON Web Key Set).
 *
 * @param {JWK[]} keys - Array of JWKs
 * @returns {JWKS} JSON Web Key Set
 *
 * @example
 * ```typescript
 * const jwks = createJWKS([jwk1, jwk2]);
 * ```
 */
export declare const createJWKS: (keys: JWK[]) => JWKS;
/**
 * Generates OIDC hybrid flow authorization URL.
 *
 * @param {string} authorizationEndpoint - Authorization endpoint URL
 * @param {OIDCConfig} config - OIDC configuration
 * @returns {string} Hybrid flow authorization URL
 *
 * @example
 * ```typescript
 * const authUrl = generateOIDCHybridFlowUrl(
 *   'https://auth.example.com/authorize',
 *   {
 *     issuer: 'https://auth.example.com',
 *     clientId: 'client123',
 *     redirectUri: 'https://app.example.com/callback',
 *     scope: ['openid', 'profile'],
 *     responseType: 'code id_token',
 *     nonce: 'xyz123'
 *   }
 * );
 * ```
 */
export declare const generateOIDCHybridFlowUrl: (authorizationEndpoint: string, config: OIDCConfig) => string;
/**
 * Validates OIDC hybrid flow response.
 *
 * @param {Record<string, string>} response - Authorization response
 * @param {string} expectedNonce - Expected nonce value
 * @returns {boolean} True if response is valid
 *
 * @example
 * ```typescript
 * const isValid = validateOIDCHybridFlowResponse(response, 'xyz123');
 * ```
 */
export declare const validateOIDCHybridFlowResponse: (response: Record<string, string>, expectedNonce: string) => boolean;
/**
 * Base64url encodes a string.
 *
 * @param {string} str - String to encode
 * @returns {string} Base64url-encoded string
 *
 * @example
 * ```typescript
 * const encoded = base64UrlEncode('{"alg":"RS256"}');
 * ```
 */
export declare const base64UrlEncode: (str: string) => string;
/**
 * Base64url decodes a string.
 *
 * @param {string} str - Base64url-encoded string
 * @returns {string} Decoded string
 *
 * @example
 * ```typescript
 * const decoded = base64UrlDecode(encodedString);
 * ```
 */
export declare const base64UrlDecode: (str: string) => string;
/**
 * Generates secure random state parameter.
 *
 * @returns {string} Random state value
 *
 * @example
 * ```typescript
 * const state = generateOIDCState();
 * ```
 */
export declare const generateOIDCState: () => string;
export {};
//# sourceMappingURL=iam-oidc-kit.d.ts.map