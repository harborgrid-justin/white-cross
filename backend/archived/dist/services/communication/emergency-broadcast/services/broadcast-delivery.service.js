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
exports.BroadcastDeliveryService = void 0;
const common_1 = require("@nestjs/common");
const emergency_broadcast_enums_1 = require("../emergency-broadcast.enums");
const communication_service_1 = require("../../services/communication.service");
const base_1 = require("../../../../common/base");
let BroadcastDeliveryService = class BroadcastDeliveryService extends base_1.BaseService {
    communicationService;
    constructor(communicationService) {
        super('BroadcastDeliveryService');
        this.communicationService = communicationService;
    }
    async deliverToRecipients(broadcastId, recipients, channels, messageTitle, messageContent) {
        const deliveryStatuses = [];
        this.logInfo(`Delivering to ${recipients.length} recipients via channels: ${channels.join(', ')}`);
        for (const recipient of recipients) {
            for (const channel of channels) {
                const deliveryResult = await this.deliverToChannel(broadcastId, recipient, channel, messageTitle, messageContent);
                deliveryStatuses.push(deliveryResult);
            }
        }
        return deliveryStatuses;
    }
    async deliverToChannel(broadcastId, recipient, channel, title, content) {
        const maxRetries = 3;
        const baseDelay = 1000;
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                this.logDebug(`Delivery attempt ${attempt}/${maxRetries}`, {
                    broadcastId,
                    recipientId: recipient.id,
                    channel,
                });
                const formattedMessage = this.formatMessageForChannel(channel, title, content);
                await this.sendViaChannel(channel, recipient, formattedMessage);
                this.logDebug('Message delivered successfully', {
                    broadcastId,
                    recipientId: recipient.id,
                    channel,
                    attempt,
                });
                return {
                    recipientId: recipient.id,
                    recipientType: recipient.type,
                    name: recipient.name,
                    contactMethod: channel,
                    phoneNumber: recipient.phone,
                    email: recipient.email,
                    status: emergency_broadcast_enums_1.DeliveryStatus.DELIVERED,
                    deliveredAt: new Date(),
                    attemptCount: attempt,
                };
            }
            catch (error) {
                this.logWarning(`Delivery attempt ${attempt} failed`, {
                    broadcastId,
                    recipientId: recipient.id,
                    channel,
                    error: error.message,
                });
                if (attempt < maxRetries) {
                    const delay = baseDelay * Math.pow(2, attempt - 1);
                    await this.sleep(delay);
                }
                else {
                    this.logError('All delivery attempts failed', {
                        broadcastId,
                        recipientId: recipient.id,
                        channel,
                        attempts: maxRetries,
                    });
                    return {
                        recipientId: recipient.id,
                        recipientType: recipient.type,
                        name: recipient.name,
                        contactMethod: channel,
                        phoneNumber: recipient.phone,
                        email: recipient.email,
                        status: emergency_broadcast_enums_1.DeliveryStatus.FAILED,
                        error: `Failed after ${maxRetries} attempts: ${error.message}`,
                        attemptCount: maxRetries,
                    };
                }
            }
        }
        return {
            recipientId: recipient.id,
            recipientType: recipient.type,
            name: recipient.name,
            contactMethod: channel,
            status: emergency_broadcast_enums_1.DeliveryStatus.FAILED,
            error: 'Unknown error',
        };
    }
    formatMessageForChannel(channel, title, content) {
        switch (channel) {
            case emergency_broadcast_enums_1.CommunicationChannel.SMS: {
                const smsMessage = `${title}: ${content}`;
                return smsMessage.length > 160 ? smsMessage.substring(0, 157) + '...' : smsMessage;
            }
            case emergency_broadcast_enums_1.CommunicationChannel.EMAIL:
                return `
          <html>
            <body>
              <h2>${title}</h2>
              <p>${content}</p>
              <hr>
              <p><small>This is an emergency notification from White Cross School System.</small></p>
            </body>
          </html>
        `;
            case emergency_broadcast_enums_1.CommunicationChannel.PUSH:
                return JSON.stringify({
                    title,
                    body: content,
                    priority: 'high',
                    sound: 'emergency_alert',
                });
            case emergency_broadcast_enums_1.CommunicationChannel.VOICE:
                return `${title}. ${content}. I repeat. ${title}. ${content}.`;
            default:
                return `${title}: ${content}`;
        }
    }
    async sendViaChannel(channel, recipient, message) {
        const messageDto = {
            recipientId: recipient.id,
            recipientType: recipient.type,
            subject: 'Emergency Alert',
            content: message,
            priority: 'high',
            channel: this.mapChannelToServiceChannel(channel),
        };
        switch (channel) {
            case emergency_broadcast_enums_1.CommunicationChannel.SMS:
                if (!recipient.phone) {
                    throw new Error('Recipient has no phone number for SMS delivery');
                }
                messageDto.phoneNumber = recipient.phone;
                break;
            case emergency_broadcast_enums_1.CommunicationChannel.EMAIL:
                if (!recipient.email) {
                    throw new Error('Recipient has no email for email delivery');
                }
                messageDto.email = recipient.email;
                break;
            case emergency_broadcast_enums_1.CommunicationChannel.PUSH:
                messageDto.deviceTokens = [];
                break;
            case emergency_broadcast_enums_1.CommunicationChannel.VOICE:
                if (!recipient.phone) {
                    throw new Error('Recipient has no phone number for voice call');
                }
                messageDto.phoneNumber = recipient.phone;
                break;
        }
        const result = await this.communicationService.sendMessage(messageDto);
        return { success: true, messageId: result?.id || 'unknown' };
    }
    mapChannelToServiceChannel(channel) {
        const channelMap = {
            [emergency_broadcast_enums_1.CommunicationChannel.SMS]: 'sms',
            [emergency_broadcast_enums_1.CommunicationChannel.EMAIL]: 'email',
            [emergency_broadcast_enums_1.CommunicationChannel.PUSH]: 'push',
            [emergency_broadcast_enums_1.CommunicationChannel.VOICE]: 'voice',
        };
        return channelMap[channel] || 'email';
    }
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    validateRecipientForChannel(recipient, channel) {
        switch (channel) {
            case emergency_broadcast_enums_1.CommunicationChannel.SMS:
            case emergency_broadcast_enums_1.CommunicationChannel.VOICE:
                return {
                    isValid: !!recipient.phone,
                    reason: !recipient.phone ? 'Missing phone number' : undefined,
                };
            case emergency_broadcast_enums_1.CommunicationChannel.EMAIL:
                return {
                    isValid: !!recipient.email,
                    reason: !recipient.email ? 'Missing email address' : undefined,
                };
            case emergency_broadcast_enums_1.CommunicationChannel.PUSH:
                return { isValid: true };
            default:
                return { isValid: false, reason: 'Unknown channel' };
        }
    }
    getDeliveryStats(results) {
        const stats = {
            total: results.length,
            delivered: 0,
            failed: 0,
            pending: 0,
            byChannel: {},
        };
        for (const result of results) {
            const channelKey = result.contactMethod || 'unknown';
            if (!stats.byChannel[channelKey]) {
                stats.byChannel[channelKey] = { delivered: 0, failed: 0 };
            }
            switch (result.status) {
                case emergency_broadcast_enums_1.DeliveryStatus.DELIVERED:
                    stats.delivered++;
                    stats.byChannel[channelKey].delivered++;
                    break;
                case emergency_broadcast_enums_1.DeliveryStatus.FAILED:
                    stats.failed++;
                    stats.byChannel[channelKey].failed++;
                    break;
                case emergency_broadcast_enums_1.DeliveryStatus.QUEUED:
                    stats.pending++;
                    break;
            }
        }
        return stats;
    }
};
exports.BroadcastDeliveryService = BroadcastDeliveryService;
exports.BroadcastDeliveryService = BroadcastDeliveryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [communication_service_1.CommunicationService])
], BroadcastDeliveryService);
//# sourceMappingURL=broadcast-delivery.service.js.map