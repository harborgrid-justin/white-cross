/**
 * Swagger/OpenAPI Configuration Utilities
 *
 * Enterprise-ready TypeScript utilities for OpenAPI document configuration,
 * security schemes, server setup, and documentation customization.
 *
 * @module swagger-config
 * @version 1.0.0
 */

import { INestApplication, Type } from '@nestjs/common';
import {
  SwaggerModule,
  DocumentBuilder,
  OpenAPIObject,
  SwaggerCustomOptions,
} from '@nestjs/swagger';

/**
 * OpenAPI specification version constants
 */
export const OPENAPI_VERSION_3_0 = '3.0.3';
export const OPENAPI_VERSION_3_1 = '3.1.0';

/**
 * Type definitions for OpenAPI configuration options
 * Fully compliant with OpenAPI 3.0 specification
 */

/**
 * OpenAPI Info Object
 * @see https://spec.openapis.org/oas/v3.0.3#info-object
 */
export interface OpenApiInfo {
  /** REQUIRED. The title of the API. */
  title: string;
  /** REQUIRED. A short description of the API. CommonMark syntax MAY be used. */
  description: string;
  /** REQUIRED. The version of the OpenAPI document. */
  version: string;
  /** A URL to the Terms of Service for the API. MUST be in the format of a URL. */
  termsOfService?: string;
  /** The contact information for the exposed API. */
  contact?: {
    /** The identifying name of the contact person/organization. */
    name?: string;
    /** The URL pointing to the contact information. MUST be in the format of a URL. */
    url?: string;
    /** The email address of the contact person/organization. MUST be in the format of an email address. */
    email?: string;
  };
  /** The license information for the exposed API. */
  license?: {
    /** REQUIRED. The license name used for the API. */
    name: string;
    /** A URL to the license used for the API. MUST be in the format of a URL. */
    url?: string;
  };
}

/**
 * OpenAPI Server Object
 * @see https://spec.openapis.org/oas/v3.0.3#server-object
 */
export interface OpenApiServer {
  /** REQUIRED. A URL to the target host. */
  url: string;
  /** An optional string describing the host designated by the URL. */
  description?: string;
  /** A map between a variable name and its value for server URL template substitution. */
  variables?: Record<string, ServerVariable>;
}

/**
 * OpenAPI Server Variable Object
 * @see https://spec.openapis.org/oas/v3.0.3#server-variable-object
 */
export interface ServerVariable {
  /** REQUIRED. The default value to use for substitution. */
  default: string;
  /** An optional description for the server variable. */
  description?: string;
  /** An enumeration of string values to be used if the substitution options are from a limited set. */
  enum?: string[];
}

/**
 * OpenAPI Tag Object
 * @see https://spec.openapis.org/oas/v3.0.3#tag-object
 */
export interface OpenApiTag {
  /** REQUIRED. The name of the tag. */
  name: string;
  /** A short description for the tag. CommonMark syntax MAY be used. */
  description?: string;
  /** Additional external documentation for this tag. */
  externalDocs?: ExternalDocumentation;
}

/**
 * OpenAPI External Documentation Object
 * @see https://spec.openapis.org/oas/v3.0.3#external-documentation-object
 */
export interface ExternalDocumentation {
  /** A short description of the target documentation. CommonMark syntax MAY be used. */
  description?: string;
  /** REQUIRED. The URL for the target documentation. Value MUST be in the format of a URL. */
  url: string;
}

/**
 * OpenAPI Security Scheme Object
 * @see https://spec.openapis.org/oas/v3.0.3#security-scheme-object
 */
export interface SecurityScheme {
  /** REQUIRED. The type of the security scheme. */
  type: 'apiKey' | 'http' | 'oauth2' | 'openIdConnect';
  /** A short description for security scheme. CommonMark syntax MAY be used. */
  description?: string;
  /** REQUIRED for apiKey. The name of the header, query or cookie parameter to be used. */
  name?: string;
  /** REQUIRED for apiKey. The location of the API key. */
  in?: 'query' | 'header' | 'cookie';
  /** REQUIRED for http. The name of the HTTP Authorization scheme (bearer, basic, etc.). */
  scheme?: string;
  /** A hint to the client to identify how the bearer token is formatted (JWT, etc.). */
  bearerFormat?: string;
  /** REQUIRED for oauth2. An object containing configuration information for the flow types supported. */
  flows?: OAuth2Flows;
  /** REQUIRED for openIdConnect. OpenId Connect URL to discover OAuth2 configuration values. */
  openIdConnectUrl?: string;
}

/**
 * OpenAPI OAuth2 Flows Object
 * @see https://spec.openapis.org/oas/v3.0.3#oauth-flows-object
 */
export interface OAuth2Flows {
  /** Configuration for the OAuth Implicit flow */
  implicit?: OAuth2Flow;
  /** Configuration for the OAuth Resource Owner Password flow */
  password?: OAuth2Flow;
  /** Configuration for the OAuth Client Credentials flow. Previously called application in OAuth2. */
  clientCredentials?: OAuth2Flow;
  /** Configuration for the OAuth Authorization Code flow. Previously called accessCode in OAuth2. */
  authorizationCode?: OAuth2Flow;
}

/**
 * OpenAPI OAuth2 Flow Object
 * @see https://spec.openapis.org/oas/v3.0.3#oauth-flow-object
 */
export interface OAuth2Flow {
  /** The authorization URL to be used for this flow. REQUIRED for implicit and authorizationCode. */
  authorizationUrl?: string;
  /** The token URL to be used for this flow. REQUIRED for password, clientCredentials and authorizationCode. */
  tokenUrl?: string;
  /** The URL to be used for obtaining refresh tokens. */
  refreshUrl?: string;
  /** REQUIRED. The available scopes for the OAuth2 security scheme. A map between scope name and a short description. */
  scopes: Record<string, string>;
}

export interface SwaggerUIOptions {
  customCss?: string;
  customSiteTitle?: string;
  customfavIcon?: string;
  customJs?: string;
  swaggerOptions?: {
    docExpansion?: 'list' | 'full' | 'none';
    filter?: boolean | string;
    showRequestDuration?: boolean;
    syntaxHighlight?: boolean | { theme: string };
    tryItOutEnabled?: boolean;
    persistAuthorization?: boolean;
    displayOperationId?: boolean;
    displayRequestDuration?: boolean;
  };
}

export interface ReDocOptions {
  title?: string;
  logo?: {
    url: string;
    backgroundColor?: string;
    altText?: string;
    href?: string;
  };
  theme?: {
    spacing?: {
      unit?: number;
      sectionHorizontal?: number;
      sectionVertical?: number;
    };
    colors?: {
      primary?: { main?: string };
      success?: { main?: string };
      warning?: { main?: string };
      error?: { main?: string };
    };
    typography?: {
      fontSize?: string;
      fontFamily?: string;
      headings?: { fontFamily?: string };
    };
  };
  hideDownloadButton?: boolean;
  disableSearch?: boolean;
  hideHostname?: boolean;
  expandResponses?: string;
  requiredPropsFirst?: boolean;
  sortPropsAlphabetically?: boolean;
  showExtensions?: boolean | string[];
  noAutoAuth?: boolean;
  pathInMiddlePanel?: boolean;
  hideLoading?: boolean;
  nativeScrollbars?: boolean;
  scrollYOffset?: number | string;
}

export interface ValidationResult {
  valid: boolean;
  errors: Array<{
    path: string;
    message: string;
    severity: 'error' | 'warning';
  }>;
  warnings: Array<{
    path: string;
    message: string;
  }>;
}

// ============================================================================
// OPENAPI DOCUMENT BUILDERS (6 functions)
// ============================================================================

/**
 * Creates a comprehensive OpenAPI document with all standard sections.
 *
 * @param app - NestJS application instance
 * @param info - API information object
 * @param servers - Array of server configurations
 * @param tags - Array of API tags
 * @returns Complete OpenAPI document
 *
 * @example
 * ```typescript
 * const document = createOpenApiDocument(app, {
 *   title: 'My API',
 *   description: 'API description',
 *   version: '1.0.0'
 * }, [{ url: 'https://api.example.com' }], [{ name: 'users' }]);
 * ```
 */
export function createOpenApiDocument(
  app: INestApplication,
  info: OpenApiInfo,
  servers: OpenApiServer[] = [],
  tags: OpenApiTag[] = []
): OpenAPIObject {
  let builder = new DocumentBuilder()
    .setTitle(info.title)
    .setDescription(info.description)
    .setVersion(info.version);

  // Add terms of service if provided
  if (info.termsOfService) {
    builder = builder.setTermsOfService(info.termsOfService);
  }

  // Add contact information
  if (info.contact) {
    builder = builder.setContact(
      info.contact.name || '',
      info.contact.url || '',
      info.contact.email || ''
    );
  }

  // Add license information
  if (info.license) {
    builder = builder.setLicense(info.license.name, info.license.url || '');
  }

  // Add servers
  servers.forEach(server => {
    builder = builder.addServer(server.url, server.description);
  });

  // Add tags
  tags.forEach(tag => {
    builder = builder.addTag(tag.name, tag.description, tag.externalDocs);
  });

  const config = builder.build();
  return SwaggerModule.createDocument(app, config);
}

/**
 * Builds the info section of an OpenAPI document.
 *
 * @param title - API title
 * @param description - API description
 * @param version - API version
 * @param additionalInfo - Additional info properties
 * @returns DocumentBuilder instance with info configured
 *
 * @example
 * ```typescript
 * const builder = buildOpenApiInfo('My API', 'API for...', '1.0.0', {
 *   contact: { name: 'Support', email: 'support@example.com' }
 * });
 * ```
 */
export function buildOpenApiInfo(
  title: string,
  description: string,
  version: string,
  additionalInfo?: {
    termsOfService?: string;
    contact?: { name?: string; url?: string; email?: string };
    license?: { name: string; url?: string };
  }
): DocumentBuilder {
  let builder = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .setVersion(version);

  if (additionalInfo?.termsOfService) {
    builder = builder.setTermsOfService(additionalInfo.termsOfService);
  }

  if (additionalInfo?.contact) {
    const { name = '', url = '', email = '' } = additionalInfo.contact;
    builder = builder.setContact(name, url, email);
  }

  if (additionalInfo?.license) {
    builder = builder.setLicense(
      additionalInfo.license.name,
      additionalInfo.license.url || ''
    );
  }

  return builder;
}

/**
 * Builds the servers section of an OpenAPI document.
 *
 * @param builder - DocumentBuilder instance
 * @param servers - Array of server configurations
 * @returns DocumentBuilder instance with servers configured
 *
 * @example
 * ```typescript
 * const builder = buildOpenApiServers(baseBuilder, [
 *   { url: 'https://api.example.com', description: 'Production' },
 *   { url: 'https://staging-api.example.com', description: 'Staging' }
 * ]);
 * ```
 */
export function buildOpenApiServers(
  builder: DocumentBuilder,
  servers: OpenApiServer[]
): DocumentBuilder {
  let updatedBuilder = builder;

  servers.forEach(server => {
    updatedBuilder = updatedBuilder.addServer(
      server.url,
      server.description || ''
    );
  });

  return updatedBuilder;
}

/**
 * Builds the tags section of an OpenAPI document.
 *
 * @param builder - DocumentBuilder instance
 * @param tags - Array of tag configurations
 * @returns DocumentBuilder instance with tags configured
 *
 * @example
 * ```typescript
 * const builder = buildOpenApiTags(baseBuilder, [
 *   { name: 'users', description: 'User management endpoints' },
 *   { name: 'orders', description: 'Order processing endpoints' }
 * ]);
 * ```
 */
export function buildOpenApiTags(
  builder: DocumentBuilder,
  tags: OpenApiTag[]
): DocumentBuilder {
  let updatedBuilder = builder;

  tags.forEach(tag => {
    updatedBuilder = updatedBuilder.addTag(
      tag.name,
      tag.description,
      tag.externalDocs
    );
  });

  return updatedBuilder;
}

/**
 * Builds external documentation section for OpenAPI document.
 *
 * @param builder - DocumentBuilder instance
 * @param description - Documentation description
 * @param url - Documentation URL
 * @returns DocumentBuilder instance with external docs configured
 *
 * @example
 * ```typescript
 * const builder = buildOpenApiExternalDocs(
 *   baseBuilder,
 *   'API Documentation',
 *   'https://docs.example.com'
 * );
 * ```
 */
export function buildOpenApiExternalDocs(
  builder: DocumentBuilder,
  description: string,
  url: string
): DocumentBuilder {
  return builder.setExternalDoc(description, url);
}

/**
 * OpenAPI Schema Object type (simplified for common use cases)
 */
export interface SchemaObject {
  type?: 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object' | 'null';
  format?: string;
  description?: string;
  properties?: Record<string, SchemaObject>;
  items?: SchemaObject;
  required?: string[];
  enum?: any[];
  example?: any;
  examples?: any[];
  default?: any;
  nullable?: boolean;
  readOnly?: boolean;
  writeOnly?: boolean;
  deprecated?: boolean;
  allOf?: SchemaObject[];
  oneOf?: SchemaObject[];
  anyOf?: SchemaObject[];
  not?: SchemaObject;
  discriminator?: { propertyName: string; mapping?: Record<string, string> };
  $ref?: string;
  [key: string]: any; // Allow vendor extensions and additional properties
}

/**
 * OpenAPI Response Object type
 */
export interface ResponseObject {
  description: string;
  content?: Record<string, { schema?: SchemaObject; example?: any; examples?: Record<string, any> }>;
  headers?: Record<string, any>;
  links?: Record<string, any>;
}

/**
 * OpenAPI Parameter Object type
 */
export interface ParameterObject {
  name: string;
  in: 'query' | 'header' | 'path' | 'cookie';
  description?: string;
  required?: boolean;
  deprecated?: boolean;
  schema?: SchemaObject;
  example?: any;
  examples?: Record<string, any>;
  style?: string;
  explode?: boolean;
}

/**
 * Builds the components section with reusable schemas, responses, and parameters.
 * Compliant with OpenAPI 3.0 Components Object specification.
 *
 * @param document - OpenAPI document object
 * @param schemas - Map of schema names to schema definitions
 * @param responses - Map of response names to response definitions
 * @param parameters - Map of parameter names to parameter definitions
 * @returns Updated OpenAPI document with components
 *
 * @example
 * ```typescript
 * const document = buildOpenApiComponents(baseDocument, {
 *   Error: {
 *     type: 'object',
 *     required: ['code', 'message'],
 *     properties: {
 *       code: { type: 'string', example: 'VALIDATION_ERROR' },
 *       message: { type: 'string', example: 'Invalid input provided' },
 *       details: { type: 'array', items: { type: 'object' } }
 *     }
 *   },
 *   User: {
 *     type: 'object',
 *     required: ['id', 'email'],
 *     properties: {
 *       id: { type: 'string', format: 'uuid' },
 *       email: { type: 'string', format: 'email' },
 *       name: { type: 'string' }
 *     }
 *   }
 * }, {
 *   NotFound: {
 *     description: 'Resource not found',
 *     content: {
 *       'application/json': {
 *         schema: { $ref: '#/components/schemas/Error' }
 *       }
 *     }
 *   }
 * }, {
 *   PageParam: {
 *     name: 'page',
 *     in: 'query',
 *     description: 'Page number',
 *     schema: { type: 'integer', minimum: 1, default: 1 }
 *   }
 * });
 * ```
 */
export function buildOpenApiComponents(
  document: OpenAPIObject,
  schemas: Record<string, SchemaObject> = {},
  responses: Record<string, ResponseObject> = {},
  parameters: Record<string, ParameterObject> = {}
): OpenAPIObject {
  if (!document.components) {
    document.components = {};
  }

  // Merge schemas with validation
  if (Object.keys(schemas).length > 0) {
    document.components.schemas = {
      ...(document.components.schemas || {}),
      ...schemas,
    };
  }

  // Merge responses with validation
  if (Object.keys(responses).length > 0) {
    Object.entries(responses).forEach(([name, response]) => {
      if (!response.description) {
        throw new Error(`Response component '${name}' must have a description`);
      }
    });
    document.components.responses = {
      ...(document.components.responses || {}),
      ...responses,
    };
  }

  // Merge parameters with validation
  if (Object.keys(parameters).length > 0) {
    Object.entries(parameters).forEach(([name, param]) => {
      if (!param.name || !param.in) {
        throw new Error(`Parameter component '${name}' must have 'name' and 'in' properties`);
      }
    });
    document.components.parameters = {
      ...(document.components.parameters || {}),
      ...parameters,
    };
  }

  return document;
}

// ============================================================================
// SECURITY SCHEME CONFIGURATORS (8 functions)
// ============================================================================

/**
 * Configures JWT Bearer token authentication scheme.
 *
 * @param builder - DocumentBuilder instance
 * @param name - Security scheme name
 * @param description - Scheme description
 * @param bearerFormat - Token format (e.g., 'JWT')
 * @returns DocumentBuilder instance with JWT security configured
 *
 * @example
 * ```typescript
 * const builder = configureJwtSecurity(
 *   baseBuilder,
 *   'bearer',
 *   'JWT authentication',
 *   'JWT'
 * );
 * ```
 */
export function configureJwtSecurity(
  builder: DocumentBuilder,
  name = 'bearer',
  description = 'JWT Bearer token authentication',
  bearerFormat = 'JWT'
): DocumentBuilder {
  return builder.addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat,
      description,
    },
    name
  );
}

/**
 * Configures OAuth2 authentication with multiple flows.
 * Compliant with OpenAPI 3.0 OAuth2 Security Scheme.
 *
 * @param builder - DocumentBuilder instance
 * @param name - Security scheme name
 * @param flows - OAuth2 flow configurations (OAuth2Flows object)
 * @param description - Scheme description
 * @returns DocumentBuilder instance with OAuth2 configured
 *
 * @example
 * ```typescript
 * // Authorization Code Flow (recommended for web apps)
 * const builder = configureOAuth2Security(baseBuilder, 'oauth2', {
 *   authorizationCode: {
 *     authorizationUrl: 'https://example.com/oauth/authorize',
 *     tokenUrl: 'https://example.com/oauth/token',
 *     refreshUrl: 'https://example.com/oauth/refresh',
 *     scopes: {
 *       'read:users': 'Read user data',
 *       'write:users': 'Modify user data',
 *       'admin': 'Admin access'
 *     }
 *   }
 * }, 'OAuth2 Authorization Code Flow');
 *
 * // Client Credentials Flow (for server-to-server)
 * const builder2 = configureOAuth2Security(baseBuilder, 'oauth2_client', {
 *   clientCredentials: {
 *     tokenUrl: 'https://example.com/oauth/token',
 *     scopes: {
 *       'api:access': 'API access',
 *       'data:read': 'Read data'
 *     }
 *   }
 * }, 'OAuth2 Client Credentials Flow');
 *
 * // Multiple flows
 * const builder3 = configureOAuth2Security(baseBuilder, 'oauth2_multi', {
 *   authorizationCode: {
 *     authorizationUrl: 'https://example.com/oauth/authorize',
 *     tokenUrl: 'https://example.com/oauth/token',
 *     scopes: { 'read': 'Read access', 'write': 'Write access' }
 *   },
 *   implicit: {
 *     authorizationUrl: 'https://example.com/oauth/authorize',
 *     scopes: { 'read': 'Read access' }
 *   }
 * });
 * ```
 */
export function configureOAuth2Security(
  builder: DocumentBuilder,
  name = 'oauth2',
  flows: OAuth2Flows,
  description = 'OAuth2 authentication'
): DocumentBuilder {
  // Validate flows according to OpenAPI 3.0 specification
  if (flows.authorizationCode) {
    if (!flows.authorizationCode.authorizationUrl || !flows.authorizationCode.tokenUrl) {
      throw new Error('Authorization Code flow requires both authorizationUrl and tokenUrl');
    }
  }
  if (flows.implicit && !flows.implicit.authorizationUrl) {
    throw new Error('Implicit flow requires authorizationUrl');
  }
  if (flows.password && !flows.password.tokenUrl) {
    throw new Error('Password flow requires tokenUrl');
  }
  if (flows.clientCredentials && !flows.clientCredentials.tokenUrl) {
    throw new Error('Client Credentials flow requires tokenUrl');
  }

  return builder.addOAuth2(flows, name);
}

/**
 * Configures API key authentication (header, query, or cookie).
 *
 * @param builder - DocumentBuilder instance
 * @param name - Security scheme name
 * @param location - Where API key is provided
 * @param keyName - Name of the API key parameter
 * @param description - Scheme description
 * @returns DocumentBuilder instance with API key security configured
 *
 * @example
 * ```typescript
 * const builder = configureApiKeySecurity(
 *   baseBuilder,
 *   'api_key',
 *   'header',
 *   'X-API-Key'
 * );
 * ```
 */
export function configureApiKeySecurity(
  builder: DocumentBuilder,
  name = 'api_key',
  location: 'header' | 'query' | 'cookie' = 'header',
  keyName = 'X-API-Key',
  description = 'API Key authentication'
): DocumentBuilder {
  return builder.addApiKey(
    {
      type: 'apiKey',
      name: keyName,
      in: location,
      description,
    },
    name
  );
}

/**
 * Configures HTTP Basic authentication scheme.
 *
 * @param builder - DocumentBuilder instance
 * @param name - Security scheme name
 * @param description - Scheme description
 * @returns DocumentBuilder instance with Basic auth configured
 *
 * @example
 * ```typescript
 * const builder = configureBasicAuthSecurity(
 *   baseBuilder,
 *   'basic',
 *   'HTTP Basic authentication'
 * );
 * ```
 */
export function configureBasicAuthSecurity(
  builder: DocumentBuilder,
  name = 'basic',
  description = 'HTTP Basic authentication'
): DocumentBuilder {
  return builder.addBasicAuth(
    {
      type: 'http',
      scheme: 'basic',
      description,
    },
    name
  );
}

/**
 * Configures Bearer token authentication (generic).
 *
 * @param builder - DocumentBuilder instance
 * @param name - Security scheme name
 * @param bearerFormat - Token format
 * @param description - Scheme description
 * @returns DocumentBuilder instance with Bearer auth configured
 *
 * @example
 * ```typescript
 * const builder = configureBearerSecurity(
 *   baseBuilder,
 *   'bearer',
 *   'token',
 *   'Bearer token authentication'
 * );
 * ```
 */
export function configureBearerSecurity(
  builder: DocumentBuilder,
  name = 'bearer',
  bearerFormat?: string,
  description = 'Bearer token authentication'
): DocumentBuilder {
  return builder.addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      ...(bearerFormat && { bearerFormat }),
      description,
    },
    name
  );
}

/**
 * Configures OpenID Connect authentication.
 *
 * @param builder - DocumentBuilder instance
 * @param name - Security scheme name
 * @param openIdConnectUrl - OpenID Connect discovery URL
 * @param description - Scheme description
 * @returns DocumentBuilder instance with OpenID Connect configured
 *
 * @example
 * ```typescript
 * const builder = configureOpenIdConnectSecurity(
 *   baseBuilder,
 *   'openid',
 *   'https://example.com/.well-known/openid-configuration'
 * );
 * ```
 */
export function configureOpenIdConnectSecurity(
  builder: DocumentBuilder,
  name = 'openid',
  openIdConnectUrl: string,
  description = 'OpenID Connect authentication'
): DocumentBuilder {
  return builder.addSecurity(name, {
    type: 'openIdConnect',
    openIdConnectUrl,
    description,
  });
}

/**
 * Configures cookie-based authentication.
 *
 * @param builder - DocumentBuilder instance
 * @param name - Security scheme name
 * @param cookieName - Name of the authentication cookie
 * @param description - Scheme description
 * @returns DocumentBuilder instance with cookie auth configured
 *
 * @example
 * ```typescript
 * const builder = configureCookieSecurity(
 *   baseBuilder,
 *   'session_cookie',
 *   'sessionId'
 * );
 * ```
 */
export function configureCookieSecurity(
  builder: DocumentBuilder,
  name = 'cookie_auth',
  cookieName = 'sessionId',
  description = 'Cookie-based authentication'
): DocumentBuilder {
  return builder.addCookieAuth(cookieName, name, description);
}

/**
 * Configures multiple security schemes simultaneously.
 *
 * @param builder - DocumentBuilder instance
 * @param schemes - Array of security scheme configurations
 * @returns DocumentBuilder instance with all security schemes configured
 *
 * @example
 * ```typescript
 * const builder = configureMultipleSecurity(baseBuilder, [
 *   { type: 'jwt', name: 'bearer' },
 *   { type: 'apiKey', name: 'api_key', location: 'header', keyName: 'X-API-Key' }
 * ]);
 * ```
 */
export function configureMultipleSecurity(
  builder: DocumentBuilder,
  schemes: Array<{
    type: 'jwt' | 'apiKey' | 'basic' | 'bearer' | 'oauth2' | 'cookie';
    name: string;
    location?: 'header' | 'query' | 'cookie';
    keyName?: string;
    bearerFormat?: string;
    flows?: any;
    cookieName?: string;
    description?: string;
  }>
): DocumentBuilder {
  let updatedBuilder = builder;

  schemes.forEach(scheme => {
    switch (scheme.type) {
      case 'jwt':
        updatedBuilder = configureJwtSecurity(
          updatedBuilder,
          scheme.name,
          scheme.description,
          scheme.bearerFormat || 'JWT'
        );
        break;
      case 'apiKey':
        updatedBuilder = configureApiKeySecurity(
          updatedBuilder,
          scheme.name,
          scheme.location || 'header',
          scheme.keyName || 'X-API-Key',
          scheme.description
        );
        break;
      case 'basic':
        updatedBuilder = configureBasicAuthSecurity(
          updatedBuilder,
          scheme.name,
          scheme.description
        );
        break;
      case 'bearer':
        updatedBuilder = configureBearerSecurity(
          updatedBuilder,
          scheme.name,
          scheme.bearerFormat,
          scheme.description
        );
        break;
      case 'oauth2':
        if (scheme.flows) {
          updatedBuilder = configureOAuth2Security(
            updatedBuilder,
            scheme.name,
            scheme.flows,
            scheme.description
          );
        }
        break;
      case 'cookie':
        updatedBuilder = configureCookieSecurity(
          updatedBuilder,
          scheme.name,
          scheme.cookieName || 'sessionId',
          scheme.description
        );
        break;
    }
  });

  return updatedBuilder;
}

// ============================================================================
// SERVER CONFIGURATION BUILDERS (4 functions)
// ============================================================================

/**
 * Builds server configuration with URL and description.
 * Compliant with OpenAPI 3.0 Server Object specification.
 *
 * @param url - Server URL (supports templating with variables)
 * @param description - Server description
 * @param variables - Server variables for URL template substitution
 * @returns Server configuration object
 *
 * @example
 * ```typescript
 * // Simple server without variables
 * const server1 = buildServerConfig('https://api.example.com', 'Production API');
 *
 * // Server with variable substitution
 * const server2 = buildServerConfig(
 *   'https://{environment}.example.com:{port}/v1',
 *   'Environment-based API Server',
 *   {
 *     environment: {
 *       default: 'api',
 *       enum: ['api', 'staging', 'dev'],
 *       description: 'Environment name'
 *     },
 *     port: {
 *       default: '443',
 *       enum: ['443', '8443'],
 *       description: 'HTTPS port'
 *     }
 *   }
 * );
 *
 * // Regional server
 * const server3 = buildServerConfig(
 *   'https://{region}.api.example.com',
 *   'Regional API Server',
 *   {
 *     region: {
 *       default: 'us-east',
 *       enum: ['us-east', 'us-west', 'eu-central', 'ap-south'],
 *       description: 'Geographic region'
 *     }
 *   }
 * );
 * ```
 */
export function buildServerConfig(
  url: string,
  description?: string,
  variables?: Record<string, ServerVariable>
): OpenApiServer {
  // Validate URL format
  if (!url || url.trim() === '') {
    throw new Error('Server URL is required');
  }

  // Validate that all variables referenced in URL are defined
  if (variables) {
    const urlVariables = url.match(/\{([^}]+)\}/g);
    if (urlVariables) {
      urlVariables.forEach(varRef => {
        const varName = varRef.slice(1, -1); // Remove { and }
        if (!variables[varName]) {
          throw new Error(`Variable '${varName}' used in URL but not defined in variables`);
        }
      });
    }
  }

  return {
    url,
    ...(description && { description }),
    ...(variables && { variables }),
  };
}

/**
 * Builds server variables for URL templating.
 *
 * @param variables - Map of variable names to configurations
 * @returns Server variables object compliant with OpenAPI 3.0 Server Variable Object
 *
 * @example
 * ```typescript
 * const variables = buildServerVariables({
 *   protocol: { default: 'https', enum: ['http', 'https'], description: 'Protocol' },
 *   port: { default: '443', description: 'Server port', enum: ['443', '8443'] },
 *   environment: { default: 'production', enum: ['production', 'staging', 'development'] }
 * });
 * ```
 */
export function buildServerVariables(
  variables: Record<string, ServerVariable>
): Record<string, ServerVariable> {
  // Validate that each variable has a default value (required by OpenAPI 3.0)
  Object.entries(variables).forEach(([name, variable]) => {
    if (!variable.default) {
      throw new Error(`Server variable '${name}' must have a default value`);
    }
  });
  return variables;
}

/**
 * Builds multiple server configurations for different environments.
 *
 * @param environments - Array of environment configurations
 * @returns Array of server configurations
 *
 * @example
 * ```typescript
 * const servers = buildMultipleServers([
 *   { name: 'production', url: 'https://api.example.com' },
 *   { name: 'staging', url: 'https://staging.example.com' },
 *   { name: 'development', url: 'http://localhost:3000' }
 * ]);
 * ```
 */
export function buildMultipleServers(
  environments: Array<{
    name: string;
    url: string;
    description?: string;
    variables?: Record<string, any>;
  }>
): OpenApiServer[] {
  return environments.map(env => ({
    url: env.url,
    description: env.description || `${env.name} environment`,
    ...(env.variables && { variables: env.variables }),
  }));
}

/**
 * Builds server configuration with authentication information.
 *
 * @param url - Server URL
 * @param description - Server description
 * @param authSchemes - Array of supported authentication schemes
 * @returns Server configuration object with auth metadata
 *
 * @example
 * ```typescript
 * const server = buildServerWithAuth(
 *   'https://api.example.com',
 *   'Production API',
 *   ['bearer', 'apiKey']
 * );
 * ```
 */
export function buildServerWithAuth(
  url: string,
  description: string,
  authSchemes: string[]
): OpenApiServer & { 'x-auth-schemes': string[] } {
  return {
    url,
    description: `${description} | Auth: ${authSchemes.join(', ')}`,
    'x-auth-schemes': authSchemes,
  };
}

// ============================================================================
// GLOBAL PARAMETER DEFINITIONS (3 functions)
// ============================================================================

/**
 * Defines global parameters that apply to all operations.
 *
 * @param parameters - Array of parameter definitions
 * @returns Map of parameter names to parameter objects
 *
 * @example
 * ```typescript
 * const globalParams = defineGlobalParameters([
 *   { name: 'X-Request-ID', in: 'header', required: false, schema: { type: 'string' } },
 *   { name: 'X-API-Version', in: 'header', required: true, schema: { type: 'string' } }
 * ]);
 * ```
 */
export function defineGlobalParameters(
  parameters: Array<{
    name: string;
    in: 'query' | 'header' | 'path' | 'cookie';
    description?: string;
    required?: boolean;
    schema?: any;
  }>
): Record<string, any> {
  const paramMap: Record<string, any> = {};

  parameters.forEach(param => {
    paramMap[param.name] = {
      name: param.name,
      in: param.in,
      description: param.description || '',
      required: param.required || false,
      schema: param.schema || { type: 'string' },
    };
  });

  return paramMap;
}

/**
 * Defines common query parameters (pagination, sorting, filtering).
 *
 * @param includePagination - Include pagination parameters
 * @param includeSorting - Include sorting parameters
 * @param includeFiltering - Include filtering parameters
 * @returns Map of common query parameter definitions
 *
 * @example
 * ```typescript
 * const queryParams = defineCommonQueryParams(true, true, false);
 * ```
 */
export function defineCommonQueryParams(
  includePagination = true,
  includeSorting = true,
  includeFiltering = false
): Record<string, any> {
  const params: Record<string, any> = {};

  if (includePagination) {
    params.page = {
      name: 'page',
      in: 'query',
      description: 'Page number',
      required: false,
      schema: { type: 'integer', minimum: 1, default: 1 },
    };
    params.limit = {
      name: 'limit',
      in: 'query',
      description: 'Items per page',
      required: false,
      schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
    };
  }

  if (includeSorting) {
    params.sortBy = {
      name: 'sortBy',
      in: 'query',
      description: 'Field to sort by',
      required: false,
      schema: { type: 'string' },
    };
    params.sortOrder = {
      name: 'sortOrder',
      in: 'query',
      description: 'Sort order',
      required: false,
      schema: { type: 'string', enum: ['asc', 'desc'], default: 'asc' },
    };
  }

  if (includeFiltering) {
    params.filter = {
      name: 'filter',
      in: 'query',
      description: 'Filter expression',
      required: false,
      schema: { type: 'string' },
    };
    params.fields = {
      name: 'fields',
      in: 'query',
      description: 'Fields to include (comma-separated)',
      required: false,
      schema: { type: 'string' },
    };
  }

  return params;
}

/**
 * Defines common header parameters.
 *
 * @param headers - Array of header names to include
 * @returns Map of common header parameter definitions
 *
 * @example
 * ```typescript
 * const headerParams = defineCommonHeaders([
 *   'X-Request-ID',
 *   'X-Correlation-ID',
 *   'X-API-Version'
 * ]);
 * ```
 */
export function defineCommonHeaders(
  headers: Array<'X-Request-ID' | 'X-Correlation-ID' | 'X-API-Version' | 'Accept-Language' | string>
): Record<string, any> {
  const headerMap: Record<string, any> = {};

  const headerDefinitions: Record<string, any> = {
    'X-Request-ID': {
      name: 'X-Request-ID',
      in: 'header',
      description: 'Unique request identifier for tracking',
      required: false,
      schema: { type: 'string', format: 'uuid' },
    },
    'X-Correlation-ID': {
      name: 'X-Correlation-ID',
      in: 'header',
      description: 'Correlation ID for distributed tracing',
      required: false,
      schema: { type: 'string', format: 'uuid' },
    },
    'X-API-Version': {
      name: 'X-API-Version',
      in: 'header',
      description: 'API version header',
      required: false,
      schema: { type: 'string', pattern: '^v\\d+$' },
    },
    'Accept-Language': {
      name: 'Accept-Language',
      in: 'header',
      description: 'Preferred language for response',
      required: false,
      schema: { type: 'string', example: 'en-US' },
    },
  };

  headers.forEach(header => {
    if (headerDefinitions[header]) {
      headerMap[header] = headerDefinitions[header];
    } else {
      // Custom header
      headerMap[header] = {
        name: header,
        in: 'header',
        description: `${header} header`,
        required: false,
        schema: { type: 'string' },
      };
    }
  });

  return headerMap;
}

// ============================================================================
// GLOBAL RESPONSE DEFINITIONS (3 functions)
// ============================================================================

/**
 * Defines global response schemas for common status codes.
 *
 * @param includeSuccess - Include success responses
 * @param includeErrors - Include error responses
 * @param includeRedirects - Include redirect responses
 * @returns Map of response status codes to response objects
 *
 * @example
 * ```typescript
 * const responses = defineGlobalResponses(true, true, false);
 * ```
 */
export function defineGlobalResponses(
  includeSuccess = true,
  includeErrors = true,
  includeRedirects = false
): Record<string, any> {
  const responses: Record<string, any> = {};

  if (includeSuccess) {
    responses['200'] = {
      description: 'Successful operation',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              success: { type: 'boolean', example: true },
              data: { type: 'object' },
            },
          },
        },
      },
    };
    responses['201'] = {
      description: 'Resource created successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              success: { type: 'boolean', example: true },
              data: { type: 'object' },
              id: { type: 'string' },
            },
          },
        },
      },
    };
    responses['204'] = {
      description: 'No content - operation successful',
    };
  }

  if (includeErrors) {
    responses['400'] = {
      description: 'Bad Request - Invalid input',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              statusCode: { type: 'number', example: 400 },
              message: { type: 'string', example: 'Invalid input' },
              error: { type: 'string', example: 'Bad Request' },
            },
          },
        },
      },
    };
    responses['401'] = {
      description: 'Unauthorized - Authentication required',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              statusCode: { type: 'number', example: 401 },
              message: { type: 'string', example: 'Unauthorized' },
            },
          },
        },
      },
    };
    responses['403'] = {
      description: 'Forbidden - Insufficient permissions',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              statusCode: { type: 'number', example: 403 },
              message: { type: 'string', example: 'Forbidden' },
            },
          },
        },
      },
    };
    responses['404'] = {
      description: 'Not Found - Resource does not exist',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              statusCode: { type: 'number', example: 404 },
              message: { type: 'string', example: 'Not Found' },
            },
          },
        },
      },
    };
    responses['500'] = {
      description: 'Internal Server Error',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              statusCode: { type: 'number', example: 500 },
              message: { type: 'string', example: 'Internal server error' },
            },
          },
        },
      },
    };
  }

  if (includeRedirects) {
    responses['301'] = {
      description: 'Moved Permanently',
      headers: {
        Location: {
          description: 'New location of the resource',
          schema: { type: 'string' },
        },
      },
    };
    responses['302'] = {
      description: 'Found - Temporary redirect',
      headers: {
        Location: {
          description: 'Temporary location of the resource',
          schema: { type: 'string' },
        },
      },
    };
  }

  return responses;
}

/**
 * Defines error response schemas for various error scenarios.
 *
 * @param includeValidation - Include validation error responses
 * @param includeAuth - Include authentication error responses
 * @param includeServer - Include server error responses
 * @returns Map of error response definitions
 *
 * @example
 * ```typescript
 * const errorResponses = defineErrorResponses(true, true, true);
 * ```
 */
export function defineErrorResponses(
  includeValidation = true,
  includeAuth = true,
  includeServer = true
): Record<string, any> {
  const responses: Record<string, any> = {};

  if (includeValidation) {
    responses['400'] = {
      description: 'Bad Request - Validation failed',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              statusCode: { type: 'number', example: 400 },
              message: {
                oneOf: [
                  { type: 'string' },
                  { type: 'array', items: { type: 'string' } },
                ],
              },
              error: { type: 'string', example: 'Bad Request' },
              validationErrors: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    field: { type: 'string' },
                    message: { type: 'string' },
                    constraint: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    };
    responses['422'] = {
      description: 'Unprocessable Entity - Semantic validation failed',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              statusCode: { type: 'number', example: 422 },
              message: { type: 'string' },
              errors: { type: 'array', items: { type: 'object' } },
            },
          },
        },
      },
    };
  }

  if (includeAuth) {
    responses['401'] = {
      description: 'Unauthorized - Invalid or missing authentication',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              statusCode: { type: 'number', example: 401 },
              message: { type: 'string', example: 'Unauthorized' },
              error: { type: 'string', example: 'Unauthorized' },
            },
          },
        },
      },
    };
    responses['403'] = {
      description: 'Forbidden - Insufficient permissions',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              statusCode: { type: 'number', example: 403 },
              message: { type: 'string', example: 'Forbidden resource' },
              error: { type: 'string', example: 'Forbidden' },
            },
          },
        },
      },
    };
  }

  if (includeServer) {
    responses['500'] = {
      description: 'Internal Server Error',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              statusCode: { type: 'number', example: 500 },
              message: { type: 'string', example: 'Internal server error' },
              error: { type: 'string', example: 'Internal Server Error' },
              timestamp: { type: 'string', format: 'date-time' },
              path: { type: 'string' },
            },
          },
        },
      },
    };
    responses['502'] = {
      description: 'Bad Gateway - Upstream service error',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              statusCode: { type: 'number', example: 502 },
              message: { type: 'string', example: 'Bad Gateway' },
            },
          },
        },
      },
    };
    responses['503'] = {
      description: 'Service Unavailable - Temporary unavailability',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              statusCode: { type: 'number', example: 503 },
              message: { type: 'string', example: 'Service Unavailable' },
              retryAfter: { type: 'number', description: 'Retry after seconds' },
            },
          },
        },
      },
    };
  }

  return responses;
}

/**
 * Defines success response schemas for various successful operations.
 *
 * @returns Map of success response definitions
 *
 * @example
 * ```typescript
 * const successResponses = defineSuccessResponses();
 * ```
 */
export function defineSuccessResponses(): Record<string, any> {
  return {
    '200': {
      description: 'OK - Request successful',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              success: { type: 'boolean', example: true },
              data: { type: 'object' },
              metadata: {
                type: 'object',
                properties: {
                  timestamp: { type: 'string', format: 'date-time' },
                  version: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    '201': {
      description: 'Created - Resource created successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              success: { type: 'boolean', example: true },
              data: { type: 'object' },
              id: { type: 'string', description: 'Created resource ID' },
              location: { type: 'string', description: 'Resource URI' },
            },
          },
        },
      },
      headers: {
        Location: {
          description: 'URI of the created resource',
          schema: { type: 'string' },
        },
      },
    },
    '202': {
      description: 'Accepted - Request accepted for processing',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              success: { type: 'boolean', example: true },
              message: { type: 'string', example: 'Request accepted' },
              jobId: { type: 'string', description: 'Background job ID' },
              statusUrl: { type: 'string', description: 'URL to check status' },
            },
          },
        },
      },
    },
    '204': {
      description: 'No Content - Successful operation with no response body',
    },
  };
}

// ============================================================================
// SCHEMA REGISTRY MANAGEMENT (4 functions)
// ============================================================================

/**
 * In-memory schema registry for managing reusable schemas.
 */
const schemaRegistry: Map<string, any> = new Map();

/**
 * Registers multiple schemas in the global registry.
 *
 * @param schemas - Map of schema names to schema definitions
 * @returns Number of schemas registered
 *
 * @example
 * ```typescript
 * registerSchemas({
 *   User: UserDto,
 *   Product: ProductDto,
 *   Order: OrderDto
 * });
 * ```
 */
export function registerSchemas(schemas: Record<string, Type<any>>): number {
  Object.entries(schemas).forEach(([name, schema]) => {
    schemaRegistry.set(name, schema);
  });
  return schemaRegistry.size;
}

/**
 * Retrieves a registered schema by name.
 *
 * @param name - Schema name
 * @returns Schema definition or undefined
 *
 * @example
 * ```typescript
 * const userSchema = getRegisteredSchema('User');
 * ```
 */
export function getRegisteredSchema(name: string): Type<any> | undefined {
  return schemaRegistry.get(name);
}

/**
 * Updates the schema registry with new or modified schemas.
 *
 * @param name - Schema name
 * @param schema - Schema definition
 * @returns True if schema was updated, false if new
 *
 * @example
 * ```typescript
 * updateSchemaRegistry('User', UpdatedUserDto);
 * ```
 */
export function updateSchemaRegistry(name: string, schema: Type<any>): boolean {
  const existed = schemaRegistry.has(name);
  schemaRegistry.set(name, schema);
  return existed;
}

/**
 * Clears all schemas from the registry.
 *
 * @returns Number of schemas cleared
 *
 * @example
 * ```typescript
 * const cleared = clearSchemaRegistry();
 * console.log(`Cleared ${cleared} schemas`);
 * ```
 */
export function clearSchemaRegistry(): number {
  const size = schemaRegistry.size;
  schemaRegistry.clear();
  return size;
}

// ============================================================================
// COMPONENT REGISTRATION UTILITIES (4 functions)
// ============================================================================

/**
 * Registers a reusable component in the OpenAPI document.
 *
 * @param document - OpenAPI document
 * @param componentType - Type of component (schema, response, parameter, example)
 * @param name - Component name
 * @param definition - Component definition
 * @returns Updated OpenAPI document
 *
 * @example
 * ```typescript
 * registerComponent(document, 'schema', 'Error', {
 *   type: 'object',
 *   properties: { message: { type: 'string' } }
 * });
 * ```
 */
export function registerComponent(
  document: OpenAPIObject,
  componentType: 'schemas' | 'responses' | 'parameters' | 'examples' | 'requestBodies' | 'headers',
  name: string,
  definition: any
): OpenAPIObject {
  if (!document.components) {
    document.components = {};
  }

  if (!document.components[componentType]) {
    document.components[componentType] = {};
  }

  document.components[componentType][name] = definition;

  return document;
}

/**
 * Registers a reusable response component.
 *
 * @param document - OpenAPI document
 * @param name - Response name
 * @param description - Response description
 * @param schema - Response schema
 * @param headers - Response headers
 * @returns Updated OpenAPI document
 *
 * @example
 * ```typescript
 * registerResponseComponent(document, 'NotFound', 'Resource not found', {
 *   type: 'object',
 *   properties: { message: { type: 'string' } }
 * });
 * ```
 */
export function registerResponseComponent(
  document: OpenAPIObject,
  name: string,
  description: string,
  schema?: any,
  headers?: Record<string, any>
): OpenAPIObject {
  const response: any = {
    description,
  };

  if (schema) {
    response.content = {
      'application/json': {
        schema,
      },
    };
  }

  if (headers) {
    response.headers = headers;
  }

  return registerComponent(document, 'responses', name, response);
}

/**
 * Registers a reusable parameter component.
 *
 * @param document - OpenAPI document
 * @param name - Parameter name
 * @param location - Parameter location
 * @param schema - Parameter schema
 * @param description - Parameter description
 * @param required - Whether parameter is required
 * @returns Updated OpenAPI document
 *
 * @example
 * ```typescript
 * registerParameterComponent(document, 'IdParam', 'path', {
 *   type: 'string',
 *   format: 'uuid'
 * }, 'Resource ID', true);
 * ```
 */
export function registerParameterComponent(
  document: OpenAPIObject,
  name: string,
  location: 'query' | 'header' | 'path' | 'cookie',
  schema: any,
  description = '',
  required = false
): OpenAPIObject {
  const parameter = {
    name,
    in: location,
    description,
    required,
    schema,
  };

  return registerComponent(document, 'parameters', name, parameter);
}

/**
 * Registers a reusable example component.
 *
 * @param document - OpenAPI document
 * @param name - Example name
 * @param value - Example value
 * @param summary - Example summary
 * @param description - Example description
 * @returns Updated OpenAPI document
 *
 * @example
 * ```typescript
 * registerExampleComponent(document, 'UserExample', {
 *   id: '123',
 *   name: 'John Doe',
 *   email: 'john@example.com'
 * }, 'Sample user');
 * ```
 */
export function registerExampleComponent(
  document: OpenAPIObject,
  name: string,
  value: any,
  summary?: string,
  description?: string
): OpenAPIObject {
  const example: any = { value };

  if (summary) {
    example.summary = summary;
  }

  if (description) {
    example.description = description;
  }

  return registerComponent(document, 'examples', name, example);
}

// ============================================================================
// AUTHENTICATION FLOW CONFIGURATORS (2 functions)
// ============================================================================

/**
 * Configures OAuth2 authorization code flow.
 *
 * @param authorizationUrl - Authorization endpoint URL
 * @param tokenUrl - Token endpoint URL
 * @param scopes - Available OAuth2 scopes
 * @param refreshUrl - Optional refresh token URL
 * @returns OAuth2 flow configuration
 *
 * @example
 * ```typescript
 * const flow = configureAuthorizationCodeFlow(
 *   'https://example.com/oauth/authorize',
 *   'https://example.com/oauth/token',
 *   { 'read:users': 'Read user data', 'write:users': 'Modify user data' }
 * );
 * ```
 */
export function configureAuthorizationCodeFlow(
  authorizationUrl: string,
  tokenUrl: string,
  scopes: Record<string, string>,
  refreshUrl?: string
): { authorizationCode: OAuth2Flow } {
  return {
    authorizationCode: {
      authorizationUrl,
      tokenUrl,
      scopes,
      ...(refreshUrl && { refreshUrl }),
    },
  };
}

/**
 * Configures OAuth2 client credentials flow.
 *
 * @param tokenUrl - Token endpoint URL
 * @param scopes - Available OAuth2 scopes
 * @param refreshUrl - Optional refresh token URL
 * @returns OAuth2 flow configuration
 *
 * @example
 * ```typescript
 * const flow = configureClientCredentialsFlow(
 *   'https://example.com/oauth/token',
 *   { 'api:access': 'API access' }
 * );
 * ```
 */
export function configureClientCredentialsFlow(
  tokenUrl: string,
  scopes: Record<string, string>,
  refreshUrl?: string
): { clientCredentials: OAuth2Flow } {
  return {
    clientCredentials: {
      tokenUrl,
      scopes,
      ...(refreshUrl && { refreshUrl }),
    },
  };
}

// ============================================================================
// API VERSIONING SETUP (2 functions)
// ============================================================================

/**
 * Sets up API versioning with multiple version paths.
 *
 * @param document - OpenAPI document
 * @param versions - Array of API versions
 * @param versioningStrategy - Versioning strategy (path, header, query)
 * @returns Updated OpenAPI document with versioning metadata
 *
 * @example
 * ```typescript
 * setupApiVersioning(document, ['v1', 'v2', 'v3'], 'path');
 * ```
 */
export function setupApiVersioning(
  document: OpenAPIObject,
  versions: string[],
  versioningStrategy: 'path' | 'header' | 'query' = 'path'
): OpenAPIObject {
  // Add versioning metadata
  if (!document.info) {
    document.info = { title: '', description: '', version: '' };
  }

  // Add vendor extension for versioning
  (document as any)['x-api-versions'] = {
    strategy: versioningStrategy,
    versions: versions.map(v => ({
      version: v,
      status: v === versions[versions.length - 1] ? 'current' : 'deprecated',
    })),
  };

  // Add version parameter if using header or query strategy
  if (versioningStrategy === 'header') {
    registerParameterComponent(
      document,
      'APIVersion',
      'header',
      { type: 'string', enum: versions },
      'API version',
      true
    );
  } else if (versioningStrategy === 'query') {
    registerParameterComponent(
      document,
      'APIVersion',
      'query',
      { type: 'string', enum: versions },
      'API version',
      true
    );
  }

  return document;
}

/**
 * Builds versioned path with version prefix.
 *
 * @param basePath - Base path without version
 * @param version - API version
 * @returns Versioned path
 *
 * @example
 * ```typescript
 * const path = buildVersionedPath('/users', 'v2'); // Returns '/v2/users'
 * ```
 */
export function buildVersionedPath(basePath: string, version: string): string {
  const cleanPath = basePath.startsWith('/') ? basePath : `/${basePath}`;
  const cleanVersion = version.startsWith('v') ? version : `v${version}`;
  return `/${cleanVersion}${cleanPath}`;
}

// ============================================================================
// VENDOR EXTENSION UTILITIES (2 functions)
// ============================================================================

/**
 * Adds a vendor extension to an OpenAPI object.
 *
 * @param target - Target object (document, operation, schema, etc.)
 * @param extensionName - Extension name (must start with 'x-')
 * @param extensionValue - Extension value
 * @returns Updated target object
 *
 * @example
 * ```typescript
 * addVendorExtension(document, 'x-api-id', 'my-api-123');
 * addVendorExtension(operation, 'x-rate-limit', { limit: 100, window: '1m' });
 * ```
 */
export function addVendorExtension(
  target: any,
  extensionName: string,
  extensionValue: any
): any {
  // Ensure extension name starts with 'x-'
  const name = extensionName.startsWith('x-') ? extensionName : `x-${extensionName}`;
  target[name] = extensionValue;
  return target;
}

/**
 * Retrieves all vendor extensions from an OpenAPI object.
 *
 * @param target - Target object to extract extensions from
 * @returns Object containing all vendor extensions
 *
 * @example
 * ```typescript
 * const extensions = getVendorExtensions(document);
 * console.log(extensions['x-api-id']);
 * ```
 */
export function getVendorExtensions(target: any): Record<string, any> {
  const extensions: Record<string, any> = {};

  Object.keys(target).forEach(key => {
    if (key.startsWith('x-')) {
      extensions[key] = target[key];
    }
  });

  return extensions;
}

// ============================================================================
// SWAGGER UI CUSTOMIZATION (2 functions)
// ============================================================================

/**
 * Customizes Swagger UI appearance and behavior.
 *
 * @param options - Swagger UI customization options
 * @returns Swagger custom options object
 *
 * @example
 * ```typescript
 * const uiOptions = customizeSwaggerUI({
 *   customSiteTitle: 'My API Documentation',
 *   swaggerOptions: {
 *     docExpansion: 'list',
 *     filter: true,
 *     persistAuthorization: true
 *   }
 * });
 * SwaggerModule.setup('api', app, document, uiOptions);
 * ```
 */
export function customizeSwaggerUI(options: SwaggerUIOptions): SwaggerCustomOptions {
  return {
    customCss: options.customCss,
    customSiteTitle: options.customSiteTitle,
    customfavIcon: options.customfavIcon,
    customJs: options.customJs,
    swaggerOptions: options.swaggerOptions || {},
  };
}

/**
 * Builds Swagger UI configuration with common defaults.
 *
 * @param title - Documentation title
 * @param theme - UI theme ('light' or 'dark')
 * @param expandOperations - Operation expansion level
 * @returns Swagger UI configuration object
 *
 * @example
 * ```typescript
 * const config = buildSwaggerUIConfig('My API', 'dark', 'list');
 * ```
 */
export function buildSwaggerUIConfig(
  title: string,
  theme: 'light' | 'dark' = 'light',
  expandOperations: 'list' | 'full' | 'none' = 'list'
): SwaggerCustomOptions {
  const darkThemeCSS = `
    .swagger-ui { background-color: #1e1e1e; }
    .swagger-ui .topbar { background-color: #2d2d2d; }
    .swagger-ui .info { color: #ffffff; }
  `;

  return {
    customSiteTitle: title,
    ...(theme === 'dark' && { customCss: darkThemeCSS }),
    swaggerOptions: {
      docExpansion: expandOperations,
      filter: true,
      showRequestDuration: true,
      syntaxHighlight: { theme: theme === 'dark' ? 'monokai' : 'agate' },
      tryItOutEnabled: true,
      persistAuthorization: true,
      displayOperationId: false,
      displayRequestDuration: true,
    },
  };
}

// ============================================================================
// REDOC CONFIGURATION (2 functions)
// ============================================================================

/**
 * Configures ReDoc documentation renderer.
 *
 * @param options - ReDoc customization options
 * @returns ReDoc configuration object
 *
 * @example
 * ```typescript
 * const redocConfig = configureReDoc({
 *   title: 'My API Documentation',
 *   hideDownloadButton: false,
 *   theme: {
 *     colors: { primary: { main: '#3f51b5' } }
 *   }
 * });
 * ```
 */
export function configureReDoc(options: ReDocOptions): any {
  return {
    title: options.title || 'API Documentation',
    logo: options.logo,
    theme: options.theme || {},
    hideDownloadButton: options.hideDownloadButton || false,
    disableSearch: options.disableSearch || false,
    hideHostname: options.hideHostname || false,
    expandResponses: options.expandResponses || '',
    requiredPropsFirst: options.requiredPropsFirst !== false,
    sortPropsAlphabetically: options.sortPropsAlphabetically || false,
    showExtensions: options.showExtensions || false,
    noAutoAuth: options.noAutoAuth || false,
    pathInMiddlePanel: options.pathInMiddlePanel || false,
    hideLoading: options.hideLoading || false,
    nativeScrollbars: options.nativeScrollbars || false,
    scrollYOffset: options.scrollYOffset || 0,
  };
}

/**
 * Builds ReDoc configuration with common defaults.
 *
 * @param title - Documentation title
 * @param logoUrl - Logo image URL
 * @param primaryColor - Primary theme color
 * @returns ReDoc configuration object
 *
 * @example
 * ```typescript
 * const config = buildReDocConfig('My API', 'https://example.com/logo.png', '#3f51b5');
 * ```
 */
export function buildReDocConfig(
  title: string,
  logoUrl?: string,
  primaryColor = '#3f51b5'
): any {
  const config: any = {
    title,
    hideDownloadButton: false,
    disableSearch: false,
    requiredPropsFirst: true,
    sortPropsAlphabetically: false,
    expandResponses: '200,201',
    showExtensions: true,
    pathInMiddlePanel: false,
    theme: {
      colors: {
        primary: { main: primaryColor },
      },
      typography: {
        fontSize: '14px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      },
    },
  };

  if (logoUrl) {
    config.logo = {
      url: logoUrl,
      backgroundColor: '#ffffff',
      altText: title,
    };
  }

  return config;
}

// ============================================================================
// CODE GENERATION SETUP UTILITIES (2 functions)
// ============================================================================

/**
 * Sets up code generation configuration for OpenAPI Generator.
 *
 * @param document - OpenAPI document
 * @param generatorType - Code generator type (client or server)
 * @param language - Target programming language
 * @param additionalProperties - Additional generator properties
 * @returns Document with code generation metadata
 *
 * @example
 * ```typescript
 * setupCodeGeneration(document, 'client', 'typescript', {
 *   npmName: 'my-api-client',
 *   npmVersion: '1.0.0'
 * });
 * ```
 */
export function setupCodeGeneration(
  document: OpenAPIObject,
  generatorType: 'client' | 'server',
  language: string,
  additionalProperties?: Record<string, any>
): OpenAPIObject {
  addVendorExtension(document, 'x-code-generation', {
    type: generatorType,
    language,
    generator: 'openapi-generator',
    additionalProperties: additionalProperties || {},
  });

  return document;
}

/**
 * Builds code generation configuration object.
 *
 * @param language - Target language
 * @param outputDir - Output directory for generated code
 * @param packageName - Package/module name
 * @param additionalConfig - Additional configuration options
 * @returns Code generation configuration
 *
 * @example
 * ```typescript
 * const config = buildCodeGenConfig('typescript-axios', './generated', 'my-api-client', {
 *   supportsES6: true,
 *   withInterfaces: true
 * });
 * ```
 */
export function buildCodeGenConfig(
  language: string,
  outputDir: string,
  packageName: string,
  additionalConfig?: Record<string, any>
): any {
  return {
    language,
    outputDir,
    packageName,
    generatorName: 'openapi-generator-cli',
    config: {
      packageName,
      projectName: packageName,
      ...(additionalConfig || {}),
    },
    options: {
      skipValidateSpec: false,
      logToStderr: true,
      enablePostProcessFile: true,
    },
  };
}

// ============================================================================
// API DOCUMENTATION VALIDATORS (2 functions)
// ============================================================================

/**
 * Validates OpenAPI document structure and completeness.
 *
 * @param document - OpenAPI document to validate
 * @returns Validation result with errors and warnings
 *
 * @example
 * ```typescript
 * const result = validateOpenApiDocument(document);
 * if (!result.valid) {
 *   console.error('Validation errors:', result.errors);
 * }
 * ```
 */
export function validateOpenApiDocument(document: OpenAPIObject): ValidationResult {
  const errors: Array<{ path: string; message: string; severity: 'error' | 'warning' }> = [];
  const warnings: Array<{ path: string; message: string }> = [];

  // Validate required fields
  if (!document.openapi) {
    errors.push({
      path: '/openapi',
      message: 'Missing required field: openapi version',
      severity: 'error',
    });
  }

  if (!document.info) {
    errors.push({
      path: '/info',
      message: 'Missing required field: info object',
      severity: 'error',
    });
  } else {
    if (!document.info.title) {
      errors.push({
        path: '/info/title',
        message: 'Missing required field: info.title',
        severity: 'error',
      });
    }
    if (!document.info.version) {
      errors.push({
        path: '/info/version',
        message: 'Missing required field: info.version',
        severity: 'error',
      });
    }
  }

  if (!document.paths || Object.keys(document.paths).length === 0) {
    warnings.push({
      path: '/paths',
      message: 'No paths defined in the document',
    });
  }

  // Validate paths
  if (document.paths) {
    Object.entries(document.paths).forEach(([path, pathItem]: [string, any]) => {
      if (!path.startsWith('/')) {
        errors.push({
          path: `/paths/${path}`,
          message: 'Path must start with /',
          severity: 'error',
        });
      }

      // Validate operations
      const methods = ['get', 'post', 'put', 'patch', 'delete', 'options', 'head'];
      methods.forEach(method => {
        if (pathItem[method]) {
          const operation = pathItem[method];

          if (!operation.responses) {
            errors.push({
              path: `/paths${path}/${method}/responses`,
              message: 'Missing required field: responses',
              severity: 'error',
            });
          }

          if (!operation.summary && !operation.description) {
            warnings.push({
              path: `/paths${path}/${method}`,
              message: 'Operation missing summary or description',
            });
          }
        }
      });
    });
  }

  // Validate components
  if (document.components?.schemas) {
    Object.entries(document.components.schemas).forEach(([name, schema]: [string, any]) => {
      if (schema.type === 'object' && !schema.properties && !schema.allOf && !schema.oneOf && !schema.anyOf) {
        warnings.push({
          path: `/components/schemas/${name}`,
          message: 'Object schema has no properties defined',
        });
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validates schema definitions for completeness and correctness.
 *
 * @param schemas - Map of schema definitions to validate
 * @returns Validation result with errors and warnings
 *
 * @example
 * ```typescript
 * const result = validateSchemaDefinitions(document.components?.schemas || {});
 * ```
 */
export function validateSchemaDefinitions(schemas: Record<string, any>): ValidationResult {
  const errors: Array<{ path: string; message: string; severity: 'error' | 'warning' }> = [];
  const warnings: Array<{ path: string; message: string }> = [];

  Object.entries(schemas).forEach(([name, schema]) => {
    const basePath = `/schemas/${name}`;

    // Validate type
    if (!schema.type && !schema.$ref && !schema.allOf && !schema.oneOf && !schema.anyOf) {
      errors.push({
        path: basePath,
        message: 'Schema must have a type or use composition (allOf, oneOf, anyOf) or $ref',
        severity: 'error',
      });
    }

    // Validate object schemas
    if (schema.type === 'object') {
      if (!schema.properties && !schema.additionalProperties && !schema.allOf) {
        warnings.push({
          path: basePath,
          message: 'Object schema has no properties or additionalProperties defined',
        });
      }

      // Check for required fields
      if (schema.required && Array.isArray(schema.required)) {
        schema.required.forEach((field: string) => {
          if (schema.properties && !schema.properties[field]) {
            errors.push({
              path: `${basePath}/required`,
              message: `Required field '${field}' is not defined in properties`,
              severity: 'error',
            });
          }
        });
      }
    }

    // Validate array schemas
    if (schema.type === 'array') {
      if (!schema.items) {
        errors.push({
          path: `${basePath}/items`,
          message: 'Array schema must define items',
          severity: 'error',
        });
      }
    }

    // Validate enum
    if (schema.enum) {
      if (!Array.isArray(schema.enum) || schema.enum.length === 0) {
        errors.push({
          path: `${basePath}/enum`,
          message: 'Enum must be a non-empty array',
          severity: 'error',
        });
      }
    }

    // Check for descriptions
    if (!schema.description && !schema.$ref) {
      warnings.push({
        path: basePath,
        message: 'Schema missing description',
      });
    }

    // Validate property descriptions
    if (schema.properties) {
      Object.entries(schema.properties).forEach(([propName, prop]: [string, any]) => {
        if (!prop.description && !prop.$ref) {
          warnings.push({
            path: `${basePath}/properties/${propName}`,
            message: 'Property missing description',
          });
        }
      });
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
