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
exports.SearchQueryDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class SearchQueryDto {
    query;
    options;
    static _OPENAPI_METADATA_FACTORY() {
        return { query: { required: true, type: () => String, description: "Natural language search query text\n\n@type {string}\n@required\n@minLength 1\n@maxLength 500\n\n@description\nFree-form text query that will be converted to vector embeddings\nfor semantic similarity matching. Supports natural language questions\nand medical terminology.", examples: ["students with asthma requiring daily medication", "find all Type 1 diabetes patients with recent insulin adjustments", "medication administration errors in the last 30 days"], maxLength: 500 }, options: { required: false, type: () => ({ limit: { required: false, type: () => Number }, threshold: { required: false, type: () => Number }, dataTypes: { required: false, type: () => [String] }, studentIds: { required: false, type: () => [String] }, dateRange: { required: false, type: () => ({ start: { required: false, type: () => Date }, end: { required: false, type: () => Date } }) } }), description: "Optional search filters and parameters\n\n@type {object}\n@optional\n\n@description\nFine-tune search behavior with the following options:\n- limit: Maximum number of results to return (default: 10, max: 100)\n- threshold: Minimum similarity score (0.0-1.0, default: 0.7)\n- dataTypes: Filter by content types (student, health-record, appointment, etc.)\n- studentIds: Filter by specific student IDs\n- dateRange: Filter by date range {start, end}", example: "" } };
    }
}
exports.SearchQueryDto = SearchQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Search query text',
        example: 'students with asthma requiring daily medication',
        maxLength: 500,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Search query is required' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500, { message: 'Query cannot exceed 500 characters' }),
    __metadata("design:type", String)
], SearchQueryDto.prototype, "query", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Search options and filters',
        required: false,
        example: {
            limit: 10,
            threshold: 0.7,
            dataTypes: ['student', 'health-record'],
        },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], SearchQueryDto.prototype, "options", void 0);
//# sourceMappingURL=search-query.dto.js.map