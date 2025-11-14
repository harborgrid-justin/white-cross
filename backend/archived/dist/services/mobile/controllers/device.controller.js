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
exports.DeviceController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../auth/decorators/current-user.decorator");
const notification_service_1 = require("../services/notification.service");
const dto_1 = require("../dto");
const base_1 = require("../../../common/base");
let DeviceController = class DeviceController extends base_1.BaseController {
    notificationService;
    constructor(notificationService) {
        super();
        this.notificationService = notificationService;
    }
    async registerDevice(userId, dto) {
        return this.notificationService.registerDeviceToken(userId, dto);
    }
    async getUserDevices(userId) {
        return this.notificationService.getUserDevices(userId);
    }
    async unregisterDevice(userId, tokenId) {
        return this.notificationService.unregisterDeviceToken(userId, tokenId);
    }
    async updatePreferences(userId, tokenId, dto) {
        return this.notificationService.updatePreferences(userId, tokenId, dto);
    }
};
exports.DeviceController = DeviceController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Register a mobile device for push notifications' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Device registered successfully' }),
    openapi.ApiResponse({ status: 201, type: require("../../../database/models/device-token.model").DeviceToken }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.RegisterDeviceDto]),
    __metadata("design:returntype", Promise)
], DeviceController.prototype, "registerDevice", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get user registered devices' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Devices retrieved successfully' }),
    openapi.ApiResponse({ status: 200, type: [require("../../../database/models/device-token.model").DeviceToken] }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DeviceController.prototype, "getUserDevices", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Unregister a device' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Device unregistered successfully' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DeviceController.prototype, "unregisterDevice", null);
__decorate([
    (0, common_1.Put)(':id/preferences'),
    (0, swagger_1.ApiOperation)({ summary: 'Update device notification preferences' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Preferences updated successfully' }),
    openapi.ApiResponse({ status: 200, type: require("../../../database/models/device-token.model").DeviceToken }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, dto_1.MobileUpdatePreferencesDto]),
    __metadata("design:returntype", Promise)
], DeviceController.prototype, "updatePreferences", null);
exports.DeviceController = DeviceController = __decorate([
    (0, swagger_1.ApiTags)('mobile-devices'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('mobile/devices'),
    __metadata("design:paramtypes", [notification_service_1.NotificationService])
], DeviceController);
//# sourceMappingURL=device.controller.js.map