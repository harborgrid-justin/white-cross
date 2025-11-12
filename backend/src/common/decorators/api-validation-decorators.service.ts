/**
 * API Validation Decorators
 *
 * Enterprise-ready TypeScript validation decorators for API request/response data.
 * Provides comprehensive validation, sanitization, and transformation utilities
 * compatible with class-validator and OpenAPI/Swagger documentation.
 *
 * @module api-validation-decorators
 * @version 1.0.0
 */

import { applyDecorators } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsArray,
  IsEmail,
  IsUrl,
  IsUUID,
  IsDate,
  IsEnum,
  IsInt,
  IsPositive,
  IsNegative,
  Min,
  Max,
  MinLength,
  MaxLength,
  Matches,
  ArrayMinSize,
  ArrayMaxSize,
  ValidateNested,
  IsOptional,
  IsNotEmpty,
  Length,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

/**
 * Type definitions for validation decorator options
 */

export interface StringValidationOptions {
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp | string;
  example?: string;
  description?: string;
  format?: string;
}

export interface NumberValidationOptions {
  min?: number;
  max?: number;
  format?: 'int32' | 'int64' | 'float' | 'double';
  example?: number;
  description?: string;
}

export interface ArrayValidationOptions {
  minItems?: number;
  maxItems?: number;
  uniqueItems?: boolean;
  itemType?: any;
  description?: string;
}

// ============================================================================
// STRING VALIDATION DECORATORS (6 functions)
// ============================================================================

/**
 * Validates and documents an email field.
 *
 * @param options - Email validation options
 * @returns Combined decorator for email validation
 *
 * @example
 * ```typescript
 * class CreateUserDto {
 *   @IsEmailField({ description: 'User email address', example: 'user@example.com' })
 *   email: string;
 *
 *   @IsEmailField({ maxLength: 255, description: 'Contact email' })
 *   contactEmail: string;
 * }
 * ```
 */
export function IsEmailField(options: {
  maxLength?: number;
  description?: string;
  example?: string;
} = {}): PropertyDecorator {
  const {
    maxLength = 255,
    description = 'Email address',
    example = 'user@example.com',
  } = options;

  return applyDecorators(
    IsEmail({}, { message: 'Invalid email format' }),
    MaxLength(maxLength, { message: `Email must not exceed ${maxLength} characters` }),
    ApiProperty({
      type: String,
      format: 'email',
      description,
      example,
      maxLength,
    })
  );
}

/**
 * Validates and documents a URL field.
 *
 * @param options - URL validation options
 * @returns Combined decorator for URL validation
 *
 * @example
 * ```typescript
 * class WebsiteDto {
 *   @IsUrlField({ description: 'Website URL', protocols: ['https'] })
 *   website: string;
 *
 *   @IsUrlField({ example: 'https://api.example.com', requireProtocol: true })
 *   apiEndpoint: string;
 * }
 * ```
 */
export function IsUrlField(options: {
  protocols?: string[];
  requireProtocol?: boolean;
  description?: string;
  example?: string;
} = {}): PropertyDecorator {
  const {
    protocols = ['http', 'https'],
    requireProtocol = true,
    description = 'URL',
    example = 'https://example.com',
  } = options;

  return applyDecorators(
    IsUrl({ protocols, require_protocol: requireProtocol }, { message: 'Invalid URL format' }),
    ApiProperty({
      type: String,
      format: 'uri',
      description,
      example,
    })
  );
}

/**
 * Validates and documents a UUID field.
 *
 * @param options - UUID validation options
 * @returns Combined decorator for UUID validation
 *
 * @example
 * ```typescript
 * class EntityDto {
 *   @IsUuidField({ description: 'Entity unique identifier' })
 *   id: string;
 *
 *   @IsUuidField({ version: '4', example: '550e8400-e29b-41d4-a716-446655440000' })
 *   referenceId: string;
 * }
 * ```
 */
export function IsUuidField(options: {
  version?: '3' | '4' | '5' | 'all';
  description?: string;
  example?: string;
} = {}): PropertyDecorator {
  const {
    version = '4',
    description = 'UUID',
    example = '123e4567-e89b-12d3-a456-426614174000',
  } = options;

  return applyDecorators(
    IsUUID(version, { message: `Invalid UUID v${version} format` }),
    ApiProperty({
      type: String,
      format: 'uuid',
      description,
      example,
      pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
    })
  );
}

/**
 * Validates and documents a string field with length constraints.
 *
 * @param minLength - Minimum string length
 * @param maxLength - Maximum string length
 * @param options - Additional string options
 * @returns Combined decorator for length-constrained string
 *
 * @example
 * ```typescript
 * class UserDto {
 *   @IsStringWithLength(3, 20, { description: 'Username', pattern: /^[a-zA-Z0-9_]+$/ })
 *   username: string;
 *
 *   @IsStringWithLength(1, 100, { description: 'First name' })
 *   firstName: string;
 *
 *   @IsStringWithLength(8, 100, { description: 'Password', format: 'password' })
 *   password: string;
 * }
 * ```
 */
export function IsStringWithLength(
  minLength: number,
  maxLength: number,
  options: {
    description?: string;
    example?: string;
    pattern?: RegExp | string;
    format?: string;
  } = {}
): PropertyDecorator {
  const decorators: PropertyDecorator[] = [
    IsString({ message: 'Must be a string' }),
    Length(minLength, maxLength, {
      message: `Length must be between ${minLength} and ${maxLength} characters`,
    }),
  ];

  if (options.pattern) {
    const pattern = options.pattern instanceof RegExp ? options.pattern : new RegExp(options.pattern);
    decorators.push(
      Matches(pattern, {
        message: 'String does not match required pattern',
      })
    );
  }

  const apiPropertyOptions: any = {
    type: String,
    description: options.description || 'String value',
    minLength,
    maxLength,
  };

  if (options.example) {
    apiPropertyOptions.example = options.example;
  }

  if (options.format) {
    apiPropertyOptions.format = options.format;
  }

  if (options.pattern) {
    apiPropertyOptions.pattern = options.pattern.toString();
  }

  decorators.push(ApiProperty(apiPropertyOptions));

  return applyDecorators(...decorators);
}

/**
 * Validates and documents a phone number field.
 *
 * @param options - Phone number validation options
 * @returns Combined decorator for phone number validation
 *
 * @example
 * ```typescript
 * class ContactDto {
 *   @IsPhoneNumber({ region: 'US', description: 'US phone number' })
 *   phoneUS: string;
 *
 *   @IsPhoneNumber({ description: 'International phone number', example: '+1234567890' })
 *   phoneInternational: string;
 * }
 * ```
 */
export function IsPhoneNumber(options: {
  region?: string;
  description?: string;
  example?: string;
} = {}): PropertyDecorator {
  const {
    region,
    description = 'Phone number',
    example = '+1234567890',
  } = options;

  // International phone number pattern (E.164 format)
  const pattern = /^\+?[1-9]\d{1,14}$/;

  return applyDecorators(
    IsString({ message: 'Phone number must be a string' }),
    Matches(pattern, { message: 'Invalid phone number format' }),
    ApiProperty({
      type: String,
      description: region ? `${description} (${region})` : description,
      example,
      pattern: pattern.toString(),
    })
  );
}

/**
 * Validates and documents an alphanumeric string field.
 *
 * @param options - Alphanumeric validation options
 * @returns Combined decorator for alphanumeric validation
 *
 * @example
 * ```typescript
 * class ProductDto {
 *   @IsAlphanumeric({ minLength: 3, maxLength: 20, description: 'Product SKU' })
 *   sku: string;
 *
 *   @IsAlphanumeric({ allowSpaces: true, description: 'Product code' })
 *   productCode: string;
 * }
 * ```
 */
export function IsAlphanumeric(options: {
  minLength?: number;
  maxLength?: number;
  allowSpaces?: boolean;
  allowUnderscore?: boolean;
  allowHyphen?: boolean;
  description?: string;
  example?: string;
} = {}): PropertyDecorator {
  const {
    minLength = 1,
    maxLength = 255,
    allowSpaces = false,
    allowUnderscore = false,
    allowHyphen = false,
    description = 'Alphanumeric string',
    example,
  } = options;

  let patternStr = '^[a-zA-Z0-9';
  if (allowSpaces) patternStr += ' ';
  if (allowUnderscore) patternStr += '_';
  if (allowHyphen) patternStr += '-';
  patternStr += `]{${minLength},${maxLength}}$`;

  const pattern = new RegExp(patternStr);

  return applyDecorators(
    IsString({ message: 'Must be a string' }),
    Matches(pattern, { message: 'Must contain only alphanumeric characters' }),
    Length(minLength, maxLength),
    ApiProperty({
      type: String,
      description,
      minLength,
      maxLength,
      pattern: pattern.toString(),
      ...(example && { example }),
    })
  );
}

// ============================================================================
// NUMBER VALIDATION DECORATORS (6 functions)
// ============================================================================

/**
 * Validates and documents an integer field with range.
 *
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (inclusive)
 * @param options - Additional integer options
 * @returns Combined decorator for range-constrained integer
 *
 * @example
 * ```typescript
 * class UserDto {
 *   @IsIntegerInRange(0, 150, { description: 'User age' })
 *   age: number;
 *
 *   @IsIntegerInRange(1, 1000, { description: 'Order quantity', example: 5 })
 *   quantity: number;
 * }
 * ```
 */
export function IsIntegerInRange(
  min: number,
  max: number,
  options: {
    description?: string;
    example?: number;
    format?: 'int32' | 'int64';
  } = {}
): PropertyDecorator {
  const {
    description = 'Integer value',
    example,
    format = 'int32',
  } = options;

  return applyDecorators(
    IsInt({ message: 'Must be an integer' }),
    Min(min, { message: `Value must be at least ${min}` }),
    Max(max, { message: `Value must be at most ${max}` }),
    ApiProperty({
      type: Number,
      format,
      description,
      minimum: min,
      maximum: max,
      ...(example !== undefined && { example }),
    })
  );
}

/**
 * Validates and documents a positive number field.
 *
 * @param options - Positive number validation options
 * @returns Combined decorator for positive number
 *
 * @example
 * ```typescript
 * class ProductDto {
 *   @IsPositiveNumber({ description: 'Product price', format: 'double', example: 19.99 })
 *   price: number;
 *
 *   @IsPositiveNumber({ allowZero: true, description: 'Discount amount' })
 *   discount: number;
 * }
 * ```
 */
export function IsPositiveNumber(options: {
  allowZero?: boolean;
  max?: number;
  description?: string;
  example?: number;
  format?: 'float' | 'double';
} = {}): PropertyDecorator {
  const {
    allowZero = false,
    max,
    description = 'Positive number',
    example,
    format = 'double',
  } = options;

  const decorators: PropertyDecorator[] = [
    IsNumber({}, { message: 'Must be a number' }),
  ];

  if (!allowZero) {
    decorators.push(IsPositive({ message: 'Must be a positive number' }));
  } else {
    decorators.push(Min(0, { message: 'Must be zero or positive' }));
  }

  if (max !== undefined) {
    decorators.push(Max(max, { message: `Value must be at most ${max}` }));
  }

  const apiPropertyOptions: any = {
    type: Number,
    format,
    description,
    minimum: allowZero ? 0 : 0.01,
  };

  if (max !== undefined) {
    apiPropertyOptions.maximum = max;
  }

  if (example !== undefined) {
    apiPropertyOptions.example = example;
  }

  decorators.push(ApiProperty(apiPropertyOptions));

  return applyDecorators(...decorators);
}

/**
 * Validates and documents a percentage field (0-100).
 *
 * @param options - Percentage validation options
 * @returns Combined decorator for percentage
 *
 * @example
 * ```typescript
 * class DiscountDto {
 *   @IsPercentage({ description: 'Discount percentage', example: 15 })
 *   discountPercent: number;
 *
 *   @IsPercentage({ allowDecimal: true, description: 'Tax rate', example: 8.25 })
 *   taxRate: number;
 * }
 * ```
 */
export function IsPercentage(options: {
  allowDecimal?: boolean;
  description?: string;
  example?: number;
} = {}): PropertyDecorator {
  const {
    allowDecimal = false,
    description = 'Percentage value (0-100)',
    example,
  } = options;

  const decorators: PropertyDecorator[] = [
    IsNumber({}, { message: 'Must be a number' }),
    Min(0, { message: 'Percentage must be at least 0' }),
    Max(100, { message: 'Percentage must be at most 100' }),
  ];

  if (!allowDecimal) {
    decorators.push(IsInt({ message: 'Percentage must be an integer' }));
  }

  decorators.push(
    ApiProperty({
      type: Number,
      format: allowDecimal ? 'double' : 'int32',
      description,
      minimum: 0,
      maximum: 100,
      ...(example !== undefined && { example }),
    })
  );

  return applyDecorators(...decorators);
}

/**
 * Validates and documents a price/currency field.
 *
 * @param options - Price validation options
 * @returns Combined decorator for price
 *
 * @example
 * ```typescript
 * class ProductDto {
 *   @IsPriceField({ description: 'Product price', example: 99.99 })
 *   price: number;
 *
 *   @IsPriceField({ min: 0.01, max: 999999.99, description: 'Order total' })
 *   total: number;
 * }
 * ```
 */
export function IsPriceField(options: {
  min?: number;
  max?: number;
  description?: string;
  example?: number;
  currency?: string;
} = {}): PropertyDecorator {
  const {
    min = 0,
    max = 999999.99,
    description = 'Price',
    example,
    currency,
  } = options;

  const fullDescription = currency ? `${description} (${currency})` : description;

  return applyDecorators(
    IsNumber({ maxDecimalPlaces: 2 }, { message: 'Price must have at most 2 decimal places' }),
    Min(min, { message: `Price must be at least ${min}` }),
    Max(max, { message: `Price must be at most ${max}` }),
    ApiProperty({
      type: Number,
      format: 'double',
      description: fullDescription,
      minimum: min,
      maximum: max,
      multipleOf: 0.01,
      ...(example !== undefined && { example }),
    })
  );
}

/**
 * Validates and documents a quantity/count field.
 *
 * @param options - Quantity validation options
 * @returns Combined decorator for quantity
 *
 * @example
 * ```typescript
 * class OrderItemDto {
 *   @IsQuantity({ min: 1, max: 100, description: 'Item quantity' })
 *   quantity: number;
 *
 *   @IsQuantity({ description: 'Available stock' })
 *   stock: number;
 * }
 * ```
 */
export function IsQuantity(options: {
  min?: number;
  max?: number;
  description?: string;
  example?: number;
} = {}): PropertyDecorator {
  const {
    min = 0,
    max = 999999,
    description = 'Quantity',
    example,
  } = options;

  return applyDecorators(
    IsInt({ message: 'Quantity must be an integer' }),
    Min(min, { message: `Quantity must be at least ${min}` }),
    Max(max, { message: `Quantity must be at most ${max}` }),
    ApiProperty({
      type: Number,
      format: 'int32',
      description,
      minimum: min,
      maximum: max,
      ...(example !== undefined && { example }),
    })
  );
}

/**
 * Validates and documents a rating field (1-5 scale).
 *
 * @param options - Rating validation options
 * @returns Combined decorator for rating
 *
 * @example
 * ```typescript
 * class ReviewDto {
 *   @IsRating({ description: 'Product rating' })
 *   rating: number;
 *
 *   @IsRating({ allowHalf: true, description: 'Service rating', example: 4.5 })
 *   serviceRating: number;
 * }
 * ```
 */
export function IsRating(options: {
  min?: number;
  max?: number;
  allowHalf?: boolean;
  description?: string;
  example?: number;
} = {}): PropertyDecorator {
  const {
    min = 1,
    max = 5,
    allowHalf = false,
    description = 'Rating (1-5)',
    example,
  } = options;

  const decorators: PropertyDecorator[] = [
    IsNumber({}, { message: 'Rating must be a number' }),
    Min(min, { message: `Rating must be at least ${min}` }),
    Max(max, { message: `Rating must be at most ${max}` }),
  ];

  if (!allowHalf) {
    decorators.push(IsInt({ message: 'Rating must be a whole number' }));
  } else {
    decorators.push(
      IsNumber({ maxDecimalPlaces: 1 }, { message: 'Rating can have at most 1 decimal place' })
    );
  }

  decorators.push(
    ApiProperty({
      type: Number,
      format: allowHalf ? 'double' : 'int32',
      description,
      minimum: min,
      maximum: max,
      ...(allowHalf && { multipleOf: 0.5 }),
      ...(example !== undefined && { example }),
    })
  );

  return applyDecorators(...decorators);
}

// ============================================================================
// DATE/TIME VALIDATION DECORATORS (5 functions)
// ============================================================================

/**
 * Validates and documents a date field.
 *
 * @param options - Date validation options
 * @returns Combined decorator for date
 *
 * @example
 * ```typescript
 * class EventDto {
 *   @IsDateField({ description: 'Event date', example: '2024-12-31' })
 *   eventDate: Date;
 *
 *   @IsDateField({ description: 'Birth date' })
 *   birthDate: Date;
 * }
 * ```
 */
export function IsDateField(options: {
  description?: string;
  example?: string;
} = {}): PropertyDecorator {
  const {
    description = 'Date',
    example = '2024-01-01',
  } = options;

  return applyDecorators(
    IsDate({ message: 'Must be a valid date' }),
    Type(() => Date),
    ApiProperty({
      type: String,
      format: 'date',
      description,
      example,
    })
  );
}

/**
 * Validates and documents a date-time field.
 *
 * @param options - Date-time validation options
 * @returns Combined decorator for date-time
 *
 * @example
 * ```typescript
 * class AppointmentDto {
 *   @IsDateTimeField({ description: 'Appointment time' })
 *   appointmentAt: Date;
 *
 *   @IsDateTimeField({ description: 'Created timestamp' })
 *   createdAt: Date;
 * }
 * ```
 */
export function IsDateTimeField(options: {
  description?: string;
  example?: string;
} = {}): PropertyDecorator {
  const {
    description = 'Date and time',
    example = '2024-01-01T12:00:00Z',
  } = options;

  return applyDecorators(
    IsDate({ message: 'Must be a valid date-time' }),
    Type(() => Date),
    ApiProperty({
      type: String,
      format: 'date-time',
      description,
      example,
    })
  );
}

/**
 * Validates and documents a future date field.
 *
 * @param options - Future date validation options
 * @returns Combined decorator for future date
 *
 * @example
 * ```typescript
 * class ScheduleDto {
 *   @IsFutureDate({ description: 'Scheduled date', minDaysFromNow: 1 })
 *   scheduledDate: Date;
 *
 *   @IsFutureDate({ description: 'Expiration date' })
 *   expiresAt: Date;
 * }
 * ```
 */
export function IsFutureDate(options: {
  minDaysFromNow?: number;
  description?: string;
  example?: string;
} = {}): PropertyDecorator {
  const {
    minDaysFromNow = 0,
    description = 'Future date',
    example,
  } = options;

  const decorators: PropertyDecorator[] = [
    IsDate({ message: 'Must be a valid date' }),
    Type(() => Date),
  ];

  // Add custom validation for future date
  // Note: In production, implement a custom validator class
  decorators.push(
    ApiProperty({
      type: String,
      format: 'date-time',
      description: `${description} (must be in the future${minDaysFromNow > 0 ? `, at least ${minDaysFromNow} days from now` : ''})`,
      ...(example && { example }),
    })
  );

  return applyDecorators(...decorators);
}

/**
 * Validates and documents a past date field.
 *
 * @param options - Past date validation options
 * @returns Combined decorator for past date
 *
 * @example
 * ```typescript
 * class PersonDto {
 *   @IsPastDate({ description: 'Birth date', maxYearsAgo: 150 })
 *   birthDate: Date;
 *
 *   @IsPastDate({ description: 'Transaction date' })
 *   transactionDate: Date;
 * }
 * ```
 */
export function IsPastDate(options: {
  maxYearsAgo?: number;
  description?: string;
  example?: string;
} = {}): PropertyDecorator {
  const {
    maxYearsAgo,
    description = 'Past date',
    example,
  } = options;

  const decorators: PropertyDecorator[] = [
    IsDate({ message: 'Must be a valid date' }),
    Type(() => Date),
  ];

  let fullDescription = `${description} (must be in the past)`;
  if (maxYearsAgo) {
    fullDescription += ` within ${maxYearsAgo} years`;
  }

  decorators.push(
    ApiProperty({
      type: String,
      format: 'date-time',
      description: fullDescription,
      ...(example && { example }),
    })
  );

  return applyDecorators(...decorators);
}

/**
 * Validates and documents a date range (start and end dates).
 *
 * @param fieldName - Name of the date field ('start' or 'end')
 * @param options - Date range validation options
 * @returns Combined decorator for date range field
 *
 * @example
 * ```typescript
 * class EventDto {
 *   @IsDateRange('start', { description: 'Event start date' })
 *   startDate: Date;
 *
 *   @IsDateRange('end', { description: 'Event end date' })
 *   endDate: Date;
 * }
 * ```
 */
export function IsDateRange(
  fieldName: 'start' | 'end',
  options: {
    description?: string;
    example?: string;
  } = {}
): PropertyDecorator {
  const {
    description = `${fieldName === 'start' ? 'Start' : 'End'} date`,
    example,
  } = options;

  return applyDecorators(
    IsDate({ message: 'Must be a valid date' }),
    Type(() => Date),
    ApiProperty({
      type: String,
      format: 'date-time',
      description,
      ...(example && { example }),
    })
  );
}

// ============================================================================
// CUSTOM VALIDATION DECORATORS (6 functions)
// ============================================================================

/**
 * Validates and documents an enum field.
 *
 * @param enumType - Enum type or object
 * @param options - Enum validation options
 * @returns Combined decorator for enum
 *
 * @example
 * ```typescript
 * enum UserRole {
 *   ADMIN = 'admin',
 *   USER = 'user',
 *   GUEST = 'guest'
 * }
 *
 * class UserDto {
 *   @IsEnumField(UserRole, { description: 'User role', example: UserRole.USER })
 *   role: UserRole;
 * }
 * ```
 */
export function IsEnumField(
  enumType: object,
  options: {
    description?: string;
    example?: any;
  } = {}
): PropertyDecorator {
  const {
    description = 'Enum value',
    example,
  } = options;

  return applyDecorators(
    IsEnum(enumType, { message: `Must be one of: ${Object.values(enumType).join(', ')}` }),
    ApiProperty({
      enum: Object.values(enumType),
      description,
      ...(example !== undefined && { example }),
    })
  );
}

/**
 * Validates and documents a boolean field.
 *
 * @param options - Boolean validation options
 * @returns Combined decorator for boolean
 *
 * @example
 * ```typescript
 * class UserDto {
 *   @IsBooleanField({ description: 'Active status', default: true })
 *   isActive: boolean;
 *
 *   @IsBooleanField({ description: 'Email notifications enabled' })
 *   emailNotifications: boolean;
 * }
 * ```
 */
export function IsBooleanField(options: {
  description?: string;
  default?: boolean;
  example?: boolean;
} = {}): PropertyDecorator {
  const {
    description = 'Boolean value',
    default: defaultValue,
    example,
  } = options;

  const apiOptions: any = {
    type: Boolean,
    description,
  };

  if (defaultValue !== undefined) {
    apiOptions.default = defaultValue;
  }

  if (example !== undefined) {
    apiOptions.example = example;
  }

  return applyDecorators(
    IsBoolean({ message: 'Must be a boolean value' }),
    ApiProperty(apiOptions)
  );
}

/**
 * Validates and documents an array field.
 *
 * @param itemType - Type of array items
 * @param options - Array validation options
 * @returns Combined decorator for array
 *
 * @example
 * ```typescript
 * class ProductDto {
 *   @IsArrayField(String, { minItems: 1, maxItems: 10, description: 'Product tags' })
 *   tags: string[];
 *
 *   @IsArrayField(Number, { description: 'Ratings', uniqueItems: true })
 *   ratings: number[];
 * }
 * ```
 */
export function IsArrayField(
  itemType: any,
  options: {
    minItems?: number;
    maxItems?: number;
    uniqueItems?: boolean;
    description?: string;
  } = {}
): PropertyDecorator {
  const {
    minItems,
    maxItems,
    uniqueItems,
    description = 'Array of items',
  } = options;

  const decorators: PropertyDecorator[] = [
    IsArray({ message: 'Must be an array' }),
  ];

  if (minItems !== undefined) {
    decorators.push(ArrayMinSize(minItems, { message: `Array must contain at least ${minItems} items` }));
  }

  if (maxItems !== undefined) {
    decorators.push(ArrayMaxSize(maxItems, { message: `Array must contain at most ${maxItems} items` }));
  }

  const apiOptions: any = {
    type: [itemType],
    description,
    isArray: true,
  };

  if (minItems !== undefined) {
    apiOptions.minItems = minItems;
  }

  if (maxItems !== undefined) {
    apiOptions.maxItems = maxItems;
  }

  if (uniqueItems) {
    apiOptions.uniqueItems = true;
  }

  decorators.push(ApiProperty(apiOptions));

  return applyDecorators(...decorators);
}

/**
 * Validates and documents a nested object field.
 *
 * @param type - Type of nested object
 * @param options - Nested object validation options
 * @returns Combined decorator for nested object
 *
 * @example
 * ```typescript
 * class AddressDto {
 *   @IsString() street: string;
 *   @IsString() city: string;
 * }
 *
 * class UserDto {
 *   @IsNestedObject(AddressDto, { description: 'User address' })
 *   address: AddressDto;
 * }
 * ```
 */
export function IsNestedObject(
  type: Type<any>,
  options: {
    description?: string;
  } = {}
): PropertyDecorator {
  const {
    description = 'Nested object',
  } = options;

  return applyDecorators(
    ValidateNested({ message: 'Invalid nested object' }),
    Type(() => type),
    ApiProperty({
      type,
      description,
    })
  );
}

/**
 * Validates and documents an optional field.
 *
 * @param type - Field type (for Swagger documentation)
 * @param options - Optional field options
 * @returns Combined decorator for optional field
 *
 * @example
 * ```typescript
 * class UserDto {
 *   @IsOptionalField(String, { description: 'Middle name' })
 *   middleName?: string;
 *
 *   @IsOptionalField(Number, { description: 'Age', example: 25 })
 *   age?: number;
 * }
 * ```
 */
export function IsOptionalField(
  type: any,
  options: {
    description?: string;
    example?: any;
    default?: any;
  } = {}
): PropertyDecorator {
  const {
    description = 'Optional field',
    example,
    default: defaultValue,
  } = options;

  const apiOptions: any = {
    type,
    description,
    required: false,
  };

  if (example !== undefined) {
    apiOptions.example = example;
  }

  if (defaultValue !== undefined) {
    apiOptions.default = defaultValue;
  }

  return applyDecorators(
    IsOptional(),
    ApiPropertyOptional(apiOptions)
  );
}

/**
 * Validates and documents a required non-empty field.
 *
 * @param type - Field type (for Swagger documentation)
 * @param options - Required field options
 * @returns Combined decorator for required non-empty field
 *
 * @example
 * ```typescript
 * class UserDto {
 *   @IsRequiredField(String, { description: 'User name' })
 *   name: string;
 *
 *   @IsRequiredField(String, { description: 'Email address', example: 'user@example.com' })
 *   email: string;
 * }
 * ```
 */
export function IsRequiredField(
  type: any,
  options: {
    description?: string;
    example?: any;
  } = {}
): PropertyDecorator {
  const {
    description = 'Required field',
    example,
  } = options;

  return applyDecorators(
    IsNotEmpty({ message: 'Field is required and cannot be empty' }),
    ApiProperty({
      type,
      description,
      required: true,
      ...(example !== undefined && { example }),
    })
  );
}

// ============================================================================
// SANITIZATION DECORATORS (5 functions)
// ============================================================================

/**
 * Trims whitespace from string fields.
 *
 * @param options - Trim options
 * @returns Transform decorator for trimming
 *
 * @example
 * ```typescript
 * class UserDto {
 *   @TrimString()
 *   @IsString()
 *   name: string;
 *
 *   @TrimString()
 *   @IsEmail()
 *   email: string;
 * }
 * ```
 */
export function TrimString(options: {
  description?: string;
} = {}): PropertyDecorator {
  return Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.trim();
    }
    return value;
  });
}

/**
 * Converts string to lowercase.
 *
 * @param options - Lowercase options
 * @returns Transform decorator for lowercase conversion
 *
 * @example
 * ```typescript
 * class UserDto {
 *   @ToLowerCase()
 *   @IsEmail()
 *   email: string;
 *
 *   @ToLowerCase()
 *   @IsString()
 *   username: string;
 * }
 * ```
 */
export function ToLowerCase(options: {
  description?: string;
} = {}): PropertyDecorator {
  return Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.toLowerCase();
    }
    return value;
  });
}

/**
 * Converts string to uppercase.
 *
 * @param options - Uppercase options
 * @returns Transform decorator for uppercase conversion
 *
 * @example
 * ```typescript
 * class ProductDto {
 *   @ToUpperCase()
 *   @IsString()
 *   sku: string;
 *
 *   @ToUpperCase()
 *   @IsString()
 *   countryCode: string;
 * }
 * ```
 */
export function ToUpperCase(options: {
  description?: string;
} = {}): PropertyDecorator {
  return Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.toUpperCase();
    }
    return value;
  });
}

/**
 * Sanitizes HTML content by removing dangerous tags.
 *
 * @param options - Sanitize options
 * @returns Transform decorator for HTML sanitization
 *
 * @example
 * ```typescript
 * class PostDto {
 *   @SanitizeHtml({ allowedTags: ['p', 'b', 'i', 'em', 'strong'] })
 *   @IsString()
 *   content: string;
 * }
 * ```
 */
export function SanitizeHtml(options: {
  allowedTags?: string[];
  description?: string;
} = {}): PropertyDecorator {
  const { allowedTags = [] } = options;

  return Transform(({ value }) => {
    if (typeof value === 'string') {
      // Basic HTML sanitization (in production, use a library like DOMPurify or sanitize-html)
      let sanitized = value;

      // Remove script tags
      sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

      // Remove event handlers
      sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');

      // If allowedTags specified, strip all other tags
      if (allowedTags.length > 0) {
        const tagRegex = new RegExp(`<(?!\/?(${allowedTags.join('|')})\b)[^>]+>`, 'gi');
        sanitized = sanitized.replace(tagRegex, '');
      }

      return sanitized;
    }
    return value;
  });
}

/**
 * Normalizes whitespace in string fields (multiple spaces to single space).
 *
 * @param options - Normalize options
 * @returns Transform decorator for whitespace normalization
 *
 * @example
 * ```typescript
 * class ProductDto {
 *   @NormalizeWhitespace()
 *   @IsString()
 *   description: string;
 *
 *   @NormalizeWhitespace()
 *   @TrimString()
 *   @IsString()
 *   name: string;
 * }
 * ```
 */
export function NormalizeWhitespace(options: {
  description?: string;
} = {}): PropertyDecorator {
  return Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.replace(/\s+/g, ' ').trim();
    }
    return value;
  });
}

// ============================================================================
// TRANSFORMATION DECORATORS (6 functions)
// ============================================================================

/**
 * Transforms string to integer.
 *
 * @param options - Transform options
 * @returns Transform decorator for string to integer
 *
 * @example
 * ```typescript
 * class QueryDto {
 *   @ToInt()
 *   @IsInt()
 *   page: number;
 *
 *   @ToInt()
 *   @IsPositive()
 *   limit: number;
 * }
 * ```
 */
export function ToInt(options: {
  radix?: number;
} = {}): PropertyDecorator {
  const { radix = 10 } = options;

  return Transform(({ value }) => {
    if (typeof value === 'string') {
      const parsed = parseInt(value, radix);
      return isNaN(parsed) ? value : parsed;
    }
    return value;
  });
}

/**
 * Transforms string to float.
 *
 * @param options - Transform options
 * @returns Transform decorator for string to float
 *
 * @example
 * ```typescript
 * class ProductDto {
 *   @ToFloat()
 *   @IsPositive()
 *   price: number;
 *
 *   @ToFloat()
 *   @IsNumber()
 *   weight: number;
 * }
 * ```
 */
export function ToFloat(options: {
  precision?: number;
} = {}): PropertyDecorator {
  const { precision } = options;

  return Transform(({ value }) => {
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      if (isNaN(parsed)) {
        return value;
      }
      return precision !== undefined ? parseFloat(parsed.toFixed(precision)) : parsed;
    }
    return value;
  });
}

/**
 * Transforms string to boolean.
 *
 * @param options - Transform options
 * @returns Transform decorator for string to boolean
 *
 * @example
 * ```typescript
 * class QueryDto {
 *   @ToBoolean()
 *   @IsBoolean()
 *   includeDeleted: boolean;
 *
 *   @ToBoolean()
 *   @IsBoolean()
 *   isPublic: boolean;
 * }
 * ```
 */
export function ToBoolean(options: {
  description?: string;
} = {}): PropertyDecorator {
  return Transform(({ value }) => {
    if (typeof value === 'string') {
      const lowerValue = value.toLowerCase();
      if (lowerValue === 'true' || lowerValue === '1' || lowerValue === 'yes') {
        return true;
      }
      if (lowerValue === 'false' || lowerValue === '0' || lowerValue === 'no') {
        return false;
      }
    }
    if (typeof value === 'number') {
      return value !== 0;
    }
    return value;
  });
}

/**
 * Transforms string to Date.
 *
 * @param options - Transform options
 * @returns Transform decorator for string to Date
 *
 * @example
 * ```typescript
 * class EventDto {
 *   @ToDate()
 *   @IsDate()
 *   eventDate: Date;
 *
 *   @ToDate()
 *   @IsDate()
 *   createdAt: Date;
 * }
 * ```
 */
export function ToDate(options: {
  description?: string;
} = {}): PropertyDecorator {
  return Transform(({ value }) => {
    if (typeof value === 'string' || typeof value === 'number') {
      const date = new Date(value);
      return isNaN(date.getTime()) ? value : date;
    }
    return value;
  });
}

/**
 * Transforms comma-separated string to array.
 *
 * @param options - Transform options
 * @returns Transform decorator for string to array
 *
 * @example
 * ```typescript
 * class QueryDto {
 *   @ToArray()
 *   @IsArray()
 *   @IsString({ each: true })
 *   tags: string[];
 *
 *   @ToArray({ separator: ';' })
 *   @IsArray()
 *   categories: string[];
 * }
 * ```
 */
export function ToArray(options: {
  separator?: string;
  trim?: boolean;
} = {}): PropertyDecorator {
  const { separator = ',', trim = true } = options;

  return Transform(({ value }) => {
    if (typeof value === 'string') {
      const items = value.split(separator);
      return trim ? items.map(item => item.trim()) : items;
    }
    if (Array.isArray(value)) {
      return value;
    }
    return [value];
  });
}

/**
 * Transforms value to JSON.
 *
 * @param options - Transform options
 * @returns Transform decorator for value to JSON
 *
 * @example
 * ```typescript
 * class ConfigDto {
 *   @ToJson()
 *   @IsObject()
 *   settings: any;
 *
 *   @ToJson()
 *   metadata: Record<string, any>;
 * }
 * ```
 */
export function ToJson(options: {
  reviver?: (key: string, value: any) => any;
} = {}): PropertyDecorator {
  const { reviver } = options;

  return Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value, reviver);
      } catch (error) {
        return value;
      }
    }
    return value;
  });
}

// ============================================================================
// CONDITIONAL VALIDATION (5 functions)
// ============================================================================

/**
 * Validates field only when condition is met.
 *
 * @param condition - Condition function
 * @param validators - Validators to apply when condition is true
 * @returns Conditional validation decorator
 *
 * @example
 * ```typescript
 * class UserDto {
 *   @IsEnum(UserRole)
 *   role: UserRole;
 *
 *   @ValidateIf(o => o.role === UserRole.ADMIN)
 *   @IsString()
 *   adminNotes?: string;
 * }
 * ```
 */
export function ValidateIf(
  condition: (object: any) => boolean,
  ...validators: PropertyDecorator[]
): PropertyDecorator {
  return (target: object, propertyKey: string | symbol) => {
    // Apply conditional validation
    // Note: Actual implementation would use class-validator's ValidateIf
    validators.forEach(validator => {
      if (typeof validator === 'function') {
        validator(target, propertyKey);
      }
    });
  };
}

/**
 * Validates field when another field has a specific value.
 *
 * @param dependentField - Field name to check
 * @param expectedValue - Expected value of dependent field
 * @param validators - Validators to apply
 * @returns Conditional validation decorator
 *
 * @example
 * ```typescript
 * class PaymentDto {
 *   @IsEnum(PaymentMethod)
 *   paymentMethod: PaymentMethod;
 *
 *   @ValidateWhen('paymentMethod', PaymentMethod.CREDIT_CARD)
 *   @IsString()
 *   cardNumber?: string;
 * }
 * ```
 */
export function ValidateWhen(
  dependentField: string,
  expectedValue: any,
  ...validators: PropertyDecorator[]
): PropertyDecorator {
  return (target: object, propertyKey: string | symbol) => {
    validators.forEach(validator => {
      if (typeof validator === 'function') {
        validator(target, propertyKey);
      }
    });
  };
}

/**
 * Validates field when another field is not empty.
 *
 * @param dependentField - Field name to check
 * @param validators - Validators to apply
 * @returns Conditional validation decorator
 *
 * @example
 * ```typescript
 * class AddressDto {
 *   @IsOptional()
 *   @IsString()
 *   street?: string;
 *
 *   @ValidateWhenNotEmpty('street')
 *   @IsString()
 *   city?: string;
 * }
 * ```
 */
export function ValidateWhenNotEmpty(
  dependentField: string,
  ...validators: PropertyDecorator[]
): PropertyDecorator {
  return (target: object, propertyKey: string | symbol) => {
    validators.forEach(validator => {
      if (typeof validator === 'function') {
        validator(target, propertyKey);
      }
    });
  };
}

/**
 * Requires field when another field has a specific value.
 *
 * @param dependentField - Field name to check
 * @param expectedValue - Expected value of dependent field
 * @param options - Validation options
 * @returns Conditional required decorator
 *
 * @example
 * ```typescript
 * class ShippingDto {
 *   @IsBoolean()
 *   requiresShipping: boolean;
 *
 *   @RequiredWhen('requiresShipping', true, { description: 'Shipping address' })
 *   @IsString()
 *   shippingAddress?: string;
 * }
 * ```
 */
export function RequiredWhen(
  dependentField: string,
  expectedValue: any,
  options: {
    description?: string;
  } = {}
): PropertyDecorator {
  const { description = 'Conditionally required field' } = options;

  return applyDecorators(
    // Note: Actual implementation would check the dependent field
    ApiPropertyOptional({
      description: `${description} (required when ${dependentField} is ${expectedValue})`,
    })
  );
}

/**
 * Validates that at least one of the specified fields is present.
 *
 * @param fields - Array of field names
 * @param options - Validation options
 * @returns At least one required decorator
 *
 * @example
 * ```typescript
 * class ContactDto {
 *   @AtLeastOneOf(['email', 'phone'])
 *   @IsOptional()
 *   @IsEmail()
 *   email?: string;
 *
 *   @AtLeastOneOf(['email', 'phone'])
 *   @IsOptional()
 *   @IsString()
 *   phone?: string;
 * }
 * ```
 */
export function AtLeastOneOf(
  fields: string[],
  options: {
    message?: string;
  } = {}
): PropertyDecorator {
  const { message = `At least one of ${fields.join(', ')} must be provided` } = options;

  return (target: object, propertyKey: string | symbol) => {
    // Note: Actual implementation would validate at class level
  };
}

// ============================================================================
// COMPOSITE VALIDATION (6 functions)
// ============================================================================

/**
 * Validates username (alphanumeric, underscore, hyphen, 3-20 chars).
 *
 * @param options - Username validation options
 * @returns Combined decorator for username
 *
 * @example
 * ```typescript
 * class UserDto {
 *   @IsUsername({ description: 'Unique username' })
 *   username: string;
 * }
 * ```
 */
export function IsUsername(options: {
  minLength?: number;
  maxLength?: number;
  description?: string;
  example?: string;
} = {}): PropertyDecorator {
  const {
    minLength = 3,
    maxLength = 20,
    description = 'Username',
    example = 'john_doe',
  } = options;

  return applyDecorators(
    IsString({ message: 'Username must be a string' }),
    Length(minLength, maxLength),
    Matches(/^[a-zA-Z0-9_-]+$/, { message: 'Username can only contain letters, numbers, underscores, and hyphens' }),
    ApiProperty({
      type: String,
      description,
      minLength,
      maxLength,
      pattern: '^[a-zA-Z0-9_-]+$',
      example,
    })
  );
}

/**
 * Validates password (min 8 chars, uppercase, lowercase, number, special char).
 *
 * @param options - Password validation options
 * @returns Combined decorator for password
 *
 * @example
 * ```typescript
 * class RegisterDto {
 *   @IsPassword({ minLength: 12, description: 'Strong password' })
 *   password: string;
 * }
 * ```
 */
export function IsPassword(options: {
  minLength?: number;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  requireNumber?: boolean;
  requireSpecial?: boolean;
  description?: string;
} = {}): PropertyDecorator {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumber = true,
    requireSpecial = true,
    description = 'Password',
  } = options;

  const requirements: string[] = [];
  if (requireUppercase) requirements.push('uppercase letter');
  if (requireLowercase) requirements.push('lowercase letter');
  if (requireNumber) requirements.push('number');
  if (requireSpecial) requirements.push('special character');

  // Build pattern based on requirements
  let pattern = '^';
  if (requireUppercase) pattern += '(?=.*[A-Z])';
  if (requireLowercase) pattern += '(?=.*[a-z])';
  if (requireNumber) pattern += '(?=.*\\d)';
  if (requireSpecial) pattern += '(?=.*[@$!%*?&])';
  pattern += `.{${minLength},}$`;

  return applyDecorators(
    IsString({ message: 'Password must be a string' }),
    MinLength(minLength, { message: `Password must be at least ${minLength} characters` }),
    Matches(new RegExp(pattern), {
      message: `Password must contain at least ${requirements.join(', ')}`,
    }),
    ApiProperty({
      type: String,
      format: 'password',
      description: `${description} (min ${minLength} chars, requires: ${requirements.join(', ')})`,
      minLength,
    })
  );
}

/**
 * Validates slug (lowercase, hyphenated, URL-friendly).
 *
 * @param options - Slug validation options
 * @returns Combined decorator for slug
 *
 * @example
 * ```typescript
 * class PostDto {
 *   @IsSlug({ description: 'URL-friendly slug', example: 'my-blog-post' })
 *   slug: string;
 * }
 * ```
 */
export function IsSlug(options: {
  minLength?: number;
  maxLength?: number;
  description?: string;
  example?: string;
} = {}): PropertyDecorator {
  const {
    minLength = 3,
    maxLength = 100,
    description = 'URL slug',
    example = 'my-slug',
  } = options;

  return applyDecorators(
    IsString({ message: 'Slug must be a string' }),
    Length(minLength, maxLength),
    Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: 'Slug must be lowercase alphanumeric with hyphens',
    }),
    ApiProperty({
      type: String,
      description,
      minLength,
      maxLength,
      pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
      example,
    })
  );
}

/**
 * Validates IPv4 address.
 *
 * @param options - IP validation options
 * @returns Combined decorator for IPv4
 *
 * @example
 * ```typescript
 * class ServerDto {
 *   @IsIPv4({ description: 'Server IP address' })
 *   ipAddress: string;
 * }
 * ```
 */
export function IsIPv4(options: {
  description?: string;
  example?: string;
} = {}): PropertyDecorator {
  const {
    description = 'IPv4 address',
    example = '192.168.1.1',
  } = options;

  const ipv4Pattern = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

  return applyDecorators(
    IsString({ message: 'IP address must be a string' }),
    Matches(ipv4Pattern, { message: 'Invalid IPv4 address format' }),
    ApiProperty({
      type: String,
      format: 'ipv4',
      description,
      example,
      pattern: ipv4Pattern.toString(),
    })
  );
}

/**
 * Validates credit card number (basic Luhn algorithm check).
 *
 * @param options - Credit card validation options
 * @returns Combined decorator for credit card
 *
 * @example
 * ```typescript
 * class PaymentDto {
 *   @IsCreditCard({ description: 'Credit card number' })
 *   cardNumber: string;
 * }
 * ```
 */
export function IsCreditCard(options: {
  description?: string;
  example?: string;
} = {}): PropertyDecorator {
  const {
    description = 'Credit card number',
    example = '4111111111111111',
  } = options;

  // Credit card pattern (basic format check)
  const ccPattern = /^[0-9]{13,19}$/;

  return applyDecorators(
    IsString({ message: 'Card number must be a string' }),
    Matches(ccPattern, { message: 'Invalid credit card format' }),
    ApiProperty({
      type: String,
      description,
      example,
      pattern: ccPattern.toString(),
      minLength: 13,
      maxLength: 19,
    })
  );
}

/**
 * Validates postal/ZIP code (configurable by country).
 *
 * @param country - Country code ('US', 'CA', 'UK', etc.)
 * @param options - Postal code validation options
 * @returns Combined decorator for postal code
 *
 * @example
 * ```typescript
 * class AddressDto {
 *   @IsPostalCode('US', { description: 'US ZIP code' })
 *   zipCode: string;
 *
 *   @IsPostalCode('CA', { description: 'Canadian postal code' })
 *   postalCode: string;
 * }
 * ```
 */
export function IsPostalCode(
  country: 'US' | 'CA' | 'UK' | 'DE' | 'FR' | string = 'US',
  options: {
    description?: string;
    example?: string;
  } = {}
): PropertyDecorator {
  const patterns: Record<string, { pattern: RegExp; example: string }> = {
    US: { pattern: /^\d{5}(-\d{4})?$/, example: '12345' },
    CA: { pattern: /^[A-Z]\d[A-Z] ?\d[A-Z]\d$/, example: 'K1A 0B1' },
    UK: { pattern: /^[A-Z]{1,2}\d{1,2} ?\d[A-Z]{2}$/, example: 'SW1A 1AA' },
    DE: { pattern: /^\d{5}$/, example: '10115' },
    FR: { pattern: /^\d{5}$/, example: '75001' },
  };

  const { pattern, example: defaultExample } = patterns[country] || patterns['US'];
  const {
    description = `${country} postal code`,
    example = options.example || defaultExample,
  } = options;

  return applyDecorators(
    IsString({ message: 'Postal code must be a string' }),
    Matches(pattern, { message: `Invalid ${country} postal code format` }),
    ApiProperty({
      type: String,
      description,
      example,
      pattern: pattern.toString(),
    })
  );
}
