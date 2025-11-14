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
exports.NotificationOrchestrationService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const models_1 = require("../../../../database/models");
const notification_delivery_service_1 = require("./notification-delivery.service");
const contact_management_service_1 = require("./contact-management.service");
const base_1 = require("../../../../common/base");
let NotificationOrchestrationService = class NotificationOrchestrationService extends base_1.BaseService {
    emergencyContactModel;
    notificationService;
    contactManagementService;
    constructor(emergencyContactModel, notificationService, contactManagementService) {
        super("NotificationOrchestrationService");
        this.emergencyContactModel = emergencyContactModel;
        this.notificationService = notificationService;
        this.contactManagementService = contactManagementService;
    }
    async sendEmergencyNotification(studentId, notificationData) {
        try {
            const contacts = await this.contactManagementService.getStudentEmergencyContacts(studentId);
            if (contacts.length === 0) {
                throw new common_1.NotFoundException('No emergency contacts found for student');
            }
            const results = [];
            for (const contact of contacts) {
                const result = await this.sendNotificationToContact(contact, notificationData);
                results.push(result);
            }
            this.logInfo(`Emergency notification sent for student ${studentId}: ${notificationData.type} (${notificationData.priority})`);
            return results;
        }
        catch (error) {
            this.logError(`Error sending emergency notification: ${error.message}`, error.stack);
            throw error;
        }
    }
    async sendContactNotification(contactId, notificationData) {
        try {
            const contact = await this.emergencyContactModel.findOne({
                where: { id: contactId },
            });
            if (!contact) {
                throw new common_1.NotFoundException('Emergency contact not found');
            }
            if (!contact.isActive) {
                throw new common_1.BadRequestException('Emergency contact is not active');
            }
            const result = await this.sendNotificationToContact(contact, notificationData);
            this.logInfo(`Notification sent to contact ${contact.firstName} ${contact.lastName}`);
            return result;
        }
        catch (error) {
            this.logError(`Error sending contact notification: ${error.message}`, error.stack);
            throw error;
        }
    }
    async sendNotificationToContact(contact, notificationData) {
        const result = {
            contactId: contact.id,
            contact: {
                firstName: contact.firstName,
                lastName: contact.lastName,
                phoneNumber: contact.phoneNumber,
                email: contact.email || undefined,
            },
            channels: {},
            timestamp: new Date(),
        };
        for (const channel of notificationData.channels) {
            const channelResult = await this.sendThroughChannel(channel, contact, notificationData);
            result.channels[channel] = channelResult;
        }
        return result;
    }
    async sendThroughChannel(channel, contact, notificationData) {
        switch (channel) {
            case 'sms':
                return await this.sendSMSToContact(contact, notificationData.message);
            case 'email':
                return await this.sendEmailToContact(contact, notificationData.message, notificationData.studentId, notificationData.attachments);
            case 'voice':
                return await this.makeVoiceCallToContact(contact, notificationData.message);
            default:
                return {
                    success: false,
                    error: `Unknown channel: ${channel}`,
                };
        }
    }
    async sendSMSToContact(contact, message) {
        if (!contact.phoneNumber) {
            return this.handleError('Operation failed', new Error('Phone number not available'));
        }
        try {
            const smsResult = await this.notificationService.sendSMS(contact.phoneNumber, message);
            return {
                success: true,
                messageId: smsResult.messageId,
            };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    async sendEmailToContact(contact, message, studentId, attachments) {
        if (!contact.email) {
            return this.handleError('Operation failed', new Error('Email address not available'));
        }
        try {
            const subject = studentId
                ? `Notification - Student ${studentId}`
                : 'Emergency Notification';
            const emailResult = await this.notificationService.sendEmail(contact.email, subject, message, attachments);
            return {
                success: true,
                messageId: emailResult.messageId,
            };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    async makeVoiceCallToContact(contact, message) {
        if (!contact.phoneNumber) {
            return this.handleError('Operation failed', new Error('Phone number not available'));
        }
        try {
            const voiceResult = await this.notificationService.makeVoiceCall(contact.phoneNumber, message);
            return {
                success: true,
                callId: voiceResult.callId,
            };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
};
exports.NotificationOrchestrationService = NotificationOrchestrationService;
exports.NotificationOrchestrationService = NotificationOrchestrationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.EmergencyContact)),
    __metadata("design:paramtypes", [Object, notification_delivery_service_1.NotificationDeliveryService,
        contact_management_service_1.ContactManagementService])
], NotificationOrchestrationService);
//# sourceMappingURL=notification-orchestration.service.js.map