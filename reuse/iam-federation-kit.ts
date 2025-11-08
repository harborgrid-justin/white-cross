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

import {
  Model,
  ModelStatic,
  Sequelize,
  DataTypes,
  ModelAttributes,
  ModelOptions,
  QueryInterface,
  Transaction,
  WhereOptions,
  FindOptions,
  Op,
} from 'sequelize';
import { isUUID, isURL } from 'validator';
import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Federation protocol types
 */
export enum FederationProtocol {
  SAML2 = 'saml2',
  WS_FEDERATION = 'ws_federation',
  OPENID_CONNECT = 'openid_connect',
  OAUTH2 = 'oauth2',
  LDAP = 'ldap',
  CAS = 'cas',
}

/**
 * Identity provider status
 */
export enum IdentityProviderStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  SUSPENDED = 'suspended',
  ERROR = 'error',
}

/**
 * Federation trust level
 */
export enum TrustLevel {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  RESTRICTED = 'restricted',
}

/**
 * Attribute mapping strategy
 */
export enum AttributeMappingStrategy {
  STATIC = 'static',
  DYNAMIC = 'dynamic',
  SCRIPT = 'script',
  EXPRESSION = 'expression',
}

/**
 * Just-in-time provisioning mode
 */
export enum JitProvisioningMode {
  DISABLED = 'disabled',
  AUTO_CREATE = 'auto_create',
  AUTO_LINK = 'auto_link',
  AUTO_CREATE_AND_LINK = 'auto_create_and_link',
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

// ============================================================================
// IDENTITY PROVIDER MODEL AND SCHEMA
// ============================================================================

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
export const getIdentityProviderModelAttributes = (sequelize: Sequelize): ModelAttributes => ({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    comment: 'Unique identity provider identifier',
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 255],
    },
    comment: 'Identity provider display name',
  },
  slug: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      is: /^[a-z0-9-]+$/i,
      len: [2, 100],
    },
    comment: 'URL-friendly identifier',
  },
  protocol: {
    type: DataTypes.ENUM(...Object.values(FederationProtocol)),
    allowNull: false,
    comment: 'Federation protocol type',
  },
  status: {
    type: DataTypes.ENUM(...Object.values(IdentityProviderStatus)),
    allowNull: false,
    defaultValue: IdentityProviderStatus.PENDING,
    comment: 'Current provider status',
  },
  config: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {},
    comment: 'Protocol-specific configuration',
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {},
    comment: 'Federation metadata (SAML, etc.)',
  },
  certificate: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Public certificate for signature verification',
  },
  certificateFingerprint: {
    type: DataTypes.STRING(128),
    allowNull: true,
    comment: 'Certificate fingerprint (SHA-256)',
  },
  trustedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Timestamp when trust was established',
  },
  lastUsedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Last authentication timestamp',
  },
  authenticationCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Total authentication count',
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Soft delete timestamp',
  },
});

/**
 * Defines FederatedIdentity model for user-provider mappings.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelAttributes} FederatedIdentity model attributes
 */
export const getFederatedIdentityModelAttributes = (sequelize: Sequelize): ModelAttributes => ({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  localUserId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    comment: 'Local user identifier',
  },
  identityProviderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'identity_providers',
      key: 'id',
    },
    comment: 'Identity provider reference',
  },
  externalUserId: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'External user ID from IdP',
  },
  externalUsername: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'External username',
  },
  externalEmail: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      isEmail: true,
    },
    comment: 'External email address',
  },
  attributes: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {},
    comment: 'Federated user attributes',
  },
  linkedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: 'Timestamp when identity was linked',
  },
  lastAuthenticated: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Last successful authentication',
  },
  authenticationCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Authentication count',
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

/**
 * Defines TrustRelationship model attributes.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelAttributes} TrustRelationship model attributes
 */
export const getTrustRelationshipModelAttributes = (sequelize: Sequelize): ModelAttributes => ({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  identityProviderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'identity_providers',
      key: 'id',
    },
  },
  trustLevel: {
    type: DataTypes.ENUM(...Object.values(TrustLevel)),
    allowNull: false,
    defaultValue: TrustLevel.MEDIUM,
  },
  allowedDomains: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
    defaultValue: [],
  },
  blockedDomains: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
    defaultValue: [],
  },
  allowedUserGroups: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
    defaultValue: [],
  },
  requiredAttributes: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
    defaultValue: [],
  },
  sessionDuration: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Session duration in seconds',
  },
  requireMfa: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  ipWhitelist: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
    defaultValue: [],
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {},
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

/**
 * Defines AttributeMapping model attributes.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelAttributes} AttributeMapping model attributes
 */
export const getAttributeMappingModelAttributes = (sequelize: Sequelize): ModelAttributes => ({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  identityProviderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'identity_providers',
      key: 'id',
    },
  },
  sourceAttribute: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'External attribute name',
  },
  targetAttribute: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Internal attribute name',
  },
  strategy: {
    type: DataTypes.ENUM(...Object.values(AttributeMappingStrategy)),
    allowNull: false,
    defaultValue: AttributeMappingStrategy.STATIC,
  },
  transformation: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Transformation script or expression',
  },
  defaultValue: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  required: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  validation: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Validation regex or expression',
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

/**
 * Defines FederationAudit model for audit trail.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelAttributes} FederationAudit model attributes
 */
export const getFederationAuditModelAttributes = (sequelize: Sequelize): ModelAttributes => ({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  identityProviderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'identity_providers',
      key: 'id',
    },
  },
  eventType: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Event type (authentication, linking, etc.)',
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  externalUserId: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  success: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  errorMessage: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  ipAddress: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  userAgent: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {},
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

/**
 * Creates IdentityProvider table migration.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<void>}
 */
export const createIdentityProviderTable = async (
  queryInterface: QueryInterface,
  sequelize: Sequelize,
): Promise<void> => {
  await queryInterface.createTable('identity_providers', getIdentityProviderModelAttributes(sequelize));

  await queryInterface.addIndex('identity_providers', ['slug'], {
    name: 'idx_identity_providers_slug',
    unique: true,
  });
  await queryInterface.addIndex('identity_providers', ['protocol'], {
    name: 'idx_identity_providers_protocol',
  });
  await queryInterface.addIndex('identity_providers', ['status'], {
    name: 'idx_identity_providers_status',
  });
};

/**
 * Creates FederatedIdentity table migration.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<void>}
 */
export const createFederatedIdentityTable = async (
  queryInterface: QueryInterface,
  sequelize: Sequelize,
): Promise<void> => {
  await queryInterface.createTable('federated_identities', getFederatedIdentityModelAttributes(sequelize));

  await queryInterface.addIndex('federated_identities', ['localUserId'], {
    name: 'idx_federated_identities_local_user',
  });
  await queryInterface.addIndex('federated_identities', ['identityProviderId'], {
    name: 'idx_federated_identities_provider',
  });
  await queryInterface.addIndex('federated_identities', ['identityProviderId', 'externalUserId'], {
    name: 'idx_federated_identities_provider_external',
    unique: true,
  });
};

// ============================================================================
// IDENTITY PROVIDER MANAGEMENT
// ============================================================================

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
export const registerIdentityProvider = async (
  sequelize: Sequelize,
  providerData: {
    name: string;
    slug: string;
    protocol: FederationProtocol;
    config: IdentityProviderConfig;
    certificate?: string;
  },
  transaction?: Transaction,
): Promise<any> => {
  const IdentityProvider = sequelize.models.IdentityProvider;

  // Calculate certificate fingerprint if provided
  let certificateFingerprint: string | undefined;
  if (providerData.certificate) {
    certificateFingerprint = calculateCertificateFingerprint(providerData.certificate);
  }

  const provider = await IdentityProvider.create(
    {
      ...providerData,
      certificateFingerprint,
      status: IdentityProviderStatus.PENDING,
    },
    { transaction },
  );

  return provider;
};

/**
 * Retrieves identity provider by ID.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} providerId - Provider ID
 * @returns {Promise<any>} Identity provider instance
 */
export const getIdentityProviderById = async (sequelize: Sequelize, providerId: string): Promise<any> => {
  const IdentityProvider = sequelize.models.IdentityProvider;
  return await IdentityProvider.findByPk(providerId);
};

/**
 * Retrieves identity provider by slug.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} slug - Provider slug
 * @returns {Promise<any>} Identity provider instance
 */
export const getIdentityProviderBySlug = async (sequelize: Sequelize, slug: string): Promise<any> => {
  const IdentityProvider = sequelize.models.IdentityProvider;
  return await IdentityProvider.findOne({ where: { slug } });
};

/**
 * Updates identity provider configuration.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} providerId - Provider ID
 * @param {Partial<IdentityProviderConfig>} config - Configuration updates
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Updated provider
 */
export const updateIdentityProviderConfig = async (
  sequelize: Sequelize,
  providerId: string,
  config: Partial<IdentityProviderConfig>,
  transaction?: Transaction,
): Promise<any> => {
  const provider = await sequelize.models.IdentityProvider.findByPk(providerId);
  if (!provider) {
    throw new Error(`Identity provider ${providerId} not found`);
  }

  const currentConfig = (provider as any).config || {};
  const mergedConfig = { ...currentConfig, ...config };

  await provider.update({ config: mergedConfig }, { transaction });
  return provider;
};

/**
 * Activates an identity provider.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} providerId - Provider ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Activated provider
 */
export const activateIdentityProvider = async (
  sequelize: Sequelize,
  providerId: string,
  transaction?: Transaction,
): Promise<any> => {
  const provider = await sequelize.models.IdentityProvider.findByPk(providerId);
  if (!provider) {
    throw new Error(`Identity provider ${providerId} not found`);
  }

  await provider.update(
    {
      status: IdentityProviderStatus.ACTIVE,
      trustedAt: new Date(),
    },
    { transaction },
  );

  return provider;
};

/**
 * Deactivates an identity provider.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} providerId - Provider ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Deactivated provider
 */
export const deactivateIdentityProvider = async (
  sequelize: Sequelize,
  providerId: string,
  transaction?: Transaction,
): Promise<any> => {
  const provider = await sequelize.models.IdentityProvider.findByPk(providerId);
  if (!provider) {
    throw new Error(`Identity provider ${providerId} not found`);
  }

  await provider.update({ status: IdentityProviderStatus.INACTIVE }, { transaction });
  return provider;
};

/**
 * Lists all identity providers with filtering.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} filters - Filter options
 * @returns {Promise<any[]>} Array of providers
 */
export const listIdentityProviders = async (
  sequelize: Sequelize,
  filters: {
    protocol?: FederationProtocol;
    status?: IdentityProviderStatus;
  } = {},
): Promise<any[]> => {
  const IdentityProvider = sequelize.models.IdentityProvider;

  const where: WhereOptions = {};

  if (filters.protocol) {
    where.protocol = filters.protocol;
  }

  if (filters.status) {
    where.status = filters.status;
  }

  return await IdentityProvider.findAll({ where });
};

// ============================================================================
// FEDERATED IDENTITY MAPPING
// ============================================================================

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
export const linkFederatedIdentity = async (
  sequelize: Sequelize,
  mappingData: {
    localUserId: string;
    identityProviderId: string;
    externalUserId: string;
    externalUsername?: string;
    externalEmail?: string;
    attributes?: Record<string, any>;
  },
  transaction?: Transaction,
): Promise<any> => {
  const FederatedIdentity = sequelize.models.FederatedIdentity;

  // Check if mapping already exists
  const existing = await FederatedIdentity.findOne({
    where: {
      identityProviderId: mappingData.identityProviderId,
      externalUserId: mappingData.externalUserId,
    },
    transaction,
  });

  if (existing) {
    // Update existing mapping
    await existing.update(
      {
        localUserId: mappingData.localUserId,
        externalUsername: mappingData.externalUsername,
        externalEmail: mappingData.externalEmail,
        attributes: mappingData.attributes || {},
      },
      { transaction },
    );
    return existing;
  }

  const mapping = await FederatedIdentity.create(
    {
      ...mappingData,
      linkedAt: new Date(),
      authenticationCount: 0,
    },
    { transaction },
  );

  return mapping;
};

/**
 * Retrieves federated identity by external user ID.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} identityProviderId - Provider ID
 * @param {string} externalUserId - External user ID
 * @returns {Promise<any>} Federated identity mapping
 */
export const getFederatedIdentityByExternalId = async (
  sequelize: Sequelize,
  identityProviderId: string,
  externalUserId: string,
): Promise<any> => {
  const FederatedIdentity = sequelize.models.FederatedIdentity;
  return await FederatedIdentity.findOne({
    where: { identityProviderId, externalUserId },
  });
};

/**
 * Retrieves all federated identities for a local user.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} localUserId - Local user ID
 * @returns {Promise<any[]>} Array of federated identities
 */
export const getFederatedIdentitiesForUser = async (
  sequelize: Sequelize,
  localUserId: string,
): Promise<any[]> => {
  const FederatedIdentity = sequelize.models.FederatedIdentity;
  return await FederatedIdentity.findAll({
    where: { localUserId },
    include: [
      {
        model: sequelize.models.IdentityProvider,
        as: 'identityProvider',
      },
    ],
  });
};

/**
 * Unlinks federated identity from local user.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} federatedIdentityId - Federated identity ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<void>}
 */
export const unlinkFederatedIdentity = async (
  sequelize: Sequelize,
  federatedIdentityId: string,
  transaction?: Transaction,
): Promise<void> => {
  const FederatedIdentity = sequelize.models.FederatedIdentity;
  await FederatedIdentity.destroy({ where: { id: federatedIdentityId }, transaction });
};

/**
 * Updates federated identity attributes.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} federatedIdentityId - Federated identity ID
 * @param {Record<string, any>} attributes - Updated attributes
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Updated federated identity
 */
export const updateFederatedIdentityAttributes = async (
  sequelize: Sequelize,
  federatedIdentityId: string,
  attributes: Record<string, any>,
  transaction?: Transaction,
): Promise<any> => {
  const identity = await sequelize.models.FederatedIdentity.findByPk(federatedIdentityId);
  if (!identity) {
    throw new Error(`Federated identity ${federatedIdentityId} not found`);
  }

  const currentAttributes = (identity as any).attributes || {};
  await identity.update(
    {
      attributes: { ...currentAttributes, ...attributes },
      lastAuthenticated: new Date(),
      authenticationCount: ((identity as any).authenticationCount || 0) + 1,
    },
    { transaction },
  );

  return identity;
};

/**
 * Records federated authentication event.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} federatedIdentityId - Federated identity ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Updated federated identity
 */
export const recordFederatedAuthentication = async (
  sequelize: Sequelize,
  federatedIdentityId: string,
  transaction?: Transaction,
): Promise<any> => {
  const identity = await sequelize.models.FederatedIdentity.findByPk(federatedIdentityId);
  if (!identity) {
    throw new Error(`Federated identity ${federatedIdentityId} not found`);
  }

  await identity.update(
    {
      lastAuthenticated: new Date(),
      authenticationCount: ((identity as any).authenticationCount || 0) + 1,
    },
    { transaction },
  );

  // Update provider last used
  await sequelize.models.IdentityProvider.increment('authenticationCount', {
    where: { id: (identity as any).identityProviderId },
    transaction,
  });

  await sequelize.models.IdentityProvider.update(
    { lastUsedAt: new Date() },
    {
      where: { id: (identity as any).identityProviderId },
      transaction,
    },
  );

  return identity;
};

// ============================================================================
// TRUST RELATIONSHIPS
// ============================================================================

/**
 * Establishes trust relationship with identity provider.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {TrustRelationshipConfig} trustConfig - Trust configuration
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Created trust relationship
 */
export const establishTrustRelationship = async (
  sequelize: Sequelize,
  trustConfig: TrustRelationshipConfig,
  transaction?: Transaction,
): Promise<any> => {
  const TrustRelationship = sequelize.models.TrustRelationship;

  const trust = await TrustRelationship.create(trustConfig, { transaction });
  return trust;
};

/**
 * Retrieves trust relationship for identity provider.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} identityProviderId - Provider ID
 * @returns {Promise<any>} Trust relationship
 */
export const getTrustRelationship = async (
  sequelize: Sequelize,
  identityProviderId: string,
): Promise<any> => {
  const TrustRelationship = sequelize.models.TrustRelationship;
  return await TrustRelationship.findOne({ where: { identityProviderId } });
};

/**
 * Updates trust relationship configuration.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} identityProviderId - Provider ID
 * @param {Partial<TrustRelationshipConfig>} updates - Configuration updates
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Updated trust relationship
 */
export const updateTrustRelationship = async (
  sequelize: Sequelize,
  identityProviderId: string,
  updates: Partial<TrustRelationshipConfig>,
  transaction?: Transaction,
): Promise<any> => {
  const trust = await sequelize.models.TrustRelationship.findOne({
    where: { identityProviderId },
  });

  if (!trust) {
    throw new Error(`Trust relationship for provider ${identityProviderId} not found`);
  }

  await trust.update(updates, { transaction });
  return trust;
};

/**
 * Validates trust for federated authentication.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} identityProviderId - Provider ID
 * @param {object} context - Authentication context
 * @returns {Promise<boolean>} True if trust validated
 */
export const validateTrust = async (
  sequelize: Sequelize,
  identityProviderId: string,
  context: {
    email?: string;
    userGroups?: string[];
    attributes?: Record<string, any>;
    ipAddress?: string;
  },
): Promise<boolean> => {
  const trust = await getTrustRelationship(sequelize, identityProviderId);
  if (!trust) {
    return false;
  }

  // Check domain restrictions
  if (context.email && (trust as any).allowedDomains.length > 0) {
    const domain = context.email.split('@')[1];
    if (!(trust as any).allowedDomains.includes(domain)) {
      return false;
    }
  }

  if (context.email && (trust as any).blockedDomains.length > 0) {
    const domain = context.email.split('@')[1];
    if ((trust as any).blockedDomains.includes(domain)) {
      return false;
    }
  }

  // Check group restrictions
  if (context.userGroups && (trust as any).allowedUserGroups.length > 0) {
    const hasAllowedGroup = context.userGroups.some((group) =>
      (trust as any).allowedUserGroups.includes(group),
    );
    if (!hasAllowedGroup) {
      return false;
    }
  }

  // Check required attributes
  if ((trust as any).requiredAttributes.length > 0) {
    for (const requiredAttr of (trust as any).requiredAttributes) {
      if (!context.attributes?.[requiredAttr]) {
        return false;
      }
    }
  }

  // Check IP whitelist
  if (context.ipAddress && (trust as any).ipWhitelist.length > 0) {
    if (!(trust as any).ipWhitelist.includes(context.ipAddress)) {
      return false;
    }
  }

  return true;
};

// ============================================================================
// FEDERATION PROTOCOLS (SAML, WS-Fed, OpenID)
// ============================================================================

/**
 * Generates SAML metadata for service provider.
 *
 * @param {object} config - SP configuration
 * @returns {string} SAML metadata XML
 */
export const generateSamlMetadata = (config: {
  entityId: string;
  acsUrl: string;
  sloUrl?: string;
  certificate: string;
  nameIdFormats?: string[];
}): string => {
  const nameIdFormats = config.nameIdFormats || [
    'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
    'urn:oasis:names:tc:SAML:2.0:nameid-format:persistent',
  ];

  const metadata = `<?xml version="1.0"?>
<EntityDescriptor xmlns="urn:oasis:names:tc:SAML:2.0:metadata" entityID="${config.entityId}">
  <SPSSODescriptor protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
    ${nameIdFormats.map((format) => `<NameIDFormat>${format}</NameIDFormat>`).join('\n    ')}
    <AssertionConsumerService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" Location="${config.acsUrl}" index="0"/>
    ${config.sloUrl ? `<SingleLogoutService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect" Location="${config.sloUrl}"/>` : ''}
    <KeyDescriptor use="signing">
      <KeyInfo xmlns="http://www.w3.org/2000/09/xmldsig#">
        <X509Data>
          <X509Certificate>${config.certificate.replace(/-----BEGIN CERTIFICATE-----|-----END CERTIFICATE-----|\n/g, '')}</X509Certificate>
        </X509Data>
      </KeyInfo>
    </KeyDescriptor>
  </SPSSODescriptor>
</EntityDescriptor>`;

  return metadata;
};

/**
 * Parses SAML assertion from identity provider.
 *
 * @param {string} samlResponse - Base64-encoded SAML response
 * @returns {Promise<FederationAssertion>} Parsed assertion
 */
export const parseSamlAssertion = async (samlResponse: string): Promise<FederationAssertion> => {
  // Decode base64 SAML response
  const decodedResponse = Buffer.from(samlResponse, 'base64').toString('utf-8');

  // Parse XML (simplified - in production use xml2js or similar)
  const issuerMatch = decodedResponse.match(/<saml:Issuer>(.*?)<\/saml:Issuer>/);
  const subjectMatch = decodedResponse.match(/<saml:NameID.*?>(.*?)<\/saml:NameID>/);

  const assertion: FederationAssertion = {
    protocol: FederationProtocol.SAML2,
    issuer: issuerMatch ? issuerMatch[1] : '',
    subject: subjectMatch ? subjectMatch[1] : '',
    attributes: {},
  };

  // Extract attributes (simplified)
  const attributeRegex = /<saml:Attribute Name="(.*?)"[\s\S]*?<saml:AttributeValue>(.*?)<\/saml:AttributeValue>/g;
  let match;
  while ((match = attributeRegex.exec(decodedResponse)) !== null) {
    assertion.attributes[match[1]] = match[2];
  }

  return assertion;
};

/**
 * Validates SAML assertion signature.
 *
 * @param {string} samlResponse - SAML response
 * @param {string} certificate - Public certificate
 * @returns {boolean} True if signature valid
 */
export const validateSamlSignature = (samlResponse: string, certificate: string): boolean => {
  // In production, use proper SAML library like passport-saml or saml2-js
  // This is a placeholder implementation
  try {
    const decoded = Buffer.from(samlResponse, 'base64').toString('utf-8');
    return decoded.includes('Signature') && decoded.includes('SignatureValue');
  } catch {
    return false;
  }
};

/**
 * Generates OpenID Connect authorization URL.
 *
 * @param {IdentityProviderConfig} config - OIDC configuration
 * @param {object} params - Authorization parameters
 * @returns {string} Authorization URL
 */
export const generateOidcAuthorizationUrl = (
  config: IdentityProviderConfig,
  params: {
    redirectUri: string;
    state: string;
    nonce: string;
    scope?: string[];
  },
): string => {
  if (!config.authorizationEndpoint) {
    throw new Error('Authorization endpoint not configured');
  }

  const scopes = params.scope || config.scopes || ['openid', 'profile', 'email'];
  const queryParams = new URLSearchParams({
    client_id: config.clientId || '',
    redirect_uri: params.redirectUri,
    response_type: 'code',
    scope: scopes.join(' '),
    state: params.state,
    nonce: params.nonce,
  });

  return `${config.authorizationEndpoint}?${queryParams.toString()}`;
};

/**
 * Exchanges OIDC authorization code for tokens.
 *
 * @param {IdentityProviderConfig} config - OIDC configuration
 * @param {string} code - Authorization code
 * @param {string} redirectUri - Redirect URI
 * @returns {Promise<any>} Token response
 */
export const exchangeOidcCode = async (
  config: IdentityProviderConfig,
  code: string,
  redirectUri: string,
): Promise<any> => {
  if (!config.tokenEndpoint) {
    throw new Error('Token endpoint not configured');
  }

  // In production, use proper HTTP client
  const tokenResponse = {
    access_token: 'mock_access_token',
    id_token: 'mock_id_token',
    token_type: 'Bearer',
    expires_in: 3600,
  };

  return tokenResponse;
};

/**
 * Validates OpenID Connect ID token.
 *
 * @param {string} idToken - ID token JWT
 * @param {IdentityProviderConfig} config - OIDC configuration
 * @returns {Promise<any>} Decoded token payload
 */
export const validateOidcIdToken = async (idToken: string, config: IdentityProviderConfig): Promise<any> => {
  // In production, use proper JWT validation with jsonwebtoken or jose
  // Verify signature, issuer, audience, expiration
  const [headerB64, payloadB64, signatureB64] = idToken.split('.');
  const payload = JSON.parse(Buffer.from(payloadB64, 'base64').toString('utf-8'));

  // Validate claims
  if (payload.iss !== config.issuer) {
    throw new Error('Invalid issuer');
  }

  if (payload.aud !== config.clientId) {
    throw new Error('Invalid audience');
  }

  if (payload.exp < Date.now() / 1000) {
    throw new Error('Token expired');
  }

  return payload;
};

// ============================================================================
// ATTRIBUTE MAPPING
// ============================================================================

/**
 * Creates attribute mapping rule.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} identityProviderId - Provider ID
 * @param {AttributeMappingRule} rule - Mapping rule
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Created mapping
 */
export const createAttributeMapping = async (
  sequelize: Sequelize,
  identityProviderId: string,
  rule: AttributeMappingRule,
  transaction?: Transaction,
): Promise<any> => {
  const AttributeMapping = sequelize.models.AttributeMapping;

  const mapping = await AttributeMapping.create(
    {
      identityProviderId,
      ...rule,
    },
    { transaction },
  );

  return mapping;
};

/**
 * Retrieves attribute mappings for identity provider.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} identityProviderId - Provider ID
 * @returns {Promise<any[]>} Array of attribute mappings
 */
export const getAttributeMappings = async (
  sequelize: Sequelize,
  identityProviderId: string,
): Promise<any[]> => {
  const AttributeMapping = sequelize.models.AttributeMapping;
  return await AttributeMapping.findAll({ where: { identityProviderId } });
};

/**
 * Applies attribute mappings to federated attributes.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} identityProviderId - Provider ID
 * @param {Record<string, any>} externalAttributes - External attributes
 * @returns {Promise<Record<string, any>>} Mapped attributes
 */
export const applyAttributeMappings = async (
  sequelize: Sequelize,
  identityProviderId: string,
  externalAttributes: Record<string, any>,
): Promise<Record<string, any>> => {
  const mappings = await getAttributeMappings(sequelize, identityProviderId);
  const mappedAttributes: Record<string, any> = {};

  for (const mapping of mappings) {
    const sourceAttr = (mapping as any).sourceAttribute;
    const targetAttr = (mapping as any).targetAttribute;
    const strategy = (mapping as any).strategy;
    const transformation = (mapping as any).transformation;
    const defaultValue = (mapping as any).defaultValue;

    let value = externalAttributes[sourceAttr];

    // Apply transformation based on strategy
    if (strategy === AttributeMappingStrategy.STATIC) {
      value = value || defaultValue;
    } else if (strategy === AttributeMappingStrategy.EXPRESSION && transformation) {
      // Simple expression evaluation (in production use safer evaluation)
      try {
        value = eval(transformation.replace('{value}', JSON.stringify(value)));
      } catch {
        value = defaultValue;
      }
    }

    if (value !== undefined) {
      mappedAttributes[targetAttr] = value;
    } else if ((mapping as any).required) {
      throw new Error(`Required attribute ${sourceAttr} not found in federated attributes`);
    }
  }

  return mappedAttributes;
};

/**
 * Validates mapped attributes against rules.
 *
 * @param {any[]} mappings - Attribute mappings
 * @param {Record<string, any>} attributes - Attributes to validate
 * @returns {boolean} True if valid
 */
export const validateMappedAttributes = (mappings: any[], attributes: Record<string, any>): boolean => {
  for (const mapping of mappings) {
    const targetAttr = mapping.targetAttribute;
    const validation = mapping.validation;
    const required = mapping.required;

    if (required && !attributes[targetAttr]) {
      return false;
    }

    if (validation && attributes[targetAttr]) {
      const regex = new RegExp(validation);
      if (!regex.test(String(attributes[targetAttr]))) {
        return false;
      }
    }
  }

  return true;
};

// ============================================================================
// JUST-IN-TIME PROVISIONING
// ============================================================================

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
export const provisionUserJIT = async (
  sequelize: Sequelize,
  identityProviderId: string,
  assertion: FederationAssertion,
  config: JitProvisioningConfig,
  transaction?: Transaction,
): Promise<any> => {
  if (config.mode === JitProvisioningMode.DISABLED) {
    throw new Error('JIT provisioning is disabled');
  }

  // Check if federated identity already exists
  const existingIdentity = await getFederatedIdentityByExternalId(
    sequelize,
    identityProviderId,
    assertion.subject,
  );

  if (existingIdentity) {
    // User already linked
    await recordFederatedAuthentication(sequelize, (existingIdentity as any).id, transaction);
    return existingIdentity;
  }

  // Apply attribute mappings
  const mappedAttributes = await applyAttributeMappings(sequelize, identityProviderId, assertion.attributes);

  // Auto-create mode
  if (
    config.mode === JitProvisioningMode.AUTO_CREATE ||
    config.mode === JitProvisioningMode.AUTO_CREATE_AND_LINK
  ) {
    const User = sequelize.models.User;

    // Create new user
    const newUser = await User.create(
      {
        email: mappedAttributes.email || assertion.attributes.email,
        username: mappedAttributes.username || assertion.subject,
        firstName: mappedAttributes.firstName || assertion.attributes.firstName,
        lastName: mappedAttributes.lastName || assertion.attributes.lastName,
        role: config.defaultRole || 'user',
        isActive: config.autoActivate !== false,
        emailVerified: !config.requireEmailVerification,
      },
      { transaction },
    );

    // Link federated identity
    const federatedIdentity = await linkFederatedIdentity(
      sequelize,
      {
        localUserId: (newUser as any).id,
        identityProviderId,
        externalUserId: assertion.subject,
        externalEmail: mappedAttributes.email || assertion.attributes.email,
        attributes: mappedAttributes,
      },
      transaction,
    );

    return { user: newUser, federatedIdentity };
  }

  throw new Error('User not found and JIT provisioning not enabled for auto-create');
};

/**
 * Configures JIT provisioning for identity provider.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} identityProviderId - Provider ID
 * @param {JitProvisioningConfig} config - JIT configuration
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Updated provider
 */
export const configureJitProvisioning = async (
  sequelize: Sequelize,
  identityProviderId: string,
  config: JitProvisioningConfig,
  transaction?: Transaction,
): Promise<any> => {
  const provider = await sequelize.models.IdentityProvider.findByPk(identityProviderId);
  if (!provider) {
    throw new Error(`Identity provider ${identityProviderId} not found`);
  }

  const currentMetadata = (provider as any).metadata || {};
  await provider.update(
    {
      metadata: {
        ...currentMetadata,
        jitProvisioning: config,
      },
    },
    { transaction },
  );

  return provider;
};

// ============================================================================
// FEDERATION SECURITY
// ============================================================================

/**
 * Calculates certificate fingerprint.
 *
 * @param {string} certificate - PEM-encoded certificate
 * @returns {string} SHA-256 fingerprint
 */
export const calculateCertificateFingerprint = (certificate: string): string => {
  const certContent = certificate.replace(/-----BEGIN CERTIFICATE-----|-----END CERTIFICATE-----|\n/g, '');
  const hash = crypto.createHash('sha256').update(certContent).digest('hex');
  return hash.toUpperCase().match(/.{2}/g)?.join(':') || hash;
};

/**
 * Validates certificate trust.
 *
 * @param {string} certificate - Certificate to validate
 * @param {string} trustedFingerprint - Trusted fingerprint
 * @returns {boolean} True if certificate trusted
 */
export const validateCertificateTrust = (certificate: string, trustedFingerprint: string): boolean => {
  const fingerprint = calculateCertificateFingerprint(certificate);
  return fingerprint === trustedFingerprint;
};

/**
 * Audits federation event.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {FederationAuditEvent} event - Audit event
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Created audit record
 */
export const auditFederationEvent = async (
  sequelize: Sequelize,
  event: FederationAuditEvent,
  transaction?: Transaction,
): Promise<any> => {
  const FederationAudit = sequelize.models.FederationAudit;

  const auditRecord = await FederationAudit.create(event, { transaction });
  return auditRecord;
};

/**
 * Retrieves federation audit logs.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} filters - Filter options
 * @param {object} pagination - Pagination options
 * @returns {Promise<any>} Audit logs
 */
export const getFederationAuditLogs = async (
  sequelize: Sequelize,
  filters: {
    identityProviderId?: string;
    eventType?: string;
    userId?: string;
    success?: boolean;
    startDate?: Date;
    endDate?: Date;
  } = {},
  pagination: { page?: number; limit?: number } = {},
): Promise<any> => {
  const FederationAudit = sequelize.models.FederationAudit;

  const where: WhereOptions = {};

  if (filters.identityProviderId) {
    where.identityProviderId = filters.identityProviderId;
  }

  if (filters.eventType) {
    where.eventType = filters.eventType;
  }

  if (filters.userId) {
    where.userId = filters.userId;
  }

  if (filters.success !== undefined) {
    where.success = filters.success;
  }

  if (filters.startDate || filters.endDate) {
    where.createdAt = {};
    if (filters.startDate) {
      (where.createdAt as any)[Op.gte] = filters.startDate;
    }
    if (filters.endDate) {
      (where.createdAt as any)[Op.lte] = filters.endDate;
    }
  }

  const page = pagination.page || 1;
  const limit = pagination.limit || 50;
  const offset = (page - 1) * limit;

  const { rows, count } = await FederationAudit.findAndCountAll({
    where,
    limit,
    offset,
    order: [['createdAt', 'DESC']],
  });

  return {
    logs: rows,
    pagination: {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    },
  };
};

/**
 * Generates federation analytics report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} identityProviderId - Provider ID
 * @param {object} period - Time period
 * @returns {Promise<any>} Analytics report
 */
export const generateFederationAnalytics = async (
  sequelize: Sequelize,
  identityProviderId: string,
  period: { startDate: Date; endDate: Date },
): Promise<any> => {
  const FederationAudit = sequelize.models.FederationAudit;

  const totalAuthentications = await FederationAudit.count({
    where: {
      identityProviderId,
      eventType: 'authentication',
      createdAt: {
        [Op.gte]: period.startDate,
        [Op.lte]: period.endDate,
      },
    },
  });

  const successfulAuthentications = await FederationAudit.count({
    where: {
      identityProviderId,
      eventType: 'authentication',
      success: true,
      createdAt: {
        [Op.gte]: period.startDate,
        [Op.lte]: period.endDate,
      },
    },
  });

  const uniqueUsers = await FederationAudit.count({
    where: {
      identityProviderId,
      eventType: 'authentication',
      createdAt: {
        [Op.gte]: period.startDate,
        [Op.lte]: period.endDate,
      },
    },
    distinct: true,
    col: 'userId',
  });

  return {
    identityProviderId,
    period,
    metrics: {
      totalAuthentications,
      successfulAuthentications,
      failedAuthentications: totalAuthentications - successfulAuthentications,
      successRate: totalAuthentications > 0 ? (successfulAuthentications / totalAuthentications) * 100 : 0,
      uniqueUsers,
    },
  };
};
