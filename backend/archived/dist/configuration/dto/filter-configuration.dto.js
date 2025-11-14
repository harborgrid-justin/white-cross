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
exports.FilterConfigurationDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const administration_enums_1 = require("../../services/administration/enums/administration.enums");
const class_transformer_1 = require("class-transformer");
class FilterConfigurationDto {
    category;
    subCategory;
    scope;
    scopeId;
    tags;
    isPublic;
    isEditable;
    static _OPENAPI_METADATA_FACTORY() {
        return { category: { required: false, enum: require("../../services/administration/enums/administration.enums").ConfigCategory }, subCategory: { required: false, type: () => String }, scope: { required: false, enum: require("../../services/administration/enums/administration.enums").ConfigScope }, scopeId: { required: false, type: () => String }, tags: { required: false, type: () => [String] }, isPublic: { required: false, type: () => Boolean }, isEditable: { required: false, type: () => Boolean } };
    }
}
exports.FilterConfigurationDto = FilterConfigurationDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: administration_enums_1.ConfigCategory,
        description: 'Filter by category',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(administration_enums_1.ConfigCategory),
    __metadata("design:type", String)
], FilterConfigurationDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by sub-category' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FilterConfigurationDto.prototype, "subCategory", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: administration_enums_1.ConfigScope, description: 'Filter by scope' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(administration_enums_1.ConfigScope),
    __metadata("design:type", String)
], FilterConfigurationDto.prototype, "scope", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by scope ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FilterConfigurationDto.prototype, "scopeId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by tags', type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_transformer_1.Transform)(({ value }) => (Array.isArray(value) ? value : [value])),
    __metadata("design:type", Array)
], FilterConfigurationDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by public visibility' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], FilterConfigurationDto.prototype, "isPublic", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by editability' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], FilterConfigurationDto.prototype, "isEditable", void 0);
//# sourceMappingURL=filter-configuration.dto.js.map