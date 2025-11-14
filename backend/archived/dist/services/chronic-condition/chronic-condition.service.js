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
const base_1 = require("../../common/base");
let ChronicConditionService = class ChronicConditionService extends base_1.BaseService {
    chronicConditionModel;
    constructor(chronicConditionModel) {
        super('ChronicConditionService');
        this.chronicConditionModel = chronicConditionModel;
    }
    async createChronicCondition(dto) {
        try {
            const conditionData = {
                ...dto,
                diagnosedDate: new Date(dto.diagnosedDate),
                lastReviewDate: dto.lastReviewDate
                    ? new Date(dto.lastReviewDate)
                    : null,
                nextReviewDate: dto.nextReviewDate
                    ? new Date(dto.nextReviewDate)
                    : null,
                medications: dto.medications || [],
                restrictions: dto.restrictions || [],
                triggers: dto.triggers || [],
                accommodations: dto.accommodations || [],
                isActive: true,
            };
            const savedCondition = await this.chronicConditionModel.create(conditionData);
            this.logInfo({
                message: 'PHI Access - Chronic Condition Created',
                action: 'CREATE',
                entity: 'ChronicCondition',
                entityId: savedCondition.id,
                studentId: dto.studentId,
                condition: dto.condition,
                status: dto.status,
                diagnosedBy: dto.diagnosedBy,
                timestamp: new Date().toISOString(),
            });
            this.logInfo(`Chronic condition created: ${dto.condition} for student ${dto.studentId}`);
            return savedCondition;
        }
        catch (error) {
            this.logError('Error creating chronic condition:', error);
            throw error;
        }
    }
    async getChronicConditionById(id) {
        const condition = await this.chronicConditionModel.findOne({
            where: { id },
        });
        if (!condition) {
            throw new common_1.NotFoundException(`Chronic condition with ID ${id} not found`);
        }
        this.logInfo({
            message: 'PHI Access - Chronic Condition Retrieved',
            action: 'READ',
            entity: 'ChronicCondition',
            entityId: id,
            studentId: condition.studentId,
            timestamp: new Date().toISOString(),
        });
        return condition;
    }
    async getStudentChronicConditions(studentId, includeInactive = false) {
        const whereClause = { studentId };
        if (!includeInactive) {
            whereClause.isActive = true;
        }
        const conditions = await this.chronicConditionModel.findAll({
            where: whereClause,
            order: [
                ['status', 'ASC'],
                ['diagnosedDate', 'DESC'],
            ],
        });
        if (conditions.length > 0) {
            this.logInfo({
                message: 'PHI Access - Student Chronic Conditions Retrieved',
                action: 'READ',
                entity: 'ChronicCondition',
                studentId,
                count: conditions.length,
                includeInactive,
                timestamp: new Date().toISOString(),
            });
        }
        return conditions;
    }
    async updateChronicCondition(id, dto) {
        const condition = await this.getChronicConditionById(id);
        const oldValues = {
            condition: condition.condition,
            status: condition.status,
            carePlan: condition.carePlan,
        };
        const updateData = { ...dto };
        if (dto.diagnosedDate) {
            updateData.diagnosedDate = new Date(dto.diagnosedDate);
        }
        if (dto.lastReviewDate) {
            updateData.lastReviewDate = new Date(dto.lastReviewDate);
        }
        if (dto.nextReviewDate) {
            updateData.nextReviewDate = new Date(dto.nextReviewDate);
        }
        await condition.update(updateData);
        const updatedCondition = await condition.reload();
        this.logInfo({
            message: 'PHI Access - Chronic Condition Updated',
            action: 'UPDATE',
            entity: 'ChronicCondition',
            entityId: id,
            studentId: condition.studentId,
            changes: {
                old: oldValues,
                new: {
                    condition: updatedCondition.condition,
                    status: updatedCondition.status,
                    carePlan: updatedCondition.carePlan,
                },
            },
            timestamp: new Date().toISOString(),
        });
        this.logInfo(`Chronic condition updated: ${updatedCondition.condition} for student ${updatedCondition.studentId}`);
        return updatedCondition;
    }
    async deactivateChronicCondition(id) {
        const condition = await this.getChronicConditionById(id);
        await condition.update({
            status: models_1.ConditionStatus.RESOLVED,
            isActive: false,
        });
        this.logInfo({
            message: 'PHI Access - Chronic Condition Deactivated',
            action: 'UPDATE',
            entity: 'ChronicCondition',
            entityId: id,
            studentId: condition.studentId,
            condition: condition.condition,
            timestamp: new Date().toISOString(),
        });
        this.logInfo(`Chronic condition deactivated: ${condition.condition} for student ${condition.studentId}`);
        return { success: true };
    }
    async deleteChronicCondition(id) {
        const condition = await this.getChronicConditionById(id);
        const auditData = {
            condition: condition.condition,
            studentId: condition.studentId,
        };
        await condition.destroy();
        this.logWarning({
            message: 'PHI Access - Chronic Condition Permanently Deleted',
            action: 'DELETE',
            entity: 'ChronicCondition',
            entityId: id,
            ...auditData,
            timestamp: new Date().toISOString(),
        });
        this.logWarning(`Chronic condition permanently deleted: ${auditData.condition} for student ${auditData.studentId}`);
        return { success: true };
    }
    async searchChronicConditions(filters, pagination) {
        const { page = 1, limit = 20 } = pagination;
        const offset = (page - 1) * limit;
        const where = {};
        if (filters.studentId) {
            where.studentId = filters.studentId;
        }
        if (filters.status) {
            where.status = filters.status;
        }
        if (filters.requiresIEP !== undefined) {
            where.requiresIEP = filters.requiresIEP;
        }
        if (filters.requires504 !== undefined) {
            where.requires504 = filters.requires504;
        }
        if (filters.isActive !== undefined) {
            where.isActive = filters.isActive;
        }
        if (filters.reviewDueSoon) {
            const thirtyDaysFromNow = new Date();
            thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
            where.nextReviewDate = {
                [sequelize_2.Op.between]: [new Date(), thirtyDaysFromNow],
            };
        }
        if (filters.searchTerm) {
            where[sequelize_2.Op.or] = [
                { condition: { [sequelize_2.Op.iLike]: `%${filters.searchTerm}%` } },
                { icdCode: { [sequelize_2.Op.iLike]: `%${filters.searchTerm}%` } },
                { notes: { [sequelize_2.Op.iLike]: `%${filters.searchTerm}%` } },
                { carePlan: { [sequelize_2.Op.iLike]: `%${filters.searchTerm}%` } },
            ];
        }
        const { count: total, rows: conditions } = await this.chronicConditionModel.findAndCountAll({
            where,
            order: [
                ['status', 'ASC'],
                ['nextReviewDate', 'ASC'],
                ['diagnosedDate', 'DESC'],
            ],
            offset,
            limit,
        });
        this.logInfo({
            message: 'PHI Access - Chronic Conditions Searched',
            action: 'READ',
            entity: 'ChronicCondition',
            filters,
            resultCount: conditions.length,
            timestamp: new Date().toISOString(),
        });
        return {
            conditions,
            total,
            page,
            pages: Math.ceil(total / limit),
        };
    }
    async getConditionsRequiringReview(daysAhead = 30) {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + daysAhead);
        const conditions = await this.chronicConditionModel.findAll({
            where: {
                isActive: true,
                nextReviewDate: {
                    [sequelize_2.Op.between]: [new Date(), futureDate],
                },
            },
            order: [['nextReviewDate', 'ASC']],
        });
        this.logInfo(`Found ${conditions.length} conditions requiring review within ${daysAhead} days`);
        return conditions;
    }
    async getConditionsRequiringAccommodations(type = models_1.AccommodationType.BOTH) {
        const where = { isActive: true };
        if (type === models_1.AccommodationType.IEP) {
            where.requiresIEP = true;
        }
        else if (type === models_1.AccommodationType.PLAN_504) {
            where.requires504 = true;
        }
        else {
            where[sequelize_2.Op.or] = [{ requiresIEP: true }, { requires504: true }];
        }
        const conditions = await this.chronicConditionModel.findAll({
            where,
            order: [['condition', 'ASC']],
        });
        this.logInfo(`Found ${conditions.length} conditions requiring ${type} accommodations`);
        return conditions;
    }
    async getChronicConditionStatistics(filters) {
        const baseWhere = { isActive: true };
        if (filters?.studentId) {
            baseWhere.studentId = filters.studentId;
        }
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        const total = await this.chronicConditionModel.count({
            where: baseWhere,
        });
        const byStatusRaw = await this.chronicConditionModel.sequelize.query(`SELECT status, COUNT(*) as count FROM chronic_conditions WHERE is_active = true ${filters?.studentId ? 'AND student_id = $studentId' : ''} GROUP BY status`, {
            type: 'SELECT',
            bind: filters?.studentId ? { studentId: filters.studentId } : {},
        });
        const byStatus = byStatusRaw[0].reduce((acc, item) => {
            acc[item.status] = parseInt(item.count, 10);
            return acc;
        }, {});
        const requiresIEP = await this.chronicConditionModel.count({
            where: { ...baseWhere, requiresIEP: true },
        });
        const requires504 = await this.chronicConditionModel.count({
            where: { ...baseWhere, requires504: true },
        });
        const reviewDueSoon = await this.chronicConditionModel.count({
            where: {
                ...baseWhere,
                nextReviewDate: {
                    [sequelize_2.Op.between]: [new Date(), thirtyDaysFromNow],
                },
            },
        });
        const activeConditions = await this.chronicConditionModel.count({
            where: { ...baseWhere, status: models_1.ConditionStatus.ACTIVE },
        });
        const statistics = {
            total,
            byStatus,
            requiresIEP,
            requires504,
            reviewDueSoon,
            activeConditions,
        };
        this.logInfo('Chronic condition statistics retrieved');
        return statistics;
    }
    async updateCarePlan(id, carePlan) {
        return this.updateChronicCondition(id, {
            carePlan,
            lastReviewDate: new Date().toISOString(),
        });
    }
    async bulkCreateChronicConditions(conditionsData) {
        try {
            const conditions = conditionsData.map((dto) => ({
                ...dto,
                diagnosedDate: new Date(dto.diagnosedDate),
                lastReviewDate: dto.lastReviewDate
                    ? new Date(dto.lastReviewDate)
                    : null,
                nextReviewDate: dto.nextReviewDate
                    ? new Date(dto.nextReviewDate)
                    : null,
                medications: dto.medications || [],
                restrictions: dto.restrictions || [],
                triggers: dto.triggers || [],
                accommodations: dto.accommodations || [],
                isActive: true,
            }));
            const savedConditions = await this.chronicConditionModel.bulkCreate(conditions);
            this.logInfo({
                message: 'PHI Access - Chronic Conditions Bulk Created',
                action: 'CREATE',
                entity: 'ChronicCondition',
                count: savedConditions.length,
                studentIds: [...new Set(conditionsData.map((c) => c.studentId))],
                timestamp: new Date().toISOString(),
            });
            this.logInfo(`Bulk created ${savedConditions.length} chronic condition records`);
            return savedConditions;
        }
        catch (error) {
            this.logError('Error bulk creating chronic conditions:', error);
            throw error;
        }
    }
    async findByIds(ids) {
        try {
            const conditions = await this.chronicConditionModel.findAll({
                where: {
                    id: { [sequelize_2.Op.in]: ids },
                },
            });
            const conditionMap = new Map(conditions.map((c) => [c.id, c]));
            return ids.map((id) => conditionMap.get(id) || null);
        }
        catch (error) {
            this.logError(`Failed to batch fetch chronic conditions: ${error.message}`);
            throw new Error('Failed to batch fetch chronic conditions');
        }
    }
    async findByStudentIds(studentIds) {
        try {
            const conditions = await this.chronicConditionModel.findAll({
                where: {
                    studentId: { [sequelize_2.Op.in]: studentIds },
                    isActive: true,
                },
                order: [
                    ['status', 'ASC'],
                    ['diagnosedDate', 'DESC'],
                ],
            });
            const grouped = new Map();
            for (const condition of conditions) {
                if (!grouped.has(condition.studentId)) {
                    grouped.set(condition.studentId, []);
                }
                grouped.get(condition.studentId).push(condition);
            }
            return studentIds.map((id) => grouped.get(id) || []);
        }
        catch (error) {
            this.logError(`Failed to batch fetch chronic conditions by student IDs: ${error.message}`);
            throw new Error('Failed to batch fetch chronic conditions by student IDs');
        }
    }
};
exports.ChronicConditionService = ChronicConditionService;
exports.ChronicConditionService = ChronicConditionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.ChronicCondition)),
    __metadata("design:paramtypes", [Object])
], ChronicConditionService);
//# sourceMappingURL=chronic-condition.service.js.map