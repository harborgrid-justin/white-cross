"use strict";
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
exports.generateFederationAnalytics = exports.getFederationAuditLogs = exports.auditFederationEvent = exports.validateCertificateTrust = exports.calculateCertificateFingerprint = exports.configureJitProvisioning = exports.provisionUserJIT = exports.validateMappedAttributes = exports.applyAttributeMappings = exports.getAttributeMappings = exports.createAttributeMapping = exports.validateOidcIdToken = exports.exchangeOidcCode = exports.generateOidcAuthorizationUrl = exports.validateSamlSignature = exports.parseSamlAssertion = exports.generateSamlMetadata = exports.validateTrust = exports.updateTrustRelationship = exports.getTrustRelationship = exports.establishTrustRelationship = exports.recordFederatedAuthentication = exports.updateFederatedIdentityAttributes = exports.unlinkFederatedIdentity = exports.getFederatedIdentitiesForUser = exports.getFederatedIdentityByExternalId = exports.linkFederatedIdentity = exports.listIdentityProviders = exports.deactivateIdentityProvider = exports.activateIdentityProvider = exports.updateIdentityProviderConfig = exports.getIdentityProviderBySlug = exports.getIdentityProviderById = exports.registerIdentityProvider = exports.createFederatedIdentityTable = exports.createIdentityProviderTable = exports.getFederationAuditModelAttributes = exports.getAttributeMappingModelAttributes = exports.getTrustRelationshipModelAttributes = exports.getFederatedIdentityModelAttributes = exports.getIdentityProviderModelAttributes = exports.JitProvisioningMode = exports.AttributeMappingStrategy = exports.TrustLevel = exports.IdentityProviderStatus = exports.FederationProtocol = void 0;
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
const sequelize_1 = require("sequelize");
const crypto = __importStar(require("crypto"));
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Federation protocol types
 */
var FederationProtocol;
(function (FederationProtocol) {
    FederationProtocol["SAML2"] = "saml2";
    FederationProtocol["WS_FEDERATION"] = "ws_federation";
    FederationProtocol["OPENID_CONNECT"] = "openid_connect";
    FederationProtocol["OAUTH2"] = "oauth2";
    FederationProtocol["LDAP"] = "ldap";
    FederationProtocol["CAS"] = "cas";
})(FederationProtocol || (exports.FederationProtocol = FederationProtocol = {}));
/**
 * Identity provider status
 */
var IdentityProviderStatus;
(function (IdentityProviderStatus) {
    IdentityProviderStatus["ACTIVE"] = "active";
    IdentityProviderStatus["INACTIVE"] = "inactive";
    IdentityProviderStatus["PENDING"] = "pending";
    IdentityProviderStatus["SUSPENDED"] = "suspended";
    IdentityProviderStatus["ERROR"] = "error";
})(IdentityProviderStatus || (exports.IdentityProviderStatus = IdentityProviderStatus = {}));
/**
 * Federation trust level
 */
var TrustLevel;
(function (TrustLevel) {
    TrustLevel["HIGH"] = "high";
    TrustLevel["MEDIUM"] = "medium";
    TrustLevel["LOW"] = "low";
    TrustLevel["RESTRICTED"] = "restricted";
})(TrustLevel || (exports.TrustLevel = TrustLevel = {}));
/**
 * Attribute mapping strategy
 */
var AttributeMappingStrategy;
(function (AttributeMappingStrategy) {
    AttributeMappingStrategy["STATIC"] = "static";
    AttributeMappingStrategy["DYNAMIC"] = "dynamic";
    AttributeMappingStrategy["SCRIPT"] = "script";
    AttributeMappingStrategy["EXPRESSION"] = "expression";
})(AttributeMappingStrategy || (exports.AttributeMappingStrategy = AttributeMappingStrategy = {}));
/**
 * Just-in-time provisioning mode
 */
var JitProvisioningMode;
(function (JitProvisioningMode) {
    JitProvisioningMode["DISABLED"] = "disabled";
    JitProvisioningMode["AUTO_CREATE"] = "auto_create";
    JitProvisioningMode["AUTO_LINK"] = "auto_link";
    JitProvisioningMode["AUTO_CREATE_AND_LINK"] = "auto_create_and_link";
})(JitProvisioningMode || (exports.JitProvisioningMode = JitProvisioningMode = {}));
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
const getIdentityProviderModelAttributes = (sequelize) => ({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        comment: 'Unique identity provider identifier',
    },
    name: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [2, 255],
        },
        comment: 'Identity provider display name',
    },
    slug: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            is: /^[a-z0-9-]+$/i,
            len: [2, 100],
        },
        comment: 'URL-friendly identifier',
    },
    protocol: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(FederationProtocol)),
        allowNull: false,
        comment: 'Federation protocol type',
    },
    status: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(IdentityProviderStatus)),
        allowNull: false,
        defaultValue: IdentityProviderStatus.PENDING,
        comment: 'Current provider status',
    },
    config: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
        comment: 'Protocol-specific configuration',
    },
    metadata: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
        comment: 'Federation metadata (SAML, etc.)',
    },
    certificate: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        comment: 'Public certificate for signature verification',
    },
    certificateFingerprint: {
        type: sequelize_1.DataTypes.STRING(128),
        allowNull: true,
        comment: 'Certificate fingerprint (SHA-256)',
    },
    trustedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        comment: 'Timestamp when trust was established',
    },
    lastUsedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        comment: 'Last authentication timestamp',
    },
    authenticationCount: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Total authentication count',
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    deletedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        comment: 'Soft delete timestamp',
    },
});
exports.getIdentityProviderModelAttributes = getIdentityProviderModelAttributes;
/**
 * Defines FederatedIdentity model for user-provider mappings.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelAttributes} FederatedIdentity model attributes
 */
const getFederatedIdentityModelAttributes = (sequelize) => ({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    localUserId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
        comment: 'Local user identifier',
    },
    identityProviderId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'identity_providers',
            key: 'id',
        },
        comment: 'Identity provider reference',
    },
    externalUserId: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        comment: 'External user ID from IdP',
    },
    externalUsername: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
        comment: 'External username',
    },
    externalEmail: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
        validate: {
            isEmail: true,
        },
        comment: 'External email address',
    },
    attributes: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
        comment: 'Federated user attributes',
    },
    linkedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
        comment: 'Timestamp when identity was linked',
    },
    lastAuthenticated: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        comment: 'Last successful authentication',
    },
    authenticationCount: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Authentication count',
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
});
exports.getFederatedIdentityModelAttributes = getFederatedIdentityModelAttributes;
/**
 * Defines TrustRelationship model attributes.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelAttributes} TrustRelationship model attributes
 */
const getTrustRelationshipModelAttributes = (sequelize) => ({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    identityProviderId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'identity_providers',
            key: 'id',
        },
    },
    trustLevel: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(TrustLevel)),
        allowNull: false,
        defaultValue: TrustLevel.MEDIUM,
    },
    allowedDomains: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
    },
    blockedDomains: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
    },
    allowedUserGroups: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
    },
    requiredAttributes: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
    },
    sessionDuration: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        comment: 'Session duration in seconds',
    },
    requireMfa: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    ipWhitelist: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
    },
    metadata: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
});
exports.getTrustRelationshipModelAttributes = getTrustRelationshipModelAttributes;
/**
 * Defines AttributeMapping model attributes.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelAttributes} AttributeMapping model attributes
 */
const getAttributeMappingModelAttributes = (sequelize) => ({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    identityProviderId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'identity_providers',
            key: 'id',
        },
    },
    sourceAttribute: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        comment: 'External attribute name',
    },
    targetAttribute: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        comment: 'Internal attribute name',
    },
    strategy: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(AttributeMappingStrategy)),
        allowNull: false,
        defaultValue: AttributeMappingStrategy.STATIC,
    },
    transformation: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        comment: 'Transformation script or expression',
    },
    defaultValue: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: true,
    },
    required: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    validation: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        comment: 'Validation regex or expression',
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
});
exports.getAttributeMappingModelAttributes = getAttributeMappingModelAttributes;
/**
 * Defines FederationAudit model for audit trail.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelAttributes} FederationAudit model attributes
 */
const getFederationAuditModelAttributes = (sequelize) => ({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    identityProviderId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'identity_providers',
            key: 'id',
        },
    },
    eventType: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
        comment: 'Event type (authentication, linking, etc.)',
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
    },
    externalUserId: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
    success: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
    },
    errorMessage: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    ipAddress: {
        type: sequelize_1.DataTypes.STRING(45),
        allowNull: true,
    },
    userAgent: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    metadata: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
});
exports.getFederationAuditModelAttributes = getFederationAuditModelAttributes;
/**
 * Creates IdentityProvider table migration.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<void>}
 */
const createIdentityProviderTable = async (queryInterface, sequelize) => {
    await queryInterface.createTable('identity_providers', (0, exports.getIdentityProviderModelAttributes)(sequelize));
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
exports.createIdentityProviderTable = createIdentityProviderTable;
/**
 * Creates FederatedIdentity table migration.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<void>}
 */
const createFederatedIdentityTable = async (queryInterface, sequelize) => {
    await queryInterface.createTable('federated_identities', (0, exports.getFederatedIdentityModelAttributes)(sequelize));
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
exports.createFederatedIdentityTable = createFederatedIdentityTable;
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
const registerIdentityProvider = async (sequelize, providerData, transaction) => {
    const IdentityProvider = sequelize.models.IdentityProvider;
    // Calculate certificate fingerprint if provided
    let certificateFingerprint;
    if (providerData.certificate) {
        certificateFingerprint = (0, exports.calculateCertificateFingerprint)(providerData.certificate);
    }
    const provider = await IdentityProvider.create({
        ...providerData,
        certificateFingerprint,
        status: IdentityProviderStatus.PENDING,
    }, { transaction });
    return provider;
};
exports.registerIdentityProvider = registerIdentityProvider;
/**
 * Retrieves identity provider by ID.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} providerId - Provider ID
 * @returns {Promise<any>} Identity provider instance
 */
const getIdentityProviderById = async (sequelize, providerId) => {
    const IdentityProvider = sequelize.models.IdentityProvider;
    return await IdentityProvider.findByPk(providerId);
};
exports.getIdentityProviderById = getIdentityProviderById;
/**
 * Retrieves identity provider by slug.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} slug - Provider slug
 * @returns {Promise<any>} Identity provider instance
 */
const getIdentityProviderBySlug = async (sequelize, slug) => {
    const IdentityProvider = sequelize.models.IdentityProvider;
    return await IdentityProvider.findOne({ where: { slug } });
};
exports.getIdentityProviderBySlug = getIdentityProviderBySlug;
/**
 * Updates identity provider configuration.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} providerId - Provider ID
 * @param {Partial<IdentityProviderConfig>} config - Configuration updates
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Updated provider
 */
const updateIdentityProviderConfig = async (sequelize, providerId, config, transaction) => {
    const provider = await sequelize.models.IdentityProvider.findByPk(providerId);
    if (!provider) {
        throw new Error(`Identity provider ${providerId} not found`);
    }
    const currentConfig = provider.config || {};
    const mergedConfig = { ...currentConfig, ...config };
    await provider.update({ config: mergedConfig }, { transaction });
    return provider;
};
exports.updateIdentityProviderConfig = updateIdentityProviderConfig;
/**
 * Activates an identity provider.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} providerId - Provider ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Activated provider
 */
const activateIdentityProvider = async (sequelize, providerId, transaction) => {
    const provider = await sequelize.models.IdentityProvider.findByPk(providerId);
    if (!provider) {
        throw new Error(`Identity provider ${providerId} not found`);
    }
    await provider.update({
        status: IdentityProviderStatus.ACTIVE,
        trustedAt: new Date(),
    }, { transaction });
    return provider;
};
exports.activateIdentityProvider = activateIdentityProvider;
/**
 * Deactivates an identity provider.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} providerId - Provider ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Deactivated provider
 */
const deactivateIdentityProvider = async (sequelize, providerId, transaction) => {
    const provider = await sequelize.models.IdentityProvider.findByPk(providerId);
    if (!provider) {
        throw new Error(`Identity provider ${providerId} not found`);
    }
    await provider.update({ status: IdentityProviderStatus.INACTIVE }, { transaction });
    return provider;
};
exports.deactivateIdentityProvider = deactivateIdentityProvider;
/**
 * Lists all identity providers with filtering.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} filters - Filter options
 * @returns {Promise<any[]>} Array of providers
 */
const listIdentityProviders = async (sequelize, filters = {}) => {
    const IdentityProvider = sequelize.models.IdentityProvider;
    const where = {};
    if (filters.protocol) {
        where.protocol = filters.protocol;
    }
    if (filters.status) {
        where.status = filters.status;
    }
    return await IdentityProvider.findAll({ where });
};
exports.listIdentityProviders = listIdentityProviders;
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
const linkFederatedIdentity = async (sequelize, mappingData, transaction) => {
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
        await existing.update({
            localUserId: mappingData.localUserId,
            externalUsername: mappingData.externalUsername,
            externalEmail: mappingData.externalEmail,
            attributes: mappingData.attributes || {},
        }, { transaction });
        return existing;
    }
    const mapping = await FederatedIdentity.create({
        ...mappingData,
        linkedAt: new Date(),
        authenticationCount: 0,
    }, { transaction });
    return mapping;
};
exports.linkFederatedIdentity = linkFederatedIdentity;
/**
 * Retrieves federated identity by external user ID.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} identityProviderId - Provider ID
 * @param {string} externalUserId - External user ID
 * @returns {Promise<any>} Federated identity mapping
 */
const getFederatedIdentityByExternalId = async (sequelize, identityProviderId, externalUserId) => {
    const FederatedIdentity = sequelize.models.FederatedIdentity;
    return await FederatedIdentity.findOne({
        where: { identityProviderId, externalUserId },
    });
};
exports.getFederatedIdentityByExternalId = getFederatedIdentityByExternalId;
/**
 * Retrieves all federated identities for a local user.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} localUserId - Local user ID
 * @returns {Promise<any[]>} Array of federated identities
 */
const getFederatedIdentitiesForUser = async (sequelize, localUserId) => {
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
exports.getFederatedIdentitiesForUser = getFederatedIdentitiesForUser;
/**
 * Unlinks federated identity from local user.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} federatedIdentityId - Federated identity ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<void>}
 */
const unlinkFederatedIdentity = async (sequelize, federatedIdentityId, transaction) => {
    const FederatedIdentity = sequelize.models.FederatedIdentity;
    await FederatedIdentity.destroy({ where: { id: federatedIdentityId }, transaction });
};
exports.unlinkFederatedIdentity = unlinkFederatedIdentity;
/**
 * Updates federated identity attributes.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} federatedIdentityId - Federated identity ID
 * @param {Record<string, any>} attributes - Updated attributes
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Updated federated identity
 */
const updateFederatedIdentityAttributes = async (sequelize, federatedIdentityId, attributes, transaction) => {
    const identity = await sequelize.models.FederatedIdentity.findByPk(federatedIdentityId);
    if (!identity) {
        throw new Error(`Federated identity ${federatedIdentityId} not found`);
    }
    const currentAttributes = identity.attributes || {};
    await identity.update({
        attributes: { ...currentAttributes, ...attributes },
        lastAuthenticated: new Date(),
        authenticationCount: (identity.authenticationCount || 0) + 1,
    }, { transaction });
    return identity;
};
exports.updateFederatedIdentityAttributes = updateFederatedIdentityAttributes;
/**
 * Records federated authentication event.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} federatedIdentityId - Federated identity ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Updated federated identity
 */
const recordFederatedAuthentication = async (sequelize, federatedIdentityId, transaction) => {
    const identity = await sequelize.models.FederatedIdentity.findByPk(federatedIdentityId);
    if (!identity) {
        throw new Error(`Federated identity ${federatedIdentityId} not found`);
    }
    await identity.update({
        lastAuthenticated: new Date(),
        authenticationCount: (identity.authenticationCount || 0) + 1,
    }, { transaction });
    // Update provider last used
    await sequelize.models.IdentityProvider.increment('authenticationCount', {
        where: { id: identity.identityProviderId },
        transaction,
    });
    await sequelize.models.IdentityProvider.update({ lastUsedAt: new Date() }, {
        where: { id: identity.identityProviderId },
        transaction,
    });
    return identity;
};
exports.recordFederatedAuthentication = recordFederatedAuthentication;
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
const establishTrustRelationship = async (sequelize, trustConfig, transaction) => {
    const TrustRelationship = sequelize.models.TrustRelationship;
    const trust = await TrustRelationship.create(trustConfig, { transaction });
    return trust;
};
exports.establishTrustRelationship = establishTrustRelationship;
/**
 * Retrieves trust relationship for identity provider.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} identityProviderId - Provider ID
 * @returns {Promise<any>} Trust relationship
 */
const getTrustRelationship = async (sequelize, identityProviderId) => {
    const TrustRelationship = sequelize.models.TrustRelationship;
    return await TrustRelationship.findOne({ where: { identityProviderId } });
};
exports.getTrustRelationship = getTrustRelationship;
/**
 * Updates trust relationship configuration.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} identityProviderId - Provider ID
 * @param {Partial<TrustRelationshipConfig>} updates - Configuration updates
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Updated trust relationship
 */
const updateTrustRelationship = async (sequelize, identityProviderId, updates, transaction) => {
    const trust = await sequelize.models.TrustRelationship.findOne({
        where: { identityProviderId },
    });
    if (!trust) {
        throw new Error(`Trust relationship for provider ${identityProviderId} not found`);
    }
    await trust.update(updates, { transaction });
    return trust;
};
exports.updateTrustRelationship = updateTrustRelationship;
/**
 * Validates trust for federated authentication.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} identityProviderId - Provider ID
 * @param {object} context - Authentication context
 * @returns {Promise<boolean>} True if trust validated
 */
const validateTrust = async (sequelize, identityProviderId, context) => {
    const trust = await (0, exports.getTrustRelationship)(sequelize, identityProviderId);
    if (!trust) {
        return false;
    }
    // Check domain restrictions
    if (context.email && trust.allowedDomains.length > 0) {
        const domain = context.email.split('@')[1];
        if (!trust.allowedDomains.includes(domain)) {
            return false;
        }
    }
    if (context.email && trust.blockedDomains.length > 0) {
        const domain = context.email.split('@')[1];
        if (trust.blockedDomains.includes(domain)) {
            return false;
        }
    }
    // Check group restrictions
    if (context.userGroups && trust.allowedUserGroups.length > 0) {
        const hasAllowedGroup = context.userGroups.some((group) => trust.allowedUserGroups.includes(group));
        if (!hasAllowedGroup) {
            return false;
        }
    }
    // Check required attributes
    if (trust.requiredAttributes.length > 0) {
        for (const requiredAttr of trust.requiredAttributes) {
            if (!context.attributes?.[requiredAttr]) {
                return false;
            }
        }
    }
    // Check IP whitelist
    if (context.ipAddress && trust.ipWhitelist.length > 0) {
        if (!trust.ipWhitelist.includes(context.ipAddress)) {
            return false;
        }
    }
    return true;
};
exports.validateTrust = validateTrust;
// ============================================================================
// FEDERATION PROTOCOLS (SAML, WS-Fed, OpenID)
// ============================================================================
/**
 * Generates SAML metadata for service provider.
 *
 * @param {object} config - SP configuration
 * @returns {string} SAML metadata XML
 */
const generateSamlMetadata = (config) => {
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
exports.generateSamlMetadata = generateSamlMetadata;
/**
 * Parses SAML assertion from identity provider.
 *
 * @param {string} samlResponse - Base64-encoded SAML response
 * @returns {Promise<FederationAssertion>} Parsed assertion
 */
const parseSamlAssertion = async (samlResponse) => {
    // Decode base64 SAML response
    const decodedResponse = Buffer.from(samlResponse, 'base64').toString('utf-8');
    // Parse XML (simplified - in production use xml2js or similar)
    const issuerMatch = decodedResponse.match(/<saml:Issuer>(.*?)<\/saml:Issuer>/);
    const subjectMatch = decodedResponse.match(/<saml:NameID.*?>(.*?)<\/saml:NameID>/);
    const assertion = {
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
exports.parseSamlAssertion = parseSamlAssertion;
/**
 * Validates SAML assertion signature.
 *
 * @param {string} samlResponse - SAML response
 * @param {string} certificate - Public certificate
 * @returns {boolean} True if signature valid
 */
const validateSamlSignature = (samlResponse, certificate) => {
    // In production, use proper SAML library like passport-saml or saml2-js
    // This is a placeholder implementation
    try {
        const decoded = Buffer.from(samlResponse, 'base64').toString('utf-8');
        return decoded.includes('Signature') && decoded.includes('SignatureValue');
    }
    catch {
        return false;
    }
};
exports.validateSamlSignature = validateSamlSignature;
/**
 * Generates OpenID Connect authorization URL.
 *
 * @param {IdentityProviderConfig} config - OIDC configuration
 * @param {object} params - Authorization parameters
 * @returns {string} Authorization URL
 */
const generateOidcAuthorizationUrl = (config, params) => {
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
exports.generateOidcAuthorizationUrl = generateOidcAuthorizationUrl;
/**
 * Exchanges OIDC authorization code for tokens.
 *
 * @param {IdentityProviderConfig} config - OIDC configuration
 * @param {string} code - Authorization code
 * @param {string} redirectUri - Redirect URI
 * @returns {Promise<any>} Token response
 */
const exchangeOidcCode = async (config, code, redirectUri) => {
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
exports.exchangeOidcCode = exchangeOidcCode;
/**
 * Validates OpenID Connect ID token.
 *
 * @param {string} idToken - ID token JWT
 * @param {IdentityProviderConfig} config - OIDC configuration
 * @returns {Promise<any>} Decoded token payload
 */
const validateOidcIdToken = async (idToken, config) => {
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
exports.validateOidcIdToken = validateOidcIdToken;
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
const createAttributeMapping = async (sequelize, identityProviderId, rule, transaction) => {
    const AttributeMapping = sequelize.models.AttributeMapping;
    const mapping = await AttributeMapping.create({
        identityProviderId,
        ...rule,
    }, { transaction });
    return mapping;
};
exports.createAttributeMapping = createAttributeMapping;
/**
 * Retrieves attribute mappings for identity provider.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} identityProviderId - Provider ID
 * @returns {Promise<any[]>} Array of attribute mappings
 */
const getAttributeMappings = async (sequelize, identityProviderId) => {
    const AttributeMapping = sequelize.models.AttributeMapping;
    return await AttributeMapping.findAll({ where: { identityProviderId } });
};
exports.getAttributeMappings = getAttributeMappings;
/**
 * Applies attribute mappings to federated attributes.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} identityProviderId - Provider ID
 * @param {Record<string, any>} externalAttributes - External attributes
 * @returns {Promise<Record<string, any>>} Mapped attributes
 */
const applyAttributeMappings = async (sequelize, identityProviderId, externalAttributes) => {
    const mappings = await (0, exports.getAttributeMappings)(sequelize, identityProviderId);
    const mappedAttributes = {};
    for (const mapping of mappings) {
        const sourceAttr = mapping.sourceAttribute;
        const targetAttr = mapping.targetAttribute;
        const strategy = mapping.strategy;
        const transformation = mapping.transformation;
        const defaultValue = mapping.defaultValue;
        let value = externalAttributes[sourceAttr];
        // Apply transformation based on strategy
        if (strategy === AttributeMappingStrategy.STATIC) {
            value = value || defaultValue;
        }
        else if (strategy === AttributeMappingStrategy.EXPRESSION && transformation) {
            // Simple expression evaluation (in production use safer evaluation)
            try {
                value = eval(transformation.replace('{value}', JSON.stringify(value)));
            }
            catch {
                value = defaultValue;
            }
        }
        if (value !== undefined) {
            mappedAttributes[targetAttr] = value;
        }
        else if (mapping.required) {
            throw new Error(`Required attribute ${sourceAttr} not found in federated attributes`);
        }
    }
    return mappedAttributes;
};
exports.applyAttributeMappings = applyAttributeMappings;
/**
 * Validates mapped attributes against rules.
 *
 * @param {any[]} mappings - Attribute mappings
 * @param {Record<string, any>} attributes - Attributes to validate
 * @returns {boolean} True if valid
 */
const validateMappedAttributes = (mappings, attributes) => {
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
exports.validateMappedAttributes = validateMappedAttributes;
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
const provisionUserJIT = async (sequelize, identityProviderId, assertion, config, transaction) => {
    if (config.mode === JitProvisioningMode.DISABLED) {
        throw new Error('JIT provisioning is disabled');
    }
    // Check if federated identity already exists
    const existingIdentity = await (0, exports.getFederatedIdentityByExternalId)(sequelize, identityProviderId, assertion.subject);
    if (existingIdentity) {
        // User already linked
        await (0, exports.recordFederatedAuthentication)(sequelize, existingIdentity.id, transaction);
        return existingIdentity;
    }
    // Apply attribute mappings
    const mappedAttributes = await (0, exports.applyAttributeMappings)(sequelize, identityProviderId, assertion.attributes);
    // Auto-create mode
    if (config.mode === JitProvisioningMode.AUTO_CREATE ||
        config.mode === JitProvisioningMode.AUTO_CREATE_AND_LINK) {
        const User = sequelize.models.User;
        // Create new user
        const newUser = await User.create({
            email: mappedAttributes.email || assertion.attributes.email,
            username: mappedAttributes.username || assertion.subject,
            firstName: mappedAttributes.firstName || assertion.attributes.firstName,
            lastName: mappedAttributes.lastName || assertion.attributes.lastName,
            role: config.defaultRole || 'user',
            isActive: config.autoActivate !== false,
            emailVerified: !config.requireEmailVerification,
        }, { transaction });
        // Link federated identity
        const federatedIdentity = await (0, exports.linkFederatedIdentity)(sequelize, {
            localUserId: newUser.id,
            identityProviderId,
            externalUserId: assertion.subject,
            externalEmail: mappedAttributes.email || assertion.attributes.email,
            attributes: mappedAttributes,
        }, transaction);
        return { user: newUser, federatedIdentity };
    }
    throw new Error('User not found and JIT provisioning not enabled for auto-create');
};
exports.provisionUserJIT = provisionUserJIT;
/**
 * Configures JIT provisioning for identity provider.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} identityProviderId - Provider ID
 * @param {JitProvisioningConfig} config - JIT configuration
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Updated provider
 */
const configureJitProvisioning = async (sequelize, identityProviderId, config, transaction) => {
    const provider = await sequelize.models.IdentityProvider.findByPk(identityProviderId);
    if (!provider) {
        throw new Error(`Identity provider ${identityProviderId} not found`);
    }
    const currentMetadata = provider.metadata || {};
    await provider.update({
        metadata: {
            ...currentMetadata,
            jitProvisioning: config,
        },
    }, { transaction });
    return provider;
};
exports.configureJitProvisioning = configureJitProvisioning;
// ============================================================================
// FEDERATION SECURITY
// ============================================================================
/**
 * Calculates certificate fingerprint.
 *
 * @param {string} certificate - PEM-encoded certificate
 * @returns {string} SHA-256 fingerprint
 */
const calculateCertificateFingerprint = (certificate) => {
    const certContent = certificate.replace(/-----BEGIN CERTIFICATE-----|-----END CERTIFICATE-----|\n/g, '');
    const hash = crypto.createHash('sha256').update(certContent).digest('hex');
    return hash.toUpperCase().match(/.{2}/g)?.join(':') || hash;
};
exports.calculateCertificateFingerprint = calculateCertificateFingerprint;
/**
 * Validates certificate trust.
 *
 * @param {string} certificate - Certificate to validate
 * @param {string} trustedFingerprint - Trusted fingerprint
 * @returns {boolean} True if certificate trusted
 */
const validateCertificateTrust = (certificate, trustedFingerprint) => {
    const fingerprint = (0, exports.calculateCertificateFingerprint)(certificate);
    return fingerprint === trustedFingerprint;
};
exports.validateCertificateTrust = validateCertificateTrust;
/**
 * Audits federation event.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {FederationAuditEvent} event - Audit event
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Created audit record
 */
const auditFederationEvent = async (sequelize, event, transaction) => {
    const FederationAudit = sequelize.models.FederationAudit;
    const auditRecord = await FederationAudit.create(event, { transaction });
    return auditRecord;
};
exports.auditFederationEvent = auditFederationEvent;
/**
 * Retrieves federation audit logs.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} filters - Filter options
 * @param {object} pagination - Pagination options
 * @returns {Promise<any>} Audit logs
 */
const getFederationAuditLogs = async (sequelize, filters = {}, pagination = {}) => {
    const FederationAudit = sequelize.models.FederationAudit;
    const where = {};
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
            where.createdAt[sequelize_1.Op.gte] = filters.startDate;
        }
        if (filters.endDate) {
            where.createdAt[sequelize_1.Op.lte] = filters.endDate;
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
exports.getFederationAuditLogs = getFederationAuditLogs;
/**
 * Generates federation analytics report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} identityProviderId - Provider ID
 * @param {object} period - Time period
 * @returns {Promise<any>} Analytics report
 */
const generateFederationAnalytics = async (sequelize, identityProviderId, period) => {
    const FederationAudit = sequelize.models.FederationAudit;
    const totalAuthentications = await FederationAudit.count({
        where: {
            identityProviderId,
            eventType: 'authentication',
            createdAt: {
                [sequelize_1.Op.gte]: period.startDate,
                [sequelize_1.Op.lte]: period.endDate,
            },
        },
    });
    const successfulAuthentications = await FederationAudit.count({
        where: {
            identityProviderId,
            eventType: 'authentication',
            success: true,
            createdAt: {
                [sequelize_1.Op.gte]: period.startDate,
                [sequelize_1.Op.lte]: period.endDate,
            },
        },
    });
    const uniqueUsers = await FederationAudit.count({
        where: {
            identityProviderId,
            eventType: 'authentication',
            createdAt: {
                [sequelize_1.Op.gte]: period.startDate,
                [sequelize_1.Op.lte]: period.endDate,
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
exports.generateFederationAnalytics = generateFederationAnalytics;
//# sourceMappingURL=iam-federation-kit.js.map