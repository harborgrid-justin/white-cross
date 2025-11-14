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
exports.AlertsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_1 = require("../auth");
const decorators_1 = require("../auth/decorators");
const alerts_service_1 = require("./alerts.service");
const dto_1 = require("./dto");
const base_1 = require("../../common/base");
let AlertsController = class AlertsController extends base_1.BaseController {
    alertsService;
    constructor(alertsService) {
        super();
        this.alertsService = alertsService;
    }
    async getUserAlerts(userId, filterDto) {
        return this.alertsService.getUserAlerts(userId, filterDto);
    }
    async create(userId, createDto) {
        return this.alertsService.createAlert(createDto, userId);
    }
    async markAsRead(userId, id) {
        return this.alertsService.markAsRead(id, userId);
    }
    async remove(id) {
        await this.alertsService.deleteAlert(id);
    }
    async getPreferences(userId) {
        return this.alertsService.getPreferences(userId);
    }
    async updatePreferences(userId, updateDto) {
        return this.alertsService.updatePreferences(userId, updateDto);
    }
};
exports.AlertsController = AlertsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get user alerts',
        description: 'Retrieves all alerts for the current user with pagination.',
    }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: 'number' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: 'number' }),
    (0, swagger_1.ApiQuery)({ name: 'unreadOnly', required: false, type: 'boolean' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Alerts retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, decorators_1.CurrentUser)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.AlertFilterDto]),
    __metadata("design:returntype", Promise)
], AlertsController.prototype, "getUserAlerts", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Create alert',
        description: 'Creates a new alert/notification.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Alert created successfully',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.CREATED, type: require("../../database/models/alert.model").Alert }),
    __param(0, (0, decorators_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.CreateAlertDto]),
    __metadata("design:returntype", Promise)
], AlertsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id/read'),
    (0, swagger_1.ApiOperation)({
        summary: 'Mark alert as read',
        description: 'Marks a specific alert as read.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Alert UUID', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Alert marked as read',
    }),
    openapi.ApiResponse({ status: 200, type: require("../../database/models/alert.model").Alert }),
    __param(0, (0, decorators_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ version: '4' }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AlertsController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete alert',
        description: 'Deletes a specific alert.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Alert UUID', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'Alert deleted successfully',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ version: '4' }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AlertsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('preferences'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get notification preferences',
        description: 'Retrieves notification preferences for the current user.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Preferences retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200, type: require("../../database/models/alert-preferences.model").AlertPreferences }),
    __param(0, (0, decorators_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AlertsController.prototype, "getPreferences", null);
__decorate([
    (0, common_1.Patch)('preferences'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update notification preferences',
        description: 'Updates notification preferences for the current user.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Preferences updated successfully',
    }),
    openapi.ApiResponse({ status: 200, type: require("../../database/models/alert-preferences.model").AlertPreferences }),
    __param(0, (0, decorators_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.AlertsUpdatePreferencesDto]),
    __metadata("design:returntype", Promise)
], AlertsController.prototype, "updatePreferences", null);
exports.AlertsController = AlertsController = __decorate([
    (0, swagger_1.ApiTags)('alerts'),
    (0, common_1.Controller)('alerts'),
    (0, common_1.UseGuards)(auth_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [alerts_service_1.AlertsService])
], AlertsController);
//# sourceMappingURL=alerts.controller.js.map