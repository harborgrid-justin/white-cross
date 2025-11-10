/**
 * HATEOAS Utilities
 *
 * Hypermedia As The Engine Of Application State (HATEOAS) utilities for building
 * self-descriptive REST APIs. Automatically generates navigation links for resources,
 * collections, and pagination.
 *
 * Features:
 * - Resource link generation (self, update, delete, etc.)
 * - Collection navigation links
 * - Pagination links (first, previous, next, last)
 * - Permission-based link filtering
 * - Action links based on resource state
 * - Related resource links
 *
 * @module utils/hateoas
 * @version 1.0.0
 * @standard REST Level 3 (Richardson Maturity Model)
 */

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * HTTP methods for link actions
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

/**
 * HATEOAS link structure
 */
export interface HATEOASLink {
  /** Link relation type (e.g., 'self', 'next', 'edit') */
  rel: string;
  /** Target URL */
  href: string;
  /** HTTP method for this link (default: GET) */
  method?: HttpMethod;
  /** Media type expected (e.g., 'application/json') */
  type?: string;
  /** Human-readable description */
  title?: string;
  /** Indicates if this operation is destructive */
  destructive?: boolean;
}

/**
 * HATEOAS response wrapper
 */
export interface HATEOASResponse<T> {
  /** Response data */
  data: T;
  /** Navigation links */
  _links: Record<string, HATEOASLink>;
  /** Metadata (optional) */
  _meta?: Record<string, any>;
}

/**
 * Paginated HATEOAS response
 */
export interface PaginatedHATEOASResponse<T> {
  /** Array of items */
  data: T[];
  /** Navigation links */
  _links: Record<string, HATEOASLink>;
  /** Pagination metadata */
  _meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Resource link generation options
 */
export interface ResourceLinkOptions {
  /** Include update link */
  includeUpdate?: boolean;
  /** Include patch link */
  includePatch?: boolean;
  /** Include delete link */
  includeDelete?: boolean;
  /** Include collection link */
  includeCollection?: boolean;
  /** Additional custom links */
  additionalLinks?: HATEOASLink[];
  /** User permissions for filtering links */
  permissions?: string[];
}

/**
 * Pagination link options
 */
export interface PaginationOptions {
  /** Current page (1-indexed) */
  page: number;
  /** Items per page */
  limit: number;
  /** Total number of items */
  total: number;
  /** Base URL for pagination links */
  baseUrl: string;
  /** Additional query parameters to include */
  queryParams?: Record<string, string | number>;
}

// ============================================================================
// Core HATEOAS Functions
// ============================================================================

/**
 * Wrap data with HATEOAS links
 *
 * @param data - Response data
 * @param links - Array of HATEOAS links
 * @param meta - Optional metadata
 * @returns HATEOAS-wrapped response
 *
 * @example
 * ```typescript
 * const threat = { id: '123', name: 'WannaCry' };
 * const links = generateResourceLinks('threats', '123', 'https://api.example.com');
 * const response = wrapWithHATEOAS(threat, links);
 * ```
 */
export function wrapWithHATEOAS<T>(
  data: T,
  links: HATEOASLink[],
  meta?: Record<string, any>,
): HATEOASResponse<T> {
  const linkMap: Record<string, HATEOASLink> = {};

  // Convert array of links to object keyed by rel
  for (const link of links) {
    linkMap[link.rel] = link;
  }

  const response: HATEOASResponse<T> = {
    data,
    _links: linkMap,
  };

  if (meta) {
    response._meta = meta;
  }

  return response;
}

/**
 * Generate standard resource links (self, update, delete, collection)
 *
 * @param resourceType - Resource type (e.g., 'threats', 'users')
 * @param resourceId - Resource identifier
 * @param baseUrl - Base API URL
 * @param options - Link generation options
 * @returns Array of HATEOAS links
 *
 * @example
 * ```typescript
 * const links = generateResourceLinks('threats', '123', 'https://api.example.com/v1', {
 *   includeUpdate: true,
 *   includeDelete: true,
 *   permissions: ['threats:write', 'threats:delete']
 * });
 * ```
 */
export function generateResourceLinks(
  resourceType: string,
  resourceId: string,
  baseUrl: string,
  options: ResourceLinkOptions = {},
): HATEOASLink[] {
  const links: HATEOASLink[] = [];
  const resourceUrl = `${baseUrl}/${resourceType}/${resourceId}`;

  // Self link (always included)
  links.push({
    rel: 'self',
    href: resourceUrl,
    method: 'GET',
    type: 'application/json',
    title: `Get ${resourceType} details`,
  });

  // Update link (full replacement)
  if (options.includeUpdate !== false && hasPermission(options.permissions, `${resourceType}:write`)) {
    links.push({
      rel: 'update',
      href: resourceUrl,
      method: 'PUT',
      type: 'application/json',
      title: `Update ${resourceType}`,
    });
  }

  // Patch link (partial update)
  if (options.includePatch !== false && hasPermission(options.permissions, `${resourceType}:write`)) {
    links.push({
      rel: 'patch',
      href: resourceUrl,
      method: 'PATCH',
      type: 'application/json',
      title: `Partially update ${resourceType}`,
    });
  }

  // Delete link
  if (options.includeDelete !== false && hasPermission(options.permissions, `${resourceType}:delete`)) {
    links.push({
      rel: 'delete',
      href: resourceUrl,
      method: 'DELETE',
      title: `Delete ${resourceType}`,
      destructive: true,
    });
  }

  // Collection link
  if (options.includeCollection !== false) {
    links.push({
      rel: 'collection',
      href: `${baseUrl}/${resourceType}`,
      method: 'GET',
      type: 'application/json',
      title: `List all ${resourceType}`,
    });
  }

  // Additional custom links
  if (options.additionalLinks) {
    links.push(...options.additionalLinks);
  }

  return links;
}

/**
 * Generate pagination links (first, previous, next, last)
 *
 * @param options - Pagination options
 * @returns Array of pagination links
 *
 * @example
 * ```typescript
 * const links = generatePaginationLinks({
 *   page: 3,
 *   limit: 20,
 *   total: 150,
 *   baseUrl: 'https://api.example.com/v1/threats',
 *   queryParams: { severity: 'HIGH' }
 * });
 * ```
 */
export function generatePaginationLinks(options: PaginationOptions): HATEOASLink[] {
  const { page, limit, total, baseUrl, queryParams = {} } = options;
  const totalPages = Math.ceil(total / limit);
  const links: HATEOASLink[] = [];

  // Helper to build URL with query params
  const buildUrl = (pageNum: number): string => {
    const params = new URLSearchParams({
      page: pageNum.toString(),
      limit: limit.toString(),
      ...Object.fromEntries(
        Object.entries(queryParams).map(([key, value]) => [key, String(value)]),
      ),
    });
    return `${baseUrl}?${params.toString()}`;
  };

  // Self link
  links.push({
    rel: 'self',
    href: buildUrl(page),
    method: 'GET',
    type: 'application/json',
  });

  // First page link
  if (page > 1) {
    links.push({
      rel: 'first',
      href: buildUrl(1),
      method: 'GET',
      type: 'application/json',
      title: 'First page',
    });
  }

  // Previous page link
  if (page > 1) {
    links.push({
      rel: 'prev',
      href: buildUrl(page - 1),
      method: 'GET',
      type: 'application/json',
      title: 'Previous page',
    });
  }

  // Next page link
  if (page < totalPages) {
    links.push({
      rel: 'next',
      href: buildUrl(page + 1),
      method: 'GET',
      type: 'application/json',
      title: 'Next page',
    });
  }

  // Last page link
  if (page < totalPages) {
    links.push({
      rel: 'last',
      href: buildUrl(totalPages),
      method: 'GET',
      type: 'application/json',
      title: 'Last page',
    });
  }

  return links;
}

/**
 * Generate action links based on resource state
 *
 * @param resourceType - Resource type
 * @param resourceId - Resource identifier
 * @param baseUrl - Base API URL
 * @param actions - Available actions for this resource state
 * @returns Array of action links
 *
 * @example
 * ```typescript
 * const links = generateActionLinks('threats', '123', 'https://api.example.com/v1', [
 *   { action: 'analyze', method: 'POST', title: 'Run threat analysis' },
 *   { action: 'quarantine', method: 'POST', title: 'Quarantine threat' },
 * ]);
 * ```
 */
export function generateActionLinks(
  resourceType: string,
  resourceId: string,
  baseUrl: string,
  actions: Array<{ action: string; method: HttpMethod; title?: string; destructive?: boolean }>,
): HATEOASLink[] {
  return actions.map((action) => ({
    rel: action.action,
    href: `${baseUrl}/${resourceType}/${resourceId}/${action.action}`,
    method: action.method,
    type: 'application/json',
    title: action.title || `${action.action} ${resourceType}`,
    destructive: action.destructive,
  }));
}

/**
 * Generate related resource links
 *
 * @param resourceType - Parent resource type
 * @param resourceId - Parent resource identifier
 * @param baseUrl - Base API URL
 * @param relations - Related resource types
 * @returns Array of related resource links
 *
 * @example
 * ```typescript
 * const links = generateRelatedResourceLinks('threats', '123', 'https://api.example.com/v1', [
 *   { type: 'indicators', rel: 'indicators' },
 *   { type: 'reports', rel: 'reports' },
 * ]);
 * ```
 */
export function generateRelatedResourceLinks(
  resourceType: string,
  resourceId: string,
  baseUrl: string,
  relations: Array<{ type: string; rel?: string; title?: string }>,
): HATEOASLink[] {
  return relations.map((relation) => ({
    rel: relation.rel || relation.type,
    href: `${baseUrl}/${resourceType}/${resourceId}/${relation.type}`,
    method: 'GET',
    type: 'application/json',
    title: relation.title || `Get ${relation.type} for ${resourceType}`,
  }));
}

/**
 * Generate search/filter link
 *
 * @param resourceType - Resource type
 * @param baseUrl - Base API URL
 * @param searchFields - Available search fields
 * @returns Search link
 *
 * @example
 * ```typescript
 * const link = generateSearchLink('threats', 'https://api.example.com/v1', [
 *   'name', 'severity', 'type'
 * ]);
 * ```
 */
export function generateSearchLink(
  resourceType: string,
  baseUrl: string,
  searchFields: string[],
): HATEOASLink {
  return {
    rel: 'search',
    href: `${baseUrl}/${resourceType}/search`,
    method: 'GET',
    type: 'application/json',
    title: `Search ${resourceType} by: ${searchFields.join(', ')}`,
  };
}

/**
 * Wrap paginated data with HATEOAS links
 *
 * @param data - Array of items
 * @param paginationOptions - Pagination options
 * @returns Paginated HATEOAS response
 *
 * @example
 * ```typescript
 * const response = wrapPaginatedResponse(threats, {
 *   page: 1,
 *   limit: 20,
 *   total: 150,
 *   baseUrl: 'https://api.example.com/v1/threats'
 * });
 * ```
 */
export function wrapPaginatedResponse<T>(
  data: T[],
  paginationOptions: PaginationOptions,
): PaginatedHATEOASResponse<T> {
  const { page, limit, total } = paginationOptions;
  const totalPages = Math.ceil(total / limit);

  const links = generatePaginationLinks(paginationOptions);
  const linkMap: Record<string, HATEOASLink> = {};

  for (const link of links) {
    linkMap[link.rel] = link;
  }

  return {
    data,
    _links: linkMap,
    _meta: {
      page,
      limit,
      total,
      totalPages,
    },
  };
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Check if user has required permission
 */
function hasPermission(userPermissions: string[] | undefined, requiredPermission: string): boolean {
  if (!userPermissions || userPermissions.length === 0) {
    return true; // No permission filtering
  }

  // Support wildcard permissions (e.g., 'threats:*' matches 'threats:write')
  return userPermissions.some((perm) => {
    if (perm === requiredPermission) return true;
    if (perm.endsWith(':*')) {
      const prefix = perm.slice(0, -1);
      return requiredPermission.startsWith(prefix);
    }
    return false;
  });
}

/**
 * Extract base URL from request
 *
 * @param request - Express request object
 * @returns Base URL (protocol + host + api prefix)
 *
 * @example
 * ```typescript
 * const baseUrl = getBaseUrl(request); // 'https://api.example.com/v1'
 * ```
 */
export function getBaseUrl(request: any): string {
  const protocol = request.protocol || 'https';
  const host = request.get('host') || 'localhost';
  const baseUrl = `${protocol}://${host}`;

  // Try to detect API version from path
  const pathMatch = request.path.match(/^\/(v\d+)/);
  if (pathMatch) {
    return `${baseUrl}${pathMatch[0]}`;
  }

  return baseUrl;
}

/**
 * Extract resource type and ID from request path
 *
 * @param path - Request path
 * @returns Resource type and ID
 *
 * @example
 * ```typescript
 * const { resourceType, resourceId } = extractResourceInfo('/v1/threats/123');
 * // resourceType: 'threats', resourceId: '123'
 * ```
 */
export function extractResourceInfo(path: string): { resourceType?: string; resourceId?: string } {
  // Match patterns like /v1/threats/123 or /threats/123
  const match = path.match(/\/(?:v\d+\/)?([a-z-]+)\/([a-zA-Z0-9-]+)/);

  if (match) {
    return {
      resourceType: match[1],
      resourceId: match[2],
    };
  }

  return {};
}
