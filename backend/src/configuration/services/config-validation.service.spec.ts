import { Test, TestingModule } from '@nestjs/testing';
import { ConfigValidationService } from './config-validation.service';
import { SystemConfig, ConfigValueType } from '@/database/models';

describe('ConfigValidationService', () => {
  let service: ConfigValidationService;

  const createMockConfig = (overrides: Partial<SystemConfig> = {}): SystemConfig => ({
    id: 'test-id',
    key: 'test.key',
    value: 'test-value',
    valueType: ConfigValueType.STRING,
    category: 'system' as any,
    subCategory: null,
    description: null,
    defaultValue: null,
    validValues: null,
    minValue: null,
    maxValue: null,
    isPublic: false,
    isEditable: true,
    requiresRestart: false,
    scope: 'SYSTEM' as any,
    scopeId: null,
    tags: null,
    sortOrder: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }) as SystemConfig;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigValidationService],
    }).compile();

    service = module.get<ConfigValidationService>(ConfigValidationService);
  });

  describe('validateConfigValue', () => {
    it('should reject editing non-editable configurations', () => {
      const config = createMockConfig({ isEditable: false });

      const result = service.validateConfigValue(config, 'new-value');

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('not editable');
    });

    it('should validate STRING type values', () => {
      const config = createMockConfig({ valueType: ConfigValueType.STRING });

      const result = service.validateConfigValue(config, 'any-string');

      expect(result.isValid).toBe(true);
    });

    it('should validate NUMBER type values', () => {
      const config = createMockConfig({ valueType: ConfigValueType.NUMBER });

      const result = service.validateConfigValue(config, '42');

      expect(result.isValid).toBe(true);
    });

    it('should reject invalid NUMBER values', () => {
      const config = createMockConfig({ valueType: ConfigValueType.NUMBER });

      const result = service.validateConfigValue(config, 'not-a-number');

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('valid number');
    });

    it('should validate BOOLEAN type values', () => {
      const config = createMockConfig({ valueType: ConfigValueType.BOOLEAN });

      expect(service.validateConfigValue(config, 'true').isValid).toBe(true);
      expect(service.validateConfigValue(config, 'false').isValid).toBe(true);
      expect(service.validateConfigValue(config, '1').isValid).toBe(true);
      expect(service.validateConfigValue(config, '0').isValid).toBe(true);
    });

    it('should reject invalid BOOLEAN values', () => {
      const config = createMockConfig({ valueType: ConfigValueType.BOOLEAN });

      const result = service.validateConfigValue(config, 'yes');

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('boolean');
    });

    it('should validate EMAIL type values', () => {
      const config = createMockConfig({ valueType: ConfigValueType.EMAIL });

      const result = service.validateConfigValue(config, 'test@example.com');

      expect(result.isValid).toBe(true);
    });

    it('should reject invalid EMAIL values', () => {
      const config = createMockConfig({ valueType: ConfigValueType.EMAIL });

      expect(service.validateConfigValue(config, 'invalid-email').isValid).toBe(false);
      expect(service.validateConfigValue(config, '@example.com').isValid).toBe(false);
      expect(service.validateConfigValue(config, 'test@').isValid).toBe(false);
    });

    it('should validate URL type values', () => {
      const config = createMockConfig({ valueType: ConfigValueType.URL });

      expect(service.validateConfigValue(config, 'https://example.com').isValid).toBe(true);
      expect(service.validateConfigValue(config, 'http://localhost:3000').isValid).toBe(true);
    });

    it('should reject invalid URL values', () => {
      const config = createMockConfig({ valueType: ConfigValueType.URL });

      const result = service.validateConfigValue(config, 'not-a-url');

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('valid URL');
    });

    it('should validate COLOR type values', () => {
      const config = createMockConfig({ valueType: ConfigValueType.COLOR });

      expect(service.validateConfigValue(config, '#3b82f6').isValid).toBe(true);
      expect(service.validateConfigValue(config, '#fff').isValid).toBe(true);
      expect(service.validateConfigValue(config, '#ABCDEF').isValid).toBe(true);
    });

    it('should reject invalid COLOR values', () => {
      const config = createMockConfig({ valueType: ConfigValueType.COLOR });

      expect(service.validateConfigValue(config, 'blue').isValid).toBe(false);
      expect(service.validateConfigValue(config, '#GGG').isValid).toBe(false);
      expect(service.validateConfigValue(config, '3b82f6').isValid).toBe(false);
    });

    it('should validate JSON type values', () => {
      const config = createMockConfig({ valueType: ConfigValueType.JSON });

      expect(service.validateConfigValue(config, '{"key": "value"}').isValid).toBe(true);
      expect(service.validateConfigValue(config, '[]').isValid).toBe(true);
      expect(service.validateConfigValue(config, 'null').isValid).toBe(true);
    });

    it('should reject invalid JSON values', () => {
      const config = createMockConfig({ valueType: ConfigValueType.JSON });

      const result = service.validateConfigValue(config, '{invalid json}');

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('valid JSON');
    });

    it('should validate ARRAY type values', () => {
      const config = createMockConfig({ valueType: ConfigValueType.ARRAY });

      expect(service.validateConfigValue(config, '[]').isValid).toBe(true);
      expect(service.validateConfigValue(config, '["value1", "value2"]').isValid).toBe(true);
    });

    it('should reject non-array JSON for ARRAY type', () => {
      const config = createMockConfig({ valueType: ConfigValueType.ARRAY });

      const result = service.validateConfigValue(config, '{"key": "value"}');

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('valid JSON array');
    });

    it('should validate ENUM type against valid values', () => {
      const config = createMockConfig({
        valueType: ConfigValueType.ENUM,
        validValues: ['option1', 'option2', 'option3'],
      });

      expect(service.validateConfigValue(config, 'option1').isValid).toBe(true);
      expect(service.validateConfigValue(config, 'option2').isValid).toBe(true);
    });

    it('should reject invalid ENUM values', () => {
      const config = createMockConfig({
        valueType: ConfigValueType.ENUM,
        validValues: ['option1', 'option2'],
      });

      const result = service.validateConfigValue(config, 'invalid-option');

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('one of');
      expect(result.error).toContain('option1');
    });
  });

  describe('validateNumber', () => {
    it('should enforce minimum value constraint', () => {
      const config = createMockConfig({
        valueType: ConfigValueType.NUMBER,
        minValue: 10,
      });

      expect(service.validateConfigValue(config, '5').isValid).toBe(false);
      expect(service.validateConfigValue(config, '10').isValid).toBe(true);
      expect(service.validateConfigValue(config, '15').isValid).toBe(true);
    });

    it('should enforce maximum value constraint', () => {
      const config = createMockConfig({
        valueType: ConfigValueType.NUMBER,
        maxValue: 100,
      });

      expect(service.validateConfigValue(config, '150').isValid).toBe(false);
      expect(service.validateConfigValue(config, '100').isValid).toBe(true);
      expect(service.validateConfigValue(config, '50').isValid).toBe(true);
    });

    it('should enforce both min and max constraints', () => {
      const config = createMockConfig({
        valueType: ConfigValueType.NUMBER,
        minValue: 10,
        maxValue: 100,
      });

      expect(service.validateConfigValue(config, '5').isValid).toBe(false);
      expect(service.validateConfigValue(config, '150').isValid).toBe(false);
      expect(service.validateConfigValue(config, '50').isValid).toBe(true);
    });

    it('should handle decimal numbers', () => {
      const config = createMockConfig({
        valueType: ConfigValueType.NUMBER,
        minValue: 0,
        maxValue: 1,
      });

      expect(service.validateConfigValue(config, '0.5').isValid).toBe(true);
      expect(service.validateConfigValue(config, '0.999').isValid).toBe(true);
    });

    it('should handle negative numbers', () => {
      const config = createMockConfig({
        valueType: ConfigValueType.NUMBER,
        minValue: -100,
        maxValue: 0,
      });

      expect(service.validateConfigValue(config, '-50').isValid).toBe(true);
      expect(service.validateConfigValue(config, '-100').isValid).toBe(true);
    });
  });

  describe('validateAgainstValidValues', () => {
    it('should validate against valid values for non-ENUM types', () => {
      const config = createMockConfig({
        valueType: ConfigValueType.STRING,
        validValues: ['value1', 'value2', 'value3'],
      });

      expect(service.validateConfigValue(config, 'value1').isValid).toBe(true);
      expect(service.validateConfigValue(config, 'invalid').isValid).toBe(false);
    });

    it('should skip valid values check when not provided', () => {
      const config = createMockConfig({
        valueType: ConfigValueType.STRING,
        validValues: null,
      });

      expect(service.validateConfigValue(config, 'any-value').isValid).toBe(true);
    });
  });

  describe('validateConfigurationData', () => {
    it('should validate complete configuration data', () => {
      const data = {
        key: 'test.config',
        value: 'test-value',
        valueType: ConfigValueType.STRING,
        category: 'system',
      };

      const result = service.validateConfigurationData(data);

      expect(result.isValid).toBe(true);
    });

    it('should require key field', () => {
      const data = {
        value: 'test-value',
        valueType: ConfigValueType.STRING,
        category: 'system',
      };

      const result = service.validateConfigurationData(data);

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('key is required');
    });

    it('should require value field', () => {
      const data = {
        key: 'test.config',
        valueType: ConfigValueType.STRING,
        category: 'system',
      };

      const result = service.validateConfigurationData(data);

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('value is required');
    });

    it('should require valueType field', () => {
      const data = {
        key: 'test.config',
        value: 'test-value',
        category: 'system',
      };

      const result = service.validateConfigurationData(data);

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Value type is required');
    });

    it('should require category field', () => {
      const data = {
        key: 'test.config',
        value: 'test-value',
        valueType: ConfigValueType.STRING,
      };

      const result = service.validateConfigurationData(data);

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Category is required');
    });

    it('should validate value type for configuration data', () => {
      const data = {
        key: 'test.config',
        value: 'not-a-number',
        valueType: ConfigValueType.NUMBER,
        category: 'system',
      };

      const result = service.validateConfigurationData(data);

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('valid number');
    });

    it('should validate with constraints', () => {
      const data = {
        key: 'test.config',
        value: '150',
        valueType: ConfigValueType.NUMBER,
        category: 'system',
        minValue: 0,
        maxValue: 100,
      };

      const result = service.validateConfigurationData(data);

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('at most 100');
    });

    it('should validate email configuration data', () => {
      const validData = {
        key: 'email.config',
        value: 'test@example.com',
        valueType: ConfigValueType.EMAIL,
        category: 'system',
      };

      expect(service.validateConfigurationData(validData).isValid).toBe(true);

      const invalidData = {
        ...validData,
        value: 'invalid-email',
      };

      expect(service.validateConfigurationData(invalidData).isValid).toBe(false);
    });

    it('should validate URL configuration data', () => {
      const validData = {
        key: 'url.config',
        value: 'https://example.com',
        valueType: ConfigValueType.URL,
        category: 'system',
      };

      expect(service.validateConfigurationData(validData).isValid).toBe(true);

      const invalidData = {
        ...validData,
        value: 'not-a-url',
      };

      expect(service.validateConfigurationData(invalidData).isValid).toBe(false);
    });

    it('should validate ENUM with valid values', () => {
      const data = {
        key: 'enum.config',
        value: 'option1',
        valueType: ConfigValueType.ENUM,
        category: 'system',
        validValues: ['option1', 'option2', 'option3'],
      };

      expect(service.validateConfigurationData(data).isValid).toBe(true);

      const invalidData = {
        ...data,
        value: 'invalid-option',
      };

      expect(service.validateConfigurationData(invalidData).isValid).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle empty string validations', () => {
      const config = createMockConfig({ valueType: ConfigValueType.STRING });

      // Empty string should be valid for STRING type
      const result = service.validateConfigValue(config, '');

      expect(result.isValid).toBe(true);
    });

    it('should handle null minValue and maxValue', () => {
      const config = createMockConfig({
        valueType: ConfigValueType.NUMBER,
        minValue: null,
        maxValue: null,
      });

      expect(service.validateConfigValue(config, '-999').isValid).toBe(true);
      expect(service.validateConfigValue(config, '999').isValid).toBe(true);
    });

    it('should handle undefined validValues', () => {
      const config = createMockConfig({
        valueType: ConfigValueType.ENUM,
        validValues: undefined as any,
      });

      // Should not fail when validValues is undefined
      const result = service.validateConfigValue(config, 'any-value');

      expect(result.isValid).toBe(true);
    });

    it('should handle empty validValues array', () => {
      const config = createMockConfig({
        valueType: ConfigValueType.ENUM,
        validValues: [],
      });

      const result = service.validateConfigValue(config, 'any-value');

      expect(result.isValid).toBe(true);
    });

    it('should handle special characters in email', () => {
      const config = createMockConfig({ valueType: ConfigValueType.EMAIL });

      expect(service.validateConfigValue(config, 'test+tag@example.co.uk').isValid).toBe(true);
      expect(service.validateConfigValue(config, 'test.name@example.com').isValid).toBe(true);
    });

    it('should handle various URL protocols', () => {
      const config = createMockConfig({ valueType: ConfigValueType.URL });

      expect(service.validateConfigValue(config, 'https://example.com').isValid).toBe(true);
      expect(service.validateConfigValue(config, 'http://example.com').isValid).toBe(true);
      expect(service.validateConfigValue(config, 'ftp://example.com').isValid).toBe(true);
    });

    it('should handle complex JSON structures', () => {
      const config = createMockConfig({ valueType: ConfigValueType.JSON });

      const complexJson = JSON.stringify({
        nested: {
          array: [1, 2, 3],
          object: { key: 'value' },
        },
        boolean: true,
        null: null,
      });

      expect(service.validateConfigValue(config, complexJson).isValid).toBe(true);
    });
  });
});
