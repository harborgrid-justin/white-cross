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
exports.ConfigStatisticsService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const models_1 = require("../../database/models");
const base_1 = require("../../common/base");
let ConfigStatisticsService = class ConfigStatisticsService extends base_1.BaseService {
    configModel;
    sequelize;
    constructor(configModel, sequelize) {
        super("ConfigStatisticsService");
        this.configModel = configModel;
        this.sequelize = sequelize;
    }
    async getConfigurationStatistics() {
        try {
            const [totalCount, categoryBreakdown, scopeBreakdown, publicCount, editableCount,] = await Promise.all([
                this.configModel.count(),
                this.sequelize.query('SELECT category, COUNT(*) as count FROM system_configurations GROUP BY category', { type: sequelize_2.QueryTypes.SELECT }),
                this.sequelize.query('SELECT scope, COUNT(*) as count FROM system_configurations GROUP BY scope', { type: sequelize_2.QueryTypes.SELECT }),
                this.configModel.count({ where: { isPublic: true } }),
                this.configModel.count({ where: { isEditable: true } }),
            ]);
            const statistics = {
                totalCount,
                publicCount,
                privateCount: totalCount - publicCount,
                editableCount,
                lockedCount: totalCount - editableCount,
                categoryBreakdown: categoryBreakdown.reduce((acc, curr) => {
                    acc[curr.category] = parseInt(curr.count, 10);
                    return acc;
                }, {}),
                scopeBreakdown: scopeBreakdown.reduce((acc, curr) => {
                    acc[curr.scope] = parseInt(curr.count, 10);
                    return acc;
                }, {}),
            };
            this.logInfo('Retrieved configuration statistics');
            return statistics;
        }
        catch (error) {
            this.logError('Error getting configuration statistics:', error);
            throw error;
        }
    }
    async getValueTypeBreakdown() {
        try {
            const breakdown = await this.sequelize.query('SELECT "valueType", COUNT(*) as count FROM system_configurations GROUP BY "valueType"', { type: sequelize_2.QueryTypes.SELECT });
            return breakdown.reduce((acc, curr) => {
                acc[curr.valueType] = parseInt(curr.count, 10);
                return acc;
            }, {});
        }
        catch (error) {
            this.logError('Error getting value type breakdown:', error);
            throw error;
        }
    }
    async getRestartRequiredCount() {
        try {
            return this.configModel.count({ where: { requiresRestart: true } });
        }
        catch (error) {
            this.logError('Error getting restart required count:', error);
            throw error;
        }
    }
    async getHealthMetrics() {
        try {
            const [totalConfigs, configsWithDefaults, configsWithValidation, publicConfigs, editableConfigs,] = await Promise.all([
                this.configModel.count(),
                this.configModel.count({
                    where: {
                        defaultValue: { $ne: null },
                    },
                }),
                this.configModel.count({
                    where: {
                        $or: [
                            { validValues: { $ne: null } },
                            { minValue: { $ne: null } },
                            { maxValue: { $ne: null } },
                        ],
                    },
                }),
                this.configModel.count({ where: { isPublic: true } }),
                this.configModel.count({ where: { isEditable: true } }),
            ]);
            const defaultsScore = totalConfigs > 0 ? (configsWithDefaults / totalConfigs) * 25 : 0;
            const validationScore = totalConfigs > 0 ? (configsWithValidation / totalConfigs) * 25 : 0;
            const publicScore = totalConfigs > 0 ? (publicConfigs / totalConfigs) * 25 : 0;
            const editableScore = totalConfigs > 0 ? (editableConfigs / totalConfigs) * 25 : 0;
            const healthScore = Math.round(defaultsScore + validationScore + publicScore + editableScore);
            return {
                totalConfigs,
                configsWithDefaults,
                configsWithValidation,
                publicConfigs,
                editableConfigs,
                healthScore,
            };
        }
        catch (error) {
            this.logError('Error getting health metrics:', error);
            throw error;
        }
    }
    async getConfigurationTrends(days = 30) {
        try {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - days);
            const trends = await this.sequelize.query(`
        WITH date_series AS (
          SELECT generate_series(
            date_trunc('day', :cutoffDate::timestamp),
            date_trunc('day', NOW()),
            '1 day'::interval
          )::date as date
        ),
        created_stats AS (
          SELECT 
            DATE("createdAt") as date,
            COUNT(*) as created
          FROM system_configurations
          WHERE "createdAt" >= :cutoffDate
          GROUP BY DATE("createdAt")
        ),
        updated_stats AS (
          SELECT 
            DATE("updatedAt") as date,
            COUNT(*) as updated
          FROM system_configurations
          WHERE "updatedAt" >= :cutoffDate
          GROUP BY DATE("updatedAt")
        )
        SELECT 
          ds.date::text,
          COALESCE(cs.created, 0) as created,
          COALESCE(us.updated, 0) as updated
        FROM date_series ds
        LEFT JOIN created_stats cs ON ds.date = cs.date
        LEFT JOIN updated_stats us ON ds.date = us.date
        ORDER BY ds.date ASC
        `, {
                replacements: { cutoffDate },
                type: sequelize_2.QueryTypes.SELECT,
            });
            return trends;
        }
        catch (error) {
            this.logError('Error getting configuration trends:', error);
            throw error;
        }
    }
    async getMostChangedConfigurations(limit = 10) {
        try {
            const results = await this.sequelize.query(`
        SELECT 
          sc."key",
          sc."category",
          COUNT(ch.id) as "changeCount",
          MAX(ch."createdAt") as "lastChanged"
        FROM system_configurations sc
        LEFT JOIN configuration_history ch ON sc.id = ch."configurationId"
        GROUP BY sc.id, sc."key", sc."category"
        HAVING COUNT(ch.id) > 0
        ORDER BY "changeCount" DESC, "lastChanged" DESC
        LIMIT :limit
        `, {
                replacements: { limit },
                type: sequelize_2.QueryTypes.SELECT,
            });
            return results;
        }
        catch (error) {
            this.logError('Error getting most changed configurations:', error);
            throw error;
        }
    }
    async getCategoryStats() {
        try {
            const results = await this.sequelize.query(`
        SELECT 
          category,
          COUNT(*) as "totalConfigs",
          SUM(CASE WHEN "isPublic" = true THEN 1 ELSE 0 END) as "publicConfigs",
          SUM(CASE WHEN "isEditable" = true THEN 1 ELSE 0 END) as "editableConfigs",
          SUM(CASE WHEN "defaultValue" IS NOT NULL THEN 1 ELSE 0 END) as "configsWithDefaults"
        FROM system_configurations
        GROUP BY category
        ORDER BY category ASC
        `, { type: sequelize_2.QueryTypes.SELECT });
            return results;
        }
        catch (error) {
            this.logError('Error getting category stats:', error);
            throw error;
        }
    }
    async generateSummaryReport() {
        try {
            const [overview, healthMetrics, categoryStats, mostChanged, valueTypeBreakdown,] = await Promise.all([
                this.getConfigurationStatistics(),
                this.getHealthMetrics(),
                this.getCategoryStats(),
                this.getMostChangedConfigurations(5),
                this.getValueTypeBreakdown(),
            ]);
            return {
                overview,
                healthMetrics,
                categoryStats,
                mostChanged,
                valueTypeBreakdown,
                generatedAt: new Date(),
            };
        }
        catch (error) {
            this.logError('Error generating summary report:', error);
            throw error;
        }
    }
};
exports.ConfigStatisticsService = ConfigStatisticsService;
exports.ConfigStatisticsService = ConfigStatisticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.SystemConfig)),
    __param(1, (0, sequelize_1.InjectConnection)()),
    __metadata("design:paramtypes", [Object, sequelize_2.Sequelize])
], ConfigStatisticsService);
//# sourceMappingURL=config-statistics.service.js.map