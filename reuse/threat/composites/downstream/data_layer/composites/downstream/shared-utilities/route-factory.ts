/**
 * Route Factory - Dynamic RESTful Route Generation with HATEOAS
 *
 * Re-exports all route factory patterns from reference composite library and
 * provides threat intelligence-specific route factories for automatic controller
 * generation with HATEOAS links, OpenAPI documentation, and RESTful conventions.
 *
 * @module shared-utilities/route-factory
 * @version 1.0.0
 * @requires reuse/data/composites/controller-route-factories (1,524 lines)
 */

// ============================================================================
// RE-EXPORT ALL ROUTE FACTORY PATTERNS (1,524 lines)
// ============================================================================

export * from '../../../../../data/composites/controller-route-factories';

// Import specific utilities for threat intelligence extensions
import {
  HATEOASLink,
  HATEOASResource,
  LinkRelation,
  RouteConfig,
  createRESTfulRoutes,
  createHATEOASLinks,
  wrapWithHATEOAS,
} from '../../../../../data/composites/controller-route-factories';

// ============================================================================
// THREAT INTELLIGENCE ROUTE FACTORIES
// ============================================================================

/**
 * RESTful operations enum
 */
export enum RESTOperation {
  LIST = 'list',
  GET = 'get',
  CREATE = 'create',
  UPDATE = 'update',
  PATCH = 'patch',
  DELETE = 'delete',
  SEARCH = 'search',
  BULK_CREATE = 'bulkCreate',
  BULK_UPDATE = 'bulkUpdate',
  BULK_DELETE = 'bulkDelete',
  EXPORT = 'export',
}

/**
 * Route factory configuration
 */
export interface ThreatRouteConfig {
  name: string;
  path: string;
  idParam?: string;
  enabledOperations?: RESTOperation[];
  enableHATEOAS?: boolean;
  enableVersioning?: boolean;
  apiVersion?: string;
  tags?: string[];
  security?: string[];
}

/**
 * Create RESTful routes for threat intelligence resources
 *
 * Generates complete CRUD endpoints with HATEOAS, OpenAPI docs, and validation
 *
 * @param config - Route configuration
 * @returns Route decorator factories
 */
export function createThreatRoutes(config: ThreatRouteConfig) {
  const {
    name,
    path,
    idParam = 'id',
    enabledOperations = [
      RESTOperation.LIST,
      RESTOperation.GET,
      RESTOperation.CREATE,
      RESTOperation.UPDATE,
      RESTOperation.DELETE,
      RESTOperation.SEARCH,
    ],
    enableHATEOAS = true,
    enableVersioning = true,
    apiVersion = 'v1',
    tags = [name],
    security = ['bearer', 'apiKey'],
  } = config;

  const routes: any = {};

  // ====================================================================
  // LIST - GET /threats
  // ====================================================================
  if (enabledOperations.includes(RESTOperation.LIST)) {
    routes.list = {
      method: 'GET',
      path: '',
      operationId: `list${name}`,
      summary: `List all ${name.toLowerCase()}s`,
      description: `Retrieve a paginated list of ${name.toLowerCase()}s with optional filtering`,
      tags,
      security,
      responses: {
        200: {
          description: `Successfully retrieved ${name.toLowerCase()} list`,
          type: 'array',
        },
      },
      queries: [
        { name: 'page', type: 'number', required: false, description: 'Page number (default: 1)' },
        { name: 'limit', type: 'number', required: false, description: 'Items per page (default: 20)' },
        { name: 'sortBy', type: 'string', required: false, description: 'Sort field' },
        { name: 'sortOrder', type: 'string', required: false, description: 'Sort order (asc/desc)' },
        { name: 'severity', type: 'string', required: false, description: 'Filter by severity' },
        { name: 'status', type: 'string', required: false, description: 'Filter by status' },
        { name: 'type', type: 'string', required: false, description: 'Filter by type' },
      ],
    };
  }

  // ====================================================================
  // GET - GET /threats/:id
  // ====================================================================
  if (enabledOperations.includes(RESTOperation.GET)) {
    routes.get = {
      method: 'GET',
      path: `:${idParam}`,
      operationId: `get${name}`,
      summary: `Get ${name.toLowerCase()} by ID`,
      description: `Retrieve a single ${name.toLowerCase()} by its unique identifier`,
      tags,
      security,
      params: [
        { name: idParam, type: 'string', required: true, description: `${name} ID` },
      ],
      responses: {
        200: {
          description: `Successfully retrieved ${name.toLowerCase()}`,
          type: name,
        },
        404: {
          description: `${name} not found`,
        },
      },
    };
  }

  // ====================================================================
  // CREATE - POST /threats
  // ====================================================================
  if (enabledOperations.includes(RESTOperation.CREATE)) {
    routes.create = {
      method: 'POST',
      path: '',
      operationId: `create${name}`,
      summary: `Create new ${name.toLowerCase()}`,
      description: `Create a new ${name.toLowerCase()} with the provided data`,
      tags,
      security,
      body: {
        type: `Create${name}Dto`,
        required: true,
      },
      responses: {
        201: {
          description: `${name} created successfully`,
          type: name,
        },
        400: {
          description: 'Invalid input data',
        },
      },
    };
  }

  // ====================================================================
  // UPDATE - PUT /threats/:id
  // ====================================================================
  if (enabledOperations.includes(RESTOperation.UPDATE)) {
    routes.update = {
      method: 'PUT',
      path: `:${idParam}`,
      operationId: `update${name}`,
      summary: `Update ${name.toLowerCase()}`,
      description: `Update an existing ${name.toLowerCase()} (full replacement)`,
      tags,
      security,
      params: [
        { name: idParam, type: 'string', required: true, description: `${name} ID` },
      ],
      body: {
        type: `Update${name}Dto`,
        required: true,
      },
      responses: {
        200: {
          description: `${name} updated successfully`,
          type: name,
        },
        404: {
          description: `${name} not found`,
        },
      },
    };
  }

  // ====================================================================
  // PATCH - PATCH /threats/:id
  // ====================================================================
  if (enabledOperations.includes(RESTOperation.PATCH)) {
    routes.patch = {
      method: 'PATCH',
      path: `:${idParam}`,
      operationId: `patch${name}`,
      summary: `Partially update ${name.toLowerCase()}`,
      description: `Update specific fields of an existing ${name.toLowerCase()}`,
      tags,
      security,
      params: [
        { name: idParam, type: 'string', required: true, description: `${name} ID` },
      ],
      body: {
        type: `Patch${name}Dto`,
        required: true,
      },
      responses: {
        200: {
          description: `${name} patched successfully`,
          type: name,
        },
        404: {
          description: `${name} not found`,
        },
      },
    };
  }

  // ====================================================================
  // DELETE - DELETE /threats/:id
  // ====================================================================
  if (enabledOperations.includes(RESTOperation.DELETE)) {
    routes.delete = {
      method: 'DELETE',
      path: `:${idParam}`,
      operationId: `delete${name}`,
      summary: `Delete ${name.toLowerCase()}`,
      description: `Permanently delete a ${name.toLowerCase()}`,
      tags,
      security,
      params: [
        { name: idParam, type: 'string', required: true, description: `${name} ID` },
      ],
      responses: {
        204: {
          description: `${name} deleted successfully`,
        },
        404: {
          description: `${name} not found`,
        },
      },
    };
  }

  // ====================================================================
  // SEARCH - POST /threats/search
  // ====================================================================
  if (enabledOperations.includes(RESTOperation.SEARCH)) {
    routes.search = {
      method: 'POST',
      path: 'search',
      operationId: `search${name}`,
      summary: `Advanced search ${name.toLowerCase()}s`,
      description: `Search ${name.toLowerCase()}s with complex filters and criteria`,
      tags,
      security,
      body: {
        type: `Search${name}Dto`,
        required: true,
      },
      responses: {
        200: {
          description: `Search results`,
          type: 'array',
        },
      },
    };
  }

  // ====================================================================
  // BULK CREATE - POST /threats/bulk
  // ====================================================================
  if (enabledOperations.includes(RESTOperation.BULK_CREATE)) {
    routes.bulkCreate = {
      method: 'POST',
      path: 'bulk',
      operationId: `bulkCreate${name}`,
      summary: `Bulk create ${name.toLowerCase()}s`,
      description: `Create multiple ${name.toLowerCase()}s in a single request`,
      tags,
      security,
      body: {
        type: `array<Create${name}Dto>`,
        required: true,
      },
      responses: {
        201: {
          description: `${name}s created successfully`,
          type: 'array',
        },
      },
    };
  }

  // ====================================================================
  // EXPORT - GET /threats/export
  // ====================================================================
  if (enabledOperations.includes(RESTOperation.EXPORT)) {
    routes.export = {
      method: 'GET',
      path: 'export',
      operationId: `export${name}`,
      summary: `Export ${name.toLowerCase()}s`,
      description: `Export ${name.toLowerCase()}s to CSV/JSON/XML format`,
      tags,
      security,
      queries: [
        { name: 'format', type: 'string', required: false, description: 'Export format (csv, json, xml)' },
        { name: 'filters', type: 'string', required: false, description: 'JSON filter criteria' },
      ],
      responses: {
        200: {
          description: `${name}s exported successfully`,
          contentType: 'application/octet-stream',
        },
      },
    };
  }

  return routes;
}

/**
 * Generate HATEOAS links for a threat intelligence resource
 *
 * @param resourceName - Name of the resource (e.g., 'ThreatIntelligence')
 * @param resourceId - ID of the resource
 * @param baseUrl - Base URL for the API (e.g., '/api/v1')
 * @param additionalLinks - Additional custom links
 * @returns Array of HATEOAS links
 */
export function generateThreatHATEOASLinks(
  resourceName: string,
  resourceId: string,
  baseUrl: string = '/api/v1',
  additionalLinks: HATEOASLink[] = []
): HATEOASLink[] {
  const resourcePath = `${baseUrl}/${resourceName.toLowerCase()}s`;

  const links: HATEOASLink[] = [
    {
      rel: LinkRelation.SELF,
      href: `${resourcePath}/${resourceId}`,
      method: 'GET',
      title: `Get ${resourceName}`,
    },
    {
      rel: LinkRelation.COLLECTION,
      href: resourcePath,
      method: 'GET',
      title: `List all ${resourceName}s`,
    },
    {
      rel: LinkRelation.UPDATE,
      href: `${resourcePath}/${resourceId}`,
      method: 'PUT',
      title: `Update ${resourceName}`,
    },
    {
      rel: LinkRelation.DELETE,
      href: `${resourcePath}/${resourceId}`,
      method: 'DELETE',
      title: `Delete ${resourceName}`,
    },
  ];

  // Add resource-specific links
  if (resourceName === 'ThreatIntelligence' || resourceName === 'Threat') {
    links.push(
      {
        rel: 'indicators',
        href: `${resourcePath}/${resourceId}/indicators`,
        method: 'GET',
        title: 'Get threat indicators',
      },
      {
        rel: 'affectedSystems',
        href: `${resourcePath}/${resourceId}/affected-systems`,
        method: 'GET',
        title: 'Get affected systems',
      },
      {
        rel: 'relatedThreats',
        href: `${resourcePath}/${resourceId}/related`,
        method: 'GET',
        title: 'Get related threats',
      },
      {
        rel: 'history',
        href: `${resourcePath}/${resourceId}/history`,
        method: 'GET',
        title: 'Get threat history',
      }
    );
  }

  return [...links, ...additionalLinks];
}

/**
 * Wrap response data with HATEOAS links
 *
 * @param data - Response data
 * @param resourceName - Name of the resource
 * @param resourceId - ID of the resource
 * @param baseUrl - Base URL for the API
 * @returns HATEOAS-wrapped resource
 */
export function wrapThreatResponseWithHATEOAS<T>(
  data: T,
  resourceName: string,
  resourceId: string,
  baseUrl: string = '/api/v1'
): HATEOASResource<T> {
  return {
    data,
    _links: generateThreatHATEOASLinks(resourceName, resourceId, baseUrl),
  };
}

/**
 * Wrap collection response with HATEOAS links and pagination
 *
 * @param data - Array of resources
 * @param resourceName - Name of the resource
 * @param pagination - Pagination info
 * @param baseUrl - Base URL for the API
 * @returns HATEOAS-wrapped collection
 */
export function wrapCollectionWithHATEOAS<T>(
  data: T[],
  resourceName: string,
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  },
  baseUrl: string = '/api/v1'
): {
  data: T[];
  _links: HATEOASLink[];
  _pagination: typeof pagination;
} {
  const resourcePath = `${baseUrl}/${resourceName.toLowerCase()}s`;
  const { page, limit, totalPages } = pagination;

  const links: HATEOASLink[] = [
    {
      rel: LinkRelation.SELF,
      href: `${resourcePath}?page=${page}&limit=${limit}`,
      method: 'GET',
      title: 'Current page',
    },
    {
      rel: LinkRelation.FIRST,
      href: `${resourcePath}?page=1&limit=${limit}`,
      method: 'GET',
      title: 'First page',
    },
    {
      rel: LinkRelation.LAST,
      href: `${resourcePath}?page=${totalPages}&limit=${limit}`,
      method: 'GET',
      title: 'Last page',
    },
  ];

  if (page > 1) {
    links.push({
      rel: LinkRelation.PREV,
      href: `${resourcePath}?page=${page - 1}&limit=${limit}`,
      method: 'GET',
      title: 'Previous page',
    });
  }

  if (page < totalPages) {
    links.push({
      rel: LinkRelation.NEXT,
      href: `${resourcePath}?page=${page + 1}&limit=${limit}`,
      method: 'GET',
      title: 'Next page',
    });
  }

  return {
    data,
    _links: links,
    _pagination: pagination,
  };
}

// ============================================================================
// CONVENIENCE ROUTE FACTORIES
// ============================================================================

/**
 * Create routes for ThreatIntelligence resource
 */
export const ThreatIntelligenceRoutes = createThreatRoutes({
  name: 'ThreatIntelligence',
  path: 'threats',
  idParam: 'threatId',
  enabledOperations: [
    RESTOperation.LIST,
    RESTOperation.GET,
    RESTOperation.CREATE,
    RESTOperation.UPDATE,
    RESTOperation.PATCH,
    RESTOperation.DELETE,
    RESTOperation.SEARCH,
    RESTOperation.EXPORT,
  ],
  tags: ['Threat Intelligence'],
});

/**
 * Create routes for Incident resource
 */
export const IncidentRoutes = createThreatRoutes({
  name: 'Incident',
  path: 'incidents',
  idParam: 'incidentId',
  enabledOperations: [
    RESTOperation.LIST,
    RESTOperation.GET,
    RESTOperation.CREATE,
    RESTOperation.UPDATE,
    RESTOperation.DELETE,
    RESTOperation.SEARCH,
  ],
  tags: ['Incidents'],
});

/**
 * Create routes for Vulnerability resource
 */
export const VulnerabilityRoutes = createThreatRoutes({
  name: 'Vulnerability',
  path: 'vulnerabilities',
  idParam: 'vulnerabilityId',
  enabledOperations: [
    RESTOperation.LIST,
    RESTOperation.GET,
    RESTOperation.CREATE,
    RESTOperation.UPDATE,
    RESTOperation.DELETE,
    RESTOperation.SEARCH,
  ],
  tags: ['Vulnerabilities'],
});

/**
 * Create routes for Patient resource (HIPAA compliant - no caching)
 */
export const PatientRoutes = createThreatRoutes({
  name: 'Patient',
  path: 'patients',
  idParam: 'patientId',
  enabledOperations: [
    RESTOperation.LIST,
    RESTOperation.GET,
    RESTOperation.CREATE,
    RESTOperation.UPDATE,
    RESTOperation.DELETE,
  ],
  tags: ['Healthcare', 'HIPAA'],
  security: ['bearer'], // No API key for PHI
});

/**
 * Create routes for Workflow resource
 */
export const WorkflowRoutes = createThreatRoutes({
  name: 'Workflow',
  path: 'workflows',
  idParam: 'workflowId',
  enabledOperations: [
    RESTOperation.LIST,
    RESTOperation.GET,
    RESTOperation.CREATE,
    RESTOperation.UPDATE,
    RESTOperation.PATCH,
    RESTOperation.DELETE,
  ],
  tags: ['Workflows'],
});
