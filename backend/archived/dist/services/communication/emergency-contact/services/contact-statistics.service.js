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
exports.ContactStatisticsService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const models_1 = require("../../../../database/models");
const models_2 = require("../../../../database/models");
const enums_1 = require("../../contact/enums");
const base_1 = require("../../../../common/base");
let ContactStatisticsService = class ContactStatisticsService extends base_1.BaseService {
    emergencyContactModel;
    studentModel;
    constructor(emergencyContactModel, studentModel) {
        super("ContactStatisticsService");
        this.emergencyContactModel = emergencyContactModel;
        this.studentModel = studentModel;
    }
    async getContactStatistics() {
        try {
            if (!this.emergencyContactModel.sequelize) {
                throw new Error('Database connection not available');
            }
            const [totalContacts, priorityResults, allStudents, studentsWithContactsResult,] = await Promise.all([
                this.emergencyContactModel.count({
                    where: { isActive: true },
                }),
                this.emergencyContactModel.sequelize.query(`
          SELECT
            priority,
            COUNT(*) as count
          FROM "EmergencyContacts"
          WHERE "isActive" = :isActive
          GROUP BY priority
          `, {
                    type: sequelize_2.QueryTypes.SELECT,
                    raw: true,
                    replacements: { isActive: true },
                }),
                this.studentModel.count({
                    where: { isActive: true },
                }),
                this.emergencyContactModel.sequelize.query('SELECT COUNT(DISTINCT "studentId") as count FROM "EmergencyContacts" WHERE "isActive" = :isActive', {
                    type: sequelize_2.QueryTypes.SELECT,
                    raw: true,
                    replacements: { isActive: true },
                }),
            ]);
            const byPriority = {};
            Object.values(enums_1.ContactPriority).forEach((priority) => {
                byPriority[priority] = 0;
            });
            priorityResults.forEach((row) => {
                if (row && row.priority && row.count) {
                    byPriority[row.priority] = parseInt(row.count, 10);
                }
            });
            const studentsWithoutContacts = allStudents -
                (parseInt(studentsWithContactsResult[0]?.count || '0', 10) || 0);
            this.logInfo(`Contact statistics: ${totalContacts} total, ${studentsWithoutContacts} students without contacts`);
            return {
                totalContacts,
                studentsWithoutContacts,
                byPriority,
            };
        }
        catch (error) {
            this.logError(`Error fetching contact statistics: ${error.message}`, error.stack);
            throw error;
        }
    }
    async findByIds(ids) {
        try {
            const contacts = await this.emergencyContactModel.findAll({
                where: {
                    id: { [sequelize_2.Op.in]: ids },
                    isActive: true,
                },
                order: [
                    ['priority', 'ASC'],
                    ['firstName', 'ASC'],
                ],
            });
            const contactMap = new Map(contacts.map((c) => [c.id, c]));
            return ids.map((id) => contactMap.get(id) || null);
        }
        catch (error) {
            this.logError(`Failed to batch fetch emergency contacts: ${error.message}`, error.stack);
            return ids.map(() => null);
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
                    ['firstName', 'ASC'],
                ],
            });
            const contactsByStudent = new Map();
            for (const contact of contacts) {
                if (!contactsByStudent.has(contact.studentId)) {
                    contactsByStudent.set(contact.studentId, []);
                }
                contactsByStudent.get(contact.studentId).push(contact);
            }
            return studentIds.map((studentId) => contactsByStudent.get(studentId) || []);
        }
        catch (error) {
            this.logError(`Failed to batch fetch emergency contacts by student IDs: ${error.message}`, error.stack);
            return studentIds.map(() => []);
        }
    }
    async getContactsByPriority(priority) {
        try {
            const contacts = await this.emergencyContactModel.findAll({
                where: {
                    priority,
                    isActive: true,
                },
                order: [
                    ['studentId', 'ASC'],
                    ['firstName', 'ASC'],
                ],
            });
            this.logInfo(`Retrieved ${contacts.length} contacts with ${priority} priority`);
            return contacts;
        }
        catch (error) {
            this.logError(`Error fetching contacts by priority: ${error.message}`, error.stack);
            throw error;
        }
    }
    async getStudentsWithoutContacts() {
        try {
            if (!this.emergencyContactModel.sequelize) {
                throw new Error('Database connection not available');
            }
            const result = await this.emergencyContactModel.sequelize.query(`
        SELECT s.id as "studentId"
        FROM "Students" s
        LEFT JOIN "EmergencyContacts" ec ON s.id = ec."studentId" AND ec."isActive" = true
        WHERE s."isActive" = true
        GROUP BY s.id
        HAVING COUNT(ec.id) = 0
        `, {
                type: sequelize_2.QueryTypes.SELECT,
                raw: true,
            });
            this.logInfo(`Found ${result.length} students without emergency contacts`);
            return result.map((row) => row.studentId);
        }
        catch (error) {
            this.logError(`Error fetching students without contacts: ${error.message}`, error.stack);
            throw error;
        }
    }
};
exports.ContactStatisticsService = ContactStatisticsService;
exports.ContactStatisticsService = ContactStatisticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.EmergencyContact)),
    __param(1, (0, sequelize_1.InjectModel)(models_2.Student)),
    __metadata("design:paramtypes", [Object, Object])
], ContactStatisticsService);
//# sourceMappingURL=contact-statistics.service.js.map