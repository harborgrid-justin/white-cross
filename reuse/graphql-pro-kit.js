"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createQueryPerformanceReport = exports.extractRequestedFields = exports.trackResolverMetrics = exports.createRateLimitDirective = exports.createAuthDirective = exports.createDeprecatedDirective = exports.applyCursorPagination = exports.createConnection = exports.decodeCursor = exports.encodeCursor = exports.handleGraphQLError = exports.createErrorFormatter = exports.formatGraphQLError = exports.sanitizeGraphQLInput = exports.transformGraphQLInput = exports.validateGraphQLInput = exports.estimateFieldComplexity = exports.calculateQueryDepth = exports.calculateQueryComplexity = exports.createPubSubMessage = exports.createSubscriptionManager = exports.createFilteredSubscription = exports.createFieldAuthorizationMiddleware = exports.createPerformanceMonitoringPlugin = exports.createDepthLimitPlugin = exports.createComplexityPlugin = exports.createCountLoader = exports.createManyToManyLoader = exports.createRelationLoader = exports.createModelLoader = exports.createCachedResolver = exports.authorizeResolver = exports.createBatchedResolver = exports.wrapResolver = exports.createCustomScalar = exports.createEnumType = exports.createInputType = exports.mapSequelizeToGraphQLType = exports.generateGraphQLTypeFromModel = void 0;
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
const dataloader_1 = __importDefault(require("dataloader"));
const sequelize_1 = require("sequelize");
const graphql_1 = require("graphql");
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
const generateGraphQLTypeFromModel = (model, typeName, excludeFields = []) => {
    const attributes = model.getAttributes();
    const fields = [];
    for (const [fieldName, attribute] of Object.entries(attributes)) {
        if (excludeFields.includes(fieldName))
            continue;
        const mapping = (0, exports.mapSequelizeToGraphQLType)(attribute.type.constructor.name);
        const nullable = attribute.allowNull !== false ? '' : '!';
        const listType = mapping.list ? `[${mapping.graphqlType}${nullable}]` : mapping.graphqlType;
        fields.push(`  ${fieldName}: ${listType}${nullable}`);
    }
    return `type ${typeName} {\n${fields.join('\n')}\n}`;
};
exports.generateGraphQLTypeFromModel = generateGraphQLTypeFromModel;
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
const mapSequelizeToGraphQLType = (sequelizeType) => {
    const typeMap = {
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
exports.mapSequelizeToGraphQLType = mapSequelizeToGraphQLType;
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
const createInputType = (typeName, fields, requiredFields = []) => {
    const fieldDefinitions = Object.entries(fields).map(([name, type]) => {
        const required = requiredFields.includes(name) ? '!' : '';
        return `  ${name}: ${type}${required}`;
    });
    return `input ${typeName}Input {\n${fieldDefinitions.join('\n')}\n}`;
};
exports.createInputType = createInputType;
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
const createEnumType = (enumName, values, description) => {
    const enumValues = Array.isArray(values) ? values : Object.keys(values);
    const desc = description ? `"""\n${description}\n"""\n` : '';
    return `${desc}enum ${enumName} {\n  ${enumValues.join('\n  ')}\n}`;
};
exports.createEnumType = createEnumType;
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
const createCustomScalar = (name, description, serialize, parseValue, parseLiteral) => {
    return new graphql_1.GraphQLScalarType({
        name,
        description,
        serialize,
        parseValue,
        parseLiteral: parseLiteral || ((ast) => parseValue(ast.value)),
    });
};
exports.createCustomScalar = createCustomScalar;
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
const wrapResolver = (resolverFn, fieldName) => {
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
        }
        catch (error) {
            const executionTime = Date.now() - startTime;
            if (context.metrics) {
                context.metrics.push({
                    fieldName,
                    typeName: info.parentType.name,
                    executionTime,
                    timestamp: new Date(),
                    complexity: 1,
                    error: error,
                });
            }
            throw (0, exports.formatGraphQLError)(error, {
                field: fieldName,
                type: info.parentType.name,
            });
        }
    };
};
exports.wrapResolver = wrapResolver;
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
const createBatchedResolver = (loaderKey, keyExtractor) => {
    return async (parent, args, context, info) => {
        const loader = context.dataloaders?.get(loaderKey);
        if (!loader) {
            throw new Error(`DataLoader "${loaderKey}" not found in context`);
        }
        const key = keyExtractor(parent);
        return loader.load(key);
    };
};
exports.createBatchedResolver = createBatchedResolver;
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
const authorizeResolver = (resolver, allowedRoles, requiredPermissions) => {
    return async (parent, args, context, info) => {
        const user = context.user;
        if (!user) {
            throw new graphql_1.GraphQLError('Authentication required', {
                extensions: { code: 'UNAUTHENTICATED' },
            });
        }
        // Check roles
        if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
            throw new graphql_1.GraphQLError('Insufficient permissions', {
                extensions: { code: 'FORBIDDEN', requiredRoles: allowedRoles },
            });
        }
        // Check permissions
        if (requiredPermissions && requiredPermissions.length > 0) {
            const hasPermissions = requiredPermissions.every((perm) => user.permissions?.includes(perm));
            if (!hasPermissions) {
                throw new graphql_1.GraphQLError('Insufficient permissions', {
                    extensions: { code: 'FORBIDDEN', requiredPermissions },
                });
            }
        }
        return resolver(parent, args, context, info);
    };
};
exports.authorizeResolver = authorizeResolver;
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
const createCachedResolver = (resolver, ttl, keyGenerator) => {
    const cache = new Map();
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
exports.createCachedResolver = createCachedResolver;
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
const createModelLoader = (model, config = {}) => {
    return new dataloader_1.default(async (ids) => {
        const records = await model.findAll({
            where: { id: ids },
        });
        const recordMap = new Map(records.map((record) => [record.get('id'), record]));
        return ids.map((id) => recordMap.get(id) || null);
    }, {
        batch: config.batch !== false,
        cache: config.cache !== false,
        maxBatchSize: config.maxBatchSize || 100,
        cacheKeyFn: config.cacheKeyFn,
        cacheMap: config.cacheMap,
    });
};
exports.createModelLoader = createModelLoader;
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
const createRelationLoader = (model, foreignKey, options = {}) => {
    return new dataloader_1.default(async (parentIds) => {
        const records = await model.findAll({
            where: {
                [foreignKey]: parentIds,
            },
            ...options,
        });
        const recordsByParentId = new Map();
        records.forEach((record) => {
            const parentId = record.get(foreignKey);
            if (!recordsByParentId.has(parentId)) {
                recordsByParentId.set(parentId, []);
            }
            recordsByParentId.get(parentId).push(record);
        });
        return parentIds.map((id) => recordsByParentId.get(id) || []);
    });
};
exports.createRelationLoader = createRelationLoader;
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
const createManyToManyLoader = (model, junctionModel, sourceKey, targetKey) => {
    return new dataloader_1.default(async (sourceIds) => {
        const junctionRecords = await junctionModel.findAll({
            where: {
                [sourceKey]: sourceIds,
            },
        });
        const targetIds = junctionRecords.map((record) => record.get(targetKey));
        const targetRecords = await model.findAll({
            where: {
                id: targetIds,
            },
        });
        const targetMap = new Map(targetRecords.map((record) => [record.get('id'), record]));
        const recordsBySourceId = new Map();
        junctionRecords.forEach((junction) => {
            const sourceId = junction.get(sourceKey);
            const targetId = junction.get(targetKey);
            const targetRecord = targetMap.get(targetId);
            if (targetRecord) {
                if (!recordsBySourceId.has(sourceId)) {
                    recordsBySourceId.set(sourceId, []);
                }
                recordsBySourceId.get(sourceId).push(targetRecord);
            }
        });
        return sourceIds.map((id) => recordsBySourceId.get(id) || []);
    });
};
exports.createManyToManyLoader = createManyToManyLoader;
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
const createCountLoader = (model, foreignKey, additionalWhere = {}) => {
    return new dataloader_1.default(async (parentIds) => {
        const counts = await model.findAll({
            attributes: [
                foreignKey,
                [model.sequelize.fn('COUNT', '*'), 'count'],
            ],
            where: {
                [foreignKey]: parentIds,
                ...additionalWhere,
            },
            group: [foreignKey],
            raw: true,
        });
        const countMap = new Map(counts.map((item) => [item[foreignKey], parseInt(item.count, 10)]));
        return parentIds.map((id) => countMap.get(id) || 0);
    });
};
exports.createCountLoader = createCountLoader;
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
const createComplexityPlugin = (maxComplexity, estimator = {}) => {
    const config = {
        defaultComplexity: estimator.defaultComplexity || 1,
        scalarCost: estimator.scalarCost || 1,
        objectCost: estimator.objectCost || 2,
        listMultiplier: estimator.listMultiplier || 10,
    };
    return {
        requestDidStart: () => ({
            didResolveOperation: ({ request, document }) => {
                const complexity = (0, exports.calculateQueryComplexity)(document, config);
                if (complexity.complexity > maxComplexity) {
                    throw new graphql_1.GraphQLError(`Query complexity ${complexity.complexity} exceeds maximum ${maxComplexity}`, {
                        extensions: {
                            code: 'COMPLEXITY_LIMIT_EXCEEDED',
                            complexity: complexity.complexity,
                            maxComplexity,
                        },
                    });
                }
            },
        }),
    };
};
exports.createComplexityPlugin = createComplexityPlugin;
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
const createDepthLimitPlugin = (maxDepth) => {
    return {
        requestDidStart: () => ({
            didResolveOperation: ({ document }) => {
                const depth = (0, exports.calculateQueryDepth)(document.definitions[0]);
                if (depth > maxDepth) {
                    throw new graphql_1.GraphQLError(`Query depth ${depth} exceeds maximum ${maxDepth}`, {
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
exports.createDepthLimitPlugin = createDepthLimitPlugin;
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
const createPerformanceMonitoringPlugin = (onMetrics) => {
    return {
        requestDidStart: () => {
            const startTime = Date.now();
            return {
                willSendResponse: ({ errors, operationName }) => {
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
exports.createPerformanceMonitoringPlugin = createPerformanceMonitoringPlugin;
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
const createFieldAuthorizationMiddleware = (rules) => {
    const ruleMap = new Map();
    rules.forEach((rule) => ruleMap.set(rule.field, rule));
    return async (resolve, parent, args, context, info) => {
        const fieldPath = `${info.parentType.name}.${info.fieldName}`;
        const rule = ruleMap.get(fieldPath);
        if (rule) {
            const user = context.user;
            if (!user) {
                throw new graphql_1.GraphQLError('Authentication required', {
                    extensions: { code: 'UNAUTHENTICATED' },
                });
            }
            // Check roles
            if (rule.roles && !rule.roles.includes(user.role)) {
                return null; // Hide field
            }
            // Check permissions
            if (rule.permissions) {
                const hasPermissions = rule.permissions.every((perm) => user.permissions?.includes(perm));
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
exports.createFieldAuthorizationMiddleware = createFieldAuthorizationMiddleware;
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
const createFilteredSubscription = (config) => {
    return {
        subscribe: (parent, args, context) => {
            const pubsub = context.pubsub;
            if (!pubsub) {
                throw new Error('PubSub not found in context');
            }
            return pubsub.asyncIterator(config.topic);
        },
        resolve: config.resolve
            ? config.resolve
            : (payload) => payload,
    };
};
exports.createFilteredSubscription = createFilteredSubscription;
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
const createSubscriptionManager = (subscriptions) => {
    return {
        add: (id, subscription) => {
            subscriptions.set(id, subscription);
        },
        remove: (id) => {
            const subscription = subscriptions.get(id);
            if (subscription && subscription.unsubscribe) {
                subscription.unsubscribe();
            }
            subscriptions.delete(id);
        },
        get: (id) => {
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
exports.createSubscriptionManager = createSubscriptionManager;
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
const createPubSubMessage = (topic, payload, metadata = {}) => {
    return {
        topic,
        payload,
        metadata,
        timestamp: Date.now(),
    };
};
exports.createPubSubMessage = createPubSubMessage;
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
const calculateQueryComplexity = (document, estimator) => {
    let complexity = 0;
    let fieldCount = 0;
    const depths = [];
    const visit = (node, depth = 0) => {
        if (node.kind === 'Field') {
            fieldCount++;
            complexity += estimator.defaultComplexity;
            depths.push(depth);
        }
        if (node.selectionSet) {
            node.selectionSet.selections.forEach((selection) => {
                visit(selection, depth + 1);
            });
        }
    };
    if (document.definitions) {
        document.definitions.forEach((def) => {
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
exports.calculateQueryComplexity = calculateQueryComplexity;
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
const calculateQueryDepth = (node, currentDepth = 0) => {
    if (!node.selectionSet || !node.selectionSet.selections) {
        return currentDepth;
    }
    const depths = node.selectionSet.selections.map((selection) => (0, exports.calculateQueryDepth)(selection, currentDepth + 1));
    return Math.max(...depths, currentDepth);
};
exports.calculateQueryDepth = calculateQueryDepth;
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
const estimateFieldComplexity = (fieldName, fieldCosts, args) => {
    const baseCost = fieldCosts[fieldName] || 1;
    const limit = args.limit || args.first || args.last || 1;
    return baseCost * limit;
};
exports.estimateFieldComplexity = estimateFieldComplexity;
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
const validateGraphQLInput = async (input, rules) => {
    const errors = [];
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
exports.validateGraphQLInput = validateGraphQLInput;
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
const transformGraphQLInput = (input, transformers) => {
    const transformed = { ...input };
    for (const [field, transformer] of Object.entries(transformers)) {
        if (field in transformed) {
            transformed[field] = transformer(transformed[field]);
        }
    }
    return transformed;
};
exports.transformGraphQLInput = transformGraphQLInput;
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
const sanitizeGraphQLInput = (input, deep = false) => {
    if (Array.isArray(input)) {
        return input
            .filter((item) => item !== null && item !== undefined)
            .map((item) => (deep && typeof item === 'object' ? (0, exports.sanitizeGraphQLInput)(item, deep) : item));
    }
    if (typeof input === 'object' && input !== null) {
        const sanitized = {};
        for (const [key, value] of Object.entries(input)) {
            if (value !== null && value !== undefined) {
                sanitized[key] = deep && typeof value === 'object' ? (0, exports.sanitizeGraphQLInput)(value, deep) : value;
            }
        }
        return sanitized;
    }
    return input;
};
exports.sanitizeGraphQLInput = sanitizeGraphQLInput;
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
const formatGraphQLError = (error, extensions = {}) => {
    const errorExtension = {
        code: extensions.code || 'INTERNAL_SERVER_ERROR',
        timestamp: new Date().toISOString(),
        ...extensions,
    };
    // Don't expose stack traces in production
    if (process.env.NODE_ENV !== 'production') {
        errorExtension.stacktrace = error.stack?.split('\n');
    }
    return new graphql_1.GraphQLError(error.message, {
        extensions: errorExtension,
    });
};
exports.formatGraphQLError = formatGraphQLError;
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
const createErrorFormatter = (includeStackTrace = false) => {
    return (error) => {
        const formatted = {
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
exports.createErrorFormatter = createErrorFormatter;
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
const handleGraphQLError = (error, logger) => {
    if (logger) {
        logger(error);
    }
    else {
        console.error('[GraphQL Error]', {
            message: error.message,
            code: error.extensions?.code,
            path: error.path,
            timestamp: new Date().toISOString(),
        });
    }
    return error;
};
exports.handleGraphQLError = handleGraphQLError;
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
const encodeCursor = (data) => {
    return Buffer.from(JSON.stringify(data)).toString('base64');
};
exports.encodeCursor = encodeCursor;
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
const decodeCursor = (cursor) => {
    try {
        return JSON.parse(Buffer.from(cursor, 'base64').toString('utf-8'));
    }
    catch (error) {
        throw new graphql_1.GraphQLError('Invalid cursor', {
            extensions: { code: 'INVALID_CURSOR' },
        });
    }
};
exports.decodeCursor = decodeCursor;
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
const createConnection = (records, args, cursorExtractor) => {
    const edges = records.map((record) => ({
        cursor: cursorExtractor(record),
        node: record,
    }));
    const hasNextPage = args.first ? records.length === args.first : false;
    const hasPreviousPage = !!args.after;
    const pageInfo = {
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
exports.createConnection = createConnection;
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
const applyCursorPagination = (args, cursorField = 'id') => {
    const where = {};
    let limit = args.first || args.last || 10;
    if (args.after) {
        const cursor = (0, exports.decodeCursor)(args.after);
        where[cursorField] = { [sequelize_1.Op.gt]: cursor[cursorField] };
    }
    if (args.before) {
        const cursor = (0, exports.decodeCursor)(args.before);
        where[cursorField] = { [sequelize_1.Op.lt]: cursor[cursorField] };
    }
    // Fetch one extra to determine hasNextPage
    limit = limit + 1;
    return {
        where,
        limit,
        order: [[cursorField, args.last ? 'DESC' : 'ASC']],
    };
};
exports.applyCursorPagination = applyCursorPagination;
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
const createDeprecatedDirective = (reason) => {
    return {
        name: 'deprecated',
        description: 'Marks field as deprecated',
        locations: ['FIELD_DEFINITION', 'ENUM_VALUE'],
        args: { reason },
    };
};
exports.createDeprecatedDirective = createDeprecatedDirective;
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
const createAuthDirective = (roles, permissions) => {
    return {
        name: 'auth',
        description: 'Requires authentication and authorization',
        locations: ['FIELD_DEFINITION', 'OBJECT'],
        args: { roles, permissions },
    };
};
exports.createAuthDirective = createAuthDirective;
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
const createRateLimitDirective = (limit, window) => {
    return {
        name: 'rateLimit',
        description: 'Limits request rate',
        locations: ['FIELD_DEFINITION'],
        args: { limit, window },
    };
};
exports.createRateLimitDirective = createRateLimitDirective;
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
const trackResolverMetrics = (metrics) => {
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
exports.trackResolverMetrics = trackResolverMetrics;
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
const extractRequestedFields = (info, maxDepth = 5) => {
    const fields = [];
    const extractFields = (selections, prefix = '', depth = 0) => {
        if (depth > maxDepth)
            return;
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
exports.extractRequestedFields = extractRequestedFields;
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
const createQueryPerformanceReport = (info, metrics) => {
    const stats = (0, exports.trackResolverMetrics)(metrics);
    const fields = (0, exports.extractRequestedFields)(info);
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
exports.createQueryPerformanceReport = createQueryPerformanceReport;
//# sourceMappingURL=graphql-pro-kit.js.map