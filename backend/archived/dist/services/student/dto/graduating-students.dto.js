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
exports.GraduatingStudentsDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class GraduatingStudentsDto {
    academicYear;
    minimumGpa;
    minimumCredits;
    static _OPENAPI_METADATA_FACTORY() {
        return { academicYear: { required: false, type: () => String }, minimumGpa: { required: false, type: () => Number, minimum: 0 }, minimumCredits: { required: false, type: () => Number, minimum: 0 } };
    }
}
exports.GraduatingStudentsDto = GraduatingStudentsDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Academic year for graduation (e.g., "2025")',
        example: '2025',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GraduatingStudentsDto.prototype, "academicYear", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Minimum GPA requirement (0.0 to 4.0 scale)',
        example: 2.0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], GraduatingStudentsDto.prototype, "minimumGpa", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Minimum total credits required',
        example: 24,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], GraduatingStudentsDto.prototype, "minimumCredits", void 0);
//# sourceMappingURL=graduating-students.dto.js.map