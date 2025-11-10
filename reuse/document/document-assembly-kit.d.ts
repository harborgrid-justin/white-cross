/**
 * LOC: DOC-ASM-001
 * File: /reuse/document/document-assembly-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - handlebars
 *   - mustache
 *   - crypto (Node.js)
 *   - sequelize (v6.x)
 *   - pdf-lib
 *   - docx
 *
 * DOWNSTREAM (imported by):
 *   - Document generation controllers
 *   - Template management services
 *   - Report generation modules
 *   - Healthcare document automation
 */
/**
 * File: /reuse/document/document-assembly-kit.ts
 * Locator: WC-UTL-DOCASM-001
 * Purpose: Document Assembly & Template Engine - Template creation, merge fields, conditional content, dynamic tables, formula calculations
 *
 * Upstream: @nestjs/common, handlebars, mustache, crypto, sequelize, pdf-lib, docx
 * Downstream: Document generators, template services, report modules, automation handlers
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, Handlebars 4.x, pdf-lib 1.17.x
 * Exports: 42 utility functions for template assembly, merge fields, conditional logic, dynamic tables, formulas, versioning
 *
 * LLM Context: Production-grade document assembly utilities for White Cross healthcare platform.
 * Provides advanced template management exceeding Adobe Acrobat capabilities: dynamic merge fields,
 * conditional content rendering, table generation from datasets, formula calculations, template versioning,
 * multi-format support (PDF, DOCX, HTML), nested template composition, real-time field validation,
 * expression evaluation, data transformation pipelines, and audit trails. Essential for automated
 * generation of medical reports, patient forms, insurance claims, consent documents, and regulatory filings.
 */
import { Sequelize } from 'sequelize';
/**
 * Template format types
 */
export type TemplateFormat = 'PDF' | 'DOCX' | 'HTML' | 'MARKDOWN' | 'XML' | 'JSON';
/**
 * Merge field data types
 */
export type MergeFieldType = 'string' | 'number' | 'boolean' | 'date' | 'datetime' | 'currency' | 'email' | 'phone' | 'url' | 'array' | 'object';
/**
 * Conditional operator types
 */
export type ConditionalOperator = 'equals' | 'notEquals' | 'contains' | 'notContains' | 'greaterThan' | 'lessThan' | 'greaterThanOrEqual' | 'lessThanOrEqual' | 'isEmpty' | 'isNotEmpty' | 'matches' | 'in' | 'notIn';
/**
 * Formula function types
 */
export type FormulaFunction = 'SUM' | 'AVG' | 'COUNT' | 'MIN' | 'MAX' | 'ROUND' | 'CONCAT' | 'IF' | 'DATE_FORMAT' | 'UPPER' | 'LOWER' | 'TRIM' | 'SUBSTRING';
/**
 * Template assembly configuration
 */
export interface TemplateConfig {
    format: TemplateFormat;
    templateContent: string | Buffer;
    encoding?: BufferEncoding;
    preserveFormatting?: boolean;
    strictMode?: boolean;
    allowScripts?: boolean;
    maxNestingDepth?: number;
    cacheEnabled?: boolean;
    validationRules?: ValidationRule[];
}
/**
 * Merge field definition
 */
export interface MergeFieldDefinition {
    name: string;
    type: MergeFieldType;
    path?: string;
    required?: boolean;
    defaultValue?: any;
    format?: string;
    validation?: ValidationRule;
    transform?: TransformFunction;
    description?: string;
}
/**
 * Validation rule for merge fields
 */
export interface ValidationRule {
    type: 'regex' | 'range' | 'length' | 'custom';
    pattern?: string | RegExp;
    min?: number;
    max?: number;
    customValidator?: (value: any) => boolean | Promise<boolean>;
    errorMessage?: string;
}
/**
 * Transform function for data manipulation
 */
export interface TransformFunction {
    type: 'uppercase' | 'lowercase' | 'capitalize' | 'trim' | 'format' | 'custom';
    customFunction?: (value: any, context?: any) => any;
    parameters?: Record<string, any>;
}
/**
 * Conditional content rule
 */
export interface ConditionalRule {
    id?: string;
    fieldName: string;
    operator: ConditionalOperator;
    value: any;
    logicalOperator?: 'AND' | 'OR';
    nestedRules?: ConditionalRule[];
    content: string;
    elseContent?: string;
}
/**
 * Dynamic table configuration
 */
export interface DynamicTableConfig {
    dataSource: any[];
    columns: TableColumn[];
    headerStyle?: TableStyle;
    rowStyle?: TableStyle;
    alternateRowStyle?: TableStyle;
    showHeader?: boolean;
    showFooter?: boolean;
    footerContent?: Record<string, any>;
    pagination?: {
        enabled: boolean;
        pageSize: number;
        currentPage?: number;
    };
    sorting?: {
        column: string;
        direction: 'ASC' | 'DESC';
    };
}
/**
 * Table column definition
 */
export interface TableColumn {
    field: string;
    header: string;
    width?: number | string;
    align?: 'left' | 'center' | 'right';
    format?: string;
    formula?: FormulaExpression;
    transform?: TransformFunction;
    cellStyle?: TableStyle;
}
/**
 * Table styling configuration
 */
export interface TableStyle {
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: 'normal' | 'bold';
    fontStyle?: 'normal' | 'italic';
    color?: string;
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    padding?: number | {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
    alignment?: 'left' | 'center' | 'right';
}
/**
 * Formula expression
 */
export interface FormulaExpression {
    expression: string;
    function: FormulaFunction;
    arguments: Array<string | number | FormulaExpression>;
    contextFields?: string[];
}
/**
 * Template assembly context
 */
export interface AssemblyContext {
    data: Record<string, any>;
    locale?: string;
    timezone?: string;
    formatters?: Record<string, (value: any) => string>;
    helpers?: Record<string, (...args: any[]) => any>;
    partials?: Record<string, string>;
    metadata?: Record<string, any>;
}
/**
 * Template version information
 */
export interface TemplateVersion {
    version: string;
    createdBy: string;
    createdAt: Date;
    changelog?: string;
    deprecated?: boolean;
    deprecationReason?: string;
    migrationPath?: string;
}
/**
 * Template compilation result
 */
export interface CompiledTemplate {
    templateId: string;
    compiledContent: any;
    mergeFields: MergeFieldDefinition[];
    conditionalRules: ConditionalRule[];
    formulas: FormulaExpression[];
    format: TemplateFormat;
    cacheKey?: string;
    compiledAt: Date;
}
/**
 * Document assembly result
 */
export interface AssemblyResult {
    documentId: string;
    content: Buffer | string;
    format: TemplateFormat;
    mergedFields: Record<string, any>;
    errors?: AssemblyError[];
    warnings?: AssemblyWarning[];
    metadata: {
        templateId: string;
        templateVersion: string;
        assembledAt: Date;
        assembledBy?: string;
        dataHash: string;
    };
}
/**
 * Assembly error information
 */
export interface AssemblyError {
    code: string;
    message: string;
    field?: string;
    severity: 'error' | 'critical';
    details?: any;
}
/**
 * Assembly warning information
 */
export interface AssemblyWarning {
    code: string;
    message: string;
    field?: string;
    suggestion?: string;
}
/**
 * Template comparison result
 */
export interface TemplateComparison {
    version1: string;
    version2: string;
    differences: Array<{
        type: 'added' | 'removed' | 'modified';
        path: string;
        oldValue?: any;
        newValue?: any;
    }>;
    compatibilityScore: number;
    breakingChanges: boolean;
}
/**
 * Field mapping configuration
 */
export interface FieldMapping {
    sourceField: string;
    targetField: string;
    transform?: TransformFunction;
    required?: boolean;
    defaultValue?: any;
}
/**
 * Template inheritance configuration
 */
export interface TemplateInheritance {
    baseTemplateId: string;
    overrides?: Record<string, any>;
    extensionPoints?: Record<string, string>;
    mergeStrategy?: 'replace' | 'append' | 'merge';
}
/**
 * Nested template reference
 */
export interface NestedTemplate {
    templateId: string;
    placeholderName: string;
    context?: Record<string, any>;
    condition?: ConditionalRule;
}
/**
 * Document template model attributes
 */
export interface DocumentTemplateAttributes {
    id: string;
    name: string;
    description?: string;
    format: string;
    category?: string;
    templateContent: Buffer;
    compiledTemplate?: any;
    version: string;
    isActive: boolean;
    isPublished: boolean;
    baseTemplateId?: string;
    createdBy: string;
    modifiedBy?: string;
    metadata?: Record<string, any>;
    tags?: string[];
    accessControl?: Record<string, any>;
    retentionPeriod?: number;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Merge field model attributes
 */
export interface MergeFieldAttributes {
    id: string;
    templateId: string;
    name: string;
    fieldType: string;
    path?: string;
    required: boolean;
    defaultValue?: any;
    format?: string;
    validationRules?: Record<string, any>;
    transformRules?: Record<string, any>;
    description?: string;
    displayOrder: number;
    isActive: boolean;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Conditional rule model attributes
 */
export interface ConditionalRuleAttributes {
    id: string;
    templateId: string;
    name: string;
    fieldName: string;
    operator: string;
    value: any;
    logicalOperator?: string;
    parentRuleId?: string;
    content: string;
    elseContent?: string;
    displayOrder: number;
    isActive: boolean;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates DocumentTemplate model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<DocumentTemplateAttributes>>} DocumentTemplate model
 *
 * @example
 * ```typescript
 * const TemplateModel = createDocumentTemplateModel(sequelize);
 * const template = await TemplateModel.create({
 *   name: 'Patient Consent Form',
 *   format: 'PDF',
 *   templateContent: Buffer.from(templateData),
 *   version: '1.0.0',
 *   createdBy: 'user-uuid',
 *   isActive: true,
 *   isPublished: false
 * });
 * ```
 */
export declare const createDocumentTemplateModel: (sequelize: Sequelize) => any;
/**
 * Creates MergeField model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<MergeFieldAttributes>>} MergeField model
 *
 * @example
 * ```typescript
 * const FieldModel = createMergeFieldModel(sequelize);
 * const field = await FieldModel.create({
 *   templateId: 'template-uuid',
 *   name: 'patientName',
 *   fieldType: 'string',
 *   required: true,
 *   displayOrder: 1
 * });
 * ```
 */
export declare const createMergeFieldModel: (sequelize: Sequelize) => any;
/**
 * Creates ConditionalRule model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<ConditionalRuleAttributes>>} ConditionalRule model
 *
 * @example
 * ```typescript
 * const RuleModel = createConditionalRuleModel(sequelize);
 * const rule = await RuleModel.create({
 *   templateId: 'template-uuid',
 *   name: 'Show Insurance Section',
 *   fieldName: 'hasInsurance',
 *   operator: 'equals',
 *   value: true,
 *   content: '{{insuranceDetails}}',
 *   displayOrder: 1
 * });
 * ```
 */
export declare const createConditionalRuleModel: (sequelize: Sequelize) => any;
/**
 * 1. Creates new document template.
 *
 * @param {TemplateConfig} config - Template configuration
 * @param {string} name - Template name
 * @param {string} createdBy - User ID creating template
 * @returns {Promise<CompiledTemplate>} Compiled template
 *
 * @example
 * ```typescript
 * const template = await createTemplate({
 *   format: 'PDF',
 *   templateContent: '<html><body>Hello {{patientName}}</body></html>',
 *   strictMode: true
 * }, 'Patient Welcome Letter', 'user-123');
 * ```
 */
export declare const createTemplate: (config: TemplateConfig, name: string, createdBy: string) => Promise<CompiledTemplate>;
/**
 * 2. Compiles template with validation.
 *
 * @param {string} templateContent - Raw template content
 * @param {TemplateFormat} format - Template format
 * @returns {Promise<{ compiled: any; errors: AssemblyError[] }>} Compilation result
 *
 * @example
 * ```typescript
 * const result = await compileTemplate(templateString, 'HTML');
 * if (result.errors.length === 0) {
 *   console.log('Template compiled successfully');
 * }
 * ```
 */
export declare const compileTemplate: (templateContent: string, format: TemplateFormat) => Promise<{
    compiled: any;
    errors: AssemblyError[];
}>;
/**
 * 3. Extracts merge fields from template.
 *
 * @param {string} templateContent - Template content
 * @returns {MergeFieldDefinition[]} Discovered merge fields
 *
 * @example
 * ```typescript
 * const fields = extractMergeFields('Hello {{firstName}} {{lastName}}');
 * // Returns: [{ name: 'firstName', type: 'string' }, { name: 'lastName', type: 'string' }]
 * ```
 */
export declare const extractMergeFields: (templateContent: string) => MergeFieldDefinition[];
/**
 * 4. Validates template structure.
 *
 * @param {string} templateContent - Template content
 * @param {TemplateFormat} format - Template format
 * @returns {Promise<{ valid: boolean; errors: AssemblyError[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateTemplateStructure(template, 'HTML');
 * if (!validation.valid) {
 *   console.error('Validation errors:', validation.errors);
 * }
 * ```
 */
export declare const validateTemplateStructure: (templateContent: string, format: TemplateFormat) => Promise<{
    valid: boolean;
    errors: AssemblyError[];
}>;
/**
 * 5. Clones existing template with modifications.
 *
 * @param {string} sourceTemplateId - Source template ID
 * @param {string} newName - New template name
 * @param {Partial<TemplateConfig>} modifications - Modifications to apply
 * @returns {Promise<CompiledTemplate>} Cloned template
 *
 * @example
 * ```typescript
 * const cloned = await cloneTemplate('template-123', 'Modified Patient Form', {
 *   strictMode: false
 * });
 * ```
 */
export declare const cloneTemplate: (sourceTemplateId: string, newName: string, modifications?: Partial<TemplateConfig>) => Promise<CompiledTemplate>;
/**
 * 6. Creates template from base with inheritance.
 *
 * @param {TemplateInheritance} inheritance - Inheritance configuration
 * @param {string} name - New template name
 * @returns {Promise<CompiledTemplate>} Inherited template
 *
 * @example
 * ```typescript
 * const inherited = await createInheritedTemplate({
 *   baseTemplateId: 'base-template-123',
 *   overrides: { header: 'Custom Header' },
 *   mergeStrategy: 'merge'
 * }, 'Custom Patient Form');
 * ```
 */
export declare const createInheritedTemplate: (inheritance: TemplateInheritance, name: string) => Promise<CompiledTemplate>;
/**
 * 7. Imports template from external source.
 *
 * @param {Buffer | string} content - Template content
 * @param {TemplateFormat} sourceFormat - Source format
 * @param {TemplateFormat} targetFormat - Target format
 * @returns {Promise<CompiledTemplate>} Imported and converted template
 *
 * @example
 * ```typescript
 * const imported = await importTemplate(wordDocBuffer, 'DOCX', 'HTML');
 * ```
 */
export declare const importTemplate: (content: Buffer | string, sourceFormat: TemplateFormat, targetFormat: TemplateFormat) => Promise<CompiledTemplate>;
/**
 * 8. Registers merge field with validation.
 *
 * @param {string} templateId - Template ID
 * @param {MergeFieldDefinition} field - Field definition
 * @returns {Promise<string>} Field ID
 *
 * @example
 * ```typescript
 * const fieldId = await registerMergeField('template-123', {
 *   name: 'patientDOB',
 *   type: 'date',
 *   required: true,
 *   format: 'MM/DD/YYYY',
 *   validation: {
 *     type: 'range',
 *     min: new Date('1900-01-01').getTime(),
 *     max: Date.now()
 *   }
 * });
 * ```
 */
export declare const registerMergeField: (templateId: string, field: MergeFieldDefinition) => Promise<string>;
/**
 * 9. Maps data to merge fields.
 *
 * @param {Record<string, any>} data - Source data
 * @param {MergeFieldDefinition[]} fields - Field definitions
 * @returns {Promise<{ mapped: Record<string, any>; errors: AssemblyError[] }>} Mapping result
 *
 * @example
 * ```typescript
 * const result = await mapDataToFields(
 *   { patient: { firstName: 'John', lastName: 'Doe' } },
 *   [{ name: 'patientName', path: 'patient.firstName' }]
 * );
 * ```
 */
export declare const mapDataToFields: (data: Record<string, any>, fields: MergeFieldDefinition[]) => Promise<{
    mapped: Record<string, any>;
    errors: AssemblyError[];
}>;
/**
 * 10. Validates field data against rules.
 *
 * @param {string} fieldName - Field name
 * @param {any} value - Field value
 * @param {ValidationRule} rule - Validation rule
 * @returns {Promise<{ valid: boolean; error?: string }>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateFieldData('email', 'test@example.com', {
 *   type: 'regex',
 *   pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
 *   errorMessage: 'Invalid email format'
 * });
 * ```
 */
export declare const validateFieldData: (fieldName: string, value: any, rule: ValidationRule) => Promise<{
    valid: boolean;
    error?: string;
}>;
/**
 * 11. Transforms field value using transform function.
 *
 * @param {any} value - Original value
 * @param {TransformFunction} transform - Transform configuration
 * @param {any} [context] - Additional context
 * @returns {any} Transformed value
 *
 * @example
 * ```typescript
 * const transformed = transformFieldValue('john doe', {
 *   type: 'capitalize'
 * });
 * // Returns: 'John Doe'
 * ```
 */
export declare const transformFieldValue: (value: any, transform: TransformFunction, context?: any) => any;
/**
 * 12. Resolves nested field paths (JSONPath).
 *
 * @param {Record<string, any>} data - Data object
 * @param {string} path - JSON path (e.g., 'patient.address.city')
 * @returns {any} Resolved value
 *
 * @example
 * ```typescript
 * const value = resolveFieldPath(
 *   { patient: { address: { city: 'San Francisco' } } },
 *   'patient.address.city'
 * );
 * // Returns: 'San Francisco'
 * ```
 */
export declare const resolveFieldPath: (data: Record<string, any>, path: string) => any;
/**
 * 13. Creates field mapping schema.
 *
 * @param {FieldMapping[]} mappings - Field mappings
 * @returns {Record<string, FieldMapping>} Mapping schema
 *
 * @example
 * ```typescript
 * const schema = createFieldMappingSchema([
 *   { sourceField: 'fname', targetField: 'firstName', required: true },
 *   { sourceField: 'lname', targetField: 'lastName', required: true }
 * ]);
 * ```
 */
export declare const createFieldMappingSchema: (mappings: FieldMapping[]) => Record<string, FieldMapping>;
/**
 * 14. Applies field mapping schema to data.
 *
 * @param {Record<string, any>} data - Source data
 * @param {Record<string, FieldMapping>} schema - Mapping schema
 * @returns {Promise<Record<string, any>>} Mapped data
 *
 * @example
 * ```typescript
 * const mapped = await applyFieldMapping(
 *   { fname: 'John', lname: 'Doe' },
 *   schema
 * );
 * // Returns: { firstName: 'John', lastName: 'Doe' }
 * ```
 */
export declare const applyFieldMapping: (data: Record<string, any>, schema: Record<string, FieldMapping>) => Promise<Record<string, any>>;
/**
 * 15. Evaluates conditional rule.
 *
 * @param {ConditionalRule} rule - Conditional rule
 * @param {Record<string, any>} data - Data context
 * @returns {boolean} True if condition is met
 *
 * @example
 * ```typescript
 * const shouldShow = evaluateConditionalRule({
 *   fieldName: 'age',
 *   operator: 'greaterThan',
 *   value: 18,
 *   content: 'Adult content'
 * }, { age: 25 });
 * // Returns: true
 * ```
 */
export declare const evaluateConditionalRule: (rule: ConditionalRule, data: Record<string, any>) => boolean;
/**
 * 16. Processes nested conditional rules with AND/OR logic.
 *
 * @param {ConditionalRule[]} rules - Array of conditional rules
 * @param {Record<string, any>} data - Data context
 * @returns {boolean} Combined evaluation result
 *
 * @example
 * ```typescript
 * const result = processNestedConditionals([
 *   { fieldName: 'age', operator: 'greaterThan', value: 18, logicalOperator: 'AND' },
 *   { fieldName: 'hasInsurance', operator: 'equals', value: true }
 * ], { age: 25, hasInsurance: true });
 * // Returns: true
 * ```
 */
export declare const processNestedConditionals: (rules: ConditionalRule[], data: Record<string, any>) => boolean;
/**
 * 17. Renders conditional content based on rules.
 *
 * @param {ConditionalRule} rule - Conditional rule
 * @param {Record<string, any>} data - Data context
 * @returns {string} Rendered content
 *
 * @example
 * ```typescript
 * const content = renderConditionalContent({
 *   fieldName: 'vip',
 *   operator: 'equals',
 *   value: true,
 *   content: 'VIP Patient',
 *   elseContent: 'Standard Patient'
 * }, { vip: true });
 * // Returns: 'VIP Patient'
 * ```
 */
export declare const renderConditionalContent: (rule: ConditionalRule, data: Record<string, any>) => string;
/**
 * 18. Creates complex conditional expression.
 *
 * @param {string} expression - Conditional expression (e.g., '(A AND B) OR C')
 * @param {Record<string, boolean>} variables - Variable values
 * @returns {boolean} Expression result
 *
 * @example
 * ```typescript
 * const result = createConditionalExpression(
 *   '(hasInsurance AND age > 18) OR isVIP',
 *   { hasInsurance: true, ageOver18: true, isVIP: false }
 * );
 * ```
 */
export declare const createConditionalExpression: (expression: string, variables: Record<string, boolean>) => boolean;
/**
 * 19. Applies conditional formatting to content.
 *
 * @param {string} content - Content to format
 * @param {ConditionalRule} rule - Formatting rule
 * @param {Record<string, any>} data - Data context
 * @returns {string} Formatted content
 *
 * @example
 * ```typescript
 * const formatted = applyConditionalFormatting(
 *   'Patient Status',
 *   { fieldName: 'critical', operator: 'equals', value: true, content: 'style="color:red"' },
 *   { critical: true }
 * );
 * ```
 */
export declare const applyConditionalFormatting: (content: string, rule: ConditionalRule, data: Record<string, any>) => string;
/**
 * 20. Validates conditional rule syntax.
 *
 * @param {ConditionalRule} rule - Rule to validate
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateConditionalRule({
 *   fieldName: 'age',
 *   operator: 'greaterThan',
 *   value: 18,
 *   content: 'Adult content'
 * });
 * ```
 */
export declare const validateConditionalRule: (rule: ConditionalRule) => {
    valid: boolean;
    errors: string[];
};
/**
 * 21. Optimizes conditional rule evaluation order.
 *
 * @param {ConditionalRule[]} rules - Rules to optimize
 * @returns {ConditionalRule[]} Optimized rules
 *
 * @example
 * ```typescript
 * const optimized = optimizeConditionalRules(rules);
 * // Returns rules sorted by evaluation cost
 * ```
 */
export declare const optimizeConditionalRules: (rules: ConditionalRule[]) => ConditionalRule[];
/**
 * 22. Generates dynamic table from data array.
 *
 * @param {DynamicTableConfig} config - Table configuration
 * @returns {Promise<string>} Generated table HTML
 *
 * @example
 * ```typescript
 * const table = await generateDynamicTable({
 *   dataSource: [{ name: 'John', age: 30 }, { name: 'Jane', age: 25 }],
 *   columns: [
 *     { field: 'name', header: 'Name' },
 *     { field: 'age', header: 'Age' }
 *   ],
 *   showHeader: true
 * });
 * ```
 */
export declare const generateDynamicTable: (config: DynamicTableConfig) => Promise<string>;
/**
 * 23. Applies table styling and formatting.
 *
 * @param {string} tableHtml - Table HTML
 * @param {TableStyle} headerStyle - Header style
 * @param {TableStyle} rowStyle - Row style
 * @returns {string} Styled table HTML
 *
 * @example
 * ```typescript
 * const styled = applyTableStyling(tableHtml, {
 *   fontSize: 12,
 *   fontWeight: 'bold',
 *   backgroundColor: '#f0f0f0'
 * }, {
 *   fontSize: 10
 * });
 * ```
 */
export declare const applyTableStyling: (tableHtml: string, headerStyle: TableStyle, rowStyle: TableStyle) => string;
/**
 * 24. Sorts table data by column.
 *
 * @param {any[]} data - Table data
 * @param {string} column - Column to sort by
 * @param {'ASC' | 'DESC'} direction - Sort direction
 * @returns {any[]} Sorted data
 *
 * @example
 * ```typescript
 * const sorted = sortTableData(patients, 'lastName', 'ASC');
 * ```
 */
export declare const sortTableData: (data: any[], column: string, direction: "ASC" | "DESC") => any[];
/**
 * 25. Paginates table data.
 *
 * @param {any[]} data - Table data
 * @param {number} pageSize - Items per page
 * @param {number} pageNumber - Current page (1-indexed)
 * @returns {{ data: any[]; totalPages: number; currentPage: number }} Paginated result
 *
 * @example
 * ```typescript
 * const paginated = paginateTableData(patients, 10, 1);
 * // Returns first 10 patients
 * ```
 */
export declare const paginateTableData: (data: any[], pageSize: number, pageNumber: number) => {
    data: any[];
    totalPages: number;
    currentPage: number;
};
/**
 * 26. Applies alternating row styles.
 *
 * @param {string} tableHtml - Table HTML
 * @param {TableStyle} evenRowStyle - Even row style
 * @param {TableStyle} oddRowStyle - Odd row style
 * @returns {string} Styled table HTML
 *
 * @example
 * ```typescript
 * const striped = applyAlternatingRowStyles(tableHtml, {
 *   backgroundColor: '#f9f9f9'
 * }, {
 *   backgroundColor: '#ffffff'
 * });
 * ```
 */
export declare const applyAlternatingRowStyles: (tableHtml: string, evenRowStyle: TableStyle, oddRowStyle: TableStyle) => string;
/**
 * 27. Generates table footer with aggregations.
 *
 * @param {any[]} data - Table data
 * @param {TableColumn[]} columns - Column definitions
 * @returns {Record<string, any>} Footer data with aggregations
 *
 * @example
 * ```typescript
 * const footer = generateTableFooter(orders, [
 *   { field: 'total', header: 'Total', formula: { function: 'SUM', expression: 'total' } }
 * ]);
 * // Returns: { total: 1234.56 }
 * ```
 */
export declare const generateTableFooter: (data: any[], columns: TableColumn[]) => Record<string, any>;
/**
 * 28. Exports table to CSV format.
 *
 * @param {any[]} data - Table data
 * @param {TableColumn[]} columns - Column definitions
 * @returns {string} CSV string
 *
 * @example
 * ```typescript
 * const csv = exportTableToCSV(patients, columns);
 * // Returns: "Name,Age\nJohn,30\nJane,25"
 * ```
 */
export declare const exportTableToCSV: (data: any[], columns: TableColumn[]) => string;
/**
 * 29. Evaluates formula expression.
 *
 * @param {FormulaExpression} formula - Formula expression
 * @param {any[]} data - Data array for aggregation functions
 * @returns {any} Calculated result
 *
 * @example
 * ```typescript
 * const result = evaluateFormula({
 *   function: 'SUM',
 *   expression: 'total',
 *   arguments: [10, 20, 30]
 * }, []);
 * // Returns: 60
 * ```
 */
export declare const evaluateFormula: (formula: FormulaExpression, data: any[]) => any;
/**
 * 30. Parses formula string into expression.
 *
 * @param {string} formulaString - Formula string (e.g., 'SUM(amount)')
 * @returns {FormulaExpression} Parsed formula expression
 *
 * @example
 * ```typescript
 * const formula = parseFormulaString('AVG(scores)');
 * // Returns: { function: 'AVG', expression: 'AVG(scores)', arguments: ['scores'] }
 * ```
 */
export declare const parseFormulaString: (formulaString: string) => FormulaExpression;
/**
 * 31. Calculates aggregations for dataset.
 *
 * @param {any[]} data - Dataset
 * @param {string} field - Field to aggregate
 * @param {FormulaFunction} aggregation - Aggregation function
 * @returns {number} Aggregated value
 *
 * @example
 * ```typescript
 * const total = calculateAggregation(orders, 'amount', 'SUM');
 * ```
 */
export declare const calculateAggregation: (data: any[], field: string, aggregation: FormulaFunction) => number;
/**
 * 32. Applies formula to each table row.
 *
 * @param {any[]} data - Table data
 * @param {string} formulaString - Formula string
 * @returns {any[]} Data with calculated column
 *
 * @example
 * ```typescript
 * const withTotals = applyFormulaToRows(items, 'price * quantity');
 * ```
 */
export declare const applyFormulaToRows: (data: any[], formulaString: string) => any[];
/**
 * 33. Validates formula syntax.
 *
 * @param {string} formulaString - Formula string
 * @returns {{ valid: boolean; error?: string }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateFormulaSyntax('SUM(amount)');
 * ```
 */
export declare const validateFormulaSyntax: (formulaString: string) => {
    valid: boolean;
    error?: string;
};
/**
 * 34. Creates custom formula function.
 *
 * @param {string} name - Function name
 * @param {(...args: any[]) => any} implementation - Function implementation
 * @returns {FormulaFunction} Formula function
 *
 * @example
 * ```typescript
 * const customFunc = createCustomFormula('DISCOUNT', (price, rate) => {
 *   return price * (1 - rate);
 * });
 * ```
 */
export declare const createCustomFormula: (name: string, implementation: (...args: any[]) => any) => FormulaFunction;
/**
 * 35. Evaluates conditional formula (IF function).
 *
 * @param {boolean} condition - Condition to evaluate
 * @param {any} trueValue - Value if true
 * @param {any} falseValue - Value if false
 * @returns {any} Result value
 *
 * @example
 * ```typescript
 * const discount = evaluateConditionalFormula(
 *   total > 1000,
 *   total * 0.1,
 *   0
 * );
 * ```
 */
export declare const evaluateConditionalFormula: (condition: boolean, trueValue: any, falseValue: any) => any;
/**
 * 36. Creates new template version.
 *
 * @param {string} templateId - Template ID
 * @param {string} version - Version number
 * @param {string} createdBy - User ID
 * @param {string} [changelog] - Version changelog
 * @returns {Promise<TemplateVersion>} Version information
 *
 * @example
 * ```typescript
 * const version = await createTemplateVersion(
 *   'template-123',
 *   '2.0.0',
 *   'user-456',
 *   'Added new patient consent fields'
 * );
 * ```
 */
export declare const createTemplateVersion: (templateId: string, version: string, createdBy: string, changelog?: string) => Promise<TemplateVersion>;
/**
 * 37. Compares two template versions.
 *
 * @param {string} templateId - Template ID
 * @param {string} version1 - First version
 * @param {string} version2 - Second version
 * @returns {Promise<TemplateComparison>} Comparison result
 *
 * @example
 * ```typescript
 * const comparison = await compareTemplateVersions('template-123', '1.0.0', '2.0.0');
 * console.log('Breaking changes:', comparison.breakingChanges);
 * ```
 */
export declare const compareTemplateVersions: (templateId: string, version1: string, version2: string) => Promise<TemplateComparison>;
/**
 * 38. Rolls back to previous template version.
 *
 * @param {string} templateId - Template ID
 * @param {string} targetVersion - Version to roll back to
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await rollbackTemplateVersion('template-123', '1.5.0');
 * ```
 */
export declare const rollbackTemplateVersion: (templateId: string, targetVersion: string) => Promise<void>;
/**
 * 39. Deprecates template version.
 *
 * @param {string} templateId - Template ID
 * @param {string} version - Version to deprecate
 * @param {string} reason - Deprecation reason
 * @param {string} [migrationPath] - Migration instructions
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await deprecateTemplateVersion(
 *   'template-123',
 *   '1.0.0',
 *   'Security vulnerability fixed in 2.0.0',
 *   'Please upgrade to version 2.0.0'
 * );
 * ```
 */
export declare const deprecateTemplateVersion: (templateId: string, version: string, reason: string, migrationPath?: string) => Promise<void>;
/**
 * 40. Gets template version history.
 *
 * @param {string} templateId - Template ID
 * @returns {Promise<TemplateVersion[]>} Version history
 *
 * @example
 * ```typescript
 * const history = await getTemplateVersionHistory('template-123');
 * console.log(`${history.length} versions found`);
 * ```
 */
export declare const getTemplateVersionHistory: (templateId: string) => Promise<TemplateVersion[]>;
/**
 * 41. Merges template versions.
 *
 * @param {string} templateId - Template ID
 * @param {string[]} versions - Versions to merge
 * @param {string} createdBy - User ID
 * @returns {Promise<TemplateVersion>} Merged version
 *
 * @example
 * ```typescript
 * const merged = await mergeTemplateVersions(
 *   'template-123',
 *   ['1.5.0', '1.6.0'],
 *   'user-456'
 * );
 * ```
 */
export declare const mergeTemplateVersions: (templateId: string, versions: string[], createdBy: string) => Promise<TemplateVersion>;
/**
 * 42. Exports template version for backup.
 *
 * @param {string} templateId - Template ID
 * @param {string} version - Version to export
 * @returns {Promise<Buffer>} Exported template bundle
 *
 * @example
 * ```typescript
 * const bundle = await exportTemplateVersion('template-123', '1.0.0');
 * await fs.writeFile('template-backup.json', bundle);
 * ```
 */
export declare const exportTemplateVersion: (templateId: string, version: string) => Promise<Buffer>;
declare const _default: {
    createDocumentTemplateModel: (sequelize: Sequelize) => any;
    createMergeFieldModel: (sequelize: Sequelize) => any;
    createConditionalRuleModel: (sequelize: Sequelize) => any;
    createTemplate: (config: TemplateConfig, name: string, createdBy: string) => Promise<CompiledTemplate>;
    compileTemplate: (templateContent: string, format: TemplateFormat) => Promise<{
        compiled: any;
        errors: AssemblyError[];
    }>;
    extractMergeFields: (templateContent: string) => MergeFieldDefinition[];
    validateTemplateStructure: (templateContent: string, format: TemplateFormat) => Promise<{
        valid: boolean;
        errors: AssemblyError[];
    }>;
    cloneTemplate: (sourceTemplateId: string, newName: string, modifications?: Partial<TemplateConfig>) => Promise<CompiledTemplate>;
    createInheritedTemplate: (inheritance: TemplateInheritance, name: string) => Promise<CompiledTemplate>;
    importTemplate: (content: Buffer | string, sourceFormat: TemplateFormat, targetFormat: TemplateFormat) => Promise<CompiledTemplate>;
    registerMergeField: (templateId: string, field: MergeFieldDefinition) => Promise<string>;
    mapDataToFields: (data: Record<string, any>, fields: MergeFieldDefinition[]) => Promise<{
        mapped: Record<string, any>;
        errors: AssemblyError[];
    }>;
    validateFieldData: (fieldName: string, value: any, rule: ValidationRule) => Promise<{
        valid: boolean;
        error?: string;
    }>;
    transformFieldValue: (value: any, transform: TransformFunction, context?: any) => any;
    resolveFieldPath: (data: Record<string, any>, path: string) => any;
    createFieldMappingSchema: (mappings: FieldMapping[]) => Record<string, FieldMapping>;
    applyFieldMapping: (data: Record<string, any>, schema: Record<string, FieldMapping>) => Promise<Record<string, any>>;
    evaluateConditionalRule: (rule: ConditionalRule, data: Record<string, any>) => boolean;
    processNestedConditionals: (rules: ConditionalRule[], data: Record<string, any>) => boolean;
    renderConditionalContent: (rule: ConditionalRule, data: Record<string, any>) => string;
    createConditionalExpression: (expression: string, variables: Record<string, boolean>) => boolean;
    applyConditionalFormatting: (content: string, rule: ConditionalRule, data: Record<string, any>) => string;
    validateConditionalRule: (rule: ConditionalRule) => {
        valid: boolean;
        errors: string[];
    };
    optimizeConditionalRules: (rules: ConditionalRule[]) => ConditionalRule[];
    generateDynamicTable: (config: DynamicTableConfig) => Promise<string>;
    applyTableStyling: (tableHtml: string, headerStyle: TableStyle, rowStyle: TableStyle) => string;
    sortTableData: (data: any[], column: string, direction: "ASC" | "DESC") => any[];
    paginateTableData: (data: any[], pageSize: number, pageNumber: number) => {
        data: any[];
        totalPages: number;
        currentPage: number;
    };
    applyAlternatingRowStyles: (tableHtml: string, evenRowStyle: TableStyle, oddRowStyle: TableStyle) => string;
    generateTableFooter: (data: any[], columns: TableColumn[]) => Record<string, any>;
    exportTableToCSV: (data: any[], columns: TableColumn[]) => string;
    evaluateFormula: (formula: FormulaExpression, data: any[]) => any;
    parseFormulaString: (formulaString: string) => FormulaExpression;
    calculateAggregation: (data: any[], field: string, aggregation: FormulaFunction) => number;
    applyFormulaToRows: (data: any[], formulaString: string) => any[];
    validateFormulaSyntax: (formulaString: string) => {
        valid: boolean;
        error?: string;
    };
    createCustomFormula: (name: string, implementation: (...args: any[]) => any) => FormulaFunction;
    evaluateConditionalFormula: (condition: boolean, trueValue: any, falseValue: any) => any;
    createTemplateVersion: (templateId: string, version: string, createdBy: string, changelog?: string) => Promise<TemplateVersion>;
    compareTemplateVersions: (templateId: string, version1: string, version2: string) => Promise<TemplateComparison>;
    rollbackTemplateVersion: (templateId: string, targetVersion: string) => Promise<void>;
    deprecateTemplateVersion: (templateId: string, version: string, reason: string, migrationPath?: string) => Promise<void>;
    getTemplateVersionHistory: (templateId: string) => Promise<TemplateVersion[]>;
    mergeTemplateVersions: (templateId: string, versions: string[], createdBy: string) => Promise<TemplateVersion>;
    exportTemplateVersion: (templateId: string, version: string) => Promise<Buffer>;
};
export default _default;
//# sourceMappingURL=document-assembly-kit.d.ts.map