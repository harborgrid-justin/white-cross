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
exports.CreateConfigurationDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const administration_enums_1 = require("../../services/administration/enums/administration.enums");
class CreateConfigurationDto {
    key;
    value;
    valueType;
    category;
    subCategory;
    description;
    defaultValue;
    validValues;
    minValue;
    maxValue;
    isPublic;
    isEditable;
    requiresRestart;
    scope;
    scopeId;
    tags;
    sortOrder;
    static _OPENAPI_METADATA_FACTORY() {
        return { key: { required: true, type: () => String }, value: { required: true, type: () => String }, valueType: { required: true, enum: require("../../services/administration/enums/administration.enums").ConfigValueType }, category: { required: true, enum: require("../../services/administration/enums/administration.enums").ConfigCategory }, subCategory: { required: false, type: () => String }, description: { required: false, type: () => String }, defaultValue: { required: false, type: () => String }, validValues: { required: false, type: () => [String] }, minValue: { required: false, type: () => Number }, maxValue: { required: false, type: () => Number }, isPublic: { required: false, type: () => Boolean }, isEditable: { required: false, type: () => Boolean }, requiresRestart: { required: false, type: () => Boolean }, scope: { required: false, enum: require("../../services/administration/enums/administration.enums").ConfigScope }, scopeId: { required: false, type: () => String }, tags: { required: false, type: () => [String] }, sortOrder: { required: false, type: () => Number, minimum: 0 } };
    }
}
exports.CreateConfigurationDto = CreateConfigurationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Configuration key (unique identifier)' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateConfigurationDto.prototype, "key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Configuration value (stored as string)' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateConfigurationDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: administration_enums_1.ConfigValueType,
        description: 'Value type for validation',
    }),
    (0, class_validator_1.IsEnum)(administration_enums_1.ConfigValueType),
    __metadata("design:type", String)
], CreateConfigurationDto.prototype, "valueType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: administration_enums_1.ConfigCategory, description: 'Configuration category' }),
    (0, class_validator_1.IsEnum)(administration_enums_1.ConfigCategory),
    __metadata("design:type", String)
], CreateConfigurationDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Sub-category for further organization' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateConfigurationDto.prototype, "subCategory", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Human-readable description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateConfigurationDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Default value for reset functionality' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateConfigurationDto.prototype, "defaultValue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Valid values for enum type',
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateConfigurationDto.prototype, "validValues", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Minimum value for number type' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateConfigurationDto.prototype, "minValue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Maximum value for number type' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateConfigurationDto.prototype, "maxValue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether config is visible to frontend',
        default: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateConfigurationDto.prototype, "isPublic", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether config can be edited',
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateConfigurationDto.prototype, "isEditable", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether changing this requires system restart',
        default: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateConfigurationDto.prototype, "requiresRestart", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: administration_enums_1.ConfigScope,
        description: 'Configuration scope',
        default: administration_enums_1.ConfigScope.SYSTEM,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(administration_enums_1.ConfigScope),
    __metadata("design:type", String)
], CreateConfigurationDto.prototype, "scope", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Scope ID (district/school/user ID)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateConfigurationDto.prototype, "scopeId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tags for categorization',
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateConfigurationDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Sort order for display', default: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateConfigurationDto.prototype, "sortOrder", void 0);
//# sourceMappingURL=create-configuration.dto.js.map