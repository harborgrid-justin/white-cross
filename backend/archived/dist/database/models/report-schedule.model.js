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
exports.ReportSchedule = exports.ScheduleFrequency = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const uuid_1 = require("uuid");
const report_execution_model_1 = require("./report-execution.model");
const model_audit_hooks_service_1 = require("../services/model-audit-hooks.service");
var ScheduleFrequency;
(function (ScheduleFrequency) {
    ScheduleFrequency["DAILY"] = "daily";
    ScheduleFrequency["WEEKLY"] = "weekly";
    ScheduleFrequency["MONTHLY"] = "monthly";
    ScheduleFrequency["QUARTERLY"] = "quarterly";
    ScheduleFrequency["CUSTOM"] = "custom";
})(ScheduleFrequency || (exports.ScheduleFrequency = ScheduleFrequency = {}));
let ReportSchedule = class ReportSchedule extends sequelize_typescript_1.Model {
    name;
    reportType;
    templateId;
    frequency;
    cronExpression;
    outputFormat;
    parameters;
    recipients;
    isActive;
    lastExecutedAt;
    nextExecutionAt;
    executionCount;
    failureCount;
    lastError;
    createdBy;
    static async auditPHIAccess(instance) {
        await (0, model_audit_hooks_service_1.createModelAuditHook)('ReportSchedule', instance);
    }
};
exports.ReportSchedule = ReportSchedule;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(() => (0, uuid_1.v4)()),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], ReportSchedule.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: false,
    }),
    __metadata("design:type", String)
], ReportSchedule.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(report_execution_model_1.ReportType)],
        },
        allowNull: false,
    }),
    __metadata("design:type", String)
], ReportSchedule.prototype, "reportType", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.ForeignKey)(() => require('./report-template.model').ReportTemplate),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
    }),
    __metadata("design:type", String)
], ReportSchedule.prototype, "templateId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./report-template.model').ReportTemplate, {
        foreignKey: 'templateId',
        as: 'template',
    }),
    __metadata("design:type", Object)
], ReportSchedule.prototype, "template", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(ScheduleFrequency)],
        },
        allowNull: false,
    }),
    __metadata("design:type", String)
], ReportSchedule.prototype, "frequency", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
    }),
    __metadata("design:type", String)
], ReportSchedule.prototype, "cronExpression", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(report_execution_model_1.OutputFormat)],
        },
        allowNull: false,
        defaultValue: report_execution_model_1.OutputFormat.PDF,
    }),
    __metadata("design:type", String)
], ReportSchedule.prototype, "outputFormat", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB),
    __metadata("design:type", Object)
], ReportSchedule.prototype, "parameters", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        allowNull: false,
        defaultValue: [],
    }),
    __metadata("design:type", Array)
], ReportSchedule.prototype, "recipients", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    }),
    __metadata("design:type", Boolean)
], ReportSchedule.prototype, "isActive", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
    }),
    __metadata("design:type", Date)
], ReportSchedule.prototype, "lastExecutedAt", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
    }),
    __metadata("design:type", Date)
], ReportSchedule.prototype, "nextExecutionAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], ReportSchedule.prototype, "executionCount", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], ReportSchedule.prototype, "failureCount", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
    }),
    __metadata("design:type", String)
], ReportSchedule.prototype, "lastError", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
    }),
    __metadata("design:type", String)
], ReportSchedule.prototype, "createdBy", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], ReportSchedule.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], ReportSchedule.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ReportSchedule]),
    __metadata("design:returntype", Promise)
], ReportSchedule, "auditPHIAccess", null);
exports.ReportSchedule = ReportSchedule = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                deletedAt: null,
            },
            order: [['createdAt', 'DESC']],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'report_schedules',
        timestamps: true,
        underscored: false,
        indexes: [
            {
                fields: ['createdAt'],
                name: 'idx_report_schedule_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_report_schedule_updated_at',
            },
        ],
    })
], ReportSchedule);
//# sourceMappingURL=report-schedule.model.js.map