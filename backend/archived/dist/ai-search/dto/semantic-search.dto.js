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
exports.SemanticSearchDto = exports.SearchFiltersDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class SearchFiltersDto {
    dataTypes;
    dateRange;
    studentIds;
    nurseIds;
    categories;
    static _OPENAPI_METADATA_FACTORY() {
        return { dataTypes: { required: false, type: () => [String] }, dateRange: { required: false, type: () => ({ start: { required: false, type: () => Date }, end: { required: false, type: () => Date } }) }, studentIds: { required: false, type: () => [String] }, nurseIds: { required: false, type: () => [String] }, categories: { required: false, type: () => [String] } };
    }
}
exports.SearchFiltersDto = SearchFiltersDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Data types to search',
        required: false,
        example: ['patient', 'appointment'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], SearchFiltersDto.prototype, "dataTypes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date range filter', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Object),
    __metadata("design:type", Object)
], SearchFiltersDto.prototype, "dateRange", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Student IDs filter', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], SearchFiltersDto.prototype, "studentIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nurse IDs filter', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], SearchFiltersDto.prototype, "nurseIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Categories filter', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], SearchFiltersDto.prototype, "categories", void 0);
class SemanticSearchDto {
    query;
    filters;
    limit;
    threshold;
    userId;
    static _OPENAPI_METADATA_FACTORY() {
        return { query: { required: true, type: () => String, maxLength: 500 }, filters: { required: false, type: () => require("./semantic-search.dto").SearchFiltersDto }, limit: { required: false, type: () => Number, minimum: 1, maximum: 100 }, threshold: { required: false, type: () => Number, minimum: 0, maximum: 1 }, userId: { required: true, type: () => String } };
    }
}
exports.SemanticSearchDto = SemanticSearchDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Search query text',
        example: 'students with respiratory conditions',
        maxLength: 500,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], SemanticSearchDto.prototype, "query", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Search filters',
        required: false,
        type: SearchFiltersDto,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => SearchFiltersDto),
    __metadata("design:type", SearchFiltersDto)
], SemanticSearchDto.prototype, "filters", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Maximum number of results',
        required: false,
        default: 10,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], SemanticSearchDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Similarity threshold (0-1)',
        required: false,
        default: 0.7,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(1),
    __metadata("design:type", Number)
], SemanticSearchDto.prototype, "threshold", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User ID making the search', required: true }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SemanticSearchDto.prototype, "userId", void 0);
//# sourceMappingURL=semantic-search.dto.js.map