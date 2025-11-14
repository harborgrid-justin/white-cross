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
exports.GenerateStudentHealthSummaryDto = exports.ChronicConditionDto = exports.MedicationDto = exports.AllergyDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class AllergyDto {
    allergen;
    severity;
    reaction;
    static _OPENAPI_METADATA_FACTORY() {
        return { allergen: { required: true, type: () => String }, severity: { required: true, type: () => String }, reaction: { required: false, type: () => String } };
    }
}
exports.AllergyDto = AllergyDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Name of the allergen' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AllergyDto.prototype, "allergen", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Severity of the allergy' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AllergyDto.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Reaction description' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AllergyDto.prototype, "reaction", void 0);
class MedicationDto {
    name;
    dosage;
    frequency;
    route;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, dosage: { required: true, type: () => String }, frequency: { required: true, type: () => String }, route: { required: true, type: () => String } };
    }
}
exports.MedicationDto = MedicationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Medication name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], MedicationDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Dosage' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], MedicationDto.prototype, "dosage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Frequency of administration' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], MedicationDto.prototype, "frequency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Route of administration' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], MedicationDto.prototype, "route", void 0);
class ChronicConditionDto {
    diagnosisName;
    static _OPENAPI_METADATA_FACTORY() {
        return { diagnosisName: { required: true, type: () => String } };
    }
}
exports.ChronicConditionDto = ChronicConditionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Diagnosis name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ChronicConditionDto.prototype, "diagnosisName", void 0);
class GenerateStudentHealthSummaryDto {
    id;
    firstName;
    lastName;
    dateOfBirth;
    grade;
    studentNumber;
    allergies;
    medications;
    chronicConditions;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, firstName: { required: true, type: () => String }, lastName: { required: true, type: () => String }, dateOfBirth: { required: true, type: () => String }, grade: { required: false, type: () => String }, studentNumber: { required: false, type: () => String }, allergies: { required: false, type: () => [require("./generate-student-health-summary.dto").AllergyDto] }, medications: { required: false, type: () => [require("./generate-student-health-summary.dto").MedicationDto] }, chronicConditions: { required: false, type: () => [require("./generate-student-health-summary.dto").ChronicConditionDto] } };
    }
}
exports.GenerateStudentHealthSummaryDto = GenerateStudentHealthSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Student ID' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GenerateStudentHealthSummaryDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Student first name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GenerateStudentHealthSummaryDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Student last name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GenerateStudentHealthSummaryDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date of birth' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GenerateStudentHealthSummaryDto.prototype, "dateOfBirth", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Student grade' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GenerateStudentHealthSummaryDto.prototype, "grade", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Student number' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GenerateStudentHealthSummaryDto.prototype, "studentNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'List of allergies', type: [AllergyDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => AllergyDto),
    __metadata("design:type", Array)
], GenerateStudentHealthSummaryDto.prototype, "allergies", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'List of medications',
        type: [MedicationDto],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => MedicationDto),
    __metadata("design:type", Array)
], GenerateStudentHealthSummaryDto.prototype, "medications", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'List of chronic conditions',
        type: [ChronicConditionDto],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ChronicConditionDto),
    __metadata("design:type", Array)
], GenerateStudentHealthSummaryDto.prototype, "chronicConditions", void 0);
//# sourceMappingURL=generate-student-health-summary.dto.js.map