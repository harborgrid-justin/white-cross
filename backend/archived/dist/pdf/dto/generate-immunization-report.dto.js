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
exports.GenerateImmunizationReportDto = exports.ImmunizationStudentDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class ImmunizationStudentDto {
    firstName;
    lastName;
    grade;
    compliant;
    missingVaccines;
    static _OPENAPI_METADATA_FACTORY() {
        return { firstName: { required: true, type: () => String }, lastName: { required: true, type: () => String }, grade: { required: false, type: () => String }, compliant: { required: true, type: () => Boolean }, missingVaccines: { required: false, type: () => [String] } };
    }
}
exports.ImmunizationStudentDto = ImmunizationStudentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Student first name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ImmunizationStudentDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Student last name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ImmunizationStudentDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Student grade' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ImmunizationStudentDto.prototype, "grade", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether student is compliant' }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Boolean)
], ImmunizationStudentDto.prototype, "compliant", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'List of missing vaccines' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], ImmunizationStudentDto.prototype, "missingVaccines", void 0);
class GenerateImmunizationReportDto {
    organizationName;
    totalStudents;
    compliantStudents;
    complianceRate;
    students;
    static _OPENAPI_METADATA_FACTORY() {
        return { organizationName: { required: true, type: () => String }, totalStudents: { required: true, type: () => Number }, compliantStudents: { required: true, type: () => Number }, complianceRate: { required: true, type: () => Number }, students: { required: false, type: () => [require("./generate-immunization-report.dto").ImmunizationStudentDto] } };
    }
}
exports.GenerateImmunizationReportDto = GenerateImmunizationReportDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Organization name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GenerateImmunizationReportDto.prototype, "organizationName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total number of students' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], GenerateImmunizationReportDto.prototype, "totalStudents", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of compliant students' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], GenerateImmunizationReportDto.prototype, "compliantStudents", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Compliance rate percentage' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], GenerateImmunizationReportDto.prototype, "complianceRate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'List of students',
        type: [ImmunizationStudentDto],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ImmunizationStudentDto),
    __metadata("design:type", Array)
], GenerateImmunizationReportDto.prototype, "students", void 0);
//# sourceMappingURL=generate-immunization-report.dto.js.map