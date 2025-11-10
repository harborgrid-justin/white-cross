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
import { ValidationOptions, ValidationError } from 'class-validator';
import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
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
export declare function createTypeValidator<T extends object>(): {
    string(key: keyof T, options?: {
        min?: number;
        max?: number;
        pattern?: RegExp;
    }): any;
    number(key: keyof T, options?: {
        min?: number;
        max?: number;
    }): any;
    boolean(key: keyof T): any;
    date(key: keyof T, options?: {
        min?: Date;
        max?: Date;
    }): any;
    array(key: keyof T, itemValidator?: SchemaValidator<any>): any;
    object(key: keyof T, schema?: SchemaDefinition): any;
    optional(key: keyof T): any;
    build(): SchemaValidator<T>;
};
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
export declare function assertType<T>(value: any, guard: (value: any) => value is T, message?: string): T;
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
export declare function validateType<T>(value: any, schema: SchemaDefinition<T>): ValidationResult<T>;
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
export declare function schemaBuilder<T extends object>(): {
    field<K extends keyof T>(key: K, configure: (field: FieldBuilder) => FieldBuilder): any;
    build(): {
        validate: (value: T) => ValidationResult<T>;
    };
};
/**
 * Field builder for schema field configuration.
 */
declare class FieldBuilder {
    private schema;
    string(): this;
    number(): this;
    boolean(): this;
    date(): this;
    array(): this;
    object(): this;
    required(): this;
    nullable(): this;
    default(value: any): this;
    min(value: number): this;
    max(value: number): this;
    email(): this;
    pattern(regex: RegExp): this;
    custom(validator: ValidatorRule): this;
    transform<TInput, TOutput>(fn: TransformFn<TInput, TOutput>): this;
    getSchema(): SchemaDefinition;
}
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
export declare function IsUniqueArray(validationOptions?: ValidationOptions): PropertyDecorator;
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
export declare function IsJsonString(validationOptions?: ValidationOptions): PropertyDecorator;
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
export declare function IsPositive(validationOptions?: ValidationOptions): PropertyDecorator;
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
export declare function IsNegative(validationOptions?: ValidationOptions): PropertyDecorator;
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
export declare function IsAlphanumeric(validationOptions?: ValidationOptions): PropertyDecorator;
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
export declare function IsEnumValue<T extends object>(enumType: T, validationOptions?: ValidationOptions): PropertyDecorator;
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
export declare function ToTitleCase(): PropertyDecorator;
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
export declare function ToSlug(): PropertyDecorator;
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
export declare function SplitString(separator?: string): PropertyDecorator;
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
export declare function ParseNumber(): PropertyDecorator;
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
export declare function ParseDate(): PropertyDecorator;
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
export declare function StripHtml(): PropertyDecorator;
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
export declare function Sanitize(allowedChars?: string): PropertyDecorator;
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
export declare function createAsyncValidator<T>(name: string, validator: AsyncValidator<T>, message: string | ((value: T) => string)): (validationOptions?: ValidationOptions) => PropertyDecorator;
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
export declare class ValidationPipeWithDetails implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata): Promise<any>;
    private toValidate;
    private formatErrors;
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
export declare class SanitizationPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata): any;
    private toTransform;
}
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
export declare function IsGreaterThan(property: string, validationOptions?: ValidationOptions): PropertyDecorator;
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
export declare function IsLessThan(property: string, validationOptions?: ValidationOptions): PropertyDecorator;
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
export declare function ValidateIf(property: string, expectedValue: any, validationOptions?: ValidationOptions): PropertyDecorator;
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
export declare function aggregateValidationErrors(errors: ValidationError[]): Record<string, string[]>;
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
export declare function flattenValidationErrors(errors: ValidationError[]): string[];
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
export declare function validateDto<T extends object>(dto: T): Promise<void>;
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
export declare function validateDtoWithResult<T extends object>(dto: T): Promise<ValidationResult<T>>;
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
export declare function transformAndValidate<T extends object>(dtoClass: new () => T, plain: any): Promise<T>;
declare const _default: {
    createTypeValidator: typeof createTypeValidator;
    assertType: typeof assertType;
    validateType: typeof validateType;
    schemaBuilder: typeof schemaBuilder;
    IsUniqueArray: typeof IsUniqueArray;
    IsJsonString: typeof IsJsonString;
    IsPositive: typeof IsPositive;
    IsNegative: typeof IsNegative;
    IsAlphanumeric: typeof IsAlphanumeric;
    IsEnumValue: typeof IsEnumValue;
    ToTitleCase: typeof ToTitleCase;
    ToSlug: typeof ToSlug;
    SplitString: typeof SplitString;
    ParseNumber: typeof ParseNumber;
    ParseDate: typeof ParseDate;
    StripHtml: typeof StripHtml;
    Sanitize: typeof Sanitize;
    createAsyncValidator: typeof createAsyncValidator;
    ValidationPipeWithDetails: typeof ValidationPipeWithDetails;
    SanitizationPipe: typeof SanitizationPipe;
    IsGreaterThan: typeof IsGreaterThan;
    IsLessThan: typeof IsLessThan;
    ValidateIf: typeof ValidateIf;
    aggregateValidationErrors: typeof aggregateValidationErrors;
    flattenValidationErrors: typeof flattenValidationErrors;
    validateDto: typeof validateDto;
    validateDtoWithResult: typeof validateDtoWithResult;
    transformAndValidate: typeof transformAndValidate;
};
export default _default;
//# sourceMappingURL=typescript-validation-kit.d.ts.map