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
exports.RecordScreeningDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class RecordScreeningDto {
    studentId;
    screeningType;
    results;
    notes;
    screeningDate;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentId: { required: true, type: () => String, format: "uuid" }, screeningType: { required: true, type: () => String }, results: { required: false, type: () => Object }, notes: { required: false, type: () => String }, screeningDate: { required: false, type: () => String } };
    }
}
exports.RecordScreeningDto = RecordScreeningDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
        format: 'uuid',
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Student ID is required' }),
    (0, class_validator_1.IsUUID)(4, { message: 'Student ID must be a valid UUID' }),
    __metadata("design:type", String)
], RecordScreeningDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Screening type',
        example: 'vision',
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Screening type is required' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecordScreeningDto.prototype, "screeningType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Screening results',
        example: { leftEye: '20/20', rightEye: '20/20' },
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], RecordScreeningDto.prototype, "results", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Screening notes',
        example: 'Student passed vision screening',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecordScreeningDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Screening date',
        example: '2025-10-28T12:00:00Z',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], RecordScreeningDto.prototype, "screeningDate", void 0);
//# sourceMappingURL=record-screening.dto.js.map