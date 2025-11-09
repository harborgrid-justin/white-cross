/**
 * @fileoverview API Documentation Generation Utilities
 * @module core/api/documentation
 *
 * OpenAPI/Swagger documentation generation, API schema definitions,
 * and interactive documentation UI integration.
 */

import type { RequestHandler, Request, Response } from 'express';

/**
 * OpenAPI specification version
 */
export type OpenAPIVersion = '2.0' | '3.0.0' | '3.0.1' | '3.0.2' | '3.0.3' | '3.1.0';

/**
 * HTTP method types
 */
export type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete' | 'options' | 'head';

/**
 * Parameter location types
 */
export type ParameterLocation = 'path' | 'query' | 'header' | 'cookie';

/**
 * API parameter definition
 */
export interface ApiParameter {
  /** Parameter name */
  name: string;
  /** Parameter location */
  in: ParameterLocation;
  /** Parameter description */
  description?: string;
  /** Required flag */
  required?: boolean;
  /** Parameter schema */
  schema?: {
    type: string;
    format?: string;
    enum?: any[];
    default?: any;
  };
  /** Example value */
  example?: any;
}

/**
 * API response definition
 */
export interface ApiResponse {
  /** Response description */
  description: string;
  /** Response content */
  content?: Record<string, {
    schema?: any;
    example?: any;
    examples?: Record<string, any>;
  }>;
  /** Response headers */
  headers?: Record<string, {
    description?: string;
    schema?: any;
  }>;
}

/**
 * API endpoint definition
 */
export interface ApiEndpoint {
  /** HTTP method */
  method: HttpMethod;
  /** Endpoint path */
  path: string;
  /** Endpoint summary */
  summary?: string;
  /** Endpoint description */
  description?: string;
  /** Operation ID */
  operationId?: string;
  /** Tags for grouping */
  tags?: string[];
  /** Parameters */
  parameters?: ApiParameter[];
  /** Request body */
  requestBody?: {
    description?: string;
    required?: boolean;
    content: Record<string, {
      schema?: any;
      example?: any;
    }>;
  };
  /** Responses */
  responses: Record<string, ApiResponse>;
  /** Security requirements */
  security?: Array<Record<string, string[]>>;
  /** Deprecated flag */
  deprecated?: boolean;
}

/**
 * API documentation configuration
 */
export interface DocumentationConfig {
  /** OpenAPI version */
  openapi?: OpenAPIVersion;
  /** API info */
  info: {
    title: string;
    version: string;
    description?: string;
    termsOfService?: string;
    contact?: {
      name?: string;
      url?: string;
      email?: string;
    };
    license?: {
      name: string;
      url?: string;
    };
  };
  /** Server configurations */
  servers?: Array<{
    url: string;
    description?: string;
    variables?: Record<string, {
      default: string;
      enum?: string[];
      description?: string;
    }>;
  }>;
  /** Security schemes */
  securitySchemes?: Record<string, {
    type: string;
    scheme?: string;
    bearerFormat?: string;
    in?: string;
    name?: string;
  }>;
  /** Tags for grouping */
  tags?: Array<{
    name: string;
    description?: string;
  }>;
}

/**
 * Generates OpenAPI specification from endpoint definitions
 *
 * @param config - Documentation configuration
 * @param endpoints - Array of API endpoints
 * @returns OpenAPI specification object
 *
 * @example
 * ```typescript
 * const spec = generateOpenAPISpec({
 *   info: {
 *     title: 'My API',
 *     version: '1.0.0',
 *     description: 'API documentation'
 *   }
 * }, endpoints);
 * ```
 */
export function generateOpenAPISpec(
  config: DocumentationConfig,
  endpoints: ApiEndpoint[]
): any {
  const paths: Record<string, any> = {};

  // Group endpoints by path
  endpoints.forEach((endpoint) => {
    if (!paths[endpoint.path]) {
      paths[endpoint.path] = {};
    }

    paths[endpoint.path][endpoint.method] = {
      summary: endpoint.summary,
      description: endpoint.description,
      operationId: endpoint.operationId,
      tags: endpoint.tags,
      parameters: endpoint.parameters,
      requestBody: endpoint.requestBody,
      responses: endpoint.responses,
      security: endpoint.security,
      deprecated: endpoint.deprecated,
    };
  });

  return {
    openapi: config.openapi || '3.0.3',
    info: config.info,
    servers: config.servers || [],
    paths,
    components: {
      securitySchemes: config.securitySchemes || {},
    },
    tags: config.tags || [],
  };
}

/**
 * Creates Swagger UI middleware
 *
 * @param spec - OpenAPI specification
 * @param options - Swagger UI options
 * @returns Express middleware function
 *
 * @example
 * ```typescript
 * app.use('/api-docs', createSwaggerUI(spec, { customCss: '.swagger-ui { ... }' }));
 * ```
 */
export function createSwaggerUI(
  spec: any,
  options: {
    customCss?: string;
    customSiteTitle?: string;
    swaggerOptions?: Record<string, any>;
  } = {}
): RequestHandler {
  const { customCss = '', customSiteTitle = 'API Documentation', swaggerOptions = {} } = options;

  return (req: Request, res: Response) => {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${customSiteTitle}</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css">
  <style>${customCss}</style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      SwaggerUIBundle({
        spec: ${JSON.stringify(spec)},
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout",
        ${Object.entries(swaggerOptions).map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join(',\n        ')}
      });
    };
  </script>
</body>
</html>
    `.trim();

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  };
}

/**
 * Creates ReDoc documentation middleware
 *
 * @param spec - OpenAPI specification
 * @param options - ReDoc options
 * @returns Express middleware function
 */
export function createReDocUI(
  spec: any,
  options: {
    title?: string;
    redocOptions?: Record<string, any>;
  } = {}
): RequestHandler {
  const { title = 'API Documentation', redocOptions = {} } = options;

  return (req: Request, res: Response) => {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>${title}</title>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700" rel="stylesheet">
  <style>body { margin: 0; padding: 0; }</style>
</head>
<body>
  <redoc spec-url='#'></redoc>
  <script src="https://cdn.jsdelivr.net/npm/redoc@latest/bundles/redoc.standalone.js"></script>
  <script>
    Redoc.init(
      ${JSON.stringify(spec)},
      ${JSON.stringify(redocOptions)},
      document.querySelector('redoc')
    );
  </script>
</body>
</html>
    `.trim();

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  };
}

/**
 * Parses JSDoc comments to extract API documentation
 *
 * @param jsdoc - JSDoc comment string
 * @returns Parsed endpoint documentation
 */
export function parseJSDocToEndpoint(jsdoc: string): Partial<ApiEndpoint> {
  const endpoint: Partial<ApiEndpoint> = {
    parameters: [],
    responses: {},
  };

  // Extract description
  const descMatch = jsdoc.match(/@description\s+(.+?)(?=@|$)/s);
  if (descMatch) {
    endpoint.description = descMatch[1].trim();
  }

  // Extract parameters
  const paramMatches = jsdoc.matchAll(/@param\s+\{(.+?)\}\s+(\w+)\s+(.+?)(?=@|$)/gs);
  for (const match of paramMatches) {
    endpoint.parameters?.push({
      name: match[2],
      in: 'query',
      description: match[3].trim(),
      schema: { type: match[1].toLowerCase() },
    });
  }

  // Extract response
  const responseMatch = jsdoc.match(/@returns?\s+\{(.+?)\}\s+(.+?)(?=@|$)/s);
  if (responseMatch) {
    endpoint.responses = {
      '200': {
        description: responseMatch[2].trim(),
        content: {
          'application/json': {
            schema: { type: responseMatch[1].toLowerCase() },
          },
        },
      },
    };
  }

  return endpoint;
}

/**
 * Validates OpenAPI specification
 *
 * @param spec - OpenAPI specification to validate
 * @returns Validation result with errors if any
 */
export function validateOpenAPISpec(spec: any): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check required fields
  if (!spec.openapi) {
    errors.push('Missing required field: openapi');
  }

  if (!spec.info) {
    errors.push('Missing required field: info');
  } else {
    if (!spec.info.title) {
      errors.push('Missing required field: info.title');
    }
    if (!spec.info.version) {
      errors.push('Missing required field: info.version');
    }
  }

  if (!spec.paths) {
    errors.push('Missing required field: paths');
  }

  // Validate paths
  if (spec.paths && typeof spec.paths === 'object') {
    Object.entries(spec.paths).forEach(([path, methods]: [string, any]) => {
      if (!path.startsWith('/')) {
        errors.push(`Path must start with /: ${path}`);
      }

      if (typeof methods === 'object') {
        Object.entries(methods).forEach(([method, operation]: [string, any]) => {
          if (!operation.responses) {
            errors.push(`Missing responses for ${method.toUpperCase()} ${path}`);
          }
        });
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Merges multiple OpenAPI specifications
 *
 * @param specs - Array of OpenAPI specifications
 * @returns Merged specification
 */
export function mergeOpenAPISpecs(...specs: any[]): any {
  if (specs.length === 0) {
    throw new Error('At least one specification is required');
  }

  const merged = {
    openapi: specs[0].openapi,
    info: specs[0].info,
    servers: specs[0].servers || [],
    paths: {},
    components: {
      securitySchemes: {},
      schemas: {},
    },
    tags: [],
  };

  specs.forEach((spec) => {
    // Merge paths
    Object.assign(merged.paths, spec.paths || {});

    // Merge servers
    if (spec.servers) {
      merged.servers.push(...spec.servers);
    }

    // Merge components
    if (spec.components) {
      Object.assign(merged.components.securitySchemes, spec.components.securitySchemes || {});
      Object.assign(merged.components.schemas, spec.components.schemas || {});
    }

    // Merge tags
    if (spec.tags) {
      merged.tags.push(...spec.tags);
    }
  });

  return merged;
}
