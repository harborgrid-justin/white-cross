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
exports.PaginationDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class PaginationDto {
    page = 1;
    limit = 20;
    static _OPENAPI_METADATA_FACTORY() {
        return { page: { required: false, type: () => Number, description: "Page number for pagination (1-indexed)\n\n@type {number}\n@optional\n@minimum 1\n@default 1\n\n@description\nThe page number to retrieve in a paginated result set.\nUses 1-based indexing (first page is 1, not 0).\nIf not provided, defaults to the first page.\n\nValidation:\n- Must be a positive integer\n- Minimum value: 1\n- Automatically converted from query string to number", examples: ["1 // First page", "5 // Fifth page"], default: 1, minimum: 1 }, limit: { required: false, type: () => Number, description: "Number of items to return per page\n\n@type {number}\n@optional\n@minimum 1\n@maximum 100\n@default 20\n\n@description\nControls the number of items returned in a single page of results.\nLimited to a maximum of 100 items to prevent performance issues\nand excessive data transfer.\n\nValidation:\n- Must be a positive integer\n- Minimum value: 1\n- Maximum value: 100\n- Automatically converted from query string to number\n- Defaults to 20 if not specified\n\nCommon values:\n- 10: Small lists or mobile displays\n- 20: Default, balanced performance\n- 50: Larger displays or data-heavy operations\n- 100: Maximum allowed, use sparingly", examples: ["20 // Default page size", "50 // Larger page size", "100 // Maximum page size"], default: 20, minimum: 1, maximum: 100 } };
    }
}
exports.PaginationDto = PaginationDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Page number (1-indexed)',
        example: 1,
        minimum: 1,
        default: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], PaginationDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Number of items per page',
        example: 20,
        minimum: 1,
        maximum: 100,
        default: 20,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], PaginationDto.prototype, "limit", void 0);
//# sourceMappingURL=pagination.dto.js.map