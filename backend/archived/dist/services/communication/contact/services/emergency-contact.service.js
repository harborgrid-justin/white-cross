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
exports.EmergencyContactService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const models_1 = require("../../../../database/models");
const enums_1 = require("../enums");
const base_1 = require("../../../../common/base");
let EmergencyContactService = class EmergencyContactService extends base_1.BaseService {
    emergencyContactModel;
    constructor(emergencyContactModel) {
        super("EmergencyContactService");
        this.emergencyContactModel = emergencyContactModel;
    }
    async findAll(query) {
        const { page = 1, limit = 20 } = query;
        const offset = (page - 1) * limit;
        const where = {};
        if (query.studentId) {
            where.studentId = query.studentId;
        }
        if (query.priority) {
            where.priority = query.priority;
        }
        if (query.isActive !== undefined) {
            where.isActive = query.isActive;
        }
        if (query.verificationStatus) {
            where.verificationStatus = query.verificationStatus;
        }
        const { rows: contacts, count: total } = await this.emergencyContactModel.findAndCountAll({
            where,
            offset,
            limit,
            order: [
                ['priority', 'ASC'],
                ['createdAt', 'ASC'],
            ],
        });
        this.logInfo(`Retrieved ${contacts.length} emergency contacts (page ${page}, total ${total})`);
        return {
            contacts,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async findAllByStudent(studentId) {
        const contacts = await this.emergencyContactModel.findAll({
            where: {
                studentId,
                isActive: true,
            },
            order: [
                ['priority', 'ASC'],
                ['createdAt', 'ASC'],
            ],
        });
        this.logInfo(`Retrieved ${contacts.length} emergency contacts for student ${studentId}`);
        return contacts;
    }
    async findOne(id) {
        const contact = await this.emergencyContactModel.findByPk(id);
        if (!contact) {
            throw new common_1.NotFoundException(`Emergency contact with ID ${id} not found`);
        }
        return contact;
    }
    async create(dto) {
        if (!dto.studentId) {
            throw new common_1.BadRequestException('Student ID is required');
        }
        if (!dto.firstName || !dto.lastName) {
            throw new common_1.BadRequestException('First name and last name are required');
        }
        if (!dto.phoneNumber) {
            throw new common_1.BadRequestException('Phone number is required');
        }
        let notificationChannelsString;
        if (dto.notificationChannels && Array.isArray(dto.notificationChannels)) {
            notificationChannelsString = JSON.stringify(dto.notificationChannels);
        }
        const contact = this.emergencyContactModel.build({
            ...dto,
            notificationChannels: notificationChannelsString,
            verificationStatus: dto.verificationStatus || enums_1.VerificationStatus.UNVERIFIED,
            isActive: dto.isActive !== undefined ? dto.isActive : true,
        });
        await contact.save();
        this.logInfo(`Created emergency contact ${contact.id} for student ${contact.studentId}`);
        return contact;
    }
    async update(id, dto) {
        const contact = await this.findOne(id);
        let notificationChannelsString;
        if (dto.notificationChannels && Array.isArray(dto.notificationChannels)) {
            notificationChannelsString = JSON.stringify(dto.notificationChannels);
        }
        Object.assign(contact, {
            ...dto,
            notificationChannels: notificationChannelsString || contact.notificationChannels,
        });
        await contact.save();
        this.logInfo(`Updated emergency contact ${id}`);
        return contact;
    }
    async remove(id) {
        const contact = await this.findOne(id);
        const primaryContacts = await this.emergencyContactModel.findAll({
            where: {
                studentId: contact.studentId,
                priority: enums_1.ContactPriority.PRIMARY,
                isActive: true,
            },
        });
        if (primaryContacts.length === 1 && primaryContacts[0].id === id) {
            throw new common_1.BadRequestException('Cannot delete the last primary contact. Student must have at least one primary contact.');
        }
        await contact.destroy();
        this.logInfo(`Removed emergency contact ${id}`);
        return { success: true, message: 'Emergency contact deleted successfully' };
    }
    async verifyContact(id, dto) {
        const contact = await this.findOne(id);
        contact.verificationStatus = dto.verificationStatus;
        if (dto.verificationStatus === enums_1.VerificationStatus.VERIFIED) {
            contact.lastVerifiedAt = new Date();
        }
        if (dto.notes) {
            contact.notes = dto.notes;
        }
        await contact.save();
        this.logInfo(`Verified emergency contact ${id} with status ${dto.verificationStatus}`);
        return contact;
    }
    async getNotificationRouting(studentId) {
        const allContacts = await this.findAllByStudent(studentId);
        const primary = allContacts.filter((c) => c.priority === enums_1.ContactPriority.PRIMARY);
        const secondary = allContacts.filter((c) => c.priority === enums_1.ContactPriority.SECONDARY);
        const emergencyOnly = allContacts.filter((c) => c.priority === enums_1.ContactPriority.EMERGENCY_ONLY);
        this.logInfo(`Notification routing for student ${studentId}: ${primary.length} primary, ${secondary.length} secondary, ${emergencyOnly.length} emergency-only`);
        return {
            primary,
            secondary,
            emergencyOnly,
        };
    }
    async getPrimaryContacts(studentId) {
        const contacts = await this.emergencyContactModel.findAll({
            where: {
                studentId,
                priority: enums_1.ContactPriority.PRIMARY,
                isActive: true,
            },
            order: [['createdAt', 'ASC']],
        });
        return contacts;
    }
    async getAuthorizedPickupContacts(studentId) {
        const contacts = await this.emergencyContactModel.findAll({
            where: {
                studentId,
                canPickupStudent: true,
                isActive: true,
            },
            order: [
                ['priority', 'ASC'],
                ['lastName', 'ASC'],
            ],
        });
        this.logInfo(`Retrieved ${contacts.length} authorized pickup contacts for student ${studentId}`);
        return contacts;
    }
    async findByIds(ids) {
        try {
            const contacts = await this.emergencyContactModel.findAll({
                where: {
                    id: { [sequelize_2.Op.in]: ids },
                },
            });
            const contactMap = new Map(contacts.map((c) => [c.id, c]));
            return ids.map((id) => contactMap.get(id) || null);
        }
        catch (error) {
            this.logError(`Failed to batch fetch emergency contacts: ${error.message}`);
            throw new Error('Failed to batch fetch emergency contacts');
        }
    }
    async findByStudentIds(studentIds) {
        try {
            const contacts = await this.emergencyContactModel.findAll({
                where: {
                    studentId: { [sequelize_2.Op.in]: studentIds },
                    isActive: true,
                },
                order: [
                    ['priority', 'ASC'],
                    ['createdAt', 'ASC'],
                ],
            });
            const grouped = new Map();
            for (const contact of contacts) {
                if (!grouped.has(contact.studentId)) {
                    grouped.set(contact.studentId, []);
                }
                grouped.get(contact.studentId).push(contact);
            }
            return studentIds.map((id) => grouped.get(id) || []);
        }
        catch (error) {
            this.logError(`Failed to batch fetch emergency contacts by student IDs: ${error.message}`);
            throw new Error('Failed to batch fetch emergency contacts by student IDs');
        }
    }
};
exports.EmergencyContactService = EmergencyContactService;
exports.EmergencyContactService = EmergencyContactService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.EmergencyContact)),
    __metadata("design:paramtypes", [Object])
], EmergencyContactService);
//# sourceMappingURL=emergency-contact.service.js.map