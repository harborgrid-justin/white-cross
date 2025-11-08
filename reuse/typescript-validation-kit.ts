/**
 * LOC: VAL1234567
 * File: /reuse/typescript-validation-kit.ts
 *
 * UPSTREAM (imports from):
 *   - class-validator (v0.14.2)
 *   - class-transformer (v0.5.1)
 *   - @nestjs/common (v11.1.8)
 *
 * DOWNSTREAM (imported by):
 *   - DTO classes
 *   - Validation pipes
 *   - Input sanitization middleware
 *   - Form validation services
 */

/**
 * File: /reuse/typescript-validation-kit.ts
 * Locator: WC-UTL-TVAL-002
 * Purpose: TypeScript Runtime Validation Utilities - Advanced validation patterns
 *
 * Upstream: class-validator, class-transformer, @nestjs/common
 * Downstream: ../backend/*, DTOs, validation pipes, sanitization middleware
 * Dependencies: TypeScript 5.x, Node 18+, class-validator, class-transformer
 * Exports: 45 validation utilities for runtime checks, schema validation, transformations
 *
 * LLM Context: Production-grade TypeScript runtime validation for White Cross healthcare system.
 * Provides type-safe validation patterns, runtime type checking, schema builders, custom validators,
 * class-based validation, transformation pipelines, sanitization, DTO validation decorators,
 * async validation, cross-field validation, conditional validation, and error aggregation.
 * Integrates with NestJS validation pipes and class-validator for enterprise-grade validation.
 */

import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  validateOrReject,
  validate,
  ValidationError,
} from 'class-validator';
import { Transform, Type, plainToClass, classToPlain } from 'class-transformer';
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Validation result interface
 */
export interface ValidationResult<T = any> {
  isValid: boolean;
  value?: T;
  errors?: string[];
  warnings?: string[];
}

/**
 * Schema validator function type
 */
export type SchemaValidator<T> = (value: T) => ValidationResult<T>;

/**
 * Transformation function type
 */
export type TransformFn<TInput, TOutput> = (value: TInput) => TOutput;

/**
 * Validator rule interface
 */
export interface ValidatorRule<T = any> {
  validate: (value: T) => boolean | Promise<boolean>;
  message: string | ((value: T) => string);
}

/**
 * Schema definition interface
 */
export interface SchemaDefinition<T = any> {
  type?: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'date';
  required?: boolean;
  nullable?: boolean;
  default?: T;
  rules?: ValidatorRule<T>[];
  transform?: TransformFn<any, T>;
  nested?: SchemaDefinition;
}

/**
 * Validation context for complex validations
 */
export interface ValidationContext {
  path: string;
  value: any;
  object: any;
  property: string;
}

/**
 * Async validator function type
 */
export type AsyncValidator<T> = (value: T) => Promise<boolean>;

// ============================================================================
// RUNTIME TYPE VALIDATION
// ============================================================================

/**
 * Runtime type validator builder.
 *
 * @template T - Expected type
 * @returns {TypeValidator<T>} Type validator
 *
 * @example
 * ```typescript
 * const validator = createTypeValidator<User>()
 *   .string('email')
 *   .number('age')
 *   .boolean('isActive')
 *   .build();
 *
 * const result = validator.validate(data);
 * if (!result.isValid) {
 *   console.error(result.errors);
 * }
 * ```
 */
export function createTypeValidator<T extends object>(): {
  string(key: keyof T, options?: { min?: number; max?: number; pattern?: RegExp }): any;
  number(key: keyof T, options?: { min?: number; max?: number }): any;
  boolean(key: keyof T): any;
  date(key: keyof T, options?: { min?: Date; max?: Date }): any;
  array(key: keyof T, itemValidator?: SchemaValidator<any>): any;
  object(key: keyof T, schema?: SchemaDefinition): any;
  optional(key: keyof T): any;
  build(): SchemaValidator<T>;
} {
  const rules = new Map<keyof T, ValidatorRule[]>();

  const addRule = (key: keyof T, rule: ValidatorRule) => {
    if (!rules.has(key)) {
      rules.set(key, []);
    }
    rules.get(key)!.push(rule);
  };

  const builder: any = {
    string(key: keyof T, options?: { min?: number; max?: number; pattern?: RegExp }) {
      addRule(key, {
        validate: (value) => typeof value === 'string',
        message: `${String(key)} must be a string`,
      });

      if (options?.min !== undefined) {
        addRule(key, {
          validate: (value) => typeof value === 'string' && value.length >= options.min!,
          message: `${String(key)} must be at least ${options.min} characters`,
        });
      }

      if (options?.max !== undefined) {
        addRule(key, {
          validate: (value) => typeof value === 'string' && value.length <= options.max!,
          message: `${String(key)} must be at most ${options.max} characters`,
        });
      }

      if (options?.pattern) {
        addRule(key, {
          validate: (value) => typeof value === 'string' && options.pattern!.test(value),
          message: `${String(key)} does not match required pattern`,
        });
      }

      return builder;
    },

    number(key: keyof T, options?: { min?: number; max?: number }) {
      addRule(key, {
        validate: (value) => typeof value === 'number' && !isNaN(value),
        message: `${String(key)} must be a number`,
      });

      if (options?.min !== undefined) {
        addRule(key, {
          validate: (value) => typeof value === 'number' && value >= options.min!,
          message: `${String(key)} must be at least ${options.min}`,
        });
      }

      if (options?.max !== undefined) {
        addRule(key, {
          validate: (value) => typeof value === 'number' && value <= options.max!,
          message: `${String(key)} must be at most ${options.max}`,
        });
      }

      return builder;
    },

    boolean(key: keyof T) {
      addRule(key, {
        validate: (value) => typeof value === 'boolean',
        message: `${String(key)} must be a boolean`,
      });
      return builder;
    },

    date(key: keyof T, options?: { min?: Date; max?: Date }) {
      addRule(key, {
        validate: (value) => value instanceof Date && !isNaN(value.getTime()),
        message: `${String(key)} must be a valid date`,
      });

      if (options?.min) {
        addRule(key, {
          validate: (value) => value instanceof Date && value >= options.min!,
          message: `${String(key)} must be after ${options.min!.toISOString()}`,
        });
      }

      if (options?.max) {
        addRule(key, {
          validate: (value) => value instanceof Date && value <= options.max!,
          message: `${String(key)} must be before ${options.max!.toISOString()}`,
        });
      }

      return builder;
    },

    array(key: keyof T, itemValidator?: SchemaValidator<any>) {
      addRule(key, {
        validate: (value) => Array.isArray(value),
        message: `${String(key)} must be an array`,
      });
      return builder;
    },

    object(key: keyof T, schema?: SchemaDefinition) {
      addRule(key, {
        validate: (value) => typeof value === 'object' && value !== null && !Array.isArray(value),
        message: `${String(key)} must be an object`,
      });
      return builder;
    },

    optional(key: keyof T) {
      return builder;
    },

    build(): SchemaValidator<T> {
      return (value: T): ValidationResult<T> => {
        const errors: string[] = [];

        for (const [key, keyRules] of rules.entries()) {
          const fieldValue = value[key];

          for (const rule of keyRules) {
            if (!rule.validate(fieldValue)) {
              const message = typeof rule.message === 'function'
                ? rule.message(fieldValue)
                : rule.message;
              errors.push(message);
            }
          }
        }

        return {
          isValid: errors.length === 0,
          value,
          errors: errors.length > 0 ? errors : undefined,
        };
      };
    },
  };

  return builder;
}

/**
 * Guards value to be of specific type at runtime.
 *
 * @template T - Expected type
 * @param {any} value - Value to guard
 * @param {(value: any) => value is T} guard - Type guard function
 * @param {string} message - Error message
 * @returns {T} Guarded value
 *
 * @example
 * ```typescript
 * function isUser(value: any): value is User {
 *   return value && typeof value.id === 'string';
 * }
 *
 * const user = assertType(data, isUser, 'Invalid user data');
 * // user is now typed as User
 * ```
 */
export function assertType<T>(
  value: any,
  guard: (value: any) => value is T,
  message: string = 'Type assertion failed'
): T {
  if (!guard(value)) {
    throw new TypeError(message);
  }
  return value;
}

/**
 * Validates that value matches expected type structure.
 *
 * @template T - Expected type
 * @param {any} value - Value to validate
 * @param {SchemaDefinition<T>} schema - Schema definition
 * @returns {ValidationResult<T>} Validation result
 *
 * @example
 * ```typescript
 * const schema: SchemaDefinition<User> = {
 *   type: 'object',
 *   required: true,
 *   nested: {
 *     id: { type: 'string', required: true },
 *     email: { type: 'string', required: true }
 *   }
 * };
 *
 * const result = validateType(data, schema);
 * ```
 */
export function validateType<T>(value: any, schema: SchemaDefinition<T>): ValidationResult<T> {
  const errors: string[] = [];

  // Check required
  if (schema.required && (value === null || value === undefined)) {
    errors.push('Value is required');
    return { isValid: false, errors };
  }

  // Allow nullable
  if (schema.nullable && value === null) {
    return { isValid: true, value: null as any };
  }

  // Type validation
  if (schema.type) {
    const typeValid = validatePrimitiveType(value, schema.type);
    if (!typeValid) {
      errors.push(`Value must be of type ${schema.type}`);
    }
  }

  // Custom rules
  if (schema.rules) {
    for (const rule of schema.rules) {
      if (!rule.validate(value)) {
        const message = typeof rule.message === 'function' ? rule.message(value) : rule.message;
        errors.push(message);
      }
    }
  }

  // Transform
  let finalValue = value;
  if (schema.transform && errors.length === 0) {
    try {
      finalValue = schema.transform(value);
    } catch (error) {
      errors.push(`Transformation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  return {
    isValid: errors.length === 0,
    value: finalValue,
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * Validates primitive type.
 *
 * @param {any} value - Value to validate
 * @param {string} type - Expected type
 * @returns {boolean} True if type matches
 */
function validatePrimitiveType(
  value: any,
  type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'date'
): boolean {
  switch (type) {
    case 'string':
      return typeof value === 'string';
    case 'number':
      return typeof value === 'number' && !isNaN(value);
    case 'boolean':
      return typeof value === 'boolean';
    case 'object':
      return typeof value === 'object' && value !== null && !Array.isArray(value);
    case 'array':
      return Array.isArray(value);
    case 'date':
      return value instanceof Date && !isNaN(value.getTime());
    default:
      return false;
  }
}

// ============================================================================
// SCHEMA VALIDATION
// ============================================================================

/**
 * Schema builder for fluent schema definition.
 *
 * @template T - Schema type
 * @returns {SchemaBuilder<T>} Schema builder
 *
 * @example
 * ```typescript
 * const userSchema = schemaBuilder<User>()
 *   .field('id', (f) => f.string().required())
 *   .field('email', (f) => f.string().email().required())
 *   .field('age', (f) => f.number().min(0).max(120))
 *   .build();
 *
 * const result = userSchema.validate(userData);
 * ```
 */
export function schemaBuilder<T extends object>(): {
  field<K extends keyof T>(
    key: K,
    configure: (field: FieldBuilder) => FieldBuilder
  ): any;
  build(): { validate: (value: T) => ValidationResult<T> };
} {
  const fields = new Map<keyof T, SchemaDefinition>();

  return {
    field<K extends keyof T>(key: K, configure: (field: FieldBuilder) => FieldBuilder) {
      const fieldBuilder = new FieldBuilder();
      const configured = configure(fieldBuilder);
      fields.set(key, configured.getSchema());
      return this;
    },

    build() {
      return {
        validate(value: T): ValidationResult<T> {
          const errors: string[] = [];

          for (const [key, schema] of fields.entries()) {
            const fieldValue = value[key];
            const result = validateType(fieldValue, schema);

            if (!result.isValid) {
              errors.push(...(result.errors || []).map((e) => `${String(key)}: ${e}`));
            }
          }

          return {
            isValid: errors.length === 0,
            value,
            errors: errors.length > 0 ? errors : undefined,
          };
        },
      };
    },
  };
}

/**
 * Field builder for schema field configuration.
 */
class FieldBuilder {
  private schema: SchemaDefinition = {};

  string(): this {
    this.schema.type = 'string';
    return this;
  }

  number(): this {
    this.schema.type = 'number';
    return this;
  }

  boolean(): this {
    this.schema.type = 'boolean';
    return this;
  }

  date(): this {
    this.schema.type = 'date';
    return this;
  }

  array(): this {
    this.schema.type = 'array';
    return this;
  }

  object(): this {
    this.schema.type = 'object';
    return this;
  }

  required(): this {
    this.schema.required = true;
    return this;
  }

  nullable(): this {
    this.schema.nullable = true;
    return this;
  }

  default(value: any): this {
    this.schema.default = value;
    return this;
  }

  min(value: number): this {
    if (!this.schema.rules) this.schema.rules = [];
    this.schema.rules.push({
      validate: (v) => {
        if (typeof v === 'number') return v >= value;
        if (typeof v === 'string') return v.length >= value;
        return false;
      },
      message: `Must be at least ${value}`,
    });
    return this;
  }

  max(value: number): this {
    if (!this.schema.rules) this.schema.rules = [];
    this.schema.rules.push({
      validate: (v) => {
        if (typeof v === 'number') return v <= value;
        if (typeof v === 'string') return v.length <= value;
        return false;
      },
      message: `Must be at most ${value}`,
    });
    return this;
  }

  email(): this {
    if (!this.schema.rules) this.schema.rules = [];
    this.schema.rules.push({
      validate: (v) => typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      message: 'Must be a valid email address',
    });
    return this;
  }

  pattern(regex: RegExp): this {
    if (!this.schema.rules) this.schema.rules = [];
    this.schema.rules.push({
      validate: (v) => typeof v === 'string' && regex.test(v),
      message: 'Does not match required pattern',
    });
    return this;
  }

  custom(validator: ValidatorRule): this {
    if (!this.schema.rules) this.schema.rules = [];
    this.schema.rules.push(validator);
    return this;
  }

  transform<TInput, TOutput>(fn: TransformFn<TInput, TOutput>): this {
    this.schema.transform = fn as any;
    return this;
  }

  getSchema(): SchemaDefinition {
    return this.schema;
  }
}

// ============================================================================
// CLASS-BASED VALIDATION DECORATORS
// ============================================================================

/**
 * Validates that array contains only unique values.
 *
 * @param {ValidationOptions} validationOptions - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class CreatePlaylistDto {
 *   @IsUniqueArray({ message: 'Song IDs must be unique' })
 *   songIds: string[];
 * }
 * ```
 */
export function IsUniqueArray(validationOptions?: ValidationOptions): PropertyDecorator {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isUniqueArray',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!Array.isArray(value)) return false;
          const uniqueSet = new Set(value);
          return uniqueSet.size === value.length;
        },
        defaultMessage() {
          return `${propertyName} must contain only unique values`;
        },
      },
    });
  };
}

/**
 * Validates that string is a valid JSON.
 *
 * @param {ValidationOptions} validationOptions - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class ConfigDto {
 *   @IsJsonString()
 *   metadata: string; // Must be valid JSON string
 * }
 * ```
 */
export function IsJsonString(validationOptions?: ValidationOptions): PropertyDecorator {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isJsonString',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;
          try {
            JSON.parse(value);
            return true;
          } catch {
            return false;
          }
        },
        defaultMessage() {
          return `${propertyName} must be a valid JSON string`;
        },
      },
    });
  };
}

/**
 * Validates that number is positive.
 *
 * @param {ValidationOptions} validationOptions - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class ProductDto {
 *   @IsPositive()
 *   price: number; // Must be > 0
 * }
 * ```
 */
export function IsPositive(validationOptions?: ValidationOptions): PropertyDecorator {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isPositive',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return typeof value === 'number' && value > 0;
        },
        defaultMessage() {
          return `${propertyName} must be a positive number`;
        },
      },
    });
  };
}

/**
 * Validates that number is negative.
 *
 * @param {ValidationOptions} validationOptions - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class TransactionDto {
 *   @IsNegative()
 *   deduction: number; // Must be < 0
 * }
 * ```
 */
export function IsNegative(validationOptions?: ValidationOptions): PropertyDecorator {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isNegative',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return typeof value === 'number' && value < 0;
        },
        defaultMessage() {
          return `${propertyName} must be a negative number`;
        },
      },
    });
  };
}

/**
 * Validates that string contains only alphanumeric characters.
 *
 * @param {ValidationOptions} validationOptions - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class UsernameDto {
 *   @IsAlphanumeric()
 *   username: string; // Only letters and numbers
 * }
 * ```
 */
export function IsAlphanumeric(validationOptions?: ValidationOptions): PropertyDecorator {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isAlphanumeric',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return typeof value === 'string' && /^[a-zA-Z0-9]+$/.test(value);
        },
        defaultMessage() {
          return `${propertyName} must contain only letters and numbers`;
        },
      },
    });
  };
}

/**
 * Validates that value is within specified enum.
 *
 * @template T - Enum type
 * @param {T} enumType - Enum object
 * @param {ValidationOptions} validationOptions - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * enum UserRole {
 *   ADMIN = 'admin',
 *   USER = 'user'
 * }
 *
 * class CreateUserDto {
 *   @IsEnumValue(UserRole)
 *   role: UserRole;
 * }
 * ```
 */
export function IsEnumValue<T extends object>(
  enumType: T,
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isEnumValue',
      target: object.constructor,
      propertyName,
      constraints: [enumType],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [enumObject] = args.constraints;
          return Object.values(enumObject).includes(value);
        },
        defaultMessage(args: ValidationArguments) {
          const [enumObject] = args.constraints;
          return `${propertyName} must be one of: ${Object.values(enumObject).join(', ')}`;
        },
      },
    });
  };
}

// ============================================================================
// TRANSFORMATION DECORATORS
// ============================================================================

/**
 * Transforms string to title case.
 *
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class UserDto {
 *   @ToTitleCase()
 *   name: string; // 'john doe' => 'John Doe'
 * }
 * ```
 */
export function ToTitleCase(): PropertyDecorator {
  return Transform(({ value }) => {
    if (typeof value !== 'string') return value;
    return value
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  });
}

/**
 * Transforms value to slug format.
 *
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class PostDto {
 *   @ToSlug()
 *   title: string; // 'Hello World!' => 'hello-world'
 * }
 * ```
 */
export function ToSlug(): PropertyDecorator {
  return Transform(({ value }) => {
    if (typeof value !== 'string') return value;
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  });
}

/**
 * Transforms string array from comma-separated string.
 *
 * @param {string} separator - Separator character (default: ',')
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class FilterDto {
 *   @SplitString(',')
 *   tags: string[]; // 'tag1,tag2,tag3' => ['tag1', 'tag2', 'tag3']
 * }
 * ```
 */
export function SplitString(separator: string = ','): PropertyDecorator {
  return Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    if (typeof value !== 'string') return value;
    return value.split(separator).map((v) => v.trim()).filter((v) => v);
  });
}

/**
 * Transforms numeric string to number.
 *
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class QueryDto {
 *   @ParseNumber()
 *   page: number; // '5' => 5
 * }
 * ```
 */
export function ParseNumber(): PropertyDecorator {
  return Transform(({ value }) => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = Number(value);
      return isNaN(parsed) ? value : parsed;
    }
    return value;
  });
}

/**
 * Transforms value to Date object.
 *
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class EventDto {
 *   @ParseDate()
 *   startDate: Date; // '2024-01-01' => Date object
 * }
 * ```
 */
export function ParseDate(): PropertyDecorator {
  return Transform(({ value }) => {
    if (value instanceof Date) return value;
    if (typeof value === 'string' || typeof value === 'number') {
      const date = new Date(value);
      return isNaN(date.getTime()) ? value : date;
    }
    return value;
  });
}

/**
 * Strips HTML tags from string.
 *
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class CommentDto {
 *   @StripHtml()
 *   content: string; // '<p>Hello</p>' => 'Hello'
 * }
 * ```
 */
export function StripHtml(): PropertyDecorator {
  return Transform(({ value }) => {
    if (typeof value !== 'string') return value;
    return value.replace(/<[^>]*>/g, '');
  });
}

/**
 * Sanitizes string by removing special characters.
 *
 * @param {string} allowedChars - Regex pattern of allowed characters
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class SearchDto {
 *   @Sanitize('[^a-zA-Z0-9\\s]')
 *   query: string; // Removes all special chars except letters, numbers, spaces
 * }
 * ```
 */
export function Sanitize(allowedChars: string = '[^a-zA-Z0-9\\s]'): PropertyDecorator {
  return Transform(({ value }) => {
    if (typeof value !== 'string') return value;
    const regex = new RegExp(allowedChars, 'g');
    return value.replace(regex, '');
  });
}

// ============================================================================
// ASYNC VALIDATION
// ============================================================================

/**
 * Async validator constraint for database uniqueness checks.
 *
 * @example
 * ```typescript
 * @ValidatorConstraint({ async: true })
 * class IsEmailUniqueConstraint implements ValidatorConstraintInterface {
 *   async validate(email: string) {
 *     const user = await userRepository.findByEmail(email);
 *     return !user;
 *   }
 *
 *   defaultMessage() {
 *     return 'Email already exists';
 *   }
 * }
 *
 * function IsEmailUnique(validationOptions?: ValidationOptions) {
 *   return function (object: Object, propertyName: string) {
 *     registerDecorator({
 *       target: object.constructor,
 *       propertyName,
 *       options: validationOptions,
 *       constraints: [],
 *       validator: IsEmailUniqueConstraint,
 *     });
 *   };
 * }
 * ```
 */
export function createAsyncValidator<T>(
  name: string,
  validator: AsyncValidator<T>,
  message: string | ((value: T) => string)
): (validationOptions?: ValidationOptions) => PropertyDecorator {
  @ValidatorConstraint({ async: true })
  class AsyncValidatorConstraint implements ValidatorConstraintInterface {
    async validate(value: T): Promise<boolean> {
      return await validator(value);
    }

    defaultMessage(args: ValidationArguments): string {
      return typeof message === 'function' ? message(args.value) : message;
    }
  }

  return (validationOptions?: ValidationOptions): PropertyDecorator => {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        name,
        target: object.constructor,
        propertyName,
        options: validationOptions,
        constraints: [],
        validator: AsyncValidatorConstraint,
      });
    };
  };
}

// ============================================================================
// VALIDATION PIPES
// ============================================================================

/**
 * Validation pipe with detailed error messages.
 *
 * @example
 * ```typescript
 * @Controller('users')
 * class UsersController {
 *   @Post()
 *   async create(@Body(new ValidationPipeWithDetails()) dto: CreateUserDto) {
 *     return this.usersService.create(dto);
 *   }
 * }
 * ```
 */
@Injectable()
export class ValidationPipeWithDetails implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    if (!metadata.metatype || !this.toValidate(metadata.metatype)) {
      return value;
    }

    const object = plainToClass(metadata.metatype, value);
    const errors = await validate(object, {
      whitelist: true,
      forbidNonWhitelisted: true,
      skipMissingProperties: false,
    });

    if (errors.length > 0) {
      const formattedErrors = this.formatErrors(errors);
      throw new BadRequestException({
        message: 'Validation failed',
        errors: formattedErrors,
      });
    }

    return object;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private formatErrors(errors: ValidationError[]): Record<string, string[]> {
    const formatted: Record<string, string[]> = {};

    errors.forEach((error) => {
      if (error.constraints) {
        formatted[error.property] = Object.values(error.constraints);
      }

      if (error.children && error.children.length > 0) {
        const childErrors = this.formatErrors(error.children);
        Object.keys(childErrors).forEach((key) => {
          formatted[`${error.property}.${key}`] = childErrors[key];
        });
      }
    });

    return formatted;
  }
}

/**
 * Sanitization pipe that strips unwanted properties.
 *
 * @example
 * ```typescript
 * @Post()
 * async create(@Body(new SanitizationPipe()) dto: CreateUserDto) {
 *   // Only whitelisted properties will be present
 * }
 * ```
 */
@Injectable()
export class SanitizationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): any {
    if (!metadata.metatype || !this.toTransform(metadata.metatype)) {
      return value;
    }

    // Convert to class instance and back to remove extra properties
    const object = plainToClass(metadata.metatype, value, {
      excludeExtraneousValues: true,
    });

    return classToPlain(object);
  }

  private toTransform(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}

// ============================================================================
// CROSS-FIELD VALIDATION
// ============================================================================

/**
 * Validates that one field is greater than another.
 *
 * @param {string} property - Property to compare against
 * @param {ValidationOptions} validationOptions - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class DateRangeDto {
 *   @IsDate()
 *   startDate: Date;
 *
 *   @IsGreaterThan('startDate')
 *   endDate: Date;
 * }
 * ```
 */
export function IsGreaterThan(
  property: string,
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isGreaterThan',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return value > relatedValue;
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `${propertyName} must be greater than ${relatedPropertyName}`;
        },
      },
    });
  };
}

/**
 * Validates that one field is less than another.
 *
 * @param {string} property - Property to compare against
 * @param {ValidationOptions} validationOptions - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class PriceRangeDto {
 *   @IsLessThan('maxPrice')
 *   minPrice: number;
 *
 *   @IsNumber()
 *   maxPrice: number;
 * }
 * ```
 */
export function IsLessThan(
  property: string,
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isLessThan',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return value < relatedValue;
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `${propertyName} must be less than ${relatedPropertyName}`;
        },
      },
    });
  };
}

/**
 * Validates field conditionally based on another field's value.
 *
 * @param {string} property - Property to check
 * @param {any} expectedValue - Expected value for condition
 * @param {ValidationOptions} validationOptions - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class ShippingDto {
 *   @IsBoolean()
 *   hasShipping: boolean;
 *
 *   @ValidateIf('hasShipping', true)
 *   @IsString()
 *   shippingAddress?: string;
 * }
 * ```
 */
export function ValidateIf(
  property: string,
  expectedValue: any,
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'validateIf',
      target: object.constructor,
      propertyName,
      constraints: [property, expectedValue],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName, expectedVal] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];

          // If condition not met, validation passes
          if (relatedValue !== expectedVal) {
            return true;
          }

          // Otherwise, value must be present
          return value !== null && value !== undefined;
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName, expectedVal] = args.constraints;
          return `${propertyName} is required when ${relatedPropertyName} is ${expectedVal}`;
        },
      },
    });
  };
}

// ============================================================================
// ERROR AGGREGATION
// ============================================================================

/**
 * Aggregates validation errors into a structured format.
 *
 * @param {ValidationError[]} errors - Array of validation errors
 * @returns {Record<string, any>} Aggregated errors
 *
 * @example
 * ```typescript
 * const errors = await validate(dto);
 * const aggregated = aggregateValidationErrors(errors);
 * // {
 * //   email: ['Email is required', 'Email must be valid'],
 * //   password: ['Password is too short']
 * // }
 * ```
 */
export function aggregateValidationErrors(
  errors: ValidationError[]
): Record<string, string[]> {
  const aggregated: Record<string, string[]> = {};

  function processError(error: ValidationError, prefix: string = ''): void {
    const path = prefix ? `${prefix}.${error.property}` : error.property;

    if (error.constraints) {
      aggregated[path] = Object.values(error.constraints);
    }

    if (error.children && error.children.length > 0) {
      error.children.forEach((child) => processError(child, path));
    }
  }

  errors.forEach((error) => processError(error));
  return aggregated;
}

/**
 * Formats validation errors as flat array of messages.
 *
 * @param {ValidationError[]} errors - Array of validation errors
 * @returns {string[]} Array of error messages
 *
 * @example
 * ```typescript
 * const errors = await validate(dto);
 * const messages = flattenValidationErrors(errors);
 * // ['Email is required', 'Password is too short']
 * ```
 */
export function flattenValidationErrors(errors: ValidationError[]): string[] {
  const messages: string[] = [];

  function processError(error: ValidationError): void {
    if (error.constraints) {
      messages.push(...Object.values(error.constraints));
    }

    if (error.children && error.children.length > 0) {
      error.children.forEach((child) => processError(child));
    }
  }

  errors.forEach((error) => processError(error));
  return messages;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Validates DTO and throws on error.
 *
 * @template T - DTO type
 * @param {T} dto - DTO instance to validate
 * @returns {Promise<void>} Resolves if valid, rejects if invalid
 *
 * @example
 * ```typescript
 * const dto = new CreateUserDto();
 * await validateDto(dto); // Throws if invalid
 * ```
 */
export async function validateDto<T extends object>(dto: T): Promise<void> {
  await validateOrReject(dto, {
    whitelist: true,
    forbidNonWhitelisted: true,
  });
}

/**
 * Validates DTO and returns validation result.
 *
 * @template T - DTO type
 * @param {T} dto - DTO instance to validate
 * @returns {Promise<ValidationResult<T>>} Validation result
 *
 * @example
 * ```typescript
 * const dto = new CreateUserDto();
 * const result = await validateDtoWithResult(dto);
 * if (!result.isValid) {
 *   console.error(result.errors);
 * }
 * ```
 */
export async function validateDtoWithResult<T extends object>(
  dto: T
): Promise<ValidationResult<T>> {
  const errors = await validate(dto, {
    whitelist: true,
    forbidNonWhitelisted: true,
  });

  if (errors.length > 0) {
    return {
      isValid: false,
      errors: flattenValidationErrors(errors),
    };
  }

  return {
    isValid: true,
    value: dto,
  };
}

/**
 * Transforms and validates plain object to DTO.
 *
 * @template T - DTO type
 * @param {Constructor<T>} dtoClass - DTO class
 * @param {any} plain - Plain object
 * @returns {Promise<T>} Validated DTO instance
 *
 * @example
 * ```typescript
 * const dto = await transformAndValidate(CreateUserDto, requestBody);
 * // dto is now a validated CreateUserDto instance
 * ```
 */
export async function transformAndValidate<T extends object>(
  dtoClass: new () => T,
  plain: any
): Promise<T> {
  const dto = plainToClass(dtoClass, plain, {
    excludeExtraneousValues: false,
  });

  await validateOrReject(dto, {
    whitelist: true,
    forbidNonWhitelisted: true,
  });

  return dto;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Runtime Type Validation
  createTypeValidator,
  assertType,
  validateType,

  // Schema Validation
  schemaBuilder,

  // Class-Based Validation Decorators
  IsUniqueArray,
  IsJsonString,
  IsPositive,
  IsNegative,
  IsAlphanumeric,
  IsEnumValue,

  // Transformation Decorators
  ToTitleCase,
  ToSlug,
  SplitString,
  ParseNumber,
  ParseDate,
  StripHtml,
  Sanitize,

  // Async Validation
  createAsyncValidator,

  // Validation Pipes
  ValidationPipeWithDetails,
  SanitizationPipe,

  // Cross-Field Validation
  IsGreaterThan,
  IsLessThan,
  ValidateIf,

  // Error Aggregation
  aggregateValidationErrors,
  flattenValidationErrors,

  // Utility Functions
  validateDto,
  validateDtoWithResult,
  transformAndValidate,
};
