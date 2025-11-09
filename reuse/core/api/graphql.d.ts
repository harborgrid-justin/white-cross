/**
 * @fileoverview GraphQL Utilities
 * @module core/api/graphql
 *
 * GraphQL schema building, resolver composition, and query optimization utilities.
 */
/**
 * GraphQL field type
 */
export type GraphQLFieldType = 'String' | 'Int' | 'Float' | 'Boolean' | 'ID' | string;
/**
 * GraphQL field definition
 */
export interface GraphQLField {
    /** Field type */
    type: GraphQLFieldType;
    /** Non-nullable flag */
    required?: boolean;
    /** Array flag */
    list?: boolean;
    /** Field description */
    description?: string;
    /** Field arguments */
    args?: Record<string, {
        type: GraphQLFieldType;
        required?: boolean;
        defaultValue?: any;
        description?: string;
    }>;
    /** Field resolver */
    resolve?: (parent: any, args: any, context: any, info: any) => any;
    /** Deprecation reason */
    deprecationReason?: string;
}
/**
 * GraphQL type definition
 */
export interface GraphQLTypeDefinition {
    /** Type name */
    name: string;
    /** Type description */
    description?: string;
    /** Type fields */
    fields: Record<string, GraphQLField>;
    /** Interfaces this type implements */
    interfaces?: string[];
}
/**
 * GraphQL resolver context
 */
export interface GraphQLContext {
    /** Current user */
    user?: any;
    /** Request object */
    req?: any;
    /** Data loaders */
    loaders?: Record<string, any>;
    /** Additional context data */
    [key: string]: any;
}
/**
 * Builds a GraphQL type definition string
 *
 * @param definition - Type definition
 * @returns GraphQL schema definition string
 *
 * @example
 * ```typescript
 * const userType = buildGraphQLType({
 *   name: 'User',
 *   description: 'User type',
 *   fields: {
 *     id: { type: 'ID', required: true },
 *     name: { type: 'String', required: true },
 *     email: { type: 'String' }
 *   }
 * });
 * ```
 */
export declare function buildGraphQLType(definition: GraphQLTypeDefinition): string;
/**
 * Formats GraphQL type with modifiers
 *
 * @param type - Base type
 * @param required - Non-nullable flag
 * @param list - Array flag
 * @returns Formatted type string
 */
export declare function formatGraphQLType(type: string, required?: boolean, list?: boolean): string;
/**
 * Builds GraphQL input type definition
 *
 * @param name - Input type name
 * @param fields - Input fields
 * @param description - Input description
 * @returns GraphQL input type string
 */
export declare function buildGraphQLInput(name: string, fields: Record<string, {
    type: GraphQLFieldType;
    required?: boolean;
    description?: string;
}>, description?: string): string;
/**
 * Builds GraphQL enum definition
 *
 * @param name - Enum name
 * @param values - Enum values
 * @param description - Enum description
 * @returns GraphQL enum string
 */
export declare function buildGraphQLEnum(name: string, values: Array<string | {
    name: string;
    description?: string;
    deprecationReason?: string;
}>, description?: string): string;
/**
 * Creates a data loader for batch loading
 *
 * @param batchLoadFn - Batch loading function
 * @param options - Loader options
 * @returns Data loader instance
 *
 * @example
 * ```typescript
 * const userLoader = createDataLoader(async (ids) => {
 *   return await User.findAll({ where: { id: ids } });
 * });
 * ```
 */
export declare function createDataLoader<K, V>(batchLoadFn: (keys: readonly K[]) => Promise<V[]>, options?: {
    cache?: boolean;
    maxBatchSize?: number;
}): {
    load: (key: K) => Promise<V>;
    loadMany: (keys: K[]) => Promise<V[]>;
    clear: (key: K) => void;
    clearAll: () => void;
};
/**
 * Composes multiple resolver functions
 *
 * @param resolvers - Array of resolver functions
 * @returns Composed resolver function
 */
export declare function composeResolvers(...resolvers: Array<(parent: any, args: any, context: any, info: any) => any>): (parent: any, args: any, context: any, info: any) => any;
/**
 * Creates authorization middleware for resolvers
 *
 * @param authorize - Authorization function
 * @returns Resolver wrapper function
 */
export declare function authorizeResolver(authorize: (parent: any, args: any, context: any) => boolean | Promise<boolean>): (resolver: (parent: any, args: any, context: any, info: any) => any) => (parent: any, args: any, context: any, info: any) => any;
/**
 * Parses GraphQL query to extract requested fields
 *
 * @param info - GraphQL resolve info
 * @returns Array of requested field names
 */
export declare function getRequestedFields(info: any): string[];
/**
 * Creates error formatter for GraphQL errors
 *
 * @param error - GraphQL error
 * @returns Formatted error object
 */
export declare function formatGraphQLError(error: any): {
    message: string;
    extensions?: Record<string, any>;
    locations?: any[];
    path?: any[];
};
//# sourceMappingURL=graphql.d.ts.map