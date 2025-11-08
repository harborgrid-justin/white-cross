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

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface VirtualMachineResource {
  id: string;
  name: string;
  powerState: 'poweredOn' | 'poweredOff' | 'suspended';
  cpuCount: number;
  memoryMB: number;
  guestOS: string;
  hostId?: string;
  datastoreId?: string;
  networkIds?: string[];
  createdAt: Date;
  updatedAt: Date;
}

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

interface ContentNegotiation {
  accept: string[];
  contentType: string[];
  charset?: string;
  encoding?: string;
  language?: string;
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

interface ETagConfig {
  type: 'strong' | 'weak';
  value: string;
}

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (req: Request) => string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
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

interface ResourceValidation {
  field: string;
  rules: ValidationRule[];
}

interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'pattern' | 'enum' | 'custom';
  value?: any;
  message?: string;
}

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
export const generateVirtualResourceRoute = (
  resourceType: string,
  id?: string,
  subResource?: string,
): string => {
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
export const createVMLifecycleRoutes = (baseUrl: string): ResourceRoute[] => {
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
export const buildNestedVirtualRoute = (hierarchy: string[]): string => {
  return `/api/${hierarchy.join('/')}`;
};

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
export const generateVMActionRoute = (vmId: string, action: string): string => {
  return `/api/vms/${vmId}/actions/${action}`;
};

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
export const createCollectionFilterRoute = (
  resourceType: string,
  filterFields: string[],
): string => {
  const examples = filterFields.map(field => `filter[${field}]=value`).join('&');
  return `/api/${resourceType}?${examples}`;
};

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
export const generateBulkOperationRoute = (resourceType: string, operation: string): string => {
  return `/api/${resourceType}/bulk/${operation}`;
};

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
export const createRelatedResourceRoute = (
  resourceType: string,
  resourceId: string,
  relatedType: string,
): string => {
  return `/api/${resourceType}/${resourceId}/${relatedType}`;
};

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
export const generateVSphereResourcePath = (
  datacenter: string,
  folder: string,
  vmName: string,
): string => {
  return `/${datacenter}/${folder}/${vmName}`;
};

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
export const generateVMHateoasLinks = (
  vmId: string,
  baseUrl: string,
  powerState: string,
): HateoasLink[] => {
  const links: HateoasLink[] = [
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
  } else if (powerState === 'poweredOn') {
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
export const createCollectionHateoasLinks = (
  baseUrl: string,
  pagination: PaginationMetadata,
): HateoasLink[] => {
  const links: HateoasLink[] = [
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
export const wrapResourceWithHateoas = <T>(
  data: T,
  links: HateoasLink[],
  embedded?: Record<string, any>,
): ResourceRepresentation<T> => {
  return {
    data,
    _links: links,
    _embedded: embedded,
  };
};

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
export const createCollectionRepresentation = <T>(
  items: T[],
  totalCount: number,
  links: HateoasLink[],
  pagination: PaginationMetadata,
): CollectionRepresentation<T> => {
  return {
    data: items,
    _links: links,
    totalCount,
    pagination,
  };
};

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
export const generateVRealizeHateoasLinks = (
  resourceId: string,
  resourceType: string,
  baseUrl: string,
): HateoasLink[] => {
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
export const addDeprecationLink = (links: HateoasLink[], deprecationUrl: string): HateoasLink[] => {
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
export const generateVMActionLinks = (
  vmId: string,
  baseUrl: string,
  allowedActions: string[],
): HateoasLink[] => {
  const actionMap: Record<string, { method: 'POST' | 'DELETE'; title: string }> = {
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
export const extractVersionFromPath = (req: Request): string | null => {
  const match = req.path.match(/\/v(\d+)\//);
  return match ? `v${match[1]}` : null;
};

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
export const extractVersionFromHeader = (req: Request): string | null => {
  const acceptHeader = req.headers.accept || '';
  const match = acceptHeader.match(/vnd\.vmware\.v(\d+)/);
  return match ? `v${match[1]}` : null;
};

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
export const createVersionMetadata = (
  version: string,
  status: ApiVersion['status'],
  releaseDate: Date,
  options?: Partial<ApiVersion>,
): ApiVersion => {
  return {
    version,
    status,
    releaseDate,
    deprecationDate: options?.deprecationDate,
    sunsetDate: options?.sunsetDate,
    changelog: options?.changelog,
  };
};

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
export const validateApiVersion = (
  requestedVersion: string,
  supportedVersions: ApiVersion[],
): { valid: boolean; version?: ApiVersion; error?: string } => {
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
export const generateVersionNegotiationResponse = (versions: ApiVersion[]) => {
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
export const apiVersionMiddleware = (supportedVersions: ApiVersion[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const versionFromPath = extractVersionFromPath(req);
    const versionFromHeader = extractVersionFromHeader(req);
    const requestedVersion = versionFromPath || versionFromHeader || 'v1';

    const validation = validateApiVersion(requestedVersion, supportedVersions);

    if (!validation.valid) {
      return res.status(400).json({
        error: validation.error,
        supportedVersions: generateVersionNegotiationResponse(supportedVersions),
      });
    }

    if (validation.version?.status === 'deprecated') {
      res.setHeader('Warning', `299 - "API version ${requestedVersion} is deprecated"`);
      if (validation.version.sunsetDate) {
        res.setHeader('Sunset', validation.version.sunsetDate.toUTCString());
      }
    }

    (req as any).apiVersion = requestedVersion;
    next();
  };
};

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
export const generateVersionedRoutes = (versions: string[], resourcePath: string): string[] => {
  return versions.map(version => `/api/${version}${resourcePath}`);
};

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
export const extractPaginationParams = (
  req: Request,
  defaultPageSize = 20,
  maxPageSize = 100,
): { page: number; pageSize: number; offset: number } => {
  const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
  const requestedSize = parseInt(req.query.pageSize as string, 10) || defaultPageSize;
  const pageSize = Math.min(Math.max(1, requestedSize), maxPageSize);
  const offset = (page - 1) * pageSize;

  return { page, pageSize, offset };
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
export const buildPaginationMetadata = (
  totalItems: number,
  currentPage: number,
  pageSize: number,
): PaginationMetadata => {
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
export const createPaginationCursor = (lastItem: any, cursorField: string): string => {
  const cursorData = { [cursorField]: lastItem[cursorField] };
  return Buffer.from(JSON.stringify(cursorData)).toString('base64url');
};

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
export const decodePaginationCursor = (cursor: string): any => {
  try {
    const json = Buffer.from(cursor, 'base64url').toString('utf-8');
    return JSON.parse(json);
  } catch (error) {
    throw new Error('Invalid cursor format');
  }
};

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
export const generatePaginationLinkHeader = (
  baseUrl: string,
  metadata: PaginationMetadata,
): string => {
  const links: string[] = [];

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
export const createPaginatedVirtualResponse = <T>(
  items: T[],
  totalCount: number,
  pagination: PaginationMetadata,
  links: HateoasLink[],
): CollectionRepresentation<T> => {
  return createCollectionRepresentation(items, totalCount, links, pagination);
};

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
export const validatePaginationParams = (
  page: number,
  pageSize: number,
  maxPageSize: number,
): { valid: boolean; error?: string } => {
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
export const parseAcceptHeader = (req: Request): string[] => {
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
export const selectContentType = (
  acceptedTypes: string[],
  supportedTypes: string[],
): string | null => {
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
export const contentNegotiationMiddleware = (supportedTypes: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const acceptedTypes = parseAcceptHeader(req);
    const selectedType = selectContentType(acceptedTypes, supportedTypes);

    if (!selectedType) {
      return res.status(406).json({
        error: 'Not Acceptable',
        message: 'No supported content type available',
        supportedTypes,
      });
    }

    (req as any).negotiatedContentType = selectedType;
    res.setHeader('Content-Type', selectedType);
    next();
  };
};

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
export const formatResponseByContentType = (data: any, contentType: string): string => {
  switch (contentType) {
    case 'application/json':
      return JSON.stringify(data, null, 2);

    case 'application/xml': {
      const toXml = (obj: any, rootName = 'resource'): string => {
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
export const validateContentType = (
  req: Request,
  allowedTypes: string[],
): { valid: boolean; error?: string } => {
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
export const generateResourceETag = (resource: any, weak = false): string => {
  const crypto = require('crypto');
  const hash = crypto
    .createHash('sha256')
    .update(JSON.stringify(resource))
    .digest('hex')
    .substring(0, 12);

  return weak ? `W/"${hash}"` : `"${hash}"`;
};

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
export const validateETag = (req: Request, currentETag: string): boolean => {
  const ifNoneMatch = req.headers['if-none-match'];

  if (!ifNoneMatch) {
    return false;
  }

  const requestedETags = ifNoneMatch.split(',').map(e => e.trim());
  return requestedETags.includes(currentETag) || requestedETags.includes('*');
};

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
export const buildCacheControlHeader = (directive: CacheDirective): string => {
  const parts: string[] = [];

  if (directive.public) parts.push('public');
  if (directive.private) parts.push('private');
  if (directive.noCache) parts.push('no-cache');
  if (directive.noStore) parts.push('no-store');
  if (directive.mustRevalidate) parts.push('must-revalidate');

  if (directive.maxAge !== undefined) parts.push(`max-age=${directive.maxAge}`);
  if (directive.sMaxAge !== undefined) parts.push(`s-maxage=${directive.sMaxAge}`);
  if (directive.staleWhileRevalidate !== undefined) {
    parts.push(`stale-while-revalidate=${directive.staleWhileRevalidate}`);
  }
  if (directive.staleIfError !== undefined) {
    parts.push(`stale-if-error=${directive.staleIfError}`);
  }

  return parts.join(', ');
};

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
export const virtualResourceCachingMiddleware = (defaultDirective: CacheDirective) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const originalJson = res.json.bind(res);

    res.json = function (data: any) {
      const etag = generateResourceETag(data, false);
      res.setHeader('ETag', etag);

      if (validateETag(req, etag)) {
        return res.status(304).send();
      }

      const cacheControl = buildCacheControlHeader(defaultDirective);
      res.setHeader('Cache-Control', cacheControl);

      return originalJson(data);
    };

    next();
  };
};

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
export const hasResourceBeenModified = (req: Request, lastModified: Date): boolean => {
  const ifModifiedSince = req.headers['if-modified-since'];

  if (!ifModifiedSince) {
    return true;
  }

  const requestDate = new Date(ifModifiedSince);
  return lastModified > requestDate;
};

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
export const generateVRealizeAPIRequest = (
  endpoint: string,
  method: string,
  data?: any,
) => {
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
export const transformVRealizeToRESTResource = (vRealizeResource: any): any => {
  return {
    id: vRealizeResource.identifier,
    name: vRealizeResource.resourceKey?.name,
    type: vRealizeResource.resourceKey?.resourceKindKey,
    status: vRealizeResource.resourceStatusStates?.[0]?.resourceStatus,
    properties: vRealizeResource.resourceKey?.resourceIdentifiers?.reduce(
      (acc: any, prop: any) => {
        acc[prop.identifierType.name] = prop.value;
        return acc;
      },
      {},
    ),
    metadata: {
      creationTime: vRealizeResource.creationTime,
      collectorId: vRealizeResource.collectorId,
    },
  };
};

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
export const createVirtualServiceGatewayRoute = (
  serviceName: string,
  serviceVersion: string,
  route: string,
  upstream: string,
): ApiGatewayRoute => {
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
export const validateVSphereAPIResponse = (
  response: any,
): { valid: boolean; data?: any; error?: string } => {
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

export default {
  // Resource Routing
  generateVirtualResourceRoute,
  createVMLifecycleRoutes,
  buildNestedVirtualRoute,
  generateVMActionRoute,
  createCollectionFilterRoute,
  generateBulkOperationRoute,
  createRelatedResourceRoute,
  generateVSphereResourcePath,

  // HATEOAS Hypermedia
  generateVMHateoasLinks,
  createCollectionHateoasLinks,
  wrapResourceWithHateoas,
  createCollectionRepresentation,
  generateVRealizeHateoasLinks,
  addDeprecationLink,
  generateVMActionLinks,

  // API Versioning
  extractVersionFromPath,
  extractVersionFromHeader,
  createVersionMetadata,
  validateApiVersion,
  generateVersionNegotiationResponse,
  apiVersionMiddleware,
  generateVersionedRoutes,

  // Pagination
  extractPaginationParams,
  buildPaginationMetadata,
  createPaginationCursor,
  decodePaginationCursor,
  generatePaginationLinkHeader,
  createPaginatedVirtualResponse,
  validatePaginationParams,

  // Content Negotiation
  parseAcceptHeader,
  selectContentType,
  contentNegotiationMiddleware,
  formatResponseByContentType,
  validateContentType,

  // Caching & ETag
  generateResourceETag,
  validateETag,
  buildCacheControlHeader,
  virtualResourceCachingMiddleware,
  hasResourceBeenModified,

  // VMware vRealize Integration
  generateVRealizeAPIRequest,
  transformVRealizeToRESTResource,
  createVirtualServiceGatewayRoute,
  validateVSphereAPIResponse,
};
