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
exports.ChronicConditionService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const models_1 = require("../../database/models");
const models_2 = require("../../database/models");
const base_1 = require("../../common/base");
let ChronicConditionService = class ChronicConditionService extends base_1.BaseService {
    chronicConditionModel;
    studentModel;
    constructor(chronicConditionModel, studentModel) {
        super("ChronicConditionService");
        this.chronicConditionModel = chronicConditionModel;
        this.studentModel = studentModel;
    }
    async addChronicCondition(conditionData) {
        this.logInfo(`Adding chronic condition for student ${conditionData.studentId}`);
        const student = await this.studentModel.findByPk(conditionData.studentId);
        if (!student) {
            throw new common_1.BadRequestException(`Student with ID ${conditionData.studentId} not found`);
        }
        const condition = await this.chronicConditionModel.create({
            ...conditionData,
            status: models_1.ConditionStatus.ACTIVE,
            isActive: true,
        });
        this.logInfo(`PHI Created: Chronic condition record created for student ${conditionData.studentId}`);
        return condition;
    }
    async getChronicConditions(studentId) {
        this.logInfo(`Getting chronic conditions${studentId ? ` for student ${studentId}` : ''}`);
        const whereClause = { isActive: true };
        if (studentId) {
            whereClause.studentId = studentId;
        }
        return await this.chronicConditionModel.findAll({
            where: whereClause,
            include: [
                {
                    model: models_2.Student,
                    attributes: ['id', 'firstName', 'lastName'],
                },
            ],
            order: [
                ['status', 'ASC'],
                ['nextReviewDate', 'ASC'],
                ['createdAt', 'DESC'],
            ],
        });
    }
    async findOne(id, user) {
        this.logInfo(`Finding chronic condition ${id} for user ${user.id}`);
        const condition = await this.chronicConditionModel.findByPk(id, {
            include: [
                {
                    model: models_2.Student,
                    attributes: ['id', 'firstName', 'lastName'],
                },
            ],
        });
        if (!condition) {
            throw new common_1.NotFoundException(`Chronic condition with ID ${id} not found`);
        }
        return condition;
    }
    async findByStudent(studentId, user) {
        this.logInfo(`Finding chronic conditions for student ${studentId} by user ${user.id}`);
        const student = await this.studentModel.findByPk(studentId);
        if (!student) {
            throw new common_1.NotFoundException(`Student with ID ${studentId} not found`);
        }
        return await this.chronicConditionModel.findAll({
            where: {
                studentId,
                isActive: true,
            },
            order: [
                ['status', 'ASC'],
                ['nextReviewDate', 'ASC'],
            ],
        });
    }
    async create(createDto, user) {
        this.logInfo(`Creating chronic condition for student ${createDto.studentId} by user ${user.id}`);
        const student = await this.studentModel.findByPk(createDto.studentId);
        if (!student) {
            throw new common_1.BadRequestException(`Student with ID ${createDto.studentId} not found`);
        }
        const condition = await this.chronicConditionModel.create({
            ...createDto,
            status: models_1.ConditionStatus.ACTIVE,
            isActive: true,
            createdBy: user.id,
        });
        this.logInfo(`PHI Created: Chronic condition record created for student ${createDto.studentId}`);
        return condition;
    }
    async update(id, updateDto, user) {
        const condition = await this.chronicConditionModel.findByPk(id);
        if (!condition) {
            throw new common_1.NotFoundException(`Chronic condition with ID ${id} not found`);
        }
        await condition.update({
            ...updateDto,
            updatedBy: user.id,
        });
        this.logInfo(`PHI Updated: Chronic condition ${id} updated by user ${user.id}`);
        return condition;
    }
    async remove(id, user) {
        const condition = await this.chronicConditionModel.findByPk(id);
        if (!condition) {
            throw new common_1.NotFoundException(`Chronic condition with ID ${id} not found`);
        }
        await condition.update({
            isActive: false,
            status: models_1.ConditionStatus.RESOLVED,
        });
        this.logInfo(`PHI Deleted: Chronic condition ${id} deactivated by user ${user.id}`);
    }
    async findActive(studentId) {
        this.logInfo(`Finding active chronic conditions${studentId ? ` for student ${studentId}` : ''}`);
        const whereClause = {
            isActive: true,
            status: models_1.ConditionStatus.ACTIVE,
        };
        if (studentId) {
            whereClause.studentId = studentId;
        }
        return await this.chronicConditionModel.findAll({
            where: whereClause,
            include: [
                {
                    model: models_2.Student,
                    attributes: ['id', 'firstName', 'lastName'],
                },
            ],
            order: [
                ['nextReviewDate', 'ASC'],
                ['severity', 'DESC'],
            ],
        });
    }
    async updateCarePlan(conditionId, plan, user) {
        this.logInfo(`Updating care plan for chronic condition ${conditionId} by user ${user.id}`);
        const condition = await this.chronicConditionModel.findByPk(conditionId);
        if (!condition) {
            throw new common_1.NotFoundException(`Chronic condition with ID ${conditionId} not found`);
        }
        await condition.update({
            carePlan: plan,
            lastReviewDate: new Date(),
        });
        this.logInfo(`PHI Updated: Care plan updated for chronic condition ${conditionId}`);
        return condition;
    }
    async search(query, filters = {}) {
        this.logInfo(`Searching chronic conditions with query: ${query}`);
        const whereClause = { isActive: true };
        if (query) {
            whereClause[sequelize_2.Op.or] = [
                { condition: { [sequelize_2.Op.iLike]: `%${query}%` } },
                { diagnosis: { [sequelize_2.Op.iLike]: `%${query}%` } },
                { icdCode: { [sequelize_2.Op.iLike]: `%${query}%` } },
                { notes: { [sequelize_2.Op.iLike]: `%${query}%` } },
            ];
        }
        if (filters.status) {
            whereClause.status = filters.status;
        }
        if (filters.severity) {
            whereClause.severity = filters.severity;
        }
        if (filters.studentId) {
            whereClause.studentId = filters.studentId;
        }
        if (filters.requiresIEP !== undefined) {
            whereClause.requiresIEP = filters.requiresIEP;
        }
        if (filters.requires504 !== undefined) {
            whereClause.requires504 = filters.requires504;
        }
        return await this.chronicConditionModel.findAll({
            where: whereClause,
            include: [
                {
                    model: models_2.Student,
                    attributes: ['id', 'firstName', 'lastName'],
                },
            ],
            order: [
                ['status', 'ASC'],
                ['nextReviewDate', 'ASC'],
                ['createdAt', 'DESC'],
            ],
        });
    }
    async getConditionsRequiringReview() {
        this.logInfo('Getting chronic conditions requiring review');
        const now = new Date();
        const nextMonth = new Date();
        nextMonth.setMonth(now.getMonth() + 1);
        return await this.chronicConditionModel.findAll({
            where: {
                isActive: true,
                nextReviewDate: {
                    [sequelize_2.Op.lte]: nextMonth,
                },
            },
            include: [
                {
                    model: models_2.Student,
                    attributes: ['id', 'firstName', 'lastName'],
                },
            ],
            order: [['nextReviewDate', 'ASC']],
        });
    }
    async getConditionsByICDCode(icdCode) {
        this.logInfo(`Getting chronic conditions with ICD code: ${icdCode}`);
        return await this.chronicConditionModel.findAll({
            where: {
                isActive: true,
                icdCode: {
                    [sequelize_2.Op.iLike]: `%${icdCode}%`,
                },
            },
            include: [
                {
                    model: models_2.Student,
                    attributes: ['id', 'firstName', 'lastName'],
                },
            ],
            order: [['condition', 'ASC']],
        });
    }
    async getConditionsRequiringAccommodations() {
        this.logInfo('Getting chronic conditions requiring accommodations');
        return await this.chronicConditionModel.findAll({
            where: {
                isActive: true,
                [sequelize_2.Op.or]: [{ requiresIEP: true }, { requires504: true }],
            },
            include: [
                {
                    model: models_2.Student,
                    attributes: ['id', 'firstName', 'lastName'],
                },
            ],
            order: [['condition', 'ASC']],
        });
    }
};
exports.ChronicConditionService = ChronicConditionService;
exports.ChronicConditionService = ChronicConditionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.ChronicCondition)),
    __param(1, (0, sequelize_1.InjectModel)(models_2.Student)),
    __metadata("design:paramtypes", [Object, Object])
], ChronicConditionService);
//# sourceMappingURL=chronic-condition.service.js.map