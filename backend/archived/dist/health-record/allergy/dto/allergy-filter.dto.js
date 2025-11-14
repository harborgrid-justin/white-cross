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
exports.AllergyFilterDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const models_1 = require("../../../database/models");
class AllergyFilterDto {
    studentId;
    allergyType;
    severity;
    query;
    active;
    verified;
    epiPenRequired;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentId: { required: false, type: () => String, format: "uuid" }, allergyType: { required: false, enum: require("../../../database/models/allergy.model").AllergyType }, severity: { required: false, enum: require("../../../database/models/allergy.model").AllergySeverity }, query: { required: false, type: () => String }, active: { required: false, type: () => Boolean }, verified: { required: false, type: () => Boolean }, epiPenRequired: { required: false, type: () => Boolean } };
    }
}
exports.AllergyFilterDto = AllergyFilterDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by student ID (UUID)',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], AllergyFilterDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by allergy type',
        enum: models_1.AllergyType,
        example: models_1.AllergyType.FOOD,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(models_1.AllergyType),
    __metadata("design:type", String)
], AllergyFilterDto.prototype, "allergyType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by severity level',
        enum: models_1.AllergySeverity,
        example: models_1.AllergySeverity.SEVERE,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(models_1.AllergySeverity),
    __metadata("design:type", String)
], AllergyFilterDto.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Search query for allergen name, symptoms, or notes',
        example: 'peanut',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AllergyFilterDto.prototype, "query", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by active status',
        example: true,
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Boolean),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AllergyFilterDto.prototype, "active", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by verification status',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Boolean),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AllergyFilterDto.prototype, "verified", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by EpiPen requirement',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Boolean),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AllergyFilterDto.prototype, "epiPenRequired", void 0);
//# sourceMappingURL=allergy-filter.dto.js.map