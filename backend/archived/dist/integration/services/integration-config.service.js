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
exports.IntegrationConfigService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const models_1 = require("../../database/models");
const models_2 = require("../../database/models");
const integration_validation_service_1 = require("./integration-validation.service");
const integration_encryption_service_1 = require("./integration-encryption.service");
const integration_log_service_1 = require("./integration-log.service");
const base_1 = require("../../common/base");
let IntegrationConfigService = class IntegrationConfigService extends base_1.BaseService {
    configModel;
    validationService;
    encryptionService;
    logService;
    constructor(configModel, validationService, encryptionService, logService) {
        super("IntegrationConfigService");
        this.configModel = configModel;
        this.validationService = validationService;
        this.encryptionService = encryptionService;
        this.logService = logService;
    }
    async findAll(type) {
        try {
            const whereClause = {};
            if (type) {
                whereClause.type = type;
            }
            const integrations = await this.configModel.findAll({
                where: whereClause,
                include: [
                    {
                        model: models_2.IntegrationLog,
                        as: 'logs',
                        limit: 5,
                        order: [['createdAt', 'DESC']],
                    },
                ],
                order: [
                    ['type', 'ASC'],
                    ['name', 'ASC'],
                ],
            });
            return integrations.map((integration) => this.maskSensitiveData(integration));
        }
        catch (error) {
            this.logError('Error fetching integrations', error);
            throw error;
        }
    }
    async findById(id, includeSensitive = false) {
        try {
            const integration = await this.configModel.findByPk(id, {
                include: [
                    {
                        model: models_2.IntegrationLog,
                        as: 'logs',
                    },
                ],
            });
            if (!integration) {
                throw new common_1.NotFoundException(`Integration with ID ${id} not found`);
            }
            if (!includeSensitive) {
                return this.maskSensitiveData(integration);
            }
            return integration;
        }
        catch (error) {
            this.logError(`Error fetching integration ${id}`, error);
            throw error;
        }
    }
    async create(data) {
        try {
            this.validationService.validateIntegrationData(data);
            const existingIntegration = await this.configModel.findOne({
                where: { name: data.name },
            });
            if (existingIntegration) {
                throw new common_1.BadRequestException(`Integration with name "${data.name}" already exists`);
            }
            if (data.endpoint) {
                this.validationService.validateEndpointUrl(data.endpoint);
            }
            this.validationService.validateAuthenticationCredentials(data);
            if (data.settings) {
                this.validationService.validateIntegrationSettings(data.settings, data.type);
            }
            const encryptedData = this.encryptionService.encryptSensitiveData({
                apiKey: data.apiKey,
                password: data.password,
            });
            const integration = await this.configModel.create({
                ...data,
                apiKey: encryptedData.apiKey,
                password: encryptedData.password,
                status: models_1.IntegrationStatus.INACTIVE,
                isActive: true,
            });
            this.logInfo(`Integration created: ${data.name} (${data.type})`);
            await this.logService.create({
                integrationId: integration.id,
                integrationType: data.type,
                action: 'create',
                status: 'success',
                details: {
                    message: 'Integration configuration created',
                },
            });
            return this.maskSensitiveData(integration);
        }
        catch (error) {
            this.logError('Error creating integration', error);
            throw error;
        }
    }
    async update(id, data) {
        try {
            const existing = await this.findById(id, true);
            if (data.name && data.name !== existing.name) {
                const duplicate = await this.configModel.findOne({
                    where: { name: data.name },
                });
                if (duplicate) {
                    throw new common_1.BadRequestException(`Integration with name "${data.name}" already exists`);
                }
            }
            if (data.endpoint) {
                this.validationService.validateEndpointUrl(data.endpoint);
            }
            if (data.apiKey || data.username || data.password) {
                this.validationService.validateAuthenticationCredentials({
                    ...existing,
                    ...data,
                });
            }
            if (data.settings) {
                this.validationService.validateIntegrationSettings(data.settings, existing.type);
            }
            if (data.syncFrequency !== undefined) {
                this.validationService.validateSyncFrequency(data.syncFrequency);
            }
            const updateData = { ...data };
            if (data.apiKey) {
                updateData.apiKey = this.encryptionService.encryptCredential(data.apiKey);
            }
            if (data.password) {
                updateData.password = this.encryptionService.encryptCredential(data.password);
            }
            await this.configModel.update(updateData, { where: { id } });
            const updated = await this.findById(id, false);
            this.logInfo(`Integration updated: ${updated.name} (${updated.type})`);
            await this.logService.create({
                integrationId: id,
                integrationType: updated.type,
                action: 'update',
                status: 'success',
                details: {
                    message: 'Integration configuration updated',
                    updatedFields: Object.keys(data),
                },
            });
            return updated;
        }
        catch (error) {
            this.logError(`Error updating integration ${id}`, error);
            throw error;
        }
    }
    async delete(id) {
        try {
            const integration = await this.findById(id, false);
            await this.configModel.destroy({ where: { id } });
            this.logInfo(`Integration deleted: ${integration.name} (${integration.type})`);
        }
        catch (error) {
            this.logError(`Error deleting integration ${id}`, error);
            throw error;
        }
    }
    maskSensitiveData(integration) {
        const plainIntegration = integration.get({ plain: true });
        return {
            ...plainIntegration,
            apiKey: plainIntegration.apiKey ? '***MASKED***' : null,
            password: plainIntegration.password ? '***MASKED***' : null,
        };
    }
};
exports.IntegrationConfigService = IntegrationConfigService;
exports.IntegrationConfigService = IntegrationConfigService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.IntegrationConfig)),
    __metadata("design:paramtypes", [Object, integration_validation_service_1.IntegrationValidationService,
        integration_encryption_service_1.IntegrationEncryptionService,
        integration_log_service_1.IntegrationLogService])
], IntegrationConfigService);
//# sourceMappingURL=integration-config.service.js.map