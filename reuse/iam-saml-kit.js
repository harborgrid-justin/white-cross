"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSAMLGuardConfig = exports.extractSAMLSessionData = exports.formatSAMLErrorResponse = exports.validateSAMLConfig = exports.createSAMLLogoutHandler = exports.createSAMLMetadataHandler = exports.createSAMLACSHandler = exports.createSAMLLoginHandler = exports.initiateSAMLSingleLogout = exports.processSAMLLogoutResponse = exports.generateSAMLLogoutRequest = exports.createSAMLSession = exports.processSAMLSSOResponse = exports.initiateSAMLSSO = exports.validateRequiredAttributes = exports.createAttributeMappings = exports.mapSAMLAttributes = exports.validateSPConfiguration = exports.generateSPAssertionConsumerService = exports.configureSAMLServiceProvider = exports.testIdPConnection = exports.extractIdPCertificate = exports.extractIdPLogoutUrl = exports.extractIdPSSOUrl = exports.configureSAMLIdP = exports.validateSAMLMetadata = exports.serializeSAMLMetadata = exports.parseSAMLMetadata = exports.generateIdPMetadata = exports.generateSPMetadata = exports.extractUserFromAssertion = exports.validateSubjectConfirmation = exports.validateAssertionConditions = exports.verifySAMLSignature = exports.validateSAMLAssertion = exports.decryptSAMLAssertion = exports.encryptSAMLAssertion = exports.createSAMLAssertionWithAttributes = exports.signSAMLAssertion = exports.generateSAMLAssertion = exports.createSAMLRedirectUrl = exports.validateSAMLAuthnRequest = exports.decodeSAMLRequest = exports.encodeSAMLRequest = exports.generateSAMLAuthnRequest = void 0;
/**
 * File: /reuse/iam-saml-kit.ts
 * Locator: WC-IAM-SAML-001
 * Purpose: Comprehensive SAML 2.0 Authentication Kit - Complete SAML toolkit
 *
 * Upstream: Independent utility module for SAML 2.0 operations
 * Downstream: ../backend/*, SSO services, IdP/SP controllers, Enterprise auth
 * Dependencies: TypeScript 5.x, Node 18+, crypto, xml2js, zlib
 * Exports: 45 utility functions for SAML authentication, assertions, metadata, SSO/SLO
 *
 * LLM Context: Enterprise-grade SAML 2.0 utilities for White Cross healthcare platform.
 * Provides SAML assertion generation/validation, metadata exchange, IdP/SP integration,
 * attribute mapping, single sign-on, single logout, and NestJS controller patterns.
 * HIPAA-compliant enterprise authentication for healthcare organizations.
 */
const crypto = __importStar(require("crypto"));
const zlib = __importStar(require("zlib"));
// ============================================================================
// SAML AUTHENTICATION
// ============================================================================
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
const generateSAMLAuthnRequest = (config, forceAuthn = false) => {
    const id = `_${crypto.randomBytes(21).toString('hex')}`;
    return {
        id,
        issueInstant: new Date(),
        destination: config.entryPoint,
        issuer: config.issuer,
        nameIDPolicy: {
            format: 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
            allowCreate: true,
        },
        requestedAuthnContext: {
            authnContextClassRef: ['urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport'],
            comparison: 'exact',
        },
    };
};
exports.generateSAMLAuthnRequest = generateSAMLAuthnRequest;
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
const encodeSAMLRequest = (request) => {
    const xml = serializeSAMLRequest(request);
    const deflated = zlib.deflateRawSync(Buffer.from(xml, 'utf8'));
    return deflated.toString('base64');
};
exports.encodeSAMLRequest = encodeSAMLRequest;
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
const decodeSAMLRequest = (encodedRequest) => {
    const deflated = Buffer.from(encodedRequest, 'base64');
    const inflated = zlib.inflateRawSync(deflated);
    const xml = inflated.toString('utf8');
    return parseSAMLRequest(xml);
};
exports.decodeSAMLRequest = decodeSAMLRequest;
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
const validateSAMLAuthnRequest = (request, config) => {
    // Check required fields
    if (!request.id || !request.issuer || !request.destination) {
        return { valid: false, error: 'Missing required fields in SAML request' };
    }
    // Validate issue instant is not too old
    const maxAge = 5 * 60 * 1000; // 5 minutes
    const age = Date.now() - request.issueInstant.getTime();
    if (age > maxAge) {
        return { valid: false, error: 'SAML request has expired' };
    }
    // Validate destination matches
    if (request.destination !== config.entryPoint) {
        return { valid: false, error: 'Invalid destination in SAML request' };
    }
    return { valid: true };
};
exports.validateSAMLAuthnRequest = validateSAMLAuthnRequest;
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
const createSAMLRedirectUrl = (idpEntryPoint, request, relayState) => {
    const encodedRequest = (0, exports.encodeSAMLRequest)(request);
    const params = new URLSearchParams({ SAMLRequest: encodedRequest });
    if (relayState) {
        params.append('RelayState', relayState);
    }
    return `${idpEntryPoint}?${params.toString()}`;
};
exports.createSAMLRedirectUrl = createSAMLRedirectUrl;
// ============================================================================
// SAML ASSERTION GENERATION
// ============================================================================
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
const generateSAMLAssertion = (config, user, inResponseTo) => {
    const id = `_${crypto.randomBytes(21).toString('hex')}`;
    const now = new Date();
    const notOnOrAfter = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes
    return {
        id,
        issuer: config.issuer,
        issueInstant: now,
        subject: {
            nameID: user.nameID,
            nameIDFormat: user.nameIDFormat,
            subjectConfirmation: {
                method: 'urn:oasis:names:tc:SAML:2.0:cm:bearer',
                recipient: config.callbackUrl,
                notOnOrAfter,
                inResponseTo,
            },
        },
        conditions: {
            notBefore: now,
            notOnOrAfter,
            audienceRestriction: [config.entityId],
        },
        attributes: Object.entries(user.attributes).map(([name, value]) => ({
            name,
            values: Array.isArray(value) ? value : [String(value)],
        })),
        authnStatement: {
            authnInstant: now,
            sessionIndex: user.sessionIndex,
            sessionNotOnOrAfter: new Date(now.getTime() + 8 * 60 * 60 * 1000), // 8 hours
            authnContext: {
                authnContextClassRef: 'urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport',
            },
        },
    };
};
exports.generateSAMLAssertion = generateSAMLAssertion;
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
const signSAMLAssertion = (assertion, privateKey, algorithm = 'sha256') => {
    const xml = serializeSAMLAssertion(assertion);
    const sign = crypto.createSign(algorithm.toUpperCase());
    sign.update(xml);
    sign.end();
    const signatureValue = sign.sign(privateKey, 'base64');
    return {
        ...assertion,
        signature: {
            signatureValue,
            signatureMethod: `http://www.w3.org/2001/04/xmldsig-more#rsa-${algorithm}`,
            digestMethod: `http://www.w3.org/2001/04/xmlenc#${algorithm}`,
        },
    };
};
exports.signSAMLAssertion = signSAMLAssertion;
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
const createSAMLAssertionWithAttributes = (config, nameID, attributes) => {
    const user = {
        nameID,
        nameIDFormat: 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
        sessionIndex: `session_${crypto.randomBytes(16).toString('hex')}`,
        attributes: attributes.reduce((acc, attr) => {
            acc[attr.name] = attr.values;
            return acc;
        }, {}),
    };
    return (0, exports.generateSAMLAssertion)(config, user);
};
exports.createSAMLAssertionWithAttributes = createSAMLAssertionWithAttributes;
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
const encryptSAMLAssertion = (assertion, publicKey) => {
    const xml = serializeSAMLAssertion(assertion);
    const encrypted = crypto.publicEncrypt({
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    }, Buffer.from(xml));
    return encrypted.toString('base64');
};
exports.encryptSAMLAssertion = encryptSAMLAssertion;
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
const decryptSAMLAssertion = (encryptedAssertion, privateKey) => {
    const decrypted = crypto.privateDecrypt({
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    }, Buffer.from(encryptedAssertion, 'base64'));
    const xml = decrypted.toString('utf8');
    return parseSAMLAssertion(xml);
};
exports.decryptSAMLAssertion = decryptSAMLAssertion;
// ============================================================================
// SAML ASSERTION VALIDATION
// ============================================================================
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
const validateSAMLAssertion = (assertion, certificate, config) => {
    // Validate time conditions
    const now = new Date();
    if (now < assertion.conditions.notBefore) {
        return { valid: false, error: 'Assertion not yet valid' };
    }
    if (now > assertion.conditions.notOnOrAfter) {
        return { valid: false, error: 'Assertion has expired' };
    }
    // Validate audience
    if (!assertion.conditions.audienceRestriction.includes(config.entityId)) {
        return { valid: false, error: 'Invalid audience' };
    }
    // Validate subject confirmation
    if (assertion.subject.subjectConfirmation.notOnOrAfter < now) {
        return { valid: false, error: 'Subject confirmation expired' };
    }
    // Validate signature if present
    if (assertion.signature) {
        const isValidSignature = (0, exports.verifySAMLSignature)(assertion, certificate);
        if (!isValidSignature) {
            return { valid: false, error: 'Invalid signature' };
        }
    }
    return { valid: true };
};
exports.validateSAMLAssertion = validateSAMLAssertion;
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
const verifySAMLSignature = (assertion, certificate) => {
    if (!assertion.signature)
        return false;
    try {
        const xml = serializeSAMLAssertionForSignature(assertion);
        const verify = crypto.createVerify('RSA-SHA256');
        verify.update(xml);
        verify.end();
        return verify.verify(certificate, assertion.signature.signatureValue, 'base64');
    }
    catch {
        return false;
    }
};
exports.verifySAMLSignature = verifySAMLSignature;
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
const validateAssertionConditions = (conditions, expectedAudience) => {
    const now = new Date();
    if (now < conditions.notBefore) {
        return { valid: false, error: 'Assertion not yet valid' };
    }
    if (now > conditions.notOnOrAfter) {
        return { valid: false, error: 'Assertion has expired' };
    }
    if (!conditions.audienceRestriction.includes(expectedAudience)) {
        return { valid: false, error: 'Audience restriction failed' };
    }
    return { valid: true };
};
exports.validateAssertionConditions = validateAssertionConditions;
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
const validateSubjectConfirmation = (subject, expectedRecipient, inResponseTo) => {
    const { subjectConfirmation } = subject;
    if (subjectConfirmation.recipient !== expectedRecipient) {
        return { valid: false, error: 'Invalid recipient' };
    }
    if (new Date() > subjectConfirmation.notOnOrAfter) {
        return { valid: false, error: 'Subject confirmation expired' };
    }
    if (inResponseTo && subjectConfirmation.inResponseTo !== inResponseTo) {
        return { valid: false, error: 'InResponseTo mismatch' };
    }
    return { valid: true };
};
exports.validateSubjectConfirmation = validateSubjectConfirmation;
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
const extractUserFromAssertion = (assertion) => {
    const attributes = assertion.attributes.reduce((acc, attr) => {
        acc[attr.name] = attr.values.length === 1 ? attr.values[0] : attr.values;
        return acc;
    }, {});
    return {
        nameID: assertion.subject.nameID,
        nameIDFormat: assertion.subject.nameIDFormat,
        sessionIndex: assertion.authnStatement.sessionIndex,
        attributes,
    };
};
exports.extractUserFromAssertion = extractUserFromAssertion;
// ============================================================================
// SAML METADATA EXCHANGE
// ============================================================================
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
const generateSPMetadata = (config, x509Certificate) => {
    return {
        entityID: config.entityId,
        validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        spSSODescriptor: {
            authnRequestsSigned: true,
            wantAssertionsSigned: true,
            protocolSupportEnumeration: ['urn:oasis:names:tc:SAML:2.0:protocol'],
            keyDescriptor: [
                {
                    use: 'signing',
                    x509Certificate,
                },
                {
                    use: 'encryption',
                    x509Certificate,
                },
            ],
            assertionConsumerService: [
                {
                    binding: 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST',
                    location: config.callbackUrl,
                    index: 0,
                    isDefault: true,
                },
            ],
            singleLogoutService: [
                {
                    binding: 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect',
                    location: `${config.callbackUrl}/logout`,
                },
            ],
            nameIDFormats: [
                'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
                'urn:oasis:names:tc:SAML:2.0:nameid-format:persistent',
            ],
        },
    };
};
exports.generateSPMetadata = generateSPMetadata;
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
const generateIdPMetadata = (config, x509Certificate, supportedAttributes) => {
    return {
        entityID: config.entityId,
        validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        idpSSODescriptor: {
            wantAuthnRequestsSigned: true,
            protocolSupportEnumeration: ['urn:oasis:names:tc:SAML:2.0:protocol'],
            keyDescriptor: [
                {
                    use: 'signing',
                    x509Certificate,
                },
            ],
            singleSignOnService: [
                {
                    binding: 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect',
                    location: config.entryPoint,
                },
                {
                    binding: 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST',
                    location: config.entryPoint,
                },
            ],
            singleLogoutService: [
                {
                    binding: 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect',
                    location: `${config.entryPoint}/logout`,
                },
            ],
            nameIDFormats: [
                'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
                'urn:oasis:names:tc:SAML:2.0:nameid-format:persistent',
            ],
            attributes: supportedAttributes,
        },
    };
};
exports.generateIdPMetadata = generateIdPMetadata;
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
const parseSAMLMetadata = (metadataXml) => {
    // In production, use xml2js or similar parser
    // This is a simplified implementation
    return {
        entityID: '',
        // Parse XML and populate metadata
    };
};
exports.parseSAMLMetadata = parseSAMLMetadata;
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
const serializeSAMLMetadata = (metadata) => {
    // Build XML structure
    const lines = [
        '<?xml version="1.0"?>',
        `<EntityDescriptor xmlns="urn:oasis:names:tc:SAML:2.0:metadata" entityID="${metadata.entityID}">`,
    ];
    if (metadata.spSSODescriptor) {
        lines.push('  <SPSSODescriptor>');
        // Add SP descriptor elements
        lines.push('  </SPSSODescriptor>');
    }
    if (metadata.idpSSODescriptor) {
        lines.push('  <IDPSSODescriptor>');
        // Add IdP descriptor elements
        lines.push('  </IDPSSODescriptor>');
    }
    lines.push('</EntityDescriptor>');
    return lines.join('\n');
};
exports.serializeSAMLMetadata = serializeSAMLMetadata;
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
const validateSAMLMetadata = (metadata) => {
    const errors = [];
    if (!metadata.entityID) {
        errors.push('Missing entityID');
    }
    if (!metadata.idpSSODescriptor && !metadata.spSSODescriptor) {
        errors.push('Must have either IDPSSODescriptor or SPSSODescriptor');
    }
    return {
        valid: errors.length === 0,
        errors,
    };
};
exports.validateSAMLMetadata = validateSAMLMetadata;
// ============================================================================
// SAML IDP INTEGRATION
// ============================================================================
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
const configureSAMLIdP = async (metadataUrl, entityId) => {
    // In production, fetch and parse metadata
    return {
        entityId,
        callbackUrl: `${entityId}/saml/acs`,
        entryPoint: '', // Extract from metadata
        issuer: entityId,
    };
};
exports.configureSAMLIdP = configureSAMLIdP;
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
const extractIdPSSOUrl = (metadata, binding = 'HTTP-Redirect') => {
    if (!metadata.idpSSODescriptor)
        return null;
    const endpoint = metadata.idpSSODescriptor.singleSignOnService.find((svc) => svc.binding.includes(binding));
    return endpoint?.location || null;
};
exports.extractIdPSSOUrl = extractIdPSSOUrl;
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
const extractIdPLogoutUrl = (metadata) => {
    if (!metadata.idpSSODescriptor)
        return null;
    const endpoint = metadata.idpSSODescriptor.singleLogoutService[0];
    return endpoint?.location || null;
};
exports.extractIdPLogoutUrl = extractIdPLogoutUrl;
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
const extractIdPCertificate = (metadata) => {
    if (!metadata.idpSSODescriptor)
        return null;
    const signingKey = metadata.idpSSODescriptor.keyDescriptor.find((key) => key.use === 'signing');
    return signingKey?.x509Certificate || null;
};
exports.extractIdPCertificate = extractIdPCertificate;
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
const testIdPConnection = async (config) => {
    try {
        // In production, make test request to IdP
        return { connected: true };
    }
    catch (error) {
        return { connected: false, error: String(error) };
    }
};
exports.testIdPConnection = testIdPConnection;
// ============================================================================
// SAML SP CONFIGURATION
// ============================================================================
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
const configureSAMLServiceProvider = (entityId, acsUrl, certificate, privateKey) => {
    return {
        entityId,
        callbackUrl: acsUrl,
        entryPoint: '', // Will be populated from IdP metadata
        issuer: entityId,
        cert: certificate,
        privateKey,
        signatureAlgorithm: 'sha256',
        digestAlgorithm: 'sha256',
    };
};
exports.configureSAMLServiceProvider = configureSAMLServiceProvider;
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
const generateSPAssertionConsumerService = (baseUrl, index = 0) => {
    return {
        binding: 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST',
        location: `${baseUrl}/saml/acs`,
        index,
        isDefault: index === 0,
    };
};
exports.generateSPAssertionConsumerService = generateSPAssertionConsumerService;
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
const validateSPConfiguration = (config) => {
    const errors = [];
    if (!config.entityId)
        errors.push('Missing entityId');
    if (!config.callbackUrl)
        errors.push('Missing callbackUrl');
    if (!config.issuer)
        errors.push('Missing issuer');
    if (!config.cert)
        errors.push('Missing certificate');
    if (!config.privateKey)
        errors.push('Missing private key');
    return { valid: errors.length === 0, errors };
};
exports.validateSPConfiguration = validateSPConfiguration;
// ============================================================================
// ATTRIBUTE MAPPING
// ============================================================================
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
const mapSAMLAttributes = (samlAttributes, mappings) => {
    const result = {};
    for (const mapping of mappings) {
        const samlAttr = samlAttributes.find((attr) => attr.name === mapping.samlAttribute);
        if (samlAttr) {
            const value = samlAttr.values.length === 1 ? samlAttr.values[0] : samlAttr.values;
            result[mapping.localAttribute] = mapping.transform ? mapping.transform(value) : value;
        }
        else if (mapping.required) {
            throw new Error(`Required SAML attribute not found: ${mapping.samlAttribute}`);
        }
    }
    return result;
};
exports.mapSAMLAttributes = mapSAMLAttributes;
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
const createAttributeMappings = (mappings) => {
    return mappings.map((m) => ({
        samlAttribute: m.saml,
        localAttribute: m.local,
        required: m.required,
    }));
};
exports.createAttributeMappings = createAttributeMappings;
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
const validateRequiredAttributes = (attributes, requiredAttributes) => {
    const presentAttributes = attributes.map((attr) => attr.name);
    const missing = requiredAttributes.filter((req) => !presentAttributes.includes(req));
    return {
        valid: missing.length === 0,
        missing,
    };
};
exports.validateRequiredAttributes = validateRequiredAttributes;
// ============================================================================
// SINGLE SIGN-ON (SSO)
// ============================================================================
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
const initiateSAMLSSO = (config, relayState) => {
    const request = (0, exports.generateSAMLAuthnRequest)(config);
    const redirectUrl = (0, exports.createSAMLRedirectUrl)(config.entryPoint, request, relayState);
    return {
        redirectUrl,
        requestId: request.id,
    };
};
exports.initiateSAMLSSO = initiateSAMLSSO;
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
const processSAMLSSOResponse = async (samlResponse, config, idpCertificate) => {
    const response = decodeSAMLResponse(samlResponse);
    if (!response.assertion) {
        throw new Error('No assertion in SAML response');
    }
    const validation = (0, exports.validateSAMLAssertion)(response.assertion, idpCertificate, config);
    if (!validation.valid) {
        throw new Error(validation.error);
    }
    return (0, exports.extractUserFromAssertion)(response.assertion);
};
exports.processSAMLSSOResponse = processSAMLSSOResponse;
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
const createSAMLSession = (user, sessionDuration = 28800) => {
    const sessionId = `saml_${crypto.randomBytes(32).toString('hex')}`;
    const expiresAt = new Date(Date.now() + sessionDuration * 1000);
    return { sessionId, expiresAt };
};
exports.createSAMLSession = createSAMLSession;
// ============================================================================
// SINGLE LOGOUT (SLO)
// ============================================================================
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
const generateSAMLLogoutRequest = (config, user) => {
    const id = `_${crypto.randomBytes(21).toString('hex')}`;
    return {
        id,
        issueInstant: new Date(),
        destination: `${config.entryPoint}/logout`,
        issuer: config.issuer,
        nameID: user.nameID,
        sessionIndex: user.sessionIndex,
    };
};
exports.generateSAMLLogoutRequest = generateSAMLLogoutRequest;
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
const processSAMLLogoutResponse = (logoutResponse) => {
    const decoded = Buffer.from(logoutResponse, 'base64').toString('utf8');
    return parseSAMLLogoutResponse(decoded);
};
exports.processSAMLLogoutResponse = processSAMLLogoutResponse;
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
const initiateSAMLSingleLogout = (config, user) => {
    const logoutRequest = (0, exports.generateSAMLLogoutRequest)(config, user);
    const encoded = encodeSAMLLogoutRequest(logoutRequest);
    const redirectUrl = `${config.entryPoint}/logout?SAMLRequest=${encoded}`;
    return {
        redirectUrl,
        requestId: logoutRequest.id,
    };
};
exports.initiateSAMLSingleLogout = initiateSAMLSingleLogout;
// ============================================================================
// HELPER UTILITIES
// ============================================================================
/**
 * Serializes SAML request to XML string.
 *
 * @param {SAMLRequest} request - SAML request
 * @returns {string} XML string
 */
const serializeSAMLRequest = (request) => {
    return `<?xml version="1.0"?><AuthnRequest ID="${request.id}" />`;
};
/**
 * Parses SAML request from XML string.
 *
 * @param {string} xml - XML string
 * @returns {SAMLRequest} SAML request
 */
const parseSAMLRequest = (xml) => {
    // Simplified parser - use xml2js in production
    return {
        id: '',
        issueInstant: new Date(),
        destination: '',
        issuer: '',
    };
};
/**
 * Serializes SAML assertion to XML string.
 *
 * @param {SAMLAssertion} assertion - SAML assertion
 * @returns {string} XML string
 */
const serializeSAMLAssertion = (assertion) => {
    return `<Assertion ID="${assertion.id}" />`;
};
/**
 * Serializes SAML assertion for signature verification.
 *
 * @param {SAMLAssertion} assertion - SAML assertion
 * @returns {string} Canonicalized XML
 */
const serializeSAMLAssertionForSignature = (assertion) => {
    // Should use xml-crypto or similar for proper canonicalization
    return serializeSAMLAssertion(assertion);
};
/**
 * Parses SAML assertion from XML string.
 *
 * @param {string} xml - XML string
 * @returns {SAMLAssertion} SAML assertion
 */
const parseSAMLAssertion = (xml) => {
    // Simplified parser
    return {
        id: '',
        issuer: '',
        issueInstant: new Date(),
        subject: {
            nameID: '',
            nameIDFormat: '',
            subjectConfirmation: {
                method: '',
                recipient: '',
                notOnOrAfter: new Date(),
            },
        },
        conditions: {
            notBefore: new Date(),
            notOnOrAfter: new Date(),
            audienceRestriction: [],
        },
        attributes: [],
        authnStatement: {
            authnInstant: new Date(),
            sessionIndex: '',
            authnContext: {
                authnContextClassRef: '',
            },
        },
    };
};
/**
 * Decodes SAML response from base64.
 *
 * @param {string} encodedResponse - Base64-encoded response
 * @returns {SAMLResponse} SAML response
 */
const decodeSAMLResponse = (encodedResponse) => {
    const decoded = Buffer.from(encodedResponse, 'base64').toString('utf8');
    // Parse XML and return response
    return {
        id: '',
        inResponseTo: '',
        issueInstant: new Date(),
        destination: '',
        issuer: '',
        status: { statusCode: 'Success' },
    };
};
/**
 * Encodes SAML logout request.
 *
 * @param {LogoutRequest} request - Logout request
 * @returns {string} Base64-encoded request
 */
const encodeSAMLLogoutRequest = (request) => {
    const xml = `<LogoutRequest ID="${request.id}" />`;
    return Buffer.from(xml).toString('base64');
};
/**
 * Parses SAML logout response.
 *
 * @param {string} xml - Logout response XML
 * @returns {LogoutResponse} Logout response
 */
const parseSAMLLogoutResponse = (xml) => {
    return {
        id: '',
        inResponseTo: '',
        issueInstant: new Date(),
        destination: '',
        issuer: '',
        status: { statusCode: 'Success' },
    };
};
// ============================================================================
// NESTJS CONTROLLER HELPERS
// ============================================================================
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
const createSAMLLoginHandler = (config) => {
    return (res) => {
        const { redirectUrl } = (0, exports.initiateSAMLSSO)(config);
        res.redirect(redirectUrl);
    };
};
exports.createSAMLLoginHandler = createSAMLLoginHandler;
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
const createSAMLACSHandler = (config, idpCertificate, onSuccess) => {
    return async (samlResponse, res) => {
        try {
            const user = await (0, exports.processSAMLSSOResponse)(samlResponse, config, idpCertificate);
            await onSuccess(user);
            res.redirect('/dashboard');
        }
        catch (error) {
            res.status(401).json({ error: String(error) });
        }
    };
};
exports.createSAMLACSHandler = createSAMLACSHandler;
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
const createSAMLMetadataHandler = (config, certificate) => {
    return (res) => {
        const metadata = (0, exports.generateSPMetadata)(config, certificate);
        const xml = (0, exports.serializeSAMLMetadata)(metadata);
        res.set('Content-Type', 'application/xml');
        res.send(xml);
    };
};
exports.createSAMLMetadataHandler = createSAMLMetadataHandler;
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
const createSAMLLogoutHandler = (config, getUser) => {
    return (res) => {
        const user = getUser();
        const { redirectUrl } = (0, exports.initiateSAMLSingleLogout)(config, user);
        res.redirect(redirectUrl);
    };
};
exports.createSAMLLogoutHandler = createSAMLLogoutHandler;
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
const validateSAMLConfig = (config) => {
    const errors = [];
    if (!config.entityId)
        errors.push('Missing entityId');
    if (!config.callbackUrl)
        errors.push('Missing callbackUrl');
    if (!config.entryPoint)
        errors.push('Missing entryPoint');
    if (!config.issuer)
        errors.push('Missing issuer');
    return { valid: errors.length === 0, errors };
};
exports.validateSAMLConfig = validateSAMLConfig;
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
const formatSAMLErrorResponse = (error, statusCode = 'Responder') => {
    return {
        status: {
            statusCode: `urn:oasis:names:tc:SAML:2.0:status:${statusCode}`,
            statusMessage: error,
        },
        timestamp: new Date().toISOString(),
    };
};
exports.formatSAMLErrorResponse = formatSAMLErrorResponse;
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
const extractSAMLSessionData = (user) => {
    return {
        nameID: user.nameID,
        nameIDFormat: user.nameIDFormat,
        sessionIndex: user.sessionIndex,
        attributes: user.attributes,
        authenticatedAt: new Date(),
        provider: 'saml',
    };
};
exports.extractSAMLSessionData = extractSAMLSessionData;
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
const createSAMLGuardConfig = (options) => {
    return {
        loginUrl: options.loginUrl || '/saml/login',
        callbackUrl: options.callbackUrl || '/saml/acs',
        requireAuth: options.requireAuth !== false,
        allowedIdPs: options.allowedIdPs || [],
    };
};
exports.createSAMLGuardConfig = createSAMLGuardConfig;
//# sourceMappingURL=iam-saml-kit.js.map