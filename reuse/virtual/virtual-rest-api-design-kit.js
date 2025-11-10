"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateVSphereAPIResponse = exports.createVirtualServiceGatewayRoute = exports.transformVRealizeToRESTResource = exports.generateVRealizeAPIRequest = exports.hasResourceBeenModified = exports.virtualResourceCachingMiddleware = exports.buildCacheControlHeader = exports.validateETag = exports.generateResourceETag = exports.validateContentType = exports.formatResponseByContentType = exports.contentNegotiationMiddleware = exports.selectContentType = exports.parseAcceptHeader = exports.validatePaginationParams = exports.createPaginatedVirtualResponse = exports.generatePaginationLinkHeader = exports.decodePaginationCursor = exports.createPaginationCursor = exports.buildPaginationMetadata = exports.extractPaginationParams = exports.generateVersionedRoutes = exports.apiVersionMiddleware = exports.generateVersionNegotiationResponse = exports.validateApiVersion = exports.createVersionMetadata = exports.extractVersionFromHeader = exports.extractVersionFromPath = exports.generateVMActionLinks = exports.addDeprecationLink = exports.generateVRealizeHateoasLinks = exports.createCollectionRepresentation = exports.wrapResourceWithHateoas = exports.createCollectionHateoasLinks = exports.generateVMHateoasLinks = exports.generateVSphereResourcePath = exports.createRelatedResourceRoute = exports.generateBulkOperationRoute = exports.createCollectionFilterRoute = exports.generateVMActionRoute = exports.buildNestedVirtualRoute = exports.createVMLifecycleRoutes = exports.generateVirtualResourceRoute = void 0;
// ============================================================================
// RESOURCE ROUTING (1-8)
// ============================================================================
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
const generateVirtualResourceRoute = (resourceType, id, subResource) => {
    const pluralized = resourceType.endsWith('s') ? resourceType : `${resourceType}s`;
    let route = `/api/${pluralized}`;
    if (id) {
        route += `/${id}`;
    }
    if (subResource) {
        route += `/${subResource}`;
    }
    return route;
};
exports.generateVirtualResourceRoute = generateVirtualResourceRoute;
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
const createVMLifecycleRoutes = (baseUrl) => {
    return [
        {
            pattern: `${baseUrl}/vms/:id/power-on`,
            method: 'POST',
            handler: 'powerOnVM',
            responseType: 'application/json',
        },
        {
            pattern: `${baseUrl}/vms/:id/power-off`,
            method: 'POST',
            handler: 'powerOffVM',
            responseType: 'application/json',
        },
        {
            pattern: `${baseUrl}/vms/:id/suspend`,
            method: 'POST',
            handler: 'suspendVM',
            responseType: 'application/json',
        },
        {
            pattern: `${baseUrl}/vms/:id/reboot`,
            method: 'POST',
            handler: 'rebootVM',
            responseType: 'application/json',
        },
        {
            pattern: `${baseUrl}/vms/:id/reset`,
            method: 'POST',
            handler: 'resetVM',
            responseType: 'application/json',
        },
        {
            pattern: `${baseUrl}/vms/:id/snapshot`,
            method: 'POST',
            handler: 'createSnapshot',
            responseType: 'application/json',
        },
        {
            pattern: `${baseUrl}/vms/:id/clone`,
            method: 'POST',
            handler: 'cloneVM',
            responseType: 'application/json',
        },
        {
            pattern: `${baseUrl}/vms/:id/migrate`,
            method: 'POST',
            handler: 'migrateVM',
            responseType: 'application/json',
        },
    ];
};
exports.createVMLifecycleRoutes = createVMLifecycleRoutes;
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
const buildNestedVirtualRoute = (hierarchy) => {
    return `/api/${hierarchy.join('/')}`;
};
exports.buildNestedVirtualRoute = buildNestedVirtualRoute;
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
const generateVMActionRoute = (vmId, action) => {
    return `/api/vms/${vmId}/actions/${action}`;
};
exports.generateVMActionRoute = generateVMActionRoute;
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
const createCollectionFilterRoute = (resourceType, filterFields) => {
    const examples = filterFields.map(field => `filter[${field}]=value`).join('&');
    return `/api/${resourceType}?${examples}`;
};
exports.createCollectionFilterRoute = createCollectionFilterRoute;
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
const generateBulkOperationRoute = (resourceType, operation) => {
    return `/api/${resourceType}/bulk/${operation}`;
};
exports.generateBulkOperationRoute = generateBulkOperationRoute;
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
const createRelatedResourceRoute = (resourceType, resourceId, relatedType) => {
    return `/api/${resourceType}/${resourceId}/${relatedType}`;
};
exports.createRelatedResourceRoute = createRelatedResourceRoute;
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
const generateVSphereResourcePath = (datacenter, folder, vmName) => {
    return `/${datacenter}/${folder}/${vmName}`;
};
exports.generateVSphereResourcePath = generateVSphereResourcePath;
// ============================================================================
// HATEOAS HYPERMEDIA (9-15)
// ============================================================================
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
const generateVMHateoasLinks = (vmId, baseUrl, powerState) => {
    const links = [
        {
            rel: 'self',
            href: `${baseUrl}/vms/${vmId}`,
            method: 'GET',
            type: 'application/json',
        },
        {
            rel: 'update',
            href: `${baseUrl}/vms/${vmId}`,
            method: 'PUT',
            type: 'application/json',
        },
        {
            rel: 'delete',
            href: `${baseUrl}/vms/${vmId}`,
            method: 'DELETE',
        },
    ];
    // State-dependent links
    if (powerState === 'poweredOff') {
        links.push({
            rel: 'power-on',
            href: `${baseUrl}/vms/${vmId}/power-on`,
            method: 'POST',
            title: 'Power on virtual machine',
        });
    }
    else if (powerState === 'poweredOn') {
        links.push({
            rel: 'power-off',
            href: `${baseUrl}/vms/${vmId}/power-off`,
            method: 'POST',
            title: 'Power off virtual machine',
        });
        links.push({
            rel: 'reboot',
            href: `${baseUrl}/vms/${vmId}/reboot`,
            method: 'POST',
            title: 'Reboot virtual machine',
        });
    }
    return links;
};
exports.generateVMHateoasLinks = generateVMHateoasLinks;
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
const createCollectionHateoasLinks = (baseUrl, pagination) => {
    const links = [
        {
            rel: 'self',
            href: `${baseUrl}?page=${pagination.currentPage}&pageSize=${pagination.pageSize}`,
            method: 'GET',
        },
        {
            rel: 'first',
            href: `${baseUrl}?page=1&pageSize=${pagination.pageSize}`,
            method: 'GET',
        },
        {
            rel: 'last',
            href: `${baseUrl}?page=${pagination.totalPages}&pageSize=${pagination.pageSize}`,
            method: 'GET',
        },
    ];
    if (pagination.hasPreviousPage) {
        links.push({
            rel: 'prev',
            href: `${baseUrl}?page=${pagination.currentPage - 1}&pageSize=${pagination.pageSize}`,
            method: 'GET',
        });
    }
    if (pagination.hasNextPage) {
        links.push({
            rel: 'next',
            href: `${baseUrl}?page=${pagination.currentPage + 1}&pageSize=${pagination.pageSize}`,
            method: 'GET',
        });
    }
    return links;
};
exports.createCollectionHateoasLinks = createCollectionHateoasLinks;
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
const wrapResourceWithHateoas = (data, links, embedded) => {
    return {
        data,
        _links: links,
        _embedded: embedded,
    };
};
exports.wrapResourceWithHateoas = wrapResourceWithHateoas;
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
const createCollectionRepresentation = (items, totalCount, links, pagination) => {
    return {
        data: items,
        _links: links,
        totalCount,
        pagination,
    };
};
exports.createCollectionRepresentation = createCollectionRepresentation;
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
const generateVRealizeHateoasLinks = (resourceId, resourceType, baseUrl) => {
    return [
        {
            rel: 'self',
            href: `${baseUrl}/resources/${resourceId}`,
            method: 'GET',
            type: 'application/json',
        },
        {
            rel: 'stats',
            href: `${baseUrl}/resources/${resourceId}/stats`,
            method: 'GET',
            type: 'application/json',
        },
        {
            rel: 'metrics',
            href: `${baseUrl}/resources/${resourceId}/metrics`,
            method: 'GET',
            type: 'application/json',
        },
        {
            rel: 'alerts',
            href: `${baseUrl}/resources/${resourceId}/alerts`,
            method: 'GET',
            type: 'application/json',
        },
    ];
};
exports.generateVRealizeHateoasLinks = generateVRealizeHateoasLinks;
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
const addDeprecationLink = (links, deprecationUrl) => {
    return [
        ...links,
        {
            rel: 'deprecation',
            href: deprecationUrl,
            method: 'GET',
            type: 'text/html',
        },
    ];
};
exports.addDeprecationLink = addDeprecationLink;
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
const generateVMActionLinks = (vmId, baseUrl, allowedActions) => {
    const actionMap = {
        'power-on': { method: 'POST', title: 'Power on VM' },
        'power-off': { method: 'POST', title: 'Power off VM' },
        'reboot': { method: 'POST', title: 'Reboot VM' },
        'snapshot': { method: 'POST', title: 'Create snapshot' },
        'clone': { method: 'POST', title: 'Clone VM' },
        'migrate': { method: 'POST', title: 'Migrate VM' },
    };
    return allowedActions
        .filter(action => actionMap[action])
        .map(action => ({
        rel: action,
        href: `${baseUrl}/vms/${vmId}/${action}`,
        method: actionMap[action].method,
        title: actionMap[action].title,
    }));
};
exports.generateVMActionLinks = generateVMActionLinks;
// ============================================================================
// API VERSIONING (16-22)
// ============================================================================
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
const extractVersionFromPath = (req) => {
    const match = req.path.match(/\/v(\d+)\//);
    return match ? `v${match[1]}` : null;
};
exports.extractVersionFromPath = extractVersionFromPath;
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
const extractVersionFromHeader = (req) => {
    const acceptHeader = req.headers.accept || '';
    const match = acceptHeader.match(/vnd\.vmware\.v(\d+)/);
    return match ? `v${match[1]}` : null;
};
exports.extractVersionFromHeader = extractVersionFromHeader;
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
const createVersionMetadata = (version, status, releaseDate, options) => {
    return {
        version,
        status,
        releaseDate,
        deprecationDate: options?.deprecationDate,
        sunsetDate: options?.sunsetDate,
        changelog: options?.changelog,
    };
};
exports.createVersionMetadata = createVersionMetadata;
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
const validateApiVersion = (requestedVersion, supportedVersions) => {
    const version = supportedVersions.find(v => v.version === requestedVersion);
    if (!version) {
        return {
            valid: false,
            error: `API version ${requestedVersion} is not supported`,
        };
    }
    if (version.status === 'sunset') {
        return {
            valid: false,
            error: `API version ${requestedVersion} has been sunset`,
        };
    }
    return {
        valid: true,
        version,
    };
};
exports.validateApiVersion = validateApiVersion;
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
const generateVersionNegotiationResponse = (versions) => {
    return {
        supportedVersions: versions.map(v => ({
            version: v.version,
            status: v.status,
            releaseDate: v.releaseDate,
            deprecationDate: v.deprecationDate,
            sunsetDate: v.sunsetDate,
        })),
        currentVersion: versions.find(v => v.status === 'current')?.version,
        deprecatedVersions: versions.filter(v => v.status === 'deprecated').map(v => v.version),
    };
};
exports.generateVersionNegotiationResponse = generateVersionNegotiationResponse;
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
const apiVersionMiddleware = (supportedVersions) => {
    return (req, res, next) => {
        const versionFromPath = (0, exports.extractVersionFromPath)(req);
        const versionFromHeader = (0, exports.extractVersionFromHeader)(req);
        const requestedVersion = versionFromPath || versionFromHeader || 'v1';
        const validation = (0, exports.validateApiVersion)(requestedVersion, supportedVersions);
        if (!validation.valid) {
            return res.status(400).json({
                error: validation.error,
                supportedVersions: (0, exports.generateVersionNegotiationResponse)(supportedVersions),
            });
        }
        if (validation.version?.status === 'deprecated') {
            res.setHeader('Warning', `299 - "API version ${requestedVersion} is deprecated"`);
            if (validation.version.sunsetDate) {
                res.setHeader('Sunset', validation.version.sunsetDate.toUTCString());
            }
        }
        req.apiVersion = requestedVersion;
        next();
    };
};
exports.apiVersionMiddleware = apiVersionMiddleware;
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
const generateVersionedRoutes = (versions, resourcePath) => {
    return versions.map(version => `/api/${version}${resourcePath}`);
};
exports.generateVersionedRoutes = generateVersionedRoutes;
// ============================================================================
// PAGINATION (23-29)
// ============================================================================
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
const extractPaginationParams = (req, defaultPageSize = 20, maxPageSize = 100) => {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const requestedSize = parseInt(req.query.pageSize, 10) || defaultPageSize;
    const pageSize = Math.min(Math.max(1, requestedSize), maxPageSize);
    const offset = (page - 1) * pageSize;
    return { page, pageSize, offset };
};
exports.extractPaginationParams = extractPaginationParams;
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
const buildPaginationMetadata = (totalItems, currentPage, pageSize) => {
    const totalPages = Math.ceil(totalItems / pageSize);
    return {
        currentPage,
        pageSize,
        totalItems,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
    };
};
exports.buildPaginationMetadata = buildPaginationMetadata;
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
const createPaginationCursor = (lastItem, cursorField) => {
    const cursorData = { [cursorField]: lastItem[cursorField] };
    return Buffer.from(JSON.stringify(cursorData)).toString('base64url');
};
exports.createPaginationCursor = createPaginationCursor;
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
const decodePaginationCursor = (cursor) => {
    try {
        const json = Buffer.from(cursor, 'base64url').toString('utf-8');
        return JSON.parse(json);
    }
    catch (error) {
        throw new Error('Invalid cursor format');
    }
};
exports.decodePaginationCursor = decodePaginationCursor;
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
const generatePaginationLinkHeader = (baseUrl, metadata) => {
    const links = [];
    links.push(`<${baseUrl}?page=1&pageSize=${metadata.pageSize}>; rel="first"`);
    links.push(`<${baseUrl}?page=${metadata.totalPages}&pageSize=${metadata.pageSize}>; rel="last"`);
    if (metadata.hasPreviousPage) {
        links.push(`<${baseUrl}?page=${metadata.currentPage - 1}&pageSize=${metadata.pageSize}>; rel="prev"`);
    }
    if (metadata.hasNextPage) {
        links.push(`<${baseUrl}?page=${metadata.currentPage + 1}&pageSize=${metadata.pageSize}>; rel="next"`);
    }
    return links.join(', ');
};
exports.generatePaginationLinkHeader = generatePaginationLinkHeader;
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
const createPaginatedVirtualResponse = (items, totalCount, pagination, links) => {
    return (0, exports.createCollectionRepresentation)(items, totalCount, links, pagination);
};
exports.createPaginatedVirtualResponse = createPaginatedVirtualResponse;
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
const validatePaginationParams = (page, pageSize, maxPageSize) => {
    if (page < 1) {
        return { valid: false, error: 'Page number must be >= 1' };
    }
    if (pageSize < 1) {
        return { valid: false, error: 'Page size must be >= 1' };
    }
    if (pageSize > maxPageSize) {
        return { valid: false, error: `Page size cannot exceed ${maxPageSize}` };
    }
    return { valid: true };
};
exports.validatePaginationParams = validatePaginationParams;
// ============================================================================
// CONTENT NEGOTIATION (30-34)
// ============================================================================
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
const parseAcceptHeader = (req) => {
    const acceptHeader = req.headers.accept || '*/*';
    const types = acceptHeader.split(',').map(type => {
        const [mediaType, params] = type.trim().split(';');
        const quality = params?.match(/q=([\d.]+)/)?.[1] || '1.0';
        return { mediaType: mediaType.trim(), quality: parseFloat(quality) };
    });
    return types
        .sort((a, b) => b.quality - a.quality)
        .map(t => t.mediaType);
};
exports.parseAcceptHeader = parseAcceptHeader;
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
const selectContentType = (acceptedTypes, supportedTypes) => {
    for (const accepted of acceptedTypes) {
        if (accepted === '*/*') {
            return supportedTypes[0];
        }
        const [type, subtype] = accepted.split('/');
        for (const supported of supportedTypes) {
            if (supported === accepted) {
                return supported;
            }
            if (subtype === '*') {
                const [supportedType] = supported.split('/');
                if (supportedType === type) {
                    return supported;
                }
            }
        }
    }
    return null;
};
exports.selectContentType = selectContentType;
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
const contentNegotiationMiddleware = (supportedTypes) => {
    return (req, res, next) => {
        const acceptedTypes = (0, exports.parseAcceptHeader)(req);
        const selectedType = (0, exports.selectContentType)(acceptedTypes, supportedTypes);
        if (!selectedType) {
            return res.status(406).json({
                error: 'Not Acceptable',
                message: 'No supported content type available',
                supportedTypes,
            });
        }
        req.negotiatedContentType = selectedType;
        res.setHeader('Content-Type', selectedType);
        next();
    };
};
exports.contentNegotiationMiddleware = contentNegotiationMiddleware;
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
const formatResponseByContentType = (data, contentType) => {
    switch (contentType) {
        case 'application/json':
            return JSON.stringify(data, null, 2);
        case 'application/xml': {
            const toXml = (obj, rootName = 'resource') => {
                if (typeof obj !== 'object' || obj === null) {
                    return String(obj);
                }
                const entries = Object.entries(obj);
                const xml = entries.map(([key, value]) => {
                    if (Array.isArray(value)) {
                        return value.map(item => `<${key}>${toXml(item, key)}</${key}>`).join('');
                    }
                    return `<${key}>${toXml(value, key)}</${key}>`;
                }).join('');
                return `<${rootName}>${xml}</${rootName}>`;
            };
            return `<?xml version="1.0" encoding="UTF-8"?>${toXml(data)}`;
        }
        default:
            return JSON.stringify(data);
    }
};
exports.formatResponseByContentType = formatResponseByContentType;
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
const validateContentType = (req, allowedTypes) => {
    const contentType = req.headers['content-type']?.split(';')[0].trim();
    if (!contentType) {
        return { valid: false, error: 'Content-Type header is required' };
    }
    if (!allowedTypes.includes(contentType)) {
        return {
            valid: false,
            error: `Content-Type ${contentType} is not supported. Allowed types: ${allowedTypes.join(', ')}`,
        };
    }
    return { valid: true };
};
exports.validateContentType = validateContentType;
// ============================================================================
// CACHING & ETAG (35-39)
// ============================================================================
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
const generateResourceETag = (resource, weak = false) => {
    const crypto = require('crypto');
    const hash = crypto
        .createHash('sha256')
        .update(JSON.stringify(resource))
        .digest('hex')
        .substring(0, 12);
    return weak ? `W/"${hash}"` : `"${hash}"`;
};
exports.generateResourceETag = generateResourceETag;
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
const validateETag = (req, currentETag) => {
    const ifNoneMatch = req.headers['if-none-match'];
    if (!ifNoneMatch) {
        return false;
    }
    const requestedETags = ifNoneMatch.split(',').map(e => e.trim());
    return requestedETags.includes(currentETag) || requestedETags.includes('*');
};
exports.validateETag = validateETag;
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
const buildCacheControlHeader = (directive) => {
    const parts = [];
    if (directive.public)
        parts.push('public');
    if (directive.private)
        parts.push('private');
    if (directive.noCache)
        parts.push('no-cache');
    if (directive.noStore)
        parts.push('no-store');
    if (directive.mustRevalidate)
        parts.push('must-revalidate');
    if (directive.maxAge !== undefined)
        parts.push(`max-age=${directive.maxAge}`);
    if (directive.sMaxAge !== undefined)
        parts.push(`s-maxage=${directive.sMaxAge}`);
    if (directive.staleWhileRevalidate !== undefined) {
        parts.push(`stale-while-revalidate=${directive.staleWhileRevalidate}`);
    }
    if (directive.staleIfError !== undefined) {
        parts.push(`stale-if-error=${directive.staleIfError}`);
    }
    return parts.join(', ');
};
exports.buildCacheControlHeader = buildCacheControlHeader;
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
const virtualResourceCachingMiddleware = (defaultDirective) => {
    return (req, res, next) => {
        const originalJson = res.json.bind(res);
        res.json = function (data) {
            const etag = (0, exports.generateResourceETag)(data, false);
            res.setHeader('ETag', etag);
            if ((0, exports.validateETag)(req, etag)) {
                return res.status(304).send();
            }
            const cacheControl = (0, exports.buildCacheControlHeader)(defaultDirective);
            res.setHeader('Cache-Control', cacheControl);
            return originalJson(data);
        };
        next();
    };
};
exports.virtualResourceCachingMiddleware = virtualResourceCachingMiddleware;
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
const hasResourceBeenModified = (req, lastModified) => {
    const ifModifiedSince = req.headers['if-modified-since'];
    if (!ifModifiedSince) {
        return true;
    }
    const requestDate = new Date(ifModifiedSince);
    return lastModified > requestDate;
};
exports.hasResourceBeenModified = hasResourceBeenModified;
// ============================================================================
// VMWARE VREALIZE INTEGRATION (40-43)
// ============================================================================
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
const generateVRealizeAPIRequest = (endpoint, method, data) => {
    return {
        endpoint,
        method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
    };
};
exports.generateVRealizeAPIRequest = generateVRealizeAPIRequest;
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
const transformVRealizeToRESTResource = (vRealizeResource) => {
    return {
        id: vRealizeResource.identifier,
        name: vRealizeResource.resourceKey?.name,
        type: vRealizeResource.resourceKey?.resourceKindKey,
        status: vRealizeResource.resourceStatusStates?.[0]?.resourceStatus,
        properties: vRealizeResource.resourceKey?.resourceIdentifiers?.reduce((acc, prop) => {
            acc[prop.identifierType.name] = prop.value;
            return acc;
        }, {}),
        metadata: {
            creationTime: vRealizeResource.creationTime,
            collectorId: vRealizeResource.collectorId,
        },
    };
};
exports.transformVRealizeToRESTResource = transformVRealizeToRESTResource;
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
const createVirtualServiceGatewayRoute = (serviceName, serviceVersion, route, upstream) => {
    return {
        serviceName,
        serviceVersion,
        route,
        upstream,
        loadBalancing: 'round-robin',
        timeout: 30000,
        retries: 3,
    };
};
exports.createVirtualServiceGatewayRoute = createVirtualServiceGatewayRoute;
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
const validateVSphereAPIResponse = (response) => {
    if (!response) {
        return { valid: false, error: 'Response is empty' };
    }
    if (response.error) {
        return {
            valid: false,
            error: response.error.message || 'vSphere API error',
        };
    }
    if (response.value !== undefined) {
        return { valid: true, data: response.value };
    }
    return { valid: true, data: response };
};
exports.validateVSphereAPIResponse = validateVSphereAPIResponse;
exports.default = {
    // Resource Routing
    generateVirtualResourceRoute: exports.generateVirtualResourceRoute,
    createVMLifecycleRoutes: exports.createVMLifecycleRoutes,
    buildNestedVirtualRoute: exports.buildNestedVirtualRoute,
    generateVMActionRoute: exports.generateVMActionRoute,
    createCollectionFilterRoute: exports.createCollectionFilterRoute,
    generateBulkOperationRoute: exports.generateBulkOperationRoute,
    createRelatedResourceRoute: exports.createRelatedResourceRoute,
    generateVSphereResourcePath: exports.generateVSphereResourcePath,
    // HATEOAS Hypermedia
    generateVMHateoasLinks: exports.generateVMHateoasLinks,
    createCollectionHateoasLinks: exports.createCollectionHateoasLinks,
    wrapResourceWithHateoas: exports.wrapResourceWithHateoas,
    createCollectionRepresentation: exports.createCollectionRepresentation,
    generateVRealizeHateoasLinks: exports.generateVRealizeHateoasLinks,
    addDeprecationLink: exports.addDeprecationLink,
    generateVMActionLinks: exports.generateVMActionLinks,
    // API Versioning
    extractVersionFromPath: exports.extractVersionFromPath,
    extractVersionFromHeader: exports.extractVersionFromHeader,
    createVersionMetadata: exports.createVersionMetadata,
    validateApiVersion: exports.validateApiVersion,
    generateVersionNegotiationResponse: exports.generateVersionNegotiationResponse,
    apiVersionMiddleware: exports.apiVersionMiddleware,
    generateVersionedRoutes: exports.generateVersionedRoutes,
    // Pagination
    extractPaginationParams: exports.extractPaginationParams,
    buildPaginationMetadata: exports.buildPaginationMetadata,
    createPaginationCursor: exports.createPaginationCursor,
    decodePaginationCursor: exports.decodePaginationCursor,
    generatePaginationLinkHeader: exports.generatePaginationLinkHeader,
    createPaginatedVirtualResponse: exports.createPaginatedVirtualResponse,
    validatePaginationParams: exports.validatePaginationParams,
    // Content Negotiation
    parseAcceptHeader: exports.parseAcceptHeader,
    selectContentType: exports.selectContentType,
    contentNegotiationMiddleware: exports.contentNegotiationMiddleware,
    formatResponseByContentType: exports.formatResponseByContentType,
    validateContentType: exports.validateContentType,
    // Caching & ETag
    generateResourceETag: exports.generateResourceETag,
    validateETag: exports.validateETag,
    buildCacheControlHeader: exports.buildCacheControlHeader,
    virtualResourceCachingMiddleware: exports.virtualResourceCachingMiddleware,
    hasResourceBeenModified: exports.hasResourceBeenModified,
    // VMware vRealize Integration
    generateVRealizeAPIRequest: exports.generateVRealizeAPIRequest,
    transformVRealizeToRESTResource: exports.transformVRealizeToRESTResource,
    createVirtualServiceGatewayRoute: exports.createVirtualServiceGatewayRoute,
    validateVSphereAPIResponse: exports.validateVSphereAPIResponse,
};
//# sourceMappingURL=virtual-rest-api-design-kit.js.map