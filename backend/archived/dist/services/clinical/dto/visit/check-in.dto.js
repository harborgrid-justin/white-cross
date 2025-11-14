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
exports.CheckInDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CheckInDto {
    studentId;
    reasonForVisit;
    symptoms;
    attendedBy;
    notes;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentId: { required: true, type: () => String, format: "uuid" }, reasonForVisit: { required: true, type: () => [String], minItems: 1 }, symptoms: { required: false, type: () => [String] }, attendedBy: { required: true, type: () => String, format: "uuid" }, notes: { required: false, type: () => String } };
    }
}
exports.CheckInDto = CheckInDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], CheckInDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Reasons for visit',
        example: ['Headache', 'Nausea'],
        type: [String],
        minItems: 1,
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1, { message: 'At least one reason for visit is required' }),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CheckInDto.prototype, "reasonForVisit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Symptoms reported',
        example: ['Fever', 'Fatigue', 'Body aches'],
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CheckInDto.prototype, "symptoms", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID of the healthcare provider attending',
        example: '123e4567-e89b-12d3-a456-426614174002',
    }),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], CheckInDto.prototype, "attendedBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional notes about the visit',
        example: 'Student appears pale and has elevated temperature',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CheckInDto.prototype, "notes", void 0);
//# sourceMappingURL=check-in.dto.js.map