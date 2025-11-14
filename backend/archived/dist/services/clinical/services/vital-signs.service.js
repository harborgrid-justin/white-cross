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
exports.VitalSignsService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const vital_signs_model_1 = require("../../../database/models/vital-signs.model");
const base_1 = require("../../../common/base");
let VitalSignsService = class VitalSignsService extends base_1.BaseService {
    vitalsModel;
    constructor(vitalsModel) {
        super("VitalSignsService");
        this.vitalsModel = vitalsModel;
    }
    async record(recordDto) {
        const vitals = await this.vitalsModel.create(recordDto);
        return vitals;
    }
    async findOne(id) {
        const vitals = await this.vitalsModel.findByPk(id);
        if (!vitals)
            throw new common_1.NotFoundException(`Vital signs ${id} not found`);
        return vitals;
    }
    async findAll(filters) {
        const whereClause = {};
        if (filters.studentId)
            whereClause.studentId = filters.studentId;
        if (filters.recordedBy)
            whereClause.measuredBy = filters.recordedBy;
        if (filters.dateFrom || filters.dateTo) {
            if (filters.dateFrom && filters.dateTo) {
                whereClause.measurementDate = {
                    [sequelize_2.Op.between]: [filters.dateFrom, filters.dateTo],
                };
            }
            else if (filters.dateFrom) {
                whereClause.measurementDate = { [sequelize_2.Op.gte]: filters.dateFrom };
            }
            else if (filters.dateTo) {
                whereClause.measurementDate = { [sequelize_2.Op.lte]: filters.dateTo };
            }
        }
        const { rows: vitals, count: total } = await this.vitalsModel.findAndCountAll({
            where: whereClause,
            offset: filters.offset || 0,
            limit: filters.limit || 20,
            order: [['measurementDate', 'DESC']],
        });
        return { vitals, total };
    }
    async findByStudent(studentId, limit = 10) {
        return this.vitalsModel.findAll({
            where: { studentId },
            order: [['measurementDate', 'DESC']],
            limit,
        });
    }
    async getTrends(studentId, startDate, endDate) {
        return this.vitalsModel.findAll({
            where: {
                studentId,
                measurementDate: { [sequelize_2.Op.between]: [startDate, endDate] },
            },
            order: [['measurementDate', 'ASC']],
        });
    }
    async update(id, updateDto) {
        const vitals = await this.findOne(id);
        Object.assign(vitals, updateDto);
        await vitals.save();
        return vitals;
    }
    async remove(id) {
        const result = await this.vitalsModel.destroy({ where: { id } });
        if (result === 0)
            throw new common_1.NotFoundException(`Vital signs ${id} not found`);
        this.logInfo(`Deleted vital signs ${id}`);
    }
};
exports.VitalSignsService = VitalSignsService;
exports.VitalSignsService = VitalSignsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(vital_signs_model_1.VitalSigns)),
    __metadata("design:paramtypes", [Object])
], VitalSignsService);
//# sourceMappingURL=vital-signs.service.js.map