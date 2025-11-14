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
exports.EnhancedMessageController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const enhanced_message_service_1 = require("../services/enhanced-message.service");
const conversation_service_1 = require("../services/conversation.service");
const message_queue_service_1 = require("../../../infrastructure/queue/message-queue.service");
const send_direct_message_dto_1 = require("../dto/send-direct-message.dto");
const send_group_message_dto_1 = require("../dto/send-group-message.dto");
const create_conversation_dto_1 = require("../dto/create-conversation.dto");
const update_conversation_dto_1 = require("../dto/update-conversation.dto");
const models_1 = require("../../../database/models");
const edit_message_dto_1 = require("../dto/edit-message.dto");
const message_pagination_dto_1 = require("../dto/message-pagination.dto");
const search_messages_dto_1 = require("../dto/search-messages.dto");
const mark_as_read_dto_1 = require("../dto/mark-as-read.dto");
const conversation_participant_dto_1 = require("../dto/conversation-participant.dto");
const base_1 = require("../../../common/base");
let EnhancedMessageController = class EnhancedMessageController extends base_1.BaseController {
    messageService;
    conversationService;
    queueService;
    constructor(messageService, conversationService, queueService) {
        super();
        this.messageService = messageService;
        this.conversationService = conversationService;
        this.queueService = queueService;
    }
    async sendDirectMessage(dto, req) {
        const senderId = req.user?.id;
        const tenantId = req.user?.tenantId;
        return this.messageService.sendDirectMessage(dto, senderId, tenantId);
    }
    async sendGroupMessage(dto, req) {
        const senderId = req.user?.id;
        const tenantId = req.user?.tenantId;
        return this.messageService.sendGroupMessage(dto, senderId, tenantId);
    }
    async editMessage(id, dto, req) {
        const userId = req.user?.id;
        return this.messageService.editMessage(id, dto, userId);
    }
    async deleteMessage(id, req) {
        const userId = req.user?.id;
        await this.messageService.deleteMessage(id, userId);
    }
    async markMessagesAsRead(dto, req) {
        const userId = req.user?.id;
        return this.messageService.markMessagesAsRead(dto, userId);
    }
    async markConversationAsRead(dto, req) {
        const userId = req.user?.id;
        return this.messageService.markConversationAsRead(dto, userId);
    }
    async getMessageHistory(dto, req) {
        const userId = req.user?.id;
        const tenantId = req.user?.tenantId;
        return this.messageService.getMessageHistory(dto, userId, tenantId);
    }
    async searchMessages(dto, req) {
        const userId = req.user?.id;
        const tenantId = req.user?.tenantId;
        return this.messageService.searchMessages(dto, userId, tenantId);
    }
    async getUnreadCount(conversationId, req) {
        const userId = req.user?.id;
        return this.messageService.getUnreadCount(userId, conversationId);
    }
    async uploadAttachments(files, req) {
        const urls = files.map((file) => `https://storage.example.com/files/${file.originalname}`);
        return { urls };
    }
    async createConversation(dto, req) {
        const creatorId = req.user?.id;
        const tenantId = req.user?.tenantId;
        return this.conversationService.createConversation(dto, creatorId, tenantId);
    }
    async listConversations(includeArchived, type, page, limit, req) {
        const userId = req.user?.id;
        const tenantId = req.user?.tenantId;
        return this.conversationService.listConversations(userId, tenantId, {
            includeArchived,
            type,
            page,
            limit,
        });
    }
    async getConversation(id, req) {
        const userId = req.user?.id;
        const tenantId = req.user?.tenantId;
        return this.conversationService.getConversation(id, userId, tenantId);
    }
    async updateConversation(id, dto, req) {
        const userId = req.user?.id;
        const tenantId = req.user?.tenantId;
        return this.conversationService.updateConversation(id, dto, userId, tenantId);
    }
    async deleteConversation(id, req) {
        const userId = req.user?.id;
        const tenantId = req.user?.tenantId;
        await this.conversationService.deleteConversation(id, userId, tenantId);
    }
    async addParticipant(id, dto, req) {
        const requesterId = req.user?.id;
        const tenantId = req.user?.tenantId;
        return this.conversationService.addParticipant(id, dto, requesterId, tenantId);
    }
    async removeParticipant(id, userId, req) {
        const requesterId = req.user?.id;
        const tenantId = req.user?.tenantId;
        await this.conversationService.removeParticipant(id, userId, requesterId, tenantId);
    }
    async getParticipants(id, req) {
        const userId = req.user?.id;
        return this.conversationService.getParticipants(id, userId);
    }
    async updateParticipantSettings(id, dto, req) {
        const userId = req.user?.id;
        return this.conversationService.updateParticipantSettings(id, dto, userId);
    }
    async getQueueMetrics() {
        return this.queueService.getQueueMetrics();
    }
    async getQueueHealth(queueName) {
        return this.queueService.getQueueHealth(queueName);
    }
    async getFailedJobs(queueName, limit) {
        const maxJobs = limit || 50;
        return this.queueService.getFailedJobs(queueName, maxJobs);
    }
    async retryFailedJob(queueName, jobId) {
        await this.queueService.retryFailedJob(queueName, jobId);
        return {
            success: true,
            message: `Job ${jobId} queued for retry in ${queueName}`,
        };
    }
};
exports.EnhancedMessageController = EnhancedMessageController;
__decorate([
    (0, common_1.Post)('direct'),
    (0, swagger_1.ApiOperation)({
        summary: 'Send a direct message',
        description: "Send a 1-to-1 direct message. Automatically creates a conversation if one doesn't exist.",
    }),
    (0, swagger_1.ApiBody)({ type: send_direct_message_dto_1.SendDirectMessageDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Direct message sent successfully',
        schema: {
            example: {
                message: {
                    id: '123e4567-e89b-12d3-a456-426614174000',
                    conversationId: '456e7890-e89b-12d3-a456-426614174000',
                    content: 'Hello, how are you?',
                    senderId: '789e0123-e89b-12d3-a456-426614174000',
                    createdAt: '2025-10-29T12:00:00Z',
                },
                conversation: {
                    id: '456e7890-e89b-12d3-a456-426614174000',
                    type: 'DIRECT',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Recipient not found' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_direct_message_dto_1.SendDirectMessageDto, Object]),
    __metadata("design:returntype", Promise)
], EnhancedMessageController.prototype, "sendDirectMessage", null);
__decorate([
    (0, common_1.Post)('group'),
    (0, swagger_1.ApiOperation)({
        summary: 'Send a group message',
        description: 'Send a message to an existing group conversation.',
    }),
    (0, swagger_1.ApiBody)({ type: send_group_message_dto_1.SendGroupMessageDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Group message sent successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Not a participant in the conversation',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Conversation not found' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_group_message_dto_1.SendGroupMessageDto, Object]),
    __metadata("design:returntype", Promise)
], EnhancedMessageController.prototype, "sendGroupMessage", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Edit a message',
        description: 'Edit message content. Only the sender can edit their messages.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Message ID (UUID)' }),
    (0, swagger_1.ApiBody)({ type: edit_message_dto_1.EditMessageDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Message updated successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Not authorized to edit this message',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Message not found' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, edit_message_dto_1.EditMessageDto, Object]),
    __metadata("design:returntype", Promise)
], EnhancedMessageController.prototype, "editMessage", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete a message',
        description: 'Soft delete a message. Only the sender can delete their messages.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Message ID (UUID)' }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'Message deleted successfully',
    }),
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
], EnhancedMessageController.prototype, "deleteMessage", null);
__decorate([
    (0, common_1.Post)('read'),
    (0, swagger_1.ApiOperation)({
        summary: 'Mark messages as read',
        description: 'Mark one or more messages as read for the current user.',
    }),
    (0, swagger_1.ApiBody)({ type: mark_as_read_dto_1.MarkAsReadDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Messages marked as read',
        schema: {
            example: {
                markedAsRead: 5,
                total: 5,
            },
        },
    }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mark_as_read_dto_1.MarkAsReadDto, Object]),
    __metadata("design:returntype", Promise)
], EnhancedMessageController.prototype, "markMessagesAsRead", null);
__decorate([
    (0, common_1.Post)('read/conversation'),
    (0, swagger_1.ApiOperation)({
        summary: 'Mark all messages in a conversation as read',
        description: 'Mark all unread messages in a conversation as read.',
    }),
    (0, swagger_1.ApiBody)({ type: mark_as_read_dto_1.MarkConversationAsReadDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Conversation marked as read',
    }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mark_as_read_dto_1.MarkConversationAsReadDto, Object]),
    __metadata("design:returntype", Promise)
], EnhancedMessageController.prototype, "markConversationAsRead", null);
__decorate([
    (0, common_1.Get)('history'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get message history',
        description: 'Get paginated message history with filtering options.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Message history retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [message_pagination_dto_1.MessagePaginationDto, Object]),
    __metadata("design:returntype", Promise)
], EnhancedMessageController.prototype, "getMessageHistory", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiOperation)({
        summary: 'Search messages',
        description: 'Search messages with full-text search and filters.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Search results retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_messages_dto_1.SearchMessagesDto, Object]),
    __metadata("design:returntype", Promise)
], EnhancedMessageController.prototype, "searchMessages", null);
__decorate([
    (0, common_1.Get)('unread/count'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get unread message count',
        description: 'Get total unread message count and breakdown by conversation.',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'conversationId',
        required: false,
        description: 'Filter by conversation',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Unread count retrieved successfully',
        schema: {
            example: {
                total: 15,
                byConversation: {
                    'conversation-id-1': 5,
                    'conversation-id-2': 10,
                },
            },
        },
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)('conversationId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EnhancedMessageController.prototype, "getUnreadCount", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 10)),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({
        summary: 'Upload message attachments',
        description: 'Upload files for message attachments (max 10 files).',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Files uploaded successfully',
        schema: {
            example: {
                urls: [
                    'https://storage.example.com/files/abc123.pdf',
                    'https://storage.example.com/files/def456.jpg',
                ],
            },
        },
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], EnhancedMessageController.prototype, "uploadAttachments", null);
__decorate([
    (0, common_1.Post)('conversations'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new conversation',
        description: 'Create a new conversation (DIRECT, GROUP, or CHANNEL).',
    }),
    (0, swagger_1.ApiBody)({ type: create_conversation_dto_1.CreateConversationDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Conversation created successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid conversation data' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_conversation_dto_1.CreateConversationDto, Object]),
    __metadata("design:returntype", Promise)
], EnhancedMessageController.prototype, "createConversation", null);
__decorate([
    (0, common_1.Get)('conversations'),
    (0, swagger_1.ApiOperation)({
        summary: 'List conversations',
        description: 'Get list of conversations for the current user.',
    }),
    (0, swagger_1.ApiQuery)({ name: 'includeArchived', required: false, type: Boolean }),
    (0, swagger_1.ApiQuery)({
        name: 'type',
        required: false,
        enum: ['DIRECT', 'GROUP', 'CHANNEL'],
    }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 20 }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Conversations retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)('includeArchived')),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean, String, Number, Number, Object]),
    __metadata("design:returntype", Promise)
], EnhancedMessageController.prototype, "listConversations", null);
__decorate([
    (0, common_1.Get)('conversations/:id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get conversation details',
        description: 'Get detailed information about a specific conversation.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Conversation ID (UUID)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Conversation retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Not a participant in the conversation',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Conversation not found' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EnhancedMessageController.prototype, "getConversation", null);
__decorate([
    (0, common_1.Put)('conversations/:id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update conversation',
        description: 'Update conversation metadata. Requires OWNER or ADMIN role.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Conversation ID (UUID)' }),
    (0, swagger_1.ApiBody)({ type: update_conversation_dto_1.UpdateConversationDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Conversation updated successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Not authorized to update conversation',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Conversation not found' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_conversation_dto_1.UpdateConversationDto, Object]),
    __metadata("design:returntype", Promise)
], EnhancedMessageController.prototype, "updateConversation", null);
__decorate([
    (0, common_1.Delete)('conversations/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete conversation',
        description: 'Delete a conversation. Requires OWNER role.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Conversation ID (UUID)' }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'Conversation deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Only owner can delete conversation',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Conversation not found' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EnhancedMessageController.prototype, "deleteConversation", null);
__decorate([
    (0, common_1.Post)('conversations/:id/participants'),
    (0, swagger_1.ApiOperation)({
        summary: 'Add participant to conversation',
        description: 'Add a new participant to the conversation. Requires OWNER or ADMIN role.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Conversation ID (UUID)' }),
    (0, swagger_1.ApiBody)({ type: conversation_participant_dto_1.AddParticipantDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Participant added successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Not authorized to add participants',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Conversation not found' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, conversation_participant_dto_1.AddParticipantDto, Object]),
    __metadata("design:returntype", Promise)
], EnhancedMessageController.prototype, "addParticipant", null);
__decorate([
    (0, common_1.Delete)('conversations/:id/participants/:userId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({
        summary: 'Remove participant from conversation',
        description: 'Remove a participant. OWNER/ADMIN can remove others, users can remove themselves.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Conversation ID (UUID)' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User ID to remove (UUID)' }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'Participant removed successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Not authorized to remove participant',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Conversation or participant not found',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('userId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], EnhancedMessageController.prototype, "removeParticipant", null);
__decorate([
    (0, common_1.Get)('conversations/:id/participants'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get conversation participants',
        description: 'Get list of all participants in the conversation.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Conversation ID (UUID)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Participants retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Not a participant in the conversation',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EnhancedMessageController.prototype, "getParticipants", null);
__decorate([
    (0, common_1.Put)('conversations/:id/settings'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update participant settings',
        description: 'Update settings for current user in the conversation (mute, pin, etc.).',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Conversation ID (UUID)' }),
    (0, swagger_1.ApiBody)({ type: conversation_participant_dto_1.UpdateParticipantDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Settings updated successfully',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, conversation_participant_dto_1.UpdateParticipantDto, Object]),
    __metadata("design:returntype", Promise)
], EnhancedMessageController.prototype, "updateParticipantSettings", null);
__decorate([
    (0, common_1.Get)('queue/metrics'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get queue metrics',
        description: 'Retrieve metrics for all message queues (waiting, active, completed, failed).',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Queue metrics retrieved successfully',
        schema: {
            example: {
                'message-delivery': {
                    waiting: 5,
                    active: 2,
                    completed: 1523,
                    failed: 3,
                },
                'message-notification': {
                    waiting: 10,
                    active: 5,
                    completed: 2051,
                    failed: 1,
                },
            },
        },
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EnhancedMessageController.prototype, "getQueueMetrics", null);
__decorate([
    (0, common_1.Get)('queue/:queueName/health'),
    (0, swagger_1.ApiOperation)({
        summary: 'Check queue health',
        description: 'Get health status for a specific queue.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'queueName',
        description: 'Queue name (e.g., message-delivery, message-notification)',
        enum: [
            'message-delivery',
            'message-notification',
            'message-encryption',
            'message-indexing',
            'batch-message-sending',
            'message-cleanup',
        ],
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Queue health status',
        schema: {
            example: {
                status: 'healthy',
                failureRate: 0.02,
                checks: {
                    hasJobs: true,
                    isProcessing: true,
                    failureRate: 'normal',
                },
            },
        },
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('queueName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EnhancedMessageController.prototype, "getQueueHealth", null);
__decorate([
    (0, common_1.Get)('queue/:queueName/failed'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get failed jobs',
        description: 'Retrieve list of failed jobs from a specific queue for debugging.',
    }),
    (0, swagger_1.ApiParam)({ name: 'queueName', description: 'Queue name' }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        description: 'Maximum number of failed jobs to return (default: 50)',
        type: Number,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of failed jobs',
        schema: {
            example: [
                {
                    id: 'job-123',
                    data: { messageId: 'msg-456' },
                    failedReason: 'Recipient not found',
                    attemptsMade: 5,
                    timestamp: '2025-10-29T12:00:00Z',
                },
            ],
        },
    }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Param)('queueName')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], EnhancedMessageController.prototype, "getFailedJobs", null);
__decorate([
    (0, common_1.Post)('queue/:queueName/failed/:jobId/retry'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Retry a failed job',
        description: 'Manually retry a specific failed job.',
    }),
    (0, swagger_1.ApiParam)({ name: 'queueName', description: 'Queue name' }),
    (0, swagger_1.ApiParam)({ name: 'jobId', description: 'Job ID to retry' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Job queued for retry',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK }),
    __param(0, (0, common_1.Param)('queueName')),
    __param(1, (0, common_1.Param)('jobId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EnhancedMessageController.prototype, "retryFailedJob", null);
exports.EnhancedMessageController = EnhancedMessageController = __decorate([
    (0, swagger_1.ApiTags)('Enhanced Messaging'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('enhanced-messages'),
    __metadata("design:paramtypes", [enhanced_message_service_1.EnhancedMessageService,
        conversation_service_1.ConversationService,
        message_queue_service_1.MessageQueueService])
], EnhancedMessageController);
//# sourceMappingURL=enhanced-message.controller.js.map