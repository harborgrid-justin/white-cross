"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MentalHealthRecord = exports.RiskLevel = exports.MentalHealthRecordType = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const uuid_1 = require("uuid");
const model_audit_hooks_service_1 = require("../services/model-audit-hooks.service");
var MentalHealthRecordType;
(function (MentalHealthRecordType) {
    MentalHealthRecordType["ASSESSMENT"] = "ASSESSMENT";
    MentalHealthRecordType["COUNSELING_SESSION"] = "COUNSELING_SESSION";
    MentalHealthRecordType["CRISIS_INTERVENTION"] = "CRISIS_INTERVENTION";
    MentalHealthRecordType["THERAPY_SESSION"] = "THERAPY_SESSION";
    MentalHealthRecordType["PSYCHIATRIC_EVALUATION"] = "PSYCHIATRIC_EVALUATION";
    MentalHealthRecordType["SCREENING"] = "SCREENING";
    MentalHealthRecordType["FOLLOW_UP"] = "FOLLOW_UP";
    MentalHealthRecordType["REFERRAL"] = "REFERRAL";
    MentalHealthRecordType["PROGRESS_NOTE"] = "PROGRESS_NOTE";
})(MentalHealthRecordType || (exports.MentalHealthRecordType = MentalHealthRecordType = {}));
var RiskLevel;
(function (RiskLevel) {
    RiskLevel["NONE"] = "NONE";
    RiskLevel["LOW"] = "LOW";
    RiskLevel["MODERATE"] = "MODERATE";
    RiskLevel["HIGH"] = "HIGH";
    RiskLevel["CRITICAL"] = "CRITICAL";
})(RiskLevel || (exports.RiskLevel = RiskLevel = {}));
let MentalHealthRecord = class MentalHealthRecord extends sequelize_typescript_1.Model {
    studentId;
    recordType;
    recordDate;
    counselorId;
    therapistId;
    psychiatristId;
    title;
    sessionNotes;
    assessment;
    diagnosis;
    diagnosisCode;
    treatmentPlan;
    riskLevel;
    riskFactors;
    protectiveFactors;
    interventions;
    followUpRequired;
    followUpDate;
    followUpCompleted;
    referralTo;
    referralReason;
    confidentialityLevel;
    parentNotified;
    parentNotificationDate;
    attachments;
    metadata;
    createdBy;
    updatedBy;
    accessLog;
    logAccess(userId, action) {
        if (!this.accessLog) {
            this.accessLog = [];
        }
        this.accessLog.push({
            userId,
            accessDate: new Date(),
            action,
        });
    }
    isFollowUpOverdue() {
        if (!this.followUpRequired ||
            !this.followUpDate ||
            this.followUpCompleted) {
            return false;
        }
        return new Date() > this.followUpDate;
    }
    isHighRisk() {
        return (this.riskLevel === RiskLevel.HIGH || this.riskLevel === RiskLevel.CRITICAL);
    }
    getDaysUntilFollowUp() {
        if (!this.followUpRequired ||
            !this.followUpDate ||
            this.followUpCompleted) {
            return null;
        }
        const diff = this.followUpDate.getTime() - new Date().getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }
    requiresParentNotification() {
        return this.isHighRisk() && !this.parentNotified;
    }
    static async auditPHIAccess(instance) {
        await (0, model_audit_hooks_service_1.createModelAuditHook)('MentalHealthRecord', instance);
    }
};
exports.MentalHealthRecord = MentalHealthRecord;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(() => (0, uuid_1.v4)()),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], MentalHealthRecord.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => require('./student.model').Student),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], MentalHealthRecord.prototype, "studentId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(MentalHealthRecordType)],
        },
        allowNull: false,
    }),
    __metadata("design:type", String)
], MentalHealthRecord.prototype, "recordType", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
    }),
    __metadata("design:type", Date)
], MentalHealthRecord.prototype, "recordDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
    }),
    __metadata("design:type", String)
], MentalHealthRecord.prototype, "counselorId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
    }),
    __metadata("design:type", String)
], MentalHealthRecord.prototype, "therapistId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
    }),
    __metadata("design:type", String)
], MentalHealthRecord.prototype, "psychiatristId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(200),
        allowNull: false,
    }),
    __metadata("design:type", String)
], MentalHealthRecord.prototype, "title", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: false,
    }),
    __metadata("design:type", String)
], MentalHealthRecord.prototype, "sessionNotes", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], MentalHealthRecord.prototype, "assessment", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], MentalHealthRecord.prototype, "diagnosis", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(20),
    }),
    __metadata("design:type", String)
], MentalHealthRecord.prototype, "diagnosisCode", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
    }),
    __metadata("design:type", String)
], MentalHealthRecord.prototype, "treatmentPlan", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(RiskLevel)],
        },
        allowNull: false,
        defaultValue: RiskLevel.NONE,
    }),
    __metadata("design:type", String)
], MentalHealthRecord.prototype, "riskLevel", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.TEXT),
    }),
    __metadata("design:type", Array)
], MentalHealthRecord.prototype, "riskFactors", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.TEXT),
    }),
    __metadata("design:type", Array)
], MentalHealthRecord.prototype, "protectiveFactors", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.TEXT),
    }),
    __metadata("design:type", Array)
], MentalHealthRecord.prototype, "interventions", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
    }),
    __metadata("design:type", Boolean)
], MentalHealthRecord.prototype, "followUpRequired", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
    }),
    __metadata("design:type", Date)
], MentalHealthRecord.prototype, "followUpDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
    }),
    __metadata("design:type", Boolean)
], MentalHealthRecord.prototype, "followUpCompleted", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(200),
    }),
    __metadata("design:type", String)
], MentalHealthRecord.prototype, "referralTo", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
    }),
    __metadata("design:type", String)
], MentalHealthRecord.prototype, "referralReason", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM('STANDARD', 'ENHANCED', 'MAXIMUM'),
        allowNull: false,
        defaultValue: 'STANDARD',
    }),
    __metadata("design:type", String)
], MentalHealthRecord.prototype, "confidentialityLevel", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
    }),
    __metadata("design:type", Boolean)
], MentalHealthRecord.prototype, "parentNotified", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
    }),
    __metadata("design:type", Date)
], MentalHealthRecord.prototype, "parentNotificationDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)([]),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        allowNull: false,
    }),
    __metadata("design:type", Array)
], MentalHealthRecord.prototype, "attachments", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB),
    __metadata("design:type", Object)
], MentalHealthRecord.prototype, "metadata", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
    }),
    __metadata("design:type", String)
], MentalHealthRecord.prototype, "createdBy", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
    }),
    __metadata("design:type", String)
], MentalHealthRecord.prototype, "updatedBy", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)([]),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSONB,
    }),
    __metadata("design:type", Array)
], MentalHealthRecord.prototype, "accessLog", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
    }),
    __metadata("design:type", Date)
], MentalHealthRecord.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
    }),
    __metadata("design:type", Date)
], MentalHealthRecord.prototype, "updatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./student.model').Student),
    __metadata("design:type", Object)
], MentalHealthRecord.prototype, "student", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [MentalHealthRecord]),
    __metadata("design:returntype", Promise)
], MentalHealthRecord, "auditPHIAccess", null);
exports.MentalHealthRecord = MentalHealthRecord = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                deletedAt: null,
            },
            order: [['createdAt', 'DESC']],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'mental_health_records',
        timestamps: true,
        underscored: false,
        paranoid: true,
        indexes: [
            {
                fields: ['studentId'],
                name: 'mental_health_records_student_id_idx',
            },
            {
                fields: ['recordType'],
                name: 'mental_health_records_record_type_idx',
            },
            {
                fields: ['riskLevel'],
                name: 'mental_health_records_risk_level_idx',
            },
            {
                fields: ['counselorId'],
                name: 'mental_health_records_counselor_id_idx',
            },
            {
                fields: ['recordDate'],
                name: 'mental_health_records_record_date_idx',
            },
            {
                fields: ['followUpRequired', 'followUpDate'],
                name: 'mental_health_records_follow_up_idx',
            },
            {
                fields: ['studentId', 'recordDate'],
                name: 'mental_health_records_student_date_idx',
            },
            {
                fields: ['createdAt'],
                name: 'idx_mental_health_record_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_mental_health_record_updated_at',
            },
        ],
    })
], MentalHealthRecord);
//# sourceMappingURL=mental-health-record.model.js.map