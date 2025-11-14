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
exports.FollowUpService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const follow_up_appointment_model_1 = require("../../../database/models/follow-up-appointment.model");
const follow_up_status_enum_1 = require("../enums/follow-up-status.enum");
const base_1 = require("../../../common/base");
let FollowUpService = class FollowUpService extends base_1.BaseService {
    followUpModel;
    constructor(followUpModel) {
        super("FollowUpService");
        this.followUpModel = followUpModel;
    }
    async schedule(scheduleDto) {
        return this.followUpModel.create(scheduleDto);
    }
    async findOne(id) {
        const appointment = await this.followUpModel.findByPk(id, {
            include: ['originalVisit', 'completedVisit'],
        });
        if (!appointment)
            throw new common_1.NotFoundException(`Follow-up ${id} not found`);
        return appointment;
    }
    async findAll(filters) {
        const whereClause = {};
        if (filters.studentId)
            whereClause.studentId = filters.studentId;
        if (filters.originalVisitId)
            whereClause.originalVisitId = filters.originalVisitId;
        if (filters.status)
            whereClause.status = filters.status;
        if (filters.assignedTo)
            whereClause.assignedTo = filters.assignedTo;
        if (filters.pendingOnly) {
            whereClause.status = {
                [sequelize_2.Op.in]: [
                    follow_up_status_enum_1.FollowUpStatus.SCHEDULED,
                    follow_up_status_enum_1.FollowUpStatus.REMINDED,
                    follow_up_status_enum_1.FollowUpStatus.CONFIRMED,
                ],
            };
        }
        if (filters.upcomingOnly) {
            whereClause.scheduledDate = { [sequelize_2.Op.gt]: new Date() };
        }
        if (filters.dateFrom || filters.dateTo) {
            if (filters.dateFrom && filters.dateTo) {
                whereClause.scheduledDate = {
                    [sequelize_2.Op.between]: [filters.dateFrom, filters.dateTo],
                };
            }
            else if (filters.dateFrom) {
                whereClause.scheduledDate = { [sequelize_2.Op.gte]: filters.dateFrom };
            }
            else if (filters.dateTo) {
                whereClause.scheduledDate = { [sequelize_2.Op.lte]: filters.dateTo };
            }
        }
        const { rows: appointments, count: total } = await this.followUpModel.findAndCountAll({
            where: whereClause,
            offset: filters.offset || 0,
            limit: filters.limit || 20,
            order: [['scheduledDate', 'ASC']],
        });
        return { appointments, total };
    }
    async findByStudent(studentId, limit = 10) {
        return this.followUpModel.findAll({
            where: { studentId },
            order: [['scheduledDate', 'DESC']],
            limit,
        });
    }
    async findPending() {
        return this.followUpModel.findAll({
            where: {
                status: follow_up_status_enum_1.FollowUpStatus.SCHEDULED,
            },
            order: [['scheduledDate', 'ASC']],
        });
    }
    async update(id, updateDto) {
        const appointment = await this.findOne(id);
        Object.assign(appointment, updateDto);
        await appointment.save();
        return appointment;
    }
    async confirm(id) {
        const appointment = await this.findOne(id);
        appointment.confirm();
        await appointment.save();
        return appointment;
    }
    async complete(id, completeDto) {
        const appointment = await this.findOne(id);
        appointment.complete(completeDto.completedVisitId);
        if (completeDto.notes)
            appointment.notes = completeDto.notes;
        await appointment.save();
        return appointment;
    }
    async cancel(id, reason) {
        const appointment = await this.findOne(id);
        appointment.cancel(reason);
        await appointment.save();
        return appointment;
    }
    async remove(id) {
        const result = await this.followUpModel.destroy({ where: { id } });
        if (result === 0)
            throw new common_1.NotFoundException(`Follow-up ${id} not found`);
        this.logInfo(`Deleted follow-up ${id}`);
    }
    async findNeedingReminders(reminderHours = 24) {
        const reminderDate = new Date();
        reminderDate.setHours(reminderDate.getHours() + reminderHours);
        return this.followUpModel.findAll({
            where: {
                status: follow_up_status_enum_1.FollowUpStatus.SCHEDULED,
                reminderSent: false,
                scheduledDate: { [sequelize_2.Op.lt]: reminderDate },
            },
            order: [['scheduledDate', 'ASC']],
        });
    }
};
exports.FollowUpService = FollowUpService;
exports.FollowUpService = FollowUpService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(follow_up_appointment_model_1.FollowUpAppointment)),
    __metadata("design:paramtypes", [Object])
], FollowUpService);
//# sourceMappingURL=follow-up.service.js.map