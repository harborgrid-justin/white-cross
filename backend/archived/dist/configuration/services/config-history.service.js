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
exports.ConfigHistoryService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const models_1 = require("../../database/models");
const models_2 = require("../../database/models");
const base_1 = require("../../common/base");
let ConfigHistoryService = class ConfigHistoryService extends base_1.BaseService {
    configModel;
    historyModel;
    sequelize;
    constructor(configModel, historyModel, sequelize) {
        super("ConfigHistoryService");
        this.configModel = configModel;
        this.historyModel = historyModel;
        this.sequelize = sequelize;
    }
    async createHistoryRecord(config, oldValue, newValue, updateData, transaction) {
        return this.historyModel.create({
            configurationId: config.id,
            configKey: config.key,
            oldValue,
            newValue,
            changedBy: updateData.changedBy,
            changedByName: updateData.changedByName,
            changeReason: updateData.changeReason,
            ipAddress: updateData.ipAddress,
            userAgent: updateData.userAgent,
        }, { transaction });
    }
    async getConfigHistory(key, limit = 50) {
        try {
            const history = await this.historyModel.findAll({
                where: { configKey: key },
                include: [
                    {
                        model: this.configModel,
                        as: 'configuration',
                    },
                ],
                order: [['createdAt', 'DESC']],
                limit,
            });
            return history;
        }
        catch (error) {
            this.logError(`Error fetching history for ${key}:`, error);
            throw error;
        }
    }
    async getConfigChangesByUser(userId, limit = 50) {
        try {
            const history = await this.historyModel.findAll({
                where: { changedBy: userId },
                include: [
                    {
                        model: this.configModel,
                        as: 'configuration',
                    },
                ],
                order: [['createdAt', 'DESC']],
                limit,
            });
            return history;
        }
        catch (error) {
            this.logError(`Error fetching user changes for ${userId}:`, error);
            throw error;
        }
    }
    async getRecentChanges(limit = 100) {
        try {
            const history = await this.historyModel.findAll({
                include: [
                    {
                        model: this.configModel,
                        as: 'configuration',
                    },
                ],
                order: [['createdAt', 'DESC']],
                limit,
            });
            return history;
        }
        catch (error) {
            this.logError('Error fetching recent changes:', error);
            throw error;
        }
    }
    async getConfigChangesByDateRange(startDate, endDate, limit = 100) {
        try {
            const history = await this.historyModel.findAll({
                where: {
                    createdAt: {
                        $between: [startDate, endDate],
                    },
                },
                include: [
                    {
                        model: this.configModel,
                        as: 'configuration',
                    },
                ],
                order: [['createdAt', 'DESC']],
                limit,
            });
            return history;
        }
        catch (error) {
            this.logError('Error fetching changes by date range:', error);
            throw error;
        }
    }
    async getChangeStatistics(days = 30) {
        try {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - days);
            const [totalChanges, changesByUser, changesByConfig, changesOverTime] = await Promise.all([
                this.historyModel.count({
                    where: {
                        createdAt: { $gte: cutoffDate },
                    },
                }),
                this.sequelize.query(`
          SELECT "changedBy" as "userId", COUNT(*) as count
          FROM configuration_history
          WHERE "createdAt" >= :cutoffDate
          GROUP BY "changedBy"
          ORDER BY count DESC
          LIMIT 10
          `, {
                    replacements: { cutoffDate },
                    type: this.sequelize.QueryTypes.SELECT,
                }),
                this.sequelize.query(`
          SELECT "configKey", COUNT(*) as count
          FROM configuration_history
          WHERE "createdAt" >= :cutoffDate
          GROUP BY "configKey"
          ORDER BY count DESC
          LIMIT 10
          `, {
                    replacements: { cutoffDate },
                    type: this.sequelize.QueryTypes.SELECT,
                }),
                this.sequelize.query(`
          SELECT DATE("createdAt") as date, COUNT(*) as count
          FROM configuration_history
          WHERE "createdAt" >= :cutoffDate
          GROUP BY DATE("createdAt")
          ORDER BY date ASC
          `, {
                    replacements: { cutoffDate },
                    type: this.sequelize.QueryTypes.SELECT,
                }),
            ]);
            return {
                totalChanges,
                changesByUser: changesByUser,
                changesByConfig: changesByConfig,
                changesOverTime: changesOverTime,
            };
        }
        catch (error) {
            this.logError('Error getting change statistics:', error);
            throw error;
        }
    }
    async createTransaction() {
        return this.sequelize.transaction();
    }
    async rollbackTransaction(transaction) {
        return transaction.rollback();
    }
    async commitTransaction(transaction) {
        return transaction.commit();
    }
};
exports.ConfigHistoryService = ConfigHistoryService;
exports.ConfigHistoryService = ConfigHistoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.SystemConfig)),
    __param(1, (0, sequelize_1.InjectModel)(models_2.ConfigurationHistory)),
    __param(2, (0, sequelize_1.InjectConnection)()),
    __metadata("design:paramtypes", [Object, Object, sequelize_2.Sequelize])
], ConfigHistoryService);
//# sourceMappingURL=config-history.service.js.map