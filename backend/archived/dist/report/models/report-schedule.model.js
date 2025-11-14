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
exports.ReportSchedule = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const report_template_model_1 = require("./report-template.model");
const report_constants_1 = require("../constants/report.constants");
let ReportSchedule = class ReportSchedule extends sequelize_typescript_1.Model {
    name;
    reportType;
    templateId;
    template;
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
};
exports.ReportSchedule = ReportSchedule;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
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
        type: sequelize_typescript_1.DataType.ENUM(...Object.values(report_constants_1.ReportType)),
        allowNull: false,
    }),
    __metadata("design:type", String)
], ReportSchedule.prototype, "reportType", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => report_template_model_1.ReportTemplate),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
    }),
    __metadata("design:type", String)
], ReportSchedule.prototype, "templateId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => report_template_model_1.ReportTemplate),
    __metadata("design:type", report_template_model_1.ReportTemplate)
], ReportSchedule.prototype, "template", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM(...Object.values(report_constants_1.ScheduleFrequency)),
        allowNull: false,
    }),
    __metadata("design:type", String)
], ReportSchedule.prototype, "frequency", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: true,
    }),
    __metadata("design:type", String)
], ReportSchedule.prototype, "cronExpression", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(report_constants_1.OutputFormat.PDF),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM(...Object.values(report_constants_1.OutputFormat)),
        allowNull: false,
    }),
    __metadata("design:type", String)
], ReportSchedule.prototype, "outputFormat", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSONB,
        allowNull: true,
    }),
    __metadata("design:type", Object)
], ReportSchedule.prototype, "parameters", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING),
        allowNull: false,
    }),
    __metadata("design:type", Array)
], ReportSchedule.prototype, "recipients", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(true),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
    }),
    __metadata("design:type", Boolean)
], ReportSchedule.prototype, "isActive", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
    }),
    __metadata("design:type", Date)
], ReportSchedule.prototype, "lastExecutedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
    }),
    __metadata("design:type", Date)
], ReportSchedule.prototype, "nextExecutionAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(0),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], ReportSchedule.prototype, "executionCount", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(0),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], ReportSchedule.prototype, "failureCount", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
    }),
    __metadata("design:type", String)
], ReportSchedule.prototype, "lastError", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
    }),
    __metadata("design:type", String)
], ReportSchedule.prototype, "createdBy", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
    }),
    __metadata("design:type", Date)
], ReportSchedule.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
    }),
    __metadata("design:type", Date)
], ReportSchedule.prototype, "updatedAt", void 0);
exports.ReportSchedule = ReportSchedule = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'report_schedules',
        timestamps: true,
    })
], ReportSchedule);
//# sourceMappingURL=report-schedule.model.js.map