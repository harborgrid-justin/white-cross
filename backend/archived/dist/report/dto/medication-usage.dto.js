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
exports.MedicationUsageDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const base_report_dto_1 = require("./base-report.dto");
class MedicationUsageDto extends base_report_dto_1.BaseReportDto {
    medicationId;
    includeAdverseReactions = true;
    includeTopMedications = true;
    includeCompliance = true;
    static _OPENAPI_METADATA_FACTORY() {
        return { medicationId: { required: false, type: () => String, format: "uuid" }, includeAdverseReactions: { required: false, type: () => Boolean, default: true }, includeTopMedications: { required: false, type: () => Boolean, default: true }, includeCompliance: { required: false, type: () => Boolean, default: true } };
    }
}
exports.MedicationUsageDto = MedicationUsageDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by specific medication ID',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], MedicationUsageDto.prototype, "medicationId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include adverse reactions in report',
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], MedicationUsageDto.prototype, "includeAdverseReactions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include top medications analysis',
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], MedicationUsageDto.prototype, "includeTopMedications", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include compliance statistics',
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], MedicationUsageDto.prototype, "includeCompliance", void 0);
//# sourceMappingURL=medication-usage.dto.js.map