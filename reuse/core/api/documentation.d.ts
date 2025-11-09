/**
 * @fileoverview API Documentation Generation Utilities
 * @module core/api/documentation
 *
 * OpenAPI/Swagger documentation generation, API schema definitions,
 * and interactive documentation UI integration.
 */
import type { RequestHandler } from 'express';
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
export declare function generateOpenAPISpec(config: DocumentationConfig, endpoints: ApiEndpoint[]): any;
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
export declare function createSwaggerUI(spec: any, options?: {
    customCss?: string;
    customSiteTitle?: string;
    swaggerOptions?: Record<string, any>;
}): RequestHandler;
/**
 * Creates ReDoc documentation middleware
 *
 * @param spec - OpenAPI specification
 * @param options - ReDoc options
 * @returns Express middleware function
 */
export declare function createReDocUI(spec: any, options?: {
    title?: string;
    redocOptions?: Record<string, any>;
}): RequestHandler;
/**
 * Parses JSDoc comments to extract API documentation
 *
 * @param jsdoc - JSDoc comment string
 * @returns Parsed endpoint documentation
 */
export declare function parseJSDocToEndpoint(jsdoc: string): Partial<ApiEndpoint>;
/**
 * Validates OpenAPI specification
 *
 * @param spec - OpenAPI specification to validate
 * @returns Validation result with errors if any
 */
export declare function validateOpenAPISpec(spec: any): {
    valid: boolean;
    errors: string[];
};
/**
 * Merges multiple OpenAPI specifications
 *
 * @param specs - Array of OpenAPI specifications
 * @returns Merged specification
 */
export declare function mergeOpenAPISpecs(...specs: any[]): any;
//# sourceMappingURL=documentation.d.ts.map