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
exports.ConfigImportExportService = void 0;
const common_1 = require("@nestjs/common");
const config_crud_service_1 = require("./config-crud.service");
const config_validation_service_1 = require("./config-validation.service");
const base_1 = require("../../common/base");
let ConfigImportExportService = class ConfigImportExportService extends base_1.BaseService {
    configCrudService;
    configValidationService;
    constructor(configCrudService, configValidationService) {
        super("ConfigImportExportService");
        this.configCrudService = configCrudService;
        this.configValidationService = configValidationService;
    }
    async exportConfigurations(filter = {}) {
        try {
            const configs = await this.configCrudService.getConfigurations(filter);
            const exportData = configs.map(config => ({
                key: config.key,
                value: config.value,
                valueType: config.valueType,
                category: config.category,
                subCategory: config.subCategory,
                description: config.description,
                defaultValue: config.defaultValue,
                validValues: config.validValues,
                minValue: config.minValue,
                maxValue: config.maxValue,
                isPublic: config.isPublic,
                isEditable: config.isEditable,
                requiresRestart: config.requiresRestart,
                scope: config.scope,
                scopeId: config.scopeId,
                tags: config.tags,
                sortOrder: config.sortOrder,
            }));
            this.logInfo(`Exported ${exportData.length} configurations`);
            return JSON.stringify(exportData, null, 2);
        }
        catch (error) {
            this.logError('Error exporting configurations:', error);
            throw error;
        }
    }
    async importConfigurations(importData) {
        try {
            const configs = JSON.parse(importData.configsJson);
            if (!Array.isArray(configs)) {
                throw new common_1.BadRequestException('Invalid JSON format: expected an array of configurations');
            }
            const results = { created: 0, updated: 0, errors: [] };
            for (const config of configs) {
                try {
                    if (!config.key) {
                        results.errors.push('Configuration missing required field: key');
                        continue;
                    }
                    const validation = this.configValidationService.validateConfigurationData(config);
                    if (!validation.isValid) {
                        results.errors.push(`Validation error for ${config.key}: ${validation.error}`);
                        continue;
                    }
                    const existing = await this.configCrudService.configKeyExists(config.key);
                    if (existing) {
                        if (importData.overwrite) {
                            const existingConfig = await this.configCrudService.getConfigByKey(config.key);
                            await this.configCrudService.updateConfigAttributes(existingConfig, { value: config.value, updatedAt: new Date() });
                            results.updated++;
                        }
                        else {
                            results.errors.push(`Configuration '${config.key}' already exists (use overwrite=true to update)`);
                        }
                    }
                    else {
                        await this.configCrudService.createConfiguration(config);
                        results.created++;
                    }
                }
                catch (error) {
                    results.errors.push(`Error processing ${config.key || 'unknown'}: ${error.message}`);
                }
            }
            this.logInfo(`Import completed: ${results.created} created, ${results.updated} updated, ${results.errors.length} errors`);
            return results;
        }
        catch (error) {
            this.logError('Error importing configurations:', error);
            throw error;
        }
    }
    async exportConfigurationsToCSV(filter = {}) {
        try {
            const configs = await this.configCrudService.getConfigurations(filter);
            const headers = [
                'key',
                'value',
                'valueType',
                'category',
                'subCategory',
                'description',
                'defaultValue',
                'isPublic',
                'isEditable',
                'requiresRestart',
                'scope',
                'scopeId',
                'sortOrder',
            ];
            const csvRows = [headers.join(',')];
            for (const config of configs) {
                const row = [
                    this.escapeCsvValue(config.key),
                    this.escapeCsvValue(config.value),
                    this.escapeCsvValue(config.valueType),
                    this.escapeCsvValue(config.category),
                    this.escapeCsvValue(config.subCategory || ''),
                    this.escapeCsvValue(config.description || ''),
                    this.escapeCsvValue(config.defaultValue || ''),
                    config.isPublic.toString(),
                    config.isEditable.toString(),
                    config.requiresRestart.toString(),
                    this.escapeCsvValue(config.scope),
                    this.escapeCsvValue(config.scopeId || ''),
                    config.sortOrder.toString(),
                ];
                csvRows.push(row.join(','));
            }
            this.logInfo(`Exported ${configs.length} configurations to CSV`);
            return csvRows.join('\n');
        }
        catch (error) {
            this.logError('Error exporting configurations to CSV:', error);
            throw error;
        }
    }
    async createBackup(filter = {}) {
        try {
            const timestamp = new Date().toISOString();
            const data = await this.exportConfigurations(filter);
            const configs = JSON.parse(data);
            const backup = {
                timestamp,
                count: configs.length,
                data,
                metadata: {
                    exportedAt: new Date(),
                    filter,
                    version: '1.0.0',
                },
            };
            this.logInfo(`Created backup with ${configs.length} configurations`);
            return backup;
        }
        catch (error) {
            this.logError('Error creating configuration backup:', error);
            throw error;
        }
    }
    async restoreFromBackup(backupData, overwrite = false) {
        try {
            const backup = JSON.parse(backupData);
            if (!backup.data) {
                throw new common_1.BadRequestException('Invalid backup format: missing data field');
            }
            const importData = {
                configsJson: backup.data,
                overwrite,
                changedBy: 'system',
            };
            const result = await this.importConfigurations(importData);
            this.logInfo(`Restored from backup: ${result.created} created, ${result.updated} updated`);
            return result;
        }
        catch (error) {
            this.logError('Error restoring from backup:', error);
            throw error;
        }
    }
    validateImportData(data) {
        try {
            const parsed = JSON.parse(data);
            if (!Array.isArray(parsed)) {
                return {
                    isValid: false,
                    error: 'Data must be an array of configuration objects',
                };
            }
            for (const config of parsed) {
                if (!config.key) {
                    return {
                        isValid: false,
                        error: 'Each configuration must have a key field',
                    };
                }
                if (!config.value) {
                    return {
                        isValid: false,
                        error: `Configuration ${config.key} must have a value field`,
                    };
                }
            }
            return { isValid: true };
        }
        catch (error) {
            return {
                isValid: false,
                error: 'Invalid JSON format',
            };
        }
    }
    escapeCsvValue(value) {
        if (!value)
            return '';
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
            return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
    }
};
exports.ConfigImportExportService = ConfigImportExportService;
exports.ConfigImportExportService = ConfigImportExportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_crud_service_1.ConfigCrudService,
        config_validation_service_1.ConfigValidationService])
], ConfigImportExportService);
//# sourceMappingURL=config-import-export.service.js.map