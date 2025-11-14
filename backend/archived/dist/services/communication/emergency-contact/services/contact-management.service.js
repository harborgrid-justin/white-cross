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
exports.ContactManagementService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const models_1 = require("../../../../database/models");
const models_2 = require("../../../../database/models");
const enums_1 = require("../../contact/enums");
const contact_validation_service_1 = require("./contact-validation.service");
const base_1 = require("../../../../common/base");
const logger_service_1 = require("../../../../common/logging/logger.service");
let ContactManagementService = class ContactManagementService extends base_1.BaseService {
    emergencyContactModel;
    studentModel;
    validationService;
    constructor(logger, emergencyContactModel, studentModel, validationService) {
        super({
            serviceName: 'ContactManagementService',
            logger,
            enableAuditLogging: false,
        });
        this.emergencyContactModel = emergencyContactModel;
        this.studentModel = studentModel;
        this.validationService = validationService;
    }
    async getStudentEmergencyContacts(studentId) {
        try {
            const contacts = await this.emergencyContactModel.findAll({
                where: { studentId, isActive: true },
                order: [['priority', 'ASC']],
            });
            this.logger.log(`Retrieved ${contacts.length} emergency contacts for student ${studentId}`);
            return contacts;
        }
        catch (error) {
            this.logger.error(`Error fetching student emergency contacts: ${error.message}`, error.stack);
            throw new Error('Failed to fetch emergency contacts');
        }
    }
    async getEmergencyContactById(id) {
        const contact = await this.emergencyContactModel.findByPk(id);
        if (!contact) {
            throw new common_1.NotFoundException('Emergency contact not found');
        }
        return contact;
    }
    async createEmergencyContact(data) {
        return await this.withTransaction(async (transaction) => {
            const student = await this.studentModel.findOne({
                where: { id: data.studentId },
                transaction,
            });
            if (!student) {
                throw new common_1.NotFoundException('Student not found');
            }
            if (!student.isActive) {
                throw new common_1.BadRequestException('Cannot add emergency contact to inactive student');
            }
            this.validationService.validateContactCreation({
                phoneNumber: data.phoneNumber,
                email: data.email,
                notificationChannels: data.notificationChannels,
            });
            if (data.priority === enums_1.ContactPriority.PRIMARY) {
                await this.validatePrimaryContactLimit(data.studentId, transaction);
            }
            const contactData = {
                ...data,
                notificationChannels: data.notificationChannels
                    ? JSON.stringify(data.notificationChannels)
                    : JSON.stringify(['sms', 'email']),
            };
            const savedContact = await this.emergencyContactModel.create(contactData, {
                transaction,
            });
            this.logger.log(`Emergency contact created: ${savedContact.firstName} ${savedContact.lastName} (${savedContact.priority}) for student ${student.firstName} ${student.lastName}`);
            return savedContact;
        });
    }
    async updateEmergencyContact(id, data) {
        return await this.withTransaction(async (transaction) => {
            const existingContact = await this.getEmergencyContactById(id);
            this.validationService.validateContactUpdate(data, existingContact);
            if (data.priority !== undefined && data.priority !== existingContact.priority) {
                await this.validatePriorityChange(existingContact, data.priority, transaction);
            }
            if (data.isActive === false &&
                existingContact.isActive &&
                existingContact.priority === enums_1.ContactPriority.PRIMARY) {
                await this.validatePrimaryContactDeactivation(existingContact.studentId, transaction);
            }
            const updateData = { ...data };
            if (data.notificationChannels) {
                updateData.notificationChannels = JSON.stringify(data.notificationChannels);
            }
            await existingContact.update(updateData, { transaction });
            return existingContact;
        });
    }
    async deleteEmergencyContact(id) {
        return await this.withTransaction(async (transaction) => {
            const contact = await this.getEmergencyContactById(id);
            if (contact.isActive && contact.priority === enums_1.ContactPriority.PRIMARY) {
                await this.validatePrimaryContactDeactivation(contact.studentId, transaction);
            }
            await contact.update({ isActive: false }, { transaction });
            this.logger.log(`Emergency contact deleted: ${contact.firstName} ${contact.lastName}`);
            return { success: true };
        });
    }
    async validatePrimaryContactLimit(studentId, transaction) {
        const existingPrimaryContacts = await this.emergencyContactModel.count({
            where: {
                studentId,
                priority: enums_1.ContactPriority.PRIMARY,
                isActive: true,
            },
            transaction,
        });
        if (existingPrimaryContacts >= 2) {
            throw new common_1.BadRequestException('Student already has 2 primary contacts. Please set one as SECONDARY before adding another PRIMARY contact.');
        }
    }
    async validatePriorityChange(existingContact, newPriority, transaction) {
        if (newPriority === enums_1.ContactPriority.PRIMARY) {
            const existingPrimaryContacts = await this.emergencyContactModel.count({
                where: {
                    studentId: existingContact.studentId,
                    priority: enums_1.ContactPriority.PRIMARY,
                    isActive: true,
                },
                transaction,
            });
            const adjustedCount = existingContact.priority === enums_1.ContactPriority.PRIMARY
                ? existingPrimaryContacts - 1
                : existingPrimaryContacts;
            if (adjustedCount >= 2) {
                throw new common_1.BadRequestException('Student already has 2 primary contacts. Please set one as SECONDARY before changing this contact to PRIMARY.');
            }
        }
        else if (existingContact.priority === enums_1.ContactPriority.PRIMARY) {
            const otherPrimaryContacts = await this.emergencyContactModel.count({
                where: {
                    studentId: existingContact.studentId,
                    priority: enums_1.ContactPriority.PRIMARY,
                    isActive: true,
                },
                transaction,
            });
            if (otherPrimaryContacts <= 1) {
                throw new common_1.BadRequestException('Cannot change priority from PRIMARY. Student must have at least one PRIMARY contact. Add another PRIMARY contact first or change this to SECONDARY and promote another contact.');
            }
        }
    }
    async validatePrimaryContactDeactivation(studentId, transaction) {
        const activePrimaryContacts = await this.emergencyContactModel.count({
            where: {
                studentId,
                priority: enums_1.ContactPriority.PRIMARY,
                isActive: true,
            },
            transaction,
        });
        if (activePrimaryContacts <= 1) {
            throw new common_1.BadRequestException('Cannot deactivate the only active PRIMARY contact. Student must have at least one active PRIMARY contact.');
        }
    }
    async withTransaction(handler) {
        const sequelize = this.emergencyContactModel.sequelize;
        if (!sequelize) {
            return handler(undefined);
        }
        return sequelize.transaction(async (transaction) => handler(transaction));
    }
};
exports.ContactManagementService = ContactManagementService;
exports.ContactManagementService = ContactManagementService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(logger_service_1.LoggerService)),
    __param(1, (0, sequelize_1.InjectModel)(models_1.EmergencyContact)),
    __param(2, (0, sequelize_1.InjectModel)(models_2.Student)),
    __metadata("design:paramtypes", [logger_service_1.LoggerService, Object, Object, contact_validation_service_1.ContactValidationService])
], ContactManagementService);
//# sourceMappingURL=contact-management.service.js.map