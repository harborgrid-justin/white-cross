/**
 * LOC: SOAPID1234567
 * File: /reuse/swagger-openapi-documentation-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS controllers and modules
 *   - OpenAPI spec generation
 *   - Swagger UI configuration
 *   - API documentation tooling
 */
/**
 * File: /reuse/swagger-openapi-documentation-kit.ts
 * Locator: WC-UTL-SOAPID-001
 * Purpose: Advanced Swagger/OpenAPI Documentation Utilities - Spec generation, schema composition, validation, customization
 *
 * Upstream: Independent utility module for advanced OpenAPI/Swagger documentation patterns
 * Downstream: ../backend/*, NestJS modules, API documentation, Swagger UI, OpenAPI validators
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/swagger 7.x, @nestjs/common 10.x, Sequelize 6.x
 * Exports: 45 utility functions for OpenAPI spec generation, schema builders, validation, customization, discriminators
 *
 * LLM Context: Advanced OpenAPI documentation toolkit for White Cross healthcare system.
 * Provides OpenAPI 3.0 spec generators, advanced schema composition (allOf/oneOf/anyOf), discriminator handling,
 * webhook documentation, callback definitions, link objects, server configurations, validation utilities,
 * Swagger UI customization, Sequelize model schema converters, and comprehensive API metadata builders.
 * Essential for maintaining production-grade, standards-compliant API documentation.
 */
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject } from '@nestjs/swagger';
import { ModelStatic } from 'sequelize';
interface InfoObject {
    title: string;
    description?: string;
    version: string;
    termsOfService?: string;
    contact?: ContactObject;
    license?: LicenseObject;
}
interface ContactObject {
    name?: string;
    url?: string;
    email?: string;
}
interface LicenseObject {
    name: string;
    url?: string;
    identifier?: string;
}
interface ServerObject {
    url: string;
    description?: string;
    variables?: Record<string, ServerVariableObject>;
}
interface ServerVariableObject {
    enum?: string[];
    default: string;
    description?: string;
}
interface SchemaObject {
    type?: string;
    format?: string;
    title?: string;
    description?: string;
    default?: any;
    multipleOf?: number;
    maximum?: number;
    exclusiveMaximum?: boolean;
    minimum?: number;
    exclusiveMinimum?: boolean;
    maxLength?: number;
    minLength?: number;
    pattern?: string;
    maxItems?: number;
    minItems?: number;
    uniqueItems?: boolean;
    maxProperties?: number;
    minProperties?: number;
    required?: string[];
    enum?: any[];
    properties?: Record<string, SchemaObject>;
    items?: SchemaObject;
    allOf?: SchemaObject[];
    oneOf?: SchemaObject[];
    anyOf?: SchemaObject[];
    not?: SchemaObject;
    discriminator?: DiscriminatorObject;
    nullable?: boolean;
    readOnly?: boolean;
    writeOnly?: boolean;
    example?: any;
    examples?: any[];
    deprecated?: boolean;
    $ref?: string;
}
interface DiscriminatorObject {
    propertyName: string;
    mapping?: Record<string, string>;
}
interface ResponseObject {
    description: string;
    headers?: Record<string, HeaderObject>;
    content?: Record<string, MediaTypeObject>;
    links?: Record<string, LinkObject>;
}
interface MediaTypeObject {
    schema?: SchemaObject;
    example?: any;
    examples?: Record<string, ExampleObject>;
    encoding?: Record<string, EncodingObject>;
}
interface EncodingObject {
    contentType?: string;
    headers?: Record<string, HeaderObject>;
    style?: string;
    explode?: boolean;
    allowReserved?: boolean;
}
interface ParameterObject {
    name: string;
    in: 'query' | 'header' | 'path' | 'cookie';
    description?: string;
    required?: boolean;
    deprecated?: boolean;
    allowEmptyValue?: boolean;
    schema?: SchemaObject;
    example?: any;
    examples?: Record<string, ExampleObject>;
}
interface HeaderObject {
    description?: string;
    required?: boolean;
    deprecated?: boolean;
    schema?: SchemaObject;
    example?: any;
}
interface ExampleObject {
    summary?: string;
    description?: string;
    value?: any;
    externalValue?: string;
}
interface RequestBodyObject {
    description?: string;
    content: Record<string, MediaTypeObject>;
    required?: boolean;
}
interface SecuritySchemeObject {
    type: 'apiKey' | 'http' | 'oauth2' | 'openIdConnect';
    description?: string;
    name?: string;
    in?: 'query' | 'header' | 'cookie';
    scheme?: string;
    bearerFormat?: string;
    flows?: OAuthFlowsObject;
    openIdConnectUrl?: string;
}
interface OAuthFlowsObject {
    implicit?: OAuthFlowObject;
    password?: OAuthFlowObject;
    clientCredentials?: OAuthFlowObject;
    authorizationCode?: OAuthFlowObject;
}
interface OAuthFlowObject {
    authorizationUrl?: string;
    tokenUrl?: string;
    refreshUrl?: string;
    scopes: Record<string, string>;
}
interface LinkObject {
    operationRef?: string;
    operationId?: string;
    parameters?: Record<string, any>;
    requestBody?: any;
    description?: string;
    server?: ServerObject;
}
interface CallbackObject {
    [expression: string]: PathItemObject;
}
interface PathItemObject {
    summary?: string;
    description?: string;
    get?: OperationObject;
    put?: OperationObject;
    post?: OperationObject;
    delete?: OperationObject;
    options?: OperationObject;
    head?: OperationObject;
    patch?: OperationObject;
    trace?: OperationObject;
    servers?: ServerObject[];
    parameters?: ParameterObject[];
}
interface OperationObject {
    tags?: string[];
    summary?: string;
    description?: string;
    externalDocs?: ExternalDocumentationObject;
    operationId?: string;
    parameters?: ParameterObject[];
    requestBody?: RequestBodyObject;
    responses: Record<string, ResponseObject>;
    callbacks?: Record<string, CallbackObject>;
    deprecated?: boolean;
    security?: SecurityRequirementObject[];
    servers?: ServerObject[];
}
interface ExternalDocumentationObject {
    description?: string;
    url: string;
}
interface TagObject {
    name: string;
    description?: string;
    externalDocs?: ExternalDocumentationObject;
}
interface SecurityRequirementObject {
    [name: string]: string[];
}
interface SwaggerUIOptions {
    customCss?: string;
    customCssUrl?: string;
    customJs?: string;
    customfavIcon?: string;
    customSiteTitle?: string;
    swaggerOptions?: Record<string, any>;
}
/**
 * 1. Creates a complete OpenAPI document configuration.
 *
 * @param {string} title - API title
 * @param {string} version - API version
 * @param {string} description - API description
 * @param {string} [baseUrl] - Base server URL
 * @returns {DocumentBuilder} Configured document builder
 *
 * @example
 * ```typescript
 * const config = createOpenAPIDocument(
 *   'White Cross Healthcare API',
 *   '1.0.0',
 *   'Comprehensive healthcare management system',
 *   'https://api.whitecross.com'
 * );
 * ```
 */
export declare const createOpenAPIDocument: (title: string, version: string, description: string, baseUrl?: string) => DocumentBuilder;
/**
 * 2. Creates OpenAPI info object with contact and license details.
 *
 * @param {string} title - API title
 * @param {string} version - API version
 * @param {ContactObject} contact - Contact information
 * @param {LicenseObject} license - License information
 * @returns {InfoObject} OpenAPI info object
 *
 * @example
 * ```typescript
 * const info = createInfoObject(
 *   'Healthcare API',
 *   '1.0.0',
 *   { name: 'API Support', email: 'support@example.com' },
 *   { name: 'MIT', url: 'https://opensource.org/licenses/MIT' }
 * );
 * ```
 */
export declare const createInfoObject: (title: string, version: string, contact: ContactObject, license: LicenseObject) => InfoObject;
/**
 * 3. Creates server configuration with variables.
 *
 * @param {string} url - Server URL (can include variables like {environment})
 * @param {string} description - Server description
 * @param {Record<string, ServerVariableObject>} [variables] - URL variables
 * @returns {ServerObject} Server configuration
 *
 * @example
 * ```typescript
 * const server = createServerObject(
 *   'https://{environment}.api.whitecross.com',
 *   'Production API',
 *   {
 *     environment: {
 *       default: 'production',
 *       enum: ['production', 'staging', 'development']
 *     }
 *   }
 * );
 * ```
 */
export declare const createServerObject: (url: string, description: string, variables?: Record<string, ServerVariableObject>) => ServerObject;
/**
 * 4. Creates multiple server configurations for different environments.
 *
 * @param {string} baseUrl - Base URL pattern
 * @param {string[]} environments - Environment names
 * @returns {ServerObject[]} Array of server configurations
 *
 * @example
 * ```typescript
 * const servers = createMultiEnvironmentServers(
 *   'https://{env}.api.whitecross.com',
 *   ['production', 'staging', 'development']
 * );
 * ```
 */
export declare const createMultiEnvironmentServers: (baseUrl: string, environments: string[]) => ServerObject[];
/**
 * 5. Creates contact information object.
 *
 * @param {string} name - Contact name
 * @param {string} email - Contact email
 * @param {string} [url] - Contact URL
 * @returns {ContactObject} Contact object
 *
 * @example
 * ```typescript
 * const contact = createContactObject('API Support Team', 'api@whitecross.com', 'https://support.whitecross.com');
 * ```
 */
export declare const createContactObject: (name: string, email: string, url?: string) => ContactObject;
/**
 * 6. Creates license information object.
 *
 * @param {string} name - License name
 * @param {string} [url] - License URL
 * @param {string} [identifier] - SPDX license identifier
 * @returns {LicenseObject} License object
 *
 * @example
 * ```typescript
 * const license = createLicenseObject('Apache 2.0', 'https://www.apache.org/licenses/LICENSE-2.0.html');
 * ```
 */
export declare const createLicenseObject: (name: string, url?: string, identifier?: string) => LicenseObject;
/**
 * 7. Creates an allOf schema for inheritance and composition.
 *
 * @param {string[]} schemaRefs - Array of schema reference names
 * @param {SchemaObject} [additionalSchema] - Additional properties
 * @returns {SchemaObject} AllOf schema object
 *
 * @example
 * ```typescript
 * const patientSchema = createAllOfSchema(
 *   ['BasePerson', 'MedicalInfo'],
 *   { type: 'object', properties: { patientId: { type: 'string' } } }
 * );
 * ```
 */
export declare const createAllOfSchema: (schemaRefs: string[], additionalSchema?: SchemaObject) => SchemaObject;
/**
 * 8. Creates a oneOf schema for polymorphic types with discriminator.
 *
 * @param {string[]} schemaRefs - Array of schema reference names
 * @param {string} discriminatorProperty - Property name used for discrimination
 * @param {Record<string, string>} [mapping] - Discriminator value to schema mapping
 * @returns {SchemaObject} OneOf schema with discriminator
 *
 * @example
 * ```typescript
 * const paymentSchema = createOneOfSchema(
 *   ['CreditCardPayment', 'BankTransferPayment', 'InsurancePayment'],
 *   'paymentType',
 *   { credit: 'CreditCardPayment', bank: 'BankTransferPayment' }
 * );
 * ```
 */
export declare const createOneOfSchema: (schemaRefs: string[], discriminatorProperty: string, mapping?: Record<string, string>) => SchemaObject;
/**
 * 9. Creates an anyOf schema for flexible type matching.
 *
 * @param {string[]} schemaRefs - Array of schema reference names
 * @param {string} [description] - Schema description
 * @returns {SchemaObject} AnyOf schema object
 *
 * @example
 * ```typescript
 * const contactSchema = createAnyOfSchema(
 *   ['EmailContact', 'PhoneContact', 'AddressContact'],
 *   'Patient contact information - can be any combination'
 * );
 * ```
 */
export declare const createAnyOfSchema: (schemaRefs: string[], description?: string) => SchemaObject;
/**
 * 10. Creates a discriminator object for polymorphic schemas.
 *
 * @param {string} propertyName - Discriminator property name
 * @param {Record<string, string>} mapping - Value to schema mapping
 * @returns {DiscriminatorObject} Discriminator configuration
 *
 * @example
 * ```typescript
 * const discriminator = createDiscriminator('type', {
 *   patient: '#/components/schemas/Patient',
 *   doctor: '#/components/schemas/Doctor',
 *   admin: '#/components/schemas/Admin'
 * });
 * ```
 */
export declare const createDiscriminator: (propertyName: string, mapping: Record<string, string>) => DiscriminatorObject;
/**
 * 11. Creates a schema with conditional validation (if/then/else).
 *
 * @param {SchemaObject} ifSchema - Condition schema
 * @param {SchemaObject} thenSchema - Schema if condition is true
 * @param {SchemaObject} [elseSchema] - Schema if condition is false
 * @returns {SchemaObject} Conditional schema
 *
 * @example
 * ```typescript
 * const appointmentSchema = createConditionalSchema(
 *   { properties: { type: { const: 'emergency' } } },
 *   { required: ['priorityLevel', 'emergencyContact'] },
 *   { required: ['scheduledTime'] }
 * );
 * ```
 */
export declare const createConditionalSchema: (ifSchema: SchemaObject, thenSchema: SchemaObject, elseSchema?: SchemaObject) => SchemaObject;
/**
 * 12. Creates a readonly schema property.
 *
 * @param {SchemaObject} baseSchema - Base schema
 * @returns {SchemaObject} Schema with readOnly flag
 *
 * @example
 * ```typescript
 * const idSchema = createReadOnlySchema({ type: 'string', format: 'uuid' });
 * ```
 */
export declare const createReadOnlySchema: (baseSchema: SchemaObject) => SchemaObject;
/**
 * 13. Creates a writeonly schema property.
 *
 * @param {SchemaObject} baseSchema - Base schema
 * @returns {SchemaObject} Schema with writeOnly flag
 *
 * @example
 * ```typescript
 * const passwordSchema = createWriteOnlySchema({ type: 'string', minLength: 8 });
 * ```
 */
export declare const createWriteOnlySchema: (baseSchema: SchemaObject) => SchemaObject;
/**
 * 14. Creates a reusable response component.
 *
 * @param {string} description - Response description
 * @param {string} schemaRef - Schema reference name
 * @param {Record<string, HeaderObject>} [headers] - Response headers
 * @returns {ResponseObject} Response component
 *
 * @example
 * ```typescript
 * const patientResponse = createResponseComponent(
 *   'Successful patient retrieval',
 *   'Patient',
 *   { 'X-Request-ID': { schema: { type: 'string' } } }
 * );
 * ```
 */
export declare const createResponseComponent: (description: string, schemaRef: string, headers?: Record<string, HeaderObject>) => ResponseObject;
/**
 * 15. Creates a reusable parameter component.
 *
 * @param {string} name - Parameter name
 * @param {'query' | 'header' | 'path' | 'cookie'} location - Parameter location
 * @param {SchemaObject} schema - Parameter schema
 * @param {string} [description] - Parameter description
 * @param {boolean} [required] - Whether parameter is required
 * @returns {ParameterObject} Parameter component
 *
 * @example
 * ```typescript
 * const paginationParam = createParameterComponent(
 *   'page',
 *   'query',
 *   { type: 'integer', minimum: 1, default: 1 },
 *   'Page number for pagination',
 *   false
 * );
 * ```
 */
export declare const createParameterComponent: (name: string, location: "query" | "header" | "path" | "cookie", schema: SchemaObject, description?: string, required?: boolean) => ParameterObject;
/**
 * 16. Creates a reusable example component.
 *
 * @param {string} summary - Example summary
 * @param {any} value - Example value
 * @param {string} [description] - Example description
 * @returns {ExampleObject} Example component
 *
 * @example
 * ```typescript
 * const patientExample = createExampleComponent(
 *   'Active Patient',
 *   { id: 'uuid-123', name: 'John Doe', status: 'active' },
 *   'Example of an active patient record'
 * );
 * ```
 */
export declare const createExampleComponent: (summary: string, value: any, description?: string) => ExampleObject;
/**
 * 17. Creates a request body component with multiple content types.
 *
 * @param {string} description - Request body description
 * @param {Record<string, SchemaObject>} contentSchemas - Content type to schema mapping
 * @param {boolean} [required] - Whether request body is required
 * @returns {RequestBodyObject} Request body component
 *
 * @example
 * ```typescript
 * const uploadBody = createRequestBodyComponent(
 *   'Medical record upload',
 *   {
 *     'application/json': { $ref: '#/components/schemas/MedicalRecord' },
 *     'multipart/form-data': { type: 'object', properties: { file: { type: 'string', format: 'binary' } } }
 *   },
 *   true
 * );
 * ```
 */
export declare const createRequestBodyComponent: (description: string, contentSchemas: Record<string, SchemaObject>, required?: boolean) => RequestBodyObject;
/**
 * 18. Creates a header component.
 *
 * @param {string} description - Header description
 * @param {SchemaObject} schema - Header schema
 * @param {boolean} [required] - Whether header is required
 * @returns {HeaderObject} Header component
 *
 * @example
 * ```typescript
 * const authHeader = createHeaderComponent(
 *   'JWT authentication token',
 *   { type: 'string', pattern: '^Bearer .+$' },
 *   true
 * );
 * ```
 */
export declare const createHeaderComponent: (description: string, schema: SchemaObject, required?: boolean) => HeaderObject;
/**
 * 19. Creates OAuth2 authorization code flow security scheme.
 *
 * @param {string} authUrl - Authorization URL
 * @param {string} tokenUrl - Token URL
 * @param {Record<string, string>} scopes - Available scopes
 * @param {string} [refreshUrl] - Refresh token URL
 * @returns {SecuritySchemeObject} OAuth2 security scheme
 *
 * @example
 * ```typescript
 * const oauth2 = createOAuth2AuthorizationCodeScheme(
 *   'https://auth.whitecross.com/oauth/authorize',
 *   'https://auth.whitecross.com/oauth/token',
 *   { 'read:patients': 'Read patient data', 'write:patients': 'Modify patient data' },
 *   'https://auth.whitecross.com/oauth/refresh'
 * );
 * ```
 */
export declare const createOAuth2AuthorizationCodeScheme: (authUrl: string, tokenUrl: string, scopes: Record<string, string>, refreshUrl?: string) => SecuritySchemeObject;
/**
 * 20. Creates OAuth2 client credentials flow security scheme.
 *
 * @param {string} tokenUrl - Token URL
 * @param {Record<string, string>} scopes - Available scopes
 * @param {string} [refreshUrl] - Refresh token URL
 * @returns {SecuritySchemeObject} OAuth2 security scheme
 *
 * @example
 * ```typescript
 * const clientCreds = createOAuth2ClientCredentialsScheme(
 *   'https://auth.whitecross.com/oauth/token',
 *   { 'api:access': 'API access' }
 * );
 * ```
 */
export declare const createOAuth2ClientCredentialsScheme: (tokenUrl: string, scopes: Record<string, string>, refreshUrl?: string) => SecuritySchemeObject;
/**
 * 21. Creates OpenID Connect security scheme.
 *
 * @param {string} openIdConnectUrl - OpenID Connect discovery URL
 * @param {string} [description] - Security scheme description
 * @returns {SecuritySchemeObject} OpenID Connect security scheme
 *
 * @example
 * ```typescript
 * const oidc = createOpenIDConnectScheme(
 *   'https://auth.whitecross.com/.well-known/openid-configuration',
 *   'OpenID Connect authentication'
 * );
 * ```
 */
export declare const createOpenIDConnectScheme: (openIdConnectUrl: string, description?: string) => SecuritySchemeObject;
/**
 * 22. Creates HTTP Basic authentication security scheme.
 *
 * @param {string} [description] - Security scheme description
 * @returns {SecuritySchemeObject} HTTP Basic security scheme
 *
 * @example
 * ```typescript
 * const basicAuth = createBasicAuthScheme('HTTP Basic authentication for legacy endpoints');
 * ```
 */
export declare const createBasicAuthScheme: (description?: string) => SecuritySchemeObject;
/**
 * 23. Creates cookie-based API key security scheme.
 *
 * @param {string} cookieName - Cookie name
 * @param {string} [description] - Security scheme description
 * @returns {SecuritySchemeObject} Cookie API key security scheme
 *
 * @example
 * ```typescript
 * const cookieAuth = createCookieAuthScheme('session_token', 'Session cookie authentication');
 * ```
 */
export declare const createCookieAuthScheme: (cookieName: string, description?: string) => SecuritySchemeObject;
/**
 * 24. Creates a webhook definition for async notifications.
 *
 * @param {string} webhookName - Webhook identifier
 * @param {string} method - HTTP method for webhook
 * @param {string} description - Webhook description
 * @param {SchemaObject} requestBodySchema - Expected request body schema
 * @returns {Record<string, PathItemObject>} Webhook path item
 *
 * @example
 * ```typescript
 * const patientWebhook = createWebhook(
 *   'patientUpdated',
 *   'post',
 *   'Triggered when patient record is updated',
 *   { $ref: '#/components/schemas/PatientUpdatedEvent' }
 * );
 * ```
 */
export declare const createWebhook: (webhookName: string, method: string, description: string, requestBodySchema: SchemaObject) => Record<string, PathItemObject>;
/**
 * 25. Creates a callback definition for async operations.
 *
 * @param {string} callbackUrl - Callback URL expression
 * @param {string} method - HTTP method
 * @param {SchemaObject} requestSchema - Request schema
 * @param {SchemaObject} responseSchema - Response schema
 * @returns {CallbackObject} Callback definition
 *
 * @example
 * ```typescript
 * const jobCallback = createCallback(
 *   '{$request.body#/callbackUrl}',
 *   'post',
 *   { $ref: '#/components/schemas/JobStatus' },
 *   { type: 'object', properties: { acknowledged: { type: 'boolean' } } }
 * );
 * ```
 */
export declare const createCallback: (callbackUrl: string, method: string, requestSchema: SchemaObject, responseSchema: SchemaObject) => CallbackObject;
/**
 * 26. Creates a link object for hypermedia navigation.
 *
 * @param {string} operationId - Target operation ID
 * @param {Record<string, any>} parameters - Link parameters
 * @param {string} [description] - Link description
 * @returns {LinkObject} Link definition
 *
 * @example
 * ```typescript
 * const patientAppointmentsLink = createLink(
 *   'getPatientAppointments',
 *   { patientId: '$response.body#/id' },
 *   'Get appointments for this patient'
 * );
 * ```
 */
export declare const createLink: (operationId: string, parameters: Record<string, any>, description?: string) => LinkObject;
/**
 * 27. Creates Swagger UI custom CSS configuration.
 *
 * @param {string} primaryColor - Primary theme color
 * @param {string} [backgroundColor] - Background color
 * @param {string} [fontFamily] - Font family
 * @returns {string} Custom CSS string
 *
 * @example
 * ```typescript
 * const customCss = createSwaggerUICustomCSS('#2c3e50', '#ecf0f1', 'Inter, sans-serif');
 * ```
 */
export declare const createSwaggerUICustomCSS: (primaryColor: string, backgroundColor?: string, fontFamily?: string) => string;
/**
 * 28. Creates Swagger UI options configuration.
 *
 * @param {boolean} [persistAuthorization] - Persist auth across page refreshes
 * @param {boolean} [displayRequestDuration] - Show request duration
 * @param {string[]} [supportedSubmitMethods] - Allowed HTTP methods in Try-it-out
 * @param {boolean} [filter] - Enable operation filtering
 * @returns {Record<string, any>} Swagger UI options
 *
 * @example
 * ```typescript
 * const swaggerOptions = createSwaggerUIOptions(true, true, ['get', 'post'], true);
 * ```
 */
export declare const createSwaggerUIOptions: (persistAuthorization?: boolean, displayRequestDuration?: boolean, supportedSubmitMethods?: string[], filter?: boolean) => Record<string, any>;
/**
 * 29. Configures complete Swagger UI setup for NestJS application.
 *
 * @param {INestApplication} app - NestJS application instance
 * @param {string} path - Swagger UI path
 * @param {OpenAPIObject} document - OpenAPI document
 * @param {SwaggerUIOptions} [options] - UI customization options
 * @returns {void}
 *
 * @example
 * ```typescript
 * setupSwaggerUI(app, 'api/docs', document, {
 *   customCss: createSwaggerUICustomCSS('#2c3e50'),
 *   swaggerOptions: createSwaggerUIOptions(true, true)
 * });
 * ```
 */
export declare const setupSwaggerUI: (app: INestApplication, path: string, document: OpenAPIObject, options?: SwaggerUIOptions) => void;
/**
 * 30. Validates OpenAPI document structure.
 *
 * @param {OpenAPIObject} document - OpenAPI document
 * @returns {boolean} True if valid
 *
 * @example
 * ```typescript
 * const isValid = validateOpenAPIDocument(document);
 * if (!isValid) throw new Error('Invalid OpenAPI specification');
 * ```
 */
export declare const validateOpenAPIDocument: (document: OpenAPIObject) => boolean;
/**
 * 31. Extracts all operation IDs from OpenAPI document.
 *
 * @param {OpenAPIObject} document - OpenAPI document
 * @returns {string[]} Array of operation IDs
 *
 * @example
 * ```typescript
 * const operationIds = extractOperationIds(document);
 * // ['getPatient', 'createPatient', 'updatePatient', ...]
 * ```
 */
export declare const extractOperationIds: (document: OpenAPIObject) => string[];
/**
 * 32. Finds duplicate operation IDs in OpenAPI document.
 *
 * @param {OpenAPIObject} document - OpenAPI document
 * @returns {string[]} Array of duplicate operation IDs
 *
 * @example
 * ```typescript
 * const duplicates = findDuplicateOperationIds(document);
 * if (duplicates.length > 0) console.warn('Duplicate operation IDs:', duplicates);
 * ```
 */
export declare const findDuplicateOperationIds: (document: OpenAPIObject) => string[];
/**
 * 33. Extracts all schema references from OpenAPI document.
 *
 * @param {OpenAPIObject} document - OpenAPI document
 * @returns {string[]} Array of schema reference names
 *
 * @example
 * ```typescript
 * const schemas = extractSchemaReferences(document);
 * // ['Patient', 'Appointment', 'MedicalRecord', ...]
 * ```
 */
export declare const extractSchemaReferences: (document: OpenAPIObject) => string[];
/**
 * 34. Validates that all schema references exist in components.
 *
 * @param {OpenAPIObject} document - OpenAPI document
 * @returns {string[]} Array of missing schema references
 *
 * @example
 * ```typescript
 * const missing = findMissingSchemas(document);
 * if (missing.length > 0) throw new Error(`Missing schemas: ${missing.join(', ')}`);
 * ```
 */
export declare const findMissingSchemas: (document: OpenAPIObject) => string[];
/**
 * 35. Converts Sequelize DataType to OpenAPI schema type.
 *
 * @param {any} sequelizeType - Sequelize data type
 * @returns {SchemaObject} OpenAPI schema object
 *
 * @example
 * ```typescript
 * const schema = convertSequelizeTypeToSchema(DataTypes.STRING);
 * // { type: 'string' }
 * ```
 */
export declare const convertSequelizeTypeToSchema: (sequelizeType: any) => SchemaObject;
/**
 * 36. Generates OpenAPI schema from Sequelize model.
 *
 * @param {ModelStatic<any>} model - Sequelize model class
 * @param {string[]} [excludeFields] - Fields to exclude from schema
 * @returns {SchemaObject} OpenAPI schema object
 *
 * @example
 * ```typescript
 * const patientSchema = generateSchemaFromSequelizeModel(
 *   PatientModel,
 *   ['password', 'deletedAt']
 * );
 * ```
 */
export declare const generateSchemaFromSequelizeModel: (model: ModelStatic<any>, excludeFields?: string[]) => SchemaObject;
/**
 * 37. Generates OpenAPI schemas for all Sequelize models in an array.
 *
 * @param {ModelStatic<any>[]} models - Array of Sequelize models
 * @param {Record<string, string[]>} [excludeFieldsMap] - Map of model name to excluded fields
 * @returns {Record<string, SchemaObject>} Map of model name to schema
 *
 * @example
 * ```typescript
 * const schemas = generateSchemasFromModels(
 *   [PatientModel, AppointmentModel, DoctorModel],
 *   { Patient: ['password'], Doctor: ['salary'] }
 * );
 * ```
 */
export declare const generateSchemasFromModels: (models: ModelStatic<any>[], excludeFieldsMap?: Record<string, string[]>) => Record<string, SchemaObject>;
/**
 * 38. Creates a media type object with multiple examples.
 *
 * @param {SchemaObject} schema - Media type schema
 * @param {Record<string, ExampleObject>} examples - Named examples
 * @returns {MediaTypeObject} Media type object
 *
 * @example
 * ```typescript
 * const mediaType = createMediaTypeWithExamples(
 *   { $ref: '#/components/schemas/Patient' },
 *   {
 *     activePatient: { value: { status: 'active', name: 'John' } },
 *     inactivePatient: { value: { status: 'inactive', name: 'Jane' } }
 *   }
 * );
 * ```
 */
export declare const createMediaTypeWithExamples: (schema: SchemaObject, examples: Record<string, ExampleObject>) => MediaTypeObject;
/**
 * 39. Creates multipart form data encoding configuration.
 *
 * @param {Record<string, string>} fieldContentTypes - Field name to content type mapping
 * @param {Record<string, HeaderObject>} [fieldHeaders] - Additional headers per field
 * @returns {Record<string, EncodingObject>} Encoding configuration
 *
 * @example
 * ```typescript
 * const encoding = createMultipartEncoding(
 *   { file: 'application/pdf', metadata: 'application/json' },
 *   { file: { 'Content-Disposition': { schema: { type: 'string' } } } }
 * );
 * ```
 */
export declare const createMultipartEncoding: (fieldContentTypes: Record<string, string>, fieldHeaders?: Record<string, Record<string, HeaderObject>>) => Record<string, EncodingObject>;
/**
 * 40. Creates external documentation reference.
 *
 * @param {string} url - Documentation URL
 * @param {string} [description] - Documentation description
 * @returns {ExternalDocumentationObject} External docs object
 *
 * @example
 * ```typescript
 * const externalDocs = createExternalDocs(
 *   'https://docs.whitecross.com/api/patients',
 *   'Comprehensive patient API documentation'
 * );
 * ```
 */
export declare const createExternalDocs: (url: string, description?: string) => ExternalDocumentationObject;
/**
 * 41. Creates tag with external documentation.
 *
 * @param {string} name - Tag name
 * @param {string} description - Tag description
 * @param {string} externalDocsUrl - External documentation URL
 * @returns {TagObject} Tag with external docs
 *
 * @example
 * ```typescript
 * const tag = createTagWithExternalDocs(
 *   'Patients',
 *   'Patient management endpoints',
 *   'https://docs.whitecross.com/api/patients'
 * );
 * ```
 */
export declare const createTagWithExternalDocs: (name: string, description: string, externalDocsUrl: string) => TagObject;
/**
 * 42. Creates versioned API path prefix.
 *
 * @param {string} basePath - Base API path
 * @param {number} version - API version number
 * @returns {string} Versioned path
 *
 * @example
 * ```typescript
 * const path = createVersionedPath('/patients', 2);
 * // '/v2/patients'
 * ```
 */
export declare const createVersionedPath: (basePath: string, version: number) => string;
/**
 * 43. Creates version header parameter for API versioning.
 *
 * @param {number[]} supportedVersions - Array of supported version numbers
 * @param {number} defaultVersion - Default version
 * @returns {ParameterObject} Version header parameter
 *
 * @example
 * ```typescript
 * const versionParam = createVersionHeader([1, 2, 3], 3);
 * ```
 */
export declare const createVersionHeader: (supportedVersions: number[], defaultVersion: number) => ParameterObject;
/**
 * 44. Creates deprecation notice for API endpoints.
 *
 * @param {string} deprecationMessage - Deprecation message
 * @param {string} [sunsetDate] - Sunset date (ISO 8601)
 * @param {string} [alternativeEndpoint] - Alternative endpoint to use
 * @returns {object} Deprecation metadata
 *
 * @example
 * ```typescript
 * const deprecation = createDeprecationNotice(
 *   'This endpoint will be removed in v3',
 *   '2025-12-31',
 *   '/v3/patients'
 * );
 * ```
 */
export declare const createDeprecationNotice: (deprecationMessage: string, sunsetDate?: string, alternativeEndpoint?: string) => object;
/**
 * 45. Merges multiple OpenAPI documents for API versioning.
 *
 * @param {OpenAPIObject[]} documents - Array of OpenAPI documents
 * @param {string} title - Merged document title
 * @param {string} version - Merged document version
 * @returns {OpenAPIObject} Merged OpenAPI document
 *
 * @example
 * ```typescript
 * const merged = mergeOpenAPIDocuments([v1Doc, v2Doc, v3Doc], 'White Cross API', '3.0.0');
 * ```
 */
export declare const mergeOpenAPIDocuments: (documents: OpenAPIObject[], title: string, version: string) => OpenAPIObject;
declare const _default: {
    createOpenAPIDocument: (title: string, version: string, description: string, baseUrl?: string) => DocumentBuilder;
    createInfoObject: (title: string, version: string, contact: ContactObject, license: LicenseObject) => InfoObject;
    createServerObject: (url: string, description: string, variables?: Record<string, ServerVariableObject>) => ServerObject;
    createMultiEnvironmentServers: (baseUrl: string, environments: string[]) => ServerObject[];
    createContactObject: (name: string, email: string, url?: string) => ContactObject;
    createLicenseObject: (name: string, url?: string, identifier?: string) => LicenseObject;
    createAllOfSchema: (schemaRefs: string[], additionalSchema?: SchemaObject) => SchemaObject;
    createOneOfSchema: (schemaRefs: string[], discriminatorProperty: string, mapping?: Record<string, string>) => SchemaObject;
    createAnyOfSchema: (schemaRefs: string[], description?: string) => SchemaObject;
    createDiscriminator: (propertyName: string, mapping: Record<string, string>) => DiscriminatorObject;
    createConditionalSchema: (ifSchema: SchemaObject, thenSchema: SchemaObject, elseSchema?: SchemaObject) => SchemaObject;
    createReadOnlySchema: (baseSchema: SchemaObject) => SchemaObject;
    createWriteOnlySchema: (baseSchema: SchemaObject) => SchemaObject;
    createResponseComponent: (description: string, schemaRef: string, headers?: Record<string, HeaderObject>) => ResponseObject;
    createParameterComponent: (name: string, location: "query" | "header" | "path" | "cookie", schema: SchemaObject, description?: string, required?: boolean) => ParameterObject;
    createExampleComponent: (summary: string, value: any, description?: string) => ExampleObject;
    createRequestBodyComponent: (description: string, contentSchemas: Record<string, SchemaObject>, required?: boolean) => RequestBodyObject;
    createHeaderComponent: (description: string, schema: SchemaObject, required?: boolean) => HeaderObject;
    createOAuth2AuthorizationCodeScheme: (authUrl: string, tokenUrl: string, scopes: Record<string, string>, refreshUrl?: string) => SecuritySchemeObject;
    createOAuth2ClientCredentialsScheme: (tokenUrl: string, scopes: Record<string, string>, refreshUrl?: string) => SecuritySchemeObject;
    createOpenIDConnectScheme: (openIdConnectUrl: string, description?: string) => SecuritySchemeObject;
    createBasicAuthScheme: (description?: string) => SecuritySchemeObject;
    createCookieAuthScheme: (cookieName: string, description?: string) => SecuritySchemeObject;
    createWebhook: (webhookName: string, method: string, description: string, requestBodySchema: SchemaObject) => Record<string, PathItemObject>;
    createCallback: (callbackUrl: string, method: string, requestSchema: SchemaObject, responseSchema: SchemaObject) => CallbackObject;
    createLink: (operationId: string, parameters: Record<string, any>, description?: string) => LinkObject;
    createSwaggerUICustomCSS: (primaryColor: string, backgroundColor?: string, fontFamily?: string) => string;
    createSwaggerUIOptions: (persistAuthorization?: boolean, displayRequestDuration?: boolean, supportedSubmitMethods?: string[], filter?: boolean) => Record<string, any>;
    setupSwaggerUI: (app: INestApplication, path: string, document: OpenAPIObject, options?: SwaggerUIOptions) => void;
    validateOpenAPIDocument: (document: OpenAPIObject) => boolean;
    extractOperationIds: (document: OpenAPIObject) => string[];
    findDuplicateOperationIds: (document: OpenAPIObject) => string[];
    extractSchemaReferences: (document: OpenAPIObject) => string[];
    findMissingSchemas: (document: OpenAPIObject) => string[];
    convertSequelizeTypeToSchema: (sequelizeType: any) => SchemaObject;
    generateSchemaFromSequelizeModel: (model: ModelStatic<any>, excludeFields?: string[]) => SchemaObject;
    generateSchemasFromModels: (models: ModelStatic<any>[], excludeFieldsMap?: Record<string, string[]>) => Record<string, SchemaObject>;
    createMediaTypeWithExamples: (schema: SchemaObject, examples: Record<string, ExampleObject>) => MediaTypeObject;
    createMultipartEncoding: (fieldContentTypes: Record<string, string>, fieldHeaders?: Record<string, Record<string, HeaderObject>>) => Record<string, EncodingObject>;
    createExternalDocs: (url: string, description?: string) => ExternalDocumentationObject;
    createTagWithExternalDocs: (name: string, description: string, externalDocsUrl: string) => TagObject;
    createVersionedPath: (basePath: string, version: number) => string;
    createVersionHeader: (supportedVersions: number[], defaultVersion: number) => ParameterObject;
    createDeprecationNotice: (deprecationMessage: string, sunsetDate?: string, alternativeEndpoint?: string) => object;
    mergeOpenAPIDocuments: (documents: OpenAPIObject[], title: string, version: string) => OpenAPIObject;
};
export default _default;
//# sourceMappingURL=swagger-openapi-documentation-kit.d.ts.map