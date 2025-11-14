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
exports.AcademicHistoryDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class AcademicHistoryDto {
    academicYear;
    includeDetails = true;
    includeGpa = true;
    includeAttendance = false;
    static _OPENAPI_METADATA_FACTORY() {
        return { academicYear: { required: false, type: () => String }, includeDetails: { required: false, type: () => Boolean, default: true }, includeGpa: { required: false, type: () => Boolean, default: true }, includeAttendance: { required: false, type: () => Boolean, default: false } };
    }
}
exports.AcademicHistoryDto = AcademicHistoryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by specific academic year (e.g., "2024-2025")',
        example: '2024-2025',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AcademicHistoryDto.prototype, "academicYear", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include detailed course information',
        example: true,
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Boolean),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AcademicHistoryDto.prototype, "includeDetails", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include GPA calculations and trends',
        example: true,
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Boolean),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AcademicHistoryDto.prototype, "includeGpa", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include attendance records',
        example: true,
        default: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Boolean),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AcademicHistoryDto.prototype, "includeAttendance", void 0);
//# sourceMappingURL=academic-history.dto.js.map