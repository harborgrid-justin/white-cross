/**
 * LOC: SWG-KIT-001
 * File: /reuse/swagger-openapi-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - API controllers and DTOs
 *   - Swagger configuration modules
 *   - OpenAPI documentation generators
 *   - NestJS application modules
 */
/**
 * File: /reuse/swagger-openapi-kit.ts
 * Locator: WC-UTL-SWG-001
 * Purpose: Comprehensive Swagger/OpenAPI Documentation Toolkit - Production-ready utilities for building complete API documentation
 *
 * Upstream: Independent utility module for Swagger/OpenAPI specifications
 * Downstream: ../backend/*, API controllers, DTOs, Swagger modules, documentation services, testing frameworks
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, @nestjs/swagger 7.x, OpenAPI 3.0+, class-validator, class-transformer
 * Exports: 47 utility functions for comprehensive OpenAPI schema generation, Swagger decorators, API documentation, validation, examples, versioning
 *
 * LLM Context: Enterprise-grade Swagger/OpenAPI documentation toolkit for implementing production-ready API documentation in White Cross system.
 * Provides advanced schema builders, decorator factories, response generators, security configurations, versioning strategies, validation helpers,
 * example generators, and comprehensive API documentation utilities. Essential for maintaining consistent, discoverable, well-documented healthcare APIs
 * with full OpenAPI 3.0+ compliance, code generation support, and integration with API testing frameworks.
 */
import { Type } from '@nestjs/common';
import { ApiPropertyOptions, ApiResponseOptions, ApiOperationOptions, ApiQueryOptions, ApiBodyOptions } from '@nestjs/swagger';
interface SwaggerSchemaBuilder {
    type: 'object' | 'array' | 'string' | 'number' | 'integer' | 'boolean' | 'null';
    format?: string;
    description?: string;
    example?: any;
    examples?: any[];
    required?: boolean;
    nullable?: boolean;
    deprecated?: boolean;
    enum?: any[];
    default?: any;
    minimum?: number;
    maximum?: number;
    exclusiveMinimum?: boolean;
    exclusiveMaximum?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    minItems?: number;
    maxItems?: number;
    uniqueItems?: boolean;
    items?: SwaggerSchemaBuilder;
    properties?: Record<string, SwaggerSchemaBuilder>;
    additionalProperties?: boolean | SwaggerSchemaBuilder;
    allOf?: SwaggerSchemaBuilder[];
    oneOf?: SwaggerSchemaBuilder[];
    anyOf?: SwaggerSchemaBuilder[];
    discriminator?: DiscriminatorObject;
    readOnly?: boolean;
    writeOnly?: boolean;
    xml?: XmlObject;
    externalDocs?: ExternalDocsObject;
}
interface DiscriminatorObject {
    propertyName: string;
    mapping?: Record<string, string>;
}
interface XmlObject {
    name?: string;
    namespace?: string;
    prefix?: string;
    attribute?: boolean;
    wrapped?: boolean;
}
interface ExternalDocsObject {
    description?: string;
    url: string;
}
interface ApiVersionConfig {
    version: string;
    deprecated?: boolean;
    deprecatedSince?: string;
    sunsetDate?: string;
    alternativeVersion?: string;
}
interface SwaggerTagConfig {
    name: string;
    description: string;
    externalDocs?: ExternalDocsObject;
}
interface ApiExampleObject {
    summary?: string;
    description?: string;
    value: any;
    externalValue?: string;
}
interface SecuritySchemeConfig {
    type: 'apiKey' | 'http' | 'oauth2' | 'openIdConnect' | 'mutualTLS';
    description?: string;
    name?: string;
    in?: 'query' | 'header' | 'cookie';
    scheme?: 'basic' | 'bearer' | 'digest' | 'hoba' | 'mutual' | 'negotiate' | 'oauth' | 'scram-sha-1' | 'scram-sha-256' | 'vapid';
    bearerFormat?: string;
    flows?: OAuth2Flows;
    openIdConnectUrl?: string;
}
interface OAuth2Flows {
    implicit?: OAuth2FlowConfig;
    password?: OAuth2FlowConfig;
    clientCredentials?: OAuth2FlowConfig;
    authorizationCode?: OAuth2FlowConfig;
}
interface OAuth2FlowConfig {
    authorizationUrl?: string;
    tokenUrl?: string;
    refreshUrl?: string;
    scopes: Record<string, string>;
}
interface ValidationConstraints {
    minLength?: number;
    maxLength?: number;
    minimum?: number;
    maximum?: number;
    pattern?: string;
    format?: string;
    enum?: any[];
    multipleOf?: number;
    uniqueItems?: boolean;
}
interface ContentTypeConfig {
    mimeType: string;
    schema?: any;
    example?: any;
    examples?: Record<string, ApiExampleObject>;
    encoding?: Record<string, EncodingObject>;
}
interface EncodingObject {
    contentType?: string;
    headers?: Record<string, any>;
    style?: string;
    explode?: boolean;
    allowReserved?: boolean;
}
interface CallbackConfig {
    expression: string;
    operation: any;
}
interface LinkConfig {
    operationRef?: string;
    operationId?: string;
    parameters?: Record<string, any>;
    requestBody?: any;
    description?: string;
    server?: ServerConfig;
}
interface ServerConfig {
    url: string;
    description?: string;
    variables?: Record<string, ServerVariableConfig>;
}
interface ServerVariableConfig {
    enum?: string[];
    default: string;
    description?: string;
}
/**
 * 1. Creates a comprehensive OpenAPI schema from builder configuration.
 *
 * @param {SwaggerSchemaBuilder} config - Schema builder configuration
 * @returns {Record<string, any>} Complete OpenAPI schema object
 *
 * @example
 * ```typescript
 * const schema = buildOpenApiSchema({
 *   type: 'object',
 *   description: 'Patient record',
 *   required: true,
 *   properties: {
 *     id: { type: 'string', format: 'uuid', readOnly: true },
 *     name: { type: 'string', minLength: 1, maxLength: 100 },
 *     age: { type: 'integer', minimum: 0, maximum: 150 }
 *   }
 * });
 * ```
 */
export declare const buildOpenApiSchema: (config: SwaggerSchemaBuilder) => Record<string, any>;
/**
 * 2. Creates a schema reference to a component schema.
 *
 * @param {string} schemaName - Name of the schema component
 * @param {boolean} [isArray] - Whether this is an array of the schema
 * @returns {Record<string, any>} OpenAPI reference object
 *
 * @example
 * ```typescript
 * const ref = createSchemaReference('PatientDto', true);
 * // Result: { type: 'array', items: { $ref: '#/components/schemas/PatientDto' } }
 * ```
 */
export declare const createSchemaReference: (schemaName: string, isArray?: boolean) => Record<string, any>;
/**
 * 3. Creates a polymorphic schema with discriminator support.
 *
 * @param {string} discriminatorProperty - Property name used for discrimination
 * @param {Record<string, string>} typeMapping - Mapping of discriminator values to schema names
 * @param {string} [baseSchema] - Optional base schema name
 * @returns {Record<string, any>} OpenAPI polymorphic schema
 *
 * @example
 * ```typescript
 * const schema = createPolymorphicSchema('type', {
 *   inpatient: 'InpatientDto',
 *   outpatient: 'OutpatientDto',
 *   emergency: 'EmergencyDto'
 * }, 'BasePatientDto');
 * ```
 */
export declare const createPolymorphicSchema: (discriminatorProperty: string, typeMapping: Record<string, string>, baseSchema?: string) => Record<string, any>;
/**
 * 4. Creates a schema with composition using allOf, oneOf, or anyOf.
 *
 * @param {'allOf' | 'oneOf' | 'anyOf'} compositionType - Type of composition
 * @param {string[]} schemaNames - Names of schemas to compose
 * @param {Record<string, SwaggerSchemaBuilder>} [additionalProperties] - Extra properties to add
 * @returns {Record<string, any>} Composed OpenAPI schema
 *
 * @example
 * ```typescript
 * const schema = createComposedSchema('allOf', ['BaseDto', 'TimestampsDto'], {
 *   customField: { type: 'string', description: 'Custom field' }
 * });
 * ```
 */
export declare const createComposedSchema: (compositionType: "allOf" | "oneOf" | "anyOf", schemaNames: string[], additionalProperties?: Record<string, SwaggerSchemaBuilder>) => Record<string, any>;
/**
 * 5. Creates a deeply nested object schema with automatic property building.
 *
 * @param {Record<string, any>} structure - Nested structure definition
 * @param {string} [description] - Schema description
 * @returns {Record<string, any>} OpenAPI nested object schema
 *
 * @example
 * ```typescript
 * const schema = createNestedObjectSchema({
 *   patient: {
 *     personal: { name: 'string', age: 'number' },
 *     medical: { conditions: 'array<string>', allergies: 'array<string>' }
 *   }
 * }, 'Patient information');
 * ```
 */
export declare const createNestedObjectSchema: (structure: Record<string, any>, description?: string) => Record<string, any>;
/**
 * 6. Creates a complete ApiProperty decorator with validation constraints.
 *
 * @param {Partial<ApiPropertyOptions>} options - Base property options
 * @param {ValidationConstraints} [validation] - Validation constraints
 * @returns {ApiPropertyOptions} Complete property decorator options
 *
 * @example
 * ```typescript
 * class PatientDto {
 *   @ApiProperty(createApiPropertyWithValidation({
 *     description: 'Patient email',
 *     example: 'patient@hospital.com'
 *   }, {
 *     format: 'email',
 *     maxLength: 255
 *   }))
 *   email: string;
 * }
 * ```
 */
export declare const createApiPropertyWithValidation: (options: Partial<ApiPropertyOptions>, validation?: ValidationConstraints) => ApiPropertyOptions;
/**
 * 7. Creates a reusable decorator for common property patterns.
 *
 * @param {string} pattern - Pattern name (uuid, email, url, date, datetime, phone, etc.)
 * @param {Partial<ApiPropertyOptions>} [overrides] - Property overrides
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class UserDto {
 *   @createCommonPropertyDecorator('uuid', { description: 'User ID' })
 *   id: string;
 *
 *   @createCommonPropertyDecorator('email')
 *   email: string;
 * }
 * ```
 */
export declare const createCommonPropertyDecorator: (pattern: "uuid" | "email" | "url" | "date" | "datetime" | "phone" | "currency" | "ipv4" | "ipv6", overrides?: Partial<ApiPropertyOptions>) => PropertyDecorator;
/**
 * 8. Creates a decorator for enum properties with descriptions.
 *
 * @param {any} enumType - Enum object
 * @param {Record<string, string>} [descriptions] - Descriptions for each enum value
 * @param {Partial<ApiPropertyOptions>} [options] - Additional options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * enum PatientStatus { Active = 'active', Inactive = 'inactive' }
 * class PatientDto {
 *   @createEnumPropertyDecorator(PatientStatus, {
 *     active: 'Patient is currently active',
 *     inactive: 'Patient is inactive'
 *   })
 *   status: PatientStatus;
 * }
 * ```
 */
export declare const createEnumPropertyDecorator: (enumType: any, descriptions?: Record<string, string>, options?: Partial<ApiPropertyOptions>) => PropertyDecorator;
/**
 * 9. Creates a decorator for array properties with item schema.
 *
 * @param {Type<any> | string} itemType - Type of array items (DTO class or primitive)
 * @param {Partial<ApiPropertyOptions>} [options] - Additional options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class AppointmentDto {
 *   @createArrayPropertyDecorator(PatientDto, {
 *     description: 'List of patients',
 *     minItems: 1,
 *     maxItems: 10
 *   })
 *   patients: PatientDto[];
 * }
 * ```
 */
export declare const createArrayPropertyDecorator: (itemType: Type<any> | "string" | "number" | "boolean", options?: Partial<ApiPropertyOptions>) => PropertyDecorator;
/**
 * 10. Creates a complete success response with multiple status codes.
 *
 * @param {Type<any>} type - Response DTO type
 * @param {string} description - Response description
 * @param {number[]} [statusCodes] - Status codes to document (default: [200])
 * @returns {Record<number, ApiResponseOptions>} Response options by status code
 *
 * @example
 * ```typescript
 * const responses = createSuccessResponses(PatientDto, 'Patient retrieved', [200, 201]);
 * // Apply: Object.entries(responses).forEach(([code, opts]) => @ApiResponse(opts))
 * ```
 */
export declare const createSuccessResponses: (type: Type<any>, description: string, statusCodes?: number[]) => Record<number, ApiResponseOptions>;
/**
 * 11. Creates error response documentation for all common HTTP errors.
 *
 * @param {Record<number, string>} [customMessages] - Custom error messages by status code
 * @returns {Record<number, ApiResponseOptions>} Complete error response set
 *
 * @example
 * ```typescript
 * const errorResponses = createStandardErrorResponses({
 *   404: 'Patient not found',
 *   409: 'Patient already exists'
 * });
 * ```
 */
export declare const createStandardErrorResponses: (customMessages?: Record<number, string>) => Record<number, ApiResponseOptions>;
/**
 * 12. Creates paginated response documentation with metadata.
 *
 * @param {Type<any>} itemType - Type of items in the array
 * @param {string} description - Response description
 * @param {boolean} [includeLinks] - Include HATEOAS links
 * @returns {ApiResponseOptions} Paginated response options
 *
 * @example
 * ```typescript
 * @ApiResponse(createPaginatedResponse(PatientDto, 'Paginated patients', true))
 * ```
 */
export declare const createPaginatedResponse: (itemType: Type<any>, description: string, includeLinks?: boolean) => ApiResponseOptions;
/**
 * 13. Creates file download response documentation.
 *
 * @param {string | string[]} mimeTypes - MIME type(s) of downloadable file
 * @param {string} description - Download description
 * @param {Record<string, string>} [headers] - Response headers
 * @returns {ApiResponseOptions} File download response options
 *
 * @example
 * ```typescript
 * @ApiResponse(createFileDownloadResponse(
 *   ['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
 *   'Download patient report',
 *   { 'Content-Disposition': 'attachment; filename="report.pdf"' }
 * ))
 * ```
 */
export declare const createFileDownloadResponse: (mimeTypes: string | string[], description: string, headers?: Record<string, string>) => ApiResponseOptions;
/**
 * 14. Creates multiple content-type response documentation.
 *
 * @param {ContentTypeConfig[]} contentTypes - Array of content type configurations
 * @param {string} description - Response description
 * @param {number} [statusCode] - HTTP status code (default: 200)
 * @returns {ApiResponseOptions} Multi-content response options
 *
 * @example
 * ```typescript
 * @ApiResponse(createMultiContentResponse([
 *   { mimeType: 'application/json', schema: PatientDto, example: {...} },
 *   { mimeType: 'application/xml', schema: PatientDto }
 * ], 'Patient data in multiple formats'))
 * ```
 */
export declare const createMultiContentResponse: (contentTypes: ContentTypeConfig[], description: string, statusCode?: number) => ApiResponseOptions;
/**
 * 15. Creates comprehensive pagination query parameters documentation.
 *
 * @param {number} [defaultLimit] - Default page size
 * @param {number} [maxLimit] - Maximum page size
 * @param {string[]} [sortableFields] - Fields that can be sorted
 * @returns {ApiQueryOptions[]} Array of query parameter options
 *
 * @example
 * ```typescript
 * createPaginationParams(20, 100, ['name', 'createdAt', 'updatedAt'])
 *   .forEach(param => @ApiQuery(param))
 * ```
 */
export declare const createPaginationParams: (defaultLimit?: number, maxLimit?: number, sortableFields?: string[]) => ApiQueryOptions[];
/**
 * 16. Creates search and filter query parameters documentation.
 *
 * @param {string[]} searchableFields - Fields searchable by text query
 * @param {Record<string, any>} [filterFields] - Fields filterable with their types
 * @returns {ApiQueryOptions[]} Array of query parameter options
 *
 * @example
 * ```typescript
 * createSearchFilterParams(
 *   ['name', 'email', 'phone'],
 *   { status: ['active', 'inactive'], department: 'string' }
 * ).forEach(param => @ApiQuery(param))
 * ```
 */
export declare const createSearchFilterParams: (searchableFields: string[], filterFields?: Record<string, any>) => ApiQueryOptions[];
/**
 * 17. Creates date range query parameters documentation.
 *
 * @param {string[]} dateFields - Date fields that support range queries
 * @returns {ApiQueryOptions[]} Array of date range query parameters
 *
 * @example
 * ```typescript
 * createDateRangeParams(['createdAt', 'updatedAt', 'appointmentDate'])
 *   .forEach(param => @ApiQuery(param))
 * ```
 */
export declare const createDateRangeParams: (dateFields: string[]) => ApiQueryOptions[];
/**
 * 18. Creates file upload body documentation with validation.
 *
 * @param {boolean} multiple - Allow multiple files
 * @param {string[]} [allowedTypes] - Allowed MIME types
 * @param {number} [maxSizeBytes] - Maximum file size in bytes
 * @param {Record<string, SwaggerSchemaBuilder>} [additionalFields] - Extra form fields
 * @returns {ApiBodyOptions} File upload body options
 *
 * @example
 * ```typescript
 * @ApiBody(createFileUploadBody(
 *   true,
 *   ['image/png', 'image/jpeg', 'application/pdf'],
 *   10485760,
 *   { description: { type: 'string', required: false } }
 * ))
 * ```
 */
export declare const createFileUploadBody: (multiple: boolean, allowedTypes?: string[], maxSizeBytes?: number, additionalFields?: Record<string, SwaggerSchemaBuilder>) => ApiBodyOptions;
/**
 * 19. Creates multipart form-data body documentation.
 *
 * @param {Record<string, SwaggerSchemaBuilder>} fields - Form fields
 * @param {string[]} [requiredFields] - Required field names
 * @returns {ApiBodyOptions} Multipart form body options
 *
 * @example
 * ```typescript
 * @ApiBody(createMultipartFormBody({
 *   patientId: { type: 'string', format: 'uuid' },
 *   notes: { type: 'string', maxLength: 500 },
 *   attachment: { type: 'string', format: 'binary' }
 * }, ['patientId']))
 * ```
 */
export declare const createMultipartFormBody: (fields: Record<string, SwaggerSchemaBuilder>, requiredFields?: string[]) => ApiBodyOptions;
/**
 * 20. Creates complete Bearer JWT security scheme with scopes.
 *
 * @param {Record<string, string>} [scopes] - Available scopes and descriptions
 * @param {string} [description] - Custom description
 * @returns {SecuritySchemeConfig} Bearer security scheme
 *
 * @example
 * ```typescript
 * const bearerScheme = createBearerSecurityScheme({
 *   'patient:read': 'Read patient data',
 *   'patient:write': 'Modify patient data',
 *   'admin': 'Full administrative access'
 * });
 * ```
 */
export declare const createBearerSecurityScheme: (scopes?: Record<string, string>, description?: string) => SecuritySchemeConfig;
/**
 * 21. Creates API Key security scheme for header, query, or cookie.
 *
 * @param {string} name - Parameter name
 * @param {'header' | 'query' | 'cookie'} location - Where the key is sent
 * @param {string} [description] - Custom description
 * @returns {SecuritySchemeConfig} API Key security scheme
 *
 * @example
 * ```typescript
 * const apiKeyScheme = createApiKeySecurityScheme(
 *   'X-API-Key',
 *   'header',
 *   'API key provided during registration'
 * );
 * ```
 */
export declare const createApiKeySecurityScheme: (name: string, location: "header" | "query" | "cookie", description?: string) => SecuritySchemeConfig;
/**
 * 22. Creates comprehensive OAuth2 security scheme with multiple flows.
 *
 * @param {OAuth2Flows} flows - OAuth2 flow configurations
 * @param {string} [description] - Custom description
 * @returns {SecuritySchemeConfig} OAuth2 security scheme
 *
 * @example
 * ```typescript
 * const oauth2Scheme = createOAuth2SecurityScheme({
 *   authorizationCode: {
 *     authorizationUrl: 'https://auth.example.com/oauth/authorize',
 *     tokenUrl: 'https://auth.example.com/oauth/token',
 *     refreshUrl: 'https://auth.example.com/oauth/refresh',
 *     scopes: {
 *       'read': 'Read access',
 *       'write': 'Write access',
 *       'admin': 'Admin access'
 *     }
 *   }
 * });
 * ```
 */
export declare const createOAuth2SecurityScheme: (flows: OAuth2Flows, description?: string) => SecuritySchemeConfig;
/**
 * 23. Creates OpenID Connect security scheme.
 *
 * @param {string} openIdConnectUrl - OpenID Connect discovery URL
 * @param {string} [description] - Custom description
 * @returns {SecuritySchemeConfig} OpenID Connect security scheme
 *
 * @example
 * ```typescript
 * const oidcScheme = createOpenIdConnectScheme(
 *   'https://auth.example.com/.well-known/openid-configuration',
 *   'OpenID Connect authentication with SSO support'
 * );
 * ```
 */
export declare const createOpenIdConnectScheme: (openIdConnectUrl: string, description?: string) => SecuritySchemeConfig;
/**
 * 24. Creates combined security requirements (AND/OR logic).
 *
 * @param {Array<Record<string, string[]>>} requirements - Security requirement alternatives
 * @param {'AND' | 'OR'} logic - Combination logic
 * @returns {Array<Record<string, string[]>>} Security requirements array
 *
 * @example
 * ```typescript
 * // Requires BOTH bearer AND apiKey
 * const andSecurity = createCombinedSecurityRequirements([
 *   { bearer: ['admin'] },
 *   { apiKey: [] }
 * ], 'AND');
 *
 * // Requires EITHER bearer OR apiKey
 * const orSecurity = createCombinedSecurityRequirements([
 *   { bearer: ['user'] },
 *   { apiKey: [] }
 * ], 'OR');
 * ```
 */
export declare const createCombinedSecurityRequirements: (requirements: Array<Record<string, string[]>>, logic: "AND" | "OR") => Array<Record<string, string[]>>;
/**
 * 25. Creates complete Swagger UI configuration with custom theme.
 *
 * @param {string} title - Application title
 * @param {object} [customization] - UI customization options
 * @returns {object} Swagger UI configuration
 *
 * @example
 * ```typescript
 * const swaggerConfig = createSwaggerUIConfiguration('White Cross API', {
 *   logo: '/assets/logo.png',
 *   primaryColor: '#1976d2',
 *   persistAuthorization: true,
 *   tryItOutEnabled: true
 * });
 * ```
 */
export declare const createSwaggerUIConfiguration: (title: string, customization?: {
    logo?: string;
    primaryColor?: string;
    persistAuthorization?: boolean;
    tryItOutEnabled?: boolean;
    displayRequestDuration?: boolean;
    filter?: boolean;
    syntaxHighlight?: boolean;
    defaultModelsExpandDepth?: number;
    defaultModelExpandDepth?: number;
    deepLinking?: boolean;
}) => object;
/**
 * 26. Creates OpenAPI document info section with contact and license.
 *
 * @param {string} title - API title
 * @param {string} version - API version
 * @param {string} description - API description
 * @param {object} [metadata] - Additional metadata
 * @returns {object} OpenAPI info object
 *
 * @example
 * ```typescript
 * const info = createOpenApiInfo(
 *   'White Cross Healthcare API',
 *   '1.0.0',
 *   'Comprehensive healthcare management API',
 *   {
 *     contact: { name: 'API Team', email: 'api@whitecross.com' },
 *     license: { name: 'Proprietary' },
 *     termsOfService: 'https://whitecross.com/terms'
 *   }
 * );
 * ```
 */
export declare const createOpenApiInfo: (title: string, version: string, description: string, metadata?: {
    contact?: {
        name?: string;
        email?: string;
        url?: string;
    };
    license?: {
        name: string;
        url?: string;
    };
    termsOfService?: string;
}) => object;
/**
 * 27. Creates server configurations for multiple environments.
 *
 * @param {ServerConfig[]} servers - Server configurations
 * @returns {object[]} OpenAPI servers array
 *
 * @example
 * ```typescript
 * const servers = createServerConfigurations([
 *   { url: 'https://api.whitecross.com/v1', description: 'Production' },
 *   { url: 'https://staging-api.whitecross.com/v1', description: 'Staging' },
 *   { url: 'http://localhost:3000', description: 'Local Development',
 *     variables: { port: { default: '3000', enum: ['3000', '3001'] } }
 *   }
 * ]);
 * ```
 */
export declare const createServerConfigurations: (servers: ServerConfig[]) => object[];
/**
 * 28. Creates organized tag groups for API documentation.
 *
 * @param {SwaggerTagConfig[]} tags - Tag configurations
 * @returns {object[]} OpenAPI tags array
 *
 * @example
 * ```typescript
 * const tags = createApiTagGroups([
 *   { name: 'Patients', description: 'Patient management endpoints',
 *     externalDocs: { url: 'https://docs.whitecross.com/patients' } },
 *   { name: 'Appointments', description: 'Appointment scheduling' },
 *   { name: 'Authentication', description: 'Auth and security' }
 * ]);
 * ```
 */
export declare const createApiTagGroups: (tags: SwaggerTagConfig[]) => object[];
/**
 * 29. Creates multiple named examples for request/response documentation.
 *
 * @param {Record<string, ApiExampleObject>} examples - Named example objects
 * @returns {Record<string, any>} OpenAPI examples object
 *
 * @example
 * ```typescript
 * const examples = createNamedExamples({
 *   success: {
 *     summary: 'Successful response',
 *     value: { id: '123', name: 'John Doe', status: 'active' }
 *   },
 *   partial: {
 *     summary: 'Partial data',
 *     description: 'When some fields are missing',
 *     value: { id: '456', name: 'Jane Doe' }
 *   }
 * });
 * ```
 */
export declare const createNamedExamples: (examples: Record<string, ApiExampleObject>) => Record<string, any>;
/**
 * 30. Generates realistic example data from schema definition.
 *
 * @param {SwaggerSchemaBuilder} schema - Schema to generate example from
 * @param {Record<string, any>} [overrides] - Override specific field values
 * @returns {any} Generated example value
 *
 * @example
 * ```typescript
 * const example = generateExampleFromSchema({
 *   type: 'object',
 *   properties: {
 *     id: { type: 'string', format: 'uuid' },
 *     email: { type: 'string', format: 'email' },
 *     age: { type: 'integer', minimum: 0 }
 *   }
 * }, { age: 30 });
 * ```
 */
export declare const generateExampleFromSchema: (schema: SwaggerSchemaBuilder, overrides?: Record<string, any>) => any;
/**
 * 31. Creates validation constraint documentation strings.
 *
 * @param {ValidationConstraints} constraints - Validation constraints
 * @returns {string} Formatted constraint documentation
 *
 * @example
 * ```typescript
 * const validationDoc = createValidationDocumentation({
 *   minLength: 8,
 *   maxLength: 100,
 *   pattern: '^[a-zA-Z0-9]+$',
 *   format: 'email'
 * });
 * // Result: "- Min length: 8\n- Max length: 100\n- Pattern: ^[a-zA-Z0-9]+$\n- Format: email"
 * ```
 */
export declare const createValidationDocumentation: (constraints: ValidationConstraints) => string;
/**
 * 32. Creates API version documentation with deprecation info.
 *
 * @param {ApiVersionConfig} config - Version configuration
 * @returns {object} Version metadata object
 *
 * @example
 * ```typescript
 * const versionInfo = createApiVersionInfo({
 *   version: 'v1',
 *   deprecated: true,
 *   deprecatedSince: '2024-01-01',
 *   sunsetDate: '2024-06-01',
 *   alternativeVersion: 'v2'
 * });
 * ```
 */
export declare const createApiVersionInfo: (config: ApiVersionConfig) => object;
/**
 * 33. Creates endpoint deprecation decorator with migration info.
 *
 * @param {string} reason - Deprecation reason
 * @param {string} [alternativeEndpoint] - Alternative endpoint to use
 * @param {string} [sunsetDate] - When endpoint will be removed
 * @returns {object} Deprecation metadata
 *
 * @example
 * ```typescript
 * @ApiOperation({
 *   ...createEndpointDeprecation(
 *     'Replaced with more efficient implementation',
 *     'GET /api/v2/patients',
 *     '2024-06-01'
 *   )
 * })
 * ```
 */
export declare const createEndpointDeprecation: (reason: string, alternativeEndpoint?: string, sunsetDate?: string) => object;
/**
 * 34. Creates version-specific operation documentation.
 *
 * @param {string} version - API version
 * @param {string} summary - Operation summary
 * @param {string} [description] - Detailed description
 * @returns {ApiOperationOptions} Versioned operation options
 *
 * @example
 * ```typescript
 * @ApiOperation(createVersionedOperation('v2', 'Get patient', 'Retrieves patient with enhanced data'))
 * ```
 */
export declare const createVersionedOperation: (version: string, summary: string, description?: string) => ApiOperationOptions;
/**
 * 35. Creates webhook endpoint documentation.
 *
 * @param {string} eventName - Webhook event name
 * @param {Type<any>} payloadType - Webhook payload DTO type
 * @param {string} description - Webhook description
 * @returns {object} Webhook documentation object
 *
 * @example
 * ```typescript
 * const webhook = createWebhookDocumentation(
 *   'patient.created',
 *   PatientCreatedEventDto,
 *   'Triggered when a new patient is created in the system'
 * );
 * ```
 */
export declare const createWebhookDocumentation: (eventName: string, payloadType: Type<any>, description: string) => object;
/**
 * 36. Creates callback documentation for async operations.
 *
 * @param {CallbackConfig[]} callbacks - Callback configurations
 * @returns {object} Callbacks documentation
 *
 * @example
 * ```typescript
 * const callbacks = createCallbackDocumentation([
 *   {
 *     expression: '{$request.body#/callbackUrl}',
 *     operation: {
 *       post: {
 *         requestBody: { content: { 'application/json': { schema: ResultDto } } },
 *         responses: { 200: { description: 'Callback received' } }
 *       }
 *     }
 *   }
 * ]);
 * ```
 */
export declare const createCallbackDocumentation: (callbacks: CallbackConfig[]) => object;
/**
 * 37. Creates HATEOAS links documentation.
 *
 * @param {LinkConfig[]} links - Link configurations
 * @returns {object} Links documentation
 *
 * @example
 * ```typescript
 * const links = createHATEOASLinks([
 *   { operationId: 'getPatient', description: 'Get patient details' },
 *   { operationId: 'updatePatient', description: 'Update patient' },
 *   { operationId: 'deletePatient', description: 'Delete patient' }
 * ]);
 * ```
 */
export declare const createHATEOASLinks: (links: LinkConfig[]) => object;
/**
 * 38. Creates event stream (SSE) response documentation.
 *
 * @param {Type<any>} eventType - Event payload type
 * @param {string} description - Stream description
 * @returns {ApiResponseOptions} SSE response options
 *
 * @example
 * ```typescript
 * @ApiResponse(createEventStreamResponse(
 *   PatientUpdateEventDto,
 *   'Real-time patient updates via Server-Sent Events'
 * ))
 * ```
 */
export declare const createEventStreamResponse: (eventType: Type<any>, description: string) => ApiResponseOptions;
/**
 * 39. Creates batch operation response documentation.
 *
 * @param {Type<any>} itemType - Single item type
 * @param {boolean} [includeErrors] - Include error details per item
 * @returns {ApiResponseOptions} Batch response options
 *
 * @example
 * ```typescript
 * @ApiResponse(createBatchOperationResponse(PatientDto, true))
 * ```
 */
export declare const createBatchOperationResponse: (itemType: Type<any>, includeErrors?: boolean) => ApiResponseOptions;
/**
 * 40. Creates schema with conditional validation rules.
 *
 * @param {SwaggerSchemaBuilder} baseSchema - Base schema
 * @param {Record<string, any>} conditions - Conditional rules
 * @returns {Record<string, any>} Conditional schema
 *
 * @example
 * ```typescript
 * const schema = createConditionalSchema(
 *   { type: 'object', properties: { type: { type: 'string' } } },
 *   {
 *     if: { properties: { type: { const: 'email' } } },
 *     then: { properties: { emailAddress: { type: 'string', format: 'email' } } },
 *     else: { properties: { phoneNumber: { type: 'string' } } }
 *   }
 * );
 * ```
 */
export declare const createConditionalSchema: (baseSchema: SwaggerSchemaBuilder, conditions: Record<string, any>) => Record<string, any>;
/**
 * 41. Creates schema with custom format validators.
 *
 * @param {string} format - Custom format name
 * @param {string} pattern - Regex pattern for validation
 * @param {string} description - Format description
 * @param {string} example - Example value
 * @returns {Record<string, any>} Custom format schema
 *
 * @example
 * ```typescript
 * const schema = createCustomFormatSchema(
 *   'medical-record-number',
 *   '^MRN-[0-9]{8}$',
 *   'Medical Record Number format: MRN-########',
 *   'MRN-12345678'
 * );
 * ```
 */
export declare const createCustomFormatSchema: (format: string, pattern: string, description: string, example: string) => Record<string, any>;
/**
 * 42. Creates readonly/writeonly field configurations.
 *
 * @param {Record<string, SwaggerSchemaBuilder>} properties - Object properties
 * @param {string[]} [readOnlyFields] - Fields that are read-only
 * @param {string[]} [writeOnlyFields] - Fields that are write-only
 * @returns {Record<string, any>} Schema with access modifiers
 *
 * @example
 * ```typescript
 * const schema = createAccessModifierSchema({
 *   id: { type: 'string', format: 'uuid' },
 *   password: { type: 'string', format: 'password' },
 *   name: { type: 'string' }
 * }, ['id'], ['password']);
 * ```
 */
export declare const createAccessModifierSchema: (properties: Record<string, SwaggerSchemaBuilder>, readOnlyFields?: string[], writeOnlyFields?: string[]) => Record<string, any>;
/**
 * 43. Creates comprehensive health check response schema.
 *
 * @param {string[]} dependencies - Service dependencies to check
 * @returns {Record<string, any>} Health check schema
 *
 * @example
 * ```typescript
 * const healthSchema = createHealthCheckSchema(['database', 'redis', 'rabbitmq', 's3']);
 * ```
 */
export declare const createHealthCheckSchema: (dependencies: string[]) => Record<string, any>;
/**
 * 44. Creates metrics endpoint response schema.
 *
 * @param {string[]} metricNames - Metrics to document
 * @returns {Record<string, any>} Metrics schema
 *
 * @example
 * ```typescript
 * const metricsSchema = createMetricsSchema([
 *   'http_requests_total',
 *   'http_request_duration_seconds',
 *   'database_connections_active'
 * ]);
 * ```
 */
export declare const createMetricsSchema: (metricNames: string[]) => Record<string, any>;
/**
 * 45. Creates rate limit headers documentation.
 *
 * @param {number} limit - Rate limit (requests per window)
 * @param {string} window - Time window (e.g., '1h', '1m', '1d')
 * @returns {Record<string, any>} Rate limit headers
 *
 * @example
 * ```typescript
 * const rateLimitHeaders = createRateLimitHeaders(100, '1h');
 * // Add to response documentation
 * ```
 */
export declare const createRateLimitHeaders: (limit: number, window: string) => Record<string, any>;
/**
 * 46. Creates quota usage response schema.
 *
 * @param {string[]} quotaTypes - Types of quotas to document
 * @returns {Record<string, any>} Quota usage schema
 *
 * @example
 * ```typescript
 * const quotaSchema = createQuotaUsageSchema(['api_calls', 'storage', 'bandwidth']);
 * ```
 */
export declare const createQuotaUsageSchema: (quotaTypes: string[]) => Record<string, any>;
/**
 * 47. Creates API cost/billing information schema.
 *
 * @param {string} currency - Currency code (e.g., 'USD', 'EUR')
 * @returns {Record<string, any>} Billing schema
 *
 * @example
 * ```typescript
 * const billingSchema = createApiCostSchema('USD');
 * ```
 */
export declare const createApiCostSchema: (currency?: string) => Record<string, any>;
declare const _default: {
    buildOpenApiSchema: (config: SwaggerSchemaBuilder) => Record<string, any>;
    createSchemaReference: (schemaName: string, isArray?: boolean) => Record<string, any>;
    createPolymorphicSchema: (discriminatorProperty: string, typeMapping: Record<string, string>, baseSchema?: string) => Record<string, any>;
    createComposedSchema: (compositionType: "allOf" | "oneOf" | "anyOf", schemaNames: string[], additionalProperties?: Record<string, SwaggerSchemaBuilder>) => Record<string, any>;
    createNestedObjectSchema: (structure: Record<string, any>, description?: string) => Record<string, any>;
    createApiPropertyWithValidation: (options: Partial<ApiPropertyOptions>, validation?: ValidationConstraints) => ApiPropertyOptions;
    createCommonPropertyDecorator: (pattern: "uuid" | "email" | "url" | "date" | "datetime" | "phone" | "currency" | "ipv4" | "ipv6", overrides?: Partial<ApiPropertyOptions>) => PropertyDecorator;
    createEnumPropertyDecorator: (enumType: any, descriptions?: Record<string, string>, options?: Partial<ApiPropertyOptions>) => PropertyDecorator;
    createArrayPropertyDecorator: (itemType: Type<any> | "string" | "number" | "boolean", options?: Partial<ApiPropertyOptions>) => PropertyDecorator;
    createSuccessResponses: (type: Type<any>, description: string, statusCodes?: number[]) => Record<number, ApiResponseOptions>;
    createStandardErrorResponses: (customMessages?: Record<number, string>) => Record<number, ApiResponseOptions>;
    createPaginatedResponse: (itemType: Type<any>, description: string, includeLinks?: boolean) => ApiResponseOptions;
    createFileDownloadResponse: (mimeTypes: string | string[], description: string, headers?: Record<string, string>) => ApiResponseOptions;
    createMultiContentResponse: (contentTypes: ContentTypeConfig[], description: string, statusCode?: number) => ApiResponseOptions;
    createPaginationParams: (defaultLimit?: number, maxLimit?: number, sortableFields?: string[]) => ApiQueryOptions[];
    createSearchFilterParams: (searchableFields: string[], filterFields?: Record<string, any>) => ApiQueryOptions[];
    createDateRangeParams: (dateFields: string[]) => ApiQueryOptions[];
    createFileUploadBody: (multiple: boolean, allowedTypes?: string[], maxSizeBytes?: number, additionalFields?: Record<string, SwaggerSchemaBuilder>) => ApiBodyOptions;
    createMultipartFormBody: (fields: Record<string, SwaggerSchemaBuilder>, requiredFields?: string[]) => ApiBodyOptions;
    createBearerSecurityScheme: (scopes?: Record<string, string>, description?: string) => SecuritySchemeConfig;
    createApiKeySecurityScheme: (name: string, location: "header" | "query" | "cookie", description?: string) => SecuritySchemeConfig;
    createOAuth2SecurityScheme: (flows: OAuth2Flows, description?: string) => SecuritySchemeConfig;
    createOpenIdConnectScheme: (openIdConnectUrl: string, description?: string) => SecuritySchemeConfig;
    createCombinedSecurityRequirements: (requirements: Array<Record<string, string[]>>, logic: "AND" | "OR") => Array<Record<string, string[]>>;
    createSwaggerUIConfiguration: (title: string, customization?: {
        logo?: string;
        primaryColor?: string;
        persistAuthorization?: boolean;
        tryItOutEnabled?: boolean;
        displayRequestDuration?: boolean;
        filter?: boolean;
        syntaxHighlight?: boolean;
        defaultModelsExpandDepth?: number;
        defaultModelExpandDepth?: number;
        deepLinking?: boolean;
    }) => object;
    createOpenApiInfo: (title: string, version: string, description: string, metadata?: {
        contact?: {
            name?: string;
            email?: string;
            url?: string;
        };
        license?: {
            name: string;
            url?: string;
        };
        termsOfService?: string;
    }) => object;
    createServerConfigurations: (servers: ServerConfig[]) => object[];
    createApiTagGroups: (tags: SwaggerTagConfig[]) => object[];
    createNamedExamples: (examples: Record<string, ApiExampleObject>) => Record<string, any>;
    generateExampleFromSchema: (schema: SwaggerSchemaBuilder, overrides?: Record<string, any>) => any;
    createValidationDocumentation: (constraints: ValidationConstraints) => string;
    createApiVersionInfo: (config: ApiVersionConfig) => object;
    createEndpointDeprecation: (reason: string, alternativeEndpoint?: string, sunsetDate?: string) => object;
    createVersionedOperation: (version: string, summary: string, description?: string) => ApiOperationOptions;
    createWebhookDocumentation: (eventName: string, payloadType: Type<any>, description: string) => object;
    createCallbackDocumentation: (callbacks: CallbackConfig[]) => object;
    createHATEOASLinks: (links: LinkConfig[]) => object;
    createEventStreamResponse: (eventType: Type<any>, description: string) => ApiResponseOptions;
    createBatchOperationResponse: (itemType: Type<any>, includeErrors?: boolean) => ApiResponseOptions;
    createConditionalSchema: (baseSchema: SwaggerSchemaBuilder, conditions: Record<string, any>) => Record<string, any>;
    createCustomFormatSchema: (format: string, pattern: string, description: string, example: string) => Record<string, any>;
    createAccessModifierSchema: (properties: Record<string, SwaggerSchemaBuilder>, readOnlyFields?: string[], writeOnlyFields?: string[]) => Record<string, any>;
    createHealthCheckSchema: (dependencies: string[]) => Record<string, any>;
    createMetricsSchema: (metricNames: string[]) => Record<string, any>;
    createRateLimitHeaders: (limit: number, window: string) => Record<string, any>;
    createQuotaUsageSchema: (quotaTypes: string[]) => Record<string, any>;
    createApiCostSchema: (currency?: string) => Record<string, any>;
};
export default _default;
//# sourceMappingURL=swagger-openapi-kit.d.ts.map