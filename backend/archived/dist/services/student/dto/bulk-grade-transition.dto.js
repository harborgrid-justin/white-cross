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
exports.BulkGradeTransitionDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class BulkGradeTransitionDto {
    effectiveDate;
    dryRun = false;
    criteria;
    static _OPENAPI_METADATA_FACTORY() {
        return { effectiveDate: { required: true, type: () => String }, dryRun: { required: false, type: () => Boolean, default: false }, criteria: { required: false, type: () => ({ minimumGpa: { required: false, type: () => Number }, minimumAttendance: { required: false, type: () => Number }, requirePassingGrades: { required: false, type: () => Boolean } }) } };
    }
}
exports.BulkGradeTransitionDto = BulkGradeTransitionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Effective date for the grade transition (ISO 8601 format)',
        example: '2025-06-15T00:00:00Z',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], BulkGradeTransitionDto.prototype, "effectiveDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Dry-run mode: preview results without making changes (default: false)',
        example: false,
        default: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], BulkGradeTransitionDto.prototype, "dryRun", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Promotion criteria configuration',
        example: {
            minimumGpa: 2.0,
            minimumAttendance: 0.9,
            requirePassingGrades: true,
        },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], BulkGradeTransitionDto.prototype, "criteria", void 0);
//# sourceMappingURL=bulk-grade-transition.dto.js.map