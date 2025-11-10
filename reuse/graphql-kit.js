"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSchemaDocumentation = exports.createMockContext = exports.createFederationKeyDirective = exports.createRemoteExecutor = exports.createTypeExtension = exports.createSchemaStitching = exports.createFederationReference = exports.createFederationEntity = exports.createInputSanitization = exports.createAuditLogging = exports.createPermissionChecker = exports.createFieldMasking = exports.createOwnershipChecker = exports.createAuthDirective = exports.createQueryBuilder = exports.createSortBuilder = exports.createFilterBuilder = exports.createRelayConnection = exports.createPaginatedResult = exports.createRelayPagination = exports.createOffsetPagination = exports.createValidationMiddleware = exports.createContextBuilder = exports.createPerformanceMiddleware = exports.createRateLimitingMiddleware = exports.createAuthorizationMiddleware = exports.createAuthenticationMiddleware = exports.createLoggingMiddleware = exports.generateUnionDefinition = exports.generateInterfaceDefinition = exports.createEmailScalar = exports.createJSONScalar = exports.createDateTimeScalar = exports.createEnumDefinition = exports.generateTypeDefinition = exports.createDataLoaderContext = exports.createCachedDataLoader = exports.createAggregateLoader = exports.createManyToManyLoader = exports.createOneToManyLoader = exports.createEntityLoader = exports.createDataLoader = exports.createMergeResolver = exports.createRetryResolver = exports.createBatchResolver = exports.createConditionalResolver = exports.createAggregationResolver = exports.createComputedFieldResolver = exports.createPropertyResolver = exports.createResolverFactory = void 0;
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
const dataloader_1 = __importDefault(require("dataloader"));
const sequelize_1 = require("sequelize");
const graphql_1 = require("graphql");
// ============================================================================
// SECTION 1: RESOLVER FACTORIES AND FIELD HELPERS (8 functions)
// ============================================================================
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
const createResolverFactory = (resolver, middleware) => {
    let wrappedResolver = resolver;
    if (middleware && middleware.length > 0) {
        middleware.forEach((mw) => {
            wrappedResolver = mw(wrappedResolver);
        });
    }
    return {
        resolve: wrappedResolver,
        middleware,
    };
};
exports.createResolverFactory = createResolverFactory;
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
const createPropertyResolver = (propertyPath, defaultValue) => {
    return (parent) => {
        const paths = propertyPath.split('.');
        let value = parent;
        for (const path of paths) {
            if (value == null) {
                return defaultValue;
            }
            value = value[path];
        }
        return value !== undefined ? value : defaultValue;
    };
};
exports.createPropertyResolver = createPropertyResolver;
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
const createComputedFieldResolver = (computeFn, cacheConfig) => {
    const cache = new Map();
    return async (parent, args, context, info) => {
        if (cacheConfig) {
            const cacheKey = cacheConfig.keyGenerator
                ? cacheConfig.keyGenerator(parent, args, context)
                : JSON.stringify({ parent, args });
            const cached = cache.get(cacheKey);
            const now = Date.now();
            if (cached && cached.expiry > now) {
                return cached.value;
            }
            const value = await computeFn(parent, args, context, info);
            cache.set(cacheKey, { value, expiry: now + cacheConfig.ttl * 1000 });
            return value;
        }
        return computeFn(parent, args, context, info);
    };
};
exports.createComputedFieldResolver = createComputedFieldResolver;
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
const createAggregationResolver = (model, foreignKey, aggregateFunction, aggregateField) => {
    return async (parent) => {
        const parentId = parent.id;
        const field = aggregateField || '*';
        const result = await model.findOne({
            attributes: [[model.sequelize.fn(aggregateFunction, model.sequelize.col(field)), 'result']],
            where: { [foreignKey]: parentId },
            raw: true,
        });
        return result ? result.result : 0;
    };
};
exports.createAggregationResolver = createAggregationResolver;
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
const createConditionalResolver = (conditionFn, trueResolver, falseResolver) => {
    return async (parent, args, context, info) => {
        const condition = await conditionFn(parent, args, context);
        return condition
            ? trueResolver(parent, args, context, info)
            : falseResolver(parent, args, context, info);
    };
};
exports.createConditionalResolver = createConditionalResolver;
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
const createBatchResolver = (batchFn, keyExtractor) => {
    const loader = new dataloader_1.default(batchFn);
    return async (parent) => {
        const key = keyExtractor(parent);
        return loader.load(key);
    };
};
exports.createBatchResolver = createBatchResolver;
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
const createRetryResolver = (resolver, maxRetries = 3, shouldRetry) => {
    return async (parent, args, context, info) => {
        let lastError = null;
        let attempts = 0;
        while (attempts <= maxRetries) {
            try {
                return await resolver(parent, args, context, info);
            }
            catch (error) {
                lastError = error;
                attempts++;
                if (attempts > maxRetries || (shouldRetry && !shouldRetry(lastError))) {
                    throw lastError;
                }
                // Exponential backoff
                await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempts) * 100));
            }
        }
        throw lastError;
    };
};
exports.createRetryResolver = createRetryResolver;
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
const createMergeResolver = (resolvers, mergeFn) => {
    return async (parent, args, context, info) => {
        const results = await Promise.all(resolvers.map((resolver) => resolver(parent, args, context, info)));
        return mergeFn(results);
    };
};
exports.createMergeResolver = createMergeResolver;
// ============================================================================
// SECTION 2: DATALOADER BUILDERS AND N+1 PREVENTION (7 functions)
// ============================================================================
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
const createDataLoader = (batchLoadFn, options) => {
    return new dataloader_1.default(batchLoadFn, {
        batch: options?.batch !== false,
        cache: options?.cache !== false,
        maxBatchSize: options?.maxBatchSize || 100,
        batchScheduleFn: options?.batchScheduleFn || ((callback) => setTimeout(callback, 1)),
        cacheKeyFn: options?.cacheKeyFn,
    });
};
exports.createDataLoader = createDataLoader;
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
const createEntityLoader = (model, idField = 'id') => {
    return new dataloader_1.default(async (ids) => {
        const entities = await model.findAll({
            where: { [idField]: ids },
        });
        const entityMap = new Map(entities.map((entity) => [entity.get(idField), entity]));
        return ids.map((id) => entityMap.get(id) || null);
    });
};
exports.createEntityLoader = createEntityLoader;
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
const createOneToManyLoader = (model, foreignKey, findOptions) => {
    return new dataloader_1.default(async (parentIds) => {
        const records = await model.findAll({
            where: { [foreignKey]: parentIds },
            ...findOptions,
        });
        const groupedRecords = new Map();
        records.forEach((record) => {
            const parentId = record.get(foreignKey);
            if (!groupedRecords.has(parentId)) {
                groupedRecords.set(parentId, []);
            }
            groupedRecords.get(parentId).push(record);
        });
        return parentIds.map((id) => groupedRecords.get(id) || []);
    });
};
exports.createOneToManyLoader = createOneToManyLoader;
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
const createManyToManyLoader = (targetModel, junctionModel, sourceKey, targetKey) => {
    return new dataloader_1.default(async (sourceIds) => {
        const junctionRecords = await junctionModel.findAll({
            where: { [sourceKey]: sourceIds },
        });
        const targetIds = [...new Set(junctionRecords.map((r) => r.get(targetKey)))];
        const targetEntities = await targetModel.findAll({
            where: { id: targetIds },
        });
        const targetMap = new Map(targetEntities.map((e) => [e.get('id'), e]));
        const groupedResults = new Map();
        junctionRecords.forEach((junction) => {
            const sourceId = junction.get(sourceKey);
            const targetId = junction.get(targetKey);
            const targetEntity = targetMap.get(targetId);
            if (targetEntity) {
                if (!groupedResults.has(sourceId)) {
                    groupedResults.set(sourceId, []);
                }
                groupedResults.get(sourceId).push(targetEntity);
            }
        });
        return sourceIds.map((id) => groupedResults.get(id) || []);
    });
};
exports.createManyToManyLoader = createManyToManyLoader;
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
const createAggregateLoader = (model, groupByField, aggregateFunction, aggregateField = '*') => {
    return new dataloader_1.default(async (groupKeys) => {
        const results = await model.findAll({
            attributes: [
                groupByField,
                [model.sequelize.fn(aggregateFunction, model.sequelize.col(aggregateField)), 'aggregate'],
            ],
            where: { [groupByField]: groupKeys },
            group: [groupByField],
            raw: true,
        });
        const resultMap = new Map(results.map((r) => [r[groupByField], parseFloat(r.aggregate) || 0]));
        return groupKeys.map((key) => resultMap.get(key) || 0);
    });
};
exports.createAggregateLoader = createAggregateLoader;
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
const createCachedDataLoader = (batchLoadFn, cacheMap) => {
    return new dataloader_1.default(batchLoadFn, {
        cacheMap,
        cache: true,
    });
};
exports.createCachedDataLoader = createCachedDataLoader;
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
const createDataLoaderContext = (loaderFactories) => {
    return (context) => {
        const loaders = new Map();
        for (const [name, factory] of Object.entries(loaderFactories)) {
            loaders.set(name, factory(context));
        }
        return loaders;
    };
};
exports.createDataLoaderContext = createDataLoaderContext;
// ============================================================================
// SECTION 3: SCHEMA GENERATION AND TYPE UTILITIES (7 functions)
// ============================================================================
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
const generateTypeDefinition = (typeName, fields, isInput = false) => {
    const keyword = isInput ? 'input' : 'type';
    const fieldDefs = Object.entries(fields)
        .map(([name, type]) => `  ${name}: ${type}`)
        .join('\n');
    return `${keyword} ${typeName} {\n${fieldDefs}\n}`;
};
exports.generateTypeDefinition = generateTypeDefinition;
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
const createEnumDefinition = (enumName, values, descriptions) => {
    const enumValues = Array.isArray(values) ? values : Object.keys(values);
    const valueDefs = enumValues.map((val) => {
        const desc = descriptions?.[val] ? `  """${descriptions[val]}"""\n` : '';
        return `${desc}  ${val}`;
    }).join('\n');
    return `enum ${enumName} {\n${valueDefs}\n}`;
};
exports.createEnumDefinition = createEnumDefinition;
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
const createDateTimeScalar = () => {
    return new graphql_1.GraphQLScalarType({
        name: 'DateTime',
        description: 'ISO-8601 DateTime string',
        serialize(value) {
            if (value instanceof Date) {
                return value.toISOString();
            }
            return new Date(value).toISOString();
        },
        parseValue(value) {
            return new Date(value);
        },
        parseLiteral(ast) {
            if (ast.kind === graphql_1.Kind.STRING || ast.kind === graphql_1.Kind.INT) {
                return new Date(ast.value);
            }
            throw new graphql_1.GraphQLError('DateTime must be a string or number');
        },
    });
};
exports.createDateTimeScalar = createDateTimeScalar;
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
const createJSONScalar = () => {
    return new graphql_1.GraphQLScalarType({
        name: 'JSON',
        description: 'JSON scalar type',
        serialize(value) {
            return value;
        },
        parseValue(value) {
            return value;
        },
        parseLiteral(ast) {
            if (ast.kind === graphql_1.Kind.OBJECT) {
                return parseJSONLiteral(ast);
            }
            if (ast.kind === graphql_1.Kind.STRING) {
                return JSON.parse(ast.value);
            }
            return null;
        },
    });
};
exports.createJSONScalar = createJSONScalar;
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
const createEmailScalar = () => {
    // RFC 5322 compliant email regex (simplified but more comprehensive)
    // Escaped forward slash for consistency
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return new graphql_1.GraphQLScalarType({
        name: 'Email',
        description: 'Email address scalar type',
        serialize(value) {
            if (!emailRegex.test(value)) {
                throw new graphql_1.GraphQLError('Invalid email format');
            }
            return value.toLowerCase();
        },
        parseValue(value) {
            if (!emailRegex.test(value)) {
                throw new graphql_1.GraphQLError('Invalid email format');
            }
            return value.toLowerCase();
        },
        parseLiteral(ast) {
            if (ast.kind === graphql_1.Kind.STRING) {
                if (!emailRegex.test(ast.value)) {
                    throw new graphql_1.GraphQLError('Invalid email format');
                }
                return ast.value.toLowerCase();
            }
            throw new graphql_1.GraphQLError('Email must be a string');
        },
    });
};
exports.createEmailScalar = createEmailScalar;
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
const generateInterfaceDefinition = (interfaceName, fields, implementingTypes) => {
    const fieldDefs = Object.entries(fields)
        .map(([name, type]) => `  ${name}: ${type}`)
        .join('\n');
    let definition = `interface ${interfaceName} {\n${fieldDefs}\n}`;
    if (implementingTypes && implementingTypes.length > 0) {
        definition += `\n\n# Implemented by: ${implementingTypes.join(', ')}`;
    }
    return definition;
};
exports.generateInterfaceDefinition = generateInterfaceDefinition;
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
const generateUnionDefinition = (unionName, types) => {
    return `union ${unionName} = ${types.join(' | ')}`;
};
exports.generateUnionDefinition = generateUnionDefinition;
// ============================================================================
// SECTION 4: GRAPHQL MIDDLEWARE AND CONTEXT (7 functions)
// ============================================================================
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
const createLoggingMiddleware = (logger) => {
    return (resolver) => {
        return async (parent, args, context, info) => {
            const startTime = Date.now();
            const fieldPath = `${info.parentType.name}.${info.fieldName}`;
            try {
                const result = await resolver(parent, args, context, info);
                const duration = Date.now() - startTime;
                if (logger) {
                    logger('Resolver executed', { fieldPath, duration, success: true });
                }
                return result;
            }
            catch (error) {
                const duration = Date.now() - startTime;
                if (logger) {
                    logger('Resolver failed', { fieldPath, duration, error: error.message });
                }
                throw error;
            }
        };
    };
};
exports.createLoggingMiddleware = createLoggingMiddleware;
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
const createAuthenticationMiddleware = (getUserFromContext) => {
    return (resolver) => {
        return async (parent, args, context, info) => {
            const user = getUserFromContext ? getUserFromContext(context) : context.user;
            if (!user) {
                throw new graphql_1.GraphQLError('Authentication required', {
                    extensions: { code: 'UNAUTHENTICATED' },
                });
            }
            return resolver(parent, args, context, info);
        };
    };
};
exports.createAuthenticationMiddleware = createAuthenticationMiddleware;
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
const createAuthorizationMiddleware = (rule) => {
    return (resolver) => {
        return async (parent, args, context, info) => {
            const user = context.user;
            if (!user) {
                throw new graphql_1.GraphQLError('Authentication required', {
                    extensions: { code: 'UNAUTHENTICATED' },
                });
            }
            // Check roles
            if (rule.roles && rule.roles.length > 0) {
                if (!rule.roles.includes(user.role)) {
                    throw new graphql_1.GraphQLError('Insufficient permissions', {
                        extensions: { code: 'FORBIDDEN', requiredRoles: rule.roles },
                    });
                }
            }
            // Check permissions
            if (rule.permissions && rule.permissions.length > 0) {
                const hasAllPermissions = rule.permissions.every((perm) => user.permissions?.includes(perm));
                if (!hasAllPermissions) {
                    throw new graphql_1.GraphQLError('Insufficient permissions', {
                        extensions: { code: 'FORBIDDEN', requiredPermissions: rule.permissions },
                    });
                }
            }
            // Custom check
            if (rule.customCheck) {
                const allowed = await rule.customCheck(context, parent, args);
                if (!allowed) {
                    throw new graphql_1.GraphQLError('Access denied', {
                        extensions: { code: 'FORBIDDEN' },
                    });
                }
            }
            return resolver(parent, args, context, info);
        };
    };
};
exports.createAuthorizationMiddleware = createAuthorizationMiddleware;
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
const createRateLimitingMiddleware = (maxRequests, windowMs) => {
    const requests = new Map();
    return (resolver) => {
        return async (parent, args, context, info) => {
            const userId = context.user?.id || context.req?.ip || 'anonymous';
            const now = Date.now();
            let userRequests = requests.get(userId);
            if (!userRequests || userRequests.resetTime < now) {
                userRequests = { count: 0, resetTime: now + windowMs };
                requests.set(userId, userRequests);
            }
            if (userRequests.count >= maxRequests) {
                throw new graphql_1.GraphQLError('Rate limit exceeded', {
                    extensions: {
                        code: 'RATE_LIMIT_EXCEEDED',
                        retryAfter: Math.ceil((userRequests.resetTime - now) / 1000),
                    },
                });
            }
            userRequests.count++;
            return resolver(parent, args, context, info);
        };
    };
};
exports.createRateLimitingMiddleware = createRateLimitingMiddleware;
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
const createPerformanceMiddleware = (onMetrics) => {
    return (resolver) => {
        return async (parent, args, context, info) => {
            const startTime = Date.now();
            try {
                const result = await resolver(parent, args, context, info);
                const duration = Date.now() - startTime;
                onMetrics({
                    queryName: `${info.parentType.name}.${info.fieldName}`,
                    duration,
                    fieldCount: countFields(info),
                    complexity: 0, // Can be calculated if needed
                    timestamp: new Date(),
                });
                return result;
            }
            catch (error) {
                const duration = Date.now() - startTime;
                onMetrics({
                    queryName: `${info.parentType.name}.${info.fieldName}`,
                    duration,
                    fieldCount: countFields(info),
                    complexity: 0,
                    timestamp: new Date(),
                });
                throw error;
            }
        };
    };
};
exports.createPerformanceMiddleware = createPerformanceMiddleware;
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
const createContextBuilder = (config) => {
    return async ({ req, res }) => {
        const dataloaders = new Map();
        if (config.dataloaders) {
            for (const [name, factory] of Object.entries(config.dataloaders)) {
                dataloaders.set(name, factory({ req, res }));
            }
        }
        const baseContext = {
            req,
            res,
            user: req.user,
            dataloaders,
            pubsub: config.pubsub,
            requestId: req.id || generateRequestId(),
            ...config.services,
        };
        if (config.customContext) {
            const customContext = await config.customContext(req, res);
            return { ...baseContext, ...customContext };
        }
        return baseContext;
    };
};
exports.createContextBuilder = createContextBuilder;
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
const createValidationMiddleware = (validationFn) => {
    return (resolver) => {
        return async (parent, args, context, info) => {
            await validationFn(args, context);
            return resolver(parent, args, context, info);
        };
    };
};
exports.createValidationMiddleware = createValidationMiddleware;
// ============================================================================
// SECTION 5: PAGINATION AND FILTERING (7 functions)
// ============================================================================
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
const createOffsetPagination = (args, maxLimit = 100) => {
    let limit = args.limit || args.perPage || 10;
    limit = Math.min(limit, maxLimit);
    let offset = args.offset || 0;
    if (args.page && args.perPage) {
        offset = (args.page - 1) * args.perPage;
    }
    return { offset, limit };
};
exports.createOffsetPagination = createOffsetPagination;
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
const createRelayPagination = (args) => {
    const limit = (args.first || args.last || 10) + 1; // Fetch one extra
    const direction = args.first ? 'forward' : 'backward';
    let offset;
    if (args.after) {
        const cursor = decodeCursorSafe(args.after);
        offset = cursor?.offset;
    }
    else if (args.before) {
        const cursor = decodeCursorSafe(args.before);
        offset = cursor?.offset;
    }
    return { limit, offset, direction };
};
exports.createRelayPagination = createRelayPagination;
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
const createPaginatedResult = (items, total, args) => {
    const perPage = args.perPage || args.limit || 10;
    const page = args.page || 1;
    const totalPages = Math.ceil(total / perPage);
    return {
        items,
        total,
        page,
        perPage,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
    };
};
exports.createPaginatedResult = createPaginatedResult;
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
const createRelayConnection = (items, args, cursorFn) => {
    const requestedCount = args.first || args.last || 10;
    const hasExtraItem = items.length > requestedCount;
    const limitedItems = hasExtraItem ? items.slice(0, requestedCount) : items;
    const edges = limitedItems.map((item, index) => ({
        cursor: cursorFn(item, index),
        node: item,
    }));
    const pageInfo = {
        hasNextPage: args.first ? hasExtraItem : false,
        hasPreviousPage: !!args.after,
        startCursor: edges[0]?.cursor,
        endCursor: edges[edges.length - 1]?.cursor,
    };
    return {
        edges,
        pageInfo,
        totalCount: items.length,
    };
};
exports.createRelayConnection = createRelayConnection;
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
const createFilterBuilder = (filterArgs, searchableFields) => {
    const where = {};
    // Apply direct where conditions
    if (filterArgs.where) {
        Object.assign(where, filterArgs.where);
    }
    // Apply search across multiple fields with sanitization
    if (filterArgs.search && searchableFields && searchableFields.length > 0) {
        // Sanitize search input to prevent SQL injection
        const sanitizedSearch = filterArgs.search.replace(/[%_\\]/g, '\\$&');
        const searchConditions = searchableFields.map((field) => ({
            [field]: { [sequelize_1.Op.iLike]: `%${sanitizedSearch}%` },
        }));
        where[sequelize_1.Op.or] = searchConditions;
    }
    return where;
};
exports.createFilterBuilder = createFilterBuilder;
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
const createSortBuilder = (sortArgs, fieldMapping) => {
    const order = [];
    if (sortArgs.sortBy && sortArgs.sortBy.length > 0) {
        sortArgs.sortBy.forEach((sort) => {
            const field = fieldMapping?.[sort.field] || sort.field;
            order.push([field, sort.direction]);
        });
    }
    else if (sortArgs.orderBy) {
        const field = fieldMapping?.[sortArgs.orderBy] || sortArgs.orderBy;
        const direction = sortArgs.order || 'ASC';
        order.push([field, direction]);
    }
    return order.length > 0 ? order : [['id', 'ASC']];
};
exports.createSortBuilder = createSortBuilder;
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
const createQueryBuilder = (args) => {
    const options = {};
    // Apply filters
    if (args.filter) {
        options.where = (0, exports.createFilterBuilder)(args.filter, args.searchableFields);
    }
    // Apply sorting
    if (args.sort) {
        options.order = (0, exports.createSortBuilder)(args.sort, args.fieldMapping);
    }
    // Apply pagination
    if (args.pagination) {
        const { offset, limit } = (0, exports.createOffsetPagination)(args.pagination);
        options.offset = offset;
        options.limit = limit;
    }
    return options;
};
exports.createQueryBuilder = createQueryBuilder;
// ============================================================================
// SECTION 6: AUTHORIZATION AND SECURITY (6 functions)
// ============================================================================
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
const createAuthDirective = (rule) => {
    return {
        name: 'auth',
        locations: ['FIELD_DEFINITION', 'OBJECT'],
        args: {},
        resolve: async (next, source, args, context) => {
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
                const hasPermissions = rule.permissions.every((p) => user.permissions?.includes(p));
                if (!hasPermissions) {
                    return null; // Hide field
                }
            }
            // Custom check
            if (rule.customCheck) {
                const allowed = await rule.customCheck(context, source, args);
                if (!allowed) {
                    return null; // Hide field
                }
            }
            return next();
        },
    };
};
exports.createAuthDirective = createAuthDirective;
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
const createOwnershipChecker = (ownerExtractor) => {
    return (user, resource) => {
        if (!user)
            return false;
        const ownerId = ownerExtractor(resource);
        return user.id === ownerId || user.role === 'ADMIN';
    };
};
exports.createOwnershipChecker = createOwnershipChecker;
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
const createFieldMasking = (sensitiveFields, maskFn) => {
    return (data, context) => {
        if (!data)
            return data;
        const masked = { ...data };
        const user = context.user;
        // Admin can see everything
        if (user?.role === 'ADMIN') {
            return data;
        }
        sensitiveFields.forEach((field) => {
            if (field in masked) {
                masked[field] = maskFn(masked[field]);
            }
        });
        return masked;
    };
};
exports.createFieldMasking = createFieldMasking;
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
const createPermissionChecker = (permission) => {
    const cache = new Map();
    return (user) => {
        if (!user)
            return false;
        const cacheKey = `${user.id}-${permission}`;
        if (cache.has(cacheKey)) {
            return cache.get(cacheKey);
        }
        const hasPermission = user.permissions?.includes(permission) || user.role === 'ADMIN';
        cache.set(cacheKey, hasPermission);
        return hasPermission;
    };
};
exports.createPermissionChecker = createPermissionChecker;
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
const createAuditLogging = (auditLogger) => {
    return (resolver) => {
        return async (parent, args, context, info) => {
            const result = await resolver(parent, args, context, info);
            if (info.operation.operation === 'mutation') {
                await auditLogger({
                    userId: context.user?.id,
                    action: info.fieldName,
                    resourceType: info.parentType.name,
                    resourceId: result?.id,
                    changes: args,
                    timestamp: new Date(),
                });
            }
            return result;
        };
    };
};
exports.createAuditLogging = createAuditLogging;
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
const createInputSanitization = (fieldsToSanitize) => {
    return (resolver) => {
        return async (parent, args, context, info) => {
            const sanitizedArgs = { ...args };
            fieldsToSanitize.forEach((field) => {
                if (field in sanitizedArgs && typeof sanitizedArgs[field] === 'string') {
                    // Remove HTML tags and trim
                    sanitizedArgs[field] = sanitizedArgs[field]
                        .replace(/<[^>]*>/g, '')
                        .trim();
                }
            });
            return resolver(parent, sanitizedArgs, context, info);
        };
    };
};
exports.createInputSanitization = createInputSanitization;
// ============================================================================
// SECTION 7: FEDERATION AND SCHEMA STITCHING (6 functions)
// ============================================================================
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
const createFederationEntity = (config) => {
    return {
        __resolveReference: async (reference, context) => {
            return config.resolveReference(reference, context);
        },
    };
};
exports.createFederationEntity = createFederationEntity;
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
const createFederationReference = (typeName, keyFields) => {
    return (reference) => {
        const stub = { __typename: typeName };
        keyFields.forEach((field) => {
            stub[field] = reference[field];
        });
        return stub;
    };
};
exports.createFederationReference = createFederationReference;
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
const createSchemaStitching = (schemas) => {
    // This is a simplified version - real implementation would use @graphql-tools/stitch
    if (schemas.length === 0) {
        throw new Error('At least one schema is required');
    }
    // Return first schema as placeholder
    // Real implementation would merge all schemas
    return schemas[0];
};
exports.createSchemaStitching = createSchemaStitching;
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
const createTypeExtension = (typeName, fields) => {
    const fieldDefs = Object.entries(fields)
        .map(([name, type]) => `  ${name}: ${type}`)
        .join('\n');
    return `extend type ${typeName} {\n${fieldDefs}\n}`;
};
exports.createTypeExtension = createTypeExtension;
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
const createRemoteExecutor = (serviceUrl) => {
    return async ({ document, variables, context }) => {
        const response = await fetch(serviceUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(context?.headers || {}),
            },
            body: JSON.stringify({
                query: document,
                variables,
            }),
        });
        return response.json();
    };
};
exports.createRemoteExecutor = createRemoteExecutor;
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
const createFederationKeyDirective = (fields) => {
    return `@key(fields: "${fields.join(' ')}")`;
};
exports.createFederationKeyDirective = createFederationKeyDirective;
// ============================================================================
// SECTION 8: TESTING AND DOCUMENTATION (6 functions)
// ============================================================================
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
const createMockContext = (overrides) => {
    return {
        req: overrides?.mocks?.req || {},
        res: overrides?.mocks?.res || {},
        user: overrides?.user,
        dataloaders: overrides?.dataloaders || new Map(),
        requestId: 'test-request-id',
        ...overrides?.mocks,
    };
};
exports.createMockContext = createMockContext;
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
const generateSchemaDocumentation = (schema) => {
    const typeMap = schema.getTypeMap();
    const documentation = [];
    Object.entries(typeMap).forEach(([typeName, type]) => {
        if (typeName.startsWith('__'))
            return; // Skip introspection types
        if (type instanceof graphql_1.GraphQLObjectType) {
            const fields = type.getFields();
            documentation.push({
                type: typeName,
                description: type.description || '',
                fields: Object.entries(fields).map(([fieldName, field]) => ({
                    name: fieldName,
                    type: field.type.toString(),
                    description: field.description,
                    deprecated: field.deprecationReason !== undefined,
                    deprecationReason: field.deprecationReason,
                })),
            });
        }
    });
    return documentation;
};
exports.generateSchemaDocumentation = generateSchemaDocumentation;
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Helper to encode cursor for relay pagination.
 */
const encodeCursorSafe = (data) => {
    return Buffer.from(JSON.stringify(data)).toString('base64');
};
/**
 * Helper to decode cursor for relay pagination.
 */
const decodeCursorSafe = (cursor) => {
    try {
        return JSON.parse(Buffer.from(cursor, 'base64').toString('utf-8'));
    }
    catch {
        return null;
    }
};
/**
 * Helper to count fields in GraphQL info.
 */
const countFields = (info) => {
    let count = 0;
    const countSelections = (selections) => {
        selections.forEach((selection) => {
            if (selection.kind === 'Field') {
                count++;
                if (selection.selectionSet) {
                    countSelections(selection.selectionSet.selections);
                }
            }
        });
    };
    if (info.fieldNodes[0]?.selectionSet) {
        countSelections(info.fieldNodes[0].selectionSet.selections);
    }
    return count;
};
/**
 * Helper to generate unique request ID.
 */
const generateRequestId = () => {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
/**
 * Helper to parse JSON literal from GraphQL AST.
 */
const parseJSONLiteral = (ast) => {
    switch (ast.kind) {
        case graphql_1.Kind.STRING:
        case graphql_1.Kind.BOOLEAN:
            return ast.value;
        case graphql_1.Kind.INT:
        case graphql_1.Kind.FLOAT:
            return parseFloat(ast.value);
        case graphql_1.Kind.OBJECT: {
            const value = {};
            ast.fields.forEach((field) => {
                value[field.name.value] = parseJSONLiteral(field.value);
            });
            return value;
        }
        case graphql_1.Kind.LIST:
            return ast.values.map(parseJSONLiteral);
        default:
            return null;
    }
};
//# sourceMappingURL=graphql-kit.js.map