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

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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
export const mapObject = (
  source: Record<string, any>,
  rules: MappingRule[],
): Record<string, any> => {
  const result: Record<string, any> = {};

  for (const rule of rules) {
    const value = source[rule.source];
    const transformedValue = rule.transform ? rule.transform(value) : value;
    result[rule.target] = transformedValue !== undefined ? transformedValue : rule.default;
  }

  return result;
};

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
export const deepMapObject = (
  source: Record<string, any>,
  rules: MappingRule[],
): Record<string, any> => {
  const result: Record<string, any> = {};

  for (const rule of rules) {
    const value = getNestedValue(source, rule.source);
    const transformedValue = rule.transform ? rule.transform(value) : value;
    setNestedValue(result, rule.target, transformedValue !== undefined ? transformedValue : rule.default);
  }

  return result;
};

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
export const batchTransform = (
  items: Record<string, any>[],
  rules: MappingRule[],
): Record<string, any>[] => {
  return items.map((item) => mapObject(item, rules));
};

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
export const filterObjectProperties = (
  obj: Record<string, any>,
  predicate: (key: string, value: any) => boolean,
): Record<string, any> => {
  const result: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (predicate(key, value)) {
      result[key] = value;
    }
  }

  return result;
};

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
export const deepMerge = (...objects: Record<string, any>[]): Record<string, any> => {
  const result: Record<string, any> = {};

  for (const obj of objects) {
    for (const [key, value] of Object.entries(obj)) {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        result[key] = deepMerge(result[key] || {}, value);
      } else {
        result[key] = value;
      }
    }
  }

  return result;
};

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
export const normalizeData = (data: any, config?: NormalizationConfig) => {
  const entities: Record<string, Record<string | number, any>> = {};
  const idField = config?.idField || 'id';

  const normalize = (item: any, entityType: string): any => {
    if (Array.isArray(item)) {
      return item.map((i) => normalize(i, entityType));
    }

    if (!item || typeof item !== 'object') {
      return item;
    }

    const id = item[idField];
    if (!id) return item;

    if (!entities[entityType]) {
      entities[entityType] = {};
    }

    const normalized: any = { [idField]: id };

    for (const [key, value] of Object.entries(item)) {
      if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
        normalized[key] = normalize(value, key).map((v: any) => v[idField]);
      } else if (value && typeof value === 'object' && value[idField]) {
        normalized[key] = normalize(value, key)[idField];
      } else {
        normalized[key] = value;
      }
    }

    entities[entityType][id] = normalized;
    return normalized;
  };

  const result = normalize(data, 'items');
  return { entities, result: Array.isArray(data) ? result.map((r: any) => r[idField]) : result[idField] };
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
export const normalizeArray = (
  array: any[],
  idField: string = 'id',
): Record<string | number, any> => {
  const result: Record<string | number, any> = {};

  for (const item of array) {
    const id = item[idField];
    if (id !== undefined) {
      result[id] = item;
    }
  }

  return result;
};

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
export const removeDuplicates = (array: any[], key: string): any[] => {
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
export const groupBy = (array: any[], key: string): Record<string, any[]> => {
  return array.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, any[]>);
};

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
export const denormalizeData = (
  normalizedData: any,
  entities: Record<string, Record<string | number, any>>,
  config?: DenormalizationConfig,
): any => {
  const maxDepth = config?.maxDepth || 5;
  const include = config?.include;

  const denormalize = (data: any, depth: number = 0): any => {
    if (depth >= maxDepth) return data;
    if (!data || typeof data !== 'object') return data;

    if (Array.isArray(data)) {
      return data.map((item) => denormalize(item, depth + 1));
    }

    const result: any = { ...data };

    for (const [key, value] of Object.entries(data)) {
      if (include && !include.includes(key)) continue;

      if (Array.isArray(value)) {
        const entityType = key;
        if (entities[entityType]) {
          result[key] = value.map((id) => denormalize(entities[entityType][id], depth + 1));
        }
      } else if (typeof value === 'number' || typeof value === 'string') {
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
export const joinArrays = (
  left: any[],
  right: any[],
  leftKey: string,
  rightKey: string,
  type: 'inner' | 'left' | 'right' | 'outer' = 'inner',
): any[] => {
  const rightMap = new Map(right.map((item) => [item[rightKey], item]));
  const result: any[] = [];
  const matched = new Set();

  for (const leftItem of left) {
    const rightItem = rightMap.get(leftItem[leftKey]);
    if (rightItem) {
      result.push({ ...leftItem, ...rightItem });
      matched.add(leftItem[leftKey]);
    } else if (type === 'left' || type === 'outer') {
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
export const etlExtract = async <T>(
  extractor: () => Promise<T>,
  config?: ETLConfig,
): Promise<T> => {
  try {
    const data = await extractor();
    if (config?.validateInput && !data) {
      throw new Error('Extraction returned no data');
    }
    return data;
  } catch (error) {
    if (config?.onError === 'skip') return [] as unknown as T;
    if (config?.onError === 'log') console.error('ETL Extract Error:', error);
    throw error;
  }
};

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
export const etlTransform = async <T, U>(
  data: T[],
  transformer: (item: T) => U,
  config?: ETLConfig,
): Promise<U[]> => {
  const batchSize = config?.batchSize || 1000;
  const result: U[] = [];

  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    try {
      const transformed = batch.map(transformer);
      result.push(...transformed);
    } catch (error) {
      if (config?.onError === 'stop') throw error;
      if (config?.onError === 'log') console.error(`ETL Transform Error (batch ${i}):`, error);
    }
  }

  return result;
};

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
export const etlLoad = async <T>(
  data: T[],
  loader: (batch: T[]) => Promise<void>,
  config?: ETLConfig,
): Promise<void> => {
  const batchSize = config?.batchSize || 1000;

  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    try {
      if (config?.validateOutput && batch.length === 0) {
        throw new Error('Empty batch');
      }
      await loader(batch);
    } catch (error) {
      if (config?.onError === 'stop') throw error;
      if (config?.onError === 'log') console.error(`ETL Load Error (batch ${i}):`, error);
    }
  }
};

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
export const etlPipeline = async <T, U>(
  extractor: () => Promise<T[]>,
  transformer: (item: T) => U,
  loader: (batch: U[]) => Promise<void>,
  config?: ETLConfig,
): Promise<void> => {
  const extracted = await etlExtract(extractor, config);
  const transformed = await etlTransform(extracted, transformer, config);
  await etlLoad(transformed, loader, config);
};

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
export const csvToJson = (
  csv: string,
  options?: { delimiter?: string; headers?: string[]; skipHeader?: boolean },
): any[] => {
  const delimiter = options?.delimiter || ',';
  const lines = csv.trim().split('\n');
  const headers = options?.headers || lines[0].split(delimiter).map((h) => h.trim());
  const startIndex = options?.skipHeader ? 1 : options?.headers ? 0 : 1;

  return lines.slice(startIndex).map((line) => {
    const values = line.split(delimiter).map((v) => v.trim());
    const obj: any = {};
    headers.forEach((header, index) => {
      obj[header] = values[index];
    });
    return obj;
  });
};

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
export const parseCsvWithQuotes = (csv: string): string[][] => {
  const rows: string[][] = [];
  const lines = csv.split('\n');

  for (const line of lines) {
    const row: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        row.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    row.push(current.trim());
    rows.push(row);
  }

  return rows;
};

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
export const jsonToCsv = (
  json: any[],
  options?: { headers?: string[]; delimiter?: string; includeHeaders?: boolean },
): string => {
  if (json.length === 0) return '';

  const delimiter = options?.delimiter || ',';
  const headers = options?.headers || Object.keys(json[0]);
  const includeHeaders = options?.includeHeaders !== false;

  const csvRows: string[] = [];

  if (includeHeaders) {
    csvRows.push(headers.join(delimiter));
  }

  for (const item of json) {
    const row = headers.map((header) => {
      const value = item[header];
      return escapeCsvValue(String(value ?? ''), delimiter);
    });
    csvRows.push(row.join(delimiter));
  }

  return csvRows.join('\n');
};

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
export const escapeCsvValue = (value: string, delimiter: string = ','): string => {
  if (value.includes(delimiter) || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
};

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
export const xmlToJson = (xml: string): any => {
  const parseNode = (node: string): any => {
    const tagMatch = node.match(/<(\w+)>(.*?)<\/\1>/s);
    if (!tagMatch) return node.trim();

    const [, tagName, content] = tagMatch;
    const children = content.match(/<\w+>.*?<\/\w+>/gs);

    if (!children) {
      return { [tagName]: content.trim() };
    }

    const result: any = {};
    for (const child of children) {
      const childObj = parseNode(child);
      const childKey = Object.keys(childObj)[0];
      if (result[childKey]) {
        if (Array.isArray(result[childKey])) {
          result[childKey].push(childObj[childKey]);
        } else {
          result[childKey] = [result[childKey], childObj[childKey]];
        }
      } else {
        Object.assign(result, childObj);
      }
    }

    return { [tagName]: result };
  };

  return parseNode(xml);
};

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
export const jsonToXml = (json: any, rootTag: string = 'root'): string => {
  const buildXml = (obj: any): string => {
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
      } else {
        xml += `<${key}>${buildXml(value)}</${key}>`;
      }
    }
    return xml;
  };

  return `<${rootTag}>${buildXml(json)}</${rootTag}>`;
};

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
export const flattenObject = (
  obj: Record<string, any>,
  prefix: string = '',
): Record<string, any> => {
  const result: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
      Object.assign(result, flattenObject(value, newKey));
    } else {
      result[newKey] = value;
    }
  }

  return result;
};

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
export const unflattenObject = (obj: Record<string, any>): Record<string, any> => {
  const result: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    setNestedValue(result, key, value);
  }

  return result;
};

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
export const getNestedValue = (obj: Record<string, any>, path: string): any => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

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
export const setNestedValue = (obj: Record<string, any>, path: string, value: any): void => {
  const keys = path.split('.');
  const lastKey = keys.pop()!;
  const target = keys.reduce((current, key) => {
    if (!current[key]) current[key] = {};
    return current[key];
  }, obj);
  target[lastKey] = value;
};

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
export const migrateSchema = (
  data: any,
  currentVersion: number,
  targetVersion: number,
  migrations: SchemaVersion[],
): any => {
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
export const validateSchemaVersion = (
  data: any,
  version: number,
  validator: (data: any, version: number) => boolean,
): boolean => {
  return validator(data, version);
};

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
export const convertStringToType = (value: string, type?: string): any => {
  if (!type) {
    // Auto-detect type
    if (value === 'true' || value === 'false') return value === 'true';
    if (!isNaN(Number(value)) && value.trim() !== '') return Number(value);
    if (value.match(/^\d{4}-\d{2}-\d{2}/)) return new Date(value);
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
export const convertObjectTypes = (
  obj: Record<string, any>,
  typeMap: Record<string, string>,
): Record<string, any> => {
  const result: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    result[key] = typeMap[key] ? convertStringToType(String(value), typeMap[key]) : value;
  }

  return result;
};

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
export const formatDateToISO = (date: Date | string): string => {
  return new Date(date).toISOString();
};

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
export const formatDate = (date: Date | string, format: string): string => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day);
};

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
export const parseDate = (dateString: string, format: string): Date => {
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
export const convertCurrency = (amount: number, conversion: CurrencyConversion): number => {
  return Math.round(amount * conversion.rate * 100) / 100;
};

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
export const formatCurrency = (amount: number, currency: string): string => {
  const symbols: Record<string, string> = {
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
export const convertUnit = (value: number, conversion: UnitConversion): number => {
  const offset = conversion.offset || 0;
  return (value + offset) * conversion.factor;
};

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
export const getUnitConversion = (from: string, to: string): UnitConversion | null => {
  const conversions: Record<string, Record<string, UnitConversion>> = {
    kg: { lb: { from: 'kg', to: 'lb', factor: 2.20462 } },
    lb: { kg: { from: 'lb', to: 'kg', factor: 0.453592 } },
    m: { ft: { from: 'm', to: 'ft', factor: 3.28084 } },
    ft: { m: { from: 'ft', to: 'm', factor: 0.3048 } },
  };

  return conversions[from]?.[to] || null;
};

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
export const aggregate = (
  array: any[],
  field: string,
  operation: 'sum' | 'avg' | 'min' | 'max' | 'count',
): number => {
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
export const groupAndAggregate = (
  array: any[],
  groupByField: string,
  aggregateField: string,
  operation: 'sum' | 'avg' | 'min' | 'max' | 'count',
): Record<string, number> => {
  const grouped = groupBy(array, groupByField);
  const result: Record<string, number> = {};

  for (const [key, items] of Object.entries(grouped)) {
    result[key] = aggregate(items, aggregateField, operation);
  }

  return result;
};

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
export const pivotData = (
  array: any[],
  rowKey: string,
  columnKey: string,
  valueKey: string,
): any[] => {
  const pivoted = new Map<string, any>();

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
export const unpivotData = (
  array: any[],
  rowKey: string,
  columnKeys: string[],
  nameKey: string,
  valueKey: string,
): any[] => {
  const result: any[] = [];

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

export default {
  // Object mapping
  mapObject,
  deepMapObject,
  batchTransform,
  filterObjectProperties,
  deepMerge,

  // Normalization
  normalizeData,
  normalizeArray,
  removeDuplicates,
  groupBy,

  // Denormalization
  denormalizeData,
  joinArrays,

  // ETL
  etlExtract,
  etlTransform,
  etlLoad,
  etlPipeline,

  // CSV
  csvToJson,
  parseCsvWithQuotes,
  jsonToCsv,
  escapeCsvValue,

  // XML
  xmlToJson,
  jsonToXml,

  // Flatten/Unflatten
  flattenObject,
  unflattenObject,
  getNestedValue,
  setNestedValue,

  // Schema migration
  migrateSchema,
  validateSchemaVersion,

  // Type conversion
  convertStringToType,
  convertObjectTypes,

  // Date formatting
  formatDateToISO,
  formatDate,
  parseDate,

  // Currency
  convertCurrency,
  formatCurrency,

  // Units
  convertUnit,
  getUnitConversion,

  // Aggregation
  aggregate,
  groupAndAggregate,

  // Pivoting
  pivotData,
  unpivotData,
};
