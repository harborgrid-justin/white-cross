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
exports.IncidentStatisticsDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const base_report_dto_1 = require("./base-report.dto");
class IncidentStatisticsDto extends base_report_dto_1.BaseReportDto {
    incidentType;
    severity;
    includeTypeBreakdown = true;
    includeSeverityAnalysis = true;
    includeMonthlyTrends = true;
    includeCompliance = true;
    static _OPENAPI_METADATA_FACTORY() {
        return { incidentType: { required: false, type: () => String }, severity: { required: false, type: () => String }, includeTypeBreakdown: { required: false, type: () => Boolean, default: true }, includeSeverityAnalysis: { required: false, type: () => Boolean, default: true }, includeMonthlyTrends: { required: false, type: () => Boolean, default: true }, includeCompliance: { required: false, type: () => Boolean, default: true } };
    }
}
exports.IncidentStatisticsDto = IncidentStatisticsDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by specific incident type',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['INJURY', 'ILLNESS', 'BEHAVIORAL', 'MEDICATION_ERROR', 'OTHER']),
    __metadata("design:type", String)
], IncidentStatisticsDto.prototype, "incidentType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by specific severity level',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['MINOR', 'MODERATE', 'SEVERE', 'CRITICAL']),
    __metadata("design:type", String)
], IncidentStatisticsDto.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include type breakdown',
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], IncidentStatisticsDto.prototype, "includeTypeBreakdown", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include severity analysis',
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], IncidentStatisticsDto.prototype, "includeSeverityAnalysis", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include monthly trends',
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], IncidentStatisticsDto.prototype, "includeMonthlyTrends", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include compliance statistics',
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], IncidentStatisticsDto.prototype, "includeCompliance", void 0);
//# sourceMappingURL=incident-statistics.dto.js.map