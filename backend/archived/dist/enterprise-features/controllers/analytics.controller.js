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
exports.AnalyticsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const analytics_dashboard_service_1 = require("../analytics-dashboard.service");
const dto_1 = require("../dto");
const base_1 = require("../../common/base");
let AnalyticsController = class AnalyticsController extends base_1.BaseController {
    analyticsService;
    constructor(analyticsService) {
        super();
        this.analyticsService = analyticsService;
    }
    getRealtimeMetrics() {
        return this.analyticsService.getRealtimeMetrics();
    }
    getHealthTrends(period) {
        return this.analyticsService.getHealthTrends(period);
    }
};
exports.AnalyticsController = AnalyticsController;
__decorate([
    (0, common_1.Get)('metrics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get real-time dashboard metrics' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Metrics retrieved',
        type: [dto_1.DashboardMetricResponseDto],
    }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "getRealtimeMetrics", null);
__decorate([
    (0, common_1.Get)('trends'),
    (0, swagger_1.ApiOperation)({ summary: 'Get health trends' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Trends retrieved' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "getHealthTrends", null);
exports.AnalyticsController = AnalyticsController = __decorate([
    (0, swagger_1.ApiTags)('Analytics Dashboard'),
    (0, common_1.Controller)('enterprise-features/analytics'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [analytics_dashboard_service_1.AnalyticsDashboardService])
], AnalyticsController);
//# sourceMappingURL=analytics.controller.js.map