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
exports.AllergyService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const base_1 = require("../../common/base");
const logger_service_1 = require("../../common/logging/logger.service");
const models_1 = require("../../database/models");
const models_2 = require("../../database/models");
let AllergyService = class AllergyService extends base_1.BaseService {
    allergyModel;
    studentModel;
    constructor(logger, allergyModel, studentModel) {
        super({
            serviceName: 'AllergyService',
            logger,
            enableAuditLogging: true,
        });
        this.allergyModel = allergyModel;
        this.studentModel = studentModel;
    }
    async addAllergy(allergyData) {
        this.logInfo(`Adding allergy for student ${allergyData.studentId}`);
        const student = await this.studentModel.findByPk(allergyData.studentId);
        if (!student) {
            throw new common_1.BadRequestException(`Student with ID ${allergyData.studentId} not found`);
        }
        const allergy = await this.allergyModel.create({
            ...allergyData,
            active: true,
            verified: false,
        });
        this.logger.log(`PHI Created: Allergy record created for student ${allergyData.studentId}`);
        return allergy;
    }
    async findOne(id, user) {
        this.logger.log(`Finding allergy ${id} for user ${user.id}`);
        const allergy = await this.allergyModel.findByPk(id, {
            include: [
                {
                    model: models_2.Student,
                    attributes: ['id', 'firstName', 'lastName'],
                },
            ],
        });
        if (!allergy) {
            throw new common_1.NotFoundException(`Allergy with ID ${id} not found`);
        }
        return allergy;
    }
    async findByStudent(studentId, user) {
        this.logger.log(`Finding allergies for student ${studentId} by user ${user.id}`);
        const student = await this.studentModel.findByPk(studentId);
        if (!student) {
            throw new common_1.NotFoundException(`Student with ID ${studentId} not found`);
        }
        return await this.allergyModel.findAll({
            where: {
                studentId,
                active: true,
            },
            order: [
                ['severity', 'DESC'],
                ['createdAt', 'DESC'],
            ],
        });
    }
    async create(createDto, user) {
        this.logger.log(`Creating allergy for student ${createDto.studentId} by user ${user.id}`);
        const student = await this.studentModel.findByPk(createDto.studentId);
        if (!student) {
            throw new common_1.BadRequestException(`Student with ID ${createDto.studentId} not found`);
        }
        const allergy = await this.allergyModel.create({
            ...createDto,
            createdBy: user.id,
            active: true,
            verified: false,
        });
        this.logger.log(`PHI Created: Allergy record created for student ${createDto.studentId}`);
        return allergy;
    }
    async update(id, updateDto, user) {
        const allergy = await this.allergyModel.findByPk(id);
        if (!allergy) {
            throw new common_1.NotFoundException(`Allergy with ID ${id} not found`);
        }
        await allergy.update({
            ...updateDto,
            updatedBy: user.id,
        });
        this.logger.log(`PHI Updated: Allergy ${id} updated by user ${user.id}`);
        return allergy;
    }
    async remove(id, user) {
        const allergy = await this.allergyModel.findByPk(id);
        if (!allergy) {
            throw new common_1.NotFoundException(`Allergy with ID ${id} not found`);
        }
        await allergy.update({
            active: false,
            updatedBy: user.id,
        });
        this.logger.log(`PHI Deleted: Allergy ${id} deactivated by user ${user.id}`);
    }
    async getAllergies(studentId) {
        this.logger.log(`Getting all allergies for student ${studentId}`);
        return await this.allergyModel.findAll({
            where: {
                studentId,
                active: true,
            },
            order: [
                ['severity', 'DESC'],
                ['createdAt', 'DESC'],
            ],
        });
    }
    async checkMedicationInteractions(studentId, medication) {
        this.logger.log(`Checking medication interactions for student ${studentId} with ${medication}`);
        const allergies = await this.allergyModel.findAll({
            where: {
                studentId,
                active: true,
                allergyType: models_1.AllergyType.MEDICATION,
            },
        });
        const interactions = allergies.filter((allergy) => allergy.allergen.toLowerCase().includes(medication.toLowerCase()) ||
            medication.toLowerCase().includes(allergy.allergen.toLowerCase()));
        return {
            hasInteractions: interactions.length > 0,
            interactions: interactions.map((a) => ({
                allergen: a.allergen,
                severity: a.severity,
                reaction: a.symptoms,
            })),
        };
    }
    async findCritical() {
        this.logger.log('Finding critical allergies');
        return await this.allergyModel.findAll({
            where: {
                active: true,
                severity: {
                    [sequelize_2.Op.in]: [models_1.AllergySeverity.SEVERE, models_1.AllergySeverity.LIFE_THREATENING],
                },
            },
            include: [
                {
                    model: models_2.Student,
                    attributes: ['id', 'firstName', 'lastName'],
                },
            ],
            order: [['severity', 'DESC']],
        });
    }
    async verify(id, verifiedBy) {
        this.logger.log(`Verifying allergy ${id} by ${verifiedBy}`);
        const allergy = await this.allergyModel.findByPk(id);
        if (!allergy) {
            throw new common_1.NotFoundException(`Allergy with ID ${id} not found`);
        }
        await allergy.update({
            verified: true,
            verifiedBy,
            verificationDate: new Date(),
        });
        return allergy;
    }
    async createMany(allergies, user) {
        this.logger.log(`Creating ${allergies.length} allergies in bulk by user ${user.id}`);
        const allergyData = allergies.map((allergy) => ({
            ...allergy,
            createdBy: user.id,
            active: true,
            verified: false,
        }));
        const created = await this.allergyModel.bulkCreate(allergyData);
        this.logger.log(`PHI Created: ${created.length} allergy records created in bulk`);
        return created;
    }
    async search(query, filters = {}) {
        this.logger.log(`Searching allergies with query: ${query}`);
        const whereClause = { active: true };
        if (query) {
            whereClause[sequelize_2.Op.or] = [
                { allergen: { [sequelize_2.Op.iLike]: `%${query}%` } },
                { symptoms: { [sequelize_2.Op.iLike]: `%${query}%` } },
                { notes: { [sequelize_2.Op.iLike]: `%${query}%` } },
            ];
        }
        if (filters.severity) {
            whereClause.severity = filters.severity;
        }
        if (filters.allergyType) {
            whereClause.allergyType = filters.allergyType;
        }
        if (filters.studentId) {
            whereClause.studentId = filters.studentId;
        }
        return await this.allergyModel.findAll({
            where: whereClause,
            include: [
                {
                    model: models_2.Student,
                    attributes: ['id', 'firstName', 'lastName'],
                },
            ],
            order: [
                ['severity', 'DESC'],
                ['createdAt', 'DESC'],
            ],
        });
    }
    async findByIds(ids) {
        try {
            const allergies = await this.allergyModel.findAll({
                where: {
                    id: { [sequelize_2.Op.in]: ids },
                    active: true,
                },
                include: [
                    {
                        model: models_2.Student,
                        attributes: ['id', 'firstName', 'lastName'],
                    },
                ],
                order: [
                    ['severity', 'DESC'],
                    ['createdAt', 'DESC'],
                ],
            });
            const allergyMap = new Map(allergies.map((a) => [a.id, a]));
            return ids.map((id) => allergyMap.get(id) || null);
        }
        catch (error) {
            this.logger.error(`Failed to batch fetch allergies: ${error.message}`, error.stack);
            return ids.map(() => null);
        }
    }
    async findByStudentIds(studentIds) {
        try {
            const allergies = await this.allergyModel.findAll({
                where: {
                    studentId: { [sequelize_2.Op.in]: studentIds },
                    active: true,
                },
                include: [
                    {
                        model: models_2.Student,
                        attributes: ['id', 'firstName', 'lastName'],
                    },
                ],
                order: [
                    ['severity', 'DESC'],
                    ['createdAt', 'DESC'],
                ],
            });
            const allergiesByStudent = new Map();
            for (const allergy of allergies) {
                if (!allergiesByStudent.has(allergy.studentId)) {
                    allergiesByStudent.set(allergy.studentId, []);
                }
                allergiesByStudent.get(allergy.studentId).push(allergy);
            }
            return studentIds.map((studentId) => allergiesByStudent.get(studentId) || []);
        }
        catch (error) {
            this.logger.error(`Failed to batch fetch allergies by student IDs: ${error.message}`, error.stack);
            return studentIds.map(() => []);
        }
    }
};
exports.AllergyService = AllergyService;
exports.AllergyService = AllergyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(logger_service_1.LoggerService)),
    __param(1, (0, sequelize_1.InjectModel)(models_1.Allergy)),
    __param(2, (0, sequelize_1.InjectModel)(models_2.Student)),
    __metadata("design:paramtypes", [logger_service_1.LoggerService, Object, Object])
], AllergyService);
//# sourceMappingURL=allergy.service.js.map