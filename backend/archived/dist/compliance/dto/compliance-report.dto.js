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
exports.QueryComplianceReportDto = exports.ComplianceGenerateReportDto = exports.UpdateComplianceReportDto = exports.CreateComplianceReportDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const models_1 = require("../../database/models");
class CreateComplianceReportDto {
    reportType;
    title;
    description;
    period;
    dueDate;
    static _OPENAPI_METADATA_FACTORY() {
        return { reportType: { required: true, enum: require("../../database/models/compliance-report.model").ComplianceReportType }, title: { required: true, type: () => String, minLength: 5, maxLength: 200 }, description: { required: false, type: () => String }, period: { required: true, type: () => String }, dueDate: { required: false, type: () => String } };
    }
}
exports.CreateComplianceReportDto = CreateComplianceReportDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: models_1.ComplianceReportType,
        description: 'Type of compliance report',
    }),
    (0, class_validator_1.IsEnum)(models_1.ComplianceReportType),
    __metadata("design:type", String)
], CreateComplianceReportDto.prototype, "reportType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Report title (5-200 chars)',
        minLength: 5,
        maxLength: 200,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateComplianceReportDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Detailed report description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateComplianceReportDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Reporting period (e.g., 2024-Q1)' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateComplianceReportDto.prototype, "period", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Report due date (ISO 8601)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateComplianceReportDto.prototype, "dueDate", void 0);
class UpdateComplianceReportDto {
    status;
    findings;
    recommendations;
    reviewedBy;
    static _OPENAPI_METADATA_FACTORY() {
        return { status: { required: false, enum: require("../../database/models/compliance-report.model").ComplianceStatus }, findings: { required: false, type: () => Object }, recommendations: { required: false, type: () => Object }, reviewedBy: { required: false, type: () => String } };
    }
}
exports.UpdateComplianceReportDto = UpdateComplianceReportDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: models_1.ComplianceStatus,
        description: 'Updated status',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(models_1.ComplianceStatus),
    __metadata("design:type", String)
], UpdateComplianceReportDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Structured findings data' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateComplianceReportDto.prototype, "findings", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Structured recommendations' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateComplianceReportDto.prototype, "recommendations", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Reviewer user ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateComplianceReportDto.prototype, "reviewedBy", void 0);
class ComplianceGenerateReportDto {
    reportType;
    period;
    startDate;
    endDate;
    includeRecommendations;
    static _OPENAPI_METADATA_FACTORY() {
        return { reportType: { required: true, enum: require("../../database/models/compliance-report.model").ComplianceReportType }, period: { required: true, type: () => String }, startDate: { required: false, type: () => String }, endDate: { required: false, type: () => String }, includeRecommendations: { required: false, type: () => Boolean } };
    }
}
exports.ComplianceGenerateReportDto = ComplianceGenerateReportDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: models_1.ComplianceReportType,
        description: 'Report type to generate',
    }),
    (0, class_validator_1.IsEnum)(models_1.ComplianceReportType),
    __metadata("design:type", String)
], ComplianceGenerateReportDto.prototype, "reportType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Reporting period' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ComplianceGenerateReportDto.prototype, "period", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Start date for data collection (ISO 8601)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ComplianceGenerateReportDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'End date for data collection (ISO 8601)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ComplianceGenerateReportDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include automated recommendations',
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], ComplianceGenerateReportDto.prototype, "includeRecommendations", void 0);
class QueryComplianceReportDto {
    reportType;
    status;
    period;
    page;
    limit;
    static _OPENAPI_METADATA_FACTORY() {
        return { reportType: { required: false, enum: require("../../database/models/compliance-report.model").ComplianceReportType }, status: { required: false, enum: require("../../database/models/compliance-report.model").ComplianceStatus }, period: { required: false, type: () => String }, page: { required: false, type: () => Number }, limit: { required: false, type: () => Number } };
    }
}
exports.QueryComplianceReportDto = QueryComplianceReportDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: models_1.ComplianceReportType,
        description: 'Filter by report type',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(models_1.ComplianceReportType),
    __metadata("design:type", String)
], QueryComplianceReportDto.prototype, "reportType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: models_1.ComplianceStatus,
        description: 'Filter by status',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(models_1.ComplianceStatus),
    __metadata("design:type", String)
], QueryComplianceReportDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by period' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryComplianceReportDto.prototype, "period", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Page number', default: 1 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], QueryComplianceReportDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Items per page', default: 20 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], QueryComplianceReportDto.prototype, "limit", void 0);
//# sourceMappingURL=compliance-report.dto.js.map