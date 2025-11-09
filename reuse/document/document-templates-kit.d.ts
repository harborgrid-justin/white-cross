/**
 * LOC: DOC-TPL-001
 * File: /reuse/document/document-templates-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize (v6.x)
 *   - handlebars
 *   - mustache
 *   - pdfkit
 *
 * DOWNSTREAM (imported by):
 *   - Document generation controllers
 *   - Template management services
 *   - Batch generation modules
 *   - Document rendering services
 */
/**
 * File: /reuse/document/document-templates-kit.ts
 * Locator: WC-UTL-DOCTPL-001
 * Purpose: Document Templates & Generation Kit - Comprehensive template utilities for NestJS
 *
 * Upstream: @nestjs/common, sequelize, handlebars, mustache, pdfkit, docx, marked, juice (CSS inlining)
 * Downstream: Template controllers, document generation services, batch processing, rendering modules
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, Handlebars 4.x, PDFKit 0.14.x
 * Exports: 40 utility functions for template creation, variable substitution, conditional content, batch generation, merge operations
 *
 * LLM Context: Production-grade document template utilities for White Cross healthcare platform.
 * Provides rich template engine with variable substitution, conditional rendering, loops, nested objects,
 * template libraries with categorization, versioning, sharing permissions, batch document generation,
 * multi-format export (PDF, DOCX, HTML), data source merging, preview rendering, HIPAA-compliant
 * template access control. Essential for generating clinical reports, patient letters, consent forms,
 * medical protocols, and automated healthcare documentation.
 */
import { Sequelize } from 'sequelize';
/**
 * Template category types
 */
export type TemplateCategory = 'clinical' | 'administrative' | 'financial' | 'legal' | 'communication' | 'forms';
/**
 * Template format types
 */
export type TemplateFormat = 'html' | 'markdown' | 'plaintext' | 'pdf' | 'docx' | 'custom';
/**
 * Template engine types
 */
export type TemplateEngine = 'handlebars' | 'mustache' | 'ejs' | 'pug' | 'custom';
/**
 * Variable data types
 */
export type VariableDataType = 'string' | 'number' | 'boolean' | 'date' | 'array' | 'object' | 'html';
/**
 * Template configuration
 */
export interface TemplateConfig {
    name: string;
    description?: string;
    category: TemplateCategory;
    format: TemplateFormat;
    engine: TemplateEngine;
    content: string;
    version?: number;
    isPublic?: boolean;
    tags?: string[];
    metadata?: Record<string, any>;
}
/**
 * Template variable definition
 */
export interface TemplateVariable {
    name: string;
    label: string;
    dataType: VariableDataType;
    required?: boolean;
    defaultValue?: any;
    description?: string;
    placeholder?: string;
    validation?: VariableValidation;
    format?: string;
    options?: Array<{
        value: any;
        label: string;
    }>;
}
/**
 * Variable validation rules
 */
export interface VariableValidation {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    custom?: (value: any) => boolean | string;
}
/**
 * Template section configuration
 */
export interface TemplateSection {
    id: string;
    name: string;
    content: string;
    order: number;
    conditional?: ConditionalExpression;
    repeatable?: boolean;
    repeatSource?: string;
}
/**
 * Conditional expression for template logic
 */
export interface ConditionalExpression {
    type: 'if' | 'unless' | 'switch';
    condition: string;
    operator?: 'equals' | 'notEquals' | 'greaterThan' | 'lessThan' | 'contains' | 'exists';
    value?: any;
    cases?: Array<{
        value: any;
        content: string;
    }>;
    defaultCase?: string;
}
/**
 * Loop configuration for repeating content
 */
export interface LoopConfig {
    source: string;
    itemVariable: string;
    indexVariable?: string;
    template: string;
    separator?: string;
    emptyMessage?: string;
}
/**
 * Template compilation options
 */
export interface CompilationOptions {
    strict?: boolean;
    noEscape?: boolean;
    helpers?: Record<string, Function>;
    partials?: Record<string, string>;
    data?: Record<string, any>;
}
/**
 * Template rendering context
 */
export interface RenderingContext {
    variables: Record<string, any>;
    user?: {
        id: string;
        name: string;
        role: string;
    };
    metadata?: Record<string, any>;
    timestamp?: Date;
}
/**
 * Batch generation job configuration
 */
export interface BatchGenerationJob {
    templateId: string;
    dataSource: DataSource;
    outputFormat: TemplateFormat;
    outputPath?: string;
    batchSize?: number;
    parallel?: boolean;
    options?: GenerationOptions;
}
/**
 * Data source configuration
 */
export interface DataSource {
    type: 'array' | 'database' | 'api' | 'csv' | 'json' | 'custom';
    config: Record<string, any>;
    mapping?: Record<string, string>;
    filters?: Array<{
        field: string;
        operator: string;
        value: any;
    }>;
}
/**
 * Document generation options
 */
export interface GenerationOptions {
    includeMetadata?: boolean;
    watermark?: string;
    header?: string;
    footer?: string;
    pageNumbers?: boolean;
    tableOfContents?: boolean;
    cssStyles?: string;
    pdfOptions?: PDFGenerationOptions;
}
/**
 * PDF generation options
 */
export interface PDFGenerationOptions {
    size?: 'A4' | 'Letter' | 'Legal';
    margin?: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
    orientation?: 'portrait' | 'landscape';
    compress?: boolean;
    encryption?: {
        userPassword?: string;
        ownerPassword?: string;
        permissions?: string[];
    };
}
/**
 * Template library configuration
 */
export interface TemplateLibrary {
    id: string;
    name: string;
    description?: string;
    category?: string;
    organizationId?: string;
    isPublic: boolean;
    templateIds: string[];
    permissions?: LibraryPermissions;
    metadata?: Record<string, any>;
}
/**
 * Library permissions
 */
export interface LibraryPermissions {
    viewers: string[];
    editors: string[];
    admins: string[];
    publicRead?: boolean;
    publicWrite?: boolean;
}
/**
 * Template sharing configuration
 */
export interface TemplateSharingConfig {
    templateId: string;
    sharedWith: string[];
    sharedRoles?: string[];
    permissions: SharePermission[];
    expiresAt?: Date;
    message?: string;
}
/**
 * Share permission types
 */
export type SharePermission = 'view' | 'use' | 'edit' | 'share' | 'delete';
/**
 * Template version info
 */
export interface TemplateVersion {
    versionId: string;
    templateId: string;
    version: number;
    content: string;
    variables: TemplateVariable[];
    createdBy: string;
    createdAt: Date;
    changeLog?: string;
    metadata?: Record<string, any>;
}
/**
 * Template preview options
 */
export interface PreviewOptions {
    sampleData?: Record<string, any>;
    format?: 'html' | 'pdf' | 'text';
    width?: number;
    height?: number;
    highlightVariables?: boolean;
}
/**
 * Merge field mapping
 */
export interface MergeFieldMapping {
    templateField: string;
    sourceField: string;
    transform?: (value: any) => any;
    defaultValue?: any;
    format?: string;
}
/**
 * Template validation result
 */
export interface TemplateValidationResult {
    valid: boolean;
    errors: TemplateValidationError[];
    warnings: string[];
    undefinedVariables?: string[];
}
/**
 * Template validation error
 */
export interface TemplateValidationError {
    type: 'syntax' | 'variable' | 'logic' | 'reference';
    message: string;
    line?: number;
    column?: number;
    context?: string;
}
/**
 * Template model attributes
 */
export interface TemplateAttributes {
    id: string;
    name: string;
    description?: string;
    category: TemplateCategory;
    format: TemplateFormat;
    engine: TemplateEngine;
    content: string;
    compiledContent?: string;
    variables: TemplateVariable[];
    version: number;
    isPublic: boolean;
    tags: string[];
    createdBy: string;
    organizationId?: string;
    usageCount: number;
    lastUsedAt?: Date;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * TemplateLibrary model attributes
 */
export interface TemplateLibraryAttributes {
    id: string;
    name: string;
    description?: string;
    category?: string;
    organizationId?: string;
    isPublic: boolean;
    createdBy: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates Template model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {any} Template model
 *
 * @example
 * ```typescript
 * const TemplateModel = createTemplateModel(sequelize);
 * const template = await TemplateModel.create({
 *   name: 'Patient Discharge Summary',
 *   category: 'clinical',
 *   format: 'html',
 *   engine: 'handlebars',
 *   content: '<h1>{{patientName}}</h1><p>{{dischargeNotes}}</p>',
 *   variables: [
 *     { name: 'patientName', label: 'Patient Name', dataType: 'string', required: true },
 *     { name: 'dischargeNotes', label: 'Discharge Notes', dataType: 'html', required: true }
 *   ],
 *   createdBy: 'user-uuid'
 * });
 * ```
 */
export declare const createTemplateModel: (sequelize: Sequelize) => any;
/**
 * Creates TemplateLibrary model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {any} TemplateLibrary model
 *
 * @example
 * ```typescript
 * const LibraryModel = createTemplateLibraryModel(sequelize);
 * const library = await LibraryModel.create({
 *   name: 'Clinical Document Templates',
 *   category: 'clinical',
 *   organizationId: 'org-uuid',
 *   isPublic: false,
 *   createdBy: 'user-uuid'
 * });
 * ```
 */
export declare const createTemplateLibraryModel: (sequelize: Sequelize) => any;
/**
 * Creates TemplateVersion model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {any} TemplateVersion model
 *
 * @example
 * ```typescript
 * const VersionModel = createTemplateVersionModel(sequelize);
 * const version = await VersionModel.create({
 *   templateId: 'template-uuid',
 *   version: 2,
 *   content: 'Updated template content',
 *   createdBy: 'user-uuid',
 *   changeLog: 'Added patient insurance information section'
 * });
 * ```
 */
export declare const createTemplateVersionModel: (sequelize: Sequelize) => any;
/**
 * 1. Creates a new document template.
 *
 * @param {TemplateConfig} config - Template configuration
 * @param {string} userId - User creating template
 * @returns {Promise<Partial<TemplateAttributes>>} Created template
 *
 * @example
 * ```typescript
 * const template = await createTemplate({
 *   name: 'Patient Consent Form',
 *   category: 'legal',
 *   format: 'html',
 *   engine: 'handlebars',
 *   content: '<h1>Consent Form</h1><p>{{patientName}} consents to {{procedureName}}</p>',
 *   tags: ['consent', 'patient', 'legal']
 * }, 'user-123');
 * ```
 */
export declare const createTemplate: (config: TemplateConfig, userId: string) => Promise<Partial<TemplateAttributes>>;
/**
 * 2. Updates an existing template.
 *
 * @param {string} templateId - Template ID to update
 * @param {Partial<TemplateConfig>} updates - Fields to update
 * @param {string} userId - User updating template
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateTemplate('template-123', {
 *   content: '<h1>Updated Consent Form</h1>...',
 *   tags: ['consent', 'patient', 'legal', 'updated']
 * }, 'user-456');
 * ```
 */
export declare const updateTemplate: (templateId: string, updates: Partial<TemplateConfig>, userId: string) => Promise<void>;
/**
 * 3. Duplicates a template.
 *
 * @param {string} templateId - Source template ID
 * @param {string} newName - Name for duplicated template
 * @param {string} userId - User creating duplicate
 * @returns {Promise<string>} New template ID
 *
 * @example
 * ```typescript
 * const newTemplateId = await duplicateTemplate('template-123', 'Copy of Patient Consent', 'user-456');
 * ```
 */
export declare const duplicateTemplate: (templateId: string, newName: string, userId: string) => Promise<string>;
/**
 * 4. Deletes a template.
 *
 * @param {string} templateId - Template ID to delete
 * @param {string} userId - User deleting template
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await deleteTemplate('template-123', 'user-456');
 * ```
 */
export declare const deleteTemplate: (templateId: string, userId: string) => Promise<void>;
/**
 * 5. Restores a deleted template.
 *
 * @param {string} templateId - Template ID to restore
 * @param {string} userId - User restoring template
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await restoreTemplate('template-123', 'user-456');
 * ```
 */
export declare const restoreTemplate: (templateId: string, userId: string) => Promise<void>;
/**
 * 6. Defines template variables.
 *
 * @param {string} templateId - Template ID
 * @param {TemplateVariable[]} variables - Variable definitions
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await defineTemplateVariables('template-123', [
 *   { name: 'patientName', label: 'Patient Name', dataType: 'string', required: true },
 *   { name: 'appointmentDate', label: 'Appointment Date', dataType: 'date', required: true, format: 'MM/DD/YYYY' }
 * ]);
 * ```
 */
export declare const defineTemplateVariables: (templateId: string, variables: TemplateVariable[]) => Promise<void>;
/**
 * 7. Substitutes variables in template content.
 *
 * @param {string} content - Template content
 * @param {Record<string, any>} variables - Variable values
 * @param {TemplateEngine} engine - Template engine to use
 * @returns {Promise<string>} Rendered content
 *
 * @example
 * ```typescript
 * const rendered = await substituteVariables(
 *   '<h1>{{patientName}}</h1><p>Appointment: {{appointmentDate}}</p>',
 *   { patientName: 'John Doe', appointmentDate: '01/15/2024' },
 *   'handlebars'
 * );
 * ```
 */
export declare const substituteVariables: (content: string, variables: Record<string, any>, engine: TemplateEngine) => Promise<string>;
/**
 * 8. Extracts variable placeholders from template.
 *
 * @param {string} content - Template content
 * @param {TemplateEngine} engine - Template engine
 * @returns {Promise<string[]>} Array of variable names
 *
 * @example
 * ```typescript
 * const variables = await extractPlaceholders(
 *   '<h1>{{patientName}}</h1><p>{{diagnosis}}</p>',
 *   'handlebars'
 * );
 * // Returns: ['patientName', 'diagnosis']
 * ```
 */
export declare const extractPlaceholders: (content: string, engine: TemplateEngine) => Promise<string[]>;
/**
 * 9. Validates variable values against definitions.
 *
 * @param {TemplateVariable[]} definitions - Variable definitions
 * @param {Record<string, any>} values - Provided values
 * @returns {Promise<{valid: boolean; errors: string[]}>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateVariableValues(templateVariables, {
 *   patientName: 'John Doe',
 *   age: 45
 * });
 * ```
 */
export declare const validateVariableValues: (definitions: TemplateVariable[], values: Record<string, any>) => Promise<{
    valid: boolean;
    errors: string[];
}>;
/**
 * 10. Applies default values to variables.
 *
 * @param {TemplateVariable[]} definitions - Variable definitions
 * @param {Record<string, any>} values - Provided values
 * @returns {Promise<Record<string, any>>} Values with defaults applied
 *
 * @example
 * ```typescript
 * const completeValues = await applyDefaultValues(templateVariables, {
 *   patientName: 'John Doe'
 * });
 * ```
 */
export declare const applyDefaultValues: (definitions: TemplateVariable[], values: Record<string, any>) => Promise<Record<string, any>>;
/**
 * 11. Formats variable value based on definition.
 *
 * @param {any} value - Variable value
 * @param {TemplateVariable} definition - Variable definition
 * @returns {Promise<string>} Formatted value
 *
 * @example
 * ```typescript
 * const formatted = await formatVariableValue(
 *   new Date('2024-01-15'),
 *   { name: 'appointmentDate', dataType: 'date', format: 'MM/DD/YYYY' }
 * );
 * ```
 */
export declare const formatVariableValue: (value: any, definition: TemplateVariable) => Promise<string>;
/**
 * 12. Evaluates conditional expression.
 *
 * @param {ConditionalExpression} expression - Conditional expression
 * @param {Record<string, any>} context - Evaluation context
 * @returns {Promise<boolean>} Evaluation result
 *
 * @example
 * ```typescript
 * const shouldRender = await evaluateConditional(
 *   { type: 'if', condition: 'age', operator: 'greaterThan', value: 18 },
 *   { age: 25 }
 * );
 * ```
 */
export declare const evaluateConditional: (expression: ConditionalExpression, context: Record<string, any>) => Promise<boolean>;
/**
 * 13. Renders conditional section.
 *
 * @param {TemplateSection} section - Template section
 * @param {Record<string, any>} context - Rendering context
 * @returns {Promise<string>} Rendered content or empty string
 *
 * @example
 * ```typescript
 * const content = await renderConditionalSection({
 *   id: 'insurance-section',
 *   name: 'Insurance Information',
 *   content: '<div>{{insuranceProvider}}</div>',
 *   conditional: { type: 'if', condition: 'hasInsurance', operator: 'equals', value: true }
 * }, { hasInsurance: true, insuranceProvider: 'Blue Cross' });
 * ```
 */
export declare const renderConditionalSection: (section: TemplateSection, context: Record<string, any>) => Promise<string>;
/**
 * 14. Processes loop in template.
 *
 * @param {LoopConfig} config - Loop configuration
 * @param {Record<string, any>} context - Rendering context
 * @returns {Promise<string>} Rendered loop content
 *
 * @example
 * ```typescript
 * const medications = await processLoop({
 *   source: 'medications',
 *   itemVariable: 'medication',
 *   indexVariable: 'index',
 *   template: '<li>{{index}}. {{medication.name}} - {{medication.dosage}}</li>',
 *   separator: '\n'
 * }, { medications: [{ name: 'Aspirin', dosage: '100mg' }, { name: 'Insulin', dosage: '10 units' }] });
 * ```
 */
export declare const processLoop: (config: LoopConfig, context: Record<string, any>) => Promise<string>;
/**
 * 15. Renders nested template structure.
 *
 * @param {string} content - Template content
 * @param {Record<string, any>} context - Nested context object
 * @param {TemplateEngine} engine - Template engine
 * @returns {Promise<string>} Rendered content
 *
 * @example
 * ```typescript
 * const rendered = await renderNestedTemplate(
 *   '<h1>{{patient.name}}</h1><p>{{patient.address.street}}, {{patient.address.city}}</p>',
 *   { patient: { name: 'John Doe', address: { street: '123 Main St', city: 'Boston' } } },
 *   'handlebars'
 * );
 * ```
 */
export declare const renderNestedTemplate: (content: string, context: Record<string, any>, engine: TemplateEngine) => Promise<string>;
/**
 * 16. Compiles template with custom helpers.
 *
 * @param {string} content - Template content
 * @param {Record<string, Function>} helpers - Custom helper functions
 * @param {TemplateEngine} engine - Template engine
 * @returns {Promise<Function>} Compiled template function
 *
 * @example
 * ```typescript
 * const compiled = await compileTemplateWithHelpers(
 *   '<p>{{formatDate appointmentDate}}</p>',
 *   {
 *     formatDate: (date) => new Date(date).toLocaleDateString()
 *   },
 *   'handlebars'
 * );
 * ```
 */
export declare const compileTemplateWithHelpers: (content: string, helpers: Record<string, Function>, engine: TemplateEngine) => Promise<Function>;
/**
 * 17. Creates a template library.
 *
 * @param {string} name - Library name
 * @param {string} userId - User creating library
 * @param {Partial<TemplateLibrary>} config - Library configuration
 * @returns {Promise<string>} Created library ID
 *
 * @example
 * ```typescript
 * const libraryId = await createTemplateLibrary(
 *   'Clinical Templates',
 *   'user-123',
 *   { category: 'clinical', isPublic: false }
 * );
 * ```
 */
export declare const createTemplateLibrary: (name: string, userId: string, config?: Partial<TemplateLibrary>) => Promise<string>;
/**
 * 18. Adds template to library.
 *
 * @param {string} libraryId - Library ID
 * @param {string} templateId - Template ID to add
 * @param {string} userId - User adding template
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await addTemplateToLibrary('library-123', 'template-456', 'user-789');
 * ```
 */
export declare const addTemplateToLibrary: (libraryId: string, templateId: string, userId: string) => Promise<void>;
/**
 * 19. Removes template from library.
 *
 * @param {string} libraryId - Library ID
 * @param {string} templateId - Template ID to remove
 * @param {string} userId - User removing template
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await removeTemplateFromLibrary('library-123', 'template-456', 'user-789');
 * ```
 */
export declare const removeTemplateFromLibrary: (libraryId: string, templateId: string, userId: string) => Promise<void>;
/**
 * 20. Shares template with users/roles.
 *
 * @param {TemplateSharingConfig} config - Sharing configuration
 * @param {string} userId - User sharing template
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await shareTemplate({
 *   templateId: 'template-123',
 *   sharedWith: ['user-456', 'user-789'],
 *   sharedRoles: ['doctor', 'nurse'],
 *   permissions: ['view', 'use'],
 *   expiresAt: new Date('2024-12-31')
 * }, 'user-111');
 * ```
 */
export declare const shareTemplate: (config: TemplateSharingConfig, userId: string) => Promise<void>;
/**
 * 21. Revokes template sharing.
 *
 * @param {string} templateId - Template ID
 * @param {string[]} userIds - User IDs to revoke access
 * @param {string} userId - User revoking access
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await revokeTemplateSharing('template-123', ['user-456'], 'user-111');
 * ```
 */
export declare const revokeTemplateSharing: (templateId: string, userIds: string[], userId: string) => Promise<void>;
/**
 * 22. Checks template access permissions.
 *
 * @param {string} templateId - Template ID
 * @param {string} userId - User ID to check
 * @param {SharePermission} permission - Required permission
 * @returns {Promise<boolean>} True if user has permission
 *
 * @example
 * ```typescript
 * const canEdit = await checkTemplatePermission('template-123', 'user-456', 'edit');
 * ```
 */
export declare const checkTemplatePermission: (templateId: string, userId: string, permission: SharePermission) => Promise<boolean>;
/**
 * 23. Generates documents in batch from template.
 *
 * @param {BatchGenerationJob} job - Batch generation job configuration
 * @returns {Promise<{success: number; failed: number; results: Array<{id: string; path: string}>}>} Generation results
 *
 * @example
 * ```typescript
 * const results = await generateBatchDocuments({
 *   templateId: 'template-123',
 *   dataSource: {
 *     type: 'array',
 *     config: {
 *       data: [
 *         { patientName: 'John Doe', appointmentDate: '01/15/2024' },
 *         { patientName: 'Jane Smith', appointmentDate: '01/16/2024' }
 *       ]
 *     }
 *   },
 *   outputFormat: 'pdf',
 *   outputPath: '/generated-docs',
 *   batchSize: 10
 * });
 * ```
 */
export declare const generateBatchDocuments: (job: BatchGenerationJob) => Promise<{
    success: number;
    failed: number;
    results: Array<{
        id: string;
        path: string;
    }>;
}>;
/**
 * 24. Merges data from multiple sources.
 *
 * @param {DataSource[]} sources - Data sources to merge
 * @param {MergeFieldMapping[]} mappings - Field mappings
 * @returns {Promise<Array<Record<string, any>>>} Merged data records
 *
 * @example
 * ```typescript
 * const mergedData = await mergeDataSources(
 *   [
 *     { type: 'database', config: { table: 'patients', fields: ['name', 'dob'] } },
 *     { type: 'api', config: { endpoint: '/appointments', fields: ['date', 'doctor'] } }
 *   ],
 *   [
 *     { templateField: 'patientName', sourceField: 'name' },
 *     { templateField: 'appointmentDate', sourceField: 'date', format: 'MM/DD/YYYY' }
 *   ]
 * );
 * ```
 */
export declare const mergeDataSources: (sources: DataSource[], mappings: MergeFieldMapping[]) => Promise<Array<Record<string, any>>>;
/**
 * 25. Fetches data from configured source.
 *
 * @param {DataSource} source - Data source configuration
 * @returns {Promise<Array<Record<string, any>>>} Fetched data
 *
 * @example
 * ```typescript
 * const data = await fetchDataFromSource({
 *   type: 'database',
 *   config: { table: 'patients', where: { active: true } },
 *   filters: [{ field: 'age', operator: '>', value: 18 }]
 * });
 * ```
 */
export declare const fetchDataFromSource: (source: DataSource) => Promise<Array<Record<string, any>>>;
/**
 * 26. Applies field mappings to data.
 *
 * @param {Array<Record<string, any>>} data - Source data
 * @param {MergeFieldMapping[]} mappings - Field mappings
 * @returns {Promise<Array<Record<string, any>>>} Mapped data
 *
 * @example
 * ```typescript
 * const mapped = await applyFieldMappings(sourceData, [
 *   { templateField: 'fullName', sourceField: 'name', transform: (v) => v.toUpperCase() },
 *   { templateField: 'age', sourceField: 'birthDate', transform: calculateAge }
 * ]);
 * ```
 */
export declare const applyFieldMappings: (data: Array<Record<string, any>>, mappings: MergeFieldMapping[]) => Promise<Array<Record<string, any>>>;
/**
 * 27. Filters data based on criteria.
 *
 * @param {Array<Record<string, any>>} data - Data to filter
 * @param {Array<{field: string; operator: string; value: any}>} filters - Filter criteria
 * @returns {Promise<Array<Record<string, any>>>} Filtered data
 *
 * @example
 * ```typescript
 * const filtered = await filterData(allPatients, [
 *   { field: 'age', operator: '>', value: 18 },
 *   { field: 'status', operator: '=', value: 'active' }
 * ]);
 * ```
 */
export declare const filterData: (data: Array<Record<string, any>>, filters: Array<{
    field: string;
    operator: string;
    value: any;
}>) => Promise<Array<Record<string, any>>>;
/**
 * 28. Validates template syntax and structure.
 *
 * @param {string} content - Template content
 * @param {TemplateEngine} engine - Template engine
 * @param {TemplateVariable[]} [variables] - Expected variables
 * @returns {Promise<TemplateValidationResult>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateTemplate(
 *   '<h1>{{patientName}}</h1><p>{{diagnosis}}</p>',
 *   'handlebars',
 *   [{ name: 'patientName', dataType: 'string', required: true }]
 * );
 * ```
 */
export declare const validateTemplate: (content: string, engine: TemplateEngine, variables?: TemplateVariable[]) => Promise<TemplateValidationResult>;
/**
 * 29. Generates template preview.
 *
 * @param {string} templateId - Template ID
 * @param {PreviewOptions} options - Preview options
 * @returns {Promise<string>} Preview content
 *
 * @example
 * ```typescript
 * const preview = await generateTemplatePreview('template-123', {
 *   sampleData: { patientName: 'Sample Patient', diagnosis: 'Sample Diagnosis' },
 *   format: 'html',
 *   highlightVariables: true
 * });
 * ```
 */
export declare const generateTemplatePreview: (templateId: string, options: PreviewOptions) => Promise<string>;
/**
 * 30. Tests template with sample data.
 *
 * @param {string} templateId - Template ID
 * @param {Record<string, any>} testData - Test data
 * @returns {Promise<{rendered: string; errors: string[]}>} Test result
 *
 * @example
 * ```typescript
 * const test = await testTemplate('template-123', {
 *   patientName: 'Test Patient',
 *   appointmentDate: '01/15/2024'
 * });
 * ```
 */
export declare const testTemplate: (templateId: string, testData: Record<string, any>) => Promise<{
    rendered: string;
    errors: string[];
}>;
/**
 * 31. Generates document from template.
 *
 * @param {string} templateId - Template ID
 * @param {Record<string, any>} data - Template data
 * @param {GenerationOptions} [options] - Generation options
 * @returns {Promise<{content: string | Buffer; format: TemplateFormat}>} Generated document
 *
 * @example
 * ```typescript
 * const document = await generateDocument('template-123', {
 *   patientName: 'John Doe',
 *   diagnosis: 'Hypertension'
 * }, {
 *   includeMetadata: true,
 *   watermark: 'CONFIDENTIAL'
 * });
 * ```
 */
export declare const generateDocument: (templateId: string, data: Record<string, any>, options?: GenerationOptions) => Promise<{
    content: string | Buffer;
    format: TemplateFormat;
}>;
/**
 * 32. Exports document as PDF.
 *
 * @param {string} htmlContent - HTML content
 * @param {PDFGenerationOptions} [options] - PDF options
 * @returns {Promise<Buffer>} PDF buffer
 *
 * @example
 * ```typescript
 * const pdf = await exportAsPDF(htmlContent, {
 *   size: 'A4',
 *   margin: { top: 50, right: 50, bottom: 50, left: 50 },
 *   orientation: 'portrait'
 * });
 * ```
 */
export declare const exportAsPDF: (htmlContent: string, options?: PDFGenerationOptions) => Promise<Buffer>;
/**
 * 33. Exports document as DOCX.
 *
 * @param {string} htmlContent - HTML content
 * @returns {Promise<Buffer>} DOCX buffer
 *
 * @example
 * ```typescript
 * const docx = await exportAsDOCX(htmlContent);
 * fs.writeFileSync('document.docx', docx);
 * ```
 */
export declare const exportAsDOCX: (htmlContent: string) => Promise<Buffer>;
/**
 * 34. Exports document as HTML with inline CSS.
 *
 * @param {string} htmlContent - HTML content
 * @param {string} [cssStyles] - CSS styles to inline
 * @returns {Promise<string>} HTML with inline CSS
 *
 * @example
 * ```typescript
 * const inlinedHtml = await exportAsHTML(content, 'body { font-family: Arial; }');
 * ```
 */
export declare const exportAsHTML: (htmlContent: string, cssStyles?: string) => Promise<string>;
/**
 * 35. Adds watermark to document.
 *
 * @param {string | Buffer} content - Document content
 * @param {string} watermarkText - Watermark text
 * @param {TemplateFormat} format - Document format
 * @returns {Promise<string | Buffer>} Document with watermark
 *
 * @example
 * ```typescript
 * const watermarked = await addWatermark(pdfBuffer, 'CONFIDENTIAL', 'pdf');
 * ```
 */
export declare const addWatermark: (content: string | Buffer, watermarkText: string, format: TemplateFormat) => Promise<string | Buffer>;
/**
 * 36. Adds header and footer to document.
 *
 * @param {string} content - Document content
 * @param {string} [header] - Header content
 * @param {string} [footer] - Footer content
 * @returns {Promise<string>} Document with header/footer
 *
 * @example
 * ```typescript
 * const withHeaderFooter = await addHeaderFooter(
 *   content,
 *   '<div>Hospital Name</div>',
 *   '<div>Page {{page}} of {{totalPages}}</div>'
 * );
 * ```
 */
export declare const addHeaderFooter: (content: string, header?: string, footer?: string) => Promise<string>;
/**
 * 37. Creates new template version.
 *
 * @param {string} templateId - Template ID
 * @param {string} userId - User creating version
 * @param {string} [changeLog] - Change description
 * @returns {Promise<number>} New version number
 *
 * @example
 * ```typescript
 * const version = await createTemplateVersion('template-123', 'user-456', 'Added insurance section');
 * ```
 */
export declare const createTemplateVersion: (templateId: string, userId: string, changeLog?: string) => Promise<number>;
/**
 * 38. Retrieves specific template version.
 *
 * @param {string} templateId - Template ID
 * @param {number} version - Version number
 * @returns {Promise<TemplateVersion>} Template version
 *
 * @example
 * ```typescript
 * const oldVersion = await getTemplateVersion('template-123', 1);
 * ```
 */
export declare const getTemplateVersion: (templateId: string, version: number) => Promise<Partial<TemplateVersion>>;
/**
 * 39. Compares two template versions.
 *
 * @param {string} templateId - Template ID
 * @param {number} version1 - First version number
 * @param {number} version2 - Second version number
 * @returns {Promise<{additions: string[]; deletions: string[]; changes: string[]}>} Comparison result
 *
 * @example
 * ```typescript
 * const diff = await compareTemplateVersions('template-123', 1, 2);
 * console.log('Changes:', diff.changes);
 * ```
 */
export declare const compareTemplateVersions: (templateId: string, version1: number, version2: number) => Promise<{
    additions: string[];
    deletions: string[];
    changes: string[];
}>;
/**
 * 40. Restores template to specific version.
 *
 * @param {string} templateId - Template ID
 * @param {number} version - Version to restore
 * @param {string} userId - User performing restore
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await restoreTemplateVersion('template-123', 2, 'user-456');
 * ```
 */
export declare const restoreTemplateVersion: (templateId: string, version: number, userId: string) => Promise<void>;
declare const _default: {
    createTemplate: (config: TemplateConfig, userId: string) => Promise<Partial<TemplateAttributes>>;
    updateTemplate: (templateId: string, updates: Partial<TemplateConfig>, userId: string) => Promise<void>;
    duplicateTemplate: (templateId: string, newName: string, userId: string) => Promise<string>;
    deleteTemplate: (templateId: string, userId: string) => Promise<void>;
    restoreTemplate: (templateId: string, userId: string) => Promise<void>;
    defineTemplateVariables: (templateId: string, variables: TemplateVariable[]) => Promise<void>;
    substituteVariables: (content: string, variables: Record<string, any>, engine: TemplateEngine) => Promise<string>;
    extractPlaceholders: (content: string, engine: TemplateEngine) => Promise<string[]>;
    validateVariableValues: (definitions: TemplateVariable[], values: Record<string, any>) => Promise<{
        valid: boolean;
        errors: string[];
    }>;
    applyDefaultValues: (definitions: TemplateVariable[], values: Record<string, any>) => Promise<Record<string, any>>;
    formatVariableValue: (value: any, definition: TemplateVariable) => Promise<string>;
    evaluateConditional: (expression: ConditionalExpression, context: Record<string, any>) => Promise<boolean>;
    renderConditionalSection: (section: TemplateSection, context: Record<string, any>) => Promise<string>;
    processLoop: (config: LoopConfig, context: Record<string, any>) => Promise<string>;
    renderNestedTemplate: (content: string, context: Record<string, any>, engine: TemplateEngine) => Promise<string>;
    compileTemplateWithHelpers: (content: string, helpers: Record<string, Function>, engine: TemplateEngine) => Promise<Function>;
    createTemplateLibrary: (name: string, userId: string, config?: Partial<TemplateLibrary>) => Promise<string>;
    addTemplateToLibrary: (libraryId: string, templateId: string, userId: string) => Promise<void>;
    removeTemplateFromLibrary: (libraryId: string, templateId: string, userId: string) => Promise<void>;
    shareTemplate: (config: TemplateSharingConfig, userId: string) => Promise<void>;
    revokeTemplateSharing: (templateId: string, userIds: string[], userId: string) => Promise<void>;
    checkTemplatePermission: (templateId: string, userId: string, permission: SharePermission) => Promise<boolean>;
    generateBatchDocuments: (job: BatchGenerationJob) => Promise<{
        success: number;
        failed: number;
        results: Array<{
            id: string;
            path: string;
        }>;
    }>;
    mergeDataSources: (sources: DataSource[], mappings: MergeFieldMapping[]) => Promise<Array<Record<string, any>>>;
    fetchDataFromSource: (source: DataSource) => Promise<Array<Record<string, any>>>;
    applyFieldMappings: (data: Array<Record<string, any>>, mappings: MergeFieldMapping[]) => Promise<Array<Record<string, any>>>;
    filterData: (data: Array<Record<string, any>>, filters: Array<{
        field: string;
        operator: string;
        value: any;
    }>) => Promise<Array<Record<string, any>>>;
    validateTemplate: (content: string, engine: TemplateEngine, variables?: TemplateVariable[]) => Promise<TemplateValidationResult>;
    generateTemplatePreview: (templateId: string, options: PreviewOptions) => Promise<string>;
    testTemplate: (templateId: string, testData: Record<string, any>) => Promise<{
        rendered: string;
        errors: string[];
    }>;
    generateDocument: (templateId: string, data: Record<string, any>, options?: GenerationOptions) => Promise<{
        content: string | Buffer;
        format: TemplateFormat;
    }>;
    exportAsPDF: (htmlContent: string, options?: PDFGenerationOptions) => Promise<Buffer>;
    exportAsDOCX: (htmlContent: string) => Promise<Buffer>;
    exportAsHTML: (htmlContent: string, cssStyles?: string) => Promise<string>;
    addWatermark: (content: string | Buffer, watermarkText: string, format: TemplateFormat) => Promise<string | Buffer>;
    addHeaderFooter: (content: string, header?: string, footer?: string) => Promise<string>;
    createTemplateVersion: (templateId: string, userId: string, changeLog?: string) => Promise<number>;
    getTemplateVersion: (templateId: string, version: number) => Promise<Partial<TemplateVersion>>;
    compareTemplateVersions: (templateId: string, version1: number, version2: number) => Promise<{
        additions: string[];
        deletions: string[];
        changes: string[];
    }>;
    restoreTemplateVersion: (templateId: string, version: number, userId: string) => Promise<void>;
    createTemplateModel: (sequelize: Sequelize) => any;
    createTemplateLibraryModel: (sequelize: Sequelize) => any;
    createTemplateVersionModel: (sequelize: Sequelize) => any;
};
export default _default;
//# sourceMappingURL=document-templates-kit.d.ts.map