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
exports.GradeTransitionDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class GradeTransitionDto {
    newGrade;
    reason;
    effectiveDate;
    metadata;
    static _OPENAPI_METADATA_FACTORY() {
        return { newGrade: { required: true, type: () => String, description: "New grade level to assign" }, reason: { required: false, type: () => String, description: "Reason for the grade transition" }, effectiveDate: { required: false, type: () => String, description: "Effective date for the transition" }, metadata: { required: false, type: () => Object, description: "Additional metadata for the transition" } };
    }
}
exports.GradeTransitionDto = GradeTransitionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'New grade level to assign (e.g., "2", "3", "K")',
        example: '3',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GradeTransitionDto.prototype, "newGrade", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Reason for the grade transition (e.g., "Academic performance", "Retention due to attendance")',
        example: 'Academic performance',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GradeTransitionDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Effective date for the grade transition (ISO date string)',
        example: '2024-08-15',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], GradeTransitionDto.prototype, "effectiveDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional metadata for the transition',
        type: 'object',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], GradeTransitionDto.prototype, "metadata", void 0);
//# sourceMappingURL=grade-transition.dto.js.map