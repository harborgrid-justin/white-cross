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

import {
  INestApplication,
  Type,
  HttpStatus,
  applyDecorators,
} from '@nestjs/common';
import {
  SwaggerModule,
  DocumentBuilder,
  OpenAPIObject,
  SwaggerDocumentOptions,
} from '@nestjs/swagger';
import { Model, ModelStatic, DataType } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface OpenAPISpec {
  openapi: string;
  info: InfoObject;
  servers?: ServerObject[];
  paths: PathsObject;
  components?: ComponentsObject;
  security?: SecurityRequirementObject[];
  tags?: TagObject[];
  externalDocs?: ExternalDocumentationObject;
  webhooks?: Record<string, PathItemObject>;
}

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

interface ComponentsObject {
  schemas?: Record<string, SchemaObject>;
  responses?: Record<string, ResponseObject>;
  parameters?: Record<string, ParameterObject>;
  examples?: Record<string, ExampleObject>;
  requestBodies?: Record<string, RequestBodyObject>;
  headers?: Record<string, HeaderObject>;
  securitySchemes?: Record<string, SecuritySchemeObject>;
  links?: Record<string, LinkObject>;
  callbacks?: Record<string, CallbackObject>;
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

interface PathsObject {
  [path: string]: PathItemObject;
}

interface SwaggerUIOptions {
  customCss?: string;
  customCssUrl?: string;
  customJs?: string;
  customfavIcon?: string;
  customSiteTitle?: string;
  swaggerOptions?: Record<string, any>;
}

interface SequelizeModelSchema {
  modelName: string;
  tableName: string;
  attributes: Record<string, AttributeSchema>;
  associations?: AssociationSchema[];
}

interface AttributeSchema {
  type: string;
  allowNull: boolean;
  primaryKey?: boolean;
  autoIncrement?: boolean;
  defaultValue?: any;
  unique?: boolean;
  references?: {
    model: string;
    key: string;
  };
}

interface AssociationSchema {
  type: 'hasOne' | 'hasMany' | 'belongsTo' | 'belongsToMany';
  target: string;
  foreignKey?: string;
  through?: string;
}

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
export const createOpenAPIDocument = (
  title: string,
  version: string,
  description: string,
  baseUrl?: string,
): DocumentBuilder => {
  const builder = new DocumentBuilder()
    .setTitle(title)
    .setVersion(version)
    .setDescription(description);

  if (baseUrl) {
    builder.addServer(baseUrl);
  }

  return builder;
};

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
export const createInfoObject = (
  title: string,
  version: string,
  contact: ContactObject,
  license: LicenseObject,
): InfoObject => {
  return {
    title,
    version,
    contact,
    license,
  };
};

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
export const createServerObject = (
  url: string,
  description: string,
  variables?: Record<string, ServerVariableObject>,
): ServerObject => {
  return {
    url,
    description,
    variables,
  };
};

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
export const createMultiEnvironmentServers = (
  baseUrl: string,
  environments: string[],
): ServerObject[] => {
  return environments.map((env) => ({
    url: baseUrl.replace('{env}', env),
    description: `${env.charAt(0).toUpperCase() + env.slice(1)} environment`,
  }));
};

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
export const createContactObject = (
  name: string,
  email: string,
  url?: string,
): ContactObject => {
  return { name, email, url };
};

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
export const createLicenseObject = (
  name: string,
  url?: string,
  identifier?: string,
): LicenseObject => {
  return { name, url, identifier };
};

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
export const createAllOfSchema = (
  schemaRefs: string[],
  additionalSchema?: SchemaObject,
): SchemaObject => {
  const allOf: SchemaObject[] = schemaRefs.map((ref) => ({
    $ref: `#/components/schemas/${ref}`,
  }));

  if (additionalSchema) {
    allOf.push(additionalSchema);
  }

  return { allOf };
};

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
export const createOneOfSchema = (
  schemaRefs: string[],
  discriminatorProperty: string,
  mapping?: Record<string, string>,
): SchemaObject => {
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
export const createAnyOfSchema = (
  schemaRefs: string[],
  description?: string,
): SchemaObject => {
  return {
    anyOf: schemaRefs.map((ref) => ({
      $ref: `#/components/schemas/${ref}`,
    })),
    description,
  };
};

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
export const createDiscriminator = (
  propertyName: string,
  mapping: Record<string, string>,
): DiscriminatorObject => {
  return { propertyName, mapping };
};

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
export const createConditionalSchema = (
  ifSchema: SchemaObject,
  thenSchema: SchemaObject,
  elseSchema?: SchemaObject,
): SchemaObject => {
  const schema: any = {
    if: ifSchema,
    then: thenSchema,
  };

  if (elseSchema) {
    schema.else = elseSchema;
  }

  return schema;
};

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
export const createReadOnlySchema = (baseSchema: SchemaObject): SchemaObject => {
  return { ...baseSchema, readOnly: true };
};

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
export const createWriteOnlySchema = (baseSchema: SchemaObject): SchemaObject => {
  return { ...baseSchema, writeOnly: true };
};

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
export const createResponseComponent = (
  description: string,
  schemaRef: string,
  headers?: Record<string, HeaderObject>,
): ResponseObject => {
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
export const createParameterComponent = (
  name: string,
  location: 'query' | 'header' | 'path' | 'cookie',
  schema: SchemaObject,
  description?: string,
  required?: boolean,
): ParameterObject => {
  return {
    name,
    in: location,
    description,
    required: required ?? (location === 'path'),
    schema,
  };
};

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
export const createExampleComponent = (
  summary: string,
  value: any,
  description?: string,
): ExampleObject => {
  return { summary, value, description };
};

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
export const createRequestBodyComponent = (
  description: string,
  contentSchemas: Record<string, SchemaObject>,
  required?: boolean,
): RequestBodyObject => {
  return {
    description,
    required: required ?? true,
    content: Object.entries(contentSchemas).reduce((acc, [contentType, schema]) => ({
      ...acc,
      [contentType]: { schema },
    }), {}),
  };
};

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
export const createHeaderComponent = (
  description: string,
  schema: SchemaObject,
  required?: boolean,
): HeaderObject => {
  return { description, schema, required };
};

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
export const createOAuth2AuthorizationCodeScheme = (
  authUrl: string,
  tokenUrl: string,
  scopes: Record<string, string>,
  refreshUrl?: string,
): SecuritySchemeObject => {
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
export const createOAuth2ClientCredentialsScheme = (
  tokenUrl: string,
  scopes: Record<string, string>,
  refreshUrl?: string,
): SecuritySchemeObject => {
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
export const createOpenIDConnectScheme = (
  openIdConnectUrl: string,
  description?: string,
): SecuritySchemeObject => {
  return {
    type: 'openIdConnect',
    openIdConnectUrl,
    description,
  };
};

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
export const createBasicAuthScheme = (description?: string): SecuritySchemeObject => {
  return {
    type: 'http',
    scheme: 'basic',
    description,
  };
};

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
export const createCookieAuthScheme = (
  cookieName: string,
  description?: string,
): SecuritySchemeObject => {
  return {
    type: 'apiKey',
    in: 'cookie',
    name: cookieName,
    description,
  };
};

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
export const createWebhook = (
  webhookName: string,
  method: string,
  description: string,
  requestBodySchema: SchemaObject,
): Record<string, PathItemObject> => {
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
    } as any,
  };
};

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
export const createCallback = (
  callbackUrl: string,
  method: string,
  requestSchema: SchemaObject,
  responseSchema: SchemaObject,
): CallbackObject => {
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
    } as any,
  };
};

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
export const createLink = (
  operationId: string,
  parameters: Record<string, any>,
  description?: string,
): LinkObject => {
  return {
    operationId,
    parameters,
    description,
  };
};

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
export const createSwaggerUICustomCSS = (
  primaryColor: string,
  backgroundColor?: string,
  fontFamily?: string,
): string => {
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
export const createSwaggerUIOptions = (
  persistAuthorization?: boolean,
  displayRequestDuration?: boolean,
  supportedSubmitMethods?: string[],
  filter?: boolean,
): Record<string, any> => {
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
export const setupSwaggerUI = (
  app: INestApplication,
  path: string,
  document: OpenAPIObject,
  options?: SwaggerUIOptions,
): void => {
  SwaggerModule.setup(path, app, document, {
    customCss: options?.customCss,
    customCssUrl: options?.customCssUrl,
    customJs: options?.customJs,
    customfavIcon: options?.customfavIcon,
    customSiteTitle: options?.customSiteTitle || 'API Documentation',
    swaggerOptions: options?.swaggerOptions || createSwaggerUIOptions(),
  });
};

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
export const validateOpenAPIDocument = (document: OpenAPIObject): boolean => {
  if (!document.openapi || !document.info || !document.paths) {
    return false;
  }

  if (!document.info.title || !document.info.version) {
    return false;
  }

  return true;
};

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
export const extractOperationIds = (document: OpenAPIObject): string[] => {
  const operationIds: string[] = [];

  Object.values(document.paths).forEach((pathItem) => {
    ['get', 'post', 'put', 'patch', 'delete', 'options', 'head'].forEach((method) => {
      const operation = (pathItem as any)[method];
      if (operation?.operationId) {
        operationIds.push(operation.operationId);
      }
    });
  });

  return operationIds;
};

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
export const findDuplicateOperationIds = (document: OpenAPIObject): string[] => {
  const operationIds = extractOperationIds(document);
  const counts = operationIds.reduce((acc, id) => {
    acc[id] = (acc[id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(counts)
    .filter(([_, count]) => count > 1)
    .map(([id]) => id);
};

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
export const extractSchemaReferences = (document: OpenAPIObject): string[] => {
  const refs = new Set<string>();

  const extractRefsFromObject = (obj: any): void => {
    if (!obj || typeof obj !== 'object') return;

    if (obj.$ref && typeof obj.$ref === 'string') {
      const match = obj.$ref.match(/#\/components\/schemas\/(.+)/);
      if (match) refs.add(match[1]);
    }

    Object.values(obj).forEach(extractRefsFromObject);
  };

  extractRefsFromObject(document);
  return Array.from(refs);
};

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
export const findMissingSchemas = (document: OpenAPIObject): string[] => {
  const referencedSchemas = extractSchemaReferences(document);
  const definedSchemas = Object.keys(document.components?.schemas || {});

  return referencedSchemas.filter((ref) => !definedSchemas.includes(ref));
};

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
export const convertSequelizeTypeToSchema = (sequelizeType: any): SchemaObject => {
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
export const generateSchemaFromSequelizeModel = (
  model: ModelStatic<any>,
  excludeFields?: string[],
): SchemaObject => {
  const attributes = model.rawAttributes;
  const properties: Record<string, SchemaObject> = {};
  const required: string[] = [];

  Object.entries(attributes).forEach(([fieldName, attribute]) => {
    if (excludeFields?.includes(fieldName)) return;

    properties[fieldName] = convertSequelizeTypeToSchema(attribute.type);

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
export const generateSchemasFromModels = (
  models: ModelStatic<any>[],
  excludeFieldsMap?: Record<string, string[]>,
): Record<string, SchemaObject> => {
  return models.reduce((acc, model) => {
    const modelName = model.name;
    const excludeFields = excludeFieldsMap?.[modelName];
    acc[modelName] = generateSchemaFromSequelizeModel(model, excludeFields);
    return acc;
  }, {} as Record<string, SchemaObject>);
};

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
export const createMediaTypeWithExamples = (
  schema: SchemaObject,
  examples: Record<string, ExampleObject>,
): MediaTypeObject => {
  return { schema, examples };
};

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
export const createMultipartEncoding = (
  fieldContentTypes: Record<string, string>,
  fieldHeaders?: Record<string, Record<string, HeaderObject>>,
): Record<string, EncodingObject> => {
  return Object.entries(fieldContentTypes).reduce((acc, [field, contentType]) => {
    acc[field] = {
      contentType,
      headers: fieldHeaders?.[field],
    };
    return acc;
  }, {} as Record<string, EncodingObject>);
};

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
export const createExternalDocs = (
  url: string,
  description?: string,
): ExternalDocumentationObject => {
  return { url, description };
};

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
export const createTagWithExternalDocs = (
  name: string,
  description: string,
  externalDocsUrl: string,
): TagObject => {
  return {
    name,
    description,
    externalDocs: { url: externalDocsUrl },
  };
};

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
export const createVersionedPath = (basePath: string, version: number): string => {
  return `/v${version}${basePath.startsWith('/') ? basePath : '/' + basePath}`;
};

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
export const createVersionHeader = (
  supportedVersions: number[],
  defaultVersion: number,
): ParameterObject => {
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
export const createDeprecationNotice = (
  deprecationMessage: string,
  sunsetDate?: string,
  alternativeEndpoint?: string,
): object => {
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
export const mergeOpenAPIDocuments = (
  documents: OpenAPIObject[],
  title: string,
  version: string,
): OpenAPIObject => {
  const mergedPaths: PathsObject = {};
  const mergedSchemas: Record<string, SchemaObject> = {};
  const mergedTags: TagObject[] = [];

  documents.forEach((doc) => {
    Object.assign(mergedPaths, doc.paths);
    Object.assign(mergedSchemas, doc.components?.schemas || {});
    if (doc.tags) mergedTags.push(...doc.tags);
  });

  return {
    openapi: '3.0.0',
    info: { title, version },
    paths: mergedPaths,
    components: { schemas: mergedSchemas },
    tags: mergedTags,
  };
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Helper function to convert hex color to RGB.
 *
 * @param {string} hex - Hex color code
 * @returns {string} RGB color string
 */
const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '0, 0, 0';
};

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
  // OpenAPI document builders
  createOpenAPIDocument,
  createInfoObject,
  createServerObject,
  createMultiEnvironmentServers,
  createContactObject,
  createLicenseObject,

  // Advanced schema composition
  createAllOfSchema,
  createOneOfSchema,
  createAnyOfSchema,
  createDiscriminator,
  createConditionalSchema,
  createReadOnlySchema,
  createWriteOnlySchema,

  // Component utilities
  createResponseComponent,
  createParameterComponent,
  createExampleComponent,
  createRequestBodyComponent,
  createHeaderComponent,

  // Security schemes
  createOAuth2AuthorizationCodeScheme,
  createOAuth2ClientCredentialsScheme,
  createOpenIDConnectScheme,
  createBasicAuthScheme,
  createCookieAuthScheme,

  // Webhooks and callbacks
  createWebhook,
  createCallback,
  createLink,

  // Swagger UI customization
  createSwaggerUICustomCSS,
  createSwaggerUIOptions,
  setupSwaggerUI,

  // Validation and testing
  validateOpenAPIDocument,
  extractOperationIds,
  findDuplicateOperationIds,
  extractSchemaReferences,
  findMissingSchemas,

  // Sequelize model conversion
  convertSequelizeTypeToSchema,
  generateSchemaFromSequelizeModel,
  generateSchemasFromModels,

  // Media types and encoding
  createMediaTypeWithExamples,
  createMultipartEncoding,

  // External documentation
  createExternalDocs,
  createTagWithExternalDocs,

  // API versioning
  createVersionedPath,
  createVersionHeader,
  createDeprecationNotice,
  mergeOpenAPIDocuments,
};
