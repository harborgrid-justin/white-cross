/**
 * Swagger/OpenAPI Endpoint Documentation
 *
 * Production-ready TypeScript utilities for operation builders,
 * tags, examples, callbacks, and webhooks documentation.
 * Compliant with OpenAPI 3.0/3.1 endpoint specifications.
 *
 * @module swagger-endpoint-documentation
 * @version 1.0.0
 */

import { Type, applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiExtension,
  ApiExtraModels,
  getSchemaPath,
  ApiResponse,
  ApiProduces,
  ApiConsumes,
} from '@nestjs/swagger';

/**
 * Type definitions for endpoint documentation
 */

export interface OperationOptions {
  /** Operation summary (short) */
  summary: string;
  /** Operation description (detailed) */
  description: string;
  /** Operation ID */
  operationId?: string;
  /** Whether operation is deprecated */
  deprecated?: boolean;
  /** Operation tags */
  tags?: string[];
  /** External documentation */
  externalDocs?: { url: string; description?: string };
}

export interface CallbackDefinition {
  /** Callback name */
  name: string;
  /** Callback URL expression */
  url: string;
  /** HTTP method */
  method: 'get' | 'post' | 'put' | 'patch' | 'delete';
  /** Request body type */
  requestBody?: Type<any>;
  /** Response type */
  responseType?: Type<any>;
  /** Callback description */
  description?: string;
}

export interface WebhookDefinition {
  /** Webhook name/event */
  name: string;
  /** Webhook method */
  method: 'post' | 'put' | 'patch';
  /** Payload type */
  payloadType: Type<any>;
  /** Webhook description */
  description?: string;
  /** Signature header */
  signatureHeader?: string;
  /** Signature algorithm */
  signatureAlgorithm?: string;
}

export interface ExampleDefinition {
  /** Example summary */
  summary: string;
  /** Example description */
  description?: string;
  /** Example value */
  value: any;
}

// ============================================================================
// OPERATION DOCUMENTATION BUILDERS (10 functions)
// ============================================================================

/**
 * Creates comprehensive operation documentation.
 * Full operation documentation with all metadata.
 *
 * @param options - Operation configuration options
 * @returns Complete operation documentation decorator
 *
 * @example
 * ```typescript
 * @Get('users/:id')
 * @createOperationDoc({
 *   summary: 'Get user by ID',
 *   description: 'Retrieves detailed user information by unique identifier',
 *   operationId: 'getUserById',
 *   tags: ['users'],
 *   externalDocs: {
 *     url: 'https://docs.example.com/users/get',
 *     description: 'User API Documentation'
 *   }
 * })
 * async getUser(@Param('id') id: string) {
 *   return this.userService.findOne(id);
 * }
 * ```
 */
export function createOperationDoc(options: OperationOptions) {
  const decorators: any[] = [
    ApiOperation({
      summary: options.summary,
      description: options.description,
      ...(options.operationId && { operationId: options.operationId }),
      ...(options.deprecated && { deprecated: options.deprecated }),
    }),
  ];

  if (options.tags && options.tags.length > 0) {
    decorators.push(ApiTags(...options.tags));
  }

  if (options.externalDocs) {
    decorators.push(
      ApiExtension('x-external-docs', {
        url: options.externalDocs.url,
        description: options.externalDocs.description,
      })
    );
  }

  return applyDecorators(...decorators);
}

/**
 * Creates CRUD operation documentation.
 * Standard CRUD operation with conventional naming.
 *
 * @param operation - CRUD operation type
 * @param resourceName - Resource name (singular)
 * @param tags - Resource tags
 * @returns CRUD operation documentation decorator
 *
 * @example
 * ```typescript
 * @Post('products')
 * @createCrudOperation('create', 'Product', ['products'])
 * async createProduct(@Body() dto: CreateProductDto) {
 *   return this.productService.create(dto);
 * }
 * ```
 */
export function createCrudOperation(
  operation: 'create' | 'read' | 'update' | 'delete' | 'list',
  resourceName: string,
  tags: string[] = []
) {
  const operationDocs: Record<string, { summary: string; description: string }> = {
    create: {
      summary: `Create ${resourceName}`,
      description: `Creates a new ${resourceName} resource`,
    },
    read: {
      summary: `Get ${resourceName}`,
      description: `Retrieves a specific ${resourceName} by identifier`,
    },
    update: {
      summary: `Update ${resourceName}`,
      description: `Updates an existing ${resourceName} resource`,
    },
    delete: {
      summary: `Delete ${resourceName}`,
      description: `Deletes a ${resourceName} resource`,
    },
    list: {
      summary: `List ${resourceName}s`,
      description: `Retrieves a list of ${resourceName} resources with pagination`,
    },
  };

  const doc = operationDocs[operation];

  return applyDecorators(
    ApiOperation({
      summary: doc.summary,
      description: doc.description,
      operationId: `${operation}${resourceName.replace(/\s+/g, '')}`,
    }),
    ApiTags(...tags)
  );
}

/**
 * Creates async operation documentation.
 * Long-running asynchronous operation documentation.
 *
 * @param summary - Operation summary
 * @param description - Operation description
 * @param estimatedDuration - Estimated completion time
 * @returns Async operation documentation decorator
 *
 * @example
 * ```typescript
 * @Post('reports/generate')
 * @createAsyncOperation('Generate Report', 'Generates comprehensive report', '5-10 minutes')
 * async generateReport(@Body() dto: ReportDto) {
 *   return this.reportService.generateAsync(dto);
 * }
 * ```
 */
export function createAsyncOperation(
  summary: string,
  description: string,
  estimatedDuration?: string
) {
  const fullDescription = estimatedDuration
    ? `${description}\n\n**Estimated Duration:** ${estimatedDuration}\n\nThis is an asynchronous operation. Check the status URL in the response for completion.`
    : `${description}\n\nThis is an asynchronous operation.`;

  return applyDecorators(
    ApiOperation({
      summary: `${summary} (Async)`,
      description: fullDescription,
    }),
    ApiExtension('x-async-operation', {
      estimatedDuration,
      async: true,
    })
  );
}

/**
 * Creates batch operation documentation.
 * Bulk/batch operation documentation.
 *
 * @param summary - Operation summary
 * @param description - Operation description
 * @param maxItems - Maximum items in batch
 * @returns Batch operation documentation decorator
 *
 * @example
 * ```typescript
 * @Post('users/batch')
 * @createBatchOperation('Batch Create Users', 'Creates multiple users in single request', 100)
 * async batchCreateUsers(@Body() users: CreateUserDto[]) {
 *   return this.userService.batchCreate(users);
 * }
 * ```
 */
export function createBatchOperation(
  summary: string,
  description: string,
  maxItems = 1000
) {
  return applyDecorators(
    ApiOperation({
      summary: `${summary} (Batch)`,
      description: `${description}\n\n**Maximum Items:** ${maxItems}\n\nReturns 207 Multi-Status with individual operation results.`,
    }),
    ApiExtension('x-batch-operation', {
      maxItems,
      multiStatus: true,
    })
  );
}

/**
 * Creates deprecated operation documentation.
 * Marks operation as deprecated with migration info.
 *
 * @param summary - Operation summary
 * @param description - Operation description
 * @param deprecationReason - Why deprecated
 * @param alternativeEndpoint - Alternative endpoint
 * @param sunsetDate - Removal date
 * @returns Deprecated operation documentation decorator
 *
 * @example
 * ```typescript
 * @Get('users')
 * @createDeprecatedOperation(
 *   'List Users (Deprecated)',
 *   'Legacy user listing',
 *   'Use v2 API for better performance',
 *   '/api/v2/users',
 *   '2025-12-31'
 * )
 * async listUsersLegacy() {
 *   return this.userService.findAll();
 * }
 * ```
 */
export function createDeprecatedOperation(
  summary: string,
  description: string,
  deprecationReason: string,
  alternativeEndpoint?: string,
  sunsetDate?: string
) {
  let fullDescription = `**⚠️ DEPRECATED:** ${deprecationReason}\n\n${description}`;

  if (alternativeEndpoint) {
    fullDescription += `\n\n**Alternative:** Use \`${alternativeEndpoint}\` instead.`;
  }

  if (sunsetDate) {
    fullDescription += `\n\n**Sunset Date:** ${sunsetDate}`;
  }

  return applyDecorators(
    ApiOperation({
      summary,
      description: fullDescription,
      deprecated: true,
    }),
    ApiExtension('x-deprecation', {
      reason: deprecationReason,
      alternative: alternativeEndpoint,
      sunsetDate,
    })
  );
}

/**
 * Creates idempotent operation documentation.
 * Marks operation as idempotent (safe to retry).
 *
 * @param summary - Operation summary
 * @param description - Operation description
 * @param idempotencyKeyHeader - Idempotency key header name
 * @returns Idempotent operation documentation decorator
 *
 * @example
 * ```typescript
 * @Post('payments')
 * @createIdempotentOperation('Create Payment', 'Processes payment', 'Idempotency-Key')
 * async createPayment(@Body() dto: PaymentDto, @Headers('idempotency-key') key: string) {
 *   return this.paymentService.process(dto, key);
 * }
 * ```
 */
export function createIdempotentOperation(
  summary: string,
  description: string,
  idempotencyKeyHeader = 'Idempotency-Key'
) {
  return applyDecorators(
    ApiOperation({
      summary,
      description: `${description}\n\n**Idempotent Operation:** Safe to retry with same \`${idempotencyKeyHeader}\` header.`,
    }),
    ApiExtension('x-idempotent', {
      idempotencyKeyHeader,
      safe: true,
    })
  );
}

/**
 * Creates versioned operation documentation.
 * Documents operation with API version info.
 *
 * @param summary - Operation summary
 * @param description - Operation description
 * @param version - API version
 * @param tags - Operation tags
 * @returns Versioned operation documentation decorator
 *
 * @example
 * ```typescript
 * @Get('data')
 * @createVersionedOperation('Get Data', 'Retrieves data', 'v2', ['data'])
 * async getDataV2() {
 *   return this.dataService.getV2();
 * }
 * ```
 */
export function createVersionedOperation(
  summary: string,
  description: string,
  version: string,
  tags: string[] = []
) {
  return applyDecorators(
    ApiOperation({
      summary: `${summary} (${version})`,
      description: `${description}\n\n**API Version:** ${version}`,
      operationId: `${summary.replace(/\s+/g, '')}${version}`,
    }),
    ApiTags(...tags),
    ApiExtension('x-api-version', version)
  );
}

/**
 * Creates experimental operation documentation.
 * Marks operation as experimental/beta.
 *
 * @param summary - Operation summary
 * @param description - Operation description
 * @param stabilityLevel - Stability level
 * @returns Experimental operation documentation decorator
 *
 * @example
 * ```typescript
 * @Post('ai/analyze')
 * @createExperimentalOperation('AI Analysis', 'Experimental AI analysis', 'alpha')
 * async analyzeWithAi(@Body() dto: AnalysisDto) {
 *   return this.aiService.analyze(dto);
 * }
 * ```
 */
export function createExperimentalOperation(
  summary: string,
  description: string,
  stabilityLevel: 'alpha' | 'beta' | 'experimental' = 'beta'
) {
  return applyDecorators(
    ApiOperation({
      summary: `${summary} (${stabilityLevel.toUpperCase()})`,
      description: `**⚠️ ${stabilityLevel.toUpperCase()}:** This endpoint is experimental and may change.\n\n${description}`,
    }),
    ApiExtension('x-stability', {
      level: stabilityLevel,
      experimental: true,
    })
  );
}

/**
 * Creates internal operation documentation.
 * Marks operation as internal-only (not for public use).
 *
 * @param summary - Operation summary
 * @param description - Operation description
 * @param internalTeam - Team responsible
 * @returns Internal operation documentation decorator
 *
 * @example
 * ```typescript
 * @Post('internal/sync')
 * @createInternalOperation('Sync Data', 'Internal data synchronization', 'Platform Team')
 * async syncData() {
 *   return this.syncService.sync();
 * }
 * ```
 */
export function createInternalOperation(
  summary: string,
  description: string,
  internalTeam?: string
) {
  return applyDecorators(
    ApiOperation({
      summary: `${summary} (Internal)`,
      description: `**🔒 INTERNAL:** Not for external use.\n\n${description}${internalTeam ? `\n\n**Team:** ${internalTeam}` : ''}`,
    }),
    ApiExtension('x-internal', {
      internal: true,
      team: internalTeam,
    })
  );
}

/**
 * Creates public operation documentation.
 * Marks operation as public (no authentication required).
 *
 * @param summary - Operation summary
 * @param description - Operation description
 * @param rateLimits - Rate limit info
 * @returns Public operation documentation decorator
 *
 * @example
 * ```typescript
 * @Get('public/status')
 * @createPublicOperation('System Status', 'Public system status', '100 req/min')
 * async getStatus() {
 *   return this.statusService.getPublicStatus();
 * }
 * ```
 */
export function createPublicOperation(
  summary: string,
  description: string,
  rateLimits?: string
) {
  const fullDescription = `**🌐 PUBLIC:** No authentication required.\n\n${description}${rateLimits ? `\n\n**Rate Limits:** ${rateLimits}` : ''}`;

  return applyDecorators(
    ApiOperation({
      summary,
      description: fullDescription,
    }),
    ApiExtension('x-public', {
      public: true,
      rateLimits,
    })
  );
}

// ============================================================================
// TAG MANAGEMENT UTILITIES (8 functions)
// ============================================================================

/**
 * Creates controller-level tags.
 * Tags all endpoints in controller.
 *
 * @param tags - Array of tag names
 * @returns Controller tags decorator
 *
 * @example
 * ```typescript
 * @Controller('users')
 * @createControllerTags(['users', 'authentication'])
 * export class UsersController {
 *   // All endpoints inherit these tags
 * }
 * ```
 */
export function createControllerTags(tags: string[]) {
  return ApiTags(...tags);
}

/**
 * Creates grouped tags with descriptions.
 * Tags with metadata and grouping info.
 *
 * @param group - Tag group name
 * @param tags - Tags with descriptions
 * @returns Grouped tags decorator
 *
 * @example
 * ```typescript
 * @createGroupedTags('User Management', {
 *   users: 'User CRUD operations',
 *   profiles: 'User profile management',
 *   preferences: 'User preferences'
 * })
 * export class UserModule { }
 * ```
 */
export function createGroupedTags(
  group: string,
  tags: Record<string, string>
) {
  return applyDecorators(
    ApiTags(...Object.keys(tags)),
    ApiExtension('x-tag-group', {
      name: group,
      tags: Object.entries(tags).map(([name, description]) => ({
        name,
        description,
      })),
    })
  );
}

/**
 * Creates versioned tags.
 * Tags with API version prefix.
 *
 * @param version - API version
 * @param tags - Tag names
 * @returns Versioned tags decorator
 *
 * @example
 * ```typescript
 * @createVersionedTags('v2', ['users', 'orders'])
 * export class V2Controller { }
 * ```
 */
export function createVersionedTags(version: string, tags: string[]) {
  const versionedTags = tags.map(tag => `${version}/${tag}`);

  return applyDecorators(
    ApiTags(...versionedTags),
    ApiExtension('x-api-version', version),
    ApiExtension('x-original-tags', tags)
  );
}

/**
 * Creates priority-ordered tags.
 * Tags with display priority for documentation.
 *
 * @param tagPriorities - Tags with priority numbers (lower = higher priority)
 * @returns Priority-ordered tags decorator
 *
 * @example
 * ```typescript
 * @createPriorityTags({
 *   'authentication': 1,
 *   'users': 2,
 *   'admin': 3
 * })
 * export class CoreController { }
 * ```
 */
export function createPriorityTags(tagPriorities: Record<string, number>) {
  const tags = Object.keys(tagPriorities);

  return applyDecorators(
    ApiTags(...tags),
    ApiExtension('x-tag-priorities', tagPriorities)
  );
}

/**
 * Creates categorized tags.
 * Tags organized by category.
 *
 * @param category - Category name
 * @param tags - Tags in this category
 * @param icon - Optional category icon
 * @returns Categorized tags decorator
 *
 * @example
 * ```typescript
 * @createCategorizedTags('Core Resources', ['users', 'products', 'orders'], '📦')
 * export class CoreModule { }
 * ```
 */
export function createCategorizedTags(
  category: string,
  tags: string[],
  icon?: string
) {
  return applyDecorators(
    ApiTags(...tags),
    ApiExtension('x-category', {
      name: category,
      tags,
      icon,
    })
  );
}

/**
 * Creates tag with external documentation.
 * Tag linked to external docs.
 *
 * @param tag - Tag name
 * @param externalDocs - External documentation config
 * @returns Tag with external docs decorator
 *
 * @example
 * ```typescript
 * @createTagWithDocs('webhooks', {
 *   url: 'https://docs.example.com/webhooks',
 *   description: 'Webhook Integration Guide'
 * })
 * export class WebhooksController { }
 * ```
 */
export function createTagWithDocs(
  tag: string,
  externalDocs: { url: string; description?: string }
) {
  return applyDecorators(
    ApiTags(tag),
    ApiExtension('x-tag-docs', {
      tag,
      externalDocs,
    })
  );
}

/**
 * Creates conditional tags.
 * Tags applied based on conditions (feature flags, environments).
 *
 * @param defaultTags - Always-applied tags
 * @param conditionalTags - Tags with conditions
 * @returns Conditional tags decorator
 *
 * @example
 * ```typescript
 * @createConditionalTags(['users'], {
 *   'admin': 'when user is admin',
 *   'beta': 'when beta features enabled'
 * })
 * export class UsersController { }
 * ```
 */
export function createConditionalTags(
  defaultTags: string[],
  conditionalTags: Record<string, string>
) {
  return applyDecorators(
    ApiTags(...defaultTags),
    ApiExtension('x-conditional-tags', {
      default: defaultTags,
      conditional: conditionalTags,
    })
  );
}

/**
 * Creates multi-language tags.
 * Tags with translations for internationalization.
 *
 * @param tags - Tag names
 * @param translations - Tag translations by language
 * @returns Multi-language tags decorator
 *
 * @example
 * ```typescript
 * @createMultiLanguageTags(['users'], {
 *   'en': { users: 'User Management' },
 *   'es': { users: 'Gestión de Usuarios' },
 *   'fr': { users: 'Gestion des Utilisateurs' }
 * })
 * export class UsersController { }
 * ```
 */
export function createMultiLanguageTags(
  tags: string[],
  translations: Record<string, Record<string, string>>
) {
  return applyDecorators(
    ApiTags(...tags),
    ApiExtension('x-tag-translations', translations)
  );
}

// ============================================================================
// EXAMPLE GENERATORS (8 functions)
// ============================================================================

/**
 * Creates request example.
 * Example request body/parameters.
 *
 * @param example - Example definition
 * @returns Request example decorator
 *
 * @example
 * ```typescript
 * @Post('users')
 * @createRequestExample({
 *   summary: 'Create admin user',
 *   description: 'Example for creating admin user',
 *   value: { name: 'Admin', email: 'admin@example.com', role: 'admin' }
 * })
 * async createUser(@Body() dto: CreateUserDto) { }
 * ```
 */
export function createRequestExample(example: ExampleDefinition) {
  return ApiExtension('x-request-example', {
    summary: example.summary,
    description: example.description,
    value: example.value,
  });
}

/**
 * Creates response example for specific status code.
 * Example response with status code.
 *
 * @param statusCode - HTTP status code
 * @param example - Example definition
 * @returns Response example decorator
 *
 * @example
 * ```typescript
 * @Get('users/:id')
 * @createResponseExample(200, {
 *   summary: 'Successful user retrieval',
 *   value: { id: '123', name: 'John Doe', email: 'john@example.com' }
 * })
 * async getUser(@Param('id') id: string) { }
 * ```
 */
export function createResponseExample(
  statusCode: number,
  example: ExampleDefinition
) {
  return ApiExtension(`x-response-example-${statusCode}`, {
    summary: example.summary,
    description: example.description,
    value: example.value,
  });
}

/**
 * Creates multiple request examples.
 * Multiple example scenarios for request.
 *
 * @param examples - Array of example definitions
 * @returns Multiple request examples decorator
 *
 * @example
 * ```typescript
 * @Post('users')
 * @createMultipleRequestExamples([
 *   { summary: 'Regular user', value: { name: 'John', role: 'user' } },
 *   { summary: 'Admin user', value: { name: 'Admin', role: 'admin' } }
 * ])
 * async createUser(@Body() dto: CreateUserDto) { }
 * ```
 */
export function createMultipleRequestExamples(examples: ExampleDefinition[]) {
  return ApiExtension('x-request-examples', examples);
}

/**
 * Creates multiple response examples.
 * Multiple example scenarios for responses.
 *
 * @param statusCode - HTTP status code
 * @param examples - Array of example definitions
 * @returns Multiple response examples decorator
 *
 * @example
 * ```typescript
 * @Get('users/:id')
 * @createMultipleResponseExamples(200, [
 *   { summary: 'Active user', value: { id: '1', status: 'active' } },
 *   { summary: 'Inactive user', value: { id: '2', status: 'inactive' } }
 * ])
 * async getUser(@Param('id') id: string) { }
 * ```
 */
export function createMultipleResponseExamples(
  statusCode: number,
  examples: ExampleDefinition[]
) {
  return ApiExtension(`x-response-examples-${statusCode}`, examples);
}

/**
 * Creates error examples.
 * Example error responses for various scenarios.
 *
 * @param errorExamples - Map of status codes to examples
 * @returns Error examples decorator
 *
 * @example
 * ```typescript
 * @Post('users')
 * @createErrorExamples({
 *   400: { summary: 'Validation error', value: { statusCode: 400, message: 'Invalid email' } },
 *   409: { summary: 'Duplicate email', value: { statusCode: 409, message: 'Email exists' } }
 * })
 * async createUser(@Body() dto: CreateUserDto) { }
 * ```
 */
export function createErrorExamples(
  errorExamples: Record<number, ExampleDefinition>
) {
  return ApiExtension('x-error-examples', errorExamples);
}

/**
 * Creates success examples with different scenarios.
 * Multiple success response scenarios.
 *
 * @param examples - Success example scenarios
 * @returns Success examples decorator
 *
 * @example
 * ```typescript
 * @Get('orders/:id')
 * @createSuccessExamples({
 *   'completed': { summary: 'Completed order', value: { id: '1', status: 'completed' } },
 *   'pending': { summary: 'Pending order', value: { id: '2', status: 'pending' } }
 * })
 * async getOrder(@Param('id') id: string) { }
 * ```
 */
export function createSuccessExamples(
  examples: Record<string, ExampleDefinition>
) {
  return ApiExtension('x-success-examples', examples);
}

/**
 * Creates paginated response example.
 * Example for paginated endpoint responses.
 *
 * @param itemExample - Single item example
 * @param page - Page number
 * @param totalItems - Total items
 * @returns Paginated response example decorator
 *
 * @example
 * ```typescript
 * @Get('users')
 * @createPaginatedExample(
 *   { id: '1', name: 'John' },
 *   1,
 *   100
 * )
 * async listUsers() { }
 * ```
 */
export function createPaginatedExample(
  itemExample: any,
  page = 1,
  totalItems = 100
) {
  const limit = 20;
  const totalPages = Math.ceil(totalItems / limit);

  return ApiExtension('x-paginated-example', {
    summary: 'Paginated response example',
    value: {
      data: Array(Math.min(limit, totalItems)).fill(itemExample),
      pagination: {
        page,
        limit,
        total: totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    },
  });
}

/**
 * Creates async operation example.
 * Example for async operation responses.
 *
 * @param jobId - Example job ID
 * @param statusUrl - Status check URL
 * @returns Async operation example decorator
 *
 * @example
 * ```typescript
 * @Post('reports/generate')
 * @createAsyncExample(
 *   '123e4567-e89b-12d3-a456-426614174000',
 *   '/api/jobs/123e4567-e89b-12d3-a456-426614174000/status'
 * )
 * async generateReport() { }
 * ```
 */
export function createAsyncExample(jobId: string, statusUrl: string) {
  return ApiExtension('x-async-example', {
    summary: 'Async operation accepted',
    value: {
      success: true,
      message: 'Job accepted for processing',
      jobId,
      statusUrl,
      estimatedCompletion: '2024-01-15T10:45:00Z',
    },
  });
}

// ============================================================================
// CALLBACK DEFINITIONS (7 functions)
// ============================================================================

/**
 * Creates webhook callback definition.
 * Documents webhook callback endpoint.
 *
 * @param callback - Callback definition
 * @returns Webhook callback decorator
 *
 * @example
 * ```typescript
 * @Post('orders')
 * @createCallbackDefinition({
 *   name: 'orderStatusUpdate',
 *   url: '{$request.body#/callbackUrl}',
 *   method: 'post',
 *   requestBody: OrderStatusDto,
 *   description: 'Called when order status changes'
 * })
 * async createOrder(@Body() dto: CreateOrderDto) { }
 * ```
 */
export function createCallbackDefinition(callback: CallbackDefinition) {
  const decorators: any[] = [
    ApiExtension('x-callback', {
      name: callback.name,
      url: callback.url,
      method: callback.method,
      description: callback.description,
    }),
  ];

  if (callback.requestBody) {
    decorators.push(ApiExtraModels(callback.requestBody));
  }

  if (callback.responseType) {
    decorators.push(ApiExtraModels(callback.responseType));
  }

  return applyDecorators(...decorators);
}

/**
 * Creates multiple callbacks for operation.
 * Multiple callback scenarios.
 *
 * @param callbacks - Array of callback definitions
 * @returns Multiple callbacks decorator
 *
 * @example
 * ```typescript
 * @Post('payments')
 * @createMultipleCallbacks([
 *   { name: 'onSuccess', url: '{$request.body#/successUrl}', method: 'post' },
 *   { name: 'onFailure', url: '{$request.body#/failureUrl}', method: 'post' }
 * ])
 * async processPayment(@Body() dto: PaymentDto) { }
 * ```
 */
export function createMultipleCallbacks(callbacks: CallbackDefinition[]) {
  const decorators = callbacks.map(callback =>
    ApiExtension(`x-callback-${callback.name}`, {
      url: callback.url,
      method: callback.method,
      description: callback.description,
    })
  );

  return applyDecorators(...decorators);
}

/**
 * Creates async callback definition.
 * Callback for long-running operations.
 *
 * @param callbackUrl - Callback URL parameter
 * @param eventTypes - Types of events to callback
 * @returns Async callback decorator
 *
 * @example
 * ```typescript
 * @Post('batch-process')
 * @createAsyncCallback('callbackUrl', ['completed', 'failed', 'progress'])
 * async batchProcess(@Body() dto: BatchDto) { }
 * ```
 */
export function createAsyncCallback(
  callbackUrl: string,
  eventTypes: string[]
) {
  return ApiExtension('x-async-callback', {
    callbackUrl,
    eventTypes,
    description: `Callbacks sent for: ${eventTypes.join(', ')}`,
  });
}

/**
 * Creates retry callback configuration.
 * Callback with retry logic documentation.
 *
 * @param maxRetries - Maximum retry attempts
 * @param retryDelay - Delay between retries (ms)
 * @param backoffMultiplier - Exponential backoff multiplier
 * @returns Retry callback decorator
 *
 * @example
 * ```typescript
 * @Post('subscriptions')
 * @createRetryCallback(3, 1000, 2)
 * async createSubscription(@Body() dto: SubscriptionDto) { }
 * ```
 */
export function createRetryCallback(
  maxRetries = 3,
  retryDelay = 1000,
  backoffMultiplier = 2
) {
  return ApiExtension('x-callback-retry', {
    maxRetries,
    retryDelay,
    backoffMultiplier,
    description: `Retries up to ${maxRetries} times with exponential backoff`,
  });
}

/**
 * Creates signed callback definition.
 * Callback with signature verification.
 *
 * @param signatureHeader - Header containing signature
 * @param algorithm - Signature algorithm
 * @returns Signed callback decorator
 *
 * @example
 * ```typescript
 * @Post('webhooks')
 * @createSignedCallback('X-Signature', 'HMAC-SHA256')
 * async registerWebhook(@Body() dto: WebhookDto) { }
 * ```
 */
export function createSignedCallback(
  signatureHeader = 'X-Signature',
  algorithm = 'HMAC-SHA256'
) {
  return ApiExtension('x-callback-signature', {
    header: signatureHeader,
    algorithm,
    description: `Callbacks include ${signatureHeader} header with ${algorithm} signature`,
  });
}

/**
 * Creates conditional callback.
 * Callback triggered only under certain conditions.
 *
 * @param condition - Condition description
 * @param callbackUrl - Callback URL
 * @returns Conditional callback decorator
 *
 * @example
 * ```typescript
 * @Post('orders')
 * @createConditionalCallback('order total > $1000', '{$request.body#/highValueUrl}')
 * async createOrder(@Body() dto: OrderDto) { }
 * ```
 */
export function createConditionalCallback(
  condition: string,
  callbackUrl: string
) {
  return ApiExtension('x-conditional-callback', {
    condition,
    callbackUrl,
    description: `Callback triggered when: ${condition}`,
  });
}

/**
 * Creates callback security requirements.
 * Security configuration for callbacks.
 *
 * @param authType - Authentication type
 * @param headerName - Auth header name
 * @returns Callback security decorator
 *
 * @example
 * ```typescript
 * @Post('integrations')
 * @createCallbackSecurity('bearer', 'Authorization')
 * async createIntegration(@Body() dto: IntegrationDto) { }
 * ```
 */
export function createCallbackSecurity(
  authType: 'bearer' | 'basic' | 'apiKey',
  headerName = 'Authorization'
) {
  return ApiExtension('x-callback-security', {
    type: authType,
    header: headerName,
    description: `Callbacks require ${authType} authentication in ${headerName} header`,
  });
}

// ============================================================================
// WEBHOOK DOCUMENTATION (7 functions)
// ============================================================================

/**
 * Creates webhook event documentation.
 * Documents webhook event/payload.
 *
 * @param webhook - Webhook definition
 * @returns Webhook documentation decorator
 *
 * @example
 * ```typescript
 * @createWebhookDoc({
 *   name: 'user.created',
 *   method: 'post',
 *   payloadType: UserCreatedEventDto,
 *   description: 'Fired when new user is created',
 *   signatureHeader: 'X-Webhook-Signature',
 *   signatureAlgorithm: 'HMAC-SHA256'
 * })
 * export class UserWebhooksController { }
 * ```
 */
export function createWebhookDoc(webhook: WebhookDefinition) {
  return applyDecorators(
    ApiExtension('x-webhook', {
      name: webhook.name,
      method: webhook.method,
      description: webhook.description,
      signatureHeader: webhook.signatureHeader,
      signatureAlgorithm: webhook.signatureAlgorithm,
    }),
    ApiExtraModels(webhook.payloadType),
    ApiConsumes('application/json'),
    ApiProduces('application/json')
  );
}

/**
 * Creates webhook subscription documentation.
 * Documents how to subscribe to webhooks.
 *
 * @param events - Available webhook events
 * @param subscriptionEndpoint - Endpoint to subscribe
 * @returns Webhook subscription decorator
 *
 * @example
 * ```typescript
 * @createWebhookSubscription(
 *   ['user.created', 'user.updated', 'user.deleted'],
 *   '/api/webhooks/subscribe'
 * )
 * export class WebhooksController { }
 * ```
 */
export function createWebhookSubscription(
  events: string[],
  subscriptionEndpoint: string
) {
  return ApiExtension('x-webhook-subscription', {
    events,
    subscriptionEndpoint,
    description: `Subscribe to events: ${events.join(', ')}`,
  });
}

/**
 * Creates webhook payload documentation.
 * Documents webhook payload structure.
 *
 * @param eventName - Event name
 * @param payloadType - Payload type
 * @param metadata - Additional metadata fields
 * @returns Webhook payload decorator
 *
 * @example
 * ```typescript
 * @createWebhookPayload('order.completed', OrderCompletedDto, {
 *   eventId: 'Unique event ID',
 *   timestamp: 'Event timestamp',
 *   attemptNumber: 'Delivery attempt number'
 * })
 * export class OrderWebhooks { }
 * ```
 */
export function createWebhookPayload<T>(
  eventName: string,
  payloadType: Type<T>,
  metadata?: Record<string, string>
) {
  return applyDecorators(
    ApiExtension('x-webhook-payload', {
      event: eventName,
      metadata,
    }),
    ApiExtraModels(payloadType)
  );
}

/**
 * Creates webhook delivery configuration.
 * Documents webhook delivery behavior.
 *
 * @param maxRetries - Maximum delivery attempts
 * @param timeout - Request timeout (ms)
 * @param retryStrategy - Retry strategy description
 * @returns Webhook delivery decorator
 *
 * @example
 * ```typescript
 * @createWebhookDelivery(5, 30000, 'Exponential backoff: 1s, 2s, 4s, 8s, 16s')
 * export class WebhooksController { }
 * ```
 */
export function createWebhookDelivery(
  maxRetries = 3,
  timeout = 30000,
  retryStrategy?: string
) {
  return ApiExtension('x-webhook-delivery', {
    maxRetries,
    timeout,
    retryStrategy,
    description: `Max retries: ${maxRetries}, Timeout: ${timeout}ms`,
  });
}

/**
 * Creates webhook security documentation.
 * Documents webhook signature verification.
 *
 * @param signatureHeader - Signature header name
 * @param algorithm - Signature algorithm
 * @param secretRotation - Secret rotation period
 * @returns Webhook security decorator
 *
 * @example
 * ```typescript
 * @createWebhookSecurity('X-Hub-Signature-256', 'SHA256', '30 days')
 * export class SecureWebhooksController { }
 * ```
 */
export function createWebhookSecurity(
  signatureHeader: string,
  algorithm: string,
  secretRotation?: string
) {
  return ApiExtension('x-webhook-security', {
    signatureHeader,
    algorithm,
    secretRotation,
    description: `Verify ${signatureHeader} using ${algorithm}`,
  });
}

/**
 * Creates webhook filtering documentation.
 * Documents webhook event filtering.
 *
 * @param filters - Available filter criteria
 * @returns Webhook filtering decorator
 *
 * @example
 * ```typescript
 * @createWebhookFiltering({
 *   status: ['completed', 'failed'],
 *   amount: { min: 0, max: 10000 },
 *   customerId: 'string'
 * })
 * export class OrderWebhooks { }
 * ```
 */
export function createWebhookFiltering(filters: Record<string, any>) {
  return ApiExtension('x-webhook-filtering', {
    filters,
    description: 'Configure webhook filtering by: ' + Object.keys(filters).join(', '),
  });
}

/**
 * Creates webhook rate limiting documentation.
 * Documents webhook delivery rate limits.
 *
 * @param limit - Maximum webhooks per period
 * @param period - Time period
 * @param burstSize - Burst allowance
 * @returns Webhook rate limiting decorator
 *
 * @example
 * ```typescript
 * @createWebhookRateLimit(1000, '1 hour', 100)
 * export class WebhooksController { }
 * ```
 */
export function createWebhookRateLimit(
  limit: number,
  period: string,
  burstSize?: number
) {
  return ApiExtension('x-webhook-rate-limit', {
    limit,
    period,
    burstSize,
    description: `Rate limit: ${limit} webhooks per ${period}${burstSize ? `, burst: ${burstSize}` : ''}`,
  });
}
