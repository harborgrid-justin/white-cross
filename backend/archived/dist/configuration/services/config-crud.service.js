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
exports.ConfigCrudService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const models_1 = require("../../database/models");
const base_1 = require("../../common/base");
let ConfigCrudService = class ConfigCrudService extends base_1.BaseService {
    configModel;
    constructor(configModel) {
        super("ConfigCrudService");
        this.configModel = configModel;
    }
    async getConfigByKey(key, scopeId) {
        try {
            const whereClause = { key };
            if (scopeId) {
                whereClause.scopeId = scopeId;
            }
            const configs = await this.configModel.findAll({
                where: whereClause,
                order: [
                    ['scope', 'DESC'],
                    ['createdAt', 'DESC'],
                ],
            });
            const config = configs[0];
            if (!config) {
                throw new common_1.NotFoundException(`Configuration not found: ${key}`);
            }
            return config;
        }
        catch (error) {
            this.logError(`Error fetching configuration ${key}:`, error);
            throw error;
        }
    }
    async getConfigurations(filter = {}) {
        try {
            const { category, subCategory, scope, scopeId, tags, isPublic, isEditable, } = filter;
            const where = {};
            if (category) {
                where.category = category;
            }
            if (subCategory) {
                where.subCategory = subCategory;
            }
            if (scope) {
                where.scope = scope;
            }
            if (scopeId) {
                where.scopeId = scopeId;
            }
            if (tags && tags.length > 0) {
                where.tags = { [sequelize_2.Op.overlap]: tags };
            }
            if (isPublic !== undefined) {
                where.isPublic = isPublic;
            }
            if (isEditable !== undefined) {
                where.isEditable = isEditable;
            }
            const configs = await this.configModel.findAll({
                where,
                order: [
                    ['sortOrder', 'ASC'],
                    ['category', 'ASC'],
                    ['subCategory', 'ASC'],
                    ['key', 'ASC'],
                ],
            });
            return configs;
        }
        catch (error) {
            this.logError('Error fetching configurations:', error);
            throw error;
        }
    }
    async getConfigsByCategory(category, scopeId) {
        return this.getConfigurations({ category, scopeId });
    }
    async getPublicConfigurations() {
        return this.getConfigurations({ isPublic: true });
    }
    async createConfiguration(data) {
        try {
            const existing = await this.configModel.findOne({
                where: { key: data.key },
            });
            if (existing) {
                throw new common_1.BadRequestException(`Configuration with key '${data.key}' already exists`);
            }
            const config = await this.configModel.create({
                key: data.key,
                value: data.value,
                valueType: data.valueType,
                category: data.category,
                subCategory: data.subCategory,
                description: data.description,
                defaultValue: data.defaultValue,
                validValues: data.validValues,
                minValue: data.minValue,
                maxValue: data.maxValue,
                isPublic: data.isPublic !== undefined ? data.isPublic : false,
                isEditable: data.isEditable !== undefined ? data.isEditable : true,
                requiresRestart: data.requiresRestart !== undefined ? data.requiresRestart : false,
                scope: data.scope || models_1.ConfigScope.SYSTEM,
                scopeId: data.scopeId,
                tags: data.tags,
                sortOrder: data.sortOrder !== undefined ? data.sortOrder : 0,
            });
            this.logInfo(`Configuration created: ${data.key} in category ${data.category}`);
            return config;
        }
        catch (error) {
            this.logError('Error creating configuration:', error);
            throw error;
        }
    }
    async deleteConfiguration(key, scopeId) {
        try {
            const config = await this.getConfigByKey(key, scopeId);
            await config.destroy();
            this.logInfo(`Configuration deleted: ${key}`);
        }
        catch (error) {
            this.logError(`Error deleting configuration ${key}:`, error);
            throw error;
        }
    }
    async getConfigsRequiringRestart() {
        try {
            const configs = await this.configModel.findAll({
                where: { requiresRestart: true },
                order: [
                    ['category', 'ASC'],
                    ['key', 'ASC'],
                ],
            });
            return configs;
        }
        catch (error) {
            this.logError('Error fetching configs requiring restart:', error);
            throw error;
        }
    }
    async updateConfigAttributes(config, updateData, transaction) {
        return config.update(updateData, { transaction });
    }
    async findConfigById(id) {
        return this.configModel.findOne({ where: { id } });
    }
    async configKeyExists(key) {
        const count = await this.configModel.count({ where: { key } });
        return count > 0;
    }
};
exports.ConfigCrudService = ConfigCrudService;
exports.ConfigCrudService = ConfigCrudService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.SystemConfig)),
    __metadata("design:paramtypes", [Object])
], ConfigCrudService);
//# sourceMappingURL=config-crud.service.js.map