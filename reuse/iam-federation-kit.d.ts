/**
 * LOC: IAM-FED-001
 * File: /reuse/iam-federation-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (v6.x)
 *   - @types/validator (v13.x)
 *   - xml2js (v0.6.x)
 *
 * DOWNSTREAM (imported by):
 *   - Federation authentication services
 *   - SAML/OAuth providers
 *   - Identity provider controllers
 *   - Just-in-time provisioning services
 */
/**
 * File: /reuse/iam-federation-kit.ts
 * Locator: WC-IAM-FED-001
 * Purpose: IAM Federation Kit - Comprehensive identity federation with external providers
 *
 * Upstream: sequelize v6.x, @types/validator, xml2js
 * Downstream: Federation services, SAML handlers, OAuth providers, IdP integration
 * Dependencies: Sequelize v6.x, Node 18+, TypeScript 5.x
 * Exports: 40 functions for identity federation, SAML, OAuth, attribute mapping, JIT provisioning
 *
 * LLM Context: Enterprise-grade identity federation utilities for White Cross healthcare platform.
 * Provides comprehensive support for SAML 2.0, WS-Federation, OpenID Connect, OAuth 2.0,
 * federated identity mapping, trust relationships, attribute mapping, and just-in-time provisioning.
 * HIPAA-compliant with secure credential exchange and audit trail for healthcare identity federation.
 */
import { Sequelize, ModelAttributes, QueryInterface, Transaction } from 'sequelize';
/**
 * Federation protocol types
 */
export declare enum FederationProtocol {
    SAML2 = "saml2",
    WS_FEDERATION = "ws_federation",
    OPENID_CONNECT = "openid_connect",
    OAUTH2 = "oauth2",
    LDAP = "ldap",
    CAS = "cas"
}
/**
 * Identity provider status
 */
export declare enum IdentityProviderStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    PENDING = "pending",
    SUSPENDED = "suspended",
    ERROR = "error"
}
/**
 * Federation trust level
 */
export declare enum TrustLevel {
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low",
    RESTRICTED = "restricted"
}
/**
 * Attribute mapping strategy
 */
export declare enum AttributeMappingStrategy {
    STATIC = "static",
    DYNAMIC = "dynamic",
    SCRIPT = "script",
    EXPRESSION = "expression"
}
/**
 * Just-in-time provisioning mode
 */
export declare enum JitProvisioningMode {
    DISABLED = "disabled",
    AUTO_CREATE = "auto_create",
    AUTO_LINK = "auto_link",
    AUTO_CREATE_AND_LINK = "auto_create_and_link"
}
/**
 * Identity provider configuration
 */
export interface IdentityProviderConfig {
    protocol: FederationProtocol;
    entityId?: string;
    ssoUrl?: string;
    sloUrl?: string;
    metadataUrl?: string;
    clientId?: string;
    clientSecret?: string;
    authorizationEndpoint?: string;
    tokenEndpoint?: string;
    userInfoEndpoint?: string;
    jwksUri?: string;
    issuer?: string;
    scopes?: string[];
    certificateFingerprint?: string;
    signingAlgorithm?: string;
    encryptionAlgorithm?: string;
    nameIdFormat?: string;
    allowUnencrypted?: boolean;
    forceAuthn?: boolean;
    customParams?: Record<string, any>;
}
/**
 * SAML metadata structure
 */
export interface SamlMetadata {
    entityId: string;
    ssoUrl: string;
    sloUrl?: string;
    certificate: string;
    certificateFingerprint: string;
    nameIdFormats: string[];
    attributes: string[];
    validUntil?: Date;
    cacheDuration?: number;
}
/**
 * Federation assertion data
 */
export interface FederationAssertion {
    protocol: FederationProtocol;
    issuer: string;
    subject: string;
    attributes: Record<string, any>;
    sessionIndex?: string;
    notBefore?: Date;
    notOnOrAfter?: Date;
    audience?: string;
    authnContext?: string;
    signature?: string;
    signatureAlgorithm?: string;
}
/**
 * Federated identity mapping
 */
export interface FederatedIdentityMapping {
    localUserId: string;
    identityProviderId: string;
    externalUserId: string;
    externalUsername?: string;
    externalEmail?: string;
    attributes?: Record<string, any>;
    linkedAt: Date;
    lastAuthenticated?: Date;
    authenticationCount?: number;
}
/**
 * Attribute mapping rule
 */
export interface AttributeMappingRule {
    sourceAttribute: string;
    targetAttribute: string;
    strategy: AttributeMappingStrategy;
    transformation?: string;
    defaultValue?: any;
    required?: boolean;
    validation?: string;
}
/**
 * Trust relationship configuration
 */
export interface TrustRelationshipConfig {
    identityProviderId: string;
    trustLevel: TrustLevel;
    allowedDomains?: string[];
    blockedDomains?: string[];
    allowedUserGroups?: string[];
    requiredAttributes?: string[];
    sessionDuration?: number;
    requireMfa?: boolean;
    ipWhitelist?: string[];
    metadata?: Record<string, any>;
}
/**
 * JIT provisioning configuration
 */
export interface JitProvisioningConfig {
    mode: JitProvisioningMode;
    defaultRole?: string;
    defaultGroups?: string[];
    attributeMappings: AttributeMappingRule[];
    requireEmailVerification?: boolean;
    autoActivate?: boolean;
    sendWelcomeEmail?: boolean;
    customProvisioningScript?: string;
}
/**
 * Federation audit event
 */
export interface FederationAuditEvent {
    identityProviderId: string;
    eventType: string;
    userId?: string;
    externalUserId?: string;
    success: boolean;
    errorMessage?: string;
    ipAddress?: string;
    userAgent?: string;
    metadata?: Record<string, any>;
    timestamp: Date;
}
/**
 * Defines IdentityProvider model attributes for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelAttributes} IdentityProvider model attributes
 *
 * @example
 * ```typescript
 * const IdentityProvider = sequelize.define('IdentityProvider', getIdentityProviderModelAttributes(sequelize));
 * ```
 */
export declare const getIdentityProviderModelAttributes: (sequelize: Sequelize) => ModelAttributes;
/**
 * Defines FederatedIdentity model for user-provider mappings.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelAttributes} FederatedIdentity model attributes
 */
export declare const getFederatedIdentityModelAttributes: (sequelize: Sequelize) => ModelAttributes;
/**
 * Defines TrustRelationship model attributes.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelAttributes} TrustRelationship model attributes
 */
export declare const getTrustRelationshipModelAttributes: (sequelize: Sequelize) => ModelAttributes;
/**
 * Defines AttributeMapping model attributes.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelAttributes} AttributeMapping model attributes
 */
export declare const getAttributeMappingModelAttributes: (sequelize: Sequelize) => ModelAttributes;
/**
 * Defines FederationAudit model for audit trail.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelAttributes} FederationAudit model attributes
 */
export declare const getFederationAuditModelAttributes: (sequelize: Sequelize) => ModelAttributes;
/**
 * Creates IdentityProvider table migration.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<void>}
 */
export declare const createIdentityProviderTable: (queryInterface: QueryInterface, sequelize: Sequelize) => Promise<void>;
/**
 * Creates FederatedIdentity table migration.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<void>}
 */
export declare const createFederatedIdentityTable: (queryInterface: QueryInterface, sequelize: Sequelize) => Promise<void>;
/**
 * Registers a new identity provider.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} providerData - Provider registration data
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Created identity provider
 *
 * @example
 * ```typescript
 * const provider = await registerIdentityProvider(sequelize, {
 *   name: 'Corporate SAML',
 *   slug: 'corporate-saml',
 *   protocol: FederationProtocol.SAML2,
 *   config: { entityId: 'https://idp.example.com', ssoUrl: 'https://idp.example.com/sso' }
 * });
 * ```
 */
export declare const registerIdentityProvider: (sequelize: Sequelize, providerData: {
    name: string;
    slug: string;
    protocol: FederationProtocol;
    config: IdentityProviderConfig;
    certificate?: string;
}, transaction?: Transaction) => Promise<any>;
/**
 * Retrieves identity provider by ID.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} providerId - Provider ID
 * @returns {Promise<any>} Identity provider instance
 */
export declare const getIdentityProviderById: (sequelize: Sequelize, providerId: string) => Promise<any>;
/**
 * Retrieves identity provider by slug.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} slug - Provider slug
 * @returns {Promise<any>} Identity provider instance
 */
export declare const getIdentityProviderBySlug: (sequelize: Sequelize, slug: string) => Promise<any>;
/**
 * Updates identity provider configuration.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} providerId - Provider ID
 * @param {Partial<IdentityProviderConfig>} config - Configuration updates
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Updated provider
 */
export declare const updateIdentityProviderConfig: (sequelize: Sequelize, providerId: string, config: Partial<IdentityProviderConfig>, transaction?: Transaction) => Promise<any>;
/**
 * Activates an identity provider.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} providerId - Provider ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Activated provider
 */
export declare const activateIdentityProvider: (sequelize: Sequelize, providerId: string, transaction?: Transaction) => Promise<any>;
/**
 * Deactivates an identity provider.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} providerId - Provider ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Deactivated provider
 */
export declare const deactivateIdentityProvider: (sequelize: Sequelize, providerId: string, transaction?: Transaction) => Promise<any>;
/**
 * Lists all identity providers with filtering.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} filters - Filter options
 * @returns {Promise<any[]>} Array of providers
 */
export declare const listIdentityProviders: (sequelize: Sequelize, filters?: {
    protocol?: FederationProtocol;
    status?: IdentityProviderStatus;
}) => Promise<any[]>;
/**
 * Links federated identity to local user.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} mappingData - Identity mapping data
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Created federated identity mapping
 *
 * @example
 * ```typescript
 * const mapping = await linkFederatedIdentity(sequelize, {
 *   localUserId: 'local-user-123',
 *   identityProviderId: 'idp-456',
 *   externalUserId: 'external-789',
 *   externalEmail: 'user@example.com',
 *   attributes: { department: 'Engineering' }
 * });
 * ```
 */
export declare const linkFederatedIdentity: (sequelize: Sequelize, mappingData: {
    localUserId: string;
    identityProviderId: string;
    externalUserId: string;
    externalUsername?: string;
    externalEmail?: string;
    attributes?: Record<string, any>;
}, transaction?: Transaction) => Promise<any>;
/**
 * Retrieves federated identity by external user ID.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} identityProviderId - Provider ID
 * @param {string} externalUserId - External user ID
 * @returns {Promise<any>} Federated identity mapping
 */
export declare const getFederatedIdentityByExternalId: (sequelize: Sequelize, identityProviderId: string, externalUserId: string) => Promise<any>;
/**
 * Retrieves all federated identities for a local user.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} localUserId - Local user ID
 * @returns {Promise<any[]>} Array of federated identities
 */
export declare const getFederatedIdentitiesForUser: (sequelize: Sequelize, localUserId: string) => Promise<any[]>;
/**
 * Unlinks federated identity from local user.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} federatedIdentityId - Federated identity ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<void>}
 */
export declare const unlinkFederatedIdentity: (sequelize: Sequelize, federatedIdentityId: string, transaction?: Transaction) => Promise<void>;
/**
 * Updates federated identity attributes.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} federatedIdentityId - Federated identity ID
 * @param {Record<string, any>} attributes - Updated attributes
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Updated federated identity
 */
export declare const updateFederatedIdentityAttributes: (sequelize: Sequelize, federatedIdentityId: string, attributes: Record<string, any>, transaction?: Transaction) => Promise<any>;
/**
 * Records federated authentication event.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} federatedIdentityId - Federated identity ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Updated federated identity
 */
export declare const recordFederatedAuthentication: (sequelize: Sequelize, federatedIdentityId: string, transaction?: Transaction) => Promise<any>;
/**
 * Establishes trust relationship with identity provider.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {TrustRelationshipConfig} trustConfig - Trust configuration
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Created trust relationship
 */
export declare const establishTrustRelationship: (sequelize: Sequelize, trustConfig: TrustRelationshipConfig, transaction?: Transaction) => Promise<any>;
/**
 * Retrieves trust relationship for identity provider.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} identityProviderId - Provider ID
 * @returns {Promise<any>} Trust relationship
 */
export declare const getTrustRelationship: (sequelize: Sequelize, identityProviderId: string) => Promise<any>;
/**
 * Updates trust relationship configuration.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} identityProviderId - Provider ID
 * @param {Partial<TrustRelationshipConfig>} updates - Configuration updates
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Updated trust relationship
 */
export declare const updateTrustRelationship: (sequelize: Sequelize, identityProviderId: string, updates: Partial<TrustRelationshipConfig>, transaction?: Transaction) => Promise<any>;
/**
 * Validates trust for federated authentication.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} identityProviderId - Provider ID
 * @param {object} context - Authentication context
 * @returns {Promise<boolean>} True if trust validated
 */
export declare const validateTrust: (sequelize: Sequelize, identityProviderId: string, context: {
    email?: string;
    userGroups?: string[];
    attributes?: Record<string, any>;
    ipAddress?: string;
}) => Promise<boolean>;
/**
 * Generates SAML metadata for service provider.
 *
 * @param {object} config - SP configuration
 * @returns {string} SAML metadata XML
 */
export declare const generateSamlMetadata: (config: {
    entityId: string;
    acsUrl: string;
    sloUrl?: string;
    certificate: string;
    nameIdFormats?: string[];
}) => string;
/**
 * Parses SAML assertion from identity provider.
 *
 * @param {string} samlResponse - Base64-encoded SAML response
 * @returns {Promise<FederationAssertion>} Parsed assertion
 */
export declare const parseSamlAssertion: (samlResponse: string) => Promise<FederationAssertion>;
/**
 * Validates SAML assertion signature.
 *
 * @param {string} samlResponse - SAML response
 * @param {string} certificate - Public certificate
 * @returns {boolean} True if signature valid
 */
export declare const validateSamlSignature: (samlResponse: string, certificate: string) => boolean;
/**
 * Generates OpenID Connect authorization URL.
 *
 * @param {IdentityProviderConfig} config - OIDC configuration
 * @param {object} params - Authorization parameters
 * @returns {string} Authorization URL
 */
export declare const generateOidcAuthorizationUrl: (config: IdentityProviderConfig, params: {
    redirectUri: string;
    state: string;
    nonce: string;
    scope?: string[];
}) => string;
/**
 * Exchanges OIDC authorization code for tokens.
 *
 * @param {IdentityProviderConfig} config - OIDC configuration
 * @param {string} code - Authorization code
 * @param {string} redirectUri - Redirect URI
 * @returns {Promise<any>} Token response
 */
export declare const exchangeOidcCode: (config: IdentityProviderConfig, code: string, redirectUri: string) => Promise<any>;
/**
 * Validates OpenID Connect ID token.
 *
 * @param {string} idToken - ID token JWT
 * @param {IdentityProviderConfig} config - OIDC configuration
 * @returns {Promise<any>} Decoded token payload
 */
export declare const validateOidcIdToken: (idToken: string, config: IdentityProviderConfig) => Promise<any>;
/**
 * Creates attribute mapping rule.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} identityProviderId - Provider ID
 * @param {AttributeMappingRule} rule - Mapping rule
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Created mapping
 */
export declare const createAttributeMapping: (sequelize: Sequelize, identityProviderId: string, rule: AttributeMappingRule, transaction?: Transaction) => Promise<any>;
/**
 * Retrieves attribute mappings for identity provider.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} identityProviderId - Provider ID
 * @returns {Promise<any[]>} Array of attribute mappings
 */
export declare const getAttributeMappings: (sequelize: Sequelize, identityProviderId: string) => Promise<any[]>;
/**
 * Applies attribute mappings to federated attributes.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} identityProviderId - Provider ID
 * @param {Record<string, any>} externalAttributes - External attributes
 * @returns {Promise<Record<string, any>>} Mapped attributes
 */
export declare const applyAttributeMappings: (sequelize: Sequelize, identityProviderId: string, externalAttributes: Record<string, any>) => Promise<Record<string, any>>;
/**
 * Validates mapped attributes against rules.
 *
 * @param {any[]} mappings - Attribute mappings
 * @param {Record<string, any>} attributes - Attributes to validate
 * @returns {boolean} True if valid
 */
export declare const validateMappedAttributes: (mappings: any[], attributes: Record<string, any>) => boolean;
/**
 * Provisions user just-in-time from federated assertion.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} identityProviderId - Provider ID
 * @param {FederationAssertion} assertion - Federated assertion
 * @param {JitProvisioningConfig} config - JIT configuration
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Provisioned or linked user
 */
export declare const provisionUserJIT: (sequelize: Sequelize, identityProviderId: string, assertion: FederationAssertion, config: JitProvisioningConfig, transaction?: Transaction) => Promise<any>;
/**
 * Configures JIT provisioning for identity provider.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} identityProviderId - Provider ID
 * @param {JitProvisioningConfig} config - JIT configuration
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Updated provider
 */
export declare const configureJitProvisioning: (sequelize: Sequelize, identityProviderId: string, config: JitProvisioningConfig, transaction?: Transaction) => Promise<any>;
/**
 * Calculates certificate fingerprint.
 *
 * @param {string} certificate - PEM-encoded certificate
 * @returns {string} SHA-256 fingerprint
 */
export declare const calculateCertificateFingerprint: (certificate: string) => string;
/**
 * Validates certificate trust.
 *
 * @param {string} certificate - Certificate to validate
 * @param {string} trustedFingerprint - Trusted fingerprint
 * @returns {boolean} True if certificate trusted
 */
export declare const validateCertificateTrust: (certificate: string, trustedFingerprint: string) => boolean;
/**
 * Audits federation event.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {FederationAuditEvent} event - Audit event
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Created audit record
 */
export declare const auditFederationEvent: (sequelize: Sequelize, event: FederationAuditEvent, transaction?: Transaction) => Promise<any>;
/**
 * Retrieves federation audit logs.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} filters - Filter options
 * @param {object} pagination - Pagination options
 * @returns {Promise<any>} Audit logs
 */
export declare const getFederationAuditLogs: (sequelize: Sequelize, filters?: {
    identityProviderId?: string;
    eventType?: string;
    userId?: string;
    success?: boolean;
    startDate?: Date;
    endDate?: Date;
}, pagination?: {
    page?: number;
    limit?: number;
}) => Promise<any>;
/**
 * Generates federation analytics report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} identityProviderId - Provider ID
 * @param {object} period - Time period
 * @returns {Promise<any>} Analytics report
 */
export declare const generateFederationAnalytics: (sequelize: Sequelize, identityProviderId: string, period: {
    startDate: Date;
    endDate: Date;
}) => Promise<any>;
//# sourceMappingURL=iam-federation-kit.d.ts.map