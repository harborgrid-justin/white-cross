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
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const models_1 = require("../../../database/models");
class CreateAllergyDto {
    studentId;
    allergen;
    allergyType;
    severity;
    symptoms;
    treatment;
    emergencyProtocol;
    onsetDate;
    diagnosedDate;
    diagnosedBy;
    notes;
    epiPenRequired;
    epiPenLocation;
    epiPenExpiration;
    healthRecordId;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentId: { required: true, type: () => String, format: "uuid" }, allergen: { required: true, type: () => String, minLength: 1, maxLength: 255 }, allergyType: { required: true, enum: require("../../../database/models/allergy.model").AllergyType }, severity: { required: true, enum: require("../../../database/models/allergy.model").AllergySeverity }, symptoms: { required: false, type: () => String, maxLength: 2000 }, treatment: { required: false, type: () => String, maxLength: 2000 }, emergencyProtocol: { required: false, type: () => String, maxLength: 2000 }, onsetDate: { required: false, type: () => String }, diagnosedDate: { required: false, type: () => String }, diagnosedBy: { required: false, type: () => String, maxLength: 255 }, notes: { required: false, type: () => String, maxLength: 2000 }, epiPenRequired: { required: false, type: () => Boolean }, epiPenLocation: { required: false, type: () => String, maxLength: 255 }, epiPenExpiration: { required: false, type: () => String }, healthRecordId: { required: false, type: () => String, format: "uuid" } };
    }
}
exports.CreateAllergyDto = CreateAllergyDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student ID (UUID)',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    (0, class_validator_1.IsUUID)('4'),
    (0, class_validator_1.IsNotEmpty)({ message: 'Student ID is required' }),
    __metadata("design:type", String)
], CreateAllergyDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Allergen name or description',
        example: 'Peanuts',
        minLength: 1,
        maxLength: 255,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Allergen name is required' }),
    (0, class_validator_1.MinLength)(1, { message: 'Allergen name must not be empty' }),
    (0, class_validator_1.MaxLength)(255, { message: 'Allergen name must not exceed 255 characters' }),
    __metadata("design:type", String)
], CreateAllergyDto.prototype, "allergen", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of allergy',
        enum: models_1.AllergyType,
        example: models_1.AllergyType.FOOD,
    }),
    (0, class_validator_1.IsEnum)(models_1.AllergyType, { message: 'Invalid allergy type' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Allergy type is required' }),
    __metadata("design:type", String)
], CreateAllergyDto.prototype, "allergyType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Severity level of the allergy',
        enum: models_1.AllergySeverity,
        example: models_1.AllergySeverity.SEVERE,
    }),
    (0, class_validator_1.IsEnum)(models_1.AllergySeverity, { message: 'Invalid allergy severity' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Allergy severity is required' }),
    __metadata("design:type", String)
], CreateAllergyDto.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Symptoms experienced during allergic reaction',
        example: 'Hives, difficulty breathing, swelling of throat',
        maxLength: 2000,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2000, { message: 'Symptoms must not exceed 2000 characters' }),
    __metadata("design:type", String)
], CreateAllergyDto.prototype, "symptoms", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Treatment administered or recommended',
        example: 'EpiPen, antihistamines',
        maxLength: 2000,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2000, { message: 'Treatment must not exceed 2000 characters' }),
    __metadata("design:type", String)
], CreateAllergyDto.prototype, "treatment", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Emergency protocol to follow',
        example: 'Administer EpiPen immediately and call 911',
        maxLength: 2000,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2000, {
        message: 'Emergency protocol must not exceed 2000 characters',
    }),
    __metadata("design:type", String)
], CreateAllergyDto.prototype, "emergencyProtocol", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Date when allergy first appeared',
        example: '2020-01-15',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'Invalid onset date format' }),
    __metadata("design:type", String)
], CreateAllergyDto.prototype, "onsetDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Date when allergy was diagnosed',
        example: '2020-02-01',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'Invalid diagnosed date format' }),
    __metadata("design:type", String)
], CreateAllergyDto.prototype, "diagnosedDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Name of healthcare provider who diagnosed the allergy',
        example: 'Dr. Jane Smith',
        maxLength: 255,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255, { message: 'Diagnosed by must not exceed 255 characters' }),
    __metadata("design:type", String)
], CreateAllergyDto.prototype, "diagnosedBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional notes about the allergy',
        example: 'Severe reaction to trace amounts',
        maxLength: 2000,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2000, { message: 'Notes must not exceed 2000 characters' }),
    __metadata("design:type", String)
], CreateAllergyDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether an EpiPen is required for this allergy',
        example: true,
        default: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'EpiPen required must be a boolean' }),
    __metadata("design:type", Boolean)
], CreateAllergyDto.prototype, "epiPenRequired", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Location where EpiPen is stored',
        example: 'Nurse office, first aid kit',
        maxLength: 255,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255, { message: 'EpiPen location must not exceed 255 characters' }),
    __metadata("design:type", String)
], CreateAllergyDto.prototype, "epiPenLocation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'EpiPen expiration date',
        example: '2025-12-31',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'Invalid EpiPen expiration date format' }),
    __metadata("design:type", String)
], CreateAllergyDto.prototype, "epiPenExpiration", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Associated health record ID (UUID)',
        example: '550e8400-e29b-41d4-a716-446655440001',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], CreateAllergyDto.prototype, "healthRecordId", void 0);
//# sourceMappingURL=create-allergy.dto.js.map