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
exports.HealthDomainCreateAllergyDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const allergy_interface_1 = require("../../health-record/interfaces/allergy.interface");
class HealthDomainCreateAllergyDto {
    studentId;
    allergen;
    allergyType;
    severity;
    symptoms;
    reaction;
    treatment;
    verified;
    verifiedBy;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentId: { required: true, type: () => String }, allergen: { required: true, type: () => String }, allergyType: { required: true, enum: require("../../health-record/interfaces/allergy.interface").AllergyType }, severity: { required: true, enum: require("../../health-record/interfaces/allergy.interface").AllergySeverity }, symptoms: { required: false, type: () => String }, reaction: { required: false, type: () => String }, treatment: { required: false, type: () => String }, verified: { required: false, type: () => Boolean }, verifiedBy: { required: false, type: () => String } };
    }
}
exports.HealthDomainCreateAllergyDto = HealthDomainCreateAllergyDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HealthDomainCreateAllergyDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HealthDomainCreateAllergyDto.prototype, "allergen", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: allergy_interface_1.AllergyType }),
    (0, class_validator_1.IsEnum)(allergy_interface_1.AllergyType),
    __metadata("design:type", String)
], HealthDomainCreateAllergyDto.prototype, "allergyType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: allergy_interface_1.AllergySeverity }),
    (0, class_validator_1.IsEnum)(allergy_interface_1.AllergySeverity),
    __metadata("design:type", String)
], HealthDomainCreateAllergyDto.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HealthDomainCreateAllergyDto.prototype, "symptoms", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HealthDomainCreateAllergyDto.prototype, "reaction", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HealthDomainCreateAllergyDto.prototype, "treatment", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], HealthDomainCreateAllergyDto.prototype, "verified", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HealthDomainCreateAllergyDto.prototype, "verifiedBy", void 0);
//# sourceMappingURL=create-allergy.dto.js.map