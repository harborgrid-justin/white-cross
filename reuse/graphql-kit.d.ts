/**
 * LOC: GQLK1234567
 * File: /reuse/graphql-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - GraphQL resolvers and modules
 *   - NestJS GraphQL services
 *   - GraphQL middleware and plugins
 *   - Federation gateway services
 */
/**
 * File: /reuse/graphql-kit.ts
 * Locator: WC-UTL-GQLK-001
 * Purpose: Comprehensive GraphQL Utilities - Resolver factories, DataLoader builders, schema generation, middleware, pagination, authorization, federation
 *
 * Upstream: Independent utility module for GraphQL implementation
 * Downstream: ../backend/*, GraphQL resolvers, services, middleware, federation gateway
 * Dependencies: TypeScript 5.x, Node 18+, Hapi.js, graphql, DataLoader, Apollo Federation
 * Exports: 50 utility functions for GraphQL resolver factories, field helpers, DataLoader N+1 prevention, middleware, pagination, authorization, federation
 *
 * LLM Context: Comprehensive GraphQL utilities for building production-ready GraphQL APIs in White Cross healthcare system.
 * Provides resolver factories, field resolver helpers, DataLoader builders for N+1 prevention, GraphQL middleware, schema stitching,
 * query complexity calculators, depth limiting, custom scalar builders, directive factories, union/interface resolvers, context builders,
 * subscription helpers, error formatters, batching utilities, caching strategies, file upload resolvers, relay/offset pagination,
 * filtering/sorting utilities, authorization directives, schema validation, testing utilities, performance monitoring, and federation helpers.
 */
import DataLoader from 'dataloader';
import { Model, ModelCtor, WhereOptions, FindOptions, Order } from 'sequelize';
import { GraphQLResolveInfo, GraphQLFieldResolver, GraphQLScalarType, GraphQLSchema, DocumentNode, GraphQLInputType } from 'graphql';
import { PubSub } from 'graphql-subscriptions';
interface GraphQLContext {
    req: Express.Request;
    res: Express.Response;
    user?: Record<string, unknown>;
    dataloaders: Map<string, DataLoader<unknown, unknown>>;
    pubsub?: PubSub;
    requestId?: string;
    [key: string]: unknown;
}
interface ResolverFactory<TSource, TContext, TArgs, TResult> {
    resolve: GraphQLFieldResolver<TSource, TContext, TArgs, TResult>;
    middleware?: Array<(resolver: GraphQLFieldResolver<any, any>) => GraphQLFieldResolver<any, any>>;
}
interface AuthorizationRule {
    roles?: string[];
    permissions?: string[];
    customCheck?: (context: GraphQLContext, parent: unknown, args: Record<string, unknown>) => boolean | Promise<boolean>;
}
interface CacheConfig {
    ttl: number;
    keyGenerator?: (parent: unknown, args: Record<string, unknown>, context: GraphQLContext) => string;
}
interface DataLoaderOptions {
    batch?: boolean;
    cache?: boolean;
    maxBatchSize?: number;
    batchScheduleFn?: (callback: () => void) => void;
    cacheKeyFn?: (key: any) => any;
}
interface PaginationArgs {
    offset?: number;
    limit?: number;
    page?: number;
    perPage?: number;
}
declare namespace Express {
    interface Request {
        user?: Record<string, unknown>;
        ip?: string;
        id?: string;
    }
    interface Response {
    }
}
interface RelayPaginationArgs {
    first?: number;
    after?: string;
    last?: number;
    before?: string;
}
interface FilterArgs {
    where?: Record<string, any>;
    search?: string;
    searchFields?: string[];
}
interface SortArgs {
    orderBy?: string;
    order?: 'ASC' | 'DESC';
    sortBy?: Array<{
        field: string;
        direction: 'ASC' | 'DESC';
    }>;
}
interface PageInfo {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
}
interface Edge<T> {
    cursor: string;
    node: T;
}
interface Connection<T> {
    edges: Edge<T>[];
    pageInfo: PageInfo;
    totalCount?: number;
}
interface PaginatedResult<T> {
    items: T[];
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}
interface DirectiveConfig {
    name: string;
    locations: string[];
    args?: Record<string, GraphQLInputType>;
    resolve?: (next: any, source: any, args: any, context: any) => any;
}
interface TestingContext {
    user?: any;
    dataloaders?: Map<string, DataLoader<any, any>>;
    mocks?: Record<string, any>;
}
interface PerformanceMetrics {
    queryName: string;
    duration: number;
    fieldCount: number;
    complexity: number;
    timestamp: Date;
}
interface FederationEntityConfig {
    typeName: string;
    keyFields: string[];
    resolveReference: (reference: any, context: any) => any | Promise<any>;
}
interface SchemaDocumentation {
    type: string;
    description: string;
    fields: Array<{
        name: string;
        type: string;
        description?: string;
        deprecated?: boolean;
        deprecationReason?: string;
    }>;
}
/**
 * 1. Creates a generic resolver factory with middleware support.
 *
 * @param {GraphQLFieldResolver<TSource, TContext, TArgs, TResult>} resolver - Base resolver function
 * @param {Array<Function>} [middleware] - Middleware functions to apply
 * @returns {ResolverFactory<TSource, TContext, TArgs, TResult>} Resolver factory
 *
 * @example
 * ```typescript
 * const getUserResolver = createResolverFactory(
 *   async (parent, args, context) => context.userService.findById(args.id),
 *   [loggingMiddleware, authMiddleware]
 * );
 * ```
 */
export declare const createResolverFactory: <TSource, TContext, TArgs, TResult>(resolver: GraphQLFieldResolver<TSource, TContext, TArgs, TResult>, middleware?: Array<(resolver: GraphQLFieldResolver<any, any>) => GraphQLFieldResolver<any, any>>) => ResolverFactory<TSource, TContext, TArgs, TResult>;
/**
 * 2. Creates a field resolver with automatic parent property access.
 *
 * @param {string} propertyPath - Dot-notation path to property (e.g., 'user.profile.email')
 * @param {any} [defaultValue] - Default value if property is undefined
 * @returns {GraphQLFieldResolver<any, any>} Field resolver
 *
 * @example
 * ```typescript
 * const emailResolver = createPropertyResolver('user.email', 'noemail@example.com');
 * // Automatically resolves parent.user.email with fallback
 * ```
 */
export declare const createPropertyResolver: (propertyPath: string, defaultValue?: any) => GraphQLFieldResolver<any, any>;
/**
 * 3. Creates a computed field resolver with caching.
 *
 * @param {Function} computeFn - Function to compute field value
 * @param {CacheConfig} [cacheConfig] - Cache configuration
 * @returns {GraphQLFieldResolver<any, any>} Cached computed resolver
 *
 * @example
 * ```typescript
 * const fullNameResolver = createComputedFieldResolver(
 *   (parent) => `${parent.firstName} ${parent.lastName}`,
 *   { ttl: 300, keyGenerator: (p) => `fullname-${p.id}` }
 * );
 * ```
 */
export declare const createComputedFieldResolver: (computeFn: (parent: any, args: any, context: any, info: GraphQLResolveInfo) => any, cacheConfig?: CacheConfig) => GraphQLFieldResolver<any, any>;
/**
 * 4. Creates an aggregation field resolver (count, sum, avg, etc.).
 *
 * @param {ModelCtor<Model>} model - Sequelize model
 * @param {string} foreignKey - Foreign key field name
 * @param {string} aggregateFunction - Aggregate function (COUNT, SUM, AVG, MIN, MAX)
 * @param {string} [aggregateField] - Field to aggregate (for SUM, AVG, etc.)
 * @returns {GraphQLFieldResolver<any, any>} Aggregation resolver
 *
 * @example
 * ```typescript
 * const totalSalaryResolver = createAggregationResolver(
 *   EmployeeModel,
 *   'departmentId',
 *   'SUM',
 *   'salary'
 * );
 * ```
 */
export declare const createAggregationResolver: (model: ModelCtor<Model>, foreignKey: string, aggregateFunction: "COUNT" | "SUM" | "AVG" | "MIN" | "MAX", aggregateField?: string) => GraphQLFieldResolver<any, any>;
/**
 * 5. Creates a conditional resolver based on parent value.
 *
 * @param {Function} conditionFn - Condition function
 * @param {GraphQLFieldResolver<any, any>} trueResolver - Resolver when condition is true
 * @param {GraphQLFieldResolver<any, any>} falseResolver - Resolver when condition is false
 * @returns {GraphQLFieldResolver<any, any>} Conditional resolver
 *
 * @example
 * ```typescript
 * const dataResolver = createConditionalResolver(
 *   (parent, args, context) => context.user?.role === 'ADMIN',
 *   adminDataResolver,
 *   publicDataResolver
 * );
 * ```
 */
export declare const createConditionalResolver: (conditionFn: (parent: any, args: any, context: any) => boolean | Promise<boolean>, trueResolver: GraphQLFieldResolver<any, any>, falseResolver: GraphQLFieldResolver<any, any>) => GraphQLFieldResolver<any, any>;
/**
 * 6. Creates a batched resolver that groups multiple requests.
 *
 * @param {Function} batchFn - Batch loading function
 * @param {Function} keyExtractor - Function to extract key from parent
 * @returns {GraphQLFieldResolver<any, any>} Batched resolver
 *
 * @example
 * ```typescript
 * const authorsResolver = createBatchResolver(
 *   (postIds) => PostModel.findAll({ where: { id: postIds } }),
 *   (post) => post.authorId
 * );
 * ```
 */
export declare const createBatchResolver: (batchFn: (keys: readonly any[]) => Promise<any[]>, keyExtractor: (parent: any) => any) => GraphQLFieldResolver<any, any>;
/**
 * 7. Creates a resolver with automatic error handling and retry logic.
 *
 * @param {GraphQLFieldResolver<any, any>} resolver - Base resolver
 * @param {number} [maxRetries] - Maximum retry attempts
 * @param {Function} [shouldRetry] - Function to determine if error should trigger retry
 * @returns {GraphQLFieldResolver<any, any>} Resolver with retry logic
 *
 * @example
 * ```typescript
 * const resilientResolver = createRetryResolver(
 *   unstableApiResolver,
 *   3,
 *   (error) => error.message.includes('timeout')
 * );
 * ```
 */
export declare const createRetryResolver: (resolver: GraphQLFieldResolver<any, any>, maxRetries?: number, shouldRetry?: (error: Error) => boolean) => GraphQLFieldResolver<any, any>;
/**
 * 8. Creates a resolver that merges multiple data sources.
 *
 * @param {Array<GraphQLFieldResolver<any, any>>} resolvers - Array of resolvers to merge
 * @param {Function} mergeFn - Function to merge results
 * @returns {GraphQLFieldResolver<any, any>} Merged resolver
 *
 * @example
 * ```typescript
 * const combinedDataResolver = createMergeResolver(
 *   [dbResolver, cacheResolver, apiResolver],
 *   (results) => Object.assign({}, ...results)
 * );
 * ```
 */
export declare const createMergeResolver: (resolvers: Array<GraphQLFieldResolver<any, any>>, mergeFn: (results: any[]) => any) => GraphQLFieldResolver<any, any>;
/**
 * 9. Creates a generic DataLoader with custom configuration.
 *
 * @param {Function} batchLoadFn - Batch loading function
 * @param {DataLoaderOptions} [options] - DataLoader options
 * @returns {DataLoader<any, any>} Configured DataLoader instance
 *
 * @example
 * ```typescript
 * const userLoader = createDataLoader(
 *   async (ids) => UserModel.findAll({ where: { id: ids } }),
 *   { cache: true, maxBatchSize: 100 }
 * );
 * ```
 */
export declare const createDataLoader: (batchLoadFn: (keys: readonly any[]) => Promise<any[]>, options?: DataLoaderOptions) => DataLoader<any, any>;
/**
 * 10. Creates a DataLoader for loading single entities by ID.
 *
 * @param {ModelCtor<Model>} model - Sequelize model
 * @param {string} [idField] - ID field name (default: 'id')
 * @returns {DataLoader<any, any>} Entity DataLoader
 *
 * @example
 * ```typescript
 * const patientLoader = createEntityLoader(PatientModel);
 * const patient = await patientLoader.load('patient-123');
 * ```
 */
export declare const createEntityLoader: (model: ModelCtor<Model>, idField?: string) => DataLoader<any, any>;
/**
 * 11. Creates a DataLoader for one-to-many relationships.
 *
 * @param {ModelCtor<Model>} model - Related model
 * @param {string} foreignKey - Foreign key field
 * @param {FindOptions} [findOptions] - Additional Sequelize options
 * @returns {DataLoader<any, any[]>} One-to-many DataLoader
 *
 * @example
 * ```typescript
 * const appointmentsLoader = createOneToManyLoader(
 *   AppointmentModel,
 *   'patientId',
 *   { order: [['scheduledAt', 'DESC']], limit: 10 }
 * );
 * ```
 */
export declare const createOneToManyLoader: (model: ModelCtor<Model>, foreignKey: string, findOptions?: FindOptions) => DataLoader<any, any[]>;
/**
 * 12. Creates a DataLoader for many-to-many relationships via junction table.
 *
 * @param {ModelCtor<Model>} targetModel - Target entity model
 * @param {ModelCtor<Model>} junctionModel - Junction table model
 * @param {string} sourceKey - Source foreign key in junction
 * @param {string} targetKey - Target foreign key in junction
 * @returns {DataLoader<any, any[]>} Many-to-many DataLoader
 *
 * @example
 * ```typescript
 * const patientDiagnosesLoader = createManyToManyLoader(
 *   DiagnosisModel,
 *   PatientDiagnosisModel,
 *   'patientId',
 *   'diagnosisId'
 * );
 * ```
 */
export declare const createManyToManyLoader: (targetModel: ModelCtor<Model>, junctionModel: ModelCtor<Model>, sourceKey: string, targetKey: string) => DataLoader<any, any[]>;
/**
 * 13. Creates a DataLoader for aggregation queries (count, sum, avg).
 *
 * @param {ModelCtor<Model>} model - Sequelize model
 * @param {string} groupByField - Field to group by
 * @param {string} aggregateFunction - SQL aggregate function
 * @param {string} [aggregateField] - Field to aggregate
 * @returns {DataLoader<any, number>} Aggregation DataLoader
 *
 * @example
 * ```typescript
 * const appointmentCountLoader = createAggregateLoader(
 *   AppointmentModel,
 *   'patientId',
 *   'COUNT'
 * );
 * const count = await appointmentCountLoader.load('patient-123');
 * ```
 */
export declare const createAggregateLoader: (model: ModelCtor<Model>, groupByField: string, aggregateFunction: "COUNT" | "SUM" | "AVG" | "MIN" | "MAX", aggregateField?: string) => DataLoader<any, number>;
/**
 * 14. Creates a DataLoader with custom cache implementation (Redis, etc.).
 *
 * @param {Function} batchLoadFn - Batch loading function
 * @param {Map<any, any>} cacheMap - Custom cache map (e.g., Redis client wrapper)
 * @returns {DataLoader<any, any>} DataLoader with custom cache
 *
 * @example
 * ```typescript
 * const redisCache = new Map(); // Or Redis client wrapper
 * const cachedLoader = createCachedDataLoader(
 *   async (ids) => UserModel.findAll({ where: { id: ids } }),
 *   redisCache
 * );
 * ```
 */
export declare const createCachedDataLoader: (batchLoadFn: (keys: readonly any[]) => Promise<any[]>, cacheMap: Map<any, any>) => DataLoader<any, any>;
/**
 * 15. Creates a DataLoader context builder for GraphQL requests.
 *
 * @param {Record<string, (context: any) => DataLoader<any, any>>} loaderFactories - Loader factory functions
 * @returns {Function} Context builder function
 *
 * @example
 * ```typescript
 * const buildLoaders = createDataLoaderContext({
 *   users: () => createEntityLoader(UserModel),
 *   posts: () => createOneToManyLoader(PostModel, 'userId'),
 *   comments: () => createOneToManyLoader(CommentModel, 'postId')
 * });
 * const context = { dataloaders: buildLoaders(req) };
 * ```
 */
export declare const createDataLoaderContext: (loaderFactories: Record<string, (context: any) => DataLoader<any, any>>) => ((context?: any) => Map<string, DataLoader<any, any>>);
/**
 * 16. Generates GraphQL type definition from TypeScript interface.
 *
 * @param {string} typeName - GraphQL type name
 * @param {Record<string, string>} fields - Field definitions
 * @param {boolean} [isInput] - Whether to generate input type
 * @returns {string} GraphQL type definition
 *
 * @example
 * ```typescript
 * const typeDef = generateTypeDefinition('User', {
 *   id: 'ID!',
 *   email: 'String!',
 *   posts: '[Post!]'
 * });
 * // Result: "type User { id: ID! email: String! posts: [Post!] }"
 * ```
 */
export declare const generateTypeDefinition: (typeName: string, fields: Record<string, string>, isInput?: boolean) => string;
/**
 * 17. Creates GraphQL enum type from TypeScript enum or array.
 *
 * @param {string} enumName - Enum type name
 * @param {string[] | Record<string, string>} values - Enum values
 * @param {Record<string, string>} [descriptions] - Value descriptions
 * @returns {string} GraphQL enum definition
 *
 * @example
 * ```typescript
 * const enumDef = createEnumDefinition('AppointmentStatus',
 *   ['SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'],
 *   { SCHEDULED: 'Appointment is scheduled', COMPLETED: 'Visit completed' }
 * );
 * ```
 */
export declare const createEnumDefinition: (enumName: string, values: string[] | Record<string, string>, descriptions?: Record<string, string>) => string;
/**
 * 18. Creates a custom DateTime scalar type.
 *
 * @returns {GraphQLScalarType} DateTime scalar type
 *
 * @example
 * ```typescript
 * const DateTimeScalar = createDateTimeScalar();
 * // Use in schema: scalar DateTime
 * ```
 */
export declare const createDateTimeScalar: () => GraphQLScalarType;
/**
 * 19. Creates a custom JSON scalar type.
 *
 * @returns {GraphQLScalarType} JSON scalar type
 *
 * @example
 * ```typescript
 * const JSONScalar = createJSONScalar();
 * // Use for flexible JSON fields in schema
 * ```
 */
export declare const createJSONScalar: () => GraphQLScalarType;
/**
 * 20. Creates a custom Email scalar with validation.
 *
 * @returns {GraphQLScalarType} Email scalar type
 *
 * @example
 * ```typescript
 * const EmailScalar = createEmailScalar();
 * // Validates email format automatically
 * ```
 */
export declare const createEmailScalar: () => GraphQLScalarType;
/**
 * 21. Generates GraphQL interface type definition.
 *
 * @param {string} interfaceName - Interface name
 * @param {Record<string, string>} fields - Shared fields
 * @param {string[]} implementingTypes - Types that implement this interface
 * @returns {string} GraphQL interface definition
 *
 * @example
 * ```typescript
 * const nodeDef = generateInterfaceDefinition('Node', { id: 'ID!' }, ['User', 'Post']);
 * // Result: "interface Node { id: ID! }"
 * ```
 */
export declare const generateInterfaceDefinition: (interfaceName: string, fields: Record<string, string>, implementingTypes?: string[]) => string;
/**
 * 22. Generates GraphQL union type definition.
 *
 * @param {string} unionName - Union type name
 * @param {string[]} types - Types in the union
 * @returns {string} GraphQL union definition
 *
 * @example
 * ```typescript
 * const searchResultUnion = generateUnionDefinition(
 *   'SearchResult',
 *   ['Patient', 'Appointment', 'Diagnosis']
 * );
 * // Result: "union SearchResult = Patient | Appointment | Diagnosis"
 * ```
 */
export declare const generateUnionDefinition: (unionName: string, types: string[]) => string;
/**
 * 23. Creates logging middleware for resolvers.
 *
 * @param {Function} [logger] - Custom logger function
 * @returns {Function} Logging middleware
 *
 * @example
 * ```typescript
 * const loggingMiddleware = createLoggingMiddleware(console.log);
 * // Logs all resolver executions with timing
 * ```
 */
export declare const createLoggingMiddleware: (logger?: (message: string, meta: any) => void) => ((resolver: GraphQLFieldResolver<any, any>) => GraphQLFieldResolver<any, any>);
/**
 * 24. Creates authentication middleware for resolvers.
 *
 * @param {Function} [getUserFromContext] - Function to extract user from context
 * @returns {Function} Authentication middleware
 *
 * @example
 * ```typescript
 * const authMiddleware = createAuthenticationMiddleware(
 *   (context) => context.user
 * );
 * ```
 */
export declare const createAuthenticationMiddleware: (getUserFromContext?: (context: any) => any) => ((resolver: GraphQLFieldResolver<any, any>) => GraphQLFieldResolver<any, any>);
/**
 * 25. Creates authorization middleware with role/permission checks.
 *
 * @param {AuthorizationRule} rule - Authorization rule
 * @returns {Function} Authorization middleware
 *
 * @example
 * ```typescript
 * const adminMiddleware = createAuthorizationMiddleware({
 *   roles: ['ADMIN', 'SUPERUSER'],
 *   permissions: ['manage.users']
 * });
 * ```
 */
export declare const createAuthorizationMiddleware: (rule: AuthorizationRule) => ((resolver: GraphQLFieldResolver<any, any>) => GraphQLFieldResolver<any, any>);
/**
 * 26. Creates rate limiting middleware for resolvers.
 *
 * @param {number} maxRequests - Maximum requests allowed
 * @param {number} windowMs - Time window in milliseconds
 * @returns {Function} Rate limiting middleware
 *
 * @example
 * ```typescript
 * const rateLimitMiddleware = createRateLimitingMiddleware(100, 60000);
 * // 100 requests per minute
 * ```
 */
export declare const createRateLimitingMiddleware: (maxRequests: number, windowMs: number) => ((resolver: GraphQLFieldResolver<any, any>) => GraphQLFieldResolver<any, any>);
/**
 * 27. Creates performance monitoring middleware.
 *
 * @param {Function} onMetrics - Callback for performance metrics
 * @returns {Function} Performance monitoring middleware
 *
 * @example
 * ```typescript
 * const perfMiddleware = createPerformanceMiddleware((metrics) => {
 *   metricsService.record(metrics);
 * });
 * ```
 */
export declare const createPerformanceMiddleware: (onMetrics: (metrics: PerformanceMetrics) => void) => ((resolver: GraphQLFieldResolver<any, any>) => GraphQLFieldResolver<any, any>);
/**
 * 28. Creates a GraphQL context builder with all necessary services.
 *
 * @param {Object} config - Context configuration
 * @returns {Function} Context builder function
 *
 * @example
 * ```typescript
 * const buildContext = createContextBuilder({
 *   services: { userService, appointmentService },
 *   dataloaders: loaderFactories,
 *   pubsub: new PubSub()
 * });
 * ```
 */
export declare const createContextBuilder: (config: {
    services?: Record<string, any>;
    dataloaders?: Record<string, (context: any) => DataLoader<any, any>>;
    pubsub?: PubSub;
    customContext?: (req: any, res: any) => Record<string, any>;
}) => ({ req, res }: {
    req: any;
    res: any;
}) => Promise<GraphQLContext>;
/**
 * 29. Creates validation middleware for input arguments.
 *
 * @param {Function} validationFn - Validation function
 * @returns {Function} Validation middleware
 *
 * @example
 * ```typescript
 * const validateEmailMiddleware = createValidationMiddleware(
 *   (args) => {
 *     if (!args.email.includes('@')) throw new Error('Invalid email');
 *   }
 * );
 * ```
 */
export declare const createValidationMiddleware: (validationFn: (args: any, context: any) => void | Promise<void>) => ((resolver: GraphQLFieldResolver<any, any>) => GraphQLFieldResolver<any, any>);
/**
 * 30. Creates offset-based pagination helper.
 *
 * @param {PaginationArgs} args - Pagination arguments
 * @param {number} [maxLimit] - Maximum allowed limit
 * @returns {PaginationArgs} Normalized pagination args
 *
 * @example
 * ```typescript
 * const pagination = createOffsetPagination({ page: 2, perPage: 20 }, 100);
 * // Result: { offset: 20, limit: 20 }
 * ```
 */
export declare const createOffsetPagination: (args: PaginationArgs, maxLimit?: number) => {
    offset: number;
    limit: number;
};
/**
 * 31. Creates relay-style cursor pagination helper.
 *
 * @param {RelayPaginationArgs} args - Relay pagination arguments
 * @returns {Object} Pagination parameters
 *
 * @example
 * ```typescript
 * const params = createRelayPagination({ first: 10, after: 'cursor123' });
 * // Use params to query database
 * ```
 */
export declare const createRelayPagination: (args: RelayPaginationArgs) => {
    limit: number;
    offset?: number;
    direction: "forward" | "backward";
};
/**
 * 32. Creates paginated result wrapper.
 *
 * @param {T[]} items - Result items
 * @param {number} total - Total count
 * @param {PaginationArgs} args - Pagination arguments
 * @returns {PaginatedResult<T>} Paginated result
 *
 * @example
 * ```typescript
 * const result = createPaginatedResult(patients, 150, { page: 2, perPage: 20 });
 * // Result includes items, total, page info, etc.
 * ```
 */
export declare const createPaginatedResult: <T>(items: T[], total: number, args: PaginationArgs) => PaginatedResult<T>;
/**
 * 33. Creates relay connection from array.
 *
 * @param {T[]} items - Array of items
 * @param {RelayPaginationArgs} args - Relay pagination args
 * @param {Function} cursorFn - Cursor generation function
 * @returns {Connection<T>} Relay connection
 *
 * @example
 * ```typescript
 * const connection = createRelayConnection(
 *   appointments,
 *   { first: 10 },
 *   (item, index) => encodeCursor({ id: item.id, index })
 * );
 * ```
 */
export declare const createRelayConnection: <T>(items: T[], args: RelayPaginationArgs, cursorFn: (item: T, index: number) => string) => Connection<T>;
/**
 * 34. Creates filter builder for GraphQL queries.
 *
 * @param {FilterArgs} filterArgs - Filter arguments
 * @param {string[]} [searchableFields] - Fields to search in
 * @returns {WhereOptions} Sequelize where clause
 *
 * @example
 * ```typescript
 * const where = createFilterBuilder(
 *   { search: 'john', where: { role: 'ADMIN' } },
 *   ['firstName', 'lastName', 'email']
 * );
 * ```
 */
export declare const createFilterBuilder: (filterArgs: FilterArgs, searchableFields?: string[]) => WhereOptions;
/**
 * 35. Creates sort builder for GraphQL queries.
 *
 * @param {SortArgs} sortArgs - Sort arguments
 * @param {Record<string, string>} [fieldMapping] - GraphQL to DB field mapping
 * @returns {Order} Sequelize order clause
 *
 * @example
 * ```typescript
 * const order = createSortBuilder(
 *   { orderBy: 'createdAt', order: 'DESC' },
 *   { createdAt: 'created_at' }
 * );
 * ```
 */
export declare const createSortBuilder: (sortArgs: SortArgs, fieldMapping?: Record<string, string>) => Order;
/**
 * 36. Creates combined query builder (filter + sort + pagination).
 *
 * @param {Object} args - Combined query arguments
 * @returns {FindOptions} Sequelize find options
 *
 * @example
 * ```typescript
 * const options = createQueryBuilder({
 *   filter: { search: 'john' },
 *   sort: { orderBy: 'createdAt', order: 'DESC' },
 *   pagination: { page: 1, perPage: 20 }
 * });
 * const patients = await PatientModel.findAll(options);
 * ```
 */
export declare const createQueryBuilder: (args: {
    filter?: FilterArgs;
    sort?: SortArgs;
    pagination?: PaginationArgs;
    searchableFields?: string[];
    fieldMapping?: Record<string, string>;
}) => FindOptions;
/**
 * 37. Creates field-level authorization directive.
 *
 * @param {AuthorizationRule} rule - Authorization rule
 * @returns {DirectiveConfig} Directive configuration
 *
 * @example
 * ```typescript
 * const authDirective = createAuthDirective({
 *   roles: ['ADMIN'],
 *   permissions: ['view.sensitive.data']
 * });
 * ```
 */
export declare const createAuthDirective: (rule: AuthorizationRule) => DirectiveConfig;
/**
 * 38. Creates resource ownership checker.
 *
 * @param {Function} ownerExtractor - Function to extract owner ID from resource
 * @returns {Function} Ownership check function
 *
 * @example
 * ```typescript
 * const checkOwnership = createOwnershipChecker((appointment) => appointment.patientId);
 * const canAccess = await checkOwnership(context.user, appointment);
 * ```
 */
export declare const createOwnershipChecker: (ownerExtractor: (resource: any) => string) => ((user: any, resource: any) => boolean);
/**
 * 39. Creates HIPAA-compliant field masking utility.
 *
 * @param {string[]} sensitiveFields - Fields to mask
 * @param {Function} maskFn - Masking function
 * @returns {Function} Field masking function
 *
 * @example
 * ```typescript
 * const maskPHI = createFieldMasking(
 *   ['ssn', 'creditCard'],
 *   (value) => value ? '***-**-' + value.slice(-4) : null
 * );
 * ```
 */
export declare const createFieldMasking: (sensitiveFields: string[], maskFn: (value: any) => any) => ((data: any, context: GraphQLContext) => any);
/**
 * 40. Creates permission checker with caching.
 *
 * @param {string} permission - Permission to check
 * @returns {Function} Permission check function
 *
 * @example
 * ```typescript
 * const canViewMedicalRecords = createPermissionChecker('view.medical.records');
 * if (canViewMedicalRecords(context.user)) {
 *   // Allow access
 * }
 * ```
 */
export declare const createPermissionChecker: (permission: string) => ((user: any) => boolean);
/**
 * 41. Creates audit logging for mutations.
 *
 * @param {Function} auditLogger - Audit log function
 * @returns {Function} Audit middleware
 *
 * @example
 * ```typescript
 * const auditMiddleware = createAuditLogging((entry) => {
 *   AuditLog.create(entry);
 * });
 * ```
 */
export declare const createAuditLogging: (auditLogger: (entry: {
    userId: string;
    action: string;
    resourceType: string;
    resourceId?: string;
    changes?: any;
    timestamp: Date;
}) => void | Promise<void>) => ((resolver: GraphQLFieldResolver<any, any>) => GraphQLFieldResolver<any, any>);
/**
 * 42. Creates data sanitization for user input.
 *
 * @param {string[]} fieldsToSanitize - Fields to sanitize
 * @returns {Function} Sanitization middleware
 *
 * @example
 * ```typescript
 * const sanitizeMiddleware = createInputSanitization(['email', 'name', 'comments']);
 * ```
 */
export declare const createInputSanitization: (fieldsToSanitize: string[]) => ((resolver: GraphQLFieldResolver<any, any>) => GraphQLFieldResolver<any, any>);
/**
 * 43. Creates federation entity resolver.
 *
 * @param {FederationEntityConfig} config - Entity configuration
 * @returns {Object} Federation resolver
 *
 * @example
 * ```typescript
 * const userEntityResolver = createFederationEntity({
 *   typeName: 'User',
 *   keyFields: ['id'],
 *   resolveReference: (ref, context) => context.userService.findById(ref.id)
 * });
 * ```
 */
export declare const createFederationEntity: (config: FederationEntityConfig) => {
    __resolveReference: (reference: any, context: any) => any | Promise<any>;
};
/**
 * 44. Creates federation reference resolver for external types.
 *
 * @param {string} typeName - External type name
 * @param {string[]} keyFields - Key fields
 * @returns {Object} Reference stub
 *
 * @example
 * ```typescript
 * const patientRef = createFederationReference('Patient', ['id']);
 * // Creates reference to Patient entity from another service
 * ```
 */
export declare const createFederationReference: (typeName: string, keyFields: string[]) => ((reference: Record<string, any>) => any);
/**
 * 45. Creates schema stitching merger for multiple services.
 *
 * @param {GraphQLSchema[]} schemas - Schemas to merge
 * @returns {GraphQLSchema} Merged schema
 *
 * @example
 * ```typescript
 * const mergedSchema = createSchemaStitching([
 *   patientServiceSchema,
 *   appointmentServiceSchema,
 *   billingServiceSchema
 * ]);
 * ```
 */
export declare const createSchemaStitching: (schemas: GraphQLSchema[]) => GraphQLSchema;
/**
 * 46. Creates type extension for federated schema.
 *
 * @param {string} typeName - Type to extend
 * @param {Record<string, string>} fields - Fields to add
 * @returns {string} GraphQL type extension
 *
 * @example
 * ```typescript
 * const extension = createTypeExtension('User', {
 *   appointments: '[Appointment!]!',
 *   medicalRecords: '[MedicalRecord!]!'
 * });
 * ```
 */
export declare const createTypeExtension: (typeName: string, fields: Record<string, string>) => string;
/**
 * 47. Creates remote schema executor for gateway.
 *
 * @param {string} serviceUrl - Remote service URL
 * @returns {Function} Remote executor function
 *
 * @example
 * ```typescript
 * const executeOnPatientService = createRemoteExecutor(
 *   'http://patient-service/graphql'
 * );
 * ```
 */
export declare const createRemoteExecutor: (serviceUrl: string) => ((params: {
    document: DocumentNode;
    variables?: Record<string, any>;
    context?: any;
}) => Promise<any>);
/**
 * 48. Creates federation key directive definition.
 *
 * @param {string[]} fields - Key fields
 * @returns {string} Key directive
 *
 * @example
 * ```typescript
 * const keyDirective = createFederationKeyDirective(['id', 'tenantId']);
 * // Result: '@key(fields: "id tenantId")'
 * ```
 */
export declare const createFederationKeyDirective: (fields: string[]) => string;
/**
 * 49. Creates mock GraphQL context for testing.
 *
 * @param {Partial<TestingContext>} overrides - Context overrides
 * @returns {GraphQLContext} Mock context
 *
 * @example
 * ```typescript
 * const context = createMockContext({
 *   user: { id: '123', role: 'ADMIN' },
 *   mocks: { userService: mockUserService }
 * });
 * ```
 */
export declare const createMockContext: (overrides?: Partial<TestingContext>) => GraphQLContext;
/**
 * 50. Generates GraphQL schema documentation.
 *
 * @param {GraphQLSchema} schema - GraphQL schema
 * @returns {SchemaDocumentation[]} Schema documentation
 *
 * @example
 * ```typescript
 * const docs = generateSchemaDocumentation(schema);
 * // Generate markdown or HTML documentation from schema
 * ```
 */
export declare const generateSchemaDocumentation: (schema: GraphQLSchema) => SchemaDocumentation[];
export {};
//# sourceMappingURL=graphql-kit.d.ts.map