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
exports.IncidentReadService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const database_1 = require("../../database");
const base_1 = require("../../common/base");
let IncidentReadService = class IncidentReadService extends base_1.BaseService {
    incidentReportModel;
    constructor(incidentReportModel) {
        super('IncidentReadService');
        this.incidentReportModel = incidentReportModel;
    }
    async getIncidentReports(filters) {
        const { page = 1, limit = 20, ...filterParams } = filters;
        const offset = (page - 1) * limit;
        const where = {};
        if (filterParams.studentId) {
            where.studentId = filterParams.studentId;
        }
        if (filterParams.reportedById) {
            where.reportedById = filterParams.reportedById;
        }
        if (filterParams.type) {
            where.type = filterParams.type;
        }
        if (filterParams.severity) {
            where.severity = filterParams.severity;
        }
        if (filterParams.dateFrom && filterParams.dateTo) {
            where.occurredAt = {
                [sequelize_2.Op.between]: [new Date(filterParams.dateFrom), new Date(filterParams.dateTo)],
            };
        }
        const { rows: incidents, count: total } = await this.incidentReportModel.findAndCountAll({
            where,
            include: [
                {
                    model: this.incidentReportModel.sequelize?.models.User,
                    as: 'student',
                    attributes: ['id', 'firstName', 'lastName'],
                },
                {
                    model: this.incidentReportModel.sequelize?.models.User,
                    as: 'reportedBy',
                    attributes: ['id', 'firstName', 'lastName'],
                },
            ],
            order: [['occurredAt', 'DESC']],
            limit,
            offset,
        });
        const totalPages = Math.ceil(total / limit);
        return {
            data: incidents,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1,
            },
        };
    }
    async getIncidentReportById(id) {
        this.logInfo(`Getting incident report by ID: ${id}`);
        const incident = await this.incidentReportModel.findByPk(id, {
            include: [
                {
                    model: this.incidentReportModel.sequelize?.models.User,
                    as: 'student',
                    attributes: ['id', 'firstName', 'lastName'],
                },
                {
                    model: this.incidentReportModel.sequelize?.models.User,
                    as: 'reportedBy',
                    attributes: ['id', 'firstName', 'lastName'],
                },
            ],
        });
        if (!incident) {
            throw new common_1.NotFoundException(`Incident report with ID ${id} not found`);
        }
        return incident;
    }
    async getIncidentsRequiringFollowUp() {
        this.logInfo('Getting incidents requiring follow-up');
        return this.incidentReportModel.findAll({
            where: {
                [sequelize_2.Op.or]: [{ parentNotified: false }, { followUpRequired: true }],
            },
            include: [
                {
                    model: this.incidentReportModel.sequelize?.models.User,
                    as: 'student',
                    attributes: ['id', 'firstName', 'lastName'],
                },
            ],
            order: [['occurredAt', 'DESC']],
        });
    }
    async getStudentRecentIncidents(studentId, limit = 10) {
        this.logInfo(`Getting recent incidents for student: ${studentId}`);
        return this.incidentReportModel.findAll({
            where: { studentId },
            include: [
                {
                    model: this.incidentReportModel.sequelize?.models.User,
                    as: 'reportedBy',
                    attributes: ['id', 'firstName', 'lastName'],
                },
            ],
            order: [['occurredAt', 'DESC']],
            limit,
        });
    }
};
exports.IncidentReadService = IncidentReadService;
exports.IncidentReadService = IncidentReadService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(database_1.IncidentReport)),
    __metadata("design:paramtypes", [Object])
], IncidentReadService);
//# sourceMappingURL=incident-read.service.js.map