"use strict";
/**
 * LOC: LEGAL_ENTITY_MGMT_KIT_001
 * File: /reuse/legal/legal-entity-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/config
 *   - sequelize-typescript
 *   - sequelize
 *   - @nestjs/swagger
 *   - zod
 *   - crypto
 *   - node-cron
 *
 * DOWNSTREAM (imported by):
 *   - Legal entity modules
 *   - Corporate structure controllers
 *   - Ownership tracking services
 *   - Compliance calendar services
 *   - Entity search services
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
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplianceEventDto = exports.EntityResponseDto = exports.CreateEntityDto = exports.LegalEntityManagementModule = exports.legalEntityManagementConfig = exports.LegalEntityManagementService = exports.ComplianceEventModel = exports.EntityOfficerModel = exports.OwnershipStakeModel = exports.EntityRelationshipModel = exports.LegalEntityModel = exports.EntitySearchCriteriaSchema = exports.ComplianceEventSchema = exports.EntityFormationRequestSchema = exports.EntityAddressSchema = exports.EntityRelationshipType = exports.OwnershipType = exports.ComplianceStatus = exports.ComplianceEventType = exports.OfficerRole = exports.TaxClassification = exports.EntityType = exports.EntityStatus = void 0;
/**
 * File: /reuse/legal/legal-entity-management-kit.ts
 * Locator: WC-LEGAL-ENTITY-MGMT-KIT-001
 * Purpose: Production-Grade Legal Entity Management Kit - Enterprise legal entity lifecycle management toolkit
 *
 * Upstream: NestJS, Sequelize, Zod, Node-Cron, Crypto
 * Downstream: ../backend/modules/legal/*, Entity workflow controllers, Compliance services
 * Dependencies: TypeScript 5.x, Node 18+, sequelize-typescript, @nestjs/swagger, zod
 * Exports: 36 production-ready legal entity management functions for legal platforms
 *
 * LLM Context: Production-grade legal entity lifecycle management toolkit for White Cross platform.
 * Provides comprehensive entity formation with automated filing and registration, corporate structure
 * management with hierarchical relationships and subsidiaries, ownership tracking with equity stakes
 * and shareholder management, compliance calendar with automated deadline tracking and notifications,
 * entity search with full-text and advanced filters, Sequelize models for entities/ownership/compliance,
 * NestJS services with dependency injection, Swagger API documentation, entity status lifecycle management,
 * registered agent management, jurisdiction and incorporation tracking, entity document management,
 * shareholder and membership tracking, corporate officer and director management, equity distribution
 * and cap table, entity merger and acquisition tracking, entity dissolution and termination, entity
 * type conversions, entity filing automation, entity verification and validation, entity reporting
 * requirements, entity tax status tracking, entity annual report filing, entity compliance alerts,
 * entity audit logging, entity relationship mapping, multi-jurisdiction entity management, entity
 * search by various criteria, entity health monitoring, and healthcare-specific entity types.
 */
const crypto = __importStar(require("crypto"));
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const sequelize_typescript_1 = require("sequelize-typescript");
const swagger_1 = require("@nestjs/swagger");
const zod_1 = require("zod");
const sequelize_1 = require("sequelize");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Legal entity status lifecycle
 */
var EntityStatus;
(function (EntityStatus) {
    EntityStatus["PLANNED"] = "planned";
    EntityStatus["FORMATION_IN_PROGRESS"] = "formation_in_progress";
    EntityStatus["ACTIVE"] = "active";
    EntityStatus["INACTIVE"] = "inactive";
    EntityStatus["SUSPENDED"] = "suspended";
    EntityStatus["DISSOLVED"] = "dissolved";
    EntityStatus["MERGED"] = "merged";
    EntityStatus["ACQUIRED"] = "acquired";
    EntityStatus["BANKRUPTCY"] = "bankruptcy";
    EntityStatus["GOOD_STANDING"] = "good_standing";
    EntityStatus["NOT_IN_GOOD_STANDING"] = "not_in_good_standing";
    EntityStatus["REVOKED"] = "revoked";
    EntityStatus["WITHDRAWN"] = "withdrawn";
})(EntityStatus || (exports.EntityStatus = EntityStatus = {}));
/**
 * Legal entity type categories
 */
var EntityType;
(function (EntityType) {
    EntityType["CORPORATION"] = "corporation";
    EntityType["LLC"] = "llc";
    EntityType["LLP"] = "llp";
    EntityType["PARTNERSHIP"] = "partnership";
    EntityType["SOLE_PROPRIETORSHIP"] = "sole_proprietorship";
    EntityType["NONPROFIT"] = "nonprofit";
    EntityType["PROFESSIONAL_CORPORATION"] = "professional_corporation";
    EntityType["S_CORPORATION"] = "s_corporation";
    EntityType["C_CORPORATION"] = "c_corporation";
    EntityType["BENEFIT_CORPORATION"] = "benefit_corporation";
    EntityType["COOPERATIVE"] = "cooperative";
    EntityType["JOINT_VENTURE"] = "joint_venture";
    EntityType["TRUST"] = "trust";
    EntityType["HOLDING_COMPANY"] = "holding_company";
    EntityType["SUBSIDIARY"] = "subsidiary";
    EntityType["BRANCH"] = "branch";
    EntityType["DIVISION"] = "division";
    EntityType["OTHER"] = "other";
})(EntityType || (exports.EntityType = EntityType = {}));
/**
 * Tax classification types
 */
var TaxClassification;
(function (TaxClassification) {
    TaxClassification["C_CORP"] = "c_corp";
    TaxClassification["S_CORP"] = "s_corp";
    TaxClassification["PARTNERSHIP"] = "partnership";
    TaxClassification["DISREGARDED_ENTITY"] = "disregarded_entity";
    TaxClassification["TRUST"] = "trust";
    TaxClassification["NONPROFIT_501C3"] = "nonprofit_501c3";
    TaxClassification["NONPROFIT_501C4"] = "nonprofit_501c4";
    TaxClassification["NONPROFIT_501C6"] = "nonprofit_501c6";
    TaxClassification["OTHER"] = "other";
})(TaxClassification || (exports.TaxClassification = TaxClassification = {}));
/**
 * Officer/Director role types
 */
var OfficerRole;
(function (OfficerRole) {
    OfficerRole["CEO"] = "ceo";
    OfficerRole["CFO"] = "cfo";
    OfficerRole["COO"] = "coo";
    OfficerRole["CTO"] = "cto";
    OfficerRole["PRESIDENT"] = "president";
    OfficerRole["VICE_PRESIDENT"] = "vice_president";
    OfficerRole["SECRETARY"] = "secretary";
    OfficerRole["TREASURER"] = "treasurer";
    OfficerRole["DIRECTOR"] = "director";
    OfficerRole["BOARD_CHAIR"] = "board_chair";
    OfficerRole["MANAGING_MEMBER"] = "managing_member";
    OfficerRole["MEMBER"] = "member";
    OfficerRole["PARTNER"] = "partner";
    OfficerRole["MANAGING_PARTNER"] = "managing_partner";
    OfficerRole["GENERAL_PARTNER"] = "general_partner";
    OfficerRole["LIMITED_PARTNER"] = "limited_partner";
    OfficerRole["REGISTERED_AGENT"] = "registered_agent";
    OfficerRole["OTHER"] = "other";
})(OfficerRole || (exports.OfficerRole = OfficerRole = {}));
/**
 * Compliance event types
 */
var ComplianceEventType;
(function (ComplianceEventType) {
    ComplianceEventType["ANNUAL_REPORT"] = "annual_report";
    ComplianceEventType["TAX_FILING"] = "tax_filing";
    ComplianceEventType["FRANCHISE_TAX"] = "franchise_tax";
    ComplianceEventType["REGISTRATION_RENEWAL"] = "registration_renewal";
    ComplianceEventType["LICENSE_RENEWAL"] = "license_renewal";
    ComplianceEventType["BOARD_MEETING"] = "board_meeting";
    ComplianceEventType["SHAREHOLDER_MEETING"] = "shareholder_meeting";
    ComplianceEventType["REGULATORY_FILING"] = "regulatory_filing";
    ComplianceEventType["AUDIT"] = "audit";
    ComplianceEventType["PERMIT_RENEWAL"] = "permit_renewal";
    ComplianceEventType["INSURANCE_RENEWAL"] = "insurance_renewal";
    ComplianceEventType["ACCREDITATION_RENEWAL"] = "accreditation_renewal";
    ComplianceEventType["CERTIFICATION_RENEWAL"] = "certification_renewal";
    ComplianceEventType["OTHER"] = "other";
})(ComplianceEventType || (exports.ComplianceEventType = ComplianceEventType = {}));
/**
 * Compliance event status
 */
var ComplianceStatus;
(function (ComplianceStatus) {
    ComplianceStatus["UPCOMING"] = "upcoming";
    ComplianceStatus["DUE_SOON"] = "due_soon";
    ComplianceStatus["OVERDUE"] = "overdue";
    ComplianceStatus["COMPLETED"] = "completed";
    ComplianceStatus["FILED"] = "filed";
    ComplianceStatus["WAIVED"] = "waived";
    ComplianceStatus["NOT_APPLICABLE"] = "not_applicable";
})(ComplianceStatus || (exports.ComplianceStatus = ComplianceStatus = {}));
/**
 * Ownership type
 */
var OwnershipType;
(function (OwnershipType) {
    OwnershipType["COMMON_STOCK"] = "common_stock";
    OwnershipType["PREFERRED_STOCK"] = "preferred_stock";
    OwnershipType["MEMBERSHIP_INTEREST"] = "membership_interest";
    OwnershipType["PARTNERSHIP_INTEREST"] = "partnership_interest";
    OwnershipType["EQUITY_OPTION"] = "equity_option";
    OwnershipType["WARRANT"] = "warrant";
    OwnershipType["CONVERTIBLE_NOTE"] = "convertible_note";
    OwnershipType["OTHER"] = "other";
})(OwnershipType || (exports.OwnershipType = OwnershipType = {}));
/**
 * Entity relationship types
 */
var EntityRelationshipType;
(function (EntityRelationshipType) {
    EntityRelationshipType["PARENT"] = "parent";
    EntityRelationshipType["SUBSIDIARY"] = "subsidiary";
    EntityRelationshipType["AFFILIATE"] = "affiliate";
    EntityRelationshipType["SISTER_COMPANY"] = "sister_company";
    EntityRelationshipType["PREDECESSOR"] = "predecessor";
    EntityRelationshipType["SUCCESSOR"] = "successor";
    EntityRelationshipType["MERGED_INTO"] = "merged_into";
    EntityRelationshipType["ACQUIRED_BY"] = "acquired_by";
    EntityRelationshipType["JOINT_VENTURE_PARTNER"] = "joint_venture_partner";
    EntityRelationshipType["OTHER"] = "other";
})(EntityRelationshipType || (exports.EntityRelationshipType = EntityRelationshipType = {}));
// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================
/**
 * Entity address validation schema
 */
exports.EntityAddressSchema = zod_1.z.object({
    street1: zod_1.z.string().min(1).max(255),
    street2: zod_1.z.string().max(255).optional(),
    city: zod_1.z.string().min(1).max(100),
    state: zod_1.z.string().min(2).max(50),
    postalCode: zod_1.z.string().min(1).max(20),
    country: zod_1.z.string().min(2).max(2).default('US'),
});
/**
 * Entity formation request validation schema
 */
exports.EntityFormationRequestSchema = zod_1.z.object({
    legalName: zod_1.z.string().min(1).max(500),
    dbaName: zod_1.z.string().max(500).optional(),
    entityType: zod_1.z.nativeEnum(EntityType),
    incorporationJurisdiction: zod_1.z.string().min(2).max(50),
    businessPurpose: zod_1.z.string().min(1).max(2000),
    registeredAgentName: zod_1.z.string().min(1).max(255),
    registeredAgentAddress: exports.EntityAddressSchema,
    principalAddress: exports.EntityAddressSchema,
    taxClassification: zod_1.z.nativeEnum(TaxClassification).optional(),
    fiscalYearEnd: zod_1.z.string().regex(/^\d{2}-\d{2}$/).optional(),
    initialOfficers: zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string().min(1).max(255),
        role: zod_1.z.nativeEnum(OfficerRole),
        appointmentDate: zod_1.z.date(),
        email: zod_1.z.string().email().optional(),
        phone: zod_1.z.string().optional(),
        address: zod_1.z.string().optional(),
        compensation: zod_1.z.number().optional(),
        metadata: zod_1.z.record(zod_1.z.any()).default({}),
    })).min(1),
    initialOwners: zod_1.z.array(zod_1.z.object({
        ownerType: zod_1.z.enum(['individual', 'entity']),
        ownerId: zod_1.z.string(),
        ownerName: zod_1.z.string().min(1).max(255),
        ownershipType: zod_1.z.nativeEnum(OwnershipType),
        sharesOwned: zod_1.z.number().optional(),
        percentageOwned: zod_1.z.number().min(0).max(100).optional(),
        votingRights: zod_1.z.boolean().default(true),
        votingPercentage: zod_1.z.number().min(0).max(100).optional(),
        acquisitionDate: zod_1.z.date().optional(),
        acquisitionPrice: zod_1.z.number().optional(),
        metadata: zod_1.z.record(zod_1.z.any()).default({}),
    })).min(1),
    parentEntityId: zod_1.z.string().uuid().optional(),
    metadata: zod_1.z.object({
        tags: zod_1.z.array(zod_1.z.string()).default([]),
        industry: zod_1.z.string().optional(),
        naicsCode: zod_1.z.string().optional(),
        sicCode: zod_1.z.string().optional(),
        employeeCount: zod_1.z.number().optional(),
        annualRevenue: zod_1.z.number().optional(),
        customFields: zod_1.z.record(zod_1.z.any()).default({}),
        notes: zod_1.z.string().optional(),
        externalIds: zod_1.z.record(zod_1.z.string()).default({}),
    }).optional(),
});
/**
 * Compliance event creation schema
 */
exports.ComplianceEventSchema = zod_1.z.object({
    entityId: zod_1.z.string().uuid(),
    eventType: zod_1.z.nativeEnum(ComplianceEventType),
    title: zod_1.z.string().min(1).max(500),
    description: zod_1.z.string().max(2000).optional(),
    dueDate: zod_1.z.date(),
    jurisdiction: zod_1.z.string().max(50).optional(),
    assignedTo: zod_1.z.string().uuid().optional(),
    reminderDays: zod_1.z.array(zod_1.z.number()).default([30, 14, 7, 1]),
    recurring: zod_1.z.boolean().default(false),
    recurrenceRule: zod_1.z.string().optional(),
    priority: zod_1.z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
    penalties: zod_1.z.string().max(1000).optional(),
    estimatedCost: zod_1.z.number().optional(),
    metadata: zod_1.z.record(zod_1.z.any()).default({}),
});
/**
 * Entity search criteria schema
 */
exports.EntitySearchCriteriaSchema = zod_1.z.object({
    query: zod_1.z.string().max(500).optional(),
    entityType: zod_1.z.array(zod_1.z.nativeEnum(EntityType)).optional(),
    status: zod_1.z.array(zod_1.z.nativeEnum(EntityStatus)).optional(),
    jurisdiction: zod_1.z.array(zod_1.z.string()).optional(),
    taxClassification: zod_1.z.array(zod_1.z.nativeEnum(TaxClassification)).optional(),
    parentEntityId: zod_1.z.string().uuid().optional(),
    hasParent: zod_1.z.boolean().optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    createdAfter: zod_1.z.date().optional(),
    createdBefore: zod_1.z.date().optional(),
    limit: zod_1.z.number().min(1).max(1000).default(50),
    offset: zod_1.z.number().min(0).default(0),
    sortBy: zod_1.z.string().default('createdAt'),
    sortOrder: zod_1.z.enum(['ASC', 'DESC']).default('DESC'),
});
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Legal Entity Sequelize Model
 */
let LegalEntityModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'legal_entities',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['entity_number'], unique: true },
                { fields: ['legal_name'] },
                { fields: ['entity_type'] },
                { fields: ['status'] },
                { fields: ['incorporation_jurisdiction'] },
                { fields: ['parent_entity_id'] },
                { fields: ['tax_id'] },
                { fields: ['tenant_id'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _entityNumber_decorators;
    let _entityNumber_initializers = [];
    let _entityNumber_extraInitializers = [];
    let _legalName_decorators;
    let _legalName_initializers = [];
    let _legalName_extraInitializers = [];
    let _dbaName_decorators;
    let _dbaName_initializers = [];
    let _dbaName_extraInitializers = [];
    let _entityType_decorators;
    let _entityType_initializers = [];
    let _entityType_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _taxClassification_decorators;
    let _taxClassification_initializers = [];
    let _taxClassification_extraInitializers = [];
    let _taxId_decorators;
    let _taxId_initializers = [];
    let _taxId_extraInitializers = [];
    let _incorporationJurisdiction_decorators;
    let _incorporationJurisdiction_initializers = [];
    let _incorporationJurisdiction_extraInitializers = [];
    let _incorporationDate_decorators;
    let _incorporationDate_initializers = [];
    let _incorporationDate_extraInitializers = [];
    let _dissolutionDate_decorators;
    let _dissolutionDate_initializers = [];
    let _dissolutionDate_extraInitializers = [];
    let _fiscalYearEnd_decorators;
    let _fiscalYearEnd_initializers = [];
    let _fiscalYearEnd_extraInitializers = [];
    let _businessPurpose_decorators;
    let _businessPurpose_initializers = [];
    let _businessPurpose_extraInitializers = [];
    let _registeredAgentName_decorators;
    let _registeredAgentName_initializers = [];
    let _registeredAgentName_extraInitializers = [];
    let _registeredAgentAddress_decorators;
    let _registeredAgentAddress_initializers = [];
    let _registeredAgentAddress_extraInitializers = [];
    let _principalAddress_decorators;
    let _principalAddress_initializers = [];
    let _principalAddress_extraInitializers = [];
    let _mailingAddress_decorators;
    let _mailingAddress_initializers = [];
    let _mailingAddress_extraInitializers = [];
    let _phoneNumber_decorators;
    let _phoneNumber_initializers = [];
    let _phoneNumber_extraInitializers = [];
    let _email_decorators;
    let _email_initializers = [];
    let _email_extraInitializers = [];
    let _website_decorators;
    let _website_initializers = [];
    let _website_extraInitializers = [];
    let _parentEntityId_decorators;
    let _parentEntityId_initializers = [];
    let _parentEntityId_extraInitializers = [];
    let _parentEntity_decorators;
    let _parentEntity_initializers = [];
    let _parentEntity_extraInitializers = [];
    let _subsidiaries_decorators;
    let _subsidiaries_initializers = [];
    let _subsidiaries_extraInitializers = [];
    let _childRelationships_decorators;
    let _childRelationships_initializers = [];
    let _childRelationships_extraInitializers = [];
    let _parentRelationships_decorators;
    let _parentRelationships_initializers = [];
    let _parentRelationships_extraInitializers = [];
    let _ownershipStakes_decorators;
    let _ownershipStakes_initializers = [];
    let _ownershipStakes_extraInitializers = [];
    let _officers_decorators;
    let _officers_initializers = [];
    let _officers_extraInitializers = [];
    let _complianceEvents_decorators;
    let _complianceEvents_initializers = [];
    let _complianceEvents_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _tenantId_decorators;
    let _tenantId_initializers = [];
    let _tenantId_extraInitializers = [];
    let _createdBy_decorators;
    let _createdBy_initializers = [];
    let _createdBy_extraInitializers = [];
    let _updatedBy_decorators;
    let _updatedBy_initializers = [];
    let _updatedBy_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var LegalEntityModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.entityNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _entityNumber_initializers, void 0));
            this.legalName = (__runInitializers(this, _entityNumber_extraInitializers), __runInitializers(this, _legalName_initializers, void 0));
            this.dbaName = (__runInitializers(this, _legalName_extraInitializers), __runInitializers(this, _dbaName_initializers, void 0));
            this.entityType = (__runInitializers(this, _dbaName_extraInitializers), __runInitializers(this, _entityType_initializers, void 0));
            this.status = (__runInitializers(this, _entityType_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.taxClassification = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _taxClassification_initializers, void 0));
            this.taxId = (__runInitializers(this, _taxClassification_extraInitializers), __runInitializers(this, _taxId_initializers, void 0));
            this.incorporationJurisdiction = (__runInitializers(this, _taxId_extraInitializers), __runInitializers(this, _incorporationJurisdiction_initializers, void 0));
            this.incorporationDate = (__runInitializers(this, _incorporationJurisdiction_extraInitializers), __runInitializers(this, _incorporationDate_initializers, void 0));
            this.dissolutionDate = (__runInitializers(this, _incorporationDate_extraInitializers), __runInitializers(this, _dissolutionDate_initializers, void 0));
            this.fiscalYearEnd = (__runInitializers(this, _dissolutionDate_extraInitializers), __runInitializers(this, _fiscalYearEnd_initializers, void 0));
            this.businessPurpose = (__runInitializers(this, _fiscalYearEnd_extraInitializers), __runInitializers(this, _businessPurpose_initializers, void 0));
            this.registeredAgentName = (__runInitializers(this, _businessPurpose_extraInitializers), __runInitializers(this, _registeredAgentName_initializers, void 0));
            this.registeredAgentAddress = (__runInitializers(this, _registeredAgentName_extraInitializers), __runInitializers(this, _registeredAgentAddress_initializers, void 0));
            this.principalAddress = (__runInitializers(this, _registeredAgentAddress_extraInitializers), __runInitializers(this, _principalAddress_initializers, void 0));
            this.mailingAddress = (__runInitializers(this, _principalAddress_extraInitializers), __runInitializers(this, _mailingAddress_initializers, void 0));
            this.phoneNumber = (__runInitializers(this, _mailingAddress_extraInitializers), __runInitializers(this, _phoneNumber_initializers, void 0));
            this.email = (__runInitializers(this, _phoneNumber_extraInitializers), __runInitializers(this, _email_initializers, void 0));
            this.website = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _website_initializers, void 0));
            this.parentEntityId = (__runInitializers(this, _website_extraInitializers), __runInitializers(this, _parentEntityId_initializers, void 0));
            this.parentEntity = (__runInitializers(this, _parentEntityId_extraInitializers), __runInitializers(this, _parentEntity_initializers, void 0));
            this.subsidiaries = (__runInitializers(this, _parentEntity_extraInitializers), __runInitializers(this, _subsidiaries_initializers, void 0));
            this.childRelationships = (__runInitializers(this, _subsidiaries_extraInitializers), __runInitializers(this, _childRelationships_initializers, void 0));
            this.parentRelationships = (__runInitializers(this, _childRelationships_extraInitializers), __runInitializers(this, _parentRelationships_initializers, void 0));
            this.ownershipStakes = (__runInitializers(this, _parentRelationships_extraInitializers), __runInitializers(this, _ownershipStakes_initializers, void 0));
            this.officers = (__runInitializers(this, _ownershipStakes_extraInitializers), __runInitializers(this, _officers_initializers, void 0));
            this.complianceEvents = (__runInitializers(this, _officers_extraInitializers), __runInitializers(this, _complianceEvents_initializers, void 0));
            this.metadata = (__runInitializers(this, _complianceEvents_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.tenantId = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _tenantId_initializers, void 0));
            this.createdBy = (__runInitializers(this, _tenantId_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.updatedBy = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _updatedBy_initializers, void 0));
            this.createdAt = (__runInitializers(this, _updatedBy_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "LegalEntityModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _entityNumber_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                unique: true,
                allowNull: false,
                field: 'entity_number',
            })];
        _legalName_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(500),
                allowNull: false,
                field: 'legal_name',
            })];
        _dbaName_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(500),
                field: 'dba_name',
            })];
        _entityType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(EntityType)),
                allowNull: false,
                field: 'entity_type',
            })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(EntityStatus)),
                allowNull: false,
                defaultValue: EntityStatus.PLANNED,
            })];
        _taxClassification_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(TaxClassification)),
                field: 'tax_classification',
            })];
        _taxId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                field: 'tax_id',
            })];
        _incorporationJurisdiction_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
                field: 'incorporation_jurisdiction',
            })];
        _incorporationDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                field: 'incorporation_date',
            })];
        _dissolutionDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                field: 'dissolution_date',
            })];
        _fiscalYearEnd_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(5),
                field: 'fiscal_year_end',
            })];
        _businessPurpose_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                field: 'business_purpose',
            })];
        _registeredAgentName_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                field: 'registered_agent_name',
            })];
        _registeredAgentAddress_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                field: 'registered_agent_address',
            })];
        _principalAddress_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: false,
                field: 'principal_address',
            })];
        _mailingAddress_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                field: 'mailing_address',
            })];
        _phoneNumber_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                field: 'phone_number',
            })];
        _email_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255))];
        _website_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(500))];
        _parentEntityId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => LegalEntityModel), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                field: 'parent_entity_id',
            })];
        _parentEntity_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => LegalEntityModel, 'parent_entity_id')];
        _subsidiaries_decorators = [(0, sequelize_typescript_1.HasMany)(() => LegalEntityModel, 'parent_entity_id')];
        _childRelationships_decorators = [(0, sequelize_typescript_1.HasMany)(() => EntityRelationshipModel, 'parent_entity_id')];
        _parentRelationships_decorators = [(0, sequelize_typescript_1.HasMany)(() => EntityRelationshipModel, 'child_entity_id')];
        _ownershipStakes_decorators = [(0, sequelize_typescript_1.HasMany)(() => OwnershipStakeModel)];
        _officers_decorators = [(0, sequelize_typescript_1.HasMany)(() => EntityOfficerModel)];
        _complianceEvents_decorators = [(0, sequelize_typescript_1.HasMany)(() => ComplianceEventModel)];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: false,
                defaultValue: {
                    tags: [],
                    customFields: {},
                    externalIds: {},
                },
            })];
        _tenantId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                field: 'tenant_id',
            })];
        _createdBy_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'created_by',
            })];
        _updatedBy_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                field: 'updated_by',
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt, (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                field: 'created_at',
            })];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt, (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                field: 'updated_at',
            })];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt, (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                field: 'deleted_at',
            })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _entityNumber_decorators, { kind: "field", name: "entityNumber", static: false, private: false, access: { has: obj => "entityNumber" in obj, get: obj => obj.entityNumber, set: (obj, value) => { obj.entityNumber = value; } }, metadata: _metadata }, _entityNumber_initializers, _entityNumber_extraInitializers);
        __esDecorate(null, null, _legalName_decorators, { kind: "field", name: "legalName", static: false, private: false, access: { has: obj => "legalName" in obj, get: obj => obj.legalName, set: (obj, value) => { obj.legalName = value; } }, metadata: _metadata }, _legalName_initializers, _legalName_extraInitializers);
        __esDecorate(null, null, _dbaName_decorators, { kind: "field", name: "dbaName", static: false, private: false, access: { has: obj => "dbaName" in obj, get: obj => obj.dbaName, set: (obj, value) => { obj.dbaName = value; } }, metadata: _metadata }, _dbaName_initializers, _dbaName_extraInitializers);
        __esDecorate(null, null, _entityType_decorators, { kind: "field", name: "entityType", static: false, private: false, access: { has: obj => "entityType" in obj, get: obj => obj.entityType, set: (obj, value) => { obj.entityType = value; } }, metadata: _metadata }, _entityType_initializers, _entityType_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _taxClassification_decorators, { kind: "field", name: "taxClassification", static: false, private: false, access: { has: obj => "taxClassification" in obj, get: obj => obj.taxClassification, set: (obj, value) => { obj.taxClassification = value; } }, metadata: _metadata }, _taxClassification_initializers, _taxClassification_extraInitializers);
        __esDecorate(null, null, _taxId_decorators, { kind: "field", name: "taxId", static: false, private: false, access: { has: obj => "taxId" in obj, get: obj => obj.taxId, set: (obj, value) => { obj.taxId = value; } }, metadata: _metadata }, _taxId_initializers, _taxId_extraInitializers);
        __esDecorate(null, null, _incorporationJurisdiction_decorators, { kind: "field", name: "incorporationJurisdiction", static: false, private: false, access: { has: obj => "incorporationJurisdiction" in obj, get: obj => obj.incorporationJurisdiction, set: (obj, value) => { obj.incorporationJurisdiction = value; } }, metadata: _metadata }, _incorporationJurisdiction_initializers, _incorporationJurisdiction_extraInitializers);
        __esDecorate(null, null, _incorporationDate_decorators, { kind: "field", name: "incorporationDate", static: false, private: false, access: { has: obj => "incorporationDate" in obj, get: obj => obj.incorporationDate, set: (obj, value) => { obj.incorporationDate = value; } }, metadata: _metadata }, _incorporationDate_initializers, _incorporationDate_extraInitializers);
        __esDecorate(null, null, _dissolutionDate_decorators, { kind: "field", name: "dissolutionDate", static: false, private: false, access: { has: obj => "dissolutionDate" in obj, get: obj => obj.dissolutionDate, set: (obj, value) => { obj.dissolutionDate = value; } }, metadata: _metadata }, _dissolutionDate_initializers, _dissolutionDate_extraInitializers);
        __esDecorate(null, null, _fiscalYearEnd_decorators, { kind: "field", name: "fiscalYearEnd", static: false, private: false, access: { has: obj => "fiscalYearEnd" in obj, get: obj => obj.fiscalYearEnd, set: (obj, value) => { obj.fiscalYearEnd = value; } }, metadata: _metadata }, _fiscalYearEnd_initializers, _fiscalYearEnd_extraInitializers);
        __esDecorate(null, null, _businessPurpose_decorators, { kind: "field", name: "businessPurpose", static: false, private: false, access: { has: obj => "businessPurpose" in obj, get: obj => obj.businessPurpose, set: (obj, value) => { obj.businessPurpose = value; } }, metadata: _metadata }, _businessPurpose_initializers, _businessPurpose_extraInitializers);
        __esDecorate(null, null, _registeredAgentName_decorators, { kind: "field", name: "registeredAgentName", static: false, private: false, access: { has: obj => "registeredAgentName" in obj, get: obj => obj.registeredAgentName, set: (obj, value) => { obj.registeredAgentName = value; } }, metadata: _metadata }, _registeredAgentName_initializers, _registeredAgentName_extraInitializers);
        __esDecorate(null, null, _registeredAgentAddress_decorators, { kind: "field", name: "registeredAgentAddress", static: false, private: false, access: { has: obj => "registeredAgentAddress" in obj, get: obj => obj.registeredAgentAddress, set: (obj, value) => { obj.registeredAgentAddress = value; } }, metadata: _metadata }, _registeredAgentAddress_initializers, _registeredAgentAddress_extraInitializers);
        __esDecorate(null, null, _principalAddress_decorators, { kind: "field", name: "principalAddress", static: false, private: false, access: { has: obj => "principalAddress" in obj, get: obj => obj.principalAddress, set: (obj, value) => { obj.principalAddress = value; } }, metadata: _metadata }, _principalAddress_initializers, _principalAddress_extraInitializers);
        __esDecorate(null, null, _mailingAddress_decorators, { kind: "field", name: "mailingAddress", static: false, private: false, access: { has: obj => "mailingAddress" in obj, get: obj => obj.mailingAddress, set: (obj, value) => { obj.mailingAddress = value; } }, metadata: _metadata }, _mailingAddress_initializers, _mailingAddress_extraInitializers);
        __esDecorate(null, null, _phoneNumber_decorators, { kind: "field", name: "phoneNumber", static: false, private: false, access: { has: obj => "phoneNumber" in obj, get: obj => obj.phoneNumber, set: (obj, value) => { obj.phoneNumber = value; } }, metadata: _metadata }, _phoneNumber_initializers, _phoneNumber_extraInitializers);
        __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: obj => "email" in obj, get: obj => obj.email, set: (obj, value) => { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
        __esDecorate(null, null, _website_decorators, { kind: "field", name: "website", static: false, private: false, access: { has: obj => "website" in obj, get: obj => obj.website, set: (obj, value) => { obj.website = value; } }, metadata: _metadata }, _website_initializers, _website_extraInitializers);
        __esDecorate(null, null, _parentEntityId_decorators, { kind: "field", name: "parentEntityId", static: false, private: false, access: { has: obj => "parentEntityId" in obj, get: obj => obj.parentEntityId, set: (obj, value) => { obj.parentEntityId = value; } }, metadata: _metadata }, _parentEntityId_initializers, _parentEntityId_extraInitializers);
        __esDecorate(null, null, _parentEntity_decorators, { kind: "field", name: "parentEntity", static: false, private: false, access: { has: obj => "parentEntity" in obj, get: obj => obj.parentEntity, set: (obj, value) => { obj.parentEntity = value; } }, metadata: _metadata }, _parentEntity_initializers, _parentEntity_extraInitializers);
        __esDecorate(null, null, _subsidiaries_decorators, { kind: "field", name: "subsidiaries", static: false, private: false, access: { has: obj => "subsidiaries" in obj, get: obj => obj.subsidiaries, set: (obj, value) => { obj.subsidiaries = value; } }, metadata: _metadata }, _subsidiaries_initializers, _subsidiaries_extraInitializers);
        __esDecorate(null, null, _childRelationships_decorators, { kind: "field", name: "childRelationships", static: false, private: false, access: { has: obj => "childRelationships" in obj, get: obj => obj.childRelationships, set: (obj, value) => { obj.childRelationships = value; } }, metadata: _metadata }, _childRelationships_initializers, _childRelationships_extraInitializers);
        __esDecorate(null, null, _parentRelationships_decorators, { kind: "field", name: "parentRelationships", static: false, private: false, access: { has: obj => "parentRelationships" in obj, get: obj => obj.parentRelationships, set: (obj, value) => { obj.parentRelationships = value; } }, metadata: _metadata }, _parentRelationships_initializers, _parentRelationships_extraInitializers);
        __esDecorate(null, null, _ownershipStakes_decorators, { kind: "field", name: "ownershipStakes", static: false, private: false, access: { has: obj => "ownershipStakes" in obj, get: obj => obj.ownershipStakes, set: (obj, value) => { obj.ownershipStakes = value; } }, metadata: _metadata }, _ownershipStakes_initializers, _ownershipStakes_extraInitializers);
        __esDecorate(null, null, _officers_decorators, { kind: "field", name: "officers", static: false, private: false, access: { has: obj => "officers" in obj, get: obj => obj.officers, set: (obj, value) => { obj.officers = value; } }, metadata: _metadata }, _officers_initializers, _officers_extraInitializers);
        __esDecorate(null, null, _complianceEvents_decorators, { kind: "field", name: "complianceEvents", static: false, private: false, access: { has: obj => "complianceEvents" in obj, get: obj => obj.complianceEvents, set: (obj, value) => { obj.complianceEvents = value; } }, metadata: _metadata }, _complianceEvents_initializers, _complianceEvents_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _tenantId_decorators, { kind: "field", name: "tenantId", static: false, private: false, access: { has: obj => "tenantId" in obj, get: obj => obj.tenantId, set: (obj, value) => { obj.tenantId = value; } }, metadata: _metadata }, _tenantId_initializers, _tenantId_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _updatedBy_decorators, { kind: "field", name: "updatedBy", static: false, private: false, access: { has: obj => "updatedBy" in obj, get: obj => obj.updatedBy, set: (obj, value) => { obj.updatedBy = value; } }, metadata: _metadata }, _updatedBy_initializers, _updatedBy_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        LegalEntityModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return LegalEntityModel = _classThis;
})();
exports.LegalEntityModel = LegalEntityModel;
/**
 * Entity Relationship Sequelize Model
 */
let EntityRelationshipModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'entity_relationships',
            timestamps: true,
            indexes: [
                { fields: ['parent_entity_id'] },
                { fields: ['child_entity_id'] },
                { fields: ['relationship_type'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _parentEntityId_decorators;
    let _parentEntityId_initializers = [];
    let _parentEntityId_extraInitializers = [];
    let _parentEntity_decorators;
    let _parentEntity_initializers = [];
    let _parentEntity_extraInitializers = [];
    let _childEntityId_decorators;
    let _childEntityId_initializers = [];
    let _childEntityId_extraInitializers = [];
    let _childEntity_decorators;
    let _childEntity_initializers = [];
    let _childEntity_extraInitializers = [];
    let _relationshipType_decorators;
    let _relationshipType_initializers = [];
    let _relationshipType_extraInitializers = [];
    let _ownershipPercentage_decorators;
    let _ownershipPercentage_initializers = [];
    let _ownershipPercentage_extraInitializers = [];
    let _effectiveDate_decorators;
    let _effectiveDate_initializers = [];
    let _effectiveDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var EntityRelationshipModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.parentEntityId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _parentEntityId_initializers, void 0));
            this.parentEntity = (__runInitializers(this, _parentEntityId_extraInitializers), __runInitializers(this, _parentEntity_initializers, void 0));
            this.childEntityId = (__runInitializers(this, _parentEntity_extraInitializers), __runInitializers(this, _childEntityId_initializers, void 0));
            this.childEntity = (__runInitializers(this, _childEntityId_extraInitializers), __runInitializers(this, _childEntity_initializers, void 0));
            this.relationshipType = (__runInitializers(this, _childEntity_extraInitializers), __runInitializers(this, _relationshipType_initializers, void 0));
            this.ownershipPercentage = (__runInitializers(this, _relationshipType_extraInitializers), __runInitializers(this, _ownershipPercentage_initializers, void 0));
            this.effectiveDate = (__runInitializers(this, _ownershipPercentage_extraInitializers), __runInitializers(this, _effectiveDate_initializers, void 0));
            this.endDate = (__runInitializers(this, _effectiveDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
            this.notes = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.createdAt = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "EntityRelationshipModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _parentEntityId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => LegalEntityModel), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'parent_entity_id',
            })];
        _parentEntity_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => LegalEntityModel, 'parent_entity_id')];
        _childEntityId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => LegalEntityModel), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'child_entity_id',
            })];
        _childEntity_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => LegalEntityModel, 'child_entity_id')];
        _relationshipType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(EntityRelationshipType)),
                allowNull: false,
                field: 'relationship_type',
            })];
        _ownershipPercentage_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(5, 2),
                field: 'ownership_percentage',
            })];
        _effectiveDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                field: 'effective_date',
            })];
        _endDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                field: 'end_date',
            })];
        _notes_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt, (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                field: 'created_at',
            })];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt, (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                field: 'updated_at',
            })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _parentEntityId_decorators, { kind: "field", name: "parentEntityId", static: false, private: false, access: { has: obj => "parentEntityId" in obj, get: obj => obj.parentEntityId, set: (obj, value) => { obj.parentEntityId = value; } }, metadata: _metadata }, _parentEntityId_initializers, _parentEntityId_extraInitializers);
        __esDecorate(null, null, _parentEntity_decorators, { kind: "field", name: "parentEntity", static: false, private: false, access: { has: obj => "parentEntity" in obj, get: obj => obj.parentEntity, set: (obj, value) => { obj.parentEntity = value; } }, metadata: _metadata }, _parentEntity_initializers, _parentEntity_extraInitializers);
        __esDecorate(null, null, _childEntityId_decorators, { kind: "field", name: "childEntityId", static: false, private: false, access: { has: obj => "childEntityId" in obj, get: obj => obj.childEntityId, set: (obj, value) => { obj.childEntityId = value; } }, metadata: _metadata }, _childEntityId_initializers, _childEntityId_extraInitializers);
        __esDecorate(null, null, _childEntity_decorators, { kind: "field", name: "childEntity", static: false, private: false, access: { has: obj => "childEntity" in obj, get: obj => obj.childEntity, set: (obj, value) => { obj.childEntity = value; } }, metadata: _metadata }, _childEntity_initializers, _childEntity_extraInitializers);
        __esDecorate(null, null, _relationshipType_decorators, { kind: "field", name: "relationshipType", static: false, private: false, access: { has: obj => "relationshipType" in obj, get: obj => obj.relationshipType, set: (obj, value) => { obj.relationshipType = value; } }, metadata: _metadata }, _relationshipType_initializers, _relationshipType_extraInitializers);
        __esDecorate(null, null, _ownershipPercentage_decorators, { kind: "field", name: "ownershipPercentage", static: false, private: false, access: { has: obj => "ownershipPercentage" in obj, get: obj => obj.ownershipPercentage, set: (obj, value) => { obj.ownershipPercentage = value; } }, metadata: _metadata }, _ownershipPercentage_initializers, _ownershipPercentage_extraInitializers);
        __esDecorate(null, null, _effectiveDate_decorators, { kind: "field", name: "effectiveDate", static: false, private: false, access: { has: obj => "effectiveDate" in obj, get: obj => obj.effectiveDate, set: (obj, value) => { obj.effectiveDate = value; } }, metadata: _metadata }, _effectiveDate_initializers, _effectiveDate_extraInitializers);
        __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EntityRelationshipModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EntityRelationshipModel = _classThis;
})();
exports.EntityRelationshipModel = EntityRelationshipModel;
/**
 * Ownership Stake Sequelize Model
 */
let OwnershipStakeModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'ownership_stakes',
            timestamps: true,
            indexes: [
                { fields: ['entity_id'] },
                { fields: ['owner_id'] },
                { fields: ['owner_type'] },
                { fields: ['ownership_type'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _entityId_decorators;
    let _entityId_initializers = [];
    let _entityId_extraInitializers = [];
    let _entity_decorators;
    let _entity_initializers = [];
    let _entity_extraInitializers = [];
    let _ownerType_decorators;
    let _ownerType_initializers = [];
    let _ownerType_extraInitializers = [];
    let _ownerId_decorators;
    let _ownerId_initializers = [];
    let _ownerId_extraInitializers = [];
    let _ownerName_decorators;
    let _ownerName_initializers = [];
    let _ownerName_extraInitializers = [];
    let _ownershipType_decorators;
    let _ownershipType_initializers = [];
    let _ownershipType_extraInitializers = [];
    let _sharesOwned_decorators;
    let _sharesOwned_initializers = [];
    let _sharesOwned_extraInitializers = [];
    let _percentageOwned_decorators;
    let _percentageOwned_initializers = [];
    let _percentageOwned_extraInitializers = [];
    let _votingRights_decorators;
    let _votingRights_initializers = [];
    let _votingRights_extraInitializers = [];
    let _votingPercentage_decorators;
    let _votingPercentage_initializers = [];
    let _votingPercentage_extraInitializers = [];
    let _acquisitionDate_decorators;
    let _acquisitionDate_initializers = [];
    let _acquisitionDate_extraInitializers = [];
    let _acquisitionPrice_decorators;
    let _acquisitionPrice_initializers = [];
    let _acquisitionPrice_extraInitializers = [];
    let _currentValue_decorators;
    let _currentValue_initializers = [];
    let _currentValue_extraInitializers = [];
    let _restrictions_decorators;
    let _restrictions_initializers = [];
    let _restrictions_extraInitializers = [];
    let _vestingSchedule_decorators;
    let _vestingSchedule_initializers = [];
    let _vestingSchedule_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var OwnershipStakeModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.entityId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _entityId_initializers, void 0));
            this.entity = (__runInitializers(this, _entityId_extraInitializers), __runInitializers(this, _entity_initializers, void 0));
            this.ownerType = (__runInitializers(this, _entity_extraInitializers), __runInitializers(this, _ownerType_initializers, void 0));
            this.ownerId = (__runInitializers(this, _ownerType_extraInitializers), __runInitializers(this, _ownerId_initializers, void 0));
            this.ownerName = (__runInitializers(this, _ownerId_extraInitializers), __runInitializers(this, _ownerName_initializers, void 0));
            this.ownershipType = (__runInitializers(this, _ownerName_extraInitializers), __runInitializers(this, _ownershipType_initializers, void 0));
            this.sharesOwned = (__runInitializers(this, _ownershipType_extraInitializers), __runInitializers(this, _sharesOwned_initializers, void 0));
            this.percentageOwned = (__runInitializers(this, _sharesOwned_extraInitializers), __runInitializers(this, _percentageOwned_initializers, void 0));
            this.votingRights = (__runInitializers(this, _percentageOwned_extraInitializers), __runInitializers(this, _votingRights_initializers, void 0));
            this.votingPercentage = (__runInitializers(this, _votingRights_extraInitializers), __runInitializers(this, _votingPercentage_initializers, void 0));
            this.acquisitionDate = (__runInitializers(this, _votingPercentage_extraInitializers), __runInitializers(this, _acquisitionDate_initializers, void 0));
            this.acquisitionPrice = (__runInitializers(this, _acquisitionDate_extraInitializers), __runInitializers(this, _acquisitionPrice_initializers, void 0));
            this.currentValue = (__runInitializers(this, _acquisitionPrice_extraInitializers), __runInitializers(this, _currentValue_initializers, void 0));
            this.restrictions = (__runInitializers(this, _currentValue_extraInitializers), __runInitializers(this, _restrictions_initializers, void 0));
            this.vestingSchedule = (__runInitializers(this, _restrictions_extraInitializers), __runInitializers(this, _vestingSchedule_initializers, void 0));
            this.metadata = (__runInitializers(this, _vestingSchedule_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "OwnershipStakeModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _entityId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => LegalEntityModel), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'entity_id',
            })];
        _entity_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => LegalEntityModel)];
        _ownerType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM('individual', 'entity'),
                allowNull: false,
                field: 'owner_type',
            })];
        _ownerId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'owner_id',
            })];
        _ownerName_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: false,
                field: 'owner_name',
            })];
        _ownershipType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(OwnershipType)),
                allowNull: false,
                field: 'ownership_type',
            })];
        _sharesOwned_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BIGINT,
                field: 'shares_owned',
            })];
        _percentageOwned_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(5, 2),
                field: 'percentage_owned',
            })];
        _votingRights_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: true,
                field: 'voting_rights',
            })];
        _votingPercentage_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(5, 2),
                field: 'voting_percentage',
            })];
        _acquisitionDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                field: 'acquisition_date',
            })];
        _acquisitionPrice_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                field: 'acquisition_price',
            })];
        _currentValue_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                field: 'current_value',
            })];
        _restrictions_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _vestingSchedule_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                field: 'vesting_schedule',
            })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: false,
                defaultValue: {},
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt, (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                field: 'created_at',
            })];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt, (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                field: 'updated_at',
            })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _entityId_decorators, { kind: "field", name: "entityId", static: false, private: false, access: { has: obj => "entityId" in obj, get: obj => obj.entityId, set: (obj, value) => { obj.entityId = value; } }, metadata: _metadata }, _entityId_initializers, _entityId_extraInitializers);
        __esDecorate(null, null, _entity_decorators, { kind: "field", name: "entity", static: false, private: false, access: { has: obj => "entity" in obj, get: obj => obj.entity, set: (obj, value) => { obj.entity = value; } }, metadata: _metadata }, _entity_initializers, _entity_extraInitializers);
        __esDecorate(null, null, _ownerType_decorators, { kind: "field", name: "ownerType", static: false, private: false, access: { has: obj => "ownerType" in obj, get: obj => obj.ownerType, set: (obj, value) => { obj.ownerType = value; } }, metadata: _metadata }, _ownerType_initializers, _ownerType_extraInitializers);
        __esDecorate(null, null, _ownerId_decorators, { kind: "field", name: "ownerId", static: false, private: false, access: { has: obj => "ownerId" in obj, get: obj => obj.ownerId, set: (obj, value) => { obj.ownerId = value; } }, metadata: _metadata }, _ownerId_initializers, _ownerId_extraInitializers);
        __esDecorate(null, null, _ownerName_decorators, { kind: "field", name: "ownerName", static: false, private: false, access: { has: obj => "ownerName" in obj, get: obj => obj.ownerName, set: (obj, value) => { obj.ownerName = value; } }, metadata: _metadata }, _ownerName_initializers, _ownerName_extraInitializers);
        __esDecorate(null, null, _ownershipType_decorators, { kind: "field", name: "ownershipType", static: false, private: false, access: { has: obj => "ownershipType" in obj, get: obj => obj.ownershipType, set: (obj, value) => { obj.ownershipType = value; } }, metadata: _metadata }, _ownershipType_initializers, _ownershipType_extraInitializers);
        __esDecorate(null, null, _sharesOwned_decorators, { kind: "field", name: "sharesOwned", static: false, private: false, access: { has: obj => "sharesOwned" in obj, get: obj => obj.sharesOwned, set: (obj, value) => { obj.sharesOwned = value; } }, metadata: _metadata }, _sharesOwned_initializers, _sharesOwned_extraInitializers);
        __esDecorate(null, null, _percentageOwned_decorators, { kind: "field", name: "percentageOwned", static: false, private: false, access: { has: obj => "percentageOwned" in obj, get: obj => obj.percentageOwned, set: (obj, value) => { obj.percentageOwned = value; } }, metadata: _metadata }, _percentageOwned_initializers, _percentageOwned_extraInitializers);
        __esDecorate(null, null, _votingRights_decorators, { kind: "field", name: "votingRights", static: false, private: false, access: { has: obj => "votingRights" in obj, get: obj => obj.votingRights, set: (obj, value) => { obj.votingRights = value; } }, metadata: _metadata }, _votingRights_initializers, _votingRights_extraInitializers);
        __esDecorate(null, null, _votingPercentage_decorators, { kind: "field", name: "votingPercentage", static: false, private: false, access: { has: obj => "votingPercentage" in obj, get: obj => obj.votingPercentage, set: (obj, value) => { obj.votingPercentage = value; } }, metadata: _metadata }, _votingPercentage_initializers, _votingPercentage_extraInitializers);
        __esDecorate(null, null, _acquisitionDate_decorators, { kind: "field", name: "acquisitionDate", static: false, private: false, access: { has: obj => "acquisitionDate" in obj, get: obj => obj.acquisitionDate, set: (obj, value) => { obj.acquisitionDate = value; } }, metadata: _metadata }, _acquisitionDate_initializers, _acquisitionDate_extraInitializers);
        __esDecorate(null, null, _acquisitionPrice_decorators, { kind: "field", name: "acquisitionPrice", static: false, private: false, access: { has: obj => "acquisitionPrice" in obj, get: obj => obj.acquisitionPrice, set: (obj, value) => { obj.acquisitionPrice = value; } }, metadata: _metadata }, _acquisitionPrice_initializers, _acquisitionPrice_extraInitializers);
        __esDecorate(null, null, _currentValue_decorators, { kind: "field", name: "currentValue", static: false, private: false, access: { has: obj => "currentValue" in obj, get: obj => obj.currentValue, set: (obj, value) => { obj.currentValue = value; } }, metadata: _metadata }, _currentValue_initializers, _currentValue_extraInitializers);
        __esDecorate(null, null, _restrictions_decorators, { kind: "field", name: "restrictions", static: false, private: false, access: { has: obj => "restrictions" in obj, get: obj => obj.restrictions, set: (obj, value) => { obj.restrictions = value; } }, metadata: _metadata }, _restrictions_initializers, _restrictions_extraInitializers);
        __esDecorate(null, null, _vestingSchedule_decorators, { kind: "field", name: "vestingSchedule", static: false, private: false, access: { has: obj => "vestingSchedule" in obj, get: obj => obj.vestingSchedule, set: (obj, value) => { obj.vestingSchedule = value; } }, metadata: _metadata }, _vestingSchedule_initializers, _vestingSchedule_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        OwnershipStakeModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return OwnershipStakeModel = _classThis;
})();
exports.OwnershipStakeModel = OwnershipStakeModel;
/**
 * Entity Officer Sequelize Model
 */
let EntityOfficerModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'entity_officers',
            timestamps: true,
            indexes: [
                { fields: ['entity_id'] },
                { fields: ['person_id'] },
                { fields: ['role'] },
                { fields: ['is_active'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _entityId_decorators;
    let _entityId_initializers = [];
    let _entityId_extraInitializers = [];
    let _entity_decorators;
    let _entity_initializers = [];
    let _entity_extraInitializers = [];
    let _personId_decorators;
    let _personId_initializers = [];
    let _personId_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _role_decorators;
    let _role_initializers = [];
    let _role_extraInitializers = [];
    let _appointmentDate_decorators;
    let _appointmentDate_initializers = [];
    let _appointmentDate_extraInitializers = [];
    let _termEndDate_decorators;
    let _termEndDate_initializers = [];
    let _termEndDate_extraInitializers = [];
    let _resignationDate_decorators;
    let _resignationDate_initializers = [];
    let _resignationDate_extraInitializers = [];
    let _compensation_decorators;
    let _compensation_initializers = [];
    let _compensation_extraInitializers = [];
    let _email_decorators;
    let _email_initializers = [];
    let _email_extraInitializers = [];
    let _phone_decorators;
    let _phone_initializers = [];
    let _phone_extraInitializers = [];
    let _address_decorators;
    let _address_initializers = [];
    let _address_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var EntityOfficerModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.entityId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _entityId_initializers, void 0));
            this.entity = (__runInitializers(this, _entityId_extraInitializers), __runInitializers(this, _entity_initializers, void 0));
            this.personId = (__runInitializers(this, _entity_extraInitializers), __runInitializers(this, _personId_initializers, void 0));
            this.name = (__runInitializers(this, _personId_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.role = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _role_initializers, void 0));
            this.appointmentDate = (__runInitializers(this, _role_extraInitializers), __runInitializers(this, _appointmentDate_initializers, void 0));
            this.termEndDate = (__runInitializers(this, _appointmentDate_extraInitializers), __runInitializers(this, _termEndDate_initializers, void 0));
            this.resignationDate = (__runInitializers(this, _termEndDate_extraInitializers), __runInitializers(this, _resignationDate_initializers, void 0));
            this.compensation = (__runInitializers(this, _resignationDate_extraInitializers), __runInitializers(this, _compensation_initializers, void 0));
            this.email = (__runInitializers(this, _compensation_extraInitializers), __runInitializers(this, _email_initializers, void 0));
            this.phone = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _phone_initializers, void 0));
            this.address = (__runInitializers(this, _phone_extraInitializers), __runInitializers(this, _address_initializers, void 0));
            this.isActive = (__runInitializers(this, _address_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.metadata = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "EntityOfficerModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _entityId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => LegalEntityModel), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'entity_id',
            })];
        _entity_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => LegalEntityModel)];
        _personId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                field: 'person_id',
            })];
        _name_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: false,
            })];
        _role_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(OfficerRole)),
                allowNull: false,
            })];
        _appointmentDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                field: 'appointment_date',
            })];
        _termEndDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                field: 'term_end_date',
            })];
        _resignationDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                field: 'resignation_date',
            })];
        _compensation_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
            })];
        _email_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255))];
        _phone_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _address_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _isActive_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: true,
                field: 'is_active',
            })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: false,
                defaultValue: {},
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt, (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                field: 'created_at',
            })];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt, (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                field: 'updated_at',
            })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _entityId_decorators, { kind: "field", name: "entityId", static: false, private: false, access: { has: obj => "entityId" in obj, get: obj => obj.entityId, set: (obj, value) => { obj.entityId = value; } }, metadata: _metadata }, _entityId_initializers, _entityId_extraInitializers);
        __esDecorate(null, null, _entity_decorators, { kind: "field", name: "entity", static: false, private: false, access: { has: obj => "entity" in obj, get: obj => obj.entity, set: (obj, value) => { obj.entity = value; } }, metadata: _metadata }, _entity_initializers, _entity_extraInitializers);
        __esDecorate(null, null, _personId_decorators, { kind: "field", name: "personId", static: false, private: false, access: { has: obj => "personId" in obj, get: obj => obj.personId, set: (obj, value) => { obj.personId = value; } }, metadata: _metadata }, _personId_initializers, _personId_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _role_decorators, { kind: "field", name: "role", static: false, private: false, access: { has: obj => "role" in obj, get: obj => obj.role, set: (obj, value) => { obj.role = value; } }, metadata: _metadata }, _role_initializers, _role_extraInitializers);
        __esDecorate(null, null, _appointmentDate_decorators, { kind: "field", name: "appointmentDate", static: false, private: false, access: { has: obj => "appointmentDate" in obj, get: obj => obj.appointmentDate, set: (obj, value) => { obj.appointmentDate = value; } }, metadata: _metadata }, _appointmentDate_initializers, _appointmentDate_extraInitializers);
        __esDecorate(null, null, _termEndDate_decorators, { kind: "field", name: "termEndDate", static: false, private: false, access: { has: obj => "termEndDate" in obj, get: obj => obj.termEndDate, set: (obj, value) => { obj.termEndDate = value; } }, metadata: _metadata }, _termEndDate_initializers, _termEndDate_extraInitializers);
        __esDecorate(null, null, _resignationDate_decorators, { kind: "field", name: "resignationDate", static: false, private: false, access: { has: obj => "resignationDate" in obj, get: obj => obj.resignationDate, set: (obj, value) => { obj.resignationDate = value; } }, metadata: _metadata }, _resignationDate_initializers, _resignationDate_extraInitializers);
        __esDecorate(null, null, _compensation_decorators, { kind: "field", name: "compensation", static: false, private: false, access: { has: obj => "compensation" in obj, get: obj => obj.compensation, set: (obj, value) => { obj.compensation = value; } }, metadata: _metadata }, _compensation_initializers, _compensation_extraInitializers);
        __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: obj => "email" in obj, get: obj => obj.email, set: (obj, value) => { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
        __esDecorate(null, null, _phone_decorators, { kind: "field", name: "phone", static: false, private: false, access: { has: obj => "phone" in obj, get: obj => obj.phone, set: (obj, value) => { obj.phone = value; } }, metadata: _metadata }, _phone_initializers, _phone_extraInitializers);
        __esDecorate(null, null, _address_decorators, { kind: "field", name: "address", static: false, private: false, access: { has: obj => "address" in obj, get: obj => obj.address, set: (obj, value) => { obj.address = value; } }, metadata: _metadata }, _address_initializers, _address_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EntityOfficerModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EntityOfficerModel = _classThis;
})();
exports.EntityOfficerModel = EntityOfficerModel;
/**
 * Compliance Event Sequelize Model
 */
let ComplianceEventModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'compliance_events',
            timestamps: true,
            indexes: [
                { fields: ['entity_id'] },
                { fields: ['event_type'] },
                { fields: ['status'] },
                { fields: ['due_date'] },
                { fields: ['assigned_to'] },
                { fields: ['priority'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _entityId_decorators;
    let _entityId_initializers = [];
    let _entityId_extraInitializers = [];
    let _entity_decorators;
    let _entity_initializers = [];
    let _entity_extraInitializers = [];
    let _eventType_decorators;
    let _eventType_initializers = [];
    let _eventType_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _dueDate_decorators;
    let _dueDate_initializers = [];
    let _dueDate_extraInitializers = [];
    let _completionDate_decorators;
    let _completionDate_initializers = [];
    let _completionDate_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _jurisdiction_decorators;
    let _jurisdiction_initializers = [];
    let _jurisdiction_extraInitializers = [];
    let _filingNumber_decorators;
    let _filingNumber_initializers = [];
    let _filingNumber_extraInitializers = [];
    let _filingUrl_decorators;
    let _filingUrl_initializers = [];
    let _filingUrl_extraInitializers = [];
    let _assignedTo_decorators;
    let _assignedTo_initializers = [];
    let _assignedTo_extraInitializers = [];
    let _reminderDays_decorators;
    let _reminderDays_initializers = [];
    let _reminderDays_extraInitializers = [];
    let _recurring_decorators;
    let _recurring_initializers = [];
    let _recurring_extraInitializers = [];
    let _recurrenceRule_decorators;
    let _recurrenceRule_initializers = [];
    let _recurrenceRule_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _penalties_decorators;
    let _penalties_initializers = [];
    let _penalties_extraInitializers = [];
    let _estimatedCost_decorators;
    let _estimatedCost_initializers = [];
    let _estimatedCost_extraInitializers = [];
    let _actualCost_decorators;
    let _actualCost_initializers = [];
    let _actualCost_extraInitializers = [];
    let _documents_decorators;
    let _documents_initializers = [];
    let _documents_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var ComplianceEventModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.entityId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _entityId_initializers, void 0));
            this.entity = (__runInitializers(this, _entityId_extraInitializers), __runInitializers(this, _entity_initializers, void 0));
            this.eventType = (__runInitializers(this, _entity_extraInitializers), __runInitializers(this, _eventType_initializers, void 0));
            this.title = (__runInitializers(this, _eventType_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.dueDate = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _dueDate_initializers, void 0));
            this.completionDate = (__runInitializers(this, _dueDate_extraInitializers), __runInitializers(this, _completionDate_initializers, void 0));
            this.status = (__runInitializers(this, _completionDate_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.jurisdiction = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _jurisdiction_initializers, void 0));
            this.filingNumber = (__runInitializers(this, _jurisdiction_extraInitializers), __runInitializers(this, _filingNumber_initializers, void 0));
            this.filingUrl = (__runInitializers(this, _filingNumber_extraInitializers), __runInitializers(this, _filingUrl_initializers, void 0));
            this.assignedTo = (__runInitializers(this, _filingUrl_extraInitializers), __runInitializers(this, _assignedTo_initializers, void 0));
            this.reminderDays = (__runInitializers(this, _assignedTo_extraInitializers), __runInitializers(this, _reminderDays_initializers, void 0));
            this.recurring = (__runInitializers(this, _reminderDays_extraInitializers), __runInitializers(this, _recurring_initializers, void 0));
            this.recurrenceRule = (__runInitializers(this, _recurring_extraInitializers), __runInitializers(this, _recurrenceRule_initializers, void 0));
            this.priority = (__runInitializers(this, _recurrenceRule_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
            this.penalties = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _penalties_initializers, void 0));
            this.estimatedCost = (__runInitializers(this, _penalties_extraInitializers), __runInitializers(this, _estimatedCost_initializers, void 0));
            this.actualCost = (__runInitializers(this, _estimatedCost_extraInitializers), __runInitializers(this, _actualCost_initializers, void 0));
            this.documents = (__runInitializers(this, _actualCost_extraInitializers), __runInitializers(this, _documents_initializers, void 0));
            this.metadata = (__runInitializers(this, _documents_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ComplianceEventModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _entityId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => LegalEntityModel), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'entity_id',
            })];
        _entity_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => LegalEntityModel)];
        _eventType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ComplianceEventType)),
                allowNull: false,
                field: 'event_type',
            })];
        _title_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(500),
                allowNull: false,
            })];
        _description_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _dueDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                field: 'due_date',
            })];
        _completionDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                field: 'completion_date',
            })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ComplianceStatus)),
                allowNull: false,
                defaultValue: ComplianceStatus.UPCOMING,
            })];
        _jurisdiction_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
            })];
        _filingNumber_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                field: 'filing_number',
            })];
        _filingUrl_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(500),
                field: 'filing_url',
            })];
        _assignedTo_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                field: 'assigned_to',
            })];
        _reminderDays_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.INTEGER),
                allowNull: false,
                defaultValue: [30, 14, 7, 1],
                field: 'reminder_days',
            })];
        _recurring_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            })];
        _recurrenceRule_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(500),
                field: 'recurrence_rule',
            })];
        _priority_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM('low', 'medium', 'high', 'critical'),
                allowNull: false,
                defaultValue: 'medium',
            })];
        _penalties_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _estimatedCost_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                field: 'estimated_cost',
            })];
        _actualCost_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                field: 'actual_cost',
            })];
        _documents_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: false,
                defaultValue: [],
            })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: false,
                defaultValue: {},
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt, (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                field: 'created_at',
            })];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt, (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                field: 'updated_at',
            })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _entityId_decorators, { kind: "field", name: "entityId", static: false, private: false, access: { has: obj => "entityId" in obj, get: obj => obj.entityId, set: (obj, value) => { obj.entityId = value; } }, metadata: _metadata }, _entityId_initializers, _entityId_extraInitializers);
        __esDecorate(null, null, _entity_decorators, { kind: "field", name: "entity", static: false, private: false, access: { has: obj => "entity" in obj, get: obj => obj.entity, set: (obj, value) => { obj.entity = value; } }, metadata: _metadata }, _entity_initializers, _entity_extraInitializers);
        __esDecorate(null, null, _eventType_decorators, { kind: "field", name: "eventType", static: false, private: false, access: { has: obj => "eventType" in obj, get: obj => obj.eventType, set: (obj, value) => { obj.eventType = value; } }, metadata: _metadata }, _eventType_initializers, _eventType_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _dueDate_decorators, { kind: "field", name: "dueDate", static: false, private: false, access: { has: obj => "dueDate" in obj, get: obj => obj.dueDate, set: (obj, value) => { obj.dueDate = value; } }, metadata: _metadata }, _dueDate_initializers, _dueDate_extraInitializers);
        __esDecorate(null, null, _completionDate_decorators, { kind: "field", name: "completionDate", static: false, private: false, access: { has: obj => "completionDate" in obj, get: obj => obj.completionDate, set: (obj, value) => { obj.completionDate = value; } }, metadata: _metadata }, _completionDate_initializers, _completionDate_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _jurisdiction_decorators, { kind: "field", name: "jurisdiction", static: false, private: false, access: { has: obj => "jurisdiction" in obj, get: obj => obj.jurisdiction, set: (obj, value) => { obj.jurisdiction = value; } }, metadata: _metadata }, _jurisdiction_initializers, _jurisdiction_extraInitializers);
        __esDecorate(null, null, _filingNumber_decorators, { kind: "field", name: "filingNumber", static: false, private: false, access: { has: obj => "filingNumber" in obj, get: obj => obj.filingNumber, set: (obj, value) => { obj.filingNumber = value; } }, metadata: _metadata }, _filingNumber_initializers, _filingNumber_extraInitializers);
        __esDecorate(null, null, _filingUrl_decorators, { kind: "field", name: "filingUrl", static: false, private: false, access: { has: obj => "filingUrl" in obj, get: obj => obj.filingUrl, set: (obj, value) => { obj.filingUrl = value; } }, metadata: _metadata }, _filingUrl_initializers, _filingUrl_extraInitializers);
        __esDecorate(null, null, _assignedTo_decorators, { kind: "field", name: "assignedTo", static: false, private: false, access: { has: obj => "assignedTo" in obj, get: obj => obj.assignedTo, set: (obj, value) => { obj.assignedTo = value; } }, metadata: _metadata }, _assignedTo_initializers, _assignedTo_extraInitializers);
        __esDecorate(null, null, _reminderDays_decorators, { kind: "field", name: "reminderDays", static: false, private: false, access: { has: obj => "reminderDays" in obj, get: obj => obj.reminderDays, set: (obj, value) => { obj.reminderDays = value; } }, metadata: _metadata }, _reminderDays_initializers, _reminderDays_extraInitializers);
        __esDecorate(null, null, _recurring_decorators, { kind: "field", name: "recurring", static: false, private: false, access: { has: obj => "recurring" in obj, get: obj => obj.recurring, set: (obj, value) => { obj.recurring = value; } }, metadata: _metadata }, _recurring_initializers, _recurring_extraInitializers);
        __esDecorate(null, null, _recurrenceRule_decorators, { kind: "field", name: "recurrenceRule", static: false, private: false, access: { has: obj => "recurrenceRule" in obj, get: obj => obj.recurrenceRule, set: (obj, value) => { obj.recurrenceRule = value; } }, metadata: _metadata }, _recurrenceRule_initializers, _recurrenceRule_extraInitializers);
        __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
        __esDecorate(null, null, _penalties_decorators, { kind: "field", name: "penalties", static: false, private: false, access: { has: obj => "penalties" in obj, get: obj => obj.penalties, set: (obj, value) => { obj.penalties = value; } }, metadata: _metadata }, _penalties_initializers, _penalties_extraInitializers);
        __esDecorate(null, null, _estimatedCost_decorators, { kind: "field", name: "estimatedCost", static: false, private: false, access: { has: obj => "estimatedCost" in obj, get: obj => obj.estimatedCost, set: (obj, value) => { obj.estimatedCost = value; } }, metadata: _metadata }, _estimatedCost_initializers, _estimatedCost_extraInitializers);
        __esDecorate(null, null, _actualCost_decorators, { kind: "field", name: "actualCost", static: false, private: false, access: { has: obj => "actualCost" in obj, get: obj => obj.actualCost, set: (obj, value) => { obj.actualCost = value; } }, metadata: _metadata }, _actualCost_initializers, _actualCost_extraInitializers);
        __esDecorate(null, null, _documents_decorators, { kind: "field", name: "documents", static: false, private: false, access: { has: obj => "documents" in obj, get: obj => obj.documents, set: (obj, value) => { obj.documents = value; } }, metadata: _metadata }, _documents_initializers, _documents_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ComplianceEventModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ComplianceEventModel = _classThis;
})();
exports.ComplianceEventModel = ComplianceEventModel;
// ============================================================================
// NESTJS SERVICE
// ============================================================================
/**
 * Legal Entity Management Service
 */
let LegalEntityManagementService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var LegalEntityManagementService = _classThis = class {
        constructor(sequelize, configService) {
            this.sequelize = sequelize;
            this.configService = configService;
            this.logger = new common_1.Logger(LegalEntityManagementService.name);
        }
        // ============================================================================
        // ENTITY FORMATION & LIFECYCLE
        // ============================================================================
        /**
         * 1. Create new legal entity with formation details
         *
         * @param request Entity formation request
         * @param userId User creating the entity
         * @param tenantId Optional tenant ID for multi-tenancy
         * @returns Created legal entity
         */
        async formNewEntity(request, userId, tenantId) {
            this.logger.log(`Forming new entity: ${request.legalName}`);
            // Validate request
            const validated = exports.EntityFormationRequestSchema.parse(request);
            const transaction = await this.sequelize.transaction();
            try {
                // Generate entity number
                const entityNumber = await this.generateEntityNumber(validated.entityType);
                // Create entity
                const entity = await LegalEntityModel.create({
                    entityNumber,
                    legalName: validated.legalName,
                    dbaName: validated.dbaName,
                    entityType: validated.entityType,
                    status: EntityStatus.FORMATION_IN_PROGRESS,
                    taxClassification: validated.taxClassification,
                    incorporationJurisdiction: validated.incorporationJurisdiction,
                    businessPurpose: validated.businessPurpose,
                    registeredAgentName: validated.registeredAgentName,
                    registeredAgentAddress: JSON.stringify(validated.registeredAgentAddress),
                    principalAddress: validated.principalAddress,
                    fiscalYearEnd: validated.fiscalYearEnd,
                    parentEntityId: validated.parentEntityId,
                    metadata: validated.metadata || {
                        tags: [],
                        customFields: {},
                        externalIds: {},
                    },
                    tenantId,
                    createdBy: userId,
                }, { transaction });
                // Create initial officers
                for (const officer of validated.initialOfficers) {
                    await EntityOfficerModel.create({
                        entityId: entity.id,
                        name: officer.name,
                        role: officer.role,
                        appointmentDate: officer.appointmentDate,
                        email: officer.email,
                        phone: officer.phone,
                        address: officer.address,
                        compensation: officer.compensation,
                        isActive: true,
                        metadata: officer.metadata || {},
                    }, { transaction });
                }
                // Create initial ownership stakes
                for (const owner of validated.initialOwners) {
                    await OwnershipStakeModel.create({
                        entityId: entity.id,
                        ownerType: owner.ownerType,
                        ownerId: owner.ownerId,
                        ownerName: owner.ownerName,
                        ownershipType: owner.ownershipType,
                        sharesOwned: owner.sharesOwned,
                        percentageOwned: owner.percentageOwned,
                        votingRights: owner.votingRights,
                        votingPercentage: owner.votingPercentage,
                        acquisitionDate: owner.acquisitionDate,
                        acquisitionPrice: owner.acquisitionPrice,
                        metadata: owner.metadata || {},
                    }, { transaction });
                }
                // Create parent relationship if applicable
                if (validated.parentEntityId) {
                    await EntityRelationshipModel.create({
                        parentEntityId: validated.parentEntityId,
                        childEntityId: entity.id,
                        relationshipType: EntityRelationshipType.SUBSIDIARY,
                        effectiveDate: new Date(),
                    }, { transaction });
                }
                // Create initial compliance events
                await this.createInitialComplianceEvents(entity.id, validated, transaction);
                await transaction.commit();
                this.logger.log(`Entity formed successfully: ${entity.id}`);
                return entity.toJSON();
            }
            catch (error) {
                await transaction.rollback();
                this.logger.error(`Failed to form entity: ${error.message}`, error.stack);
                throw new common_1.InternalServerErrorException('Failed to form legal entity');
            }
        }
        /**
         * 2. Update entity status
         *
         * @param entityId Entity ID
         * @param status New status
         * @param userId User making the update
         * @param notes Optional notes about status change
         * @returns Updated entity
         */
        async updateEntityStatus(entityId, status, userId, notes) {
            this.logger.log(`Updating entity ${entityId} status to ${status}`);
            const entity = await LegalEntityModel.findByPk(entityId);
            if (!entity) {
                throw new common_1.NotFoundException('Entity not found');
            }
            const oldStatus = entity.status;
            entity.status = status;
            entity.updatedBy = userId;
            // Set dissolution date if entity is being dissolved
            if (status === EntityStatus.DISSOLVED && !entity.dissolutionDate) {
                entity.dissolutionDate = new Date();
            }
            // Update metadata with status change log
            const metadata = entity.metadata || { tags: [], customFields: {}, externalIds: {} };
            if (!metadata.customFields.statusHistory) {
                metadata.customFields.statusHistory = [];
            }
            metadata.customFields.statusHistory.push({
                from: oldStatus,
                to: status,
                changedBy: userId,
                changedAt: new Date().toISOString(),
                notes,
            });
            entity.metadata = metadata;
            await entity.save();
            this.logger.log(`Entity ${entityId} status updated from ${oldStatus} to ${status}`);
            return entity.toJSON();
        }
        /**
         * 3. Dissolve/terminate entity
         *
         * @param entityId Entity ID
         * @param dissolutionDate Date of dissolution
         * @param userId User performing dissolution
         * @param reason Reason for dissolution
         * @returns Dissolved entity
         */
        async dissolveEntity(entityId, dissolutionDate, userId, reason) {
            this.logger.log(`Dissolving entity: ${entityId}`);
            const entity = await LegalEntityModel.findByPk(entityId);
            if (!entity) {
                throw new common_1.NotFoundException('Entity not found');
            }
            if (entity.status === EntityStatus.DISSOLVED) {
                throw new common_1.ConflictException('Entity is already dissolved');
            }
            entity.status = EntityStatus.DISSOLVED;
            entity.dissolutionDate = dissolutionDate;
            entity.updatedBy = userId;
            // Update metadata
            const metadata = entity.metadata || { tags: [], customFields: {}, externalIds: {} };
            metadata.customFields.dissolutionReason = reason;
            entity.metadata = metadata;
            await entity.save();
            // Deactivate all officers
            await EntityOfficerModel.update({ isActive: false }, { where: { entityId, isActive: true } });
            this.logger.log(`Entity ${entityId} dissolved successfully`);
            return entity.toJSON();
        }
        /**
         * 4. Convert entity type
         *
         * @param entityId Entity ID
         * @param newEntityType New entity type
         * @param effectiveDate Effective date of conversion
         * @param userId User performing conversion
         * @returns Updated entity
         */
        async convertEntityType(entityId, newEntityType, effectiveDate, userId) {
            this.logger.log(`Converting entity ${entityId} to ${newEntityType}`);
            const entity = await LegalEntityModel.findByPk(entityId);
            if (!entity) {
                throw new common_1.NotFoundException('Entity not found');
            }
            const oldType = entity.entityType;
            entity.entityType = newEntityType;
            entity.updatedBy = userId;
            // Log conversion in metadata
            const metadata = entity.metadata || { tags: [], customFields: {}, externalIds: {} };
            if (!metadata.customFields.typeConversions) {
                metadata.customFields.typeConversions = [];
            }
            metadata.customFields.typeConversions.push({
                from: oldType,
                to: newEntityType,
                effectiveDate: effectiveDate.toISOString(),
                convertedBy: userId,
                convertedAt: new Date().toISOString(),
            });
            entity.metadata = metadata;
            await entity.save();
            this.logger.log(`Entity ${entityId} converted from ${oldType} to ${newEntityType}`);
            return entity.toJSON();
        }
        // ============================================================================
        // CORPORATE STRUCTURE
        // ============================================================================
        /**
         * 5. Create entity relationship (parent-child, affiliate, etc.)
         *
         * @param parentEntityId Parent entity ID
         * @param childEntityId Child entity ID
         * @param relationshipType Type of relationship
         * @param ownershipPercentage Optional ownership percentage
         * @param effectiveDate Effective date of relationship
         * @returns Created relationship
         */
        async createEntityRelationship(parentEntityId, childEntityId, relationshipType, ownershipPercentage, effectiveDate = new Date()) {
            this.logger.log(`Creating ${relationshipType} relationship: ${parentEntityId} -> ${childEntityId}`);
            // Validate both entities exist
            const [parent, child] = await Promise.all([
                LegalEntityModel.findByPk(parentEntityId),
                LegalEntityModel.findByPk(childEntityId),
            ]);
            if (!parent) {
                throw new common_1.NotFoundException('Parent entity not found');
            }
            if (!child) {
                throw new common_1.NotFoundException('Child entity not found');
            }
            if (parentEntityId === childEntityId) {
                throw new common_1.BadRequestException('Entity cannot have relationship with itself');
            }
            // Check for circular relationships
            const hasCircular = await this.checkCircularRelationship(parentEntityId, childEntityId);
            if (hasCircular) {
                throw new common_1.BadRequestException('Circular relationship detected');
            }
            const relationship = await EntityRelationshipModel.create({
                parentEntityId,
                childEntityId,
                relationshipType,
                ownershipPercentage,
                effectiveDate,
            });
            this.logger.log(`Relationship created: ${relationship.id}`);
            return relationship.toJSON();
        }
        /**
         * 6. Get entity corporate structure (hierarchy)
         *
         * @param entityId Root entity ID
         * @param depth Maximum depth to traverse
         * @returns Corporate structure tree
         */
        async getEntityStructure(entityId, depth = 5) {
            this.logger.log(`Getting corporate structure for entity: ${entityId}`);
            const entity = await LegalEntityModel.findByPk(entityId, {
                include: [
                    {
                        model: EntityRelationshipModel,
                        as: 'childRelationships',
                        include: [
                            {
                                model: LegalEntityModel,
                                as: 'childEntity',
                            },
                        ],
                    },
                ],
            });
            if (!entity) {
                throw new common_1.NotFoundException('Entity not found');
            }
            const structure = await this.buildEntityTree(entity, depth, 0);
            this.logger.log(`Corporate structure retrieved for ${entityId}`);
            return structure;
        }
        /**
         * 7. Get all subsidiaries of an entity
         *
         * @param parentEntityId Parent entity ID
         * @param includeIndirect Include indirect subsidiaries
         * @returns List of subsidiaries
         */
        async getSubsidiaries(parentEntityId, includeIndirect = false) {
            this.logger.log(`Getting subsidiaries for entity: ${parentEntityId}`);
            const relationships = await EntityRelationshipModel.findAll({
                where: {
                    parentEntityId,
                    relationshipType: EntityRelationshipType.SUBSIDIARY,
                    endDate: null,
                },
                include: [
                    {
                        model: LegalEntityModel,
                        as: 'childEntity',
                    },
                ],
            });
            let subsidiaries = relationships.map((rel) => rel.childEntity.toJSON());
            if (includeIndirect) {
                // Recursively get all indirect subsidiaries
                for (const sub of [...subsidiaries]) {
                    const indirectSubs = await this.getSubsidiaries(sub.id, true);
                    subsidiaries = [...subsidiaries, ...indirectSubs];
                }
            }
            this.logger.log(`Found ${subsidiaries.length} subsidiaries`);
            return subsidiaries;
        }
        /**
         * 8. Get parent entities
         *
         * @param childEntityId Child entity ID
         * @returns List of parent entities
         */
        async getParentEntities(childEntityId) {
            this.logger.log(`Getting parent entities for: ${childEntityId}`);
            const relationships = await EntityRelationshipModel.findAll({
                where: {
                    childEntityId,
                    endDate: null,
                },
                include: [
                    {
                        model: LegalEntityModel,
                        as: 'parentEntity',
                    },
                ],
            });
            const parents = relationships.map((rel) => rel.parentEntity.toJSON());
            this.logger.log(`Found ${parents.length} parent entities`);
            return parents;
        }
        // ============================================================================
        // OWNERSHIP TRACKING
        // ============================================================================
        /**
         * 9. Add ownership stake
         *
         * @param entityId Entity ID
         * @param stake Ownership stake details
         * @returns Created ownership stake
         */
        async addOwnershipStake(entityId, stake) {
            this.logger.log(`Adding ownership stake for entity: ${entityId}`);
            const entity = await LegalEntityModel.findByPk(entityId);
            if (!entity) {
                throw new common_1.NotFoundException('Entity not found');
            }
            const ownershipStake = await OwnershipStakeModel.create({
                entityId,
                ...stake,
            });
            this.logger.log(`Ownership stake created: ${ownershipStake.id}`);
            return ownershipStake.toJSON();
        }
        /**
         * 10. Update ownership stake
         *
         * @param stakeId Stake ID
         * @param updates Updates to apply
         * @returns Updated ownership stake
         */
        async updateOwnershipStake(stakeId, updates) {
            this.logger.log(`Updating ownership stake: ${stakeId}`);
            const stake = await OwnershipStakeModel.findByPk(stakeId);
            if (!stake) {
                throw new common_1.NotFoundException('Ownership stake not found');
            }
            await stake.update(updates);
            this.logger.log(`Ownership stake ${stakeId} updated`);
            return stake.toJSON();
        }
        /**
         * 11. Get ownership breakdown for entity
         *
         * @param entityId Entity ID
         * @returns Ownership breakdown
         */
        async getOwnershipBreakdown(entityId) {
            this.logger.log(`Getting ownership breakdown for: ${entityId}`);
            const entity = await LegalEntityModel.findByPk(entityId);
            if (!entity) {
                throw new common_1.NotFoundException('Entity not found');
            }
            const stakes = await OwnershipStakeModel.findAll({
                where: { entityId },
            });
            const totalPercentage = stakes.reduce((sum, stake) => sum + (stake.percentageOwned || 0), 0);
            return {
                entity: entity.toJSON(),
                stakes: stakes.map((s) => s.toJSON()),
                totalPercentage,
                ownerCount: stakes.length,
            };
        }
        /**
         * 12. Generate cap table
         *
         * @param entityId Entity ID
         * @returns Cap table with equity distribution
         */
        async generateCapTable(entityId) {
            this.logger.log(`Generating cap table for: ${entityId}`);
            const { entity, stakes } = await this.getOwnershipBreakdown(entityId);
            const equity = stakes.map((stake) => ({
                ownerName: stake.ownerName,
                ownerType: stake.ownerType,
                ownershipType: stake.ownershipType,
                sharesOwned: stake.sharesOwned,
                percentageOwned: stake.percentageOwned,
                votingPercentage: stake.votingPercentage,
                currentValue: stake.currentValue,
            }));
            const totalShares = stakes.reduce((sum, stake) => sum + (stake.sharesOwned || 0), 0);
            const totalValue = stakes.reduce((sum, stake) => sum + (stake.currentValue || 0), 0);
            // Calculate fully diluted shares (including options, warrants, etc.)
            const optionShares = stakes
                .filter((s) => s.ownershipType === OwnershipType.EQUITY_OPTION ||
                s.ownershipType === OwnershipType.WARRANT)
                .reduce((sum, stake) => sum + (stake.sharesOwned || 0), 0);
            const fullyDilutedShares = totalShares + optionShares;
            return {
                entity,
                equity,
                totalShares: totalShares || undefined,
                totalValue: totalValue || undefined,
                fullyDilutedShares: fullyDilutedShares || undefined,
            };
        }
        /**
         * 13. Transfer ownership stake
         *
         * @param stakeId Stake ID to transfer
         * @param newOwnerId New owner ID
         * @param newOwnerName New owner name
         * @param transferDate Transfer date
         * @param transferPrice Transfer price
         * @returns Updated stake
         */
        async transferOwnershipStake(stakeId, newOwnerId, newOwnerName, transferDate, transferPrice) {
            this.logger.log(`Transferring ownership stake: ${stakeId}`);
            const stake = await OwnershipStakeModel.findByPk(stakeId);
            if (!stake) {
                throw new common_1.NotFoundException('Ownership stake not found');
            }
            const oldOwner = {
                ownerId: stake.ownerId,
                ownerName: stake.ownerName,
            };
            stake.ownerId = newOwnerId;
            stake.ownerName = newOwnerName;
            stake.acquisitionDate = transferDate;
            if (transferPrice !== undefined) {
                stake.acquisitionPrice = transferPrice;
            }
            // Log transfer in metadata
            const metadata = stake.metadata || {};
            if (!metadata.transferHistory) {
                metadata.transferHistory = [];
            }
            metadata.transferHistory.push({
                fromOwnerId: oldOwner.ownerId,
                fromOwnerName: oldOwner.ownerName,
                toOwnerId: newOwnerId,
                toOwnerName: newOwnerName,
                transferDate: transferDate.toISOString(),
                transferPrice,
            });
            stake.metadata = metadata;
            await stake.save();
            this.logger.log(`Ownership stake ${stakeId} transferred to ${newOwnerName}`);
            return stake.toJSON();
        }
        // ============================================================================
        // OFFICERS & DIRECTORS
        // ============================================================================
        /**
         * 14. Add officer/director
         *
         * @param entityId Entity ID
         * @param officer Officer details
         * @returns Created officer
         */
        async addOfficer(entityId, officer) {
            this.logger.log(`Adding officer to entity: ${entityId}`);
            const entity = await LegalEntityModel.findByPk(entityId);
            if (!entity) {
                throw new common_1.NotFoundException('Entity not found');
            }
            const entityOfficer = await EntityOfficerModel.create({
                entityId,
                ...officer,
            });
            this.logger.log(`Officer created: ${entityOfficer.id}`);
            return entityOfficer.toJSON();
        }
        /**
         * 15. Remove/terminate officer
         *
         * @param officerId Officer ID
         * @param resignationDate Resignation date
         * @returns Updated officer
         */
        async terminateOfficer(officerId, resignationDate) {
            this.logger.log(`Terminating officer: ${officerId}`);
            const officer = await EntityOfficerModel.findByPk(officerId);
            if (!officer) {
                throw new common_1.NotFoundException('Officer not found');
            }
            officer.resignationDate = resignationDate;
            officer.isActive = false;
            await officer.save();
            this.logger.log(`Officer ${officerId} terminated`);
            return officer.toJSON();
        }
        /**
         * 16. Get active officers for entity
         *
         * @param entityId Entity ID
         * @returns List of active officers
         */
        async getActiveOfficers(entityId) {
            this.logger.log(`Getting active officers for: ${entityId}`);
            const officers = await EntityOfficerModel.findAll({
                where: {
                    entityId,
                    isActive: true,
                },
                order: [['appointmentDate', 'ASC']],
            });
            return officers.map((o) => o.toJSON());
        }
        /**
         * 17. Update officer role/compensation
         *
         * @param officerId Officer ID
         * @param updates Updates to apply
         * @returns Updated officer
         */
        async updateOfficer(officerId, updates) {
            this.logger.log(`Updating officer: ${officerId}`);
            const officer = await EntityOfficerModel.findByPk(officerId);
            if (!officer) {
                throw new common_1.NotFoundException('Officer not found');
            }
            await officer.update(updates);
            this.logger.log(`Officer ${officerId} updated`);
            return officer.toJSON();
        }
        // ============================================================================
        // COMPLIANCE CALENDAR
        // ============================================================================
        /**
         * 18. Create compliance event
         *
         * @param event Compliance event details
         * @returns Created compliance event
         */
        async createComplianceEvent(event) {
            this.logger.log(`Creating compliance event for entity: ${event.entityId}`);
            const validated = exports.ComplianceEventSchema.parse(event);
            const entity = await LegalEntityModel.findByPk(validated.entityId);
            if (!entity) {
                throw new common_1.NotFoundException('Entity not found');
            }
            const complianceEvent = await ComplianceEventModel.create({
                ...validated,
                status: ComplianceStatus.UPCOMING,
                documents: [],
            });
            this.logger.log(`Compliance event created: ${complianceEvent.id}`);
            return complianceEvent.toJSON();
        }
        /**
         * 19. Update compliance event status
         *
         * @param eventId Event ID
         * @param status New status
         * @param completionDate Completion date if completed
         * @returns Updated event
         */
        async updateComplianceStatus(eventId, status, completionDate) {
            this.logger.log(`Updating compliance event ${eventId} to ${status}`);
            const event = await ComplianceEventModel.findByPk(eventId);
            if (!event) {
                throw new common_1.NotFoundException('Compliance event not found');
            }
            event.status = status;
            if (completionDate) {
                event.completionDate = completionDate;
            }
            await event.save();
            this.logger.log(`Compliance event ${eventId} updated to ${status}`);
            return event.toJSON();
        }
        /**
         * 20. Get upcoming compliance events
         *
         * @param entityId Optional entity ID filter
         * @param daysAhead Number of days to look ahead
         * @returns Upcoming compliance events
         */
        async getUpcomingComplianceEvents(entityId, daysAhead = 90) {
            this.logger.log(`Getting upcoming compliance events (${daysAhead} days)`);
            const where = {
                dueDate: {
                    [sequelize_1.Op.lte]: new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000),
                    [sequelize_1.Op.gte]: new Date(),
                },
                status: {
                    [sequelize_1.Op.in]: [ComplianceStatus.UPCOMING, ComplianceStatus.DUE_SOON],
                },
            };
            if (entityId) {
                where.entityId = entityId;
            }
            const events = await ComplianceEventModel.findAll({
                where,
                order: [['dueDate', 'ASC']],
                include: [
                    {
                        model: LegalEntityModel,
                        as: 'entity',
                    },
                ],
            });
            return events.map((e) => e.toJSON());
        }
        /**
         * 21. Get overdue compliance events
         *
         * @param entityId Optional entity ID filter
         * @returns Overdue compliance events
         */
        async getOverdueComplianceEvents(entityId) {
            this.logger.log('Getting overdue compliance events');
            const where = {
                dueDate: {
                    [sequelize_1.Op.lt]: new Date(),
                },
                status: {
                    [sequelize_1.Op.notIn]: [ComplianceStatus.COMPLETED, ComplianceStatus.FILED, ComplianceStatus.WAIVED],
                },
            };
            if (entityId) {
                where.entityId = entityId;
            }
            const events = await ComplianceEventModel.findAll({
                where,
                order: [['dueDate', 'ASC']],
                include: [
                    {
                        model: LegalEntityModel,
                        as: 'entity',
                    },
                ],
            });
            return events.map((e) => e.toJSON());
        }
        /**
         * 22. Add document to compliance event
         *
         * @param eventId Event ID
         * @param document Document details
         * @returns Updated event
         */
        async addComplianceDocument(eventId, document) {
            this.logger.log(`Adding document to compliance event: ${eventId}`);
            const event = await ComplianceEventModel.findByPk(eventId);
            if (!event) {
                throw new common_1.NotFoundException('Compliance event not found');
            }
            const documents = event.documents || [];
            documents.push(document);
            event.documents = documents;
            await event.save();
            this.logger.log(`Document added to compliance event ${eventId}`);
            return event.toJSON();
        }
        /**
         * 23. Update compliance event reminder settings
         *
         * @param eventId Event ID
         * @param reminderDays Days before due date to send reminders
         * @returns Updated event
         */
        async updateComplianceReminders(eventId, reminderDays) {
            this.logger.log(`Updating compliance reminders for: ${eventId}`);
            const event = await ComplianceEventModel.findByPk(eventId);
            if (!event) {
                throw new common_1.NotFoundException('Compliance event not found');
            }
            event.reminderDays = reminderDays;
            await event.save();
            this.logger.log(`Compliance reminders updated for ${eventId}`);
            return event.toJSON();
        }
        /**
         * 24. Get compliance calendar for entity
         *
         * @param entityId Entity ID
         * @param startDate Start date
         * @param endDate End date
         * @returns Compliance events in date range
         */
        async getComplianceCalendar(entityId, startDate, endDate) {
            this.logger.log(`Getting compliance calendar for: ${entityId}`);
            const events = await ComplianceEventModel.findAll({
                where: {
                    entityId,
                    dueDate: {
                        [sequelize_1.Op.between]: [startDate, endDate],
                    },
                },
                order: [['dueDate', 'ASC']],
            });
            return events.map((e) => e.toJSON());
        }
        // ============================================================================
        // ENTITY SEARCH & QUERIES
        // ============================================================================
        /**
         * 25. Search entities by criteria
         *
         * @param criteria Search criteria
         * @returns Matching entities and total count
         */
        async searchEntities(criteria) {
            this.logger.log('Searching entities with criteria');
            const validated = exports.EntitySearchCriteriaSchema.parse(criteria);
            const where = {};
            // Full-text search
            if (validated.query) {
                where[sequelize_1.Op.or] = [
                    { legalName: { [sequelize_1.Op.iLike]: `%${validated.query}%` } },
                    { dbaName: { [sequelize_1.Op.iLike]: `%${validated.query}%` } },
                    { entityNumber: { [sequelize_1.Op.iLike]: `%${validated.query}%` } },
                ];
            }
            // Entity type filter
            if (validated.entityType && validated.entityType.length > 0) {
                where.entityType = { [sequelize_1.Op.in]: validated.entityType };
            }
            // Status filter
            if (validated.status && validated.status.length > 0) {
                where.status = { [sequelize_1.Op.in]: validated.status };
            }
            // Jurisdiction filter
            if (validated.jurisdiction && validated.jurisdiction.length > 0) {
                where.incorporationJurisdiction = { [sequelize_1.Op.in]: validated.jurisdiction };
            }
            // Tax classification filter
            if (validated.taxClassification && validated.taxClassification.length > 0) {
                where.taxClassification = { [sequelize_1.Op.in]: validated.taxClassification };
            }
            // Parent entity filter
            if (validated.parentEntityId) {
                where.parentEntityId = validated.parentEntityId;
            }
            // Has parent filter
            if (validated.hasParent !== undefined) {
                where.parentEntityId = validated.hasParent
                    ? { [sequelize_1.Op.ne]: null }
                    : { [sequelize_1.Op.eq]: null };
            }
            // Date range filters
            if (validated.createdAfter) {
                where.createdAt = { [sequelize_1.Op.gte]: validated.createdAfter };
            }
            if (validated.createdBefore) {
                if (where.createdAt) {
                    where.createdAt[sequelize_1.Op.lte] = validated.createdBefore;
                }
                else {
                    where.createdAt = { [sequelize_1.Op.lte]: validated.createdBefore };
                }
            }
            const { count, rows } = await LegalEntityModel.findAndCountAll({
                where,
                limit: validated.limit,
                offset: validated.offset,
                order: [[validated.sortBy, validated.sortOrder]],
            });
            this.logger.log(`Found ${count} entities matching criteria`);
            return {
                entities: rows.map((r) => r.toJSON()),
                total: count,
            };
        }
        /**
         * 26. Get entity by ID with full details
         *
         * @param entityId Entity ID
         * @returns Entity with related data
         */
        async getEntityById(entityId) {
            this.logger.log(`Getting entity by ID: ${entityId}`);
            const entity = await LegalEntityModel.findByPk(entityId);
            if (!entity) {
                throw new common_1.NotFoundException('Entity not found');
            }
            const [officers, ownershipStakes, subsidiaries, parents, upcomingCompliance] = await Promise.all([
                this.getActiveOfficers(entityId),
                OwnershipStakeModel.findAll({ where: { entityId } }).then((stakes) => stakes.map((s) => s.toJSON())),
                this.getSubsidiaries(entityId, false),
                this.getParentEntities(entityId),
                this.getUpcomingComplianceEvents(entityId, 90),
            ]);
            return {
                entity: entity.toJSON(),
                officers,
                ownershipStakes,
                subsidiaries,
                parents,
                upcomingCompliance,
            };
        }
        /**
         * 27. Get entity by entity number
         *
         * @param entityNumber Entity number
         * @returns Entity
         */
        async getEntityByNumber(entityNumber) {
            this.logger.log(`Getting entity by number: ${entityNumber}`);
            const entity = await LegalEntityModel.findOne({
                where: { entityNumber },
            });
            if (!entity) {
                throw new common_1.NotFoundException('Entity not found');
            }
            return entity.toJSON();
        }
        /**
         * 28. Search entities by jurisdiction
         *
         * @param jurisdiction Jurisdiction code
         * @returns Entities in jurisdiction
         */
        async getEntitiesByJurisdiction(jurisdiction) {
            this.logger.log(`Getting entities in jurisdiction: ${jurisdiction}`);
            const entities = await LegalEntityModel.findAll({
                where: {
                    incorporationJurisdiction: jurisdiction,
                },
                order: [['legalName', 'ASC']],
            });
            return entities.map((e) => e.toJSON());
        }
        // ============================================================================
        // ENTITY HEALTH & MONITORING
        // ============================================================================
        /**
         * 29. Get entity health metrics
         *
         * @param entityId Entity ID
         * @returns Health metrics
         */
        async getEntityHealthMetrics(entityId) {
            this.logger.log(`Getting health metrics for: ${entityId}`);
            const entity = await LegalEntityModel.findByPk(entityId);
            if (!entity) {
                throw new common_1.NotFoundException('Entity not found');
            }
            const [overdueEvents, upcomingEvents, activeOfficers] = await Promise.all([
                this.getOverdueComplianceEvents(entityId),
                this.getUpcomingComplianceEvents(entityId, 30),
                this.getActiveOfficers(entityId),
            ]);
            const issues = [];
            // Check for overdue compliance
            if (overdueEvents.length > 0) {
                issues.push({
                    severity: 'critical',
                    category: 'compliance',
                    description: `${overdueEvents.length} overdue compliance event(s)`,
                    remediation: 'Complete or update overdue compliance items',
                });
            }
            // Check for upcoming deadlines
            if (upcomingEvents.length > 5) {
                issues.push({
                    severity: 'medium',
                    category: 'compliance',
                    description: `${upcomingEvents.length} upcoming compliance event(s) in next 30 days`,
                    remediation: 'Review and schedule compliance activities',
                });
            }
            // Check officer status
            if (activeOfficers.length === 0) {
                issues.push({
                    severity: 'high',
                    category: 'governance',
                    description: 'No active officers on record',
                    remediation: 'Appoint required officers',
                });
            }
            // Check entity status
            const goodStanding = entity.status === EntityStatus.GOOD_STANDING ||
                entity.status === EntityStatus.ACTIVE;
            if (!goodStanding) {
                issues.push({
                    severity: 'high',
                    category: 'status',
                    description: `Entity status is ${entity.status}`,
                    remediation: 'Address entity status issues',
                });
            }
            // Calculate compliance score (0-100)
            let complianceScore = 100;
            complianceScore -= overdueEvents.length * 10;
            complianceScore -= upcomingEvents.length * 2;
            if (activeOfficers.length === 0)
                complianceScore -= 20;
            if (!goodStanding)
                complianceScore -= 30;
            complianceScore = Math.max(0, complianceScore);
            // Determine overall health
            let overallHealth;
            if (complianceScore >= 80) {
                overallHealth = 'healthy';
            }
            else if (complianceScore >= 50) {
                overallHealth = 'warning';
            }
            else {
                overallHealth = 'critical';
            }
            return {
                entityId,
                overallHealth,
                complianceScore,
                overdueCompliance: overdueEvents.length,
                upcomingDeadlines: upcomingEvents.length,
                activeOfficers: activeOfficers.length,
                goodStanding,
                issues,
            };
        }
        /**
         * 30. Monitor entity compliance status
         *
         * @param entityId Entity ID
         * @returns Compliance monitoring report
         */
        async monitorEntityCompliance(entityId) {
            this.logger.log(`Monitoring compliance for: ${entityId}`);
            const entity = await LegalEntityModel.findByPk(entityId);
            if (!entity) {
                throw new common_1.NotFoundException('Entity not found');
            }
            const [overdue, dueSoon, upcoming, allEvents] = await Promise.all([
                this.getOverdueComplianceEvents(entityId),
                ComplianceEventModel.findAll({
                    where: {
                        entityId,
                        status: ComplianceStatus.DUE_SOON,
                    },
                    order: [['dueDate', 'ASC']],
                }).then((events) => events.map((e) => e.toJSON())),
                this.getUpcomingComplianceEvents(entityId, 90),
                ComplianceEventModel.findAll({
                    where: { entityId },
                }),
            ]);
            const completed = allEvents.filter((e) => e.status === ComplianceStatus.COMPLETED ||
                e.status === ComplianceStatus.FILED).length;
            return {
                entity: entity.toJSON(),
                overdue,
                dueSoon,
                upcoming,
                completed,
                totalEvents: allEvents.length,
            };
        }
        // ============================================================================
        // REPORTING & ANALYTICS
        // ============================================================================
        /**
         * 31. Generate entity portfolio report
         *
         * @param tenantId Optional tenant ID filter
         * @returns Portfolio summary
         */
        async generatePortfolioReport(tenantId) {
            this.logger.log('Generating entity portfolio report');
            const where = {};
            if (tenantId) {
                where.tenantId = tenantId;
            }
            const entities = await LegalEntityModel.findAll({ where });
            const byType = entities.reduce((acc, e) => {
                acc[e.entityType] = (acc[e.entityType] || 0) + 1;
                return acc;
            }, {});
            const byStatus = entities.reduce((acc, e) => {
                acc[e.status] = (acc[e.status] || 0) + 1;
                return acc;
            }, {});
            const byJurisdiction = entities.reduce((acc, e) => {
                acc[e.incorporationJurisdiction] =
                    (acc[e.incorporationJurisdiction] || 0) + 1;
                return acc;
            }, {});
            // Get overdue compliance count
            const overdueEvents = await ComplianceEventModel.findAll({
                where: {
                    dueDate: { [sequelize_1.Op.lt]: new Date() },
                    status: {
                        [sequelize_1.Op.notIn]: [
                            ComplianceStatus.COMPLETED,
                            ComplianceStatus.FILED,
                            ComplianceStatus.WAIVED,
                        ],
                    },
                },
            });
            const entitiesWithOverdue = new Set(overdueEvents.map((e) => e.entityId)).size;
            return {
                totalEntities: entities.length,
                byType,
                byStatus,
                byJurisdiction,
                overdueCompliance: overdueEvents.length,
                entitiesAtRisk: entitiesWithOverdue,
            };
        }
        /**
         * 32. Get entities requiring annual filings
         *
         * @param monthsAhead Months to look ahead
         * @returns Entities with upcoming annual filings
         */
        async getEntitiesRequiringAnnualFilings(monthsAhead = 3) {
            this.logger.log('Getting entities requiring annual filings');
            const endDate = new Date();
            endDate.setMonth(endDate.getMonth() + monthsAhead);
            const events = await ComplianceEventModel.findAll({
                where: {
                    eventType: {
                        [sequelize_1.Op.in]: [
                            ComplianceEventType.ANNUAL_REPORT,
                            ComplianceEventType.FRANCHISE_TAX,
                        ],
                    },
                    dueDate: {
                        [sequelize_1.Op.between]: [new Date(), endDate],
                    },
                    status: {
                        [sequelize_1.Op.notIn]: [ComplianceStatus.COMPLETED, ComplianceStatus.FILED],
                    },
                },
                include: [
                    {
                        model: LegalEntityModel,
                        as: 'entity',
                    },
                ],
                order: [['dueDate', 'ASC']],
            });
            return events.map((e) => ({
                entity: e.entity.toJSON(),
                dueDate: e.dueDate,
                filingType: e.eventType,
            }));
        }
        // ============================================================================
        // UTILITY FUNCTIONS
        // ============================================================================
        /**
         * 33. Generate unique entity number
         *
         * @param entityType Entity type
         * @returns Generated entity number
         */
        async generateEntityNumber(entityType) {
            const prefix = this.getEntityTypePrefix(entityType);
            const timestamp = Date.now().toString(36).toUpperCase();
            const random = crypto.randomBytes(3).toString('hex').toUpperCase();
            return `${prefix}-${timestamp}-${random}`;
        }
        /**
         * 34. Validate entity in good standing
         *
         * @param entityId Entity ID
         * @returns Whether entity is in good standing
         */
        async validateGoodStanding(entityId) {
            const entity = await LegalEntityModel.findByPk(entityId);
            if (!entity) {
                return false;
            }
            // Check status
            if (entity.status !== EntityStatus.GOOD_STANDING &&
                entity.status !== EntityStatus.ACTIVE) {
                return false;
            }
            // Check for overdue compliance
            const overdueEvents = await this.getOverdueComplianceEvents(entityId);
            if (overdueEvents.length > 0) {
                return false;
            }
            return true;
        }
        /**
         * 35. Merge entities
         *
         * @param sourceEntityId Entity being merged (will be marked as merged)
         * @param targetEntityId Entity to merge into
         * @param mergerDate Date of merger
         * @param userId User performing merger
         * @returns Updated entities
         */
        async mergeEntities(sourceEntityId, targetEntityId, mergerDate, userId) {
            this.logger.log(`Merging entity ${sourceEntityId} into ${targetEntityId}`);
            const transaction = await this.sequelize.transaction();
            try {
                const [source, target] = await Promise.all([
                    LegalEntityModel.findByPk(sourceEntityId, { transaction }),
                    LegalEntityModel.findByPk(targetEntityId, { transaction }),
                ]);
                if (!source || !target) {
                    throw new common_1.NotFoundException('One or both entities not found');
                }
                // Update source entity status
                source.status = EntityStatus.MERGED;
                source.updatedBy = userId;
                const sourceMetadata = source.metadata || {
                    tags: [],
                    customFields: {},
                    externalIds: {},
                };
                sourceMetadata.customFields.mergedInto = targetEntityId;
                sourceMetadata.customFields.mergerDate = mergerDate.toISOString();
                source.metadata = sourceMetadata;
                await source.save({ transaction });
                // Create relationship
                await EntityRelationshipModel.create({
                    parentEntityId: targetEntityId,
                    childEntityId: sourceEntityId,
                    relationshipType: EntityRelationshipType.MERGED_INTO,
                    effectiveDate: mergerDate,
                }, { transaction });
                // Transfer ownership stakes
                await OwnershipStakeModel.update({ entityId: targetEntityId }, {
                    where: { entityId: sourceEntityId },
                    transaction,
                });
                // Transfer compliance events
                await ComplianceEventModel.update({ entityId: targetEntityId }, {
                    where: {
                        entityId: sourceEntityId,
                        status: {
                            [sequelize_1.Op.notIn]: [ComplianceStatus.COMPLETED, ComplianceStatus.FILED],
                        },
                    },
                    transaction,
                });
                await transaction.commit();
                this.logger.log(`Successfully merged ${sourceEntityId} into ${targetEntityId}`);
                return {
                    source: source.toJSON(),
                    target: target.toJSON(),
                };
            }
            catch (error) {
                await transaction.rollback();
                this.logger.error(`Failed to merge entities: ${error.message}`, error.stack);
                throw new common_1.InternalServerErrorException('Failed to merge entities');
            }
        }
        /**
         * 36. Bulk update entity metadata
         *
         * @param entityIds Array of entity IDs
         * @param metadataUpdates Metadata updates to apply
         * @param userId User performing update
         * @returns Number of entities updated
         */
        async bulkUpdateEntityMetadata(entityIds, metadataUpdates, userId) {
            this.logger.log(`Bulk updating metadata for ${entityIds.length} entities`);
            const entities = await LegalEntityModel.findAll({
                where: {
                    id: { [sequelize_1.Op.in]: entityIds },
                },
            });
            let updated = 0;
            for (const entity of entities) {
                const metadata = entity.metadata || {
                    tags: [],
                    customFields: {},
                    externalIds: {},
                };
                // Merge metadata updates
                if (metadataUpdates.tags) {
                    metadata.tags = [
                        ...new Set([...metadata.tags, ...metadataUpdates.tags]),
                    ];
                }
                if (metadataUpdates.customFields) {
                    metadata.customFields = {
                        ...metadata.customFields,
                        ...metadataUpdates.customFields,
                    };
                }
                if (metadataUpdates.externalIds) {
                    metadata.externalIds = {
                        ...metadata.externalIds,
                        ...metadataUpdates.externalIds,
                    };
                }
                if (metadataUpdates.industry) {
                    metadata.industry = metadataUpdates.industry;
                }
                if (metadataUpdates.naicsCode) {
                    metadata.naicsCode = metadataUpdates.naicsCode;
                }
                if (metadataUpdates.sicCode) {
                    metadata.sicCode = metadataUpdates.sicCode;
                }
                entity.metadata = metadata;
                entity.updatedBy = userId;
                await entity.save();
                updated++;
            }
            this.logger.log(`Updated metadata for ${updated} entities`);
            return updated;
        }
        // ============================================================================
        // PRIVATE HELPER METHODS
        // ============================================================================
        getEntityTypePrefix(entityType) {
            const prefixes = {
                [EntityType.CORPORATION]: 'CORP',
                [EntityType.LLC]: 'LLC',
                [EntityType.LLP]: 'LLP',
                [EntityType.PARTNERSHIP]: 'PART',
                [EntityType.SOLE_PROPRIETORSHIP]: 'SOLE',
                [EntityType.NONPROFIT]: 'NPO',
                [EntityType.PROFESSIONAL_CORPORATION]: 'PC',
                [EntityType.S_CORPORATION]: 'SCORP',
                [EntityType.C_CORPORATION]: 'CCORP',
                [EntityType.BENEFIT_CORPORATION]: 'BCORP',
                [EntityType.COOPERATIVE]: 'COOP',
                [EntityType.JOINT_VENTURE]: 'JV',
                [EntityType.TRUST]: 'TRST',
                [EntityType.HOLDING_COMPANY]: 'HOLD',
                [EntityType.SUBSIDIARY]: 'SUB',
                [EntityType.BRANCH]: 'BRNCH',
                [EntityType.DIVISION]: 'DIV',
                [EntityType.OTHER]: 'ENT',
            };
            return prefixes[entityType] || 'ENT';
        }
        async checkCircularRelationship(parentId, childId) {
            // Check if childId is an ancestor of parentId
            const checkAncestor = async (currentId, targetId, visited = new Set()) => {
                if (visited.has(currentId)) {
                    return false; // Avoid infinite loops
                }
                visited.add(currentId);
                if (currentId === targetId) {
                    return true;
                }
                const relationships = await EntityRelationshipModel.findAll({
                    where: {
                        childEntityId: currentId,
                        endDate: null,
                    },
                });
                for (const rel of relationships) {
                    const isAncestor = await checkAncestor(rel.parentEntityId, targetId, visited);
                    if (isAncestor) {
                        return true;
                    }
                }
                return false;
            };
            return checkAncestor(parentId, childId);
        }
        async buildEntityTree(entity, maxDepth, currentDepth) {
            if (currentDepth >= maxDepth) {
                return entity.toJSON();
            }
            const entityJson = entity.toJSON();
            entityJson.children = [];
            const childRelationships = await EntityRelationshipModel.findAll({
                where: {
                    parentEntityId: entity.id,
                    endDate: null,
                },
                include: [
                    {
                        model: LegalEntityModel,
                        as: 'childEntity',
                    },
                ],
            });
            for (const rel of childRelationships) {
                if (rel.childEntity) {
                    const childTree = await this.buildEntityTree(rel.childEntity, maxDepth, currentDepth + 1);
                    entityJson.children.push({
                        ...childTree,
                        relationshipType: rel.relationshipType,
                        ownershipPercentage: rel.ownershipPercentage,
                    });
                }
            }
            return entityJson;
        }
        async createInitialComplianceEvents(entityId, request, transaction) {
            const events = [];
            // Annual report (typically due on anniversary of incorporation)
            const nextYear = new Date();
            nextYear.setFullYear(nextYear.getFullYear() + 1);
            events.push({
                entityId,
                eventType: ComplianceEventType.ANNUAL_REPORT,
                title: 'Annual Report Filing',
                description: 'File annual report with state',
                dueDate: nextYear,
                jurisdiction: request.incorporationJurisdiction,
                reminderDays: [60, 30, 14, 7],
                recurring: true,
                recurrenceRule: 'FREQ=YEARLY',
                priority: 'high',
            });
            // Franchise tax (if applicable)
            if (request.entityType === EntityType.CORPORATION ||
                request.entityType === EntityType.LLC) {
                const taxDue = new Date();
                taxDue.setMonth(3, 15); // April 15
                if (taxDue < new Date()) {
                    taxDue.setFullYear(taxDue.getFullYear() + 1);
                }
                events.push({
                    entityId,
                    eventType: ComplianceEventType.FRANCHISE_TAX,
                    title: 'Franchise Tax Payment',
                    description: 'Pay franchise tax',
                    dueDate: taxDue,
                    jurisdiction: request.incorporationJurisdiction,
                    reminderDays: [60, 30, 14, 7],
                    recurring: true,
                    recurrenceRule: 'FREQ=YEARLY',
                    priority: 'high',
                });
            }
            for (const event of events) {
                await ComplianceEventModel.create({
                    ...event,
                    status: ComplianceStatus.UPCOMING,
                    documents: [],
                    metadata: {},
                }, { transaction });
            }
        }
    };
    __setFunctionName(_classThis, "LegalEntityManagementService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        LegalEntityManagementService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return LegalEntityManagementService = _classThis;
})();
exports.LegalEntityManagementService = LegalEntityManagementService;
// ============================================================================
// NESTJS MODULE
// ============================================================================
/**
 * Legal Entity Management Configuration
 */
exports.legalEntityManagementConfig = (0, config_1.registerAs)('legalEntityManagement', () => ({
    autoGenerateEntityNumbers: process.env.AUTO_GENERATE_ENTITY_NUMBERS !== 'false',
    complianceReminderEnabled: process.env.COMPLIANCE_REMINDER_ENABLED !== 'false',
    defaultReminderDays: process.env.DEFAULT_REMINDER_DAYS
        ? JSON.parse(process.env.DEFAULT_REMINDER_DAYS)
        : [30, 14, 7, 1],
}));
/**
 * Legal Entity Management Module
 */
let LegalEntityManagementModule = (() => {
    let _classDecorators = [(0, common_1.Global)(), (0, common_1.Module)({
            imports: [
                config_1.ConfigModule.forFeature(exports.legalEntityManagementConfig),
            ],
            providers: [LegalEntityManagementService],
            exports: [LegalEntityManagementService],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var LegalEntityManagementModule = _classThis = class {
        static forRoot(options) {
            return {
                module: LegalEntityManagementModule,
                providers: [
                    {
                        provide: 'SEQUELIZE',
                        useValue: options?.sequelize,
                    },
                    LegalEntityManagementService,
                ],
                exports: [LegalEntityManagementService],
            };
        }
    };
    __setFunctionName(_classThis, "LegalEntityManagementModule");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        LegalEntityManagementModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return LegalEntityManagementModule = _classThis;
})();
exports.LegalEntityManagementModule = LegalEntityManagementModule;
// ============================================================================
// SWAGGER API TYPES (for documentation)
// ============================================================================
let CreateEntityDto = (() => {
    var _a;
    let _legalName_decorators;
    let _legalName_initializers = [];
    let _legalName_extraInitializers = [];
    let _dbaName_decorators;
    let _dbaName_initializers = [];
    let _dbaName_extraInitializers = [];
    let _entityType_decorators;
    let _entityType_initializers = [];
    let _entityType_extraInitializers = [];
    let _incorporationJurisdiction_decorators;
    let _incorporationJurisdiction_initializers = [];
    let _incorporationJurisdiction_extraInitializers = [];
    let _businessPurpose_decorators;
    let _businessPurpose_initializers = [];
    let _businessPurpose_extraInitializers = [];
    let _registeredAgentName_decorators;
    let _registeredAgentName_initializers = [];
    let _registeredAgentName_extraInitializers = [];
    let _registeredAgentAddress_decorators;
    let _registeredAgentAddress_initializers = [];
    let _registeredAgentAddress_extraInitializers = [];
    let _principalAddress_decorators;
    let _principalAddress_initializers = [];
    let _principalAddress_extraInitializers = [];
    return _a = class CreateEntityDto {
            constructor() {
                this.legalName = __runInitializers(this, _legalName_initializers, void 0);
                this.dbaName = (__runInitializers(this, _legalName_extraInitializers), __runInitializers(this, _dbaName_initializers, void 0));
                this.entityType = (__runInitializers(this, _dbaName_extraInitializers), __runInitializers(this, _entityType_initializers, void 0));
                this.incorporationJurisdiction = (__runInitializers(this, _entityType_extraInitializers), __runInitializers(this, _incorporationJurisdiction_initializers, void 0));
                this.businessPurpose = (__runInitializers(this, _incorporationJurisdiction_extraInitializers), __runInitializers(this, _businessPurpose_initializers, void 0));
                this.registeredAgentName = (__runInitializers(this, _businessPurpose_extraInitializers), __runInitializers(this, _registeredAgentName_initializers, void 0));
                this.registeredAgentAddress = (__runInitializers(this, _registeredAgentName_extraInitializers), __runInitializers(this, _registeredAgentAddress_initializers, void 0));
                this.principalAddress = (__runInitializers(this, _registeredAgentAddress_extraInitializers), __runInitializers(this, _principalAddress_initializers, void 0));
                __runInitializers(this, _principalAddress_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _legalName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Legal name of entity' })];
            _dbaName_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Doing business as name' })];
            _entityType_decorators = [(0, swagger_1.ApiProperty)({ enum: EntityType, description: 'Entity type' })];
            _incorporationJurisdiction_decorators = [(0, swagger_1.ApiProperty)({ description: 'Incorporation jurisdiction' })];
            _businessPurpose_decorators = [(0, swagger_1.ApiProperty)({ description: 'Business purpose' })];
            _registeredAgentName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Registered agent name' })];
            _registeredAgentAddress_decorators = [(0, swagger_1.ApiProperty)({ type: 'object', description: 'Registered agent address' })];
            _principalAddress_decorators = [(0, swagger_1.ApiProperty)({ type: 'object', description: 'Principal address' })];
            __esDecorate(null, null, _legalName_decorators, { kind: "field", name: "legalName", static: false, private: false, access: { has: obj => "legalName" in obj, get: obj => obj.legalName, set: (obj, value) => { obj.legalName = value; } }, metadata: _metadata }, _legalName_initializers, _legalName_extraInitializers);
            __esDecorate(null, null, _dbaName_decorators, { kind: "field", name: "dbaName", static: false, private: false, access: { has: obj => "dbaName" in obj, get: obj => obj.dbaName, set: (obj, value) => { obj.dbaName = value; } }, metadata: _metadata }, _dbaName_initializers, _dbaName_extraInitializers);
            __esDecorate(null, null, _entityType_decorators, { kind: "field", name: "entityType", static: false, private: false, access: { has: obj => "entityType" in obj, get: obj => obj.entityType, set: (obj, value) => { obj.entityType = value; } }, metadata: _metadata }, _entityType_initializers, _entityType_extraInitializers);
            __esDecorate(null, null, _incorporationJurisdiction_decorators, { kind: "field", name: "incorporationJurisdiction", static: false, private: false, access: { has: obj => "incorporationJurisdiction" in obj, get: obj => obj.incorporationJurisdiction, set: (obj, value) => { obj.incorporationJurisdiction = value; } }, metadata: _metadata }, _incorporationJurisdiction_initializers, _incorporationJurisdiction_extraInitializers);
            __esDecorate(null, null, _businessPurpose_decorators, { kind: "field", name: "businessPurpose", static: false, private: false, access: { has: obj => "businessPurpose" in obj, get: obj => obj.businessPurpose, set: (obj, value) => { obj.businessPurpose = value; } }, metadata: _metadata }, _businessPurpose_initializers, _businessPurpose_extraInitializers);
            __esDecorate(null, null, _registeredAgentName_decorators, { kind: "field", name: "registeredAgentName", static: false, private: false, access: { has: obj => "registeredAgentName" in obj, get: obj => obj.registeredAgentName, set: (obj, value) => { obj.registeredAgentName = value; } }, metadata: _metadata }, _registeredAgentName_initializers, _registeredAgentName_extraInitializers);
            __esDecorate(null, null, _registeredAgentAddress_decorators, { kind: "field", name: "registeredAgentAddress", static: false, private: false, access: { has: obj => "registeredAgentAddress" in obj, get: obj => obj.registeredAgentAddress, set: (obj, value) => { obj.registeredAgentAddress = value; } }, metadata: _metadata }, _registeredAgentAddress_initializers, _registeredAgentAddress_extraInitializers);
            __esDecorate(null, null, _principalAddress_decorators, { kind: "field", name: "principalAddress", static: false, private: false, access: { has: obj => "principalAddress" in obj, get: obj => obj.principalAddress, set: (obj, value) => { obj.principalAddress = value; } }, metadata: _metadata }, _principalAddress_initializers, _principalAddress_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateEntityDto = CreateEntityDto;
let EntityResponseDto = (() => {
    var _a;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _entityNumber_decorators;
    let _entityNumber_initializers = [];
    let _entityNumber_extraInitializers = [];
    let _legalName_decorators;
    let _legalName_initializers = [];
    let _legalName_extraInitializers = [];
    let _entityType_decorators;
    let _entityType_initializers = [];
    let _entityType_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    return _a = class EntityResponseDto {
            constructor() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.entityNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _entityNumber_initializers, void 0));
                this.legalName = (__runInitializers(this, _entityNumber_extraInitializers), __runInitializers(this, _legalName_initializers, void 0));
                this.entityType = (__runInitializers(this, _legalName_extraInitializers), __runInitializers(this, _entityType_initializers, void 0));
                this.status = (__runInitializers(this, _entityType_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.createdAt = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
                __runInitializers(this, _createdAt_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Entity ID' })];
            _entityNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Entity number' })];
            _legalName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Legal name' })];
            _entityType_decorators = [(0, swagger_1.ApiProperty)({ enum: EntityType })];
            _status_decorators = [(0, swagger_1.ApiProperty)({ enum: EntityStatus })];
            _createdAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Created timestamp' })];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _entityNumber_decorators, { kind: "field", name: "entityNumber", static: false, private: false, access: { has: obj => "entityNumber" in obj, get: obj => obj.entityNumber, set: (obj, value) => { obj.entityNumber = value; } }, metadata: _metadata }, _entityNumber_initializers, _entityNumber_extraInitializers);
            __esDecorate(null, null, _legalName_decorators, { kind: "field", name: "legalName", static: false, private: false, access: { has: obj => "legalName" in obj, get: obj => obj.legalName, set: (obj, value) => { obj.legalName = value; } }, metadata: _metadata }, _legalName_initializers, _legalName_extraInitializers);
            __esDecorate(null, null, _entityType_decorators, { kind: "field", name: "entityType", static: false, private: false, access: { has: obj => "entityType" in obj, get: obj => obj.entityType, set: (obj, value) => { obj.entityType = value; } }, metadata: _metadata }, _entityType_initializers, _entityType_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.EntityResponseDto = EntityResponseDto;
let ComplianceEventDto = (() => {
    var _a;
    let _entityId_decorators;
    let _entityId_initializers = [];
    let _entityId_extraInitializers = [];
    let _eventType_decorators;
    let _eventType_initializers = [];
    let _eventType_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _dueDate_decorators;
    let _dueDate_initializers = [];
    let _dueDate_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    return _a = class ComplianceEventDto {
            constructor() {
                this.entityId = __runInitializers(this, _entityId_initializers, void 0);
                this.eventType = (__runInitializers(this, _entityId_extraInitializers), __runInitializers(this, _eventType_initializers, void 0));
                this.title = (__runInitializers(this, _eventType_extraInitializers), __runInitializers(this, _title_initializers, void 0));
                this.dueDate = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _dueDate_initializers, void 0));
                this.status = (__runInitializers(this, _dueDate_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                __runInitializers(this, _status_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _entityId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Entity ID' })];
            _eventType_decorators = [(0, swagger_1.ApiProperty)({ enum: ComplianceEventType })];
            _title_decorators = [(0, swagger_1.ApiProperty)({ description: 'Event title' })];
            _dueDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Due date' })];
            _status_decorators = [(0, swagger_1.ApiProperty)({ enum: ComplianceStatus })];
            __esDecorate(null, null, _entityId_decorators, { kind: "field", name: "entityId", static: false, private: false, access: { has: obj => "entityId" in obj, get: obj => obj.entityId, set: (obj, value) => { obj.entityId = value; } }, metadata: _metadata }, _entityId_initializers, _entityId_extraInitializers);
            __esDecorate(null, null, _eventType_decorators, { kind: "field", name: "eventType", static: false, private: false, access: { has: obj => "eventType" in obj, get: obj => obj.eventType, set: (obj, value) => { obj.eventType = value; } }, metadata: _metadata }, _eventType_initializers, _eventType_extraInitializers);
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _dueDate_decorators, { kind: "field", name: "dueDate", static: false, private: false, access: { has: obj => "dueDate" in obj, get: obj => obj.dueDate, set: (obj, value) => { obj.dueDate = value; } }, metadata: _metadata }, _dueDate_initializers, _dueDate_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ComplianceEventDto = ComplianceEventDto;
//# sourceMappingURL=legal-entity-management-kit.js.map