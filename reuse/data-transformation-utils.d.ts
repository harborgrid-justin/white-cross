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
/**
 * File: /reuse/data-transformation-utils.ts
 * Locator: WC-UTL-DTR-003
 * Purpose: Data Transformation Utilities - Comprehensive ETL and data conversion helpers
 *
 * Upstream: Independent utility module for data transformation operations
 * Downstream: ../backend/*, ../services/*, ETL pipelines, data migration tools
 * Dependencies: TypeScript 5.x, Node 18+
 * Exports: 45 utility functions for data transformation, normalization, format conversion
 *
 * LLM Context: Comprehensive data transformation utilities for White Cross system.
 * Provides object mapping, data normalization/denormalization, ETL helpers, format
 * conversions (CSV, JSON, XML), schema migration, and data type conversions. Essential
 * for healthcare data integration requiring HIPAA-compliant transformations.
 */
interface MappingRule {
    source: string;
    target: string;
    transform?: (value: any) => any;
    default?: any;
}
interface NormalizationConfig {
    idField?: string;
    relationships?: Record<string, string>;
    nested?: boolean;
}
interface DenormalizationConfig {
    include?: string[];
    maxDepth?: number;
}
interface ETLConfig {
    batchSize?: number;
    validateInput?: boolean;
    validateOutput?: boolean;
    onError?: 'skip' | 'stop' | 'log';
}
interface SchemaVersion {
    version: number;
    up: (data: any) => any;
    down: (data: any) => any;
}
interface CurrencyConversion {
    from: string;
    to: string;
    rate: number;
    timestamp?: Date;
}
interface UnitConversion {
    from: string;
    to: string;
    factor: number;
    offset?: number;
}
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
export declare const mapObject: (source: Record<string, any>, rules: MappingRule[]) => Record<string, any>;
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
export declare const deepMapObject: (source: Record<string, any>, rules: MappingRule[]) => Record<string, any>;
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
export declare const batchTransform: (items: Record<string, any>[], rules: MappingRule[]) => Record<string, any>[];
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
export declare const filterObjectProperties: (obj: Record<string, any>, predicate: (key: string, value: any) => boolean) => Record<string, any>;
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
export declare const deepMerge: (...objects: Record<string, any>[]) => Record<string, any>;
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
export declare const normalizeData: (data: any, config?: NormalizationConfig) => {
    entities: Record<string, Record<string | number, any>>;
    result: any;
};
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
export declare const normalizeArray: (array: any[], idField?: string) => Record<string | number, any>;
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
export declare const removeDuplicates: (array: any[], key: string) => any[];
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
export declare const groupBy: (array: any[], key: string) => Record<string, any[]>;
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
export declare const denormalizeData: (normalizedData: any, entities: Record<string, Record<string | number, any>>, config?: DenormalizationConfig) => any;
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
export declare const joinArrays: (left: any[], right: any[], leftKey: string, rightKey: string, type?: "inner" | "left" | "right" | "outer") => any[];
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
export declare const etlExtract: <T>(extractor: () => Promise<T>, config?: ETLConfig) => Promise<T>;
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
export declare const etlTransform: <T, U>(data: T[], transformer: (item: T) => U, config?: ETLConfig) => Promise<U[]>;
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
export declare const etlLoad: <T>(data: T[], loader: (batch: T[]) => Promise<void>, config?: ETLConfig) => Promise<void>;
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
export declare const etlPipeline: <T, U>(extractor: () => Promise<T[]>, transformer: (item: T) => U, loader: (batch: U[]) => Promise<void>, config?: ETLConfig) => Promise<void>;
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
export declare const csvToJson: (csv: string, options?: {
    delimiter?: string;
    headers?: string[];
    skipHeader?: boolean;
}) => any[];
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
export declare const parseCsvWithQuotes: (csv: string) => string[][];
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
export declare const jsonToCsv: (json: any[], options?: {
    headers?: string[];
    delimiter?: string;
    includeHeaders?: boolean;
}) => string;
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
export declare const escapeCsvValue: (value: string, delimiter?: string) => string;
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
export declare const xmlToJson: (xml: string) => any;
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
export declare const jsonToXml: (json: any, rootTag?: string) => string;
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
export declare const flattenObject: (obj: Record<string, any>, prefix?: string) => Record<string, any>;
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
export declare const unflattenObject: (obj: Record<string, any>) => Record<string, any>;
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
export declare const getNestedValue: (obj: Record<string, any>, path: string) => any;
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
export declare const setNestedValue: (obj: Record<string, any>, path: string, value: any) => void;
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
export declare const migrateSchema: (data: any, currentVersion: number, targetVersion: number, migrations: SchemaVersion[]) => any;
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
export declare const validateSchemaVersion: (data: any, version: number, validator: (data: any, version: number) => boolean) => boolean;
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
export declare const convertStringToType: (value: string, type?: string) => any;
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
export declare const convertObjectTypes: (obj: Record<string, any>, typeMap: Record<string, string>) => Record<string, any>;
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
export declare const formatDateToISO: (date: Date | string) => string;
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
export declare const formatDate: (date: Date | string, format: string) => string;
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
export declare const parseDate: (dateString: string, format: string) => Date;
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
export declare const convertCurrency: (amount: number, conversion: CurrencyConversion) => number;
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
export declare const formatCurrency: (amount: number, currency: string) => string;
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
export declare const convertUnit: (value: number, conversion: UnitConversion) => number;
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
export declare const getUnitConversion: (from: string, to: string) => UnitConversion | null;
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
export declare const aggregate: (array: any[], field: string, operation: "sum" | "avg" | "min" | "max" | "count") => number;
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
export declare const groupAndAggregate: (array: any[], groupByField: string, aggregateField: string, operation: "sum" | "avg" | "min" | "max" | "count") => Record<string, number>;
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
export declare const pivotData: (array: any[], rowKey: string, columnKey: string, valueKey: string) => any[];
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
export declare const unpivotData: (array: any[], rowKey: string, columnKeys: string[], nameKey: string, valueKey: string) => any[];
declare const _default: {
    mapObject: (source: Record<string, any>, rules: MappingRule[]) => Record<string, any>;
    deepMapObject: (source: Record<string, any>, rules: MappingRule[]) => Record<string, any>;
    batchTransform: (items: Record<string, any>[], rules: MappingRule[]) => Record<string, any>[];
    filterObjectProperties: (obj: Record<string, any>, predicate: (key: string, value: any) => boolean) => Record<string, any>;
    deepMerge: (...objects: Record<string, any>[]) => Record<string, any>;
    normalizeData: (data: any, config?: NormalizationConfig) => {
        entities: Record<string, Record<string | number, any>>;
        result: any;
    };
    normalizeArray: (array: any[], idField?: string) => Record<string | number, any>;
    removeDuplicates: (array: any[], key: string) => any[];
    groupBy: (array: any[], key: string) => Record<string, any[]>;
    denormalizeData: (normalizedData: any, entities: Record<string, Record<string | number, any>>, config?: DenormalizationConfig) => any;
    joinArrays: (left: any[], right: any[], leftKey: string, rightKey: string, type?: "inner" | "left" | "right" | "outer") => any[];
    etlExtract: <T>(extractor: () => Promise<T>, config?: ETLConfig) => Promise<T>;
    etlTransform: <T, U>(data: T[], transformer: (item: T) => U, config?: ETLConfig) => Promise<U[]>;
    etlLoad: <T>(data: T[], loader: (batch: T[]) => Promise<void>, config?: ETLConfig) => Promise<void>;
    etlPipeline: <T, U>(extractor: () => Promise<T[]>, transformer: (item: T) => U, loader: (batch: U[]) => Promise<void>, config?: ETLConfig) => Promise<void>;
    csvToJson: (csv: string, options?: {
        delimiter?: string;
        headers?: string[];
        skipHeader?: boolean;
    }) => any[];
    parseCsvWithQuotes: (csv: string) => string[][];
    jsonToCsv: (json: any[], options?: {
        headers?: string[];
        delimiter?: string;
        includeHeaders?: boolean;
    }) => string;
    escapeCsvValue: (value: string, delimiter?: string) => string;
    xmlToJson: (xml: string) => any;
    jsonToXml: (json: any, rootTag?: string) => string;
    flattenObject: (obj: Record<string, any>, prefix?: string) => Record<string, any>;
    unflattenObject: (obj: Record<string, any>) => Record<string, any>;
    getNestedValue: (obj: Record<string, any>, path: string) => any;
    setNestedValue: (obj: Record<string, any>, path: string, value: any) => void;
    migrateSchema: (data: any, currentVersion: number, targetVersion: number, migrations: SchemaVersion[]) => any;
    validateSchemaVersion: (data: any, version: number, validator: (data: any, version: number) => boolean) => boolean;
    convertStringToType: (value: string, type?: string) => any;
    convertObjectTypes: (obj: Record<string, any>, typeMap: Record<string, string>) => Record<string, any>;
    formatDateToISO: (date: Date | string) => string;
    formatDate: (date: Date | string, format: string) => string;
    parseDate: (dateString: string, format: string) => Date;
    convertCurrency: (amount: number, conversion: CurrencyConversion) => number;
    formatCurrency: (amount: number, currency: string) => string;
    convertUnit: (value: number, conversion: UnitConversion) => number;
    getUnitConversion: (from: string, to: string) => UnitConversion | null;
    aggregate: (array: any[], field: string, operation: "sum" | "avg" | "min" | "max" | "count") => number;
    groupAndAggregate: (array: any[], groupByField: string, aggregateField: string, operation: "sum" | "avg" | "min" | "max" | "count") => Record<string, number>;
    pivotData: (array: any[], rowKey: string, columnKey: string, valueKey: string) => any[];
    unpivotData: (array: any[], rowKey: string, columnKeys: string[], nameKey: string, valueKey: string) => any[];
};
export default _default;
//# sourceMappingURL=data-transformation-utils.d.ts.map