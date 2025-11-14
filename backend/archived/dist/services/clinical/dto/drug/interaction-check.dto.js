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
exports.InteractionCheckDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class InteractionCheckDto {
    drugIds;
    studentId;
    static _OPENAPI_METADATA_FACTORY() {
        return { drugIds: { required: true, type: () => [String], format: "uuid", minItems: 2 }, studentId: { required: false, type: () => String, format: "uuid" } };
    }
}
exports.InteractionCheckDto = InteractionCheckDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of drug IDs to check for interactions',
        example: [
            '123e4567-e89b-12d3-a456-426614174000',
            '123e4567-e89b-12d3-a456-426614174001',
        ],
        type: [String],
        minItems: 2,
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(2, {
        message: 'At least 2 drugs are required to check interactions',
    }),
    (0, class_validator_1.IsUUID)('4', { each: true, message: 'Each drug ID must be a valid UUID' }),
    __metadata("design:type", Array)
], InteractionCheckDto.prototype, "drugIds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Optional student ID to check for drug allergies',
        example: '123e4567-e89b-12d3-a456-426614174002',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4', { message: 'Student ID must be a valid UUID' }),
    __metadata("design:type", String)
], InteractionCheckDto.prototype, "studentId", void 0);
//# sourceMappingURL=interaction-check.dto.js.map