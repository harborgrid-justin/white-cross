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
exports.CreateAllergyDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const enums_1 = require("../../../common/enums");
const models_1 = require("../../../database/models");
class CreateAllergyDto {
    studentId;
    allergen;
    allergenType;
    severity;
    reaction;
    treatment;
    verified;
    verifiedBy;
    notes;
    healthRecordId;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentId: { required: true, type: () => String, description: "Student's unique identifier", format: "uuid" }, allergen: { required: true, type: () => String, description: "Name of allergen (medication, food, environmental substance)", maxLength: 255 }, allergenType: { required: false, description: "Category of allergen", enum: require("../../../database/models/allergy.model").AllergyType }, severity: { required: true, description: "Clinical severity classification", enum: require("../../../common/enums").AllergySeverity }, reaction: { required: false, type: () => String, description: "Description of allergic reaction symptoms", maxLength: 1000 }, treatment: { required: false, type: () => String, description: "Emergency treatment protocol", maxLength: 2000 }, verified: { required: true, type: () => Boolean, description: "Whether allergy has been clinically verified" }, verifiedBy: { required: false, type: () => String, description: "Healthcare professional who verified the allergy", format: "uuid" }, notes: { required: false, type: () => String, description: "Additional clinical notes", maxLength: 5000 }, healthRecordId: { required: false, type: () => String, description: "Link to comprehensive health record", format: "uuid" } };
    }
}
exports.CreateAllergyDto = CreateAllergyDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student UUID',
        example: '550e8400-e29b-41d4-a716-446655440000',
        format: 'uuid',
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAllergyDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Name of the allergen (medication, food, or environmental substance)',
        example: 'Peanuts',
        maxLength: 255,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateAllergyDto.prototype, "allergen", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Category of allergen',
        enum: models_1.AllergyType,
        example: models_1.AllergyType.FOOD || 'FOOD',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(models_1.AllergyType),
    __metadata("design:type", String)
], CreateAllergyDto.prototype, "allergenType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Clinical severity classification of the allergic reaction',
        enum: enums_1.AllergySeverity,
        example: enums_1.AllergySeverity.SEVERE || 'SEVERE',
    }),
    (0, class_validator_1.IsEnum)(enums_1.AllergySeverity),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAllergyDto.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Description of allergic reaction symptoms (maximum 1000 characters)',
        example: 'Anaphylaxis, hives, difficulty breathing, throat swelling',
        maxLength: 1000,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000, {
        message: 'Reaction description cannot exceed 1000 characters',
    }),
    __metadata("design:type", String)
], CreateAllergyDto.prototype, "reaction", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Emergency treatment protocol and instructions (maximum 2000 characters)',
        example: 'Administer EpiPen immediately, call 911, monitor airway',
        maxLength: 2000,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2000, {
        message: 'Treatment protocol cannot exceed 2000 characters',
    }),
    __metadata("design:type", String)
], CreateAllergyDto.prototype, "treatment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the allergy has been clinically verified by a healthcare professional',
        example: true,
        type: Boolean,
    }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateAllergyDto.prototype, "verified", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'UUID of the healthcare professional who verified this allergy',
        example: '123e4567-e89b-12d3-a456-426614174000',
        format: 'uuid',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateAllergyDto.prototype, "verifiedBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional clinical notes and observations (maximum 5000 characters)',
        example: 'Patient experienced anaphylaxis during school lunch. Parent confirmed previous diagnosis.',
        maxLength: 5000,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(5000, { message: 'Notes cannot exceed 5000 characters' }),
    __metadata("design:type", String)
], CreateAllergyDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'UUID of associated comprehensive health record',
        example: '987e6543-e21b-43c5-a789-123456789abc',
        format: 'uuid',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateAllergyDto.prototype, "healthRecordId", void 0);
//# sourceMappingURL=create-allergy.dto.js.map