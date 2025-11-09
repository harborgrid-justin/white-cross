/**
 * @fileoverview GraphQL Utilities
 * @module core/api/graphql
 *
 * GraphQL schema building, resolver composition, and query optimization utilities.
 */

/**
 * GraphQL field type
 */
export type GraphQLFieldType =
  | 'String'
  | 'Int'
  | 'Float'
  | 'Boolean'
  | 'ID'
  | string;

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
export function buildGraphQLType(definition: GraphQLTypeDefinition): string {
  const { name, description, fields, interfaces = [] } = definition;

  let schema = '';

  // Add description
  if (description) {
    schema += `"""${description}"""\n`;
  }

  // Add type declaration
  schema += `type ${name}`;

  // Add interfaces
  if (interfaces.length > 0) {
    schema += ` implements ${interfaces.join(' & ')}`;
  }

  schema += ' {\n';

  // Add fields
  Object.entries(fields).forEach(([fieldName, field]) => {
    if (field.description) {
      schema += `  """${field.description}"""\n`;
    }

    schema += `  ${fieldName}`;

    // Add arguments
    if (field.args && Object.keys(field.args).length > 0) {
      const args = Object.entries(field.args)
        .map(([argName, arg]) => {
          let argDef = `${argName}: ${formatGraphQLType(arg.type, arg.required)}`;
          if (arg.defaultValue !== undefined) {
            argDef += ` = ${JSON.stringify(arg.defaultValue)}`;
          }
          return argDef;
        })
        .join(', ');
      schema += `(${args})`;
    }

    schema += `: ${formatGraphQLType(field.type, field.required, field.list)}`;

    // Add deprecation
    if (field.deprecationReason) {
      schema += ` @deprecated(reason: "${field.deprecationReason}")`;
    }

    schema += '\n';
  });

  schema += '}\n';

  return schema;
}

/**
 * Formats GraphQL type with modifiers
 *
 * @param type - Base type
 * @param required - Non-nullable flag
 * @param list - Array flag
 * @returns Formatted type string
 */
export function formatGraphQLType(
  type: string,
  required?: boolean,
  list?: boolean
): string {
  let formatted = type;

  if (list) {
    formatted = `[${formatted}]`;
  }

  if (required) {
    formatted += '!';
  }

  return formatted;
}

/**
 * Builds GraphQL input type definition
 *
 * @param name - Input type name
 * @param fields - Input fields
 * @param description - Input description
 * @returns GraphQL input type string
 */
export function buildGraphQLInput(
  name: string,
  fields: Record<string, { type: GraphQLFieldType; required?: boolean; description?: string }>,
  description?: string
): string {
  let schema = '';

  if (description) {
    schema += `"""${description}"""\n`;
  }

  schema += `input ${name} {\n`;

  Object.entries(fields).forEach(([fieldName, field]) => {
    if (field.description) {
      schema += `  """${field.description}"""\n`;
    }
    schema += `  ${fieldName}: ${formatGraphQLType(field.type, field.required)}\n`;
  });

  schema += '}\n';

  return schema;
}

/**
 * Builds GraphQL enum definition
 *
 * @param name - Enum name
 * @param values - Enum values
 * @param description - Enum description
 * @returns GraphQL enum string
 */
export function buildGraphQLEnum(
  name: string,
  values: Array<string | { name: string; description?: string; deprecationReason?: string }>,
  description?: string
): string {
  let schema = '';

  if (description) {
    schema += `"""${description}"""\n`;
  }

  schema += `enum ${name} {\n`;

  values.forEach((value) => {
    if (typeof value === 'string') {
      schema += `  ${value}\n`;
    } else {
      if (value.description) {
        schema += `  """${value.description}"""\n`;
      }
      schema += `  ${value.name}`;
      if (value.deprecationReason) {
        schema += ` @deprecated(reason: "${value.deprecationReason}")`;
      }
      schema += '\n';
    }
  });

  schema += '}\n';

  return schema;
}

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
export function createDataLoader<K, V>(
  batchLoadFn: (keys: readonly K[]) => Promise<V[]>,
  options: {
    cache?: boolean;
    maxBatchSize?: number;
  } = {}
): {
  load: (key: K) => Promise<V>;
  loadMany: (keys: K[]) => Promise<V[]>;
  clear: (key: K) => void;
  clearAll: () => void;
} {
  const { cache = true, maxBatchSize = Infinity } = options;

  const cacheMap = new Map<K, Promise<V>>();
  const queue: K[] = [];
  let batchScheduled = false;

  const dispatchBatch = async () => {
    const batch = queue.splice(0, maxBatchSize);
    batchScheduled = false;

    try {
      const results = await batchLoadFn(batch);
      batch.forEach((key, index) => {
        const promise = Promise.resolve(results[index]);
        if (cache) {
          cacheMap.set(key, promise);
        }
      });
      return results;
    } catch (error) {
      batch.forEach((key) => {
        if (cache) {
          cacheMap.delete(key);
        }
      });
      throw error;
    }
  };

  const scheduleBatch = () => {
    if (!batchScheduled) {
      batchScheduled = true;
      process.nextTick(dispatchBatch);
    }
  };

  return {
    load: (key: K): Promise<V> => {
      if (cache && cacheMap.has(key)) {
        return cacheMap.get(key)!;
      }

      const promise = new Promise<V>((resolve, reject) => {
        queue.push(key);
        scheduleBatch();

        // Wait for batch to be dispatched
        const checkBatch = () => {
          const cached = cacheMap.get(key);
          if (cached) {
            resolve(cached);
          } else {
            setTimeout(checkBatch, 0);
          }
        };
        setTimeout(checkBatch, 0);
      });

      if (cache) {
        cacheMap.set(key, promise);
      }

      return promise;
    },

    loadMany: async (keys: K[]): Promise<V[]> => {
      return Promise.all(keys.map((key) => this.load(key)));
    },

    clear: (key: K): void => {
      cacheMap.delete(key);
    },

    clearAll: (): void => {
      cacheMap.clear();
    },
  };
}

/**
 * Composes multiple resolver functions
 *
 * @param resolvers - Array of resolver functions
 * @returns Composed resolver function
 */
export function composeResolvers(
  ...resolvers: Array<(parent: any, args: any, context: any, info: any) => any>
): (parent: any, args: any, context: any, info: any) => any {
  return async (parent, args, context, info) => {
    let result = parent;
    for (const resolver of resolvers) {
      result = await resolver(result, args, context, info);
    }
    return result;
  };
}

/**
 * Creates authorization middleware for resolvers
 *
 * @param authorize - Authorization function
 * @returns Resolver wrapper function
 */
export function authorizeResolver(
  authorize: (parent: any, args: any, context: any) => boolean | Promise<boolean>
): (
  resolver: (parent: any, args: any, context: any, info: any) => any
) => (parent: any, args: any, context: any, info: any) => any {
  return (resolver) => async (parent, args, context, info) => {
    const isAuthorized = await authorize(parent, args, context);
    if (!isAuthorized) {
      throw new Error('Unauthorized');
    }
    return resolver(parent, args, context, info);
  };
}

/**
 * Parses GraphQL query to extract requested fields
 *
 * @param info - GraphQL resolve info
 * @returns Array of requested field names
 */
export function getRequestedFields(info: any): string[] {
  const fields: string[] = [];

  const extractFields = (selections: any[]) => {
    selections.forEach((selection: any) => {
      if (selection.kind === 'Field') {
        fields.push(selection.name.value);
        if (selection.selectionSet) {
          extractFields(selection.selectionSet.selections);
        }
      }
    });
  };

  if (info.fieldNodes) {
    info.fieldNodes.forEach((node: any) => {
      if (node.selectionSet) {
        extractFields(node.selectionSet.selections);
      }
    });
  }

  return fields;
}

/**
 * Creates error formatter for GraphQL errors
 *
 * @param error - GraphQL error
 * @returns Formatted error object
 */
export function formatGraphQLError(error: any): {
  message: string;
  extensions?: Record<string, any>;
  locations?: any[];
  path?: any[];
} {
  return {
    message: error.message,
    extensions: {
      code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
      ...(process.env.NODE_ENV === 'development' && {
        stack: error.stack,
      }),
    },
    locations: error.locations,
    path: error.path,
  };
}
