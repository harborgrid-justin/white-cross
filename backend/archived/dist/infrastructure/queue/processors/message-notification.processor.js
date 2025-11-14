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
var MessageNotificationProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageNotificationProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const enums_1 = require("../enums");
const dtos_1 = require("../dtos");
const base_processor_1 = require("../base.processor");
let MessageNotificationProcessor = MessageNotificationProcessor_1 = class MessageNotificationProcessor extends base_processor_1.BaseQueueProcessor {
    constructor() {
        super(MessageNotificationProcessor_1.name);
    }
    async processNotification(job) {
        return this.executeJobWithCommonHandling(job, { type: job.data.type, messageId: job.data.recipientId }, async () => {
            await job.progress({
                percentage: 20,
                step: 'Preparing notification',
            });
            switch (job.data.type) {
                case dtos_1.NotificationType.PUSH:
                    await this.sendPushNotification(job);
                    break;
                case dtos_1.NotificationType.EMAIL:
                    await this.sendEmailNotification(job);
                    break;
                case dtos_1.NotificationType.SMS:
                    await this.sendSmsNotification(job);
                    break;
                case dtos_1.NotificationType.IN_APP:
                    await this.sendInAppNotification(job);
                    break;
            }
            await job.progress({
                percentage: 100,
                step: 'Notification sent',
            });
            return {
                notificationId: job.data.notificationId,
                type: job.data.type,
                sentAt: new Date(),
            };
        });
    }
    async sendPushNotification(job) {
        await job.progress({
            percentage: 50,
            step: 'Sending push notification',
        });
        await this.delay(100);
    }
    async sendEmailNotification(job) {
        await job.progress({
            percentage: 50,
            step: 'Sending email notification',
        });
        await this.delay(150);
    }
    async sendSmsNotification(job) {
        await job.progress({
            percentage: 50,
            step: 'Sending SMS notification',
        });
        await this.delay(120);
    }
    async sendInAppNotification(job) {
        await job.progress({
            percentage: 50,
            step: 'Storing in-app notification',
        });
        await this.delay(50);
    }
};
exports.MessageNotificationProcessor = MessageNotificationProcessor;
__decorate([
    (0, bull_1.Process)('send-notification'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MessageNotificationProcessor.prototype, "processNotification", null);
exports.MessageNotificationProcessor = MessageNotificationProcessor = MessageNotificationProcessor_1 = __decorate([
    (0, bull_1.Processor)(enums_1.QueueName.MESSAGE_NOTIFICATION),
    __metadata("design:paramtypes", [])
], MessageNotificationProcessor);
//# sourceMappingURL=message-notification.processor.js.map