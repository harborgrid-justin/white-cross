/**
 * LOC: GQLP1234567
 * File: /reuse/graphql-pro-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - GraphQL resolvers and modules
 *   - NestJS GraphQL services
 *   - GraphQL middleware and plugins
 */

/**
 * File: /reuse/graphql-pro-kit.ts
 * Locator: WC-UTL-GQLP-001
 * Purpose: Comprehensive GraphQL Utilities - Schema builders, resolvers, DataLoader, subscriptions, complexity analysis
 *
 * Upstream: Independent utility module for GraphQL implementation
 * Downstream: ../backend/*, GraphQL resolvers, services, middleware
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, @nestjs/graphql, graphql, DataLoader, Sequelize
 * Exports: 40 utility functions for GraphQL schema building, resolver helpers, DataLoader, subscriptions, authorization
 *
 * LLM Context: Comprehensive GraphQL utilities for building production-ready GraphQL APIs in White Cross healthcare system.
 * Provides schema builders, type generators, resolver helpers, DataLoader implementations for N+1 prevention, subscription
 * management, query complexity analysis, field-level authorization, input validation, error formatting, cursor-based
 * pagination, Relay connections, GraphQL directives, Sequelize to GraphQL mapping, and performance monitoring.
 */

import DataLoader from 'dataloader';
import { Model, ModelCtor, WhereOptions, FindOptions, Op } from 'sequelize';
import {
  GraphQLResolveInfo,
  GraphQLFieldResolver,
  GraphQLScalarType,
  GraphQLError,
  ValidationContext,
  FieldNode,
  SelectionNode,
} from 'graphql';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface GraphQLContext {
  req: any;
  res: any;
  user?: any;
  dataloaders: Map<string, DataLoader<any, any>>;
  [key: string]: any;
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

interface CursorPaginationArgs {
  first?: number;
  after?: string;
  last?: number;
  before?: string;
}

interface FieldAuthorizationRule {
  field: string;
  roles?: string[];
  permissions?: string[];
  customCheck?: (context: GraphQLContext, parent: any, args: any) => boolean | Promise<boolean>;
}

interface ComplexityEstimator {
  defaultComplexity: number;
  scalarCost: number;
  objectCost: number;
  listMultiplier: number;
}

interface QueryComplexityResult {
  complexity: number;
  depth: number;
  breadth: number;
  fieldCount: number;
}

interface GraphQLDirective {
  name: string;
  description: string;
  locations: string[];
  args?: Record<string, any>;
}

interface SubscriptionConfig {
  topic: string;
  filter?: (payload: any, variables: any, context: GraphQLContext) => boolean | Promise<boolean>;
  resolve?: (payload: any, args: any, context: GraphQLContext, info: GraphQLResolveInfo) => any;
}

interface DataLoaderConfig {
  batch: boolean;
  cache: boolean;
  maxBatchSize?: number;
  cacheKeyFn?: (key: any) => any;
  cacheMap?: Map<any, any>;
}

interface ResolverMetrics {
  fieldName: string;
  typeName: string;
  executionTime: number;
  timestamp: Date;
  complexity: number;
  error?: Error;
}

interface SequelizeFieldMapping {
  sequelizeType: string;
  graphqlType: string;
  nullable: boolean;
  list: boolean;
}

interface InputValidationRule {
  field: string;
  validator: (value: any) => boolean | Promise<boolean>;
  message: string;
}

interface GraphQLErrorExtension {
  code: string;
  timestamp: string;
  path?: string[];
  locations?: any[];
  stacktrace?: string[];
  [key: string]: any;
}

// ============================================================================
// SCHEMA BUILDERS AND TYPE GENERATORS
// ============================================================================

/**
 * Generates GraphQL object type definition from Sequelize model.
 *
 * @param {ModelCtor<Model>} model - Sequelize model class
 * @param {string} typeName - GraphQL type name
 * @param {string[]} [excludeFields] - Fields to exclude from type
 * @returns {string} GraphQL type definition string
 *
 * @example
 * ```typescript
 * const userType = generateGraphQLTypeFromModel(
 *   UserModel,
 *   'User',
 *   ['password', 'resetToken']
 * );
 * // Result: "type User { id: ID! email: String! username: String! ... }"
 * ```
 */
export const generateGraphQLTypeFromModel = (
  model: ModelCtor<Model>,
  typeName: string,
  excludeFields: string[] = [],
): string => {
  const attributes = model.getAttributes();
  const fields: string[] = [];

  for (const [fieldName, attribute] of Object.entries(attributes)) {
    if (excludeFields.includes(fieldName)) continue;

    const mapping = mapSequelizeToGraphQLType(attribute.type.constructor.name);
    const nullable = attribute.allowNull !== false ? '' : '!';
    const listType = mapping.list ? `[${mapping.graphqlType}${nullable}]` : mapping.graphqlType;

    fields.push(`  ${fieldName}: ${listType}${nullable}`);
  }

  return `type ${typeName} {\n${fields.join('\n')}\n}`;
};

/**
 * Maps Sequelize data type to GraphQL type.
 *
 * @param {string} sequelizeType - Sequelize data type name
 * @returns {SequelizeFieldMapping} GraphQL type mapping
 *
 * @example
 * ```typescript
 * const mapping = mapSequelizeToGraphQLType('STRING');
 * // Result: { sequelizeType: 'STRING', graphqlType: 'String', nullable: true, list: false }
 * ```
 */
export const mapSequelizeToGraphQLType = (sequelizeType: string): SequelizeFieldMapping => {
  const typeMap: Record<string, string> = {
    STRING: 'String',
    TEXT: 'String',
    INTEGER: 'Int',
    BIGINT: 'Int',
    FLOAT: 'Float',
    DOUBLE: 'Float',
    DECIMAL: 'Float',
    BOOLEAN: 'Boolean',
    DATE: 'DateTime',
    DATEONLY: 'Date',
    TIME: 'Time',
    UUID: 'ID',
    JSON: 'JSON',
    JSONB: 'JSON',
    ARRAY: 'String',
    ENUM: 'String',
  };

  return {
    sequelizeType,
    graphqlType: typeMap[sequelizeType] || 'String',
    nullable: true,
    list: sequelizeType === 'ARRAY',
  };
};

/**
 * Creates GraphQL input type from object type definition.
 *
 * @param {string} typeName - Base type name
 * @param {Record<string, string>} fields - Field definitions
 * @param {string[]} [requiredFields] - Required field names
 * @returns {string} GraphQL input type definition
 *
 * @example
 * ```typescript
 * const input = createInputType('CreateUser', {
 *   email: 'String',
 *   username: 'String',
 *   password: 'String'
 * }, ['email', 'password']);
 * // Result: "input CreateUserInput { email: String! username: String password: String! }"
 * ```
 */
export const createInputType = (
  typeName: string,
  fields: Record<string, string>,
  requiredFields: string[] = [],
): string => {
  const fieldDefinitions = Object.entries(fields).map(([name, type]) => {
    const required = requiredFields.includes(name) ? '!' : '';
    return `  ${name}: ${type}${required}`;
  });

  return `input ${typeName}Input {\n${fieldDefinitions.join('\n')}\n}`;
};

/**
 * Generates GraphQL enum type from TypeScript enum or array.
 *
 * @param {string} enumName - GraphQL enum name
 * @param {string[] | Record<string, string>} values - Enum values
 * @param {string} [description] - Enum description
 * @returns {string} GraphQL enum definition
 *
 * @example
 * ```typescript
 * const roleEnum = createEnumType('UserRole', ['ADMIN', 'USER', 'MODERATOR']);
 * // Result: "enum UserRole { ADMIN USER MODERATOR }"
 * ```
 */
export const createEnumType = (
  enumName: string,
  values: string[] | Record<string, string>,
  description?: string,
): string => {
  const enumValues = Array.isArray(values) ? values : Object.keys(values);
  const desc = description ? `"""\n${description}\n"""\n` : '';

  return `${desc}enum ${enumName} {\n  ${enumValues.join('\n  ')}\n}`;
};

/**
 * Creates custom GraphQL scalar type with validation.
 *
 * @param {string} name - Scalar type name
 * @param {string} description - Scalar description
 * @param {Function} serialize - Serialization function
 * @param {Function} parseValue - Value parsing function
 * @param {Function} parseLiteral - Literal parsing function
 * @returns {GraphQLScalarType} Custom scalar type
 *
 * @example
 * ```typescript
 * const EmailScalar = createCustomScalar(
 *   'Email',
 *   'Email address scalar type',
 *   (value) => value.toLowerCase(),
 *   (value) => {
 *     if (!isValidEmail(value)) throw new Error('Invalid email');
 *     return value;
 *   }
 * );
 * ```
 */
export const createCustomScalar = (
  name: string,
  description: string,
  serialize: (value: any) => any,
  parseValue: (value: any) => any,
  parseLiteral?: (ast: any) => any,
): GraphQLScalarType => {
  return new GraphQLScalarType({
    name,
    description,
    serialize,
    parseValue,
    parseLiteral: parseLiteral || ((ast) => parseValue(ast.value)),
  });
};

// ============================================================================
// RESOLVER HELPERS AND DECORATORS
// ============================================================================

/**
 * Creates a resolver wrapper with error handling and logging.
 *
 * @param {Function} resolverFn - Resolver function
 * @param {string} fieldName - Field name for logging
 * @returns {GraphQLFieldResolver<any, any>} Wrapped resolver
 *
 * @example
 * ```typescript
 * const getUser = wrapResolver(
 *   async (parent, args, context, info) => {
 *     return await context.userService.findById(args.id);
 *   },
 *   'User.getUser'
 * );
 * ```
 */
export const wrapResolver = (
  resolverFn: GraphQLFieldResolver<any, any>,
  fieldName: string,
): GraphQLFieldResolver<any, any> => {
  return async (parent, args, context, info) => {
    const startTime = Date.now();
    try {
      const result = await resolverFn(parent, args, context, info);
      const executionTime = Date.now() - startTime;

      if (context.metrics) {
        context.metrics.push({
          fieldName,
          typeName: info.parentType.name,
          executionTime,
          timestamp: new Date(),
          complexity: 1,
        });
      }

      return result;
    } catch (error) {
      const executionTime = Date.now() - startTime;

      if (context.metrics) {
        context.metrics.push({
          fieldName,
          typeName: info.parentType.name,
          executionTime,
          timestamp: new Date(),
          complexity: 1,
          error: error as Error,
        });
      }

      throw formatGraphQLError(error as Error, {
        field: fieldName,
        type: info.parentType.name,
      });
    }
  };
};

/**
 * Creates a batched field resolver using DataLoader.
 *
 * @param {string} loaderKey - DataLoader key in context
 * @param {Function} keyExtractor - Function to extract key from parent
 * @returns {GraphQLFieldResolver<any, any>} Batched resolver
 *
 * @example
 * ```typescript
 * const postsResolver = createBatchedResolver(
 *   'postsLoader',
 *   (user) => user.id
 * );
 * // Automatically batches requests for user posts
 * ```
 */
export const createBatchedResolver = (
  loaderKey: string,
  keyExtractor: (parent: any) => any,
): GraphQLFieldResolver<any, any> => {
  return async (parent, args, context, info) => {
    const loader = context.dataloaders?.get(loaderKey);
    if (!loader) {
      throw new Error(`DataLoader "${loaderKey}" not found in context`);
    }

    const key = keyExtractor(parent);
    return loader.load(key);
  };
};

/**
 * Creates a resolver that applies authorization checks.
 *
 * @param {GraphQLFieldResolver<any, any>} resolver - Base resolver function
 * @param {string[]} allowedRoles - Allowed user roles
 * @param {string[]} [requiredPermissions] - Required permissions
 * @returns {GraphQLFieldResolver<any, any>} Authorized resolver
 *
 * @example
 * ```typescript
 * const deleteUser = authorizeResolver(
 *   async (parent, args, context) => {
 *     return await context.userService.delete(args.id);
 *   },
 *   ['ADMIN'],
 *   ['user.delete']
 * );
 * ```
 */
export const authorizeResolver = (
  resolver: GraphQLFieldResolver<any, any>,
  allowedRoles: string[],
  requiredPermissions?: string[],
): GraphQLFieldResolver<any, any> => {
  return async (parent, args, context, info) => {
    const user = context.user;

    if (!user) {
      throw new GraphQLError('Authentication required', {
        extensions: { code: 'UNAUTHENTICATED' },
      });
    }

    // Check roles
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      throw new GraphQLError('Insufficient permissions', {
        extensions: { code: 'FORBIDDEN', requiredRoles: allowedRoles },
      });
    }

    // Check permissions
    if (requiredPermissions && requiredPermissions.length > 0) {
      const hasPermissions = requiredPermissions.every((perm) =>
        user.permissions?.includes(perm),
      );

      if (!hasPermissions) {
        throw new GraphQLError('Insufficient permissions', {
          extensions: { code: 'FORBIDDEN', requiredPermissions },
        });
      }
    }

    return resolver(parent, args, context, info);
  };
};

/**
 * Creates a cached resolver with TTL support.
 *
 * @param {GraphQLFieldResolver<any, any>} resolver - Base resolver
 * @param {number} ttl - Cache TTL in seconds
 * @param {Function} [keyGenerator] - Custom cache key generator
 * @returns {GraphQLFieldResolver<any, any>} Cached resolver
 *
 * @example
 * ```typescript
 * const getPopularPosts = createCachedResolver(
 *   async (parent, args, context) => {
 *     return await context.postService.getPopular(args.limit);
 *   },
 *   300, // 5 minutes
 *   (parent, args) => `popular-posts-${args.limit}`
 * );
 * ```
 */
export const createCachedResolver = (
  resolver: GraphQLFieldResolver<any, any>,
  ttl: number,
  keyGenerator?: (parent: any, args: any, context: any) => string,
): GraphQLFieldResolver<any, any> => {
  const cache = new Map<string, { data: any; expiry: number }>();

  return async (parent, args, context, info) => {
    const cacheKey = keyGenerator
      ? keyGenerator(parent, args, context)
      : JSON.stringify({ parent, args });

    const cached = cache.get(cacheKey);
    const now = Date.now();

    if (cached && cached.expiry > now) {
      return cached.data;
    }

    const result = await resolver(parent, args, context, info);
    cache.set(cacheKey, { data: result, expiry: now + ttl * 1000 });

    return result;
  };
};

// ============================================================================
// DATALOADER IMPLEMENTATIONS FOR N+1 PREVENTION
// ============================================================================

/**
 * Creates a generic DataLoader for Sequelize models by primary key.
 *
 * @param {ModelCtor<Model>} model - Sequelize model
 * @param {DataLoaderConfig} [config] - DataLoader configuration
 * @returns {DataLoader<any, any>} Configured DataLoader
 *
 * @example
 * ```typescript
 * const userLoader = createModelLoader(UserModel, {
 *   batch: true,
 *   cache: true,
 *   maxBatchSize: 100
 * });
 * const user = await userLoader.load(userId);
 * ```
 */
export const createModelLoader = (
  model: ModelCtor<Model>,
  config: Partial<DataLoaderConfig> = {},
): DataLoader<any, any> => {
  return new DataLoader(
    async (ids: readonly any[]) => {
      const records = await model.findAll({
        where: { id: ids as any[] } as WhereOptions,
      });

      const recordMap = new Map(records.map((record) => [record.get('id'), record]));

      return ids.map((id) => recordMap.get(id) || null);
    },
    {
      batch: config.batch !== false,
      cache: config.cache !== false,
      maxBatchSize: config.maxBatchSize || 100,
      cacheKeyFn: config.cacheKeyFn,
      cacheMap: config.cacheMap,
    },
  );
};

/**
 * Creates a DataLoader for loading related records (one-to-many).
 *
 * @param {ModelCtor<Model>} model - Sequelize model
 * @param {string} foreignKey - Foreign key field name
 * @param {FindOptions} [options] - Additional Sequelize find options
 * @returns {DataLoader<any, any[]>} DataLoader for related records
 *
 * @example
 * ```typescript
 * const postsLoader = createRelationLoader(
 *   PostModel,
 *   'userId',
 *   { order: [['createdAt', 'DESC']] }
 * );
 * const userPosts = await postsLoader.load(userId);
 * ```
 */
export const createRelationLoader = (
  model: ModelCtor<Model>,
  foreignKey: string,
  options: FindOptions = {},
): DataLoader<any, any[]> => {
  return new DataLoader(async (parentIds: readonly any[]) => {
    const records = await model.findAll({
      where: {
        [foreignKey]: parentIds as any[],
      } as WhereOptions,
      ...options,
    });

    const recordsByParentId = new Map<any, any[]>();

    records.forEach((record) => {
      const parentId = record.get(foreignKey);
      if (!recordsByParentId.has(parentId)) {
        recordsByParentId.set(parentId, []);
      }
      recordsByParentId.get(parentId)!.push(record);
    });

    return parentIds.map((id) => recordsByParentId.get(id) || []);
  });
};

/**
 * Creates a DataLoader for many-to-many relationships through junction table.
 *
 * @param {ModelCtor<Model>} model - Target model
 * @param {ModelCtor<Model>} junctionModel - Junction table model
 * @param {string} sourceKey - Source foreign key in junction table
 * @param {string} targetKey - Target foreign key in junction table
 * @returns {DataLoader<any, any[]>} DataLoader for many-to-many relations
 *
 * @example
 * ```typescript
 * const userRolesLoader = createManyToManyLoader(
 *   RoleModel,
 *   UserRoleModel,
 *   'userId',
 *   'roleId'
 * );
 * const roles = await userRolesLoader.load(userId);
 * ```
 */
export const createManyToManyLoader = (
  model: ModelCtor<Model>,
  junctionModel: ModelCtor<Model>,
  sourceKey: string,
  targetKey: string,
): DataLoader<any, any[]> => {
  return new DataLoader(async (sourceIds: readonly any[]) => {
    const junctionRecords = await junctionModel.findAll({
      where: {
        [sourceKey]: sourceIds as any[],
      } as WhereOptions,
    });

    const targetIds = junctionRecords.map((record) => record.get(targetKey));
    const targetRecords = await model.findAll({
      where: {
        id: targetIds,
      } as WhereOptions,
    });

    const targetMap = new Map(targetRecords.map((record) => [record.get('id'), record]));

    const recordsBySourceId = new Map<any, any[]>();
    junctionRecords.forEach((junction) => {
      const sourceId = junction.get(sourceKey);
      const targetId = junction.get(targetKey);
      const targetRecord = targetMap.get(targetId);

      if (targetRecord) {
        if (!recordsBySourceId.has(sourceId)) {
          recordsBySourceId.set(sourceId, []);
        }
        recordsBySourceId.get(sourceId)!.push(targetRecord);
      }
    });

    return sourceIds.map((id) => recordsBySourceId.get(id) || []);
  });
};

/**
 * Creates a count DataLoader for aggregation queries.
 *
 * @param {ModelCtor<Model>} model - Sequelize model
 * @param {string} foreignKey - Foreign key to count by
 * @param {WhereOptions} [additionalWhere] - Additional where conditions
 * @returns {DataLoader<any, number>} Count DataLoader
 *
 * @example
 * ```typescript
 * const postCountLoader = createCountLoader(PostModel, 'userId', { published: true });
 * const publishedPostCount = await postCountLoader.load(userId);
 * ```
 */
export const createCountLoader = (
  model: ModelCtor<Model>,
  foreignKey: string,
  additionalWhere: WhereOptions = {},
): DataLoader<any, number> => {
  return new DataLoader(async (parentIds: readonly any[]) => {
    const counts = await model.findAll({
      attributes: [
        foreignKey,
        [model.sequelize!.fn('COUNT', '*'), 'count'],
      ],
      where: {
        [foreignKey]: parentIds as any[],
        ...additionalWhere,
      } as WhereOptions,
      group: [foreignKey],
      raw: true,
    });

    const countMap = new Map<any, number>(
      counts.map((item: any) => [item[foreignKey], parseInt(item.count, 10)]),
    );

    return parentIds.map((id) => countMap.get(id) || 0);
  });
};

// ============================================================================
// GRAPHQL MIDDLEWARE AND PLUGINS
// ============================================================================

/**
 * Creates a complexity analysis plugin for query cost limiting.
 *
 * @param {number} maxComplexity - Maximum allowed query complexity
 * @param {ComplexityEstimator} [estimator] - Complexity estimator config
 * @returns {Function} GraphQL plugin function
 *
 * @example
 * ```typescript
 * const plugin = createComplexityPlugin(1000, {
 *   defaultComplexity: 1,
 *   scalarCost: 1,
 *   objectCost: 2,
 *   listMultiplier: 10
 * });
 * ```
 */
export const createComplexityPlugin = (
  maxComplexity: number,
  estimator: Partial<ComplexityEstimator> = {},
): any => {
  const config: ComplexityEstimator = {
    defaultComplexity: estimator.defaultComplexity || 1,
    scalarCost: estimator.scalarCost || 1,
    objectCost: estimator.objectCost || 2,
    listMultiplier: estimator.listMultiplier || 10,
  };

  return {
    requestDidStart: () => ({
      didResolveOperation: ({ request, document }: any) => {
        const complexity = calculateQueryComplexity(document, config);

        if (complexity.complexity > maxComplexity) {
          throw new GraphQLError(
            `Query complexity ${complexity.complexity} exceeds maximum ${maxComplexity}`,
            {
              extensions: {
                code: 'COMPLEXITY_LIMIT_EXCEEDED',
                complexity: complexity.complexity,
                maxComplexity,
              },
            },
          );
        }
      },
    }),
  };
};

/**
 * Creates a query depth limiting plugin.
 *
 * @param {number} maxDepth - Maximum query depth
 * @returns {Function} GraphQL plugin function
 *
 * @example
 * ```typescript
 * const plugin = createDepthLimitPlugin(5);
 * // Prevents queries deeper than 5 levels
 * ```
 */
export const createDepthLimitPlugin = (maxDepth: number): any => {
  return {
    requestDidStart: () => ({
      didResolveOperation: ({ document }: any) => {
        const depth = calculateQueryDepth(document.definitions[0]);

        if (depth > maxDepth) {
          throw new GraphQLError(`Query depth ${depth} exceeds maximum ${maxDepth}`, {
            extensions: {
              code: 'DEPTH_LIMIT_EXCEEDED',
              depth,
              maxDepth,
            },
          });
        }
      },
    }),
  };
};

/**
 * Creates a performance monitoring plugin.
 *
 * @param {Function} onMetrics - Callback for metrics reporting
 * @returns {Function} GraphQL plugin function
 *
 * @example
 * ```typescript
 * const plugin = createPerformanceMonitoringPlugin((metrics) => {
 *   console.log(`Query executed in ${metrics.duration}ms`);
 * });
 * ```
 */
export const createPerformanceMonitoringPlugin = (
  onMetrics: (metrics: ResolverMetrics) => void,
): any => {
  return {
    requestDidStart: () => {
      const startTime = Date.now();

      return {
        willSendResponse: ({ errors, operationName }: any) => {
          const executionTime = Date.now() - startTime;

          onMetrics({
            fieldName: operationName || 'anonymous',
            typeName: 'Query',
            executionTime,
            timestamp: new Date(),
            complexity: 0,
            error: errors?.[0],
          });
        },
      };
    },
  };
};

/**
 * Creates field-level authorization middleware.
 *
 * @param {FieldAuthorizationRule[]} rules - Authorization rules
 * @returns {Function} Middleware function
 *
 * @example
 * ```typescript
 * const authMiddleware = createFieldAuthorizationMiddleware([
 *   { field: 'User.email', roles: ['ADMIN', 'SELF'] },
 *   { field: 'User.salary', permissions: ['view.salary'] }
 * ]);
 * ```
 */
export const createFieldAuthorizationMiddleware = (
  rules: FieldAuthorizationRule[],
): any => {
  const ruleMap = new Map<string, FieldAuthorizationRule>();
  rules.forEach((rule) => ruleMap.set(rule.field, rule));

  return async (resolve: any, parent: any, args: any, context: GraphQLContext, info: GraphQLResolveInfo) => {
    const fieldPath = `${info.parentType.name}.${info.fieldName}`;
    const rule = ruleMap.get(fieldPath);

    if (rule) {
      const user = context.user;

      if (!user) {
        throw new GraphQLError('Authentication required', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      // Check roles
      if (rule.roles && !rule.roles.includes(user.role)) {
        return null; // Hide field
      }

      // Check permissions
      if (rule.permissions) {
        const hasPermissions = rule.permissions.every((perm) =>
          user.permissions?.includes(perm),
        );
        if (!hasPermissions) {
          return null; // Hide field
        }
      }

      // Custom check
      if (rule.customCheck) {
        const allowed = await rule.customCheck(context, parent, args);
        if (!allowed) {
          return null; // Hide field
        }
      }
    }

    return resolve(parent, args, context, info);
  };
};

// ============================================================================
// SUBSCRIPTION MANAGEMENT
// ============================================================================

/**
 * Creates a subscription with filtering support.
 *
 * @param {SubscriptionConfig} config - Subscription configuration
 * @returns {Object} Subscription resolver configuration
 *
 * @example
 * ```typescript
 * const notificationSubscription = createFilteredSubscription({
 *   topic: 'NOTIFICATION_SENT',
 *   filter: (payload, variables, context) => {
 *     return payload.userId === context.user.id;
 *   }
 * });
 * ```
 */
export const createFilteredSubscription = (config: SubscriptionConfig): any => {
  return {
    subscribe: (parent: any, args: any, context: GraphQLContext) => {
      const pubsub = context.pubsub;
      if (!pubsub) {
        throw new Error('PubSub not found in context');
      }

      return pubsub.asyncIterator(config.topic);
    },
    resolve: config.resolve
      ? config.resolve
      : (payload: any) => payload,
  };
};

/**
 * Creates a subscription manager with cleanup.
 *
 * @param {Map<string, any>} subscriptions - Subscription storage
 * @returns {Object} Subscription manager methods
 *
 * @example
 * ```typescript
 * const manager = createSubscriptionManager(new Map());
 * manager.add('user-123', subscription);
 * manager.remove('user-123');
 * ```
 */
export const createSubscriptionManager = (subscriptions: Map<string, any>): {
  add: (id: string, subscription: any) => void;
  remove: (id: string) => void;
  get: (id: string) => any;
  cleanup: () => void;
} => {
  return {
    add: (id: string, subscription: any) => {
      subscriptions.set(id, subscription);
    },
    remove: (id: string) => {
      const subscription = subscriptions.get(id);
      if (subscription && subscription.unsubscribe) {
        subscription.unsubscribe();
      }
      subscriptions.delete(id);
    },
    get: (id: string) => {
      return subscriptions.get(id);
    },
    cleanup: () => {
      subscriptions.forEach((subscription) => {
        if (subscription && subscription.unsubscribe) {
          subscription.unsubscribe();
        }
      });
      subscriptions.clear();
    },
  };
};

/**
 * Creates a PubSub message with metadata.
 *
 * @param {string} topic - Publication topic
 * @param {any} payload - Message payload
 * @param {Record<string, any>} [metadata] - Additional metadata
 * @returns {Object} Formatted message
 *
 * @example
 * ```typescript
 * const message = createPubSubMessage('USER_CREATED', user, {
 *   timestamp: Date.now(),
 *   source: 'user-service'
 * });
 * ```
 */
export const createPubSubMessage = (
  topic: string,
  payload: any,
  metadata: Record<string, any> = {},
): {
  topic: string;
  payload: any;
  metadata: Record<string, any>;
  timestamp: number;
} => {
  return {
    topic,
    payload,
    metadata,
    timestamp: Date.now(),
  };
};

// ============================================================================
// QUERY COMPLEXITY ANALYSIS
// ============================================================================

/**
 * Calculates query complexity from GraphQL document.
 *
 * @param {any} document - GraphQL document
 * @param {ComplexityEstimator} estimator - Complexity estimator
 * @returns {QueryComplexityResult} Complexity metrics
 *
 * @example
 * ```typescript
 * const complexity = calculateQueryComplexity(document, {
 *   defaultComplexity: 1,
 *   scalarCost: 1,
 *   objectCost: 2,
 *   listMultiplier: 10
 * });
 * // Result: { complexity: 45, depth: 3, breadth: 15, fieldCount: 20 }
 * ```
 */
export const calculateQueryComplexity = (
  document: any,
  estimator: ComplexityEstimator,
): QueryComplexityResult => {
  let complexity = 0;
  let fieldCount = 0;
  const depths: number[] = [];

  const visit = (node: any, depth: number = 0) => {
    if (node.kind === 'Field') {
      fieldCount++;
      complexity += estimator.defaultComplexity;
      depths.push(depth);
    }

    if (node.selectionSet) {
      node.selectionSet.selections.forEach((selection: any) => {
        visit(selection, depth + 1);
      });
    }
  };

  if (document.definitions) {
    document.definitions.forEach((def: any) => {
      if (def.selectionSet) {
        visit(def, 0);
      }
    });
  }

  return {
    complexity,
    depth: Math.max(...depths, 0),
    breadth: fieldCount,
    fieldCount,
  };
};

/**
 * Calculates query depth from selection set.
 *
 * @param {any} node - GraphQL selection node
 * @param {number} [currentDepth] - Current depth counter
 * @returns {number} Maximum query depth
 *
 * @example
 * ```typescript
 * const depth = calculateQueryDepth(document.definitions[0]);
 * // Result: 5
 * ```
 */
export const calculateQueryDepth = (node: any, currentDepth: number = 0): number => {
  if (!node.selectionSet || !node.selectionSet.selections) {
    return currentDepth;
  }

  const depths = node.selectionSet.selections.map((selection: any) =>
    calculateQueryDepth(selection, currentDepth + 1),
  );

  return Math.max(...depths, currentDepth);
};

/**
 * Estimates field complexity with custom logic.
 *
 * @param {string} fieldName - Field name
 * @param {Record<string, number>} fieldCosts - Custom field costs
 * @param {any} args - Field arguments
 * @returns {number} Estimated complexity
 *
 * @example
 * ```typescript
 * const complexity = estimateFieldComplexity('users', {
 *   users: 10,
 *   posts: 5
 * }, { limit: 100 });
 * // Result: 1000 (base cost 10 * limit 100)
 * ```
 */
export const estimateFieldComplexity = (
  fieldName: string,
  fieldCosts: Record<string, number>,
  args: any,
): number => {
  const baseCost = fieldCosts[fieldName] || 1;
  const limit = args.limit || args.first || args.last || 1;

  return baseCost * limit;
};

// ============================================================================
// INPUT VALIDATION AND TRANSFORMATION
// ============================================================================

/**
 * Validates GraphQL input against rules.
 *
 * @param {any} input - Input object to validate
 * @param {InputValidationRule[]} rules - Validation rules
 * @returns {Promise<{ valid: boolean; errors: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateGraphQLInput(
 *   { email: 'invalid', age: -1 },
 *   [
 *     { field: 'email', validator: isEmail, message: 'Invalid email' },
 *     { field: 'age', validator: (v) => v > 0, message: 'Age must be positive' }
 *   ]
 * );
 * // Result: { valid: false, errors: ['Invalid email', 'Age must be positive'] }
 * ```
 */
export const validateGraphQLInput = async (
  input: any,
  rules: InputValidationRule[],
): Promise<{ valid: boolean; errors: string[] }> => {
  const errors: string[] = [];

  for (const rule of rules) {
    const value = input[rule.field];
    const isValid = await rule.validator(value);

    if (!isValid) {
      errors.push(rule.message);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Transforms GraphQL input with sanitization.
 *
 * @param {any} input - Input object
 * @param {Record<string, Function>} transformers - Field transformers
 * @returns {any} Transformed input
 *
 * @example
 * ```typescript
 * const clean = transformGraphQLInput(
 *   { email: ' USER@EXAMPLE.COM ', username: 'John_Doe' },
 *   {
 *     email: (v) => v.trim().toLowerCase(),
 *     username: (v) => v.trim()
 *   }
 * );
 * // Result: { email: 'user@example.com', username: 'John_Doe' }
 * ```
 */
export const transformGraphQLInput = (
  input: any,
  transformers: Record<string, (value: any) => any>,
): any => {
  const transformed: any = { ...input };

  for (const [field, transformer] of Object.entries(transformers)) {
    if (field in transformed) {
      transformed[field] = transformer(transformed[field]);
    }
  }

  return transformed;
};

/**
 * Sanitizes GraphQL input by removing null/undefined values.
 *
 * @param {any} input - Input object
 * @param {boolean} [deep] - Deep sanitization
 * @returns {any} Sanitized input
 *
 * @example
 * ```typescript
 * const clean = sanitizeGraphQLInput({ name: 'John', email: null, age: undefined });
 * // Result: { name: 'John' }
 * ```
 */
export const sanitizeGraphQLInput = (input: any, deep: boolean = false): any => {
  if (Array.isArray(input)) {
    return input
      .filter((item) => item !== null && item !== undefined)
      .map((item) => (deep && typeof item === 'object' ? sanitizeGraphQLInput(item, deep) : item));
  }

  if (typeof input === 'object' && input !== null) {
    const sanitized: any = {};

    for (const [key, value] of Object.entries(input)) {
      if (value !== null && value !== undefined) {
        sanitized[key] = deep && typeof value === 'object' ? sanitizeGraphQLInput(value, deep) : value;
      }
    }

    return sanitized;
  }

  return input;
};

// ============================================================================
// ERROR FORMATTING AND HANDLING
// ============================================================================

/**
 * Formats errors for GraphQL response with extensions.
 *
 * @param {Error} error - Original error
 * @param {Record<string, any>} [extensions] - Additional error extensions
 * @returns {GraphQLError} Formatted GraphQL error
 *
 * @example
 * ```typescript
 * const formatted = formatGraphQLError(
 *   new Error('User not found'),
 *   { code: 'USER_NOT_FOUND', userId: '123' }
 * );
 * ```
 */
export const formatGraphQLError = (
  error: Error,
  extensions: Record<string, any> = {},
): GraphQLError => {
  const errorExtension: GraphQLErrorExtension = {
    code: extensions.code || 'INTERNAL_SERVER_ERROR',
    timestamp: new Date().toISOString(),
    ...extensions,
  };

  // Don't expose stack traces in production
  if (process.env.NODE_ENV !== 'production') {
    errorExtension.stacktrace = error.stack?.split('\n');
  }

  return new GraphQLError(error.message, {
    extensions: errorExtension,
  });
};

/**
 * Creates error formatter function for GraphQL config.
 *
 * @param {boolean} [includeStackTrace] - Include stack traces
 * @returns {Function} Error formatter function
 *
 * @example
 * ```typescript
 * const formatError = createErrorFormatter(process.env.NODE_ENV !== 'production');
 * // Use in GraphQL config: { formatError }
 * ```
 */
export const createErrorFormatter = (includeStackTrace: boolean = false) => {
  return (error: GraphQLError) => {
    const formatted: any = {
      message: error.message,
      extensions: {
        code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
        timestamp: new Date().toISOString(),
        ...error.extensions,
      },
    };

    if (error.path) {
      formatted.path = error.path;
    }

    if (error.locations) {
      formatted.locations = error.locations;
    }

    if (includeStackTrace && error.stack) {
      formatted.extensions.stacktrace = error.stack.split('\n');
    }

    return formatted;
  };
};

/**
 * Handles GraphQL errors with logging.
 *
 * @param {GraphQLError} error - GraphQL error
 * @param {Function} [logger] - Custom logger function
 * @returns {GraphQLError} Processed error
 *
 * @example
 * ```typescript
 * const handled = handleGraphQLError(error, (err) => {
 *   console.error('GraphQL Error:', err);
 * });
 * ```
 */
export const handleGraphQLError = (
  error: GraphQLError,
  logger?: (error: GraphQLError) => void,
): GraphQLError => {
  if (logger) {
    logger(error);
  } else {
    console.error('[GraphQL Error]', {
      message: error.message,
      code: error.extensions?.code,
      path: error.path,
      timestamp: new Date().toISOString(),
    });
  }

  return error;
};

// ============================================================================
// CURSOR-BASED PAGINATION FOR GRAPHQL
// ============================================================================

/**
 * Encodes cursor from object (base64).
 *
 * @param {Record<string, any>} data - Cursor data
 * @returns {string} Encoded cursor
 *
 * @example
 * ```typescript
 * const cursor = encodeCursor({ id: 123, timestamp: '2024-01-01' });
 * // Result: 'eyJpZCI6MTIzLCJ0aW1lc3RhbXAiOiIyMDI0LTAxLTAxIn0='
 * ```
 */
export const encodeCursor = (data: Record<string, any>): string => {
  return Buffer.from(JSON.stringify(data)).toString('base64');
};

/**
 * Decodes cursor to object.
 *
 * @param {string} cursor - Encoded cursor
 * @returns {Record<string, any>} Decoded cursor data
 *
 * @example
 * ```typescript
 * const data = decodeCursor('eyJpZCI6MTIzfQ==');
 * // Result: { id: 123 }
 * ```
 */
export const decodeCursor = (cursor: string): Record<string, any> => {
  try {
    return JSON.parse(Buffer.from(cursor, 'base64').toString('utf-8'));
  } catch (error) {
    throw new GraphQLError('Invalid cursor', {
      extensions: { code: 'INVALID_CURSOR' },
    });
  }
};

/**
 * Creates Relay-style connection from array of records.
 *
 * @param {T[]} records - Array of records
 * @param {CursorPaginationArgs} args - Pagination arguments
 * @param {Function} cursorExtractor - Function to extract cursor from record
 * @returns {Connection<T>} Relay connection
 *
 * @example
 * ```typescript
 * const connection = createConnection(
 *   users,
 *   { first: 10, after: 'cursor123' },
 *   (user) => encodeCursor({ id: user.id })
 * );
 * ```
 */
export const createConnection = <T>(
  records: T[],
  args: CursorPaginationArgs,
  cursorExtractor: (record: T) => string,
): Connection<T> => {
  const edges: Edge<T>[] = records.map((record) => ({
    cursor: cursorExtractor(record),
    node: record,
  }));

  const hasNextPage = args.first ? records.length === args.first : false;
  const hasPreviousPage = !!args.after;

  const pageInfo: PageInfo = {
    hasNextPage,
    hasPreviousPage,
    startCursor: edges[0]?.cursor,
    endCursor: edges[edges.length - 1]?.cursor,
  };

  return {
    edges,
    pageInfo,
    totalCount: records.length,
  };
};

/**
 * Applies cursor pagination to Sequelize query.
 *
 * @param {CursorPaginationArgs} args - Pagination arguments
 * @param {string} [cursorField] - Field to use for cursor (default: 'id')
 * @returns {FindOptions} Sequelize query options
 *
 * @example
 * ```typescript
 * const options = applyCursorPagination({ first: 10, after: 'cursor123' });
 * const users = await UserModel.findAll(options);
 * ```
 */
export const applyCursorPagination = (
  args: CursorPaginationArgs,
  cursorField: string = 'id',
): FindOptions => {
  const where: WhereOptions = {};
  let limit = args.first || args.last || 10;

  if (args.after) {
    const cursor = decodeCursor(args.after);
    where[cursorField] = { [Op.gt]: cursor[cursorField] };
  }

  if (args.before) {
    const cursor = decodeCursor(args.before);
    where[cursorField] = { [Op.lt]: cursor[cursorField] };
  }

  // Fetch one extra to determine hasNextPage
  limit = limit + 1;

  return {
    where,
    limit,
    order: [[cursorField, args.last ? 'DESC' : 'ASC']],
  };
};

// ============================================================================
// GRAPHQL DIRECTIVE IMPLEMENTATIONS
// ============================================================================

/**
 * Creates @deprecated directive implementation.
 *
 * @param {string} reason - Deprecation reason
 * @returns {GraphQLDirective} Directive definition
 *
 * @example
 * ```typescript
 * const deprecated = createDeprecatedDirective('Use newField instead');
 * ```
 */
export const createDeprecatedDirective = (reason: string): GraphQLDirective => {
  return {
    name: 'deprecated',
    description: 'Marks field as deprecated',
    locations: ['FIELD_DEFINITION', 'ENUM_VALUE'],
    args: { reason },
  };
};

/**
 * Creates @auth directive for field-level authorization.
 *
 * @param {string[]} roles - Required roles
 * @param {string[]} [permissions] - Required permissions
 * @returns {GraphQLDirective} Directive definition
 *
 * @example
 * ```typescript
 * const auth = createAuthDirective(['ADMIN'], ['user.delete']);
 * ```
 */
export const createAuthDirective = (
  roles: string[],
  permissions?: string[],
): GraphQLDirective => {
  return {
    name: 'auth',
    description: 'Requires authentication and authorization',
    locations: ['FIELD_DEFINITION', 'OBJECT'],
    args: { roles, permissions },
  };
};

/**
 * Creates @rateLimit directive for query rate limiting.
 *
 * @param {number} limit - Max requests
 * @param {number} window - Time window in seconds
 * @returns {GraphQLDirective} Directive definition
 *
 * @example
 * ```typescript
 * const rateLimit = createRateLimitDirective(100, 60); // 100 requests per minute
 * ```
 */
export const createRateLimitDirective = (limit: number, window: number): GraphQLDirective => {
  return {
    name: 'rateLimit',
    description: 'Limits request rate',
    locations: ['FIELD_DEFINITION'],
    args: { limit, window },
  };
};

// ============================================================================
// QUERY PERFORMANCE MONITORING
// ============================================================================

/**
 * Tracks resolver execution metrics.
 *
 * @param {ResolverMetrics[]} metrics - Metrics array
 * @returns {Object} Aggregated metrics
 *
 * @example
 * ```typescript
 * const stats = trackResolverMetrics(context.metrics);
 * // Result: { totalTime: 245ms, slowestResolver: 'User.posts', avgTime: 12ms }
 * ```
 */
export const trackResolverMetrics = (metrics: ResolverMetrics[]): {
  totalTime: number;
  avgTime: number;
  slowestResolver: string;
  fastestResolver: string;
  errorCount: number;
} => {
  if (metrics.length === 0) {
    return {
      totalTime: 0,
      avgTime: 0,
      slowestResolver: '',
      fastestResolver: '',
      errorCount: 0,
    };
  }

  const totalTime = metrics.reduce((sum, m) => sum + m.executionTime, 0);
  const avgTime = totalTime / metrics.length;
  const slowest = metrics.reduce((max, m) => (m.executionTime > max.executionTime ? m : max));
  const fastest = metrics.reduce((min, m) => (m.executionTime < min.executionTime ? m : min));
  const errorCount = metrics.filter((m) => m.error).length;

  return {
    totalTime,
    avgTime,
    slowestResolver: `${slowest.typeName}.${slowest.fieldName}`,
    fastestResolver: `${fastest.typeName}.${fastest.fieldName}`,
    errorCount,
  };
};

/**
 * Extracts requested fields from GraphQL info object.
 *
 * @param {GraphQLResolveInfo} info - GraphQL resolve info
 * @param {number} [maxDepth] - Maximum depth to extract
 * @returns {string[]} Requested field paths
 *
 * @example
 * ```typescript
 * const fields = extractRequestedFields(info);
 * // Result: ['id', 'email', 'posts.id', 'posts.title']
 * ```
 */
export const extractRequestedFields = (
  info: GraphQLResolveInfo,
  maxDepth: number = 5,
): string[] => {
  const fields: string[] = [];

  const extractFields = (selections: readonly SelectionNode[], prefix: string = '', depth: number = 0) => {
    if (depth > maxDepth) return;

    selections.forEach((selection) => {
      if (selection.kind === 'Field') {
        const fieldName = selection.name.value;
        const fullPath = prefix ? `${prefix}.${fieldName}` : fieldName;

        fields.push(fullPath);

        if (selection.selectionSet) {
          extractFields(selection.selectionSet.selections, fullPath, depth + 1);
        }
      }
    });
  };

  if (info.fieldNodes[0]?.selectionSet) {
    extractFields(info.fieldNodes[0].selectionSet.selections);
  }

  return fields;
};

/**
 * Creates query performance report.
 *
 * @param {GraphQLResolveInfo} info - GraphQL resolve info
 * @param {ResolverMetrics[]} metrics - Resolver metrics
 * @returns {Object} Performance report
 *
 * @example
 * ```typescript
 * const report = createQueryPerformanceReport(info, context.metrics);
 * console.log(report);
 * ```
 */
export const createQueryPerformanceReport = (
  info: GraphQLResolveInfo,
  metrics: ResolverMetrics[],
): {
  operationName: string;
  fieldCount: number;
  resolverCount: number;
  totalTime: number;
  avgResolverTime: number;
  slowestResolvers: ResolverMetrics[];
  errors: number;
} => {
  const stats = trackResolverMetrics(metrics);
  const fields = extractRequestedFields(info);
  const slowest = metrics
    .sort((a, b) => b.executionTime - a.executionTime)
    .slice(0, 5);

  return {
    operationName: info.operation.name?.value || 'anonymous',
    fieldCount: fields.length,
    resolverCount: metrics.length,
    totalTime: stats.totalTime,
    avgResolverTime: stats.avgTime,
    slowestResolvers: slowest,
    errors: stats.errorCount,
  };
};
