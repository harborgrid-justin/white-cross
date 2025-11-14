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
exports.ReportTemplate = exports.OutputFormat = exports.ReportType = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const uuid_1 = require("uuid");
const model_audit_hooks_service_1 = require("../services/model-audit-hooks.service");
var ReportType;
(function (ReportType) {
    ReportType["HEALTH_TRENDS"] = "health_trends";
    ReportType["MEDICATION_USAGE"] = "medication_usage";
    ReportType["INCIDENT_STATISTICS"] = "incident_statistics";
    ReportType["ATTENDANCE_CORRELATION"] = "attendance_correlation";
    ReportType["COMPLIANCE"] = "compliance";
    ReportType["DASHBOARD"] = "dashboard";
    ReportType["PERFORMANCE"] = "performance";
    ReportType["CUSTOM"] = "custom";
})(ReportType || (exports.ReportType = ReportType = {}));
var OutputFormat;
(function (OutputFormat) {
    OutputFormat["PDF"] = "pdf";
    OutputFormat["EXCEL"] = "excel";
    OutputFormat["CSV"] = "csv";
    OutputFormat["JSON"] = "json";
})(OutputFormat || (exports.OutputFormat = OutputFormat = {}));
let ReportTemplate = class ReportTemplate extends sequelize_typescript_1.Model {
    name;
    description;
    reportType;
    queryConfiguration;
    defaultOutputFormat;
    formatOptions;
    isActive;
    createdBy;
    static async auditPHIAccess(instance) {
        await (0, model_audit_hooks_service_1.createModelAuditHook)('ReportTemplate', instance);
    }
};
exports.ReportTemplate = ReportTemplate;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(() => (0, uuid_1.v4)()),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], ReportTemplate.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: false,
    }),
    __metadata("design:type", String)
], ReportTemplate.prototype, "name", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], ReportTemplate.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(ReportType)],
        },
        allowNull: false,
    }),
    __metadata("design:type", String)
], ReportTemplate.prototype, "reportType", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSONB,
    }),
    __metadata("design:type", Object)
], ReportTemplate.prototype, "queryConfiguration", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(OutputFormat)],
        },
        allowNull: false,
        defaultValue: OutputFormat.PDF,
    }),
    __metadata("design:type", String)
], ReportTemplate.prototype, "defaultOutputFormat", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSONB,
    }),
    __metadata("design:type", Object)
], ReportTemplate.prototype, "formatOptions", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    }),
    __metadata("design:type", Boolean)
], ReportTemplate.prototype, "isActive", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
    }),
    __metadata("design:type", String)
], ReportTemplate.prototype, "createdBy", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], ReportTemplate.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], ReportTemplate.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ReportTemplate]),
    __metadata("design:returntype", Promise)
], ReportTemplate, "auditPHIAccess", null);
exports.ReportTemplate = ReportTemplate = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                deletedAt: null,
            },
            order: [['createdAt', 'DESC']],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'report_templates',
        timestamps: true,
        underscored: false,
        indexes: [
            {
                fields: ['reportType'],
            },
            {
                fields: ['createdAt'],
                name: 'idx_report_template_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_report_template_updated_at',
            },
        ],
    })
], ReportTemplate);
//# sourceMappingURL=report-template.model.js.map