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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationService = void 0;
const common_1 = require("@nestjs/common");
const config_crud_service_1 = require("./config-crud.service");
const config_validation_service_1 = require("./config-validation.service");
const config_history_service_1 = require("./config-history.service");
const config_import_export_service_1 = require("./config-import-export.service");
const config_statistics_service_1 = require("./config-statistics.service");
const base_1 = require("../../common/base");
let ConfigurationService = class ConfigurationService extends base_1.BaseService {
    configCrudService;
    configValidationService;
    configHistoryService;
    configImportExportService;
    configStatisticsService;
    constructor(configCrudService, configValidationService, configHistoryService, configImportExportService, configStatisticsService) {
        super("ConfigurationService");
        this.configCrudService = configCrudService;
        this.configValidationService = configValidationService;
        this.configHistoryService = configHistoryService;
        this.configImportExportService = configImportExportService;
        this.configStatisticsService = configStatisticsService;
    }
    async getConfigByKey(key, scopeId) {
        return this.configCrudService.getConfigByKey(key, scopeId);
    }
    async getConfigurations(filter = {}) {
        return this.configCrudService.getConfigurations(filter);
    }
    async getConfigsByCategory(category, scopeId) {
        return this.configCrudService.getConfigsByCategory(category, scopeId);
    }
    async getPublicConfigurations() {
        return this.configCrudService.getPublicConfigurations();
    }
    validateConfigValue(config, newValue) {
        return this.configValidationService.validateConfigValue(config, newValue);
    }
    async updateConfiguration(key, updateData, scopeId) {
        const transaction = await this.configHistoryService.createTransaction();
        try {
            const config = await this.configCrudService.getConfigByKey(key, scopeId);
            const validation = this.configValidationService.validateConfigValue(config, updateData.value);
            if (!validation.isValid) {
                throw new common_1.BadRequestException(validation.error);
            }
            const oldValue = config.value;
            await this.configCrudService.updateConfigAttributes(config, {
                value: updateData.value,
                updatedAt: new Date(),
            }, transaction);
            await this.configHistoryService.createHistoryRecord(config, oldValue, updateData.value, updateData, transaction);
            await this.configHistoryService.commitTransaction(transaction);
            const updatedConfig = await this.configCrudService.findConfigById(config.id);
            if (!updatedConfig) {
                throw new common_1.NotFoundException(`Configuration ${key} not found after update`);
            }
            this.logInfo(`Configuration updated: ${key} = ${updateData.value} by ${updateData.changedBy}`);
            return updatedConfig;
        }
        catch (error) {
            await this.configHistoryService.rollbackTransaction(transaction);
            this.logError(`Error updating configuration ${key}:`, error);
            throw error;
        }
    }
    async bulkUpdateConfigurations(bulkUpdate) {
        const results = [];
        for (const update of bulkUpdate.updates) {
            try {
                const result = await this.updateConfiguration(update.key, {
                    value: update.value,
                    changedBy: bulkUpdate.changedBy,
                    changeReason: bulkUpdate.changeReason,
                }, update.scopeId);
                results.push(result);
            }
            catch (error) {
                this.logError(`Error updating ${update.key}:`, error);
                results.push({ key: update.key, error: error.message });
            }
        }
        this.logInfo(`Bulk update completed: ${results.length} configurations processed`);
        return results;
    }
    async createConfiguration(data) {
        return this.configCrudService.createConfiguration(data);
    }
    async deleteConfiguration(key, scopeId) {
        return this.configCrudService.deleteConfiguration(key, scopeId);
    }
    async resetToDefault(key, changedBy, scopeId) {
        try {
            const config = await this.configCrudService.getConfigByKey(key, scopeId);
            if (!config.defaultValue) {
                throw new common_1.BadRequestException('No default value specified for this configuration');
            }
            const result = await this.updateConfiguration(key, {
                value: config.defaultValue,
                changedBy,
                changeReason: 'Reset to default value',
            }, scopeId);
            this.logInfo(`Configuration reset to default: ${key}`);
            return result;
        }
        catch (error) {
            this.logError(`Error resetting configuration ${key}:`, error);
            throw error;
        }
    }
    async getConfigHistory(key, limit = 50) {
        return this.configHistoryService.getConfigHistory(key, limit);
    }
    async getConfigChangesByUser(userId, limit = 50) {
        return this.configHistoryService.getConfigChangesByUser(userId, limit);
    }
    async getRecentChanges(limit = 100) {
        return this.configHistoryService.getRecentChanges(limit);
    }
    async getConfigsRequiringRestart() {
        return this.configCrudService.getConfigsRequiringRestart();
    }
    async exportConfigurations(filter = {}) {
        return this.configImportExportService.exportConfigurations(filter);
    }
    async importConfigurations(importData) {
        return this.configImportExportService.importConfigurations(importData);
    }
    async getConfigurationStatistics() {
        return this.configStatisticsService.getConfigurationStatistics();
    }
    async exportConfigurationsToCSV(filter = {}) {
        return this.configImportExportService.exportConfigurationsToCSV(filter);
    }
    async createBackup(filter = {}) {
        return this.configImportExportService.createBackup(filter);
    }
    async restoreFromBackup(backupData, overwrite = false) {
        return this.configImportExportService.restoreFromBackup(backupData, overwrite);
    }
    async getHealthMetrics() {
        return this.configStatisticsService.getHealthMetrics();
    }
    async generateSummaryReport() {
        return this.configStatisticsService.generateSummaryReport();
    }
};
exports.ConfigurationService = ConfigurationService;
exports.ConfigurationService = ConfigurationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_crud_service_1.ConfigCrudService,
        config_validation_service_1.ConfigValidationService,
        config_history_service_1.ConfigHistoryService,
        config_import_export_service_1.ConfigImportExportService,
        config_statistics_service_1.ConfigStatisticsService])
], ConfigurationService);
//# sourceMappingURL=configuration.service.js.map