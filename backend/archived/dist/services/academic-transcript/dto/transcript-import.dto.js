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
exports.TranscriptImportDto = exports.BehaviorRecordDto = exports.AttendanceRecordDto = exports.SubjectGradeDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class SubjectGradeDto {
    subjectName;
    subjectCode;
    grade;
    percentage;
    credits;
    teacher;
    static _OPENAPI_METADATA_FACTORY() {
        return { subjectName: { required: true, type: () => String }, subjectCode: { required: true, type: () => String }, grade: { required: true, type: () => String }, percentage: { required: true, type: () => Number }, credits: { required: true, type: () => Number }, teacher: { required: true, type: () => String } };
    }
}
exports.SubjectGradeDto = SubjectGradeDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SubjectGradeDto.prototype, "subjectName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SubjectGradeDto.prototype, "subjectCode", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SubjectGradeDto.prototype, "grade", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SubjectGradeDto.prototype, "percentage", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SubjectGradeDto.prototype, "credits", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SubjectGradeDto.prototype, "teacher", void 0);
class AttendanceRecordDto {
    totalDays;
    presentDays;
    absentDays;
    tardyDays;
    attendanceRate;
    static _OPENAPI_METADATA_FACTORY() {
        return { totalDays: { required: true, type: () => Number }, presentDays: { required: true, type: () => Number }, absentDays: { required: true, type: () => Number }, tardyDays: { required: true, type: () => Number }, attendanceRate: { required: true, type: () => Number } };
    }
}
exports.AttendanceRecordDto = AttendanceRecordDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AttendanceRecordDto.prototype, "totalDays", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AttendanceRecordDto.prototype, "presentDays", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AttendanceRecordDto.prototype, "absentDays", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AttendanceRecordDto.prototype, "tardyDays", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AttendanceRecordDto.prototype, "attendanceRate", void 0);
class BehaviorRecordDto {
    conductGrade;
    incidents;
    commendations;
    notes;
    static _OPENAPI_METADATA_FACTORY() {
        return { conductGrade: { required: true, type: () => String }, incidents: { required: true, type: () => Number }, commendations: { required: true, type: () => Number }, notes: { required: false, type: () => String } };
    }
}
exports.BehaviorRecordDto = BehaviorRecordDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BehaviorRecordDto.prototype, "conductGrade", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], BehaviorRecordDto.prototype, "incidents", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], BehaviorRecordDto.prototype, "commendations", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BehaviorRecordDto.prototype, "notes", void 0);
class TranscriptImportDto {
    studentId;
    academicYear;
    semester;
    subjects;
    attendance;
    behavior;
    importedBy;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentId: { required: true, type: () => String }, academicYear: { required: true, type: () => String }, semester: { required: true, type: () => String }, subjects: { required: true, type: () => [require("./transcript-import.dto").SubjectGradeDto] }, attendance: { required: true, type: () => require("./transcript-import.dto").AttendanceRecordDto }, behavior: { required: false, type: () => require("./transcript-import.dto").BehaviorRecordDto }, importedBy: { required: true, type: () => String } };
    }
}
exports.TranscriptImportDto = TranscriptImportDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TranscriptImportDto.prototype, "studentId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TranscriptImportDto.prototype, "academicYear", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TranscriptImportDto.prototype, "semester", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => SubjectGradeDto),
    __metadata("design:type", Array)
], TranscriptImportDto.prototype, "subjects", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => AttendanceRecordDto),
    __metadata("design:type", AttendanceRecordDto)
], TranscriptImportDto.prototype, "attendance", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => BehaviorRecordDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", BehaviorRecordDto)
], TranscriptImportDto.prototype, "behavior", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TranscriptImportDto.prototype, "importedBy", void 0);
//# sourceMappingURL=transcript-import.dto.js.map