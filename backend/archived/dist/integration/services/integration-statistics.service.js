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
exports.IntegrationStatisticsService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const models_1 = require("../../database/models");
const models_2 = require("../../database/models");
const base_1 = require("../../common/base");
let IntegrationStatisticsService = class IntegrationStatisticsService extends base_1.BaseService {
    configModel;
    logModel;
    constructor(configModel, logModel) {
        super("IntegrationStatisticsService");
        this.configModel = configModel;
        this.logModel = logModel;
    }
    async getStatistics() {
        try {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            const [totalIntegrations, activeIntegrations, recentLogs] = await Promise.all([
                this.configModel.count(),
                this.configModel.count({
                    where: { status: models_1.IntegrationStatus.ACTIVE },
                }),
                this.logModel.findAll({
                    where: {
                        action: 'sync',
                        createdAt: { [sequelize_2.Op.gt]: thirtyDaysAgo },
                    },
                    order: [['createdAt', 'DESC']],
                    limit: 1000,
                }),
            ]);
            const totalSyncs = recentLogs.length;
            const successfulSyncs = recentLogs.filter((log) => log.status === 'success').length;
            const failedSyncs = recentLogs.filter((log) => log.status === 'failed').length;
            const successRate = totalSyncs > 0 ? (successfulSyncs / totalSyncs) * 100 : 0;
            const totalRecordsProcessed = recentLogs.reduce((sum, log) => sum + (log.recordsProcessed || 0), 0);
            const totalRecordsSucceeded = recentLogs.reduce((sum, log) => sum + (log.recordsSucceeded || 0), 0);
            const totalRecordsFailed = recentLogs.reduce((sum, log) => sum + (log.recordsFailed || 0), 0);
            const statsByType = {};
            recentLogs.forEach((log) => {
                const type = log.integrationType;
                if (type) {
                    if (!statsByType[type]) {
                        statsByType[type] = {
                            success: 0,
                            failed: 0,
                            total: 0,
                        };
                    }
                    if (log.status === 'success') {
                        statsByType[type].success++;
                    }
                    else if (log.status === 'failed') {
                        statsByType[type].failed++;
                    }
                    statsByType[type].total++;
                }
            });
            return {
                totalIntegrations,
                activeIntegrations,
                inactiveIntegrations: totalIntegrations - activeIntegrations,
                syncStatistics: {
                    totalSyncs,
                    successfulSyncs,
                    failedSyncs,
                    successRate: parseFloat(successRate.toFixed(2)),
                    totalRecordsProcessed,
                    totalRecordsSucceeded,
                    totalRecordsFailed,
                },
                statsByType,
            };
        }
        catch (error) {
            this.logError('Error fetching integration statistics', error);
            throw error;
        }
    }
};
exports.IntegrationStatisticsService = IntegrationStatisticsService;
exports.IntegrationStatisticsService = IntegrationStatisticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.IntegrationConfig)),
    __param(1, (0, sequelize_1.InjectModel)(models_2.IntegrationLog)),
    __metadata("design:paramtypes", [Object, Object])
], IntegrationStatisticsService);
//# sourceMappingURL=integration-statistics.service.js.map