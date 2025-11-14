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
exports.ConfigurationService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const request_context_service_1 = require("../../../common/context/request-context.service");
const base_1 = require("../../../common/base");
const models_1 = require("../../../database/models");
const models_2 = require("../../../database/models");
let ConfigurationService = class ConfigurationService extends base_1.BaseService {
    requestContext;
    configModel;
    historyModel;
    sequelize;
    constructor(requestContext, configModel, historyModel, sequelize) {
        super("ConfigurationService");
        this.requestContext = requestContext;
        this.configModel = configModel;
        this.historyModel = historyModel;
        this.sequelize = sequelize;
    }
    async getConfiguration(key) {
        try {
            const config = await this.configModel.findOne({ where: { key } });
            if (!config) {
                throw new common_1.NotFoundException(`Configuration with key '${key}' not found`);
            }
            return config;
        }
        catch (error) {
            this.logger.error(`Error fetching configuration ${key}:`, error);
            throw error;
        }
    }
    async getAllConfigurations(category) {
        try {
            const whereClause = {};
            if (category) {
                whereClause.category = category;
            }
            const configs = await this.configModel.findAll({
                where: whereClause,
                order: [
                    ['category', 'ASC'],
                    ['sortOrder', 'ASC'],
                    ['key', 'ASC'],
                ],
            });
            return configs;
        }
        catch (error) {
            this.logger.error('Error fetching configurations:', error);
            throw error;
        }
    }
    async setConfiguration(data, changedBy) {
        const transaction = await this.sequelize.transaction();
        try {
            const existingConfig = await this.configModel.findOne({
                where: { key: data.key },
                transaction,
            });
            let config;
            const oldValue = existingConfig?.value;
            if (existingConfig) {
                await existingConfig.update(data, { transaction });
                config = existingConfig;
            }
            else {
                config = await this.configModel.create(data, { transaction });
            }
            if (changedBy && config.id) {
                await this.historyModel.create({
                    configKey: data.key,
                    oldValue,
                    newValue: data.value,
                    changedBy,
                    configurationId: config.id,
                }, { transaction });
            }
            await transaction.commit();
            this.logger.log(`Configuration set: ${data.key} = ${data.value}`);
            return config;
        }
        catch (error) {
            await transaction.rollback();
            this.logger.error('Error setting configuration:', error);
            throw error;
        }
    }
    async deleteConfiguration(key) {
        try {
            const config = await this.configModel.findOne({ where: { key } });
            if (!config) {
                throw new common_1.NotFoundException(`Configuration with key '${key}' not found`);
            }
            await config.destroy();
            this.logger.log(`Configuration deleted: ${key}`);
        }
        catch (error) {
            this.logger.error(`Error deleting configuration ${key}:`, error);
            throw error;
        }
    }
    async getConfigurationHistory(configKey, limit = 50) {
        try {
            return await this.historyModel.findAll({
                where: { configKey },
                limit,
                order: [['createdAt', 'DESC']],
            });
        }
        catch (error) {
            this.logger.error(`Error fetching configuration history:`, error);
            throw error;
        }
    }
    async getSystemSettings() {
        try {
            const configs = await this.getAllConfigurations();
            const groupedSettings = {};
            configs.forEach((config) => {
                if (!groupedSettings[config.category]) {
                    groupedSettings[config.category] = [];
                }
                groupedSettings[config.category].push({
                    key: config.key,
                    value: config.value,
                    valueType: config.valueType,
                    description: config.description,
                    isPublic: config.isPublic,
                    isEditable: config.isEditable,
                    requiresRestart: config.requiresRestart,
                    category: config.category,
                    subCategory: config.subCategory,
                    scope: config.scope,
                    tags: config.tags,
                });
            });
            return groupedSettings;
        }
        catch (error) {
            this.logger.error('Error fetching system settings:', error);
            throw error;
        }
    }
};
exports.ConfigurationService = ConfigurationService;
exports.ConfigurationService = ConfigurationService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, sequelize_1.InjectModel)(models_1.SystemConfig)),
    __param(2, (0, sequelize_1.InjectModel)(models_2.ConfigurationHistory)),
    __metadata("design:paramtypes", [request_context_service_1.RequestContextService, Object, Object, sequelize_typescript_1.Sequelize])
], ConfigurationService);
//# sourceMappingURL=configuration.service.js.map