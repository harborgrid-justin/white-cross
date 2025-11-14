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
exports.TransferStudentDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class TransferStudentDto {
    nurseId;
    grade;
    reason;
    static _OPENAPI_METADATA_FACTORY() {
        return { nurseId: { required: false, type: () => String, format: "uuid" }, grade: { required: false, type: () => String, minLength: 1, maxLength: 10 }, reason: { required: false, type: () => String } };
    }
}
exports.TransferStudentDto = TransferStudentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'UUID of new assigned nurse',
        example: '123e4567-e89b-12d3-a456-426614174000',
        required: false,
        format: 'uuid',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(4, { message: 'Nurse ID must be a valid UUID' }),
    __metadata("design:type", String)
], TransferStudentDto.prototype, "nurseId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'New grade level',
        example: '4',
        required: false,
        minLength: 1,
        maxLength: 10,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 10, { message: 'Grade must be between 1 and 10 characters' }),
    __metadata("design:type", String)
], TransferStudentDto.prototype, "grade", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Reason for transfer (for audit trail)',
        example: 'Student promoted to next grade',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TransferStudentDto.prototype, "reason", void 0);
//# sourceMappingURL=transfer-student.dto.js.map