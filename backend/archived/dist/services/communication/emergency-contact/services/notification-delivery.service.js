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
exports.NotificationDeliveryService = void 0;
const common_1 = require("@nestjs/common");
const base_1 = require("../../../../common/base");
let NotificationDeliveryService = class NotificationDeliveryService extends base_1.BaseService {
    constructor() {
        super('NotificationDeliveryService');
    }
    async sendSMS(phoneNumber, message) {
        try {
            this.logInfo(`SMS would be sent to ${phoneNumber}: ${message}`);
            return {
                messageId: `sms_${Date.now()}`,
                success: true,
            };
        }
        catch (error) {
            this.logError(`Failed to send SMS to ${phoneNumber}: ${error.message}`, error.stack);
            throw error;
        }
    }
    async sendEmail(email, subject, message, attachments) {
        try {
            this.logInfo(`Email would be sent to ${email}: ${subject}`);
            if (attachments && attachments.length > 0) {
                this.logInfo(`Email includes ${attachments.length} attachments`);
            }
            return {
                messageId: `email_${Date.now()}`,
                success: true,
            };
        }
        catch (error) {
            this.logError(`Failed to send email to ${email}: ${error.message}`, error.stack);
            throw error;
        }
    }
    async makeVoiceCall(phoneNumber, message) {
        try {
            this.logInfo(`Voice call would be made to ${phoneNumber}: ${message}`);
            return {
                callId: `call_${Date.now()}`,
                success: true,
            };
        }
        catch (error) {
            this.logError(`Failed to make voice call to ${phoneNumber}: ${error.message}`, error.stack);
            throw error;
        }
    }
    async sendThroughChannel(channel, phoneNumber, email, message, subject, attachments) {
        try {
            switch (channel) {
                case 'sms':
                    if (!phoneNumber) {
                        return {
                            success: false,
                            error: 'Phone number not available for SMS',
                        };
                    }
                    const smsResult = await this.sendSMS(phoneNumber, message);
                    return {
                        success: true,
                        messageId: smsResult.messageId,
                    };
                case 'email':
                    if (!email) {
                        return {
                            success: false,
                            error: 'Email address not available',
                        };
                    }
                    const emailResult = await this.sendEmail(email, subject || 'Notification', message, attachments);
                    return {
                        success: true,
                        messageId: emailResult.messageId,
                    };
                case 'voice':
                    if (!phoneNumber) {
                        return {
                            success: false,
                            error: 'Phone number not available for voice call',
                        };
                    }
                    const voiceResult = await this.makeVoiceCall(phoneNumber, message);
                    return {
                        success: true,
                        callId: voiceResult.callId,
                    };
                default:
                    return {
                        success: false,
                        error: `Unknown notification channel: ${channel}`,
                    };
            }
        }
        catch (error) {
            this.logError(`Failed to send notification through ${channel}: ${error.message}`);
            return {
                success: false,
                error: error.message,
            };
        }
    }
};
exports.NotificationDeliveryService = NotificationDeliveryService;
exports.NotificationDeliveryService = NotificationDeliveryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], NotificationDeliveryService);
//# sourceMappingURL=notification-delivery.service.js.map