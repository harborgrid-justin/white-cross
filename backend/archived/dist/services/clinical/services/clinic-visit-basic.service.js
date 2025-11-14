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
exports.ClinicVisitBasicService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const models_1 = require("../../../database/models");
const visit_disposition_enum_1 = require("../enums/visit-disposition.enum");
const base_1 = require("../../../common/base");
let ClinicVisitBasicService = class ClinicVisitBasicService extends base_1.BaseService {
    clinicVisitModel;
    constructor(clinicVisitModel) {
        super("ClinicVisitBasicService");
        this.clinicVisitModel = clinicVisitModel;
    }
    async checkIn(data) {
        this.logInfo(`Checking in student ${data.studentId}`);
        const activeVisit = await this.clinicVisitModel.findOne({
            where: {
                studentId: data.studentId,
                checkOutTime: null,
            },
        });
        if (activeVisit) {
            throw new common_1.ConflictException('Student already has an active clinic visit');
        }
        const visit = await this.clinicVisitModel.create({
            ...data,
            checkInTime: new Date(),
            disposition: visit_disposition_enum_1.VisitDisposition.OTHER,
        });
        return visit;
    }
    async checkOut(visitId, data) {
        this.logInfo(`Checking out visit ${visitId}`);
        const visit = await this.clinicVisitModel.findOne({
            where: { id: visitId },
        });
        if (!visit) {
            throw new common_1.NotFoundException('Visit not found');
        }
        if (visit.checkOutTime) {
            throw new common_1.BadRequestException('Visit already checked out');
        }
        await visit.update({
            ...data,
            checkOutTime: new Date(),
        });
        return visit.reload();
    }
    async getActiveVisits() {
        return this.clinicVisitModel.findAll({
            where: {
                checkOutTime: null,
            },
            order: [['checkInTime', 'ASC']],
        });
    }
    async getVisits(filters) {
        const where = {};
        if (filters.studentId) {
            where.studentId = filters.studentId;
        }
        if (filters.attendedBy) {
            where.attendedBy = filters.attendedBy;
        }
        if (filters.disposition) {
            where.disposition = filters.disposition;
        }
        if (filters.activeOnly) {
            where.checkOutTime = null;
        }
        if (filters.dateFrom || filters.dateTo) {
            if (filters.dateFrom && filters.dateTo) {
                where.checkInTime = {
                    [sequelize_2.Op.between]: [filters.dateFrom, filters.dateTo],
                };
            }
            else if (filters.dateFrom) {
                where.checkInTime = { [sequelize_2.Op.gte]: filters.dateFrom };
            }
            else if (filters.dateTo) {
                where.checkInTime = { [sequelize_2.Op.lte]: filters.dateTo };
            }
        }
        const { rows: visits, count: total } = await this.clinicVisitModel.findAndCountAll({
            where,
            offset: filters.offset || 0,
            limit: filters.limit || 20,
            order: [['checkInTime', 'DESC']],
        });
        return { visits, total };
    }
    async getVisitById(id) {
        const visit = await this.clinicVisitModel.findOne({
            where: { id },
        });
        if (!visit) {
            throw new common_1.NotFoundException('Visit not found');
        }
        return visit;
    }
    async getVisitsByStudent(studentId, limit = 10) {
        return this.clinicVisitModel.findAll({
            where: { studentId },
            order: [['checkInTime', 'DESC']],
            limit,
        });
    }
    async updateVisit(id, updates) {
        const visit = await this.getVisitById(id);
        await visit.update(updates);
        return visit.reload();
    }
    async deleteVisit(id) {
        const result = await this.clinicVisitModel.destroy({
            where: { id },
        });
        if (result === 0) {
            throw new common_1.NotFoundException(`Visit with ID ${id} not found`);
        }
        this.logInfo(`Deleted visit ${id}`);
    }
};
exports.ClinicVisitBasicService = ClinicVisitBasicService;
exports.ClinicVisitBasicService = ClinicVisitBasicService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.ClinicVisit)),
    __metadata("design:paramtypes", [Object])
], ClinicVisitBasicService);
//# sourceMappingURL=clinic-visit-basic.service.js.map