/**
 * NestJS Controller Route Factories - Production-Ready Dynamic Route Generation
 *
 * Enterprise-grade route factory functions supporting:
 * - Dynamic route generation and composition
 * - RESTful API patterns and conventions
 * - HATEOAS (Hypermedia as the Engine of Application State)
 * - Resource linking and discovery
 * - OpenAPI/Swagger documentation generation
 * - Route versioning and deprecation
 * - Dynamic controller registration
 * - Nested resource routing
 * - Custom route constraints
 * - Batch operation routes
 *
 * @module controller-route-factories
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  applyDecorators,
  Type,
  HttpCode,
  HttpStatus,
  Header,
  SetMetadata,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiExtraModels,
  getSchemaPath,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * HATEOAS link relation types
 */
export enum LinkRelation {
  SELF = 'self',
  COLLECTION = 'collection',
  FIRST = 'first',
  LAST = 'last',
  NEXT = 'next',
  PREV = 'prev',
  RELATED = 'related',
  PARENT = 'parent',
  CHILD = 'child',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  SEARCH = 'search',
  EDIT = 'edit',
}

/**
 * HATEOAS link structure
 */
export interface HATEOASLink {
  rel: LinkRelation | string;
  href: string;
  method?: string;
  type?: string;
  title?: string;
  deprecated?: boolean;
}

/**
 * Resource with HATEOAS links
 */
export interface HATEOASResource<T = any> {
  data: T;
  _links: HATEOASLink[];
  _embedded?: Record<string, any>;
}

/**
 * Route configuration for factory
 */
export interface RouteConfig {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  operationId?: string;
  summary?: string;
  description?: string;
  deprecated?: boolean;
  tags?: string[];
}

/**
 * RESTful resource configuration
 */
export interface ResourceConfig {
  name: string;
  path: string;
  version?: string;
  idParam?: string;
  parent?: string;
  enabledOperations?: RESTOperation[];
}

/**
 * REST operation types
 */
export enum RESTOperation {
  LIST = 'list',
  GET = 'get',
  CREATE = 'create',
  UPDATE = 'update',
  PATCH = 'patch',
  DELETE = 'delete',
  BULK_CREATE = 'bulk_create',
  BULK_UPDATE = 'bulk_update',
  BULK_DELETE = 'bulk_delete',
  SEARCH = 'search',
  COUNT = 'count',
}

/**
 * Route metadata for documentation
 */
export interface RouteMetadata {
  resource: string;
  operation: string;
  version?: string;
  deprecated?: boolean;
  experimental?: boolean;
}

/**
 * Dynamic controller options
 */
export interface DynamicControllerOptions {
  name: string;
  path: string;
  version?: string;
  tags?: string[];
  description?: string;
}

// ============================================================================
// 1. Basic Route Factories
// ============================================================================

/**
 * Creates a standardized GET route decorator with full documentation.
 * Combines HTTP method, status code, and OpenAPI documentation.
 *
 * @param path - Route path or path segments
 * @param summary - OpenAPI operation summary
 * @param description - Detailed operation description
 * @returns Combined method decorator
 *
 * @example
 * ```typescript
 * @createGetRoute('users', 'List all users', 'Retrieves paginated list of users')
 * async findAll(@Query() query: PaginationDto) {
 *   return this.service.findAll(query);
 * }
 * ```
 */
export function createGetRoute(
  path: string | string[],
  summary: string,
  description?: string,
): MethodDecorator {
  return applyDecorators(
    Get(path),
    HttpCode(HttpStatus.OK),
    ApiOperation({ summary, description }),
    ApiResponse({ status: 200, description: 'Request processed successfully' }),
    ApiResponse({ status: 400, description: 'Bad request - invalid parameters' }),
    ApiResponse({ status: 500, description: 'Internal server error' }),
  );
}

/**
 * Creates a standardized POST route decorator for resource creation.
 *
 * @param path - Route path or path segments
 * @param summary - OpenAPI operation summary
 * @param description - Detailed operation description
 * @returns Combined method decorator
 *
 * @example
 * ```typescript
 * @createPostRoute('users', 'Create new user')
 * async create(@Body() createDto: CreateUserDto) {
 *   return this.service.create(createDto);
 * }
 * ```
 */
export function createPostRoute(
  path: string | string[],
  summary: string,
  description?: string,
): MethodDecorator {
  return applyDecorators(
    Post(path),
    HttpCode(HttpStatus.CREATED),
    ApiOperation({ summary, description }),
    ApiCreatedResponse({ description: 'Resource created successfully' }),
    ApiResponse({ status: 400, description: 'Bad request - validation failed' }),
    ApiResponse({ status: 409, description: 'Conflict - resource already exists' }),
    ApiResponse({ status: 500, description: 'Internal server error' }),
  );
}

/**
 * Creates a standardized PUT route decorator for full resource updates.
 *
 * @param path - Route path with ID parameter
 * @param summary - OpenAPI operation summary
 * @param description - Detailed operation description
 * @returns Combined method decorator
 *
 * @example
 * ```typescript
 * @createPutRoute(':id', 'Update user')
 * async update(@Param('id') id: string, @Body() updateDto: UpdateUserDto) {
 *   return this.service.update(id, updateDto);
 * }
 * ```
 */
export function createPutRoute(
  path: string | string[],
  summary: string,
  description?: string,
): MethodDecorator {
  return applyDecorators(
    Put(path),
    HttpCode(HttpStatus.OK),
    ApiOperation({ summary, description }),
    ApiOkResponse({ description: 'Resource updated successfully' }),
    ApiResponse({ status: 400, description: 'Bad request - validation failed' }),
    ApiResponse({ status: 404, description: 'Resource not found' }),
    ApiResponse({ status: 500, description: 'Internal server error' }),
  );
}

/**
 * Creates a standardized PATCH route decorator for partial updates.
 *
 * @param path - Route path with ID parameter
 * @param summary - OpenAPI operation summary
 * @param description - Detailed operation description
 * @returns Combined method decorator
 *
 * @example
 * ```typescript
 * @createPatchRoute(':id', 'Partially update user')
 * async patch(@Param('id') id: string, @Body() patchDto: PatchUserDto) {
 *   return this.service.patch(id, patchDto);
 * }
 * ```
 */
export function createPatchRoute(
  path: string | string[],
  summary: string,
  description?: string,
): MethodDecorator {
  return applyDecorators(
    Patch(path),
    HttpCode(HttpStatus.OK),
    ApiOperation({ summary, description }),
    ApiOkResponse({ description: 'Resource partially updated successfully' }),
    ApiResponse({ status: 400, description: 'Bad request - validation failed' }),
    ApiResponse({ status: 404, description: 'Resource not found' }),
    ApiResponse({ status: 500, description: 'Internal server error' }),
  );
}

/**
 * Creates a standardized DELETE route decorator.
 *
 * @param path - Route path with ID parameter
 * @param summary - OpenAPI operation summary
 * @param description - Detailed operation description
 * @returns Combined method decorator
 *
 * @example
 * ```typescript
 * @createDeleteRoute(':id', 'Delete user')
 * async remove(@Param('id') id: string) {
 *   await this.service.remove(id);
 * }
 * ```
 */
export function createDeleteRoute(
  path: string | string[],
  summary: string,
  description?: string,
): MethodDecorator {
  return applyDecorators(
    Delete(path),
    HttpCode(HttpStatus.NO_CONTENT),
    ApiOperation({ summary, description }),
    ApiResponse({ status: 204, description: 'Resource deleted successfully' }),
    ApiResponse({ status: 404, description: 'Resource not found' }),
    ApiResponse({ status: 409, description: 'Conflict - resource has dependencies' }),
    ApiResponse({ status: 500, description: 'Internal server error' }),
  );
}

// ============================================================================
// 2. RESTful Resource Route Factories
// ============================================================================

/**
 * Creates a complete set of RESTful routes for a resource.
 * Generates standard CRUD endpoints following REST conventions.
 *
 * @param config - Resource configuration
 * @returns Object containing all route decorators
 *
 * @example
 * ```typescript
 * const routes = createRESTfulRoutes({
 *   name: 'User',
 *   path: 'users',
 *   idParam: 'userId'
 * });
 *
 * class UsersController {
 *   @routes.list
 *   findAll() { ... }
 *
 *   @routes.get
 *   findOne(@Param('userId') id: string) { ... }
 * }
 * ```
 */
export function createRESTfulRoutes(config: ResourceConfig): Record<string, MethodDecorator> {
  const { name, path, idParam = 'id', enabledOperations } = config;
  const routes: Record<string, MethodDecorator> = {};

  const isEnabled = (op: RESTOperation) =>
    !enabledOperations || enabledOperations.includes(op);

  if (isEnabled(RESTOperation.LIST)) {
    routes.list = createGetRoute('', `List all ${name}s`, `Retrieves paginated list of ${name}s`);
  }

  if (isEnabled(RESTOperation.GET)) {
    routes.get = createGetRoute(`:${idParam}`, `Get ${name} by ID`, `Retrieves a single ${name}`);
  }

  if (isEnabled(RESTOperation.CREATE)) {
    routes.create = createPostRoute('', `Create ${name}`, `Creates a new ${name}`);
  }

  if (isEnabled(RESTOperation.UPDATE)) {
    routes.update = createPutRoute(`:${idParam}`, `Update ${name}`, `Updates an existing ${name}`);
  }

  if (isEnabled(RESTOperation.PATCH)) {
    routes.patch = createPatchRoute(
      `:${idParam}`,
      `Partially update ${name}`,
      `Partially updates a ${name}`,
    );
  }

  if (isEnabled(RESTOperation.DELETE)) {
    routes.delete = createDeleteRoute(`:${idParam}`, `Delete ${name}`, `Deletes a ${name}`);
  }

  return routes;
}

/**
 * Creates nested resource routes for parent-child relationships.
 *
 * @param parentResource - Parent resource name
 * @param childResource - Child resource name
 * @param parentIdParam - Parent ID parameter name
 * @param childIdParam - Child ID parameter name
 * @returns Object containing nested route decorators
 *
 * @example
 * ```typescript
 * const routes = createNestedResourceRoutes('user', 'post', 'userId', 'postId');
 *
 * @routes.listChildren
 * findUserPosts(@Param('userId') userId: string) { ... }
 * ```
 */
export function createNestedResourceRoutes(
  parentResource: string,
  childResource: string,
  parentIdParam: string = `${parentResource}Id`,
  childIdParam: string = `${childResource}Id`,
): Record<string, MethodDecorator> {
  return {
    listChildren: createGetRoute(
      `:${parentIdParam}/${childResource}s`,
      `List ${childResource}s for ${parentResource}`,
      `Retrieves all ${childResource}s belonging to a specific ${parentResource}`,
    ),
    getChild: createGetRoute(
      `:${parentIdParam}/${childResource}s/:${childIdParam}`,
      `Get ${childResource} of ${parentResource}`,
      `Retrieves a specific ${childResource} belonging to a ${parentResource}`,
    ),
    createChild: createPostRoute(
      `:${parentIdParam}/${childResource}s`,
      `Create ${childResource} for ${parentResource}`,
      `Creates a new ${childResource} under a specific ${parentResource}`,
    ),
    updateChild: createPutRoute(
      `:${parentIdParam}/${childResource}s/:${childIdParam}`,
      `Update ${childResource} of ${parentResource}`,
      `Updates a ${childResource} belonging to a ${parentResource}`,
    ),
    deleteChild: createDeleteRoute(
      `:${parentIdParam}/${childResource}s/:${childIdParam}`,
      `Delete ${childResource} of ${parentResource}`,
      `Deletes a ${childResource} from a ${parentResource}`,
    ),
  };
}

/**
 * Creates bulk operation routes for resources.
 *
 * @param resourceName - Name of the resource
 * @returns Object containing bulk operation decorators
 *
 * @example
 * ```typescript
 * const routes = createBulkOperationRoutes('User');
 *
 * @routes.bulkCreate
 * createMany(@Body() items: CreateUserDto[]) { ... }
 * ```
 */
export function createBulkOperationRoutes(resourceName: string): Record<string, MethodDecorator> {
  return {
    bulkCreate: createPostRoute(
      'bulk',
      `Bulk create ${resourceName}s`,
      `Creates multiple ${resourceName}s in a single request`,
    ),
    bulkUpdate: createPutRoute(
      'bulk',
      `Bulk update ${resourceName}s`,
      `Updates multiple ${resourceName}s in a single request`,
    ),
    bulkDelete: applyDecorators(
      Delete('bulk'),
      HttpCode(HttpStatus.OK),
      ApiOperation({
        summary: `Bulk delete ${resourceName}s`,
        description: `Deletes multiple ${resourceName}s in a single request`,
      }),
      ApiOkResponse({ description: 'Resources deleted successfully' }),
    ),
  };
}

/**
 * Creates search and filter routes for resources.
 *
 * @param resourceName - Name of the resource
 * @returns Object containing search route decorators
 *
 * @example
 * ```typescript
 * const routes = createSearchRoutes('User');
 *
 * @routes.search
 * search(@Query('q') query: string) { ... }
 * ```
 */
export function createSearchRoutes(resourceName: string): Record<string, MethodDecorator> {
  return {
    search: applyDecorators(
      Get('search'),
      HttpCode(HttpStatus.OK),
      ApiOperation({
        summary: `Search ${resourceName}s`,
        description: `Performs full-text search across ${resourceName}s`,
      }),
      ApiQuery({ name: 'q', required: true, description: 'Search query' }),
      ApiOkResponse({ description: 'Search results retrieved successfully' }),
    ),
    advancedSearch: applyDecorators(
      Post('search'),
      HttpCode(HttpStatus.OK),
      ApiOperation({
        summary: `Advanced search ${resourceName}s`,
        description: `Performs advanced search with complex criteria`,
      }),
      ApiOkResponse({ description: 'Search results retrieved successfully' }),
    ),
    count: applyDecorators(
      Get('count'),
      HttpCode(HttpStatus.OK),
      ApiOperation({
        summary: `Count ${resourceName}s`,
        description: `Returns the total count of ${resourceName}s matching criteria`,
      }),
      ApiOkResponse({ description: 'Count retrieved successfully' }),
    ),
  };
}

// ============================================================================
// 3. HATEOAS Link Generators
// ============================================================================

/**
 * Generates HATEOAS links for a resource.
 *
 * @param resource - Resource data
 * @param resourceName - Name of the resource type
 * @param baseUrl - Base URL for the API
 * @param id - Resource ID
 * @returns Array of HATEOAS links
 *
 * @example
 * ```typescript
 * const user = await this.service.findOne(id);
 * const links = generateResourceLinks(user, 'users', 'https://api.example.com', id);
 * return { ...user, _links: links };
 * ```
 */
export function generateResourceLinks(
  resource: any,
  resourceName: string,
  baseUrl: string,
  id: string | number,
): HATEOASLink[] {
  const resourceUrl = `${baseUrl}/${resourceName}/${id}`;

  return [
    {
      rel: LinkRelation.SELF,
      href: resourceUrl,
      method: 'GET',
      type: 'application/json',
    },
    {
      rel: LinkRelation.COLLECTION,
      href: `${baseUrl}/${resourceName}`,
      method: 'GET',
      type: 'application/json',
    },
    {
      rel: LinkRelation.UPDATE,
      href: resourceUrl,
      method: 'PUT',
      type: 'application/json',
    },
    {
      rel: LinkRelation.DELETE,
      href: resourceUrl,
      method: 'DELETE',
    },
  ];
}

/**
 * Generates paginated collection links with navigation.
 *
 * @param baseUrl - Base URL for the collection
 * @param page - Current page number
 * @param limit - Items per page
 * @param total - Total number of items
 * @returns Array of pagination links
 *
 * @example
 * ```typescript
 * const links = generatePaginationLinks('/api/users', 2, 10, 45);
 * // Returns links for: first, prev, self, next, last
 * ```
 */
export function generatePaginationLinks(
  baseUrl: string,
  page: number,
  limit: number,
  total: number,
): HATEOASLink[] {
  const totalPages = Math.ceil(total / limit);
  const links: HATEOASLink[] = [];

  // Self link
  links.push({
    rel: LinkRelation.SELF,
    href: `${baseUrl}?page=${page}&limit=${limit}`,
    method: 'GET',
  });

  // First page link
  if (page > 1) {
    links.push({
      rel: LinkRelation.FIRST,
      href: `${baseUrl}?page=1&limit=${limit}`,
      method: 'GET',
    });
  }

  // Previous page link
  if (page > 1) {
    links.push({
      rel: LinkRelation.PREV,
      href: `${baseUrl}?page=${page - 1}&limit=${limit}`,
      method: 'GET',
    });
  }

  // Next page link
  if (page < totalPages) {
    links.push({
      rel: LinkRelation.NEXT,
      href: `${baseUrl}?page=${page + 1}&limit=${limit}`,
      method: 'GET',
    });
  }

  // Last page link
  if (page < totalPages) {
    links.push({
      rel: LinkRelation.LAST,
      href: `${baseUrl}?page=${totalPages}&limit=${limit}`,
      method: 'GET',
    });
  }

  return links;
}

/**
 * Wraps resource data with HATEOAS links.
 *
 * @param data - Resource data
 * @param links - Array of HATEOAS links
 * @param embedded - Optional embedded resources
 * @returns HATEOAS-compliant resource
 *
 * @example
 * ```typescript
 * const user = await this.service.findOne(id);
 * const links = generateResourceLinks(user, 'users', baseUrl, id);
 * return wrapWithHATEOAS(user, links);
 * ```
 */
export function wrapWithHATEOAS<T>(
  data: T,
  links: HATEOASLink[],
  embedded?: Record<string, any>,
): HATEOASResource<T> {
  const resource: HATEOASResource<T> = {
    data,
    _links: links,
  };

  if (embedded && Object.keys(embedded).length > 0) {
    resource._embedded = embedded;
  }

  return resource;
}

/**
 * Generates links for related resources.
 *
 * @param parentUrl - Parent resource URL
 * @param relations - Map of relation names to their configurations
 * @returns Array of related resource links
 *
 * @example
 * ```typescript
 * const links = generateRelatedResourceLinks('/api/users/123', {
 *   posts: { path: 'posts', count: 5 },
 *   comments: { path: 'comments', count: 12 }
 * });
 * ```
 */
export function generateRelatedResourceLinks(
  parentUrl: string,
  relations: Record<string, { path: string; count?: number }>,
): HATEOASLink[] {
  return Object.entries(relations).map(([name, config]) => ({
    rel: LinkRelation.RELATED,
    href: `${parentUrl}/${config.path}`,
    method: 'GET',
    type: 'application/json',
    title: name,
    ...(config.count !== undefined && { count: config.count }),
  }));
}

/**
 * Generates action links for a resource.
 *
 * @param resourceUrl - Resource URL
 * @param actions - Map of action names to HTTP methods
 * @returns Array of action links
 *
 * @example
 * ```typescript
 * const links = generateActionLinks('/api/users/123', {
 *   activate: 'POST',
 *   deactivate: 'POST',
 *   resetPassword: 'POST'
 * });
 * ```
 */
export function generateActionLinks(
  resourceUrl: string,
  actions: Record<string, string>,
): HATEOASLink[] {
  return Object.entries(actions).map(([action, method]) => ({
    rel: action,
    href: `${resourceUrl}/${action}`,
    method,
    type: 'application/json',
  }));
}

// ============================================================================
// 4. Route Versioning
// ============================================================================

/**
 * Creates versioned route decorator.
 *
 * @param version - API version (e.g., 'v1', 'v2')
 * @param path - Route path
 * @param method - HTTP method
 * @param summary - OpenAPI operation summary
 * @returns Versioned route decorator
 *
 * @example
 * ```typescript
 * @createVersionedRoute('v1', 'users', 'GET', 'List users (v1)')
 * findAllV1() { ... }
 *
 * @createVersionedRoute('v2', 'users', 'GET', 'List users (v2)')
 * findAllV2() { ... }
 * ```
 */
export function createVersionedRoute(
  version: string,
  path: string,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  summary: string,
): MethodDecorator {
  const methodDecorators: Record<string, any> = {
    GET: Get,
    POST: Post,
    PUT: Put,
    PATCH: Patch,
    DELETE: Delete,
  };

  return applyDecorators(
    methodDecorators[method](path),
    SetMetadata('version', version),
    Header('X-API-Version', version),
    ApiOperation({ summary }),
    ApiTags(version),
  );
}

/**
 * Creates deprecated route with migration information.
 *
 * @param path - Route path
 * @param method - HTTP method
 * @param deprecatedSince - Version when deprecated
 * @param removeInVersion - Version when it will be removed
 * @param migrateTo - New endpoint to use
 * @returns Deprecated route decorator
 *
 * @example
 * ```typescript
 * @createDeprecatedRoute('old-users', 'GET', 'v1.5', 'v2.0', '/api/v2/users')
 * oldFindAll() { ... }
 * ```
 */
export function createDeprecatedRoute(
  path: string,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  deprecatedSince: string,
  removeInVersion: string,
  migrateTo?: string,
): MethodDecorator {
  const methodDecorators: Record<string, any> = {
    GET: Get,
    POST: Post,
    PUT: Put,
    PATCH: Patch,
    DELETE: Delete,
  };

  const headers: any[] = [
    Header('X-Deprecated', 'true'),
    Header('X-Deprecated-Since', deprecatedSince),
    Header('X-Remove-In-Version', removeInVersion),
  ];

  if (migrateTo) {
    headers.push(Header('X-Migrate-To', migrateTo));
  }

  return applyDecorators(
    methodDecorators[method](path),
    ApiOperation({
      deprecated: true,
      summary: `DEPRECATED: Will be removed in ${removeInVersion}`,
      description: `This endpoint is deprecated since ${deprecatedSince}. ${migrateTo ? `Please use ${migrateTo} instead.` : ''}`,
    }),
    ...headers,
  );
}

/**
 * Creates experimental/beta route decorator.
 *
 * @param path - Route path
 * @param method - HTTP method
 * @param summary - OpenAPI operation summary
 * @returns Experimental route decorator
 *
 * @example
 * ```typescript
 * @createExperimentalRoute('beta-feature', 'POST', 'New experimental feature')
 * betaFeature() { ... }
 * ```
 */
export function createExperimentalRoute(
  path: string,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  summary: string,
): MethodDecorator {
  const methodDecorators: Record<string, any> = {
    GET: Get,
    POST: Post,
    PUT: Put,
    PATCH: Patch,
    DELETE: Delete,
  };

  return applyDecorators(
    methodDecorators[method](path),
    Header('X-Experimental', 'true'),
    Header('X-Stability', 'beta'),
    ApiOperation({
      summary: `[EXPERIMENTAL] ${summary}`,
      description: 'This endpoint is experimental and may change without notice.',
    }),
    ApiResponse({ status: 200, description: 'Experimental feature response' }),
  );
}

// ============================================================================
// 5. Custom Route Patterns
// ============================================================================

/**
 * Creates health check route decorator.
 *
 * @param detailed - Whether to include detailed health information
 * @returns Health check route decorator
 *
 * @example
 * ```typescript
 * @createHealthCheckRoute(true)
 * healthCheck() {
 *   return { status: 'ok', timestamp: new Date(), services: {...} };
 * }
 * ```
 */
export function createHealthCheckRoute(detailed: boolean = false): MethodDecorator {
  return applyDecorators(
    Get(detailed ? 'health/detailed' : 'health'),
    HttpCode(HttpStatus.OK),
    ApiOperation({
      summary: detailed ? 'Detailed health check' : 'Health check',
      description: detailed
        ? 'Returns detailed health status including all service dependencies'
        : 'Returns basic health status',
    }),
    ApiOkResponse({
      description: 'Service is healthy',
      schema: {
        properties: {
          status: { type: 'string', example: 'ok' },
          timestamp: { type: 'string', format: 'date-time' },
          ...(detailed && {
            services: { type: 'object', additionalProperties: { type: 'object' } },
          }),
        },
      },
    }),
    ApiResponse({ status: 503, description: 'Service unavailable' }),
  );
}

/**
 * Creates metrics endpoint route decorator.
 *
 * @param metricsType - Type of metrics to expose
 * @returns Metrics route decorator
 *
 * @example
 * ```typescript
 * @createMetricsRoute('prometheus')
 * metrics() {
 *   return this.metricsService.getPrometheusMetrics();
 * }
 * ```
 */
export function createMetricsRoute(metricsType: 'json' | 'prometheus' = 'json'): MethodDecorator {
  return applyDecorators(
    Get('metrics'),
    HttpCode(HttpStatus.OK),
    Header('Content-Type', metricsType === 'prometheus' ? 'text/plain' : 'application/json'),
    ApiOperation({
      summary: 'Application metrics',
      description: `Returns application metrics in ${metricsType} format`,
    }),
    ApiOkResponse({ description: 'Metrics retrieved successfully' }),
  );
}

/**
 * Creates webhook receiver route decorator.
 *
 * @param webhookName - Name of the webhook
 * @param requireSignature - Whether signature validation is required
 * @returns Webhook route decorator
 *
 * @example
 * ```typescript
 * @createWebhookRoute('github-push', true)
 * handleGithubPush(@Body() payload: any, @Headers('x-hub-signature') signature: string) {
 *   return this.webhookService.processGithubPush(payload, signature);
 * }
 * ```
 */
export function createWebhookRoute(
  webhookName: string,
  requireSignature: boolean = true,
): MethodDecorator {
  return applyDecorators(
    Post(`webhooks/${webhookName}`),
    HttpCode(HttpStatus.OK),
    ApiOperation({
      summary: `${webhookName} webhook`,
      description: `Receives and processes ${webhookName} webhook events`,
    }),
    ApiResponse({ status: 200, description: 'Webhook processed successfully' }),
    ApiResponse({ status: 400, description: 'Invalid webhook payload' }),
    ...(requireSignature
      ? [ApiResponse({ status: 401, description: 'Invalid webhook signature' })]
      : []),
  );
}

/**
 * Creates file upload route decorator with multipart support.
 *
 * @param fieldName - Name of the file field
 * @param multiple - Whether multiple files are allowed
 * @returns File upload route decorator
 *
 * @example
 * ```typescript
 * @createFileUploadRoute('avatar', false)
 * uploadAvatar(@UploadedFile() file: Express.Multer.File) {
 *   return this.storageService.saveFile(file);
 * }
 * ```
 */
export function createFileUploadRoute(
  fieldName: string = 'file',
  multiple: boolean = false,
): MethodDecorator {
  return applyDecorators(
    Post('upload'),
    HttpCode(HttpStatus.CREATED),
    ApiOperation({
      summary: multiple ? 'Upload multiple files' : 'Upload file',
      description: `Upload ${multiple ? 'multiple files' : 'a file'} to the server`,
    }),
    ApiCreatedResponse({ description: 'File(s) uploaded successfully' }),
    ApiResponse({ status: 400, description: 'Invalid file or file type not allowed' }),
    ApiResponse({ status: 413, description: 'File too large' }),
  );
}

/**
 * Creates file download route decorator.
 *
 * @param inline - Whether to display inline or force download
 * @returns File download route decorator
 *
 * @example
 * ```typescript
 * @createFileDownloadRoute(false)
 * downloadFile(@Param('fileId') fileId: string) {
 *   return this.storageService.getFile(fileId);
 * }
 * ```
 */
export function createFileDownloadRoute(inline: boolean = false): MethodDecorator {
  return applyDecorators(
    Get(':fileId/download'),
    HttpCode(HttpStatus.OK),
    Header('Content-Disposition', inline ? 'inline' : 'attachment'),
    ApiOperation({
      summary: inline ? 'View file' : 'Download file',
      description: `${inline ? 'Displays' : 'Downloads'} file from the server`,
    }),
    ApiParam({ name: 'fileId', description: 'File identifier' }),
    ApiOkResponse({ description: 'File retrieved successfully' }),
    ApiResponse({ status: 404, description: 'File not found' }),
  );
}

/**
 * Creates export route decorator for data export.
 *
 * @param format - Export format (csv, json, excel)
 * @param resourceName - Name of the resource being exported
 * @returns Export route decorator
 *
 * @example
 * ```typescript
 * @createExportRoute('csv', 'users')
 * exportUsers(@Query() filters: FilterDto) {
 *   return this.exportService.exportToCSV(filters);
 * }
 * ```
 */
export function createExportRoute(
  format: 'csv' | 'json' | 'excel',
  resourceName: string,
): MethodDecorator {
  const contentTypes: Record<string, string> = {
    csv: 'text/csv',
    json: 'application/json',
    excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  };

  return applyDecorators(
    Get(`export/${format}`),
    HttpCode(HttpStatus.OK),
    Header('Content-Type', contentTypes[format]),
    Header('Content-Disposition', `attachment; filename="${resourceName}.${format}"`),
    ApiOperation({
      summary: `Export ${resourceName} as ${format.toUpperCase()}`,
      description: `Exports ${resourceName} data in ${format.toUpperCase()} format`,
    }),
    ApiOkResponse({ description: 'Data exported successfully' }),
  );
}

/**
 * Creates import route decorator for data import.
 *
 * @param format - Import format (csv, json, excel)
 * @param resourceName - Name of the resource being imported
 * @returns Import route decorator
 *
 * @example
 * ```typescript
 * @createImportRoute('csv', 'users')
 * importUsers(@UploadedFile() file: Express.Multer.File) {
 *   return this.importService.importFromCSV(file);
 * }
 * ```
 */
export function createImportRoute(
  format: 'csv' | 'json' | 'excel',
  resourceName: string,
): MethodDecorator {
  return applyDecorators(
    Post(`import/${format}`),
    HttpCode(HttpStatus.CREATED),
    ApiOperation({
      summary: `Import ${resourceName} from ${format.toUpperCase()}`,
      description: `Imports ${resourceName} data from ${format.toUpperCase()} file`,
    }),
    ApiCreatedResponse({
      description: 'Data imported successfully',
      schema: {
        properties: {
          imported: { type: 'number' },
          failed: { type: 'number' },
          errors: { type: 'array', items: { type: 'object' } },
        },
      },
    }),
    ApiResponse({ status: 400, description: 'Invalid file format or data' }),
  );
}

// ============================================================================
// 6. Advanced Route Composition
// ============================================================================

/**
 * Composes multiple route decorators into a single decorator.
 *
 * @param decorators - Array of decorators to compose
 * @returns Composed decorator
 *
 * @example
 * ```typescript
 * const customRoute = composeRouteDecorators([
 *   Get('custom'),
 *   UseGuards(AuthGuard),
 *   UsePipes(ValidationPipe)
 * ]);
 *
 * @customRoute
 * customEndpoint() { ... }
 * ```
 */
export function composeRouteDecorators(
  decorators: Array<MethodDecorator | ClassDecorator>,
): MethodDecorator {
  return applyDecorators(...decorators);
}

/**
 * Creates authenticated route decorator with role requirements.
 *
 * @param path - Route path
 * @param method - HTTP method
 * @param roles - Required roles
 * @param summary - OpenAPI operation summary
 * @returns Authenticated route decorator
 *
 * @example
 * ```typescript
 * @createAuthenticatedRoute('admin/users', 'GET', ['admin'], 'List users (admin only)')
 * adminFindAll() { ... }
 * ```
 */
export function createAuthenticatedRoute(
  path: string,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  roles: string[],
  summary: string,
): MethodDecorator {
  const methodDecorators: Record<string, any> = {
    GET: Get,
    POST: Post,
    PUT: Put,
    PATCH: Patch,
    DELETE: Delete,
  };

  return applyDecorators(
    methodDecorators[method](path),
    SetMetadata('roles', roles),
    ApiOperation({ summary }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' }),
  );
}

/**
 * Creates cached route decorator with TTL.
 *
 * @param path - Route path
 * @param ttl - Cache TTL in seconds
 * @param summary - OpenAPI operation summary
 * @returns Cached route decorator
 *
 * @example
 * ```typescript
 * @createCachedRoute('popular-posts', 300, 'Get popular posts (cached)')
 * getPopularPosts() { ... }
 * ```
 */
export function createCachedRoute(path: string, ttl: number, summary: string): MethodDecorator {
  return applyDecorators(
    Get(path),
    HttpCode(HttpStatus.OK),
    Header('Cache-Control', `public, max-age=${ttl}`),
    ApiOperation({ summary, description: `Cached for ${ttl} seconds` }),
    ApiOkResponse({ description: 'Data retrieved successfully (may be cached)' }),
  );
}

/**
 * Creates rate-limited route decorator.
 *
 * @param path - Route path
 * @param method - HTTP method
 * @param limit - Maximum requests per time window
 * @param ttl - Time window in seconds
 * @param summary - OpenAPI operation summary
 * @returns Rate-limited route decorator
 *
 * @example
 * ```typescript
 * @createRateLimitedRoute('send-email', 'POST', 10, 60, 'Send email (rate limited)')
 * sendEmail(@Body() emailDto: SendEmailDto) { ... }
 * ```
 */
export function createRateLimitedRoute(
  path: string,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  limit: number,
  ttl: number,
  summary: string,
): MethodDecorator {
  const methodDecorators: Record<string, any> = {
    GET: Get,
    POST: Post,
    PUT: Put,
    PATCH: Patch,
    DELETE: Delete,
  };

  return applyDecorators(
    methodDecorators[method](path),
    SetMetadata('rateLimit', { limit, ttl }),
    ApiOperation({
      summary,
      description: `Rate limited to ${limit} requests per ${ttl} seconds`,
    }),
    ApiResponse({ status: 429, description: 'Too many requests - rate limit exceeded' }),
  );
}

/**
 * Creates paginated route decorator with query parameters.
 *
 * @param path - Route path
 * @param summary - OpenAPI operation summary
 * @param defaultLimit - Default page size
 * @param maxLimit - Maximum page size
 * @returns Paginated route decorator
 *
 * @example
 * ```typescript
 * @createPaginatedRoute('users', 'List users with pagination', 10, 100)
 * findAll(@Query('page') page: number, @Query('limit') limit: number) { ... }
 * ```
 */
export function createPaginatedRoute(
  path: string,
  summary: string,
  defaultLimit: number = 10,
  maxLimit: number = 100,
): MethodDecorator {
  return applyDecorators(
    Get(path),
    HttpCode(HttpStatus.OK),
    ApiOperation({ summary }),
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: 'Page number (default: 1)',
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: `Items per page (default: ${defaultLimit}, max: ${maxLimit})`,
    }),
    ApiOkResponse({
      description: 'Paginated results retrieved successfully',
      schema: {
        properties: {
          data: { type: 'array', items: { type: 'object' } },
          meta: {
            type: 'object',
            properties: {
              page: { type: 'number' },
              limit: { type: 'number' },
              total: { type: 'number' },
              totalPages: { type: 'number' },
            },
          },
        },
      },
    }),
  );
}

/**
 * Creates sorted route decorator with query parameters.
 *
 * @param path - Route path
 * @param summary - OpenAPI operation summary
 * @param allowedFields - Fields that can be used for sorting
 * @returns Sorted route decorator
 *
 * @example
 * ```typescript
 * @createSortedRoute('users', 'List users with sorting', ['name', 'email', 'createdAt'])
 * findAll(@Query('sort') sort: string) { ... }
 * ```
 */
export function createSortedRoute(
  path: string,
  summary: string,
  allowedFields: string[],
): MethodDecorator {
  return applyDecorators(
    Get(path),
    HttpCode(HttpStatus.OK),
    ApiOperation({ summary }),
    ApiQuery({
      name: 'sort',
      required: false,
      type: String,
      description: `Sort format: field:order (e.g., name:asc). Allowed fields: ${allowedFields.join(', ')}`,
    }),
    ApiOkResponse({ description: 'Sorted results retrieved successfully' }),
  );
}

/**
 * Creates filtered route decorator with query parameters.
 *
 * @param path - Route path
 * @param summary - OpenAPI operation summary
 * @param filterableFields - Fields that can be filtered
 * @returns Filtered route decorator
 *
 * @example
 * ```typescript
 * @createFilteredRoute('users', 'List users with filters', ['status', 'role', 'department'])
 * findAll(@Query() filters: any) { ... }
 * ```
 */
export function createFilteredRoute(
  path: string,
  summary: string,
  filterableFields: string[],
): MethodDecorator {
  return applyDecorators(
    Get(path),
    HttpCode(HttpStatus.OK),
    ApiOperation({
      summary,
      description: `Filterable fields: ${filterableFields.join(', ')}. Use operators like field[eq]=value, field[like]=%value%`,
    }),
    ApiOkResponse({ description: 'Filtered results retrieved successfully' }),
  );
}

/**
 * Creates batch processing route decorator.
 *
 * @param resourceName - Name of the resource
 * @param operation - Batch operation type
 * @returns Batch processing route decorator
 *
 * @example
 * ```typescript
 * @createBatchRoute('users', 'update')
 * batchUpdate(@Body() updates: BatchUpdateDto[]) { ... }
 * ```
 */
export function createBatchRoute(
  resourceName: string,
  operation: 'create' | 'update' | 'delete',
): MethodDecorator {
  const methodMap = {
    create: Post,
    update: Put,
    delete: Delete,
  };

  return applyDecorators(
    methodMap[operation]('batch'),
    HttpCode(operation === 'create' ? HttpStatus.CREATED : HttpStatus.OK),
    ApiOperation({
      summary: `Batch ${operation} ${resourceName}s`,
      description: `Performs ${operation} operation on multiple ${resourceName}s`,
    }),
    ApiResponse({
      status: operation === 'create' ? 201 : 200,
      description: 'Batch operation completed',
      schema: {
        properties: {
          successful: { type: 'array', items: { type: 'object' } },
          failed: { type: 'array', items: { type: 'object' } },
          summary: {
            type: 'object',
            properties: {
              total: { type: 'number' },
              successCount: { type: 'number' },
              failureCount: { type: 'number' },
            },
          },
        },
      },
    }),
  );
}

/**
 * Creates async job route decorator for long-running operations.
 *
 * @param path - Route path
 * @param jobName - Name of the async job
 * @returns Async job route decorator
 *
 * @example
 * ```typescript
 * @createAsyncJobRoute('process-large-dataset', 'data-processing')
 * processData(@Body() data: ProcessDto) {
 *   const jobId = await this.queueService.addJob(data);
 *   return { jobId, status: 'queued' };
 * }
 * ```
 */
export function createAsyncJobRoute(path: string, jobName: string): MethodDecorator {
  return applyDecorators(
    Post(path),
    HttpCode(HttpStatus.ACCEPTED),
    ApiOperation({
      summary: `Start ${jobName} job`,
      description: `Initiates an asynchronous ${jobName} job and returns job ID`,
    }),
    ApiResponse({
      status: 202,
      description: 'Job accepted and queued',
      schema: {
        properties: {
          jobId: { type: 'string' },
          status: { type: 'string', example: 'queued' },
          estimatedDuration: { type: 'number' },
        },
      },
    }),
  );
}

/**
 * Creates job status route decorator.
 *
 * @returns Job status route decorator
 *
 * @example
 * ```typescript
 * @createJobStatusRoute()
 * getJobStatus(@Param('jobId') jobId: string) {
 *   return this.queueService.getJobStatus(jobId);
 * }
 * ```
 */
export function createJobStatusRoute(): MethodDecorator {
  return applyDecorators(
    Get('jobs/:jobId'),
    HttpCode(HttpStatus.OK),
    ApiOperation({
      summary: 'Get job status',
      description: 'Retrieves the current status of an asynchronous job',
    }),
    ApiParam({ name: 'jobId', description: 'Job identifier' }),
    ApiOkResponse({
      description: 'Job status retrieved successfully',
      schema: {
        properties: {
          jobId: { type: 'string' },
          status: { type: 'string', enum: ['queued', 'processing', 'completed', 'failed'] },
          progress: { type: 'number', minimum: 0, maximum: 100 },
          result: { type: 'object' },
          error: { type: 'string' },
        },
      },
    }),
  );
}

/**
 * Generates comprehensive API documentation metadata for a controller.
 *
 * @param name - Controller name
 * @param description - Controller description
 * @param version - API version
 * @param tags - OpenAPI tags
 * @returns Controller decorator with full documentation
 *
 * @example
 * ```typescript
 * @generateControllerMetadata('Users', 'User management endpoints', 'v1', ['users', 'authentication'])
 * export class UsersController { ... }
 * ```
 */
export function generateControllerMetadata(
  name: string,
  description: string,
  version?: string,
  tags?: string[],
): ClassDecorator {
  const decorators: Array<ClassDecorator> = [
    Controller(version ? `${version}/${name.toLowerCase()}` : name.toLowerCase()),
    ApiTags(...(tags || [name])),
  ];

  if (version) {
    decorators.push(SetMetadata('version', version) as ClassDecorator);
  }

  return applyDecorators(...decorators);
}
