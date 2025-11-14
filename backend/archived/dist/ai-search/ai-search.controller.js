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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiSearchController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const ai_search_service_1 = require("./ai-search.service");
const base_1 = require("../common/base");
const dto_1 = require("./dto");
let AiSearchController = class AiSearchController extends base_1.BaseController {
    aiSearchService;
    constructor(aiSearchService) {
        super();
        this.aiSearchService = aiSearchService;
    }
    async search(queryDto) {
        return this.aiSearchService.search(queryDto.query, queryDto.options);
    }
    async indexContent(indexDto) {
        await this.aiSearchService.indexContent(indexDto.contentType, indexDto.contentId, indexDto.content);
        return {
            indexed: true,
            contentId: indexDto.contentId,
            contentType: indexDto.contentType,
        };
    }
    async removeFromIndex(type, id) {
        await this.aiSearchService.deleteFromIndex(type, id);
    }
    async reindexAll() {
        await this.aiSearchService.reindexAll();
        return {
            status: 'started',
            jobId: `reindex-${Date.now()}`,
            estimatedTime: '5-10 minutes',
        };
    }
    async getStats() {
        return {
            totalDocuments: 0,
            indexSize: '0 KB',
            lastIndexed: new Date().toISOString(),
            contentTypes: {},
        };
    }
    async semanticSearch(dto) {
        return this.aiSearchService.semanticSearch(dto);
    }
    async getSuggestions(partial, userId) {
        return this.aiSearchService.getSearchSuggestions(partial, userId);
    }
    async advancedSearch(dto) {
        return this.aiSearchService.advancedPatientSearch(dto, dto.userId);
    }
    async findSimilarCases(dto) {
        return this.aiSearchService.findSimilarCases(dto);
    }
    async medicationSearch(dto) {
        return this.aiSearchService.medicationSearch(dto);
    }
    async getAnalytics(period, limit) {
        return this.aiSearchService.getSearchAnalytics(period || dto_1.AnalyticsPeriod.WEEK, limit || 10);
    }
};
exports.AiSearchController = AiSearchController;
__decorate([
    (0, common_1.Post)('query'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Perform AI-powered search',
        description: 'Executes semantic search across indexed content using AI embeddings and vector similarity for intelligent healthcare data retrieval.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Search results retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                results: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            type: { type: 'string' },
                            title: { type: 'string' },
                            excerpt: { type: 'string' },
                            score: { type: 'number' },
                        },
                    },
                },
                total: { type: 'number' },
                executionTime: { type: 'number' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid search query - missing or malformed search parameters',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - authentication required',
    }),
    (0, swagger_1.ApiResponse)({
        status: 429,
        description: 'Rate limit exceeded - too many search requests',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK, type: [Object] }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.SearchQueryDto]),
    __metadata("design:returntype", Promise)
], AiSearchController.prototype, "search", null);
__decorate([
    (0, common_1.Post)('index'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Index content for search',
        description: 'Adds content to the search index with AI embeddings for semantic search.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Content indexed successfully',
        schema: {
            type: 'object',
            properties: {
                indexed: { type: 'boolean', example: true },
                contentId: { type: 'string' },
                contentType: { type: 'string' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid content data',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.CREATED }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.IndexContentDto]),
    __metadata("design:returntype", Promise)
], AiSearchController.prototype, "indexContent", null);
__decorate([
    (0, common_1.Delete)('index/:type/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({
        summary: 'Remove from index',
        description: 'Removes specific content from the search index.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'type',
        description: 'Content type (student, health-record, etc.)',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Content ID',
    }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'Content removed from index successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Content not found in index',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('type')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AiSearchController.prototype, "removeFromIndex", null);
__decorate([
    (0, common_1.Post)('reindex'),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, swagger_1.ApiOperation)({
        summary: 'Reindex all content',
        description: 'Triggers a full reindex of all searchable content. This is an async operation.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 202,
        description: 'Reindex operation started',
        schema: {
            type: 'object',
            properties: {
                status: { type: 'string', example: 'started' },
                jobId: { type: 'string' },
                estimatedTime: { type: 'string' },
            },
        },
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.ACCEPTED }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AiSearchController.prototype, "reindexAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get search statistics',
        description: 'Retrieves statistics about the search index and usage.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Statistics retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                totalDocuments: { type: 'number' },
                indexSize: { type: 'string' },
                lastIndexed: { type: 'string', format: 'date-time' },
                contentTypes: {
                    type: 'object',
                    additionalProperties: { type: 'number' },
                },
            },
        },
    }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AiSearchController.prototype, "getStats", null);
__decorate([
    (0, common_1.Post)('semantic'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Perform semantic search',
        description: 'Execute AI-powered semantic search with vector similarity matching',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Semantic search results retrieved successfully',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.SemanticSearchDto]),
    __metadata("design:returntype", Promise)
], AiSearchController.prototype, "semanticSearch", null);
__decorate([
    (0, common_1.Get)('suggestions'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get search suggestions',
        description: 'Get intelligent search suggestions based on partial input and user history',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'partial',
        description: 'Partial search text',
        example: 'asth',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'userId',
        description: 'User ID for personalized suggestions',
        example: 'uuid-123',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Search suggestions retrieved successfully',
        schema: {
            type: 'array',
            items: { type: 'string' },
        },
    }),
    openapi.ApiResponse({ status: 200, type: [String] }),
    __param(0, (0, common_1.Query)('partial')),
    __param(1, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AiSearchController.prototype, "getSuggestions", null);
__decorate([
    (0, common_1.Post)('advanced'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Advanced patient search',
        description: 'Search patients using multiple criteria including demographics, medical, and behavioral filters',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Advanced search results retrieved successfully',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.AdvancedSearchCriteriaDto]),
    __metadata("design:returntype", Promise)
], AiSearchController.prototype, "advancedSearch", null);
__decorate([
    (0, common_1.Post)('similar-cases'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Find similar medical cases',
        description: 'Find similar medical cases using vector similarity on symptoms, conditions, and treatments',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Similar cases retrieved successfully',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK, type: [Object] }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.SimilarCasesDto]),
    __metadata("design:returntype", Promise)
], AiSearchController.prototype, "findSimilarCases", null);
__decorate([
    (0, common_1.Post)('medication'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Medication search',
        description: 'Search for medication interactions, alternatives, side effects, or contraindications',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Medication search results retrieved successfully',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.MedicationSearchDto]),
    __metadata("design:returntype", Promise)
], AiSearchController.prototype, "medicationSearch", null);
__decorate([
    (0, common_1.Get)('analytics'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get search analytics',
        description: 'Get search analytics including top queries, trends, and performance metrics',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'period',
        description: 'Time period for analytics',
        enum: dto_1.AnalyticsPeriod,
        required: false,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        description: 'Maximum number of top queries',
        type: Number,
        required: false,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Search analytics retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)('period')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], AiSearchController.prototype, "getAnalytics", null);
exports.AiSearchController = AiSearchController = __decorate([
    (0, swagger_1.ApiTags)('AI Search'),
    (0, common_1.Controller)('ai-search'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [ai_search_service_1.AiSearchService])
], AiSearchController);
//# sourceMappingURL=ai-search.controller.js.map