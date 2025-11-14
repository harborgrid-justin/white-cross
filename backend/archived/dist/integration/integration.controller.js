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
exports.IntegrationController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const integration_service_1 = require("./services/integration.service");
const circuit_breaker_service_1 = require("./services/circuit-breaker.service");
const rate_limiter_service_1 = require("./services/rate-limiter.service");
const create_integration_dto_1 = require("./dto/create-integration.dto");
const update_integration_dto_1 = require("./dto/update-integration.dto");
const base_1 = require("../common/base");
let IntegrationController = class IntegrationController extends base_1.BaseController {
    integrationService;
    circuitBreakerService;
    rateLimiterService;
    constructor(integrationService, circuitBreakerService, rateLimiterService) {
        super();
        this.integrationService = integrationService;
        this.circuitBreakerService = circuitBreakerService;
        this.rateLimiterService = rateLimiterService;
    }
    async createIntegration(createDto) {
        return this.integrationService.createIntegration(createDto);
    }
    async getAllIntegrations(type) {
        return this.integrationService.getAllIntegrations(type);
    }
    async getIntegrationStatus() {
        const stats = await this.integrationService.getIntegrationStatistics();
        return {
            ...stats,
            circuitBreakerStatus: {
                message: 'Circuit breaker status available for each integration',
            },
            rateLimiterStatus: {
                message: 'Rate limiter status available for each integration',
            },
        };
    }
    async getIntegrationById(id) {
        return this.integrationService.getIntegrationById(id, false);
    }
    async updateIntegration(id, updateDto) {
        return this.integrationService.updateIntegration(id, updateDto);
    }
    async deleteIntegration(id) {
        await this.integrationService.deleteIntegration(id);
    }
    async testConnection(id) {
        return this.integrationService.testConnection(id);
    }
    async syncIntegration(id) {
        return this.integrationService.syncIntegration(id);
    }
    async getIntegrationLogs(integrationId, type, page, limit) {
        return this.integrationService.getIntegrationLogs(integrationId, type, page || 1, limit || 20);
    }
    getCircuitBreakerStatus(serviceName) {
        return (this.circuitBreakerService.getStatus(serviceName) || {
            state: 'CLOSED',
            failures: 0,
            message: 'Circuit breaker not initialized for this service',
        });
    }
    resetCircuitBreaker(serviceName) {
        this.circuitBreakerService.reset(serviceName);
        return { message: `Circuit breaker reset for ${serviceName}` };
    }
    getRateLimiterStatus(serviceName) {
        return (this.rateLimiterService.getStatus(serviceName) || {
            current: 0,
            max: 100,
            window: 60000,
            remaining: 100,
            message: 'Rate limiter not initialized for this service',
        });
    }
};
exports.IntegrationController = IntegrationController;
__decorate([
    (0, common_1.Post)('configure'),
    (0, swagger_1.ApiOperation)({
        summary: 'Configure new integration',
        description: 'Create a new integration configuration for external systems (SIS, EHR, Pharmacy, Lab, Insurance, etc.)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Integration created successfully',
        schema: {
            example: {
                id: 'uuid',
                name: 'PowerSchool SIS',
                type: 'SIS',
                status: 'INACTIVE',
                endpoint: 'https://api.powerschool.com',
                apiKey: '***MASKED***',
                isActive: true,
                createdAt: '2025-10-28T08:00:00Z',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid integration data' }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Integration with this name already exists',
    }),
    (0, swagger_1.ApiBody)({ type: create_integration_dto_1.CreateIntegrationDto }),
    openapi.ApiResponse({ status: 201, type: require("../database/models/integration-config.model").IntegrationConfig }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_integration_dto_1.CreateIntegrationDto]),
    __metadata("design:returntype", Promise)
], IntegrationController.prototype, "createIntegration", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'List all integrations',
        description: 'Get all integration configurations with optional type filtering',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'type',
        required: false,
        enum: [
            'SIS',
            'EHR',
            'PHARMACY',
            'LABORATORY',
            'INSURANCE',
            'PARENT_PORTAL',
        ],
        description: 'Filter by integration type',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of integrations retrieved successfully',
        schema: {
            example: [
                {
                    id: 'uuid',
                    name: 'PowerSchool SIS',
                    type: 'SIS',
                    status: 'ACTIVE',
                    endpoint: 'https://api.powerschool.com',
                    apiKey: '***MASKED***',
                    lastSyncAt: '2025-10-28T07:00:00Z',
                    lastSyncStatus: 'success',
                },
            ],
        },
    }),
    openapi.ApiResponse({ status: 200, type: [require("../database/models/integration-config.model").IntegrationConfig] }),
    __param(0, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IntegrationController.prototype, "getAllIntegrations", null);
__decorate([
    (0, common_1.Get)('status'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get integration status overview',
        description: 'Get comprehensive statistics and status of all integrations including circuit breaker and rate limiter status',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Integration status retrieved successfully',
        schema: {
            example: {
                totalIntegrations: 6,
                activeIntegrations: 5,
                inactiveIntegrations: 1,
                syncStatistics: {
                    totalSyncs: 150,
                    successfulSyncs: 145,
                    failedSyncs: 5,
                    successRate: 96.67,
                },
                statsByType: {
                    SIS: { success: 50, failed: 1, total: 51 },
                    EHR: { success: 45, failed: 2, total: 47 },
                },
            },
        },
    }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], IntegrationController.prototype, "getIntegrationStatus", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get integration details',
        description: 'Retrieve detailed configuration for a specific integration',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Integration ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Integration details retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Integration not found' }),
    openapi.ApiResponse({ status: 200, type: require("../database/models/integration-config.model").IntegrationConfig }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IntegrationController.prototype, "getIntegrationById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update integration configuration',
        description: 'Update an existing integration configuration',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Integration ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Integration updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid update data' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Integration not found' }),
    (0, swagger_1.ApiBody)({ type: update_integration_dto_1.UpdateIntegrationDto }),
    openapi.ApiResponse({ status: 200, type: require("../database/models/integration-config.model").IntegrationConfig }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_integration_dto_1.UpdateIntegrationDto]),
    __metadata("design:returntype", Promise)
], IntegrationController.prototype, "updateIntegration", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete integration',
        description: 'Remove an integration configuration',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Integration ID' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Integration deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Integration not found' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IntegrationController.prototype, "deleteIntegration", null);
__decorate([
    (0, common_1.Post)(':id/test'),
    (0, swagger_1.ApiOperation)({
        summary: 'Test integration connection',
        description: 'Test connectivity to the external system with circuit breaker protection',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Integration ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Connection test completed',
        schema: {
            example: {
                success: true,
                message: 'Successfully connected to Student Information System',
                responseTime: 245,
                details: {
                    version: '2.1.0',
                    studentCount: 1542,
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Integration not found' }),
    (0, swagger_1.ApiResponse)({ status: 503, description: 'Circuit breaker is OPEN' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IntegrationController.prototype, "testConnection", null);
__decorate([
    (0, common_1.Post)(':id/sync'),
    (0, swagger_1.ApiOperation)({
        summary: 'Trigger integration sync',
        description: 'Manually trigger data synchronization with rate limiting and retry logic',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Integration ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Sync completed successfully',
        schema: {
            example: {
                success: true,
                recordsProcessed: 150,
                recordsSucceeded: 148,
                recordsFailed: 2,
                duration: 5240,
                errors: ['Record 1: Validation error', 'Record 2: Missing field'],
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Integration not found' }),
    (0, swagger_1.ApiResponse)({ status: 429, description: 'Rate limit exceeded' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IntegrationController.prototype, "syncIntegration", null);
__decorate([
    (0, common_1.Get)('logs'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get integration logs',
        description: 'Retrieve integration operation logs with pagination and filtering',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'integrationId',
        required: false,
        description: 'Filter by integration ID',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'type',
        required: false,
        description: 'Filter by integration type',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        type: Number,
        description: 'Page number (default: 1)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Items per page (default: 20)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Logs retrieved successfully',
        schema: {
            example: {
                logs: [
                    {
                        id: 'uuid',
                        integrationId: 'uuid',
                        integrationType: 'SIS',
                        action: 'sync',
                        status: 'success',
                        recordsProcessed: 150,
                        recordsSucceeded: 150,
                        recordsFailed: 0,
                        duration: 5000,
                        createdAt: '2025-10-28T08:00:00Z',
                    },
                ],
                pagination: {
                    page: 1,
                    limit: 20,
                    total: 100,
                    totalPages: 5,
                },
            },
        },
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('integrationId')),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], IntegrationController.prototype, "getIntegrationLogs", null);
__decorate([
    (0, common_1.Get)(':serviceName/circuit-breaker/status'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get circuit breaker status',
        description: 'Get the current status of the circuit breaker for a specific service',
    }),
    (0, swagger_1.ApiParam)({
        name: 'serviceName',
        description: 'Service name (e.g., SIS, EHR, PHARMACY)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Circuit breaker status retrieved',
        schema: {
            example: {
                state: 'CLOSED',
                failures: 0,
                nextAttempt: null,
            },
        },
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('serviceName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IntegrationController.prototype, "getCircuitBreakerStatus", null);
__decorate([
    (0, common_1.Post)(':serviceName/circuit-breaker/reset'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Reset circuit breaker',
        description: 'Manually reset the circuit breaker to CLOSED state',
    }),
    (0, swagger_1.ApiParam)({ name: 'serviceName', description: 'Service name' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Circuit breaker reset successfully',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK }),
    __param(0, (0, common_1.Param)('serviceName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IntegrationController.prototype, "resetCircuitBreaker", null);
__decorate([
    (0, common_1.Get)(':serviceName/rate-limiter/status'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get rate limiter status',
        description: 'Get the current rate limit status for a specific service',
    }),
    (0, swagger_1.ApiParam)({ name: 'serviceName', description: 'Service name' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Rate limiter status retrieved',
        schema: {
            example: {
                current: 25,
                max: 100,
                window: 60000,
                remaining: 75,
            },
        },
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('serviceName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IntegrationController.prototype, "getRateLimiterStatus", null);
exports.IntegrationController = IntegrationController = __decorate([
    (0, swagger_1.ApiTags)('Integrations'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('integrations'),
    __metadata("design:paramtypes", [integration_service_1.IntegrationService,
        circuit_breaker_service_1.CircuitBreakerService,
        rate_limiter_service_1.RateLimiterService])
], IntegrationController);
//# sourceMappingURL=integration.controller.js.map