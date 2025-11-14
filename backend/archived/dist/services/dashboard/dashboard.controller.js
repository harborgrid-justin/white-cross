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
exports.DashboardController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const base_1 = require("../../common/base");
const dashboard_service_1 = require("./dashboard.service");
const dto_1 = require("./dto");
let DashboardController = class DashboardController extends base_1.BaseController {
    dashboardService;
    constructor(dashboardService) {
        super();
        this.dashboardService = dashboardService;
    }
    async getDashboardStats() {
        this.logInfo('GET /dashboard/stats');
        return this.dashboardService.getDashboardStats();
    }
    async getRecentActivities(query) {
        this.logInfo(`GET /dashboard/recent-activities?limit=${query.limit || 5}`);
        return this.dashboardService.getRecentActivities(query.limit);
    }
    async getUpcomingAppointments(query) {
        this.logInfo(`GET /dashboard/upcoming-appointments?limit=${query.limit || 5}`);
        return this.dashboardService.getUpcomingAppointments(query.limit);
    }
    async getChartData(query) {
        this.logInfo(`GET /dashboard/chart-data?period=${query.period || 'week'}`);
        return this.dashboardService.getChartData(query.period);
    }
    async getDashboardStatsByScope(query) {
        this.logInfo(`GET /dashboard/stats-by-scope?schoolId=${query.schoolId || 'none'}&districtId=${query.districtId || 'none'}`);
        return this.dashboardService.getDashboardStatsByScope(query.schoolId, query.districtId);
    }
    clearCache() {
        this.logInfo('DELETE /dashboard/cache');
        this.dashboardService.clearCache();
    }
};
exports.DashboardController = DashboardController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "GET /dashboard/stats\nGet comprehensive dashboard statistics with trend analysis\n\nReturns:\n- Total active students\n- Active medication prescriptions\n- Today's appointments\n- Pending incident reports\n- Medications due today\n- Critical health alerts\n- Recent activity count\n- Month-over-month trends\n\nCached for 5 minutes for performance optimization", summary: 'Get dashboard statistics',
        description: 'Retrieves comprehensive dashboard statistics with trend analysis. ' +
            'Includes total students, active medications, appointments, incidents, health alerts, ' +
            'and month-over-month trend comparisons. Results are cached for 5 minutes.' }),
    (0, common_1.Get)('stats'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Dashboard statistics retrieved successfully',
        type: dto_1.DashboardStatsDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK, type: require("./dto/dashboard-stats.dto").DashboardStatsDto }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getDashboardStats", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "GET /dashboard/recent-activities\nGet recent activities across all modules\n\nReturns a feed of recent:\n- Medication administrations\n- Incident reports\n- Upcoming appointments\n\nQuery Parameters:\n- limit: Maximum number of activities to return (1-50, default: 5)", summary: 'Get recent activities',
        description: 'Retrieves recent activity feed from medication logs, incident reports, and upcoming appointments. ' +
            'Activities are sorted by time and limited to the specified count.' }),
    (0, common_1.Get)('recent-activities'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Maximum number of activities to return (1-50)',
        example: 5,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Recent activities retrieved successfully',
        type: [dto_1.RecentActivityDto],
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid query parameters',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK, type: [require("./dto/recent-activity.dto").RecentActivityDto] }),
    __param(0, (0, common_1.Query)(new common_1.ValidationPipe({ transform: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.GetRecentActivitiesDto]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getRecentActivities", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "GET /dashboard/upcoming-appointments\nGet upcoming appointments with priority classification\n\nReturns scheduled appointments sorted by time with:\n- Student information\n- Appointment type\n- Priority level (high/medium/low)\n- Formatted time\n\nQuery Parameters:\n- limit: Maximum number of appointments to return (1-50, default: 5)", summary: 'Get upcoming appointments',
        description: 'Retrieves upcoming scheduled appointments with priority classification. ' +
            'Priority is determined by appointment type (emergency/medication = high, routine = low).' }),
    (0, common_1.Get)('upcoming-appointments'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Maximum number of appointments to return (1-50)',
        example: 5,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Upcoming appointments retrieved successfully',
        type: [dto_1.UpcomingAppointmentDto],
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid query parameters',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK, type: [require("./dto/upcoming-appointment.dto").UpcomingAppointmentDto] }),
    __param(0, (0, common_1.Query)(new common_1.ValidationPipe({ transform: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.GetUpcomingAppointmentsDto]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getUpcomingAppointments", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "GET /dashboard/chart-data\nGet chart data for dashboard visualizations\n\nReturns time-series data for:\n- Student enrollment trends\n- Medication administration frequency\n- Incident report frequency\n- Appointment scheduling patterns\n\nQuery Parameters:\n- period: Time period for data aggregation ('week', 'month', or 'year', default: 'week')", summary: 'Get chart data',
        description: 'Retrieves time-series chart data for dashboard visualizations. ' +
            'Includes enrollment trends, medication administration, incident frequency, and appointment trends.' }),
    (0, common_1.Get)('chart-data'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiQuery)({
        name: 'period',
        required: false,
        enum: ['week', 'month', 'year'],
        description: 'Time period for data aggregation',
        example: 'week',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Chart data retrieved successfully',
        type: dto_1.DashboardChartDataDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid query parameters',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK, type: require("./dto/chart-data.dto").DashboardChartDataDto }),
    __param(0, (0, common_1.Query)(new common_1.ValidationPipe({ transform: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.GetChartDataDto]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getChartData", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "GET /dashboard/stats-by-scope\nGet dashboard statistics filtered by school or district\n\nReturns scoped dashboard statistics for multi-tenant deployments.\n\nQuery Parameters:\n- schoolId: Optional school ID to filter data\n- districtId: Optional district ID to filter data", summary: 'Get scoped dashboard statistics',
        description: 'Retrieves dashboard statistics filtered by school or district for multi-tenant deployments. ' +
            'Currently returns general stats but can be extended for specific scope filtering.' }),
    (0, common_1.Get)('stats-by-scope'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiQuery)({
        name: 'schoolId',
        required: false,
        type: String,
        description: 'School ID to filter dashboard data',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'districtId',
        required: false,
        type: String,
        description: 'District ID to filter dashboard data',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Scoped dashboard statistics retrieved successfully',
        type: dto_1.DashboardStatsDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid query parameters',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK, type: require("./dto/dashboard-stats.dto").DashboardStatsDto }),
    __param(0, (0, common_1.Query)(new common_1.ValidationPipe({ transform: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.GetStatsByScopeDto]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getDashboardStatsByScope", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "DELETE /dashboard/cache\nClear the dashboard statistics cache\n\nForces fresh data retrieval on the next stats request.\nUseful after bulk data operations or when immediate updates are needed.", summary: 'Clear dashboard cache',
        description: 'Clears the dashboard statistics cache, forcing fresh data retrieval on the next request. ' +
            'Use this after bulk data operations when immediate dashboard updates are required.' }),
    (0, common_1.Delete)('cache'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'Cache cleared successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "clearCache", null);
exports.DashboardController = DashboardController = __decorate([
    (0, swagger_1.ApiTags)('dashboard'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('dashboard'),
    __metadata("design:paramtypes", [dashboard_service_1.DashboardService])
], DashboardController);
//# sourceMappingURL=dashboard.controller.js.map