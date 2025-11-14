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
exports.DistrictQueryDto = exports.UpdateDistrictDto = exports.CreateDistrictDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateDistrictDto {
    name;
    code;
    address;
    city;
    state;
    zipCode;
    phone;
    email;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String, minLength: 2, maxLength: 200 }, code: { required: true, type: () => String, pattern: "/^[A-Z0-9]+$/" }, address: { required: false, type: () => String }, city: { required: false, type: () => String, maxLength: 100 }, state: { required: false, type: () => String, pattern: "/^[A-Z]{2}$/" }, zipCode: { required: false, type: () => String, pattern: "/^[0-9]{5}(-[0-9]{4})?$/" }, phone: { required: false, type: () => String, pattern: "/^[\\d\\s\\-\\(\\)\\+\\.]+$/" }, email: { required: false, type: () => String, format: "email" } };
    }
}
exports.CreateDistrictDto = CreateDistrictDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'District name', minLength: 2, maxLength: 200 }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateDistrictDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique district code (uppercase alphanumeric)',
        example: 'DIST001',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^[A-Z0-9]+$/, {
        message: 'District code must contain only uppercase letters and numbers',
    }),
    __metadata("design:type", String)
], CreateDistrictDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Street address' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDistrictDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'City name', maxLength: 100 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateDistrictDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'State abbreviation (2 uppercase letters)',
        example: 'CA',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^[A-Z]{2}$/, {
        message: 'State must be a 2-letter uppercase abbreviation',
    }),
    __metadata("design:type", String)
], CreateDistrictDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ZIP code (12345 or 12345-6789)',
        example: '12345',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^[0-9]{5}(-[0-9]{4})?$/, {
        message: 'ZIP code must be in format 12345 or 12345-6789',
    }),
    __metadata("design:type", String)
], CreateDistrictDto.prototype, "zipCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Phone number' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^[\d\s\-\(\)\+\.]+$/, {
        message: 'Invalid phone number format',
    }),
    __metadata("design:type", String)
], CreateDistrictDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Email address' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateDistrictDto.prototype, "email", void 0);
class UpdateDistrictDto extends (0, swagger_1.PartialType)(CreateDistrictDto) {
    isActive;
    static _OPENAPI_METADATA_FACTORY() {
        return { isActive: { required: false, type: () => Boolean } };
    }
}
exports.UpdateDistrictDto = UpdateDistrictDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Active status' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateDistrictDto.prototype, "isActive", void 0);
class DistrictQueryDto {
    page = 1;
    limit = 20;
    static _OPENAPI_METADATA_FACTORY() {
        return { page: { required: false, type: () => Number, default: 1, minimum: 1 }, limit: { required: false, type: () => Number, default: 20, minimum: 1 } };
    }
}
exports.DistrictQueryDto = DistrictQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Page number', default: 1, minimum: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], DistrictQueryDto.prototype, "page", void 0);
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
], DistrictQueryDto.prototype, "limit", void 0);
//# sourceMappingURL=district.dto.js.map