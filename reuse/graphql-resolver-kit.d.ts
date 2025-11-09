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
import { Type } from '@nestjs/common';
import { GraphQLScalarType, GraphQLResolveInfo, GraphQLFieldResolver } from 'graphql';
import DataLoader from 'dataloader';
import { Model, ModelStatic, FindOptions } from 'sequelize';
import { PubSub } from 'graphql-subscriptions';
/**
 * @interface GraphQLContext
 * @description Standard GraphQL context interface
 */
export interface GraphQLContext {
    req: any;
    res: any;
    user?: any;
    dataloaders: Map<string, DataLoader<any, any>>;
    pubsub?: PubSub;
    requestId?: string;
    tenantId?: string;
    auditLog?: (action: string, metadata: any) => Promise<void>;
    [key: string]: any;
}
/**
 * @interface PaginationArgs
 * @description Offset-based pagination arguments
 */
export interface PaginationArgs {
    offset?: number;
    limit?: number;
    page?: number;
    perPage?: number;
}
/**
 * @interface RelayPaginationArgs
 * @description Relay-style cursor pagination arguments
 */
export interface RelayPaginationArgs {
    first?: number;
    after?: string;
    last?: number;
    before?: string;
}
/**
 * @interface PageInfo
 * @description Relay PageInfo type
 */
export interface PageInfo {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
}
/**
 * @interface Edge
 * @description Relay Edge type
 */
export interface Edge<T> {
    cursor: string;
    node: T;
}
/**
 * @interface Connection
 * @description Relay Connection type
 */
export interface Connection<T> {
    edges: Edge<T>[];
    pageInfo: PageInfo;
    totalCount?: number;
}
/**
 * @interface PaginatedResult
 * @description Offset pagination result
 */
export interface PaginatedResult<T> {
    items: T[];
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}
/**
 * @interface SubscriptionFilterConfig
 * @description Subscription filter configuration
 */
export interface SubscriptionFilterConfig<T = any> {
    topic: string;
    filter?: (payload: T, variables: any, context: GraphQLContext) => boolean | Promise<boolean>;
    resolve?: (payload: T) => any;
}
/**
 * @interface AuthorizationRule
 * @description Authorization rule for fields and resolvers
 */
export interface AuthorizationRule {
    roles?: string[];
    permissions?: string[];
    customCheck?: (context: GraphQLContext, parent: any, args: any) => boolean | Promise<boolean>;
}
/**
 * @interface DataLoaderOptions
 * @description DataLoader configuration options
 */
export interface DataLoaderOptions {
    batch?: boolean;
    cache?: boolean;
    maxBatchSize?: number;
    batchScheduleFn?: (callback: () => void) => void;
    cacheKeyFn?: (key: any) => any;
}
/**
 * @interface ComplexityConfig
 * @description Query complexity configuration
 */
export interface ComplexityConfig {
    maxComplexity: number;
    defaultCost?: number;
    fieldCosts?: Record<string, number>;
    multipliers?: Record<string, number>;
}
/**
 * @interface ValidationConfig
 * @description Input validation configuration
 */
export interface ValidationConfig {
    skipMissingProperties?: boolean;
    whitelist?: boolean;
    forbidNonWhitelisted?: boolean;
    forbidUnknownValues?: boolean;
}
/**
 * @interface DirectiveConfig
 * @description GraphQL directive configuration
 */
export interface DirectiveConfig {
    name: string;
    locations: string[];
    args?: Record<string, any>;
    resolver?: (next: any, source: any, args: any, context: any) => any;
}
/**
 * @interface ErrorFormatterConfig
 * @description Error formatting configuration
 */
export interface ErrorFormatterConfig {
    includeStackTrace?: boolean;
    maskSensitiveData?: boolean;
    logErrors?: boolean;
    customFormatter?: (error: Error) => any;
}
/**
 * @interface PerformanceMetrics
 * @description Resolver performance metrics
 */
export interface PerformanceMetrics {
    resolverName: string;
    executionTime: number;
    fieldCount: number;
    complexity: number;
    timestamp: Date;
    userId?: string;
}
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
export declare function createBaseResolver<T>(classRef: Type<T>): Type<any>;
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
export declare function createPaginatedResolver<T>(classRef: Type<T>, paginatedType: Type<any>): Type<any>;
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
export declare function createRelayResolver<T>(classRef: Type<T>, connectionType: Type<any>): Type<any>;
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
export declare function createAuthorizedResolver<T>(classRef: Type<T>, authRule: AuthorizationRule): Type<any>;
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
export declare function createMonitoredResolver<T>(classRef: Type<T>, metricsCallback: (metrics: PerformanceMetrics) => void): Type<any>;
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
export declare function createPropertyResolver(propertyPath: string, defaultValue?: any): GraphQLFieldResolver<any, any>;
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
export declare function createCachedFieldResolver(computeFn: (parent: any, args: any, context: any, info: GraphQLResolveInfo) => any, ttl?: number): GraphQLFieldResolver<any, any>;
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
export declare function createConditionalResolver(conditionFn: (parent: any, args: any, context: any) => boolean | Promise<boolean>, trueResolver: GraphQLFieldResolver<any, any>, falseResolver: GraphQLFieldResolver<any, any>): GraphQLFieldResolver<any, any>;
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
export declare function createAggregationResolver<M extends Model>(model: ModelStatic<M>, foreignKey: string, aggregateFunction: 'COUNT' | 'SUM' | 'AVG' | 'MIN' | 'MAX', aggregateField?: string): GraphQLFieldResolver<any, any>;
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
export declare function createBatchedFieldResolver(loaderKey: string, keyExtractor: (parent: any) => any): GraphQLFieldResolver<any, any>;
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
export declare function createOffsetPagination(args: PaginationArgs, maxLimit?: number): {
    offset: number;
    limit: number;
};
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
export declare function createPaginatedResult<T>(items: T[], total: number, args: PaginationArgs): PaginatedResult<T>;
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
export declare function encodeRelayCursor(data: Record<string, any>): string;
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
export declare function decodeRelayCursor(cursor: string): Record<string, any> | null;
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
export declare function createRelayConnection<T>(items: T[], args: RelayPaginationArgs, cursorFn?: (item: T, index: number) => string): Connection<T>;
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
export declare function createDataLoader<K, V>(batchLoadFn: (keys: readonly K[]) => Promise<V[]>, options?: DataLoaderOptions): DataLoader<K, V>;
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
export declare function createEntityDataLoader<M extends Model>(model: ModelStatic<M>, idField?: string): DataLoader<any, M | null>;
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
export declare function createOneToManyDataLoader<M extends Model>(model: ModelStatic<M>, foreignKey: string, findOptions?: FindOptions): DataLoader<any, M[]>;
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
export declare function createManyToManyDataLoader<M extends Model>(targetModel: ModelStatic<M>, junctionModel: ModelStatic<any>, sourceKey: string, targetKey: string): DataLoader<any, M[]>;
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
export declare function createAggregationDataLoader<M extends Model>(model: ModelStatic<M>, groupByField: string, aggregateFunction: 'COUNT' | 'SUM' | 'AVG' | 'MIN' | 'MAX', aggregateField?: string): DataLoader<any, number>;
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
export declare function createSubscriptionResolver(pubsub: PubSub, topic: string): () => AsyncIterator<any>;
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
export declare function createFilteredSubscription<T>(pubsub: PubSub, config: SubscriptionFilterConfig<T>): {
    subscribe: () => AsyncIterator<any>;
    filter?: (payload: T, variables: any, context: GraphQLContext) => boolean | Promise<boolean>;
    resolve?: (payload: T) => any;
};
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
export declare function createUserSubscription(pubsub: PubSub, topic: string, userIdField?: string): {
    subscribe: () => AsyncIterator<any>;
    filter: (payload: any, variables: any, context: GraphQLContext) => boolean;
};
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
export declare function createRoomSubscription(pubsub: PubSub, topicPrefix: string, roomExtractor: (variables: any) => string): (roomId: string) => AsyncIterator<any>;
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
export declare function createMultiTopicSubscription(pubsub: PubSub, topics: string[]): () => AsyncIterator<any>;
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
export declare function validateInput<T extends object>(inputClass: Type<T>, input: any, config?: ValidationConfig): Promise<T>;
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
export declare function ValidateInput(inputClass: Type<any>): MethodDecorator;
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
export declare function sanitizeInput(input: any, fieldsToSanitize: string[]): any;
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
export declare function validateRequiredFields(input: any, requiredFields: string[]): void;
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
export declare function createFieldValidator(validatorFn: (value: any) => boolean, errorMessage: string): (value: any, fieldName?: string) => void;
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
export declare function createDateTimeScalar(): GraphQLScalarType;
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
export declare function createJSONScalar(): GraphQLScalarType;
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
export declare function createEmailScalar(): GraphQLScalarType;
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
export declare function createUUIDScalar(): GraphQLScalarType;
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
export declare function createPhoneNumberScalar(): GraphQLScalarType;
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
export declare function createAuthDirective(): DirectiveConfig;
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
export declare function createRoleDirective(allowedRoles: string[]): DirectiveConfig;
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
export declare function createPermissionDirective(requiredPermissions: string[]): DirectiveConfig;
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
export declare function createRateLimitDirective(maxRequests: number, windowMs: number): DirectiveConfig;
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
export declare function createDeprecatedDirective(reason: string, alternativeField?: string): DirectiveConfig;
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
export declare function createFieldMasking(sensitiveFields: string[], maskFn: (value: any) => any): (data: any, context: GraphQLContext) => any;
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
export declare function createAuditMiddleware(auditLogger: (entry: {
    userId: string;
    action: string;
    resourceType: string;
    resourceId?: string;
    changes?: any;
    timestamp: Date;
    ipAddress?: string;
}) => void | Promise<void>): (resolver: GraphQLFieldResolver<any, any>) => GraphQLFieldResolver<any, any>;
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
export declare function createOwnershipChecker(ownerExtractor: (resource: any) => string | Promise<string>): (user: any, resource: any) => Promise<boolean>;
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
export declare function createComplexityCalculator(config: ComplexityConfig): (info: GraphQLResolveInfo) => number;
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
export declare function createDepthLimiter(maxDepth: number): (info: GraphQLResolveInfo) => void;
/**
 * @description Export all utilities for easy importing
 */
declare const _default: {
    createBaseResolver: typeof createBaseResolver;
    createPaginatedResolver: typeof createPaginatedResolver;
    createRelayResolver: typeof createRelayResolver;
    createAuthorizedResolver: typeof createAuthorizedResolver;
    createMonitoredResolver: typeof createMonitoredResolver;
    createPropertyResolver: typeof createPropertyResolver;
    createCachedFieldResolver: typeof createCachedFieldResolver;
    createConditionalResolver: typeof createConditionalResolver;
    createAggregationResolver: typeof createAggregationResolver;
    createBatchedFieldResolver: typeof createBatchedFieldResolver;
    createOffsetPagination: typeof createOffsetPagination;
    createPaginatedResult: typeof createPaginatedResult;
    encodeRelayCursor: typeof encodeRelayCursor;
    decodeRelayCursor: typeof decodeRelayCursor;
    createRelayConnection: typeof createRelayConnection;
    createDataLoader: typeof createDataLoader;
    createEntityDataLoader: typeof createEntityDataLoader;
    createOneToManyDataLoader: typeof createOneToManyDataLoader;
    createManyToManyDataLoader: typeof createManyToManyDataLoader;
    createAggregationDataLoader: typeof createAggregationDataLoader;
    createSubscriptionResolver: typeof createSubscriptionResolver;
    createFilteredSubscription: typeof createFilteredSubscription;
    createUserSubscription: typeof createUserSubscription;
    createRoomSubscription: typeof createRoomSubscription;
    createMultiTopicSubscription: typeof createMultiTopicSubscription;
    validateInput: typeof validateInput;
    ValidateInput: typeof ValidateInput;
    sanitizeInput: typeof sanitizeInput;
    validateRequiredFields: typeof validateRequiredFields;
    createFieldValidator: typeof createFieldValidator;
    createDateTimeScalar: typeof createDateTimeScalar;
    createJSONScalar: typeof createJSONScalar;
    createEmailScalar: typeof createEmailScalar;
    createUUIDScalar: typeof createUUIDScalar;
    createPhoneNumberScalar: typeof createPhoneNumberScalar;
    createAuthDirective: typeof createAuthDirective;
    createRoleDirective: typeof createRoleDirective;
    createPermissionDirective: typeof createPermissionDirective;
    createRateLimitDirective: typeof createRateLimitDirective;
    createDeprecatedDirective: typeof createDeprecatedDirective;
    createFieldMasking: typeof createFieldMasking;
    createAuditMiddleware: typeof createAuditMiddleware;
    createOwnershipChecker: typeof createOwnershipChecker;
    createComplexityCalculator: typeof createComplexityCalculator;
    createDepthLimiter: typeof createDepthLimiter;
};
export default _default;
//# sourceMappingURL=graphql-resolver-kit.d.ts.map