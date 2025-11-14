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
exports.HealthController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const public_decorator_1 = require("../../services/auth/decorators/public.decorator");
const monitoring_service_1 = require("./monitoring.service");
const base_1 = require("../../common/base");
const health_check_interface_1 = require("./interfaces/health-check.interface");
let HealthController = class HealthController extends base_1.BaseController {
    monitoringService;
    constructor(monitoringService) {
        super();
        this.monitoringService = monitoringService;
    }
    async getHealth() {
        const health = await this.monitoringService.performHealthCheck();
        const statusCode = health.status === health_check_interface_1.HealthStatus.HEALTHY
            ? common_1.HttpStatus.OK
            : health.status === health_check_interface_1.HealthStatus.DEGRADED
                ? common_1.HttpStatus.OK
                : common_1.HttpStatus.SERVICE_UNAVAILABLE;
        return {
            data: health,
            statusCode,
        };
    }
    async getReadiness() {
        const readiness = await this.monitoringService.checkReadiness();
        const statusCode = readiness.ready
            ? common_1.HttpStatus.OK
            : common_1.HttpStatus.SERVICE_UNAVAILABLE;
        return {
            data: readiness,
            statusCode,
        };
    }
    getLiveness() {
        const liveness = this.monitoringService.checkLiveness();
        return {
            data: liveness,
            statusCode: common_1.HttpStatus.OK,
        };
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Comprehensive health check endpoint", summary: 'Comprehensive health check',
        description: 'Returns detailed health status of all infrastructure components including database, cache, queues, and external APIs' }),
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'System is healthy or degraded',
        type: Object,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.SERVICE_UNAVAILABLE,
        description: 'System is unhealthy',
    }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "getHealth", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Kubernetes readiness probe endpoint", summary: 'Kubernetes readiness probe',
        description: 'Returns 200 if the application is ready to serve traffic. Used by Kubernetes to determine when to route traffic to the pod.' }),
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('ready'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Application is ready to serve traffic',
        type: Object,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.SERVICE_UNAVAILABLE,
        description: 'Application is not ready',
    }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "getReadiness", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Kubernetes liveness probe endpoint", summary: 'Kubernetes liveness probe',
        description: 'Returns 200 if the application process is alive. Used by Kubernetes to determine when to restart the pod.' }),
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('live'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Process is alive',
        type: Object,
    }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], HealthController.prototype, "getLiveness", null);
exports.HealthController = HealthController = __decorate([
    (0, swagger_1.ApiTags)('Health & Monitoring'),
    (0, common_1.Controller)({ path: 'health', version: common_1.VERSION_NEUTRAL }),
    __metadata("design:paramtypes", [monitoring_service_1.MonitoringService])
], HealthController);
//# sourceMappingURL=health.controller.js.map