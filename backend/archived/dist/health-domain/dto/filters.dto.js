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
exports.VaccinationFiltersDto = exports.ChronicConditionFiltersDto = exports.AllergyFiltersDto = exports.HealthRecordFiltersDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const health_record_types_1 = require("../../health-record/interfaces/health-record-types");
const allergy_interface_1 = require("../../health-record/interfaces/allergy.interface");
const chronic_condition_interface_1 = require("../../health-record/interfaces/chronic-condition.interface");
const vaccination_interface_1 = require("../../health-record/interfaces/vaccination.interface");
class HealthRecordFiltersDto {
    type;
    dateFrom;
    dateTo;
    provider;
    static _OPENAPI_METADATA_FACTORY() {
        return { type: { required: false, enum: require("../../health-record/interfaces/health-record-types").HealthRecordType }, dateFrom: { required: false, type: () => Date }, dateTo: { required: false, type: () => Date }, provider: { required: false, type: () => String } };
    }
}
exports.HealthRecordFiltersDto = HealthRecordFiltersDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: health_record_types_1.HealthRecordType }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(health_record_types_1.HealthRecordType),
    __metadata("design:type", String)
], HealthRecordFiltersDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], HealthRecordFiltersDto.prototype, "dateFrom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], HealthRecordFiltersDto.prototype, "dateTo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HealthRecordFiltersDto.prototype, "provider", void 0);
class AllergyFiltersDto {
    severity;
    verified;
    allergen;
    static _OPENAPI_METADATA_FACTORY() {
        return { severity: { required: false, enum: require("../../health-record/interfaces/allergy.interface").AllergySeverity }, verified: { required: false, type: () => Boolean }, allergen: { required: false, type: () => String } };
    }
}
exports.AllergyFiltersDto = AllergyFiltersDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: allergy_interface_1.AllergySeverity }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(allergy_interface_1.AllergySeverity),
    __metadata("design:type", String)
], AllergyFiltersDto.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AllergyFiltersDto.prototype, "verified", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AllergyFiltersDto.prototype, "allergen", void 0);
class ChronicConditionFiltersDto {
    status;
    severity;
    condition;
    static _OPENAPI_METADATA_FACTORY() {
        return { status: { required: false, enum: require("../../health-record/interfaces/chronic-condition.interface").ConditionStatus }, severity: { required: false, enum: require("../../health-record/interfaces/chronic-condition.interface").ConditionSeverity }, condition: { required: false, type: () => String } };
    }
}
exports.ChronicConditionFiltersDto = ChronicConditionFiltersDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: chronic_condition_interface_1.ConditionStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(chronic_condition_interface_1.ConditionStatus),
    __metadata("design:type", String)
], ChronicConditionFiltersDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: chronic_condition_interface_1.ConditionSeverity }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(chronic_condition_interface_1.ConditionSeverity),
    __metadata("design:type", String)
], ChronicConditionFiltersDto.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ChronicConditionFiltersDto.prototype, "condition", void 0);
class VaccinationFiltersDto {
    vaccineType;
    dateFrom;
    dateTo;
    cvxCode;
    seriesComplete;
    static _OPENAPI_METADATA_FACTORY() {
        return { vaccineType: { required: false, enum: require("../../health-record/interfaces/vaccination.interface").VaccineType }, dateFrom: { required: false, type: () => Date }, dateTo: { required: false, type: () => Date }, cvxCode: { required: false, type: () => String }, seriesComplete: { required: false, type: () => Boolean } };
    }
}
exports.VaccinationFiltersDto = VaccinationFiltersDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: vaccination_interface_1.VaccineType }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(vaccination_interface_1.VaccineType),
    __metadata("design:type", String)
], VaccinationFiltersDto.prototype, "vaccineType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], VaccinationFiltersDto.prototype, "dateFrom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], VaccinationFiltersDto.prototype, "dateTo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VaccinationFiltersDto.prototype, "cvxCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], VaccinationFiltersDto.prototype, "seriesComplete", void 0);
//# sourceMappingURL=filters.dto.js.map