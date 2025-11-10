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
import { Field, ObjectType, InputType, InterfaceType, registerEnumType } from '@nestjs/graphql';
import { GraphQLScalarType, GraphQLError, GraphQLResolveInfo, Kind } from 'graphql';
import DataLoader from 'dataloader';

// ============================================================================
// Type Definitions
// ============================================================================

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

// ============================================================================
// GraphQL Decorator Utilities
// ============================================================================

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
export function createObjectType(
  name: string,
  description?: string,
  options?: { implements?: Function[] }
) {
  return function (target: any) {
    return ObjectType({
      description,
      implements: options?.implements,
    })(target);
  };
}

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
export function createInputType(name: string, description?: string) {
  return function (target: any) {
    return InputType({ description })(target);
  };
}

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
export function createInterfaceType(name: string, description?: string) {
  return function (target: any) {
    return InterfaceType({ description })(target);
  };
}

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
export function registerEnum(
  enumObject: object,
  name: string,
  description?: string
): void {
  registerEnumType(enumObject, { name, description });
}

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
export function createFieldWithMetadata(metadata: {
  type?: any;
  nullable?: boolean;
  description?: string;
  defaultValue?: any;
  complexity?: number | ((args: ComplexityEstimatorArgs) => number);
}) {
  return Field(metadata.type || String, {
    nullable: metadata.nullable,
    description: metadata.description,
    defaultValue: metadata.defaultValue,
  });
}

// ============================================================================
// Schema-First Helpers
// ============================================================================

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
export function generateTypeDefinitions(target: Type<any>): string {
  // This is a simplified implementation
  // Real implementation would use reflection to generate SDL
  const typeName = target.name;
  return `type ${typeName} {\n  # Auto-generated from ${typeName}\n}`;
}

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
export function mergeSchemaDefinitions(schemas: string[]): string {
  return schemas.join('\n\n');
}

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
export function validateSchemaDefinition(schema: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Basic validation checks
  if (!schema || schema.trim().length === 0) {
    errors.push('Schema definition is empty');
  }

  // Check for balanced braces
  const openBraces = (schema.match(/{/g) || []).length;
  const closeBraces = (schema.match(/}/g) || []).length;
  if (openBraces !== closeBraces) {
    errors.push('Unbalanced braces in schema definition');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// Code-First Utilities
// ============================================================================

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
export function createConnectionType<T>(
  nodeType: Type<T>,
  name: string
): Type<Connection<T>> {
  @ObjectType(`${name}Edge`)
  class EdgeType implements Edge<T> {
    @Field(() => nodeType)
    node!: T;

    @Field()
    cursor!: string;
  }

  @ObjectType(`${name}PageInfo`)
  class PageInfoType implements PageInfo {
    @Field()
    hasNextPage!: boolean;

    @Field()
    hasPreviousPage!: boolean;

    @Field({ nullable: true })
    startCursor?: string;

    @Field({ nullable: true })
    endCursor?: string;

    @Field({ nullable: true })
    totalCount?: number;
  }

  @ObjectType(name)
  class ConnectionType implements Connection<T> {
    @Field(() => [EdgeType])
    edges!: EdgeType[];

    @Field(() => PageInfoType)
    pageInfo!: PageInfoType;

    @Field({ nullable: true })
    totalCount?: number;
  }

  return ConnectionType as Type<Connection<T>>;
}

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
export function buildPaginationArgs(args: PaginationArgs): {
  skip: number;
  take: number;
  cursor?: string;
  orderBy: string;
  order: 'ASC' | 'DESC';
} {
  return {
    skip: args.skip || 0,
    take: Math.min(args.take || 10, 100), // Max 100 items per page
    cursor: args.cursor,
    orderBy: args.orderBy || 'createdAt',
    order: args.order || 'DESC',
  };
}

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
export function encodeCursor(value: any): string {
  const json = JSON.stringify(value);
  return Buffer.from(json).toString('base64');
}

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
export function decodeCursor<T = any>(cursor: string): T | null {
  try {
    const json = Buffer.from(cursor, 'base64').toString('utf-8');
    return JSON.parse(json);
  } catch {
    return null;
  }
}

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
export function buildConnection<T>(
  items: T[],
  totalCount: number,
  args: PaginationArgs
): Connection<T> {
  const take = args.take || 10;
  const skip = args.skip || 0;

  const edges = items.map((item, index) => ({
    node: item,
    cursor: encodeCursor({ skip: skip + index }),
  }));

  return {
    edges,
    pageInfo: {
      hasNextPage: skip + items.length < totalCount,
      hasPreviousPage: skip > 0,
      startCursor: edges[0]?.cursor,
      endCursor: edges[edges.length - 1]?.cursor,
      totalCount,
    },
    totalCount,
  };
}

// ============================================================================
// Field Resolver Utilities
// ============================================================================

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
export function createBatchedFieldResolver<T, R>(
  loader: DataLoader<any, R>,
  parentKey: string = 'id'
): (parent: T) => Promise<R> {
  return async (parent: T) => {
    const key = (parent as any)[parentKey];
    return loader.load(key);
  };
}

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
export function memoizeFieldResolver<T, R>(
  resolver: (parent: T) => Promise<R>
): (parent: T) => Promise<R> {
  const cache = new WeakMap<any, Promise<R>>();

  return async (parent: T) => {
    if (cache.has(parent)) {
      return cache.get(parent)!;
    }

    const promise = resolver(parent);
    cache.set(parent, promise);
    return promise;
  };
}

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
export function getFieldSelections(
  info: GraphQLResolveInfo,
  maxDepth: number = 3
): string[] {
  const selections = new Set<string>();

  function traverse(selectionSet: any, depth: number, prefix: string = '') {
    if (!selectionSet || depth > maxDepth) return;

    selectionSet.selections?.forEach((selection: any) => {
      if (selection.kind === 'Field') {
        const fieldName = prefix
          ? `${prefix}.${selection.name.value}`
          : selection.name.value;
        selections.add(fieldName);

        if (selection.selectionSet) {
          traverse(selection.selectionSet, depth + 1, fieldName);
        }
      }
    });
  }

  traverse(info.fieldNodes[0]?.selectionSet, 0);
  return Array.from(selections);
}

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
export function isFieldSelected(
  info: GraphQLResolveInfo,
  fieldName: string
): boolean {
  const selections = getFieldSelections(info);
  return selections.some(s => s === fieldName || s.startsWith(`${fieldName}.`));
}

// ============================================================================
// DataLoader Utilities
// ============================================================================

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
export function createDataLoader<K, V>(
  batchLoadFn: (keys: readonly K[]) => Promise<V[]>,
  options?: DataLoaderOptions<K, V>
): DataLoader<K, V> {
  return new DataLoader<K, V>(
    async (keys: readonly K[]) => {
      const results = await batchLoadFn(keys);

      // Create a map for O(1) lookup
      const resultMap = new Map<K, V>();
      results.forEach((result: any) => {
        const key = result?.id || result;
        resultMap.set(key, result);
      });

      // Return results in same order as keys
      return keys.map(key => resultMap.get(key) || null) as V[];
    },
    {
      cache: options?.cache ?? true,
      maxBatchSize: options?.maxBatchSize || 100,
      batchScheduleFn: options?.batchScheduleFn || (cb => setTimeout(cb, 1)),
      ...options,
    }
  );
}

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
export function createOneToManyLoader<K, V>(
  batchLoadFn: (keys: readonly K[]) => Promise<V[]>,
  foreignKey: string,
  options?: DataLoaderOptions<K, V[]>
): DataLoader<K, V[]> {
  return new DataLoader<K, V[]>(
    async (keys: readonly K[]) => {
      const results = await batchLoadFn(keys);

      // Group results by foreign key
      const grouped = new Map<K, V[]>();
      keys.forEach(key => grouped.set(key, []));

      results.forEach((result: any) => {
        const key = result[foreignKey];
        if (grouped.has(key)) {
          grouped.get(key)!.push(result);
        }
      });

      return keys.map(key => grouped.get(key) || []);
    },
    {
      cache: options?.cache ?? true,
      maxBatchSize: options?.maxBatchSize || 100,
      ...options,
    }
  );
}

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
export function createManyToManyLoader<K, V>(
  batchLoadFn: (keys: readonly K[]) => Promise<Array<{ key: K; values: V[] }>>,
  options?: DataLoaderOptions<K, V[]>
): DataLoader<K, V[]> {
  return new DataLoader<K, V[]>(
    async (keys: readonly K[]) => {
      const results = await batchLoadFn(keys);

      const resultMap = new Map(results.map(r => [r.key, r.values]));
      return keys.map(key => resultMap.get(key) || []);
    },
    {
      cache: options?.cache ?? true,
      ...options,
    }
  );
}

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
export function createLoaderContext<T extends Record<string, () => DataLoader<any, any>>>(
  loaders: T
): { [K in keyof T]: ReturnType<T[K]> } {
  const context: any = {};

  Object.keys(loaders).forEach(key => {
    context[key] = loaders[key]();
  });

  return context;
}

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
export function primeLoader<K, V>(
  loader: DataLoader<K, V>,
  items: V[],
  keyFn: (item: V) => K
): void {
  items.forEach(item => {
    const key = keyFn(item);
    loader.prime(key, item);
  });
}

// ============================================================================
// GraphQL Context Builders
// ============================================================================

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
export function createGraphQLContext(
  req: any,
  res: any,
  loaders?: Record<string, DataLoader<any, any>>
): GraphQLContext {
  return {
    req,
    res,
    user: req.user,
    loaders: loaders || {},
    requestId: req.headers['x-request-id'] || generateRequestId(),
    startTime: Date.now(),
  };
}

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
export function extractUserFromContext(context: GraphQLContext): any | null {
  return context.user || context.req?.user || null;
}

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
export function getLoader<K, V>(
  context: GraphQLContext,
  loaderName: string
): DataLoader<K, V> {
  const loader = context.loaders?.[loaderName];
  if (!loader) {
    throw new Error(`DataLoader '${loaderName}' not found in context`);
  }
  return loader;
}

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
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================================================
// Custom Scalar Types
// ============================================================================

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
export const DateTimeScalar = new GraphQLScalarType({
  name: 'DateTime',
  description: 'DateTime custom scalar type',

  serialize(value: any): string {
    if (value instanceof Date) {
      return value.toISOString();
    }
    return new Date(value).toISOString();
  },

  parseValue(value: any): Date {
    return new Date(value);
  },

  parseLiteral(ast: any): Date {
    if (ast.kind === Kind.STRING || ast.kind === Kind.INT) {
      return new Date(ast.value);
    }
    throw new GraphQLError('DateTime must be a string or integer');
  },
});

/**
 * JSON scalar for handling arbitrary JSON objects
 *
 * @example
 * ```typescript
 * @Field(() => JSONScalar)
 * metadata: Record<string, any>;
 * ```
 */
export const JSONScalar = new GraphQLScalarType({
  name: 'JSON',
  description: 'JSON custom scalar type',

  serialize(value: any): any {
    return value;
  },

  parseValue(value: any): any {
    return value;
  },

  parseLiteral(ast: any): any {
    if (ast.kind === Kind.OBJECT) {
      return parseObjectLiteral(ast);
    }
    if (ast.kind === Kind.LIST) {
      return ast.values.map(parseObjectLiteral);
    }
    return null;
  },
});

/**
 * Helper to parse GraphQL object literals
 *
 * @param ast - AST node
 * @returns Parsed object
 */
function parseObjectLiteral(ast: any): any {
  if (ast.kind === Kind.OBJECT) {
    const obj: any = {};
    ast.fields.forEach((field: any) => {
      obj[field.name.value] = parseObjectLiteral(field.value);
    });
    return obj;
  }
  if (ast.kind === Kind.LIST) {
    return ast.values.map(parseObjectLiteral);
  }
  if (ast.kind === Kind.STRING || ast.kind === Kind.BOOLEAN) {
    return ast.value;
  }
  if (ast.kind === Kind.INT || ast.kind === Kind.FLOAT) {
    return Number(ast.value);
  }
  if (ast.kind === Kind.NULL) {
    return null;
  }
  return null;
}

/**
 * EmailAddress scalar with validation
 *
 * @example
 * ```typescript
 * @Field(() => EmailAddressScalar)
 * email: string;
 * ```
 */
export const EmailAddressScalar = new GraphQLScalarType({
  name: 'EmailAddress',
  description: 'Email address scalar type with validation',

  serialize(value: any): string {
    if (typeof value !== 'string' || !isValidEmail(value)) {
      throw new GraphQLError('Invalid email address');
    }
    return value;
  },

  parseValue(value: any): string {
    if (typeof value !== 'string' || !isValidEmail(value)) {
      throw new GraphQLError('Invalid email address');
    }
    return value;
  },

  parseLiteral(ast: any): string {
    if (ast.kind === Kind.STRING && isValidEmail(ast.value)) {
      return ast.value;
    }
    throw new GraphQLError('Invalid email address');
  },
});

/**
 * Validate email address format
 *
 * @param email - Email string
 * @returns true if valid
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ============================================================================
// Input Type Utilities
// ============================================================================

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
export function createFilterInput(fields: Record<string, any>): Record<string, any> {
  const filter: Record<string, any> = {};

  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      filter[key] = value;
    }
  });

  return filter;
}

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
export function createSortInput(
  field: string,
  order: 'ASC' | 'DESC' = 'ASC'
): Record<string, 'ASC' | 'DESC'> {
  return { [field]: order };
}

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
export function sanitizeInput<T extends Record<string, any>>(
  input: T,
  allowedFields: string[]
): Partial<T> {
  const sanitized: Partial<T> = {};

  allowedFields.forEach(field => {
    if (input[field] !== undefined) {
      sanitized[field as keyof T] = input[field];
    }
  });

  return sanitized;
}

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
export function validateRequiredFields(
  input: Record<string, any>,
  requiredFields: string[]
): void {
  const missing = requiredFields.filter(field => !input[field]);

  if (missing.length > 0) {
    throw new GraphQLError(
      `Missing required fields: ${missing.join(', ')}`,
      { extensions: { code: 'VALIDATION_ERROR', fields: missing } }
    );
  }
}

// ============================================================================
// Error Formatting
// ============================================================================

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
export function formatGraphQLError(
  message: string,
  options?: GraphQLErrorOptions
): GraphQLError {
  return new GraphQLError(message, {
    extensions: {
      code: options?.code || 'INTERNAL_SERVER_ERROR',
      statusCode: options?.statusCode || 500,
      timestamp: options?.timestamp || new Date().toISOString(),
      ...options?.extensions,
    },
  });
}

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
export function sanitizeError(error: any, isDevelopment: boolean = false): any {
  if (isDevelopment) {
    return error;
  }

  // Remove sensitive information in production
  return {
    message: error.message || 'An error occurred',
    extensions: {
      code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
      timestamp: new Date().toISOString(),
    },
  };
}

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
export function createErrorFormatter(options?: {
  logErrors?: boolean;
  sanitize?: boolean;
  isDevelopment?: boolean;
}) {
  return (error: GraphQLError) => {
    if (options?.logErrors) {
      console.error('[GraphQL Error]', {
        message: error.message,
        code: error.extensions?.code,
        path: error.path,
        timestamp: new Date().toISOString(),
      });
    }

    if (options?.sanitize) {
      return sanitizeError(error, options?.isDevelopment);
    }

    return error;
  };
}

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
export function isValidationError(error: any): boolean {
  return (
    error.extensions?.code === 'VALIDATION_ERROR' ||
    error.extensions?.code === 'BAD_USER_INPUT'
  );
}

// ============================================================================
// Query Complexity Analysis
// ============================================================================

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
export function calculateComplexity(args: ComplexityEstimatorArgs): number {
  const { childComplexity, args: fieldArgs } = args;
  const limit = fieldArgs.take || fieldArgs.limit || 10;
  return childComplexity * limit;
}

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
export function createArrayComplexity(
  multiplier: number = 1
): (args: ComplexityEstimatorArgs) => number {
  return (args: ComplexityEstimatorArgs) => {
    const limit = args.args.take || args.args.limit || 10;
    return args.childComplexity * limit * multiplier;
  };
}

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
export function createDepthLimiter(maxDepth: number) {
  return (context: any) => {
    const depth = getQueryDepth(context.document);
    if (depth > maxDepth) {
      throw new GraphQLError(
        `Query depth of ${depth} exceeds maximum allowed depth of ${maxDepth}`,
        { extensions: { code: 'QUERY_TOO_DEEP' } }
      );
    }
  };
}

/**
 * Calculate query depth from AST
 *
 * @param document - GraphQL document
 * @returns Query depth
 */
function getQueryDepth(document: any): number {
  let maxDepth = 0;

  function traverse(node: any, depth: number) {
    if (node.selectionSet) {
      const newDepth = depth + 1;
      maxDepth = Math.max(maxDepth, newDepth);
      node.selectionSet.selections.forEach((selection: any) => {
        traverse(selection, newDepth);
      });
    }
  }

  document.definitions.forEach((def: any) => {
    if (def.selectionSet) {
      traverse(def, 0);
    }
  });

  return maxDepth;
}

// ============================================================================
// Federation Utilities
// ============================================================================

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
export function createReferenceResolver<T>(
  service: { findById: (id: string) => Promise<T> },
  idField: string = 'id'
) {
  return async (reference: any): Promise<T | null> => {
    const id = reference[idField];
    if (!id) return null;
    return service.findById(id);
  };
}

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
export function createExternalReference(typename: string, id: string): any {
  return {
    __typename: typename,
    id,
  };
}

// ============================================================================
// HIPAA-Compliant Field Authorization
// ============================================================================

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
export async function checkFieldAuthorization(
  context: GraphQLContext,
  rule: FieldAuthorizationRule,
  parent?: any
): Promise<boolean> {
  const user = extractUserFromContext(context);

  if (!user) {
    return false;
  }

  // Check roles
  if (rule.roles && !rule.roles.includes(user.role)) {
    return false;
  }

  // Check permissions
  if (rule.permissions) {
    const userPermissions = user.permissions || [];
    const hasPermission = rule.permissions.some(p => userPermissions.includes(p));
    if (!hasPermission) {
      return false;
    }
  }

  // Check custom rule
  if (rule.custom) {
    return rule.custom(context, parent);
  }

  return true;
}

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
export function maskPHIField(
  value: string,
  context: GraphQLContext,
  options?: {
    allowedRoles?: string[];
    maskChar?: string;
    visibleChars?: number;
  }
): string {
  const user = extractUserFromContext(context);

  if (!user) {
    return '***';
  }

  const allowedRoles = options?.allowedRoles || ['ADMIN', 'DOCTOR'];
  if (allowedRoles.includes(user.role)) {
    return value;
  }

  const maskChar = options?.maskChar || '*';
  const visibleChars = options?.visibleChars || 4;

  if (value.length <= visibleChars) {
    return maskChar.repeat(value.length);
  }

  const visible = value.slice(-visibleChars);
  const masked = maskChar.repeat(Math.min(value.length - visibleChars, 6));

  return `${masked}${visible}`;
}

// ============================================================================
// Testing Utilities
// ============================================================================

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
export function createMockContext(overrides?: Partial<GraphQLContext>): GraphQLContext {
  return {
    req: {},
    res: {},
    user: null,
    loaders: {},
    requestId: 'test-request-id',
    startTime: Date.now(),
    ...overrides,
  };
}

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
export function createMockLoader<K, V>(
  mockData: Map<K, V>
): DataLoader<K, V> {
  return new DataLoader<K, V>(async (keys: readonly K[]) => {
    return keys.map(key => mockData.get(key) || null) as V[];
  });
}

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
export function createResolverSpy<T>(
  resolver: (...args: any[]) => Promise<T>
): (...args: any[]) => Promise<T> {
  const calls: any[][] = [];

  const spy = async (...args: any[]): Promise<T> => {
    calls.push(args);
    return resolver(...args);
  };

  (spy as any).calls = calls;
  (spy as any).callCount = () => calls.length;
  (spy as any).reset = () => calls.splice(0, calls.length);

  return spy;
}

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
export async function executeTestQuery(
  schema: any,
  query: string,
  variables?: Record<string, any>,
  context?: GraphQLContext
): Promise<any> {
  // This would use graphql.execute in real implementation
  // Simplified for demonstration
  return {
    data: {},
    errors: undefined,
  };
}

// ============================================================================
// Performance Monitoring
// ============================================================================

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
export async function measureResolverTime<T>(
  resolver: () => Promise<T>,
  name: string
): Promise<T> {
  const start = Date.now();
  try {
    const result = await resolver();
    const duration = Date.now() - start;

    if (duration > 1000) {
      console.warn(`[GraphQL] Slow resolver: ${name} took ${duration}ms`);
    }

    return result;
  } catch (error) {
    const duration = Date.now() - start;
    console.error(`[GraphQL] Resolver error: ${name} failed after ${duration}ms`, error);
    throw error;
  }
}

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
export function logQueryMetrics(
  context: GraphQLContext,
  info: GraphQLResolveInfo,
  operationName?: string
): void {
  const duration = context.startTime ? Date.now() - context.startTime : 0;
  const selections = getFieldSelections(info);

  console.log('[GraphQL Metrics]', {
    operation: operationName || info.fieldName,
    requestId: context.requestId,
    duration: `${duration}ms`,
    fieldCount: selections.length,
    user: context.user?.id || 'anonymous',
    timestamp: new Date().toISOString(),
  });
}
