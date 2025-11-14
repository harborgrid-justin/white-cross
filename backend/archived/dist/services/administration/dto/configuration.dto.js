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
exports.ConfigurationHistoryQueryDto = exports.BatchUpdateSettingsDto = exports.ConfigurationDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const administration_enums_1 = require("../enums/administration.enums");
class ConfigurationDto {
    key;
    value;
    category;
    valueType;
    subCategory;
    description;
    isPublic;
    isEditable;
    requiresRestart;
    scope;
    scopeId;
    tags;
    sortOrder;
    static _OPENAPI_METADATA_FACTORY() {
        return { key: { required: true, type: () => String, maxLength: 100 }, value: { required: true, type: () => String }, category: { required: true, enum: require("../enums/administration.enums").ConfigCategory }, valueType: { required: false, enum: require("../enums/administration.enums").ConfigValueType }, subCategory: { required: false, type: () => String, maxLength: 100 }, description: { required: false, type: () => String }, isPublic: { required: false, type: () => Boolean }, isEditable: { required: false, type: () => Boolean }, requiresRestart: { required: false, type: () => Boolean }, scope: { required: false, enum: require("../enums/administration.enums").ConfigScope }, scopeId: { required: false, type: () => String, format: "uuid" }, tags: { required: false, type: () => [String] }, sortOrder: { required: false, type: () => Number } };
    }
}
exports.ConfigurationDto = ConfigurationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Configuration key', maxLength: 100 }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], ConfigurationDto.prototype, "key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Configuration value' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ConfigurationDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Configuration category', enum: administration_enums_1.ConfigCategory }),
    (0, class_validator_1.IsEnum)(administration_enums_1.ConfigCategory),
    __metadata("design:type", String)
], ConfigurationDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Value data type',
        enum: administration_enums_1.ConfigValueType,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(administration_enums_1.ConfigValueType),
    __metadata("design:type", String)
], ConfigurationDto.prototype, "valueType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Sub-category', maxLength: 100 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], ConfigurationDto.prototype, "subCategory", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Configuration description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ConfigurationDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Is publicly accessible',
        default: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ConfigurationDto.prototype, "isPublic", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Can be edited by admins',
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ConfigurationDto.prototype, "isEditable", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Requires system restart to take effect',
        default: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ConfigurationDto.prototype, "requiresRestart", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Configuration scope',
        enum: administration_enums_1.ConfigScope,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(administration_enums_1.ConfigScope),
    __metadata("design:type", String)
], ConfigurationDto.prototype, "scope", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Scope ID (district, school, or user ID)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ConfigurationDto.prototype, "scopeId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Tags for organization', type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], ConfigurationDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Display order', default: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ConfigurationDto.prototype, "sortOrder", void 0);
class BatchUpdateSettingsDto {
    settings;
    changedBy;
    static _OPENAPI_METADATA_FACTORY() {
        return { settings: { required: true, type: () => [require("./configuration.dto").ConfigurationDto] }, changedBy: { required: false, type: () => String, format: "uuid" } };
    }
}
exports.BatchUpdateSettingsDto = BatchUpdateSettingsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of configuration updates',
        type: [ConfigurationDto],
    }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], BatchUpdateSettingsDto.prototype, "settings", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'User ID making the changes' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], BatchUpdateSettingsDto.prototype, "changedBy", void 0);
class ConfigurationHistoryQueryDto {
    configKey;
    limit = 50;
    static _OPENAPI_METADATA_FACTORY() {
        return { configKey: { required: true, type: () => String }, limit: { required: false, type: () => Number, default: 50 } };
    }
}
exports.ConfigurationHistoryQueryDto = ConfigurationHistoryQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Configuration key to query history for' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ConfigurationHistoryQueryDto.prototype, "configKey", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Number of history records',
        default: 50,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ConfigurationHistoryQueryDto.prototype, "limit", void 0);
//# sourceMappingURL=configuration.dto.js.map