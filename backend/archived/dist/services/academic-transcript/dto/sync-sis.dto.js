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
exports.SyncSISDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class SyncSISDto {
    sisApiEndpoint;
    apiKey;
    academicYear;
    semester;
    static _OPENAPI_METADATA_FACTORY() {
        return { sisApiEndpoint: { required: true, type: () => String, maxLength: 500, format: "uri" }, apiKey: { required: false, type: () => String, maxLength: 1000 }, academicYear: { required: false, type: () => String, maxLength: 20 }, semester: { required: false, type: () => String, maxLength: 20 } };
    }
}
exports.SyncSISDto = SyncSISDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'External SIS API endpoint URL',
        example: 'https://sis.example.com/api/v1/students/transcript',
        maxLength: 500,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'SIS API endpoint is required' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500, { message: 'SIS API endpoint cannot exceed 500 characters' }),
    (0, class_validator_1.IsUrl)({ protocols: ['http', 'https'], require_protocol: true }, { message: 'SIS API endpoint must be a valid URL' }),
    __metadata("design:type", String)
], SyncSISDto.prototype, "sisApiEndpoint", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'API key or authentication token for SIS access',
        example: 'Bearer eyJhbGciOiJIUzI1NiIs...',
        required: false,
        maxLength: 1000,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000, { message: 'API key cannot exceed 1000 characters' }),
    __metadata("design:type", String)
], SyncSISDto.prototype, "apiKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Academic year to sync (e.g., 2024-2025)',
        example: '2024-2025',
        required: false,
        maxLength: 20,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20, { message: 'Academic year cannot exceed 20 characters' }),
    __metadata("design:type", String)
], SyncSISDto.prototype, "academicYear", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Semester to sync (Fall, Spring, Summer)',
        example: 'Fall',
        required: false,
        maxLength: 20,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20, { message: 'Semester cannot exceed 20 characters' }),
    __metadata("design:type", String)
], SyncSISDto.prototype, "semester", void 0);
//# sourceMappingURL=sync-sis.dto.js.map