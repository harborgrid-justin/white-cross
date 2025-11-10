"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserializeStreamChunk = exports.serializeStreamChunk = exports.serializeToMultipart = exports.generateMultipartBoundary = exports.serializeToYaml = exports.deserializeFromXml = exports.serializeToXml = exports.deserializeFromFormData = exports.serializeToFormData = exports.serializeNestedQueryString = exports.deserializeQueryString = exports.serializeQueryString = exports.extractInstanceData = exports.deserializeClassInstance = exports.serializeClassInstance = exports.serializeTypedArray = exports.deserializeArrayBuffer = exports.serializeArrayBuffer = exports.deserializeBuffer = exports.serializeBuffer = exports.deserializeDate = exports.serializeDateCustom = exports.serializeDateISO = exports.bigIntToJson = exports.deserializeBigInt = exports.serializeBigInt = exports.serializeWithCircularRefs = exports.removeCircularReferences = exports.detectCircularReferences = exports.isDeeplyFrozen = exports.deepSeal = exports.deepFreeze = exports.structuredCloneObject = exports.shallowClone = exports.deepClone = exports.safeJsonParse = exports.deserializeWithMetadata = exports.createKeyReviver = exports.deserializeWithSpecialTypes = exports.deserializeFromJson = exports.serializeWithMetadata = exports.createTypeReplacer = exports.createFilterReplacer = exports.serializeWithSpecialTypes = exports.serializeToJson = void 0;
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
const serializeToJson = (obj, replacer, space) => {
    return JSON.stringify(obj, replacer, space);
};
exports.serializeToJson = serializeToJson;
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
const serializeWithSpecialTypes = (obj, space) => {
    return JSON.stringify(obj, (key, value) => {
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
    }, space);
};
exports.serializeWithSpecialTypes = serializeWithSpecialTypes;
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
const createFilterReplacer = (excludeKeys) => {
    const excludeSet = new Set(excludeKeys);
    return (key, value) => {
        if (excludeSet.has(key))
            return undefined;
        return value;
    };
};
exports.createFilterReplacer = createFilterReplacer;
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
const createTypeReplacer = (transformers) => {
    return (key, value) => {
        if (value === null || value === undefined)
            return value;
        const typeName = value.constructor?.name;
        const transformer = transformers.get(typeName);
        if (transformer) {
            return transformer(value);
        }
        return value;
    };
};
exports.createTypeReplacer = createTypeReplacer;
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
const serializeWithMetadata = (obj, metadata) => {
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
exports.serializeWithMetadata = serializeWithMetadata;
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
const deserializeFromJson = (json, reviver) => {
    return JSON.parse(json, reviver);
};
exports.deserializeFromJson = deserializeFromJson;
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
const deserializeWithSpecialTypes = (json) => {
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
exports.deserializeWithSpecialTypes = deserializeWithSpecialTypes;
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
const createKeyReviver = (transformers) => {
    return (key, value) => {
        const transformer = transformers.get(key);
        if (transformer) {
            return transformer(value);
        }
        return value;
    };
};
exports.createKeyReviver = createKeyReviver;
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
const deserializeWithMetadata = (json) => {
    const envelope = JSON.parse(json);
    return {
        data: envelope.data,
        metadata: envelope.metadata,
    };
};
exports.deserializeWithMetadata = deserializeWithMetadata;
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
const safeJsonParse = (json, defaultValue) => {
    try {
        return JSON.parse(json);
    }
    catch (error) {
        if (defaultValue !== undefined) {
            return defaultValue;
        }
        throw error;
    }
};
exports.safeJsonParse = safeJsonParse;
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
const deepClone = (obj, options = {}) => {
    const { preservePrototype = false, handleCircular = true } = options;
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    const seen = handleCircular ? new WeakMap() : null;
    const clone = (value) => {
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
            const arrClone = [];
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
exports.deepClone = deepClone;
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
const shallowClone = (obj) => {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    if (Array.isArray(obj)) {
        return [...obj];
    }
    return { ...obj };
};
exports.shallowClone = shallowClone;
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
const structuredCloneObject = (obj) => {
    if (typeof structuredClone !== 'undefined') {
        return structuredClone(obj);
    }
    // Fallback to deep clone
    return (0, exports.deepClone)(obj);
};
exports.structuredCloneObject = structuredCloneObject;
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
const deepFreeze = (obj) => {
    Object.freeze(obj);
    Object.keys(obj).forEach((key) => {
        const value = obj[key];
        if (value !== null && typeof value === 'object') {
            (0, exports.deepFreeze)(value);
        }
    });
    return obj;
};
exports.deepFreeze = deepFreeze;
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
const deepSeal = (obj) => {
    Object.seal(obj);
    Object.keys(obj).forEach((key) => {
        const value = obj[key];
        if (value !== null && typeof value === 'object') {
            (0, exports.deepSeal)(value);
        }
    });
    return obj;
};
exports.deepSeal = deepSeal;
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
const isDeeplyFrozen = (obj) => {
    if (!Object.isFrozen(obj)) {
        return false;
    }
    return Object.keys(obj).every((key) => {
        const value = obj[key];
        if (value !== null && typeof value === 'object') {
            return (0, exports.isDeeplyFrozen)(value);
        }
        return true;
    });
};
exports.isDeeplyFrozen = isDeeplyFrozen;
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
const detectCircularReferences = (obj) => {
    const references = [];
    const seen = new WeakSet();
    const paths = new WeakMap();
    const detect = (value, path = []) => {
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
exports.detectCircularReferences = detectCircularReferences;
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
const removeCircularReferences = (obj, replacement = '[Circular]') => {
    const seen = new WeakSet();
    const remove = (value) => {
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
        const result = {};
        Object.keys(value).forEach((key) => {
            result[key] = remove(value[key]);
        });
        return result;
    };
    return remove(obj);
};
exports.removeCircularReferences = removeCircularReferences;
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
const serializeWithCircularRefs = (obj) => {
    const refs = new Map();
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
exports.serializeWithCircularRefs = serializeWithCircularRefs;
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
const serializeBigInt = (obj) => {
    return JSON.stringify(obj, (key, value) => {
        if (typeof value === 'bigint') {
            return { __type: 'BigInt', value: value.toString() };
        }
        return value;
    });
};
exports.serializeBigInt = serializeBigInt;
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
const deserializeBigInt = (json) => {
    return JSON.parse(json, (key, value) => {
        if (value && typeof value === 'object' && value.__type === 'BigInt') {
            return BigInt(value.value);
        }
        return value;
    });
};
exports.deserializeBigInt = deserializeBigInt;
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
const bigIntToJson = (value) => {
    const num = Number(value);
    if (num >= Number.MIN_SAFE_INTEGER && num <= Number.MAX_SAFE_INTEGER) {
        return num;
    }
    return value.toString();
};
exports.bigIntToJson = bigIntToJson;
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
const serializeDateISO = (date) => {
    return date.toISOString();
};
exports.serializeDateISO = serializeDateISO;
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
const serializeDateCustom = (date, format) => {
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
exports.serializeDateCustom = serializeDateCustom;
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
const deserializeDate = (dateString) => {
    if (typeof dateString === 'number') {
        // Assume Unix timestamp (in seconds)
        return new Date(dateString * 1000);
    }
    return new Date(dateString);
};
exports.deserializeDate = deserializeDate;
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
const serializeBuffer = (buffer) => {
    return buffer.toString('base64');
};
exports.serializeBuffer = serializeBuffer;
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
const deserializeBuffer = (base64) => {
    return Buffer.from(base64, 'base64');
};
exports.deserializeBuffer = deserializeBuffer;
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
const serializeArrayBuffer = (arrayBuffer) => {
    const uint8Array = new Uint8Array(arrayBuffer);
    const buffer = Buffer.from(uint8Array);
    return buffer.toString('base64');
};
exports.serializeArrayBuffer = serializeArrayBuffer;
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
const deserializeArrayBuffer = (base64) => {
    const buffer = Buffer.from(base64, 'base64');
    return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
};
exports.deserializeArrayBuffer = deserializeArrayBuffer;
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
const serializeTypedArray = (typedArray) => {
    const array = Array.from(new Uint8Array(typedArray.buffer));
    return {
        type: typedArray.constructor.name,
        data: array,
    };
};
exports.serializeTypedArray = serializeTypedArray;
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
const serializeClassInstance = (instance) => {
    return JSON.stringify({
        __class: instance.constructor.name,
        __data: instance,
    });
};
exports.serializeClassInstance = serializeClassInstance;
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
const deserializeClassInstance = (json, registry) => {
    const parsed = JSON.parse(json);
    const Constructor = registry.get(parsed.__class);
    if (!Constructor) {
        throw new Error(`Unknown class: ${parsed.__class}`);
    }
    return Object.assign(Object.create(Constructor.prototype), parsed.__data);
};
exports.deserializeClassInstance = deserializeClassInstance;
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
const extractInstanceData = (instance, includePrivate = false) => {
    const data = {};
    Object.keys(instance).forEach((key) => {
        if (!includePrivate && key.startsWith('_')) {
            return;
        }
        data[key] = instance[key];
    });
    return data;
};
exports.extractInstanceData = extractInstanceData;
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
const serializeQueryString = (params, encode = true) => {
    const parts = [];
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
exports.serializeQueryString = serializeQueryString;
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
const deserializeQueryString = (queryString, decode = true) => {
    const params = {};
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
exports.deserializeQueryString = deserializeQueryString;
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
const serializeNestedQueryString = (params) => {
    const parts = [];
    const serialize = (obj, prefix = '') => {
        Object.entries(obj).forEach(([key, value]) => {
            const fullKey = prefix ? `${prefix}[${key}]` : key;
            if (value === null || value === undefined) {
                return;
            }
            if (typeof value === 'object' && !Array.isArray(value)) {
                serialize(value, fullKey);
            }
            else if (Array.isArray(value)) {
                value.forEach((item, index) => {
                    parts.push(`${fullKey}[${index}]=${encodeURIComponent(String(item))}`);
                });
            }
            else {
                parts.push(`${fullKey}=${encodeURIComponent(String(value))}`);
            }
        });
    };
    serialize(params);
    return parts.join('&');
};
exports.serializeNestedQueryString = serializeNestedQueryString;
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
const serializeToFormData = (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        if (value === undefined || value === null) {
            return;
        }
        if (value instanceof File || value instanceof Blob) {
            formData.append(key, value);
        }
        else if (Array.isArray(value)) {
            value.forEach((item) => {
                formData.append(`${key}[]`, String(item));
            });
        }
        else if (typeof value === 'object') {
            formData.append(key, JSON.stringify(value));
        }
        else {
            formData.append(key, String(value));
        }
    });
    return formData;
};
exports.serializeToFormData = serializeToFormData;
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
const deserializeFromFormData = (formData) => {
    const obj = {};
    formData.forEach((value, key) => {
        if (key.endsWith('[]')) {
            const cleanKey = key.slice(0, -2);
            if (!obj[cleanKey]) {
                obj[cleanKey] = [];
            }
            obj[cleanKey].push(value);
        }
        else {
            obj[key] = value;
        }
    });
    return obj;
};
exports.deserializeFromFormData = deserializeFromFormData;
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
const serializeToXml = (obj, rootName = 'root') => {
    const serialize = (data, name) => {
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
exports.serializeToXml = serializeToXml;
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
const deserializeFromXml = (xml) => {
    // This is a simplified implementation
    // In production, use a proper XML parser like fast-xml-parser
    const tagPattern = /<(\w+)>(.*?)<\/\1>/g;
    const result = {};
    let match;
    while ((match = tagPattern.exec(xml)) !== null) {
        const [, key, value] = match;
        if (value.includes('<')) {
            result[key] = (0, exports.deserializeFromXml)(value);
        }
        else {
            result[key] = value;
        }
    }
    return result;
};
exports.deserializeFromXml = deserializeFromXml;
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
const serializeToYaml = (obj, indent = 0) => {
    const spaces = ' '.repeat(indent);
    const lines = [];
    Object.entries(obj).forEach(([key, value]) => {
        if (value === null || value === undefined) {
            lines.push(`${spaces}${key}: null`);
        }
        else if (Array.isArray(value)) {
            lines.push(`${spaces}${key}:`);
            value.forEach((item) => {
                if (typeof item === 'object') {
                    lines.push(`${spaces}- ${(0, exports.serializeToYaml)(item, indent + 2).trim()}`);
                }
                else {
                    lines.push(`${spaces}- ${item}`);
                }
            });
        }
        else if (typeof value === 'object') {
            lines.push(`${spaces}${key}:`);
            lines.push((0, exports.serializeToYaml)(value, indent + 2));
        }
        else {
            lines.push(`${spaces}${key}: ${value}`);
        }
    });
    return lines.join('\n');
};
exports.serializeToYaml = serializeToYaml;
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
const generateMultipartBoundary = () => {
    return `----WebKitFormBoundary${Math.random().toString(36).substring(2)}`;
};
exports.generateMultipartBoundary = generateMultipartBoundary;
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
const serializeToMultipart = (data, boundary) => {
    const boundaryStr = boundary || (0, exports.generateMultipartBoundary)();
    const parts = [];
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
exports.serializeToMultipart = serializeToMultipart;
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
const serializeStreamChunk = (chunk, options = {}) => {
    const { encoding = 'utf8' } = options;
    const json = JSON.stringify(chunk);
    return Buffer.from(json, encoding);
};
exports.serializeStreamChunk = serializeStreamChunk;
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
const deserializeStreamChunk = (buffer, encoding = 'utf8') => {
    const json = buffer.toString(encoding);
    return JSON.parse(json);
};
exports.deserializeStreamChunk = deserializeStreamChunk;
exports.default = {
    // JSON serialization
    serializeToJson: exports.serializeToJson,
    serializeWithSpecialTypes: exports.serializeWithSpecialTypes,
    createFilterReplacer: exports.createFilterReplacer,
    createTypeReplacer: exports.createTypeReplacer,
    serializeWithMetadata: exports.serializeWithMetadata,
    // JSON deserialization
    deserializeFromJson: exports.deserializeFromJson,
    deserializeWithSpecialTypes: exports.deserializeWithSpecialTypes,
    createKeyReviver: exports.createKeyReviver,
    deserializeWithMetadata: exports.deserializeWithMetadata,
    safeJsonParse: exports.safeJsonParse,
    // Deep cloning
    deepClone: exports.deepClone,
    shallowClone: exports.shallowClone,
    structuredCloneObject: exports.structuredCloneObject,
    // Object freezing
    deepFreeze: exports.deepFreeze,
    deepSeal: exports.deepSeal,
    isDeeplyFrozen: exports.isDeeplyFrozen,
    // Circular references
    detectCircularReferences: exports.detectCircularReferences,
    removeCircularReferences: exports.removeCircularReferences,
    serializeWithCircularRefs: exports.serializeWithCircularRefs,
    // BigInt
    serializeBigInt: exports.serializeBigInt,
    deserializeBigInt: exports.deserializeBigInt,
    bigIntToJson: exports.bigIntToJson,
    // Date serialization
    serializeDateISO: exports.serializeDateISO,
    serializeDateCustom: exports.serializeDateCustom,
    deserializeDate: exports.deserializeDate,
    // Binary data
    serializeBuffer: exports.serializeBuffer,
    deserializeBuffer: exports.deserializeBuffer,
    serializeArrayBuffer: exports.serializeArrayBuffer,
    deserializeArrayBuffer: exports.deserializeArrayBuffer,
    serializeTypedArray: exports.serializeTypedArray,
    // Class instances
    serializeClassInstance: exports.serializeClassInstance,
    deserializeClassInstance: exports.deserializeClassInstance,
    extractInstanceData: exports.extractInstanceData,
    // Query strings
    serializeQueryString: exports.serializeQueryString,
    deserializeQueryString: exports.deserializeQueryString,
    serializeNestedQueryString: exports.serializeNestedQueryString,
    // Form data
    serializeToFormData: exports.serializeToFormData,
    deserializeFromFormData: exports.deserializeFromFormData,
    // XML
    serializeToXml: exports.serializeToXml,
    deserializeFromXml: exports.deserializeFromXml,
    // YAML
    serializeToYaml: exports.serializeToYaml,
    // Multipart
    generateMultipartBoundary: exports.generateMultipartBoundary,
    serializeToMultipart: exports.serializeToMultipart,
    // Stream serialization
    serializeStreamChunk: exports.serializeStreamChunk,
    deserializeStreamChunk: exports.deserializeStreamChunk,
};
//# sourceMappingURL=serialization-utils.js.map