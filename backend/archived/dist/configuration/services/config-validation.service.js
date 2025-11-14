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
exports.ConfigValidationService = void 0;
const common_1 = require("@nestjs/common");
const models_1 = require("../../database/models");
const base_1 = require("../../common/base");
let ConfigValidationService = class ConfigValidationService extends base_1.BaseService {
    constructor() {
        super("ConfigValidationService");
    }
    validateConfigValue(config, newValue) {
        if (!config.isEditable) {
            return {
                isValid: false,
                error: 'This configuration is not editable',
            };
        }
        switch (config.valueType) {
            case models_1.ConfigValueType.NUMBER:
                return this.validateNumber(config, newValue);
            case models_1.ConfigValueType.BOOLEAN:
                return this.validateBoolean(newValue);
            case models_1.ConfigValueType.EMAIL:
                return this.validateEmail(newValue);
            case models_1.ConfigValueType.URL:
                return this.validateUrl(newValue);
            case models_1.ConfigValueType.COLOR:
                return this.validateColor(newValue);
            case models_1.ConfigValueType.JSON:
                return this.validateJson(newValue);
            case models_1.ConfigValueType.ENUM:
                return this.validateEnum(config, newValue);
            case models_1.ConfigValueType.ARRAY:
                return this.validateArray(newValue);
            default:
                return this.validateAgainstValidValues(config, newValue);
        }
    }
    validateNumber(config, newValue) {
        const numValue = parseFloat(newValue);
        if (isNaN(numValue)) {
            return { isValid: false, error: 'Value must be a valid number' };
        }
        if (config.minValue !== null &&
            config.minValue !== undefined &&
            numValue < config.minValue) {
            return {
                isValid: false,
                error: `Value must be at least ${config.minValue}`,
            };
        }
        if (config.maxValue !== null &&
            config.maxValue !== undefined &&
            numValue > config.maxValue) {
            return {
                isValid: false,
                error: `Value must be at most ${config.maxValue}`,
            };
        }
        return { isValid: true };
    }
    validateBoolean(newValue) {
        if (!['true', 'false', '1', '0'].includes(newValue.toLowerCase())) {
            return {
                isValid: false,
                error: 'Value must be a boolean (true/false)',
            };
        }
        return { isValid: true };
    }
    validateEmail(newValue) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newValue)) {
            return {
                isValid: false,
                error: 'Value must be a valid email address',
            };
        }
        return { isValid: true };
    }
    validateUrl(newValue) {
        try {
            new URL(newValue);
            return { isValid: true };
        }
        catch {
            return { isValid: false, error: 'Value must be a valid URL' };
        }
    }
    validateColor(newValue) {
        const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        if (!colorRegex.test(newValue)) {
            return {
                isValid: false,
                error: 'Value must be a valid hex color (e.g., #3b82f6)',
            };
        }
        return { isValid: true };
    }
    validateJson(newValue) {
        try {
            JSON.parse(newValue);
            return { isValid: true };
        }
        catch {
            return { isValid: false, error: 'Value must be valid JSON' };
        }
    }
    validateEnum(config, newValue) {
        if (config.validValues && config.validValues.length > 0) {
            if (!config.validValues.includes(newValue)) {
                return {
                    isValid: false,
                    error: `Value must be one of: ${config.validValues.join(', ')}`,
                };
            }
        }
        return { isValid: true };
    }
    validateArray(newValue) {
        try {
            const parsed = JSON.parse(newValue);
            if (!Array.isArray(parsed)) {
                return {
                    isValid: false,
                    error: 'Value must be a valid JSON array',
                };
            }
            return { isValid: true };
        }
        catch {
            return { isValid: false, error: 'Value must be a valid JSON array' };
        }
    }
    validateAgainstValidValues(config, newValue) {
        if (config.validValues &&
            config.validValues.length > 0 &&
            config.valueType !== models_1.ConfigValueType.ENUM) {
            if (!config.validValues.includes(newValue)) {
                return {
                    isValid: false,
                    error: `Value must be one of: ${config.validValues.join(', ')}`,
                };
            }
        }
        return { isValid: true };
    }
    validateConfigurationData(data) {
        if (!data.key) {
            return { isValid: false, error: 'Configuration key is required' };
        }
        if (!data.value) {
            return { isValid: false, error: 'Configuration value is required' };
        }
        if (!data.valueType) {
            return { isValid: false, error: 'Value type is required' };
        }
        if (!data.category) {
            return { isValid: false, error: 'Category is required' };
        }
        const mockConfig = {
            isEditable: true,
            valueType: data.valueType,
            validValues: data.validValues,
            minValue: data.minValue,
            maxValue: data.maxValue,
        };
        return this.validateConfigValue(mockConfig, data.value);
    }
};
exports.ConfigValidationService = ConfigValidationService;
exports.ConfigValidationService = ConfigValidationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ConfigValidationService);
//# sourceMappingURL=config-validation.service.js.map