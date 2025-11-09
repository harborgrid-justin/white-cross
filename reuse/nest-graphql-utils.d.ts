/**
 * NestJS GraphQL Utilities - Comprehensive helper functions for GraphQL development
 *
 * Provides utility functions for GraphQL resolvers, schema management, DataLoader
 * optimization, error handling, and HIPAA-compliant field-level authorization.
 *
 * @module reuse/nest-graphql-utils
 * @since 2025-11-08
 * @requires @nestjs/graphql ^12.0.0 || ^13.0.0
 * @requires @nestjs/common ^11.0.0
 * @requires graphql ^16.0.0
 * @requires dataloader ^2.0.0
 *
 * Features:
 * - GraphQL resolver decorators and builders
 * - Schema-first and code-first utilities
 * - Field resolver optimization helpers
 * - DataLoader factory functions for N+1 prevention
 * - GraphQL context builders with auth
 * - Custom scalar type implementations
 * - Input/Output type utilities
 * - Interface and union type helpers
 * - GraphQL guards and interceptors
 * - Error formatting and sanitization
 * - Query complexity analysis
 * - Schema stitching utilities
 * - Apollo Federation helpers
 * - GraphQL testing utilities
 * - HIPAA-compliant field authorization
 */
import { Type } from '@nestjs/common';
import { GraphQLError, GraphQLResolveInfo } from 'graphql';
import DataLoader from 'dataloader';
export interface GraphQLContext {
    req: any;
    res: any;
    user?: any;
    loaders?: Record<string, DataLoader<any, any>>;
    requestId?: string;
    startTime?: number;
}
export interface PaginationArgs {
    skip?: number;
    take?: number;
    cursor?: string;
    orderBy?: string;
    order?: 'ASC' | 'DESC';
}
export interface PageInfo {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
    totalCount?: number;
}
export interface Edge<T> {
    node: T;
    cursor: string;
}
export interface Connection<T> {
    edges: Edge<T>[];
    pageInfo: PageInfo;
    totalCount?: number;
}
export interface DataLoaderOptions<K, V> {
    cache?: boolean;
    maxBatchSize?: number;
    batchScheduleFn?: (callback: () => void) => void;
    cacheKeyFn?: (key: K) => any;
    cacheMap?: Map<any, Promise<V>>;
}
export interface ComplexityEstimatorArgs {
    type: any;
    field: any;
    args: Record<string, any>;
    childComplexity: number;
}
export interface FieldAuthorizationRule {
    roles?: string[];
    permissions?: string[];
    custom?: (context: GraphQLContext, parent: any) => boolean | Promise<boolean>;
}
export interface GraphQLErrorOptions {
    code?: string;
    statusCode?: number;
    timestamp?: string;
    path?: string[];
    extensions?: Record<string, any>;
}
/**
 * Create a GraphQL ObjectType dynamically with configurable options
 *
 * @param name - Type name
 * @param description - Type description
 * @param options - Additional options
 * @returns Decorator function
 *
 * @example
 * ```typescript
 * @createObjectType('User', 'User account information')
 * class UserType {
 *   @Field() id: string;
 *   @Field() email: string;
 * }
 * ```
 */
export declare function createObjectType(name: string, description?: string, options?: {
    implements?: Function[];
}): (target: any) => any;
/**
 * Create a GraphQL InputType dynamically
 *
 * @param name - Input type name
 * @param description - Input type description
 * @returns Decorator function
 *
 * @example
 * ```typescript
 * @createInputType('CreateUserInput', 'Input for creating a user')
 * class CreateUserInput {
 *   @Field() email: string;
 *   @Field() password: string;
 * }
 * ```
 */
export declare function createInputType(name: string, description?: string): (target: any) => any;
/**
 * Create a GraphQL InterfaceType dynamically
 *
 * @param name - Interface name
 * @param description - Interface description
 * @returns Decorator function
 *
 * @example
 * ```typescript
 * @createInterfaceType('Node', 'Base interface with ID')
 * abstract class Node {
 *   @Field() id: string;
 * }
 * ```
 */
export declare function createInterfaceType(name: string, description?: string): (target: any) => any;
/**
 * Register enum type for GraphQL schema
 *
 * @param enumObject - Enum object
 * @param name - GraphQL enum name
 * @param description - Enum description
 *
 * @example
 * ```typescript
 * enum UserRole {
 *   ADMIN = 'admin',
 *   USER = 'user',
 * }
 * registerEnum(UserRole, 'UserRole', 'User role types');
 * ```
 */
export declare function registerEnum(enumObject: object, name: string, description?: string): void;
/**
 * Create a field decorator with custom metadata
 *
 * @param metadata - Field metadata
 * @returns Field decorator
 *
 * @example
 * ```typescript
 * class User {
 *   @createFieldWithMetadata({ nullable: true, description: 'User email' })
 *   email: string;
 * }
 * ```
 */
export declare function createFieldWithMetadata(metadata: {
    type?: any;
    nullable?: boolean;
    description?: string;
    defaultValue?: any;
    complexity?: number | ((args: ComplexityEstimatorArgs) => number);
}): any;
/**
 * Generate GraphQL schema type definitions from TypeScript class
 *
 * @param target - Class to convert
 * @returns GraphQL SDL string
 *
 * @example
 * ```typescript
 * const schema = generateTypeDefinitions(UserType);
 * // Returns: type User { id: ID! email: String! }
 * ```
 */
export declare function generateTypeDefinitions(target: Type<any>): string;
/**
 * Merge multiple GraphQL schema definitions
 *
 * @param schemas - Array of schema strings
 * @returns Merged schema string
 *
 * @example
 * ```typescript
 * const merged = mergeSchemaDefinitions([userSchema, postSchema]);
 * ```
 */
export declare function mergeSchemaDefinitions(schemas: string[]): string;
/**
 * Validate GraphQL schema definition syntax
 *
 * @param schema - Schema SDL string
 * @returns Validation result with errors
 *
 * @example
 * ```typescript
 * const result = validateSchemaDefinition(schemaString);
 * if (!result.valid) console.error(result.errors);
 * ```
 */
export declare function validateSchemaDefinition(schema: string): {
    valid: boolean;
    errors: string[];
};
/**
 * Create a paginated connection type for relay-style pagination
 *
 * @param nodeType - The node type class
 * @param name - Connection name
 * @returns Connection type class
 *
 * @example
 * ```typescript
 * const UserConnection = createConnectionType(User, 'UserConnection');
 *
 * @Query(() => UserConnection)
 * async users() {
 *   return await this.userService.findMany();
 * }
 * ```
 */
export declare function createConnectionType<T>(nodeType: Type<T>, name: string): Type<Connection<T>>;
/**
 * Build pagination arguments for relay-style cursor-based pagination
 *
 * @param args - Pagination arguments
 * @returns Normalized pagination config
 *
 * @example
 * ```typescript
 * @Query(() => UserConnection)
 * async users(@Args() args: PaginationArgs) {
 *   const config = buildPaginationArgs(args);
 *   return await this.userService.paginate(config);
 * }
 * ```
 */
export declare function buildPaginationArgs(args: PaginationArgs): {
    skip: number;
    take: number;
    cursor?: string;
    orderBy: string;
    order: 'ASC' | 'DESC';
};
/**
 * Encode cursor for relay-style pagination
 *
 * @param value - Value to encode
 * @returns Base64 encoded cursor
 *
 * @example
 * ```typescript
 * const cursor = encodeCursor({ id: '123', createdAt: new Date() });
 * ```
 */
export declare function encodeCursor(value: any): string;
/**
 * Decode cursor from relay-style pagination
 *
 * @param cursor - Base64 encoded cursor
 * @returns Decoded cursor value
 *
 * @example
 * ```typescript
 * const decoded = decodeCursor(cursor);
 * ```
 */
export declare function decodeCursor<T = any>(cursor: string): T | null;
/**
 * Build connection response from array of items
 *
 * @param items - Array of items
 * @param totalCount - Total count for hasNextPage calculation
 * @param args - Pagination arguments
 * @returns Connection object
 *
 * @example
 * ```typescript
 * const items = await this.userService.findMany();
 * const connection = buildConnection(items, totalCount, args);
 * ```
 */
export declare function buildConnection<T>(items: T[], totalCount: number, args: PaginationArgs): Connection<T>;
/**
 * Create a field resolver that batches requests using parent IDs
 *
 * @param loader - DataLoader instance
 * @param parentKey - Key to extract from parent
 * @returns Resolver function
 *
 * @example
 * ```typescript
 * @ResolveField(() => [Post])
 * async posts(@Parent() user: User, @Context() ctx: GraphQLContext) {
 *   return createBatchedFieldResolver(ctx.loaders.posts, 'id')(user);
 * }
 * ```
 */
export declare function createBatchedFieldResolver<T, R>(loader: DataLoader<any, R>, parentKey?: string): (parent: T) => Promise<R>;
/**
 * Create a memoized field resolver to prevent duplicate calculations
 *
 * @param resolver - Resolver function
 * @returns Memoized resolver
 *
 * @example
 * ```typescript
 * @ResolveField(() => Int)
 * async expensiveCalculation(@Parent() user: User) {
 *   return memoizeFieldResolver(async (u) => {
 *     return await this.calculateSomethingExpensive(u);
 *   })(user);
 * }
 * ```
 */
export declare function memoizeFieldResolver<T, R>(resolver: (parent: T) => Promise<R>): (parent: T) => Promise<R>;
/**
 * Extract field selections from GraphQL info object
 *
 * @param info - GraphQL resolve info
 * @param maxDepth - Maximum depth to traverse
 * @returns Array of selected field names
 *
 * @example
 * ```typescript
 * @Query(() => User)
 * async user(@Info() info: GraphQLResolveInfo) {
 *   const fields = getFieldSelections(info);
 *   return await this.userService.findOne({ select: fields });
 * }
 * ```
 */
export declare function getFieldSelections(info: GraphQLResolveInfo, maxDepth?: number): string[];
/**
 * Check if specific field is selected in query
 *
 * @param info - GraphQL resolve info
 * @param fieldName - Field name to check
 * @returns true if field is selected
 *
 * @example
 * ```typescript
 * @Query(() => User)
 * async user(@Info() info: GraphQLResolveInfo) {
 *   const includePosts = isFieldSelected(info, 'posts');
 *   return await this.userService.findOne({ includePosts });
 * }
 * ```
 */
export declare function isFieldSelected(info: GraphQLResolveInfo, fieldName: string): boolean;
/**
 * Create a DataLoader for batch loading entities by ID
 *
 * @param batchLoadFn - Batch loading function
 * @param options - DataLoader options
 * @returns DataLoader instance
 *
 * @example
 * ```typescript
 * const userLoader = createDataLoader(
 *   async (ids) => await this.userService.findByIds(ids),
 *   { cache: true }
 * );
 * ```
 */
export declare function createDataLoader<K, V>(batchLoadFn: (keys: readonly K[]) => Promise<V[]>, options?: DataLoaderOptions<K, V>): DataLoader<K, V>;
/**
 * Create a DataLoader for batch loading one-to-many relationships
 *
 * @param batchLoadFn - Batch loading function returning grouped results
 * @param foreignKey - Foreign key field name
 * @param options - DataLoader options
 * @returns DataLoader instance
 *
 * @example
 * ```typescript
 * const postsLoader = createOneToManyLoader(
 *   async (userIds) => await this.postService.findByUserIds(userIds),
 *   'userId'
 * );
 * ```
 */
export declare function createOneToManyLoader<K, V>(batchLoadFn: (keys: readonly K[]) => Promise<V[]>, foreignKey: string, options?: DataLoaderOptions<K, V[]>): DataLoader<K, V[]>;
/**
 * Create a DataLoader for batch loading many-to-many relationships
 *
 * @param batchLoadFn - Batch loading function
 * @param options - DataLoader options
 * @returns DataLoader instance
 *
 * @example
 * ```typescript
 * const tagsLoader = createManyToManyLoader(
 *   async (postIds) => await this.tagService.findByPostIds(postIds)
 * );
 * ```
 */
export declare function createManyToManyLoader<K, V>(batchLoadFn: (keys: readonly K[]) => Promise<Array<{
    key: K;
    values: V[];
}>>, options?: DataLoaderOptions<K, V[]>): DataLoader<K, V[]>;
/**
 * Create a context with all DataLoaders
 *
 * @param loaders - Object containing loader factory functions
 * @returns Object with DataLoader instances
 *
 * @example
 * ```typescript
 * const loaders = createLoaderContext({
 *   users: () => createDataLoader(async (ids) => await userService.findByIds(ids)),
 *   posts: () => createOneToManyLoader(async (ids) => await postService.findByUserIds(ids), 'userId'),
 * });
 * ```
 */
export declare function createLoaderContext<T extends Record<string, () => DataLoader<any, any>>>(loaders: T): {
    [K in keyof T]: ReturnType<T[K]>;
};
/**
 * Prime a DataLoader cache with preloaded data
 *
 * @param loader - DataLoader instance
 * @param items - Items to prime
 * @param keyFn - Function to extract key from item
 *
 * @example
 * ```typescript
 * const users = await this.userService.findMany();
 * primeLoader(userLoader, users, (user) => user.id);
 * ```
 */
export declare function primeLoader<K, V>(loader: DataLoader<K, V>, items: V[], keyFn: (item: V) => K): void;
/**
 * Create GraphQL context with request info and loaders
 *
 * @param req - Request object
 * @param res - Response object
 * @param loaders - DataLoader instances
 * @returns GraphQL context
 *
 * @example
 * ```typescript
 * GraphQLModule.forRoot({
 *   context: ({ req, res }) => createGraphQLContext(req, res, {
 *     users: userLoader,
 *     posts: postsLoader,
 *   }),
 * });
 * ```
 */
export declare function createGraphQLContext(req: any, res: any, loaders?: Record<string, DataLoader<any, any>>): GraphQLContext;
/**
 * Extract user from GraphQL context
 *
 * @param context - GraphQL context
 * @returns User object or null
 *
 * @example
 * ```typescript
 * @Query(() => User)
 * async me(@Context() ctx: GraphQLContext) {
 *   const user = extractUserFromContext(ctx);
 *   if (!user) throw new UnauthorizedException();
 *   return user;
 * }
 * ```
 */
export declare function extractUserFromContext(context: GraphQLContext): any | null;
/**
 * Get DataLoader from context by name
 *
 * @param context - GraphQL context
 * @param loaderName - Loader name
 * @returns DataLoader instance
 *
 * @example
 * ```typescript
 * @ResolveField(() => [Post])
 * async posts(@Parent() user: User, @Context() ctx: GraphQLContext) {
 *   const loader = getLoader(ctx, 'posts');
 *   return loader.load(user.id);
 * }
 * ```
 */
export declare function getLoader<K, V>(context: GraphQLContext, loaderName: string): DataLoader<K, V>;
/**
 * Generate unique request ID for tracing
 *
 * @returns UUID-like request ID
 *
 * @example
 * ```typescript
 * const requestId = generateRequestId();
 * ```
 */
export declare function generateRequestId(): string;
/**
 * DateTime scalar for handling Date objects
 *
 * @example
 * ```typescript
 * @Module({
 *   providers: [DateTimeScalar],
 * })
 * export class CommonModule {}
 * ```
 */
export declare const DateTimeScalar: any;
/**
 * JSON scalar for handling arbitrary JSON objects
 *
 * @example
 * ```typescript
 * @Field(() => JSONScalar)
 * metadata: Record<string, any>;
 * ```
 */
export declare const JSONScalar: any;
/**
 * EmailAddress scalar with validation
 *
 * @example
 * ```typescript
 * @Field(() => EmailAddressScalar)
 * email: string;
 * ```
 */
export declare const EmailAddressScalar: any;
/**
 * Create filter input type for queries
 *
 * @param fields - Filter fields
 * @returns Filter input object
 *
 * @example
 * ```typescript
 * const filter = createFilterInput({
 *   email: 'user@example.com',
 *   role: 'ADMIN',
 *   isActive: true,
 * });
 * ```
 */
export declare function createFilterInput(fields: Record<string, any>): Record<string, any>;
/**
 * Create sort input for ordering results
 *
 * @param field - Field to sort by
 * @param order - Sort order
 * @returns Sort configuration
 *
 * @example
 * ```typescript
 * const sort = createSortInput('createdAt', 'DESC');
 * ```
 */
export declare function createSortInput(field: string, order?: 'ASC' | 'DESC'): Record<string, 'ASC' | 'DESC'>;
/**
 * Sanitize input to prevent injection attacks
 *
 * @param input - Input object
 * @param allowedFields - Allowed field names
 * @returns Sanitized input
 *
 * @example
 * ```typescript
 * const sanitized = sanitizeInput(userInput, ['email', 'name', 'age']);
 * ```
 */
export declare function sanitizeInput<T extends Record<string, any>>(input: T, allowedFields: string[]): Partial<T>;
/**
 * Validate required fields in input
 *
 * @param input - Input object
 * @param requiredFields - Required field names
 * @throws GraphQLError if validation fails
 *
 * @example
 * ```typescript
 * validateRequiredFields(createUserInput, ['email', 'password']);
 * ```
 */
export declare function validateRequiredFields(input: Record<string, any>, requiredFields: string[]): void;
/**
 * Format GraphQL error with custom options
 *
 * @param message - Error message
 * @param options - Error options
 * @returns GraphQLError instance
 *
 * @example
 * ```typescript
 * throw formatGraphQLError('User not found', {
 *   code: 'NOT_FOUND',
 *   statusCode: 404,
 * });
 * ```
 */
export declare function formatGraphQLError(message: string, options?: GraphQLErrorOptions): GraphQLError;
/**
 * Sanitize error for client response (remove sensitive info)
 *
 * @param error - Error object
 * @param isDevelopment - Development mode flag
 * @returns Sanitized error
 *
 * @example
 * ```typescript
 * const safeError = sanitizeError(error, process.env.NODE_ENV === 'development');
 * ```
 */
export declare function sanitizeError(error: any, isDevelopment?: boolean): any;
/**
 * Create error formatter for GraphQL module configuration
 *
 * @param options - Formatter options
 * @returns Error formatter function
 *
 * @example
 * ```typescript
 * GraphQLModule.forRoot({
 *   formatError: createErrorFormatter({ logErrors: true }),
 * });
 * ```
 */
export declare function createErrorFormatter(options?: {
    logErrors?: boolean;
    sanitize?: boolean;
    isDevelopment?: boolean;
}): (error: GraphQLError) => any;
/**
 * Check if error is a GraphQL validation error
 *
 * @param error - Error object
 * @returns true if validation error
 *
 * @example
 * ```typescript
 * if (isValidationError(error)) {
 *   // Handle validation error
 * }
 * ```
 */
export declare function isValidationError(error: any): boolean;
/**
 * Calculate query complexity score
 *
 * @param args - Complexity estimator arguments
 * @returns Complexity score
 *
 * @example
 * ```typescript
 * @Field(() => [User], {
 *   complexity: (args) => calculateComplexity(args),
 * })
 * users: User[];
 * ```
 */
export declare function calculateComplexity(args: ComplexityEstimatorArgs): number;
/**
 * Create complexity estimator for array fields
 *
 * @param multiplier - Base multiplier
 * @returns Complexity function
 *
 * @example
 * ```typescript
 * @Field(() => [Post], {
 *   complexity: createArrayComplexity(2),
 * })
 * posts: Post[];
 * ```
 */
export declare function createArrayComplexity(multiplier?: number): (args: ComplexityEstimatorArgs) => number;
/**
 * Limit query depth to prevent deep nesting attacks
 *
 * @param maxDepth - Maximum allowed depth
 * @returns Depth limiter function
 *
 * @example
 * ```typescript
 * GraphQLModule.forRoot({
 *   validationRules: [createDepthLimiter(5)],
 * });
 * ```
 */
export declare function createDepthLimiter(maxDepth: number): (context: any) => void;
/**
 * Create reference resolver for Apollo Federation
 *
 * @param service - Service to resolve entities
 * @param idField - ID field name
 * @returns Reference resolver function
 *
 * @example
 * ```typescript
 * @ResolveReference()
 * async resolveReference(reference: any) {
 *   return createReferenceResolver(this.userService, 'id')(reference);
 * }
 * ```
 */
export declare function createReferenceResolver<T>(service: {
    findById: (id: string) => Promise<T>;
}, idField?: string): (reference: any) => Promise<T | null>;
/**
 * Create external type reference for federation
 *
 * @param typename - Type name
 * @param id - Entity ID
 * @returns Reference object
 *
 * @example
 * ```typescript
 * @ResolveField(() => User)
 * author() {
 *   return createExternalReference('User', this.authorId);
 * }
 * ```
 */
export declare function createExternalReference(typename: string, id: string): any;
/**
 * Check field-level authorization for PHI data
 *
 * @param context - GraphQL context
 * @param rule - Authorization rule
 * @param parent - Parent object
 * @returns true if authorized
 *
 * @example
 * ```typescript
 * @ResolveField(() => String)
 * async ssn(@Parent() patient: Patient, @Context() ctx: GraphQLContext) {
 *   const authorized = await checkFieldAuthorization(ctx, {
 *     roles: ['DOCTOR', 'ADMIN'],
 *   }, patient);
 *   if (!authorized) throw new ForbiddenException();
 *   return patient.ssn;
 * }
 * ```
 */
export declare function checkFieldAuthorization(context: GraphQLContext, rule: FieldAuthorizationRule, parent?: any): Promise<boolean>;
/**
 * Mask PHI field based on user role
 *
 * @param value - Field value
 * @param context - GraphQL context
 * @param options - Masking options
 * @returns Masked or original value
 *
 * @example
 * ```typescript
 * @ResolveField(() => String)
 * async ssn(@Parent() patient: Patient, @Context() ctx: GraphQLContext) {
 *   return maskPHIField(patient.ssn, ctx, {
 *     allowedRoles: ['DOCTOR', 'ADMIN']
 *   });
 * }
 * ```
 */
export declare function maskPHIField(value: string, context: GraphQLContext, options?: {
    allowedRoles?: string[];
    maskChar?: string;
    visibleChars?: number;
}): string;
/**
 * Create mock GraphQL context for testing
 *
 * @param overrides - Context overrides
 * @returns Mock context
 *
 * @example
 * ```typescript
 * const ctx = createMockContext({
 *   user: { id: '123', role: 'ADMIN' },
 * });
 * ```
 */
export declare function createMockContext(overrides?: Partial<GraphQLContext>): GraphQLContext;
/**
 * Create mock DataLoader for testing
 *
 * @param mockData - Mock data map
 * @returns Mock DataLoader
 *
 * @example
 * ```typescript
 * const loader = createMockLoader(new Map([
 *   ['1', { id: '1', name: 'User 1' }],
 *   ['2', { id: '2', name: 'User 2' }],
 * ]));
 * ```
 */
export declare function createMockLoader<K, V>(mockData: Map<K, V>): DataLoader<K, V>;
/**
 * Create spy for GraphQL resolver
 *
 * @param resolver - Resolver function
 * @returns Spy wrapper
 *
 * @example
 * ```typescript
 * const spy = createResolverSpy(async () => ({ id: '1' }));
 * await spy();
 * expect(spy).toHaveBeenCalled();
 * ```
 */
export declare function createResolverSpy<T>(resolver: (...args: any[]) => Promise<T>): (...args: any[]) => Promise<T>;
/**
 * Execute GraphQL query in test environment
 *
 * @param schema - GraphQL schema
 * @param query - Query string
 * @param variables - Query variables
 * @param context - GraphQL context
 * @returns Query result
 *
 * @example
 * ```typescript
 * const result = await executeTestQuery(schema, `
 *   query GetUser($id: ID!) {
 *     user(id: $id) { id name }
 *   }
 * `, { id: '123' });
 * ```
 */
export declare function executeTestQuery(schema: any, query: string, variables?: Record<string, any>, context?: GraphQLContext): Promise<any>;
/**
 * Measure resolver execution time
 *
 * @param resolver - Resolver function
 * @param name - Resolver name for logging
 * @returns Wrapped resolver with timing
 *
 * @example
 * ```typescript
 * @Query(() => User)
 * async user(@Args('id') id: string) {
 *   return measureResolverTime(
 *     async () => await this.userService.findById(id),
 *     'UserResolver.user'
 *   );
 * }
 * ```
 */
export declare function measureResolverTime<T>(resolver: () => Promise<T>, name: string): Promise<T>;
/**
 * Log query performance metrics
 *
 * @param context - GraphQL context
 * @param info - GraphQL resolve info
 * @param operationName - Operation name
 *
 * @example
 * ```typescript
 * @Query(() => [User])
 * async users(@Context() ctx: GraphQLContext, @Info() info: GraphQLResolveInfo) {
 *   logQueryMetrics(ctx, info, 'users');
 *   return await this.userService.findAll();
 * }
 * ```
 */
export declare function logQueryMetrics(context: GraphQLContext, info: GraphQLResolveInfo, operationName?: string): void;
//# sourceMappingURL=nest-graphql-utils.d.ts.map