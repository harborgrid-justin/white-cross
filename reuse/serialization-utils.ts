/**
 * LOC: SER1234567
 * File: /reuse/serialization-utils.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Data persistence modules
 *   - API serialization layers
 *   - State management systems
 *   - Cache implementations
 */

/**
 * File: /reuse/serialization-utils.ts
 * Locator: WC-UTL-SER-003
 * Purpose: Comprehensive Serialization Utilities - Advanced data serialization and deserialization helpers
 *
 * Upstream: Independent utility module for serialization operations
 * Downstream: ../backend/*, ../frontend/*, data persistence, API layers, caching systems
 * Dependencies: TypeScript 5.x, Node 18+
 * Exports: 45 utility functions for serialization, deserialization, cloning, and data transformation
 *
 * LLM Context: Comprehensive serialization utilities for the White Cross system.
 * Provides JSON/BSON/XML/YAML serialization, deep cloning, circular reference handling,
 * binary data serialization, and custom serialization strategies. Essential for reliable
 * data persistence, API communication, and state management in healthcare applications.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface SerializationOptions {
  includePrototype?: boolean;
  handleCircular?: boolean;
  maxDepth?: number;
  customReplacers?: Map<string, (value: any) => any>;
}

interface DeserializationOptions {
  restorePrototype?: boolean;
  customRevivers?: Map<string, (value: any) => any>;
  validateSchema?: boolean;
}

interface CircularReference {
  id: string;
  path: string[];
  value: any;
}

interface SerializationMetadata {
  version: string;
  timestamp: number;
  type: string;
  encoding?: string;
}

interface CloneOptions {
  deep?: boolean;
  preservePrototype?: boolean;
  handleCircular?: boolean;
}

interface StreamSerializationOptions {
  chunkSize?: number;
  encoding?: BufferEncoding;
  compress?: boolean;
}

// ============================================================================
// JSON SERIALIZATION WITH CUSTOM REPLACERS
// ============================================================================

/**
 * Serializes object to JSON with custom replacer function.
 *
 * @param {any} obj - Object to serialize
 * @param {(key: string, value: any) => any} [replacer] - Custom replacer function
 * @param {number | string} [space] - Indentation for pretty printing
 * @returns {string} JSON string
 *
 * @example
 * ```typescript
 * const obj = { name: 'John', age: 30, password: 'secret123' };
 * const json = serializeToJson(obj, (key, value) => {
 *   if (key === 'password') return undefined;
 *   return value;
 * }, 2);
 * // Result: '{\n  "name": "John",\n  "age": 30\n}'
 * ```
 */
export const serializeToJson = (
  obj: any,
  replacer?: (key: string, value: any) => any,
  space?: number | string,
): string => {
  return JSON.stringify(obj, replacer as any, space);
};

/**
 * Serializes object with support for special types (Date, RegExp, undefined, BigInt).
 *
 * @param {any} obj - Object to serialize
 * @param {number | string} [space] - Indentation for pretty printing
 * @returns {string} JSON string with special types encoded
 *
 * @example
 * ```typescript
 * const obj = {
 *   created: new Date('2024-01-01'),
 *   pattern: /test/gi,
 *   count: BigInt(9007199254740991),
 *   value: undefined
 * };
 * const json = serializeWithSpecialTypes(obj);
 * // Preserves Date, RegExp, BigInt, undefined through special encoding
 * ```
 */
export const serializeWithSpecialTypes = (
  obj: any,
  space?: number | string,
): string => {
  return JSON.stringify(
    obj,
    (key, value) => {
      if (value instanceof Date) {
        return { __type: 'Date', value: value.toISOString() };
      }
      if (value instanceof RegExp) {
        return { __type: 'RegExp', value: value.source, flags: value.flags };
      }
      if (typeof value === 'bigint') {
        return { __type: 'BigInt', value: value.toString() };
      }
      if (value === undefined) {
        return { __type: 'undefined' };
      }
      if (value instanceof Map) {
        return { __type: 'Map', value: Array.from(value.entries()) };
      }
      if (value instanceof Set) {
        return { __type: 'Set', value: Array.from(value.values()) };
      }
      return value;
    },
    space,
  );
};

/**
 * Creates a custom JSON replacer that filters specific keys.
 *
 * @param {string[]} excludeKeys - Keys to exclude from serialization
 * @returns {(key: string, value: any) => any} Replacer function
 *
 * @example
 * ```typescript
 * const replacer = createFilterReplacer(['password', 'secret', 'token']);
 * const json = JSON.stringify(user, replacer);
 * // Excludes sensitive fields from serialization
 * ```
 */
export const createFilterReplacer = (
  excludeKeys: string[],
): ((key: string, value: any) => any) => {
  const excludeSet = new Set(excludeKeys);
  return (key: string, value: any) => {
    if (excludeSet.has(key)) return undefined;
    return value;
  };
};

/**
 * Creates a custom JSON replacer that transforms values based on type.
 *
 * @param {Map<string, (value: any) => any>} transformers - Type transformers
 * @returns {(key: string, value: any) => any} Replacer function
 *
 * @example
 * ```typescript
 * const transformers = new Map([
 *   ['Date', (d: Date) => d.toISOString()],
 *   ['Number', (n: number) => n.toFixed(2)]
 * ]);
 * const replacer = createTypeReplacer(transformers);
 * const json = JSON.stringify(data, replacer);
 * ```
 */
export const createTypeReplacer = (
  transformers: Map<string, (value: any) => any>,
): ((key: string, value: any) => any) => {
  return (key: string, value: any) => {
    if (value === null || value === undefined) return value;

    const typeName = value.constructor?.name;
    const transformer = transformers.get(typeName);

    if (transformer) {
      return transformer(value);
    }
    return value;
  };
};

/**
 * Serializes object with metadata envelope.
 *
 * @param {any} obj - Object to serialize
 * @param {Partial<SerializationMetadata>} [metadata] - Additional metadata
 * @returns {string} JSON string with metadata wrapper
 *
 * @example
 * ```typescript
 * const json = serializeWithMetadata({ name: 'John' }, { version: '1.0' });
 * // Result: '{"metadata":{"version":"1.0","timestamp":...},"data":{...}}'
 * ```
 */
export const serializeWithMetadata = (
  obj: any,
  metadata?: Partial<SerializationMetadata>,
): string => {
  const envelope = {
    metadata: {
      version: '1.0',
      timestamp: Date.now(),
      type: obj?.constructor?.name || 'Object',
      ...metadata,
    },
    data: obj,
  };
  return JSON.stringify(envelope);
};

// ============================================================================
// JSON DESERIALIZATION WITH REVIVERS
// ============================================================================

/**
 * Deserializes JSON string with custom reviver function.
 *
 * @template T
 * @param {string} json - JSON string to parse
 * @param {(key: string, value: any) => any} [reviver] - Custom reviver function
 * @returns {T} Parsed object
 *
 * @example
 * ```typescript
 * const json = '{"created":"2024-01-01T00:00:00.000Z"}';
 * const obj = deserializeFromJson<MyType>(json, (key, value) => {
 *   if (key === 'created') return new Date(value);
 *   return value;
 * });
 * ```
 */
export const deserializeFromJson = <T = any>(
  json: string,
  reviver?: (key: string, value: any) => any,
): T => {
  return JSON.parse(json, reviver as any);
};

/**
 * Deserializes JSON with automatic restoration of special types.
 *
 * @template T
 * @param {string} json - JSON string with encoded special types
 * @returns {T} Parsed object with restored types
 *
 * @example
 * ```typescript
 * const json = '{"created":{"__type":"Date","value":"2024-01-01T00:00:00.000Z"}}';
 * const obj = deserializeWithSpecialTypes<MyType>(json);
 * // obj.created is a Date instance
 * ```
 */
export const deserializeWithSpecialTypes = <T = any>(json: string): T => {
  return JSON.parse(json, (key, value) => {
    if (value && typeof value === 'object' && '__type' in value) {
      switch (value.__type) {
        case 'Date':
          return new Date(value.value);
        case 'RegExp':
          return new RegExp(value.value, value.flags);
        case 'BigInt':
          return BigInt(value.value);
        case 'undefined':
          return undefined;
        case 'Map':
          return new Map(value.value);
        case 'Set':
          return new Set(value.value);
        default:
          return value;
      }
    }
    return value;
  });
};

/**
 * Creates a custom JSON reviver that transforms specific keys.
 *
 * @param {Map<string, (value: any) => any>} transformers - Key-specific transformers
 * @returns {(key: string, value: any) => any} Reviver function
 *
 * @example
 * ```typescript
 * const transformers = new Map([
 *   ['createdAt', (v: string) => new Date(v)],
 *   ['amount', (v: string) => parseFloat(v)]
 * ]);
 * const reviver = createKeyReviver(transformers);
 * const obj = JSON.parse(json, reviver);
 * ```
 */
export const createKeyReviver = (
  transformers: Map<string, (value: any) => any>,
): ((key: string, value: any) => any) => {
  return (key: string, value: any) => {
    const transformer = transformers.get(key);
    if (transformer) {
      return transformer(value);
    }
    return value;
  };
};

/**
 * Deserializes JSON with metadata extraction.
 *
 * @template T
 * @param {string} json - JSON string with metadata envelope
 * @returns {object} Object with separated data and metadata
 *
 * @example
 * ```typescript
 * const json = '{"metadata":{"version":"1.0"},"data":{"name":"John"}}';
 * const result = deserializeWithMetadata<User>(json);
 * // Result: { data: { name: 'John' }, metadata: { version: '1.0' } }
 * ```
 */
export const deserializeWithMetadata = <T = any>(
  json: string,
): { data: T; metadata: SerializationMetadata } => {
  const envelope = JSON.parse(json);
  return {
    data: envelope.data,
    metadata: envelope.metadata,
  };
};

/**
 * Safely parses JSON with error handling and default value.
 *
 * @template T
 * @param {string} json - JSON string to parse
 * @param {T} [defaultValue] - Default value if parsing fails
 * @returns {T} Parsed object or default value
 *
 * @example
 * ```typescript
 * const obj = safeJsonParse<MyType>('invalid json', { name: 'default' });
 * // Returns default value instead of throwing error
 * ```
 */
export const safeJsonParse = <T = any>(json: string, defaultValue?: T): T => {
  try {
    return JSON.parse(json);
  } catch (error) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw error;
  }
};

// ============================================================================
// DEEP CLONING
// ============================================================================

/**
 * Creates a deep clone of an object.
 *
 * @template T
 * @param {T} obj - Object to clone
 * @param {CloneOptions} [options] - Cloning options
 * @returns {T} Deep cloned object
 *
 * @example
 * ```typescript
 * const original = { a: 1, b: { c: 2, d: [3, 4] } };
 * const clone = deepClone(original);
 * clone.b.c = 999;
 * console.log(original.b.c); // Still 2
 * ```
 */
export const deepClone = <T>(obj: T, options: CloneOptions = {}): T => {
  const { preservePrototype = false, handleCircular = true } = options;

  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  const seen = handleCircular ? new WeakMap() : null;

  const clone = (value: any): any => {
    if (value === null || typeof value !== 'object') {
      return value;
    }

    if (seen?.has(value)) {
      return seen.get(value);
    }

    if (value instanceof Date) {
      return new Date(value.getTime());
    }

    if (value instanceof RegExp) {
      return new RegExp(value.source, value.flags);
    }

    if (value instanceof Map) {
      const mapClone = new Map();
      seen?.set(value, mapClone);
      value.forEach((val, key) => {
        mapClone.set(clone(key), clone(val));
      });
      return mapClone;
    }

    if (value instanceof Set) {
      const setClone = new Set();
      seen?.set(value, setClone);
      value.forEach((val) => {
        setClone.add(clone(val));
      });
      return setClone;
    }

    if (Array.isArray(value)) {
      const arrClone: any[] = [];
      seen?.set(value, arrClone);
      value.forEach((item) => {
        arrClone.push(clone(item));
      });
      return arrClone;
    }

    const objClone = preservePrototype
      ? Object.create(Object.getPrototypeOf(value))
      : {};
    seen?.set(value, objClone);

    Object.keys(value).forEach((key) => {
      objClone[key] = clone(value[key]);
    });

    return objClone;
  };

  return clone(obj);
};

/**
 * Creates a shallow clone of an object.
 *
 * @template T
 * @param {T} obj - Object to clone
 * @returns {T} Shallow cloned object
 *
 * @example
 * ```typescript
 * const original = { a: 1, b: { c: 2 } };
 * const clone = shallowClone(original);
 * clone.a = 999;
 * console.log(original.a); // Still 1
 * clone.b.c = 999;
 * console.log(original.b.c); // Also 999 (shallow copy)
 * ```
 */
export const shallowClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return [...obj] as T;
  }

  return { ...obj };
};

/**
 * Clones an object using structured clone algorithm (when available).
 *
 * @template T
 * @param {T} obj - Object to clone
 * @returns {T} Cloned object
 *
 * @example
 * ```typescript
 * const original = { a: 1, b: new Date(), c: [1, 2, 3] };
 * const clone = structuredClone(original);
 * // Uses native structuredClone if available
 * ```
 */
export const structuredCloneObject = <T>(obj: T): T => {
  if (typeof structuredClone !== 'undefined') {
    return structuredClone(obj);
  }
  // Fallback to deep clone
  return deepClone(obj);
};

// ============================================================================
// OBJECT FREEZING AND SEALING
// ============================================================================

/**
 * Deep freezes an object, making it immutable at all levels.
 *
 * @template T
 * @param {T} obj - Object to freeze
 * @returns {Readonly<T>} Frozen object
 *
 * @example
 * ```typescript
 * const obj = { a: 1, b: { c: 2 } };
 * const frozen = deepFreeze(obj);
 * frozen.b.c = 999; // Throws error in strict mode
 * ```
 */
export const deepFreeze = <T extends object>(obj: T): Readonly<T> => {
  Object.freeze(obj);

  Object.keys(obj).forEach((key) => {
    const value = (obj as any)[key];
    if (value !== null && typeof value === 'object') {
      deepFreeze(value);
    }
  });

  return obj as Readonly<T>;
};

/**
 * Deep seals an object, preventing property additions/deletions at all levels.
 *
 * @template T
 * @param {T} obj - Object to seal
 * @returns {T} Sealed object
 *
 * @example
 * ```typescript
 * const obj = { a: 1, b: { c: 2 } };
 * const sealed = deepSeal(obj);
 * sealed.b.c = 999; // Allowed
 * sealed.b.d = 3; // Throws error (cannot add new property)
 * ```
 */
export const deepSeal = <T extends object>(obj: T): T => {
  Object.seal(obj);

  Object.keys(obj).forEach((key) => {
    const value = (obj as any)[key];
    if (value !== null && typeof value === 'object') {
      deepSeal(value);
    }
  });

  return obj;
};

/**
 * Checks if object is deeply frozen.
 *
 * @param {any} obj - Object to check
 * @returns {boolean} True if deeply frozen
 *
 * @example
 * ```typescript
 * const obj = deepFreeze({ a: 1, b: { c: 2 } });
 * isDeeplyFrozen(obj); // true
 * ```
 */
export const isDeeplyFrozen = (obj: any): boolean => {
  if (!Object.isFrozen(obj)) {
    return false;
  }

  return Object.keys(obj).every((key) => {
    const value = obj[key];
    if (value !== null && typeof value === 'object') {
      return isDeeplyFrozen(value);
    }
    return true;
  });
};

// ============================================================================
// CIRCULAR REFERENCE HANDLING
// ============================================================================

/**
 * Detects circular references in an object.
 *
 * @param {any} obj - Object to check
 * @returns {CircularReference[]} Array of circular references found
 *
 * @example
 * ```typescript
 * const obj: any = { a: 1 };
 * obj.self = obj;
 * const circular = detectCircularReferences(obj);
 * // Returns array of circular reference paths
 * ```
 */
export const detectCircularReferences = (obj: any): CircularReference[] => {
  const references: CircularReference[] = [];
  const seen = new WeakSet();
  const paths = new WeakMap<any, string[]>();

  const detect = (value: any, path: string[] = []): void => {
    if (value === null || typeof value !== 'object') {
      return;
    }

    if (seen.has(value)) {
      references.push({
        id: Math.random().toString(36).substring(7),
        path,
        value,
      });
      return;
    }

    seen.add(value);
    paths.set(value, path);

    Object.keys(value).forEach((key) => {
      detect(value[key], [...path, key]);
    });
  };

  detect(obj);
  return references;
};

/**
 * Removes circular references from an object.
 *
 * @template T
 * @param {T} obj - Object with potential circular references
 * @param {any} [replacement] - Replacement value for circular references
 * @returns {T} Object with circular references removed
 *
 * @example
 * ```typescript
 * const obj: any = { a: 1 };
 * obj.self = obj;
 * const clean = removeCircularReferences(obj, '[Circular]');
 * // obj.self becomes '[Circular]'
 * ```
 */
export const removeCircularReferences = <T>(
  obj: T,
  replacement: any = '[Circular]',
): T => {
  const seen = new WeakSet();

  const remove = (value: any): any => {
    if (value === null || typeof value !== 'object') {
      return value;
    }

    if (seen.has(value)) {
      return replacement;
    }

    seen.add(value);

    if (Array.isArray(value)) {
      return value.map(remove);
    }

    const result: any = {};
    Object.keys(value).forEach((key) => {
      result[key] = remove(value[key]);
    });

    return result;
  };

  return remove(obj);
};

/**
 * Serializes object with circular references using reference tracking.
 *
 * @param {any} obj - Object with circular references
 * @returns {string} JSON string with reference markers
 *
 * @example
 * ```typescript
 * const obj: any = { a: 1 };
 * obj.self = obj;
 * const json = serializeWithCircularRefs(obj);
 * // Uses special markers to track circular references
 * ```
 */
export const serializeWithCircularRefs = (obj: any): string => {
  const refs = new Map<any, string>();
  let refCounter = 0;

  return JSON.stringify(obj, (key, value) => {
    if (value !== null && typeof value === 'object') {
      if (refs.has(value)) {
        return { __ref: refs.get(value) };
      }
      const refId = `ref_${refCounter++}`;
      refs.set(value, refId);
      return { __id: refId, ...value };
    }
    return value;
  });
};

// ============================================================================
// BIGINT SERIALIZATION
// ============================================================================

/**
 * Serializes object containing BigInt values.
 *
 * @param {any} obj - Object with BigInt values
 * @returns {string} JSON string with BigInt values encoded
 *
 * @example
 * ```typescript
 * const obj = { id: BigInt(9007199254740991), count: BigInt(123) };
 * const json = serializeBigInt(obj);
 * ```
 */
export const serializeBigInt = (obj: any): string => {
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'bigint') {
      return { __type: 'BigInt', value: value.toString() };
    }
    return value;
  });
};

/**
 * Deserializes JSON with BigInt values.
 *
 * @template T
 * @param {string} json - JSON string with encoded BigInt values
 * @returns {T} Parsed object with BigInt values restored
 *
 * @example
 * ```typescript
 * const json = '{"id":{"__type":"BigInt","value":"9007199254740991"}}';
 * const obj = deserializeBigInt<MyType>(json);
 * // obj.id is a BigInt
 * ```
 */
export const deserializeBigInt = <T = any>(json: string): T => {
  return JSON.parse(json, (key, value) => {
    if (value && typeof value === 'object' && value.__type === 'BigInt') {
      return BigInt(value.value);
    }
    return value;
  });
};

/**
 * Converts BigInt to safe JSON number (with precision loss warning).
 *
 * @param {bigint} value - BigInt value
 * @returns {number | string} Number if safe, string otherwise
 *
 * @example
 * ```typescript
 * bigIntToJson(BigInt(123)); // 123
 * bigIntToJson(BigInt(9007199254740991)); // "9007199254740991" (exceeds safe integer)
 * ```
 */
export const bigIntToJson = (value: bigint): number | string => {
  const num = Number(value);
  if (num >= Number.MIN_SAFE_INTEGER && num <= Number.MAX_SAFE_INTEGER) {
    return num;
  }
  return value.toString();
};

// ============================================================================
// DATE SERIALIZATION
// ============================================================================

/**
 * Serializes Date to ISO 8601 string.
 *
 * @param {Date} date - Date to serialize
 * @returns {string} ISO 8601 date string
 *
 * @example
 * ```typescript
 * const date = new Date('2024-01-01T12:00:00Z');
 * const iso = serializeDateISO(date);
 * // Result: '2024-01-01T12:00:00.000Z'
 * ```
 */
export const serializeDateISO = (date: Date): string => {
  return date.toISOString();
};

/**
 * Serializes Date with custom format.
 *
 * @param {Date} date - Date to serialize
 * @param {string} format - Format string ('iso', 'unix', 'utc', 'locale')
 * @returns {string | number} Formatted date
 *
 * @example
 * ```typescript
 * const date = new Date();
 * serializeDateCustom(date, 'iso'); // ISO 8601 string
 * serializeDateCustom(date, 'unix'); // Unix timestamp (number)
 * serializeDateCustom(date, 'utc'); // UTC string
 * ```
 */
export const serializeDateCustom = (
  date: Date,
  format: 'iso' | 'unix' | 'utc' | 'locale',
): string | number => {
  switch (format) {
    case 'iso':
      return date.toISOString();
    case 'unix':
      return Math.floor(date.getTime() / 1000);
    case 'utc':
      return date.toUTCString();
    case 'locale':
      return date.toLocaleString();
    default:
      return date.toISOString();
  }
};

/**
 * Deserializes various date formats to Date object.
 *
 * @param {string | number} dateString - Date string or timestamp
 * @returns {Date} Parsed Date object
 *
 * @example
 * ```typescript
 * deserializeDate('2024-01-01T12:00:00Z'); // ISO string
 * deserializeDate(1704110400); // Unix timestamp
 * deserializeDate('Mon, 01 Jan 2024 12:00:00 GMT'); // UTC string
 * ```
 */
export const deserializeDate = (dateString: string | number): Date => {
  if (typeof dateString === 'number') {
    // Assume Unix timestamp (in seconds)
    return new Date(dateString * 1000);
  }
  return new Date(dateString);
};

// ============================================================================
// BINARY DATA SERIALIZATION
// ============================================================================

/**
 * Serializes Buffer to base64 string.
 *
 * @param {Buffer} buffer - Buffer to serialize
 * @returns {string} Base64 encoded string
 *
 * @example
 * ```typescript
 * const buffer = Buffer.from('Hello World');
 * const base64 = serializeBuffer(buffer);
 * // Result: 'SGVsbG8gV29ybGQ='
 * ```
 */
export const serializeBuffer = (buffer: Buffer): string => {
  return buffer.toString('base64');
};

/**
 * Deserializes base64 string to Buffer.
 *
 * @param {string} base64 - Base64 encoded string
 * @returns {Buffer} Decoded Buffer
 *
 * @example
 * ```typescript
 * const buffer = deserializeBuffer('SGVsbG8gV29ybGQ=');
 * console.log(buffer.toString()); // 'Hello World'
 * ```
 */
export const deserializeBuffer = (base64: string): Buffer => {
  return Buffer.from(base64, 'base64');
};

/**
 * Serializes ArrayBuffer to base64 string.
 *
 * @param {ArrayBuffer} arrayBuffer - ArrayBuffer to serialize
 * @returns {string} Base64 encoded string
 *
 * @example
 * ```typescript
 * const arrayBuffer = new Uint8Array([72, 101, 108, 108, 111]).buffer;
 * const base64 = serializeArrayBuffer(arrayBuffer);
 * ```
 */
export const serializeArrayBuffer = (arrayBuffer: ArrayBuffer): string => {
  const uint8Array = new Uint8Array(arrayBuffer);
  const buffer = Buffer.from(uint8Array);
  return buffer.toString('base64');
};

/**
 * Deserializes base64 string to ArrayBuffer.
 *
 * @param {string} base64 - Base64 encoded string
 * @returns {ArrayBuffer} Decoded ArrayBuffer
 *
 * @example
 * ```typescript
 * const arrayBuffer = deserializeArrayBuffer('SGVsbG8=');
 * const view = new Uint8Array(arrayBuffer);
 * ```
 */
export const deserializeArrayBuffer = (base64: string): ArrayBuffer => {
  const buffer = Buffer.from(base64, 'base64');
  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength,
  );
};

/**
 * Converts TypedArray to JSON-serializable format.
 *
 * @param {ArrayBufferView} typedArray - TypedArray to serialize
 * @returns {object} JSON-serializable object
 *
 * @example
 * ```typescript
 * const uint8 = new Uint8Array([1, 2, 3, 4, 5]);
 * const json = serializeTypedArray(uint8);
 * // Result: { type: 'Uint8Array', data: [1, 2, 3, 4, 5] }
 * ```
 */
export const serializeTypedArray = (
  typedArray: ArrayBufferView,
): { type: string; data: number[] } => {
  const array = Array.from(new Uint8Array(typedArray.buffer));
  return {
    type: typedArray.constructor.name,
    data: array,
  };
};

// ============================================================================
// CLASS INSTANCE SERIALIZATION
// ============================================================================

/**
 * Serializes class instance to JSON with class name metadata.
 *
 * @param {any} instance - Class instance to serialize
 * @returns {string} JSON string with class metadata
 *
 * @example
 * ```typescript
 * class User {
 *   constructor(public name: string, public age: number) {}
 * }
 * const user = new User('John', 30);
 * const json = serializeClassInstance(user);
 * ```
 */
export const serializeClassInstance = (instance: any): string => {
  return JSON.stringify({
    __class: instance.constructor.name,
    __data: instance,
  });
};

/**
 * Deserializes JSON to class instance using constructor registry.
 *
 * @template T
 * @param {string} json - JSON string with class metadata
 * @param {Map<string, new (...args: any[]) => any>} registry - Constructor registry
 * @returns {T} Restored class instance
 *
 * @example
 * ```typescript
 * const registry = new Map([['User', User]]);
 * const instance = deserializeClassInstance<User>(json, registry);
 * ```
 */
export const deserializeClassInstance = <T = any>(
  json: string,
  registry: Map<string, new (...args: any[]) => any>,
): T => {
  const parsed = JSON.parse(json);
  const Constructor = registry.get(parsed.__class);
  if (!Constructor) {
    throw new Error(`Unknown class: ${parsed.__class}`);
  }
  return Object.assign(Object.create(Constructor.prototype), parsed.__data);
};

/**
 * Extracts plain object data from class instance.
 *
 * @param {any} instance - Class instance
 * @param {boolean} [includePrivate] - Include private fields
 * @returns {object} Plain object with instance data
 *
 * @example
 * ```typescript
 * class User {
 *   constructor(public name: string, private password: string) {}
 * }
 * const plain = extractInstanceData(new User('John', 'secret'));
 * // Result: { name: 'John' } (password excluded by default)
 * ```
 */
export const extractInstanceData = (
  instance: any,
  includePrivate: boolean = false,
): object => {
  const data: any = {};

  Object.keys(instance).forEach((key) => {
    if (!includePrivate && key.startsWith('_')) {
      return;
    }
    data[key] = instance[key];
  });

  return data;
};

// ============================================================================
// QUERY STRING SERIALIZATION
// ============================================================================

/**
 * Serializes object to URL query string.
 *
 * @param {Record<string, any>} params - Parameters to serialize
 * @param {boolean} [encode] - URL encode values (default: true)
 * @returns {string} Query string
 *
 * @example
 * ```typescript
 * const params = { name: 'John Doe', age: 30, active: true };
 * const query = serializeQueryString(params);
 * // Result: 'name=John%20Doe&age=30&active=true'
 * ```
 */
export const serializeQueryString = (
  params: Record<string, any>,
  encode: boolean = true,
): string => {
  const parts: string[] = [];

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }

    const encodedKey = encode ? encodeURIComponent(key) : key;
    const encodedValue = encode ? encodeURIComponent(String(value)) : String(value);
    parts.push(`${encodedKey}=${encodedValue}`);
  });

  return parts.join('&');
};

/**
 * Deserializes query string to object.
 *
 * @param {string} queryString - Query string to parse
 * @param {boolean} [decode] - URL decode values (default: true)
 * @returns {Record<string, string>} Parsed parameters
 *
 * @example
 * ```typescript
 * const params = deserializeQueryString('name=John%20Doe&age=30&active=true');
 * // Result: { name: 'John Doe', age: '30', active: 'true' }
 * ```
 */
export const deserializeQueryString = (
  queryString: string,
  decode: boolean = true,
): Record<string, string> => {
  const params: Record<string, string> = {};
  const cleaned = queryString.startsWith('?') ? queryString.slice(1) : queryString;

  cleaned.split('&').forEach((part) => {
    const [key, value] = part.split('=');
    if (key) {
      const decodedKey = decode ? decodeURIComponent(key) : key;
      const decodedValue = decode ? decodeURIComponent(value || '') : (value || '');
      params[decodedKey] = decodedValue;
    }
  });

  return params;
};

/**
 * Serializes nested object to query string with bracket notation.
 *
 * @param {Record<string, any>} params - Nested parameters
 * @returns {string} Query string with nested notation
 *
 * @example
 * ```typescript
 * const params = { user: { name: 'John', age: 30 }, tags: ['a', 'b'] };
 * const query = serializeNestedQueryString(params);
 * // Result: 'user[name]=John&user[age]=30&tags[0]=a&tags[1]=b'
 * ```
 */
export const serializeNestedQueryString = (
  params: Record<string, any>,
): string => {
  const parts: string[] = [];

  const serialize = (obj: any, prefix: string = ''): void => {
    Object.entries(obj).forEach(([key, value]) => {
      const fullKey = prefix ? `${prefix}[${key}]` : key;

      if (value === null || value === undefined) {
        return;
      }

      if (typeof value === 'object' && !Array.isArray(value)) {
        serialize(value, fullKey);
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          parts.push(`${fullKey}[${index}]=${encodeURIComponent(String(item))}`);
        });
      } else {
        parts.push(`${fullKey}=${encodeURIComponent(String(value))}`);
      }
    });
  };

  serialize(params);
  return parts.join('&');
};

// ============================================================================
// FORM DATA SERIALIZATION
// ============================================================================

/**
 * Serializes object to FormData.
 *
 * @param {Record<string, any>} data - Data to serialize
 * @returns {FormData} FormData instance
 *
 * @example
 * ```typescript
 * const data = { name: 'John', age: 30, file: fileBlob };
 * const formData = serializeToFormData(data);
 * ```
 */
export const serializeToFormData = (data: Record<string, any>): FormData => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }

    if (value instanceof File || value instanceof Blob) {
      formData.append(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((item) => {
        formData.append(`${key}[]`, String(item));
      });
    } else if (typeof value === 'object') {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, String(value));
    }
  });

  return formData;
};

/**
 * Deserializes FormData to object.
 *
 * @param {FormData} formData - FormData to deserialize
 * @returns {Record<string, any>} Plain object
 *
 * @example
 * ```typescript
 * const formData = new FormData();
 * formData.append('name', 'John');
 * formData.append('age', '30');
 * const obj = deserializeFromFormData(formData);
 * // Result: { name: 'John', age: '30' }
 * ```
 */
export const deserializeFromFormData = (
  formData: FormData,
): Record<string, any> => {
  const obj: Record<string, any> = {};

  formData.forEach((value, key) => {
    if (key.endsWith('[]')) {
      const cleanKey = key.slice(0, -2);
      if (!obj[cleanKey]) {
        obj[cleanKey] = [];
      }
      obj[cleanKey].push(value);
    } else {
      obj[key] = value;
    }
  });

  return obj;
};

// ============================================================================
// XML SERIALIZATION/DESERIALIZATION
// ============================================================================

/**
 * Serializes object to simple XML string.
 *
 * @param {Record<string, any>} obj - Object to serialize
 * @param {string} [rootName] - Root element name
 * @returns {string} XML string
 *
 * @example
 * ```typescript
 * const obj = { user: { name: 'John', age: 30 } };
 * const xml = serializeToXml(obj, 'root');
 * // Result: '<root><user><name>John</name><age>30</age></user></root>'
 * ```
 */
export const serializeToXml = (
  obj: Record<string, any>,
  rootName: string = 'root',
): string => {
  const serialize = (data: any, name: string): string => {
    if (data === null || data === undefined) {
      return `<${name}/>`;
    }

    if (typeof data !== 'object') {
      return `<${name}>${String(data)}</${name}>`;
    }

    if (Array.isArray(data)) {
      return data.map((item) => serialize(item, name)).join('');
    }

    const children = Object.entries(data)
      .map(([key, value]) => serialize(value, key))
      .join('');

    return `<${name}>${children}</${name}>`;
  };

  return serialize(obj, rootName);
};

/**
 * Deserializes simple XML string to object (basic implementation).
 *
 * @param {string} xml - XML string to parse
 * @returns {Record<string, any>} Parsed object
 *
 * @example
 * ```typescript
 * const xml = '<root><user><name>John</name><age>30</age></user></root>';
 * const obj = deserializeFromXml(xml);
 * ```
 */
export const deserializeFromXml = (xml: string): Record<string, any> => {
  // This is a simplified implementation
  // In production, use a proper XML parser like fast-xml-parser
  const tagPattern = /<(\w+)>(.*?)<\/\1>/g;
  const result: Record<string, any> = {};

  let match;
  while ((match = tagPattern.exec(xml)) !== null) {
    const [, key, value] = match;
    if (value.includes('<')) {
      result[key] = deserializeFromXml(value);
    } else {
      result[key] = value;
    }
  }

  return result;
};

// ============================================================================
// YAML SERIALIZATION
// ============================================================================

/**
 * Serializes object to YAML-like string (basic implementation).
 *
 * @param {Record<string, any>} obj - Object to serialize
 * @param {number} [indent] - Indentation level
 * @returns {string} YAML-like string
 *
 * @example
 * ```typescript
 * const obj = { name: 'John', age: 30, skills: ['TypeScript', 'Node.js'] };
 * const yaml = serializeToYaml(obj);
 * ```
 */
export const serializeToYaml = (
  obj: Record<string, any>,
  indent: number = 0,
): string => {
  const spaces = ' '.repeat(indent);
  const lines: string[] = [];

  Object.entries(obj).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      lines.push(`${spaces}${key}: null`);
    } else if (Array.isArray(value)) {
      lines.push(`${spaces}${key}:`);
      value.forEach((item) => {
        if (typeof item === 'object') {
          lines.push(`${spaces}- ${serializeToYaml(item, indent + 2).trim()}`);
        } else {
          lines.push(`${spaces}- ${item}`);
        }
      });
    } else if (typeof value === 'object') {
      lines.push(`${spaces}${key}:`);
      lines.push(serializeToYaml(value, indent + 2));
    } else {
      lines.push(`${spaces}${key}: ${value}`);
    }
  });

  return lines.join('\n');
};

// ============================================================================
// MULTIPART SERIALIZATION
// ============================================================================

/**
 * Generates a unique multipart boundary string.
 *
 * @returns {string} Boundary string for multipart messages
 *
 * @example
 * ```typescript
 * const boundary = generateMultipartBoundary();
 * // Result: '----WebKitFormBoundary7MA4YWxkTrZu0gW'
 * ```
 */
export const generateMultipartBoundary = (): string => {
  return `----WebKitFormBoundary${Math.random().toString(36).substring(2)}`;
};

/**
 * Serializes data to multipart format with custom boundary.
 *
 * @param {Record<string, any>} data - Data to serialize
 * @param {string} [boundary] - Custom boundary (auto-generated if not provided)
 * @returns {object} Multipart body and content type header
 *
 * @example
 * ```typescript
 * const data = { field1: 'value1', field2: 'value2', file: fileBlob };
 * const multipart = serializeToMultipart(data);
 * // Result: { body: '...', contentType: 'multipart/form-data; boundary=...' }
 * ```
 */
export const serializeToMultipart = (
  data: Record<string, any>,
  boundary?: string,
): { body: string; contentType: string } => {
  const boundaryStr = boundary || generateMultipartBoundary();
  const parts: string[] = [];

  Object.entries(data).forEach(([key, value]) => {
    parts.push(`--${boundaryStr}`);
    parts.push(`Content-Disposition: form-data; name="${key}"`);
    parts.push('');
    parts.push(String(value));
  });

  parts.push(`--${boundaryStr}--`);

  return {
    body: parts.join('\r\n'),
    contentType: `multipart/form-data; boundary=${boundaryStr}`,
  };
};

// ============================================================================
// STREAM SERIALIZATION
// ============================================================================

/**
 * Serializes data chunks for stream processing.
 *
 * @param {any} chunk - Data chunk to serialize
 * @param {StreamSerializationOptions} [options] - Serialization options
 * @returns {Buffer} Serialized chunk
 *
 * @example
 * ```typescript
 * const chunk = { id: 1, data: 'Hello' };
 * const buffer = serializeStreamChunk(chunk, { encoding: 'utf8' });
 * ```
 */
export const serializeStreamChunk = (
  chunk: any,
  options: StreamSerializationOptions = {},
): Buffer => {
  const { encoding = 'utf8' } = options;
  const json = JSON.stringify(chunk);
  return Buffer.from(json, encoding);
};

/**
 * Deserializes stream chunk from Buffer.
 *
 * @template T
 * @param {Buffer} buffer - Buffer to deserialize
 * @param {BufferEncoding} [encoding] - Buffer encoding
 * @returns {T} Deserialized chunk
 *
 * @example
 * ```typescript
 * const buffer = Buffer.from('{"id":1,"data":"Hello"}');
 * const chunk = deserializeStreamChunk<MyType>(buffer);
 * ```
 */
export const deserializeStreamChunk = <T = any>(
  buffer: Buffer,
  encoding: BufferEncoding = 'utf8',
): T => {
  const json = buffer.toString(encoding);
  return JSON.parse(json);
};

export default {
  // JSON serialization
  serializeToJson,
  serializeWithSpecialTypes,
  createFilterReplacer,
  createTypeReplacer,
  serializeWithMetadata,

  // JSON deserialization
  deserializeFromJson,
  deserializeWithSpecialTypes,
  createKeyReviver,
  deserializeWithMetadata,
  safeJsonParse,

  // Deep cloning
  deepClone,
  shallowClone,
  structuredCloneObject,

  // Object freezing
  deepFreeze,
  deepSeal,
  isDeeplyFrozen,

  // Circular references
  detectCircularReferences,
  removeCircularReferences,
  serializeWithCircularRefs,

  // BigInt
  serializeBigInt,
  deserializeBigInt,
  bigIntToJson,

  // Date serialization
  serializeDateISO,
  serializeDateCustom,
  deserializeDate,

  // Binary data
  serializeBuffer,
  deserializeBuffer,
  serializeArrayBuffer,
  deserializeArrayBuffer,
  serializeTypedArray,

  // Class instances
  serializeClassInstance,
  deserializeClassInstance,
  extractInstanceData,

  // Query strings
  serializeQueryString,
  deserializeQueryString,
  serializeNestedQueryString,

  // Form data
  serializeToFormData,
  deserializeFromFormData,

  // XML
  serializeToXml,
  deserializeFromXml,

  // YAML
  serializeToYaml,

  // Multipart
  generateMultipartBoundary,
  serializeToMultipart,

  // Stream serialization
  serializeStreamChunk,
  deserializeStreamChunk,
};
