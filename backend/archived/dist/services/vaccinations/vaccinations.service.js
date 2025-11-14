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
exports.VaccinationsService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const request_context_service_1 = require("../../common/context/request-context.service");
const base_1 = require("../../common/base");
const models_1 = require("../../database/models");
const models_2 = require("../../database/models");
let VaccinationsService = class VaccinationsService extends base_1.BaseService {
    requestContext;
    studentModel;
    vaccinationModel;
    constructor(requestContext, studentModel, vaccinationModel) {
        super(requestContext);
        this.requestContext = requestContext;
        this.studentModel = studentModel;
        this.vaccinationModel = vaccinationModel;
    }
    async getVaccinationsByStatus(statuses, query = {}) {
        const { page = 1, limit = 50, studentId, vaccineType } = query;
        const offset = (page - 1) * limit;
        let vaccinations = [];
        try {
            if (statuses.includes('due') && statuses.includes('overdue')) {
                const [dueResults, overdueResults] = await Promise.all([
                    this.getDueVaccinationsInternal({ studentId, vaccineType, limit: Math.ceil(limit / 2) }),
                    this.getOverdueVaccinationsInternal({ studentId, vaccineType, limit: Math.ceil(limit / 2) })
                ]);
                vaccinations = [
                    ...dueResults.map((v) => ({ ...v, status: 'due' })),
                    ...overdueResults.map((v) => ({ ...v, status: 'overdue' }))
                ];
            }
            else if (statuses.includes('due')) {
                const results = await this.getDueVaccinationsInternal({ studentId, vaccineType, limit });
                vaccinations = results.map((v) => ({ ...v, status: 'due' }));
            }
            else if (statuses.includes('overdue')) {
                const results = await this.getOverdueVaccinationsInternal({ studentId, vaccineType, limit });
                vaccinations = results.map((v) => ({ ...v, status: 'overdue' }));
            }
            const paginatedVaccinations = vaccinations.slice(offset, offset + limit);
            return {
                vaccinations: paginatedVaccinations,
                total: vaccinations.length,
                page: Number(page),
                limit: Number(limit),
                statusFilter: statuses.join(',')
            };
        }
        catch (error) {
            console.error('Error fetching vaccinations by status:', error);
            return {
                vaccinations: [],
                total: 0,
                page: Number(page),
                limit: Number(limit),
                statusFilter: statuses.join(','),
                error: 'Failed to fetch vaccinations'
            };
        }
    }
    async getDueVaccinationsInternal(options = {}) {
        const { studentId, vaccineType, limit = 25 } = options;
        const today = new Date();
        const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
        const whereClause = {
            nextDueDate: {
                [sequelize_2.Op.gte]: today,
                [sequelize_2.Op.lte]: thirtyDaysFromNow
            },
            seriesComplete: false
        };
        if (studentId) {
            whereClause.studentId = studentId;
        }
        if (vaccineType) {
            whereClause.vaccineType = { [sequelize_2.Op.iLike]: `%${vaccineType}%` };
        }
        return await this.vaccinationModel.findAll({
            where: whereClause,
            include: [{
                    model: models_1.Student,
                    as: 'student',
                    attributes: ['id', 'firstName', 'lastName', 'dateOfBirth']
                }],
            order: [['nextDueDate', 'ASC']],
            limit
        });
    }
    async getOverdueVaccinationsInternal(options = {}) {
        const { studentId, vaccineType, limit = 25 } = options;
        const today = new Date();
        const whereClause = {
            nextDueDate: { [sequelize_2.Op.lt]: today },
            seriesComplete: false
        };
        if (studentId) {
            whereClause.studentId = studentId;
        }
        if (vaccineType) {
            whereClause.vaccineType = { [sequelize_2.Op.iLike]: `%${vaccineType}%` };
        }
        return await this.vaccinationModel.findAll({
            where: whereClause,
            include: [{
                    model: models_1.Student,
                    as: 'student',
                    attributes: ['id', 'firstName', 'lastName', 'dateOfBirth']
                }],
            order: [['nextDueDate', 'ASC']],
            limit
        });
    }
    async getDueVaccinations(query = {}) {
        return this.getVaccinationsByStatus(['due'], query);
    }
    async getOverdueVaccinations(query = {}) {
        return this.getVaccinationsByStatus(['overdue'], query);
    }
};
exports.VaccinationsService = VaccinationsService;
exports.VaccinationsService = VaccinationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, sequelize_1.InjectModel)(models_1.Student)),
    __param(2, (0, sequelize_1.InjectModel)(models_2.Vaccination)),
    __metadata("design:paramtypes", [request_context_service_1.RequestContextService, Object, Object])
], VaccinationsService);
//# sourceMappingURL=vaccinations.service.js.map