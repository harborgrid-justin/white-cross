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
exports.PaginationQueryDto = exports.PaginatedResponseDto = exports.PaginationMetaDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class PaginationMetaDto {
    page;
    limit;
    total;
    pages;
    hasNext;
    hasPrev;
    nextPage;
    prevPage;
    static create(params) {
        const { page, limit, total } = params;
        const pages = Math.ceil(total / limit);
        const hasNext = page < pages;
        const hasPrev = page > 1;
        return {
            page,
            limit,
            total,
            pages,
            hasNext,
            hasPrev,
            nextPage: hasNext ? page + 1 : null,
            prevPage: hasPrev ? page - 1 : null,
        };
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { page: { required: true, type: () => Number }, limit: { required: true, type: () => Number }, total: { required: true, type: () => Number }, pages: { required: true, type: () => Number }, hasNext: { required: true, type: () => Boolean }, hasPrev: { required: true, type: () => Boolean }, nextPage: { required: true, type: () => Number, nullable: true }, prevPage: { required: true, type: () => Number, nullable: true } };
    }
}
exports.PaginationMetaDto = PaginationMetaDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Current page number (1-indexed)',
        example: 1,
        minimum: 1,
        type: Number,
    }),
    __metadata("design:type", Number)
], PaginationMetaDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of items per page',
        example: 20,
        minimum: 1,
        maximum: 100,
        type: Number,
    }),
    __metadata("design:type", Number)
], PaginationMetaDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of items across all pages',
        example: 150,
        minimum: 0,
        type: Number,
    }),
    __metadata("design:type", Number)
], PaginationMetaDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of pages',
        example: 8,
        minimum: 0,
        type: Number,
    }),
    __metadata("design:type", Number)
], PaginationMetaDto.prototype, "pages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether there is a next page available',
        example: true,
        type: Boolean,
    }),
    __metadata("design:type", Boolean)
], PaginationMetaDto.prototype, "hasNext", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether there is a previous page available',
        example: false,
        type: Boolean,
    }),
    __metadata("design:type", Boolean)
], PaginationMetaDto.prototype, "hasPrev", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of the next page (null if no next page)',
        example: 2,
        nullable: true,
        type: Number,
    }),
    __metadata("design:type", Number)
], PaginationMetaDto.prototype, "nextPage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of the previous page (null if no previous page)',
        example: null,
        nullable: true,
        type: Number,
    }),
    __metadata("design:type", Number)
], PaginationMetaDto.prototype, "prevPage", void 0);
class PaginatedResponseDto {
    data;
    meta;
    static create(params) {
        return {
            data: params.data,
            meta: PaginationMetaDto.create({
                page: params.page,
                limit: params.limit,
                total: params.total,
            }),
        };
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { data: { required: true }, meta: { required: true, type: () => require("./paginated-response.dto").PaginationMetaDto } };
    }
}
exports.PaginatedResponseDto = PaginatedResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of items for the current page',
        isArray: true,
        type: () => Object,
    }),
    (0, class_transformer_1.Type)(() => Object),
    __metadata("design:type", Array)
], PaginatedResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Pagination metadata',
        type: () => PaginationMetaDto,
    }),
    (0, class_transformer_1.Type)(() => PaginationMetaDto),
    __metadata("design:type", PaginationMetaDto)
], PaginatedResponseDto.prototype, "meta", void 0);
class PaginationQueryDto {
    page = 1;
    limit = 20;
    getOffset() {
        return ((this.page || 1) - 1) * (this.limit || 20);
    }
    getLimit() {
        return Math.min(this.limit || 20, 100);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { page: { required: false, type: () => Number, default: 1 }, limit: { required: false, type: () => Number, default: 20 } };
    }
}
exports.PaginationQueryDto = PaginationQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Page number (1-indexed)',
        example: 1,
        required: false,
        default: 1,
        minimum: 1,
        type: Number,
    }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], PaginationQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of items per page',
        example: 20,
        required: false,
        default: 20,
        minimum: 1,
        maximum: 100,
        type: Number,
    }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], PaginationQueryDto.prototype, "limit", void 0);
//# sourceMappingURL=paginated-response.dto.js.map