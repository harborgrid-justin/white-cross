/**
 * LOC: VALTRANSF-001
 * File: /reuse/validation-transformation-kit.ts
 *
 * UPSTREAM (imports from):
 *   - zod
 *   - class-validator
 *   - class-transformer
 *   - @nestjs/common
 *   - sequelize / sequelize-typescript
 *
 * DOWNSTREAM (imported by):
 *   - DTOs and validation pipes
 *   - Service layer validators
 *   - Middleware and guards
 *   - Data transformation services
 *   - API input validation
 */
/**
 * File: /reuse/validation-transformation-kit.ts
 * Locator: WC-UTL-VALTRANSF-001
 * Purpose: Advanced Validation and Transformation Utilities - Production-grade data validation, transformation, sanitization with Zod + class-validator
 *
 * Upstream: zod, class-validator, class-transformer, @nestjs/common, sequelize, sequelize-typescript
 * Downstream: ../backend/*, DTOs, validation pipes, services, middleware, guards
 * Dependencies: NestJS 10.x, Zod 3.x, class-validator 0.14.x, class-transformer 0.5.x, Sequelize 6.x, TypeScript 5.x
 * Exports: 40 production-grade utility functions for validation, transformation, sanitization, type-safe DTOs, custom decorators
 *
 * LLM Context: Enterprise-grade validation and transformation utilities for White Cross healthcare platform.
 * Provides comprehensive Zod schema builders, class-validator decorators, custom validation decorators,
 * data transformation pipes, type-safe DTO builders, nested object validators, array validation utilities,
 * conditional validation helpers, cross-field validation, async validators, custom error message formatters,
 * schema composition utilities, sanitization functions, type guards, and runtime type checking.
 * Optimized for HIPAA-compliant healthcare data validation and transformation.
 *
 * Features:
 * - Advanced Zod schema composition
 * - Custom class-validator decorators
 * - Type-safe DTO builders with inference
 * - Nested validation with path tracking
 * - Conditional and cross-field validation
 * - Async validation with caching
 * - Custom error formatting and i18n
 * - Sanitization and normalization
 * - Runtime type checking and guards
 * - NestJS pipe integration
 */
import { z, ZodSchema, ZodType, ZodTypeAny, ZodRawShape, ZodObject } from 'zod';
import { ValidationOptions, ValidatorOptions, ValidationError as ClassValidationError, validate, validateOrReject, validateSync } from 'class-validator';
import { Transform, Type, plainToInstance, classToPlain, instanceToPlain, ClassConstructor, TransformOptions } from 'class-transformer';
import { PipeTransform, Type as NestType } from '@nestjs/common';
/**
 * Zod schema for validation error structure.
 */
export declare const ValidationErrorSchema: any;
/**
 * Zod schema for validation result.
 */
export declare const ValidationResultSchema: any;
/**
 * Zod schema for transformation options.
 */
export declare const TransformationOptionsSchema: any;
/**
 * Zod schema for sanitization options.
 */
export declare const SanitizationOptionsSchema: any;
/**
 * Zod schema for conditional validation configuration.
 */
export declare const ConditionalValidationSchema: any;
/**
 * Zod schema for cross-field validation configuration.
 */
export declare const CrossFieldValidationSchema: any;
export interface ValidationError {
    field: string;
    message: string;
    code: string;
    value?: any;
    constraints?: Record<string, any>;
    children?: ValidationError[];
}
export interface ValidationResult<T = any> {
    isValid: boolean;
    errors: ValidationError[];
    sanitizedValue?: T;
    metadata?: Record<string, any>;
}
export interface SanitizationOptions {
    trim?: boolean;
    lowercase?: boolean;
    uppercase?: boolean;
    removeSpecialChars?: boolean;
    maxLength?: number;
    minLength?: number;
    allowedChars?: RegExp;
    stripHtml?: boolean;
    normalizeWhitespace?: boolean;
    removeEmojis?: boolean;
}
export interface TransformationOptions extends TransformOptions {
    strategy?: 'class' | 'plain' | 'literal';
}
export interface ConditionalValidationConfig {
    field: string;
    condition: (value: any, object: any) => boolean;
    validator: ZodSchema | ((value: any) => boolean);
    errorMessage: string;
}
export interface CrossFieldValidationConfig {
    fields: string[];
    validator: (values: Record<string, any>) => boolean;
    errorMessage: string;
    targetField?: string;
}
export interface AsyncValidatorConfig {
    name: string;
    validator: (value: any, object?: any) => Promise<boolean>;
    errorMessage: string | ((value: any) => string);
    cacheKey?: (value: any) => string;
    cacheTTL?: number;
}
export interface ValidationPipeOptions {
    transform?: boolean;
    whitelist?: boolean;
    forbidNonWhitelisted?: boolean;
    skipMissingProperties?: boolean;
    forbidUnknownValues?: boolean;
    disableErrorMessages?: boolean;
    errorHttpStatusCode?: number;
    expectedType?: any;
    transformOptions?: TransformOptions;
    validatorOptions?: ValidatorOptions;
}
export interface DTOBuilderOptions {
    strict?: boolean;
    transform?: boolean;
    stripUnknown?: boolean;
    coerce?: boolean;
}
export interface NestedValidationOptions {
    maxDepth?: number;
    trackPath?: boolean;
    failFast?: boolean;
    includeChildren?: boolean;
}
export interface ArrayValidationOptions {
    minItems?: number;
    maxItems?: number;
    unique?: boolean;
    uniqueBy?: string | ((item: any) => any);
    sorted?: boolean;
    sortBy?: string | ((a: any, b: any) => number);
}
/**
 * 1. Creates a Zod schema builder with fluent API for complex validation chains.
 *
 * @example
 * const userSchema = createFluentSchemaBuilder()
 *   .string('email').email().required()
 *   .string('name').min(2).max(100).optional()
 *   .number('age').int().positive().max(150)
 *   .build();
 */
export declare function createFluentSchemaBuilder(): {
    string(name: string): {
        email: () => /*elided*/ any;
        url: () => /*elided*/ any;
        uuid: () => /*elided*/ any;
        min: (len: number) => /*elided*/ any;
        max: (len: number) => /*elided*/ any;
        length: (len: number) => /*elided*/ any;
        regex: (pattern: RegExp) => /*elided*/ any;
        trim: () => /*elided*/ any;
        required: () => /*elided*/ any;
        optional: () => /*elided*/ any;
        nullable: () => /*elided*/ any;
    };
    number(name: string): {
        int: () => /*elided*/ any;
        positive: () => /*elided*/ any;
        negative: () => /*elided*/ any;
        nonnegative: () => /*elided*/ any;
        min: (val: number) => /*elided*/ any;
        max: (val: number) => /*elided*/ any;
        required: () => /*elided*/ any;
        optional: () => /*elided*/ any;
    };
    boolean(name: string): {
        required: () => /*elided*/ any;
        optional: () => /*elided*/ any;
    };
    array(name: string, itemSchema: ZodTypeAny): {
        min: (len: number) => /*elided*/ any;
        max: (len: number) => /*elided*/ any;
        length: (len: number) => /*elided*/ any;
        nonempty: () => /*elided*/ any;
        required: () => /*elided*/ any;
        optional: () => /*elided*/ any;
    };
    object(name: string, shape: ZodRawShape): /*elided*/ any;
    build(): any;
};
/**
 * 2. Creates a Zod schema with advanced conditional validation.
 *
 * @example
 * const schema = createConditionalSchema(z.object({
 *   type: z.enum(['person', 'company']),
 *   name: z.string(),
 * }), {
 *   field: 'ssn',
 *   condition: (data) => data.type === 'person',
 *   validator: z.string().regex(/^\d{3}-\d{2}-\d{4}$/),
 *   errorMessage: 'SSN required for person type',
 * });
 */
export declare function createConditionalSchema<T extends ZodRawShape>(baseSchema: ZodObject<T>, config: ConditionalValidationConfig): ZodSchema;
/**
 * 3. Creates a Zod schema with cross-field validation.
 *
 * @example
 * const schema = createCrossFieldSchema(z.object({
 *   password: z.string(),
 *   confirmPassword: z.string(),
 * }), {
 *   fields: ['password', 'confirmPassword'],
 *   validator: (values) => values.password === values.confirmPassword,
 *   errorMessage: 'Passwords must match',
 *   targetField: 'confirmPassword',
 * });
 */
export declare function createCrossFieldSchema<T extends ZodRawShape>(baseSchema: ZodObject<T>, config: CrossFieldValidationConfig): ZodSchema;
/**
 * 4. Creates a composable Zod schema from multiple partial schemas.
 *
 * @example
 * const baseUser = z.object({ id: z.string(), name: z.string() });
 * const withEmail = z.object({ email: z.string().email() });
 * const withPhone = z.object({ phone: z.string() });
 * const fullUser = composeSchemas(baseUser, withEmail, withPhone);
 */
export declare function composeSchemas<T extends ZodRawShape>(...schemas: ZodObject<any>[]): ZodObject<T>;
/**
 * 5. Creates a Zod schema with custom error messages.
 *
 * @example
 * const schema = createSchemaWithMessages(z.object({
 *   email: z.string().email(),
 *   age: z.number().int().positive(),
 * }), {
 *   email: { email: 'Please provide a valid email address' },
 *   age: { positive: 'Age must be a positive number' },
 * });
 */
export declare function createSchemaWithMessages<T extends ZodRawShape>(schema: ZodObject<T>, messages: Record<string, Record<string, string>>): ZodObject<T>;
/**
 * 6. Creates a discriminated union schema for polymorphic validation.
 *
 * @example
 * const paymentSchema = createDiscriminatedUnionSchema('type', [
 *   z.object({ type: z.literal('card'), cardNumber: z.string() }),
 *   z.object({ type: z.literal('bank'), accountNumber: z.string() }),
 * ]);
 */
export declare function createDiscriminatedUnionSchema<T extends string>(discriminator: T, schemas: ZodObject<any>[]): z.ZodDiscriminatedUnion<T, any>;
/**
 * 7. Creates a recursive schema for nested structures.
 *
 * @example
 * interface Category {
 *   id: string;
 *   name: string;
 *   children?: Category[];
 * }
 * const categorySchema = createRecursiveSchema<Category>((self) => z.object({
 *   id: z.string(),
 *   name: z.string(),
 *   children: z.array(self).optional(),
 * }));
 */
export declare function createRecursiveSchema<T>(factory: (self: ZodType<T>) => ZodType<T>): ZodType<T>;
/**
 * 8. Creates a Zod schema from a TypeScript interface (runtime validation generator).
 *
 * @example
 * interface User {
 *   id: string;
 *   email: string;
 *   age: number;
 *   isActive: boolean;
 * }
 * const schema = createSchemaFromShape<User>({
 *   id: z.string().uuid(),
 *   email: z.string().email(),
 *   age: z.number().int().positive(),
 *   isActive: z.boolean(),
 * });
 */
export declare function createSchemaFromShape<T>(shape: {
    [K in keyof T]: ZodType<T[K]>;
}): ZodObject<any, any, any, T>;
/**
 * 9. Custom decorator for validating against a Zod schema.
 *
 * @example
 * class CreateUserDto {
 *   @IsZodValid(z.string().email())
 *   email: string;
 * }
 */
export declare function IsZodValid(schema: ZodSchema, validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
/**
 * 10. Custom decorator for cross-field validation.
 *
 * @example
 * class PasswordDto {
 *   password: string;
 *
 *   @MatchesField('password', { message: 'Passwords must match' })
 *   confirmPassword: string;
 * }
 */
export declare function MatchesField(field: string, validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
/**
 * 11. Custom decorator for conditional validation based on another field.
 *
 * @example
 * class UserDto {
 *   type: 'person' | 'company';
 *
 *   @ValidateIf((obj) => obj.type === 'person')
 *   @IsString()
 *   ssn?: string;
 * }
 */
export declare function ValidateIf(condition: (object: any, value: any) => boolean, validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
/**
 * 12. Custom decorator for validating nested objects with depth control.
 *
 * @example
 * class AddressDto {
 *   street: string;
 *   city: string;
 * }
 * class UserDto {
 *   @ValidateNested({ maxDepth: 3 })
 *   address: AddressDto;
 * }
 */
export declare function ValidateNestedWithDepth(options?: NestedValidationOptions): (object: Object, propertyName: string) => void;
/**
 * 13. Custom decorator for array validation with advanced options.
 *
 * @example
 * class TagsDto {
 *   @ValidateArray({ minItems: 1, maxItems: 10, unique: true })
 *   tags: string[];
 * }
 */
export declare function ValidateArray(options: ArrayValidationOptions, validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
export declare function AsyncValidateWithCache(config: AsyncValidatorConfig, validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
/**
 * 15. Creates a type-safe DTO class from a Zod schema with full type inference.
 *
 * @example
 * const UserSchema = z.object({
 *   id: z.string().uuid(),
 *   email: z.string().email(),
 *   age: z.number().int().positive(),
 * });
 * const UserDto = createDtoFromSchema(UserSchema);
 * const user = new UserDto({ id: '...', email: 'test@example.com', age: 25 });
 */
export declare function createDtoFromSchema<T extends ZodRawShape>(schema: ZodObject<T>, options?: DTOBuilderOptions): any;
/**
 * 16. Creates a partial DTO builder with optional fields.
 *
 * @example
 * const UserSchema = z.object({ id: z.string(), name: z.string(), email: z.string() });
 * const PartialUserDto = createPartialDto(UserSchema, ['name', 'email']);
 * // id is required, name and email are optional
 */
export declare function createPartialDto<T extends ZodRawShape, K extends keyof T>(schema: ZodObject<T>, optionalFields: K[]): ZodObject<any>;
/**
 * 17. Creates a required DTO builder (removes optional modifiers).
 *
 * @example
 * const UserSchema = z.object({
 *   id: z.string(),
 *   name: z.string().optional(),
 *   email: z.string().optional(),
 * });
 * const RequiredUserDto = createRequiredDto(UserSchema, ['name', 'email']);
 */
export declare function createRequiredDto<T extends ZodRawShape, K extends keyof T>(schema: ZodObject<T>, requiredFields: K[]): ZodObject<any>;
/**
 * 18. Creates a DTO builder with field transformations.
 *
 * @example
 * const UserDto = createTransformingDto(UserSchema, {
 *   email: (val) => val.toLowerCase().trim(),
 *   name: (val) => val.trim(),
 * });
 */
export declare function createTransformingDto<T extends ZodRawShape>(schema: ZodObject<T>, transformers: Partial<Record<keyof T, (value: any) => any>>): ZodObject<any>;
/**
 * 19. Creates a NestJS validation pipe with Zod schema.
 *
 * @example
 * @Post()
 * @UsePipes(createZodValidationPipe(CreateUserSchema))
 * createUser(@Body() dto: CreateUserDto) {
 *   return this.userService.create(dto);
 * }
 */
export declare function createZodValidationPipe(schema: ZodSchema): NestType<PipeTransform>;
/**
 * 20. Creates a transformation pipe for class-transformer with type safety.
 *
 * @example
 * @Post()
 * @UsePipes(createTransformationPipe(CreateUserDto))
 * createUser(@Body() dto: CreateUserDto) {
 *   return this.userService.create(dto);
 * }
 */
export declare function createTransformationPipe<T>(classType: ClassConstructor<T>, options?: TransformationOptions): NestType<PipeTransform>;
/**
 * 21. Creates a sanitization pipe for input data.
 *
 * @example
 * @Post()
 * @UsePipes(createSanitizationPipe({ trim: true, stripHtml: true }))
 * createPost(@Body() dto: CreatePostDto) {
 *   return this.postService.create(dto);
 * }
 */
export declare function createSanitizationPipe(options: SanitizationOptions): NestType<PipeTransform>;
/**
 * 22. Creates a combined validation and transformation pipe.
 *
 * @example
 * @Post()
 * @UsePipes(createValidationTransformPipe(CreateUserDto, CreateUserSchema))
 * createUser(@Body() dto: CreateUserDto) {
 *   return this.userService.create(dto);
 * }
 */
export declare function createValidationTransformPipe<T>(classType: ClassConstructor<T>, schema: ZodSchema): NestType<PipeTransform>;
/**
 * 23. Sanitizes a string based on provided options.
 *
 * @example
 * const clean = sanitizeString('  Hello <script>alert("xss")</script>  ', {
 *   trim: true,
 *   stripHtml: true,
 * });
 * // Result: "Hello alert("xss")"
 */
export declare function sanitizeString(value: string, options: SanitizationOptions): string;
/**
 * 24. Sanitizes an object recursively.
 *
 * @example
 * const clean = sanitizeObject({
 *   name: '  John  ',
 *   email: 'JOHN@EXAMPLE.COM',
 *   bio: '<p>Hello</p>',
 * }, { trim: true, stripHtml: true });
 */
export declare function sanitizeObject<T extends Record<string, any>>(obj: T, options: SanitizationOptions): T;
/**
 * 25. Normalizes email addresses.
 *
 * @example
 * const email = normalizeEmail('  John.Doe+tag@EXAMPLE.COM  ');
 * // Result: "john.doe@example.com"
 */
export declare function normalizeEmail(email: string, options?: {
    removeDots?: boolean;
    removeSubaddress?: boolean;
}): string;
/**
 * 26. Normalizes phone numbers to E.164 format.
 *
 * @example
 * const phone = normalizePhoneNumber('(555) 123-4567', { countryCode: '+1' });
 * // Result: "+15551234567"
 */
export declare function normalizePhoneNumber(phone: string, options?: {
    countryCode?: string;
}): string;
/**
 * 27. Removes null and undefined values from an object.
 *
 * @example
 * const clean = removeNullish({ a: 1, b: null, c: undefined, d: 0 });
 * // Result: { a: 1, d: 0 }
 */
export declare function removeNullish<T extends Record<string, any>>(obj: T): Partial<T>;
/**
 * 28. Removes empty strings from an object.
 *
 * @example
 * const clean = removeEmptyStrings({ a: 'hello', b: '', c: '  ' });
 * // Result: { a: 'hello' }
 */
export declare function removeEmptyStrings<T extends Record<string, any>>(obj: T, trimFirst?: boolean): Partial<T>;
/**
 * 29. Validates nested objects with path tracking.
 *
 * @example
 * const result = await validateNested(user, UserDto, { trackPath: true, maxDepth: 5 });
 */
export declare function validateNested<T extends object>(obj: T, classType: ClassConstructor<T>, options?: NestedValidationOptions): Promise<ValidationResult<T>>;
/**
 * 30. Validates nested objects at a specific path.
 *
 * @example
 * const result = validateAtPath(user, 'address.billing', AddressDto);
 */
export declare function validateAtPath<T extends object>(obj: any, path: string, classType: ClassConstructor<T>): Promise<ValidationResult<T>>;
/**
 * 31. Validates an array of nested objects.
 *
 * @example
 * const results = await validateNestedArray(users, UserDto, { failFast: false });
 */
export declare function validateNestedArray<T extends object>(array: T[], classType: ClassConstructor<T>, options?: NestedValidationOptions): Promise<ValidationResult<T[]>>;
/**
 * 32. Gets a value at a nested path in an object.
 *
 * @example
 * const city = getValueAtPath(user, 'address.billing.city');
 */
export declare function getValueAtPath(obj: any, path: string): any;
/**
 * 33. Sets a value at a nested path in an object.
 *
 * @example
 * setValueAtPath(user, 'address.billing.city', 'New York');
 */
export declare function setValueAtPath(obj: any, path: string, value: any): void;
/**
 * 34. Formats class-validator errors into a standardized structure.
 *
 * @example
 * const formatted = formatValidationErrors(errors, true);
 */
export declare function formatValidationErrors(errors: ClassValidationError[], includePath?: boolean): ValidationError[];
/**
 * 36. Creates custom error messages with interpolation.
 *
 * @example
 * const message = createErrorMessage('{{field}} must be between {{min}} and {{max}}', {
 *   field: 'Age',
 *   min: 18,
 *   max: 100,
 * });
 */
export declare function createErrorMessage(template: string, context: Record<string, any>): string;
/**
 * 37. Formats Zod errors into a standardized structure.
 *
 * @example
 * const formatted = formatZodErrors(zodError);
 */
export declare function formatZodErrors(error: z.ZodError): ValidationError[];
/**
 * 38. Combines multiple validation error arrays.
 *
 * @example
 * const allErrors = combineValidationErrors(zodErrors, classValidatorErrors);
 */
export declare function combineValidationErrors(...errorArrays: ValidationError[][]): ValidationError[];
/**
 * 39. Creates a type guard from a Zod schema.
 *
 * @example
 * const isUser = createTypeGuard(UserSchema);
 * if (isUser(data)) {
 *   console.log(data.email); // Type-safe access
 * }
 */
export declare function createTypeGuard<T>(schema: ZodSchema): (value: unknown) => value is T;
/**
 * 40. Asserts that a value matches a Zod schema (throws if invalid).
 *
 * @example
 * assertType(data, UserSchema);
 * console.log(data.email); // Type-safe - will throw if invalid
 */
export declare function assertType<T>(value: unknown, schema: ZodType<T>): asserts value is T;
export { z, ZodSchema, ZodType, ZodObject, validate, validateOrReject, validateSync, plainToInstance, instanceToPlain, classToPlain, Transform, Type, };
//# sourceMappingURL=validation-transformation-kit.d.ts.map