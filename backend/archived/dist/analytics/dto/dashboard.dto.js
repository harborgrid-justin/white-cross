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
exports.GetPlatformSummaryQueryDto = exports.GetAdminDashboardQueryDto = exports.GetNurseDashboardQueryDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class GetNurseDashboardQueryDto {
    schoolId;
    timeRange;
    includeAlerts;
    includeUpcoming;
    static _OPENAPI_METADATA_FACTORY() {
        return { schoolId: { required: false, type: () => String }, timeRange: { required: false, type: () => String }, includeAlerts: { required: false, type: () => Boolean }, includeUpcoming: { required: false, type: () => Boolean } };
    }
}
exports.GetNurseDashboardQueryDto = GetNurseDashboardQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'School ID', default: 'default-school' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetNurseDashboardQueryDto.prototype, "schoolId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Time range for dashboard data',
        enum: ['TODAY', 'WEEK', 'MONTH'],
        default: 'TODAY',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetNurseDashboardQueryDto.prototype, "timeRange", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include active health alerts',
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Type)(() => Boolean),
    __metadata("design:type", Boolean)
], GetNurseDashboardQueryDto.prototype, "includeAlerts", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include upcoming tasks and appointments',
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Type)(() => Boolean),
    __metadata("design:type", Boolean)
], GetNurseDashboardQueryDto.prototype, "includeUpcoming", void 0);
class GetAdminDashboardQueryDto {
    districtId;
    schoolId;
    timeRange;
    includeComplianceMetrics;
    includeFinancialData;
    static _OPENAPI_METADATA_FACTORY() {
        return { districtId: { required: false, type: () => String }, schoolId: { required: false, type: () => String }, timeRange: { required: false, type: () => String }, includeComplianceMetrics: { required: false, type: () => Boolean }, includeFinancialData: { required: false, type: () => Boolean } };
    }
}
exports.GetAdminDashboardQueryDto = GetAdminDashboardQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'District ID for district-wide analytics',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetAdminDashboardQueryDto.prototype, "districtId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'School ID', default: 'default-school' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetAdminDashboardQueryDto.prototype, "schoolId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Time range for dashboard data',
        enum: ['TODAY', 'WEEK', 'MONTH', 'QUARTER', 'YEAR'],
        default: 'MONTH',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetAdminDashboardQueryDto.prototype, "timeRange", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include compliance metrics',
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Type)(() => Boolean),
    __metadata("design:type", Boolean)
], GetAdminDashboardQueryDto.prototype, "includeComplianceMetrics", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include financial data',
        default: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Type)(() => Boolean),
    __metadata("design:type", Boolean)
], GetAdminDashboardQueryDto.prototype, "includeFinancialData", void 0);
class GetPlatformSummaryQueryDto {
    districtId;
    schoolIds;
    startDate;
    endDate;
    includeDetails;
    static _OPENAPI_METADATA_FACTORY() {
        return { districtId: { required: false, type: () => String }, schoolIds: { required: false, type: () => [String] }, startDate: { required: false, type: () => Date }, endDate: { required: false, type: () => Date }, includeDetails: { required: false, type: () => Boolean } };
    }
}
exports.GetPlatformSummaryQueryDto = GetPlatformSummaryQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'District ID for filtering' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetPlatformSummaryQueryDto.prototype, "districtId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [String],
        description: 'School IDs to include in summary',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], GetPlatformSummaryQueryDto.prototype, "schoolIds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Start date for summary period' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], GetPlatformSummaryQueryDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'End date for summary period' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], GetPlatformSummaryQueryDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include detailed breakdown',
        default: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Type)(() => Boolean),
    __metadata("design:type", Boolean)
], GetPlatformSummaryQueryDto.prototype, "includeDetails", void 0);
//# sourceMappingURL=dashboard.dto.js.map