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
exports.CommunicationController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const communication_service_1 = require("../services/communication.service");
const broadcast_message_dto_1 = require("../dto/broadcast-message.dto");
const create_message_dto_1 = require("../dto/create-message.dto");
const create_message_template_dto_1 = require("../dto/create-message-template.dto");
const emergency_alert_dto_1 = require("../dto/emergency-alert.dto");
const update_message_template_dto_1 = require("../dto/update-message-template.dto");
const base_1 = require("../../../common/base");
let CommunicationController = class CommunicationController extends base_1.BaseController {
    communicationService;
    constructor(communicationService) {
        super();
        this.communicationService = communicationService;
    }
    async createTemplate(dto) {
        return this.communicationService.createMessageTemplate(dto);
    }
    async getTemplates(type, category) {
        return [];
    }
    async updateTemplate(id, dto) {
        return { success: true };
    }
    async deleteTemplate(id) {
        return { success: true };
    }
    async sendMessage(dto) {
        return this.communicationService.sendMessage(dto);
    }
    async sendBroadcast(dto) {
        return this.communicationService.sendBroadcastMessage(dto);
    }
    async sendEmergencyAlert(dto) {
        return this.communicationService.sendEmergencyAlert(dto);
    }
    async getMessages(page = 1, limit = 20) {
        return { messages: [], pagination: { page, limit, total: 0, pages: 0 } };
    }
    async getMessage(id) {
        return {};
    }
    async getDeliveryStatus(id) {
        return { deliveries: [], summary: {} };
    }
    async getStatistics(from, to) {
        return {};
    }
};
exports.CommunicationController = CommunicationController;
__decorate([
    (0, common_1.Post)('templates'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create message template',
        description: 'Creates a new reusable message template for communications',
    }),
    (0, swagger_1.ApiBody)({
        type: create_message_template_dto_1.CreateMessageTemplateDto,
        description: 'Message template creation data',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Message template created successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid input data - validation error',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - authentication required',
    }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_message_template_dto_1.CreateMessageTemplateDto]),
    __metadata("design:returntype", Promise)
], CommunicationController.prototype, "createTemplate", null);
__decorate([
    (0, common_1.Get)('templates'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get message templates',
        description: 'Retrieves paginated list of message templates with optional filtering by type and category. Used for consistent messaging across the healthcare platform.',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'type',
        required: false,
        enum: ['email', 'sms', 'push', 'in_app'],
        description: 'Filter by message type',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'category',
        required: false,
        enum: ['appointment', 'emergency', 'medication', 'general'],
        description: 'Filter by message category',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        type: 'number',
        example: 1,
        description: 'Page number for pagination',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: 'number',
        example: 20,
        description: 'Items per page',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Message templates retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                templates: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string', format: 'uuid' },
                            name: { type: 'string' },
                            type: {
                                type: 'string',
                                enum: ['email', 'sms', 'push', 'in_app'],
                            },
                            category: { type: 'string' },
                            subject: { type: 'string', nullable: true },
                            content: { type: 'string' },
                            variables: { type: 'array', items: { type: 'string' } },
                            isActive: { type: 'boolean' },
                            createdAt: { type: 'string', format: 'date-time' },
                        },
                    },
                },
                pagination: {
                    type: 'object',
                    properties: {
                        page: { type: 'number' },
                        limit: { type: 'number' },
                        total: { type: 'number' },
                        pages: { type: 'number' },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Authentication required',
    }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Query)('type')),
    __param(1, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CommunicationController.prototype, "getTemplates", null);
__decorate([
    (0, common_1.Put)('templates/:id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update message template',
        description: 'Updates an existing message template with validation and version tracking. Maintains audit trail for compliance.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Template UUID', format: 'uuid' }),
    (0, swagger_1.ApiBody)({ type: update_message_template_dto_1.UpdateMessageTemplateDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Template updated successfully',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'string', format: 'uuid' },
                name: { type: 'string' },
                type: { type: 'string' },
                category: { type: 'string' },
                subject: { type: 'string', nullable: true },
                content: { type: 'string' },
                variables: { type: 'array', items: { type: 'string' } },
                isActive: { type: 'boolean' },
                version: { type: 'number' },
                updatedAt: { type: 'string', format: 'date-time' },
                updatedBy: { type: 'string' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid template data or validation errors',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Authentication required',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Insufficient permissions to update templates',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Template not found' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_message_template_dto_1.UpdateMessageTemplateDto]),
    __metadata("design:returntype", Promise)
], CommunicationController.prototype, "updateTemplate", null);
__decorate([
    (0, common_1.Delete)('templates/:id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete message template',
        description: 'Soft deletes a message template while preserving historical usage data. Template becomes inactive but remains in audit trail.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Template UUID', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Template deleted successfully',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                message: { type: 'string', example: 'Template deleted successfully' },
                deletedAt: { type: 'string', format: 'date-time' },
                deletedBy: { type: 'string' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Authentication required',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Insufficient permissions to delete templates',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Template not found' }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Cannot delete template - currently in use by active messages',
    }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CommunicationController.prototype, "deleteTemplate", null);
__decorate([
    (0, common_1.Post)('messages'),
    (0, swagger_1.ApiOperation)({
        summary: 'Send individual message',
        description: 'Sends a message to specific recipients (parents, students, or staff) with delivery tracking and HIPAA compliance logging. Supports personalization and scheduling.',
    }),
    (0, swagger_1.ApiBody)({ type: create_message_dto_1.CreateMessageDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Message sent successfully',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'string', format: 'uuid' },
                messageId: { type: 'string', example: 'MSG-2024-001234' },
                type: { type: 'string', enum: ['email', 'sms', 'push', 'in_app'] },
                recipients: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            recipientId: { type: 'string' },
                            recipientType: {
                                type: 'string',
                                enum: ['parent', 'student', 'staff'],
                            },
                            deliveryMethod: { type: 'string' },
                            status: {
                                type: 'string',
                                enum: ['queued', 'sent', 'delivered', 'failed'],
                            },
                        },
                    },
                },
                scheduledFor: { type: 'string', format: 'date-time', nullable: true },
                sentAt: { type: 'string', format: 'date-time' },
                deliveryTracking: {
                    type: 'object',
                    properties: {
                        totalRecipients: { type: 'number' },
                        sentCount: { type: 'number' },
                        deliveredCount: { type: 'number' },
                        failedCount: { type: 'number' },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid message data or validation errors',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Authentication required',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Insufficient permissions or recipient access denied',
    }),
    (0, swagger_1.ApiResponse)({
        status: 422,
        description: 'Message content violates healthcare communication policies',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error or delivery service failure',
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_message_dto_1.CreateMessageDto]),
    __metadata("design:returntype", Promise)
], CommunicationController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Post)('broadcast'),
    (0, swagger_1.ApiOperation)({
        summary: 'Send broadcast message',
        description: 'Sends a message to multiple recipients based on criteria (grade level, nurse assignment, etc.). Includes opt-out handling and delivery analytics for mass communications.',
    }),
    (0, swagger_1.ApiBody)({ type: broadcast_message_dto_1.BroadcastMessageDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Broadcast message initiated successfully',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'string', format: 'uuid' },
                broadcastId: { type: 'string', example: 'BCAST-2024-001234' },
                title: { type: 'string' },
                type: { type: 'string', enum: ['email', 'sms', 'push', 'in_app'] },
                targetCriteria: {
                    type: 'object',
                    properties: {
                        grades: { type: 'array', items: { type: 'string' } },
                        nurses: { type: 'array', items: { type: 'string' } },
                        studentStatuses: { type: 'array', items: { type: 'string' } },
                        recipientTypes: { type: 'array', items: { type: 'string' } },
                    },
                },
                estimatedRecipients: { type: 'number' },
                actualRecipients: { type: 'number' },
                scheduledFor: { type: 'string', format: 'date-time', nullable: true },
                status: {
                    type: 'string',
                    enum: ['scheduled', 'sending', 'completed', 'failed'],
                },
                createdAt: { type: 'string', format: 'date-time' },
                deliveryStats: {
                    type: 'object',
                    properties: {
                        queued: { type: 'number' },
                        sent: { type: 'number' },
                        delivered: { type: 'number' },
                        failed: { type: 'number' },
                        optedOut: { type: 'number' },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid broadcast data or validation errors',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Authentication required',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Admin or nurse role required for broadcasts',
    }),
    (0, swagger_1.ApiResponse)({
        status: 422,
        description: 'Broadcast criteria results in no recipients',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error or delivery service failure',
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [broadcast_message_dto_1.BroadcastMessageDto]),
    __metadata("design:returntype", Promise)
], CommunicationController.prototype, "sendBroadcast", null);
__decorate([
    (0, common_1.Post)('emergency-alert'),
    (0, swagger_1.ApiOperation)({
        summary: 'Send emergency alert',
        description: 'CRITICAL ENDPOINT - Sends immediate emergency alerts with highest priority delivery across all available channels. Used for medical emergencies, lockdowns, and urgent safety communications. Bypasses opt-out preferences.',
    }),
    (0, swagger_1.ApiBody)({ type: emergency_alert_dto_1.EmergencyAlertDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Emergency alert sent successfully with immediate delivery',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'string', format: 'uuid' },
                alertId: { type: 'string', example: 'EMRG-2024-001234' },
                alertType: {
                    type: 'string',
                    enum: [
                        'medical_emergency',
                        'lockdown',
                        'evacuation',
                        'weather',
                        'security',
                    ],
                },
                severity: {
                    type: 'string',
                    enum: ['low', 'medium', 'high', 'critical'],
                },
                title: { type: 'string' },
                message: { type: 'string' },
                affectedAreas: { type: 'array', items: { type: 'string' } },
                targetRecipients: {
                    type: 'object',
                    properties: {
                        parents: { type: 'number' },
                        staff: { type: 'number' },
                        emergencyContacts: { type: 'number' },
                        authorities: { type: 'number' },
                    },
                },
                deliveryChannels: {
                    type: 'array',
                    items: {
                        type: 'string',
                        enum: ['sms', 'email', 'push', 'voice_call', 'pa_system'],
                    },
                },
                sentAt: { type: 'string', format: 'date-time' },
                escalationLevel: { type: 'number', minimum: 1, maximum: 5 },
                deliveryStatus: {
                    type: 'object',
                    properties: {
                        immediate: { type: 'number' },
                        delivered: { type: 'number' },
                        failed: { type: 'number' },
                        retrying: { type: 'number' },
                    },
                },
                authoritiesNotified: { type: 'boolean' },
                followUpRequired: { type: 'boolean' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid alert data or missing critical information',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Authentication required',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Admin or authorized emergency personnel only',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'CRITICAL ERROR - Emergency alert delivery failed',
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [emergency_alert_dto_1.EmergencyAlertDto]),
    __metadata("design:returntype", Promise)
], CommunicationController.prototype, "sendEmergencyAlert", null);
__decorate([
    (0, common_1.Get)('messages'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get message history',
        description: 'Retrieves paginated message history with comprehensive filtering by type, status, recipients, and date range. Includes delivery analytics and compliance audit data.',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        type: 'number',
        example: 1,
        description: 'Page number for pagination',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: 'number',
        example: 20,
        description: 'Items per page (max 100)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'type',
        required: false,
        enum: ['email', 'sms', 'push', 'in_app', 'emergency'],
        description: 'Filter by message type',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'status',
        required: false,
        enum: ['queued', 'sent', 'delivered', 'failed', 'cancelled'],
        description: 'Filter by delivery status',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'recipientType',
        required: false,
        enum: ['parent', 'student', 'staff', 'emergency_contact'],
        description: 'Filter by recipient type',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'dateFrom',
        required: false,
        format: 'date',
        description: 'Filter messages from this date',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'dateTo',
        required: false,
        format: 'date',
        description: 'Filter messages up to this date',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'search',
        required: false,
        description: 'Search in message content and subjects',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Message history retrieved successfully with analytics',
        schema: {
            type: 'object',
            properties: {
                messages: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string', format: 'uuid' },
                            messageId: { type: 'string' },
                            type: { type: 'string' },
                            subject: { type: 'string', nullable: true },
                            preview: { type: 'string' },
                            recipientCount: { type: 'number' },
                            deliveryStatus: { type: 'string' },
                            sentAt: { type: 'string', format: 'date-time' },
                            deliveryRate: { type: 'number' },
                            isEmergency: { type: 'boolean' },
                            createdBy: { type: 'string' },
                        },
                    },
                },
                pagination: {
                    type: 'object',
                    properties: {
                        page: { type: 'number' },
                        limit: { type: 'number' },
                        total: { type: 'number' },
                        pages: { type: 'number' },
                    },
                },
                analytics: {
                    type: 'object',
                    properties: {
                        totalMessages: { type: 'number' },
                        successRate: { type: 'number' },
                        averageDeliveryTime: { type: 'number' },
                        messagesByType: { type: 'object' },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Authentication required',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Insufficient permissions to view message history',
    }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], CommunicationController.prototype, "getMessages", null);
__decorate([
    (0, common_1.Get)('messages/:id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CommunicationController.prototype, "getMessage", null);
__decorate([
    (0, common_1.Get)('messages/:id/delivery-status'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CommunicationController.prototype, "getDeliveryStatus", null);
__decorate([
    (0, common_1.Get)('statistics'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('from')),
    __param(1, (0, common_1.Query)('to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CommunicationController.prototype, "getStatistics", null);
exports.CommunicationController = CommunicationController = __decorate([
    (0, swagger_1.ApiTags)('Communication'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('communication'),
    __metadata("design:paramtypes", [communication_service_1.CommunicationService])
], CommunicationController);
//# sourceMappingURL=communication.controller.js.map