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
exports.MetadataQueryDto = exports.MonitoringQueryDto = exports.FeatureFlagQueryDto = exports.ProviderQueryDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const pagination_dto_1 = require("./pagination.dto");
const provider_type_enum_1 = require("../enums/provider-type.enum");
class ProviderQueryDto extends pagination_dto_1.PaginationDto {
    type;
    domain;
    static _OPENAPI_METADATA_FACTORY() {
        return { type: { required: true, enum: require("../enums/provider-type.enum").ProviderType }, domain: { required: false, type: () => String, minLength: 1 } };
    }
}
exports.ProviderQueryDto = ProviderQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: provider_type_enum_1.ProviderType,
        description: 'Type of providers to filter by',
        example: provider_type_enum_1.ProviderType.EXPERIMENTAL,
    }),
    (0, class_validator_1.IsEnum)(provider_type_enum_1.ProviderType, {
        message: `Provider type must be one of: ${Object.values(provider_type_enum_1.ProviderType).join(', ')}`,
    }),
    __metadata("design:type", String)
], ProviderQueryDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Domain to filter providers by',
        example: 'health',
        minLength: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Domain must be a string' }),
    (0, class_validator_1.MinLength)(1, { message: 'Domain cannot be empty' }),
    __metadata("design:type", String)
], ProviderQueryDto.prototype, "domain", void 0);
class FeatureFlagQueryDto {
    flag;
    static _OPENAPI_METADATA_FACTORY() {
        return { flag: { required: true, type: () => String, minLength: 1 } };
    }
}
exports.FeatureFlagQueryDto = FeatureFlagQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Feature flag to filter providers by',
        example: 'experimental',
        minLength: 1,
    }),
    (0, class_validator_1.IsString)({ message: 'Feature flag must be a string' }),
    (0, class_validator_1.MinLength)(1, { message: 'Feature flag cannot be empty' }),
    __metadata("design:type", String)
], FeatureFlagQueryDto.prototype, "flag", void 0);
class MonitoringQueryDto extends pagination_dto_1.PaginationDto {
    level;
    static _OPENAPI_METADATA_FACTORY() {
        return { level: { required: false, enum: require("../enums/provider-type.enum").MonitoringLevel } };
    }
}
exports.MonitoringQueryDto = MonitoringQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: provider_type_enum_1.MonitoringLevel,
        description: 'Level of monitoring to filter by',
        example: provider_type_enum_1.MonitoringLevel.BASIC,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(provider_type_enum_1.MonitoringLevel, {
        message: `Monitoring level must be one of: ${Object.values(provider_type_enum_1.MonitoringLevel).join(', ')}`,
    }),
    __metadata("design:type", String)
], MonitoringQueryDto.prototype, "level", void 0);
class MetadataQueryDto extends pagination_dto_1.PaginationDto {
    key;
    value;
    static _OPENAPI_METADATA_FACTORY() {
        return { key: { required: true, type: () => String, minLength: 1 }, value: { required: false, type: () => String } };
    }
}
exports.MetadataQueryDto = MetadataQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Metadata key to filter by',
        example: 'domain',
        minLength: 1,
    }),
    (0, class_validator_1.IsString)({ message: 'Metadata key must be a string' }),
    (0, class_validator_1.MinLength)(1, { message: 'Metadata key cannot be empty' }),
    __metadata("design:type", String)
], MetadataQueryDto.prototype, "key", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Metadata value to filter by',
        example: 'health',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Metadata value must be a string' }),
    __metadata("design:type", String)
], MetadataQueryDto.prototype, "value", void 0);
//# sourceMappingURL=provider-query.dto.js.map