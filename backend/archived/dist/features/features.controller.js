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
exports.FeaturesController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const features_service_1 = require("./features.service");
const dto_1 = require("./dto");
const base_1 = require("../common/base");
let FeaturesController = class FeaturesController extends base_1.BaseController {
    featuresService;
    constructor(featuresService) {
        super();
        this.featuresService = featuresService;
    }
    async findAll() {
        return this.featuresService.getAllFeatures();
    }
    async getFeature(name) {
        return this.featuresService.isFeatureEnabled(name);
    }
    async toggleFeature(name, toggleDto) {
        return this.featuresService.toggleFeature(name, toggleDto.enabled);
    }
};
exports.FeaturesController = FeaturesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'List all features',
        description: 'Retrieves all feature flags and their current status.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Features retrieved successfully',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    name: { type: 'string' },
                    enabled: { type: 'boolean' },
                    description: { type: 'string' },
                },
            },
        },
    }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FeaturesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':name'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get feature status',
        description: 'Checks if a specific feature is enabled.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'name',
        description: 'Feature flag name',
        example: 'ai-search',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Feature status retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                enabled: { type: 'boolean' },
            },
        },
    }),
    openapi.ApiResponse({ status: 200, type: Boolean }),
    __param(0, (0, common_1.Param)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FeaturesController.prototype, "getFeature", null);
__decorate([
    (0, common_1.Patch)(':name'),
    (0, swagger_1.ApiOperation)({
        summary: 'Toggle feature flag',
        description: 'Enables or disables a feature flag. Admin only.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'name',
        description: 'Feature flag name',
        example: 'ai-search',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Feature toggled successfully',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('name')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.ToggleFeatureDto]),
    __metadata("design:returntype", Promise)
], FeaturesController.prototype, "toggleFeature", null);
exports.FeaturesController = FeaturesController = __decorate([
    (0, swagger_1.ApiTags)('features'),
    (0, common_1.Controller)('features'),
    __metadata("design:paramtypes", [features_service_1.FeaturesService])
], FeaturesController);
//# sourceMappingURL=features.controller.js.map