"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeOpenAPIDocuments = exports.createDeprecationNotice = exports.createVersionHeader = exports.createVersionedPath = exports.createTagWithExternalDocs = exports.createExternalDocs = exports.createMultipartEncoding = exports.createMediaTypeWithExamples = exports.generateSchemasFromModels = exports.generateSchemaFromSequelizeModel = exports.convertSequelizeTypeToSchema = exports.findMissingSchemas = exports.extractSchemaReferences = exports.findDuplicateOperationIds = exports.extractOperationIds = exports.validateOpenAPIDocument = exports.setupSwaggerUI = exports.createSwaggerUIOptions = exports.createSwaggerUICustomCSS = exports.createLink = exports.createCallback = exports.createWebhook = exports.createCookieAuthScheme = exports.createBasicAuthScheme = exports.createOpenIDConnectScheme = exports.createOAuth2ClientCredentialsScheme = exports.createOAuth2AuthorizationCodeScheme = exports.createHeaderComponent = exports.createRequestBodyComponent = exports.createExampleComponent = exports.createParameterComponent = exports.createResponseComponent = exports.createWriteOnlySchema = exports.createReadOnlySchema = exports.createConditionalSchema = exports.createDiscriminator = exports.createAnyOfSchema = exports.createOneOfSchema = exports.createAllOfSchema = exports.createLicenseObject = exports.createContactObject = exports.createMultiEnvironmentServers = exports.createServerObject = exports.createInfoObject = exports.createOpenAPIDocument = void 0;
const swagger_1 = require("@nestjs/swagger");
// ============================================================================
// OPENAPI DOCUMENT BUILDER UTILITIES
// ============================================================================
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
const createOpenAPIDocument = (title, version, description, baseUrl) => {
    const builder = new swagger_1.DocumentBuilder()
        .setTitle(title)
        .setVersion(version)
        .setDescription(description);
    if (baseUrl) {
        builder.addServer(baseUrl);
    }
    return builder;
};
exports.createOpenAPIDocument = createOpenAPIDocument;
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
const createInfoObject = (title, version, contact, license) => {
    return {
        title,
        version,
        contact,
        license,
    };
};
exports.createInfoObject = createInfoObject;
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
const createServerObject = (url, description, variables) => {
    return {
        url,
        description,
        variables,
    };
};
exports.createServerObject = createServerObject;
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
const createMultiEnvironmentServers = (baseUrl, environments) => {
    return environments.map((env) => ({
        url: baseUrl.replace('{env}', env),
        description: `${env.charAt(0).toUpperCase() + env.slice(1)} environment`,
    }));
};
exports.createMultiEnvironmentServers = createMultiEnvironmentServers;
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
const createContactObject = (name, email, url) => {
    return { name, email, url };
};
exports.createContactObject = createContactObject;
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
const createLicenseObject = (name, url, identifier) => {
    return { name, url, identifier };
};
exports.createLicenseObject = createLicenseObject;
// ============================================================================
// ADVANCED SCHEMA COMPOSITION UTILITIES
// ============================================================================
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
const createAllOfSchema = (schemaRefs, additionalSchema) => {
    const allOf = schemaRefs.map((ref) => ({
        $ref: `#/components/schemas/${ref}`,
    }));
    if (additionalSchema) {
        allOf.push(additionalSchema);
    }
    return { allOf };
};
exports.createAllOfSchema = createAllOfSchema;
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
const createOneOfSchema = (schemaRefs, discriminatorProperty, mapping) => {
    return {
        oneOf: schemaRefs.map((ref) => ({
            $ref: `#/components/schemas/${ref}`,
        })),
        discriminator: {
            propertyName: discriminatorProperty,
            mapping: mapping || schemaRefs.reduce((acc, ref) => ({
                ...acc,
                [ref.toLowerCase()]: `#/components/schemas/${ref}`,
            }), {}),
        },
    };
};
exports.createOneOfSchema = createOneOfSchema;
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
const createAnyOfSchema = (schemaRefs, description) => {
    return {
        anyOf: schemaRefs.map((ref) => ({
            $ref: `#/components/schemas/${ref}`,
        })),
        description,
    };
};
exports.createAnyOfSchema = createAnyOfSchema;
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
const createDiscriminator = (propertyName, mapping) => {
    return { propertyName, mapping };
};
exports.createDiscriminator = createDiscriminator;
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
const createConditionalSchema = (ifSchema, thenSchema, elseSchema) => {
    const schema = {
        if: ifSchema,
        then: thenSchema,
    };
    if (elseSchema) {
        schema.else = elseSchema;
    }
    return schema;
};
exports.createConditionalSchema = createConditionalSchema;
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
const createReadOnlySchema = (baseSchema) => {
    return { ...baseSchema, readOnly: true };
};
exports.createReadOnlySchema = createReadOnlySchema;
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
const createWriteOnlySchema = (baseSchema) => {
    return { ...baseSchema, writeOnly: true };
};
exports.createWriteOnlySchema = createWriteOnlySchema;
// ============================================================================
// COMPONENT UTILITIES
// ============================================================================
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
const createResponseComponent = (description, schemaRef, headers) => {
    return {
        description,
        content: {
            'application/json': {
                schema: { $ref: `#/components/schemas/${schemaRef}` },
            },
        },
        headers,
    };
};
exports.createResponseComponent = createResponseComponent;
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
const createParameterComponent = (name, location, schema, description, required) => {
    return {
        name,
        in: location,
        description,
        required: required ?? (location === 'path'),
        schema,
    };
};
exports.createParameterComponent = createParameterComponent;
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
const createExampleComponent = (summary, value, description) => {
    return { summary, value, description };
};
exports.createExampleComponent = createExampleComponent;
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
const createRequestBodyComponent = (description, contentSchemas, required) => {
    return {
        description,
        required: required ?? true,
        content: Object.entries(contentSchemas).reduce((acc, [contentType, schema]) => ({
            ...acc,
            [contentType]: { schema },
        }), {}),
    };
};
exports.createRequestBodyComponent = createRequestBodyComponent;
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
const createHeaderComponent = (description, schema, required) => {
    return { description, schema, required };
};
exports.createHeaderComponent = createHeaderComponent;
// ============================================================================
// SECURITY SCHEME UTILITIES
// ============================================================================
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
const createOAuth2AuthorizationCodeScheme = (authUrl, tokenUrl, scopes, refreshUrl) => {
    return {
        type: 'oauth2',
        flows: {
            authorizationCode: {
                authorizationUrl: authUrl,
                tokenUrl,
                refreshUrl,
                scopes,
            },
        },
    };
};
exports.createOAuth2AuthorizationCodeScheme = createOAuth2AuthorizationCodeScheme;
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
const createOAuth2ClientCredentialsScheme = (tokenUrl, scopes, refreshUrl) => {
    return {
        type: 'oauth2',
        flows: {
            clientCredentials: {
                tokenUrl,
                refreshUrl,
                scopes,
            },
        },
    };
};
exports.createOAuth2ClientCredentialsScheme = createOAuth2ClientCredentialsScheme;
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
const createOpenIDConnectScheme = (openIdConnectUrl, description) => {
    return {
        type: 'openIdConnect',
        openIdConnectUrl,
        description,
    };
};
exports.createOpenIDConnectScheme = createOpenIDConnectScheme;
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
const createBasicAuthScheme = (description) => {
    return {
        type: 'http',
        scheme: 'basic',
        description,
    };
};
exports.createBasicAuthScheme = createBasicAuthScheme;
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
const createCookieAuthScheme = (cookieName, description) => {
    return {
        type: 'apiKey',
        in: 'cookie',
        name: cookieName,
        description,
    };
};
exports.createCookieAuthScheme = createCookieAuthScheme;
// ============================================================================
// WEBHOOK AND CALLBACK UTILITIES
// ============================================================================
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
const createWebhook = (webhookName, method, description, requestBodySchema) => {
    return {
        [webhookName]: {
            [method]: {
                summary: webhookName,
                description,
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: requestBodySchema,
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Webhook received successfully',
                    },
                },
            },
        },
    };
};
exports.createWebhook = createWebhook;
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
const createCallback = (callbackUrl, method, requestSchema, responseSchema) => {
    return {
        [callbackUrl]: {
            [method]: {
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: requestSchema,
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Callback processed successfully',
                        content: {
                            'application/json': {
                                schema: responseSchema,
                            },
                        },
                    },
                },
            },
        },
    };
};
exports.createCallback = createCallback;
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
const createLink = (operationId, parameters, description) => {
    return {
        operationId,
        parameters,
        description,
    };
};
exports.createLink = createLink;
// ============================================================================
// SWAGGER UI CUSTOMIZATION UTILITIES
// ============================================================================
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
const createSwaggerUICustomCSS = (primaryColor, backgroundColor, fontFamily) => {
    return `
    .swagger-ui .topbar { background-color: ${primaryColor}; }
    .swagger-ui .info .title { color: ${primaryColor}; }
    ${backgroundColor ? `body { background-color: ${backgroundColor}; }` : ''}
    ${fontFamily ? `.swagger-ui { font-family: ${fontFamily}; }` : ''}
    .swagger-ui .opblock.opblock-post { border-color: ${primaryColor}; background: rgba(${hexToRgb(primaryColor)}, 0.1); }
    .swagger-ui .opblock.opblock-get { border-color: #61affe; }
    .swagger-ui .opblock.opblock-put { border-color: #fca130; }
    .swagger-ui .opblock.opblock-delete { border-color: #f93e3e; }
  `;
};
exports.createSwaggerUICustomCSS = createSwaggerUICustomCSS;
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
const createSwaggerUIOptions = (persistAuthorization, displayRequestDuration, supportedSubmitMethods, filter) => {
    return {
        persistAuthorization: persistAuthorization ?? true,
        displayRequestDuration: displayRequestDuration ?? true,
        supportedSubmitMethods: supportedSubmitMethods ?? ['get', 'post', 'put', 'patch', 'delete'],
        filter: filter ?? true,
        docExpansion: 'list',
        defaultModelsExpandDepth: 3,
        defaultModelExpandDepth: 3,
    };
};
exports.createSwaggerUIOptions = createSwaggerUIOptions;
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
const setupSwaggerUI = (app, path, document, options) => {
    swagger_1.SwaggerModule.setup(path, app, document, {
        customCss: options?.customCss,
        customCssUrl: options?.customCssUrl,
        customJs: options?.customJs,
        customfavIcon: options?.customfavIcon,
        customSiteTitle: options?.customSiteTitle || 'API Documentation',
        swaggerOptions: options?.swaggerOptions || (0, exports.createSwaggerUIOptions)(),
    });
};
exports.setupSwaggerUI = setupSwaggerUI;
// ============================================================================
// VALIDATION AND TESTING UTILITIES
// ============================================================================
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
const validateOpenAPIDocument = (document) => {
    if (!document.openapi || !document.info || !document.paths) {
        return false;
    }
    if (!document.info.title || !document.info.version) {
        return false;
    }
    return true;
};
exports.validateOpenAPIDocument = validateOpenAPIDocument;
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
const extractOperationIds = (document) => {
    const operationIds = [];
    Object.values(document.paths).forEach((pathItem) => {
        ['get', 'post', 'put', 'patch', 'delete', 'options', 'head'].forEach((method) => {
            const operation = pathItem[method];
            if (operation?.operationId) {
                operationIds.push(operation.operationId);
            }
        });
    });
    return operationIds;
};
exports.extractOperationIds = extractOperationIds;
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
const findDuplicateOperationIds = (document) => {
    const operationIds = (0, exports.extractOperationIds)(document);
    const counts = operationIds.reduce((acc, id) => {
        acc[id] = (acc[id] || 0) + 1;
        return acc;
    }, {});
    return Object.entries(counts)
        .filter(([_, count]) => count > 1)
        .map(([id]) => id);
};
exports.findDuplicateOperationIds = findDuplicateOperationIds;
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
const extractSchemaReferences = (document) => {
    const refs = new Set();
    const extractRefsFromObject = (obj) => {
        if (!obj || typeof obj !== 'object')
            return;
        if (obj.$ref && typeof obj.$ref === 'string') {
            const match = obj.$ref.match(/#\/components\/schemas\/(.+)/);
            if (match)
                refs.add(match[1]);
        }
        Object.values(obj).forEach(extractRefsFromObject);
    };
    extractRefsFromObject(document);
    return Array.from(refs);
};
exports.extractSchemaReferences = extractSchemaReferences;
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
const findMissingSchemas = (document) => {
    const referencedSchemas = (0, exports.extractSchemaReferences)(document);
    const definedSchemas = Object.keys(document.components?.schemas || {});
    return referencedSchemas.filter((ref) => !definedSchemas.includes(ref));
};
exports.findMissingSchemas = findMissingSchemas;
// ============================================================================
// SEQUELIZE MODEL TO OPENAPI SCHEMA UTILITIES
// ============================================================================
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
const convertSequelizeTypeToSchema = (sequelizeType) => {
    const typeString = sequelizeType.toString().toUpperCase();
    if (typeString.includes('VARCHAR') || typeString.includes('STRING') || typeString.includes('TEXT')) {
        return { type: 'string' };
    }
    if (typeString.includes('INTEGER') || typeString.includes('BIGINT')) {
        return { type: 'integer', format: 'int64' };
    }
    if (typeString.includes('DECIMAL') || typeString.includes('FLOAT') || typeString.includes('DOUBLE')) {
        return { type: 'number', format: 'double' };
    }
    if (typeString.includes('BOOLEAN')) {
        return { type: 'boolean' };
    }
    if (typeString.includes('DATE') || typeString.includes('TIMESTAMP')) {
        return { type: 'string', format: 'date-time' };
    }
    if (typeString.includes('UUID')) {
        return { type: 'string', format: 'uuid' };
    }
    if (typeString.includes('JSON') || typeString.includes('JSONB')) {
        return { type: 'object' };
    }
    if (typeString.includes('ARRAY')) {
        return { type: 'array', items: { type: 'string' } };
    }
    if (typeString.includes('ENUM')) {
        return { type: 'string' };
    }
    return { type: 'string' };
};
exports.convertSequelizeTypeToSchema = convertSequelizeTypeToSchema;
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
const generateSchemaFromSequelizeModel = (model, excludeFields) => {
    const attributes = model.rawAttributes;
    const properties = {};
    const required = [];
    Object.entries(attributes).forEach(([fieldName, attribute]) => {
        if (excludeFields?.includes(fieldName))
            return;
        properties[fieldName] = (0, exports.convertSequelizeTypeToSchema)(attribute.type);
        if (attribute.comment) {
            properties[fieldName].description = attribute.comment;
        }
        if (!attribute.allowNull && !attribute.defaultValue && !attribute.autoIncrement) {
            required.push(fieldName);
        }
        if (attribute.defaultValue !== undefined) {
            properties[fieldName].default = attribute.defaultValue;
        }
        if (attribute.primaryKey) {
            properties[fieldName].readOnly = true;
        }
    });
    return {
        type: 'object',
        properties,
        required: required.length > 0 ? required : undefined,
    };
};
exports.generateSchemaFromSequelizeModel = generateSchemaFromSequelizeModel;
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
const generateSchemasFromModels = (models, excludeFieldsMap) => {
    return models.reduce((acc, model) => {
        const modelName = model.name;
        const excludeFields = excludeFieldsMap?.[modelName];
        acc[modelName] = (0, exports.generateSchemaFromSequelizeModel)(model, excludeFields);
        return acc;
    }, {});
};
exports.generateSchemasFromModels = generateSchemasFromModels;
// ============================================================================
// MEDIA TYPE AND ENCODING UTILITIES
// ============================================================================
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
const createMediaTypeWithExamples = (schema, examples) => {
    return { schema, examples };
};
exports.createMediaTypeWithExamples = createMediaTypeWithExamples;
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
const createMultipartEncoding = (fieldContentTypes, fieldHeaders) => {
    return Object.entries(fieldContentTypes).reduce((acc, [field, contentType]) => {
        acc[field] = {
            contentType,
            headers: fieldHeaders?.[field],
        };
        return acc;
    }, {});
};
exports.createMultipartEncoding = createMultipartEncoding;
// ============================================================================
// EXTERNAL DOCUMENTATION UTILITIES
// ============================================================================
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
const createExternalDocs = (url, description) => {
    return { url, description };
};
exports.createExternalDocs = createExternalDocs;
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
const createTagWithExternalDocs = (name, description, externalDocsUrl) => {
    return {
        name,
        description,
        externalDocs: { url: externalDocsUrl },
    };
};
exports.createTagWithExternalDocs = createTagWithExternalDocs;
// ============================================================================
// API VERSIONING UTILITIES
// ============================================================================
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
const createVersionedPath = (basePath, version) => {
    return `/v${version}${basePath.startsWith('/') ? basePath : '/' + basePath}`;
};
exports.createVersionedPath = createVersionedPath;
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
const createVersionHeader = (supportedVersions, defaultVersion) => {
    return {
        name: 'X-API-Version',
        in: 'header',
        description: 'API version to use',
        required: false,
        schema: {
            type: 'string',
            enum: supportedVersions.map(String),
            default: String(defaultVersion),
        },
    };
};
exports.createVersionHeader = createVersionHeader;
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
const createDeprecationNotice = (deprecationMessage, sunsetDate, alternativeEndpoint) => {
    return {
        deprecated: true,
        description: `**DEPRECATED**: ${deprecationMessage}${sunsetDate ? `\n\n**Sunset Date**: ${sunsetDate}` : ''}${alternativeEndpoint ? `\n\n**Alternative**: Use \`${alternativeEndpoint}\` instead` : ''}`,
        'x-deprecation': {
            message: deprecationMessage,
            sunsetDate,
            alternative: alternativeEndpoint,
        },
    };
};
exports.createDeprecationNotice = createDeprecationNotice;
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
const mergeOpenAPIDocuments = (documents, title, version) => {
    const mergedPaths = {};
    const mergedSchemas = {};
    const mergedTags = [];
    documents.forEach((doc) => {
        Object.assign(mergedPaths, doc.paths);
        Object.assign(mergedSchemas, doc.components?.schemas || {});
        if (doc.tags)
            mergedTags.push(...doc.tags);
    });
    return {
        openapi: '3.0.0',
        info: { title, version },
        paths: mergedPaths,
        components: { schemas: mergedSchemas },
        tags: mergedTags,
    };
};
exports.mergeOpenAPIDocuments = mergeOpenAPIDocuments;
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Helper function to convert hex color to RGB.
 *
 * @param {string} hex - Hex color code
 * @returns {string} RGB color string
 */
const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
        : '0, 0, 0';
};
// ============================================================================
// DEFAULT EXPORT
// ============================================================================
exports.default = {
    // OpenAPI document builders
    createOpenAPIDocument: exports.createOpenAPIDocument,
    createInfoObject: exports.createInfoObject,
    createServerObject: exports.createServerObject,
    createMultiEnvironmentServers: exports.createMultiEnvironmentServers,
    createContactObject: exports.createContactObject,
    createLicenseObject: exports.createLicenseObject,
    // Advanced schema composition
    createAllOfSchema: exports.createAllOfSchema,
    createOneOfSchema: exports.createOneOfSchema,
    createAnyOfSchema: exports.createAnyOfSchema,
    createDiscriminator: exports.createDiscriminator,
    createConditionalSchema: exports.createConditionalSchema,
    createReadOnlySchema: exports.createReadOnlySchema,
    createWriteOnlySchema: exports.createWriteOnlySchema,
    // Component utilities
    createResponseComponent: exports.createResponseComponent,
    createParameterComponent: exports.createParameterComponent,
    createExampleComponent: exports.createExampleComponent,
    createRequestBodyComponent: exports.createRequestBodyComponent,
    createHeaderComponent: exports.createHeaderComponent,
    // Security schemes
    createOAuth2AuthorizationCodeScheme: exports.createOAuth2AuthorizationCodeScheme,
    createOAuth2ClientCredentialsScheme: exports.createOAuth2ClientCredentialsScheme,
    createOpenIDConnectScheme: exports.createOpenIDConnectScheme,
    createBasicAuthScheme: exports.createBasicAuthScheme,
    createCookieAuthScheme: exports.createCookieAuthScheme,
    // Webhooks and callbacks
    createWebhook: exports.createWebhook,
    createCallback: exports.createCallback,
    createLink: exports.createLink,
    // Swagger UI customization
    createSwaggerUICustomCSS: exports.createSwaggerUICustomCSS,
    createSwaggerUIOptions: exports.createSwaggerUIOptions,
    setupSwaggerUI: exports.setupSwaggerUI,
    // Validation and testing
    validateOpenAPIDocument: exports.validateOpenAPIDocument,
    extractOperationIds: exports.extractOperationIds,
    findDuplicateOperationIds: exports.findDuplicateOperationIds,
    extractSchemaReferences: exports.extractSchemaReferences,
    findMissingSchemas: exports.findMissingSchemas,
    // Sequelize model conversion
    convertSequelizeTypeToSchema: exports.convertSequelizeTypeToSchema,
    generateSchemaFromSequelizeModel: exports.generateSchemaFromSequelizeModel,
    generateSchemasFromModels: exports.generateSchemasFromModels,
    // Media types and encoding
    createMediaTypeWithExamples: exports.createMediaTypeWithExamples,
    createMultipartEncoding: exports.createMultipartEncoding,
    // External documentation
    createExternalDocs: exports.createExternalDocs,
    createTagWithExternalDocs: exports.createTagWithExternalDocs,
    // API versioning
    createVersionedPath: exports.createVersionedPath,
    createVersionHeader: exports.createVersionHeader,
    createDeprecationNotice: exports.createDeprecationNotice,
    mergeOpenAPIDocuments: exports.mergeOpenAPIDocuments,
};
//# sourceMappingURL=swagger-openapi-documentation-kit.js.map