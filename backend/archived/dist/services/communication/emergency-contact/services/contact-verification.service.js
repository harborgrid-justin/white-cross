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
exports.ContactVerificationService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const models_1 = require("../../../../database/models");
const enums_1 = require("../../contact/enums");
const notification_delivery_service_1 = require("./notification-delivery.service");
const base_1 = require("../../../../common/base");
let ContactVerificationService = class ContactVerificationService extends base_1.BaseService {
    emergencyContactModel;
    notificationService;
    constructor(emergencyContactModel, notificationService) {
        super("ContactVerificationService");
        this.emergencyContactModel = emergencyContactModel;
        this.notificationService = notificationService;
    }
    async verifyContact(contactId, verificationMethod) {
        try {
            const contact = await this.emergencyContactModel.findOne({
                where: { id: contactId },
            });
            if (!contact) {
                throw new common_1.NotFoundException('Emergency contact not found');
            }
            const verificationCode = this.generateVerificationCode();
            const message = `Verification code for student emergency contact: ${verificationCode}`;
            let result;
            switch (verificationMethod) {
                case 'sms':
                    if (!contact.phoneNumber) {
                        throw new common_1.BadRequestException('Phone number not available for SMS verification');
                    }
                    result = await this.notificationService.sendSMS(contact.phoneNumber, message);
                    break;
                case 'email':
                    if (!contact.email) {
                        throw new common_1.BadRequestException('Email address not available for email verification');
                    }
                    result = await this.notificationService.sendEmail(contact.email, 'Contact Verification', message);
                    break;
                case 'voice':
                    if (!contact.phoneNumber) {
                        throw new common_1.BadRequestException('Phone number not available for voice verification');
                    }
                    result = await this.notificationService.makeVoiceCall(contact.phoneNumber, message);
                    break;
                default:
                    throw new common_1.BadRequestException('Invalid verification method');
            }
            await contact.update({
                verificationStatus: enums_1.VerificationStatus.PENDING,
            });
            this.logInfo(`Verification ${verificationMethod} sent to contact ${contact.firstName} ${contact.lastName}`);
            return {
                verificationCode,
                method: verificationMethod,
                ...result,
            };
        }
        catch (error) {
            this.logError(`Error verifying contact: ${error.message}`, error.stack);
            throw error;
        }
    }
    async confirmVerification(contactId, code) {
        try {
            const contact = await this.emergencyContactModel.findOne({
                where: { id: contactId },
            });
            if (!contact) {
                throw new common_1.NotFoundException('Emergency contact not found');
            }
            const isValidCode = true;
            if (!isValidCode) {
                throw new common_1.BadRequestException('Invalid verification code');
            }
            await contact.update({
                verificationStatus: enums_1.VerificationStatus.VERIFIED,
            });
            this.logInfo(`Contact verified: ${contact.firstName} ${contact.lastName}`);
            return { success: true };
        }
        catch (error) {
            this.logError(`Error confirming verification: ${error.message}`, error.stack);
            throw error;
        }
    }
    async getVerificationStatus(contactId) {
        const contact = await this.emergencyContactModel.findOne({
            where: { id: contactId },
        });
        if (!contact) {
            throw new common_1.NotFoundException('Emergency contact not found');
        }
        return contact.verificationStatus;
    }
    async resetVerification(contactId) {
        try {
            const contact = await this.emergencyContactModel.findOne({
                where: { id: contactId },
            });
            if (!contact) {
                throw new common_1.NotFoundException('Emergency contact not found');
            }
            await contact.update({
                verificationStatus: enums_1.VerificationStatus.UNVERIFIED,
            });
            this.logInfo(`Verification reset for contact: ${contact.firstName} ${contact.lastName}`);
            return { success: true };
        }
        catch (error) {
            this.logError(`Error resetting verification: ${error.message}`, error.stack);
            throw error;
        }
    }
    generateVerificationCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
};
exports.ContactVerificationService = ContactVerificationService;
exports.ContactVerificationService = ContactVerificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.EmergencyContact)),
    __metadata("design:paramtypes", [Object, notification_delivery_service_1.NotificationDeliveryService])
], ContactVerificationService);
//# sourceMappingURL=contact-verification.service.js.map