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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunicationService = void 0;
const common_1 = require("@nestjs/common");
const message_service_1 = require("./message.service");
const template_service_1 = require("./template.service");
const broadcast_service_1 = require("./broadcast.service");
const base_1 = require("../../../common/base");
let CommunicationService = class CommunicationService extends base_1.BaseService {
    messageService;
    templateService;
    broadcastService;
    constructor(messageService, templateService, broadcastService) {
        super('CommunicationService');
        this.messageService = messageService;
        this.templateService = templateService;
        this.broadcastService = broadcastService;
    }
    async createMessageTemplate(dto) {
        this.logInfo(`Creating message template: ${dto.name}`);
        const template = await this.templateService.createTemplate(dto);
        this.logInfo(`Template created successfully: ${dto.name}`);
        return {
            id: template.template.id,
            name: template.template.name,
            createdAt: template.template.createdAt,
        };
    }
    async sendMessage(dto) {
        this.logInfo(`Sending message to ${dto.recipients.length} recipients`);
        let subject = dto.subject;
        let content = dto.content;
        if (dto.templateId) {
            this.logInfo(`Rendering template: ${dto.templateId}`);
            const rendered = await this.templateService.renderTemplate(dto.templateId, dto.templateVariables || {});
            subject = rendered.subject;
            content = rendered.content;
            this.logInfo(`Template rendered: ${rendered.renderedVariables.join(', ')}`);
        }
        const result = await this.messageService.sendMessage({
            ...dto,
            subject,
            content,
        });
        this.logInfo(`Message sent successfully. Message ID: ${result.message.id}`);
        return result;
    }
    async sendBroadcastMessage(dto) {
        this.logInfo(`Sending broadcast message: ${dto.subject}`);
        let subject = dto.subject;
        let content = dto.content;
        if (dto.templateId) {
            this.logInfo(`Rendering broadcast template: ${dto.templateId}`);
            const rendered = await this.templateService.renderTemplate(dto.templateId, dto.templateVariables || {});
            subject = rendered.subject;
            content = rendered.content;
        }
        const recipients = this.buildRecipientList(dto);
        const result = await this.broadcastService.createBroadcast({
            subject,
            content,
            priority: dto.priority || 'MEDIUM',
            category: dto.category || 'GENERAL',
            channels: dto.channels || ['EMAIL'],
            scheduledAt: dto.scheduledAt,
            senderId: dto.senderId,
            audience: dto.audience,
            recipients,
        });
        this.logInfo(`Broadcast message created. ID: ${result.message.id}`);
        return {
            message: result.message,
            deliveryStatuses: result.deliveryStatuses,
        };
    }
    async sendEmergencyAlert(dto) {
        this.logInfo(`Sending EMERGENCY alert: ${dto.subject}`);
        const channels = dto.channels || ['EMAIL', 'SMS', 'PUSH'];
        const recipients = this.buildEmergencyRecipientList(dto);
        this.logInfo(`Emergency alert will be sent to ${recipients.length} recipients via ${channels.join(', ')}`);
        const result = await this.broadcastService.createBroadcast({
            subject: `[EMERGENCY] ${dto.subject}`,
            content: dto.content,
            priority: 'HIGH',
            category: 'EMERGENCY',
            channels,
            senderId: dto.senderId,
            audience: dto.scope,
            recipients,
        });
        this.logInfo(`Emergency alert sent. Message ID: ${result.message.id}`);
        return {
            message: result.message,
            deliveryStatuses: result.deliveryStatuses,
        };
    }
    async sendNotification(params) {
        this.logInfo(`Sending ${params.channel} notification to ${params.recipientId}`);
        const result = await this.messageService.sendMessage({
            recipients: [
                {
                    type: params.recipientType,
                    id: params.recipientId,
                    email: undefined,
                },
            ],
            channels: [params.channel],
            subject: params.subject,
            content: params.content,
            priority: params.priority || 'MEDIUM',
            category: 'NOTIFICATION',
            senderId: 'system',
        });
        return {
            success: true,
            messageId: result.message.id,
        };
    }
    buildRecipientList(dto) {
        const recipients = [];
        if (dto.audience) {
            this.logInfo(`Building recipient list for audience: ${dto.audience}`);
            this.logWarning('Recipient list building not fully implemented - integrate with user service');
        }
        return recipients;
    }
    buildEmergencyRecipientList(dto) {
        const recipients = [];
        this.logInfo(`Building emergency recipient list for scope: ${dto.scope}`);
        this.logWarning('Emergency recipient list building not fully implemented - integrate with user service');
        return recipients;
    }
    async getDeliveryStatistics(messageId) {
        const status = await this.messageService.getMessageDeliveryStatus(messageId);
        return {
            total: status.summary.total,
            sent: status.summary.sent,
            delivered: status.summary.delivered,
            failed: status.summary.failed,
            pending: status.summary.pending,
        };
    }
    async retryFailedDeliveries(messageId) {
        this.logInfo(`Retrying failed deliveries for message ${messageId}`);
        const status = await this.messageService.getMessageDeliveryStatus(messageId);
        const failedDeliveries = status.deliveries.filter((d) => d.status === 'FAILED' || d.status === 'BOUNCED');
        if (failedDeliveries.length === 0) {
            this.logInfo('No failed deliveries to retry');
            return { retriedCount: 0, newDeliveryStatuses: [] };
        }
        this.logInfo(`Retrying ${failedDeliveries.length} failed deliveries`);
        return {
            retriedCount: failedDeliveries.length,
            newDeliveryStatuses: [],
        };
    }
};
exports.CommunicationService = CommunicationService;
exports.CommunicationService = CommunicationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [message_service_1.MessageService,
        template_service_1.TemplateService,
        broadcast_service_1.BroadcastService])
], CommunicationService);
//# sourceMappingURL=communication.service.js.map