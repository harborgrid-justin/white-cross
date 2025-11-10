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
export declare const serializeToJson: (obj: any, replacer?: (key: string, value: any) => any, space?: number | string) => string;
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
export declare const serializeWithSpecialTypes: (obj: any, space?: number | string) => string;
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
export declare const createFilterReplacer: (excludeKeys: string[]) => ((key: string, value: any) => any);
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
export declare const createTypeReplacer: (transformers: Map<string, (value: any) => any>) => ((key: string, value: any) => any);
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
export declare const serializeWithMetadata: (obj: any, metadata?: Partial<SerializationMetadata>) => string;
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
export declare const deserializeFromJson: <T = any>(json: string, reviver?: (key: string, value: any) => any) => T;
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
export declare const deserializeWithSpecialTypes: <T = any>(json: string) => T;
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
export declare const createKeyReviver: (transformers: Map<string, (value: any) => any>) => ((key: string, value: any) => any);
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
export declare const deserializeWithMetadata: <T = any>(json: string) => {
    data: T;
    metadata: SerializationMetadata;
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
export declare const safeJsonParse: <T = any>(json: string, defaultValue?: T) => T;
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
export declare const deepClone: <T>(obj: T, options?: CloneOptions) => T;
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
export declare const shallowClone: <T>(obj: T) => T;
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
export declare const structuredCloneObject: <T>(obj: T) => T;
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
export declare const deepFreeze: <T extends object>(obj: T) => Readonly<T>;
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
export declare const deepSeal: <T extends object>(obj: T) => T;
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
export declare const isDeeplyFrozen: (obj: any) => boolean;
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
export declare const detectCircularReferences: (obj: any) => CircularReference[];
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
export declare const removeCircularReferences: <T>(obj: T, replacement?: any) => T;
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
export declare const serializeWithCircularRefs: (obj: any) => string;
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
export declare const serializeBigInt: (obj: any) => string;
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
export declare const deserializeBigInt: <T = any>(json: string) => T;
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
export declare const bigIntToJson: (value: bigint) => number | string;
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
export declare const serializeDateISO: (date: Date) => string;
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
export declare const serializeDateCustom: (date: Date, format: "iso" | "unix" | "utc" | "locale") => string | number;
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
export declare const deserializeDate: (dateString: string | number) => Date;
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
export declare const serializeBuffer: (buffer: Buffer) => string;
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
export declare const deserializeBuffer: (base64: string) => Buffer;
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
export declare const serializeArrayBuffer: (arrayBuffer: ArrayBuffer) => string;
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
export declare const deserializeArrayBuffer: (base64: string) => ArrayBuffer;
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
export declare const serializeTypedArray: (typedArray: ArrayBufferView) => {
    type: string;
    data: number[];
};
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
export declare const serializeClassInstance: (instance: any) => string;
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
export declare const deserializeClassInstance: <T = any>(json: string, registry: Map<string, new (...args: any[]) => any>) => T;
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
export declare const extractInstanceData: (instance: any, includePrivate?: boolean) => object;
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
export declare const serializeQueryString: (params: Record<string, any>, encode?: boolean) => string;
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
export declare const deserializeQueryString: (queryString: string, decode?: boolean) => Record<string, string>;
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
export declare const serializeNestedQueryString: (params: Record<string, any>) => string;
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
export declare const serializeToFormData: (data: Record<string, any>) => FormData;
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
export declare const deserializeFromFormData: (formData: FormData) => Record<string, any>;
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
export declare const serializeToXml: (obj: Record<string, any>, rootName?: string) => string;
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
export declare const deserializeFromXml: (xml: string) => Record<string, any>;
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
export declare const serializeToYaml: (obj: Record<string, any>, indent?: number) => string;
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
export declare const generateMultipartBoundary: () => string;
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
export declare const serializeToMultipart: (data: Record<string, any>, boundary?: string) => {
    body: string;
    contentType: string;
};
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
export declare const serializeStreamChunk: (chunk: any, options?: StreamSerializationOptions) => Buffer;
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
export declare const deserializeStreamChunk: <T = any>(buffer: Buffer, encoding?: BufferEncoding) => T;
declare const _default: {
    serializeToJson: (obj: any, replacer?: (key: string, value: any) => any, space?: number | string) => string;
    serializeWithSpecialTypes: (obj: any, space?: number | string) => string;
    createFilterReplacer: (excludeKeys: string[]) => ((key: string, value: any) => any);
    createTypeReplacer: (transformers: Map<string, (value: any) => any>) => ((key: string, value: any) => any);
    serializeWithMetadata: (obj: any, metadata?: Partial<SerializationMetadata>) => string;
    deserializeFromJson: <T = any>(json: string, reviver?: (key: string, value: any) => any) => T;
    deserializeWithSpecialTypes: <T = any>(json: string) => T;
    createKeyReviver: (transformers: Map<string, (value: any) => any>) => ((key: string, value: any) => any);
    deserializeWithMetadata: <T = any>(json: string) => {
        data: T;
        metadata: SerializationMetadata;
    };
    safeJsonParse: <T = any>(json: string, defaultValue?: T) => T;
    deepClone: <T>(obj: T, options?: CloneOptions) => T;
    shallowClone: <T>(obj: T) => T;
    structuredCloneObject: <T>(obj: T) => T;
    deepFreeze: <T extends object>(obj: T) => Readonly<T>;
    deepSeal: <T extends object>(obj: T) => T;
    isDeeplyFrozen: (obj: any) => boolean;
    detectCircularReferences: (obj: any) => CircularReference[];
    removeCircularReferences: <T>(obj: T, replacement?: any) => T;
    serializeWithCircularRefs: (obj: any) => string;
    serializeBigInt: (obj: any) => string;
    deserializeBigInt: <T = any>(json: string) => T;
    bigIntToJson: (value: bigint) => number | string;
    serializeDateISO: (date: Date) => string;
    serializeDateCustom: (date: Date, format: "iso" | "unix" | "utc" | "locale") => string | number;
    deserializeDate: (dateString: string | number) => Date;
    serializeBuffer: (buffer: Buffer) => string;
    deserializeBuffer: (base64: string) => Buffer;
    serializeArrayBuffer: (arrayBuffer: ArrayBuffer) => string;
    deserializeArrayBuffer: (base64: string) => ArrayBuffer;
    serializeTypedArray: (typedArray: ArrayBufferView) => {
        type: string;
        data: number[];
    };
    serializeClassInstance: (instance: any) => string;
    deserializeClassInstance: <T = any>(json: string, registry: Map<string, new (...args: any[]) => any>) => T;
    extractInstanceData: (instance: any, includePrivate?: boolean) => object;
    serializeQueryString: (params: Record<string, any>, encode?: boolean) => string;
    deserializeQueryString: (queryString: string, decode?: boolean) => Record<string, string>;
    serializeNestedQueryString: (params: Record<string, any>) => string;
    serializeToFormData: (data: Record<string, any>) => FormData;
    deserializeFromFormData: (formData: FormData) => Record<string, any>;
    serializeToXml: (obj: Record<string, any>, rootName?: string) => string;
    deserializeFromXml: (xml: string) => Record<string, any>;
    serializeToYaml: (obj: Record<string, any>, indent?: number) => string;
    generateMultipartBoundary: () => string;
    serializeToMultipart: (data: Record<string, any>, boundary?: string) => {
        body: string;
        contentType: string;
    };
    serializeStreamChunk: (chunk: any, options?: StreamSerializationOptions) => Buffer;
    deserializeStreamChunk: <T = any>(buffer: Buffer, encoding?: BufferEncoding) => T;
};
export default _default;
//# sourceMappingURL=serialization-utils.d.ts.map