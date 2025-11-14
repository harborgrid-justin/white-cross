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
exports.ContactService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const models_1 = require("../../../../database/models");
const base_1 = require("../../../../common/base");
let ContactService = class ContactService extends base_1.BaseService {
    contactModel;
    constructor(contactModel) {
        super("ContactService");
        this.contactModel = contactModel;
    }
    async getContacts(query) {
        const { page = 1, limit = 20, orderBy = 'lastName', orderDirection = 'ASC', } = query;
        const offset = (page - 1) * limit;
        const where = {};
        if (query.type) {
            where.type = Array.isArray(query.type)
                ? { [sequelize_2.Op.in]: query.type }
                : query.type;
        }
        if (query.isActive !== undefined) {
            where.isActive = query.isActive;
        }
        if (query.relationTo) {
            where.relationTo = query.relationTo;
        }
        let searchWhere = undefined;
        if (query.search) {
            searchWhere = [
                { firstName: { [sequelize_2.Op.iLike]: `%${query.search}%` } },
                { lastName: { [sequelize_2.Op.iLike]: `%${query.search}%` } },
                { email: { [sequelize_2.Op.iLike]: `%${query.search}%` } },
                { organization: { [sequelize_2.Op.iLike]: `%${query.search}%` } },
            ];
        }
        const finalWhere = searchWhere ? { [sequelize_2.Op.or]: searchWhere, ...where } : where;
        const { rows: contacts, count: total } = await this.contactModel.findAndCountAll({
            where: finalWhere,
            offset,
            limit,
            order: [[orderBy, orderDirection]],
        });
        this.logInfo(`Retrieved ${contacts.length} contacts (page ${page}, total ${total})`);
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
    async getContactById(id) {
        this.logInfo(`Retrieving contact with ID: ${id}`);
        const contact = await this.contactModel.findByPk(id);
        if (!contact) {
            throw new common_1.NotFoundException(`Contact with ID ${id} not found`);
        }
        this.logInfo(`Retrieved contact: ${contact.firstName} ${contact.lastName}`);
        return contact;
    }
    async createContact(dto) {
        if (!dto.firstName || !dto.lastName) {
            throw new common_1.BadRequestException('First name and last name are required');
        }
        if (!dto.type) {
            throw new common_1.BadRequestException('Contact type is required');
        }
        if (dto.email) {
            const existingContact = await this.contactModel.findOne({
                where: {
                    email: dto.email,
                    type: dto.type,
                    isActive: true,
                },
            });
            if (existingContact) {
                throw new common_1.ConflictException(`A ${dto.type} contact with this email already exists`);
            }
        }
        const contact = this.contactModel.build({
            ...dto,
            isActive: dto.isActive !== undefined ? dto.isActive : true,
        });
        await contact.save();
        this.logInfo(`Created contact ${contact.id} (${contact.firstName} ${contact.lastName})`);
        return contact;
    }
    async updateContact(id, dto) {
        const contact = await this.getContactById(id);
        if (dto.email && dto.email !== contact.email) {
            const existingContact = await this.contactModel.findOne({
                where: {
                    email: dto.email,
                    type: dto.type || contact.type,
                    isActive: true,
                    id: { [sequelize_2.Op.ne]: id },
                },
            });
            if (existingContact) {
                throw new common_1.ConflictException('Another contact with this email already exists');
            }
        }
        Object.assign(contact, dto);
        await contact.save();
        this.logInfo(`Updated contact ${contact.id}`);
        return contact;
    }
    async deleteContact(id) {
        const contact = await this.getContactById(id);
        contact.isActive = false;
        await contact.save();
        this.logInfo(`Soft deleted contact ${id}`);
        return { success: true, message: 'Contact deleted successfully' };
    }
    async deactivateContact(id, updatedBy) {
        const contact = await this.getContactById(id);
        contact.isActive = false;
        if (updatedBy) {
            contact.updatedBy = updatedBy;
        }
        await contact.save();
        this.logInfo(`Deactivated contact ${id}`);
        return contact;
    }
    async reactivateContact(id, updatedBy) {
        const contact = await this.getContactById(id);
        contact.isActive = true;
        if (updatedBy) {
            contact.updatedBy = updatedBy;
        }
        await contact.save();
        this.logInfo(`Reactivated contact ${id}`);
        return contact;
    }
    async getContactsByRelation(relationTo, type) {
        const where = {
            relationTo,
            isActive: true,
        };
        if (type) {
            where.type = type;
        }
        const contacts = await this.contactModel.findAll({
            where,
            order: [['lastName', 'ASC']],
        });
        this.logInfo(`Retrieved ${contacts.length} contacts for relation ${relationTo}`);
        return contacts;
    }
    async searchContacts(query, limit = 10) {
        const contacts = await this.contactModel.findAll({
            where: [
                { firstName: { [sequelize_2.Op.iLike]: `%${query}%` }, isActive: true },
                { lastName: { [sequelize_2.Op.iLike]: `%${query}%` }, isActive: true },
                { email: { [sequelize_2.Op.iLike]: `%${query}%` }, isActive: true },
                { organization: { [sequelize_2.Op.iLike]: `%${query}%` }, isActive: true },
            ],
            limit,
            order: [['lastName', 'ASC']],
        });
        this.logInfo(`Search for "${query}" returned ${contacts.length} results`);
        return contacts;
    }
    async getContactStats() {
        const total = await this.contactModel.count({ where: { isActive: true } });
        const byTypeResults = await this.contactModel.findAll({
            where: { isActive: true },
            attributes: [
                'type',
                [
                    this.contactModel.sequelize.fn('COUNT', this.contactModel.sequelize.col('id')),
                    'count',
                ],
            ],
            group: ['type'],
            raw: true,
        });
        const byType = {};
        byTypeResults.forEach((result) => {
            byType[result.type] = parseInt(result.count, 10);
        });
        this.logInfo(`Contact statistics: ${total} total, ${Object.keys(byType).length} types`);
        return { total, byType };
    }
    async findByIds(ids) {
        try {
            const contacts = await this.contactModel.findAll({
                where: {
                    id: { [sequelize_2.Op.in]: ids },
                },
            });
            const contactMap = new Map(contacts.map((c) => [c.id, c]));
            return ids.map((id) => contactMap.get(id) || null);
        }
        catch (error) {
            this.logError(`Failed to batch fetch contacts: ${error.message}`);
            throw new Error('Failed to batch fetch contacts');
        }
    }
    async findByStudentIds(studentIds) {
        try {
            const contacts = await this.contactModel.findAll({
                where: {
                    relationTo: { [sequelize_2.Op.in]: studentIds },
                    isActive: true,
                },
                order: [
                    ['lastName', 'ASC'],
                    ['firstName', 'ASC'],
                ],
            });
            const contactsByStudent = new Map();
            contacts.forEach((contact) => {
                const studentId = contact.relationTo;
                if (studentId) {
                    if (!contactsByStudent.has(studentId)) {
                        contactsByStudent.set(studentId, []);
                    }
                    contactsByStudent.get(studentId).push(contact);
                }
            });
            return studentIds.map((id) => contactsByStudent.get(id) || []);
        }
        catch (error) {
            this.logError(`Failed to batch fetch contacts by student IDs: ${error.message}`);
            throw new Error('Failed to batch fetch contacts by student IDs');
        }
    }
};
exports.ContactService = ContactService;
exports.ContactService = ContactService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.Contact)),
    __metadata("design:paramtypes", [Object])
], ContactService);
//# sourceMappingURL=contact.service.js.map