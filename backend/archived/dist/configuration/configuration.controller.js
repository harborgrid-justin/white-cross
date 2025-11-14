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
exports.ConfigurationController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const configuration_service_1 = require("./services/configuration.service");
const dto_1 = require("./dto");
const administration_enums_1 = require("../services/administration/enums/administration.enums");
const jwt_auth_guard_1 = require("../services/auth/guards/jwt-auth.guard");
const base_1 = require("../common/base");
let ConfigurationController = class ConfigurationController extends base_1.BaseController {
    configurationService;
    constructor(configurationService) {
        super();
        this.configurationService = configurationService;
    }
    async getConfigurations(filter) {
        return this.configurationService.getConfigurations(filter);
    }
    async getConfigByKey(key, scopeId) {
        return this.configurationService.getConfigByKey(key, scopeId);
    }
    async getPublicConfigurations() {
        return this.configurationService.getPublicConfigurations();
    }
    async getConfigsByCategory(category, scopeId) {
        return this.configurationService.getConfigsByCategory(category, scopeId);
    }
    async getConfigsRequiringRestart() {
        return this.configurationService.getConfigsRequiringRestart();
    }
    async getConfigHistory(key, limit) {
        return this.configurationService.getConfigHistory(key, limit || 50);
    }
    async getConfigChangesByUser(userId, limit) {
        return this.configurationService.getConfigChangesByUser(userId, limit || 50);
    }
    async getRecentChanges(limit) {
        return this.configurationService.getRecentChanges(limit || 100);
    }
    async getConfigurationStatistics() {
        return this.configurationService.getConfigurationStatistics();
    }
    async createConfiguration(createDto) {
        return this.configurationService.createConfiguration(createDto);
    }
    async updateConfiguration(key, updateDto, scopeId, request) {
        if (request) {
            updateDto.ipAddress = updateDto.ipAddress || request.ip;
            updateDto.userAgent = updateDto.userAgent || request.get('user-agent');
        }
        return this.configurationService.updateConfiguration(key, updateDto, scopeId);
    }
    async bulkUpdateConfigurations(bulkUpdateDto) {
        return this.configurationService.bulkUpdateConfigurations(bulkUpdateDto);
    }
    async resetToDefault(key, changedBy, scopeId) {
        return this.configurationService.resetToDefault(key, changedBy, scopeId);
    }
    async deleteConfiguration(key, scopeId) {
        await this.configurationService.deleteConfiguration(key, scopeId);
    }
    async exportConfigurations(filter) {
        const json = await this.configurationService.exportConfigurations(filter);
        return { json, count: JSON.parse(json).length };
    }
    async importConfigurations(importDto) {
        return this.configurationService.importConfigurations(importDto);
    }
};
exports.ConfigurationController = ConfigurationController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get all configurations with optional filtering\nGET /configurations", summary: 'Get all configurations',
        description: 'Retrieve configurations with optional filtering by category, scope, tags, visibility, etc. Supports pagination and advanced search capabilities.' }),
    (0, common_1.Get)(),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        type: 'number',
        example: 1,
        description: 'Page number for pagination',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: 'number',
        example: 50,
        description: 'Items per page',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'category',
        required: false,
        enum: ['system', 'security', 'notification', 'integration'],
        description: 'Filter by configuration category',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'scope',
        required: false,
        description: 'Filter by configuration scope',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'isPublic',
        required: false,
        type: 'boolean',
        description: 'Filter by public visibility',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'search',
        required: false,
        description: 'Search in configuration keys and descriptions',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Configurations retrieved successfully with pagination',
        schema: {
            type: 'object',
            properties: {
                configurations: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            key: { type: 'string' },
                            value: { type: 'string' },
                            description: { type: 'string' },
                            category: { type: 'string' },
                            dataType: {
                                type: 'string',
                                enum: ['string', 'number', 'boolean', 'json'],
                            },
                            isPublic: { type: 'boolean' },
                            isEditable: { type: 'boolean' },
                            requiresRestart: { type: 'boolean' },
                            updatedAt: { type: 'string', format: 'date-time' },
                        },
                    },
                },
                pagination: {
                    type: 'object',
                    properties: {
                        page: { type: 'number' },
                        limit: { type: 'number' },
                        total: { type: 'number' },
                        pages: { type: 'number' },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Authentication required',
    }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    openapi.ApiResponse({ status: 200, type: [require("../database/models/system-config.model").SystemConfig] }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.FilterConfigurationDto]),
    __metadata("design:returntype", Promise)
], ConfigurationController.prototype, "getConfigurations", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get a single configuration by key\nGET /configurations/:key", summary: 'Get configuration by key',
        description: 'Retrieve a single configuration by its unique key' }),
    (0, common_1.Get)(':key'),
    (0, swagger_1.ApiParam)({ name: 'key', description: 'Configuration key' }),
    (0, swagger_1.ApiQuery)({
        name: 'scopeId',
        required: false,
        description: 'Optional scope ID for scoped configurations',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Configuration retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Configuration not found' }),
    openapi.ApiResponse({ status: 200, type: require("../database/models/system-config.model").SystemConfig }),
    __param(0, (0, common_1.Param)('key')),
    __param(1, (0, common_1.Query)('scopeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ConfigurationController.prototype, "getConfigByKey", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get public configurations\nGET /configurations/public/all", summary: 'Get public configurations',
        description: 'Retrieve all configurations marked as public (safe for frontend exposure)' }),
    (0, common_1.Get)('public/all'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Public configurations retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200, type: [require("../database/models/system-config.model").SystemConfig] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ConfigurationController.prototype, "getPublicConfigurations", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get configurations by category\nGET /configurations/category/:category", summary: 'Get configurations by category',
        description: 'Retrieve all configurations in a specific category' }),
    (0, common_1.Get)('category/:category'),
    (0, swagger_1.ApiParam)({
        name: 'category',
        enum: administration_enums_1.ConfigCategory,
        description: 'Configuration category',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'scopeId',
        required: false,
        description: 'Optional scope ID',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Configurations retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200, type: [require("../database/models/system-config.model").SystemConfig] }),
    __param(0, (0, common_1.Param)('category')),
    __param(1, (0, common_1.Query)('scopeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ConfigurationController.prototype, "getConfigsByCategory", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get configurations requiring restart\nGET /configurations/restart-required/all", summary: 'Get configurations requiring restart',
        description: 'Retrieve all configurations that require system restart when changed' }),
    (0, common_1.Get)('restart-required/all'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Configurations retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200, type: [require("../database/models/system-config.model").SystemConfig] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ConfigurationController.prototype, "getConfigsRequiringRestart", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get configuration change history\nGET /configurations/:key/history", summary: 'Get configuration history',
        description: 'Retrieve change history for a specific configuration' }),
    (0, common_1.Get)(':key/history'),
    (0, swagger_1.ApiParam)({ name: 'key', description: 'Configuration key' }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        description: 'Maximum number of history records',
        type: Number,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Configuration history retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200, type: [require("../database/models/configuration-history.model").ConfigurationHistory] }),
    __param(0, (0, common_1.Param)('key')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], ConfigurationController.prototype, "getConfigHistory", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get changes by user\nGET /configurations/changes/user/:userId", summary: 'Get configuration changes by user',
        description: 'Retrieve all configuration changes made by a specific user' }),
    (0, common_1.Get)('changes/user/:userId'),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User ID' }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        description: 'Maximum number of records',
        type: Number,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User changes retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200, type: [require("../database/models/configuration-history.model").ConfigurationHistory] }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], ConfigurationController.prototype, "getConfigChangesByUser", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get recent changes\nGET /configurations/changes/recent", summary: 'Get recent configuration changes',
        description: 'Retrieve recent configuration changes across all configurations' }),
    (0, common_1.Get)('changes/recent'),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        description: 'Maximum number of records',
        type: Number,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Recent changes retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200, type: [require("../database/models/configuration-history.model").ConfigurationHistory] }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ConfigurationController.prototype, "getRecentChanges", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get configuration statistics\nGET /configurations/statistics/summary", summary: 'Get configuration statistics',
        description: 'Retrieve aggregate statistics about configurations' }),
    (0, common_1.Get)('statistics/summary'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Statistics retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ConfigurationController.prototype, "getConfigurationStatistics", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Create a new configuration\nPOST /configurations", summary: 'Create configuration',
        description: 'Create a new system configuration with validation and audit trail. Requires ADMIN role. Supports various data types and validation rules.' }),
    (0, common_1.Post)(),
    (0, swagger_1.ApiBody)({ type: dto_1.CreateConfigurationDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Configuration created successfully',
        schema: {
            type: 'object',
            properties: {
                key: { type: 'string' },
                value: { type: 'string' },
                description: { type: 'string' },
                category: { type: 'string' },
                dataType: { type: 'string' },
                isPublic: { type: 'boolean' },
                isEditable: { type: 'boolean' },
                requiresRestart: { type: 'boolean' },
                createdBy: { type: 'string' },
                createdAt: { type: 'string', format: 'date-time' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid input data, validation errors, or key already exists',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Authentication required',
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Admin role required' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    openapi.ApiResponse({ status: 201, type: require("../database/models/system-config.model").SystemConfig }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateConfigurationDto]),
    __metadata("design:returntype", Promise)
], ConfigurationController.prototype, "createConfiguration", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Update a configuration\nPUT /configurations/:key", summary: 'Update configuration',
        description: 'Update a configuration value with comprehensive validation and audit trail. Tracks all changes for compliance. Some configurations may require system restart.' }),
    (0, common_1.Put)(':key'),
    (0, swagger_1.ApiParam)({
        name: 'key',
        description: 'Configuration key',
        example: 'notification.email.enabled',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'scopeId',
        required: false,
        description: 'Optional scope ID for scoped configurations',
    }),
    (0, swagger_1.ApiBody)({ type: dto_1.UpdateConfigurationDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Configuration updated successfully with audit record',
        schema: {
            type: 'object',
            properties: {
                key: { type: 'string' },
                oldValue: { type: 'string' },
                newValue: { type: 'string' },
                updatedBy: { type: 'string' },
                updatedAt: { type: 'string', format: 'date-time' },
                requiresRestart: { type: 'boolean' },
                changeId: { type: 'string', format: 'uuid' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Validation error, configuration not editable, or invalid value',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Authentication required',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Insufficient permissions to modify this configuration',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Configuration not found' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    openapi.ApiResponse({ status: 200, type: require("../database/models/system-config.model").SystemConfig }),
    __param(0, (0, common_1.Param)('key')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)('scopeId')),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateConfigurationDto, String, Object]),
    __metadata("design:returntype", Promise)
], ConfigurationController.prototype, "updateConfiguration", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Bulk update configurations\nPUT /configurations/bulk/update", summary: 'Bulk update configurations',
        description: 'Update multiple configurations in a single request' }),
    (0, common_1.Put)('bulk/update'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Bulk update completed' }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.ConfigurationBulkUpdateDto]),
    __metadata("design:returntype", Promise)
], ConfigurationController.prototype, "bulkUpdateConfigurations", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Reset configuration to default\nPUT /configurations/:key/reset", summary: 'Reset configuration to default',
        description: 'Reset a configuration to its default value' }),
    (0, common_1.Put)(':key/reset'),
    (0, swagger_1.ApiParam)({ name: 'key', description: 'Configuration key' }),
    (0, swagger_1.ApiQuery)({
        name: 'scopeId',
        required: false,
        description: 'Optional scope ID',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Configuration reset successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'No default value specified' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Configuration not found' }),
    openapi.ApiResponse({ status: 200, type: require("../database/models/system-config.model").SystemConfig }),
    __param(0, (0, common_1.Param)('key')),
    __param(1, (0, common_1.Body)('changedBy')),
    __param(2, (0, common_1.Query)('scopeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ConfigurationController.prototype, "resetToDefault", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Delete a configuration\nDELETE /configurations/:key", summary: 'Delete configuration',
        description: 'Delete a configuration by key (ADMIN ONLY)' }),
    (0, common_1.Delete)(':key'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiParam)({ name: 'key', description: 'Configuration key' }),
    (0, swagger_1.ApiQuery)({
        name: 'scopeId',
        required: false,
        description: 'Optional scope ID',
    }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'Configuration deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Configuration not found' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('key')),
    __param(1, (0, common_1.Query)('scopeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ConfigurationController.prototype, "deleteConfiguration", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Export configurations\nPOST /configurations/export", summary: 'Export configurations',
        description: 'Export configurations as JSON with optional filtering' }),
    (0, common_1.Post)('export'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Configurations exported successfully',
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.FilterConfigurationDto]),
    __metadata("design:returntype", Promise)
], ConfigurationController.prototype, "exportConfigurations", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Import configurations\nPOST /configurations/import", summary: 'Import configurations',
        description: 'Import configurations from JSON (ADMIN ONLY)' }),
    (0, common_1.Post)('import'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Import completed with results summary',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid JSON format' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.ImportConfigurationsDto]),
    __metadata("design:returntype", Promise)
], ConfigurationController.prototype, "importConfigurations", null);
exports.ConfigurationController = ConfigurationController = __decorate([
    (0, swagger_1.ApiTags)('Configuration'),
    (0, common_1.Controller)('configurations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [configuration_service_1.ConfigurationService])
], ConfigurationController);
//# sourceMappingURL=configuration.controller.js.map