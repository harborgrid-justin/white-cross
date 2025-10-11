/**
 * Test Suite for Route Parameter Validation System
 * Comprehensive tests for security, validation, and transformation utilities
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { z } from 'zod';
import {
  // Schemas
  UUIDParamSchema,
  NumericParamSchema,
  PositiveIntegerParamSchema,
  DateParamSchema,
  EnumParamSchema,
  CompositeParamSchema,
  IncidentIdParamSchema,
  IncidentTypeParamSchema,
  PaginationParamSchema,
  DateRangeParamSchema,

  // Validation functions
  validateRouteParams,
  validateQueryParams,

  // Security functions
  detectXSS,
  detectSQLInjection,
  detectPathTraversal,
  performSecurityChecks,
  sanitizeSpecialCharacters,
  sanitizeParams,

  // Transformation functions
  parseDate,
  parseBoolean,
  parseArray,
  parseJSON,
  parseParams,

  // Error class
  RouteValidationError,
} from '../routeValidation';
import { IncidentType, IncidentSeverity } from '../../types/incidents';

describe('RouteValidationError', () => {
  it('should create error with correct properties', () => {
    const error = new RouteValidationError(
      'Invalid ID',
      'id',
      'INVALID_UUID'
    );

    expect(error.name).toBe('RouteValidationError');
    expect(error.message).toBe('Invalid ID');
    expect(error.field).toBe('id');
    expect(error.code).toBe('INVALID_UUID');
    expect(error.statusCode).toBe(400);
    expect(error.userMessage).toContain('identifier');
  });

  it('should generate appropriate user messages', () => {
    const xssError = new RouteValidationError('XSS', 'input', 'XSS_DETECTED');
    expect(xssError.userMessage).toContain('harmful content');

    const sqlError = new RouteValidationError('SQL', 'query', 'SQL_INJECTION_DETECTED');
    expect(sqlError.userMessage).toContain('Suspicious pattern');

    const pathError = new RouteValidationError('Path', 'path', 'PATH_TRAVERSAL_DETECTED');
    expect(pathError.userMessage).toContain('Invalid path');
  });

  it('should serialize to JSON correctly', () => {
    const error = new RouteValidationError('Test error', 'testField', 'TEST_CODE');
    const json = error.toJSON();

    expect(json.name).toBe('RouteValidationError');
    expect(json.message).toBe('Test error');
    expect(json.field).toBe('testField');
    expect(json.code).toBe('TEST_CODE');
    expect(json.timestamp).toBeDefined();
  });
});

describe('Schema Validation', () => {
  describe('UUIDParamSchema', () => {
    it('should validate valid UUID', () => {
      const validUUID = '123e4567-e89b-12d3-a456-426614174000';
      const result = UUIDParamSchema.safeParse(validUUID);
      expect(result.success).toBe(true);
    });

    it('should reject invalid UUID', () => {
      const invalidUUID = 'not-a-uuid';
      const result = UUIDParamSchema.safeParse(invalidUUID);
      expect(result.success).toBe(false);
    });
  });

  describe('NumericParamSchema', () => {
    it('should validate and transform valid number string', () => {
      const result = NumericParamSchema.safeParse('42');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(42);
      }
    });

    it('should reject non-numeric string', () => {
      const result = NumericParamSchema.safeParse('abc');
      expect(result.success).toBe(false);
    });

    it('should reject negative numbers in string', () => {
      const result = NumericParamSchema.safeParse('-5');
      expect(result.success).toBe(false);
    });
  });

  describe('PositiveIntegerParamSchema', () => {
    it('should validate positive integers', () => {
      const result = PositiveIntegerParamSchema.safeParse('10');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(10);
      }
    });

    it('should reject zero', () => {
      const result = PositiveIntegerParamSchema.safeParse('0');
      expect(result.success).toBe(false);
    });
  });

  describe('DateParamSchema', () => {
    it('should validate ISO 8601 date', () => {
      const result = DateParamSchema.safeParse('2024-03-15T10:30:00Z');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeInstanceOf(Date);
      }
    });

    it('should validate simple date format', () => {
      const result = DateParamSchema.safeParse('2024-03-15');
      expect(result.success).toBe(true);
    });

    it('should reject invalid date', () => {
      const result = DateParamSchema.safeParse('not-a-date');
      expect(result.success).toBe(false);
    });
  });

  describe('EnumParamSchema', () => {
    it('should validate valid enum value', () => {
      const schema = EnumParamSchema(IncidentType, 'Incident Type');
      const result = schema.safeParse('INJURY');
      expect(result.success).toBe(true);
    });

    it('should reject invalid enum value', () => {
      const schema = EnumParamSchema(IncidentType, 'Incident Type');
      const result = schema.safeParse('INVALID_TYPE');
      expect(result.success).toBe(false);
    });
  });

  describe('CompositeParamSchema', () => {
    it('should validate multiple parameters', () => {
      const schema = CompositeParamSchema({
        id: UUIDParamSchema,
        type: IncidentTypeParamSchema,
      });

      const result = schema.safeParse({
        id: '123e4567-e89b-12d3-a456-426614174000',
        type: 'INJURY',
      });

      expect(result.success).toBe(true);
    });

    it('should fail if any parameter is invalid', () => {
      const schema = CompositeParamSchema({
        id: UUIDParamSchema,
        type: IncidentTypeParamSchema,
      });

      const result = schema.safeParse({
        id: 'invalid-uuid',
        type: 'INJURY',
      });

      expect(result.success).toBe(false);
    });
  });
});

describe('Security Functions', () => {
  describe('detectXSS', () => {
    it('should detect script tags', () => {
      expect(detectXSS('<script>alert("xss")</script>')).toBe(true);
      expect(detectXSS('normal text')).toBe(false);
    });

    it('should detect javascript protocol', () => {
      expect(detectXSS('javascript:alert(1)')).toBe(true);
    });

    it('should detect event handlers', () => {
      expect(detectXSS('<img onerror="alert(1)">')).toBe(true);
    });

    it('should detect iframe injection', () => {
      expect(detectXSS('<iframe src="evil.com"></iframe>')).toBe(true);
    });
  });

  describe('detectSQLInjection', () => {
    it('should detect SQL keywords', () => {
      expect(detectSQLInjection("'; DROP TABLE users; --")).toBe(true);
      expect(detectSQLInjection('normal text')).toBe(false);
    });

    it('should detect UNION SELECT', () => {
      expect(detectSQLInjection('UNION SELECT * FROM users')).toBe(true);
    });

    it('should detect OR 1=1', () => {
      expect(detectSQLInjection("' OR 1=1 --")).toBe(true);
    });
  });

  describe('detectPathTraversal', () => {
    it('should detect directory traversal', () => {
      expect(detectPathTraversal('../../../etc/passwd')).toBe(true);
      expect(detectPathTraversal('normal/path')).toBe(false);
    });

    it('should detect encoded traversal', () => {
      expect(detectPathTraversal('%2e%2e/etc/passwd')).toBe(true);
    });
  });

  describe('performSecurityChecks', () => {
    it('should throw on XSS attempt', () => {
      expect(() => {
        performSecurityChecks('<script>alert(1)</script>', 'input');
      }).toThrow(RouteValidationError);
    });

    it('should throw on SQL injection attempt', () => {
      expect(() => {
        performSecurityChecks("'; DROP TABLE users; --", 'query');
      }).toThrow(RouteValidationError);
    });

    it('should throw on path traversal attempt', () => {
      expect(() => {
        performSecurityChecks('../../../etc/passwd', 'path');
      }).toThrow(RouteValidationError);
    });

    it('should not throw on safe input', () => {
      expect(() => {
        performSecurityChecks('safe-input-123', 'field');
      }).not.toThrow();
    });
  });

  describe('sanitizeSpecialCharacters', () => {
    it('should encode HTML entities', () => {
      const result = sanitizeSpecialCharacters('<div>"test"</div>');
      expect(result).toBe('&lt;div&gt;&quot;test&quot;&lt;/div&gt;');
    });

    it('should trim whitespace', () => {
      const result = sanitizeSpecialCharacters('  test  ');
      expect(result).toBe('test');
    });
  });

  describe('sanitizeParams', () => {
    it('should sanitize all parameters', () => {
      const params = {
        name: '<script>alert(1)</script>',
        value: '  test  ',
      };

      const result = sanitizeParams(params);
      expect(result.name).not.toContain('<script>');
      expect(result.value).toBe('test');
    });

    it('should skip undefined parameters', () => {
      const params = {
        name: 'test',
        optional: undefined,
      };

      const result = sanitizeParams(params);
      expect(result.name).toBe('test');
      expect(result.optional).toBeUndefined();
    });

    it('should throw on malicious input', () => {
      const params = {
        id: "'; DROP TABLE users; --",
      };

      expect(() => sanitizeParams(params)).toThrow(RouteValidationError);
    });
  });
});

describe('Transformation Functions', () => {
  describe('parseDate', () => {
    it('should parse valid ISO date', () => {
      const result = parseDate('2024-03-15T10:30:00Z');
      expect(result).toBeInstanceOf(Date);
      expect(result?.getFullYear()).toBe(2024);
    });

    it('should return null for invalid date', () => {
      expect(parseDate('invalid-date')).toBeNull();
    });

    it('should return null for undefined', () => {
      expect(parseDate(undefined)).toBeNull();
    });
  });

  describe('parseBoolean', () => {
    it('should parse true values', () => {
      expect(parseBoolean('true')).toBe(true);
      expect(parseBoolean('1')).toBe(true);
      expect(parseBoolean('yes')).toBe(true);
      expect(parseBoolean('on')).toBe(true);
    });

    it('should parse false values', () => {
      expect(parseBoolean('false')).toBe(false);
      expect(parseBoolean('0')).toBe(false);
      expect(parseBoolean('no')).toBe(false);
      expect(parseBoolean('off')).toBe(false);
    });

    it('should return null for invalid values', () => {
      expect(parseBoolean('maybe')).toBeNull();
      expect(parseBoolean(undefined)).toBeNull();
    });
  });

  describe('parseArray', () => {
    it('should parse comma-delimited array', () => {
      const result = parseArray('item1,item2,item3');
      expect(result).toEqual(['item1', 'item2', 'item3']);
    });

    it('should parse custom delimiter', () => {
      const result = parseArray('item1|item2|item3', '|');
      expect(result).toEqual(['item1', 'item2', 'item3']);
    });

    it('should trim whitespace', () => {
      const result = parseArray(' item1 , item2 , item3 ');
      expect(result).toEqual(['item1', 'item2', 'item3']);
    });

    it('should return empty array for undefined', () => {
      expect(parseArray(undefined)).toEqual([]);
    });

    it('should filter empty items', () => {
      const result = parseArray('item1,,item2,');
      expect(result).toEqual(['item1', 'item2']);
    });
  });

  describe('parseJSON', () => {
    it('should parse valid JSON', () => {
      const result = parseJSON('{"name":"test","value":123}');
      expect(result).toEqual({ name: 'test', value: 123 });
    });

    it('should return null for invalid JSON', () => {
      expect(parseJSON('invalid json')).toBeNull();
    });

    it('should return null for undefined', () => {
      expect(parseJSON(undefined)).toBeNull();
    });

    it('should throw on malicious JSON', () => {
      expect(parseJSON('<script>alert(1)</script>')).toBeNull();
    });
  });

  describe('parseParams', () => {
    it('should parse multiple types', () => {
      const params = {
        page: '2',
        active: 'true',
        tags: 'red,blue,green',
        date: '2024-03-15T10:30:00Z',
      };

      const types = {
        page: 'number' as const,
        active: 'boolean' as const,
        tags: 'array' as const,
        date: 'date' as const,
      };

      const result = parseParams(params, types);
      expect(result.page).toBe(2);
      expect(result.active).toBe(true);
      expect(result.tags).toEqual(['red', 'blue', 'green']);
      expect(result.date).toBeInstanceOf(Date);
    });

    it('should handle invalid values', () => {
      const params = {
        page: 'invalid',
        active: 'maybe',
      };

      const types = {
        page: 'number' as const,
        active: 'boolean' as const,
      };

      const result = parseParams(params, types);
      expect(result.page).toBeNull();
      expect(result.active).toBeNull();
    });
  });
});

describe('Validation Functions', () => {
  describe('validateRouteParams', () => {
    it('should validate valid params', () => {
      const params = {
        id: '123e4567-e89b-12d3-a456-426614174000',
      };

      const result = validateRouteParams(params, IncidentIdParamSchema);
      expect(result.success).toBe(true);
      expect(result.data?.id).toBe(params.id);
    });

    it('should fail on invalid params', () => {
      const params = {
        id: 'invalid-uuid',
      };

      const result = validateRouteParams(params, IncidentIdParamSchema);
      expect(result.success).toBe(false);
      expect(result.error).toBeInstanceOf(RouteValidationError);
    });

    it('should sanitize before validating', () => {
      const params = {
        id: '  123e4567-e89b-12d3-a456-426614174000  ',
      };

      const result = validateRouteParams(params, IncidentIdParamSchema);
      expect(result.success).toBe(true);
    });

    it('should detect security threats', () => {
      const params = {
        id: '<script>alert(1)</script>',
      };

      const result = validateRouteParams(params, IncidentIdParamSchema);
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('XSS_DETECTED');
    });
  });

  describe('validateQueryParams', () => {
    it('should validate query parameters', () => {
      const searchParams = new URLSearchParams({
        page: '2',
        limit: '50',
      });

      const result = validateQueryParams(searchParams, PaginationParamSchema);
      expect(result.success).toBe(true);
    });

    it('should use default values for optional params', () => {
      const searchParams = new URLSearchParams();

      const result = validateQueryParams(searchParams, PaginationParamSchema);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data?.page).toBeDefined();
        expect(result.data?.limit).toBeDefined();
      }
    });
  });
});

describe('Complex Validation Scenarios', () => {
  it('should validate date range', () => {
    const params = {
      startDate: '2024-01-01',
      endDate: '2024-12-31',
    };

    const result = validateRouteParams(params, DateRangeParamSchema);
    expect(result.success).toBe(true);
  });

  it('should reject invalid date range', () => {
    const params = {
      startDate: '2024-12-31',
      endDate: '2024-01-01',
    };

    const result = validateRouteParams(params, DateRangeParamSchema);
    expect(result.success).toBe(false);
  });

  it('should validate incident filters', () => {
    const schema = z.object({
      type: IncidentTypeParamSchema.optional(),
      severity: EnumParamSchema(IncidentSeverity, 'Severity').optional(),
      page: PositiveIntegerParamSchema.optional(),
    });

    const params = {
      type: 'INJURY',
      severity: 'HIGH',
      page: '1',
    };

    const result = validateRouteParams(params, schema);
    expect(result.success).toBe(true);
  });
});

describe('Edge Cases', () => {
  it('should handle empty params object', () => {
    const result = validateRouteParams({}, z.object({}));
    expect(result.success).toBe(true);
  });

  it('should handle params with extra fields', () => {
    const params = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      extraField: 'should-be-ignored',
    };

    const result = validateRouteParams(params, IncidentIdParamSchema);
    expect(result.success).toBe(true);
  });

  it('should handle null values', () => {
    const params = {
      id: null as any,
    };

    const sanitized = sanitizeParams(params);
    expect(sanitized.id).toBeUndefined();
  });

  it('should handle very long strings', () => {
    const longString = 'a'.repeat(10000);
    const result = sanitizeSpecialCharacters(longString);
    expect(result).toBe(longString);
  });

  it('should handle unicode characters', () => {
    const params = {
      name: 'José García-Müller',
    };

    const sanitized = sanitizeParams(params);
    expect(sanitized.name).toBe('José García-Müller');
  });
});
