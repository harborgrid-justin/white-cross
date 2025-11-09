/**
 * LOC: VIRTAPI1234567
 * File: /reuse/virtual/virtual-rest-api-design-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Virtual infrastructure API implementations
 *   - VMware vRealize API controllers
 *   - Virtual machine management services
 */
/**
 * File: /reuse/virtual/virtual-rest-api-design-kit.ts
 * Locator: WC-VIRTUAL-RESTAPI-001
 * Purpose: Comprehensive Virtual Infrastructure REST API Design Utilities - RESTful patterns, HATEOAS, versioning, pagination, resource routing for VMs, vSphere, vRealize
 *
 * Upstream: Independent utility module for virtual infrastructure API design
 * Downstream: ../backend/*, Virtual infrastructure controllers, API gateway, VMware integration services
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Express 4.x
 * Exports: 43 utility functions for virtual infrastructure REST API design, resource modeling, HATEOAS links, versioning, pagination, VM lifecycle management
 *
 * LLM Context: Comprehensive virtual infrastructure REST API design utilities for implementing production-ready RESTful APIs for enterprise virtualization platforms.
 * Provides resource routing patterns, HATEOAS hypermedia controls, API versioning strategies, pagination helpers, VM resource modeling, vSphere integration patterns,
 * and VMware vRealize API design best practices. Essential for scalable virtual infrastructure management API architecture.
 */
import { Request, Response, NextFunction } from 'express';
interface HateoasLink {
    rel: string;
    href: string;
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    type?: string;
    title?: string;
    deprecation?: string;
}
interface ResourceRepresentation<T> {
    data: T;
    _links: HateoasLink[];
    _embedded?: Record<string, any>;
    _meta?: Record<string, any>;
}
interface CollectionRepresentation<T> {
    data: T[];
    _links: HateoasLink[];
    _embedded?: Record<string, any>;
    pagination?: PaginationMetadata;
    totalCount: number;
}
interface PaginationMetadata {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}
interface ApiVersion {
    version: string;
    status: 'current' | 'deprecated' | 'sunset';
    releaseDate: Date;
    deprecationDate?: Date;
    sunsetDate?: Date;
    changelog?: string;
}
interface ResourceRoute {
    pattern: string;
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';
    handler: string;
    parameters?: RouteParameter[];
    responseType?: string;
}
interface RouteParameter {
    name: string;
    type: 'path' | 'query' | 'header' | 'body';
    required: boolean;
    schema?: any;
    description?: string;
}
interface CacheDirective {
    maxAge?: number;
    sMaxAge?: number;
    public?: boolean;
    private?: boolean;
    noCache?: boolean;
    noStore?: boolean;
    mustRevalidate?: boolean;
    staleWhileRevalidate?: number;
    staleIfError?: number;
}
interface ApiGatewayRoute {
    serviceName: string;
    serviceVersion: string;
    route: string;
    upstream: string;
    loadBalancing?: 'round-robin' | 'least-connections' | 'ip-hash';
    timeout?: number;
    retries?: number;
}
/**
 * Generates RESTful resource route pattern for virtual machines.
 *
 * @param {string} resourceType - Resource type (vm, host, datastore, etc.)
 * @param {string} [id] - Optional resource ID
 * @param {string} [subResource] - Optional sub-resource
 * @returns {string} Route pattern
 *
 * @example
 * ```typescript
 * const vmRoute = generateVirtualResourceRoute('vm', ':vmId');
 * // Result: '/api/vms/:vmId'
 * const vmDisksRoute = generateVirtualResourceRoute('vm', ':vmId', 'disks');
 * // Result: '/api/vms/:vmId/disks'
 * ```
 */
export declare const generateVirtualResourceRoute: (resourceType: string, id?: string, subResource?: string) => string;
/**
 * Creates route configuration for virtual machine lifecycle operations.
 *
 * @param {string} baseUrl - Base API URL
 * @returns {ResourceRoute[]} Array of lifecycle routes
 *
 * @example
 * ```typescript
 * const routes = createVMLifecycleRoutes('/api/v1');
 * // Result: [
 * //   { pattern: '/api/v1/vms/:id/power-on', method: 'POST', ... },
 * //   { pattern: '/api/v1/vms/:id/power-off', method: 'POST', ... }
 * // ]
 * ```
 */
export declare const createVMLifecycleRoutes: (baseUrl: string) => ResourceRoute[];
/**
 * Builds nested resource route for virtual infrastructure hierarchies.
 *
 * @param {string[]} hierarchy - Resource hierarchy (datacenter, cluster, host, vm)
 * @returns {string} Nested route pattern
 *
 * @example
 * ```typescript
 * const route = buildNestedVirtualRoute(['datacenters', ':dcId', 'clusters', ':clusterId', 'hosts']);
 * // Result: '/api/datacenters/:dcId/clusters/:clusterId/hosts'
 * ```
 */
export declare const buildNestedVirtualRoute: (hierarchy: string[]) => string;
/**
 * Generates action-based route for VM operations.
 *
 * @param {string} vmId - Virtual machine ID parameter
 * @param {string} action - Action name
 * @returns {string} Action route
 *
 * @example
 * ```typescript
 * const route = generateVMActionRoute(':vmId', 'reconfigure');
 * // Result: '/api/vms/:vmId/actions/reconfigure'
 * ```
 */
export declare const generateVMActionRoute: (vmId: string, action: string) => string;
/**
 * Creates collection filtering route pattern.
 *
 * @param {string} resourceType - Resource type
 * @param {string[]} filterFields - Filterable fields
 * @returns {string} Query pattern documentation
 *
 * @example
 * ```typescript
 * const pattern = createCollectionFilterRoute('vms', ['powerState', 'guestOS', 'cpuCount']);
 * // Documents: /api/vms?filter[powerState]=poweredOn&filter[guestOS]=ubuntu
 * ```
 */
export declare const createCollectionFilterRoute: (resourceType: string, filterFields: string[]) => string;
/**
 * Generates bulk operation route pattern.
 *
 * @param {string} resourceType - Resource type
 * @param {string} operation - Bulk operation (create, update, delete)
 * @returns {string} Bulk operation route
 *
 * @example
 * ```typescript
 * const route = generateBulkOperationRoute('vms', 'power-on');
 * // Result: '/api/vms/bulk/power-on'
 * ```
 */
export declare const generateBulkOperationRoute: (resourceType: string, operation: string) => string;
/**
 * Creates route for related resource access.
 *
 * @param {string} resourceType - Primary resource type
 * @param {string} resourceId - Resource ID parameter
 * @param {string} relatedType - Related resource type
 * @returns {string} Related resource route
 *
 * @example
 * ```typescript
 * const route = createRelatedResourceRoute('vms', ':vmId', 'disks');
 * // Result: '/api/vms/:vmId/disks'
 * ```
 */
export declare const createRelatedResourceRoute: (resourceType: string, resourceId: string, relatedType: string) => string;
/**
 * Generates vSphere-compatible resource path.
 *
 * @param {string} datacenter - Datacenter name
 * @param {string} folder - Folder path
 * @param {string} vmName - VM name
 * @returns {string} vSphere resource path
 *
 * @example
 * ```typescript
 * const path = generateVSphereResourcePath('DC1', 'vm/production', 'web-server-01');
 * // Result: '/DC1/vm/production/web-server-01'
 * ```
 */
export declare const generateVSphereResourcePath: (datacenter: string, folder: string, vmName: string) => string;
/**
 * Generates HATEOAS links for virtual machine resource.
 *
 * @param {string} vmId - Virtual machine ID
 * @param {string} baseUrl - Base API URL
 * @param {string} powerState - Current power state
 * @returns {HateoasLink[]} HATEOAS links
 *
 * @example
 * ```typescript
 * const links = generateVMHateoasLinks('vm-123', '/api/v1', 'poweredOn');
 * // Result: [
 * //   { rel: 'self', href: '/api/v1/vms/vm-123', method: 'GET' },
 * //   { rel: 'power-off', href: '/api/v1/vms/vm-123/power-off', method: 'POST' }
 * // ]
 * ```
 */
export declare const generateVMHateoasLinks: (vmId: string, baseUrl: string, powerState: string) => HateoasLink[];
/**
 * Creates HATEOAS collection links with pagination.
 *
 * @param {string} baseUrl - Base collection URL
 * @param {PaginationMetadata} pagination - Pagination metadata
 * @returns {HateoasLink[]} Collection navigation links
 *
 * @example
 * ```typescript
 * const links = createCollectionHateoasLinks('/api/v1/vms', {
 *   currentPage: 2,
 *   totalPages: 5,
 *   hasNextPage: true,
 *   hasPreviousPage: true
 * });
 * ```
 */
export declare const createCollectionHateoasLinks: (baseUrl: string, pagination: PaginationMetadata) => HateoasLink[];
/**
 * Wraps resource with HATEOAS representation.
 *
 * @param {T} data - Resource data
 * @param {HateoasLink[]} links - HATEOAS links
 * @param {Record<string, any>} [embedded] - Embedded resources
 * @returns {ResourceRepresentation<T>} HATEOAS resource representation
 *
 * @example
 * ```typescript
 * const representation = wrapResourceWithHateoas(vm, links, { host: hostData });
 * // Result: { data: vm, _links: [...], _embedded: { host: hostData } }
 * ```
 */
export declare const wrapResourceWithHateoas: <T>(data: T, links: HateoasLink[], embedded?: Record<string, any>) => ResourceRepresentation<T>;
/**
 * Creates collection representation with HATEOAS.
 *
 * @param {T[]} items - Collection items
 * @param {number} totalCount - Total item count
 * @param {HateoasLink[]} links - Collection links
 * @param {PaginationMetadata} pagination - Pagination metadata
 * @returns {CollectionRepresentation<T>} HATEOAS collection
 *
 * @example
 * ```typescript
 * const collection = createCollectionRepresentation(vms, 100, links, pagination);
 * ```
 */
export declare const createCollectionRepresentation: <T>(items: T[], totalCount: number, links: HateoasLink[], pagination: PaginationMetadata) => CollectionRepresentation<T>;
/**
 * Generates vRealize-compatible HATEOAS links.
 *
 * @param {string} resourceId - Resource ID
 * @param {string} resourceType - Resource type
 * @param {string} baseUrl - vRealize API base URL
 * @returns {HateoasLink[]} vRealize HATEOAS links
 *
 * @example
 * ```typescript
 * const links = generateVRealizeHateoasLinks('res-123', 'VirtualMachine', '/vrealize/api');
 * ```
 */
export declare const generateVRealizeHateoasLinks: (resourceId: string, resourceType: string, baseUrl: string) => HateoasLink[];
/**
 * Adds deprecation link to HATEOAS representation.
 *
 * @param {HateoasLink[]} links - Existing links
 * @param {string} deprecationUrl - Deprecation documentation URL
 * @returns {HateoasLink[]} Links with deprecation
 *
 * @example
 * ```typescript
 * const updatedLinks = addDeprecationLink(links, 'https://docs.example.com/deprecation/v1-vm-api');
 * ```
 */
export declare const addDeprecationLink: (links: HateoasLink[], deprecationUrl: string) => HateoasLink[];
/**
 * Generates action links for VM operations.
 *
 * @param {string} vmId - VM ID
 * @param {string} baseUrl - Base URL
 * @param {string[]} allowedActions - Allowed actions based on permissions
 * @returns {HateoasLink[]} Action links
 *
 * @example
 * ```typescript
 * const actionLinks = generateVMActionLinks('vm-123', '/api/v1', ['power-on', 'snapshot']);
 * ```
 */
export declare const generateVMActionLinks: (vmId: string, baseUrl: string, allowedActions: string[]) => HateoasLink[];
/**
 * Extracts API version from request URL path.
 *
 * @param {Request} req - Express request
 * @returns {string | null} API version or null
 *
 * @example
 * ```typescript
 * // Request URL: /api/v2/vms/123
 * const version = extractVersionFromPath(req);
 * // Result: 'v2'
 * ```
 */
export declare const extractVersionFromPath: (req: Request) => string | null;
/**
 * Extracts API version from Accept header.
 *
 * @param {Request} req - Express request
 * @returns {string | null} API version or null
 *
 * @example
 * ```typescript
 * // Accept: application/vnd.vmware.v3+json
 * const version = extractVersionFromHeader(req);
 * // Result: 'v3'
 * ```
 */
export declare const extractVersionFromHeader: (req: Request) => string | null;
/**
 * Creates version metadata object.
 *
 * @param {string} version - Version string
 * @param {ApiVersion['status']} status - Version status
 * @param {Date} releaseDate - Release date
 * @param {Partial<ApiVersion>} [options] - Additional options
 * @returns {ApiVersion} Version metadata
 *
 * @example
 * ```typescript
 * const v1 = createVersionMetadata('v1', 'deprecated', new Date('2023-01-01'), {
 *   deprecationDate: new Date('2024-01-01'),
 *   sunsetDate: new Date('2025-01-01')
 * });
 * ```
 */
export declare const createVersionMetadata: (version: string, status: ApiVersion["status"], releaseDate: Date, options?: Partial<ApiVersion>) => ApiVersion;
/**
 * Validates requested API version against supported versions.
 *
 * @param {string} requestedVersion - Requested version
 * @param {ApiVersion[]} supportedVersions - Supported versions
 * @returns {{ valid: boolean; version?: ApiVersion; error?: string }} Validation result
 *
 * @example
 * ```typescript
 * const result = validateApiVersion('v2', supportedVersions);
 * if (!result.valid) {
 *   return res.status(400).json({ error: result.error });
 * }
 * ```
 */
export declare const validateApiVersion: (requestedVersion: string, supportedVersions: ApiVersion[]) => {
    valid: boolean;
    version?: ApiVersion;
    error?: string;
};
/**
 * Generates version negotiation response.
 *
 * @param {ApiVersion[]} versions - Available API versions
 * @returns {object} Version negotiation response
 *
 * @example
 * ```typescript
 * const response = generateVersionNegotiationResponse(supportedVersions);
 * res.json(response);
 * ```
 */
export declare const generateVersionNegotiationResponse: (versions: ApiVersion[]) => {
    supportedVersions: {
        version: string;
        status: "deprecated" | "sunset" | "current";
        releaseDate: Date;
        deprecationDate: Date | undefined;
        sunsetDate: Date | undefined;
    }[];
    currentVersion: string | undefined;
    deprecatedVersions: string[];
};
/**
 * Middleware factory for API version routing.
 *
 * @param {ApiVersion[]} supportedVersions - Supported versions
 * @returns {Function} Express middleware
 *
 * @example
 * ```typescript
 * app.use(apiVersionMiddleware(supportedVersions));
 * ```
 */
export declare const apiVersionMiddleware: (supportedVersions: ApiVersion[]) => (req: Request, res: Response, next: NextFunction) => any;
/**
 * Generates version-specific route patterns.
 *
 * @param {string[]} versions - Version strings
 * @param {string} resourcePath - Resource path
 * @returns {string[]} Versioned route patterns
 *
 * @example
 * ```typescript
 * const routes = generateVersionedRoutes(['v1', 'v2', 'v3'], '/vms');
 * // Result: ['/api/v1/vms', '/api/v2/vms', '/api/v3/vms']
 * ```
 */
export declare const generateVersionedRoutes: (versions: string[], resourcePath: string) => string[];
/**
 * Extracts pagination parameters from request query.
 *
 * @param {Request} req - Express request
 * @param {number} [defaultPageSize=20] - Default page size
 * @param {number} [maxPageSize=100] - Maximum page size
 * @returns {{ page: number; pageSize: number; offset: number }} Pagination params
 *
 * @example
 * ```typescript
 * const pagination = extractPaginationParams(req, 25, 100);
 * // Result: { page: 1, pageSize: 25, offset: 0 }
 * ```
 */
export declare const extractPaginationParams: (req: Request, defaultPageSize?: number, maxPageSize?: number) => {
    page: number;
    pageSize: number;
    offset: number;
};
/**
 * Builds pagination metadata from query results.
 *
 * @param {number} totalItems - Total item count
 * @param {number} currentPage - Current page number
 * @param {number} pageSize - Page size
 * @returns {PaginationMetadata} Pagination metadata
 *
 * @example
 * ```typescript
 * const metadata = buildPaginationMetadata(250, 3, 20);
 * // Result: { currentPage: 3, totalPages: 13, hasNextPage: true, ... }
 * ```
 */
export declare const buildPaginationMetadata: (totalItems: number, currentPage: number, pageSize: number) => PaginationMetadata;
/**
 * Creates cursor for cursor-based pagination.
 *
 * @param {any} lastItem - Last item in current page
 * @param {string} cursorField - Field to use as cursor
 * @returns {string} Encoded cursor
 *
 * @example
 * ```typescript
 * const cursor = createPaginationCursor(vm, 'createdAt');
 * // Result: 'eyJjcmVhdGVkQXQiOiIyMDI0LTAxLTAxVDAwOjAwOjAwLjAwMFoifQ=='
 * ```
 */
export declare const createPaginationCursor: (lastItem: any, cursorField: string) => string;
/**
 * Decodes pagination cursor.
 *
 * @param {string} cursor - Encoded cursor
 * @returns {any} Decoded cursor data
 *
 * @example
 * ```typescript
 * const data = decodePaginationCursor(cursor);
 * // Result: { createdAt: '2024-01-01T00:00:00.000Z' }
 * ```
 */
export declare const decodePaginationCursor: (cursor: string) => any;
/**
 * Generates RFC 8288 Link header for pagination.
 *
 * @param {string} baseUrl - Base URL
 * @param {PaginationMetadata} metadata - Pagination metadata
 * @returns {string} Link header value
 *
 * @example
 * ```typescript
 * const linkHeader = generatePaginationLinkHeader('/api/v1/vms', metadata);
 * res.setHeader('Link', linkHeader);
 * ```
 */
export declare const generatePaginationLinkHeader: (baseUrl: string, metadata: PaginationMetadata) => string;
/**
 * Creates paginated response for virtual resources.
 *
 * @param {T[]} items - Resource items
 * @param {number} totalCount - Total item count
 * @param {PaginationMetadata} pagination - Pagination metadata
 * @param {HateoasLink[]} links - HATEOAS links
 * @returns {CollectionRepresentation<T>} Paginated collection
 *
 * @example
 * ```typescript
 * const response = createPaginatedVirtualResponse(vms, 100, pagination, links);
 * res.json(response);
 * ```
 */
export declare const createPaginatedVirtualResponse: <T>(items: T[], totalCount: number, pagination: PaginationMetadata, links: HateoasLink[]) => CollectionRepresentation<T>;
/**
 * Validates pagination parameters.
 *
 * @param {number} page - Page number
 * @param {number} pageSize - Page size
 * @param {number} maxPageSize - Maximum allowed page size
 * @returns {{ valid: boolean; error?: string }} Validation result
 *
 * @example
 * ```typescript
 * const result = validatePaginationParams(page, pageSize, 100);
 * if (!result.valid) {
 *   return res.status(400).json({ error: result.error });
 * }
 * ```
 */
export declare const validatePaginationParams: (page: number, pageSize: number, maxPageSize: number) => {
    valid: boolean;
    error?: string;
};
/**
 * Parses Accept header for content negotiation.
 *
 * @param {Request} req - Express request
 * @returns {string[]} Accepted content types sorted by quality
 *
 * @example
 * ```typescript
 * // Accept: application/json;q=0.9, application/xml;q=0.8
 * const types = parseAcceptHeader(req);
 * // Result: ['application/json', 'application/xml']
 * ```
 */
export declare const parseAcceptHeader: (req: Request) => string[];
/**
 * Selects best content type from accepted types.
 *
 * @param {string[]} acceptedTypes - Client accepted types
 * @param {string[]} supportedTypes - Server supported types
 * @returns {string | null} Best matching content type
 *
 * @example
 * ```typescript
 * const contentType = selectContentType(
 *   ['application/json', 'application/xml'],
 *   ['application/json', 'text/html']
 * );
 * // Result: 'application/json'
 * ```
 */
export declare const selectContentType: (acceptedTypes: string[], supportedTypes: string[]) => string | null;
/**
 * Creates content negotiation middleware.
 *
 * @param {string[]} supportedTypes - Supported content types
 * @returns {Function} Express middleware
 *
 * @example
 * ```typescript
 * app.use(contentNegotiationMiddleware(['application/json', 'application/xml']));
 * ```
 */
export declare const contentNegotiationMiddleware: (supportedTypes: string[]) => (req: Request, res: Response, next: NextFunction) => any;
/**
 * Formats response based on content type.
 *
 * @param {any} data - Response data
 * @param {string} contentType - Content type
 * @returns {string} Formatted response
 *
 * @example
 * ```typescript
 * const formatted = formatResponseByContentType(vm, 'application/xml');
 * res.send(formatted);
 * ```
 */
export declare const formatResponseByContentType: (data: any, contentType: string) => string;
/**
 * Validates Content-Type header for requests.
 *
 * @param {Request} req - Express request
 * @param {string[]} allowedTypes - Allowed content types
 * @returns {{ valid: boolean; error?: string }} Validation result
 *
 * @example
 * ```typescript
 * const result = validateContentType(req, ['application/json', 'application/xml']);
 * if (!result.valid) {
 *   return res.status(415).json({ error: result.error });
 * }
 * ```
 */
export declare const validateContentType: (req: Request, allowedTypes: string[]) => {
    valid: boolean;
    error?: string;
};
/**
 * Generates ETag for resource.
 *
 * @param {any} resource - Resource data
 * @param {boolean} [weak=false] - Whether to use weak ETag
 * @returns {string} ETag value
 *
 * @example
 * ```typescript
 * const etag = generateResourceETag(vm, false);
 * res.setHeader('ETag', etag);
 * // Result: '"a1b2c3d4e5f6"'
 * ```
 */
export declare const generateResourceETag: (resource: any, weak?: boolean) => string;
/**
 * Validates ETag from If-None-Match header.
 *
 * @param {Request} req - Express request
 * @param {string} currentETag - Current resource ETag
 * @returns {boolean} Whether ETag matches (resource not modified)
 *
 * @example
 * ```typescript
 * if (validateETag(req, currentETag)) {
 *   return res.status(304).send();
 * }
 * ```
 */
export declare const validateETag: (req: Request, currentETag: string) => boolean;
/**
 * Builds Cache-Control header value.
 *
 * @param {CacheDirective} directive - Cache directive configuration
 * @returns {string} Cache-Control header value
 *
 * @example
 * ```typescript
 * const cacheControl = buildCacheControlHeader({
 *   public: true,
 *   maxAge: 3600,
 *   staleWhileRevalidate: 86400
 * });
 * res.setHeader('Cache-Control', cacheControl);
 * ```
 */
export declare const buildCacheControlHeader: (directive: CacheDirective) => string;
/**
 * Creates caching middleware for virtual resources.
 *
 * @param {CacheDirective} defaultDirective - Default cache directive
 * @returns {Function} Express middleware
 *
 * @example
 * ```typescript
 * app.use('/api/v1/vms', virtualResourceCachingMiddleware({
 *   public: true,
 *   maxAge: 300,
 *   staleWhileRevalidate: 600
 * }));
 * ```
 */
export declare const virtualResourceCachingMiddleware: (defaultDirective: CacheDirective) => (req: Request, res: Response, next: NextFunction) => void;
/**
 * Validates Last-Modified conditional request.
 *
 * @param {Request} req - Express request
 * @param {Date} lastModified - Resource last modified date
 * @returns {boolean} Whether resource has been modified
 *
 * @example
 * ```typescript
 * if (!hasResourceBeenModified(req, vm.updatedAt)) {
 *   return res.status(304).send();
 * }
 * ```
 */
export declare const hasResourceBeenModified: (req: Request, lastModified: Date) => boolean;
/**
 * Generates vRealize API request configuration.
 *
 * @param {string} endpoint - API endpoint
 * @param {string} method - HTTP method
 * @param {any} [data] - Request data
 * @returns {object} vRealize API request config
 *
 * @example
 * ```typescript
 * const config = generateVRealizeAPIRequest('/resources', 'GET');
 * const response = await fetch(vRealizeUrl + config.endpoint, config);
 * ```
 */
export declare const generateVRealizeAPIRequest: (endpoint: string, method: string, data?: any) => {
    endpoint: string;
    method: string;
    headers: {
        Accept: string;
        'Content-Type': string;
    };
    body: string | undefined;
};
/**
 * Transforms vRealize resource to REST API format.
 *
 * @param {any} vRealizeResource - vRealize resource object
 * @returns {any} Transformed REST resource
 *
 * @example
 * ```typescript
 * const restResource = transformVRealizeToRESTResource(vRealizeResponse);
 * res.json(restResource);
 * ```
 */
export declare const transformVRealizeToRESTResource: (vRealizeResource: any) => any;
/**
 * Creates API gateway route mapping for virtual services.
 *
 * @param {string} serviceName - Service name
 * @param {string} serviceVersion - Service version
 * @param {string} route - Route pattern
 * @param {string} upstream - Upstream service URL
 * @returns {ApiGatewayRoute} API gateway route configuration
 *
 * @example
 * ```typescript
 * const route = createVirtualServiceGatewayRoute(
 *   'vmware-vsphere',
 *   'v1',
 *   '/vms/*',
 *   'http://vsphere-service:8080'
 * );
 * ```
 */
export declare const createVirtualServiceGatewayRoute: (serviceName: string, serviceVersion: string, route: string, upstream: string) => ApiGatewayRoute;
/**
 * Validates VMware vSphere API response format.
 *
 * @param {any} response - vSphere API response
 * @returns {{ valid: boolean; data?: any; error?: string }} Validation result
 *
 * @example
 * ```typescript
 * const result = validateVSphereAPIResponse(vsphereResponse);
 * if (!result.valid) {
 *   throw new Error(result.error);
 * }
 * ```
 */
export declare const validateVSphereAPIResponse: (response: any) => {
    valid: boolean;
    data?: any;
    error?: string;
};
declare const _default: {
    generateVirtualResourceRoute: (resourceType: string, id?: string, subResource?: string) => string;
    createVMLifecycleRoutes: (baseUrl: string) => ResourceRoute[];
    buildNestedVirtualRoute: (hierarchy: string[]) => string;
    generateVMActionRoute: (vmId: string, action: string) => string;
    createCollectionFilterRoute: (resourceType: string, filterFields: string[]) => string;
    generateBulkOperationRoute: (resourceType: string, operation: string) => string;
    createRelatedResourceRoute: (resourceType: string, resourceId: string, relatedType: string) => string;
    generateVSphereResourcePath: (datacenter: string, folder: string, vmName: string) => string;
    generateVMHateoasLinks: (vmId: string, baseUrl: string, powerState: string) => HateoasLink[];
    createCollectionHateoasLinks: (baseUrl: string, pagination: PaginationMetadata) => HateoasLink[];
    wrapResourceWithHateoas: <T>(data: T, links: HateoasLink[], embedded?: Record<string, any>) => ResourceRepresentation<T>;
    createCollectionRepresentation: <T>(items: T[], totalCount: number, links: HateoasLink[], pagination: PaginationMetadata) => CollectionRepresentation<T>;
    generateVRealizeHateoasLinks: (resourceId: string, resourceType: string, baseUrl: string) => HateoasLink[];
    addDeprecationLink: (links: HateoasLink[], deprecationUrl: string) => HateoasLink[];
    generateVMActionLinks: (vmId: string, baseUrl: string, allowedActions: string[]) => HateoasLink[];
    extractVersionFromPath: (req: Request) => string | null;
    extractVersionFromHeader: (req: Request) => string | null;
    createVersionMetadata: (version: string, status: ApiVersion["status"], releaseDate: Date, options?: Partial<ApiVersion>) => ApiVersion;
    validateApiVersion: (requestedVersion: string, supportedVersions: ApiVersion[]) => {
        valid: boolean;
        version?: ApiVersion;
        error?: string;
    };
    generateVersionNegotiationResponse: (versions: ApiVersion[]) => {
        supportedVersions: {
            version: string;
            status: "deprecated" | "sunset" | "current";
            releaseDate: Date;
            deprecationDate: Date | undefined;
            sunsetDate: Date | undefined;
        }[];
        currentVersion: string | undefined;
        deprecatedVersions: string[];
    };
    apiVersionMiddleware: (supportedVersions: ApiVersion[]) => (req: Request, res: Response, next: NextFunction) => any;
    generateVersionedRoutes: (versions: string[], resourcePath: string) => string[];
    extractPaginationParams: (req: Request, defaultPageSize?: number, maxPageSize?: number) => {
        page: number;
        pageSize: number;
        offset: number;
    };
    buildPaginationMetadata: (totalItems: number, currentPage: number, pageSize: number) => PaginationMetadata;
    createPaginationCursor: (lastItem: any, cursorField: string) => string;
    decodePaginationCursor: (cursor: string) => any;
    generatePaginationLinkHeader: (baseUrl: string, metadata: PaginationMetadata) => string;
    createPaginatedVirtualResponse: <T>(items: T[], totalCount: number, pagination: PaginationMetadata, links: HateoasLink[]) => CollectionRepresentation<T>;
    validatePaginationParams: (page: number, pageSize: number, maxPageSize: number) => {
        valid: boolean;
        error?: string;
    };
    parseAcceptHeader: (req: Request) => string[];
    selectContentType: (acceptedTypes: string[], supportedTypes: string[]) => string | null;
    contentNegotiationMiddleware: (supportedTypes: string[]) => (req: Request, res: Response, next: NextFunction) => any;
    formatResponseByContentType: (data: any, contentType: string) => string;
    validateContentType: (req: Request, allowedTypes: string[]) => {
        valid: boolean;
        error?: string;
    };
    generateResourceETag: (resource: any, weak?: boolean) => string;
    validateETag: (req: Request, currentETag: string) => boolean;
    buildCacheControlHeader: (directive: CacheDirective) => string;
    virtualResourceCachingMiddleware: (defaultDirective: CacheDirective) => (req: Request, res: Response, next: NextFunction) => void;
    hasResourceBeenModified: (req: Request, lastModified: Date) => boolean;
    generateVRealizeAPIRequest: (endpoint: string, method: string, data?: any) => {
        endpoint: string;
        method: string;
        headers: {
            Accept: string;
            'Content-Type': string;
        };
        body: string | undefined;
    };
    transformVRealizeToRESTResource: (vRealizeResource: any) => any;
    createVirtualServiceGatewayRoute: (serviceName: string, serviceVersion: string, route: string, upstream: string) => ApiGatewayRoute;
    validateVSphereAPIResponse: (response: any) => {
        valid: boolean;
        data?: any;
        error?: string;
    };
};
export default _default;
//# sourceMappingURL=virtual-rest-api-design-kit.d.ts.map