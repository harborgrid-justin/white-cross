/**
 * LOC: VALOPS001
 * File: /reuse/threat/composites/downstream/data_layer/composites/validation-operations-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../../_production-patterns.ts
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - class-validator
 *   - class-transformer
 *
 * DOWNSTREAM (imported by):
 *   - Data validation services
 *   - Input sanitization modules
 *   - API validation pipelines
 *   - Form validation handlers
 */

/**
 * File: /reuse/threat/composites/downstream/data_layer/composites/validation-operations-kit.ts
 * Locator: WC-DATALAYER-VALOPS-001
 * Purpose: Comprehensive data validation operations for threat intelligence platform
 *
 * Upstream: _production-patterns.ts
 * Downstream: All services requiring input validation, API endpoints, form handlers
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, class-validator
 * Exports: 48 validation functions, custom validators, validation decorators, DTOs
 *
 * LLM Context: Production-ready validation operations for White Cross healthcare threat
 * intelligence platform. Provides comprehensive field validation, type validation, range
 * validation, custom business rule validators, cross-field validation, and HIPAA-compliant
 * validation patterns. All validators include proper error messages, context tracking, and
 * detailed validation reporting for debugging and compliance auditing.
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Injectable,
  Logger,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiProperty,
  ApiPropertyOptional,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsArray,
  IsDate,
  IsEmail,
  IsUrl,
  IsUUID,
  Min,
  Max,
  MinLength,
  MaxLength,
  Matches,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidateNested,
  registerDecorator,
  ValidationOptions,
  ArrayMinSize,
  ArrayMaxSize,
  IsInt,
  IsPositive,
  IsNegative,
  IsDefined,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  createSuccessResponse,
  createCreatedResponse,
  generateRequestId,
  createLogger,
  BadRequestError,
  NotFoundError,
  parseValidationErrors,
  isValidUUID,
} from '../../_production-patterns';

// ============================================================================
// TYPE DEFINITIONS & ENUMS
// ============================================================================

export enum ValidationType {
  REQUIRED = 'REQUIRED',
  OPTIONAL = 'OPTIONAL',
  CONDITIONAL = 'CONDITIONAL',
}

export enum ValidationSeverity {
  ERROR = 'ERROR',
  WARNING = 'WARNING',
  INFO = 'INFO',
}

export enum DataFormat {
  EMAIL = 'EMAIL',
  URL = 'URL',
  UUID = 'UUID',
  PHONE = 'PHONE',
  SSN = 'SSN',
  DATE = 'DATE',
  DATETIME = 'DATETIME',
  IPV4 = 'IPV4',
  IPV6 = 'IPV6',
  MAC_ADDRESS = 'MAC_ADDRESS',
}

export interface ValidationResult {
  valid: boolean;
  field: string;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  metadata?: Record<string, any>;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: any;
  constraint?: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
  suggestion?: string;
}

export interface ValidationContext {
  requestId: string;
  userId?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface FieldValidationRule {
  field: string;
  type: ValidationType;
  format?: DataFormat;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  customValidator?: (value: any) => boolean;
  errorMessage?: string;
}

// ============================================================================
// CUSTOM VALIDATOR CONSTRAINTS
// ============================================================================

/**
 * Custom validator for phone numbers (US format)
 */
@ValidatorConstraint({ name: 'isPhoneNumber', async: false })
export class IsPhoneNumberConstraint implements ValidatorConstraintInterface {
  validate(phoneNumber: string, args: ValidationArguments) {
    if (!phoneNumber) return false;
    // US phone format: (123) 456-7890 or 123-456-7890 or 1234567890
    const phoneRegex = /^(\+1[-.\s]?)?(\()?[2-9]\d{2}(\))?[-.\s]?[2-9]\d{2}[-.\s]?\d{4}$/;
    return phoneRegex.test(phoneNumber);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Invalid phone number format. Expected US format: (123) 456-7890';
  }
}

/**
 * Custom validator for SSN (HIPAA-compliant, encrypted storage recommended)
 */
@ValidatorConstraint({ name: 'isSSN', async: false })
export class IsSSNConstraint implements ValidatorConstraintInterface {
  validate(ssn: string, args: ValidationArguments) {
    if (!ssn) return false;
    // SSN format: 123-45-6789
    const ssnRegex = /^\d{3}-\d{2}-\d{4}$/;
    return ssnRegex.test(ssn);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Invalid SSN format. Expected format: XXX-XX-XXXX';
  }
}

/**
 * Custom validator for IP addresses (IPv4 and IPv6)
 */
@ValidatorConstraint({ name: 'isIPAddress', async: false })
export class IsIPAddressConstraint implements ValidatorConstraintInterface {
  validate(ip: string, args: ValidationArguments) {
    if (!ip) return false;
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;

    if (ipv4Regex.test(ip)) {
      const parts = ip.split('.');
      return parts.every(part => parseInt(part) >= 0 && parseInt(part) <= 255);
    }

    return ipv6Regex.test(ip);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Invalid IP address format. Expected IPv4 or IPv6 format';
  }
}

/**
 * Custom validator for MAC addresses
 */
@ValidatorConstraint({ name: 'isMACAddress', async: false })
export class IsMACAddressConstraint implements ValidatorConstraintInterface {
  validate(mac: string, args: ValidationArguments) {
    if (!mac) return false;
    // MAC format: AA:BB:CC:DD:EE:FF or AA-BB-CC-DD-EE-FF
    const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
    return macRegex.test(mac);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Invalid MAC address format. Expected format: AA:BB:CC:DD:EE:FF';
  }
}

/**
 * Custom validator for credit card numbers (Luhn algorithm)
 */
@ValidatorConstraint({ name: 'isCreditCard', async: false })
export class IsCreditCardConstraint implements ValidatorConstraintInterface {
  validate(cardNumber: string, args: ValidationArguments) {
    if (!cardNumber) return false;
    const sanitized = cardNumber.replace(/\s|-/g, '');
    if (!/^\d{13,19}$/.test(sanitized)) return false;

    // Luhn algorithm
    let sum = 0;
    let isEven = false;

    for (let i = sanitized.length - 1; i >= 0; i--) {
      let digit = parseInt(sanitized[i]);

      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Invalid credit card number';
  }
}

/**
 * Custom validator for strong passwords
 */
@ValidatorConstraint({ name: 'isStrongPassword', async: false })
export class IsStrongPasswordConstraint implements ValidatorConstraintInterface {
  validate(password: string, args: ValidationArguments) {
    if (!password) return false;

    // At least 12 characters, 1 uppercase, 1 lowercase, 1 number, 1 special char
    const minLength = password.length >= 12;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    return minLength && hasUppercase && hasLowercase && hasNumber && hasSpecial;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Password must be at least 12 characters and contain uppercase, lowercase, number, and special character';
  }
}

// ============================================================================
// CUSTOM DECORATOR FUNCTIONS
// ============================================================================

/**
 * Decorator for phone number validation
 */
export function IsPhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPhoneNumberConstraint,
    });
  };
}

/**
 * Decorator for SSN validation (HIPAA-compliant)
 */
export function IsSSN(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsSSNConstraint,
    });
  };
}

/**
 * Decorator for IP address validation
 */
export function IsIPAddress(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsIPAddressConstraint,
    });
  };
}

/**
 * Decorator for MAC address validation
 */
export function IsMACAddress(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsMACAddressConstraint,
    });
  };
}

/**
 * Decorator for credit card validation
 */
export function IsCreditCard(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCreditCardConstraint,
    });
  };
}

/**
 * Decorator for strong password validation
 */
export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsStrongPasswordConstraint,
    });
  };
}

// ============================================================================
// DTOs
// ============================================================================

export class ValidateFieldDto {
  @ApiProperty({ description: 'Field name to validate', example: 'email' })
  @IsString()
  @IsNotEmpty()
  field: string;

  @ApiProperty({ description: 'Value to validate', example: 'user@example.com' })
  @IsDefined()
  value: any;

  @ApiProperty({ description: 'Validation type', enum: ValidationType })
  @IsEnum(ValidationType)
  type: ValidationType;

  @ApiPropertyOptional({ description: 'Data format', enum: DataFormat })
  @IsEnum(DataFormat)
  @IsOptional()
  format?: DataFormat;

  @ApiPropertyOptional({ description: 'Minimum length for strings' })
  @IsNumber()
  @IsOptional()
  minLength?: number;

  @ApiPropertyOptional({ description: 'Maximum length for strings' })
  @IsNumber()
  @IsOptional()
  maxLength?: number;

  @ApiPropertyOptional({ description: 'Minimum value for numbers' })
  @IsNumber()
  @IsOptional()
  min?: number;

  @ApiPropertyOptional({ description: 'Maximum value for numbers' })
  @IsNumber()
  @IsOptional()
  max?: number;

  @ApiPropertyOptional({ description: 'Regex pattern for validation' })
  @IsString()
  @IsOptional()
  pattern?: string;
}

export class BulkValidationDto {
  @ApiProperty({ description: 'Array of field validations', type: [ValidateFieldDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ValidateFieldDto)
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  fields: ValidateFieldDto[];

  @ApiPropertyOptional({ description: 'Stop on first error' })
  @IsBoolean()
  @IsOptional()
  stopOnFirstError?: boolean = false;
}

export class ValidationRuleDto {
  @ApiProperty({ description: 'Field name', example: 'email' })
  @IsString()
  @IsNotEmpty()
  field: string;

  @ApiProperty({ description: 'Validation type', enum: ValidationType })
  @IsEnum(ValidationType)
  type: ValidationType;

  @ApiPropertyOptional({ description: 'Format constraint', enum: DataFormat })
  @IsEnum(DataFormat)
  @IsOptional()
  format?: DataFormat;

  @ApiPropertyOptional({ description: 'Custom error message' })
  @IsString()
  @IsOptional()
  errorMessage?: string;
}

export class CrossFieldValidationDto {
  @ApiProperty({ description: 'Primary field name', example: 'password' })
  @IsString()
  @IsNotEmpty()
  field1: string;

  @ApiProperty({ description: 'Secondary field name', example: 'confirmPassword' })
  @IsString()
  @IsNotEmpty()
  field2: string;

  @ApiProperty({ description: 'Primary field value' })
  @IsDefined()
  value1: any;

  @ApiProperty({ description: 'Secondary field value' })
  @IsDefined()
  value2: any;

  @ApiProperty({ description: 'Validation operation', enum: ['equals', 'not_equals', 'greater_than', 'less_than'] })
  @IsString()
  @IsIn(['equals', 'not_equals', 'greater_than', 'less_than'])
  operation: string;
}

// ============================================================================
// VALIDATION SERVICE
// ============================================================================

@Injectable()
export class ValidationOperationsService {
  private readonly logger = createLogger(ValidationOperationsService.name);

  /**
   * Validate required field presence
   * @param value - Value to validate
   * @param fieldName - Name of field being validated
   * @returns Validation result
   */
  validateRequired(value: any, fieldName: string): ValidationResult {
    const errors: ValidationError[] = [];
    const valid = value !== null && value !== undefined && value !== '';

    if (!valid) {
      errors.push({
        field: fieldName,
        message: `${fieldName} is required`,
        code: 'REQUIRED_FIELD_MISSING',
      });
    }

    return { valid, field: fieldName, errors, warnings: [] };
  }

  /**
   * Validate string length constraints
   * @param value - String value to validate
   * @param fieldName - Name of field
   * @param minLength - Minimum length
   * @param maxLength - Maximum length
   * @returns Validation result
   */
  validateStringLength(value: string, fieldName: string, minLength?: number, maxLength?: number): ValidationResult {
    const errors: ValidationError[] = [];
    let valid = true;

    if (typeof value !== 'string') {
      errors.push({
        field: fieldName,
        message: `${fieldName} must be a string`,
        code: 'INVALID_TYPE',
        value,
      });
      return { valid: false, field: fieldName, errors, warnings: [] };
    }

    if (minLength !== undefined && value.length < minLength) {
      valid = false;
      errors.push({
        field: fieldName,
        message: `${fieldName} must be at least ${minLength} characters`,
        code: 'MIN_LENGTH_VIOLATION',
        value,
        constraint: `minLength=${minLength}`,
      });
    }

    if (maxLength !== undefined && value.length > maxLength) {
      valid = false;
      errors.push({
        field: fieldName,
        message: `${fieldName} must be at most ${maxLength} characters`,
        code: 'MAX_LENGTH_VIOLATION',
        value,
        constraint: `maxLength=${maxLength}`,
      });
    }

    return { valid, field: fieldName, errors, warnings: [] };
  }

  /**
   * Validate number range constraints
   * @param value - Number value to validate
   * @param fieldName - Name of field
   * @param min - Minimum value
   * @param max - Maximum value
   * @returns Validation result
   */
  validateNumberRange(value: number, fieldName: string, min?: number, max?: number): ValidationResult {
    const errors: ValidationError[] = [];
    let valid = true;

    if (typeof value !== 'number' || isNaN(value)) {
      errors.push({
        field: fieldName,
        message: `${fieldName} must be a valid number`,
        code: 'INVALID_NUMBER',
        value,
      });
      return { valid: false, field: fieldName, errors, warnings: [] };
    }

    if (min !== undefined && value < min) {
      valid = false;
      errors.push({
        field: fieldName,
        message: `${fieldName} must be at least ${min}`,
        code: 'MIN_VALUE_VIOLATION',
        value,
        constraint: `min=${min}`,
      });
    }

    if (max !== undefined && value > max) {
      valid = false;
      errors.push({
        field: fieldName,
        message: `${fieldName} must be at most ${max}`,
        code: 'MAX_VALUE_VIOLATION',
        value,
        constraint: `max=${max}`,
      });
    }

    return { valid, field: fieldName, errors, warnings: [] };
  }

  /**
   * Validate email address format
   * @param email - Email to validate
   * @param fieldName - Name of field
   * @returns Validation result
   */
  validateEmail(email: string, fieldName: string = 'email'): ValidationResult {
    const errors: ValidationError[] = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const valid = emailRegex.test(email);

    if (!valid) {
      errors.push({
        field: fieldName,
        message: 'Invalid email address format',
        code: 'INVALID_EMAIL_FORMAT',
        value: email,
      });
    }

    return { valid, field: fieldName, errors, warnings: [] };
  }

  /**
   * Validate URL format
   * @param url - URL to validate
   * @param fieldName - Name of field
   * @returns Validation result
   */
  validateUrl(url: string, fieldName: string = 'url'): ValidationResult {
    const errors: ValidationError[] = [];
    let valid = false;

    try {
      new URL(url);
      valid = true;
    } catch (e) {
      errors.push({
        field: fieldName,
        message: 'Invalid URL format',
        code: 'INVALID_URL_FORMAT',
        value: url,
      });
    }

    return { valid, field: fieldName, errors, warnings: [] };
  }

  /**
   * Validate UUID format
   * @param uuid - UUID to validate
   * @param fieldName - Name of field
   * @returns Validation result
   */
  validateUUID(uuid: string, fieldName: string = 'id'): ValidationResult {
    const errors: ValidationError[] = [];
    const valid = isValidUUID(uuid);

    if (!valid) {
      errors.push({
        field: fieldName,
        message: 'Invalid UUID format',
        code: 'INVALID_UUID_FORMAT',
        value: uuid,
      });
    }

    return { valid, field: fieldName, errors, warnings: [] };
  }

  /**
   * Validate date format and range
   * @param date - Date to validate
   * @param fieldName - Name of field
   * @param minDate - Minimum date
   * @param maxDate - Maximum date
   * @returns Validation result
   */
  validateDate(date: Date | string, fieldName: string, minDate?: Date, maxDate?: Date): ValidationResult {
    const errors: ValidationError[] = [];
    let valid = true;

    const parsedDate = date instanceof Date ? date : new Date(date);

    if (isNaN(parsedDate.getTime())) {
      errors.push({
        field: fieldName,
        message: `${fieldName} is not a valid date`,
        code: 'INVALID_DATE',
        value: date,
      });
      return { valid: false, field: fieldName, errors, warnings: [] };
    }

    if (minDate && parsedDate < minDate) {
      valid = false;
      errors.push({
        field: fieldName,
        message: `${fieldName} must be after ${minDate.toISOString()}`,
        code: 'DATE_TOO_EARLY',
        value: date,
      });
    }

    if (maxDate && parsedDate > maxDate) {
      valid = false;
      errors.push({
        field: fieldName,
        message: `${fieldName} must be before ${maxDate.toISOString()}`,
        code: 'DATE_TOO_LATE',
        value: date,
      });
    }

    return { valid, field: fieldName, errors, warnings: [] };
  }

  /**
   * Validate phone number format
   * @param phone - Phone number to validate
   * @param fieldName - Name of field
   * @returns Validation result
   */
  validatePhoneNumber(phone: string, fieldName: string = 'phone'): ValidationResult {
    const errors: ValidationError[] = [];
    const constraint = new IsPhoneNumberConstraint();
    const valid = constraint.validate(phone, {} as ValidationArguments);

    if (!valid) {
      errors.push({
        field: fieldName,
        message: constraint.defaultMessage({} as ValidationArguments),
        code: 'INVALID_PHONE_FORMAT',
        value: phone,
      });
    }

    return { valid, field: fieldName, errors, warnings: [] };
  }

  /**
   * Validate IP address format (IPv4/IPv6)
   * @param ip - IP address to validate
   * @param fieldName - Name of field
   * @returns Validation result
   */
  validateIPAddress(ip: string, fieldName: string = 'ipAddress'): ValidationResult {
    const errors: ValidationError[] = [];
    const constraint = new IsIPAddressConstraint();
    const valid = constraint.validate(ip, {} as ValidationArguments);

    if (!valid) {
      errors.push({
        field: fieldName,
        message: constraint.defaultMessage({} as ValidationArguments),
        code: 'INVALID_IP_FORMAT',
        value: ip,
      });
    }

    return { valid, field: fieldName, errors, warnings: [] };
  }

  /**
   * Validate array size constraints
   * @param array - Array to validate
   * @param fieldName - Name of field
   * @param minSize - Minimum size
   * @param maxSize - Maximum size
   * @returns Validation result
   */
  validateArraySize(array: any[], fieldName: string, minSize?: number, maxSize?: number): ValidationResult {
    const errors: ValidationError[] = [];
    let valid = true;

    if (!Array.isArray(array)) {
      errors.push({
        field: fieldName,
        message: `${fieldName} must be an array`,
        code: 'INVALID_TYPE',
        value: array,
      });
      return { valid: false, field: fieldName, errors, warnings: [] };
    }

    if (minSize !== undefined && array.length < minSize) {
      valid = false;
      errors.push({
        field: fieldName,
        message: `${fieldName} must contain at least ${minSize} items`,
        code: 'MIN_ARRAY_SIZE_VIOLATION',
        value: array.length,
        constraint: `minSize=${minSize}`,
      });
    }

    if (maxSize !== undefined && array.length > maxSize) {
      valid = false;
      errors.push({
        field: fieldName,
        message: `${fieldName} must contain at most ${maxSize} items`,
        code: 'MAX_ARRAY_SIZE_VIOLATION',
        value: array.length,
        constraint: `maxSize=${maxSize}`,
      });
    }

    return { valid, field: fieldName, errors, warnings: [] };
  }

  /**
   * Validate regex pattern match
   * @param value - Value to validate
   * @param pattern - Regex pattern
   * @param fieldName - Name of field
   * @returns Validation result
   */
  validatePattern(value: string, pattern: RegExp, fieldName: string): ValidationResult {
    const errors: ValidationError[] = [];
    const valid = pattern.test(value);

    if (!valid) {
      errors.push({
        field: fieldName,
        message: `${fieldName} does not match required pattern`,
        code: 'PATTERN_MISMATCH',
        value,
        constraint: pattern.toString(),
      });
    }

    return { valid, field: fieldName, errors, warnings: [] };
  }

  /**
   * Validate enum value
   * @param value - Value to validate
   * @param enumValues - Allowed enum values
   * @param fieldName - Name of field
   * @returns Validation result
   */
  validateEnum(value: any, enumValues: any[], fieldName: string): ValidationResult {
    const errors: ValidationError[] = [];
    const valid = enumValues.includes(value);

    if (!valid) {
      errors.push({
        field: fieldName,
        message: `${fieldName} must be one of: ${enumValues.join(', ')}`,
        code: 'INVALID_ENUM_VALUE',
        value,
        constraint: `enum=[${enumValues.join(', ')}]`,
      });
    }

    return { valid, field: fieldName, errors, warnings: [] };
  }

  /**
   * Validate boolean type
   * @param value - Value to validate
   * @param fieldName - Name of field
   * @returns Validation result
   */
  validateBoolean(value: any, fieldName: string): ValidationResult {
    const errors: ValidationError[] = [];
    const valid = typeof value === 'boolean';

    if (!valid) {
      errors.push({
        field: fieldName,
        message: `${fieldName} must be a boolean`,
        code: 'INVALID_BOOLEAN',
        value,
      });
    }

    return { valid, field: fieldName, errors, warnings: [] };
  }

  /**
   * Validate integer type
   * @param value - Value to validate
   * @param fieldName - Name of field
   * @returns Validation result
   */
  validateInteger(value: any, fieldName: string): ValidationResult {
    const errors: ValidationError[] = [];
    const valid = Number.isInteger(value);

    if (!valid) {
      errors.push({
        field: fieldName,
        message: `${fieldName} must be an integer`,
        code: 'INVALID_INTEGER',
        value,
      });
    }

    return { valid, field: fieldName, errors, warnings: [] };
  }

  /**
   * Validate positive number
   * @param value - Value to validate
   * @param fieldName - Name of field
   * @returns Validation result
   */
  validatePositive(value: number, fieldName: string): ValidationResult {
    const errors: ValidationError[] = [];
    const valid = typeof value === 'number' && value > 0;

    if (!valid) {
      errors.push({
        field: fieldName,
        message: `${fieldName} must be a positive number`,
        code: 'INVALID_POSITIVE',
        value,
      });
    }

    return { valid, field: fieldName, errors, warnings: [] };
  }

  /**
   * Validate negative number
   * @param value - Value to validate
   * @param fieldName - Name of field
   * @returns Validation result
   */
  validateNegative(value: number, fieldName: string): ValidationResult {
    const errors: ValidationError[] = [];
    const valid = typeof value === 'number' && value < 0;

    if (!valid) {
      errors.push({
        field: fieldName,
        message: `${fieldName} must be a negative number`,
        code: 'INVALID_NEGATIVE',
        value,
      });
    }

    return { valid, field: fieldName, errors, warnings: [] };
  }

  /**
   * Validate JSON format
   * @param value - Value to validate
   * @param fieldName - Name of field
   * @returns Validation result
   */
  validateJSON(value: string, fieldName: string): ValidationResult {
    const errors: ValidationError[] = [];
    let valid = true;

    try {
      JSON.parse(value);
    } catch (e) {
      valid = false;
      errors.push({
        field: fieldName,
        message: `${fieldName} must be valid JSON`,
        code: 'INVALID_JSON',
        value,
      });
    }

    return { valid, field: fieldName, errors, warnings: [] };
  }

  /**
   * Validate cross-field equality
   * @param field1 - First field name
   * @param field2 - Second field name
   * @param value1 - First field value
   * @param value2 - Second field value
   * @returns Validation result
   */
  validateFieldsMatch(field1: string, field2: string, value1: any, value2: any): ValidationResult {
    const errors: ValidationError[] = [];
    const valid = value1 === value2;

    if (!valid) {
      errors.push({
        field: field2,
        message: `${field2} must match ${field1}`,
        code: 'FIELD_MISMATCH',
        value: value2,
      });
    }

    return { valid, field: field2, errors, warnings: [] };
  }

  /**
   * Validate conditional field based on another field
   * @param condition - Condition to check
   * @param value - Value to validate if condition is true
   * @param fieldName - Name of field
   * @returns Validation result
   */
  validateConditional(condition: boolean, value: any, fieldName: string): ValidationResult {
    const errors: ValidationError[] = [];
    let valid = true;

    if (condition) {
      valid = value !== null && value !== undefined && value !== '';
      if (!valid) {
        errors.push({
          field: fieldName,
          message: `${fieldName} is required when condition is met`,
          code: 'CONDITIONAL_FIELD_MISSING',
        });
      }
    }

    return { valid, field: fieldName, errors, warnings: [] };
  }

  /**
   * Validate multiple fields in bulk
   * @param dto - Bulk validation DTO
   * @param context - Validation context
   * @returns Array of validation results
   */
  async bulkValidate(dto: BulkValidationDto, context: ValidationContext): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    try {
      this.logger.log(`Bulk validation started for ${dto.fields.length} fields (${context.requestId})`);

      for (const field of dto.fields) {
        let result: ValidationResult;

        switch (field.format) {
          case DataFormat.EMAIL:
            result = this.validateEmail(field.value, field.field);
            break;
          case DataFormat.URL:
            result = this.validateUrl(field.value, field.field);
            break;
          case DataFormat.UUID:
            result = this.validateUUID(field.value, field.field);
            break;
          case DataFormat.PHONE:
            result = this.validatePhoneNumber(field.value, field.field);
            break;
          case DataFormat.IPV4:
          case DataFormat.IPV6:
            result = this.validateIPAddress(field.value, field.field);
            break;
          default:
            if (field.minLength || field.maxLength) {
              result = this.validateStringLength(field.value, field.field, field.minLength, field.maxLength);
            } else if (field.min !== undefined || field.max !== undefined) {
              result = this.validateNumberRange(field.value, field.field, field.min, field.max);
            } else {
              result = this.validateRequired(field.value, field.field);
            }
        }

        results.push(result);

        if (dto.stopOnFirstError && !result.valid) {
          break;
        }
      }

      this.logger.log(`Bulk validation completed: ${results.filter(r => r.valid).length}/${results.length} passed`);

      return results;
    } catch (error) {
      this.logger.error(`Bulk validation failed: ${(error as Error).message}`);
      throw new BadRequestError('Bulk validation failed', { requestId: context.requestId });
    }
  }

  /**
   * Validate with custom rules
   * @param value - Value to validate
   * @param rules - Array of validation rules
   * @param fieldName - Name of field
   * @returns Validation result
   */
  validateWithRules(value: any, rules: FieldValidationRule[], fieldName: string): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    let valid = true;

    for (const rule of rules) {
      let ruleResult: ValidationResult;

      if (rule.type === ValidationType.REQUIRED) {
        ruleResult = this.validateRequired(value, rule.field);
      } else if (rule.format) {
        switch (rule.format) {
          case DataFormat.EMAIL:
            ruleResult = this.validateEmail(value, rule.field);
            break;
          case DataFormat.URL:
            ruleResult = this.validateUrl(value, rule.field);
            break;
          case DataFormat.UUID:
            ruleResult = this.validateUUID(value, rule.field);
            break;
          default:
            ruleResult = this.validateRequired(value, rule.field);
        }
      } else if (rule.minLength || rule.maxLength) {
        ruleResult = this.validateStringLength(value, rule.field, rule.minLength, rule.maxLength);
      } else if (rule.pattern) {
        ruleResult = this.validatePattern(value, rule.pattern, rule.field);
      } else if (rule.customValidator) {
        const customValid = rule.customValidator(value);
        ruleResult = {
          valid: customValid,
          field: rule.field,
          errors: customValid ? [] : [{
            field: rule.field,
            message: rule.errorMessage || 'Custom validation failed',
            code: 'CUSTOM_VALIDATION_FAILED',
            value,
          }],
          warnings: [],
        };
      } else {
        continue;
      }

      if (!ruleResult.valid) {
        valid = false;
        errors.push(...ruleResult.errors);
      }
      warnings.push(...ruleResult.warnings);
    }

    return { valid, field: fieldName, errors, warnings };
  }

  /**
   * Generate validation report
   * @param results - Array of validation results
   * @returns Formatted validation report
   */
  generateValidationReport(results: ValidationResult[]): {
    totalFields: number;
    validFields: number;
    invalidFields: number;
    errors: ValidationError[];
    warnings: ValidationWarning[];
  } {
    const totalFields = results.length;
    const validFields = results.filter(r => r.valid).length;
    const invalidFields = totalFields - validFields;
    const errors = results.flatMap(r => r.errors);
    const warnings = results.flatMap(r => r.warnings);

    return {
      totalFields,
      validFields,
      invalidFields,
      errors,
      warnings,
    };
  }

  /**
   * Validate HIPAA-compliant field (no logging of sensitive data)
   * @param value - Value to validate
   * @param fieldName - Name of field
   * @param format - Data format
   * @returns Validation result (sanitized)
   */
  validateHIPAAField(value: any, fieldName: string, format?: DataFormat): ValidationResult {
    let result: ValidationResult;

    switch (format) {
      case DataFormat.SSN:
        const constraint = new IsSSNConstraint();
        const valid = constraint.validate(value, {} as ValidationArguments);
        result = {
          valid,
          field: fieldName,
          errors: valid ? [] : [{
            field: fieldName,
            message: 'Invalid SSN format',
            code: 'INVALID_SSN',
            // DO NOT include value in error for HIPAA compliance
          }],
          warnings: [],
        };
        break;
      default:
        result = this.validateRequired(value, fieldName);
        // Remove sensitive value from errors
        result.errors = result.errors.map(err => ({ ...err, value: undefined }));
    }

    // Log validation without sensitive data
    this.logger.log(`HIPAA field validated: ${fieldName} (format: ${format}) - Valid: ${result.valid}`);

    return result;
  }

  /**
   * Validate MAC address format
   * @param mac - MAC address to validate
   * @param fieldName - Name of field
   * @returns Validation result
   */
  validateMACAddress(mac: string, fieldName: string = 'macAddress'): ValidationResult {
    const errors: ValidationError[] = [];
    const constraint = new IsMACAddressConstraint();
    const valid = constraint.validate(mac, {} as ValidationArguments);

    if (!valid) {
      errors.push({
        field: fieldName,
        message: constraint.defaultMessage({} as ValidationArguments),
        code: 'INVALID_MAC_ADDRESS',
        value: mac,
      });
    }

    return { valid, field: fieldName, errors, warnings: [] };
  }

  /**
   * Validate credit card number (PCI-DSS compliant - do not log)
   * @param cardNumber - Credit card number
   * @param fieldName - Name of field
   * @returns Validation result
   */
  validateCreditCard(cardNumber: string, fieldName: string = 'cardNumber'): ValidationResult {
    const constraint = new IsCreditCardConstraint();
    const valid = constraint.validate(cardNumber, {} as ValidationArguments);

    const errors: ValidationError[] = valid ? [] : [{
      field: fieldName,
      message: constraint.defaultMessage({} as ValidationArguments),
      code: 'INVALID_CREDIT_CARD',
      // DO NOT include card number in error for PCI-DSS compliance
    }];

    this.logger.log(`Credit card validation: ${fieldName} - Valid: ${valid}`);

    return { valid, field: fieldName, errors, warnings: [] };
  }

  /**
   * Validate strong password
   * @param password - Password to validate
   * @param fieldName - Name of field
   * @returns Validation result
   */
  validateStrongPassword(password: string, fieldName: string = 'password'): ValidationResult {
    const constraint = new IsStrongPasswordConstraint();
    const valid = constraint.validate(password, {} as ValidationArguments);

    const errors: ValidationError[] = valid ? [] : [{
      field: fieldName,
      message: constraint.defaultMessage({} as ValidationArguments),
      code: 'WEAK_PASSWORD',
      // DO NOT include password in error
    }];

    return { valid, field: fieldName, errors, warnings: [] };
  }

  /**
   * Validate object structure matches schema
   * @param obj - Object to validate
   * @param schema - Expected schema structure
   * @param fieldName - Name of field
   * @returns Validation result
   */
  validateObjectSchema(obj: any, schema: Record<string, string>, fieldName: string): ValidationResult {
    const errors: ValidationError[] = [];
    let valid = true;

    if (typeof obj !== 'object' || obj === null) {
      return {
        valid: false,
        field: fieldName,
        errors: [{
          field: fieldName,
          message: `${fieldName} must be an object`,
          code: 'INVALID_OBJECT',
          value: obj,
        }],
        warnings: [],
      };
    }

    for (const [key, expectedType] of Object.entries(schema)) {
      const actualType = typeof obj[key];
      if (actualType !== expectedType && obj[key] !== undefined) {
        valid = false;
        errors.push({
          field: `${fieldName}.${key}`,
          message: `${key} must be of type ${expectedType}, got ${actualType}`,
          code: 'TYPE_MISMATCH',
          value: obj[key],
        });
      }
    }

    return { valid, field: fieldName, errors, warnings: [] };
  }

  /**
   * Validate file extension
   * @param filename - Filename to validate
   * @param allowedExtensions - Array of allowed extensions
   * @param fieldName - Name of field
   * @returns Validation result
   */
  validateFileExtension(filename: string, allowedExtensions: string[], fieldName: string = 'file'): ValidationResult {
    const errors: ValidationError[] = [];
    const extension = filename.split('.').pop()?.toLowerCase();
    const valid = extension ? allowedExtensions.includes(extension) : false;

    if (!valid) {
      errors.push({
        field: fieldName,
        message: `File extension must be one of: ${allowedExtensions.join(', ')}`,
        code: 'INVALID_FILE_EXTENSION',
        value: extension,
      });
    }

    return { valid, field: fieldName, errors, warnings: [] };
  }

  /**
   * Validate file size
   * @param fileSize - File size in bytes
   * @param maxSize - Maximum allowed size in bytes
   * @param fieldName - Name of field
   * @returns Validation result
   */
  validateFileSize(fileSize: number, maxSize: number, fieldName: string = 'file'): ValidationResult {
    const errors: ValidationError[] = [];
    const valid = fileSize <= maxSize;

    if (!valid) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
      const actualSizeMB = (fileSize / (1024 * 1024)).toFixed(2);
      errors.push({
        field: fieldName,
        message: `File size (${actualSizeMB}MB) exceeds maximum allowed size (${maxSizeMB}MB)`,
        code: 'FILE_TOO_LARGE',
        value: fileSize,
      });
    }

    return { valid, field: fieldName, errors, warnings: [] };
  }

  /**
   * Validate unique values in array
   * @param array - Array to validate
   * @param fieldName - Name of field
   * @returns Validation result
   */
  validateArrayUniqueness(array: any[], fieldName: string): ValidationResult {
    const errors: ValidationError[] = [];
    const uniqueSet = new Set(array.map(item => JSON.stringify(item)));
    const valid = uniqueSet.size === array.length;

    if (!valid) {
      errors.push({
        field: fieldName,
        message: `${fieldName} must contain only unique values`,
        code: 'DUPLICATE_VALUES',
        value: array.length - uniqueSet.size,
      });
    }

    return { valid, field: fieldName, errors, warnings: [] };
  }

  /**
   * Validate alphanumeric string
   * @param value - Value to validate
   * @param fieldName - Name of field
   * @returns Validation result
   */
  validateAlphanumeric(value: string, fieldName: string): ValidationResult {
    const errors: ValidationError[] = [];
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;
    const valid = alphanumericRegex.test(value);

    if (!valid) {
      errors.push({
        field: fieldName,
        message: `${fieldName} must contain only alphanumeric characters`,
        code: 'INVALID_ALPHANUMERIC',
        value,
      });
    }

    return { valid, field: fieldName, errors, warnings: [] };
  }

  /**
   * Validate hex color code
   * @param color - Color code to validate
   * @param fieldName - Name of field
   * @returns Validation result
   */
  validateHexColor(color: string, fieldName: string = 'color'): ValidationResult {
    const errors: ValidationError[] = [];
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    const valid = hexColorRegex.test(color);

    if (!valid) {
      errors.push({
        field: fieldName,
        message: `${fieldName} must be a valid hex color code (e.g., #FFFFFF or #FFF)`,
        code: 'INVALID_HEX_COLOR',
        value: color,
      });
    }

    return { valid, field: fieldName, errors, warnings: [] };
  }

  /**
   * Validate latitude coordinate
   * @param latitude - Latitude value to validate
   * @param fieldName - Name of field
   * @returns Validation result
   */
  validateLatitude(latitude: number, fieldName: string = 'latitude'): ValidationResult {
    return this.validateNumberRange(latitude, fieldName, -90, 90);
  }

  /**
   * Validate longitude coordinate
   * @param longitude - Longitude value to validate
   * @param fieldName - Name of field
   * @returns Validation result
   */
  validateLongitude(longitude: number, fieldName: string = 'longitude'): ValidationResult {
    return this.validateNumberRange(longitude, fieldName, -180, 180);
  }

  /**
   * Validate port number
   * @param port - Port number to validate
   * @param fieldName - Name of field
   * @returns Validation result
   */
  validatePort(port: number, fieldName: string = 'port'): ValidationResult {
    const intResult = this.validateInteger(port, fieldName);
    if (!intResult.valid) return intResult;

    return this.validateNumberRange(port, fieldName, 1, 65535);
  }

  /**
   * Validate percentage value
   * @param value - Percentage value to validate
   * @param fieldName - Name of field
   * @returns Validation result
   */
  validatePercentage(value: number, fieldName: string = 'percentage'): ValidationResult {
    return this.validateNumberRange(value, fieldName, 0, 100);
  }
}

// ============================================================================
// CONTROLLER
// ============================================================================

@Controller('api/v1/validation-operations')
@ApiTags('Data Validation Operations')
@ApiBearerAuth()
export class ValidationOperationsController {
  private readonly logger = createLogger(ValidationOperationsController.name);

  constructor(private readonly service: ValidationOperationsService) {}

  @Post('field')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validate a single field' })
  @ApiBody({ type: ValidateFieldDto })
  @ApiResponse({ status: 200, description: 'Validation result returned' })
  @ApiResponse({ status: 400, description: 'Invalid validation request' })
  async validateField(@Body() dto: ValidateFieldDto) {
    const requestId = generateRequestId();
    this.logger.log(`Validating field: ${dto.field} (${requestId})`);

    try {
      let result: ValidationResult;

      switch (dto.format) {
        case DataFormat.EMAIL:
          result = this.service.validateEmail(dto.value, dto.field);
          break;
        case DataFormat.URL:
          result = this.service.validateUrl(dto.value, dto.field);
          break;
        case DataFormat.UUID:
          result = this.service.validateUUID(dto.value, dto.field);
          break;
        case DataFormat.PHONE:
          result = this.service.validatePhoneNumber(dto.value, dto.field);
          break;
        case DataFormat.IPV4:
        case DataFormat.IPV6:
          result = this.service.validateIPAddress(dto.value, dto.field);
          break;
        default:
          if (dto.type === ValidationType.REQUIRED) {
            result = this.service.validateRequired(dto.value, dto.field);
          } else if (dto.minLength || dto.maxLength) {
            result = this.service.validateStringLength(dto.value, dto.field, dto.minLength, dto.maxLength);
          } else {
            result = this.service.validateRequired(dto.value, dto.field);
          }
      }

      return createSuccessResponse(result, requestId);
    } catch (error) {
      this.logger.error(`Field validation failed: ${(error as Error).message}`);
      throw new BadRequestError('Field validation failed', { requestId });
    }
  }

  @Post('bulk')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validate multiple fields in bulk' })
  @ApiBody({ type: BulkValidationDto })
  @ApiResponse({ status: 200, description: 'Bulk validation results returned' })
  @ApiResponse({ status: 400, description: 'Invalid bulk validation request' })
  async bulkValidate(@Body() dto: BulkValidationDto) {
    const requestId = generateRequestId();
    const context: ValidationContext = {
      requestId,
      timestamp: new Date(),
    };

    this.logger.log(`Bulk validation requested for ${dto.fields.length} fields (${requestId})`);

    try {
      const results = await this.service.bulkValidate(dto, context);
      const report = this.service.generateValidationReport(results);

      return createSuccessResponse({ results, report }, requestId);
    } catch (error) {
      this.logger.error(`Bulk validation failed: ${(error as Error).message}`);
      throw new BadRequestError('Bulk validation failed', { requestId });
    }
  }

  @Post('cross-field')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validate cross-field relationships' })
  @ApiBody({ type: CrossFieldValidationDto })
  @ApiResponse({ status: 200, description: 'Cross-field validation result returned' })
  @ApiResponse({ status: 400, description: 'Invalid cross-field validation request' })
  async validateCrossField(@Body() dto: CrossFieldValidationDto) {
    const requestId = generateRequestId();
    this.logger.log(`Cross-field validation: ${dto.field1} vs ${dto.field2} (${requestId})`);

    try {
      let result: ValidationResult;

      switch (dto.operation) {
        case 'equals':
          result = this.service.validateFieldsMatch(dto.field1, dto.field2, dto.value1, dto.value2);
          break;
        case 'not_equals':
          const matchResult = this.service.validateFieldsMatch(dto.field1, dto.field2, dto.value1, dto.value2);
          result = { ...matchResult, valid: !matchResult.valid };
          break;
        case 'greater_than':
          result = {
            valid: dto.value1 > dto.value2,
            field: dto.field1,
            errors: dto.value1 > dto.value2 ? [] : [{
              field: dto.field1,
              message: `${dto.field1} must be greater than ${dto.field2}`,
              code: 'COMPARISON_FAILED',
            }],
            warnings: [],
          };
          break;
        case 'less_than':
          result = {
            valid: dto.value1 < dto.value2,
            field: dto.field1,
            errors: dto.value1 < dto.value2 ? [] : [{
              field: dto.field1,
              message: `${dto.field1} must be less than ${dto.field2}`,
              code: 'COMPARISON_FAILED',
            }],
            warnings: [],
          };
          break;
        default:
          throw new BadRequestError('Invalid operation type');
      }

      return createSuccessResponse(result, requestId);
    } catch (error) {
      this.logger.error(`Cross-field validation failed: ${(error as Error).message}`);
      throw new BadRequestError('Cross-field validation failed', { requestId });
    }
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  ValidationOperationsController,
  ValidationOperationsService,
};
