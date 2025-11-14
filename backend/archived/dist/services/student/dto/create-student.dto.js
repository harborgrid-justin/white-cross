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
exports.CreateStudentDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const models_1 = require("../../../database/models");
class CreateStudentDto {
    studentNumber;
    firstName;
    lastName;
    dateOfBirth;
    grade;
    gender;
    photo;
    medicalRecordNum;
    nurseId;
    enrollmentDate;
    createdBy;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentNumber: { required: true, type: () => String, minLength: 4, maxLength: 20, pattern: "/^[A-Z0-9-]+$/i" }, firstName: { required: true, type: () => String, minLength: 1, maxLength: 100, pattern: "/^[a-zA-Z\\s'-]+$/" }, lastName: { required: true, type: () => String, minLength: 1, maxLength: 100, pattern: "/^[a-zA-Z\\s'-]+$/" }, dateOfBirth: { required: true, type: () => Date }, grade: { required: true, type: () => String, minLength: 1, maxLength: 10 }, gender: { required: true, enum: require("../../../database/models/student.model").Gender }, photo: { required: false, type: () => String, maxLength: 500, format: "uri" }, medicalRecordNum: { required: false, type: () => String, minLength: 5, maxLength: 20, pattern: "/^[A-Z0-9-]+$/i" }, nurseId: { required: false, type: () => String, format: "uuid" }, enrollmentDate: { required: false, type: () => Date }, createdBy: { required: false, type: () => String, format: "uuid" } };
    }
}
exports.CreateStudentDto = CreateStudentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique student identifier (4-20 alphanumeric characters with optional hyphens)',
        example: 'STU-2024-001',
        minLength: 4,
        maxLength: 20,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Student number is required' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(4, 20, {
        message: 'Student number must be between 4 and 20 characters',
    }),
    (0, class_validator_1.Matches)(/^[A-Z0-9-]+$/i, {
        message: 'Student number must be alphanumeric with optional hyphens',
    }),
    __metadata("design:type", String)
], CreateStudentDto.prototype, "studentNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student first name (1-100 characters, letters/spaces/hyphens/apostrophes only)',
        example: 'Emma',
        minLength: 1,
        maxLength: 100,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'First name is required' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 100, {
        message: 'First name must be between 1 and 100 characters',
    }),
    (0, class_validator_1.Matches)(/^[a-zA-Z\s'-]+$/, {
        message: 'First name can only contain letters, spaces, hyphens, and apostrophes',
    }),
    __metadata("design:type", String)
], CreateStudentDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student last name (1-100 characters, letters/spaces/hyphens/apostrophes only)',
        example: 'Wilson',
        minLength: 1,
        maxLength: 100,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Last name is required' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 100, { message: 'Last name must be between 1 and 100 characters' }),
    (0, class_validator_1.Matches)(/^[a-zA-Z\s'-]+$/, {
        message: 'Last name can only contain letters, spaces, hyphens, and apostrophes',
    }),
    __metadata("design:type", String)
], CreateStudentDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date of birth (must be in past, age 3-100 years)',
        example: '2015-03-15',
        type: 'string',
        format: 'date',
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Date of birth is required' }),
    (0, class_validator_1.IsDate)({ message: 'Date of birth must be a valid date' }),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreateStudentDto.prototype, "dateOfBirth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Current grade level (1-10 characters)',
        example: '3',
        minLength: 1,
        maxLength: 10,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Grade is required' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 10, { message: 'Grade must be between 1 and 10 characters' }),
    __metadata("design:type", String)
], CreateStudentDto.prototype, "grade", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student gender',
        enum: models_1.Gender,
        example: models_1.Gender.FEMALE,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Gender is required' }),
    (0, class_validator_1.IsEnum)(models_1.Gender, {
        message: 'Gender must be MALE, FEMALE, OTHER, or PREFER_NOT_TO_SAY',
    }),
    __metadata("design:type", String)
], CreateStudentDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Photo URL (max 500 characters)',
        example: 'https://example.com/photos/student.jpg',
        required: false,
        maxLength: 500,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500, { message: 'Photo URL cannot exceed 500 characters' }),
    (0, class_validator_1.IsUrl)({}, { message: 'Photo must be a valid URL' }),
    __metadata("design:type", String)
], CreateStudentDto.prototype, "photo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Medical record number (5-20 alphanumeric characters with optional hyphens)',
        example: 'MRN-12345',
        required: false,
        minLength: 5,
        maxLength: 20,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(5, 20, {
        message: 'Medical record number must be between 5 and 20 characters',
    }),
    (0, class_validator_1.Matches)(/^[A-Z0-9-]+$/i, {
        message: 'Medical record number must be alphanumeric with optional hyphens',
    }),
    __metadata("design:type", String)
], CreateStudentDto.prototype, "medicalRecordNum", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'UUID of assigned nurse',
        example: '123e4567-e89b-12d3-a456-426614174000',
        required: false,
        format: 'uuid',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(4, { message: 'Nurse ID must be a valid UUID' }),
    __metadata("design:type", String)
], CreateStudentDto.prototype, "nurseId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Enrollment date (defaults to current date if not provided)',
        example: '2024-09-01',
        required: false,
        type: 'string',
        format: 'date',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)({ message: 'Enrollment date must be a valid date' }),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreateStudentDto.prototype, "enrollmentDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'UUID of user creating this record (for audit trail)',
        example: '123e4567-e89b-12d3-a456-426614174000',
        required: false,
        format: 'uuid',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(4, { message: 'Created by must be a valid UUID' }),
    __metadata("design:type", String)
], CreateStudentDto.prototype, "createdBy", void 0);
//# sourceMappingURL=create-student.dto.js.map