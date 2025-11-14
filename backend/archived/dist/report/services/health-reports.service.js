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
exports.HealthReportsService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const models_1 = require("../../database/models");
const models_2 = require("../../database/models");
const models_3 = require("../../database/models");
const base_1 = require("../../common/base");
let HealthReportsService = class HealthReportsService extends base_1.BaseService {
    healthRecordModel;
    chronicConditionModel;
    allergyModel;
    sequelize;
    constructor(healthRecordModel, chronicConditionModel, allergyModel, sequelize) {
        super("HealthReportsService");
        this.healthRecordModel = healthRecordModel;
        this.chronicConditionModel = chronicConditionModel;
        this.allergyModel = allergyModel;
        this.sequelize = sequelize;
    }
    async getHealthTrends(dto) {
        try {
            const { startDate, endDate, recordType } = dto;
            const whereClause = {};
            if (startDate || endDate) {
                whereClause.createdAt = {};
                if (startDate && endDate) {
                    whereClause.createdAt = { [sequelize_2.Op.between]: [startDate, endDate] };
                }
                else if (startDate) {
                    whereClause.createdAt = { [sequelize_2.Op.gte]: startDate };
                }
                else if (endDate) {
                    whereClause.createdAt = { [sequelize_2.Op.lte]: endDate };
                }
            }
            if (recordType) {
                whereClause.type = recordType;
            }
            const healthRecordsRaw = await this.healthRecordModel.findAll({
                where: whereClause,
                attributes: ['type', [(0, sequelize_2.fn)('COUNT', (0, sequelize_2.col)('id')), 'count']],
                group: ['type'],
                raw: true,
            });
            const healthRecords = healthRecordsRaw.map((record) => ({
                type: record.type,
                count: parseInt(record.count, 10),
            }));
            const chronicConditionsRaw = await this.chronicConditionModel.findAll({
                attributes: ['condition', [(0, sequelize_2.fn)('COUNT', (0, sequelize_2.col)('id')), 'count']],
                group: ['condition'],
                order: [[(0, sequelize_2.literal)('count'), 'DESC']],
                limit: 10,
                raw: true,
            });
            const chronicConditions = chronicConditionsRaw.map((record) => ({
                condition: record.condition,
                count: parseInt(record.count, 10),
            }));
            const allergiesRaw = await this.allergyModel.findAll({
                attributes: ['allergen', 'severity', [(0, sequelize_2.fn)('COUNT', (0, sequelize_2.col)('id')), 'count']],
                group: ['allergen', 'severity'],
                order: [[(0, sequelize_2.literal)('count'), 'DESC']],
                limit: 10,
                raw: true,
            });
            const allergies = allergiesRaw.map((record) => ({
                allergen: record.allergen,
                severity: record.severity,
                count: parseInt(record.count, 10),
            }));
            const defaultStartDate = startDate || new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
            const defaultEndDate = endDate || new Date();
            const monthlyTrendsRaw = await this.sequelize.query(`SELECT
          DATE_TRUNC('month', "createdAt") as month,
          type,
          COUNT(*)::integer as count
        FROM health_records
        WHERE "createdAt" >= $1
          AND "createdAt" <= $2
        GROUP BY month, type
        ORDER BY month DESC`, {
                bind: [defaultStartDate, defaultEndDate],
                type: sequelize_2.QueryTypes.SELECT,
            });
            const monthlyTrends = monthlyTrendsRaw.map((record) => ({
                month: new Date(record.month),
                type: record.type,
                count: parseInt(String(record.count), 10),
            }));
            this.logInfo(`Health trends report generated: ${healthRecords.length} record types, ${chronicConditions.length} conditions, ${allergies.length} allergens`);
            return {
                healthRecords,
                chronicConditions,
                allergies,
                monthlyTrends,
            };
        }
        catch (error) {
            this.logError('Error getting health trends:', error);
            throw error;
        }
    }
};
exports.HealthReportsService = HealthReportsService;
exports.HealthReportsService = HealthReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.HealthRecord)),
    __param(1, (0, sequelize_1.InjectModel)(models_2.ChronicCondition)),
    __param(2, (0, sequelize_1.InjectModel)(models_3.Allergy)),
    __param(3, (0, sequelize_1.InjectConnection)()),
    __metadata("design:paramtypes", [Object, Object, Object, sequelize_2.Sequelize])
], HealthReportsService);
//# sourceMappingURL=health-reports.service.js.map