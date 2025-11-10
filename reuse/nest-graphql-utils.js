"use strict";
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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailAddressScalar = exports.JSONScalar = exports.DateTimeScalar = void 0;
exports.createObjectType = createObjectType;
exports.createInputType = createInputType;
exports.createInterfaceType = createInterfaceType;
exports.registerEnum = registerEnum;
exports.createFieldWithMetadata = createFieldWithMetadata;
exports.generateTypeDefinitions = generateTypeDefinitions;
exports.mergeSchemaDefinitions = mergeSchemaDefinitions;
exports.validateSchemaDefinition = validateSchemaDefinition;
exports.createConnectionType = createConnectionType;
exports.buildPaginationArgs = buildPaginationArgs;
exports.encodeCursor = encodeCursor;
exports.decodeCursor = decodeCursor;
exports.buildConnection = buildConnection;
exports.createBatchedFieldResolver = createBatchedFieldResolver;
exports.memoizeFieldResolver = memoizeFieldResolver;
exports.getFieldSelections = getFieldSelections;
exports.isFieldSelected = isFieldSelected;
exports.createDataLoader = createDataLoader;
exports.createOneToManyLoader = createOneToManyLoader;
exports.createManyToManyLoader = createManyToManyLoader;
exports.createLoaderContext = createLoaderContext;
exports.primeLoader = primeLoader;
exports.createGraphQLContext = createGraphQLContext;
exports.extractUserFromContext = extractUserFromContext;
exports.getLoader = getLoader;
exports.generateRequestId = generateRequestId;
exports.createFilterInput = createFilterInput;
exports.createSortInput = createSortInput;
exports.sanitizeInput = sanitizeInput;
exports.validateRequiredFields = validateRequiredFields;
exports.formatGraphQLError = formatGraphQLError;
exports.sanitizeError = sanitizeError;
exports.createErrorFormatter = createErrorFormatter;
exports.isValidationError = isValidationError;
exports.calculateComplexity = calculateComplexity;
exports.createArrayComplexity = createArrayComplexity;
exports.createDepthLimiter = createDepthLimiter;
exports.createReferenceResolver = createReferenceResolver;
exports.createExternalReference = createExternalReference;
exports.checkFieldAuthorization = checkFieldAuthorization;
exports.maskPHIField = maskPHIField;
exports.createMockContext = createMockContext;
exports.createMockLoader = createMockLoader;
exports.createResolverSpy = createResolverSpy;
exports.executeTestQuery = executeTestQuery;
exports.measureResolverTime = measureResolverTime;
exports.logQueryMetrics = logQueryMetrics;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("graphql");
const dataloader_1 = __importDefault(require("dataloader"));
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
function createObjectType(name, description, options) {
    return function (target) {
        return (0, graphql_1.ObjectType)({
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
function createInputType(name, description) {
    return function (target) {
        return (0, graphql_1.InputType)({ description })(target);
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
function createInterfaceType(name, description) {
    return function (target) {
        return (0, graphql_1.InterfaceType)({ description })(target);
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
function registerEnum(enumObject, name, description) {
    (0, graphql_1.registerEnumType)(enumObject, { name, description });
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
function createFieldWithMetadata(metadata) {
    return (0, graphql_1.Field)(metadata.type || String, {
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
function generateTypeDefinitions(target) {
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
function mergeSchemaDefinitions(schemas) {
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
function validateSchemaDefinition(schema) {
    const errors = [];
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
function createConnectionType(nodeType, name) {
    let EdgeType = (() => {
        let _classDecorators = [(0, graphql_1.ObjectType)(`${name}Edge`)];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        let _node_decorators;
        let _node_initializers = [];
        let _node_extraInitializers = [];
        let _cursor_decorators;
        let _cursor_initializers = [];
        let _cursor_extraInitializers = [];
        var EdgeType = _classThis = class {
            constructor() {
                this.node = __runInitializers(this, _node_initializers, void 0);
                this.cursor = (__runInitializers(this, _node_extraInitializers), __runInitializers(this, _cursor_initializers, void 0));
                __runInitializers(this, _cursor_extraInitializers);
            }
        };
        __setFunctionName(_classThis, "EdgeType");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _node_decorators = [(0, graphql_1.Field)(() => nodeType)];
            _cursor_decorators = [(0, graphql_1.Field)()];
            __esDecorate(null, null, _node_decorators, { kind: "field", name: "node", static: false, private: false, access: { has: obj => "node" in obj, get: obj => obj.node, set: (obj, value) => { obj.node = value; } }, metadata: _metadata }, _node_initializers, _node_extraInitializers);
            __esDecorate(null, null, _cursor_decorators, { kind: "field", name: "cursor", static: false, private: false, access: { has: obj => "cursor" in obj, get: obj => obj.cursor, set: (obj, value) => { obj.cursor = value; } }, metadata: _metadata }, _cursor_initializers, _cursor_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            EdgeType = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return EdgeType = _classThis;
    })();
    let PageInfoType = (() => {
        let _classDecorators = [(0, graphql_1.ObjectType)(`${name}PageInfo`)];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        let _hasNextPage_decorators;
        let _hasNextPage_initializers = [];
        let _hasNextPage_extraInitializers = [];
        let _hasPreviousPage_decorators;
        let _hasPreviousPage_initializers = [];
        let _hasPreviousPage_extraInitializers = [];
        let _startCursor_decorators;
        let _startCursor_initializers = [];
        let _startCursor_extraInitializers = [];
        let _endCursor_decorators;
        let _endCursor_initializers = [];
        let _endCursor_extraInitializers = [];
        let _totalCount_decorators;
        let _totalCount_initializers = [];
        let _totalCount_extraInitializers = [];
        var PageInfoType = _classThis = class {
            constructor() {
                this.hasNextPage = __runInitializers(this, _hasNextPage_initializers, void 0);
                this.hasPreviousPage = (__runInitializers(this, _hasNextPage_extraInitializers), __runInitializers(this, _hasPreviousPage_initializers, void 0));
                this.startCursor = (__runInitializers(this, _hasPreviousPage_extraInitializers), __runInitializers(this, _startCursor_initializers, void 0));
                this.endCursor = (__runInitializers(this, _startCursor_extraInitializers), __runInitializers(this, _endCursor_initializers, void 0));
                this.totalCount = (__runInitializers(this, _endCursor_extraInitializers), __runInitializers(this, _totalCount_initializers, void 0));
                __runInitializers(this, _totalCount_extraInitializers);
            }
        };
        __setFunctionName(_classThis, "PageInfoType");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _hasNextPage_decorators = [(0, graphql_1.Field)()];
            _hasPreviousPage_decorators = [(0, graphql_1.Field)()];
            _startCursor_decorators = [(0, graphql_1.Field)({ nullable: true })];
            _endCursor_decorators = [(0, graphql_1.Field)({ nullable: true })];
            _totalCount_decorators = [(0, graphql_1.Field)({ nullable: true })];
            __esDecorate(null, null, _hasNextPage_decorators, { kind: "field", name: "hasNextPage", static: false, private: false, access: { has: obj => "hasNextPage" in obj, get: obj => obj.hasNextPage, set: (obj, value) => { obj.hasNextPage = value; } }, metadata: _metadata }, _hasNextPage_initializers, _hasNextPage_extraInitializers);
            __esDecorate(null, null, _hasPreviousPage_decorators, { kind: "field", name: "hasPreviousPage", static: false, private: false, access: { has: obj => "hasPreviousPage" in obj, get: obj => obj.hasPreviousPage, set: (obj, value) => { obj.hasPreviousPage = value; } }, metadata: _metadata }, _hasPreviousPage_initializers, _hasPreviousPage_extraInitializers);
            __esDecorate(null, null, _startCursor_decorators, { kind: "field", name: "startCursor", static: false, private: false, access: { has: obj => "startCursor" in obj, get: obj => obj.startCursor, set: (obj, value) => { obj.startCursor = value; } }, metadata: _metadata }, _startCursor_initializers, _startCursor_extraInitializers);
            __esDecorate(null, null, _endCursor_decorators, { kind: "field", name: "endCursor", static: false, private: false, access: { has: obj => "endCursor" in obj, get: obj => obj.endCursor, set: (obj, value) => { obj.endCursor = value; } }, metadata: _metadata }, _endCursor_initializers, _endCursor_extraInitializers);
            __esDecorate(null, null, _totalCount_decorators, { kind: "field", name: "totalCount", static: false, private: false, access: { has: obj => "totalCount" in obj, get: obj => obj.totalCount, set: (obj, value) => { obj.totalCount = value; } }, metadata: _metadata }, _totalCount_initializers, _totalCount_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            PageInfoType = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return PageInfoType = _classThis;
    })();
    let ConnectionType = (() => {
        let _classDecorators = [(0, graphql_1.ObjectType)(name)];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        let _edges_decorators;
        let _edges_initializers = [];
        let _edges_extraInitializers = [];
        let _pageInfo_decorators;
        let _pageInfo_initializers = [];
        let _pageInfo_extraInitializers = [];
        let _totalCount_decorators;
        let _totalCount_initializers = [];
        let _totalCount_extraInitializers = [];
        var ConnectionType = _classThis = class {
            constructor() {
                this.edges = __runInitializers(this, _edges_initializers, void 0);
                this.pageInfo = (__runInitializers(this, _edges_extraInitializers), __runInitializers(this, _pageInfo_initializers, void 0));
                this.totalCount = (__runInitializers(this, _pageInfo_extraInitializers), __runInitializers(this, _totalCount_initializers, void 0));
                __runInitializers(this, _totalCount_extraInitializers);
            }
        };
        __setFunctionName(_classThis, "ConnectionType");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _edges_decorators = [(0, graphql_1.Field)(() => [EdgeType])];
            _pageInfo_decorators = [(0, graphql_1.Field)(() => PageInfoType)];
            _totalCount_decorators = [(0, graphql_1.Field)({ nullable: true })];
            __esDecorate(null, null, _edges_decorators, { kind: "field", name: "edges", static: false, private: false, access: { has: obj => "edges" in obj, get: obj => obj.edges, set: (obj, value) => { obj.edges = value; } }, metadata: _metadata }, _edges_initializers, _edges_extraInitializers);
            __esDecorate(null, null, _pageInfo_decorators, { kind: "field", name: "pageInfo", static: false, private: false, access: { has: obj => "pageInfo" in obj, get: obj => obj.pageInfo, set: (obj, value) => { obj.pageInfo = value; } }, metadata: _metadata }, _pageInfo_initializers, _pageInfo_extraInitializers);
            __esDecorate(null, null, _totalCount_decorators, { kind: "field", name: "totalCount", static: false, private: false, access: { has: obj => "totalCount" in obj, get: obj => obj.totalCount, set: (obj, value) => { obj.totalCount = value; } }, metadata: _metadata }, _totalCount_initializers, _totalCount_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ConnectionType = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return ConnectionType = _classThis;
    })();
    return ConnectionType;
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
function buildPaginationArgs(args) {
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
function encodeCursor(value) {
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
function decodeCursor(cursor) {
    try {
        const json = Buffer.from(cursor, 'base64').toString('utf-8');
        return JSON.parse(json);
    }
    catch {
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
function buildConnection(items, totalCount, args) {
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
function createBatchedFieldResolver(loader, parentKey = 'id') {
    return async (parent) => {
        const key = parent[parentKey];
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
function memoizeFieldResolver(resolver) {
    const cache = new WeakMap();
    return async (parent) => {
        if (cache.has(parent)) {
            return cache.get(parent);
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
function getFieldSelections(info, maxDepth = 3) {
    const selections = new Set();
    function traverse(selectionSet, depth, prefix = '') {
        if (!selectionSet || depth > maxDepth)
            return;
        selectionSet.selections?.forEach((selection) => {
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
function isFieldSelected(info, fieldName) {
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
function createDataLoader(batchLoadFn, options) {
    return new dataloader_1.default(async (keys) => {
        const results = await batchLoadFn(keys);
        // Create a map for O(1) lookup
        const resultMap = new Map();
        results.forEach((result) => {
            const key = result?.id || result;
            resultMap.set(key, result);
        });
        // Return results in same order as keys
        return keys.map(key => resultMap.get(key) || null);
    }, {
        cache: options?.cache ?? true,
        maxBatchSize: options?.maxBatchSize || 100,
        batchScheduleFn: options?.batchScheduleFn || (cb => setTimeout(cb, 1)),
        ...options,
    });
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
function createOneToManyLoader(batchLoadFn, foreignKey, options) {
    return new dataloader_1.default(async (keys) => {
        const results = await batchLoadFn(keys);
        // Group results by foreign key
        const grouped = new Map();
        keys.forEach(key => grouped.set(key, []));
        results.forEach((result) => {
            const key = result[foreignKey];
            if (grouped.has(key)) {
                grouped.get(key).push(result);
            }
        });
        return keys.map(key => grouped.get(key) || []);
    }, {
        cache: options?.cache ?? true,
        maxBatchSize: options?.maxBatchSize || 100,
        ...options,
    });
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
function createManyToManyLoader(batchLoadFn, options) {
    return new dataloader_1.default(async (keys) => {
        const results = await batchLoadFn(keys);
        const resultMap = new Map(results.map(r => [r.key, r.values]));
        return keys.map(key => resultMap.get(key) || []);
    }, {
        cache: options?.cache ?? true,
        ...options,
    });
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
function createLoaderContext(loaders) {
    const context = {};
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
function primeLoader(loader, items, keyFn) {
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
function createGraphQLContext(req, res, loaders) {
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
function extractUserFromContext(context) {
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
function getLoader(context, loaderName) {
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
function generateRequestId() {
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
exports.DateTimeScalar = new graphql_2.GraphQLScalarType({
    name: 'DateTime',
    description: 'DateTime custom scalar type',
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
        throw new graphql_2.GraphQLError('DateTime must be a string or integer');
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
exports.JSONScalar = new graphql_2.GraphQLScalarType({
    name: 'JSON',
    description: 'JSON custom scalar type',
    serialize(value) {
        return value;
    },
    parseValue(value) {
        return value;
    },
    parseLiteral(ast) {
        if (ast.kind === graphql_2.Kind.OBJECT) {
            return parseObjectLiteral(ast);
        }
        if (ast.kind === graphql_2.Kind.LIST) {
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
function parseObjectLiteral(ast) {
    if (ast.kind === graphql_2.Kind.OBJECT) {
        const obj = {};
        ast.fields.forEach((field) => {
            obj[field.name.value] = parseObjectLiteral(field.value);
        });
        return obj;
    }
    if (ast.kind === graphql_2.Kind.LIST) {
        return ast.values.map(parseObjectLiteral);
    }
    if (ast.kind === graphql_2.Kind.STRING || ast.kind === graphql_2.Kind.BOOLEAN) {
        return ast.value;
    }
    if (ast.kind === graphql_2.Kind.INT || ast.kind === graphql_2.Kind.FLOAT) {
        return Number(ast.value);
    }
    if (ast.kind === graphql_2.Kind.NULL) {
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
exports.EmailAddressScalar = new graphql_2.GraphQLScalarType({
    name: 'EmailAddress',
    description: 'Email address scalar type with validation',
    serialize(value) {
        if (typeof value !== 'string' || !isValidEmail(value)) {
            throw new graphql_2.GraphQLError('Invalid email address');
        }
        return value;
    },
    parseValue(value) {
        if (typeof value !== 'string' || !isValidEmail(value)) {
            throw new graphql_2.GraphQLError('Invalid email address');
        }
        return value;
    },
    parseLiteral(ast) {
        if (ast.kind === graphql_2.Kind.STRING && isValidEmail(ast.value)) {
            return ast.value;
        }
        throw new graphql_2.GraphQLError('Invalid email address');
    },
});
/**
 * Validate email address format
 *
 * @param email - Email string
 * @returns true if valid
 */
function isValidEmail(email) {
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
function createFilterInput(fields) {
    const filter = {};
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
function createSortInput(field, order = 'ASC') {
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
function sanitizeInput(input, allowedFields) {
    const sanitized = {};
    allowedFields.forEach(field => {
        if (input[field] !== undefined) {
            sanitized[field] = input[field];
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
function validateRequiredFields(input, requiredFields) {
    const missing = requiredFields.filter(field => !input[field]);
    if (missing.length > 0) {
        throw new graphql_2.GraphQLError(`Missing required fields: ${missing.join(', ')}`, { extensions: { code: 'VALIDATION_ERROR', fields: missing } });
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
function formatGraphQLError(message, options) {
    return new graphql_2.GraphQLError(message, {
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
function sanitizeError(error, isDevelopment = false) {
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
function createErrorFormatter(options) {
    return (error) => {
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
function isValidationError(error) {
    return (error.extensions?.code === 'VALIDATION_ERROR' ||
        error.extensions?.code === 'BAD_USER_INPUT');
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
function calculateComplexity(args) {
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
function createArrayComplexity(multiplier = 1) {
    return (args) => {
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
function createDepthLimiter(maxDepth) {
    return (context) => {
        const depth = getQueryDepth(context.document);
        if (depth > maxDepth) {
            throw new graphql_2.GraphQLError(`Query depth of ${depth} exceeds maximum allowed depth of ${maxDepth}`, { extensions: { code: 'QUERY_TOO_DEEP' } });
        }
    };
}
/**
 * Calculate query depth from AST
 *
 * @param document - GraphQL document
 * @returns Query depth
 */
function getQueryDepth(document) {
    let maxDepth = 0;
    function traverse(node, depth) {
        if (node.selectionSet) {
            const newDepth = depth + 1;
            maxDepth = Math.max(maxDepth, newDepth);
            node.selectionSet.selections.forEach((selection) => {
                traverse(selection, newDepth);
            });
        }
    }
    document.definitions.forEach((def) => {
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
function createReferenceResolver(service, idField = 'id') {
    return async (reference) => {
        const id = reference[idField];
        if (!id)
            return null;
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
function createExternalReference(typename, id) {
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
async function checkFieldAuthorization(context, rule, parent) {
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
function maskPHIField(value, context, options) {
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
function createMockContext(overrides) {
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
function createMockLoader(mockData) {
    return new dataloader_1.default(async (keys) => {
        return keys.map(key => mockData.get(key) || null);
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
function createResolverSpy(resolver) {
    const calls = [];
    const spy = async (...args) => {
        calls.push(args);
        return resolver(...args);
    };
    spy.calls = calls;
    spy.callCount = () => calls.length;
    spy.reset = () => calls.splice(0, calls.length);
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
async function executeTestQuery(schema, query, variables, context) {
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
async function measureResolverTime(resolver, name) {
    const start = Date.now();
    try {
        const result = await resolver();
        const duration = Date.now() - start;
        if (duration > 1000) {
            console.warn(`[GraphQL] Slow resolver: ${name} took ${duration}ms`);
        }
        return result;
    }
    catch (error) {
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
function logQueryMetrics(context, info, operationName) {
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
//# sourceMappingURL=nest-graphql-utils.js.map