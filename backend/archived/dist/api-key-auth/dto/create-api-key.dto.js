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
exports.CreateApiKeyDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateApiKeyDto {
    name;
    description;
    scopes;
    expiresInDays;
    ipRestriction;
    rateLimit;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String, minLength: 3 }, description: { required: false, type: () => String }, scopes: { required: false, type: () => [String] }, expiresInDays: { required: false, type: () => Number, minimum: 1, maximum: 365 }, ipRestriction: { required: false, type: () => String }, rateLimit: { required: false, type: () => Number, minimum: 1, maximum: 10000 } };
    }
}
exports.CreateApiKeyDto = CreateApiKeyDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Human-readable name for the API key',
        example: 'SIS Integration - Production',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    __metadata("design:type", String)
], CreateApiKeyDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Description of the API key purpose',
        example: 'Used for Student Information System integration',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateApiKeyDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of scopes/permissions for this API key',
        example: ['students:read', 'health-records:read'],
        required: false,
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateApiKeyDto.prototype, "scopes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of days until key expires',
        example: 365,
        required: false,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(365),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateApiKeyDto.prototype, "expiresInDays", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'IP address restriction pattern (CIDR notation)',
        example: '192.168.1.0/24',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateApiKeyDto.prototype, "ipRestriction", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Rate limit (requests per minute)',
        example: 1000,
        required: false,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(10000),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateApiKeyDto.prototype, "rateLimit", void 0);
//# sourceMappingURL=create-api-key.dto.js.map