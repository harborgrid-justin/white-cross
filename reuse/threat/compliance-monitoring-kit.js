"use strict";
/**
 * LOC: COMPLMON4567890
 * File: /reuse/threat/compliance-monitoring-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS compliance services
 *   - Audit management modules
 *   - Regulatory compliance tracking
 *   - Control effectiveness testing
 *   - Certification management
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCertificationDto = exports.CreateGapDto = exports.CreateAuditDto = exports.CreateControlDto = exports.CreateFrameworkDto = exports.auditFindingSchema = exports.testResultSchema = exports.certificationSchema = exports.complianceGapSchema = exports.auditSchema = exports.complianceControlSchema = exports.complianceFrameworkSchema = void 0;
exports.defineComplianceFrameworkModel = defineComplianceFrameworkModel;
exports.defineComplianceControlModel = defineComplianceControlModel;
exports.defineAuditModel = defineAuditModel;
exports.defineComplianceGapModel = defineComplianceGapModel;
exports.defineCertificationModel = defineCertificationModel;
exports.createComplianceFramework = createComplianceFramework;
exports.updateFrameworkStatus = updateFrameworkStatus;
exports.getFrameworkWithStats = getFrameworkWithStats;
exports.listActiveFrameworks = listActiveFrameworks;
exports.calculateFrameworkMaturity = calculateFrameworkMaturity;
exports.getFrameworksNeedingAudit = getFrameworksNeedingAudit;
exports.createComplianceControl = createComplianceControl;
exports.performControlTest = performControlTest;
exports.calculateNextTestDate = calculateNextTestDate;
exports.getControlsDueForTesting = getControlsDueForTesting;
exports.getControlEffectivenessRate = getControlEffectivenessRate;
exports.getControlsByDomain = getControlsByDomain;
exports.updateControlStatus = updateControlStatus;
exports.getCriticalControlsWithIssues = getCriticalControlsWithIssues;
exports.createAudit = createAudit;
exports.addAuditFinding = addAuditFinding;
exports.updateAuditStatus = updateAuditStatus;
exports.getAuditFindingsBySeverity = getAuditFindingsBySeverity;
exports.getActiveAudits = getActiveAudits;
exports.closeAudit = closeAudit;
exports.identifyComplianceGap = identifyComplianceGap;
exports.updateGapStatus = updateGapStatus;
exports.getCriticalGaps = getCriticalGaps;
exports.generateGapAnalysisReport = generateGapAnalysisReport;
exports.getGapsByType = getGapsByType;
exports.assignGapRemediation = assignGapRemediation;
exports.registerCertification = registerCertification;
exports.getExpiringCertifications = getExpiringCertifications;
exports.updateCertificationStatus = updateCertificationStatus;
exports.scheduleCertificationRenewal = scheduleCertificationRenewal;
exports.getActiveCertifications = getActiveCertifications;
exports.calculateCertificationCoverage = calculateCertificationCoverage;
exports.trackRegulatoryRequirement = trackRegulatoryRequirement;
exports.collectEvidence = collectEvidence;
exports.createRemediationPlan = createRemediationPlan;
exports.generateComplianceReport = generateComplianceReport;
exports.automateControlTest = automateControlTest;
exports.getComplianceDashboard = getComplianceDashboard;
exports.monitorRegulatoryChanges = monitorRegulatoryChanges;
const sequelize_1 = require("sequelize");
const crypto = __importStar(require("crypto"));
const zod_1 = require("zod");
const swagger_1 = require("@nestjs/swagger");
testing;
Frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
automationLevel: 'manual' | 'semi_automated' | 'fully_automated';
priority: 'low' | 'medium' | 'high' | 'critical';
status: 'not_implemented' | 'in_progress' | 'implemented' | 'effective' | 'ineffective';
owner: string;
implementationDate ?  : Date;
lastTestedDate ?  : Date;
nextTestDate ?  : Date;
testResults ?  : TestResult[];
evidenceRequired: string[];
metadata ?  : Record;
// ============================================================================
// SEQUELIZE MODELS (1-5)
// ============================================================================
/**
 * Sequelize model for Compliance Frameworks.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ComplianceFramework model
 *
 * @example
 * const ComplianceFramework = defineComplianceFrameworkModel(sequelize);
 * await ComplianceFramework.create({
 *   frameworkName: 'SOC 2 Type II',
 *   frameworkType: 'soc2',
 *   version: '2024',
 *   certificationRequired: true,
 *   auditFrequency: 'annual',
 *   status: 'implementing',
 *   owner: 'user-123'
 * });
 */
function defineComplianceFrameworkModel(sequelize) {
    class ComplianceFramework extends sequelize_1.Model {
    }
    ComplianceFramework.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        frameworkName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            field: 'framework_name',
            validate: {
                notEmpty: true,
            },
        },
        frameworkType: {
            type: sequelize_1.DataTypes.ENUM('soc2', 'iso27001', 'nist', 'hipaa', 'gdpr', 'pci_dss', 'custom'),
            allowNull: false,
            field: 'framework_type',
        },
        version: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        implementationDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'implementation_date',
        },
        certificationRequired: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            field: 'certification_required',
        },
        certificationBody: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
            field: 'certification_body',
        },
        auditFrequency: {
            type: sequelize_1.DataTypes.ENUM('monthly', 'quarterly', 'semi_annual', 'annual', 'biennial'),
            allowNull: false,
            field: 'audit_frequency',
        },
        nextAuditDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'next_audit_date',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('planning', 'implementing', 'operational', 'certified', 'expired'),
            allowNull: false,
            defaultValue: 'planning',
        },
        owner: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
        stakeholders: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.UUID),
            allowNull: false,
            defaultValue: [],
        },
        domains: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: [],
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
    }, {
        sequelize,
        tableName: 'compliance_frameworks',
        timestamps: true,
        indexes: [
            { fields: ['framework_type'] },
            { fields: ['status'] },
            { fields: ['owner'] },
            { fields: ['next_audit_date'] },
        ],
    });
    return ComplianceFramework;
}
/**
 * Sequelize model for Compliance Controls.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ComplianceControl model
 *
 * @example
 * const ComplianceControl = defineComplianceControlModel(sequelize);
 * await ComplianceControl.create({
 *   frameworkId: 'framework-123',
 *   controlId: 'CC6.1',
 *   controlName: 'Logical Access Controls',
 *   controlType: 'preventive',
 *   domain: 'Access Control',
 *   status: 'implemented'
 * });
 */
function defineComplianceControlModel(sequelize) {
    class ComplianceControl extends sequelize_1.Model {
    }
    ComplianceControl.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        frameworkId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            field: 'framework_id',
            references: {
                model: 'compliance_frameworks',
                key: 'id',
            },
        },
        controlId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            field: 'control_id',
        },
        controlName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            field: 'control_name',
        },
        controlType: {
            type: sequelize_1.DataTypes.ENUM('preventive', 'detective', 'corrective', 'directive'),
            allowNull: false,
            field: 'control_type',
        },
        domain: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        objective: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        implementationGuidance: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            field: 'implementation_guidance',
        },
        testingFrequency: {
            type: sequelize_1.DataTypes.ENUM('daily', 'weekly', 'monthly', 'quarterly', 'annual'),
            allowNull: false,
            field: 'testing_frequency',
        },
        automationLevel: {
            type: sequelize_1.DataTypes.ENUM('manual', 'semi_automated', 'fully_automated'),
            allowNull: false,
            defaultValue: 'manual',
            field: 'automation_level',
        },
        priority: {
            type: sequelize_1.DataTypes.ENUM('low', 'medium', 'high', 'critical'),
            allowNull: false,
            defaultValue: 'medium',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('not_implemented', 'in_progress', 'implemented', 'effective', 'ineffective'),
            allowNull: false,
            defaultValue: 'not_implemented',
        },
        owner: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
        implementationDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'implementation_date',
        },
        lastTestedDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'last_tested_date',
        },
        nextTestDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'next_test_date',
        },
        testResults: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: [],
            field: 'test_results',
        },
        evidenceRequired: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: false,
            defaultValue: [],
            field: 'evidence_required',
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
    }, {
        sequelize,
        tableName: 'compliance_controls',
        timestamps: true,
        indexes: [
            { fields: ['framework_id'] },
            { fields: ['control_id'] },
            { fields: ['domain'] },
            { fields: ['status'] },
            { fields: ['priority'] },
            { fields: ['next_test_date'] },
        ],
    });
    return ComplianceControl;
}
/**
 * Sequelize model for Audits.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Audit model
 *
 * @example
 * const Audit = defineAuditModel(sequelize);
 * await Audit.create({
 *   auditName: 'SOC 2 Type II Audit 2024',
 *   auditType: 'certification',
 *   frameworkId: 'framework-123',
 *   startDate: new Date(),
 *   status: 'planned',
 *   leadAuditor: 'auditor-123'
 * });
 */
function defineAuditModel(sequelize) {
    class Audit extends sequelize_1.Model {
    }
    Audit.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        auditName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            field: 'audit_name',
        },
        auditType: {
            type: sequelize_1.DataTypes.ENUM('internal', 'external', 'certification', 'surveillance', 'special'),
            allowNull: false,
            field: 'audit_type',
        },
        frameworkId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            field: 'framework_id',
            references: {
                model: 'compliance_frameworks',
                key: 'id',
            },
        },
        scope: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: false,
            defaultValue: [],
        },
        startDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            field: 'start_date',
        },
        endDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'end_date',
        },
        completedDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'completed_date',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('planned', 'in_progress', 'fieldwork', 'reporting', 'completed', 'cancelled'),
            allowNull: false,
            defaultValue: 'planned',
        },
        leadAuditor: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            field: 'lead_auditor',
        },
        auditTeam: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.UUID),
            allowNull: false,
            defaultValue: [],
            field: 'audit_team',
        },
        auditFirm: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
            field: 'audit_firm',
        },
        objectives: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.TEXT),
            allowNull: false,
            defaultValue: [],
        },
        methodology: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        findings: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: [],
        },
        recommendations: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.TEXT),
            allowNull: false,
            defaultValue: [],
        },
        reportDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'report_date',
        },
        reportUrl: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: true,
            field: 'report_url',
        },
        followUpDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'follow_up_date',
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
    }, {
        sequelize,
        tableName: 'audits',
        timestamps: true,
        indexes: [
            { fields: ['framework_id'] },
            { fields: ['audit_type'] },
            { fields: ['status'] },
            { fields: ['start_date'] },
            { fields: ['lead_auditor'] },
        ],
    });
    return Audit;
}
/**
 * Sequelize model for Compliance Gaps.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ComplianceGap model
 *
 * @example
 * const ComplianceGap = defineComplianceGapModel(sequelize);
 * await ComplianceGap.create({
 *   frameworkId: 'framework-123',
 *   gapType: 'control',
 *   severity: 'high',
 *   title: 'Missing MFA Implementation',
 *   currentState: 'Single factor authentication',
 *   requiredState: 'Multi-factor authentication',
 *   status: 'identified'
 * });
 */
function defineComplianceGapModel(sequelize) {
    class ComplianceGap extends sequelize_1.Model {
    }
    ComplianceGap.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        frameworkId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            field: 'framework_id',
            references: {
                model: 'compliance_frameworks',
                key: 'id',
            },
        },
        gapType: {
            type: sequelize_1.DataTypes.ENUM('control', 'policy', 'process', 'documentation', 'technical'),
            allowNull: false,
            field: 'gap_type',
        },
        severity: {
            type: sequelize_1.DataTypes.ENUM('low', 'medium', 'high', 'critical'),
            allowNull: false,
        },
        title: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        currentState: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            field: 'current_state',
        },
        requiredState: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            field: 'required_state',
        },
        impactedControls: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: false,
            defaultValue: [],
            field: 'impacted_controls',
        },
        businessImpact: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            field: 'business_impact',
        },
        remediationPlan: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            field: 'remediation_plan',
        },
        estimatedEffort: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            field: 'estimated_effort',
        },
        assignedTo: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            field: 'assigned_to',
        },
        targetDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'target_date',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('identified', 'planning', 'in_progress', 'resolved', 'accepted'),
            allowNull: false,
            defaultValue: 'identified',
        },
        identifiedDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            field: 'identified_date',
        },
        resolvedDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'resolved_date',
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
    }, {
        sequelize,
        tableName: 'compliance_gaps',
        timestamps: true,
        indexes: [
            { fields: ['framework_id'] },
            { fields: ['gap_type'] },
            { fields: ['severity'] },
            { fields: ['status'] },
            { fields: ['target_date'] },
        ],
    });
    return ComplianceGap;
}
/**
 * Sequelize model for Certifications.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Certification model
 *
 * @example
 * const Certification = defineCertificationModel(sequelize);
 * await Certification.create({
 *   frameworkId: 'framework-123',
 *   certificationType: 'SOC 2 Type II',
 *   certificationBody: 'AICPA',
 *   issueDate: new Date(),
 *   expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
 *   status: 'active'
 * });
 */
function defineCertificationModel(sequelize) {
    class Certification extends sequelize_1.Model {
    }
    Certification.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        frameworkId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            field: 'framework_id',
            references: {
                model: 'compliance_frameworks',
                key: 'id',
            },
        },
        certificationType: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            field: 'certification_type',
        },
        certificationBody: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            field: 'certification_body',
        },
        certificationNumber: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            field: 'certification_number',
        },
        issueDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            field: 'issue_date',
        },
        expirationDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            field: 'expiration_date',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('active', 'expiring_soon', 'expired', 'suspended', 'revoked'),
            allowNull: false,
            defaultValue: 'active',
        },
        scope: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: false,
            defaultValue: [],
        },
        certificationDocument: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: true,
            field: 'certification_document',
        },
        auditId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            field: 'audit_id',
            references: {
                model: 'audits',
                key: 'id',
            },
        },
        renewalRequired: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            field: 'renewal_required',
        },
        renewalDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'renewal_date',
        },
        cost: {
            type: sequelize_1.DataTypes.DECIMAL(12, 2),
            allowNull: true,
        },
        contactPerson: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
            field: 'contact_person',
        },
        notes: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
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
    }, {
        sequelize,
        tableName: 'certifications',
        timestamps: true,
        indexes: [
            { fields: ['framework_id'] },
            { fields: ['certification_type'] },
            { fields: ['status'] },
            { fields: ['expiration_date'] },
            { fields: ['renewal_date'] },
        ],
    });
    return Certification;
}
// ============================================================================
// ZOD SCHEMAS (6-12)
// ============================================================================
/**
 * Zod schema for compliance framework validation.
 */
exports.complianceFrameworkSchema = zod_1.z.object({
    frameworkName: zod_1.z.string().min(1).max(255),
    frameworkType: zod_1.z.enum(['soc2', 'iso27001', 'nist', 'hipaa', 'gdpr', 'pci_dss', 'custom']),
    version: zod_1.z.string().min(1).max(50),
    certificationRequired: zod_1.z.boolean(),
    auditFrequency: zod_1.z.enum(['monthly', 'quarterly', 'semi_annual', 'annual', 'biennial']),
    status: zod_1.z.enum(['planning', 'implementing', 'operational', 'certified', 'expired']),
    owner: zod_1.z.string().uuid(),
    stakeholders: zod_1.z.array(zod_1.z.string().uuid()),
});
/**
 * Zod schema for compliance control validation.
 */
exports.complianceControlSchema = zod_1.z.object({
    frameworkId: zod_1.z.string().uuid(),
    controlId: zod_1.z.string().min(1).max(100),
    controlName: zod_1.z.string().min(1).max(255),
    controlType: zod_1.z.enum(['preventive', 'detective', 'corrective', 'directive']),
    domain: zod_1.z.string().min(1).max(100),
    description: zod_1.z.string().min(10),
    objective: zod_1.z.string().min(10),
    testingFrequency: zod_1.z.enum(['daily', 'weekly', 'monthly', 'quarterly', 'annual']),
    automationLevel: zod_1.z.enum(['manual', 'semi_automated', 'fully_automated']),
    priority: zod_1.z.enum(['low', 'medium', 'high', 'critical']),
    status: zod_1.z.enum(['not_implemented', 'in_progress', 'implemented', 'effective', 'ineffective']),
    owner: zod_1.z.string().uuid(),
});
/**
 * Zod schema for audit validation.
 */
exports.auditSchema = zod_1.z.object({
    auditName: zod_1.z.string().min(1).max(255),
    auditType: zod_1.z.enum(['internal', 'external', 'certification', 'surveillance', 'special']),
    frameworkId: zod_1.z.string().uuid().optional(),
    scope: zod_1.z.array(zod_1.z.string()),
    startDate: zod_1.z.date(),
    leadAuditor: zod_1.z.string().uuid(),
    objectives: zod_1.z.array(zod_1.z.string()),
});
/**
 * Zod schema for compliance gap validation.
 */
exports.complianceGapSchema = zod_1.z.object({
    frameworkId: zod_1.z.string().uuid(),
    gapType: zod_1.z.enum(['control', 'policy', 'process', 'documentation', 'technical']),
    severity: zod_1.z.enum(['low', 'medium', 'high', 'critical']),
    title: zod_1.z.string().min(5).max(255),
    description: zod_1.z.string().min(10),
    currentState: zod_1.z.string().min(10),
    requiredState: zod_1.z.string().min(10),
    impactedControls: zod_1.z.array(zod_1.z.string()),
    businessImpact: zod_1.z.string().min(10),
});
/**
 * Zod schema for certification validation.
 */
exports.certificationSchema = zod_1.z.object({
    frameworkId: zod_1.z.string().uuid(),
    certificationType: zod_1.z.string().min(1).max(255),
    certificationBody: zod_1.z.string().min(1).max(255),
    issueDate: zod_1.z.date(),
    expirationDate: zod_1.z.date(),
    scope: zod_1.z.array(zod_1.z.string()),
    renewalRequired: zod_1.z.boolean(),
});
/**
 * Zod schema for test result validation.
 */
exports.testResultSchema = zod_1.z.object({
    testDate: zod_1.z.date(),
    tester: zod_1.z.string().uuid(),
    testMethod: zod_1.z.enum(['inspection', 'observation', 'inquiry', 'reperformance', 'automated']),
    result: zod_1.z.enum(['pass', 'fail', 'partial', 'not_applicable']),
    findings: zod_1.z.array(zod_1.z.string()),
    evidence: zod_1.z.array(zod_1.z.string()),
});
/**
 * Zod schema for audit finding validation.
 */
exports.auditFindingSchema = zod_1.z.object({
    findingId: zod_1.z.string(),
    severity: zod_1.z.enum(['low', 'medium', 'high', 'critical']),
    category: zod_1.z.string(),
    title: zod_1.z.string().min(5),
    description: zod_1.z.string().min(10),
    impact: zod_1.z.string().min(10),
    recommendation: zod_1.z.string().min(10),
    evidence: zod_1.z.array(zod_1.z.string()),
    status: zod_1.z.enum(['open', 'in_remediation', 'resolved', 'accepted_risk']),
});
// ============================================================================
// FRAMEWORK MANAGEMENT UTILITIES (13-18)
// ============================================================================
/**
 * Creates a new compliance framework.
 *
 * @param {typeof Model} frameworkModel - Framework model
 * @param {ComplianceFramework} framework - Framework data
 * @returns {Promise<any>} Created framework
 *
 * @example
 * await createComplianceFramework(ComplianceFramework, {
 *   frameworkName: 'SOC 2 Type II',
 *   frameworkType: 'soc2',
 *   version: '2024',
 *   certificationRequired: true,
 *   auditFrequency: 'annual',
 *   status: 'implementing',
 *   owner: 'user-123',
 *   stakeholders: ['user-456', 'user-789'],
 *   domains: []
 * });
 */
async function createComplianceFramework(frameworkModel, framework) {
    const validated = exports.complianceFrameworkSchema.parse(framework);
    return await frameworkModel.create(validated);
}
/**
 * Updates framework status and metadata.
 *
 * @param {typeof Model} frameworkModel - Framework model
 * @param {string} frameworkId - Framework ID
 * @param {Partial<ComplianceFramework>} updates - Framework updates
 * @returns {Promise<any>} Updated framework
 *
 * @example
 * await updateFrameworkStatus(ComplianceFramework, 'framework-123', {
 *   status: 'certified',
 *   nextAuditDate: new Date('2025-01-01')
 * });
 */
async function updateFrameworkStatus(frameworkModel, frameworkId, updates) {
    const framework = await frameworkModel.findByPk(frameworkId);
    if (!framework) {
        throw new Error(`Framework ${frameworkId} not found`);
    }
    return await framework.update(updates);
}
/**
 * Gets framework with control statistics.
 *
 * @param {typeof Model} frameworkModel - Framework model
 * @param {typeof Model} controlModel - Control model
 * @param {string} frameworkId - Framework ID
 * @returns {Promise<any>} Framework with statistics
 *
 * @example
 * const framework = await getFrameworkWithStats(ComplianceFramework, ComplianceControl, 'framework-123');
 */
async function getFrameworkWithStats(frameworkModel, controlModel, frameworkId) {
    const framework = await frameworkModel.findByPk(frameworkId);
    if (!framework) {
        throw new Error(`Framework ${frameworkId} not found`);
    }
    const controls = await controlModel.findAll({ where: { frameworkId } });
    const stats = {
        totalControls: controls.length,
        implemented: controls.filter(c => c.status === 'implemented' || c.status === 'effective').length,
        effective: controls.filter(c => c.status === 'effective').length,
        inProgress: controls.filter(c => c.status === 'in_progress').length,
        notImplemented: controls.filter(c => c.status === 'not_implemented').length,
        ineffective: controls.filter(c => c.status === 'ineffective').length,
    };
    return { ...framework.toJSON(), stats };
}
/**
 * Lists all active frameworks.
 *
 * @param {typeof Model} frameworkModel - Framework model
 * @returns {Promise<any[]>} Active frameworks
 *
 * @example
 * const frameworks = await listActiveFrameworks(ComplianceFramework);
 */
async function listActiveFrameworks(frameworkModel) {
    return await frameworkModel.findAll({
        where: {
            status: { [sequelize_1.Op.in]: ['implementing', 'operational', 'certified'] },
        },
        order: [['frameworkName', 'ASC']],
    });
}
/**
 * Calculates framework maturity score.
 *
 * @param {any[]} controls - Framework controls
 * @returns {number} Maturity score (0-100)
 *
 * @example
 * const maturity = calculateFrameworkMaturity(controls);
 */
function calculateFrameworkMaturity(controls) {
    if (controls.length === 0)
        return 0;
    const weights = {
        not_implemented: 0,
        in_progress: 0.5,
        implemented: 0.75,
        effective: 1.0,
        ineffective: 0.25,
    };
    const totalScore = controls.reduce((sum, control) => {
        return sum + (weights[control.status] || 0);
    }, 0);
    return (totalScore / controls.length) * 100;
}
/**
 * Gets frameworks requiring upcoming audits.
 *
 * @param {typeof Model} frameworkModel - Framework model
 * @param {number} daysAhead - Days to look ahead
 * @returns {Promise<any[]>} Frameworks needing audits
 *
 * @example
 * const upcoming = await getFrameworksNeedingAudit(ComplianceFramework, 60);
 */
async function getFrameworksNeedingAudit(frameworkModel, daysAhead = 60) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);
    return await frameworkModel.findAll({
        where: {
            nextAuditDate: {
                [sequelize_1.Op.lte]: futureDate,
                [sequelize_1.Op.gte]: new Date(),
            },
            status: { [sequelize_1.Op.in]: ['implementing', 'operational', 'certified'] },
        },
        order: [['nextAuditDate', 'ASC']],
    });
}
// ============================================================================
// CONTROL MANAGEMENT UTILITIES (19-26)
// ============================================================================
/**
 * Creates a compliance control.
 *
 * @param {typeof Model} controlModel - Control model
 * @param {ComplianceControl} control - Control data
 * @returns {Promise<any>} Created control
 *
 * @example
 * await createComplianceControl(ComplianceControl, {
 *   frameworkId: 'framework-123',
 *   controlId: 'CC6.1',
 *   controlName: 'Logical Access Controls',
 *   controlType: 'preventive',
 *   domain: 'Access Control',
 *   description: 'Implement logical access controls',
 *   objective: 'Prevent unauthorized access',
 *   testingFrequency: 'quarterly',
 *   automationLevel: 'semi_automated',
 *   priority: 'high',
 *   status: 'not_implemented',
 *   owner: 'user-123'
 * });
 */
async function createComplianceControl(controlModel, control) {
    const validated = exports.complianceControlSchema.parse(control);
    return await controlModel.create(validated);
}
/**
 * Performs control effectiveness testing.
 *
 * @param {typeof Model} controlModel - Control model
 * @param {string} controlId - Control ID
 * @param {TestResult} testResult - Test result data
 * @returns {Promise<any>} Updated control
 *
 * @example
 * await performControlTest(ComplianceControl, 'control-123', {
 *   testDate: new Date(),
 *   tester: 'user-456',
 *   testMethod: 'reperformance',
 *   result: 'pass',
 *   findings: [],
 *   evidence: ['evidence-1', 'evidence-2']
 * });
 */
async function performControlTest(controlModel, controlId, testResult) {
    const validated = exports.testResultSchema.parse(testResult);
    const control = await controlModel.findByPk(controlId);
    if (!control) {
        throw new Error(`Control ${controlId} not found`);
    }
    const testResults = [...(control.testResults || []), validated];
    const newStatus = testResult.result === 'pass' ? 'effective' :
        testResult.result === 'fail' ? 'ineffective' : control.status;
    return await control.update({
        testResults,
        lastTestedDate: testResult.testDate,
        status: newStatus,
    });
}
/**
 * Calculates next test date based on frequency.
 *
 * @param {Date} lastTestDate - Last test date
 * @param {'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual'} frequency - Testing frequency
 * @returns {Date} Next test date
 *
 * @example
 * const nextTest = calculateNextTestDate(new Date(), 'quarterly');
 */
function calculateNextTestDate(lastTestDate, frequency) {
    const next = new Date(lastTestDate);
    switch (frequency) {
        case 'daily':
            next.setDate(next.getDate() + 1);
            break;
        case 'weekly':
            next.setDate(next.getDate() + 7);
            break;
        case 'monthly':
            next.setMonth(next.getMonth() + 1);
            break;
        case 'quarterly':
            next.setMonth(next.getMonth() + 3);
            break;
        case 'annual':
            next.setFullYear(next.getFullYear() + 1);
            break;
    }
    return next;
}
/**
 * Gets controls requiring testing.
 *
 * @param {typeof Model} controlModel - Control model
 * @returns {Promise<any[]>} Controls due for testing
 *
 * @example
 * const dueControls = await getControlsDueForTesting(ComplianceControl);
 */
async function getControlsDueForTesting(controlModel) {
    return await controlModel.findAll({
        where: {
            nextTestDate: { [sequelize_1.Op.lte]: new Date() },
            status: { [sequelize_1.Op.in]: ['implemented', 'effective'] },
        },
        order: [['priority', 'DESC'], ['nextTestDate', 'ASC']],
    });
}
/**
 * Gets control effectiveness rate.
 *
 * @param {any[]} controls - Controls to analyze
 * @returns {number} Effectiveness rate percentage
 *
 * @example
 * const rate = getControlEffectivenessRate(controls);
 */
function getControlEffectivenessRate(controls) {
    if (controls.length === 0)
        return 0;
    const effective = controls.filter(c => c.status === 'effective').length;
    return (effective / controls.length) * 100;
}
/**
 * Gets controls by domain.
 *
 * @param {typeof Model} controlModel - Control model
 * @param {string} frameworkId - Framework ID
 * @param {string} domain - Domain name
 * @returns {Promise<any[]>} Domain controls
 *
 * @example
 * const accessControls = await getControlsByDomain(ComplianceControl, 'framework-123', 'Access Control');
 */
async function getControlsByDomain(controlModel, frameworkId, domain) {
    return await controlModel.findAll({
        where: { frameworkId, domain },
        order: [['controlId', 'ASC']],
    });
}
/**
 * Updates control implementation status.
 *
 * @param {typeof Model} controlModel - Control model
 * @param {string} controlId - Control ID
 * @param {'not_implemented' | 'in_progress' | 'implemented' | 'effective' | 'ineffective'} status - New status
 * @returns {Promise<any>} Updated control
 *
 * @example
 * await updateControlStatus(ComplianceControl, 'control-123', 'implemented');
 */
async function updateControlStatus(controlModel, controlId, status) {
    const control = await controlModel.findByPk(controlId);
    if (!control) {
        throw new Error(`Control ${controlId} not found`);
    }
    const updates = { status };
    if (status === 'implemented' && !control.implementationDate) {
        updates.implementationDate = new Date();
    }
    return await control.update(updates);
}
/**
 * Gets critical controls with issues.
 *
 * @param {typeof Model} controlModel - Control model
 * @param {string} frameworkId - Framework ID
 * @returns {Promise<any[]>} Critical controls needing attention
 *
 * @example
 * const critical = await getCriticalControlsWithIssues(ComplianceControl, 'framework-123');
 */
async function getCriticalControlsWithIssues(controlModel, frameworkId) {
    return await controlModel.findAll({
        where: {
            frameworkId,
            priority: 'critical',
            status: { [sequelize_1.Op.in]: ['not_implemented', 'in_progress', 'ineffective'] },
        },
        order: [['priority', 'DESC']],
    });
}
// ============================================================================
// AUDIT MANAGEMENT UTILITIES (27-32)
// ============================================================================
/**
 * Creates a new audit.
 *
 * @param {typeof Model} auditModel - Audit model
 * @param {Audit} audit - Audit data
 * @returns {Promise<any>} Created audit
 *
 * @example
 * await createAudit(Audit, {
 *   auditName: 'SOC 2 Type II Audit 2024',
 *   auditType: 'certification',
 *   frameworkId: 'framework-123',
 *   scope: ['All controls'],
 *   startDate: new Date(),
 *   status: 'planned',
 *   leadAuditor: 'auditor-123',
 *   auditTeam: ['auditor-456', 'auditor-789'],
 *   objectives: ['Assess control effectiveness']
 * });
 */
async function createAudit(auditModel, audit) {
    const validated = exports.auditSchema.parse(audit);
    return await auditModel.create(validated);
}
/**
 * Adds audit finding.
 *
 * @param {typeof Model} auditModel - Audit model
 * @param {string} auditId - Audit ID
 * @param {AuditFinding} finding - Finding data
 * @returns {Promise<any>} Updated audit
 *
 * @example
 * await addAuditFinding(Audit, 'audit-123', {
 *   findingId: 'finding-1',
 *   severity: 'high',
 *   category: 'Access Control',
 *   title: 'Missing MFA',
 *   description: 'MFA not enabled for admin users',
 *   impact: 'Increased risk of unauthorized access',
 *   recommendation: 'Enable MFA for all administrative accounts',
 *   evidence: ['screenshot-1'],
 *   status: 'open'
 * });
 */
async function addAuditFinding(auditModel, auditId, finding) {
    const validated = exports.auditFindingSchema.parse(finding);
    const audit = await auditModel.findByPk(auditId);
    if (!audit) {
        throw new Error(`Audit ${auditId} not found`);
    }
    const findings = [...(audit.findings || []), validated];
    return await audit.update({ findings });
}
/**
 * Updates audit status.
 *
 * @param {typeof Model} auditModel - Audit model
 * @param {string} auditId - Audit ID
 * @param {'planned' | 'in_progress' | 'fieldwork' | 'reporting' | 'completed' | 'cancelled'} status - New status
 * @returns {Promise<any>} Updated audit
 *
 * @example
 * await updateAuditStatus(Audit, 'audit-123', 'in_progress');
 */
async function updateAuditStatus(auditModel, auditId, status) {
    const audit = await auditModel.findByPk(auditId);
    if (!audit) {
        throw new Error(`Audit ${auditId} not found`);
    }
    const updates = { status };
    if (status === 'completed' && !audit.completedDate) {
        updates.completedDate = new Date();
    }
    return await audit.update(updates);
}
/**
 * Gets audit findings by severity.
 *
 * @param {typeof Model} auditModel - Audit model
 * @param {string} auditId - Audit ID
 * @param {'low' | 'medium' | 'high' | 'critical'} severity - Severity level
 * @returns {Promise<AuditFinding[]>} Findings at severity level
 *
 * @example
 * const critical = await getAuditFindingsBySeverity(Audit, 'audit-123', 'critical');
 */
async function getAuditFindingsBySeverity(auditModel, auditId, severity) {
    const audit = await auditModel.findByPk(auditId);
    if (!audit) {
        throw new Error(`Audit ${auditId} not found`);
    }
    return (audit.findings || []).filter(f => f.severity === severity);
}
/**
 * Gets active audits for a framework.
 *
 * @param {typeof Model} auditModel - Audit model
 * @param {string} frameworkId - Framework ID
 * @returns {Promise<any[]>} Active audits
 *
 * @example
 * const active = await getActiveAudits(Audit, 'framework-123');
 */
async function getActiveAudits(auditModel, frameworkId) {
    return await auditModel.findAll({
        where: {
            frameworkId,
            status: { [sequelize_1.Op.in]: ['planned', 'in_progress', 'fieldwork', 'reporting'] },
        },
        order: [['startDate', 'ASC']],
    });
}
/**
 * Closes audit with report.
 *
 * @param {typeof Model} auditModel - Audit model
 * @param {string} auditId - Audit ID
 * @param {string} reportUrl - Report URL
 * @param {string[]} recommendations - Audit recommendations
 * @returns {Promise<any>} Closed audit
 *
 * @example
 * await closeAudit(Audit, 'audit-123', 'https://reports.com/audit-123', ['Implement MFA', 'Update policies']);
 */
async function closeAudit(auditModel, auditId, reportUrl, recommendations) {
    const audit = await auditModel.findByPk(auditId);
    if (!audit) {
        throw new Error(`Audit ${auditId} not found`);
    }
    return await audit.update({
        status: 'completed',
        completedDate: new Date(),
        reportDate: new Date(),
        reportUrl,
        recommendations,
    });
}
// ============================================================================
// GAP ANALYSIS UTILITIES (33-38)
// ============================================================================
/**
 * Identifies compliance gap.
 *
 * @param {typeof Model} gapModel - Gap model
 * @param {ComplianceGap} gap - Gap data
 * @returns {Promise<any>} Created gap
 *
 * @example
 * await identifyComplianceGap(ComplianceGap, {
 *   frameworkId: 'framework-123',
 *   gapType: 'control',
 *   severity: 'high',
 *   title: 'Missing MFA Implementation',
 *   description: 'MFA not implemented for administrative access',
 *   currentState: 'Single factor authentication only',
 *   requiredState: 'Multi-factor authentication required',
 *   impactedControls: ['CC6.1'],
 *   businessImpact: 'Increased security risk',
 *   identifiedDate: new Date(),
 *   status: 'identified'
 * });
 */
async function identifyComplianceGap(gapModel, gap) {
    const validated = exports.complianceGapSchema.parse(gap);
    return await gapModel.create(validated);
}
/**
 * Updates gap remediation status.
 *
 * @param {typeof Model} gapModel - Gap model
 * @param {string} gapId - Gap ID
 * @param {'identified' | 'planning' | 'in_progress' | 'resolved' | 'accepted'} status - New status
 * @returns {Promise<any>} Updated gap
 *
 * @example
 * await updateGapStatus(ComplianceGap, 'gap-123', 'in_progress');
 */
async function updateGapStatus(gapModel, gapId, status) {
    const gap = await gapModel.findByPk(gapId);
    if (!gap) {
        throw new Error(`Gap ${gapId} not found`);
    }
    const updates = { status };
    if (status === 'resolved' && !gap.resolvedDate) {
        updates.resolvedDate = new Date();
    }
    return await gap.update(updates);
}
/**
 * Gets critical gaps requiring immediate attention.
 *
 * @param {typeof Model} gapModel - Gap model
 * @param {string} frameworkId - Framework ID
 * @returns {Promise<any[]>} Critical gaps
 *
 * @example
 * const critical = await getCriticalGaps(ComplianceGap, 'framework-123');
 */
async function getCriticalGaps(gapModel, frameworkId) {
    return await gapModel.findAll({
        where: {
            frameworkId,
            severity: { [sequelize_1.Op.in]: ['high', 'critical'] },
            status: { [sequelize_1.Op.in]: ['identified', 'planning', 'in_progress'] },
        },
        order: [['severity', 'DESC'], ['identifiedDate', 'ASC']],
    });
}
/**
 * Generates gap analysis report.
 *
 * @param {typeof Model} gapModel - Gap model
 * @param {string} frameworkId - Framework ID
 * @returns {Promise<Record<string, any>>} Gap analysis summary
 *
 * @example
 * const report = await generateGapAnalysisReport(ComplianceGap, 'framework-123');
 */
async function generateGapAnalysisReport(gapModel, frameworkId) {
    const gaps = await gapModel.findAll({ where: { frameworkId } });
    return {
        totalGaps: gaps.length,
        bySeverity: {
            critical: gaps.filter(g => g.severity === 'critical').length,
            high: gaps.filter(g => g.severity === 'high').length,
            medium: gaps.filter(g => g.severity === 'medium').length,
            low: gaps.filter(g => g.severity === 'low').length,
        },
        byType: {
            control: gaps.filter(g => g.gapType === 'control').length,
            policy: gaps.filter(g => g.gapType === 'policy').length,
            process: gaps.filter(g => g.gapType === 'process').length,
            documentation: gaps.filter(g => g.gapType === 'documentation').length,
            technical: gaps.filter(g => g.gapType === 'technical').length,
        },
        byStatus: {
            identified: gaps.filter(g => g.status === 'identified').length,
            planning: gaps.filter(g => g.status === 'planning').length,
            inProgress: gaps.filter(g => g.status === 'in_progress').length,
            resolved: gaps.filter(g => g.status === 'resolved').length,
            accepted: gaps.filter(g => g.status === 'accepted').length,
        },
    };
}
/**
 * Gets gaps by type.
 *
 * @param {typeof Model} gapModel - Gap model
 * @param {string} frameworkId - Framework ID
 * @param {'control' | 'policy' | 'process' | 'documentation' | 'technical'} gapType - Gap type
 * @returns {Promise<any[]>} Gaps of specified type
 *
 * @example
 * const controlGaps = await getGapsByType(ComplianceGap, 'framework-123', 'control');
 */
async function getGapsByType(gapModel, frameworkId, gapType) {
    return await gapModel.findAll({
        where: { frameworkId, gapType },
        order: [['severity', 'DESC'], ['identifiedDate', 'ASC']],
    });
}
/**
 * Assigns gap for remediation.
 *
 * @param {typeof Model} gapModel - Gap model
 * @param {string} gapId - Gap ID
 * @param {string} assignedTo - User ID
 * @param {Date} targetDate - Target completion date
 * @param {string} remediationPlan - Remediation plan
 * @returns {Promise<any>} Updated gap
 *
 * @example
 * await assignGapRemediation(ComplianceGap, 'gap-123', 'user-456', new Date('2024-12-31'), 'Implement MFA');
 */
async function assignGapRemediation(gapModel, gapId, assignedTo, targetDate, remediationPlan) {
    const gap = await gapModel.findByPk(gapId);
    if (!gap) {
        throw new Error(`Gap ${gapId} not found`);
    }
    return await gap.update({
        assignedTo,
        targetDate,
        remediationPlan,
        status: 'planning',
    });
}
// ============================================================================
// CERTIFICATION MANAGEMENT UTILITIES (39-44)
// ============================================================================
/**
 * Registers a new certification.
 *
 * @param {typeof Model} certificationModel - Certification model
 * @param {Certification} certification - Certification data
 * @returns {Promise<any>} Created certification
 *
 * @example
 * await registerCertification(Certification, {
 *   frameworkId: 'framework-123',
 *   certificationType: 'SOC 2 Type II',
 *   certificationBody: 'AICPA',
 *   issueDate: new Date(),
 *   expirationDate: new Date('2025-12-31'),
 *   status: 'active',
 *   scope: ['All controls'],
 *   renewalRequired: true
 * });
 */
async function registerCertification(certificationModel, certification) {
    const validated = exports.certificationSchema.parse(certification);
    return await certificationModel.create(validated);
}
/**
 * Gets certifications expiring soon.
 *
 * @param {typeof Model} certificationModel - Certification model
 * @param {number} daysAhead - Days to look ahead
 * @returns {Promise<any[]>} Expiring certifications
 *
 * @example
 * const expiring = await getExpiringCertifications(Certification, 90);
 */
async function getExpiringCertifications(certificationModel, daysAhead = 90) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);
    return await certificationModel.findAll({
        where: {
            expirationDate: {
                [sequelize_1.Op.between]: [new Date(), futureDate],
            },
            status: 'active',
        },
        order: [['expirationDate', 'ASC']],
    });
}
/**
 * Updates certification status.
 *
 * @param {typeof Model} certificationModel - Certification model
 * @param {string} certificationId - Certification ID
 * @param {'active' | 'expiring_soon' | 'expired' | 'suspended' | 'revoked'} status - New status
 * @returns {Promise<any>} Updated certification
 *
 * @example
 * await updateCertificationStatus(Certification, 'cert-123', 'expiring_soon');
 */
async function updateCertificationStatus(certificationModel, certificationId, status) {
    const certification = await certificationModel.findByPk(certificationId);
    if (!certification) {
        throw new Error(`Certification ${certificationId} not found`);
    }
    return await certification.update({ status });
}
/**
 * Schedules certification renewal.
 *
 * @param {typeof Model} certificationModel - Certification model
 * @param {string} certificationId - Certification ID
 * @param {Date} renewalDate - Renewal date
 * @returns {Promise<any>} Updated certification
 *
 * @example
 * await scheduleCertificationRenewal(Certification, 'cert-123', new Date('2024-10-01'));
 */
async function scheduleCertificationRenewal(certificationModel, certificationId, renewalDate) {
    const certification = await certificationModel.findByPk(certificationId);
    if (!certification) {
        throw new Error(`Certification ${certificationId} not found`);
    }
    return await certification.update({ renewalDate });
}
/**
 * Gets active certifications for a framework.
 *
 * @param {typeof Model} certificationModel - Certification model
 * @param {string} frameworkId - Framework ID
 * @returns {Promise<any[]>} Active certifications
 *
 * @example
 * const certs = await getActiveCertifications(Certification, 'framework-123');
 */
async function getActiveCertifications(certificationModel, frameworkId) {
    return await certificationModel.findAll({
        where: {
            frameworkId,
            status: 'active',
        },
        order: [['expirationDate', 'ASC']],
    });
}
/**
 * Calculates certification coverage.
 *
 * @param {any[]} certifications - Active certifications
 * @param {any[]} frameworks - All frameworks
 * @returns {number} Coverage percentage
 *
 * @example
 * const coverage = calculateCertificationCoverage(certifications, frameworks);
 */
function calculateCertificationCoverage(certifications, frameworks) {
    if (frameworks.length === 0)
        return 0;
    const certifiedFrameworks = new Set(certifications
        .filter(c => c.status === 'active')
        .map(c => c.frameworkId));
    const certifiableFrameworks = frameworks.filter(f => f.certificationRequired).length;
    if (certifiableFrameworks === 0)
        return 100;
    return (certifiedFrameworks.size / certifiableFrameworks) * 100;
}
// ============================================================================
// REGULATORY & REPORTING UTILITIES (45-51)
// ============================================================================
/**
 * Tracks new regulatory requirement.
 *
 * @param {typeof Model} requirementModel - Regulatory requirement model (custom model)
 * @param {RegulatoryRequirement} requirement - Requirement data
 * @returns {Promise<any>} Created requirement
 *
 * @example
 * await trackRegulatoryRequirement(RegulatoryRequirement, {
 *   requirementId: 'HIPAA-164.308',
 *   regulatoryBody: 'HHS',
 *   regulationType: 'regulation',
 *   jurisdiction: 'USA',
 *   title: 'Administrative Safeguards',
 *   description: 'Implement administrative safeguards',
 *   effectiveDate: new Date(),
 *   applicability: ['Healthcare'],
 *   status: 'applicable',
 *   owner: 'user-123',
 *   relatedControls: ['control-456']
 * });
 */
async function trackRegulatoryRequirement(requirementModel, requirement) {
    return await requirementModel.create(requirement);
}
/**
 * Collects compliance evidence.
 *
 * @param {typeof Model} evidenceModel - Evidence model (custom model)
 * @param {Evidence} evidence - Evidence data
 * @returns {Promise<any>} Created evidence
 *
 * @example
 * await collectEvidence(Evidence, {
 *   evidenceType: 'document',
 *   title: 'Security Policy Document',
 *   description: 'Annual security policy review',
 *   relatedControlIds: ['control-123'],
 *   relatedAuditIds: ['audit-456'],
 *   collectedDate: new Date(),
 *   collectedBy: 'user-789',
 *   fileUrl: 'https://docs.com/policy.pdf',
 *   confidentialityLevel: 'internal',
 *   tags: ['policy', 'security']
 * });
 */
async function collectEvidence(evidenceModel, evidence) {
    // Calculate file hash if URL provided
    if (evidence.fileUrl && !evidence.fileHash) {
        evidence.fileHash = crypto
            .createHash('sha256')
            .update(evidence.fileUrl + evidence.collectedDate.toISOString())
            .digest('hex');
    }
    return await evidenceModel.create(evidence);
}
/**
 * Creates remediation plan for findings.
 *
 * @param {typeof Model} remediationModel - Remediation model (custom model)
 * @param {Remediation} remediation - Remediation data
 * @returns {Promise<any>} Created remediation plan
 *
 * @example
 * await createRemediationPlan(Remediation, {
 *   findingId: 'finding-123',
 *   title: 'Implement MFA',
 *   description: 'Enable multi-factor authentication for all users',
 *   priority: 'high',
 *   assignedTo: 'user-456',
 *   assignedDate: new Date(),
 *   dueDate: new Date('2024-12-31'),
 *   status: 'open',
 *   completionPercentage: 0,
 *   tasks: [],
 *   resources: ['IT Team', 'Security Team']
 * });
 */
async function createRemediationPlan(remediationModel, remediation) {
    return await remediationModel.create(remediation);
}
/**
 * Generates compliance report.
 *
 * @param {typeof Model} reportModel - Report model (custom model)
 * @param {typeof Model} frameworkModel - Framework model
 * @param {typeof Model} controlModel - Control model
 * @param {string} frameworkId - Framework ID
 * @param {string} reportingPeriod - Reporting period
 * @param {string} generatedBy - User generating report
 * @returns {Promise<any>} Generated report
 *
 * @example
 * const report = await generateComplianceReport(
 *   ComplianceReport,
 *   ComplianceFramework,
 *   ComplianceControl,
 *   'framework-123',
 *   '2024-Q1',
 *   'user-456'
 * );
 */
async function generateComplianceReport(reportModel, frameworkModel, controlModel, frameworkId, reportingPeriod, generatedBy) {
    const framework = await frameworkModel.findByPk(frameworkId);
    if (!framework) {
        throw new Error(`Framework ${frameworkId} not found`);
    }
    const controls = await controlModel.findAll({ where: { frameworkId } });
    const metrics = [
        {
            metricName: 'Control Implementation Rate',
            category: 'implementation',
            value: (controls.filter(c => c.status === 'implemented' || c.status === 'effective').length / controls.length) * 100,
            unit: 'percentage',
            target: 100,
            threshold: 80,
            trend: 'up',
            status: 'on_track',
        },
        {
            metricName: 'Control Effectiveness Rate',
            category: 'effectiveness',
            value: getControlEffectivenessRate(controls),
            unit: 'percentage',
            target: 95,
            threshold: 85,
            trend: 'up',
            status: 'on_track',
        },
    ];
    const summary = `Compliance report for ${framework.frameworkName} - ${reportingPeriod}. ` +
        `${controls.length} total controls, ` +
        `${controls.filter(c => c.status === 'effective').length} effective.`;
    return await reportModel.create({
        reportName: `${framework.frameworkName} Compliance Report - ${reportingPeriod}`,
        reportType: 'detailed',
        frameworkId,
        reportingPeriod,
        generatedDate: new Date(),
        generatedBy,
        recipients: framework.stakeholders || [],
        status: 'draft',
        metrics,
        summary,
        trends: [],
        recommendations: [],
        attachments: [],
    });
}
/**
 * Automates control testing.
 *
 * @param {typeof Model} controlModel - Control model
 * @param {string} controlId - Control ID
 * @param {() => Promise<boolean>} automationScript - Automation script to execute
 * @returns {Promise<TestResult>} Test result
 *
 * @example
 * const result = await automateControlTest(
 *   ComplianceControl,
 *   'control-123',
 *   async () => {
 *     // Automated test logic
 *     return true;
 *   }
 * );
 */
async function automateControlTest(controlModel, controlId, automationScript) {
    const control = await controlModel.findByPk(controlId);
    if (!control) {
        throw new Error(`Control ${controlId} not found`);
    }
    if (control.automationLevel === 'manual') {
        throw new Error(`Control ${controlId} is not configured for automation`);
    }
    const testDate = new Date();
    let result = 'fail';
    const findings = [];
    try {
        const scriptResult = await automationScript();
        result = scriptResult ? 'pass' : 'fail';
        if (!scriptResult) {
            findings.push('Automated test failed - control not operating as expected');
        }
    }
    catch (error) {
        findings.push(`Automation error: ${error.message}`);
    }
    const testResult = {
        testDate,
        tester: 'automated-system',
        testMethod: 'automated',
        result,
        findings,
        evidence: [`automated-test-${testDate.toISOString()}`],
        notes: `Automated test executed at ${testDate.toISOString()}`,
    };
    await performControlTest(controlModel, controlId, testResult);
    return testResult;
}
/**
 * Calculates compliance dashboard metrics.
 *
 * @param {typeof Model} frameworkModel - Framework model
 * @param {typeof Model} controlModel - Control model
 * @param {typeof Model} auditModel - Audit model
 * @param {typeof Model} gapModel - Gap model
 * @returns {Promise<Record<string, any>>} Dashboard metrics
 *
 * @example
 * const metrics = await getComplianceDashboard(
 *   ComplianceFramework,
 *   ComplianceControl,
 *   Audit,
 *   ComplianceGap
 * );
 */
async function getComplianceDashboard(frameworkModel, controlModel, auditModel, gapModel) {
    const frameworks = await frameworkModel.findAll();
    const controls = await controlModel.findAll();
    const audits = await auditModel.findAll({
        where: {
            status: { [sequelize_1.Op.in]: ['in_progress', 'fieldwork', 'reporting'] },
        },
    });
    const gaps = await gapModel.findAll({
        where: {
            status: { [sequelize_1.Op.in]: ['identified', 'planning', 'in_progress'] },
        },
    });
    return {
        summary: {
            totalFrameworks: frameworks.length,
            certifiedFrameworks: frameworks.filter(f => f.status === 'certified').length,
            totalControls: controls.length,
            effectiveControls: controls.filter(c => c.status === 'effective').length,
            activeAudits: audits.length,
            openGaps: gaps.length,
            criticalGaps: gaps.filter(g => g.severity === 'critical').length,
        },
        controlsByStatus: {
            notImplemented: controls.filter(c => c.status === 'not_implemented').length,
            inProgress: controls.filter(c => c.status === 'in_progress').length,
            implemented: controls.filter(c => c.status === 'implemented').length,
            effective: controls.filter(c => c.status === 'effective').length,
            ineffective: controls.filter(c => c.status === 'ineffective').length,
        },
        frameworksByType: frameworks.reduce((acc, f) => {
            acc[f.frameworkType] = (acc[f.frameworkType] || 0) + 1;
            return acc;
        }, {}),
        riskMetrics: {
            overallMaturity: calculateFrameworkMaturity(controls),
            effectivenessRate: getControlEffectivenessRate(controls),
            controlsDueForTesting: controls.filter(c => c.nextTestDate && c.nextTestDate <= new Date()).length,
        },
    };
}
/**
 * Monitors regulatory changes and updates.
 *
 * @param {typeof Model} requirementModel - Requirement model (custom model)
 * @param {string} jurisdiction - Jurisdiction to monitor
 * @param {Date} sinceDate - Monitor changes since date
 * @returns {Promise<any[]>} New or updated requirements
 *
 * @example
 * const changes = await monitorRegulatoryChanges(
 *   RegulatoryRequirement,
 *   'USA',
 *   new Date('2024-01-01')
 * );
 */
async function monitorRegulatoryChanges(requirementModel, jurisdiction, sinceDate) {
    return await requirementModel.findAll({
        where: {
            jurisdiction,
            [sequelize_1.Op.or]: [
                { createdAt: { [sequelize_1.Op.gte]: sinceDate } },
                { updatedAt: { [sequelize_1.Op.gte]: sinceDate } },
            ],
        },
        order: [['effectiveDate', 'DESC']],
    });
}
// ============================================================================
// SWAGGER DTOs
// ============================================================================
let CreateFrameworkDto = (() => {
    var _a;
    let _frameworkName_decorators;
    let _frameworkName_initializers = [];
    let _frameworkName_extraInitializers = [];
    let _frameworkType_decorators;
    let _frameworkType_initializers = [];
    let _frameworkType_extraInitializers = [];
    let _version_decorators;
    let _version_initializers = [];
    let _version_extraInitializers = [];
    let _certificationRequired_decorators;
    let _certificationRequired_initializers = [];
    let _certificationRequired_extraInitializers = [];
    let _auditFrequency_decorators;
    let _auditFrequency_initializers = [];
    let _auditFrequency_extraInitializers = [];
    let _owner_decorators;
    let _owner_initializers = [];
    let _owner_extraInitializers = [];
    let _stakeholders_decorators;
    let _stakeholders_initializers = [];
    let _stakeholders_extraInitializers = [];
    return _a = class CreateFrameworkDto {
            constructor() {
                this.frameworkName = __runInitializers(this, _frameworkName_initializers, void 0);
                this.frameworkType = (__runInitializers(this, _frameworkName_extraInitializers), __runInitializers(this, _frameworkType_initializers, void 0));
                this.version = (__runInitializers(this, _frameworkType_extraInitializers), __runInitializers(this, _version_initializers, void 0));
                this.certificationRequired = (__runInitializers(this, _version_extraInitializers), __runInitializers(this, _certificationRequired_initializers, void 0));
                this.auditFrequency = (__runInitializers(this, _certificationRequired_extraInitializers), __runInitializers(this, _auditFrequency_initializers, void 0));
                this.owner = (__runInitializers(this, _auditFrequency_extraInitializers), __runInitializers(this, _owner_initializers, void 0));
                this.stakeholders = (__runInitializers(this, _owner_extraInitializers), __runInitializers(this, _stakeholders_initializers, void 0));
                __runInitializers(this, _stakeholders_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _frameworkName_decorators = [(0, swagger_1.ApiProperty)({ example: 'SOC 2 Type II' })];
            _frameworkType_decorators = [(0, swagger_1.ApiProperty)({ enum: ['soc2', 'iso27001', 'nist', 'hipaa', 'gdpr', 'pci_dss', 'custom'] })];
            _version_decorators = [(0, swagger_1.ApiProperty)({ example: '2024' })];
            _certificationRequired_decorators = [(0, swagger_1.ApiProperty)()];
            _auditFrequency_decorators = [(0, swagger_1.ApiProperty)({ enum: ['monthly', 'quarterly', 'semi_annual', 'annual', 'biennial'] })];
            _owner_decorators = [(0, swagger_1.ApiProperty)()];
            _stakeholders_decorators = [(0, swagger_1.ApiProperty)({ type: [String] })];
            __esDecorate(null, null, _frameworkName_decorators, { kind: "field", name: "frameworkName", static: false, private: false, access: { has: obj => "frameworkName" in obj, get: obj => obj.frameworkName, set: (obj, value) => { obj.frameworkName = value; } }, metadata: _metadata }, _frameworkName_initializers, _frameworkName_extraInitializers);
            __esDecorate(null, null, _frameworkType_decorators, { kind: "field", name: "frameworkType", static: false, private: false, access: { has: obj => "frameworkType" in obj, get: obj => obj.frameworkType, set: (obj, value) => { obj.frameworkType = value; } }, metadata: _metadata }, _frameworkType_initializers, _frameworkType_extraInitializers);
            __esDecorate(null, null, _version_decorators, { kind: "field", name: "version", static: false, private: false, access: { has: obj => "version" in obj, get: obj => obj.version, set: (obj, value) => { obj.version = value; } }, metadata: _metadata }, _version_initializers, _version_extraInitializers);
            __esDecorate(null, null, _certificationRequired_decorators, { kind: "field", name: "certificationRequired", static: false, private: false, access: { has: obj => "certificationRequired" in obj, get: obj => obj.certificationRequired, set: (obj, value) => { obj.certificationRequired = value; } }, metadata: _metadata }, _certificationRequired_initializers, _certificationRequired_extraInitializers);
            __esDecorate(null, null, _auditFrequency_decorators, { kind: "field", name: "auditFrequency", static: false, private: false, access: { has: obj => "auditFrequency" in obj, get: obj => obj.auditFrequency, set: (obj, value) => { obj.auditFrequency = value; } }, metadata: _metadata }, _auditFrequency_initializers, _auditFrequency_extraInitializers);
            __esDecorate(null, null, _owner_decorators, { kind: "field", name: "owner", static: false, private: false, access: { has: obj => "owner" in obj, get: obj => obj.owner, set: (obj, value) => { obj.owner = value; } }, metadata: _metadata }, _owner_initializers, _owner_extraInitializers);
            __esDecorate(null, null, _stakeholders_decorators, { kind: "field", name: "stakeholders", static: false, private: false, access: { has: obj => "stakeholders" in obj, get: obj => obj.stakeholders, set: (obj, value) => { obj.stakeholders = value; } }, metadata: _metadata }, _stakeholders_initializers, _stakeholders_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateFrameworkDto = CreateFrameworkDto;
let CreateControlDto = (() => {
    var _a;
    let _frameworkId_decorators;
    let _frameworkId_initializers = [];
    let _frameworkId_extraInitializers = [];
    let _controlId_decorators;
    let _controlId_initializers = [];
    let _controlId_extraInitializers = [];
    let _controlName_decorators;
    let _controlName_initializers = [];
    let _controlName_extraInitializers = [];
    let _controlType_decorators;
    let _controlType_initializers = [];
    let _controlType_extraInitializers = [];
    let _domain_decorators;
    let _domain_initializers = [];
    let _domain_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _objective_decorators;
    let _objective_initializers = [];
    let _objective_extraInitializers = [];
    let _testingFrequency_decorators;
    let _testingFrequency_initializers = [];
    let _testingFrequency_extraInitializers = [];
    let _owner_decorators;
    let _owner_initializers = [];
    let _owner_extraInitializers = [];
    return _a = class CreateControlDto {
            constructor() {
                this.frameworkId = __runInitializers(this, _frameworkId_initializers, void 0);
                this.controlId = (__runInitializers(this, _frameworkId_extraInitializers), __runInitializers(this, _controlId_initializers, void 0));
                this.controlName = (__runInitializers(this, _controlId_extraInitializers), __runInitializers(this, _controlName_initializers, void 0));
                this.controlType = (__runInitializers(this, _controlName_extraInitializers), __runInitializers(this, _controlType_initializers, void 0));
                this.domain = (__runInitializers(this, _controlType_extraInitializers), __runInitializers(this, _domain_initializers, void 0));
                this.description = (__runInitializers(this, _domain_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.objective = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _objective_initializers, void 0));
                this.testingFrequency = (__runInitializers(this, _objective_extraInitializers), __runInitializers(this, _testingFrequency_initializers, void 0));
                this.owner = (__runInitializers(this, _testingFrequency_extraInitializers), __runInitializers(this, _owner_initializers, void 0));
                __runInitializers(this, _owner_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _frameworkId_decorators = [(0, swagger_1.ApiProperty)()];
            _controlId_decorators = [(0, swagger_1.ApiProperty)({ example: 'CC6.1' })];
            _controlName_decorators = [(0, swagger_1.ApiProperty)({ example: 'Logical Access Controls' })];
            _controlType_decorators = [(0, swagger_1.ApiProperty)({ enum: ['preventive', 'detective', 'corrective', 'directive'] })];
            _domain_decorators = [(0, swagger_1.ApiProperty)({ example: 'Access Control' })];
            _description_decorators = [(0, swagger_1.ApiProperty)()];
            _objective_decorators = [(0, swagger_1.ApiProperty)()];
            _testingFrequency_decorators = [(0, swagger_1.ApiProperty)({ enum: ['daily', 'weekly', 'monthly', 'quarterly', 'annual'] })];
            _owner_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _frameworkId_decorators, { kind: "field", name: "frameworkId", static: false, private: false, access: { has: obj => "frameworkId" in obj, get: obj => obj.frameworkId, set: (obj, value) => { obj.frameworkId = value; } }, metadata: _metadata }, _frameworkId_initializers, _frameworkId_extraInitializers);
            __esDecorate(null, null, _controlId_decorators, { kind: "field", name: "controlId", static: false, private: false, access: { has: obj => "controlId" in obj, get: obj => obj.controlId, set: (obj, value) => { obj.controlId = value; } }, metadata: _metadata }, _controlId_initializers, _controlId_extraInitializers);
            __esDecorate(null, null, _controlName_decorators, { kind: "field", name: "controlName", static: false, private: false, access: { has: obj => "controlName" in obj, get: obj => obj.controlName, set: (obj, value) => { obj.controlName = value; } }, metadata: _metadata }, _controlName_initializers, _controlName_extraInitializers);
            __esDecorate(null, null, _controlType_decorators, { kind: "field", name: "controlType", static: false, private: false, access: { has: obj => "controlType" in obj, get: obj => obj.controlType, set: (obj, value) => { obj.controlType = value; } }, metadata: _metadata }, _controlType_initializers, _controlType_extraInitializers);
            __esDecorate(null, null, _domain_decorators, { kind: "field", name: "domain", static: false, private: false, access: { has: obj => "domain" in obj, get: obj => obj.domain, set: (obj, value) => { obj.domain = value; } }, metadata: _metadata }, _domain_initializers, _domain_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _objective_decorators, { kind: "field", name: "objective", static: false, private: false, access: { has: obj => "objective" in obj, get: obj => obj.objective, set: (obj, value) => { obj.objective = value; } }, metadata: _metadata }, _objective_initializers, _objective_extraInitializers);
            __esDecorate(null, null, _testingFrequency_decorators, { kind: "field", name: "testingFrequency", static: false, private: false, access: { has: obj => "testingFrequency" in obj, get: obj => obj.testingFrequency, set: (obj, value) => { obj.testingFrequency = value; } }, metadata: _metadata }, _testingFrequency_initializers, _testingFrequency_extraInitializers);
            __esDecorate(null, null, _owner_decorators, { kind: "field", name: "owner", static: false, private: false, access: { has: obj => "owner" in obj, get: obj => obj.owner, set: (obj, value) => { obj.owner = value; } }, metadata: _metadata }, _owner_initializers, _owner_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateControlDto = CreateControlDto;
let CreateAuditDto = (() => {
    var _a;
    let _auditName_decorators;
    let _auditName_initializers = [];
    let _auditName_extraInitializers = [];
    let _auditType_decorators;
    let _auditType_initializers = [];
    let _auditType_extraInitializers = [];
    let _frameworkId_decorators;
    let _frameworkId_initializers = [];
    let _frameworkId_extraInitializers = [];
    let _scope_decorators;
    let _scope_initializers = [];
    let _scope_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _leadAuditor_decorators;
    let _leadAuditor_initializers = [];
    let _leadAuditor_extraInitializers = [];
    let _objectives_decorators;
    let _objectives_initializers = [];
    let _objectives_extraInitializers = [];
    return _a = class CreateAuditDto {
            constructor() {
                this.auditName = __runInitializers(this, _auditName_initializers, void 0);
                this.auditType = (__runInitializers(this, _auditName_extraInitializers), __runInitializers(this, _auditType_initializers, void 0));
                this.frameworkId = (__runInitializers(this, _auditType_extraInitializers), __runInitializers(this, _frameworkId_initializers, void 0));
                this.scope = (__runInitializers(this, _frameworkId_extraInitializers), __runInitializers(this, _scope_initializers, void 0));
                this.startDate = (__runInitializers(this, _scope_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.leadAuditor = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _leadAuditor_initializers, void 0));
                this.objectives = (__runInitializers(this, _leadAuditor_extraInitializers), __runInitializers(this, _objectives_initializers, void 0));
                __runInitializers(this, _objectives_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _auditName_decorators = [(0, swagger_1.ApiProperty)({ example: 'SOC 2 Type II Audit 2024' })];
            _auditType_decorators = [(0, swagger_1.ApiProperty)({ enum: ['internal', 'external', 'certification', 'surveillance', 'special'] })];
            _frameworkId_decorators = [(0, swagger_1.ApiProperty)()];
            _scope_decorators = [(0, swagger_1.ApiProperty)({ type: [String] })];
            _startDate_decorators = [(0, swagger_1.ApiProperty)()];
            _leadAuditor_decorators = [(0, swagger_1.ApiProperty)()];
            _objectives_decorators = [(0, swagger_1.ApiProperty)({ type: [String] })];
            __esDecorate(null, null, _auditName_decorators, { kind: "field", name: "auditName", static: false, private: false, access: { has: obj => "auditName" in obj, get: obj => obj.auditName, set: (obj, value) => { obj.auditName = value; } }, metadata: _metadata }, _auditName_initializers, _auditName_extraInitializers);
            __esDecorate(null, null, _auditType_decorators, { kind: "field", name: "auditType", static: false, private: false, access: { has: obj => "auditType" in obj, get: obj => obj.auditType, set: (obj, value) => { obj.auditType = value; } }, metadata: _metadata }, _auditType_initializers, _auditType_extraInitializers);
            __esDecorate(null, null, _frameworkId_decorators, { kind: "field", name: "frameworkId", static: false, private: false, access: { has: obj => "frameworkId" in obj, get: obj => obj.frameworkId, set: (obj, value) => { obj.frameworkId = value; } }, metadata: _metadata }, _frameworkId_initializers, _frameworkId_extraInitializers);
            __esDecorate(null, null, _scope_decorators, { kind: "field", name: "scope", static: false, private: false, access: { has: obj => "scope" in obj, get: obj => obj.scope, set: (obj, value) => { obj.scope = value; } }, metadata: _metadata }, _scope_initializers, _scope_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _leadAuditor_decorators, { kind: "field", name: "leadAuditor", static: false, private: false, access: { has: obj => "leadAuditor" in obj, get: obj => obj.leadAuditor, set: (obj, value) => { obj.leadAuditor = value; } }, metadata: _metadata }, _leadAuditor_initializers, _leadAuditor_extraInitializers);
            __esDecorate(null, null, _objectives_decorators, { kind: "field", name: "objectives", static: false, private: false, access: { has: obj => "objectives" in obj, get: obj => obj.objectives, set: (obj, value) => { obj.objectives = value; } }, metadata: _metadata }, _objectives_initializers, _objectives_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateAuditDto = CreateAuditDto;
let CreateGapDto = (() => {
    var _a;
    let _frameworkId_decorators;
    let _frameworkId_initializers = [];
    let _frameworkId_extraInitializers = [];
    let _gapType_decorators;
    let _gapType_initializers = [];
    let _gapType_extraInitializers = [];
    let _severity_decorators;
    let _severity_initializers = [];
    let _severity_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _currentState_decorators;
    let _currentState_initializers = [];
    let _currentState_extraInitializers = [];
    let _requiredState_decorators;
    let _requiredState_initializers = [];
    let _requiredState_extraInitializers = [];
    let _impactedControls_decorators;
    let _impactedControls_initializers = [];
    let _impactedControls_extraInitializers = [];
    let _businessImpact_decorators;
    let _businessImpact_initializers = [];
    let _businessImpact_extraInitializers = [];
    return _a = class CreateGapDto {
            constructor() {
                this.frameworkId = __runInitializers(this, _frameworkId_initializers, void 0);
                this.gapType = (__runInitializers(this, _frameworkId_extraInitializers), __runInitializers(this, _gapType_initializers, void 0));
                this.severity = (__runInitializers(this, _gapType_extraInitializers), __runInitializers(this, _severity_initializers, void 0));
                this.title = (__runInitializers(this, _severity_extraInitializers), __runInitializers(this, _title_initializers, void 0));
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.currentState = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _currentState_initializers, void 0));
                this.requiredState = (__runInitializers(this, _currentState_extraInitializers), __runInitializers(this, _requiredState_initializers, void 0));
                this.impactedControls = (__runInitializers(this, _requiredState_extraInitializers), __runInitializers(this, _impactedControls_initializers, void 0));
                this.businessImpact = (__runInitializers(this, _impactedControls_extraInitializers), __runInitializers(this, _businessImpact_initializers, void 0));
                __runInitializers(this, _businessImpact_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _frameworkId_decorators = [(0, swagger_1.ApiProperty)()];
            _gapType_decorators = [(0, swagger_1.ApiProperty)({ enum: ['control', 'policy', 'process', 'documentation', 'technical'] })];
            _severity_decorators = [(0, swagger_1.ApiProperty)({ enum: ['low', 'medium', 'high', 'critical'] })];
            _title_decorators = [(0, swagger_1.ApiProperty)()];
            _description_decorators = [(0, swagger_1.ApiProperty)()];
            _currentState_decorators = [(0, swagger_1.ApiProperty)()];
            _requiredState_decorators = [(0, swagger_1.ApiProperty)()];
            _impactedControls_decorators = [(0, swagger_1.ApiProperty)({ type: [String] })];
            _businessImpact_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _frameworkId_decorators, { kind: "field", name: "frameworkId", static: false, private: false, access: { has: obj => "frameworkId" in obj, get: obj => obj.frameworkId, set: (obj, value) => { obj.frameworkId = value; } }, metadata: _metadata }, _frameworkId_initializers, _frameworkId_extraInitializers);
            __esDecorate(null, null, _gapType_decorators, { kind: "field", name: "gapType", static: false, private: false, access: { has: obj => "gapType" in obj, get: obj => obj.gapType, set: (obj, value) => { obj.gapType = value; } }, metadata: _metadata }, _gapType_initializers, _gapType_extraInitializers);
            __esDecorate(null, null, _severity_decorators, { kind: "field", name: "severity", static: false, private: false, access: { has: obj => "severity" in obj, get: obj => obj.severity, set: (obj, value) => { obj.severity = value; } }, metadata: _metadata }, _severity_initializers, _severity_extraInitializers);
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _currentState_decorators, { kind: "field", name: "currentState", static: false, private: false, access: { has: obj => "currentState" in obj, get: obj => obj.currentState, set: (obj, value) => { obj.currentState = value; } }, metadata: _metadata }, _currentState_initializers, _currentState_extraInitializers);
            __esDecorate(null, null, _requiredState_decorators, { kind: "field", name: "requiredState", static: false, private: false, access: { has: obj => "requiredState" in obj, get: obj => obj.requiredState, set: (obj, value) => { obj.requiredState = value; } }, metadata: _metadata }, _requiredState_initializers, _requiredState_extraInitializers);
            __esDecorate(null, null, _impactedControls_decorators, { kind: "field", name: "impactedControls", static: false, private: false, access: { has: obj => "impactedControls" in obj, get: obj => obj.impactedControls, set: (obj, value) => { obj.impactedControls = value; } }, metadata: _metadata }, _impactedControls_initializers, _impactedControls_extraInitializers);
            __esDecorate(null, null, _businessImpact_decorators, { kind: "field", name: "businessImpact", static: false, private: false, access: { has: obj => "businessImpact" in obj, get: obj => obj.businessImpact, set: (obj, value) => { obj.businessImpact = value; } }, metadata: _metadata }, _businessImpact_initializers, _businessImpact_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateGapDto = CreateGapDto;
let CreateCertificationDto = (() => {
    var _a;
    let _frameworkId_decorators;
    let _frameworkId_initializers = [];
    let _frameworkId_extraInitializers = [];
    let _certificationType_decorators;
    let _certificationType_initializers = [];
    let _certificationType_extraInitializers = [];
    let _certificationBody_decorators;
    let _certificationBody_initializers = [];
    let _certificationBody_extraInitializers = [];
    let _issueDate_decorators;
    let _issueDate_initializers = [];
    let _issueDate_extraInitializers = [];
    let _expirationDate_decorators;
    let _expirationDate_initializers = [];
    let _expirationDate_extraInitializers = [];
    let _scope_decorators;
    let _scope_initializers = [];
    let _scope_extraInitializers = [];
    let _renewalRequired_decorators;
    let _renewalRequired_initializers = [];
    let _renewalRequired_extraInitializers = [];
    return _a = class CreateCertificationDto {
            constructor() {
                this.frameworkId = __runInitializers(this, _frameworkId_initializers, void 0);
                this.certificationType = (__runInitializers(this, _frameworkId_extraInitializers), __runInitializers(this, _certificationType_initializers, void 0));
                this.certificationBody = (__runInitializers(this, _certificationType_extraInitializers), __runInitializers(this, _certificationBody_initializers, void 0));
                this.issueDate = (__runInitializers(this, _certificationBody_extraInitializers), __runInitializers(this, _issueDate_initializers, void 0));
                this.expirationDate = (__runInitializers(this, _issueDate_extraInitializers), __runInitializers(this, _expirationDate_initializers, void 0));
                this.scope = (__runInitializers(this, _expirationDate_extraInitializers), __runInitializers(this, _scope_initializers, void 0));
                this.renewalRequired = (__runInitializers(this, _scope_extraInitializers), __runInitializers(this, _renewalRequired_initializers, void 0));
                __runInitializers(this, _renewalRequired_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _frameworkId_decorators = [(0, swagger_1.ApiProperty)()];
            _certificationType_decorators = [(0, swagger_1.ApiProperty)()];
            _certificationBody_decorators = [(0, swagger_1.ApiProperty)()];
            _issueDate_decorators = [(0, swagger_1.ApiProperty)()];
            _expirationDate_decorators = [(0, swagger_1.ApiProperty)()];
            _scope_decorators = [(0, swagger_1.ApiProperty)({ type: [String] })];
            _renewalRequired_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _frameworkId_decorators, { kind: "field", name: "frameworkId", static: false, private: false, access: { has: obj => "frameworkId" in obj, get: obj => obj.frameworkId, set: (obj, value) => { obj.frameworkId = value; } }, metadata: _metadata }, _frameworkId_initializers, _frameworkId_extraInitializers);
            __esDecorate(null, null, _certificationType_decorators, { kind: "field", name: "certificationType", static: false, private: false, access: { has: obj => "certificationType" in obj, get: obj => obj.certificationType, set: (obj, value) => { obj.certificationType = value; } }, metadata: _metadata }, _certificationType_initializers, _certificationType_extraInitializers);
            __esDecorate(null, null, _certificationBody_decorators, { kind: "field", name: "certificationBody", static: false, private: false, access: { has: obj => "certificationBody" in obj, get: obj => obj.certificationBody, set: (obj, value) => { obj.certificationBody = value; } }, metadata: _metadata }, _certificationBody_initializers, _certificationBody_extraInitializers);
            __esDecorate(null, null, _issueDate_decorators, { kind: "field", name: "issueDate", static: false, private: false, access: { has: obj => "issueDate" in obj, get: obj => obj.issueDate, set: (obj, value) => { obj.issueDate = value; } }, metadata: _metadata }, _issueDate_initializers, _issueDate_extraInitializers);
            __esDecorate(null, null, _expirationDate_decorators, { kind: "field", name: "expirationDate", static: false, private: false, access: { has: obj => "expirationDate" in obj, get: obj => obj.expirationDate, set: (obj, value) => { obj.expirationDate = value; } }, metadata: _metadata }, _expirationDate_initializers, _expirationDate_extraInitializers);
            __esDecorate(null, null, _scope_decorators, { kind: "field", name: "scope", static: false, private: false, access: { has: obj => "scope" in obj, get: obj => obj.scope, set: (obj, value) => { obj.scope = value; } }, metadata: _metadata }, _scope_initializers, _scope_extraInitializers);
            __esDecorate(null, null, _renewalRequired_decorators, { kind: "field", name: "renewalRequired", static: false, private: false, access: { has: obj => "renewalRequired" in obj, get: obj => obj.renewalRequired, set: (obj, value) => { obj.renewalRequired = value; } }, metadata: _metadata }, _renewalRequired_initializers, _renewalRequired_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateCertificationDto = CreateCertificationDto;
//# sourceMappingURL=compliance-monitoring-kit.js.map