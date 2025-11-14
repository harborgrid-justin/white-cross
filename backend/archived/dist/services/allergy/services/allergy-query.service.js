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
exports.AllergyQueryService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const allergy_model_1 = require("../models/allergy.model");
const models_1 = require("../../../database/models");
const enums_1 = require("../../../common/enums");
const base_1 = require("../../../common/base");
let AllergyQueryService = class AllergyQueryService extends base_1.BaseService {
    allergyModel;
    constructor(allergyModel) {
        super("AllergyQueryService");
        this.allergyModel = allergyModel;
    }
    async getStudentAllergies(studentId, includeInactive = false) {
        const whereClause = { studentId };
        if (!includeInactive) {
            whereClause.isActive = true;
        }
        const allergies = await this.allergyModel.findAll({
            where: whereClause,
            include: [{ model: models_1.Student, as: 'student' }],
            order: [
                ['severity', 'DESC'],
                ['verified', 'DESC'],
                ['createdAt', 'DESC'],
            ],
        });
        if (allergies.length > 0) {
            this.logInfo(`Student allergies accessed: Student ${studentId}, Count: ${allergies.length}, ` +
                `IncludeInactive: ${includeInactive}`);
        }
        return allergies;
    }
    async searchAllergies(filters, pagination) {
        const { page = 1, limit = 20 } = pagination;
        const offset = (page - 1) * limit;
        const whereClause = {};
        if (filters.studentId) {
            whereClause.studentId = filters.studentId;
        }
        if (filters.severity) {
            whereClause.severity = filters.severity;
        }
        if (filters.allergenType) {
            whereClause.allergenType = filters.allergenType;
        }
        if (filters.verified !== undefined) {
            whereClause.verified = filters.verified;
        }
        if (filters.isActive !== undefined) {
            whereClause.isActive = filters.isActive;
        }
        if (filters.searchTerm) {
            const searchPattern = `%${filters.searchTerm}%`;
            whereClause[sequelize_2.Op.or] = [
                { allergen: { [sequelize_2.Op.iLike]: searchPattern } },
                { reaction: { [sequelize_2.Op.iLike]: searchPattern } },
                { treatment: { [sequelize_2.Op.iLike]: searchPattern } },
                { notes: { [sequelize_2.Op.iLike]: searchPattern } },
            ];
        }
        const { rows: allergies, count: total } = await this.allergyModel.findAndCountAll({
            where: whereClause,
            include: [{ model: models_1.Student, as: 'student' }],
            offset,
            limit,
            order: [
                ['severity', 'DESC'],
                ['createdAt', 'DESC'],
            ],
        });
        this.logInfo(`Allergy search: Filters: ${JSON.stringify(filters)}, Results: ${allergies.length}`);
        return {
            allergies,
            total,
            page,
            pages: Math.ceil(total / limit),
        };
    }
    async getCriticalAllergies(studentId) {
        const allergies = await this.allergyModel.findAll({
            where: {
                studentId,
                severity: {
                    [sequelize_2.Op.in]: [enums_1.AllergySeverity.SEVERE, enums_1.AllergySeverity.LIFE_THREATENING],
                },
                isActive: true,
            },
            include: [{ model: models_1.Student, as: 'student' }],
            order: [
                ['severity', 'DESC'],
            ],
        });
        if (allergies.length > 0) {
            this.logWarning(`Critical allergies accessed: Student ${studentId}, Count: ${allergies.length}, ` +
                `Severities: ${allergies.map((a) => a.severity).join(', ')}`);
        }
        return allergies;
    }
    async getAllergyStatistics(filters) {
        const whereClause = { isActive: true };
        if (filters?.studentId) {
            whereClause.studentId = filters.studentId;
        }
        const total = await this.allergyModel.count({ where: whereClause });
        const bySeverityRaw = await this.allergyModel.findAll({
            where: whereClause,
            attributes: [
                'severity',
                [
                    this.allergyModel.sequelize.fn('COUNT', this.allergyModel.sequelize.col('id')),
                    'count',
                ],
            ],
            group: ['severity'],
            raw: true,
        });
        const bySeverity = bySeverityRaw.reduce((acc, item) => {
            acc[item.severity] = parseInt(item.count, 10);
            return acc;
        }, {});
        const byTypeRaw = await this.allergyModel.findAll({
            where: {
                ...whereClause,
                allergenType: { [sequelize_2.Op.ne]: null },
            },
            attributes: [
                'allergenType',
                [
                    this.allergyModel.sequelize.fn('COUNT', this.allergyModel.sequelize.col('id')),
                    'count',
                ],
            ],
            group: ['allergenType'],
            raw: true,
        });
        const byType = byTypeRaw.reduce((acc, item) => {
            if (item.allergenType) {
                acc[item.allergenType] = parseInt(item.count, 10);
            }
            return acc;
        }, {});
        const verified = await this.allergyModel.count({
            where: { ...whereClause, verified: true },
        });
        const critical = await this.allergyModel.count({
            where: {
                ...whereClause,
                severity: {
                    [sequelize_2.Op.in]: [enums_1.AllergySeverity.SEVERE, enums_1.AllergySeverity.LIFE_THREATENING],
                },
            },
        });
        const statistics = {
            total,
            bySeverity,
            byType,
            verified,
            unverified: total - verified,
            critical,
        };
        this.logInfo(`Allergy statistics retrieved: ${JSON.stringify(statistics)}`);
        return statistics;
    }
};
exports.AllergyQueryService = AllergyQueryService;
exports.AllergyQueryService = AllergyQueryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(allergy_model_1.Allergy)),
    __metadata("design:paramtypes", [Object])
], AllergyQueryService);
//# sourceMappingURL=allergy-query.service.js.map