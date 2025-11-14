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
exports.GraduationDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class GraduationDto {
    graduationDate;
    diplomaNumber;
    honors;
    metadata;
    static _OPENAPI_METADATA_FACTORY() {
        return { graduationDate: { required: true, type: () => String }, diplomaNumber: { required: false, type: () => String }, honors: { required: false, type: () => [String] }, metadata: { required: false, type: () => Object } };
    }
}
exports.GraduationDto = GraduationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Graduation date',
        example: '2024-06-15',
    }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], GraduationDto.prototype, "graduationDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Diploma number',
        example: 'DIPL-2024-001',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GraduationDto.prototype, "diplomaNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Graduation honors',
        example: ['Summa Cum Laude', 'Valedictorian'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], GraduationDto.prototype, "honors", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional graduation metadata',
        example: { ceremonyLocation: 'Main Auditorium', speaker: 'Dr. Smith' },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], GraduationDto.prototype, "metadata", void 0);
//# sourceMappingURL=graduation.dto.js.map