/**
 * OpenAPI Type Definitions
 *
 * Comprehensive TypeScript type definitions for OpenAPI 3.0 specification.
 * These types ensure type safety and compliance with the OpenAPI standard.
 *
 * @module swagger/types
 * @version 1.0.0
 */

/**
 * OpenAPI specification version constants
 */
export const OPENAPI_VERSION_3_0 = '3.0.3';
export const OPENAPI_VERSION_3_1 = '3.1.0';

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
  enum?: unknown[];
  example?: unknown;
  examples?: unknown[];
  default?: unknown;
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
  [key: string]: unknown; // Allow vendor extensions and additional properties
}

/**
 * OpenAPI Response Object type
 */
export interface ResponseObject {
  description: string;
  content?: Record<
    string,
    { schema?: SchemaObject; example?: unknown; examples?: Record<string, unknown> }
  >;
  headers?: Record<string, unknown>;
  links?: Record<string, unknown>;
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
  example?: unknown;
  examples?: Record<string, unknown>;
  style?: string;
  explode?: boolean;
}

/**
 * Swagger UI customization options
 */
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

/**
 * ReDoc documentation renderer options
 */
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

/**
 * Validation result type for OpenAPI document validation
 */
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
