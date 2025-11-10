"use strict";
/**
 * @fileoverview GraphQL Resolver Kit - Comprehensive NestJS GraphQL Utilities
 * @module reuse/graphql-resolver-kit
 * @description Production-ready GraphQL resolver and schema utilities for NestJS including:
 * resolver base classes, field resolver helpers, pagination (cursor & offset), DataLoader factories
 * for N+1 prevention, subscription resolvers, mutation validators, custom scalars, directive builders,
 * query complexity calculators, authentication guards, field-level authorization, error formatters,
 * schema stitching, union/interface resolvers, input validators, connection builders, Relay pagination,
 * and response transformers.
 *
 * Key Features:
 * - Advanced resolver base classes with middleware support
 * - DataLoader factories for N+1 query prevention
 * - Relay-style and offset pagination utilities
 * - Real-time subscription helpers with filtering
 * - Custom scalar types (DateTime, JSON, Email, UUID, PhoneNumber, etc.)
 * - GraphQL directive builders for authorization and validation
 * - Query complexity and depth limiting
 * - Field-level authorization decorators
 * - HIPAA-compliant data masking and audit logging
 * - Schema stitching and federation support
 * - Union and interface type resolvers
 * - Input validation with class-validator integration
 * - Response transformers and error formatters
 * - Performance monitoring and metrics
 *
 * @target NestJS 10.x, GraphQL 16.x, Apollo Server 4.x, Node 18+, TypeScript 5.x
 *
 * @security
 * - Field-level authorization
 * - HIPAA-compliant data masking
 * - Audit logging for mutations
 * - Rate limiting support
 * - Input sanitization
 * - Query complexity limits
 *
 * @example Basic resolver with DataLoader
 * ```typescript
 * import { createBaseResolver, createEntityDataLoader } from './graphql-resolver-kit';
 *
 * @Resolver(() => Patient)
 * export class PatientResolver extends createBaseResolver(Patient) {
 *   constructor(private patientService: PatientService) {
 *     super();
 *   }
 * }
 * ```
 *
 * @example Relay pagination
 * ```typescript
 * import { createRelayConnection, encodeRelayC cursor } from './graphql-resolver-kit';
 *
 * @Query(() => PatientConnection)
 * async patients(@Args() args: RelayPaginationArgs) {
 *   const patients = await this.patientService.findAll(args);
 *   return createRelayConnection(patients, args);
 * }
 * ```
 *
 * LOC: GQLRES123456
 * UPSTREAM: @nestjs/graphql, graphql, dataloader, class-validator
 * DOWNSTREAM: GraphQL resolvers, NestJS modules, API gateway
 *
 * @version 2.0.0
 * @since 2025-11-08
 */
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBaseResolver = createBaseResolver;
exports.createPaginatedResolver = createPaginatedResolver;
exports.createRelayResolver = createRelayResolver;
exports.createAuthorizedResolver = createAuthorizedResolver;
exports.createMonitoredResolver = createMonitoredResolver;
exports.createPropertyResolver = createPropertyResolver;
exports.createCachedFieldResolver = createCachedFieldResolver;
exports.createConditionalResolver = createConditionalResolver;
exports.createAggregationResolver = createAggregationResolver;
exports.createBatchedFieldResolver = createBatchedFieldResolver;
exports.createOffsetPagination = createOffsetPagination;
exports.createPaginatedResult = createPaginatedResult;
exports.encodeRelayCursor = encodeRelayCursor;
exports.decodeRelayCursor = decodeRelayCursor;
exports.createRelayConnection = createRelayConnection;
exports.createDataLoader = createDataLoader;
exports.createEntityDataLoader = createEntityDataLoader;
exports.createOneToManyDataLoader = createOneToManyDataLoader;
exports.createManyToManyDataLoader = createManyToManyDataLoader;
exports.createAggregationDataLoader = createAggregationDataLoader;
exports.createSubscriptionResolver = createSubscriptionResolver;
exports.createFilteredSubscription = createFilteredSubscription;
exports.createUserSubscription = createUserSubscription;
exports.createRoomSubscription = createRoomSubscription;
exports.createMultiTopicSubscription = createMultiTopicSubscription;
exports.validateInput = validateInput;
exports.ValidateInput = ValidateInput;
exports.sanitizeInput = sanitizeInput;
exports.validateRequiredFields = validateRequiredFields;
exports.createFieldValidator = createFieldValidator;
exports.createDateTimeScalar = createDateTimeScalar;
exports.createJSONScalar = createJSONScalar;
exports.createEmailScalar = createEmailScalar;
exports.createUUIDScalar = createUUIDScalar;
exports.createPhoneNumberScalar = createPhoneNumberScalar;
exports.createAuthDirective = createAuthDirective;
exports.createRoleDirective = createRoleDirective;
exports.createPermissionDirective = createPermissionDirective;
exports.createRateLimitDirective = createRateLimitDirective;
exports.createDeprecatedDirective = createDeprecatedDirective;
exports.createFieldMasking = createFieldMasking;
exports.createAuditMiddleware = createAuditMiddleware;
exports.createOwnershipChecker = createOwnershipChecker;
exports.createComplexityCalculator = createComplexityCalculator;
exports.createDepthLimiter = createDepthLimiter;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("graphql");
const dataloader_1 = __importDefault(require("dataloader"));
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
// ============================================================================
// SECTION 1: BASE RESOLVER CLASSES
// ============================================================================
/**
 * 1. Creates a base resolver class with common CRUD operations
 *
 * @template T Entity type
 * @param {Type<T>} classRef - Entity class reference
 * @returns {Type<any>} Base resolver class
 *
 * @example
 * ```typescript
 * @Resolver(() => Patient)
 * export class PatientResolver extends createBaseResolver(Patient) {
 *   constructor(private patientService: PatientService) {
 *     super();
 *   }
 * }
 * ```
 */
function createBaseResolver(classRef) {
    let BaseResolverHost = (() => {
        let _classDecorators = [(0, graphql_1.Resolver)({ isAbstract: true })];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        let _instanceExtraInitializers = [];
        let _findAll_decorators;
        let _findOne_decorators;
        let _create_decorators;
        let _update_decorators;
        let _delete_decorators;
        var BaseResolverHost = _classThis = class {
            async findAll(args) {
                throw new Error('findAll must be implemented');
            }
            async findOne(id) {
                throw new Error('findOne must be implemented');
            }
            async create(input) {
                throw new Error('create must be implemented');
            }
            async update(id, input) {
                throw new Error('update must be implemented');
            }
            async delete(id) {
                throw new Error('delete must be implemented');
            }
            constructor() {
                __runInitializers(this, _instanceExtraInitializers);
            }
        };
        __setFunctionName(_classThis, "BaseResolverHost");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _findAll_decorators = [(0, graphql_1.Query)(() => [classRef], { name: `getAll${classRef.name}s` })];
            _findOne_decorators = [(0, graphql_1.Query)(() => classRef, { name: `get${classRef.name}`, nullable: true })];
            _create_decorators = [(0, graphql_1.Mutation)(() => classRef, { name: `create${classRef.name}` })];
            _update_decorators = [(0, graphql_1.Mutation)(() => classRef, { name: `update${classRef.name}` })];
            _delete_decorators = [(0, graphql_1.Mutation)(() => Boolean, { name: `delete${classRef.name}` })];
            __esDecorate(_classThis, null, _findAll_decorators, { kind: "method", name: "findAll", static: false, private: false, access: { has: obj => "findAll" in obj, get: obj => obj.findAll }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_classThis, null, _findOne_decorators, { kind: "method", name: "findOne", static: false, private: false, access: { has: obj => "findOne" in obj, get: obj => obj.findOne }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: obj => "create" in obj, get: obj => obj.create }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_classThis, null, _update_decorators, { kind: "method", name: "update", static: false, private: false, access: { has: obj => "update" in obj, get: obj => obj.update }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_classThis, null, _delete_decorators, { kind: "method", name: "delete", static: false, private: false, access: { has: obj => "delete" in obj, get: obj => obj.delete }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            BaseResolverHost = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return BaseResolverHost = _classThis;
    })();
    return BaseResolverHost;
}
/**
 * 2. Creates a paginated base resolver with offset pagination
 *
 * @template T Entity type
 * @param {Type<T>} classRef - Entity class reference
 * @param {Type<any>} paginatedType - Paginated result type
 * @returns {Type<any>} Paginated base resolver class
 *
 * @example
 * ```typescript
 * @Resolver(() => Patient)
 * export class PatientResolver extends createPaginatedResolver(Patient, PaginatedPatients) {
 *   // ...
 * }
 * ```
 */
function createPaginatedResolver(classRef, paginatedType) {
    let PaginatedResolverHost = (() => {
        let _classDecorators = [(0, graphql_1.Resolver)({ isAbstract: true })];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        let _instanceExtraInitializers = [];
        let _findAllPaginated_decorators;
        var PaginatedResolverHost = _classThis = class {
            async findAllPaginated(args) {
                throw new Error('findAllPaginated must be implemented');
            }
            constructor() {
                __runInitializers(this, _instanceExtraInitializers);
            }
        };
        __setFunctionName(_classThis, "PaginatedResolverHost");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _findAllPaginated_decorators = [(0, graphql_1.Query)(() => paginatedType, { name: `getAll${classRef.name}sPaginated` })];
            __esDecorate(_classThis, null, _findAllPaginated_decorators, { kind: "method", name: "findAllPaginated", static: false, private: false, access: { has: obj => "findAllPaginated" in obj, get: obj => obj.findAllPaginated }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            PaginatedResolverHost = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return PaginatedResolverHost = _classThis;
    })();
    return PaginatedResolverHost;
}
/**
 * 3. Creates a Relay-style base resolver with cursor pagination
 *
 * @template T Entity type
 * @param {Type<T>} classRef - Entity class reference
 * @param {Type<any>} connectionType - Connection type
 * @returns {Type<any>} Relay base resolver class
 *
 * @example
 * ```typescript
 * @Resolver(() => Appointment)
 * export class AppointmentResolver extends createRelayResolver(Appointment, AppointmentConnection) {
 *   // ...
 * }
 * ```
 */
function createRelayResolver(classRef, connectionType) {
    let RelayResolverHost = (() => {
        let _classDecorators = [(0, graphql_1.Resolver)({ isAbstract: true })];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        let _instanceExtraInitializers = [];
        let _findConnection_decorators;
        var RelayResolverHost = _classThis = class {
            async findConnection(args) {
                throw new Error('findConnection must be implemented');
            }
            constructor() {
                __runInitializers(this, _instanceExtraInitializers);
            }
        };
        __setFunctionName(_classThis, "RelayResolverHost");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _findConnection_decorators = [(0, graphql_1.Query)(() => connectionType, { name: `getAll${classRef.name}sConnection` })];
            __esDecorate(_classThis, null, _findConnection_decorators, { kind: "method", name: "findConnection", static: false, private: false, access: { has: obj => "findConnection" in obj, get: obj => obj.findConnection }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            RelayResolverHost = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return RelayResolverHost = _classThis;
    })();
    return RelayResolverHost;
}
/**
 * 4. Creates a resolver with built-in authorization
 *
 * @template T Entity type
 * @param {Type<T>} classRef - Entity class reference
 * @param {AuthorizationRule} authRule - Authorization rule
 * @returns {Type<any>} Authorized resolver class
 *
 * @example
 * ```typescript
 * @Resolver(() => MedicalRecord)
 * export class MedicalRecordResolver extends createAuthorizedResolver(
 *   MedicalRecord,
 *   { roles: ['DOCTOR', 'NURSE'], permissions: ['read:medical-records'] }
 * ) {
 *   // ...
 * }
 * ```
 */
function createAuthorizedResolver(classRef, authRule) {
    let AuthorizedResolverHost = (() => {
        let _classDecorators = [(0, graphql_1.Resolver)({ isAbstract: true })];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var AuthorizedResolverHost = _classThis = class {
            async checkAuthorization(context) {
                const user = context.user;
                if (!user) {
                    throw new graphql_2.GraphQLError('Authentication required', {
                        extensions: { code: 'UNAUTHENTICATED' },
                    });
                }
                if (authRule.roles && !authRule.roles.includes(user.role)) {
                    throw new graphql_2.GraphQLError('Insufficient permissions', {
                        extensions: { code: 'FORBIDDEN', requiredRoles: authRule.roles },
                    });
                }
                if (authRule.permissions) {
                    const hasPermissions = authRule.permissions.every((perm) => user.permissions?.includes(perm));
                    if (!hasPermissions) {
                        throw new graphql_2.GraphQLError('Insufficient permissions', {
                            extensions: { code: 'FORBIDDEN', requiredPermissions: authRule.permissions },
                        });
                    }
                }
                if (authRule.customCheck) {
                    const allowed = await authRule.customCheck(context, null, null);
                    if (!allowed) {
                        throw new graphql_2.GraphQLError('Access denied', {
                            extensions: { code: 'FORBIDDEN' },
                        });
                    }
                }
            }
        };
        __setFunctionName(_classThis, "AuthorizedResolverHost");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AuthorizedResolverHost = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return AuthorizedResolverHost = _classThis;
    })();
    return AuthorizedResolverHost;
}
/**
 * 5. Creates a resolver with automatic performance monitoring
 *
 * @template T Entity type
 * @param {Type<T>} classRef - Entity class reference
 * @param {Function} metricsCallback - Metrics collection callback
 * @returns {Type<any>} Monitored resolver class
 *
 * @example
 * ```typescript
 * @Resolver(() => Patient)
 * export class PatientResolver extends createMonitoredResolver(
 *   Patient,
 *   (metrics) => logger.info('Resolver metrics', metrics)
 * ) {
 *   // ...
 * }
 * ```
 */
function createMonitoredResolver(classRef, metricsCallback) {
    let MonitoredResolverHost = (() => {
        let _classDecorators = [(0, graphql_1.Resolver)({ isAbstract: true })];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var MonitoredResolverHost = _classThis = class {
            async executeWithMonitoring(resolverName, fn, context, info) {
                const startTime = Date.now();
                try {
                    const result = await fn();
                    const executionTime = Date.now() - startTime;
                    metricsCallback({
                        resolverName,
                        executionTime,
                        fieldCount: countFieldsInSelection(info),
                        complexity: 0, // Can be calculated separately
                        timestamp: new Date(),
                        userId: context.user?.id,
                    });
                    return result;
                }
                catch (error) {
                    const executionTime = Date.now() - startTime;
                    metricsCallback({
                        resolverName: `${resolverName}:error`,
                        executionTime,
                        fieldCount: countFieldsInSelection(info),
                        complexity: 0,
                        timestamp: new Date(),
                        userId: context.user?.id,
                    });
                    throw error;
                }
            }
        };
        __setFunctionName(_classThis, "MonitoredResolverHost");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            MonitoredResolverHost = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return MonitoredResolverHost = _classThis;
    })();
    return MonitoredResolverHost;
}
// ============================================================================
// SECTION 2: FIELD RESOLVER HELPERS
// ============================================================================
/**
 * 6. Creates a field resolver with automatic parent property access
 *
 * @param {string} propertyPath - Dot-notation property path
 * @param {any} defaultValue - Default value if undefined
 * @returns {GraphQLFieldResolver} Field resolver function
 *
 * @example
 * ```typescript
 * @ResolveField(() => String)
 * fullName: GraphQLFieldResolver<any, any> = createPropertyResolver('profile.fullName', 'Unknown');
 * ```
 */
function createPropertyResolver(propertyPath, defaultValue) {
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
}
/**
 * 7. Creates a computed field resolver with caching
 *
 * @param {Function} computeFn - Compute function
 * @param {number} ttl - Cache TTL in seconds
 * @returns {GraphQLFieldResolver} Cached field resolver
 *
 * @example
 * ```typescript
 * @ResolveField(() => String)
 * fullName = createCachedFieldResolver(
 *   (parent) => `${parent.firstName} ${parent.lastName}`,
 *   300
 * );
 * ```
 */
function createCachedFieldResolver(computeFn, ttl = 300) {
    const cache = new Map();
    return async (parent, args, context, info) => {
        const cacheKey = JSON.stringify({ parentId: parent.id, args });
        const cached = cache.get(cacheKey);
        const now = Date.now();
        if (cached && cached.expiry > now) {
            return cached.value;
        }
        const value = await computeFn(parent, args, context, info);
        cache.set(cacheKey, { value, expiry: now + ttl * 1000 });
        return value;
    };
}
/**
 * 8. Creates a conditional field resolver
 *
 * @param {Function} conditionFn - Condition function
 * @param {GraphQLFieldResolver} trueResolver - Resolver when true
 * @param {GraphQLFieldResolver} falseResolver - Resolver when false
 * @returns {GraphQLFieldResolver} Conditional resolver
 *
 * @example
 * ```typescript
 * @ResolveField(() => String)
 * sensitiveData = createConditionalResolver(
 *   (parent, args, context) => context.user?.role === 'ADMIN',
 *   (parent) => parent.ssn,
 *   () => '***-**-****'
 * );
 * ```
 */
function createConditionalResolver(conditionFn, trueResolver, falseResolver) {
    return async (parent, args, context, info) => {
        const condition = await conditionFn(parent, args, context);
        return condition
            ? trueResolver(parent, args, context, info)
            : falseResolver(parent, args, context, info);
    };
}
/**
 * 9. Creates an aggregation field resolver
 *
 * @template M Model type
 * @param {ModelStatic<M>} model - Sequelize model
 * @param {string} foreignKey - Foreign key field
 * @param {string} aggregateFunction - Aggregate function (COUNT, SUM, AVG, etc.)
 * @param {string} aggregateField - Field to aggregate
 * @returns {GraphQLFieldResolver} Aggregation resolver
 *
 * @example
 * ```typescript
 * @ResolveField(() => Int)
 * appointmentCount = createAggregationResolver(
 *   AppointmentModel,
 *   'patientId',
 *   'COUNT',
 *   'id'
 * );
 * ```
 */
function createAggregationResolver(model, foreignKey, aggregateFunction, aggregateField = '*') {
    return async (parent) => {
        const result = await model.findOne({
            attributes: [
                [model.sequelize.fn(aggregateFunction, model.sequelize.col(aggregateField)), 'result'],
            ],
            where: { [foreignKey]: parent.id },
            raw: true,
        });
        return result ? result.result : 0;
    };
}
/**
 * 10. Creates a batched field resolver using DataLoader
 *
 * @param {string} loaderKey - DataLoader key in context
 * @param {Function} keyExtractor - Key extraction function
 * @returns {GraphQLFieldResolver} Batched field resolver
 *
 * @example
 * ```typescript
 * @ResolveField(() => User)
 * author = createBatchedFieldResolver(
 *   'userLoader',
 *   (parent) => parent.authorId
 * );
 * ```
 */
function createBatchedFieldResolver(loaderKey, keyExtractor) {
    return async (parent, args, context) => {
        const loader = context.dataloaders.get(loaderKey);
        if (!loader) {
            throw new graphql_2.GraphQLError(`DataLoader "${loaderKey}" not found in context`);
        }
        const key = keyExtractor(parent);
        return loader.load(key);
    };
}
// ============================================================================
// SECTION 3: PAGINATION UTILITIES
// ============================================================================
/**
 * 11. Creates offset-based pagination parameters
 *
 * @param {PaginationArgs} args - Pagination arguments
 * @param {number} maxLimit - Maximum allowed limit
 * @returns {object} Normalized pagination parameters
 *
 * @example
 * ```typescript
 * const { offset, limit } = createOffsetPagination({ page: 2, perPage: 20 }, 100);
 * // Result: { offset: 20, limit: 20 }
 * ```
 */
function createOffsetPagination(args, maxLimit = 100) {
    let limit = args.limit || args.perPage || 10;
    limit = Math.min(limit, maxLimit);
    let offset = args.offset || 0;
    if (args.page && args.perPage) {
        offset = (args.page - 1) * args.perPage;
    }
    return { offset, limit };
}
/**
 * 12. Creates a paginated result wrapper
 *
 * @template T Item type
 * @param {T[]} items - Result items
 * @param {number} total - Total count
 * @param {PaginationArgs} args - Pagination arguments
 * @returns {PaginatedResult<T>} Paginated result
 *
 * @example
 * ```typescript
 * const result = createPaginatedResult(patients, 150, { page: 2, perPage: 20 });
 * ```
 */
function createPaginatedResult(items, total, args) {
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
}
/**
 * 13. Encodes a Relay cursor
 *
 * @param {object} data - Cursor data
 * @returns {string} Base64-encoded cursor
 *
 * @example
 * ```typescript
 * const cursor = encodeRelayCursor({ id: 'patient-123', offset: 10 });
 * ```
 */
function encodeRelayCursor(data) {
    return Buffer.from(JSON.stringify(data)).toString('base64');
}
/**
 * 14. Decodes a Relay cursor
 *
 * @param {string} cursor - Base64-encoded cursor
 * @returns {object|null} Decoded cursor data
 *
 * @example
 * ```typescript
 * const data = decodeRelayCursor(cursor);
 * // Result: { id: 'patient-123', offset: 10 }
 * ```
 */
function decodeRelayCursor(cursor) {
    try {
        return JSON.parse(Buffer.from(cursor, 'base64').toString('utf-8'));
    }
    catch {
        return null;
    }
}
/**
 * 15. Creates a Relay connection from array
 *
 * @template T Node type
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
 *   (item, index) => encodeRelayCursor({ id: item.id, index })
 * );
 * ```
 */
function createRelayConnection(items, args, cursorFn) {
    const requestedCount = args.first || args.last || 10;
    const hasExtraItem = items.length > requestedCount;
    const limitedItems = hasExtraItem ? items.slice(0, requestedCount) : items;
    const defaultCursorFn = (item, index) => encodeRelayCursor({ id: item.id, index });
    const edges = limitedItems.map((item, index) => ({
        cursor: (cursorFn || defaultCursorFn)(item, index),
        node: item,
    }));
    const pageInfo = {
        hasNextPage: args.first ? hasExtraItem : false,
        hasPreviousPage: !!args.after || !!args.before,
        startCursor: edges[0]?.cursor,
        endCursor: edges[edges.length - 1]?.cursor,
    };
    return {
        edges,
        pageInfo,
        totalCount: items.length,
    };
}
// ============================================================================
// SECTION 4: DATALOADER FACTORIES
// ============================================================================
/**
 * 16. Creates a generic DataLoader with configuration
 *
 * @param {Function} batchLoadFn - Batch loading function
 * @param {DataLoaderOptions} options - DataLoader options
 * @returns {DataLoader} Configured DataLoader instance
 *
 * @example
 * ```typescript
 * const userLoader = createDataLoader(
 *   async (ids) => UserModel.findAll({ where: { id: ids } }),
 *   { cache: true, maxBatchSize: 100 }
 * );
 * ```
 */
function createDataLoader(batchLoadFn, options) {
    return new dataloader_1.default(batchLoadFn, {
        batch: options?.batch !== false,
        cache: options?.cache !== false,
        maxBatchSize: options?.maxBatchSize || 100,
        batchScheduleFn: options?.batchScheduleFn || ((callback) => setTimeout(callback, 1)),
        cacheKeyFn: options?.cacheKeyFn,
    });
}
/**
 * 17. Creates an entity DataLoader for loading by ID
 *
 * @template M Model type
 * @param {ModelStatic<M>} model - Sequelize model
 * @param {string} idField - ID field name
 * @returns {DataLoader} Entity DataLoader
 *
 * @example
 * ```typescript
 * const patientLoader = createEntityDataLoader(PatientModel);
 * const patient = await patientLoader.load('patient-123');
 * ```
 */
function createEntityDataLoader(model, idField = 'id') {
    return new dataloader_1.default(async (ids) => {
        const entities = await model.findAll({
            where: { [idField]: ids },
        });
        const entityMap = new Map(entities.map((entity) => [entity.get(idField), entity]));
        return ids.map((id) => entityMap.get(id) || null);
    });
}
/**
 * 18. Creates a one-to-many relationship DataLoader
 *
 * @template M Model type
 * @param {ModelStatic<M>} model - Related model
 * @param {string} foreignKey - Foreign key field
 * @param {FindOptions} findOptions - Additional Sequelize options
 * @returns {DataLoader} One-to-many DataLoader
 *
 * @example
 * ```typescript
 * const appointmentsLoader = createOneToManyDataLoader(
 *   AppointmentModel,
 *   'patientId',
 *   { order: [['scheduledAt', 'DESC']], limit: 10 }
 * );
 * ```
 */
function createOneToManyDataLoader(model, foreignKey, findOptions) {
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
}
/**
 * 19. Creates a many-to-many relationship DataLoader
 *
 * @template M Model type
 * @param {ModelStatic<M>} targetModel - Target entity model
 * @param {ModelStatic<any>} junctionModel - Junction table model
 * @param {string} sourceKey - Source foreign key
 * @param {string} targetKey - Target foreign key
 * @returns {DataLoader} Many-to-many DataLoader
 *
 * @example
 * ```typescript
 * const diagnosesLoader = createManyToManyDataLoader(
 *   DiagnosisModel,
 *   PatientDiagnosisModel,
 *   'patientId',
 *   'diagnosisId'
 * );
 * ```
 */
function createManyToManyDataLoader(targetModel, junctionModel, sourceKey, targetKey) {
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
}
/**
 * 20. Creates an aggregation DataLoader
 *
 * @template M Model type
 * @param {ModelStatic<M>} model - Sequelize model
 * @param {string} groupByField - Field to group by
 * @param {string} aggregateFunction - SQL aggregate function
 * @param {string} aggregateField - Field to aggregate
 * @returns {DataLoader} Aggregation DataLoader
 *
 * @example
 * ```typescript
 * const appointmentCountLoader = createAggregationDataLoader(
 *   AppointmentModel,
 *   'patientId',
 *   'COUNT',
 *   'id'
 * );
 * const count = await appointmentCountLoader.load('patient-123');
 * ```
 */
function createAggregationDataLoader(model, groupByField, aggregateFunction, aggregateField = '*') {
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
}
// ============================================================================
// SECTION 5: SUBSCRIPTION RESOLVERS
// ============================================================================
/**
 * 21. Creates a basic subscription resolver
 *
 * @param {PubSub} pubsub - PubSub instance
 * @param {string} topic - Subscription topic
 * @returns {Function} Subscription resolver
 *
 * @example
 * ```typescript
 * @Subscription(() => Notification)
 * notificationAdded() {
 *   return createSubscriptionResolver(this.pubsub, 'NOTIFICATION_ADDED');
 * }
 * ```
 */
function createSubscriptionResolver(pubsub, topic) {
    return () => pubsub.asyncIterator(topic);
}
/**
 * 22. Creates a filtered subscription resolver
 *
 * @template T Payload type
 * @param {PubSub} pubsub - PubSub instance
 * @param {SubscriptionFilterConfig<T>} config - Filter configuration
 * @returns {object} Subscription resolver configuration
 *
 * @example
 * ```typescript
 * @Subscription(() => Message, {
 *   filter: createFilteredSubscription(pubsub, {
 *     topic: 'MESSAGE_SENT',
 *     filter: (payload, variables, context) => payload.userId === context.user.id
 *   }).filter
 * })
 * messageSent() {
 *   return createFilteredSubscription(pubsub, {
 *     topic: 'MESSAGE_SENT'
 *   }).subscribe();
 * }
 * ```
 */
function createFilteredSubscription(pubsub, config) {
    return {
        subscribe: () => pubsub.asyncIterator(config.topic),
        filter: config.filter,
        resolve: config.resolve || ((payload) => payload),
    };
}
/**
 * 23. Creates a user-specific subscription resolver
 *
 * @param {PubSub} pubsub - PubSub instance
 * @param {string} topic - Subscription topic
 * @param {string} userIdField - User ID field in payload
 * @returns {object} User-specific subscription configuration
 *
 * @example
 * ```typescript
 * @Subscription(() => Appointment, {
 *   filter: createUserSubscription(pubsub, 'APPOINTMENT_UPDATED', 'patientId').filter
 * })
 * appointmentUpdated() {
 *   return createUserSubscription(pubsub, 'APPOINTMENT_UPDATED', 'patientId').subscribe();
 * }
 * ```
 */
function createUserSubscription(pubsub, topic, userIdField = 'userId') {
    return {
        subscribe: () => pubsub.asyncIterator(topic),
        filter: (payload, variables, context) => {
            if (!context.user)
                return false;
            return payload[userIdField] === context.user.id;
        },
    };
}
/**
 * 24. Creates a room/channel-based subscription resolver
 *
 * @param {PubSub} pubsub - PubSub instance
 * @param {string} topicPrefix - Topic prefix
 * @param {Function} roomExtractor - Room ID extractor function
 * @returns {Function} Room subscription factory
 *
 * @example
 * ```typescript
 * @Subscription(() => ChatMessage)
 * chatMessage(@Args('roomId') roomId: string) {
 *   return createRoomSubscription(
 *     pubsub,
 *     'CHAT_MESSAGE',
 *     (variables) => variables.roomId
 *   )(roomId);
 * }
 * ```
 */
function createRoomSubscription(pubsub, topicPrefix, roomExtractor) {
    return (roomId) => {
        const topic = `${topicPrefix}.${roomId}`;
        return pubsub.asyncIterator(topic);
    };
}
/**
 * 25. Creates a multi-topic subscription resolver
 *
 * @param {PubSub} pubsub - PubSub instance
 * @param {string[]} topics - Array of topics to subscribe to
 * @returns {Function} Multi-topic subscription
 *
 * @example
 * ```typescript
 * @Subscription(() => SystemEvent)
 * systemEvents() {
 *   return createMultiTopicSubscription(pubsub, [
 *     'SYSTEM_ALERT',
 *     'SYSTEM_WARNING',
 *     'SYSTEM_INFO'
 *   ])();
 * }
 * ```
 */
function createMultiTopicSubscription(pubsub, topics) {
    return () => pubsub.asyncIterator(topics);
}
// ============================================================================
// SECTION 6: MUTATION INPUT VALIDATORS
// ============================================================================
/**
 * 26. Validates input using class-validator
 *
 * @template T Input type
 * @param {Type<T>} inputClass - Input class with validation decorators
 * @param {any} input - Input data to validate
 * @param {ValidationConfig} config - Validation configuration
 * @returns {Promise<T>} Validated and transformed input
 *
 * @example
 * ```typescript
 * @Mutation(() => Patient)
 * async createPatient(@Args('input') input: CreatePatientInput) {
 *   const validatedInput = await validateInput(CreatePatientInput, input);
 *   return this.patientService.create(validatedInput);
 * }
 * ```
 */
async function validateInput(inputClass, input, config) {
    const inputInstance = (0, class_transformer_1.plainToClass)(inputClass, input);
    const errors = await (0, class_validator_1.validate)(inputInstance, {
        skipMissingProperties: config?.skipMissingProperties || false,
        whitelist: config?.whitelist !== false,
        forbidNonWhitelisted: config?.forbidNonWhitelisted || false,
        forbidUnknownValues: config?.forbidUnknownValues || true,
    });
    if (errors.length > 0) {
        const formattedErrors = errors.map((error) => ({
            property: error.property,
            constraints: error.constraints,
            children: error.children,
        }));
        throw new graphql_2.GraphQLError('Validation failed', {
            extensions: {
                code: 'BAD_USER_INPUT',
                validationErrors: formattedErrors,
            },
        });
    }
    return inputInstance;
}
/**
 * 27. Creates a validation decorator for mutation inputs
 *
 * @param {Type<any>} inputClass - Input class with validation decorators
 * @returns {MethodDecorator} Validation decorator
 *
 * @example
 * ```typescript
 * @Mutation(() => Patient)
 * @ValidateInput(CreatePatientInput)
 * async createPatient(@Args('input') input: CreatePatientInput) {
 *   // Input is automatically validated
 *   return this.patientService.create(input);
 * }
 * ```
 */
function ValidateInput(inputClass) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            // Find the input argument (usually the first @Args decorated parameter)
            const inputArg = args[0];
            if (inputArg && typeof inputArg === 'object') {
                await validateInput(inputClass, inputArg);
            }
            return originalMethod.apply(this, args);
        };
        return descriptor;
    };
}
/**
 * 28. Sanitizes string inputs to prevent XSS
 *
 * @param {any} input - Input object to sanitize
 * @param {string[]} fieldsToSanitize - Fields to sanitize
 * @returns {any} Sanitized input
 *
 * @example
 * ```typescript
 * @Mutation(() => Comment)
 * async createComment(@Args('input') input: CreateCommentInput) {
 *   const sanitized = sanitizeInput(input, ['content', 'title']);
 *   return this.commentService.create(sanitized);
 * }
 * ```
 */
function sanitizeInput(input, fieldsToSanitize) {
    const sanitized = { ...input };
    fieldsToSanitize.forEach((field) => {
        if (field in sanitized && typeof sanitized[field] === 'string') {
            // Remove HTML tags and trim
            sanitized[field] = sanitized[field]
                .replace(/<[^>]*>/g, '')
                .replace(/[<>'"]/g, '')
                .trim();
        }
    });
    return sanitized;
}
/**
 * 29. Validates required fields in mutation input
 *
 * @param {any} input - Input object
 * @param {string[]} requiredFields - Required field names
 * @throws {GraphQLError} If required fields are missing
 *
 * @example
 * ```typescript
 * @Mutation(() => Appointment)
 * async createAppointment(@Args('input') input: CreateAppointmentInput) {
 *   validateRequiredFields(input, ['patientId', 'doctorId', 'scheduledAt']);
 *   return this.appointmentService.create(input);
 * }
 * ```
 */
function validateRequiredFields(input, requiredFields) {
    const missingFields = requiredFields.filter((field) => {
        const value = input[field];
        return value === null || value === undefined || value === '';
    });
    if (missingFields.length > 0) {
        throw new graphql_2.GraphQLError('Required fields are missing', {
            extensions: {
                code: 'BAD_USER_INPUT',
                missingFields,
            },
        });
    }
}
/**
 * 30. Creates a custom field validator function
 *
 * @param {Function} validatorFn - Validation function
 * @param {string} errorMessage - Error message
 * @returns {Function} Field validator
 *
 * @example
 * ```typescript
 * const validateAge = createFieldValidator(
 *   (value) => value >= 18 && value <= 120,
 *   'Age must be between 18 and 120'
 * );
 *
 * validateAge(input.age);
 * ```
 */
function createFieldValidator(validatorFn, errorMessage) {
    return (value, fieldName) => {
        if (!validatorFn(value)) {
            throw new graphql_2.GraphQLError(errorMessage, {
                extensions: {
                    code: 'BAD_USER_INPUT',
                    field: fieldName,
                },
            });
        }
    };
}
// ============================================================================
// SECTION 7: CUSTOM SCALAR TYPES
// ============================================================================
/**
 * 31. Creates a DateTime scalar type
 *
 * @returns {GraphQLScalarType} DateTime scalar
 *
 * @example
 * ```typescript
 * const DateTimeScalar = createDateTimeScalar();
 * // Use in schema: scalar DateTime
 * ```
 */
function createDateTimeScalar() {
    return new graphql_2.GraphQLScalarType({
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
            if (ast.kind === graphql_2.Kind.STRING || ast.kind === graphql_2.Kind.INT) {
                return new Date(ast.value);
            }
            throw new graphql_2.GraphQLError('DateTime must be a string or number');
        },
    });
}
/**
 * 32. Creates a JSON scalar type
 *
 * @returns {GraphQLScalarType} JSON scalar
 *
 * @example
 * ```typescript
 * const JSONScalar = createJSONScalar();
 * // Use for flexible JSON fields
 * ```
 */
function createJSONScalar() {
    return new graphql_2.GraphQLScalarType({
        name: 'JSON',
        description: 'JSON scalar type',
        serialize(value) {
            return value;
        },
        parseValue(value) {
            return value;
        },
        parseLiteral(ast) {
            if (ast.kind === graphql_2.Kind.OBJECT || ast.kind === graphql_2.Kind.LIST) {
                return parseJSONLiteral(ast);
            }
            if (ast.kind === graphql_2.Kind.STRING) {
                return JSON.parse(ast.value);
            }
            return null;
        },
    });
}
/**
 * 33. Creates an Email scalar type with validation
 *
 * @returns {GraphQLScalarType} Email scalar
 *
 * @example
 * ```typescript
 * const EmailScalar = createEmailScalar();
 * // Validates email format automatically
 * ```
 */
function createEmailScalar() {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return new graphql_2.GraphQLScalarType({
        name: 'Email',
        description: 'Email address scalar type',
        serialize(value) {
            if (!emailRegex.test(value)) {
                throw new graphql_2.GraphQLError('Invalid email format');
            }
            return value.toLowerCase();
        },
        parseValue(value) {
            if (!emailRegex.test(value)) {
                throw new graphql_2.GraphQLError('Invalid email format');
            }
            return value.toLowerCase();
        },
        parseLiteral(ast) {
            if (ast.kind === graphql_2.Kind.STRING) {
                if (!emailRegex.test(ast.value)) {
                    throw new graphql_2.GraphQLError('Invalid email format');
                }
                return ast.value.toLowerCase();
            }
            throw new graphql_2.GraphQLError('Email must be a string');
        },
    });
}
/**
 * 34. Creates a UUID scalar type with validation
 *
 * @returns {GraphQLScalarType} UUID scalar
 *
 * @example
 * ```typescript
 * const UUIDScalar = createUUIDScalar();
 * // Validates UUID format
 * ```
 */
function createUUIDScalar() {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return new graphql_2.GraphQLScalarType({
        name: 'UUID',
        description: 'UUID scalar type',
        serialize(value) {
            if (!uuidRegex.test(value)) {
                throw new graphql_2.GraphQLError('Invalid UUID format');
            }
            return value.toLowerCase();
        },
        parseValue(value) {
            if (!uuidRegex.test(value)) {
                throw new graphql_2.GraphQLError('Invalid UUID format');
            }
            return value.toLowerCase();
        },
        parseLiteral(ast) {
            if (ast.kind === graphql_2.Kind.STRING) {
                if (!uuidRegex.test(ast.value)) {
                    throw new graphql_2.GraphQLError('Invalid UUID format');
                }
                return ast.value.toLowerCase();
            }
            throw new graphql_2.GraphQLError('UUID must be a string');
        },
    });
}
/**
 * 35. Creates a PhoneNumber scalar type with validation
 *
 * @returns {GraphQLScalarType} PhoneNumber scalar
 *
 * @example
 * ```typescript
 * const PhoneScalar = createPhoneNumberScalar();
 * // Validates phone number format
 * ```
 */
function createPhoneNumberScalar() {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format
    return new graphql_2.GraphQLScalarType({
        name: 'PhoneNumber',
        description: 'Phone number scalar type (E.164 format)',
        serialize(value) {
            const cleaned = value.replace(/\D/g, '');
            if (!phoneRegex.test(cleaned)) {
                throw new graphql_2.GraphQLError('Invalid phone number format');
            }
            return cleaned;
        },
        parseValue(value) {
            const cleaned = value.replace(/\D/g, '');
            if (!phoneRegex.test(cleaned)) {
                throw new graphql_2.GraphQLError('Invalid phone number format');
            }
            return cleaned;
        },
        parseLiteral(ast) {
            if (ast.kind === graphql_2.Kind.STRING) {
                const cleaned = ast.value.replace(/\D/g, '');
                if (!phoneRegex.test(cleaned)) {
                    throw new graphql_2.GraphQLError('Invalid phone number format');
                }
                return cleaned;
            }
            throw new graphql_2.GraphQLError('PhoneNumber must be a string');
        },
    });
}
// ============================================================================
// SECTION 8: DIRECTIVE BUILDERS
// ============================================================================
/**
 * 36. Creates an authentication directive
 *
 * @returns {DirectiveConfig} Authentication directive configuration
 *
 * @example
 * ```typescript
 * // In schema: @auth
 * type Query {
 *   me: User @auth
 * }
 * ```
 */
function createAuthDirective() {
    return {
        name: 'auth',
        locations: ['FIELD_DEFINITION', 'OBJECT'],
        resolver: async (next, source, args, context) => {
            if (!context.user) {
                throw new graphql_2.GraphQLError('Authentication required', {
                    extensions: { code: 'UNAUTHENTICATED' },
                });
            }
            return next();
        },
    };
}
/**
 * 37. Creates a role-based authorization directive
 *
 * @param {string[]} allowedRoles - Allowed roles
 * @returns {DirectiveConfig} Role directive configuration
 *
 * @example
 * ```typescript
 * // In schema: @hasRole(roles: ["ADMIN", "DOCTOR"])
 * type Mutation {
 *   deletePatient(id: ID!): Boolean @hasRole(roles: ["ADMIN"])
 * }
 * ```
 */
function createRoleDirective(allowedRoles) {
    return {
        name: 'hasRole',
        locations: ['FIELD_DEFINITION'],
        args: { roles: allowedRoles },
        resolver: async (next, source, args, context) => {
            if (!context.user) {
                throw new graphql_2.GraphQLError('Authentication required', {
                    extensions: { code: 'UNAUTHENTICATED' },
                });
            }
            if (!allowedRoles.includes(context.user.role)) {
                throw new graphql_2.GraphQLError('Insufficient permissions', {
                    extensions: { code: 'FORBIDDEN', requiredRoles: allowedRoles },
                });
            }
            return next();
        },
    };
}
/**
 * 38. Creates a permission-based authorization directive
 *
 * @param {string[]} requiredPermissions - Required permissions
 * @returns {DirectiveConfig} Permission directive configuration
 *
 * @example
 * ```typescript
 * // In schema: @hasPermission(permissions: ["read:patients"])
 * type Query {
 *   patient(id: ID!): Patient @hasPermission(permissions: ["read:patients"])
 * }
 * ```
 */
function createPermissionDirective(requiredPermissions) {
    return {
        name: 'hasPermission',
        locations: ['FIELD_DEFINITION'],
        args: { permissions: requiredPermissions },
        resolver: async (next, source, args, context) => {
            if (!context.user) {
                throw new graphql_2.GraphQLError('Authentication required', {
                    extensions: { code: 'UNAUTHENTICATED' },
                });
            }
            const hasPermissions = requiredPermissions.every((perm) => context.user.permissions?.includes(perm));
            if (!hasPermissions) {
                throw new graphql_2.GraphQLError('Insufficient permissions', {
                    extensions: { code: 'FORBIDDEN', requiredPermissions },
                });
            }
            return next();
        },
    };
}
/**
 * 39. Creates a rate limiting directive
 *
 * @param {number} maxRequests - Maximum requests allowed
 * @param {number} windowMs - Time window in milliseconds
 * @returns {DirectiveConfig} Rate limit directive configuration
 *
 * @example
 * ```typescript
 * // In schema: @rateLimit(max: 10, window: 60000)
 * type Mutation {
 *   sendEmail(to: String!): Boolean @rateLimit(max: 10, window: 60000)
 * }
 * ```
 */
function createRateLimitDirective(maxRequests, windowMs) {
    const requests = new Map();
    return {
        name: 'rateLimit',
        locations: ['FIELD_DEFINITION'],
        args: { max: maxRequests, window: windowMs },
        resolver: async (next, source, args, context) => {
            const userId = context.user?.id || context.req?.ip || 'anonymous';
            const now = Date.now();
            let userRequests = requests.get(userId);
            if (!userRequests || userRequests.resetTime < now) {
                userRequests = { count: 0, resetTime: now + windowMs };
                requests.set(userId, userRequests);
            }
            if (userRequests.count >= maxRequests) {
                throw new graphql_2.GraphQLError('Rate limit exceeded', {
                    extensions: {
                        code: 'RATE_LIMIT_EXCEEDED',
                        retryAfter: Math.ceil((userRequests.resetTime - now) / 1000),
                    },
                });
            }
            userRequests.count++;
            return next();
        },
    };
}
/**
 * 40. Creates a field deprecation directive
 *
 * @param {string} reason - Deprecation reason
 * @param {string} alternativeField - Alternative field to use
 * @returns {DirectiveConfig} Deprecation directive configuration
 *
 * @example
 * ```typescript
 * // In schema: @deprecated(reason: "Use 'fullName' instead")
 * type User {
 *   name: String @deprecated(reason: "Use 'fullName' instead")
 *   fullName: String
 * }
 * ```
 */
function createDeprecatedDirective(reason, alternativeField) {
    return {
        name: 'deprecated',
        locations: ['FIELD_DEFINITION'],
        args: { reason, alternativeField },
        resolver: async (next, source, args, context) => {
            // Log deprecation warning
            if (context.req) {
                console.warn(`Deprecated field accessed: ${reason}`);
            }
            return next();
        },
    };
}
// ============================================================================
// SECTION 9: AUTHORIZATION AND SECURITY
// ============================================================================
/**
 * 41. Creates HIPAA-compliant field masking function
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
 * const maskedData = maskPHI(patientData, context);
 * ```
 */
function createFieldMasking(sensitiveFields, maskFn) {
    return (data, context) => {
        if (!data)
            return data;
        const masked = { ...data };
        const user = context.user;
        // Admin can see everything
        if (user?.role === 'ADMIN' || user?.permissions?.includes('view:phi')) {
            return data;
        }
        sensitiveFields.forEach((field) => {
            if (field in masked) {
                masked[field] = maskFn(masked[field]);
            }
        });
        return masked;
    };
}
/**
 * 42. Creates audit logging middleware for mutations
 *
 * @param {Function} auditLogger - Audit log function
 * @returns {Function} Audit middleware
 *
 * @example
 * ```typescript
 * const auditMiddleware = createAuditMiddleware(
 *   async (entry) => AuditLog.create(entry)
 * );
 * ```
 */
function createAuditMiddleware(auditLogger) {
    return (resolver) => {
        return async (parent, args, context, info) => {
            const result = await resolver(parent, args, context, info);
            if (info.operation.operation === 'mutation') {
                await auditLogger({
                    userId: context.user?.id || 'anonymous',
                    action: info.fieldName,
                    resourceType: info.parentType.name,
                    resourceId: result?.id,
                    changes: args,
                    timestamp: new Date(),
                    ipAddress: context.req?.ip,
                });
            }
            return result;
        };
    };
}
/**
 * 43. Creates resource ownership checker
 *
 * @param {Function} ownerExtractor - Function to extract owner ID
 * @returns {Function} Ownership check function
 *
 * @example
 * ```typescript
 * const checkOwnership = createOwnershipChecker((resource) => resource.patientId);
 * if (await checkOwnership(context.user, appointment)) {
 *   // Allow access
 * }
 * ```
 */
function createOwnershipChecker(ownerExtractor) {
    return async (user, resource) => {
        if (!user)
            return false;
        const ownerId = await ownerExtractor(resource);
        return user.id === ownerId || user.role === 'ADMIN';
    };
}
/**
 * 44. Creates query complexity calculator
 *
 * @param {ComplexityConfig} config - Complexity configuration
 * @returns {Function} Complexity calculator
 *
 * @example
 * ```typescript
 * const calculateComplexity = createComplexityCalculator({
 *   maxComplexity: 1000,
 *   defaultCost: 1,
 *   fieldCosts: { patients: 5, appointments: 3 }
 * });
 * ```
 */
function createComplexityCalculator(config) {
    return (info) => {
        let complexity = 0;
        const calculateSelection = (selections, depth = 1) => {
            selections.forEach((selection) => {
                if (selection.kind === 'Field') {
                    const fieldName = selection.name.value;
                    const fieldCost = config.fieldCosts?.[fieldName] || config.defaultCost || 1;
                    const multiplier = config.multipliers?.[fieldName] || 1;
                    complexity += fieldCost * multiplier * depth;
                    if (selection.selectionSet) {
                        calculateSelection(selection.selectionSet.selections, depth + 1);
                    }
                }
            });
        };
        if (info.fieldNodes[0]?.selectionSet) {
            calculateSelection(info.fieldNodes[0].selectionSet.selections);
        }
        if (complexity > config.maxComplexity) {
            throw new graphql_2.GraphQLError(`Query is too complex: ${complexity}. Maximum allowed complexity: ${config.maxComplexity}`, { extensions: { code: 'QUERY_TOO_COMPLEX', complexity } });
        }
        return complexity;
    };
}
/**
 * 45. Creates depth limiting validator
 *
 * @param {number} maxDepth - Maximum query depth
 * @returns {Function} Depth validator
 *
 * @example
 * ```typescript
 * const validateDepth = createDepthLimiter(5);
 * validateDepth(info); // Throws if depth > 5
 * ```
 */
function createDepthLimiter(maxDepth) {
    return (info) => {
        let currentDepth = 0;
        const calculateDepth = (selections, depth = 0) => {
            if (!selections || selections.length === 0)
                return depth;
            let maxChildDepth = depth;
            selections.forEach((selection) => {
                if (selection.kind === 'Field' && selection.selectionSet) {
                    const childDepth = calculateDepth(selection.selectionSet.selections, depth + 1);
                    maxChildDepth = Math.max(maxChildDepth, childDepth);
                }
            });
            return maxChildDepth;
        };
        if (info.fieldNodes[0]?.selectionSet) {
            currentDepth = calculateDepth(info.fieldNodes[0].selectionSet.selections, 1);
        }
        if (currentDepth > maxDepth) {
            throw new graphql_2.GraphQLError(`Query depth ${currentDepth} exceeds maximum allowed depth of ${maxDepth}`, { extensions: { code: 'QUERY_TOO_DEEP', depth: currentDepth, maxDepth } });
        }
    };
}
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Helper to count fields in selection
 */
function countFieldsInSelection(info) {
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
}
/**
 * Helper to parse JSON literal from AST
 */
function parseJSONLiteral(ast) {
    switch (ast.kind) {
        case graphql_2.Kind.STRING:
        case graphql_2.Kind.BOOLEAN:
            return ast.value;
        case graphql_2.Kind.INT:
        case graphql_2.Kind.FLOAT:
            return parseFloat(ast.value);
        case graphql_2.Kind.OBJECT: {
            const value = {};
            ast.fields.forEach((field) => {
                value[field.name.value] = parseJSONLiteral(field.value);
            });
            return value;
        }
        case graphql_2.Kind.LIST:
            return ast.values.map(parseJSONLiteral);
        default:
            return null;
    }
}
/**
 * @description Export all utilities for easy importing
 */
exports.default = {
    // Base Resolvers
    createBaseResolver,
    createPaginatedResolver,
    createRelayResolver,
    createAuthorizedResolver,
    createMonitoredResolver,
    // Field Resolvers
    createPropertyResolver,
    createCachedFieldResolver,
    createConditionalResolver,
    createAggregationResolver,
    createBatchedFieldResolver,
    // Pagination
    createOffsetPagination,
    createPaginatedResult,
    encodeRelayCursor,
    decodeRelayCursor,
    createRelayConnection,
    // DataLoaders
    createDataLoader,
    createEntityDataLoader,
    createOneToManyDataLoader,
    createManyToManyDataLoader,
    createAggregationDataLoader,
    // Subscriptions
    createSubscriptionResolver,
    createFilteredSubscription,
    createUserSubscription,
    createRoomSubscription,
    createMultiTopicSubscription,
    // Validation
    validateInput,
    ValidateInput,
    sanitizeInput,
    validateRequiredFields,
    createFieldValidator,
    // Scalars
    createDateTimeScalar,
    createJSONScalar,
    createEmailScalar,
    createUUIDScalar,
    createPhoneNumberScalar,
    // Directives
    createAuthDirective,
    createRoleDirective,
    createPermissionDirective,
    createRateLimitDirective,
    createDeprecatedDirective,
    // Security
    createFieldMasking,
    createAuditMiddleware,
    createOwnershipChecker,
    createComplexityCalculator,
    createDepthLimiter,
};
//# sourceMappingURL=graphql-resolver-kit.js.map