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
exports.HealthDomainCreateChronicConditionDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const chronic_condition_interface_1 = require("../../health-record/interfaces/chronic-condition.interface");
class HealthDomainCreateChronicConditionDto {
    studentId;
    condition;
    icdCode;
    diagnosedDate;
    diagnosedBy;
    status;
    severity;
    notes;
    carePlan;
    medications;
    restrictions;
    triggers;
    accommodations;
    emergencyActionPlan;
    reviewFrequencyMonths;
    requiresIEP;
    requires504;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentId: { required: true, type: () => String }, condition: { required: true, type: () => String }, icdCode: { required: false, type: () => String }, diagnosedDate: { required: true, type: () => Date }, diagnosedBy: { required: false, type: () => String }, status: { required: true, enum: require("../../health-record/interfaces/chronic-condition.interface").ConditionStatus }, severity: { required: false, enum: require("../../health-record/interfaces/chronic-condition.interface").ConditionSeverity }, notes: { required: false, type: () => String }, carePlan: { required: false, type: () => String }, medications: { required: false, type: () => [String] }, restrictions: { required: false, type: () => [String] }, triggers: { required: false, type: () => [String] }, accommodations: { required: false, type: () => [String] }, emergencyActionPlan: { required: false, type: () => String }, reviewFrequencyMonths: { required: false, type: () => Number }, requiresIEP: { required: false, type: () => Boolean }, requires504: { required: false, type: () => Boolean } };
    }
}
exports.HealthDomainCreateChronicConditionDto = HealthDomainCreateChronicConditionDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HealthDomainCreateChronicConditionDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HealthDomainCreateChronicConditionDto.prototype, "condition", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HealthDomainCreateChronicConditionDto.prototype, "icdCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], HealthDomainCreateChronicConditionDto.prototype, "diagnosedDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HealthDomainCreateChronicConditionDto.prototype, "diagnosedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: chronic_condition_interface_1.ConditionStatus }),
    (0, class_validator_1.IsEnum)(chronic_condition_interface_1.ConditionStatus),
    __metadata("design:type", String)
], HealthDomainCreateChronicConditionDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: chronic_condition_interface_1.ConditionSeverity }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(chronic_condition_interface_1.ConditionSeverity),
    __metadata("design:type", String)
], HealthDomainCreateChronicConditionDto.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HealthDomainCreateChronicConditionDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HealthDomainCreateChronicConditionDto.prototype, "carePlan", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], HealthDomainCreateChronicConditionDto.prototype, "medications", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], HealthDomainCreateChronicConditionDto.prototype, "restrictions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], HealthDomainCreateChronicConditionDto.prototype, "triggers", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], HealthDomainCreateChronicConditionDto.prototype, "accommodations", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HealthDomainCreateChronicConditionDto.prototype, "emergencyActionPlan", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], HealthDomainCreateChronicConditionDto.prototype, "reviewFrequencyMonths", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], HealthDomainCreateChronicConditionDto.prototype, "requiresIEP", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], HealthDomainCreateChronicConditionDto.prototype, "requires504", void 0);
//# sourceMappingURL=create-chronic-condition.dto.js.map