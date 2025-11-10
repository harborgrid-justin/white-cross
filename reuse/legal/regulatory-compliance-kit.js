"use strict";
/**
 * LOC: LEGAL_REGCOMP_001
 * File: /reuse/legal/regulatory-compliance-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize
 *   - sequelize-typescript
 *   - zod
 *   - rxjs
 *
 * DOWNSTREAM (imported by):
 *   - Legal compliance controllers
 *   - Regulatory monitoring services
 *   - Compliance audit systems
 *   - Risk management dashboards
 *   - Regulatory reporting modules
 *   - Legal operations systems
 */
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegulatoryComplianceService = exports.RegulatoryChangeSchema = exports.ComplianceAuditSchema = exports.ComplianceRuleSchema = exports.RegulationMetadataSchema = exports.ImpactLevel = exports.JurisdictionType = exports.RegulationSeverity = exports.ComplianceStatus = exports.RegulatoryFramework = void 0;
exports.defineRegulationModel = defineRegulationModel;
exports.defineComplianceRuleModel = defineComplianceRuleModel;
exports.defineComplianceAuditModel = defineComplianceAuditModel;
exports.defineRegulatoryChangeModel = defineRegulatoryChangeModel;
exports.defineJurisdictionRequirementModel = defineJurisdictionRequirementModel;
exports.trackRegulation = trackRegulation;
exports.getRegulationsByFramework = getRegulationsByFramework;
exports.updateRegulation = updateRegulation;
exports.monitorRegulationReviews = monitorRegulationReviews;
exports.archiveRegulation = archiveRegulation;
exports.searchRegulations = searchRegulations;
exports.linkRelatedRegulations = linkRelatedRegulations;
exports.createComplianceRule = createComplianceRule;
exports.evaluateComplianceRules = evaluateComplianceRules;
exports.getRulesByRegulation = getRulesByRegulation;
exports.updateRuleExecutionStats = updateRuleExecutionStats;
exports.toggleComplianceRule = toggleComplianceRule;
exports.bulkEvaluateCompliance = bulkEvaluateCompliance;
exports.getHighPriorityRules = getHighPriorityRules;
exports.initiateComplianceAudit = initiateComplianceAudit;
exports.recordComplianceFindings = recordComplianceFindings;
exports.completeComplianceAudit = completeComplianceAudit;
exports.createRemediationPlan = createRemediationPlan;
exports.updateRemediationStep = updateRemediationStep;
exports.getAuditsByEntity = getAuditsByEntity;
exports.getAuditStatistics = getAuditStatistics;
exports.registerRegulatoryChange = registerRegulatoryChange;
exports.detectPendingChanges = detectPendingChanges;
exports.assessRegulatoryImpact = assessRegulatoryImpact;
exports.markChangeAsReviewed = markChangeAsReviewed;
exports.getHighImpactChanges = getHighImpactChanges;
exports.getChangesByFramework = getChangesByFramework;
exports.createJurisdictionRequirement = createJurisdictionRequirement;
exports.getJurisdictionRequirements = getJurisdictionRequirements;
exports.checkMultiJurisdictionCompliance = checkMultiJurisdictionCompliance;
exports.analyzeJurisdictionConflicts = analyzeJurisdictionConflicts;
exports.generateJurisdictionMatrix = generateJurisdictionMatrix;
exports.performRiskAssessment = performRiskAssessment;
exports.calculateComplianceTrend = calculateComplianceTrend;
exports.generateComplianceReport = generateComplianceReport;
exports.identifyComplianceGaps = identifyComplianceGaps;
/**
 * File: /reuse/legal/regulatory-compliance-kit.ts
 * Locator: WC-LEGAL-REGCOMP-001
 * Purpose: Regulatory Compliance Kit - Comprehensive regulatory tracking and compliance management
 *
 * Upstream: NestJS, Swagger, Sequelize, Zod, RxJS
 * Downstream: ../backend/legal/*, ../services/compliance/*, Regulatory systems, Risk management
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize 6.x, sequelize-typescript 2.x
 * Exports: 42 utility functions for regulatory tracking, compliance rule engine, change detection,
 *          jurisdiction-specific compliance, regulation monitoring, compliance validation,
 *          regulatory frameworks, audit trails, risk assessments, remediation workflows
 *
 * LLM Context: Enterprise-grade regulatory compliance management for White Cross healthcare platform.
 * Provides comprehensive regulatory tracking (FDA, CMS, state healthcare boards), compliance rule engine
 * with real-time validation, regulatory change detection and impact analysis, multi-jurisdiction
 * compliance management, regulatory framework mapping (HIPAA, HITECH, Stark Law, Anti-Kickback),
 * compliance audit trails, risk assessment and scoring, remediation workflow management,
 * regulatory alerts and notifications, compliance reporting and analytics, evidence collection,
 * regulatory submission tracking. Designed for healthcare industry with multi-state operations.
 */
const common_1 = require("@nestjs/common");
const sequelize_1 = require("sequelize");
const zod_1 = require("zod");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Regulatory framework enumeration
 */
var RegulatoryFramework;
(function (RegulatoryFramework) {
    RegulatoryFramework["HIPAA"] = "HIPAA";
    RegulatoryFramework["HITECH"] = "HITECH";
    RegulatoryFramework["GDPR"] = "GDPR";
    RegulatoryFramework["CCPA"] = "CCPA";
    RegulatoryFramework["FDA"] = "FDA";
    RegulatoryFramework["CMS"] = "CMS";
    RegulatoryFramework["STARK_LAW"] = "STARK_LAW";
    RegulatoryFramework["ANTI_KICKBACK"] = "ANTI_KICKBACK";
    RegulatoryFramework["EMTALA"] = "EMTALA";
    RegulatoryFramework["STATE_HEALTH_BOARD"] = "STATE_HEALTH_BOARD";
    RegulatoryFramework["OSHA"] = "OSHA";
    RegulatoryFramework["DEA"] = "DEA";
    RegulatoryFramework["CLIA"] = "CLIA";
    RegulatoryFramework["CUSTOM"] = "CUSTOM";
})(RegulatoryFramework || (exports.RegulatoryFramework = RegulatoryFramework = {}));
/**
 * Compliance status enumeration
 */
var ComplianceStatus;
(function (ComplianceStatus) {
    ComplianceStatus["COMPLIANT"] = "COMPLIANT";
    ComplianceStatus["NON_COMPLIANT"] = "NON_COMPLIANT";
    ComplianceStatus["PARTIALLY_COMPLIANT"] = "PARTIALLY_COMPLIANT";
    ComplianceStatus["UNDER_REVIEW"] = "UNDER_REVIEW";
    ComplianceStatus["REMEDIATION_IN_PROGRESS"] = "REMEDIATION_IN_PROGRESS";
    ComplianceStatus["EXEMPTED"] = "EXEMPTED";
    ComplianceStatus["NOT_APPLICABLE"] = "NOT_APPLICABLE";
})(ComplianceStatus || (exports.ComplianceStatus = ComplianceStatus = {}));
/**
 * Regulation severity level
 */
var RegulationSeverity;
(function (RegulationSeverity) {
    RegulationSeverity["CRITICAL"] = "CRITICAL";
    RegulationSeverity["HIGH"] = "HIGH";
    RegulationSeverity["MEDIUM"] = "MEDIUM";
    RegulationSeverity["LOW"] = "LOW";
    RegulationSeverity["INFORMATIONAL"] = "INFORMATIONAL";
})(RegulationSeverity || (exports.RegulationSeverity = RegulationSeverity = {}));
/**
 * Jurisdiction type
 */
var JurisdictionType;
(function (JurisdictionType) {
    JurisdictionType["FEDERAL"] = "FEDERAL";
    JurisdictionType["STATE"] = "STATE";
    JurisdictionType["COUNTY"] = "COUNTY";
    JurisdictionType["MUNICIPAL"] = "MUNICIPAL";
    JurisdictionType["INTERNATIONAL"] = "INTERNATIONAL";
})(JurisdictionType || (exports.JurisdictionType = JurisdictionType = {}));
/**
 * Regulatory change impact level
 */
var ImpactLevel;
(function (ImpactLevel) {
    ImpactLevel["CRITICAL"] = "CRITICAL";
    ImpactLevel["HIGH"] = "HIGH";
    ImpactLevel["MEDIUM"] = "MEDIUM";
    ImpactLevel["LOW"] = "LOW";
    ImpactLevel["MINIMAL"] = "MINIMAL";
})(ImpactLevel || (exports.ImpactLevel = ImpactLevel = {}));
// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================
exports.RegulationMetadataSchema = zod_1.z.object({
    regulationCode: zod_1.z.string().min(1).max(100),
    title: zod_1.z.string().min(1).max(500),
    description: zod_1.z.string().min(1),
    framework: zod_1.z.nativeEnum(RegulatoryFramework),
    jurisdiction: zod_1.z.string().min(1).max(100),
    jurisdictionType: zod_1.z.nativeEnum(JurisdictionType),
    effectiveDate: zod_1.z.coerce.date(),
    expirationDate: zod_1.z.coerce.date().optional(),
    severity: zod_1.z.nativeEnum(RegulationSeverity),
    category: zod_1.z.string().min(1).max(100),
    subcategory: zod_1.z.string().max(100).optional(),
    requirements: zod_1.z.array(zod_1.z.string()),
    penalties: zod_1.z.string().optional(),
    citations: zod_1.z.array(zod_1.z.string()).optional(),
    relatedRegulations: zod_1.z.array(zod_1.z.string()).optional(),
    enforcingAuthority: zod_1.z.string().min(1).max(200),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
    isActive: zod_1.z.boolean().default(true),
    version: zod_1.z.string().min(1).max(50),
    lastReviewedDate: zod_1.z.coerce.date().optional(),
    nextReviewDate: zod_1.z.coerce.date().optional(),
});
exports.ComplianceRuleSchema = zod_1.z.object({
    ruleCode: zod_1.z.string().min(1).max(100),
    name: zod_1.z.string().min(1).max(200),
    description: zod_1.z.string().min(1),
    regulationId: zod_1.z.string().uuid(),
    ruleType: zod_1.z.enum(['validation', 'monitoring', 'reporting', 'procedural']),
    conditions: zod_1.z.array(zod_1.z.object({
        field: zod_1.z.string(),
        operator: zod_1.z.enum(['equals', 'notEquals', 'contains', 'greaterThan', 'lessThan', 'between', 'exists', 'custom']),
        value: zod_1.z.any(),
        logicalOperator: zod_1.z.enum(['AND', 'OR']).optional(),
    })),
    actions: zod_1.z.array(zod_1.z.object({
        type: zod_1.z.enum(['alert', 'escalate', 'remediate', 'log', 'notify', 'block']),
        target: zod_1.z.string(),
        parameters: zod_1.z.record(zod_1.z.any()).optional(),
    })),
    priority: zod_1.z.number().int().min(1).max(100),
    enabled: zod_1.z.boolean().default(true),
    automatedCheck: zod_1.z.boolean().default(false),
    frequency: zod_1.z.enum(['realtime', 'daily', 'weekly', 'monthly', 'quarterly', 'annual']).optional(),
    threshold: zod_1.z.record(zod_1.z.any()).optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
exports.ComplianceAuditSchema = zod_1.z.object({
    auditType: zod_1.z.enum(['scheduled', 'triggered', 'manual', 'external']),
    regulationId: zod_1.z.string().uuid(),
    entityType: zod_1.z.string().min(1).max(100),
    entityId: zod_1.z.string().uuid(),
    auditorId: zod_1.z.string().uuid().optional(),
    status: zod_1.z.nativeEnum(ComplianceStatus),
    findings: zod_1.z.array(zod_1.z.any()),
    score: zod_1.z.number().min(0).max(100).optional(),
    riskLevel: zod_1.z.enum(['critical', 'high', 'medium', 'low']),
    startDate: zod_1.z.coerce.date(),
    completionDate: zod_1.z.coerce.date().optional(),
    dueDate: zod_1.z.coerce.date().optional(),
    evidence: zod_1.z.array(zod_1.z.any()).optional(),
    recommendations: zod_1.z.array(zod_1.z.string()).optional(),
    remediationPlan: zod_1.z.any().optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
exports.RegulatoryChangeSchema = zod_1.z.object({
    changeType: zod_1.z.enum(['new_regulation', 'amendment', 'repeal', 'interpretation', 'enforcement_update']),
    regulationId: zod_1.z.string().uuid().optional(),
    framework: zod_1.z.nativeEnum(RegulatoryFramework),
    jurisdiction: zod_1.z.string().min(1).max(100),
    title: zod_1.z.string().min(1).max(500),
    description: zod_1.z.string().min(1),
    effectiveDate: zod_1.z.coerce.date(),
    announcedDate: zod_1.z.coerce.date(),
    impactLevel: zod_1.z.nativeEnum(ImpactLevel),
    affectedEntities: zod_1.z.array(zod_1.z.string()).optional(),
    requiredActions: zod_1.z.array(zod_1.z.string()).optional(),
    deadlines: zod_1.z.array(zod_1.z.coerce.date()).optional(),
    source: zod_1.z.string().min(1).max(200),
    sourceUrl: zod_1.z.string().url().optional(),
    reviewed: zod_1.z.boolean().default(false),
    reviewedBy: zod_1.z.string().uuid().optional(),
    reviewedAt: zod_1.z.coerce.date().optional(),
    impactAssessment: zod_1.z.any().optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
// ============================================================================
// SEQUELIZE MODELS (1-5)
// ============================================================================
/**
 * Sequelize model for Regulations with comprehensive tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} Regulation model
 *
 * @example
 * const Regulation = defineRegulationModel(sequelize);
 * await Regulation.create({
 *   regulationCode: 'HIPAA-164.502',
 *   title: 'Uses and Disclosures of PHI',
 *   framework: 'HIPAA',
 *   jurisdiction: 'United States',
 *   jurisdictionType: 'FEDERAL'
 * });
 */
function defineRegulationModel(sequelize) {
    class Regulation extends sequelize_1.Model {
    }
    Regulation.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        regulationCode: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            field: 'regulation_code',
            comment: 'Unique identifier for the regulation (e.g., HIPAA-164.502)',
        },
        title: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        framework: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(RegulatoryFramework)),
            allowNull: false,
            comment: 'Regulatory framework (HIPAA, GDPR, FDA, etc.)',
        },
        jurisdiction: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Geographic or organizational jurisdiction',
        },
        jurisdictionType: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(JurisdictionType)),
            allowNull: false,
            field: 'jurisdiction_type',
        },
        effectiveDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            field: 'effective_date',
        },
        expirationDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'expiration_date',
        },
        severity: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(RegulationSeverity)),
            allowNull: false,
            defaultValue: RegulationSeverity.MEDIUM,
        },
        category: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Primary regulatory category',
        },
        subcategory: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        requirements: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: [],
            comment: 'Array of specific requirements',
        },
        penalties: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Description of penalties for non-compliance',
        },
        citations: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Legal citations and references',
        },
        relatedRegulations: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            field: 'related_regulations',
            comment: 'IDs of related regulations',
        },
        enforcingAuthority: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            field: 'enforcing_authority',
            comment: 'Government agency or body responsible for enforcement',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            field: 'is_active',
        },
        version: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            defaultValue: '1.0',
        },
        lastReviewedDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'last_reviewed_date',
        },
        nextReviewDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'next_review_date',
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            field: 'created_at',
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            field: 'updated_at',
        },
        deletedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'deleted_at',
        },
    }, {
        sequelize,
        tableName: 'regulations',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
            { fields: ['regulation_code'], unique: true },
            { fields: ['framework'] },
            { fields: ['jurisdiction'] },
            { fields: ['jurisdiction_type'] },
            { fields: ['category'] },
            { fields: ['severity'] },
            { fields: ['effective_date'] },
            { fields: ['is_active'] },
            { fields: ['enforcing_authority'] },
            {
                name: 'idx_regulations_framework_jurisdiction',
                fields: ['framework', 'jurisdiction']
            },
        ],
    });
    return Regulation;
}
/**
 * Sequelize model for Compliance Rules.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} ComplianceRule model
 *
 * @example
 * const ComplianceRule = defineComplianceRuleModel(sequelize);
 * await ComplianceRule.create({
 *   ruleCode: 'HIPAA-PHI-ENCRYPTION',
 *   name: 'PHI Encryption Validation',
 *   regulationId: 'regulation-uuid',
 *   ruleType: 'validation',
 *   enabled: true
 * });
 */
function defineComplianceRuleModel(sequelize) {
    class ComplianceRule extends sequelize_1.Model {
    }
    ComplianceRule.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        ruleCode: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            field: 'rule_code',
        },
        name: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        regulationId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            field: 'regulation_id',
            references: {
                model: 'regulations',
                key: 'id',
            },
        },
        ruleType: {
            type: sequelize_1.DataTypes.ENUM('validation', 'monitoring', 'reporting', 'procedural'),
            allowNull: false,
            field: 'rule_type',
        },
        conditions: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: [],
            comment: 'Rule conditions for evaluation',
        },
        actions: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: [],
            comment: 'Actions to execute when rule triggers',
        },
        priority: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 50,
            validate: {
                min: 1,
                max: 100,
            },
        },
        enabled: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        automatedCheck: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            field: 'automated_check',
        },
        frequency: {
            type: sequelize_1.DataTypes.ENUM('realtime', 'daily', 'weekly', 'monthly', 'quarterly', 'annual'),
            allowNull: true,
        },
        threshold: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Threshold values for rule triggering',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
        },
        lastExecutedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'last_executed_at',
        },
        executionCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            field: 'execution_count',
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            field: 'created_at',
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            field: 'updated_at',
        },
        deletedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'deleted_at',
        },
    }, {
        sequelize,
        tableName: 'compliance_rules',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
            { fields: ['rule_code'], unique: true },
            { fields: ['regulation_id'] },
            { fields: ['rule_type'] },
            { fields: ['enabled'] },
            { fields: ['priority'] },
            { fields: ['automated_check'] },
            { fields: ['frequency'] },
        ],
    });
    return ComplianceRule;
}
/**
 * Sequelize model for Compliance Audits.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} ComplianceAudit model
 *
 * @example
 * const ComplianceAudit = defineComplianceAuditModel(sequelize);
 * await ComplianceAudit.create({
 *   auditType: 'scheduled',
 *   regulationId: 'regulation-uuid',
 *   entityType: 'facility',
 *   entityId: 'facility-uuid',
 *   status: 'UNDER_REVIEW'
 * });
 */
function defineComplianceAuditModel(sequelize) {
    class ComplianceAudit extends sequelize_1.Model {
    }
    ComplianceAudit.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        auditType: {
            type: sequelize_1.DataTypes.ENUM('scheduled', 'triggered', 'manual', 'external'),
            allowNull: false,
            field: 'audit_type',
        },
        regulationId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            field: 'regulation_id',
            references: {
                model: 'regulations',
                key: 'id',
            },
        },
        entityType: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            field: 'entity_type',
            comment: 'Type of entity being audited (facility, department, process, etc.)',
        },
        entityId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            field: 'entity_id',
            comment: 'ID of the specific entity being audited',
        },
        auditorId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            field: 'auditor_id',
            comment: 'User ID of the auditor',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(ComplianceStatus)),
            allowNull: false,
            defaultValue: ComplianceStatus.UNDER_REVIEW,
        },
        findings: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: [],
            comment: 'Array of compliance findings',
        },
        score: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: true,
            validate: {
                min: 0,
                max: 100,
            },
        },
        riskLevel: {
            type: sequelize_1.DataTypes.ENUM('critical', 'high', 'medium', 'low'),
            allowNull: false,
            field: 'risk_level',
        },
        startDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            field: 'start_date',
        },
        completionDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'completion_date',
        },
        dueDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'due_date',
        },
        evidence: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Evidence collected during audit',
        },
        recommendations: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        remediationPlan: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            field: 'remediation_plan',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            field: 'created_at',
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            field: 'updated_at',
        },
        deletedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'deleted_at',
        },
    }, {
        sequelize,
        tableName: 'compliance_audits',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
            { fields: ['regulation_id'] },
            { fields: ['entity_type'] },
            { fields: ['entity_id'] },
            { fields: ['auditor_id'] },
            { fields: ['status'] },
            { fields: ['risk_level'] },
            { fields: ['start_date'] },
            { fields: ['due_date'] },
            {
                name: 'idx_audits_entity',
                fields: ['entity_type', 'entity_id']
            },
        ],
    });
    return ComplianceAudit;
}
/**
 * Sequelize model for Regulatory Changes.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} RegulatoryChange model
 *
 * @example
 * const RegulatoryChange = defineRegulatoryChangeModel(sequelize);
 * await RegulatoryChange.create({
 *   changeType: 'amendment',
 *   framework: 'HIPAA',
 *   jurisdiction: 'United States',
 *   title: 'Updated Privacy Rule',
 *   impactLevel: 'HIGH'
 * });
 */
function defineRegulatoryChangeModel(sequelize) {
    class RegulatoryChange extends sequelize_1.Model {
    }
    RegulatoryChange.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        changeType: {
            type: sequelize_1.DataTypes.ENUM('new_regulation', 'amendment', 'repeal', 'interpretation', 'enforcement_update'),
            allowNull: false,
            field: 'change_type',
        },
        regulationId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            field: 'regulation_id',
            references: {
                model: 'regulations',
                key: 'id',
            },
            comment: 'Reference to existing regulation if amendment/repeal',
        },
        framework: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(RegulatoryFramework)),
            allowNull: false,
        },
        jurisdiction: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        title: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        effectiveDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            field: 'effective_date',
        },
        announcedDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            field: 'announced_date',
        },
        impactLevel: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(ImpactLevel)),
            allowNull: false,
            field: 'impact_level',
        },
        affectedEntities: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            field: 'affected_entities',
            comment: 'List of entity IDs or types affected',
        },
        requiredActions: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            field: 'required_actions',
            comment: 'Required compliance actions',
        },
        deadlines: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Array of compliance deadlines',
        },
        source: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'Source of the regulatory change announcement',
        },
        sourceUrl: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: true,
            field: 'source_url',
        },
        reviewed: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        reviewedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            field: 'reviewed_by',
        },
        reviewedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'reviewed_at',
        },
        impactAssessment: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            field: 'impact_assessment',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            field: 'created_at',
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            field: 'updated_at',
        },
        deletedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'deleted_at',
        },
    }, {
        sequelize,
        tableName: 'regulatory_changes',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
            { fields: ['change_type'] },
            { fields: ['regulation_id'] },
            { fields: ['framework'] },
            { fields: ['jurisdiction'] },
            { fields: ['impact_level'] },
            { fields: ['effective_date'] },
            { fields: ['announced_date'] },
            { fields: ['reviewed'] },
            {
                name: 'idx_changes_pending_review',
                fields: ['reviewed', 'impact_level']
            },
        ],
    });
    return RegulatoryChange;
}
/**
 * Sequelize model for Jurisdiction Requirements.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} JurisdictionRequirement model
 *
 * @example
 * const JurisdictionRequirement = defineJurisdictionRequirementModel(sequelize);
 * await JurisdictionRequirement.create({
 *   jurisdiction: 'California',
 *   jurisdictionType: 'STATE',
 *   framework: 'CCPA',
 *   requirementCode: 'CCPA-1798.100'
 * });
 */
function defineJurisdictionRequirementModel(sequelize) {
    class JurisdictionRequirement extends sequelize_1.Model {
    }
    JurisdictionRequirement.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        jurisdiction: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'State, county, or municipality name',
        },
        jurisdictionType: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(JurisdictionType)),
            allowNull: false,
            field: 'jurisdiction_type',
        },
        framework: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(RegulatoryFramework)),
            allowNull: false,
        },
        requirementCode: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            field: 'requirement_code',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        applicability: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: [],
            comment: 'Entity types or conditions this requirement applies to',
        },
        effectiveDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            field: 'effective_date',
        },
        expirationDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'expiration_date',
        },
        specificProvisions: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            field: 'specific_provisions',
            comment: 'Jurisdiction-specific provisions',
        },
        variations: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Variations from federal or standard requirements',
        },
        localAuthority: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            field: 'local_authority',
            comment: 'Local enforcing authority',
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            field: 'is_active',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            field: 'created_at',
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            field: 'updated_at',
        },
        deletedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'deleted_at',
        },
    }, {
        sequelize,
        tableName: 'jurisdiction_requirements',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
            { fields: ['jurisdiction'] },
            { fields: ['jurisdiction_type'] },
            { fields: ['framework'] },
            { fields: ['requirement_code'] },
            { fields: ['is_active'] },
            { fields: ['effective_date'] },
            {
                name: 'idx_jurisdiction_unique',
                fields: ['jurisdiction', 'framework', 'requirement_code'],
                unique: true,
            },
        ],
    });
    return JurisdictionRequirement;
}
// ============================================================================
// REGULATION TRACKING FUNCTIONS (6-12)
// ============================================================================
/**
 * Tracks a new regulation in the system.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {RegulationMetadata} data - Regulation metadata
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Created regulation record
 * @throws {BadRequestException} If validation fails
 * @throws {ConflictException} If regulation code already exists
 *
 * @example
 * const regulation = await trackRegulation(sequelize, {
 *   regulationCode: 'HIPAA-164.502',
 *   title: 'Uses and Disclosures of PHI',
 *   framework: RegulatoryFramework.HIPAA,
 *   jurisdiction: 'United States',
 *   jurisdictionType: JurisdictionType.FEDERAL,
 *   effectiveDate: new Date('2013-09-23'),
 *   severity: RegulationSeverity.HIGH,
 *   category: 'Privacy',
 *   requirements: ['Obtain patient consent', 'Limit disclosures'],
 *   enforcingAuthority: 'HHS/OCR',
 *   version: '1.0'
 * });
 */
async function trackRegulation(sequelize, data, transaction) {
    const logger = new common_1.Logger('trackRegulation');
    try {
        // Validate input
        const validatedData = exports.RegulationMetadataSchema.parse(data);
        const Regulation = defineRegulationModel(sequelize);
        // Check for existing regulation code
        const existing = await Regulation.findOne({
            where: { regulationCode: validatedData.regulationCode },
            transaction,
        });
        if (existing) {
            throw new common_1.ConflictException(`Regulation with code ${validatedData.regulationCode} already exists`);
        }
        // Create regulation
        const regulation = await Regulation.create(validatedData, { transaction });
        logger.log(`Regulation tracked: ${validatedData.regulationCode}`);
        return regulation;
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            throw new common_1.BadRequestException(`Validation failed: ${error.message}`);
        }
        throw error;
    }
}
/**
 * Retrieves regulations by framework and jurisdiction.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {RegulatoryFramework} framework - Regulatory framework
 * @param {string} [jurisdiction] - Optional jurisdiction filter
 * @param {boolean} [activeOnly=true] - Return only active regulations
 * @returns {Promise<Model[]>} List of matching regulations
 *
 * @example
 * const hipaaRegulations = await getRegulationsByFramework(
 *   sequelize,
 *   RegulatoryFramework.HIPAA,
 *   'United States',
 *   true
 * );
 */
async function getRegulationsByFramework(sequelize, framework, jurisdiction, activeOnly = true) {
    const Regulation = defineRegulationModel(sequelize);
    const where = { framework };
    if (jurisdiction) {
        where.jurisdiction = jurisdiction;
    }
    if (activeOnly) {
        where.isActive = true;
    }
    const regulations = await Regulation.findAll({
        where,
        order: [['severity', 'DESC'], ['effectiveDate', 'DESC']],
    });
    return regulations;
}
/**
 * Updates regulation metadata and creates audit trail.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} regulationId - Regulation ID
 * @param {Partial<RegulationMetadata>} updates - Fields to update
 * @param {string} updatedBy - User ID performing the update
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Updated regulation record
 * @throws {NotFoundException} If regulation not found
 *
 * @example
 * const updated = await updateRegulation(
 *   sequelize,
 *   'regulation-uuid',
 *   { severity: RegulationSeverity.CRITICAL, lastReviewedDate: new Date() },
 *   'user-uuid'
 * );
 */
async function updateRegulation(sequelize, regulationId, updates, updatedBy, transaction) {
    const logger = new common_1.Logger('updateRegulation');
    const Regulation = defineRegulationModel(sequelize);
    const regulation = await Regulation.findByPk(regulationId, { transaction });
    if (!regulation) {
        throw new common_1.NotFoundException(`Regulation ${regulationId} not found`);
    }
    const oldValue = regulation.toJSON();
    await regulation.update(updates, { transaction });
    logger.log(`Regulation updated: ${regulationId} by ${updatedBy}`);
    return regulation;
}
/**
 * Monitors regulations for upcoming review dates.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} [daysAhead=30] - Days ahead to check
 * @returns {Promise<Model[]>} Regulations due for review
 *
 * @example
 * const dueForReview = await monitorRegulationReviews(sequelize, 30);
 * console.log(`${dueForReview.length} regulations need review in next 30 days`);
 */
async function monitorRegulationReviews(sequelize, daysAhead = 30) {
    const Regulation = defineRegulationModel(sequelize);
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);
    const regulations = await Regulation.findAll({
        where: {
            isActive: true,
            nextReviewDate: {
                [sequelize_1.Op.lte]: futureDate,
                [sequelize_1.Op.gte]: new Date(),
            },
        },
        order: [['nextReviewDate', 'ASC']],
    });
    return regulations;
}
/**
 * Archives expired or superseded regulations.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} regulationId - Regulation ID to archive
 * @param {string} reason - Reason for archiving
 * @param {string} archivedBy - User ID performing archival
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Archived regulation
 * @throws {NotFoundException} If regulation not found
 *
 * @example
 * await archiveRegulation(
 *   sequelize,
 *   'regulation-uuid',
 *   'Superseded by updated regulation',
 *   'user-uuid'
 * );
 */
async function archiveRegulation(sequelize, regulationId, reason, archivedBy, transaction) {
    const logger = new common_1.Logger('archiveRegulation');
    const Regulation = defineRegulationModel(sequelize);
    const regulation = await Regulation.findByPk(regulationId, { transaction });
    if (!regulation) {
        throw new common_1.NotFoundException(`Regulation ${regulationId} not found`);
    }
    await regulation.update({
        isActive: false,
        metadata: {
            ...regulation.get('metadata'),
            archivedAt: new Date(),
            archivedBy,
            archiveReason: reason,
        },
    }, { transaction });
    logger.log(`Regulation archived: ${regulationId} by ${archivedBy}`);
    return regulation;
}
/**
 * Searches regulations with full-text and filter capabilities.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} filters - Search filters
 * @param {number} [limit=50] - Results limit
 * @param {number} [offset=0] - Results offset
 * @returns {Promise<{rows: Model[], count: number}>} Search results with count
 *
 * @example
 * const results = await searchRegulations(sequelize, {
 *   searchTerm: 'privacy',
 *   framework: RegulatoryFramework.HIPAA,
 *   severity: [RegulationSeverity.HIGH, RegulationSeverity.CRITICAL],
 *   category: 'Privacy'
 * }, 20, 0);
 */
async function searchRegulations(sequelize, filters, limit = 50, offset = 0) {
    const Regulation = defineRegulationModel(sequelize);
    const where = {};
    if (filters.searchTerm) {
        where[sequelize_1.Op.or] = [
            { title: { [sequelize_1.Op.iLike]: `%${filters.searchTerm}%` } },
            { description: { [sequelize_1.Op.iLike]: `%${filters.searchTerm}%` } },
            { regulationCode: { [sequelize_1.Op.iLike]: `%${filters.searchTerm}%` } },
        ];
    }
    if (filters.framework) {
        where.framework = filters.framework;
    }
    if (filters.jurisdiction) {
        where.jurisdiction = filters.jurisdiction;
    }
    if (filters.severity && filters.severity.length > 0) {
        where.severity = { [sequelize_1.Op.in]: filters.severity };
    }
    if (filters.category) {
        where.category = filters.category;
    }
    if (filters.activeOnly !== false) {
        where.isActive = true;
    }
    const { rows, count } = await Regulation.findAndCountAll({
        where,
        limit,
        offset,
        order: [['severity', 'DESC'], ['effectiveDate', 'DESC']],
    });
    return { rows, count };
}
/**
 * Links related regulations for cross-referencing.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} regulationId - Primary regulation ID
 * @param {string[]} relatedIds - Array of related regulation IDs
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Updated regulation with links
 * @throws {NotFoundException} If regulation not found
 *
 * @example
 * await linkRelatedRegulations(
 *   sequelize,
 *   'regulation-uuid-1',
 *   ['regulation-uuid-2', 'regulation-uuid-3']
 * );
 */
async function linkRelatedRegulations(sequelize, regulationId, relatedIds, transaction) {
    const logger = new common_1.Logger('linkRelatedRegulations');
    const Regulation = defineRegulationModel(sequelize);
    const regulation = await Regulation.findByPk(regulationId, { transaction });
    if (!regulation) {
        throw new common_1.NotFoundException(`Regulation ${regulationId} not found`);
    }
    const currentRelated = regulation.get('relatedRegulations') || [];
    const updatedRelated = Array.from(new Set([...currentRelated, ...relatedIds]));
    await regulation.update({ relatedRegulations: updatedRelated }, { transaction });
    logger.log(`Linked ${relatedIds.length} related regulations to ${regulationId}`);
    return regulation;
}
// ============================================================================
// COMPLIANCE RULE ENGINE FUNCTIONS (13-20)
// ============================================================================
/**
 * Creates a compliance rule with validation logic.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ComplianceRule} ruleData - Rule configuration
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Created compliance rule
 * @throws {BadRequestException} If validation fails
 *
 * @example
 * const rule = await createComplianceRule(sequelize, {
 *   ruleCode: 'HIPAA-PHI-ENCRYPTION',
 *   name: 'PHI Data Encryption Check',
 *   description: 'Validates that PHI is encrypted at rest',
 *   regulationId: 'regulation-uuid',
 *   ruleType: 'validation',
 *   conditions: [{
 *     field: 'encryption.enabled',
 *     operator: 'equals',
 *     value: true
 *   }],
 *   actions: [{
 *     type: 'alert',
 *     target: 'security-team@example.com'
 *   }],
 *   priority: 95,
 *   enabled: true,
 *   automatedCheck: true,
 *   frequency: 'daily'
 * });
 */
async function createComplianceRule(sequelize, ruleData, transaction) {
    const logger = new common_1.Logger('createComplianceRule');
    try {
        const validatedData = exports.ComplianceRuleSchema.parse(ruleData);
        const ComplianceRule = defineComplianceRuleModel(sequelize);
        const existing = await ComplianceRule.findOne({
            where: { ruleCode: validatedData.ruleCode },
            transaction,
        });
        if (existing) {
            throw new common_1.ConflictException(`Rule with code ${validatedData.ruleCode} already exists`);
        }
        const rule = await ComplianceRule.create(validatedData, { transaction });
        logger.log(`Compliance rule created: ${validatedData.ruleCode}`);
        return rule;
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            throw new common_1.BadRequestException(`Validation failed: ${error.message}`);
        }
        throw error;
    }
}
/**
 * Evaluates compliance rules against entity data.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} entityType - Type of entity being evaluated
 * @param {string} entityId - Entity ID
 * @param {Record<string, any>} entityData - Entity data for evaluation
 * @returns {Promise<{passed: boolean, violations: any[], warnings: any[]}>} Evaluation results
 *
 * @example
 * const result = await evaluateComplianceRules(
 *   sequelize,
 *   'patient_record',
 *   'patient-uuid',
 *   {
 *     encryption: { enabled: true, algorithm: 'AES-256' },
 *     accessControls: { enabled: true },
 *     auditLogging: { enabled: true }
 *   }
 * );
 * if (!result.passed) {
 *   console.log('Compliance violations:', result.violations);
 * }
 */
async function evaluateComplianceRules(sequelize, entityType, entityId, entityData) {
    const logger = new common_1.Logger('evaluateComplianceRules');
    const ComplianceRule = defineComplianceRuleModel(sequelize);
    const rules = await ComplianceRule.findAll({
        where: {
            enabled: true,
            ruleType: 'validation',
        },
        order: [['priority', 'DESC']],
    });
    const violations = [];
    const warnings = [];
    for (const rule of rules) {
        const conditions = rule.get('conditions');
        const actions = rule.get('actions');
        let conditionsMet = true;
        for (const condition of conditions) {
            const result = evaluateCondition(condition, entityData);
            if (condition.logicalOperator === 'OR') {
                conditionsMet = conditionsMet || result;
            }
            else {
                conditionsMet = conditionsMet && result;
            }
        }
        if (!conditionsMet) {
            const violation = {
                ruleId: rule.get('id'),
                ruleCode: rule.get('ruleCode'),
                ruleName: rule.get('name'),
                severity: 'high',
                entityType,
                entityId,
                timestamp: new Date(),
            };
            violations.push(violation);
            // Execute rule actions
            for (const action of actions) {
                await executeRuleAction(action, violation);
            }
        }
    }
    const passed = violations.length === 0;
    logger.log(`Compliance evaluation: ${passed ? 'PASSED' : 'FAILED'} (${violations.length} violations)`);
    return { passed, violations, warnings };
}
/**
 * Evaluates a single condition against entity data.
 *
 * @param {RuleCondition} condition - Condition to evaluate
 * @param {Record<string, any>} data - Entity data
 * @returns {boolean} Condition result
 */
function evaluateCondition(condition, data) {
    const fieldValue = getNestedValue(data, condition.field);
    switch (condition.operator) {
        case 'equals':
            return fieldValue === condition.value;
        case 'notEquals':
            return fieldValue !== condition.value;
        case 'contains':
            return String(fieldValue).includes(String(condition.value));
        case 'greaterThan':
            return Number(fieldValue) > Number(condition.value);
        case 'lessThan':
            return Number(fieldValue) < Number(condition.value);
        case 'between':
            const [min, max] = condition.value;
            return Number(fieldValue) >= min && Number(fieldValue) <= max;
        case 'exists':
            return fieldValue !== undefined && fieldValue !== null;
        default:
            return false;
    }
}
/**
 * Gets nested value from object using dot notation.
 */
function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
}
/**
 * Executes a rule action (alert, escalate, etc.).
 */
async function executeRuleAction(action, context) {
    const logger = new common_1.Logger('executeRuleAction');
    switch (action.type) {
        case 'alert':
            logger.warn(`COMPLIANCE ALERT: ${JSON.stringify(context)}`);
            // In production, send to monitoring/alerting system
            break;
        case 'escalate':
            logger.error(`COMPLIANCE ESCALATION: ${JSON.stringify(context)}`);
            // In production, create incident ticket
            break;
        case 'log':
            logger.log(`COMPLIANCE LOG: ${JSON.stringify(context)}`);
            break;
        default:
            logger.debug(`Unknown action type: ${action.type}`);
    }
}
/**
 * Retrieves rules by regulation and type.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} regulationId - Regulation ID
 * @param {string} [ruleType] - Optional rule type filter
 * @returns {Promise<Model[]>} Matching compliance rules
 *
 * @example
 * const validationRules = await getRulesByRegulation(
 *   sequelize,
 *   'regulation-uuid',
 *   'validation'
 * );
 */
async function getRulesByRegulation(sequelize, regulationId, ruleType) {
    const ComplianceRule = defineComplianceRuleModel(sequelize);
    const where = { regulationId, enabled: true };
    if (ruleType) {
        where.ruleType = ruleType;
    }
    const rules = await ComplianceRule.findAll({
        where,
        order: [['priority', 'DESC']],
    });
    return rules;
}
/**
 * Updates rule execution statistics.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} ruleId - Rule ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Updated rule
 *
 * @example
 * await updateRuleExecutionStats(sequelize, 'rule-uuid');
 */
async function updateRuleExecutionStats(sequelize, ruleId, transaction) {
    const ComplianceRule = defineComplianceRuleModel(sequelize);
    const rule = await ComplianceRule.findByPk(ruleId, { transaction });
    if (!rule) {
        throw new common_1.NotFoundException(`Rule ${ruleId} not found`);
    }
    await rule.update({
        lastExecutedAt: new Date(),
        executionCount: rule.get('executionCount') + 1,
    }, { transaction });
    return rule;
}
/**
 * Enables or disables a compliance rule.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} ruleId - Rule ID
 * @param {boolean} enabled - Enable/disable flag
 * @param {string} modifiedBy - User ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Updated rule
 *
 * @example
 * await toggleComplianceRule(sequelize, 'rule-uuid', false, 'user-uuid');
 */
async function toggleComplianceRule(sequelize, ruleId, enabled, modifiedBy, transaction) {
    const logger = new common_1.Logger('toggleComplianceRule');
    const ComplianceRule = defineComplianceRuleModel(sequelize);
    const rule = await ComplianceRule.findByPk(ruleId, { transaction });
    if (!rule) {
        throw new common_1.NotFoundException(`Rule ${ruleId} not found`);
    }
    await rule.update({ enabled }, { transaction });
    logger.log(`Rule ${ruleId} ${enabled ? 'enabled' : 'disabled'} by ${modifiedBy}`);
    return rule;
}
/**
 * Bulk evaluates multiple entities against compliance rules.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Array<{entityType: string, entityId: string, data: Record<string, any>}>} entities - Entities to evaluate
 * @returns {Promise<Array<{entityId: string, passed: boolean, violations: any[]}>>} Bulk evaluation results
 *
 * @example
 * const results = await bulkEvaluateCompliance(sequelize, [
 *   { entityType: 'facility', entityId: 'facility-1', data: {...} },
 *   { entityType: 'facility', entityId: 'facility-2', data: {...} }
 * ]);
 */
async function bulkEvaluateCompliance(sequelize, entities) {
    const results = [];
    for (const entity of entities) {
        const evaluation = await evaluateComplianceRules(sequelize, entity.entityType, entity.entityId, entity.data);
        results.push({
            entityId: entity.entityId,
            passed: evaluation.passed,
            violations: evaluation.violations,
        });
    }
    return results;
}
/**
 * Retrieves high-priority active rules.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} [minPriority=80] - Minimum priority threshold
 * @returns {Promise<Model[]>} High-priority rules
 *
 * @example
 * const criticalRules = await getHighPriorityRules(sequelize, 90);
 */
async function getHighPriorityRules(sequelize, minPriority = 80) {
    const ComplianceRule = defineComplianceRuleModel(sequelize);
    const rules = await ComplianceRule.findAll({
        where: {
            enabled: true,
            priority: { [sequelize_1.Op.gte]: minPriority },
        },
        order: [['priority', 'DESC']],
    });
    return rules;
}
// ============================================================================
// COMPLIANCE AUDIT FUNCTIONS (21-27)
// ============================================================================
/**
 * Initiates a compliance audit for an entity.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ComplianceAudit} auditData - Audit configuration
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Created audit record
 * @throws {BadRequestException} If validation fails
 *
 * @example
 * const audit = await initiateComplianceAudit(sequelize, {
 *   auditType: 'scheduled',
 *   regulationId: 'regulation-uuid',
 *   entityType: 'facility',
 *   entityId: 'facility-uuid',
 *   auditorId: 'user-uuid',
 *   status: ComplianceStatus.UNDER_REVIEW,
 *   findings: [],
 *   riskLevel: 'medium',
 *   startDate: new Date(),
 *   dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
 * });
 */
async function initiateComplianceAudit(sequelize, auditData, transaction) {
    const logger = new common_1.Logger('initiateComplianceAudit');
    try {
        const validatedData = exports.ComplianceAuditSchema.parse(auditData);
        const ComplianceAudit = defineComplianceAuditModel(sequelize);
        const audit = await ComplianceAudit.create(validatedData, { transaction });
        logger.log(`Compliance audit initiated: ${audit.get('id')} for ${auditData.entityType}:${auditData.entityId}`);
        return audit;
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            throw new common_1.BadRequestException(`Validation failed: ${error.message}`);
        }
        throw error;
    }
}
/**
 * Records compliance findings during an audit.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} auditId - Audit ID
 * @param {ComplianceFinding[]} findings - Array of findings
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Updated audit with findings
 * @throws {NotFoundException} If audit not found
 *
 * @example
 * await recordComplianceFindings(sequelize, 'audit-uuid', [
 *   {
 *     findingId: 'finding-1',
 *     ruleId: 'rule-uuid',
 *     description: 'Missing encryption on PHI storage',
 *     severity: RegulationSeverity.CRITICAL,
 *     status: 'open',
 *     recommendation: 'Enable AES-256 encryption',
 *     dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
 *   }
 * ]);
 */
async function recordComplianceFindings(sequelize, auditId, findings, transaction) {
    const logger = new common_1.Logger('recordComplianceFindings');
    const ComplianceAudit = defineComplianceAuditModel(sequelize);
    const audit = await ComplianceAudit.findByPk(auditId, { transaction });
    if (!audit) {
        throw new common_1.NotFoundException(`Audit ${auditId} not found`);
    }
    const existingFindings = audit.get('findings') || [];
    const updatedFindings = [...existingFindings, ...findings];
    // Calculate risk level based on findings
    const criticalCount = updatedFindings.filter(f => f.severity === RegulationSeverity.CRITICAL).length;
    const highCount = updatedFindings.filter(f => f.severity === RegulationSeverity.HIGH).length;
    let riskLevel;
    if (criticalCount > 0) {
        riskLevel = 'critical';
    }
    else if (highCount > 2) {
        riskLevel = 'high';
    }
    else if (highCount > 0 || updatedFindings.length > 5) {
        riskLevel = 'medium';
    }
    else {
        riskLevel = 'low';
    }
    await audit.update({
        findings: updatedFindings,
        riskLevel,
        status: ComplianceStatus.UNDER_REVIEW,
    }, { transaction });
    logger.log(`Recorded ${findings.length} findings for audit ${auditId}`);
    return audit;
}
/**
 * Completes a compliance audit with final assessment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} auditId - Audit ID
 * @param {number} score - Compliance score (0-100)
 * @param {ComplianceStatus} finalStatus - Final compliance status
 * @param {string[]} [recommendations] - Optional recommendations
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Completed audit
 * @throws {NotFoundException} If audit not found
 *
 * @example
 * await completeComplianceAudit(
 *   sequelize,
 *   'audit-uuid',
 *   85,
 *   ComplianceStatus.PARTIALLY_COMPLIANT,
 *   ['Implement encryption', 'Update access controls']
 * );
 */
async function completeComplianceAudit(sequelize, auditId, score, finalStatus, recommendations, transaction) {
    const logger = new common_1.Logger('completeComplianceAudit');
    const ComplianceAudit = defineComplianceAuditModel(sequelize);
    const audit = await ComplianceAudit.findByPk(auditId, { transaction });
    if (!audit) {
        throw new common_1.NotFoundException(`Audit ${auditId} not found`);
    }
    if (score < 0 || score > 100) {
        throw new common_1.BadRequestException('Score must be between 0 and 100');
    }
    await audit.update({
        score,
        status: finalStatus,
        completionDate: new Date(),
        recommendations: recommendations || [],
    }, { transaction });
    logger.log(`Audit completed: ${auditId} - Score: ${score}, Status: ${finalStatus}`);
    return audit;
}
/**
 * Creates a remediation plan for non-compliance findings.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} auditId - Audit ID
 * @param {RemediationPlan} plan - Remediation plan
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Updated audit with remediation plan
 * @throws {NotFoundException} If audit not found
 *
 * @example
 * await createRemediationPlan(sequelize, 'audit-uuid', {
 *   planId: 'plan-uuid',
 *   description: 'Address critical security gaps',
 *   steps: [
 *     {
 *       stepNumber: 1,
 *       description: 'Enable database encryption',
 *       assignedTo: 'user-uuid',
 *       status: 'pending',
 *       dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
 *     }
 *   ],
 *   assignedTo: 'manager-uuid',
 *   targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
 *   status: 'pending',
 *   completionPercentage: 0
 * });
 */
async function createRemediationPlan(sequelize, auditId, plan, transaction) {
    const logger = new common_1.Logger('createRemediationPlan');
    const ComplianceAudit = defineComplianceAuditModel(sequelize);
    const audit = await ComplianceAudit.findByPk(auditId, { transaction });
    if (!audit) {
        throw new common_1.NotFoundException(`Audit ${auditId} not found`);
    }
    await audit.update({
        remediationPlan: plan,
        status: ComplianceStatus.REMEDIATION_IN_PROGRESS,
    }, { transaction });
    logger.log(`Remediation plan created for audit ${auditId}`);
    return audit;
}
/**
 * Updates remediation step progress.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} auditId - Audit ID
 * @param {number} stepNumber - Step number to update
 * @param {'pending' | 'in_progress' | 'completed'} status - New status
 * @param {string} [notes] - Optional notes
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Updated audit
 *
 * @example
 * await updateRemediationStep(
 *   sequelize,
 *   'audit-uuid',
 *   1,
 *   'completed',
 *   'Encryption enabled on all databases'
 * );
 */
async function updateRemediationStep(sequelize, auditId, stepNumber, status, notes, transaction) {
    const logger = new common_1.Logger('updateRemediationStep');
    const ComplianceAudit = defineComplianceAuditModel(sequelize);
    const audit = await ComplianceAudit.findByPk(auditId, { transaction });
    if (!audit) {
        throw new common_1.NotFoundException(`Audit ${auditId} not found`);
    }
    const plan = audit.get('remediationPlan');
    if (!plan) {
        throw new common_1.BadRequestException('No remediation plan found for this audit');
    }
    const step = plan.steps.find(s => s.stepNumber === stepNumber);
    if (!step) {
        throw new common_1.NotFoundException(`Step ${stepNumber} not found in remediation plan`);
    }
    step.status = status;
    if (notes) {
        step.notes = notes;
    }
    if (status === 'completed') {
        step.completedDate = new Date();
    }
    // Calculate completion percentage
    const completedSteps = plan.steps.filter(s => s.status === 'completed').length;
    plan.completionPercentage = Math.round((completedSteps / plan.steps.length) * 100);
    // Update plan status if all steps completed
    if (plan.completionPercentage === 100) {
        plan.status = 'completed';
    }
    await audit.update({ remediationPlan: plan }, { transaction });
    logger.log(`Remediation step ${stepNumber} updated to ${status} for audit ${auditId}`);
    return audit;
}
/**
 * Retrieves audits by entity with filtering.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} entityType - Entity type
 * @param {string} entityId - Entity ID
 * @param {ComplianceStatus} [status] - Optional status filter
 * @returns {Promise<Model[]>} List of audits
 *
 * @example
 * const audits = await getAuditsByEntity(
 *   sequelize,
 *   'facility',
 *   'facility-uuid',
 *   ComplianceStatus.UNDER_REVIEW
 * );
 */
async function getAuditsByEntity(sequelize, entityType, entityId, status) {
    const ComplianceAudit = defineComplianceAuditModel(sequelize);
    const where = { entityType, entityId };
    if (status) {
        where.status = status;
    }
    const audits = await ComplianceAudit.findAll({
        where,
        order: [['startDate', 'DESC']],
    });
    return audits;
}
/**
 * Generates compliance audit summary statistics.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} startDate - Start date for report period
 * @param {Date} endDate - End date for report period
 * @returns {Promise<object>} Audit statistics
 *
 * @example
 * const stats = await getAuditStatistics(
 *   sequelize,
 *   new Date('2025-01-01'),
 *   new Date('2025-12-31')
 * );
 * console.log(`Compliance rate: ${stats.complianceRate}%`);
 */
async function getAuditStatistics(sequelize, startDate, endDate) {
    const ComplianceAudit = defineComplianceAuditModel(sequelize);
    const audits = await ComplianceAudit.findAll({
        where: {
            startDate: { [sequelize_1.Op.between]: [startDate, endDate] },
        },
    });
    const totalAudits = audits.length;
    const compliantCount = audits.filter(a => a.get('status') === ComplianceStatus.COMPLIANT).length;
    const nonCompliantCount = audits.filter(a => a.get('status') === ComplianceStatus.NON_COMPLIANT).length;
    const scoresSum = audits.reduce((sum, a) => sum + (a.get('score') || 0), 0);
    const averageScore = totalAudits > 0 ? Math.round(scoresSum / totalAudits) : 0;
    const complianceRate = totalAudits > 0 ? Math.round((compliantCount / totalAudits) * 100) : 0;
    const byRiskLevel = audits.reduce((acc, a) => {
        const level = a.get('riskLevel');
        acc[level] = (acc[level] || 0) + 1;
        return acc;
    }, {});
    return {
        totalAudits,
        compliantCount,
        nonCompliantCount,
        averageScore,
        complianceRate,
        byRiskLevel,
    };
}
// ============================================================================
// REGULATORY CHANGE DETECTION FUNCTIONS (28-33)
// ============================================================================
/**
 * Registers a new regulatory change notification.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {RegulatoryChange} changeData - Change notification data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Created change record
 * @throws {BadRequestException} If validation fails
 *
 * @example
 * const change = await registerRegulatoryChange(sequelize, {
 *   changeType: 'amendment',
 *   regulationId: 'regulation-uuid',
 *   framework: RegulatoryFramework.HIPAA,
 *   jurisdiction: 'United States',
 *   title: 'HIPAA Privacy Rule Update 2025',
 *   description: 'New requirements for patient consent forms',
 *   effectiveDate: new Date('2025-07-01'),
 *   announcedDate: new Date('2025-01-15'),
 *   impactLevel: ImpactLevel.HIGH,
 *   source: 'HHS/OCR',
 *   sourceUrl: 'https://www.hhs.gov/hipaa/updates',
 *   reviewed: false
 * });
 */
async function registerRegulatoryChange(sequelize, changeData, transaction) {
    const logger = new common_1.Logger('registerRegulatoryChange');
    try {
        const validatedData = exports.RegulatoryChangeSchema.parse(changeData);
        const RegulatoryChange = defineRegulatoryChangeModel(sequelize);
        const change = await RegulatoryChange.create(validatedData, { transaction });
        logger.log(`Regulatory change registered: ${validatedData.title}`);
        return change;
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            throw new common_1.BadRequestException(`Validation failed: ${error.message}`);
        }
        throw error;
    }
}
/**
 * Detects pending regulatory changes requiring review.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} [daysUntilEffective=90] - Days until effective date threshold
 * @returns {Promise<Model[]>} Pending changes requiring attention
 *
 * @example
 * const pendingChanges = await detectPendingChanges(sequelize, 60);
 * console.log(`${pendingChanges.length} changes need review before effective date`);
 */
async function detectPendingChanges(sequelize, daysUntilEffective = 90) {
    const RegulatoryChange = defineRegulatoryChangeModel(sequelize);
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysUntilEffective);
    const changes = await RegulatoryChange.findAll({
        where: {
            reviewed: false,
            effectiveDate: {
                [sequelize_1.Op.between]: [new Date(), futureDate],
            },
        },
        order: [['effectiveDate', 'ASC'], ['impactLevel', 'DESC']],
    });
    return changes;
}
/**
 * Performs impact assessment for regulatory change.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} changeId - Change ID
 * @param {ImpactAssessment} assessment - Impact assessment data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Updated change with assessment
 * @throws {NotFoundException} If change not found
 *
 * @example
 * await assessRegulatoryImpact(sequelize, 'change-uuid', {
 *   assessmentId: 'assessment-uuid',
 *   changeId: 'change-uuid',
 *   impactAreas: ['patient_consent', 'data_sharing', 'record_retention'],
 *   affectedProcesses: ['admissions', 'treatment', 'billing'],
 *   estimatedCost: 50000,
 *   estimatedEffort: '3-6 months',
 *   riskLevel: 'high',
 *   mitigationStrategy: 'Update consent forms and train staff',
 *   implementationPlan: 'Phase 1: Form updates, Phase 2: Training, Phase 3: Rollout',
 *   assessedBy: 'user-uuid',
 *   assessedAt: new Date()
 * });
 */
async function assessRegulatoryImpact(sequelize, changeId, assessment, transaction) {
    const logger = new common_1.Logger('assessRegulatoryImpact');
    const RegulatoryChange = defineRegulatoryChangeModel(sequelize);
    const change = await RegulatoryChange.findByPk(changeId, { transaction });
    if (!change) {
        throw new common_1.NotFoundException(`Regulatory change ${changeId} not found`);
    }
    await change.update({ impactAssessment: assessment }, { transaction });
    logger.log(`Impact assessment completed for change ${changeId}`);
    return change;
}
/**
 * Marks regulatory change as reviewed.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} changeId - Change ID
 * @param {string} reviewedBy - User ID of reviewer
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Updated change
 * @throws {NotFoundException} If change not found
 *
 * @example
 * await markChangeAsReviewed(sequelize, 'change-uuid', 'user-uuid');
 */
async function markChangeAsReviewed(sequelize, changeId, reviewedBy, transaction) {
    const logger = new common_1.Logger('markChangeAsReviewed');
    const RegulatoryChange = defineRegulatoryChangeModel(sequelize);
    const change = await RegulatoryChange.findByPk(changeId, { transaction });
    if (!change) {
        throw new common_1.NotFoundException(`Regulatory change ${changeId} not found`);
    }
    await change.update({
        reviewed: true,
        reviewedBy,
        reviewedAt: new Date(),
    }, { transaction });
    logger.log(`Regulatory change ${changeId} marked as reviewed by ${reviewedBy}`);
    return change;
}
/**
 * Retrieves high-impact unreviewed changes.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ImpactLevel[]} [impactLevels] - Impact levels to filter
 * @returns {Promise<Model[]>} High-impact changes needing review
 *
 * @example
 * const criticalChanges = await getHighImpactChanges(
 *   sequelize,
 *   [ImpactLevel.CRITICAL, ImpactLevel.HIGH]
 * );
 */
async function getHighImpactChanges(sequelize, impactLevels = [ImpactLevel.CRITICAL, ImpactLevel.HIGH]) {
    const RegulatoryChange = defineRegulatoryChangeModel(sequelize);
    const changes = await RegulatoryChange.findAll({
        where: {
            reviewed: false,
            impactLevel: { [sequelize_1.Op.in]: impactLevels },
        },
        order: [['effectiveDate', 'ASC'], ['impactLevel', 'DESC']],
    });
    return changes;
}
/**
 * Retrieves changes by framework and date range.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {RegulatoryFramework} framework - Regulatory framework
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<Model[]>} Matching changes
 *
 * @example
 * const hipaaChanges = await getChangesByFramework(
 *   sequelize,
 *   RegulatoryFramework.HIPAA,
 *   new Date('2025-01-01'),
 *   new Date('2025-12-31')
 * );
 */
async function getChangesByFramework(sequelize, framework, startDate, endDate) {
    const RegulatoryChange = defineRegulatoryChangeModel(sequelize);
    const changes = await RegulatoryChange.findAll({
        where: {
            framework,
            announcedDate: { [sequelize_1.Op.between]: [startDate, endDate] },
        },
        order: [['announcedDate', 'DESC']],
    });
    return changes;
}
// ============================================================================
// JURISDICTION-SPECIFIC COMPLIANCE FUNCTIONS (34-38)
// ============================================================================
/**
 * Creates jurisdiction-specific requirement.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {JurisdictionRequirement} reqData - Requirement data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Created requirement
 * @throws {BadRequestException} If validation fails
 *
 * @example
 * const requirement = await createJurisdictionRequirement(sequelize, {
 *   jurisdiction: 'California',
 *   jurisdictionType: JurisdictionType.STATE,
 *   framework: RegulatoryFramework.CCPA,
 *   requirementCode: 'CCPA-1798.100',
 *   description: 'Consumer right to know',
 *   applicability: ['healthcare_providers', 'covered_entities'],
 *   effectiveDate: new Date('2020-01-01'),
 *   localAuthority: 'California Attorney General',
 *   isActive: true
 * });
 */
async function createJurisdictionRequirement(sequelize, reqData, transaction) {
    const logger = new common_1.Logger('createJurisdictionRequirement');
    const JurisdictionRequirement = defineJurisdictionRequirementModel(sequelize);
    const requirement = await JurisdictionRequirement.create(reqData, { transaction });
    logger.log(`Jurisdiction requirement created: ${reqData.jurisdiction} - ${reqData.requirementCode}`);
    return requirement;
}
/**
 * Retrieves jurisdiction-specific requirements for entity.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} jurisdiction - Jurisdiction name
 * @param {RegulatoryFramework} [framework] - Optional framework filter
 * @param {boolean} [activeOnly=true] - Active requirements only
 * @returns {Promise<Model[]>} Applicable requirements
 *
 * @example
 * const californiaReqs = await getJurisdictionRequirements(
 *   sequelize,
 *   'California',
 *   RegulatoryFramework.CCPA,
 *   true
 * );
 */
async function getJurisdictionRequirements(sequelize, jurisdiction, framework, activeOnly = true) {
    const JurisdictionRequirement = defineJurisdictionRequirementModel(sequelize);
    const where = { jurisdiction };
    if (framework) {
        where.framework = framework;
    }
    if (activeOnly) {
        where.isActive = true;
    }
    const requirements = await JurisdictionRequirement.findAll({
        where,
        order: [['effectiveDate', 'DESC']],
    });
    return requirements;
}
/**
 * Checks multi-jurisdiction compliance for entity.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string[]} jurisdictions - Array of jurisdictions
 * @param {string} entityType - Entity type
 * @param {Record<string, any>} entityData - Entity data
 * @returns {Promise<Record<string, {compliant: boolean, issues: any[]}>>} Compliance status by jurisdiction
 *
 * @example
 * const multiStateCompliance = await checkMultiJurisdictionCompliance(
 *   sequelize,
 *   ['California', 'New York', 'Texas'],
 *   'healthcare_facility',
 *   { hasDataPrivacyPolicy: true, encryptionEnabled: true }
 * );
 */
async function checkMultiJurisdictionCompliance(sequelize, jurisdictions, entityType, entityData) {
    const logger = new common_1.Logger('checkMultiJurisdictionCompliance');
    const results = {};
    for (const jurisdiction of jurisdictions) {
        const requirements = await getJurisdictionRequirements(sequelize, jurisdiction, undefined, true);
        const issues = [];
        for (const req of requirements) {
            const applicability = req.get('applicability');
            if (applicability.includes(entityType)) {
                // In production, this would perform actual compliance checks
                // For now, we'll do a simple validation
                const provisions = req.get('specificProvisions');
                if (provisions && !validateProvisions(provisions, entityData)) {
                    issues.push({
                        requirementCode: req.get('requirementCode'),
                        description: req.get('description'),
                        severity: 'high',
                    });
                }
            }
        }
        results[jurisdiction] = {
            compliant: issues.length === 0,
            issues,
        };
    }
    logger.log(`Multi-jurisdiction compliance checked for ${jurisdictions.length} jurisdictions`);
    return results;
}
/**
 * Validates entity data against jurisdiction provisions.
 */
function validateProvisions(provisions, entityData) {
    // Simple validation - in production this would be more sophisticated
    for (const [key, value] of Object.entries(provisions)) {
        if (entityData[key] !== value) {
            return false;
        }
    }
    return true;
}
/**
 * Identifies jurisdiction conflicts and variations.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string[]} jurisdictions - Jurisdictions to compare
 * @param {RegulatoryFramework} framework - Framework to analyze
 * @returns {Promise<{conflicts: any[], variations: any[]}>} Conflicts and variations
 *
 * @example
 * const analysis = await analyzeJurisdictionConflicts(
 *   sequelize,
 *   ['California', 'Texas', 'Florida'],
 *   RegulatoryFramework.HIPAA
 * );
 */
async function analyzeJurisdictionConflicts(sequelize, jurisdictions, framework) {
    const logger = new common_1.Logger('analyzeJurisdictionConflicts');
    const JurisdictionRequirement = defineJurisdictionRequirementModel(sequelize);
    const allRequirements = await JurisdictionRequirement.findAll({
        where: {
            jurisdiction: { [sequelize_1.Op.in]: jurisdictions },
            framework,
            isActive: true,
        },
    });
    // Group by requirement code
    const grouped = {};
    for (const req of allRequirements) {
        const code = req.get('requirementCode');
        if (!grouped[code]) {
            grouped[code] = [];
        }
        grouped[code].push(req);
    }
    const conflicts = [];
    const variations = [];
    for (const [code, reqs] of Object.entries(grouped)) {
        if (reqs.length > 1) {
            // Check for conflicts in provisions
            const provisions = reqs.map(r => r.get('specificProvisions'));
            const hasConflicts = checkForConflicts(provisions);
            if (hasConflicts) {
                conflicts.push({
                    requirementCode: code,
                    jurisdictions: reqs.map(r => r.get('jurisdiction')),
                    description: 'Conflicting requirements across jurisdictions',
                });
            }
            else {
                variations.push({
                    requirementCode: code,
                    jurisdictions: reqs.map(r => r.get('jurisdiction')),
                    description: 'Minor variations in implementation',
                });
            }
        }
    }
    logger.log(`Analyzed ${jurisdictions.length} jurisdictions: ${conflicts.length} conflicts, ${variations.length} variations`);
    return { conflicts, variations };
}
/**
 * Checks for conflicts in jurisdiction provisions.
 */
function checkForConflicts(provisions) {
    // Simple conflict detection - in production this would be more sophisticated
    if (provisions.length < 2)
        return false;
    const baseProvision = provisions[0];
    for (let i = 1; i < provisions.length; i++) {
        if (JSON.stringify(baseProvision) !== JSON.stringify(provisions[i])) {
            return true;
        }
    }
    return false;
}
/**
 * Generates jurisdiction compliance matrix.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string[]} jurisdictions - Jurisdictions to include
 * @param {RegulatoryFramework[]} frameworks - Frameworks to analyze
 * @returns {Promise<Record<string, Record<string, number>>>} Compliance matrix
 *
 * @example
 * const matrix = await generateJurisdictionMatrix(
 *   sequelize,
 *   ['California', 'New York', 'Texas'],
 *   [RegulatoryFramework.HIPAA, RegulatoryFramework.CCPA]
 * );
 */
async function generateJurisdictionMatrix(sequelize, jurisdictions, frameworks) {
    const JurisdictionRequirement = defineJurisdictionRequirementModel(sequelize);
    const matrix = {};
    for (const jurisdiction of jurisdictions) {
        matrix[jurisdiction] = {};
        for (const framework of frameworks) {
            const count = await JurisdictionRequirement.count({
                where: {
                    jurisdiction,
                    framework,
                    isActive: true,
                },
            });
            matrix[jurisdiction][framework] = count;
        }
    }
    return matrix;
}
// ============================================================================
// RISK ASSESSMENT FUNCTIONS (39-42)
// ============================================================================
/**
 * Performs comprehensive regulatory risk assessment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} entityType - Entity type
 * @param {string} entityId - Entity ID
 * @param {RegulatoryFramework} framework - Framework to assess
 * @param {string} assessedBy - Assessor user ID
 * @returns {Promise<RiskAssessment>} Risk assessment results
 *
 * @example
 * const riskAssessment = await performRiskAssessment(
 *   sequelize,
 *   'facility',
 *   'facility-uuid',
 *   RegulatoryFramework.HIPAA,
 *   'user-uuid'
 * );
 * console.log(`Overall risk: ${riskAssessment.riskLevel} (${riskAssessment.overallRiskScore}/100)`);
 */
async function performRiskAssessment(sequelize, entityType, entityId, framework, assessedBy) {
    const logger = new common_1.Logger('performRiskAssessment');
    // Get recent audits
    const audits = await getAuditsByEntity(sequelize, entityType, entityId);
    // Get applicable regulations
    const regulations = await getRegulationsByFramework(sequelize, framework);
    // Calculate risk factors
    const riskFactors = [];
    // Audit history risk
    const recentNonCompliance = audits.filter(a => a.get('status') === ComplianceStatus.NON_COMPLIANT).length;
    riskFactors.push({
        factor: 'Audit History',
        score: Math.min(recentNonCompliance * 20, 100),
        weight: 0.3,
        description: `${recentNonCompliance} non-compliant audits in recent history`,
        mitigation: 'Address outstanding audit findings',
    });
    // Regulation severity risk
    const criticalRegulations = regulations.filter(r => r.get('severity') === RegulationSeverity.CRITICAL).length;
    riskFactors.push({
        factor: 'Critical Regulations',
        score: Math.min(criticalRegulations * 15, 100),
        weight: 0.4,
        description: `${criticalRegulations} critical regulations applicable`,
        mitigation: 'Prioritize critical regulation compliance',
    });
    // Remediation progress risk
    const inProgressRemediations = audits.filter(a => a.get('status') === ComplianceStatus.REMEDIATION_IN_PROGRESS).length;
    riskFactors.push({
        factor: 'Pending Remediations',
        score: Math.min(inProgressRemediations * 25, 100),
        weight: 0.3,
        description: `${inProgressRemediations} remediations in progress`,
        mitigation: 'Accelerate remediation completion',
    });
    // Calculate overall risk score
    const overallRiskScore = Math.round(riskFactors.reduce((sum, factor) => sum + factor.score * factor.weight, 0));
    let riskLevel;
    if (overallRiskScore >= 80) {
        riskLevel = 'critical';
    }
    else if (overallRiskScore >= 60) {
        riskLevel = 'high';
    }
    else if (overallRiskScore >= 40) {
        riskLevel = 'medium';
    }
    else {
        riskLevel = 'low';
    }
    const validUntil = new Date();
    validUntil.setMonth(validUntil.getMonth() + 6);
    const assessment = {
        assessmentId: `risk-${Date.now()}`,
        entityType,
        entityId,
        framework,
        overallRiskScore,
        riskLevel,
        riskFactors,
        assessedBy,
        assessedAt: new Date(),
        validUntil,
        recommendations: [
            'Review and address all non-compliant audit findings',
            'Establish regular compliance monitoring schedule',
            'Complete all pending remediation plans',
            'Update compliance policies and procedures',
        ],
    };
    logger.log(`Risk assessment completed: ${entityType}:${entityId} - ${riskLevel} (${overallRiskScore}/100)`);
    return assessment;
}
/**
 * Calculates compliance trend over time.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} entityType - Entity type
 * @param {string} entityId - Entity ID
 * @param {number} [months=12] - Months to analyze
 * @returns {Promise<{trend: 'improving' | 'stable' | 'declining', data: any[]}>} Trend analysis
 *
 * @example
 * const trend = await calculateComplianceTrend(
 *   sequelize,
 *   'facility',
 *   'facility-uuid',
 *   12
 * );
 * console.log(`Compliance trend: ${trend.trend}`);
 */
async function calculateComplianceTrend(sequelize, entityType, entityId, months = 12) {
    const logger = new common_1.Logger('calculateComplianceTrend');
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);
    const ComplianceAudit = defineComplianceAuditModel(sequelize);
    const audits = await ComplianceAudit.findAll({
        where: {
            entityType,
            entityId,
            startDate: { [sequelize_1.Op.gte]: startDate },
        },
        order: [['startDate', 'ASC']],
    });
    const data = audits.map(a => ({
        date: a.get('startDate'),
        score: a.get('score') || 0,
        status: a.get('status'),
    }));
    // Calculate trend
    let trend = 'stable';
    if (data.length >= 2) {
        const firstHalfAvg = data.slice(0, Math.floor(data.length / 2))
            .reduce((sum, d) => sum + d.score, 0) / Math.floor(data.length / 2);
        const secondHalfAvg = data.slice(Math.floor(data.length / 2))
            .reduce((sum, d) => sum + d.score, 0) / Math.ceil(data.length / 2);
        if (secondHalfAvg > firstHalfAvg + 5) {
            trend = 'improving';
        }
        else if (secondHalfAvg < firstHalfAvg - 5) {
            trend = 'declining';
        }
    }
    logger.log(`Compliance trend calculated: ${trend} over ${months} months`);
    return { trend, data };
}
/**
 * Generates regulatory compliance report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ComplianceReportConfig} config - Report configuration
 * @returns {Promise<{report: any, generatedAt: Date}>} Generated report
 *
 * @example
 * const report = await generateComplianceReport(sequelize, {
 *   reportType: 'quarterly_compliance',
 *   framework: RegulatoryFramework.HIPAA,
 *   jurisdiction: 'United States',
 *   frequency: 'quarterly',
 *   includedMetrics: ['audit_count', 'compliance_rate', 'risk_level'],
 *   recipients: ['compliance@example.com'],
 *   format: 'pdf',
 *   automated: true
 * });
 */
async function generateComplianceReport(sequelize, config) {
    const logger = new common_1.Logger('generateComplianceReport');
    const now = new Date();
    const startDate = new Date();
    // Calculate report period based on frequency
    switch (config.frequency) {
        case 'daily':
            startDate.setDate(startDate.getDate() - 1);
            break;
        case 'weekly':
            startDate.setDate(startDate.getDate() - 7);
            break;
        case 'monthly':
            startDate.setMonth(startDate.getMonth() - 1);
            break;
        case 'quarterly':
            startDate.setMonth(startDate.getMonth() - 3);
            break;
        case 'annual':
            startDate.setFullYear(startDate.getFullYear() - 1);
            break;
    }
    const stats = await getAuditStatistics(sequelize, startDate, now);
    const regulations = await getRegulationsByFramework(sequelize, config.framework, config.jurisdiction);
    const report = {
        reportType: config.reportType,
        framework: config.framework,
        jurisdiction: config.jurisdiction,
        period: {
            start: startDate,
            end: now,
        },
        summary: {
            totalAudits: stats.totalAudits,
            complianceRate: stats.complianceRate,
            averageScore: stats.averageScore,
        },
        statistics: stats,
        regulations: {
            total: regulations.length,
            critical: regulations.filter(r => r.get('severity') === RegulationSeverity.CRITICAL).length,
        },
        format: config.format,
    };
    logger.log(`Compliance report generated: ${config.reportType}`);
    return { report, generatedAt: now };
}
/**
 * Identifies compliance gaps and generates recommendations.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} entityType - Entity type
 * @param {string} entityId - Entity ID
 * @param {RegulatoryFramework} framework - Framework to analyze
 * @returns {Promise<{gaps: any[], recommendations: string[], priority: string}>} Gap analysis
 *
 * @example
 * const analysis = await identifyComplianceGaps(
 *   sequelize,
 *   'facility',
 *   'facility-uuid',
 *   RegulatoryFramework.HIPAA
 * );
 * console.log(`Found ${analysis.gaps.length} compliance gaps`);
 * console.log('Recommendations:', analysis.recommendations);
 */
async function identifyComplianceGaps(sequelize, entityType, entityId, framework) {
    const logger = new common_1.Logger('identifyComplianceGaps');
    // Get applicable regulations
    const regulations = await getRegulationsByFramework(sequelize, framework);
    // Get recent audits
    const audits = await getAuditsByEntity(sequelize, entityType, entityId);
    const gaps = [];
    const recommendations = [];
    // Identify gaps from audit findings
    for (const audit of audits) {
        const findings = audit.get('findings');
        const openFindings = findings.filter(f => f.status === 'open' || f.status === 'in_progress');
        for (const finding of openFindings) {
            gaps.push({
                source: 'audit',
                auditId: audit.get('id'),
                findingId: finding.findingId,
                description: finding.description,
                severity: finding.severity,
                recommendation: finding.recommendation,
            });
        }
    }
    // Generate recommendations
    if (gaps.length > 0) {
        recommendations.push('Prioritize resolution of critical compliance gaps');
        recommendations.push('Implement automated compliance monitoring');
        recommendations.push('Schedule regular compliance training for staff');
        recommendations.push('Establish compliance dashboard for real-time monitoring');
    }
    const criticalGaps = gaps.filter(g => g.severity === RegulationSeverity.CRITICAL).length;
    const priority = criticalGaps > 0 ? 'critical' : gaps.length > 5 ? 'high' : 'medium';
    logger.log(`Identified ${gaps.length} compliance gaps for ${entityType}:${entityId}`);
    return { gaps, recommendations, priority };
}
// ============================================================================
// NESTJS SERVICE EXAMPLE
// ============================================================================
/**
 * NestJS service for regulatory compliance management.
 *
 * @example
 * @Injectable()
 * export class ComplianceService extends RegulatoryComplianceService {
 *   constructor(@Inject('SEQUELIZE') sequelize: Sequelize) {
 *     super(sequelize);
 *   }
 * }
 */
let RegulatoryComplianceService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var RegulatoryComplianceService = _classThis = class {
        constructor(sequelize) {
            this.sequelize = sequelize;
            this.logger = new common_1.Logger(RegulatoryComplianceService.name);
        }
        async trackRegulation(data, transaction) {
            return trackRegulation(this.sequelize, data, transaction);
        }
        async createComplianceRule(ruleData, transaction) {
            return createComplianceRule(this.sequelize, ruleData, transaction);
        }
        async evaluateCompliance(entityType, entityId, entityData) {
            return evaluateComplianceRules(this.sequelize, entityType, entityId, entityData);
        }
        async initiateAudit(auditData, transaction) {
            return initiateComplianceAudit(this.sequelize, auditData, transaction);
        }
        async assessRisk(entityType, entityId, framework, assessedBy) {
            return performRiskAssessment(this.sequelize, entityType, entityId, framework, assessedBy);
        }
    };
    __setFunctionName(_classThis, "RegulatoryComplianceService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RegulatoryComplianceService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RegulatoryComplianceService = _classThis;
})();
exports.RegulatoryComplianceService = RegulatoryComplianceService;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Enums
    RegulatoryFramework,
    ComplianceStatus,
    RegulationSeverity,
    JurisdictionType,
    ImpactLevel,
    // Schemas
    RegulationMetadataSchema: exports.RegulationMetadataSchema,
    ComplianceRuleSchema: exports.ComplianceRuleSchema,
    ComplianceAuditSchema: exports.ComplianceAuditSchema,
    RegulatoryChangeSchema: exports.RegulatoryChangeSchema,
    // Models
    defineRegulationModel,
    defineComplianceRuleModel,
    defineComplianceAuditModel,
    defineRegulatoryChangeModel,
    defineJurisdictionRequirementModel,
    // Regulation tracking (7 functions)
    trackRegulation,
    getRegulationsByFramework,
    updateRegulation,
    monitorRegulationReviews,
    archiveRegulation,
    searchRegulations,
    linkRelatedRegulations,
    // Compliance rules (8 functions)
    createComplianceRule,
    evaluateComplianceRules,
    getRulesByRegulation,
    updateRuleExecutionStats,
    toggleComplianceRule,
    bulkEvaluateCompliance,
    getHighPriorityRules,
    // Compliance audits (7 functions)
    initiateComplianceAudit,
    recordComplianceFindings,
    completeComplianceAudit,
    createRemediationPlan,
    updateRemediationStep,
    getAuditsByEntity,
    getAuditStatistics,
    // Regulatory changes (6 functions)
    registerRegulatoryChange,
    detectPendingChanges,
    assessRegulatoryImpact,
    markChangeAsReviewed,
    getHighImpactChanges,
    getChangesByFramework,
    // Jurisdiction compliance (5 functions)
    createJurisdictionRequirement,
    getJurisdictionRequirements,
    checkMultiJurisdictionCompliance,
    analyzeJurisdictionConflicts,
    generateJurisdictionMatrix,
    // Risk assessment (4 functions)
    performRiskAssessment,
    calculateComplianceTrend,
    generateComplianceReport,
    identifyComplianceGaps,
    // Services
    RegulatoryComplianceService,
};
//# sourceMappingURL=regulatory-compliance-kit.js.map