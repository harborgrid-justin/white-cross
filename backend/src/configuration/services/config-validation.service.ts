/**
 * @fileoverview Configuration Validation Service
 * @module configuration/services/config-validation.service
 * @description Handles validation logic for configuration values
 */

import { Injectable, Logger } from '@nestjs/common';
import { ConfigValueType, SystemConfig } from '../../database/models/system-config.model';

import { BaseService } from '../../../common/base';
/**
 * Configuration Validation Result Interface
 */
export interface ConfigurationValidationResult {
  isValid: boolean;
  error?: string;
}

@Injectable()
export class ConfigValidationService extends BaseService {
  /**
   * Validate a configuration value against its type and constraints
   */
  validateConfigValue(
    config: SystemConfig,
    newValue: string,
  ): ConfigurationValidationResult {
    // Check if config is editable
    if (!config.isEditable) {
      return {
        isValid: false,
        error: 'This configuration is not editable',
      };
    }

    // Type-specific validation
    switch (config.valueType) {
      case ConfigValueType.NUMBER:
        return this.validateNumber(config, newValue);

      case ConfigValueType.BOOLEAN:
        return this.validateBoolean(newValue);

      case ConfigValueType.EMAIL:
        return this.validateEmail(newValue);

      case ConfigValueType.URL:
        return this.validateUrl(newValue);

      case ConfigValueType.COLOR:
        return this.validateColor(newValue);

      case ConfigValueType.JSON:
        return this.validateJson(newValue);

      case ConfigValueType.ENUM:
        return this.validateEnum(config, newValue);

      case ConfigValueType.ARRAY:
        return this.validateArray(newValue);

      default:
        // For STRING and other types, check valid values constraint
        return this.validateAgainstValidValues(config, newValue);
    }
  }

  /**
   * Validate number type with min/max constraints
   */
  private validateNumber(
    config: SystemConfig,
    newValue: string,
  ): ConfigurationValidationResult {
    const numValue = parseFloat(newValue);
    if (isNaN(numValue)) {
      return { isValid: false, error: 'Value must be a valid number' };
    }

    if (
      config.minValue !== null &&
      config.minValue !== undefined &&
      numValue < config.minValue
    ) {
      return {
        isValid: false,
        error: `Value must be at least ${config.minValue}`,
      };
    }

    if (
      config.maxValue !== null &&
      config.maxValue !== undefined &&
      numValue > config.maxValue
    ) {
      return {
        isValid: false,
        error: `Value must be at most ${config.maxValue}`,
      };
    }

    return { isValid: true };
  }

  /**
   * Validate boolean type
   */
  private validateBoolean(newValue: string): ConfigurationValidationResult {
    if (!['true', 'false', '1', '0'].includes(newValue.toLowerCase())) {
      return {
        isValid: false,
        error: 'Value must be a boolean (true/false)',
      };
    }
    return { isValid: true };
  }

  /**
   * Validate email format
   */
  private validateEmail(newValue: string): ConfigurationValidationResult {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newValue)) {
      return {
        isValid: false,
        error: 'Value must be a valid email address',
      };
    }
    return { isValid: true };
  }

  /**
   * Validate URL format
   */
  private validateUrl(newValue: string): ConfigurationValidationResult {
    try {
      new URL(newValue);
      return { isValid: true };
    } catch {
      return { isValid: false, error: 'Value must be a valid URL' };
    }
  }

  /**
   * Validate hex color format
   */
  private validateColor(newValue: string): ConfigurationValidationResult {
    const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!colorRegex.test(newValue)) {
      return {
        isValid: false,
        error: 'Value must be a valid hex color (e.g., #3b82f6)',
      };
    }
    return { isValid: true };
  }

  /**
   * Validate JSON format
   */
  private validateJson(newValue: string): ConfigurationValidationResult {
    try {
      JSON.parse(newValue);
      return { isValid: true };
    } catch {
      return { isValid: false, error: 'Value must be valid JSON' };
    }
  }

  /**
   * Validate enum value against valid values
   */
  private validateEnum(
    config: SystemConfig,
    newValue: string,
  ): ConfigurationValidationResult {
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

  /**
   * Validate array format
   */
  private validateArray(newValue: string): ConfigurationValidationResult {
    try {
      const parsed = JSON.parse(newValue);
      if (!Array.isArray(parsed)) {
        return {
          isValid: false,
          error: 'Value must be a valid JSON array',
        };
      }
      return { isValid: true };
    } catch {
      return { isValid: false, error: 'Value must be a valid JSON array' };
    }
  }

  /**
   * Validate against valid values constraint (for non-ENUM types)
   */
  private validateAgainstValidValues(
    config: SystemConfig,
    newValue: string,
  ): ConfigurationValidationResult {
    if (
      config.validValues &&
      config.validValues.length > 0 &&
      config.valueType !== ConfigValueType.ENUM
    ) {
      if (!config.validValues.includes(newValue)) {
        return {
          isValid: false,
          error: `Value must be one of: ${config.validValues.join(', ')}`,
        };
      }
    }

    return { isValid: true };
  }

  /**
   * Validate configuration data for creation
   */
  validateConfigurationData(data: any): ConfigurationValidationResult {
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

    // Validate the value against its type
    const mockConfig = {
      isEditable: true,
      valueType: data.valueType,
      validValues: data.validValues,
      minValue: data.minValue,
      maxValue: data.maxValue,
    } as SystemConfig;

    return this.validateConfigValue(mockConfig, data.value);
  }
}
