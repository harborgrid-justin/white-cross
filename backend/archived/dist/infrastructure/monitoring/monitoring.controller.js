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
exports.MonitoringController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const monitoring_service_1 = require("./monitoring.service");
const base_1 = require("../../common/base");
let MonitoringController = class MonitoringController extends base_1.BaseController {
    monitoringService;
    constructor(monitoringService) {
        super();
        this.monitoringService = monitoringService;
    }
    async getMetrics() {
        const metrics = await this.monitoringService.collectMetrics();
        return {
            data: metrics,
            statusCode: common_1.HttpStatus.OK,
        };
    }
    async getDashboard() {
        const dashboard = await this.monitoringService.getDashboardData();
        return {
            data: dashboard,
            statusCode: common_1.HttpStatus.OK,
        };
    }
    getActiveAlerts() {
        const alerts = this.monitoringService.getActiveAlerts();
        return {
            data: alerts,
            statusCode: common_1.HttpStatus.OK,
        };
    }
    acknowledgeAlert(alertId) {
        this.monitoringService.acknowledgeAlert(alertId);
        return {
            message: `Alert ${alertId} acknowledged successfully`,
            statusCode: common_1.HttpStatus.OK,
        };
    }
    resolveAlert(alertId) {
        this.monitoringService.resolveAlert(alertId);
        return {
            message: `Alert ${alertId} resolved successfully`,
            statusCode: common_1.HttpStatus.OK,
        };
    }
    getRecentPerformance(limit) {
        const entries = this.monitoringService.getRecentPerformance(limit ? parseInt(limit.toString(), 10) : 100);
        return {
            data: entries,
            statusCode: common_1.HttpStatus.OK,
        };
    }
    trackPerformance(entry) {
        this.monitoringService.trackPerformance(entry);
        return {
            message: 'Performance entry tracked successfully',
            statusCode: common_1.HttpStatus.CREATED,
        };
    }
    queryLogs(level, context, startTime, endTime, limit, search) {
        const params = {
            level: level,
            context,
            startTime,
            endTime,
            limit: limit ? parseInt(limit.toString(), 10) : undefined,
            search,
        };
        const logs = this.monitoringService.queryLogs(params);
        return {
            data: logs,
            statusCode: common_1.HttpStatus.OK,
        };
    }
    async getSystemMetrics() {
        const metrics = await this.monitoringService.collectSystemMetrics();
        return {
            data: metrics,
            statusCode: common_1.HttpStatus.OK,
        };
    }
    async getPerformanceMetrics() {
        const metrics = await this.monitoringService.collectPerformanceMetrics();
        return {
            data: metrics,
            statusCode: common_1.HttpStatus.OK,
        };
    }
};
exports.MonitoringController = MonitoringController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get current system and application metrics", summary: 'Get current metrics',
        description: 'Returns comprehensive system and application metrics including CPU, memory, request rates, and component statistics' }),
    (0, common_1.Get)('metrics'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Metrics retrieved successfully',
        type: Object,
    }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MonitoringController.prototype, "getMetrics", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get monitoring dashboard data", summary: 'Get monitoring dashboard data',
        description: 'Returns comprehensive monitoring dashboard data including status, metrics, alerts, and performance history' }),
    (0, common_1.Get)('dashboard'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Dashboard data retrieved successfully',
        type: Object,
    }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MonitoringController.prototype, "getDashboard", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get active alerts", summary: 'Get active alerts',
        description: 'Returns all active system alerts that have not been acknowledged or resolved' }),
    (0, common_1.Get)('alerts'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Alerts retrieved successfully',
        type: Array,
    }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], MonitoringController.prototype, "getActiveAlerts", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Acknowledge an alert", summary: 'Acknowledge an alert',
        description: 'Marks an alert as acknowledged to prevent repeated notifications' }),
    (0, common_1.Post)('alerts/:alertId/acknowledge'),
    (0, swagger_1.ApiParam)({
        name: 'alertId',
        description: 'The ID of the alert to acknowledge',
        type: String,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Alert acknowledged successfully',
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('alertId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], MonitoringController.prototype, "acknowledgeAlert", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Resolve an alert", summary: 'Resolve an alert',
        description: 'Marks an alert as resolved when the underlying issue has been fixed' }),
    (0, common_1.Post)('alerts/:alertId/resolve'),
    (0, swagger_1.ApiParam)({
        name: 'alertId',
        description: 'The ID of the alert to resolve',
        type: String,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Alert resolved successfully',
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('alertId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], MonitoringController.prototype, "resolveAlert", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get recent performance entries", summary: 'Get recent performance entries',
        description: 'Returns recent performance tracking entries with operation timings and success status' }),
    (0, common_1.Get)('performance'),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        description: 'Maximum number of entries to return',
        type: Number,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Performance entries retrieved successfully',
        type: Array,
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Object)
], MonitoringController.prototype, "getRecentPerformance", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Track a performance entry", summary: 'Track a performance entry',
        description: 'Records a new performance entry for monitoring and analysis' }),
    (0, common_1.Post)('performance'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Performance entry tracked successfully',
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], MonitoringController.prototype, "trackPerformance", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Query logs", summary: 'Query log entries',
        description: 'Queries aggregated log entries with optional filtering by level, context, time range, and search query' }),
    (0, common_1.Get)('logs'),
    (0, swagger_1.ApiQuery)({
        name: 'level',
        required: false,
        description: 'Filter by log level',
        enum: ['debug', 'info', 'warn', 'error', 'fatal'],
    }),
    (0, swagger_1.ApiQuery)({
        name: 'context',
        required: false,
        description: 'Filter by context (module/service name)',
        type: String,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'startTime',
        required: false,
        description: 'Filter logs after this timestamp',
        type: String,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'endTime',
        required: false,
        description: 'Filter logs before this timestamp',
        type: String,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        description: 'Maximum number of entries to return',
        type: Number,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'search',
        required: false,
        description: 'Search query for message content',
        type: String,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Log entries retrieved successfully',
        type: Array,
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('level')),
    __param(1, (0, common_1.Query)('context')),
    __param(2, (0, common_1.Query)('startTime')),
    __param(3, (0, common_1.Query)('endTime')),
    __param(4, (0, common_1.Query)('limit')),
    __param(5, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Number, String]),
    __metadata("design:returntype", Object)
], MonitoringController.prototype, "queryLogs", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get system metrics only", summary: 'Get system metrics only',
        description: 'Returns only system-level metrics (CPU, memory, process info)' }),
    (0, common_1.Get)('metrics/system'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'System metrics retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MonitoringController.prototype, "getSystemMetrics", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get performance metrics only", summary: 'Get performance metrics only',
        description: 'Returns only application performance metrics (requests, database, cache, etc.)' }),
    (0, common_1.Get)('metrics/performance'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Performance metrics retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MonitoringController.prototype, "getPerformanceMetrics", null);
exports.MonitoringController = MonitoringController = __decorate([
    (0, swagger_1.ApiTags)('Monitoring & Metrics'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('monitoring'),
    __metadata("design:paramtypes", [monitoring_service_1.MonitoringService])
], MonitoringController);
//# sourceMappingURL=monitoring.controller.js.map