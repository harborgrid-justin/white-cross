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
exports.HealthRecordCreateDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class HealthRecordCreateDto {
    studentId;
    recordDate;
    recordType;
    chiefComplaint;
    assessment;
    treatment;
    notes;
    providerId;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentId: { required: true, type: () => String, format: "uuid" }, recordDate: { required: true, type: () => Date }, recordType: { required: true, type: () => String, maxLength: 100 }, chiefComplaint: { required: false, type: () => String, maxLength: 1000 }, assessment: { required: false, type: () => String, maxLength: 2000 }, treatment: { required: false, type: () => String, maxLength: 2000 }, notes: { required: false, type: () => String, maxLength: 5000 }, providerId: { required: false, type: () => String, format: "uuid" } };
    }
}
exports.HealthRecordCreateDto = HealthRecordCreateDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student UUID',
        example: '123e4567-e89b-12d3-a456-426614174000',
        format: 'uuid',
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Student ID is required' }),
    (0, class_validator_1.IsUUID)(4, { message: 'Student ID must be a valid UUID' }),
    __metadata("design:type", String)
], HealthRecordCreateDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date of health record/visit',
        example: '2024-10-28',
        type: 'string',
        format: 'date-time',
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Record date is required' }),
    (0, class_validator_1.IsDate)({ message: 'Record date must be a valid date' }),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], HealthRecordCreateDto.prototype, "recordDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of health record (visit, screening, incident, etc.)',
        example: 'clinic_visit',
        maxLength: 100,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Record type is required' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100, { message: 'Record type cannot exceed 100 characters' }),
    __metadata("design:type", String)
], HealthRecordCreateDto.prototype, "recordType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Patient's chief complaint or reason for visit",
        example: 'Headache and fever',
        required: false,
        maxLength: 1000,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000, { message: 'Chief complaint cannot exceed 1000 characters' }),
    __metadata("design:type", String)
], HealthRecordCreateDto.prototype, "chiefComplaint", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Assessment and diagnosis',
        example: 'Viral infection, fever 101.5F',
        required: false,
        maxLength: 2000,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2000, { message: 'Assessment cannot exceed 2000 characters' }),
    __metadata("design:type", String)
], HealthRecordCreateDto.prototype, "assessment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Treatment provided',
        example: 'Rest, fluids, acetaminophen 500mg',
        required: false,
        maxLength: 2000,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2000, { message: 'Treatment cannot exceed 2000 characters' }),
    __metadata("design:type", String)
], HealthRecordCreateDto.prototype, "treatment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Additional notes',
        required: false,
        maxLength: 5000,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(5000, { message: 'Notes cannot exceed 5000 characters' }),
    __metadata("design:type", String)
], HealthRecordCreateDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'UUID of provider/nurse creating record',
        example: '123e4567-e89b-12d3-a456-426614174000',
        required: false,
        format: 'uuid',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(4, { message: 'Provider ID must be a valid UUID' }),
    __metadata("design:type", String)
], HealthRecordCreateDto.prototype, "providerId", void 0);
//# sourceMappingURL=create-health-record.dto.js.map