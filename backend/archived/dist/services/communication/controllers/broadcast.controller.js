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
exports.BroadcastController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const create_broadcast_dto_1 = require("../dto/create-broadcast.dto");
const swagger_1 = require("@nestjs/swagger");
const broadcast_service_1 = require("../services/broadcast.service");
const base_1 = require("../../../common/base");
let BroadcastController = class BroadcastController extends base_1.BaseController {
    broadcastService;
    constructor(broadcastService) {
        super();
        this.broadcastService = broadcastService;
    }
    async createBroadcast(dto, req) {
        const senderId = req.user?.id;
        return this.broadcastService.createBroadcast({ ...dto, senderId });
    }
    async listBroadcasts(page = 1, limit = 20, category, priority) {
        return this.broadcastService.listBroadcasts(page, limit, {
            category,
            priority,
        });
    }
    async listScheduled() {
        return this.broadcastService.listScheduled();
    }
    async getBroadcastById(id) {
        return this.broadcastService.getBroadcastById(id);
    }
    async getDeliveryReport(id) {
        return this.broadcastService.getDeliveryReport(id);
    }
    async getRecipients(id, page = 1, limit = 50) {
        return this.broadcastService.getRecipients(id, page, limit);
    }
    async cancelBroadcast(id, req) {
        const userId = req.user?.id;
        return this.broadcastService.cancelBroadcast(id, userId);
    }
    async scheduleBroadcast(scheduleDto, req) {
        const createdBy = req.user?.id;
        return this.broadcastService.scheduleBroadcast({
            ...scheduleDto,
            createdBy,
        });
    }
};
exports.BroadcastController = BroadcastController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create broadcast message',
        description: 'Send broadcast message to targeted audience',
    }),
    (0, swagger_1.ApiBody)({ type: create_broadcast_dto_1.CreateBroadcastDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Broadcast created and sent successfully',
        schema: {
            example: {
                message: {
                    id: '123e4567-e89b-12d3-a456-426614174000',
                    subject: 'School Emergency Alert',
                    content: 'Due to severe weather...',
                    priority: 'URGENT',
                    category: 'EMERGENCY',
                    recipientCount: 250,
                    createdAt: '2025-10-28T10:00:00Z',
                },
                deliveryStatuses: [],
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid audience or content' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_broadcast_dto_1.CreateBroadcastDto, Object]),
    __metadata("design:returntype", Promise)
], BroadcastController.prototype, "createBroadcast", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'List broadcast messages',
        description: 'Get paginated list of broadcast messages',
    }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 20 }),
    (0, swagger_1.ApiQuery)({ name: 'category', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'priority', required: false }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Broadcasts retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('category')),
    __param(3, (0, common_1.Query)('priority')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], BroadcastController.prototype, "listBroadcasts", null);
__decorate([
    (0, common_1.Get)('scheduled'),
    (0, swagger_1.ApiOperation)({
        summary: 'List scheduled broadcasts',
        description: "Get all scheduled broadcasts that haven't been sent yet",
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Scheduled broadcasts retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BroadcastController.prototype, "listScheduled", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get broadcast by ID',
        description: 'Retrieve detailed information about a broadcast',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Broadcast ID (UUID)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Broadcast retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Broadcast not found' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BroadcastController.prototype, "getBroadcastById", null);
__decorate([
    (0, common_1.Get)(':id/delivery'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get broadcast delivery report',
        description: 'Get comprehensive delivery report with statistics by channel and recipient type',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Broadcast ID (UUID)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Delivery report retrieved successfully',
        schema: {
            example: {
                report: {
                    messageId: '123e4567-e89b-12d3-a456-426614174000',
                    summary: {
                        total: 250,
                        pending: 0,
                        sent: 10,
                        delivered: 240,
                        failed: 0,
                        bounced: 0,
                    },
                    byChannel: {
                        EMAIL: { total: 200, delivered: 195, failed: 5, pending: 0 },
                        SMS: { total: 50, delivered: 45, failed: 5, pending: 0 },
                    },
                    byRecipientType: {
                        PARENT: { total: 150, delivered: 145, failed: 5, pending: 0 },
                        EMERGENCY_CONTACT: {
                            total: 100,
                            delivered: 95,
                            failed: 5,
                            pending: 0,
                        },
                    },
                },
            },
        },
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BroadcastController.prototype, "getDeliveryReport", null);
__decorate([
    (0, common_1.Get)(':id/recipients'),
    (0, swagger_1.ApiOperation)({
        summary: 'List broadcast recipients',
        description: 'Get paginated list of recipients for a broadcast',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Broadcast ID (UUID)' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 50 }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Recipients retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], BroadcastController.prototype, "getRecipients", null);
__decorate([
    (0, common_1.Post)(':id/cancel'),
    (0, swagger_1.ApiOperation)({
        summary: 'Cancel scheduled broadcast',
        description: 'Cancel a broadcast that is scheduled but not yet sent',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Broadcast ID (UUID)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Broadcast cancelled successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Cannot cancel sent broadcasts' }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Not authorized to cancel this broadcast',
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BroadcastController.prototype, "cancelBroadcast", null);
__decorate([
    (0, common_1.Post)('schedule'),
    (0, swagger_1.ApiOperation)({
        summary: 'Schedule broadcast for future delivery',
        description: 'Create a broadcast scheduled for future delivery',
    }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                subject: { type: 'string', example: 'Scheduled Announcement' },
                body: { type: 'string', example: 'This is a scheduled message...' },
                recipientType: {
                    type: 'string',
                    enum: [
                        'ALL_PARENTS',
                        'SPECIFIC_USERS',
                        'STUDENT_PARENTS',
                        'GRADE_LEVEL',
                        'CUSTOM_GROUP',
                    ],
                },
                recipientIds: { type: 'array', items: { type: 'string' } },
                channels: {
                    type: 'array',
                    items: { type: 'string', enum: ['EMAIL', 'SMS', 'PUSH', 'PORTAL'] },
                },
                scheduledFor: {
                    type: 'string',
                    format: 'date-time',
                    example: '2025-10-29T09:00:00Z',
                },
                priority: { type: 'string', enum: ['LOW', 'NORMAL', 'HIGH'] },
            },
            required: [
                'subject',
                'body',
                'recipientType',
                'channels',
                'scheduledFor',
            ],
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Broadcast scheduled successfully',
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BroadcastController.prototype, "scheduleBroadcast", null);
exports.BroadcastController = BroadcastController = __decorate([
    (0, swagger_1.ApiTags)('Broadcasts'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('broadcasts'),
    __metadata("design:paramtypes", [broadcast_service_1.BroadcastService])
], BroadcastController);
//# sourceMappingURL=broadcast.controller.js.map