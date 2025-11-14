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
exports.StudentBulkUpdateDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class StudentBulkUpdateDto {
    studentIds;
    nurseId;
    grade;
    isActive;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentIds: { required: true, type: () => [String], format: "uuid" }, nurseId: { required: false, type: () => String, format: "uuid" }, grade: { required: false, type: () => String, minLength: 1, maxLength: 10 }, isActive: { required: false, type: () => Boolean } };
    }
}
exports.StudentBulkUpdateDto = StudentBulkUpdateDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of student UUIDs to update',
        example: ['123e4567-e89b-12d3-a456-426614174000', '223e4567-e89b-12d3-a456-426614174001'],
        type: [String],
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Student IDs are required' }),
    (0, class_validator_1.IsArray)({ message: 'Student IDs must be an array' }),
    (0, class_validator_1.IsUUID)(4, { each: true, message: 'Each student ID must be a valid UUID' }),
    __metadata("design:type", Array)
], StudentBulkUpdateDto.prototype, "studentIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'New nurse assignment (optional)',
        example: '323e4567-e89b-12d3-a456-426614174002',
        required: false,
        format: 'uuid',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(4, { message: 'Nurse ID must be a valid UUID' }),
    __metadata("design:type", String)
], StudentBulkUpdateDto.prototype, "nurseId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'New grade level (optional)',
        example: '5',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 10, { message: 'Grade must be between 1 and 10 characters' }),
    __metadata("design:type", String)
], StudentBulkUpdateDto.prototype, "grade", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'New active status (optional)',
        example: false,
        required: false,
        type: 'boolean',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'Active status must be a boolean' }),
    __metadata("design:type", Boolean)
], StudentBulkUpdateDto.prototype, "isActive", void 0);
//# sourceMappingURL=bulk-update.dto.js.map