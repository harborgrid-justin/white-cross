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
exports.MessageController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const message_service_1 = require("../services/message.service");
const send_message_dto_1 = require("../dto/send-message.dto");
const base_1 = require("../../../common/base");
let MessageController = class MessageController extends base_1.BaseController {
    messageService;
    constructor(messageService) {
        super();
        this.messageService = messageService;
    }
    async sendMessage(dto, req) {
        const senderId = req.user?.id;
        return this.messageService.sendMessage({ ...dto, senderId });
    }
    async listMessages(page = 1, limit = 20, senderId, category, priority, dateFrom, dateTo) {
        return this.messageService.getMessages(page, limit, {
            senderId,
            category,
            priority,
            dateFrom,
            dateTo,
        });
    }
    async getInbox(page = 1, limit = 20, req) {
        const userId = req.user?.id;
        return this.messageService.getInbox(userId, page, limit);
    }
    async getSentMessages(page = 1, limit = 20, req) {
        const userId = req.user?.id;
        return this.messageService.getSentMessages(userId, page, limit);
    }
    async getMessageById(id) {
        return this.messageService.getMessageById(id);
    }
    async getDeliveryStatus(id) {
        return this.messageService.getMessageDeliveryStatus(id);
    }
    async replyToMessage(id, replyDto, req) {
        const senderId = req.user?.id;
        return this.messageService.replyToMessage(id, senderId, replyDto);
    }
    async deleteMessage(id, req) {
        const userId = req.user?.id;
        await this.messageService.deleteScheduledMessage(id, userId);
    }
};
exports.MessageController = MessageController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Send a new message',
        description: 'Send a message to specific recipients via selected channels',
    }),
    (0, swagger_1.ApiBody)({ type: send_message_dto_1.SendMessageDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Message sent successfully',
        schema: {
            example: {
                message: {
                    id: '123e4567-e89b-12d3-a456-426614174000',
                    subject: 'Important Health Update',
                    content: 'Your child has a scheduled appointment...',
                    priority: 'MEDIUM',
                    category: 'HEALTH_UPDATE',
                    senderId: '456e7890-e89b-12d3-a456-426614174000',
                    createdAt: '2025-10-28T10:00:00Z',
                },
                deliveryStatuses: [
                    {
                        recipientId: '789e0123-e89b-12d3-a456-426614174000',
                        channel: 'EMAIL',
                        status: 'DELIVERED',
                        sentAt: '2025-10-28T10:00:05Z',
                        deliveredAt: '2025-10-28T10:00:10Z',
                    },
                ],
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_message_dto_1.SendMessageDto, Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'List messages',
        description: 'Get paginated list of messages with optional filters',
    }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 20 }),
    (0, swagger_1.ApiQuery)({ name: 'senderId', required: false, type: String }),
    (0, swagger_1.ApiQuery)({
        name: 'category',
        required: false,
        enum: [
            'EMERGENCY',
            'HEALTH_UPDATE',
            'APPOINTMENT_REMINDER',
            'MEDICATION_REMINDER',
            'GENERAL',
            'INCIDENT_NOTIFICATION',
            'COMPLIANCE',
        ],
    }),
    (0, swagger_1.ApiQuery)({
        name: 'priority',
        required: false,
        enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
    }),
    (0, swagger_1.ApiQuery)({
        name: 'dateFrom',
        required: false,
        type: String,
        example: '2025-10-01',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'dateTo',
        required: false,
        type: String,
        example: '2025-10-31',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Messages retrieved successfully',
        schema: {
            example: {
                messages: [
                    {
                        id: '123e4567-e89b-12d3-a456-426614174000',
                        subject: 'Health Update',
                        content: 'Message content...',
                        priority: 'MEDIUM',
                        category: 'HEALTH_UPDATE',
                        recipientCount: 5,
                        createdAt: '2025-10-28T10:00:00Z',
                    },
                ],
                pagination: {
                    page: 1,
                    limit: 20,
                    total: 100,
                    pages: 5,
                },
            },
        },
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('senderId')),
    __param(3, (0, common_1.Query)('category')),
    __param(4, (0, common_1.Query)('priority')),
    __param(5, (0, common_1.Query)('dateFrom')),
    __param(6, (0, common_1.Query)('dateTo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "listMessages", null);
__decorate([
    (0, common_1.Get)('inbox'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get inbox messages',
        description: 'Get messages received by the current user',
    }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 20 }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Inbox messages retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "getInbox", null);
__decorate([
    (0, common_1.Get)('sent'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get sent messages',
        description: 'Get messages sent by the current user',
    }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 20 }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Sent messages retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "getSentMessages", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get message by ID',
        description: 'Retrieve detailed information about a specific message',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Message ID (UUID)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Message retrieved successfully',
        schema: {
            example: {
                message: {
                    id: '123e4567-e89b-12d3-a456-426614174000',
                    subject: 'Health Update',
                    content: 'Message content...',
                    priority: 'MEDIUM',
                    category: 'HEALTH_UPDATE',
                    recipientCount: 5,
                    sender: {
                        id: '456e7890-e89b-12d3-a456-426614174000',
                        firstName: 'John',
                        lastName: 'Doe',
                    },
                    createdAt: '2025-10-28T10:00:00Z',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Message not found' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "getMessageById", null);
__decorate([
    (0, common_1.Get)(':id/delivery'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get message delivery status',
        description: 'Get detailed delivery status for all recipients of a message',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Message ID (UUID)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Delivery status retrieved successfully',
        schema: {
            example: {
                deliveries: [
                    {
                        id: '789e0123-e89b-12d3-a456-426614174000',
                        recipientId: '012e3456-e89b-12d3-a456-426614174000',
                        channel: 'EMAIL',
                        status: 'DELIVERED',
                        sentAt: '2025-10-28T10:00:05Z',
                        deliveredAt: '2025-10-28T10:00:10Z',
                    },
                ],
                summary: {
                    total: 10,
                    pending: 0,
                    sent: 2,
                    delivered: 8,
                    failed: 0,
                    bounced: 0,
                },
            },
        },
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "getDeliveryStatus", null);
__decorate([
    (0, common_1.Post)(':id/reply'),
    (0, swagger_1.ApiOperation)({
        summary: 'Reply to a message',
        description: 'Send a reply to an existing message',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Original message ID (UUID)' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                content: {
                    type: 'string',
                    description: 'Reply message content',
                    example: 'Thank you for the update.',
                },
                channels: {
                    type: 'array',
                    items: {
                        type: 'string',
                        enum: ['EMAIL', 'SMS', 'PUSH_NOTIFICATION', 'VOICE'],
                    },
                    example: ['EMAIL'],
                },
            },
            required: ['content'],
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Reply sent successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Original message not found' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "replyToMessage", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete scheduled message',
        description: 'Cancel and delete a scheduled message (only if not yet sent)',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Message ID (UUID)' }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'Message deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Cannot delete sent messages' }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Not authorized to delete this message',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Message not found' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "deleteMessage", null);
exports.MessageController = MessageController = __decorate([
    (0, swagger_1.ApiTags)('Messages'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('messages'),
    __metadata("design:paramtypes", [message_service_1.MessageService])
], MessageController);
//# sourceMappingURL=message.controller.js.map