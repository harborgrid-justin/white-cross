"use strict";
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncidentReport = exports.ComplianceStatus = exports.InsuranceClaimStatus = exports.IncidentStatus = exports.IncidentSeverity = exports.IncidentType = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const uuid_1 = require("uuid");
const sequelize_1 = require("sequelize");
var IncidentType;
(function (IncidentType) {
    IncidentType["INJURY"] = "INJURY";
    IncidentType["ILLNESS"] = "ILLNESS";
    IncidentType["BEHAVIORAL"] = "BEHAVIORAL";
    IncidentType["MEDICATION_ERROR"] = "MEDICATION_ERROR";
    IncidentType["ALLERGIC_REACTION"] = "ALLERGIC_REACTION";
    IncidentType["EMERGENCY"] = "EMERGENCY";
    IncidentType["SAFETY"] = "SAFETY";
    IncidentType["OTHER"] = "OTHER";
})(IncidentType || (exports.IncidentType = IncidentType = {}));
var IncidentSeverity;
(function (IncidentSeverity) {
    IncidentSeverity["LOW"] = "LOW";
    IncidentSeverity["MEDIUM"] = "MEDIUM";
    IncidentSeverity["HIGH"] = "HIGH";
    IncidentSeverity["CRITICAL"] = "CRITICAL";
})(IncidentSeverity || (exports.IncidentSeverity = IncidentSeverity = {}));
var IncidentStatus;
(function (IncidentStatus) {
    IncidentStatus["DRAFT"] = "DRAFT";
    IncidentStatus["PENDING_REVIEW"] = "PENDING_REVIEW";
    IncidentStatus["UNDER_INVESTIGATION"] = "UNDER_INVESTIGATION";
    IncidentStatus["REQUIRES_ACTION"] = "REQUIRES_ACTION";
    IncidentStatus["RESOLVED"] = "RESOLVED";
    IncidentStatus["CLOSED"] = "CLOSED";
})(IncidentStatus || (exports.IncidentStatus = IncidentStatus = {}));
var InsuranceClaimStatus;
(function (InsuranceClaimStatus) {
    InsuranceClaimStatus["NOT_FILED"] = "NOT_FILED";
    InsuranceClaimStatus["FILED"] = "FILED";
    InsuranceClaimStatus["PENDING"] = "PENDING";
    InsuranceClaimStatus["APPROVED"] = "APPROVED";
    InsuranceClaimStatus["DENIED"] = "DENIED";
    InsuranceClaimStatus["CLOSED"] = "CLOSED";
})(InsuranceClaimStatus || (exports.InsuranceClaimStatus = InsuranceClaimStatus = {}));
var ComplianceStatus;
(function (ComplianceStatus) {
    ComplianceStatus["PENDING"] = "PENDING";
    ComplianceStatus["COMPLIANT"] = "COMPLIANT";
    ComplianceStatus["NON_COMPLIANT"] = "NON_COMPLIANT";
    ComplianceStatus["UNDER_REVIEW"] = "UNDER_REVIEW";
})(ComplianceStatus || (exports.ComplianceStatus = ComplianceStatus = {}));
let IncidentReport = class IncidentReport extends sequelize_typescript_1.Model {
    studentId;
    reportedById;
    type;
    severity;
    status;
    description;
    location;
    witnesses;
    actionsTaken;
    parentNotified;
    parentNotificationMethod;
    parentNotifiedAt;
    parentNotifiedBy;
    followUpRequired;
    followUpNotes;
    attachments;
    evidencePhotos;
    evidenceVideos;
    insuranceClaimNumber;
    insuranceClaimStatus;
    legalComplianceStatus;
    occurredAt;
    createdBy;
    updatedBy;
    static async auditPHIAccess(instance, options) {
        if (instance.changed()) {
            const changedFields = instance.changed();
            const { logModelPHIAccess } = await Promise.resolve().then(() => __importStar(require('../services/model-audit-helper.service.js')));
            const action = instance.isNewRecord ? 'CREATE' : 'UPDATE';
            await logModelPHIAccess('IncidentReport', instance.id, action, changedFields, options?.transaction);
        }
    }
    static async validateParentNotification(instance) {
        if (instance.parentNotified && !instance.parentNotificationMethod) {
            throw new Error('parentNotificationMethod is required when parent is notified');
        }
        if (instance.parentNotified && !instance.parentNotifiedAt) {
            instance.parentNotifiedAt = new Date();
        }
    }
};
exports.IncidentReport = IncidentReport;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(() => (0, uuid_1.v4)()),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], IncidentReport.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => require('./student.model').Student),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
        references: {
            model: 'students',
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
    }),
    __metadata("design:type", String)
], IncidentReport.prototype, "studentId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => require('./user.model').User),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
    }),
    __metadata("design:type", String)
], IncidentReport.prototype, "reportedById", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(IncidentType)],
        },
        allowNull: false,
    }),
    __metadata("design:type", String)
], IncidentReport.prototype, "type", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(IncidentSeverity)],
        },
        allowNull: false,
    }),
    __metadata("design:type", String)
], IncidentReport.prototype, "severity", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(IncidentStatus.PENDING_REVIEW),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(IncidentStatus)],
        },
        allowNull: false,
        defaultValue: IncidentStatus.PENDING_REVIEW,
    }),
    __metadata("design:type", String)
], IncidentReport.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: false,
    }),
    __metadata("design:type", String)
], IncidentReport.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: false,
    }),
    __metadata("design:type", String)
], IncidentReport.prototype, "location", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)([]),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING(255)),
        allowNull: false,
    }),
    __metadata("design:type", Array)
], IncidentReport.prototype, "witnesses", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: false,
    }),
    __metadata("design:type", String)
], IncidentReport.prototype, "actionsTaken", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
    }),
    __metadata("design:type", Boolean)
], IncidentReport.prototype, "parentNotified", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
    }),
    __metadata("design:type", String)
], IncidentReport.prototype, "parentNotificationMethod", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
    }),
    __metadata("design:type", Date)
], IncidentReport.prototype, "parentNotifiedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
    }),
    __metadata("design:type", String)
], IncidentReport.prototype, "parentNotifiedBy", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
    }),
    __metadata("design:type", Boolean)
], IncidentReport.prototype, "followUpRequired", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
    }),
    __metadata("design:type", String)
], IncidentReport.prototype, "followUpNotes", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)([]),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING(255)),
        allowNull: false,
    }),
    __metadata("design:type", Array)
], IncidentReport.prototype, "attachments", void 0);
__decorate([
    (0, sequelize_typescript_1.Index)({ using: 'GIN', name: 'idx_incident_reports_evidence_photos_gin' }),
    (0, sequelize_typescript_1.Default)([]),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING(255)),
        allowNull: false,
    }),
    __metadata("design:type", Array)
], IncidentReport.prototype, "evidencePhotos", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)([]),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING(255)),
        allowNull: false,
    }),
    __metadata("design:type", Array)
], IncidentReport.prototype, "evidenceVideos", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
    }),
    __metadata("design:type", String)
], IncidentReport.prototype, "insuranceClaimNumber", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(InsuranceClaimStatus)],
        },
    }),
    __metadata("design:type", String)
], IncidentReport.prototype, "insuranceClaimStatus", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(ComplianceStatus.PENDING),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(ComplianceStatus)],
        },
        allowNull: false,
    }),
    __metadata("design:type", String)
], IncidentReport.prototype, "legalComplianceStatus", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
    }),
    __metadata("design:type", Date)
], IncidentReport.prototype, "occurredAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
    }),
    __metadata("design:type", String)
], IncidentReport.prototype, "createdBy", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
    }),
    __metadata("design:type", String)
], IncidentReport.prototype, "updatedBy", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
    }),
    __metadata("design:type", Date)
], IncidentReport.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
    }),
    __metadata("design:type", Date)
], IncidentReport.prototype, "updatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./student.model').Student, {
        foreignKey: 'studentId',
        as: 'student',
    }),
    __metadata("design:type", Object)
], IncidentReport.prototype, "student", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./user.model').User, {
        foreignKey: 'reportedById',
        as: 'reporter',
    }),
    __metadata("design:type", Object)
], IncidentReport.prototype, "reporter", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => require('./follow-up-action.model').FollowUpAction, {
        foreignKey: 'incidentReportId',
        as: 'followUpActions',
    }),
    __metadata("design:type", Array)
], IncidentReport.prototype, "followUpActions", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => require('./witness-statement.model').WitnessStatement, {
        foreignKey: 'incidentReportId',
        as: 'witnessStatements',
    }),
    __metadata("design:type", Array)
], IncidentReport.prototype, "witnessStatements", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [IncidentReport, Object]),
    __metadata("design:returntype", Promise)
], IncidentReport, "auditPHIAccess", null);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [IncidentReport]),
    __metadata("design:returntype", Promise)
], IncidentReport, "validateParentNotification", null);
exports.IncidentReport = IncidentReport = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                deletedAt: null,
            },
            order: [['occurredAt', 'DESC']],
        },
        byStudent: (studentId) => ({
            where: { studentId },
            order: [['occurredAt', 'DESC']],
        }),
        byType: (type) => ({
            where: { type },
            order: [['occurredAt', 'DESC']],
        }),
        bySeverity: (severity) => ({
            where: { severity },
            order: [['occurredAt', 'DESC']],
        }),
        byStatus: (status) => ({
            where: { status },
            order: [['occurredAt', 'DESC']],
        }),
        pendingReview: {
            where: {
                status: {
                    [sequelize_1.Op.in]: [
                        IncidentStatus.PENDING_REVIEW,
                        IncidentStatus.UNDER_INVESTIGATION,
                    ],
                },
            },
            order: [['occurredAt', 'ASC']],
        },
        critical: {
            where: {
                severity: {
                    [sequelize_1.Op.in]: [IncidentSeverity.HIGH, IncidentSeverity.CRITICAL],
                },
            },
            order: [['occurredAt', 'DESC']],
        },
        requiresAction: {
            where: {
                status: IncidentStatus.REQUIRES_ACTION,
            },
            order: [
                ['severity', 'DESC'],
                ['occurredAt', 'ASC'],
            ],
        },
        parentNotRequired: {
            where: {
                parentNotified: false,
            },
            order: [['occurredAt', 'ASC']],
        },
        withFollowUp: {
            where: {
                followUpRequired: true,
            },
            order: [['occurredAt', 'DESC']],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'incident_reports',
        timestamps: true,
        underscored: false,
        paranoid: true,
        indexes: [
            {
                fields: ['studentId'],
            },
            {
                fields: ['reportedById'],
            },
            {
                fields: ['type', 'occurredAt'],
            },
            {
                fields: ['severity'],
            },
            {
                fields: ['status'],
                name: 'idx_incident_reports_status',
            },
            {
                fields: ['createdAt'],
                name: 'idx_incident_reports_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_incident_reports_updated_at',
            },
            {
                fields: ['evidencePhotos'],
                using: 'GIN',
                name: 'idx_incident_reports_evidence_photos_gin',
            },
        ],
    })
], IncidentReport);
//# sourceMappingURL=incident-report.model.js.map