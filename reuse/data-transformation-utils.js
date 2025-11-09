"use strict";
/**
 * LOC: DTR1234567
 * File: /reuse/data-transformation-utils.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - ETL pipeline services
 *   - Data migration modules
 *   - API data transformers
 *   - Database synchronization services
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.unpivotData = exports.pivotData = exports.groupAndAggregate = exports.aggregate = exports.getUnitConversion = exports.convertUnit = exports.formatCurrency = exports.convertCurrency = exports.parseDate = exports.formatDate = exports.formatDateToISO = exports.convertObjectTypes = exports.convertStringToType = exports.validateSchemaVersion = exports.migrateSchema = exports.setNestedValue = exports.getNestedValue = exports.unflattenObject = exports.flattenObject = exports.jsonToXml = exports.xmlToJson = exports.escapeCsvValue = exports.jsonToCsv = exports.parseCsvWithQuotes = exports.csvToJson = exports.etlPipeline = exports.etlLoad = exports.etlTransform = exports.etlExtract = exports.joinArrays = exports.denormalizeData = exports.groupBy = exports.removeDuplicates = exports.normalizeArray = exports.normalizeData = exports.deepMerge = exports.filterObjectProperties = exports.batchTransform = exports.deepMapObject = exports.mapObject = void 0;
// ============================================================================
// OBJECT MAPPING AND TRANSFORMATION
// ============================================================================
/**
 * Maps object properties from source to target based on mapping rules.
 *
 * @param {Record<string, any>} source - Source object
 * @param {MappingRule[]} rules - Array of mapping rules
 * @returns {Record<string, any>} Mapped object
 *
 * @example
 * ```typescript
 * const student = { first_name: 'John', last_name: 'Doe', grade: '10' };
 * const mapped = mapObject(student, [
 *   { source: 'first_name', target: 'firstName' },
 *   { source: 'last_name', target: 'lastName' },
 *   { source: 'grade', target: 'gradeLevel', transform: (v) => parseInt(v) }
 * ]);
 * // Result: { firstName: 'John', lastName: 'Doe', gradeLevel: 10 }
 * ```
 */
const mapObject = (source, rules) => {
    const result = {};
    for (const rule of rules) {
        const value = source[rule.source];
        const transformedValue = rule.transform ? rule.transform(value) : value;
        result[rule.target] = transformedValue !== undefined ? transformedValue : rule.default;
    }
    return result;
};
exports.mapObject = mapObject;
/**
 * Deep maps nested objects recursively.
 *
 * @param {Record<string, any>} source - Source object
 * @param {MappingRule[]} rules - Array of mapping rules (supports dot notation)
 * @returns {Record<string, any>} Deep mapped object
 *
 * @example
 * ```typescript
 * const data = { user: { profile: { name: 'John' } } };
 * const mapped = deepMapObject(data, [
 *   { source: 'user.profile.name', target: 'fullName' }
 * ]);
 * // Result: { fullName: 'John' }
 * ```
 */
const deepMapObject = (source, rules) => {
    const result = {};
    for (const rule of rules) {
        const value = (0, exports.getNestedValue)(source, rule.source);
        const transformedValue = rule.transform ? rule.transform(value) : value;
        (0, exports.setNestedValue)(result, rule.target, transformedValue !== undefined ? transformedValue : rule.default);
    }
    return result;
};
exports.deepMapObject = deepMapObject;
/**
 * Batch transforms an array of objects using mapping rules.
 *
 * @param {Record<string, any>[]} items - Array of source objects
 * @param {MappingRule[]} rules - Array of mapping rules
 * @returns {Record<string, any>[]} Array of mapped objects
 *
 * @example
 * ```typescript
 * const students = [
 *   { first_name: 'John', grade: '10' },
 *   { first_name: 'Jane', grade: '11' }
 * ];
 * const mapped = batchTransform(students, [
 *   { source: 'first_name', target: 'name' },
 *   { source: 'grade', target: 'level', transform: (v) => parseInt(v) }
 * ]);
 * ```
 */
const batchTransform = (items, rules) => {
    return items.map((item) => (0, exports.mapObject)(item, rules));
};
exports.batchTransform = batchTransform;
/**
 * Filters object properties based on predicate function.
 *
 * @param {Record<string, any>} obj - Source object
 * @param {(key: string, value: any) => boolean} predicate - Filter predicate
 * @returns {Record<string, any>} Filtered object
 *
 * @example
 * ```typescript
 * const data = { name: 'John', age: 25, active: true, deleted: false };
 * const filtered = filterObjectProperties(data, (key, value) => value !== false);
 * // Result: { name: 'John', age: 25, active: true }
 * ```
 */
const filterObjectProperties = (obj, predicate) => {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
        if (predicate(key, value)) {
            result[key] = value;
        }
    }
    return result;
};
exports.filterObjectProperties = filterObjectProperties;
/**
 * Merges multiple objects with deep merge support.
 *
 * @param {...Record<string, any>[]} objects - Objects to merge
 * @returns {Record<string, any>} Merged object
 *
 * @example
 * ```typescript
 * const base = { name: 'John', address: { city: 'NYC' } };
 * const updates = { age: 25, address: { zip: '10001' } };
 * const merged = deepMerge(base, updates);
 * // Result: { name: 'John', age: 25, address: { city: 'NYC', zip: '10001' } }
 * ```
 */
const deepMerge = (...objects) => {
    const result = {};
    for (const obj of objects) {
        for (const [key, value] of Object.entries(obj)) {
            if (value && typeof value === 'object' && !Array.isArray(value)) {
                result[key] = (0, exports.deepMerge)(result[key] || {}, value);
            }
            else {
                result[key] = value;
            }
        }
    }
    return result;
};
exports.deepMerge = deepMerge;
// ============================================================================
// DATA NORMALIZATION
// ============================================================================
/**
 * Normalizes nested data structure into flat relational format.
 *
 * @param {any} data - Data to normalize
 * @param {NormalizationConfig} [config] - Normalization configuration
 * @returns {object} Normalized data with entities and relationships
 *
 * @example
 * ```typescript
 * const data = {
 *   id: 1,
 *   name: 'School A',
 *   students: [
 *     { id: 101, name: 'John' },
 *     { id: 102, name: 'Jane' }
 *   ]
 * };
 * const normalized = normalizeData(data);
 * // Result: {
 * //   entities: { schools: { 1: { id: 1, name: 'School A' } }, students: { 101: {...}, 102: {...} } },
 * //   result: 1
 * // }
 * ```
 */
const normalizeData = (data, config) => {
    const entities = {};
    const idField = config?.idField || 'id';
    const normalize = (item, entityType) => {
        if (Array.isArray(item)) {
            return item.map((i) => normalize(i, entityType));
        }
        if (!item || typeof item !== 'object') {
            return item;
        }
        const id = item[idField];
        if (!id)
            return item;
        if (!entities[entityType]) {
            entities[entityType] = {};
        }
        const normalized = { [idField]: id };
        for (const [key, value] of Object.entries(item)) {
            if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
                normalized[key] = normalize(value, key).map((v) => v[idField]);
            }
            else if (value && typeof value === 'object' && value[idField]) {
                normalized[key] = normalize(value, key)[idField];
            }
            else {
                normalized[key] = value;
            }
        }
        entities[entityType][id] = normalized;
        return normalized;
    };
    const result = normalize(data, 'items');
    return { entities, result: Array.isArray(data) ? result.map((r) => r[idField]) : result[idField] };
};
exports.normalizeData = normalizeData;
/**
 * Normalizes array of objects by unique identifier.
 *
 * @param {any[]} array - Array to normalize
 * @param {string} [idField] - ID field name (default: 'id')
 * @returns {Record<string | number, any>} Object keyed by ID
 *
 * @example
 * ```typescript
 * const students = [
 *   { id: 1, name: 'John' },
 *   { id: 2, name: 'Jane' }
 * ];
 * const normalized = normalizeArray(students);
 * // Result: { 1: { id: 1, name: 'John' }, 2: { id: 2, name: 'Jane' } }
 * ```
 */
const normalizeArray = (array, idField = 'id') => {
    const result = {};
    for (const item of array) {
        const id = item[idField];
        if (id !== undefined) {
            result[id] = item;
        }
    }
    return result;
};
exports.normalizeArray = normalizeArray;
/**
 * Removes duplicate objects from array based on key.
 *
 * @param {any[]} array - Array with potential duplicates
 * @param {string} key - Key to check for uniqueness
 * @returns {any[]} Array with duplicates removed
 *
 * @example
 * ```typescript
 * const students = [
 *   { id: 1, name: 'John' },
 *   { id: 2, name: 'Jane' },
 *   { id: 1, name: 'John Doe' }
 * ];
 * const unique = removeDuplicates(students, 'id');
 * // Result: [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }]
 * ```
 */
const removeDuplicates = (array, key) => {
    const seen = new Set();
    return array.filter((item) => {
        const value = item[key];
        if (seen.has(value)) {
            return false;
        }
        seen.add(value);
        return true;
    });
};
exports.removeDuplicates = removeDuplicates;
/**
 * Groups array of objects by key.
 *
 * @param {any[]} array - Array to group
 * @param {string} key - Key to group by
 * @returns {Record<string, any[]>} Grouped object
 *
 * @example
 * ```typescript
 * const students = [
 *   { grade: 10, name: 'John' },
 *   { grade: 11, name: 'Jane' },
 *   { grade: 10, name: 'Bob' }
 * ];
 * const grouped = groupBy(students, 'grade');
 * // Result: { 10: [{ grade: 10, name: 'John' }, { grade: 10, name: 'Bob' }], 11: [...] }
 * ```
 */
const groupBy = (array, key) => {
    return array.reduce((result, item) => {
        const groupKey = item[key];
        if (!result[groupKey]) {
            result[groupKey] = [];
        }
        result[groupKey].push(item);
        return result;
    }, {});
};
exports.groupBy = groupBy;
// ============================================================================
// DATA DENORMALIZATION
// ============================================================================
/**
 * Denormalizes flat relational data back into nested structure.
 *
 * @param {any} normalizedData - Normalized data structure
 * @param {Record<string, Record<string | number, any>>} entities - Entity lookup tables
 * @param {DenormalizationConfig} [config] - Denormalization configuration
 * @returns {any} Denormalized nested data
 *
 * @example
 * ```typescript
 * const entities = {
 *   schools: { 1: { id: 1, name: 'School A', studentIds: [101, 102] } },
 *   students: { 101: { id: 101, name: 'John' }, 102: { id: 102, name: 'Jane' } }
 * };
 * const denormalized = denormalizeData({ id: 1 }, entities);
 * ```
 */
const denormalizeData = (normalizedData, entities, config) => {
    const maxDepth = config?.maxDepth || 5;
    const include = config?.include;
    const denormalize = (data, depth = 0) => {
        if (depth >= maxDepth)
            return data;
        if (!data || typeof data !== 'object')
            return data;
        if (Array.isArray(data)) {
            return data.map((item) => denormalize(item, depth + 1));
        }
        const result = { ...data };
        for (const [key, value] of Object.entries(data)) {
            if (include && !include.includes(key))
                continue;
            if (Array.isArray(value)) {
                const entityType = key;
                if (entities[entityType]) {
                    result[key] = value.map((id) => denormalize(entities[entityType][id], depth + 1));
                }
            }
            else if (typeof value === 'number' || typeof value === 'string') {
                const possibleEntityType = key.replace(/Id$/, 's');
                if (entities[possibleEntityType]?.[value]) {
                    result[key] = denormalize(entities[possibleEntityType][value], depth + 1);
                }
            }
        }
        return result;
    };
    return denormalize(normalizedData);
};
exports.denormalizeData = denormalizeData;
/**
 * Joins two arrays of objects by matching key (SQL-like join).
 *
 * @param {any[]} left - Left array
 * @param {any[]} right - Right array
 * @param {string} leftKey - Key in left array
 * @param {string} rightKey - Key in right array
 * @param {string} [type] - Join type: 'inner', 'left', 'right', 'outer'
 * @returns {any[]} Joined array
 *
 * @example
 * ```typescript
 * const students = [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }];
 * const grades = [{ studentId: 1, grade: 'A' }, { studentId: 2, grade: 'B' }];
 * const joined = joinArrays(students, grades, 'id', 'studentId', 'left');
 * // Result: [{ id: 1, name: 'John', grade: 'A' }, { id: 2, name: 'Jane', grade: 'B' }]
 * ```
 */
const joinArrays = (left, right, leftKey, rightKey, type = 'inner') => {
    const rightMap = new Map(right.map((item) => [item[rightKey], item]));
    const result = [];
    const matched = new Set();
    for (const leftItem of left) {
        const rightItem = rightMap.get(leftItem[leftKey]);
        if (rightItem) {
            result.push({ ...leftItem, ...rightItem });
            matched.add(leftItem[leftKey]);
        }
        else if (type === 'left' || type === 'outer') {
            result.push(leftItem);
        }
    }
    if (type === 'right' || type === 'outer') {
        for (const rightItem of right) {
            if (!matched.has(rightItem[rightKey])) {
                result.push(rightItem);
            }
        }
    }
    return result;
};
exports.joinArrays = joinArrays;
// ============================================================================
// ETL PIPELINE HELPERS
// ============================================================================
/**
 * Extracts data with validation and error handling.
 *
 * @template T
 * @param {() => Promise<T>} extractor - Data extraction function
 * @param {ETLConfig} [config] - ETL configuration
 * @returns {Promise<T>} Extracted data
 *
 * @example
 * ```typescript
 * const data = await etlExtract(
 *   async () => await fetchStudentData(),
 *   { validateInput: true, onError: 'log' }
 * );
 * ```
 */
const etlExtract = async (extractor, config) => {
    try {
        const data = await extractor();
        if (config?.validateInput && !data) {
            throw new Error('Extraction returned no data');
        }
        return data;
    }
    catch (error) {
        if (config?.onError === 'skip')
            return [];
        if (config?.onError === 'log')
            console.error('ETL Extract Error:', error);
        throw error;
    }
};
exports.etlExtract = etlExtract;
/**
 * Transforms data in batches with progress tracking.
 *
 * @template T, U
 * @param {T[]} data - Data to transform
 * @param {(item: T) => U} transformer - Transformation function
 * @param {ETLConfig} [config] - ETL configuration
 * @returns {Promise<U[]>} Transformed data
 *
 * @example
 * ```typescript
 * const transformed = await etlTransform(
 *   students,
 *   (s) => ({ ...s, fullName: `${s.firstName} ${s.lastName}` }),
 *   { batchSize: 100 }
 * );
 * ```
 */
const etlTransform = async (data, transformer, config) => {
    const batchSize = config?.batchSize || 1000;
    const result = [];
    for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize);
        try {
            const transformed = batch.map(transformer);
            result.push(...transformed);
        }
        catch (error) {
            if (config?.onError === 'stop')
                throw error;
            if (config?.onError === 'log')
                console.error(`ETL Transform Error (batch ${i}):`, error);
        }
    }
    return result;
};
exports.etlTransform = etlTransform;
/**
 * Loads data with validation and batch support.
 *
 * @template T
 * @param {T[]} data - Data to load
 * @param {(batch: T[]) => Promise<void>} loader - Data loading function
 * @param {ETLConfig} [config] - ETL configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await etlLoad(
 *   transformedStudents,
 *   async (batch) => await Student.bulkCreate(batch),
 *   { batchSize: 500, validateOutput: true }
 * );
 * ```
 */
const etlLoad = async (data, loader, config) => {
    const batchSize = config?.batchSize || 1000;
    for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize);
        try {
            if (config?.validateOutput && batch.length === 0) {
                throw new Error('Empty batch');
            }
            await loader(batch);
        }
        catch (error) {
            if (config?.onError === 'stop')
                throw error;
            if (config?.onError === 'log')
                console.error(`ETL Load Error (batch ${i}):`, error);
        }
    }
};
exports.etlLoad = etlLoad;
/**
 * Complete ETL pipeline with extract, transform, and load.
 *
 * @template T, U
 * @param {() => Promise<T[]>} extractor - Extraction function
 * @param {(item: T) => U} transformer - Transformation function
 * @param {(batch: U[]) => Promise<void>} loader - Loading function
 * @param {ETLConfig} [config] - ETL configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await etlPipeline(
 *   async () => await fetchStudents(),
 *   (s) => transformStudent(s),
 *   async (batch) => await Student.bulkCreate(batch),
 *   { batchSize: 500 }
 * );
 * ```
 */
const etlPipeline = async (extractor, transformer, loader, config) => {
    const extracted = await (0, exports.etlExtract)(extractor, config);
    const transformed = await (0, exports.etlTransform)(extracted, transformer, config);
    await (0, exports.etlLoad)(transformed, loader, config);
};
exports.etlPipeline = etlPipeline;
// ============================================================================
// CSV TO JSON CONVERSION
// ============================================================================
/**
 * Converts CSV string to JSON array.
 *
 * @param {string} csv - CSV string
 * @param {object} [options] - Conversion options
 * @returns {any[]} JSON array
 *
 * @example
 * ```typescript
 * const csv = 'name,grade\nJohn,10\nJane,11';
 * const json = csvToJson(csv);
 * // Result: [{ name: 'John', grade: '10' }, { name: 'Jane', grade: '11' }]
 * ```
 */
const csvToJson = (csv, options) => {
    const delimiter = options?.delimiter || ',';
    const lines = csv.trim().split('\n');
    const headers = options?.headers || lines[0].split(delimiter).map((h) => h.trim());
    const startIndex = options?.skipHeader ? 1 : options?.headers ? 0 : 1;
    return lines.slice(startIndex).map((line) => {
        const values = line.split(delimiter).map((v) => v.trim());
        const obj = {};
        headers.forEach((header, index) => {
            obj[header] = values[index];
        });
        return obj;
    });
};
exports.csvToJson = csvToJson;
/**
 * Parses CSV with quoted fields support.
 *
 * @param {string} csv - CSV string with quoted fields
 * @returns {string[][]} Parsed CSV rows
 *
 * @example
 * ```typescript
 * const csv = 'name,address\n"John Doe","123 Main St, NYC"';
 * const parsed = parseCsvWithQuotes(csv);
 * // Result: [['name', 'address'], ['John Doe', '123 Main St, NYC']]
 * ```
 */
const parseCsvWithQuotes = (csv) => {
    const rows = [];
    const lines = csv.split('\n');
    for (const line of lines) {
        const row = [];
        let current = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                inQuotes = !inQuotes;
            }
            else if (char === ',' && !inQuotes) {
                row.push(current.trim());
                current = '';
            }
            else {
                current += char;
            }
        }
        row.push(current.trim());
        rows.push(row);
    }
    return rows;
};
exports.parseCsvWithQuotes = parseCsvWithQuotes;
// ============================================================================
// JSON TO CSV CONVERSION
// ============================================================================
/**
 * Converts JSON array to CSV string.
 *
 * @param {any[]} json - JSON array
 * @param {object} [options] - Conversion options
 * @returns {string} CSV string
 *
 * @example
 * ```typescript
 * const students = [{ name: 'John', grade: 10 }, { name: 'Jane', grade: 11 }];
 * const csv = jsonToCsv(students);
 * // Result: 'name,grade\nJohn,10\nJane,11'
 * ```
 */
const jsonToCsv = (json, options) => {
    if (json.length === 0)
        return '';
    const delimiter = options?.delimiter || ',';
    const headers = options?.headers || Object.keys(json[0]);
    const includeHeaders = options?.includeHeaders !== false;
    const csvRows = [];
    if (includeHeaders) {
        csvRows.push(headers.join(delimiter));
    }
    for (const item of json) {
        const row = headers.map((header) => {
            const value = item[header];
            return (0, exports.escapeCsvValue)(String(value ?? ''), delimiter);
        });
        csvRows.push(row.join(delimiter));
    }
    return csvRows.join('\n');
};
exports.jsonToCsv = jsonToCsv;
/**
 * Escapes CSV value for safe export.
 *
 * @param {string} value - Value to escape
 * @param {string} delimiter - CSV delimiter
 * @returns {string} Escaped value
 *
 * @example
 * ```typescript
 * escapeCsvValue('John, Doe', ','); // '"John, Doe"'
 * escapeCsvValue('Simple', ','); // 'Simple'
 * ```
 */
const escapeCsvValue = (value, delimiter = ',') => {
    if (value.includes(delimiter) || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
};
exports.escapeCsvValue = escapeCsvValue;
// ============================================================================
// XML PARSING AND GENERATION
// ============================================================================
/**
 * Converts simple XML to JSON object.
 *
 * @param {string} xml - XML string
 * @returns {any} JSON object
 *
 * @example
 * ```typescript
 * const xml = '<student><name>John</name><grade>10</grade></student>';
 * const json = xmlToJson(xml);
 * // Result: { student: { name: 'John', grade: '10' } }
 * ```
 */
const xmlToJson = (xml) => {
    const parseNode = (node) => {
        const tagMatch = node.match(/<(\w+)>(.*?)<\/\1>/s);
        if (!tagMatch)
            return node.trim();
        const [, tagName, content] = tagMatch;
        const children = content.match(/<\w+>.*?<\/\w+>/gs);
        if (!children) {
            return { [tagName]: content.trim() };
        }
        const result = {};
        for (const child of children) {
            const childObj = parseNode(child);
            const childKey = Object.keys(childObj)[0];
            if (result[childKey]) {
                if (Array.isArray(result[childKey])) {
                    result[childKey].push(childObj[childKey]);
                }
                else {
                    result[childKey] = [result[childKey], childObj[childKey]];
                }
            }
            else {
                Object.assign(result, childObj);
            }
        }
        return { [tagName]: result };
    };
    return parseNode(xml);
};
exports.xmlToJson = xmlToJson;
/**
 * Converts JSON object to simple XML string.
 *
 * @param {any} json - JSON object
 * @param {string} [rootTag] - Root XML tag name
 * @returns {string} XML string
 *
 * @example
 * ```typescript
 * const data = { name: 'John', grade: 10 };
 * const xml = jsonToXml(data, 'student');
 * // Result: '<student><name>John</name><grade>10</grade></student>'
 * ```
 */
const jsonToXml = (json, rootTag = 'root') => {
    const buildXml = (obj) => {
        if (typeof obj !== 'object' || obj === null) {
            return String(obj);
        }
        if (Array.isArray(obj)) {
            return obj.map((item) => buildXml(item)).join('');
        }
        let xml = '';
        for (const [key, value] of Object.entries(obj)) {
            if (Array.isArray(value)) {
                xml += value.map((item) => `<${key}>${buildXml(item)}</${key}>`).join('');
            }
            else {
                xml += `<${key}>${buildXml(value)}</${key}>`;
            }
        }
        return xml;
    };
    return `<${rootTag}>${buildXml(json)}</${rootTag}>`;
};
exports.jsonToXml = jsonToXml;
// ============================================================================
// DATA FLATTENING AND UNFLATTENING
// ============================================================================
/**
 * Flattens nested object to single level with dot notation keys.
 *
 * @param {Record<string, any>} obj - Object to flatten
 * @param {string} [prefix] - Key prefix
 * @returns {Record<string, any>} Flattened object
 *
 * @example
 * ```typescript
 * const nested = { user: { profile: { name: 'John', age: 25 } } };
 * const flat = flattenObject(nested);
 * // Result: { 'user.profile.name': 'John', 'user.profile.age': 25 }
 * ```
 */
const flattenObject = (obj, prefix = '') => {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
        const newKey = prefix ? `${prefix}.${key}` : key;
        if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
            Object.assign(result, (0, exports.flattenObject)(value, newKey));
        }
        else {
            result[newKey] = value;
        }
    }
    return result;
};
exports.flattenObject = flattenObject;
/**
 * Unflattens object with dot notation keys back to nested structure.
 *
 * @param {Record<string, any>} obj - Flattened object
 * @returns {Record<string, any>} Nested object
 *
 * @example
 * ```typescript
 * const flat = { 'user.profile.name': 'John', 'user.profile.age': 25 };
 * const nested = unflattenObject(flat);
 * // Result: { user: { profile: { name: 'John', age: 25 } } }
 * ```
 */
const unflattenObject = (obj) => {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
        (0, exports.setNestedValue)(result, key, value);
    }
    return result;
};
exports.unflattenObject = unflattenObject;
/**
 * Gets nested value from object using dot notation path.
 *
 * @param {Record<string, any>} obj - Source object
 * @param {string} path - Dot notation path
 * @returns {any} Value at path or undefined
 *
 * @example
 * ```typescript
 * const data = { user: { profile: { name: 'John' } } };
 * const name = getNestedValue(data, 'user.profile.name'); // 'John'
 * ```
 */
const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
};
exports.getNestedValue = getNestedValue;
/**
 * Sets nested value in object using dot notation path.
 *
 * @param {Record<string, any>} obj - Target object
 * @param {string} path - Dot notation path
 * @param {any} value - Value to set
 * @returns {void}
 *
 * @example
 * ```typescript
 * const data = {};
 * setNestedValue(data, 'user.profile.name', 'John');
 * // Result: { user: { profile: { name: 'John' } } }
 * ```
 */
const setNestedValue = (obj, path, value) => {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((current, key) => {
        if (!current[key])
            current[key] = {};
        return current[key];
    }, obj);
    target[lastKey] = value;
};
exports.setNestedValue = setNestedValue;
// ============================================================================
// SCHEMA MIGRATION HELPERS
// ============================================================================
/**
 * Applies schema version migrations to data.
 *
 * @param {any} data - Data to migrate
 * @param {number} currentVersion - Current schema version
 * @param {number} targetVersion - Target schema version
 * @param {SchemaVersion[]} migrations - Migration definitions
 * @returns {any} Migrated data
 *
 * @example
 * ```typescript
 * const migrations = [
 *   { version: 2, up: (d) => ({ ...d, newField: 'default' }), down: (d) => d }
 * ];
 * const migrated = migrateSchema(data, 1, 2, migrations);
 * ```
 */
const migrateSchema = (data, currentVersion, targetVersion, migrations) => {
    let result = { ...data };
    const direction = targetVersion > currentVersion ? 'up' : 'down';
    const relevantMigrations = migrations
        .filter((m) => {
        if (direction === 'up') {
            return m.version > currentVersion && m.version <= targetVersion;
        }
        return m.version <= currentVersion && m.version > targetVersion;
    })
        .sort((a, b) => (direction === 'up' ? a.version - b.version : b.version - a.version));
    for (const migration of relevantMigrations) {
        result = migration[direction](result);
    }
    return result;
};
exports.migrateSchema = migrateSchema;
/**
 * Validates data against schema version.
 *
 * @param {any} data - Data to validate
 * @param {number} version - Schema version
 * @param {(data: any, version: number) => boolean} validator - Validation function
 * @returns {boolean} True if valid
 *
 * @example
 * ```typescript
 * const isValid = validateSchemaVersion(
 *   studentData,
 *   2,
 *   (d, v) => v === 2 ? 'newField' in d : true
 * );
 * ```
 */
const validateSchemaVersion = (data, version, validator) => {
    return validator(data, version);
};
exports.validateSchemaVersion = validateSchemaVersion;
// ============================================================================
// DATA TYPE CONVERSIONS
// ============================================================================
/**
 * Converts string to appropriate data type.
 *
 * @param {string} value - String value
 * @param {string} [type] - Target type: 'number', 'boolean', 'date', 'json'
 * @returns {any} Converted value
 *
 * @example
 * ```typescript
 * convertStringToType('123', 'number'); // 123
 * convertStringToType('true', 'boolean'); // true
 * convertStringToType('2024-01-01', 'date'); // Date object
 * ```
 */
const convertStringToType = (value, type) => {
    if (!type) {
        // Auto-detect type
        if (value === 'true' || value === 'false')
            return value === 'true';
        if (!isNaN(Number(value)) && value.trim() !== '')
            return Number(value);
        if (value.match(/^\d{4}-\d{2}-\d{2}/))
            return new Date(value);
        return value;
    }
    switch (type) {
        case 'number':
            return Number(value);
        case 'boolean':
            return value === 'true';
        case 'date':
            return new Date(value);
        case 'json':
            return JSON.parse(value);
        default:
            return value;
    }
};
exports.convertStringToType = convertStringToType;
/**
 * Converts values in object to specified types.
 *
 * @param {Record<string, any>} obj - Object with string values
 * @param {Record<string, string>} typeMap - Map of field to type
 * @returns {Record<string, any>} Object with converted types
 *
 * @example
 * ```typescript
 * const data = { age: '25', active: 'true', date: '2024-01-01' };
 * const typed = convertObjectTypes(data, { age: 'number', active: 'boolean', date: 'date' });
 * ```
 */
const convertObjectTypes = (obj, typeMap) => {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
        result[key] = typeMap[key] ? (0, exports.convertStringToType)(String(value), typeMap[key]) : value;
    }
    return result;
};
exports.convertObjectTypes = convertObjectTypes;
// ============================================================================
// DATE FORMAT TRANSFORMATIONS
// ============================================================================
/**
 * Formats date to ISO string.
 *
 * @param {Date | string} date - Date to format
 * @returns {string} ISO date string
 *
 * @example
 * ```typescript
 * formatDateToISO(new Date('2024-01-01')); // '2024-01-01T00:00:00.000Z'
 * ```
 */
const formatDateToISO = (date) => {
    return new Date(date).toISOString();
};
exports.formatDateToISO = formatDateToISO;
/**
 * Formats date to custom format.
 *
 * @param {Date | string} date - Date to format
 * @param {string} format - Format string (YYYY-MM-DD, MM/DD/YYYY, etc.)
 * @returns {string} Formatted date string
 *
 * @example
 * ```typescript
 * formatDate(new Date('2024-01-15'), 'YYYY-MM-DD'); // '2024-01-15'
 * formatDate(new Date('2024-01-15'), 'MM/DD/YYYY'); // '01/15/2024'
 * ```
 */
const formatDate = (date, format) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return format
        .replace('YYYY', String(year))
        .replace('MM', month)
        .replace('DD', day);
};
exports.formatDate = formatDate;
/**
 * Parses date from custom format.
 *
 * @param {string} dateString - Date string
 * @param {string} format - Format string
 * @returns {Date} Parsed date
 *
 * @example
 * ```typescript
 * parseDate('01/15/2024', 'MM/DD/YYYY'); // Date object for Jan 15, 2024
 * ```
 */
const parseDate = (dateString, format) => {
    const formatParts = format.split(/[-/]/);
    const dateParts = dateString.split(/[-/]/);
    const yearIndex = formatParts.indexOf('YYYY');
    const monthIndex = formatParts.indexOf('MM');
    const dayIndex = formatParts.indexOf('DD');
    const year = parseInt(dateParts[yearIndex], 10);
    const month = parseInt(dateParts[monthIndex], 10) - 1;
    const day = parseInt(dateParts[dayIndex], 10);
    return new Date(year, month, day);
};
exports.parseDate = parseDate;
// ============================================================================
// CURRENCY CONVERSIONS
// ============================================================================
/**
 * Converts amount between currencies.
 *
 * @param {number} amount - Amount to convert
 * @param {CurrencyConversion} conversion - Conversion configuration
 * @returns {number} Converted amount
 *
 * @example
 * ```typescript
 * convertCurrency(100, { from: 'USD', to: 'EUR', rate: 0.85 }); // 85
 * ```
 */
const convertCurrency = (amount, conversion) => {
    return Math.round(amount * conversion.rate * 100) / 100;
};
exports.convertCurrency = convertCurrency;
/**
 * Formats currency amount with symbol.
 *
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (USD, EUR, GBP)
 * @returns {string} Formatted currency string
 *
 * @example
 * ```typescript
 * formatCurrency(1234.56, 'USD'); // '$1,234.56'
 * formatCurrency(1234.56, 'EUR'); // '€1,234.56'
 * ```
 */
const formatCurrency = (amount, currency) => {
    const symbols = {
        USD: '$',
        EUR: '€',
        GBP: '£',
        JPY: '¥',
    };
    const symbol = symbols[currency] || currency;
    const formatted = amount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    return `${symbol}${formatted}`;
};
exports.formatCurrency = formatCurrency;
// ============================================================================
// UNIT CONVERSIONS
// ============================================================================
/**
 * Converts value between units.
 *
 * @param {number} value - Value to convert
 * @param {UnitConversion} conversion - Conversion configuration
 * @returns {number} Converted value
 *
 * @example
 * ```typescript
 * convertUnit(100, { from: 'cm', to: 'm', factor: 0.01 }); // 1
 * convertUnit(32, { from: 'F', to: 'C', factor: 5/9, offset: -32 }); // 0
 * ```
 */
const convertUnit = (value, conversion) => {
    const offset = conversion.offset || 0;
    return (value + offset) * conversion.factor;
};
exports.convertUnit = convertUnit;
/**
 * Gets predefined unit conversion factor.
 *
 * @param {string} from - Source unit
 * @param {string} to - Target unit
 * @returns {UnitConversion | null} Conversion configuration or null
 *
 * @example
 * ```typescript
 * const conversion = getUnitConversion('kg', 'lb');
 * convertUnit(10, conversion); // 22.046
 * ```
 */
const getUnitConversion = (from, to) => {
    const conversions = {
        kg: { lb: { from: 'kg', to: 'lb', factor: 2.20462 } },
        lb: { kg: { from: 'lb', to: 'kg', factor: 0.453592 } },
        m: { ft: { from: 'm', to: 'ft', factor: 3.28084 } },
        ft: { m: { from: 'ft', to: 'm', factor: 0.3048 } },
    };
    return conversions[from]?.[to] || null;
};
exports.getUnitConversion = getUnitConversion;
// ============================================================================
// DATA AGGREGATION HELPERS
// ============================================================================
/**
 * Aggregates array by calculating sum, avg, min, max, count.
 *
 * @param {any[]} array - Array to aggregate
 * @param {string} field - Field to aggregate
 * @param {string} operation - Aggregation operation
 * @returns {number} Aggregated value
 *
 * @example
 * ```typescript
 * const students = [{ score: 85 }, { score: 90 }, { score: 78 }];
 * aggregate(students, 'score', 'avg'); // 84.33
 * aggregate(students, 'score', 'max'); // 90
 * ```
 */
const aggregate = (array, field, operation) => {
    const values = array.map((item) => item[field]).filter((v) => typeof v === 'number');
    switch (operation) {
        case 'sum':
            return values.reduce((sum, val) => sum + val, 0);
        case 'avg':
            return values.reduce((sum, val) => sum + val, 0) / values.length;
        case 'min':
            return Math.min(...values);
        case 'max':
            return Math.max(...values);
        case 'count':
            return values.length;
        default:
            return 0;
    }
};
exports.aggregate = aggregate;
/**
 * Groups and aggregates data.
 *
 * @param {any[]} array - Array to group and aggregate
 * @param {string} groupBy - Field to group by
 * @param {string} aggregateField - Field to aggregate
 * @param {string} operation - Aggregation operation
 * @returns {Record<string, number>} Grouped aggregated results
 *
 * @example
 * ```typescript
 * const students = [
 *   { grade: 10, score: 85 },
 *   { grade: 10, score: 90 },
 *   { grade: 11, score: 78 }
 * ];
 * groupAndAggregate(students, 'grade', 'score', 'avg');
 * // Result: { '10': 87.5, '11': 78 }
 * ```
 */
const groupAndAggregate = (array, groupByField, aggregateField, operation) => {
    const grouped = (0, exports.groupBy)(array, groupByField);
    const result = {};
    for (const [key, items] of Object.entries(grouped)) {
        result[key] = (0, exports.aggregate)(items, aggregateField, operation);
    }
    return result;
};
exports.groupAndAggregate = groupAndAggregate;
// ============================================================================
// DATA PIVOTING
// ============================================================================
/**
 * Pivots data from long to wide format.
 *
 * @param {any[]} array - Array in long format
 * @param {string} rowKey - Row identifier field
 * @param {string} columnKey - Column identifier field
 * @param {string} valueKey - Value field
 * @returns {any[]} Pivoted data in wide format
 *
 * @example
 * ```typescript
 * const data = [
 *   { student: 'John', subject: 'Math', score: 85 },
 *   { student: 'John', subject: 'Science', score: 90 },
 *   { student: 'Jane', subject: 'Math', score: 95 }
 * ];
 * const pivoted = pivotData(data, 'student', 'subject', 'score');
 * // Result: [
 * //   { student: 'John', Math: 85, Science: 90 },
 * //   { student: 'Jane', Math: 95 }
 * // ]
 * ```
 */
const pivotData = (array, rowKey, columnKey, valueKey) => {
    const pivoted = new Map();
    for (const item of array) {
        const rowId = item[rowKey];
        const colId = item[columnKey];
        const value = item[valueKey];
        if (!pivoted.has(rowId)) {
            pivoted.set(rowId, { [rowKey]: rowId });
        }
        pivoted.get(rowId)[colId] = value;
    }
    return Array.from(pivoted.values());
};
exports.pivotData = pivotData;
/**
 * Unpivots data from wide to long format.
 *
 * @param {any[]} array - Array in wide format
 * @param {string} rowKey - Row identifier field
 * @param {string[]} columnKeys - Column fields to unpivot
 * @param {string} nameKey - New column name field
 * @param {string} valueKey - New value field
 * @returns {any[]} Unpivoted data in long format
 *
 * @example
 * ```typescript
 * const data = [
 *   { student: 'John', Math: 85, Science: 90 },
 *   { student: 'Jane', Math: 95, Science: 88 }
 * ];
 * const unpivoted = unpivotData(data, 'student', ['Math', 'Science'], 'subject', 'score');
 * // Result: [
 * //   { student: 'John', subject: 'Math', score: 85 },
 * //   { student: 'John', subject: 'Science', score: 90 },
 * //   { student: 'Jane', subject: 'Math', score: 95 },
 * //   { student: 'Jane', subject: 'Science', score: 88 }
 * // ]
 * ```
 */
const unpivotData = (array, rowKey, columnKeys, nameKey, valueKey) => {
    const result = [];
    for (const item of array) {
        for (const colKey of columnKeys) {
            if (item[colKey] !== undefined) {
                result.push({
                    [rowKey]: item[rowKey],
                    [nameKey]: colKey,
                    [valueKey]: item[colKey],
                });
            }
        }
    }
    return result;
};
exports.unpivotData = unpivotData;
exports.default = {
    // Object mapping
    mapObject: exports.mapObject,
    deepMapObject: exports.deepMapObject,
    batchTransform: exports.batchTransform,
    filterObjectProperties: exports.filterObjectProperties,
    deepMerge: exports.deepMerge,
    // Normalization
    normalizeData: exports.normalizeData,
    normalizeArray: exports.normalizeArray,
    removeDuplicates: exports.removeDuplicates,
    groupBy: exports.groupBy,
    // Denormalization
    denormalizeData: exports.denormalizeData,
    joinArrays: exports.joinArrays,
    // ETL
    etlExtract: exports.etlExtract,
    etlTransform: exports.etlTransform,
    etlLoad: exports.etlLoad,
    etlPipeline: exports.etlPipeline,
    // CSV
    csvToJson: exports.csvToJson,
    parseCsvWithQuotes: exports.parseCsvWithQuotes,
    jsonToCsv: exports.jsonToCsv,
    escapeCsvValue: exports.escapeCsvValue,
    // XML
    xmlToJson: exports.xmlToJson,
    jsonToXml: exports.jsonToXml,
    // Flatten/Unflatten
    flattenObject: exports.flattenObject,
    unflattenObject: exports.unflattenObject,
    getNestedValue: exports.getNestedValue,
    setNestedValue: exports.setNestedValue,
    // Schema migration
    migrateSchema: exports.migrateSchema,
    validateSchemaVersion: exports.validateSchemaVersion,
    // Type conversion
    convertStringToType: exports.convertStringToType,
    convertObjectTypes: exports.convertObjectTypes,
    // Date formatting
    formatDateToISO: exports.formatDateToISO,
    formatDate: exports.formatDate,
    parseDate: exports.parseDate,
    // Currency
    convertCurrency: exports.convertCurrency,
    formatCurrency: exports.formatCurrency,
    // Units
    convertUnit: exports.convertUnit,
    getUnitConversion: exports.getUnitConversion,
    // Aggregation
    aggregate: exports.aggregate,
    groupAndAggregate: exports.groupAndAggregate,
    // Pivoting
    pivotData: exports.pivotData,
    unpivotData: exports.unpivotData,
};
//# sourceMappingURL=data-transformation-utils.js.map