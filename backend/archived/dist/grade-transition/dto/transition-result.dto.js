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
exports.BulkTransitionResultDto = exports.TransitionResultDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
class TransitionResultDto {
    studentId;
    studentName;
    oldGrade;
    newGrade;
    success;
    error;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentId: { required: true, type: () => String }, studentName: { required: true, type: () => String }, oldGrade: { required: true, type: () => String }, newGrade: { required: true, type: () => String }, success: { required: true, type: () => Boolean }, error: { required: false, type: () => String } };
    }
}
exports.TransitionResultDto = TransitionResultDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student ID',
        example: 'student-123',
    }),
    __metadata("design:type", String)
], TransitionResultDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student full name',
        example: 'John Doe',
    }),
    __metadata("design:type", String)
], TransitionResultDto.prototype, "studentName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Previous grade level',
        example: '8',
    }),
    __metadata("design:type", String)
], TransitionResultDto.prototype, "oldGrade", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'New grade level',
        example: '9',
    }),
    __metadata("design:type", String)
], TransitionResultDto.prototype, "newGrade", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the transition was successful',
    }),
    __metadata("design:type", Boolean)
], TransitionResultDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Error message if transition failed',
    }),
    __metadata("design:type", String)
], TransitionResultDto.prototype, "error", void 0);
class BulkTransitionResultDto {
    total;
    successful;
    failed;
    results;
    static _OPENAPI_METADATA_FACTORY() {
        return { total: { required: true, type: () => Number }, successful: { required: true, type: () => Number }, failed: { required: true, type: () => Number }, results: { required: true, type: () => [require("./transition-result.dto").TransitionResultDto] } };
    }
}
exports.BulkTransitionResultDto = BulkTransitionResultDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of students processed',
    }),
    __metadata("design:type", Number)
], BulkTransitionResultDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of successful transitions',
    }),
    __metadata("design:type", Number)
], BulkTransitionResultDto.prototype, "successful", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of failed transitions',
    }),
    __metadata("design:type", Number)
], BulkTransitionResultDto.prototype, "failed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Detailed results for each student',
        type: [TransitionResultDto],
    }),
    __metadata("design:type", Array)
], BulkTransitionResultDto.prototype, "results", void 0);
//# sourceMappingURL=transition-result.dto.js.map