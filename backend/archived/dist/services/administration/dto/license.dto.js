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
exports.LicenseQueryDto = exports.UpdateLicenseDto = exports.CreateLicenseDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const administration_enums_1 = require("../enums/administration.enums");
class CreateLicenseDto {
    licenseKey;
    type;
    maxUsers;
    maxSchools;
    features;
    issuedTo;
    districtId;
    notes;
    expiresAt;
    static _OPENAPI_METADATA_FACTORY() {
        return { licenseKey: { required: true, type: () => String, pattern: "/^[A-Z0-9-]+$/" }, type: { required: true, enum: require("../enums/administration.enums").LicenseType }, maxUsers: { required: false, type: () => Number, minimum: 1 }, maxSchools: { required: false, type: () => Number, minimum: 1 }, features: { required: true, type: () => [String], minItems: 1 }, issuedTo: { required: false, type: () => String }, districtId: { required: false, type: () => String, format: "uuid" }, notes: { required: false, type: () => String }, expiresAt: { required: false, type: () => Date } };
    }
}
exports.CreateLicenseDto = CreateLicenseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'License key (uppercase alphanumeric with hyphens)',
        example: 'ABC-DEF-123-456',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^[A-Z0-9-]+$/, {
        message: 'License key can only contain uppercase letters, numbers, and hyphens',
    }),
    __metadata("design:type", String)
], CreateLicenseDto.prototype, "licenseKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'License type', enum: administration_enums_1.LicenseType }),
    (0, class_validator_1.IsEnum)(administration_enums_1.LicenseType),
    __metadata("design:type", String)
], CreateLicenseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Maximum number of users', minimum: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateLicenseDto.prototype, "maxUsers", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Maximum number of schools',
        minimum: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateLicenseDto.prototype, "maxSchools", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of feature codes included in license',
        type: [String],
        minItems: 1,
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateLicenseDto.prototype, "features", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Organization or person issued to' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLicenseDto.prototype, "issuedTo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Associated district UUID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateLicenseDto.prototype, "districtId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional notes' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLicenseDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'License expiration date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreateLicenseDto.prototype, "expiresAt", void 0);
class UpdateLicenseDto extends (0, swagger_1.PartialType)(CreateLicenseDto) {
    status;
    static _OPENAPI_METADATA_FACTORY() {
        return { status: { required: false, enum: require("../enums/administration.enums").LicenseStatus } };
    }
}
exports.UpdateLicenseDto = UpdateLicenseDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'License status', enum: administration_enums_1.LicenseStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(administration_enums_1.LicenseStatus),
    __metadata("design:type", String)
], UpdateLicenseDto.prototype, "status", void 0);
class LicenseQueryDto {
    page = 1;
    limit = 20;
    status;
    static _OPENAPI_METADATA_FACTORY() {
        return { page: { required: false, type: () => Number, default: 1, minimum: 1 }, limit: { required: false, type: () => Number, default: 20, minimum: 1 }, status: { required: false, enum: require("../enums/administration.enums").LicenseStatus } };
    }
}
exports.LicenseQueryDto = LicenseQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Page number', default: 1, minimum: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], LicenseQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Items per page',
        default: 20,
        minimum: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], LicenseQueryDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by status', enum: administration_enums_1.LicenseStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(administration_enums_1.LicenseStatus),
    __metadata("design:type", String)
], LicenseQueryDto.prototype, "status", void 0);
//# sourceMappingURL=license.dto.js.map