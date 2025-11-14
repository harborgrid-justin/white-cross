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
exports.ImportTranscriptDto = exports.CourseGrade = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CourseGrade {
    courseName;
    grade;
    numericGrade;
    credits;
    static _OPENAPI_METADATA_FACTORY() {
        return { courseName: { required: true, type: () => String }, grade: { required: true, type: () => String }, numericGrade: { required: false, type: () => Number, minimum: 0, maximum: 100 }, credits: { required: false, type: () => Number, minimum: 0 } };
    }
}
exports.CourseGrade = CourseGrade;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Course name or code',
        example: 'MATH-101',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CourseGrade.prototype, "courseName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Letter grade or numeric grade',
        example: 'A',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CourseGrade.prototype, "grade", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Numeric grade value (0-100)',
        example: 95,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], CourseGrade.prototype, "numericGrade", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Credit hours for this course',
        example: 3,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CourseGrade.prototype, "credits", void 0);
class ImportTranscriptDto {
    academicYear;
    grades;
    cumulativeGpa;
    semesterGpa;
    totalCredits;
    daysPresent;
    daysAbsent;
    achievements;
    notes;
    static _OPENAPI_METADATA_FACTORY() {
        return { academicYear: { required: true, type: () => String }, grades: { required: true, type: () => [require("./import-transcript.dto").CourseGrade] }, cumulativeGpa: { required: false, type: () => Number, minimum: 0, maximum: 4 }, semesterGpa: { required: false, type: () => Number, minimum: 0, maximum: 4 }, totalCredits: { required: false, type: () => Number, minimum: 0 }, daysPresent: { required: false, type: () => Number, minimum: 0 }, daysAbsent: { required: false, type: () => Number, minimum: 0 }, achievements: { required: false, type: () => [String] }, notes: { required: false, type: () => String } };
    }
}
exports.ImportTranscriptDto = ImportTranscriptDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'School year or semester identifier',
        example: '2024-2025 Fall',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ImportTranscriptDto.prototype, "academicYear", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of course grades',
        type: [CourseGrade],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CourseGrade),
    __metadata("design:type", Array)
], ImportTranscriptDto.prototype, "grades", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Cumulative GPA (0.0 to 4.0 scale)',
        example: 3.75,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(4.0),
    __metadata("design:type", Number)
], ImportTranscriptDto.prototype, "cumulativeGpa", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Semester GPA (0.0 to 4.0 scale)',
        example: 3.85,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(4.0),
    __metadata("design:type", Number)
], ImportTranscriptDto.prototype, "semesterGpa", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Total credits earned',
        example: 24,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], ImportTranscriptDto.prototype, "totalCredits", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Attendance record (days present)',
        example: 165,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], ImportTranscriptDto.prototype, "daysPresent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Attendance record (days absent)',
        example: 5,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], ImportTranscriptDto.prototype, "daysAbsent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Academic achievements and awards',
        example: ['Honor Roll', 'Perfect Attendance'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], ImportTranscriptDto.prototype, "achievements", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional notes about the transcript',
        example: 'Transferred from XYZ School District',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ImportTranscriptDto.prototype, "notes", void 0);
//# sourceMappingURL=import-transcript.dto.js.map