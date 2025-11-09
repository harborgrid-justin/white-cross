/**
 * LOC: IAM-SAML-001
 * File: /reuse/iam-saml-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - SAML authentication services
 *   - Identity provider integrations
 *   - SSO controllers
 *   - Enterprise authentication services
 */
export interface SAMLConfig {
    entityId: string;
    callbackUrl: string;
    entryPoint: string;
    issuer: string;
    cert?: string;
    privateKey?: string;
    signatureAlgorithm?: 'sha1' | 'sha256' | 'sha512';
    digestAlgorithm?: 'sha1' | 'sha256' | 'sha512';
}
export interface SAMLAssertion {
    id: string;
    issuer: string;
    issueInstant: Date;
    subject: SAMLSubject;
    conditions: SAMLConditions;
    attributes: SAMLAttribute[];
    authnStatement: SAMLAuthnStatement;
    signature?: SAMLSignature;
}
export interface SAMLSubject {
    nameID: string;
    nameIDFormat: string;
    subjectConfirmation: {
        method: string;
        recipient: string;
        notOnOrAfter: Date;
        inResponseTo?: string;
    };
}
export interface SAMLConditions {
    notBefore: Date;
    notOnOrAfter: Date;
    audienceRestriction: string[];
}
export interface SAMLAttribute {
    name: string;
    friendlyName?: string;
    nameFormat?: string;
    values: string[];
}
export interface SAMLAuthnStatement {
    authnInstant: Date;
    sessionIndex: string;
    sessionNotOnOrAfter?: Date;
    authnContext: {
        authnContextClassRef: string;
    };
}
export interface SAMLSignature {
    signatureValue: string;
    signatureMethod: string;
    digestMethod: string;
    x509Certificate?: string;
}
export interface SAMLRequest {
    id: string;
    issueInstant: Date;
    destination: string;
    issuer: string;
    nameIDPolicy?: {
        format: string;
        allowCreate: boolean;
    };
    requestedAuthnContext?: {
        authnContextClassRef: string[];
        comparison: 'exact' | 'minimum' | 'maximum' | 'better';
    };
}
export interface SAMLResponse {
    id: string;
    inResponseTo: string;
    issueInstant: Date;
    destination: string;
    issuer: string;
    status: SAMLStatus;
    assertion?: SAMLAssertion;
    signature?: SAMLSignature;
}
export interface SAMLStatus {
    statusCode: string;
    statusMessage?: string;
    statusDetail?: string;
}
export interface SAMLMetadata {
    entityID: string;
    validUntil?: Date;
    cacheDuration?: string;
    idpSSODescriptor?: IDPSSODescriptor;
    spSSODescriptor?: SPSSODescriptor;
    organization?: SAMLOrganization;
    contactPerson?: SAMLContactPerson[];
}
export interface IDPSSODescriptor {
    wantAuthnRequestsSigned: boolean;
    protocolSupportEnumeration: string[];
    keyDescriptor: KeyDescriptor[];
    singleSignOnService: SAMLEndpoint[];
    singleLogoutService: SAMLEndpoint[];
    nameIDFormats: string[];
    attributes?: SAMLAttribute[];
}
export interface SPSSODescriptor {
    authnRequestsSigned: boolean;
    wantAssertionsSigned: boolean;
    protocolSupportEnumeration: string[];
    keyDescriptor: KeyDescriptor[];
    assertionConsumerService: AssertionConsumerService[];
    singleLogoutService: SAMLEndpoint[];
    nameIDFormats: string[];
}
export interface KeyDescriptor {
    use: 'signing' | 'encryption';
    x509Certificate: string;
}
export interface SAMLEndpoint {
    binding: string;
    location: string;
    index?: number;
    isDefault?: boolean;
}
export interface AssertionConsumerService extends SAMLEndpoint {
    index: number;
    isDefault: boolean;
}
export interface SAMLOrganization {
    name: string;
    displayName: string;
    url: string;
}
export interface SAMLContactPerson {
    contactType: 'technical' | 'support' | 'administrative' | 'billing' | 'other';
    givenName: string;
    surname: string;
    emailAddress: string;
    telephoneNumber?: string;
}
export interface SAMLAttributeMapping {
    samlAttribute: string;
    localAttribute: string;
    transform?: (value: string) => any;
    required?: boolean;
}
export interface SAMLUser {
    nameID: string;
    nameIDFormat: string;
    sessionIndex: string;
    attributes: Record<string, any>;
}
export interface LogoutRequest {
    id: string;
    issueInstant: Date;
    destination: string;
    issuer: string;
    nameID: string;
    sessionIndex: string;
}
export interface LogoutResponse {
    id: string;
    inResponseTo: string;
    issueInstant: Date;
    destination: string;
    issuer: string;
    status: SAMLStatus;
}
/**
 * Generates a SAML authentication request (AuthnRequest).
 *
 * @param {SAMLConfig} config - SAML configuration
 * @param {boolean} [forceAuthn] - Force re-authentication
 * @returns {SAMLRequest} SAML authentication request
 *
 * @example
 * ```typescript
 * const authnRequest = generateSAMLAuthnRequest({
 *   entityId: 'https://sp.example.com',
 *   callbackUrl: 'https://sp.example.com/saml/acs',
 *   entryPoint: 'https://idp.example.com/saml/sso',
 *   issuer: 'https://sp.example.com'
 * });
 * ```
 */
export declare const generateSAMLAuthnRequest: (config: SAMLConfig, forceAuthn?: boolean) => SAMLRequest;
/**
 * Encodes SAML request for HTTP redirect binding.
 *
 * @param {SAMLRequest} request - SAML request to encode
 * @returns {string} Base64-encoded deflated request
 *
 * @example
 * ```typescript
 * const encoded = encodeSAMLRequest(authnRequest);
 * // Use in redirect URL: ?SAMLRequest=${encoded}
 * ```
 */
export declare const encodeSAMLRequest: (request: SAMLRequest) => string;
/**
 * Decodes SAML request from HTTP parameter.
 *
 * @param {string} encodedRequest - Base64-encoded deflated request
 * @returns {SAMLRequest} Decoded SAML request
 *
 * @example
 * ```typescript
 * const request = decodeSAMLRequest(req.query.SAMLRequest);
 * ```
 */
export declare const decodeSAMLRequest: (encodedRequest: string) => SAMLRequest;
/**
 * Validates SAML authentication request.
 *
 * @param {SAMLRequest} request - SAML request to validate
 * @param {SAMLConfig} config - SAML configuration
 * @returns {{ valid: boolean; error?: string }} Validation result
 *
 * @example
 * ```typescript
 * const { valid, error } = validateSAMLAuthnRequest(request, config);
 * if (!valid) throw new Error(error);
 * ```
 */
export declare const validateSAMLAuthnRequest: (request: SAMLRequest, config: SAMLConfig) => {
    valid: boolean;
    error?: string;
};
/**
 * Creates SAML redirect URL for authentication.
 *
 * @param {string} idpEntryPoint - Identity provider SSO endpoint
 * @param {SAMLRequest} request - SAML authentication request
 * @param {string} [relayState] - Optional relay state
 * @returns {string} Redirect URL
 *
 * @example
 * ```typescript
 * const redirectUrl = createSAMLRedirectUrl(
 *   'https://idp.example.com/saml/sso',
 *   authnRequest,
 *   '/dashboard'
 * );
 * // Redirect user to this URL
 * ```
 */
export declare const createSAMLRedirectUrl: (idpEntryPoint: string, request: SAMLRequest, relayState?: string) => string;
/**
 * Generates a SAML assertion for authenticated user.
 *
 * @param {SAMLConfig} config - SAML configuration
 * @param {SAMLUser} user - Authenticated user
 * @param {string} [inResponseTo] - Request ID this assertion responds to
 * @returns {SAMLAssertion} SAML assertion
 *
 * @example
 * ```typescript
 * const assertion = generateSAMLAssertion(config, {
 *   nameID: 'user@example.com',
 *   nameIDFormat: 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
 *   sessionIndex: 'session123',
 *   attributes: { email: 'user@example.com', role: 'doctor' }
 * }, requestId);
 * ```
 */
export declare const generateSAMLAssertion: (config: SAMLConfig, user: SAMLUser, inResponseTo?: string) => SAMLAssertion;
/**
 * Signs SAML assertion with private key.
 *
 * @param {SAMLAssertion} assertion - SAML assertion to sign
 * @param {string} privateKey - PEM-encoded private key
 * @param {string} [algorithm] - Signature algorithm (default: 'sha256')
 * @returns {SAMLAssertion} Signed assertion
 *
 * @example
 * ```typescript
 * const signed = signSAMLAssertion(assertion, privateKeyPem, 'sha256');
 * ```
 */
export declare const signSAMLAssertion: (assertion: SAMLAssertion, privateKey: string, algorithm?: "sha1" | "sha256" | "sha512") => SAMLAssertion;
/**
 * Creates SAML assertion with custom attributes.
 *
 * @param {SAMLConfig} config - SAML configuration
 * @param {string} nameID - User identifier
 * @param {SAMLAttribute[]} attributes - User attributes
 * @returns {SAMLAssertion} SAML assertion
 *
 * @example
 * ```typescript
 * const assertion = createSAMLAssertionWithAttributes(config, 'user@example.com', [
 *   { name: 'email', values: ['user@example.com'] },
 *   { name: 'role', values: ['doctor', 'admin'] }
 * ]);
 * ```
 */
export declare const createSAMLAssertionWithAttributes: (config: SAMLConfig, nameID: string, attributes: SAMLAttribute[]) => SAMLAssertion;
/**
 * Encrypts SAML assertion for enhanced security.
 *
 * @param {SAMLAssertion} assertion - SAML assertion to encrypt
 * @param {string} publicKey - Recipient's public key
 * @returns {string} Encrypted assertion XML
 *
 * @example
 * ```typescript
 * const encrypted = encryptSAMLAssertion(assertion, recipientPublicKey);
 * ```
 */
export declare const encryptSAMLAssertion: (assertion: SAMLAssertion, publicKey: string) => string;
/**
 * Decrypts encrypted SAML assertion.
 *
 * @param {string} encryptedAssertion - Encrypted assertion XML
 * @param {string} privateKey - Private key for decryption
 * @returns {SAMLAssertion} Decrypted assertion
 *
 * @example
 * ```typescript
 * const assertion = decryptSAMLAssertion(encryptedXml, privateKeyPem);
 * ```
 */
export declare const decryptSAMLAssertion: (encryptedAssertion: string, privateKey: string) => SAMLAssertion;
/**
 * Validates SAML assertion signature and conditions.
 *
 * @param {SAMLAssertion} assertion - SAML assertion to validate
 * @param {string} certificate - X.509 certificate for signature verification
 * @param {SAMLConfig} config - SAML configuration
 * @returns {{ valid: boolean; error?: string }} Validation result
 *
 * @example
 * ```typescript
 * const { valid, error } = validateSAMLAssertion(assertion, idpCertificate, config);
 * if (!valid) throw new Error(error);
 * ```
 */
export declare const validateSAMLAssertion: (assertion: SAMLAssertion, certificate: string, config: SAMLConfig) => {
    valid: boolean;
    error?: string;
};
/**
 * Verifies SAML assertion signature using certificate.
 *
 * @param {SAMLAssertion} assertion - SAML assertion with signature
 * @param {string} certificate - X.509 certificate
 * @returns {boolean} True if signature is valid
 *
 * @example
 * ```typescript
 * if (verifySAMLSignature(assertion, idpCertificate)) {
 *   // Signature is valid
 * }
 * ```
 */
export declare const verifySAMLSignature: (assertion: SAMLAssertion, certificate: string) => boolean;
/**
 * Validates assertion conditions (time, audience).
 *
 * @param {SAMLConditions} conditions - Assertion conditions
 * @param {string} expectedAudience - Expected audience (SP entity ID)
 * @returns {{ valid: boolean; error?: string }} Validation result
 *
 * @example
 * ```typescript
 * const { valid, error } = validateAssertionConditions(
 *   assertion.conditions,
 *   'https://sp.example.com'
 * );
 * ```
 */
export declare const validateAssertionConditions: (conditions: SAMLConditions, expectedAudience: string) => {
    valid: boolean;
    error?: string;
};
/**
 * Validates subject confirmation data.
 *
 * @param {SAMLSubject} subject - SAML subject
 * @param {string} expectedRecipient - Expected recipient URL
 * @param {string} [inResponseTo] - Expected request ID
 * @returns {{ valid: boolean; error?: string }} Validation result
 *
 * @example
 * ```typescript
 * const { valid, error } = validateSubjectConfirmation(
 *   assertion.subject,
 *   'https://sp.example.com/saml/acs',
 *   requestId
 * );
 * ```
 */
export declare const validateSubjectConfirmation: (subject: SAMLSubject, expectedRecipient: string, inResponseTo?: string) => {
    valid: boolean;
    error?: string;
};
/**
 * Extracts user information from validated assertion.
 *
 * @param {SAMLAssertion} assertion - Validated SAML assertion
 * @returns {SAMLUser} User information
 *
 * @example
 * ```typescript
 * const user = extractUserFromAssertion(assertion);
 * // Result: { nameID: 'user@example.com', attributes: {...} }
 * ```
 */
export declare const extractUserFromAssertion: (assertion: SAMLAssertion) => SAMLUser;
/**
 * Generates SAML service provider metadata.
 *
 * @param {SAMLConfig} config - SAML configuration
 * @param {string} x509Certificate - SP certificate
 * @returns {SAMLMetadata} SP metadata
 *
 * @example
 * ```typescript
 * const metadata = generateSPMetadata({
 *   entityId: 'https://sp.example.com',
 *   callbackUrl: 'https://sp.example.com/saml/acs',
 *   entryPoint: 'https://idp.example.com/saml/sso',
 *   issuer: 'https://sp.example.com'
 * }, certificatePem);
 * ```
 */
export declare const generateSPMetadata: (config: SAMLConfig, x509Certificate: string) => SAMLMetadata;
/**
 * Generates SAML identity provider metadata.
 *
 * @param {SAMLConfig} config - SAML configuration
 * @param {string} x509Certificate - IdP certificate
 * @param {SAMLAttribute[]} [supportedAttributes] - Supported attributes
 * @returns {SAMLMetadata} IdP metadata
 *
 * @example
 * ```typescript
 * const metadata = generateIdPMetadata(config, certificatePem, [
 *   { name: 'email', friendlyName: 'Email Address', values: [] },
 *   { name: 'role', friendlyName: 'User Role', values: [] }
 * ]);
 * ```
 */
export declare const generateIdPMetadata: (config: SAMLConfig, x509Certificate: string, supportedAttributes?: SAMLAttribute[]) => SAMLMetadata;
/**
 * Parses SAML metadata XML.
 *
 * @param {string} metadataXml - SAML metadata XML
 * @returns {SAMLMetadata} Parsed metadata
 *
 * @example
 * ```typescript
 * const metadata = parseSAMLMetadata(xmlString);
 * ```
 */
export declare const parseSAMLMetadata: (metadataXml: string) => SAMLMetadata;
/**
 * Serializes SAML metadata to XML.
 *
 * @param {SAMLMetadata} metadata - SAML metadata
 * @returns {string} XML string
 *
 * @example
 * ```typescript
 * const xml = serializeSAMLMetadata(metadata);
 * // Serve this XML at /saml/metadata endpoint
 * ```
 */
export declare const serializeSAMLMetadata: (metadata: SAMLMetadata) => string;
/**
 * Validates SAML metadata structure.
 *
 * @param {SAMLMetadata} metadata - SAML metadata to validate
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const { valid, errors } = validateSAMLMetadata(metadata);
 * if (!valid) console.log('Errors:', errors);
 * ```
 */
export declare const validateSAMLMetadata: (metadata: SAMLMetadata) => {
    valid: boolean;
    errors: string[];
};
/**
 * Configures SAML identity provider integration.
 *
 * @param {string} metadataUrl - IdP metadata URL
 * @param {string} entityId - SP entity ID
 * @returns {Promise<SAMLConfig>} SAML configuration
 *
 * @example
 * ```typescript
 * const config = await configureSAMLIdP(
 *   'https://idp.example.com/saml/metadata',
 *   'https://sp.example.com'
 * );
 * ```
 */
export declare const configureSAMLIdP: (metadataUrl: string, entityId: string) => Promise<SAMLConfig>;
/**
 * Extracts IdP SSO URL from metadata.
 *
 * @param {SAMLMetadata} metadata - IdP metadata
 * @param {string} [binding] - Preferred binding
 * @returns {string | null} SSO endpoint URL
 *
 * @example
 * ```typescript
 * const ssoUrl = extractIdPSSOUrl(idpMetadata, 'HTTP-Redirect');
 * ```
 */
export declare const extractIdPSSOUrl: (metadata: SAMLMetadata, binding?: string) => string | null;
/**
 * Extracts IdP logout URL from metadata.
 *
 * @param {SAMLMetadata} metadata - IdP metadata
 * @returns {string | null} Logout endpoint URL
 *
 * @example
 * ```typescript
 * const logoutUrl = extractIdPLogoutUrl(idpMetadata);
 * ```
 */
export declare const extractIdPLogoutUrl: (metadata: SAMLMetadata) => string | null;
/**
 * Extracts IdP signing certificate from metadata.
 *
 * @param {SAMLMetadata} metadata - IdP metadata
 * @returns {string | null} X.509 certificate
 *
 * @example
 * ```typescript
 * const cert = extractIdPCertificate(idpMetadata);
 * ```
 */
export declare const extractIdPCertificate: (metadata: SAMLMetadata) => string | null;
/**
 * Tests IdP connectivity and configuration.
 *
 * @param {SAMLConfig} config - SAML configuration
 * @returns {Promise<{ connected: boolean; error?: string }>} Connection test result
 *
 * @example
 * ```typescript
 * const { connected, error } = await testIdPConnection(samlConfig);
 * if (!connected) console.error(error);
 * ```
 */
export declare const testIdPConnection: (config: SAMLConfig) => Promise<{
    connected: boolean;
    error?: string;
}>;
/**
 * Configures SAML service provider settings.
 *
 * @param {string} entityId - SP entity ID
 * @param {string} acsUrl - Assertion Consumer Service URL
 * @param {string} certificate - SP certificate
 * @param {string} privateKey - SP private key
 * @returns {SAMLConfig} SP configuration
 *
 * @example
 * ```typescript
 * const spConfig = configureSAMLServiceProvider(
 *   'https://sp.example.com',
 *   'https://sp.example.com/saml/acs',
 *   certificatePem,
 *   privateKeyPem
 * );
 * ```
 */
export declare const configureSAMLServiceProvider: (entityId: string, acsUrl: string, certificate: string, privateKey: string) => SAMLConfig;
/**
 * Generates SP assertion consumer service configuration.
 *
 * @param {string} baseUrl - SP base URL
 * @param {number} [index] - Service index
 * @returns {AssertionConsumerService} ACS configuration
 *
 * @example
 * ```typescript
 * const acs = generateSPAssertionConsumerService('https://sp.example.com', 0);
 * ```
 */
export declare const generateSPAssertionConsumerService: (baseUrl: string, index?: number) => AssertionConsumerService;
/**
 * Validates SP configuration completeness.
 *
 * @param {SAMLConfig} config - SP configuration
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const { valid, errors } = validateSPConfiguration(spConfig);
 * ```
 */
export declare const validateSPConfiguration: (config: SAMLConfig) => {
    valid: boolean;
    errors: string[];
};
/**
 * Maps SAML attributes to local user attributes.
 *
 * @param {SAMLAttribute[]} samlAttributes - SAML attributes from assertion
 * @param {SAMLAttributeMapping[]} mappings - Attribute mapping configuration
 * @returns {Record<string, any>} Mapped local attributes
 *
 * @example
 * ```typescript
 * const localAttrs = mapSAMLAttributes(assertion.attributes, [
 *   { samlAttribute: 'email', localAttribute: 'email' },
 *   { samlAttribute: 'role', localAttribute: 'userRole', transform: (v) => v.toLowerCase() }
 * ]);
 * ```
 */
export declare const mapSAMLAttributes: (samlAttributes: SAMLAttribute[], mappings: SAMLAttributeMapping[]) => Record<string, any>;
/**
 * Creates attribute mapping configuration.
 *
 * @param {Array<{saml: string, local: string, required?: boolean}>} mappings - Mapping definitions
 * @returns {SAMLAttributeMapping[]} Attribute mappings
 *
 * @example
 * ```typescript
 * const mappings = createAttributeMappings([
 *   { saml: 'mail', local: 'email', required: true },
 *   { saml: 'displayName', local: 'fullName' }
 * ]);
 * ```
 */
export declare const createAttributeMappings: (mappings: Array<{
    saml: string;
    local: string;
    required?: boolean;
}>) => SAMLAttributeMapping[];
/**
 * Validates required SAML attributes are present.
 *
 * @param {SAMLAttribute[]} attributes - SAML attributes
 * @param {string[]} requiredAttributes - Required attribute names
 * @returns {{ valid: boolean; missing: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const { valid, missing } = validateRequiredAttributes(
 *   assertion.attributes,
 *   ['email', 'firstName', 'lastName']
 * );
 * ```
 */
export declare const validateRequiredAttributes: (attributes: SAMLAttribute[], requiredAttributes: string[]) => {
    valid: boolean;
    missing: string[];
};
/**
 * Initiates SAML SSO flow.
 *
 * @param {SAMLConfig} config - SAML configuration
 * @param {string} [relayState] - Target URL after authentication
 * @returns {{ redirectUrl: string; requestId: string }} SSO initiation result
 *
 * @example
 * ```typescript
 * const { redirectUrl, requestId } = initiateSAMLSSO(samlConfig, '/dashboard');
 * // Redirect user to redirectUrl
 * ```
 */
export declare const initiateSAMLSSO: (config: SAMLConfig, relayState?: string) => {
    redirectUrl: string;
    requestId: string;
};
/**
 * Processes SAML SSO response.
 *
 * @param {string} samlResponse - Base64-encoded SAML response
 * @param {SAMLConfig} config - SAML configuration
 * @param {string} idpCertificate - IdP certificate
 * @returns {Promise<SAMLUser>} Authenticated user
 *
 * @example
 * ```typescript
 * const user = await processSAMLSSOResponse(
 *   req.body.SAMLResponse,
 *   samlConfig,
 *   idpCertificate
 * );
 * // Create session for user
 * ```
 */
export declare const processSAMLSSOResponse: (samlResponse: string, config: SAMLConfig, idpCertificate: string) => Promise<SAMLUser>;
/**
 * Creates SAML SSO session.
 *
 * @param {SAMLUser} user - Authenticated SAML user
 * @param {number} [sessionDuration] - Session duration in seconds
 * @returns {{ sessionId: string; expiresAt: Date }} Session information
 *
 * @example
 * ```typescript
 * const session = createSAMLSession(user, 28800); // 8 hours
 * ```
 */
export declare const createSAMLSession: (user: SAMLUser, sessionDuration?: number) => {
    sessionId: string;
    expiresAt: Date;
};
/**
 * Generates SAML logout request.
 *
 * @param {SAMLConfig} config - SAML configuration
 * @param {SAMLUser} user - User to log out
 * @returns {LogoutRequest} SAML logout request
 *
 * @example
 * ```typescript
 * const logoutRequest = generateSAMLLogoutRequest(samlConfig, currentUser);
 * ```
 */
export declare const generateSAMLLogoutRequest: (config: SAMLConfig, user: SAMLUser) => LogoutRequest;
/**
 * Processes SAML logout response.
 *
 * @param {string} logoutResponse - Base64-encoded logout response
 * @returns {LogoutResponse} Parsed logout response
 *
 * @example
 * ```typescript
 * const response = processSAMLLogoutResponse(req.query.SAMLResponse);
 * if (response.status.statusCode === 'Success') {
 *   // Logout successful
 * }
 * ```
 */
export declare const processSAMLLogoutResponse: (logoutResponse: string) => LogoutResponse;
/**
 * Initiates SAML single logout flow.
 *
 * @param {SAMLConfig} config - SAML configuration
 * @param {SAMLUser} user - User to log out
 * @returns {{ redirectUrl: string; requestId: string }} Logout initiation result
 *
 * @example
 * ```typescript
 * const { redirectUrl } = initiateSAMLSingleLogout(samlConfig, currentUser);
 * // Redirect user to redirectUrl to complete logout
 * ```
 */
export declare const initiateSAMLSingleLogout: (config: SAMLConfig, user: SAMLUser) => {
    redirectUrl: string;
    requestId: string;
};
/**
 * Creates NestJS SAML authentication route handler.
 *
 * @param {SAMLConfig} config - SAML configuration
 * @returns {Function} Route handler function
 *
 * @example
 * ```typescript
 * @Get('saml/login')
 * login(@Res() res: Response) {
 *   const handler = createSAMLLoginHandler(this.samlConfig);
 *   return handler(res);
 * }
 * ```
 */
export declare const createSAMLLoginHandler: (config: SAMLConfig) => ((res: any) => void);
/**
 * Creates NestJS SAML assertion consumer service handler.
 *
 * @param {SAMLConfig} config - SAML configuration
 * @param {string} idpCertificate - IdP certificate
 * @param {Function} onSuccess - Success callback
 * @returns {Function} ACS handler function
 *
 * @example
 * ```typescript
 * @Post('saml/acs')
 * async acs(@Body() body: any, @Res() res: Response) {
 *   const handler = createSAMLACSHandler(config, cert, async (user) => {
 *     await this.authService.createSession(user);
 *   });
 *   return handler(body.SAMLResponse, res);
 * }
 * ```
 */
export declare const createSAMLACSHandler: (config: SAMLConfig, idpCertificate: string, onSuccess: (user: SAMLUser) => Promise<void>) => ((samlResponse: string, res: any) => Promise<void>);
/**
 * Creates NestJS SAML metadata endpoint handler.
 *
 * @param {SAMLConfig} config - SAML configuration
 * @param {string} certificate - SP certificate
 * @returns {Function} Metadata handler function
 *
 * @example
 * ```typescript
 * @Get('saml/metadata')
 * metadata(@Res() res: Response) {
 *   const handler = createSAMLMetadataHandler(this.samlConfig, this.certificate);
 *   return handler(res);
 * }
 * ```
 */
export declare const createSAMLMetadataHandler: (config: SAMLConfig, certificate: string) => ((res: any) => void);
/**
 * Creates NestJS SAML logout route handler.
 *
 * @param {SAMLConfig} config - SAML configuration
 * @param {Function} getUser - Function to get current user
 * @returns {Function} Logout handler function
 *
 * @example
 * ```typescript
 * @Get('saml/logout')
 * logout(@Req() req: Request, @Res() res: Response) {
 *   const handler = createSAMLLogoutHandler(this.samlConfig, () => req.user);
 *   return handler(res);
 * }
 * ```
 */
export declare const createSAMLLogoutHandler: (config: SAMLConfig, getUser: () => SAMLUser) => ((res: any) => void);
/**
 * Validates SAML configuration completeness.
 *
 * @param {SAMLConfig} config - SAML configuration to validate
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const { valid, errors } = validateSAMLConfig(config);
 * if (!valid) throw new Error(`Invalid config: ${errors.join(', ')}`);
 * ```
 */
export declare const validateSAMLConfig: (config: SAMLConfig) => {
    valid: boolean;
    errors: string[];
};
/**
 * Formats SAML error response for NestJS controllers.
 *
 * @param {string} error - Error message
 * @param {string} [statusCode] - SAML status code
 * @returns {Object} Error response object
 *
 * @example
 * ```typescript
 * throw new UnauthorizedException(
 *   formatSAMLErrorResponse('Authentication failed', 'AuthnFailed')
 * );
 * ```
 */
export declare const formatSAMLErrorResponse: (error: string, statusCode?: string) => object;
/**
 * Extracts SAML session data from user for storage.
 *
 * @param {SAMLUser} user - SAML user
 * @returns {Object} Session data
 *
 * @example
 * ```typescript
 * const sessionData = extractSAMLSessionData(samlUser);
 * await sessionRepository.save(sessionData);
 * ```
 */
export declare const extractSAMLSessionData: (user: SAMLUser) => Record<string, any>;
/**
 * Creates SAML guard configuration for NestJS.
 *
 * @param {Object} options - Guard options
 * @returns {Object} Guard configuration
 *
 * @example
 * ```typescript
 * const guardConfig = createSAMLGuardConfig({
 *   loginUrl: '/saml/login',
 *   callbackUrl: '/saml/acs',
 *   requireAuth: true
 * });
 * ```
 */
export declare const createSAMLGuardConfig: (options: {
    loginUrl?: string;
    callbackUrl?: string;
    requireAuth?: boolean;
    allowedIdPs?: string[];
}) => object;
//# sourceMappingURL=iam-saml-kit.d.ts.map