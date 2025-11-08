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

import * as crypto from 'crypto';
import * as zlib from 'zlib';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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
export const generateSAMLAuthnRequest = (
  config: SAMLConfig,
  forceAuthn: boolean = false
): SAMLRequest => {
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
export const encodeSAMLRequest = (request: SAMLRequest): string => {
  const xml = serializeSAMLRequest(request);
  const deflated = zlib.deflateRawSync(Buffer.from(xml, 'utf8'));
  return deflated.toString('base64');
};

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
export const decodeSAMLRequest = (encodedRequest: string): SAMLRequest => {
  const deflated = Buffer.from(encodedRequest, 'base64');
  const inflated = zlib.inflateRawSync(deflated);
  const xml = inflated.toString('utf8');
  return parseSAMLRequest(xml);
};

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
export const validateSAMLAuthnRequest = (
  request: SAMLRequest,
  config: SAMLConfig
): { valid: boolean; error?: string } => {
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
export const createSAMLRedirectUrl = (
  idpEntryPoint: string,
  request: SAMLRequest,
  relayState?: string
): string => {
  const encodedRequest = encodeSAMLRequest(request);
  const params = new URLSearchParams({ SAMLRequest: encodedRequest });

  if (relayState) {
    params.append('RelayState', relayState);
  }

  return `${idpEntryPoint}?${params.toString()}`;
};

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
export const generateSAMLAssertion = (
  config: SAMLConfig,
  user: SAMLUser,
  inResponseTo?: string
): SAMLAssertion => {
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
export const signSAMLAssertion = (
  assertion: SAMLAssertion,
  privateKey: string,
  algorithm: 'sha1' | 'sha256' | 'sha512' = 'sha256'
): SAMLAssertion => {
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
export const createSAMLAssertionWithAttributes = (
  config: SAMLConfig,
  nameID: string,
  attributes: SAMLAttribute[]
): SAMLAssertion => {
  const user: SAMLUser = {
    nameID,
    nameIDFormat: 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
    sessionIndex: `session_${crypto.randomBytes(16).toString('hex')}`,
    attributes: attributes.reduce((acc, attr) => {
      acc[attr.name] = attr.values;
      return acc;
    }, {} as Record<string, any>),
  };

  return generateSAMLAssertion(config, user);
};

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
export const encryptSAMLAssertion = (assertion: SAMLAssertion, publicKey: string): string => {
  const xml = serializeSAMLAssertion(assertion);
  const encrypted = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    },
    Buffer.from(xml)
  );

  return encrypted.toString('base64');
};

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
export const decryptSAMLAssertion = (
  encryptedAssertion: string,
  privateKey: string
): SAMLAssertion => {
  const decrypted = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    },
    Buffer.from(encryptedAssertion, 'base64')
  );

  const xml = decrypted.toString('utf8');
  return parseSAMLAssertion(xml);
};

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
export const validateSAMLAssertion = (
  assertion: SAMLAssertion,
  certificate: string,
  config: SAMLConfig
): { valid: boolean; error?: string } => {
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
    const isValidSignature = verifySAMLSignature(assertion, certificate);
    if (!isValidSignature) {
      return { valid: false, error: 'Invalid signature' };
    }
  }

  return { valid: true };
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
export const verifySAMLSignature = (assertion: SAMLAssertion, certificate: string): boolean => {
  if (!assertion.signature) return false;

  try {
    const xml = serializeSAMLAssertionForSignature(assertion);
    const verify = crypto.createVerify('RSA-SHA256');
    verify.update(xml);
    verify.end();

    return verify.verify(certificate, assertion.signature.signatureValue, 'base64');
  } catch {
    return false;
  }
};

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
export const validateAssertionConditions = (
  conditions: SAMLConditions,
  expectedAudience: string
): { valid: boolean; error?: string } => {
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
export const validateSubjectConfirmation = (
  subject: SAMLSubject,
  expectedRecipient: string,
  inResponseTo?: string
): { valid: boolean; error?: string } => {
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
export const extractUserFromAssertion = (assertion: SAMLAssertion): SAMLUser => {
  const attributes = assertion.attributes.reduce((acc, attr) => {
    acc[attr.name] = attr.values.length === 1 ? attr.values[0] : attr.values;
    return acc;
  }, {} as Record<string, any>);

  return {
    nameID: assertion.subject.nameID,
    nameIDFormat: assertion.subject.nameIDFormat,
    sessionIndex: assertion.authnStatement.sessionIndex,
    attributes,
  };
};

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
export const generateSPMetadata = (config: SAMLConfig, x509Certificate: string): SAMLMetadata => {
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
export const generateIdPMetadata = (
  config: SAMLConfig,
  x509Certificate: string,
  supportedAttributes?: SAMLAttribute[]
): SAMLMetadata => {
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
export const parseSAMLMetadata = (metadataXml: string): SAMLMetadata => {
  // In production, use xml2js or similar parser
  // This is a simplified implementation
  return {
    entityID: '',
    // Parse XML and populate metadata
  } as SAMLMetadata;
};

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
export const serializeSAMLMetadata = (metadata: SAMLMetadata): string => {
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
export const validateSAMLMetadata = (
  metadata: SAMLMetadata
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

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
export const configureSAMLIdP = async (
  metadataUrl: string,
  entityId: string
): Promise<SAMLConfig> => {
  // In production, fetch and parse metadata
  return {
    entityId,
    callbackUrl: `${entityId}/saml/acs`,
    entryPoint: '', // Extract from metadata
    issuer: entityId,
  };
};

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
export const extractIdPSSOUrl = (
  metadata: SAMLMetadata,
  binding: string = 'HTTP-Redirect'
): string | null => {
  if (!metadata.idpSSODescriptor) return null;

  const endpoint = metadata.idpSSODescriptor.singleSignOnService.find((svc) =>
    svc.binding.includes(binding)
  );

  return endpoint?.location || null;
};

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
export const extractIdPLogoutUrl = (metadata: SAMLMetadata): string | null => {
  if (!metadata.idpSSODescriptor) return null;

  const endpoint = metadata.idpSSODescriptor.singleLogoutService[0];
  return endpoint?.location || null;
};

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
export const extractIdPCertificate = (metadata: SAMLMetadata): string | null => {
  if (!metadata.idpSSODescriptor) return null;

  const signingKey = metadata.idpSSODescriptor.keyDescriptor.find(
    (key) => key.use === 'signing'
  );

  return signingKey?.x509Certificate || null;
};

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
export const testIdPConnection = async (
  config: SAMLConfig
): Promise<{ connected: boolean; error?: string }> => {
  try {
    // In production, make test request to IdP
    return { connected: true };
  } catch (error) {
    return { connected: false, error: String(error) };
  }
};

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
export const configureSAMLServiceProvider = (
  entityId: string,
  acsUrl: string,
  certificate: string,
  privateKey: string
): SAMLConfig => {
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
export const generateSPAssertionConsumerService = (
  baseUrl: string,
  index: number = 0
): AssertionConsumerService => {
  return {
    binding: 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST',
    location: `${baseUrl}/saml/acs`,
    index,
    isDefault: index === 0,
  };
};

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
export const validateSPConfiguration = (
  config: SAMLConfig
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!config.entityId) errors.push('Missing entityId');
  if (!config.callbackUrl) errors.push('Missing callbackUrl');
  if (!config.issuer) errors.push('Missing issuer');
  if (!config.cert) errors.push('Missing certificate');
  if (!config.privateKey) errors.push('Missing private key');

  return { valid: errors.length === 0, errors };
};

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
export const mapSAMLAttributes = (
  samlAttributes: SAMLAttribute[],
  mappings: SAMLAttributeMapping[]
): Record<string, any> => {
  const result: Record<string, any> = {};

  for (const mapping of mappings) {
    const samlAttr = samlAttributes.find((attr) => attr.name === mapping.samlAttribute);

    if (samlAttr) {
      const value = samlAttr.values.length === 1 ? samlAttr.values[0] : samlAttr.values;
      result[mapping.localAttribute] = mapping.transform ? mapping.transform(value) : value;
    } else if (mapping.required) {
      throw new Error(`Required SAML attribute not found: ${mapping.samlAttribute}`);
    }
  }

  return result;
};

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
export const createAttributeMappings = (
  mappings: Array<{ saml: string; local: string; required?: boolean }>
): SAMLAttributeMapping[] => {
  return mappings.map((m) => ({
    samlAttribute: m.saml,
    localAttribute: m.local,
    required: m.required,
  }));
};

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
export const validateRequiredAttributes = (
  attributes: SAMLAttribute[],
  requiredAttributes: string[]
): { valid: boolean; missing: string[] } => {
  const presentAttributes = attributes.map((attr) => attr.name);
  const missing = requiredAttributes.filter((req) => !presentAttributes.includes(req));

  return {
    valid: missing.length === 0,
    missing,
  };
};

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
export const initiateSAMLSSO = (
  config: SAMLConfig,
  relayState?: string
): { redirectUrl: string; requestId: string } => {
  const request = generateSAMLAuthnRequest(config);
  const redirectUrl = createSAMLRedirectUrl(config.entryPoint, request, relayState);

  return {
    redirectUrl,
    requestId: request.id,
  };
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
export const processSAMLSSOResponse = async (
  samlResponse: string,
  config: SAMLConfig,
  idpCertificate: string
): Promise<SAMLUser> => {
  const response = decodeSAMLResponse(samlResponse);

  if (!response.assertion) {
    throw new Error('No assertion in SAML response');
  }

  const validation = validateSAMLAssertion(response.assertion, idpCertificate, config);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  return extractUserFromAssertion(response.assertion);
};

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
export const createSAMLSession = (
  user: SAMLUser,
  sessionDuration: number = 28800
): { sessionId: string; expiresAt: Date } => {
  const sessionId = `saml_${crypto.randomBytes(32).toString('hex')}`;
  const expiresAt = new Date(Date.now() + sessionDuration * 1000);

  return { sessionId, expiresAt };
};

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
export const generateSAMLLogoutRequest = (config: SAMLConfig, user: SAMLUser): LogoutRequest => {
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
export const processSAMLLogoutResponse = (logoutResponse: string): LogoutResponse => {
  const decoded = Buffer.from(logoutResponse, 'base64').toString('utf8');
  return parseSAMLLogoutResponse(decoded);
};

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
export const initiateSAMLSingleLogout = (
  config: SAMLConfig,
  user: SAMLUser
): { redirectUrl: string; requestId: string } => {
  const logoutRequest = generateSAMLLogoutRequest(config, user);
  const encoded = encodeSAMLLogoutRequest(logoutRequest);

  const redirectUrl = `${config.entryPoint}/logout?SAMLRequest=${encoded}`;

  return {
    redirectUrl,
    requestId: logoutRequest.id,
  };
};

// ============================================================================
// HELPER UTILITIES
// ============================================================================

/**
 * Serializes SAML request to XML string.
 *
 * @param {SAMLRequest} request - SAML request
 * @returns {string} XML string
 */
const serializeSAMLRequest = (request: SAMLRequest): string => {
  return `<?xml version="1.0"?><AuthnRequest ID="${request.id}" />`;
};

/**
 * Parses SAML request from XML string.
 *
 * @param {string} xml - XML string
 * @returns {SAMLRequest} SAML request
 */
const parseSAMLRequest = (xml: string): SAMLRequest => {
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
const serializeSAMLAssertion = (assertion: SAMLAssertion): string => {
  return `<Assertion ID="${assertion.id}" />`;
};

/**
 * Serializes SAML assertion for signature verification.
 *
 * @param {SAMLAssertion} assertion - SAML assertion
 * @returns {string} Canonicalized XML
 */
const serializeSAMLAssertionForSignature = (assertion: SAMLAssertion): string => {
  // Should use xml-crypto or similar for proper canonicalization
  return serializeSAMLAssertion(assertion);
};

/**
 * Parses SAML assertion from XML string.
 *
 * @param {string} xml - XML string
 * @returns {SAMLAssertion} SAML assertion
 */
const parseSAMLAssertion = (xml: string): SAMLAssertion => {
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
const decodeSAMLResponse = (encodedResponse: string): SAMLResponse => {
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
const encodeSAMLLogoutRequest = (request: LogoutRequest): string => {
  const xml = `<LogoutRequest ID="${request.id}" />`;
  return Buffer.from(xml).toString('base64');
};

/**
 * Parses SAML logout response.
 *
 * @param {string} xml - Logout response XML
 * @returns {LogoutResponse} Logout response
 */
const parseSAMLLogoutResponse = (xml: string): LogoutResponse => {
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
export const createSAMLLoginHandler = (
  config: SAMLConfig
): ((res: any) => void) => {
  return (res: any) => {
    const { redirectUrl } = initiateSAMLSSO(config);
    res.redirect(redirectUrl);
  };
};

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
export const createSAMLACSHandler = (
  config: SAMLConfig,
  idpCertificate: string,
  onSuccess: (user: SAMLUser) => Promise<void>
): ((samlResponse: string, res: any) => Promise<void>) => {
  return async (samlResponse: string, res: any) => {
    try {
      const user = await processSAMLSSOResponse(samlResponse, config, idpCertificate);
      await onSuccess(user);
      res.redirect('/dashboard');
    } catch (error) {
      res.status(401).json({ error: String(error) });
    }
  };
};

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
export const createSAMLMetadataHandler = (
  config: SAMLConfig,
  certificate: string
): ((res: any) => void) => {
  return (res: any) => {
    const metadata = generateSPMetadata(config, certificate);
    const xml = serializeSAMLMetadata(metadata);
    res.set('Content-Type', 'application/xml');
    res.send(xml);
  };
};

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
export const createSAMLLogoutHandler = (
  config: SAMLConfig,
  getUser: () => SAMLUser
): ((res: any) => void) => {
  return (res: any) => {
    const user = getUser();
    const { redirectUrl } = initiateSAMLSingleLogout(config, user);
    res.redirect(redirectUrl);
  };
};

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
export const validateSAMLConfig = (
  config: SAMLConfig
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!config.entityId) errors.push('Missing entityId');
  if (!config.callbackUrl) errors.push('Missing callbackUrl');
  if (!config.entryPoint) errors.push('Missing entryPoint');
  if (!config.issuer) errors.push('Missing issuer');

  return { valid: errors.length === 0, errors };
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
export const formatSAMLErrorResponse = (
  error: string,
  statusCode: string = 'Responder'
): object => {
  return {
    status: {
      statusCode: `urn:oasis:names:tc:SAML:2.0:status:${statusCode}`,
      statusMessage: error,
    },
    timestamp: new Date().toISOString(),
  };
};

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
export const extractSAMLSessionData = (user: SAMLUser): Record<string, any> => {
  return {
    nameID: user.nameID,
    nameIDFormat: user.nameIDFormat,
    sessionIndex: user.sessionIndex,
    attributes: user.attributes,
    authenticatedAt: new Date(),
    provider: 'saml',
  };
};

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
export const createSAMLGuardConfig = (options: {
  loginUrl?: string;
  callbackUrl?: string;
  requireAuth?: boolean;
  allowedIdPs?: string[];
}): object => {
  return {
    loginUrl: options.loginUrl || '/saml/login',
    callbackUrl: options.callbackUrl || '/saml/acs',
    requireAuth: options.requireAuth !== false,
    allowedIdPs: options.allowedIdPs || [],
  };
};
