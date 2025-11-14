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
exports.HealthTrendsDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const base_report_dto_1 = require("./base-report.dto");
const enums_1 = require("../../common/enums");
class HealthTrendsDto extends base_report_dto_1.BaseReportDto {
    recordType;
    includeChronicConditions = true;
    includeAllergies = true;
    includeMonthlyTrends = true;
    static _OPENAPI_METADATA_FACTORY() {
        return { recordType: { required: false, enum: require("../../common/enums").HealthRecordType }, includeChronicConditions: { required: false, type: () => Boolean, default: true }, includeAllergies: { required: false, type: () => Boolean, default: true }, includeMonthlyTrends: { required: false, type: () => Boolean, default: true } };
    }
}
exports.HealthTrendsDto = HealthTrendsDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: enums_1.HealthRecordType,
        description: 'Filter by specific health record type',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(enums_1.HealthRecordType),
    __metadata("design:type", String)
], HealthTrendsDto.prototype, "recordType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include chronic conditions in report',
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], HealthTrendsDto.prototype, "includeChronicConditions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include allergies in report',
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], HealthTrendsDto.prototype, "includeAllergies", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include monthly trends',
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], HealthTrendsDto.prototype, "includeMonthlyTrends", void 0);
//# sourceMappingURL=health-trends.dto.js.map