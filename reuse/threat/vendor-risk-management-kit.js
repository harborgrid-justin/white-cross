"use strict";
/**
 * LOC: VNDRISK7890123
 * File: /reuse/threat/vendor-risk-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS vendor management services
 *   - Third-party risk assessment modules
 *   - Vendor security monitoring
 *   - Due diligence workflows
 *   - Contract security compliance
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateIncidentDto = exports.CreateRiskAssessmentDto = exports.CreateVendorDto = exports.vendorScorecardSchema = exports.vendorIncidentSchema = exports.securityQuestionnaireSchema = exports.riskAssessmentSchema = exports.vendorProfileSchema = void 0;
exports.defineVendorProfileModel = defineVendorProfileModel;
exports.defineVendorRiskAssessmentModel = defineVendorRiskAssessmentModel;
exports.defineSecurityQuestionnaireModel = defineSecurityQuestionnaireModel;
exports.defineVendorIncidentModel = defineVendorIncidentModel;
exports.defineVendorScorecardModel = defineVendorScorecardModel;
exports.createVendorProfile = createVendorProfile;
exports.updateVendorProfile = updateVendorProfile;
exports.getVendorProfile = getVendorProfile;
exports.listVendors = listVendors;
exports.archiveVendor = archiveVendor;
exports.getVendorsByCriticality = getVendorsByCriticality;
exports.createRiskAssessment = createRiskAssessment;
exports.calculateOverallRiskScore = calculateOverallRiskScore;
exports.determineRiskLevel = determineRiskLevel;
exports.getLatestAssessment = getLatestAssessment;
exports.getRiskAssessmentHistory = getRiskAssessmentHistory;
exports.approveRiskAssessment = approveRiskAssessment;
exports.createSecurityQuestionnaire = createSecurityQuestionnaire;
exports.addQuestions = addQuestions;
exports.scoreQuestionnaire = scoreQuestionnaire;
exports.identifyQuestionnaireGaps = identifyQuestionnaireGaps;
exports.getOverdueQuestionnaires = getOverdueQuestionnaires;
exports.recordVendorIncident = recordVendorIncident;
exports.updateIncidentStatus = updateIncidentStatus;
exports.getCriticalIncidents = getCriticalIncidents;
exports.getIncidentStats = getIncidentStats;
exports.closeIncident = closeIncident;
exports.generateVendorScorecard = generateVendorScorecard;
exports.calculateScorecardMetrics = calculateScorecardMetrics;
exports.determineTrend = determineTrend;
exports.compareToBenchmark = compareToBenchmark;
exports.getLatestScorecard = getLatestScorecard;
exports.getScorecardHistory = getScorecardHistory;
exports.createDueDiligence = createDueDiligence;
exports.validateContractSecurity = validateContractSecurity;
exports.scheduleVendorMonitoring = scheduleVendorMonitoring;
exports.onboardVendor = onboardVendor;
exports.offboardVendor = offboardVendor;
const sequelize_1 = require("sequelize");
const zod_1 = require("zod");
const swagger_1 = require("@nestjs/swagger");
// ============================================================================
// SEQUELIZE MODELS (1-5)
// ============================================================================
/**
 * Sequelize model for Vendor Profiles with comprehensive tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} VendorProfile model
 *
 * @example
 * const VendorProfile = defineVendorProfileModel(sequelize);
 * await VendorProfile.create({
 *   vendorName: 'Acme Cloud Services',
 *   vendorType: 'saas',
 *   primaryContact: 'John Doe',
 *   contactEmail: 'john@acme.com',
 *   criticalityLevel: 'high',
 *   status: 'active'
 * });
 */
function defineVendorProfileModel(sequelize) {
    class VendorProfile extends sequelize_1.Model {
    }
    VendorProfile.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        vendorName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            field: 'vendor_name',
            validate: {
                notEmpty: true,
                len: [2, 255],
            },
        },
        vendorType: {
            type: sequelize_1.DataTypes.ENUM('saas', 'infrastructure', 'consulting', 'hardware', 'other'),
            allowNull: false,
            field: 'vendor_type',
        },
        website: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: true,
            validate: {
                isUrl: true,
            },
        },
        primaryContact: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            field: 'primary_contact',
        },
        contactEmail: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            field: 'contact_email',
            validate: {
                isEmail: true,
            },
        },
        contactPhone: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            field: 'contact_phone',
        },
        businessAddress: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            field: 'business_address',
        },
        taxId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            field: 'tax_id',
        },
        dunsNumber: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: true,
            field: 'duns_number',
        },
        yearEstablished: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            field: 'year_established',
            validate: {
                min: 1800,
                max: new Date().getFullYear(),
            },
        },
        employeeCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            field: 'employee_count',
            validate: {
                min: 0,
            },
        },
        annualRevenue: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: true,
            field: 'annual_revenue',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        servicesProvided: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: false,
            defaultValue: [],
            field: 'services_provided',
        },
        dataAccess: {
            type: sequelize_1.DataTypes.ENUM('none', 'limited', 'full', 'administrative'),
            allowNull: false,
            defaultValue: 'none',
            field: 'data_access',
        },
        criticalityLevel: {
            type: sequelize_1.DataTypes.ENUM('low', 'medium', 'high', 'critical'),
            allowNull: false,
            defaultValue: 'medium',
            field: 'criticality_level',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('prospect', 'active', 'suspended', 'terminated'),
            allowNull: false,
            defaultValue: 'prospect',
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
        tableName: 'vendor_profiles',
        timestamps: true,
        indexes: [
            { fields: ['vendor_name'] },
            { fields: ['vendor_type'] },
            { fields: ['status'] },
            { fields: ['criticality_level'] },
            { fields: ['contact_email'] },
        ],
    });
    return VendorProfile;
}
/**
 * Sequelize model for Vendor Risk Assessments.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} VendorRiskAssessment model
 *
 * @example
 * const VendorRiskAssessment = defineVendorRiskAssessmentModel(sequelize);
 * await VendorRiskAssessment.create({
 *   vendorId: 'vendor-123',
 *   assessmentDate: new Date(),
 *   assessmentType: 'annual',
 *   assessedBy: 'user-456',
 *   overallRiskScore: 75,
 *   riskLevel: 'medium'
 * });
 */
function defineVendorRiskAssessmentModel(sequelize) {
    class VendorRiskAssessment extends sequelize_1.Model {
    }
    VendorRiskAssessment.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        vendorId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            field: 'vendor_id',
            references: {
                model: 'vendor_profiles',
                key: 'id',
            },
        },
        assessmentDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            field: 'assessment_date',
        },
        assessmentType: {
            type: sequelize_1.DataTypes.ENUM('initial', 'annual', 'ongoing', 'incident_triggered'),
            allowNull: false,
            field: 'assessment_type',
        },
        assessedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            field: 'assessed_by',
        },
        overallRiskScore: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            field: 'overall_risk_score',
            validate: {
                min: 0,
                max: 100,
            },
        },
        riskLevel: {
            type: sequelize_1.DataTypes.ENUM('low', 'medium', 'high', 'critical'),
            allowNull: false,
            field: 'risk_level',
        },
        securityScore: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0,
            field: 'security_score',
            validate: {
                min: 0,
                max: 100,
            },
        },
        privacyScore: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0,
            field: 'privacy_score',
            validate: {
                min: 0,
                max: 100,
            },
        },
        complianceScore: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0,
            field: 'compliance_score',
            validate: {
                min: 0,
                max: 100,
            },
        },
        financialScore: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0,
            field: 'financial_score',
            validate: {
                min: 0,
                max: 100,
            },
        },
        operationalScore: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0,
            field: 'operational_score',
            validate: {
                min: 0,
                max: 100,
            },
        },
        findings: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.TEXT),
            allowNull: false,
            defaultValue: [],
        },
        recommendations: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.TEXT),
            allowNull: false,
            defaultValue: [],
        },
        nextReviewDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'next_review_date',
        },
        approvalStatus: {
            type: sequelize_1.DataTypes.ENUM('pending', 'approved', 'rejected', 'remediation_required'),
            allowNull: false,
            defaultValue: 'pending',
            field: 'approval_status',
        },
        approvedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            field: 'approved_by',
        },
        approvedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'approved_at',
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
        tableName: 'vendor_risk_assessments',
        timestamps: true,
        indexes: [
            { fields: ['vendor_id'] },
            { fields: ['assessment_type'] },
            { fields: ['risk_level'] },
            { fields: ['approval_status'] },
            { fields: ['assessment_date'] },
        ],
    });
    return VendorRiskAssessment;
}
/**
 * Sequelize model for Security Questionnaires.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} SecurityQuestionnaire model
 *
 * @example
 * const SecurityQuestionnaire = defineSecurityQuestionnaireModel(sequelize);
 * await SecurityQuestionnaire.create({
 *   vendorId: 'vendor-123',
 *   questionnaireType: 'soc2',
 *   version: '2024.1',
 *   sentDate: new Date(),
 *   status: 'sent'
 * });
 */
function defineSecurityQuestionnaireModel(sequelize) {
    class SecurityQuestionnaire extends sequelize_1.Model {
    }
    SecurityQuestionnaire.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        vendorId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            field: 'vendor_id',
            references: {
                model: 'vendor_profiles',
                key: 'id',
            },
        },
        questionnaireType: {
            type: sequelize_1.DataTypes.ENUM('soc2', 'iso27001', 'hipaa', 'custom'),
            allowNull: false,
            field: 'questionnaire_type',
        },
        version: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
        },
        sentDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            field: 'sent_date',
        },
        dueDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'due_date',
        },
        completedDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'completed_date',
        },
        completedBy: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
            field: 'completed_by',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('draft', 'sent', 'in_progress', 'completed', 'expired'),
            allowNull: false,
            defaultValue: 'draft',
        },
        questions: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: [],
        },
        overallScore: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: true,
            field: 'overall_score',
            validate: {
                min: 0,
                max: 100,
            },
        },
        gaps: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.TEXT),
            allowNull: false,
            defaultValue: [],
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
        tableName: 'security_questionnaires',
        timestamps: true,
        indexes: [
            { fields: ['vendor_id'] },
            { fields: ['questionnaire_type'] },
            { fields: ['status'] },
            { fields: ['sent_date'] },
            { fields: ['due_date'] },
        ],
    });
    return SecurityQuestionnaire;
}
/**
 * Sequelize model for Vendor Incidents.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} VendorIncident model
 *
 * @example
 * const VendorIncident = defineVendorIncidentModel(sequelize);
 * await VendorIncident.create({
 *   vendorId: 'vendor-123',
 *   incidentDate: new Date(),
 *   reportedDate: new Date(),
 *   reportedBy: 'user-456',
 *   incidentType: 'security_breach',
 *   severity: 'high'
 * });
 */
function defineVendorIncidentModel(sequelize) {
    class VendorIncident extends sequelize_1.Model {
    }
    VendorIncident.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        vendorId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            field: 'vendor_id',
            references: {
                model: 'vendor_profiles',
                key: 'id',
            },
        },
        incidentDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            field: 'incident_date',
        },
        reportedDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            field: 'reported_date',
        },
        reportedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            field: 'reported_by',
        },
        incidentType: {
            type: sequelize_1.DataTypes.ENUM('security_breach', 'data_loss', 'service_outage', 'compliance_violation', 'other'),
            allowNull: false,
            field: 'incident_type',
        },
        severity: {
            type: sequelize_1.DataTypes.ENUM('low', 'medium', 'high', 'critical'),
            allowNull: false,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        impact: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        affectedSystems: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: false,
            defaultValue: [],
            field: 'affected_systems',
        },
        affectedDataTypes: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: false,
            defaultValue: [],
            field: 'affected_data_types',
        },
        recordsAffected: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            field: 'records_affected',
        },
        rootCause: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            field: 'root_cause',
        },
        vendorResponse: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            field: 'vendor_response',
        },
        remediationSteps: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.TEXT),
            allowNull: false,
            defaultValue: [],
            field: 'remediation_steps',
        },
        remediationStatus: {
            type: sequelize_1.DataTypes.ENUM('pending', 'in_progress', 'completed', 'verified'),
            allowNull: false,
            defaultValue: 'pending',
            field: 'remediation_status',
        },
        lessonsLearned: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            field: 'lessons_learned',
        },
        closedDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'closed_date',
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
        tableName: 'vendor_incidents',
        timestamps: true,
        indexes: [
            { fields: ['vendor_id'] },
            { fields: ['incident_type'] },
            { fields: ['severity'] },
            { fields: ['remediation_status'] },
            { fields: ['incident_date'] },
        ],
    });
    return VendorIncident;
}
/**
 * Sequelize model for Vendor Scorecards.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} VendorScorecard model
 *
 * @example
 * const VendorScorecard = defineVendorScorecardModel(sequelize);
 * await VendorScorecard.create({
 *   vendorId: 'vendor-123',
 *   scoringPeriod: '2024-Q1',
 *   calculatedDate: new Date(),
 *   overallScore: 85,
 *   trend: 'improving'
 * });
 */
function defineVendorScorecardModel(sequelize) {
    class VendorScorecard extends sequelize_1.Model {
    }
    VendorScorecard.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        vendorId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            field: 'vendor_id',
            references: {
                model: 'vendor_profiles',
                key: 'id',
            },
        },
        scoringPeriod: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            field: 'scoring_period',
        },
        calculatedDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            field: 'calculated_date',
        },
        overallScore: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            field: 'overall_score',
            validate: {
                min: 0,
                max: 100,
            },
        },
        performanceMetrics: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: [],
            field: 'performance_metrics',
        },
        securityMetrics: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: [],
            field: 'security_metrics',
        },
        complianceMetrics: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: [],
            field: 'compliance_metrics',
        },
        financialMetrics: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: [],
            field: 'financial_metrics',
        },
        trend: {
            type: sequelize_1.DataTypes.ENUM('improving', 'stable', 'declining'),
            allowNull: false,
            defaultValue: 'stable',
        },
        benchmarkComparison: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: true,
            field: 'benchmark_comparison',
        },
        recommendations: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.TEXT),
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
        tableName: 'vendor_scorecards',
        timestamps: true,
        indexes: [
            { fields: ['vendor_id'] },
            { fields: ['scoring_period'] },
            { fields: ['calculated_date'] },
            { fields: ['trend'] },
        ],
    });
    return VendorScorecard;
}
// ============================================================================
// ZOD SCHEMAS (6-10)
// ============================================================================
/**
 * Zod schema for vendor profile validation.
 */
exports.vendorProfileSchema = zod_1.z.object({
    vendorName: zod_1.z.string().min(2).max(255),
    vendorType: zod_1.z.enum(['saas', 'infrastructure', 'consulting', 'hardware', 'other']),
    website: zod_1.z.string().url().optional(),
    primaryContact: zod_1.z.string().min(1).max(255),
    contactEmail: zod_1.z.string().email(),
    contactPhone: zod_1.z.string().max(50).optional(),
    servicesProvided: zod_1.z.array(zod_1.z.string()),
    dataAccess: zod_1.z.enum(['none', 'limited', 'full', 'administrative']),
    criticalityLevel: zod_1.z.enum(['low', 'medium', 'high', 'critical']),
    status: zod_1.z.enum(['prospect', 'active', 'suspended', 'terminated']),
});
/**
 * Zod schema for risk assessment validation.
 */
exports.riskAssessmentSchema = zod_1.z.object({
    vendorId: zod_1.z.string().uuid(),
    assessmentType: zod_1.z.enum(['initial', 'annual', 'ongoing', 'incident_triggered']),
    assessedBy: zod_1.z.string().uuid(),
    overallRiskScore: zod_1.z.number().min(0).max(100),
    riskLevel: zod_1.z.enum(['low', 'medium', 'high', 'critical']),
    securityScore: zod_1.z.number().min(0).max(100),
    privacyScore: zod_1.z.number().min(0).max(100),
    complianceScore: zod_1.z.number().min(0).max(100),
    financialScore: zod_1.z.number().min(0).max(100),
    operationalScore: zod_1.z.number().min(0).max(100),
    findings: zod_1.z.array(zod_1.z.string()),
    recommendations: zod_1.z.array(zod_1.z.string()),
});
/**
 * Zod schema for security questionnaire validation.
 */
exports.securityQuestionnaireSchema = zod_1.z.object({
    vendorId: zod_1.z.string().uuid(),
    questionnaireType: zod_1.z.enum(['soc2', 'iso27001', 'hipaa', 'custom']),
    version: zod_1.z.string().min(1).max(50),
    dueDate: zod_1.z.date().optional(),
    status: zod_1.z.enum(['draft', 'sent', 'in_progress', 'completed', 'expired']),
});
/**
 * Zod schema for vendor incident validation.
 */
exports.vendorIncidentSchema = zod_1.z.object({
    vendorId: zod_1.z.string().uuid(),
    incidentDate: zod_1.z.date(),
    reportedBy: zod_1.z.string().uuid(),
    incidentType: zod_1.z.enum(['security_breach', 'data_loss', 'service_outage', 'compliance_violation', 'other']),
    severity: zod_1.z.enum(['low', 'medium', 'high', 'critical']),
    description: zod_1.z.string().min(10),
    impact: zod_1.z.string().min(10),
    affectedSystems: zod_1.z.array(zod_1.z.string()),
    affectedDataTypes: zod_1.z.array(zod_1.z.string()),
});
/**
 * Zod schema for vendor scorecard validation.
 */
exports.vendorScorecardSchema = zod_1.z.object({
    vendorId: zod_1.z.string().uuid(),
    scoringPeriod: zod_1.z.string().min(1).max(50),
    overallScore: zod_1.z.number().min(0).max(100),
    trend: zod_1.z.enum(['improving', 'stable', 'declining']),
});
// ============================================================================
// VENDOR PROFILE UTILITIES (11-16)
// ============================================================================
/**
 * Creates a new vendor profile.
 *
 * @param {typeof Model} vendorModel - Vendor profile model
 * @param {VendorProfile} profile - Vendor profile data
 * @returns {Promise<any>} Created vendor profile
 *
 * @example
 * await createVendorProfile(VendorProfile, {
 *   vendorName: 'Acme Cloud Services',
 *   vendorType: 'saas',
 *   primaryContact: 'John Doe',
 *   contactEmail: 'john@acme.com',
 *   servicesProvided: ['Cloud Storage', 'Computing'],
 *   dataAccess: 'limited',
 *   criticalityLevel: 'high',
 *   status: 'active'
 * });
 */
async function createVendorProfile(vendorModel, profile) {
    const validated = exports.vendorProfileSchema.parse(profile);
    return await vendorModel.create(validated);
}
/**
 * Updates vendor profile information.
 *
 * @param {typeof Model} vendorModel - Vendor profile model
 * @param {string} vendorId - Vendor ID
 * @param {Partial<VendorProfile>} updates - Profile updates
 * @returns {Promise<any>} Updated vendor profile
 *
 * @example
 * await updateVendorProfile(VendorProfile, 'vendor-123', {
 *   status: 'suspended',
 *   criticalityLevel: 'critical'
 * });
 */
async function updateVendorProfile(vendorModel, vendorId, updates) {
    const vendor = await vendorModel.findByPk(vendorId);
    if (!vendor) {
        throw new Error(`Vendor ${vendorId} not found`);
    }
    return await vendor.update(updates);
}
/**
 * Retrieves vendor profile by ID with full details.
 *
 * @param {typeof Model} vendorModel - Vendor profile model
 * @param {string} vendorId - Vendor ID
 * @returns {Promise<any>} Vendor profile
 *
 * @example
 * const vendor = await getVendorProfile(VendorProfile, 'vendor-123');
 */
async function getVendorProfile(vendorModel, vendorId) {
    return await vendorModel.findByPk(vendorId);
}
/**
 * Lists vendors with filtering and pagination.
 *
 * @param {typeof Model} vendorModel - Vendor profile model
 * @param {Record<string, any>} filters - Query filters
 * @param {number} limit - Result limit
 * @param {number} offset - Result offset
 * @returns {Promise<{rows: any[], count: number}>} Vendor list
 *
 * @example
 * const vendors = await listVendors(VendorProfile, {
 *   status: 'active',
 *   criticalityLevel: 'high',
 *   vendorType: 'saas'
 * }, 50, 0);
 */
async function listVendors(vendorModel, filters = {}, limit = 50, offset = 0) {
    const where = {};
    if (filters.status)
        where.status = filters.status;
    if (filters.vendorType)
        where.vendorType = filters.vendorType;
    if (filters.criticalityLevel)
        where.criticalityLevel = filters.criticalityLevel;
    if (filters.dataAccess)
        where.dataAccess = filters.dataAccess;
    if (filters.search) {
        where[sequelize_1.Op.or] = [
            { vendorName: { [sequelize_1.Op.iLike]: `%${filters.search}%` } },
            { primaryContact: { [sequelize_1.Op.iLike]: `%${filters.search}%` } },
        ];
    }
    return await vendorModel.findAndCountAll({
        where,
        limit,
        offset,
        order: [['vendorName', 'ASC']],
    });
}
/**
 * Archives/terminates a vendor.
 *
 * @param {typeof Model} vendorModel - Vendor profile model
 * @param {string} vendorId - Vendor ID
 * @param {string} reason - Termination reason
 * @returns {Promise<any>} Updated vendor
 *
 * @example
 * await archiveVendor(VendorProfile, 'vendor-123', 'Contract expired');
 */
async function archiveVendor(vendorModel, vendorId, reason) {
    const vendor = await vendorModel.findByPk(vendorId);
    if (!vendor) {
        throw new Error(`Vendor ${vendorId} not found`);
    }
    return await vendor.update({
        status: 'terminated',
        metadata: {
            ...vendor.metadata,
            terminationReason: reason,
            terminatedAt: new Date(),
        },
    });
}
/**
 * Gets vendors by criticality level.
 *
 * @param {typeof Model} vendorModel - Vendor profile model
 * @param {'low' | 'medium' | 'high' | 'critical'} level - Criticality level
 * @returns {Promise<any[]>} Vendors at criticality level
 *
 * @example
 * const criticalVendors = await getVendorsByCriticality(VendorProfile, 'critical');
 */
async function getVendorsByCriticality(vendorModel, level) {
    return await vendorModel.findAll({
        where: {
            criticalityLevel: level,
            status: 'active',
        },
        order: [['vendorName', 'ASC']],
    });
}
// ============================================================================
// RISK ASSESSMENT UTILITIES (17-22)
// ============================================================================
/**
 * Creates a new vendor risk assessment.
 *
 * @param {typeof Model} assessmentModel - Risk assessment model
 * @param {VendorRiskAssessment} assessment - Assessment data
 * @returns {Promise<any>} Created assessment
 *
 * @example
 * await createRiskAssessment(VendorRiskAssessment, {
 *   vendorId: 'vendor-123',
 *   assessmentDate: new Date(),
 *   assessmentType: 'annual',
 *   assessedBy: 'user-456',
 *   overallRiskScore: 75,
 *   riskLevel: 'medium',
 *   securityScore: 80,
 *   privacyScore: 70,
 *   complianceScore: 75,
 *   financialScore: 85,
 *   operationalScore: 70,
 *   findings: ['Incomplete encryption', 'Limited access controls'],
 *   recommendations: ['Implement full disk encryption', 'Enable MFA']
 * });
 */
async function createRiskAssessment(assessmentModel, assessment) {
    const validated = exports.riskAssessmentSchema.parse(assessment);
    return await assessmentModel.create(validated);
}
/**
 * Calculates overall risk score from component scores.
 *
 * @param {number} securityScore - Security score (0-100)
 * @param {number} privacyScore - Privacy score (0-100)
 * @param {number} complianceScore - Compliance score (0-100)
 * @param {number} financialScore - Financial score (0-100)
 * @param {number} operationalScore - Operational score (0-100)
 * @returns {number} Overall risk score
 *
 * @example
 * const score = calculateOverallRiskScore(80, 75, 70, 85, 78);
 * // Returns weighted average
 */
function calculateOverallRiskScore(securityScore, privacyScore, complianceScore, financialScore, operationalScore) {
    const weights = {
        security: 0.30,
        privacy: 0.25,
        compliance: 0.25,
        financial: 0.10,
        operational: 0.10,
    };
    return (securityScore * weights.security +
        privacyScore * weights.privacy +
        complianceScore * weights.compliance +
        financialScore * weights.financial +
        operationalScore * weights.operational);
}
/**
 * Determines risk level from risk score.
 *
 * @param {number} riskScore - Risk score (0-100)
 * @returns {'low' | 'medium' | 'high' | 'critical'} Risk level
 *
 * @example
 * const level = determineRiskLevel(75); // Returns 'medium'
 */
function determineRiskLevel(riskScore) {
    if (riskScore >= 85)
        return 'low';
    if (riskScore >= 70)
        return 'medium';
    if (riskScore >= 50)
        return 'high';
    return 'critical';
}
/**
 * Gets latest risk assessment for a vendor.
 *
 * @param {typeof Model} assessmentModel - Risk assessment model
 * @param {string} vendorId - Vendor ID
 * @returns {Promise<any>} Latest assessment
 *
 * @example
 * const latest = await getLatestAssessment(VendorRiskAssessment, 'vendor-123');
 */
async function getLatestAssessment(assessmentModel, vendorId) {
    return await assessmentModel.findOne({
        where: { vendorId },
        order: [['assessmentDate', 'DESC']],
    });
}
/**
 * Gets risk assessment history for a vendor.
 *
 * @param {typeof Model} assessmentModel - Risk assessment model
 * @param {string} vendorId - Vendor ID
 * @param {number} limit - Number of assessments to retrieve
 * @returns {Promise<any[]>} Assessment history
 *
 * @example
 * const history = await getRiskAssessmentHistory(VendorRiskAssessment, 'vendor-123', 10);
 */
async function getRiskAssessmentHistory(assessmentModel, vendorId, limit = 10) {
    return await assessmentModel.findAll({
        where: { vendorId },
        order: [['assessmentDate', 'DESC']],
        limit,
    });
}
/**
 * Approves a risk assessment.
 *
 * @param {typeof Model} assessmentModel - Risk assessment model
 * @param {string} assessmentId - Assessment ID
 * @param {string} approvedBy - Approver user ID
 * @returns {Promise<any>} Approved assessment
 *
 * @example
 * await approveRiskAssessment(VendorRiskAssessment, 'assessment-123', 'user-456');
 */
async function approveRiskAssessment(assessmentModel, assessmentId, approvedBy) {
    const assessment = await assessmentModel.findByPk(assessmentId);
    if (!assessment) {
        throw new Error(`Assessment ${assessmentId} not found`);
    }
    return await assessment.update({
        approvalStatus: 'approved',
        approvedBy,
        approvedAt: new Date(),
    });
}
// ============================================================================
// SECURITY QUESTIONNAIRE UTILITIES (23-27)
// ============================================================================
/**
 * Creates a new security questionnaire.
 *
 * @param {typeof Model} questionnaireModel - Questionnaire model
 * @param {SecurityQuestionnaire} questionnaire - Questionnaire data
 * @returns {Promise<any>} Created questionnaire
 *
 * @example
 * await createSecurityQuestionnaire(SecurityQuestionnaire, {
 *   vendorId: 'vendor-123',
 *   questionnaireType: 'soc2',
 *   version: '2024.1',
 *   sentDate: new Date(),
 *   dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
 *   status: 'sent',
 *   questions: []
 * });
 */
async function createSecurityQuestionnaire(questionnaireModel, questionnaire) {
    const validated = exports.securityQuestionnaireSchema.parse(questionnaire);
    return await questionnaireModel.create(validated);
}
/**
 * Adds questions to a security questionnaire.
 *
 * @param {typeof Model} questionnaireModel - Questionnaire model
 * @param {string} questionnaireId - Questionnaire ID
 * @param {QuestionnaireQuestion[]} questions - Questions to add
 * @returns {Promise<any>} Updated questionnaire
 *
 * @example
 * await addQuestions(SecurityQuestionnaire, 'questionnaire-123', [
 *   {
 *     questionId: 'q1',
 *     category: 'encryption',
 *     question: 'Do you encrypt data at rest?',
 *     weight: 10,
 *     compliant: false
 *   }
 * ]);
 */
async function addQuestions(questionnaireModel, questionnaireId, questions) {
    const questionnaire = await questionnaireModel.findByPk(questionnaireId);
    if (!questionnaire) {
        throw new Error(`Questionnaire ${questionnaireId} not found`);
    }
    const existingQuestions = questionnaire.questions || [];
    return await questionnaire.update({
        questions: [...existingQuestions, ...questions],
    });
}
/**
 * Scores a completed questionnaire.
 *
 * @param {QuestionnaireQuestion[]} questions - Answered questions
 * @returns {number} Overall questionnaire score
 *
 * @example
 * const score = scoreQuestionnaire(answeredQuestions);
 */
function scoreQuestionnaire(questions) {
    if (questions.length === 0)
        return 0;
    const totalWeight = questions.reduce((sum, q) => sum + q.weight, 0);
    const weightedScore = questions.reduce((sum, q) => {
        const questionScore = q.compliant ? q.weight : 0;
        return sum + questionScore;
    }, 0);
    return (weightedScore / totalWeight) * 100;
}
/**
 * Identifies gaps in questionnaire responses.
 *
 * @param {QuestionnaireQuestion[]} questions - Answered questions
 * @returns {string[]} List of identified gaps
 *
 * @example
 * const gaps = identifyQuestionnaireGaps(answeredQuestions);
 */
function identifyQuestionnaireGaps(questions) {
    return questions
        .filter(q => !q.compliant)
        .map(q => `${q.category}: ${q.question}`);
}
/**
 * Gets overdue questionnaires.
 *
 * @param {typeof Model} questionnaireModel - Questionnaire model
 * @returns {Promise<any[]>} Overdue questionnaires
 *
 * @example
 * const overdue = await getOverdueQuestionnaires(SecurityQuestionnaire);
 */
async function getOverdueQuestionnaires(questionnaireModel) {
    return await questionnaireModel.findAll({
        where: {
            status: { [sequelize_1.Op.in]: ['sent', 'in_progress'] },
            dueDate: { [sequelize_1.Op.lt]: new Date() },
        },
        order: [['dueDate', 'ASC']],
    });
}
// ============================================================================
// VENDOR INCIDENT UTILITIES (28-32)
// ============================================================================
/**
 * Records a vendor incident.
 *
 * @param {typeof Model} incidentModel - Incident model
 * @param {VendorIncident} incident - Incident data
 * @returns {Promise<any>} Created incident
 *
 * @example
 * await recordVendorIncident(VendorIncident, {
 *   vendorId: 'vendor-123',
 *   incidentDate: new Date(),
 *   reportedDate: new Date(),
 *   reportedBy: 'user-456',
 *   incidentType: 'security_breach',
 *   severity: 'high',
 *   description: 'Unauthorized access detected',
 *   impact: 'Potential data exposure',
 *   affectedSystems: ['API Server'],
 *   affectedDataTypes: ['Customer PII'],
 *   remediationSteps: ['Reset credentials', 'Enable MFA']
 * });
 */
async function recordVendorIncident(incidentModel, incident) {
    const validated = exports.vendorIncidentSchema.parse(incident);
    return await incidentModel.create(validated);
}
/**
 * Updates incident remediation status.
 *
 * @param {typeof Model} incidentModel - Incident model
 * @param {string} incidentId - Incident ID
 * @param {'pending' | 'in_progress' | 'completed' | 'verified'} status - New status
 * @param {string} notes - Status update notes
 * @returns {Promise<any>} Updated incident
 *
 * @example
 * await updateIncidentStatus(VendorIncident, 'incident-123', 'completed', 'All remediation steps completed');
 */
async function updateIncidentStatus(incidentModel, incidentId, status, notes) {
    const incident = await incidentModel.findByPk(incidentId);
    if (!incident) {
        throw new Error(`Incident ${incidentId} not found`);
    }
    return await incident.update({
        remediationStatus: status,
        metadata: {
            ...incident.metadata,
            statusHistory: [
                ...(incident.metadata?.statusHistory || []),
                { status, notes, updatedAt: new Date() },
            ],
        },
    });
}
/**
 * Gets critical incidents for a vendor.
 *
 * @param {typeof Model} incidentModel - Incident model
 * @param {string} vendorId - Vendor ID
 * @returns {Promise<any[]>} Critical incidents
 *
 * @example
 * const critical = await getCriticalIncidents(VendorIncident, 'vendor-123');
 */
async function getCriticalIncidents(incidentModel, vendorId) {
    return await incidentModel.findAll({
        where: {
            vendorId,
            severity: { [sequelize_1.Op.in]: ['high', 'critical'] },
            remediationStatus: { [sequelize_1.Op.ne]: 'verified' },
        },
        order: [['incidentDate', 'DESC']],
    });
}
/**
 * Gets incident statistics for a vendor.
 *
 * @param {typeof Model} incidentModel - Incident model
 * @param {string} vendorId - Vendor ID
 * @param {Date} startDate - Start date for statistics
 * @param {Date} endDate - End date for statistics
 * @returns {Promise<Record<string, any>>} Incident statistics
 *
 * @example
 * const stats = await getIncidentStats(VendorIncident, 'vendor-123', startDate, endDate);
 */
async function getIncidentStats(incidentModel, vendorId, startDate, endDate) {
    const incidents = await incidentModel.findAll({
        where: {
            vendorId,
            incidentDate: {
                [sequelize_1.Op.between]: [startDate, endDate],
            },
        },
    });
    return {
        total: incidents.length,
        byType: incidents.reduce((acc, inc) => {
            acc[inc.incidentType] = (acc[inc.incidentType] || 0) + 1;
            return acc;
        }, {}),
        bySeverity: incidents.reduce((acc, inc) => {
            acc[inc.severity] = (acc[inc.severity] || 0) + 1;
            return acc;
        }, {}),
        byStatus: incidents.reduce((acc, inc) => {
            acc[inc.remediationStatus] = (acc[inc.remediationStatus] || 0) + 1;
            return acc;
        }, {}),
    };
}
/**
 * Closes a vendor incident.
 *
 * @param {typeof Model} incidentModel - Incident model
 * @param {string} incidentId - Incident ID
 * @param {string} lessonsLearned - Lessons learned from incident
 * @returns {Promise<any>} Closed incident
 *
 * @example
 * await closeIncident(VendorIncident, 'incident-123', 'Enhanced monitoring needed');
 */
async function closeIncident(incidentModel, incidentId, lessonsLearned) {
    const incident = await incidentModel.findByPk(incidentId);
    if (!incident) {
        throw new Error(`Incident ${incidentId} not found`);
    }
    return await incident.update({
        remediationStatus: 'verified',
        closedDate: new Date(),
        lessonsLearned,
    });
}
// ============================================================================
// VENDOR SCORECARD UTILITIES (33-38)
// ============================================================================
/**
 * Generates a vendor scorecard.
 *
 * @param {typeof Model} scorecardModel - Scorecard model
 * @param {VendorScorecard} scorecard - Scorecard data
 * @returns {Promise<any>} Created scorecard
 *
 * @example
 * await generateVendorScorecard(VendorScorecard, {
 *   vendorId: 'vendor-123',
 *   scoringPeriod: '2024-Q1',
 *   calculatedDate: new Date(),
 *   overallScore: 85,
 *   performanceMetrics: [],
 *   securityMetrics: [],
 *   complianceMetrics: [],
 *   financialMetrics: [],
 *   trend: 'improving',
 *   recommendations: []
 * });
 */
async function generateVendorScorecard(scorecardModel, scorecard) {
    const validated = exports.vendorScorecardSchema.parse(scorecard);
    return await scorecardModel.create(validated);
}
/**
 * Calculates scorecard metrics from vendor data.
 *
 * @param {any} vendor - Vendor data
 * @param {any[]} assessments - Risk assessments
 * @param {any[]} incidents - Vendor incidents
 * @returns {ScoreMetric[]} Calculated metrics
 *
 * @example
 * const metrics = calculateScorecardMetrics(vendor, assessments, incidents);
 */
function calculateScorecardMetrics(vendor, assessments, incidents) {
    const metrics = [];
    if (assessments.length > 0) {
        const latest = assessments[0];
        metrics.push({
            metricName: 'Security Score',
            category: 'security',
            value: latest.securityScore,
            weight: 30,
            target: 85,
            threshold: 70,
            status: latest.securityScore >= 85 ? 'excellent' : latest.securityScore >= 70 ? 'good' : 'poor',
        });
    }
    const criticalIncidents = incidents.filter(i => i.severity === 'critical').length;
    metrics.push({
        metricName: 'Critical Incidents',
        category: 'performance',
        value: criticalIncidents,
        weight: 20,
        target: 0,
        threshold: 2,
        status: criticalIncidents === 0 ? 'excellent' : criticalIncidents <= 2 ? 'acceptable' : 'poor',
    });
    return metrics;
}
/**
 * Determines performance trend from scorecard history.
 *
 * @param {any[]} scorecards - Historical scorecards
 * @returns {'improving' | 'stable' | 'declining'} Trend
 *
 * @example
 * const trend = determineTrend(historicalScorecards);
 */
function determineTrend(scorecards) {
    if (scorecards.length < 2)
        return 'stable';
    const recent = scorecards[0].overallScore;
    const previous = scorecards[1].overallScore;
    const difference = recent - previous;
    if (difference > 5)
        return 'improving';
    if (difference < -5)
        return 'declining';
    return 'stable';
}
/**
 * Compares vendor score to benchmark.
 *
 * @param {number} vendorScore - Vendor's score
 * @param {number[]} peerScores - Peer vendor scores
 * @returns {number} Percentile ranking
 *
 * @example
 * const percentile = compareToBenchmark(85, [70, 75, 80, 90, 95]);
 */
function compareToBenchmark(vendorScore, peerScores) {
    const sorted = [...peerScores, vendorScore].sort((a, b) => a - b);
    const rank = sorted.indexOf(vendorScore) + 1;
    return (rank / sorted.length) * 100;
}
/**
 * Gets latest scorecard for a vendor.
 *
 * @param {typeof Model} scorecardModel - Scorecard model
 * @param {string} vendorId - Vendor ID
 * @returns {Promise<any>} Latest scorecard
 *
 * @example
 * const latest = await getLatestScorecard(VendorScorecard, 'vendor-123');
 */
async function getLatestScorecard(scorecardModel, vendorId) {
    return await scorecardModel.findOne({
        where: { vendorId },
        order: [['calculatedDate', 'DESC']],
    });
}
/**
 * Gets scorecard history for trend analysis.
 *
 * @param {typeof Model} scorecardModel - Scorecard model
 * @param {string} vendorId - Vendor ID
 * @param {number} periods - Number of periods to retrieve
 * @returns {Promise<any[]>} Scorecard history
 *
 * @example
 * const history = await getScorecardHistory(VendorScorecard, 'vendor-123', 12);
 */
async function getScorecardHistory(scorecardModel, vendorId, periods = 12) {
    return await scorecardModel.findAll({
        where: { vendorId },
        order: [['calculatedDate', 'DESC']],
        limit: periods,
    });
}
// ============================================================================
// DUE DILIGENCE & CONTRACT UTILITIES (39-43)
// ============================================================================
/**
 * Creates vendor due diligence workflow.
 *
 * @param {typeof Model} dueDiligenceModel - Due diligence model (custom model)
 * @param {VendorDueDiligence} dueDiligence - Due diligence data
 * @returns {Promise<any>} Created due diligence record
 *
 * @example
 * await createDueDiligence(VendorDueDiligence, {
 *   vendorId: 'vendor-123',
 *   dueDiligenceType: 'enhanced',
 *   initiatedDate: new Date(),
 *   assignedTo: 'user-456',
 *   status: 'pending',
 *   checklistItems: [],
 *   documentsCollected: [],
 *   backgroundCheckCompleted: false,
 *   financialReviewCompleted: false,
 *   securityReviewCompleted: false,
 *   legalReviewCompleted: false,
 *   referenceCheckCompleted: false,
 *   overallResult: 'pending'
 * });
 */
async function createDueDiligence(dueDiligenceModel, dueDiligence) {
    return await dueDiligenceModel.create(dueDiligence);
}
/**
 * Validates vendor contract security requirements.
 *
 * @param {VendorContract} contract - Contract to validate
 * @param {string[]} requiredClauses - Required security clauses
 * @returns {boolean} Whether contract meets requirements
 *
 * @example
 * const valid = validateContractSecurity(contract, [
 *   'data_encryption',
 *   'breach_notification',
 *   'right_to_audit'
 * ]);
 */
function validateContractSecurity(contract, requiredClauses) {
    const contractClauses = [
        ...contract.securityRequirements,
        ...contract.complianceRequirements,
        ...contract.dataProtectionClauses,
    ];
    return requiredClauses.every(clause => contractClauses.some(c => c.toLowerCase().includes(clause.toLowerCase())));
}
/**
 * Schedules continuous vendor monitoring.
 *
 * @param {typeof Model} monitoringModel - Monitoring model (custom model)
 * @param {VendorMonitoring} monitoring - Monitoring configuration
 * @returns {Promise<any>} Created monitoring schedule
 *
 * @example
 * await scheduleVendorMonitoring(VendorMonitoring, {
 *   vendorId: 'vendor-123',
 *   monitoringType: 'continuous',
 *   frequency: 'daily',
 *   lastCheckDate: new Date(),
 *   monitoringSources: ['SecurityScorecard', 'BitSight'],
 *   alerts: [],
 *   status: 'active'
 * });
 */
async function scheduleVendorMonitoring(monitoringModel, monitoring) {
    return await monitoringModel.create(monitoring);
}
/**
 * Executes vendor onboarding workflow.
 *
 * @param {typeof Model} vendorModel - Vendor model
 * @param {typeof Model} assessmentModel - Assessment model
 * @param {VendorProfile} vendor - Vendor profile
 * @returns {Promise<Record<string, any>>} Onboarding result
 *
 * @example
 * const result = await onboardVendor(VendorProfile, VendorRiskAssessment, {
 *   vendorName: 'New Vendor',
 *   vendorType: 'saas',
 *   primaryContact: 'Contact Name',
 *   contactEmail: 'contact@vendor.com',
 *   servicesProvided: ['Service1'],
 *   dataAccess: 'limited',
 *   criticalityLevel: 'medium',
 *   status: 'prospect'
 * });
 */
async function onboardVendor(vendorModel, assessmentModel, vendor) {
    // Create vendor profile
    const createdVendor = await createVendorProfile(vendorModel, {
        ...vendor,
        status: 'prospect',
    });
    // Initialize risk assessment
    const initialAssessment = await createRiskAssessment(assessmentModel, {
        vendorId: createdVendor.id,
        assessmentDate: new Date(),
        assessmentType: 'initial',
        assessedBy: vendor.metadata?.assessedBy || 'system',
        overallRiskScore: 0,
        riskLevel: 'medium',
        securityScore: 0,
        privacyScore: 0,
        complianceScore: 0,
        financialScore: 0,
        operationalScore: 0,
        findings: [],
        recommendations: ['Complete initial security questionnaire', 'Provide compliance certifications'],
    });
    return {
        vendor: createdVendor,
        assessment: initialAssessment,
        nextSteps: [
            'Send security questionnaire',
            'Request compliance documentation',
            'Schedule security review call',
            'Conduct due diligence',
        ],
    };
}
/**
 * Executes vendor offboarding workflow.
 *
 * @param {typeof Model} vendorModel - Vendor model
 * @param {string} vendorId - Vendor ID
 * @param {string} offboardingReason - Reason for offboarding
 * @param {string} userId - User executing offboarding
 * @returns {Promise<Record<string, any>>} Offboarding result
 *
 * @example
 * const result = await offboardVendor(VendorProfile, 'vendor-123', 'Contract expired', 'user-456');
 */
async function offboardVendor(vendorModel, vendorId, offboardingReason, userId) {
    const vendor = await vendorModel.findByPk(vendorId);
    if (!vendor) {
        throw new Error(`Vendor ${vendorId} not found`);
    }
    // Update vendor status
    await vendor.update({
        status: 'terminated',
        metadata: {
            ...vendor.metadata,
            offboardingReason,
            offboardedBy: userId,
            offboardedAt: new Date(),
        },
    });
    return {
        vendor,
        tasks: [
            'Revoke all access credentials',
            'Recover company assets',
            'Archive vendor data',
            'Update contract status',
            'Notify stakeholders',
            'Complete final security review',
        ],
        completedAt: new Date(),
    };
}
// ============================================================================
// SWAGGER DTOs
// ============================================================================
let CreateVendorDto = (() => {
    var _a;
    let _vendorName_decorators;
    let _vendorName_initializers = [];
    let _vendorName_extraInitializers = [];
    let _vendorType_decorators;
    let _vendorType_initializers = [];
    let _vendorType_extraInitializers = [];
    let _primaryContact_decorators;
    let _primaryContact_initializers = [];
    let _primaryContact_extraInitializers = [];
    let _contactEmail_decorators;
    let _contactEmail_initializers = [];
    let _contactEmail_extraInitializers = [];
    let _servicesProvided_decorators;
    let _servicesProvided_initializers = [];
    let _servicesProvided_extraInitializers = [];
    let _dataAccess_decorators;
    let _dataAccess_initializers = [];
    let _dataAccess_extraInitializers = [];
    let _criticalityLevel_decorators;
    let _criticalityLevel_initializers = [];
    let _criticalityLevel_extraInitializers = [];
    return _a = class CreateVendorDto {
            constructor() {
                this.vendorName = __runInitializers(this, _vendorName_initializers, void 0);
                this.vendorType = (__runInitializers(this, _vendorName_extraInitializers), __runInitializers(this, _vendorType_initializers, void 0));
                this.primaryContact = (__runInitializers(this, _vendorType_extraInitializers), __runInitializers(this, _primaryContact_initializers, void 0));
                this.contactEmail = (__runInitializers(this, _primaryContact_extraInitializers), __runInitializers(this, _contactEmail_initializers, void 0));
                this.servicesProvided = (__runInitializers(this, _contactEmail_extraInitializers), __runInitializers(this, _servicesProvided_initializers, void 0));
                this.dataAccess = (__runInitializers(this, _servicesProvided_extraInitializers), __runInitializers(this, _dataAccess_initializers, void 0));
                this.criticalityLevel = (__runInitializers(this, _dataAccess_extraInitializers), __runInitializers(this, _criticalityLevel_initializers, void 0));
                __runInitializers(this, _criticalityLevel_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _vendorName_decorators = [(0, swagger_1.ApiProperty)({ example: 'Acme Cloud Services' })];
            _vendorType_decorators = [(0, swagger_1.ApiProperty)({ enum: ['saas', 'infrastructure', 'consulting', 'hardware', 'other'] })];
            _primaryContact_decorators = [(0, swagger_1.ApiProperty)({ example: 'John Doe' })];
            _contactEmail_decorators = [(0, swagger_1.ApiProperty)({ example: 'john@acme.com' })];
            _servicesProvided_decorators = [(0, swagger_1.ApiProperty)({ example: ['Cloud Storage', 'Computing'] })];
            _dataAccess_decorators = [(0, swagger_1.ApiProperty)({ enum: ['none', 'limited', 'full', 'administrative'] })];
            _criticalityLevel_decorators = [(0, swagger_1.ApiProperty)({ enum: ['low', 'medium', 'high', 'critical'] })];
            __esDecorate(null, null, _vendorName_decorators, { kind: "field", name: "vendorName", static: false, private: false, access: { has: obj => "vendorName" in obj, get: obj => obj.vendorName, set: (obj, value) => { obj.vendorName = value; } }, metadata: _metadata }, _vendorName_initializers, _vendorName_extraInitializers);
            __esDecorate(null, null, _vendorType_decorators, { kind: "field", name: "vendorType", static: false, private: false, access: { has: obj => "vendorType" in obj, get: obj => obj.vendorType, set: (obj, value) => { obj.vendorType = value; } }, metadata: _metadata }, _vendorType_initializers, _vendorType_extraInitializers);
            __esDecorate(null, null, _primaryContact_decorators, { kind: "field", name: "primaryContact", static: false, private: false, access: { has: obj => "primaryContact" in obj, get: obj => obj.primaryContact, set: (obj, value) => { obj.primaryContact = value; } }, metadata: _metadata }, _primaryContact_initializers, _primaryContact_extraInitializers);
            __esDecorate(null, null, _contactEmail_decorators, { kind: "field", name: "contactEmail", static: false, private: false, access: { has: obj => "contactEmail" in obj, get: obj => obj.contactEmail, set: (obj, value) => { obj.contactEmail = value; } }, metadata: _metadata }, _contactEmail_initializers, _contactEmail_extraInitializers);
            __esDecorate(null, null, _servicesProvided_decorators, { kind: "field", name: "servicesProvided", static: false, private: false, access: { has: obj => "servicesProvided" in obj, get: obj => obj.servicesProvided, set: (obj, value) => { obj.servicesProvided = value; } }, metadata: _metadata }, _servicesProvided_initializers, _servicesProvided_extraInitializers);
            __esDecorate(null, null, _dataAccess_decorators, { kind: "field", name: "dataAccess", static: false, private: false, access: { has: obj => "dataAccess" in obj, get: obj => obj.dataAccess, set: (obj, value) => { obj.dataAccess = value; } }, metadata: _metadata }, _dataAccess_initializers, _dataAccess_extraInitializers);
            __esDecorate(null, null, _criticalityLevel_decorators, { kind: "field", name: "criticalityLevel", static: false, private: false, access: { has: obj => "criticalityLevel" in obj, get: obj => obj.criticalityLevel, set: (obj, value) => { obj.criticalityLevel = value; } }, metadata: _metadata }, _criticalityLevel_initializers, _criticalityLevel_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateVendorDto = CreateVendorDto;
let CreateRiskAssessmentDto = (() => {
    var _a;
    let _vendorId_decorators;
    let _vendorId_initializers = [];
    let _vendorId_extraInitializers = [];
    let _assessmentType_decorators;
    let _assessmentType_initializers = [];
    let _assessmentType_extraInitializers = [];
    let _assessedBy_decorators;
    let _assessedBy_initializers = [];
    let _assessedBy_extraInitializers = [];
    let _overallRiskScore_decorators;
    let _overallRiskScore_initializers = [];
    let _overallRiskScore_extraInitializers = [];
    let _riskLevel_decorators;
    let _riskLevel_initializers = [];
    let _riskLevel_extraInitializers = [];
    return _a = class CreateRiskAssessmentDto {
            constructor() {
                this.vendorId = __runInitializers(this, _vendorId_initializers, void 0);
                this.assessmentType = (__runInitializers(this, _vendorId_extraInitializers), __runInitializers(this, _assessmentType_initializers, void 0));
                this.assessedBy = (__runInitializers(this, _assessmentType_extraInitializers), __runInitializers(this, _assessedBy_initializers, void 0));
                this.overallRiskScore = (__runInitializers(this, _assessedBy_extraInitializers), __runInitializers(this, _overallRiskScore_initializers, void 0));
                this.riskLevel = (__runInitializers(this, _overallRiskScore_extraInitializers), __runInitializers(this, _riskLevel_initializers, void 0));
                __runInitializers(this, _riskLevel_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _vendorId_decorators = [(0, swagger_1.ApiProperty)()];
            _assessmentType_decorators = [(0, swagger_1.ApiProperty)({ enum: ['initial', 'annual', 'ongoing', 'incident_triggered'] })];
            _assessedBy_decorators = [(0, swagger_1.ApiProperty)()];
            _overallRiskScore_decorators = [(0, swagger_1.ApiProperty)({ minimum: 0, maximum: 100 })];
            _riskLevel_decorators = [(0, swagger_1.ApiProperty)({ enum: ['low', 'medium', 'high', 'critical'] })];
            __esDecorate(null, null, _vendorId_decorators, { kind: "field", name: "vendorId", static: false, private: false, access: { has: obj => "vendorId" in obj, get: obj => obj.vendorId, set: (obj, value) => { obj.vendorId = value; } }, metadata: _metadata }, _vendorId_initializers, _vendorId_extraInitializers);
            __esDecorate(null, null, _assessmentType_decorators, { kind: "field", name: "assessmentType", static: false, private: false, access: { has: obj => "assessmentType" in obj, get: obj => obj.assessmentType, set: (obj, value) => { obj.assessmentType = value; } }, metadata: _metadata }, _assessmentType_initializers, _assessmentType_extraInitializers);
            __esDecorate(null, null, _assessedBy_decorators, { kind: "field", name: "assessedBy", static: false, private: false, access: { has: obj => "assessedBy" in obj, get: obj => obj.assessedBy, set: (obj, value) => { obj.assessedBy = value; } }, metadata: _metadata }, _assessedBy_initializers, _assessedBy_extraInitializers);
            __esDecorate(null, null, _overallRiskScore_decorators, { kind: "field", name: "overallRiskScore", static: false, private: false, access: { has: obj => "overallRiskScore" in obj, get: obj => obj.overallRiskScore, set: (obj, value) => { obj.overallRiskScore = value; } }, metadata: _metadata }, _overallRiskScore_initializers, _overallRiskScore_extraInitializers);
            __esDecorate(null, null, _riskLevel_decorators, { kind: "field", name: "riskLevel", static: false, private: false, access: { has: obj => "riskLevel" in obj, get: obj => obj.riskLevel, set: (obj, value) => { obj.riskLevel = value; } }, metadata: _metadata }, _riskLevel_initializers, _riskLevel_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateRiskAssessmentDto = CreateRiskAssessmentDto;
let CreateIncidentDto = (() => {
    var _a;
    let _vendorId_decorators;
    let _vendorId_initializers = [];
    let _vendorId_extraInitializers = [];
    let _incidentDate_decorators;
    let _incidentDate_initializers = [];
    let _incidentDate_extraInitializers = [];
    let _incidentType_decorators;
    let _incidentType_initializers = [];
    let _incidentType_extraInitializers = [];
    let _severity_decorators;
    let _severity_initializers = [];
    let _severity_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _impact_decorators;
    let _impact_initializers = [];
    let _impact_extraInitializers = [];
    return _a = class CreateIncidentDto {
            constructor() {
                this.vendorId = __runInitializers(this, _vendorId_initializers, void 0);
                this.incidentDate = (__runInitializers(this, _vendorId_extraInitializers), __runInitializers(this, _incidentDate_initializers, void 0));
                this.incidentType = (__runInitializers(this, _incidentDate_extraInitializers), __runInitializers(this, _incidentType_initializers, void 0));
                this.severity = (__runInitializers(this, _incidentType_extraInitializers), __runInitializers(this, _severity_initializers, void 0));
                this.description = (__runInitializers(this, _severity_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.impact = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _impact_initializers, void 0));
                __runInitializers(this, _impact_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _vendorId_decorators = [(0, swagger_1.ApiProperty)()];
            _incidentDate_decorators = [(0, swagger_1.ApiProperty)()];
            _incidentType_decorators = [(0, swagger_1.ApiProperty)({ enum: ['security_breach', 'data_loss', 'service_outage', 'compliance_violation', 'other'] })];
            _severity_decorators = [(0, swagger_1.ApiProperty)({ enum: ['low', 'medium', 'high', 'critical'] })];
            _description_decorators = [(0, swagger_1.ApiProperty)()];
            _impact_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _vendorId_decorators, { kind: "field", name: "vendorId", static: false, private: false, access: { has: obj => "vendorId" in obj, get: obj => obj.vendorId, set: (obj, value) => { obj.vendorId = value; } }, metadata: _metadata }, _vendorId_initializers, _vendorId_extraInitializers);
            __esDecorate(null, null, _incidentDate_decorators, { kind: "field", name: "incidentDate", static: false, private: false, access: { has: obj => "incidentDate" in obj, get: obj => obj.incidentDate, set: (obj, value) => { obj.incidentDate = value; } }, metadata: _metadata }, _incidentDate_initializers, _incidentDate_extraInitializers);
            __esDecorate(null, null, _incidentType_decorators, { kind: "field", name: "incidentType", static: false, private: false, access: { has: obj => "incidentType" in obj, get: obj => obj.incidentType, set: (obj, value) => { obj.incidentType = value; } }, metadata: _metadata }, _incidentType_initializers, _incidentType_extraInitializers);
            __esDecorate(null, null, _severity_decorators, { kind: "field", name: "severity", static: false, private: false, access: { has: obj => "severity" in obj, get: obj => obj.severity, set: (obj, value) => { obj.severity = value; } }, metadata: _metadata }, _severity_initializers, _severity_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _impact_decorators, { kind: "field", name: "impact", static: false, private: false, access: { has: obj => "impact" in obj, get: obj => obj.impact, set: (obj, value) => { obj.impact = value; } }, metadata: _metadata }, _impact_initializers, _impact_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateIncidentDto = CreateIncidentDto;
//# sourceMappingURL=vendor-risk-management-kit.js.map