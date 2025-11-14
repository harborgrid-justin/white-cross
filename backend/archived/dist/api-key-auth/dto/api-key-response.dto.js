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
exports.ApiKeyResponseDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
class ApiKeyResponseDto {
    apiKey;
    id;
    name;
    keyPrefix;
    scopes;
    expiresAt;
    createdAt;
    static _OPENAPI_METADATA_FACTORY() {
        return { apiKey: { required: false, type: () => String }, id: { required: true, type: () => String }, name: { required: true, type: () => String }, keyPrefix: { required: true, type: () => String }, scopes: { required: false, type: () => [String] }, expiresAt: { required: false, type: () => Date }, createdAt: { required: true, type: () => Date } };
    }
}
exports.ApiKeyResponseDto = ApiKeyResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'API key in plaintext (only shown once during creation)',
        example: 'wc_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6',
    }),
    __metadata("design:type", String)
], ApiKeyResponseDto.prototype, "apiKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'API key ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], ApiKeyResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'API key name',
        example: 'SIS Integration - Production',
    }),
    __metadata("design:type", String)
], ApiKeyResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'API key prefix (first 12 characters)',
        example: 'wc_live_a1b2',
    }),
    __metadata("design:type", String)
], ApiKeyResponseDto.prototype, "keyPrefix", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'API key scopes',
        example: ['students:read', 'health-records:read'],
    }),
    __metadata("design:type", Array)
], ApiKeyResponseDto.prototype, "scopes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'API key expiration date',
        example: '2026-01-01T00:00:00.000Z',
    }),
    __metadata("design:type", Date)
], ApiKeyResponseDto.prototype, "expiresAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'API key creation date',
        example: '2025-01-01T00:00:00.000Z',
    }),
    __metadata("design:type", Date)
], ApiKeyResponseDto.prototype, "createdAt", void 0);
//# sourceMappingURL=api-key-response.dto.js.map