/**
 * @fileoverview API Design Kit
 * @module core/api/design-kit
 *
 * Comprehensive API design patterns and best practices toolkit including
 * REST conventions, HATEOAS, resource naming, and API design validation.
 */
import type { Request, RequestHandler } from 'express';
/**
 * REST resource configuration
 */
export interface ResourceConfig {
    /** Resource name (singular) */
    name: string;
    /** Resource plural name */
    plural?: string;
    /** Resource identifier field */
    idField?: string;
    /** Allowed operations */
    operations?: Array<'list' | 'get' | 'create' | 'update' | 'delete'>;
}
/**
 * HATEOAS link definition
 */
export interface HATEOASLink {
    /** Link relation type */
    rel: string;
    /** Link URL */
    href: string;
    /** HTTP method */
    method?: string;
    /** Link type */
    type?: string;
}
/**
 * API response wrapper with metadata
 */
export interface ApiResponse<T = any> {
    /** Response data */
    data: T;
    /** Response metadata */
    meta?: {
        /** Pagination info */
        pagination?: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
        /** Request timestamp */
        timestamp?: string;
        /** Request ID */
        requestId?: string;
    };
    /** HATEOAS links */
    links?: HATEOASLink[];
}
/**
 * Pagination parameters
 */
export interface PaginationParams {
    /** Page number (1-based) */
    page?: number;
    /** Items per page */
    limit?: number;
    /** Offset (alternative to page) */
    offset?: number;
}
/**
 * Sort parameters
 */
export interface SortParams {
    /** Field to sort by */
    sortBy?: string;
    /** Sort direction */
    sortOrder?: 'asc' | 'desc';
}
/**
 * Filter parameters
 */
export interface FilterParams {
    /** Filter conditions */
    [key: string]: any;
}
/**
 * Query parameters combining pagination, sort, and filter
 */
export interface QueryParams extends PaginationParams, SortParams, FilterParams {
}
/**
 * Parses and validates pagination parameters from request
 *
 * @param req - Express request
 * @param defaults - Default pagination values
 * @returns Validated pagination parameters
 */
export declare function parsePaginationParams(req: Request, defaults?: {
    page?: number;
    limit?: number;
}): Required<PaginationParams>;
/**
 * Parses sort parameters from request
 *
 * @param req - Express request
 * @param allowedFields - List of fields that can be sorted
 * @returns Sort parameters
 */
export declare function parseSortParams(req: Request, allowedFields?: string[]): SortParams;
/**
 * Creates HATEOAS links for a resource
 *
 * @param baseUrl - Base URL for links
 * @param resourceId - Resource identifier
 * @param config - Resource configuration
 * @returns Array of HATEOAS links
 */
export declare function createHATEOASLinks(baseUrl: string, resourceId: string | number, config: ResourceConfig): HATEOASLink[];
/**
 * Wraps response data with standard API response format
 *
 * @param data - Response data
 * @param options - Response options
 * @returns Formatted API response
 */
export declare function wrapApiResponse<T>(data: T, options?: {
    pagination?: {
        page: number;
        limit: number;
        total: number;
    };
    links?: HATEOASLink[];
    requestId?: string;
}): ApiResponse<T>;
/**
 * Creates standard CRUD routes for a resource
 *
 * @param config - Resource configuration
 * @param handlers - CRUD operation handlers
 * @returns Array of route configurations
 */
export declare function createRESTRoutes(config: ResourceConfig, handlers: {
    list?: RequestHandler;
    get?: RequestHandler;
    create?: RequestHandler;
    update?: RequestHandler;
    delete?: RequestHandler;
}): Array<{
    method: string;
    path: string;
    handler: RequestHandler;
}>;
/**
 * Validates resource naming conventions
 *
 * @param name - Resource name to validate
 * @returns Validation result
 */
export declare function validateResourceName(name: string): {
    valid: boolean;
    errors: string[];
};
/**
 * Creates middleware for adding request ID
 *
 * @returns Express middleware function
 */
export declare function createRequestIdMiddleware(): RequestHandler;
/**
 * Creates API response middleware for consistent formatting
 *
 * @param options - Formatting options
 * @returns Express middleware function
 */
export declare function createResponseFormatterMiddleware(options?: {
    includeLinks?: boolean;
    includeTimestamp?: boolean;
}): RequestHandler;
/**
 * API Design Kit - Main export
 */
declare const _default: {
    parsePaginationParams: typeof parsePaginationParams;
    parseSortParams: typeof parseSortParams;
    createHATEOASLinks: typeof createHATEOASLinks;
    wrapApiResponse: typeof wrapApiResponse;
    createRESTRoutes: typeof createRESTRoutes;
    validateResourceName: typeof validateResourceName;
    createRequestIdMiddleware: typeof createRequestIdMiddleware;
    createResponseFormatterMiddleware: typeof createResponseFormatterMiddleware;
};
export default _default;
//# sourceMappingURL=design-kit.d.ts.map