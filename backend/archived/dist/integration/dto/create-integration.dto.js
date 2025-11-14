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
exports.CreateIntegrationDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const models_1 = require("../../database/models");
class CreateIntegrationDto {
    name;
    type;
    endpoint;
    apiKey;
    username;
    password;
    settings;
    authentication;
    syncFrequency;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String, minLength: 2, maxLength: 100 }, type: { required: true, enum: require("../../database/models/integration-config.model").IntegrationType }, endpoint: { required: false, type: () => String, format: "uri" }, apiKey: { required: false, type: () => String, minLength: 8 }, username: { required: false, type: () => String, minLength: 2, maxLength: 100 }, password: { required: false, type: () => String, minLength: 8 }, settings: { required: false, type: () => Object }, authentication: { required: false, type: () => Object }, syncFrequency: { required: false, type: () => Number, minimum: 1, maximum: 43200 } };
    }
}
exports.CreateIntegrationDto = CreateIntegrationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Integration name',
        minLength: 2,
        maxLength: 100,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateIntegrationDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: models_1.IntegrationType, description: 'Type of integration' }),
    (0, class_validator_1.IsEnum)(models_1.IntegrationType),
    __metadata("design:type", String)
], CreateIntegrationDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'API endpoint URL' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CreateIntegrationDto.prototype, "endpoint", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'API key for authentication' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    __metadata("design:type", String)
], CreateIntegrationDto.prototype, "apiKey", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Username for basic authentication' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateIntegrationDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Password for basic authentication' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    __metadata("design:type", String)
], CreateIntegrationDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Integration-specific settings' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateIntegrationDto.prototype, "settings", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Authentication configuration' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateIntegrationDto.prototype, "authentication", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sync frequency in minutes',
        minimum: 1,
        maximum: 43200,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(43200),
    __metadata("design:type", Number)
], CreateIntegrationDto.prototype, "syncFrequency", void 0);
//# sourceMappingURL=create-integration.dto.js.map