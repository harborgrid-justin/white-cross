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
exports.BulkMessagingController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const bulk_messaging_service_1 = require("../bulk-messaging.service");
const dto_1 = require("../dto");
const base_1 = require("../../common/base");
let BulkMessagingController = class BulkMessagingController extends base_1.BaseController {
    bulkMessagingService;
    constructor(bulkMessagingService) {
        super();
        this.bulkMessagingService = bulkMessagingService;
    }
    sendBulkMessage(dto) {
        return this.bulkMessagingService.sendBulkMessage(dto.subject, dto.body, dto.recipients, dto.channels);
    }
    trackDelivery(messageId) {
        return this.bulkMessagingService.getDeliveryStats(messageId);
    }
};
exports.BulkMessagingController = BulkMessagingController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Send bulk message' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Bulk message sent',
        type: dto_1.BulkMessageResponseDto,
    }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.SendBulkMessageDto]),
    __metadata("design:returntype", void 0)
], BulkMessagingController.prototype, "sendBulkMessage", null);
__decorate([
    (0, common_1.Get)(':messageId/tracking'),
    (0, swagger_1.ApiOperation)({ summary: 'Track bulk message delivery' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Delivery stats retrieved' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('messageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BulkMessagingController.prototype, "trackDelivery", null);
exports.BulkMessagingController = BulkMessagingController = __decorate([
    (0, swagger_1.ApiTags)('Bulk Messaging'),
    (0, common_1.Controller)('enterprise-features/bulk-messages'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [bulk_messaging_service_1.BulkMessagingService])
], BulkMessagingController);
//# sourceMappingURL=bulk-messaging.controller.js.map