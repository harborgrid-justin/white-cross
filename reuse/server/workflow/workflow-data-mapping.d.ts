/**
 * LOC: WFDM-001
 * File: /reuse/server/workflow/workflow-data-mapping.ts
 *
 * UPSTREAM (imports from):
 *   - zod (v3.x)
 *   - @nestjs/common
 *   - jsonpath-plus
 *   - lodash
 *
 * DOWNSTREAM (imported by):
 *   - Workflow data transformation services
 *   - Process orchestration engines
 *   - Data integration adapters
 *   - ETL pipeline components
 */
/**
 * File: /reuse/server/workflow/workflow-data-mapping.ts
 * Locator: WC-SRV-WFDM-001
 * Purpose: Workflow Data Input/Output Mapping - Production-grade data transformation for workflows
 *
 * Upstream: zod v3.x, @nestjs/common, jsonpath-plus, lodash
 * Downstream: Workflow engines, data transformers, integration adapters, ETL services
 * Dependencies: Zod 3.x, NestJS 10.x, JSONPath Plus, Lodash, Node 18+, TypeScript 5.x
 * Exports: 45 production-grade functions for data mapping, transformation, validation, enrichment
 *
 * LLM Context: Enterprise-grade data mapping and transformation for White Cross healthcare platform.
 * Provides comprehensive input/output data mapping, data transformation pipelines, type conversion,
 * data validation, schema mapping, nested data handling, array mapping utilities, object flattening/nesting,
 * data enrichment, mapping templates, JSONPath queries, XPath transformations, and FHIR data mapping.
 * Optimized for HIPAA-compliant healthcare data with PHI protection, audit trails, and data lineage tracking.
 *
 * Features:
 * - Input data mapping and normalization
 * - Output data mapping and formatting
 * - Data transformation pipelines
 * - Type conversion and coercion
 * - Data validation with Zod schemas
 * - Schema-to-schema mapping
 * - Nested object mapping and flattening
 * - Array mapping and aggregation utilities
 * - Object flattening and nesting
 * - Data enrichment from multiple sources
 * - Template-based mapping engine
 * - JSONPath query execution
 * - FHIR resource mapping
 * - Data lineage tracking
 * - Performance optimization for large datasets
 */
import { z } from 'zod';
/**
 * Zod schema for data mapping configuration validation.
 */
export declare const DataMappingSchema: any;
export declare const TransformationRuleSchema: any;
export declare const DataEnrichmentSchema: any;
export declare const MappingTemplateSchema: any;
export type DataMappingInput = z.infer<typeof DataMappingSchema>;
export type TransformationRuleInput = z.infer<typeof TransformationRuleSchema>;
export type DataEnrichmentInput = z.infer<typeof DataEnrichmentSchema>;
export type MappingTemplateInput = z.infer<typeof MappingTemplateSchema>;
export interface DataMapping extends DataMappingInput {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    executionCount: number;
    lastExecutedAt?: Date;
}
export interface TransformationRule extends TransformationRuleInput {
    id: string;
    executionCount: number;
    successCount: number;
    failureCount: number;
    averageExecutionTime?: number;
}
export interface DataEnrichment extends DataEnrichmentInput {
    id: string;
    enrichmentCount: number;
    lastEnrichedAt?: Date;
    cacheHitRate?: number;
}
export interface MappingTemplate extends MappingTemplateInput {
    id: string;
    compiledTemplate?: any;
    executionCount: number;
}
export interface MappingContext {
    contextId: string;
    sourceData: any;
    targetData: any;
    metadata: Record<string, any>;
    errors: Array<{
        field: string;
        error: string;
        timestamp: Date;
    }>;
    lineage: DataLineage[];
}
export interface DataLineage {
    lineageId: string;
    sourceField: string;
    targetField: string;
    transformation: string;
    timestamp: Date;
    metadata: Record<string, any>;
}
export interface ValidationResult {
    valid: boolean;
    errors: Array<{
        path: string;
        message: string;
        code: string;
    }>;
    warnings: Array<{
        path: string;
        message: string;
    }>;
}
export interface TransformationPipeline {
    pipelineId: string;
    name: string;
    stages: TransformationStage[];
    currentStage: number;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
}
export interface TransformationStage {
    stageId: string;
    name: string;
    transformFunction: (data: any) => Promise<any>;
    validationSchema?: z.ZodSchema;
    errorHandler?: (error: Error, data: any) => Promise<any>;
}
export interface FlattenOptions {
    delimiter: string;
    maxDepth: number;
    preserveArrays: boolean;
    includeNull: boolean;
}
export interface UnflattenOptions {
    delimiter: string;
    createArrays: boolean;
    preservePrototype: boolean;
}
/**
 * Maps input data from source to target schema.
 *
 * @param {any} sourceData - Source data to map
 * @param {DataMapping} mapping - Mapping configuration
 * @returns {Promise<any>} Mapped target data
 *
 * @example
 * ```typescript
 * const mapped = await mapInputData(
 *   { firstName: 'John', lastName: 'Doe', dob: '1980-01-01' },
 *   {
 *     mappingId: 'patient-input',
 *     mappingName: 'Patient Input Mapping',
 *     mappings: [
 *       { sourcePath: 'firstName', targetPath: 'patient.name.given' },
 *       { sourcePath: 'lastName', targetPath: 'patient.name.family' },
 *       { sourcePath: 'dob', targetPath: 'patient.birthDate' }
 *     ]
 *   }
 * );
 * ```
 */
export declare const mapInputData: (sourceData: any, mapping: DataMapping) => Promise<any>;
/**
 * Normalizes input data to a standard format.
 *
 * @param {any} inputData - Raw input data
 * @param {z.ZodSchema} schema - Target schema for normalization
 * @returns {Promise<any>} Normalized data
 *
 * @example
 * ```typescript
 * const normalized = await normalizeInputData(rawData, PatientSchema);
 * ```
 */
export declare const normalizeInputData: (inputData: any, schema: z.ZodSchema) => Promise<any>;
/**
 * Validates input data against a schema.
 *
 * @param {any} inputData - Data to validate
 * @param {z.ZodSchema} schema - Validation schema
 * @returns {Promise<ValidationResult>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateInputData(patientData, PatientInputSchema);
 * if (!result.valid) {
 *   console.error('Validation errors:', result.errors);
 * }
 * ```
 */
export declare const validateInputData: (inputData: any, schema: z.ZodSchema) => Promise<ValidationResult>;
/**
 * Sanitizes input data by removing unwanted fields and values.
 *
 * @param {any} inputData - Data to sanitize
 * @param {string[]} allowedFields - List of allowed field paths
 * @param {any[]} forbiddenValues - Values to remove
 * @returns {Promise<any>} Sanitized data
 *
 * @example
 * ```typescript
 * const sanitized = await sanitizeInputData(userData, [
 *   'name', 'email', 'phone'
 * ], [null, undefined, '']);
 * ```
 */
export declare const sanitizeInputData: (inputData: any, allowedFields: string[], forbiddenValues?: any[]) => Promise<any>;
/**
 * Merges multiple input data sources with priority.
 *
 * @param {any[]} dataSources - Array of data sources (first has highest priority)
 * @returns {Promise<any>} Merged data
 *
 * @example
 * ```typescript
 * const merged = await mergeInputData([
 *   userFormData,
 *   defaultValues,
 *   systemDefaults
 * ]);
 * ```
 */
export declare const mergeInputData: (dataSources: any[]) => Promise<any>;
/**
 * Maps output data to target format.
 *
 * @param {any} internalData - Internal data representation
 * @param {DataMapping} mapping - Output mapping configuration
 * @returns {Promise<any>} Formatted output data
 *
 * @example
 * ```typescript
 * const output = await mapOutputData(workflowResult, {
 *   mappingId: 'api-response',
 *   mappingName: 'API Response Mapping',
 *   mappings: [
 *     { sourcePath: 'patient.id', targetPath: 'patientId' },
 *     { sourcePath: 'appointment.datetime', targetPath: 'scheduledAt' }
 *   ]
 * });
 * ```
 */
export declare const mapOutputData: (internalData: any, mapping: DataMapping) => Promise<any>;
/**
 * Formats output data according to specific format (JSON, XML, CSV, FHIR).
 *
 * @param {any} data - Data to format
 * @param {'JSON' | 'XML' | 'CSV' | 'FHIR' | 'HL7'} format - Output format
 * @returns {Promise<string | any>} Formatted output
 *
 * @example
 * ```typescript
 * const fhirPatient = await formatOutputData(patientData, 'FHIR');
 * ```
 */
export declare const formatOutputData: (data: any, format: "JSON" | "XML" | "CSV" | "FHIR" | "HL7") => Promise<string | any>;
/**
 * Projects output data to include only specified fields.
 *
 * @param {any} data - Source data
 * @param {string[]} fields - Fields to include in output
 * @returns {Promise<any>} Projected data
 *
 * @example
 * ```typescript
 * const projected = await projectOutputData(fullPatientRecord, [
 *   'id', 'name.given', 'name.family', 'birthDate'
 * ]);
 * ```
 */
export declare const projectOutputData: (data: any, fields: string[]) => Promise<any>;
/**
 * Serializes output data for transmission.
 *
 * @param {any} data - Data to serialize
 * @param {'JSON' | 'MSGPACK' | 'PROTOBUF' | 'AVRO'} format - Serialization format
 * @returns {Promise<Buffer | string>} Serialized data
 *
 * @example
 * ```typescript
 * const serialized = await serializeOutputData(workflowData, 'JSON');
 * ```
 */
export declare const serializeOutputData: (data: any, format: "JSON" | "MSGPACK" | "PROTOBUF" | "AVRO") => Promise<Buffer | string>;
/**
 * Aggregates output data from multiple sources.
 *
 * @param {any[]} dataItems - Array of data items to aggregate
 * @param {string} aggregationKey - Key to group by
 * @returns {Promise<Record<string, any[]>>} Aggregated data
 *
 * @example
 * ```typescript
 * const aggregated = await aggregateOutputData(appointments, 'patientId');
 * ```
 */
export declare const aggregateOutputData: (dataItems: any[], aggregationKey: string) => Promise<Record<string, any[]>>;
/**
 * Creates a data transformation pipeline with multiple stages.
 *
 * @param {string} pipelineId - Pipeline identifier
 * @param {string} name - Pipeline name
 * @param {TransformationStage[]} stages - Transformation stages
 * @returns {Promise<TransformationPipeline>} Created pipeline
 *
 * @example
 * ```typescript
 * const pipeline = await createTransformationPipeline('patient-etl', 'Patient ETL', [
 *   { stageId: 'extract', name: 'Extract', transformFunction: extractData },
 *   { stageId: 'transform', name: 'Transform', transformFunction: transformData },
 *   { stageId: 'load', name: 'Load', transformFunction: loadData }
 * ]);
 * ```
 */
export declare const createTransformationPipeline: (pipelineId: string, name: string, stages: TransformationStage[]) => Promise<TransformationPipeline>;
/**
 * Executes a transformation pipeline on data.
 *
 * @param {TransformationPipeline} pipeline - Pipeline to execute
 * @param {any} inputData - Input data
 * @returns {Promise<any>} Transformed data
 *
 * @example
 * ```typescript
 * const result = await executeTransformationPipeline(pipeline, rawPatientData);
 * ```
 */
export declare const executeTransformationPipeline: (pipeline: TransformationPipeline, inputData: any) => Promise<any>;
/**
 * Applies a transformation function to data.
 *
 * @param {any} data - Data to transform
 * @param {string} transformFunction - Name of transform function
 * @returns {Promise<any>} Transformed data
 *
 * @example
 * ```typescript
 * const transformed = await applyTransformation(dateString, 'parseDate');
 * ```
 */
export declare const applyTransformation: (data: any, transformFunction: string) => Promise<any>;
/**
 * Chains multiple transformations sequentially.
 *
 * @param {any} data - Initial data
 * @param {string[]} transformations - Array of transformation function names
 * @returns {Promise<any>} Final transformed data
 *
 * @example
 * ```typescript
 * const result = await chainTransformations(inputData, [
 *   'trim',
 *   'toUpperCase',
 *   'removeSpecialChars'
 * ]);
 * ```
 */
export declare const chainTransformations: (data: any, transformations: string[]) => Promise<any>;
/**
 * Transforms data based on conditional rules.
 *
 * @param {any} data - Data to transform
 * @param {Array<{ condition: string; transformation: string }>} rules - Conditional transformation rules
 * @returns {Promise<any>} Transformed data
 *
 * @example
 * ```typescript
 * const transformed = await conditionalTransform(patient, [
 *   { condition: 'age > 65', transformation: 'applySeniorDiscount' },
 *   { condition: 'priority === "HIGH"', transformation: 'expediteProcessing' }
 * ]);
 * ```
 */
export declare const conditionalTransform: (data: any, rules: Array<{
    condition: string;
    transformation: string;
}>) => Promise<any>;
/**
 * Converts data between types with validation.
 *
 * @param {any} value - Value to convert
 * @param {string} fromType - Source type
 * @param {string} toType - Target type
 * @returns {Promise<any>} Converted value
 *
 * @example
 * ```typescript
 * const converted = await convertType('2024-01-15', 'string', 'date');
 * ```
 */
export declare const convertType: (value: any, fromType: string, toType: string) => Promise<any>;
/**
 * Coerces data to a specific type with fallback.
 *
 * @param {any} value - Value to coerce
 * @param {string} targetType - Target type
 * @param {any} defaultValue - Default value if coercion fails
 * @returns {Promise<any>} Coerced value
 *
 * @example
 * ```typescript
 * const age = await coerceType(ageInput, 'number', 0);
 * ```
 */
export declare const coerceType: (value: any, targetType: string, defaultValue?: any) => Promise<any>;
/**
 * Parses string data to structured format.
 *
 * @param {string} data - String data to parse
 * @param {'JSON' | 'XML' | 'CSV' | 'YAML' | 'TOML'} format - Data format
 * @returns {Promise<any>} Parsed data
 *
 * @example
 * ```typescript
 * const parsed = await parseStringData(jsonString, 'JSON');
 * ```
 */
export declare const parseStringData: (data: string, format: "JSON" | "XML" | "CSV" | "YAML" | "TOML") => Promise<any>;
/**
 * Converts array data to different formats.
 *
 * @param {any[]} array - Array to convert
 * @param {'object' | 'map' | 'set' | 'csv'} format - Target format
 * @param {string} keyField - Field to use as key (for object/map)
 * @returns {Promise<any>} Converted data
 *
 * @example
 * ```typescript
 * const patientMap = await convertArray(patients, 'map', 'patientId');
 * ```
 */
export declare const convertArray: (array: any[], format: "object" | "map" | "set" | "csv", keyField?: string) => Promise<any>;
/**
 * Normalizes date/time values to standard format.
 *
 * @param {any} value - Date value to normalize
 * @param {'ISO' | 'UNIX' | 'FHIR'} format - Target format
 * @returns {Promise<string | number>} Normalized date
 *
 * @example
 * ```typescript
 * const isoDate = await normalizeDateFormat(new Date(), 'ISO');
 * ```
 */
export declare const normalizeDateFormat: (value: any, format: "ISO" | "UNIX" | "FHIR") => Promise<string | number>;
/**
 * Maps data from one schema to another.
 *
 * @param {any} sourceData - Data in source schema
 * @param {Record<string, string>} schemaMapping - Field mapping
 * @returns {Promise<any>} Data in target schema
 *
 * @example
 * ```typescript
 * const mapped = await mapSchema(legacyPatient, {
 *   'patient_first_name': 'name.given[0]',
 *   'patient_last_name': 'name.family',
 *   'dob': 'birthDate'
 * });
 * ```
 */
export declare const mapSchema: (sourceData: any, schemaMapping: Record<string, string>) => Promise<any>;
/**
 * Generates schema mapping from sample data.
 *
 * @param {any} sourceData - Source data sample
 * @param {any} targetData - Target data sample
 * @returns {Promise<DataMapping>} Generated mapping
 *
 * @example
 * ```typescript
 * const mapping = await generateSchemaMapping(sourceSample, targetSample);
 * ```
 */
export declare const generateSchemaMapping: (sourceData: any, targetData: any) => Promise<DataMapping>;
/**
 * Validates data against a schema definition.
 *
 * @param {any} data - Data to validate
 * @param {Record<string, any>} schemaDef - Schema definition
 * @returns {Promise<ValidationResult>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateAgainstSchema(patientData, patientSchemaDef);
 * ```
 */
export declare const validateAgainstSchema: (data: any, schemaDef: Record<string, any>) => Promise<ValidationResult>;
/**
 * Infers schema from sample data.
 *
 * @param {any} sampleData - Sample data
 * @returns {Promise<Record<string, any>>} Inferred schema
 *
 * @example
 * ```typescript
 * const schema = await inferSchema(patientSample);
 * ```
 */
export declare const inferSchema: (sampleData: any) => Promise<Record<string, any>>;
/**
 * Maps nested object structures recursively.
 *
 * @param {any} sourceData - Source nested data
 * @param {DataMapping} mapping - Mapping configuration
 * @param {number} maxDepth - Maximum nesting depth
 * @returns {Promise<any>} Mapped nested data
 *
 * @example
 * ```typescript
 * const mapped = await mapNestedData(complexPatientRecord, nestedMapping, 10);
 * ```
 */
export declare const mapNestedData: (sourceData: any, mapping: DataMapping, maxDepth?: number) => Promise<any>;
/**
 * Extracts nested values by JSONPath query.
 *
 * @param {any} data - Data to query
 * @param {string} jsonPath - JSONPath expression
 * @returns {Promise<any[]>} Matched values
 *
 * @example
 * ```typescript
 * const allergies = await extractNestedValue(patientRecord, '$.allergies[*].code');
 * ```
 */
export declare const extractNestedValue: (data: any, jsonPath: string) => Promise<any[]>;
/**
 * Sets nested values by path.
 *
 * @param {any} data - Target data object
 * @param {string} path - Nested path
 * @param {any} value - Value to set
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await setNestedValue(patient, 'name.given[0]', 'John');
 * ```
 */
export declare const setNestedValue: (data: any, path: string, value: any) => Promise<void>;
/**
 * Flattens deeply nested objects into single-level object.
 *
 * @param {any} data - Nested data to flatten
 * @param {FlattenOptions} options - Flattening options
 * @returns {Promise<Record<string, any>>} Flattened data
 *
 * @example
 * ```typescript
 * const flat = await flattenNestedObject(patient, {
 *   delimiter: '.',
 *   maxDepth: 5,
 *   preserveArrays: true,
 *   includeNull: false
 * });
 * ```
 */
export declare const flattenNestedObject: (data: any, options?: Partial<FlattenOptions>) => Promise<Record<string, any>>;
/**
 * Unflattens single-level object to nested structure.
 *
 * @param {Record<string, any>} flatData - Flattened data
 * @param {UnflattenOptions} options - Unflattening options
 * @returns {Promise<any>} Nested data structure
 *
 * @example
 * ```typescript
 * const nested = await unflattenObject(flatPatient, {
 *   delimiter: '.',
 *   createArrays: true,
 *   preservePrototype: false
 * });
 * ```
 */
export declare const unflattenObject: (flatData: Record<string, any>, options?: Partial<UnflattenOptions>) => Promise<any>;
/**
 * Maps each element in an array using a mapping function.
 *
 * @param {any[]} array - Source array
 * @param {DataMapping} mapping - Element mapping configuration
 * @returns {Promise<any[]>} Mapped array
 *
 * @example
 * ```typescript
 * const mappedPatients = await mapArrayElements(patients, patientMapping);
 * ```
 */
export declare const mapArrayElements: (array: any[], mapping: DataMapping) => Promise<any[]>;
/**
 * Filters array elements based on criteria.
 *
 * @param {any[]} array - Source array
 * @param {Record<string, any>} criteria - Filter criteria
 * @returns {Promise<any[]>} Filtered array
 *
 * @example
 * ```typescript
 * const highPriority = await filterArrayData(patients, { priority: 'HIGH' });
 * ```
 */
export declare const filterArrayData: (array: any[], criteria: Record<string, any>) => Promise<any[]>;
/**
 * Groups array elements by a key.
 *
 * @param {any[]} array - Source array
 * @param {string} groupByKey - Key to group by
 * @returns {Promise<Record<string, any[]>>} Grouped data
 *
 * @example
 * ```typescript
 * const byDepartment = await groupArrayData(patients, 'department');
 * ```
 */
export declare const groupArrayData: (array: any[], groupByKey: string) => Promise<Record<string, any[]>>;
/**
 * Sorts array elements by a field.
 *
 * @param {any[]} array - Source array
 * @param {string} sortField - Field to sort by
 * @param {'asc' | 'desc'} direction - Sort direction
 * @returns {Promise<any[]>} Sorted array
 *
 * @example
 * ```typescript
 * const sorted = await sortArrayData(appointments, 'scheduledAt', 'asc');
 * ```
 */
export declare const sortArrayData: (array: any[], sortField: string, direction?: "asc" | "desc") => Promise<any[]>;
/**
 * Reduces array to a single value using aggregation.
 *
 * @param {any[]} array - Source array
 * @param {string} field - Field to aggregate
 * @param {'sum' | 'avg' | 'min' | 'max' | 'count'} operation - Aggregation operation
 * @returns {Promise<number>} Aggregated result
 *
 * @example
 * ```typescript
 * const totalCharges = await reduceArrayData(invoices, 'amount', 'sum');
 * ```
 */
export declare const reduceArrayData: (array: any[], field: string, operation: "sum" | "avg" | "min" | "max" | "count") => Promise<number>;
/**
 * Enriches data with additional information from external sources.
 *
 * @param {any} data - Data to enrich
 * @param {DataEnrichment[]} enrichments - Enrichment configurations
 * @returns {Promise<any>} Enriched data
 *
 * @example
 * ```typescript
 * const enriched = await enrichData(patientData, [
 *   {
 *     enrichmentId: 'demographics',
 *     sourceField: 'patientId',
 *     enrichmentSource: 'DATABASE',
 *     enrichmentConfig: { table: 'demographics' },
 *     targetField: 'demographics',
 *     cacheEnabled: true
 *   }
 * ]);
 * ```
 */
export declare const enrichData: (data: any, enrichments: DataEnrichment[]) => Promise<any>;
/**
 * Creates a data enrichment configuration.
 *
 * @param {DataEnrichmentInput} input - Enrichment configuration
 * @returns {Promise<DataEnrichment>} Created enrichment
 *
 * @example
 * ```typescript
 * const enrichment = await createDataEnrichment({
 *   enrichmentId: 'patient-demographics',
 *   sourceField: 'patientId',
 *   enrichmentSource: 'DATABASE',
 *   enrichmentConfig: { query: 'SELECT * FROM demographics WHERE id = ?' },
 *   targetField: 'demographics',
 *   cacheEnabled: true,
 *   cacheTTL: 3600000
 * });
 * ```
 */
export declare const createDataEnrichment: (input: DataEnrichmentInput) => Promise<DataEnrichment>;
/**
 * Merges enrichment data into original data.
 *
 * @param {any} originalData - Original data
 * @param {any} enrichmentData - Enrichment data
 * @param {'MERGE' | 'REPLACE' | 'APPEND'} strategy - Merge strategy
 * @returns {Promise<any>} Merged data
 *
 * @example
 * ```typescript
 * const merged = await mergeEnrichmentData(patient, demographics, 'MERGE');
 * ```
 */
export declare const mergeEnrichmentData: (originalData: any, enrichmentData: any, strategy?: "MERGE" | "REPLACE" | "APPEND") => Promise<any>;
/**
 * Creates a mapping template for reusable transformations.
 *
 * @param {MappingTemplateInput} input - Template configuration
 * @returns {Promise<MappingTemplate>} Created template
 *
 * @example
 * ```typescript
 * const template = await createMappingTemplate({
 *   templateId: 'patient-fhir',
 *   templateName: 'Patient to FHIR',
 *   templateType: 'HANDLEBARS',
 *   template: '{"resourceType": "Patient", "id": "{{patientId}}", ...}',
 *   variables: { patientId: 'string', name: 'object' }
 * });
 * ```
 */
export declare const createMappingTemplate: (input: MappingTemplateInput) => Promise<MappingTemplate>;
/**
 * Executes a mapping template with data.
 *
 * @param {MappingTemplate} template - Template to execute
 * @param {Record<string, any>} data - Data to apply to template
 * @returns {Promise<any>} Template execution result
 *
 * @example
 * ```typescript
 * const result = await executeMappingTemplate(fhirTemplate, patientData);
 * ```
 */
export declare const executeMappingTemplate: (template: MappingTemplate, data: Record<string, any>) => Promise<any>;
/**
 * Compiles a mapping template for faster execution.
 *
 * @param {MappingTemplate} template - Template to compile
 * @returns {Promise<MappingTemplate>} Compiled template
 *
 * @example
 * ```typescript
 * const compiled = await compileMappingTemplate(template);
 * ```
 */
export declare const compileMappingTemplate: (template: MappingTemplate) => Promise<MappingTemplate>;
//# sourceMappingURL=workflow-data-mapping.d.ts.map