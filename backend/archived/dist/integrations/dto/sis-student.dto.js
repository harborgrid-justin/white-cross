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
exports.SisStudentDto = exports.SisEnrollmentStatus = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var SisEnrollmentStatus;
(function (SisEnrollmentStatus) {
    SisEnrollmentStatus["ACTIVE"] = "ACTIVE";
    SisEnrollmentStatus["INACTIVE"] = "INACTIVE";
    SisEnrollmentStatus["TRANSFERRED"] = "TRANSFERRED";
})(SisEnrollmentStatus || (exports.SisEnrollmentStatus = SisEnrollmentStatus = {}));
class SisStudentDto {
    sisId;
    firstName;
    lastName;
    dateOfBirth;
    grade;
    enrollmentStatus;
    enrollmentDate;
    email;
    phone;
    static _OPENAPI_METADATA_FACTORY() {
        return { sisId: { required: true, type: () => String, description: "Unique identifier from the SIS system", example: "PS-12345" }, firstName: { required: true, type: () => String, description: "Student's first name", example: "John" }, lastName: { required: true, type: () => String, description: "Student's last name", example: "Doe" }, dateOfBirth: { required: true, type: () => String, description: "Student's date of birth in ISO 8601 format", example: "2010-05-15" }, grade: { required: true, type: () => String, description: "Student's current grade level", example: "8" }, enrollmentStatus: { required: true, description: "Current enrollment status", enum: require("./sis-student.dto").SisEnrollmentStatus }, enrollmentDate: { required: false, type: () => String, description: "Date when student was enrolled (optional)", example: "2023-09-01" }, email: { required: false, type: () => String, description: "Student's email address (optional)", example: "john.doe@school.edu", format: "email" }, phone: { required: false, type: () => String, description: "Student's phone number (optional)", example: "+1-555-0100" } };
    }
}
exports.SisStudentDto = SisStudentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique identifier from the SIS system',
        example: 'PS-12345',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SisStudentDto.prototype, "sisId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Student's first name",
        example: 'John',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SisStudentDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Student's last name",
        example: 'Doe',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SisStudentDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Student's date of birth",
        example: '2010-05-15',
    }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], SisStudentDto.prototype, "dateOfBirth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Student's current grade level",
        example: '8',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SisStudentDto.prototype, "grade", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Current enrollment status',
        enum: SisEnrollmentStatus,
        example: SisEnrollmentStatus.ACTIVE,
    }),
    (0, class_validator_1.IsEnum)(SisEnrollmentStatus),
    __metadata("design:type", String)
], SisStudentDto.prototype, "enrollmentStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Date when student was enrolled',
        example: '2023-09-01',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], SisStudentDto.prototype, "enrollmentDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "Student's email address",
        example: 'john.doe@school.edu',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], SisStudentDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "Student's phone number",
        example: '+1-555-0100',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SisStudentDto.prototype, "phone", void 0);
//# sourceMappingURL=sis-student.dto.js.map