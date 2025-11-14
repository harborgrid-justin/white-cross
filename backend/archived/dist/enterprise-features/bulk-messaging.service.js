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
exports.BulkMessagingService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const base_1 = require("../common/base");
let BulkMessagingService = class BulkMessagingService extends base_1.BaseService {
    eventEmitter;
    bulkMessages = [];
    constructor(eventEmitter) {
        super('BulkMessagingService');
        this.eventEmitter = eventEmitter;
    }
    async sendBulkMessage(data) {
        try {
            this.validateBulkMessageData(data);
            const message = {
                ...data,
                id: `BM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                status: 'sending',
                deliveryStats: { sent: 0, delivered: 0, failed: 0, opened: 0 },
            };
            this.bulkMessages.push(message);
            this.eventEmitter.emit('bulk.message.sent', {
                messageId: message.id,
                recipientCount: data.recipients.length,
                channels: data.channels,
                timestamp: new Date(),
            });
            this.logInfo('Bulk message initiated', {
                messageId: message.id,
                recipientCount: data.recipients.length,
                channels: data.channels,
            });
            await this.processBulkMessage(message);
            return message;
        }
        catch (error) {
            this.logError('Error sending bulk message', {
                error: error instanceof Error ? error.message : String(error),
                recipientCount: data.recipients.length,
            });
            throw error;
        }
    }
    trackDelivery(messageId) {
        try {
            this.validateMessageId(messageId);
            const message = this.bulkMessages.find((m) => m.id === messageId);
            if (!message) {
                throw new Error(`Bulk message not found: ${messageId}`);
            }
            const deliveryStats = {
                ...message.deliveryStats,
                status: message.status,
            };
            this.logInfo('Delivery tracking retrieved', {
                messageId,
                status: message.status,
                sent: message.deliveryStats.sent,
                delivered: message.deliveryStats.delivered,
                failed: message.deliveryStats.failed,
                opened: message.deliveryStats.opened,
            });
            return deliveryStats;
        }
        catch (error) {
            this.logError('Error tracking delivery', {
                error: error instanceof Error ? error.message : String(error),
                messageId,
            });
            throw error;
        }
    }
    getBulkMessage(messageId) {
        try {
            this.validateMessageId(messageId);
            const message = this.bulkMessages.find((m) => m.id === messageId);
            if (!message) {
                this.logWarning('Bulk message not found', { messageId });
                return null;
            }
            this.logInfo('Bulk message retrieved', { messageId });
            return message;
        }
        catch (error) {
            this.logError('Error retrieving bulk message', {
                error: error instanceof Error ? error.message : String(error),
                messageId,
            });
            return null;
        }
    }
    getBulkMessages(status) {
        try {
            let messages = this.bulkMessages;
            if (status) {
                messages = messages.filter((m) => m.status === status);
            }
            this.logInfo('Bulk messages retrieved', {
                count: messages.length,
                status,
            });
            return messages;
        }
        catch (error) {
            this.logError('Error retrieving bulk messages', {
                error: error instanceof Error ? error.message : String(error),
                status,
            });
            return [];
        }
    }
    updateDeliveryStats(messageId, stats) {
        try {
            this.validateMessageId(messageId);
            const message = this.bulkMessages.find((m) => m.id === messageId);
            if (!message) {
                throw new Error(`Bulk message not found: ${messageId}`);
            }
            message.deliveryStats = {
                ...message.deliveryStats,
                ...stats,
            };
            if (message.deliveryStats.sent > 0) {
                if (message.deliveryStats.failed === message.deliveryStats.sent) {
                    message.status = 'failed';
                }
                else if (message.deliveryStats.delivered + message.deliveryStats.failed >=
                    message.deliveryStats.sent) {
                    message.status = 'completed';
                }
            }
            message.completedAt = message.status === 'completed' ? new Date() : undefined;
            this.eventEmitter.emit('bulk.message.delivery.updated', {
                messageId,
                stats: message.deliveryStats,
                status: message.status,
                timestamp: new Date(),
            });
            this.logInfo('Delivery stats updated', {
                messageId,
                status: message.status,
                sent: message.deliveryStats.sent,
                delivered: message.deliveryStats.delivered,
                failed: message.deliveryStats.failed,
            });
            return true;
        }
        catch (error) {
            this.logError('Error updating delivery stats', {
                error: error instanceof Error ? error.message : String(error),
                messageId,
            });
            return false;
        }
    }
    cancelBulkMessage(messageId, cancelledBy) {
        try {
            this.validateMessageId(messageId);
            const message = this.bulkMessages.find((m) => m.id === messageId);
            if (!message) {
                throw new Error(`Bulk message not found: ${messageId}`);
            }
            if (message.status !== 'sending') {
                throw new Error(`Cannot cancel message ${messageId} - status is ${message.status}`);
            }
            message.status = 'failed';
            message.errorMessage = 'Cancelled by user';
            this.eventEmitter.emit('bulk.message.cancelled', {
                messageId,
                cancelledBy,
                timestamp: new Date(),
            });
            this.logInfo('Bulk message cancelled', {
                messageId,
                cancelledBy,
            });
            return true;
        }
        catch (error) {
            this.logError('Error cancelling bulk message', {
                error: error instanceof Error ? error.message : String(error),
                messageId,
            });
            return false;
        }
    }
    getDeliverySummary() {
        try {
            const summary = {
                total: this.bulkMessages.length,
                completed: this.bulkMessages.filter((m) => m.status === 'completed').length,
                failed: this.bulkMessages.filter((m) => m.status === 'failed').length,
                sending: this.bulkMessages.filter((m) => m.status === 'sending').length,
                totalSent: this.bulkMessages.reduce((sum, m) => sum + m.deliveryStats.sent, 0),
                totalDelivered: this.bulkMessages.reduce((sum, m) => sum + m.deliveryStats.delivered, 0),
                totalFailed: this.bulkMessages.reduce((sum, m) => sum + m.deliveryStats.failed, 0),
                totalOpened: this.bulkMessages.reduce((sum, m) => sum + (m.deliveryStats.opened || 0), 0),
            };
            this.logInfo('Delivery summary retrieved', summary);
            return summary;
        }
        catch (error) {
            this.logError('Error retrieving delivery summary', {
                error: error instanceof Error ? error.message : String(error),
            });
            throw error;
        }
    }
    async processBulkMessage(message) {
        try {
            await new Promise((resolve) => setTimeout(resolve, 100));
            message.deliveryStats.sent = message.recipients.length;
            const delivered = Math.floor(message.recipients.length * 0.9);
            const failed = message.recipients.length - delivered;
            const opened = Math.floor(delivered * 0.8);
            message.deliveryStats.delivered = delivered;
            message.deliveryStats.failed = failed;
            message.deliveryStats.opened = opened;
            message.status = 'completed';
            message.completedAt = new Date();
            this.logInfo('Bulk message processed', {
                messageId: message.id,
                sent: message.deliveryStats.sent,
                delivered,
                failed,
                opened,
            });
        }
        catch (error) {
            this.logError('Error processing bulk message', {
                error: error instanceof Error ? error.message : String(error),
                messageId: message.id,
            });
            message.status = 'failed';
            message.errorMessage = 'Processing failed';
        }
    }
    validateBulkMessageData(data) {
        if (!data.subject || data.subject.trim().length === 0) {
            throw new Error('Message subject is required');
        }
        if (!data.body || data.body.trim().length === 0) {
            throw new Error('Message body is required');
        }
        if (!data.recipients || data.recipients.length === 0) {
            throw new Error('Recipients are required');
        }
        if (!data.channels || data.channels.length === 0) {
            throw new Error('Delivery channels are required');
        }
        const validChannels = ['sms', 'email', 'push'];
        for (const channel of data.channels) {
            if (!validChannels.includes(channel)) {
                throw new Error(`Invalid channel: ${channel}`);
            }
        }
    }
    validateMessageId(messageId) {
        if (!messageId || messageId.trim().length === 0) {
            throw new Error('Message ID is required');
        }
    }
};
exports.BulkMessagingService = BulkMessagingService;
exports.BulkMessagingService = BulkMessagingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [event_emitter_1.EventEmitter2])
], BulkMessagingService);
//# sourceMappingURL=bulk-messaging.service.js.map