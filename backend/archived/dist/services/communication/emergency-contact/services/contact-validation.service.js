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
exports.ContactValidationService = void 0;
const common_1 = require("@nestjs/common");
const base_1 = require("../../../../common/base");
let ContactValidationService = class ContactValidationService extends base_1.BaseService {
    constructor() {
        super('ContactValidationService');
    }
    validatePhoneNumber(phoneNumber) {
        const cleanPhone = phoneNumber.replace(/[\s\-().]/g, '');
        if (cleanPhone.length < 10) {
            throw new common_1.BadRequestException('Phone number must contain at least 10 digits');
        }
        return cleanPhone;
    }
    validateEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            throw new common_1.BadRequestException('Invalid email format');
        }
    }
    validateNotificationChannels(channels, email, phoneNumber) {
        const validChannels = ['sms', 'email', 'voice'];
        for (const channel of channels) {
            if (!validChannels.includes(channel)) {
                throw new common_1.BadRequestException(`Invalid notification channel: ${channel}. Must be one of: ${validChannels.join(', ')}`);
            }
        }
        if (channels.includes('email') && !email) {
            throw new common_1.BadRequestException('Email address is required when email is selected as a notification channel');
        }
        if ((channels.includes('sms') || channels.includes('voice')) &&
            !phoneNumber) {
            throw new common_1.BadRequestException('Phone number is required for SMS or voice notification channels');
        }
    }
    validateContactCreation(data) {
        this.validatePhoneNumber(data.phoneNumber);
        if (data.email) {
            this.validateEmail(data.email);
        }
        if (data.notificationChannels) {
            this.validateNotificationChannels(data.notificationChannels, data.email, data.phoneNumber);
        }
        this.logDebug('Contact creation data validation passed');
    }
    validateContactUpdate(updateData, existingContact) {
        if (updateData.phoneNumber) {
            this.validatePhoneNumber(updateData.phoneNumber);
        }
        if (updateData.email) {
            this.validateEmail(updateData.email);
        }
        if (updateData.notificationChannels) {
            const finalEmail = updateData.email !== undefined
                ? updateData.email
                : existingContact.email;
            const finalPhone = updateData.phoneNumber !== undefined
                ? updateData.phoneNumber
                : existingContact.phoneNumber;
            this.validateNotificationChannels(updateData.notificationChannels, finalEmail, finalPhone);
        }
        this.logDebug('Contact update data validation passed');
    }
};
exports.ContactValidationService = ContactValidationService;
exports.ContactValidationService = ContactValidationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ContactValidationService);
//# sourceMappingURL=contact-validation.service.js.map