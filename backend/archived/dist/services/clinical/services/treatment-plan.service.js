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
exports.TreatmentPlanService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const treatment_plan_model_1 = require("../../../database/models/treatment-plan.model");
const treatment_status_enum_1 = require("../enums/treatment-status.enum");
const base_1 = require("../../../common/base");
let TreatmentPlanService = class TreatmentPlanService extends base_1.BaseService {
    treatmentPlanModel;
    constructor(treatmentPlanModel) {
        super("TreatmentPlanService");
        this.treatmentPlanModel = treatmentPlanModel;
    }
    async create(createDto) {
        this.logInfo(`Creating treatment plan for student ${createDto.studentId}`);
        return this.treatmentPlanModel.create(createDto);
    }
    async findOne(id) {
        const plan = await this.treatmentPlanModel.findByPk(id);
        if (!plan) {
            throw new common_1.NotFoundException(`Treatment plan ${id} not found`);
        }
        return plan;
    }
    async findAll(filters) {
        const whereClause = {};
        if (filters.studentId) {
            whereClause.studentId = filters.studentId;
        }
        if (filters.status) {
            whereClause.status = filters.status;
        }
        if (filters.createdBy) {
            whereClause.createdBy = filters.createdBy;
        }
        const { rows: plans, count: total } = await this.treatmentPlanModel.findAndCountAll({
            where: whereClause,
            offset: filters.offset || 0,
            limit: filters.limit || 20,
            order: [['createdAt', 'DESC']],
        });
        return { plans, total };
    }
    async findByStudent(studentId, limit = 10) {
        return this.treatmentPlanModel.findAll({
            where: { studentId },
            order: [['createdAt', 'DESC']],
            limit,
        });
    }
    async findActiveByStudent(studentId) {
        return this.treatmentPlanModel.findAll({
            where: {
                studentId,
                status: treatment_status_enum_1.TreatmentStatus.ACTIVE,
            },
            order: [['startDate', 'DESC']],
        });
    }
    async update(id, updateDto) {
        const plan = await this.findOne(id);
        Object.assign(plan, updateDto);
        await plan.save();
        return plan;
    }
    async activate(id) {
        const plan = await this.findOne(id);
        if (plan.status === treatment_status_enum_1.TreatmentStatus.ACTIVE) {
            throw new common_1.BadRequestException('Treatment plan is already active');
        }
        plan.status = treatment_status_enum_1.TreatmentStatus.ACTIVE;
        await plan.save();
        return plan;
    }
    async complete(id) {
        const plan = await this.findOne(id);
        if (plan.status === treatment_status_enum_1.TreatmentStatus.COMPLETED) {
            throw new common_1.BadRequestException('Treatment plan is already completed');
        }
        plan.status = treatment_status_enum_1.TreatmentStatus.COMPLETED;
        plan.endDate = new Date();
        await plan.save();
        return plan;
    }
    async cancel(id) {
        const plan = await this.findOne(id);
        if (plan.status === treatment_status_enum_1.TreatmentStatus.CANCELLED) {
            throw new common_1.BadRequestException('Treatment plan is already cancelled');
        }
        plan.status = treatment_status_enum_1.TreatmentStatus.CANCELLED;
        await plan.save();
        return plan;
    }
    async remove(id) {
        const result = await this.treatmentPlanModel.destroy({ where: { id } });
        if (result === 0) {
            throw new common_1.NotFoundException(`Treatment plan ${id} not found`);
        }
        this.logInfo(`Deleted treatment plan ${id}`);
    }
};
exports.TreatmentPlanService = TreatmentPlanService;
exports.TreatmentPlanService = TreatmentPlanService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(treatment_plan_model_1.TreatmentPlan)),
    __metadata("design:paramtypes", [Object])
], TreatmentPlanService);
//# sourceMappingURL=treatment-plan.service.js.map